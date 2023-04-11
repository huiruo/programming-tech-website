package algorithm.a3Selection;

public class A4MergeSort {
    private static int[] auk;

    public static void main(String[] args){
        int[] array = new int[]{34,53,33,65,23,75,33,6,12,64};
        auk = new int[array.length];
        sort(array,0,array.length-1);
        for (int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }

    public static void sort(int[] array, int lo, int hi){
        if(lo>=hi){return;}
        int mid = lo+(hi-lo)/2;
        sort(array,lo,mid);
        sort(array,mid+1,hi);
        merge(array, lo,mid,hi);
    }

    /*
    * 将方法先将所有元素复制到 aux[] ,然后再归并回到a[] 中。方法再归并时，（第二个for 循环）进行了4个判断：
    * 左半边用尽（取右半边的元素），右半边用尽（取左半边的元素）
    * 右半边的当前元素小于左半边的当前元素（取右半边的元素）
    * 右半边的当前元素大于等于左半边的当前元素（取左半边的元素）
    * */
    public static void merge(int[] array, int lo, int mid, int hi){
        // 将a[lo..mid] 和 a[mid _ 1..hi] 归并
        // 左子数组指向指针
        int i = lo;
        // 右子数组指向指针
        int j = mid+1;
        // 新建备份数组
        // 归并回到a[lo..hi]
        for(int k=lo;k<=hi;k++){
            auk[k] = array[k];
        }

        for(int k=lo;k<=hi;k++){//遍历原数组，考虑把数组的值装到备份数组的哪个位置
            if (i>mid) {//左边数组已遍历完
                array[k] = auk[j];
                j++;
            }

            else if(j>hi){//右边数组遍历完成
                array[k] = auk[i];
                i++;
            }

            else if(auk[i]<auk[j]){//左边数组比右边数组小，把左数组值给到备份数组
                array[k] = auk[i];
                i++;
            }

            else { //左边数组不比右边数组小
                array[k] = auk[j];
                j++;
            }

        }
    }
}
