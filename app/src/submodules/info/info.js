angular.module("app.infoModule", ['ngMessages', 'app.datacenter', 'app.directives'])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state("info", {
            url: "/info",
            views: {
                "": {
                    templateUrl: "/template/index.html"
                },
                "general@info": {
                    templateUrl: "/template/submodules/info/index.html",
                    controller: "InfoController"
                }
            },
            resolve: {
                isLogged: 'RelogService'
            },
            access_control: 0
        })
        .state("info.companyAdd", {
            url: "/add",
            views: {
                "content": {
                    templateUrl: "/template/submodules/info/company/add.html",
                    controller: "AddCompanyController"
                }
            }
        })
        .state("info.company", {
            url: "/:companyId",
            views: {
                "content": {
                    templateUrl: "/template/submodules/info/company/info.html",
                    controller: "CompanyController"        
                }
            },
            resolve: {
                CurrentCompany: ['$stateParams', 'CompanyFactory', function($stateParams, CompanyFactory) {
                    var cid = $stateParams.companyId;
                    return CompanyFactory.get(cid);
                }]
            }
        })
        .state("info.company.edit", {
            url: "/edit",
            views: {
                "content@info": {
                    templateUrl: "/template/submodules/info/company/edit.html",
                    controller: "EditCompanyController"
                }
            }
        })
        .state("info.company.project", {
            url: "/:pid",
            views: {
                "content@info": {
                    templateUrl: "/template/submodules/info/project/info.html",
                    controller: "ProjectController",
                }
            },                
            resolve: {
                // CurrentProject: []
            }
        });
}])

.controller('InfoController', ['$scope', 'Alert', 'CompanyFactory',
    function($scope, Alert, CompanyFactory) {
        // console.log('InfoController called.');
        $scope.filter = CompanyFactory.filter;
        
        $scope.$watch('filter.text', function(newVal, oldVal) {
            if(oldVal != newVal) {
                CompanyFactory.filter.text = newVal;
                updateTree();
            }
        });

        updateTree();
        
        function updateTree() {
            CompanyFactory.refresh()
                .then(function(companies){
                    $scope.sortedCompanies = companies;
                })
                .catch(function() {
                    Alert.add("Error occurred while getting companies.", "danger");
                });
        }
    }
]);
