<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

let points = ref(0);
let mistakes = ref(0);

let comment = ref("");
let description = ref("");

const accuracy = computed(() => (points.value/120) * 100);

function onGoHome() {
    router.push({name: 'home'});
}

function getTextContent() {
    if (accuracy.value === 100) {
        comment = "Perfectly done!";
        description = "You made no mistakes in this graph";
    } 
    else if (accuracy.value >= 50 && accuracy.value < 100) {
        comment = "Well done!";
        description = "You performed well. Keep it up!"
    }
    else if (accuracy.value < 50 && accuracy.value >= 0) {
        comment = "Room for growth!"
        description = "Keep practicing, and you'll see progress"
    }
}

function initialize() {
    points.value = localStorage.getItem('points');
    mistakes.value = localStorage.getItem('mistakes');
    getTextContent();
    console.log(comment.value);
}

onMounted(() => {
        initialize();
    });

onUnmounted(() => {
    localStorage.removeItem('points');
    localStorage.removeItem('mistakes');
});
</script>
<template>
    <div class="result-wrapper bg-white">
        <div class="back caret-transparent flex items-center cursor-pointer"
            @click="onGoHome">
            <span class="mdi mdi-arrow-left text-2xl"></span> Home
        </div>
        <div class="bulb-wrapper flex items-center justify-center">
            <span class="mdi mdi-lightbulb-on-outline caret-transparent"></span>
        </div>
        <div class="desc-wrapper">
            <h1 class="text-3xl text-center caret-transparent">{{comment}}</h1>
            <p class="text-zinc-500 text-center caret-transparent">{{description}}</p>
        </div>
        <div class="details-wrapper flex items-center justify-between">
            <div class="detail-wrapper points flex flex-col items-center justify-center">
                <p class="text-white caret-transparent">Total points</p>
                <div><span class="mdi mdi-star-four-points caret-transparent"></span>{{points}}</div>
            </div>
            <div class="detail-wrapper mistakes flex flex-col items-center justify-center">
                <p class="text-white caret-transparent">Mistakes</p>
                <div><span class="mdi mdi-alert-rhombus-outline caret-transparent"></span>{{mistakes}}</div>
            </div>
            <div class="detail-wrapper accuracy flex flex-col items-center justify-center caret-transparent">
                <p class="text-white caret-transparent">Accuracy</p>
                <div><span class="mdi mdi-percent-outline caret-transparent"></span>{{ parseFloat(accuracy).toFixed(2) }}</div>
            </div>
        </div>
    </div>

</template>
<style>
.result-wrapper {
    position: relative;
    width: 500px;
    height: 420px;
}

.back {
    position: absolute;
}

.back span {
    padding: 5px 5px 5px 10px;
}

.bulb-wrapper {
    height: 45%;
}

.bulb-wrapper span {
    font-size: 124px;
    line-height: 124px;
    color: #F5C001;
}

.desc-wrapper {
    padding: 0 20px 20px 20px;
}

.desc-wrapper h1 {
    margin-bottom: 4px;
}

.desc-wrapper p {
    font-size: 22px;
}

.detail-wrapper {
    border-radius: 16px;
    font-weight: bold;
    padding-top: 0;
    width: 122px;
}

.detail-wrapper.points {
    border: 1px solid #F5C001;
    color: #F5C001;
}

.detail-wrapper.points p {
    background-color: #F5C001;
}

.detail-wrapper.mistakes {
    border: 1px solid #FF7070;
    color: #FF5252;
}

.detail-wrapper.mistakes p {
    background-color: #FF7070;
}

.detail-wrapper.accuracy {
    border: 1px solid #58CC02;
    color: #58A700;
}

.detail-wrapper.accuracy p {
    background-color: #58CC02;
}

.detail-wrapper p {
    border-radius: 16px 16px 0 0;
    padding: 2px 15px;
    width: 100%;
    text-align: center;
}

.detail-wrapper div {
    padding: 10px 20px;
    font-size: 18px;
}

.detail-wrapper span {
    padding-right: 4px;
}

.details-wrapper {
    margin: 25px 30px;
}

</style>