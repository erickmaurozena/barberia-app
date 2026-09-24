import { useState } from "react";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { Link } from "react-router-dom";

function ConfirmarCita() {
  const [nombreBuscar, setNombreBuscar] = useState("");
  const [citasEncontradas, setCitasEncontradas] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function buscarCitas(e) {
    e.preventDefault();
    setMensaje("");
    setBuscando(true);

    const q = query(
      collection(db, "citas"),
      where("nombreCliente", "==", nombreBuscar)
    );
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setCitasEncontradas(lista);
    setBuscando(false);

    if (lista.length === 0) {
      setMensaje("No encontramos citas con ese nombre. Revisa que esté escrito igual que al reservar.");
    }
  }

  async function confirmarAsistencia(id) {
    await updateDoc(doc(db, "citas", id), {
      estado: "confirmada",
    });

    setCitasEncontradas((prev) =>
      prev.map((cita) =>
        cita.id === id ? { ...cita, estado: "confirmada" } : cita
      )
    );
  }

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", maxWidth: "400px" }}>
      <h1>Confirmar mi cita</h1>
      <p>Escribe tu nombre igual como lo pusiste al reservar.</p>

      <form onSubmit={buscarCitas}>
        <input
          type="text"
          value={nombreBuscar}
          onChange={(e) => setNombreBuscar(e.target.value)}
          placeholder="Tu nombre completo"
          style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Buscar mi cita
        </button>
      </form>

      {buscando && <p>Buscando...</p>}
      {mensaje && <p style={{ color: "red" }}>{mensaje}</p>}

      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {citasEncontradas.map((cita) => (
          <li
            key={cita.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            Servicio: {cita.servicio}
            <br />
            Día: {cita.dia} — Hora: {cita.hora}
            <br />
            Estado: <strong>{cita.estado}</strong>
            <br />
            {cita.estado !== "confirmada" && (
              <button
                onClick={() => confirmarAsistencia(cita.id)}
                style={{ marginTop: "8px", padding: "6px 12px" }}
              >
                Confirmar asistencia
              </button>
            )}
          </li>
        ))}
      </ul>

      <hr style={{ marginTop: "20px" }} />
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

export default ConfirmarCita;