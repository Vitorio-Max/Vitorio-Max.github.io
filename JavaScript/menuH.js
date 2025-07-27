document.addEventListener("DOMContentLoaded", () => {
    // --- Lógica del Menú de Navegación (antes mHvitorio.js) ---
    const abrirMenuBtn = document.querySelector("#abrir"); // O #abrir-juegos si ese es el ID consistente
    const navMenu = document.querySelector("#nav");     // O #nav-juegos si ese es el ID consistente
    const cerrarMenuBtn = document.querySelector("#cerrar"); // O #cerrar-juegos si ese es el ID consistente
    const headerElement = document.querySelector("header");

    // Asegurarse de que los elementos del menú existan antes de añadir event listeners
    if (abrirMenuBtn && navMenu && cerrarMenuBtn && headerElement) {
        abrirMenuBtn.addEventListener("click", () => {
            navMenu.classList.add("visible");
            headerElement.classList.add("menu-abierto");
        });

        cerrarMenuBtn.addEventListener("click", () => {
            navMenu.classList.remove("visible");
            headerElement.classList.remove("menu-abierto");
        });
    }

    // --- Lógica del Formulario de Login/Registro (antes login.js) ---
    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const btnPopup = document.querySelector('.btnLogin-popup');
    const iconClose = document.querySelector('.icon-close');

    // Asegurarse de que los elementos del login existan antes de añadir event listeners
    if (wrapper && loginLink && registerLink && btnPopup && iconClose) {
        registerLink.addEventListener('click', () => {
            wrapper.classList.add('active');
        });

        loginLink.addEventListener('click', () => {
            wrapper.classList.remove('active');
        });

        btnPopup.addEventListener('click', () => {
            wrapper.classList.add('active-popup');
        });

        iconClose.addEventListener('click', () => {
            wrapper.classList.remove('active-popup');
        });
    }
});