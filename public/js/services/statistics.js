angular.module('MetronicApp')
.factory('statistics', [
  '$http',
  function($http){
    var o = {
      statistics: {}
    };

    o.get_statistics = function() {
      console.log("---------------inside get statics ---------------");
      return $http.get('/api/v1/statistics')
        .then(function(res) {
          angular.copy(res.data, o.statistics);
        });
    };
    return o;
  }
])