angular.module('ProjectHands')

.controller('DashboardMainPageController', function ($scope) {
	$scope.gridItems = [
		{
			sizeX: 2,
			sizeY: 1,
			row: 0,
			col: 0,
        },
		{
			sizeX: 2,
			sizeY: 2,
			row: 0,
			col: 2
        },
		{
			sizeX: 2,
			sizeY: 1,
			row: 2,
			col: 0
        },
		{
			sizeX: 2,
			sizeY: 2,
			row: 2,
			col: 2
        },
		{
			sizeX: 2,
			sizeY: 1,
			row: 4,
			col: 0
        },
		{
			sizeX: 2,
			sizeY: 2,
			row: 4,
			col: 2
        }

	];

	$scope.gridsterOpts = {

		columns: 6, // the width of the grid, in columns
		pushing: false, // whether to push other items out of the way on move or resize
		floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
		swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
		width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
		colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
		rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
		margins: [10, 10], // the pixel distance between each widget
		outerMargin: true, // whether margins apply to outer edges of the grid
		isMobile: false, // stacks the grid items if true
		mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
		mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
		minColumns: 1, // the minimum columns the grid must have
		minRows: 2, // the minimum height of the grid, in rows
		maxRows: 100,
		defaultSizeX: 2, // the default width of a gridster item, if not specifed
		defaultSizeY: 1, // the default height of a gridster item, if not specified
		minSizeX: 2, // minimum column width of an item
		maxSizeX: null, // maximum column width of an item
		minSizeY: 3, // minumum row height of an item
		maxSizeY: null, // maximum row height of an item 
		resizable: {
			enabled: false,
			start: function (event, $element, widget) {
				console.log("resize started");
			}, // optional callback fired when resize is started,
			resize: function (event, $element, widget) {
				console.log("resizing");
			}, // optional callback fired when item is resized,
			stop: function (event, $element, widget) {
					console.log("finished resizing");
					console.log("Draggable is: " + $scope.gridsterOpts.draggable.enabled);
				} // optional callback fired when item is finished resizing
		},
		draggable: {
			enabled: false, // whether dragging items is supported
//			handle: '.my-class', // optional selector for resize handle
			start: function (event, $element, widget) {
				console.log("dragging started");
			}, // optional callback fired when drag is started,
			drag: function (event, $element, widget) {
				console.log("dragging");

			}, // optional callback fired when item is moved,
			stop: function (event, $element, widget) {
					console.log("finished dragging");
				} // optional callback fired when item is finished dragging
		}
	};

	$scope.editLayoutEnabled = false;

	$scope.enableEditLayout = function () {
		console.log("Draggable was: " + $scope.gridsterOpts.draggable.enabled);
		$scope.editLayoutEnabled = true;
		$scope.gridsterOpts.draggable.enabled = true;
		$scope.gridsterOpts.resizable.enabled = true;
		$scope.gridsterOpts.pushing = true;
		$scope.gridsterOpts.floating = true;
		$scope.gridsterOpts.swapping = false;
	};
	$scope.disableEditLayout = function () {
		console.log("Draggable was: " + $scope.gridsterOpts.draggable.enabled);
		$scope.editLayoutEnabled = false;
		$scope.gridsterOpts.draggable.enabled = false;
		$scope.gridsterOpts.resizable.enabled = false;
		$scope.gridsterOpts.pushing = false;
		$scope.gridsterOpts.floating = false;
		$scope.gridsterOpts.swapping = true;
	};
	$scope.toggleIsMobile = function () {
		$scope.gridsterOpts.isMobile = !$scope.gridsterOpts.isMobile;
	};
	$scope.toggleMobileModeEnabled = function () {
		$scope.gridsterOpts.mobileModeEnabled = !$scope.gridsterOpts.mobileModeEnabled;
	};
	$scope.$on('gridster-mobile-changed', function (gridster) {
		console.log("mobile mode!!!");
	});
	$scope.$on('gridster-draggable-changed', function (gridster) {
		console.log("draggable changed!");
	});
});
