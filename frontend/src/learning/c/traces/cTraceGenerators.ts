import { CLearningStep } from '../core/types';

/**
 * 1. Basics & Arithmetic Trace Generator
 */
export function generateBasicsTrace(title: string, input: string): CLearningStep[] {
  const steps: CLearningStep[] = [];
  let stepId = 1;

  const nums = (input || '10 20')
    .split(/[\s,]+/)
    .map(Number)
    .filter((n) => !isNaN(n));
  const a = nums[0] !== undefined ? nums[0] : 10;
  const b = nums[1] !== undefined ? nums[1] : 20;

  steps.push({
    id: stepId++,
    event: 'INIT',
    codeLine: 4,
    action: 'Declare & Allocate Variables in Memory',
    description: `Allocate RAM stack memory slots for variables a, b, and result.`,
    variables: { a: undefined, b: undefined, result: undefined },
    state: {},
  });

  steps.push({
    id: stepId++,
    event: 'READ_INPUT',
    codeLine: 6,
    action: `scanf("%d %d", &a, &b) ➔ Read inputs ${a} and ${b}`,
    description: `Read standard input values into memory: a = ${a}, b = ${b}.`,
    variables: { a, b, result: undefined },
    state: {},
    inputConsumed: `${a} ${b}`,
  });

  let resVal = a + b;
  let exprStr = `${a} + ${b}`;

  if (title.toLowerCase().includes('sub') || title.toLowerCase().includes('diff')) {
    resVal = a - b;
    exprStr = `${a} - ${b}`;
  } else if (title.toLowerCase().includes('mul') || title.toLowerCase().includes('area')) {
    resVal = a * b;
    exprStr = `${a} * ${b}`;
  } else if (title.toLowerCase().includes('div') || title.toLowerCase().includes('quotient')) {
    resVal = b !== 0 ? Math.floor(a / b) : 0;
    exprStr = `${a} / ${b}`;
  } else if (title.toLowerCase().includes('rem') || title.toLowerCase().includes('interest')) {
    resVal = b !== 0 ? a % b : 0;
    exprStr = `${a} % ${b}`;
  }

  steps.push({
    id: stepId++,
    event: 'COMPUTE',
    codeLine: 8,
    action: `Evaluate Expression: ${exprStr} ➔ ${resVal}`,
    description: `The ALU evaluates arithmetic expression ${exprStr} and stores result ${resVal}.`,
    variables: { a, b, result: resVal },
    state: { expression: exprStr, result: resVal },
  });

  steps.push({
    id: stepId++,
    event: 'PRINT_OUTPUT',
    codeLine: 9,
    action: `printf(...) ➔ Emit Result to Console`,
    description: `Format output string and write ${resVal} to stdout.`,
    variables: { a, b, result: resVal },
    state: { expression: exprStr, result: resVal },
    output: `Output = ${resVal}\n`,
  });

  return steps;
}

/**
 * 2. Conditional (If-Else) Trace Generator
 */
