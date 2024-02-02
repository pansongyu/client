package com.yangfan.qihang.gvapi;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.Message;
import android.support.v4.content.ContextCompat;
import android.util.Log;

import com.tencent.gcloud.voice.GCloudVoiceEngine;
import com.tencent.gcloud.voice.GCloudVoiceErrorCode;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.Contants;
import org.cocos2dx.javascript.NativeMgr;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import static com.yangfan.qihang.gvapi.GvoiceNotify.MSG_JOINROOM;
import static com.yangfan.qihang.gvapi.GvoiceNotify.MSG_QUITROOM;


/**
 * Created by Lilac on 2018/8/28
 * <p>
 * GCloudVoice 管理类，建议将 GCloudVoice 的初始化工作和回调实现交由一个全局管理类统一管理
 * <p>
 * GCloudVoice SDK 的说明请参考线上文档：
 * http://gcloud.qq.com/document/5923b83582fb561c1b3024b5
 * <p>
 * GCloudVoice SDK 官方网站：http://gcloud.qq.com/product/6
 */

public class GvoiceManager {

    private static GCloudVoiceEngine mVoiceEngine = null;
    private static boolean bEngineInit = false;     // 是否已经初始化
    private volatile static GvoiceManager gvoiceManager = null;
    public static boolean bOpenMic = false;     // 是否已经开麦
    public static boolean bOpenSpeaker = false;     // 是否已经开扬声器
    public static boolean bInRoom = false;     // 是否已经在房间内

    /**
     * GCloudVoice 初始化时需要使用到的参数
     */
//    private static String appID = "gcloud.test";      //在自己的业务中使用GVoice语音功能时请将appID赋值为开通业务时从GVoice管理控制台获取的appID
//    private static String appKey = "test_key";      //在自己的业务中使用GVoice语音功能时请将appKey赋值为开通业务时从GVoice管理控制台获取的appKey
    private static String openID = Long.toString(System.currentTimeMillis());   // 在自己的业务中使用GVoice语音功能时请将openID赋值为用户唯一性ID
    public static Context mContext;
    public static Activity mActivity;
    public static Handler mHandler;
    public static GvoiceNotify mNotify;
    public static String msgStr;

    public static List<String> mRoomNames = new ArrayList<>();         // 进房的房间名列表
    public static int msTimeOut = 10000;              // 超时时长
    public static int mRole = 2;                      // 当前国战语音角色（1：Audience；2：Anchor）默认为观众角色

    public  static AppActivity app = null;
    public static final String TAG = "GvoiceManager";

    private GvoiceManager() {
        bEngineInit = false;
    }

    public static void init(AppActivity app) {
        GvoiceManager.app = app;
    }

    // 单例
    public static GvoiceManager getInstance() {
        if (gvoiceManager == null) {
            synchronized (GvoiceManager.class) {
                if (gvoiceManager == null) {
                    gvoiceManager = new GvoiceManager();
                }
            }
        }
        return gvoiceManager;
    }
    public static void GVInit(String pid){
        /**
         * 初始化GVoice引擎
         */
        if (gvoiceManager != null && !bEngineInit) {
            /**
             * Step3:设置基本业务信息
             */
            int ret = mVoiceEngine.SetAppInfo(Contants.GVoice_APP_ID, Contants.GVoice_APP_KEY, pid);
            if (ret != 0) {
                msgStr = "SetAppInfo 遇到错误，Error code: " + ret;
                Utils.logI(msgStr);
            } else {
                msgStr = "SetAppInfo 成功";
                Utils.logI(msgStr);
            }
            /**
             * Step4:初始化引擎
             */
            ret = mVoiceEngine.Init();
            if (ret != 0) {
                msgStr = "GCloudVoiceEngine 初始化遇到错误，Error code: " + ret;
                Utils.logI(msgStr);
            } else {
                msgStr = "GCloudVoiceEngine 初始化成功";
                Utils.logI(msgStr);
                bEngineInit = true;
            }
            if (bEngineInit){
                onJaveToJS("GVInit",ret, msgStr, "");
            }else {
                onJaveToJS("GVInit",ret, msgStr, "");
            }
        }
    }
    /**
     * <p>
     * 注意！使用引擎前必须先按如下步骤完成引擎的初始化工作
     *
     * @param activity
     * @return 0:初始化成功  负值：当前application定义的错误 正值：GCloudVoiceErrno 错误码
     */
    public int initGvoice(Activity activity) {
        int ret = 0;
        String logStr;
        if (!bEngineInit) {
            if (activity == null) {
                logStr = "Activity 不能为空!";
                Utils.logI(logStr);
                return -1;
            }
            mActivity = activity;
            mContext = activity.getApplicationContext();

            /**
             * Step1:获取 GCloudVoice 引擎实例
             */
            mVoiceEngine = GCloudVoiceEngine.getInstance();
            if (mVoiceEngine == null) {
                logStr = "GCloudVoiceEngine 获取失败";
                Utils.logI(logStr);
                ret = GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_ENGINE_ERR;
                return ret;
            } else {
                logStr = "GCloudVoiceEngine 获取成功";
                Utils.logI(logStr);
            }

            /**
             * Step2:添加上下文信息
             */
            mVoiceEngine.init(mContext, mActivity);

            /**
             * Step3:设置基本业务信息
             */
            ret = mVoiceEngine.SetAppInfo(Contants.GVoice_APP_ID, Contants.GVoice_APP_KEY, openID);
            if (ret != 0) {
                logStr = "SetAppInfo 遇到错误，Error code: " + ret;
                Utils.logI(logStr);
                return ret;
            } else {
                logStr = "SetAppInfo 成功";
                Utils.logI(logStr);
            }

            /**
             * Step4:初始化引擎
             */
            ret = mVoiceEngine.Init();
            if (ret != 0) {
                logStr = "GCloudVoiceEngine 初始化遇到错误，Error code: " + ret;
                Utils.logI(logStr);
                return ret;
            } else {
                logStr = "GCloudVoiceEngine 初始化成功";
                Utils.logI(logStr);
            }
            /**
             * 获取GVoice引擎并设置回调
             */
            mHandler = new GvoiceHandler();
            mNotify = new GvoiceNotify(AppActivity.applicationContext, mHandler);
            mVoiceEngine.SetNotify(mNotify);
        }
        return ret;
    }

