document.addEventListener('DOMContentLoaded', () => {
    const madridRegion = document.getElementById('madrid-region');
    const leganesMunicipio = document.getElementById('leganes');
    const contenedorEspana = document.getElementById('contenedor-mapa-espana');
    const contenedorMadrid = document.getElementById('contenedor-mapa-madrid');
    const mensajeFinal = document.getElementById('mensaje-final');
    const instruccion = document.querySelector('.instruccion');
    const reiniciarBtn = document.getElementById('reiniciar-btn');

    // Lógica para el mapa de España
    if (madridRegion) {
        madridRegion.addEventListener('click', () => {
            instruccion.textContent = '¡Genial! Ahora encuentra Leganés en la Comunidad de Madrid.';
            contenedorEspana.classList.remove('active');
            contenedorMadrid.classList.add('active');
        });
    } else {
        console.error("No se encontró el elemento con ID 'madrid-region'. Asegúrate de que el SVG de España lo contiene.");
    }

    // Lógica para el mapa de Madrid
    if (leganesMunicipio) {
        leganesMunicipio.addEventListener('click', () => {
            contenedorMadrid.classList.remove('active');
            mensajeFinal.style.display = 'block';
            instruccion.style.display = 'none';
        });
    } else {
        console.error("No se encontró el elemento con ID 'leganes-municipio'. Asegúrate de que el SVG de Madrid lo contiene.");
    }
    
    // Lógica para reiniciar el juego
    reiniciarBtn.addEventListener('click', () => {
        instruccion.textContent = 'Encuentra la Comunidad de Madrid en el mapa de España.';
        instruccion.style.display = 'block';
        contenedorMadrid.classList.remove('active');
        mensajeFinal.style.display = 'none';
        contenedorEspana.classList.add('active');
    });
});