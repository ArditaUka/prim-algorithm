<script setup>
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
                <div class="p-6 pt-0">
                    <slot></slot>
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