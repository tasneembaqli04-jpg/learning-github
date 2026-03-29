// ===========================
//  GitLearn — script.js
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTerminal();
  initCounters();
  initScrollAnimations();
  initCommandFilter();
  initQuiz();
});

// ──────────────────────────
// THEME TOGGLE
// ──────────────────────────
function initTheme() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('gitlearn-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  btn.textContent = saved === 'dark' ? '☀️' : '🌙';

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('gitlearn-theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

// ──────────────────────────
// ANIMATED TERMINAL
// ──────────────────────────
const TERMINAL_DEMOS = [
  {
    cmd: 'git init my-project',
    output: [
      { text: 'Initialized empty Git repository in ~/my-project/.git/', cls: 'output-success' }
    ]
  },
  {
    cmd: 'git add .',
    output: []
  },
  {
    cmd: 'git commit -m "Initial commit"',
    output: [
      { text: '[main (root-commit) a1b2c3d] Initial commit', cls: 'output-success' },
      { text: ' 3 files changed, 42 insertions(+)', cls: 'output-info' }
    ]
  },
  {
    cmd: 'git push origin main',
    output: [
      { text: 'Enumerating objects: 3, done.', cls: '' },
      { text: 'Counting objects: 100% (3/3), done.', cls: '' },
      { text: 'To https://github.com/user/my-project.git', cls: 'output-success' },
      { text: ' * [new branch] main -> main', cls: 'output-success' }
    ]
  },
  {
    cmd: 'git status',
    output: [
      { text: 'On branch main', cls: 'output-info' },
      { text: "nothing to commit, working tree clean", cls: 'output-success' }
    ]
  }
];

function initTerminal() {
  const cmdEl = document.getElementById('typingCmd');
  const outputEl = document.getElementById('terminalOutput');
  if (!cmdEl || !outputEl) return;

  let demoIndex = 0;

  function runDemo() {
    const demo = TERMINAL_DEMOS[demoIndex % TERMINAL_DEMOS.length];
    outputEl.innerHTML = '';
    cmdEl.textContent = '';

    typeText(cmdEl, demo.cmd, 60, () => {
      setTimeout(() => {
        demo.output.forEach((line, i) => {
          setTimeout(() => {
            const p = document.createElement('p');
            p.className = `output-line ${line.cls}`;
            p.textContent = line.text;
            outputEl.appendChild(p);
          }, i * 120);
        });

        const totalDelay = demo.output.length * 120 + 1800;
        setTimeout(() => {
          demoIndex++;
          runDemo();
        }, totalDelay);
      }, 300);
    });
  }

  runDemo();
}

function typeText(el, text, speed, onDone) {
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (onDone) onDone();
    }
  }, speed);
}

// ──────────────────────────
// ANIMATED COUNTERS
// ──────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ──────────────────────────
// SCROLL ANIMATIONS
// ──────────────────────────
function initScrollAnimations() {
  const els = document.querySelectorAll('.animate-in');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ──────────────────────────
// COMMAND FILTER
// ──────────────────────────
function initCommandFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.cmd-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeSlideUp 0.35s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ──────────────────────────
// QUIZ
// ──────────────────────────
const QUIZ_QUESTIONS = [
  {
    question: 'מה ההבדל בין git add ל-git commit?',
    options: [
      'git add מעלה ל-GitHub, git commit שומר מקומית',
      'git add מוסיף לבמה (staging), git commit שומר snapshot',
      'אין הבדל, שתיהן עושות אותו דבר',
      'git commit קודם ל-git add'
    ],
    correct: 1,
    explanation: 'git add מוסיף קבצים ל-staging area (הכנה), ו-git commit שומר את ה-snapshot הסופי עם הודעה.'
  },
  {
    question: 'איזו פקודה מורידה שינויים מ-GitHub ומשלבת אותם אוטומטית?',
    options: ['git fetch', 'git clone', 'git pull', 'git sync'],
    correct: 2,
    explanation: 'git pull = git fetch + git merge. הוא מוריד ומשלב בפעולה אחת.'
  },
  {
    question: 'מה עושה git stash?',
    options: [
      'מוחק שינויים לצמיתות',
      'שומר שינויים זמנית בלי commit',
      'יוצר ענף חדש',
      'מעלה קוד ל-GitHub'
    ],
    correct: 1,
    explanation: 'git stash מסתיר שינויים לא מגובים כדי שתוכל לעבור ענף בלי לאבד אותם. git stash pop משחזר אותם.'
  },
  {
    question: 'מה זה Pull Request (PR)?',
    options: [
      'פקודה להורדת קוד מ-GitHub',
      'בקשה לאחר לדחוף קוד לאחסון שלך',
      'בקשה לצוות לבדוק ולמזג ענף שלך',
      'גיבוי אוטומטי של הקוד'
    ],
    correct: 2,
    explanation: 'Pull Request הוא מנגנון ב-GitHub לבקשת Code Review ואישור לפני מיזוג ענף ל-main.'
  },
  {
    question: 'מה עושה git reset --hard HEAD~1?',
    options: [
      'שומר את ה-commit האחרון בנפרד',
      'מבטל את ה-commit האחרון ושומר שינויים',
      'מבטל את ה-commit האחרון ומוחק גם את השינויים',
      'יוצר ענף חדש מה-commit הקודם'
    ],
    correct: 2,
    explanation: '--hard אומר: בטל את ה-commit וגם מחק את השינויים. --soft יבטל אבל ישמור את הקבצים ב-staging.'
  }
];

let currentQ = 0;
let score = 0;
let answered = false;

function initQuiz() {
  renderQuestion();

  document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);
  document.getElementById('restartBtn')?.addEventListener('click', restartQuiz);
}

