function productTemplate(product) {
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
}

export default class ProductList {

  constructor(category, dataSource, listElement) {

    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {

    const products =
      await this.dataSource.getData(
        this.category
      );

    this.renderList(products);
  }

  renderList(products) {

    const html =
      products.map(productTemplate).join("");

    this.listElement.innerHTML = html;
  }
}