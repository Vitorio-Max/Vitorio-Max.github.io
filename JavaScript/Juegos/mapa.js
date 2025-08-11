document.addEventListener('DOMContentLoaded', () => {
        const madridRegion = document.getElementById('madrid-region-real');
        const leganesMunicipio = document.getElementById('leganes-municipio-real');
        const contenedorEspana = document.getElementById('contenedor-mapa-espana');
        const contenedorMadrid = document.getElementById('contenedor-mapa-madrid');
        const mensajeFinal = document.getElementById('mensaje-final');
        const instruccion = document.querySelector('.instruccion');
        const reiniciarBtn = document.getElementById('reiniciar-btn');
    
        if (madridRegion) {
            madridRegion.addEventListener('click', () => {
                instruccion.textContent = '¡Genial! Ahora encuentra Leganés en la Comunidad de Madrid.';
                contenedorEspana.classList.remove('active');
                contenedorMadrid.classList.add('active');
            });
        } else {
            console.error("No se encontró el elemento con ID 'madrid-region-real'.");
        }

        if (leganesMunicipio) {
            leganesMunicipio.addEventListener('click', () => {
                contenedorMadrid.classList.remove('active');
                mensajeFinal.style.display = 'block';
                instruccion.style.display = 'none';
            });
        } else {
            console.error("No se encontró el elemento con ID 'leganes-municipio-real'.");
        }

        reiniciarBtn.addEventListener('click', () => {
            instruccion.textContent = 'Encuentra la Comunidad de Madrid en el mapa de España.';
            instruccion.style.display = 'block';
            contenedorMadrid.classList.remove('active');
            mensajeFinal.style.display = 'none';
            contenedorEspana.classList.add('active');
        });
    });