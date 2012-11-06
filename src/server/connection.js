

function Connection(sock, email, server){
    this._sock = sock;
    this._email = email;
    this._server = server;
    sock.serv_conn = this;
}

Connection.prototype.user = function(){
    return this._server.users[this._email];
}