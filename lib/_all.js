

/* 
	PER COMPILAZIONE _PLUS:
		- inserito il ritorno alla funzione di _.js e creata la var _
		- commentato l'ultimo rigo di _string.js (integrazione con _) 
		- inserito blocco di codice alla fine del file che integra _string come mixin di _ e re-invoca l'export di tutto _
*/





//     Underscore.js 1.3.1
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

var _ = (function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.1';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      if (index == 0) {
        shuffled[0] = value;
      } else {
        rand = Math.floor(Math.random() * (index + 1));
        shuffled[index] = shuffled[rand];
        shuffled[rand] = value;
      }
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return slice.call(iterable);
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var result = [];
    _.reduce(initial, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) {
        memo[memo.length] = el;
        result[result.length] = array[i];
      }
      return memo;
    }, []);
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        func.apply(context, args);
      }
      whenDone();
      throttling = true;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.escape || noMatch, function(match, code) {
           return "',_.escape(" + unescape(code) + "),'";
         })
         .replace(c.interpolate || noMatch, function(match, code) {
           return "'," + unescape(code) + ",'";
         })
         .replace(c.evaluate || noMatch, function(match, code) {
           return "');" + unescape(code).replace(/[\r\n\t]/g, ' ') + ";__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', '_', tmpl);
    if (data) return func(data, _);
    return function(data) {
      return func.call(this, data, _);
    };
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

  return _;

}).call(this);






// Underscore.string
// (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
// Underscore.strings is freely distributable under the terms of the MIT license.
// Documentation: https://github.com/epeli/underscore.string
// Some code is borrowed from MooTools and Alexandru Marasteanu.

// Version 2.0.0

(function(root){
  'use strict';

  // Defining helper functions.

  var nativeTrim = String.prototype.trim;

  var parseNumber = function(source) { return source * 1 || 0; };

  var strRepeat = function(i, m) {
    for (var o = []; m > 0; o[--m] = i) {}
    return o.join('');
  };

  var slice = function(a){
    return Array.prototype.slice.call(a);
  };

  var defaultToWhiteSpace = function(characters){
    if (characters) {
      return _s.escapeRegExp(characters);
    }
    return '\\s';
  };

  var sArgs = function(method){
    return function(){
      var args = slice(arguments);
      for(var i=0; i<args.length; i++)
        args[i] = args[i] == null ? '' : '' + args[i];
      return method.apply(null, args);
    };
  };

  // sprintf() for JavaScript 0.7-beta1
  // http://www.diveintojavascript.com/projects/javascript-sprintf
  //
  // Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
  // All rights reserved.

  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    var str_repeat = strRepeat;

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          } else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
          }
          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw('[_.sprintf] huh?');
                }
              }
            }
            else {
              throw('[_.sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw('[_.sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();



  // Defining underscore.string

  var _s = {
              
    VERSION: '2.0.0',

    isBlank: sArgs(function(str){
      return (/^\s*$/).test(str);
    }),

    stripTags: sArgs(function(str){
      return str.replace(/<\/?[^>]+>/ig, '');
    }),

    capitalize : sArgs(function(str) {
      return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
    }),

    chop: sArgs(function(str, step){
      step = parseNumber(step) || str.length;
      var arr = [];
      for (var i = 0; i < str.length;) {
        arr.push(str.slice(i,i + step));
        i = i + step;
      }
      return arr;
    }),

    clean: sArgs(function(str){
      return _s.strip(str.replace(/\s+/g, ' '));
    }),

    count: sArgs(function(str, substr){
      var count = 0, index;
      for (var i=0; i < str.length;) {
        index = str.indexOf(substr, i);
        index >= 0 && count++;
        i = i + (index >= 0 ? index : 0) + substr.length;
      }
      return count;
    }),

    chars: sArgs(function(str) {
      return str.split('');
    }),

    escapeHTML: sArgs(function(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                            .replace(/"/g, '&quot;').replace(/'/g, "&apos;");
    }),

    unescapeHTML: sArgs(function(str) {
      return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
    }),

    escapeRegExp: sArgs(function(str){
      // From MooTools core 1.2.4
      return str.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
    }),

    insert: sArgs(function(str, i, substr){
      var arr = str.split('');
      arr.splice(parseNumber(i), 0, substr);
      return arr.join('');
    }),

    include: sArgs(function(str, needle){
      return str.indexOf(needle) !== -1;
    }),

    join: sArgs(function(sep) {
      var args = slice(arguments);
      return args.join(args.shift());
    }),

    lines: sArgs(function(str) {
      return str.split("\n");
    }),

    reverse: sArgs(function(str){
        return Array.prototype.reverse.apply(String(str).split('')).join('');
    }),

    splice: sArgs(function(str, i, howmany, substr){
      var arr = str.split('');
      arr.splice(parseNumber(i), parseNumber(howmany), substr);
      return arr.join('');
    }),

    startsWith: sArgs(function(str, starts){
      return str.length >= starts.length && str.substring(0, starts.length) === starts;
    }),

    endsWith: sArgs(function(str, ends){
      return str.length >= ends.length && str.substring(str.length - ends.length) === ends;
    }),

    succ: sArgs(function(str){
      var arr = str.split('');
      arr.splice(str.length-1, 1, String.fromCharCode(str.charCodeAt(str.length-1) + 1));
      return arr.join('');
    }),

    titleize: sArgs(function(str){
      var arr = str.split(' '),
          word;
      for (var i=0; i < arr.length; i++) {
        word = arr[i].split('');
        if(typeof word[0] !== 'undefined') word[0] = word[0].toUpperCase();
        i+1 === arr.length ? arr[i] = word.join('') : arr[i] = word.join('') + ' ';
      }
      return arr.join('');
    }),

    camelize: sArgs(function(str){
      return _s.trim(str).replace(/(\-|_|\s)+(.)?/g, function(match, separator, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    }),

    underscored: function(str){
      return _s.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/\-|\s+/g, '_').toLowerCase();
    },

    dasherize: function(str){
      return _s.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1-$2').replace(/^([A-Z]+)/, '-$1').replace(/\_|\s+/g, '-').toLowerCase();
    },

    humanize: function(str){
      return _s.capitalize(this.underscored(str).replace(/_id$/,'').replace(/_/g, ' '));
    },

    trim: sArgs(function(str, characters){
      if (!characters && nativeTrim) {
        return nativeTrim.call(str);
      }
      characters = defaultToWhiteSpace(characters);
      return str.replace(new RegExp('\^[' + characters + ']+|[' + characters + ']+$', 'g'), '');
    }),

    ltrim: sArgs(function(str, characters){
      characters = defaultToWhiteSpace(characters);
      return str.replace(new RegExp('\^[' + characters + ']+', 'g'), '');
    }),

    rtrim: sArgs(function(str, characters){
      characters = defaultToWhiteSpace(characters);
      return str.replace(new RegExp('[' + characters + ']+$', 'g'), '');
    }),

    truncate: sArgs(function(str, length, truncateStr){
      truncateStr = truncateStr || '...';
      length = parseNumber(length);
      return str.length > length ? str.slice(0,length) + truncateStr : str;
    }),

    /**
     * _s.prune: a more elegant version of truncate
     * prune extra chars, never leaving a half-chopped word.
     * @author github.com/sergiokas
     */
    prune: sArgs(function(str, length, pruneStr){
      // Function to check word/digit chars including non-ASCII encodings. 
      var isWordChar = function(c) { return ((c.toUpperCase() != c.toLowerCase()) || /[-_\d]/.test(c)); }
      
      var template = '';
      var pruned = '';
      var i = 0;
      
      // Set default values
      pruneStr = pruneStr || '...';
      length = parseNumber(length);
      
      // Convert to an ASCII string to avoid problems with unicode chars.
      for (i in str) {
        template += (isWordChar(str[i]))?'A':' ';
      } 

      // Check if we're in the middle of a word
      if( template.substring(length-1, length+1).search(/^\w\w$/) === 0 )
        pruned = _s.rtrim(template.slice(0,length).replace(/([\W][\w]*)$/,''));
      else
        pruned = _s.rtrim(template.slice(0,length));

      pruned = pruned.replace(/\W+$/,'');

      return (pruned.length+pruneStr.length>str.length) ? str : str.substring(0, pruned.length)+pruneStr;
    }),

    words: function(str, delimiter) {
      return String(str).split(delimiter || " ");
    },

    pad: sArgs(function(str, length, padStr, type) {
      var padding = '',
          padlen  = 0;

      length = parseNumber(length);

      if (!padStr) { padStr = ' '; }
      else if (padStr.length > 1) { padStr = padStr.charAt(0); }
      switch(type) {
        case 'right':
          padlen = (length - str.length);
          padding = strRepeat(padStr, padlen);
          str = str+padding;
          break;
        case 'both':
          padlen = (length - str.length);
          padding = {
            'left' : strRepeat(padStr, Math.ceil(padlen/2)),
            'right': strRepeat(padStr, Math.floor(padlen/2))
          };
          str = padding.left+str+padding.right;
          break;
        default: // 'left'
          padlen = (length - str.length);
          padding = strRepeat(padStr, padlen);;
          str = padding+str;
        }
      return str;
    }),

    lpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr);
    },

    rpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'right');
    },

    lrpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'both');
    },

    sprintf: sprintf,

    vsprintf: function(fmt, argv){
      argv.unshift(fmt);
      return sprintf.apply(null, argv);
    },

    toNumber: function(str, decimals) {
      var num = parseNumber(parseNumber(str).toFixed(parseNumber(decimals)));
      return (!(num === 0 && (str !== "0" && str !== 0))) ? num : Number.NaN;
    },

    strRight: sArgs(function(sourceStr, sep){
      var pos =  (!sep) ? -1 : sourceStr.indexOf(sep);
      return (pos != -1) ? sourceStr.slice(pos+sep.length, sourceStr.length) : sourceStr;
    }),

    strRightBack: sArgs(function(sourceStr, sep){
      var pos =  (!sep) ? -1 : sourceStr.lastIndexOf(sep);
      return (pos != -1) ? sourceStr.slice(pos+sep.length, sourceStr.length) : sourceStr;
    }),

    strLeft: sArgs(function(sourceStr, sep){
      var pos = (!sep) ? -1 : sourceStr.indexOf(sep);
      return (pos != -1) ? sourceStr.slice(0, pos) : sourceStr;
    }),

    strLeftBack: sArgs(function(sourceStr, sep){
      var pos = sourceStr.lastIndexOf(sep);
      return (pos != -1) ? sourceStr.slice(0, pos) : sourceStr;
    }),

    exports: function() {
      var result = {};

      for (var prop in this) {
        if (!this.hasOwnProperty(prop) || prop == 'include' || prop == 'contains' || prop == 'reverse') continue;
        result[prop] = this[prop];
      }

      return result;
    }

  };

  // Aliases

  _s.strip    = _s.trim;
  _s.lstrip   = _s.ltrim;
  _s.rstrip   = _s.rtrim;
  _s.center   = _s.lrpad;
  _s.ljust    = _s.lpad;
  _s.rjust    = _s.rpad;
  _s.contains = _s.include;

  // CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      // Export module
      module.exports = _s;
    }
    exports._s = _s;

  // Integrate with Underscore.js
  } else if (typeof root._ !== 'undefined') {
    // root._.mixin(_s);
    root._.string = _s;
    root._.str = root._.string;

  // Or define it
  } else {
    root._ = {
      string: _s,
      str: _s
    };
  }

}(this || window));

// _.mixin(_.string.exports());





































// TODO: delete this in all files! 
// if(!_){	var _ ={}; }    // development line

//TODO: okkio a _.keys: NON DOVREBBE FUNZIONARE SU IE 6-8!! Includiamo da: 
// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation o:
// http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object  (è lo stesso...)


/** _+ (_plus) extends _.js, with more utility functions  */



////////////////////////////////////////////////////////////////////////////////////////////
		/* console.log replacement */

if( typeof(console) == 'undefined' ) {
	console = {
		log: function(log) {},
		_fake: true
	};
}

////////////////////////////////////////////////////////////////////////////////////////////
		/* General utility extensions */

