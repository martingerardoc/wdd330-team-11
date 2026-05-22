import Alert from "./Alert.js";
import { loadHeaderFooter } from "./utils.mjs";


const alert = new Alert();
alert.init();

loadHeaderFooter();

const productLinks = {
  "880RR": "marmot-ajax-3.html",
  "985RF": "northface-talus-4.html",
  "985PR": "northface-alpine-3.html",
  "344YJ": "cedar-ridge-rimrock-2.html"
};

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
      <a href="product_pages/${productLinks[product.Id]}">
        <img
          src="${product.Image.replace('../', '/')}"
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
  const html = products.map(productTemplate).join("");

  parentElement.innerHTML = html;
}

async function setupProducts() {
  const products = await getProducts();

  // only products with existing detail pages
  const filteredProducts = [
    products[0],
    products[1],
    products[3],
    products[5]
  ];

  const productList =
    document.querySelector(".product-list");

  renderProductList(filteredProducts, productList);
}

setupProducts();