const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    try {
      body = await res.text();
    } catch {
      body = null;
    }
  }

  if (res.ok) {
    return body;
  }

  throw {
    name: "servicesError",
    status: res.status,
    message: body,
  };
}

export default class ExternalServices {
  constructor() { }

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const res = await fetch(`${baseURL}checkout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return convertToJson(res);
  }
}
