/*
Доброго всем

¡ ¡ ¡ ALL GLORY TO GLORIA ! ! !

Usage:

JSONP.send(url, options, onSent, onSuccess, onError, onTimeout);
      

url string (callback param does not needs, auto callback name!)
options plain config object:
  async: true|false (true default)
  timeout: numeric seconds (15 s default)
  onSent: function (url) {...} (call on sent request)
  onSuccess: function (data, url) {...} (call on success)
  onError: function (url) {...} (call on errors)
  onTimeout: function (url) {...} (call on timeout)

*/
var JSONP = (function(){
  var self = {};
  self.COUNTER = 1;
  self._R = {};// реестр запусков
  
  self._cleaner = function (sender) {
    return function () {
      if ( sender === undefined ) return;
      window.clearTimeout(sender.timeout_trigger);
      document.body.removeChild(sender.script);
      delete self._R[sender.callback_name];// харакири
      sender = undefined;
    };
    
  };
  
  self.send = function(url, options, onSent, onSuccess, onError, onTimeout) {
    var options = options || {},
      callback_name = '_cb_' + Math.round(1e10 * Math.random())
        .toString(36) + '_' + (self.COUNTER++).toString(36),
      timeout = options.timeout || 15,
      async = options.async === undefined ? true : options.async,
      cbOk = false,
      debug = options.debug || false;

    var sender = self._R[callback_name] = {
      callback_name: callback_name,
      onSent: onSent || options.onSent,
      onSuccess: onSuccess || options.onSuccess,
      onError: onError || options.onError,
      onTimeout: onTimeout || options.onTimeout,
      url: url + (~url.indexOf('?') ? '&' : '?') + 'callback=JSONP._R.' + callback_name+'.cb'
    };
    
    var clean = self._cleaner(sender);

    sender.timeout_trigger = window.setTimeout(function(){
      debug && console.log('Timeout JSONP => ' +sender.url);
      clean(); // можно очистить
      sender.onTimeout && sender.onTimeout(url);
    }, timeout * 1000);

    
    sender.cb = function (data) {
      cbOk = true;  // обработчик вызвался, указать что всё ок
      debug && console.log('Success JSONP => ' + sender.url);
      clean(); // можно очистить
      sender.onSuccess && sender.onSuccess(data, url);
    };
    
    /*
    эта функция сработает при любом результате запроса
    важно: при успешном результате - всегда после JSONP-обработчика
    */
    sender.checker = function () {
      if (cbOk) return; // сработал обработчик? нет - вызвать onError
      debug && console.log('Error JSONP => ' +sender.url);
      clean(); // можно очистить
      sender.onError && sender.onError(url);
    };

    sender.script = document.createElement('script');
    
    /*
    в старых IE поддерживается только событие, а не onload/onerror
    в теории 'readyState=loaded' означает "скрипт загрузился",
    а 'readyState=complete' -- "скрипт выполнился", но иногда
    почему-то случается только одно из них, поэтому проверяем оба
    */
    sender.script.onreadystatechange = function() {
      if (/^(complete|loaded)$/.test(this.readyState)) {
        this.onreadystatechange = null;
        if (sender !== undefined && sender.checker) window.setTimeout(sender.checker, 0);
      }
    }
    
    sender.script.onload = sender.script.onerror = sender.checker;
  
    sender.script.type = 'text/javascript';
    sender.script.async = async;
    sender.script.src = sender.url;

    //~ document.getElementsByTagName('head')[0].appendChild(script);
    document.body.appendChild(sender.script);
    debug && console.log("JSONP sent: "+sender.url);
    onSent && onSent(url);
  };

  return self;
})();
