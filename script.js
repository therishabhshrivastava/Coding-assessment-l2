document.addEventListener("DOMContentLoaded", () => {
  const cartItemsList = document.getElementById("cart-items-list");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  const confirmationModal = document.getElementById("confirmation-modal");
  const confirmRemoveBtn = document.getElementById("confirm-remove-btn");
  const cancelRemoveBtn = document.getElementById("cancel-remove-btn");

  let itemToRemove = null; // store the item to remove

  // fetch cart data from API
  fetch(
    "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
  )
    .then((response) => response.json())
    .then((data) => {
      displayCartItems(data.items);
      updateTotalPrice(data.items);
    })
    .catch((error) => console.error("Error fetching cart data:", error));

  function displayCartItems(items) {
    cartItemsList.innerHTML = "";
    items.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>
            <div class="cart-item-details">
              <img src="${item.image}" alt="${
        item.title
      }" class="cart-item-image">
              <span class="cart-item-title">${item.title}</span>
            </div>
          </td>
          <td>₹${(item.price / 100).toFixed(2)}</td>
          <td>
            <input type="number" class="quantity-input" data-id="${
              item.id
            }" value="${item.quantity}" min="1">
          </td>
          <td class="subtotal" data-id="${item.id}">₹${(
        item.line_price / 100
      ).toFixed(2)}</td>
          <td>
            <button class="remove-btn" data-id="${
              item.id
            }"><i class="fas fa-trash" style="color: red;"></i></button>
          </td>
        `;
      cartItemsList.appendChild(row);
    });

    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("input", handleQuantityChange);
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", (event) =>
        handleRemoveItem(event, items)
      );
    });
  }

  // remove item
  function handleRemoveItem(event, items) {
    const itemId = event.target.dataset.id;
    itemToRemove = itemId;

    // show modal
    confirmationModal.classList.remove("hidden");

    // confirm button action
    confirmRemoveBtn.onclick = () => {
      removeItemFromCart(itemId, items);
      confirmationModal.classList.add("hidden");
    };

    // cancel button action
    cancelRemoveBtn.onclick = () => {
      confirmationModal.classList.add("hidden");
    };
  }

  function removeItemFromCart(itemId, items) {
    const updatedItems = items.filter((item) => item.id != itemId);
    displayCartItems(updatedItems);
    updateTotalPrice(updatedItems);
  }

  // quantity change
  function handleQuantityChange(event) {
    const input = event.target;
    const itemId = input.dataset.id;
    const newQuantity = parseInt(input.value);

    if (newQuantity < 1) {
      input.value = 1;
      return;
    }

    updateItemSubtotal(itemId, newQuantity);
    updateTotalPrice();
  }

  // subtotal price
  function updateItemSubtotal(itemId, quantity) {
    const itemRow = document.querySelector(`.subtotal[data-id="${itemId}"]`);
    const itemPrice = parseFloat(
      itemRow.previousElementSibling.previousElementSibling.textContent
        .replace("₹", "")
        .replace(",", "")
    );
    const newSubtotal = (itemPrice * quantity).toFixed(2);

    itemRow.textContent = `₹${newSubtotal}`;
    updateTotalPrice();
  }

  // total price
  function updateTotalPrice(items = []) {
    let total = 0;
    document.querySelectorAll(".subtotal").forEach((subtotal) => {
      total += parseFloat(
        subtotal.textContent.replace("₹", "").replace(",", "")
      );
    });

    subtotalElement.textContent = `₹${total.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;
  }
});
