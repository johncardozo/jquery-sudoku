$(function() {
  // Inicialización de variables
  /*
  let tablero = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 0, 8, 0, 7, 9]
  ]; 
  */
  let tablero = [
    [4, 3, 5, 2, 6, 9, 7, 8, 1],
    [6, 8, 2, 5, 7, 1, 4, 9, 3],
    [1, 9, 7, 8, 3, 4, 5, 6, 2],
    [8, 2, 6, 1, 9, 5, 3, 4, 7],
    [3, 7, 4, 6, 8, 2, 9, 1, 5],
    [9, 5, 1, 7, 4, 3, 6, 2, 8],
    [5, 1, 9, 3, 2, 6, 8, 7, 4],
    [2, 4, 8, 9, 5, 7, 1, 3, 6],
    [7, 6, 3, 4, 1, 8, 2, 0, 0] // 5, 9
  ];
  const dimension = 9;
  let numero = 0;

  let minutos = 0;
  let segundos = 0;
  let mensajeTimer = "";
  let varTimer;

  // Oculta el mensaje de error
  $("#mensajeError").hide();
  $("#mensajeGanador").hide();
  $("#controlesNuevoJuego").hide();

  /**
   * Inicia un nuevo juego
   */
  $("#botonNuevoJuego").click(function() {
    // Oculta el botón de nuevo juego
    $(this).hide();
    // Muestra los controles de juego
    $("#controlesNuevoJuego").show();
    // Inicia el timer del juego
    varTimer = setInterval(timerJuego, 1000);
  });

  // Muestra los valores de tablero en la página
  for (let f = 0; f < dimension; f++) {
    for (let c = 0; c < dimension; c++) {
      // Obtiene el valor actual
      const element = tablero[f][c];
      if (element != 0) {
        // Genera el selector del elemento td
        let selector = `td[fila=${f}][col=${c}]`;
        // Escribe el valor en la página
        $(selector).text(element);
      }
    }
  }

  /**
   * Click en los botones para seleccionar el número a jugar
   */
  $(".page-item").click(function() {
    // Obtiene el botón seleccionado
    let botonSeleccionado = $(this);
    // Elimina la clase activa de todos los botones
    $(".page-item").removeClass("active");
    // Agrega la clase activa al botón seleccionado
    botonSeleccionado.addClass("active");
    // Obtiene el número a jugar
    numero = parseInt(botonSeleccionado.attr("numero"));
  });

  /**
   * Click en una celda del tablero
   */
  $("td").click(function() {
    // Obtiene la celda y sus datos
    let celda = $(this);
    let fila = parseInt(celda.attr("fila"));
    let columna = parseInt(celda.attr("col"));

    // Escribe el valor en la celda
    if (numero == 0) {
      // Muestra el valor en la página
      celda.text("");
      // Guarda el número jugado en el tablero
      tablero[fila][columna] = 0;
      // Elimina la clase que muestra la celda como jugada
      celda.removeClass("celdaJugada");
    } else {
      // Verifica que el valor sea único en la fila y en la columna
      if (
        esUnicoNumeroEnFila(numero, fila) &&
        esUnicoNumeroEnColumna(numero, columna) &&
        esUnicoNumeroEnCuadrante(numero, fila, columna)
      ) {
        // Oculta el mensaje de error
        $("#mensajeError").hide();

        // Guarda el número jugado en el tablero
        tablero[fila][columna] = parseInt(numero);

        // Muestra el número en la página
        celda.text(numero);

        // Agrega la clase que muestra la celda como jugada
        celda.addClass("celdaJugada");
        // Verifica si el tablero ha sido lleno
        if (estaTableroLleno()) {
          // Detiene el timer del juego
          clearTimeout(varTimer);
          // Muestra el mensaje ganador
          $("#mensajeGanador").show();
        }
      } else {
        // Muestra el mensaje de error
        $("#mensajeError").show();
      }
    }
  });

  /**
   * Verifica que el número se único en la fila en el tablero
   * @param {number} numero número a buscar en la fila
   * @param {number} fila fila en la cual se va a buscar el número
   */
  let esUnicoNumeroEnFila = (numero, fila) => {
    // Recorre la fila en el tablero
    for (let index = 0; index < dimension; index++) {
      // Obtiene el elemento actual
      const element = tablero[fila][index];
      // Verifica si es el número buscado
      if (element == numero) {
        return false;
      }
    }
    return true;
  };

  /**
   * Verifica que el número se único en la columna en el tablero
   * @param {number} numero número a buscar en la columna
   * @param {number} columna columna en la cual se va a buscar el numero
   */
  let esUnicoNumeroEnColumna = (numero, columna) => {
    // Recorre la columna en el tablero
    for (let index = 0; index < dimension; index++) {
      // Obtiene el elemento actual
      const element = tablero[index][columna];
      // Verifica si es el número buscado
      if (element == numero) {
        return false;
      }
    }
    return true;
  };

  /**
   * Verifica que el número se único en un cuadrante en el tablero
   * @param {number} numero número a buscar en el cuadrante
   * @param {number} fila fila de la celda
   * @param {number} columna columna de la celda
   */
  let esUnicoNumeroEnCuadrante = (numero, fila, columna) => {
    // Variables límites de búsqueda
    let desdeFila, hastaFila, desdeColumna, hastaColumna;
    // Establece los limites de las filas
    if (fila >= 0 && fila <= 2) {
      desdeFila = 0;
      hastaFila = 2;
    } else if (fila >= 3 && fila <= 5) {
      desdeFila = 3;
      hastaFila = 5;
    } else if (fila >= 6 && fila <= 8) {
      desdeFila = 6;
      hastaFila = 8;
    }
    // Establece los limites de las columnas
    if (columna >= 0 && columna <= 2) {
      desdeColumna = 0;
      hastaColumna = 2;
    } else if (columna >= 3 && columna <= 5) {
      desdeColumna = 3;
      hastaColumna = 5;
    } else if (columna >= 6 && columna <= 8) {
      desdeColumna = 6;
      hastaColumna = 8;
    }
    // Recorre la matriz
    for (let f = desdeFila; f <= hastaFila; f++) {
      for (let c = desdeColumna; c <= hastaColumna; c++) {
        // Verifica si el número buscado es el valor actual
        if (tablero[f][c] == numero) {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * Verifica si el tablero ya está lleno, es decir, terminó el juego.
   */
  let estaTableroLleno = () => {
    // Recorre la matriz
    for (let f = 0; f < dimension; f++) {
      for (let c = 0; c < dimension; c++) {
        // Verifica si la celda actual está vacía
        if (tablero[f][c] == 0) {
          return false;
        }
      }
    }
    return true;
  };

  /**
   * Ejecuta el timer del juego
   */
  function timerJuego() {
    // Genera el letrero del timer
    mensajeTimer = pad(minutos) + ":" + pad(segundos);
    // Muestra el timer en la página
    $("#labelTimer").text(mensajeTimer);
    // Verifica si se debe pasar el siguiente minuto
    if (segundos == 59) {
      segundos = -1;
      minutos++;
    }
    // Incrementa los segundos
    segundos++;
  }

  /**
   * Formatea un valor de minutos o segundos en una cadena de 2 dígitos si es necesario
   * @param {number} val valor en minutos o segundos
   */
  let pad = val => {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  };

  /**
   * Muestra el modal para guardar el tiempo
   */
  $("#modalNuevoTiempo").on("show.bs.modal", function(event) {
    // Obtiene el modal
    var modal = $(this);
    // Muestra el tiempo en el titulo
    modal.find(".modal-title").text("Nuevo tiempo: " + mensajeTimer);
  });

  /**
   * Guarda el tiempo del nuevo juego
   */
  $("#botonGuardarTiempo").click(function() {
    console.log("tiempo guardado");
  });

  // Verifica si local storage es soportado por el browser
  if (typeof Storage !== "undefined") {
    console.log("Yeeeeiiii");
  } else {
    console.log("Damn!!!");
  }
});
