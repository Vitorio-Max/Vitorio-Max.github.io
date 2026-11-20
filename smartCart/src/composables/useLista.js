import { ref, computed } from 'vue';
import { api } from '../services/supabase';
import { useProductos } from './useProductos';

const itemsLista = ref([]);

export function useLista() {
  const { productos, cargarDatosBase } = useProductos();

  const cargarLista = async () => {
    itemsLista.value = await api.getListaCompra();
  };

  // Mapa rápido producto_id -> cantidad en lista
  const cantidadesPorProducto = computed(() => {
    const map = {};
    for (const item of itemsLista.value) {
      map[item.producto_id] = item.cantidad;
    }
    return map;
  });

  // Presupuesto en tiempo real de productos PENDIENTES
  const presupuestoPendiente = computed(() => {
    return itemsLista.value
      .filter((i) => !i.comprado)
      .reduce((acc, item) => acc + Number(item.producto?.precio || 0) * item.cantidad, 0);
  });

  const anadirOIncrementar = async (productoId, delta = 1) => {
    await api.upsertItemLista(productoId, delta);
    await cargarLista();
  };

  const alternarComprado = async (item) => {
    // Actualización optimista para fluidez táctil instantánea
    item.comprado = !item.comprado;
    try {
      await api.toggleComprado(item.id, item.comprado);
    } catch (e) {
      item.comprado = !item.comprado;
      throw e;
    }
  };

  // Agrupación estricta para Modo Tienda ("Sin Pasos Atrás")
  const obtenerListaTiendaPorEstablecimiento = (establecimientoId) => {
    const filtrados = itemsLista.value.filter(
      (i) => i.producto?.establecimiento_id === establecimientoId
    );

    const pendientes = filtrados.filter((i) => !i.comprado);
    const enCarro = filtrados.filter((i) => i.comprado);

    // Agrupar pendientes por ubicacion_id
    const gruposMap = new Map();
    for (const item of pendientes) {
      const ubi = item.producto?.ubicacion;
      const key = ubi ? ubi.id : 'sin-ubicacion';
      if (!gruposMap.has(key)) {
        gruposMap.set(key, {
          ubicacionId: key,
          nombre: ubi ? ubi.nombre : 'Sin pasillo asignado',
          orden: ubi ? ubi.orden_recorrido : 9999,
          items: [],
        });
      }
      gruposMap.get(key).items.push(item);
    }

    // Ordenar estrictamente por orden_recorrido ASC
    const seccionesOrdenadas = Array.from(gruposMap.values()).sort(
      (a, b) => a.orden - b.orden
    );

    return { seccionesOrdenadas, enCarro };
  };

  // Cierre manual de compra en caja
  const finalizarCompraManual = async (establecimientoId) => {
    const comprados = itemsLista.value.filter(
      (i) => i.comprado && i.producto?.establecimiento_id === establecimientoId
    );
    if (!comprados.length) return;

    // Sumar cantidades al stock de despensa
    for (const item of comprados) {
      const nuevoStock = (item.producto.stock_actual || 0) + item.cantidad;
      await api.actualizarProducto(item.producto_id, { stock_actual: nuevoStock });
    }

    // Eliminar de la lista activa
    await api.eliminarItemsLista(comprados.map((i) => i.id));
    await Promise.all([cargarLista(), cargarDatosBase()]);
  };

  return {
    itemsLista,
    cantidadesPorProducto,
    presupuestoPendiente,
    cargarLista,
    anadirOIncrementar,
    alternarComprado,
    obtenerListaTiendaPorEstablecimiento,
    finalizarCompraManual,
  };
}