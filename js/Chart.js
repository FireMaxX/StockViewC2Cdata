google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(displayData);

function displayData() {
	var Total = json.length;
	var Size_Para = 5;						// Increase to load more data at very beginning
	var SIZE = reSize(Size_Para);			// How many date to display onLoad (min Range Size)
	var Pre_Load_Range = Size_Para+SIZE;	// How many data to insert onLoad
	var Index = Total - Pre_Load_Range;		// Index of Left-Most record
	
	// Initialize Data Structure
	var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
	data.addColumn('number', 'Viewers');
	data.addColumn('number', 'Enroll');
	data.addColumn('number', 'Renew');
	data.addColumn('number', 'Widthdraw');
	data.addColumn('number', 'Start');
	data.addColumn('number', 'Total Enroll');
	data.addColumn('number', 'Total Renew');
	data.addColumn('number', 'Total Widthdraw');
	data.addColumn('number', 'Total Start');
	var hide = new Array(2,3,4,5,6,7,8,9);	// Default: Display only Daily WebSite Viewers(column 1)
	var color = new Array(					// Line Colors pool
						{color: '20a0ff'}, 
						{color: 'ff4949'}, 
						{color: 'fe980f'}, 
						{color: '13ce66'}, 
						{color: '990697'}, 
						{color: 'da547f'}, 
						{color: '09d4d4'}, 
						{color: '09e199'}, 
						{color: '6d0606'}
					);

	// Build Data Object from JSON
	for (var i = Index; i < Total; i++) {
		data.addRow([json[i]['date'], 
					Number(json[i]['websiteviews']), 
					Number(json[i]['enroll_dailycount']), 
					Number(json[i]['renew_dailycount']),
					Number(json[i]['withdraw_dailycount']),
					Number(json[i]['start_dailycount']),
					Number(json[i]['enroll_totalcount']), 
					Number(json[i]['renew_totalcount']), 
					Number(json[i]['withdraw_totalcount']),
					Number(json[i]['start_totalcount'])
					]);
	}
	var MAX = data.getNumberOfRows();	// Right-Most Index + 1
	var view = new google.visualization.DataView(data);	// Create read-only DataView instance
	
	// Create Buttons
	var prevButton = document.getElementById('b1');
	var nextButton = document.getElementById('b2');
	var changeZoomButton = document.getElementById('b3');
	var refreshButton = document.getElementById('b4');
	
	// Display Options
	var options = {
		title: 'C2C WebSite Viwer Data',
		chartArea: {
			right: '15%',
			top: '10%',
			width: '80%',
			height: '80%',
		},
		legend: { position: 'top' },
		animation: {
			duration: 500,
			easing: 'inAndOut',
			startup: true
		},
		hAxis: {
			viewWindow: {min: MAX-SIZE, max: MAX}	// Display [min, max)
		},
		crosshair: {trigger: 'both'}
	}
	
	/* -------------- Draw Chart  -------------- */
	function drawChart() {
		// Disable buttons while the chart is drawing.
		prevButton.disabled = true;
		nextButton.disabled = true;
		changeZoomButton.disabled = true;
		google.visualization.events.addListener(chart, 'ready',
			function() {
				// Disable buttons when out of range
				prevButton.disabled = options.hAxis.viewWindow.min <= 0;
				nextButton.disabled = options.hAxis.viewWindow.max >= MAX;
				changeZoomButton.disabled = false;
			});
		getNewDataView();
		chart.draw(view, options);
	}

	// Button functions
	function moveBackward(num) {
		options.hAxis.viewWindow.min += num;
		options.hAxis.viewWindow.max += num;
		validateIndex();
		drawChart();
	}
	function moveForward(num) {
		options.hAxis.viewWindow.min -= num;
		options.hAxis.viewWindow.max -= num;
		validateIndex();
		drawChart();
	}
	var zoomed = false;
	function showAll() {
		loadMore(Total-MAX);
		if (zoomed) {
			options.hAxis.viewWindow.min = MAX-SIZE;
			options.hAxis.viewWindow.max = MAX;
		} else {
			options.hAxis.viewWindow.min = 0;
			options.hAxis.viewWindow.max = MAX;
		}
		zoomed = !zoomed;
		drawChart();
	}
	
	/* ------------ jQuery Events ------------ */
	$(document).ready(function(){
		//
		$("#b1").click(function() {
			moveForward(1);
		});
		$("#b2").click(function() {
			moveBackward(1);
		});
		$("#b3").click(function() {
			showAll();
		});
		
		// Mouse Scroll functions (using jQuery_Mouse_Wheel plug in)
		$("#chart_div").on('mousewheel', function(event) {
			var EXTENT = 1;
			EXTENT = Math.abs(event.deltaY)*4;
			if (event.deltaY > 0) {	// Scroll up -> Zoom in
				// Shrink only at left side
				if (options.hAxis.viewWindow.max == MAX) { 
					// Determine Shrink Scope
					if ((options.hAxis.viewWindow.max-(options.hAxis.viewWindow.min+EXTENT)) >= SIZE) {
						options.hAxis.viewWindow.min += EXTENT;
					}
					else if ((options.hAxis.viewWindow.max-(options.hAxis.viewWindow.min+1)) >= SIZE)
					{
						options.hAxis.viewWindow.min += 1;
					}
				}
				else if (((options.hAxis.viewWindow.max-EXTENT)-(options.hAxis.viewWindow.min+EXTENT)) >= SIZE) {	// Shrink from both side
					options.hAxis.viewWindow.min += EXTENT;
					options.hAxis.viewWindow.max -= EXTENT;
				}
				else if (((options.hAxis.viewWindow.max-1)-(options.hAxis.viewWindow.min+1)) >= SIZE){
					options.hAxis.viewWindow.min += 1;
					options.hAxis.viewWindow.max -= 1;	
				}
			}
			else {	// Scroll down -> Zoom out
				if ((MAX < Total) && (options.hAxis.viewWindow.min < EXTENT*2)) {
					loadMore(EXTENT);
					options.hAxis.viewWindow.max += EXTENT;
					options.hAxis.viewWindow.min += EXTENT;
				}
		
				if (options.hAxis.viewWindow.max == MAX) {	// Show more on the left of x-axis
					options.hAxis.viewWindow.min -= EXTENT;
				}
				else {	// Show more on both side
					options.hAxis.viewWindow.min -= EXTENT/2;
					options.hAxis.viewWindow.max += EXTENT/2;
				}	
			}
			validateIndex();
			drawChart();
		});
		
		// Mouse Drag functions -> move Forward/Backward
		var mouse_X;
		$("#chart_div").mousedown(function(event) {
			mouse_X = event.pageX;
		});
		$("#chart_div").mouseup(function(event) {
			var new_X = event.pageX;
			var total_X = document.getElementById('chart_div').offsetWidth;
			var offset = Math.round(Math.abs(Math.round(new_X-mouse_X))/(total_X/(SIZE-1)))+1;
				
			if (new_X < mouse_X) {
				moveBackward(offset);
			}
			else if (new_X > mouse_X) {
				moveForward(offset);
				if ((MAX < Total) && (options.hAxis.viewWindow.min < offset)) {
					loadMore(offset);
					options.hAxis.viewWindow.max += offset;
					options.hAxis.viewWindow.min += offset;
				}
			}
		});
		
		// Checkboxs select functions -> Choose what to display
		$("input[name=display_select]").click(function() {
			var cb = document.getElementsByName('display_select');
			var color_pool = new Array();
			var id_Saved = 'websiteviews';
			var temp = new Array();
			for (var i=0; i < cb.length; i++) {
				cb[i].disabled=false;	// Refresh
				if (!(cb[i].checked)) { temp.push(Number(cb[i].value)); }	// Hide this column in DataView
				else { 
					color_pool.push(color[Number(cb[i].value)-1]);	// Change drawChart() color pool
					id_Saved=cb[i].id;
				}
			}
			if (color_pool.length == 1){	// Only one line left, disable the switch to prevent Exception
				document.getElementById(id_Saved).disabled=true;
			}
			hide = temp;
			options.series = color_pool;
			drawChart();
		});
	});
	
/* -------------- Utility Functions -------------- */	
	// (Auto-Response) ReSize Chart onLoad
	function reSize(default_size){
		var HEI = document.getElementById('chart_div').offsetHeight;
		var WID = document.getElementById('chart_div').offsetWidth;
		var RATIO = WID/HEI;
		if (RATIO > 1) {	// Landscape
			size = default_size + Math.round(WID/HEI)*4;
		}
		else { size = default_size;}
		return size;
	}
	
	// Add/Hide Data Category and Refresh Display
	function getNewDataView(){
		MAX = data.getNumberOfRows();
		view = new google.visualization.DataView(data);
		view.hideColumns(hide);
		view.setRows(data.getSortedRows({column: 0, desc: false}));
	}
	
	// Ensure Index within Valid Range
	function validateIndex(){
		if (options.hAxis.viewWindow.min < 0) {
			options.hAxis.viewWindow.min = 0;
		}
		if (options.hAxis.viewWindow.max > MAX) {
			options.hAxis.viewWindow.max = MAX;
		}
		if ((options.hAxis.viewWindow.max-options.hAxis.viewWindow.min)<SIZE) {
			options.hAxis.viewWindow.min=options.hAxis.viewWindow.max-SIZE;
		}
	}
	
	// Load more records from Database(JSON)
	function loadMore(number) {
		for (var i = 0; i <  number; i++) {
			Index = Index - 1;
			if (Index >= 0) {
				data.insertRows(0,[[json[Index]['date'], 
					Number(json[Index]['websiteviews']), 
					Number(json[Index]['enroll_dailycount']), 
					Number(json[Index]['renew_dailycount']),
					Number(json[Index]['withdraw_dailycount']),
					Number(json[Index]['start_dailycount']),
					Number(json[Index]['enroll_totalcount']), 
					Number(json[Index]['renew_totalcount']), 
					Number(json[Index]['withdraw_totalcount']),
					Number(json[Index]['start_totalcount'])
				]]);
			}
		}
		MAX = data.getNumberOfRows();
	}
	
	/* -------------- Initial Display -------------- */
	drawChart();	
	//console.log(window.innerHeight);
	//console.log(window.innerWidth);
}

