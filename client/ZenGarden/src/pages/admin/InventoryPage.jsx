import React, { useState } from 'react';
import InventoryTable from '../../features/inventory/InventoryTable.jsx';
import InventoryForm from '../../features/inventory/InventoryForm.jsx';
import Modal from '../../components/UI/Modal.jsx';
import Button from '../../components/UI/Button.jsx';
import { useInventory } from '../../features/inventory/useInventory.js';

export default function InventoryPage() {
  const inv = useInventory();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Inventory</h2>
        <Button onClick={() => { setEditing(null); setOpen(true); }}>Add Item</Button>
      </div>

      <InventoryTable
        onEdit={(row) => { setEditing(row); setOpen(true); }}
        canEdit
        canDelete
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Inventory' : 'New Inventory'}>
        <InventoryForm
          initial={editing}
          mode={editing ? 'edit' : 'create'}
          onSubmit={async (payload) => {
            if (editing) await inv.updateItem(editing._id || editing.id, payload);
            else await inv.createItem(payload);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </div>
  );
}