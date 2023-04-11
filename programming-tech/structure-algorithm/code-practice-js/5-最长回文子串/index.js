

/*
* 给你一个字符串 s，找到 s 中最长的回文子串。

示例 1：
输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。

示例 2：
输入：s = "cbbd"
输出："bb"

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/longest-palindromic-substring
* */

// 方法1. 暴力循环
var longestPalindrome1 = function (s) {
  let str = "";
  for (let i = 0; i < s.length; i++) {

    for (let j = i + 1; j <= s.length; j++) {
      const temp = s.slice(i, j);
      // console.log('temp', temp, 'i, j', i, '--', j);
      // console.log('str:', str);
      if (temp == temp.split("").reverse().join("") && temp.length > str.length) {
        str = temp;
      }
    }

  }
  return str;
};

/*
// const testStr1 = "babad" // bab
const testStr1 = "ZCAbabACac" // CAbabAC
console.log('方法1:', longestPalindrome1(testStr1))
*/

// 方法2：动态规划
/*
首先考虑如果字符串长度为1，那么答案就是其本身
如果字符串长度等于2，那么如果s[i] == s[j] 则说明该字符串为回文
那么如果长度大于2呢？s[i] == s[j]的情况下s[i + 1] == s[j-1]，也说明该字符串为回文
如此推论，结果如下：
*/
var longestPalindrome2 = function (s) {
  // 长度1，返回本身
  if (s.length == 1) {
    return s;
  }

  // 创建二阶数组存储从j到i是否是回文数组，0为不回文，1为回文
  /*
  [
  0: []
  1: []
  2: []
  3: []
  4: []
  5: []
  6: []
  7: []
  8: []
  9: [] 
  ]
  */
  let arr = [];
  for (let i = 0; i < s.length; i++) {
    arr[i] = [];
  };

  console.log('arr', arr);

  // 存储最长回文子串的起始位置
  let begin = 0;
  // 存储最长子串的长度
  let max = 0;

  for (let i = 0; i < s.length; i++) {
    let j = 0;
    while (j <= i) {
      // 如果 i-j <= 1 时，说明i位置和j位置要么是重合的，要么是相邻的，即为最后一次查找
      // 否则继续查询[j + 1]到[i - 1]是否为回文
      if (s[j] == s[i] && (i - j <= 1 || arr[j + 1][i - 1])) {
        // 如果符合上述条件，说明j到i是回文
        arr[j][i] = 1
        if (i - j + 1 > max) {
          // 如果当前子串大于存储的子串长度，则替换之
          begin = j;
          // 注意+1，比如从3到5的长度为3 = 5 - 3 + 1
          max = i - j + 1;
        }
      }

      j++;
    }
  }

  return s.substr(begin, max);
}

// const testStr2 = "babad" // bab
const testStr2 = "ZCAbabACac" // CAbabAC
console.log('testStr2', testStr2[0]);
console.log('方法2:', longestPalindrome2(testStr2))



