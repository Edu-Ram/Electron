import { useState, useEffect } from 'react';

type Props = {
  initial?: Row;           // si viene, es edición; si no, es creación
  onSubmit: (row: RowInput & { id?: number }) => void;
  onCancel: () => void;
};

export function RowForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [mensaje, setMensaje] = useState(initial?.mensaje ?? '');

  useEffect(() => {
    setName(initial?.name ?? '');
    setMensaje(initial?.mensaje ?? '');
  }, [initial]);

  const handleSubmit = () => {
    if (!name.trim() || !mensaje.trim()) return;
    onSubmit({ id: initial?.id, name: name.trim(), mensaje: mensaje.trim() });
  };

  return (
    <div className="form-overlay">
      <div className="form-card">
        <h2>{initial ? 'Editar registro' : 'Nuevo registro'}</h2>

        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre..."
          />
        </label>

        <label>
          Mensaje
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Mensaje..."
            rows={3}
          />
        </label>

        <div className="form-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}>
            {initial ? 'Guardar cambios' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}