/** Add several utility functions directly */
_.mixin({
	
	/**
	 * Checks if an object is instance of all passed functions (or at least one, if the last argument is true).
	 * If no functions are passed, only checks that the object is not null or undefined. You can also pass a function directly
	 * as the second argument (instead of an array of functions)
	 */
	is: function(obj, fn, one_at_least){
		if(_.isNull(obj) || _.isUndefined(obj))
			return false;
		if(_.isFunction(fn) || _.isArray(fn)){
			if(typeof obj=="object"){
				var check_fn = function(f){ 
					return (obj instanceof f); 
				};
				if(_.isArray(fn))
					return _.check(fn, check_fn, one_at_least);
				else
					return check_fn(fn);
			}
			else
				return false;
		}
		return true;
	},
	
	isNot: function(obj, null_is_not_undefined){
		return (!!null_is_not_undefined) ? (_.isUndefined(obj)) : (!_.is(obj)); 
	},
	
	valOrDef: function(val, def){
		return _.is(val) ? val : def;
	},
	
	/**
	 * Checks if this object is null, undefined, an empty string or an empty array.
	 * If deep is true and object is an (also multidimensional) array, all its elements will be checked. 
	 */
	isNullOrEmpty: function(obj, deep){
		return ( (!_.is(obj)) || _.isEmpty(obj) ); 
	},
	
	/**
	 * Returns true if obj is not null and not empty. 
	 * If deep is true and object is an (also multidimensional) array, all its elements will be checked.
	 * TODO: add the deep check also for objects
	 */
	isNotEmpty: function(obj, deep){
		if((!!deep) && _.isArray(obj))
			return (!_.check(obj, function(o){ return _.isNullOrEmpty(o, true); }));
		return (!_.isNullOrEmpty(obj,deep)) ;
	},
	
	isNotEmptyString: function(obj){
		return (_.isString(obj) && obj.length>0);
	},
	
	isNotEmptyArray: function(obj){
		return (_.isArray(obj) && obj.length>0);
	},
	
	isNotEmptyObject: function(obj){
		return (_.isObject(obj) && (!_.isEmpty(obj)));
	},
	
	isInt: function(obj){
		return _.isNumber(obj) ? (""+obj).indexOf(".")<0 : false;
	},
	
	isChar: function(obj){
		return (_.isString(obj) && obj.length==1);
	},
	
	isAlphabetical: function(str){
		if(_.isNotEmptyString(str)){
			var new_str = ""+str;
			var low_case = new_str.toLowerCase();
			var chars = _.chars(low_case);
			var found = _.find(chars, function(char){
				return (!_.isLetter(char));
			});
			return (!found); 
		}
		else
			return false;
	},
	
	isLetter: function(char, include_accents){
		var possibles = ["a","b","c","d","e","f","g","h","i","l","m","n","o","p","q","r","s","t","u","v","z","x","y","w","j","k",
		                 "A","B","C","D","E","F","G","H","I","L","M","N","O","P","Q","R","S","T","U","V","Z","X","Y","W","J","K"];
		if(!_.isBoolean(include_accents))
			include_accents = true;
		if(include_accents)
			possibles = possibles.concat(["à","è","é","ì","ò","ù"]);
		return _.include(possibles, char);
	},
	
	isDigit: function(obj){
		return _.include(["0","1","2","3","4","5","6","7","8","9"],obj);
	},
	
	isVocal: function(char){
		return _.include(["a","A","e","E","i","I","o","O","u","U","j","J","y","Y"],char);
	},
	
	adjustedLastChar: function(word){
		var char = _.isNotEmptyString(word) ? word[word.length-1] : null;
		if(_.is(char)){
			if( (char=="'" || char=="?" || char=="!") && word.length>1)
				char = word[word.length-2];
			
			if(char=="à" || char=="A")
				char = "a";
			else if(char=="è" || char=="é" || char=="E")
				char = "e";
			else if(char=="ì"  || char=="I")
				char = "i";
			else if(char=="ò"  || char=="O")
				char = "o";
			else if(char=="ù"  || char=="U")
				char = "u";			
		}
		return char;
	},
	tryMale: function(word, female){
		var char = _.adjustedLastChar(word);
		return ( _.is(char) && _.include( ((!!female) ? ["a","e"] : ["i","o","u"]), char ) );
	},
	tryPlural: function(word, italian){
		var char = _.adjustedLastChar(word);
		return ( _.is(char) && _.include( ((!!italian) ? ["e","i"] : ["s"]) ), char );
	},
	
	tryItalianArticle: function(word, plural, male){
		if(_.isNotEmptyString(word)){
			if(!_.is(plural))
				plural = _.tryPlural(word, italian);
			if(!_.is(male))
				male = _.tryMale(word);
			var first = word[0];
			var second = (word.length>1) ? word[1] : ""; 
			return plural ? ( male ? "i" : "le" ) : ( _.isVocal(first) ? "l'" : ( male ? ( _.isVocal(second) ? "il" : "lo" ) : "la" ) );
		}
	},
	
	/**
	 * Checks if all elements of an array (or one at least, if the last argument is true) pass a check function 
	 */
	check: function(arr, check_fn, one_at_least){
		return (!!one_at_least) ? _.any(arr, check_fn) : _.all(arr, check_fn); 
	},
	
	/**
	 * Adds a value, if not null, to an object. If the object is an array or a string the value is appended, if it's an object the value will 
	 * be set as a field named as specified with the name_or_prepend parameter, or (if the parameter is missing) the two objects will be put in a
	 * result array. 
	 * If obj is null, a new array containing the value will be returned, so that you can chain multiple add calls to fill an (also initially null) array. 
	 * If obj is an object that already contains the named field, its value will be overwrited.
	 * If either obj and value are arrays, their value will be concatenated in the result array and the name_or_prepend parameter will be used
	 * to specify where to insert value elements: if it's true the elements will be inserted at the beginning of obj, else they will be pushed.
	 * If either obj and value are null, a new empty array will be returned.
	 */
	add : function(obj, value, name_or_prepend, separator_if_string){
		if(!_.is(obj))
			obj = new Array();
		if(_.is(value)){
			if(_.isArray(obj)){
				if(_.isArray(value)){
					if(!!name_or_prepend)
						obj = value.concat(obj);
					else
						obj = obj.concat(value);
				}
				else{
					if(!!name_or_prepend)
						obj.unshift(value);
					else
						obj.push(value);
				}
			}
			else if(_.isString(obj)){
				if(_.isNotEmptyString(value)){
					var sep = _.isString(separator_if_string) ? separator_if_string : " ";
					obj = _.isNotEmptyString(obj) ? ((!!name_or_prepend) ? (value+sep+obj) : (obj+sep+value)) : value;
				}
			}
			else{
				if(_.isNotEmptyString(name_or_prepend))
					obj[name_or_prepend] = value;
				else
					obj = (!!name_or_prepend) ? [ value, obj ] : [ obj, value ];
			}
		}
		return obj;
	},
	
	/** 
	 * Insert obj (or its elements, if it's an array) at the beginning of the arr array.
	 */
	addAsFirst : function(arr, obj){
		return _.add(arr, obj, true);
	},
	
	/**
	 * Add an object to an array (using _.add) if it's not already present. If weak_unique is true, the unicity test will be weak 
	 * (using the == operator instead of the === one). If prepend is true, obj will be inserted at the beginning of arr.
	 */ 
	addUnique : function(arr, obj, weak_unique, prepend){
		if(_.isNotEmptyArray(obj)){
			_.each(obj, function(obj_item){
				arr = _.addUnique(arr, obj_item, weak_unique, prepend);
			});
			return arr;
		}
		else{
			var has_to_add = ( _.is(obj) && _.isArray(arr) ) ? ( (!!weak_unique) ? (!_.weakInclude(arr, obj)) : (!_.include(arr, obj)) ) : true; 
			return has_to_add ? _.add(arr,obj,prepend) : arr;
		}
	},
	
	
	/**
	 * Adds a value to an array, eventually before another value (if it's found)
	 */
	addBefore: function(arr, value, another_value){
		return _.addBeforeOrAfter(arr, value, another_value, true);
	},
	/**
	 * Adds a value to an array, eventually after another value (if it's found)
	 */
	addAfter: function(arr, value, another_value){
		return _.addBeforeOrAfter(arr, value, another_value, false);
	},
	/**
	 * Adds a value to an array, eventually before or after another value 
	 * (if it's found), depending on the 'before' flag 
	 */
	addBeforeOrAfter: function(arr, value, another_value, before){
		if(_.isNotEmptyArray(arr)){
			var index = _.indexOf(arr, another_value);
			var pos = (index>=0) ? ( (!!before) ? index : 
					( (index<arr.length-1) ? (index+1) : -1 ) ) : -1;
			if(pos>=0)
				arr.splice(pos,0,value);
			else
				arr.push(value);
			return arr;
		}
		else
			return [value];
	},
	
	/**
	 * 
	 */
	indexOfIgnoreCase: function(str, substr){
		return (_.isNotEmptyString(str) && _.isNotEmptyString(substr)) ? str.toLowerCase().indexOf(substr.toLowerCase()) : -1;
	},
	
	/**
	 * Extract from a string array the values that contains a substring ignoring case. 
	 */
	filterContainsIgnoreCase: function(arr, substr){
		return (_.isArray(arr) && _.isNotEmptyString(substr)) ? _.filter(arr, function(value){ return (_.indexOfIgnoreCase(value,substr)>=0); }) : arr;
	},
	
	/**
	 * Return an ordered copy of an array, using the specified comparator function. 
	 * The comparator function receives two arguments and returns a negative number if the first is smallest 
	 * than the second, a positive number if the first is greater than the second and 0 if the two arguments are equal.
	 * If the second argument is an array, the function assumes it contains already ordered items, and return an array 
	 * with all the items present in the first array, where: the elements that matches the items in the second argument beeing ordered as specified,
	 * the rest of elements are appended at the end; the comparison are done with the equals operator ==. 
	 */
	orderBy: function(arr, comparator_or_ordered_items){
		if(_.isNotEmptyArray(arr)){
			if(_.isFunction(comparator_or_ordered_items)){
				var ret = new Array();
				_.each(arr, function(elem){
					var pos = -1;
					for(var i=0; i<ret.length && pos<0; i++){
						if(comparator_or_ordered_items.call(null,elem,ret[i])<0)
							pos = i;
					}
					if(pos>=0)
						ret.splice(pos,0,elem);
					else
						ret.push(elem);
				});
				return ret;
			}
			else if(_.isNotEmptyArray(comparator_or_ordered_items)){
				var elems = _.deepClone(arr);
				var ret = new Array();
				_.each(comparator_or_ordered_items, function(ordered_item){
					if(_.is(ordered_item)){
						var pos = -1;
						for(var i=0;i<elems.length && pos<0;i++)
							if(_.is(elems[i]) && elems[i]==ordered_item)
								pos = i;
						if(pos>=0){
							ret.push(elems[pos]);
							elems[pos] = null;
						}
					}
				});
				_.each(elems, function(rest_elem){
					if(_.is(rest_elem))
						ret.push(rest_elem);
				});
				return ret;
			}
		}
		return arr;
	},
	
	/**
	 * Returns true if obj is an object
	 */
	isObject : function(obj){
		return (!!obj) && (typeof obj=="object") && (!_.isArray(obj));
	},
	/**
	 * Returns true if obj is a text node
	 */
	isTextNode : function(obj){
		return (!!obj) && (obj.nodeType == 3 || obj.nodeType == 4);
	},
	/**
	 * Returns true if obj is an HTML fragment
	 */
	isFragment : function(obj){
		return (!!obj) && obj.nodeType == 11;
	},
	/**
	 * Returns true if obj is a significative DOM object (Element, Fragment or Text nodes)
	 */
	isDOM : function(obj){
		return (!!obj) && (obj.nodeType == 1 || obj.nodeType == 3 || obj.nodeType == 4 || obj.nodeType == 11);
	},
	
	/**
	 * Assigns an object to another object, a function, or a default value
	 * TODO: still uses eval to parse the object...
	 */ 
	assign : function(obj_name, obj_value, default_value){
		eval("if(_.isFunction("+obj_value+")) { "+obj_name+"=new "+obj_value+"; } " +
				"else if("+obj_value+" != null){ "+obj_name+"="+obj_value+"; } " +
				"else "+obj_name+"="+default_value);
	},
	
	/**
	 * If elem is an array, returns the first element that passes the test_fn test; if elem is an object, directly test it.
	 * Returns null if no objects are found.
	 */
	findOrGet : function(elem, test_fn){
		return _.isArray(elem) ? _.find(elem, test_fn) : ( test_fn(elem) ? elem : null );
	},
	
	/**
	 * Extract the first element found from a collection
	 */
	extractFirst: function(obj_or_array, extractor_fn, context){
		var ret = null;
		_.each(obj_or_array, function(elem, key){
			if(ret==null)
				ret = extractor_fn.call(context, elem, key);
		});
		return ret;
	},
	
	/**
	 * Parses a string to an object
	 * TODO: still uses eval to parse the object...
	 */
	parse : function(value, dont_parse_functions){
		var ret = value;
		if(_.isString(value)){
			value = _.trimBounds(value);
			if( _.startsWith(value,"{") || _.startsWith(value,"[") || ((!dont_parse_functions) && _.startsWith(value,"function(")) ){  
				//try{
					eval("ret = "+value);
				//}catch(err){}
			}
		}
		return ret;
	},
	// TODO: questa versione dovrebbe essere meglio (non sostituita a parse
	// per evitare eventuali problemi in progetti pre-esistenti)...
	catchedParse: function(value, def_if_exception){
		if(_.isString(value)){
			try{
				var ret = null;
				eval("ret = "+value);
				return ret;
			}catch(err){
				if(_.is(def_if_exception))
					return def_if_exception;
			}
		}
		return value;
	},
	
	
	parseCommaArray: function(str){
		var ret = new Array();
		
		if(_.isNotEmptyString(str)){
			var items = str.split(",");
			_.each(items, function(item){
				item = _.trim(item);
				if(_.isNotEmptyString(item))
					ret.push(item);
			});
		}
		
		return ret;
	},
	
	// TODO: manage log levels and properties (area, type, key) for a full-json log policy, enabling powerful logs displaying...
	log : function(msg_or_obj, level, area, type, key){
		var msg = _.toStr(msg_or_obj);
		console.log(msg);
	},
	
	/**
	 * Returns a random number between a max (def:1) and a min (def:0), eventually as an integer, or a random item or field if
	 * the first argument is an array or an object.
	 */
	random : function(max_or_array_or_object, min_or_int_value, int_value){
		var size = _.hasFields(max_or_array_or_object) ? (_.fieldsLength(max_or_array_or_object)-1) : -1;
		var ret_it = (size>=0 || min_or_int_value===true || int_value===true);
		var max = (size>=0) ? size : ( _.isNumber(max_or_array_or_object) ? ( (!!int_value) ? max_or_array_or_object : max_or_array_or_object) : 1 );
		var min = (size>=0) ? 0 : ( _.isNumber(min_or_int_value) ? min_or_int_value : (max/2) );
		// the +1 is needed to avoid that first and last numbers have an half probability than others (ex, between 0 and 2: 0-0.5, 0.5-1.5, 1.5-2)
		var max_rand = (max-min+(ret_it ? 1 : 0)); 
		var rand = Math.random() * max_rand;
		if(ret_it){
			if(rand==max_rand) // it's just the max number, that is the real max + 1 (see before...)
				rand--;
			else
				rand = Math.floor(rand);
		}
		rand += min;
		return (size>=0) ? _.field(max_or_array_or_object,(_.isArray(max_or_array_or_object) ? rand : _.keys(max_or_array_or_object)[rand])) : rand;
	},
	
	boolRandom: function(probability, probability_value){
		if(!_.isBoolean(probability_value))
			probability_value = true;
		var num = (probability==1) ? (probability_value ? 1 : 0) : _.random(_.isNumber(probability) ? probability : 1, 0, true);
		return (!!probability_value) ? (num>0) : (num==0);
	},
	
	isNumberString: function(str){
		if(_.isString(str)){
			var c = null;
			for(var i=0;i<str.length;i++){
				c = str.charAt(i);
				if( ! (_.isDigit(c) || c=="." || c=="-") )
					return false;
			}
			return true;
		}
		else
			return false;
	},
	
	// try to parse a boolean (boolean default value or third arg = false), 
	// int (third arg = true) or number (third arg not specified), 
	// returning a default value or undefined if the operation fails. 
	tryParse: function(obj, def, is_int_or_is_boolean){
		var is_bool = (def===true || def===false || is_int_or_is_boolean===false);
		var is_int = is_bool ? false : (is_int_or_is_boolean===true);
		var ret;
		try{
			if(_.isString(obj))
				ret = is_bool ? ((obj==="true" || obj==="1") ? true : ((obj==="false" || obj==="0") ? false : undefined)) : 
						( _.isNumberString(obj) ? ( is_int ? parseInt(obj) : parseFloat(obj) ) : undefined );
			else
				ret = (is_bool) ? (_.isBoolean(obj) ? obj : undefined) : (_.isNumber(obj) ? (is_int ? Math.floor(obj) : obj) : undefined);
		}catch(err){}
		return (_.is(ret) && (!_.isNaN(ret))) ? ret : def;
	},
	
	// NOTE that the maximum Javascript approsimation is about 10 to the 16 (because of the same considerations of _.maxInteger()).
	// Above this limit (if the difference between two operands is major than that), the operations are approximated.  
	maxNumber: function(negative){
		return Number.MAX_VALUE * ((!!negative) ? -1 : 1);
	},
	minNumber: function(negative){
		return Number.MIN_VALUE * ((!!negative) ? -1 : 1);
	},
	// Js numbers are 64-bit based, with 53 bit for the mantissa: 2 to the 53 is 9007199254740992.
	// This value is the maximum value that supports correct integer operations! 
	maxInteger: function(negative){
		return 9007199254740992 * ((!!negative) ? -1 : 1);
	},
	// This is (about...) the maximum Date in Javascript (values greater than that originate 'Invalid Date').
	// So, the maximum valid date range is about [270.000 AC,270.000 DC]
	maxDate: function(ac){
		return new Date(270000 * ((!!ac) ? -1 : 1),0,0,0,0,0,1);
	},
	
	module: function(number){
		return (number<0) ? (number * -1) : number;
	},
	numsComp: function(first, second, compare_type){
		if(compare_type>0)
			return (first > second);
		else if(compare_type<0)
			return (first < second);
		else
			return (first==second);
	},
	
	round: function(number, decimals){
		decimals = (decimals===true) ? 2 : _.tryParse(decimals, 0, true);
		var mult = 1;
		for(var i=0;i<decimals;i++)
			mult = mult*10;
		number = _.tryParse(number, 0) * mult;
		return (Math.round(number)/mult);
	},
	// to be the single one round... TODO: invece che min_decimals, mettiamo significant_digits, cioè quante cifre dopo gli zero vuoi...
	intelligentRound: function(number, min_decimals){
		if(number==0)
			return 0;
		var negative = (number<0);
		var module = negative ? (number*-1) : number;
		var digits = _.is(min_decimals) ? min_decimals : 0;
		
		// var min = (digits>1) ? (1/Math.pow(10,digits-1)) : 0;
		var rounded = _.round(module, digits);
		while(/*rounded<min*/ rounded==0){
			digits++;
			// min = (digits>1) ? (1/Math.pow(10,digits-1)) : 0;
			rounded = _.round(module, digits);
		}
		return negative ? (rounded*-1) : rounded;
	},
	
	/**
	 * Limits a number between a min and a max. If the second parameter is an array, the number will be limited to the possibile positions in the array (0-length-1)...
	 * @param number
	 * @param min
	 * @param max
	 * @returns
	 */
	limit: function(number, min, max){
		number = _.tryParse(number, 0);
		if(_.isArray(min)){
			max = min.length-1;
			min = 0;
		}
		else{
			min = _.tryParse(min);
			max = _.tryParse(max);
		}
		if(_.isNumber(min) && number<min)
			number = min;
		else if(_.isNumber(max) && number>max)
			number = max;
		return number;
	},
	
	/** Return the average value of the numbers in values (without checking...) */
	average: function(values){
		var ret = 0;
		if(_.isArray(values)){
			_.each(values, function(value){
				ret += value;
			});
			ret = (ret / values.length);
		}
		return ret;
	},
	
	/** Return the variance of the numbers in values (without checking...).
	 *  It's possible to pass the average of the values (in the case it's already been 
	 *  calculated), otherwise the function will calculate it. */
	variance: function(values, average){
		var ret = 0;
		if(_.isArray(values)){
			var av = _.is(average) ? average : _.average(values);
			_.each(values, function(value){
				if(value>av)
					ret += (value - av);
				else 
					ret += (av - value);
			});
			ret = (ret / values.length);
		}
		return ret;
	},
	
	
	/**
	 * Attempts to return a JSON string with all the obj properties, returning a less meaningful rapresentation if it's a circular structure
	 * (and then cannot be printed in JSON).
	 * TODO: insert DOM printing in _.dom plus! :-D
	 */
	toStr : function(obj, print_children_if_dom){
		/*if(_.isDOM(obj))
			return _.DOM.toString(obj, print_children_if_dom);
		else*/ 
		if(_.isString(obj))
			return obj;
		else if(_.is(obj)){
			try{
				return JSON.stringify(obj, null, '  ');
			}catch(err){
				return "Stringify error for input: "+obj+" (type: "+(typeof obj)+"), error: "+err;
			}
		}
		else
			return ""+obj;
	},
	
	deepToStr: function(obj, max_cycle_depth, recursing, cycle_depth){
		if(_.isObject(obj) || _.isArray(obj)){
			if(!_.is(max_cycle_depth))
				max_cycle_depth = 10;
			if(!_.is(cycle_depth))
				cycle_depth = 0;
			
			var ret = _.isObject(obj) ? {} : new Array();
			_.each(obj, function(val, key){
				var cycle = false;
				try{
					JSON.stringify(val);
				}catch(err){
					cycle = true;
				}
				if(cycle){
					if(cycle_depth>max_cycle_depth)
						ret[key] = ("Cyclic value at depth level "+cycle_depth+": "+val);
					else{
						cycle_depth++;
						ret[key] = _.deepToStr(val, max_cycle_depth, true, cycle_depth); 
					}
				}
				else
					ret[key] = _.deepToStr(val, max_cycle_depth, true);
			}, this);
		}
		else
			ret = obj;
		return (!!recursing) ? ret : _.toStr(ret);
	},
	
	/**
	 * Returns the right or left part of a string within a starting or ending bound; matches can be a single string or an array of strings, 
	 * starting selects the starting or ending bound. 
	 */
	strWithinBound : function(str, matches, ending){
		var fn = function(match){ 
			return (!!ending) ? _.endsWith(str,match) : _.startsWith(str,match); 
		};
		var bound = _.findOrGet(matches, fn);
		if(!!bound)
			return (!!ending) ? _.strLeftBack(str,bound) : _.strRight(str,bound);
		else
			return str;
	},
	
	/** 
	 * Return the substring of str included within a set of starting and ending matches.
	 * If ending_match_or_bound is a boolean, it identifies the starting or ending bound; if it's a string it identifies the ending match,
	 * else both starting and ending matches are considered equal to the match parameter.
	 * If starting_match or ending_match are arrays, they will considered as a set of possible starting or ending matches.
	 * If one of the matches is not found, the substring is calculated from the beginning or ending of the string itself.
	 */
	strWithin : function(str, match, ending_match_or_bound){
		if(!!match){
			if(ending_match_or_bound===true || ending_match_or_bound===false)
				str = _.strWithinBound(str, match, ending_match_or_bound);
			else{
				str = _.strWithinBound(str, match);
				str = _.strWithinBound(str, ( _.isString(ending_match_or_bound) ? ending_match_or_bound : match ), true);
			}
		}
		return str;
	},
	
	/**
	 * Trims the bounds of the str object within the characters in chars string. The inner part of the string is not manipulated.
	 * The default trim character, used if chars is not provided, is the whitespace. 
	 */
	trimBounds : function(str, chars){
		return _(str).chain().ltrim(chars).rtrim(chars).value();
	},
	
	replaceInString: function(str, find, replace, ignore_case){
		return str.replace(new RegExp(find.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore_case?"gi":"g")),(typeof(replace)=="string")?replace.replace(/\$/g,"$$$$"):replace);
	},
	
	removePrefix: function(str, prefix_or_prefixes){
		if(_.is(prefix_or_prefixes)){
			var prefixes = _.asArray(prefix_or_prefixes);
			_.each(prefixes, function(prefix){
				if(_.startsWith(str, prefix))
					str = str.substring(prefix.length);
			});
		}
		return str;
	},
	
	plural: function(char, arr_or_obj_or_anyway, empty_is_singular){
		var sing = _.isArray(arr_or_obj_or_anyway) ? ( arr_or_obj_or_anyway.length==0 ? (!!empty_is_singular) : (arr_or_obj_or_anyway.length==1) ) :
				( _.is(arr_or_obj_or_anyway) ? true : (!!empty_is_singular) );
		if(sing)
			return char;
		var plurals = {
			"a" : "e",
			"e" : "i",
			"i" : "i",
			"o" : "i",
			"u" : "i"
		};
		return plurals[char];
	},
	
	/**
	 * If argument is a string it's splitted around the ',' character and returned as an 
	 * array of the trimmed values. If the argument is an array, it will be immediatly returned.
	 * If it's another object, this method will return null.
	 * If the str object is not a string, it will be returned directly without manipulations.
	 * TODO: delete this when a more precise parsing is done with _.parse... embed this in _.parse, or _.obj, or _.arr...
	 * TODO: NON funziona con array che contengono oggetti... ma serve?!? Facciamolo direttamente con il parsing...
	 * Ora anche la doc è diversa, abbiamo fatto con parse...
	 */
	strToArr : function(str, separator){
		var parsed = null;
		if(!_.isNotEmptyString(separator))
			separator = ",";
		if(_.isNotEmptyString(str)){
			str = _.ltrim(str);
			if(str.charAt(0)=="[" || str.charAt(0)=="{")
				parsed = _.parse(str);
			else{
				var arr = _(str).chain().strWithin("[","]").words(separator).value();
				var ret = new Array();
				_.each(arr, function(elem){
					 if(_.isString(elem))
						 elem = _(elem).chain().trimBounds().strWithin(['"',"'"]).value();
					 ret.push(elem);
				});
				parsed = ret;
			}
		}
		else
			parsed = str;
		return _.isArray(parsed) ? parsed : (_.is(parsed) ? [parsed] : null); 
	},
	
	getStackTrace: function(err){
		var stack = (!!err.stack) ? err.stack.replace(/^[^\(]+?[\n$]/gm, '')
			.replace(/^\s+at\s+/gm, '')
			.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
			.split('\n') : [];
		return stack;
	},
	
	printStackTrace: function(err){
		var stack = _.getStackTrace(err);
		console.log(stack);
	},
	
	
	
	/**
	 * Returns the _index-nth element of _array, or null if _array is not an array, or _index is out of its range. 
	 * If _index is not passed, it will be 0. 
	 */
	getInArr : function(_array, _index){
		if(!_.isArray(_array))
			return null;
		_index = _.tryParse(_index,0,true);
		if(_index>=0 && _index<=_array.length)
			return _array[_index];
		else
			return null;
	},
	
	setInArr : function(_array, _index, _value){
		if(!_.isArray(_array))
			return false;
		if(_index>=0 && _index<=_array.length){
			_array[_index] = _value;
			return true;
		}
		else
			return false;
	},
	
	/**
	 * Splits str and pushes the result in arr; is prepend is true, the values will be inserted at the beginning of the arr.
	 */
	splitInArr : function(str, arr, prepend){
		var new_arr=_.strToArr(str);
		return _.add(arr,new_arr,prepend);
	},
	
	/**
	 * Returns a string value of a variable or an empty string if it is not null or undefined.
	 * 
	 * @
	 *
	asString : function(value, default_value, null_is_undefined){
		if(_.isNot(value, null_is_undefined) && (!_.isNot(default_value, null_is_undefined)))
			return default_value;
		else
			return value;
	},
	*/
	
	/**
	 * Returns an array from obj: if it's already an array it's immediatly returned, if it's a string or arguments it's converted in a new Array,
	 * if it's an object it's pushed in a new Array, if it's null an empty Array will be returned, or null if return_null_if_null is true.
	 */
	asArray : function(obj, return_null_if_null){
		return _.is(obj) ? ( _.isArray(obj) ? obj : ( _.isArguments(obj) ? _.argsToArr(obj) : 
					( _.isString(obj) ? _.strToArr(obj) : [obj] ) ) ) : ( (!!return_null_if_null) ? null : new Array() ) ;
	},
	
	/** 
	 * Ensures the value has the specified type. If not, converts and returns the value as specified.
	 * Type can be (bool | int | number | object | array | string(default), or a corresponding primitive javascript value 
	 * (the value will be ignored)).  
	 * If the conversion fails, the function returns null.
	 * If the fallback param is set to true, however, the function returns the following fallbacks: 
	 * { bool: true if the value exists, int or number: 0, object: parsed or converted (from array) object or empty object, 
	 * array: array containing the parsed value or empty array, string: printing of the value or empty string }.
	 * If the fallback param is set to a different value, it will be directly used as the fallback return 
	 * (pass true as the fourth parameter if you want to set the reserved true value, in case of boolean type)
	 */
	ensureIs: function(val, type, fallback, fallback_true_if_boolean){
		if(!_.is(type))
			type = "";
		if(type=="bool" || type=="boolean" || _.isBoolean(type)){
			var def = (!!fallback_true_if_boolean) ? true : ( (fallback===true) ? (!!val) : fallback );
			return _.tryParse(val, def, false);
		}
		else if(type=="int" || type=="number" || _.isNumber(type)){
			var def = (fallback===true) ? 0 : fallback;
			return (type=="int" || _.isInt(type)) ? _.tryParse(val, def, true) : _.tryParse(val, def);
		}
		else if(type=="object" || type=="{}" || _.isObject(type)){
			var def = (fallback===true) ? _.asObject(val) : fallback;
			val = _.parse(val);
			return _.isObject(val) ? val : def;
		}
		else if(type=="array" || type=="[]" || _.isArray(type)){
			var def = (fallback===true) ? _.asArray(val) : fallback;
			val = _.parse(val);
			return _.isArray(val) ? val :  def;
		}
		else if(type=="string" || _.isString(type)){
			var def = (fallback===true) ? _.toStr(val) : fallback;
			return _.isString(val) ? val : def;
		}
	},
	
	/** returns the strings reserved by _plus for primitive javascript type declaration */
	reservedTypeStrings: function(){
		return ["bool","boolean","int","number","object","{}","array","[]","string"];
	},
	
	/**
	 * Returns an object with the key-value pairs in the passed query string, or in location.search (if it's present)
	 */
	queryStringObj: function(query_str){
		var ret = {};
		if(!_.isString(query_str))
			query_str = _.is(location) ? location.search : null;
		if(_.isNotEmptyString(query_str)){
			if(query_str.charAt(0)=="?")
				query_str = query_str.substring(1);
			var arr = query_str.split("&");
			_.each(arr, function(item){
				var key_val = _.isNotEmptyString(item) ? item.split("=") : [];
				if(key_val.length>0)
					ret[key_val[0]] = (key_val.length>1) ? key_val[1] : null;
			});
		}
		return ret;
	},
	
	/**
	 * Returns a reversed copy of the array (does not modify the original array)
	 */
	reverse: function(arr){
		if(_.isNotEmptyArray(arr)){
			var ret = new Array();
			for(var i=arr.length-1; i>=0; i--)
				ret.push(arr[i]);
			return ret;
		}
		else
			return arr;
	},
	
	/** 
	 * Returns true if the array has duplicates
	 * TODO: better implementation (stops when two equal elements are found)
	 */
	hasDuplicate: function(arr){
        return (_.isNotEmptyArray(arr) && (arr.length != _.uniq(arr).length));
	},
	
	/**
	 * Returns a string value of a variable or an empty string if it is not null or undefined.
	 * 
	 * @param value the value to get as String
	 * @returns the string value of variable or an empty string
	 * @author Andrea Cardamone
	 */
	asString : function(obj) {
		return _.getValue(obj, "");
	},
	
	asObject : function(obj, return_null_if_null){
		var ret = _.is(obj) ? ( _.isObject(obj) ? obj : _.asArray(obj) ) : ( (!!return_null_if_null) ? null : {} ) ;
		if(_.isArray(ret)){
			var obj_ret = {};
			var fields = _.fields(ret);
			_.each(fields, function(field){
				obj_ret[field] = _.field(ret, field);
			});
			return obj_ret;
		}
		else
			return ret;
	},
	
	/**
	 * Converts argument in a regular Array.
	 * TODO: verificare compatibilità di questo, trovato sulla guida di Mozilla:
	 * 		https://developer.mozilla.org/en/JavaScript/Reference/functions_and_function_scope/arguments
	 */
	argsToArr : function(args){
		return Array.prototype.slice.call(args);
	},
	
	/**
	 * Removes and returns the first element of arr, if it's a not empty array. Else, returns null.
	 */
	removeFirst : function(arr){
		if(_.isNotEmpty(arr) && _.isArray(arr))
			return arr.shift();
		else
			return null;
	},
	
	/**
	 * Returns the index of the first element in arr that is equal to obj, using the weak == operator.
	 * Returns -1 if no obj is found.
	 */
	weakIndexOf : function(arr, obj, fn_this){
		if(_.isArray(arr))
			for(var i=0;i<arr.length;i++){
				var ref = _.isFunction(obj) ? obj.call(fn_this, arr[i], i) : obj;
				if( arr[i] == ref )
					return i;
			}
		return -1;
	},
	
	/**
	 * Returns the next element in the array, given the current one. Can do weak (==) or full (===) comparison.
	 * Returns the first element in the array if you don't specify a current element, and null if the current element is the last one.
	 * Returns null if the arr argument is not an array or is an amtpy array.
	 * You can specify to go backward. 
	 * You can also pass a coupled array, and the function will return the element of the cuupled array that is present at the found position; 
	 */
	next: function(arr, obj, weak, coupled_arr, backward){
		var pos = -1;
		if(_.isNotEmptyArray(arr)){
			if(_.is(obj)){
				pos = weak ? _.weakIndexOf(arr, obj) : _.indexOf(arr, obj);
				pos = (!backward) ? ( (pos>=0 && (pos<arr.length-1) ) ? pos+1 : -1 ) : ( (pos>0) ? pos-1 : -1 );
			}
			else 
				pos = (!backward) ? 0 : (arr.length-1) ;			
		}
		return (pos>=0) ? ( _.is(coupled_arr) ? _.field(coupled_arr,pos) : arr[pos] ) : null;
	},
	
	prev: function(arr, obj, weak, coupled_arr){
		return _.next(arr, obj, weak, coupled_arr, true);
	},
	
	coupled: function(arr, obj, coupled_arr, weak){
		if(_.isNotEmptyArray(arr) && _.isNotEmptyArray(coupled_arr)){
			var pos = weak ? _.weakIndexOf(arr, obj) : _.indexOf(arr, obj);
			return (pos>=0 && pos<coupled_arr.length) ? coupled_arr[pos] : null;
		}
		else
			return null;
	},
	
	/**
	 * A weak version of _.include, uses == operator instead of ===
	 */
	weakInclude : function(arr, obj, fn_this){
		return (_.weakIndexOf(arr, obj, fn_this)>=0);
	},
	
	/**
	 * Returns a weak clone of obj, that is an object that only clone the direct fields of obj, without cloning their value.
	 * TODO: this is just a name at now, since it directly invokes _.clone(): add a deep clone method (more appropriate for the name...)
	 * NOTE: manage array cloning bug in _.js (they are not cloned in 1.3.3 because of an isObject() test...)
	 */
	weakClone : function(obj){
		if(_.isArray(obj)){
			var ret = new Array();
			return _.add(ret,obj);
		}
		else
			return _.clone(obj);
	},
	
	/**
	 * A deep clone method. PLEASE NOTE that this method doesn't check if an object has a circular structure 
	 * (you can test it with a method like JSON.stringify, that will throw an exception if called on a circular object), so this method can
	 * loop undefinitevely if invoked on such objects. The second boolean argument can be used to add this check to the invocations, to avoid 
	 * stack overflows...
	 * The method automatically detects DOM nodes (that are always circular) and returns a DOM clone of them.
	 * TODO: gestione casi non gestiti (ad esempio se obj è arguments... controlliamo bene...)
	 */
	deepClone : function(obj, do_circular_test_fn_or_true){
		//if(!!do_circular_test_fn_or_true){
			try{
				JSON.stringify(obj);
			}catch(err){
				if(_.isFunction(do_circular_test_fn_or_true))
					do_circular_test_fn_or_true(obj, err);
				// solleviamo in ogni caso (tranne se la eventuale function non solleva una eccezione più dettagliata)
				throw ("Impossibile clonare l'oggetto: struttura circolare. Error:\n"+err); 
			}
		//}
		
		if(_.isString(obj))
			return (""+obj);
		else if(_.isNumber(obj) || _.isNaN(obj))
			return obj;
		else if(_.isNull(obj))
			return null;
		else if(_.isUndefined(obj))
			return undefined;
		else if(_.isDOM(obj))
			return obj.cloneNode(true);
		else if(_.isArray(obj)){
			var arr = new Array();
			for(var i=0;i<obj.length;i++)
				arr[i] = this.deepClone(obj[i]);
			return arr;
		}
		else if(_.isObject(obj)){
			var ret = {};
			var keys = _.keys(obj);
			for(var i=0;i<keys.length;i++)
				ret[keys[i]] = this.deepClone(obj[keys[i]]);
			return ret;
		}
		else
			return obj;
	},
	
	
	/**
	 * Extends an object with a given property key and value. 
	 * If merge_objects is true and two objects are found for a given key, the objects will be recursively merged in a single object.
	 * If add_objects is true, the overlapping fields will become an array field containing both values (if one of the values is an array, 
	 * it will be merged in the result). 
	 *   
	 * TODO: it's better to avoid the real recursion with a plane recursion...
	 * TODO: we should clean the objects from null values, if delete_if_null_value is true....
	 */
	extendProp : function(obj, key, value, merge_objects, add_objects, parse_objects, delete_if_null_value){
		if(_.isObject(obj)){
			var new_value = parse_objects ? _.parse(value) : value;
			if(merge_objects && (_.is(new_value)) && (_.is(obj[key]))){
				if(_.isObject(new_value) && _.isObject(obj[key]))
					_.extendObj(obj[key],new_value,merge_objects,add_objects,false,delete_if_null_value);
				else if(_.isArray(new_value) && _.isArray(obj[key]))
					obj[key] = _.add(obj[key], new_value);
				else
					obj[key] = (/*!(add_objects===false)*/!!add_objects) ? _.add(_.asArray(obj[key]), new_value) : new_value;
			}
			else if(_.is(new_value) || (!!delete_if_null_value))
				obj[key]=new_value;
		}
		return obj;
	},
	
	/**
	 * Extends an object with some field of another object. Invokes _.extendProp internally and then accepts the same optional parameters.
	 */
	extendProps: function(obj, extending_obj, props, merge_objects, add_objects, parse_objects, delete_if_null_value){
		if(!_.isObject(obj))
			obj = {};
		if(_.isObject(extending_obj) && _.isNotEmptyArray(props)){
			_.each(props, function(key){
				var value = extending_obj[key];
				_.extendProp(obj,key,value,merge_objects,add_objects,parse_objects,delete_if_null_value);
			});
		}
		return obj;
	},
	
	/**
	 * Extends a default object with the values of another object.
	 */
	extendDefaults: function(def_obj, extending_obj){
		if( (!_.isObject(def_obj)) || (!_.isObject(extending_obj)) )
			return _.deepClone(def_obj);
		var ret = {};
		_.each(def_obj, function(def_val, def_prop){
			var ext_val = extending_obj[def_prop];
			if(_.is(ext_val)){
				if(_.isBoolean(def_val) || _.isNumber(def_val))
					ret[def_prop] = _.tryParse(ext_val, def_val);
				else if(_.isObject(def_val) || _.isArray(def_val))
					ret[def_prop] = _.catchedParse(ext_val, def_val);
				else
					ret[def_prop] = ext_val;
			}
			else
				ret[def_prop] = def_val;
		});
		return ret;
	},
	
	/**
	 * Extends an object with an extensions object. Invokes _.extendProp internally and then accepts the same optional parameters.
	 */
	extendObj : function(obj, extensions, merge_objects, add_objects, parse_objects, delete_if_null_value){
		if(!_.isObject(obj))
			obj = {};
		if(_.isObject(extensions)){
			_.each(extensions, function(value,key){
				_.extendProp(obj,key,value,merge_objects,add_objects,parse_objects,delete_if_null_value);
			});
		}
		return obj;
	},
	
	
	/** 
	 * Sets the new value and return the previous one. if dont_set_if_null is true, the setting is done only if a value is passed,
	 * otherwise the old value is returned and not modified.
	 */
	setAndGet : function(obj, name, value, dont_set_if_null){
		if(value==null && dont_set_if_null)
			return obj[name];
		else {
			var prev = obj[name];
			obj[name] = value;
			return prev;
		}
	},
	
	/**
	 * Returns a valid array index, trying to parse the name as an int: you can use the return to access an element of an array 
	 * or a field of an object
	 */
	fieldIndex : function(name){
		try{
			return parseInt(name);
		}catch(err){
			return name;
		}
	},
	
	hasFields: function(obj){
		return (_.isObject(obj) || _.isArray(obj));
	},
	
	fieldsLength: function(obj){
		if(_.isArray(obj))
			return obj.length;
		else if(_.isObject(obj))
			return _.keys(obj).length;
		else 
			return 0;
	},
	
	fields: function(obj){
		if(_.isObject(obj))
			return _.keys(obj);
		else if(_.isArray(obj)){
			var ret = new Array();
			for(var i=0; i<obj.length; i++){
				ret.push(i);
			}
			return ret;
		}
		else
			return new Array();
	},
	
	labels: function(obj){
		var fields = _.fields(obj);
		if(_.isArray(obj)){
			for(var i=0;i<fields.length;i++)
				fields[i] = ""+fields[i];
		}
		else
			return fields;
	},
	
	/**
	 * Get or set a property in an object or an item in an array 
	 */
	field : function(obj, name, value, null_is_not_undefined){
		var read = _.isNot(value, null_is_not_undefined);
		if(read){
			if(_.isArray(obj))
				return _.getInArr(obj,name);
			else if(_.isObject(obj))
				return obj[name];
			else
				return null;
		}
		else{
			if(_.isArray(obj)){
				if(_.isNullOrEmpty(name))
					obj.push(value);
				else
					_.setInArr(obj, name, value);
			}
			else if(_.isObject(obj))
				obj[name] = value;
		}
	},
	
	
	/* NOTE: shall we try to do the whole job with 'delete' and reassignment, to keep the object pointer? */
	moveField: function(value, field, up){
		if(_.isObject(value) && _.isNotEmptyString(field)){
			var fields = _.fields(value);
			var pos = _.indexOf(fields, field);
			if(pos<0)
				return;
			var before_pos = (!!up) ? (pos-2) : (pos+1); // last element before the field 
			var after_pos = (!!up) ? (pos-1) : (pos+2); // first element after the field 
			
			var new_value = {};
			if(before_pos>=0 && before_pos<=(fields.length-1)){
				for(var i=0;i<=before_pos;i++)
					if(i!=pos)
						new_value[fields[i]] = value[fields[i]];
			}
			new_value[field] = value[field];
			if(after_pos>=0 && after_pos<=(fields.length-1)){
				for(var i=after_pos;i<fields.length;i++){
					if(i!=pos)
						new_value[fields[i]] = value[fields[i]];
				}
			}
			return new_value;
		}
		else if(_.isArray(value)){
			var new_value = this.moveInArray(value, field, up); // NOTE: it's the same array, unlike the object that is (necessary, until now) cloned!
			return new_value;
		}
		else
			return value;
	},
	
	moveInArray: function(value, src_pos, dest_pos){
		src_pos = _.tryParse(src_pos,-1,true);
		dest_pos = _.isBoolean(dest_pos) ? ( dest_pos ? (src_pos+1) : (src_pos-1) ) : _.tryParse(dest_pos,-1,true);
		if(_.isNotEmptyArray(value) && (src_pos>=0) && (src_pos<value.length) && (dest_pos>=0) && (dest_pos<value.length)){
			var new_value = new Array();
			if(src_pos<dest_pos){
				for(var i=0; i<=dest_pos; i++){
					if(i!=src_pos)
						new_value.push(value[i]);
				}
				new_value.push(value[src_pos]);
				for(var i=dest_pos+1; i<value.length; i++){
					new_value.push(value[i]);
				}
			}
			else{
				for(var i=0; i<dest_pos; i++){
					new_value.push(value[i]);
				}
				new_value.push(value[src_pos]);
				for(var i=dest_pos; i<value.length; i++){
					if(i!=src_pos)
						new_value.push(value[i]);
				}
			}
			return new_value;
		}
		return value;
	},
	
	
	/**
	 * Returns a value if not null or undefined, else returns its default
	 */
	getValue : function(value, default_value, null_is_not_undefined){
		if(_.isNot(value, null_is_not_undefined) && (!_.isNot(default_value, null_is_not_undefined)))
			return default_value;
		else
			return value;
	},
	
	isSelected : function(obj, value_or_conditional_function, weak_equal){
		if(_.isFunction(value_or_conditional_function))
			return (!!value_or_conditional_function.call(null,obj));
		else if(_.isString(obj) && _.isString(value_or_conditional_function))
			return (!!weak_equal) ? (obj.toLowerCase()==value_or_conditional_function.toLowerCase()) : (obj==value_or_conditional_function);
		else
			return (!!weak_equal) ? (obj==value_or_conditional_function) : (obj===value_or_conditional_function);
	},
	
	/**
	 * Remove from an array or object all the values that are equal to a value or pass a conditional function, with the possibility
	 * to specify a weak (==) or strength (===) comparison and to apply the function recursively in the found objects
	 * This method also acts on strings if the first two arguments are strings, and the third parameter is interpreted to make
	 * the comparison ignoring case or not (in this case, weak obviously means ignoring case).
	 */
	remove: function(obj, value_or_conditional_function, weak_equals, deep){
		if(!_.isBoolean(weak_equals))
			weak_equals = true;
		return _.removeFieldInternal(obj, value_or_conditional_function, weak_equals, deep, false);
	},
	
	/**
	 * Remove a field from an object or an array, with the same options in the _.remove function
	 */
	removeField: function(obj, field_name_or_conditional_function, weak_equals, deep){
		if(!_.isBoolean(weak_equals))
			weak_equals = true;
		return _.removeFieldInternal(obj, field_name_or_conditional_function, weak_equals, deep, true);
	},
	
	// TODO: spostare da qualche parte in private...
	removeFieldInternal: function(obj, value_or_conditional_function, weak_equals, deep, field_name){
		if(_.hasFields(obj)){
			var fields = _.fields(obj);
			var result = _.isArray(obj) ? new Array() : {};
			var field = null; var value = null;
			
			for(var i=0;i<fields.length;i++){
				field = _.field(obj, fields[i]);
				if(!_.isSelected( ((!!field_name) ? fields[i] : field) , value_or_conditional_function, weak_equals)){
					value = (deep && _.hasFields(field)) ? 
							_.removeFieldInternal(field, value_or_conditional_function, weak_equals, deep, field_name) : field;
					_.field(result,fields[i],value);
				}
			}
			return result;	
		}
		else if(_.isString(obj) && _.isString(value_or_conditional_function)){
			return _.replaceInString(obj,value_or_conditional_function,"",weak_equals);
		}
		else
			return obj;
	},
	
	/**
	 * Cleans an object from its undefined (and null, if null_is_not_undefined is falsy) values
	 */
	clean: function(obj, only_first_level, null_is_not_undefined){
		var remove_fn = function(obj){
			return _.isNot(obj,null_is_not_undefined);
		};
		return _.remove(obj,remove_fn,undefined,(!only_first_level));
	},
	
	
	/**
	 * Calls a function passing obj as argument, or does it on each element if it's an array. Returns fn itself to mantain chainability.
	 */
	callOn : function(fn, obj, _this){
		if(_.isArray(obj))
			_.each(obj,fn,_this);
		else
			fn.apply(_this,[obj]);
		return fn;
	},


	/**
	 * Calls the fn on the fn_this context recursively for each field of obj or arr, until all the fields are iterated. 
	 * If the fn returns true the current value is not recursed on its fields. The last argument is passed from within the recursion: if it's present, the fn will be called (otherwise it's the outer call: pass a value if you want the fn to be called on the root object too)
     * Tha args before_fn and after_fn can be used to do something before and after the recursion on each field of the current value
	 */
	recursiveEach: function(obj_or_arr, fn, fn_this, before_fn, after_fn, field_name, field_path){
		var fn_ret = _.is(field_name) ? fn.call(fn_this, obj_or_arr, field_name, field_path) : false;
		if( (!fn_ret) && (_.isObject(obj_or_arr) || _.isArray(obj_or_arr)) ){
			if(_.is(field_name))
				field_path = _.isString(field_path) ? (field_path+"/"+field_name) : field_name;
			_.each(obj_or_arr, function(val, name){
              if(_.isFunction(before_fn))
                before_fn.call(fn_this, val, name, field_path);
              _.recursiveEach(val, fn, fn_this, before_fn, after_fn, name, field_path);
              if(_.isFunction(after_fn))
                after_fn.call(fn_this, val, name, field_path);
            });
		}
	},



	
////////////////////////////////////////////////////////////////////////////////////////////
	/* CSV conversions... NB: immaginano che le strutture siano ben formattate, con tutti gli items uguali sia in CSV che in JSON */

	fromCsv: function(csv, line_sep, field_sep, only_fields){
		var ret = new Array();
		var fields = null;
		if(_.isNotEmptyString(csv)){
			if(!_.isNotEmptyString(line_sep))
				line_sep = "\r\n";
			if(!_.isNotEmptyString(field_sep))
				field_sep = ";";
			
			var lines = csv.split(line_sep);
			//_.log("Estratte "+lines.length+" linee dal csv");
			if(_.isNotEmptyArray(lines)){
				_.each(lines, function(line){
					var cols = line.split(field_sep);
					if(_.isNotEmptyArray(cols)){
						var empty_cols = (cols.length==1 && (!_.isNotEmptyString(cols[0])));
						if(!empty_cols){
							var real_cols = new Array();
							_.each(cols, function(col){
								if((_.startsWith(col,"\"") && _.endsWith(col, "\"")))
									col = col.substring(1, col.length-1);
								real_cols.push(col);
							});
							if(!_.is(fields)){
								fields = new Array();
								_.each(real_cols, function(col){
									col = _.basicKeyFromString(col);
									fields.push(col);
								});
								//_.log("Estratti campi dal csv: "+_.toStr(fields));
							}
							else{
								var obj = {};
								for(var i=0; i<fields.length; i++){
									if(_.isNotEmptyArray(only_fields)){
										if(_.weakInclude(only_fields, fields[i]))
											obj[fields[i]] = real_cols[i];
									}
									else
										obj[fields[i]] = real_cols[i];
								}
								ret.push(obj);
							}
						}
					}
				}, this);
			}
		}
		return ret;
	},
	
	basicKeyFromString: function(str){
		var ret = str.trim();
		ret = ret.toLowerCase();
		ret = _.replaceInString(ret," ","_");
		return ret;
	},
	
	toCsv: function(arr, line_sep, field_sep){
		var ret = "";
		if(_.isNotEmptyArray(arr)){
			if(!_.isNotEmptyString(line_sep))
				line_sep = "\r\n";
			if(!_.isNotEmptyString(field_sep))
				field_sep = ";";
			
			_.each(arr, function(obj){
				if(_.isObject(obj) && ret.length==0){
					var keys = _.keys(obj);
					_.each(keys, function(key, pos){
						ret += key;
						if(pos<keys.length-1)
							ret += field_sep;
						else
							ret += line_sep;
					}, this);
				}
				var vals = _.isObject(obj) ? _.values(obj) : (_.isArray(obj) ? obj : _.asArray(obj));
				_.each(vals, function(val, pos){
					ret += val;
					if(pos<vals.length-1)
						ret += field_sep;
					else
						ret += line_sep;
				}, this);
			}, this);
		}
		return ret;
	},
	
	
	
////////////////////////////////////////////////////////////////////////////////////////////
	/*  Function extension, included (and modified...) from: 
		http://www.lshift.net/blog/2006/08/03/subclassing-in-javascript-part-2 */
	
	/**
	 * Function extension: extend a function with a constructor function and 
	 * prototype object. Arguments to the constructor will be passed in the same order
	 * to the superclass constructor: be sure that they are uniform with the superclass 
	 * constructor!
	 *  
	 * The general function extension mechanism is:
	 * The constructor function is prototyped with another function, that extends itself the
	 * superclass and doesn't have a constructor function; so, the result function has the 
	 * prototype of the superclass and the proper constructor without interferences. 
	 * Finally, the prototype argument fields are copied in the constructor function prototype.
	 */ 
	extendFn : function(superclass, constructor_function, prototype) {
		/* Accept either the constructor, the prototype or both */
		if((!_.is(constructor_function)) && (_.isFunction(prototype))){
			constructor_function=prototype;
			prototype=null;
		}
		else if((!_.is(prototype)) && (typeof constructor_function == "object")){
			prototype=constructor_function;
			constructor_function=null;
		}
		/* AND (not present in original...): copies fields eventually present in the 
		 * prototype of constructor function (if it's an already prototyped function)! */
		if(_.is(constructor_function) && _.is(constructor_function.prototype)){
		    if(prototype==null)
		    	prototype={};
			for (var k in constructor_function.prototype) {
		        if(constructor_function.prototype[k]!=null && prototype[k]==null)
		        	prototype[k] = constructor_function.prototype[k];
		    }
	    }
		
		/* Constructor is first invoked on the superclass, then execute itself */
		var constructor=function(){
	        superclass.apply(this, arguments);
	        if(constructor_function!=null)
	        	constructor_function.apply(this, arguments);
	    };
		
	    /* General extension mechanism: */
		var withoutcon = function () {};
	    withoutcon.prototype = superclass.prototype;
	    constructor.prototype = new withoutcon();
	    if(prototype!=null){
		    for (var k in prototype) {
		        if(prototype[k]!=null)
		        	constructor.prototype[k] = prototype[k];
		    }
	    }
	    return constructor;
	},
	

	/**
	 * Return a new function that extends multiple functions. Simply invokes extendFn multiple times...
	 * The function will behaves as expected if superclasses is a single function or an array with one single element.
	 */
	extendFns : function(superclasses, constructor_function, prototype){
		if((!_.isArray(superclasses)) || superclasses.length==1)
			return _.extendFn((_.isArray(superclasses) && superclasses.length>0) ? superclasses[0] : superclasses, constructor_function, prototype);
		if(superclasses.length>0){
			var fn=superclasses[0];
			for(i=1; i<superclasses.length; i++)
				fn = _.extendFn(fn, superclasses[i]);
			return _.extendFn(fn, constructor_function, prototype);
		}
		else
			return _.getFn(constructor_function, prototype);
	},
	

	/**
	 * Simply adds the prototype to the constructor function and returns the resulting function: useful to get it in a single line of code
	 * (ex: when adding a function to an object), or to get a function from its prototype object.
	 * TODO: se viene passata una funzione constructor mi sembra che questa vengo invocata in window! Può darsi che sbagliavo io qualcosa,
	 * ma testiamo questo fatto!
	 */
	getFn : function(constructor_or_prototype, prototype){
		if(_.is(prototype)){
			constructor_or_prototype.prototype=prototype;
			return constructor_or_prototype;
		}
		else{
			var ret = function(){};
			ret.prototype = constructor_or_prototype;
			return ret;
		}
	}

});

