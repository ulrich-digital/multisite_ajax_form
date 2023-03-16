jQuery(document).ready(function ($) {

    $('#new-facility-request').submit( function (e) {

        e.preventDefault();
      
        // grab content
        $my_content = $(".summary").html();

        //  Bedingungen checked?
        if($('#acf-field_63ea24d063a82-field_63ea298350d3a-ja').is(':checked')){
            $(".msg_failed").css("display", "none");

            $.ajax({
                cache: false,
                type: 'POST',
                url: formular_anfrage_js_handler.ajaxurl,
                data: {
                    action: 'anlage_anfragen_ajax',
                    title: formular_anfrage_js_handler.title,
                    security: formular_anfrage_js_handler.ajaxnonce,
                    content: $my_content
                },
                datatype: "html",

                success: function (data, textStatus, XMLHttpRequest) {

                    // Success Nachricht einblenden, nach 5 Sekunden wieder ausblenden
                    $(".msg_success").fadeIn("slow").delay(5000).fadeOut("slow");

                    // Akkordion schliessen
                    $(".rent_form .acf-field-accordion.-open").removeClass("-open");
                    $(".rent_form .acf-accordion-content").css("display", "none");

                    // Formular-Navigation ausblenden
                    $(".rent_form .form_prev_next_container").css("display", "none");
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
