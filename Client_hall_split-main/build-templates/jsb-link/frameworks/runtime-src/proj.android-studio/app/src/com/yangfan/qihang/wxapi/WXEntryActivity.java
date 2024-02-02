package com.yangfan.qihang.wxapi;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;
import android.content.Intent;

import com.yangfan.qihang.R;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXTextObject;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.cocos2dx.javascript.AppActivity;

import org.cocos2dx.javascript.Contants;
import org.cocos2dx.javascript.WeChat.Util;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

/**
 * Created by guoliangxuan on 2017/3/21.
 */


public class WXEntryActivity extends Activity implements IWXAPIEventHandler{
    public static final String TAG = "WXEntryActivity";
    public static String paySuccessMsg = "";
    public static IWXAPI mApi;
    public  static AppActivity app = null;
    public static String dataStr;
    private static final int THUMB_SIZE = 120;
    private  boolean isPause = false;

    public static void init(AppActivity app) {
        WXEntryActivity.app = app;
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.e("WXEntryActivity","onCreate 0000");
        super.onCreate(savedInstanceState);
        mApi = AppActivity.api;
//        mApi = WXAPIFactory.createWXAPI(this, Contants.WX_APP_ID, true);
//        mApi.registerApp(Contants.WX_APP_ID);

        isPause = false;

        //mApi.handleIntent(this.getIntent(), this);
        //注意：
        //第三方开发者如果使用透明界面来实现WXEntryActivity，需要判断handleIntent的返回值，如果返回值为false，则说明入参不合法未被SDK处理，应finish当前透明界面，避免外部通过传递非法参数的Intent导致停留在透明界面，引起用户的疑惑
        try {
            mApi.handleIntent(getIntent(), this);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Log.e("WXEntryActivity","onCreate 0000 intent:" + getIntent().getExtras().toString());
//        initView();
        //Log.e("WXEntryActivity","onCreate 11111 intent:" + getIntent().getDataString());
//        if(!(getIntent().hasExtra(Contants.WX_Login) || getIntent().hasExtra(Contants.WX_pay) || getIntent().hasExtra(Contants.WX_ShareText) ||
//                getIntent().hasExtra(Contants.WX_ShareImage) || getIntent().hasExtra(Contants.WX_ShareHttp))){
//            finish();
//            Log.e(TAG, "onCreate finish");
//        }
        //finish();
        //Log.e(TAG, "onCreate finsh end");
    }

    public  void initView()
    {
        Log.e("WXEntryActivity","initView getIntent().hasExtra(Contants.WX_Login) ="+ getIntent().hasExtra(Contants.WX_Login));
        if(getIntent().hasExtra(Contants.WX_Login))
        {
            Login();
        }
        else if(getIntent().hasExtra(Contants.WX_ShareHttp))
        {
            int flag = getIntent().getIntExtra(Contants.WX_ShareFlag,0);
            String title = getIntent().getStringExtra(Contants.WX_ShareTitle);
            String description = getIntent().getStringExtra(Contants.WX_ShareDescription);
            String url = getIntent().getStringExtra(Contants.WX_ShareURL);
            OnJSToAndroidShare(title, description, url, flag);

        }
        else if(getIntent().hasExtra(Contants.WX_ShareImage))
        {
            int flag = getIntent().getIntExtra(Contants.WX_ShareFlag,0);
            String image = getIntent().getStringExtra(Contants.WX_ShareImagePath);
            OnJSToAndroidShareImage(image, flag);

        }
        else if(getIntent().hasExtra(Contants.WX_ShareText))
        {
            int flag = getIntent().getIntExtra(Contants.WX_ShareFlag,0);
            String text = getIntent().getStringExtra(Contants.WX_ShareDescription);
            ShareText(text, flag);

        }
        else if(getIntent().hasExtra(Contants.WX_pay))
        {
            String jsonData = getIntent().getStringExtra(Contants.WX_payData);
            OnJSToAndroidWeChatPay(jsonData);
        }
    }

    @Override
    public void onReq(BaseReq req) {
        Log.e("onReq","onReq 0123456");
    }

    @Override
    public void onResp(BaseResp resp) {
        Log.e("onResp","onResp resp.getType()=" + resp.getType() + ",resp.errCode=" + resp.errCode +",resp.errStr="+ resp.errStr );
        //登录
        if (resp.getType() == ConstantsAPI.COMMAND_SENDAUTH) {
            try {
                JSONObject mJsonobjData = new JSONObject();
                mJsonobjData.put("ErrCode", resp.errCode);
                mJsonobjData.put("ErrStr", resp.errStr);
                mJsonobjData.put("Type", resp.getType());
                SendAuth.Resp sendResp = (SendAuth.Resp) resp;
                if (resp.errCode == 0) {
                    if (sendResp != null) {
                        String code = sendResp.code;
                        mJsonobjData.put("Code", code);
                    }
                }
                else {
                    mJsonobjData.put("Code", "unCode");
                }
                Log.e("onResp","COMMAND_SENDAUTH dataStr="+mJsonobjData.toString());

                org.cocos2dx.javascript.NativeMgr.OnCallBackToJs("wechat", mJsonobjData);
            } catch (Exception e) {
                // TODO: handle exception
                Log.e("onResp", "onResp");
                Log.e("onResp Exception",e.toString());
                //e.printStackTrace();
            }
        }
        //分享
        else if(resp.getType()==ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX) {
            try {
                JSONObject mJsonobjData = new JSONObject();
                mJsonobjData.put("ErrCode", resp.errCode);
                mJsonobjData.put("ErrStr", resp.errStr);
                mJsonobjData.put("Type", resp.getType());
                mJsonobjData.put("Code", "unCode");
                org.cocos2dx.javascript.NativeMgr.OnCallBackToJs("wechatShare", mJsonobjData);
            } catch (Exception e) {
                // TODO: handle exception
                //e.printStackTrace();
                Log.e("onResp Exception",e.toString());
            }
        }
        else if(resp.getType()==ConstantsAPI.COMMAND_PAY_BY_WX)
        {
            try {
                JSONObject mJsonobjData = new JSONObject();
                mJsonobjData.put("ErrCode", resp.errCode);
                if(resp.errStr != null){
                    mJsonobjData.put("ErrStr", resp.errStr);
                }

                mJsonobjData.put("Type", resp.getType());
                org.cocos2dx.javascript.NativeMgr.OnCallBackToJs("wechatPay", mJsonobjData);
            } catch (Exception e) {
                // TODO: handle exception
                //e.printStackTrace();
                Log.e("onResp Exception",e.toString());
            }
        }
        finish();

        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_LAUNCHER);
        intent.setClass(this, AppActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);

        Log.e(TAG, "finish");
    }

