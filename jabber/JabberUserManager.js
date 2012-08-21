var JabberUserManager = function(){
    this.usersByJid = {};
    this.onlineUserJids = [];
}

var jumPo = JabberUserManager.prototype;

jumPo.addUser = function(newUser){
    var oldUser = this.usersByJid[newUser.jid];
    if (!t.exists(oldUser)){
        this.usersByJid[newUser.jid] = newUser;
    }
    else {
        oldUser.jid = newUser.jid;
        oldUser.name = newUser.name;
    }
}

jumPo.setOnline = function(jid){
    var user = this.usersByJid[jid];
    if (!t.exists(user)){
        this.addUser(new JabberUser(jid, null));
    }
    this.onlineUserJids.push(jid);
    this.usersByJid[jid].online = true;
}

jumPo.setOffline = function(jid){
    var user = this.usersByJid[jid];
    if (!t.exists(user)){
        addUser(new JabberUser(jid, null));
    }
    this.onlineUserJids.splice(jid);
    this.usersByJid[jid].online = false;
}

jumPo.getOnline = function(){
    var online = [];
    for (var i = 0; i < this.onlineUserJids.length; i++){
        online.push(this.usersByJid[this.onlineUserJids[i]]);
    }
    return online;
}
