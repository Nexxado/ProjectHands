angular.module("ProjectHands.dashboard")

.controller("DashboardCalendarController", function ($scope, $compile, uiCalendarConfig, $mdMedia, $mdDialog, RenovationService, $state) {


	$scope.eventSources = [];
	$scope.eventSources2 = [];
	
	/* event source that contains custom events on the scope */
	/*Event Format: {title: '', start: new Date(year, month, day), end: new Date(year,month,day), allDay: Bool},*/
	$scope.events = [];
	$scope.allRenovations = [];

	$scope.renderAllEvents = function(){
		console.log("Rendered All Events");
			uiCalendarConfig.calendars.renoCalendar.fullCalendar('removeEvents');
			uiCalendarConfig.calendars.renoCalendar.fullCalendar('addEventSource', $scope.calEventsExt);
	}
	
	
	RenovationService.getAll()
		.$promise.then(function (result) {
		console.log("get all was called!@#!#!@#@#!@#");
			$scope.allRenovations = [];
			 for(var j = 0; j < result.length; j++){
				if(result[j].addr !== null){
					$scope.allRenovations.push(result[j]);
				}
			}
			for (var i in $scope.allRenovations) {
				var title = $scope.allRenovations[i].addr.city + ", " + $scope.allRenovations[i].addr.street + " " + $scope.allRenovations[i].addr.num;
				var date = new Date($scope.allRenovations[i].date);
				$scope.calEventsExt.events.push({
					type: 'party',
					title: title,
					start: date,
					end: date,
					allDay: true,
					addr: $scope.allRenovations[i].addr
				})
			}
		
			$scope.renderAllEvents();
		}).catch(function (error) {
		console.log("get all was called ERROR!@#!#!@#@#!@#");
			console.log("Error: ", error);
		});

	//$scope.eventSources = [];
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();

	///* event source that pulls from google.com */
	$scope.eventSource = {
		url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
		className: 'gcal-event', // an option!
		currentTimezone: 'America/Chicago' // an option!
	};

	/* event source that calls a function on every view switch */
	$scope.eventsF = function (start, end, timezone, callback) {
		var s = new Date(start).getTime() / 1000;
		var e = new Date(end).getTime() / 1000;
		var m = new Date(start).getMonth();
		var events = [{
			title: 'Feed Me ' + m,
			start: s + (50000),
			end: s + (100000),
			allDay: false,
			className: ['customFeed']
	}];
		callback(events);
	};

	$scope.calEventsExt = {
		color: '#0033cc',
		textColor: 'white',
		events: []
	};
	/* alert on eventClick */
	$scope.alertOnEventClick = function (date, jsEvent, view) {
		$state.go('dashboard.renovation', {city: date.addr.city, street: date.addr.street, num: date.addr.num} );
		console.log("date is ", date, " jsEvent is: ", jsEvent, " view is: ", view);
		console.log("the addr is ", date.addr);
		
	};
	/* alert on Drop */
	$scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
		console.log("Event Droped to make dayDelta ", delta);
	};
	/* alert on Resize */
	$scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
		console.log('Event Resized to make dayDelta ' + delta);
	};
	/* add and removes an event source of choice */
	$scope.addRemoveEventSource = function (sources, source) {
		var canAdd = 0;
		angular.forEach(sources, function (value, key) {
			if (sources[key] === source) {
				sources.splice(key, 1);
				canAdd = 1;
			}
		});
		if (canAdd === 0) {
			sources.push(source);
		}
	};
	/* add custom event*/
	$scope.addEvent = function () {

	};
	/* remove event */
	$scope.remove = function (index) {

	};
	/* Change View */
	$scope.changeView = function (view, calendar) {
		uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
	};
	/* Change View */
	$scope.renderCalender = function (calendar) {
		if (uiCalendarConfig.calendars[calendar]) {
			uiCalendarConfig.calendars[calendar].fullCalendar('render');
		}
	};
	/* Render Tooltip */
	$scope.eventRender = function (event, element, view) {
		element.attr({
			'tooltip': event.title,
			'tooltip-append-to-body': true
		});
		$compile(element)($scope);
	};
	/* config object */
	$scope.uiConfig = {
		calendar: {
			height: 850,
			editable: false,
			header: {
				left: '',
				center: 'title',
				right: 'prev,next'
			},
			eventClick: $scope.alertOnEventClick,
			eventDrop: $scope.alertOnDrop,
			eventResize: $scope.alertOnResize,
			eventRender: $scope.eventRender,
			dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
			dayNamesShort: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]
		}
	};

	//$scope.changeLang = function () {
	// 	if($scope.changeTo === 'Hebrew'){
	//		$scope.uiConfig.calendar.dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
	//		$scope.uiConfig.calendar.dayNamesShort = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
	//		$scope.changeTo = 'Hebrew'; //IF WE WANT TO ADD ARABIC - CHANGE THIS TO Arabic
	//		
	//	} else {
	//		$scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	//		$scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	//		$scope.changeTo = 'Hungarian';
	//	}
	//};
	/* event sources array*/
//	$scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
//	$scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

	
	
});
