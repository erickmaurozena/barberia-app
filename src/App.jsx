import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import PanelBarbero from "./PanelBarbero";
import ConfirmarCita from "./ConfirmarCita.jsx";

function PaginaCliente() {
  const [servicios, setServicios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [fotos, setFotos] = useState([]);

  const [nombreCliente, setNombreCliente] = useState("");
  const [servicioElegido, setServicioElegido] = useState("");
  const [diaElegido, setDiaElegido] = useState("");
  const [horaElegida, setHoraElegida] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      const serviciosSnapshot = await getDocs(collection(db, "servicios"));
      setServicios(
        serviciosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

            const horariosSnapshot = await getDocs(collection(db, "horarios"));
      setHorarios(
        horariosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      const fotosSnapshot = await getDocs(collection(db, "fotos"));
      setFotos(
        fotosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    }
    cargarDatos();
  }, []);

  async function reservarCita(e) {
    e.preventDefault();

    if (!nombreCliente || !servicioElegido || !diaElegido || !horaElegida) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    const q = query(
      collection(db, "citas"),
      where("dia", "==", diaElegido),
      where("hora", "==", horaElegida)
    );
    const citasExistentes = await getDocs(q);

    if (!citasExistentes.empty) {
      setMensaje("Ese horario ya está reservado. Por favor elige otra hora.");
      return;
    }

    await addDoc(collection(db, "citas"), {
      nombreCliente,
      servicio: servicioElegido,
      dia: diaElegido,
      hora: horaElegida,
      estado: "pendiente",
    });

    setMensaje("¡Cita reservada con éxito! Te esperamos.");
    setNombreCliente("");
    setServicioElegido("");
    setDiaElegido("");
    setHoraElegida("");
  }

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", maxWidth: "400px" }}>
      <h1>Santos Faded</h1>
      <h2>Nuestros servicios</h2>
      <ul>
        {servicios.map((servicio) => (
          <li key={servicio.id}>
            {servicio.nombre} — S/ {servicio.precio}
          </li>
        ))}
      </ul>

      <h2>Horario de atención</h2>
      <ul>
        {horarios.map((horario) => (
          <li key={horario.id}>
            {horario.dia}:{" "}
            {horario.activo
              ? `${horario.horaInicio} a ${horario.horaFin}`
              : "Cerrado"}
          </li>
        ))}
      </ul>

            <h2>Nuestros trabajos</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {fotos.map((foto) => (
          <img
            key={foto.id}
            src={foto.url}
            alt="Trabajo de la barbería"
            style={{
              width: "100%",
              height: "90px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
        ))}
      </div>

      <h2>Reservar una cita</h2>
      <form onSubmit={reservarCita}>
        <div style={{ marginBottom: "10px" }}>
          <label>Nombre completo:</label>
          <br />
          <input
            type="text"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Tipo de corte:</label>
          <br />
          <select
            value={servicioElegido}
            onChange={(e) => setServicioElegido(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          >
            <option value="">-- Selecciona --</option>
            {servicios.map((servicio) => (
              <option key={servicio.id} value={servicio.nombre}>
                {servicio.nombre} — S/ {servicio.precio}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Día:</label>
          <br />
          <select
            value={diaElegido}
            onChange={(e) => setDiaElegido(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          >
            <option value="">-- Selecciona --</option>
            {horarios
              .filter((h) => h.activo)
              .map((horario) => (
                <option key={horario.id} value={horario.dia}>
                  {horario.dia}
                </option>
              ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Hora:</label>
          <br />
          <input
            type="time"
            value={horaElegida}
            onChange={(e) => setHoraElegida(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        <button type="submit" style={{ padding: "8px 16px" }}>
          Reservar cita
        </button>
      </form>

            {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

      <hr style={{ marginTop: "30px" }} />
      <p>
        <Link to="/confirmar">¿Ya reservaste? Confirma tu asistencia aquí</Link>
      </p>
      <Link to="/panel">Soy el barbero, ir al panel</Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaCliente />} />
      <Route path="/panel" element={<PanelBarbero />} />
      <Route path="/confirmar" element={<ConfirmarCita />} />
    </Routes>
  );
}

export default App;