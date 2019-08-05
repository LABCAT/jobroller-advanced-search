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

        $search_locations = [];

        $terms = get_terms( 
            [
                'taxonomy' => 'location',
                'hide_empty' => false,
                'orderby' => 'meta_value_num',
                'meta_key' => 'order',
                'order' => 'asc',
            ]
        );

        foreach ( $terms as $term ) {
            $search_locations[] = $term->name;
        }

        wp_localize_script(
            'react-jobs-archive',
            'RJA',
            [
                'siteURL' => get_site_url(),
                'searchLocations' => json_encode( $search_locations )
            ]
        );

    }
}

JAS_Frontend_Scripts::init();
