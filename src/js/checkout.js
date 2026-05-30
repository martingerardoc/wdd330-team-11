import CheckoutProcess from "./CheckoutProcess.mjs";

const checkout = new CheckoutProcess(
  "so-cart",
  ".order-summary"
);

checkout.init();

const form =
  document.querySelector("#checkoutForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    alert("Please complete all fields.");
    return;
  }

  await checkout.checkout(form);
});