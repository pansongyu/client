package com.yangfan.qihang.xlapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import com.ixl.talk.xl.opensdk.v2.api.XLAPI;
import com.ixl.talk.xl.opensdk.v2.api.XLAPIEventHandler;
import com.ixl.talk.xl.opensdk.v2.api.XLAPIFactory;
import com.ixl.talk.xl.opensdk.v2.constants.XLConstants;
import com.ixl.talk.xl.opensdk.v2.modelbase.BaseReq;
import com.ixl.talk.xl.opensdk.v2.modelbase.BaseResp;
import com.ixl.talk.xl.opensdk.v2.modelmsg.SendAuth;

import org.cocos2dx.javascript.Contants;


public class XLEntryActivity extends Activity implements XLAPIEventHandler {
    XLAPI api;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        api = XLAPIFactory.createDSAPI(XLEntryActivity.this, Contants.XIANGLIAO_APP_ID);
        api.handleIntent(getIntent(), this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        api.handleIntent(getIntent(), this);
    }


    @Override
    public void onReq(BaseReq var1) {

    }

    @Override
    public void onResp(BaseResp resp) {
        switch (resp.getType()) {
            case XLConstants.COMMAND_AUTHORIZE:
                SendAuth.Resp respAuth = (SendAuth.Resp) resp;
                if (respAuth.errCode == XLConstants.ERR_CANCEL) {
                    Toast.makeText(XLEntryActivity.this, respAuth.code, Toast.LENGTH_SHORT).show();
                } else if (respAuth.errCode == XLConstants.ERR_FAIL) {
                    Toast.makeText(XLEntryActivity.this, respAuth.code, Toast.LENGTH_SHORT).show();
                } else if (respAuth.errCode == XLConstants.ERR_OK) {
                    Toast.makeText(XLEntryActivity.this, "授权成功 code为:" + respAuth.code, Toast.LENGTH_SHORT).show();

                    //传递code到其他页面  (可选)
                    Intent intent = new Intent();
                    intent.setAction("com.ixl.talk.xl.opensdk.demo.api.code");
                    intent.putExtra("code", respAuth.code);
                    sendBroadcast(intent);
                } else if (respAuth.errCode == XLConstants.ERR_610 || respAuth.errCode == XLConstants.ERR_4305 || respAuth.errCode == XLConstants.ERR_4308
                        || respAuth.errCode == XLConstants.ERR_4309) {
                    Toast.makeText(XLEntryActivity.this, respAuth.code, Toast.LENGTH_SHORT).show();
                }

                break;
            case XLConstants.COMMAND_SHARE:
                if (resp.errCode == XLConstants.ERR_OK) {
                    Toast.makeText(this, "分享成功！" + resp.errCode, Toast.LENGTH_SHORT).show();
                } else if (resp.errCode == XLConstants.ERR_CANCEL) {
                    Toast.makeText(this, "分享取消！" + resp.errCode, Toast.LENGTH_SHORT).show();
                } else if (resp.errCode == XLConstants.ERR_FAIL) {
                    Toast.makeText(this, "分享失败！" + resp.errCode, Toast.LENGTH_SHORT).show();
                }
                break;
        }
        finish();
    }
}