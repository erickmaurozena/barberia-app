import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

function Login({ onLoginExitoso }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function iniciarSesion(e) {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginExitoso();
    } catch {
      setError("Correo o contraseña incorrectos.");
    }
  }

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: "20px",
        maxWidth: "300px",
        margin: "60px auto 0",
      }}
    >
      <h1 style={{ color: "#4ade80" }}>Acceso del Barbero</h1>
      <form onSubmit={iniciarSesion}>
        <div style={{ marginBottom: "10px" }}>
          <label>Correo:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 18px",
            backgroundColor: "#22c55e",
            color: "#0b0f0b",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          Entrar
        </button>
      </form>

      {error && <p style={{ color: "#f87171" }}>{error}</p>}
    </div>
  );
}

export default Login;