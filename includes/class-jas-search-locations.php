<?php
/**
 * @author MySite Digital
 * @package JobRollerAdvancedSearch/Classes
 * @version  1.0.0
 */


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * JAS_Search_Locations class.
 * Useful reference:
 * https://github.com/stuttter/wp-term-order/
 */
class JAS_Search_Locations {

    private $taxonomy_slug = 'location';
     /**
     * Constructor.
     */
    public function __construct() {
        add_action( 'init', [ $this, 'register_taxonomy' ] );
        
        //add extra fields to the location taxonomy
        add_action( $this->taxonomy_slug . '_add_form_fields', [ $this, 'add_location_order_meta_field' ] );
        add_action( $this->taxonomy_slug . '_edit_form_fields', [ $this, 'add_location_order_meta_field' ] );

        //save extra fields for the location taxonomy
        add_action( 'edited_' . $this->taxonomy_slug , [ $this, 'save_location_order_meta_field' ], 10, 2);
        add_action( 'created_' . $this->taxonomy_slug, [ $this, 'save_location_order_meta_field' ], 10, 2);

        add_filter( 'manage_edit-' . $this->taxonomy_slug . '_columns', [ $this, 'add_sort_order_column' ] );
        add_filter( 'manage_' . $this->taxonomy_slug . '_custom_column', [ $this, 'populate_sort_order_column' ], 10, 3 );
        add_filter( 'manage_edit-' . $this->taxonomy_slug . '_sortable_columns', [ $this, 'sortable_columns' ] );
        add_filter( 'terms_clauses', [ $this, 'sort_locations_by_order' ], 10, 3 );
    }

    public function register_taxonomy() {

        register_taxonomy(
            $this->taxonomy_slug,
            APP_POST_TYPE,
            [
                'public' => true,
                'labels' => array(
                    'name' => 'Location',
                    'singular_name' => 'Locations',
                    'menu_name' => 'Search Locations',
                    'search_items' => 'Search Locations',
                    'popular_items' => 'Popular Locations',
                    'all_items' => 'All Locations',
                    'edit_item' => 'Edit Location',
                    'update_item' => 'Update Location',
                    'add_new_item' => 'Add New Location',
                    'new_item_name' => 'New Location',
                    'separate_items_with_commas' => 'Separate Locations with commas',
                    'add_or_remove_items' => 'Add or remove Locations',
                    'choose_from_most_used' => 'Choose from the most popular Locations',
                )
            ]
        );
    }

    public function add_location_order_meta_field( $term_obj ){
        $order = 0;
        if( is_a( $term_obj, 'WP_Term' ) ){
            $order = get_term_meta( $term_obj->term_id, 'order', true );
        }
        ?>

        <tr class="form-field form-required term-name-wrap">
            <th scope="row">
                <label for="order">Order</label>
            </th>
            <td>
                <input name="order" id="order" type="number" value="<?php echo esc_attr( $order ); ?>" step="1" min="0" required />
                <p class="description">Order of location displayed in the search form (0 will be at the top of the list)</p>
            </td>
        </tr>

        <?php
    }

    public function save_location_order_meta_field( $term_id ){
        if ( isset( $_POST[ 'order' ] ) ) {
            update_term_meta( $term_id, 'order', intval( $_POST[ 'order' ] ) );
        }
    }

    public function add_sort_order_column($columns){
        $columns['order'] = 'Order';
        return $columns;
    }

    public function populate_sort_order_column( $content, $column_name, $term_id ){
        $term = get_term( $term_id, $this->taxonomy_slug );
        switch ($column_name) {
            case 'order':
                $content = get_term_meta( $term_id, 'order', true ) ?: 0;
                break;
            default:
                break;
        }
        return $content;
    }

    public function sortable_columns( $columns = [] ) {
        $columns['order'] = 'order';
		return $columns;
    }
    
    public function sort_locations_by_order( $pieces, $taxonomies, $args ) {
        global $pagenow, $wpdb;

        if( ! is_admin() ) {
            return $pieces;
        }

        if( 
            is_admin() 
            && $pagenow == 'edit-tags.php' 
            && $taxonomies[0] == $this->taxonomy_slug 
            && ( isset( $_GET[ 'orderby' ] ) && $_GET[ 'orderby' ] == 'order' ) 
        ) {
            $pieces['join']     .= ' INNER JOIN ' . $wpdb->termmeta . ' AS tm ON t.term_id = tm.term_id ';
            $pieces['where']    .= ' AND tm.meta_key = "order"'; 
            $pieces['orderby']   = ' ORDER BY tm.meta_value ';
            $pieces['order']     = isset( $_GET['order'] ) ? $_GET['order'] : "DESC";
        }
        return $pieces;
    }
}

new JAS_Search_Locations();
