const abrirJuegos = document.querySelector("#abrir-juegos");
const navJuegos = document.querySelector("#nav-juegos");
const cerrarJuegos = document.querySelector("#cerrar-juegos");
const headerJuegos = document.querySelector("header"); // El header que contiene el navbar

abrirJuegos.addEventListener("click", () => {
    navJuegos.classList.add("visible");
    headerJuegos.classList.add("menu-abierto-juegos");
});

cerrarJuegos.addEventListener("click", () => {
    navJuegos.classList.remove("visible");
    headerJuegos.classList.remove("menu-abierto-juegos");
});