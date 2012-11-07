
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


exports.testSet = function(test){
    var db = new DB();
    var op = Operation.set('asdf','blah');
    db.apply_operation(op);
    test.equal(db.lookup(['asdf']),'blah');
    test.done();
}
exports.testSetOver = function(test){
    var db = new DB({'_asdf':'blah'})
    var op = Operation.set('asdf','blah2');
    db.apply_operation(op);
    test.equal(db.lookup(['asdf']),'blah2');
    test.done();
}
exports.testSetChain = function(test){
    var db = new DB({'_asdf':{}});
    var op = Operation.set('asdf.wargle','blah');
    db.apply_operation(op);
    test.equal(db.lookup('asdf.wargle'),'blah');
    test.done();
}

