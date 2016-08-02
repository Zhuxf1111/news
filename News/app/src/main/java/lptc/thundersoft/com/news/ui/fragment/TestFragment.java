package lptc.thundersoft.com.news.ui.fragment;

import android.graphics.Color;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import lptc.thundersoft.com.news.R;
import lptc.thundersoft.com.news.base.BaseFragment;

/**
 * Created by zxf on 16-8-1.
 */
public class TestFragment extends BaseFragment {
    @Bind(R.id.fragment_swiperefresh)
    SwipeRefreshLayout mSRLayout;

    @Bind(R.id.fragment_recyclerview)
    RecyclerView mRecyclerView;

    List<String> strs;

    @Override
    protected void initView() {

        strs = new ArrayList<String>();

        for (int i = 0; i < 20; i++) {
            strs.add("item" + i);
        }

        mRecyclerView.setAdapter(new MyAdapter());

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
        mSRLayout.setColorSchemeColors( Color.BLUE);

        mSRLayout.postDelayed(new Runnable() {
            @Override
            public void run() {
                mSRLayout.setRefreshing(true);
//                try {
//                    Thread.sleep(10000);
//                } catch (InterruptedException e) {
//                    e.printStackTrace();
//                }finally {
//                    mSRLayout.setRefreshing(false);
//                }
                mSRLayout.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        mSRLayout.setRefreshing(false);
                    }
                },5000);

            }
        },500);
        mSRLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                mSRLayout.setRefreshing(true);
                Log.i("xixixixxi","嘿嘿嘿");
            }
        });

    }


    @Override
    protected int setLayout() {
        return R.layout.fragment_list_layout;
    }


    class MyAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

        @Override
        public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            MyViewHolder holder = new MyViewHolder(new TextView(parent.getContext()));


            return holder;
        }

        @Override
        public void onBindViewHolder(RecyclerView.ViewHolder holder, int position) {
            ((MyViewHolder) holder).mTextView.setText(strs.get(position));
        }

        @Override
        public int getItemCount() {
            return strs.size();
        }


        class MyViewHolder extends RecyclerView.ViewHolder {
            TextView mTextView;

            public MyViewHolder(View itemView) {
                super(itemView);
                mTextView = (TextView) itemView;
            }
        }
    }
}
