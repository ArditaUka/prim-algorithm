<script setup>
    import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useGraph } from '@/composables/graph'
    import Node from "@/components/Node.vue";
    import ButtonsView from "./ButtonsView.vue";
    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';

    const router = useRouter();

    //setting the maximum of edges to be added between 8 nodes equal to 13 and we're going to set the minimum to 9
    let numOfEdges = Math.floor(Math.random() * (13 - 9 + 1)) + 9;

    let graph = ref([
        [0, 0, 0, undefined, undefined, undefined, undefined, undefined],
        [0, 0, 0, 0, undefined, undefined, 0, undefined],
        [0, 0, 0, undefined, 0, 0, undefined, undefined],
        [undefined, 0, undefined, 0, 0, 0, undefined, undefined],
        [undefined, undefined, 0, 0, 0, undefined, 0, undefined],
        [undefined, undefined, 0, 0, undefined, 0, 0, 0],
        [undefined, 0, undefined, undefined, 0, 0, 0, 0],
        [undefined, undefined, undefined, undefined, undefined, 0, 0, 0]
    ]);
    let tree = ref([]);
    let points = 120;
    let mistakes = 0;

    let th0 = ref(null);
    let th1 = ref(null);
    let th2 = ref(null);
    let th3 = ref(null);
    let th4 = ref(null);
    let th5 = ref(null);
    let th6 = ref(null);
    let th7 = ref(null);

    let th0Style = ref("");
    let th1Style = ref("");
    let th2Style = ref("");
    let th3Style = ref("");
    let th4Style = ref("");
    let th5Style = ref("");
    let th6Style = ref("");
    let th7Style = ref("");

    let clickedNodes = ref([]);
    let clickedNodesInfo = ref([]);

    const areTwoNodesClicked = computed(() => clickedNodes.value.length === 2);
    const isTreeCompleted = computed(() => tree.value.length === 0 && !(th0Style.value == "" && th1Style.value == "" && th2Style.value == "" && th3Style.value == "" && th4Style.value == "" && th5Style.value == "" && th6Style.value == "" && th7Style.value == ""));

    const emit = defineEmits(['onNodesClicked']);

    /********************************************** WATCHERS **************************************************/
    watch(areTwoNodesClicked, () => {
        if (areTwoNodesClicked.value) {
            const x = parseInt(clickedNodes.value[0].innerText);
            const y = parseInt(clickedNodes.value[1].innerText);

            setNodeData(x, y);

            emit('onNodesClicked', clickedNodesInfo.value);

            clickedNodes.value[0].classList.remove('bg-orange-500');
            clickedNodes.value[1].classList.remove('bg-orange-500');
            clickedNodes.value = [];
        }
    });

    watch(isTreeCompleted, () => {
        if (isTreeCompleted.value) {
            th0.value.nodeRef.classList.add('opacity-80');
            th1.value.nodeRef.classList.add('opacity-80');
            th2.value.nodeRef.classList.add('opacity-80');
            th3.value.nodeRef.classList.add('opacity-80');
            th4.value.nodeRef.classList.add('opacity-80');
            th5.value.nodeRef.classList.add('opacity-80');
            th6.value.nodeRef.classList.add('opacity-80');
            th7.value.nodeRef.classList.add('opacity-80');

            th0.value.nodeRef.classList.remove('cursor-pointer');
            th1.value.nodeRef.classList.remove('cursor-pointer');
            th2.value.nodeRef.classList.remove('cursor-pointer');
            th3.value.nodeRef.classList.remove('cursor-pointer');
            th4.value.nodeRef.classList.remove('cursor-pointer');
            th5.value.nodeRef.classList.remove('cursor-pointer');
            th6.value.nodeRef.classList.remove('cursor-pointer');
            th7.value.nodeRef.classList.remove('cursor-pointer');
        }
    });
    /*********************************************END OF WATCHERS***********************************************/

    /*--------------------------SET NODE DATA-------------------------------*/
    function setNodeData(x, y, w = null) {
        //considering each node with each node, the style will be added or the weight will be checked based on the received nodes(x, y)
        switch (true) {
            case ((x === 0 && y === 1) || (x === 1 && y === 0)):
                setStyleOrCheckWeight(th0Style, th0, w, 'side negative parent', null, '', th0, x, y);
                break;
            case ((x === 0 && y === 2) || (x === 2 && y === 0)):
                setStyleOrCheckWeight(th0Style, th0, w, 'side positive parent', null, '', th0, x, y, '-diagonal');
                break;
            case ((x === 1 && y === 3) || (x === 3 && y === 1)):
                setStyleOrCheckWeight(th1Style, th1, w, 'source source-1', null, '', th1, x, y);
                break;
            case ((x === 1 && y === 6) || (x === 6 && y === 1)):
                setStyleOrCheckWeight(th1Style, th6, w, 'node-diagonal positive', th6Style, 'node-diagonal node-number positive', th1, x, y, '-diagonal');
                break;
            case ((x === 1 && y === 2) || (x === 2 && y === 1)):
                setStyleOrCheckWeight(th2Style, th2, w, 'node-top', null, '', th2, x, y);
                break;
            case ((x === 2 && y === 5) || (x === 5 && y === 2)):
                setStyleOrCheckWeight(th5Style, th2, w, 'node-diagonal negative', th2Style, 'node-diagonal node-number negative', th5, x, y, '-diagonal');
                break;
            case ((x === 3 && y === 5) || (x === 5 && y === 3)):
                setStyleOrCheckWeight(th3Style, th3, w, 'source source-2', null, '', th3, x, y);
                break;
            case ((x === 3 && y === 4) || (x === 4 && y === 3)):
                setStyleOrCheckWeight(th4Style, th3, w, 'st-top', th3Style, 'st-top node-number plain', th4, x, y, '-diagonal');
                break;
            case ((x === 4 && y === 2) || (x === 2 && y === 4)):
                setStyleOrCheckWeight(th4Style, th4, w, 'node-left st-left', null, '', th4, x, y);
                break;
            case ((x === 5 && y === 6) || (x === 6 && y === 5)):
                setStyleOrCheckWeight(th5Style, th5, w, 'node-bottom', null, '', th5, x, y);
                break;
            case ((x === 6 && y === 4) || (x === 4 && y === 6)):
                setStyleOrCheckWeight(th6Style, th6, w, 'node-left nd-left', null, '', th6, x, y);
                break;
            case ((x === 7 && y === 5) || (x === 5 && y === 7)):
                setStyleOrCheckWeight(th7Style, th7, w, 'side negative tail', null, '', th7, x, y);
                break;
            case ((x === 7 && y === 6) || (x === 6 && y === 7)):
                setStyleOrCheckWeight(th7Style, th7, w, 'side positive tail', null, '', th7, x, y, '-diagonal');
                break;
            default:
                break;
        }
    }

    function setStyleOrCheckWeight(elStyleRef, wRef, w, elStyle, diagonalStyleRef, diagonalStyle, borderRef, x, y, diagonal = '') {
        //when weight(w) is not null it is the initial state, where we draw the borders and weights
        //otherwise, when the weight is null, it means that two nodes have been clicked and we need... 
        //...to check if the selected edge is the correct one
        if (w) {
            setStyle(elStyleRef, wRef, w, elStyle, diagonalStyleRef, diagonalStyle, diagonal);
        } else {
            checkWeight(wRef, borderRef, x, y, diagonal);
        }
    }

    function setStyle(elStyleRef, elRef, w, elStyle, diagonalStyleRef = null, diagonalStyle = '', diagonal) {
        elStyleRef.value = elStyleRef.value === "" ? `node ${elStyle}` : elStyleRef.value + ` ${elStyle}`;

        let elNum = elRef.value.nodeRef.innerText;
        elRef.value.nodeRef.style.setProperty(`--th${elNum}${diagonal}-weight`, `"${w}"`);
        
        if (diagonalStyleRef) {
            diagonalStyleRef.value = diagonalStyleRef.value === "" ? `node ${diagonalStyle}` : diagonalStyleRef.value + ` ${diagonalStyle}`;
        }
    }

    function checkWeight(elRef, borderRef, x, y, diagonal = '') {
        let elNum = elRef.value.nodeRef.innerText;
        let thisW = elRef.value.nodeRef.style.getPropertyValue(`--th${elNum}${diagonal}-weight`).slice(1, -1);

        clickedNodesInfo.value.push([x, y, +thisW]);

        if (+thisW === tree.value[0]) {
            borderRef.value.nodeRef.classList.add(`green-border${diagonal}`);
            toast.success("Correct! Well done!", {
                autoClose: 2000,
            });
            tree.value.shift();
        }
        else {
            let borderNum = borderRef.value.nodeRef.innerText;
            borderRef.value.nodeRef.style.setProperty(`--th${borderNum}${diagonal}-animation`, 'border-color');
            toast.error("Wrong! -5 points", {
                autoClose: 2000,
            });

            points = points > 0 ? points - 5 : 0;
            mistakes ++;
        }
    }
    /*-------------------------------END SET NODE DATA-------------------------------*/

    function onNodeClicked(e) {
        if (!clickedNodes.value.includes(e) && tree.value.length > 0) {
            clickedNodes.value.push(e);

            e.classList.add('bg-orange-500');
            e.style.setProperty(`--th${e.innerText}-animation`, '');
            e.style.setProperty(`--th${e.innerText}-diagonal-animation`, '');
        }
        else if (clickedNodes.value.includes(e) && tree.value.length > 0) {
            clickedNodes.value.shift(e);
            e.classList.remove('bg-orange-500');
        }
    }

    function onGoBack() {
        router.push({name: 'home'});
        clearData();
    }

    function onNewGraph() {
        if (!isTreeCompleted.value) {
            clearData();
            initialize();
        }
    }

    function onSubmit() {
        localStorage.setItem('points', points);
        localStorage.setItem('mistakes', mistakes);
        router.push({name: 'result'});
    }

    function addAnimation() {
        th0.value.nodeRef.style.setProperty('--th0-animation', "hard-node-side");
        th0.value.nodeRef.style.setProperty('--th0-diagonal-animation', "hard-node-side");
        th7.value.nodeRef.style.setProperty('--th7-animation', "hard-node-side");
        th7.value.nodeRef.style.setProperty('--th7-diagonal-animation', "hard-node-side");
        th1.value.nodeRef.style.setProperty('--th1-animation', "hard-node-x");
        th3.value.nodeRef.style.setProperty('--th3-animation', "hard-node-x");
        th4.value.nodeRef.style.setProperty('--th4-animation', "hard-node-x");
        th6.value.nodeRef.style.setProperty('--th6-animation', "hard-node-x");
        th2.value.nodeRef.style.setProperty('--th2-animation', "hard-node-y");
        th4.value.nodeRef.style.setProperty('--th4-diagonal-animation', "hard-node-y");
        th5.value.nodeRef.style.setProperty('--th5-animation', "hard-node-y");
        th1.value.nodeRef.style.setProperty('--th1-diagonal-animation', "hard-node-diagonal");
        th2.value.nodeRef.style.setProperty('--th2-diagonal-animation', "hard-node-diagonal");
        th3.value.nodeRef.style.setProperty('--th3-diagonal-animation', "hard-node-diagonal");
        th5.value.nodeRef.style.setProperty('--th5-diagonal-animation', "hard-node-diagonal");
        th6.value.nodeRef.style.setProperty('--th6-diagonal-animation', "hard-node-diagonal");
    }

    function initialize() {
        useGraph(numOfEdges, graph.value, setNodeData, 8, tree, 'hard');
    }

    function clearData() {
        graph.value = [
            [0, 0, 0, undefined, undefined, undefined, undefined, undefined],
            [0, 0, 0, 0, undefined, undefined, 0, undefined],
            [0, 0, 0, undefined, 0, 0, undefined, undefined],
            [undefined, 0, undefined, 0, 0, 0, undefined, undefined],
            [undefined, undefined, 0, 0, 0, undefined, 0, undefined],
            [undefined, undefined, 0, 0, undefined, 0, 0, 0],
            [undefined, 0, undefined, undefined, 0, 0, 0, 0],
            [undefined, undefined, undefined, undefined, undefined, 0, 0, 0]
        ];

        tree.value = [];

        numOfEdges = Math.floor(Math.random() * (13 - 9 + 1)) + 9;
        
        th0.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th1.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th2.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th3.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th4.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th5.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th6.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th7.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');

        th0Style.value = "";
        th1Style.value = "";
        th2Style.value = "";
        th3Style.value = "";
        th4Style.value = "";
        th5Style.value = "";
        th6Style.value = "";
        th7Style.value = "";

        clickedNodes.value = [];
        clickedNodesInfo.value = [];

        emit('onNodesClicked', clickedNodesInfo.value); 
    }

    /****************************************** LIFCYCLE HOOKS **********************************************/
    onMounted(() => {
        addAnimation();
        initialize();
        toast.info("The maximum points are 120. For each wrong guess you loose 5 points. Good luck!", {
            autoClose: 6000,
        });
    });

    onUnmounted(() => {
        clearData();
    });
    /*************************************** END OF LIFCYCLE HOOKS ******************************************/

