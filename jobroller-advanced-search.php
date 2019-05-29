<?php
/**
 * Plugin Name: JobRoller Advanced Search
 * Plugin URI: http://rocketship.co.nz
 * Description: Replaces jobs page with react based functionality
 * Version: 0.0.1
 * Author: Shane Watters
 * Author URI: http://rocketship.co.nz
 * Requires at least: 4.9
 * Tested up to: 4.9
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

if ( ! class_exists( 'JobRollerAdvancedSearch' ) ) {

    /**
     * Main JobRollerAdvancedSearch Class.
     *
     * @class JobRollerAdvancedSearch
     * @version	0.0.1
     */
    final class JobRollerAdvancedSearch {


        /**
         * JobRollerAdvancedSearch Constructor.
         */
        public function __construct()
        {
            $this->define_constants();
            $this->includes();
        }

        /**
         * Define JRE Constants.
         */
        private function define_constants() {
            $this->define( 'JAS_ABSPATH', dirname( __FILE__ ) . '/' );
            $this->define( 'JAS_URL', plugin_dir_url( __FILE__ ) );
        }

        /**
         * Define constant if not already set.
         *
         * @param  string $name
         * @param  string|bool $value
         */
        private function define( $name, $value ) {
            if ( ! defined( $name ) ) {
                define( $name, $value );
            }
        }

        /**
         * What type of request is this?
         *
         * @param  string $type admin, ajax, cron or frontend.
         * @return bool
         */
        private function is_request( $type ) {
            switch ( $type ) {
                case 'admin' :
                    return is_admin();
                case 'ajax' :
                    return defined( 'DOING_AJAX' );
                case 'cron' :
                    return defined( 'DOING_CRON' );
                case 'frontend' :
                    return ( ! is_admin() || defined( 'DOING_AJAX' ) ) && ! defined( 'DOING_CRON' );
            }
        }

        /**
         * Include required core files used in admin and on the frontend.
         */
        public function includes()
        {
            include_once( JAS_ABSPATH . 'includes/class-jas-job-archive-extensions.php' );

            if( $this->is_request( 'frontend' ) ){
                include_once( JAS_ABSPATH . 'includes/class-jas-frontend-scripts.php' );
            }
        }

    }

}

new JobRollerAdvancedSearch();
