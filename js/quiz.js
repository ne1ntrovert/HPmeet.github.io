const quizState = {
  currentQuestion: 0,
  score: 0,
  isAnswering: false
};

function resetQuizState() {
  quizState.currentQuestion = 0;
  quizState.score = 0;
  quizState.isAnswering = false;
}

function clearAnswerFocus() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

function renderQuestion() {
  clearAnswerFocus();

  const q = questions[quizState.currentQuestion];

  DOM.questionText.textContent = q.text;
  DOM.progressText.textContent = `Вопрос ${quizState.currentQuestion + 1} из ${questions.length}`;
  DOM.progressFill.style.width = `${(quizState.currentQuestion / questions.length) * 100}%`;

  DOM.answersContainer.innerHTML = '';

  q.answers.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = answer;
    btn.addEventListener('click', () => handleAnswer(index, btn));
    DOM.answersContainer.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, clickedBtn) {
  if (quizState.isAnswering) return;
  quizState.isAnswering = true;

  const q = questions[quizState.currentQuestion];
  const isCorrect = selectedIndex === q.correct;

  if (isCorrect) {
    quizState.score++;
    clickedBtn.classList.add('answer-btn--correct');
  } else {
    clickedBtn.classList.add('answer-btn--incorrect');
    const correctBtn = DOM.answersContainer.children[q.correct];
    if (correctBtn) {
      correctBtn.classList.add('answer-btn--reveal-correct');
    }
  }

  DOM.answersContainer.querySelectorAll('.answer-btn').forEach(btn => {
    btn.disabled = true;
    btn.blur();
  });

  clearAnswerFocus();

  setTimeout(() => {
    quizState.currentQuestion++;
    quizState.isAnswering = false;

    if (quizState.currentQuestion < questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }, CONFIG.answerDelayMs);
}

function getResultData(correctCount) {
  return results.find(r => correctCount >= r.min && correctCount <= r.max);
}

function showResult() {
  DOM.progressFill.style.width = '100%';

  const result = getResultData(quizState.score);
  DOM.resultScore.textContent = `${quizState.score} из ${questions.length}`;
  DOM.resultTitle.textContent = result.title;
  DOM.resultText.textContent = result.text;

  switchScreen(DOM.quizScreen, DOM.resultScreen);
}

function startQuiz() {
  resetQuizState();
  renderQuestion();
  switchScreen(DOM.startScreen, DOM.quizScreen);
}

function restartQuiz() {
  resetQuizState();
  DOM.progressFill.style.width = '0%';
  switchScreen(DOM.resultScreen, DOM.startScreen);
}

function initApp() {
  DOM.startBtn.addEventListener('click', startQuiz);
  DOM.restartBtn.addEventListener('click', restartQuiz);
}

initApp();
