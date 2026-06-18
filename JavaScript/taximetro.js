document.addEventListener("DOMContentLoaded", () => {
    // 1. Captura de elementos del DOM
    const displays = {
        tarifa: document.querySelector(".tarifa-display"),
        precio: document.querySelector(".precio-display"),
        suplemento: document.querySelector(".suplemento-display")
    };

    const indicadores = {
        libre: document.querySelector(".indicadores-estado .texto-fijo:nth-child(1)"),
        ocupado: document.querySelector(".indicadores-estado .texto-fijo:nth-child(2)"),
        aPagar: document.querySelector(".indicadores-estado .texto-fijo:nth-child(3)")
    };

    // Captura de botones específicos mediante sus nuevas clases
    const btnLibre = document.querySelector(".btn-libre");
    const btnOcupado = document.querySelector(".btn-ocupado");
    const btnDos = document.querySelector(".botonera .btnt56:nth-child(3)");
    const btnPausa = document.querySelector(".btn-pausa");
    const btnPagar = document.querySelector(".btn-pagar");

    // 2. Variables de estado del taxímetro
    let estadoActual = "APAGADO";
    let tarifaActiva = 1;
    let precioAcumulado = 0.00;
    let suplementoAcumulado = 0.00;

    let intervaloTiempo = null;   // Bucle para cuando el coche está parado
    let idRelojGPS = null;        // Rastreador del GPS del dispositivo
    let ultimaCoordenada = null;  // Para medir distancias precisas paso a paso

    // Precios configurables (Tiempo y Kilometraje)
    const PRECIOS = {
        1: { bajada: 2.55, hora: 27.00, km: 1.40 },  // Laborables
        2: { bajada: 3.20, hora: 29.00, km: 1.60 },  // Fin de semana
        5: { bajada: 3.50, hora: 32.00, km: 1.80 },  // Interurbano Laborables 🌟
        6: { bajada: 4.20, hora: 35.00, km: 2.10 }   // Interurbano Fin de semana 🌟
    };

    const VELOCIDAD_CAMBIO_KMH = 22; // Velocidad límite en km/h

    // 3. Función principal para actualizar la pantalla (Renderizado)
    function actualizarPantalla() {
        // Capturamos el contenedor principal para aplicarle el estado físico
        const contenedor = document.querySelector(".taximetro-container");

        // Apagamos todos los indicadores por defecto
        Object.values(indicadores).forEach(ind => ind.classList.remove("encendido"));

        // 👇 MODIFICADO: CONTROL DE CLASE APAGADO 👇
        if (estadoActual === "APAGADO") {
            contenedor.classList.add("apagado"); // Ponemos el aspecto físico de apagado

            displays.tarifa.textContent = "";
            displays.precio.textContent = "";
            displays.suplemento.textContent = "";
        }
        else {
            contenedor.classList.remove("apagado"); // Quitamos el apagado si está en cualquier otro estado

            if (estadoActual === "LIBRE") {
                indicadores.libre.classList.add("encendido");
                displays.tarifa.textContent = "L";
                displays.precio.textContent = "";
                displays.suplemento.textContent = "";
            }
            else if (estadoActual === "OCUPADO") {
                indicadores.ocupado.classList.add("encendido");
                displays.tarifa.textContent = tarifaActiva;
                displays.precio.textContent = precioAcumulado.toFixed(2);
                displays.suplemento.textContent = suplementoAcumulado > 0 ? suplementoAcumulado.toFixed(2) : "";
            }
            else if (estadoActual === "PAUSA") {
                indicadores.ocupado.classList.add("encendido");
                displays.tarifa.textContent = "0";
                displays.precio.textContent = precioAcumulado.toFixed(2);
                displays.suplemento.textContent = suplementoAcumulado > 0 ? suplementoAcumulado.toFixed(2) : "";
            }
            else if (estadoActual === "A_PAGAR") {
                indicadores.aPagar.classList.add("encendido");
                displays.tarifa.textContent = "P";
                displays.precio.textContent = (precioAcumulado + suplementoAcumulado).toFixed(2);
                displays.suplemento.textContent = suplementoAcumulado > 0 ? suplementoAcumulado.toFixed(2) : "";
            }
        }
    }

    // 4. Función para iniciar el contador con tarifas dinámicas
    // Variable interna para acumular el dinero en segundo plano
    let monederoVirtual = 0.00;

    // Función matemática para calcular distancia real entre dos puntos GPS (Fórmula de Haversine)
    function calcularDistanciaMetros(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Radio de la tierra en metros
        const phi1 = lat1 * Math.PI / 180;
        const phi2 = lat2 * Math.PI / 180;
        const deltaPhi = (lat2 - lat1) * Math.PI / 180;
        const deltaLambda = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    // Procesa el dinero acumulado en segundo plano y genera el salto de 0.05€ si corresponde
    function procesarAcumulacion(importePorSumar) {
        monederoVirtual += importePorSumar;

        // Mientras tengamos acumulados más de 0.05€, damos saltos exactos en la pantalla
        while (monederoVirtual >= 0.05) {
            precioAcumulado += 0.05;
            monederoVirtual -= 0.05; // Restamos el salto del monedero virtual
            actualizarPantalla();
        }
    }

    function iniciarContador(estadoPrevio) {
        const hoy = new Date();
        const diaSemana = hoy.getDay();
        const horaActual = hoy.getHours(); // 🔄 Captura la hora (0 a 23)
        const esFinDeSemana = (diaSemana === 0 || diaSemana === 6);
        const esHorarioNocturno = (horaActual >= 21 || horaActual < 7);
        // 🔄 Si la tarifa activa NO es interurbana (5 o 6), calcula la automática de Madrid (1 o 2)
        // Pero si ya es 5 o 6 (porque pulsamos el tercer botón), no la toca.



        if (tarifaActiva !== 5 && tarifaActiva !== 6) {
            tarifaActiva = (esFinDeSemana || esHorarioNocturno) ? 2 : 1;
        }
        const preciosTarifa = PRECIOS[tarifaActiva];

        // Inicialización de valores
        // 🔄 MODIFICACIÓN: Si NO venimos de una pausa, iniciamos valores de cero.
        // Si venimos de PAUSA, respetamos el precio que ya estaba congelado.
        if (estadoPrevio !== "PAUSA") {
            precioAcumulado = preciosTarifa.bajada;
            suplementoAcumulado = 0.00;
            monederoVirtual = 0.00; //Se limpia al empezar el viaje
        }
        ultimaCoordenada = null;

        // A) RASTREO POR TIEMPO (Revisión cada 1 segundo)
        intervaloTiempo = setInterval(() => {
            if (estadoActual !== "OCUPADO") return;

            // Si estamos parados o a menos de 22 km/h, acumulamos dinero por tiempo
            if (!window.velocidadActualGPS || window.velocidadActualGPS <= VELOCIDAD_CAMBIO_KMH) {
                const eurosPorSegundo = preciosTarifa.hora / 3600;
                procesarAcumulacion(eurosPorSegundo);
            }
        }, 1000);

        // B) RASTREO POR MOVIMIENTO GPS REAL
        if ("geolocation" in navigator) {
            idRelojGPS = navigator.geolocation.watchPosition(
                (position) => {
                    if (estadoActual !== "OCUPADO") return;

                    const velocidadMS = position.coords.speed || 0;
                    const velocidadKMH = velocidadMS * 3.6;

                    window.velocidadActualGPS = velocidadKMH;

                    console.log(`Velocidad: ${velocidadKMH.toFixed(1)} km/h | Monedero interno: ${monederoVirtual.toFixed(4)}€`);

                    // Si vamos más rápido de 22 km/h, acumulamos dinero por metros recorridos
                    if (velocidadKMH > VELOCIDAD_CAMBIO_KMH) {
                        if (ultimaCoordenada) {
                            const metrosRecorridos = calcularDistanciaMetros(
                                ultimaCoordenada.latitude, ultimaCoordenada.longitude,
                                position.coords.latitude, position.coords.longitude
                            );

                            // Filtro de ruido del chip GPS (evitar saltos falsos menores a 1 metro)
                            if (metrosRecorridos > 1 && metrosRecorridos < 200) {
                                const kmRecorridos = metrosRecorridos / 1000;
                                const eurosPorDistancia = kmRecorridos * preciosTarifa.km;
                                procesarAcumulacion(eurosPorDistancia);
                            }
                        }
                    }

                    ultimaCoordenada = position.coords;
                },
                (error) => {
                    console.error("Error GPS: ", error.message);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                }
            );
        } else {
            alert("Tu dispositivo o navegador no soporta GPS real.");
        }
    }

    function detenerContador() {
        clearInterval(intervaloTiempo);
        if (idRelojGPS !== null) {
            navigator.geolocation.clearWatch(idRelojGPS);
            idRelojGPS = null;
        }
        window.velocidadActualGPS = 0;

    }

    // 5. ASIGNACIÓN COMPATIBLE CON PANTALLAS TÁCTILES Y RATÓN
    // =========================================================

    // Función auxiliar para registrar la pulsación sin importar el dispositivo
    function agregarEventoAccion(elemento, callback) {
        if (!elemento) return;

        elemento.addEventListener("pointerdown", (e) => {
            e.stopPropagation();
            callback();
        });
    }

    // BOTÓN 2 (.btn-ocupado): Inicia, Reanuda viaje o VUELVE a Tarifa Urbana (1 o 2)
    agregarEventoAccion(btnOcupado, () => {
        const hoy = new Date();
        const diaSemana = hoy.getDay();
        const horaActual = hoy.getHours();

        const esFinDeSemana = (diaSemana === 0 || diaSemana === 6);
        const esHorarioNocturno = (horaActual >= 21 || horaActual < 7);

        // Si ya está OCUPADO pero estábamos en tarifa 5 o 6, volvemos a la urbana correcta
        if (estadoActual === "OCUPADO" && (tarifaActiva === 5 || tarifaActiva === 6)) {
            // Evaluamos tanto el día como la hora actual
            tarifaActiva = (esFinDeSemana || esHorarioNocturno) ? 2 : 1;

            detenerContador();
            iniciarContador("PAUSA");
            actualizarPantalla();
        }
        // Comportamiento normal si venía de LIBRE o PAUSA
        else if (estadoActual === "LIBRE" || estadoActual === "PAUSA") {
            const estadoPrevio = estadoActual;
            estadoActual = "OCUPADO";
            iniciarContador(estadoPrevio);
            actualizarPantalla();
        }
    });

    // TERCER BOTÓN (.btnt56): Pasa a Tarifa Interurbana (5 o 6) según el horario
    agregarEventoAccion(btnDos, () => {
        const hoy = new Date();
        const diaSemana = hoy.getDay();
        const horaActual = hoy.getHours();

        const esFinDeSemana = (diaSemana === 0 || diaSemana === 6);
        const esHorarioNocturno = (horaActual >= 21 || horaActual < 7);

        // 🔄 Determina la tarifa interurbana correcta (6 si es fin de semana o noche, si no 5)
        const nuevaTarifaInterurbana = (esFinDeSemana || esHorarioNocturno) ? 6 : 5;

        // CASO A: Si el viaje ya está en curso (OCUPADO), cambiamos a interurbana en caliente
        if (estadoActual === "OCUPADO" && tarifaActiva !== nuevaTarifaInterurbana) {
            tarifaActiva = nuevaTarifaInterurbana;
            detenerContador();
            iniciarContador("PAUSA"); // Conserva el dinero que ya se ha cobrado
            actualizarPantalla();
        }
        // CASO B: Si estaba LIBRE, arranca el viaje directamente en la tarifa interurbana que toque
        else if (estadoActual === "LIBRE") {
            tarifaActiva = nuevaTarifaInterurbana;
            estadoActual = "OCUPADO";
            iniciarContador("LIBRE"); // Arranca de cero con su bajada de bandera (5 o 6)
            actualizarPantalla();
        }
    });

    // BOTÓN 5 (.btn-pausa): Para el tiempo/GPS y pone tarifa en 0
    agregarEventoAccion(btnPausa, () => {
        if (estadoActual === "OCUPADO") {
            estadoActual = "PAUSA";
            detenerContador();
            actualizarPantalla();
        }
    });

    // BOTÓN 6 (.btn-pagar): Pasa a estado A PAGAR
    agregarEventoAccion(btnPagar, () => {
        if (estadoActual === "OCUPADO" || estadoActual === "PAUSA") {
            estadoActual = "A_PAGAR";
            detenerContador();
            actualizarPantalla();
        }
    });

    // BOTÓN 1 (.btn-libre): Enciende/Apaga el taxímetro o reinicia a estado LIBRE desde A PAGAR
    agregarEventoAccion(btnLibre, () => {
        // CASO A: Si está apagado, al pulsar se enciende en modo LIBRE
        if (estadoActual === "APAGADO") {
            estadoActual = "LIBRE";
            tarifaActiva = 1;
            actualizarPantalla();
        }
        // 👇 CASO B (NUEVO): Si ya está en LIBRE, al pulsar el botón se APAGA 👇
        else if (estadoActual === "LIBRE") {
            estadoActual = "APAGADO";
            tarifaActiva = 1;
            actualizarPantalla();
        }
        // CASO C: Si terminó el viaje y está en "A Pagar", vuelve a LIBRE
        else if (estadoActual === "A_PAGAR") {
            estadoActual = "LIBRE";
            tarifaActiva = 1;
            actualizarPantalla();
        }
    });

    // Carga inicial (Muestra la "L" al cargar la página)
    actualizarPantalla();
});