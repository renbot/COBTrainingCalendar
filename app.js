var itCalApp = angular.module('itCalApp', [
  'ui.calendar',
  'ui.router',
  'angular.filter',
  'ngAnimate',
  'angularModalService',
  'angulartics',
  'angulartics.google.analytics'
]);

itCalApp.run([
  '$rootScope',
  '$state',
  '$stateParams',
  '$timeout',
  function($rootScope, $state, $stateParams, $timeout) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.CONFIG = CONFIG; // config global loaded from config.js

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      document.getElementById('content').scrollIntoView();
    });
  }
]);

itCalApp.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    // default routes
    $urlRouterProvider
    .when('', '/')
    .otherwise('/');

    // state/router setup
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html'
    })
    .state('itpaths', {
      url: '/itpaths/:path',
      templateUrl: 'templates/itpaths.html',
      controller: 'itpathsController',
      params: {
        path: 'Capital Projects',
        type: 'it'
      }
    })
    .state('hrpaths', {
      url: '/hrpaths/:path',
      templateUrl: 'templates/hrpaths.html',
      controller: 'hrpathsController',
      params: {
        path: 'Emerging Leaders',
        type: 'hr'
      }
    })
    .state('calendar', {
      url: '/calendar',
      templateUrl: 'templates/calendar.html',
      controller: 'calendarController'
    })
    .state('catalog', {
      url: '/catalog/:type/:subtype',
      templateUrl: 'templates/catalog.html',
      controller: 'catalogController',
      params: {
        type: 'it',
        subtype: { value: 'all', squash: true }
      }
    });
  }
]);

// ref: http://stackoverflow.com/questions/19415394/with-ng-bind-html-unsafe-removed-how-do-i-inject-html
itCalApp.filter('to_trusted', [
  '$sce',
  function($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    }
  }
]);
itCalApp.filter('toDateObj', [
  function() {
    return function(text) {
      if (!text)
        return text;
      else
        return new Date(text);
    }
  }
]);
itCalApp.filter('parseFloat', [
  function() {
    return function(text) {
      return parseFloat(text)
    }
  }
]);
itCalApp.filter('removeBreaks', [
  function() {
    return function(text) {
      return text.replace(/[\s]{0,1}<br>[\s]{0,1}/g, ' ');
    }
  }
]);

itCalApp.controller('rootController', [
  '$scope',
  '$http',
  function($scope, $http) {
    $('html').click(function(event) {
      $('.calendar-event-popup').removeClass('active');
      $('.fc-view-container').removeClass('active');
    });
    $scope.courses = courseData;
    $scope.hrcourses = courseDataHr;

    // $http({
    //   method: 'get',
    //   url: 'courses.json'
    // }).then(function successCallback(response) {
    //   // remap data to event format
    //   console.log(response.data);
    //   $scope.courses = _.map(response.data, function(item) {
    //     return {
    //       'title': item.subject,
    //       'start': new Date(item.startDate),
    //       'end': new Date(item.endDate)
    //     }
    //   });
    //   $scope.eventSources.push($scope.courses);
    //   console.log($scope.courses);

    // }, function errorCallback(response) {
    //   console.log(response);
    // });

    // determine list of IT learning paths from all courses
    $scope.itLearningPaths = _.chain(courseData)
    .pluck('learningpaths')
    .map(function(paths) { return paths[0]; })
    .uniq()
    .filter(function(path) {
      return !!path && path !== 'all';
    })
    .map(function(path) {
      // manually add forced linebreaks for some long path names
      if (path.indexOf('Public Sector Collections and Disbursement') > -1)
        return { key: path, name: path.replace('Collections and', 'Collections<br />and') };
      else
        return { key: path, name: path };
    })
    .value();
  }
]);

