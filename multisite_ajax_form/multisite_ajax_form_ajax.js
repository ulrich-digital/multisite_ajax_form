jQuery(document).ready(function ($) {

    $('#new-facility-request').submit( function (e) {

        e.preventDefault();
      
        // grab content
        $my_content = $(".summary").html();

        //  Bedingungen checked?
        if ($('.acf-field[data-name="bedingungen"] .acf-input label').hasClass('selected')) {
            $(".msg_failed").css("display", "none");


            /*
            url: functions.php -> wp_localize_script('block_multisite_ajax_form_ajax', 'multisite_ajax_form' -> use this term
            action: functions.php -> add_action('wp_ajax_multisite_ajax_form_ajax'... -> use this term without wp_ajax_
            security: functions.php -> add_action('wp_ajax_multisite_ajax_form_ajax'... -> use this term without wp_ajax_
            */
            
            $.ajax({
                cache: false,
                type: 'POST',
                url: multisite_ajax_form.ajaxurl,
                data: {
                    action: 'multisite_ajax_form_ajax',
                    security: multisite_ajax_form.ajaxnonce,
                    content: $my_content
                },
                datatype: "html",

                success: function (data, textStatus, XMLHttpRequest) {

                    // Success Nachricht einblenden, nach 5 Sekunden wieder ausblenden
                    $(".msg_success").fadeIn("slow").delay(5000).fadeOut("slow");

                    // Akkordion schliessen
                    $(".multisite_ajax_form .acf-field-accordion.-open").removeClass("-open");
                    $(".multisite_ajax_form .acf-accordion-content").css("display", "none");

                    // Formular-Navigation ausblenden
                    $(".multisite_ajax_form .form_prev_next_container").css("display", "none");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        }else{
            $(".msg_failed").fadeIn("slow").delay(5000).fadeOut("slow");
           
        }
    });
});
