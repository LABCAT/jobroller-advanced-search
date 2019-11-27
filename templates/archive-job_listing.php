<?php
/**
 * Template Name: Job Listings
 */
?>

    <form action="/jobs/" method="get" id="searchform">
		<div class="search-wrap"  style="max-width: none;">
            <div>
                <input type="text" title="" name="s" class="text" placeholder="Job Keyword" value="<?php echo esc_attr( get_search_query() ); ?>" style="width: calc(100% - 36px) !important; height: 30px;">
                <button type="submit" title="" class="submit" style="margin-top: 3px;">
                    <svg class="search" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32">
                        <path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path>
                    </svg>
                </button>
                <input type="hidden" name="ptype" value="job_listing">
            </div>
        </div><!-- end search-wrap -->
	</form>
   
    <!--[if lte IE 8]> 
        <div class="notice error" style="clear:both;">
            <div>
                <i class="icon dashicons-before"></i>
                <p>
                    The Do Good Jobs website doesn't support Internet Explorer version 8 or earlier, and your browser may not be able to display jobs on this website.
                    For a faster, safer browsing experience, please <a href="https://updatemybrowser.org/" target="_blank">upgrade your web browser</a> today."       
                </p>                   
            </div>
        </div>
    <![endif]-->

    <div id="job-listings"></div>
    
    
    <div class="clear"></div>

</div><!-- end main content -->

<?php get_sidebar();  ?>
