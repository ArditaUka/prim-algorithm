<script setup>
    import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useGraph } from '@/composables/graph'
    import Node from "@/components/Node.vue";
    import ButtonsView from "./ButtonsView.vue";
    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';

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
    let points = 120;
    let mistakes = 0;

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
                setStyleOrCheckWeight(th0Style, th0, w, 'side negative parent', null, '', th0, x, y);
                break;
            case ((x === 0 && y === 3) || (x === 3 && y === 0)):
                setStyleOrCheckWeight(th0Style, th0, w, 'side positive parent', null, '', th0, x, y, '-diagonal');
                break;
            case ((x === 1 && y === 2) || (x === 2 && y === 1)):
                setStyleOrCheckWeight(th1Style, th1, w, 'source', null, '', th1, x, y);
                break;
            case ((x === 1 && y === 4) || (x === 4 && y === 1)):
                setStyleOrCheckWeight(th1Style, th4, w, 'node-diagonal positive', th4Style, 'node-diagonal node-number positive', th1, x, y, '-diagonal');
                break;
            case ((x === 2 && y === 4) || (x === 4 && y === 2)):
                setStyleOrCheckWeight(th2Style, th2, w, 'node-bottom', null, '', th2, x, y);
                break;
            case ((x === 2 && y === 3) || (x === 3 && y === 2)):
                setStyleOrCheckWeight(th2Style, th3, w, 'node-diagonal negative', th3Style, 'node-diagonal node-number negative', th2, x, y, '-diagonal');
                break;
            case ((x === 1 && y === 3) || (x === 3 && y === 1)):
                setStyleOrCheckWeight(th3Style, th3, w, 'node-top', null, '', th3, x, y);
                break;
            case ((x === 3 && y === 4) || (x === 4 && y === 3)):
                setStyleOrCheckWeight(th4Style, th4, w, 'node-left', null, '', th4, x, y);
                break;
            case ((x === 5 && y === 2) || (x === 2 && y === 5)):
                setStyleOrCheckWeight(th5Style, th5, w, 'side negative tail', null, '', th5, x, y);
                break;
            case ((x === 5 && y === 4) || (x === 4 && y === 5)):
                setStyleOrCheckWeight(th5Style, th5, w, 'side positive tail', null, '', th5, x, y, '-diagonal');
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
            toast.error("Wrong! -7 points", {
                autoClose: 2000,
            });

            points = points > 0 ? points - 7 : 0;
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
            if (rotationAngle === -90 || Math.round(rotationAngle) == 43 || Math.round(rotationAngle) == -43) {
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
                    return 2
                case 3: 
                    return 1
                case 2: 
                    return 4
                case 4: 
                    return 3
                case 5: 
                    return 2
                default:
                    break;
            }
        } else {
            switch (x) {
                case 0: 
                    return 3
                case 1: 
                    return 4
                case 2: 
                    return 3
                case 5: 
                    return 4
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
        th0.value.nodeRef.style.setProperty('--th0-animation', "medium-node-side");
        th0.value.nodeRef.style.setProperty('--th0-diagonal-animation', "medium-node-side");
        th5.value.nodeRef.style.setProperty('--th5-animation', "medium-node-side");
        th5.value.nodeRef.style.setProperty('--th5-diagonal-animation', "medium-node-side");
        th1.value.nodeRef.style.setProperty('--th1-animation', "medium-node-x");
        th4.value.nodeRef.style.setProperty('--th4-animation', "medium-node-x");
        th2.value.nodeRef.style.setProperty('--th2-animation', "medium-node-y");
        th3.value.nodeRef.style.setProperty('--th3-animation', "medium-node-y");
        th1.value.nodeRef.style.setProperty('--th1-diagonal-animation', "medium-node-diagonal");
        th2.value.nodeRef.style.setProperty('--th2-diagonal-animation', "medium-node-diagonal");
        th3.value.nodeRef.style.setProperty('--th3-diagonal-animation', "medium-node-diagonal");
        th4.value.nodeRef.style.setProperty('--th4-diagonal-animation', "medium-node-diagonal");
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
        addAnimation();
        initialize();
        toast.info("The maximum points are 120. For each wrong guess you loose 7 points. Good luck!", {
            autoClose: 6000,
        });
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
        100% {width:186px;}
    
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
        animation-duration: 1.5s;
    }

    .node.parent.negative::after {
        content: var(--th0-weight);
        animation-name: var(--th0-animation);
        left: 45px;
        bottom: 35px;
        transform: rotate(-43deg);
        transform-origin: bottom left;
    }

    .node.tail.negative::after {
        content: var(--th5-weight);
        animation-name: var(--th5-animation);
        right: 45px;
        bottom: 35px;
        transform: rotate(43deg);
        transform-origin: bottom right;
    }

    .node.tail.positive::before {
        content: var(--th5-diagonal-weight);
        animation-name: var(--th5-diagonal-animation);
        right: 44px;
        bottom: 13px;
        transform: rotate(-43deg);
        transform-origin: bottom right;
    }

    .node.parent.positive::before {
        content: var(--th0-diagonal-weight);
        animation-name: var(--th0-diagonal-animation);
        left: 44px;
        bottom: 13px;
        transform: rotate(43deg);
        transform-origin: bottom left;
    }

    .node.source::after, .node-left::after {
        width: 104px;
        line-height: 34px;
        animation-duration: 1.5s;
    }

    .node.source::after {
        content: var(--th1-weight);
        animation-name: var(--th1-animation);
        left: 48px;
    }

    .node-left::after {
        content: var(--th4-weight);
        animation-name: var(--th4-animation);
        left: unset;
        right: 48px;
    }

    .node-bottom::after, .node-top::after {
        width: 130px;
        line-height: 34px;
        transform-origin: left;
        animation-duration: 1.5s;
    }

    .node-bottom::after {
        content: var(--th2-weight);
        animation-name: var(--th2-animation);
        transform: rotate(90deg);
        left: 25px;
        top: 45px;
    }

    .node-top::after {
        content: var(--th3-weight);
        animation-name: var(--th3-animation);
        transform: rotate(270deg);
        left: 24px;
        bottom: 45px;
    }

    .node-diagonal::before {
        content: "";
        width: 186px;
        height: 4px;
        background-color: black;
        display: inline-block;
        position: absolute;
        top: 39px;
        animation-duration: 1.5s;
    }

    .node-diagonal.negative::before {
        animation-name: var(--th2-diagonal-animation);
        transform-origin: top right;
        transform: rotate(-48deg);
        right: 42px;
    }

    .node-diagonal.positive::before {
        animation-name: var(--th1-diagonal-animation);
        transform-origin: top left;
        transform: rotate(48deg);
        left: 42px;
    }

    .node-number::before {
        content: "";
        width: 0;
        text-align: center;
        bottom: 38px;
        background-color: transparent;
    }

    .node-number.positive::before {
        content: var(--th4-diagonal-weight);
        animation: none;
        transform-origin: bottom right;
        transform: rotate(46deg) translate(-146px, -38px);
        top: unset;
        right: 42px;
        left: unset;
    }

    .node-number.negative::before {
        content: var(--th3-diagonal-weight);
        animation: none;
        transform-origin: bottom left;
        transform: rotate(-46deg) translate(46px, -5px);
        top: unset;
        left: 42px;
        right: unset;
    }
}
</style>