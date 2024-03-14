<script setup>
    import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useGraph } from '@/composables/graph'
    import Node from "@/components/Node.vue";
    import ButtonsView from "./ButtonsView.vue";
    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';

    const router = useRouter()

    //the maximum of edges to be added between 4 nodes is 6 and we're going to set the minimum to 4
    let numOfEdges = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
    let graph = Array.from({ length: 4 }, () => Array(4).fill(0));
    let tree = ref([]);
    let points = 120;
    let mistakes = 0;

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
                setStyleOrCheckWeight(th0Style, th0, w, 'source', null, '', th0, x, y);
                break;
            case ((x === 0 && y === 3) || (x === 3 && y === 0)):
                setStyleOrCheckWeight(th0Style, th3, w, 'node-diagonal positive', th3Style, 'node-diagonal node-number positive', th0, x, y, '-diagonal');
                break;
            case ((x === 1 && y === 3) || (x === 3 && y === 1)):
                setStyleOrCheckWeight(th1Style, th1, w, 'node-bottom', null, '', th1, x, y);
                break;
            case ((x === 1 && y === 2) || (x === 2 && y === 1)):
                setStyleOrCheckWeight(th1Style, th2, w, 'node-diagonal negative', th2Style, 'node-diagonal node-number negative', th1, x, y, '-diagonal');
                break;
            case ((x === 0 && y === 2) || (x === 2 && y === 0)):
                setStyleOrCheckWeight(th2Style, th2,  w, 'node-top', null, '', th2, x, y);
                break;
            case ((x === 2 && y === 3) || (x === 3 && y === 2)):
                setStyleOrCheckWeight(th3Style, th3, w, 'node-left', null, '', th3, x, y);
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
            toast.error("Wrong! -10 points", {
                autoClose: 2000,
            });

            points = points > 0 ? points - 10 : 0;
            mistakes ++;
        }
    }
    /*-------------------------------END SET NODE DATA-------------------------------*/

    /*************************HANDLE THE CLICKED NODE OR EDGE************************/
    function onNodeClicked(event) {
        let nodeRef = event.currentTarget;
        
        if (isEdgeClicked(event)[0] || isEdgeClicked(event)[1]) {
            onEdgeClicked(
                nodeRef,
                isEdgeClicked(event)[0] ? 'after' : 'before'
            )
        }
        else {
            if (!clickedNodes.value.includes(nodeRef) && tree.value.length > 0) {
                clickedNodes.value.push(nodeRef);
    
                nodeRef.classList.add('bg-orange-500');
                nodeRef.style.setProperty(`--th${nodeRef.innerText}-animation`, '');
                nodeRef.style.setProperty(`--th${nodeRef.innerText}-diagonal-animation`, '');
            }
            else if (clickedNodes.value.includes(nodeRef) && tree.value.length > 0) {
                clickedNodes.value.shift(nodeRef);
                nodeRef.classList.remove('bg-orange-500');
            }
        }
    }

    function isEdgeClicked(e) {
        let after = getComputedStyle(e.currentTarget, ":after")
        let before = getComputedStyle(e.currentTarget, ":before")

        //get the mouse position
        let ex = e.layerX
        let ey = e.layerY

        let finalRes = [];

        if (after) {
            finalRes.push(checkAfterPE(after, ex, ey))
        } 

        if (before) {
            finalRes.push(checkBeforePE(before, ex, ey))
        }

        return finalRes
    }

    function checkAfterPE(after, ex, ey) {
        // Then we parse out the dimensions
        let atop = Number(after.getPropertyValue("top").slice(0, -2))
        const aheight = Number(after.getPropertyValue("height").slice(0, -2))
        let aleft = Number(after.getPropertyValue("left").slice(0, -2))
        const awidth = Number(after.getPropertyValue("width").slice(0, -2))

        //if the pseudo element is rotated take the rotated values into consideration
        const rot = after.getPropertyValue('transform') !== 'none' ? after.getPropertyValue('transform') : null;
        const rotationAngle = rot ? extractRotationAngle(rot) : null;
        if (rot) {
            if (rotationAngle === -90) {
                ey += awidth;
            }
            ex += aheight 
        }
        const res = ex >= aleft && ((ex <= aleft + awidth) || (rot && ex <= aleft + aheight)) && ey >= atop && ((ey <= atop + aheight) || (rot && ey <= atop + awidth))

        return res
    }

    function checkBeforePE(before, ex, ey) {
        // Then we parse out the dimensions
        let atop = Number(before.getPropertyValue("top").slice(0, -2))
        let aleft = Number(before.getPropertyValue("left").slice(0, -2))
        const awidth = Number(before.getPropertyValue("width").slice(0, -2))

        const res = ex >= aleft && ex <= aleft + awidth && ey >= atop && ey <= atop+awidth

        return res
    }

    function extractRotationAngle(transformMatrix) {
        // Parse the transform matrix
        const matrixValues = transformMatrix.match(/matrix\((.*)\)/)[1].split(',').map(parseFloat);

        // Calculate the rotation angle in radians
        const angleRadians = Math.atan2(matrixValues[1], matrixValues[0]);

        // Convert radians to degrees
        const angleDegrees = angleRadians * (180 / Math.PI);

        return angleDegrees;
    }

    function onEdgeClicked(e, type) {
        e.style.setProperty(`--th${e.innerText}-animation`, '');
        e.style.setProperty(`--th${e.innerText}-diagonal-animation`, '');

        const x = parseInt(e.innerText)
        const y = getNodesFromEdge(x, type)

        setNodeData(x, y)
        
        emit('onNodesClicked', clickedNodesInfo.value);
    }

    function getNodesFromEdge(x, type) {
        if (type == "after") {
            switch (x) {
                case 0: 
                    return 1
                case 1: 
                    return 3
                case 3: 
                    return 2
                case 2: 
                    return 0
                default:
                    break;
            }
        } else {
            switch (x) {
                case 0: 
                    return 3
                case 1: 
                    return 2
                default:
                    break;
            }
        }
    }
    /***********************END HANDLE THE CLICKED NODE OR EDGE**********************/

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
        th0.value.nodeRef.style.setProperty('--th0-animation', "easy-node-x");
        th3.value.nodeRef.style.setProperty('--th3-animation', "easy-node-x");
        th1.value.nodeRef.style.setProperty('--th1-animation', "easy-node-y");
        th2.value.nodeRef.style.setProperty('--th2-animation', "easy-node-y");
        th0.value.nodeRef.style.setProperty('--th0-diagonal-animation', "easy-node-diagonal");
        th1.value.nodeRef.style.setProperty('--th1-diagonal-animation', "easy-node-diagonal");
        th3.value.nodeRef.style.setProperty('--th0-diagonal-animation', "easy-node-diagonal");
        th2.value.nodeRef.style.setProperty('--th1-diagonal-animation', "easy-node-diagonal");
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
        addAnimation();
        initialize();
        toast.info("The maximum points are 120. For each wrong guess you loose 10 points. Good luck!", {
            autoClose: 10000,
        });
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
.green-border::after {
    background-color: #63A211 !important;
}

