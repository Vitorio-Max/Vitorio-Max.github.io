document.addEventListener('DOMContentLoaded', () => {
    // Array de datos para los personajes, con su nombre y URL de imagen
    const characterData = [
        { name: 'Mickey Mouse', image: '../../Imagenes/imagenjuegos/Mickey.webp', frontText: '¿Quién es?' },
        { name: 'Minnie Mouse', image: 'https://upload.wikimedia.org/wikipedia/en/4/4e/Minnie_Mouse.png', frontText: '¿Quién es?' },
        { name: 'Pato Donald', image: 'https://upload.wikimedia.org/wikipedia/en/e/ee/Donald_Duck_-_Disney.png', frontText: '¿Quién es?' },
        { name: 'Goofy', image: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Goofy.png', frontText: '¿Quién es?' },
        { name: 'Buzz Lightyear', image: 'https://static.wikia.nocookie.net/toystory/images/d/da/Buzz_Lightyear.png', frontText: '¿Quién es?' },
        { name: 'Woody', image: 'https://static.wikia.nocookie.net/toystory/images/7/7b/Woody_Toy_Story_4.png', frontText: '¿Quién es?' },
        { name: 'Rayo McQueen', image: 'https://static.wikia.nocookie.net/disney/images/e/e3/Lightning_McQueen_Iconic.png', frontText: '¿Quién es?' },
        { name: 'Mate (Cars)', image: 'https://static.wikia.nocookie.net/disney/images/d/d9/Mater-Cars2.png', frontText: '¿Quién es?' },
        { name: 'Peppa Pig', image: 'https://upload.wikimedia.org/wikipedia/en/7/70/Peppa_Pig_Logo.png', frontText: '¿Quién es?' },
        { name: 'George Pig', image: 'https://upload.wikimedia.org/wikipedia/en/b/b5/George_Pig.png', frontText: '¿Quién es?' },
        { name: 'Superman', image: 'https://upload.wikimedia.org/wikipedia/en/3/35/Superman_Square_S.png', frontText: '¿Quién es?' },
        { name: 'Spiderman', image: 'https://upload.wikimedia.org/wikipedia/en/2/21/Spider-Man_No_Way_Home_poster.jpg', frontText: '¿Quién es?' },
        { name: 'Elsa (Frozen)', image: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Elsa_from_Frozen.png', frontText: '¿Quién es?' },
        { name: 'Olaf (Frozen)', image: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Olaf_Frozen_II.png', frontText: '¿Quién es?' },
        { name: 'Chase (Patrulla Canina)', image: 'https://static.wikia.nocookie.net/pawpatrol/images/f/fd/Chase.png', frontText: '¿Quién es?' },
        { name: 'Marshall (Patrulla Canina)', image: 'https://static.wikia.nocookie.net/pawpatrol/images/f/f0/Marshall.png', frontText: '¿Quién es?' },
        { name: 'Bob Esponja', image: 'https://upload.wikimedia.org/wikipedia/en/3/3b/SpongeBob_SquarePants_character.png', frontText: '¿Quién es?' },
        { name: 'Patricio Estrella', image: 'https://upload.wikimedia.org/wikipedia/en/3/33/Patrick_Star.png', frontText: '¿Quién es?' },
        { name: 'Dora la Exploradora', image: 'https://upload.wikimedia.org/wikipedia/en/6/6f/Dora_the_Explorer.png', frontText: '¿Quién es?' },
        { name: 'Boots (Dora)', image: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Boots_the_Monkey.png', frontText: '¿Quién es?' },
        // ¡Puedes añadir muchos más!
    ];

    const charactersGridContainer = document.getElementById('characters-grid-container');
    let speechSynthesisSupported = false; // Bandera para la compatibilidad con síntesis de voz

    // Verificar la compatibilidad con la síntesis de voz al cargar la página
    if ('speechSynthesis' in window) {
        speechSynthesisSupported = true;
    } else {
        console.warn("La síntesis de voz no es compatible con este navegador.");
    }

    /**
     * Función para hablar el texto dado.
     * @param {string} text - El texto a pronunciar.
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
     * Función para crear y añadir una tarjeta de personaje al contenedor.
     * @param {object} data - Objeto con el nombre y la imagen del personaje.
     */
    const createCharacterCard = (data) => {
        const flipCard = document.createElement('div');
        flipCard.classList.add('flip-card');

        const flipCardInner = document.createElement('div');
        flipCardInner.classList.add('flip-card-inner');

        const flipCardFront = document.createElement('div');
        flipCardFront.classList.add('flip-card-front');

        // En la parte frontal, mostraremos una pregunta o un ícono
        const frontTextDisplay = document.createElement('h2');
        frontTextDisplay.classList.add('character-name-front'); // Reutilizamos la clase para estilo
        frontTextDisplay.textContent = data.frontText || 'Adivina'; // Texto predeterminado si no se especifica
        
        flipCardFront.appendChild(frontTextDisplay);

        const flipCardBack = document.createElement('div');
        flipCardBack.classList.add('flip-card-back');

        const characterImage = document.createElement('img');
        characterImage.classList.add('character-image'); // Usamos la clase character-image
        characterImage.src = data.image;
        characterImage.alt = `Imagen de ${data.name}`;
        characterImage.onerror = () => {
            characterImage.src = "https://placehold.co/150x150/CCCCCC/000000?text=Error+Img"; // Fallback más descriptivo
        };

        const characterNameDisplay = document.createElement('h2');
        characterNameDisplay.classList.add('character-name-back'); // Usamos la clase character-name-back
        characterNameDisplay.textContent = data.name;

        flipCardBack.appendChild(characterImage);
        flipCardBack.appendChild(characterNameDisplay);

        flipCardInner.appendChild(flipCardFront);
        flipCardInner.appendChild(flipCardBack);
        flipCard.appendChild(flipCardInner);

        // Añadir evento de clic para voltear la tarjeta y pronunciar
        flipCard.addEventListener('click', () => {
            flipCard.classList.toggle('flipped'); // Alternar la clase 'flipped'
            if (flipCard.classList.contains('flipped')) {
                speakText(data.name); // Si está volteada, pronuncia el nombre del personaje
            } else {
                // Opcional: speakText(data.frontText || 'Adivina quién es'); // Puedes hacer que diga la pregunta al volver
            }
        });

        charactersGridContainer.appendChild(flipCard);
    };

    // Generar todas las tarjetas de personajes
    characterData.forEach(data => {
        createCharacterCard(data);
    });
});