</script>

<template>
    <div class="hard-wrapper bg-white">
        <div class="w-full flex flex-col items-center">
            <div class="hard relative flex justify-center items-center">
                <div class="w-1/4">
                    <Node ref="th0" :content="0" :customStyle="th0Style" width="40" height="40" textSize="18" @onNodeClicked="onNodeClicked"/>
                </div>
                <div class="w-1/2 h-56 flex flex-col justify-between items-center">
                    <Node ref="th1" :content="1" :customStyle="th1Style" width="40" height="40" textSize="18" @onNodeClicked="onNodeClicked"/>
                    <Node ref="th2" :content="2" :customStyle="th2Style" width="40" height="40" textSize="18" @onNodeClicked="onNodeClicked"/>
                </div>
                <div class="w-1/2 h-56 flex flex-col justify-between items-center">
                    <Node ref="th3" :content="3" :customStyle="th3Style" width="40" height="40" textSize="18" @onNodeClicked="onNodeClicked"/>
                    <Node ref="th4" :content="4" :customStyle="th4Style" width="40" height="40" textSize="18" @onNodeClicked="onNodeClicked"/> 
                </div>
                <div class="w-1/2 h-56 flex flex-col justify-between items-center">
                    <Node ref="th5" :content="5" :customStyle="th5Style" width="40" height="40" textSize="18" @onNodeClicked="onNodeClicked"/>
                    <Node ref="th6" :content="6" :customStyle="th6Style" width="40" height="40" textSize="18" @onNodeClicked="onNodeClicked"/>
                </div>
                <div class="w-1/4 flex justify-end">
                    <Node ref="th7" :content="7" :customStyle="th7Style" width="40" height="40" textSize="18" @onNodeClicked="onNodeClicked"/>
                </div>
            </div>
            <ButtonsView :isTreeCompleted="isTreeCompleted"
                        @onGoBack="onGoBack"
                        @onNewGraph="onNewGraph"
                        @onSubmit="onSubmit"/>
        </div>
    </div>
