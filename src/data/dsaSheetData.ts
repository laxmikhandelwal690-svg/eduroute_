export type DsaQuestion = {
  id: number;
  title: string;
  difficulty: 'Easy';
  gfgUrl: string;
  leetcodeUrl: string;
  codingNinjaUrl: string;
  videoUrl: string;
};

export type DsaTopicSection = {
  topic: string;
  questions: DsaQuestion[];
};

const createQuestions = (topic: string, titles: string[], startId: number): DsaTopicSection => ({
  topic,
  questions: titles.map((title, index) => {
    const id = startId + index;
    const query = encodeURIComponent(`${title} ${topic} dsa`);
    const leetcodeSlug = leetcodeSlugs[title];

    return {
      id,
      title,
      difficulty: 'Easy',
      gfgUrl: '',
      leetcodeUrl: leetcodeSlug ? `https://leetcode.com/problems/${leetcodeSlug}/` : '',
      codingNinjaUrl: `https://www.naukri.com/code360/problem-lists?search=${query}`,
      videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} dsa`)}`,
    };
  }),
});

const leetcodeSlugs: Record<string, string> = {
  'Two Sum problem': 'two-sum',
  'Best time to buy and sell stock': 'best-time-to-buy-and-sell-stock',
  'Valid anagram': 'valid-anagram',
  'Longest common prefix': 'longest-common-prefix',
  'Roman to integer': 'roman-to-integer',
  'Valid parentheses string': 'valid-parentheses',
  'Isomorphic strings': 'isomorphic-strings',
  'Compare version numbers': 'compare-version-numbers',
  'Find middle of linked list': 'middle-of-the-linked-list',
  'Reverse linked list': 'reverse-linked-list',
  'Detect cycle in linked list': 'linked-list-cycle',
  'Merge two sorted linked lists': 'merge-two-sorted-lists',
  'Remove nth node from end': 'remove-nth-node-from-end-of-list',
  'Palindrome linked list': 'palindrome-linked-list',
  'Valid parentheses using stack': 'valid-parentheses',
  'Next greater element': 'next-greater-element-i',
  'Sliding window maximum basic': 'sliding-window-maximum',
  'Binary search iterative': 'binary-search',
  'Search insert position': 'search-insert-position',
  'First and last occurrence': 'find-first-and-last-position-of-element-in-sorted-array',
  'Find peak element': 'find-peak-element',
  'Maximum depth of binary tree': 'maximum-depth-of-binary-tree',
  'Check balanced binary tree': 'balanced-binary-tree',
  'Diameter of binary tree': 'diameter-of-binary-tree',
  'Same tree check': 'same-tree',
  'Symmetric tree': 'symmetric-tree',
  'Lowest common ancestor basic': 'lowest-common-ancestor-of-a-binary-tree',
  'Longest consecutive sequence': 'longest-consecutive-sequence',
  'Subarray sum equals k': 'subarray-sum-equals-k',
  'Two sum with hashmap': 'two-sum',
  'Majority element': 'majority-element',
  'Find duplicate number': 'find-the-duplicate-number',
  'Intersection of two arrays': 'intersection-of-two-arrays',
  'Group anagrams': 'group-anagrams',
  'Happy number': 'happy-number',
  'Contains duplicate': 'contains-duplicate',
  'Top k frequent elements basic': 'top-k-frequent-elements',
  'Permutations of string': 'permutations',
  'Combination sum basic': 'combination-sum',
  'Power function (x^n)': 'powx-n',
};

const topicTitles: Array<{ topic: string; titles: string[] }> = [
  {
    topic: 'Arrays',
    titles: [
      'Find maximum element',
      'Find second largest element',
      'Check if array is sorted',
      'Remove duplicates from sorted array',
      'Left rotate array by one',
      'Move zeros to end',
      'Linear search',
      'Union of two sorted arrays',
      'Missing number in range',
      'Maximum consecutive ones',
      'Single number',
      'Longest subarray with given sum',
      'Two Sum problem',
      'Best time to buy and sell stock',
    ],
  },
  {
    topic: 'Strings',
    titles: [
      'Reverse a string',
      'Check palindrome string',
      'Find first non-repeating character',
      'Valid anagram',
      'Longest common prefix',
      'Implement strstr',
      'Roman to integer',
      'Integer to roman basic',
      'Count vowels and consonants',
      'Sort characters by frequency',
      'Check rotations of string',
      'Valid parentheses string',
      'Isomorphic strings',
      'Compare version numbers',
    ],
  },
  {
    topic: 'Linked List',
    titles: [
      'Traverse linked list',
      'Search in linked list',
      'Insert at beginning',
      'Insert at end',
      'Delete node by value',
      'Find middle of linked list',
      'Reverse linked list',
      'Detect cycle in linked list',
      'Length of cycle in linked list',
      'Merge two sorted linked lists',
      'Remove nth node from end',
      'Palindrome linked list',
    ],
  },
  {
    topic: 'Stack & Queue',
    titles: [
      'Implement stack using array',
      'Implement queue using array',
      'Valid parentheses using stack',
      'Min stack',
      'Implement queue using stacks',
      'Implement stack using queues',
      'Next greater element',
      'Next smaller element',
      'Sliding window maximum basic',
      'Stock span problem',
      'Circular queue',
      'Generate binary numbers with queue',
    ],
  },
  {
    topic: 'Searching & Sorting',
    titles: [
      'Binary search iterative',
      'Lower bound implementation',
      'Upper bound implementation',
      'Search insert position',
      'First and last occurrence',
      'Count occurrences in sorted array',
      'Bubble sort',
      'Selection sort',
      'Insertion sort',
      'Merge sort',
      'Quick sort basic',
      'Find peak element',
    ],
  },
  {
    topic: 'Trees',
    titles: [
      'Binary tree preorder traversal',
      'Binary tree inorder traversal',
      'Binary tree postorder traversal',
      'Level order traversal',
      'Maximum depth of binary tree',
      'Check balanced binary tree',
      'Diameter of binary tree',
      'Same tree check',
      'Symmetric tree',
      'Left view of binary tree',
      'Right view of binary tree',
      'Lowest common ancestor basic',
    ],
  },
  {
    topic: 'Hashing',
    titles: [
      'Frequency of elements',
      'Count distinct elements',
      'Longest consecutive sequence',
      'Subarray sum equals k',
      'Two sum with hashmap',
      'Majority element',
      'Find duplicate number',
      'Intersection of two arrays',
      'Group anagrams',
      'Happy number',
      'Contains duplicate',
      'Top k frequent elements basic',
    ],
  },
  {
    topic: 'Recursion',
    titles: [
      'Print numbers from 1 to n',
      'Print numbers from n to 1',
      'Sum of first n numbers',
      'Factorial of n',
      'Nth fibonacci number',
      'Check palindrome using recursion',
      'Reverse array recursively',
      'Subsequence generation',
      'Subset sum I',
      'Permutations of string',
      'Combination sum basic',
      'Power function (x^n)',
    ],
  },
];

export const dsaSheet: DsaTopicSection[] = topicTitles.reduce<DsaTopicSection[]>((sections, section) => {
  const startId = sections.reduce((total, current) => total + current.questions.length, 0) + 1;
  sections.push(createQuestions(section.topic, section.titles, startId));
  return sections;
}, []);

export const TOTAL_DSA_QUESTIONS = dsaSheet.reduce((total, section) => total + section.questions.length, 0);
