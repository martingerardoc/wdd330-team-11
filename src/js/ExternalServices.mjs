function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(
      `Bad Response: ${res.status} ${res.statusText}`
    );
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;

    // ✅ FIX: Vite-safe absolute path (IMPORTANT)
    this.path = category
      ? `/json/${category}.json`
      : null;

    console.log("ExternalServices loading:", this.path);
  }

  async getData() {
    if (!this.path) {
      throw new Error("No data path provided");
    }

    console.log("Fetching:", this.path);

    const response = await fetch(this.path);

    console.log("Response URL:", response.url);

    return convertToJson(response);
  }

  async findProductById(id) {
    const products = await this.getData();

    console.log("Looking for:", id);
    console.log("Products:", products);

    if (!id) {
      console.error("Missing product ID in URL");
      return undefined;
    }

    const product = products.find(
      (item) => item.Id === id
    );

    console.log("Found Product:", product);

    return product;
  }

  async checkout(payload) {
    const url =
      "https://wdd330-backend.onrender.com/checkout";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    };

    console.log("Submitting Order:", payload);

    const response = await fetch(url, options);

    return convertToJson(response);
  }
}
