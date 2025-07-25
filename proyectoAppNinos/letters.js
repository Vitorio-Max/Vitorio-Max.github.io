document.addEventListener('DOMContentLoaded', () => {
    // Array de datos para las letras, palabras e imágenes correspondientes
    const alphabetData = [
        { letter: 'A', word: 'Avión', image: 'https://placehold.co/150x150/FFD700/000000?text=A' },
        { letter: 'B', word: 'Barco', image: 'https://placehold.co/150x150/ADD8E6/000000?text=B' },
        { letter: 'C', word: 'Casa', image: 'https://placehold.co/150x150/FFB6C1/000000?text=C' },
        { letter: 'D', word: 'Delfín', image: 'https://placehold.co/150x150/90EE90/000000?text=D' },
        { letter: 'E', word: 'Erik', image: 'https://placehold.co/150x150/FFDAB9/000000?text=E' },
        { letter: 'F', word: 'Flor', image: 'https://placehold.co/150x150/DA70D6/000000?text=F' },
        { letter: 'G', word: 'Gato', image: 'https://placehold.co/150x150/F0E68C/000000?text=G' },
        { letter: 'H', word: 'Helado', image: 'https://placehold.co/150x150/B0C4DE/000000?text=H' },
        { letter: 'I', word: 'Isla', image: 'https://placehold.co/150x150/E0FFFF/000000?text=I' },
        { letter: 'J', word: 'Jana', image: 'https://placehold.co/150x150/F5DEB3/000000?text=J' },
        { letter: 'K', word: 'Koala', image: 'https://placehold.co/150x150/DDA0DD/000000?text=K' },
        { letter: 'L', word: 'Lima', image: 'https://placehold.co/150x150/FFC0CB/000000?text=L' },
        { letter: 'M', word: 'Mono', image: 'https://placehold.co/150x150/BDB76B/000000?text=M' },
        { letter: 'N', word: 'Nube', image: 'https://placehold.co/150x150/ADD8E6/000000?text=N' },
        { letter: 'Ñ', word: 'Ñu', image: 'https://placehold.co/150x150/D8BFD8/000000?text=Ñ' },
        { letter: 'O', word: 'Oso', image: 'https://placehold.co/150x150/FFDEAD/000000?text=O' },
        { letter: 'P', word: 'Pelaez', image: 'https://placehold.co/150x150/FFFACD/000000?text=P' },
        { letter: 'Q', word: 'Queso', image: 'https://placehold.co/150x150/F0F8FF/000000?text=Q' },
        { letter: 'R', word: 'Ramos', image: 'https://placehold.co/150x150/FFE4E1/000000?text=R' },
        { letter: 'S', word: 'Serpiente', image: 'https://placehold.co/150x150/FFEFD5/000000?text=S' },
        { letter: 'T', word: 'Tortuga', image: 'https://placehold.co/150x150/D2B48C/000000?text=T' },
        { letter: 'U', word: 'Uvas', image: 'https://placehold.co/150x150/E6E6FA/000000?text=U' },
        { letter: 'V', word: 'Victor', image: 'https://placehold.co/150x150/F5DEB3/000000?text=V' },
        { letter: 'W', word: 'Waterpolo', image: 'https://placehold.co/150x150/ADD8E6/000000?text=W' },
        { letter: 'X', word: 'Xilófono', image: 'https://placehold.co/150x150/E0FFFF/000000?text=X' },
        { letter: 'Y', word: 'Yaiza', image: 'https://placehold.co/150x150/FFFACD/000000?text=Y' },
        { letter: 'Z', word: 'Zorro', image: 'https://placehold.co/150x150/FFC0CB/000000?text=Z' },
    ];

    const lettersGridContainer = document.getElementById('letters-grid-container');
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
     * Función para crear y añadir una tarjeta de letra al contenedor.
     * @param {object} data - Objeto con la letra, palabra e imagen.
     */
    const createLetterCard = (data) => {
        const flipCard = document.createElement('div');
        flipCard.classList.add('flip-card');

        const flipCardInner = document.createElement('div');
        flipCardInner.classList.add('flip-card-inner');

        const flipCardFront = document.createElement('div');
        flipCardFront.classList.add('flip-card-front');

        const letterDisplay = document.createElement('h2');
        letterDisplay.classList.add('letter-display');
        letterDisplay.textContent = data.letter;

        const letterImage = document.createElement('img');
        letterImage.classList.add('letter-image');
        letterImage.src = data.image;
        letterImage.alt = `Imagen para la letra ${data.letter}`;
        letterImage.onerror = () => {
            letterImage.src = "https://placehold.co/150x150/CCCCCC/000000?text=No+Imagen"; // Fallback
        };

        flipCardFront.appendChild(letterDisplay);
        flipCardFront.appendChild(letterImage);

        const flipCardBack = document.createElement('div');
        flipCardBack.classList.add('flip-card-back');

        const wordDisplay = document.createElement('h2');
        wordDisplay.classList.add('word-display');
        wordDisplay.textContent = data.word;

        flipCardBack.appendChild(wordDisplay);

        flipCardInner.appendChild(flipCardFront);
        flipCardInner.appendChild(flipCardBack);
        flipCard.appendChild(flipCardInner);

        // Añadir evento de clic para voltear la tarjeta y pronunciar
        flipCard.addEventListener('click', () => {
            flipCard.classList.toggle('flipped'); // Alternar la clase 'flipped'
            if (flipCard.classList.contains('flipped')) {
                speakText(data.word); // Si está volteada, pronuncia la palabra
            } else {
                speakText(data.letter); // Si no, pronuncia la letra
            }
        });

        // Pronunciar la letra cuando la tarjeta se muestra inicialmente (opcional)
        // speakText(data.letter);

        lettersGridContainer.appendChild(flipCard);
    };

    // Generar todas las tarjetas de letras
    alphabetData.forEach(data => {
        createLetterCard(data);
    });
});