    public GCloudVoiceEngine getVoiceEngine() {
        return mVoiceEngine;
    }

    public static boolean isEngineInit() {
        return bEngineInit;
    }
    /**
     * 允许多房间模式
     */
    public static void EnableMultiRoom(String enable) {
        int ret = 0;
        if ("enable".equals(enable)){
            ret = mVoiceEngine.EnableMultiRoom(true);
            if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
                msgStr = "允许多房间模式";
            } else {
                msgStr = "允许多房间模式遇到错误 Error code: " + ret;
            }
            Utils.logI(msgStr);
        }else {
            ret = mVoiceEngine.EnableMultiRoom(false);
            if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
                msgStr = "不允许多房间模式";
            } else {
                msgStr = "不允许多房间模式遇到错误 Error code: " + ret;
            }
            Utils.logI(msgStr);
        }

    }
    /**
     * 进入实时语音模式
     */
    public static void enterRealtimeMode() {
        if (isEngineInit()) {
            int ret = mVoiceEngine.SetMode(GCloudVoiceErrorCode.Mode.RealTime);
            if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
                msgStr = "GVoice已成功设置为实时语音模式!";
                Utils.logI(msgStr);
                onJaveToJS("EnterRealtimeMode",ret, msgStr, "");
            } else {
                msgStr = "设置GVoice为实时语音模式遇到错误!\n Error code: " + ret;
                Utils.logI(msgStr);
                onJaveToJS("EnterRealtimeMode",ret, msgStr, "");
//                Utils.showShortMsg(mCtx, msgStr);
            }
        } else {
            msgStr = "GVoice还没有成功初始化，请先初始化!";
            Utils.logI(msgStr);
//            Utils.showShortMsg(mCtx, msgStr);
        }
    }

    /**
     * 进入离线消息模式
     */
    private void enterMsgMode() {
        if (isEngineInit()) {
            int ret = mVoiceEngine.SetMode(GCloudVoiceErrorCode.Mode.Messages);
            if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
                msgStr = "GVoice已成功设置为离线消息模式!";
                Utils.logI(msgStr);
            } else {
                msgStr = "设置GVoice为离线消息模式遇到错误!\n Error code: " + ret;
                Utils.logI(msgStr);
//                Utils.showShortMsg(mCtx, msgStr);
            }
        } else {
            msgStr = "GVoice还没有成功初始化，请先初始化!";
            Utils.logI(msgStr);
//            Utils.showShortMsg(mCtx, msgStr);
        }
    }

    /**
     * 进入语音转文字模式
     */
    private void enterRsttMode() {
        if (isEngineInit()) {
            int ret = mVoiceEngine.SetMode(GCloudVoiceErrorCode.Mode.RSTT);
            if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
                msgStr = "GVoice已成功设置为语音转文字模式!";
                Utils.logI(msgStr);
            } else {
                msgStr = "设置GVoice为语音转文字模式遇到错误!\n Error code: " + ret;
                Utils.logI(msgStr);
//                Utils.showShortMsg(mCtx, msgStr);
            }
        } else {
            msgStr = "GVoice还没有成功初始化，请先初始化!";
            Utils.logI(msgStr);
//            Utils.showShortMsg(mCtx, msgStr);
        }
    }

    /**
     * 进入小队语音房间
     */
    public static void enterTeamroom(String teamRoomName) {
        int ret = mVoiceEngine.JoinTeamRoom(teamRoomName, msTimeOut);
        if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
            msgStr = "JoinTeamRoom Room name: " + teamRoomName + "，timeout: " + msTimeOut;
            Utils.logI(msgStr);
        } else {
            msgStr = "JoinTeamRoom 遇到错误Error code: " + ret +
                    "room name: " + teamRoomName + "timeout: " + msTimeOut;
            Utils.logI(msgStr);
//            Utils.showShortMsg(mCtx, msgStr);
        }
    }

    /**
     * 开关房间麦克风
     */
    public static void EnableRoomMicrophone(String teamRoomName, String enable) {
        int ret = 0;
        if ("enable".equals(enable) && openMic() == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC){
            ret = mVoiceEngine.EnableRoomMicrophone(teamRoomName,true);
            if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
                msgStr = teamRoomName + " 开麦成功";
                mVoiceEngine.SetMicVolume(150);
                bOpenMic = true;
            } else {
                msgStr = teamRoomName + "开麦遇到错误 Error code: " + ret;
            }
            Utils.logI(msgStr);
            onJaveToJS("OpenMic",ret, msgStr, teamRoomName);
        }else if (closeMic() == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC){
            ret = mVoiceEngine.EnableRoomMicrophone(teamRoomName,false);
            if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
                msgStr = teamRoomName + " 关麦成功";
                bOpenMic = true;
            } else {
                msgStr = teamRoomName + "关麦遇到错误，Error code: " + ret;
            }
            Utils.logI(msgStr);
            onJaveToJS("CloseMic",ret, msgStr, teamRoomName);
        }else{
            msgStr = teamRoomName + "操作麦遇到错误，Error code: " + ret;
            Utils.logI(msgStr);
        }
    }
    /**
     * 开关房间麦克风
     */
    public static void EnableRoomSpeaker(String teamRoomName, String enable) {
        int ret = 0;
        if ("enable".equals(enable) && openSpeaker() == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC){
            ret = mVoiceEngine.EnableRoomSpeaker(teamRoomName,true);
            if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
                msgStr = teamRoomName + " 开扬声器成功";
                mVoiceEngine.SetSpeakerVolume(150);
                bOpenMic = true;
            } else {
                msgStr = teamRoomName + "开扬声器遇到错误，Error code: " + ret;
            }
            Utils.logI(msgStr);
            onJaveToJS("OpenSpeaker",ret, msgStr, teamRoomName);
        }else if (closeSpeaker() == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
            ret = mVoiceEngine.EnableRoomSpeaker(teamRoomName,false);
            if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
                msgStr = teamRoomName + " 关扬声器成功";
                bOpenMic = true;
            } else {
                msgStr = teamRoomName + "关扬声器遇到错误，Error code: " + ret;
            }
            Utils.logI(msgStr);
            onJaveToJS("CloseSpeaker",ret, msgStr, teamRoomName);
        }else{
            msgStr = teamRoomName + "操作扬声器遇到错误，Error code: " + ret;
            Utils.logI(msgStr);
        }
    }
    /**
     * 开麦
     */
    public  static int openMic() {
        int ret = mVoiceEngine.OpenMic();
        if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
            msgStr = "开麦成功";
            bOpenMic = true;
        } else {
            msgStr = "开麦遇到错误Error code: " + ret;
        }
        Utils.logI(msgStr);
