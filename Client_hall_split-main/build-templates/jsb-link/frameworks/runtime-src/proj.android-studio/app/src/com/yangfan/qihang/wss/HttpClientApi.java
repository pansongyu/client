package com.yangfan.qihang.wss;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSocketFactory;


/**
 * client-side interface to the back-end application.
 */
public class HttpClientApi {

    private int lastResponseCode;
    private SSLSocketFactory sslSocketFactory;

    public HttpClientApi() {
        this.sslSocketFactory = ClientCertificateUtil.provideSSLSocketFactory();
    }

    public static String readFully(InputStream inputStream) throws IOException {

        if (inputStream == null) {
            return "";
        }

        BufferedInputStream bufferedInputStream = null;
        ByteArrayOutputStream byteArrayOutputStream = null;

        try {
            bufferedInputStream = new BufferedInputStream(inputStream);
            byteArrayOutputStream = new ByteArrayOutputStream();

            final byte[] buffer = new byte[1024];
            int available = 0;

            while ((available = bufferedInputStream.read(buffer)) >= 0) {
                byteArrayOutputStream.write(buffer, 0, available);
            }

            return byteArrayOutputStream.toString();

        } finally {
            if (bufferedInputStream != null) {
                bufferedInputStream.close();
            }
        }
    }

    public int getLastResponseCode() {
        return lastResponseCode;
    }

    public String doGet(String url) {
        String result;
        HttpURLConnection urlConnection = null;
        try {
            URL requestedUrl = new URL(url);
            urlConnection = (HttpURLConnection) requestedUrl.openConnection();
            if (urlConnection instanceof HttpsURLConnection) {
                ((HttpsURLConnection) urlConnection).setSSLSocketFactory(sslSocketFactory);
            }
            urlConnection.setRequestMethod("GET");
            urlConnection.setConnectTimeout(1500);
            urlConnection.setReadTimeout(1500);

            lastResponseCode = urlConnection.getResponseCode();
            InputStream inputStream = urlConnection.getInputStream();
            result = readFully(inputStream);
        } catch (Exception ex) {
            result = " Client Certificate Error";
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }
        return result;
    }
}
