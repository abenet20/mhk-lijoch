import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    parentName: "",
    parentPhone: "",
    address: "",
    age: "",
    gender: "",
    photo: null,
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    parentName: "",
    parentPhone: "",
    address: "",
    age: "",
    gender: "",
    photo: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [edit, setEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/admin/dashboard");
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/admin/students",
          {
            method: "GET",
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setStudents(data.students);
        }
      } catch (error) {
        console.error("Fetch students error:", error);
        setError("Fetch students error: " + error.message);
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const addStudent = async () => {
    setError("");
    setSuccess("");
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
        "http://localhost:5000/api/admin/add/student",
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await response.json();
      if (response.ok && (data.success || data.message)) {
        setSuccess(data.message || "Student added successfully.");
        setStudents([...students, { id: Date.now(), ...form }]);
        setForm({
          name: "",
          parentName: "",
          parentPhone: "",
          address: "",
          age: "",
          gender: "",
          photo: null,
        });
      } else if (data.errors) {
        setError(data.errors.map((e) => e.msg).join(", "));
      } else if (data.message) {
        setError(data.message);
      } else {
        setError("Add student error: Unknown error");
      }
    } catch (error) {
      setError("Add student error: " + error.message);
    }
  };

  const removeStudent = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/remove/student",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ id }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setStudents(students.filter((s) => s.id !== id));
      } else if (data.message) {
        setError(data.message);
      } else {
        setError("Remove student error: Unknown error");
      }
    } catch (error) {
      console.error("Remove student error:", error);
      setError("Remove student error: " + error.message);
    }
  };

  // Edit logic
  const edittingForm = (s) => {
    setEditForm({
      id: s.id,
      name: s.name,
      parentName: s.parentName,
      parentPhone: s.parentPhone,
      address: s.address,
      age: s.age,
      gender: s.gender,
      photo: null, // reset photo for editing
    });
    setEdit(true);
  };

  const editStudent = async () => {
    setError("");
    setSuccess("");
    console.log(editForm);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (key === "photo" && value) {
        formData.append("photo", value);
      } else if (value !== undefined && value !== null) {
        // Convert id, age, parentPhone to string numbers
        if (["id", "age", "parentPhone"].includes(key)) {
          formData.append(key, String(Number(value)));
        } else {
          formData.append(key, value);
        }
      }
    });
    // Debug: log FormData contents
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/edit/student",
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await response.json();
      if (response.ok && (data.success || data.message)) {
        setSuccess(data.message || "Student edited successfully.");
        setStudents(
          students.map((s) =>
            s.id === form.id ? { ...s, ...form, photo: s.photo } : s
          )
        );
        setEditForm({
          id: "",
          name: "",
          parentName: "",
          parentPhone: "",
          address: "",
          age: "",
          gender: "",
          photo: null,
        });
        setEdit(false);
      } else if (data.errors) {
        setError(data.errors.map((e) => e.msg).join(", "));
      } else if (data.message) {
        setError(data.message);
      } else {
        setError("Edit student error: Unknown error");
      }
    } catch (error) {
      setError("Edit student error: " + error.message);
    }
  };

  return (
    <div className="container">
      <button
        onClick={handleBack}
        style={{
          background: "none",
          border: "none",
          color: "#1976d2",
          fontSize: "1.5rem",
          cursor: "pointer",
          marginBottom: 16,
        }}
        title="Back to Dashboard"
      >
        &#8592;
      </button>
      <h2>Manage Students</h2>
      <button
        className="btn mb-2"
        style={{ marginBottom: 16 }}
        onClick={() => setShowAdd((v) => !v)}
      >
        {showAdd ? "Hide Add Student" : "Add Student"}
      </button>
      {showAdd && (
        <form
          className="mb-2"
          style={{ maxWidth: 500, margin: "0 auto" }}
          onSubmit={(e) => {
            e.preventDefault();
            addStudent();
          }}
        >
          <label>
            Name
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Parent Name
            <input
              name="parentName"
              placeholder="Parent Name"
              value={form.parentName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Parent Phone
            <input
              name="parentPhone"
              placeholder="Parent Phone"
              value={form.parentPhone}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Address
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Age
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Gender
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label>
            Photo
            <input
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
          <button
            className="btn"
            type="submit"
            style={{ alignSelf: "center", width: 120 }}
          >
            ➕ Add
          </button>
        </form>
      )}
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      {success && (
        <div style={{ color: "green", marginTop: 10 }}>{success}</div>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "center",
          margin: "2rem 0",
        }}
      >
        {students.map((s) => {
          const isEditing = edit && editForm.id === s.id;
          return (
            <div
              key={s.id}
              className="card"
              style={{
                width: 220,
                minHeight: 340,
                position: "relative",
                boxShadow: "0 2px 12px rgba(44,62,80,0.10)",
                background: "#f4f8fb",
                border: isEditing ? "2px solid #2d6cdf" : "2px solid #eee",
              }}
            >
              {isEditing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    editStudent();
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <label>
                    Name
                    <input
                      name="name"
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Age
                    <input
                      name="age"
                      type="number"
                      value={editForm.age}
                      onChange={(e) =>
                        setEditForm({ ...editForm, age: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Parent Name
                    <input
                      name="parentName"
                      type="text"
                      value={editForm.parentName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, parentName: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Parent Phone
                    <input
                      name="parentPhone"
                      type="text"
                      value={editForm.parentPhone}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          parentPhone: e.target.value,
                        })
                      }
                      required
                    />
                  </label>
                  <label>
                    Address
                    <input
                      name="address"
                      type="text"
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Gender
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={(e) =>
                        setEditForm({ ...editForm, gender: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </label>
                  <label>
                    Photo
                    <input
                      name="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditForm({ ...editForm, photo: e.target.files[0] })
                      }
                    />
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      justifyContent: "center",
                    }}
                  >
                    <button
                      className="btn"
                      type="submit"
                      title="Save"
                      style={{ background: "#27ae60" }}
                    >
                      ✔️
                    </button>
                    <button
                      className="btn"
                      type="button"
                      title="Cancel"
                      style={{ background: "#e74c3c" }}
                      onClick={() => {
                        setEdit(false);
                        setEditForm({});
                      }}
                    >
                      ❌
                    </button>
                  </div>
                  {s.photo && (
                    <img
                      src={`http://localhost:5000/${s.photo.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt="student"
                      width="80"
                      style={{
                        alignSelf: "center",
                        borderRadius: 8,
                        marginTop: 8,
                      }}
                    />
                  )}
                </form>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      overflow: "hidden",
                      marginBottom: 10,
                      border: "3px solid #fff",
                      boxShadow: "0 1px 6px rgba(44,62,80,0.10)",
                    }}
                  >
                    {s.photo ? (
                      <img
                        src={`http://localhost:5000/${s.photo.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt="student"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#e1e4ea",
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}
                  >
                    {s.name}
                  </div>
                  <div style={{ fontSize: 14, color: "#555", marginBottom: 2 }}>
                    Age: {s.age}
                  </div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>
                    Parent: {s.parentName}
                  </div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>
                    Phone: {s.parentPhone}
                  </div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>
                    Address: {s.address}
                  </div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
                    Gender: {s.gender}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button
                      className="btn"
                      title="Edit"
                      style={{ background: "#f1c40f", color: "#fff" }}
                      onClick={() => edittingForm(s)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn"
                      title="Remove"
                      style={{ background: "#e74c3c", color: "#fff" }}
                      onClick={() => removeStudent(s.id)}
                    >
                      🗑️
                    </button>
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
