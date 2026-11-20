<template>
  <div class="space-y-4 pb-8">
    <!-- Selector Destacado de Establecimiento -->
    <div class="bg-white p-3 rounded-2xl border-2 border-amber-400 shadow-sm">
      <label class="block text-[11px] font-extrabold uppercase tracking-wider text-amber-700 mb-1">
        Supermercado Actual (Ruta Optimizada)
      </label>
      <select
        v-model="tiendaSeleccionadaId"
        class="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 font-extrabold text-base text-slate-900 focus:outline-none"
      >
        <option v-for="est in establecimientos" :key="est.id" :value="est.id">
          🏪 {{ est.nombre }}
        </option>
      </select>
    </div>

    <!-- Estado vacío si no hay nada pendiente en esta tienda -->
    <div
      v-if="rutaTienda.seccionesOrdenadas.length === 0 && rutaTienda.enCarro.length === 0"
      class="text-center py-12 bg-white rounded-2xl border border-slate-200"
    >
      <p class="text-3xl mb-2">🎉</p>
      <p class="font-bold text-slate-700">No tienes productos pendientes en esta tienda</p>
    </div>

    <!-- Secciones Ordenadas Estrictamente por orden_recorrido ASC -->
    <div
      v-for="seccion in rutaTienda.seccionesOrdenadas"
      :key="seccion.ubicacionId"
      class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
    >
      <div class="bg-slate-800 text-white px-4 py-2 flex items-center justify-between">
        <span class="font-extrabold text-xs uppercase tracking-wider">
          {{ seccion.nombre }}
        </span>
        <span class="text-xs bg-slate-700 px-2 py-0.5 rounded-full font-bold">
          {{ seccion.items.length }}
        </span>
      </div>

      <div class="divide-y divide-slate-100">
        <div
          v-for="item in seccion.items"
          :key="item.id"
          class="flex items-center justify-between px-4 py-3.5 active:bg-emerald-50 transition"
        >
          <!-- Área táctil principal para tachar -->
          <button
            @click="alternarComprado(item)"
            class="flex items-center gap-3 flex-1 text-left min-w-0"
          >
            <span class="w-6 h-6 rounded-full border-2 border-slate-300 shrink-0"></span>
            <div class="min-w-0">
              <p class="font-bold text-base text-slate-900 truncate">
                <span class="text-emerald-600 font-black mr-1">{{ item.cantidad }}x</span>
                {{ item.producto.nombre }}
              </p>
              <p class="text-xs text-slate-500">
                {{ (Number(item.producto.precio) * item.cantidad).toFixed(2) }} €
              </p>
            </div>
          </button>

          <!-- Botón Estrella: Ordenar sobre la marcha (📍) -->
          <button
            @click.stop="abrirEditorUbicacion(item.producto)"
            title="Cambiar pasillo"
            class="ml-2 w-10 h-10 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 flex items-center justify-center shrink-0 active:scale-90 transition"
          >
            📍
          </button>
        </div>
      </div>
    </div>

    <!-- Sección Colapsable: En el Carro -->
    <div
      v-if="rutaTienda.enCarro.length > 0"
      class="bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden"
    >
      <button
        @click="carroExpandido = !carroExpandido"
        class="w-full px-4 py-3 flex items-center justify-between font-bold text-sm text-slate-600"
      >
        <span>🛒 En el carro ({{ rutaTienda.enCarro.length }})</span>
        <span>{{ carroExpandido ? '▲' : '▼' }}</span>
      </button>

      <div v-if="carroExpandido" class="divide-y divide-slate-200/70 border-t border-slate-200">
        <button
          v-for="item in rutaTienda.enCarro"
          :key="item.id"
          @click="alternarComprado(item)"
          class="w-full px-4 py-3 flex items-center gap-3 text-left opacity-60"
        >
          <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
            ✓
          </span>
          <span class="line-through font-medium text-slate-700">
            {{ item.cantidad }}x {{ item.producto.nombre }}
          </span>
        </button>
      </div>
    </div>

    <!-- Cierre de Compra en Caja -->
    <div class="grid grid-cols-1 gap-2.5 pt-2">
      <button
        v-if="rutaTienda.enCarro.length > 0"
        @click="procesarCierreManual"
        class="w-full py-3.5 px-4 bg-slate-900 text-white font-extrabold rounded-2xl shadow-md active:scale-[0.99] transition flex items-center justify-center gap-2"
      >
        <span>✅</span> Finalizar compra manual ({{ rutaTienda.enCarro.length }})
      </button>

      <button
        @click="$emit('abrirEscaner')"
        class="w-full py-3.5 px-4 bg-emerald-600 text-white font-extrabold rounded-2xl shadow-md active:scale-[0.99] transition flex items-center justify-center gap-2"
      >
        <span>📸</span> Escanear Ticket con IA
      </button>
    </div>

    <!-- Bottom Sheet para mover producto de pasillo en vivo -->
    <BottomSheetUbicacion
      v-if="productoEditando"
      :producto="productoEditando"
      :establecimiento="tiendaActualObj"
      @cerrar="productoEditando = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { useProductos } from '../composables/useProductos';
import { useLista } from '../composables/useLista';
import BottomSheetUbicacion from './BottomSheetUbicacion.vue';

defineEmits(['abrirEscaner']);

const { establecimientos } = useProductos();
const {
  alternarComprado,
  obtenerListaTiendaPorEstablecimiento,
  finalizarCompraManual,
} = useLista();

const tiendaSeleccionadaId = ref('');
const carroExpandido = ref(false);
const productoEditando = ref(null);

watchEffect(() => {
  if (!tiendaSeleccionadaId.value && establecimientos.value.length > 0) {
    tiendaSeleccionadaId.value = establecimientos.value[0].id;
  }
});

const tiendaActualObj = computed(() =>
  establecimientos.value.find((e) => e.id === tiendaSeleccionadaId.value)
);

const rutaTienda = computed(() =>
  obtenerListaTiendaPorEstablecimiento(tiendaSeleccionadaId.value)
);

const abrirEditorUbicacion = (producto) => {
  productoEditando.value = producto;
};

const procesarCierreManual = async () => {
  await finalizarCompraManual(tiendaSeleccionadaId.value);
};
</script>