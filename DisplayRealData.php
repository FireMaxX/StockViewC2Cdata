<?php /* Template Name: Data_Display V1.1 Animation */ ?>
<?php /* NOTE: Google Chart API loaded at header.php */ ?>

<?php
/**
 * The template for displaying pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other "pages" on your WordPress site will use a different template.
 *
 * @package WordPress
 * @subpackage Twenty_Fifteen
 * @since Twenty Fifteen 1.0
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

		<?php
		// Start the loop.
		while ( have_posts() ) : the_post();
			// Include the page content template.
			// get_template_part( 'content', 'page' );
			// If comments are open or we have at least one comment, load up the comment template.
			// if ( comments_open() || get_comments_number() ) :
			// comments_template();
			//endif;
		endwhile;


		?>
		<?php
		global $wpdb;
		$records = $wpdb->get_results("SELECT * FROM C2Ctest;");	// Acquire data from Table C2Ctest
		$records_json = wp_json_encode($records);
		//echo $records_json;
		//print_r($records);
		?>

		<script>
    		var json = <?php echo $records_json; ?>; 	//Don't forget the extra semicolon!
    	</script>


    	<?php echo "
		<script>
			google.charts.load('current', {packages: ['corechart', 'line']});
			google.charts.setOnLoadCallback(drawChart);

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

			// Create Button
			var prevButton = document.getElementById('b1');
			var nextButton = document.getElementById('b2');
			var changeZoomButton = document.getElementById('b3');

			var options = {
				width: 400,
				height: 240,
				animation: {
					duration: 500,
					easing: 'in'
				},
				hAxis: {
					title: 'Date',
					viewWindow: {min: 0, max: 5}
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
		</script>
		"
		?>

		</main><!-- .site-main -->
	</div><!-- .content-area -->
	<div id="chart_div"></div>
	<div id="b1"></div>
	<div id="b2"></div>
	<div id="b3"></div>

<?php get_footer(); ?>

