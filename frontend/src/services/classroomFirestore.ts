import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp,
  increment
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';

export interface FirestoreClassroom {
  id: string;
  name: string;
  subject: string;
  description?: string;
  section?: string;
  academic_level?: string;
  owner_id: string;
  owner_name: string;
  owner_email?: string;
  invite_code: string;
  access_key_hash?: string;
  joining_enabled: boolean;
  member_count: number;
  created_at: string;
  updated_at: string;
  my_role?: 'owner' | 'student';
}

export interface FirestoreClassroomMember {
  id: string;
  classroom_id: string;
  student_id?: number | string;
  user_id: string;
  student_name: string;
  student_username?: string;
  email?: string;
  role: 'owner' | 'student';
  joined_at: string;
}

export interface FirestoreClassResource {
  id: string;
  classroom_id: string;
  resource_type: 'note' | 'document' | 'code';
  title: string;
  description?: string;
  category: string;
  language?: string;
  source_code?: string;
  file_url?: string;
  storage_path?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  author_name: string;
  uploaded_by: string;
  created_at: string;
}

export interface FirestoreClassAssignment {
  id: string;
  classroom_id: string;
  title: string;
  description?: string;
  instructions?: string;
  starter_code?: string;
  starter_language?: string;
  program_language?: string;
  due_date?: string;
  max_score: number;
  created_by: string;
  created_by_name: string;
  created_at: string;
  my_submission_status: string;
}

export interface FirestoreClassAnnouncement {
  id: string;
  classroom_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  author_id: string;
  author_name: string;
  created_at: string;
}

// Access Key Generator (unambiguous characters: 2-9, A-Z excluding O, 0, I, 1, L)
const SAFE_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
export const generateAccessKey = (subject?: string): string => {
  let prefix = 'CODE';
  if (subject) {
    const cleaned = subject.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (cleaned.length >= 3) {
      prefix = cleaned.slice(0, 4);
    }
  }
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += SAFE_CHARS.charAt(Math.floor(Math.random() * SAFE_CHARS.length));
  }
  return `${prefix}-${randomPart}`;
};

