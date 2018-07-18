<?php /* Data_Display V1.2 Using RedCap API */ ?>
<?php /* NOTE: Google Chart API loaded at header.php */ ?>
<!--Load jQuery and plugins-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="./js/jquery.mousewheel.js"></script>
<!--Load Google Chart Support-->
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<div id="dashboard_div">
		<div id="chart_div" style="width:95%; height:95%"></div>
		<div id="button_div" align="center">
			<button id="b1" disabled="true">Previous</button>
			<button id="b2" disabled="true">Next</button>
			<button id="b3">Change Zoom</button>
		</div>
		<main id="main" class="site-main" role="main">

			<?php
			$data = array(
				'token' => '2F387F509692D3CDC8F25DF8CA7A89AA',
				'content' => 'record',
				'format' => 'json',
				'type' => 'flat',
				'fields' => array('date','enroll_dailycount','renew_dailycount','websiteviews','withdraw_dailycount'),
				'rawOrLabel' => 'raw',
				'rawOrLabelHeaders' => 'raw',
				'exportCheckboxLabel' => 'false',
				'exportSurveyFields' => 'false',
				'exportDataAccessGroups' => 'false',
				'returnFormat' => 'json'
			);
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, 'https://dmsc.mind.uci.edu/redcap/api/');
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
			curl_setopt($ch, CURLOPT_VERBOSE, 0);
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
			curl_setopt($ch, CURLOPT_AUTOREFERER, true);
			curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
			curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data, '', '&'));
			$records_json = curl_exec($ch);
			curl_close($ch);
			//echo $records_json;
			//print_r($records_json);
			?>

			<script>
				var json = <?php echo $records_json; ?>; 	//Don't forget the extra semicolon!
			</script>

			<script type='text/javascript' src="./js/Chart.js"></script>

		</main><!-- .site-main -->
	</div><!-- dashboard_div -->
	
	<style>
	#chart_div
	{
		margin-left: auto;
		margin-right: auto;
	}
	</style>
	

