package org.cocos2dx.javascript.Voice;

import android.annotation.TargetApi;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.PowerManager;
import android.util.Log;
import android.widget.Toast;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.NativeMgr;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Method;

import static android.content.Context.POWER_SERVICE;
//import static com.loopj.android.http.AsyncHttpClient.log;

/*
 * Created by john on 15/12/14.
 * 语音播放的管理类
 */
public class MediaManager implements SensorEventListener {
    private static MediaPlayer player;
    private static boolean isPause;

    private static MediaManager instance;
    private AudioManager audioManager;
    private SensorManager mSensorManager;
    private Sensor mSensor;
    private PowerManager powerManager;
    private PowerManager.WakeLock wakeLock;
    private  boolean mIsFirstEnter;

    public  static MediaManager getInstance(){
        if (instance == null){
            synchronized (MediaManager.class){
                if (instance == null)
                {
                    instance = new MediaManager();
                    instance.init();
                }
            }
        }
        return instance;
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    private void init(){
        audioManager = (AudioManager) AppActivity.getInstance().getSystemService(Context.AUDIO_SERVICE);
        powerManager = (PowerManager) AppActivity.getInstance().getSystemService(POWER_SERVICE);
//        wakeLock = powerManager.newWakeLock(PowerManager.PROXIMITY_SCREEN_OFF_WAKE_LOCK, "wakelock");

        mSensorManager = (SensorManager) AppActivity.getInstance().getSystemService(Context.SENSOR_SERVICE);
        mSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY);
        mSensorManager.registerListener(this, mSensor,
                SensorManager.SENSOR_DELAY_NORMAL);
    }

