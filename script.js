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
    // Mostrar el valor de la carta actual
    document.getElementById("card-value").innerText = cartaActual || "";

    // Mostrar las fichas como círculos rojos
    const chipsContainer = document.getElementById("chips-on-card");
    chipsContainer.innerHTML = ""; // Limpiar el contenedor antes de renderizar las fichas
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
    if (turnoJugador) {
      if (fichasJugador > 0) {
        fichasJugador--;
        fichasEnCarta++;
        actualizarCartaActual(); // Actualizar las fichas en la carta
        siguienteTurno();
      } else {
        alert("No tienes fichas suficientes. Debes tomar la carta.");
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
      actualizarCartaActual(); // Actualizar la carta actual
      actualizarCartas();
    } else {
      finalizarJuego();
    }
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
      // Rechazar carta
      fichasMaquina--;
      fichasEnCarta++;
      actualizarCartaActual(); // Actualizar las fichas en la carta
    } else {
      // Tomar carta
      cartasMaquina.push(cartaActual);
      fichasMaquina += fichasEnCarta;
      if (mazo.length > 0) {
        cartaActual = mazo.shift();
        fichasEnCarta = 0;
        actualizarCartaActual();
      } else {
        finalizarJuego();
      }
    }
    siguienteTurno();
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
  document.getElementById("reiniciar").addEventListener("click", () => {
    iniciarJuego();
  });

  iniciarJuego();
});
