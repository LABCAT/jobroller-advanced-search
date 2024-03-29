<?php
/**
 * Post Types
 *
 * @author   MySite Digital
 * @package JobRollerAdvancedSearch/Classes
 * @version  1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * JAS_Job_Listing_Extensions Class.
 */
class JAS_Job_Listing_Extensions {


    /**
     * Hook in methods.
     */
    public static function init() {
        add_action( 'wp_insert_post', [ __CLASS__, 'add_featured_listing_meta' ], 99, 3 );
    }


    public static function add_featured_listing_meta( $post_ID, $post, $update ) {

       $featured = get_post_meta( $post_ID, JR_ITEM_FEATURED_LISTINGS, true );

       if( $post->post_type == APP_POST_TYPE && ! $featured ){
           update_post_meta( $post_ID, JR_ITEM_FEATURED_LISTINGS, 0 );
       }
   }

}

JAS_Job_Listing_Extensions::init();
