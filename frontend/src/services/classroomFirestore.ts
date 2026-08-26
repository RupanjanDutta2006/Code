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
  increment,
  writeBatch
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import { logClientActivity } from './activity';

export interface FirestoreClassroom {
  id: string;
  name: string;
  subject: string;
  description?: string;
  section?: string;
  academic_level?: string;
  owner_id: string;
  ownerUid: string;
  owner_name: string;
  owner_email?: string;
  invite_code: string;
  access_key: string;
  accessKeyNormalized: string;
  access_key_hash?: string;
  joining_enabled: boolean;
  member_count: number;
  resource_count?: number;
  assignment_count?: number;
  announcement_count?: number;
  created_at: string;
  updated_at: string;
  my_role?: 'owner' | 'student';
  is_teacher?: boolean;
  is_member?: boolean;
  teacher_id?: number | string;
  teacher_name?: string;
}

export interface FirestoreClassroomMember {
  id: string;
  classroom_id: string;
  user_id: string;
  student_id?: string;
  student_name: string;
  student_username?: string;
  email?: string;
  role: 'owner' | 'student';
  joined_at: string;
}

export interface FirestoreClassResource {
  id: string;
  classroom_id: string;
  resource_type: 'note' | 'document' | 'code' | 'link';
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
  my_submission_status?: string;
}

