import { ref, computed } from 'vue';
import { api } from '../services/supabase';

const productos = ref([]);
const establecimientos = ref([]);
const cargando = ref(false);

export function useProductos() {
  const cargarDatosBase = async () => {
    cargando.value = true;
    try {
      const [ests, prods] = await Promise.all([
        api.getEstablecimientos(),
        api.getProductos(),
      ]);
      establecimientos.value = ests;
      productos.value = prods;
    } finally {
      cargando.value = false;
    }
  };

  const basicos = computed(() => productos.value.filter((p) => p.es_basico));

  const productosBajoMinimo = computed(() =>
    productos.value.filter((p) => p.stock_actual <= p.stock_minimo)
  );

  const crearProductoRapido = async (nuevoProd) => {
    const creado = await api.crearProducto(nuevoProd);
    productos.value.push(creado);
    productos.value.sort((a, b) => a.nombre.localeCompare(b.nombre));
    return creado;
  };

  const cambiarUbicacionProducto = async (productoId, nuevaUbicacionId, establecimientoId = null) => {
    const payload = { ubicacion_id: nuevaUbicacionId };
    if (establecimientoId) payload.establecimiento_id = establecimientoId;
    const actualizado = await api.actualizarProducto(productoId, payload);
    const idx = productos.value.findIndex((p) => p.id === productoId);
    if (idx !== -1) productos.value[idx] = actualizado;
    return actualizado;
  };

  const crearPasilloYAsignar = async ({ establecimiento_id, nombre, despues_de_orden, productoId }) => {
    const nuevaUbi = await api.crearUbicacion({ establecimiento_id, nombre, despues_de_orden });
    // Refrescar establecimientos para tener los orden_recorrido desplazados al día
    establecimientos.value = await api.getEstablecimientos();
    if (productoId) {
      await cambiarUbicacionProducto(productoId, nuevaUbi.id, establecimiento_id);
    }
    return nuevaUbi;
  };

  return {
    productos,
    establecimientos,
    cargando,
    basicos,
    productosBajoMinimo,
    cargarDatosBase,
    crearProductoRapido,
    cambiarUbicacionProducto,
    crearPasilloYAsignar,
  };
}