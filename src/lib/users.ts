/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  runTransaction,
  setDoc,
  Firestore,
  query,
  where,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Agent,
  AgentLogin,
  AuthAgent,
  AuthAgentWithDocId,
} from "@/data/agents";

const getUTCDate = (date: Date) => {
  const d = new Date(date);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

export const createAgent = async (
  agentId: string,
  agentData: Agent
): Promise<void> => {
  const userRef = doc(db, "users", agentId);
  await setDoc(userRef, agentData);
};

interface getAllAgentsProps {
  tester?: boolean;
}

export const getAgentDocumentReference = async (
  agentId: string
): Promise<any | null> => {
  const usersCollectionRef = collection(db as Firestore, "users");
  const q = query(usersCollectionRef, where("id", "==", agentId));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].ref;
    }
    return null;
  } catch (e) {
    console.error(`Erro ao buscar referência do agente (ID: ${agentId}):`, e);
    return null;
  }
};

export const findAgentByCredentials = async (
  discordTag: string,
  password: string
): Promise<AuthAgent | null> => {
  const usersCollectionRef = collection(db as Firestore, "users");

  const q = query(
    usersCollectionRef,
    where("discordTag", "==", discordTag),
    where("password", "==", password)
  );

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0];
      const data = docSnapshot.data() as AuthAgent;

      return {
        ...data,
        docId: docSnapshot.id,
      } as AuthAgentWithDocId;
    }

    return null;
  } catch (e) {
    console.error("Erro ao buscar agente por credenciais:", e);
    return null;
  }
};

export const getAgentAuthData = async (
  agentId: string
): Promise<AuthAgent | null> => {
  const usersCollectionRef = collection(db as Firestore, "users");
  const q = query(usersCollectionRef, where("id", "==", agentId));

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as AuthAgent;
    } else {
      return null;
    }
  } catch (e) {
    console.error("Erro ao buscar dados do agente (Auth):", e);
    return null;
  }
};

export const getAgentById = async (agentId: string): Promise<Agent | null> => {
  const usersCollectionRef = collection(db as Firestore, "users");
  const q = query(usersCollectionRef, where("id", "==", agentId));

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data() as AuthAgent;
      const { password, ...publicAgentData } = data;
      return publicAgentData as Agent;
    } else {
      return null;
    }
  } catch (e) {
    console.error("Erro ao buscar agente por ID:", e);
    return null;
  }
};

export const getAllAgents = async ({
  tester,
}: getAllAgentsProps): Promise<Agent[]> => {
  const usersCollectionRef = collection(db as Firestore, "users");
  try {
    const querySnapshot = await getDocs(usersCollectionRef);
    const agentsList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as AuthAgent;
      const { password, ...publicAgentData } = data;
      return publicAgentData as Agent;
    });
    if (tester) {
      return agentsList as Agent[];
    }
    return agentsList.filter((agent) => agent.id !== "000");
  } catch (e) {
    console.error("❌ Erro ao buscar TODOS os agentes:", e);
    return [];
  }
};

export const adjustScore = async (
  userId: string,
  amount: number
): Promise<void> => {
  const userRef = await getAgentDocumentReference(userId);

  if (!userRef) {
    console.error(
      `❌ Agente com ID ${userId} não encontrado para ajustar score.`
    );
    return;
  }

  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        throw new Error(`Usuário ${userId} não encontrado.`);
      }
      const agent = userDoc.data() as Agent;
      const currentScore = agent.score || 0;
      const newScore = currentScore + amount;

      if (newScore < 0) {
        throw new Error(
          `O score não pode ser negativo. O valor atual é ${currentScore}.`
        );
      }
      transaction.update(userRef, {
        score: newScore,
        lastUpdate: new Date(),
      });

      console.log(
        `Score de ${userId} ajustado em ${amount}. Novo score: ${newScore}`
      );
    });
  } catch (e) {
    console.error("Erro ao ajustar o score:", e);
  }
};

export const addEmblem = async (
  userId: string,
  emblemId: string
): Promise<void> => {
  const userRef = await getAgentDocumentReference(userId);

  if (!userRef) {
    console.error(
      `❌ Agente com ID ${userId} não encontrado para adicionar emblema.`
    );
    return;
  }

  try {
    await updateDoc(userRef, {
      emblems: arrayUnion(emblemId),
      lastUpdate: new Date(),
    });
    console.log(`Emblema ${emblemId} adicionado a ${userId}.`);
  } catch (e) {
    console.error("Erro ao adicionar emblema:", e);
  }
};

