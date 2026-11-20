<template>
  <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div class="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
      <!-- Cabecera Modal -->
      <div class="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
        <h2 class="font-extrabold text-base flex items-center gap-2">
          <span>🧾</span> Escáner Inteligente de Ticket
        </h2>
        <button @click="$emit('cerrar')" class="w-8 h-8 rounded-full bg-slate-800 font-bold">✕</button>
      </div>

      <!-- Contenido Scrollable -->
      <div class="p-5 overflow-y-auto space-y-4 flex-1">
        <!-- Paso 1: Captura con Cámara Trasera -->
        <div v-if="!ticketAnalizado && !procesando" class="text-center py-6 space-y-4">
          <div class="w-20 h-20 mx-auto bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-4xl">
            📸
          </div>
          <div>
            <h3 class="font-extrabold text-lg text-slate-900">Haz una foto al ticket</h3>
            <p class="text-sm text-slate-500 mt-1">
              Gemini extraerá los productos, detectará subidas de precio y sumará el stock a tu despensa.
            </p>
          </div>

          <label class="block w-full py-4 bg-emerald-600 text-white font-extrabold rounded-2xl shadow-lg cursor-pointer active:scale-[0.99] transition">
            Abrir Cámara / Subir Ticket
            <input
              type="file"
              accept="image/*"
              capture="environment"
              class="hidden"
              @change="onFileSelected"
            />
          </label>

          <p v-if="errorEscaner" class="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl">
            {{ errorEscaner }}
          </p>
        </div>

        <!-- Paso 2: Cargando IA -->
        <div v-if="procesando" class="text-center py-12 space-y-3">
          <div class="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="font-extrabold text-slate-800">Analizando ticket con Gemini 2.5 Flash...</p>
          <p class="text-xs text-slate-500">Normalizando abreviaturas y cruzando precios</p>
        </div>

        <!-- Paso 3: Revisión y Matching -->
        <div v-if="ticketAnalizado && !procesando" class="space-y-4">
          <div class="bg-slate-100 p-3 rounded-xl flex items-center justify-between gap-2">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-500 block">Tienda Detectada</span>
              <span class="font-extrabold text-sm text-slate-900">
                {{ ticketAnalizado.establecimiento_detectado }} ({{ ticketAnalizado.fecha }})
              </span>
            </div>
            <select
              v-model="establecimientoDetectadoId"
              class="h-9 px-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
            >
              <option v-for="est in establecimientos" :key="est.id" :value="est.id">
                {{ est.nombre }}
              </option>
            </select>
          </div>

          <!-- Lista de artículos clasificados -->
          <div class="space-y-2.5">
            <div
              v-for="linea in lineasActivas"
              :key="linea.uid"
              :class="[
                'p-3 rounded-2xl border-2 space-y-2',
                linea.tipo === 'existente'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-amber-50/50 border-amber-300'
              ]"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <span
                    :class="[
                      'text-[10px] font-black uppercase px-2 py-0.5 rounded-md',
                      linea.tipo === 'existente'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 text-slate-950'
                    ]"
                  >
                    {{ linea.tipo === 'existente' ? '🟢 En Catálogo' : '🟡 Nuevo Producto' }}
                  </span>

                  <input
                    v-model="linea.nombre"
                    type="text"
                    class="w-full mt-1 font-bold text-sm text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:outline-none"
                  />
                </div>

                <!-- Botón Descartar (bolsas, descuentos, etc.) -->
                <button
                  @click="descartarLinea(linea.uid)"
                  class="w-7 h-7 rounded-lg bg-slate-200/70 text-slate-600 font-bold text-xs shrink-0"
                  title="Ignorar línea"
                >
                  ✕
                </button>
              </div>

              <!-- Cantidad, Precio y Comparativa -->
              <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span class="font-extrabold text-slate-700">
                  Cant: +{{ linea.cantidad }} · {{ linea.precioNuevo.toFixed(2) }} €/ud
                </span>

                <!-- Alerta de cambio de precio en productos existentes -->
                <label
                  v-if="linea.tipo === 'existente' && linea.precioCambio"
                  class="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-amber-300 font-bold text-amber-800"
                >
                  <input type="checkbox" v-model="linea.actualizarPrecio" class="accent-emerald-600" />
                  <span>{{ linea.precioAnterior.toFixed(2) }}€ → {{ linea.precioNuevo.toFixed(2) }}€</span>
                </label>

                <!-- Selector rápido de pasillo para productos nuevos -->
                <select
                  v-if="linea.tipo === 'nuevo'"
                  v-model="linea.ubicacionId"
                  class="h-8 px-2 rounded-lg border border-amber-300 bg-white text-xs font-semibold"
                >
                  <option value="">Asignar pasillo...</option>
                  <option v-for="u in ubicacionesEstablecimientoActual" :key="u.id" :value="u.id">
                    {{ u.nombre }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pie de Acción -->
      <div v-if="ticketAnalizado && !procesando" class="p-4 border-t border-slate-200 bg-slate-50">
        <button
          :disabled="guardando || lineasActivas.length === 0"
          @click="guardarTodo"
          class="w-full py-3.5 bg-slate-900 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-lg"
        >
          {{ guardando ? 'Actualizando Despensa...' : `Confirmar y Guardar (${lineasActivas.length} artículos)` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useProductos } from '../composables/useProductos';
import { useEscanerTicket } from '../composables/useEscanerTicket';

const emit = defineEmits(['cerrar']);
const { establecimientos } = useProductos();
const {
  procesando,
  guardando,
  errorEscaner,
  ticketAnalizado,
  lineasRevision,
  establecimientoDetectadoId,
  analizarFotoTicket,
  descartarLinea,
  confirmarYGuardarLote,
} = useEscanerTicket();

const lineasActivas = computed(() =>
  lineasRevision.value.filter((l) => l.tipo !== 'descartado')
);

const ubicacionesEstablecimientoActual = computed(() => {
  const est = establecimientos.value.find((e) => e.id === establecimientoDetectadoId.value);
  return est ? est.ubicaciones : [];
});

const onFileSelected = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    await analizarFotoTicket(file);
  }
};

const guardarTodo = async () => {
  await confirmarYGuardarLote();
  emit('cerrar');
};
</script>