

var LibDB = (function(){
    
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
		    if(isNaN(key) || key < 0 || key >= target.length){return;}
		    if(op.verb === 'del'){
			/* deleting from an array is inconsistent
			 * between javascript and JSON (since JSON has
			 * no concept of undefined).  So, I convert
			 * deletions within an array to setting that
			 * key to null, which behaves similarly while
			 * being consistent with the JSON string
			 * representation.
			 */
			op.verb = 'set';
			op.data.val = null;
		    }
		}else{
		    key = '_'+key;
		}
		if(op.verb === 'setne' && !(target[key] === undefined || target[key] === null)){return;}
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
	case 'sort':
	case 'unshift':
	    var target = this.lookup(op.path());
	    if(target instanceof Array){
		target[op.verb](op.data.val);
	    }
	    break;
	}
    }
    
    DB.prototype.lookup = function(path){
	if(typeof path === 'string'){
	    if(path.length === 0){
		path = [];
	    }else{
		path = path.split('.');
	    }
	}
	var obj = this.data;
	for(ix in path){
	    if(obj instanceof Array){
		var pix = parseInt(path[ix])
		if(pix < 0 || pix >= obj.length){ return undefined; }
		obj = obj[pix];
	    }else if(obj instanceof Object) {
		obj = obj['_'+path[ix]];
	    }else{ return undefined; }
	}
	return obj;
    }
    
    var exports = {};
    exports.DB = DB;
    return exports;
}());

(function(){
    if(typeof exports !== undefined){
	var k;
	for(k in LibDB){
	    exports[k] = LibDB[k];
	}
    }
}());
