describe('filters', function() {

    var $filter;

    beforeEach(module('app.filters'));
    beforeEach(inject(function(_$filter_) {
        
        $filter = _$filter_;
    }));

    describe('resource filter', function() {

        var formatter;
        
        beforeEach(function() {
            formatter = $filter('resource');
        });

        it('should format a single resource object', function() {

            //handle unexcepted format
            expect(formatter([{  }])).toBe('');
            expect(formatter({ })).toBe('');
            
            //handle unexcepted value of name or hour
            expect(formatter([{ name: {}, hour: 1 }])).toBe('');
            expect(formatter([{ name: 0, hour: 1 }])).toBe('');
            expect(formatter([{ name: 'Leo Gao', hour: -1 }])).toBe('Leo Gao()');
            expect(formatter([{ name: 'Leo Gao', hour: 'nan' }])).toBe('Leo Gao()');
            
            expect(formatter({ name: 'Leo Gao' })).toBe('Leo Gao()');
            expect(formatter([{ name: 'Leo Gao' }])).toBe('Leo Gao()');
            expect(formatter([{ name: 'Leo Gao' }], true)).toBe('Leo Gao');
            expect(formatter([{ name: 'Leo Gao', hour: 2 }])).toBe('Leo Gao(2)');
            expect(formatter([{ name: 'Leo Gao', hour: 2 }], true)).toBe('Leo Gao');
        });
        
        it('should format multi resource object', function() {
            
            expect(formatter([{ name: 'Leo Gao' }, { name: 'Bruce Jiang' }])).toBe('Leo Gao(),Bruce Jiang()');
            expect(formatter([{ name: 'Leo Gao', hour: 4 }, { name: 'Bruce Jiang', hour: 2 }])).toBe('Leo Gao(4),Bruce Jiang(2)');
            expect(formatter([{ name: 'Leo Gao', hour: 4 }, { name: 'Bruce Jiang', hour: 2 }], true)).toBe('Leo Gao,Bruce Jiang');
        });
        
        it('should concat resource from different resource array', function() {
            
            expect(formatter([{ name: 'Leo Gao' }, { name: 'Bruce Jiang' }], [{ name: 'Leo Gao' }, { name: 'Alisa Xing' }]))
                .toBe('Leo Gao(),Bruce Jiang(),Alisa Xing()');
            expect(formatter([{ name: 'Leo Gao' }, { name: 'Bruce Jiang' }], [{ name: 'Leo Gao' }, { name: 'Alisa Xing' }], true))
                .toBe('Leo Gao,Bruce Jiang,Alisa Xing');
            
            //can pass resource object array or a single resource object
            expect(formatter([{ name: 'Leo Gao' }, { name: 'Bruce Jiang' }], { name: 'Leo Gao', hour: 4 })).toBe('Leo Gao(4),Bruce Jiang()');
            //ignore the invalid hour
            expect(formatter([{ name: 'Leo Gao', hour: -1 }, { name: 'Bruce Jiang' }], [{ name: 'Leo Gao', hour: 2 }, { name: 'Alisa Xing', hour: {} }]))
                .toBe('Leo Gao(2),Bruce Jiang(),Alisa Xing()');
            
        });
    });
});