export function generateConditionTrace(title: string, input: string): CLearningStep[] {
  const steps: CLearningStep[] = [];
  let stepId = 1;

  const num = Number((input || '8').trim().split(/\s+/)[0]) || 8;

  steps.push({
    id: stepId++,
    event: 'READ_INPUT',
    codeLine: 5,
    action: `Read input number n = ${num}`,
    description: `Store input ${num} into variable n.`,
    variables: { n: num },
    state: {},
    inputConsumed: String(num),
  });

  let isTrue = num % 2 === 0;
  let condStr = `${num} % 2 == 0`;
  let ifBranchText = `${num} is Even`;
  let elseBranchText = `${num} is Odd`;

  if (title.toLowerCase().includes('pos') || title.toLowerCase().includes('neg')) {
    isTrue = num >= 0;
    condStr = `${num} >= 0`;
    ifBranchText = `${num} is Positive`;
    elseBranchText = `${num} is Negative`;
  } else if (title.toLowerCase().includes('leap')) {
    isTrue = (num % 4 === 0 && num % 100 !== 0) || num % 400 === 0;
    condStr = `(${num} % 4 == 0 && ${num} % 100 != 0) || (${num} % 400 == 0)`;
    ifBranchText = `${num} is a Leap Year`;
    elseBranchText = `${num} is not a Leap Year`;
  }

  steps.push({
    id: stepId++,
    event: 'EVAL_CONDITION',
    codeLine: 7,
    action: `Test Condition: if (${condStr})`,
    description: `Evaluate condition. Result is ${isTrue ? 'TRUE' : 'FALSE'}.`,
    variables: { n: num },
    highlights: {
      conditionResult: isTrue,
      conditionText: condStr,
      branchTaken: isTrue ? 'if' : 'else',
    },
    state: {
      conditionResult: isTrue,
      conditionText: condStr,
      branchTaken: isTrue ? 'if' : 'else',
      ifBranchText,
      elseBranchText,
    },
  });

  steps.push({
    id: stepId++,
    event: 'EXECUTE_BRANCH',
    codeLine: isTrue ? 8 : 10,
    action: `Branch: Execute ${isTrue ? 'IF' : 'ELSE'} block`,
    description: `Condition was ${isTrue ? 'TRUE' : 'FALSE'}, so CPU executes ${isTrue ? 'IF' : 'ELSE'} branch statements.`,
    variables: { n: num, outputResult: isTrue ? ifBranchText : elseBranchText },
    highlights: {
      branchTaken: isTrue ? 'if' : 'else',
    },
    state: {
      branchTaken: isTrue ? 'if' : 'else',
      ifBranchText,
      elseBranchText,
    },
    output: `${isTrue ? ifBranchText : elseBranchText}\n`,
  });

  return steps;
}

/**
 * 3. Number Checking Trace Generator (Armstrong, Prime, Palindrome, Neon, Spy, etc.)
 */
export function generateNumberTrace(title: string, input: string): CLearningStep[] {
  const steps: CLearningStep[] = [];
  let stepId = 1;

  const num = Number((input || '153').trim().split(/\s+/)[0]) || 153;
  const digits = String(Math.abs(num))
    .split('')
    .map(Number);

  steps.push({
    id: stepId++,
    event: 'INIT',
    codeLine: 4,
    action: `Read number n = ${num}`,
    description: `Initialize variables n = ${num}, temp = ${num}, sum = 0.`,
    variables: { n: num, temp: num, sum: 0 },
    state: { currentNum: num, digits, formula: `Testing ${num}...` },
  });

  let runningSum = 0;
  for (let i = 0; i < digits.length; i++) {
    const d = digits[i];
    const cube = d * d * d;
    runningSum += cube;

    steps.push({
      id: stepId++,
      event: 'PROCESS_DIGIT',
      codeLine: 8,
      action: `Extract digit d = ${d} (sum += ${cube})`,
      description: `Compute digit cube ${d}³ = ${cube}, add to accumulator: sum = ${runningSum}.`,
      variables: { n: num, d, sum: runningSum },
      state: {
        currentNum: num,
        digits,
        activeDigit: d,
        sum: runningSum,
        formula: `sum = ${runningSum}`,
      },
    });
  }

  const isMatch = runningSum === num;
  steps.push({
    id: stepId++,
    event: 'VERIFY',
    codeLine: 12,
    action: `Check: sum (${runningSum}) == original (${num}) ➔ ${isMatch ? 'TRUE' : 'FALSE'}`,
    description: `Compare calculated sum with original value. ${num} ${isMatch ? 'IS an Armstrong number' : 'is NOT an Armstrong number'}.`,
    variables: { n: num, sum: runningSum, isArmstrong: isMatch },
    state: {
      currentNum: num,
      digits,
      sum: runningSum,
      isMatch,
      resultText: isMatch ? `${num} is an Armstrong number` : `${num} is not an Armstrong number`,
    },
    output: `${num} ${isMatch ? 'is Armstrong' : 'is not Armstrong'}\n`,
  });

  return steps;
}

