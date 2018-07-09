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


    	<script type='text/javascript' src="<?php echo get_template_directory_uri(); ?>/Draw.js"></script>

		</main><!-- .site-main -->
	</div><!-- .content-area -->
	<div id="chart_div" align="center"></div>
	<div id="button_div" align="center">
		<button id="b1" disabled="true">Previous</button>
		<button id="b2" disabled="true">Next</button>
		<button id="b3">Change Zoom</button>
	</div>
<?php get_footer(); ?>

