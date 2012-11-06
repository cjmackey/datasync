

function DB(original){
    this.data = original || {}
}

DB.prototype.apply_operation = function(op){
    switch(op.verb) {
    case 'multi':
	var ix;
	for(ix in op.data){
	    this.apply_operation(new Operation(op.data[ix]));
	}
	break;
    case 'set':
    case 'setne':
    case 'del':
	var path = op.path();
	var key = path.pop();
	var target = this.lookup(path)
	if(target !== undefined){
	    if(target instanceof Array){
		key = parseInt(key);
		if(isNAN(key)){return;}
	    }
	    if(op.verb === 'setne' && target[key] !== undefined){return;}
	    if(op.verb === 'del'){
		delete target[key];
	    }else{
		target[key] = op.data.val;
	    }
	}
	break;
    case 'pop':
    case 'shift':
    case 'push':
    case 'unshift':
	var target = this.lookup(op.path());
	if(target instanceof Array){
	    target[op.verb](op.data.val);
	}
	break;
    }
}

DB.prototype.lookup = function(path){
    var obj = this.data;
    for(ix in path){
	if(obj instanceof Array){
	    var pix = parseInt(path[ix])
	    if(pix < 0 || pix >= obj.length){ return undefined; }
	    obj = obj[pix];
	}else if(obj instanceof Object) {
	    obj = obj[path[ix]];
	}else{ return undefined; }
    }
    return obj;
}




