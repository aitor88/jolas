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
    fichasJugador = 11;
    fichasMaquina = 11;
    cartasJugador = [];
    cartasMaquina = [];
    fichasEnCarta = 0;
    turnoJugador = true; // Inicia el jugador
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
      // La máquina decide rechazar la carta con un 50% de probabilidad
      fichasMaquina--;
      fichasEnCarta++;
    } else {
      // La máquina toma la carta
      cartasMaquina.push(cartaActual);
      fichasMaquina += fichasEnCarta;
      cartaActual = mazo.shift();
      fichasEnCarta = 0;
      actualizarCartaActual();
    }
    siguienteTurno(); // Vuelve el turno al jugador
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
        puntos += escalera[0]; // Cuenta solo la carta menor de la escalera
        escalera = [cartas[i]];
      }
    }
    puntos += escalera[0]; // Agregar la última escalera o carta suelta
    return puntos - fichas; // Los fichas son positivos
  }

  // Listeners
  document.getElementById("rechazar").addEventListener("click", rechazarCarta);
  document.getElementById("tomar").addEventListener("click", tomarCarta);
  document.getElementById("resetear").addEventListener("click", iniciarJuego);

  iniciarJuego();
});
