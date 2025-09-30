import Alert from "./alert.js";
import { loadHeaderFooter } from "./utils.mjs";

// This file initializes the main components of the SleepOutside app
loadHeaderFooter();

// Create a new Alert instance and point it to the alerts.json file
const alert = new Alert("./json/alerts.json");

// Initialize the alert system (fetch alerts and render them if available)
alert.init();
