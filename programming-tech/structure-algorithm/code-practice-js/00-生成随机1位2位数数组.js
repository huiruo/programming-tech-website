function generateRandomArray(length) {
  const arr = [];

  for (let i = 0; i < length; i++) {
    if (Math.random() < 0.5) {
      arr.push(Math.floor(Math.random() * 10)); // 生成一位数
    } else {
      arr.push(Math.floor(Math.random() * 90) + 10); // 生成两位数
    }
  }

  return arr;
}

const length = 12
console.log(generateRandomArray(length));
