package org.cocos2dx.javascript.Voice;

import android.Manifest;
import android.content.pm.PackageManager;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.NativeMgr;
import org.json.JSONObject;

import java.io.File;
import java.util.UUID;
import java.util.concurrent.TimeoutException;

/*
 * Created by john on 15/12/14.
 *  录音的管理类
 */
public class AudioManager {
    private MediaRecorder recorder;
    private String mCurrentFilePath;

    public static final String TAG = "TAG_AudioManager";

    public static final int STATE_NO_PERMISSION = -1;
    public static final int STATE_RECORDING = 0;
    public static final int STATE_SUCCESS = 1;


    private static AudioManager instance;
    private boolean isPrepare;
    //private AudioStateListener listener;

//    public interface AudioStateListener{
//        void prepared();
//    }
/*
    public void setAudioStateListener(AudioStateListener _listener){
        this.listener = _listener;
    }
*/

    private AudioManager(){
    }

    public static AudioManager getInstance(){
        if (instance == null){
            synchronized (AudioManager.class){
                if (instance == null){
                    instance = new AudioManager();
                }
            }
        }
        return instance;
    }

    public void reqAudioAllow(){
        recorder = new MediaRecorder();
        recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        release();
    }


    public void prepareAudio(String fileName){
        try {
            if (!voicePermission()){
                Log.e(TAG, "没有权限");
                ActivityCompat.requestPermissions(AppActivity.getInstance(),
                        new String[]{Manifest.permission.RECORD_AUDIO, android.Manifest.permission.WRITE_EXTERNAL_STORAGE},
                        AppActivity.MY_PERMISSIONS_REQUEST_RECORD_AUDIO);
                return;
            }
            if(!hasRecordPermission()){
                Log.e(TAG, "没有录音权限");
                JSONObject mJsonobjData = new JSONObject();
                org.cocos2dx.javascript.NativeMgr.OnCallBackToJs("AudioError", mJsonobjData);
                return;
            }

            Log.e("prepareAudio", "fileName="+fileName);
            mCurrentFilePath = fileName;
            recorder = new MediaRecorder();
            // 设置输出文件
            recorder.setOutputFile(mCurrentFilePath);

            // 设置meidaRecorder的音频源是麦克风
            Log.e("prepareAudio", "int source   : " + MediaRecorder.AudioSource.MIC);
            recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            Log.e("prepareAudio", " 00000000 int source   : " + MediaRecorder.AudioSource.MIC);
            // 设置文件音频的输出格式为amr
            //recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
            recorder.setOutputFormat(3);
            Log.e("prepareAudio", " 00000000 111 int source   : " + MediaRecorder.AudioSource.MIC);
            // 设置音频的编码格式为amr
            recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
            //设置音频采样率
            //recorder.setAudioSamplingRate(8000);
            Log.e("prepareAudio", " 1111111 int source   : " + MediaRecorder.AudioSource.MIC);
            recorder.prepare();
            recorder.start();
            isPrepare = true;
            Log.e("prepareAudio", "222222 int source   : " + MediaRecorder.AudioSource.MIC);
            JSONObject mJsonobjData = new JSONObject();
            org.cocos2dx.javascript.NativeMgr.OnCallBackToJs("wellPrepared", mJsonobjData);
        }catch (Exception e){
            /*if (listener != null){
                listener.error();
            }*/
            JSONObject mJsonobjData = new JSONObject();
            org.cocos2dx.javascript.NativeMgr.OnCallBackToJs("AudioError", mJsonobjData);

            release();

            Log.e("prepareAudio", "catch e:"+e.toString());
            //cancel();
            e.printStackTrace();
        }
    }

    public int getVoiceLevel(int maxLevel){
        if (isPrepare){
            try {
                // mMediaRecorder.getMaxAmplitude() 1~32767
                return maxLevel*recorder.getMaxAmplitude()/32768 +1;
            }
            catch (Exception e){
                e.printStackTrace();
            }
        }
        return 1;
    }



   


