import { supabase, logoutUser } from './supabase.js';

console.log("auth-check.js cargado correctamente");

const authButton = document.getElementById('authButton');
const welcomeMessage = document.getElementById('welcomeMessage');

async function checkUserStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Usuario detectado:", user);

    if (user) {
        console.log("Cambiando botón a Cerrar Sesión");
        
        // 1. Cambiamos el texto
        authButton.textContent = "Cerrar sesión";
        
        // 2. IMPORTANTE: Eliminamos la clase que abre el modal 
        // para que no se abra el login al intentar cerrar sesión
        authButton.classList.remove('btnLogin-popup');
        
        // 3. Mostramos bienvenida
        welcomeMessage.style.display = "block";
        welcomeMessage.textContent = `Hola, ${user.email}`;

        // 4. Forzamos el evento click para cerrar sesión
        authButton.onclick = async (e) => {
            e.preventDefault(); // Evitamos cualquier comportamiento extra
            await logoutUser();
        };
    } else {
        console.log("Usuario no detectado, mostrando botón de login");
        authButton.textContent = "Inicia sesión";
        welcomeMessage.style.display = "none";
        // Asegúrate de que tu login.js gestione el comportamiento del modal 
        // para la clase 'btnLogin-popup'
    }
}

// Ejecutamos al cargar
document.addEventListener('DOMContentLoaded', checkUserStatus);