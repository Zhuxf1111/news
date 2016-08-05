package lptc.thundersoft.com.news.ui.fragment;

import android.content.Intent;
import android.graphics.Color;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import lptc.thundersoft.com.news.R;
import lptc.thundersoft.com.news.base.BaseFragment;
import lptc.thundersoft.com.news.model.Gank;
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
    @Bind(R.id.fragment_swiperefresh)
    SwipeRefreshLayout mSRLayout;

    @Bind(R.id.fragment_recyclerview)
    RecyclerView mRecyclerView;

    List<Gank.GankInfo> gankInfos;


    MyAdapter adapter;

    @Override
    protected void initView() {


//        mLayoutManager = new LinearLayoutManager(this);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
//如果可以确定每个item的高度是固定的，设置这个选项可以提高性能
        mRecyclerView.setHasFixedSize(true);


//        mRecyclerView.addOnScrollListener(new RecyclerView.OnScrollListener(){
//            @Override
//            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
//                super.onScrollStateChanged(recyclerView, newState);
//
//            }
//
//            @Override
//            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
//                super.onScrolled(recyclerView, dx, dy);
//            }
//        });
        mSRLayout.setColorSchemeColors(Color.BLUE);


        mSRLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                getData();

            }
        });

        Log.i("zxf", "getdata");


        mSRLayout.postDelayed(new Runnable() {
            @Override
            public void run() {
                mSRLayout.setRefreshing(true);
                getData();
            }
        }, 1000);


    }

    @Override
    public void onResume() {
        super.onResume();
        getData();
    }

    public void getData() {
        RetrofitHelper.getGankApi().getGankDatas("Android", 10, 1)
                .enqueue(new Callback<Gank>() {
                    @Override
                    public void onResponse(Call<Gank> call, Response<Gank> response) {
                        Log.i("zxf", response.toString());
                        Gank gank = response.body();
                        if (gankInfos == null) {
                            gankInfos = new ArrayList<Gank.GankInfo>();
                        } else {
                            gankInfos.clear();
                        }
                        for (Gank.GankInfo infos : gank.results) {
                            gankInfos.add(infos);
                        }
                        if (adapter == null) {
                            adapter = new MyAdapter();
                            mRecyclerView.setAdapter(adapter);
                        }

                        adapter.notifyDataSetChanged();
                        mSRLayout.setRefreshing(false);
                        Log.i("zxf", "sssssssssssssssssssssssssssssssssssssssssss");

                    }

                    @Override
                    public void onFailure(Call<Gank> call, Throwable t) {
                        Log.i("zxf", "Failure---------------");

                    }
                });








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

    }


    @Override
    protected int setLayout() {
        return R.layout.fragment_list_layout;
    }





    class MyAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {


        @Override
        public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            Log.i("zxf", "onCreateViewHolder");

            MyViewHolder holder = new MyViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.test_layout, parent, false));

            return holder;
        }

        @Override
        public void onBindViewHolder(RecyclerView.ViewHolder holder, int position) {
            Log.i("zxf", "onBindViewHolder");
            if (getItemCount() == 0)
                return;
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

        @Override
        public int getItemCount() {
            Log.i("zxf", "getItemCount");
            return gankInfos.size();
        }


        class MyViewHolder extends RecyclerView.ViewHolder {
            TextView mTextView;
            TextView mTimeTextView;
            TextView mWhoTextView;


            public MyViewHolder(View itemView) {
                super(itemView);
                mTimeTextView = (TextView) itemView.findViewById(R.id.time_text);
                mTextView = (TextView) itemView.findViewById(R.id.test_text);
                mWhoTextView = (TextView) itemView.findViewById(R.id.who_text);
            }
        }
    }
}
