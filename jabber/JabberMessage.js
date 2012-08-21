var JabberMessage = function(msg){
    this.toJid = msg.getAttribute('to');
    this.fromJid = msg.getAttribute('from');
    this.type = msg.getAttribute('type');
    if (msg.getElementsByTagName('active').length > 0)
        this.state = 'active';
    if (msg.getElementsByTagName('composing').length > 0)
        this.state = 'composing';
    this.elems = msg.getElementsByTagName('body');
}
