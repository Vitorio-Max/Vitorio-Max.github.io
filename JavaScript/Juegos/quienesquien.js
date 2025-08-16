document.addEventListener('DOMContentLoaded', () => {
    // Array de datos para los personajes.
    // AÑADIDO: 'clueImage' para la imagen de la pista en el anverso de la tarjeta.
    const characterData = [
        { name: 'Mickey Mouse', image: '../../Imagenes/imagenjuegos/Mickey.webp', clueImage: '../../Imagenes/imagenjuegos/pistaMickey.jpg' },
        { name: 'Minnie Mouse', image: '../../Imagenes/imagenjuegos/minni.jpeg', clueImage: '../../Imagenes/imagenjuegos/pistaMinni.jpg' },
        { name: 'Pato Donald', image: '../../Imagenes/imagenjuegos/donald.png', clueImage: '../../Imagenes/imagenjuegos/pistaDonald.png' },
        { name: 'Goofy', image: '../../Imagenes/imagenjuegos/goofy.png', clueImage: '../../Imagenes/imagenjuegos/pistaGoofy.jpg' },
        { name: 'Buzz Lightyear', image: '../../Imagenes/imagenjuegos/buzz.jpeg', clueImage: '../../Imagenes/imagenjuegos/pistaBuzz.jpg' },
        { name: 'Woody', image: '../../Imagenes/imagenjuegos/woody.jpeg', clueImage: '../../Imagenes/imagenjuegos/pistaWoody.jpg' },
        { name: 'Rayo McQueen', image: '../../Imagenes/imagenjuegos/rayo1.png', clueImage: '../../Imagenes/imagenjuegos/pistaRayo.jpg' }, // Ejemplo de fallback para pista
        { name: 'Mate', image: '../../Imagenes/imagenjuegos/mate1.jpg', clueImage: '../../Imagenes/imagenjuegos/pistaMate.jpg' },
        { name: 'Peppa Pig', image: '../../Imagenes/imagenjuegos/pepaPig.jpg', clueImage: '../../Imagenes/imagenjuegos/pistaPepapig.png' },
        { name: 'George Pig', image: 'https://upload.wikimedia.org/wikipedia/en/b/b5/George_Pig.png', clueImage: 'https://placehold.co/100x100/ADD8E6/000000?text=Pista+George' },
        { name: 'Superman', image: 'https://upload.wikimedia.org/wikipedia/en/3/35/Superman_Square_S.png', clueImage: 'https://placehold.co/100x100/DC143C/FFFFFF?text=Pista+S' },
        { name: 'Spiderman', image: 'https://upload.wikimedia.org/wikipedia/en/2/21/Spider-Man_No_Way_Home_poster.jpg', clueImage: 'https://placehold.co/100x100/FF0000/FFFFFF?text=Pista+Araña' },
        { name: 'Elsa (Frozen)', image: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Elsa_from_Frozen.png', clueImage: 'https://placehold.co/100x100/87CEEB/FFFFFF?text=Pista+Hielo' },
        { name: 'Olaf (Frozen)', image: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Olaf_Frozen_II.png', clueImage: 'https://placehold.co/100x100/FFFFFF/000000?text=Pista+Nieve' },
        { name: 'Chase (Patrulla Canina)', image: 'https://static.wikia.nocookie.net/pawpatrol/images/f/fd/Chase.png', clueImage: 'https://placehold.co/100x100/4169E1/FFFFFF?text=Pista+Policia' },
        { name: 'Marshall (Patrulla Canina)', image: 'https://static.wikia.nocookie.net/pawpatrol/images/f/f0/Marshall.png', clueImage: 'https://placehold.co/100x100/FF4500/FFFFFF?text=Pista+Bombero' },
        { name: 'Bob Esponja', image: 'https://upload.wikimedia.org/wikipedia/en/3/3b/SpongeBob_SquarePants_character.png', clueImage: 'https://placehold.co/100x100/FFFF00/000000?text=Pista+Esponja' },
        { name: 'Patricio Estrella', image: 'https://upload.wikimedia.org/wikipedia/en/3/33/Patrick_Star.png', clueImage: 'https://placehold.co/100x100/FFC0CB/000000?text=Pista+Estrella' },
        { name: 'Dora la Exploradora', image: 'https://upload.wikimedia.org/wikipedia/en/6/6f/Dora_the_Explorer.png', clueImage: 'https://placehold.co/100x100/FFD700/000000?text=Pista+Botas' },
        { name: 'Boots (Dora)', image: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Boots_the_Monkey.png', clueImage: 'https://placehold.co/100x100/8B4513/FFFFFF?text=Pista+Mono' },
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
     * @param {object} data - Objeto con el nombre, la imagen del personaje y la imagen de la pista.
     */
    const createCharacterCard = (data) => {
        const flipCard = document.createElement('div');
        flipCard.classList.add('flip-card');

        const flipCardInner = document.createElement('div');
        flipCardInner.classList.add('flip-card-inner');

        const flipCardFront = document.createElement('div');
        flipCardFront.classList.add('flip-card-front');

        // --- CAMBIO CLAVE AQUÍ: Reemplazar texto por imagen de pista ---
        const clueImage = document.createElement('img');
        clueImage.classList.add('clue-image'); // Clase para estilos de la imagen de pista
        clueImage.src = data.clueImage; // Usamos la nueva propiedad 'clueImage'
        clueImage.alt = `Pista para ${data.name}`; // Texto alternativo para accesibilidad
        clueImage.onerror = () => {
            clueImage.src = "https://placehold.co/150x150/CCCCCC/000000?text=Pista+No+Cargada"; // Fallback
        };
        
        // Añadimos la imagen de pista a la parte frontal de la tarjeta
        flipCardFront.appendChild(clueImage);

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
                // Opcional: No hay texto que pronunciar en la parte frontal si es una imagen
            }
        });

        charactersGridContainer.appendChild(flipCard);
    };

    // Generar todas las tarjetas de personajes
    characterData.forEach(data => {
        createCharacterCard(data);
    });
});
