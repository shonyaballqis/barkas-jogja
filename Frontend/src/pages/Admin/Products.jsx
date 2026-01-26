export default function Products() {
  const products = [
    { id: 1, nama: "Laptop Asus", seller: "Budi", harga: "Rp 4.500.000" },
    { id: 2, nama: "iPhone 12", seller: "Siti", harga: "Rp 7.000.000" },
  ];

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
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.nama}</td>
                <td>{p.seller}</td>
                <td>{p.harga}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
