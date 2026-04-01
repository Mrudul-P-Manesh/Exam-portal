// In-memory data store for the demo
// Replace this with MongoDB/Mongoose models for production

const store = {
  users: [
    { id: 1, username: 'admin', password: 'Admin#2026', role: 'admin', suspicionScore: 0, hasStarted: false, hasCompleted: false },
  ],
  candidateAccessPasswords: ['password123'],
  questions: [
    {
      id: 1,
      language: 'Python',
      title: 'Reverse String Bug',
      description: 'The Python function below should return the reversed string, but it currently skips characters and never returns the result. Fix the bug.',
      codeSnippet: `def reverse_string(text):\n    reversed_text = ""\n    for i in range(len(text) - 1, 0, -1):\n        reversed_text += text[i]\n`,
      sampleInput: '"hello"',
      sampleOutput: '"olleh"'
    },
    {
      id: 2,
      language: 'Python',
      title: 'List Sum Bug',
      description: 'This Python function should return the sum of all numbers in a list, but it misses values and fails on some inputs. Fix it.',
      codeSnippet: `def sum_numbers(numbers):\n    total = 0\n    for i in range(len(numbers) - 1):\n        total += numbers[i]\n    return numbers\n`,
      sampleInput: '[1, 2, 3]',
      sampleOutput: '6'
    },
    {
      id: 3,
      language: 'Python',
      title: 'Count Vowels Bug',
      description: 'This Python function should count vowels in a string, but the condition is wrong and the counter resets every loop. Fix it.',
      codeSnippet: `def count_vowels(text):\n    count = 0\n    for ch in text.lower():\n        if ch == 'a' or 'e' or 'i' or 'o' or 'u':\n            count = 1\n    return count\n`,
      sampleInput: '"education"',
      sampleOutput: '5'
    },
    {
      id: 4,
      language: 'C',
      title: 'Factorial Loop Bug',
      description: 'This C function should return the factorial of a positive integer, but the loop and initial value are incorrect. Fix it.',
      codeSnippet: `int factorial(int n) {\n    int result = 0;\n    for (int i = 1; i < n; i++) {\n        result *= i;\n    }\n    return result;\n}`,
      sampleInput: '5',
      sampleOutput: '120'
    },
    {
      id: 5,
      language: 'C',
      title: 'Maximum In Array',
      description: 'This C function should return the largest element in the array, but it compares the wrong way and skips the first value. Fix it.',
      codeSnippet: `int find_max(int arr[], int size) {\n    int max = 0;\n    for (int i = 1; i < size; i++) {\n        if (arr[i] < max) {\n            max = arr[i];\n        }\n    }\n    return max;\n}`,
      sampleInput: '{4, 9, 2, 7}',
      sampleOutput: '9'
    },
    {
      id: 6,
      language: 'C',
      title: 'Character Count Bug',
      description: 'This C function should count how many times a character appears in a string, but the loop condition and comparison are incorrect. Fix it.',
      codeSnippet: `int count_char(char str[], char target) {\n    int count = 0;\n    for (int i = 0; str[i] == '\\0'; i++) {\n        if (str[i] = target) {\n            count++;\n        }\n    }\n    return count;\n}`,
      sampleInput: `str = "banana", target = 'a'`,
      sampleOutput: '3'
    }
  ],
  submissions: [], // { userId, questionId, sourceCode, timestamp }
  logs: [], // { id, userId, eventType, metadata, timestamp }
  activeSessions: new Set() // Store active user IDs to prevent multiple logins
};

module.exports = store;
