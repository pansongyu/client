package org.cocos2dx.javascript.DownLoad;

import android.os.Bundle;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.Contants;
import org.cocos2dx.javascript.NativeMgr;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import cz.msebera.android.httpclient.HttpEntity;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.client.ClientProtocolException;
import cz.msebera.android.httpclient.client.methods.HttpGet;
import cz.msebera.android.httpclient.impl.client.DefaultHttpClient;

import static org.cocos2dx.javascript.NativeMgr.getSubGameName;

/**
 * Created by zaf on 2017/6/22.
 */

public class DownloadMgr extends AppActivity {
    //更新apk
    public static void openApk(String path, String apkName) {
        Log.e("openApk", "filePath = " + path);
        if (NativeMgr.mJniHandler != null) {
            Message msg = new Message();
            msg.what = Contants.MSG_OpenApk;

            Bundle bundle = new Bundle();
            bundle.putString("filePath", path);
            bundle.putString("apkName", apkName);
            msg.setData(bundle);
            org.cocos2dx.javascript.NativeMgr.mJniHandler.sendMessage(msg);
        }
    }

    /**
     * 删除单个文件
     *
     * @param sPath 被删除文件的文件名
     * @return 单个文件删除成功返回true，否则返回false
     */
    public static boolean DelFile(final String sPath) {
        boolean flag = false;
        File file = new File(sPath);
        // 路径为文件且不为空则进行删除
        if (file.isFile() && file.exists()) {
            file.delete();
            flag = true;
        }
        return flag;
    }

    /*
    * 从网络下载文件
    * */
    public static void downLoadFile(final String urls, final String fileName, final String savePath, final  String downloadType) throws IOException {
        Log.e("downLoadFile", "url=" + urls + ",filename=" + fileName + ",savePath=" + savePath);
        DelFile(savePath + fileName);
        new Thread() {
            @Override
            public void run() {
                try {
                    DefaultHttpClient client = new DefaultHttpClient();
                    HttpGet get = new HttpGet(urls);
                    HttpResponse response;

                    response = client.execute(get);
                    HttpEntity entity = response.getEntity();
                    long length = entity.getContentLength();
                    InputStream is = entity.getContent();
                    FileOutputStream fileOutputStream = null;

                    Log.e("downLoadFile", "MalformedURLException 11111111111 urls=" + urls + ",filename="+savePath + fileName);
                    if (is != null) {
                        File file = new File(savePath + fileName);
                        fileOutputStream = new FileOutputStream(file);
                        byte[] buf = new byte[1024 * 1024];
                        int ch = -1;
                        int count = 0;
                        double proess = 0;
                        while ((ch = is.read(buf)) != -1) {
                            fileOutputStream.write(buf, 0, ch);

                            count += ch;
                            if (Math.floor( 100.0f*count / length) - proess >= 1) {
                                OnDownLoadEvent(Contants.DownLoadState_Progress, downloadType, Math.floor(100.0f * count / length), fileName);
                                proess = Math.floor( 100.0f*count / length);
                            }
                        }
                    }
                    fileOutputStream.flush();
                    if (fileOutputStream != null) {
                        fileOutputStream.close();
                    }
                    if("LoadApkProess".equals(downloadType)){
                        openApk(savePath, fileName);
                    }else{
                        OnDownLoadEvent(Contants.DownLoadState_Finish, downloadType, 0, fileName);
                    }
                } catch (ClientProtocolException e) {
                    OnDownLoadEvent(Contants.DownLoadState_Error, downloadType, 0, fileName);
                    e.printStackTrace();
                    //Toast.makeText(AppActivity.getInstance().getContext(), "下载失败!请重新下载!", Toast.LENGTH_LONG).show();
                } catch (IOException e) {
                    OnDownLoadEvent(Contants.DownLoadState_Error, downloadType, 0, fileName);
                    e.printStackTrace();
                    //Toast.makeText(AppActivity.getInstance().getContext(), "下载失败!请重新下载!", Toast.LENGTH_LONG).show();
                } catch (Exception e) {
                    OnDownLoadEvent(Contants.DownLoadState_Error, downloadType, 0, fileName);
                    e.printStackTrace();
                    //Toast.makeText(AppActivity.getInstance().getContext(), "下载失败!请重新下载!", Toast.LENGTH_LONG).show();
                }
            }
        }.start();
    }