itCalApp.controller('calendarController', [
  '$scope',
  function($scope) {

    $scope.calendarEventHandler = function(event, jsEvent, view) {
      var clickedElem = $(jsEvent.currentTarget);
      var position = clickedElem.offset();
      // console.log(jsEvent);
      // console.log(event);

      if (event.className.indexOf('noclick') === -1 && !$('.calendar-event-popup').hasClass('active')) {
        $('.calendar-event-popup')
        .toggleClass('active')
        .click(function(event) {
          event.stopPropagation();
        });
        $('.fc-view-container')
        .toggleClass('active');
      }

      if (event.className.indexOf('noclick') === -1)
        $scope.event = event;

      // need this to prevent the default html.click from closing itself
      jsEvent.stopPropagation();
    };
    $scope.config = {
      calendar: {
        eventClick: $scope.calendarEventHandler,
        customButtons: {
          staticYear: {
            text: '2016',
            click: function() {}
          }
        },
        header: {
          left: 'staticYear month agendaWeek agendaDay',
          center: 'prev title next',
          right: ''
        },
        timeFormat: 'h:mm A'
      }
    };
    $scope.eventSources = [];

    // courseData loaded from data.js
    var courseDataShown = _.filter(courseData, function filter(item) {
      return !item.onlineOnly && !item.isByRequest;
    });
    $scope.courses = _.map(courseDataShown, function map(item) {
      return {
        'title': item.name,
        'start': new Date(item.startDate),
        'end': new Date(item.endDate),
        'location': item.location,
        'description': item.description,
        'objectives': item.objectives,
        'type': 'it'
      }
    });
    $scope.holidays = _.map(holidayData, function map(item) {
      return {
        'title': item.name,
        'start': new Date(item.startDate),
        'end': new Date(item.endDate),
        'allDay': true,
        // 'color': '#dc6c81',
        'color': '#fff',
        'textColor': '#000',
        'className': 'noclick fc-holidays'
      }
    });
    $scope.paydays = _.map(paydayData, function map(item) {
      return {
        'title': item.name,
        'start': new Date(item.startDate),
        'end': new Date(item.endDate),
        'allDay': true,
        'color': '#64d76a',
        'className': 'noclick'
      }
    });
    $scope.payperiods = _.map(payperiodData, function map(item) {
      return {
        'title': item.name,
        'start': new Date(item.startDate),
        'end': new Date(item.endDate),
        'allDay': true,
        'color': '#64d76a',
        // 'color': '#a27bd3',
        'className': 'noclick'
      }
    });
    $scope.accountingperiods = _.map(accountingperiodData, function map(item) {
      return {
        'title': item.name,
        'start': new Date(item.startDate),
        'end': new Date(item.endDate),
        'allDay': true,
        'color': '#aaa',
        // 'color': '#a27bd3',
        'className': 'noclick'
      }
    });
    // courseDataHr loaded from data2.js
    $scope.hrcourses = _.map(courseDataHr, function map(item) {
      return {
        'title': item.name,
        'start': new Date(item.startDate),
        'end': new Date(item.endDate),
        'location': item.location,
        'description': item.description,
        'objectives': item.objectives,
        'color': '#ff8d7b',
        'type': 'hr',
        'totalInSeries': item.totalInSeries,
        'orderInSeries': item.orderInSeries
      }
    });
    $scope.eventSources.push($scope.courses);
    $scope.eventSources.push($scope.holidays);
    $scope.eventSources.push($scope.paydays);
    $scope.eventSources.push($scope.payperiods);
    $scope.eventSources.push($scope.hrcourses);
    $scope.eventSources.push($scope.accountingperiods);

  }
]);

