package lptc.thundersoft.com.news.network;

import lptc.thundersoft.com.news.model.Gank;
import lptc.thundersoft.com.news.model.GankDayInfo;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import rx.Observable;

/**
 * Created by zxf on 16-8-3.
 */
public interface GankApi {
    @GET("data/{type}/{number}/{page}")
    Call<Gank> getGankDatas(@Path("type") String type, @Path("number") int number, @Path("page") int page);

    @GET("day/{year}/{month}/{day}")
    Observable<GankDayInfo> getGankDayData(@Path("year") int year, @Path("month") int month, @Path("day") int day);

    @GET("search/query/listview/category/{type}/count/{count}/page/{page}")
    Observable<Gank> searchGank(@Path("type") String type, @Path("count") int count, @Path("page") int page);

}
