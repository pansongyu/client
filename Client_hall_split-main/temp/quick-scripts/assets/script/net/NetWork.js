(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/net/NetWork.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd06a7ZaCwxFq4knbhB7NpIO', 'NetWork', __filename);
// script/net/NetWork.js

'use strict';

var emitter = require('emitter');

var app = require('app');

var Request = app.BaseClass.extend({
	Init: function Init() {
		this.id = null;
		this.event = null;
		this.param = null;
		this.callback = null; //(msg: any) => void;
		this.errcb = null; //(head: any, code: number, msg: string) => void;
	}
});

var MessageType = {
	None: 0, // 空白定义
	/**
  * 对request的反馈，无需回包
  */
	Response: 1,
	/**
  * 向其他服务器请求，必定回包
  */
	Request: 2,
	/**
  * 向其他服务器发送监控信息，无需回包
  */
	Notify: 3
};

var copyArray = function copyArray(dest, doffset, src, soffset, length) {
	if ('function' === typeof src.copy) {
		// Buffer
		src.copy(dest, doffset, soffset, soffset + length);
	} else {
		// Uint8Array
		for (var index = 0; index < length; index++) {
			dest[doffset++] = src[soffset++];
		}
	}
};

var EgretReadByteArray = app.BaseClass.extend({
	Init: function Init(buffer) {
		this.buffer = buffer;
		this.dataview = new DataView(this.buffer);
		this.offset = 0;
	},

	readByte: function readByte() {
		var ret = this.dataview.getUint8(this.offset);
		this.offset += 1;
		return ret;
	},

	readShort: function readShort() {
		var ret = this.dataview.getInt16(this.offset);
		this.offset += 2;
		return ret;
	},

	readInt: function readInt() {
		var ret = this.dataview.getInt32(this.offset);
		this.offset += 4;
		return ret;
	},

	readUTF: function readUTF() {
		var length = this.dataview.getInt16(this.offset);
		this.offset += 2;
		var tempBuffer = this.buffer.slice(this.offset, this.offset + length);
		//cc.error("length",this.offset, length, tempBuffer, tempBuffer.byteLength);
		this.offset += length;
		var ret = this.strdecode(tempBuffer);
		return ret;
	},

	// // ArrayBuffer转为字符串，参数为ArrayBuffer对象
	// ab2str:function(buf) {
	//     return String.fromCharCode.apply(null, new Uint16Array(buf));
	// },

	/**
   * client decode
   * msg String data
   * return Message Object
   */
	strdecode: function strdecode(buffer) {
		var bytes = new Uint8Array(buffer);
		var array = [];
		var offset = 0;
		var charCode = 0;
		var end = bytes.length;
		//cc.error('befor Protocol.strdecode length:', end);
		var hasEot = false;
		while (offset < end) {
			try {
				if (bytes[offset] < 128) {
					charCode = bytes[offset];
					offset += 1;
					if (charCode == 4) {
						cc.error('find strdecode eot');
						hasEot = true;
						continue;
					}
				} else if (bytes[offset] < 224) {
					charCode = ((bytes[offset] & 0x3f) << 6) + (bytes[offset + 1] & 0x3f);
					offset += 2;
				} else {
					charCode = ((bytes[offset] & 0x0f) << 12) + ((bytes[offset + 1] & 0x3f) << 6) + (bytes[offset + 2] & 0x3f);
					offset += 3;
				}
				array.push(charCode);
			} catch (e) {
				cc.error(e);
			}
		}
		if (hasEot) array.push("}");

		var ret = String.fromCharCode.apply(null, array);
		//cc.error('after Protocol.strdecode length:', array.length, array, ret);
		return ret;
	}
});

var EgretWriteByteArray = app.BaseClass.extend({
	Init: function Init(length) {
		this.buffer = new ArrayBuffer(length);
		this.dataview = new DataView(this.buffer);
		this.offset = 0;
	},

	getBuffer: function getBuffer() {
		//cc.error(this.buffer.byteLength, this.offset);
		var retBuffer = this.buffer.slice(0, this.offset);
		//cc.error("getBuffer", retBuffer);
		return this.buffer;
	},

	writeByte: function writeByte(value) {
		var ret = this.dataview.setUint8(this.offset, value);
		this.offset += 1;
		//cc.error('offset:', this.offset);
	},

	writeShort: function writeShort(value) {
		var ret = this.dataview.setInt16(this.offset, value);
		this.offset += 2;
		//cc.error('offset:', this.offset);
	},

	writeInt: function writeInt(value) {
		var ret = this.dataview.setInt32(this.offset, value);
		this.offset += 4;
		//cc.error('offset:', this.offset);
	},

	writeUTF: function writeUTF(str) {
		//cc.error(this.dataview, str, str.length);
		var strBuffer = this.strencode(str);
		this.writeShort(strBuffer.length);
		copyArray(new Uint8Array(this.buffer), this.offset, strBuffer, 0, strBuffer.length);
		this.offset += strBuffer.length;

		//cc.error(this.dataview, strBuffer.length);
		//cc.error('offset:', this.offset);
	},

	strencode: function strencode(str) {
		var byteArray = new Uint8Array(str.length * 3);
		var offset = 0;
		for (var i = 0; i < str.length; i++) {
			var charCode = str.charCodeAt(i);
			var codes = null;
			if (charCode <= 0x7f) {
				codes = [charCode];
			} else if (charCode <= 0x7ff) {
				codes = [0xc0 | charCode >> 6, 0x80 | charCode & 0x3f];
			} else {
				codes = [0xe0 | charCode >> 12, 0x80 | (charCode & 0xfc0) >> 6, 0x80 | charCode & 0x3f];
			}
			for (var j = 0; j < codes.length; j++) {
				byteArray[offset] = codes[j];
				++offset;
			}
		}
		var _buffer = new Uint8Array(offset);
		copyArray(_buffer, 0, byteArray, 0, offset);
		return _buffer;
	}
});

var NetWork = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = "NetWork";
		// this.isTestWss = true;
		this.isTestWss = false;
		this.ShareDefine = app.ShareDefine();

		//最大允许尝试重连次数
		this.AllowReConnectCount = 3;

		//事件分发模块
		this.emitter = new emitter();

		//当前连接
		this.socket = null;
		this.isConnectIng = false; //websocket正在连接中(js websoket有bug用自定义的)
		//缓存的请求对象列表
		this.cacheRequestList = [];

		//连接服务器IP地址
		this.host = "127.0.0.1";
		this.port = 9999;
		this.url = ['ws://', this.host, ':', this.port].join("");

		//延迟重连的事件ID
		this.reConnectTimeID = 0;

		this.bDisconnectByLogout = false;
		//连接成功回调
		this.handshakeCallback = null;

		this.eventCallback = null;

		//大包
		this.BigPack = new Array();

		this.OnReload();
	},

	//是否开发者模式
	IsDevelopment: function IsDevelopment() {
		return app.ShareDefine().IsDevelopment;
	},

	OnReload: function OnReload() {

		//发送的封包堆积字典
		this.requests = {}; // id：req
		//封包序列号
		this.requestid = 1;

		//发包失败缓存列表
		this.losts = [];

		//是否在处理重连中
		this.isReconnecting = false;
		//是否在连接中
		this.isConnectIng = false;
		//客户端当前连接登录的accountID
		this.connectAccountID = 0;

		if (this.reConnectTimeID) {
			clearTimeout(this.reConnectTimeID);
			this.reConnectTimeID = 0;
		}

		//尝试重连次数
		this.tryReConnectCount = 0;
	},

	//初始化连接的玩家账号
	InitConnectInfo: function InitConnectInfo(accountID) {
		//记录客户端当前连接登录的accountID
		this.connectAccountID = accountID;
	},

	//初始化连接
	InitWebSocket: function InitWebSocket(host, port, eventCallback, handshakeCallback) {
		console.log("初始化连接socket");
		this.SysLog("InitWebSocket(%s:%s)", host, port, "w-g");

		this.handshakeCallback = handshakeCallback;
		this.eventCallback = eventCallback;
		if (this.isTestWss) {
			port = 9988;
		}
		var readyState = 0;
		if (this.Connected() && this.socket) {
			readyState = this.socket.readyState;
		}

		//已经连接成功,直接回调握手函数
		if (this.Connected() && this.socket && readyState == 1 && this.host == host && this.port == port) {
			this.Log("连接未断开");
			this.handshakeCallback(false);
		} else {
			this.host = host;
			this.port = port;
			if (this.isTestWss) {
				this.url = ['wss://', host, ':', port].join("");
			} else {
				this.url = ['ws://', host, ':', port].join("");
			}
			// this.url = ['ws://', host, ':', port].join("");
			this.Connect();
		}
	},

	// 连接Java服务器
	Connect: function Connect() {
		if (app.ControlManager().CheckVpnUsed(this.Connect.bind(this))) {
			return;
		}

		if (this.socket) {
			console.log("socket连接已存在，需先关闭");
			if (this.socket.close) {
				this.socket.close();
			} else if (this.socket.disconnect) {
				this.socket.disconnect();
			}
			this.socket = null;
		}
		var url = this.url;

		this.socket = new WebSocket(this.url);
		console.log("连接Java服务器:" + this.url);
		this.SysLog("开始连接:%s 是否重连(%s)", this.url, this.isReconnecting, "w-g");
		this.socket.binaryType = 'arraybuffer';
		this.socket.onopen = this.OnOpen.bind(this);
		this.socket.onmessage = this.OnMessage.bind(this);
		this.socket.onerror = this.OnError.bind(this);
		this.socket.onclose = this.OnClose.bind(this); // 服务器断开
		var that = this;
		setTimeout(function () {
			if (that.isConnectIng == true) {
				console.log("setTimeout 已经检测到连接成功");
			} else {
				that.OnClose({ "type": 'timeout', "target": { "URL": url } });
			}
		}, 2000);
	},

	//发起重连
	ReConnect: function ReConnect() {
		if (app.ControlManager().IsOpenVpn()) {
			return;
		}

		this.Disconnect();

		//玩家登录服务器后,才需要建立重连,否则不重连,登录过程当断网处理,否则登录请求一直重连
		if (this.connectAccountID) {
			if (this.isReconnecting) {
				console.log("已经在重连中,不需要尝试重连");
				return true;
			}
			console.log("重连中...");
			this.isReconnecting = true;
			this.Connect();
			app.Client.OnEvent("ModalLayer", "StartReConnect");
			return true;
		} else {
			this.SysLog("没有玩家建立连接,不需要重连");
			this.isReconnecting = false;
			return false;
		}
	},

	//创建一个新的封包事件结构体
	GetNewRequest: function GetNewRequest() {

		var req = this.cacheRequestList.pop();
		if (!req) {
			req = new Request();
		}
		req.id = this.requestid++;

		//修改请求头ID,避免超过字段值
		if (this.requestid >= 60000) {
			this.requestid = 1;
		}
		return req;
	},

	//是否连接中
	Connected: function Connected() {
		return this.isConnectIng;
	},
	ReConnectByTipSureBtn: function ReConnectByTipSureBtn() {
		if (this.reConnectTimeID) clearTimeout(this.reConnectTimeID);

		this.tryReConnectCount = 0;
		this.reConnectTimeID = 0;
		var that = this;
		this.reConnectTimeID = setTimeout(function () {
			that.isReconnecting = false;
			that.ReConnect();
		}, 100);
	},
	//----------回掉函数------------------
	//连接开启
	OnOpen: function OnOpen(event) {
		if (this.isTestWss) {
			console.error("WebSocket 连接开启 OnOpen: ", event);
		}
		//如果是重连成功回调
		if (this.isReconnecting) {
			this.SysLog("重连成功 OnOpen(%s)", this.url, "w-g");
		} else {
			this.SysLog("连接成功 OnOpen(%s)", this.url, "w-g");
		}

		if (this.reConnectTimeID) {
			clearTimeout(this.reConnectTimeID);
			this.reConnectTimeID = 0;
		}

		this.isConnectIng = true;
		this.tryReConnectCount = 0;
		//连接成功回调
		if (this.handshakeCallback) {
			//回调确认是重连在置为false
			this.handshakeCallback(this.isReconnecting);
		}
		this.isReconnecting = false;
	},

	//断开连接
	Disconnect: function Disconnect() {
		var byLogout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		if (this.isTestWss) {
			console.error("WebSocket 断开连接:  ", byLogout);
		}
		if (this.isConnectIng && this.socket) {
			if (this.socket.close) {
				this.socket.close();
			} else if (this.socket.disconnect) {
				this.socket.disconnect();
			}
			this.SysLog("Disconnect(%s)", this.url);
			this.socket = null;
			this.isConnectIng = false;
			if (byLogout) this.bDisconnectByLogout = true;
		}
	},

	//接受到数据
	OnMessage: function OnMessage(event) {
		var byte = "";
		var messageType = 0;
		var srcType = 0;
		var srcId = 0;
		var descType = 0;
		var descId = 0;
		var eventName = "";
		var sequence = 0;
		var errorCode = 0;
		var strBody = "";
		var body = {};
		var allPack = 0;
		var nowPack = 0;

		try {
			byte = new EgretReadByteArray(event.data);

			messageType = byte.readByte();
			srcType = byte.readByte();
			srcId = (byte.readInt() << 32) + byte.readInt();
			descType = byte.readByte();
			descId = (byte.readInt() << 32) + byte.readInt();

			allPack = byte.readShort();
			nowPack = byte.readShort();
			eventName = byte.readUTF().toLocaleLowerCase();

			sequence = byte.readShort();
			errorCode = byte.readShort();
			strBody = byte.readUTF();

			if (allPack > 1) {
				this.BigPack[nowPack] = strBody;
				if (this.BigPack.length == allPack) {
					var BigstrBody = '';
					for (var i = 0; i < allPack; i++) {
						BigstrBody = BigstrBody + this.BigPack[i];
					};
					strBody = BigstrBody;
					this.BigPack = [];
				} else {
					this.ErrLog("NetWork allPack error length:%s", allPack);
					return;
				}
			}

			if (errorCode) {
				body = { "Msg": strBody };
			} else {
				body = JSON.parse(strBody);
			}

			this.Log("OnMessage(%s,%s,%s,%s,%s)", messageType, srcType, srcId, descType, descId);
		} catch (error) {
			this.ErrLog("OnMessage error:%s", error.stack);
			return;
		}

		if (this.IsDevelopment()) {
			this.NetLog("[Recv](%s,%s,%s):", sequence, eventName, errorCode, body, "b-gb");
		}

		if (errorCode) {
			this.eventCallback("OnCodeError", [eventName, errorCode, body]);
		} else {
			//更新心跳包
			app.Client.UpdateHearTime();
			this.eventCallback("OnReceive", [eventName, body]);
		}

		var req = this.requests[sequence];
		//请求事件可能注册了回调函数
		if (!req) {
			return;
		}
		//单次回调事件,删除记录
		delete this.requests[sequence];

		try {
			if (errorCode) {
				var errorFunc = req.errcb;
				if (errorFunc) {
					errorFunc(body);
				}
			} else if (req.callback) {
				req.callback(body);
			}
		} catch (error) {
			this.ErrLog("error:%s", error.stack, body);
		}
	},
	UpdateAccessPoint: function UpdateAccessPoint() {
		app.HeroAccountManager().UpdateAccessPoint();
		var clientConfig = app.Client.GetClientConfig();
		var gameServerIP = clientConfig["GameServerIP"];
		var gameServerPort = clientConfig["GameServerPort"];
		//换节点
		this.url = ['ws://', gameServerIP, ':', gameServerPort].join("");
	},
	//连接错误
	OnError: function OnError(event) {
		if (this.isTestWss) {
			console.error("WebSocket 连接错误 OnError: ", event);
		}
		if (this.url != event.target.URL) {
			return;
		}
		//如果重连中,网络连接失败
		if (this.isReconnecting) {
			this.ErrLog("大厅重连失败");
			//如果有启动重连定时时间,清除掉回调
			if (this.reConnectTimeID) {
				clearTimeout(this.reConnectTimeID);
			}
			this.tryReConnectCount++;
			var that = this;
			this.reConnectTimeID = setTimeout(function () {
				that.UpdateAccessPoint();
				that.isReconnecting = false;
				that.ReConnect();
			}, 2000);
		} else {
			//连接错误
			this.eventCallback("OnError");
		}
	},

	//关闭请求(服务器关闭请求)
	OnClose: function OnClose(event) {
		if (this.isTestWss) {
			console.error("WebSocket 关闭请求(服务器关闭请求) OnClose: ", event);
		}
		if (this.url != event.target.URL) {
			return;
		}
		this.ErrLog("OnClose:%s,%s", this.url, event.type);
		if (this.isReconnecting) {
			this.Log("OnClose isReconnecting");
		} else {
			this.eventCallback("OnClose", [this.bDisconnectByLogout]);
			//初始化回调
			// this.handshakeCallback = null;

			// this.eventCallback = null;
			this.Disconnect();
		}
		this.isConnectIng = false;

		if (this.bDisconnectByLogout) {
			//自己断开的不自动重连
			this.bDisconnectByLogout = false;
			this.isReconnecting = false;
			return;
		}

		if (0 == this.tryReConnectCount) {
			this.ErrLog('NetWork OnClose tryReConnect');
			this.tryReConnectCount++;
			if (this.reConnectTimeID) {
				clearTimeout(this.reConnectTimeID);
				this.reConnectTimeID = 0;
			}
			var that = this;
			this.reConnectTimeID = setTimeout(function () {
				that.UpdateAccessPoint();
				that.isReconnecting = false;
				that.ReConnect();
			}, 1000);
		}
	},

	//-------------------发包接口----------------

	//发送登录授权封包,请求重新绑定链接
	RequestReConnect: function RequestReConnect(eventName, sendPack) {

		//还没有建立连接不能发送重连封包请求
		if (!this.Connected()) {
			this.ErrLog("RequestReConnect not Connected");
			//关闭模态层
			app.Client.OnEvent("ModalLayer", "ReceiveNet");
			return;
		}
		eventName = eventName.toLocaleLowerCase();

		// 发送请求
		var req = this.GetNewRequest();
		req.event = eventName;
		req.param = sendPack;
		req.callback = this.ReConnectSuccess.bind(this);
		req.errcb = this.ReConnectFail.bind(this);

		this.requests[req.id] = req;

		var head = {
			messageType: MessageType.Request,
			event: eventName,
			sequence: req.id
		};

		if (this.IsDevelopment()) {
			this.NetLog("[ReConnect](%s) : ", eventName, sendPack, "b-g");
		}
		//先发送一个重连封包,直接调用write,不调用Request避免被挤压
		this.write(head, sendPack);
	},

	//登录重新授权成功
	ReConnectSuccess: function ReConnectSuccess() {

		this.isReconnecting = false;
		//在发送挤压封包
		this.SendLostPack();
	},

	//重新授权失败
	ReConnectFail: function ReConnectFail(eventName, errorCode, body) {
		// 网络已经连接,重连token授权登录失败
		// 依据errorCode类型:
		// 1:弹框提示,2次授权登录,需要依然保持isReconnecting=true状态.
		// 2:非法性退到登录场景,不允许重连
		//关闭模态层
		app.Client.OnEvent("ModalLayer", "ReceiveNet");
	},

	//发送重连后挤压的封包
	SendLostPack: function SendLostPack() {
		var lostCount = this.losts.length;
		// 重连成功发送残留封包
		for (var index = 0; index < lostCount; index++) {
			var req = this.losts[index];
			if (this.IsDevelopment()) {
				this.NetLog("[SendLost](%s):", req.head.event, req.param, "b-g");
			}
			this.write(req.head, req.param);
		}
		this.losts = [];
	},

	//追加丢失的封包
	AddLostPack: function AddLostPack(head, sendPack) {
		var eventName = head.event;

		var lostCount = this.losts.length;
		for (var index = 0; index < lostCount; index++) {
			var req = this.losts[index];
			//存在相同的封包,过滤???
			if (req["head"]["event"] == eventName) {
				this.SysLog("AddLostPack have find(%s):", eventName, req["param"], sendPack);
				return;
			}
		}
		this.losts.push({ head: head, param: sendPack });
		console.log("重连建立中,积压封包(%s):", eventName, sendPack);
	},

	// 发送封包请求 可以携带callback，errorCallback回调
	Request: function Request(eventName, sendPack) {
		var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
		var errorCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		if (app.ControlManager().IsOpenVpn()) {
			return;
		}
		eventName = eventName.toLocaleLowerCase();

		// 发送请求
		var req = this.GetNewRequest();
		req.event = eventName;
		req.param = sendPack;
		req.callback = callback;
		req.errcb = errorCallback;

		this.requests[req.id] = req;

		var head = {
			messageType: MessageType.Request,
			event: eventName,
			sequence: req.id
		};

		if (this.Connected()) {
			//如果还在重连建立中,积压封包
			if (this.isReconnecting) {
				console.log("重连中,不能发送封包");
				this.AddLostPack(head, sendPack);
			} else {
				if (this.IsDevelopment()) {
					this.NetLog("[Send](%s) : ", eventName, sendPack, "b-g");
				}
				this.write(head, sendPack);
			}
		} else {
			console.log("未建立连接,不能发送封包");
			//如果成功开启重连,则积压封包
			if (this.ReConnect()) {
				this.AddLostPack(head, sendPack);
			} else {
				this.SysLog("未建立连接,不能发送封包(%s):", eventName, sendPack);
				//关闭模态层
				app.Client.OnEvent("ModalLayer", "ReceiveNet");
			}
		}
	},

	//通知服务器
	Notify: function Notify(eventName, sendPack) {
		eventName = eventName.toLocaleLowerCase();
		var head = {
			messageType: MessageType.Notify,
			event: eventName,
			sequence: 0
		};

		if (this.Connected()) {
			//如果还在重连建立中,积压封包
			if (this.isReconnecting) {
				this.AddLostPack(head, sendPack);
			} else {
				if (this.IsDevelopment()) {
					this.NetLog("[Notify](%s) : ", eventName, sendPack, "b-g");
				}
				this.write(head, sendPack);
			}
		} else {
			//如果成功开启重连,则积压封包
			if (this.ReConnect()) {
				this.AddLostPack(head, sendPack);
			} else {
				this.SysLog("未建立连接,不能发送封包(%s):", eventName, sendPack);
				//关闭模态层
				app.Client.OnEvent("ModalLayer", "ReceiveNet");
			}
		}
	},

	// 发送数据/* head:{ messageType: number, event: string, sequence: number }*/
	write: function write(head, message) {
		//this.Log("write:%s", head.event);
		try {
			var strMsg = JSON.stringify(message);
		} catch (error) {
			this.ErrLog("write error:%s ", error.stack);
			return;
		}
		var length = 1 + 2 + 2 + head.event.length * 3 + 2 + strMsg.length * 3;
		// console.log('[send]: length %s, event:%s, length:%s, msg:%s, length:%s', length, head.event, strMsg, head.event.length, strMsg.length);
		var byte = new EgretWriteByteArray(length);
		//创建 ByteArray 对象
		byte.writeByte(head.messageType); //消息类型
		byte.writeShort(head.sequence); //消息序列号
		byte.writeUTF(head.event); //数据类型
		byte.writeUTF(strMsg); //消息体
		//发送数据
		this.socket.send(byte.getBuffer());
	}
});

var g_NetWork = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_NetWork) {
		g_NetWork = new NetWork();
	}
	return g_NetWork;
};

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
        //# sourceMappingURL=NetWork.js.map
        