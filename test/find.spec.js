describe('DSHalAdapter.find(resourceConfig, id, options)', function () {

  it('should make a GET request', function (done) {
    var _this = this;

    adapter.find(Post, 1).then(function (data) {
      assert.deepEqual(data, p1, 'post should have been found');

      adapter.find(Post, 1, { basePath: 'api2' }).then(function (data) {
        assert.deepEqual(data, p1, 'post should have been found');
        assert.equal(queryTransform.callCount, 0, 'queryTransform should not have been called');
        done();
      }).catch(function (err) {
        console.error(err.stack);
        done('should not have rejected');
      });

      setTimeout(function () {
        assert.equal(2, _this.requests.length);
        assert.equal(_this.requests[1].url, 'api2/posts/1');
        assert.equal(_this.requests[1].method, 'get');
        _this.requests[1].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(p1));
      }, 10);
    }).catch(function (err) {
      console.error(err.stack);
      done('should not have rejected');
    });

    setTimeout(function () {
      assert.equal(1, _this.requests.length);
      assert.equal(_this.requests[0].url, 'api/posts/1');
      assert.equal(_this.requests[0].method, 'get');
      _this.requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(p1));
    }, 10);
  });

  it('should use default configs', function (done) {
    var _this = this;

    adapter.defaults.httpConfig.params = { test: 'test' };
    adapter.defaults.httpConfig.headers = { Authorization: 'test' };

    adapter.find(Post, 1).then(function (data) {
      assert.deepEqual(data, p1, 'post should have been found');

      delete adapter.defaults.httpConfig.params;
      delete adapter.defaults.httpConfig.headers;
      done();
    }).catch(function (err) {
      console.error(err.stack);
      done('should not have rejected');
    });

    setTimeout(function () {
      assert.equal(1, _this.requests.length);
      assert.equal(_this.requests[0].url, 'api/posts/1?test=test');
      assert.equal(_this.requests[0].method, 'get');
      assert.deepEqual({
        Authorization: 'test',
        Accept: 'application/json, text/plain, */*'
      }, _this.requests[0].requestHeaders);
      _this.requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(p1));
    }, 10);
  });
});
