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
  barajar(mazo);
  mazo = mazo.slice(0, 24); // Retirar 9 cartas aleatorias
  turnoJugador = true;
  actualizarIndicadorTurno();
  actualizarMazoRestante();
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
  actualizarMazoRestante();
  habilitarBotones(turnoJugador);
}

// Muestra la carta actual en pantalla
function mostrarCartaActual() {
  const cardValueElement = document.getElementById("card-value");
  if (cartaActual) {
    cardValueElement.innerText = cartaActual;
  } else {
    cardValueElement.innerText = ""; // Si no hay carta, dejar vacío
  }
}

// Actualiza las fichas en la carta
function actualizarFichasEnCarta() {
  const chipContainer = document.getElementById("chip-container");
  chipContainer.innerHTML = "";

  for (let i = 0; i < fichasEnCarta; i++) {
    const chip = document.createElement("div");
    chip.classList.add("chip");
    chipContainer.appendChild(chip);
  }
}

// Actualiza el mazo restante
function actualizarMazoRestante() {
  const mazoContainer = document.getElementById("mazo-restante");
  mazoContainer.innerHTML = "";

  // Dibujar las cartas restantes en el mazo
  mazo.forEach((_, index) => {
    const cartaDiv = document.createElement("div");
    cartaDiv.classList.add("mazo-carta");

    // Ajustar posición horizontal para simular apilamiento
    cartaDiv.style.position = "absolute";
    cartaDiv.style.left = `${index * 10}px`; // Espaciado horizontal progresivo
    mazoContainer.appendChild(cartaDiv);
  });
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
  turnoJugador = !jugador;
  actualizarIndicadorTurno();
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
  turnoJugador = !jugador;
  actualizarIndicadorTurno();
  actualizarEstado();
  actualizarFichasEnCarta();
  habilitarBotones(turnoJugador);
}

// Turno de la máquina
function turnoMaquina() {
  habilitarBotones(false);
  const tomar =
    fichasEnCarta >= 3 || cartaActual <= 10 || cartasMaquina.includes(cartaActual - 1);

  setTimeout(() => {
    if (tomar) {
      tomarCarta(false);
    } else {
      rechazarCarta(false);
    }
    habilitarBotones(true);
  }, 1000);
}

// Actualiza las cartas acumuladas con orden y agrupación por escaleras
function actualizarCartas(elementId, cartas) {
  const contenedor = document.getElementById(elementId);
  contenedor.innerHTML = "";

  cartas.sort((a, b) => a - b);
  const escaleras = [];
  let escaleraActual = [cartas[0]];

  for (let i = 1; i < cartas.length; i++) {
    if (cartas[i] === escaleraActual[escaleraActual.length - 1] + 1) {
      escaleraActual.push(cartas[i]);
    } else {
      escaleras.push(escaleraActual);
      escaleraActual = [cartas[i]];
    }
  }
  escaleras.push(escaleraActual);

  escaleras.forEach((escalera) => {
    const grupo = document.createElement("div");
    grupo.style.display = "inline-block";
    grupo.style.marginRight = "25px";

    escalera.forEach((carta, index) => {
      const cartaDiv = document.createElement("div");
      cartaDiv.classList.add("card-small");
      cartaDiv.innerText = carta;
      cartaDiv.style.position = "relative";
      cartaDiv.style.left = `${index * 20}px`;
      grupo.appendChild(cartaDiv);
    });

    contenedor.appendChild(grupo);
  });
}

// Calcula la puntuación
function calcularPuntuacion(cartas, fichas) {
  let puntos = 0;
  const ordenadas = [...cartas].sort((a, b) => a - b);
  let escaleraActual = [ordenadas[0]];

  for (let i = 1; i < ordenadas.length; i++) {
    if (ordenadas[i] === escaleraActual[escaleraActual.length - 1] + 1) {
      escaleraActual.push(ordenadas[i]);
    } else {
      puntos += escaleraActual[0];
      escaleraActual = [ordenadas[i]];
    }
  }
  puntos += escaleraActual[0];
  return puntos - fichas;
}

// Actualiza el estado del juego
function actualizarEstado() {
  document.getElementById("fichas-jugador").innerText = fichasJugador;
  document.getElementById("fichas-maquina").innerText = fichasMaquina;
}

// Finaliza el juego
function finalizarJuego() {
  const puntosJugador = calcularPuntuacion(cartasJugador, fichasJugador);
  const puntosMaquina = calcularPuntuacion(cartasMaquina, fichasMaquina);
  alert(`Juego terminado. Jugador: ${puntosJugador} puntos. Máquina: ${puntosMaquina} puntos.`);
}

// Habilita o deshabilita los botones
function habilitarBotones(habilitar) {
  document.getElementById("rechazar").disabled = !habilitar;
  document.getElementById("tomar").disabled = !habilitar;
}

// Listeners
document.getElementById("rechazar").addEventListener("click", () => {
  rechazarCarta(true);
  setTimeout(turnoMaquina, 1000);
});

document.getElementById("tomar").addEventListener("click", () => {
  tomarCarta(true);
  setTimeout(turnoMaquina, 1000);
});

// Inicia el juego
iniciarJuego();
