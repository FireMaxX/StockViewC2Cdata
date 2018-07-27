<?php /* Data_Display V1.2 Using RedCap API */ ?>
<?php /* NOTE: Google Chart API loaded at header.php */ ?>

<link rel="stylesheet" href="css/checkbox.css">
<!--Load jQuery and plugins-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="./js/jquery.mousewheel.js"></script>
<!--Load Google Chart Support-->
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script type='text/javascript' src="./js/Chart.js"></script>

<div id="dashboard_div">	<!-- Interactive Chart Widget -->
	<div id="top_bar">
		<div id="left_bar">
			<div id="check_box_div">
				<div class="checkbox_group_title">
					<strong>Daily</strong>
				</div>
				<div name="Daily" class="checkbox_group" align="right">
					<div class="el-checkbox">
						<span class="tags">Viewers</span>
						<label class="el-switch el-switch-blue">
							<input id="websiteviews" type="checkbox" name="display_select" value = "1" checked="checked" disabled="false"/>
							<span class="el-switch-style"></span>
						</label>
					</div>
					<div class="el-checkbox">
						<span class="tags">Enroll</span>
						<label class="el-switch el-switch-red">
							<input id="enroll_dailycount" type="checkbox" name="display_select" value = "2" />
							<span class="el-switch-style"></span>
						</label>
					</div>				
					<div class="el-checkbox">
						<span class="tags">Renew</span>
						<label class="el-switch el-switch-orange">
							<input id="renew_dailycount" type="checkbox" name="display_select" value = "3" />
							<span class="el-switch-style"></span>
						</label>
					</div>
					<div class="el-checkbox">
						<span class="tags">Withdraw</span>
						<label class="el-switch el-switch-green">
							<input id="withdraw_dailycount" type="checkbox" name="display_select" value = "4" />
							<span class="el-switch-style"></span>
						</label>
					</div>
					<div class="el-checkbox">
						<span class="tags">Start</span>
						<label class="el-switch el-switch-purple">
							<input id="start_dailycount" type="checkbox" name="display_select" value = "5" />
							<span class="el-switch-style"></span>
						</label>
					</div>
				</div>
				<div class="checkbox_group_title">
					<strong>Total</strong>
				</div>
				<div name="Total" class="checkbox_group" align="right">	
					<div class="el-checkbox">
						<span class="tags">Enroll</span>
						<label class="el-switch el-switch-Pink">
							<input id="enroll_totalcount" type="checkbox" name="display_select" value = "6" />
							<span class="el-switch-style"></span>
						</label>
					</div>
					<div class="el-checkbox">
						<span class="tags">Renew</span>
						<label class="el-switch el-switch-indigo">
							<input id="renew_totalcount" type="checkbox" name="display_select" value = "7" />
							<span class="el-switch-style"></span>
						</label>
					</div>
					<div class="el-checkbox">
						<span class="tags">Withdraw</span>
						<label class="el-switch el-switch-grass">
							<input id="withdraw_totalcount" type="checkbox" name="display_select" value = "8" />
							<span class="el-switch-style"></span>
						</label>
					</div>
					<div class="el-checkbox">
						<span class="tags">Start</span>
						<label class="el-switch el-switch-brown">
							<input id="start_totalcount" type="checkbox" name="display_select" value = "9" />
							<span class="el-switch-style"></span>
						</label>
					</div>
				</div>
			</div>	<!-- End of Check_Boxs Div -->
		</div>	<!-- End of Left_Bar -->

		<div id="right_Bar">
			<div id="chart_div" style="width:100%; height:100%"></div>
		</div>
	</div>	<!-- End of Top_Bar -->
	
	<div id="bottom_bar">
		<div id="button_div" align="center">
			<button type="button" id="b1" class="myButton">Previous</button>
			<button type="button" id="b2" class="myButton" disabled="true">Next</button>
			<button type="button" id="b3" class="myButton">Change Zoom</button>
		</div>
	</div>
</div><!-- dashboard_div -->

<!-- Main: JS/JQ Application -->
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
	?>
	<script>
		var json = <?php echo $records_json; ?>; 	//Don't forget the extra semicolon!
	</script>
	
</main><!-- .site-main -->
	