itCalApp.controller('itpathsController', [
  '$scope',
  '$stateParams',
  'ModalService',
  function($scope, $stateParams, ModalService) {
    var roles = [];
    var memo = [];

    // query all courses for course in the selected path
    var courses = _.chain(courseData)
    .filter(function getCoursesInPath(course) {
      var lpaths = course.learningpaths;

      if (!lpaths.length) return false;

      function introExceptedPath() {
        return CONFIG.introExceptedPaths.indexOf($stateParams.path) > -1;
      }

      function introToCityExceptedPaths(roles) {
        return CONFIG.introToCityExceptedPaths.indexOf($stateParams.path) > -1;
      }

      // exclude intro courses for paths without them
      if (lpaths.indexOf($stateParams.path) > -1 || (!introExceptedPath() && lpaths.indexOf('all') > -1)) {
        // console.log(memo);
        if (memo.indexOf(course.name) > -1)
          return false;

        if (course.name === 'Intro to City Directory' && introToCityExceptedPaths())
          return false;

        memo.push(course.name);
        if ((course.name.toLowerCase() !== 'intro to sap') &&
          (course.name.toLowerCase().trim() !== 'finance overview') &&
          course.name.toLowerCase().indexOf('running operating') === -1 &&
          course.name.toLowerCase().indexOf('capital project') === -1 &&
          course.name.toLowerCase().indexOf('capital reporting') === -1)
          roles = _.union(roles, course.forRole)
        // console.log(startDate, endDate, course.duration);
        return true;

      }
    })
    .value();

    // topological sort (order by dependency)
    var sortedCourses = [];
    var coursesCopy = angular.copy(courses);
    function visit(course) {
      if (course.tmark || course.mark) return;
      if (!course.mark && !course.tmark) {
        course.tmark = true;
        _.chain(coursesCopy).filter(function(_course) {
          return _course.prereq.indexOf(course.name) > -1;
        })
        .each(function(_course) {
          visit(_course);
        });
        course.mark = true;
        delete course.tmark;
        sortedCourses.unshift(course);
      }
    }
    coursesCopy.forEach(function(course) {
      if (!course.mark && !course.tmark) {
        visit(course);
      }
    });
    $scope.courses = sortedCourses;console.log(sortedCourses);

    // hack
    if (roles.indexOf('Project Managers for Capital Projects') > -1)
      roles.push('Senior Managers/Support Staff for Capital Projects');
    $scope.roles = _.filter(roles, function(role) { return role && role.toLowerCase() !== 'all city staff'; });

    $scope.orderByRole = function(role) {
      return function(course) {
        return course.learningpaths.indexOf('all') > -1 || course.forRole.indexOf(role) > -1;
      }
    };

    $scope.showCourseModal = function(course) {
      ModalService.showModal({
        templateUrl: 'templates/_course_modal.html',
        controller: 'courseModalController',
        inputs: {
          course: course
        }
      });
    };
  }
]);

itCalApp.controller('hrpathsController', [
  '$scope',
  '$stateParams',
  'ModalService',
  function($scope, $stateParams, ModalService) {

    $scope.hasPath = function(path) {
      return function(course) {
        return course.forRoles.indexOf(path) > -1;
      }
    };

    $scope.showCourseModal = function(course) {
      ModalService.showModal({
        templateUrl: 'templates/_course_modal.html',
        controller: 'courseModalController',
        inputs: {
          course: course
        }
      });
    };
  }
]);

itCalApp.controller('catalogController', [
  '$rootScope',
  '$scope',
  '$state',
  '$stateParams',
  '$filter',
  '$timeout',
  'ModalService',
  function($rootScope, $scope, $state, $stateParams, $filter, $timeout, ModalService) {
    $scope.type = $stateParams.type;
    $scope.query = '';

    $scope.ofSubType = function(item) {
      if (!$stateParams.subtype || $stateParams.subtype === 'all') return true;

      if ($stateParams.type === 'it')
        return item.area === $stateParams.subtype;

      if ($stateParams.type === 'hr')
        return item.name === $stateParams.subtype;

      return false;
    };

    // TODO: get hr catalog headers dynamically

    $scope.filterEmptyArea = function(item) {
      return !!item.area;
    };

    $scope.hrGroup = function(group) {
      return function(item) {
        if (item.portalGroup.indexOf(group) > -1)
          return true;
        else
          return false;
      }
    };
    $scope.hrSubGroup = function(subgroup) {
      return function(item) {
        if (subgroup === '')
          return item.competencies.length === 0;
        else
          return (item.competencies.indexOf(subgroup) > -1);
      }
    };

    $scope.showCourseModal = function(course) {
      ModalService.showModal({
        templateUrl: 'templates/_course_modal.html',
        controller: 'courseModalController',
        inputs: {
          course: course,
          type: $scope.type
        }
      });
    };

    $scope.prepareSearch = function() {
      if ($stateParams.subtype !== 'all') {
        $timeout(function() {
          $('#catalog-search input')[0].focus();
        }, 50);
        $state.go('catalog', { type: $stateParams.type, subtype: 'all' }, {});
      }
    };

    // scroll fix for secondary menu on low vertical res monitors
    $('body').scroll(function() {
      var windowHeight = window.innerHeight;
      var visibleHeight = windowHeight - 85; // 85px from header
      var offset = $('#content').offset().top;
      var height = $('.secondary-nav.catalog').innerHeight() + 120; // plus 30 padding
      var hiddenHeight = height - visibleHeight;
      if (hiddenHeight > Math.abs(offset))
        $('.secondary-nav.catalog').css({ top: offset });
    });
  }
]);

