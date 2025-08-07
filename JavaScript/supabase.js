import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


async function getDatos() {
  const { data, error } = await supabase.from('items').select('*');
  if (error) {
    console.error('Error al obtener datos:', error);
  } else {
    console.log('Datos obtenidos:', data);
  }
}
getDatos();


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