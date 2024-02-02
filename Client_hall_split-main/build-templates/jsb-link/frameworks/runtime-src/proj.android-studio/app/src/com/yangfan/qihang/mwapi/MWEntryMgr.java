package com.yangfan.qihang.mwapi;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.text.TextUtils;
import android.util.Log;

import com.yangfan.qihang.R;
import com.mostone.open.sdk.MAuthApi;
import com.mostone.open.sdk.MConfigure;
import com.mostone.open.sdk.ShareAction;
import com.mostone.open.sdk.listener.MAuthListener;
import com.mostone.open.sdk.listener.MShareListener;
import com.mostone.open.sdk.media.MImageData;
import com.mostone.open.sdk.media.MWebData;
import com.mostone.open.sdk.model.BeanMAuth;
import com.mostone.open.sdk.model.BeanMResp;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.NativeMgr;
import org.json.JSONObject;

import java.io.File;


public class MWEntryMgr  {
    public static final String TAG = "MWEntryMgr";

    public  static AppActivity app = null;

    public static void init(AppActivity app) {
        MWEntryMgr.app = app;
    }

    //@param
    public static void OnMoWangLogin() {
        //可以检测默往是否已经安装
        if(!checkInstall()){
            return;
        }
        BeanMAuth.Req req = new BeanMAuth.Req();
        req.state = "123";//扩展参数,将在授权请求结果返回

        //发起授权请求
        MAuthApi.get(AppActivity.getInstance()).sendAuth(req, new MAuthListener() {
            @Override
            public void onResult(BeanMAuth.Resp resp) {
                switch (resp.resCode) {
                    case BeanMResp.ResCode.RES_SEND_OK: {//授权成功
                        StringBuffer sb = new StringBuffer();
                        sb.append("\n授权码: " + resp.authCode);
                        sb.append("\n扩展参数: " + resp.state);
//                        Toast.makeText(AppActivity.getContext(), "授权成功", Toast.LENGTH_LONG).show();
                        break;
                    }
                    case BeanMResp.ResCode.RES_SENT_FAILED: {
//                        Toast.makeText(AppActivity.getContext(), "授权失败", Toast.LENGTH_LONG).show();
                        break;
                    }
                    case BeanMResp.ResCode.RES_USER_CANCEL: {
//                        Toast.makeText(AppActivity.getContext(), "取消授权", Toast.LENGTH_LONG).show();
                        break;
                    }
                }
                try {
                    JSONObject mJsonobjData = new JSONObject();
                    mJsonobjData.put("ErrCode", resp.errCode);
                    mJsonobjData.put("ErrStr", resp.errMsg);
                    if (resp.resCode == BeanMResp.ResCode.RES_SEND_OK) {
                        mJsonobjData.put("Code", resp.authCode);
                    }
                    else {
                        mJsonobjData.put("Code", "unCode");
                    }
                    //回调js
                    MWEntryMgr.onJaveToJSLogin(mJsonobjData);
                } catch (Exception e) {
                    // TODO: handle exception
                    Log.e("onResp", "onResp");
                    Log.e("onResp Exception",e.toString());
                }
            }
        });
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void Share(String title,String description,String urlStr, String roomId, String roomToken) {
        if (TextUtils.isEmpty(roomId) && TextUtils.isEmpty(roomToken)) {
            onJaveToJS(-4, "没有填写roomID或者roomtoken");
            return;
        }
        //可以检测乡聊是否已经安装
        if(!checkInstall()){
            return;
        }
        try {
            //注意ic_launcher 图片的大小，放在res里不同图片资源文件目录下，系统会根据手机屏幕自动缩放，
            // 建议放在xxhdpi目录下，大小不要超过 200 x 200
            Bitmap bmp = BitmapFactory.decodeResource(AppActivity.getInstance().getResources(), R.mipmap.ic_launcher);

//        Bitmap bmp = BitmapFactory.decodeFile(imagePath);

            Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, bmp.getWidth()/2, bmp.getHeight()/2, true);

            MWebData mWebData = new MWebData();
            mWebData.title = title;
            mWebData.content = description;
            mWebData.thumbData = new MImageData(AppActivity.getContext(), thumbBmp);//分享app跳转
            mWebData.androidJumpParam = "p=123&type=2&title=标题";//android分享卡片点击返回参数
            mWebData.iOSJumpParam = "p=123&type=2&title=标题";//ios分享卡片点击返回参数
            mWebData.webLink = urlStr;
            mWebData.webType = MWebData.WebType.HTML5AndAPP;//设置分享类型

            new ShareAction(AppActivity.getInstance())
                    .withMedia(mWebData)//分享标题
                    .setCallBack(mShareListener)
                    .share();
        } catch (Exception e){
            e.printStackTrace();
        }


    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void ShareImage(String imagePath) {
        File file = new File(imagePath);
        if (!file.exists()) {
            String tip = "no pic";
            onJaveToJS(-4,"文件不存在");
            return;
        }
        //可以检测乡聊是否已经安装
        if(!checkInstall()){
            return;
        }
        Bitmap bmp = BitmapFactory.decodeFile(imagePath);

//        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, bmp.getWidth()/2, bmp.getHeight()/2, true);
//        bmp.recycle();

        MImageData mImageData = new MImageData(AppActivity.getContext(), bmp);
        new ShareAction(AppActivity.getInstance())
                .withMedia(mImageData)
                .setCallBack(mShareListener)
                .share();
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void ShareText(String text) {
        //可以检测乡聊是否已经安装
        if(!checkInstall()){
            return;
        }
        Log.e(TAG,"ShareText imagpath="+text);

        MWebData mWebData = new MWebData();
        mWebData.title = text;
        mWebData.content = text;
        mWebData.webType = MWebData.WebType.APP;

        new ShareAction(AppActivity.getInstance())
                .withMedia(mWebData)//分享标题
                .setCallBack(mShareListener)
                .share();
    }

    public static MShareListener mShareListener = new MShareListener() {
        @Override
        public void onResult(BeanMResp beanMResp) {

            switch (beanMResp.resCode) {
                case BeanMResp.ResCode.RES_SEND_OK: {
//                    Toast.makeText(AppActivity.getContext(), "发送成功", Toast.LENGTH_LONG).show();
                    break;
                }
                case BeanMResp.ResCode.RES_SENT_FAILED: {
//                    Toast.makeText(AppActivity.getContext(), "发送失败", Toast.LENGTH_LONG).show();
                    break;
                }
                case BeanMResp.ResCode.RES_USER_CANCEL: {
//                    Toast.makeText(AppActivity.getContext(), "用户取消发送", Toast.LENGTH_LONG).show();
                    break;
                }
            }
        }
    };

    /**
     * 通知客户端
     * */
    public static void onJaveToJS(int errCode, String errMsg){
        try {
            JSONObject mJsonobjData = new JSONObject();
            mJsonobjData.put("ErrCode", errCode);
            mJsonobjData.put("ErrStr", errMsg);
//                mJsonobjData.put("Type",baseResp.getType());


            NativeMgr.OnCallBackToJs("MoWangShare", mJsonobjData);
        } catch (Exception e) {
            // TODO: handle exception
            //e.printStackTrace();
            Log.e(TAG,e.toString());
        }
    }

    public static void onJaveToJSLogin(JSONObject data){
        try {
            NativeMgr.OnCallBackToJs("MoWangLogin", data);
        } catch (Exception e) {
            // TODO: handle exception
            //e.printStackTrace();
            Log.e(TAG,e.toString());
        }
    }

    public  static  boolean checkInstall(){
        if(!MConfigure.isMOAppInstalled()){
//            Toast.makeText(AppActivity.getInstance(), "未安装默往！", Toast.LENGTH_SHORT).show();
            onJaveToJS(-5, "没有安装默往");
            return  false;
        }else{
            return  true;
        }
    }
}