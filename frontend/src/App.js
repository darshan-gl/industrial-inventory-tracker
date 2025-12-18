import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/equipment";

export default function App() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", type: "Machine", status: "Active", date: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(API).then((r) => r.json()).then(setList);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/${editId}` : API;
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(() => fetch(API).then((r) => r.json()))
      .then((data) => {
        setList(data);
        setEditId(null);
        setForm({ name: "", type: "Machine", status: "Active", date: "" });
      });
  };

  const edit = (i) => { setEditId(i.id); setForm(i); };
  const del = (id) => fetch(`${API}/${id}`, { method: "DELETE" })
    .then(() => setList(list.filter(e => e.id !== id)));

  const sortByDate = () => {
    const sorted = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
    setList(sorted);
  };

  return (
    <div className="container">
      <h3>Industrial Equipment Inventory</h3>

      {/* Search input */}
      <input
        placeholder="Search by name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Form */}
      <form onSubmit={submit}>
        <input required placeholder="Equipment Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option>Machine</option>
          <option>Vessel</option>
          <option>Tank</option>
          <option>Mixer</option>
        </select>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option>Active</option>
          <option>Inactive</option>
          <option>Under Maintenance</option>
        </select>
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <button>{editId ? "Update" : "Add"}</button>
      </form>

      {/* Sort button */}
      <button className="sort-btn" onClick={sortByDate}>Sort by Last Cleaned Date</button>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Last Cleaned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list
            .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
            .map(i => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.type}</td>
                <td className={
                  i.status === "Active" ? "status-active" :
                  i.status === "Inactive" ? "status-inactive" :
                  "status-under-maintenance"
                }>
                  {i.status}
                </td>
                <td>{i.date}</td>
                <td>
                  <button onClick={() => edit(i)}>Edit</button>
                  <button className="del" onClick={() => del(i.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
