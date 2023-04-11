
/*
* 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

示例1:

输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/longest-substring-without-repeating-characters
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
* */

var lengthOfLongestSubstring = function(s) {
    // 哈希集合，记录每个字符是否出现过
    const occ = new Set();
    const n = s.length;
    // 右指针，初始值为 -1，相当于我们在字符串的左边界的左侧，还没有开始移动
    let rk = -1, ans = 0;
    for (let i = 0; i < n; ++i) {
        if (i !== 0) {
            /*
            * var str = "HELLO WORLD";
            * var n = str.charAt(2) // L
            * */
            // 左指针向右移动一格，移除一个字符
            occ.delete(s.charAt(i - 1));
        }

        while (rk + 1 < n && !occ.has(s.charAt(rk + 1))) {
            // 不断地移动右指针
            occ.add(s.charAt(rk + 1));
            console.log('不断地移动右指针',occ,rk)
            ++rk;
        }
        console.log('ans, rk - i + 1')
        // 第 i 到 rk 个字符是一个极长的无重复字符子串
        ans = Math.max(ans, rk - i + 1);
    }

    return ans;
};

// const str = 'abcdhabcbb'
// const str = 'pwwkew'
const str = 'abcabcbb'
console.log(lengthOfLongestSubstring(str))