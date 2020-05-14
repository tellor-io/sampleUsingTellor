# contracts

Work in process.

Based on design by contract.

Motivation :

	var f = function(a, b) {
		return a + b;
	}

	var f = f.pre(function(a, b) {
		a.should.be.a("number").and.above(0);
		b.should.be.a("number").and.above(0);
	}).post(function(ret, a, b) {
		ret.should.be.equal(a + b);
	});