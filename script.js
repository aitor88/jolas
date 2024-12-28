document.addEventListener("DOMContentLoaded", () => {
  let mazo = [];
  let cartaActual = null;
  let fichasJugador = 11;
  let fichasMaquina = 11;
  let cartasJugador = [];
  let cartasMaquina = [];
  let fichasEnCarta = 0;
  let turnoJugador = true;

  function iniciarJuego() {
    limpiarEstado();
    mazo = Array.from({ length: 33 }, (_, i) => i + 3).sort(() => Math.random() - 0.5).slice(0, 24);
    cartaActual = mazo.shift();
    fichasJugador = 11;
    fichasMaquina = 11;
    cartasJugador = [];
    cartasMaquina = [];
    fichasEnCarta = 0;
    turnoJugador = true;
    document.getElementById("resultado-modal").classList.add("hidden"); // Oculta el modal
    actualizarCartaActual();
    actualizarEstado();
    habilitarBotones(turnoJugador);
  }

  function limpiarEstado() {
    document.getElementById("chips-on-card").innerHTML = "";
    document.getElementById("cartas-jugador").innerHTML = "";
    document.getElementById("cartas-maquina").innerHTML = "";
  }

  function actualizarCartaActual() {
    document.getElementById("card-value").innerText = cartaActual || "";
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
    actualizarCartas();
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
    actualizarCartas();
    siguienteTurno();
  }

  function actualizarCartas() {
    renderizarCartas("cartas-jugador", cartasJugador);
    renderizarCartas("cartas-maquina", cartasMaquina);
  }

  function renderizarCartas(elementId, cartas) {
    const contenedor = document.getElementById(elementId);
    contenedor.innerHTML = "";

    // Ordenar las cartas y agruparlas en escaleras
    const agrupaciones = agruparEscaleras(cartas);

    agrupaciones.forEach((escalera) => {
      const cartaDiv = document.createElement("div");
      cartaDiv.classList.add("card-small");
      cartaDiv.innerText = escalera.join("-");
      contenedor.appendChild(cartaDiv);
    });
  }

  function agruparEscaleras(cartas) {
    cartas.sort((a, b) => a - b);
    const agrupaciones = [];
    let escaleraActual = [];

    cartas.forEach((carta, i) => {
      if (escaleraActual.length === 0 || carta === escaleraActual[escaleraActual.length - 1] + 1) {
        escaleraActual.push(carta);
      } else {
        agrupaciones.push([...escaleraActual]);
        escaleraActual = [carta];
      }
    });

    if (escaleraActual.length > 0) {
      agrupaciones.push([...escaleraActual]);
    }

    return agrupaciones;
  }

  function actualizarEstado() {
    document.getElementById("fichas-jugador").innerText = fichasJugador;
    document.getElementById("fichas-maquina").innerText = fichasMaquina;

    const puntosJugador = calcularPuntuacion(cartasJugador, fichasJugador);
    const puntosMaquina = calcularPuntuacion(cartasMaquina, fichasMaquina);

    document.getElementById("cartas-jugador-title").innerText = `Cartas acumuladas (Jugador): ${puntosJugador}`;
    document.getElementById("cartas-maquina-title").innerText = `Cartas acumuladas (Máquina): ${puntosMaquina}`;

    if (mazo.length === 0) {
      finalizarJuego(puntosJugador, puntosMaquina);
    }
  }

  function calcularPuntuacion(cartas, fichas) {
    const agrupaciones = agruparEscaleras(cartas);
    let puntos = 0;

    agrupaciones.forEach((escalera) => {
      puntos += escalera[0]; // Solo cuenta la carta menor de cada escalera
    });

    return puntos - fichas;
  }

  function finalizarJuego(puntosJugador, puntosMaquina) {
    document.getElementById("resultado-titulo").innerText = puntosJugador < puntosMaquina ? "¡Ganaste!" : "¡Perdiste!";
    document.getElementById("resultado-mensaje").innerText = `Puntos Jugador: ${puntosJugador} | Puntos Máquina: ${puntosMaquina}`;
    document.getElementById("resultado-modal").classList.remove("hidden");
  }

  document.getElementById("rechazar").addEventListener("click", rechazarCarta);
  document.getElementById("tomar").addEventListener("click", tomarCarta);
  document.getElementById("resetear").addEventListener("click", iniciarJuego);
  document.getElementById("reiniciar").addEventListener("click", () => {
    iniciarJuego();
  });

  iniciarJuego();
});
