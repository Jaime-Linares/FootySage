import React, { useEffect, useState } from 'react';


function App() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/hello/')
      .then(res => res.json())
      .then(data => setMensaje(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>FootySage Frontend</h1>
      <p>Mensaje desde el backend: {mensaje}</p>
    </div>
  );
}

export default App;