    //分享入口
    public  void OnJSToAndroidShare (String title,String description,String urlStr,int flag) {
        if (flag == 0) {
            Share(title, description, urlStr, "0");
        }
        else {
            Share(title, description, urlStr, "1");
        }
    }
    //分享入口
    public  void OnJSToAndroidShareImage(String imagePath, int flag) {
        if (flag == 0) {
            ShareImage(imagePath, "0");
        }
        else {
            ShareImage(imagePath, "1");
        }
    }

    public static void OnJSToAndroidWeChatPay(String jsonData) {
        try {
            JSONObject jsonObject = new JSONObject(jsonData);
            String appidStr = jsonObject.getString("appid");
            String partneridStr = jsonObject.getString("partnerid");
            String prepayidStr = jsonObject.getString("prepayid");
            String nonceStr = jsonObject.getString("noncestr");
            String packageStr = jsonObject.getString("package");
            String signStr = jsonObject.getString("sign");
            String timestampStr = jsonObject.getString("timestamp");
            if (mApi != null) {
                mApi.registerApp(appidStr);
                if (mApi.isWXAppInstalled()) {
                    PayReq req = new PayReq();
                    req.appId = appidStr;
                    req.partnerId = partneridStr;
                    req.prepayId = prepayidStr;
                    req.packageValue = packageStr;
                    req.nonceStr = nonceStr;
                    req.timeStamp = timestampStr;
                    req.sign = signStr;
                    mApi.sendReq(req);
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void Login() {
        Log.e("WXEntryActivity","111111" );
        // send oauth request
        SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "ddmh5";
        boolean flag = mApi.sendReq(req);
        if(!flag){
            Log.e(TAG, "login sendReq fail");
        }
        Log.e(TAG,"222 flag" + flag+ ", api=" + mApi.toString());
    }

    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public  void Share(String title,String description,String urlStr,String flag) {
        String wxAppId = Util.getRandomWXAppId();
        if (mApi != null) {
            mApi.unregisterApp();
            mApi.registerApp(wxAppId);
        }else {
            mApi = WXAPIFactory.createWXAPI(this, wxAppId, true);
            mApi.registerApp(wxAppId);
        }

        //初始化一个WXWebpageObject对象，填写分享的url
        WXWebpageObject webpageObject = new WXWebpageObject();
        webpageObject.webpageUrl = urlStr;
        //用WXWebpageObject对象初始化一个WXMediaMessage对象
        WXMediaMessage msg = new WXMediaMessage(webpageObject);
        msg.title = title;
        msg.description = description;

//        //这里替换一张自己工程里的图片资源

        Bitmap bmp = BitmapFactory.decodeResource(this.getResources(), R.mipmap.ic_launcher);
        msg.setThumbImage(bmp);//

        //构造一个reg
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = String.valueOf(System.currentTimeMillis());
        //transaction字段用于唯一标示一个请求
        req.message = msg;
        if (flag == "0") {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }
        else {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }
        mApi.sendReq(req);
    }

    private Bitmap compressImage(Bitmap image) {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        image.compress(Bitmap.CompressFormat.JPEG, 100, baos);//质量压缩方法，这里100表示不压缩，把压缩后的数据存放到baos中
        int options = 100;
        while ( baos.toByteArray().length / 1024>100) {  //循环判断如果压缩后图片是否大于100kb,大于继续压缩
            baos.reset();//重置baos即清空baos
            image.compress(Bitmap.CompressFormat.JPEG, options, baos);//这里压缩options%，把压缩后的数据存放到baos中
            options -= 10;//每次都减少10
        }
        ByteArrayInputStream isBm = new ByteArrayInputStream(baos.toByteArray());//把压缩后的数据baos存放到ByteArrayInputStream中
        Bitmap bitmap = BitmapFactory.decodeStream(isBm, null, null);//把ByteArrayInputStream数据生成图片
        return bitmap;
    }

    private Bitmap getimage(String srcPath) {
        BitmapFactory.Options newOpts = new BitmapFactory.Options();
        //开始读入图片，此时把options.inJustDecodeBounds 设回true了
        newOpts.inJustDecodeBounds = true;
        Bitmap bitmap = BitmapFactory.decodeFile(srcPath,newOpts);//此时返回bm为空

        newOpts.inJustDecodeBounds = false;
        int w = newOpts.outWidth;
        int h = newOpts.outHeight;
        //现在主流手机比较多是800*480分辨率，所以高和宽我们设置为
        float hh = 800f;//这里设置高度为800f
        float ww = 480f;//这里设置宽度为480f
        //缩放比。由于是固定比例缩放，只用高或者宽其中一个数据进行计算即可
        int be = 1;//be=1表示不缩放
        if (w > h && w > ww) {//如果宽度大的话根据宽度固定大小缩放
            be = (int) (newOpts.outWidth / ww);
        } else if (w < h && h > hh) {//如果高度高的话根据宽度固定大小缩放
            be = (int) (newOpts.outHeight / hh);
        }
        if (be <= 0)
            be = 1;
        newOpts.inSampleSize = be;//设置缩放比例
        //重新读入图片，注意此时已经把options.inJustDecodeBounds 设回false了
        bitmap = BitmapFactory.decodeFile(srcPath, newOpts);
        return compressImage(bitmap);//压缩好比例大小后再进行质量压缩
    }

    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public  void ShareImage(String imagePath, String flag) {
        Log.e(TAG,"ShareImage imagpath="+imagePath+",flag="+flag);
        String wxAppId = Util.getRandomWXAppId();
        if (mApi != null) {
            mApi.unregisterApp();
            mApi.registerApp(wxAppId);
        }else {
            mApi = WXAPIFactory.createWXAPI(this, wxAppId, true);
            mApi.registerApp(wxAppId);
        }

//        File file = new File(imagePath);
//        if (!file.exists()) {
//            Log.i(TAG, "分享路径错误");
//            return;
//        }
        int index = imagePath.lastIndexOf("/");
        String imageName = imagePath.substring(index+1);

        Log.e(TAG,"ShareImage imageName="+imageName+",index="+index);
/*
        WXImageObject imgObj = new WXImageObject();
        imgObj.setImagePath(imagePath);

        //用WXWebpageObject对象初始化一个WXMediaMessage对象
        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = imgObj;

        //构造一个缩略图
        //Bitmap bmp = BitmapFactory.decodeFile(imagePath);
        Bitmap thumbBmp = getimage(imagePath);
        //Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, THUMB_SIZE, true);
        //bmp.recycle();
        msg.thumbData = Util.bmpToByteArray(thumbBmp, true);

        msg.title="abc-title";
        msg.description="图片描述";

        Log.i(TAG, "msg.thumbData.length="+msg.thumbData.length);

//        int imageSize = msg.thumbData.length / 1024;
//        if (imageSize > 32) {
//            Log.i(TAG, "分享图片过大");
//            return;
//        }
*/

        Bitmap bmp = BitmapFactory.decodeFile(imagePath);
        WXImageObject imgObj = new WXImageObject(bmp);

        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = imgObj;

        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, THUMB_SIZE, true);
        bmp.recycle();
        msg.thumbData = Util.bmpToByteArray(thumbBmp, true);

        //构造一个reg
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("img");      //transaction字段用于唯一标示一个请求
        req.message = msg;
        if (flag == "0") {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }else {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }

        boolean falg =mApi.sendReq(req);
        if(!falg){
            Log.e(TAG,"分享图片失败！");
        }
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public  void ShareText(String text, int flag) {
        Log.e(TAG,"ShareText imagpath="+text+",flag="+flag);
        String wxAppId = Util.getRandomWXAppId();
        if (mApi != null) {
            mApi.unregisterApp();
            mApi.registerApp(wxAppId);
        }else {
            mApi = WXAPIFactory.createWXAPI(this, wxAppId, true);
            mApi.registerApp(wxAppId);
        }

        WXTextObject textObject = new WXTextObject();
        textObject.text = text;



        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = textObject;
        msg.description = text;

        //构造一个reg
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("text");      //transaction字段用于唯一标示一个请求
        req.message = msg;
        req.scene = flag;


        boolean falg =mApi.sendReq(req);
        if(!falg){
            Log.e(TAG,"分享文字失败！");
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Log.e(TAG, "onNewIntent intent:"+ intent.getDataString());
        setIntent(intent);
        mApi.handleIntent(intent, this);
    }

    private String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.e(TAG, "OnResume isPause:"+isPause);
        if(isPause) finish();
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.e(TAG, "OnPause isPause:"+isPause);
        isPause = true;
    }

}
