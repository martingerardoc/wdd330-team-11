import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));

  document.querySelector(".product-list").innerHTML =
    htmlItems.join("");

  addRemoveListeners();
  addQuantityListeners();

  renderCartTotal(cartItems);
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll(".remove-item");

  removeButtons.forEach((button) => {
    button.addEventListener("click", removeItem);
  });
}

function addQuantityListeners() {
  const plusButtons =
    document.querySelectorAll(".increase-qty");

  const minusButtons =
    document.querySelectorAll(".decrease-qty");

  plusButtons.forEach((button) => {
    button.addEventListener("click", increaseQuantity);
  });

  minusButtons.forEach((button) => {
    button.addEventListener("click", decreaseQuantity);
  });
}

function increaseQuantity(event) {
  const id = event.target.dataset.id;

  let cartItems = getLocalStorage("so-cart") || [];

  const item = cartItems.find((item) => item.Id == id);

  if (item) {
    item.quantity += 1;
  }

  localStorage.setItem(
    "so-cart",
    JSON.stringify(cartItems)
  );

  renderCartContents();
}

function decreaseQuantity(event) {
  const id = event.target.dataset.id;

  let cartItems = getLocalStorage("so-cart") || [];

  const item = cartItems.find((item) => item.Id == id);

  if (item) {
    item.quantity -= 1;

    // remove if quantity reaches 0
    if (item.quantity <= 0) {
      cartItems = cartItems.filter(
        (item) => item.Id != id
      );
    }
  }

  localStorage.setItem(
    "so-cart",
    JSON.stringify(cartItems)
  );

  renderCartContents();
}


function removeItem(event) {
  const id = event.target.dataset.id;

  let cartItems = getLocalStorage("so-cart") || [];

  cartItems = cartItems.filter((item) => item.Id != id);

  localStorage.setItem("so-cart", JSON.stringify(cartItems));

  renderCartContents();
}


function cartItemTemplate(item) {
  const newItem = `
  <li class="cart-card divider" 
      style="
        position: relative;
        display: grid;
        grid-template-columns: 120px 1fr auto;
        gap: 1rem;
        align-items: center;
        padding: 3rem;
      ">

    <!-- REMOVE BUTTON -->
    <span 
  class="remove-item" 
  data-id="${item.Id}" 
  style="
    cursor:pointer;
    position:absolute;
    top:10px;
    right:10px;
    font-size:1.2rem;
  "
>
  ❌
</span>

    <!-- PRODUCT IMAGE -->
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
        style="
          width: 100%;
          max-width: 120px;
        "
      />
    </a>

    <!-- PRODUCT INFO -->
    <div>
      <a href="#">
        <h2 class="card__name">
          ${item.Name}
        </h2>
      </a>

      <p class="cart-card__color">
        ${item.Colors[0].ColorName}
      </p>
    </div>

    <!-- QUANTITY + PRICE -->
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      "
    >

      <!-- QUANTITY CONTROLS -->
      <div
        class="cart-card__quantity"
        style="
          display: flex;
          align-items: center;
          gap: 0.5rem;
        "
      >

        <button
          class="decrease-qty"
          data-id="${item.Id}"
          style="
            width: 35px;
            height: 35px;
            font-size: 1.2rem;
            cursor: pointer;
          "
        >
          -
        </button>

        <span style="font-weight: bold;">
          qty: ${item.quantity}
        </span>

        <button
          class="increase-qty"
          data-id="${item.Id}"
          style="
            width: 35px;
            height: 35px;
            font-size: 1.2rem;
            cursor: pointer;
          "
        >
          +
        </button>

      </div>

      <!-- PRICE -->
      <p
        class="cart-card__price"
        style="
          font-size: 1.2rem;
          font-weight: bold;
        "
      >
        $${(item.FinalPrice * item.quantity).toFixed(2)}
      </p>

    </div>

  </li>`;

  return newItem;
}
function renderCartTotal(cartItems) {
  const total = cartItems.reduce((sum, item) => {
    return sum + item.FinalPrice * item.quantity;
  }, 0);

  const totalElement = document.getElementById("cart-total");

  if (totalElement) {
    totalElement.textContent = total.toFixed(2);
  }
}

renderCartContents();
