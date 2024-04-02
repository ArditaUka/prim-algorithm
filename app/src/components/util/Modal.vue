<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        isVisible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        }
    });

    const emit = defineEmits(['onClose']);

    let steps = ref(null)
    let tutorial = ref(null)
    let tabName = ref('Steps')

    const trimmedTabName = computed(() => {
        return tabName.value.trim()
    })

    function tabClicked(event) {
        tabName.value = event.currentTarget.innerText
    }

</script>
<template>
    <div v-if="isVisible">
        <div class="fixed inset-0 z-50 flex justify-center items-center">
            <div class="content-wrapper flex-flex-col rounded-lg shadow-lg bg-white overflow-auto">
                <div class="p-5 pb-3">
                    <div class="flex justify-between items-center">
                        <h3 class="text-2xl font-semibold">{{ title }}</h3>
                        <button class="p-1 leading-none" @click="$emit('onClose')">
                            <div class="text-3xl"><span class="mdi mdi-close-box text-slate-500  hover:text-slate-400"></span></div>
                        </button>
                    </div>
                </div>
                <div class="navbar p-6 pt-0 flex">
                    <h3 ref="steps"
                        class="text-l pb-2 hover:cursor-pointer hover:border-b-2"
                        :class="[trimmedTabName === 'Steps' ? 'border-b-2 border-cyan-900' : '']"
                        @click="tabClicked"
                    >
                        Steps
                    </h3>
                    <h3 ref="tutorial"
                        class="ms-8 pb-2 hover:cursor-pointer hover:border-b-2"
                        :class="[trimmedTabName === 'Tutorial' ? 'border-b-2 border-cyan-900' : '']"
                        @click="tabClicked"
                        > 
                        <span class="mdi mdi-play-circle-outline" /> Tutorial
                    </h3>
                </div>
                <div v-if="tabName === 'Steps'"
                    class="p-6 pt-0"
                >
                    <slot></slot>
                </div>
                <div v-else
                    class="px-6"
                >
                    <video autoplay loop>
                        <source src="../../assets/img/tutorial.mov" type="video/mp4">
                    </video>
                </div>
                <div class="p-6 flex justify-end items-center">
                    <button class="bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 border rounded caret-transparent"
                            @click="$emit('onClose')">
                        OK
                    </button>
                </div>
            </div>
        </div>
        <div class="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </div>
</template>
<style>
.content-wrapper {
    max-width: 500px;
    max-height: 520px;
}
</style>