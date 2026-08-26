import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  onSnapshot,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './firebase';
import { StudyResourceItem, StudySubject, STUDY_SUBJECTS } from './studyLibraryRegistry';
import { logClientActivity } from './activity';

export interface ClassroomCustomLibraryItem {
  id: string;
  classroom_id: string;
  subject_id: string;
  topic_id: string;
  subtopic_id?: string;
  title: string;
  description?: string;
  resource_type: 'theory' | 'notes' | 'code' | 'document' | 'assignment' | 'practice' | 'link' | 'github';
  language?: string;
  source_code?: string;
  file_url?: string;
  github_url?: string;
  mega_url?: string;
  author_name: string;
  uploaded_by: string;
  created_at: string;
}

export const subscribeClassroomLibrary = (
  classroomId: string,
  onUpdate: (customItems: ClassroomCustomLibraryItem[]) => void,
  onError?: (err: any) => void
): Unsubscribe => {
  const libraryColl = collection(db, 'classrooms', classroomId, 'library');
  const q = query(libraryColl, orderBy('created_at', 'desc'));

  return onSnapshot(
    q,
    (snap) => {
      const items: ClassroomCustomLibraryItem[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          classroom_id: classroomId,
          subject_id: data.subject_id || 'dsa',
          topic_id: data.topic_id || 'general',
          subtopic_id: data.subtopic_id,
          title: data.title || 'Untitled Resource',
          description: data.description,
          resource_type: data.resource_type || 'notes',
          language: data.language,
          source_code: data.source_code,
          file_url: data.file_url,
          github_url: data.github_url,
          mega_url: data.mega_url,
          author_name: data.author_name || 'Instructor',
          uploaded_by: data.uploaded_by || '',
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at || new Date().toISOString(),
        };
      });
      onUpdate(items);
    },
    (err) => {
      console.warn(`[Firestore Library Subscription Note] (${classroomId}):`, err.message);
      if (onError) onError(err);
    }
  );
};

export const addClassroomLibraryItem = async (
  classroomId: string,
  item: Omit<ClassroomCustomLibraryItem, 'id' | 'created_at'>
): Promise<string> => {
  const libraryColl = collection(db, 'classrooms', classroomId, 'library');
  const docRef = await addDoc(libraryColl, {
    ...item,
    created_at: serverTimestamp(),
  });

  logClientActivity({
    action: 'library.resource_added',
    category: 'classroom',
    classroom_id: classroomId,
    metadata: { resource_title: item.title, subject: item.subject_id },
  });

  return docRef.id;
};

export const removeClassroomLibraryItem = async (
  classroomId: string,
  resourceId: string
): Promise<void> => {
  const itemDoc = doc(db, 'classrooms', classroomId, 'library', resourceId);
  await deleteDoc(itemDoc);

  logClientActivity({
    action: 'library.resource_removed',
    category: 'classroom',
    classroom_id: classroomId,
    resource_id: resourceId,
  });
};

/**
 * Merge base core curriculum + Creator links + classroom-specific teacher uploads
 */
export const getMergedClassroomStudyLibrary = (
  customItems: ClassroomCustomLibraryItem[]
): StudySubject[] => {
  // Deep clone standard subjects
  const subjects: StudySubject[] = JSON.parse(JSON.stringify(STUDY_SUBJECTS));

  if (!customItems || customItems.length === 0) {
    return subjects;
  }

  customItems.forEach((custom) => {
    let subject = subjects.find((s) => s.id === custom.subject_id);
    if (!subject) {
      // Create dynamic subject if new
      subject = {
        id: custom.subject_id,
        title: custom.subject_id.toUpperCase(),
        shortName: custom.subject_id.toUpperCase(),
        description: 'Classroom uploaded study materials',
        icon: '📁',
        color: '#6366f1',
        badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        borderColor: 'hover:border-indigo-500/50',
        topics: [],
      };
      subjects.push(subject);
    }

    let topic = subject.topics.find((t) => t.id === custom.topic_id);
    if (!topic) {
      topic = {
        id: custom.topic_id,
        title: custom.topic_id.charAt(0).toUpperCase() + custom.topic_id.slice(1).replace(/-/g, ' '),
        description: 'Classroom specific materials',
        icon: '📌',
        resources: [],
      };
      subject.topics.push(topic);
    }

    const item: StudyResourceItem = {
      id: custom.id,
      title: custom.title,
      description: custom.description,
      resourceType: custom.resource_type,
      language: custom.language as any,
      sourceCode: custom.source_code,
      fileUrl: custom.file_url,
      githubUrl: custom.github_url,
      megaUrl: custom.mega_url,
      topicId: custom.topic_id,
      subtopicId: custom.subtopic_id,
      authorName: custom.author_name,
      createdAt: custom.created_at,
      downloadableOffline: custom.resource_type === 'theory' || custom.resource_type === 'notes',
    };

    topic.resources.unshift(item);
  });

  return subjects;
};