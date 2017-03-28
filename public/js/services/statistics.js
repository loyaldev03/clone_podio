angular.module('MetronicApp')
.factory('statistics', [
  '$http',
  function($http){
    var o = {
      statistics: {}
    };

    o.get_statistics = function() {
      return $http.get('/api/v1/statistics')
        .then(function(res) {
          angular.copy(res.data, o.statistics);
        });
    };
    return o;
  }
])