var Events = function(start, parentE, children){

    if (!start.e)
        start.e = {};
        
    if (!children){
        start.e.children = [];
        children = start.e.children;
    }

    var passParent = function(name, args){
        if (parentE){
            args.unshift(name);
            parentE.passUp.apply(parentE, args);
        }
        else {
            //t.log("dropped event:", "up", name, args);
        }
    }

    var passChildren = function(name, args){
        if (children && children.length > 0){
            args.unshift(name);
            for (var i = 0; i < children.length; i++){
                var child = children[i];
                child.e.passDown.apply(child, args);
            }
        }
        else {
            //t.log("dropped event:", "down", name, args);
        }
    }

    start.e.passUp = function(name){
        if (window.Events.debug === 'text')
            t.log('^', start.__name, name);
        var args = [];
        Array.prototype.push.apply(args, arguments);
        args.shift();
        if (start.e[name]){
            if (start.e[name].apply(start, args)){
                passParent(name, args);
            }
        }
        else {
            passParent(name, args);
        }
    }

    start.e.passDown = function(name){
        if (window.Events.debug === 'text')
            t.log('v', start.__name, name);
        var args = [];
        Array.prototype.push.apply(args, arguments);
        args.shift();
        if (start.e[name]){
            if (start.e[name].apply(start, args)){
                passChildren(name, args);
            }
        }
        else {
            passChildren(name, args);
        }
    }
}

Events.debug = 'none';
