var _ScriptL = function(){ 
    this.loaded = {};
}

_ScriptL.prototype.loadScript = function(src, onload){
    if (this.loaded[src]){
        onload();
        return;
    }
    this.loaded[src] = true;
    var script = document.createElement('script');
    script.src = src;
    script.onload = function(){
        onload();
    }
    document.body.appendChild(script);
}

_ScriptL.prototype.loadScripts = function(srcs, onload){
    var scriptsLen = srcs.length;
    var scriptsLeft = scriptsLen;
    for (var i = 0; i < scriptsLen; i++){
        var src = srcs[i];
        this.loadScript(src, function(){
            scriptsLeft -= 1;
            if (scriptsLeft === 0){
                onload();
            }
        });
    }
};

var ScriptL = new _ScriptL();
