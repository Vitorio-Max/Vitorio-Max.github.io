<template>
  <div class="space-y-3">
    <p class="text-xs text-slate-500 font-medium">
      Toca cualquier básico para añadir +1 a tu lista de compra.
    </p>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <button
        v-for="prod in basicos"
        :key="prod.id"
        @click="anadirOIncrementar(prod.id, 1)"
        class="relative bg-white border-2 border-slate-200/80 active:border-emerald-500 active:scale-95 rounded-2xl p-4 text-left shadow-sm transition flex flex-col justify-between min-h-[112px]"
      >
        <!-- Badge numérico en esquina superior derecha -->
        <span
          v-if="cantidadesPorProducto[prod.id] > 0"
          class="absolute -top-2 -right-2 bg-emerald-600 text-white font-black text-xs w-7 h-7 rounded-full flex items-center justify-center shadow-md ring-2 ring-white"
        >
          {{ cantidadesPorProducto[prod.id] }}
        </span>

        <span class="text-3xl">{{ prod.categoria_icono }}</span>

        <div class="mt-2">
          <p class="font-bold text-sm text-slate-900 leading-tight line-clamp-2">
            {{ prod.nombre }}
          </p>
          <p class="text-[11px] font-semibold text-slate-400 mt-1">
            {{ prod.establecimiento?.nombre || 'Sin tienda' }} · {{ Number(prod.precio).toFixed(2) }}€
          </p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useProductos } from '../composables/useProductos';
import { useLista } from '../composables/useLista';

const { basicos } = useProductos();
const { cantidadesPorProducto, anadirOIncrementar } = useLista();
</script>