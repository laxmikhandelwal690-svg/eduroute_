import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Timer, 
  HelpCircle, 
  ChevronRight, 
  BarChart2, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useUISound } from '../../contexts/SoundContext';

const ASSESSMENTS = [
  { id: '1', title: 'React Performance optimization', category: 'Frontend', questions: 20, time: '30m', timeSeconds: 30 * 60, level: 'Intermediate', points: 200 },
  { id: '2', title: 'Node.js Security Patterns', category: 'Backend', questions: 5, time: '5m', timeSeconds: 5 * 60, level: 'Advanced', points: 300 },
  { id: '3', title: 'UI/UX Fundamentals', category: 'Design', questions: 25, time: '40m', timeSeconds: 40 * 60, level: 'Beginner', points: 150 },
];

const QUIZ_QUESTIONS_BY_ASSESSMENT: Record<string, Array<{ id: string; question: string; options: string[]; correctAnswer: string }>> = {
  '1': [
    { id: 'q1', question: 'Which hook should be used to memoize a value and prevent unnecessary re-computations?', options: ['useCallback', 'useMemo', 'useRef', 'useEffect'], correctAnswer: 'useMemo' },
    { id: 'q2', question: 'What does the useCallback hook primarily optimize for?', options: ['DOM updates', 'Function identity stability', 'API fetching', 'Form validation'], correctAnswer: 'Function identity stability' },
    { id: 'q3', question: 'Which React feature is best suited for keeping a mutable value that does not trigger re-renders?', options: ['useMemo', 'useRef', 'useEffect', 'useState'], correctAnswer: 'useRef' },
    { id: 'q4', question: 'Which hook is commonly used to run side effects after render?', options: ['useLayoutEffect', 'useEffect', 'useCallback', 'useMemo'], correctAnswer: 'useEffect' },
    { id: 'q5', question: 'Which React optimization helps prevent a component from rerendering when its props have not changed?', options: ['React.memo', 'useState', 'useContext', 'useReducer'], correctAnswer: 'React.memo' },
    { id: 'q6', question: 'What is the main benefit of lazy loading components in a React app?', options: ['It removes all CSS', 'It reduces the initial bundle size', 'It disables event handlers', 'It prevents route changes'], correctAnswer: 'It reduces the initial bundle size' },
    { id: 'q7', question: 'Which hook is used to mark a state update as a low-priority transition?', options: ['useTransition', 'useMemo', 'useLayoutEffect', 'useRef'], correctAnswer: 'useTransition' },
    { id: 'q8', question: 'Which React feature is used to show a fallback UI while content is still loading?', options: ['Suspense', 'useReducer', 'useContext', 'useCallback'], correctAnswer: 'Suspense' },
    { id: 'q9', question: 'Why are keys important when rendering lists in React?', options: ['They improve CSS styling', 'They help React identify which items changed', 'They create global variables', 'They disable debugging'], correctAnswer: 'They help React identify which items changed' },
    { id: 'q10', question: 'What is the best reason to use code splitting in a frontend application?', options: ['To make every component global', 'To load only the code that is needed at a given moment', 'To remove JavaScript entirely', 'To speed up server APIs'], correctAnswer: 'To load only the code that is needed at a given moment' },
    { id: 'q11', question: 'What is the primary goal of memoization in React?', options: ['To avoid repeated expensive calculations', 'To replace CSS animations', 'To disable props', 'To create routes'], correctAnswer: 'To avoid repeated expensive calculations' },
    { id: 'q12', question: 'Which of the following is usually a good reason to use a reducer instead of multiple useState calls?', options: ['It always re-renders less', 'It is useful for complex state logic', 'It cannot manage arrays', 'It prevents rendering entirely'], correctAnswer: 'It is useful for complex state logic' },
    { id: 'q13', question: 'Which React DevTools feature is most helpful for identifying performance bottlenecks?', options: ['Profiler', 'Console', 'Debugger', 'Network Tab'], correctAnswer: 'Profiler' },
    { id: 'q14', question: 'What is the purpose of the dependency array in useEffect?', options: ['It decides when the effect should rerun', 'It sets CSS classes', 'It maps rendered items', 'It stores API responses'], correctAnswer: 'It decides when the effect should rerun' },
    { id: 'q15', question: 'Which pattern is best for rendering many rows without slowing the UI?', options: ['Virtualized lists', 'Inline styles only', 'Large images everywhere', 'Duplicating DOM nodes'], correctAnswer: 'Virtualized lists' },
    { id: 'q16', question: 'Why should you avoid reading from localStorage directly inside render?', options: ['It always crashes the app', 'It can cause unnecessary rerenders and side effects', 'It removes routes', 'It makes components immutable'], correctAnswer: 'It can cause unnecessary rerenders and side effects' },
    { id: 'q17', question: 'Which hook is appropriate when you need to store a mutable value that should not trigger rerenders?', options: ['useRef', 'useMemo', 'useEffect', 'useState'], correctAnswer: 'useRef' },
    { id: 'q18', question: 'What is the main advantage of splitting large components into smaller ones?', options: ['It decreases code readability', 'It makes reusability and maintenance easier', 'It automatically removes bugs', 'It disables testing'], correctAnswer: 'It makes reusability and maintenance easier' },
    { id: 'q19', question: 'Which approach helps make large forms easier to manage in React?', options: ['Using controlled components with state', 'Hardcoding all values in HTML', 'Avoiding validation', 'Removing labels'], correctAnswer: 'Using controlled components with state' },
    { id: 'q20', question: 'When should you prefer useMemo over a normal variable?', options: ['When the value is expensive to recompute and depends on inputs', 'When you want to change CSS', 'When you need a new route', 'When the component is hidden'], correctAnswer: 'When the value is expensive to recompute and depends on inputs' },
  ],
  '2': [
    { id: 'q1', question: 'Which of the following is the best way to reduce exposure of sensitive data in a Node.js API?', options: ['Store secrets in source files', 'Use environment variables and secret managers', 'Log request payloads in production', 'Expose debug headers publicly'], correctAnswer: 'Use environment variables and secret managers' },
    { id: 'q2', question: 'What is the primary purpose of setting secure HTTP headers in a Node.js application?', options: ['Improve HTML rendering speed', 'Protect against common web vulnerabilities', 'Reduce database queries', 'Enable gzip compression'], correctAnswer: 'Protect against common web vulnerabilities' },
    { id: 'q3', question: 'Which practice is most important when validating user input on the server side?', options: ['Trust client-side validation only', 'Never validate inputs on the backend', 'Sanitize and validate all incoming data', 'Only validate admin requests'], correctAnswer: 'Sanitize and validate all incoming data' },
    { id: 'q4', question: 'Why is rate limiting useful in a backend service?', options: ['It reduces file size on disk', 'It prevents abuse and brute-force attacks', 'It speeds up CSS loading', 'It automatically backs up logs'], correctAnswer: 'It prevents abuse and brute-force attacks' },
    { id: 'q5', question: 'Which method is best for storing passwords securely?', options: ['Plain text storage', 'SHA-1 hashing only', 'Bcrypt or Argon2 hashing', 'Encoding in URL params'], correctAnswer: 'Bcrypt or Argon2 hashing' },
    { id: 'q6', question: 'What is the main reason to use prepared statements in database queries?', options: ['To speed up CSS delivery', 'To prevent SQL injection', 'To reduce memory usage', 'To shorten API routes'], correctAnswer: 'To prevent SQL injection' },
    { id: 'q7', question: 'Which action is recommended when handling JSON web tokens?', options: ['Store tokens in browser localStorage with no validation', 'Verify signature and expiration on every request', 'Expose tokens in HTML comments', 'Skip token revocation'], correctAnswer: 'Verify signature and expiration on every request' },
    { id: 'q8', question: 'What is the main purpose of configuring CORS correctly?', options: ['To improve database indexing', 'To control which origins can access your API', 'To make CSS render faster', 'To remove authentication'], correctAnswer: 'To control which origins can access your API' },
    { id: 'q9', question: 'Which practice is most important when logging application errors?', options: ['Log full secrets and tokens', 'Avoid logging user data', 'Ensure sensitive details are redacted', 'Store logs in source control'], correctAnswer: 'Ensure sensitive details are redacted' },
    { id: 'q10', question: 'Why is least-privilege access important in backend systems?', options: ['It reduces the attack surface', 'It adds more dependencies', 'It speeds up UI rendering', 'It removes testing'], correctAnswer: 'It reduces the attack surface' },
    { id: 'q11', question: 'Which of the following is the safest approach for session handling?', options: ['Store session IDs in plain text cookies without validation', 'Use secure, signed, HTTP-only cookies', 'Keep sessions in public HTML', 'Disable session expiration'], correctAnswer: 'Use secure, signed, HTTP-only cookies' },
    { id: 'q12', question: 'What is the best reason to add request rate limiting?', options: ['To make code smaller', 'To protect the API from brute-force and abuse', 'To remove the need for validation', 'To improve CSS performance'], correctAnswer: 'To protect the API from brute-force and abuse' },
    { id: 'q13', question: 'What should you do with user-supplied file uploads?', options: ['Accept them without checks', 'Validate type, size, and storage location', 'Place them in the public root by default', 'Use them directly as SQL input'], correctAnswer: 'Validate type, size, and storage location' },
    { id: 'q14', question: 'Which approach improves reliability when a service depends on external APIs?', options: ['Disable retries entirely', 'Add retries, timeouts, and circuit breakers', 'Use synchronous calls everywhere', 'Ignore failures'], correctAnswer: 'Add retries, timeouts, and circuit breakers' },
    { id: 'q15', question: 'Why is cache invalidation important in backend services?', options: ['It prevents stale or incorrect data from being served', 'It removes the need for security checks', 'It guarantees zero database queries', 'It reduces all network traffic instantly'], correctAnswer: 'It prevents stale or incorrect data from being served' },
  ],
  '3': [
    { id: 'q1', question: 'Which principle is most important for creating clear and usable interface design?', options: ['Using as many colors as possible', 'Keeping interfaces consistent and easy to understand', 'Adding animation to every action', 'Making all elements the same size'], correctAnswer: 'Keeping interfaces consistent and easy to understand' },
    { id: 'q2', question: 'What does good visual hierarchy help users do?', options: ['Skip reading content', 'Understand what is most important first', 'Increase page load time', 'Remove all spacing'], correctAnswer: 'Understand what is most important first' },
    { id: 'q3', question: 'Why is accessibility important in UI/UX design?', options: ['It only affects visual style', 'It helps all users, including those with disabilities, use the product better', 'It replaces the need for testing', 'It reduces the number of pages'], correctAnswer: 'It helps all users, including those with disabilities, use the product better' },
    { id: 'q4', question: 'Which design choice usually improves usability on mobile devices?', options: ['Crowded layouts with tiny tap targets', 'Large touch-friendly controls and clear spacing', 'Hiding navigation menus', 'Using only one font size'], correctAnswer: 'Large touch-friendly controls and clear spacing' },
    { id: 'q5', question: 'What is the main role of white space in UI design?', options: ['It separates and organizes content for readability', 'It removes all content from view', 'It hides navigation', 'It removes color contrast'], correctAnswer: 'It separates and organizes content for readability' },
    { id: 'q6', question: 'Which design element best supports consistent user expectations?', options: ['Random icon shapes', 'Standardized layouts and patterns', 'Changing button styles on every screen', 'Using only one color'], correctAnswer: 'Standardized layouts and patterns' },
    { id: 'q7', question: 'Why should form fields provide clear labels?', options: ['To reduce transparency', 'To help users understand what to enter', 'To increase code length', 'To remove validation'], correctAnswer: 'To help users understand what to enter' },
    { id: 'q8', question: 'What is the benefit of using strong visual contrast in text and buttons?', options: ['It makes the interface harder to scan', 'It improves readability and discoverability', 'It reduces spacing', 'It hides animation'], correctAnswer: 'It improves readability and discoverability' },
    { id: 'q9', question: 'Which UX principle is most important when designing error states?', options: ['Hide errors from users', 'Guide users clearly toward a fix', 'Use longer loading bars', 'Remove all secondary text'], correctAnswer: 'Guide users clearly toward a fix' },
    { id: 'q10', question: 'What is a good reason to use clear call-to-action buttons?', options: ['To confuse users', 'To make the next action obvious', 'To reduce page height', 'To replace headings'], correctAnswer: 'To make the next action obvious' },
    { id: 'q11', question: 'Which practice is best for designing accessible color choices?', options: ['Use low contrast text for decorative effects', 'Ensure enough contrast for readability', 'Avoid colors altogether', 'Use only grayscale'], correctAnswer: 'Ensure enough contrast for readability' },
    { id: 'q12', question: 'Why is consistency important in typography?', options: ['It creates visual harmony and improves comprehension', 'It limits all text to one size forever', 'It replaces the need for layout', 'It removes all hierarchy'], correctAnswer: 'It creates visual harmony and improves comprehension' },
    { id: 'q13', question: 'What should a good onboarding flow do?', options: ['Make users guess the next step', 'Introduce key features with minimal friction', 'Hide all actions', 'Avoid branding'], correctAnswer: 'Introduce key features with minimal friction' },
    { id: 'q14', question: 'Which interaction pattern is most helpful for guiding users through a multi-step process?', options: ['A clear progress indicator', 'Random transitions', 'Hidden actions', 'No navigation'], correctAnswer: 'A clear progress indicator' },
    { id: 'q15', question: 'Why is feedback important after a user performs an action?', options: ['It confirms the result and reduces uncertainty', 'It slows down the interface', 'It hides the next step', 'It avoids all testing'], correctAnswer: 'It confirms the result and reduces uncertainty' },
    { id: 'q16', question: 'What does a good dashboard design prioritize?', options: ['Showing every detail equally', 'Highlighting the most important information first', 'Eliminating all color', 'Removing charts'], correctAnswer: 'Highlighting the most important information first' },
    { id: 'q17', question: 'Which design choice helps users better understand content at a glance?', options: ['Dense blocks of text with no spacing', 'Clear headings, spacing, and grouping', 'Tiny icons everywhere', 'Random alignment'], correctAnswer: 'Clear headings, spacing, and grouping' },
    { id: 'q18', question: 'Why should interactive elements have clear hover and focus states?', options: ['To make the product feel slower', 'To help users understand where they are and what is selectable', 'To remove all colors', 'To hide content'], correctAnswer: 'To help users understand where they are and what is selectable' },
    { id: 'q19', question: 'What is the main purpose of content hierarchy?', options: ['To make every element equal', 'To guide attention from most to least important content', 'To avoid all typography', 'To replace navigation'], correctAnswer: 'To guide attention from most to least important content' },
    { id: 'q20', question: 'Which option best supports inclusive design?', options: ['Assuming all users have the same needs', 'Designing for keyboard, screen reader, and touch users', 'Removing all text labels', 'Using only one visual style'], correctAnswer: 'Designing for keyboard, screen reader, and touch users' },
    { id: 'q21', question: 'What is a good reason to simplify a UI?', options: ['It makes the interface easier to understand', 'It removes the need for testing', 'It makes the page load slower', 'It increases confusion'], correctAnswer: 'It makes the interface easier to understand' },
    { id: 'q22', question: 'Which of these is most useful for improving the trustworthiness of a product?', options: ['Inconsistent messages and colors', 'Clear, honest, and predictable user feedback', 'Hidden validation messages', 'Very small text'], correctAnswer: 'Clear, honest, and predictable user feedback' },
    { id: 'q23', question: 'Why is responsive design important?', options: ['It allows experiences to adapt to different screen sizes and devices', 'It removes all mobile features', 'It prevents users from changing layouts', 'It reduces the need for accessibility'], correctAnswer: 'It allows experiences to adapt to different screen sizes and devices' },
    { id: 'q24', question: 'What is the best approach for designing successful microinteractions?', options: ['Make them subtle, informative, and consistent', 'Hide them completely', 'Use them for every possible action', 'Make them overly aggressive'], correctAnswer: 'Make them subtle, informative, and consistent' },
    { id: 'q25', question: 'Which UX improvement is most likely to reduce user frustration?', options: ['Unexpected changes in layout', 'Clear defaults, validation, and recovery paths', 'Removing all instructions', 'Using only icon-only controls'], correctAnswer: 'Clear defaults, validation, and recovery paths' },
  ],
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const buildQuestionSet = (
  availableQuestions: Array<{ id: string; question: string; options: string[]; correctAnswer: string }>,
  requestedCount: number
) => {
  const safeCount = Math.max(0, Math.min(requestedCount, availableQuestions.length));
  return availableQuestions.slice(0, safeCount);
};

export const Assessments = () => {
  const [view, setView] = useState<'list' | 'quiz' | 'results'>('list');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('1');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerRecords, setAnswerRecords] = useState<Array<{ questionId: string; selectedAnswer: string; correctAnswer: string }>>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ASSESSMENTS[0].timeSeconds);
  const { playAchievement } = useUISound();

  const activeAssessment = ASSESSMENTS.find((test) => test.id === selectedAssessmentId) ?? ASSESSMENTS[0];
  const activeQuizQuestions = buildQuestionSet(
    QUIZ_QUESTIONS_BY_ASSESSMENT[selectedAssessmentId] ?? QUIZ_QUESTIONS_BY_ASSESSMENT['1'],
    activeAssessment.questions
  );
  const currentQuestion = activeQuizQuestions[currentQuestionIndex];
  const totalQuestions = activeQuizQuestions.length;

  const resetQuiz = (testId: string) => {
    const nextAssessment = ASSESSMENTS.find((test) => test.id === testId) ?? ASSESSMENTS[0];

    setSelectedAssessmentId(testId);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerRecords([]);
    setCorrectAnswers(0);
    setTimeLeft(nextAssessment.timeSeconds);
    setView('quiz');
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const nextRecords = [
      ...answerRecords,
      {
        questionId: currentQuestion.id,
        selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
      },
    ];

    setAnswerRecords(nextRecords);
    setCorrectAnswers((prevCount) => prevCount + (isCorrect ? 1 : 0));

    if (currentQuestionIndex === totalQuestions - 1) {
      setView('results');
      return;
    }

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedAnswer(null);
  };

  useEffect(() => {
    if (view === 'results') {
      playAchievement();
    }
  }, [view, playAchievement]);

  useEffect(() => {
    if (view !== 'quiz') return;

    setTimeLeft(activeAssessment.timeSeconds);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setView('results');
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [view]);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      {view === 'list' && (
        <>
          <header className="mb-16">
            <h1 className="text-5xl font-black text-slate-900 mb-6 dark:text-white">Skill Assessments</h1>
            <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed dark:text-slate-300">
              Validate your knowledge, earn points, and unlock exclusive rewards. 
              Our tests are designed to find your learning gaps.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              <Trophy className="h-10 w-10 mb-6 opacity-80" />
              <div className="text-4xl font-black">1,250</div>
              <div className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Total Points</div>
            </div>
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-700">
              <BarChart2 className="h-10 w-10 mb-6 text-emerald-500" />
              <div className="text-4xl font-black text-slate-900 dark:text-white">84%</div>
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 dark:text-slate-200">Avg. Accuracy</div>
            </div>
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-700">
              <Clock className="h-10 w-10 mb-6 text-amber-500" />
              <div className="text-4xl font-black text-slate-900 dark:text-white">12</div>
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 dark:text-slate-200">Tests Completed</div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 mb-8 dark:text-white">Weekly Challenges</h2>
            {ASSESSMENTS.map((test) => (
              <motion.div 
                key={test.id}
                whileHover={{ scale: 1.01 }}
                className="group flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-[40px] border border-slate-50 shadow-sm hover:shadow-2xl transition-all dark:bg-slate-900 dark:border-slate-700"
              >
                <div className="flex items-center gap-8 mb-6 md:mb-0">
                  <div className="h-20 w-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm dark:bg-slate-800 dark:text-indigo-300">
                    <HelpCircle className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{test.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-[11px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-300">
                      <span className="text-indigo-600 font-black">{test.category}</span>
                      <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                      <span>{test.questions} Questions</span>
                      <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                      <span>{test.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="hidden lg:flex flex-col items-end mr-6">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest dark:text-slate-400">Difficulty</span>
                    <span className="text-xs font-black text-slate-700 mt-1 dark:text-slate-200">{test.level.toUpperCase()}</span>
                  </div>
                  <button 
                    onClick={() => resetQuiz(test.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100"
                  >
                    Take Test <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {view === 'quiz' && currentQuestion && (
        <div className="max-w-4xl mx-auto py-12">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={() => setView('list')} className="p-4 hover:bg-white rounded-2xl border border-slate-100 transition-all text-slate-400 hover:text-slate-900 shadow-sm">
                <ChevronRight className="h-6 w-6 rotate-180" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{activeAssessment.title}</h2>
                <div className="h-2 w-48 bg-slate-100 rounded-full mt-2">
                   <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 text-amber-600 rounded-[20px] font-black text-lg border border-amber-100 shadow-sm">
              <Timer className="h-6 w-6" /> {formatTime(timeLeft)}
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-50 p-12 shadow-2xl dark:bg-slate-900 dark:border-slate-700">
            <div className="mb-12">
              <span className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">Question {currentQuestionIndex + 1} / {totalQuestions}</span>
              <h3 className="text-3xl font-black text-slate-900 mt-4 leading-tight dark:text-white">
                {currentQuestion.question}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((opt, i) => {
                const isSelected = selectedAnswer === opt;

                return (
                  <button 
                    key={opt}
                    onClick={() => setSelectedAnswer(opt)}
                    className={`group w-full text-left p-6 rounded-[28px] border-2 transition-all flex items-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-400 dark:bg-slate-800'
                        : 'border-slate-50 hover:border-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl mr-6 font-black transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-indigo-500'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`text-lg font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 group-hover:text-indigo-900 dark:text-slate-200 dark:group-hover:text-indigo-200'}`}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-16 flex justify-between items-center">
              <button 
                onClick={() => {
                  if (currentQuestionIndex === totalQuestions - 1) {
                    setView('results');
                    return;
                  }

                  setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                  setSelectedAnswer(null);
                }}
                className="px-8 py-4 text-slate-400 font-black uppercase tracking-widest text-sm hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
              >
                Skip
              </button>
              <button 
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Submit Assessment' : 'Confirm & Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'results' && (
        <div className="max-w-3xl mx-auto py-12 text-center">
          <div className="inline-flex items-center justify-center h-32 w-32 bg-green-50 rounded-[40px] text-green-600 mb-10 shadow-sm border border-green-100">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6">Great Progress!</h2>
          <p className="text-slate-500 text-xl mb-16 font-medium leading-relaxed dark:text-slate-300">You've completed the assessment with an impressive score. Points have been added to your profile.</p>

          <div className="grid grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
              <div className="text-5xl font-black text-indigo-600">{correctAnswers}/{totalQuestions}</div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4 dark:text-slate-400">Correct Answers</div>
            </div>
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
              <div className="text-5xl font-black text-amber-500">+{Math.round((activeAssessment.points * correctAnswers) / totalQuestions)}</div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4 dark:text-slate-400">Points Gained</div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-10 rounded-[40px] flex items-start gap-8 text-left mb-16 dark:bg-slate-800 dark:border-slate-700">
            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-white">
               <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h4 className="text-xl font-black text-indigo-900 mb-2 dark:text-indigo-200">Identify Your Gap</h4>
              <p className="text-indigo-700 font-medium leading-relaxed dark:text-indigo-300">
                {correctAnswers >= Math.ceil(totalQuestions / 2)
                  ? `Nice work — you answered ${correctAnswers} out of ${totalQuestions} questions correctly. Keep going to strengthen your understanding.`
                  : 'You struggled with some key concepts. We have highlighted the most relevant topics in the roadmap so you can revisit them.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => setView('list')}
              className="flex-1 py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200"
            >
              Back to Skill Center
            </button>
            <button className="flex-1 py-5 bg-white border border-slate-200 text-slate-900 rounded-[24px] font-black text-lg hover:bg-slate-50 transition-all">
              Download Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
