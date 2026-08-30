import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [servicios, setServicios] = useState([]);
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      const serviciosSnapshot = await getDocs(collection(db, "servicios"));
      const listaServicios = serviciosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServicios(listaServicios);

      const horariosSnapshot = await getDocs(collection(db, "horarios"));
      const listaHorarios = horariosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHorarios(listaHorarios);
    }
    cargarDatos();
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>Barbería El Corte</h1>

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
    </div>
  );
}

export default App;