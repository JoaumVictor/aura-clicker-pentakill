import {
  collection,
  addDoc,
  QuerySnapshot,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

export interface AuditLogOptimized {
  timestamp: Date;
  userId: string;
  userNick: string;
  action: string;
  item?: string;
  result: string;
}
export interface AuditLogEntry extends AuditLogOptimized {
  id: string;
}

export const getRecentLogs = async (
  logLimit: number = 50
): Promise<AuditLogEntry[]> => {
  const logsCollectionRef = collection(db, "logs");

  try {
    const q = query(
      logsCollectionRef,
      orderBy("timestamp", "desc"),
      limit(logLimit)
    );

    const querySnapshot: QuerySnapshot = await getDocs(q);

    const logsList: AuditLogEntry[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as AuditLogOptimized),
      timestamp: doc.data().timestamp?.toDate
        ? doc.data().timestamp.toDate()
        : doc.data().timestamp,
    }));

    return logsList;
  } catch (e) {
    console.error("❌ Erro ao buscar logs recentes:", e);
    return [];
  }
};

export const logAuditActionOptimized = async (
  logData: Omit<AuditLogOptimized, "timestamp">
) => {
  try {
    if (logData.userId === "000") return;

    const logsCollectionRef = collection(db, "logs");

    await addDoc(logsCollectionRef, {
      ...logData,
      timestamp: new Date(),
    });
  } catch (e) {
    console.error("Erro ao salvar o log de auditoria otimizado:", e);
  }
};
