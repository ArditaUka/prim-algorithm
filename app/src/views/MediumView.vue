<script setup>
    import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useGraph } from '@/composables/graph'
    import Node from "@/components/Node.vue";
    import ButtonsView from "./ButtonsView.vue";

    const router = useRouter();

    //setting the maximum of edges to be added between 6 nodes equal to 10 and we're going to set the minimum to 7
    let numOfEdges = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
    let graph = ref([
        [0, 0, undefined, 0, undefined, undefined],
        [0, 0, 0, 0, 0, undefined],
        [undefined, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, undefined],
        [undefined, 0, 0, 0, 0, 0],
        [undefined, undefined, 0, undefined, 0, 0]
    ]);
    let tree = ref([]);

    let th0 = ref(null);
    let th1 = ref(null);
    let th2 = ref(null);
    let th3 = ref(null);
    let th4 = ref(null);
    let th5 = ref(null);

    let th0Style = ref("");
    let th1Style = ref("");
    let th2Style = ref("");
    let th3Style = ref("");
    let th4Style = ref("");
    let th5Style = ref("");

    let clickedNodes = ref([]);
    let clickedNodesInfo = ref([]);

    const areTwoNodesClicked = computed(() => clickedNodes.value.length === 2);
    const isTreeCompleted = computed(() => tree.value.length === 0 && !(th0Style.value == "" && th1Style.value == "" && th2Style.value == "" && th3Style.value == "" && th4Style.value == "" && th5Style.value == ""));

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
            console.log(isTreeCompleted.value);
            th0.value.nodeRef.classList.add('opacity-80');
            th1.value.nodeRef.classList.add('opacity-80');
            th2.value.nodeRef.classList.add('opacity-80');
            th3.value.nodeRef.classList.add('opacity-80');
            th4.value.nodeRef.classList.add('opacity-80');
            th5.value.nodeRef.classList.add('opacity-80');

            th0.value.nodeRef.classList.remove('cursor-pointer');
            th1.value.nodeRef.classList.remove('cursor-pointer');
            th2.value.nodeRef.classList.remove('cursor-pointer');
            th3.value.nodeRef.classList.remove('cursor-pointer');
            th4.value.nodeRef.classList.remove('cursor-pointer');
            th5.value.nodeRef.classList.remove('cursor-pointer');
        }
    });
    /*********************************************END OF WATCHERS***********************************************/

    /*--------------------------SET NODE DATA-------------------------------*/
    function setNodeData(x, y, w = null) {
        //considering each node with each node, the style will be added or the weight will be checked based on the received nodes(x, y)
        switch (true) {
            case ((x === 0 && y === 1) || (x === 1 && y === 0)):
                setStyleOrCheckWeight(th0Style, th0, '--th0-weight-negative', w, 'side negative parent', null, '', th0, x, y);
                break;
            case ((x === 0 && y === 3) || (x === 3 && y === 0)):
                setStyleOrCheckWeight(th0Style, th0, '--th0-weight-positive', w, 'side positive parent', null, '', th0, x, y, '-diagonal');
                break;
            case ((x === 1 && y === 2) || (x === 2 && y === 1)):
                setStyleOrCheckWeight(th1Style, th1, '--th1-weight', w, 'source', null, '', th1, x, y);
                break;
            case ((x === 1 && y === 4) || (x === 4 && y === 1)):
                setStyleOrCheckWeight(th1Style, th4, '--th4-diagonal-weight', w, 'node-diagonal positive', th4Style, 'node-diagonal node-number positive', th1, x, y, '-diagonal');
                break;
            case ((x === 2 && y === 4) || (x === 4 && y === 2)):
                setStyleOrCheckWeight(th2Style, th2, '--th2-weight', w, 'node-bottom', null, '', th2, x, y);
                break;
            case ((x === 2 && y === 3) || (x === 3 && y === 2)):
                setStyleOrCheckWeight(th2Style, th3, '--th3-diagonal-weight', w, 'node-diagonal negative', th3Style, 'node-diagonal node-number negative', th2, x, y, '-diagonal');
                break;
            case ((x === 1 && y === 3) || (x === 3 && y === 1)):
                setStyleOrCheckWeight(th3Style, th3, '--th3-weight', w, 'node-top', null, '', th3, x, y);
                break;
            case ((x === 3 && y === 4) || (x === 4 && y === 3)):
                setStyleOrCheckWeight(th4Style, th4, '--th4-weight', w, 'node-left', null, '', th4, x, y);
                break;
            case ((x === 5 && y === 2) || (x === 2 && y === 5)):
                setStyleOrCheckWeight(th5Style, th5, '--th5-weight-negative', w, 'side negative tail', null, '', th5, x, y);
                break;
            case ((x === 5 && y === 4) || (x === 4 && y === 5)):
                setStyleOrCheckWeight(th5Style, th5, '--th5-weight-positive', w, 'side positive tail', null, '', th5, x, y, '-diagonal');
                break;
            default:
                break;
        }
    }

    function setStyleOrCheckWeight(elStyleRef, wRef, contentName, w, elStyle, diagonalStyleRef, diagonalStyle, borderRef, x, y, diagonal = '') {
        //when weight(w) is not null it is the initial state, where we draw the borders and weights
        //otherwise, when the weight is null, it means that two nodes have been clicked and we need... 
        //...to check if the selected edge is the correct one
        if (w) {
            setStyle(elStyleRef, wRef, contentName, w, elStyle, diagonalStyleRef, diagonalStyle);
        } else {
            checkWeight(wRef, contentName, borderRef, x, y, diagonal);
        }
    }

    function setStyle(elStyleRef, elRef, contentName, w, elStyle, diagonalStyleRef = null, diagonalStyle = '') {
        elStyleRef.value = elStyleRef.value === "" ? `node ${elStyle}` : elStyleRef.value + ` ${elStyle}`;
        elRef.value.nodeRef.style.setProperty(contentName, `"${w}"`);
        
        if (diagonalStyleRef) {
            diagonalStyleRef.value = diagonalStyleRef.value === "" ? `node ${diagonalStyle}` : diagonalStyleRef.value + ` ${diagonalStyle}`;
        }
    }

    function checkWeight(elRef, contentName, borderRef, x, y, diagonal = '') {
        let thisW = elRef.value.nodeRef.style.getPropertyValue(contentName).slice(1, -1);

        clickedNodesInfo.value.push([x, y, +thisW]);

        if (+thisW === tree.value[0]) {
            borderRef.value.nodeRef.classList.add(`green-border${diagonal}`);
            tree.value.shift();
        }
        else {
            borderRef.value.nodeRef.classList.add(`red-border${diagonal}`);
        }
    }
    /*-------------------------------END SET NODE DATA-------------------------------*/

    function onNodeClicked(e) {
        if (!clickedNodes.value.includes(e) && tree.value.length > 0) {
            clickedNodes.value.push(e);

            e.classList.add('bg-orange-500');
            e.classList.remove('animation-none');
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
        console.log("ok");
    }

    function initialize() {
        useGraph(numOfEdges, graph.value, setNodeData, 6, tree, 'medium');
    }

    function clearData() {
        graph.value = [
            [0, 0, undefined, 0, undefined, undefined],
            [0, 0, 0, 0, 0, undefined],
            [undefined, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, undefined],
            [undefined, 0, 0, 0, 0, 0],
            [undefined, undefined, 0, undefined, 0, 0]
        ];

        tree.value = [];

        numOfEdges = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
        
        th0.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th1.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th2.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th3.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th4.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th5.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');

        th0Style.value = "";
        th1Style.value = "";
        th2Style.value = "";
        th3Style.value = "";
        th4Style.value = "";
        th5Style.value = "";

        clickedNodes.value = [];
        clickedNodesInfo.value = [];

        emit('onNodesClicked', clickedNodesInfo.value); 
    }

     /****************************************** LIFCYCLE HOOKS **********************************************/
     onMounted(() => {
        initialize();
    });

    onUnmounted(() => {
        clearData();
    });
    /*************************************** END OF LIFCYCLE HOOKS ******************************************/
</script>

<template>
    <div class="medium-wrapper bg-white">
        <div class="w-full flex flex-col items-center">
            <div class="medium relative flex justify-center items-center">
                <div class="w-1/4">
                    <Node ref="th0" :content="0" :customStyle="th0Style" @onNodeClicked="onNodeClicked"/> 
                </div>
                <div class="w-1/2 h-56 flex flex-col justify-between">
                    <div class="flex justify-between"> 
                        <Node ref="th1" :content="1" :customStyle="th1Style" @onNodeClicked="onNodeClicked"/> 
                        <Node ref="th2" :content="2" :customStyle="th2Style" @onNodeClicked="onNodeClicked"/> 
                    </div>
                    <div class="flex justify-between"> 
                        <Node ref="th3" :content="3" :customStyle="th3Style" @onNodeClicked="onNodeClicked"/>
                        <Node ref="th4" :content="4" :customStyle="th4Style" @onNodeClicked="onNodeClicked"/>
                    </div>
                </div>
                <div class="w-1/4 flex justify-end">
                    <Node ref="th5" :content="5" :customStyle="th5Style" @onNodeClicked="onNodeClicked"/>
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
.medium-wrapper {
    width: 500px;
    height: 420px;
}

.medium {
    width: 400px;
    height: 250px;
    margin: 45px 0;

    .node {
        position: relative;
    }

    @keyframes medium-node-x {
        0% {width: 0;}
        100% {width:104px;}
    }

    @keyframes medium-node-y {
        0% {width: 0;}
        100% {width:130px;}
    }

    @keyframes medium-node-diagonal {
        0% {width: 0;}
        100% {width:188px;}
    
    }
    @keyframes medium-node-side {
        0% {width: 0;}
        100% {width:87px;}
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
        width: 87px;
        line-height: 34px;
        position: absolute;
        animation: medium-node-side 1.5s;
    }

    .node.parent.negative::after {
        content: var(--th0-weight-negative);
        left: 45px;
        bottom: 35px;
        transform: rotate(-43deg);
        transform-origin: bottom left;
    }

    .node.tail.negative::after {
        content: var(--th5-weight-negative);
        right: 45px;
        bottom: 35px;
        transform: rotate(43deg);
        transform-origin: bottom right;
    }

    .node.tail.positive::before {
        content: var(--th5-weight-positive);
        right: 45px;
        bottom: 13px;
        transform: rotate(-43deg);
        transform-origin: bottom right;
    }

    .node.parent.positive::before {
        content: var(--th0-weight-positive);
        left: 45px;
        bottom: 13px;
        transform: rotate(43deg);
        transform-origin: bottom left;
    }

    .node.source::after, .node-left::after {
        width: 104px;
        line-height: 34px;
        animation: medium-node-x 1.5s;
    }

    .node.source::after {
        content: var(--th1-weight);
        left: 48px;
    }

    .node-left::after {
        content: var(--th4-weight);
        left: unset;
        right: 48px;
    }

    .node-bottom::after, .node-top::after {
        width: 130px;
        line-height: 34px;
        transform-origin: left;
        animation: medium-node-y 1.5s;
    }

    .node-bottom::after {
        content: var(--th2-weight);
        transform: rotate(90deg);
        left: 25px;
        top: 45px;
    }

    .node-top::after {
        content: var(--th3-weight);
        transform: rotate(270deg);
        left: 24px;
        bottom: 45px;
    }

    .node-diagonal::before {
        content: "";
        width: 188px;
        height: 4px;
        background-color: black;
        display: inline-block;
        position: absolute;
        top: 38px;
        animation: medium-node-diagonal 1.5s;
    }

    .node-diagonal.negative::before {
        transform-origin: top right;
        transform: rotate(-48deg);
        right: 42px;
    }

    .node-diagonal.positive::before {
        transform-origin: top left;
        transform: rotate(48deg);
        left: 42px;
    }

    .node-number::before {
        content: "";
        text-align: center;
        bottom: 38px;
        background-color: transparent;
    }

    .node-number.positive::before {
        content: var(--th4-diagonal-weight);
        transform-origin: bottom right;
        transform: rotate(46deg) translate(-46px, -38px);
        top: unset;
        right: 42px;
        left: unset;
    }

    .node-number.negative::before {
        content: var(--th3-diagonal-weight);
        transform-origin: bottom left;
        transform: rotate(-46deg) translate(-44px, -5px);
        top: unset;
        left: 42px;
        right: unset;
    }
}
</style>