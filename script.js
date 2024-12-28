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

  // Función para barajar el mazo usando Fisher-Yates
  function barajar(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Inicializar el juego
  function iniciarJuego() {
    limpiarEstado();
    mazo = barajar(Array.from({ length: 33 }, (_, i) => i + 3)).slice(0, 24);
    cartaActual = mazo.shift();
    fichasJugador = 11;
    fichasMaquina = 11;
    cartasJugador = [];
    cartasMaquina = [];
    fichasEnCarta = 0;
    turnoJugador = true;
    document.getElementById("resultado-modal").classList.add("hidden");
    document.getElementById("como-jugar-modal").classList.add("hidden");
    actualizarCartaActual();
    actualizarCartasRestantes();
    actualizarEstado();
    habilitarBotones(turnoJugador);

    console.log("Mazo inicial:", mazo); // Depuración
  }

  // Limpiar elementos visuales
  function limpiarEstado() {
    document.getElementById("chips-on-card").innerHTML = "";
    document.getElementById("cartas-jugador").innerHTML = "";
    document.getElementById("cartas-maquina").innerHTML = "";
  }

  // Actualizar la carta actual
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

  // Actualizar cartas restantes en el mazo
  function actualizarCartasRestantes() {
    document.getElementById("cartas-restantes").innerText = `Cartas restantes en el mazo: ${mazo.length}`;
  }

  // Habilitar o deshabilitar botones según el turno
  function habilitarBotones(habilitar) {
    document.getElementById("rechazar").disabled = !habilitar;
    document.getElementById("tomar").disabled = !habilitar;
  }

  // Actualizar turno visual y cambiar color del turno
  function actualizarTurno() {
    const turnoElemento = document.getElementById("turno-actual");
    turnoElemento.innerText = turnoJugador ? "Jugador" : "Máquina";
    turnoElemento.style.color = turnoJugador ? "#34c759" : "#ff3b30"; // Verde para jugador, rojo para máquina
  }

  // Función para rechazar carta
  function rechazarCarta() {
    if (turnoJugador) {
      if (fichasJugador > 0) {
        fichasJugador--;
        fichasEnCarta++;
        actualizarEstado();
        actualizarCartaActual();
        siguienteTurno();
      } else {
        alert("No tienes más fichas para rechazar la carta.");
      }
    }
  }

  // Función para tomar carta
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
      }, Math.random() * (3000 - 2000) + 2000);
    }
    actualizarEstado();
  }

  // Jugada automática de la máquina
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

  // Actualizar estado del juego
  function actualizarEstado() {
    document.getElementById("cartas-jugador-title").innerText = `Tu mano de cartas: ${calcularPuntuacionCartas(cartasJugador) || 0}`;
    document.getElementById("cartas-maquina-title").innerText = `Cartas de tu oponente: ${calcularPuntuacionCartas(cartasMaquina) || 0}`;
    document.getElementById("fichas-jugador").innerText = fichasJugador;
  }

  // Calcular puntuación de las cartas acumuladas
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
    puntos += escalera[0];
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
    document.getElementById("resultado-modal").classList.remove("hidden");
  }

  // Mostrar y cerrar el modal "Cómo jugar"
  function mostrarModalComoJugar() {
    document.getElementById("como-jugar-modal").classList.remove("hidden");
  }

  function cerrarModalComoJugar() {
    document.getElementById("como-jugar-modal").classList.add("hidden");
  }

  // Eventos de los botones
  document.getElementById("rechazar").addEventListener("click", rechazarCarta);
  document.getElementById("tomar").addEventListener("click", tomarCarta);
  document.getElementById("resetear").addEventListener("click", iniciarJuego);
  document.getElementById("como-jugar").addEventListener("click", mostrarModalComoJugar);
  document.getElementById("cerrar-ayuda").addEventListener("click", cerrarModalComoJugar);

  // Iniciar el juego al cargar
  iniciarJuego();
});