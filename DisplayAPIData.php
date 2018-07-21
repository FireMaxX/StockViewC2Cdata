<?php /* Data_Display V1.2 Using RedCap API */ ?>
<?php /* NOTE: Google Chart API loaded at header.php */ ?>
<!--Load jQuery and plugins-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="./js/jquery.mousewheel.js"></script>
<!--Load Google Chart Support-->
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<div id="dashboard_div">
		<div id="chart_div" style="width:95%; height:90%"></div>
		<div id="check_box_Upper" align="center">
			<label><input id="websiteviews" type="checkbox" name="display_select" value = "1" checked="checked" />Website Viewers</label>
			<label><input id="enroll_dailycount" type="checkbox" name="display_select" value = "2" />Daily Enroll</label>
			<label><input id="renew_dailycount" type="checkbox" name="display_select" value = "3" />Daily Renew</label>
			<label><input id="withdraw_dailycount" type="checkbox" name="display_select" value = "4" />Daily Withdraw</label>
			<label><input id="withdraw_totalcount" type="checkbox" name="display_select" value = "8" />Daily Start</label>
		</div>
		<div id="check_box_Lower" align="center">
			<label><input id="enroll_totalcount" type="checkbox" name="display_select" value = "5" />Total Enroll</label>
			<label><input id="renew_totalcount" type="checkbox" name="display_select" value = "6" />Total Renew</label>
			<label><input id="withdraw_totalcount" type="checkbox" name="display_select" value = "7" />Total Withdraw</label>
			<label><input id="withdraw_totalcount" type="checkbox" name="display_select" value = "9" />Total Start</label>
		</div>
		<div id="button_div" align="center">
			<button type="button" id="b1" >Previous</button>
			<button type="button" id="b2" disabled="true">Next</button>
			<button type="button" id="b3">Change Zoom</button>
		</div>
		<main id="main" class="site-main" role="main">

			<?php
			$data = array(
				'token' => '2F387F509692D3CDC8F25DF8CA7A89AA',
				'content' => 'record',
				'format' => 'json',
				'type' => 'flat',
				'fields' => array('date','websiteviews','enroll_dailycount','enroll_totalcount','renew_dailycount','renew_totalcount','withdraw_dailycount','withdraw_totalcount','start_dailycount','start_totalcount'),
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
	

