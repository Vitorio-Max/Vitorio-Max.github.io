<template>
  <div class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-xs" @click.self="$emit('cerrar')">
    <div class="w-full max-w-lg bg-white rounded-t-3xl p-5 space-y-4 shadow-2xl animate-slide-up">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span class="text-[11px] font-bold uppercase text-amber-600">Reubicar en tienda</span>
          <h3 class="font-extrabold text-lg text-slate-900">{{ producto.nombre }}</h3>
        </div>
        <button @click="$emit('cerrar')" class="w-9 h-9 rounded-full bg-slate-100 font-bold">✕</button>
      </div>

      <!-- Listado de pasillos existentes ordenados -->
      <div class="max-h-60 overflow-y-auto space-y-2">
        <button
          v-for="ubi in establecimiento?.ubicaciones || []"
          :key="ubi.id"
          @click="seleccionarUbicacion(ubi.id)"
          :class="[
            'w-full p-3.5 rounded-xl border text-left font-bold flex items-center justify-between transition',
            producto.ubicacion_id === ubi.id
              ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
              : 'border-slate-200 hover:bg-slate-50 text-slate-800'
          ]"
        >
          <span>{{ ubi.nombre }}</span>
          <span class="text-xs text-slate-400">Orden #{{ ubi.orden_recorrido }}</span>
        </button>
      </div>

      <!-- Crear nueva ubicación intercalada -->
      <div class="pt-2 border-t border-slate-200 space-y-2.5">
        <p class="text-xs font-extrabold uppercase text-slate-500">+ Crear pasillo nuevo</p>
        <input
          v-model="nuevoNombre"
          type="text"
          placeholder="Ej. Pasillo 3 - Aceites y Conservas"
          class="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm"
        />
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-600 shrink-0">Va después de:</span>
          <select
            v-model.number="despuesDeOrden"
            class="flex-1 h-10 px-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          >
            <option :value="0">Al principio de la tienda</option>
            <option
              v-for="ubi in establecimiento?.ubicaciones || []"
              :key="ubi.id"
              :value="ubi.orden_recorrido"
            >
              {{ ubi.nombre }}
            </option>
          </select>
        </div>
        <button
          :disabled="!nuevoNombre.trim()"
          @click="crearYAsignar"
          class="w-full py-3 bg-slate-900 disabled:opacity-40 text-white font-bold rounded-xl text-sm"
        >
          Crear pasillo y mover producto aquí
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useProductos } from '../composables/useProductos';

const props = defineProps({
  producto: Object,
  establecimiento: Object,
});
const emit = defineEmits(['cerrar']);

const { cambiarUbicacionProducto, crearPasilloYAsignar } = useProductos();

const nuevoNombre = ref('');
const despuesDeOrden = ref(props.establecimiento?.ubicaciones?.length || 0);

const seleccionarUbicacion = async (ubicacionId) => {
  await cambiarUbicacionProducto(props.producto.id, ubicacionId);
  emit('cerrar');
};

const crearYAsignar = async () => {
  if (!nuevoNombre.value.trim()) return;
  await crearPasilloYAsignar({
    establecimiento_id: props.establecimiento.id,
    nombre: nuevoNombre.value.trim(),
    despues_de_orden: despuesDeOrden.value,
    productoId: props.producto.id,
  });
  emit('cerrar');
};
</script>