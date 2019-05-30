<?php
/**
 * Template Name: Job Listings
 */
?>

    <?php get_header( 'search' ); ?>

    <div class="section">

        <h2 class="pagetitle">

            <small class="rss">
                <a href="<?php echo esc_url( add_query_arg( 'post_type', APP_POST_TYPE, get_bloginfo('rss2_url') ) ); ?>"><i class="icon dashicons-before"></i></a>
            </small>

            <?php printf( __( 'Latest Jobs%s', APP_TD ), ( ! empty( $paged ) && $paged > 1 ? ' ' . sprintf( __( '(page %d)', APP_TD ), $paged ) : '' ) ); ?>
        </h2>


        <div id="job-listings"></div>

        <div class="clear"></div>

    </div><!-- end section -->

    <div class="clear"></div>

</div><!-- end main content -->

<?php get_sidebar();  ?>
