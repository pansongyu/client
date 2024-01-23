(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/za13mj/za13mj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e0fd7YnuE9NxZIxJVEkKiXW', 'za13mj_winlost_child', __filename);
// script/ui/uiGame/za13mj/za13mj_winlost_child.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function OnLoad() {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.SysDataManager = app.SysDataManager();
        this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
    },
    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        console.log("单局结算数据", setEnd, playerAll, index);
        var jin1 = setEnd.jin;
        var jin2 = 0;
        if (setEnd.jin2 > 0) {
            jin2 = setEnd.jin2;
        }
        var dPos = setEnd.dPos;
        var posResultList = setEnd["posResultList"];
        var posHuArray = new Array();
        var posCount = posResultList.length;
        for (var i = 0; i < posCount; i++) {
            var posInfo = posResultList[i];
            var pos = posInfo["pos"];
            var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        var PlayerInfo = playerAll[index];
        this.node.active = true;
        if (posResultList[index]["huType"] != "DianPao" && posResultList[index]["huType"] != "NotHu") {
            this.ShowPlayerMaPai(this.node.getChildByName('maPai'), setEnd.maList, posResultList[index]["zhongList"]);
        } else {
            this.node.getChildByName('maPai').active = false;
        }
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd.zhuaNiaoList);
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        var weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    ShowPlayerMaPai: function ShowPlayerMaPai(showNode, maList, zhongList) {
        var _this = this;

        if (maList.length == 0) {
            showNode.active = false;
            return;
        }
        showNode.active = 1;
        for (var _i = 0; _i < showNode.children.length; _i++) {
            showNode.children[_i].active = false;
        }

        var _loop = function _loop() {
            var childNode = showNode.getChildByName("card" + (i + 1));
            var childSprite = childNode.getComponent(cc.Sprite);
            if (!childSprite) {
                _this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
                return {
                    v: void 0
                };
            }
            var imageInfo = _this.IntegrateImage["EatCard_Self_" + maList[i]];
            if (!imageInfo) {
                return {
                    v: void 0
                };
            }
            childNode.active = 1;
            if (zhongList.indexOf(maList[i]) >= 0) {
                childNode.color = cc.color(255, 255, 0);
            } else {
                childNode.color = cc.color(255, 255, 255);
            }
            var imagePath = imageInfo["FilePath"];
            if (app['majiang_' + "EatCard_Self_" + maList[i]]) {
                childSprite.spriteFrame = app['majiang_' + "EatCard_Self_" + maList[i]];
            } else {
                var that = _this;
                app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
                    if (!spriteFrame) {
                        that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                        return;
                    }
                    childSprite.spriteFrame = spriteFrame;
                }).catch(function (error) {
                    that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                });
            }
        };

        for (var i = 0; i < maList.length; i++) {
            var _ret = _loop();

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
    },
    ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof huType == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点泡';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function LabelName(huType) {
        var LabelArray = [];
        LabelArray['PH'] = "平胡";
        LabelArray['AG'] = "暗杠";
        LabelArray['Hu'] = "胡";
        LabelArray['JMF'] = "中马分";
        LabelArray['MG'] = "明杠";
        LabelArray['JG'] = "接杠";
        LabelArray['DG'] = "点杠";
        LabelArray['DPF'] = "点炮分";
        LabelArray['DGF'] = "点杠分";
        LabelArray['JPF'] = "接炮分";
        LabelArray['JGF'] = "接杠分";
        LabelArray['ZMF'] = "自摸分";
        LabelArray['DF'] = "底分";
        LabelArray['QYS'] = "清一色";
        LabelArray['DDH'] = "对对胡";
        LabelArray['QXD'] = "七小对";
        LabelArray['HYS'] = "混一色";
        LabelArray['HHQXD'] = "豪华七小对";
        LabelArray['HYJ'] = "混幺九";
        LabelArray['QYJ'] = "清幺九";
        LabelArray['DSY'] = "大三元";
        LabelArray['ZYS'] = "字一色";
        LabelArray['DSX'] = "大四喜";
        LabelArray['SSY'] = "十三幺";
        LabelArray['TDH'] = "天地胡";
        LabelArray['XSY'] = "小三元";
        LabelArray['XSX'] = "小四喜";
        LabelArray['SHH'] = "双豪华";
        LabelArray['HYSDDH'] = "混一色对对胡";
        return LabelArray[huType];
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=za13mj_winlost_child.js.map
        