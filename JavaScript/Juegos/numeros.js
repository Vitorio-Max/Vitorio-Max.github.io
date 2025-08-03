document.addEventListener('DOMContentLoaded', () => {
    const SHUFFLED_CONTAINER_ID = 'shuffled-numbers-container';
    const ORDERED_CONTAINER_ID = 'ordered-numbers-container';
    const RESET_BUTTON_ID = 'reset-btn';

    const shuffledNumbersContainer = document.getElementById(SHUFFLED_CONTAINER_ID);
    const orderedNumbersContainer = document.getElementById(ORDERED_CONTAINER_ID);
    const resetButton = document.getElementById(RESET_BUTTON_ID);

    const NUMBER_COUNT = 10; // Cantidad de números a ordenar (1 a 10)
    let nextExpectedNumber = 1;
    let speechSynthesisSupported = false;

    // Verificar la compatibilidad con la síntesis de voz
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
     * Genera un array de números del 1 al N y los mezcla.
     * @param {number} count - El número máximo a generar.
     * @returns {Array<number>} Un array de números mezclados.
     */
    const generateShuffledNumbers = (count) => {
        const numbers = Array.from({ length: count }, (_, i) => i + 1);
        // Algoritmo de Fisher-Yates para mezclar
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        return numbers;
    };

    /**
     * Crea un elemento de número clickeable.
     * @param {number} number - El número a mostrar.
     * @returns {HTMLElement} El elemento div del número.
     */
    const createNumberElement = (number) => {
        const numberDiv = document.createElement('div');
        numberDiv.classList.add('number-card');
        numberDiv.textContent = number;
        numberDiv.dataset.number = number; // Almacenar el número en un atributo de datos

        numberDiv.addEventListener('click', () => handleNumberClick(numberDiv));
        return numberDiv;
    };

    /**
     * Maneja el clic en un número mezclado.
     * @param {HTMLElement} clickedNumberDiv - El elemento div del número clickeado.
     */
    const handleNumberClick = (clickedNumberDiv) => {
        const clickedNumber = parseInt(clickedNumberDiv.dataset.number);

        if (clickedNumber === nextExpectedNumber) {
            // Número correcto, moverlo al contenedor ordenado
            clickedNumberDiv.classList.add('placed'); // Añadir clase para estilo de "colocado"
            clickedNumberDiv.removeEventListener('click', handleNumberClick); // Quitar el listener
            orderedNumbersContainer.appendChild(clickedNumberDiv); // Mover al nuevo contenedor
            speakText(clickedNumber.toString()); // Pronunciar el número

            nextExpectedNumber++;

            // Comprobar si el juego ha terminado
            if (nextExpectedNumber > NUMBER_COUNT) {
                speakText("¡Felicidades! Has ordenado todos los números.");
                // Opcional: deshabilitar más interacciones o mostrar un mensaje de victoria
            }
        } else {
            // Número incorrecto, dar feedback visual y de voz
            speakText(`Incorrecto, el siguiente número es ${nextExpectedNumber}`);
            clickedNumberDiv.classList.add('incorrect');
            // Quitar la clase 'incorrect' después de un breve tiempo
            setTimeout(() => {
                clickedNumberDiv.classList.remove('incorrect');
            }, 500);
        }
    };

    /**
     * Inicializa o reinicia el juego.
     */
    const initializeGame = () => {
        // Limpiar contenedores
        shuffledNumbersContainer.innerHTML = '';
        orderedNumbersContainer.innerHTML = '';
        nextExpectedNumber = 1;

        // Generar y mostrar números mezclados
        const shuffledNumbers = generateShuffledNumbers(NUMBER_COUNT);
        shuffledNumbers.forEach(num => {
            shuffledNumbersContainer.appendChild(createNumberElement(num));
        });

        // Crear espacios vacíos en el contenedor ordenado (opcional, para visualización)
        // for (let i = 0; i < NUMBER_COUNT; i++) {
        //     const emptySlot = document.createElement('div');
        //     emptySlot.classList.add('number-slot');
        //     orderedNumbersContainer.appendChild(emptySlot);
        // }
    };

    // Añadir event listener al botón de Reiniciar
    resetButton.addEventListener('click', initializeGame);

    // Iniciar el juego al cargar la página
    initializeGame();
});
