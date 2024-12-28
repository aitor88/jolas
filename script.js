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
    mazo = Array.from({ length: 33 }, (_, i) => i + 3).sort(() => Math.random() - 0.5).slice(0, 24);
    cartaActual = mazo.shift();
    actualizarCartaActual();
    actualizarEstado();
    habilitarBotones(turnoJugador);
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
    }
    actualizarCartaActual();
    siguienteTurno();
  }

  function tomarCarta() {
    if (turnoJugador) {
      cartasJugador.push(cartaActual);
      fichasJugador += fichasEnCarta;
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
    if (!turnoJugador) setTimeout(tomarCarta, 1000);
  }

  function actualizarEstado() {
    document.getElementById("fichas-jugador").innerText = fichasJugador;
    document.getElementById("fichas-maquina").innerText = fichasMaquina;
  }

  // Listeners
  document.getElementById("rechazar").addEventListener("click", rechazarCarta);
  document.getElementById("tomar").addEventListener("click", tomarCarta);
  document.getElementById("resetear").addEventListener("click", iniciarJuego);

  iniciarJuego();
});
