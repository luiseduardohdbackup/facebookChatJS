var _T = function(){ };


_T.prototype.log = function(){
    if (arguments.length === 1){
        console.log(JSON.stringify(arguments[0], null, 4));
    }
    else {
        var str = '[';
        for (var prop in arguments){
            str += JSON.stringify(arguments[prop], null, 4) + ', ';
        }
        str = str.slice(0, str.length-2);
        str += ']';
        console.log(str);
    }
}

_T.prototype.clog = function(){
    if (arguments.length === 1){
        console.log(arguments[0]);
    }
    else {
        var str = '[';
        for (var prop in arguments){
            str += arguments[prop] + ', ';
        }
        str = str.slice(0, str.length-2);
        str += ']';
        console.log(str);
    }
}

_T.prototype.wrap = function(fn, scope){
    if (!scope)
        scope = window;
    return function(){
        if (fn)
            return fn.apply(scope, arguments);
    }
};

_T.prototype.wrapFuture = function(loc, name, scope){
    var self = this;
    return function(){
        if (!scope)
            scope = window;
        return (self.wrap(loc[name], scope)).apply(window, arguments);
    }
}

_T.prototype.exists = function(o){
    return typeof o !== 'undefined';
}

_T.prototype.grayscale = function(img){
    img.css({
        'filter': 'url(filters.svg#grayscale)',
        'filter': 'gray',
        '-webkit-filter': 'grayscale(1)'
    });
}

var t = new _T();
