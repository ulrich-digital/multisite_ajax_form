/* =============================================================== *\
   register ACF-Fields as Block
\* =============================================================== */
function uldi_load_blocks() {
    register_block_type(dirname(__FILE__) . '/blocks/multisite_ajax_form');
}
add_action('acf/init', 'uldi_load_blocks');

/* =============================================================== *\
   add ACF Form Head
\* =============================================================== */
function uldi_add_acf_form_head(){
	if(!is_admin()){
		// wird bei allen Seiten geladen, keine andere Lösung möglich
		acf_form_head();
	}
}
add_action('init', 'uldi_add_acf_form_head', 10, 1);

/* =============================================================== *\
   add Frontend JavaScripts
\* =============================================================== */
function ud_enqueue_frontend_scripts(){
    // Multisite-Ajax-Form 
    wp_enqueue_script('block_multisite_ajax_form',  get_stylesheet_directory_uri() . "/blocks/multisite_ajax_form/multisite_ajax_form.js", array('jquery'), filemtime(get_template_directory() . "/blocks/multisite_ajax_form/multisite_ajax_form.js"), true);
    wp_enqueue_script('block_multisite_ajax_form_ajax',  get_stylesheet_directory_uri() . "/blocks/multisite_ajax_form/multisite_ajax_form_ajax.js", array('jquery'), filemtime(get_template_directory() . "/blocks/multisite_ajax_form/multisite_ajax_form_ajax.js"), true);
    wp_localize_script('block_multisite_ajax_form_ajax', 'multisite_ajax_form',array('ajaxurl'=> admin_url('admin-ajax.php'),'ajaxnonce'=> wp_create_nonce('multisite_ajax_form_validation')));
}
add_action('wp_enqueue_scripts', 'ud_enqueue_frontend_scripts');

/* =============================================================== *\ 
   Multisite AJAX Form > AJAX Action
\* =============================================================== */
add_action('wp_ajax_multisite_ajax_form_ajax', 'multisite_ajax_form_ajax_callback');
add_action('wp_ajax_nopriv_multisite_ajax_form_ajax', 'multisite_ajax_form_ajax_callback');
function multisite_ajax_form_ajax_callback() {

    // see in this file: wp_localize_script('block_multisite_ajax_form_ajax', 'multisite_ajax_form',array('ajaxurl'=> admin_url('admin-ajax.php'),'ajaxnonce'=> wp_create_nonce('multisite_ajax_form_validation')));
    check_ajax_referer('multisite_ajax_form_validation', 'security');

    $my_content = $_POST['content'];
    
    $to = 'support@ulrich.digital';
    $subject = 'Anlage-Anfrage';
    $body = $my_content;
    $headers = array('Content-Type: text/html; charset=UTF-8');
    
    wp_mail($to, $subject, $body, $headers);
    wp_die();
}
