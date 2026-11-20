<template>
  <div class="space-y-4">
    <!-- Buscador Instantáneo -->
    <div class="relative">
      <input
        v-model="busqueda"
        type="search"
        placeholder="Buscar producto o crear nuevo..."
        class="w-full h-12 pl-4 pr-10 rounded-2xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-base shadow-sm"
      />
      <button
        v-if="busqueda"
        @click="busqueda = ''"
        class="absolute right-3 top-3 text-slate-400 font-bold text-lg px-1"
      >
        ✕
      </button>
    </div>

    <!-- Chips Horizontales por Establecimiento -->
    <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <button
        @click="filtroTienda = 'todas'"
        :class="[
          'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition',
          filtroTienda === 'todas'
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-600 border-slate-200'
        ]"
      >
        Todos ({{ productos.length }})
      </button>
      <button
        v-for="est in establecimientos"
        :key="est.id"
        @click="filtroTienda = est.id"
        :class="[
          'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border flex items-center gap-1.5 transition',
          filtroTienda === est.id
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-700 border-slate-200'
        ]"
      >
        <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: est.color_hex }"></span>
        {{ est.nombre }}
      </button>
    </div>

    <!-- Botón de Creación Rápida al Vuelo si no existe coincidencia exacta -->
    <div
      v-if="busqueda.trim().length > 1 && !existeCoincidenciaExacta"
      class="bg-emerald-50 border-2 border-dashed border-emerald-400 rounded-2xl p-4 space-y-3"
    >
      <button
        v-if="!mostrandoFormRapido"
        @click="abrirCreacionRapida"
        class="w-full py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl shadow active:scale-[0.99] transition"
      >
        + Crear "{{ busqueda.trim() }}" y añadir a la lista
      </button>

      <!-- Formulario compacto al vuelo -->
      <div v-else class="space-y-3">
        <p class="font-bold text-sm text-emerald-950">Nuevo producto: {{ busqueda.trim() }}</p>
        <div class="grid grid-cols-2 gap-2">
          <select
            v-model="nuevoForm.establecimiento_id"
            class="h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium"
          >
            <option v-for="est in establecimientos" :key="est.id" :value="est.id">
              {{ est.nombre }}
            </option>
          </select>

          <select
            v-model="nuevoForm.ubicacion_id"
            class="h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium"
          >
            <option :value="null">Sin pasillo</option>
            <option v-for="u in ubicacionesTiendaSeleccionada" :key="u.id" :value="u.id">
              {{ u.nombre }}
            </option>
          </select>
        </div>

        <div class="flex gap-2">
          <input
            v-model.number="nuevoForm.precio"
            type="number"
            step="0.05"
            placeholder="Precio (€)"
            class="w-1/2 h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm"
          />
          <button
            @click="guardarYAnadir"
            class="w-1/2 h-11 bg-emerald-600 text-white font-bold rounded-xl shadow"
          >
            Guardar +1
          </button>
        </div>
      </div>
    </div>

    <!-- Listado de Tarjetas de Producto -->
    <div class="space-y-2.5">
      <div
        v-for="prod in productosFiltrados"
        :key="prod.id"
        class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-3"
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="text-xl">{{ prod.categoria_icono }}</span>
            <h3 class="font-bold text-slate-900 truncate">{{ prod.nombre }}</h3>
          </div>

          <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span
              v-if="prod.establecimiento"
              class="text-[11px] font-bold text-white px-2 py-0.5 rounded-md"
              :style="{ backgroundColor: prod.establecimiento.color_hex }"
            >
              {{ prod.establecimiento.nombre }}
            </span>
            <span v-if="prod.ubicacion" class="text-xs text-slate-500 font-medium">
              · {{ prod.ubicacion.nombre }}
            </span>
            <span class="text-xs font-extrabold text-slate-800 ml-auto">
              {{ Number(prod.precio).toFixed(2) }} €
            </span>
          </div>
        </div>

        <!-- Control táctil amplio para sumar/restar en lista -->
        <div class="flex items-center gap-1.5 shrink-0">
          <button
            v-if="cantidadesPorProducto[prod.id] > 0"
            @click="anadirOIncrementar(prod.id, -1)"
            class="w-10 h-11 rounded-xl bg-slate-100 text-slate-800 font-black text-lg active:bg-slate-200"
          >
            −
          </button>
          <span
            v-if="cantidadesPorProducto[prod.id] > 0"
            class="w-6 text-center font-black text-emerald-700 text-base"
          >
            {{ cantidadesPorProducto[prod.id] }}
          </span>
          <button
            @click="anadirOIncrementar(prod.id, 1)"
            class="w-12 h-11 rounded-xl bg-emerald-600 text-white font-black text-xl shadow-sm active:scale-95 transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useProductos } from '../composables/useProductos';
import { useLista } from '../composables/useLista';

const { productos, establecimientos, crearProductoRapido } = useProductos();
const { cantidadesPorProducto, anadirOIncrementar } = useLista();

const busqueda = ref('');
const filtroTienda = ref('todas');
const mostrandoFormRapido = ref(false);

const nuevoForm = reactive({
  establecimiento_id: '',
  ubicacion_id: null,
  precio: 0,
});

const ubicacionesTiendaSeleccionada = computed(() => {
  const est = establecimientos.value.find((e) => e.id === nuevoForm.establecimiento_id);
  return est ? est.ubicaciones : [];
});

const productosFiltrados = computed(() => {
  return productos.value.filter((p) => {
    const coincideTienda = filtroTienda.value === 'todas' || p.establecimiento_id === filtroTienda.value;
    const coincideTexto = p.nombre.toLowerCase().includes(busqueda.value.toLowerCase().trim());
    return coincideTienda && coincideTexto;
  });
});

const existeCoincidenciaExacta = computed(() => {
  const q = busqueda.value.toLowerCase().trim();
  return productos.value.some((p) => p.nombre.toLowerCase() === q);
});

const abrirCreacionRapida = () => {
  nuevoForm.establecimiento_id =
    filtroTienda.value !== 'todas' ? filtroTienda.value : (establecimientos.value[0]?.id || '');
  nuevoForm.ubicacion_id = null;
  nuevoForm.precio = 0;
  mostrandoFormRapido.value = true;
};

const guardarYAnadir = async () => {
  const creado = await crearProductoRapido({
    nombre: busqueda.value.trim(),
    establecimiento_id: nuevoForm.establecimiento_id || null,
    ubicacion_id: nuevoForm.ubicacion_id || null,
    precio: nuevoForm.precio || 0,
    categoria_icono: '🛒',
  });
  await anadirOIncrementar(creado.id, 1);
  busqueda.value = '';
  mostrandoFormRapido.value = false;
};
</script>