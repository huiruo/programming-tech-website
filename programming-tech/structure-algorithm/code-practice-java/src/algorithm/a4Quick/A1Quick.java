package algorithm.a4Quick;

public class A1Quick {
        private A1Quick() { }

        /**
         * Rearranges the array in ascending order, using the natural order.
         * @param a the array to be sorted
         */
        public static void sort(int[] a) {
            sort(a, 0, a.length - 1);
            assert isSorted(a);
        }

        // quicksort the subarray from a[lo] to a[hi]
        private static void sort(int[] a, int lo, int hi) {
            if (hi <= lo) return;
            int j = partition(a, lo, hi);
            sort(a, lo, j-1);
            sort(a, j+1, hi);
            assert isSorted(a, lo, hi);
        }

        // 切分,请见快速排序的切分
        // partition the subarray a[lo..hi] so that a[lo..j-1] <= a[j] <= a[j+1..hi]
        // and return the index j.
        private static int partition(int[] a, int lo, int hi) {
            int i = lo;
            int j = hi + 1;
            int v = a[lo];
            while (true) {

                // find item on lo to swap
                while (less(a[++i], v)) {
                    if (i == hi) break;
                }

                // find item on hi to swap
                while (less(v, a[--j])) {
                    if (j == lo) break;      // redundant since a[lo] acts as sentinel
                }

                // check if pointers cross
                if (i >= j) break;

                exch(a, i, j);
            }

            // put partitioning item v at a[j]
            exch(a, lo, j);

            // now, a[lo .. j-1] <= a[j] <= a[j+1 .. hi]
            return j;
        }


    public static int select(int[] a, int k) {
            // if (k < 0 || k >= a.length) {
            //     throw new IllegalArgumentException("index is not between 0 and " + a.length + ": " + k);
            // }
            // StdRandom.shuffle(a);
            int lo = 0, hi = a.length - 1;
            while (hi > lo) {
                int i = partition(a, lo, hi);
                if      (i > k) hi = i - 1;
                else if (i < k) lo = i + 1;
                else return a[i];
            }
            return a[lo];
        }



        /***************************************************************************
         *  Helper sorting functions.
         ***************************************************************************/

        // is v < w ?
        private static boolean less(Comparable v, Comparable w) {
            if (v == w) return false;   // optimization when reference equals
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
        private static boolean isSorted(int[] a) {
            return isSorted(a, 0, a.length - 1);
        }

        private static boolean isSorted(int[] a, int lo, int hi) {
            for (int i = lo + 1; i <= hi; i++)
                if (less(a[i], a[i-1])) return false;
            return true;
        }


        // print array to standard output
        private static void show(int[] a) {
            for (int i = 0; i < a.length; i++) {
                System.out.println(a[i]);
            }
        }

        public static void main(String[] args) {
            int[] array = {52,63,14,59,68,35,8,67,45,99};
            System.out.println("原数组：");
            for (int i : array) {
                System.out.print(i+" ");
            }

            // A1Quick.show(array);
            // assert isSorted(array);

            // shuffle
            // StdRandom.shuffle(a);

            for (int i = 0; i < array.length; i++) {
                select(array, i);
            }
            // display results again using select
            System.out.println("排序后：");
            for (int i : array) {
                select(array, i);
                System.out.print(i+" ");
            }
    }
}