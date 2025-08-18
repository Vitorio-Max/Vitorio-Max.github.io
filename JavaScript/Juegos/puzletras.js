document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los elementos con la clase para arrastrar y soltar
    const draggables = document.querySelectorAll('.draggable-letter');
    const droppables = document.querySelectorAll('.droppable-space');

    console.log('Juego cargado. Elementos arrastrables:', draggables.length, 'Elementos para soltar:', droppables.length);

    // Bucle para añadir eventos de arrastre a cada letra
    draggables.forEach(draggable => {
        // Habilitamos el arrastre en el elemento
        draggable.setAttribute('draggable', true);

        draggable.addEventListener('dragstart', (e) => {
            console.log('Arrastrando:', e.target.textContent);
            // Guardamos la letra que se está arrastrando
            e.dataTransfer.setData('text/plain', e.target.dataset.letter);
            // Opcional: añadimos una clase para dar estilo mientras se arrastra
            e.target.classList.add('dragging');
        });

        draggable.addEventListener('dragend', (e) => {
            // Opcional: removemos la clase al soltar
            e.target.classList.remove('dragging');
        });
    });

    // Bucle para añadir eventos de soltar a cada espacio
    droppables.forEach(droppable => {
        droppable.addEventListener('dragover', (e) => {
            // Evita el comportamiento por defecto para permitir soltar
            e.preventDefault();
            droppable.classList.add('hovered');
        });

        droppable.addEventListener('dragleave', () => {
            droppable.classList.remove('hovered');
        });

        droppable.addEventListener('drop', (e) => {
            e.preventDefault();
            droppable.classList.remove('hovered');
            
            // Obtenemos la letra arrastrada
            const draggedLetter = e.dataTransfer.getData('text/plain');
            const correctLetter = droppable.dataset.correctLetter;

            console.log('Soltado en:', droppable.dataset.correctLetter, 'Letra arrastrada:', draggedLetter);
            
            // Verificamos si la letra es correcta y si el espacio está vacío
            if (draggedLetter === correctLetter && droppable.children.length === 0) {
                // Creamos un nuevo elemento con la letra correcta para colocarlo en el espacio
                const newLetterDiv = document.createElement('div');
                newLetterDiv.textContent = draggedLetter;
                newLetterDiv.classList.add('placed-letter');

                // Opcional: añadimos una animación al colocar la letra
                newLetterDiv.style.animation = 'popIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
                
                droppable.appendChild(newLetterDiv);
                
                checkIfPuzzleComplete();
            } else {
                console.log('Letra incorrecta o espacio ocupado.');
            }
        });
    });

    const checkIfPuzzleComplete = () => {
        const correctLettersCount = document.querySelectorAll('.droppable-space .placed-letter').length;
        console.log('Letras correctas colocadas:', correctLettersCount);
        if (correctLettersCount === droppables.length) {
            alert('¡Felicidades! Has formado la palabra "CASA"');
            // Aquí podrías añadir más lógica para reiniciar el juego
        }
    };
});