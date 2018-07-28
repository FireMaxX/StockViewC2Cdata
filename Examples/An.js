  google.charts.load('current', {packages:['corechart']});
  google.charts.setOnLoadCallback(drawExample5);

function drawExample5() {
  var options = {
    width: 400,
    height: 240,
    animation: {
      duration: 1000,
      easing: 'in'
    },
    hAxis: {viewWindow: {min:0, max:5}}
  };

  var chart = new google.visualization.SteppedAreaChart(
      document.getElementById('example5-visualization'));
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'x');
  data.addColumn('number', 'y');
  var MAX = 10;
  for (var i = 0; i < MAX; ++i) {
    data.addRow([i.toString(), Math.floor(Math.random() * 100)]);
  }
  var prevButton = document.getElementById('example5-b1');
  var nextButton = document.getElementById('example5-b2');
  var changeZoomButton = document.getElementById('example5-b3');
  function drawChart() {
    // Disabling the button while the chart is drawing.
    prevButton.disabled = true;
    nextButton.disabled = true;
    changeZoomButton.disabled = true;
    google.visualization.events.addListener(chart, 'ready',
        function() {
          prevButton.disabled = options.hAxis.viewWindow.min <= 0;
          nextButton.disabled = options.hAxis.viewWindow.max >= MAX;
          changeZoomButton.disabled = false;
        });
    chart.draw(data, options);
  }

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
      options.hAxis.viewWindow.min = 0;
      options.hAxis.viewWindow.max = 5;
    } else {
      options.hAxis.viewWindow.min = 0;
      options.hAxis.viewWindow.max = MAX;
    }
    zoomed = !zoomed;
    drawChart();
  }
  drawChart();
}