// Simple cryptographic SHA-256 hash for access keys in browser
export const hashAccessKey = async (key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(key.trim().toUpperCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Format Timestamp helper
const formatTimestamp = (ts: any): string => {
  if (!ts) return new Date().toISOString();
  if (ts.toDate && typeof ts.toDate === 'function') {
    return ts.toDate().toISOString();
  }
  if (typeof ts === 'string') return ts;
  return new Date().toISOString();
};

// -------------------------------------------------------------
// CLASSROOM OPERATIONS
// -------------------------------------------------------------

export const createFirestoreClassroom = async (
  ownerUid: string,
  ownerName: string,
  ownerEmail: string,
  data: {
    name: string;
    subject: string;
    description?: string;
    section?: string;
    academic_level?: string;
  }
): Promise<FirestoreClassroom> => {
  const inviteCode = generateAccessKey(data.subject);
  const accessKeyHash = await hashAccessKey(inviteCode);
  const classRef = doc(collection(db, 'classrooms'));
  const now = new Date().toISOString();

  const classroomData = {
    name: data.name.trim(),
    subject: data.subject.trim(),
    description: data.description?.trim() || '',
    section: data.section?.trim() || '',
    academic_level: data.academic_level?.trim() || '',
    owner_id: ownerUid,
    owner_name: ownerName || 'Instructor',
    owner_email: ownerEmail || '',
    invite_code: inviteCode,
    access_key_hash: accessKeyHash,
    joining_enabled: true,
    member_count: 1,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  await setDoc(classRef, classroomData);

  // Add owner to members subcollection
  const memberRef = doc(db, 'classrooms', classRef.id, 'members', ownerUid);
  await setDoc(memberRef, {
    user_id: ownerUid,
    student_name: ownerName || 'Instructor',
    student_username: ownerEmail?.split('@')[0] || ownerUid.slice(0, 6),
    email: ownerEmail || '',
    role: 'owner',
    joined_at: serverTimestamp(),
  });

  return {
    id: classRef.id,
    ...data,
    owner_id: ownerUid,
    owner_name: ownerName || 'Instructor',
    owner_email: ownerEmail || '',
    invite_code: inviteCode,
    access_key_hash: accessKeyHash,
    joining_enabled: true,
    member_count: 1,
    created_at: now,
    updated_at: now,
    my_role: 'owner',
  };
};

export const joinFirestoreClassroom = async (
  userUid: string,
  userName: string,
  userEmail: string,
  accessKey: string
): Promise<FirestoreClassroom> => {
  const cleanKey = accessKey.trim().toUpperCase();
  const q = query(collection(db, 'classrooms'), where('invite_code', '==', cleanKey));
  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error('Invalid access key. Please verify the code and try again.');
  }

  const classDoc = snap.docs[0];
  const classData = classDoc.data();

  if (classData.joining_enabled === false) {
    throw new Error('This classroom is currently locked by the instructor for new enrollments.');
  }

  const memberRef = doc(db, 'classrooms', classDoc.id, 'members', userUid);
  const memberSnap = await getDoc(memberRef);

  if (memberSnap.exists()) {
    return {
      id: classDoc.id,
      name: classData.name,
      subject: classData.subject,
      description: classData.description,
      section: classData.section,
      academic_level: classData.academic_level,
      owner_id: classData.owner_id,
      owner_name: classData.owner_name,
      owner_email: classData.owner_email,
      invite_code: classData.invite_code,
      joining_enabled: classData.joining_enabled,
      member_count: classData.member_count || 1,
      created_at: formatTimestamp(classData.created_at),
      updated_at: formatTimestamp(classData.updated_at),
      my_role: memberSnap.data()?.role || 'student',
    };
  }

  // Add new member
  await setDoc(memberRef, {
    user_id: userUid,
    student_name: userName || 'Student',
    student_username: userEmail?.split('@')[0] || userUid.slice(0, 6),
    email: userEmail || '',
    role: 'student',
    joined_at: serverTimestamp(),
  });

  // Increment member count
  await updateDoc(doc(db, 'classrooms', classDoc.id), {
    member_count: increment(1),
    updated_at: serverTimestamp(),
  });

  return {
    id: classDoc.id,
    name: classData.name,
    subject: classData.subject,
    description: classData.description,
    section: classData.section,
    academic_level: classData.academic_level,
    owner_id: classData.owner_id,
    owner_name: classData.owner_name,
    owner_email: classData.owner_email,
    invite_code: classData.invite_code,
    joining_enabled: classData.joining_enabled,
    member_count: (classData.member_count || 1) + 1,
    created_at: formatTimestamp(classData.created_at),
    updated_at: formatTimestamp(classData.updated_at),
    my_role: 'student',
  };
};

export const getFirestoreClassrooms = async (userUid: string): Promise<FirestoreClassroom[]> => {
  const classrooms: FirestoreClassroom[] = [];
  const classSnap = await getDocs(collection(db, 'classrooms'));

  for (const cDoc of classSnap.docs) {
    const data = cDoc.data();
    if (data.owner_id === userUid) {
      classrooms.push({
        id: cDoc.id,
        name: data.name,
        subject: data.subject,
        description: data.description,
        section: data.section,
        academic_level: data.academic_level,
        owner_id: data.owner_id,
        owner_name: data.owner_name,
        owner_email: data.owner_email,
        invite_code: data.invite_code,
        joining_enabled: data.joining_enabled,
        member_count: data.member_count || 1,
        created_at: formatTimestamp(data.created_at),
        updated_at: formatTimestamp(data.updated_at),
        my_role: 'owner',
      });
    } else {
      const memberDoc = await getDoc(doc(db, 'classrooms', cDoc.id, 'members', userUid));
      if (memberDoc.exists()) {
        classrooms.push({
          id: cDoc.id,
          name: data.name,
          subject: data.subject,
          description: data.description,
          section: data.section,
          academic_level: data.academic_level,
          owner_id: data.owner_id,
          owner_name: data.owner_name,
          owner_email: data.owner_email,
          invite_code: data.invite_code,
          joining_enabled: data.joining_enabled,
          member_count: data.member_count || 1,
          created_at: formatTimestamp(data.created_at),
          updated_at: formatTimestamp(data.updated_at),
          my_role: memberDoc.data()?.role || 'student',
        });
      }
    }
  }

  return classrooms;
};

export const getFirestoreClassroom = async (classId: string, userUid: string): Promise<FirestoreClassroom> => {
  const classDoc = await getDoc(doc(db, 'classrooms', classId));
  if (!classDoc.exists()) {
    throw new Error('Classroom not found.');
  }

  const data = classDoc.data();
  let myRole: 'owner' | 'student' = data.owner_id === userUid ? 'owner' : 'student';

  const memberDoc = await getDoc(doc(db, 'classrooms', classId, 'members', userUid));
  if (memberDoc.exists()) {
    myRole = memberDoc.data()?.role || myRole;
  }

  return {
    id: classDoc.id,
    name: data.name,
    subject: data.subject,
    description: data.description,
    section: data.section,
    academic_level: data.academic_level,
    owner_id: data.owner_id,
    owner_name: data.owner_name,
    owner_email: data.owner_email,
    invite_code: data.invite_code,
    joining_enabled: data.joining_enabled,
    member_count: data.member_count || 1,
    created_at: formatTimestamp(data.created_at),
    updated_at: formatTimestamp(data.updated_at),
    my_role: myRole,
  };
};

export const regenerateFirestoreAccessKey = async (classId: string, subject?: string): Promise<string> => {
  const newKey = generateAccessKey(subject);
  const newHash = await hashAccessKey(newKey);

  await updateDoc(doc(db, 'classrooms', classId), {
    invite_code: newKey,
    access_key_hash: newHash,
    updated_at: serverTimestamp(),
  });

  return newKey;
};

export const toggleFirestoreJoining = async (classId: string, enabled: boolean): Promise<void> => {
  await updateDoc(doc(db, 'classrooms', classId), {
    joining_enabled: enabled,
    updated_at: serverTimestamp(),
  });
};

export const deleteFirestoreClassroom = async (classId: string): Promise<void> => {
  await deleteDoc(doc(db, 'classrooms', classId));
};

export const leaveFirestoreClassroom = async (classId: string, userUid: string): Promise<void> => {
  await deleteDoc(doc(db, 'classrooms', classId, 'members', userUid));
  await updateDoc(doc(db, 'classrooms', classId), {
    member_count: increment(-1),
    updated_at: serverTimestamp(),
  });
};

export const removeFirestoreMember = async (classId: string, studentUid: string): Promise<void> => {
  await deleteDoc(doc(db, 'classrooms', classId, 'members', studentUid));
  await updateDoc(doc(db, 'classrooms', classId), {
    member_count: increment(-1),
    updated_at: serverTimestamp(),
  });
};

// -------------------------------------------------------------
// MEMBERS ROSTER
// -------------------------------------------------------------

export const getFirestoreMembers = async (classId: string): Promise<FirestoreClassroomMember[]> => {
  const snap = await getDocs(collection(db, 'classrooms', classId, 'members'));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      classroom_id: classId,
      user_id: data.user_id || d.id,
      student_id: data.student_id || d.id,
      student_name: data.student_name || 'Class Member',
      student_username: data.student_username || 'member',
      email: data.email || '',
      role: data.role || 'student',
      joined_at: formatTimestamp(data.joined_at),
    };
  });
};

