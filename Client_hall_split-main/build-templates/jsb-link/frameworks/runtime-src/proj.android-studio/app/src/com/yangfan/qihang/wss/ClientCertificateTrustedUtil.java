package com.yangfan.qihang.wss;


import android.util.Log;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.NativeMgr;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class ClientCertificateTrustedUtil {
    public static AppActivity app = null;
    public static final String TAG = "TAG_CertificateTrusted";
    private static ClientCertificateTrustedUtil instance;
    private ClientCertificateTrustedUtil() {

    }

    public static ClientCertificateTrustedUtil getInstance() {
        if (instance == null) {
            synchronized (ClientCertificateTrustedUtil.class) {
                if (instance == null) {
                    instance = new ClientCertificateTrustedUtil();
                }
            }
        }
        return instance;
    }

    public void initAppActivity(AppActivity app) {
        com.yangfan.qihang.wss.ClientCertificateTrustedUtil.app = app;
    }

    public void init(AppActivity app) {
        this.initAppActivity(app);
    }

    public void onRequestNet() {
        //创建请求链接
        Request request = new Request.Builder().get().url("https://www.baidu.com").build();
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        try {
            //添加SSL证书验证
            Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>请求 https://www.baidu.com 添加SSL证书验证 ");
            builder.sslSocketFactory(getSSLSocketFactory(), new MyX509TrustManager());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        }
        Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>请求网络 https://www.baidu.com ");
        //请求网络
        OkHttpClient client = builder.build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, final IOException e) {
//                MainActivity.this.runOnUiThread(new Runnable() {
//                    @Override
//                    public void run() {
//                        mTextResult.setText("请求失败：\n" + e.getLocalizedMessage());
//                    }
//                });
                Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>请求失败 ClientCertificateTrustedUtil:  " + e.getLocalizedMessage());
            }


            @Override
            public void onResponse(Call call, Response response) throws IOException {
                final String result = response.body().string();
//                MainActivity.this.runOnUiThread(new Runnable() {
//                    @Override
//                    public void run() {
//                        mTextResult.setText("请求成功：\n" + result);
//                    }
//                });
                Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>请求成功 ClientCertificateTrustedUtil:  " + result);
            }
        });
    }

    private SSLSocketFactory getSSLSocketFactory() throws NoSuchAlgorithmException, KeyManagementException {
        SSLContext context = SSLContext.getInstance("TLS");
        TrustManager[] trustManagers = {new MyX509TrustManager()};
        context.init(null, trustManagers, new SecureRandom());
        return context.getSocketFactory();
    }

    private class MyX509TrustManager implements X509TrustManager {

        @Override
        public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
            Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>ClientCertificateTrustedUtil checkClientTrusted");

        }

        @Override
        public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
            Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>ClientCertificateTrustedUtil checkServerTrusted");
            if (chain == null) {
                String msg = "checkServerTrusted: X509Certificate array is null";
                this.onCheckServerTrusted(msg);
                throw new CertificateException("checkServerTrusted: X509Certificate array is null");
            }
            if (chain.length < 1) {
                String msg = "checkServerTrusted: X509Certificate is empty";
                this.onCheckServerTrusted(msg);
                throw new CertificateException("checkServerTrusted: X509Certificate is empty");
            }
            if (!(null != authType && authType.equals("ECDHE_RSA"))) {
                String msg = "checkServerTrusted: AuthType is not ECDHE_RSA";
                this.onCheckServerTrusted(msg);
                throw new CertificateException("checkServerTrusted: AuthType is not ECDHE_RSA");
            }

            //检查所有证书
            try {
                TrustManagerFactory factory = TrustManagerFactory.getInstance("X509");
                factory.init((KeyStore) null);
                for (TrustManager trustManager : factory.getTrustManagers()) {
                    ((X509TrustManager) trustManager).checkServerTrusted(chain, authType);
                }
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            } catch (KeyStoreException e) {
                e.printStackTrace();
            }

            //获取本地证书中的信息
            String clientEncoded = "";
            String clientSubject = "";
            String clientIssUser = "";
            try {
                CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
                String str = app.getAssets().toString();
                Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>ClientCertificateTrustedUtil assets: " + str);
                InputStream inputStream = app.getAssets().open("baidu.cer");
                X509Certificate clientCertificate = (X509Certificate) certificateFactory.generateCertificate(inputStream);
                clientEncoded = new BigInteger(1, clientCertificate.getPublicKey().getEncoded()).toString(16);
                clientSubject = clientCertificate.getSubjectDN().getName();
                clientIssUser = clientCertificate.getIssuerDN().getName();
            } catch (IOException e) {
                e.printStackTrace();
            }

            //获取网络中的证书信息
            X509Certificate certificate = chain[0];
            PublicKey publicKey = certificate.getPublicKey();
            String serverEncoded = new BigInteger(1, publicKey.getEncoded()).toString(16);

            if (!clientEncoded.equals(serverEncoded)) {
                String msg = "server's PublicKey is not equals to client's PublicKey";
                this.onCheckServerTrusted(msg);
                throw new CertificateException(msg);
            }
            String subject = certificate.getSubjectDN().getName();
            if (!clientSubject.equals(subject)) {
                String msg = "server's subject is not equals to client's subject";
                this.onCheckServerTrusted(msg);
                throw new CertificateException(msg);
            }
            String issuser = certificate.getIssuerDN().getName();
            if (!clientIssUser.equals(issuser)) {
                String msg = "server's issuser is not equals to client's issuser";
                this.onCheckServerTrusted(msg);
                throw new CertificateException(msg);
            }

            Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>ClientCertificateTrustedUtil:  证书验证成功 ClientCertificateTrustedUtil");
        }

        public void onCheckServerTrusted(String msg) {
            try {
                JSONObject mJsonobjData = new JSONObject();
                mJsonobjData.put("msg", msg);
                NativeMgr.OnCallBackToJs("OnHttpsCallBack", mJsonobjData);
            } catch (Exception ee) {
                ee.printStackTrace();
            }
        }

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return new X509Certificate[0];
        }
    }


}