//        onJaveToJS("OpenMic",ret, msgStr, "");
        return ret;
//        Utils.showShortMsg(mCtx, msgStr);
    }

    /**
     * 关麦
     */
    public  static int closeMic() {
        int ret = mVoiceEngine.CloseMic();
        if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
            msgStr = "关麦成功";
            bOpenMic = false;
        } else {
            msgStr = "关麦遇到错误Error code: " + ret;
        }
        Utils.logI(msgStr);
//        onJaveToJS("CloseMic",ret, msgStr, "");
//        Utils.showShortMsg(mCtx, msgStr);
        return ret;
    }

    /**
     * 开扬声器
     */
    public  static int openSpeaker() {
        int ret = mVoiceEngine.OpenSpeaker();
        if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
            msgStr = "开扬声器成功";
            bOpenSpeaker = true;
        } else {
            msgStr = "开扬声器失败Error code: " + ret;
        }
        Utils.logI(msgStr);
//        onJaveToJS("OpenSpeaker",ret, msgStr, "");
//        Utils.showShortMsg(mCtx, msgStr);
        return ret;
    }

    /**
     * 关扬声器
     */
    public  static int closeSpeaker() {
        int ret = mVoiceEngine.CloseSpeaker();
        if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
            msgStr = "关扬声器成功";
            bOpenSpeaker = false;
        } else {
            msgStr = "关扬声器遇到错误，Error code: " + ret;
        }
        Utils.logI(msgStr);
