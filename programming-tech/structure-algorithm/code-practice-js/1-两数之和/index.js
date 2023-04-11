
/*
* 给定一个整数数组 nums和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那两个整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

示例 1：

输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/two-sum
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
* */

/*
* 使用暴破，会导致时间复杂度为 n^2n 
所以我们很容易想到用哈希表来解决这个问题。
我们遍历到数字a时，用 target 减去 a，就会得到 b，若 b 存在于哈希表中，我们就可以直接返回结果了。
若 b不存在，那么我们需要将 a存入哈希表，好让后续遍历的数字使用。
* */
const twoSum1 = function (nums, target) {
    const map = new Map()
    for (let i = 0; i < nums.length; i++) {
        const x = target - nums[i]
        if (map.has(x)) {
            return [map.get(x), i]
        }
        map.set(nums[i], i)
        console.log('map', map)
    }
};

const nums = [2, 9, 7, 11, 15, 8, 1]
console.log(twoSum1(nums, 9))
// console.log(twoSum1(nums,10))
// console.log(twoSum1(nums,3))
