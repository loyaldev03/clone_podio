/* Setup Property page controller */
angular.module('MetronicApp').controller('PropertyController', [
	'$rootScope', 
	'$scope', 
	'settings', 
	'$uibModal', 
	'$log', 
	's_property',
	'$stateParams',
	'$state',
  'FileUploader',
	function($rootScope, $scope, settings, $uibModal, $log, s_property, $stateParams, $state, FileUploader) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
   
   	$scope.newProperty = function() {
   		$state.go('properties_new', {workspace_id: $stateParams.workspace_id});
   	}
   	//Fields for property
    $scope.fields = s_property.fields;

    $scope.property = {};
    $scope.createProperty = function() {
      s_property.create($scope.property, $stateParams.workspace_id).then(function(res){
        $state.go('properties_index', {workspace_id: $stateParams.workspace_id});
      });
    }

    //All Properties for workspace
    $scope.properties = s_property.properties;
    $scope.property = s_property.current_property;
    $scope.updateProperty = function() {
    	$state.go('properties_show', {workspace_id: $stateParams.workspace_id, property_id: $stateParams.property_id});
    }

    $scope.addproperty = function() {
      s_property.initializeCurrentProperty();        
    	$state.go('properties_new', {workspace_id: $stateParams.workspace_id});
    }

    //edit, remove property
    $scope.remove = function(property_id) {
      s_property.remove(property_id, $stateParams.workspace_id).then(function(res){
        s_property.getProperties($stateParams.workspace_id).then(function(properties){
          $scope.properties = s_property.properties;
          $state.go('properties_index', {workspace_id: $stateParams.workspace_id});
        });        
      });
    }

    $scope.update = function() {
      s_property.update($scope.property).then(function(res){
        $state.go('properties_index', {workspace_id: $stateParams.workspace_id});
      });
    }

    $scope.edit = function(property_id) {
      $state.go('properties_edit', {workspace_id: $stateParams.workspace_id, property_id: property_id});
    }    

    $scope.property.files = [];
    $scope.remove_file = function(item) {
      delete $scope.property.files[item.file.name];
    }
    //==================Date Picker Controller===========================
    $scope.today = function()
    {
        $scope.dt = new Date();
    };
    $scope.today();
    $scope.clear = function()
    {
        $scope.dt = null;
    };
    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };
    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data)
    {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }
    $scope.toggleMin = function()
    {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };
    $scope.toggleMin();
    $scope.open1 = function()
    {
        $scope.popup1.opened = true;
    };
    $scope.open2 = function()
    {
        $scope.popup2.opened = true;
    };
    $scope.setDate = function(year, month, day)
    {
        $scope.dt = new Date(year, month, day);
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];
    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
    {
        date: tomorrow,
        status: 'full'
    },
    {
        date: afterTomorrow,
        status: 'partially'
    }];

    function getDayClass(data)
    {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day')
        {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
            for (var i = 0; i < $scope.events.length; i++)
            {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
                if (dayToCheck === currentDay)
                {
                    return $scope.events[i].status;
                }
            }
        }
        return '';
    }
    //==================Date Picker Controller===========================



    //==================File Uploader=====================================
    var uploader = $scope.uploader = new FileUploader(
    {
        url: '/api/v1/property/file_upload_for_property'
    });
    // FILTERS
    uploader.filters.push(
    {
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options)
        {
            return this.queue.length < 10;
        }
    });
    // CALLBACKS
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options)
    {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem)
    {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems)
    {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item)
    {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress)
    {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress)
    {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers)
    {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers)
    {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers)
    {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers)
    {
        $scope.property.files[fileItem.file.name] = response.key
    };
    uploader.onCompleteAll = function()
    {
        console.info('onCompleteAll');
    };
    console.info('uploader', uploader);    
    //==================File Uploader=====================================
    //data list for select box
    $scope.states = [
    {
        name: "Alabama",
        abbreviation: "AL"
    },
    {
        name: "Alaska",
        abbreviation: "AK"
    },
    {
        name: "American Samoa",
        abbreviation: "AS"
    },
    {
        name: "Arizona",
        abbreviation: "AZ"
    },
    {
        name: "Arkansas",
        abbreviation: "AR"
    },
    {
        name: "California",
        abbreviation: "CA"
    },
    {
        name: "Colorado",
        abbreviation: "CO"
    },
    {
        name: "Connecticut",
        abbreviation: "CT"
    },
    {
        name: "Delaware",
        abbreviation: "DE"
    },
    {
        name: "District Of Columbia",
        abbreviation: "DC"
    },
    {
        name: "Federated States Of Micronesia",
        abbreviation: "FM"
    },
    {
        name: "Florida",
        abbreviation: "FL"
    },
    {
        name: "Georgia",
        abbreviation: "GA"
    },
    {
        name: "Guam",
        abbreviation: "GU"
    },
    {
        name: "Hawaii",
        abbreviation: "HI"
    },
    {
        name: "Idaho",
        abbreviation: "ID"
    },
    {
        name: "Illinois",
        abbreviation: "IL"
    },
    {
        name: "Indiana",
        abbreviation: "IN"
    },
    {
        name: "Iowa",
        abbreviation: "IA"
    },
    {
        name: "Kansas",
        abbreviation: "KS"
    },
    {
        name: "Kentucky",
        abbreviation: "KY"
    },
    {
        name: "Louisiana",
        abbreviation: "LA"
    },
    {
        name: "Maine",
        abbreviation: "ME"
    },
    {
        name: "Marshall Islands",
        abbreviation: "MH"
    },
    {
        name: "Maryland",
        abbreviation: "MD"
    },
    {
        name: "Massachusetts",
        abbreviation: "MA"
    },
    {
        name: "Michigan",
        abbreviation: "MI"
    },
    {
        name: "Minnesota",
        abbreviation: "MN"
    },
    {
        name: "Mississippi",
        abbreviation: "MS"
    },
    {
        name: "Missouri",
        abbreviation: "MO"
    },
    {
        name: "Montana",
        abbreviation: "MT"
    },
    {
        name: "Nebraska",
        abbreviation: "NE"
    },
    {
        name: "Nevada",
        abbreviation: "NV"
    },
    {
        name: "New Hampshire",
        abbreviation: "NH"
    },
    {
        name: "New Jersey",
        abbreviation: "NJ"
    },
    {
        name: "New Mexico",
        abbreviation: "NM"
    },
    {
        name: "New York",
        abbreviation: "NY"
    },
    {
        name: "North Carolina",
        abbreviation: "NC"
    },
    {
        name: "North Dakota",
        abbreviation: "ND"
    },
    {
        name: "Northern Mariana Islands",
        abbreviation: "MP"
    },
    {
        name: "Ohio",
        abbreviation: "OH"
    },
    {
        name: "Oklahoma",
        abbreviation: "OK"
    },
    {
        name: "Oregon",
        abbreviation: "OR"
    },
    {
        name: "Palau",
        abbreviation: "PW"
    },
    {
        name: "Pennsylvania",
        abbreviation: "PA"
    },
    {
        name: "Puerto Rico",
        abbreviation: "PR"
    },
    {
        name: "Rhode Island",
        abbreviation: "RI"
    },
    {
        name: "South Carolina",
        abbreviation: "SC"
    },
    {
        name: "South Dakota",
        abbreviation: "SD"
    },
    {
        name: "Tennessee",
        abbreviation: "TN"
    },
    {
        name: "Texas",
        abbreviation: "TX"
    },
    {
        name: "Utah",
        abbreviation: "UT"
    },
    {
        name: "Vermont",
        abbreviation: "VT"
    },
    {
        name: "Virgin Islands",
        abbreviation: "VI"
    },
    {
        name: "Virginia",
        abbreviation: "VA"
    },
    {
        name: "Washington",
        abbreviation: "WA"
    },
    {
        name: "West Virginia",
        abbreviation: "WV"
    },
    {
        name: "Wisconsin",
        abbreviation: "WI"
    },
    {
        name: "Wyoming",
        abbreviation: "WY"
    }    
    ];    
    $scope.countries = [
    {
        name: "Alabama",
        abbreviation: "AL"
    },
    {
        name: "Alaska",
        abbreviation: "AK"
    },
    {
        name: "American Samoa",
        abbreviation: "AS"
    },
    {
        name: "Arizona",
        abbreviation: "AZ"
    },
    {
        name: "Arkansas",
        abbreviation: "AR"
    },
    {
        name: "California",
        abbreviation: "CA"
    },
    {
        name: "Colorado",
        abbreviation: "CO"
    },
    {
        name: "Connecticut",
        abbreviation: "CT"
    },
    {
        name: "Delaware",
        abbreviation: "DE"
    },
    {
        name: "District Of Columbia",
        abbreviation: "DC"
    },
    {
        name: "Federated States Of Micronesia",
        abbreviation: "FM"
    },
    {
        name: "Florida",
        abbreviation: "FL"
    },
    {
        name: "Georgia",
        abbreviation: "GA"
    },
    {
        name: "Guam",
        abbreviation: "GU"
    },
    {
        name: "Hawaii",
        abbreviation: "HI"
    },
    {
        name: "Idaho",
        abbreviation: "ID"
    },
    {
        name: "Illinois",
        abbreviation: "IL"
    },
    {
        name: "Indiana",
        abbreviation: "IN"
    },
    {
        name: "Iowa",
        abbreviation: "IA"
    },
    {
        name: "Kansas",
        abbreviation: "KS"
    },
    {
        name: "Kentucky",
        abbreviation: "KY"
    },
    {
        name: "Louisiana",
        abbreviation: "LA"
    },
    {
        name: "Maine",
        abbreviation: "ME"
    },
    {
        name: "Marshall Islands",
        abbreviation: "MH"
    },
    {
        name: "Maryland",
        abbreviation: "MD"
    },
    {
        name: "Massachusetts",
        abbreviation: "MA"
    },
    {
        name: "Michigan",
        abbreviation: "MI"
    },
    {
        name: "Minnesota",
        abbreviation: "MN"
    },
    {
        name: "Mississippi",
        abbreviation: "MS"
    },
    {
        name: "Missouri",
        abbreviation: "MO"
    },
    {
        name: "Montana",
        abbreviation: "MT"
    },
    {
        name: "Nebraska",
        abbreviation: "NE"
    },
    {
        name: "Nevada",
        abbreviation: "NV"
    },
    {
        name: "New Hampshire",
        abbreviation: "NH"
    },
    {
        name: "New Jersey",
        abbreviation: "NJ"
    },
    {
        name: "New Mexico",
        abbreviation: "NM"
    },
    {
        name: "New York",
        abbreviation: "NY"
    },
    {
        name: "North Carolina",
        abbreviation: "NC"
    },
    {
        name: "North Dakota",
        abbreviation: "ND"
    },
    {
        name: "Northern Mariana Islands",
        abbreviation: "MP"
    },
    {
        name: "Ohio",
        abbreviation: "OH"
    },
    {
        name: "Oklahoma",
        abbreviation: "OK"
    },
    {
        name: "Oregon",
        abbreviation: "OR"
    },
    {
        name: "Palau",
        abbreviation: "PW"
    },
    {
        name: "Pennsylvania",
        abbreviation: "PA"
    },
    {
        name: "Puerto Rico",
        abbreviation: "PR"
    },
    {
        name: "Rhode Island",
        abbreviation: "RI"
    },
    {
        name: "South Carolina",
        abbreviation: "SC"
    },
    {
        name: "South Dakota",
        abbreviation: "SD"
    },
    {
        name: "Tennessee",
        abbreviation: "TN"
    },
    {
        name: "Texas",
        abbreviation: "TX"
    },
    {
        name: "Utah",
        abbreviation: "UT"
    },
    {
        name: "Vermont",
        abbreviation: "VT"
    },
    {
        name: "Virgin Islands",
        abbreviation: "VI"
    },
    {
        name: "Virginia",
        abbreviation: "VA"
    },
    {
        name: "Washington",
        abbreviation: "WA"
    },
    {
        name: "West Virginia",
        abbreviation: "WV"
    },
    {
        name: "Wisconsin",
        abbreviation: "WI"
    },
    {
        name: "Wyoming",
        abbreviation: "WY"
    }    
    ];    

    $scope.lead_sources = ["Bandit Signs", "Website", "Direct Mail", "Newspaper", "Craigslist", "Realtor", "Wholesaler", "Referral", "Flyer"];


}]);
