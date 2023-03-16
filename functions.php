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
   Add Frontend JavaScripts
\* =============================================================== */

function ud_enqueue_frontend_scripts(){
    // Multisite-Ajax-Form 
    wp_enqueue_script('block_anlage_rent_form',  get_stylesheet_directory_uri() . "/blocks/multisite_ajax_form/multisite_ajax_form.js", array('jquery'), filemtime(get_template_directory() . "/blocks/multisite_ajax_form/multisite_ajax_form.js"), true);
    wp_enqueue_script('block_anlage_rent_form_ajax',  get_stylesheet_directory_uri() . "/blocks/multisite_ajax_form/multisite_ajax_form.js", array('jquery'), filemtime(get_template_directory() . "/blocks/multisite_ajax_form/multisite_ajax_form_ajax.js"), true);
    wp_localize_script('block_anlage_rent_form_ajax', 'formular_anfrage_js_handler',array('ajaxurl'=> admin_url('admin-ajax.php'),'ajaxnonce'=> wp_create_nonce('my_ajax_validation')));

   
}
add_action('wp_enqueue_scripts', 'ud_enqueue_frontend_scripts');

/* =============================================================== *\ 
   AJAX Anlage anfragen
\* =============================================================== */
add_action('wp_ajax_anlage_anfragen_ajax', 'anlage_anfragen_ajax_callback');
add_action('wp_ajax_nopriv_anlage_anfragen_ajax', 'anlage_anfragen_ajax_callback');
function anlage_anfragen_ajax_callback() {

    check_ajax_referer('my_ajax_validation', 'security');

    $my_content = $_POST['content'];
    //$my_content = '<div style="display:flex"><span>erstens</span><span>zweitens</span></div>';
    $to = 'support@ulrich.digital';
    if(get_field("e-mail-anlage-anfragen-formular", "options")){
        $to = get_field("e-mail-anlage-anfragen-formular", "options");
    }
    if(get_field("entwicklermodus", "options")):
        if(get_field("dev-e-mail-anlage-anfragen-formular", "options")):
            $to = get_field("dev-e-mail-anlage-anfragen-formular", "options");
        endif;
    endif;

    $subject = 'Anlage-Anfrage';
    $body = $my_content;
    $headers = array('Content-Type: text/html; charset=UTF-8');
    
    wp_mail($to, $subject, $body, $headers);
    wp_die();
}
