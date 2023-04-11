package algorithm.a3Selection;

public class A3ShellSort {
    /*
    * 插入排序：只会交换相邻的元素，只能一点点从数组一端移动到另一端。例如：如果主键最小元素正好在数组尽头，挪动到正确位置需要 N - 1次移动。
    * 对于大规模插入排序很慢；
    *
    * 希尔排序：使任意间隔为h的元素都是有序的,这样的数组称为 h有序数组。
    * 在排序时候，如果h很大，就能将元素移动到很远地方，为实现更小的 h有序操作方便。
    * 用这种方式，对于任意以1 结尾的h序列，我们都能将数组排序。这就是希尔排序。
    * */

    /*
    * 参考：http://data.biancheng.net/view/119.html
    * 希尔排序的特点及性能
    * 1.希尔排序只使用了一种增量的方式去改进插入排序，实际上希尔排序在内部还是使用插入排序进行处理的。
    * 但是这个增量确实有它的意义，不管数列有多长，刚开始时增量会很大，所以每一组待排序的数列的规模会很小，
    * 排序会很快。尽管后来数列的规模慢慢变大，但是数列整体已经开始趋于有序了，所以插入排序的速度还是越来越快的。
    * 2.在时间复杂度上，由于增量的序列不一定，所以时间复杂度也不确定。
    * 这在数学上还无法给出确切的结果。我们在上面采用的是每次除以 2 的方式，但是据研究，有以下几种可推荐的序列：
    * + N/3+1，N/3^2+1，N/3^3+1……（据说在序列数 N<100 000 时最优）；
    * + 2^k-1，2^(k-1)-1，2^(k-2)-1……（设 k 为总趟数）；
    *
    * 3.对于每次除以 2 的增量选择，希尔排序的最好情况当然是本身有序，每次分区都不用排序，时间复杂度是 O(n^2),
    * 但是在最坏的情况下仍然每次都需要移动，时间复杂度与直接插入排序在最坏情况下的时间复杂度没什么区别，也是 O(n^2)。
    *
    * 空间复杂度：
    * 在希尔排序的实现中仍然使用了插入排序，只是进行了分组，并没有使用其他空间，所以希尔排序的空间复杂度同样是 O(1)，是常量级的。
    * 在希尔排序中会进行分组、排序，所以同样值的元素，其相对位置有可能会发生变化，这是因为同样值的元素若不在一个组中，则有可能后面的元素会被移动到前面。所以希尔排序是不稳定的算法。
    *
    * 希尔排序的适用场景:
    * 在使用希尔排序时，需要选择合适的增量序列作为排序辅助，而这也是一个比较复杂的抉择。所以希尔排序在实际使用排序时并不常用。
    * 但是作为一个优化排序的思想，我们还是应该好好学习它。
    *
    * a /= b;   // 等同于 a = (int)(a / b);
    * */
    /**
     * Rearranges the array in ascending order, using the natural order.
     * @param a the array to be sorted
     */
    public static void sort(int[] a) {
        int n = a.length;

        // 3x+1 increment sequence:  1, 4, 13, 40, 121, 364, 1093, ...
        int h = 1;
        while (h < n/3) {
            System.out.println("n/3的值："+n/3);
            h = 3*h + 1;
            System.out.println("h的值："+h);
        };

        while (h >= 1) {
            // h-sort the array
            // 将数组变为h有序
            for (int i = h; i < n; i++) {
                // 将 a[i] 插入到 a[i-h],a[i-2*h],a[i-3*h]... 之中
                for (int j = i; j >= h && a[j] < a[j-h]; j -= h) {
                    System.out.println("h的值"+h);
                    System.out.println("和"+a[j]+"比"+a[j-h]+"确定最小=====："+a[j]+",开始交换"+a[j]+"和"+a[j-h]);
                    exch(a, j, j-h);
                }
            }
            // h 在这里重新赋值
            h /= 3;
        }
    }



    /***************************************************************************
     *  Helper sorting functions.
     ***************************************************************************/

    // is v < w ?
    private static boolean less(Comparable v, Comparable w) {
        return v.compareTo(w) < 0;
    }

    // exchange a[i] and a[j]
    private static void exch(int[] a, int i, int j) {
        int swap = a[i];
        a[i] = a[j];
        a[j] = swap;
    }


    /***************************************************************************
     *  Check if array is sorted - useful for debugging.
     ***************************************************************************/
    private static boolean isSorted(Comparable[] a) {
        for (int i = 1; i < a.length; i++)
            if (less(a[i], a[i-1])) return false;
        return true;
    }

    // is the array h-sorted?
    private static boolean isHsorted(Comparable[] a, int h) {
        for (int i = h; i < a.length; i++)
            if (less(a[i], a[i-h])) return false;
        return true;
    }

    // print array to standard output
    private static void show(int[] a) {
        for (int i = 0; i < a.length; i++) {
            // StdOut.println(a[i]);
            System.out.println(a[i]);
        }
    }

    /**
     * Reads in a sequence of strings from standard input; Shellsorts them;
     * and prints them to standard output in ascending order.
     *
     * @param args the command-line arguments
     */
    public static void main(String[] args) {
        // int[] array = {5, 9, 1, 9, 5, 3, 7, 6, 1};
        int[] array = {52,63,14,59,68,35,8,67,45,99};
        System.out.println("原数组：");
        for (int i : array) {
            System.out.print(i+" ");
        }
        System.out.println();
        A3ShellSort.sort(array);
        System.out.println("排序后：");
        for (int i : array) {
            System.out.print(i+" ");
        }
        // show(array);
    }
}
