// Importa tu cliente de supabase ya configurado
// import { supabase } from './supabase.js'; 

const btnIniciar = document.getElementById('btn-iniciar');
const btnFinalizar = document.getElementById('btn-finalizar');
const formFinalizar = document.getElementById('form-finalizar');
const btnConfirmar = document.getElementById('btn-confirmar-guardar');

let registroActualId = null;

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
    const coords = await obtenerUbicacion();
    
    const { data, error } = await supabase
        .from('servicios')
        .insert([{ 
            lat_inicio: coords.lat.toString(), 
            lng_inicio: coords.lng.toString() 
        }])
        .select();

    if (!error) {
        registroActualId = data[0].id;
        btnIniciar.style.display = 'none';
        btnFinalizar.style.display = 'inline-block';
        alert("Servicio iniciado y ubicación guardada.");
    }
});

// 2. MOSTRAR FORMULARIO DE CIERRE
btnFinalizar.addEventListener('click', () => {
    formFinalizar.style.display = 'block';
    btnFinalizar.style.display = 'none';
});

// 3. FINALIZAR Y GUARDAR TODO
btnConfirmar.addEventListener('click', async () => {
    const coords = await obtenerUbicacion();
    const importe = document.getElementById('importe').value;
    const metodo = document.getElementById('metodo-pago').value;

    const { error } = await supabase
        .from('servicios')
        .update({ 
            fecha_fin: new Date().toISOString(),
            lat_fin: coords.lat.toString(),
            lng_fin: coords.lng.toString(),
            importe: importe,
            metodo_pago: metodo
        })
        .eq('id', registroActualId);

    if (!error) {
        alert("Servicio finalizado con éxito.");
        location.reload(); // Reinicia la vista
    }
});