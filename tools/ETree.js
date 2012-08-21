var ETree = function(start, parentE, name){
    Events(start, parentE); 
    start.__name = name;
    start.__id = window.ETree.nextId;
    window.ETree.nextId += 1;
    var grow = function(Child){
        var self = this;
        return function(a, b, c, d){
            if (typeof Child === 'string'){
                var name = Child;
                var ChildE = eval(Child);
                var child = Object.create(ChildE.prototype);
                ETree(child, self, name);
                ChildE.apply(child, arguments);
                self.children.push(child);
            }
            else {
                var child = Object.create(Child.prototype);
                ETree(child, self);
                Child.apply(child, arguments);
                self.children.push(child);
            }
            return child;
        }
    }
    start.e.grow = grow;
}

ETree.nextId = 0
