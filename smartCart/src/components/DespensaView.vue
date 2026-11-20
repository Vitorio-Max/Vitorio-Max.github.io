<template>
  <div class="space-y-4">
    <!-- Botón Superior Destacado: Importar Ticket -->
    <button
      @click="$emit('abrirEscaner')"
      class="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition"
    >
      <span class="text-xl">📸</span> Importar Ticket con IA (Actualizar Stock y Precios)
    </button>

    <!-- Listado de Inventario -->
    <div class="space-y-2.5">
      <div
        v-for="prod in productosOrdenadosPorAlerta"
        :key="prod.id"
        :class="[
          'p-3.5 rounded-2xl border-2 transition flex items-center justify-between gap-3',
          prod.stock_actual <= prod.stock_minimo
            ? 'bg-rose-50/70 border-rose-300'
            : 'bg-white border-slate-200/80'
        ]"
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="text-xl">{{ prod.categoria_icono }}</span>
            <h3 class="font-bold text-slate-900 truncate">{{ prod.nombre }}</h3>
          </div>

          <div class="mt-1.5 flex items-center gap-2">
            <span
              :class="[
                'text-xs font-extrabold px-2 py-0.5 rounded-md',
                prod.stock_actual <= prod.stock_minimo
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              ]"
            >
              Stock: {{ prod.stock_actual }} (Mín: {{ prod.stock_minimo }})
            </span>

            <button
              v-if="prod.stock_actual <= prod.stock_minimo"
              @click="reponer(prod)"
              class="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg active:scale-95 transition"
            >
              + Reponer a lista
            </button>
          </div>
        </div>

        <!-- Controles rápidos - / + de consumo en casa -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="ajustarStock(prod, -1)"
            class="w-10 h-10 rounded-xl bg-white border border-slate-300 font-black text-lg text-slate-800 active:bg-slate-100"
          >
            −
          </button>
          <span class="w-6 text-center font-black text-base text-slate-900">
            {{ prod.stock_actual }}
          </span>
          <button
            @click="ajustarStock(prod, 1)"
            class="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-lg active:scale-95"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDespensa } from '../composables/useDespensa';

defineEmits(['abrirEscaner']);
const { productos, ajustarStock, reponerEnLista } = useDespensa();

// Mostrar primero los productos bajo mínimo
const productosOrdenadosPorAlerta = computed(() => {
  return [...productos.value].sort((a, b) => {
    const alertaA = a.stock_actual <= a.stock_minimo ? 0 : 1;
    const alertaB = b.stock_actual <= b.stock_minimo ? 0 : 1;
    return alertaA - alertaB || a.nombre.localeCompare(b.nombre);
  });
});

const reponer = async (prod) => {
  await reponerEnLista(prod);
};
</script>