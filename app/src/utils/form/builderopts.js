angular.module('app.utils')

/* Form builder options
*  - name: name of the form
*  - formClass: class of the form
*  - keys: fields showed in the form
*      - label: label text of the field
*      - attrs: extra attributes for the field
*      - validate: validate logic for the field
*  - buttonGroup: definition of the buttons
*      - text: text of the button
*      - className: class of the button
*      - click: click event handler, if it is the submit button, it should return a promise.
*/

.factory('CompanyFormOptions', [function(){
    return function() {
        return {
            formClass: "form-horizontal",
            keys: {
                name: {
                    label: "Company Name",
                    attrs: {
                        "ng-required": true
                    },
                    validate: {
                        required: "Company Name is requied."
                    }
                },
                clientId: {
                    label: "ClientID",
                    attrs: {
                        "ng-required": true,
                        "tooltip-trigger": "focus",
                        "tooltip-placement": "right",
                        tooltip: '"Recommend that clientID starts with \'30\' and its length better be 10."'
                    },
                    validate: {
                        required: "ClientID is requied."
                    }
                },
                serverFolder: {
                    label: "Server Folder",
                    attrs: {
                        "tooltip-trigger": "focus",
                        "tooltip-placement": "right",
                        tooltip: '"Folder name on server 208."'
                    }
                }, 
                perforceFolder: {
                    label: "Perforce Folder",
                    attrs: {
                        "tooltip-trigger": "focus",
                        "tooltip-placement": "right",
                        tooltip: '"Folder name on P4v."'
                    }
                } 
            },
            buttonGroup: [
                // exist by default
                {
                    isSubmit: true,
                    text: "Submit",
                    className: "btn btn-primary btn-sm",
                    click: function() {}
                },{
                    text: "Cancel",
                    className: "btn btn-default btn-sm",
                    click: function() {}
                }
                // maybe some extra buttons
            ]
        }
    }
}])

.factory('ProjectFormOptions', [function(){
    return function (){
        return {
            formClass: "form-horizontal",
            keys: {
                isProduct: {
                    label: "Product",
                    type: "checkbox"
                },
                name: {
                    label: "Name",
                    attrs: {
                        "ng-required": true
                    },
                    validate: {
                        required: "Project name is required."
                    }
                },
                products: {
                    bind: false,
                    lable: "Products",
                    type: "dropdownlist"
                },
                assemblyName: {
                    label: "Assembly Name",
                    attrs: {
                        "ng-required": true
                    },
                    validate: {
                        required: "Assembly name is required."
                    }
                },
                startDate: {
                    label: "Start Date",
                    type: "date",
                    defaultVal: Date.now(),
                    attrs: {
                        "ng-required": true
                    },
                    validate: {
                        required: "Start date is required."
                    }
                },
                lastUpdateDate: {
                    label: "Last Update Date",
                    type: "date",
                    defaultVal: Date.now(),
                    attrs: {
                        "ng-required": true
                    },
                    validate: {
                        required: "Last update date is required."
                    }
                },
                sourceCode: {
                    label: "SourceCode"
                },
                serverFolder: {
                    label: "Server Folder",
                    attrs: {
                        "tooltip-trigger": "focus",
                        "tooltip-placement": "right",
                        tooltip: '"Folder name on server 208."'
                    }
                }, 
                perforceFolder: {
                    label: "Perforce Folder",
                    attrs: {
                        "tooltip-trigger": "focus",
                        "tooltip-placement": "right",
                        tooltip: '"Folder name on P4v."'
                    }
                } 
            },
            buttonGroup: [
                {
                    isSubmit: true,
                    text: "Submit",
                    className: "btn btn-primary btn-sm",
                    click: function() {}
                },{
                    text: "Cancel",
                    className: "btn btn-default btn-sm",
                    click: function() {}
                }
            ]
        }
    };
}])