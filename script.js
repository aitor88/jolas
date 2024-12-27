// Variables iniciales
let mazo = [];
for (let i = 3; i <= 35; i++) {
  mazo.push(i);
}
let cartaActual = null;
let fichasJugador = 11;
let fichasMaquina = 11;
let cartasJugador = [];
let cartasMaquina = [];
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
  barajar(mazo);
  mazo = mazo.slice(0, 24); // Retirar 9 cartas aleatorias
  turnoJugador = true;
  siguienteCarta();
}

// Mostrar la siguiente carta
function siguienteCarta() {
  if (mazo.length === 0) {
    finalizarJuego();
    return;
  }
  cartaActual = mazo.pop();
  document.getElementById("card-value").innerText = cartaActual;
  habilitarBotones(turnoJugador);
}

// Habilitar o deshabilitar botones
function habilitarBotones(habilitar) {
  document.getElementById("rechazar").disabled = !habilitar;
  document.getElementById("tomar").disabled = !habilitar;
}

// Rechazar la carta
function rechazarCarta() {
  turnoJugador = !turnoJugador;
  siguienteCarta();
}

// Tomar la carta
function tomarCarta() {
  cartasJugador.push(cartaActual);
  siguienteCarta();
}

// Finalizar el juego
function finalizarJuego() {
  alert("El juego ha terminado.");
}

// Listeners
document.getElementById("rechazar").addEventListener("click", rechazarCarta);
document.getElementById("tomar").addEventListener("click", tomarCarta);

// Iniciar el juego
iniciarJuego();
