google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {
				
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
	data.addColumn('number', 'Viewers');
				
	for (var i = 0; i < json.length; i++) {
		//console.log(typeof(json[i]['WebSiteViews']));
		data.addRow([json[i]['Date'], Number(json[i]['WebSiteViews'])]);
	}

	var options = {
		hAxis: {
			title: 'Date'
		},
		vAxis: {
			title: 'Count'
		}
	};
				
	var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}			