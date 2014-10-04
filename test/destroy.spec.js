describe('DSHalAdapter.destroy(resourceConfig, id, options)', function () {

  it('should make a DELETE request', function (done) {
    var _this = this;

    adapter.destroy(Post, 1).then(function (data) {
      assert.deepEqual(data, '1', 'post should have been deleted');

      adapter.destroy(Post, 1, { basePath: 'api2' }).then(function (data) {
        assert.deepEqual(data, '1', 'post should have been deleted');
        assert.equal(queryTransform.callCount, 0, 'queryTransform should not have been called');
        done();
      }).catch(function (err) {
        console.error(err.stack);
        done('should not have rejected');
      });

      setTimeout(function () {
        assert.equal(2, _this.requests.length);
        assert.equal(_this.requests[1].url, 'api2/posts/1');
        assert.equal(_this.requests[1].method, 'delete');
        _this.requests[1].respond(200, {'Content-Type': 'text/plain'}, '1');
      }, 10);

    }).catch(function (err) {
      console.error(err.stack);
      done('should not have rejected');
    });

    setTimeout(function () {
      assert.equal(1, _this.requests.length);
      assert.equal(_this.requests[0].url, 'api/posts/1');
      assert.equal(_this.requests[0].method, 'delete');
      _this.requests[0].respond(200, {'Content-Type': 'text/plain'}, '1');
    }, 10);
  });
});
