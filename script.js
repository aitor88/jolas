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
  document.getElementById("card-value").innerText = cartaActual;
  document.getElementById("chips-on-card").innerText = fichasEnCarta;
  actualizarEstado();
  habilitarBotones(turnoJugador);
}

// Habilitar o deshabilitar botones
function habilitarBotones(habilitar) {
  document.getElementById("rechazar").disabled = !habilitar;
  document.getElementById("tomar").disabled = !habilitar;
}

// Toma la carta actual
function tomarCarta(jugador) {
  if (jugador) {
    cartasJugador.push(cartaActual);
    fichasJugador += fichasEnCarta;
  } else {
    cartasMaquina.push(cartaActual);
    fichasMaquina += fichasEnCarta;
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

// Juega la máquina
function turnoMaquina() {
  const tomar = fichasEnCarta >= 3 || cartaActual <= 10 || cartasMaquina.includes(cartaActual - 1);
  if (tomar) {
    tomarCarta(false);
  } else {
    rechazarCarta(false);
  }
  turnoJugador = true;
  habilitarBotones(true);
}

// Actualiza el estado del juego
function actualizarEstado() {
  document.getElementById("fichas-jugador").innerText = fichasJugador;
  document.getElementById("fichas-maquina").innerText = fichasMaquina;
  document.getElementById("chips-on-card").innerText = fichasEnCarta;
  document.getElementById("cartas-jugador").innerText = cartasJugador.join(", ");
  document.getElementById("cartas-maquina").innerText = cartasMaquina.join(", ");
  actualizarPuntuacion();
}

// Calcula la puntuación actual
function calcularPuntuacion(cartas, fichas) {
  let puntosNegativos = 0;
  const cartasOrdenadas = [...cartas].sort((a, b) => a - b);
  for (let i = 0; i < cartasOrdenadas.length; i++) {
    if (i === 0 || cartasOrdenadas[i] !== cartasOrdenadas[i - 1] + 1) {
      puntosNegativos += cartasOrdenadas[i];
    }
  }
  return puntosNegativos - fichas;
}

// Actualiza la puntuación en pantalla
function actualizarPuntuacion() {
  const puntosJugador = calcularPuntuacion(cartasJugador, fichasJugador);
  const puntosMaquina = calcularPuntuacion(cartasMaquina, fichasMaquina);
  document.getElementById("puntuacion-jugador").innerText = puntosJugador;
  document.getElementById("puntuacion-maquina").innerText = puntosMaquina;
}

// Finaliza el juego
function finalizarJuego() {
  const puntosJugador = calcularPuntuacion(cartasJugador, fichasJugador);
  const puntosMaquina = calcularPuntuacion(cartasMaquina, fichasMaquina);
  alert(`Juego terminado. 
Jugador: ${puntosJugador} puntos. 
Máquina: ${puntosMaquina} puntos.`);
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
