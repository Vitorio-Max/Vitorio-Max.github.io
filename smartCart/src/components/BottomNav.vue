<template>
  <nav class="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
    <div class="max-w-lg mx-auto grid grid-cols-3 h-16">
      <button
        @click="$emit('update:tabActiva', 'lista')"
        :class="btnClass('lista')"
      >
        <span class="text-xl leading-none">🛒</span>
        <span class="text-xs font-bold mt-1">Lista</span>
        <span
          v-if="totalPendientes > 0"
          class="absolute top-1.5 right-1/4 bg-emerald-600 text-white text-[10px] font-black px-1.5 rounded-full"
        >
          {{ totalPendientes }}
        </span>
      </button>

      <button
        @click="$emit('update:tabActiva', 'basicos')"
        :class="btnClass('basicos')"
      >
        <span class="text-xl leading-none">⭐</span>
        <span class="text-xs font-bold mt-1">Básicos</span>
      </button>

      <button
        @click="$emit('update:tabActiva', 'despensa')"
        :class="btnClass('despensa')"
      >
        <span class="text-xl leading-none">📦</span>
        <span class="text-xs font-bold mt-1">Despensa</span>
        <span
          v-if="alertasStock > 0"
          class="absolute top-1.5 right-1/4 bg-rose-600 text-white text-[10px] font-black px-1.5 rounded-full"
        >
          {{ alertasStock }}
        </span>
      </button>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  tabActiva: String,
  totalPendientes: Number,
  alertasStock: Number,
});
defineEmits(['update:tabActiva']);

const btnClass = (tab) => [
  'relative flex flex-col items-center justify-center transition-colors active:bg-slate-100',
  props.tabActiva === tab ? 'text-emerald-600' : 'text-slate-500',
];
</script>