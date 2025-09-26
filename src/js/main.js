// main.js
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// 1. Create a data source for tents
const dataSource = new ProductData("tents");

// 2. Grab the element where products should be rendered
const listElement = document.querySelector(".product-list");

// 3. Create the product list manager
const productList = new ProductList("tents", dataSource, listElement);

// 4. Initialize it (fetch data + render)
productList.init();
