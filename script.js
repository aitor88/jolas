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

// Actualiza las cartas acumuladas con agrupación por escaleras
function actualizarCartas(elementId, cartas) {
  const contenedor = document.getElementById(elementId);
  contenedor.innerHTML = "";

  // Agrupar cartas en escaleras
  const escaleras = [];
  cartas.sort((a, b) => a - b); // Ordenar cartas
  let escaleraActual = [cartas[0]];

  for (let i = 1; i < cartas.length; i++) {
    if (cartas[i] === cartas[i - 1] + 1) {
      escaleraActual.push(cartas[i]);
    } else {
      escaleras.push(escaleraActual);
      escaleraActual = [cartas[i]];
    }
  }
  escaleras.push(escaleraActual); // Añadir la última escalera

  // Visualizar las escaleras
  escaleras.forEach((escalera) => {
    escalera.forEach((carta, index) => {
      const cartaDiv = document.createElement("div");
      cartaDiv.classList.add("card-small");
      cartaDiv.innerText = carta;

      // Superposición visual: solo la carta inicial es completamente visible
      cartaDiv.style.position = "relative";
      cartaDiv.style.left = `${index * 20}px`;
      cartaDiv.style.zIndex = escaleras.length - index; // Asegura que las cartas no se oculten
      contenedor.appendChild(cartaDiv);
    });
  });
}

// Calcula la puntuación actual con escaleras
function calcularPuntuacion(cartas, fichas) {
  let puntosNegativos = 0;
  const cartasOrdenadas = [...cartas].sort((a, b) => a - b);

  let escaleraActual = [cartasOrdenadas[0]];
  for (let i = 1; i < cartasOrdenadas.length; i++) {
    if (cartasOrdenadas[i] === cartasOrdenadas[i - 1] + 1) {
      escaleraActual.push(cartasOrdenadas[i]);
    } else {
      puntosNegativos += escaleraActual[0]; // Sumar la menor de la escalera
      escaleraActual = [cartasOrdenadas[i]];
    }
  }
  puntosNegativos += escaleraActual[0]; // Añadir la última escalera

  return puntosNegativos - fichas;
}

// Actualiza el estado del juego
function actualizarEstado() {
  document.getElementById("fichas-jugador").innerText = fichasJugador;
  document.getElementById("fichas-maquina").innerText = fichas
