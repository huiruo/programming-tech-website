package algorithm.a3Selection;

import java.util.Comparator;

/*
在算法实现时，每一轮确定最小元素的时候会通过不断地比较交换来使得首位置为当前最小，
交换是个比较耗时的操作。其实我们很容易发现，在还未完全确定当前最小元素之前，这些交换都是无意义的。

因此可以通过设置一个变量min，每一次比较出存储较小元素，并且记录当前元素的数组下标，
当本轮循环结束之后，那这个变量min存储的就是当前最小元素的下标，此时再执行交换操作,
以此确定本轮遍历的最小元素放到了数组前部。
* */
public class A1SimpleSelction {

    // exchange a[i] and a[j]
    private static void exch(int[] a, int i, int j) {
        int swap = a[i];
        a[i] = a[j];
        a[j] = swap;
    }

    // is v < w ?
    private static boolean less(Comparable v, Comparable w) {
        return v.compareTo(w) < 0;
    }

    // is v < w ?
    private static boolean less(Comparator comparator, Object v, Object w) {
        return comparator.compare(v, w) < 0;
    }

    // is the array a[] sorted?
    private static boolean isSorted(int[] a) {
        return isSorted(a, 0, a.length - 1);
    }

    // is the array sorted from a[lo] to a[hi]
    private static boolean isSorted(int[] a, int lo, int hi) {
        for (int i = lo + 1; i <= hi; i++)
            if (less(a[i], a[i-1])) return false;
        return true;
    }


    /*
    *  思路：
    * 在冒泡排序上做了优化，减少了交换次数，在首轮选择最大/最小的数放在第一项，
    * 一轮之后第一项是有序的了，第二轮从第二项开始选择最大/最小的数放在第二项，
    * 以此类推，直到整个数组完全有序。
    *
    * 比较 （N-1)+(N-2)+...+2+1 = N*(N-1)/2=N2/2
    * 交换  0——3*（N-1）=3*（N-1）/2=3/2*N
    * 总时间 N2/2+3/2*N
    * */
    public static void sort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n; i++) {
            int min = i;
            System.out.println("最小minB："+a[i]+" i:"+i);
            for (int j = i+1; j < n; j++) {
                // if (less(a[j], a[min])) min = j;
                if(a[j]<a[min]){
                    System.out.println("和a[min]比"+a[min]+"确定最小=====："+a[j]);
                    min = j;
                }
            }
            exch(a, i, min);
            System.out.println("排序中：");
            for (int z : a) {
                System.out.print(z+" ");
            }
            System.out.println("====分割线====");
            assert isSorted(a, 0, i);
        }
        assert isSorted(a);
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
