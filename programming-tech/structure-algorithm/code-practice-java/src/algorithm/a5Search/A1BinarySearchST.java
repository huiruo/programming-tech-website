package algorithm.a5Search;

import algorithm.library.Queue;
import algorithm.library.StdIn;
import algorithm.library.StdOut;

/**
 *******************************************************************
 * public class ST<key,value> 有序符号表API
 *******************************************************************
 * ST()                             创建一张符号表
 * void put(Key key,Value val)      将键值对存入表中（若值为空则将键key从表中删除） 
 * Value get(Key key)               获取键key对应的值（若键key不存在则返回null） 
 * void delete(Key key)             从表中删去键key（及其对应的值） 
 * boolean contains(Key key)        键key在表中是否有对应的值 
 * boolean isEmpty()                表是否为空
 * int size()                       表中的键值对数量
 * Iterable<Key> keys()             表中的所有键的集合
 *******************************************************************
 * 有序符号表额外API
 *******************************************************************
 * Key min()最小的键
 * Key max()最大的键
 * Key floor(Key key)                   小于等于key的键的数量
 * Key ceiling(Key key)                 大于等于key的键的数量
 * int rank(Key key)                    等于key的键的数量
 * Key select(int i)                    排位为i的键
 * void deleteMin()                     删除最小的键
 * void deleteMax()                     删除最大的键
 * int size(Key lo,Key hi)              [lo,hi]之间键的数量
 * Iterable<Key > keys(Key lo,Key hi)   [lo,hi]之间所有的键，已排序
 * Iterable<Key > keys() 有序表中所有的键，已排序
 *
 *******************************************************************
 */
public class A1BinarySearchST<Key extends Comparable<Key>,Value>{
    private int N;
    private Key[] keys;
    private Value[] values;

    /**
     * 创建一张符号表
     */
    public A1BinarySearchST() {
        this(2);//初始默认表容量
    }

    /**
     * 创建一张符号表,并给定初始容量
     * @param capacity
     */
    public A1BinarySearchST(int capacity) {
        if(capacity <= 0)
            throw new IllegalArgumentException();
        keys = (Key[])new Comparable[capacity];
        values = (Value[]) new Object[capacity];
        N = 0;
    }

    /**
     * 将键值对存入表中（若值为空则将键key从表中删除）
     * @param key 待更新键
     * @param val 待更新值
     */
    public void put(Key key,Value value) {
        if(key == null)
            throw new IllegalArgumentException();

        if(value == null) {
            delete(key);
            return;
        }

        int i = rank(key);

        //key已经存在于table
        if(i<N && key.compareTo(keys[i]) == 0) {
            values[i] = value;
            return;
        }

        //插入新的key-value对
        if(N == keys.length) resize(2*N);
        for(int j = N;j>i;j--) {
            keys[j] = keys[j-1];
            values[j] = values[j-1];
        }
        keys[i] = key;
        values[i] = value;
        N++;
    }

    /**
     * 获取键key对应的值（若键key不存在则返回null）
     * @param key 键
     * @return 键key对应的值（若键key不存在则返回null）
     */
    public Value get(Key key) {
        if(key == null)
            throw new NullPointerException();
        if(isEmpty())
            return null;
        int i = rank(key);
        if(i < N && key.compareTo(keys[i])==0) return values[i];
        return null;
    }

    /**
     * 从表中删去键key（及其对应的值） 
     * @param key 待删除的键
     */
    public void delete(Key key) {
        if(key == null) throw new NullPointerException();
        if(isEmpty()) throw new NoSuchElementException("Symbol table underflow error");

        int i = rank(key);
        //key不在table中
        if(i == N || !key.equals(keys[i]))
            throw new NoSuchElementException();

        //删除
        while(i<N) {
            keys[i] = keys[i+1];
            values[i] = values[i+1];
        }
        N--;
        keys[N] = null; //避免游离
        values[i] = null;

        //resize if 1/4 full 
        if(N>0 && N == keys.length/4) resize(keys.length/2);
    }

    /**
     * 键key在表中是否有对应的值 
     * @param key 键
     * @return 键key在表中有对应的值,返回true，否则，返回false 
     */
    public boolean contains(Key key) {
        if(key == null)
            throw new NullPointerException();
        return get(key) != null;
    }

