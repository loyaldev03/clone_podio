angular.module('MetronicApp')
.factory('statistics', [
  '$http',
  's_auth',
  function($http, s_auth){
    var o = {
      statistics: {}
    };

    o.get_statistics = function() {
      return $http.get('/api/v1/statistics',{
        headers: {Authorization: 'Bearer '+s_auth.getToken()}
      })
        .then(function(res) {
          angular.copy(res.data, o.statistics);
        });
    };
    return o;
  }
])