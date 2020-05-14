var is = require("vows-is"),
    _should = is.should,
    EventEmitter = require("events").EventEmitter.prototype;

var contract = require("../src/contract.js")();

is.partial("contains pre", function _partial(context) {
    return context
        .context("contains pre which")
            .topic.is(function(c) { return c.pre; })
            .vow.it.should.be.a("function")
            .parent();
});

is.partial("contains post", function _partial(context) {
    return context
        .context("contains post which")
            .topic.is(function(c) { return c.post; })
            .vow.it.should.be.a("function")
            .parent();
});

is.partial("contains invariant", function _partial(context) {
    return context
        .context("contains invariant which")
            .topic.is(function(c) { return c.invariant; })
            .vow.it.should.be.a("function")
            .parent();
});

is.partial("pre", function _partial(context) {
    return context
        .vow.it.should.be.a("function")
        .context("when called (1)")
            .topic.is.an.invocation(1)
            .vow.it.should.error
            .vow.it.should.have
                .property("message", "expected undefined to exist")
            .parent()
        .context("when called (1,2)")
            .topic.is.an.invocation(1,2)
            .vow.it.should.error
            .vow.it.should.have
                .property("message", "expected 2 to be a string")
            .parent()
        .context("when called (1, 'foo')")
            .topic.is.an.invocation(1, 'foo')
            .vow.it.should.error
            .vow.it.should.have
                .property("message", "expected 1 to be above 5")
            .parent()
        .context("when called (6, 'foo')")
            .topic.is.an.invocation(6, 'foo')
            .vow.it.should.not.error
            .vow.it.should.equal(6)
            .batch();
});

is.partial("post", function _partial(context) {
    return context
        .vow.it.should.be.a("function")
        .context("when called (5, 6)")
            .topic.is.an.invocation(5, 6)
            .vow.it.should.error
            .vow.it.should.have
                .property("message", "expected 5 to equal 6")
            .parent()
        .context("when called (5, 5)")
            .topic.is.an.invocation(5, 5)
            .vow.it.should.not.error
            .vow.it.should.equal(5)
            .batch();
});

is.partial("invariant", function _invariant(context) {
    return context
        .vow.it.should.be.a("function")
        .context("when called ('foobar')")
            .topic.is.an.invocation("foobar")
            .vow.it.should.error
            .vow.it.should.have
                .property("message", "expected 50 to equal 42")
            .parent()
        .context("when called ('foo')")
            .topic.is.an.invocation("foo")
            .vow.it.should.not.error
            .vow.it.should.equal(42)
            .batch();
});

var suite = is.suite("contract").batch()
    
    .context("the contract function")
        .topic.is(function() { return contract; })
        .vow.it.should.be.a("function")
        .partial("contains pre")
        .partial("contains post")
        .partial("contains invariant")
        .context("when called returns an object which")
            .topic.is(function(c) { return c(function() { }); })
            .vow.it.should.be.a("object")
            .partial("contains pre")
            .partial("contains post")
            .partial("contains invariant")
        
.suite().batch()

    .context("the function prototype")
        .topic.is(function() { return Function.prototype; })
        .vow.it.should.be.a("function")
        .partial("contains pre")
        .partial("contains post")
        .partial("contains invariant")

.suite().batch()

    .context("contract(f).pre(pre) ")
        .topic.is(function() {
            var c = contract(function _f(a, b) {
                return a;
            });

            c = c.pre(function _pre(a,b) {
                _should.exist(a);
                a.should.be.a("number");
                _should.exist(b);
                b.should.be.a("string");
                a.should.be.above(5).and.below(10);
            });

            return c.valueOf();
        })
        .partial("pre")

    .context("f.pre(pre) ")
        .topic.is(function() {
            var c = function _f(a, b) {
                return a;
            };

            return c.pre(function _pre(a, b) {
                _should.exist(a);
                a.should.be.a("number");
                _should.exist(b);
                b.should.be.a("string");
                a.should.be.above(5).and.below(10);
            });
        })
        .partial("pre")

    .context("contract.pre(pre, f) ")
        .topic.is(function() {
            var c = function _f(a, b) {
                return a;
            };

            return contract.pre(function _pre(a, b) {
                _should.exist(a);
                a.should.be.a("number");
                _should.exist(b);
                b.should.be.a("string");
                a.should.be.above(5).and.below(10); 
            }, c);
        })
        .partial("pre")

.suite().batch()
    
    .context("contract(f).post(post) ")
        .topic.is(function() {
            var c = contract(function _f(a, b) {
                return a;
            });

            c = c.post(function _post(ret, a, b) {
                ret.should.equal(b);
            });

            return c.valueOf();
        })
        .partial("post")

    .context("f.post(post)")
        .topic.is(function() {
            var c = function _f(a, b) {
                return a;   
            };

            return c.post(function _post(ret, a, b) {
                ret.should.equal(b);    
            });
        })
        .partial("post")

    .context("contract.post(post, f) ")
        .topic.is(function() {
            var c = function(a, b) {
                return a;
            };

            return contract.post(function _post(ret, a, b) {
                ret.should.equal(b);
            }, c)
        })
        .partial("post")

.suite().batch()

    .context("contract(o.f).invariant(invariant)")
        .topic.is(function() {
            var o = {
                foobar: 50,
                c: function(mutator) {
                    return this[mutator] = 42;
                }
            };

            o.c = contract(o.c).invariant(function(before) {
                before.foobar.should.equal(this.foobar);
            }).valueOf();

            return o.c.bind(o);
        })
        .partial("invariant")
    
    .context("o.f.invariant(invariant)")
        .topic.is(function() {
            var o = {
                foobar: 50,
                c: function(mutator) {
                    return this[mutator] = 42;
                }
            };

            o.c = o.c.invariant(function(before) {
                before.foobar.should.equal(this.foobar);
            });

            return o.c.bind(o);
        })
        .partial("invariant")

    .context("contract.invariant(invariant, o.f)")
        .topic.is(function() {
            var o = {
                foobar: 50,
                c: function(mutator) {
                    return this[mutator] = 42;
                }  
            };

            o.c = contract.invariant(function() {
                before.foobar.should.equal(this.foobar);
            }, o.c);

            return o.c.bind(o);
        })
                
.suite();

    
if (module.parent) {
    suite["export"](module);
} else {
    suite.run({
        reporter: is.reporter
    }, function() {
        is.end();
    }); 
}

    