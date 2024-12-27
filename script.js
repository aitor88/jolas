// Variables iniciales
let mazo = [];
let cartaActual = null;
let fichasJugador = 11;
let fichasMaquina = 11;
let cartasJugador = [];
let cartasMaquina = [];
let fichasEnCarta = 0;
let turnoJugador = true;

// Barajar el mazo
function barajar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Inicializar el juego
function iniciarJuego() {
  mazo = [];
  for (let i = 3; i <= 35; i++) {
    mazo.push(i);
  }
  barajar(mazo);
  mazo = mazo.slice(0, 24); // Retirar 9 cartas aleatorias
  turnoJugador = true;
  siguienteCarta();
  actualizarEstado();
}

// Mostrar la siguiente carta
function siguienteCarta() {
  if (mazo.length === 0) {
    finalizarJuego();
    return;
  }
  cartaActual = mazo.pop();
  fichasEnCarta = 0;
  document.getElementById("card-value").innerText = cartaActual;
  habilitarBotones(true);
}

// Actualizar el estado del juego
function actualizarEstado() {
  document.getElementById("fichas-jugador").innerText = fichasJugador;
  document.getElementById("fichas-maquina").innerText = fichasMaquina;
  actualizarCartas("cartas-jugador", cartasJugador);
  actualizarCartas("cartas-maquina", cartasMaquina);
}

// Actualizar las cartas acumuladas
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

// Tomar la carta
function tomarCarta() {
  if (turnoJugador) {
    cartasJugador.push(cartaActual);
    fichasJugador += fichasEnCarta;
  } else {
    cartasMaquina.push(cartaActual);
    fichasMaquina += fichasEnCarta;
  }
  siguienteTurno();
}

// Rechazar la carta
function rechazarCarta() {
  if (turnoJugador && fichasJugador > 0) {
    fichasJugador--;
    fichasEnCarta++;
  } else if (!turnoJugador && fichasMaquina > 0) {
    fichasMaquina--;
    fichasEnCarta++;
  } else {
    tomarCarta();
  }
  actualizarEstado();
}

// Pasar al siguiente turno
function siguienteTurno() {
  turnoJugador = !turnoJugador;
  habilitarBotones(turnoJugador);
  actualizarEstado();
  siguienteCarta();
}

// Finalizar el juego
function finalizarJuego() {
  const puntosJugador = calcularPuntuacion(cartasJugador, fichasJugador);
  const puntosMaquina = calcularPuntuacion(cartasMaquina, fichasMaquina);
  alert(`Juego terminado. Jugador: ${puntosJugador} puntos. Máquina: ${puntosMaquina} puntos.`);
}

// Calcular la puntuación
function calcularPuntuacion(cartas, fichas) {
  const puntosCartas = cartas.reduce((total, carta) => total + carta, 0);
  return puntosCartas - fichas;
}

// Habilitar o deshabilitar botones
function habilitarBotones(habilitar) {
  document.getElementById("rechazar").disabled = !habilitar;
  document.getElementById("tomar").disabled = !habilitar;
}

// Listeners
document.getElementById("rechazar").addEventListener("click", () => {
  rechazarCarta();
});

document.getElementById("tomar").addEventListener("click", () => {
  tomarCarta();
});

// Iniciar el juego al cargar
iniciarJuego();