.green-border-diagonal::before {
    background-color: #63A211 !important;
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
        width: 204px;
        line-height: 34px;
        animation-duration: 1.5s;
    }

    .node.source::after {
        content: var(--th0-weight);
        animation-name: var(--th0-animation);
    }

    .node-bottom::after, .node-top::after {
        line-height: 34px;
        transform-origin: left;
        animation-duration: 1.5s;
    }

    .node-bottom::after {
        content: var(--th1-weight);
        animation-name: var(--th1-animation);
        width: 155px;
        transform: rotate(90deg);
        left: 25px;
        top: 45px;
    }

    .node-top::after {
        content: var(--th2-weight);
        animation-name: var(--th2-animation);
        width: 155px;
        transform: rotate(270deg);
        left: 24px;
        bottom: 45px;
    }

    .node-left::after {
        content: var(--th3-weight);
        animation-name: var(--th3-animation);
        left: unset;
        right: 48px;
    }

    .node-diagonal::before {
        content: "";
        width: 276px;
        height: 4px;
        background-color: black;
        display: inline-block;
        position: absolute;
        top: 39px;
        animation-duration: 1.5s;
    }

    .node-diagonal.negative::before {
        animation-name: var(--th1-diagonal-animation);
        transform-origin: top right;
        transform: rotate(-38deg);
        right: 42px;
    }

    .node-diagonal.positive::before {
        animation-name: var(--th0-diagonal-animation);
        transform-origin: top left;
        transform: rotate(38deg);
        left: 42px;
    }

    .node-number::before {
        content: "";
        text-align: center;
        bottom: 38px;
        background-color: transparent;
        width: 0px;
    }

    .node-number.positive::before {
        content: var(--th3-diagonal-weight);
        animation: none;
        transform-origin: bottom right;
        transform: rotate(36deg) translate(-176px, -32px);
        top: unset;
        right: 42px;
        left: unset;
    }

    .node-number.negative::before {
        content: var(--th2-diagonal-weight);
        animation: none;
        transform-origin: bottom left;
        transform: rotate(-36deg) translate(96px, 0px);
        top: unset;
        left: 42px;
        right: unset;
    }
}
</style>