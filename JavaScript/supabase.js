import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Reemplaza con tu URL y tu clave anon
const supabaseUrl = 'https://sgevdzcjyoezewbdvpaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnZXZkemNqeW9lemV3YmR2cGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODk2ODQsImV4cCI6MjA4NTQ2NTY4NH0.PmAzz_vLQkRinDPmUagqfqamFY55CyW-AEEw52OaDi4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ... tu inicialización de supabase (const supabase = ...)

async function verificarSeguridad() {
  const { data, error } = await supabase
    .from('shopping_items')
    .select('*');

  if (error) {
    console.error("Acceso denegado o error:", error.message);
  } else {
    console.log("Datos recibidos:", data);
  }
}

// --- Funciones para la Lista de la Compra ---

// Función para obtener todos los artículos
export async function getShoppingList() {
    const { data, error } = await supabase
        .from('shopping_items') // Usamos el nombre de la nueva tabla
        .select('*')
        .order('created_at', { ascending: false }); // Ordenamos por fecha de creación

    if (error) {
        console.error('Error al obtener la lista de la compra:', error);
        return null;
    }
    return data;
}

// Función para añadir un nuevo artículo
export async function addItemToList(item) {
    const { data, error } = await supabase
        .from('shopping_items')
        .insert([item])
        .select();

    if (error) {
        console.error('Error al añadir el artículo:', error);
        return null;
    }
    return data;
}

// Función para eliminar un artículo
export async function removeItemFromList(itemId) {
    const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', itemId);

    if (error) {
        console.error('Error al eliminar el artículo:', error);
        return false;
    }
    return true;
}