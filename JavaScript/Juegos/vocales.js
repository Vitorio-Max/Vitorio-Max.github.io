document.addEventListener('DOMContentLoaded', () => {
    // Array de vocales con datos y rutas de imagen
    const vowels = [
        { letter: 'A', name: 'A de avión', image: '../../Imagenes/imagenjuegos/avion.jpg' },
        { letter: 'E', name: 'E de elefante', image: '../../Imagenes/imagenjuegos/elefante.png' },
        { letter: 'I', name: 'I de iguana', image: '../../Imagenes/imagenjuegos/iguana.png' },
        { letter: 'O', name: 'O de oso', image: '../../Imagenes/imagenjuegos/oso.jpg' },
        { letter: 'U', name: 'U de uvas', image: '../../Imagenes/imagenjuegos/uvas.png' }
    ];

    let currentVowelIndex = 0;
    
    // Obtener elementos del DOM de forma segura
    const vowelCard = document.getElementById('vowel-card');
    const vowelDisplay = document.getElementById('vowel-display');
    const vowelName = document.getElementById('vowel-name');
    const nextVowelBtn = document.getElementById('next-vowel-btn');

    // Verificar si los elementos existen antes de continuar
    if (!vowelCard || !vowelDisplay || !vowelName || !nextVowelBtn) {
        console.error("No se encontraron todos los elementos HTML necesarios.");
        return; // Detener la ejecución si falta algún elemento
    }

    // Crear y añadir el elemento de imagen de forma dinámica
    const vowelImage = document.createElement('img');
    vowelImage.className = 'vowel-image';
    vowelCard.prepend(vowelImage);

    // Verificación de la API de voz
    const speechSynthesisSupported = 'speechSynthesis' in window;

    // Función para reproducir el texto (vocal y nombre)
    const speakText = (text) => {
        if (speechSynthesisSupported && !window.speechSynthesis.speaking) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';
            window.speechSynthesis.speak(utterance);
        }
    };

    const updateVowelDisplay = () => {
        const currentVowel = vowels[currentVowelIndex];
        
        // Animación de salida
        vowelCard.style.animation = 'scaleOut 0.3s ease-in';
        setTimeout(() => {
            vowelDisplay.textContent = currentVowel.letter;
            vowelName.textContent = currentVowel.name;
            vowelImage.src = currentVowel.image;
            vowelImage.alt = `Imagen de ${currentVowel.name}`;
            vowelCard.style.animation = 'fadeInScale 0.7s ease-out forwards';
            speakText(currentVowel.name); // Pronunciar el nombre completo, ya que incluye la vocal
        }, 300);
    };

    const goToNextVowel = () => {
        currentVowelIndex = (currentVowelIndex + 1) % vowels.length;
        updateVowelDisplay();
    };

    // Event listeners
    vowelCard.addEventListener('click', () => {
        speakText(vowels[currentVowelIndex].name); // Pronunciar al hacer clic
    });

    nextVowelBtn.addEventListener('click', goToNextVowel);

    // Inicializar la visualización de la vocal al cargar la página
    updateVowelDisplay();
});