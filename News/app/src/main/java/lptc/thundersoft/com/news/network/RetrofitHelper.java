package lptc.thundersoft.com.news.network;

import com.facebook.stetho.okhttp3.StethoInterceptor;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.adapter.rxjava.RxJavaCallAdapterFactory;
import retrofit2.converter.gson.GsonConverterFactory;


/**
 * Created by zxf on 16-8-3.
 */
public class RetrofitHelper {

    public static final String BASE_GANK_URL = "http://gank.io/api/";

    public static final String BASE_GITHUB_URL = "https://api.github.com/";

    private static OkHttpClient mClient;

    static {
        initClient();
    }


    /**
     * 获取GitHub登录请求tokenAPI
     */
    public static GitHub getGitHub() {
        Retrofit retrofit = new Retrofit.Builder().baseUrl("https://github.com/login/oauth/").client(mClient)
                .addConverterFactory(GsonConverterFactory.create())
                .addCallAdapterFactory(RxJavaCallAdapterFactory.create())
                .build();

        return retrofit.create(GitHub.class);
    }
    /**
     * 获取GitHub登录请求tokenAPI
     */
    public static GitHub getGitHubToken() {
        Retrofit retrofit = new Retrofit.Builder().baseUrl(BASE_GITHUB_URL).client(mClient)
                .addConverterFactory(GsonConverterFactory.create())
                .addCallAdapterFactory(RxJavaCallAdapterFactory.create())
                .build();

        return retrofit.create(GitHub.class);
    }

    /**
     * 获取GankAPI
     */

    public static GankApi getGankApi() {
        Retrofit retrofit = new Retrofit.Builder().baseUrl(BASE_GANK_URL).client(mClient)
                .addConverterFactory(GsonConverterFactory.create()).build();

        return retrofit.create(GankApi.class);
    }


    private static void initClient() {
        HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
        interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
        if (mClient == null) {
            synchronized (RetrofitHelper.class) {
                if (mClient == null) {
                    //设置Http缓存
                    //         Cache cache = new Cache(new File(AndroidRankApp.getContext().getCacheDir(), "HttpCache"), 1024 * 1024 * 100);

                    mClient = new OkHttpClient.Builder()
                            //.cache(cache)
                            .addInterceptor(interceptor)
                            .addNetworkInterceptor(new StethoInterceptor())
                            .retryOnConnectionFailure(true)
                            .connectTimeout(15, TimeUnit.SECONDS)
                            .build();
                }
            }
        }
    }

}
