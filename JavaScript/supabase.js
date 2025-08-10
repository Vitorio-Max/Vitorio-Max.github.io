import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
// Reemplaza con tu URL y tu clave anon
const supabaseUrl = 'https://usbrxrzekdmktdiiyqzq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzYnJ4cnpla2Rta3RkaWl5cXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0MTYsImV4cCI6MjA2OTk4NTQxNn0.LeV5DPtRHMYixltedEJqUY596_2vR0A89LDm2UHflws';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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