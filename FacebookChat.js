var FacebookChat = function(){

    this.e.facebookLoaded = function(fb){
        this.login(fb);
    }
    this.jidsByName = {};

    this.init();
}

var fbcPo = FacebookChat.prototype;

fbcPo.init = function(){
    this.jabber = this.e.grow('Jabber')('http://localhost:5280/http-bind/');
    this.e.onConnected = function(jid){
        this.jabber.setOnline();
        this.jabber.requestRoster();
        this.e.passUp('facebookConnected');
    }
    this.e.onConnecting = function(){
        this.e.passUp('facebookConnecting');
    }
    this.e.onUserUpdate = function(fbUser){
        this.jidsByName[fbUser.name] = fbUser.jid;
        this.e.passUp('facebookUserUpdate', fbUser);
    }
    this.e.onUsersUpdate = function(){
        this.e.passUp('facebookUsersUpdate');
    }
    this.e.chatMsg = function(msg, user){
        var text = Strophe.getText(msg.elems[0]);
        this.e.passUp('facebookMsg', user, text);
    }
    this.e.sendFacebookMsg = function(toUser, text){
        var toJid = toUser.jid;
        this.e.passDown('sendMsg', toJid, text);
    }
}
fbcPo.getOnline = function(){
    return this.jabber.users.getOnline();
}

fbcPo.login = function(fb){
    this.jabber.connectFacebook(fb);
}
