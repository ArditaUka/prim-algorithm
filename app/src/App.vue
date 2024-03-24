<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router'

let listOfNodes = ref([]);

function onNodesClicked(params) {
  listOfNodes.value = params;
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div class="flex mb-8 ml-2 mt-2 flex-wrap">
        <div v-for="n in listOfNodes"
            class="l-nodes px-3 py-2 mb-2 bg-orange-300 font-medium text-cyan-950 mr-4 rounded-3xl"
        >
          [{{ n[0] }}, {{ n[1] }}] -> {{ n[2] }}
        </div>
      </div>
      <h1 class="text-3xl text-center w-2/5 mb-8"
          :class="{'-mt-10' : listOfNodes.length == 0}"
      >
        Prim's Algorithm
      </h1>
      <RouterView @onNodesClicked="onNodesClicked"/>
    </div>
</template>

<style>
.l-nodes {
  text-wrap: nowrap;
}
</style>
