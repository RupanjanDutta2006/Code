/**
 * CodeVault Pro — Offline Study Materials Storage
 * IndexedDB-backed service for caching downloaded study materials (lessons, notes, PDFs).
 * Materials are scoped per userUid for privacy isolation on shared devices.
 */

const DB_NAME = 'codevault-study-materials-v1';
const STORE_NAME = 'materials';
const DB_VERSION = 1;

export interface StudyMaterial {
  /** Unique resource identifier (e.g. lessonId, noteId, docId) */
  resourceId: string;
  resourceType: 'lesson' | 'note' | 'pdf' | 'code-snippet' | 'assignment';
  title: string;
  /** UID of the user who downloaded this (for isolation) */
  userUid: string;
  classroomId?: string;
  classroomName?: string;
  /** Text or base64-encoded binary content */
  content: string;
  language?: string;
  /** MIME type (text/plain, application/pdf, etc.) */
  mimeType?: string;
  downloadedAt: number;
  /** Approximate size in bytes */
  sizeBytes: number;
  tags?: string[];
}

// ── Internal DB helpers ──────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'resourceId' });
        store.createIndex('byUser', 'userUid', { unique: false });
        store.createIndex('byClassroom', 'classroomId', { unique: false });
        store.createIndex('byType', 'resourceType', { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(
  db: IDBDatabase,
  mode: IDBTransactionMode
): IDBObjectStore {
  return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Save or overwrite a study material for offline use */
export async function saveMaterial(material: StudyMaterial): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, 'readwrite').put(material);
    req.onsuccess = () => { db.close(); resolve(); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

/** Load a single material by its resourceId */
export async function getMaterial(resourceId: string): Promise<StudyMaterial | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, 'readonly').get(resourceId);
    req.onsuccess = () => { db.close(); resolve(req.result ?? null); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

/** Get all materials downloaded by a specific user */
export async function getMaterialsByUser(userUid: string): Promise<StudyMaterial[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const index = tx(db, 'readonly').index('byUser');
    const req = index.getAll(userUid);
    req.onsuccess = () => { db.close(); resolve(req.result ?? []); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

/** Get all materials for a specific classroom (scoped to user) */
export async function getMaterialsByClassroom(
  userUid: string,
  classroomId: string
): Promise<StudyMaterial[]> {
  const all = await getMaterialsByUser(userUid);
  return all.filter((m) => m.classroomId === classroomId);
}

/** Delete a single downloaded material */
export async function deleteMaterial(resourceId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, 'readwrite').delete(resourceId);
    req.onsuccess = () => { db.close(); resolve(); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

/** Delete ALL materials for a user (called on logout) */
export async function clearUserMaterials(userUid: string): Promise<void> {
  const materials = await getMaterialsByUser(userUid);
  const db = await openDB();
  await Promise.all(
    materials.map(
      (m) =>
        new Promise<void>((resolve, reject) => {
          const req = tx(db, 'readwrite').delete(m.resourceId);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        })
    )
  );
  db.close();
}

/** Check if a material is already downloaded */
export async function isMaterialDownloaded(resourceId: string): Promise<boolean> {
  const m = await getMaterial(resourceId);
  return m !== null;
}

/** Approximate total offline storage used by a user (in bytes) */
export async function getTotalStorageBytes(userUid: string): Promise<number> {
  const materials = await getMaterialsByUser(userUid);
  return materials.reduce((sum, m) => sum + (m.sizeBytes || 0), 0);
}

/** Helper: format bytes as human-readable string */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}