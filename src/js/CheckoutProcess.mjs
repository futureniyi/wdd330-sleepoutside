import {
    getLocalStorage,
    setLocalStorage,
    alertMessage,
    removeAllAlerts,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => (convertedJSON[key] = value));
    return convertedJSON;
}

function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        price: item.FinalPrice,
        name: item.Name,
        quantity: Number(item.Quantity ?? 1),
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
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSummary();
    }

    calculateItemSummary() {
        const summaryElement = document.querySelector(
            `${this.outputSelector} #cartTotal`
        );
        const itemNumElement = document.querySelector(
            `${this.outputSelector} #num-items`
        );

        itemNumElement.innerText = this.list.length;

        const amounts = this.list.map((item) => Number(item.FinalPrice || 0));
        this.itemTotal = amounts.reduce((sum, n) => sum + n, 0);

        if (summaryElement) {
            summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
        }
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;
        this.shipping = 10 + Math.max(0, this.list.length - 1) * 2;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const tax = document.querySelector(`${this.outputSelector} #tax`);
        const shipping = document.querySelector(`${this.outputSelector} #shipping`);
        const orderTotal = document.querySelector(
            `${this.outputSelector} #orderTotal`
        );

        if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
        if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
        if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout() {
        const formElement = document.forms["checkout"];

        if (!formElement.checkValidity()) {
            formElement.reportValidity();
            return;
        }

        const json = formDataToJSON(formElement);
        json.orderDate = new Date().toISOString();
        json.orderTotal = this.orderTotal.toFixed(2).toString();
        json.tax = this.tax.toFixed(2).toString();
        json.shipping = this.shipping;
        json.items = packageItems(this.list);

        const submitBtn = document.querySelector("#checkoutSubmit");
        submitBtn?.setAttribute("disabled", "disabled");

        try {
            const res = await services.checkout(json);
            console.log("Checkout success:", res);

            setLocalStorage("so-cart", []);
            location.assign("/checkout/success.html");
        } catch (err) {
            removeAllAlerts?.();

            if (err?.name === "servicesError") {
                const msg = err.message;
                if (msg && typeof msg === "object") {
                    Object.keys(msg).forEach((key) =>
                        alertMessage?.(msg[key] ?? `${key}: ${msg[key]}`)
                    );
                } else if (typeof msg === "string") {
                    alertMessage?.(msg);
                } else {
                    alertMessage?.("Checkout failed. Please verify your details.");
                }
                console.error("Checkout failed:", err.status, err.message);
            } else {
                alertMessage?.("Network or unexpected error. Try again.");
                console.error("Unexpected error:", err);
            }
        } finally {
            submitBtn?.removeAttribute("disabled");
        }
    }
}
