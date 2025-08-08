import { getShoppingList, addItemToList, removeItemFromList } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Carga los datos de la lista de la compra al iniciar
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
    li.dataset.id = item.id; // Guarda el ID de Supabase en el elemento
    li.innerHTML = `
        <div class="item-details">
            <span class="item-name">${item.nombre}</span>
            <span class="item-quantity">x${item.cantidad}</span>
            <span class="item-price">${item.precio.toFixed(2)} €</span>
        </div>
        <button class="remove-btn">Eliminar</button>
    `;
    
    // Añade un event listener al botón de eliminar
    li.querySelector('.remove-btn').addEventListener('click', async () => {
        const itemId = li.dataset.id;
        const success = await removeItemFromList(itemId);
        if (success) {
            li.remove(); // Elimina el elemento de la interfaz
            calculateTotal(); // Recalcula el total
        }
    });

    shoppingList.appendChild(li);
}

// Esta es la función que se ejecuta cuando el usuario hace clic en "Añadir"
async function addItemToList() {
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
    const data = await addItemToList(item);
    
    if (data) {
        renderItem(data[0]); // Renderiza el nuevo item que Supabase nos devolvió
        newItemInput.value = '';
        newQuantityInput.value = '1';
        newPriceInput.value = '0.00';
        calculateTotal();
    }
}

function calculateTotal() {
    // Lógica para calcular el total. Ahora deberías obtener los datos
    // directamente de la base de datos o de los elementos en el DOM.
    // Para simplificar, puedes iterar sobre los elementos <li> existentes.
    const items = document.querySelectorAll('#shoppingList li');
    let total = 0;
    items.forEach(item => {
        const quantity = parseInt(item.querySelector('.item-quantity').textContent.substring(1));
        const price = parseFloat(item.querySelector('.item-price').textContent.replace(' €', ''));
        total += quantity * price;
    });
    document.getElementById('totalPrice').textContent = `Total: ${total.toFixed(2)} €`;
}