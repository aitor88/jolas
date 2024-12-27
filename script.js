// Variables iniciales
let mazo = Array.from({ length: 33 }, (_, i) => i + 3); // Cartas del 3 al 35
let fichas = 11;
let cartasAcumuladas = [];
let cartaActual = null;

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
  document.getElementById("card-value").innerText = cartaActual;
}

// Toma la carta actual
function tomarCarta() {
  cartasAcumuladas.push(cartaActual);
  fichas += fichasAcumuladas(); // Recuperar las fichas acumuladas
  actualizarEstado();
  siguienteCarta();
}

// Rechaza la carta actual
function rechazarCarta() {
  if (fichas > 0) {
    fichas -= 1;
    actualizarEstado();
  } else {
    alert("No tienes fichas suficientes. Debes tomar la carta.");
    tomarCarta();
  }
}

// Calcula las fichas acumuladas junto a la carta actual
function fichasAcumuladas() {
  return Math.floor(Math.random() * 5); // Simula fichas acumuladas (opcional)
}

// Actualiza el estado del juego
function actualizarEstado() {
  document.getElementById("fichas-value").innerText = fichas;
  document.getElementById("cartas-value").innerText = cartasAcumuladas.join(", ");
  actualizarPuntuacion();
}

// Calcula la puntuación actual
function calcularPuntuacion() {
  let puntosNegativos = 0;

  // Calcula las cartas acumuladas considerando escaleras
  const cartasOrdenadas = [...cartasAcumuladas].sort((a, b) => a - b);
  for (let i = 0; i < cartasOrdenadas.length; i++) {
    if (i === 0 || cartasOrdenadas[i] !== cartasOrdenadas[i - 1] + 1) {
      puntosNegativos += cartasOrdenadas[i];
    }
  }

  const puntosPositivos = fichas;
  return puntosPositivos - puntosNegativos;
}

// Actualiza el puntaje en la pantalla
function actualizarPuntuacion() {
  const puntos = calcularPuntuacion();
  document.getElementById("puntuacion").innerText = puntos;
}

// Finaliza el juego
function finalizarJuego() {
  const puntosFinales = calcularPuntuacion();
  alert(`Juego terminado. Tu puntuación final es: ${puntosFinales}`);
}

// Event Listeners
document.getElementById("rechazar").addEventListener("click", rechazarCarta);
document.getElementById("tomar").addEventListener("click", tomarCarta);

// Inicia el juego al cargar la página
iniciarJuego();
