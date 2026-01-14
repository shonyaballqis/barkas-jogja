export default function Category() {
  return (
    <main className="container">
      <h2 className="title">Halaman Kategori</h2>

      <section className="grid">
        <article className="card">
          <img src="https://via.placeholder.com/150" />
          <h3>Galon Aqua</h3>
          <p>Rp 25.000</p>
          <small>Stok: 2</small>
        </article>

        <article className="card">
          <img src="https://via.placeholder.com/150" />
          <h3>Kipas Angin</h3>
          <p>Rp 150.000</p>
          <small>Stok: 1</small>
        </article>

        <article className="card">
          <img src="https://via.placeholder.com/150" />
          <h3>Sepatu</h3>
          <p>Rp 200.000</p>
          <small>Stok: 3</small>
        </article>
      </section>
    </main>
  )
}
