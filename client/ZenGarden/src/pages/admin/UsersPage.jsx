import React, { useState } from 'react';
import UsersTable from '../../features/users/UsersTable.jsx';
import UserForm from '../../features/users/UserForm.jsx';
import Modal from '../../components/UI/Modal.jsx';
import Button from '../../components/UI/Button.jsx';
import { useUsers } from '../../features/users/useUsers.js';

export default function UsersPage() {
  const u = useUsers();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Users</h2>
        <Button onClick={() => { setEditing(null); setOpen(true); }}>New User</Button>
      </div>

      <UsersTable
        items={u.items}
        total={u.total}
        page={u.query.page}
        pageSize={u.query.limit}
        onPageChange={(p) => u.load({ page: p })}
        onFilter={(patch) => u.load(patch)}
        onEdit={(row) => { setEditing(row); setOpen(true); }}
        onChangeRole={(id, role) => role && u.changeRole(id, role)}
        onChangeStatus={(id, status) => status && u.changeStatus(id, status)}
        onDelete={(id) => u.remove(id)}
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit User' : 'Create User'}>
        <UserForm
          initial={editing}
          mode={editing ? 'edit' : 'create'}
          allowRoleStatus
          onCancel={() => setOpen(false)}
          onSubmit={async (payload) => {
            if (editing) await u.update(editing._id || editing.id, payload);
            else await u.create(payload);
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}