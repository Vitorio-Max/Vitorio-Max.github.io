import { getShoppingList, addItemToList, removeItemFromList } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Carga la lista inicial al cargar la página
    await loadShoppingList();

    // Asigna event listeners a los botones
    document.getElementById('add-item-btn').addEventListener('click', handleAddItem);

    // Usa un event listener para delegar la eliminación
    document.getElementById('shoppingList').addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const li = e.target.closest('li');
            const itemId = li.dataset.id;
            const success = await removeItemFromList(itemId);
            if (success) {
                li.remove();
                calculateTotal();
            }
        }
    });

    document.getElementById('calculateTotal').addEventListener('click', calculateTotal);
});

const shoppingList = document.getElementById('shoppingList');

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
    const newItemInput = document.getElementById('newItem');
    const newQuantityInput = document.getElementById('newQuantity');
    const newPriceInput = document.getElementById('newPrice');

    const nombre = newItemInput.value.trim(); // Trim para eliminar espacios
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
        const quantity = parseInt(item.querySelector('.item-quantity').textContent.substring(1));
        const price = parseFloat(item.querySelector('.item-price').textContent.replace(' €', ''));
        total += quantity * price;
    });
    document.getElementById('totalPrice').textContent = `Total: ${total.toFixed(2)} €`;
}