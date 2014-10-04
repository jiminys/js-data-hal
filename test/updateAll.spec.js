describe('DSHalAdapter.updateAll(resourceConfig, attrs, params, options)', function () {

  it('should make a PUT request', function (done) {
    var _this = this;

    adapter.updateAll(Post, { author: 'John', age: 30 }).then(function (data) {
      assert.deepEqual(data, [p1], 'posts should have been updated');

      adapter.updateAll(Post, { author: 'John', age: 30 }, {
        where: {
          author: {
            '==': 'John'
          }
        }
      }, { basePath: 'api2' }).then(function (data) {
        assert.deepEqual(data, [p1], 'posts should have been updated');
        assert.equal(queryTransform.callCount, 1, 'queryTransform should have been called');
        done();
      }).catch(function (err) {
        console.error(err.stack);
        done('should not have rejected');
      });

      setTimeout(function () {
        assert.equal(2, _this.requests.length);
        assert.equal(_this.requests[1].url, 'api2/posts?where=%7B%22author%22:%7B%22%3D%3D%22:%22John%22%7D%7D');
        assert.equal(_this.requests[1].method, 'put');
        _this.requests[1].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify([p1]));
      }, 10);
    }).catch(function (err) {
      console.error(err.stack);
      done('should not have rejected');
    });

    setTimeout(function () {
      assert.equal(1, _this.requests.length);
      assert.equal(_this.requests[0].url, 'api/posts');
      assert.equal(_this.requests[0].method, 'put');
      _this.requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify([p1]));
    }, 10);
  });
});
