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
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Inicia el juego
function iniciarJuego() {
  console.log("Iniciando juego...");
  barajar(mazo);
  mazo = mazo.slice(0, 24); // Retirar 9 cartas aleatorias
  turnoJugador = true;
  siguienteCarta();
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
  console.log(jugador ? "Jugador tomó la carta" : "Máquina tomó la carta");
  if (jugador) {
    cartasJugador.push(cartaActual);
    fichasJugador += fichasEnCarta;
    actualizarCartas("cartas-jugador", cartasJugador);
  } else {
    cartasMaquina.push(cartaActual);
    fichasMaquina += fichasEnCarta;
    actualizarCartas("cartas-maquina", cartasMaquina);
  }
  turnoJugador = !jugador; // Cambiar turno
  siguienteCarta();
}

// Rechaza la carta actual
function rechazarCarta(jugador) {
  console.log(jugador ? "Jugador rechazó la carta" : "Máquina rechazó la carta");
  if (jugador && fichasJugador > 0) {
    fichasJugador--;
    fichasEnCarta++;
  } else if (!jugador && fichasMaquina > 0) {
    fichasMaquina--;
    fichasEnCarta++;
  } else {
    tomarCarta(jugador);
  }
  turnoJugador = !jugador; // Cambiar turno
  actualizarEstado();
  habilitarBotones(turnoJugador);
}

// Turno de la máquina
function turnoMaquina() {
  habilitarBotones(false); // Deshabilitar botones durante el turno de la máquina
  console.log("Turno de la máquina...");
  const tomar =
    fichasEnCarta >= 3 || // Si hay suficientes fichas acumuladas.
    cartaActual <= 10 || // Si la carta tiene un valor bajo.
    cartasMaquina.includes(cartaActual - 1); // Si forma una escalera.

  setTimeout(() => {
    if (tomar) {
      tomarCarta(false);
    } else {
      rechazarCarta(false);
    }
    habilitarBotones(true); // Habilitar botones tras turno de la máquina
  }, 1000);
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

// Calcula la puntuación
function calcularPuntuacion(cartas, fichas) {
  return cartas.reduce((sum, carta) => sum + carta, 0) - fichas;
}

// Actualiza el estado del juego
function actualizarEstado() {
  document.getElementById("fichas-jugador").innerText = fichasJugador;
  document.getElementById("fichas-maquina").innerText = fichasMaquina;
  document.getElementById("chips-on-card").innerText = fichasEnCarta;
}

// Finaliza el juego
function finalizarJuego() {
  console.log("Fin del juego.");
  const puntosJugador = calcularPuntuacion(cartasJugador, fichasJugador);
  const puntosMaquina = calcularPuntuacion(cartasMaquina, fichasMaquina);
  alert(`Juego terminado. Jugador: ${puntosJugador} puntos. Máquina: ${puntosMaquina} puntos.`);
}

// Habilita o deshabilita los botones
function habilitarBotones(habilitar) {
  console.log(habilitar ? "Habilitando botones..." : "Deshabilitando botones...");
  document.getElementById("rechazar").disabled = !habilitar;
  document.getElementById("tomar").disabled = !habilitar;
}

// Eventos de los botones
document.getElementById("rechazar").addEventListener("click", () => {
  rechazarCarta(true);
  setTimeout(turnoMaquina, 1000);
});
document.getElementById("tomar").addEventListener("click", () => {
  tomarCarta(true);
  setTimeout(turnoMaquina, 1000);
});

// Inicia el juego al cargar la página
iniciarJuego();
