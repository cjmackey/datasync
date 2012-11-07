
var DB = require('../src/common/db.js').DB;
var Operation = require('../src/common/operation.js').Operation;

exports.testLookup = function(test){
    var db = new DB({'_asdf':'blah'})
    test.equal(db.lookup([])['_asdf'], 'blah');
    test.equal(db.lookup(['asdf']),'blah');
    test.done();
};
exports.testLookupChain = function(test){
    var db = new DB({'_asdf':{'_blah':'blah2'}})
    test.equal(db.lookup(['asdf','blah']),'blah2');
    test.equal(db.lookup('asdf.blah'),'blah2');
    test.done();
};
exports.testLookupChainArray = function(test){
    var db = new DB({'_asdf':['blah','hello']})
    test.equal(db.lookup(['asdf','0']),'blah');
    test.equal(db.lookup(['asdf','1']),'hello');
    test.done();
};

exports.set = {}
exports.set.basic = function(test){
    var db = new DB();
    var op = Operation.set('asdf','blah');
    db.apply_operation(op);
    test.equal(db.lookup(['asdf']),'blah');
    test.done();
}
exports.set.over = function(test){
    var db = new DB({'_asdf':'blah'})
    var op = Operation.set('asdf','blah2');
    db.apply_operation(op);
    test.equal(db.lookup(['asdf']),'blah2');
    test.done();
}
exports.set.chain = function(test){
    var db = new DB({'_asdf':{}});
    var op = Operation.set('asdf.wargle','blah');
    db.apply_operation(op);
    test.equal(db.lookup('asdf.wargle'),'blah');
    test.done();
}
exports.set.array = function(test){
    var db = new DB({'_asdf':['blah']})
    var op = Operation.set('asdf.0', 'blah2');
    test.equal(db.lookup('asdf.0'), 'blah', 'testing setup');
    db.apply_operation(op);
    test.equal(db.lookup('asdf.0'), 'blah2', 'testing set result');
    test.done();
}
exports.set.array_out_of_bounds = function(test){
    var db = new DB({'_asdf':['blah']})
    var op = Operation.set('asdf.1', 'blah2');
    test.equal(db.lookup('asdf.1'), undefined, 'testing setup');
    db.apply_operation(op);
    test.equal(db.lookup('asdf.0'), 'blah', 'testing set result');
    test.equal(db.lookup('asdf.1'), undefined, 'testing set result');
    test.done();
}

exports.setne = {}
exports.setne.basic = function(test){
    var db = new DB();
    var op = Operation.setne('asdf','blah');
    db.apply_operation(op);
    test.equal(db.lookup('asdf'),'blah');
    test.done();
}
exports.setne.over = function(test){
    var db = new DB({'_asdf':'blah'})
    var op = Operation.setne('asdf','blah2');
    db.apply_operation(op);
    test.equal(db.lookup('asdf'),'blah');
    test.done();
}
exports.setne.array = function(test){
    var db = new DB({'_asdf':[null]})
    var op = Operation.setne('asdf.0', 'blah2');
    test.equal(db.lookup('asdf.0'), null, 'testing setup');
    db.apply_operation(op);
    test.equal(db.lookup('asdf.0'), 'blah2', 'testing set result');
    test.done();
}
exports.setne.arrayover = function(test){
    var db = new DB({'_asdf':['blah']})
    var op = Operation.setne('asdf.0', 'blah2');
    test.equal(db.lookup('asdf.0'), 'blah', 'testing setup');
    db.apply_operation(op);
    test.equal(db.lookup('asdf.0'), 'blah', 'testing set result');
    test.done();
}
exports.setne.array_out_of_bounds = function(test){
    var db = new DB({'_asdf':['blah']})
    var op = Operation.setne('asdf.1', 'blah2');
    test.equal(db.lookup('asdf.1'), undefined, 'testing setup');
    db.apply_operation(op);
    test.equal(db.lookup('asdf.0'), 'blah', 'testing set result');
    test.equal(db.lookup('asdf.1'), undefined, 'testing set result');
    test.done();
}

exports.del = {}
exports.del.miss = function(test){
    var db = new DB();
    var op = Operation.del('asdf');
    db.apply_operation(op);
    test.equal(db.lookup('asdf'),undefined);
    test.done();
}
exports.del.object = function(test){
    var db = new DB({'_asdf':'blah'})
    var op = Operation.del('asdf');
    test.equal(db.lookup('asdf'), 'blah', 'testing setup');
    db.apply_operation(op);
    test.equal(db.lookup('asdf'), undefined, 'testing deletion result');
    test.done();
}
exports.del.array = function(test){
    var db = new DB({'_asdf':['blah']})
    var op = Operation.del('asdf.0');
    test.equal(db.lookup('asdf.0'), 'blah', 'testing setup');
    db.apply_operation(op);
    test.equal(db.lookup('asdf.0'), null, 'testing deletion result');
    test.done();
}

var array_verbs = 'pop shift push sort unshift'.split(' ');
var array_generators = {'empty':function(){ return []; },
			'single':function(){ return ['z']; },
			'many':function(){ return [1,7,4,2,8]; }}
for(var verbix in array_verbs){
    var verb = array_verbs[verbix];
    var ex = (exports[verb] = exports[verb] || {});
    for(var arr_type in array_generators){
	ex[arr_type] = (function(verb,arr_type){
	    return function(test){
		var db = new DB({'_asdf':array_generators[arr_type]()});
		var op = new Operation({'verb':verb, 'data':{'path':'asdf','val':'a'}});
		db.apply_operation(op);
		var arr = array_generators[arr_type]();
		arr[verb]('a');
		test.deepEqual(db.lookup('asdf'),arr);
		test.done();
	    }
	}(verb,arr_type));
    }
}




