import { useState, useEffect } from "react";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    grade: "",
    address: "",
    photo: null,
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    phone: "",
    grade: "",
    address: "",
    photo: null,
  });
  const [edit, setEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/admin/teachers",
          {
            method: "GET",
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setTeachers(data.teachers);
        }
      } catch (error) {
        console.error("Fetch teachers error:", error);
        setError("Fetch teachers error: " + error.message);
      }
    };

    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const addTeacher = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "photo" && value) {
        formData.append("photo", value);
      } else {
        formData.append(key, value);
      }
    });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/add/teacher",
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await response.json();
      if (response.ok && (data.success || data.message)) {
        setSuccess(`${data.message} with username : ${data.username} and password : ${data.password}`);
        setTeachers([...teachers, { id: Date.now(), ...form }]);
        setForm({});
      } else if (data.errors) {
        setError(data.errors.map((e) => e.msg).join(", "));
      } else if (data.message) {
        setError(data.message);
      } else {
        setError("Add Teacher error: Unknown error");
      }
    } catch (error) {
      setError("Add Teacher error: " + error.message);
    }
  };


  const editTeacher = async () => {
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (key === "photo" && value) {
        formData.append("photo", value);
      } else if (value !== undefined && value !== null) {
         // Convert id to string numbers
    if (["id"].includes(key)) {
      formData.append(key, String(Number(value)));
    } else {
      formData.append(key, value);
    }
      }
    });
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/edit/teacher",
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await response.json();
      if (response.ok && (data.success || data.message)) {
        setSuccess(data.message || "Teacher edited successfully.");
        setTeachers(
          teachers.map((t) =>
            t.id === editForm.id ? { ...t, ...editForm, photo: t.photo } : t
          )
        );
        setEditForm({
          id: "",
          name: "",
          phone: "",
          grade: "",
          address: "",
          photo: null,
        });
        setEdit(false);
      } else if (data.errors) {
        setError(data.errors.map((e) => e.msg).join(", "));
      } else if (data.message) {
        setError(data.message);
      } else {
        setError("Edit teacher error: Unknown error");
      }
    } catch (error) {
      setError("Edit teacher error: " + error.message);
    }
  };

  const removeTeacher = async (userId) => {
       try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/remove/teacher",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ user_id : userId }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
    setTeachers(teachers.filter((t) => t.userId !== userId));
      } else if (data.message) {
        setError(data.message);
      } else {
        setError("Remove teacher error: Unknown error");
      }
    } catch (error) {
      console.error("Remove teacher error:", error);
      setError("Remove teacher error: " + error.message);
    }
  }

  const edittingForm = (t) => {
    console.log('Edit button clicked for teacher:', t);
    setEditForm({
      id: Number(t.id),
      name: t.name,
      phone: t.phone,
      grade: t.grade,
      address: t.address,
      photo: null, // reset photo for editing
    });
    setEdit(true);
  };

  return (
    <div className="container">
      <h2>Manage Teachers</h2>
      <button className="btn mb-2" style={{marginBottom: 16}} onClick={() => setShowAdd(v => !v)}>
        {showAdd ? 'Hide Add Teacher' : 'Add Teacher'}
      </button>
      {showAdd && (
        <form className="mb-2" style={{ maxWidth: 500, margin: "0 auto" }} onSubmit={e => { e.preventDefault(); addTeacher(); }}>
        <label>Name<input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /></label>
        <label>Phone<input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required /></label>
        <label>Grade
          <select name="grade" value={form.grade} onChange={handleChange} required>
            <option value="">Select Grade</option>
            <option value="4-6">age 4 - 6</option>
            <option value="7-9">age 7 - 9</option>
            <option value="10-11">age 10 - 11</option>
            <option value="12-14">age 12 - 14</option>
          </select>
        </label>
        <label>Address<input name="address" placeholder="Address" value={form.address} onChange={handleChange} required /></label>
        <label>Photo<input name="photo" type="file" accept="image/*" onChange={handleChange} /></label>
        <button className="btn" type="submit" style={{ alignSelf: "center", width: 140 }}>➕ Add Teacher</button>
        </form>
  )}
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      {success && (<div style={{ color: "green", marginTop: 10 }}>{success}</div>)}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center", margin: "2rem 0" }}>
        {teachers.map((t) => {
          const isEditing = edit && Number(editForm.id) === Number(t.id);
          return (
            <div key={t.id} className="card" style={{ width: 220, minHeight: 320, position: "relative", boxShadow: "0 2px 12px rgba(44,62,80,0.10)", background: "#f4f8fb", border: isEditing ? "2px solid #2d6cdf" : "2px solid #eee" }}>
              {isEditing ? (
                <form onSubmit={e => { e.preventDefault(); editTeacher(); }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label>Name<input name="name" type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required /></label>
                  <label>Phone<input name="phone" type="number" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} required /></label>
                  <label>Grade
                    <select name="grade" value={editForm.grade} onChange={e => setEditForm({ ...editForm, grade: e.target.value })} required>
                      <option value="">Select Grade</option>
                      <option value="4-6">age 4 - 6</option>
                      <option value="7-9">age 7 - 9</option>
                      <option value="10-11">age 10 - 11</option>
                      <option value="12-14">age 12 - 14</option>
                    </select>
                  </label>
                  <label>Address<input name="address" type="text" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} required /></label>
                  <label>Photo<input name="photo" type="file" accept="image/*" onChange={e => setEditForm({ ...editForm, photo: e.target.files[0] })} /></label>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button className="btn" type="submit" title="Save" style={{ background: "#27ae60" }}>✔️</button>
                    <button className="btn" type="button" title="Cancel" style={{ background: "#e74c3c" }} onClick={() => { setEdit(false); setEditForm({ id: "", name: "", phone: "", grade: "", address: "", photo: null }); }}>❌</button>
                  </div>
                  {typeof t.photo === "string" && t.photo && (
                    <img src={`http://localhost:5000/${t.photo.replace(/\\/g, "/")}`} alt="teacher" width="80" style={{ alignSelf: "center", borderRadius: 8, marginTop: 8 }} />
                  )}
                </form>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden", marginBottom: 10, border: "3px solid #fff", boxShadow: "0 1px 6px rgba(44,62,80,0.10)" }}>
                    {typeof t.photo === "string" && t.photo ? (
                      <img src={`http://localhost:5000/${t.photo.replace(/\\/g, "/")}`} alt="teacher" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#e1e4ea" }} />
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 14, color: "#555", marginBottom: 2 }}>Grade: {t.grade}</div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>Phone: {t.phone}</div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>Address: {t.address}</div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>Username: {t.username}</div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button className="btn" title="Edit" style={{ background: "#f1c40f", color: "#fff" }} onClick={() => edittingForm(t)}>✏️</button>
                    <button className="btn" title="Remove" style={{ background: "#e74c3c", color: "#fff" }} onClick={() => removeTeacher(t.userId)}>🗑️</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
