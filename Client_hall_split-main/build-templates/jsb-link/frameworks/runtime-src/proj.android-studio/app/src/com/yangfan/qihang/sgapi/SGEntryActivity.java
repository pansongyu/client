package com.yangfan.qihang.sgapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;


import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.Contants;
import org.json.JSONObject;
import org.xianliao.im.sdk.api.ISGAPI;
import org.xianliao.im.sdk.api.ISGAPIEventHandler;
import org.xianliao.im.sdk.api.SGAPIFactory;
import org.xianliao.im.sdk.constants.SGConstants;
import org.xianliao.im.sdk.modelbase.BaseReq;
import org.xianliao.im.sdk.modelbase.BaseResp;
import org.xianliao.im.sdk.modelmsg.InvitationResp;
import org.xianliao.im.sdk.modelmsg.SendAuth;


/**
 * Created by nickyang on 2017/1/18.
 *
 * 此类用于接收从闲聊返回到应用的返回值
 *
 * 注意： "sgapi" 目录名和 "SGEntryActivity" 类名都不能改动
 *
 */

public class SGEntryActivity extends Activity implements ISGAPIEventHandler {
    public static final String TAG = "SGEntryActivity";
    public ISGAPI api;


//    public  static AppActivity app = null;
//
//    public static void init(AppActivity app) {
//        DDShareActivity.app = app;
//    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.e(TAG, "onCreate=======SGEntryActivity>");

        api = SGAPIFactory.createSGAPI(this, Contants.XL_APP_ID);

        api.handleIntent(getIntent(),this);

    }



    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        api.handleIntent(intent, this);
    }

    @Override
    public void onReq(BaseReq req) {

    }

    @Override
    public void onResp(BaseResp resp) {
        Log.e(TAG, "onResp type = " + resp.getType());
        Intent intent = new Intent(this,AppActivity.class);
        switch (resp.getType()){
            case SGConstants.COMMAND_AUTH:  //授权登陆
                SendAuth.Resp respAuth = (SendAuth.Resp) resp;
                if(resp.errCode == SGConstants.ERR_OK){
//                    Toast.makeText(this, "授权登录成功！"+resp.errCode + "\ncode: "+respAuth.code, Toast.LENGTH_SHORT).show();
                }else if(resp.errCode == SGConstants.ERR_CANCEL){
//                    Toast.makeText(this, "授权登录取消！"+resp.errCode, Toast.LENGTH_SHORT).show();
                }else if(resp.errCode == SGConstants.ERR_FAIL){
                    Toast.makeText(this, "授权登录失败！"+resp.errCode, Toast.LENGTH_SHORT).show();
                }
                try {
                    JSONObject mJsonobjData = new JSONObject();
                    mJsonobjData.put("ErrCode", resp.errCode);
                    mJsonobjData.put("ErrStr", resp.errStr);
                    mJsonobjData.put("Type", resp.getType());
                    SendAuth.Resp sendResp = (SendAuth.Resp) resp;
                    if (resp.errCode == SGConstants.ERR_OK) {
                        if (sendResp != null) {
                            String code = sendResp.code;
                            mJsonobjData.put("Code", code);
                        }
                    }
                    else {
                        mJsonobjData.put("Code", "unCode");
                    }
                    Log.e("onResp","COMMAND_SENDAUTH dataStr="+mJsonobjData.toString());
                    //回调js
                    SGEntryMgr.onJaveToJSLogin(mJsonobjData);
                } catch (Exception e) {
                    // TODO: handle exception
                    Log.e("onResp", "onResp");
                    Log.e("onResp Exception",e.toString());
                    //e.printStackTrace();
                }
                break;

            case SGConstants.COMMAND_SHARE: {  //分享文本，图片，邀请
                if (resp.errCode == SGConstants.ERR_OK) {
                    Toast.makeText(this, "分享成功！" + resp.errCode, Toast.LENGTH_SHORT).show();
                } else if (resp.errCode == SGConstants.ERR_CANCEL) {
                    Toast.makeText(this, "分享取消！" + resp.errCode, Toast.LENGTH_SHORT).show();
                } else if (resp.errCode == SGConstants.ERR_FAIL) {
                    Toast.makeText(this, "分享失败！" + resp.errCode, Toast.LENGTH_SHORT).show();
                }
                onJaveToJS(resp.errCode, resp.errStr);
                break;
            }
            case SGConstants.COMMAND_INVITE:  //从闲聊点击邀请进入应用,

                /**
                 * 需要Manifest里面配置特殊 intent-filter 才有用,详情参见AndroidManifest
                 */
                InvitationResp invitationResp = (InvitationResp) resp;
                Log.e(TAG, "邀请进入: roomId: " + invitationResp.roomId +" roomToken: "
                            + invitationResp.roomToken);

                //传递roomId roomToken到其他页面
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                intent.putExtra("roomId", invitationResp.roomId);
                intent.putExtra("roomToken", invitationResp.roomToken);
                intent.putExtra("openId", invitationResp.openId);
                startActivity(intent);
                break;
        }
        finish();
    }

    @Override
    protected void onResume() {
        super.onResume();
    }





    /**
     * 通知客户端
     * */
    public  void onJaveToJS(int errCode, String errMsg){
        SGEntryMgr.onJaveToJS(errCode, errMsg);
    }
}