    /**
     * 表是否为空
     * @return 空，返回true；否则，返回false
     */
    public boolean isEmpty() {
        return N == 0;
    }

    /**
     * 获取表中的键值对数量
     * @return 表中的键值对数量
     */
    public int size() {
        return N;
    }

    /**************************************************
     * 有序符号表额外增加API
     ***************************************************/

    /**
     * 小于key的键的数量
     * @param key
     * @return key在表中的排位
     */
    public int rank(Key key) {
        if(key == null)
            throw new NullPointerException();
        //二分查找
        int lo = 0,hi = N-1;
        while(lo<=hi) {
            int mid = (lo + hi)/2;
            int cmp = keys[mid].compareTo(key);
            if(cmp == 0) return mid;
            if(cmp > 0) hi = mid-1;
            else lo = mid+1;
        }
        return lo;
    }

    /**
     * 排位为i的键
     * @param i
     * @return
     */
    public Key select(int i) {
        if(i<0 || i>=N)  return null;
        return keys[i];
    }

    /**
     * 小于等于key的最大键
     * @param key
     * @return
     */
    public Key floor(Key key) {
        if(key == null) throw new NullPointerException();
        int i = rank(key);
        if(i<N && key.compareTo(keys[i]) == 0) return key;
        if(i == 0) return null;
        return keys[i-1];
    }

    /**
     * 大于等于key的最小键
     * @param key
     * @return
     */
    public Key ceiling(Key key) {
        if(key == null) throw new NullPointerException();
        int i = rank(key);
        if(i == N) return null;
        return keys[i];
    }

    /**
     * 最小的键
     * @return
     */
    public Key min() {
        if(isEmpty())   return null;
        return keys[0];
    }

    /**
     * 最大的键
     * @return
     */
    public Key max() {
        if(isEmpty())   return null;
        return keys[N-1];
    }

    /**
     * 删除最小的键
     */
    public void deleteMin() {
        delete(min());
    }

    /**
     * 删除最大的键
     */
    public void deleteMax() {
        delete(max());
    }

    /**
     * [lo,hi]之间键的数量
     * @param 1o
     * @param hi
     * @return
     */
    public int size(Key lo,Key hi) {
        if(lo == null || hi == null) throw new NullPointerException();
        if(lo.compareTo(hi)>0) return 0;
        int l = rank(lo);
        int h = rank(hi);
        if(h==N || keys[h].compareTo(hi)!=0) h--;
        return h-l+1;
    }

    /**
     * [lo,hi]之间所有的键，已排序
     * @param lo
     * @param hi
     * @return
     */
    public Iterable<Key> keys(Key lo,Key hi) {
        if(lo == null || hi == null) throw new NullPointerException();

        Queue<Key> queue = new Queue<Key>();
        if(lo.compareTo(hi)>0) return queue;

        int low = rank(lo);
        int high = rank(hi);
        if(high==N || keys[high].compareTo(hi)!=0)
            high--;
        for(int i=low;i<=high;i++)
            queue.enqueue(keys[i]);
        return queue;
    }

    /**
     * 表中所有键的集合，已排序
     * @return
     */
    public Iterable<Key> keys() {
        return keys(min(),max());
    }

    /***************************************************************************
     * General helper functions.
     ***************************************************************************//**
     * 重新定义keys和values的容量
     * @param size
     */
    private void resize(int size) {
        if(size <= N)
            throw new IllegalArgumentException();
        Key[] newkeys = (Key[])new Comparable[size];
        Value[] newvalues = (Value[])new Object[size];
        System.arraycopy(keys, 0, newkeys, 0, keys.length);
        System.arraycopy(values, 0, newvalues, 0, values.length);
        keys = newkeys;
        values = newvalues;
    }

    /**
     * Test
     * @param args
     */
    public static void main(String[] args) {
        A1BinarySearchST<String, Integer> st = new A1BinarySearchST<String, Integer>();
        for (int i = 0; !StdIn.isEmpty(); i++) {
            String key = StdIn.readString();
            st.put(key, i);
        }
        for (String s : st.keys())
            StdOut.println(s + " " + st.get(s));
    }
}