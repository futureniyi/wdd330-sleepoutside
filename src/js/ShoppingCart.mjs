import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  const name = item?.Name ?? item?.NameWithoutBrand ?? "Product";
  const color = item?.Colors?.[0]?.ColorName ?? "";
  const img = item?.Images?.PrimaryMedium ?? item?.Image ?? "";
  const id = item?.Id ?? "";
  const qty = Number(item?.Quantity ?? item?.quantity ?? 1);
  const price = Number(item?.FinalPrice ?? 0);

  return `
    <li class="cart-card divider" data-id="${id}">
      <button class="remove-item" data-id="${id}" aria-label="Remove item">×</button>
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
    this.items = this._readCart();

    // Single delegated listener—bind once.
    this.listElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".remove-item");
      if (!btn) return;
      const id = btn.dataset.id;
      this.removeItem(id);
    });

    this.render();
  }

  _readCart() {
    let items = getLocalStorage("so-cart") || [];
    if (!Array.isArray(items)) items = [items];
    return items;
  }

  render() {
    // Replace list (clear = true) to avoid duplicating items.
    if (!this.items.length) {
      this.listElement.innerHTML = `<li class="empty">Your cart is empty.</li>`;
    } else {
      renderListWithTemplate(cartItemTemplate, this.listElement, this.items, "afterbegin", true);
    }
    this.updateTotals();
  }

  updateTotals() {
    const total = this.items.reduce((sum, i) => {
      const qty = Number(i?.Quantity ?? i?.quantity ?? 1);
      const price = Number(i?.FinalPrice ?? 0);
      return sum + qty * price;
    }, 0);

    const footer = document.querySelector(".cart-footer");
    const totalEl = document.querySelector("#cart-total");

    if (this.items.length > 0) {
      footer?.classList.remove("hide");
      if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    } else {
      footer?.classList.add("hide");
    }
  }

  removeItem(id) {
    this.items = this.items.filter((i) => (i.Id ?? i.id) !== id);
    setLocalStorage("so-cart", this.items);
    this.render(); // re-render once, no re-binding needed
  }
}
