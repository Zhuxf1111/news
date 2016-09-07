package lptc.thundersoft.com.news.ui.fragment;

import android.annotation.TargetApi;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import lptc.thundersoft.com.news.R;
import lptc.thundersoft.com.news.adapter.DBHelper;
import lptc.thundersoft.com.news.base.BaseFragment;
import lptc.thundersoft.com.news.model.Gank;
import lptc.thundersoft.com.news.model.GankInfo;
import lptc.thundersoft.com.news.network.RetrofitHelper;
import lptc.thundersoft.com.news.ui.activity.GankInfoActivity;
import lptc.thundersoft.com.news.utils.DateUtils;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by zxf on 16-8-1.
 */
public class TestFragment extends BaseFragment {


    private static final String TAG = "TestFragment";

    private static final int PAGE_NUM = 10;

    private int mPage = 1;

    private String[] types = new String[]{"all", "Android", "iOS", "App", "前端", "拓展资源"};

    private String mTypeName;

    @Bind(R.id.fragment_swiperefresh)
    SwipeRefreshLayout mSRLayout;

    @Bind(R.id.fragment_recyclerview)
    RecyclerView mRecyclerView;

    List<GankInfo> gankInfos;

    RecyclerView.LayoutManager mManager;


    MyAdapter adapter;

    private boolean isVisibility = false;


    @TargetApi(Build.VERSION_CODES.M)
    @Override
    protected void initView() {


        Log.i("zxf", "initView--------------");

        int index = getArguments().getInt("TypeIndex", -1);

        if (-1 != index) {
            mTypeName = types[index];
        }

        mManager = new LinearLayoutManager(getContext());


        mRecyclerView.setLayoutManager(mManager);
        mRecyclerView.setHasFixedSize(true);
        mSRLayout.setColorSchemeColors(Color.BLUE);

        mSRLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                mPage = 1;
                getData(false);

            }
        });


        if (isVisibility) {
            mSRLayout.setRefreshing(true);
            mSRLayout.postDelayed(new Runnable() {
                @Override
                public void run() {
                    getData(false);
                }
            }, 1000);
        }

        mRecyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
            }

            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);
