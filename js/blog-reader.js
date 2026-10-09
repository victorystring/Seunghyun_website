/* Progressive enhancements; articles and citations are readable without JavaScript. */
(() => {
  const menu = document.querySelector('.navbar-toggler');
  const navigation = document.getElementById('ftco-nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('show', open);
  });

  const contents = document.querySelector('.article-toc details');
  const mobile = window.matchMedia('(max-width: 991px)');
  const setContentsMode = () => { if (contents) contents.open = !mobile.matches; };
  setContentsMode();
  mobile.addEventListener('change', setContentsMode);
  contents?.addEventListener('click', event => {
    if (!mobile.matches && event.target.closest('summary')) event.preventDefault();
    if (mobile.matches && event.target.closest('a')) contents.open = false;
  });

  const article = document.querySelector('.article-body');
  const progress = document.querySelector('.reading-progress span');
  const headings = [...document.querySelectorAll('.article-body h2[id]')];
  const tocLinks = [...document.querySelectorAll('.toc-links a')];
  let scheduled = false;
  const updateReading = () => {
    scheduled = false;
    if (!article) return;
    const top = article.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(1, article.offsetHeight - window.innerHeight + 140);
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, (window.scrollY - top + 140) / distance * 100))}%`;
    let active = headings[0]?.id;
    for (const heading of headings) { if (heading.getBoundingClientRect().top <= 150) active = heading.id; }
    for (const link of tocLinks) {
      if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  const scheduleReading = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateReading); } };
  window.addEventListener('scroll', scheduleReading, { passive: true });
  window.addEventListener('resize', scheduleReading, { passive: true });
  updateReading();

  const dialog = document.querySelector('.figure-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    const image = dialog.querySelector('img');
    const caption = dialog.querySelector('.dialog-caption');
    document.querySelectorAll('.figure-zoom').forEach(link => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const source = link.querySelector('img');
      image.src = source.currentSrc || source.src;
      image.alt = source.alt;
      const sourceCaption = link.closest('figure').querySelector('figcaption');
      caption.replaceChildren(...(sourceCaption ? [...sourceCaption.childNodes].map(node => node.cloneNode(true)) : []));
      dialog.showModal();
    }));
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  }
})();
