// Variables iniciales
let mazo = [];
for (let i = 3; i <= 35; i++) {
  mazo.push(i);
}
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
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
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
  turnoJugador = !jugador; // Cambia el turno
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
  turnoJugador = !jugador; // Cambia el turno
  actualizarEstado();
}

// Turno de la máquina
function turnoMaquina() {
  const tomar =
    fichasEnCarta >= 3 || // Si hay suficientes fichas acumuladas.
    cartaActual <= 10 || // Si la carta tiene un valor bajo.
    cartasMaquina.includes(cartaActual - 1); // Si forma una escalera.

  if (tomar) {
    tomarCarta(false);
  } else {
    rechazarCarta(false);
  }
  turnoJugador = true;
  habilitarBotones(true);
}

// Actualiza las cartas acumuladas (incluye superposición para escaleras)
function actualizarCartas(elementId, cartas) {
  const contenedor = document.getElementById(elementId);
  contenedor.innerHTML = "";

  const cartasOrdenadas = [...cartas].sort((a, b) => a - b);

  cartasOrdenadas.forEach((carta, index) => {
    const cartaDiv = document.createElement("div");
    cartaDiv.classList.add("card-small");
    cartaDiv.innerText = carta;
    cartaDiv.style.position = "relative";
    cartaDiv.style.left = `${index * 20}px`; // Superposición parcial
    contenedor.appendChild(cartaDiv);
  });
}

// Habilita o deshabilita los botones según el turno
function habilitarBotones(habilitar) {
  document.getElementById("rechazar").disabled = !habilitar;
  document.getElementById("tomar").disabled = !habilitar;
}

// Actualiza el estado del juego
function actualizarEstado() {
  document.getElementById("fichas-jugador").innerText = fichasJugador;
  document.getElementById("fichas-maquina").innerText = fichasMaquina;
  document.getElementById("chips-on-card").innerText = fichasEnCarta;
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
  habilitarBotones(false);
  setTimeout(turnoMaquina, 1000);
});
document.getElementById("tomar").addEventListener("click", () => {
  tomarCarta(true);
  habilitarBotones(false);
  setTimeout(turnoMaquina, 1000);
});

// Inicia el juego al cargar la página
iniciarJuego();
