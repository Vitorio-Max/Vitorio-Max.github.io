document.addEventListener('DOMContentLoaded', () => {
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

    let currentWordIndex = 0;
    let shuffledSyllables = [];
    let droppedSyllables = [];

    const wordDisplayText = document.getElementById('current-word-text');
    const syllablesContainer = document.getElementById('syllables-container');
    const dropArea = document.getElementById('drop-area');
    const checkWordBtn = document.getElementById('check-word-btn');
    const nextWordBtn = document.getElementById('next-word-btn');
    const feedbackMessage = document.getElementById('feedback-message');

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function loadWord() {
        if (currentWordIndex >= words.length) {
            wordDisplayText.textContent = '¡Felicidades, has completado todas las palabras! 🎉';
            syllablesContainer.innerHTML = '';
            dropArea.innerHTML = '<p>¡Juego terminado!</p>';
            checkWordBtn.style.display = 'none';
            nextWordBtn.style.display = 'none';
            feedbackMessage.textContent = '';
            return;
        }

        const currentWord = words[currentWordIndex];
        wordDisplayText.textContent = `Forma la palabra: ${currentWord.word.split('').join(' ')}`; // Muestra la palabra con espacios entre letras para facilitar la lectura inicial
        syllablesContainer.innerHTML = '';
        dropArea.innerHTML = '<p>Arrastra las sílabas aquí para formar la palabra</p>';
        feedbackMessage.textContent = '';
        droppedSyllables = [];

        shuffledSyllables = shuffleArray([...currentWord.syllables]);

        shuffledSyllables.forEach(syllable => {
            const syllableDiv = document.createElement('div');
            syllableDiv.classList.add('syllable-block');
            syllableDiv.textContent = syllable;
            syllableDiv.setAttribute('draggable', true);
            syllableDiv.dataset.syllable = syllable; // Guarda la sílaba en un dataset
            syllablesContainer.appendChild(syllableDiv);
        });

        addDragAndDropListeners();
        checkWordBtn.style.display = 'block';
        nextWordBtn.style.display = 'none'; // Ocultar el botón "Siguiente" hasta que se acierte
    }

    function addDragAndDropListeners() {
        const syllableBlocks = document.querySelectorAll('.syllable-block');

        syllableBlocks.forEach(block => {
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.syllable);
                e.dataTransfer.effectAllowed = 'move';
                // Añade una clase para indicar que se está arrastrando
                e.target.classList.add('dragging');
            });

            block.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });

        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault(); // Permite el drop
            e.dataTransfer.dropEffect = 'move';
            dropArea.classList.add('drag-over'); // Añade un estilo al área de drop
        });

        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('drag-over');
        });

        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('drag-over');

            const data = e.dataTransfer.getData('text/plain');
            const draggedSyllableDiv = document.querySelector(`.syllable-block[data-syllable="${data}"].dragging`);

            if (draggedSyllableDiv && !droppedSyllables.includes(data)) {
                // Elimina el mensaje inicial si existe
                if (dropArea.querySelector('p')) {
                    dropArea.querySelector('p').remove();
                }

                const droppedSyllableBlock = draggedSyllableDiv.cloneNode(true);
                droppedSyllableBlock.classList.remove('dragging'); // Elimina la clase de arrastre
                droppedSyllableBlock.classList.add('dropped'); // Añade una clase para estilos de soltado
                droppedSyllableBlock.removeAttribute('draggable'); // Una vez soltada, no es arrastrable
                droppedSyllableBlock.style.marginRight = '10px'; // Espacio entre sílabas

                dropArea.appendChild(droppedSyllableBlock);
                droppedSyllables.push(data); // Agrega la sílaba al array de soltadas

                // Elimina la sílaba original del contenedor de sílabas
                draggedSyllableDiv.remove();
            }
        });
    }

    checkWordBtn.addEventListener('click', () => {
        const formedWord = droppedSyllables.join('');
        const correctWord = words[currentWordIndex].word;

        if (formedWord === correctWord) {
            feedbackMessage.textContent = '¡Correcto! 🎉';
            feedbackMessage.style.color = '#28a745';
            nextWordBtn.style.display = 'block'; // Mostrar botón "Siguiente"
            checkWordBtn.style.display = 'none'; // Ocultar botón "Comprobar"
            // Deshabilitar arrastre y drop para la palabra actual si se quiere
            const syllableBlocks = document.querySelectorAll('.syllable-block');
            syllableBlocks.forEach(block => block.setAttribute('draggable', false));
            dropArea.removeEventListener('dragover', () => {});
            dropArea.removeEventListener('drop', () => {});

            // Reproducir sonido de éxito (opcional)
            // const successSound = new Audio('path/to/success.mp3');
            // successSound.play();

        } else {
            feedbackMessage.textContent = '¡Incorrecto! Intenta de nuevo. 🤔';
            feedbackMessage.style.color = '#dc3545';
            // Volver a las sílabas al contenedor original si se quiere un reset automático
            // resetSyllables();
        }
    });

    nextWordBtn.addEventListener('click', () => {
        currentWordIndex++;
        loadWord();
    });

    // Cargar la primera palabra al inicio
    loadWord();
});