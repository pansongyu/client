package org.cocos2dx.javascript.Battery;

/**
 * Created by Administrator on 2017/9/12.
 */

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import org.cocos2dx.javascript.Contants;
import org.cocos2dx.javascript.NativeMgr;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.json.JSONException;
import org.json.JSONObject;

//电量
public class BatteryReceiver  {

    public  static  BatteryReceiver m_BatteryInstance;

    // 创建BroadcastReceiver
    private BroadcastReceiver mBatInfoReveiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            // TODO Auto-generated method stub
            String action = intent.getAction();
            // 如果捕捉到action是ACRION_BATTERY_CHANGED
            // 就运行onBatteryInfoReveiver()
            if (intent.ACTION_BATTERY_CHANGED.equals(action)) {
                int intLevel = intent.getIntExtra("level", 0);
                int intScale = intent.getIntExtra("scale", 100);
                int status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1);

                int level = intLevel *100/intScale;
                JSONObject mJsonobjData = new JSONObject();
                try {
                    mJsonobjData.put("Level", level);
                    mJsonobjData.put("status", status);
                    NativeMgr.OnCallBackToJs("onBatteryLevel", mJsonobjData);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }
    };

    public static BatteryReceiver getInstance(){
        if (m_BatteryInstance == null){
            synchronized (BatteryReceiver.class){
                if (m_BatteryInstance == null){
                    m_BatteryInstance = new BatteryReceiver();
                }
            }
        }
        return m_BatteryInstance;
    }


    //注册监听
    public  void registerReceiver(){
        // 注册一个BroadcastReceiver，作为访问电池计量之用
        Cocos2dxActivity.getContext().registerReceiver(mBatInfoReveiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    }

    //取消监听
    public  void unregisterReceiver(){
        // 取消注册，并关闭对话框
        Cocos2dxActivity.getContext().unregisterReceiver(mBatInfoReveiver);
    }
}
