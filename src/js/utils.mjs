// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localStorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to localStorage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  const el = qs(selector);
  if (!el) return;
  el.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback(event);
  });
  el.addEventListener("click", callback);
}

// return parameter from url
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  template,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) renderWithTemplate(headerTemplate, headerElement);
  if (footerElement) renderWithTemplate(footerTemplate, footerElement);
}

/* ------------------ ALERT HELPERS ------------------ */

export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span class="alert-close">X</span>`;

  const main = document.querySelector("main") || document.body;
  main.prepend(alert);

  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("alert-close")) {
      alert.remove();
    }
  });

  if (scroll) window.scrollTo(0, 0);

  // Auto-dismiss if a duration is provided (default 3000ms)
  if (duration) {
    setTimeout(() => {
      alert.remove();
    }, duration);
  }
}

export function removeAllAlerts() {
  document.querySelectorAll(".alert").forEach((el) => el.remove());
}
