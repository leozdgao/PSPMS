angular.module('app.directives')

.factory("DatepickerOption", function(){
    return function(){
        this.opened = false;
        this.open = function($event){
            $event.preventDefault();
            $event.stopPropagation();

            this.opened = true;
        };
        this.dateOptions = {
            formatYear: 'yy',
            startingDay: 0,
            "show-weeks": false
        };
    }
});