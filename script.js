// Variables iniciales
let mazo = [];
let cartaActual = null;
let fichasJugador = 11;
let fichasMaquina = 11;
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
  // Crear el mazo
  mazo = [];
  for (let i = 3; i <= 35; i++) {
    mazo.push(i);
  }
  barajar(mazo);
  mazo = mazo.slice(0, 24); // Remover 9 cartas aleatorias

  // Mostrar la primera carta
  turnoJugador = true;
  siguienteCarta();
  actualizarMazoRestante();
  habilitarBotones(true);
}

// Actualizar el mazo restante visualmente
function actualizarMazoRestante() {
  const mazoContainer = document.getElementById("mazo-restante");
  mazoContainer.innerHTML = ""; // Limpiar contenido previo

  mazo.forEach((_, index) => {
    const cartaDiv = document.createElement("div");
    cartaDiv.classList.add("mazo-carta");
    cartaDiv.style.left = `${index * 10}px`; // Apilamiento horizontal
    mazoContainer.appendChild(cartaDiv);
  });
}

// Mostrar la siguiente carta
function siguienteCarta() {
  if (mazo.length === 0) {
    alert("Juego terminado");
    return;
  }
  cartaActual = mazo.pop();
  document.getElementById("card-value").innerText = cartaActual;
}

// Habilitar o deshabilitar botones
function habilitarBotones(habilitar) {
  document.getElementById("rechazar").disabled = !habilitar;
  document.getElementById("tomar").disabled = !habilitar;
}

// Listeners para botones
document.getElementById("rechazar").addEventListener("click", () => {
  if (turnoJugador) {
    siguienteCarta();
  }
});

document.getElementById("tomar").addEventListener("click", () => {
  if (turnoJugador) {
    alert(`Tomaste la carta ${cartaActual}`);
    siguienteCarta();
  }
});

// Iniciar el juego al cargar
iniciarJuego();
