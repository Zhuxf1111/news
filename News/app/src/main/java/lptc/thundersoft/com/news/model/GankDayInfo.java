package lptc.thundersoft.com.news.model;

import java.util.List;

/**
 * Created by hcc on 16/7/6 15:38
 * 100332338@qq.com
 */
public class GankDayInfo
{

    public Result results;


    public class Result
    {

        public List<GankInfo> Android;

        public List<GankInfo> iOS;

        public List<GankInfo> 休息视频;

        public List<GankInfo> 拓展资源;

        public List<GankInfo> 瞎推荐;

        public List<GankInfo> 福利;
    }
}
