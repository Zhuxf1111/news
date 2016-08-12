package lptc.thundersoft.com.news.ui.activity;

import android.content.Intent;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.webkit.WebView;
import android.widget.Toast;

import java.io.IOException;

import butterknife.Bind;
import lptc.thundersoft.com.news.R;
import lptc.thundersoft.com.news.base.BaseActivity;
import lptc.thundersoft.com.news.config.Constant;
import lptc.thundersoft.com.news.model.GitHubUserInfo;
import lptc.thundersoft.com.news.network.RetrofitHelper;
import lptc.thundersoft.com.news.widget.web.ViewWebGitHubLoginClient;
import okhttp3.ResponseBody;
import rx.Observable;
import rx.android.schedulers.AndroidSchedulers;
import rx.functions.Action1;
import rx.functions.Func1;
import rx.schedulers.Schedulers;

/**
 * Created by zxf on 16-8-8.
 */
public class GitHubLoginWebActivity extends BaseActivity implements View.OnLongClickListener {
    private static final String TAG = "GitHubLoginWebActivity";

    @Bind(R.id.gankinfo_webview)
    WebView mWebView;

    @Override
    protected int setLayout() {
        return R.layout.layout_activity_gankinfo;
    }

    @Override
    protected void init() {
        Intent intent = getIntent();
        parseIntent(intent);

        mWebView.setWebViewClient(new ViewWebGitHubLoginClient(this));
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (null != intent) {
        }
        parseIntent(intent);
    }

    private void parseIntent(Intent intent) {
        String url = intent.getStringExtra("url");
        if (TextUtils.isEmpty(url))
            finish();
        if (url.startsWith(Constant.GitHub.REDIRECT_URI)) {
            Log.i(TAG, url);
            String params = url.split("\\?")[1];
            String code = params.split("&")[0].split("=")[1];
            if (null != code) {
                RetrofitHelper.getGitHub().getLoginToken(Constant.GitHub.CLIENT_ID, Constant.GitHub.CLIENT_SEVCREST, code, Constant.GitHub.REDIRECT_URI)
                        .compose(this.<ResponseBody>bindToLifecycle())
                        .map(new Func1<ResponseBody, String>() {
                            @Override
                            public String call(ResponseBody responseBody) {
                                Log.i(TAG, responseBody.toString());
                                String token = null;
                                try {
                                    token = responseBody.string().split("&")[0].split("=")[1];
                                    Log.i(TAG, token);
                                } catch (IOException e) {
                                    e.printStackTrace();
                                    return null;
                                }
                                return token;
                            }
                        })
                        .filter(new Func1<String, Boolean>() {
                            @Override
                            public Boolean call(String s) {
                                return !TextUtils.isEmpty(s);
                            }
                        })
                        .flatMap(new Func1<String, Observable<GitHubUserInfo>>() {
                            @Override
                            public Observable<GitHubUserInfo> call(String s) {

                                return RetrofitHelper.getGitHubToken().getGithubLoginUserInfo(s);
                            }
                        })
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(new Action1<GitHubUserInfo>() {
                            @Override
                            public void call(GitHubUserInfo gitHubUserInfo) {
                                Toast.makeText(GitHubLoginWebActivity.this, "登录成功", Toast.LENGTH_SHORT).show();
                                GitHubLoginWebActivity.this.finish();

                            }
                        }, new Action1<Throwable>() {
                            @Override
                            public void call(Throwable throwable) {
                                Toast.makeText(GitHubLoginWebActivity.this, "失败", Toast.LENGTH_SHORT).show();
                            }
                        });

            }


        } else {
            mWebView.loadUrl(url);
        }

    }


    @Override
    public boolean onLongClick(View view) {
        return false;
    }
}