/** Declares a private field to keep internal functions not exposed in the _ object */
_._private = {};



////////////////////////////////////////////////////////////////////////////////////////////
	/* ObjectNavigator */

_._private.ObjectNavigator = _.getFn(
	function(root_object_or_separator, separator){
		this.separator = (_.isString(root_object_or_separator) && root_object_or_separator.length>0) ? root_object_or_separator :
				((_.isString(separator) && separator.length>0) ? separator : ".");
		this.root_object = _.hasFields(root_object_or_separator) ? root_object_or_separator : undefined;
	}, 
	{
		sep: function(){
			return this.separator;
		},
		
		path: function(id){
			return (_.isString(id) && id.length>0) ? id.split(this.sep()) : (_.isArray(id) ? id : [id]);
		},
		
		childPath: function(path, name){
			return ""+path+this.sep()+name;
		},
		
		// if a field_path is passed, returns its parent in the full path string or null, else returns the parent path of path 
		// (that will be an empty string, if the parent is the root object, or null, if path is empty or falsy)
		parentPath: function(path, field_path){
			var field_parent = _.isNotEmptyString(field_path);
			var pos = _.isString(path) ? path.lastIndexOf( this.sep()+( field_parent ? field_path : "" ) ) : -1;
			/*if(pos<0 && _.isNotEmptyString(path) && (!field_parent))
				pos=path.length;*/
			return (pos>=0) ? path.substring(0,pos) : null; 
		},
		
		fieldPath: function(path, root_path, also_within){
			if(root_path.charAt(root_path.length-1)!=this.sep())
				root_path+=this.sep();
			var pos = (_.isString(path) && _.isString(root_path)) ? path.indexOf(root_path) : -1;
			return ((pos==0) || ((!!also_within) && pos>0)) ? ( (pos+root_path.length<path.length) ? path.substring( (pos+root_path.length), path.length ) : null ) : null;
		},
		
		fieldName: function(path){
			var sep = this.sep();
			if(_.isString(path) && path.indexOf(sep)>=0)
				return path.substring(path.lastIndexOf(sep)+sep.length, path.length);
			else
				return path;
		},
		
		siblingPath: function(path, prev){
			var items_path = this.parentPath(path);
			var item_pos = _.isNotEmptyString(items_path) ? this.fieldPath(path, items_path) : path;
			item_pos = _.tryParse(item_pos,0,true);
			if(!!prev)
				item_pos--;
			else
				item_pos++;
			return _.isNotEmptyString(items_path) ? this.childPath(items_path, (""+item_pos)) : (""+item_pos);
		},
		
		depth: function(path){
			if(_.isNotEmptyString(path)){
				var sep = this.sep();
				// uniform to /path/other_path/other_path
				if(!_.startsWith(path,sep))
					path = sep+path;
				if(_.endsWith(path, sep))
					path = path.substring(0, path.length-1);
				return _.count(path,sep);
			}
			else
				return 0;
		},
		
		comparePath: function(path, second_path){
			if(!_.isString(path))
				path = "";
			if(!_.isString(second_path))
				second_path = "";
			return {
				self : (path==second_path),
				parent : _.isNotEmptyString(this.fieldPath(second_path, path)),
				child : _.isNotEmptyString(this.fieldPath(path, second_path)),
				prev : (this.siblingPath(path, false)==second_path),
				next : (this.siblingPath(path, true)==second_path),
				depth: (this.depth(path)-this.depth(second_path))
			};
		},
		
		
		root: function(root_object){
			return _.hasFields(root_object) ? root_object : this.root_object;
		},
		
		resolve: function(path, root_object, value, default_value, null_is_not_undefined){
			root_object = this.root(root_object);
			var parent = this.parentPath(path);
			var field = this.fieldName(path);
			var obj = _.isNotEmptyString(parent) ? this.get(parent, root_object) : root_object;
			value = _.getValue(value, default_value, null_is_not_undefined);
			/*if(_.isNot(value, null_is_not_undefined))
				value = "";*/
			return {
				root: root_object,
				parent: parent,
				field: field,
				object: obj,
				value: value
			};
		},
		
		get: function(path, root_object_or_subpath){
			var root_object = this.root(root_object_or_subpath);
			var subpath = _.isString(root_object_or_subpath) ? root_object_or_subpath : null;
			if(_.hasFields(root_object)){
				var arr = this.path(path);
				if(!_.isNullOrEmpty(arr)){
					var obj = _.field(root_object,arr[0]);
					for(var i=1; i<arr.length && _.is(obj); i++)
						obj = _.field(obj, arr[i]);
					if(!!subpath){
						arr = this.path(subpath);
						for(var i=0; i<arr.length && _.is(obj); i++)
							obj = _.field(obj, arr[i]);
					}
					return obj;
				}
				else
					return root_object;
			}
			else
				return null;
		},
		
		getOrDef: function(path, def, root_object){
			var ret = this.get(path, root_object);
			return _.is(ret) ? ret : def;
		},
		
		makeResolvedObject: function(resolved){
			if((!_.is(resolved.object)) && (_.is(resolved.root))){
				var curr_obj = resolved.root; 
				var path_arr = this.path(resolved.parent);
				_.each(path_arr, function(path_item){
					path_item = _.tryParse(path_item,path_item,true);
					// TODO: riconoscere array, se l'item dopo il corrente è un numero (magari con param...) 
					if(_.is(curr_obj[path_item]))
						curr_obj = curr_obj[path_item];
					else{
						curr_obj[path_item] = {};
						curr_obj = curr_obj[path_item];
					}
				});
				resolved.object = curr_obj;
			}
		},
		
		set: function(path, value, root_object, default_value, null_is_not_undefined){
			var resolved = this.resolve(path, root_object, value, default_value, null_is_not_undefined);
			this.makeResolvedObject(resolved);
			_.field(resolved.object, resolved.field, resolved.value, null_is_not_undefined);
		},
		
		add: function(path, value, root_object, default_value, null_is_not_undefined){
			var resolved = this.resolve(path, root_object, value, default_value, null_is_not_undefined);
			if(_.hasFields(resolved.object)){
				var prop = _.field(resolved.object,resolved.field);
				value = (_.isNot(prop, null_is_not_undefined)) ? resolved.value : _.add(prop, resolved.value);
				_.field(resolved.object, resolved.field, value, null_is_not_undefined);
				return value;
			}
		},
		
		remove: function(path, value, weak_equals, root_object, null_is_not_undefined){
			var resolved = this.resolve(path, root_object);
			if(_.isNot(value,null_is_not_undefined)){
				// directly remove the field at the specified path
				var ret = _.field(resolved.object,resolved.field);
				if(_.isObject(resolved.object)){
					delete resolved.object[resolved.field];
				}
				else if(_.isNotEmptyArray(resolved.object)){
					var new_arr = new Array();
					for(var i=0; i<resolved.object.length; i++){
						if(i!=resolved.field)
							new_arr.push(resolved.object[i]);
					}
					this.set(resolved.parent, new_arr);
				}
				return ret;
				//return _.removeField(resolved.object, resolved.field, weak_equals);
			}
			else{
				// remove values equal to value from the object at the specified path
				var obj = resolved.object;
				var field = _.field(obj, resolved.field);
				if(_.hasFields(field)){
					field = _.remove(field, value, weak_equals);
					_.field(obj, resolved.field, field);
					return obj;
				}
				else
					return obj;
			}
		}
		
	}
);

