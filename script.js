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
  turnoJugador = Math.random() < 0.5; // Elegir jugador inicial al azar
  siguienteCarta();
  actualizarEstado();
}

// Mostrar la siguiente carta
function siguienteCarta() {
  if (mazo.length === 0) {
    finalizarJuego();
    return;
  }
  cartaActual = mazo.shift(); // Extraer la primera carta del mazo
  fichasEnCarta = 0; // Reiniciar las fichas en la carta
  actualizarCartaActual();
  habilitarBotones(turnoJugador);
}

// Actualizar la carta actual en pantalla
function actualizarCartaActual() {
  document.getElementById("card-value").innerText = cartaActual;
  document.getElementById("chips-on-card").innerText = fichasEnCarta;
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
  fichasEnCarta = 0; // Reiniciar las fichas acumuladas en la carta
  siguienteTurno();
  siguienteCarta(); // Cambiar a la siguiente carta
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
    tomarCarta(); // Si no hay fichas suficientes, el jugador toma la carta
    return;
  }
  actualizarCartaActual(); // Actualizar las fichas en la carta
  siguienteTurno();
}

// Pasar al siguiente turno
function siguienteTurno() {
  turnoJugador = !turnoJugador;
  document.getElementById("turno-actual").innerText = turnoJugador ? "Jugador" : "Máquina";
  habilitarBotones(turnoJugador);
  actualizarEstado();

  if (!turnoJugador) {
    setTimeout(() => {
      const decisionMaquina = Math.random() < 0.5; // Decisión aleatoria de la máquina
      if (decisionMaquina && fichasMaquina > 0) {
        rechazarCarta();
      } else {
        tomarCarta();
      }
    }, 1000);
  }
}

// Finalizar el juego
function finalizarJuego() {
  const puntosJugador = calcularPuntuacion(cartasJugador, fichasJugador);
  const puntosMaquina = calcularPuntuacion(cartasMaquina, fichasMaquina);
  alert(`Juego terminado. Jugador: ${puntosJugador} puntos. Máquina: ${puntosMaquina} puntos.`);
}

// Calcular la puntuación
function calcularPuntuacion(cartas, fichas) {
  let puntos = 0;
  cartas.sort((a, b) => a - b);

  let escalera = [cartas[0]];
  for (let i = 1; i < cartas.length; i++) {
    if (cartas[i] === escalera[escalera.length - 1] + 1) {
      escalera.push(cartas[i]);
    } else {
      puntos += escalera[0];
      escalera = [cartas[i]];
    }
  }
  puntos += escalera[0]; // Añadir la última escalera o carta
  return puntos - fichas;
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
