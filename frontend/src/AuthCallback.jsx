import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("jwt", token); // Guardar el token
      navigate("/dashboard"); // Redirigir a donde quieras
    } else {
      console.error("Token no encontrado en la URL");
    }
  }, []);

  return <p>Procesando inicio de sesión...</p>;
}

export default AuthCallback;