export const removeEmblem = async (
  userId: string,
  emblemId: string
): Promise<void> => {
  const userRef = await getAgentDocumentReference(userId);

  if (!userRef) {
    console.error(
      `❌ Agente com ID ${userId} não encontrado para remover emblema.`
    );
    return;
  }

  try {
    await updateDoc(userRef, {
      emblems: arrayRemove(emblemId),
      lastUpdate: new Date(),
    });
    console.log(`Emblema ${emblemId} removido de ${userId}.`);
  } catch (e) {
    console.error("Erro ao remover emblema:", e);
  }
};

export const openBoxTransaction = async (
  userId: string,
  boxId: string,
  emblemId: string
): Promise<void> => {
  const userRef = await getAgentDocumentReference(userId);

  if (!userRef) {
    console.error(
      `❌ Agente com ID ${userId} não encontrado para transação de caixa.`
    );
    throw new Error("Agente não encontrado.");
  }
  const SCORE_GAIN = 5;

  try {
    await updateDoc(userRef, {
      openBoxes: arrayUnion(boxId),
      emblems: arrayUnion(emblemId),
      score: increment(SCORE_GAIN),
      lastUpdate: new Date(),
    });

    console.log(
      `Transação de caixa (${boxId}) e emblema (${emblemId}) concluída para ${userId}.`
    );
  } catch (e) {
    console.error("Erro na transação de abertura de caixa:", e);
    throw new Error("Falha na transação do Firestore.");
  }
};

export const updateLoginDay = async (agentId: string): Promise<void> => {
  const userRef = await getAgentDocumentReference(agentId);

  if (!userRef) {
    console.error(
      `❌ Agente com ID ${agentId} não encontrado para atualização de login.`
    );
    return;
  }

  const today = new Date();
  const todayUTCDate = getUTCDate(today);

  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        throw new Error(`Usuário ${agentId} não encontrado.`);
      }

      const agent = userDoc.data() as Agent;
      const currentLogin: AgentLogin = agent.login || {
        lastDateLogin: "",
        totalDays: 0,
        currentStreakDays: 0,
        maxStreakDays: 0,
      };

      const lastDateLogin = currentLogin.lastDateLogin
        ? getUTCDate(new Date(currentLogin.lastDateLogin))
        : null;

      if (lastDateLogin && lastDateLogin.getTime() === todayUTCDate.getTime()) {
        return;
      }

      const newTotalDays = currentLogin.totalDays + 1;
      let newCurrentStreak = currentLogin.currentStreakDays + 1;
      let newMaxStreak = currentLogin.maxStreakDays;

      const yesterdayUTCDate = new Date(todayUTCDate);
      yesterdayUTCDate.setDate(todayUTCDate.getDate() - 1);

      if (lastDateLogin) {
        if (lastDateLogin.getTime() < yesterdayUTCDate.getTime()) {
          newCurrentStreak = 1;
          console.log(`[STREAK QUEBRADA] Agente ${agentId}.`);
        }
      }

      if (newCurrentStreak > newMaxStreak) {
        newMaxStreak = newCurrentStreak;
      }

      const updatedLoginData: AgentLogin = {
        lastDateLogin: today.toISOString(),
        totalDays: newTotalDays,
        currentStreakDays: newCurrentStreak,
        maxStreakDays: newMaxStreak,
      };

      transaction.update(userRef, {
        login: updatedLoginData,
        lastUpdate: new Date(),
      });

      console.log(
        `Login de ${agentId} atualizado. Streak atual: ${newCurrentStreak}, Máximo: ${newMaxStreak}, Total Dias: ${newTotalDays}.`
      );
    });
  } catch (e) {
    console.error(`Erro na transação updateLoginDay para ${agentId}:`, e);
  }
};

export const updateAgentEmblemsSelected = async (
  userId: string,
  emblemsList: string[]
): Promise<void> => {
  const userRef = await getAgentDocumentReference(userId);

  if (!userRef) {
    console.error(`❌ Agente com ID ${userId} não encontrado.`);
    throw new Error("Agente não encontrado.");
  }

  try {
    await updateDoc(userRef, {
      emblemsSelected: emblemsList,
      lastUpdate: new Date(),
    });
    console.log(`Lista de emblemas selecionados atualizada para ${userId}.`);
  } catch (e) {
    console.error("Erro ao atualizar emblemas selecionados:", e);
    throw new Error("Falha ao salvar a lista de emblemas.");
  }
};
