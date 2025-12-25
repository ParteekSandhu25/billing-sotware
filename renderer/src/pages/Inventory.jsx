import { useEffect, useState } from "react";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    gst_percent: "",
    quantity: ""
  });

  const loadProducts = async () => {
    const data = await window.api.getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAdd = async () => {
    await window.api.addProduct({
      ...form,
      price: Number(form.price),
      gst_percent: Number(form.gst_percent),
      quantity: Number(form.quantity)
    });
    setForm({ name: "", price: "", gst_percent: "", quantity: "" });
    loadProducts();
  };

  const handleUpdate = async () => {
    await window.api.updateProduct({
      id: editingId,
      ...form,
      price: Number(form.price),
      gst_percent: Number(form.gst_percent),
      quantity: Number(form.quantity)
    });
    setEditingId(null);
    setForm({ name: "", price: "", gst_percent: "", quantity: "" });
    loadProducts();
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      gst_percent: p.gst_percent,
      quantity: p.quantity
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete product?")) {
      await window.api.deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div>
      <h2>Inventory</h2>

      <input placeholder="Name" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Price" value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })} />

      <input placeholder="GST %" value={form.gst_percent}
        onChange={e => setForm({ ...form, gst_percent: e.target.value })} />

      <input placeholder="Quantity" value={form.quantity}
        onChange={e => setForm({ ...form, quantity: e.target.value })} />

      {editingId ? (
        <button onClick={handleUpdate}>Update Product</button>
      ) : (
        <button onClick={handleAdd}>Add Product</button>
      )}

      <hr />

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th><th>Price</th><th>GST</th><th>Qty</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.gst_percent}%</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => startEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
