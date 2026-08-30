import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    async function cargarServicios() {
      const snapshot = await getDocs(collection(db, "servicios"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServicios(lista);
    }
    cargarServicios();
  }, []);

  return (
    <div>
      <h1>Barbería El Corte</h1>
      <p>Nuestros servicios:</p>
      <ul>
        {servicios.map((servicio) => (
          <li key={servicio.id}>
            {servicio.nombre} — S/ {servicio.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;