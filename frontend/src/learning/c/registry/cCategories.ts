import { CCategoryId, CCategoryMeta } from '../core/types';

export const C_CATEGORIES: CCategoryMeta[] = [
  {
    id: 'basics',
    folder: 'Basics',
    name: 'Basics & Arithmetic',
    description: 'Elementary C programs, arithmetic calculations, area, perimeter, and unit conversions.',
    icon: 'Calculator',
    badgeColor: 'blue',
  },
  {
    id: 'if-else',
    folder: 'If Else',
    name: 'Conditional Flow (If-Else)',
    description: 'Decision branches, conditions, positive/negative, leap years, and comparative logic.',
    icon: 'GitBranch',
    badgeColor: 'emerald',
  },
  {
    id: 'number-checking',
    folder: 'Number Checkinhg',
    name: 'Number Checking & Digit Logic',
    description: 'Armstrong, Prime, Perfect, Neon, Palindrome, Harshad, Spy, and special number tests.',
    icon: 'Hash',
    badgeColor: 'amber',
  },
  {
    id: 'nested-for-loop',
    folder: 'Nested for loop',
    name: 'Nested Loops & Patterns',
    description: 'Star patterns, pyramids, numeric triangles, and matrix coordinates using nested loops.',
    icon: 'Grid',
    badgeColor: 'purple',
  },
  {
    id: 'integer-array',
    folder: 'Integer Array',
    name: '1-D Integer Arrays',
    description: 'Array scanning, maximum, minimum, average, reverse, and element frequencies.',
    icon: 'Layers',
    badgeColor: 'cyan',
  },
  {
    id: 'sorting',
    folder: 'Sorting',
    name: 'Sorting & Searching',
    description: 'Bubble sort, Selection sort, Insertion sort, Linear search, and Binary search.',
    icon: 'ArrowUpDown',
    badgeColor: 'rose',
  },
  {
    id: 'matrix',
    folder: '2-D Matrix',
    name: '2-D Matrix Operations',
    description: 'Matrix addition, multiplication, transpose, diagonals, triangles, and spiral traversal.',
    icon: 'Grid3X3',
    badgeColor: 'indigo',
  },
  {
    id: 'character-array',
    folder: 'Character array',
    name: 'Character Arrays & Strings',
    description: 'String length, vowel/consonant count, concatenation, comparison, and character scanning.',
    icon: 'Type',
    badgeColor: 'teal',
  },
  {
    id: 'structure',
    folder: 'Structure',
    name: 'Structures (struct)',
    description: 'Compound data records for students and employees, search by roll number and name.',
    icon: 'Users2',
    badgeColor: 'orange',
  },
  {
    id: 'storage-class',
    folder: 'Storage class',
    name: 'Storage Classes & Scopes',
    description: 'Understanding variable scopes, lifetimes, and storage specifiers (auto, static, extern, register).',
    icon: 'Database',
    badgeColor: 'pink',
  },
  {
    id: 'file-handling',
    folder: 'File handling',
    name: 'File Handling Streams',
    description: 'Virtual disk file read, write, append, and file pointer manipulation in C.',
    icon: 'HardDrive',
    badgeColor: 'slate',
  },
];

export function getCategoryMeta(id: CCategoryId): CCategoryMeta | undefined {
  return C_CATEGORIES.find((c) => c.id === id);
}
