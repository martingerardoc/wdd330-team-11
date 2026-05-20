export default class Alert {
  constructor() {
    this.path = "../json/alerts.json";
  }

  async init() {
    const response = await fetch(this.path);
    const alerts = await response.json();

    if (alerts.length > 0) {
      this.createAlerts(alerts);
    }
  }

  createAlerts(alerts) {
    const alertSection = document.createElement("section");
    alertSection.classList.add("alert-list");

    alerts.forEach((alert) => {
      const p = document.createElement("p");

      p.textContent = alert.message;
      p.style.backgroundColor = alert.background;
      p.style.color = alert.color;
      p.style.padding = "1rem";
      p.style.margin = "0";

      alertSection.appendChild(p);
    });

    const main = document.querySelector("main");
    main.prepend(alertSection);
  }
}