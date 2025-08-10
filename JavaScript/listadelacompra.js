import { getShoppingList, addItemToList, removeItemFromList, supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadShoppingList();

    // Asigna el event listener a los botones por su ID
    document.getElementById('add-item-btn').addEventListener('click', handleAddItem);
    document.getElementById('calculateTotal').addEventListener('click', calculateTotal);
});

const shoppingList = document.getElementById('shoppingList');

async function loadShoppingList() {
    const items = await getShoppingList();
    if (items) {
        items.forEach(items => {
            renderItem(items);
        });
    }
}

function renderItem(item) {
    const li = document.createElement('li');
    li.dataset.id = item.id;
    li.innerHTML = `
        <div class="item-details">
            <span class="item-name">${items.nombre}</span>
            <span class="item-quantity">x${items.cantidad}</span>
            <span class="item-price">${items.precio.toFixed(2)} €</span>
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

// Define las funciones como funciones normales
async function handleAddItem() {
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

    const items = { nombre, cantidad, precio };
    const data = await addItemToList(items);

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
        const quantity = parseInt(item.querySelector('.items-quantity').textContent.substring(1));
        const price = parseFloat(item.querySelector('.items-price').textContent.replace(' €', ''));
        total += quantity * price;
    });
    document.getElementById('totalPrice').textContent = `Total: ${total.toFixed(2)} €`;
}