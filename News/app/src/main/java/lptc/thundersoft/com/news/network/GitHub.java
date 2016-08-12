package lptc.thundersoft.com.news.network;

import lptc.thundersoft.com.news.model.GitHubUserInfo;
import okhttp3.ResponseBody;
import retrofit2.http.GET;
import retrofit2.http.Query;
import rx.Observable;

/**
 * Created by zxf on 16-8-8.
 */
public interface GitHub {


    /**
     * 三方登录授权获取Token
     *
     * @param id
     * @param secret
     * @param code
     * @param uri
     * @return
     */
    @GET("access_token")
    Observable<ResponseBody> getLoginToken(@Query("client_id") String id,
                                           @Query("client_secret") String secret,
                                           @Query("code") String code,
                                           @Query("redirect_uri") String uri);


    /**
     * 根据Token获取用户登录信息
     *
     * @param token
     * @return
     */
    @GET("user")
    Observable<GitHubUserInfo> getGithubLoginUserInfo(@Query("access_token") String token);
}