    /*
    * 下载回调
    * */
    public  static  void OnDownLoadEvent(int state,  String downloadType, double progress, String filename){
        Log.e("OnDownLoadEvent", "state="+state+", downloadType="+downloadType+",progress="+progress);
        try {
            JSONObject mJsonobjData = new JSONObject();
            mJsonobjData.put("state",  state);
            mJsonobjData.put("downloadType",  downloadType);
            mJsonobjData.put("proess",  progress);
            mJsonobjData.put("filename",  filename);
            org.cocos2dx.javascript.NativeMgr.OnCallBackToJs("download", mJsonobjData);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * 从网络Url中下载文件
     *
     * @param urls
     * @param fileName
     * @param savePath
     * @throws IOException
     */
    public static void downLoadFromUrl(final String urls, final String fileName, final String savePath) throws IOException {
        Log.e("downLoadFromUrl", "url=" + urls + ",filename=" + fileName + ",savePath=" + savePath);
        DelFile(savePath + fileName);
        new Thread() {
            @Override
            public void run() {
                try {
                    Log.e("downLoadFromUrl", "MalformedURLException urls=" + urls );
                    DefaultHttpClient client = new DefaultHttpClient();
                    Log.e("downLoadFromUrl", "MalformedURLException 00000 11111 urls=" + urls );
                    HttpGet get = new HttpGet(urls);
                    Log.e("downLoadFromUrl", "MalformedURLException 00000 22222 urls=" + urls );
                    HttpResponse response;
                    Log.e("downLoadFromUrl", "MalformedURLException 00000000 urls=" + urls );

                    response = client.execute(get);
                    HttpEntity entity = response.getEntity();
                    long length = entity.getContentLength();
                    InputStream is = entity.getContent();
                    FileOutputStream fileOutputStream = null;

                    Log.e("downLoadFromUrl", "MalformedURLException 11111111111 urls=" + urls );
                    if (is != null) {
                        File file = new File(savePath + fileName);
                        fileOutputStream = new FileOutputStream(file);
                        byte[] buf = new byte[1024 * 1024];
                        int ch = -1;
                        int count = 0;
                        double proess = 0;
                        String datastr;
                        while ((ch = is.read(buf)) != -1) {
                            fileOutputStream.write(buf, 0, ch);
                            count += ch;
                            Log.e("downLoadFromUrl", "MalformedURLException count=" + count + ",pross=" + Math.floor( 100.0f*count / length));
                            JSONObject mJsonobjData = new JSONObject();
                            mJsonobjData.put("proess",  Math.floor( 100.0f*count / length));
                            datastr = null;
                            datastr = mJsonobjData.toString();
                            final String downloadProess = String.format(getSubGameName()+"_NativeNotify.OnNativeNotify('%s','%s')","apkProess", datastr);
                            if (Math.floor( 100.0f*count / length) - proess >= 1) {
                                //一定要在GL线程中执行
                                AppActivity.getInstance().runOnGLThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        Cocos2dxJavascriptJavaBridge.evalString(downloadProess);
                                    }
                                });
                                proess = Math.floor( 100.0f*count / length);
                            }
                        }
                    }
                    fileOutputStream.flush();
                    if (fileOutputStream != null) {
                        fileOutputStream.close();
                    }
                    openApk(savePath, fileName);
                } catch (ClientProtocolException e) {
                    Log.e("downLoadFromUrl", "ClientProtocolException");
                    e.printStackTrace();
                    //Toast.makeText(AppActivity.getInstance().getContext(), "更新失败!请重新更新!", Toast.LENGTH_LONG).show();
                } catch (IOException e) {
                    Log.e("downLoadFromUrl", "IOException");
                    e.printStackTrace();
                    //Toast.makeText(AppActivity.getInstance().getContext(), "更新失败!请重新更新!", Toast.LENGTH_LONG).show();
                } catch (Exception e) {
                    Log.e("downLoadFromUrl", "Exception");
                    e.printStackTrace();
                    //Toast.makeText(AppActivity.getInstance().getContext(), "更新失败!请重新更新!", Toast.LENGTH_LONG).show();
                }
            }
        }.start();
    }

}
