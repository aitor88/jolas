let mazo = Array.from({ length: 33 }, (_, i) => i + 3);
let fichas = 11;
let cartasAcumuladas = [];
let cartaActual = null;

function barajar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function iniciarJuego() {
  barajar(mazo);
  siguienteCarta();
}

function siguienteCarta() {
  if (mazo.length === 0) {
    finalizarJuego();
    return;
  }
  cartaActual = mazo.pop();
  document.getElementById("card-value").innerText = cartaActual;
}

function tomarCarta() {
  cartasAcumuladas.push(cartaActual);
  fichas += 1;
  actualizarEstado();
  siguienteCarta();
}

function rechazarCarta() {
  if (fichas > 0) {
    fichas -= 1;
    actualizarEstado();
    siguienteCarta();
  } else {
    alert("No tienes fichas suficientes, debes tomar la carta.");
    tomarCarta();
  }
}

function actualizarEstado() {
  document.getElementById("fichas-value").innerText = fichas;
  document.getElementById("cartas-value").innerText = cartasAcumuladas.join(", ");
}

function finalizarJuego() {
  let puntuacion = cartasAcumuladas.reduce((a, b) => a + b, 0) - fichas;
  alert(`Juego terminado. Tu puntuación es: ${puntuacion}`);
}

document.getElementById("rechazar").addEventListener("click", rechazarCarta);
document.getElementById("tomar").addEventListener("click", tomarCarta);

iniciarJuego();
