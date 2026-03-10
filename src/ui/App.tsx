import { useEffect, useState } from 'react';
import { RowForm } from './components/RowForm';
import './App.css';

type Modal =
  | { type: 'create' }
  | { type: 'edit'; row: Row }
  | null;

function App() {
  const [rows, setRows] = useState<Row[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState('');

  // ─── Helpers ──────────────────────────────────────────────────────
  const loadData = () => {
    window.electron.getTableData().then(setRows);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────
  const handleImport = async () => {
    const result = await window.electron.importDb();
    showToast(result.message);
    if (result.success) loadData();
  };

  const handleExport = async () => {
    const result = await window.electron.exportDb();
    showToast(result.message);
  };

  const handleSubmitForm = async (data: RowInput & { id?: number }) => {
    let result: ActionResult;

    if (data.id !== undefined) {
      result = await window.electron.updateRow({ id: data.id, name: data.name, mensaje: data.mensaje });
    } else {
      result = await window.electron.createRow({ name: data.name, mensaje: data.mensaje });
    }

    showToast(result.message);
    if (result.success) {
      setModal(null);
      loadData();
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('¿Eliminar este registro?');
    if (!confirmed) return;

    const result = await window.electron.deleteRow(id);
    showToast(result.message);
    if (result.success) loadData();
  };

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>Gestor de datos</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleImport}>⬆ Importar .db</button>
          <button className="btn-secondary" onClick={handleExport}>⬇ Exportar .db</button>
          <button className="btn-primary" onClick={() => setModal({ type: 'create' })}>+ Nuevo</button>
        </div>
      </header>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Tabla */}
      <main className="table-wrapper">
        {rows.length === 0 ? (
          <p className="empty-state">No hay datos. Importa un archivo o crea un registro.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Mensaje</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.mensaje}</td>
                  <td className="row-actions">
                    <button className="btn-edit" onClick={() => setModal({ type: 'edit', row })}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(row.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* Modal form */}
      {modal && (
        <RowForm
          initial={modal.type === 'edit' ? modal.row : undefined}
          onSubmit={handleSubmitForm}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default App;