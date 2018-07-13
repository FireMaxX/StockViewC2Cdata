google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(displayData);

function displayData() {
	var MAX = json.length;	// The index of last date
	var SIZE = 5;			// How many date will be display at least
	var HEI = function (WinHei, WinWid) {
		return WinHei*0.8;
	}
	var WID = function (WinHei, WinWid) {
		if ((WinWid/WinHei) > 1) {	// Landscape
			return Math.round(WinWid*0.65);
		}
		else {return Math.round(WinWid*0.95);}
	}
	
	var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
	data.addColumn('number', 'Viewers');
	data.addColumn('number', 'Enroll');
	data.addColumn('number', 'Renew');
	data.addColumn('number', 'Widthdraw'); 

	// Build Data Object from JSON
	for (var i = 0; i < json.length; i++) {
		//console.log(typeof(json[i]['websiteviews']));
		data.addRow([json[i]['date'], 
					Number(json[i]['websiteviews']), 
					Number(json[i]['enroll_dailycount']), 
					Number(json[i]['renew_dailycount']),
					Number(json[i]['withdraw_dailycount']),
					]);
	}

	// Create Buttons
	var prevButton = document.getElementById('b1');
	var nextButton = document.getElementById('b2');
	var changeZoomButton = document.getElementById('b3');
	
	// Display Options
	var options = {
		chart: {title: 'C2C WebSite Viwer Data'},
		width: WID(window.innerHeight,window.innerWidth),
		height: HEI(window.innerHeight,window.innerWidth),
		animation: {
			duration: 500,
			easing: 'in'
		},
		hAxis: {
			title: 'Date',
			viewWindow: {min: MAX-SIZE, max: MAX}	// Show Up-to-Date five day's data
		},
		vAxes: {
			0: {title: '# Enrollee'},
			1: {title: '# Viewers'}
		},
		isStacked: true,
		crosshair: { trigger: 'both' },
		series: {
			0: {type: 'line', targetAxisIndex: 1},
			1: {type: 'bars', targetAxisIndex: 0},
			2: {type: 'bars', targetAxisIndex: 0},
			3: {type: 'bars', targetAxisIndex: 0}			
		}
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
		//console.log(options.hAxis.viewWindow.min);
		//console.log(options.hAxis.viewWindow.max);
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
	
	
	//Mouse Scroll functions - Using jQuery-Mouse-wheel-plug-in
	var EXTENT = 1;
	$(document).ready(function(){
	  $("#chart_div").on('mousewheel', function(event) {
		if (event.deltaY > 0) {	// Scroll up -> Zoom in
			EXTENT = Math.abs(deltaY);
			if (options.hAxis.viewWindow.max == MAX) { // Shrink only at left side
				// Determine Shrink Scope
				if ((options.hAxis.viewWindow.max-(options.hAxis.viewWindow.min+EXTENT)) >= SIZE) {
					options.hAxis.viewWindow.min += EXTENT;
				}
				else if ((options.hAxis.viewWindow.max-(options.hAxis.viewWindow.min+1)) >= SIZE)
				{
					options.hAxis.viewWindow.min += 1;
				}
			}
			else if (((options.hAxis.viewWindow.max-1)-(options.hAxis.viewWindow.min+1)) >= SIZE) {	// Shrink from both side
				options.hAxis.viewWindow.min += 1;
				options.hAxis.viewWindow.max -= 1;
			}
		}
		else {	// Scroll down -> Zoom out
			if (options.hAxis.viewWindow.max == MAX) {
				if ((options.hAxis.viewWindow.min-EXTENT) >= 0) 
				{
					options.hAxis.viewWindow.min -=EXTENT;
				}
				else if ((options.hAxis.viewWindow.min-1) >= 0)
				{
					options.hAxis.viewWindow.min -= 1;
				}
			}
			else {
				options.hAxis.viewWindow.min -= 1;
				options.hAxis.viewWindow.max += 1;
			}
		}
		drawChart();
	  });
	});
	
	//Initial Display
	drawChart();	
	//console.log(window.innerHeight);
	//console.log(window.innerWidth);
}

