const abrir = document.querySelector("#abrir");
const nav = document.querySelector("#nav");
const cerrar = document.querySelector("#cerrar"); // Asegúrate de tener esta línea
const header = document.querySelector("header"); // <-- ¡Añade o confirma esta línea!

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
    header.classList.add("menu-abierto"); // <-- ¡Añade esta línea!
});

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
    header.classList.remove("menu-abierto"); // <-- ¡Añade esta línea!
});