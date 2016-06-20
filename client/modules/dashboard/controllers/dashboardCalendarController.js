angular.module("ProjectHands.dashboard")

.controller("DashboardCalendarController", function ($scope, $compile, uiCalendarConfig, $mdMedia, $mdDialog, RenovationService) {


	/* event source that contains custom events on the scope */
	/*Event Format: {title: '', start: new Date(year, month, day), end: new Date(year,month,day), allDay: Bool},*/
	$scope.events = [];
	$scope.renovations = [];


	RenovationService.getAll()
		.$promise.then(function (result) {

			$scope.renovations = result;
			for (var i in $scope.renovations) {
				var title = $scope.renovations[i].addr.city + ", " + $scope.renovations[i].addr.street + " " + $scope.renovations[i].addr.num;
				var date = new Date($scope.renovations[i].date);
				$scope.events.push({
					title: title,
					start: date,
					end: date,
					allDay: true
				})
			}

		}).catch(function (error) {
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
		color: '#f00',
		textColor: 'yellow',
		events: [
			{
				type: 'party',
				title: 'Lunch',
				start: new Date(y, m, d, 12, 0),
				end: new Date(y, m, d, 14, 0),
				allDay: false
		},
			{
				type: 'party',
				title: 'Lunch 2',
				start: new Date(y, m, d, 12, 0),
				end: new Date(y, m, d, 14, 0),
				allDay: false
		},
			{
				type: 'party',
				title: 'Click for Google',
				start: new Date(y, m, 28),
				end: new Date(y, m, 29),
				url: 'http://google.com/'
		}
        ]
	};
	/* alert on eventClick */
	$scope.alertOnEventClick = function (date, jsEvent, view) {
		console.log(date.title + ' was clicked ');
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
			editable: true,
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
	$scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
	//$scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

});
