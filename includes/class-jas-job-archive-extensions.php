<?php
/**
 * Post Types
 *
 * @author   Rocketship Multimedia
 * @package JobRollerAdvancedSearch/Classes
 * @version  1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * JAS_Job_Archive_Extensions Class.
 */
class JAS_Job_Archive_Extensions {


    /**
     * Hook in methods.
     */
    public function __construct() {
        // Add a filter to the save post to inject out template into the page cache
		add_filter( 'wp_insert_post_data', array( $this, 'register_templates' ) );
        add_filter( 'template_include', [ __CLASS__, 'load_job_search_custom_template' ], 999 );
    }

    /**
     * Hook in methods.
     */
    public static function init() {
        add_action( 'rest_api_init', [ __CLASS__, 'add_job_listings_addtional_rest_fields' ], 99 );
        add_action( 'pre_get_posts', [ __CLASS__, 'alter_job_archive_query' ], 99 );

        add_filter( 'register_post_type_args', [ __CLASS__, 'add_rest_support_to_job_listing_post_type' ], 99, 2 );
        add_filter( 'register_taxonomy_args', [ __CLASS__, 'hide_job_listing_taxonomies_from_public' ], 99, 2 );
        add_filter( 'archive_template', [ __CLASS__, 'load_job_listings_custom_template' ], 10, 1 );
    }

    /*
     *
     * @param $args       array    The original CPT args.
     * @param $post_type  string   The CPT slug.
     *
     * @return array
     */
    public function add_rest_support_to_job_listing_post_type( $args, $post_type ) {
    	if ( APP_POST_TYPE !== $post_type ) {
    		return $args;
    	}
    	$new_args = [
            'show_in_rest' => true,
            'rest_base'     => 'jobs'
    	];
    	// Merge args together.
    	return array_merge( $args, $new_args );
    }

    /*
     *
     * @param $args       array    The original taxonomy args.
     * @param $taxonomy  string   The taxonomy slug.
     *
     * @return array
     */
    public function hide_job_listing_taxonomies_from_public( $args, $taxonomy ) {
        // Only target the taxonomys used by job+listing post type
        $job_listing_taxonomies = [
            APP_TAX_CAT,
            APP_TAX_TYPE,
            APP_TAX_TAG,
            APP_TAX_SALARY
        ];
        if ( ! in_array( $taxonomy, $job_listing_taxonomies ) ){
            return $args;
        }

        $args[ 'public' ] = false;

        return $args;
    }

    public static function add_job_listings_addtional_rest_fields(){
        $rest_fields = [
            'key',
            'isShown',
            'isFeatured',
            'listingType',
            'job_type',
            'job_salary',
            'job_category',
            'job_author',
            'job_location',
            'job_date',
            'job_thumbnail'
        ];

        foreach( $rest_fields as $rest_field ){
            register_rest_field(
                APP_POST_TYPE,
                $rest_field,
                [
                    'get_callback' => [ __CLASS__, 'get_rest_data' ]
                ]
            );
        }
    }

    public static function get_rest_data( $object, $field_name, $request ){
        $post_id = $object[ 'id' ];
        $post_date = isset( $object[ 'post_date' ] ) ? $object[ 'post_date' ] : $object[ 'date' ];
        $post_author = isset( $object[ 'post_author' ] ) ? $object[ 'post_author' ] : $object[ 'author' ];
        switch ($field_name) {
            case 'key':
                return $post_id;
                break;
            case 'isShown':
                return true;
                break;
            case 'isFeatured':
                $is_featured = get_post_meta( $post_id, JR_ITEM_FEATURED_LISTINGS, true );
                return $is_featured ? true : false;
                break;
            case 'listingType':
                $type_id = jr_get_the_job_tax( $post_id, APP_TAX_TYPE );
                $voluntary_job_types_array = [ 'voluntary' ];
                $voluntary_term_id = get_term_by( 'slug', 'voluntary', 'job_type' )->term_id;
                //get all job types that are descendant of the voluntary job type
                $voluntary_job_types = get_terms(
                    [
                        'taxonomy' => 'job_type',
                        'hide_empty' => '0',
                        'parent' => $voluntary_term_id
                    ]
                );

                $job_term = get_term( $type_id, APP_TAX_TYPE );
                if ( $voluntary_job_types && sizeof( $voluntary_job_types ) > 0 ) {
                    foreach ( $voluntary_job_types as $type ){
                        array_push( $voluntary_job_types_array, esc_attr( $type->slug ) );
                    }
                }

                if( in_array( $job_term->slug, $voluntary_job_types_array ) ){
                    $listing_type = 'voluntary';
                }
                else {
                    $listing_type = 'paid';
                }
                return $listing_type;
                break;
            case 'job_type':
                $type = [];
                $job_types = get_the_terms( $post_id, APP_TAX_TYPE );
                if ( $job_types &&  ! is_wp_error( $job_types ) ) {
                    foreach ( $job_types as $job_type ) {
                        $type = [
                            'key' => $job_type->slug,
                            'slug' => $job_type->slug,
                            'label' => $job_type->name
                        ];
                        break;
                    }
                }
                return $type;
                break;
            case 'job_salary':
                $salary = [];
                $job_salaries = get_the_terms( $post_id, APP_TAX_SALARY );
                if ( $job_salaries &&  ! is_wp_error( $job_salaries ) ) {
                    foreach ( $job_salaries as $job_salary ) {
                        $salary = [
                            'key' => $job_salary->slug,
                            'slug' => $job_salary->slug,
                            'label' => $job_salary->name
                        ];
                        break;
                    }
                }
                return $salary;
                break;
            case 'job_category':
                $category = [];
                $job_categories = get_the_terms( $post_id, APP_TAX_CAT );
                if ( $job_categories &&  ! is_wp_error( $job_categories ) ) {
                    foreach ( $job_categories as $job_category ) {
                        $parent_id = $job_category->parent;
                        $category = [
                            'slug' => $job_category->slug,
                            'label' => $job_category->name,
                            'key' => $parent_id ? self::get_high_level_job_cat( $parent_id )->slug : $job_category->slug,
                            'parentSlug' => $parent_id ? self::get_high_level_job_cat( $parent_id )->slug : $job_category->slug,
                            'parentLabel' => $parent_id ? self::get_high_level_job_cat( $parent_id )->name : $job_category->name
                        ];
                        break;
                    }
                }
                return $category;
                break;
            case 'job_author':
                $company_name = wptexturize( strip_tags( get_post_meta( $post_id , '_Company', true ) ) );
                return $company_name;
                break;
            case 'job_location':
                $address = get_post_meta( $post_id, 'geo_short_address', true );
                if( $address === 'Overseas' ){
                    $address = get_post_meta( $post_id, 'overseas_address', true );
                    if( ! $address ){
                        $address = 'Overseas';
                    }
                }
                else if( ! $address ){
                    $address = 'Anywhere';
                }
                return esc_html( $address );
                break;
            case 'job_date':
                $date =
                    '<strong>' .
                        date_i18n(
                            __( 'j M', APP_TD ),
                            strtotime( $post_date )
                        ) .
                    '</strong>'.
                    '<span class="year">' .
                        date_i18n(
                            __( 'Y', APP_TD ),
                            strtotime( $post_date )
                        ) .
                    '</span>';
                return $date;
                break;
            case 'job_thumbnail':
                $img = '';
                $file = get_attached_file( get_post_thumbnail_id( get_the_ID() ) );
                if( file_exists( $file ) ){
                    $img = get_the_post_thumbnail( $post_id, 'thumbnail', array ( 'class' => 'jr_fx_job_listing_thumb' ) );
                }
                return $img;
                break;
        }
    }

