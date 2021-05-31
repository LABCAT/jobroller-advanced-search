<?php
/**
 * Handle frontend scripts
 *
 * @author  MySite Digital
 * @package JobRollerAdvancedSearch/Classes
 * @version  1.0.0
 */


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Frontend scripts class.
 */
class JAS_Frontend_Scripts {

    /**
     * Hook in methods.
     */
    public static function init() {
        add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_styles' ], 999 );
        add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_scripts' ], 999 );
    }

    public static function enqueue_styles(){
        $css = 'assets/css/jobs-archive.min.css';
        $cache_bust = '?v='.filemtime( JAS_ABSPATH . $css);
        $style_location = JAS_URL  . $css . $cache_bust;

        wp_enqueue_style(
            'react-jobs-archive',
            $style_location,
            [],
            NULL
        );
    }

    public static function enqueue_scripts() {
        global $jr_options;
        $js = 'assets/js/jobs-archive.min.js';
        $cache_bust = '?v='.filemtime( JAS_ABSPATH . $js);
        $script_location = JAS_URL  . $js . $cache_bust;

        wp_enqueue_script(
            'react-jobs-archive',
            $script_location,
            [],
            false,
            true
        );

        $search_locations = JAS_Search_Locations::get_available_search_locations( true );

        wp_localize_script(
            'react-jobs-archive',
            'RJA',
            [
                'siteURL' => esc_url( get_site_url() ),
                'alertsURL' => esc_url( get_permalink( JR_Dashboard_Page::get_id() ) . '#alerts' ),
                'searchLocations' => json_encode( $search_locations ),
                'salaryTaxonomyEnabled' => $jr_options->jr_enable_salary_field,
            ]
        );

    }
}

JAS_Frontend_Scripts::init();
