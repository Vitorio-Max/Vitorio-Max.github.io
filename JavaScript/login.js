import { loginUser, signUpUser } from './supabase.js';

const wrapper =document.querySelector('.wrapper');
const loginLink =document.querySelector('.login-link');
const registerLink =document.querySelector('.register-link');
const btnPopup =document.querySelector('.btnLogin-popup');
const iconClose =document.querySelector('.icon-close');

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
});

// --- Lógica de Autenticación con Supabase ---

// 1. Manejo del Login
const loginForm = document.querySelector('.form-box.login form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Obtenemos los valores por su tipo de input (email es el primero, password el segundo)
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    const { data, error } = await loginUser(email, password);
    
    if (error) {
        alert("Error al iniciar sesión: " + error.message);
    } else {
        alert("¡Bienvenido de nuevo!");
        wrapper.classList.remove('active-popup'); // Cierra el modal
        window.location.reload(); // Recarga para actualizar el estado
    }
});

// 2. Manejo del Registro
const registerForm = document.querySelector('.form-box.register form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Ajusta los selectores según el orden en tu HTML
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    const { data, error } = await signUpUser(email, password);
    
    if (error) {
        alert("Error al registrarse: " + error.message);
    } else {
        alert("Registro exitoso. Por favor, revisa tu correo si necesitas confirmar la cuenta.");
        wrapper.classList.remove('active'); // Vuelve al login
    }
});