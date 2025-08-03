document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle-container');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const puzzleMessage = document.getElementById('puzzle-message');
    const imageSelector = document.getElementById('imageSelector');

    // --- Configuración de las Imágenes del Rompecabezas ---
    const puzzleImages = [
        { id: 'cars', name: 'Rayo McQueen', path: 'imagenjuegos/rayo.webp' }, // ¡IMPORTANTE! Cambia esto a tus rutas
        { id: 'carss', name: 'Mate', path: 'imagenjuegos/mate.jpg' }, // ¡IMPORTANTE! Cambia esto a tus rutas
        { id: 'mickey', name: 'Mickey Mouse', path: 'imagenjuegos/Mickey.webp' }, // Asegúrate de tener estas imágenes
        { id: 'elsa', name: 'Elsa (Frozen)', path: 'imagenjuegos/frozen.jpeg' }, // Y renombrarlas o ajustarlas
        { id: 'dinosaur', name: 'Dinosaurio', path: 'imagenjuegos/trex.jpeg' }, // Ejemplo de imagen nueva
        // ¡Añade más objetos aquí para cada imagen de rompecabezas que quieras!
        // Asegúrate de que las imágenes sean cuadradas o las piezas se distorsionarán.
    ];

    const NUM_COLS = 3; // Número de columnas (ej. 3 para 3x3)
    const NUM_ROWS = 3; // Número de filas (ej. 3 para 3x3)
    const NUM_PIECES = NUM_COLS * NUM_ROWS;
    const PUZZLE_WIDTH = 600; // Ancho del rompecabezas en px (debe coincidir con CSS)
    const PUZZLE_HEIGHT = 600; // Alto del rompecabezas en px (debe coincidir con CSS)

    let pieces = []; // Array para almacenar las piezas del rompecabezas
    let currentDragPiece = null; // Pieza que se está arrastrando
    let currentDropTarget = null; // Elemento donde se va a soltar
    let selectedPuzzleImage = ''; // Almacena la ruta de la imagen seleccionada

    // --- Funciones del Juego ---

    /**
     * Rellena el selector de imágenes con las opciones disponibles.
     */
    const populateImageSelector = () => {
        imageSelector.innerHTML = ''; // Limpiar opciones existentes
        puzzleImages.forEach(img => {
            const option = document.createElement('option');
            option.value = img.id;
            option.textContent = img.name;
            imageSelector.appendChild(option);
        });
        // Establecer la imagen por defecto
        selectedPuzzleImage = puzzleImages[0].path;
    };

    /**
     * Carga la imagen, crea las piezas del rompecabezas y las dibuja.
     */
    const initializePuzzle = () => {
        puzzleContainer.innerHTML = ''; // Limpiar cualquier pieza anterior
        puzzleContainer.style.gridTemplateColumns = `repeat(${NUM_COLS}, 1fr)`; // Configurar CSS Grid

        pieces = [];
        for (let i = 0; i < NUM_PIECES; i++) {
            pieces.push(i); // Inicialmente, las piezas están en orden
        }

        renderPuzzle(); // Dibuja las piezas en orden (la imagen por defecto)
        resetButton.style.display = 'none'; // Oculta el botón de reiniciar
        puzzleMessage.style.display = 'none'; // Oculta el mensaje de éxito
        startButton.style.display = 'block'; // Muestra el botón de inicio
        imageSelector.disabled = false; // Habilita el selector al inicio
    };

    /**
     * Dibuja las piezas en el DOM en su orden actual con la imagen seleccionada.
     */
    const renderPuzzle = () => {
        puzzleContainer.innerHTML = ''; // Limpiar piezas existentes
        pieces.forEach((pieceIndex, displayIndex) => {
            const pieceElement = document.createElement('div');
            pieceElement.classList.add('puzzle-piece');
            pieceElement.dataset.originalIndex = pieceIndex; // El índice correcto de esta pieza
            pieceElement.dataset.currentIndex = displayIndex; // El índice actual en la cuadrícula

            // Calcular la posición de fondo para la imagen de la pieza
            const col = pieceIndex % NUM_COLS;
            const row = Math.floor(pieceIndex / NUM_COLS);
            const pieceWidth = PUZZLE_WIDTH / NUM_COLS;
            const pieceHeight = PUZZLE_HEIGHT / NUM_ROWS;

            pieceElement.style.backgroundImage = `url(${selectedPuzzleImage})`; // Usa la imagen seleccionada
            pieceElement.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
            pieceElement.style.width = `${pieceWidth}px`;
            pieceElement.style.height = `${pieceHeight}px`;

            // Hacer las piezas arrastrables
            pieceElement.setAttribute('draggable', false); // Por defecto no arrastrables hasta "Empezar Juego"

            // Añadir eventos de Drag & Drop
            pieceElement.addEventListener('dragstart', handleDragStart);
            pieceElement.addEventListener('dragover', handleDragOver);
            pieceElement.addEventListener('dragleave', handleDragLeave);
            pieceElement.addEventListener('drop', handleDrop);
            pieceElement.addEventListener('dragend', handleDragEnd);

            puzzleContainer.appendChild(pieceElement);
        });
    };

    /**
     * Mezcla las piezas del rompecabezas.
     */
    const shufflePuzzle = () => {
        // Asegúrate de que las piezas sean arrastrables antes de empezar a jugar
        puzzleContainer.querySelectorAll('.puzzle-piece').forEach(piece => {
            piece.setAttribute('draggable', true);
            piece.style.borderColor = 'rgba(0, 0, 0, 0.1)'; // Restaurar borde
            piece.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0.1)'; // Restaurar sombra
        });

        for (let i = pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pieces[i], pieces[j]] = [pieces[j], pieces[i]]; // Intercambiar elementos
        }
        renderPuzzle(); // Redibuja con las piezas mezcladas
    };

    /**
     * Comprueba si el rompecabezas está resuelto.
     * @returns {boolean} True si está resuelto, false en caso contrario.
     */
    const checkWin = () => {
        // Obtenemos los elementos del DOM y comparamos sus data-original-index con su posición actual
        const currentPieces = Array.from(puzzleContainer.children);
        for (let i = 0; i < currentPieces.length; i++) {
            if (parseInt(currentPieces[i].dataset.originalIndex) !== i) {
                return false;
            }
        }
        return true;
    };

    // --- Funciones de Drag & Drop (sin cambios) ---
    const handleDragStart = (e) => {
        currentDragPiece = e.target;
        e.dataTransfer.setData('text/plain', e.target.dataset.currentIndex);
        e.target.classList.add('dragging');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (e.target.classList.contains('puzzle-piece') && e.target !== currentDragPiece) {
            if (currentDropTarget && currentDropTarget !== e.target) {
                currentDropTarget.classList.remove('drop-target');
            }
            e.target.classList.add('drop-target');
            currentDropTarget = e.target;
        }
    };

    const handleDragLeave = (e) => {
        if (e.target.classList.contains('drop-target')) {
            e.target.classList.remove('drop-target');
            currentDropTarget = null;
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (currentDragPiece && e.target.classList.contains('puzzle-piece') && e.target !== currentDragPiece) {
            const dragIndex = parseInt(currentDragPiece.dataset.currentIndex);
            const dropIndex = parseInt(e.target.dataset.currentIndex);

            // Intercambiar los elementos en el DOM directamente para una mejor visualización del arrastre
            const draggedElement = puzzleContainer.querySelector(`[data-current-index="${dragIndex}"]`);
            const droppedOnElement = puzzleContainer.querySelector(`[data-current-index="${dropIndex}"]`);

            // Para intercambiar elementos en el DOM:
            // Clonamos para evitar problemas con referencias, insertamos, y luego removemos el original.
            const temp = document.createElement('div');
            puzzleContainer.insertBefore(temp, droppedOnElement);
            puzzleContainer.insertBefore(droppedOnElement, draggedElement);
            puzzleContainer.insertBefore(draggedElement, temp);
            puzzleContainer.removeChild(temp);
            
            // Actualizar los data-currentIndex de los elementos en el DOM
            draggedElement.dataset.currentIndex = dropIndex;
            droppedOnElement.dataset.currentIndex = dragIndex;

            // También necesitamos actualizar el array 'pieces' para el 'checkWin'
            // Encontrando los originales índices de las piezas que se han movido
            const originalDragPieceValue = pieces[dragIndex];
            const originalDropPieceValue = pieces[dropIndex];
            
            pieces[dragIndex] = originalDropPieceValue;
            pieces[dropIndex] = originalDragPieceValue;

            // Quitar clases de arrastre/soltar
            currentDragPiece.classList.remove('dragging');
            if (currentDropTarget) {
                currentDropTarget.classList.remove('drop-target');
            }
            currentDragPiece = null;
            currentDropTarget = null;

            // Comprobar si se ha ganado
            if (checkWin()) {
                puzzleMessage.style.display = 'block';
                // Deshabilitar arrastre y aplicar estilo de victoria
                puzzleContainer.querySelectorAll('.puzzle-piece').forEach(piece => {
                    piece.setAttribute('draggable', false);
                    piece.style.borderColor = '#22c55e'; // Borde verde de victoria
                    piece.style.boxShadow = 'inset 0 0 10px rgba(34, 197, 94, 0.5)';
                });
            }
        }
    };

    const handleDragEnd = (e) => {
        if (currentDragPiece) {
            currentDragPiece.classList.remove('dragging');
        }
        if (currentDropTarget) {
            currentDropTarget.classList.remove('drop-target');
        }
        currentDragPiece = null;
        currentDropTarget = null;
    };

    // --- Event Listeners ---
    startButton.addEventListener('click', () => {
        shufflePuzzle();
        startButton.style.display = 'none';
        resetButton.style.display = 'block';
        puzzleMessage.style.display = 'none';
        imageSelector.disabled = true; // Deshabilita el selector una vez que el juego ha comenzado
    });

    resetButton.addEventListener('click', () => {
        initializePuzzle(); // Reinicia el rompecabezas (lo ordena)
    });

    imageSelector.addEventListener('change', (event) => {
        const selectedId = event.target.value;
        const selectedImageObj = puzzleImages.find(img => img.id === selectedId);
        if (selectedImageObj) {
            selectedPuzzleImage = selectedImageObj.path;
            initializePuzzle(); // Reinicia el rompecabezas con la nueva imagen
        }
    });

    // Inicializar el selector de imágenes y el rompecabezas cuando la página cargue
    populateImageSelector();
    initializePuzzle();
});