// -------------------------------------------------------------
// ANNOUNCEMENTS
// -------------------------------------------------------------

export const getFirestoreAnnouncements = async (classId: string): Promise<FirestoreClassAnnouncement[]> => {
  const q = query(collection(db, 'classrooms', classId, 'announcements'));
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      classroom_id: classId,
      title: data.title,
      content: data.content,
      is_pinned: !!data.is_pinned,
      author_id: data.author_id,
      author_name: data.author_name || 'Instructor',
      created_at: formatTimestamp(data.created_at),
    };
  });
  return items.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
};

export const createFirestoreAnnouncement = async (
  classId: string,
  userUid: string,
  userName: string,
  title: string,
  content: string,
  isPinned: boolean = false
): Promise<FirestoreClassAnnouncement> => {
  const coll = collection(db, 'classrooms', classId, 'announcements');
  const docRef = await addDoc(coll, {
    title: title.trim(),
    content: content.trim(),
    is_pinned: isPinned,
    author_id: userUid,
    author_name: userName || 'Instructor',
    created_at: serverTimestamp(),
  });

  return {
    id: docRef.id,
    classroom_id: classId,
    title,
    content,
    is_pinned: isPinned,
    author_id: userUid,
    author_name: userName || 'Instructor',
    created_at: new Date().toISOString(),
  };
};

