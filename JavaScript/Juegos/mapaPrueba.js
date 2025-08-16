// Esperamos a que toda la página se cargue, incluidos los SVGs en los <object>
window.addEventListener('load', () => {

    // --- PASO 1: Lógica para el mapa de España ---
    const mapaEspanaContainer = document.getElementById('mapa-espana-container');
    const svgEspanaObject = document.getElementById('svg-espana');

    // Accedemos al contenido del SVG una vez cargado
    const svgDocEspana = svgEspanaObject.contentDocument;
    if (svgDocEspana) {
        const comunidadMadrid = svgDocEspana.getElementById('comunidad-madrid');

        if (comunidadMadrid) {
            // Añadimos interactividad visual
            comunidadMadrid.style.cursor = 'pointer';
            comunidadMadrid.addEventListener('mouseover', () => {
                comunidadMadrid.style.fill = '#f39c12'; // Resaltar en naranja
            });
            comunidadMadrid.addEventListener('mouseout', () => {
                comunidadMadrid.style.fill = ''; // Volver al color original
            });

            // Añadimos el evento de clic
            comunidadMadrid.addEventListener('click', () => {
                // Ocultamos el mapa de España y mostramos el de Madrid
                mapaEspanaContainer.style.display = 'none';
                document.getElementById('mapa-madrid-container').style.display = 'block';

                // Actualizamos el título y el mensaje
                document.querySelector('h1').textContent = '¡Muy bien! Ahora, ¿dónde está Leganés?';
                document.getElementById('mensaje').textContent = '¡Has encontrado Madrid!';
            });
        }
    }

    // --- PASO 2: Lógica para el mapa de Madrid ---
    const svgMadridObject = document.getElementById('svg-madrid');
    const mensajeFinal = document.getElementById('mensaje');

    svgMadridObject.addEventListener('load', () => {

    const svgDocMadrid = svgMadridObject.contentDocument;
    if (svgDocMadrid) {
        const leganes = svgDocMadrid.getElementById('leganes');

        if (leganes) {
            // Añadimos interactividad visual
            leganes.style.cursor = 'pointer';
            leganes.addEventListener('mouseover', () => {
                leganes.style.fill = '#f39c12'; // Resaltar en naranja
            });
            leganes.addEventListener('mouseout', () => {
                // Solo quitamos el color si no ha sido ya encontrado
                if (leganes.style.fill !== 'green') {
                    leganes.style.fill = '';
                }
            });

            // Añadimos el evento de clic para ganar
            leganes.addEventListener('click', () => {
                leganes.style.fill = 'green'; // Lo pintamos de verde para confirmar
                mensajeFinal.textContent = '¡Felicidades! ¡Has encontrado Leganés! 🥳';
                
                // Opcional: Desactivar más clics para no cambiar el color
                leganes.style.pointerEvents = 'none';
            });
        }
    }
});
});