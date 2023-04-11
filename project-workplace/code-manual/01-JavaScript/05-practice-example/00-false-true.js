/*
1.&&

1.1两边条件都为true时，结果才为true；
1.2如果有一个为false，结果就为false；
1.3当第一个条件为false时，就不再判断后面的条件

注意：当数值参与逻辑与运算时，结果为true，那么会返回的会是第二个为真的值；如果结果为false，返回的会是第一个为假的值。

2.||

2.1只要有一个条件为true时，结果就为true；
2.2当两个条件都为false时，结果才为false；
2.3当一个条件为true时，后面的条件不再判断

注意：当数值参与逻辑或运算时，结果为true，会返回第一个为真的值；如果结果为false，会返回第二个为假的值；
*/

const testA1 = true
const testA2 = true

const testB1 = true
const testB2 = false

/*
const testA1 = false
const testA2 = false
out

const testA1 = true
const testA2 = false
out

const testA1 = false
const testA2 = true
out

const testA1 = true
const testA2 = true
in
*/
if (testA1 && testA2) {
  console.log('a-in')
} else {
  console.log('a-out')
}

/*
const testB1 = false
const testB2 = false
out

const testB1 = true
const testB2 = false
in

const testB1 = false
const testB2 = true
in

const testB1 = true
const testB2 = true
in
*/
if (testB1 || testB2) {
  console.log('b-in')
} else {
  console.log('b-out')
}