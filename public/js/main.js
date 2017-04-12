/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    "satellizer",
    "angularFileUpload"
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: 'assets',
        globalPath: 'assets/global',
        layoutPath: 'assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', [
    '$scope', 
    '$rootScope', 
    's_auth', 
    '$timeout',
    function($scope, $rootScope, s_auth, $timeout) {
        $scope.$on('$viewContentLoaded', function() {
            //App.initComponents(); // init core components
            // Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
        });
        $scope.isLoggedIn = function() {
            return s_auth.isLoggedIn();
        };
        $scope.isActivated = function(){
            return s_auth.isActivated();
        }
        $scope.isOrganized = function(){
            return s_auth.isOrganized();
        }
        $rootScope.isLoading = true;
        var countUp = function() {
            $rootScope.isLoading = false;
        }
        $timeout(countUp, 1000);
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', [
    '$scope', 
    's_auth', 
    '$location', 
    '$rootScope',
    '$state',
    's_property',
    function($scope, s_auth, $location, $rootScope, $state, s_property) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
    $scope.logOut = function() {
        s_auth.logOut();
        $location.path('/login');
    }

    $scope.$watch(function(){
        return $location.path();
    }, function(value){
        console.log("---------------------url change---------------------", value.match("workspace/(.*)/"));
    });

    $scope.fields = s_property.fields;

}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', [
    '$state', 
    '$scope', 
    's_workspace', 
    '$rootScope', 
    'settings', 
    '$uibModal', 
    function($state, $scope, s_workspace, $rootScope, settings, $uibModal) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar($state); // init sidebar
    });
    $scope.all_workspaces = function() {
        return s_workspace.getAllWorkspaces();
    }
    // Modal Dialog for creating workspace
    $scope.animationsEnabled = true;
    $scope.open = function(opt_attributes)
    {
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/workspaces/new.html",
            controller: "CreateWorkspaceModalController",
            size: opt_attributes,
            resolve: {
            }
        });
        out.result.then(function(value)
        {
            $scope.selected = value;
        }, function()
        {
            console.log("Modal dismissed at: " + new Date);
        });
    };
    $scope.toggleAnimation = function()
    {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
    $scope.goto = function(workspace) {
      $state.go('workspaces_show', {id: workspace._id});
    }    

    $scope.manageWorkspace = function() {
        $state.go('workspaces');
    }
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Social Login */
MetronicApp.constant('config_env_variable', {
    facebook_app_id: '610661099137289',
});
MetronicApp.config(function($authProvider) {
    // Optional: For client-side use (Implicit Grant), set responseType to 'token' (default: 'code')
    $authProvider.facebook({
      clientId: '610661099137289',
      url: '/auth/facebook',
      scope: ['manage_pages', 'publish_actions'],
    });

});
/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider, $window) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/login");  

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/authenticate/login.html',
            controller: 'AuthController',
            onEnter: ['$state', 's_auth', '$location', function($state, s_auth, $location){
                if(s_auth.isLoggedIn()){
                  $location.path('/dashboard')
                }
            }],
            resolve: {
            }
        })
        .state('register', {
            url: '/register',
            templateUrl: 'views/authenticate/register.html',
            controller: 'AuthController',
            onEnter: ['$state', 's_auth', '$location', function($state, s_auth, $location){
                if(s_auth.isLoggedIn()){
                  $location.path('/dashboard')
                }
            }],
            resolve: {
            }          
        })
        .state('activate', {
            url: "/activate/:email/:token",
            controller: "AuthController",
            onEnter: ['$stateParams', 's_auth', '$state', function($stateParams, s_auth, $state) {
                s_auth.activate($stateParams.email, $stateParams.token).then(function(res) {
                    $state.go('organization');
                })
            }]
        })
        .state('resetpassword', {
            url: "/resetpassword/:email/:token",
            templateUrl: 'views/authenticate/reset_password.html',
            controller: "AuthController"
        })
        .state('register_with_social', {
            url: '/register_with_social/:email',
            // templateUrl: "views/authenticate/register_with_social.html",
            controller: "AuthController",
            onEnter: ['$stateParams', 's_auth', '$state', function($stateParams, s_auth, $state){
                s_auth.setEmail($stateParams.email);
                $state.go('register');
            }]
        })
        .state('register_with_twitter', {
            url: '/register_with_twitter/:twitter_id',
            controller: "AuthController",
            onEnter: ['$stateParams', 's_auth', '$state', function($stateParams, s_auth, $state){
                s_auth.setTwitterID($stateParams.twitter_id);
                $state.go('register');
            }]
        })
        .state('login_with_social', {
            url: '/login_with_social/:token',
            controller: "AuthController",
            onEnter: ['$stateParams', 's_auth', '$state', function($stateParams, s_auth, $state){
                s_auth.setToken($stateParams.token);
                $state.go('verify_account');
            }]
        })
        .state('verify_account', {
            url: "/verifyaccount",
            templateUrl: "views/authenticate/verify_account.html",
            controller: "AuthController",
            onEnter: ['s_auth', '$state', function(s_auth, $state){
                if (s_auth.isActivated()) {
                    $state.go('dashboard');
                }
            }]
        })
        .state('verify', {
            url: "/verify",
            templateUrl: "views/authenticate/verify.html",
            controller: "AuthController",
            onEnter: [ function(){
                var a = 1;
                a=2;
            }]
        })
        .state('send_activation_email', {
            url: '/sendactivationemail/:username',
            templateUrl: "views/authenticate/verify.html",
            controller: "AuthController",
            onEnter: ['$stateParams', 's_auth', function($stateParams, s_auth){
                s_auth.sendConfirmationEmail($stateParams.username);
            }]
        })
        .state('forgot_password', {
            url: '/forgot_password',
            templateUrl: 'views/authenticate/forgot_password.html',
            controller: 'AuthController'
        })
        .state('organization', {
            url: '/organization',
            templateUrl: "views/authenticate/organization.html",
            controller: "AuthController",
            onEnter: ['s_auth', '$state', function(s_auth, $state) {
                // if (!s_auth.isLoggedIn() && !s_auth.isActivate()) {
                //     $state.go('login');
                // }
            }]
        })
        // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'assets/global/plugins/highcharts/js/highcharts-more.js',
                            'assets/global/plugins/highcharts/js/modules/solid-gauge.js',

                            'assets/global/plugins/morris/morris.css',                            
                            'assets/global/plugins/morris/morris.min.js',
                            'assets/global/plugins/morris/raphael-min.js',                            
                            'assets/global/plugins/jquery.sparkline.min.js',
                            'js/scripts/dashboard.js',
                            'js/controllers/AuthController.js',                            
                        ] 
                    });
                }],
                load_statistics: ['statistics', function(statistics){
                    return statistics.get_statistics();
                }]
            }
        })

        .state('workspaces_show', {
            url: "/workspace/:id",
            templateUrl: "views/workspaces/show.html",            
            data: {pageTitle: 'Workspace'},
            controller: "WorkspaceController",
            resolve: {
                current_workspace: ['s_workspace', '$stateParams', function(s_workspace, $stateParams) {
                    return s_workspace.setCurrentWorkspace($stateParams.id);
                }]
            }
        })
        .state('workspaces', {
            url: "/workspaces",
            templateUrl: "views/workspaces/index.html",
            data: {},
            controller: "WorkspaceController",
            resolve: {
                getAllWorkspaces: ['s_workspace', function(s_workspace){
                    return s_workspace.initializeAllWorkspaces();
                }]
            }   
        })
        .state('appps_new', {
            url: "/workspace/:workspace_id/apps/new",
            templateUrl: "views/appps/new.html",            
            data: {pageTitle: 'App'},
            controller: "ApppController",
            resolve: {
            }
        })
        .state('appps_edit', {
            url: "/workspace/:workspace_id/apps/:appp_id/edit",
            templateUrl: "views/appps/edit.html",            
            data: {pageTitle: 'App Edit'},
            controller: "ApppController",
            resolve: {
            }
        })
        .state('appps_show', {
            url: "/workspace/:workspace_id/apps/:appp_id",
            templateUrl: "views/appps/show.html",            
            data: {pageTitle: 'App Edit'},
            controller: "ApppController",
            resolve: {
                set_current_appp: ['$stateParams', 's_appp', function($stateParams, s_appp) {
                    return s_appp.setCurrentAppp($stateParams.appp_id);
                }]
            }
        })

        .state('items_new', {
            url: "/workspace/:workspace_id/apps/:appp_id/items/new",
            templateUrl: "views/items/new.html",            
            data: {pageTitle: 'New Item'},
            controller: "ItemController",
            resolve: {
                initializeFieldsForItem: ['$stateParams', 's_item', function($stateParams, s_item){
                    return s_item.getFields($stateParams.appp_id);
                }]
            }
        })
        .state('items_show', {
            url: "/workspace/:workspace_id/apps/:appp_id/items/:item_id",
            templateUrl: "views/items/show.html",            
            data: {pageTitle: 'New Item'},
            controller: "ItemController",
            resolve: {
            }
        })

        .state('properties_show', {
            url: "/workspace/:workspace_id/property/:property_id",
            templateUrl: "views/properties/show.html",
            data: {pageTitle: 'Property Detail'},
            controller: "PropertyController",
            resolve: {
                
            }
        })
        .state('properties_new', {
            url: "/workspace/:workspace_id/properties/new",
            templateUrl: "views/properties/new.html",
            data: {pageTitle: 'New Property'},
            controller: "PropertyController",            
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',

                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',                            

                            'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ] 
                    }]);
                }] 
            }
        })
        .state('properties_index', {
            url: "/workspace/:workspace_id/properties",
            templateUrl: "views/properties/index.html",
            data: {},
            controller: "PropertyController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [                             
                            'assets/global/plugins/datatables/datatables.min.css', 
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            'assets/global/plugins/datatables/datatables.all.min.js',

                            'assets/pages/scripts/table-datatables-managed.min.js',

                        ]
                    });
                }],
                getProperties:['s_property', '$stateParams', function(s_property, $stateParams){
                    return s_property.getProperties($stateParams.workspace_id);
                }]               
            }
        })

        .state('properties_edit', {
            url: "/workspace/:workspace_id/properties/:property_id/edit",
            templateUrl: "views/properties/edit.html",
            data: {pageTitle: 'Property Update'},
            controller: "PropertyController",
            resolve: {
                getProperty: ['$stateParams', 's_property', function($stateParams, s_property){
                    return s_property.getProperty($stateParams.property_id);
                }]
            }
        })

        .state('landing_page', {
            url: "/landing_page.html",
            templateUrl: "views/landing_page.html",
            data: {pageTitle: 'Landing Page'},
            controller: "LandingPageController",
            resolve: {
            }
        })
        // Blank Page
        .state('blank', {
            url: "/blank",
            templateUrl: "views/blank.html",            
            data: {pageTitle: 'Blank Page Template'},
            controller: "BlankController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/BlankController.js'
                        ] 
                    });
                }]
            }
        })

        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/UISelectController.js'
                        ] 
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            'assets/global/plugins/jstree/dist/jstree.min.js',
                            'assets/pages/scripts/ui-tree.min.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })     

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            'assets/global/plugins/typeahead/typeahead.css',

                            'assets/global/plugins/fuelux/js/spinner.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            'assets/global/plugins/typeahead/handlebars.min.js',
                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            'assets/pages/scripts/components-form-tools-2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })        

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/clockface/css/clockface.css',
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            'assets/global/plugins/clockface/js/clockface.js',
                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            'assets/pages/scripts/components-date-time-pickers.min.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        }) 

        // Advanced Datatables
        .state('datatablesmanaged', {
            url: "/datatables/managed.html",
            templateUrl: "views/datatables/managed.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [                             
                            'assets/global/plugins/datatables/datatables.min.css', 
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            'assets/global/plugins/datatables/datatables.all.min.js',

                            'assets/pages/scripts/table-datatables-managed.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesajax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/datatables/datatables.min.css', 
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            'assets/global/plugins/datatables/datatables.all.min.js',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            'assets/global/scripts/datatable.js',

                            'js/scripts/table-ajax.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            'assets/pages/css/profile.css',
                            
                            'assets/global/plugins/jquery.sparkline.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            'assets/pages/scripts/profile.min.js',

                            'js/controllers/UserProfileController.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}      
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            'assets/apps/css/todo-2.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            'assets/global/plugins/select2/js/select2.full.min.js',
                            
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            'assets/apps/scripts/todo-2.min.js',

                            'js/controllers/TodoController.js'  
                        ]                    
                    });
                }]
            }
        })

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);
