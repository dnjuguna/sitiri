module.exports = function(){
	var headers = arguments[0];
	var _private = {
		store: {
			cookies: []
		},
		parse: function(headers){
			headers.hasOwnProperty("cookie") ? _private.parseCookie(headers['cookie']) : _private.parseSetCookie(headers['set-cookie']);
		},
		parseSetCookie: function(source){
			source = typeof source == 'string' ? source : "";
			var items = source.split(',');
			for(var i in items){
				var item = items[i];
				var properties = item.split(';');
				var identity = (properties.shift()).split('=');
				var cookie = {name: identity[0], value: identity[1], path: "/", expires: undefined, httpOnly: true, secure: false};
				for(var j in properties){
					var property = properties[j].split('=');
					cookie[property[0]] = property[1];
				}
				_private.store.cookies.push(cookie);
			}
		},
		parseCookie: function(source){
			source = typeof source == 'string' ? source : "";
			var items = source.split(';');
			for(var i in items){
				var item = (items[i]).split('=');
				var cookie = {name: item[0], value: item[1], path: "/", expires: undefined, httpOnly: true, secure: false};
				_private.store.cookies.push(cookie);
			}
		}
	};
	headers && _private.parse(headers);
	return {
		push : function(){
			_private.store.cookies = _private.store.cookies ? _private.store.cookies : [];
			_private.store.cookies.push(arguments[0]);
		},
		find : function(){
			var name = arguments[0];
			var cookies = {};
			for(var i in _private.store.cookies){
				var cookie = _private.store.cookies[i];
				if(name && cookie.name == name){
					return cookie.value;
				}else{
					cookies[name] = cookie;
				}
			}
			return name ? null : cookies;
		},
		parse: _private.parse,
		toString: function(){
			var obj = this.find();
			var arr = [];
			for(var i in obj){
				arr.push(i + '=' + obj[i] + ';');
			}
			return arr.join('');
		}
	}
};
