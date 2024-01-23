
/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`. when occurred error, call errcb.
 *
 * @param {String} event
 * @param {Function} fn
 * @param {Function} errcb
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn, target){

  //注册回掉函数绑定运行对象
  if(!target){
    target = this;
  }
  fn.target = target;

  this._callbacks = this._callbacks || {};

  //同一个event只能被一个target注册一次
  let isRegetEventByTarget = false;
  if (this._callbacks[event]) {
    for (let i = 0; i < this._callbacks[event].length; i++) {
        if (this._callbacks[event][i].target == target) {
          isRegetEventByTarget = true;
          this._callbacks[event][i] = fn;
          break;
        }
    }
  }
  if (isRegetEventByTarget) {
    console.log(event +" 事件已经被同一个target注册");
    return this;
  }

  (this._callbacks[event] = this._callbacks[event] || []).push(fn);

  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn, target){
  var self = this;
  this._callbacks = this._callbacks || {};

  if(!target){
    target = this;
  }

  function on() {
    self.off(event, on);
    fn.apply(target, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }
  
  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  
  this._callbacks = this._callbacks || {};
  var callbacks = this._callbacks[event];
  if(!callbacks) {
    return this
  }

  var args = [].slice.call(arguments, 1);

  callbacks = callbacks.slice(0);

  for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(callbacks[i].target, args);
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};
