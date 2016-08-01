package lptc.thundersoft.com.news.ui.activity;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v4.widget.DrawerLayout;
import android.view.Gravity;
import android.view.View;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.OnClick;
import lptc.thundersoft.com.news.R;
import lptc.thundersoft.com.news.base.BaseActivity;
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

        mPopuWindow = new PopupWindow();
        TextView test =new TextView(this);test.setText("PPPP");
        mPopuWindow.setContentView(test);
        mPopuWindow.setHeight(50);
        mPopuWindow.setWidth(200);
        mPopuWindow.setFocusable(true);
        mPopuWindow.setBackgroundDrawable(new ColorDrawable(Color.WHITE));

        for (int j = 0; j < ((LinearLayout) ((LinearLayout) mScrollView.getChildAt(0)).getChildAt(0)).getChildCount(); j++) {
            ((LinearLayout) ((LinearLayout) mScrollView.getChildAt(0)).getChildAt(0)).getChildAt(j).setOnClickListener(this);
        }


        fragments = new ArrayList<Fragment>();

        for (int i = 0; i < 6; i++) {
            fragments.add(new TestFragment());
        }

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
              /*  Log.i("HomeActivity","left:"+textView.getLeft());
                LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) mView.getLayoutParams();
                if(null==params){
                    params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT,LinearLayout.LayoutParams.WRAP_CONTENT);
                }
                params.leftMargin= textView.getLeft();
                mView.setLayoutParams(params);*/
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });
    }


    @OnClick(R.id.bar_imageview)
    void showLeft(View view) {
        mDrawerLayout.openDrawer(Gravity.LEFT);

    }

    @OnClick(R.id.bar_more)
    void showPopuWindow(View view){
        mPopuWindow.showAsDropDown(view ,-150,-80);
    }

    @OnClick(R.id.fab)
    void showQuickMenu(View view){
        mPopuWindow.showAsDropDown(view ,-150,-80);
    }


    @Override
    public void onClick(View view) {
        switch (((TextView) view).getText().toString()) {
            case "A":
                mViewPager.setCurrentItem(0);
                break;
            case "B":
                mViewPager.setCurrentItem(1);
                break;
            case "C":
                mViewPager.setCurrentItem(2);
                break;
            case "D":
                mViewPager.setCurrentItem(3);
                break;
            case "E":
                mViewPager.setCurrentItem(4);
                break;
            case "F":
                mViewPager.setCurrentItem(5);
                break;


        }
    }
}
