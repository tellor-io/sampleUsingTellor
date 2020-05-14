// A method that generates a function which will wrap the function `f` and
// call the pre condition with (arg1, arg2, ...)
var constructPre = function _constructPre(f, pre) {
    return function _wrapped() {
        pre.apply(this, arguments);
        return f.apply(this, arguments);
    };
};


// A method that generates a function which will wrap the function and 
// call the post condition with (ret, arg1, arg2, ...)
var constructPost = function _constructPost(f, post) {
    return function _wrapped() {
        var arr = [f.apply(this, arguments)];
        post.apply(this, arr.concat.apply(arr, arguments));
        return arr[0];
    };
};

// A method that generates a function which will wrap the function `f` and
// call the invariant with (before, arg1, arg2, ...)
var constructInvariant = function _constructInvariant(f, invariant) {
    return function _wrapped() {
        var before = JSON.parse(JSON.stringify(this));
        var ret = f.apply(this, arguments);
        var arr = [before];
        invariant.apply(this, arr.concat.apply(arr, arguments));
        return ret;
    };
}

// Handle multiple APIs. Either this was wrapped `construct(f).pre(pre)` or
// This was called from the function prototype `f.pre(pre)` or this was 
// called from the Construct object `Construct.pre(pre, f)` 
var handleMultipleAPIs = function _handleMultipleAPIs(obj, method, f) {
    if (this._wrapped) {
        f = this._wrapped;
        this._wrapped = method(f, obj);
        return this;
    } else if (f === undefined) {
        f = this;
        return method(f, obj);
    } else {
        return method(f, obj);
    }
};

// The contract object.
var Contract = {
    // handle multiple APIs. Pass the function & pre conditions into constructPre
    "pre": function _pre(pre, f) {
        return handleMultipleAPIs.call(this, pre, constructPre, f);
    },
    // handle multiple APIs. Pass the function & post condition into constructPost
    "post": function _post(post, f) {
        return handleMultipleAPIs.call(this, post, constructPost, f);
    },
    // handle multiple APIs. Pass the function & invariant condition into constructInvariant
    "invariant": function _invariant(invariant, f) {
        return handleMultipleAPIs.call(this, invariant, constructInvariant, f);
    },
    // unwrap the Constract object
    "valueOf": function _valueOf() {
        return this._wrapped;
    }
};

// defaults object. By default inject into Function.prototype
var defaults = {
    natives: true
};

// ContractFactory generates a new Contract based on the passed function `f`
var ContractFactory = function _create(f) {
    var c = Object.create(Contract);
    c._wrapped = f;
    return c;
}

// contract = require("constract");
// Sets up the contract object basedon the options.
// If `natives === true` inject the methods into Function.prototype.
module.exports = function(options) {
    Object.keys(defaults).forEach(function(key) {
        if (options && options[key]) {
            defaults[key] = options[key];
        }
    });

    if (defaults.natives) {
        defineProperties(Function.prototype)
    }

    return ContractFactory;
};

// define the properties on `ContractFactory`
defineProperties(ContractFactory);

// Define the pre, post & invariant objects onto an object.
function defineProperties(obj) {
    Object.defineProperties(obj, {
        "pre": {
            value: Contract.pre,
            configurable: true
        },
        "post": {
            value: Contract.post,
            configurable: true
        },
        "invariant": {
            value: Contract.invariant,
            configurable: true
        }
    });
}