import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "./firebase";
import Login from "./Login";
const CLOUDINARY_CLOUD_NAME = "sirdjhtw";
const CLOUDINARY_UPLOAD_PRESET = "barberia_fotos";

function PanelBarbero() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const [nombreServicio, setNombreServicio] = useState("");
  const [precioServicio, setPrecioServicio] = useState("");

  const [diaHorario, setDiaHorario] = useState("");
  const [horaInicioHorario, setHoraInicioHorario] = useState("");
  const [horaFinHorario, setHoraFinHorario] = useState("");
  const [activoHorario, setActivoHorario] = useState(true);

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargandoAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!usuario) return;
    cargarCitas();
    cargarServicios();
    cargarHorarios();
    cargarFotos();
}, [usuario]);

  async function cargarCitas() {
    const snapshot = await getDocs(collection(db, "citas"));
    setCitas(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }

  async function cargarServicios() {
    const snapshot = await getDocs(collection(db, "servicios"));
    setServicios(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }

  async function cargarHorarios() {
    const snapshot = await getDocs(collection(db, "horarios"));
    setHorarios(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }

  async function cargarFotos() {
    const snapshot = await getDocs(collection(db, "fotos"));
    setFotos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

async function subirFoto(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setSubiendoFoto(true);

    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const respuesta = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const datos = await respuesta.json();

      await addDoc(collection(db, "fotos"), {
        url: datos.secure_url,
      });

      cargarFotos();
    } catch {
      setMensaje("Error al subir la foto.");
    }

    setSubiendoFoto(false);
}

  async function agregarServicio(e) {
    e.preventDefault();
    if (!nombreServicio || !precioServicio) {
      setMensaje("Completa nombre y precio.");
      return;
    }
    await addDoc(collection(db, "servicios"), {
      nombre: nombreServicio,
      precio: Number(precioServicio),
    });
    setMensaje("Servicio agregado.");
    setNombreServicio("");
    setPrecioServicio("");
    cargarServicios();
  }

  async function eliminarServicio(id) {
    await deleteDoc(doc(db, "servicios", id));
    cargarServicios();
  }

  async function agregarHorario(e) {
    e.preventDefault();
    if (!diaHorario || !horaInicioHorario || !horaFinHorario) {
      setMensaje("Completa día, hora inicio y hora fin.");
      return;
    }
    await addDoc(collection(db, "horarios"), {
      dia: diaHorario,
      horaInicio: horaInicioHorario,
      horaFin: horaFinHorario,
      activo: activoHorario,
    });
    setMensaje("Horario agregado.");
    setDiaHorario("");
    setHoraInicioHorario("");
    setHoraFinHorario("");
    setActivoHorario(true);
    cargarHorarios();
  }

  async function eliminarHorario(id) {
    await deleteDoc(doc(db, "horarios", id));
    cargarHorarios();
  }

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

      <hr style={{ margin: "30px 0" }} />

      <h2>Servicios y precios</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {servicios.map((servicio) => (
          <li
            key={servicio.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "8px 10px",
              marginBottom: "8px",
            }}
          >
            <span>
              {servicio.nombre} — S/ {servicio.precio}
            </span>
            <button onClick={() => eliminarServicio(servicio.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <h3>Agregar nuevo servicio</h3>
      <form onSubmit={agregarServicio}>
        <div style={{ marginBottom: "10px" }}>
          <label>Nombre del corte:</label>
          <br />
          <input
            type="text"
            value={nombreServicio}
            onChange={(e) => setNombreServicio(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Precio (S/):</label>
          <br />
          <input
            type="number"
            value={precioServicio}
            onChange={(e) => setPrecioServicio(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>
          Agregar servicio
        </button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h2>Horarios de atención</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {horarios.map((horario) => (
          <li
            key={horario.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "8px 10px",
              marginBottom: "8px",
            }}
          >
            <span>
              {horario.dia}:{" "}
              {horario.activo
                ? `${horario.horaInicio} a ${horario.horaFin}`
                : "Cerrado"}
            </span>
            <button onClick={() => eliminarHorario(horario.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <h3>Agregar / editar horario</h3>
      <form onSubmit={agregarHorario}>
        <div style={{ marginBottom: "10px" }}>
          <label>Día:</label>
          <br />
          <select
            value={diaHorario}
            onChange={(e) => setDiaHorario(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          >
            <option value="">-- Selecciona --</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Hora inicio:</label>
          <br />
          <input
            type="time"
            value={horaInicioHorario}
            onChange={(e) => setHoraInicioHorario(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Hora fin:</label>
          <br />
          <input
            type="time"
            value={horaFinHorario}
            onChange={(e) => setHoraFinHorario(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={activoHorario}
              onChange={(e) => setActivoHorario(e.target.checked)}
            />{" "}
            Día activo (atiende ese día)
          </label>
        </div>

        <button type="submit" style={{ padding: "8px 16px" }}>
          Agregar horario
        </button>
      </form>

           <hr style={{ margin: "30px 0" }} />

      <h2>Galería de fotos / herramientas</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          marginBottom: "15px",
        }}
      >
        {fotos.map((foto) => (
          <img
            key={foto.id}
            src={foto.url}
            alt="Foto de la barbería"
            style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "6px" }}
          />
        ))}
      </div>

      <label
        style={{
          display: "inline-block",
          padding: "8px 16px",
          background: "#333",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {subiendoFoto ? "Subiendo..." : "Subir foto"}
        <input
          type="file"
          accept="image/*"
          onChange={subirFoto}
          style={{ display: "none" }}
          disabled={subiendoFoto}
        />
      </label>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
}

export default PanelBarbero;