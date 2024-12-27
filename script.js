// Variables iniciales
let mazo = Array.from({ length: 33 }, (_, i) => i + 3);
let fichasJugador = 11;
let fichasMaquina = 11;
let cartasJugador = [];
let cartasMaquina = [];
let cartaActual = null;
let fichasEnCarta = 0;
let turnoJugador = true;

// Barajar el mazo
function barajar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Inicia el juego
function iniciarJuego() {
  barajar(mazo);
  mazo = mazo.slice(0, 24); // Retirar 9 cartas aleatorias
  turnoJugador = true;
  siguienteCarta();
  actualizarPuntuacion();
}

// Muestra la siguiente carta
function siguienteCarta() {
  if (mazo.length === 0) {
    finalizarJuego();
    return;
  }
  cartaActual = mazo.pop();
  fichasEnCarta = 0;
  mostrarCartaActual();
  actualizarEstado();
  habilitarBotones(turnoJugador);
}

// Muestra la carta actual en pantalla
function mostrarCartaActual() {
  document.getElementById("card-value").innerText = cartaActual;
  document.getElementById("chips-on-card").innerText = fichasEnCarta;
}

// Toma la carta actual
function tomarCarta(jugador) {
  if (jugador) {
    cartasJugador.push(cartaActual);
    fichasJugador += fichasEnCarta;
    actualizarCartas("cartas-jugador", cartasJugador);
  } else {
    cartasMaquina.push(cartaActual);
    fichasMaquina += fichasEnCarta;
    actualizarCartas("cartas-maquina", cartasMaquina);
  }
  siguienteCarta();
}

// Rechaza la carta actual
function rechazarCarta(jugador) {
  if (jugador && fichasJugador > 0) {
    fichasJugador--;
    fichasEnCarta++;
  } else if (!jugador && fichasMaquina > 0) {
    fichasMaquina--;
    fichasEnCarta++;
  } else {
    tomarCarta(jugador);
  }
  actualizarEstado();
}

// Actualiza las cartas acumuladas
function actualizarCartas(elementId, cartas) {
  const contenedor = document.getElementById(elementId);
  contenedor.innerHTML = "";
  cartas.forEach((carta) => {
    const cartaDiv = document.createElement("div");
    cartaDiv.classList.add("card-small");
    cartaDiv.innerText = carta;
    contenedor.appendChild(cartaDiv);
  });
}

// Actualiza el estado del juego
function actualizarEstado() {
  document.getElementById("fichas-jugador").innerText = fichasJugador;
  document.getElementById("fichas-maquina").innerText = fichasMaquina;
  document.getElementById("chips-on-card").innerText = fichasEnCarta;
  actualizarPuntuacion();
}

// Finaliza el juego
function finalizarJuego() {
  alert("Fin del juego");
}

// Event Listeners
document.getElementById("rechazar").addEventListener("click", () => {
  rechazarCarta(true);
  turnoJugador = false;
  habilitarBotones(false);
  setTimeout(turnoMaquina, 1000);
});
document.getElementById("tomar").addEventListener("click", () => {
  tomarCarta(true);
  turnoJugador = false;
  habilitarBotones(false);
  setTimeout(turnoMaquina, 1000);
});

// Inicia el juego al cargar la página
iniciarJuego();