    /*
     * 释放资源
     */
    public void release(){
        try {
            if (recorder != null){
                recorder.setOnErrorListener(null);
                recorder.setOnInfoListener(null);
                recorder.setPreviewDisplay(null);
                recorder.stop();
                recorder.reset();
                recorder.release();
                recorder = null;
                isPrepare = false;

                JSONObject mJsonobjData = new JSONObject();
                NativeMgr.OnCallBackToJs("RecordAudioFinsh", mJsonobjData);
            }
        }catch (Exception e){
            JSONObject mJsonobjData = new JSONObject();
            org.cocos2dx.javascript.NativeMgr.OnCallBackToJs("AudioStopError", mJsonobjData);

            Log.e("release", "catch");
            e.printStackTrace();
        }
    }

    public void cancel(){
        release();
        deleteFile();
    }

    public  void deleteFile(){
        if (mCurrentFilePath != null){
            Log.e("deleteFile", "删除文件     :" + mCurrentFilePath);
            File file = new File(mCurrentFilePath);
            file.delete();
            mCurrentFilePath = null;
        }
    }

    public boolean getIsPrepare() {
        return  isPrepare;
    }




    /**
     * 判断是否有录音权限
     *
     * @return
     */
    public static boolean hasRecordPermission() {
        boolean hasPermission = false;
        if (getRecordState() == STATE_SUCCESS) {
            hasPermission = true;
        } else {
            hasPermission = false;
        }
        return hasPermission;
    }


    /**
     * 获取录音状态
     *
     * @return
     */
    public static int getRecordState() {
        int minBuffer = AudioRecord.getMinBufferSize(44100, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
        short[] point = new short[minBuffer];
        int readSize = 0;

        AudioRecord audioRecord = null;
        try {
            audioRecord = new AudioRecord(MediaRecorder.AudioSource.DEFAULT, 44100, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, (minBuffer * 100));
            // 开始录音
            audioRecord.startRecording();// 检测是否可以进入初始化状态

        } catch (Exception e) {
            Log.e(TAG, "catch, 捕捉到异常, 无录音权限, e = " + e.getMessage());

            if (audioRecord != null) {
                audioRecord.release();
                audioRecord = null;
                Log.i(TAG, "catch, 返回对象非空,释放资源");
            } else {
                Log.i(TAG, "catch, 返回对象非空");
            }

            return STATE_NO_PERMISSION;
        }

        // 检测是否在录音中
        if (audioRecord.getRecordingState() != AudioRecord.RECORDSTATE_RECORDING) {
            // 6.0以下机型都会返回此状态，故使用时需要判断bulid版本
            if (audioRecord != null) {
                audioRecord.stop();
                audioRecord.release();
                audioRecord = null;
                Log.e(TAG, "无法启动录音, 无法录音");
            }
            return STATE_RECORDING;

        } else {// 正在录音
            readSize = audioRecord.read(point, 0, point.length);

            // 检测是否可以获取录音结果
            if (readSize <= 0) {
                if (audioRecord != null) {
                    audioRecord.stop();
                    audioRecord.release();
                    audioRecord = null;
                }
                Log.e(TAG, "没有获取到录音数据，无录音权限");
                return STATE_NO_PERMISSION;
            } else {
                if (audioRecord != null) {
                    audioRecord.stop();
                    audioRecord.release();
                    audioRecord = null;
                }
                Log.i(TAG, "获取到录音数据, 有录音权限");
                return STATE_SUCCESS;
            }
        }
    }


    private  boolean voicePermission(){

//        return (PackageManager.PERMISSION_GRANTED ==   ContextCompat.
//                checkSelfPermission(AppActivity.getContext(), android.Manifest.permission.WRITE_EXTERNAL_STORAGE));
        int state = ContextCompat.
                checkSelfPermission(AppActivity.getInstance(), android.Manifest.permission.RECORD_AUDIO);
        Log.e(TAG, "voicePermission state = "+ state);
        return (PackageManager.PERMISSION_GRANTED ==  state);
    }

}
