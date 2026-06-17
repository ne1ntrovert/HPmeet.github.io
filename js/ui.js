function switchScreen(from, to) {
  from.classList.add('screen--leaving');
  from.classList.remove('screen--active');

  setTimeout(() => {
    from.classList.remove('screen--leaving');
    from.style.display = 'none';

    to.style.display = 'block';
    requestAnimationFrame(() => {
      to.classList.add('screen--active');
      const card = to.querySelector('.card');
      if (card) {
        card.classList.remove('fade-in');
        void card.offsetWidth;
        card.classList.add('fade-in');
      }
    });
  }, CONFIG.transitionMs);
}
