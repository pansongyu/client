package com.yangfan.qihang.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.WeChat.SendWXSDKManager;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONObject;

import static org.cocos2dx.javascript.NativeMgr.getSubGameName;

/**
 * Created by guoliangxuan on 2017/3/24.
 */

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler{
    public static final String TAG = "WXPayEntryActivity";
    private IWXAPI api;
    public static String paySuccessMsg = "";
    public  static AppActivity app = null;
    public static String dataStr;

    public static void init(AppActivity app) {
        WXPayEntryActivity.app = app;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        api = WXAPIFactory.createWXAPI(this, SendWXSDKManager.GetAPP_ID(), true);
        api.handleIntent(getIntent(), this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        api.handleIntent(intent, this);
    }

    public void onReq(BaseReq req) {
    }

    @Override
    public void onResp(BaseResp resp) {
        try {
            JSONObject mJsonobjData = new JSONObject();
            mJsonobjData.put("ErrCode", resp.errCode);
            if(resp.errStr != null){
                mJsonobjData.put("ErrStr", resp.errStr);
            }

            mJsonobjData.put("Type", resp.getType());
            dataStr = null;
            dataStr = mJsonobjData.toString();
            paySuccessMsg = String.format(getSubGameName()+"_NativeNotify.OnNativeNotify('%s','%s')","wechatPay", dataStr);
//        //一定要在GL线程中执行
            app.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(paySuccessMsg);
                }
            });
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
        }
        finish();
    }
}
