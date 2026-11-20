<template>
  <header class="sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 shadow-md">
    <div class="max-w-lg mx-auto flex items-center justify-between gap-2">
      <!-- Switch Central de Modo (solo visible en pestaña Lista) -->
      <div
        v-if="tabActiva === 'lista'"
        class="flex bg-slate-800 p-1 rounded-xl border border-slate-700"
      >
        <button
          @click="$emit('update:modoLista', 'casa')"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
            modoLista === 'casa'
              ? 'bg-emerald-500 text-slate-950 shadow'
              : 'text-slate-300 hover:text-white'
          ]"
        >
          <span>🏠</span> En Casa
        </button>
        <button
          @click="$emit('update:modoLista', 'tienda')"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
            modoLista === 'tienda'
              ? 'bg-amber-400 text-slate-950 shadow'
              : 'text-slate-300 hover:text-white'
          ]"
        >
          <span>🛒</span> En Tienda
        </button>
      </div>

      <div v-else class="font-extrabold text-base tracking-tight flex items-center gap-2">
        <span v-if="tabActiva === 'basicos'">⭐ Productos Básicos</span>
        <span v-else>📦 Mi Despensa</span>
      </div>

      <!-- Indicador de Presupuesto en Tiempo Real -->
      <div class="text-right bg-slate-800/90 px-3 py-1 rounded-xl border border-slate-700/80">
        <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
          Pendiente
        </span>
        <span class="text-sm font-black text-emerald-400 tabular-nums">
          {{ presupuesto.toFixed(2) }} €
        </span>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  tabActiva: String,
  modoLista: String,
  presupuesto: { type: Number, default: 0 },
});
defineEmits(['update:modoLista']);
</script>