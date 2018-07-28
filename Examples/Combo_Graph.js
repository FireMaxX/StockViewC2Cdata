google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(displayData);

function displayData() {
	var Total = json.length;
	var Size_Para = 5;						// Increase to load more data at very beginning
	var SIZE = reSize(Size_Para);			// How many date to display on load
	var Pre_Load_Range = Size_Para+SIZE;	// How many data to insert on load
	var Index = Total - Pre_Load_Range;		// Index of Left-Most record
	
	// Initialize Data Structure
	var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
	data.addColumn('number', 'Viewers');
	data.addColumn('number', 'Enroll');
	data.addColumn('number', 'Renew');
	data.addColumn('number', 'Widthdraw'); 

	// Build Data Object from JSON
	for (var i = Index; i < Total; i++) {
		data.addRow([json[i]['date'], 
					Number(json[i]['websiteviews']), 
					Number(json[i]['enroll_dailycount']), 
					Number(json[i]['renew_dailycount']),
					Number(json[i]['withdraw_dailycount']),
					]);
	}
	var MAX = data.getNumberOfRows();	// Max Index
	
	// Create Buttons
	var prevButton = document.getElementById('b1');
	var nextButton = document.getElementById('b2');
	var changeZoomButton = document.getElementById('b3');
	
	// Display Options
	var options = {
		chart: {title: 'C2C WebSite Viwer Data'},
		animation: {
			duration: 500,
			easing: 'in'
		},
		hAxis: {
			title: 'Date',
			viewWindow: {min: MAX-SIZE, max: MAX}	// Show Up-to-Date five day's data
		},
		vAxes: {
			0: {
				title: '# Enrollee',
			},
			1: {
				title: '# Viewers',
				gridlines: {
					count:6
				}
			}
		},
		isStacked: true,
		crosshair: {trigger: 'both'},
		series: {
			0: {type: 'line', targetAxisIndex: 1},
			1: {type: 'bars', targetAxisIndex: 0},
			2: {type: 'bars', targetAxisIndex: 0},
			3: {type: 'bars', targetAxisIndex: 0}			
		}
	}
	
	function loadMore(number) {
		for (var i = 0; i <  number; i++) {
			Index = Index - 1;
			if (Index >= 0) {
				data.insertRows(0,[[json[Index]['date'], 
					Number(json[Index]['websiteviews']), 
					Number(json[Index]['enroll_dailycount']), 
					Number(json[Index]['renew_dailycount']),
					Number(json[Index]['withdraw_dailycount']),
				]]);
			}
		}
		MAX = data.getNumberOfRows();
	}
	
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
		chart.draw(data, options);
	}
	
	// Auto-Adjust Drawing Options
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

	// Button functions
	prevButton.onclick = function() {
		options.hAxis.viewWindow.min -= 1;
		options.hAxis.viewWindow.max -= 1;
		drawChart();
	}
	nextButton.onclick = function() {
		options.hAxis.viewWindow.min += 1;
		options.hAxis.viewWindow.max += 1;
		drawChart();
	}
	var zoomed = false;
	changeZoomButton.onclick = function() {
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
	
	
	///// onLoad Page /////
	var EXTENT = 1;
	$(document).ready(function(){
		//Mouse Scroll functions - Using jQuery-Mouse-wheel-plug-in
		$("#chart_div").on('mousewheel', function(event) {
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
				if (MAX < Total) {
					loadMore(EXTENT);
				}
				options.hAxis.viewWindow.max += EXTENT;
				
				if (options.hAxis.viewWindow.max == MAX) {
					options.hAxis.viewWindow.min -= EXTENT;
				}
				else {
					options.hAxis.viewWindow.min -= EXTENT;
					options.hAxis.viewWindow.max += EXTENT;
				}
				
				if (options.hAxis.viewWindow.min < 0) {
					options.hAxis.viewWindow.min = 0;
				}
				if (options.hAxis.viewWindow.max > MAX) {
					options.hAxis.viewWindow.max = MAX;
				}
			}
			console.log(options.hAxis.viewWindow.max);
			console.log(MAX);
			drawChart();
		});
		
		/*
		var mouse_x, mouse_y;
		$("#chart_div").mousedown(function(event) {
			mouse_x = event.pageX;
		});
		$("#chart_div").mouseup(function(event) {
			var new_X = event.pageX;
			if (new_X < mouse_x) {
				moveForward();
			}
			else if (new_X > mouse_x) {
				moveBackward();
			}
		});
		*/
	});
	
	//Initial Display
	drawChart();	
	//console.log(window.innerHeight);
	//console.log(window.innerWidth);
}