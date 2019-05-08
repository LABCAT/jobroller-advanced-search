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
 * JAS_Post_types Class.
 */
class JAS_Post_types {

	/**
	 * Hook in methods.
	 */
	public static function init() {
		add_action( 'init', [ __CLASS__, 'add_job_listings_rest_support' ], 99 );
        add_action( 'rest_api_init', [ __CLASS__, 'add_job_listings_addtional_rest_fields' ], 10 );

        add_filter( 'archive_template', [ __CLASS__, 'load_job_listings_custom_template' ], 10, 1 );
	}

    /* The "Job Listings" custom post type does not suppoort the "Job Listings" taxonomy by default.
     * so we need to override re-register the "Job Listings" custom post type to provide support for this taxonomy
     */
    public static function add_job_listings_rest_support(){
        global $jr_options;
        // get the slug value for the ad custom post type & taxonomies
    	if ( $jr_options->jr_job_permalink ) {
    		$post_type_base_url = $jr_options->jr_job_permalink;
    	} else {
    		$post_type_base_url = 'jobs';
    	}

        // create the custom post type and category taxonomy for job listings
    	register_post_type(
    		APP_POST_TYPE,
            [
                'labels' => [
        			'name'			=> __( 'Jobs', APP_TD ),
        			'singular_name' => __( 'Job', APP_TD ),
        			'add_new'		=> __( 'Add New', APP_TD ),
        			'add_new_item'  => __( 'Add New Job', APP_TD ),
        			'edit'			=> __( 'Edit', APP_TD ),
        			'edit_item'		=> __( 'Edit Job', APP_TD ),
        			'new_item'		=> __( 'New Job', APP_TD ),
        			'view'			=> __( 'View Jobs', APP_TD ),
        			'view_item'		=> __( 'View Job', APP_TD ),
        			'search_items'	=> __( 'Search Jobs', APP_TD ),
        			'not_found'		=> __( 'No jobs found', APP_TD ),
        			'not_found_in_trash' => __( 'No jobs found in trash', APP_TD ),
        			'parent'		=> __( 'Parent Job', APP_TD ),
        		],
        		'description'	=> __( 'This is where you can create new job listings on your site.', APP_TD ),
        		'public'		=> true,
        		'show_ui'		=> true,
        		'capabilities'	=> [
            		'edit_posts' => 'edit_jobs' // enables job listers to view pending jobs
            	],
        		'map_meta_cap'	=> true,
        		'publicly_queryable' => true,
        		'exclude_from_search' => false,
        		'menu_position' => 8,
        		'has_archive'	=> true,
        		'menu_icon'		=> 'dashicons-portfolio',
        		'hierarchical'	=> false,
        		'rewrite'		=> [
                    'slug' => $post_type_base_url,
                    'with_front' => false
                ], /* Slug set so that permalinks work when just showing post name */
        		'query_var'		=> true,
        		'supports'		=> [
                        'title',
                        'editor',
                        'author',
                        'thumbnail',
                        'excerpt',
                        'trackbacks',
                        'custom-fields',
                        'comments',
                        'revisions',
                        'sticky'
                ],
                'show_in_rest' => true,
        		'rest_base'     => 'jobs'
    		]
    	);

        register_rest_field( APP_POST_TYPE, 'metadata' );
    }

    public static function add_job_listings_addtional_rest_fields(){
        $rest_fields = [
            'listing_type',
            'job_type',
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
        $post_date = $object[ 'post_date' ];
        $post_author = $object[ 'post_author' ];
        switch ($field_name) {
            case 'listing_type':
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
                $job_type = '';
                $tax_array = get_terms(
                    'job_type',
                    [
                        'hide_empty' => '0'
                    ]
                );
                if ( $tax_array && sizeof( $tax_array ) > 0 ) {
                    foreach ( $tax_array as $tax_val ) {
                        if ( is_object_in_term( $post_id, 'job_type', [ $tax_val->term_id ] ) ) {
                            $job_type = '<span class="jtype ' . esc_attr( $tax_val->slug ) . '">' . $tax_val->name . '</span>';
                            break;
                        }
                    }

                }
                return $job_type;
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

    public static function load_job_listings_custom_template( $template ){
        if ( is_post_type_archive ( APP_POST_TYPE ) ) {
            $template = JAS_ABSPATH . 'templates/archive-job_listing.php';
        }
        return $template;
    }
}

JAS_Post_types::init();