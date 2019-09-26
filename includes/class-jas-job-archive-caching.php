<?php
/**
 * Post Types
 *
 * @author  MySite Digital
 * @package JobRollerAdvancedSearch/Classes
 * @version  1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * JAS_Job_Archive_Caching Class.
 */
class JAS_Job_Archive_Caching {

    /**
     * Hook in methods.
     */
    public static function init() {
        add_action( 'template_redirect', [ __CLASS__, 'intercept_archive_template' ], 1 );
        add_action( 'save_post', [ __CLASS__, 'delete_transient' ], 1 );
    }

   public static function intercept_archive_template( $template ){
        if ( is_post_type_archive ( APP_POST_TYPE ) ) {
            $is_cached = get_transient( 'jas_job_archive_cache' );

            if ( $is_cached === false || $is_cached < strtotime( date( "Y-m-d H:m:s" ) ) ) {
                $is_cached = self::set_transient();  
            }
            else {

            }
            if( $is_cached ) {
                ob_start(
                    function( $html ){
                        return file_get_contents( JAS_ABSPATH .'templates/archive-job_listing.html' );
                    }
                );
            }
        }
        return $template;
    }

    public static function set_transient(){
        $write = self::render_job_archive_to_file();
        if($write){
            $write = set_transient( 'jas_job_archive_cache', strtotime( '+1 day', strtotime( date( "Y-m-d H:m:s" ) ) ) );
        }
        return $write;
    }

    public static function delete_transient( $post ) {
        global $post; 
        if ( $post->post_type != APP_POST_TYPE ) {
            return;
        }
        if( $post->post_status === 'publish' ){
            delete_transient( 'jas_job_archive_cache' );
        }
    }

    public static function render_job_archive_to_file(){
        $content = self::get_content();
        $file_size = file_put_contents( JAS_ABSPATH .'templates/archive-job_listing.html', $content );
        return $file_size;
    }

    public static function get_content(){
        return include_once( JAS_ABSPATH .'templates/wrapper.php' );
    }
}

//JAS_Job_Archive_Caching::init();
