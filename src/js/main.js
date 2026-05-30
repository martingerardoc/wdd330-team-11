import Alert from "./Alert.js";
import { loadHeaderFooter } from "./utils.mjs";

const alert = new Alert();
alert.init();

loadHeaderFooter();

async function getProducts() {
  const response = await fetch("/json/tents.json");

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return await response.json();
}

function productTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product/index.html?product=${product.Id}">
        <img
          src="${product.Image.replace("../", "/")}"
          alt="${product.Name}"
        />

        <h3 class="card__brand">
          ${product.Brand.Name}
        </h3>

        <h2 class="card__name">
          ${product.NameWithoutBrand}
        </h2>

        <p class="product-card__price">
          $${product.FinalPrice}
        </p>
      </a>
    </li>
  `;
}

function renderProductList(products, parentElement) {
  parentElement.innerHTML = products
    .map(productTemplate)
    .join("");
}

async function setupProducts() {
  const products = await getProducts();

  const productList = document.querySelector(".product-list");

  renderProductList(products, productList);
}

setupProducts();