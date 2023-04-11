/**
用js去掉首尾部空格
let testStr = `  hello world,ruo  `;
时间复杂度：最坏：o(n),和收尾空格数相关
 */
let testStr = `  hello world,ruo  `;

function fn(str) {
    const strArr = str.split('')
    const blankW = ` `
    let sumsTest = 0

    for (let i = 0; i < strArr.length; i++) {
        sumsTest = sumsTest + 1

        const element = strArr[i]
        if (element !== blankW) {
            console.log('h:', element, i)
            // 定位了前面字符,去掉了前面的空格
            strArr.splice(0, i)
            // console.log('去掉之后strArr', strArr, strArr.length)

            /*
            * 反向循环去掉后面空格
            * */
            let whileLength = strArr.length
            while (whileLength !== 0) {
                // console.log('反向循环：', strArr[whileLength - 1], 'index:', whileLength - 1)
                let forWileElement = strArr[whileLength - 1]
                if (forWileElement !== blankW) {
                    strArr.splice(whileLength, strArr.length - whileLength)
                    break
                }

                whileLength = whileLength - 1
                sumsTest = sumsTest + 1
            }

            console.log(`n为：${str.length}计算次数:', ${sumsTest}`)
            console.log('分割线========》')
            break
        }
    }

    return strArr.join('')
}

let testStr2 = `  hello world haha   hhhhhh  `;
let testStr3 = `                         hh          hhhh                                    `;
let testStr4 = `                         h                                    `;
let testStr5 = `                                                                 `;
console.log('target:', fn(testStr))
console.log('target:', fn(testStr2))
console.log('target:', fn(testStr3))
console.log('target:', fn(testStr4))
console.log('target:', fn(testStr5))
