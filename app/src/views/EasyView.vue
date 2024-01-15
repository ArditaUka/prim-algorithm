<script setup>
    import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useGraph } from '@/composables/graph'
    import Node from "@/components/Node.vue";
    import ButtonsView from "./ButtonsView.vue";

    const router = useRouter()

    //the maximum of edges to be added between 4 nodes is 6 and we're going to set the minimum to 4
    let numOfEdges = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
    let graph = Array.from({ length: 4 }, () => Array(4).fill(0));
    let tree = ref([]);

    let th0 = ref(null);
    let th1 = ref(null);
    let th2 = ref(null);
    let th3 = ref(null);

    let th0Style = ref("");
    let th1Style = ref("");
    let th2Style = ref("");
    let th3Style = ref("");

    let clickedNodes = ref([]);
    let clickedNodesInfo = ref([]);

    const areTwoNodesClicked = computed(() => clickedNodes.value.length === 2);
    const isTreeCompleted = computed(() => tree.value.length === 0 && !(th0Style.value == "" && th1Style.value == "" && th2Style.value == "" && th3Style.value == ""));

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
            th0.value.nodeRef.classList.add('opacity-80');
            th1.value.nodeRef.classList.add('opacity-80');
            th2.value.nodeRef.classList.add('opacity-80');
            th3.value.nodeRef.classList.add('opacity-80');

            th0.value.nodeRef.classList.remove('cursor-pointer');
            th1.value.nodeRef.classList.remove('cursor-pointer');
            th2.value.nodeRef.classList.remove('cursor-pointer');
            th3.value.nodeRef.classList.remove('cursor-pointer');
    });
    /*********************************************END OF WATCHERS***********************************************/

    /*--------------------------SET NODE DATA-------------------------------*/
    function setNodeData(x, y, w = null) {
        //considering each node with each node, the style will be added or the weight will be checked based on the received nodes(x, y)
        switch (true) {
            case ((x === 0 && y === 1) || (x === 1 && y === 0)):
                setStyleOrCheckWeight(th0Style, th0, '--th0-weight', w, 'source', null, '', th0, x, y);
                break;
            case ((x === 0 && y === 3) || (x === 3 && y === 0)):
                setStyleOrCheckWeight(th0Style, th3, '--th3-diagonal-weight', w, 'node-diagonal positive', th3Style, 'node-diagonal node-number positive', th0, x, y, '-diagonal');
                break;
            case ((x === 1 && y === 3) || (x === 3 && y === 1)):
                setStyleOrCheckWeight(th1Style, th1, '--th1-weight', w, 'node-bottom', null, '', th1, x, y);
                break;
            case ((x === 1 && y === 2) || (x === 2 && y === 1)):
                setStyleOrCheckWeight(th1Style, th2, '--th2-diagonal-weight', w, 'node-diagonal negative', th2Style, 'node-diagonal node-number negative', th1, x, y, '-diagonal');
                break;
            case ((x === 0 && y === 2) || (x === 2 && y === 0)):
                setStyleOrCheckWeight(th2Style, th2, '--th2-weight', w, 'node-top', null, '', th2, x, y);
                break;
            case ((x === 2 && y === 3) || (x === 3 && y === 2)):
                setStyleOrCheckWeight(th3Style, th3, '--th3-weight', w, 'node-left', null, '', th3, x, y);
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
        useGraph(numOfEdges, graph, setNodeData, 4, tree);
    }

    function clearData() {
        graph = Array.from({ length: 4 }, () => Array(4).fill(0));
        tree.value = [];

        numOfEdges = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
        
        th0.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th1.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th2.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');
        th3.value?.nodeRef.classList.remove('green-border', 'green-border-diagonal');

        th0Style.value = "";
        th1Style.value = "";
        th2Style.value = "";
        th3Style.value = "";

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
    <div class="easy-wrapper bg-white">
        <div class="w-full flex flex-col items-center">
            <div class="easy relative flex flex-col justify-between">
                <div class="flex justify-between"> 
                    <Node ref="th0" :content="0" :customStyle="th0Style" @onNodeClicked="onNodeClicked"/> 
                    <Node ref="th1" :content="1" :customStyle="th1Style" @onNodeClicked="onNodeClicked"/>
                </div>
                <div class="flex justify-between">
                    <Node ref="th2" :content="2" :customStyle="th2Style" @onNodeClicked="onNodeClicked"/>
                    <Node ref="th3" :content="3" :customStyle="th3Style" @onNodeClicked="onNodeClicked"/>
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
.red-border::after {
    animation: border-color 15s !important;
}

.red-border-diagonal::before {
    animation: border-color 15s !important;
}

.green-border::after {
    background-color: #63A211 !important;
}

.green-border-diagonal::before {
    background-color: #63A211 !important;
}

.animation-none::after, .animation-none::before {
    animation: none !important;
}

.easy-wrapper {
    width: 500px;
    height: 420px;
}

.easy {
    width: 300px;
    height: 250px;
    margin: 45px 0;

    .node {
        position: relative;
    }

    @keyframes easy-node-x {
        0% {width: 0;}
        100% {width:205px;}
    }

    @keyframes easy-node-y {
        0% {width: 0;}
        100% {width:157px;}
    }

    @keyframes easy-node-diagonal {
        0% {width: 0;}
        100% {width:278px;}
    }

    @keyframes border-color {
        from {background-color: red;}
        to {background-color: black;}
    } 

    .node::after {
        content: "";
        text-align: center;
        height: 4px;
        background-color: black;
        display: inline-block;
        position: absolute;
        left: 48px;
    }

    .node.source::after, .node-left::after {
        width: 205px;
        line-height: 34px;
        animation: easy-node-x 1.5s;
    }

    .node.source::after {
        content: var(--th0-weight);
    }

    .node-bottom::after, .node-top::after {
        line-height: 34px;
        transform-origin: left;
        animation: easy-node-y 1.5s;
    }

    .node-bottom::after {
        width: 155px;
        content: var(--th1-weight);
        transform: rotate(90deg);
        left: 25px;
        top: 45px;
    }

    .node-top::after {
        width: 157px;
        content: var(--th2-weight);
        transform: rotate(270deg);
        left: 24px;
        bottom: 45px;
    }

    .node-left::after {
        content: var(--th3-weight);
        left: unset;
        right: 48px;
    }

    .node-diagonal::before {
        content: "";
        width: 278px;
        height: 4px;
        background-color: black;
        display: inline-block;
        position: absolute;
        top: 38px;
        animation: easy-node-diagonal 1.5s;
    }

    .node-diagonal.negative::before {
        transform-origin: top right;
        transform: rotate(-38deg);
        right: 42px;
    }

    .node-diagonal.positive::before {
        transform-origin: top left;
        transform: rotate(38deg);
        left: 42px;
    }

    .node-number::before {
        content: "";
        text-align: center;
        bottom: 38px;
        background-color: transparent;
    }

    .node-number.positive::before {
        content: var(--th3-diagonal-weight);
        transform-origin: bottom right;
        transform: rotate(36deg) translate(-36px, -32px);
        top: unset;
        right: 42px;
        left: unset;
    }

    .node-number.negative::before {
        content: var(--th2-diagonal-weight);
        transform-origin: bottom left;
        transform: rotate(-36deg) translate(-36px, 0px);
        top: unset;
        left: 42px;
        right: unset;
    }
}
</style>