export const deleteFirestoreAnnouncement = async (classId: string, announcementId: string): Promise<void> => {
  await deleteDoc(doc(db, 'classrooms', classId, 'announcements', announcementId));
};

// -------------------------------------------------------------
// RESOURCES & NOTES (WITH FIREBASE STORAGE)
// -------------------------------------------------------------

export const getFirestoreResources = async (classId: string): Promise<FirestoreClassResource[]> => {
  const snap = await getDocs(collection(db, 'classrooms', classId, 'resources'));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      classroom_id: classId,
      resource_type: data.resource_type || 'note',
      title: data.title,
      description: data.description || '',
      category: data.category || 'Lecture Notes',
      language: data.language,
      source_code: data.source_code,
      file_url: data.file_url,
      storage_path: data.storage_path,
      file_name: data.file_name,
      file_size: data.file_size,
      mime_type: data.mime_type,
      author_name: data.author_name || 'Instructor',
      uploaded_by: data.uploaded_by || '',
      created_at: formatTimestamp(data.created_at),
    };
  });
};

export const createFirestoreCodeResource = async (
  classId: string,
  userUid: string,
  userName: string,
  data: {
    title: string;
    description?: string;
    category: string;
    language: string;
    source_code: string;
  }
): Promise<FirestoreClassResource> => {
  const coll = collection(db, 'classrooms', classId, 'resources');
  const docRef = await addDoc(coll, {
    resource_type: 'code',
    title: data.title.trim(),
    description: data.description?.trim() || '',
    category: data.category || 'Sample Code',
    language: data.language || 'cpp',
    source_code: data.source_code,
    uploaded_by: userUid,
    author_name: userName || 'Instructor',
    created_at: serverTimestamp(),
  });

  return {
    id: docRef.id,
    classroom_id: classId,
    resource_type: 'code',
    title: data.title,
    description: data.description,
    category: data.category,
    language: data.language,
    source_code: data.source_code,
    author_name: userName || 'Instructor',
    uploaded_by: userUid,
    created_at: new Date().toISOString(),
  };
};

export const uploadFirestoreNoteFile = async (
  classId: string,
  userUid: string,
  userName: string,
  file: File,
  data: {
    title: string;
    description?: string;
    category: string;
  },
  onProgress?: (progress: number) => void
): Promise<FirestoreClassResource> => {
  const resourceId = doc(collection(db, 'classrooms', classId, 'resources')).id;
  const storagePath = `classrooms/${classId}/notes/${resourceId}/${file.name}`;
  const fileRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        const resourceData = {
          resource_type: 'note',
          title: data.title.trim(),
          description: data.description?.trim() || '',
          category: data.category || 'Lecture Notes',
          file_url: downloadUrl,
          storage_path: storagePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: userUid,
          author_name: userName || 'Instructor',
          created_at: serverTimestamp(),
        };

        await setDoc(doc(db, 'classrooms', classId, 'resources', resourceId), resourceData);

        resolve({
          id: resourceId,
          classroom_id: classId,
          resource_type: 'note',
          title: data.title,
          description: data.description,
          category: data.category,
          file_url: downloadUrl,
          storage_path: storagePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          author_name: userName || 'Instructor',
          uploaded_by: userUid,
          created_at: new Date().toISOString(),
        });
      }
    );
  });
};

