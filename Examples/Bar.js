google.charts.load('current', {'packages':['bar']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Genre','Website_Views','Start_Daily','Enroll_Daily','Start_Total','Enroll_Total',{role : 'annotation'}],
      ['2016-10-22',17,4,3,4,3, ''],
      ['2016-10-23',45,2,1,5,4, ''],
      ['2016-10-24',16,6,2,11,6, ''],
      ['2016-10-25',7,1,0,12,6, ''],
    ]);

    var options = {
      title: "Test Bar Graph",
      width: 600,
      height: 400,
      bar: {groupWidth: '75%'},
      isStacked: true,
    };

	var chart = new google.charts.Bar(document.getElementById('chart_div'));
    chart.draw(data, google.charts.Bar.convertOptions(options));
}
    
