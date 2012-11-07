

var LibOperation = (function() {
    
    function Operation(json){
	this.verb = '';
	this.data = null;
	if(json){
	    if(typeof json === 'string') { json = JSON.parse(json); }
	    this.verb = json.verb;
	    this.data = json.data;
	}
    }
    
    Operation.prototype.stringified = function(){
	return JSON.stringify({'verb' : this.verb, 'data' : this.data});
    }
    
    Operation.prototype.path = function(){
	//return this.data.path.split('.');
	var path = this.data.path;
	if(path.length === 0){
	    path = [];
	}else{
	    path = path.split('.');
	}
	return path;
    }
    
    Operation.prototype.size = function(){
	var sum = 1;
	var ix;
	if(this.verb === 'multi'){
	    for(ix in this.data){
		sum += (new Operation(this.data[ix])).size();
	    }
	}
	return sum;
    }
    Operation.set = function(path, val){
	return new Operation({'verb':'set', 'data':{'path':path, 'val':val}})
    }
    Operation.setne = function(path, val){
	return new Operation({'verb':'setne', 'data':{'path':path, 'val':val}})
    }
    Operation.del = function(path){
	return new Operation({'verb':'del', 'data':{'path':path}})
    }
    
    var exports = {};
    exports.Operation = Operation;
    return exports;
}());

(function(){
    if(typeof exports !== undefined){
	var k;
	for(k in LibOperation){
	    exports[k] = LibOperation[k];
	}
    }
}());
