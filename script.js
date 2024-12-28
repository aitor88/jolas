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
    document.getElementById("resultado-modal").classList.add("hidden");
    actualizarCartaActual();
    actualizarCartasRestantes();
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

  function actualizarCartasRestantes() {
    document.getElementById("cartas-restantes").innerText = `Cartas restantes en el mazo: ${mazo.length}`;
  }

  function habilitarBotones(habilitar) {
    document.getElementById("rechazar").disabled = !habilitar;
    document.getElementById("tomar").disabled = !habilitar;
  }

  function actualizarTurno() {
    const turnoElemento = document.getElementById("turno-actual");
    turnoElemento.innerText = turnoJugador ? "Jugador" : "Máquina";
    turnoElemento.className = turnoJugador ? "turno-jugador" : "turno-maquina";
  }

  function rechazarCarta() {
    if (turnoJugador) {
      if (fichasJugador > 0) {
        fichasJugador--;
        fichasEnCarta++;
        actualizarCartaActual();
        siguienteTurno();
      }
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
    if (mazo.length > 0) {
      cartaActual = mazo.shift();
      fichasEnCarta = 0;
      actualizarCartaActual();
      actualizarCartasRestantes(); // Actualizar número de cartas restantes
      actualizarCartas();
    } else {
      finalizarJuego();
    }
    siguienteTurno();
  }

  function siguienteTurno() {
    turnoJugador = !turnoJugador;
    actualizarTurno();
    habilitarBotones(turnoJugador);
    actualizarEstado();

    if (!turnoJugador) {
      setTimeout(() => {
        jugadaMaquina();
      }, Math.random() * (3000 - 2000) + 2000); // Entre 2 y 3 segundos
    }
  }

  function jugadaMaquina() {
    const completarEscalera = puedeCompletarEscalera(cartaActual, cartasMaquina);
    const puntuacionActual = cartaActual - fichasEnCarta;

    if (fichasMaquina === 0 || completarEscalera || puntuacionActual <= 5) {
      tomarCarta();
    } else {
      fichasMaquina--;
      fichasEnCarta++;
      actualizarCartaActual();
      siguienteTurno();
    }
  }

  function puedeCompletarEscalera(carta, cartas) {
    const cartasOrdenadas = [...cartas].sort((a, b) => a - b);
    return cartasOrdenadas.some((valor) => carta === valor - 1 || carta === valor + 1);
  }

  function actualizarCartas() {
    renderizarCartas("cartas-jugador", cartasJugador);
    renderizarCartas("cartas-maquina", cartasMaquina);
  }

  function renderizarCartas(elementId, cartas) {
    const contenedor = document.getElementById(elementId);
    contenedor.innerHTML = "";

    cartas.sort((a, b) => a - b);
    cartas.forEach((carta) => {
      const cartaDiv = document.createElement("div");
      cartaDiv.classList.add("card-small");
      cartaDiv.innerText = carta;
      contenedor.appendChild(cartaDiv);
    });
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

    if (escalera.length > 0) {
      puntos += escalera[0];
    }

    return puntos - fichas;
  }

  function finalizarJuego() {
    const puntosJugador = calcularPuntuacion(cartasJugador, fichasJugador);
    const puntosMaquina = calcularPuntuacion(cartasMaquina, fichasMaquina);

    document.getElementById("resultado-titulo").innerText =
      puntosJugador < puntosMaquina ? "¡Ganaste!" : "¡Perdiste!";
    document.getElementById("resultado-mensaje").innerText = `Puntos Jugador: ${puntosJugador} | Puntos Máquina: ${puntosMaquina}`;
    document.getElementById("resultado-modal").classList.remove("hidden");
  }

  document.getElementById("rechazar").addEventListener("click", rechazarCarta);
  document.getElementById("tomar").addEventListener("click", tomarCarta);
  document.getElementById("resetear").addEventListener("click", iniciarJuego);
  document.getElementById("reiniciar").addEventListener("click", iniciarJuego);

  iniciarJuego();
});
