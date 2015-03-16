angular.module('app.directives')

.directive('cusform', ['$compile', function($compile){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        scope: {
            obj: "=",
            opts: "="
        }, // {} = isolate, true = child, false/undefined = no change
        controller: 'CusformController',
        require: 'form', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<form name="cusform" novalidate></form>',
        // templateUrl: '/template/directives/form/cusform.html',
        replace: true,
        // transclude: true,
        /*compile: function(tElement, tAttrs){
            // return function linking(scope, elm, attrs){ console.log('message'); }
            return {
                pre: function() { console.log('pre'); },
                post: function() { console.log('post'); } // just like link function
            }
        },*/
        link: function($scope, ele, attrs) {
            
            console.log('link');
            
            // create form controls according the opts
            var formEle = ele, options = angular.extend({}, $scope.opts), controlSettings = options.keys || {}, style;

            // add class for the form if necessary
            if(options.formClass) {
                formEle.addClass(options.formClass);
            }

            if(formEle.hasClass('form-horizontal')) style = 'horizontal';

            // append form group
            for(var key in controlSettings) {
                var settings = controlSettings[key];
                if(typeof settings === 'string') settings = { label: settings };
                settings.label = settings.label || key;
                settings.type = settings.type || 'text';

                var control = angular.element(
                    '<div class="form-group" ng-class="{' + '\'has-error\': formstate.isInvalid(\'' + key + '\') }">' +
                    '</div>');
                control.append(getLabel(key, settings.label));
                control.append(getInputString(key, settings.type, settings.attrs));
                control.append(getHelpblock(key, settings.validate));

                formEle.append(control);
            }

            // manually compile the template
            var fn = $compile(formEle);
            fn($scope);

            // return label
            function getLabel(name, text) {
                var label = angular.element('<label class="control-label" for="'+ name +'">' + text + '</label>');
                if(style === 'horizontal') label.addClass('col-md-2');
                return label;
            }
            // return input according type
            function getInputString(name, type, attrs) {
                var text = '<div><input class="form-control"' +
                ' name="' + name + '"' + ' ng-model="eObj.' + name + '"';

                // TODO: other type

                for(var val in attrs) {
                    text += (' ' + val + '=' + attrs[val]);
                }
                text += ('></div>');

                var input = angular.element(text); 
                if(style === 'horizontal') input.addClass('col-md-10');
                
                return input;
            }
            // return help-block related to ng-messages
            function getHelpblock(name, validates) {

                /*<div class="col-md-offset-2 col-md-10" ng-messages="editCompanyForm.serverFolder.$error">
                    <span class="help-block" ng-message="required">Server folder is required.</span>
                </div>*/
                var helpblock = angular.element('<div ng-messages="cusform.'+ name + '.$error"></div>');
                if(style === 'horizontal') helpblock.addClass('col-md-offset-2 col-md-10');

                if(validates) {
                    for(var key in validates) {
                        // <span class="help-block" ng-message="required">Server folder is required.</span>
                        var text = validates[key];
                        helpblock.append('<span class="help-block" ng-message="' + key + '"">' + text + '</span>');
                    }    
                }

                return helpblock;
            }
        }
    };
}])

.controller('CusformController', ['$scope', '$element', '$attrs', '$transclude',
    function($scope, $element, $attrs, $transclude){
        console.log('Controller called');
        // var eObj = 
        $scope.eObj = ($scope.obj && angular.copy($scope.obj)) || {};
        $scope.formstate = {
            submitting: false,
            submited: false,
            isInvalid: function(key) {
                return (this.submited || $scope.cusform[key].$dirty) && $scope.cusform[key].$invalid;
            }
        };
    }
]);