export interface FirestoreAssignmentSubmission {
  id: string;
  assignment_id: string;
  classroom_id: string;
  student_uid: string;
  student_name: string;
  student_email?: string;
  source_code: string;
  language: string;
  status: 'submitted' | 'graded' | 'late';
  score?: number;
  feedback?: string;
  submitted_at: string;
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

// -------------------------------------------------------------
// ACCESS KEY NORMALIZATION & GENERATION
// -------------------------------------------------------------

const SAFE_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export const normalizeAccessKey = (key: string): string => {
  if (!key) return '';
  return key.trim().toUpperCase().replace(/\s+/g, '');
};

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

export const hashAccessKey = async (key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(normalizeAccessKey(key));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const formatTimestamp = (ts: any): string => {
  if (!ts) return new Date().toISOString();
  if (ts.toDate && typeof ts.toDate === 'function') {
    return ts.toDate().toISOString();
  }
  if (typeof ts === 'string') return ts;
  return new Date().toISOString();
};

// -------------------------------------------------------------
// ATOMIC CANONICAL CLASSROOM CREATION
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
  if (!ownerUid) {
    throw new Error('Authentication required: owner UID is missing.');
  }

  // Generate clean unique human-friendly access key
  const inviteCode = generateAccessKey(data.subject);
  const normalizedKey = normalizeAccessKey(inviteCode);
  const accessKeyHash = await hashAccessKey(inviteCode);
  const classRef = doc(collection(db, 'classrooms'));
  const classId = classRef.id;
  const now = new Date().toISOString();

  const classroomDocData = {
    id: classId,
    name: data.name.trim(),
    subject: data.subject.trim(),
    description: data.description?.trim() || '',
    section: data.section?.trim() || '',
    academic_level: data.academic_level?.trim() || '',
    owner_id: ownerUid,
    ownerUid: ownerUid,
    owner_name: ownerName || 'Instructor',
    owner_email: ownerEmail || '',
    invite_code: inviteCode,
    access_key: inviteCode,
    accessKeyNormalized: normalizedKey,
    access_key_hash: accessKeyHash,
    joining_enabled: true,
    member_count: 1,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  // Perform atomic batch write: Classroom + Owner Member + User Index + Key Registry
  const batch = writeBatch(db);

  // 1. Primary Classroom Document
  batch.set(classRef, classroomDocData);

  // 2. Owner Membership in subcollection
  const memberRef = doc(db, 'classrooms', classId, 'members', ownerUid);
  batch.set(memberRef, {
    uid: ownerUid,
    user_id: ownerUid,
    student_id: ownerUid,
    student_name: ownerName || 'Instructor',
    student_username: ownerEmail?.split('@')[0] || ownerUid.slice(0, 6),
    email: ownerEmail || '',
    role: 'owner',
    joined_at: serverTimestamp(),
    joinedAt: serverTimestamp(),
  });

  // 3. User-side bidirectional index: users/{ownerUid}/classrooms/{classId}
  const userClassRef = doc(db, 'users', ownerUid, 'classrooms', classId);
  batch.set(userClassRef, {
    classroomId: classId,
    classId: classId,
    name: data.name.trim(),
    subject: data.subject.trim(),
    role: 'owner',
    joined_at: serverTimestamp(),
    joinedAt: serverTimestamp(),
  });

  // 4. Fast O(1) Key Registry: classAccessKeys/{normalizedKey}
  const keyRegistryRef = doc(db, 'classAccessKeys', normalizedKey);
  batch.set(keyRegistryRef, {
    classroomId: classId,
    classId: classId,
    accessKey: inviteCode,
    accessKeyNormalized: normalizedKey,
    ownerUid: ownerUid,
    createdAt: serverTimestamp(),
  });

  // Commit all writes atomically
  await batch.commit();

  // Audit activity log (never include secret key in audit log metadata)
  logClientActivity({
    action: 'classroom.created',
    category: 'classroom',
    resource_type: 'classroom',
    resource_id: classId,
    classroom_id: classId,
    outcome: 'success',
    metadata: {
      classroom_name: data.name.trim(),
      subject: data.subject.trim(),
    },
  });

  return {
    id: classId,
    name: data.name.trim(),
    subject: data.subject.trim(),
    description: data.description?.trim() || '',
    section: data.section?.trim() || '',
    academic_level: data.academic_level?.trim() || '',
    owner_id: ownerUid,
    ownerUid: ownerUid,
    owner_name: ownerName || 'Instructor',
    owner_email: ownerEmail || '',
    invite_code: inviteCode,
    access_key: inviteCode,
    accessKeyNormalized: normalizedKey,
    access_key_hash: accessKeyHash,
    joining_enabled: true,
    member_count: 1,
    resource_count: 0,
    assignment_count: 0,
    announcement_count: 0,
    created_at: now,
    updated_at: now,
    my_role: 'owner',
    is_teacher: true,
    is_member: true,
    teacher_name: ownerName || 'Instructor',
  };
};

// -------------------------------------------------------------
// ATOMIC CANONICAL CLASSROOM JOIN
// -------------------------------------------------------------

export const joinFirestoreClassroom = async (
  userUid: string,
  userName: string,
  userEmail: string,
  accessKey: string
): Promise<FirestoreClassroom> => {
  if (!userUid) {
    throw new Error('Authentication required: please log in to join a classroom.');
  }

  const cleanKey = normalizeAccessKey(accessKey);
  if (!cleanKey) {
    throw new Error('Invalid classroom key. Please enter a valid access code.');
  }

  let classId: string | null = null;
  let classData: any = null;

  // Step 1: Check fast Key Registry: classAccessKeys/{cleanKey}
  try {
    const keyDoc = await getDoc(doc(db, 'classAccessKeys', cleanKey));
    if (keyDoc.exists()) {
      classId = keyDoc.data()?.classroomId || keyDoc.data()?.classId;
      if (classId) {
        const classDoc = await getDoc(doc(db, 'classrooms', classId));
        if (classDoc.exists()) {
          classData = classDoc.data();
        }
      }
    }
  } catch (err) {
    console.warn('Direct key registry lookup fallback:', err);
  }

  // Step 2: Query fallback on classrooms collection
  if (!classData) {
    const q1 = query(collection(db, 'classrooms'), where('accessKeyNormalized', '==', cleanKey));
    let snap = await getDocs(q1);
    if (snap.empty) {
      const q2 = query(collection(db, 'classrooms'), where('invite_code', '==', cleanKey));
      snap = await getDocs(q2);
    }
    if (!snap.empty) {
      const foundDoc = snap.docs[0];
      classId = foundDoc.id;
      classData = foundDoc.data();
    }
  }

  if (!classId || !classData) {
    throw new Error('Invalid classroom key. No active classroom was found matching this code.');
  }

  // Step 3: Check joining enabled status
  if (classData.joining_enabled === false) {
    throw new Error('This classroom is currently locked by the instructor for new enrollments.');
  }

  const isOwner = classData.owner_id === userUid || classData.ownerUid === userUid;

  // Step 4: Check existing membership
  const memberRef = doc(db, 'classrooms', classId, 'members', userUid);
  const memberSnap = await getDoc(memberRef);

  if (memberSnap.exists() || isOwner) {
    const existingRole = isOwner ? 'owner' : (memberSnap.data()?.role || 'student');
    
    // Ensure user-side index is populated
    try {
      await setDoc(doc(db, 'users', userUid, 'classrooms', classId), {
        classroomId: classId,
        classId: classId,
        name: classData.name,
        subject: classData.subject || '',
        role: existingRole,
        joined_at: serverTimestamp(),
        joinedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {}

    return {
      id: classId,
      name: classData.name,
      subject: classData.subject,
      description: classData.description,
      section: classData.section,
      academic_level: classData.academic_level,
      owner_id: classData.owner_id || classData.ownerUid,
      ownerUid: classData.ownerUid || classData.owner_id,
      owner_name: classData.owner_name || 'Instructor',
      owner_email: classData.owner_email,
      invite_code: classData.invite_code || classData.access_key,
      access_key: classData.access_key || classData.invite_code,
      accessKeyNormalized: classData.accessKeyNormalized || cleanKey,
      joining_enabled: classData.joining_enabled,
      member_count: classData.member_count || 1,
      created_at: formatTimestamp(classData.created_at),
      updated_at: formatTimestamp(classData.updated_at),
      my_role: existingRole,
      is_teacher: existingRole === 'owner',
      is_member: true,
      teacher_name: classData.owner_name || 'Instructor',
    };
  }

  // Step 5: Atomic batch write for new member join
  const batch = writeBatch(db);

  // 1. Membership doc
  batch.set(memberRef, {
    uid: userUid,
    user_id: userUid,
    student_id: userUid,
    student_name: userName || 'Student',
    student_username: userEmail?.split('@')[0] || userUid.slice(0, 6),
    email: userEmail || '',
    role: 'student',
    joined_at: serverTimestamp(),
    joinedAt: serverTimestamp(),
  });

  // 2. User-side index: users/{userUid}/classrooms/{classId}
  const userClassRef = doc(db, 'users', userUid, 'classrooms', classId);
  batch.set(userClassRef, {
    classroomId: classId,
    classId: classId,
    name: classData.name,
    subject: classData.subject || '',
    role: 'student',
    joined_at: serverTimestamp(),
    joinedAt: serverTimestamp(),
  });

  // 3. Increment member count on classroom document
  batch.update(doc(db, 'classrooms', classId), {
    member_count: increment(1),
    updated_at: serverTimestamp(),
  });

  await batch.commit();

  // Audit activity log (without the access key)
  logClientActivity({
    action: 'classroom.joined',
    category: 'classroom',
    resource_type: 'classroom',
    resource_id: classId,
    classroom_id: classId,
    outcome: 'success',
    metadata: {
      classroom_name: classData.name,
      subject: classData.subject || '',
    },
  });

  return {
    id: classId,
    name: classData.name,
    subject: classData.subject,
    description: classData.description,
    section: classData.section,
    academic_level: classData.academic_level,
    owner_id: classData.owner_id || classData.ownerUid,
    ownerUid: classData.ownerUid || classData.owner_id,
    owner_name: classData.owner_name || 'Instructor',
    owner_email: classData.owner_email,
    invite_code: classData.invite_code || classData.access_key,
    access_key: classData.access_key || classData.invite_code,
    accessKeyNormalized: classData.accessKeyNormalized || cleanKey,
    joining_enabled: classData.joining_enabled,
    member_count: (classData.member_count || 1) + 1,
    created_at: formatTimestamp(classData.created_at),
    updated_at: formatTimestamp(classData.updated_at),
    my_role: 'student',
    is_teacher: false,
    is_member: true,
    teacher_name: classData.owner_name || 'Instructor',
  };
};

// -------------------------------------------------------------
// GET USER'S CLASSROOMS (MY CLASS / PROFILE)
// -------------------------------------------------------------

export const getFirestoreClassrooms = async (userUid: string): Promise<FirestoreClassroom[]> => {
  if (!userUid) return [];

  const classroomMap = new Map<string, FirestoreClassroom>();

  // 1. Direct query: classrooms created/owned by user
  try {
    const qOwner = query(collection(db, 'classrooms'), where('owner_id', '==', userUid));
    const ownerSnap = await getDocs(qOwner);
    for (const docSnap of ownerSnap.docs) {
      const data = docSnap.data();
      classroomMap.set(docSnap.id, {
        id: docSnap.id,
        name: data.name,
        subject: data.subject || '',
        description: data.description,
        section: data.section,
        academic_level: data.academic_level,
        owner_id: data.owner_id || userUid,
        ownerUid: data.ownerUid || userUid,
        owner_name: data.owner_name || 'Instructor',
        owner_email: data.owner_email,
        invite_code: data.invite_code || data.access_key,
        access_key: data.access_key || data.invite_code,
        accessKeyNormalized: data.accessKeyNormalized || normalizeAccessKey(data.invite_code || ''),
        joining_enabled: data.joining_enabled !== false,
        member_count: data.member_count || 1,
        created_at: formatTimestamp(data.created_at),
        updated_at: formatTimestamp(data.updated_at),
        my_role: 'owner',
        is_teacher: true,
        is_member: true,
        teacher_name: data.owner_name || 'Instructor',
      });
    }
  } catch (err) {
    console.warn('Error fetching owned classrooms:', err);
  }

  // 2. Query user-side membership index: users/{userUid}/classrooms
  try {
    const userClassSnap = await getDocs(collection(db, 'users', userUid, 'classrooms'));
    for (const uDoc of userClassSnap.docs) {
      const classId = uDoc.id;
      const refData = uDoc.data();
      if (!classroomMap.has(classId)) {
        try {
          const classDoc = await getDoc(doc(db, 'classrooms', classId));
          if (classDoc.exists()) {
            const data = classDoc.data();
            const isOwner = (data.owner_id === userUid || data.ownerUid === userUid);
            const role = isOwner ? 'owner' : (refData.role || 'student');
            classroomMap.set(classId, {
              id: classId,
              name: data.name,
              subject: data.subject || '',
              description: data.description,
              section: data.section,
              academic_level: data.academic_level,
              owner_id: data.owner_id || data.ownerUid,
              ownerUid: data.ownerUid || data.owner_id,
              owner_name: data.owner_name || 'Instructor',
              owner_email: data.owner_email,
              invite_code: data.invite_code || data.access_key,
              access_key: data.access_key || data.invite_code,
              accessKeyNormalized: data.accessKeyNormalized || normalizeAccessKey(data.invite_code || ''),
              joining_enabled: data.joining_enabled !== false,
              member_count: data.member_count || 1,
              created_at: formatTimestamp(data.created_at),
              updated_at: formatTimestamp(data.updated_at),
              my_role: role,
              is_teacher: role === 'owner',
              is_member: true,
              teacher_name: data.owner_name || 'Instructor',
            });
          }
        } catch (e) {}
      }
    }
  } catch (err) {
    console.warn('Error fetching indexed user classrooms:', err);
  }

  // 3. Fallback: Query all classrooms for membership if index was empty
  if (classroomMap.size === 0) {
    try {
      const allClassSnap = await getDocs(collection(db, 'classrooms'));
      for (const cDoc of allClassSnap.docs) {
        const data = cDoc.data();
        if (data.owner_id === userUid || data.ownerUid === userUid) {
          classroomMap.set(cDoc.id, {
            id: cDoc.id,
            name: data.name,
            subject: data.subject || '',
            description: data.description,
            section: data.section,
            academic_level: data.academic_level,
            owner_id: data.owner_id || userUid,
            ownerUid: data.ownerUid || userUid,
            owner_name: data.owner_name || 'Instructor',
            owner_email: data.owner_email,
            invite_code: data.invite_code || data.access_key,
            access_key: data.access_key || data.invite_code,
            accessKeyNormalized: data.accessKeyNormalized || normalizeAccessKey(data.invite_code || ''),
            joining_enabled: data.joining_enabled !== false,
            member_count: data.member_count || 1,
            created_at: formatTimestamp(data.created_at),
            updated_at: formatTimestamp(data.updated_at),
            my_role: 'owner',
            is_teacher: true,
            is_member: true,
            teacher_name: data.owner_name || 'Instructor',
          });
        }
      }
    } catch (e) {}
  }

  return Array.from(classroomMap.values()).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

// -------------------------------------------------------------
// GET SINGLE CLASSROOM BY FIRESTORE DOCUMENT ID
// -------------------------------------------------------------

export const getFirestoreClassroom = async (classId: string, userUid: string): Promise<FirestoreClassroom> => {
  if (!classId) {
    throw new Error('Classroom ID is required.');
  }

  const classDoc = await getDoc(doc(db, 'classrooms', classId));
  if (!classDoc.exists()) {
    throw new Error('Classroom not found or access denied.');
  }

  const data = classDoc.data();
  const isOwner = data.owner_id === userUid || data.ownerUid === userUid;
  let myRole: 'owner' | 'student' = isOwner ? 'owner' : 'student';

  if (!isOwner && userUid) {
    const memberDoc = await getDoc(doc(db, 'classrooms', classId, 'members', userUid));
    if (memberDoc.exists()) {
      myRole = memberDoc.data()?.role || 'student';
    }
  }

  return {
    id: classDoc.id,
    name: data.name,
    subject: data.subject,
    description: data.description,
    section: data.section,
    academic_level: data.academic_level,
    owner_id: data.owner_id || data.ownerUid,
    ownerUid: data.ownerUid || data.owner_id,
    owner_name: data.owner_name || 'Instructor',
    owner_email: data.owner_email,
    invite_code: data.invite_code || data.access_key,
    access_key: data.access_key || data.invite_code,
    accessKeyNormalized: data.accessKeyNormalized || normalizeAccessKey(data.invite_code || ''),
    joining_enabled: data.joining_enabled !== false,
    member_count: data.member_count || 1,
    created_at: formatTimestamp(data.created_at),
    updated_at: formatTimestamp(data.updated_at),
    my_role: myRole,
    is_teacher: myRole === 'owner',
    is_member: true,
    teacher_name: data.owner_name || 'Instructor',
  };
};

// -------------------------------------------------------------
// ACCESS KEY REGENERATION & MANAGEMENT
// -------------------------------------------------------------

export const regenerateFirestoreAccessKey = async (
  classId: string,
  userUid: string,
  subject?: string
): Promise<string> => {
  const classDoc = await getDoc(doc(db, 'classrooms', classId));
  if (!classDoc.exists()) throw new Error('Classroom not found.');
  
  const oldKey = classDoc.data()?.invite_code || classDoc.data()?.access_key || '';
  const oldNormalizedKey = normalizeAccessKey(oldKey);

  const newKey = generateAccessKey(subject || classDoc.data()?.subject);
  const newNormalizedKey = normalizeAccessKey(newKey);
  const newHash = await hashAccessKey(newKey);

  const batch = writeBatch(db);

  // 1. Update Classroom document
  batch.update(doc(db, 'classrooms', classId), {
    invite_code: newKey,
    access_key: newKey,
    accessKeyNormalized: newNormalizedKey,
    access_key_hash: newHash,
    updated_at: serverTimestamp(),
  });

  // 2. Remove old key from registry
  if (oldNormalizedKey) {
    batch.delete(doc(db, 'classAccessKeys', oldNormalizedKey));
  }

  // 3. Register new key in registry
  batch.set(doc(db, 'classAccessKeys', newNormalizedKey), {
    classroomId: classId,
    classId: classId,
    accessKey: newKey,
    accessKeyNormalized: newNormalizedKey,
    ownerUid: userUid,
    createdAt: serverTimestamp(),
  });

  await batch.commit();

  // Audit activity log (never record key)
  logClientActivity({
    action: 'classroom.key_regenerated',
    category: 'classroom',
    resource_type: 'classroom',
    resource_id: classId,
    classroom_id: classId,
    outcome: 'success',
    metadata: { classroom_id: classId },
  });

  return newKey;
};

export const toggleFirestoreJoining = async (classId: string, enabled: boolean): Promise<void> => {
  await updateDoc(doc(db, 'classrooms', classId), {
    joining_enabled: enabled,
    updated_at: serverTimestamp(),
  });
};

export const deleteFirestoreClassroom = async (classId: string, userUid: string): Promise<void> => {
  const classDoc = await getDoc(doc(db, 'classrooms', classId));
  if (classDoc.exists()) {
    const key = classDoc.data()?.accessKeyNormalized || normalizeAccessKey(classDoc.data()?.invite_code || '');
    if (key) {
      try {
        await deleteDoc(doc(db, 'classAccessKeys', key));
      } catch (e) {}
    }
  }

  try {
    await deleteDoc(doc(db, 'users', userUid, 'classrooms', classId));
  } catch (e) {}

  await deleteDoc(doc(db, 'classrooms', classId));
};

export const leaveFirestoreClassroom = async (classId: string, userUid: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'users', userUid, 'classrooms', classId));
  } catch (e) {}

  await deleteDoc(doc(db, 'classrooms', classId, 'members', userUid));
  await updateDoc(doc(db, 'classrooms', classId), {
    member_count: increment(-1),
    updated_at: serverTimestamp(),
  });
};

export const removeFirestoreMember = async (classId: string, studentUid: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'users', studentUid, 'classrooms', classId));
  } catch (e) {}

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
      user_id: data.user_id || data.uid || d.id,
      student_id: data.student_id || data.user_id || d.id,
      student_name: data.student_name || 'Class Member',
      student_username: data.student_username || 'member',
      email: data.email || '',
      role: data.role || 'student',
      joined_at: formatTimestamp(data.joined_at || data.joinedAt),
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
// RESOURCES & CODE SNIPPETS
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
      category: data.category || 'Study Material',
      language: data.language,
      source_code: data.source_code,
      file_url: data.file_url,
      storage_path: data.storage_path,
      file_name: data.file_name,
      file_size: data.file_size,
      mime_type: data.mime_type,
      author_name: data.author_name || 'Instructor',
      uploaded_by: data.uploaded_by,
      created_at: formatTimestamp(data.created_at),
    };
  });
};

