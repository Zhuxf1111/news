package lptc.thundersoft.com.news.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 常用时间工具类
 */
public class DateUtils {
    public static final String GankDateFormate = "yyyy-MM-ddThh:mm:ss";


    public static String changeDateFormate(String srcString) {
        String str = srcString.split(".")[0];
        long timeMillion;
        try {
            Date srcDate = SimpleDateFormat.getDateInstance().parse(GankDateFormate);
            timeMillion = srcDate.getTime();
            long timeCur = System.currentTimeMillis();
            long index = timeCur - timeMillion;
            long target = timeCur % (24 * 60 * 60 * 1000);

            //同一天
            if (index <= target) {
                long hour = index / (60 * 60 * 1000);
                return hour + "小时前";
            }
            //昨天
            else if (index <= (24 * 60 * 60 * 1000 + target)) {
                return "昨天";
            }
            //前天
            else if (index <= (48 * 60 * 60 * 1000 + target)) {
                return "前天";
            }
            //显示日期
            else {
                return str.split("T")[0].replaceAll("-", "\\\n");
            }


        } catch (ParseException e) {
            e.printStackTrace();
            return "parse error";
        }
    }

}
