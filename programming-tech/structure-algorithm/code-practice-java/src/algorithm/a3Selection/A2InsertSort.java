package algorithm.a3Selection;

public class A2InsertSort {
    // exchange a[i] and a[j]
    private static void exch(int[] a, int i, int j) {
        int swap = a[i];
        a[i] = a[j];
        a[j] = swap;
    }
    /*
    * 思路：
    * 插入排序在排序过程中是局部有序，随着插入项的增多，有序部分的项的位置会发生改变，
    * 而冒泡排序和选择排序每轮确定的项数的位置是永远不变的。
    * 在首轮，选择第二项作为插入项，然后取出这一项放在一个变量中，和前一项比较而且小/大，
    * 则前一项后移到第二项的位置，
    * 然后第二项也就是插入项放在前一项的位置，第二轮选择第三项作为插入项然后取出和前一项也就是第二项比较如果小/大
    * ，第二项后移到插入项,
    * 然后插入相在和第一项比较如果小/大，则第一项后移到第二项，插入项放在第一项，以此类推。
    *
    * 总结：只会交换相邻的元素，只能一点点从数组一端移动到另一端。例如：如果主键最小元素正好在数组尽头，挪动到正确位置需要 N - 1次移动。
    *
    * 插入排序：第一轮最多比较一次，第二轮最多比较俩次，
    * 最后一轮比较N-1次，所以最多比较N*(N-1)/2。
    *
    * 复制的次数和比较的次数大致相等，但是复制消耗的时间比交换要小.
    *
    * 比较 0——N*(N-1)/2=N*(N-1)/4=N2/4
    * 复制 0——N*(N-1)/2=N*(N-1)/4=N2/4
    * 总时间 N2//2
    * 插入排序算法比冒泡快一倍，比选择排序略快一点，但这些算法都是O(N2)的时间级别。
    * */
    public static void sort(int[] a) {
        int n = a.length;
        for (int i = 1; i < n; i++) {
            System.out.println("最小minB："+a[i]+" i:"+i);
            for (int j = i; j > 0 && a[j]<a[j-1]; j--) {
                System.out.println("和a[min]比"+a[i]+"确定最小=====："+a[j]+",开始交换"+a[j]+"和"+a[j-1]);
                exch(a, j, j-1);
            }
        }
    }

    public static void main(String[] args) {
        //模拟数据
        int[] array = {52,63,14,59,68,35,8,67,45,99};
        System.out.println("原数组：");
        for (int i : array) {
            System.out.print(i+" ");
        }
        System.out.println();
        sort(array);
        System.out.println("排序后：");
        for (int i : array) {
            System.out.print(i+" ");
        }
    }
}
