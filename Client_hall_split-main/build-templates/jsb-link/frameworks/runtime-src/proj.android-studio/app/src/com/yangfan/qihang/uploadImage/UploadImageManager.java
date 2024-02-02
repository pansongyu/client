package com.yangfan.qihang.uploadImage;

import android.content.Intent;
import android.util.Log;

import com.lzy.imagepicker.ImagePicker;
import com.lzy.imagepicker.bean.ImageItem;
import com.lzy.imagepicker.ui.ImageGridActivity;
import com.lzy.imagepicker.view.CropImageView;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.NativeMgr;
import org.json.JSONObject;

import java.util.ArrayList;

import okhttp3.Call;

/*
 *  上传图片的管理类
 */
public class UploadImageManager {
    public static AppActivity app = null;

    public static final String TAG = "TAG_UploadImageManager";
    public static final String LINE_URL = "http://qh.qp355.com/UploadImg.php";

    public static final int IMAGE_ITEM_ADD = -1;
    public static final int REQUEST_CODE_SELECT = 100;
    public static final int REQUEST_CODE_PREVIEW = 101;
    private static final int maxImgCount = 8; // 允许选择图片最大数

    private OkHttpUtil httpUtil;
    private String url = "";

    private static UploadImageManager instance;

    private UploadImageManager() {

    }

    public void setUrl(String _url) {
        this.url = _url;
    }

    public static UploadImageManager getInstance() {
        if (instance == null) {
            synchronized (UploadImageManager.class) {
                if (instance == null) {
                    instance = new UploadImageManager();
                }
            }
        }
        return instance;
    }

    public void initAppActivity(AppActivity app) {
        com.yangfan.qihang.uploadImage.UploadImageManager.app = app;
    }

    public void init(AppActivity app) {
        this.initAppActivity(app);

       httpUtil = new OkHttpUtil();
        // 最好放到 Application oncreate执行
        initImagePicker();
    }

    // 访问相册
    public void openPhotoAlbum(String _url) {
        _url = _url != null ? _url: LINE_URL;
        this.setUrl(_url);
        Intent intent1 = new Intent(app, ImageGridActivity.class);
        app.startActivityForResult(intent1, REQUEST_CODE_SELECT);
    }

    private void initImagePicker() {
        ImagePicker imagePicker = ImagePicker.getInstance();
        imagePicker.setImageLoader(new GlideImageLoader()); // 设置图片加载器
        imagePicker.setShowCamera(true); // 显示拍照按钮
        imagePicker.setCrop(true); // 允许裁剪（单选才有效）
        imagePicker.setSaveRectangle(true); // 是否按矩形区域保存
        imagePicker.setSelectLimit(maxImgCount); // 选中数量限制
        imagePicker.setMultiMode(false); // 多选
        imagePicker.setStyle(CropImageView.Style.RECTANGLE); // 裁剪框的形状
        imagePicker.setFocusWidth(500); // 裁剪框的宽度。单位像素（圆形自动取宽高最小值）
        imagePicker.setFocusHeight(500); // 裁剪框的高度。单位像素（圆形自动取宽高最小值）
        imagePicker.setOutPutX(500); // 保存文件的宽度。单位像素
        imagePicker.setOutPutY(500); // 保存文件的高度。单位像素
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == ImagePicker.RESULT_CODE_ITEMS) {
            // 添加图片返回
            if (data != null && requestCode == REQUEST_CODE_SELECT) {
                ArrayList<ImageItem> images = (ArrayList<ImageItem>) data
                        .getSerializableExtra(ImagePicker.EXTRA_RESULT_ITEMS);
                if (images != null) {
                    this.uploadImage(images);
                }
            }
        } else if (resultCode == ImagePicker.RESULT_CODE_BACK) {
            // 预览图片返回
            if (data != null && requestCode == REQUEST_CODE_PREVIEW) {
//                ArrayList<ImageItem> images = (ArrayList<ImageItem>) data
//                        .getSerializableExtra(ImagePicker.EXTRA_IMAGE_ITEMS);
//                if (images != null) {
//
//                }
            }
        }
    }

    private void uploadImage(ArrayList<ImageItem> pathList) {
//        Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>: uploadImage:  " + this.url);

        httpUtil.postImageRequest(url, null, pathList, new UploadImageStringCallBack() {

            @Override
            public void onError(Call call, Exception e, int id) {
                super.onError(call, e, id);
                Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>:  上传图片 uploadImage onError >>>>>  " + e.toString() + "id:  " + id);
                try {
                    JSONObject mJsonobjData = new JSONObject();
                    mJsonobjData.put("code", id);
                    mJsonobjData.put("error", e.toString());
                    mJsonobjData.put("uploadImgURL", "");
                    NativeMgr.OnCallBackToJs("OnUploadImageCallBack", mJsonobjData);
                } catch (Exception ee) {
                    ee.printStackTrace();
                }
            }

            @Override
            public void onResponse(String response, int id) {
                super.onResponse(response, id);
                // 返回图片的地址
                Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>:  上传图片 uploadImage onResponse response：  " + response + "id:  " + id);
                try {
                    JSONObject mJsonobjData = new JSONObject();
                    mJsonobjData.put("code", id);
//                    mJsonobjData.put("response", response);
                    //2、使用JSONArray
                    JSONObject response2 = new JSONObject(response);
                    String uploadImgURL = response2.getString("img");

                    mJsonobjData.put("uploadImgURL", uploadImgURL);
                    NativeMgr.OnCallBackToJs("OnUploadImageCallBack", mJsonobjData);
                } catch (Exception ee) {
                    ee.printStackTrace();
                }
            }
        });
    }

}
