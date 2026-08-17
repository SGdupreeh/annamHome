document.querySelectorAll('[data-faq-button]').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    if (answer) answer.hidden = expanded;
  });
});

document.querySelectorAll('[data-landing-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.hidden = true;
    form.parentElement?.querySelector('[data-landing-success]')?.classList.add('is-visible');
  });
});
