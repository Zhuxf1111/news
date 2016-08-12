package lptc.thundersoft.com.news.widget.web;

import android.app.Activity;
import android.content.Intent;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import lptc.thundersoft.com.news.ui.activity.GitHubLoginWebActivity;

/**
 * Created by zxf on 16-8-12.
 */
public class ViewWebGitHubLoginClient extends WebViewClient {
    private Activity mActivity;

    public ViewWebGitHubLoginClient(Activity activity){
        mActivity = activity;
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        if(url != null && url.startsWith("http")){
            Intent intent = new Intent();
            intent.setClass(mActivity, GitHubLoginWebActivity.class);
            intent.putExtra("url",url);
            mActivity.startActivity(intent);
            return true;
        }
        return super.shouldOverrideUrlLoading(view, url);
    }
}