_.mixin({
	nav : function(root_object_or_separator, separator){
		return new _._private.ObjectNavigator(root_object_or_separator, separator);
	},
	navField: function(obj, field, separator){
		return _.nav(obj, separator).get(field);
	}
});


////////////////////////////////////////////////////////////////////////////////////////////
	/* Date utilities */

_.mixin({
	
	// TODO: test all functionalities, and the DateNavigator... :-)
	date: function(today, usa_format, separator, hour_separator, date_hour_separator, return_time_array){
		var ret_date = null;
		if(_.isNotEmptyString(today))
			today = _.tryParse(today, today, true);
		if(_.is(today, Date))
			ret_date = today;
		else if(_.isNotEmptyString(today) || _.isNotEmptyArray(today)) // direct return: detects array size based on the fields in the string...
			return _.parseDate(today, usa_format, separator, hour_separator, date_hour_separator, return_time_array);
		else if(_.isNumber(today))
			ret_date = new Date(today);
		else
			ret_date = new Date();
		return (!!return_time_array) ? _.timeArray(ret_date, "ms") : ret_date;
	},
	
	/* Same as date, but directly returns the timestamp of the selected date */
	timestamp: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
		return date.getTime();
	},
	
	/* Returns a timestamp in milliseconds, from a timestamp in UTC (seconds) or milliseconds (to be called without checking) */
	ms: function(time_ms_or_sec){
		time_ms_or_sec = _.tryParse(time_ms_or_sec);
		return (time_ms_or_sec < 10000000000) ? (time_ms_or_sec * 1000) : time_ms_or_sec;
	},
	
	/* Same as date, but returns the value as an array of time labels (year, month, day, hour, ...), 
	 * basing on the fields present in the string (if a string) passed as time. */
	timeArray: function(time, level, usa_format, separator, hour_separator, date_hour_separator){
		if(!_.is(time))
			time = _.timestamp();
		if(_.isNotEmptyString(level)){
			var date = _.date(time, usa_format, separator, hour_separator, date_hour_separator);
			var arr = [ (""+date.getFullYear()) ];
			if(level=="year" || level=="y")
				return arr;
			arr.push(_.dateFieldStr(date.getMonth()+1));
			if(level=="month" || level=="m")
				return arr;
			arr.push(_.dateFieldStr(date.getDate()));
			if(level=="day" || level=="d")
				return arr;
			arr.push(_.dateFieldStr(date.getHours()));
			if(level=="hour" || level=="h")
				return arr;
			arr.push(_.dateFieldStr(date.getMinutes()));
			if(level=="minute" || level=="min")
				return arr;
			arr.push(_.dateFieldStr(date.getSeconds()));
			if(level=="second" || level=="s")
				return arr;
			arr.push(_.dateFieldStr(date.getMilliseconds()));
			return arr;
		}
		else
			return _.date(time, usa_format, separator, hour_separator, date_hour_separator, true);
	},
	
	
	parseDate: function(today, usa_format, separator, hour_separator, date_hour_separator, return_time_array){
		// read eventual literal strings 
		if(today=="now" || today=="today" || today=="yesterday" || today=="tomorrow"){
			var now = new Date();
			if(today=="now")
				return now;
			else{
				now = _.dayTimestamp(now);
				if(today=="yesterday")
					return _.yesterday(now);
				else if(today=="tomorrow")
					return _.tomorrow(now);
				else
					return _.date(now);
			}
		}
		
		// tokenize today string
		var date_arr = null;
		var hour_arr = new Array();
		if(_.isArray(today)){
			if(today.length>3){
				date_arr = _.first(today, 3);
				hour_arr = _.last(today, (today.length-3));
				if(hour_arr.length>4)
					hour_arr = _.first(hour_arr, 4);
			}
			else
				date_arr = today;
		}
		else{
			var arr = today.split(_.isString(date_hour_separator) ? date_hour_separator : " ");
			today = arr[0];
			var hour = (arr.length>1) ? arr[1] : "";
			if(!separator)
				separator = (!!usa_format) ? separator="-" : separator="/";   
			date_arr = today.split(separator);
			hour_arr = (hour.length>0) ? hour.split(_.isString(hour_separator) ? hour_separator : ":") : new Array();
		}
		var has_hours = (hour_arr.length>0);
	    
		// return date object or time array
	    if(!!return_time_array){
	    	if(!usa_format)
	    		date_arr = date_arr.reverse();
	    	return has_hours ? _.add(date_arr,hour_arr) : date_arr;
	    }
	    else{
	    	// read date coordinates
			var d = (date_arr.length>2) ? ((!!usa_format) ? date_arr[2] : date_arr[0]) : 1;
			d = _.limit(d,1,31); 
			var m = (date_arr.length>1) ? ((!!usa_format) ? date_arr[1] : date_arr[1]) : 1; 
			m = _.limit(m,1,12);
			m--;
		    var y = (date_arr.length>0) ? ((!!usa_format) ? date_arr[0] : date_arr[date_arr.length-1]) : 1970;
		    y = _.limit(y, -9999, 9999);
		    
		    var ret = null;
		    if(has_hours){
			    var h = (hour_arr.length>0) ? hour_arr[0] : 0;
			    var min = (hour_arr.length>1) ? hour_arr[1] : 0;
			    var sec = (hour_arr.length>2) ? hour_arr[2] : 0;
			    var ms = (hour_arr.length>3) ? hour_arr[3] : 0;
		    
			    ret = new Date(y,m,d,h,min,sec,ms);
		    }
		    else
		    	ret = new Date(y,m,d);
		    
		    var millis = has_hours ? _.validHourTimestamp(ret) : _.dayTimestamp(ret);
		    return _.date(millis);
	    }
	},
	
	
	parseHour: function(hour_str, separator){
		return _.parseDate("-"+hour_str,false,null,separator,"-");
	},
	
	
	
	midnight: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date.getTime();
	},
	
	almostMidnight: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
		date.setHours(23);
		date.setMinutes(59);
		date.setSeconds(59);
		date.setMilliseconds(999);
		return date.getTime();
	},
	
	firstMillis: function(year, month, day){
		if(_.is(year)){
			var date = ""+(_.is(day) ? day : "1")+"/"+(_.is(month) ? month : "1")+"/"+year;
			return _.midnight(date);
		}
	},
	
	lastMillis: function(year, month, day){
		if(_.is(year)){
			var date = ""+(_.is(day) ? day : (_.is(month) ? _.monthDays(month) : "31"))+"/"+(_.is(month) ? month : "12")+"/"+year;
			return _.almostMidnight(date);
		}
	},
	
	noon: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
		date.setHours(12);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date.getTime();
	},
	
	// day timestamp is a timestamp at the precise value of 12:00 AM plus 1 millisecond
	dayTimestamp: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var ret = _.noon(today, usa_format, separator, hour_separator, date_hour_separator);
		return (ret+1);
	},
	
	isDayTimestamp: function(date_val){
		var val = _.timestamp(date_val);
		var ts = _.dayTimestamp(val); // _.midnight(val); first the day timestamp was at midnight
		return (val==ts);
	},
	
	validHourTimestamp: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var millis = _.timestamp(today, usa_format, separator, hour_separator, date_hour_separator);
		return _.isDayTimestamp(millis) ? (millis+1) : millis;
	},
	
	
	
	/* Moves in current week numerating days from 1 (monday, or sunday in usa format) to 7 (sunday, or saturday in usa format) */
	moveInWeek: function(today, day_of_week, usa_format, separator, hour_separator, date_hour_separator){
		var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
		var next_week = false;
		
		if(!!usa_format)
			day_of_week--;
		else if(day_of_week==7){
			day_of_week = 0;
			next_week = true;
		}
		
		var date_day = date.getDay(); 
		if((date_day<day_of_week) || next_week){ // go forward
			while((date_day<day_of_week) || (next_week && date_day!=0)){
				date = _.tomorrow(date);
				date_day = date.getDay();
			}
		}
		else if(date_day>day_of_week){ // go back
			while(date_day>day_of_week){
				date = _.yesterday(date);
				date_day = date.getDay();
			}
		}
		
		return date;
	},
	
	weekStart: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var date = _.moveInWeek(today, 1, usa_format, separator, hour_separator, date_hour_separator);
		return _.midnight(date);
	},
	weekStop: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var date = _.moveInWeek(today, 7, usa_format, separator, hour_separator, date_hour_separator);
		return _.almostMidnight(date);
	},
	
	monthStart: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
		date.setDate(1);
		return _.midnight(date);
	},
	monthStop: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
		date.setDate(_.monthDays(date));
		return _.almostMidnight(date);
	},
	
	yearStart: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
		date.setMonth(0);
		return _.monthStart(date);
	},
	yearStop: function(today, usa_format, separator, hour_separator, date_hour_separator){
		var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
		date.setMonth(11);
		return _.monthStop(date);
	},
	
	
	
	
	timeAxis: function(level, time){
		var ret = new Array();
		var how_many = (level=="year" || level=="y") ? 12 : ( (level=="month" || level=="m") ? _.monthDays(_.date(time).getMonth()+1) :
				( (level=="day" || level=="d") ? 24 : 60 ) ); // 60 is ok for hour and minute: aggregations on seconds are not considered...  
		var zero_indexed = (!(level=="year" || level=="y" || level=="month" || level=="m"));
		for(var i=0; i<how_many; i++){
			ret.push(_.dateFieldStr( ""+(zero_indexed ? i : i+1) ));
		}
		return ret;
	},
	
	dateLevelChild: function(level){
		return (level=="year" || level=="y") ? "month" : ( (level=="month" || level=="m") ? "day" :
			( (level=="day" || level=="d") ? "hour" : ( (level=="hour" || level=="h") ? "minute" : 
				( (level=="minute" || level=="min") ? "second" : "millisecond" ) ) ) );
	},
	
	dateLevelParent: function(level){
		return (level=="year" || level=="y") ? "year" : ( (level=="month" || level=="m") ? "year" :
			( (level=="day" || level=="d") ? "month" : ( (level=="hour" || level=="h") ? "day" : 
				( (level=="minute" || level=="min") ? "hour" : ( (level=="second" || level=="s")  ? "minute" : "second") ) ) ) );
	},
	
	singleDateField: function(time, level, as_string, get_level_child){
		if(!_.isNotEmptyString(level))
			level = "day";
		if(!!get_level_child)
			level = _.dateLevelChild(level); 
		
		var date = _.date(time);
		var ret = (level=="year" || level=="y") ? date.getFullYear() : ( (level=="month" || level=="m") ? (date.getMonth()+1) :
			( (level=="day" || level=="d") ? date.getDate() : ( (level=="hour" || level=="h") ? date.getHours() : 
				( (level=="minute" || level=="min") ? date.getMinutes() : ( (level=="second" || level=="s") ? date.getSeconds() : 
					date.getMilliseconds() ) ) ) ) );
		return (!!as_string) ? _.dateFieldStr(ret) : ret;
	},
	
	resetDateField: function(time, level, usa_format, separator, hour_separator, date_hour_separator){
		if(!_.isNotEmptyString(level))
			level = "day";
		if(level=="year" || level=="y")
			return _.yearStart(time, usa_format, separator, hour_separator, date_hour_separator);
		else if(level=="month" || level=="m")
			return _.monthStart(time, usa_format, separator, hour_separator, date_hour_separator);
		else if(level=="day" || level=="d")
			return _.midnight(time, usa_format, separator, hour_separator, date_hour_separator);
		else{
			var ret = _.date(time, usa_format, separator, hour_separator, date_hour_separator);
			ret.setMilliseconds(0);
			if(level=="second" || level=="s")
				return ret;
			ret.setSeconds(0);
			if(level=="minute" || level=="min")
				return ret;
			ret.setMinutes(0);
			return ret;
		}
	},
	
	setDateField: function(time, level, value, usa_format, separator, hour_separator, date_hour_separator){
		if(level=="month" || level=="day")  // they are not zero-indexed in date labels..
			value--; 
		var parent_level = _.dateLevelParent(level);
		time = _.resetDateField(time, parent_level, usa_format, separator, hour_separator, date_hour_separator);
		time = _.iterateDate(time, value, level);
		return time;
	},
	
	yesterday : function(today, days, usa_format){
    	return _.nextDate(today, days, null, true, usa_format); 
    },
    
    tomorrow : function(today, days, usa_format){
    	return _.nextDate(today, days, null, false, usa_format);
    },
    
    /**
	 * Returns a date interval in milliseconds, eventually interpreting the interval depending on an initial date (if the first arg is a Date). 
	 * The interval has to be expressed in the format X-X-X (days-months-years), or X[d|m|y] (default: d). Note that the value of a month 
	 * is conventionally fixed in 30 days if the starting date is not specified. 
	 * An hour interval can be specified with the second argument, in the format X-X-X-X (hours, minutes, seconds and milliseconds) or X[h|m|s|ms]
	 * (default: h). 
	 * TODO: merge the two parameters! (minutes: mm (at now: min))
	 */
	dateInterval: function(today_or_date_interval, date_interval_or_hour_interval, hour_interval){
		var today = _.is(today_or_date_interval, Date) ? today_or_date_interval : null;
		var date_interval = (!today) ? today_or_date_interval : date_interval_or_hour_interval;
		hour_interval = (!today) ?  date_interval_or_hour_interval : hour_interval;
		if((!_.is(hour_interval)) && _.isNotEmptyString(date_interval) && 
				(_.endsWith(date_interval,"h") || _.endsWith(date_interval,"min") || _.endsWith(date_interval,"s"))){
			hour_interval = _.endsWith(date_interval,"min") ? date_interval.substring( 0, date_interval.indexOf("m")+1 ) : date_interval;
			date_interval = null;
		}
		
		var days = 0;
		if(_.isNotEmptyString(date_interval)){
			var d = 0; var m = 0; var y = 0;
			if(date_interval.indexOf("-")>=0){
				var arr = date_interval.split("-");
				if(arr.length>0 && arr[0].length>0)
					d = arr[0];
				if(arr.length>1 && arr[1].length>0)
					m = arr[1];
				if(arr.length>2 && arr[2].length>0)
					y = arr[2];
			}
			else{
				var last_char = date_interval.charAt(date_interval.length-1);
				var num = date_interval.substring(0,date_interval.length-1);
				if(last_char=="d")
					d = _.tryParse(num,0,true);
				else if(last_char=="m")
					m = _.tryParse(num,0,true);
				else if(last_char=="y")
					y = _.tryParse(num,0,true);
			}
			
			days += d;
			if(m>0 && (!!today)){
				var month = today.getMonth();
				for(var i=0;i<m;i++)
					days += _.monthDays(month+i+1);
			}
			else 
				days += (30*m);
			days += Math.ceil(365.25 * y);			
		}
		else if(_.isNumber(date_interval)) 
			days = date_interval;
		else if(!_.isNotEmptyString(hour_interval))
			days = 1;
		
		var ms = 0;
		if(_.isNotEmptyString(hour_interval)){
			var h = 0; var m = 0; var s = 0; 
			if(hour_interval.indexOf("-")>=0){
				var arr = hour_interval.split("-");
				if(arr.length>0 && arr[0].length>0)
					h = arr[0];
				if(arr.length>1 && arr[1].length>0)
					m = arr[1];
				if(arr.length>2 && arr[2].length>0)
					s = arr[2];
				if(arr.length>3 && arr[3].length>0)
					ms = arr[3];
			}
			else{
				var last_char = hour_interval.charAt(hour_interval.length-1);
				var num = hour_interval.substring(0,hour_interval.length-1);
				if(last_char=="h")
					h = _.tryParse(num,0,true);
				else if(last_char=="m")
					m = _.tryParse(num,0,true);
				else if(last_char=="s"){
					if(hour_interval.length>2 && hour_interval.charAt(hour_interval.length-2)=="m")
						ms = _.tryParse(hour_interval.substring(0,hour_interval.length-2),0,true);
					else
						s = _.tryParse(num,0,true);
				}
			}
			
			ms += (h * (1000*60*60)) + (m * (1000*60)) + (s * (1000)); 			
		}
		else if(_.isNumber(hour_interval))
			ms = (1000*60*60 *  hour_interval);
			
		ms += ( 1000*60*60*24 * days );
		return ms;
	},
	
	
	// TODO: make it better... with more functionalities, like dateInterval...
	convertDateDiff: function(interval_ms, measure, ceiling){
		var min_ms = ( 1000 * 60 );
		var hour_ms = ( min_ms * 60 ); 
		var day_ms = ( hour_ms * 24 );
		var month_ms = (day_ms * 30);
		var year_ms = (day_ms * 365); 
		
		var div_ms = 1;
		if(!_.isNotEmptyString(measure))
			measure = "d";
		if(measure=="min" || measure=="minute")
			div_ms = min_ms;
		else if(measure=="h" || measure=="hour")
			div_ms = hour_ms;
		else if(measure=="d" || measure=="day")
			div_ms = day_ms;
		else if(measure=="m" || measure=="month")
			div_ms = month_ms;
		else if(measure=="y" || measure=="year")
			div_ms = year_ms;
		
		return (!!ceiling) ? Math.ceil(interval_ms/div_ms) : Math.floor(interval_ms/div_ms);
	},
	
	monthDays: function(month, zero_indexed){
		var date = null;
		if(_.is(month, Date)){
			date = _.date(_.timestamp(month));
			month = month.getMonth();
			zero_indexed = true;
		}
		if(!!zero_indexed)
			month++;
		if(month>12){
			month = month%12;
			if(month==0)
				month=12;
		}
		if(month==2 && _.is(date)){
			try{
				date.setDate(29);
				var mese = date.getMonth();
				return (mese==1) ? 29 : 28;
			}catch(err){
				return 28;
			}
		}
		return (month==11 || month==4 || month==6 || month==9) ? 30 : ((month==2) ? 28 : 31);
	},
	
	nextDate : function(today, days_or_interval, hour_interval, backward, usa_format){
    	var date = _.date(today, usa_format);
    	var interval_ms = _.is(today) ? _.dateInterval(today, days_or_interval, hour_interval) : _.dateInterval(days_or_interval, hour_interval);
    	var new_date_ms = (!!backward) ? (date.getTime()-interval_ms) : (date.getTime()+interval_ms);
        return new Date(new_date_ms);
    },
    
    iterateDate: function(today, diff, field, usa_format){
    	var date = _.date(today, usa_format);
    	diff = _.tryParse(diff, 1, true);
    	if(diff==0)
    		return date;
    	if(!_.isNotEmptyString(field))
			field = "d";
    	else if(field=="w" || field=="week"){
    		field = "d";
    		diff = diff * 7;
    	}
    	var back = (diff<0);
    	if(back)
    		diff = diff * -1;
    	
    	var goMonth = function(){
    		var month = date.getMonth();
    		var is_last = back ? month==0 : month==11;
    		if(is_last){
    			if(back){
    				date.setMonth(11);
    				date.setFullYear(date.getFullYear()-1);
    			}
    			else{
    				date.setMonth(0);
    				date.setFullYear(date.getFullYear()+1);
    			}
    		}
    		else
    			date.setMonth(back ? month-1 : month+1);
    	};
    	
    	var month_days = _.monthDays(date);
    	var goDay = function(){
    		var day = date.getDate(); 
    		var is_last = back ? day==1 : day==month_days;
			if(is_last){
				goMonth();
				month_days = _.monthDays(date);
				if(back)
					date.setDate(month_days);
				else
					date.setDate(1);
			}
			else
				date.setDate(back ? day-1 : day+1);
    	};
    	
    	
		if(field=="ms" || field=="millisecond")
			date.setTime(back ? date.getTime()-diff : date.getTime()+diff);
		else if(field=="s" || field=="second")
			date.setTime(back ? date.getTime()-(diff*1000) : date.getTime()+(diff*1000));
		else if(field=="min" || field=="minute")
			date.setTime(back ? date.getTime()-(diff*1000*60) : date.getTime()+(diff*1000*60));
		else if(field=="h" || field=="hour")
			date.setTime(back ? date.getTime()-(diff*1000*60*60) : date.getTime()+(diff*1000*60*60));
		else if(field=="d" || field=="day"){
			for(var i=0; i<diff; i++)
				goDay();
		}
		else if(field=="m" || field=="month"){
			for(var i=0; i<diff; i++)
				goMonth();
		}
		else if(field=="y" || field=="year")
			date.setFullYear(back ? date.getFullYear()-diff : date.getFullYear()+diff);
		
		return date;
    },
    
    firstDayOfWeek: function(today, usa_format, separator, hour_separator, date_hour_separator){
    	var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
    	date = _.date(_.timestamp(date));
    	date.setDate(1);
    	var ret = date.getDay();
    	return (!usa_format) ? ( (ret==0) ? 7 : ret ) : (ret+1);
    },
    lastDayOfWeek: function(today, usa_format, separator, hour_separator, date_hour_separator){
    	var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
    	date = _.date(_.timestamp(date));
    	date.setDate(_.monthDays(date));
    	var ret = date.getDay();
    	return (!usa_format) ? ( (ret==0) ? 7 : ret ) : (ret+1);
    },
    howManyWeeks: function(today, usa_format, separator, hour_separator, date_hour_separator){
    	var date = _.date(today, usa_format, separator, hour_separator, date_hour_separator);
    	date = _.date(_.timestamp(date));
    	var days = _.monthDays(date);
    	date.setDate(1);
    	var day = date.getDay();
		if(days==30)
    		return (!!usa_format) ? ((day==6) ? 6 : 5) : ((day==7) ? 6 : 5);
    	else if(days==31)
    		return (!!usa_format) ? ((day==6 || day==5) ? 6 : 5) : ((day==7 || day==6) ? 6 : 5);
    	else 
    		return (days==29) ? 5 : ((!!usa_format) ? ((day==0) ? 4 : 5) : ((day==1) ? 4 : 5));    			
    },
    
    dateFieldStr: function(number){
    	var ret = ""+number;
    	return (ret.length>=2) ? ret : ("0"+ret);  
    },
    
	literalMonth: function(month, usa_format, short){
		if(month==1)
			return ( (!!usa_format) ? ((!short) ? "January" : "Jan") : ((!short) ? "Gennaio" : "Gen") );
		else if(month==2)
			return ( (!!usa_format) ? ((!short) ? "February" : "Feb") : ((!short) ? "Febbraio" : "Feb") );
		else if(month==3)
			return ( (!!usa_format) ? ((!short) ? "March" : "Mar") : ((!short) ? "Marzo" : "Mar") );
		else if(month==4)
			return ( (!!usa_format) ? ((!short) ? "April" : "Apr") : ((!short) ? "Aprile" : "Apr") );
		else if(month==5)
			return ( (!!usa_format) ? ((!short) ? "May" : "May") : ((!short) ? "Maggio" : "Mag") );
		else if(month==6)
			return ( (!!usa_format) ? ((!short) ? "June" : "Jun") : ((!short) ? "Giugno" : "Giu") );
		else if(month==7)
			return ( (!!usa_format) ? ((!short) ? "July" : "Jul") : ((!short) ? "Luglio" : "Lug") );
		else if(month==8)
			return ( (!!usa_format) ? ((!short) ? "Agoust" : "Ago") : ((!short) ? "Agosto" : "Ago") );
		else if(month==9)
			return ( (!!usa_format) ? ((!short) ? "September" : "Sep") : ((!short) ? "Settembre" : "Set") );
		else if(month==10)
			return ( (!!usa_format) ? ((!short) ? "October" : "Oct") : ((!short) ? "Ottobre" : "Ott") );
		else if(month==11)
			return ( (!!usa_format) ? ((!short) ? "November" : "Nov") : ((!short) ? "Novembre" : "Nov") );
		else if(month==12)
			return ( (!!usa_format) ? ((!short) ? "December" : "Dec") : ((!short) ? "Dicembre" : "Dic") );
	},
	
	literalDay: function(day, usa_format, short){
		if(day==1)
			return ( (!!usa_format) ? ((!short) ? "Sunday" : "Sun") : ((!short) ? "Lunedi" : "Lun") );
		else if(day==2)
			return ( (!!usa_format) ? ((!short) ? "Monday" : "Mon") : ((!short) ? "Martedi" : "Mar") );
		else if(day==3)
			return ( (!!usa_format) ? ((!short) ? "Tuesday" : "Tue") : ((!short) ? "Mercoledi" : "Mer") );
		else if(day==4)
			return ( (!!usa_format) ? ((!short) ? "Wednesday" : "Wed") : ((!short) ? "Giovedi" : "Gio") );
		else if(day==5)
			return ( (!!usa_format) ? ((!short) ? "Thursday" : "Thu") : ((!short) ? "Venerdi" : "Ven") );
		else if(day==6)
			return ( (!!usa_format) ? ((!short) ? "Friday" : "Fri") : ((!short) ? "Sabato" : "Sab") );
		else if(day==7)
			return ( (!!usa_format) ? ((!short) ? "Saturday" : "Sat") : ((!short) ? "Domenica" : "Dom") );
	},
	
	concatDateFields: function(date, sep, usa_format, literal_month, short_literal){
		if(!_.isString(sep))
			sep = (!!literal_month) ? " " : ((!!usa_format) ? "-" : "/");
		var month = date.getMonth()+1;
		if(!!literal_month)
			return (_.dateFieldStr(date.getDate()) + sep + _.literalMonth(month, usa_format, short_literal) + sep + date.getFullYear() );
		else
			return (!!usa_format) ? (date.getFullYear() + sep + _.dateFieldStr(month) + sep + _.dateFieldStr(date.getDate())) :
				(_.dateFieldStr(date.getDate()) + sep + _.dateFieldStr(month) + sep + date.getFullYear());
	},
	
	concatHourFields: function(date, sep, hour_fields){
		if(!_.isNumber(hour_fields))
			hour_fields = 2;
		if(hour_fields===0)
			return "";
		if(!_.isString(sep))
			sep = ":";
		return _.dateFieldStr(date.getHours()) + ( (hour_fields>1) ? sep+_.dateFieldStr(date.getMinutes()) : "" ) + 
				( (hour_fields>2) ? sep+_.dateFieldStr(date.getSeconds()) : "" ) + ( (hour_fields>3) ? sep+_.dateFieldStr(date.getMilliseconds()) : "" );
	},
	
    dateStr: function(date, include_hour_or_hour_fields, usa_format, date_sep, hour_sep, date_hour_sep){
    	date = _.date(date, usa_format);
		var ret = _.concatDateFields(date,date_sep,usa_format);
		if(!!include_hour_or_hour_fields)
			ret+= (_.isString(date_hour_sep) ? date_hour_sep : " ") + _.concatHourFields(date, hour_sep, include_hour_or_hour_fields);
		return ret;
	},
	
	hourStr: function(date, hour_fields, usa_format, sep){
		date = _.date(date, usa_format);
		if(!_.isNumber(hour_fields))
			hour_fields = 2;
		return (hour_fields>0) ? _.concatHourFields(date, sep, hour_fields) :  "";
	},
	
	literalDateStr: function(date, include_hour_or_hour_fields, usa_format, short_month, date_sep, hour_sep, date_hour_sep){
		date = _.date(date, usa_format);
		var hour_fields = (include_hour_or_hour_fields===true) ? 2 : (_.isNumber(include_hour_or_hour_fields) ? include_hour_or_hour_fields : 0);
		
		var date_str = _.concatDateFields(date,date_sep,usa_format,true,short_month);
		var hour_str = _.concatHourFields(date,hour_sep,hour_fields);
		return _.isNotEmptyString(hour_str) ? ( date_str + (_.isString(date_hour_sep) ? date_hour_sep : " ") + hour_str ) : date_str;
	},
	
	noSpacesDateStr: function(date, include_hour_or_hour_fields, usa_format){
		return _.dateStr(date, include_hour_or_hour_fields, usa_format, "", "", "");
	},
	
	getBestTimeMeasure: function(millis){
		// still present for backward compatibility... 
		return _.bestTimeMeasure(millis, "h", 2);
	},
	
	bestTimeMeasure: function(millis, max_unity, lower_unity_factor){
		if(!_.is(lower_unity_factor))
			lower_unity_factor = 1;
		if(!_.is(max_unity))
			max_unity = "y";
		var unity = "ms";
		var div = 1;
		if( (unity!=max_unity) && (millis >= (1000*lower_unity_factor)) ){
			div = div * 1000;
			unity = "sec";
		}
		if( (unity!=max_unity) && (millis >= (60*lower_unity_factor)) ){
			div = div * 60;
			unity = "min";
		}
		if( (unity!=max_unity) && (millis >= (60*lower_unity_factor)) ){
			div = div * 60;
			unity = "h";
		}
		if( (unity!=max_unity) && (millis >= (24*lower_unity_factor)) ){
			div = div * 24;
			unity = "d";
		}
		if( (unity!=max_unity) && (millis >= (30*lower_unity_factor)) ){
			div = div * 30;
			unity = "mon";
		}
		if( (unity!=max_unity) && (millis >= (12*lower_unity_factor)) ){
			div = div * 12;
			unity = "y";
		}
		millis = millis / div;
		return (_.round(millis,1)+" "+unity);
	},
    
    
	dateNav: function(today, include_hour_or_hour_fields, usa_format, separator, hour_separator, date_hour_separator){
    	return {
    		value : _.date(today, usa_format, separator, hour_separator, date_hour_separator),
    		ms: function(){
    			return this.value.getTime();
    		},
    		next: function(days_or_date_interval, hour_interval){
    			this.value = _.nextDate(this.value, days_or_date_interval, hour_interval, false, usa_format);
    			return this;
    		},
    		prev: function(days_or_date_interval, hour_interval){
    			this.value = _.nextDate(this.value, days_or_date_interval, hour_interval, true, usa_format);
    			return this;
    		},
    		str: function(){
    			return _.dateStr(this.value, include_hour_or_hour_fields, usa_format);
    		}
    	};
    },
    
    simulateOnTimeIntervals: function(fn, fn_this, from, to, interval_str_or_ms, dont_log_errors){
    	if( (!_.isFunction(fn)) && (!_.is(from)) )
			throw ("simulateOnTimeInterval requires at least the function to call and the starting date!");
    	var from_ms = _.timestamp(from);
		var to_ms = _.is(to) ? _.timestamp(to) : _.timestamp();
		var interval_ms = _.isNumber(interval_str_or_ms) ? interval_str_or_ms : 
				(_.isNotEmptyString(interval_str_or_ms) ? _.dateInterval(interval_str_or_ms) : 
					((to_ms - from_ms)/100));
		
		var curr_from_ms = from_ms; 
		var curr_to_ms = curr_from_ms + interval_ms;
		var results = new Array();
		var errs = new Array();
		while(curr_from_ms < to_ms){
			try{
				var curr_result = fn.call(fn_this, curr_from_ms, curr_to_ms);
				results = _.add(results, curr_result);
			}catch(err){
				var err_str = "Error while calling function from "+
						_.dateStr(curr_from_ms, true)+" to "+_.dateStr(curr_to_ms, true)+
						": "+err;
				errs.push(err_str);
				if(!dont_log_errors)
					_.log(err_str);
			}
			curr_from_ms = curr_to_ms;
			curr_to_ms = curr_from_ms + interval_ms;
			if(curr_to_ms>to_ms)
				curr_to_ms = to_ms;
		}
		return {
			results: results,
			errors: errs
		};
    }
    
});
		
		
////////////////////////////////////////////////////////////////////////////////////////////
	/* Plane recursion functions */

