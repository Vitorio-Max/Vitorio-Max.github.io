document.addEventListener('DOMContentLoaded', () => {
    // 1. Definición de palabras y sílabas
    const words = [
        { word: 'CASA', syllables: ['CA', 'SA'] },
        { word: 'PERRO', syllables: ['PE', 'RRO'] },
        { word: 'GATO', syllables: ['GA', 'TO'] },
        { word: 'SOL', syllables: ['SOL'] },
        { word: 'LUNA', syllables: ['LU', 'NA'] },
        { word: 'FLOR', syllables: ['FLOR'] },
        { word: 'MESA', syllables: ['ME', 'SA'] },
        { word: 'LIBRO', syllables: ['LI', 'BRO'] },
        { word: 'AGUA', syllables: ['A', 'GUA'] },
        { word: 'MANZANA', syllables: ['MAN', 'ZA', 'NA'] }
    ];

    // 2. Variables de estado del juego
    let currentWordIndex = 0;
    let clickedSyllables = []; // Almacena las sílabas clicadas en orden

    // 3. Obtención de elementos del DOM
    const wordDisplayText = document.getElementById('current-word-text');
    const syllablesContainer = document.getElementById('syllables-container');
    const dropArea = document.getElementById('drop-area'); // Usamos el ID existente
    const checkWordBtn = document.getElementById('check-word-btn');
    const nextWordBtn = document.getElementById('next-word-btn');
    const feedbackMessage = document.getElementById('feedback-message');

    // 4. Funciones auxiliares

    /**
     * Mezcla aleatoriamente los elementos de un array.
     * @param {Array} array - El array a mezclar.
     * @returns {Array} El array mezclado.
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Carga la palabra actual en la interfaz de usuario.
     */
    function loadWord() {
        if (currentWordIndex >= words.length) {
            wordDisplayText.textContent = '¡Felicidades, has completado todas las palabras! 🎉';
            syllablesContainer.innerHTML = '';
            dropArea.innerHTML = '<p>¡Juego terminado!</p>'; // Mensaje final en dropArea
            checkWordBtn.style.display = 'none';
            nextWordBtn.style.display = 'none';
            feedbackMessage.textContent = '';
            return;
        }

        const currentWord = words[currentWordIndex];
        // Muestra la palabra con espacios entre letras para facilitar la lectura inicial
        wordDisplayText.textContent = `Forma la palabra: ${currentWord.word.split('').join(' ')}`;
        
        syllablesContainer.innerHTML = ''; // Limpiar sílabas anteriores
        dropArea.innerHTML = '<p>Arrastra las sílabas aquí para formar la palabra</p>'; // Mensaje inicial de dropArea
        feedbackMessage.textContent = '';
        clickedSyllables = []; // Resetear sílabas clicadas

        // Mezclar las sílabas y crearlas en el DOM
        const shuffledSyllables = shuffleArray([...currentWord.syllables]);
        shuffledSyllables.forEach(syllable => {
            const syllableDiv = document.createElement('div');
            syllableDiv.classList.add('syllable-block');
            syllableDiv.textContent = syllable;
            syllableDiv.dataset.syllable = syllable; // Guarda la sílaba en un dataset
            syllableDiv.addEventListener('click', handleSyllableClick); // Añadir listener de clic
            syllablesContainer.appendChild(syllableDiv);
        });

        checkWordBtn.style.display = 'block';
        nextWordBtn.style.display = 'none'; // Ocultar el botón "Siguiente"
    }

    /**
     * Maneja el clic en una sílaba.
     * @param {Event} e - El evento de clic.
     */
    function handleSyllableClick(e) {
        const clickedSyllable = e.target.dataset.syllable;
        clickedSyllables.push(clickedSyllable);

        // Remover el mensaje inicial si existe
        if (dropArea.querySelector('p')) {
            dropArea.querySelector('p').remove();
        }

        // Crear y añadir la sílaba al área de palabra formada (dropArea)
        const formedSyllableDiv = document.createElement('span');
        formedSyllableDiv.classList.add('formed-syllable'); // Usamos una nueva clase para styling
        formedSyllableDiv.textContent = clickedSyllable;
        dropArea.appendChild(formedSyllableDiv);

        // Deshabilitar la sílaba clicada en el contenedor original
        e.target.classList.add('clicked');
        e.target.removeEventListener('click', handleSyllableClick);
        
        feedbackMessage.textContent = ''; // Limpiar feedback al seguir clicando
    }

    /**
     * Resetea las sílabas clicadas y las devuelve al contenedor original,
     * y vuelve a habilitar sus listeners.
     */
    function resetClickedSyllables() {
        // Mover los elementos de vuelta al contenedor de sílabas
        // Conservamos el orden original de las sílabas para recrearlas si es necesario
        const currentWordSyllables = words[currentWordIndex].syllables;
        const currentSyllableBlocks = Array.from(syllablesContainer.querySelectorAll('.syllable-block.clicked'));
        
        // Limpiamos ambos contenedores
        syllablesContainer.innerHTML = '';
        dropArea.innerHTML = '<p>Arrastra las sílabas aquí para formar la palabra</p>';
        clickedSyllables = [];

        // Volvemos a crear y añadir todas las sílabas (las que estaban y las que se habían 'clicado')
        // de la palabra actual, y las mezclamos para el nuevo intento.
        const shuffledSyllables = shuffleArray([...currentWordSyllables]);
        shuffledSyllables.forEach(syllable => {
            const syllableDiv = document.createElement('div');
            syllableDiv.classList.add('syllable-block');
            syllableDiv.textContent = syllable;
            syllableDiv.dataset.syllable = syllable;
            syllableDiv.addEventListener('click', handleSyllableClick);
            syllablesContainer.appendChild(syllableDiv);
        });
    }

    // 5. Asignación de Event Listeners a los botones

    checkWordBtn.addEventListener('click', () => {
        // Obtener la palabra formada del contenido de dropArea (sílabas clicadas)
        const formedWordElements = Array.from(dropArea.querySelectorAll('.formed-syllable'));
        const formedWord = formedWordElements.map(el => el.textContent).join('');
        
        const correctWord = words[currentWordIndex].word;

        if (formedWord === correctWord) {
            feedbackMessage.textContent = '¡Correcto! 🎉';
            feedbackMessage.style.color = '#28a745'; // Verde
            nextWordBtn.style.display = 'block'; // Mostrar botón "Siguiente"
            checkWordBtn.style.display = 'none'; // Ocultar botón "Comprobar"
            
            // Deshabilitar clics en sílabas una vez acertado
            const allSyllableBlocks = syllablesContainer.querySelectorAll('.syllable-block');
            allSyllableBlocks.forEach(block => block.removeEventListener('click', handleSyllableClick));

        } else {
            feedbackMessage.textContent = '¡Incorrecto! Intenta de nuevo. 🤔';
            feedbackMessage.style.color = '#dc3545'; // Rojo
            // Resetear las sílabas si es incorrecto para un nuevo intento
            resetClickedSyllables(); 
        }
    });

    nextWordBtn.addEventListener('click', () => {
        currentWordIndex++;
        loadWord();
    });

    // 6. Inicio del juego
    loadWord();
});