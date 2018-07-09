google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(displayData);

function displayData() {
	var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
	data.addColumn('number', 'Viewers');

	// Build Data Object from JSON
	var MAX = json.length;
	for (var i = 0; i < json.length; i++) {
		//console.log(typeof(json[i]['WebSiteViews']));
		data.addRow([json[i]['Date'], Number(json[i]['WebSiteViews'])]);
	}

	// Create Buttons
	var prevButton = document.getElementById('b1');
	var nextButton = document.getElementById('b2');
	var changeZoomButton = document.getElementById('b3');

	var options = {
		title: 'C2C WebSite Viwer Data',
		width: 800,
		height: 480,
		animation: {
			duration: 500,
			easing: 'in'
		},
		hAxis: {
			title: 'Date',
			viewWindow: {min: MAX-5, max: MAX}	// Show Up-to-Date five day's data
		},
		vAxis: {
			title: 'Count'
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
			options.hAxis.viewWindow.min = MAX-5;
			options.hAxis.viewWindow.max = MAX;
		} else {
			options.hAxis.viewWindow.min = 0;
			options.hAxis.viewWindow.max = MAX;
		}
		zoomed = !zoomed;
		drawChart();
	}
	drawChart();
}

