import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage, setLocalStorage,loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const params = new URLSearchParams(window.location.search);
const productId = params.get("product");

const dataSource = new ExternalServices("tents");

async function init() {
  console.log("Product ID:", productId);

  const product = await dataSource.findProductById(productId);

  console.log("Loaded product:", product);

  if (!product) {
    document.querySelector(".product-detail").innerHTML =
      "<p>Product not found</p>";
    return;
  }

  document.querySelector(".product-detail").innerHTML =
    productTemplate(product);

  document
    .getElementById("addToCart")
    .addEventListener("click", addToCartHandler);
}

function productTemplate(product) {
  return `
    <h3>${product.Name}</h3>
    <img src="${product.Image}" alt="${product.Name}" />
    <p>${product.Description}</p>
    <p>$${product.FinalPrice}</p>

    <button id="addToCart" data-id="${product.Id}">
      Add to Cart
    </button>
  `;
}

function addToCartHandler(e) {
  const id = e.target.dataset.id;

  dataSource.findProductById(id).then((product) => {
    let cart = getLocalStorage("so-cart") || [];

    const existing = cart.find((p) => p.Id === product.Id);

    if (existing) {
      existing.quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }

    setLocalStorage("so-cart", cart);

    console.log("Cart updated:", cart);
  });
}

init();