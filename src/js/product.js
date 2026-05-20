import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const product = await dataSource.findProductById(productId);

const params = new URLSearchParams(window.location.search);

const productId = params.get("product");


function productTemplate(product) {
  return `
    <h3>${product.Name}</h3>

    <img
      src="${product.Image}"
      alt="${product.Name}"
    />

    <p>${product.Description}</p>

    <p>$${product.FinalPrice}</p>

    <button id="addToCart" data-id="${product.Id}">
      Add to Cart
    </button>
  `;
}

function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart") || [];

  const existingItem = cartItems.find(
    (item) => item.Id === product.Id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    product.quantity = 1;
    cartItems.push(product);
  }

  setLocalStorage("so-cart", cartItems);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

  document.querySelector(".product-detail").innerHTML =
  productTemplate(product);
