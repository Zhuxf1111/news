package lptc.thundersoft.com.news.ui.activity;

import android.webkit.WebView;

import butterknife.Bind;
import lptc.thundersoft.com.news.R;
import lptc.thundersoft.com.news.base.BaseActivity;

/**
 * Created by zxf on 16-8-5.
 */
public class GankInfoActivity extends BaseActivity {
    @Bind(R.id.gankinfo_webview)
    WebView mWebView;

    @Override
    protected int setLayout() {
        return R.layout.layout_activity_gankinfo;
    }

    @Override
    protected void init() {
        String url = getIntent().getStringExtra("url");
        mWebView.loadUrl(url);
    }
}
