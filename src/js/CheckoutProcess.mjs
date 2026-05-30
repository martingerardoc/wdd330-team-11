import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;

    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;

    this.services = new ExternalServices("tents");
  }

  init() {
    this.list = getLocalStorage(this.key) || [];

    this.calculateItemSubTotal();
    this.calculateOrderTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, item) =>
        sum + item.FinalPrice * item.quantity,
      0
    );

    document.querySelector(
      `${this.outputSelector} #subtotal`
    ).innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    const itemCount = this.list.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    this.tax = this.itemTotal * 0.06;

    this.shipping =
      itemCount > 0
        ? 10 + (itemCount - 1) * 2
        : 0;

    this.orderTotal =
      this.itemTotal +
      this.tax +
      this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(
      `${this.outputSelector} #tax`
    ).innerText = `$${this.tax.toFixed(2)}`;

    document.querySelector(
      `${this.outputSelector} #shipping`
    ).innerText = `$${this.shipping.toFixed(2)}`;

    document.querySelector(
      `${this.outputSelector} #orderTotal`
    ).innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const orderData = formDataToJSON(form);

    orderData.orderDate =
      new Date().toISOString();

    orderData.items =
      packageItems(this.list);

    orderData.orderTotal =
      this.orderTotal.toFixed(2);

    orderData.shipping =
      this.shipping.toFixed(2);

    orderData.tax =
      this.tax.toFixed(2);

    try {
      const result =
        await this.services.checkout(orderData);

      console.log("Order submitted:", result);

      localStorage.removeItem(this.key);

      alert("Order submitted successfully!");

      window.location.href = "/index.html";
    } catch (error) {
      console.error(error);

      alert(
        "There was a problem submitting the order."
      );
    }
  }
}