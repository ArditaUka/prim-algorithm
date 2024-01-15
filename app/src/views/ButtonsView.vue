<script setup>
    import { onMounted} from 'vue';

    const props = defineProps({
        isTreeCompleted: {
            type: Boolean,
            default: false
        }
    });

    const emit = defineEmits(['onGoBack', 'onNewGraph', 'onSubmit']);

    onMounted(() => {});
</script>

<template>
    <div class="buttons flex justify-around items-center w-full px-12">
        <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded caret-transparent"
                @click="$emit('onGoBack')">
            Go back
        </button>
        <button class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow caret-transparent"
                :class="{'opacity-50 cursor-auto': isTreeCompleted}"
                @click="$emit('onNewGraph')">
            New graph
        </button>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded caret-transparent"
                :class="{'opacity-50 cursor-auto': !isTreeCompleted}"
                @click="$emit('onSubmit')">
            Submit
        </button>
    </div>
</template>