"use client";
import { useEffect, useState } from "react";
import { api, uploadFile } from "../../../lib/adminApi";
import { ytThumb } from "../../../lib/video";

export default function GalleryAdmin() {
  const [tab, setTab] = useState("photos");
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [ytTitle, setYtTitle] = useState("");
  const [ytUrl, setYtUrl] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    setBusy(true);
    try { setItems((await api("/api/admin/gallery-items")).items); } catch { /* ignore */ }
    setBusy(false);
  };
  useEffect(() => { load(); }, []);

  const photos = items.filter((i) => i.kind === "photo");
  const videos = items.filter((i) => i.kind === "video");

  const addPhotos = async (e) => {
    setUploading(true); setMsg("");
    for (const file of e.target.files) {
      try {
        const m = await uploadFile(file);
        await api("/api/admin/gallery-items", { method: "POST", body: { kind: "photo", title: file.name.replace(/\.[^.]+$/, ""), image_url: m.url } });
      } catch (err) { setMsg("Upload failed: " + err.message); }
    }
    setUploading(false); load();
  };

  const addYouTube = async () => {
    if (!ytUrl.trim()) { setMsg("Paste a YouTube URL first."); return; }
    setMsg("");
    try {
      await api("/api/admin/gallery-items", {
        method: "POST",
        body: { kind: "video", title: ytTitle || "Event video", video_url: ytUrl.trim(), image_url: ytThumb(ytUrl.trim()) },
      });
      setYtTitle(""); setYtUrl(""); load();
    } catch (err) { setMsg("Failed: " + err.message); }
  };

  const addVideoFile = async (e) => {
    setUploading(true); setMsg("");
    for (const file of e.target.files) {
      try {
        const m = await uploadFile(file);
        await api("/api/admin/gallery-items", { method: "POST", body: { kind: "video", title: file.name.replace(/\.[^.]+$/, ""), video_url: m.url, image_url: "" } });
      } catch (err) { setMsg("Upload failed: " + err.message); }
    }
    setUploading(false); load();
  };

  const saveTitle = async (item, title) => {
    await api("/api/admin/gallery-items", { method: "PUT", body: { id: item.id, title } });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this item from the gallery?")) return;
    await api(`/api/admin/gallery-items?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <h1>Gallery</h1>
      <p className="admin-sub">Photos and videos shown in the homepage Gallery tabs.</p>
      {msg && <div className="login-err" style={{ marginBottom: 16 }}>{msg}</div>}

      <div className="tabs" style={{ justifyContent: "flex-start", margin: "0 0 20px" }}>
        <button className={`tab-btn ${tab === "photos" ? "active" : ""}`} onClick={() => setTab("photos")}>📷 Photos ({photos.length})</button>
        <button className={`tab-btn ${tab === "videos" ? "active" : ""}`} onClick={() => setTab("videos")}>🎬 Videos ({videos.length})</button>
      </div>

      {tab === "photos" && (
        <>
          <label className="btn btn-primary" style={{ cursor: "pointer" }}>
            {uploading ? "Uploading…" : "+ Upload Photos"}
            <input type="file" accept="image/*" multiple hidden onChange={addPhotos} />
          </label>
          {busy ? <p>Loading…</p> : (
            <div className="media-grid">
              {photos.map((p) => (
                <div className="media-item" key={p.id}>
                  <img src={p.image_url} alt={p.title} loading="lazy" />
                  <div className="meta" style={{ flexDirection: "column" }}>
                    <input value={p.title} onChange={(e) => setItems((xs) => xs.map((x) => (x.id === p.id ? { ...x, title: e.target.value } : x)))}
                      onBlur={(e) => saveTitle(p, e.target.value)} style={{ fontSize: 13, padding: "8px 10px", border: "1.5px solid #ecd9e4", borderRadius: 8 }} />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button className="btn-sm btn-edit" onClick={() => saveTitle(p, p.title)}>Save title</button>
                      <button className="btn-sm btn-del" onClick={() => remove(p.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "videos" && (
        <>
          <div className="editor" style={{ marginBottom: 20 }}>
            <h2 style={{ marginTop: 0 }}>Add YouTube video</h2>
            <div className="form-row">
              <div className="field"><label>Title</label><input value={ytTitle} onChange={(e) => setYtTitle(e.target.value)} placeholder="e.g. Sangeet night highlights" /></div>
              <div className="field"><label>YouTube URL</label><input value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" /></div>
            </div>
            <button className="btn btn-primary" onClick={addYouTube}>+ Add Video</button>
            <p className="seo-hint" style={{ marginTop: 10 }}>The thumbnail is picked up automatically from YouTube.</p>
          </div>
          <div className="editor" style={{ marginBottom: 20 }}>
            <h2 style={{ marginTop: 0 }}>Or upload a video file</h2>
            <label className="btn btn-dark" style={{ cursor: "pointer" }}>
              {uploading ? "Uploading…" : "+ Upload Video"}
              <input type="file" accept="video/*" multiple hidden onChange={addVideoFile} />
            </label>
          </div>
          {busy ? <p>Loading…</p> : (
            <div className="media-grid">
              {videos.map((v) => (
                <div className="media-item" key={v.id}>
                  {v.image_url ? <img src={v.image_url} alt={v.title} loading="lazy" /> : <video src={v.video_url} preload="metadata" muted />}
                  <div className="meta" style={{ flexDirection: "column" }}>
                    <input value={v.title} onChange={(e) => setItems((xs) => xs.map((x) => (x.id === v.id ? { ...x, title: e.target.value } : x)))}
                      onBlur={(e) => saveTitle(v, e.target.value)} style={{ fontSize: 13, padding: "8px 10px", border: "1.5px solid #ecd9e4", borderRadius: 8 }} />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button className="btn-sm btn-edit" onClick={() => saveTitle(v, v.title)}>Save title</button>
                      <button className="btn-sm btn-del" onClick={() => remove(v.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
