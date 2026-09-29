"use client";
import { useEffect, useState } from "react";
import { api, uploadFile } from "../../../lib/adminApi";

export default function ArtistsAdmin() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setBusy(true);
    try { setRows((await api("/api/admin/artists")).artists); } catch { /* ignore */ }
    setBusy(false);
  };
  useEffect(() => { load(); }, []);

  const onUpload = async (e, cb) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try { cb((await uploadFile(file)).url); } catch (err) { setMsg("Upload failed: " + err.message); }
    setUploading(false);
  };

  const add = async () => {
    if (!name.trim()) { setMsg("Enter the artist's name."); return; }
    setMsg("");
    try {
      await api("/api/admin/artists", { method: "POST", body: { name: name.trim(), category: category.trim(), image_url: image } });
      setName(""); setCategory(""); setImage(""); load();
    } catch (e) { setMsg("Failed: " + e.message); }
  };

  const saveRow = async (r) => {
    await api(`/api/admin/artists/${r.id}`, { method: "PUT", body: r });
    setEditing(null); load();
  };

  const remove = async (id, n) => {
    if (!confirm(`Remove "${n}"?`)) return;
    await api(`/api/admin/artists/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <h1>Artists</h1>
      <p className="admin-sub">These appear on the homepage artist strip and the Artists page.</p>
      {msg && <div className="login-err" style={{ marginBottom: 16 }}>{msg}</div>}

      <div className="editor" style={{ marginBottom: 20 }}>
        <h2 style={{ marginTop: 0 }}>Add Artist</h2>
        <div className="form-row">
          <div className="field"><label>Name *</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sonu Nigam" /></div>
          <div className="field"><label>Category</label><input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Playback Singer" /></div>
        </div>
        <div className="field"><label>Photo</label>
          <input type="file" accept="image/*" onChange={(e) => onUpload(e, setImage)} />
          {uploading && <div className="seo-hint">Uploading…</div>}
          {image && <div className="img-preview"><img src={image} alt="" /></div>}
        </div>
        <button className="btn btn-primary" onClick={add}>+ Add Artist</button>
      </div>

      {busy ? <p>Loading…</p> : (
        <table className="admin-table">
          <thead><tr><th>Artist</th><th>Category</th><th>Order</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {r.image_url && <img src={r.image_url} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "50%" }} />}
                    {editing === r.id
                      ? <input value={r.name} onChange={(e) => setRows((xs) => xs.map((x) => (x.id === r.id ? { ...x, name: e.target.value } : x)))} style={{ padding: "8px 10px", border: "1.5px solid #ecd9e4", borderRadius: 8 }} />
                      : <b>{r.name}</b>}
                  </div>
                </td>
                <td>{editing === r.id
                  ? <input value={r.category || ""} onChange={(e) => setRows((xs) => xs.map((x) => (x.id === r.id ? { ...x, category: e.target.value } : x)))} style={{ padding: "8px 10px", border: "1.5px solid #ecd9e4", borderRadius: 8 }} />
                  : (r.category || "—")}</td>
                <td>{editing === r.id
                  ? <input type="number" value={r.sort || 0} onChange={(e) => setRows((xs) => xs.map((x) => (x.id === r.id ? { ...x, sort: Number(e.target.value) } : x)))} style={{ width: 70, padding: "8px 10px", border: "1.5px solid #ecd9e4", borderRadius: 8 }} />
                  : (r.sort || 0)}</td>
                <td><div className="row-actions">
                  {editing === r.id ? (
                    <>
                      <label className="btn-sm btn-edit" style={{ cursor: "pointer" }}>Photo<input type="file" accept="image/*" hidden onChange={(e) => onUpload(e, (url) => setRows((xs) => xs.map((x) => (x.id === r.id ? { ...x, image_url: url } : x))))} /></label>
                      <button className="btn-sm btn-new" onClick={() => saveRow(r)}>Save</button>
                      <button className="btn-sm btn-edit" onClick={() => { setEditing(null); load(); }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-sm btn-edit" onClick={() => setEditing(r.id)}>Edit</button>
                      <button className="btn-sm btn-del" onClick={() => remove(r.id, r.name)}>Delete</button>
                    </>
                  )}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
