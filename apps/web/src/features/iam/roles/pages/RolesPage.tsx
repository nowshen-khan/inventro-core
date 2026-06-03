import { useState } from "react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { ALL_PERMISSIONS } from "@repo/permissions";
import type { Role, UpdateRolePayload } from "@repo/types/rbac";
import { useRoles } from "../hooks/useRoles";
import {
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "../hooks/useRoleMutations";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export default function RolesPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data } = useRoles({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [perms, setPerms] = useState<string[]>([]);

  const columns: ColumnDef<Role>[] = [
    { accessorKey: "name", header: "Role" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" onClick={() => handleEdit(row.original)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleEdit = (role: Role) => {
    setSelected(role);
    setName(role.name);
    setPerms(role.permissions.map((p) => p.permission.action) || []);
    setOpen(true);
  };

  const handleNew = () => {
    setSelected(null);
    setName("");
    setPerms([]);
    setOpen(true);
  };

  const submit = () => {
    const payload: UpdateRolePayload = { name, permissions: perms };
    if (selected) {
      updateRole.mutate({ id: selected.id, data: payload });
    } else {
      createRole.mutate(payload);
    }
    setOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button onClick={handleNew}>Create Role</Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.items || []}
        pagination={pagination}
        pageCount={data?.meta.totalPages || 1}
        onPaginationChange={setPagination}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? "Edit Role" : "Create Role"}</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Role Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 mt-4">
            {ALL_PERMISSIONS.map((p) => (
              <div key={p} className="flex items-center gap-2">
                <Checkbox
                  checked={perms.includes(p)}
                  onCheckedChange={() =>
                    setPerms((prev) =>
                      prev.includes(p)
                        ? prev.filter((x) => x !== p)
                        : [...prev, p],
                    )
                  }
                />
                <span>{p}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            {selected && (
              <Button
                variant="destructive"
                onClick={() => deleteRole.mutate(selected.id)}
              >
                Delete
              </Button>
            )}
            <Button onClick={submit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
