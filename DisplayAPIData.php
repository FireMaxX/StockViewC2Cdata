<?php /* Template Name: Data_Display V1.2 API */ ?>
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


    	<script type='text/javascript' src="<?php echo get_template_directory_uri(); ?>/js/Chart.js"></script>

		</main><!-- .site-main -->
	</div><!-- .content-area -->
	<div id="chart_div" align="center"></div>
	<div id="button_div" align="center">
		<button id="b1" disabled="true">Previous</button>
		<button id="b2" disabled="true">Next</button>
		<button id="b3">Change Zoom</button>
	</div>
<?php get_footer(); ?>

