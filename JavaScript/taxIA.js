import { supabase } from '../JavaScript/supabase.js';

const btnIniciar = document.getElementById('btn-iniciar');
const btnFinalizar = document.getElementById('btn-finalizar');
const formFinalizar = document.getElementById('form-finalizar');
const btnConfirmar = document.getElementById('btn-confirmar-guardar');

let registroActualId = null;

// --- NUEVA FUNCIÓN: Convierte lat/lng en Calle ---
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

// Función para obtener coordenadas
const obtenerUbicacion = () => {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(pos => {
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }, () => resolve({ lat: null, lng: null }));
    });
};

// 1. INICIAR SERVICIO
btnIniciar.addEventListener('click', async () => {
    btnIniciar.innerText = "Localizando..."; // Feedback visual
    const coords = await obtenerUbicacion();
    
    // Obtenemos la calle real
    const direccion = await obtenerDireccionCalle(coords.lat, coords.lng);
    
    const { data, error } = await supabase
        .from('servicios')
        .insert([{ 
            lat_inicio: coords.lat ? coords.lat.toString() : null, 
            lng_inicio: coords.lng ? coords.lng.toString() : null,
            direccion_inicio: direccion // GUARDAMOS LA CALLE
        }])
        .select();

    if (!error) {
        registroActualId = data[0].id;
        btnIniciar.style.display = 'none';
        btnFinalizar.style.display = 'inline-block';
        alert(`Servicio iniciado en: ${direccion}`);
    } else {
        console.error(error);
        alert("Error al iniciar servicio");
    }
});

// 2. MOSTRAR FORMULARIO DE CIERRE
btnFinalizar.addEventListener('click', () => {
    formFinalizar.style.display = 'block';
    btnFinalizar.style.display = 'none';
});

// 3. FINALIZAR Y GUARDAR TODO
btnConfirmar.addEventListener('click', async () => {
    btnConfirmar.innerText = "Guardando...";
    const coords = await obtenerUbicacion();
    const importe = document.getElementById('importe').value;
    const metodo = document.getElementById('metodo-pago').value;

    // Obtenemos la calle de destino
    const direccionDestino = await obtenerDireccionCalle(coords.lat, coords.lng);

    const { error } = await supabase
        .from('servicios')
        .update({ 
            fecha_fin: new Date().toISOString(),
            lat_fin: coords.lat ? coords.lat.toString() : null,
            lng_fin: coords.lng ? coords.lng.toString() : null,
            direccion_fin: direccionDestino, // GUARDAMOS LA CALLE DE LLEGADA
            importe: importe,
            metodo_pago: metodo
        })
        .eq('id', registroActualId);

    if (!error) {
        alert("Servicio finalizado con éxito.");
        location.reload(); 
    } else {
        alert("Error al finalizar: " + error.message);
    }
});