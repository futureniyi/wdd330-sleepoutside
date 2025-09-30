import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  const name = item?.Name ?? item?.NameWithoutBrand ?? "Product";
  const color = item?.Colors?.[0]?.ColorName ?? "";
  const img = item?.Images?.PrimaryMedium ?? item?.Image ?? "";
  const id = item?.Id ?? "";
  const qty = Number(item?.Quantity ?? item?.quantity ?? 1);
  const price = Number(item?.FinalPrice ?? 0);

  return `
    <li class="cart-card divider" data-id="${id}">
      <a href="#" class="cart-card__image">
        <img src="${img}" alt="${name}">
      </a>
      <a href="#"><h2 class="card__name">${name}</h2></a>
      ${color ? `<p class="cart-card__color">${color}</p>` : ""}
      <p class="cart-card__quantity">qty: ${qty}</p>
      <p class="cart-card__price">$${(price * qty).toFixed(2)}</p>
    </li>
  `;
}

export default class ShoppingCart {
  constructor(listSelector = ".product-list") {
    this.listElement = document.querySelector(listSelector);
  }

  init() {
    let items = getLocalStorage("so-cart") || [];
    if (!Array.isArray(items)) items = [items]; // normalize
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
    const total = items.reduce((sum, i) => {
      const qty = Number(i?.Quantity ?? i?.quantity ?? 1);
      const price = Number(i?.FinalPrice ?? 0);
      return sum + qty * price;
    }, 0);
    const totalEl = document.querySelector("#cart-total");
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }
}
