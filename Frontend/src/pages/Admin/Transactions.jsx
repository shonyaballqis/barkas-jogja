export default function Transactions() {
  const transaksi = [
    { id: 1, user: "Siti", produk: "Laptop Asus", total: "Rp 4.500.000" },
    { id: 2, user: "Ahmad", produk: "iPhone 12", total: "Rp 7.000.000" },
  ];

  return (
    <>
      <h1>Transaksi</h1>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Produk</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {transaksi.map((t) => (
              <tr key={t.id}>
                <td>{t.user}</td>
                <td>{t.produk}</td>
                <td>{t.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
