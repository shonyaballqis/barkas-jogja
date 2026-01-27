import { useEffect, useState } from "react";
import { API_URL } from "../../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/admin/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        alert("Gagal mengambil data produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>Produk</h1>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Produk</th>
              <th>Seller</th>
              <th>Harga</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Tidak ada produk
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.product_id}>
                  <td>{p.product_name}</td>
                  <td>{p.seller_name}</td>
                  <td>
                    Rp {Number(p.price).toLocaleString("id-ID")}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.is_active ? "active" : "inactive"
                      }`}
                    >
                      {p.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
