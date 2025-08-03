// --- englishGame.js ---

document.addEventListener("DOMContentLoaded", () => {
    const englishImage = document.getElementById('english-image');
    const englishWord = document.getElementById('english-word');
    const playSoundBtn = document.getElementById('play-sound-btn');
    const nextWordBtn = document.getElementById('next-word-btn');

    // Array de palabras para el juego.
    // Asegúrate de que las rutas de las imágenes y los archivos de audio sean correctas.
    // Por ejemplo: si tienes una carpeta 'Imagenes/english_game/' y 'Sonidos/english_game/'
    const words = [
        { word: "apple", image: "../../Imagenes/manzana.png", sound: "../Sonidos/english_game/apple.mp3" },
        { word: "cat", image: "../../Imagenes/gato.jpeg", sound: "../Sonidos/english_game/cat.mp3" },
        { word: "dog", image: "../../Imagenes/perro.jpeg", sound: "../Sonidos/english_game/dog.mp3" },
        { word: "ball", image: "../../Imagenes/balon.png", sound: "../Sonidos/english_game/ball.mp3" },
        { word: "car", image: "../../Imagenes/coche.jpeg", sound: "../Sonidos/english_game/car.mp3" },
        { word: "bird", image: "../../Imagenes/pajaro.jpeg", sound: "../Sonidos/english_game/bird.mp3" },
        { word: "house", image: "../../Imagenes/casa.jpeg", sound: "../Sonidos/english_game/house.mp3" },
        { word: "tree", image: "../../Imagenes/arbol.jpeg", sound: "../Sonidos/english_game/tree.mp3" },
        { word: "sun", image: "../../Imagenes/sol.jpeg", sound: "../Sonidos/english_game/sun.mp3" },
        { word: "flower", image: "../../Imagenes/flor.png", sound: "../Sonidos/english_game/flower.mp3" },
    ];

    let currentWordIndex = 0;
    let audio = new Audio(); // Crea un objeto de audio global

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

        // Carga el sonido para la palabra actual
        audio.src = currentItem.sound;
    }

    // Event listener para el botón "Escuchar"
    playSoundBtn.addEventListener('click', () => {
        audio.play().catch(error => console.error("Error al reproducir el audio:", error));
    });

    // Event listener para el botón "Siguiente"
    nextWordBtn.addEventListener('click', () => {
        currentWordIndex = (currentWordIndex + 1) % words.length; // Ciclo a través de las palabras
        displayWord();
    });

    // Inicializar el juego
    shuffleArray(words); // Mezcla las palabras al inicio
    displayWord(); // Muestra la primera palabra
});