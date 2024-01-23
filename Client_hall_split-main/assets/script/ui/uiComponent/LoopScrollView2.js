/*
 LoopScrollView scrollview循环滚动(独立于界面系统,可以被所有界面使用的组件)
 */

var LoopScrollView = cc.Class({

    extends: require("BaseComponent"),

    properties: {
        ScrollView:cc.ScrollView,
        
        CreateChildCount:{
            "default": 7,
            "tooltip":"创建的子类个数",
            "type": cc.Integer
        },

        Spacing:{
            "default": 10,
            "tooltip":"子类间隔",
            "type": cc.Integer
        }
    },

    OnLoad:function(){
        //滑动到边界
        this.ScrollEndTypeList = [
            cc.ScrollView.EventType.SCROLL_TO_TOP,
            cc.ScrollView.EventType.SCROLL_TO_BOTTOM,
            cc.ScrollView.EventType.SCROLL_TO_LEFT,
            cc.ScrollView.EventType.SCROLL_TO_RIGHT,
        ];

        //0.2秒检测一次
        this.ScrollUpdateInterval = 0.1;

        //TODO:BUG OnLoad 会在 InitScrollData之后被调用..所以不能定义初始化变量
        // //所有数据列表
        // this.totalDataList = [];

        // //追加的滑动控件子类界面组件名
        // this.scrollViewChildComponentName = "";

        // //物件高
        // this.itemHeight = 0;
        // this.itemWidth = 0;

        // //上次更新的content滑动Y坐标
        // this.lastContentPosY = 0;
        // this.lastContentPosX = 0;

        // //视口宽高
        // this.viewHeight = 0;
        // this.viewWidth = 0;

        // //子界面的锚点
        // this.itemAnchorX = 0.5;
        // this.itemAnchorY = 0.5;

        // //滑动方向
        // this.scrollDir = "";

        // this.childFormPrefab = null;

        //更新时间开关
        this.passSecond = 0;

        this.ScrollView.node.on('scroll-ended', this.ScrollEnded, this);
    },

    ScrollEnded:function(){
        let baseForm = this.getComponent("BaseForm");
        baseForm.OnScrollEnded();
    },

    //------------创建接口------------------

    RefreshData:function(dataList){
        this.totalDataList = dataList;
        let totalCount = this.totalDataList.length;

        if(this.scrollDir == "vertical"){
            //设置滑动控件的最大滑动高度
            let totalHeight = totalCount * (this.itemHeight + this.Spacing) + this.Spacing;
            this.ScrollView.content.height = totalHeight;
        }
        else{
            //设置滑动控件的最大滑动高度
            let totalWidth = totalCount * (this.itemWidth + this.Spacing) + this.Spacing;
            this.ScrollView.content.width = totalWidth;
        }

        let baseForm = this.getComponent("BaseForm");
        let allChildList = baseForm.GetAllChildComponentByName(this.scrollViewChildComponentName);
        let haveCreateCount = allChildList.length;

        //如果创建的子类已经是缓存上限了
        if(haveCreateCount >= this.CreateChildCount){
            return
        }

        let createCount = this.CreateChildCount;
        //总数没有达到上限
        if(createCount > totalCount){
            createCount = totalCount
        }

        //创建限定个数的子界面
        for(let index=haveCreateCount; index<createCount; index++){
            let userData = this.totalDataList[index];
            let pos = null;
            if(this.scrollDir == "vertical"){
                pos = cc.v2(0, -this.itemHeight * (1-this.itemAnchorY + index) - this.Spacing * (index + 1));
            }
            else{
                pos = cc.v2(this.itemWidth * (1-this.itemAnchorX + index) + this.Spacing * (index + 1), 0);
            }
            this.CreateScrollViewChildForm(index, userData, pos);
        }

        this.ScrollView.stopAutoScroll();

        if(this.isScrollToLast && haveCreateCount >= createCount){
            if(this.scrollDir == "vertical"){
                this.ScrollView.scrollToBottom();
            }
            else{
                this.ScrollView.scrollToRight();
            }
        }
        else{
            if(this.scrollDir == "vertical"){
                this.ScrollView.scrollToTop();
            }
            else{
                this.ScrollView.scrollToLeft();
            }
        }


    },

    //初始化滑动数据
    InitScrollData:function(childComponentName, childFormPrefab, dataList, itemHeight=0, isScrollToLast){

        if(!isScrollToLast){
            isScrollToLast = false;
        }

        this.isScrollToLast = isScrollToLast;
        //上次更新的content滑动Y坐标
        this.lastContentPosY = 0;
        this.lastContentPosX = 0;

        this.scrollViewChildComponentName = childComponentName;
        this.childFormPrefab = childFormPrefab;

        this.getComponent("BaseForm").ClearAllChildComponentByName(childComponentName);

        this.totalDataList = dataList;
        let totalCount = this.totalDataList.length;
        let createCount = this.CreateChildCount;

        //总是没有达到上限
        if(createCount > totalCount){
            createCount = totalCount
        }

        if(this.ScrollView.vertical){
            this.scrollDir = "vertical";
        }
        else if(this.ScrollView.horizontal){
            this.scrollDir = "horizontal";
        }
        else{
            this.ErrLog("ScrollView not find scrollDir");
            return
        }

        if(this.scrollDir == "vertical"){
            //有可能高度不是ChildFormPrefab的高度 (如:UICardPack_Child子界面)
            if(itemHeight){
                this.itemHeight = itemHeight;
            }
            else{
                this.itemHeight = this.childFormPrefab.data.height;
                if(!this.itemHeight){
                    this.ErrLog("childFormPrefab not height");
                    return
                }
            }
            //设置滑动控件的最大滑动高度
            let totalHeight = totalCount * (this.itemHeight + this.Spacing) + this.Spacing;
            this.ScrollView.content.height = totalHeight;
        }
        else{
            //有可能高度不是ChildFormPrefab的高度 (如:UICardPack_Child子界面)
            if(itemHeight){
                this.itemWidth = itemHeight;
            }
            else{
                this.itemWidth = this.childFormPrefab.data.width;
                if(!this.itemWidth){
                    this.ErrLog("childFormPrefab not width");
                    return
                }
            }
            //设置滑动控件的最大滑动高度
            let totalWidth = totalCount * (this.itemWidth + this.Spacing) + this.Spacing;
            this.ScrollView.content.width = totalWidth;
        }

        this.itemAnchorX = this.childFormPrefab.data.anchorX;
        this.itemAnchorY = this.childFormPrefab.data.anchorY;

        let view = this.ScrollView.node.getChildByName("view");
        this.viewHeight = view.height;
        this.viewWidth = view.width;


        //创建限定个数的子界面
        for(let index=0; index<createCount; index++){
            let userData = this.totalDataList[index];

            let pos = null;
            if(this.scrollDir == "vertical"){
                pos = cc.v2(0, -this.itemHeight * (1-this.itemAnchorY + index) - this.Spacing * (index + 1));
            }
            else{
                pos = cc.v2(this.itemWidth * (1-this.itemAnchorX + index) + this.Spacing * (index + 1), 0);
            }
            this.CreateScrollViewChildForm(index, userData, pos);
        }

        this.ScrollView.stopAutoScroll();


        if(this.scrollDir == "vertical"){
            this.ScrollView.scrollToTop();
        }
        else{
            this.ScrollView.scrollToLeft();
        }
        //this.Log("InitScrollData(%s),(%s),(%s,%s),(%s),(%s)", childComponentName, this.scrollDir, totalCount, createCount, this.viewHeight, this.itemHeight);

    },

    //创建循环滑动子类界面

    /*
     区别于CreateChildForm，循环滚动列表提供的特殊接口
     */
    CreateScrollViewChildForm:function(index, userData=0, pos=null, zorderLv=0, argument=null){

        let baseForm = this.getComponent("BaseForm");
        let childFormNode = baseForm.NewChildFormNode(this.scrollViewChildComponentName, this.childFormPrefab)
        let childFormComponent = childFormNode.getComponent(this.scrollViewChildComponentName);
        if(!childFormComponent){
            this.ErrLog("CreateChildForm childFormNode not find (%s)", this.scrollViewChildComponentName);
            return
        }

        childFormComponent.OnCreate(baseForm, this.scrollViewChildComponentName, index, userData, pos);
        this.ScrollView.content.addChild(childFormNode, zorderLv);

        baseForm.AddChildFormComponent(this.scrollViewChildComponentName, childFormComponent);
        
        childFormComponent.ShowForm(argument);

        return childFormComponent

    },


    //-------------获取借口-------------
    GetScrollView:function(){
        return this.ScrollView
    },

    GetChildFormPrefab:function(){
        return this.childFormPrefab
    },

    GetChildHeight:function(){
        return this.itemHeight
    },

    GetChildWidth:function(){
        return this.itemWidth
    },

    //获取子界面的索引位置
    GetChildIndex:function(userData){
        return this.totalDataList.IndexOf(userData)
    },

    // get item position in scrollview's node space
    GetPositionInView: function (childFormNode) {
        //子界面的世界坐标
        let worldPos = childFormNode.parent.convertToWorldSpaceAR(childFormNode.position);
        //子界面在滑动界面的坐标
        let viewPos = this.ScrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    //------------点击函数------------------

    //滑动回调
    OnScrollViewEvent:function(scrollView, eventType, eventData){
        //如果是滑动,需要检测那些子类已经划出屏幕外
        if(cc.ScrollView.EventType.SCROLLING == eventType){

        }
    },

    ScrollToIndex:function(index, indexOffset){
        this.ScrollView.scrollToOffset(cc.v2((index)*this.childFormPrefab.data.width + index*indexOffset, 0));
    },

    //滑动到指定子类 TODO:有BUG可能滑动了多个页面导致循环子类不能更新显示
    ScrollToChild:function(userData){
        let childIndex = this.totalDataList.IndexOf(userData);
        if(childIndex < 0){
            this.ErrLog("ScrollToChild(%s) not find", userData);
            return
        }
        if(this.scrollDir == "vertical"){
            this.ScrollView.content.y = (childIndex-1)*this.itemHeight;
            this.ScrollView.scrollToOffset(cc.v2(0, childIndex*(this.itemHeight + this.Spacing)), 0.5);
        }
        else{
            this.ScrollView.content.x = (childIndex-1)*this.itemWidth;
            this.ScrollView.scrollToOffset(cc.v2(0, childIndex*(this.itemWidth + this.Spacing)), 0.5);
        }
    },

    //没帧回掉
    update: function (dt) {

        this.passSecond += dt;
        if(this.passSecond >= this.ScrollUpdateInterval){
            this.OnCheckReusability();
            this.passSecond = 0;
        }
    },


    OnCheckReusability:function(){
        
        if(this.scrollDir == "vertical"){
            this.OnCheckVerticalReusability();
        }
        else if(this.scrollDir == "horizontal"){
            this.OnCheckHorizontalReusability();
        }
        else{
            this.ErrLog("scrollDir:%s", this.scrollDir)
        }

    },

    //水平方向
    OnCheckHorizontalReusability:function(){
        //没有滑动变化
        if(this.ScrollView.content.x == this.lastContentPosX){
            return
        }
        let baseForm = this.getComponent("BaseForm");

        let allChildFormList = baseForm.GetAllChildComponentByName(this.scrollViewChildComponentName);
        let childCount = allChildFormList.length;


        //视口上边界Y坐标
        let limitLeft = -this.viewWidth/2;
        //视口下边界Y坐标
        var limitRight = this.viewWidth/2;

        //创建的子控件总长度之和
        let allChildFormLength = (this.itemWidth + this.Spacing) * childCount;

        //判断滑动方向
        let isLeft = this.ScrollView.content.x < this.lastContentPosX;

        for (let index = 0; index < childCount; index++) {

            let childFormComponent = allChildFormList[index];
            let childFormNode = childFormComponent.node;
            let viewPos = this.GetPositionInView(childFormNode);

            if(isLeft) {
                //如果是需要检测的子界面坐标加上半高 < 下边界=>既子界面完全划出视野访问
                if (viewPos.x + this.itemWidth*(1-this.itemAnchorX) < limitLeft){

                    let newPosX = childFormNode.x + allChildFormLength;

                    //this.ErrLog("Left (%s) newPosX:%s,%s", index, newPosX, childFormNode.x);
                    //如果计算出的新坐标已经在顶层可见了,则设置子界面从底层到顶层
                    if(newPosX < this.ScrollView.content.width){

                        let childIndex = childFormComponent.GetFormProperty("ChildIndex");
                        let oldUserData = childFormComponent.GetFormProperty("UserData");

                        let newChildIndex = childIndex + childCount;
                        let userData = this.totalDataList[newChildIndex];
                        
                        if(userData){
                            childFormNode.setPositionX(newPosX);
                            childFormComponent.SetFormProperty("UserData", userData);
                            childFormComponent.SetFormProperty("ChildIndex", newChildIndex);
                            childFormComponent.OnShow();
                        }
                        else{
                            this.ErrLog("Left childIndex(%s,%s)=>(%s,%s)", childIndex, oldUserData, newChildIndex, userData);
                        }

                    }
                }
            }
            else {
                if (viewPos.x - this.itemWidth*this.itemAnchorX > limitRight){
                    
                    let newPosX = childFormNode.x - allChildFormLength;

                    //this.ErrLog("Right (%s) newPosX:%s,%s", index, newPosX, childFormNode.x);

                    //如果计算出的新坐标底层可见了,则设置子界面从顶层到底层
                    if(newPosX > 0){
                        let childIndex = childFormComponent.GetFormProperty("ChildIndex");
                        let oldUserData = childFormComponent.GetFormProperty("UserData");

                        let newChildIndex = childIndex - childCount;
                        let userData = this.totalDataList[newChildIndex];
                        
                        if(userData){
                            childFormNode.setPositionX(newPosX);
                            childFormComponent.SetFormProperty("UserData", userData);
                            childFormComponent.SetFormProperty("ChildIndex", newChildIndex);
                            childFormComponent.OnShow();
                        }
                        else{
                            this.ErrLog("Right childIndex(%s,%s)=>(%s,%s)", childIndex, oldUserData, newChildIndex, userData);
                        }
                        
                    }
                }
            }
        }
        this.lastContentPosX = this.ScrollView.content.x;
    },

    //垂直方向
    OnCheckVerticalReusability:function(){

        //没有滑动变化
        if(this.ScrollView.content.y == this.lastContentPosY){
            return
        }
        let baseForm = this.getComponent("BaseForm");
        let allChildFormList = baseForm.GetAllChildComponentByName(this.scrollViewChildComponentName);
        let childCount = allChildFormList.length;


        //视口上边界Y坐标
        let limitDown = -this.viewHeight/2;
        //视口下边界Y坐标
        var limitUp = this.viewHeight/2;

        //创建的子控件总长度之和
        let allChildFormLength = (this.itemHeight + this.Spacing) * childCount;

        //判断滑动方向
        let isDown = this.ScrollView.content.y < this.lastContentPosY;

        for (let index = 0; index < childCount; index++) {

            let childFormComponent = allChildFormList[index];
            let childFormNode = childFormComponent.node;
            let viewPos = this.GetPositionInView(childFormNode);

            //this.Log("index:%s,%s", index, viewPos);

            if(isDown) {
                //如果是需要检测的子界面坐标加上半高 < 下边界=>既子界面完全划出视野访问
                if (viewPos.y + this.itemHeight*(1-this.itemAnchorY) < limitDown){

                    let newPosY = childFormNode.y + allChildFormLength;
                    //this.ErrLog("Down (%s) newPosY:%s,%s", index, newPosY, childFormNode.y);

                    //如果计算出的新坐标已经在顶层可见了,则设置子界面从底层到顶层
                    if(newPosY < 0){

                        let childIndex = childFormComponent.GetFormProperty("ChildIndex");
                        let oldUserData = childFormComponent.GetFormProperty("UserData");

                        let newChildIndex = childIndex - childCount;
                        let userData = this.totalDataList[newChildIndex];
                        
                        if(userData){
                            childFormNode.setPositionY(newPosY);
                            childFormComponent.SetFormProperty("UserData", userData);
                            childFormComponent.SetFormProperty("ChildIndex", newChildIndex);
                            childFormComponent.OnShow();
                        }
                        else{
                            this.ErrLog("Down childIndex(%s,%s)=>(%s,%s)", childIndex, oldUserData, newChildIndex, userData);
                        }
                    }
                }
            }
            else {
                if (viewPos.y - this.itemHeight*this.itemAnchorY > limitUp){
                    
                    let newPosY = childFormNode.y - allChildFormLength;
                    //this.ErrLog("UP (%s) newPosY:%s,%s", index, newPosY, childFormNode.y);

                    //如果计算出的新坐标底层可见了,则设置子界面从顶层到底层
                    if(newPosY > -this.ScrollView.content.height){
                        
                        let childIndex = childFormComponent.GetFormProperty("ChildIndex");
                        let oldUserData = childFormComponent.GetFormProperty("UserData");

                        let newChildIndex = childIndex + childCount;
                        let userData = this.totalDataList[newChildIndex];
                        
                        if(userData){
                            childFormNode.setPositionY(newPosY);
                            childFormComponent.SetFormProperty("UserData", userData);
                            childFormComponent.SetFormProperty("ChildIndex", newChildIndex);
                            childFormComponent.OnShow();
                        }
                        else{
                            this.ErrLog("Up childIndex(%s,%s)=>(%s,%s)", childIndex, oldUserData, newChildIndex, userData);
                        }
                    }
                }
            }
        }
        this.lastContentPosY = this.ScrollView.content.y;
    },
})

module.exports = LoopScrollView;