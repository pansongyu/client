package com.yangfan.qihang.wss;



import android.util.Log;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.Contants;

import android.os.Handler;

import java.io.IOException;
import java.net.Proxy;
import java.net.ProxySelector;
import java.net.SocketAddress;
import java.net.URI;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.Collections;
import java.util.List;

import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class ClientCertificateUtil {
    public static AppActivity app = null;
    public static final String TAG = "TAG_CertificateUtil";

    private HttpClientApi httpClientApi;
    private OkHttpClient okHttpClient;
    private Handler handler = new Handler();

    private static ClientCertificateUtil instance;

    private ClientCertificateUtil() {

    }

    public static ClientCertificateUtil getInstance() {
        if (instance == null) {
            synchronized (ClientCertificateUtil.class) {
                if (instance == null) {
                    instance = new ClientCertificateUtil();
                }
            }
        }
        return instance;
    }

    public void initAppActivity(AppActivity app) {
        com.yangfan.qihang.wss.ClientCertificateUtil.app = app;
    }

    public void init(AppActivity app) {
        this.initAppActivity(app);
    }


    public void checkOkHttpClientProxy() {
        OkHttpClient client = new OkHttpClient.Builder()
                .proxySelector(new ProxySelector() {
                    @Override
                    public List<Proxy> select(URI uri) {
                        return Collections.singletonList(Proxy.NO_PROXY);
                    }

                    @Override
                    public void connectFailed(URI uri, SocketAddress sa, IOException ioe) {

                    }
                }).build();
    }




    private static KeyStore provideKeyStore() {
        try {
            KeyStore keyStore = KeyStore.getInstance("PKCS12");
            keyStore.load(AppActivity.getInstance().getAssets().open(Contants.ASSET_FILE_NAME), Contants.PASSWORD.toCharArray());
            Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>:  provideKeyStore try");

            return keyStore;
        } catch (KeyStoreException | CertificateException | NoSuchAlgorithmException | IOException e) {
            Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>:  provideKeyStore try 失败");
            throw new RuntimeException(e);
        }
    }

    private static KeyManager[] getKeyManager() {
        try {
            KeyManagerFactory kmf = KeyManagerFactory.getInstance("PKIX");
            kmf.init(provideKeyStore(), Contants.PASSWORD.toCharArray());
            Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>:  getKeyManager try");

            return kmf.getKeyManagers();
        } catch (NoSuchAlgorithmException | KeyStoreException | UnrecoverableKeyException e) {
            Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>:  getKeyManager try 失败");

            throw new RuntimeException(e);
        }
    }

    public static SSLSocketFactory provideSSLSocketFactory() {
        try {
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(getKeyManager(), null, null);
            return sslContext.getSocketFactory();
        } catch (NoSuchAlgorithmException | KeyManagementException e) {
            throw new RuntimeException(e);
        }
    }

    public static X509TrustManager provideX509TrustManager() {
        try {
            TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            trustManagerFactory.init((KeyStore) null);
            X509TrustManager x509TrustManager = null;
            for (TrustManager trustManager : trustManagerFactory.getTrustManagers()) {
                System.out.println(trustManager);
                if (trustManager instanceof X509TrustManager) {
                    x509TrustManager = (X509TrustManager) trustManager;
                    break;
                }
            }
            return x509TrustManager;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static boolean checkSSLCertificateSecure() {
//        OkHttpClient.Builder builder = new OkHttpClient.Builder();
//        X509TrustManager trustManager = ClientCertificateUtil.provideX509TrustManager();
//        SSLSocketFactory sslSocketFactory = ClientCertificateUtil.provideSSLSocketFactory();
//        builder.sslSocketFactory(sslSocketFactory, trustManager);
//        okHttpClient = builder.build();
        return true;
    }

    private void doTheWorkUsingApache() {
        String result = httpClientApi.doGet(Contants.SERVER_URL);
        int responseCode = httpClientApi.getLastResponseCode();
//        handler.post(() -> appendingText(responseCode, result));
    }

    private void doTheWorkUsingOkhttp() {
        try {
            Request request = new Request.Builder().url(Contants.SERVER_URL).build();
            Response response = okHttpClient.newCall(request).execute();
            int code = response.code();
            ResponseBody body = response.body();
            String result = body == null ? null : body.string();
//            handler.post(() -> appendingText(code, result));
//            handler.post();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void appendingText(int responseCode, String result) {
//        updateOutput(responseCode + ":" + result);
    }

//    private void runApache(int count) {
//
////        initHttpClient();
////        Thread thread = new Thread((execute(count));
////        thread.start();
//    }

//    private void initHttpClient() {
//        httpClientApi = new HttpClientApi();
//    }

//    private void execute(int count) {
//        for (int i = 0; i < count; i++) {
//            doTheWorkUsingApache();
//        }
//    }

    private void runOkHttp(int count) {
        initOkHttpClient();
//        Thread thread = new Thread(() -> executeOkhttp(count));
//        thread.start();
    }

    /**
     * If you create SSLSocketFactory there, only the first request will succeed.
     * However, if you create your SSLSocketFactory in the forloop, which create a new
     * sSLSocketFactory every time. It will always work.
     */
    private void initOkHttpClient() {
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        X509TrustManager trustManager = ClientCertificateUtil.provideX509TrustManager();
        SSLSocketFactory sslSocketFactory = ClientCertificateUtil.provideSSLSocketFactory();
        builder.sslSocketFactory(sslSocketFactory, trustManager);
        okHttpClient = builder.build();
    }

    private void executeOkhttp(int count) {
        for (int i = 0; i < count; i++) {
            doTheWorkUsingOkhttp();
        }
    }

}
