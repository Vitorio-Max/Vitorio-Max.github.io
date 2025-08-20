let originalDraggableLetters = null;

document.addEventListener('DOMContentLoaded', () => {
    const lettersToDragContainer = document.getElementById('letters-to-drag');
    const droppables = document.querySelectorAll('.droppable-space');
    const successMessage = document.getElementById('success-message');
    const restartButton = document.getElementById('restart-button');
    
    // Almacenamos las letras originales al cargar la página
    originalDraggableLetters = Array.from(lettersToDragContainer.children);

    initializeGame();

    function initializeGame() {
        // Ocultamos el mensaje de éxito
        successMessage.classList.remove('visible-message');
        successMessage.classList.add('hidden-message');

        // Reiniciamos el contenedor de letras arrastrables
        lettersToDragContainer.innerHTML = '';
        originalDraggableLetters.forEach(letter => {
            // Clonamos la letra y la reinsertamos en el contenedor
            const clonedLetter = letter.cloneNode(true);
            clonedLetter.setAttribute('draggable', true);
            clonedLetter.style.display = 'flex';
            lettersToDragContainer.appendChild(clonedLetter);

            // Re-agregamos los listeners a las letras clonadas
            clonedLetter.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.letter);
                e.target.classList.add('dragging');
            });
            clonedLetter.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });

        // Limpiamos los espacios para soltar
        droppables.forEach(droppable => {
            droppable.innerHTML = '';
            droppable.classList.remove('correct');
        });
    }

    droppables.forEach(droppable => {
        droppable.addEventListener('dragover', (e) => {
            e.preventDefault();
            droppable.classList.add('hovered');
        });

        droppable.addEventListener('dragleave', () => {
            droppable.classList.remove('hovered');
        });

        droppable.addEventListener('drop', (e) => {
            e.preventDefault();
            droppable.classList.remove('hovered');
            
            const draggedLetter = e.dataTransfer.getData('text/plain');
            const correctLetter = droppable.dataset.correctLetter;

            const draggedElement = document.querySelector('.draggable-letter.dragging');
            
            if (draggedLetter === correctLetter && droppable.children.length === 0) {
                droppable.appendChild(draggedElement);
                draggedElement.style.cssText = '';
                droppable.classList.add('correct');
                checkIfPuzzleComplete();
            } else {
                console.log('Letra incorrecta o espacio ocupado.');
            }
        });
    });

    const checkIfPuzzleComplete = () => {
        const correctLettersCount = document.querySelectorAll('.droppable-space.correct').length;
        if (correctLettersCount === droppables.length) {
            successMessage.classList.remove('hidden-message');
            successMessage.classList.add('visible-message');
        }
    };
    
    restartButton.addEventListener('click', () => {
        initializeGame();
    });
});