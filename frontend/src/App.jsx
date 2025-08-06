function App() {
  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <a href="http://localhost:3001/api/auth/google">
        <button className="google-btn">Iniciar sesión con Google</button>
      </a>
    </div>
  );
}

export default App;