var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        content:cc.Node,
        scroll_Left:cc.ScrollView,
        scroll_Right:cc.ScrollView,
        btnNodeGroup:cc.Node,
        pafabItem:cc.Node,
        /*
        *跑得快:0,1 仙游麻将：2,3   莆田十六张：4,5  莆田十三张：6,7
        */
    },
    InitgameBtns:function(serverPack){
        this.gameList = {};
        //this.btnNodeGroup.removeAllChildren();
        this.DestroyAllChildren(this.btnNodeGroup);
        if(undefined == serverPack.gameList ||
            '' == serverPack.gameList ||
            'null' == serverPack.gameList){
            this.gameList = {

            };
            if('' == this.gameType){
                for(let key in this.gameList){
                    this.gameType = key;
                    break;
                }
            }
       }else{
           let gameIDList=serverPack.gameList;
            for(let i=0;i<gameIDList.length;i++){
                let gamePinYin=this.ShareDefine.GametTypeID2PinYin[gameIDList[i]];
                let gameName=this.ShareDefine.GametTypeID2Name[gameIDList[i]];
                this.gameList[gamePinYin]=gameName;
                if(i==0){
                    if('' == this.gameType)
                        this.gameType=gamePinYin;
                }
            }
       }
        for(let key in this.gameList){
            let node = cc.instantiate(this.pafabItem);
            node.active = true;
            node.name = 'btn_' + key;
            node.getChildByName('icon_off').getComponent(cc.Label).string = this.gameList[key];
            node.getChildByName('icon').getChildByName('icon_on').getComponent(cc.Label).string = this.gameList[key];
            this.btnNodeGroup.addChild(node);
            this.gameType=key;
        }
        this.scroll_Left.scrollToTop();
        this.lastTag = null;
    },
    OnCreateInit: function () {
        this.curShowViewName = "";
        this.SysDataManager = app.SysDataManager();
        let allGameHelpConfig = this.SysDataManager.GetTableDict("GameHelp");
        this.ConfigList = [];
        this.gameType = '';
        for(let key in allGameHelpConfig){
            this.ConfigList.push(allGameHelpConfig[key]);
        }
    },
    OnShow: function (gameType='ddz') {
        this.FormManager.ShowForm('UITop', "UIGameHelp");
        let that=this;
        this.gameType = gameType;
        this.InitgameBtns({"gameList":app.Client.GetAllGameId()})
        this.ReShow();
        // app.NetManager().SendPack('family.CPlayerGameList',{},function(serverPack){
        //     that.InitgameBtns(serverPack);
        //     that.ReShow();
        // },function(serverPack){
        //     that.InitgameBtns(serverPack);
        //     that.ReShow();
        // });
    },
    ReShow:function(){
        if(this.gameType== "sss_zz" ||
            this.gameType== "sss_dr"){
            this.gameType = this.gameType.substring(0, 3);
        }
        if(this.lastTag)
            this.lastTag.active = false;
        let btnName = 'btn_' + this.gameType;
        let tag = this.btnNodeGroup.getChildByName(btnName).getChildByName('icon');
        tag.active = true;
        this.lastTag = tag;
        this.ShowGameRule(this.gameType);
    },
    ShowGameRule:function(ruleStr){
        this.scroll_Right.stopAutoScroll();
        if(ruleStr == ""){
            this.node.active = 0;
            this.ErrLog("没传帮助参数,无法读表");
            return;
        }
        if(this.curShowViewName == ruleStr){
            this.scroll_Right.scrollToTop();
            return;
        }
        //this.content.removeAllChildren();
        this.DestroyAllChildren(this.content);
        // if (ruleStr == "pdk") {
        //     ruleStr = "pdk_lyfj";
        // }
        this.curShowViewName = ruleStr;

        for(let i=0;i<this.ConfigList.length;i++){
            if(this.ConfigList[i].gameName == this.curShowViewName){
                if(this.ConfigList[i].img != "null"){
                    this.CreateImg(this.ConfigList[i].img,i);
                }
                else{
                    let desc = this.ConfigList[i].desc;
                    let reg = /\/n/g;
                    desc = desc.replace(reg, "\n");
                    reg = /\/t/g;
                    desc = desc.replace(reg, "\t");
                    let fontSize = this.ConfigList[i].fontSize;
                    let colorList = this.ConfigList[i].fontColor.split(",");
                    if(colorList.length != 4){
                        this.ErrLog("GameHelp Config color error id is :" + this.ConfigList[i].id);
                        continue;
                    }
                    let color = new cc.Color(colorList[0],colorList[1],colorList[2],colorList[3]);
                    this.CreateLabel(desc,fontSize,color,this.ConfigList[i].isTitle,i);
                }
            }
        }
        this.UpdateContent();
        this.scroll_Right.scrollToTop();
        this.btnNodeGroup.getChildByName('btn_'+this.gameType).zIndex=-1;
    },
    OnClose:function(){
        //this.btnNodeGroup.removeAllChildren();
        this.DestroyAllChildren(this.btnNodeGroup);
    },
    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        this.scroll_Left.stopAutoScroll();

        if(this.lastTag)
            this.lastTag.active = false;
        let tag = this.btnNodeGroup.getChildByName(btnName).getChildByName('icon');
        tag.active = true;
        this.lastTag = tag;
        let gameName = btnName.substring(('btn_').length);
        this.gameType = gameName;
        this.ShowGameRule(gameName);
    },
    CreateLabel:function(str,fontSize,color,isTitle,index){
        let node = new cc.Node();
        node.name = "label" + index;
        node.dataIndex = index;
        let curLabel = node.addComponent(cc.Label);
        curLabel.fontSize = fontSize;
        curLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        curLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        curLabel.cacheMode = cc.Label.CacheMode.CHAR;
        if(isTitle)
            curLabel.lineHeight = 60;
        else
            curLabel.lineHeight = 40;
        node.anchorX = 0;
        node.x = -(this.content.width/2);
        node.width = this.content.width;
        curLabel.enableWrapText = true;
        curLabel.isSystemFontUsed = true;
        curLabel.string = str;
        node.color = color;
        node.y = node.y - 200;
        this.content.addChild(node);
    },
    CreateImg:function(path,index){
        let self = this;
        let node = new cc.Node();
        node.name = "img" + index;
        node.dataIndex = index;
        node.addComponent(cc.Sprite);
        node.anchorX = 0;
        node.x = -(this.content.width/2);
        app.ControlManager().CreateLoadPromise(path, cc.SpriteFrame)
            .then(function(spriteFrame){
                if(!spriteFrame){
                    self.ErrLog("gameHelp CreateImg(%s) load spriteFrame fail", path);
                    return
                }
                let curSprite = node.getComponent(cc.Sprite);
                curSprite.spriteFrame = spriteFrame;
                self.content.addChild(node);
                self.UpdateContent();
            })
            .catch(function(error){
                node.destroy();
                self.ErrLog("gameHelp CreateImg(%s) error:%s", path, error.stack);
            })
    },
    UpdateContent:function(){
        let childs = this.content.children;
        if(0==childs.length)return;
        //childs.sort(this.sortChild);//creator自己排序不会去刷新ui得设置下zIndex在sortAllChildren
        let needHeight = 0;
        for(let i=0;i<childs.length;i++){
            needHeight += childs[i].height;
            childs[i].zIndex = childs[i].dataIndex;
        }
        this.content.height = needHeight + 50;
        this.content.sortAllChildren();
        this.scroll_Right.scrollToTop();
    },
    sortChild:function(a,b){
        return a.dataIndex > b.dataIndex;
    }
});