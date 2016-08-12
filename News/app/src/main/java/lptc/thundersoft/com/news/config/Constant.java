package lptc.thundersoft.com.news.config;

/**
 * Created by zxf on 16-7-29.
 */

/**
 * 常量存储
 */
public class Constant {

    public static class GitHub {
        public static final String CLIENT_ID = "3f0b872a51a4b0c45065";

        public static final String CLIENT_SEVCREST = "e888c5cdce46cc192bd505e603c8b57b8bf3987d";

        public static final String STATE = "News";

        public static final String REDIRECT_URI = "http://example.com/path";

        public static final String LOGIN_URL = "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID + "&state=" + STATE + "&redirect_uri=" + REDIRECT_URI;

    }


}
