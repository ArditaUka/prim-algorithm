export function useGraph(numOfEdges, graph, setNodeData, V, tree, level='easy') {
    
    return [draw(numOfEdges, graph, setNodeData, level), getMST(graph, V, tree)];
    
  }

  /*------------------------------DRAW GRAPH--------------------------------------*/
  function draw(numOfEdges, graph, setNodeData, level) {
    let nrOfNodes = level === 'easy' ? 3 : (level === 'medium' ? 5 : 7);
    
    //iterate through the number of edges which will be random
    for (let i = 0; i < numOfEdges; i++) {
        //a random number from 0 to maximum number of nodes, since these are the possible node numbers
        let x = Math.floor(Math.random() * (nrOfNodes - 0 + 1)) + 0;
        let y = Math.floor(Math.random() * (nrOfNodes - 0 + 1)) + 0;

        //I'm setting the weight to be between 20-60
        let w = Math.floor(Math.random() * (60 - 20 + 1)) + 20;
        
        //if x is equal to y or if path x,y already has a weight or that weight is undefined generate new paths for this edge
        while (x === y || (graph[x][y] !== 0 ) || graph[x][y] == undefined) {
            x = Math.floor(Math.random() * (nrOfNodes - 0 + 1)) + 0;
            y = Math.floor(Math.random() * (nrOfNodes - 0 + 1)) + 0;
        }

        //add the edge weight with generated points of path
        addEdge(x, y, w, graph, setNodeData);
    }

    //if there is any node that has no edge at all
    graph.forEach((el, index) => {
        const isAllZero = el.every(item => item === 0 || item === undefined);

        if (isAllZero) {
            let x = 0;
            let y = 0;

            let w = Math.floor(Math.random() * (60 - 20 + 1)) + 20;

            while (x === y || graph[x][y] === undefined) {
                x = index;
                y = Math.floor(Math.random() * (nrOfNodes - 0 + 1)) + 0;
            }
            addEdge(x, y, w, graph, setNodeData);
        }
    });
 }

function addEdge(x, y, w, graph, setNodeData) {
    //since it is undirected graph add same weight to both [x][y] and [y][x]
    graph[x][y] = w;
    graph[y][x] = w;
        
    setNodeData(x, y, w);
 }
 /*--------------------------END DRAW GRAPH------------------------------------*/

 /*--------------------------FIND MST-----------------------------------------*/
 function getMST(graph, V, tree) {
    const selected = new Array(V).fill(false);

    selected[0] = true;
    
    //MST => edges = V-1
    let edges = 0;

    while( edges < V-1){

    let min = Number.MAX_SAFE_INTEGER;
    let x = 0, y = 0;

    for(let u = 0; u < V; u++){
        //the node that's already selected
        if(selected[u]){
            //adjacent node with min weight of the edge
            for(let v = 0; v < graph[u].length; v++){
                if(!selected[v] && graph[u][v] != 0 && graph[u][v] != undefined){
                    //it should be a min node
                    if(min > graph[u][v]){
                        min = graph[u][v];
                        x = u;
                        y = v;
                    }
                }
            }
        }
    }

    //select node and add its weight to the tree array
    tree.value.push(graph[x][y]);
    selected[y] = true;
    edges++;
    }
}
 /*--------------------------END FIND MST------------------------------------*/