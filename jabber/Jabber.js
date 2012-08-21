var Jabber = function(server, alternatives){
    this.server = server;
    alternatives = alternatives || {};
    if (alternatives.onPresence)
        this.onPresence = alternatives.onPresence;
    else
        this.onPresence = this.defaultOnPresence;
    if (alternatives.onGotRoster)
        this.onGotRoster = alternatives.onGotRoster;
    else
        this.onGotRoster = this.defaultOnGotRoster;
    this.init();
}

var jbrPo = Jabber.prototype;

jbrPo.init = function(){
    this.users = new JabberUserManager();
    this.e.passUp('onload');

    this.e.sendMsg = function(toJid, text){
        var fromJid = this.connection.jid;
        var reply = $msg({to: toJid, from: fromJid, type: 'chat'})
                .c('body').t(text);
        this.connection.send(reply.tree());
    }
}

jbrPo.connect = function(jid, pass){
    this.connection = new Strophe.Connection(this.server);
    this.connection.connect(jid, pass, t.wrap(this.onConnectionStatus, this));
    this.connection.addHandler(t.wrap(this.onPresence, this), null, "presence");
	this.connection.addHandler(t.wrap(this.onMessage, this), null, 'message', null, null,  null); 
    //this.connection.rawInput = function(msg){
    //    t.clog('in', msg);
    //    t.clog('');
    //}
    //this.connection.rawOutput = function(msg){
    //    t.clog('out', msg)
    //    t.clog('');
    //}
}

jbrPo.connectFacebook = function(fb){
    fb.api('/me', t.wrap(function(res){
        var jid = res.username + "@chat.facebook.com";
        this.connection = new Strophe.Connection(this.server);
        this.connection.facebookConnect(jid,
                    t.wrap(this.onConnectionStatus, this),
                    300,
                    1,
                    fb.appId,
                    fb.accessToken);
        this.connection.addHandler(t.wrap(this.onPresence, this), null, "presence");
        this.connection.addHandler(t.wrap(this.onMessage, this), null, 'message', null, null,  null); 
    }, this));
}

jbrPo.onConnectionStatus = function(status){
    if (status == Strophe.Status.CONNECTING) t.wrap(this.onConnecting, this)();
    else if (status == Strophe.Status.CONNFAIL) t.wrap(this.onConnFail, this)();
    else if (status == Strophe.Status.DISCONNECTING) t.wrap(this.onDiconnecting, this)();
    else if (status == Strophe.Status.DISCONNECTED) t.wrap(this.onDisconnected, this)();
    else if (status == Strophe.Status.CONNECTED) t.wrap(this.onConnected, this)();
}

jbrPo.onMessage = function(rawMsg) {
    var msg = new JabberMessage(rawMsg);
    var fromUser = this.users.usersByJid[msg.fromJid];
    if (msg.state === 'active')
        this.e.passUp('chatMsg', msg, fromUser);
    else if (msg.state === 'composing')
        this.e.passUp('chatComposing', fromUser);
    else
        console.log(rawMsg);
    return true;
}

jbrPo.onConnected = function(){
    this.e.passUp('onConnected', this.connection.jid);
}

jbrPo.onConnFail = function(){
    this.e.passUp('onConnFail');
}

jbrPo.onDisconnecting = function(){
    this.e.passUp('onDisconnecting');
}

jbrPo.onDisconnected = function(){
    this.e.passUp('onDisconnected');
}

jbrPo.onConnecting = function(){
    this.e.passUp('onConnecting');
}

jbrPo.defaultOnPresence = function(presence){
    var presence = Strophe.serialize(presence);
    var status = $(presence).attr('type');
    var jid = $(presence).attr('from');
    if (status === 'unvailable'){
        this.users.setOffline(jid);
    }
    else {
        this.users.setOnline(jid);
    }
    this.e.passUp('onUserUpdate', this.users.usersByJid[jid]);
    this.e.passUp('onUsersUpdate');
    return true;
}

jbrPo.requestRoster = function(){
    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
    this.connection.sendIQ(iq, t.wrap(this.defaultOnGotRoster, this));
}

jbrPo.defaultOnGotRoster = function(iq){
    var iq = Strophe.serialize(iq);
    var self = this;
    $(iq).find("item").each(function(){
        var jid = $(this).attr('jid');
        var name = $(this).attr('name');
        var user = new JabberUser(jid, name);
        t.log(jid, iq);
        self.users.addUser(user);
        self.e.passUp('onUserUpdate', self.users.usersByJid[jid]);
    });
    this.e.passUp('onUsersUpdate')
}

jbrPo.setOnline = function(){
    this.connection.send($pres().tree());
}

jbrPo.setOffline = function(){
    this.connection.send($pres({type: "unavailable"}));
}
