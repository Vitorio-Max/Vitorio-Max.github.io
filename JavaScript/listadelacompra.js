// listadelacompra.js
import { getShoppingList, addItemToList, removeItemFromList } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadShoppingList();
});

const shoppingList = document.getElementById('shoppingList');

async function loadShoppingList() {
    const items = await getShoppingList();
    if (items) {
        items.forEach(item => {
            renderItem(item);
        });
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

    li.querySelector('.remove-btn').addEventListener('click', async () => {
        const itemId = li.dataset.id;
        const success = await removeItemFromList(itemId);
        if (success) {
            li.remove();
            calculateTotal();
        }
    });

    shoppingList.appendChild(li);
}

// Ahora, la función global se encarga de todo el proceso de añadir un ítem.
window.handleAddItem = async function() {
    const newItemInput = document.getElementById('newItem');
    const newQuantityInput = document.getElementById('newQuantity');
    const newPriceInput = document.getElementById('newPrice');

    const nombre = newItemInput.value;
    const cantidad = parseInt(newQuantityInput.value);
    const precio = parseFloat(newPriceInput.value);

    if (!nombre || isNaN(cantidad) || isNaN(precio)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const item = { nombre, cantidad, precio };
    const data = await addItemToList(item); // Se llama a la función de Supabase

    if (data) {
        renderItem(data[0]);
        newItemInput.value = '';
        newQuantityInput.value = '1';
        newPriceInput.value = '0.00';
        calculateTotal();
    }
}

window.calculateTotal = function() {
    const items = document.querySelectorAll('#shoppingList li');
    let total = 0;
    items.forEach(item => {
        const quantity = parseInt(item.querySelector('.item-quantity').textContent.substring(1));
        const price = parseFloat(item.querySelector('.item-price').textContent.replace(' €', ''));
        total += quantity * price;
    });
    document.getElementById('totalPrice').textContent = `Total: ${total.toFixed(2)} €`;
}