import { API_URL } from "./index";

const getToken = () => localStorage.getItem("token");

// GET ALL PRODUCTS (SELLER) //
export async function getMyProducts() {
  const res = await fetch(`${API_URL}/api/products`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
}

// CREATE PRODUCT //
export async function createProduct({ name, price, stock, image }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("stock", stock);
  if (image) formData.append("image", image);

  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });

  return res.json();
}

//DELETE PRODUCT //
export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
}
