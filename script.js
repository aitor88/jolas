document.addEventListener("DOMContentLoaded", () => {
  // Variables principales
  let mazo = [];
  let cartaActual = null;
  let fichasJugador = 11;
  let fichasMaquina = 11;
  let cartasJugador = [];
  let cartasMaquina = [];
  let fichasEnCarta = 0;
  let turnoJugador = true;

  // Elementos del DOM
  const comoJugarModal = document.getElementById("como-jugar-modal");
  const resultadoModal = document.getElementById("resultado-modal");
  const cerrarAyuda = document.getElementById("cerrar-ayuda");
  const comoJugarButton = document.getElementById("como-jugar");
  const resetearButton = document.getElementById("resetear");
  const cardValue = document.getElementById("card-value");
  const chipsOnCard = document.getElementById("chips-on-card");
  const fichasJugadorSpan = document.getElementById("fichas-jugador");
  const cartasRestantes = document.getElementById("cartas-restantes");
  const turnoActual = document.getElementById("turno-actual");
  const cartasJugadorContainer = document.getElementById("cartas-jugador");
  const cartasMaquinaContainer = document.getElementById("cartas-maquina");
  const cartasJugadorTitle = document.getElementById("cartas-jugador-title");
  const cartasMaquinaTitle = document.getElementById("cartas-maquina-title");

  // Inicializar el juego
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
    resultadoModal.classList.add("hidden");
    actualizarCartaActual();
    actualizarCartasRestantes();
    actualizarEstado();
    habilitarBotones(turnoJugador);
  }

  // Limpiar elementos visuales
  function limpiarEstado() {
    chipsOnCard.innerHTML = "";
    cartasJugadorContainer.innerHTML = "";
    cartasMaquinaContainer.innerHTML = "";
  }

  // Actualizar la carta actual
  function actualizarCartaActual() {
    cardValue.innerText = cartaActual || "";
    chipsOnCard.innerHTML = "";
    for (let i = 0; i < fichasEnCarta; i++) {
      const chip = document.createElement("div");
      chip.classList.add("chip");
      chipsOnCard.appendChild(chip);
    }
  }

  // Actualizar cartas restantes en el mazo
  function actualizarCartasRestantes() {
    cartasRestantes.innerText = `Cartas restantes en el mazo: ${mazo.length}`;
  }

  // Habilitar o deshabilitar botones
  function habilitarBotones(habilitar) {
    document.getElementById("rechazar").disabled = !habilitar;
    document.getElementById("tomar").disabled = !habilitar;
  }

  // Actualizar turno visual
  function actualizarTurno() {
    turnoActual.className = turnoJugador ? "turno-jugador" : "turno-maquina";
    turnoActual.innerText = turnoJugador ? "Jugador" : "Máquina";
  }

  // Rechazar carta
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

  // Tomar carta
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
      actualizarCartasRestantes();
      actualizarCartas();
    } else {
      finalizarJuego();
    }
    siguienteTurno();
  }

  // Cambiar turno
  function siguienteTurno() {
    turnoJugador = !turnoJugador;
    actualizarTurno();
    habilitarBotones(turnoJugador);
    if (!turnoJugador) {
      setTimeout(() => {
        jugadaMaquina();
      }, Math.random() * (3000 - 2000) + 2000); // Entre 2 y 3 segundos
    }
    actualizarEstado();
  }

  // Lógica de la máquina
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

  // Verificar si la máquina puede completar una escalera
  function puedeCompletarEscalera(carta, cartas) {
    const cartasOrdenadas = [...cartas].sort((a, b) => a - b);
    return cartasOrdenadas.some((valor) => carta === valor - 1 || carta === valor + 1);
  }

  // Actualizar cartas acumuladas
  function actualizarCartas() {
    renderizarCartas(cartasJugadorContainer, cartasJugador);
    renderizarCartas(cartasMaquinaContainer, cartasMaquina);
  }

  function renderizarCartas(container, cartas) {
    container.innerHTML = "";
    cartas.sort((a, b) => a - b);
    cartas.forEach((carta) => {
      const cartaDiv = document.createElement("div");
      cartaDiv.classList.add("card-small");
      cartaDiv.innerText = carta;
      container.appendChild(cartaDiv);
    });
  }

  // Actualizar estado del juego
  function actualizarEstado() {
    const puntosCartasJugador = calcularPuntuacionCartas(cartasJugador);
    const puntosCartasMaquina = calcularPuntuacionCartas(cartasMaquina);
    cartasJugadorTitle.innerText = `Tu mano de cartas: ${puntosCartasJugador || 0}`;
    cartasMaquinaTitle.innerText = `Cartas de oponente: ${puntosCartasMaquina || 0}`;
    fichasJugadorSpan.innerText = fichasJugador;
  }

  // Calcular puntuación solo por cartas
  function calcularPuntuacionCartas(cartas) {
    if (cartas.length === 0) return 0;
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
    return puntos;
  }

  // Finalizar juego
  function finalizarJuego() {
    const puntosCartasJugador = calcularPuntuacionCartas(cartasJugador);
    const puntosCartasMaquina = calcularPuntuacionCartas(cartasMaquina);
    const puntosFichasJugador = fichasJugador;
    const puntosFichasMaquina = fichasMaquina;
    const resultadoJugador = puntosCartasJugador - puntosFichasJugador;
    const resultadoMaquina = puntosCartasMaquina - puntosFichasMaquina;

    document.getElementById("resultado-titulo").innerText = resultadoJugador < resultadoMaquina ? "¡Ganaste!" : "¡Perdiste!";
    document.getElementById("resultado-mensaje").innerText = `
      Puntos por cartas (Jugador): ${puntosCartasJugador}
      Puntos por fichas (Jugador): ${puntosFichasJugador}
      Resultado final (Jugador): ${resultadoJugador}

      Puntos por cartas (Máquina): ${puntosCartasMaquina}
      Puntos por fichas (Máquina): ${puntosFichasMaquina}
      Resultado final (Máquina): ${resultadoMaquina}
    `;
    resultadoModal.classList.remove("hidden");
  }

  // Eventos
  document.getElementById("rechazar").addEventListener("click", rechazarCarta);
  document.getElementById("tomar").addEventListener("click", tomarCarta);
  resetearButton.addEventListener("click", iniciarJuego);
  comoJugarButton.addEventListener("click", () => comoJugarModal.classList.remove("hidden"));
  cerrarAyuda.addEventListener("click", () => comoJugarModal.classList.add("hidden"));
  
  // Inicializar el juego al cargar
  iniciarJuego();
});
