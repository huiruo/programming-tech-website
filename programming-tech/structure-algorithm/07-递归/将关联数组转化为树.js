let departArrTest = [
    {id: 1, name: '部门1', pid: 0},
    {id: 2, name: '部门2', pid: 1},
    {id: 3, name: '部门3', pid: 1},
    {id: 4, name: '部门4', pid: 3},
    {id: 5, name: '部门5', pid: 4},

    {id: 10, name: '部门1', pid: 9},
    {id: 11, name: '部门1', pid: 10},
]

let departArrTest2 = [
    {id: 1, name: '部门1', pid: 0},
    {id: 2, name: '部门2', pid: 1},
    {id: 3, name: '部门3', pid: 1},
    {id: 4, name: '部门4', pid: 3},
    {id: 5, name: '部门5', pid: 4},

    {id: 10, name: '部门1', pid: 9},
    {id: 11, name: '部门1', pid: 10},
]

/*
[
    {
        "id": 1,
        "name": "部门1",
        "pid": 0,
        "children": [
            {
                "id": 2,
                "name": "部门2",
                "pid": 1,
                "children": []
            },
            {
                "id": 3,
                "name": "部门3",
                "pid": 1,
                "children": [
                    // 结果 ,,,
                ]
            }
        ]
    }
]
* */


/*
对象是引用类型，所以map里边的对象改变，与之对应的原数组中的相同节点对象也会改变。

1、以id为key，构建一个对象obj，用来查找parent

2、遍历原数组，通过parentId从obj中找到父节点，然后把自己插入到父节点的children中
* */
function convert(data) {
    let result = [];
    let map = {};

    data.forEach(item => {
        map[item.id] = item;
    });

    console.log('map:',map);

    data.forEach(item => {
        // item.pid 返回 返回 undefined
        let parentNode = map[item.pid];

        if (parentNode) {
            (parentNode.children || (parentNode.children = [])).push(item);
        } else {
            // 顶级,可以有多个
            result.push(item);
        }
    });

    return result;
}

const tree2= convert(departArrTest)
console.log('以对象方式结果：',tree2)
// console.log('对象方式：',tree2[0].children)
// console.log('对象方式：',tree2[0])


/*
* 方式2:使用递归
* */
function list2tree(list) {
    const tree = []
    for(let i=0; i<list.length;i++){
       const ele = list[i]
       const top = list.find((item)=>{
            return item.id === ele.pid
       })

       if(!top){
          let p = { ...ele }
          p.children = getChildren(ele.id, list)
          tree.push(p)
       }
    }

    function getChildren(id, list) {
        const children = []
        for(const node of list) {
            if(node.pid === id) {
                children.push(node)
            }
        }

        for(const node of children) {
            const children = getChildren(node.id, list)
            if(children.length) {
                node.children = children
            }
        }

        return children
    }

    return tree
}

console.log('getTree 方式2,使用递归:',list2tree(departArrTest2))
