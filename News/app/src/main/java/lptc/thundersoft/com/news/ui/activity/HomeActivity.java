package lptc.thundersoft.com.news.ui.activity;

import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v4.widget.DrawerLayout;
import android.view.Gravity;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.OnClick;
import lptc.thundersoft.com.news.R;
import lptc.thundersoft.com.news.base.BaseActivity;
import lptc.thundersoft.com.news.config.Constant;
import lptc.thundersoft.com.news.ui.fragment.TestFragment;

public class HomeActivity extends BaseActivity implements View.OnClickListener {

    PopupWindow mPopuWindow;

    @Bind(R.id.bottom_scroll_view)
    View mView;

    @Bind(R.id.bar_textview)
    TextView mBarTextView;

    @Bind(R.id.home_drawerlayout)
    DrawerLayout mDrawerLayout;

    @Bind(R.id.bar_more)
    ImageView mMoreImageView;

    @Bind(R.id.home_scrollview)
    HorizontalScrollView mScrollView;

    @Bind(R.id.info_viewpager)
    ViewPager mViewPager;

    List<Fragment> fragments;

    @Override
    protected int setLayout() {
        return R.layout.layout_activity_home;
    }


    @Override
    protected void init() {
        View view = getLayoutInflater().inflate(R.layout.popuwindow_cardview, null);
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(HomeActivity.this, "111", Toast.LENGTH_SHORT).show();
            }
        });
        mPopuWindow = new PopupWindow(view, FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT);


        mPopuWindow.setFocusable(true);
        mPopuWindow.setBackgroundDrawable(new ColorDrawable());


        for (int j = 0; j < ((LinearLayout) ((LinearLayout) mScrollView.getChildAt(0)).getChildAt(0)).getChildCount(); j++) {
            ((LinearLayout) ((LinearLayout) mScrollView.getChildAt(0)).getChildAt(0)).getChildAt(j).setOnClickListener(this);
        }

        fragments = new ArrayList<Fragment>();

        for (int i = 0; i < 6; i++) {
            Bundle bundle = new Bundle();
            bundle.putInt("TypeIndex",i);
            TestFragment fragment = new TestFragment();
            fragment.setArguments(bundle);
//            fragment.setUserVisibleHint(false);
            fragments.add(fragment);
        }
//        fragments.get(0).setUserVisibleHint(true);

        mViewPager.setAdapter(new FragmentPagerAdapter(getSupportFragmentManager()) {
            @Override
            public Fragment getItem(int position) {
                return fragments.get(position);
            }

            @Override
            public int getCount() {
                return fragments.size();
            }
        });

        mViewPager.setOffscreenPageLimit(6);
        mViewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }

            @Override
            public void onPageSelected(int position) {
                LinearLayout mParentLinearLayout = (LinearLayout) mScrollView.getChildAt(0);
                LinearLayout mLinearLayout = (LinearLayout) mParentLinearLayout.getChildAt(0);
                TextView textView = (TextView) mLinearLayout.getChildAt(position);
                mView.layout((int) textView.getX(), (int) textView.getY(), (int) (textView.getX() + textView.getWidth()), (int) (textView.getY() + textView.getHeight()));
                mScrollView.scrollTo(textView.getLeft(), textView.getTop());
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });
    }

    @OnClick(R.id.view)
    void goToLogin(View view){
        Intent intent = new Intent();
        intent.setClass(this,GitHubLoginWebActivity.class);
        intent.putExtra("url", Constant.GitHub.LOGIN_URL);
        startActivity(intent);
    }


    @OnClick(R.id.bar_imageview)
    void showLeft(View view) {
        mDrawerLayout.openDrawer(Gravity.LEFT);

    }

    @OnClick(R.id.bar_more)
    void showPopuWindow(View view) {
        mPopuWindow.showAsDropDown(view, -150, -80);
    }

    @OnClick(R.id.fab)
    void showQuickMenu(View view) {
        mPopuWindow.showAtLocation(mDrawerLayout, 200, 120, Gravity.CENTER);

    }


    @Override
    public void onClick(View view) {
        switch (((TextView) view).getText().toString()) {
            case "ALL":
                mViewPager.setCurrentItem(0);
                break;
            case "Android":
                mViewPager.setCurrentItem(1);
                break;
            case "IOS":
                mViewPager.setCurrentItem(2);
                break;
            case "APP":
                mViewPager.setCurrentItem(3);
                break;
            case "前端":
                mViewPager.setCurrentItem(4);
                break;
            case "拓展资源":
                mViewPager.setCurrentItem(5);
                break;


        }
    }
}
