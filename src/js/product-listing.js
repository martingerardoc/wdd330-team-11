import ExternalServices from "./ExternalServices.mjs";

const dataSource = new ExternalServices("tents");

async function loadProducts() {
  const products = await dataSource.getData();

  const list = document.querySelector(".product-list");

  list.innerHTML = products
    .map((product) => {
      return `
        <li class="product-card">
          <a href="/product/index.html?product=${product.Id}">
            <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
            <h3>${product.Brand.Name}</h3>
            <h2>${product.NameWithoutBrand}</h2>
            <p>$${product.FinalPrice}</p>
          </a>
        </li>
      `;
    })
    .join("");
}

loadProducts();