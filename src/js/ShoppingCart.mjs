import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
    const name = item?.Name ?? item?.NameWithoutBrand ?? "Product";
    const color = item?.Colors?.[0]?.ColorName ?? "";
    const price = Number(item?.FinalPrice ?? 0).toFixed(2);
    const img = item?.Image ?? "";
    const id = item?.Id ?? "";

    return `
    <li class="cart-card divider" data-id="${id}">
      <a href="#" class="cart-card__image">
        <img src="${img}" alt="${name}">
      </a>
      <a href="#">
        <h2 class="card__name">${name}</h2>
      </a>
      <p class="cart-card__color">${color}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${price}</p>
    </li>
  `;
}

export default class ShoppingCart {
    constructor(listSelector = ".product-list") {
        this.listElement = document.querySelector(listSelector);
    }

    init() {
        const items = getLocalStorage("so-cart") || [];
        this.renderList(items);
        this.updateTotals(items);
    }

    renderList(items) {
        if (!this.listElement) return;
        if (!items.length) {
            this.listElement.innerHTML = `<li class="empty">Your cart is empty.</li>`;
            return;
        }
        renderListWithTemplate(cartItemTemplate, this.listElement, items);
    }

    updateTotals(items) {
        const total = items.reduce((sum, i) => sum + Number(i?.FinalPrice ?? 0), 0);
        const totalEl = document.querySelector("#cart-total");
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }
}
