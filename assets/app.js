const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const dialog = document.querySelector('[data-consult-dialog]');
const hero = document.querySelector('[data-hero]');
const heroProgress = document.querySelector('[data-hero-progress]');

const updateHeader = () => {
  const heroHeight = hero?.offsetHeight ?? window.innerHeight;
  const heroIsActive = window.scrollY < heroHeight - 90;
  const heroTravel = Math.min(1, Math.max(0, window.scrollY / Math.max(heroHeight, 1)));

  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  header?.classList.toggle('is-hero', heroIsActive);
  hero?.classList.toggle('is-past', !heroIsActive);
  if (heroProgress) heroProgress.style.transform = `scaleX(${0.12 + heroTravel * 0.88})`;
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', updateHeader);

const setMenu = (open) => {
  menuButton?.setAttribute('aria-expanded', String(open));
  menuButton?.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileMenu?.setAttribute('aria-hidden', String(!open));
  mobileMenu?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
};

menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') setMenu(false);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.13 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const presets = {
  compact: { modules: 2 },
  family: { modules: 3 },
  lounge: { modules: 4 }
};

const colors = {
  sand: '#ded1bc',
  olive: '#626c50',
  clay: '#a85f46'
};

const builder = {
  form: document.querySelector('[data-builder-form]'),
  sofa: document.querySelector('[data-builder-sofa]'),
  count: document.querySelector('[data-module-count]'),
  price: document.querySelector('[data-price]'),
  width: document.querySelector('[data-width]'),
  modules: 3,
  color: 'sand'
};

const formatPrice = (value) => new Intl.NumberFormat('ru-RU').format(value);

const renderBuilder = () => {
  if (!builder.sofa) return;
  builder.sofa.innerHTML = '';

  for (let index = 0; index < builder.modules; index += 1) {
    const module = document.createElement('span');
    module.className = 'builder-module';
    module.style.setProperty('--module-color', colors[builder.color]);
    module.setAttribute('aria-hidden', 'true');
    builder.sofa.append(module);
  }

  const width = 98 + builder.modules * 62;
  const basePrice = 72000;
  const colorFactor = builder.color === 'olive' ? 1.06 : builder.color === 'clay' ? 1.09 : 1;
  const price = Math.round((builder.modules * basePrice * colorFactor) / 1000) * 1000;

  builder.count.value = builder.modules;
  builder.count.textContent = builder.modules;
  builder.width.textContent = `${width} см`;
  builder.price.textContent = `от ${formatPrice(price)} ₽`;
  builder.sofa.style.width = `${Math.min(48 + builder.modules * 9, 88)}%`;
};

builder.form?.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  if (target.name === 'preset') builder.modules = presets[target.value].modules;
  if (target.name === 'color') builder.color = target.value;
  renderBuilder();
});

builder.form?.querySelectorAll('[data-step]').forEach((button) => {
  button.addEventListener('click', () => {
    const direction = Number(button.dataset.step);
    builder.modules = Math.min(5, Math.max(2, builder.modules + direction));
    renderBuilder();
  });
});

renderBuilder();

const materialVisual = document.querySelector('[data-material-visual]');
document.querySelectorAll('[data-material]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-material]').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    materialVisual.dataset.current = button.dataset.material;
  });
});

const openDialog = () => {
  if (!dialog) return;
  setMenu(false);
  if (typeof dialog.showModal === 'function') dialog.showModal();
};

document.querySelectorAll('[data-open-consult]').forEach((button) => button.addEventListener('click', openDialog));
document.querySelector('[data-close-consult]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const leadForm = document.querySelector('[data-lead-form]');
leadForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  leadForm.hidden = true;
  document.querySelector('[data-form-success]')?.classList.add('is-visible');
});

const room = document.querySelector('.hero-room');
if (room && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  room.addEventListener('pointermove', (event) => {
    const bounds = room.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    room.querySelector('.sofa--hero').style.transform = `translate3d(${x * 8}px, ${y * 5}px, 0)`;
    room.querySelector('.hero-room__plant').style.marginRight = `${x * -6}px`;
  });
}

const setupRail = ({ railSelector, previousSelector, nextSelector, progressSelector }) => {
  const rail = document.querySelector(railSelector);
  const previous = document.querySelector(previousSelector);
  const next = document.querySelector(nextSelector);
  const progress = document.querySelector(progressSelector);
  if (!rail) return;

  const updateProgress = () => {
    const distance = rail.scrollWidth - rail.clientWidth;
    const ratio = distance > 0 ? rail.scrollLeft / distance : 0;
    if (progress) progress.style.width = `${Math.max(18, (ratio * 82) + 18)}%`;
  };

  const move = (direction) => rail.scrollBy({ left: direction * rail.clientWidth * 0.72, behavior: 'smooth' });
  previous?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));
  rail.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  let pointerStart = 0;
  let scrollStart = 0;
  let isDragging = false;

  rail.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerStart = event.clientX;
    scrollStart = rail.scrollLeft;
    isDragging = true;
    rail.setPointerCapture(event.pointerId);
    rail.classList.add('is-dragging');
  });

  rail.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    rail.scrollLeft = scrollStart - (event.clientX - pointerStart);
  });

  const endDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    rail.classList.remove('is-dragging');
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
  };

  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', endDrag);
};

setupRail({
  railSelector: '[data-media-rail]',
  previousSelector: '[data-rail-prev]',
  nextSelector: '[data-rail-next]',
  progressSelector: '[data-rail-progress]'
});

setupRail({
  railSelector: '[data-collection-rail]',
  previousSelector: '[data-collection-prev]',
  nextSelector: '[data-collection-next]',
  progressSelector: '[data-collection-progress]'
});
