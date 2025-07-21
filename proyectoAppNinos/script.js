document.addEventListener('DOMContentLoaded', () => {
    // Array de datos de animales: nombre y URL de la imagen
    const animals = [
        { name: 'León', image: 'https://placehold.co/300x300/F0B90B/FFFFFF?text=León' }, // Lion
        { name: 'Elefante', image: 'https://placehold.co/300x300/8B4513/FFFFFF?text=Elefante' }, // Elephant
        { name: 'Mono', image: 'https://placehold.co/300x300/A0522D/FFFFFF?text=Mono' }, // Monkey
        { name: 'Cebra', image: 'https://placehold.co/300x300/000000/FFFFFF?text=Cebra' }, // Zebra
        { name: 'Jirafa', image: 'https://placehold.co/300x300/FFD700/000000?text=Jirafa' }, // Giraffe
        { name: 'Perro', image: 'https://placehold.co/300x300/6A0DAD/FFFFFF?text=Perro' }, // Dog
        { name: 'Gato', image: 'https://placehold.co/300x300/FF69B4/FFFFFF?text=Gato' }, // Cat
        { name: 'Pato', image: 'https://placehold.co/300x300/008000/FFFFFF?text=Pato' }, // Duck
    ];

    let currentAnimalIndex = 0; // Índice del animal actual
    let speechSynthesisSupported = false; // Bandera para la compatibilidad con síntesis de voz

    // Obtener referencias a los elementos del DOM
    const animalCard = document.getElementById('animal-card');
    const animalImage = document.getElementById('animal-image');
    const animalName = document.getElementById('animal-name');
    const nextAnimalBtn = document.getElementById('next-animal-btn');

    // Verificar la compatibilidad con la síntesis de voz al cargar la página
    if ('speechSynthesis' in window) {
        speechSynthesisSupported = true;
    } else {
        console.warn("La síntesis de voz no es compatible con este navegador.");
    }

    /**
     * Función para hablar el nombre del animal.
     * @param {string} name - El nombre del animal a pronunciar.
     */
    const speakAnimalName = (name) => {
        if (speechSynthesisSupported) {
            const utterance = new SpeechSynthesisUtterance(name);
            utterance.lang = 'es-ES'; // Establecer el idioma a español
            window.speechSynthesis.speak(utterance);
        } else {
            console.log(`Simulando voz para: ${name}`);
            // Aquí podrías añadir un fallback, como reproducir un archivo de audio pregrabado.
        }
    };

    /**
     * Función para actualizar la interfaz de usuario con el animal actual.
     */
    const updateAnimalDisplay = () => {
        const currentAnimal = animals[currentAnimalIndex];
        animalImage.src = currentAnimal.image;
        animalImage.alt = currentAnimal.name;
        animalName.textContent = currentAnimal.name;

        // Manejo de errores para la carga de imágenes
        animalImage.onerror = () => {
            animalImage.src = "https://placehold.co/300x300/CCCCCC/000000?text=Imagen+no+disponible"; // Imagen de fallback
        };
    };

    /**
     * Función para pasar al siguiente animal.
     */
    const goToNextAnimal = () => {
        currentAnimalIndex = (currentAnimalIndex + 1) % animals.length;
        // Detener cualquier voz en curso al pasar al siguiente animal
        if (speechSynthesisSupported) {
            window.speechSynthesis.cancel();
        }
        updateAnimalDisplay(); // Actualizar la pantalla con el nuevo animal
    };

    // Añadir event listeners
    animalCard.addEventListener('click', () => {
        speakAnimalName(animals[currentAnimalIndex].name);
    });

    nextAnimalBtn.addEventListener('click', goToNextAnimal);

    // Inicializar la visualización del animal al cargar la página
    updateAnimalDisplay();
});