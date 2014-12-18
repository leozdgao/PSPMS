describe('filters', function() {

    var $filter;

    beforeEach(module('app.filters'));
    beforeEach(inject(function(_$filter_) {
        $filter = _$filter_;
    }));

    //TODO
    describe('resource filter', function() {

        var formatter = $filter('resource');

        it('should format a single resource object', function() {
            var workers = [{ name: 'Leo Gao' }];
            var result = formatter(workers);

            expect(result).toBe('Leo Gao');
        });
    });
});
