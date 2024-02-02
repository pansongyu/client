package org.cocos2dx.javascript.WyqyService;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import com.qiyukf.unicorn.api.ConsultSource;
import com.qiyukf.unicorn.api.Unicorn;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.json.JSONObject;

/**
 * 网易七鱼
 * Created by Administrator on 2019/6/26.
 */

public class WyqyUitl {

    /**
     * 唤醒客服聊天窗口
     * @param sourceUrl 聊天来源
     * @param sourceTitle 来源页面标题
     * @param context 保留字段
     */
    public static void weakUpCustomerService(String windowsTitle,String sourceUrl, String sourceTitle, Context context) {
        /**
         * 设置访客来源，标识访客是从哪个页面发起咨询的，用于客服了解用户是从什么页面进入。
         * 三个参数分别为：来源页面的url，来源页面标题，来源页面额外信息（保留字段，暂时无用）。
         * 设置来源后，在客服会话界面的"用户资料"栏的页面项，可以看到这里设置的值。
         */
        Log.e("WyqyUitl", ">>>>>>>>>>>>>>>> weakUpCustomerService ConsultSource");

        ConsultSource source = new ConsultSource(sourceUrl, sourceTitle, "custom information string");
        /**
         * 请注意： 调用该接口前，应先检查Unicorn.isServiceAvailable()，
         * 如果返回为false，该接口不会有任何动作
         *
         * @param context 上下文
         * @param title   聊天窗口的标题
         * @param source  咨询的发起来源，包括发起咨询的url，title，描述信息等
         */
        Unicorn.openServiceActivity(context, windowsTitle, source);
        Log.e("WyqyUitl", ">>>>>>>>>>>>>>>> weakUpCustomerService openServiceActivity");
    }
}