function renderQuestion() {
  const q = QUIZ_QUESTIONS[currentQ];
  if (!q) return;

  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const resultEl = document.getElementById('quizResult');

  if (questionEl) questionEl.textContent = q.question;
  if (progressFill) progressFill.style.width = `${((currentQ + 1) / QUIZ_QUESTIONS.length) * 100}%`;
  if (progressText) progressText.textContent = `שאלה ${currentQ + 1} מתוך ${QUIZ_QUESTIONS.length}`;
  if (resultEl) resultEl.classList.add('hidden');

  answered = false;

  if (optionsEl) {
    optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleAnswer(i));
      optionsEl.appendChild(btn);
    });
  }

  // Animate card
  const card = document.getElementById('quizCard');
  if (card) {
    card.style.animation = 'none';
    card.offsetHeight; // reflow
    card.style.animation = 'fadeSlideUp 0.4s ease';
  }
}

function handleAnswer(chosen) {
  if (answered) return;
  answered = true;

  const q = QUIZ_QUESTIONS[currentQ];
  const buttons = document.querySelectorAll('.quiz-option');
  const resultEl = document.getElementById('quizResult');
  const resultIcon = document.getElementById('resultIcon');
  const resultText = document.getElementById('resultText');

  buttons.forEach(btn => btn.disabled = true);

  const isCorrect = chosen === q.correct;
  if (isCorrect) score++;

  // Highlight
  buttons[q.correct].classList.add('correct');
  if (!isCorrect) buttons[chosen].classList.add('wrong');

  // Show result
  if (resultEl) {
    resultEl.classList.remove('hidden', 'correct-bg', 'wrong-bg');
    resultEl.classList.add(isCorrect ? 'correct-bg' : 'wrong-bg');
    resultIcon.textContent = isCorrect ? '✅' : '❌';
    resultText.textContent = q.explanation;
  }
}

function nextQuestion() {
  currentQ++;

  const finalEl = document.getElementById('quizFinal');
  const cardEl = document.getElementById('quizCard');
  const progressEl = document.querySelector('.quiz-progress');
  const resultEl = document.getElementById('quizResult');

  if (currentQ >= QUIZ_QUESTIONS.length) {
    if (cardEl) cardEl.classList.add('hidden');
    if (progressEl) progressEl.classList.add('hidden');
    if (resultEl) resultEl.classList.add('hidden');

    if (finalEl) {
      finalEl.classList.remove('hidden');
      const scoreEl = document.getElementById('finalScore');
      const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
      let msg = '';

      if (pct === 100) msg = '🏆 מושלם! שלטת בכל החומר!';
      else if (pct >= 80) msg = '🌟 כל הכבוד! ידע מצוין בגיט!';
      else if (pct >= 60) msg = '👍 לא רע! כדאי לחזור על הפקודות שהחמצת.';
      else msg = '📚 תחזור על החומר וסתדר — Git לוקח קצת זמן!';

      if (scoreEl) scoreEl.textContent = `ענית נכון על ${score} מתוך ${QUIZ_QUESTIONS.length} שאלות (${pct}%). ${msg}`;
    }
    return;
  }

  renderQuestion();
}

function restartQuiz() {
  currentQ = 0;
  score = 0;
  answered = false;

  const finalEl = document.getElementById('quizFinal');
  const cardEl = document.getElementById('quizCard');
  const progressEl = document.querySelector('.quiz-progress');

  if (finalEl) finalEl.classList.add('hidden');
  if (cardEl) cardEl.classList.remove('hidden');
  if (progressEl) progressEl.classList.remove('hidden');

  renderQuestion();
}