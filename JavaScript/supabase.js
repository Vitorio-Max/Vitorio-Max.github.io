// A. IMPORTAR la biblioteca de Supabase
import { createClient } from '@supabase/supabase-js'

// B. PONER tus propias claves aquí
const supabaseUrl = 'https://https://vitorio-max.github.io/.supabase.co'; // <--- Reemplaza esto
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzYnJ4cnpla2Rta3RkaWl5cXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0MTYsImV4cCI6MjA2OTk4NTQxNn0.LeV5DPtRHMYixltedEJqUY596_2vR0A89LDm2UHflws'; // <--- Reemplaza esto

// C. INICIALIZAR el cliente de Supabase con tus claves
const supabase = createClient(supabaseUrl, supabaseAnonKey);


// 1. Espera a que el documento esté cargado para evitar errores
document.addEventListener('DOMContentLoaded', () => {

    // 2. Busca el botón en el HTML por su ID
    const loginBtn = document.getElementById('login-github-btn');

    // 3. Si el botón existe, añade un "escuchador de eventos"
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {

            // 4. Llama a la función de Supabase para iniciar la sesión con OAuth
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'github', // <--- ¡AQUÍ LE DECIMOS QUE USE GITHUB!
            });

            // 5. Maneja los posibles errores, si los hubiera
            if (error) {
                console.error('Error al iniciar sesión con GitHub:', error.message);
                alert('Hubo un error al iniciar sesión. Inténtalo de nuevo.');
            }
            // 6. Si todo va bien, Supabase redirigirá automáticamente
            //    al usuario a la página de login de GitHub.
        });
    } else {
        console.error("No se encontró el botón con el ID 'login-github-btn'.");
    }
});