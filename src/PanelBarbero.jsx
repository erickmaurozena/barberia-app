import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "./firebase";
import Login from "./Login";

function PanelBarbero() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [citas, setCitas] = useState([]);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargandoAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!usuario) return;

    async function cargarCitas() {
      const snapshot = await getDocs(collection(db, "citas"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCitas(lista);
    }
    cargarCitas();
  }, [usuario]);

  if (cargandoAuth) {
    return <p style={{ padding: "20px" }}>Cargando...</p>;
  }

  if (!usuario) {
    return <Login onLoginExitoso={() => {}} />;
  }

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", maxWidth: "500px" }}>
      <h1>Panel del Barbero</h1>
      <button onClick={() => signOut(auth)} style={{ marginBottom: "20px" }}>
        Cerrar sesión
      </button>

      <h2>Citas reservadas</h2>

      {citas.length === 0 && <p>Todavía no hay citas reservadas.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {citas.map((cita) => (
          <li
            key={cita.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <strong>{cita.nombreCliente}</strong>
            <br />
            Servicio: {cita.servicio}
            <br />
            Día: {cita.dia} — Hora: {cita.hora}
            <br />
            Estado: {cita.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PanelBarbero;