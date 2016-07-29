    /** Toolbar height @const */
    var TOOLBAR_HEIGHT = 48;
    /** Reply height @const */
    var REPLY_HEIGHT = 50;
    /** Line height percent (170%) @const */
    var LINE_HEIGHT_PERCENT = 1.7;
    /** Wiki arrow width @const */
    var WIKI_ARROW_WIDTH = 22;
    /** Wiki arrow height @const */
    var WIKI_ARROW_HEIGHT = 18;
    /** Wiki source height @const */
    var WIKI_SOURCE_HEIGHT = 40;
    /** Wiki none source height @const */
    var WIKI_NONE_SOURCE_HEIGHT = 28;

    var title;
    var ptime;
    var body;
    var source;
    var more;
    var moreButton;
    var myBody;
    var myTitle;
    var textSize;

    var lastRequestLoadImgStart = -1;
    var lastRequestLoadImgEnd = -1;

    var imgContents;
    var imgContentCount = 0;

    var adCount = 0;
    var adShowIndex = 0;
    var hasBottomAd = false;

    window.onscroll = function() {
        requestImgLoading(false);
        doAdShowAction();
    }

    window.onload = function() {
        // TODO js bridge
    }

    /** 初始化选择器 防止自带的touch事件导致背景颜色变化*/
    function initSelector() {
        var nodes = document.querySelectorAll(".active");
        var len = nodes.length;
        for (i = 0; i < len; i++) {
            var node = nodes[i];
            var chgDefaultColor = function(e) {
                if (e.target) {
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0)";
                }
            }
            node.addEventListener("touchstart", chgDefaultColor);
            node.addEventListener("touchmove", chgDefaultColor);
            node.addEventListener("touchend", chgDefaultColor);
        }
    }

    /** *************************通用功能-BEGIN*********************** */
    /** 切换日夜间 */
    function changeWebTheme(isNight) {
        var body = document.getElementsByTagName("body")[0];
        if (body) {
            if (isNight) {
                body.className = "night";
            } else {
                body.className = "";
            }
        }
    }

    function showSuperBigSize() {
        myBody.style.fontSize = "26px";
        myBody.style.lineHeight = "160%";
    }

    function showBigSize() {
        myBody.style.fontSize = "22px";
        myBody.style.lineHeight = "160%";
    }

    function showMidSize() {
        myBody.style.fontSize = "18px";
        myBody.style.lineHeight = "150%";
    }

    function showSmallSize() {
        myBody.style.fontSize = "16px";
        myBody.style.lineHeight = "150%";
    }

    /** 跳转链接 */
    function linkToWeb(url) {
        if (window.news) {
            if (url) {
                window.news.goWeb(url);
            }
        }
    }

    /** 广告曝光 */
    function doAdShowAction() {
        if (!window.news) {
            return;
        }
        if (adCount <= 0) {
            // 正文页无广告
            return;
        }
        if (adShowIndex == adCount) {
            // 所有广告均已曝光过
            return;
        }

        var adItem;
        if (hasBottomAd) {
            if (adShowIndex == 0) {
                // 正文底部广告
                adItem = document.getElementById('ad_div');
            } else {
                // 相关新闻广告
                adItem = document.getElementById("relative_ad_" + (adShowIndex - 1));
            }
        } else {
            // 相关新闻广告
            adItem = document.getElementById("relative_ad_" + adShowIndex);
        }

        if (!adItem) {
            return;
        }

        var screenHeight = 3 * window.screen.height;
        var screenHeight = screenHeight / window.devicePixelRatio;
        var elemTop = adItem.getBoundingClientRect().top;
        //        var elemBottom = adItem.getBoundingClientRect().bottom;
        var isVisible = elemTop < screenHeight;
        if (isVisible) {
            window.news.doAdSeenAction(adShowIndex);

            // 广告曝光后，曝光位置偏移后移
            adShowIndex = adShowIndex + 1;
        }
    }

    /** 停止事件派发 */
    function stopEventBubble(e) {
        var evt = e || window.event;
        // IE用cancelBubble=true来阻止而FF下需要用stopPropagation方法
        evt.stopPropagation ? evt.stopPropagation() : (evt.cancelBubble = true);
    }

    /** 更新图片数量 NewsPageJS.onProgressChanged(newProgress=100)调用 */
    function updateImgCount(count) {
        if (!count || count <= 0) {
            return;
        }
        imgContentCount = count;
    }

    /** 加载图片 NewsPageJS.onProgressChanged(newProgress=100)调用*/
    function requestImgLoading(force) {
        if (!window.news) {
            return;
        }
        if (imgContentCount == 0) {
            return;
        }

        if (!imgContents) {
            imgContents = new Array();
        }

        var screenHeight = 3 * window.screen.height;
        var screenHeight = screenHeight / window.devicePixelRatio;

        var start = -1;
        var end = -1;

        for (var i = 0; i < imgContentCount; i++) {
            if (!imgContents[i]) {
                imgContents[i] = document.getElementById("imgContent_" + i);
            }
            if (!imgContents[i]) {
                break;
            }
            var r = imgContents[i].getBoundingClientRect();

            if (r.bottom > 0 && r.top < screenHeight) {
                start = i;

                if (r.bottom >= screenHeight) {
                    end = i;
                }
                break;
            }
        }
        if (start >= 0 && end == -1) {
            for (var i = start; i < imgContentCount; i++) {
                if (!imgContents[i]) {
                    imgContents[i] = document.getElementById("imgContent_" + i);
                }
                if (!imgContents[i]) {
                    break;
                }
                end = i;
                var r = imgContents[i].getBoundingClientRect();
                if (r.bottom >= screenHeight) {
                    break;
                }
            }
        }

        if (start >= 0 && end == -1) {
            end = start;
        }

        if (force || lastRequestLoadImgStart != start || lastRequestLoadImgEnd != end) {
            lastRequestLoadImgStart = start;
            lastRequestLoadImgEnd = end;
            if (start != -1 && end != -1) {
                var allLoaded = true;
                for (var i = start; i <= end; i++) {
                    allLoaded = true == imgContents[i].loaded;
                    if (!allLoaded) {
                        break;
                    }
                }

                if (!allLoaded) {
                    window.news.requestImgLoading(start, end);
                }
            }
        }
    }

    /** 查看大图 */
    function zoomOut(i) {
        if (window.news) {
            var largepic = document.getElementById('largepic' + i);
            var imgcontent = document.getElementById("imgContent_" + i);
            var percent = document.getElementById("percent_" + i);

            if (percent != null &&
                (percent.src == 'file:///android_asset/big_reload_img.png' ||
                    percent.src == 'file:///android_asset/small_reload_img.png')) {

                if (null != imgcontent) {
                    imgcontent.src = 'file:///android_asset/null_src.png';
                }
                window.news.reloadImg(i);
                return;
            }
            //if(imgcontent.src.indexOf('android_asset') == -1) { // 已经加载完图片
            if (percent == null || percent.style.visibility == 'hidden') { // 已经加载完图片
                if (largepic.style.display == 'none') {

                } else {
                    // 播放视频的逻辑也在这里面
                    window.news.showBigPic(i);
                }
            }
        }
    }

    /** 设置特殊类型图片参数 */
    function setAddImgShowAndImgContentSimple(i, imgUrl) {
        var imgcontent = document.getElementById("imgContent_" + i);
        if (imgcontent) {
            imgcontent.loaded = true;
            imgcontent.src = imgUrl;
        }
    }

    /** 设置普通类型图片参数 */
    function setAddImgShowAndImgContent(i, imgUrl, width, height, finalWidth, finalHeight, offsetX, isFixedParam) {
        var imgadd = document.getElementById("imgAdd_" + i);
        var imgcontent = document.getElementById("imgContent_" + i);
        var imgVideo = document.getElementById("videoImg_" + i);

        if (null != imgadd) {
            imgadd.style.display = 'block';
        }

        if (null != imgcontent) {
            if (isFixedParam == 1) {
                var rectRight = parseInt(offsetX) + parseInt(finalWidth);
                imgcontent.style.left = "-" + offsetX + "px";
                imgcontent.style.clip = "rect(auto, " + rectRight + "px, " + finalHeight + "px, " + offsetX + "px)";
                imgcontent.style.width = width + "px";
                imgcontent.style.height = height + "px";
            }

            if (imgUrl != "big_reload_img.png" && imgUrl != "small_reload_img.png") {
                imgcontent.loaded = true;
                imgcontent.src = imgUrl;
            }
        }

        if (imgUrl != "big_reload_img.png" && imgUrl != "small_reload_img.png") {
            if (imgVideo) {
                imgVideo.style.visibility = "visible";
            }
            var pp = document.getElementById("percent_" + i);
            if (pp) {
                pp.style.visibility = "hidden";
            }
        } else {
            document.getElementById("percent_" + i).src = "file:///android_asset/" + imgUrl;
            var pp = document.getElementById("percent_" + i);
            if (pp) {
                pp.src = "file:///android_asset/" + imgUrl;
            }
        }
    }

    /** 设置图片加载进度 */
    function updateProgress(i, percent, isBigImg, isTablet, isNoProgress) {
        if (percent == 0) {
            var imgVideo = document.getElementById("videoImg_" + i);
            if (imgVideo != null) {
                imgVideo.style.visibility = "hidden";
            }
        }

        var percent_i = document.getElementById("percent_" + i);
        if (!percent_i) {
            return;
        }

        var state = Math.floor(percent / 10);
        if (state > 9) {
            state = 9; //不显示100%
        } else if (state < 0) {
            state = 0;
        }

        var url;
        if (isBigImg) {
            url = isNoProgress ? "file:///android_asset/img/no_loading.png" : "file:///android_asset/img/loading" + state + ".png";
        } else {
            url = isNoProgress ? "file:///android_asset/img/small_no_loading.png" : "file:///android_asset/img/small_loading" + state + ".png";
        }
        if (percent_i.src != url) {
            percent_i.src = url;
        }
    }
    /** *************************通用功能-END*********************** */

    /** 动态加载css文件 */
    function loadCssFile(filename) {
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);

        if (typeof fileref != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }

    /** ***********************正文模块START************************ */
    /** 加载正文内容 */
    function getBody() {
        myBody = document.getElementById('article_body');
        if (window.news) {
            myBody.innerHTML = window.news.getBody();
            // dom后续处理
            domPostHandle();
            // dom加载完成，执行img更新 & vote更新，未来可能有更多操作
            window.news.domCreateFinished();
        }
    }

    function domPostHandle() {
        // 初始化字体
        getTextSize();
        // 更改默认选择器样式
        initSelector();
    }

    /** 切换字体大小 */
    function getTextSize() {
        if (window.news) {
            textSize = window.news.getTextSize();

            switch (textSize) {
                case 0:
                    showSuperBigSize();
                    break;
                case 1:
                    showBigSize();
                    break;
                case 2:
                    showMidSize();
                    break;
                case 3:
                    showSmallSize();
                    break;
            }
        }
    }

    /** 初始化选择器 防止自带的touch事件导致背景颜色变化*/
    function initSelector() {
        var nodes = document.querySelectorAll(".active");
        var len = nodes.length;
        for (i = 0; i < len; i++) {
            var node = nodes[i];
            var chgDefaultColor = function(e) {
                if (e.target) {
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0)";
                }
            }
            node.addEventListener("touchstart", chgDefaultColor);
            node.addEventListener("touchmove", chgDefaultColor);
            node.addEventListener("touchend", chgDefaultColor);
        }
    }

    /** 加载正文超链接 */
    function toLink(i) {
        if (window.news) {
            window.news.toLink(i);
        }
    }

    /** 正文来源进订阅源主页 */
    function gotoSubscriptionSrc(tid) {
        if (window.news) {
            if (tid) {
                window.news.gotoSubscriptionSrc(tid);
            }
        }
    }

    /** 正文相关新闻话题入口 */
    function gotoSubjectDetail(subjectId) {
        if (window.news) {
            if (subjectId) {
                window.news.gotoSubjectDetail(subjectId);
            }
        }
    }

    /** 正文下载app */
    function downloadapp(i) {
        if (window.news) {
            window.news.downloadapp(i);
        }
    }

    /** 正文打赏小编 */
    function reward(i) {
        if (window.news) {
            window.news.reward(i);
        }
    }

    /** 正文去直播*/
    function goTolive(i) {
        if (window.news) {
            window.news.goToLive(i);
        }
    }

    /** 更新正文直播比分信息 */
    function updateLiveInfo(titleStr, descStr, iconUrl, i) {
        var icon = document.getElementById("live_icon_" + i);
        var title = document.getElementById("live_title_" + i);
        var desc = document.getElementById("live_desc_" + i);

        title.innerHTML = titleStr;
        desc.innerHTML = descStr;
        if (iconUrl) {
            icon.src = iconUrl;
        }
    }

     /** 更新奥运奖牌榜信息 */
    function updateOlympicMedalInfo(rankStr, goldNum, silverNum, bronzeNum){
         var rank = document.getElementsByClassName("olympic_medal_section_rank");
         var gold = document.getElementsByClassName("olympic_medal_section_medal_gold");
         var silver = document.getElementsByClassName("olympic_medal_section_medal_silver");
         var bronze = document.getElementsByClassName("olympic_medal_section_medal_bronze");

         rank[0].innerHTML = rankStr;
         gold[0].innerHTML = goldNum;
         silver[0].innerHTML = silverNum;
         bronze[0].innerHTML = bronzeNum;
    }

    /** 正文去BOBO */
    function goToBOBO(i) {
        if (window.news) {
            window.news.goToBOBO(i);
        }
    }

    /** 正文去花田 */
    function goToLove(url) {
        if (window.news) {
            window.news.goToLove(url);
        }
    }

    /** 正文去查看原文指向链接 */
    function goNewsSource() {
        if (window.news) {
            window.news.goNewsSource();
        }
    }

    /** 正文去商店 */
    function goToStore(storeId) {
        if (window.news) {
            window.news.goToStore(storeId);
        }
    }

    /** 正文展示相配的商店 */
    function showSuitableStore(docId) {
        if (window.news) {
            window.news.showSuitableStore(docId);
        }
    }

    /** 正文商品购买*/
    function purchase(docId, type) {
        if (window.news) {
            window.news.purchase(docId, type);
        }
    }

    /** 正文更新特权信息 */
    function disableGoods(text, msgId) {
        var goodsDiv = document.getElementById('goods_section_' + msgId);
        goodsDiv.className = 'goods_disable';
        var buySpan = document.getElementById('goods_buy_text_' + msgId);
        buySpan.innerText = text;
    }

    /** 正文app下载 */
    function toappLink(appid, i) {
        if (window.news) {
            window.news.toappLink(i, appid);
        }
    }

    /** FIXME 正文查看app更多评论 */
    function toAppLink(softid, appid) {
        softid = softid + "";
        appid = appid + "";
        if (window.news) {
            window.news.gotoNetApp(softid, appid);
        }
    }

    /** 正文去 相关推荐/订阅源推荐 */
    function toTopic(i) {
        if (window.news) {
            window.news.toTopic(i);
        }
    }

    /** 正文对订阅源做订阅操作 */
    function dosubscribe(e, i) {
        if (window.news) {
            window.news.subscribeTopic(i);
            /*var textcontent = document.getElementById("subscribe_text_" + i);
            if(null != textcontent){
                textcontent.className="topic_pressed";
            }*/
        }
        stopEventBubble(e);
    }

    /** 正文修改订阅图标 */
    function setSubscribedTopicImg(i) {
        var textcontent = document.getElementById("subscribe_text_" + i);
        if (null != textcontent) textcontent.style.display = "none";

        var imgcontent = document.getElementById("subscribe_img_" + i);
        if (null != imgcontent) imgcontent.style.display = "block";
    }

    /** 正文经销商模块拨打电话 */
    function openDial(phoneNum) {
        if (window.news) {
            window.news.openDial(phoneNum.toString());
        }
    }
    /** ***********************正文模块END************************ */

    /** ***********************段子顶/踩START************************ */
    /** 段子顶/踩操作 */
    function doSegmentSupportTrend(isSupport) {
        if (window.news) {
            var ding = document.getElementById("segments_ding").firstChild;
            var cai = document.getElementById("segments_cai").firstChild;

            if (ding && cai) {
                if (isSupport) {
                    if (ding.getAttribute("selected")) {
                        return;
                    } else {
                        cai.removeAttribute("selected");
                        ding.setAttribute("selected", true);
                    }
                } else {
                    if (cai.getAttribute("selected")) {
                        return;
                    } else {
                        ding.removeAttribute("selected");
                        cai.setAttribute("selected", true);
                    }
                }
                window.news.doSegmentSupportTrend(isSupport);
            }
        }
    }

    /** 更新段子顶/踩人数 */
    function updateSegmentSupportTrend(dingCount, caiCount) {
        if (dingCount) {
            var e = document.getElementById("segments_ding_count");
            if (e) {
                e.innerText = dingCount;
            }
        }

        if (caiCount) {
            var e = document.getElementById("segments_cai_count");
            if (e) {
                e.innerText = caiCount;
            }
        }
    }
    /** ***********************段子顶/踩END************************ */

    /** ***********************文章正文感兴趣/不感兴趣START************************ */
    function doInterestOrNot(hasInterest) {
        if (window.news) {
            var interest = document.getElementById("interest").firstChild;
            var noInterest = document.getElementById("no_interest").firstChild;

            if (interest && noInterest) {
                if (interest.getAttribute("sel") || noInterest.getAttribute("sel") || interest.getAttribute("selected") || noInterest.getAttribute("selected")) {
                    return;
                } else {
                    if (hasInterest) {
                        interest.setAttribute("sel", true);
                    } else {
                        noInterest.setAttribute("sel", true);
                    }

                    if (hasInterest) {
                        if (interest.getAttribute("selected")) {
                            return;
                        } else {
                            noInterest.removeAttribute("selected");
                            interest.setAttribute("selected", true);
                        }
                    }
                    window.news.doInterestOrNot(hasInterest);
                }
            }
        }
    }

    function updateNotInterest(isCancel) {
        if (window.news) {
            var interest = document.getElementById("interest").firstChild;
            var noInterest = document.getElementById("no_interest").firstChild;

            if (interest && noInterest) {
                if (isCancel) {
                    if (noInterest.getAttribute("sel")) {
                        noInterest.removeAttribute("sel");
                    }
                } else {
                    if (noInterest.getAttribute("selected")) {
                        return;
                    } else {
                        interest.removeAttribute("selected");
                        noInterest.setAttribute("selected", true);
                    }
                }
            }
        }
    }

    function updateInterestOrNot(interestCount) {
        if (interestCount) {
            var e = document.getElementById("interest_count");
            if (e) {
                e.innerText = interestCount;
            }
        }
    }
    /** ***********************文章正文感兴趣/不感兴趣END************************ */

    /** 分享点击 */
    function doNewsShare(type) {
        if (window.news) {
            window.news.doNewsShare(type);
        }
    }

    /** 查看更多分享入口 */
    function shareMoreItem() {
        if (window.news) {
            window.news.shareMoreItem();
        }
    }

    /** 广告div填充 */
    function getAdText() {
        var ad = document.getElementById('ad_div');
        if (!ad) {
            return;
        }
        if (window.news) {
            var adText = window.news.getAdText();
            if (adText) {
                ad.innerHTML = adText;
                addAdCount();
                hasBottomAd = true;
            }
        }
    }

    function addAdCount() {
        adCount = adCount + 1;
    }

    /** 相关新闻，广告点击 */
    function doAdAction(index, type) {
        if (window.news) {
            window.news.doAdAction(index, type);
        }
    }

    /** 广告插入在对应相关新闻结点之前 */
    function insertRelativeAd(id, index) {
        var relativeItem = document.getElementById("relative_" + id);
        if (!relativeItem) {
            return;
        }
        var adItem = document.getElementById("relative_ad_" + index);
        if (adItem) {
            return;
        }
        if (window.news) {
            var adText = window.news.getRelativeAdText(index);
            relativeItem.insertAdjacentHTML('beforeBegin', adText);

            addAdCount();
        }
    }

    /** 广告插在所有相关新闻之后 */
    function appendRelativeAd(index) {
        var relativeSection = document.getElementById("rnews_section");
        if (!relativeSection) {
            return;
        }
        var adItem = document.getElementById("relative_ad_" + index);
        if (adItem) {
            return;
        }
        if (window.news) {
            var adText = window.news.getRelativeAdText(index);
            relativeSection.insertAdjacentHTML('beforeEnd', adText);

            addAdCount();
        }
    }

    /** 下载广告app */
    function downloadAdApp(i) {
        if (window.news) {
            window.news.downloadAdApp(i);
        }
    }

    /** 编辑推荐 相关新闻 */
    function toRelative(i) {
        if (window.news) {
            window.news.toRelative(i);
        }
    }

    /** 热门跟贴 */
    function getCommentText() {
        comment = document.getElementById('hot_comment');
        if (!comment) {
            return;
        }
        if (window.news) {
            comment.innerHTML = window.news.getCommentText();
        }
    }

    /** 查看更多跟贴 */
    function goMoreTie() {
        if (window.news) {
            window.news.goMoreTie();
        }
    }

    /** 问吧 */
    function goAskDetail(expertId) {
        if (window.news) {
            window.news.goAskDetail(expertId);
        }
    }

    function gotoOlympicMedal(){
        if(window.news){
           window.news.gotoOlympicMedal();
        }
    }

    /** 文章所属频道 */
    function getChannelText() {
        var channel = document.getElementById('channel_div');
        if (!channel) {
            return;
        }
        if (window.news) {
            var info = window.news.getChannelInfo();
            if (info) {
                channel.style.display = "";
                channel.innerHTML = info;
            } else {
                channel.style.display = "none";
            }
        }
    }

    /** 去文章所属频道列表 */
    function goChannel(tid, tname) {
        if (window.news) {
            if (tid != '' & tname != '') {
                window.news.goChannel(tid, tname);
            }
        }
    }

    /** 系统推荐 相关新闻 */
    function toSysRelative(i) {
        if (window.news) {
            window.news.toSysRelative(i);
        }
    }

    /** 本地宝资讯相关推荐 */
    function goToLocalMerchantInfo(docId) {
        if (window.news) {
            window.news.goToLocalMerchantInfo(docId);
        }
    }

    /** 足球篮球彩票 */
    function lotterySelect(type, id, boxShadow) {
        var lottery = document.getElementById(id);
        if (lottery) {
            if (lottery.getAttribute("ntes_lottery_selected")) {
                lottery.removeAttribute("ntes_lottery_selected");
                lottery.style.boxShadow = "";
            } else {
                lottery.setAttribute("ntes_lottery_selected", "true");
                lottery.style.boxShadow = boxShadow;
            }
        }
    }

    /** 足球篮球彩票投注 */
    function goLottery(type) {
        if (window.news) {
            var lotteryContainer = document.getElementById("lottery_container");
            if (lotteryContainer) {

                var url = lotteryContainer.getAttribute("ntes_lottery_url");
                if (!url || url == "") {
                    return;
                }
                url += "?gameStr=" + lotteryContainer.getAttribute("ntes_lottery_matchcode");

                var odds = "";
                var lotteryLeft = type == "2" ? document.getElementById("lotteryRight") : document.getElementById("lotteryLeft");
                if (lotteryLeft && lotteryLeft.getAttribute("ntes_lottery_selected")) {
                    if (odds == "") {
                        odds = "3";
                    } else {
                        odds = odds + ".3";
                    }
                }

                var lotteryCenter = document.getElementById("lotteryCenter");
                if (lotteryCenter && lotteryCenter.getAttribute("ntes_lottery_selected")) {
                    if (odds == "") {
                        odds = "1";
                    } else {
                        odds = odds + ".1";
                    }
                }

                var lotteryRight = type == "2" ? document.getElementById("lotteryLeft") : document.getElementById("lotteryRight");
                if (lotteryRight && lotteryRight.getAttribute("ntes_lottery_selected")) {
                    if (odds == "") {
                        odds = "0";
                    } else {
                        odds = odds + ".0";
                    }
                }

                if (odds != "") {
                    url = url + ":" + odds;
                }

                url = url + "&from=newswz";
                window.news.goWeb(url);
            }
        }
    }

    /** ***********************百度词条START************************ */
    /** 展示百度词条卡片 */
    function showCard(i) {
        var e;
        if (arguments.callee) {
            if (arguments.callee.caller) {
                if (arguments.callee.caller.arguments[0]) {
                    e = arguments.callee.caller.arguments[0];
                }
            }
        }

        var eve = e || window.event;
        var screen = window.screen;
        var aZone = document.getElementById("wiki_" + i);
        var bodyNode = document.body

        if (eve && screen && aZone && bodyNode) {
            var x = eve.clientX,
                y = eve.clientY;
            var availWidth = Math.min(screen.availWidth, screen.width),
                availHeight = Math.min(screen.availHeight, screen.height)
            var aLeft = aZone.offsetLeft,
                aTop = aZone.offsetTop;
            var aWidth = aZone.offsetWidth,
                aHeight = aZone.offsetHeight;
            var scrollTop = 0;
            if (eve.pageY) {
                scrollTop = eve.pageY - y;
            } else {
                scrollTop = bodyNode.scrollTop;
            }
            var paddingOffset = aHeight * (LINE_HEIGHT_PERCENT - 1) / 2 + aHeight / 3 // (aHeight / 3) is offset
            var halfScreenHeight = (availHeight - TOOLBAR_HEIGHT - REPLY_HEIGHT) / 2;
            var cond = halfScreenHeight + TOOLBAR_HEIGHT;
            var aTopRelative = (aTop - scrollTop + paddingOffset);
            var isUp = aTopRelative >= cond;
            var isLeft = (aLeft + aWidth / 2) <= (availWidth / 2);

            var arrowLeft = 0,
                arrowTop = 0;
            if (isLeft) {
                arrowLeft = aLeft + aWidth / 2;
            } else {
                arrowLeft = aLeft + aWidth / 2 - WIKI_ARROW_WIDTH;
            }

            var maxHeight = 0; // init
            if (isUp) {
                arrowTop = aTop - WIKI_ARROW_HEIGHT;
                maxHeight = aTop - scrollTop - TOOLBAR_HEIGHT;
            } else {
                arrowTop = aTop + aHeight;
                maxHeight = halfScreenHeight - (aTopRelative + aHeight * LINE_HEIGHT_PERCENT - cond)
            }

            // set click listener
            var cardZone = document.getElementById("wiki_card_zone");
            if (cardZone) {
                cardZone.onclick = function() {
                    toWiki(i)
                }
            }

            if (window.news) {
                window.news.getWikiCardContent(i, isUp, isLeft, arrowLeft, arrowTop, maxHeight);
            }
        }
    }

    /** 去百度词条链接 */
    function toWiki(i) {
        if (window.news) {
            window.news.toWiki(i);
        }
    }

    /** 更新百度词条卡片 */
    function updateWikiCard(isUp, isLeft, arrowLeft, arrowTop, maxHeight, title, source, content, isFromYouDao) {
        var section = document.getElementById("wiki_section");
        if (section) {
            var arrow = document.getElementById("wiki_arrow");
            var mask = document.getElementById("wiki_mask");
            var cardZone = document.getElementById("wiki_card_zone");
            var contentNode = document.getElementById("wiki_content");
            var bodyNode = document.body
            var screen = window.screen;
            if (arrow && mask && cardZone && contentNode && bodyNode && screen) {
                // arrow left top display
                arrow.style.left = arrowLeft + "px";
                arrow.style.top = arrowTop + "px";
                if (!isUp && isLeft) {
                    arrow.style.webkitTransform = "";
                } else if (!isUp && !isLeft) {
                    arrow.style.webkitTransform = "rotateY(180deg)";
                } else if (isUp && isLeft) {
                    arrow.style.webkitTransform = "rotateX(180deg)";
                } else {
                    arrow.style.webkitTransform = "rotateX(180deg) rotateY(180deg)";
                }
                arrow.style.display = "block";
                // section height display
                section.style.height = bodyNode.scrollHeight + "px";
                section.style.display = "-webkit-box";
                // mask style modify ...
            } else {
                return;
            }

            var wikiHeaderNode = document.getElementById("wiki_header");
            var titleNode = document.getElementById("wiki_title");
            var sourceNode = document.getElementById("wiki_source");
            var textareaNode = document.getElementById("wiki_content");
            var readMoreNode = document.getElementById("wiki_read_more");
            if (wikiHeaderNode && titleNode && sourceNode && textareaNode && readMoreNode) {
                if (isFromYouDao) {
                    readMoreNode.style.display = "-webkit-box";
                    wikiHeaderNode.style.paddingRight = "0";
                } else {
                    cardZone.onclick = "";
                    readMoreNode.style.display = "none";
                    wikiHeaderNode.style.paddingRight = "18px";
                }

                titleNode.innerText = title;
                sourceNode.innerText = source;
                textareaNode.innerText = content;
                // compute height

                //var scrollTop = bodyNode.scrollTop;
                var headerHeight = wikiHeaderNode.offsetHeight; // except contentHeight == headerHeight + marginTop + marginBottom + padding * 2
                var realHeight = cardZone.offsetHeight;
                var needHeight = 0; // init
                var needResize = (realHeight + WIKI_ARROW_HEIGHT / 2) >= maxHeight;
                if (isUp) {
                    if (needResize) {
                        needHeight = arrowTop + WIKI_ARROW_HEIGHT - maxHeight;
                    } else {
                        needHeight = arrowTop + WIKI_ARROW_HEIGHT / 2 - realHeight - 0.5; // 0.5 is offset
                    }
                } else {
                    needHeight = arrowTop + WIKI_ARROW_HEIGHT / 2;
                }

                var topOrBottomOffset = 4;
                var headerMargin = 30;
                // content: if height < max height set var content's max-height, and overflow-y: scroll
                if (needHeight < TOOLBAR_HEIGHT) {
                    // init position && card is up, 4 is top offset
                    cardZone.style.top = (TOOLBAR_HEIGHT + topOrBottomOffset) + "px";
                    contentNode.style.maxHeight = (arrowTop + WIKI_ARROW_HEIGHT / 2 - 1.5 - TOOLBAR_HEIGHT - headerHeight - headerMargin - (isFromYouDao ? WIKI_SOURCE_HEIGHT : WIKI_NONE_SOURCE_HEIGHT) - topOrBottomOffset) + "px"; // 1.5 is offset relative arrow
                    contentNode.style.overflowY = "scroll";
                } else if (!needResize) {
                    // set cardZone's top
                    cardZone.style.top = needHeight + "px";
                    contentNode.style.maxHeight = "";
                    contentNode.style.overflowY = "";
                } else {
                    // 4 is top or bottom offset
                    cardZone.style.top = (isUp ? (needHeight + topOrBottomOffset) : needHeight) + "px";
                    contentNode.style.maxHeight = (maxHeight - WIKI_ARROW_HEIGHT / 2 - headerHeight - headerMargin - (isFromYouDao ? WIKI_SOURCE_HEIGHT : WIKI_NONE_SOURCE_HEIGHT) - (isUp ? 2.5 : topOrBottomOffset)) + "px"; // 2.5 is offset relative arrow when isUp, Fix: not topOrBottomOffset
                    contentNode.style.overflowY = "scroll";
                }
            }
        }
    }

    /** 隐藏百度词条卡片 */
    function hideWikiCard() {
        var section = document.getElementById("wiki_section");
        if (section) {
            section.style.display = "none";
            // reset style
            var arrow = document.getElementById("wiki_arrow");
            var mask = document.getElementById("wiki_mask");
            var cardZone = document.getElementById("wiki_card_zone");
            var contentNode = document.getElementById("wiki_content");
            var bodyNode = document.body
            var screen = window.screen;
            if (arrow && mask && cardZone && contentNode && bodyNode && screen) {
                arrow.style.left = "";
                arrow.style.top = "";
                arrow.style.webkitTransform = "";
                //                arrow.style.display = "none";
                section.style.height = "";
                //                section.style.display = "none";
            } else {
                return;
            }

            var wikiHeaderNode = document.getElementById("wiki_header");
            var titleNode = document.getElementById("wiki_title");
            var sourceNode = document.getElementById("wiki_source");
            var textareaNode = document.getElementById("wiki_content");
            if (wikiHeaderNode && titleNode && sourceNode && textareaNode) {
                // reset content
                titleNode.innerText = "";
                sourceNode.innerText = "";
                textareaNode.innerText = "";
                // reset style
                cardZone.style.top = "";
                contentNode.style.maxHeight = "";
                contentNode.style.overflowY = "";
            }

            // clear click listener
            cardZone.click = "";
        }
    }
    /** ***********************百度词条END************************ */

    /*************************投票START*************************/
    /** 替换投票div */
    function replaceVote(index) {
        var voteBody = document.getElementById("vote_body_" + index);
        if (!voteBody) {
            return;
        }

        // 有这个空类（已投票标识）的投票模块才进行投票替换
        var voteds = voteBody.getElementsByClassName("vote_is_voted");
        if (voteds && voteds.length > 0) {
            buildVoteResults(index);
        }

        voteOptionButtonLoaded();
    }

    /** 改变选择状态 */
    function changeStatusOption(type, position, index) {
        var voteBody = document.getElementById("vote_body_" + index);
        if (!voteBody) {
            return;
        }

        var items = voteBody.getElementsByClassName("vote_item");

        if (!items || position >= items.length) {
            return;
        }

        if (type == 0) {
            // 单选
            var item = items[position];
            if (item.firstChild && item.firstChild.firstChild && item.firstChild.firstChild.getAttribute("selected")) {
                return;
            }

            for (i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.firstChild && item.firstChild.firstChild) {
                    var child = item.firstChild.firstChild;
                    if (child.getAttribute("selected")) {
                        child.removeAttribute("selected");
                    }
                }
            }

            var item = items[position];
            if (item.firstChild && item.firstChild.firstChild) {
                var child = item.firstChild.firstChild;
                if (!child.getAttribute("selected")) {
                    child.setAttribute("selected", true);
                }
            }
        } else {
            // 多选
            var item = items[position];
            if (item.firstChild && item.firstChild.firstChild) {
                var child = item.firstChild.firstChild;
                if (child.getAttribute("selected")) {
                    child.removeAttribute("selected");
                } else {
                    child.setAttribute("selected", true);
                }
            }
        }
    }

    /** 点击投票 */
    function checkVoteOption(voteId, itemId, sum_num, index) {
        if (window.news) {
            //java方法submitVote
            var flage = window.news.submitVote(voteId, itemId);
            if (flage) {
                document.getElementById("vote_sumnum").innerText = String(sum_num + 1) + '人';
                buildVoteResults(index);
            }
        }
    }

    /** 单选投票 */
    function singlevotesubmit(voteId, itemIdSet, index) {
        var itemId = "";
        if (window.news) {
            var items = document.getElementById("vote_body_" + index).getElementsByClassName("vote_item");

            if (!items) {
                return;
            }

            for (i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.firstChild && item.firstChild.firstChild) {
                    var child = item.firstChild.firstChild;
                    if (child.getAttribute("selected")) {
                        itemId += itemIdSet[i];
                        break;
                    }
                }
            }

            if (itemId && itemId.length > 1) {
                var flag = window.news.submitVote(voteId, itemId);
                if (flag) {
                    updateVoteResults(index);
                }
            }
        }
    }

    /** 多选投票 */
    function multivotesubmit(voteId, itemIdSet, num, index) {
        var itemIds = "";
        if (window.news) {
            var items = document.getElementById("vote_body_" + index).getElementsByClassName("vote_item");

            if (!items) {
                return;
            }

            for (i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.firstChild && item.firstChild.firstChild) {
                    var child = item.firstChild.firstChild;
                    if (child.getAttribute("selected")) {
                        itemIds = itemIds + "," + itemIdSet[i];
                    }
                }
            }

            if (itemIds && itemIds.length > 1) {
                var flag = window.news.multisubmit(voteId, itemIds);
                if (flag) {
                    updateVoteResults(index);
                }
            }
        }
    }

    function voteItemSelected(e, index, i) {
        if (window.news) {
            var imgcontent = document.getElementById("vote_img_" + index + "_" + i);
            var src = imgcontent.src;
            if (src == 'file:///android_asset/topic_subscribed.png') {

                imgcontent.src = 'file:///android_asset/topic_not_subscribed.png';

            } else if (src == 'file:///android_asset/night_topic_subscribed.png') {

                imgcontent.src = 'file:///android_asset/night_topic_not_subscribed.png';

            } else if (src == 'file:///android_asset/topic_not_subscribed.png') {

                imgcontent.src = 'file:///android_asset/topic_subscribed.png';

            } else if (src == 'file:///android_asset/night_topic_not_subscribed.png') {

                imgcontent.src = 'file:///android_asset/night_topic_subscribed.png';

            }

        }
        stopEventBubble(e);
    }

    function buildVoteResults(index) {
        var voteBody = document.getElementById("vote_body_" + index);
        if (!voteBody) {
            return;
        }

        // remove vote type
        var voteTypes = voteBody.getElementsByClassName("vote_type");
        for (var i = 0; i < voteTypes.length; i++) {
            var voteType = voteTypes[i];
            if (voteType) {
                var typeParent = voteType.parentElement;
                typeParent.removeChild(voteType);
            }
        }

        var voteItems = voteBody.getElementsByTagName("a");

        var colors = ["#1e8ce1", "#1ea835", "#efa525", "#f05646"];
        var fontColors = ["#1e8ce1", "#189c2d", "#c4890c", "#cd4637"];

        var lastPercent = 0;
        for (var i = 0; i < voteItems.length; i++) {
            var voteItem = voteItems[i];
            // get value
            var content = voteItem.innerHTML;
            var percentage = voteItem.getAttribute("percentage");
            // hide a
            voteItem.style.display = "none";
            // item
            var item = voteItem.parentElement;

            var outerDiv = document.createElement("div");
            // item content
            var contentSpan = document.createElement("span");
            contentSpan.innerText = content;
            outerDiv.appendChild(contentSpan);

            var innerDiv = document.createElement("div");
            // item bar
            var statisticBar = document.createElement("div");
            statisticBar.style.background = colors[i % colors.length];
            statisticBar.onload = statisticBarLoaded(statisticBar, percentage);
            innerDiv.appendChild(statisticBar);

            // item label
            var statisticLabel = document.createElement("span");
            if (i == voteItems.length - 1) {
                lastPercent = 100 - lastPercent;
                if (lastPercent < 0) {
                    lastPercent = 0;
                }
                statisticLabel.innerText = lastPercent + "%";
                statisticLabel.style.color = fontColors[i % fontColors.length];
            } else {
                currentPercent = formatFloat(percentage);
                lastPercent += currentPercent;
                statisticLabel.innerText = currentPercent + "%";
                statisticLabel.style.color = fontColors[i % fontColors.length];
            }
            innerDiv.appendChild(statisticLabel);
            outerDiv.appendChild(innerDiv);

            item.appendChild(outerDiv);

            if (i == voteItems.length - 1) {
                item.style.paddingBottom = "23px";
            }
        }
    }

    function updateVoteResults(index) {
        var voteBody = document.getElementById("vote_body_" + index);
        if (!voteBody) {
            return;
        }

        // update vote num
        var voteNum = document.getElementById("vote_sumnum");
        var reg = new RegExp(/\d*/);
        var str = voteNum.innerText;
        var arrMactches = str.match(reg)
        if (arrMactches && arrMactches.length > 0) {
            var i = new Number(arrMactches[0])
            voteNum.innerText = (i + 1) + "人";
        }

        // remove vote type
        var voteTypes = voteBody.getElementsByClassName("vote_type");
        for (var i = 0; i < voteTypes.length; i++) {
            var voteType = voteTypes[i];
            if (voteType) {
                var typeParent = voteType.parentElement;
                typeParent.removeChild(voteType);
            }
        }

        var voteItems = voteBody.getElementsByTagName("a");

        var colors = ["#1e8ce1", "#1ea835", "#efa525", "#f05646"];
        var fontColors = ["#1e8ce1", "#189c2d", "#c4890c", "#cd4637"];

        var lastPercent = 0;
        for (var i = 0; i < voteItems.length; i++) {
            var voteItem = voteItems[i];

            // get value
            var content = "";
            var contentSpans = voteItem.getElementsByTagName("span");
            for (var j = 0; j < contentSpans.length; j++) {
                content = contentSpans[j].innerHTML;
                if (content && content.length) {
                    break;
                }
            }

            var percentage = voteItem.getAttribute("percentage");
            // hide a
            voteItem.style.display = "none";
            // item
            var item = voteItem.parentElement;

            // hide submit
            if (voteItem.getAttribute("id") && i == voteItems.length - 1) {
                var id = voteItem.getAttribute("id");
                var submitId = "votesubmit_" + index;
                if (id == submitId) {
                    item.style.paddingBottom = "23px";
                    continue;
                }
            }

            var outerDiv = document.createElement("div");
            // item content
            var contentSpan = document.createElement("span");
            contentSpan.innerText = content;
            outerDiv.appendChild(contentSpan);

            var innerDiv = document.createElement("div");
            // item bar
            var statisticBar = document.createElement("div");
            statisticBar.style.background = colors[i % colors.length];
            statisticBar.onload = statisticBarLoaded(statisticBar, percentage);
            innerDiv.appendChild(statisticBar);

            // item label
            var statisticLabel = document.createElement("span");
            if (i == voteItems.length - 1) {
                lastPercent = 100 - lastPercent;
                if (lastPercent < 0) {
                    lastPercent = 0;
                }
                statisticLabel.innerText = lastPercent + "%";
                statisticLabel.style.color = fontColors[i % fontColors.length];
            } else {
                currentPercent = formatFloat(percentage);
                lastPercent += currentPercent;
                statisticLabel.innerText = currentPercent + "%";
                statisticLabel.style.color = fontColors[i % fontColors.length];
            }
            innerDiv.appendChild(statisticLabel);
            outerDiv.appendChild(innerDiv);

            item.appendChild(outerDiv);
        }
    }

    function formatFloat(number) {
        return Math.round(number * 100);
    }

    function getwidth(number) {
        if (number == 0) {
            return 30;
        }
        return Math.round(number * 350 / 100);
    }

    function updateVoteStatus(status) {
        document.getElementById("vote_status").innerText = status;
    }

    function voteOptionButtonLoaded() {
        var buttons = document.getElementById("vote_body");
        if (!buttons) {
            return;
        }
        buttons = buttons.getElementsByTagName("a");
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            button.addEventListener('touchstart', function() {
                this.setAttribute("hover", true);
            }, false);
            button.addEventListener('touchend', function() {
                this.removeAttribute("hover");
            }, false);
        }
    }

    function statisticBarLoaded(element, percentage) {
        var pos, runTime,
            startTime = +new Date,
            timer = setInterval(function() {
                runTime = +new Date - startTime;
                pos = runTime / 200;

                if (pos >= 1) {
                    clearInterval(timer);
                    element.style.width = 90 * percentage + '%';
                } else {
                    element.style.width = 90 * percentage * pos + '%';
                };
            }, 13);
    }

    /** PK台 */
    function pkVoteDidFinish(voteId, itemId, itemIndex) {
        //修改html样式
        var votes = document.getElementsByClassName("pk_section");
        var pk;
        for (var i = 0; i < votes.length; i++) {
            var v = votes[i];
            var vid = v.getAttribute("id");
            if (vid == voteId) {
                pk = v;
                break;
            };
        }

        //投票div不存在或者已投票
        if (!pk || pk.getAttribute("voted") == '1') {
            return;
        }

        var buttons = pk.getElementsByClassName("pk_action_button");
        for (var i = 0; i < buttons.length; i++) {
            var b = buttons[i];
            //按钮禁止点击
            // b.setAttribute("voted","true");
            //标记已投票
            pk.setAttribute("voted", "1");

            //未选的那一个颜色更改为灰色
            if ((b.getAttribute("red") && itemIndex == 0) ||
                (b.getAttribute("blue") && itemIndex == 1)) {
                b.setAttribute("selected", "true");
            } else {
                b.setAttribute("disable", "true");
            }
        };

        //提取出投票选项的内容，准备做变更
        var nums = pk.getElementsByClassName("pk_num");
        var bars = pk.getElementsByClassName("pk_bar");
        var redbar, bluebar, rednum, bluenum;

        for (var i = 0; i < nums.length; i++) {
            var num = nums[i];
            if (num.getAttribute("red")) {
                rednum = num
            };
            if (num.getAttribute("blue")) {
                bluenum = num
            };
        };
        for (var i = 0; i < bars.length; i++) {
            var bar = bars[i];
            if (bar.getAttribute("red")) {
                redbar = bar
            };
            if (bar.getAttribute("blue")) {
                bluebar = bar
            };
        };

        //选择的那一项数字+1
        if (itemIndex == 0) {
            var n = rednum.innerText;
            rednum.innerText = ++n;
        };
        if (itemIndex == 1) {
            var n = bluenum.innerText;
            bluenum.innerText = ++n;
        };

        //重新算两个颜色条的宽度比例
        var totalNum = parseInt(rednum.innerText) + parseInt(bluenum.innerText);
        var redTemp = Math.floor(100.0 * rednum.innerText / totalNum);
        var redPercent = redTemp;
        if (redTemp > 90) {
            redPercent = 90;
        } else if (redTemp < 10) {
            redPercent = 10;
        }
        var bluePercent = 100 - redPercent;
        if (redTemp > 10 && redTemp < 90) {
            if (itemIndex == 0) {
                redPercent += 1;
                bluePercent -= 1;
            } else if (itemIndex == 1) {
                redPercent -= 1;
                bluePercent += 1;
            }
        }

        redbar.style.width = redPercent + "%";
        bluebar.style.width = bluePercent + "%";

        //发送投票网络请求
        if (window.news) {
            //java方法submitVote
            window.news.submitVote(voteId, itemId);
            window.news.startPKComment(itemIndex);
        }
    }
    /** ***********************投票END************************ */

    /** *************************暂时不用START*********************** */
    function gotoSearchKeyWord(keyWord) {
        if (window.news) {
            if (keyWord) {
                window.news.gotoSearchKeyWord(keyWord);
            }
        }
    }

    function randerComment() {
        myBody = document.getElementById('article_body');

        var posttime = document.createElement('span');
        posttime.innerHTML = "时间时间";
        myBody.appendChild(posttime);
    }

    function getMore() {
        moreButton.style.display = "none";
        //myMore = document.getElementById('more');
        myBody = document.getElementById('article_body');
        if (window.news) {
            more = window.news.getMoreBody();
            myBody.innerHTML = myBody.innerHTML + more;
        }
    }

    function goToDoc(docId) {
        if (window.news) {
            window.news.goToDoc(docId);
        }
    }

    function checkGoodsStatus() {
        if (window.news) {
            window.news.checkGoodsStatus();
        }
    }

    function goToMap(location) {
        if (window.news) {
            window.news.goToMap(location);
        }
    }

    // 和dosubscribe()方法类似
    function subscribeTopic(e, i) {
        if (window.news) {
            window.news.subscribeTopic(i);
        }
        stopEventBubble(e);
    }

    function setSubscribeTopicImg(i, imgUrl) {
        var imgcontent = document.getElementById("topic_img_" + i);
        if (null != imgcontent) imgcontent.src = imgUrl;
    }

    // isShown默认返回0，所以查看全文按钮不显示
    function showMoreButton() {
        moreButton = document.getElementById('moreButton');

        if (window.news) {
            var isShown = window.news.hasNext();

            if (isShown == 1) {
                myBody.innerHTML = body;
                moreButton.style.display = "block";
            } else if (isShown == 2) { // 奥运视频新闻
                myBody.innerHTML = body;
                moreButton.style.display = "none";
            } else {
                myBody.innerHTML = body;
                moreButton.style.display = "none";
            }
        } else {
            myBody.innerHTML = body;
            moreButton.style.display = "none";
        }
    }

    //获取文章正文长度，从文章底部查看原文行算起
    function getArticalHeight(){
        if(window.news){
            var topBanner = document.getElementById('top_banner');
            var bottomSource = document.getElementById('bottom_source_section');
            var share = document.getElementById('share');
            if(topBanner != null){
                if(bottomSource != null){
                    window.news.setArticalHeight(pageY(bottomSource) + bottomSource.offsetHeight - pageY(topBanner));
                }else if(share != null){
                    window.news.setArticalHeight(pageY(share) - pageY(topBanner));
                }

            }
        }
    }

    function pageY(elem) {
        return elem.offsetParent?(elem.offsetTop + pageY(elem.offsetParent)) : elem.offsetTop;
    }

    function over(obj) {
        var showmore = document.getElementById('showmore');
        var loading = document.getElementById('loading');

        showmore.style.position = "relative";
        showmore.style.top = 1;
        showmore.style.left = 1;

        showmore.style.display = "none"

        loading.style.display = "block";

        if (window.news) {
            window.news.getMore();
        }
    }

    // 修改相关新闻字体
    function showRelativeNewsTextSize(size) {
        var relativeNames = document.getElementsByName("relative_name");
        for (i = 0; i < relativeNames.length; i++) {
            relativeNames[i].style.fontSize = size + "px";
        }
    }

    function showPadding(paddingnum) {
        document.body.style.paddingTop = paddingnum + "%";
    }

    // 单张大图参看图片
    function reloadImage(i) {

        if (window.news) {
            var largepic = document.getElementById('largepic' + i);
            var imgcontent = document.getElementById("imgContent_" + i);
            var percent = document.getElementById("percent_" + i);

            if (percent != null &&
                (percent.src == 'file:///android_asset/big_reload_img.png' ||
                    percent.src == 'file:///android_asset/small_reload_img.png')) {

                if (null != imgcontent) {
                    imgcontent.src = 'file:///android_asset/null_src.png';
                }
                window.news.reloadImg(i);
                return;
            }
        }
    }

    function updateTopicPic(i, url) {
        var imgTopic = document.getElementById("TopicImg_" + i);
        imgTopic.src = url;
    }

    function setRelativeIsRead(obj) {
        var ids = obj.split(",");
        for (var i = 0; i < ids.length; i++) {
            document.getElementById("relative_" + ids[i]).style.color = '#8E8E8E';
        }
    }

    function getJsString(i) {
        if (window.news) {
            return window.news.getJsString(i);
        }
        return "";
    }

    function doReport() {
        if (window.news) {
            window.news.doReport();
        }
    }

    /** *************************暂时不用END*********************** */

    /** *************************未知START(感觉是为节点的click事件做过滤)*********************** */
    function isLink(node) {
        var node = node;
        // 如果是相关新闻就作为超链接处理
        if (node.id.indexOf("relative_") != -1) {
            return true;
        }

        while (node && node.nodeName && node.nodeName != "A" && node.nodeName != "IMG") {
            if (node.nodeName == "HTML")
                return false;
            node = node.parentNode;
        }
        return true;
    }

    function clickEvent() {
        if (isLink(event.target)) return;
    }

    document.addEventListener('click', clickEvent, false);
    /** *************************未知END*********************** */