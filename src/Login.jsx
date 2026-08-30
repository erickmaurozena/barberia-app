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
    <div style={{ fontFamily: "Arial", padding: "20px", maxWidth: "300px" }}>
      <h1>Acceso del Barbero</h1>
      <form onSubmit={iniciarSesion}>
        <div style={{ marginBottom: "10px" }}>
          <label>Correo:</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Contraseña:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        <button type="submit" style={{ padding: "8px 16px" }}>
          Entrar
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;