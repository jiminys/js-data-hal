var JSData;

try {
  JSData = require('js-data');
} catch (e) {
}

if (!JSData) {
  try {
    JSData = window.JSData;
  } catch (e) {
  }
}

if (!JSData) {
  throw new Error('js-data must be loaded!');
}

var makePath = JSData.DSUtils.makePath;
var deepMixIn = JSData.DSUtils.deepMixIn;
var http = require('axios');

function Defaults() {

}

var defaultsPrototype = Defaults.prototype;

defaultsPrototype.queryTransform = function (resourceName, params) {
  return params;
};

defaultsPrototype.basePath = '';

defaultsPrototype.forceTrailingSlash = '';

defaultsPrototype.httpConfig = {};

defaultsPrototype.log = console ? console.log : function () {
};

defaultsPrototype.deserialize = function (resourceName, data) {
  return data ? ('data' in data ? data.data : data) : data;
};

defaultsPrototype.serialize = function (resourceName, data) {
  return data;
};

function DSHalAdapter(options) {
  this.defaults = new Defaults();
  deepMixIn(this.defaults, options);
}

var dsHalAdapterPrototype = DSHalAdapter.prototype;

dsHalAdapterPrototype.getIdPath = function (resourceConfig, options, id) {
  return makePath(options.basePath || this.defaults.basePath || resourceConfig.basePath, resourceConfig.getEndpoint(id, options), id);
};

dsHalAdapterPrototype.getAllPath = function (resourceConfig, options) {
  return makePath(options.basePath || this.defaults.basePath || resourceConfig.basePath, resourceConfig.getEndpoint(null, options));
};

dsHalAdapterPrototype.HTTP = function (config) {
  var _this = this;
  var start = new Date().getTime();
  config = deepMixIn(config, _this.defaults.httpConfig);
  if (_this.defaults.forceTrailingSlash && config.url[config.url.length] !== '/') {
    config.url += '/';
  }
  return http(config).then(function (data) {
    if (_this.defaults.log) {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(data.config.method + ' request: ' + data.config.url + ' Time taken: ' + (new Date().getTime() - start) + 'ms');
      _this.defaults.log.apply(_this.defaults.log, args);
    }
    return data;
  });
};

dsHalAdapterPrototype.GET = function (url, config) {
  config = config || {};
  if (!('method' in config)) {
    config.method = 'get';
  }
  return this.HTTP(deepMixIn(config, {
    url: url
  }));
};

dsHalAdapterPrototype.POST = function (url, attrs, config) {
  config = config || {};
  if (!('method' in config)) {
    config.method = 'post';
  }
  return this.HTTP(deepMixIn(config, {
    url: url,
    data: attrs
  }));
};

dsHalAdapterPrototype.PUT = function (url, attrs, config) {
  config = config || {};
  if (!('method' in config)) {
    config.method = 'put';
  }
  return this.HTTP(deepMixIn(config, {
    url: url,
    data: attrs || {}
  }));
};

dsHalAdapterPrototype.DEL = function (url, config) {
  config = config || {};
  if (!('method' in config)) {
    config.method = 'delete';
  }
  return this.HTTP(deepMixIn(config, {
    url: url
  }));
};

dsHalAdapterPrototype.find = function (resourceConfig, id, options) {
  var _this = this;
  options = options || {};
  return _this.GET(
    _this.getIdPath(resourceConfig, options, id),
    options
  ).then(function (data) {
      return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig.name, data);
    });
};

dsHalAdapterPrototype.findAll = function (resourceConfig, params, options) {
  var _this = this;
  options = options || {};
  options.params = options.params || {};
  if (params) {
    params = _this.defaults.queryTransform(resourceConfig.name, params);
    deepMixIn(options.params, params);
  }
  return _this.GET(
    _this.getAllPath(resourceConfig, options),
    options
  ).then(function (data) {
      return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig.name, data);
    });
};

dsHalAdapterPrototype.create = function (resourceConfig, attrs, options) {
  var _this = this;
  options = options || {};
  return _this.POST(
    makePath(options.basePath || this.defaults.basePath || resourceConfig.basePath, resourceConfig.getEndpoint(attrs, options)),
    options.serialize ? options.serialize(resourceConfig.name, attrs) : _this.defaults.serialize(resourceConfig.name, attrs),
    options
  ).then(function (data) {
      return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig.name, data);
    });
};

dsHalAdapterPrototype.update = function (resourceConfig, id, attrs, options) {
  var _this = this;
  options = options || {};
  return _this.PUT(
    _this.getIdPath(resourceConfig, options, id),
    options.serialize ? options.serialize(resourceConfig.name, attrs) : _this.defaults.serialize(resourceConfig.name, attrs),
    options
  ).then(function (data) {
      return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig.name, data);
    });
};

dsHalAdapterPrototype.updateAll = function (resourceConfig, attrs, params, options) {
  var _this = this;
  options = options || {};
  options.params = options.params || {};
  if (params) {
    params = _this.defaults.queryTransform(resourceConfig.name, params);
    deepMixIn(options.params, params);
  }
  return this.PUT(
    _this.getAllPath(resourceConfig, options),
    options.serialize ? options.serialize(resourceConfig.name, attrs) : _this.defaults.serialize(resourceConfig.name, attrs),
    options
  ).then(function (data) {
      return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig.name, data);
    });
};

dsHalAdapterPrototype.destroy = function (resourceConfig, id, options) {
  var _this = this;
  options = options || {};
  return _this.DEL(
    _this.getIdPath(resourceConfig, options, id),
    options
  ).then(function (data) {
      return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig.name, data);
    });
};

dsHalAdapterPrototype.destroyAll = function (resourceConfig, params, options) {
  var _this = this;
  options = options || {};
  options.params = options.params || {};
  if (params) {
    params = _this.defaults.queryTransform(resourceConfig.name, params);
    deepMixIn(options.params, params);
  }
  return this.DEL(
    _this.getAllPath(resourceConfig, options),
    options
  ).then(function (data) {
      return (options.deserialize ? options.deserialize : _this.defaults.deserialize)(resourceConfig.name, data);
    });
};

module.exports = DSHalAdapter;

