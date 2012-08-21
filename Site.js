var Site = function(domParent){
    ETree(this, null, 'Site');
    this.domParent = domParent;

    var APP_ID = 0;

    this.fbLoader = new Facebook(APP_ID, t.wrap(this.loadFacebook, this), 'xmpp_login,read_mailbox');

    this.e.facebookConnecting = function(){
        console.log('fb connecting'); }
    this.e.facebookConnected = function(){
        console.log('fb connected'); }

    this.e.userUpdate = function(user){
        t.log(user);
    }

    this.e.chatMsg = function(fromUser, text){
        t.log(fromUser, text);
    }

    this.e.sendMsg = function(toUser, type, text){
        this.chat.e.passDown('sendMsg', toUser, type, text);
    }

    this.fbChat = this.e.grow(FacebookChat)();
o
}

var sPo = Site.prototype;

sPo.loadFacebook = function(fb){
    this.fbChat.login(fb);
}

