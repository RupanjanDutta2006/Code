import { useState, useEffect, useCallback } from 'react';
import { 
  FirestoreClassroom, 
  getFirestoreClassrooms, 
  subscribeUserClassrooms,
  createFirestoreClassroom,
  joinFirestoreClassroom
} from '../services/classroomFirestore';

interface UseUserClassroomsResult {
  classrooms: FirestoreClassroom[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createClass: (
    ownerName: string, 
    ownerEmail: string, 
    data: { name: string; subject: string; description?: string; section?: string; academic_level?: string }
  ) => Promise<FirestoreClassroom>;
  joinClass: (
    userName: string, 
    userEmail: string, 
    key: string
  ) => Promise<FirestoreClassroom>;
}

export const useUserClassrooms = (userUid?: string | null): UseUserClassroomsResult => {
  const [classrooms, setClassrooms] = useState<FirestoreClassroom[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(userUid));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userUid) {
      setClassrooms([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await getFirestoreClassrooms(userUid);
      setClassrooms(list);
    } catch (err: any) {
      console.warn('Error refreshing classrooms:', err);
      setError(err?.message || 'Failed to fetch classrooms');
    } finally {
      setLoading(false);
    }
  }, [userUid]);

  useEffect(() => {
    if (!userUid) {
      setClassrooms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeUserClassrooms(
      userUid,
      (list) => {
        setClassrooms(list);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn('Subscription error for user classrooms:', err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userUid]);

  const createClass = useCallback(
    async (
      ownerName: string,
      ownerEmail: string,
      data: { name: string; subject: string; description?: string; section?: string; academic_level?: string }
    ) => {
      if (!userUid) {
        throw new Error('You must be logged in to create a classroom.');
      }
      const created = await createFirestoreClassroom(userUid, ownerName, ownerEmail, data);
      // Optimistic update
      setClassrooms((prev) => [created, ...prev.filter((c) => c.id !== created.id)]);
      return created;
    },
    [userUid]
  );

  const joinClass = useCallback(
    async (userName: string, userEmail: string, key: string) => {
      if (!userUid) {
        throw new Error('You must be logged in to join a classroom.');
      }
      const joined = await joinFirestoreClassroom(userUid, userName, userEmail, key);
      // Optimistic update
      setClassrooms((prev) => [joined, ...prev.filter((c) => c.id !== joined.id)]);
      return joined;
    },
    [userUid]
  );

  return {
    classrooms,
    loading,
    error,
    refresh,
    createClass,
    joinClass,
  };
};