//        onJaveToJS("CloseSpeaker",ret, msgStr, "");
//        Utils.showShortMsg(mCtx, msgStr);
        return ret;
    }

    /**
     * 退房，只有退房成功才能重新进房
     * 退房结果从回调方法OnQuitRoom获得
     */
    public  static void quitRoom(String teamRoomName) {
        msgStr = "退出房间："+teamRoomName;
        Utils.logI(msgStr);
        int ret = mVoiceEngine.QuitRoom(teamRoomName, msTimeOut);
        if (ret == GCloudVoiceErrorCode.GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
            msgStr = "退房，退房结果通过OnQuitRoom通知";
            Utils.logI(msgStr);
        } else {
            msgStr = "退房遇到错误，Error code: " + ret;
            Utils.logI(msgStr);
//            Utils.showShortMsg(mCtx, msgStr);
        }
    }
    class GvoiceHandler extends Handler {
        @Override
        public void handleMessage(Message msg) {

            switch (msg.what) {
                case MSG_JOINROOM:
                    msgStr = "进入房间";
                    Utils.logI(msgStr);
                    bInRoom = true;
                    String roomName = "";
                    try {
                        JSONObject a = new JSONObject(msg.obj.toString());
                        roomName = a.getString("roomName");
                        Utils.logI(msgStr+msg.obj.toString());
//                        roomName = a.getJSONObject(msg.obj.toString()).get("roomName").toString();
                    }catch(Exception e) {
                        Utils.logI(msgStr+"roomName null");
                    }
                    if (!mRoomNames.contains(roomName)) {
                        mRoomNames.add(roomName);
                    }
                    onJaveToJS("GvoiceJoinRoom",0, msgStr, roomName);
                    break;
                case MSG_QUITROOM:
                    msgStr = "退出房间";
                    Utils.logI(msgStr);
                    bInRoom = false;
                    String quitRoomName = "";
                    try {
                        JSONObject a = new JSONObject(msg.obj.toString());
                        quitRoomName = a.getString("roomName");
                        Utils.logI(msgStr+msg.obj.toString());
                    }catch(Exception e) {
                        Utils.logI(msgStr+"roomName null");
                    }
                    mRoomNames.remove(quitRoomName);
                    onJaveToJS("GvoiceQuitRoom",0, msgStr, quitRoomName);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 判断是否缺少权限
     */
    public static void CheckMicPermission(String name, String switchGameData) {
        boolean isOpen = ContextCompat.checkSelfPermission(AppActivity.getInstance(), Manifest.permission.RECORD_AUDIO) ==
                PackageManager.PERMISSION_DENIED;
        if (isOpen){
            onJaveToJS("CheckMicPermission",0, name + ",close", switchGameData);
        }else {
            onJaveToJS("CheckMicPermission",0, name + ",open", switchGameData);
        }

    }
    /**
     * 判断是否缺少扬声器权限
     */
    public static void CheckSpeakerPermission(String name, String switchGameData) {
        boolean isOpen = ContextCompat.checkSelfPermission(AppActivity.getInstance(), Manifest.permission.MODIFY_AUDIO_SETTINGS) ==
                PackageManager.PERMISSION_DENIED;
        if (isOpen){
            onJaveToJS("CheckSpeakerPermission",0, name + ",close", switchGameData);
        }else {
            onJaveToJS("CheckSpeakerPermission",0, name + ",close", switchGameData);
        }

    }
    /**
     * 通知客户端
     * */
    public static void onJaveToJS(String callType,int errCode, String errMsg, String data){
        try {
            JSONObject mJsonobjData = new JSONObject();
            mJsonobjData.put("ErrCode", errCode);
            mJsonobjData.put("ErrStr", errMsg);
            mJsonobjData.put("Data",data);

            NativeMgr.OnCallBackToJs(callType, mJsonobjData);
        } catch (Exception e) {
            // TODO: handle exception
            //e.printStackTrace();
            Log.e(TAG,e.toString());
        }
    }
}
