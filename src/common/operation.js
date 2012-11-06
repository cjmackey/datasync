

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
    return this.data.path.split('.');
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


