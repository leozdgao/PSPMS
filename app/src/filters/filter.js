angular.module('app.filters', [])

//  Description: filter to format resources
//
//  example:
//  [{ name: 'Leo.Gao', hour: 6 }, { name: 'Bruce.Jiang', hour: 2 }] => 'Leo.Gao(6), Bruce.Jiang(2)'
//
//  if the last param is true, result is 'Leo.Gao, Bruce.Jiang', default to false

.filter('resource', function() {
    return function() {
        
        var args = Array.prototype.concat.apply([], arguments);
        //get value of nohour
        var nohour = args[args.length - 1];
        if(typeof nohour != 'boolean') nohour = false;

        //filter the obj and the obj should have name property
        var input = Array.prototype.concat.apply([], args.filter(function(arg) {
            return angular.isObject(arg) && angular.isString(arg.name); 
        }));
        
        //concat resource obj
        if(input.length > 0) {
            input = input
                    .map(function(i){ return [i]; })
                    .reduce(function(pre, cur){
                        var has = false;
                        pre.forEach(function(i) {
                            if(i.name.trim() == cur[0].name.trim()) {
                                if(angular.isDefined(cur[0].hour)) {
                                    if(isNaN(parseInt(cur[0].hour)) || cur[0].hour < 0) cur[0].hour = 0;
                                    
                                    if(angular.isDefined(i.hour)) {
                                        if(isNaN(parseInt(i.hour)) || i.hour < 0) i.hour = 0;
                                        
                                        i.hour += cur[0].hour;
                                    }
                                    else i.hour = cur[0].hour;
                                }

                                has = true;
                            }
                        })
                        if(!has) pre = pre.concat(cur);
            
                        return pre;
                    });
        }
            
        return input.map(function(item) {

            //handle every single resource object
            var name = item.name;
            var hour = parseInt(item.hour);
            if(isNaN(hour) || hour < 0) hour = '';
            return String.prototype.concat.call(item.name || '',
                        nohour ? '' : "(" + hour + ")");

        }).join(','); //join with ','
    }
});

