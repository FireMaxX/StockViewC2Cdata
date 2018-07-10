google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(displayData);

function displayData() {
	var MAX = json.length;
	var SIZE = 5;
	
	var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
	data.addColumn('number', 'Viewers');
	data.addColumn('number', 'Enroll');
	data.addColumn('number', 'Renew');
	data.addColumn('number', 'Widthdraw'); 

	// Build Data Object from JSON
	for (var i = 0; i < json.length; i++) {
		//console.log(typeof(json[i]['WebSiteViews']));
		data.addRow([json[i]['Date'], 
					Number(json[i]['WebSiteViews']), 
					Number(json[i]['Enroll_DailyCount']), 
					Number(json[i]['Renew_DailyCount']),
					Number(json[i]['Widthdraw_DailyCount']),
					]);
	}

	// Create Buttons
	var prevButton = document.getElementById('b1');
	var nextButton = document.getElementById('b2');
	var changeZoomButton = document.getElementById('b3');
	
	// Display Options
	var options = {
		chart: {title: 'C2C WebSite Viwer Data'},
		width: 800,
		height: 480,
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
	}

	// Button functions
	prevButton.onclick = function() {
		options.hAxis.viewWindow.min -= 2;
		options.hAxis.viewWindow.max -= 2;
		drawChart();
	}
	nextButton.onclick = function() {
			options.hAxis.viewWindow.min += 2;
			options.hAxis.viewWindow.max += 2;
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
	
	//Mouse Scroll functions
	document.getElementById('chart_div').onwheel = wheelHandler;
	function wheelHandler(event) {
		event = event || window.event;
		event.preventDefault();	// Prevent father div movement
		if (event.wheelDelta > 0) {	// Up
			if ((options.hAxis.viewWindow.min-2) > 0){
				options.hAxis.viewWindow.min -= 2;
				options.hAxis.viewWindow.max -= 2;
			}
			else {
				options.hAxis.viewWindow.min = 0;
				options.hAxis.viewWindow.max = SIZE;
				drawChart();
			}
		}
		else {	// Down -> Next -> Move Right
			if ((options.hAxis.viewWindow.max+2) < MAX){
				options.hAxis.viewWindow.min += 2;
				options.hAxis.viewWindow.max += 2;
			}
			else {
				options.hAxis.viewWindow.min = MAX-SIZE;
				options.hAxis.viewWindow.max = MAX;
			}
		}
		drawChart();
	}
	
	//Initial Display
	drawChart();	
}