itCalApp.controller('courseModalController', [
  'course',
  '$scope',
  '$stateParams',
  'close',
  'ModalService',
  function(course, $scope, $stateParams, close, ModalService) {
    $scope.close = close;
    $scope.course = course;
    $scope.type = $stateParams.type;

    $scope.showRegisterModal = function(course, type) {
      ModalService.showModal({
        templateUrl: 'templates/_register_modal.html',
        controller: [
          '$scope',
          'close',
          function($scope, _close) {
            $scope.course = course;
            $scope.close = _close;
            $scope.closeParent = close;
            $scope.type = $stateParams.type;
            $scope.courses = $stateParams.type === 'it' ? courseData : courseDataHr;
          }
        ]
      });
    };
  }
]);

itCalApp.directive('vCenter', function() {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      scope.$watch(function() {
        return elem[0].clientHeight;
      }, function(value) {
        var windowHalf = window.innerHeight / 2;
        var elemHalf = value / 2;
        var offset = windowHalf - elemHalf;

        elem.css({ top: offset });
      });
    }
  };
});

// TODO: hook up
itCalApp.directive('courseButton', [
  '$stateParams',
  '$filter',
  function($stateParams, $filter) {
    return {
      restrict: 'E',
      scope: {
        'course': '@',
        'type': '='
      },
      template: '<a ng-href="{{ emailLink }}"><button class="button" ng-class="{ \'button-it\': $stateParams.type === \'it\', \'button-hr\': $stateParams.type === \'hr\' }">{{ buttonText }}</button></a>',
      link: function(scope, elem, attrs) {
        var startDate = new Date(scope.course.start || scope.course.startDate);
        var courseName = scope.course.title || scope.course.name;
        scope.buttonText = 'Register';

        var itStandardEmail = 'mailto:ittraining@burnaby.ca?subject=Please register me for ' + courseName + ' on ' + ($filter('date')(startDate, 'MMM dd')) + '&body=Do you have the proper course prerequisites? %0D%0A%0D%0ADid you remember to cc your manager?';
        var itByRequestEmail = 'mailto:ittraining@burnaby.ca?subject=I am interested in taking ' + courseName + ' course. Please contact me for further details.' + '&body=Do you have the proper course prerequisites? %0D%0A%0D%0ADid you remember to cc your manager?';
        var hrStandardEmail = 'mailto:Learning@burnaby.ca?subject=Please register me for ' + courseName + ' on ' + ($filter('date')(startDate, 'MMM dd')) + '&body=Please ensure you have prior approval from your supervisor or manager prior to sending this registration email.%0D%0A%0D%0ARemember to CC your manager on this email. %0D%0A%0D%0APlease indicate your position class (RFT/RPT/TFT/AUX):%0D%0A%0D%0APlease indicate your cost centre (in case of no show):';

        if ($stateParams.type === 'it') {
          if (scope.course.isByRequest) {
            scope.emailLink = itByRequestEmail;
            scope.buttonText = 'Request';
          } else {
            scope.emailLink = itStandardEmail;
          }
        } else {
          scope.emailLink = hrStandardEmail;
        }
      }
    }
  }
]);
