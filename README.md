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

Пример
------

      JSONP.send(
        // About JsFiddle API: http://doc.jsfiddle.net/api/fiddles.html
        'https://jsfiddle.net/api/user/zalun/demo/list.json?&sort=framework&start=5&limit=15',
        {debug: true},
        null,
        function (response) {
          if (response.status !== 'ok') {
            return;
          }
          var output = document.querySelector('body');
          output.innerHTML = '<ul JsFiddle-API>' + response.list.map(function (rec) {
            return [
              '<li><a href="$url$version">$title</a>',
              '<span>($framework)</span>',
              '<span>rev-$version</span>',
              '<span>$created</span>',
              '<p>$description</p></li>'
            ].join(' ')
            .replace(/\$(\w+)/g, function (_, name) {
              return rec[name];
            })
          }).join('\n') + '</ul>';

        }
      );
