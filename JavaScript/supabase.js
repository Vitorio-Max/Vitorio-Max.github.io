import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

// Reemplaza 'TU_SUPABASE_URL' y 'TU_SUPABASE_ANON_KEY' con tus claves reales.
const supabaseUrl = "https://usbrxrzekdmktdiiyqzq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzYnJ4cnpla2Rta3RkaWl5cXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0MTYsImV4cCI6MjA2OTk4NTQxNn0.LeV5DPtRHMYixltedEJqUY596_2vR0A89LDm2UHflws";

// Crea el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Funciones para la Lista de la Compra ---

// Función para obtener todos los items de la tabla 'items'
export async function getShoppingList() {
    const { data, error } = await supabase
        .from('items')
        .select('*');

    if (error) {
        console.error('Error al obtener la lista de la compra:', error);
        return null;
    }
    return data;
}

// Función para añadir un nuevo item
export async function addItemToList(item) {
    const { data, error } = await supabase
        .from('items')
        .insert([item])
        .select(); // Añadimos .select() para que devuelva el item insertado con su ID.

    if (error) {
        console.error('Error al añadir el item:', error);
        return null;
    }
    return data;
}

// Función para eliminar un item por su ID
export async function removeItemFromList(itemId) {
    const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

    if (error) {
        console.error('Error al eliminar el item:', error);
        return false;
    }
    return true;
}