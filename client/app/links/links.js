angular.module('shortly.links', [])

.controller('LinksController', function ($scope, $http, Links) {
  $scope.data = {};
  $scope.getLinks = function() {
    $http.get('/api/links')
      .success(function(data) {
        $scope.data['links'] = data;
        console.log($scope.data);
      });
  };
  $scope.incVisits= function(i) {
    $http.get('/'+$scope.data.links[i].code,{navLink: $scope.data.links[i]});
  }
  $scope.getLinks();
});
