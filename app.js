const menuButton = document.querySelector('[data-menu-button]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const searchButton = document.querySelector('[data-search-button]');
const searchDialog = document.querySelector('[data-search-dialog]');
const searchInput = document.querySelector('[data-search-input]');
const searchFeedback = document.querySelector('[data-search-feedback]');
const newsletter = document.querySelector('[data-newsletter]');

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menú');
    });
  });
}

if (searchButton && searchDialog) {
  searchButton.addEventListener('click', () => {
    searchDialog.showModal();
    requestAnimationFrame(() => searchInput?.focus());
  });

  searchDialog.addEventListener('click', (event) => {
    const rect = searchDialog.getBoundingClientRect();
    const clickedOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (clickedOutside) searchDialog.close();
  });
}

if (searchInput && searchFeedback) {
  const productNames = [...document.querySelectorAll('.product-card h3')].map((el) => el.textContent.trim());
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLocaleLowerCase('es-MX');
    if (!query) {
      searchFeedback.textContent = 'Escribe para buscar en los productos destacados.';
      return;
    }
    const matches = productNames.filter((name) => name.toLocaleLowerCase('es-MX').includes(query));
    searchFeedback.textContent = matches.length ? `Coincidencias: ${matches.join(' · ')}` : 'No encontré coincidencias en esta muestra. La búsqueda real llegará con el catálogo.';
  });
}

document.querySelectorAll('.heart-button').forEach((button) => {
  button.addEventListener('click', () => {
    const favorite = button.classList.toggle('is-favorite');
    button.textContent = favorite ? '♥' : '♡';
    const label = button.getAttribute('aria-label') || '';
    button.setAttribute('aria-label', favorite ? label.replace('Agregar', 'Quitar') : label.replace('Quitar', 'Agregar'));
  });
});

if (newsletter) {
  newsletter.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = newsletter.parentElement?.querySelector('.form-message');
    if (message) message.textContent = 'Demo visual lista. Conectaremos el formulario al backend en la fase de tienda.';
    newsletter.reset();
  });
}
