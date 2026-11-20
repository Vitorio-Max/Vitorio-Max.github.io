<template>
  <div class="min-h-screen flex flex-col bg-slate-50 pb-10">
    <HeaderBar
      tab-activa="lista"
      v-model:modo-lista="modoLista"
      :presupuesto="presupuestoPendiente"
    />

    <main class="flex-1 w-full max-w-lg mx-auto px-4 pt-4">
      <div v-if="cargando" class="text-center py-16 text-slate-400 font-bold">
        Cargando tu despensa y rutas...
      </div>

      <template v-else>
        <ModoCasa v-if="modoLista === 'casa'" />
        <ModoTienda v-else @abrir-escaner="avisoEscaner" />
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductos } from './composables/useProductos';
import { useLista } from './composables/useLista';

import HeaderBar from './components/HeaderBar.vue';
import ModoCasa from './components/ModoCasa.vue';
import ModoTienda from './components/ModoTienda.vue';

const { cargando, cargarDatosBase } = useProductos();
const { presupuestoPendiente, cargarLista } = useLista();

const modoLista = ref('casa');

const avisoEscaner = () => {
  alert('El escáner de tickets con IA lo activaremos en el Bloque 3.');
};

onMounted(async () => {
  await Promise.all([cargarDatosBase(), cargarLista()]);
});
</script>