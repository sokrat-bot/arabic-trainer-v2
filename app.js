(() => {
  'use strict';

  const STORAGE_KEY = 'huruf-arabic-trainer-progress-v1';
  const TOTAL_LETTERS = 28;
  const buttons = Array.from(document.querySelectorAll('[data-letter-id]'));
  let learned = new Set();

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) learned = new Set(saved.filter((id) => typeof id === 'string'));
  } catch {
    // The trainer remains usable if local storage is unavailable or blocked.
    learned = new Set();
  }

  const updateProgress = () => {
    const count = Math.min(learned.size, TOTAL_LETTERS);
    const percentage = Math.round((count / TOTAL_LETTERS) * 100);

    document.querySelectorAll('[data-progress-count]').forEach((element) => {
      element.textContent = String(count);
    });
    document.querySelectorAll('[data-progress-label]').forEach((element) => {
      element.textContent = `Изучено ${count} из ${TOTAL_LETTERS} букв`;
    });
    document.querySelectorAll('[data-progress-bar]').forEach((bar) => {
      bar.style.width = `${percentage}%`;
      const progress = bar.closest('[role="progressbar"]');
      if (progress) {
        progress.setAttribute('aria-valuenow', String(count));
        progress.setAttribute('aria-valuetext', `${count} из ${TOTAL_LETTERS} букв`);
      }
    });
  };

  const renderButtons = () => {
    buttons.forEach((button) => {
      const isLearned = learned.has(button.dataset.letterId);
      button.setAttribute('aria-pressed', String(isLearned));
      button.closest('.letter-card')?.classList.toggle('is-learned', isLearned);
      const label = button.querySelector('[data-learn-label]');
      if (label) label.textContent = isLearned ? 'Уже изучена — отменить' : 'Отметить изученной';
    });
    updateProgress();
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.letterId;
      if (!id) return;
      if (learned.has(id)) learned.delete(id);
      else learned.add(id);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(learned)));
      } catch {
        // Keep the current-page interaction functional even without persistent storage.
      }
      renderButtons();
    });
  });

  renderButtons();
})();
