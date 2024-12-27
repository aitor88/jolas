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
  actualizarCartasRestantes(); // Actualizar las cartas restantes
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
      agrupaciones.push([...escalera]); // Guardar la escalera anterior
      escalera = [cartas[i]];
    }
  }
  agrupaciones.push([...escalera]); // Agregar la última escalera o carta
  return agrupaciones;
}

// Actualizar las cartas acumuladas en pantalla
function actualizarCartas(elementId, agrupaciones) {
  const contenedor = document.getElementById(elementId);
  contenedor.innerHTML = "";
  agrupaciones.forEach((grupo) => {
    const grupoDiv = document.createElement("div");
    grupoDiv.classList.add("group");

    grupo.forEach((carta, index) => {
      const cartaDiv = document.createElement("div");
      cartaDiv.classList.add("card-small");
      cartaDiv.innerText = carta;

      // Visualmente destacar la primera carta del grupo
      if (index === 0) {
        cartaDiv.style.fontWeight = "bold";
      } else {
        cartaDiv.style.opacity = "0.6"; // Cartas menores con menos énfasis
      }

      grupoDiv.appendChild(cartaDiv);
    });

    contenedor.appendChild(grupoDiv);
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
  const puntosJugador = calcularPuntuacion(agruparCartas(cartasJugador), fichasJugador);
  const puntosMaquina = calcularPuntuacion(agruparCartas(cartasMaquina), fichasMaquina);
  alert(`Juego terminado. Jugador: ${puntosJugador} puntos. Máquina: ${puntosMaquina} puntos.`);
}

// Calcular la puntuación
function calcularPuntuacion(agrupaciones, fichas) {
  let puntos = 0;
  agrupaciones.forEach((grupo) => {
    puntos += grupo[0]; // Solo sumar la carta menor de cada grupo
  });
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
