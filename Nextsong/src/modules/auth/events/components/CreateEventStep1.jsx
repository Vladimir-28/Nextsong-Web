import { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import { FiMusic, FiStar, FiHeart, FiSun, FiMoon, FiZap, FiGlobe, FiAward } from "react-icons/fi";
import {
  FaRegCalendarAlt, FaUserFriends, FaChurch, FaBriefcase, FaChevronRight,
  FaGuitar, FaDrum, FaMicrophone, FaPray, FaMusic, FaBirthdayCake,
  FaGlassCheers, FaTheaterMasks, FaGraduationCap, FaHeart, FaStar,
  FaLeaf, FaFireAlt, FaSnowflake, FaCoffee, FaCamera, FaGamepad
} from "react-icons/fa";
import '../styles/createEvent.css';
import UserCategoriesController from "../controller/userCategories.controller";
import SuccessModal from "../../../../components/SuccessModal";

// Catálogo de íconos genéricos disponibles para categorías personalizadas
const ICON_CATALOG = [
  { id: "FaMusic",         label: "Música",        icon: <FaMusic /> },
  { id: "FaGuitar",        label: "Guitarra",       icon: <FaGuitar /> },
  { id: "FaDrum",          label: "Batería",        icon: <FaDrum /> },
  { id: "FaMicrophone",    label: "Micrófono",      icon: <FaMicrophone /> },
  { id: "FaPray",          label: "Oración",        icon: <FaPray /> },
  { id: "FaBirthdayCake",  label: "Cumpleaños",     icon: <FaBirthdayCake /> },
  { id: "FaGlassCheers",   label: "Celebración",    icon: <FaGlassCheers /> },
  { id: "FaTheaterMasks",  label: "Teatro",         icon: <FaTheaterMasks /> },
  { id: "FaGraduationCap", label: "Graduación",     icon: <FaGraduationCap /> },
  { id: "FaHeart",         label: "Amor",           icon: <FaHeart /> },
  { id: "FaStar",          label: "Estrella",       icon: <FaStar /> },
  { id: "FaLeaf",          label: "Naturaleza",     icon: <FaLeaf /> },
  { id: "FaFireAlt",       label: "Fuego",          icon: <FaFireAlt /> },
  { id: "FaSnowflake",     label: "Invierno",       icon: <FaSnowflake /> },
  { id: "FaCoffee",        label: "Café",           icon: <FaCoffee /> },
  { id: "FaCamera",        label: "Foto",           icon: <FaCamera /> },
  { id: "FaGamepad",       label: "Juego",          icon: <FaGamepad /> },
  { id: "FiStar",          label: "Favorito",       icon: <FiStar /> },
  { id: "FiHeart",         label: "Especial",       icon: <FiHeart /> },
  { id: "FiSun",           label: "Día",            icon: <FiSun /> },
  { id: "FiMoon",          label: "Noche",          icon: <FiMoon /> },
  { id: "FiZap",           label: "Energía",        icon: <FiZap /> },
  { id: "FiGlobe",         label: "Global",         icon: <FiGlobe /> },
  { id: "FiAward",         label: "Premio",         icon: <FiAward /> },
];

// Resuelve el ícono React a partir del id string almacenado en la categoría
function resolveIcon(iconId) {
  const found = ICON_CATALOG.find(i => i.id === iconId);
  return found ? found.icon : <FiStar />;
}

// Colores disponibles para íconos de categorías personalizadas
const ICON_COLORS = [
  "#c6a188", "#ff2d55", "#a855f7", "#22c55e",
  "#f59e0b", "#3b82f6", "#ec4899", "#14b8a6",
];

// Tipos de evento fijos (igual que antes)
const FIXED_EVENT_TYPES = [
  { id: "boda",        label: "Boda",              icon: <FaUserFriends />, color: "#ff2d55" },
  { id: "misa",        label: "Misa",              icon: <FaChurch />,      color: "#a855f7" },
  { id: "concierto",   label: "Concierto",          icon: <FiMusic />,       color: "#b08968" },
  { id: "ensayo",      label: "Ensayo",             icon: <FaRegCalendarAlt />, color: "#22c55e" },
  { id: "corporativo", label: "Evento Corporativo", icon: <FaBriefcase />,   color: "#f59e0b" },
];


// ─────────────────────────────────────────────
//  Modal para crear tipo personalizado
// ─────────────────────────────────────────────
function CustomTypeModal({ show, onClose, onSave }) {
  const [customName, setCustomName]     = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_CATALOG[0].id);
  const [selectedColor, setSelectedColor] = useState(ICON_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  // Resetear al abrir
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
      await onSave({ name: customName.trim(), iconId: selectedIcon, color: selectedColor });
      onClose();
    } catch {
      setError("No se pudo guardar la categoría. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" size="lg">
      <Modal.Header closeButton style={{ borderBottom: "1px solid #f3e7de" }}>
        <Modal.Title style={{ fontSize: 18, color: "#3b2a1a", fontWeight: 600 }}>
          Crear tipo de evento personalizado
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Nombre */}
        <Form.Group className="mb-4">
          <Form.Label style={{ fontWeight: 500 }}>Nombre del tipo *</Form.Label>
          <Form.Control
            value={customName}
            onChange={e => { setCustomName(e.target.value); setError(""); }}
            placeholder="Ej. Quinceañero, Bautizo…"
            maxLength={40}
            isInvalid={!!error}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </Form.Group>

        {/* Selector de ícono */}
        <Form.Label style={{ fontWeight: 500 }}>Selecciona un ícono *</Form.Label>
        <div
          className="mb-4 p-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
            gap: 8,
            maxHeight: 220,
            overflowY: "auto",
            border: "1px solid #e5e5e5",
            borderRadius: 10,
          }}
        >
          {ICON_CATALOG.map(item => (
            <button
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => setSelectedIcon(item.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "8px 4px",
                borderRadius: 10,
                border: selectedIcon === item.id ? "2px solid #c6a188" : "2px solid transparent",
                background: selectedIcon === item.id ? "#f5ebe4" : "transparent",
                cursor: "pointer",
                fontSize: 22,
                color: selectedColor,
                transition: "all .15s",
              }}
            >
              {item.icon}
              <span style={{ fontSize: 10, color: "#888", lineHeight: 1.2, textAlign: "center" }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Selector de color */}
        <Form.Label style={{ fontWeight: 500 }}>Color del ícono *</Form.Label>
        <div className="d-flex gap-2 flex-wrap mb-2">
          {ICON_COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: color,
                border: selectedColor === color ? "3px solid #3b2a1a" : "3px solid transparent",
                cursor: "pointer",
                outline: "none",
                transition: "border .15s",
              }}
            />
          ))}
        </div>

        {/* Preview */}
        <div className="mt-3 d-flex align-items-center gap-3 p-3" style={{ background: "#f9f3ee", borderRadius: 12 }}>
          <div
            className="event-icon"
            style={{ backgroundColor: selectedColor, width: 50, height: 50, fontSize: 24, margin: 0 }}
          >
            {resolveIcon(selectedIcon)}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#3b2a1a" }}>{customName || "Vista previa"}</div>
            <div style={{ fontSize: 12, color: "#888" }}>Tipo personalizado</div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer style={{ borderTop: "1px solid #f3e7de" }}>
        <Button variant="light" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || !customName.trim()}
          style={{ backgroundColor: "#c6a188", border: "none" }}
        >
          {saving ? "Guardando…" : "Crear tipo"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ─────────────────────────────────────────────
//  Paso 1 del formulario de evento
// ─────────────────────────────────────────────
export default function CreateEventStep1({ eventData, updateEvent, nextStep, onClose }) {
  const [name, setName]   = useState("");
  const [type, setType]   = useState("");
  const [date, setDate]   = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
const [modalData, setModalData] = useState({
  title: "",
  message: "",
  type: "success"
});

  // Categorías personalizadas cargadas desde el backend (igual que móvil)
  const [customCategories, setCustomCategories] = useState([]);
  const [showCustomModal, setShowCustomModal]   = useState(false);
  const [loadingCats, setLoadingCats]           = useState(false);

  // Sincronizar datos de edición
  useEffect(() => {
    if (!eventData) return;
    setName(eventData.name || "");
    setType(eventData.type || "");
    const cleanDate = eventData.date?.includes("T")
      ? eventData.date.split("T")[0]
      : eventData.date || "";
    setDate(cleanDate);
  }, [eventData]);

  // Cargar categorías del usuario (mismo endpoint que la móvil)
  useEffect(() => {
    const userId = JSON.parse(sessionStorage.getItem("user") || "{}")?.id;
    if (!userId) return;
    setLoadingCats(true);
    UserCategoriesController.getByUser(userId)
      .then(data => setCustomCategories(data || []))
      .catch(() => {})
      .finally(() => setLoadingCats(false));
  }, []);

  // Guardar nueva categoría en el backend (mismo endpoint que la móvil)
  const handleSaveCustomType = async ({ name: catName, iconId, color }) => {
  const userId = JSON.parse(sessionStorage.getItem("user") || "{}")?.id;
  if (!userId) throw new Error("Sin sesión");

  try {
    const saved = await UserCategoriesController.create(userId, catName);

    const metaKey = `nextsong_cat_meta_${saved.id}`;
    localStorage.setItem(metaKey, JSON.stringify({ iconId, color }));

    setCustomCategories(prev => [...prev, saved]);
    setType(catName);

    // ✅ ÉXITO
    setModalData({
      title: "Categoría creada",
      message: "El tipo de evento se guardó correctamente.",
      type: "success"
    });
    setShowSuccess(true);

  } catch (error) {

    // ❌ ERROR
    setModalData({
      title: "Error",
      message: "No se pudo guardar la categoría.",
      type: "error"
    });
    setShowSuccess(true);

    throw error; // importante para que tu CustomTypeModal siga mostrando error si falla
  }
};
  // Recupera meta visual (ícono y color) de una categoría personalizada
  const getCatMeta = (cat) => {
    const raw = localStorage.getItem(`nextsong_cat_meta_${cat.id}`);
    if (raw) {
      try { return JSON.parse(raw); } catch { /* ignore */ }
    }
    return { iconId: "FiStar", color: "#c6a188" };
  };

  const isValid = name && type && date;

  const handleNext = () => {
  if (!isValid) {
    setModalData({
      title: "Campos incompletos",
      message: "Por favor llena todos los campos.",
      type: "error"
    });
    setShowSuccess(true);
    return;
  }

  updateEvent({ name, type, date });
  nextStep();
};

  // Todos los tipos: fijos + personalizados
  const allTypes = [
    ...FIXED_EVENT_TYPES,
    ...customCategories.map(cat => {
      const meta = getCatMeta(cat);
      return {
        id: cat.name,
        label: cat.name,
        icon: resolveIcon(meta.iconId),
        color: meta.color,
        isCustom: true,
      };
    }),
  ];

  return (
    <>
      {/* NOMBRE */}
      <Form.Group className="mb-4">
        <Form.Label>Nombre del evento *</Form.Label>
        <Form.Control
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ej. Boda María & Carlos"
        />
      </Form.Group>

      {/* TIPO */}
      <Form.Label>Tipo de evento *</Form.Label>

      {loadingCats && (
        <p className="text-muted small mb-2">Cargando categorías…</p>
      )}

      <div className="row g-3 mb-4 d-flex justify-content-center">

        {allTypes.map(typeItem => (
          <div className="col-4" key={typeItem.id}>
            <label className="w-100">
              <input
                type="radio"
                checked={type === typeItem.id}
                onChange={() => setType(typeItem.id)}
                hidden
              />
              <div className={`event-card ${type === typeItem.id ? "selected" : ""}`}>
                <div
                  className="event-icon"
                  style={{ backgroundColor: typeItem.color }}
                >
                  {typeItem.icon}
                </div>
                <div className="event-label">{typeItem.label}</div>
              </div>
            </label>
          </div>
        ))}

        {/* Tarjeta "Otros" — abre el modal */}
        <div className="col-4">
          <div
            className="event-card"
            onClick={() => setShowCustomModal(true)}
            style={{ cursor: "pointer", borderStyle: "dashed" }}
          >
            <div
              className="event-icon"
              style={{ backgroundColor: "#6c757d" }}
            >
              <span style={{ fontSize: 22 }}>＋</span>
            </div>
            <div className="event-label">Otros</div>
          </div>
        </div>

      </div>

      {/* FECHA */}
      <Form.Group>
        <Form.Label>Fecha *</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </Form.Group>

      {/* BOTONES */}
      <div className="d-flex justify-content-end mt-4">
        <Button variant="light" onClick={onClose} className="me-2">
          Cancelar
        </Button>
        <Button
          disabled={!isValid}
          style={{ backgroundColor: "#c6a188", border: "none" }}
          onClick={handleNext}
        >
          Continuar ›
        </Button>
      </div>

      {/* Modal para crear tipo personalizado */}
      <CustomTypeModal
        show={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSave={handleSaveCustomType}
      />

      <SuccessModal
      show={showSuccess}
      onClose={() => setShowSuccess(false)}
      title={modalData.title}
      message={modalData.message}
      type={modalData.type}
    />
    </>
  );
}
