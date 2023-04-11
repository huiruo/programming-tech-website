package algorithm.a1Base;

public class FindMax {
    public static void main(String[] args) {

        int[] arr = new int[]{1,100,200,999,998};

        int max = arr[0];

        for(int i = 1 ;i<arr.length;i++){
            if(arr[i]>max){
                max = arr[i];
            }
        }

        System.out.println("最大值：" + max);
    }
}
