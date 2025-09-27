// import { getLocalStorage } from "./utils.mjs";

export default class Alert {
  constructor(alertsPath) {
    this.alertsPath = alertsPath;
  }

  async init() {
    const alerts = await this.getAlerts();
    if (alerts.length > 0) {
      this.renderAlerts(alerts);
    }
  }

  async getAlerts() {
    const response = await fetch(this.alertsPath);
    if (!response.ok) {
      throw new Error("Failed to fetch alerts");
    }
    return response.json();
  }

  renderAlerts(alerts) {
    const alertList = document.createElement("section");
    alertList.className = "alert-list";

    alerts.forEach((alert) => {
      const alertElement = document.createElement("p");
      alertElement.textContent = alert.message;
      alertElement.style.backgroundColor = alert.background;
      alertElement.style.color = alert.color;
      alertList.appendChild(alertElement);
    });

    const mainElement = document.querySelector("main");
    mainElement.prepend(alertList);
  }
}
