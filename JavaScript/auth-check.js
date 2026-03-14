import { supabase, logoutUser } from './supabase.js';

console.log("auth-check.js cargado correctamente");

const authButton = document.getElementById('authButton');
const welcomeMessage = document.getElementById('welcomeMessage');

async function checkUserStatus() {
    // Obtenemos la sesión actual
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Usuario detectado:", user);

    if (user) {
        // --- Usuario logueado ---
        authButton.textContent = "Cerrar sesión";
        authButton.classList.remove('btnLogin-popup');
        authButton.classList.add('btn-logout');
        
        welcomeMessage.style.display = "block";
        welcomeMessage.textContent = `Hola, ${user.email}`;

        // Al hacer clic, llamamos a la función IMPORTADA, no declaramos una nueva
        authButton.onclick = async (e) => {
            e.preventDefault();
            await logoutUser();
        };
    } else {
        // --- No logueado ---
        authButton.textContent = "Inicia sesión";
        welcomeMessage.style.display = "none";
        
        // Si no está logueado, limpiamos el evento para que no interfiera
        authButton.onclick = null;
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', checkUserStatus);