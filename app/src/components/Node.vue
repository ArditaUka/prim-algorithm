<script setup>
    import { onMounted, ref, computed } from 'vue';

    const props = defineProps({
        content: {
            type: Number,
            default: 0
        },
        width: {
            type: String,
            default: "48"
        },
        height: {
            type: String,
            default: "48"
        },
        textSize: {
            type: String,
            default: "20"
        },
        customStyle: {
            type: String,
            default: ""
        }
    });

    const emit = defineEmits(['onNodeClicked']);

    const width = computed(() => props.width);
    const height = computed(() => props.height);
    const textSize = computed(() => props.textSize);

    const nodeRef = ref(null);

    function onNodeClicked(event) {
        emit('onNodeClicked', event)
    }

    defineExpose({
        nodeRef
    });

    onMounted(() => {});
</script>

<template>
    <div ref="nodeRef" 
        class="rounded-full bg-cyan-900 flex justify-center items-center cursor-pointer"
        :class="[customStyle]"
        :style="{width:`${width}px`, height:`${height}px`}"
        @click="onNodeClicked">
        <p class="text-white caret-transparent"
           :style="{fontSize:`${textSize}px`}">
            {{ content }}
        </p>
    </div>
</template>