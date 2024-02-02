package com.yangfan.qihang.mwapi;

import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;

/**
 * 跳转返回界面
 *
 * @author : SEA
 * @class : com.mostone.open.demo.ReturnActivity
 * @time : 2018/10/26 11:46
 */
public class ReturnActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_return);
//
//
//        TextView content = (TextView) findViewById(R.id.tv_content);
        //获取回调返回的内容
        Uri uri = getIntent().getData();
        if (uri != null) {
            //简单展示
//            String query = uri.getQuery();
//            content.setText(query);
        }

    }
}