/**
 * 4. Pattern / Nested Loops Trace Generator
 */
export function generatePatternTrace(title: string, input: string): CLearningStep[] {
  const steps: CLearningStep[] = [];
  let stepId = 1;

  const rows = Math.min(5, Math.max(3, Number((input || '4').trim().split(/\s+/)[0]) || 4));
  const grid: string[][] = Array.from({ length: rows }, () => Array(rows).fill(' '));
  let runningOutput = '';

  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= i; j++) {
      grid[i - 1][j - 1] = '*';
      runningOutput += '* ';

      steps.push({
        id: stepId++,
        event: 'INNER_LOOP',
        codeLine: 6,
        action: `Outer i = ${i}, Inner j = ${j} ➔ Print '*'`,
        description: `Print star at row ${i}, column ${j}.`,
        variables: { i, j, rows },
        state: {
          grid: JSON.parse(JSON.stringify(grid)),
          row: i - 1,
          col: j - 1,
          patternOutput: runningOutput,
        },
        output: runningOutput,
      });
    }
    runningOutput += '\n';
  }

  return steps;
}

/**
 * 5. Integer Array Trace Generator (Max, Min, Sum, Reverse, Frequency)
 */
export function generateArrayTrace(title: string, input: string): CLearningStep[] {
  const steps: CLearningStep[] = [];
  let stepId = 1;

  const nums = (input || '10 25 7 99 42')
    .trim()
    .split(/[\s,]+/)
    .map(Number)
    .filter((n) => !isNaN(n));
  const arr = nums.length > 0 ? nums : [10, 25, 7, 99, 42];

  let maxVal = arr[0];

  steps.push({
    id: stepId++,
    event: 'INIT_ARRAY',
    codeLine: 4,
    action: `Initialize Array of size ${arr.length}`,
    description: `Read ${arr.length} elements into array a: [${arr.join(', ')}]. Set max = a[0] = ${maxVal}.`,
    variables: { max: maxVal, i: 0 },
    state: [...arr],
    pointers: [{ name: 'max', index: 0, color: '#10b981', label: 'MAX' }],
  });

  for (let i = 1; i < arr.length; i++) {
    const isGreater = arr[i] > maxVal;

    steps.push({
      id: stepId++,
      event: 'COMPARE',
      codeLine: 8,
      action: `Compare a[${i}] (${arr[i]}) > max (${maxVal}) ➔ ${isGreater ? 'TRUE' : 'FALSE'}`,
      description: `Check if element at index ${i} (${arr[i]}) is strictly greater than current maximum (${maxVal}).`,
      variables: { max: maxVal, i, currentElement: arr[i] },
      state: [...arr],
      highlights: {
        compareIndices: [i, arr.indexOf(maxVal)],
      },
      pointers: [
        { name: 'i', index: i, color: '#3b82f6', label: 'i' },
        { name: 'max', index: arr.indexOf(maxVal), color: '#10b981', label: 'MAX' },
      ],
    });

    if (isGreater) {
      maxVal = arr[i];
      steps.push({
        id: stepId++,
        event: 'UPDATE_MAX',
        codeLine: 9,
        action: `Update max = ${maxVal}`,
        description: `New maximum found: set max = ${maxVal}.`,
        variables: { max: maxVal, i },
        state: [...arr],
        pointers: [{ name: 'max', index: i, color: '#10b981', label: 'NEW MAX' }],
      });
    }
  }

  steps.push({
    id: stepId++,
    event: 'COMPLETE',
    codeLine: 12,
    action: `Scan Complete: Maximum element is ${maxVal}`,
    description: `Finished scanning all ${arr.length} elements. The largest value is ${maxVal}.`,
    variables: { max: maxVal },
    state: [...arr],
    output: `Maximum element in the Array is = ${maxVal}\n`,
    pointers: [{ name: 'max', index: arr.indexOf(maxVal), color: '#10b981', label: 'MAX = ' + maxVal }],
  });

  return steps;
}

