const fs = require('fs')
const path = require('path')

const wait = () => new Promise((resolove, reject) => {
  setTimeout(resolove(true), 3)
})
fs.readFile(path.resolve(__dirname, './vue.config.js'), 'utf-8', async (err, data) => {
  console.log('读取的文件内容')
  await wait()
  console.log('测试测试')
  process.nextTick(() => {
    console.log('nextTick')
  })
})

setTimeout(() => {
  console.log('定时器任务0')
}, 0)


setTimeout(() => {
  console.log('定时器任务100')
}, 1000)


setImmediate(() => {
  console.log('立即执行')
})

Promise.resolve().then(() => {
  console.log('promise')
})

process.nextTick(() => {
  console.log('外层nextTick')
})

console.log('外层同步')
/*
外层同步
外层nextTick
promise
定时器任务0
立即执行
读取的文件内容
测试测试
nextTick
定时器任务100
*/
