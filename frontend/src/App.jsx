import { useEffect, useState } from 'react';

function App() {
  const [quadras, setQuadras] = useState([])
  const [message, setMessage] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/test')
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error('Erro ao conectar com o backend:', error);
        setMessage('Erro ao conectar com o backend');
      });
  }, []);



  useEffect(() => {
    fetch('http://localhost:3000/api/quadras')
      .then((response) => response.json())
      .then((data) => {
        setQuadras(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Arena UFRN</h1>
      <p>{message}</p>

      <hr></hr>

      <h2>Quadras disponiveis</h2>

      {quadras.map((quadra) => (
        <p key={quadra.id}>
          {quadra.name} - {quadra.description}
        </p>
      ))}
    </div>
  );

}

export default App;