const departArrTest = [{
    id: 1,
    name: '部门1',
    pid: 0,
    children: [{
        "id": 2,
        "name": "部门2",
        "pid": 1,
        "children": []
    },
    {
        "id": 3,
        "name": "部门3",
        "pid": 1,
        "children": []
    }]
},
{
    id: 10,
    name: '部门1',
    pid: 9,
    children: [
        {id: 11, name: '部门1', pid: 10},
    ]
}]



/*
广度优先遍历：
广度优先搜索算法会从指定的第一个顶点开始遍历图，先访问其所有的邻点（相邻顶点），就像一次访问图的一层。
换句话说，就是先宽后深地访问顶点
* */
const generateList = (data, dataList) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i]
        if (node.children) {
            generateList(node.children, dataList, node.id)
        }
        delete node['children'];
        dataList.push(node)
    }

    return dataList
}

console.log('将树形节点改为一维数组:',generateList(departArrTest, []))