    // Determine the top-most parent of a term
    public static function get_high_level_job_cat( $parent_id ) {
        while ( $parent_id != '0' ) {
            $parent = get_term( $parent_id, APP_TAX_CAT );
            $parent_id  = $parent->parent;
        }
        return $parent;
    }

    public static function alter_job_archive_query( $query ) {
        // don't run on the backend
        if ( is_admin() ){
            return;
        }

        if( $query->get( 'post_type' ) == APP_POST_TYPE ) {

            if( $query->is_main_query() ){
                if( $query->get( 'paged' ) ){
                    $query->set_404();
                }
            }

            if( defined('REST_REQUEST') && REST_REQUEST ){
                $query->set( 'meta_key', JR_ITEM_FEATURED_LISTINGS );
                $query->set( 'orderby', 'meta_value_num date' );
                $query->set( 'order', 'DESC DESC' );
            }

        }
        return $query;
    }

    public static function load_job_listings_custom_template( $template ){
        if ( is_post_type_archive ( APP_POST_TYPE ) ) {
            $template = JAS_ABSPATH . 'templates/archive-job_listing.php';
        }
        return $template;
    }

    /**
	 * Adds our template to the pages cache in order to trick WordPress
	 * into thinking the template file exists where it doens't really exist.
	 */
	public function register_templates( $atts ) {

		// Create the key used for the themes cache
		$cache_key = 'page_templates-' . md5( get_theme_root() . '/' . get_stylesheet() );

		// Retrieve the cache list.
		// If it doesn't exist, or it's empty prepare an array
		$templates = wp_get_theme()->get_page_templates();

		if ( empty( $templates ) ) {
			$templates = [];
		}

		// New cache, therefore remove the old one
		wp_cache_delete( $cache_key , 'themes');

		// Now add our template to the list of templates by merging our templates
		// with the existing templates array from the cache.
		$templates = array_merge( $templates, $this->templates );

		// Add the modified cache to allow WordPress to pick it up for listing
		// available templates
		wp_cache_add( $cache_key, $templates, 'themes', 1800 );

		return $atts;

	}

    public static function load_job_search_custom_template( $template ){
        var_dump('jas');
        var_dump($template);
        // Get global post
		global $post;

		// Return template if post is empty
		if ( ! $post ) {
			return $template;
		}

        $requested_template = get_post_meta(  $post->ID, '_wp_page_template', true);

        var_dump($requested_template);


		// // Return default template if we don't have a custom one defined
		// if ( ! isset( $this->templates[ $requested_template ] ) ) {
		// 	return $template;
		// }
        //
        // $original_template = DINING_HUB_PLUGIN_DIR . '/templates/' . $requested_template;
        // $themed_template = get_stylesheet_directory() . '/' . $requested_template;
        //
        // if( file_exists($themed_template) ){
        //     $template = $themed_template;
        // }
        // else if( file_exists($original_template) ){
        //     $template = $original_template;
        // }

        return $template;
    }
}

new JAS_Job_Archive_Extensions();
JAS_Job_Archive_Extensions::init();