//                lastItemCount = mManager.
                int visible = mManager.getChildCount();
                int total = mManager.getItemCount();
                int first = ((LinearLayoutManager) mManager).findFirstCompletelyVisibleItemPosition();
                if (visible + first == total) {
                    mPage++;
                    getData(true);
                }


            }
        });


    }

    @Override
    public void onResume() {
        super.onResume();
        //getData();
    }

    /**
     * @param flag true: more data  false:refresh
     */
    public void getData(final boolean flag) {
        RetrofitHelper.getGankApi().getGankDatas(mTypeName, PAGE_NUM, mPage)
                .enqueue(new Callback<Gank>() {
                    @Override
                    public void onResponse(Call<Gank> call, Response<Gank> response) {
                        Log.i("zxf", response.toString());
                        final Gank gank = response.body();
                        if (gankInfos == null) {
                            gankInfos = new ArrayList<GankInfo>();
                        } else {
                            if (!flag)
                                gankInfos.clear();
                        }
                        for (GankInfo infos : gank.results) {
                            gankInfos.add(infos);
                        }
                        if (adapter == null) {
                            adapter = new MyAdapter();
                            mRecyclerView.setAdapter(adapter);
                        }

                        adapter.notifyDataSetChanged();
                        mSRLayout.setRefreshing(false);

                        new Thread() {
                            @Override
                            public void run() {
                                DBHelper.getInstance(TestFragment.this.getContext()).toSaveGankInfos(gank.results);
                            }
                        }.run();


                    }

                    @Override
                    public void onFailure(Call<Gank> call, Throwable t) {
                        gankInfos = DBHelper.getInstance(TestFragment.this.getContext()).queryByType(mTypeName, PAGE_NUM, mPage);
                        if (gankInfos != null && gankInfos.size()>0) {
                            if (adapter == null) {
                                adapter = new MyAdapter();
                                mRecyclerView.setAdapter(adapter);
                                adapter.notifyDataSetChanged();
                            }
                        } else {
                            Toast.makeText(TestFragment.this.getContext(), "Failure", Toast.LENGTH_SHORT).show();
                        }
                    }
                });

    }









                /*.compose(this.<Gank>bindToLifecycle())
                .filter(new Func1<Gank, Boolean>() {
                    @Override
                    public Boolean call(Gank gank) {
                        Log.i(TAG,"call()-------------11111111111111111");
                        return gank.error;
                    }
                }) .map(new Func1<Gank,List<Gank.GankInfo>>()
        {

            @Override
            public List<Gank.GankInfo> call(Gank gank)
            {
                Log.i(TAG,"call()-------------2222222222222222222");
                return gank.results;
            }
        })
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retry()
                .subscribe(new Action1<List<Gank.GankInfo>>()
                {

                    @Override
                    public void call(List<Gank.GankInfo> gankInfos)
                    {

                        Log.i(TAG,"call()-------------333333333333333333333333");
                        gankInfos.clear();
                        for (Gank.GankInfo gank : gankInfos){
                            gankInfos.add(gank.desc);
                        }
                        adapter.notifyDataSetChanged();
                        mSRLayout.setRefreshing(false);*/


    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        Log.i("zxf", "-----" + types[getArguments().getInt("TypeIndex")] + "------------isVisibleToUser:" + isVisibleToUser);
        super.setUserVisibleHint(isVisibleToUser);
        if (null != adapter && adapter.getItemCount() > 0) {
            return;
        }
        isVisibility = isVisibleToUser;
        if (null != mSRLayout && isVisibleToUser) {
            mSRLayout.setRefreshing(true);
            mSRLayout.postDelayed(new Runnable() {
                @Override
                public void run() {
                    getData(false);
                }
            }, 2000);
        }
    }

    @Override
    protected int setLayout() {
        return R.layout.fragment_list_layout;
    }


    class MyAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {


        @Override
        public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

            MyViewHolder holder = new MyViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.test_layout, parent, false));

            return holder;
        }

        @Override
        public void onBindViewHolder(RecyclerView.ViewHolder holder, int position) {
            if (gankInfos.get(position).type.equals("福利")) {
                ((MyViewHolder) holder).mImageView.setVisibility(View.VISIBLE);
                ((MyViewHolder) holder).mTextView.setVisibility(View.GONE);
                ((MyViewHolder) holder).mTimeTextView.setVisibility(View.GONE);
                ((MyViewHolder) holder).mTextView.setVisibility(View.GONE);
                ((MyViewHolder) holder).mWhoTextView.setVisibility(View.GONE);
                Glide.with(TestFragment.this.getActivity())
                        .load(gankInfos.get(position).url)
                        .placeholder(R.mipmap.ic_launcher)
                        .centerCrop()
                        .error(R.mipmap.ic_launcher)
                        .into(((MyViewHolder) holder).mImageView);
            } else {
                ((MyViewHolder) holder).mImageView.setVisibility(View.GONE);
                ((MyViewHolder) holder).mTextView.setVisibility(View.VISIBLE);
                ((MyViewHolder) holder).mTimeTextView.setVisibility(View.VISIBLE);
                ((MyViewHolder) holder).mTextView.setVisibility(View.VISIBLE);
                ((MyViewHolder) holder).mWhoTextView.setVisibility(View.VISIBLE);
                ((MyViewHolder) holder).mTextView.setText(gankInfos.get(position).desc);
                ((MyViewHolder) holder).mTimeTextView.setText(DateUtils.changeDateFormate(gankInfos.get(position).publishedAt));
                ((MyViewHolder) holder).mTextView.setTag(gankInfos.get(position).url);
                ((MyViewHolder) holder).mWhoTextView.setText(gankInfos.get(position).who);
                ((MyViewHolder) holder).mTextView.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        Intent intent = new Intent(TestFragment.this.getContext(), GankInfoActivity.class);
                        intent.putExtra("url", view.getTag().toString());
                        startActivity(intent);
                    }
                });
            }

        }

        @Override
        public int getItemCount() {
            return gankInfos.size();
        }


        class MyViewHolder extends RecyclerView.ViewHolder {
            TextView mTextView;
            TextView mTimeTextView;
            TextView mWhoTextView;
            ImageView mImageView;


            public MyViewHolder(View itemView) {
                super(itemView);
                mTimeTextView = (TextView) itemView.findViewById(R.id.time_text);
                mTextView = (TextView) itemView.findViewById(R.id.test_text);
                mWhoTextView = (TextView) itemView.findViewById(R.id.who_text);
                mImageView = (ImageView) itemView.findViewById(R.id.imageview);
            }
        }
    }
}