/**
 * Computes the next iteration objects within a recursive call
 */ 
_._private.nextInRecursion = function(chain_nodes, next_function, _this_in_fn){
	var _objs = _.asArray(chain_nodes);
	var _next_objs=new Array();
	_.each(_objs, function(_obj){
		var _result = next_function ? next_function.apply(_this_in_fn,[_obj]) : null;
		_next_objs = _.add(_next_objs, _result);
	});
	return _next_objs;
};

/**
 * Computes the selection within a recursive call
 */ 
_._private.selectInRecursion = function(_next, _select_function, _ret, _return_first, _this_in_fn){
	if(_.isNotEmpty(_next)){
		if(_select_function){
			var _selected = null;
			for(var i=0;i<_next.length;i++){
				_selected = _select_function.call(_this_in_fn,_next[i]);
				if(_selected!=null && _selected!==false){
					if(_selected===true)
						_selected = _next[i];
					if(_return_first)
						return _selected;
					else
						_ret = _.add(_ret, _selected);
				}
			}
		}
		else{
			if(_return_first)
				return _next[0];
			else
				_ret = _.add(_ret, _next);
		}
	}
	return null;
};

/**
 * Computes a recursion iteration within a recursive call
 */
_._private.callInRecursion = function(_recursing_obj, _recursings, _next_fn, _before_recursion_fn, _before_each_recursion_fn, 
		_after_each_recursion_fn, _after_recursion_fn, _each_recursion_complete_fn, _recursion_complete_fn, _this_in_fn, _vars){
	
	var _recursing_parent_info = _recursings.length>0 ? _recursings[0] : null; 
	var _recursing_parent = (!!_recursing_parent_info) ? _recursing_parent_info.caller : null;
	var _is_starting_obj = (!_recursing_parent);
	var _is_parent_starting_obj = (!!_recursing_parent_info) ? ((!!_recursing_parent_info.caller) && (!_recursing_parent_info.caller_parent)) : false; 
	if(!_.is(_vars)) 
		_vars = {};
	var _return = undefined;
	
	// here we are in the for of the parent recursion, first to call the recursion on the object
	if((!!_before_each_recursion_fn) && (!!_recursing_parent)){
		_return = _before_each_recursion_fn.apply( _this_in_fn, [_recursing_parent, _recursing_parent_info.vars, _is_parent_starting_obj,
		                                              _recursing_obj, _vars, _recursing_parent_info ] );
		if(_return!==undefined){
			var _repeating = undefined;
			if(!!_each_recursion_complete_fn)
				_repeating = _each_recursion_complete_fn.apply(_this_in_fn, [_recursing_parent, _recursing_parent_info.vars, _is_parent_starting_obj,
				    		                                    _recursing_obj, _return, _vars, _recursing_parent_info ]);
			if(!!_repeating){
				_recursing_parent_info.repeating = 
						(_repeating===true) ? _recursing_obj : _repeating;
				_recursing_parent_info.repeating_child = true;
			}
			else
				_recursing_parent_info.returned = _return;
			return;
		}
	}
	
	// here we are in the first part of the child recursion, before the for 
	if(!!_before_recursion_fn)
		_return = _before_recursion_fn.apply(_this_in_fn, [ _recursing_obj, _vars, _is_starting_obj, _recursing_parent_info ]);
	if(_return!==undefined){
		// the current object returned in the before function: terminate its recursion without next and after functions...
		_._private.afterRecursion(_recursing_obj, _is_starting_obj, _recursing_parent, _is_parent_starting_obj, _recursing_parent_info,
				_vars, _after_each_recursion_fn, null, _each_recursion_complete_fn, _recursion_complete_fn, _this_in_fn, _return);
		// ... and return the result of the before function
		return _return;
	}
		
	// here we select the next objects to continue the recursion
	var _next_objs = _next_fn.apply( _this_in_fn, [_recursing_obj, _vars, _is_starting_obj, _recursing_parent_info ] );
	if(_.is(_next_objs) && (!_.isArray(_next_objs)))
		_next_objs = [_next_objs];
	if(_.isNotEmpty(_next_objs)){
		// the current object has generated recursion children: put them as the next iterated branch and do not return
		var _next_recursing = _._private.recursingInfoObj(_recursing_obj, _vars, _next_objs, _recursing_parent_info);
		_.addAsFirst(_recursings, _next_recursing);
	} 
	else
		// the current object has not recursion children: terminate its recursion calling the after functions and returning the result...
		return _._private.afterRecursion(_recursing_obj, _is_starting_obj, _recursing_parent, _is_parent_starting_obj, _recursing_parent_info,
				_vars, _after_each_recursion_fn, _after_recursion_fn, _each_recursion_complete_fn, _recursion_complete_fn, _this_in_fn, undefined);
};

