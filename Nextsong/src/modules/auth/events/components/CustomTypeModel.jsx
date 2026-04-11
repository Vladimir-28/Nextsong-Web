import { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { FiStar } from "react-icons/fi";

export default function CustomTypeModal({
  show,
  onClose,
  onSave,
  ICON_CATALOG,
  ICON_COLORS,
  resolveIcon
}) {

  const [customName, setCustomName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_CATALOG[0].id);
  const [selectedColor, setSelectedColor] = useState(ICON_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      setCustomName("");
      setSelectedIcon(ICON_CATALOG[0].id);
      setSelectedColor(ICON_COLORS[0]);
      setError("");
    }
  }, [show]);

  const handleSave = async () => {
    if (!customName.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: customName.trim(),
        iconId: selectedIcon,
        color: selectedColor
      });
      onClose();
    } catch {
      setError("No se pudo guardar la categoría.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Crear tipo de evento personalizado</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Form.Group className="mb-4">
          <Form.Label>Nombre *</Form.Label>
          <Form.Control
            value={customName}
            onChange={e => {
              setCustomName(e.target.value);
              setError("");
            }}
            isInvalid={!!error}
          />
        </Form.Group>

        <Form.Label>Ícono</Form.Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 70px)", gap: 8 }}>
          {ICON_CATALOG.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedIcon(item.id)}
              style={{
                border: selectedIcon === item.id ? "2px solid #c6a188" : "1px solid #ccc",
                borderRadius: 10,
                padding: 10,
                background: "transparent",
                color: selectedColor
              }}
            >
              {item.icon}
            </button>
          ))}
        </div>

        <Form.Label className="mt-3">Color</Form.Label>
        <div className="d-flex gap-2">
          {ICON_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: color,
                border: selectedColor === color ? "3px solid black" : "none"
              }}
            />
          ))}
        </div>

        <div className="mt-3">
          <div
            className="event-icon"
            style={{ backgroundColor: selectedColor }}
          >
            {resolveIcon(selectedIcon)}
          </div>
          <p>{customName || "Vista previa"}</p>
        </div>

      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Crear"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}