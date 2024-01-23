/*
//hook函数
//function (context, hookFunc, funcName)
context:字符串，上下文。
hookFunc：你自己的hook函数。实现自己的内容就可以了，不需要回调原函数。
funcName：可选参数，字符串，有些函数会重写toString的方法，建议传下函数名。
*/
//hook例子
/*
    //hook
    cc.log.hook('cc', function () {
        console.log('hook log');
    }, 'log');
    
    //unHook
    cc.log.unHook('cc', 'log');  

*/

var HootManager = function () {
    this.hookFns = {};
    this.init();
};

HootManager.prototype.init = function () {
	this.initEnv();
};

HootManager.prototype.initEnv = function () {
    var self = this;
    Function.prototype.hook = function (context, hookFunc, funcName) {
        var _context = null; //函數上下文
        var _funcName = null; //函數名      
        _funcName = funcName || getFuncName(this);
        eval('_context = ' + context + ' || window;')
        var _fullName = context + '.' + funcName; //函数加上上下文的全名。
        if (_funcName == '') {
            console.log("can not find funName,hook failed");
            return false;
        };


        if (_context[_funcName].prototype && _context[_funcName].prototype.isHooked) {
            console.log("Already has been hooked,unhook first");
            return false;
        }

        if (self.hookFns[_fullName]) {
            console.assert("hookFns has same hook name");
        }

        self.hookFns[_fullName] = this;

        function getFuncName(fn) {
            // 獲取函數名稱
            var strFunc = fn.toString();
            var _regex = /function\s+(\w+)\s*\(/;
            var patten = strFunc.match(_regex);
            if (patten) {
                return patten[1];
            };
            return '';
        }

        try {
            eval('_context[_funcName] = function ' + _funcName + '(){\n' +
                'var args = Array.prototype.slice.call(arguments,0);\n' +
                'var obj = this;\n' +
                'hookFunc.apply(obj,args)\n' +
                'return self.hookFns[_fullName].apply(obj,args);\n' +
                '};');
            _context[_funcName].prototype.isHooked = true;
            return true;
        } catch (e) {
            console.log("Hook failed,check the params.");
            return false;
        }
    },

    Function.prototype.unHook = function (context, funcName) {
        var _context = null;
        var _funcName = null;
        _funcName = funcName;
        eval('_context = ' + context + ' || window;')
        var _fullName = context + '.' + funcName; //函数加上上下文的全名。
        if (!_context[_funcName].prototype.isHooked) {
            console.log("No function is hooked on");
            return false;
        }
        _context[_funcName] = self.hookFns[_fullName];
        delete self.hookFns[_fullName];
        return true;
    }
};



HootManager.prototype.clearEnv = function () {
    if (Function.prototype.hasOwnProperty("hook")) {
        delete Function.prototype.hook;
    }
    if (Function.prototype.hasOwnProperty("unHook")) {
        delete Function.prototype.unHook;
    }
    return true;
}

HootManager.prototype.printHookFns = function () {
    for (var id in this.hookFns) {
        console.log('hookfn:\t%s', id);
    }
};


var g_HootManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_HootManager){
        g_HootManager = new HootManager();
    }
    return g_HootManager;
}