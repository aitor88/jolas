<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>No Gracias - Versus Máquina</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <h1>No Gracias - Versus Máquina</h1>
    <div id="game">
      <div id="scoreboard">
        <div>Puntuación (Jugador): <span id="puntuacion-jugador">0</span></div>
        <div>Fichas restantes (Jugador): <span id="fichas-jugador">11</span></div>
        <div>Puntuación (Máquina): <span id="puntuacion-maquina">0</span></div>
        <div>Fichas restantes (Máquina): <span id="fichas-maquina">11</span></div>
      </div>
      <div id="current-card">
        <h2>Carta actual:</h2>
        <div id="card-container">
          <div class="card">
            <div class="card-value" id="card-value"></div>
          </div>
          <div id="chips-on-card">
            <div id="chip-container"></div>
          </div>
        </div>
        <div id="mazo-restante-container">
          <h3>Mazo restante:</h3>
          <div id="mazo-restante"></div>
        </div>
        <div id="turno-indicador">
          Turno de: <span id="turno-actual" class="turno-jugador">Jugador</span>
        </div>
      </div>
      <div id="actions">
        <button id="rechazar" disabled>Rechazar</button>
        <button id="tomar" disabled>Tomar</button>
      </div>
      <div id="cartas-acumuladas">
        <h2>Cartas acumuladas (Jugador):</h2>
        <div id="cartas-jugador"></div>
        <h2>Cartas acumuladas (Máquina):</h2>
        <div id="cartas-maquina"></div>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