/**
 * Computes an iteration termination within a recursive call
 */
_._private.afterRecursion = function(_recursing_obj, _is_starting_obj, _recursing_parent, _is_parent_starting_obj, _recursing_parent_info, _vars, 
		_after_each_recursion_fn, _after_recursion_fn, _each_recursion_complete_fn, _recursion_complete_fn, _this_in_fn, _return){
	var _repeating = undefined;
	
	// here we are in the second part of the child recursion, after the for: this function returns the result of the function
	if(!!_after_recursion_fn)
		_return = _after_recursion_fn.apply(_this_in_fn, [ _recursing_obj, _vars, _is_starting_obj, _recursing_parent_info ]);
	if(!!_recursion_complete_fn){
		_repeating = _recursion_complete_fn.apply(_this_in_fn, [ _recursing_obj, _vars, _is_starting_obj, _return, _recursing_parent_info ]);
		if(!!_repeating){
			_recursing_parent_info.repeating = 
					(_repeating===true) ? _recursing_obj : _repeating;
			return _return;
		}
	}
	
	// here we are in the second part of the for of the parent recursion, just returned from the child recursion: we can return and so
	// stop the nested recursions
	if(!!_recursing_parent){
		var _returned = undefined;
		
		if(!!_after_each_recursion_fn)
			_returned = _after_each_recursion_fn.apply( _this_in_fn, [_recursing_parent, _recursing_parent_info.vars, _is_parent_starting_obj,
		                                    _recursing_obj, _return, _vars, _recursing_parent_info ] );
		if(!!_each_recursion_complete_fn)
			_repeating = _each_recursion_complete_fn.apply(_this_in_fn, [_recursing_parent, _recursing_parent_info.vars, _is_parent_starting_obj,
			    		                                    _recursing_obj, _return, _vars, _recursing_parent_info ]);
		if(!!_repeating){
			_recursing_parent_info.repeating = 
					(_repeating===true) ? _recursing_obj : _repeating;
			_recursing_parent_info.repeating_child = true;
		}
		else if(_returned!==undefined)
			_recursing_parent_info.returned = _returned;
	}
	
	return _return;
};

