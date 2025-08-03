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


// Lógica para el selector de juegos (para desktop y el nuevo select móvil)
document.addEventListener("DOMContentLoaded", () => {
    const currentPagePath = window.location.pathname; // Obtiene la ruta actual (ej. /proyectoAppNinos/vocales.html)
    const currentFileName = currentPagePath.split('/').pop(); // Obtiene solo el nombre del archivo de la página actual (ej. vocales.html)

    // Lógica para los enlaces de la lista (desktop)
    const gameLinks = document.querySelectorAll('.game-links-list .game-link');
    gameLinks.forEach(link => {
        const linkFileName = link.href.split('/').pop();
        if (linkFileName === currentFileName) {
            link.classList.add('current-game');
            link.setAttribute('aria-current', 'page');
            link.addEventListener('click', (e) => e.preventDefault()); // Evita la navegación
        } else {
            link.classList.remove('current-game');
        }
    });

    // Lógica para el select desplegable (móvil)
    const gameSelectorDropdown = document.getElementById('game-selector-dropdown');

    // Establece la opción seleccionada si la página actual coincide con una opción
    let selectedOptionFound = false;
    for (let i = 0; i < gameSelectorDropdown.options.length; i++) {
        const optionValue = gameSelectorDropdown.options[i].value;
        const optionFileName = optionValue.split('/').pop(); // Extrae solo el nombre del archivo de la opción
        if (optionFileName === currentFileName) {
            gameSelectorDropdown.value = optionValue;
            selectedOptionFound = true;
            break;
        }
    }
    // Si no se encuentra la página actual entre las opciones, selecciona la primera opción deshabilitada
    if (!selectedOptionFound && gameSelectorDropdown.options.length > 0) {
        gameSelectorDropdown.value = gameSelectorDropdown.options[0].value;
    }


    // Añade el evento para redirigir cuando se selecciona una opción
    gameSelectorDropdown.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        if (selectedValue) { // Asegura que no sea la opción "Selecciona un Juego" vacía
            window.location.href = selectedValue; // Redirige a la URL seleccionada
        }
    });
});