export const createFirestoreTextNote = async (
  classId: string,
  userUid: string,
  userName: string,
  data: {
    title: string;
    description?: string;
    category: string;
    file_url?: string;
  }
): Promise<FirestoreClassResource> => {
  const coll = collection(db, 'classrooms', classId, 'resources');
  const docRef = await addDoc(coll, {
    resource_type: 'note',
    title: data.title.trim(),
    description: data.description?.trim() || '',
    category: data.category || 'Lecture Notes',
    file_url: data.file_url?.trim() || '',
    uploaded_by: userUid,
    author_name: userName || 'Instructor',
    created_at: serverTimestamp(),
  });

  return {
    id: docRef.id,
    classroom_id: classId,
    resource_type: 'note',
    title: data.title,
    description: data.description,
    category: data.category,
    file_url: data.file_url,
    author_name: userName || 'Instructor',
    uploaded_by: userUid,
    created_at: new Date().toISOString(),
  };
};

export const deleteFirestoreResource = async (
  classId: string,
  resourceId: string,
  storagePath?: string
): Promise<void> => {
  if (storagePath) {
    try {
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
    } catch (e) {
      console.warn('Storage file cleanup note:', e);
    }
  }
  await deleteDoc(doc(db, 'classrooms', classId, 'resources', resourceId));
};

// -------------------------------------------------------------
// ASSIGNMENTS
// -------------------------------------------------------------

export const getFirestoreAssignments = async (classId: string): Promise<FirestoreClassAssignment[]> => {
  const snap = await getDocs(collection(db, 'classrooms', classId, 'assignments'));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      classroom_id: classId,
      title: data.title,
      description: data.description || '',
      instructions: data.instructions || '',
      starter_code: data.starter_code || '',
      starter_language: data.starter_language || 'cpp',
      due_date: data.due_date || '',
      max_score: data.max_score || 100,
      created_by: data.created_by,
      created_by_name: data.created_by_name || 'Instructor',
      created_at: formatTimestamp(data.created_at),
      my_submission_status: 'Not started',
    };
  });
};

export const createFirestoreAssignment = async (
  classId: string,
  userUid: string,
  userName: string,
  data: {
    title: string;
    description?: string;
    instructions?: string;
    starter_code?: string;
    starter_language?: string;
    due_date?: string;
    max_score?: number;
  }
): Promise<FirestoreClassAssignment> => {
  const coll = collection(db, 'classrooms', classId, 'assignments');
  const docRef = await addDoc(coll, {
    title: data.title.trim(),
    description: data.description?.trim() || '',
    instructions: data.instructions?.trim() || '',
    starter_code: data.starter_code || '',
    starter_language: data.starter_language || 'cpp',
    due_date: data.due_date || '',
    max_score: data.max_score || 100,
    created_by: userUid,
    created_by_name: userName || 'Instructor',
    created_at: serverTimestamp(),
  });

  return {
    id: docRef.id,
    classroom_id: classId,
    title: data.title,
    description: data.description,
    instructions: data.instructions,
    starter_code: data.starter_code,
    starter_language: data.starter_language,
    due_date: data.due_date,
    max_score: data.max_score || 100,
    created_by: userUid,
    created_by_name: userName || 'Instructor',
    created_at: new Date().toISOString(),
    my_submission_status: 'Not started',
  };
};
