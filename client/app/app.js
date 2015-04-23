angular.module('shortly', [
  'shortly.services',
  'shortly.links',
  'shortly.shorten',
  'shortly.auth',
  'ngRoute',
  'ngAnimate'
])
.config(function($routeProvider, $httpProvider, $locationProvider) {
  $routeProvider
    // .when('/', {
    //   templateUrl: '/index.html',
    //   controller: 'AuthController'
    // })
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/links', {
      templateUrl: 'app/links/links.html',
      controller: 'LinksController'
    })
    .when('/shorten', {
      templateUrl: 'app/shorten/shorten.html',
      controller: 'ShortenController'
    })
    .otherwise({
      redirectTo: 'app/links/links.html'
    });
    // Your code here

    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');
    //$locationProvider.html5mode(true);
})
.directive('ngShortlink', function() {
  return {
    restrict: 'EA',
    require: '^ngModel',
    template: '<div class="link panel panel-default"> \
    <li><a href="/api/links/{{ link.code }}"> \
    <p>{{ link.title }}</p></a><p>{{ link.url }}</p> \
    <p>{{ link.visits }} visits</li> \
    </div>'
  }
})
// .animation('.view-slide-in', function () {
//   return {
//     enter: function(element, done) {
//       element.css({
//         opacity: 0.5,
//         position: "relative",
//         top: "10px",
//         left: "20px"
//       })
//       .animate({
//         top: 0,
//         left: 0,
//         opacity: 1
//         }, 1000, done);
//     }
//   };
// })
.animation('.repeat-animation', function () {
  return {
    enter : function(element, done) {
      console.log("entering...");
      var width = element.width();
      element.css({
        position: 'relative',
        left: -10,
        opacity: 0
      });
      element.animate({
        left: 0,
        opacity: 1
      }, done);
    },
    leave : function(element, done) {
      element.css({
        position: 'relative',
        left: 0,
        opacity: 1
      });
      element.animate({
        left: -10,
        opacity: 0
      }, done);
    },
    move : function(element, done) {
      element.css({
        left: "2px",
        up: "2px",
        opacity: 0.5
      });
      element.animate({
        left: "0px",
        opacity: 1
      }, done);
    }
  };
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
