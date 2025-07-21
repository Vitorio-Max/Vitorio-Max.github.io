document.addEventListener('DOMContentLoaded', () => {
    // Array de vocales
    const vowels = [
        { letter: 'A', name: 'A de avión' },
        { letter: 'E', name: 'E de elefante' },
        { letter: 'I', name: 'I de iguana' },
        { letter: 'O', name: 'O de oso' },
        { letter: 'U', name: 'U de uvas' }
    ];

    let currentVowelIndex = 0; // Índice de la vocal actual
    let speechSynthesisSupported = false; // Bandera para la compatibilidad con síntesis de voz

    // Obtener referencias a los elementos del DOM
    const vowelCard = document.getElementById('vowel-card');
    const vowelDisplay = document.getElementById('vowel-display');
    const vowelName = document.getElementById('vowel-name');
    const nextVowelBtn = document.getElementById('next-vowel-btn');

    // Verificar la compatibilidad con la síntesis de voz al cargar la página
    if ('speechSynthesis' in window) {
        speechSynthesisSupported = true;
    } else {
        console.warn("La síntesis de voz no es compatible con este navegador.");
    }

    /**
     * Función para hablar la vocal o su nombre.
     * @param {string} text - El texto a pronunciar (vocal o su nombre).
     */
    const speakText = (text) => {
        if (speechSynthesisSupported) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES'; // Establecer el idioma a español
            window.speechSynthesis.speak(utterance);
        } else {
            console.log(`Simulando voz para: ${text}`);
        }
    };

    /**
     * Función para actualizar la interfaz de usuario con la vocal actual.
     */
    const updateVowelDisplay = () => {
        const currentVowel = vowels[currentVowelIndex];
        vowelDisplay.textContent = currentVowel.letter;
        vowelName.textContent = currentVowel.name;
    };

    /**
     * Función para pasar a la siguiente vocal.
     */
    const goToNextVowel = () => {
        currentVowelIndex = (currentVowelIndex + 1) % vowels.length;
        // Detener cualquier voz en curso al pasar a la siguiente vocal
        if (speechSynthesisSupported) {
            window.speechSynthesis.cancel();
        }
        updateVowelDisplay(); // Actualizar la pantalla con la nueva vocal
        speakText(vowels[currentVowelIndex].letter); // Pronunciar la nueva vocal al cargarla
    };

    // Añadir event listeners
    vowelCard.addEventListener('click', () => {
        speakText(vowels[currentVowelIndex].letter); // Pronuncia solo la letra
    });

    nextVowelBtn.addEventListener('click', goToNextVowel);

    // Inicializar la visualización de la vocal al cargar la página
    updateVowelDisplay();
    speakText(vowels[currentVowelIndex].letter); // Pronunciar la primera vocal al inicio
});
s