angular.module('app.filters', [])

//  Description: filter to format resources
//
//  example:
//  [{ name: 'Leo.Gao', hour: 6 }, { name: 'Bruce.Jiang', hour: 2 }] => 'Leo.Gao(6), Bruce.Jiang(2)'
//
//  if nohour is true, result is 'Leo.Gao, Bruce.Jiang'

.filter('resource', function() {
    return function(input, nohour) {
        if(Array.isArray(input)) {
            return input.map(function(item) {
                if(angular.isDefined(item)) {
                    return String.prototype.concat.call(item.name || '',
                                noTime ? '' : "(" + item.hour || '' + ")");
                }
                else return '';
            }).join(',');
        }
        else return '';
    }
});
