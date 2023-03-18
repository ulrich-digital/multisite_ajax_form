jQuery(document).ready(function ($) {

    $("form[id*='multipage-ajax-form-']").submit(function (e) {

        e.preventDefault();
      
        $this = $(this);
        // grab content
        $my_content = $(this).find(".summary").html();

        // Message-Container after form
        var my_msg_container = $(this).next(".msg_container");
        console.log("hey" + my_msg_container);

        //  Bedingungen checked?
        if ($(this).find('.acf-field[data-name="bedingungen"] .acf-input label').hasClass('selected')) {
            $(my_msg_container).find(".msg_failed").css("display", "none");


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
                    $(my_msg_container).find(".msg_success").fadeIn("slow").delay(5000).fadeOut("slow");

                    // close accordion 
                    $this.find(".acf-field-accordion.-open").removeClass("-open");
                    $this.find(".acf-accordion-content").css("display", "none");

                    // hide form navigation
                    $this.find(".form_prev_next_container").css("display", "none");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        }else{
            // show failed container
            $(my_msg_container).find(".msg_failed").fadeIn("slow").delay(5000).fadeOut("slow");
           
        }
    });
});
