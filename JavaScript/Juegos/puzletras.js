let originalDraggableLetters = null;

document.addEventListener('DOMContentLoaded', () => {
    const lettersToDragContainer = document.getElementById('letters-to-drag');
    const droppables = document.querySelectorAll('.droppable-space');
    const successMessage = document.getElementById('success-message');
    const restartButton = document.getElementById('restart-button');
    
    // Almacenamos los elementos originales al cargar la página.
    originalDraggableLetters = Array.from(lettersToDragContainer.children).map(node => node.cloneNode(true));
    
    // Detectamos si es un dispositivo táctil
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    initializeGame();

    function initializeGame() {
        successMessage.classList.remove('visible-message');
        successMessage.classList.add('hidden-message');

        lettersToDragContainer.innerHTML = '';
        originalDraggableLetters.forEach(letter => {
            const clonedLetter = letter.cloneNode(true);
            lettersToDragContainer.appendChild(clonedLetter);
            
            // Habilitamos el arrastre del ratón solo si no es un dispositivo táctil
            if (!isTouchDevice) {
                clonedLetter.setAttribute('draggable', true);
            }
        });

        droppables.forEach(droppable => {
            droppable.innerHTML = '';
            droppable.classList.remove('correct');
        });

        if (isTouchDevice) {
            addTouchListeners();
        } else {
            addMouseListeners();
        }
    }

    // Funciones para añadir listeners
    function addMouseListeners() {
        const draggables = document.querySelectorAll('.draggable-letter');
        
        draggables.forEach(element => {
            element.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.letter);
                e.target.classList.add('dragging');
            });
            element.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });

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
                }
            });
        });
    }

    function addTouchListeners() {
        const draggables = document.querySelectorAll('.draggable-letter');
        let activeLetter = null;

        draggables.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                activeLetter = e.target;
                activeLetter.classList.add('dragging');
                activeLetter.style.position = 'absolute';
                activeLetter.style.left = `${touch.pageX - activeLetter.offsetWidth / 2}px`;
                activeLetter.style.top = `${touch.pageY - activeLetter.offsetHeight / 2}px`;
            });

            element.addEventListener('touchmove', (e) => {
                if (!activeLetter) return;
                e.preventDefault();
                const touch = e.touches[0];
                activeLetter.style.left = `${touch.pageX - activeLetter.offsetWidth / 2}px`;
                activeLetter.style.top = `${touch.pageY - activeLetter.offsetHeight / 2}px`;
            });

            element.addEventListener('touchend', (e) => {
                if (!activeLetter) return;
                const endTouch = e.changedTouches[0];
                
                // Ocultamos temporalmente el elemento que se está arrastrando
                activeLetter.style.display = 'none';
                
                // Encontramos el elemento en las coordenadas de soltado
                const targetElement = document.elementFromPoint(endTouch.clientX, endTouch.clientY);
                
                // Volvemos a mostrar el elemento arrastrado
                activeLetter.style.display = 'flex';
                activeLetter.classList.remove('dragging');

                if (targetElement && targetElement.classList.contains('droppable-space')) {
                    const draggedLetter = activeLetter.dataset.letter;
                    const correctLetter = targetElement.dataset.correctLetter;

                    if (draggedLetter === correctLetter && targetElement.children.length === 0) {
                        targetElement.appendChild(activeLetter);
                        activeLetter.style.position = '';
                        activeLetter.style.left = '';
                        activeLetter.style.top = '';
                        targetElement.classList.add('correct');
                        checkIfPuzzleComplete();
                    } else {
                        // Vuelve a su lugar si es incorrecta o el espacio está ocupado
                        lettersToDragContainer.appendChild(activeLetter);
                        activeLetter.style.position = '';
                        activeLetter.style.left = '';
                        activeLetter.style.top = '';
                    }
                } else {
                    // Si se suelta fuera, vuelve a su lugar
                    lettersToDragContainer.appendChild(activeLetter);
                    activeLetter.style.position = '';
                    activeLetter.style.left = '';
                    activeLetter.style.top = '';
                }
                activeLetter = null;
            });
        });
    }
    
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