var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		prefab_Toggles: cc.Prefab,
	},

	//初始化
	OnCreateInit: function () {
		this.ZorderLv = 7;

		this.btnSave = this.GetWndNode("sp_room/rightFrame/btn_save");
		this.scrollTip = this.GetWndNode("sp_room/rightFrame/scrollTip");
		this.scroll_Right = this.GetWndNode("sp_room/rightFrame/mark").getComponent(cc.ScrollView);
		this.btnCreate = this.GetWndNode("sp_room/rightFrame/btn_create");
		this.node_RightLayout = this.GetWndNode("sp_room/rightFrame/mark/layout");

		this.roomcostConfig = this.SysDataManager.GetTableDict("roomcost");
		this.gameCreateConfig = this.SysDataManager.GetTableDict("gameCreate");
		this.LocalDataManager = app.LocalDataManager();
		this.FormManager = app[app.subGameName + "_FormManager"]();
		this.ComTool = app[app.subGameName + "_ComTool"]();

		this.RedColor1 = new cc.Color(0, 155, 46);
		this.RedColor2 = new cc.Color(158, 49, 16);
		this.WhiteClolor = new cc.Color(79, 79, 79);

		this.gameType = '';
		this.lastParentBtnIcon = null;
		this.lastChildBtnIcon = null;
		this.Toggles = {};

		this.addPrefabWidth = 300;
		this.rightPrefabSpacing = this.node_RightLayout.getComponent(cc.Layout).spacingY;

		this.GetWndNode("sp_room/rightFrame/mark").on(cc.Node.EventType.TOUCH_START, this.OnRightBgClick, this);

		this.RegEvent("CodeError", this.Event_CodeError, this);
	},
	Event_CodeError: function (event) {
		let codeInfo = event;
		if (codeInfo["Code"] == this.ShareDefine.CLUB_CreateCfgMax) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_CLUB_CreateCfgMax');
			return;
		}
	},
	//--------------显示函数-----------------
	OnShow: function (serverPack, gamename = app.subGameName, clubData = null) {
		this.clubWinnerPayConsume = 0;
		this.gdToggleIndex = -1;
		this.gameType = gamename;
		this.clubData = clubData;
		this.FormManager.ShowForm(app.subGameName + "_UITop", app.subGameName + "_UICreatRoom", true, true, false);

		if (clubData && '' != clubData.enableGameType)
			this.gameType = clubData.enableGameType;

		this.RefreshAllToggles();
		this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
		//设置按钮
		this.ShowBtn();
	},
	//获取创建缓存
	GetLocalConfig: function (configName, clubId, roomKey) {
		return cc.sys.localStorage.getItem(this.gameType + '_' + clubId + '_' + roomKey + '_' + configName);
	},
	SetLocalConfig: function (configName, configInfo, clubId, roomKey) {
		cc.sys.localStorage.setItem(this.gameType + '_' + clubId + '_' + roomKey + '_' + configName, configInfo);
	},
	RefreshAllToggles: function () {
		this.Toggles = {};
		this.scroll_Right.stopAutoScroll();
		this.node_RightLayout.removeAllChildren();

		let isHideZhadanfenshu = false;

		let helpIndex = 1;//01是总帮助
		for (let key in this.gameCreateConfig) {
			if (this.gameType == this.gameCreateConfig[key].GameName) {
				let node = null;
				let dataKey = this.gameCreateConfig[key].Key;
				let toggleCount = this.gameCreateConfig[key].ToggleCount;
				let AtRows = this.gameCreateConfig[key].AtRow.toString().split(',');
				if (this.clubData && 'fangfei' == dataKey) {
					toggleCount = 3;  //一个管理付，一个大赢家付
					AtRows = [1, 2, 3];
				}
				node = cc.instantiate(this.prefab_Toggles);
				//需要判断添更加多的Toggle
				let addCount = toggleCount - 1;
				if (addCount < 0)
					this.ErrLog('gameCreate Config ToggleCount error');
				else {
					for (let i = 2; i <= toggleCount; i++) {
						let prefabNode = node.getChildByName('Toggle1');
						let newNode = cc.instantiate(prefabNode);
						newNode.name = 'Toggle' + i;
						node.addChild(newNode);
					}
				}

				node.name = 'Toggles_' + dataKey;
				node.x = 10;
				let nodeHelp = node.getChildByName('btn_help');
				nodeHelp.active = false;
				if (this.gameCreateConfig[key].IsShowHelp) {
					nodeHelp.name = 'btn_help0' + helpIndex;
					nodeHelp.on('click', this.OnHelpBtnClick, this);
					nodeHelp.active = true;
					helpIndex++;
				}


				if (!this.Toggles[dataKey])
					this.Toggles[dataKey] = [];

				let fristPos = {x: 0, y: 0};
				let lastPos = {x: 0, y: 0};
				for (let i = 1; i <= toggleCount; i++) {
					let curNode = node.getChildByName('Toggle' + i);
					if (curNode) {
						//位置宽高设置下
						//记录下第一个的位置方便换行
						if (1 == i) {
							fristPos.x = curNode.x;
							fristPos.y = curNode.y;
							lastPos.x = curNode.x;
							lastPos.y = curNode.y;
						}
						else if (1 < i) {//第1个以后都是新增的
							if (AtRows[i - 2] != AtRows[i - 1]) {
								curNode.x = fristPos.x;
								curNode.y = lastPos.y - curNode.height - this.rightPrefabSpacing;
								node.height = node.height + curNode.height + this.rightPrefabSpacing;
							}
							else {
								curNode.x = lastPos.x + this.addPrefabWidth;
								curNode.y = lastPos.y;
							}
						}
						lastPos.x = curNode.x;
						lastPos.y = curNode.y;

						curNode.on(cc.Node.EventType.TOUCH_START, this.OnToggleClick, this);
						let checkNode = curNode.getChildByName('checkmark');
						let icon_selectBg = curNode.getChildByName('icon_selectBg');
						let showList = this.gameCreateConfig[key].ShowIndexs.toString().split(',');
						//尝试获取缓存
						let clubId = 0;
						let roomKey = '0';
						let linshi = null;
						if (this.clubData) {
							clubId = this.clubData.clubId;
							roomKey = this.clubData.gameIndex;
							linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, roomKey);
						}
						//第一次创建俱乐部房间没有roomKey为0
						if (!linshi)
							linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, '0');
						if (linshi) {
							let linshiList = linshi.split(',');
							for (let j = 0; j < linshiList.length; j++) {//缓存可能出BUG(配置删除了按钮数量)
								if (parseInt(linshiList[j]) > toggleCount) {
									linshiList = ['1'];
									break;
								}
							}
							showList = linshiList;
						}
						if (this.clubData && 'fangfei' == dataKey)
							showList = [3];

						//尝试获取缓存
						if (0 == this.gameCreateConfig[key].ToggleType && 1 != showList.length)
							this.ErrLog('gameCreate Config ToggleType and ShowIndexs error');

						if (1 == this.gameCreateConfig[key].ToggleType) {//多选的图片设置下(不放上面是因为路径)
							let imgPath = "texture/ui/" + app.subGameName + "_UICreateRoom/icon_checkin02";
							node.addComponent(cc.Toggle);
							this.SetNodeImageByFilePath(checkNode, imgPath);
							this.SetNodeImageByFilePath(icon_selectBg, "texture/ui/" + app.subGameName + "_UICreateRoom/icon_check02");
						}

						for (let j = 0; j < showList.length; j++) {
							if (i == parseInt(showList[j])) {
								checkNode.active = true;
								break;
							}
							else {
								checkNode.active = false;
							}
						}
						this.Toggles[dataKey].push(curNode);

					}
				}
				this.UpdateTogglesLabel(node);
				this.UpdateLabelColor(node);
				this.node_RightLayout.addChild(node);
				let line = this.scroll_Right.node.getChildByName('line');
				let addline = cc.instantiate(line);
				addline.active = true;
				this.node_RightLayout.addChild(addline);
			}
		}
		this.setHelpBtnPos();
		this.scroll_Right.scrollToTop();
		//如果可以滚动，显示滚动提示节点
		if (this.node_RightLayout.height > this.scroll_Right.node.height) {
			this.scrollTip.active = true;
		} else {
			this.scrollTip.active = false;
		}
	},

	OnClose: function () {

	},
	ShowBtn: function () {
		if (this.clubData) {
			this.btnCreate.active = false;
			this.btnSave.active = false;
			if (0 == this.clubData.gameIndex)
				this.btnCreate.active = true;
			else
				this.btnSave.active = true;
		}
		else {
			this.btnCreate.active = true;
			this.btnSave.active = false;

		}
	},
	UpdateTogglesLabel: function (TogglesNode) {
		let curKey = TogglesNode.name.substring(('Toggles_').length, TogglesNode.name.length);
		let reg = /\/s/g;
		for (let key in this.gameCreateConfig) {
			if (this.gameType == this.gameCreateConfig[key].GameName) {
				if (curKey == this.gameCreateConfig[key].Key) {
					let AAfangfeiDatas = [];
					let WinfangfeiDatas = [];
					let FangZhufangfeiDatas = [];
					let clubFangFeiDatas = [];
					let clubWinFangFeiDatas = [];
					let title = this.gameCreateConfig[key].Title.replace(reg, ' ');
					TogglesNode.getChildByName('title').getComponent(cc.Label).string = title;
					let descList = [];
					if ('jushu' != curKey) {//局数读roomcost
						descList = this.gameCreateConfig[key].ToggleDesc.split(',');
						if (this.clubData && 'fangfei' == curKey)
							descList = ['管理付', 'AA付', '胜家付'];
						if (descList.length != TogglesNode.children.length - 2) {//减去标题和帮助按钮
							this.ErrLog('gameCreate config ToggleDesc and Toggle count error');
							break;
						}
					}
					let jushuIndex = -1;
					let renshuIndex = -1;
					let renshu = [];//0表示读房主支付配置
					if ('renshu' == curKey || 'fangfei' == curKey || 'jushu' == curKey) {

						let publicCosts = this.getCostData(renshu);

						if (this.Toggles['renshu'])
							renshu = this.getCurSelectRenShu();

						let SpiltCosts = this.getCostData(renshu);
						let curCostData = null;
						if (0 == renshu.length) {
							curCostData = publicCosts;
						}
						else {
							curCostData = SpiltCosts;
						}
						if (this.Toggles['jushu']) {
							jushuIndex = 0;
							for (let i = 0; i < this.Toggles['jushu'].length; i++) {
								let mark = this.Toggles['jushu'][i].getChildByName('checkmark').active;
								if (mark) {
									jushuIndex = i;
									break;
								}
								jushuIndex++;
							}
							for (let i = 0; i < curCostData.length; i++) {
								if (curCostData[i].SetCount == 311) {
									// let kefen = curCostData[i].SetCount%300;
									this.Toggles['jushu'][i].getChildByName('label').getComponent(cc.Label).string = "1课:100分";
								} else {
									this.Toggles['jushu'][i].getChildByName('label').getComponent(cc.Label).string = curCostData[i].SetCount + '局';
								}

							}
						}
						if (this.Toggles['fangfei'] && -1 != jushuIndex) {
							if (jushuIndex < publicCosts.length) {
								AAfangfeiDatas.push(publicCosts[jushuIndex].AaCostCount);
								WinfangfeiDatas.push(publicCosts[jushuIndex].WinCostCount);
								FangZhufangfeiDatas.push(publicCosts[jushuIndex].CostCount);

								clubFangFeiDatas.push(publicCosts[jushuIndex].ClubCount);
								clubWinFangFeiDatas.push(publicCosts[jushuIndex].ClubWinCostCount);
							}
							if (jushuIndex < SpiltCosts.length) {
								AAfangfeiDatas.push(SpiltCosts[jushuIndex].AaCostCount);
								WinfangfeiDatas.push(SpiltCosts[jushuIndex].WinCostCount);
								FangZhufangfeiDatas.push(SpiltCosts[jushuIndex].CostCount);

								clubFangFeiDatas.push(SpiltCosts[jushuIndex].ClubCount);
								clubWinFangFeiDatas.push(SpiltCosts[jushuIndex].ClubWinCostCount);
							}
						}
					}
					if ('jushu' != curKey) {
						let descInde = 0;
						for (let i = 0; i < TogglesNode.children.length; i++) {
							if (TogglesNode.children[i].name.startsWith('Toggle')) {
								TogglesNode.children[i].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
								descInde++;
							}
						}
					}

					if (0 != AAfangfeiDatas.length) {
						let ffNodes = this.Toggles['fangfei'];
						for (let s = 0; s < ffNodes.length; s++) {
							let needNode = ffNodes[s].getChildByName('fangfeiNode');
							needNode.active = true;
							if (this.clubData == null) {
								if (0 == s)
									needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1];
								else if (1 == s) {
									needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + AAfangfeiDatas[AAfangfeiDatas.length - 1];
									needNode.parent.active = false;
								}
								else {
									needNode.parent.x = 550;
									needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + WinfangfeiDatas[WinfangfeiDatas.length - 1];
								}
							} else {
								if (0 == s)
									needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + renshu[0] * AAfangfeiDatas[AAfangfeiDatas.length - 1];
								else if (1 == s) {
									needNode.parent.active = false;
									needNode.getChildByName('icon').active = false;
									needNode.getChildByName('icon_qk').active = true;
									needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubFangFeiDatas[clubFangFeiDatas.length - 1];
									needNode.getChildByName('needNum').clubWinnerPayConsume = clubFangFeiDatas[clubFangFeiDatas.length - 1];
									ffNodes[s].getChildByName('editbox').active = true;
								} else {
									needNode.parent.x = 550;
									needNode.getChildByName('icon').active = false;
									needNode.getChildByName('icon_qk').active = true;
									needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
									needNode.getChildByName('needNum').clubWinnerPayConsume = clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
									ffNodes[s].getChildByName('editbox').active = true;
								}
							}
						}
					}
				}
			}
		}
	},
	UpdateLabelColor: function (TogglesNode) {
		for (let i = 0; i < TogglesNode.children.length; i++) {
			let toggleNode = TogglesNode.children[i];
			if (toggleNode.name.startsWith('Toggle')) {
				let isChecked = toggleNode.getChildByName('checkmark').active;
				for (let j = 0; j < toggleNode.children.length; j++) {
					let label = toggleNode.children[j].getComponent(cc.Label);
					if (null != label) {
						if (isChecked) {
							toggleNode.children[j].color = this.RedColor1;
						}
						else {
							toggleNode.children[j].color = this.RedColor2;
						}
					}
					let fangkaNode = toggleNode.getChildByName('fangfeiNode');
					if (fangkaNode.active) {
						label = null;
						for (let s = 0; s < fangkaNode.children.length; s++) {
							label = fangkaNode.children[s].getComponent(cc.Label);
							if (null != label) {
								if (isChecked) {
									fangkaNode.children[s].color = this.RedColor1;
								}
								else {
									fangkaNode.children[s].color = this.RedColor2;
								}
							}
						}
					}
				}
			}
		}
	},
	setHelpBtnPos: function () {//垃圾label控件自适应宽度有BUG草泥马
		let helpNode = null;
		let lastNode = null;
		let Toggles = null;
		for (let j = 0; j < this.node_RightLayout.children.length; j++) {
			if (j % 2 == 1) {
				continue;
			}
			Toggles = this.node_RightLayout.children[j];
			helpNode = null;
			lastNode = null;
			for (let i = 0; i < Toggles.children.length; i++) {
				if (Toggles.children[i].name.startsWith('Toggle'))
					lastNode = Toggles.children[i];
				else if (Toggles.children[i].name.startsWith('btn_help'))
					helpNode = Toggles.children[i];

				if (helpNode && helpNode.active && lastNode) {
					let labelNode = lastNode.getChildByName('label');
					let str = lastNode.getChildByName('label').getComponent(cc.Label);
					let maxWidth = 0;
					let label = lastNode.getChildByName('label');
					if (label) {
						maxWidth = label.x + label.width;
						label = null;
					}
					let fangfeiNode = lastNode.getChildByName('fangfeiNode');
					if (fangfeiNode.active) {
						for (let n = 0; n < fangfeiNode.children.length; n++) {
							let label = fangfeiNode.children[n].getComponent(cc.Label);
							if (label) {
								maxWidth = fangfeiNode.x + label.node.x + label.node.width;
								label = null;
							}
						}
					}
					helpNode.x = lastNode.x + maxWidth + 60;
					helpNode.y = lastNode.y;
				}
			}
		}
	},
	getCostData: function (renshu) {//renshu =0 房主支付
		let costs = [];
		if (renshu.length != 2) {
			return costs;
		}
		for (let key in this.roomcostConfig) {
			if (this.gameType.toUpperCase() == this.roomcostConfig[key].GameType &&
				parseInt(renshu[0]) == this.roomcostConfig[key].PeopleMin &&
				parseInt(renshu[1]) == this.roomcostConfig[key].PeopleMax) {
				costs.push(this.roomcostConfig[key]);
			}

		}
		if (0 == costs.length) {
			// this.ErrLog('roomcost Config error');
		}
		return costs;
	},
	OnClickForm: function () {
		this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
	},

	//---------点击函数---------------------
	OnHelpBtnClick: function (event) {
		let btnNode = event.target;
		let btnName = btnNode.name;
		if (btnName.startsWith("btn_help")) {
			this.Click_btn_help(btnName, btnNode);
		}
	},
	OnToggleClick: function (event) {
		this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
		let toggles = event.target.parent;
		let toggle = event.target;
		let key = toggles.name.substring(('Toggles_').length, toggles.name.length);
		let toggleIndex = parseInt(toggle.name.substring(('Toggle').length, toggle.name.length)) - 1;
		let needClearList = [];
		let needShowIndexList = [];
		needClearList = this.Toggles[key];
		needShowIndexList.push(toggleIndex);
		if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
			this.ClearToggleCheck(needClearList, needShowIndexList);
			this.UpdateLabelColor(toggles);
			this.UpdateTogglesLabel(toggles);
			return;
		}
		else if ('kexuanwanfa' == key) {
			// if(toggleIndex <2){
			//    this.ClearToggleCheck(this.Toggles['fengding'],[1]);
			//    this.UpdateLabelColor(this.Toggles['fengding'][1].parent);
			// }
		} else if ('fengding' == key) {
			// if(toggleIndex==0){
			//    if(this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active ==false){
			//         this.ShowSysMsg('梓埠清混才能选择封顶');
			//         return;
			//    }
			// }
		}
		else {

		}
		if (toggles.getComponent(cc.Toggle)) {//复选框
			needShowIndexList = [];
			for (let i = 0; i < needClearList.length; i++) {
				let mark = needClearList[i].getChildByName('checkmark').active;
				//如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
				if (mark && i != toggleIndex) {
					needShowIndexList.push(i);
				}
				//如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
				else if (!mark && i == toggleIndex) {
					needShowIndexList.push(i);
				}
			}
		}
		this.ClearToggleCheck(needClearList, needShowIndexList);
		this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
	},
	ClearToggleCheck: function (toggles, showIndexList) {
		for (let i = 0; i < toggles.length; i++)
			toggles[i].getChildByName('checkmark').active = false;

		if (showIndexList) {
			for (let i = 0; i < toggles.length; i++) {
				for (let j = 0; j < showIndexList.length; j++) {
					if (i == showIndexList[j])
						toggles[i].getChildByName('checkmark').active = true;
				}
			}
		}
	},
	OnRightBgClick: function (event) {
		this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
	},
	//滑动结束
	OnScrollEnded: function () {
		this.scrollTip.active = false;
	},
	OnClick: function (btnName, btnNode) {
		if ('btn_create' == btnName) {
			this.Click_btn_create(1);
			this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
		}
		else if ('btn_save' == btnName) {
			this.Click_btn_create(3);
			this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
		}
		else if ('btn_close' == btnName) {
			this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
			this.CloseForm();
		}
		else if ('rightFrame' == btnName)
			this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
		else if (btnName == "btn_help01") {
			this.FormManager.ShowForm(app.subGameName + "_UIGameHelp");
			// this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
		}
		else if (btnName.startsWith("Toggle")) {
			this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
		}
		else {
			this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
			this.ErrLog("OnClick(%s) not find", btnName);
		}

	},

	Click_btn_help: function (btnName, btnNode) {
		let that = this;
		let gameType = this.gameType;
		let curIndex = btnName.substring(('btn_help0').length, btnName.length);
		let msgID = 'UIMessageTip_Help' + curIndex + '_' + gameType
		this.FormManager.ShowForm(app.subGameName + "_UIMessageTip", msgID)
			.then(function (formComponent) {
				let wndSize = formComponent.GetMsgWndSize();
				let btnNodeParentPosition = btnNode.parent.convertToWorldSpaceAR(btnNode.getPosition());
				let btnX = btnNodeParentPosition.x - that.node.width / 2 - wndSize.width / 2 - btnNode.width / 2;
				let btnY = 0;
				if (wndSize.height > that.node.height / 2)
					btnY = that.node.convertToWorldSpaceAR(that.node.getPosition()).y - that.node.height / 2;
				else
					btnY = btnNodeParentPosition.y - that.node.height / 2;
				-wndSize.height / 2 + btnNode.height / 2;
				formComponent.SetFormPosition(cc.v2(btnX, btnY));
			})
			.catch(function (error) {
				that.ErrLog("error:%s", error.stack);
			})
	},
	close: function () {
		this.FormManager.CloseForm(app.subGameName + "_UICreatRoom");
	},
	Click_btn_buy: function () {
		let clientConfig = app[app.subGameName + "Client"].GetClientConfig();
		if (app.PackDefine.APPLE_CHECK == clientConfig["appPackType"]) return
		this.FormManager.ShowForm("UIStore");
	},
	getCurSelectRenShu: function () {
		let renshu = 0;
		let needIndex = -1;
		if (this.Toggles['renshu']) {
			for (let i = 0; i < this.Toggles['renshu'].length; i++) {
				let toggle = this.Toggles['renshu'][i].getChildByName('checkmark');
				if (toggle.active) {
					needIndex = i;
					break;
				}
			}
		}
		for (let key in this.gameCreateConfig) {
			if (this.gameType == this.gameCreateConfig[key].GameName && 'renshu' == this.gameCreateConfig[key].Key) {
				let AtRows = this.gameCreateConfig[key].ToggleDesc.toString().split(',');
				// return AtRows[needIndex].replace('人','').replace('2-','');
				let AtRowArr = [];
				AtRowArr = AtRows[needIndex].replace('人', '').split('-');
				if (AtRowArr.length == 1) {
					//只是固定人数，没有配置浮动人数，最大最小都一样
					AtRowArr.push(AtRowArr[0]);
				}
				return AtRowArr;
			}
		}
	},
	//创建房间
	Click_btn_create: function (createType) {
		let isSpiltRoomCard = this.GetIdxByKey('fangfei');
		let renshu = [];
		if (isSpiltRoomCard) {
			renshu = this.getCurSelectRenShu();
		}
		renshu = this.getCurSelectRenShu();//发给服务器人数用选的
		let needCostData = this.getCostData(renshu);
		if (!needCostData) {
			this.ErrLog('Click_btn_create Not CostData');
			return;
		}
		let hasRoomCard = app[app.subGameName + "_HeroManager"]().GetHeroProperty("roomCard");

		let jushuIndex = this.GetIdxByKey('jushu');
		if (-1 == jushuIndex || jushuIndex >= needCostData.length) {
			this.ErrLog('Click_btn_create error -1 == jushuIndex || jushuIndex >= needCostData.length');
			return;
		}
		let costCoun = 0;
		if (isSpiltRoomCard == 1) {
			costCoun = needCostData[jushuIndex].AaCostCount;
		} else {

			costCoun = needCostData[jushuIndex].CostCount;
		}
		if (this.clubData == null) {
			if (hasRoomCard < costCoun) {//金币不足
				let desc = app[app.subGameName + "_SysNotifyManager"]().GetSysMsgContentByMsgID("MSG_NotRoomCard");
				app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
				app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMessage", null, this.ShareDefine.ConfirmBuyGoTo, 0, 0, desc)
				return;
			}
		}
		let setCount = needCostData[jushuIndex].SetCount;
		let sendPack = {};
		if (app.subGameName == this.gameType) {
			let beishu = this.GetIdxByKey("beishu");
			let jiesuan = this.GetIdxByKey("jiesuan");
			let xianShi = this.GetIdxByKey("xianShi");
			let jiesan = this.GetIdxByKey("jiesan");
			let gaoji = [];
			for (let i = 0; i < this.Toggles["gaoji"].length; i++) {
				if (this.Toggles["gaoji"][i].getChildByName("checkmark").active) {
					gaoji.push(i);
				}
			}
			let kexuanwanfa = [];
			for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
				if (this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active) {
					kexuanwanfa.push(i);
				}
			}
			sendPack = {
				"beishu": beishu,
				"jiesuan": jiesuan,
				"xianShi": xianShi,
				"jiesan": jiesan,
				"kexuanwanfa": kexuanwanfa,
				"playerMinNum": renshu[0],
				"playerNum": renshu[1],
				"setCount": setCount,
				"paymentRoomCardType": isSpiltRoomCard,
				"gaoji": gaoji,
				"newQuanZhou":0
			};
		}

		let roomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		//记录到本地缓存
		for (var item in sendPack) {
			let configData = sendPack[item];
			let dataType = typeof(configData);
			if (dataType == 'object') {
				let linshi2 = '0';
				for (let i = 0; i < configData.length; i++) {
					if (i == 0) {
						linshi2 = configData[0] + 1;
					} else {
						linshi2 = linshi2 + ',' + (configData[i] + 1);
					}
				}
				configData = linshi2;
			} else {
				if (item == 'playerNum') {
					item = 'renshu';
				} else if (item == 'setCount') {
					item = 'jushu';
				} else if (item == 'paymentRoomCardType') {
					item = 'fangfei';
				} else if (item == 'cardNum') {
					item = 'shoupai';
				} else if (item == 'resultCalc') {
					item = 'jiesuan';
				} else if (item == 'maxAddDouble') {
					item = 'fengdingbeishu';
				}
				configData = this.GetIdxByKey(item) + 1;
			}
			let clubId = 0;
			let roomKey = '0';
			if (this.clubData) {
				clubId = this.clubData.clubId;
				roomKey = this.clubData.gameIndex;
			}
			this.SetLocalConfig(item, configData, clubId, roomKey);
		}
		//记录到本地缓存
		if (roomMgr) {
			if (1 == createType || 3 == createType) {
				if (this.clubData) {
					sendPack.clubId = this.clubData.clubId;
					sendPack.gameIndex = this.clubData.gameIndex;
					if (this.clubData != null) {
						if (isSpiltRoomCard == 0) {
							this.clubWinnerPayConsume = 0;
						} else if (isSpiltRoomCard == 1) {
							let default1 = this.Toggles['fangfei'][1].getChildByName('fangfeiNode').getChildByName('needNum').clubWinnerPayConsume;
							let new1 = parseInt(this.Toggles['fangfei'][1].getChildByName('editbox').getComponent(cc.EditBox).string);
							if (new1 > 0 && new1 > default1) {
								this.clubWinnerPayConsume = new1;
							} else {
								this.clubWinnerPayConsume = default1;
							}
						} else if (isSpiltRoomCard == 2) {
							let default2 = this.Toggles['fangfei'][2].getChildByName('fangfeiNode').getChildByName('needNum').clubWinnerPayConsume;
							let new2 = parseInt(this.Toggles['fangfei'][2].getChildByName('editbox').getComponent(cc.EditBox).string);
							if (new2 > 0 && new2 > default2) {
								this.clubWinnerPayConsume = new2;
							} else {
								this.clubWinnerPayConsume = default2;
							}
						}
					} else {
						this.clubWinnerPayConsume = 0;
					}
					sendPack.clubWinnerPayConsume = this.clubWinnerPayConsume;
					if (this.clubWinnerPayConsume > 0) {
						sendPack.clubCostType = 1;
					} else {
						sendPack.clubCostType = 0;
					}
					createType = 3;
				}
			}
			sendPack.createType = createType;
			roomMgr.SendCreateRoom(sendPack);
			app[app.subGameName + "Client"].SetGameType(this.gameType);
			this.LocalDataManager.SetConfigProperty("SysSetting", "LastGameType", this.gameType);
		}
	},
	GetIdxByKey: function (key) {
		if (!this.Toggles[key])
			return -1;
		for (let i = 0; i < this.Toggles[key].length; i++) {
			let mark = this.Toggles[key][i].getChildByName('checkmark').active;
			if (mark)
				return i;
		}
	},
	OnConFirm: function (clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			return
		}
		if ("goBuyCard" == msgID) {
			// let clientConfig = app[app.subGameName + "Client"].GetClientConfig();
			// if (app.PackDefine.APPLE_CHECK == clientConfig["appPackType"]) return
			// app[app.subGameName + "_FormManager"]().ShowForm("UIStore");
			return;
		}
	}
});