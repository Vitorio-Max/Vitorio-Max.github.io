import { ref } from 'vue';
import { api } from '../services/supabase';
import { useProductos } from './useProductos';
import { useLista } from './useLista';

// Normaliza texto para fuzzy matching sin acentos ni mayúsculas
const normalizarTexto = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

// Comprime la foto de cámara móvil a max 1280px JPEG para subida ultrarrápida
function comprimirImagen(file, maxWidth = 1280, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useEscanerTicket() {
  const { productos, establecimientos, cargarDatosBase } = useProductos();
  const { itemsLista, cargarLista } = useLista();

  const procesando = ref(false);
  const guardando = ref(false);
  const errorEscaner = ref(null);
  const ticketAnalizado = ref(null);
  const lineasRevision = ref([]);
  const establecimientoDetectadoId = ref('');

  const analizarFotoTicket = async (file) => {
    procesando.value = true;
    errorEscaner.value = null;
    ticketAnalizado.value = null;

    try {
      const base64Comprimido = await comprimirImagen(file);
      const resultado = await api.invocarProcesarTicket(base64Comprimido, 'image/jpeg');
      ticketAnalizado.value = resultado;

      // Intentar emparejar establecimiento detectado
      const estMatch = establecimientos.value.find((e) =>
        normalizarTexto(resultado.establecimiento_detectado || '').includes(normalizarTexto(e.nombre))
      );
      establecimientoDetectadoId.value = estMatch ? estMatch.id : (establecimientos.value[0]?.id || '');

      // Cruce inteligente (Matching) con catálogo existente
      lineasRevision.value = (resultado.items || []).map((item, idx) => {
        const normIA = normalizarTexto(item.nombre_normalizado);
        const matchDB = productos.value.find((p) => {
          const normDB = normalizarTexto(p.nombre);
          return normDB === normIA || normDB.includes(normIA) || normIA.includes(normDB);
        });

        if (matchDB) {
          const precioCambio = Math.abs(Number(matchDB.precio) - Number(item.precio_unitario)) >= 0.01;
          return {
            uid: `line-${idx}`,
            tipo: item.es_descartable ? 'descartado' : 'existente',
            productoDB: matchDB,
            nombre: matchDB.nombre,
            cantidad: item.cantidad || 1,
            precioAnterior: Number(matchDB.precio),
            precioNuevo: Number(item.precio_unitario),
            precioCambio,
            actualizarPrecio: precioCambio, // Marcado por defecto si cambió
            ubicacionId: matchDB.ubicacion_id,
          };
        } else {
          return {
            uid: `line-${idx}`,
            tipo: item.es_descartable ? 'descartado' : 'nuevo',
            productoDB: null,
            nombre: item.nombre_normalizado,
            cantidad: item.cantidad || 1,
            precioAnterior: null,
            precioNuevo: Number(item.precio_unitario),
            precioCambio: false,
            actualizarPrecio: false,
            ubicacionId: estMatch?.ubicaciones?.[0]?.id || '',
          };
        }
      });
    } catch (err) {
      errorEscaner.value = err.message || 'Error al analizar el ticket con IA.';
    } finally {
      procesando.value = false;
    }
  };

  const descartarLinea = (uid) => {
    const linea = lineasRevision.value.find((l) => l.uid === uid);
    if (linea) linea.tipo = 'descartado';
  };

  const confirmarYGuardarLote = async () => {
    guardando.value = true;
    try {
      const activas = lineasRevision.value.filter((l) => l.tipo !== 'descartado');
      const idsProductosProcesados = [];

      for (const linea of activas) {
        if (linea.tipo === 'existente' && linea.productoDB) {
          const nuevoStock = (linea.productoDB.stock_actual || 0) + linea.cantidad;
          const updates = { stock_actual: nuevoStock };
          if (linea.actualizarPrecio) {
            updates.precio = linea.precioNuevo;
          }
          await api.actualizarProducto(linea.productoDB.id, updates);
          idsProductosProcesados.push(linea.productoDB.id);
        } else if (linea.tipo === 'nuevo') {
          const creado = await api.crearProducto({
            nombre: linea.nombre,
            precio: linea.precioNuevo,
            unidad_medida: 'ud',
            categoria_icono: '🛍️',
            establecimiento_id: establecimientoDetectadoId.value || null,
            ubicacion_id: linea.ubicacionId || null,
            stock_actual: linea.cantidad,
            stock_minimo: 1,
          });
          idsProductosProcesados.push(creado.id);
        }
      }

      // Limpiar de la lista de compra los artículos que venían en el ticket
      const itemsListaABorrar = itemsLista.value
        .filter((i) => idsProductosProcesados.includes(i.producto_id))
        .map((i) => i.id);

      await api.eliminarItemsLista(itemsListaABorrar);
      await Promise.all([cargarDatosBase(), cargarLista()]);
    } finally {
      guardando.value = false;
    }
  };

  return {
    procesando,
    guardando,
    errorEscaner,
    ticketAnalizado,
    lineasRevision,
    establecimientoDetectadoId,
    analizarFotoTicket,
    descartarLinea,
    confirmarYGuardarLote,
  };
}