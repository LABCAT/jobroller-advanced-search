<?php
/**
 * Handle frontend scripts
 *
 * @author   Rocketship Multimedia
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
		add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_scripts' ] );
	}


    public function enqueue_scripts() {
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

    }
}

JAS_Frontend_Scripts::init();
