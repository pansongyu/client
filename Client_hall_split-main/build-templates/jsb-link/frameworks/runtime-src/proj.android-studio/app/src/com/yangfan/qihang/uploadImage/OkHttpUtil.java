package com.yangfan.qihang.uploadImage;


import com.lzy.imagepicker.bean.ImageItem;
import com.zhy.http.okhttp.OkHttpUtils;
import com.zhy.http.okhttp.builder.GetBuilder;
import com.zhy.http.okhttp.builder.PostFormBuilder;

import android.text.TextUtils;
import android.util.Base64;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.TimeUnit;


public class OkHttpUtil {
    public static final String TAG = "TAG_OkHttpUtil";

    private PostFormBuilder mPost;
    private GetBuilder mGet;

    public OkHttpUtil() {
        OkHttpUtils.getInstance().getOkHttpClient().newBuilder()
                // new OkHttpClient().newBuilder()
                .connectTimeout(20000L, TimeUnit.MILLISECONDS).readTimeout(20000L, TimeUnit.MILLISECONDS)
                .writeTimeout(30 * 1000L, TimeUnit.MILLISECONDS).build();

        mPost = OkHttpUtils.post();
        mGet = OkHttpUtils.get();
    }

    // 封装请求
    public void postRequest(String url, Map<String, String> params, UploadImageStringCallBack callback) {
        mPost.url(url).params(params).build().execute(callback);
    }

    /**
     * 将图片转换成Base64编码的字符串
     */
    public static String imageToBase64(String path){
        if(TextUtils.isEmpty(path)){
            return null;
        }
        InputStream is = null;
        byte[] data = null;
        String result = null;
        try{
            is = new FileInputStream(path);
            //创建一个字符流大小的数组。
            data = new byte[is.available()];
            //写入数组
            is.read(data);
            //用默认的编码格式进行编码
            result = Base64.encodeToString(data, Base64.NO_CLOSE);
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            if(null !=is){
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }
        return result;
    }

    // 上传图片
    public void postImageRequest(String url, Map<String, String> params, ArrayList<ImageItem> pathList, UploadImageStringCallBack callback) {
        if(pathList.size() <= 0) {  // 未选择图片
            return;
        }

        String newPath = BitmapUtils.compressImageUpload(pathList.get(0).path);
        String base64Path = imageToBase64(newPath);
        String type = newPath.substring(newPath.lastIndexOf(".") + 1);
//        Log.e(TAG, " >>>>>>>>>>>>> newPath: " + newPath);
//        Log.e(TAG, " >>>>>>>>>>>>> base64Path: " + base64Path);
//        Log.e(TAG, " >>>>>>>>>>>>> type: " + type);

        mPost.url(url)
                .addParams("img",base64Path)
                .addParams("type",type)
                .build()
                .execute(callback);

    }

}
