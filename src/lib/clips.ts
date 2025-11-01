import {
  collection,
  doc,
  Firestore,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Clip {
  url: string;
  title?: string;
  agentNick: string;
  agentId: string;
  date: string;
  tags: string[];
}

export const getAllClips = async (): Promise<Clip[]> => {
  const clipsCollectionRef = collection(db as Firestore, "clips");
  try {
    const querySnapshot = await getDocs(clipsCollectionRef);
    const clipsList = querySnapshot.docs.map((doc) => {
      return doc.data() as Clip;
    });
    return clipsList;
  } catch (e) {
    console.error("❌ Erro ao buscar TODOS os clips:", e);
    return [];
  }
};

export const sendClip = async (clipData: Clip): Promise<void> => {
  const clipsCollectionRef = collection(db as Firestore, "clips");
  const newClipRef = doc(clipsCollectionRef);
  try {
    await setDoc(newClipRef, clipData);
    console.log(
      `Clip enviado e salvo com sucesso. Autor: ${clipData.agentNick}.`
    );
  } catch (e) {
    console.error(`❌ Erro ao enviar clip para a coleção 'clips':`, e);
    throw new Error("Falha ao salvar o clip no Firestore.");
  }
};