</template>

<style>
.hard-wrapper {
    width: 500px;
    height: 420px;
}

.hard {
    width: 400px;
    height: 250px;
    margin: 45px 0;

    .node {
        position: relative;
    }

    @keyframes hard-node-x {
        0% {width: 0;}
        100% {width:61px;}
    }

    @keyframes hard-node-y {
        0% {width: 0;}
        100% {width:145px;}
    }

    @keyframes hard-node-diagonal {
        0% {width: 0;}
        100% {width:233px;}
    
    }
    @keyframes hard-node-side {
        0% {width: 0;}
        100% {width:85px;}
    }

    .node::after, .node::before {
        content: "";
        text-align: center;
        height: 4px;
        background-color: black;
        display: inline-block;
        position: absolute;
    }

    .node.side.negative::after, .node.side.positive::before {
        width: 85px;
        line-height: 34px;
        position: absolute;
        animation-duration: 1.5s;
    }

    .node.parent.negative::after {
        content: var(--th0-weight);
        animation-name: var(--th0-animation);
        left: 33px;
        bottom: 33px;
        transform: rotate(-48deg);
        transform-origin: bottom left;
    }

    .node.parent.positive::before {
        content: var(--th0-diagonal-weight);
        animation-name: var(--th0-diagonal-animation);
        left: 34px;
        bottom: 7px;
        transform: rotate(48deg);
        transform-origin: bottom left;
    }

    .node.tail.negative::after {
        content: var(--th7-weight);
        animation-name: var(--th7-animation);
        right: 33px;
        bottom: 33px;
        transform: rotate(48deg);
        transform-origin: bottom right;
    }

    .node.tail.positive::before {
        content: var(--th7-diagonal-weight);
        animation-name: var(--th7-diagonal-animation);
        right: 34px;
        bottom: 7px;
        transform: rotate(-48deg);
        transform-origin: bottom right;
    }

    .node.source::after, .node-left::after {
        width: 61px;
        line-height: 34px;
        animation-duration: 1.5s;
    }

    .node.source::after {
        left: 40px;
    }

    .node.source.source-1::after {
        content: var(--th1-weight);
        animation-name: var(--th1-animation);
    }

    .node.source.source-2::after {
        content: var(--th3-weight);
        animation-name: var(--th3-animation);
    }

    .node-left::after {
        left: unset;
        right: 39px;
    }

    .node-left.st-left::after {
        content: var(--th4-weight);
        animation-name: var(--th4-animation);
    }

    .node-left.nd-left::after {
        content: var(--th6-weight);
        animation-name: var(--th6-animation);
    }

    .node-top::after, .node-bottom::after, .st-top::before {
        width: 145px;
        line-height: 34px;
        transform-origin: left;
        animation-duration: 1.5s;
    }

    .node-top::after, .st-top::before {
        transform: rotate(270deg);
        left: 21px;
        bottom: 37px;
    }

    .node-top::after {
        content: var(--th2-weight);
        animation-name: var(--th2-animation);
    }

    .st-top::before {
        animation-name: var(--th4-diagonal-animation);
    }

    .node-bottom::after {
        content: var(--th5-weight);
        animation-name: var(--th5-animation);
        transform: rotate(90deg);
        left: 20px;
        top: 38px;
    }

    .node-diagonal::before {
        content: "";
        width: 233px;
        height: 4px;
        background-color: black;
        display: inline-block;
        position: absolute;
        top: 33px;
        animation-duration: 1.5s;
    }

    .node-diagonal.negative::before {
        animation-name: var(--th5-diagonal-animation);
        transform-origin: top right;
        transform: rotate(-43deg);
        right: 34px;
    }

    .node-diagonal.positive::before {
        animation-name: var(--th1-diagonal-animation);
        transform-origin: top left;
        transform: rotate(44deg);
        left: 36px;
    }

    .node-number::before {
        content: "";
        text-align: center;
        bottom: 0px;
        background-color: transparent;
    }

    .node-number.positive::before {
        content: var(--th6-diagonal-weight);
        animation-name: var(--th6-diagonal-animation);
        transform-origin: bottom right;
        transform: rotate(46deg) translate(-52px, -61px);
        top: unset;
        right: 75px;
        left: unset;
    }

    .node-number.negative::before {
        content: var(--th2-diagonal-weight);
        animation-name: var(--th2-diagonal-animation);
        transform-origin: bottom left;
        transform: rotate(-46deg) translate(-65px, -41px);
        top: unset;
        left: 75px;
        right: unset;
    }

    .node-number.plain::before {
        content: var(--th3-diagonal-weight);
        animation-name: var(--th3-diagonal-animation);
        transform-origin: top;
        bottom: unset;
        transform: rotate(270deg) translate(-55px, -76px);
    }

    
}
</style>