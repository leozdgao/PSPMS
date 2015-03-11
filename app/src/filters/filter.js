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
            return input
					.map(function(i){ return [i]; })
					.reduce(function(pre, cur){
					    var has = false;
					    pre.forEach(function(i) {
					        if(i.name.trim() == cur[0].name.trim()) {
					            if(angular.isDefined(cur[0].hour)) {
					                if(isNaN(parseInt(cur[0].hour)) || cur[0].hour < 0) cur[0].hour = 0;
					                
					                if(angular.isUndefined(i.hour) || isNaN(parseInt(i.hour)) || i.hour < 0) i.hour = 0;
					                    
					                i.hour += cur[0].hour;
					            }

					            has = true;
					        }
					    });
					    if(!has) pre = pre.concat(cur);

					    return pre;
					})
					.map(function(item) {

			            //handle every single resource object
			            var name = item.name;
			            var hour = parseInt(item.hour);
			            if(isNaN(hour) || hour < 0) hour = '';
			            return String.prototype.concat.call(item.name || '',
			                        nohour ? '' : "(" + hour + ")");

			        }).join(','); //join with ',';
        }
        else return '';
    }
})

.filter('projectStatus', function() {
	return function(status) {
		switch(status) {
			case 0: return "Pending";
			case 1: return "Not Started";
			case 2: return "In Progress";
			case 3: return "Finished";
			case 4: return "Upgrading";
			case 9: return "Closed";
			default: return "";
		}
	}
})

.filter('projectStatusStyle', function() {
	return function(status) {
		switch(status) {
			case 0: return "label-default";
			case 1: return "label-warning";
			case 2: return "label-success";
			case 3: return "label-primary";
			case 4: return "label-info";
			case 9: return "label-danger";
			default: return "";
		}
	}
})

