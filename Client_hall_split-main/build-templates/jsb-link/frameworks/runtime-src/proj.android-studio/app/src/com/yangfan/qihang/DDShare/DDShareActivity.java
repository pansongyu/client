package com.yangfan.qihang.DDShare;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.android.dingtalk.share.ddsharemodule.DDShareApiFactory;
import com.android.dingtalk.share.ddsharemodule.IDDAPIEventHandler;
import com.android.dingtalk.share.ddsharemodule.IDDShareApi;
import com.android.dingtalk.share.ddsharemodule.ShareConstant;
import com.android.dingtalk.share.ddsharemodule.message.BaseReq;
import com.android.dingtalk.share.ddsharemodule.message.BaseResp;
import com.android.dingtalk.share.ddsharemodule.message.SendAuth;

import org.cocos2dx.javascript.Contants;


/**
 * Created by hanhanliu on 15/12/9.
 */
public class DDShareActivity extends Activity implements IDDAPIEventHandler {
    public static final String TAG = "DDShareActivity";
    private IDDShareApi mIDDShareApi;
    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
//    private GoogleApiClient client;

//    public  static AppActivity app = null;
//
//    public static void init(AppActivity app) {
//        DDShareActivity.app = app;
//    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.e(TAG, "onCreate==========>");
        try {
            //activity的export为true，try起来，防止第三方拒绝服务攻击
            mIDDShareApi = DDShareApiFactory.createDDShareApi(this, Contants.DD_APP_ID, false);
            mIDDShareApi.handleIntent(getIntent(), this);
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "e===========>" + e.toString());
        }


    }

    @Override
    public void onReq(BaseReq baseReq) {
        Log.e(TAG, "onReq=============>");
    }

    @Override
    public void onResp(BaseResp baseResp) {
        int errCode = baseResp.mErrCode;
        Log.e(TAG, "errorCode==========>" + errCode);
        String errMsg = baseResp.mErrStr;
        Log.e(TAG, "errMsg==========>" + errMsg);
        if (baseResp.getType() == ShareConstant.COMMAND_SENDAUTH_V2 && (baseResp instanceof SendAuth.Resp)) {
            SendAuth.Resp authResp = (SendAuth.Resp) baseResp;
            switch (errCode) {
                case BaseResp.ErrCode.ERR_OK:
                    Toast.makeText(this, "授权成功，授权码为:" + authResp.code, Toast.LENGTH_SHORT).show();
                    break;
                case BaseResp.ErrCode.ERR_USER_CANCEL:
                    Toast.makeText(this, "授权取消", Toast.LENGTH_SHORT).show();
                    break;
                default:
                    Toast.makeText(this, "授权异常" + baseResp.mErrStr, Toast.LENGTH_SHORT).show();
                    break;
            }
            finish();
        } else {
            switch (errCode) {
                case BaseResp.ErrCode.ERR_OK:
                    Toast.makeText(this, "分享成功", Toast.LENGTH_SHORT).show();
                    break;
                case BaseResp.ErrCode.ERR_USER_CANCEL:
                    Toast.makeText(this, "分享取消", Toast.LENGTH_SHORT).show();
                    break;
                default:
                    Toast.makeText(this, "分享失败" + baseResp.mErrStr, Toast.LENGTH_SHORT).show();
                    break;
            }

            onJaveToJS(errCode, errMsg);
        }


    }


    /**
     * 通知客户端
     * */
    public  void onJaveToJS(int errCode, String errMsg){
        DDShareMgr.onJaveToJS(errCode, errMsg);
        finish();
    }
}
