document.addEventListener('DOMContentLoaded', () => {
    // Array de datos para las letras, palabras e imágenes correspondientes
    const alphabetData = [
        { letter: 'A', word: 'Avión', image: '../../Imagenes/imagenjuegos/avion.jpeg' },
        { letter: 'B', word: 'Barco', image: '../../Imagenes/imagenjuegos/barco.jpeg' },
        { letter: 'C', word: 'Casa', image: '../../Imagenes/casa.jpeg' },
        { letter: 'D', word: 'Delfín', image: '../../Imagenes/imagenjuegos/delfin.jpeg' },
        { letter: 'E', word: 'Erik', image: 'https://placehold.co/150x150/FFDAB9/000000?text=E' },
        { letter: 'F', word: 'Flor', image: '../../Imagenes/flor.png' },
        { letter: 'G', word: 'Gato', image: '../../Imagenes/imagenjuegos/gato.jpeg' },
        { letter: 'H', word: 'Helado', image: '../../Imagenes/imagenjuegos/helado.jpeg' },
        { letter: 'I', word: 'Isla', image: '../../Imagenes/imagenjuegos/isla.jpeg' },
        { letter: 'J', word: 'Jana', image: 'https://placehold.co/150x150/F5DEB3/000000?text=J' },
        { letter: 'K', word: 'Koala', image: '../../Imagenes/imagenjuegos/koala.jpeg' },
        { letter: 'L', word: 'Lima', image: 'https://placehold.co/150x150/FFC0CB/000000?text=L' },
        { letter: 'M', word: 'Mono', image: '../../Imagenes/imagenjuegos/mono.jpeg' },
        { letter: 'N', word: 'Nube', image: '../../Imagenes/imagenjuegos/nube.jpeg' },
        { letter: 'Ñ', word: 'Ñu', image: '../../Imagenes/imagenjuegos/ñu.jpeg' },
        { letter: 'O', word: 'Oso', image: '../../Imagenes/imagenjuegos/oso.png' },
        { letter: 'P', word: 'Pelaez', image: 'https://placehold.co/150x150/FFFACD/000000?text=P' },
        { letter: 'Q', word: 'Queso', image: '../../Imagenes/imagenjuegos/queso.jpeg' },
        { letter: 'R', word: 'Ramos', image: 'https://placehold.co/150x150/FFE4E1/000000?text=R' },
        { letter: 'S', word: 'Serpiente', image: '../../Imagenes/imagenjuegos/serpiente.jpeg' },
        { letter: 'T', word: 'Tortuga', image: '../../Imagenes/imagenjuegos/tortuga.png' },
        { letter: 'U', word: 'Uvas', image: '../../Imagenes/imagenjuegos/uvas.jpeg' },
        { letter: 'V', word: 'Victor', image: 'https://placehold.co/150x150/F5DEB3/000000?text=V' },
        { letter: 'W', word: 'Waterpolo', image: '../../Imagenes/imagenjuegos/waterpolo.jpeg' },
        { letter: 'X', word: 'Xilófono', image: '../../Imagenes/imagenjuegos/xilofono.jpeg' },
        { letter: 'Y', word: 'Yaiza', image: 'https://placehold.co/150x150/FFFACD/000000?text=Y' },
        { letter: 'Z', word: 'Zorro', image: '../../Imagenes/imagenjuegos/zorro.jpeg' },
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
