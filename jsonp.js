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
      document.body.removeChild(sender.script);
      window.clearTimeout(sender.timeout_trigger);
      delete self._R[sender.callback_name];
    };
    
  };
  
  self.send = function(url, options, onSent, onSuccess, onError, onTimeout) {
    var options = options || {},
      callback_name = '_cb_' + Math.round(1e10 * Math.random()) //options.callbackName || 'callback',
        .toString(36) + '_' + (self.COUNTER++).toString(36),
      onSent = onSent || options.onSent,
      onSuccess = onSuccess || options.onSuccess,
      onError = onError || options.onError,
      onTimeout = onTimeout || options.onTimeout,
      timeout = options.timeout || 15,
      async = options.async === undefined ? true : options.async,
      _url = url + (~url.indexOf('?') ? '&' : '?') + 'callback=JSONP._R.' + callback_name+'.cb',
      cbOk = false,
      debug = options.debug || false;
      
    
    var sender = self._R[callback_name] = {};
    sender.callback_name = callback_name;
    
    var clean = self._cleaner(sender);

    sender.timeout_trigger = window.setTimeout(function(){
      debug && console.log('Timeout JSONP => ' +_url);
      clean(); // можно очистить реестр
      onTimeout && onTimeout(url);
    }, timeout * 1000);

    
    sender.cb = function (data) {
      cbOk = true;  // обработчик вызвался, указать что всё ок
      debug && console.log('Success JSONP => ' +_url);
      clean(); // можно очистить
      onSuccess && onSuccess(data, url);
    };
    
    /*
    эта функция сработает при любом результате запроса
    важно: при успешном результате - всегда после JSONP-обработчика
    */
    sender.checker = function () {
      if (cbOk) return; // сработал обработчик? нет - вызвать onError
      debug && console.log('Error JSONP => ' +_url);
      clean();
      onError && onError(url);
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
        window.setTimeout(sender.checker, 0);
      }
    }
    
    sender.script.onload = sender.script.onerror = sender.checker;
  
    sender.script.type = 'text/javascript';
    sender.script.async = async;
    sender.script.src = _url;

    //~ document.getElementsByTagName('head')[0].appendChild(script);
    document.body.appendChild(sender.script);
    debug && console.log("JSONP sent: "+_url);
    onSent && onSent(url);
  };

  return self;
})();
