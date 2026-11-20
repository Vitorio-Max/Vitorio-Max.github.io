import { api } from '../services/supabase';
import { useProductos } from './useProductos';
import { useLista } from './useLista';

export function useDespensa() {
  const { productos } = useProductos();
  const { anadirOIncrementar } = useLista();

  const ajustarStock = async (producto, delta) => {
    const nuevoStock = Math.max(0, (producto.stock_actual || 0) + delta);
    // Actualización optimista
    producto.stock_actual = nuevoStock;
    await api.actualizarProducto(producto.id, { stock_actual: nuevoStock });
  };

  const reponerEnLista = async (producto) => {
    const cantidadSugerida = Math.max(1, (producto.stock_minimo || 1) - producto.stock_actual + 1);
    await anadirOIncrementar(producto.id, cantidadSugerida);
  };

  return {
    productos,
    ajustarStock,
    reponerEnLista,
  };
}