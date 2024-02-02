package org.cocos2dx.javascript.WeChat;

import android.util.Log;

import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.cocos2dx.javascript.AppActivity;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Created by guoliangxuan on 2017/3/24.
 */

public class WXPayManager extends AppActivity {

    public static final String TAG = "WXPayManager";

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
            final IWXAPI api = WXAPIFactory.createWXAPI(getContext(), null);
            if (api != null) {
                api.registerApp(appidStr);
                if (api.isWXAppInstalled()) {
                    PayReq req = new PayReq();
                    req.appId = appidStr;
                    req.partnerId = partneridStr;
                    req.prepayId = prepayidStr;
                    req.packageValue = packageStr;
                    req.nonceStr = nonceStr;
                    req.timeStamp = timestampStr;
                    req.sign = signStr;
                    api.sendReq(req);
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