   /*
     *  播放声音
     * @param filePath
     * @param listener
     */
    public  void  playSound(String filePath/*, MediaPlayer.OnCompletionListener listener*/){
        Log.e("playSound","filePath="+filePath);
        if(filePath.equals("")){
            Log.e("playSound", "文件为空");
            return;
        }
        if(org.cocos2dx.javascript.Voice.AudioManager.getInstance().getIsPrepare()){
            //Toast.makeText(AppActivity.getInstance(), "正在录音", Toast.LENGTH_LONG).show();
            Log.e("playSound", "正在录音");

            JSONObject mJsonobjData = new JSONObject();

            NativeMgr.OnCallBackToJs("MedioRecordError", mJsonobjData);
            return;
        }
        int current = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
        Log.i("playSound", "音量:" + current);
        if (isModeSilent() || current == 0){
//            Toast.makeText(AppActivity.getInstance(), "请调大音量后播放", Toast.LENGTH_LONG).show();
            Log.e("playSound", "请调大音量后播放");
            //JSONObject mJsonobjData = new JSONObject();

            //NativeMgr.OnCallBackToJs("palyAudioFinsh", mJsonobjData);
            //return;
        }
        mSensorManager.registerListener(this, mSensor,    SensorManager.SENSOR_DELAY_NORMAL);
        if (player == null) {
            player = new MediaPlayer();
            //设置报错监听
            player.setOnErrorListener(new MediaPlayer.OnErrorListener() {
                @Override
                public boolean onError(MediaPlayer mediaPlayer, int i, int i1) {
                    player.reset();
                    return false;
                }
            });
        }else {
            player.reset();//复位
        }

        try
        {
            audioManager.setMode(AudioManager.MODE_NORMAL);
            player.setAudioStreamType(AudioManager.STREAM_MUSIC);
            setSpeakerphoneOn(true);
//            if (audioManager.isWiredHeadsetOn())  // 开始播放语音时，已插入耳机
//            {
//               setSpeakerphoneOn(false);
//            }else{       // 未插入耳机
//                setSpeakerphoneOn(true);
//            }
            //player.setOnCompletionListener(listener);
            player.setOnCompletionListener(new MediaPlayer.OnCompletionListener () {
                                          @Override
                                     public void onCompletion(MediaPlayer mp) {
                                              Log.e("playSound","palyAudioFinsh");
                                              JSONObject mJsonobjData = new JSONObject();

                                              NativeMgr.OnCallBackToJs("palyAudioFinsh", mJsonobjData);
                                        }});
            player.setDataSource(filePath);
            player.prepare();
            //player.prepareAsync();
            player.start();
        }catch (IllegalArgumentException e) {
            Log.e("playSound","IllegalArgumentException ");

            JSONObject mJsonobjData = new JSONObject();

            NativeMgr.OnCallBackToJs("MedioRecordError", mJsonobjData);

            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (SecurityException e) {
            Log.e("playSound","SecurityException ");
            JSONObject mJsonobjData = new JSONObject();

            NativeMgr.OnCallBackToJs("MedioRecordError", mJsonobjData);

            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IllegalStateException e) {
            // TODO Auto-generated catch block
            Log.e("playSound","IllegalStateException ");
            JSONObject mJsonobjData = new JSONObject();

            NativeMgr.OnCallBackToJs("MedioRecordError", mJsonobjData);

            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            Log.e("playSound","IOException ");
            JSONObject mJsonobjData = new JSONObject();

            NativeMgr.OnCallBackToJs("MedioRecordError", mJsonobjData);

            e.printStackTrace();
        }
    }


    /*
     * 暂停播放
     */
    public  void pause(){
        if (player!= null && player.isPlaying())
        {
            player.pause();
            isPause = true;
        }
    }

    public  void  resume(){
        if (player != null && isPause)
        {
            player.start();
            isPause = false;
        }
    }

    public  void release(){
        if (player != null)
        {
            player.release();
            mSensorManager.unregisterListener(this);
            player = null;
        }
    }

    public boolean isPlaying(){
        return player!=null && player.isPlaying();
    }

    public  void stop(){
        if (player != null && player.isPlaying())
        {
            player.stop();
        }
    }

    private boolean isModeSilent(){
        return  audioManager !=null && (audioManager.getRingerMode() == AudioManager.RINGER_MODE_SILENT ||
                        audioManager.getRingerMode()  == AudioManager.RINGER_MODE_VIBRATE);
    }

    /**
     * 熄屏
     */
//    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
//    private void setScreenOff()
//    {
//        if (wakeLock == null)
//        {
//            wakeLock = powerManager.newWakeLock(PowerManager.PROXIMITY_SCREEN_OFF_WAKE_LOCK, "");
//        }
//        wakeLock.acquire();
//    }

    /**
     * 亮屏
     */
//    private void setScreenOn()
//    {
//        if (wakeLock != null)
//        {
//            wakeLock.setReferenceCounted(false);
//            wakeLock.release();
//            wakeLock = null;
//        }
//    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (isPlaying())          // 如果音频正在播放
        {
//            float distance = event.values[0];
//            if (distance >= mSensor.getMaximumRange())      // 用户远离听筒，音频外放，亮屏
//            {
                setSpeakerphoneOn(true);
//                setScreenOn();
//                log.e("onSensorChanged", "正常的模式 ");
                //EventUtils.post(IMConstant.EVENT_ON_CHAT_SPEAKER_STATE,true);
//            }else{    // 用户贴近听筒，切换音频到听筒输出，并且熄屏防误触
//
//                log.e("onSensorChanged","听筒模式 ");
//                setSpeakerphoneOn(false);
// //               setScreenOff();
//                //EventUtils.post(IMConstant.EVENT_ON_CHAT_SPEAKER_STATE,false);
//            }
        }
 //       else{            // 音频播放完了
//            if (wakeLock!= null && wakeLock.isHeld())   // 还没有release点亮屏幕
//            {
//                wakeLock.release();
//                wakeLock = null;
//            }
 //       }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }


    private void setSpeakerphoneOn(boolean on) {
        try {
            Class audioSystemClass = Class.forName("android.media.AudioSystem");
            Method setForceUse = audioSystemClass.getMethod("setForceUse", int.class, int.class);
            if (on) {
                audioManager.setMicrophoneMute(false);
                audioManager.setSpeakerphoneOn(true);
                audioManager.setMode(AudioManager.MODE_NORMAL);
Log.e("setSpeakerphoneOn","setSpeakerphoneOn on "+on);

                //audioManager.adjustStreamVolume(AudioManager.STREAM_MUSIC,AudioManager.ADJUST_RAISE,AudioManager.FLAG_SHOW_UI);//调高声音
//                audioManager.setStreamVolume(AudioManager.STREAM_VOICE_CALL, audioManager.getStreamMaxVolume(AudioManager.STREAM_VOICE_CALL), 0);
            } else {
                audioManager.setMicrophoneMute(true);
                audioManager.setSpeakerphoneOn(false);
                audioManager.setMode(AudioManager.MODE_NORMAL);
                setForceUse.invoke(null, 0, 0);

                audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
            }
        } catch (Exception e) {
            JSONObject mJsonobjData = new JSONObject();

            NativeMgr.OnCallBackToJs("MedioRecordError", mJsonobjData);

            e.printStackTrace();
        }
    }
}
