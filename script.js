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
  cartaActual = null;
  fichasJugador = 11;
  fichasMaquina = 11;
  cartasJugador = [];
  cartasMaquina = [];
  fichasEnCarta = 0;
  turnoJugador = Math.random() < 0.5;

  for (let i = 3; i <= 35; i++) {
    mazo.push(i);
  }
  barajar(mazo);
  mazo = mazo.slice(0, 24); // Retirar 9 cartas aleatorias
  siguienteCarta();
  actualizarEstado();
}

// Mostrar la siguiente carta
function siguienteCarta() {
  if (mazo.length === 0) {
    finalizarJuego();
    return;
  }
  cartaActual = mazo.shift();
  fichasEnCarta = 0;
  actualizarCartaActual();
  habilitarBotones(turnoJugador);
  actualizarCartasRestantes();
}

// Actualizar la carta actual en pantalla
function actualizarCartaActual() {
  document.getElementById("card-value").innerText = cartaActual;

  const chipsContainer = document.getElementById("chips-on-card");
  chipsContainer.innerHTML = "";
  for (let i = 0; i < fichasEnCarta; i++) {
    const chip = document.createElement("div");
    chip.classList.add("chip");
    chipsContainer.appendChild(chip);
  }
}

// Actualizar el estado del juego
function actualizarEstado() {
  const puntosJugador = calcularPuntuacion(agruparCartas(cartasJugador), fichasJugador);
  const puntosMaquina = calcularPuntuacion(agruparCartas(cartasMaquina), fichasMaquina);

  document.getElementById("fichas-jugador").innerText = fichasJugador;
  document.getElementById("fichas-maquina").innerText = fichasMaquina;

  document.getElementById("cartas-jugador-title").innerText = `Cartas acumuladas (Jugador): ${puntosJugador}`;
  document.getElementById("cartas-maquina-title").innerText = `Cartas acumuladas (Máquina): ${puntosMaquina}`;

  actualizarCartas("cartas-jugador", agruparCartas(cartasJugador));
  actualizarCartas("cartas-maquina", agruparCartas(cartasMaquina));
}

// Agrupar cartas consecutivas
function agruparCartas(cartas) {
  cartas.sort((a, b) => a - b);
  const agrupaciones = [];
  let escalera = [cartas[0]];

  for (let i = 1; i < cartas.length; i++) {
    if (cartas[i] === escalera[escalera.length - 1] + 1) {
      escalera.push(cartas[i]);
    } else {
      agrupaciones.push([...escalera]);
      escalera = [cartas[i]];
    }
  }
  agrupaciones.push([...escalera]);
  return agrupaciones;
}

// Actualizar las cartas acumuladas en pantalla
function actualizarCartas(elementId, agrupaciones) {
  const contenedor = document.getElementById(elementId);
  contenedor.innerHTML = "";
  agrupaciones.forEach((grupo) => {
    if (grupo && grupo.length > 0) {
      const grupoDiv = document.createElement("div");
      grupoDiv.classList.add("group");

      grupo.forEach((carta, index) => {
        const cartaDiv = document.createElement("div");
        cartaDiv.classList.add("card-small");
        cartaDiv.innerText = carta;

        if (index === 0) {
          cartaDiv.style.fontWeight = "bold";
        } else {
          cartaDiv.style.opacity = "0.6";
        }

        grupoDiv.appendChild(cartaDiv);
      });

      contenedor.appendChild(grupoDiv);
    }
  });
}

// Actualizar el contador de cartas restantes en el mazo
function actualizarCartasRestantes() {
  document.getElementById("cartas-restantes").innerText = `Cartas restantes en el mazo: ${mazo.length}`;
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
  fichasEnCarta = 0;
  siguienteTurno();
  siguienteCarta();
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
    return;
  }
  actualizarCartaActual();
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
      const decisionMaquina = Math.random() < 0.5;
      if (decisionMaquina && fichasMaquina > 0) {
        rechazarCarta();
      } else {
        tomarCarta();
      }
    }, 1000);
  }
}

// Finalizar el juego con modal
function finalizarJuego() {
  const puntosJugador = calcularPuntuacion(agruparCartas(cartasJugador), fichasJugador);
  const puntosMaquina = calcularPuntuacion(agruparCartas(cartasMaquina), fichasMaquina);

  const modal = document.getElementById("resultado-modal");
  const titulo = document.getElementById("resultado-titulo");
  const mensaje = document.getElementById("resultado-mensaje");

  if (puntosJugador < puntosMaquina) {
    titulo.textContent = "¡Victoria!";
    mensaje.textContent = `Has ganado con ${puntosJugador} puntos negativos. La máquina terminó con ${puntosMaquina} puntos. ¡Gran trabajo!`;
  } else if (puntosJugador > puntosMaquina) {
    titulo.textContent = "Derrota";
    mensaje.textContent = `La máquina ganó con ${puntosMaquina} puntos negativos, mientras tú obtuviste ${puntosJugador}. ¡Sigue intentándolo!`;
  } else {
    titulo.textContent = "Empate";
    mensaje.textContent = `Ambos terminaron con ${puntosJugador} puntos. ¡Qué partida tan igualada!`;
  }

  modal.classList.remove("hidden");
}

// Listener para reiniciar el juego desde el modal
document.getElementById("reiniciar").addEventListener("click", () => {
  document.getElementById("resultado-modal").classList.add("hidden");
  iniciarJuego();
});

// Listener para botones de acción
document.getElementById("rechazar").addEventListener("click", () => {
  rechazarCarta();
});

document.getElementById("tomar").addEventListener("click", () => {
  tomarCarta();
});

// Iniciar el juego al cargar
iniciarJuego();
