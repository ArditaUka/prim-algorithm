<script setup>
</script>
<template>
    <h3 class="text-xl font-semibold pb-2">How does Prim Algorithm Work?</h3>
    <div class="steps">
        <div class="flex">
            <p class="w-16"><b>Step 1:</b></p>
            <p>Determine an arbitrary node as the starting node</p>
        </div>
        <div class="flex">
            <p class="w-16"><b>Step 2:</b></p>
            <p>Select the edges with minimum weight connected to that node</p>
        </div>
        <p><b>Step 3:</b> Repeat step 2 by selecting vertices one by one on the basis of minimum weight edge</p>
    </div>
    <h3 class="text-xl font-semibold pb-2 py-6">Illustration of Prim’s Algorithm</h3>
    <p>Consider the following graph as an example for which we need to find the Minimum Spanning Tree (MST).</p>
    <img src="../assets/img/graph.PNG" alt="Graph">
    <div class="graph_step mt-2">
        <p><b>Step 1:</b> Firstly, we select an arbitrary node that acts as the starting node of the Minimum Spanning Tree. Here we have selected node 0 as the starting node.</p>
        <img src="../assets/img/step1.PNG" alt="Step1">
    </div>
    <div class="graph_step mt-2">
        <p><b>Step 2:</b> All the edges connecting the incomplete MST and other nodes are the edges {0, 1} and {0, 2}. Between these two the edge with minimum weight is {0, 1}. So include the edge and node 1 in the MST.</p>
        <img src="../assets/img/step2.PNG" alt="Step2">
    </div>
    <div class="graph_step mt-2">
        <p><b>Step 3:</b> The edges connecting the incomplete MST to other nodes are {0, 2}, {1, 2}, {1, 3} and {1, 6}. Among these edges the minimum weight is 30 which is of the edges {1, 3}. Let us here include the edge {1, 3} and the node 3 in the MST.</p>
        <img src="../assets/img/step3.PNG" alt="Step3">
    </div>
    <div class="graph_step mt-2">
        <p><b>Step 4:</b> The edges connecting the incomplete MST to other nodes are {0, 2}, {1, 2}, {1, 6}, {3, 4} and {3, 5}.  Add the edge {1, 2} and the node 2 in the MST as it has the least weight</p>
        <img src="../assets/img/step4.PNG" alt="Step4">
    </div>
    <div class="graph_step mt-2">
        <p><b>Step 5:</b> The connecting edges now are {1, 6}, {2, 4}, {2, 5}, {3, 4} and {3, 5}. Note that we are not considering edge {0, 2} since it would form a cycle. Include edge {2, 4} and node 4 in the MST as the edge has the minimum weight among them.</p>
        <img src="../assets/img/step5.PNG" alt="Step5">
    </div>
    <div class="graph_step mt-2">
        <p><b>Step 6:</b> We're left with these connecting edges: {1, 6}, {2, 5}, {3, 5} and {4, 6}. Note that we are not considering edge {3, 4} since it would form a cycle. The edge {4, 6} has the minimum weight, so include that edge and the node 6 in the MST</p>
        <img src="../assets/img/step6.PNG" alt="Step6">
    </div>
    <div class="graph_step mt-2">
        <p><b>Step 7:</b> The connecting edges between the incomplete MST and the other edges are {1, 6}, {2, 5}, {3, 5}, {5, 6} and {6, 7}. The edge with minimum weight is edge {5, 6} which has weight 25. So include this edge and the node 5 in the MST.</p>
        <img src="../assets/img/step7.PNG" alt="Step7">
    </div>
    <div class="graph_step mt-2">
        <p><b>Step 8:</b> Only  the node 7 remains to be included. The minimum weighted edge from the incomplete MST to 7 is {5, 7}. And this is the final structure of MST</p>
        <img src="../assets/img/step8.PNG" alt="Step8">
    </div>
</template>
<style>
.graph_step img {
    width: 435px;
    height: 270px;
}
</style>