package dataStructure;

import java.util.ArrayList;

/*
 * 判断101-200之间有多少个素数，并输出所有素数。
 * 素数:质数定义为在大于1的自然数中，除了1和它本身以外不再有其他因数。
 *     100以内的质数有2，3，5，7，11，13，17，19，23，29，31，37，41，43，47，53，59，61，67，71，73，79，83，89，97，在100内共有25个质数
 *
 * 奇数：在整数中，不能被2整除的数叫做奇数
 * 100以内偶数：2、4、6、8、10、12、14、16、18、20、22、24、26、28、30、32、34、36、38、40、42、44、46、48、50、52、54、56、58、60、62、64、66、68、70、72、74、76、78、80、82、84、86、88、90、92、94、96、98。
 * 100以内奇数：1、3、5、7、9、11、13、15、17、19、21、23、25、27、29、31、33、35、37、39、41、43、45、47、49、51、53、55、57、59、61、63、65、67、69、71、73、75、77、79、81、83、85、87、89、91、93、95、97、99
 * 性质：
 * 两个连续整数中必有一个奇数和一个偶数；
 * 奇数+奇数=偶数；偶数+奇数=奇数；偶数+偶数+...+偶数=偶数；
 * 奇数-奇数=偶数；偶数-奇数=奇数；奇数-偶数=奇数；
 * n个奇数的乘积是奇数，n个偶数的乘积是偶数；算式中有一个是偶数，则乘积是偶数；
 * */
public class HelloWorld {
    public static void main(String[] args) {
        // int arrIndex = 0;
        // int[] a = new int[];

        // 使用 ArrayList 代替数组
        ArrayList<Integer> arrayList=new ArrayList();

        ArrayList<Integer> aLEven=new ArrayList();

        ArrayList<Integer> aLOdd =new ArrayList();

        for (int i =101;i<=200;i++){
            if(isPrime(i)){
                // a[arrIndex] = i;
                arrayList.add(i);
                // arrIndex ++;
            }
        }

        // 判断100以内有多少偶素
        for (int i =1;i<=100;i++){
            if(isEvenNumber(i)){
                aLEven.add(i);
            }
        }

        // 判断100以内有多少奇数
        for (int i =1;i<=100;i++){
            if(!isEvenNumber(i)){
                aLOdd.add(i);
            }
        }

        System.out.println("质数："+arrayList);
        System.out.println("100以内偶数："+aLEven);
        System.out.println("100以内奇数："+aLOdd);
    }

    public static  boolean isEvenNumber(int num){
        if(num % 2 == 0){
            return true;
        }
        return false;
    }

    public static boolean isPrime(int num) {

        boolean isPrime = true;
        int len = num/2;

        for(int i=2;i<len;i++) {

            if(num % i == 0) {

                isPrime=false;

                break;
            }

        }

        if(num==2) {
            return true;
        }

        return isPrime;
    }

}