/** Create a recursing info object, used internally to keep info on current recursing item */
_._private.recursingInfoObj = function(_recursing_obj, _vars, _next_objs, _recursing_parent_info){
	var _caller_obj = _recursing_obj;
	if(!_.isArray(_next_objs))
		_next_objs = new Array();
	if(_vars===true){
		// it's the starting object
		_vars = {};
		_caller_obj = null;
		_next_objs.push(_recursing_obj);
	}
	return {
		caller : _caller_obj,
		objects : _next_objs,
		vars : _vars,
		
		objects_length: _next_objs.length,
		object_pos: -1,
		caller_parent: (!!_recursing_parent_info) ? _recursing_parent_info.caller : null,
		caller_object_pos: (!!_recursing_parent_info) ? _recursing_parent_info.object_pos : -1,
		caller_objects_length: (!!_recursing_parent_info) ? _recursing_parent_info.objects_length : -1
	};
};


/** Add plane recursion functions */
_.mixin({
	
	/** 
	 * Navigates the chain with a breadth-first search, and returns the array of selected objects
	 * 
	 * Le funzioni principali sono la next_function, con la quale si specifica quali
	 * elementi figli possiede ciascun elemento, e la select_function, che determina
	 * il risultato per ciascun item visitato. Entrambe le funzioni accettano l'item
	 * come unico argomento. La select function può ritornare direttamente 
	 * la selezione effettuata sull'item, o true per indicare che l'item stesso
	 * deve essere selezionato.
	 * La funzione effettua una ricorsione piana, partendo da uno o più oggetti
	 * passati in _starting_objects, con la possibilità di escludere tali oggetti
	 * iniziali dalla selezione (_exclude_starting_objects), di specificare un 
	 * livello massimo di ricorsione (_depth_levels), di ritornare il primo elemento
	 * che supera la selezione stoppando le iterazioni prima possibile (_return_first).
	 * E' inoltre possibile passare un oggetto da utilizzare come contesto (this)
	 * nell'invocazione delle funzioni.
	 * La funzione ritornerà l'array di tutti gli oggetti selezionati.
	 */
	recursiveSelect : function(_starting_objects, _next_function, _select_function, _exclude_starting_objects, _depth_levels, 
				_return_first, _this_in_fn){
		if(_.isNullOrEmpty(_starting_objects))
			return ( _return_first ? null : new Array() );
		if( !(_.isNumber(_depth_levels) || _depth_levels===false ) )
			_depth_levels=true;
		var _levels = 0;
		var _ret = new Array();
		var _ret_obj=null;
		var _next = new Array();
		if(!_exclude_starting_objects)
			_next = _.add(_next, _starting_objects);
		else if( _depth_levels===true || _depth_levels>0 ){
			_next = _._private.nextInRecursion(_starting_objects, _next_function, _this_in_fn);
			_ret_obj = _._private.selectInRecursion(_next, _select_function, _ret, _return_first, _this_in_fn);
			if(!!_ret_obj)
				return _ret_obj;
			_levels++;
		}
		
		while( _next.length>0 && ( _depth_levels===true || _levels<_depth_levels ) ){
			
			_next = _._private.nextInRecursion(_next, _next_function, _this_in_fn);
			_ret_obj = _._private.selectInRecursion(_next, _select_function, _ret, _return_first, _this_in_fn);
			if(_ret_obj)
				return _ret_obj;
			_levels++;
			
		}
		return ( _return_first ? null : _ret ) ;
	},
	
	
	
	/**
	 * Navigates the chain with a depth-first search. 
	 * 
	 * Funzione ricorsiva completa, eseguita in ricorsione piana.
	 * La funzione ricorsiva assume uno schema di invocazione delle funzioni di
	 * questo tipo:
	 * 		A1 - _before_recursion_fn 
	 * 		A2 - _next_fn
	 * 			- PER OGNI FIGLIO -
	 * 			AB1 - _before_each_recursion_fn
	 * 				B1 - _before_recursion_fn sul figlio
	 * 				B2 - _next_fn sul figlio
	 * 					- RICORSIONE SUI FIGLI DEL FIGLIO -
	 * 				B3 - _after_recursion_fn sul figlio
	 * 				B4 - _recursion_complete_fn sul figlio
	 * 			AB2 - _after_each_recursion_fn
	 * 			AB3 - _each_recursion_complete_fn
	 * 		A3 - _after_recursion_fn
	 * 		A4 - _recursion_complete_fn  
	 * 
	 * Ecco gli args:
	 * 		_starting_object: l'oggetto iniziale della ricorsione. A differenza di
	 * 			recursiveSelect, è sempre interpretato come singolo oggetto, anche 
	 * 			se è un array (questo non sarà dunque diviso automaticamente in 
	 * 			più item, ma sarà invece sottoposto a tutte le funzioni come 
	 * 			singolo oggetto) 
	 * 		_first_vars: le variabili iniziali a disposizione dell'item iniziale
	 * 		_before_recursion_fn: funzione invocata prima dell'invocazione su 
	 * 			ciascun item. Se ritorna un valore diverso da undefined, tale
	 * 			valore viene assunto come risultato dell'iterazione sull'item,
	 * 			la quale non avrà dunque luogo (sarà invocata direttamente 
	 * 			la funzione _recursion_complete_fn).
	 * 			function(elem, vars, is_first, recursing_info)
	 * 		_next_fn: funzione invocata su ciascun figlio per ottenerne i figli.
	 * 			function(elem, vars, is_first, recursing_info)
	 * 		_before_each_recursion_fn: funzione invocata, a livello del padre, 
	 * 			prima di lanciare la ricorsione su un determinato figlio.
	 * 			Se ritorna un valore diverso da undefined, tale
	 * 			valore viene assunto come risultato dell'iterazione sul figlio,
	 * 			la quale non avrà dunque luogo (sarà invocata direttamente 
	 * 			la funzione _each_recursion_complete_fn), e anche come terminazione
	 * 			dell'iterazione sull'item padre (i figli successivi a quello 
	 * 			processato non verranno dunque processati, e saranno invocate
	 * 			le funzioni _after_recursion_fn e _recursion_complete_fn).
	 * 			function(elem, vars, is_first, child, child_vars, recursing_info)
	 * 		_after_each_recursion_fn: funzione invocata, a livello del padre, 
	 * 			al termine naturale della ricorsione su un determinato figlio.
	 * 			Se ritorna un valore diverso da undefined, tale
	 * 			valore viene assunto come risultato dell'iterazione sul figlio,
	 * 			sovrascrivendo quello ritornato dalla _after_recursion_fn 
	 * 			(sarà comunque invocata la funzione _each_recursion_complete_fn), 
	 * 			e anche come terminazione dell'iterazione sull'item padre
	 * 			(i figli successivi a quello processato non verranno dunque 
	 * 			processati, e saranno invocate le funzioni _after_recursion_fn e 
	 * 			_recursion_complete_fn). 
	 * 			function(elem, vars, is_first, child, value, child_vars, recursing_info)
	 * 		_after_recursion_fn: funzione invocata al termine naturale dell'invocazione
	 * 			su ciascun item. Il valore ritornato da questa funzione sarà il 
	 * 			risultato della ricorsione sull'item corrente e, se questo è 
	 * 			l'item radice, sarà il risultato dell'intera funzione ricorsiva.
	 * 			function(elem, vars, is_first, recursing_info)
	 * 		_each_recursion_complete_fn: funzione invocata al termine, naturale o 
	 * 			meno, di tutte le operazioni su un item figlio. Viene garantito
	 * 			che, se su un figlio è stata invocata la funzione _before_each_recursion_fn,
	 * 			sarà anche invocata questa funzione.
	 * 			Se questa funzione ritorna un elemento diverso da undefined, 
	 * 			l'iterazione sul figlio sarà ripetuta su tale elemento (se ritorna
	 * 			true, l'elemento sarà lo stesso), a partire dalla funzione 
	 * 			_before_each_recursion_fn, senza intralciare l'andamento della
	 * 			ricorsione sugli altri figli.
	 * 			function(elem, vars, is_first, child, value, child_vars, recursing_info)
	 * 		_recursion_complete_fn: funzione invocata al termine, naturale o 
	 * 			meno, di tutte le operazioni su un item. Viene garantito che, se 
	 * 			su un figlio è stata invocata la funzione _before_recursion_fn,
	 * 			sarà anche invocata questa funzione.
	 * 			Se questa funzione ritorna un elemento diverso da undefined, 
	 * 			l'iterazione sull'item sarà ripetuta su tale elemento (se ritorna
	 * 			true, l'elemento sarà lo stesso), a partire dalla funzione 
	 * 			_before_recursion_fn, senza intralciare l'andamento della
	 * 			ricorsione sugli altri figli o sul padre (che invocherà le 
	 * 			funzioni _after_each_recursion_fn e _each_recursion_complete_fn
	 * 			solo al vero termine dell'iterazione sull'item stesso).
	 * 			function(elem, vars, is_first, value, recursing_info)
	 * 		_this_in_fn: oggetto eventualmente utilizzato come contesto (this)
	 * 			nell'invocazione delle funzioni
	 * 
	 * TODO: aggiungiamo excludeStarting, searchingFirst, maxDepth, tutti i TODO
	 * 		di select_function, ed eventuali altri...
	 */
	recursiveCall : function(_starting_object, _before_recursion_fn, _next_fn, _before_each_recursion_fn, _after_each_recursion_fn,
			_after_recursion_fn, _each_recursion_complete_fn, _recursion_complete_fn, _this_in_fn, _first_vars){
		if(_starting_object==null || _next_fn==null || ( _before_recursion_fn==null && _before_each_recursion_fn==null &&
														_after_each_recursion_fn==null && _after_recursion_fn==null) )
			return null;
		
		var _recursings = new Array();
		var _first_recursing = _._private.recursingInfoObj(_starting_object, true);
		_.addAsFirst(_recursings, _first_recursing);
		
		var _recursing = null;
		var _recursing_obj = null;
		var _recursing_parent_info = null; 
		var _recursing_parent = null;
		var _is_starting_obj = null;
		var _is_parent_starting_obj = null;
		var _repeating_obj = null;
		var _repeating_child = null;
		var _before_child_fn = null;
		var _after_fn = null;
		var _after_return = null;
		var _vars = null;
		
		while(_recursings.length>0){
			_recursing =  _recursings[0];
			
			_repeating_obj = _recursing.repeating;
			if(_.is(_repeating_obj))
				_recursing.repeating = undefined;
			_repeating_child = _recursing.repeating_child;
			if(!!_repeating_child)
				_recursing.repeating_child = undefined;
			
			_recursing_obj = _.is(_repeating_obj) ? _repeating_obj : 
					( (_recursing.returned!==undefined) ? null : 
						_.removeFirst(_recursing.objects) );
			
			if(!!_recursing_obj){
				// process the next nested recursion
				if(_.is(_repeating_obj)){
					// if an object has to repeat its recursion, the object_pos index, and the item vars, have not to change; if the repeating was decided in a beforeChild or afterChild function, the whole child iteration has to be repeated (including the beforeChild function), otherwise only the item iteration (before-next-after-itemComplete, than the afterChild and childComplete as normal...)
					_before_child_fn = (!!_repeating_child) ? _before_each_recursion_fn : null;
				}
				else{
					if(!!_recursing.caller){
						_recursing.object_pos = _recursing.object_pos+1;
						_vars = {};
					}
					else
						_vars = _first_vars;
					_before_child_fn = _before_each_recursion_fn;
				}
				
				_return = _._private.callInRecursion(_recursing_obj, _recursings, _next_fn, _before_recursion_fn,  _before_child_fn,
						_after_each_recursion_fn, _after_recursion_fn, _each_recursion_complete_fn, _recursion_complete_fn, _this_in_fn, _vars);
			}
			else{
				// nested recursions are terminated, or we returned in one of the second part of the for (just after a nested recursion)
				_.removeFirst(_recursings);
				_vars = {};
				
				_recursing_parent_info = _recursings.length>0 ? _recursings[0] : null; 
				_recursing_parent = (!!_recursing_parent_info) ? _recursing_parent_info.caller : null;
				_is_starting_obj = (!_recursing_parent);
				_is_parent_starting_obj = (!!_recursing_parent_info) ? ((!!_recursing_parent_info.caller) && (!_recursing_parent_info.caller_parent)) : false; 
				
				if(!!_recursing_parent_info){
					// if _recursing.returned is true, the return was made in a beforeChild or afterChild function, so the after function has not to be called (and the return has not to be considered)
					_after_fn = _.is(_recursing.returned) ? null : _after_recursion_fn;
					_after_return = _._private.afterRecursion(_recursing.caller, _is_starting_obj, _recursing_parent, _is_parent_starting_obj, 
							_recursing_parent_info,	_recursing.vars, _after_each_recursion_fn, _after_fn, _each_recursion_complete_fn, _recursion_complete_fn, _this_in_fn, undefined);
					if(!_.is(_recursing.returned))
						_return = _after_return;
				}
			}
		}
		
		// the last returned value is relative to the root recursion
		return _return;
	}
	
});
	
	
////////////////////////////////////////////////////////////////////////////////////////////	
	/* Flexible id generation with isolate increments for different context */

_._private.id_gens = {};

_.mixin({
	
	/**
	 * Returns an id generator function with isolated id increments
	 */
	idGen: function(prefix){
		if(_.isNullOrEmpty(prefix))
			prefix = "_";
		var MAX_POS = 2147483647; // max positive int with shift operations ok (no strange behaviours..)
		var max = 0;
		return function(){
			if(max<MAX_POS){
				max++;
				return prefix+max;
			}
		};
	},
	
	createGen: function(prefix){
		if(_.is(_._private.id_gens[prefix])){
			var MAX_POS = 2147483647; // max positive int with shift operations ok (no strange behaviours..)
			for(var i=2; i<MAX_POS; i++){
				var new_pref = prefix+i;
				if(!_.is(_._private.id_gens[new_pref])){
					_._private.id_gens[new_pref] = _.idGen(new_pref);
					return _._private.id_gens[new_pref];
				}
			}
		}
		else{
			_._private.id_gens[prefix] = _.idGen(prefix);
			return _._private.id_gens[prefix];
		}
	},
	
	/**
	 * Returns a globally unique id, with isolated increments for each prefix (prefix are auto-incremented when they reach the max integer value)
	 */
	id: function(prefix){
		if(_.isNullOrEmpty(prefix))
			prefix = "_";
		var gen = _._private.id_gens[prefix];
		if(!_.is(gen))
			gen = _.createGen(prefix);
		
		if(_.is(gen)){
			var ret = gen();
			if(_.is(ret))
				return ret;
			else{ // last generator is full: create a new one...
				gen = _.createGen(prefix);
				return gen();
			}
		}
	}
	
});
	

////////////////////////////////////////////////////////////////////////////////////////////
	/* Event source, taken from Backbone.js (function Backbone.Events) */

