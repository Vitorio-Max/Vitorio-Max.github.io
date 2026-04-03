import { supabase } from '../JavaScript/supabase.js';

const btnIniciar = document.getElementById('btn-iniciar');
const btnFinalizar = document.getElementById('btn-finalizar');
const formFinalizar = document.getElementById('form-finalizar');
const btnConfirmar = document.getElementById('btn-confirmar-guardar');

let registroActualId = null;
let metodoSeleccionado = 'efectivo';

/**
 * FUNCIÓN AUXILIAR: Lanza la notificación amigable
 */
const lanzarNotificacion = (mensaje, esError = false) => {
    Toastify({
        text: mensaje,
        duration: 3000, // 3 segundos
        gravity: "top", // top o bottom
        position: "right", // left, center o right
        stopOnFocus: true, // Evita que desaparezca si el usuario pasa el ratón
        style: {
            background: esError ? "#dc3545" : "#28a745",
            borderRadius: "10px",
            fontWeight: "bold"
        }
    }).showToast();
};

// --- FUNCIÓN: Geocodificación ---
const obtenerDireccionCalle = async (lat, lng) => {
    if (!lat || !lng) return "Ubicación desconocida";
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        return data.display_name || "Dirección no encontrada";
    } catch (error) {
        console.error("Error en geocodificación:", error);
        return "Error al obtener dirección";
    }
};

// --- FUNCIÓN: Geolocalización ---
const obtenerUbicacion = () => {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(pos => {
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }, () => resolve({ lat: null, lng: null }));
    });
};

// Lógica para gestionar la selección de botones de pago
document.querySelectorAll('.btn-metodo').forEach(boton => {
    boton.addEventListener('click', (e) => {
        // 1. Quitar clase 'active' de todos los botones para "desmarcarlos"
        document.querySelectorAll('.btn-metodo').forEach(b => b.classList.remove('active'));
        
        // 2. Añadir clase 'active' al botón pulsado
        e.currentTarget.classList.add('active');
        
        // 3. Guardar el valor en nuestra variable
        metodoSeleccionado = e.currentTarget.getAttribute('data-valor');
        
        console.log("Método seleccionado:", metodoSeleccionado);
    });
});

// 1. INICIAR SERVICIO
btnIniciar.addEventListener('click', async () => {
    btnIniciar.innerText = "Localizando...";
    const coords = await obtenerUbicacion();
    const direccion = await obtenerDireccionCalle(coords.lat, coords.lng);
    
    const { data, error } = await supabase
        .from('servicios')
        .insert([{ 
            lat_inicio: coords.lat ? coords.lat.toString() : null, 
            lng_inicio: coords.lng ? coords.lng.toString() : null,
            direccion_inicio: direccion 
        }])
        .select();

    if (!error) {
        registroActualId = data[0].id;
        btnIniciar.style.display = 'none';
        btnFinalizar.style.display = 'inline-block';
        lanzarNotificacion(`Servicio iniciado en: ${direccion}`);
    } else {
        btnIniciar.innerText = "Iniciar Servicio";
        lanzarNotificacion("Error al iniciar servicio", true);
    }
});

// 2. MOSTRAR FORMULARIO DE CIERRE
btnFinalizar.addEventListener('click', () => {
    formFinalizar.style.display = 'block';
    btnFinalizar.style.display = 'none';
    document.getElementById('importe').focus();
});

// 3. FINALIZAR Y GUARDAR TODO
btnConfirmar.addEventListener('click', async () => {
    btnConfirmar.innerText = "Guardando...";
    const coords = await obtenerUbicacion();
    const importe = document.getElementById('importe').value;
const metodo = metodoSeleccionado; // <-- AHORA USA LA VARIABLE DE LOS BOTONES

    const direccionDestino = await obtenerDireccionCalle(coords.lat, coords.lng);

    const { error } = await supabase
        .from('servicios')
        .update({ 
            fecha_fin: new Date().toISOString(),
            lat_fin: coords.lat ? coords.lat.toString() : null,
            lng_fin: coords.lng ? coords.lng.toString() : null,
            direccion_fin: direccionDestino,
            importe: importe,
            metodo_pago: metodo
        })
        .eq('id', registroActualId);

    if (!error) {
        lanzarNotificacion("Servicio finalizado con éxito.");
        // Esperamos 2 segundos para que de tiempo a leer antes de recargar
        setTimeout(() => location.reload(), 2000); 
    } else {
        btnConfirmar.innerText = "Guardar en Supabase";
        lanzarNotificacion("Error al finalizar: " + error.message, true);
    }
});