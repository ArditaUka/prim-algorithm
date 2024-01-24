<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from "@/components/util/Modal.vue";
import HelpView from './HelpView.vue';

const router = useRouter();

const emit = defineEmits(['onNodesClicked']);

let modalVisible = ref(false);

const goToEasyView = () => {
  router.push({name: 'easy'});
}

const goToMediumView = () => {
  router.push({name: 'medium'});
}

const goToHardView = () => {
  router.push({name: 'hard'});
}

const onClose = () => {
  modalVisible.value = false;
}
</script>

<template>
  <div class="home-wrapper bg-white p-10 text-center">
    <h1 class="text-2xl text-slate-800">You like to challenge yourself?</h1>
    <div class="buttons pt-10 flex flex-col items-center">
      <button @click="goToEasyView"
        class="rounded-full bg-zinc-700 hover:bg-zinc-600 text-white mb-4 w-3/5 py-3"
        >
        Easy
      </button>
      <button @click="goToMediumView"
        class="rounded-full bg-zinc-700 hover:bg-zinc-600 text-white mb-4 w-3/5 py-3"
        >Medium
      </button>
      <button @click="goToHardView"
        class="rounded-full bg-zinc-700 hover:bg-zinc-600 text-white mb-4 w-3/5 py-3"
        >
        Hard
      </button>
    </div>
    <div class="info flex justify-between pt-9">
      <p class="text-slate-800">Don't know how it works?</p>
      <a href="#" @click.prevent="modalVisible = true" class="text-cyan-700 hover:text-cyan-600">Work it out here!</a>
    </div>
  </div>
  <Modal :isVisible="modalVisible"
         @onClose="onClose"
         title="Introduction to Prim’s Algorithm"
  >
  <HelpView></HelpView>
  </Modal>
</template>

<style>
.home-wrapper {
  width: 500px;
  height: 420px;
}
</style>