export const createFirestoreResource = async (
  classId: string,
  userUid: string,
  userName: string,
  data: {
    resource_type: 'note' | 'document' | 'code' | 'link';
    title: string;
    description?: string;
    category?: string;
    language?: string;
    source_code?: string;
    file?: File | null;
    file_url?: string;
  },
  onProgress?: (progress: number) => void
): Promise<FirestoreClassResource> => {
  let fileUrl = data.file_url || '';
  let storagePath = '';
  let fileName = '';
  let fileSize = 0;
  let mimeType = '';

  if (data.file) {
    fileName = data.file.name;
    fileSize = data.file.size;
    mimeType = data.file.type;
    storagePath = `classrooms/${classId}/resources/${Date.now()}_${data.file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, data.file);

    fileUrl = await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => reject(error),
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });
  }

  const coll = collection(db, 'classrooms', classId, 'resources');
  const docRef = await addDoc(coll, {
    resource_type: data.resource_type,
    title: data.title.trim(),
    description: data.description?.trim() || '',
    category: data.category || 'General',
    language: data.language || null,
    source_code: data.source_code || null,
    file_url: fileUrl || null,
    storage_path: storagePath || null,
    file_name: fileName || null,
    file_size: fileSize || null,
    mime_type: mimeType || null,
    author_name: userName || 'Instructor',
    uploaded_by: userUid,
    created_at: serverTimestamp(),
  });

  return {
    id: docRef.id,
    classroom_id: classId,
    resource_type: data.resource_type,
    title: data.title.trim(),
    description: data.description?.trim() || '',
    category: data.category || 'General',
    language: data.language,
    source_code: data.source_code,
    file_url: fileUrl,
    storage_path: storagePath,
    file_name: fileName,
    file_size: fileSize,
    mime_type: mimeType,
    author_name: userName || 'Instructor',
    uploaded_by: userUid,
    created_at: new Date().toISOString(),
  };
};

export const deleteFirestoreResource = async (classId: string, resourceId: string): Promise<void> => {
  const resDoc = await getDoc(doc(db, 'classrooms', classId, 'resources', resourceId));
  if (resDoc.exists()) {
    const storagePath = resDoc.data()?.storage_path;
    if (storagePath) {
      try {
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
      } catch (e) {}
    }
  }
  await deleteDoc(doc(db, 'classrooms', classId, 'resources', resourceId));
};

// -------------------------------------------------------------
// ASSIGNMENTS & SUBMISSIONS
// -------------------------------------------------------------

export const getFirestoreAssignments = async (classId: string, userUid?: string): Promise<FirestoreClassAssignment[]> => {
  const snap = await getDocs(collection(db, 'classrooms', classId, 'assignments'));
  const assignments: FirestoreClassAssignment[] = [];

  for (const aDoc of snap.docs) {
    const data = aDoc.data();
    let mySubmissionStatus = 'pending';

    if (userUid) {
      try {
        const subDoc = await getDoc(doc(db, 'classrooms', classId, 'assignments', aDoc.id, 'submissions', userUid));
        if (subDoc.exists()) {
          mySubmissionStatus = subDoc.data()?.status || 'submitted';
        }
      } catch (e) {}
    }

    assignments.push({
      id: aDoc.id,
      classroom_id: classId,
      title: data.title,
      description: data.description || '',
      instructions: data.instructions || '',
      starter_code: data.starter_code || '',
      starter_language: data.starter_language || 'cpp',
      program_language: data.program_language || data.starter_language || 'cpp',
      due_date: data.due_date,
      max_score: data.max_score || 100,
      created_by: data.created_by,
      created_by_name: data.created_by_name || 'Instructor',
      created_at: formatTimestamp(data.created_at),
      my_submission_status: mySubmissionStatus,
    });
  }

  return assignments;
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
    due_date: data.due_date || null,
    max_score: data.max_score || 100,
    created_by: userUid,
    created_by_name: userName || 'Instructor',
    created_at: serverTimestamp(),
  });

  return {
    id: docRef.id,
    classroom_id: classId,
    title: data.title.trim(),
    description: data.description?.trim() || '',
    instructions: data.instructions?.trim() || '',
    starter_code: data.starter_code || '',
    starter_language: data.starter_language || 'cpp',
    due_date: data.due_date,
    max_score: data.max_score || 100,
    created_by: userUid,
    created_by_name: userName || 'Instructor',
    created_at: new Date().toISOString(),
    my_submission_status: 'pending',
  };
};

export const submitFirestoreAssignment = async (
  classId: string,
  assignmentId: string,
  userUid: string,
  userName: string,
  userEmail: string,
  sourceCode: string,
  language: string
): Promise<FirestoreAssignmentSubmission> => {
  const subRef = doc(db, 'classrooms', classId, 'assignments', assignmentId, 'submissions', userUid);
  const now = new Date().toISOString();

  await setDoc(subRef, {
    student_uid: userUid,
    student_name: userName || 'Student',
    student_email: userEmail || '',
    source_code: sourceCode,
    language: language || 'cpp',
    status: 'submitted',
    submitted_at: serverTimestamp(),
  });

  return {
    id: userUid,
    assignment_id: assignmentId,
    classroom_id: classId,
    student_uid: userUid,
    student_name: userName || 'Student',
    student_email: userEmail,
    source_code: sourceCode,
    language: language,
    status: 'submitted',
    submitted_at: now,
  };
};

export const getFirestoreSubmissions = async (
  classId: string,
  assignmentId: string
): Promise<FirestoreAssignmentSubmission[]> => {
  const coll = collection(db, 'classrooms', classId, 'assignments', assignmentId, 'submissions');
  const snap = await getDocs(coll);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      assignment_id: assignmentId,
      classroom_id: classId,
      student_uid: data.student_uid || d.id,
      student_name: data.student_name || 'Student',
      student_email: data.student_email || '',
      source_code: data.source_code || '',
      language: data.language || 'cpp',
      status: data.status || 'submitted',
      score: data.score,
      feedback: data.feedback,
      submitted_at: formatTimestamp(data.submitted_at),
    };
  });
};
