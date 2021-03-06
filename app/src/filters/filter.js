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
        // var input = Array.prototype.concat.apply([], args.filter(function(arg) {
        //     return angular.isObject(arg) && angular.isString(arg.name); 
        // }));
        var input = Array.prototype.concat.apply([], args.map(function(arg) {
            return { name: arg.resourceId.name, hour: arg.hour };
        }))
        
        //concat resource obj
        if(input.length > 0) {
            return input
                    .map(function(i) { return [i]; })
                    .reduce(function(pre, cur){
                        var has = false;
                        pre.forEach(function(i) {
                            if(i.name.trim() == cur[0].name.trim()) {
                                if(angular.isDefined(cur[0].hour)) {
                                    if(isNaN(+(cur[0].hour)) || cur[0].hour < 0) cur[0].hour = 0;
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

                    }).join(', '); //join with ', ';
        }
        else return '';
    }
})

// .filter('resourceWorker', function() {
//     return function(workers) {
//         if(angular.isArray(workers)) {
//             return workers.map(function(worker) {
//                 var resource = worker.resourceId;
//                 return resource.name || '' + '(' + worker.hour + ')';
//             }).join(', ');
//         }
//         else return "";
//     }
// })

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

.filter('projectType', function() {
    return function(project) {
        var types = [];
        if(project.isPlugin) types.push('Plugin');
        if(project.isCodeBase) types.push('CodeBase');
        if(project.isUtility) types.push('Utility');
        if(project.isPAPI) types.push('PAPI');
        if(project.isWebService) types.push('WebService');

        if(types.length > 0) return '[ ' + types.join(' / ') + ' ]';
    }
})

.filter('JobStatus', function() {
    return function(status) {
        switch(status) {
            case 0: return "Not Started";
            case 1: return "In Progress";
            case 2: return "Ready";
            case 3: return "Tested";
            case 9: return "Finished";
            default: return "";
        }
    }
})

.filter('JobStatusStyle', function() {
    return function(status) {
        switch(status) {
            case 0: return "label-default";
            case 1: return "label-warning";
            case 2: return "label-success";
            case 3: return "label-info";
            case 9: return "label-primary";
            default: return "";
        }
    }
})
