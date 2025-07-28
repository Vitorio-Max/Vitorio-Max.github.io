const abrirJuegos = document.querySelector("#abrir-juegos");
const navJuegos = document.querySelector("#nav-juegos");
const cerrarJuegos = document.querySelector("#cerrar-juegos");
const headerJuegos = document.querySelector("header"); // El header que contiene el navbar

abrirJuegos.addEventListener("click", () => {
    navJuegos.classList.add("visible");
    headerJuegos.classList.add("menu-abierto");
});

cerrarJuegos.addEventListener("click", () => {
    navJuegos.classList.remove("visible");
    headerJuegos.classList.remove("menu-abierto");
});


// Añadir esto en tu JavaScript global CURRENT GAMES, SELECTOR FOCO
document.addEventListener("DOMContentLoaded", () => {
    const currentPagePath = window.location.pathname; // Obtiene la ruta actual (ej. /proyectoAppNinos/vocales.html)
    const gameLinks = document.querySelectorAll('.game-selector-nav .game-link');

    gameLinks.forEach(link => {
        // Obtenemos solo el nombre del archivo del enlace (ej. vocales.html)
        const linkFileName = link.href.split('/').pop();
        // Obtenemos solo el nombre del archivo de la página actual (ej. vocales.html)
        const currentFileName = currentPagePath.split('/').pop();

        if (linkFileName === currentFileName) {
            link.classList.add('current-game');
            // Opcional: Para evitar que sea clicable si ya estás en esa página
            link.setAttribute('aria-current', 'page'); // Buena práctica de accesibilidad
            link.addEventListener('click', (e) => e.preventDefault()); // Evita la navegación
        } else {
            link.classList.remove('current-game'); // Asegura que no tenga la clase si no es la actual
        }
    });
});