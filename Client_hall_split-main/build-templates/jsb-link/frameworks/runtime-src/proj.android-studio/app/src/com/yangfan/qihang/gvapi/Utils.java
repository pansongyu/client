package com.yangfan.qihang.gvapi;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by Lilac on 2018/8/31
 *
 * <p>
 * 工具类
 */
public class Utils {
    private static String TAG_DIALOG = "GVoiceDialog";
    private static String TAG_LOG = "gvoice";
    private static final int MSG_POLL = 1;

    static class PollHandler extends Handler {
        @Override
        public void handleMessage(Message msg) {
            GvoiceManager manager = GvoiceManager.getInstance();
            switch (msg.what) {
                case MSG_POLL:
                    if (manager != null && manager.isEngineInit()) {
                        manager.getVoiceEngine().Poll();
//                        Utils.logI("Poll");
                    }
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 定时任务，驱动 GvoiceEngine 定时调用 Poll() 函数来检查回调
     */
    public static void poll() {
        final PollHandler mHandler = new PollHandler();
        TimerTask pollTask = new TimerTask() {
            @Override
            public void run() {
                Message msg = mHandler.obtainMessage();
                msg.what = MSG_POLL;
                mHandler.sendMessage(msg);
            }
        };

        Timer timer = new Timer(true);
        timer.schedule(pollTask, 500, 500);
    }

    /**
     * 进入指定 Activity
     *
     * @param ctx:当前Activity
     * @param activityClass:目标 Activity
     */
    public static void startTargetActivity(Context ctx, Class<? extends Activity> activityClass) {
        Intent intent = new Intent(ctx, activityClass);
        ctx.startActivity(intent);
    }

    /**
     * 显示短时提示信息
     *
     * @param ctx：需要显示提示信息的页面
     * @param msg：提示信息
     */
    public static void showShortMsg(Context ctx, String msg) {
        Toast toast = Toast.makeText(ctx, msg, Toast.LENGTH_SHORT);
        toast.show();
    }

    /**
     * 显示长时提示信息
     *
     * @param ctx：需要显示提示信息的页面
     * @param msg：提示信息
     */
    public static void showLongMsg(Context ctx, String msg) {
        Toast toast = Toast.makeText(ctx, msg, Toast.LENGTH_LONG);
        toast.show();
    }
    
    /**
     * 打印日志信息
     *
     * @param logStr：待输出的日志消息
     */
    public static void logI(String logStr) {
        Log.i(TAG_LOG, logStr);
    }
}
