/*
保持数组始终有 4 个元素
['','','','']
或则
['123','345','','']
*/

const handleNotes = (valueArr) => {
  if (valueArr.length < 4) {
    valueArr.push('')
    return handleNotes(valueArr)
  } else {
    return valueArr
  }
}

let example = 'test\nfjeofjeo\n'

const inputArr = handleNotes(example.split('\n'))
console.log('input:', inputArr)
// ['test', 'fjeofjeo', '', '']


// 将上面的对象形式还原成string
// /*
let input = {
  key1: 'test',
  key2: 'fjeofjeo',
  key3: '',
  key4: '',
}

let notes = ''
if (input) {
  const enter = '\n'
  const inputKeys = Object.keys(input)
  const length = inputKeys.length - 1
  inputKeys.forEach((key, index) => {
    if (index < length) {
      notes = notes + `${input[key] + enter}`
    } else {
      notes = notes + input[key]
    }
  })
}
console.log('notes:', notes);
// */
