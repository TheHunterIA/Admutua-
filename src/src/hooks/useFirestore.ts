import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  QueryConstraint,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  
  if (errorMessage.includes('Quota limit exceeded') || errorMessage.includes('Quota exceeded')) {
    // Do not throw for quota errors to prevent app crashes, just return the error info
    return new Error(JSON.stringify(errInfo));
  }

  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();

export function useFirestoreCollection<T = DocumentData>(collectionPath: string, ...queryConstraints: QueryConstraint[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionPath), ...queryConstraints);
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        setData(items);
        setLoading(false);
      },
      (err) => {
        try {
          const processedError = handleFirestoreError(err, OperationType.GET, collectionPath);
          setError(processedError as Error);
          
          // Fallback mock data for quota exceeded
          if (processedError && processedError.message.includes('Quota')) {
            if (collectionPath === 'updates') {
              setData([
                { id: '1', title: 'Culto de Celebração', description: 'Junte-se a nós neste domingo para um culto especial de adoração e louvor.', imageUrl: 'https://picsum.photos/seed/church1/800/600', date: 'DOM, 10:00' } as any,
                { id: '2', title: 'Estudo Bíblico', description: 'Aprofunde-se na palavra de Deus com nosso grupo de estudos.', imageUrl: 'https://picsum.photos/seed/bible/800/600', date: 'QUA, 19:30' } as any,
                { id: '3', title: 'Encontro de Jovens', description: 'Uma noite de comunhão, louvor e palavra para os jovens.', imageUrl: 'https://picsum.photos/seed/youth/800/600', date: 'SÁB, 20:00' } as any,
              ]);
            } else if (collectionPath === 'events') {
              setData([
                { id: '1', title: 'Conferência Anual', description: 'Nossa maior conferência do ano está chegando.', imageUrl: 'https://picsum.photos/seed/conference/1200/400', date: '15-17 NOV', location: 'Templo Principal' } as any,
              ]);
            } else if (collectionPath === 'ebdLessons') {
              setData([
                { id: '1', title: 'A Graça de Deus', description: 'Um estudo profundo sobre a graça salvadora.', imageUrl: 'https://picsum.photos/seed/grace/800/600', date: 'DOM, 09:00', teacher: 'Pr. João Silva' } as any,
                { id: '2', title: 'Os Frutos do Espírito', description: 'Como desenvolver o caráter de Cristo.', imageUrl: 'https://picsum.photos/seed/spirit/800/600', date: 'DOM, 09:00', teacher: 'Pra. Maria Silva' } as any,
              ]);
            }
          }
        } catch (e) {
          setError(e as Error);
        }
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [collectionPath, JSON.stringify(queryConstraints)]);

  return { data, loading, error };
}

export function useFirestoreDoc<T = DocumentData>(collectionPath: string, docId: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, collectionPath, docId), 
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        try {
          const processedError = handleFirestoreError(err, OperationType.GET, `${collectionPath}/${docId}`);
          setError(processedError as Error);

          if (processedError && processedError.message.includes('Quota')) {
            if (collectionPath === 'config' && docId === 'site') {
              setData({
                heroTitle: "Bem-vindo à Nossa Igreja",
                heroSubtitle: "Um lugar de paz, amor e comunhão.",
                heroImageUrl: "https://picsum.photos/seed/church/1920/1080",
                aboutText: "Somos uma comunidade apaixonada por Jesus e dedicada a servir ao próximo.",
                aboutImageUrl: "https://picsum.photos/seed/community/800/600",
                mission: "Nossa missão é espalhar o amor de Cristo.",
                vision: "Ser uma igreja relevante na sociedade.",
                values: "Amor, Fé, Esperança, Comunhão."
              } as any);
            } else if (collectionPath === 'config' && docId === 'leadership') {
              setData({
                title: "Nossa Liderança",
                subtitle: "Conheça os pastores e líderes que servem nossa comunidade.",
                leaders: [
                  { name: "Pr. João Silva", role: "Pastor Presidente", imageUrl: "https://picsum.photos/seed/pastor1/400/400" },
                  { name: "Pra. Maria Silva", role: "Pastora Auxiliar", imageUrl: "https://picsum.photos/seed/pastor2/400/400" }
                ]
              } as any);
            } else if (collectionPath === 'config' && docId === 'contact') {
              setData({
                address: "Rua Principal, 123 - Centro",
                phone: "(11) 99999-9999",
                email: "contato@nossaigreja.com",
                facebook: "https://facebook.com",
                instagram: "https://instagram.com",
                youtube: "https://youtube.com",
                services: [
                  { day: "Domingo", time: "10:00 e 18:00", name: "Culto de Celebração" },
                  { day: "Quarta", time: "19:30", name: "Estudo Bíblico" }
                ]
              } as any);
            }
          }
        } catch (e) {
          setError(e as Error);
        }
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [collectionPath, docId]);

  return { data, loading, error };
}

export const firestoreService = {
  async add(collectionPath: string, data: any) {
    try {
      return await addDoc(collection(db, collectionPath), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, collectionPath);
    }
  },
  async update(collectionPath: string, docId: string, data: any) {
    try {
      return await updateDoc(doc(db, collectionPath, docId), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionPath}/${docId}`);
    }
  },
  async set(collectionPath: string, docId: string, data: any) {
    try {
      return await setDoc(doc(db, collectionPath, docId), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${collectionPath}/${docId}`);
    }
  },
  async delete(collectionPath: string, docId: string) {
    try {
      return await deleteDoc(doc(db, collectionPath, docId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionPath}/${docId}`);
    }
  },
  async clearCollection(collectionPath: string) {
    try {
      const { getDocs, collection } = await import('firebase/firestore');
      const snapshot = await getDocs(collection(db, collectionPath));
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      return await Promise.all(deletePromises);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, collectionPath);
    }
  }
};
