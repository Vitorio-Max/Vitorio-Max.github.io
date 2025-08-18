document.addEventListener('DOMContentLoaded', () => {
    // Array de vocales, ahora con rutas a imágenes y sonidos
    const vowels = [
        { letter: 'A', name: 'A de avión', sound: 'ruta/a_avion.mp3', image: '../../Imagenes/imagenjuegos/avion.jpg' },
        { letter: 'E', name: 'E de elefante', sound: 'ruta/e_elefante.mp3', image: '../../Imagenes/imagenjuegos/elefante.png' },
        { letter: 'I', name: 'I de iguana', sound: 'ruta/i_iguana.mp3', image: '../../Imagenes/imagenjuegos/iguana.png' },
        { letter: 'O', name: 'O de oso', sound: 'ruta/o_oso.mp3', image: '../../Imagenes/imagenjuegos/oso.jpg' },
        { letter: 'U', name: 'U de uvas', sound: 'ruta/u_uvas.mp3', image: '../../Imagenes/imagenjuegos/uvas.png' }
    ];

    let currentVowelIndex = 0;
    const vowelCard = document.getElementById('vowel-card');
    const vowelDisplay = document.getElementById('vowel-display');
    const vowelName = document.getElementById('vowel-name');
    const nextVowelBtn = document.getElementById('next-vowel-btn');

    // Añadir un elemento para la imagen y el audio al HTML (debes agregarlos)
    const vowelImage = document.createElement('img');
    vowelImage.className = 'vowel-image';
    vowelCard.prepend(vowelImage); // Inserta la imagen al principio de la tarjeta
    
    // Función para reproducir sonidos con una animación
    const playSoundAndAnimate = (soundPath) => {
        const audio = new Audio(soundPath);
        audio.play();

        // Pequeña animación de "rebote"
        vowelDisplay.style.animation = 'none';
        vowelDisplay.offsetHeight; // Forzar reflow
        vowelDisplay.style.animation = 'popIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    };

    const updateVowelDisplay = () => {
        const currentVowel = vowels[currentVowelIndex];
        
        // Animación de salida antes de cambiar
        vowelCard.style.animation = 'scaleOut 0.3s ease-in';
        setTimeout(() => {
            vowelDisplay.textContent = currentVowel.letter;
            vowelName.textContent = currentVowel.name;
            vowelImage.src = currentVowel.image;
            vowelImage.alt = `Imagen de ${currentVowel.name}`;
            vowelCard.style.animation = 'fadeInScale 0.7s ease-out forwards'; // Animación de entrada
            playSoundAndAnimate(currentVowel.sound);
        }, 300); // Esperar a que termine la animación de salida
    };

    const goToNextVowel = () => {
        currentVowelIndex = (currentVowelIndex + 1) % vowels.length;
        updateVowelDisplay();
    };

    // Event listeners
    vowelCard.addEventListener('click', () => {
        playSoundAndAnimate(vowels[currentVowelIndex].sound);
    });

    nextVowelBtn.addEventListener('click', goToNextVowel);

    // Inicializar la visualización de la vocal al cargar la página
    updateVowelDisplay();
});