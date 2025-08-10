import { getShoppingList, addItemToList, removeItemFromList } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadShoppingList();

    // Asignar eventos de clic directamente a los botones
    document.getElementById('add-item-btn').addEventListener('click', handleAddItem);
    document.getElementById('calculateTotal').addEventListener('click', calculateTotal);
    
    // Delegar el evento de eliminar
    document.getElementById('shoppingList').addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const li = e.target.closest('li');
            if (li) {
                const itemId = li.dataset.id;
                const success = await removeItemFromList(itemId);
                if (success) {
                    li.remove();
                    calculateTotal();
                }
            }
        }
    });
});

async function loadShoppingList() {
    const items = await getShoppingList();
    if (items) {
        shoppingList.innerHTML = ''; // Limpia la lista antes de cargar
        items.forEach(item => {
            renderItem(item);
        });
        calculateTotal();
    }
}

function renderItem(item) {
    const li = document.createElement('li');
    li.dataset.id = item.id;
    li.innerHTML = `
        <div class="item-details">
            <span class="item-name">${item.nombre}</span>
            <span class="item-quantity">x${item.cantidad}</span>
            <span class="item-price">${item.precio.toFixed(2)} €</span>
        </div>
        <button class="remove-btn">Eliminar</button>
    `;
    shoppingList.appendChild(li);
}

async function handleAddItem() {
    
    const nombre = newItemInput.value.trim();
    const cantidad = parseInt(newQuantityInput.value);
    const precio = parseFloat(newPriceInput.value);

    if (!nombre || isNaN(cantidad) || isNaN(precio) || cantidad < 1 || precio < 0) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const item = { nombre, cantidad, precio };
    const data = await addItemToList(item);

    if (data) {
        renderItem(data[0]);
        newItemInput.value = '';
        newQuantityInput.value = '1';
        newPriceInput.value = '0.00';
        calculateTotal();
    }
}

function calculateTotal() {
    const items = document.querySelectorAll('#shoppingList li');
    let total = 0;
    items.forEach(item => {
        const quantityText = item.querySelector('.item-quantity').textContent;
        const priceText = item.querySelector('.item-price').textContent;
        const quantity = parseInt(quantityText.substring(1));
        const price = parseFloat(priceText.replace(' €', ''));
        if (!isNaN(quantity) && !isNaN(price)) {
            total += quantity * price;
        }
    });
    totalPriceElement.textContent = `Total: ${total.toFixed(2)} €`;
}