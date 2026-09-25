import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "./firebase";
import Login from "./Login";

const CLOUDINARY_CLOUD_NAME = "sirdjhtw";
const CLOUDINARY_UPLOAD_PRESET = "barberia_fotos";

const estilos = {
  pagina: {
    fontFamily: "Arial",
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
  },
  h1: { color: "#4ade80" },
  h2: { color: "#86efac", marginTop: "25px" },
  h3: { color: "#86efac", marginTop: "15px" },
  card: {
    border: "1px solid #22c55e",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "8px",
    backgroundColor: "#151a15",
  },
  cardFila: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #22c55e",
    borderRadius: "8px",
    padding: "8px 10px",
    marginBottom: "8px",
    backgroundColor: "#151a15",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "4px",
  },
  boton: {
    padding: "10px 18px",
    backgroundColor: "#22c55e",
    color: "#0b0f0b",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  botonSecundario: {
    padding: "6px 12px",
    backgroundColor: "transparent",
    color: "#f87171",
    border: "1px solid #f87171",
    borderRadius: "6px",
  },
};

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
    return <p style={{ padding: "20px", color: "#f2f2f2" }}>Cargando...</p>;
  }

  if (!usuario) {
    return <Login onLoginExitoso={() => {}} />;
  }

  return (
    <div style={estilos.pagina}>
      <h1 style={estilos.h1}>Panel del Barbero</h1>
      <button onClick={() => signOut(auth)} style={estilos.botonSecundario}>
        Cerrar sesión
      </button>

      <h2 style={estilos.h2}>Citas reservadas</h2>
      {citas.length === 0 && <p>Todavía no hay citas reservadas.</p>}
      {citas.map((cita) => (
        <div key={cita.id} style={estilos.card}>
          <strong>{cita.nombreCliente}</strong>
          <br />
          Servicio: {cita.servicio}
          <br />
          Día: {cita.dia} — Hora: {cita.hora}
          <br />
          Estado: {cita.estado}
        </div>
      ))}

      <hr style={{ margin: "30px 0", borderColor: "#22c55e" }} />

      <h2 style={estilos.h2}>Servicios y precios</h2>
      {servicios.map((servicio) => (
        <div key={servicio.id} style={estilos.cardFila}>
          <span>
            {servicio.nombre} — S/ {servicio.precio}
          </span>
          <button
            onClick={() => eliminarServicio(servicio.id)}
            style={estilos.botonSecundario}
          >
            Eliminar
          </button>
        </div>
      ))}

      <h3 style={estilos.h3}>Agregar nuevo servicio</h3>
      <form onSubmit={agregarServicio}>
        <div style={{ marginBottom: "10px" }}>
          <label>Nombre del corte:</label>
          <input
            type="text"
            value={nombreServicio}
            onChange={(e) => setNombreServicio(e.target.value)}
            style={estilos.input}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Precio (S/):</label>
          <input
            type="number"
            value={precioServicio}
            onChange={(e) => setPrecioServicio(e.target.value)}
            style={estilos.input}
          />
        </div>
        <button type="submit" style={estilos.boton}>
          Agregar servicio
        </button>
      </form>

      <hr style={{ margin: "30px 0", borderColor: "#22c55e" }} />

      <h2 style={estilos.h2}>Horarios de atención</h2>
      {horarios.map((horario) => (
        <div key={horario.id} style={estilos.cardFila}>
          <span>
            {horario.dia}:{" "}
            {horario.activo
              ? `${horario.horaInicio} a ${horario.horaFin}`
              : "Cerrado"}
          </span>
          <button
            onClick={() => eliminarHorario(horario.id)}
            style={estilos.botonSecundario}
          >
            Eliminar
          </button>
        </div>
      ))}

      <h3 style={estilos.h3}>Agregar / editar horario</h3>
      <form onSubmit={agregarHorario}>
        <div style={{ marginBottom: "10px" }}>
          <label>Día:</label>
          <select
            value={diaHorario}
            onChange={(e) => setDiaHorario(e.target.value)}
            style={estilos.input}
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
          <input
            type="time"
            value={horaInicioHorario}
            onChange={(e) => setHoraInicioHorario(e.target.value)}
            style={estilos.input}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Hora fin:</label>
          <input
            type="time"
            value={horaFinHorario}
            onChange={(e) => setHoraFinHorario(e.target.value)}
            style={estilos.input}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={activoHorario}
              onChange={(e) => setActivoHorario(e.target.checked)}
              style={{ width: "auto" }}
            />{" "}
            Día activo (atiende ese día)
          </label>
        </div>

        <button type="submit" style={estilos.boton}>
          Agregar horario
        </button>
      </form>

      <hr style={{ margin: "30px 0", borderColor: "#22c55e" }} />

      <h2 style={estilos.h2}>Galería de fotos / herramientas</h2>

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
            style={{
              width: "100%",
              height: "90px",
              objectFit: "cover",
              borderRadius: "6px",
              border: "1px solid #22c55e",
            }}
          />
        ))}
      </div>

      <label
        style={{
          display: "inline-block",
          padding: "10px 18px",
          background: "#22c55e",
          color: "#0b0f0b",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
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

      {mensaje && <p style={{ color: "#4ade80", marginTop: "15px" }}>{mensaje}</p>}
    </div>
  );
}

export default PanelBarbero;