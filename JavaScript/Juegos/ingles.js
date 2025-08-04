// --- ingles.js ---

document.addEventListener("DOMContentLoaded", () => {
    const englishImage = document.getElementById('english-image');
    const englishWord = document.getElementById('english-word');
    const playSoundBtn = document.getElementById('play-sound-btn');
    const nextWordBtn = document.getElementById('next-word-btn');

    // Array de palabras para el juego.
    const words = [
        { word: "apple", image: "../../Imagenes/manzana.png" },
        { word: "cat", image: "../../Imagenes/gato.jpeg" },
        { word: "dog", image: "../../Imagenes/perro.jpeg" },
        { word: "ball", image: "../../Imagenes/balon.png" },
        { word: "car", image: "../../Imagenes/coche.jpeg" },
        { word: "bird", image: "../../Imagenes/pajaro.jpeg" },
        { word: "house", image: "../../Imagenes/casa.jpeg" },
        { word: "tree", image: "../../Imagenes/arbol.jpeg" },
        { word: "sun", image: "../../Imagenes/sol.jpeg" },
        { word: "flower", image: "../../Imagenes/flor.png" },
        { word: "orange", image: "../../Imagenes/naranja.jpeg" },
        { word: "Elephant", image: "../../Imagenes/elefante.jpeg" },
        { word: "Ears", image: "../../Imagenes/oreja.jpeg" },
        { word: "Eyes", image: "../../Imagenes/imagenjuegos/ojo.png" },
    ];

    let currentWordIndex = 0;

    // NO NECESITAS LA LÍNEA: let audio = new Audio(); // ¡Elimina esta línea!

    // Función para mezclar el array de palabras
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Intercambio de elementos
        }
    }

    // Función para mostrar la palabra actual
    function displayWord() {
        if (words.length === 0) {
            englishImage.src = "";
            englishWord.textContent = "No hay palabras para mostrar.";
            playSoundBtn.disabled = true;
            nextWordBtn.disabled = true;
            return;
        }

        const currentItem = words[currentWordIndex];
        englishImage.src = currentItem.image;
        englishImage.alt = currentItem.word;
        englishWord.textContent = currentItem.word;

        // **NUEVO**: Reproducir la palabra automáticamente al mostrarla (opcional)
        // speakWord(currentItem.word);
    }

    // Función para reproducir la palabra usando Web Speech API
    function speakWord(text) {
        if ('speechSynthesis' in window) { // Verifica si la API es soportada por el navegador
            const utterance = new SpeechSynthesisUtterance(text);

            // Opcional: Configurar la voz. Necesitarás cargar las voces disponibles primero.
            // Es preferible esperar al evento 'voiceschanged' para obtener las voces.
            const voices = window.speechSynthesis.getVoices();
            const englishVoice = voices.find(voice => 
                voice.lang === 'en-US' || voice.lang === 'en-GB' || voice.lang.startsWith('en-')
            );
            if (englishVoice) {
                utterance.voice = englishVoice;
            } else {
                // Si no se encuentra una voz en inglés específica, el navegador usará la voz por defecto.
                // Podrías establecer una voz por defecto genérica si sabes su nombre, ej:
                // utterance.voice = voices.find(voice => voice.name === 'Google US English');
            }
            
            utterance.lang = 'en-US'; // Asegura que se intente usar una voz en inglés
            utterance.pitch = 1;     // Tono de voz (0 a 2)
            utterance.rate = 1;      // Velocidad de habla (0.1 a 10)
            utterance.volume = 1;    // Volumen (0 a 1)

            // Deshabilitar el botón mientras se habla para evitar superposiciones
            playSoundBtn.disabled = true;
            utterance.onend = () => {
                playSoundBtn.disabled = false; // Habilitar el botón cuando termine de hablar
            };
            utterance.onerror = (event) => {
                console.error('Error en la síntesis de voz:', event);
                playSoundBtn.disabled = false; // Habilitar el botón en caso de error
            };

            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("Tu navegador no soporta la API de Síntesis de Voz.");
            playSoundBtn.disabled = false; // Asegurarse de habilitar el botón si la API no está disponible
        }
    }

    // Event listener para el botón "Escuchar"
    playSoundBtn.addEventListener('click', () => {
        const currentItem = words[currentWordIndex];
        speakWord(currentItem.word); // Llama a la nueva función para hablar
    });

    // Event listener para el botón "Siguiente"
    nextWordBtn.addEventListener('click', () => {
        currentWordIndex = (currentWordIndex + 1) % words.length; // Ciclo a través de las palabras
        displayWord();
    });

    // Inicializar el juego
    shuffleArray(words); // Mezcla las palabras al inicio

    // **IMPORTANTE**: La lista de voces puede tardar un poco en cargarse.
    // Es buena práctica esperar al evento 'voiceschanged'
    window.speechSynthesis.onvoiceschanged = () => {
        displayWord(); // Muestra la primera palabra después de que las voces estén cargadas
    };

    // Si las voces ya están cargadas (ej. recarga rápida), o si el evento no se dispara
    if (window.speechSynthesis.getVoices().length > 0) {
        displayWord();
    }
});