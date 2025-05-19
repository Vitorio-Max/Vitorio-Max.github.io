document.addEventListener('DOMContentLoaded', () => {
    loadItems(); // Cargar los elementos al cargar la página
});

function addItem() {
    const newItemInput = document.getElementById('newItem');
    const newQuantityInput = document.getElementById('newQuantity');
    const newPriceInput = document.getElementById('newPrice');
    const itemName = newItemInput.value.trim();
    const quantity = parseInt(newQuantityInput.value);
    const price = parseFloat(newPriceInput.value);

    if (itemName) {
        fetch('/php/agregar_item.php', { // Cambia la ruta
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: itemName, cantidad: quantity, precio: price }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                newItemInput.value = '';
                newQuantityInput.value = 1;
                newPriceInput.value = 0.00;
                loadItems(); // Recargar la lista después de añadir
            } else {
                alert('Error al añadir el artículo: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al comunicarse con el servidor.');
        });
    }
}

function loadItems() {
    fetch('/php/obtener_items.php') // Cambia la ruta
        .then(response => response.json())
        .then(items => {
            const shoppingList = document.getElementById('shoppingList');
            shoppingList.innerHTML = ''; // Limpiar la lista actual
            items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.nombre} - Cantidad: ${item.cantidad}, Precio: ${parseFloat(item.precio).toFixed(2)} €`;
                shoppingList.appendChild(listItem);
            });
            calculateTotalDisplay(items); // Recalcular y mostrar el total
        })
        .catch(error => {
            console.error('Error al cargar los items:', error);
            alert('Hubo un error al cargar la lista de la compra.');
        });
}

function calculateTotal() {
    fetch('/php/calcular_total.php') // Cambia la ruta
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalPrice').textContent = `Total: ${data.total} €`;
        })
        .catch(error => {
            console.error('Error al calcular el total:', error);
            alert('Hubo un error al calcular el total.');
        });
}

function calculateTotalDisplay(items) {
    let total = 0;
    items.forEach(item => {
        total += item.cantidad * parseFloat(item.precio);
    });
    document.getElementById('totalPrice').textContent = `Total: ${total.toFixed(2)} €`;
}