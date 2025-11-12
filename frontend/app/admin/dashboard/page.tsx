"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import api from "@/lib/axiosClient";
import toast from "react-hot-toast";
import { handleError } from "@/utils/handleError";

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

export default function AdminDashboardPage() {
  const { user, initializing, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "user" as "admin" | "user" });

  useEffect(() => {
    if (!initializing) {
      if (!user) router.replace("/login");
      else if (!isAdmin) router.replace("/not-authorized");
    }
  }, [user, initializing, isAdmin, router]);

  useEffect(() => {
    const load = async () => {
      if (!isAdmin) return;
      try {
        const { data } = await api.get("/admin/users");
        setUsers(data?.users || data);
      } catch (err) {
        toast.error(handleError(err).message);
      } finally {
        setLoading(false);
      }
    };
    if (!initializing) load();
  }, [initializing, isAdmin]);

  const columns = useMemo(
    () => [
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      { key: "role", header: "Role" },
      {
        key: "actions",
        header: "Actions",
        render: (row: AdminUser) => (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setEditing(row);
                setEditForm({ name: row.name, role: row.role });
              }}
            >
              Edit
            </Button>
            <Button variant="danger" onClick={() => setDeleting(row)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const total = users.length;

  if (initializing || !user || !isAdmin) return <Loader />;
  if (loading) return <Loader label="Loading users..." />;

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      await api.put(`/admin/user/${editing._id}`, {
        name: editForm.name,
        role: editForm.role,
      });
      setUsers((prev) => prev.map((u) => (u._id === editing._id ? { ...u, ...editForm } : u)));
      toast.success("User updated");
      setEditing(null);
    } catch (err) {
      toast.error(handleError(err).message);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await api.delete(`/admin/user/${deleting._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleting._id));
      toast.success("User deleted");
      setDeleting(null);
    } catch (err) {
      toast.error(handleError(err).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="text-sm text-gray-300">Total users: {total}</div>
      </div>

      <Table
        columns={columns as any}
        data={users}
        emptyText="No users found"
      />

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="card w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Edit User</h3>
            <Input
              label="Name"
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            />
            <label className="block space-y-1">
              <span className="text-xs font-medium text-gray-300">Role</span>
              <select
                className="input"
                value={editForm.role}
                onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value as any }))}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="card w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Delete User</h3>
            <p className="text-sm text-gray-300">
              Are you sure you want to delete <b>{deleting.name}</b>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleting(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
