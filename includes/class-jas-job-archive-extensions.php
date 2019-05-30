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
    public static function init() {
        add_action( 'rest_api_init', [ __CLASS__, 'add_job_listings_addtional_rest_fields' ], 99 );
        add_action( 'pre_get_posts', [ __CLASS__, 'disable_job_archive_pagination' ], 99 );

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
                return $address;
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
                return  get_the_post_thumbnail( $post_id, 'thumbnail', array ( 'class' => 'jr_fx_job_listing_thumb' ) );
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

    public static function disable_job_archive_pagination( $query ) {
        // don't run on the backend
        if ( is_admin() ){
            return;
        }

        if( $query->is_main_query() && $query->get( 'post_type' ) == APP_POST_TYPE ) {

            if( $query->get( 'paged' ) ){
                $query->set_404();
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
}

JAS_Job_Archive_Extensions::init();
