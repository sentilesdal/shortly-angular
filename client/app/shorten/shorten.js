angular.module('shortly.shorten', [])

.controller('ShortenController', function ($scope, $http, $location, Links) {
  $scope.link = {};
  $scope.addLink = function(link){
    $scope.newLink = '';
    $http.post('/api/links', {'url':link}).
      success(function(data){
        console.log('posted.');
      }).
      error(function(data){
        console.log('done messed up.');
      });
  }
});
