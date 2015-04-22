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
  $scope.getLinks();
});
