package lptc.thundersoft.com.news.adapter;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.util.ArrayList;
import java.util.List;

import lptc.thundersoft.com.news.model.GankInfo;

/**
 * Created by zxf on 16-9-6.
 */
public class DBHelper extends SQLiteOpenHelper {
    private static final String TAG = "DBHelper";

    private final static String NAME = "GankInfo.db";

    private final static int VERSION = 1;

    private static DBHelper helper;

    public static DBHelper getInstance(Context convar){
        if(null == helper){
            helper = new DBHelper(convar);
        }
        return helper;
    }

    private DBHelper(Context convar) {
        super(convar, NAME, null, VERSION);
    }


    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {
        String sql = "create table GankInfo (  _id TEXT,   createdAt TEXT,   desc TEXT,   publishedAt TEXT,  source TEXT,  type TEXT,  url TEXT,  who TEXT,  used TEXT)";
        sqLiteDatabase.execSQL(sql);
    }

    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {

    }

    public List<GankInfo> queryByType(String typeName, int pageCount, int pageNum) {
        List<GankInfo> lists = new ArrayList<GankInfo>();
        SQLiteDatabase db = this.getReadableDatabase();
        String sql = "select * from GankInfo where type = ?  limit ? , ? ";
//        Log.i("zxf","type:"+typeName);
//        String sql = "select * from GankInfo where type = ? ";
        String[] columnValue = new String[]{typeName, ((pageNum - 1) * pageCount) + "", pageCount + ""};
        if(typeName.equals("all")){
            sql = "select * from GankInfo limit ?, ?";
            columnValue = new String[]{ ((pageNum - 1) * pageCount) + "", pageCount + ""};
        }
        Cursor mCursor = db.rawQuery(sql, columnValue);
//        Cursor mCursor = db.rawQuery(sql, new String[]{typeName});
        while (mCursor.moveToNext()) {
            GankInfo info = new GankInfo();
            info._id = mCursor.getString(mCursor.getColumnIndex("_id"));
            info.createdAt = mCursor.getString(mCursor.getColumnIndex("createdAt"));
            info.desc = mCursor.getString(mCursor.getColumnIndex("desc"));
            info.publishedAt = mCursor.getString(mCursor.getColumnIndex("publishedAt"));
            info.source = mCursor.getString(mCursor.getColumnIndex("source"));
            info.type = mCursor.getString(mCursor.getColumnIndex("type"));
            info.url = mCursor.getString(mCursor.getColumnIndex("url"));
            info.who = mCursor.getString(mCursor.getColumnIndex("who"));
            info.used = Boolean.parseBoolean(mCursor.getString(mCursor.getColumnIndex("used")));
            lists.add(info);
        }
        mCursor.close();
        return lists;
    }

    public void toSaveGankInfos(List<GankInfo> infos) {
        SQLiteDatabase db = this.getWritableDatabase();
        for (GankInfo info : infos) {
            ContentValues value = new ContentValues();
            value.put("_id", info._id);
            value.put("createdAt", info.createdAt);
            value.put("desc", info.desc);
            value.put("publishedAt", info.publishedAt);
            value.put("source", info.source);
            value.put("type", info.type);
            value.put("url", info.url);
            value.put("who", info.who);
            value.put("used", info.used);
            db.insert("GankInfo", null, value);
        }
    }
}
