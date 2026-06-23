import { supabase } from './supabase.js'; // 🔄 Importamos la misma instancia compartida

document.addEventListener("DOMContentLoaded", async () => { // 🔄 Ponemos 'async' aquí

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
    // 👇 MODIFICADO: selectores actualizados a los nuevos nombres de clase
    const btnLibre = document.querySelector(".btnCirculo");   // Encendido/Apagado, vuelve a Libre desde A_Pagar
    const btnOcupado = document.querySelector(".btnUno");     // Inicia/Reanuda viaje · combinación "+1" → Tarifa 3
    const btnDos = document.querySelector(".btnDos");         // Tarifa interurbana 5/6 · combinación "+2" → Tarifa 4
    const btnTres = document.querySelector(".btnTres");
    const btnPausa = document.querySelector(".btnCuatro");    // Pausa · combinación "+4" → Tarifa 9
    const btnPagar = document.querySelector(".btnCuadrado");  // A Pagar
    const btnMas = document.querySelector(".btnMas");         // Modificador "+"

    // 👇 NUEVO: botones físicos ya capturados, sin función asignada todavía
    const btnRombo = document.querySelector(".btnRombo");
    const btnTriangulo = document.querySelector(".btnTriangulo");

    // 👇 NUEVO: Captura de elementos para el Login 
    const capaLogin = document.getElementById("capa-login");
    const btnLogin = document.getElementById("btn-login");

    // 2. Variables de estado del taxímetro
    let estadoActual = "APAGADO";
    let tarifaActiva = 1;
    let precioAcumulado = 0.00;
    let suplementoAcumulado = 0.00;
    // 🔄 NUEVO: Consultamos a Supabase si existe una sesión activa en el navegador
    const { data: { session } } = await supabase.auth.getSession();
    let usuarioLogueado = session !== null;

    let intervaloTiempo = null;   // Bucle para cuando el coche está parado
    let idRelojGPS = null;        // Rastreador del GPS del dispositivo
    let ultimaCoordenada = null;  // Para medir distancias precisas paso a paso

    // Opcional: Si el usuario cierra sesión en tiempo real, apagamos el aparato
    supabase.auth.onAuthStateChange((event, session) => {
        usuarioLogueado = session !== null;
        if (!usuarioLogueado && estadoActual !== "APAGADO") {
            estadoActual = "APAGADO";
            detenerContador();
            actualizarPantalla();
        }
    });

    // Precios configurables (Tiempo y Kilometraje)
    // 👇 NOTA: "franquiciaKm" es opcional. Las tarifas que la tienen, al superar esos
    // km recorridos, se convierten automáticamente en tarifa 1 o 2 (según día/hora).
    const PRECIOS = {
        1: { bajada: 2.55, hora: 27.00, km: 1.40 },  // Laborables
        2: { bajada: 3.20, hora: 29.00, km: 1.60 },  // Fin de semana
        3: { bajada: 22.00, hora: 27.00, km: 1.40, franquiciaKm: 9, franquiciaMin: 28 }, // Bajada 22.00€, franquicia 9.5km, luego pasa a 1/2
        4: { bajada: 33.00 },  // Ajusta a tus valores reales
        5: { bajada: 2.55, hora: 29.00, km: 1.60 },  // Interurbano Laborables 🌟
        6: { bajada: 3.20, hora: 29.00, km: 1.60 },  // Interurbano Fin de semana 🌟
        7: { bajada: 8.00, hora: 27.00, km: 1.40, franquiciaKm: 1.45, franquiciaMin: 4.5 },  // Arranca en 8.00€, franquicia 9.5km, luego pasa a 1/2
        9: { bajada: 0.00, hora: 0.00, km: 0.00 }    // Tarifa especial a 0.00€
    };

    const VELOCIDAD_CAMBIO_KMH = 19.29; // Velocidad límite en km/h
    let kmAcumuladosConFranquicia = 0; // Contador genérico, válido para cualquier tarifa con franquiciaKm
    let segundosParadoConFranquicia = 0; // 🔄 NUEVO: contador independiente de tiempo parado

    // 3. Función principal para actualizar la pantalla (Renderizado)
    function actualizarPantalla() {
        // Capturamos el contenedor principal para aplicarle el estado físico
        const contenedor = document.querySelector(".taximetro-container");

        // Apagamos todos los indicadores por defecto
        Object.values(indicadores).forEach(ind => ind.classList.remove("encendido"));

        // CONTROL DE CLASE APAGADO
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
        const horaActual = hoy.getHours(); // Captura la hora (0 a 23)
        const esFinDeSemana = (diaSemana === 0 || diaSemana === 6);
        const esHorarioNocturno = (horaActual >= 21 || horaActual < 7);
        // Si la tarifa activa NO es interurbana (5 o 6) ni especial (3,4,7,9), calcula la automática de Madrid (1 o 2)
        // Pero si ya es una tarifa especial (porque pulsamos una combinación o el botón interurbano), no la toca.

        const tarifasQueNoSeAutocalculan = [3, 4, 5, 6, 7, 9];
        if (!tarifasQueNoSeAutocalculan.includes(tarifaActiva)) {
            tarifaActiva = (esFinDeSemana || esHorarioNocturno) ? 2 : 1;
        }
        const preciosTarifa = PRECIOS[tarifaActiva];

        // Inicialización de valores
        // Si NO venimos de una pausa, iniciamos valores de cero.
        // Si venimos de PAUSA, respetamos el precio que ya estaba congelado.
        if (estadoPrevio !== "PAUSA") {
            precioAcumulado = preciosTarifa.bajada;
            suplementoAcumulado = 0.00;
            monederoVirtual = 0.00; //Se limpia al empezar el viaje
            kmAcumuladosConFranquicia = 0; // Se limpia al empezar un viaje nuevo
            segundosParadoConFranquicia = 0; // 🔄 NUEVO
        }
        ultimaCoordenada = null;

        // A) RASTREO POR TIEMPO (Revisión cada 1 segundo)
        intervaloTiempo = setInterval(() => {
            if (estadoActual !== "OCUPADO") return;

            const dentroDeFranquicia = preciosTarifa.franquiciaKm &&
                kmAcumuladosConFranquicia < preciosTarifa.franquiciaKm;

            if (!window.velocidadActualGPS || window.velocidadActualGPS <= VELOCIDAD_CAMBIO_KMH) {

                // 🛑 Si estamos dentro de la franquicia, no cobramos: solo contamos minutos parado
                if (dentroDeFranquicia) {
                    segundosParadoConFranquicia += 1;

                    if (segundosParadoConFranquicia >= preciosTarifa.franquiciaMin * 60) {
                        hacerTransicionPorFranquicia();
                    }
                    return;
                }

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

                                const dentroDeFranquicia = preciosTarifa.franquiciaKm &&
                                    kmAcumuladosConFranquicia < preciosTarifa.franquiciaKm;

                                if (!dentroDeFranquicia) {
                                    const eurosPorDistancia = kmRecorridos * preciosTarifa.km;
                                    procesarAcumulacion(eurosPorDistancia);
                                }

                                if (preciosTarifa.franquiciaKm) {
                                    kmAcumuladosConFranquicia += kmRecorridos;

                                    if (kmAcumuladosConFranquicia >= preciosTarifa.franquiciaKm) {
                                        hacerTransicionPorFranquicia();
                                    }
                                }
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
    // Calcula si toca tarifa 1 o 2 según día/hora, y transiciona. 
    // La usan tanto el agotamiento de franquicia por km como por minutos parado.
    function hacerTransicionPorFranquicia() {
        const ahora = new Date();
        const esFinDeSemanaAhora = (ahora.getDay() === 0 || ahora.getDay() === 6);
        const horaAhora = ahora.getHours();
        const esNocturnoAhora = (horaAhora >= 21 || horaAhora < 7);

        transicionarTarifa((esFinDeSemanaAhora || esNocturnoAhora) ? 2 : 1);
    }
    function detenerContador() {
        clearInterval(intervaloTiempo);
        if (idRelojGPS !== null) {
            navigator.geolocation.clearWatch(idRelojGPS);
            idRelojGPS = null;
        }
        window.velocidadActualGPS = 0;

    }

    // Función genérica de transición de tarifa.
    // La usan tanto las combinaciones del botón "+" como el paso automático 7 → 1/2.
    function transicionarTarifa(nuevaTarifa) {
        tarifaActiva = nuevaTarifa;
        kmAcumuladosConFranquicia = 0; // Se reinicia siempre que cambiamos de tarifa
        segundosParadoConFranquicia = 0; // 🔄 NUEVO: igual que el contador de km, debe reiniciarse aquí también

        if (estadoActual === "OCUPADO") {
            detenerContador();
            iniciarContador("PAUSA");
        } else if (estadoActual === "LIBRE") {
            estadoActual = "OCUPADO";
            iniciarContador("LIBRE");
        }
        actualizarPantalla();
    }

    // Estado y control del "modo +" (modificador tipo Shift)
    let modoMasActivo = false;
    let temporizadorMas = null;

    function activarModoMas() {
        modoMasActivo = true;
        btnMas.classList.add("armado");
        temporizadorMas = setTimeout(desactivarModoMas, 3000);
    }

    function desactivarModoMas() {
        modoMasActivo = false;
        btnMas.classList.remove("armado");
        clearTimeout(temporizadorMas);
        temporizadorMas = null;
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

    // BOTÓN "+" (.btnMas) — arma o desarma el modo combinación
    agregarEventoAccion(btnMas, () => {
        if (modoMasActivo) {
            desactivarModoMas();
        } else {
            activarModoMas();
        }
    });

    // Función centralizada: ¿puede el taxímetro cambiar de tarifa ahora mismo?
    function tarifaEspecialActivaBloqueaCambio() {
        if ([3, 4, 7, 9].includes(tarifaActiva)) {
            console.warn("Cambio denegado: Ya te encuentras en una tarifa especial.");
            return true;
        }
        return false;
    }

    // BOTÓN CÍRCULO (.btnCirculo): Enciende/Apaga el taxímetro o reinicia a LIBRE desde A PAGAR
    agregarEventoAccion(btnLibre, () => {

        // NOTIFICACIÓN SIMPLE: Si no está logueado, muestra el aviso y frena el código
        if (!usuarioLogueado) {
            Toastify({
                text: "⚠️ Acceso denegado: Debes iniciar sesión para usar el taxímetro.",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "#dc3545",
                    borderRadius: "5px",
                    color: "white"
                }
            }).showToast();
            return;
        }
        // CASO A: Si está apagado, al pulsar se enciende en modo LIBRE
        if (estadoActual === "APAGADO") {
            estadoActual = "LIBRE";
            tarifaActiva = 1;
            actualizarPantalla();
        }
        // CASO B: Si ya está en LIBRE, al pulsar el botón se APAGA
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

    // BOTÓN UNO (.btnUno): Inicia, Reanuda viaje o VUELVE a Tarifa Urbana (1 o 2)
    // O combinación "+" + Uno → Tarifa 3
    agregarEventoAccion(btnOcupado, () => {
        // Interceptamos la combinación antes de la lógica normal
        if (modoMasActivo) {
            desactivarModoMas();
            // 🛑 NUEVO: Bloqueo si ya está en una tarifa especial restrictiva
            if ([3, 4, 7, 9].includes(tarifaActiva)) {
                console.warn("Cambio denegado: Ya te encuentras en una tarifa especial.");
                return;
            }
            transicionarTarifa(3);
            return;
        }


        const hoy = new Date();
        const diaSemana = hoy.getDay();
        const horaActual = hoy.getHours();

        const esFinDeSemana = (diaSemana === 0 || diaSemana === 6);
        const esHorarioNocturno = (horaActual >= 21 || horaActual < 7);

        // Si ya está OCUPADO pero estábamos en tarifa 5 o 6, volvemos a la urbana correcta
        if (estadoActual === "OCUPADO" && (tarifaActiva === 5 || tarifaActiva === 6)) {
            tarifaActiva = (esFinDeSemana || esHorarioNocturno) ? 2 : 1;

            detenerContador();
            iniciarContador("PAUSA");
            actualizarPantalla();
        }
        // Comportamiento normal si venía de LIBRE o PAUSA
        else if (estadoActual === "LIBRE" || estadoActual === "PAUSA") {
            const estadoPrevio = estadoActual;
            // 🔄 NUEVO: si venimos de interurbana, forzamos vuelta a urbana antes de iniciar
            if (tarifaActiva === 5 || tarifaActiva === 6) {
                tarifaActiva = (esFinDeSemana || esHorarioNocturno) ? 2 : 1;
            }
            estadoActual = "OCUPADO";
            iniciarContador(estadoPrevio);
            actualizarPantalla();
        }
    });
    // BOTÓN DOS (.btnDos): Pasa a Tarifa Interurbana (5 o 6) según el horario
    // O combinación "+" + Dos → Tarifa 4
    agregarEventoAccion(btnDos, () => {
        if (modoMasActivo) {
            desactivarModoMas();
            if (tarifaEspecialActivaBloqueaCambio()) return;
            transicionarTarifa(4);
            return;
        }

        // 🛑 NUEVO: también bloqueamos el uso normal del botón si hay tarifa especial activa
        if (estadoActual === "OCUPADO" && tarifaEspecialActivaBloqueaCambio()) {
            return;
        }

        const hoy = new Date();
        const diaSemana = hoy.getDay();
        const horaActual = hoy.getHours();
        const esFinDeSemana = (diaSemana === 0 || diaSemana === 6);
        const esHorarioNocturno = (horaActual >= 21 || horaActual < 7);
        const nuevaTarifaInterurbana = (esFinDeSemana || esHorarioNocturno) ? 6 : 5;

        if (estadoActual === "OCUPADO" && tarifaActiva !== nuevaTarifaInterurbana) {
            tarifaActiva = nuevaTarifaInterurbana;
            detenerContador();
            iniciarContador("PAUSA");
            actualizarPantalla();
        }
        else if (estadoActual === "LIBRE" || estadoActual === "PAUSA") { // 🔄 añadido "|| estadoActual === 'PAUSA'"
            const estadoPrevio = estadoActual; // 🔄 NUEVO: guardamos cuál era antes de sobreescribirlo
            tarifaActiva = nuevaTarifaInterurbana;
            estadoActual = "OCUPADO";
            iniciarContador(estadoPrevio); // 🔄 cambiado: antes era "LIBRE" fijo, ahora respeta el estado real
            actualizarPantalla();
        }
    });
    // BOTÓN TRES (.btnTres): O combinación "+" + Tres → Tarifa 7
    agregarEventoAccion(btnTres, () => {
        if (modoMasActivo) {
            desactivarModoMas();
            // 🛑 NUEVO: Bloqueo si ya está en una tarifa especial restrictiva
            if ([3, 4, 7, 9].includes(tarifaActiva)) {
                console.warn("Cambio denegado: Ya te encuentras en una tarifa especial.");
                return;
            }
            transicionarTarifa(7);
            return;
        }
    });
    // BOTÓN CUATRO (.btnCuatro): Para el tiempo/GPS y pone tarifa en 0
    // O combinación "+" + Cuatro → Tarifa 9
    agregarEventoAccion(btnPausa, () => {
        // Interceptamos la combinación antes de la lógica normal
        if (modoMasActivo) {
            desactivarModoMas();
            // 🛑 NUEVO: Bloqueo si ya está en una tarifa especial restrictiva
            if ([3, 4, 7, 9].includes(tarifaActiva)) {
                console.warn("Cambio denegado: Ya te encuentras en una tarifa especial.");
                return;
            }
            transicionarTarifa(9);
            return;
        }
        // 🛑 NUEVO: bloqueamos también el uso normal (pausa) si hay tarifa especial activa
        if (estadoActual === "OCUPADO" && tarifaEspecialActivaBloqueaCambio()) {
            return;
        }
        if (estadoActual === "OCUPADO") {
            estadoActual = "PAUSA";
            detenerContador();
            actualizarPantalla();
        }
    });
    // BOTÓN CUADRADO (.btnCuadrado): Pasa a estado A PAGAR
    agregarEventoAccion(btnPagar, () => {
        if (estadoActual === "OCUPADO" || estadoActual === "PAUSA") {
            estadoActual = "A_PAGAR";
            detenerContador();
            actualizarPantalla();
        }
    });

    // 👇 NUEVO: BOTÓN ROMBO (.btnRombo) — capturado, sin función asignada todavía
    agregarEventoAccion(btnRombo, () => {
        // TODO: define aquí qué debe hacer este botón
    });

    // 👇 NUEVO: BOTÓN TRIÁNGULO (.btnTriangulo) — capturado, sin función asignada todavía
    agregarEventoAccion(btnTriangulo, () => {
        // TODO: define aquí qué debe hacer este botón
    });

    // Carga inicial (Muestra la "L" al cargar la página)
    actualizarPantalla();
});