_._private.event_source_prototype = {
		
	// Bind an event, specified by a string name, `ev`, to a `callback` function.
	// Passing `"all"` will bind the callback to all events fired.
	bind : function(ev, callback) {
		var calls = this._callbacks || (this._callbacks = {});
		var list  = this._callbacks[ev] || (this._callbacks[ev] = []);
		list.push(callback);
		return this;
    },

    // Remove one or many callbacks. If `callback` is null, removes all
    // callbacks for the event. If `ev` is null, removes all bound callbacks
    // for all events.
    unbind : function(ev, callback) {
    	var calls;
    	if (!ev) {
    		this._callbacks = {};
    	} 
    	else if (calls = this._callbacks) {
	    	if (!callback) {
	    		calls[ev] = [];
	    	} else {
		        var list = calls[ev];
		        if (!list) return this;
		        for (var i = 0, l = list.length; i < l; i++) {
		        	if (callback === list[i]) {
			            list[i] = null;
			            break;
		        	}
		        }
	    	}
    	}
    	return this;
    },

    // Trigger an event, firing all bound callbacks. Callbacks are passed the
    // same arguments as `trigger` is, apart from the event name.
    // Listening for `"all"` passes the true event name as the first argument.
    trigger : function(eventName) {
	    var list, calls, ev, callback, args, i, l;
	    var both = 2;
	    if (!(calls = this._callbacks)) return this;
	    while (both--) {
	    	ev = both ? eventName : 'all';
	    	if (list = calls[ev]) {
	    		for (i = 0, l = list.length; i < l; i++) {
	    			if (!(callback = list[i])) {
	    				list.splice(i, 1); i--; l--;
	    			} else {
	    				args = both ? Array.prototype.slice.call(arguments, 1) : arguments;
	    				callback.apply(this, args);
	    			}
	    		}
	    	}
	    }
	    return this;
    }
		
};
_._private.EventSource = _.getFn(_._private.event_source_prototype);

_.mixin({
	
	/** 
	 * Returns an event source function or object, depending from the parameters.
	 * If object_or_constructor is a function (or null) extends the EventSource function with the specified constructor and prototype and 
	 * returns it, else if it's an object it's directly extended to support event binding and triggering. 
	 */
	eventSrc : function(object_or_constructor, function_prototype){
		if(!_.is(object_or_constructor))
			object_or_constructor = new function(){};
		if(_.isFunction(object_or_constructor))
			return _.extendFn(_._private.EventSource, object_or_constructor, function_prototype);
		else if(_.isObject(object_or_constructor))
			return _.extend(object_or_constructor, _private.event_source_prototype);
		else
			return object_or_constructor;
	}	

});

	

////////////////////////////////////////////////////////////////////////////////////////////
	/* Device investigations */
	
_._private.Device = _.getFn(
	function(user_agent){
		var device=this.find(user_agent);
		this.platform = device.platform;
		this.engine = device.engine;
		this.engine_version = device.engine_version;
	},
	{
		find : function(ua){
			if(_.isNullOrEmpty(ua))
				ua = navigator.userAgent;
			
			/* FROM JQUERY: */
			ua = ua.toLowerCase();
		
			var rwebkit = /(webkit)[ \/]([\w.]+)/;
			var ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
			var rmsie = /(msie) ([\w.]+)/;
			var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
			
			var match = rwebkit.exec( ua ) ||
				ropera.exec( ua ) ||
				rmsie.exec( ua ) ||
				ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
				[];
			var engine = {
				webkit : (match[1]=="webkit"), 
				opera : (match[1]=="opera"),
				msie : (match[1]=="msie"),
				mozilla : (match[1]=="mozilla") 
			};
			var engine_version=match[2] || "0";
			/* END JQUERY */
			
			var riphone = /(iphone)/;
			var ripad = /(ipad)/;
			var randroid = /(android)/;
			var rblackberry = /(blackberry)/;
			var rios = /(mac os x)[ \w.]+(mobile)/;
			var rmacos = /(mac os x)/; // less than ios, after in the OR
			var rlinux = /(linux)/;
			var rwindows = /(windows)/;
			match = riphone.exec( ua ) || ripad.exec( ua ) || randroid.exec( ua ) ||
					rblackberry.exec( ua ) || rios.exec( ua ) || rmacos.exec( ua ) ||
					rlinux.exec( ua ) || rwindows.exec( ua ) ||	[];
			var platform = {
				iphone : (match[1]=="iphone"),
				ipad : (match[1]=="ipad"),
				android : (match[1]=="android"),
				blackberry : (match[1]=="blackberry"),
				ios : (match.length>2 && match[2]=="mobile"),
				macos: (match[1]=="macos"),
				linux : (match[1]=="linux"),
				windows : (match[1]=="windows")
			}; 
			
			return {engine: engine, engine_version: engine_version, platform: platform};
		},
			
		isMobileWebkit : function(){
			return (this.platform.ios || this.platform.android || this.platform.blackberry);
		},
		
		json: function(){
			return {
				engine: this.engine,
				engine_version: this.engine_version,
				platform: this.platform
			};
		}
	}
);

_.mixin({
	device : function(user_agent){
		return new _._private.Device(user_agent);
	}
});

	
////////////////////////////////////////////////////////////////////////////////////////////
	/* HAOP support (Html Aspected Oriented Programming) */
	
_._private.HAOP={

	interceptors : new Array(),
	
	findInterceptors: function(obj, function_name, intercept_before){
		if(!obj)
			return null;
		var obj_interceptors = this.getObjectInterceptors(obj);
		if(obj_interceptors){
			if(function_name){
				if(obj_interceptors[function_name]){
					if(intercept_before===true)
						return obj_interceptors[function_name].before;
					else if(intercept_before===false)
						return obj_interceptors[function_name].after;
					else
						return obj_interceptors[function_name];
				}
				else
					return null;
			}
			else
				return obj_interceptors;
		}
		else
			return null;
	},
	
	getObjectInterceptors: function(_obj, create_if_null){
		var obj_interceptors = _.detect(this.interceptors, function(obj_interceptor){ return (obj_interceptor.obj==_obj); });
		if((!obj_interceptors) && create_if_null){
			obj_interceptors = {
				obj : _obj
			};
			this.interceptors.push(obj_interceptors);
		}
		return obj_interceptors;
	},
	
	getFunctionInterceptors: function(_obj, function_name, intercept_before, create_if_null){
		var obj_inters = this.getObjectInterceptors(_obj, create_if_null);
		var fn_inters = obj_inters ? obj_inters[function_name] : null;
		var intercept_type = (intercept_before===true) ? "before" : ( (intercept_before===false) ? "after" : null ) ;
		if(create_if_null){
			if(!fn_inters){
				var _fn = _obj[function_name];
				if(_.isFunction(_fn)){
					_obj[function_name] = function(){
						return _._private.HAOP.callHaop(_obj, function_name, this, arguments);
					};
					obj_inters[function_name] = {
						fn : _fn	
					};
					fn_inters = obj_inters[function_name];
				}
				else 
					_.log("WARNING: can't intercept "+function_name+(_.is(_fn) ? ": it's not a function!" : ": it doesn't exist!"));
			}
			if(intercept_type && _.is(fn_inters) && (!fn_inters[intercept_type]))
				fn_inters[intercept_type] = new Array();
		}
		return fn_inters ? (intercept_type ? fn_inters[intercept_type] : fn_inters) : null;
	},
	
	intercept : function(obj, function_name, interceptor_fn, intercept_before, interceptor_this, interceptor_opts){
		var inters = this.getFunctionInterceptors(obj, function_name, (intercept_before ? intercept_before : false) , true);
		if(inters){
			inters.push({
				fn : interceptor_fn,
				fn_this : interceptor_this,
				opts : interceptor_opts
			});
			return true;
		}
		else
			return false;
	},
	
	callHaop : function(_obj, function_name, _this, _args){
		var fn_inters = this.findInterceptors(_obj,function_name);
		var inter_args = {
			obj : _obj,	
			fn : function_name,
			fn_this : _this,
			fn_args : _args,
			fn_return : undefined,
			fn_error : undefined,
			stopped : false,
			catch_err : false
		};
		//_.log("Interceptors on "+function_name+" of "+_obj+": "+ (fn_inters && fn_inters.before ? fn_inters.before.length : 0)+
		//		" before, "+(fn_inters && fn_inters.after ? fn_inters.after.length : 0)+" after");
		if(fn_inters && fn_inters.before)
			// calls before interceptors: they can adjust this pointer and arguments for the function, or stop its esecution at all 
			_.each(fn_inters.before, function(inter){
				var inter_this = inter.fn_this ? inter.fn_this : _this;
				inter_args.opts = inter.opts;
				try{
					inter.fn.call(inter_this,inter_args); 
				}catch(err){
					_.log("Error in BEFORE interception of "+function_name+": "+err);
				}
			});
		
		if(!inter_args.stopped)
			try{
				inter_args.fn_return = fn_inters.fn.apply(inter_args.fn_this,inter_args.fn_args); 
			}catch(err){
				inter_args.fn_error = err;
			}
		
		if(fn_inters && fn_inters.after)
			// calls after interceptors: they can change the function return or the thrown error, or catch an eventual error 
			_.each(fn_inters.after, function(inter){
				var inter_this = inter.fn_this ? inter.fn_this : _this;
				inter_args.opts = inter.opts;
				try{
					inter.fn.call(inter_this,inter_args); 
				}catch(err){
					_.log("Error in AFTER interception of "+function_name+": "+err);
				}
			});
		
		if(inter_args.fn_error!=null){
			if(!inter_args.catch_err)
				throw inter_args.fn_error;
		}
		return inter_args.fn_return;
	}
	
};

_.mixin({
	/**
	 * TODO: comment this!
	 */
	intercept : function(obj, function_name, interceptor_fn, intercept_before, interceptor_this, interceptor_opts){
		_._private.HAOP.intercept(obj, function_name, interceptor_fn, intercept_before, interceptor_this, interceptor_opts);
	}
});
	
	


////////////////////////////////////////////////////////////////////////////////////////////
/* Object differences support */

_.mixin({
	
	plainObjDiff: function(obj, other_obj, not_deep, sep, result, path){
		if(!_.is(result))
			result = {};
		
		if((!!not_deep) && (!_.isEmpty(result)))
			return;
		
		if(!_.is(path))
			path = "";
		if(!_.is(sep))
			sep = _.nav().sep();
		var diffPath = function(field_name){
			return _.isNotEmptyString(path) ? (path+sep+field_name) : (_.is(field_name) ? (""+field_name) : "");
		};
		
		if( (_.isObject(obj) && _.isObject(other_obj)) || (_.isArray(obj) && _.isArray(other_obj)) ){
			var fields = _.fields(obj);
			var other_fields = _.fields(other_obj);
			// modified and removed fields
			_.each(fields, function(field_name){
				
				if((!!not_deep) && (!_.isEmpty(result)))
					return;
				
				var field_path = diffPath(field_name);
				if(_.include(other_fields, field_name))
					_.plainObjDiff(_.field(obj, field_name), _.field(other_obj, field_name), not_deep, sep, result, field_path);
				else
					result.removed = _.add(result.removed, field_path);
			}, this);
			
			if((!!not_deep) && (!_.isEmpty(result)))
				return result;
			
			// added fields
			_.each(other_fields, function(other_field_name){
				if(!_.include(fields, other_field_name))
					result.added = _.add(result.added, diffPath(other_field_name));
				
				if((!!not_deep) && (!_.isEmpty(result)))
					return;
			}, this);
		} 
		else{
			if((!!not_deep) && (!_.isEmpty(result)))
				return result;
			
			if(obj!=other_obj)
				result.modified = _.add(result.modified, (_.isNotEmptyString(path) ? path : "") );
		}
		
		return result;
	},
	
	
	objDiff: function(obj, other_obj, not_deep, structured, sep){
		var diff = this.plainObjDiff(obj, other_obj, not_deep, sep);
		if(!!structured){
			var nav = _.nav({}, sep);
			
			var diff_field = "_DIFF_TYPE_";
			var removed_val = "removed";
			var added_val = "added";
			var modified_val = "modified";
			
			_.each(diff.added, function(added){
				nav.set(added+sep+diff_field,added_val);
			}, this);
			_.each(diff.modified, function(modified){
				nav.set(modified+sep+diff_field,modified_val);
			}, this);
			_.each(diff.removed, function(removed){
				nav.set(removed+sep+diff_field,removed_val);
			}, this);
			
			return nav.root();
		}
		else
			return diff;
	},
	
	/* Checks a difference between two objects comparing a subset of field paths. Returns the first found path. NB: use weak equals (todo: add param) */
	checkDiffs: function(obj, other_obj, fields_to_check, path_separator){
		var obj_nav = _.nav(obj, path_separator);
		var other_nav = _.nav(other_obj, path_separator);
		fields_to_check = _.asArray(fields_to_check);
		if(_.isNotEmptyArray(fields_to_check)){
			var ret = null;
			_.find(fields_to_check, function(field_to_check){
				var obj_val = obj_nav.get(field_to_check);
				var other_val = other_nav.get(field_to_check);
				if( (_.isObject(obj_val) && _.isObject(other_val)) || (_.isArray(obj_val) && _.isArray(other_val)) ){
					var diffs = _.objDiff(obj_val, other_val, true, false, path_separator);
					diffs = _.values(diffs);
					if(_.isNotEmptyArray(diffs)){
						ret = field_to_check + path_separator + diffs[0];
						return true;
					}
				}
				else if((!_.is(obj_val)) && (!_.is(other_val)))
					return false;
				else if(obj_val != other_val){
					ret = field_to_check;
					return true;
				}
			});
			return ret;
		}
	}

});


	

////////////////////////////////////////////////////////////////////////////////////////////
	/* _+ Separated contexts support */

_._private.plus = {
		
	prototypes : {},	
	functions: {},
	
	getPlusFn : function(plus_name, fn_name){
		var fn = function(){
			var args = arguments;
			if(_.is(this._obj)){
				if(arguments.length>0){
					args = _.argsToArr(arguments);
					args.splice(0,0,this._obj);
				}
				else
					args = [this._obj];
			}
			var ret = _._private.plus.prototypes[plus_name][fn_name].apply(this,args);
			return (!this._chained) ? ret :
				( _._private.plus.prototypes[plus_name].is(ret) ?  _._private.plus.constructPlus(plus_name,ret).chain() : _(ret).chain());
		};
		return fn;
	},
	
	createPlus : function(_name, _prototype){
		if(_.is(_prototype)){
			// checks that the get and is functions exist, otherwise creates them by default
			if(!_.is(_prototype.get))
				_prototype.get = function(obj){
					return _.is(obj) ? obj : null;
				};
			if(!_.is(_prototype.is))
				_prototype.is = function(obj){
					return _.is(this.get(obj)) ? true : false;
				};	
			_._private.plus.prototypes[_name] = _prototype;
			// builds the plus function prototype	
			var fn_prototype = {
				_chained : false,
				// emulates _.chain
				chain : function(){
					this._chained = true;
					return this;
				},
				// emulates _.value
				value : function(){
					return this._obj;
				},
				// adds the _ function to get a complete _ object instead of the actual _plus object
				_ : function(){
					var ret = _(this._obj);
					if(this._chained)
						ret.chain();
					return ret;
				}
			};
			var keys = _.keys(_prototype);
			_.each(keys, function(key){
				fn_prototype[key] = _._private.plus.getPlusFn(_name, key);
			});
			// creates the plus function and registers it as an _ mixin
			_._private.plus.functions[_name] = _.getFn(fn_prototype);
			var plus_fn = function(){
				return _._private.plus.constructPlus(_name,arguments);
			};
			var mixin_obj = {};
			mixin_obj[_name] = plus_fn;
			_.mixin(mixin_obj);
			return plus_fn;
		}
	},
	
	constructPlus: function(plus_name, obj_or_args){
		var fn = null;
		if(_.is(obj_or_args)){
			fn = new _._private.plus.functions[plus_name]();
			if(_.isArray(obj_or_args) || _.isArguments(obj_or_args))
				fn._obj = _._private.plus.prototypes[plus_name].get.apply(null,obj_or_args);
			else
				fn._obj = obj_or_args;
		}
		else
			fn = _.plus(plus_name);
		return fn;
	}
	
};

_.mixin({
	// TODO: Comment this!
	// TODO: cerchiamo di farlo come _, che costruisce col wrapper cò.. e riesce a fare che _ è sia object che function.. così sarebbe bello pure
	// 		per i plus...
	// TODO: aggiungiamo in qualche modo la costruzione di un plus dall'oggetto direttamente, con una ricerca prima sugli is e poi sui get,
	// 		nell'ordine in cui sono stati dichiarati... una cosa simile poi dovremo farla per i plus Query, ma forse possiamo farlo direttamente 
	//		solo qua e poi usarlo anche la...
	// TODO: Attenzione: nella documementazione va chiarito che il modo in cui verranno invocati i metodi dipenderà sempre dalla funzione get():
	// 		 se questa ritorna null, allora i metodi saranno invocati senza passare _obj come primo parametro, altrimenti il valore ritornato 
	//		 sarà l'_obj e verrà dunque passato come prima parametro nelle funzioni... in genere è bene ritornare null se il valore di ingresso
	//		 è null o undefined, in modo che l'oggetto possa poi invocare le funzioni direttamente (es: _.arr2().test(obj) viene invocato con
	//		 il parametro obj come secondo parametro se la funzione get ritorna sempre un oggetto !=null...).
	//		 OVVIAMENTE questa cosa si risolve se risolviamo il fatto che dicevamo prima, cioè farlo come _ (sia oggetto che funzione... bah...)..
	plus: function(_prototype, _name){
		if(_.is(_prototype) && (!_.isString(_prototype))){
			if(_.is(_name))
				return _._private.plus.createPlus(_name, _prototype);
			else
				return _.mixin(_prototype);
		}
		else
			return _.isString(_prototype) ? _._private.plus.functions[_prototype].prototype : _.keys(_._private.plus.prototypes);
	},
	plusSrc: function(plus_name){
		return _._private.plus.prototypes[plus_name];
	}
});	



////////////////////////////////////////////////////////////////////////////////////////////
		/* Adding plus logic for objects in _.js and _.string */

_.mixin({
	
	fn: function(obj){
		var ret = _.isString(obj) ? _.parse(obj) : obj;
		return _.isFunction(ret) ? _(ret) : _(); 
	},
	
	arr: function(obj){
		var arr = _.asArray(obj);
		return _(arr);
	},
	
	obj: function(obj){
		if(!_.is(obj))
			obj = {};
		return _(obj);
	}
});



////////////////////////////////////////////////////////////////////////////////////////////
		/* Adding query capabilities on tree contexts (HTML, js objects and all ) */

_._private.query = {
		
};










if (typeof exports !== 'undefined') {
    _.mixin(exports._s);	
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
}





	
	