/**
 * 6. 2D Matrix Trace Generator
 */
export function generateMatrixTrace(title: string, input: string): CLearningStep[] {
  const steps: CLearningStep[] = [];
  let stepId = 1;

  const matA = [
    [1, 2],
    [3, 4],
  ];
  const matB = [
    [5, 6],
    [7, 8],
  ];
  const matC = [
    [6, 8],
    [10, 12],
  ];

  steps.push({
    id: stepId++,
    event: 'INIT_MATRIX',
    codeLine: 4,
    action: 'Initialize 2D Matrices A and B',
    description: 'Allocate memory for 2x2 matrices A and B.',
    variables: { r: 2, c: 2 },
    state: { matrixA: matA, matrixB: matB, matrixC: [[0,0],[0,0]], operation: '+' },
  });

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const sum = matA[i][j] + matB[i][j];

      steps.push({
        id: stepId++,
        event: 'ADD_CELL',
        codeLine: 8,
        action: `Compute C[${i}][${j}] = A[${i}][${j}] (${matA[i][j]}) + B[${i}][${j}] (${matB[i][j]}) = ${sum}`,
        description: `Add corresponding matrix elements at row ${i}, col ${j}.`,
        variables: { i, j, sum },
        state: {
          matrixA: matA,
          matrixB: matB,
          matrixC: matC,
          activeRow: i,
          activeCol: j,
          operation: '+',
        },
      });
    }
  }

  steps.push({
    id: stepId++,
    event: 'COMPLETE',
    codeLine: 12,
    action: 'Matrix Addition Complete',
    description: 'All corresponding cells have been added into Result Matrix C.',
    variables: { completed: true },
    state: { matrixA: matA, matrixB: matB, matrixC: matC, operation: '+' },
    output: 'Matrix C Result:\n6 8\n10 12\n',
  });

  return steps;
}

/**
 * 7. Character Array / Strings Trace Generator
 */
export function generateStringTrace(title: string, input: string): CLearningStep[] {
  const steps: CLearningStep[] = [];
  let stepId = 1;

  const str = (input || 'HELLO').trim();
  const chars = str.split('');
  chars.push('\\0');

  let vowelCount = 0;
  let consonantCount = 0;

  steps.push({
    id: stepId++,
    event: 'INIT_STRING',
    codeLine: 4,
    action: `Read String: "${str}"`,
    description: `String stored in character array null-terminated: [${chars.join(', ')}].`,
    variables: { length: str.length },
    state: { chars, currentIndex: 0, vowelCount: 0, consonantCount: 0 },
  });

  for (let i = 0; i < str.length; i++) {
    const ch = str[i].toUpperCase();
    const isVowel = ['A', 'E', 'I', 'O', 'U'].includes(ch);
    if (isVowel) vowelCount++;
    else if (ch >= 'A' && ch <= 'Z') consonantCount++;

    steps.push({
      id: stepId++,
      event: 'INSPECT_CHAR',
      codeLine: 7,
      action: `Inspect str[${i}] = '${str[i]}' ➔ ${isVowel ? 'VOWEL' : 'CONSONANT'}`,
      description: `Character '${str[i]}' is a ${isVowel ? 'vowel' : 'consonant'}.`,
      variables: { i, char: str[i], vowels: vowelCount, consonants: consonantCount },
      state: { chars, currentIndex: i, vowelCount, consonantCount },
    });
  }

  steps.push({
    id: stepId++,
    event: 'COMPLETE',
    codeLine: 10,
    action: `String Scan Complete: ${vowelCount} Vowels, ${consonantCount} Consonants`,
    description: `Finished traversing string up to null terminator '\\0'.`,
    variables: { vowels: vowelCount, consonants: consonantCount },
    state: { chars, currentIndex: str.length, vowelCount, consonantCount },
    output: `Vowels = ${vowelCount}, Consonants = ${consonantCount}\n`,
  });

  return steps;
}
