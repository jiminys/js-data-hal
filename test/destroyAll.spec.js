describe('DSHalAdapter.destroyAll(resourceConfig, params, options)', function () {

  it('should make a DELETE request', function (done) {
    var _this = this;

    adapter.destroyAll(Post, {}).then(function (data) {
      assert.equal('', data, 'posts should have been found');

      adapter.destroyAll(Post, {
        where: {
          author: {
            '==': 'John'
          }
        }
      }, { basePath: 'api2' }).then(function (data) {
        assert.equal('', data, 'posts should have been destroyed');
        assert.equal(queryTransform.callCount, 2, 'queryTransform should have been called');
        done();
      }).catch(function (err) {
        console.error(err.stack);
        done('should not have rejected');
      });

      setTimeout(function () {
        assert.equal(2, _this.requests.length);
        assert.equal(_this.requests[1].url, 'api2/posts?where=%7B%22author%22:%7B%22%3D%3D%22:%22John%22%7D%7D');
        assert.equal(_this.requests[1].method, 'delete');
        _this.requests[1].respond(204);
      }, 10);
    }).catch(function (err) {
      console.error(err.stack);
      done('should not have rejected');
    });

    setTimeout(function () {
      assert.equal(1, _this.requests.length);
      assert.equal(_this.requests[0].url, 'api/posts');
      assert.equal(_this.requests[0].method, 'delete');
      _this.requests[0].respond(204);
    }, 10);
  });
});
