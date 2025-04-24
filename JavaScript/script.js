const newItemInput = document.getElementById('newItem');
const newQuantityInput = document.getElementById('newQuantity');
const newPriceInput = document.getElementById('newPrice');
const shoppingList = document.getElementById('shoppingList');
const totalPriceDisplay = document.getElementById('totalPrice');

function addItem() {
    const itemName = newItemInput.value.trim();
    const quantity = parseInt(newQuantityInput.value);
    const price = parseFloat(newPriceInput.value);

    if (itemName !== "") {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${itemName}</span>
            <span class="item-details">Cantidad: ${quantity}</span>
            <span class="item-details">Precio: ${price.toFixed(2)} €</span>
            <button class="delete-btn" onclick="removeItem(this)">Eliminar</button>
        `;
        shoppingList.appendChild(listItem);
        newItemInput.value = "";
        newQuantityInput.value = "1";
        newPriceInput.value = "0.00";
    }
}

function removeItem(button) {
    const listItem = button.parentNode;
    shoppingList.removeChild(listItem);
}

function calculateTotal() {
    let total = 0;
    const listItems = shoppingList.querySelectorAll('li');
    listItems.forEach(item => {
        const quantityMatch = item.textContent.match(/Cantidad: (\d+)/);
        const priceMatch = item.textContent.match(/Precio: ([\d.]+)/);
        if (quantityMatch && priceMatch) {
            const quantity = parseInt(quantityMatch[1]);
            const price = parseFloat(priceMatch[1]);
            total += quantity * price;
        }
    });
    totalPriceDisplay.textContent = `Total: ${total.toFixed(2)} €`;
}

// Permitir añadir con la tecla Enter en el campo de artículo
newItemInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addItem();
    }
});