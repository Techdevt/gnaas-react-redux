import csp, { go, chan, take, put } from 'js-csp';

export function encodeTextContent(str) {
  return str.replace(/[<>&]/g, function(str) {
    return {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;'
    }[str];
  })
}

export function decodeTextContent(str) {
  return str.replace(/(&lt;|&gt;|&amp;)/g, function(str) {
    return {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&'
    }[str];
  })
}

export function prevented(cb) {
  return function(e) {
    e.preventDefault();
    return cb.apply(null, arguments);
  }
}

export function slugify(name) {
  return name.replace(/[ \n!@#$%^&*():"'|?=]/g, '-');
}

export function mergeObj(...args) {
  const obj = {};
  args.forEach(arg => {
    Object.keys(arg).forEach(k => {
      obj[k] = arg[k];
    });
  });
  return obj;
}

// channel utils

export function invokeCallback(func /*, args... */) {
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift(null);
  return invokeCallbackM.apply(this, args);
}

export function invokeCallbackM(ctx, func /*, args... */) {
  var args = Array.prototype.slice.call(arguments, 2);
  var c = chan();
  args.push(function(err, res) {
    go(function*() {
      if(err || res) {
        yield put(c, err ? csp.Throw(err) : res);
      }
      c.close();
    });
  });
  func.apply(ctx, args);
  return c;
}

export function takeAll(inChan) {
  var ch = chan();
  go(function*() {
    var item, arr = [];
    while((item = yield take(inChan)) !== csp.CLOSED) {
      arr.push(item);
    }
    yield put(ch, arr);
    ch.close();
  });
  return ch;
}

export function takeArray(chans) {
  var ch = chan();
  go(function*() {
    var arr = [];
    for(var i=0; i<chans.length; i++) {
      arr.push(yield take(chans[i]));
      chans[i].close();
    }
    yield put(ch, arr);
  });
  return ch;
}

export function toPromise(ch) {
  return new Promise(function(resolve, reject) {
    go(function*() {
      try {
        resolve(yield ch);
      }
      catch(e) {
        reject(e);
      }
    });
  });
}
