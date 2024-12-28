document.addEventListener("DOMContentLoaded", () => {
  // Variables iniciales
  let mazo = [];
  let cartaActual = null;
  let fichasJugador = 11;
  let fichasMaquina = 11;
  let cartasJugador = [];
  let cartasMaquina = [];
  let fichasEnCarta = 0;
  let turnoJugador = true;

  function iniciarJuego() {
    limpiarEstado(); // Limpia elementos de UI
    mazo = Array.from({ length: 33 }, (_, i) => i + 3).sort(() => Math.random() - 0.5).slice(0, 24);
    cartaActual = mazo.shift();
    fichasJugador = 11;
    fichasMaquina = 11;
    cartasJugador = [];
    cartasMaquina = [];
    fichasEnCarta = 0;
    turnoJugador = true;
    document.getElementById("resultado-modal").classList.add("hidden");
    actualizarCartaActual();
    actualizarEstado();
    habilitarBotones(turnoJugador);
  }

  function limpiarEstado() {
    document.getElementById("chips-on-card").innerHTML = ""; // Limpia las fichas
    document.getElementById("cartas-jugador").innerHTML = ""; // Limpia las cartas del jugador
    document.getElementById("cartas-maquina").innerHTML = ""; // Limpia las cartas de la máquina
  }

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

  function habilitarBotones(habilitar) {
    document.getElementById("rechazar").disabled = !habilitar;
    document.getElementById("tomar").disabled = !habilitar;
  }

  function rechazarCarta() {
    if (turnoJugador && fichasJugador > 0) {
      fichasJugador--;
      fichasEnCarta++;
      siguienteTurno();
    }
  }

  function tomarCarta() {
    if (turnoJugador) {
      cartasJugador.push(cartaActual);
      fichasJugador += fichasEnCarta;
    } else {
      cartasMaquina.push(cartaActual);
      fichasMaquina += fichasEnCarta;
    }
    cartaActual = mazo.shift();
    fichasEnCarta = 0;
    actualizarCartaActual();
    siguienteTurno();
  }

  function siguienteTurno() {
    turnoJugador = !turnoJugador;
    habilitarBotones(turnoJugador);
    actualizarEstado();

    if (!turnoJugador) {
      setTimeout(() => {
        jugadaMaquina();
      }, 1000);
    }
  }

  function jugadaMaquina() {
    if (fichasMaquina > 0 && Math.random() < 0.5) {
      fichasMaquina--;
      fichasEnCarta++;
    } else {
      cartasMaquina.push(cartaActual);
      fichasMaquina += fichasEnCarta;
      cartaActual = mazo.shift();
      fichasEnCarta = 0;
      actualizarCartaActual();
    }
    siguienteTurno();
  }

  function actualizarEstado() {
    document.getElementById("fichas-jugador").innerText = fichasJugador;
    document.getElementById("fichas-maquina").innerText = fichasMaquina;

    const puntosJugador = calcularPuntuacion(cartasJugador, fichasJugador);
    const puntosMaquina = calcularPuntuacion(cartasMaquina, fichasMaquina);

    document.getElementById("cartas-jugador-title").innerText = `Cartas acumuladas (Jugador): ${puntosJugador}`;
    document.getElementById("cartas-maquina-title").innerText = `Cartas acumuladas (Máquina): ${puntosMaquina}`;
  }

  function calcularPuntuacion(cartas, fichas) {
    cartas.sort((a, b) => a - b);
    let puntos = 0;
    let escalera = [cartas[0]];

    for (let i = 1; i < cartas.length; i++) {
      if (cartas[i] === escalera[escalera.length - 1] + 1) {
        escalera.push(cartas[i]);
      } else {
        puntos += escalera[0];
        escalera = [cartas[i]];
      }
    }
    puntos += escalera[0];
    return puntos - fichas;
  }

  document.getElementById("rechazar").addEventListener("click", rechazarCarta);
  document.getElementById("tomar").addEventListener("click", tomarCarta);
  document.getElementById("resetear").addEventListener("click", iniciarJuego);
  document.getElementById("reiniciar").addEventListener("click", () => {
    document.getElementById("resultado-modal").classList.add("hidden");
    iniciarJuego();
  });

  iniciarJuego();
});
