Доброго всем

¡ ¡ ¡ ALL GLORY TO GLORIA ! ! !

# JSONP

JSONP cross-domain ajax and sync calls.

Usage
-----

      JSONP.send(url, options, onSent, onSuccess, onError, onTimeout);
      
Param synopsis
-------

      url - string (callback query param does not needs, auto callback name!)
      options - plain config object:
        async: true|false (true default)
        timeout: numeric seconds (15 s default)
        onSent: function (url) {...} (call on sent request)
        onSuccess: function (data, url) {...} (call on success)
        onError: function (url) {...} (call on errors)
        onTimeout: function (url) {...} (call on timeout)
        debug: boolean (false default)
      onSent, onSuccess, onError, onTimeout - same thing above, hight prio


Notes
-----

You **do not need** to add callback query param to URL yourself.
