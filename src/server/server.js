

var bcrypt = require('bcrypt');
var json

function ServerState() {
    this.db = new DB();
    this.users = {};
    this.connections = [];
}

ServerState.prototype.stringified = function(){
    return JSON.stringify(this.db);
}

ServerState.prototype.add_user = function(email, password, callback){
    var self = this;
    bcrypt.genSalt(10, function(err, salt) {
	if(err){ return callback(err); }
	bcrypt.hash(password, salt, function(err, passhash) {
	    if(err){ return callback(err); }
            var user = {};
	    user.passhash = passhash;
	    user.email = email;
	    self.users[email] = user;
	    return callback(null);
	});
    });
}

ServerState.prototype.log_in = function(sock, email, password, callback){
    var self = this;
    var user = this.users[email];
    if(!user){ return callback('no such user', false); }
    bcrypt.compare(password, user.passhash, function(err, res) {
	if(err){ return callback(err); }
	if(!res){ return callback('bad password', false); }
	self.connections.push(new Connection(sock, email, self));
	return callback(null, true);
    });
}


