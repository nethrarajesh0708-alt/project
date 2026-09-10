import React, { useState, useEffect } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./SuperAdmin.css";

const SuperAdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Roles & Permissions");
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    description: "",
    permission_ids: [],
  });
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/super_admin/roles.php`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setRoles(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch roles", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/super_admin/permissions.php`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPermissions(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${BASE_URL}backend/api/super_admin/roles.php`;
      const method = editingRole ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, id: editingRole?.id }),
      });

      const data = await response.json();
      if (data.success) {
        setShowModal(false);
        setEditingRole(null);
        setFormData({
          name: "",
          display_name: "",
          description: "",
          permission_ids: [],
        });
        fetchRoles();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      display_name: role.display_name,
      description: role.description || "",
      permission_ids: [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      const res = await fetch(`${BASE_URL}backend/api/super_admin/roles.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchRoles();
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const groupedPermissions = permissions;

  return (
    <div className="super-admin-layout">
      <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="super-admin-main">
        <header className="super-admin-header">
          <div>
            <h1>Roles & Permissions</h1>
            <p className="super-admin-datetime">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingRole(null);
              setFormData({
                name: "",
                display_name: "",
                description: "",
                permission_ids: [],
              });
              setShowModal(true);
            }}
          >
            + Create Role
          </button>
        </header>

        <div className="super-admin-content">
          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Role Name</th>
                    <th>Display Name</th>
                    <th>Description</th>
                    <th>System Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td>{role.name}</td>
                      <td>{role.display_name}</td>
                      <td>{role.description || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${
                            role.is_system ? "bg-info" : "bg-secondary"
                          }`}
                        >
                          {role.is_system ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-1"
                          onClick={() => handleEdit(role)}
                        >
                          Edit
                        </button>
                        {!role.is_system && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(role.id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingRole ? "Edit Role" : "Create Role"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Role Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        disabled={editingRole}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Display Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="display_name"
                        value={formData.display_name}
                        onChange={(e) =>
                          setFormData({ ...formData, display_name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows="3"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Permissions</label>
                      {Object.entries(groupedPermissions).map(
                        ([module, perms]) => (
                          <div key={module} className="mb-3">
                            <strong>{module.replace("_", " ").toUpperCase()}</strong>
                            <div className="row mt-2">
                              {perms.map((perm) => (
                                <div key={perm.id} className="col-md-4">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`perm-${perm.id}`}
                                      checked={formData.permission_ids.includes(perm.id)}
                                      onChange={(e) => {
                                        const ids = formData.permission_ids;
                                        if (e.target.checked) {
                                          setFormData({
                                            ...formData,
                                            permission_ids: [...ids, perm.id],
                                          });
                                        } else {
                                          setFormData({
                                            ...formData,
                                            permission_ids: ids.filter(
                                              (id) => id !== perm.id
                                            ),
                                          });
                                        }
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`perm-${perm.id}`}
                                    >
                                      {perm.display_name}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingRole ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminRoles;
