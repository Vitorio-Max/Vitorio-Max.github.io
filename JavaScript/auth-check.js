import { supabase, logoutUser } from './supabase.js';

const authButton = document.getElementById('authButton');
const welcomeMessage = document.getElementById('welcomeMessage');

async function checkUserStatus() {
    // 1. Obtenemos el usuario actual
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // --- EL USUARIO ESTÁ LOGUEADO ---
        authButton.textContent = "Cerrar sesión";
        authButton.classList.remove('btnLogin-popup');
        
        // Mostramos el mensaje de bienvenida
        welcomeMessage.style.display = "block";
        welcomeMessage.textContent = `Hola, ${user.email}`;

        // Cambiamos la acción del botón para que haga logout
        authButton.onclick = async () => {
            await logoutUser();
        };
    } else {
        // --- NO HAY USUARIO ---
        authButton.textContent = "Inicia sesión";
        welcomeMessage.style.display = "none";
        // Aquí mantienes tu lógica original de abrir el modal de login
    }
}

// Ejecutamos al cargar la página
document.addEventListener('DOMContentLoaded', checkUserStatus);

export async function logoutUser() {
    await supabase.auth.signOut();
    window.location.reload(); // Esto limpia todo y vuelve al estado de "no logueado"
}