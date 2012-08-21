var Facebook = function(appId, onlogin, permissions){
    this.appId = appId;
    this.onlogin = onlogin;
    this.permissions = permissions;
    this.init();
}

var FacebookProto = Facebook.prototype;

FacebookProto.init = function(){
    var self = this;
    var url = '//' + window.location.hostname + '/channel';
    FB.init({
        appId      : this.appId,
        'channelUrl' : url,
        status     : true,
        cookie     : true,
        xfbml      : true
    });

    FB.Event.subscribe('auth.statusChange', function(response) {
        if (!response.authResponse){
            t.wrap(self.onlogout)();
            return;
        }
        self.accessToken = response.authResponse.accessToken;
        self.FB.accessToken = self.accessToken;
        self.FB.appId = self.appId;
        if (response.authResponse)
            t.wrap(self.onlogin)(self.FB);
        else
            t.wrap(self.onlogin)(false);
    });
    this.FB = FB;
}

FacebookProto.login = function(){
    this.FB.login(null, {scope: this.permissions});
}

FacebookProto.logout = function(){
    this.FB.logout();
}
