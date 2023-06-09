jQuery(document).ready(function($){
    
    if($(".multisite_ajax_form").length > 0){
        
        $(".multisite_ajax_form").each(function (i) {

            $(this).attr("id", "multipage-ajax-form-" + (i + 1));

            /* =============================================================== *\ 
                Show-hide Form
            \* =============================================================== */
            // close accordion, if is open
            $(this).find(".acf-field-accordion").removeClass('-open');
            $(this).find(".acf-field-accordion").closest("form").removeClass("form_is_open");
            $(this).find(".acf-accordion-content").css("display", "none");

            // show hide toggle
            $(this).find(".acf-field-accordion .acf-accordion-title").on('click', function () {
                if ($(this).closest(".acf-field-accordion").hasClass("-open")) {
                    $(this).closest("form").removeClass("form_is_open");
                    $(".form_prev_next_container").css("display", "none");
                    $(".msg_container").css("display", "none");
                } else {
                    $(this).closest("form").addClass("form_is_open");
                    var this_form = $(this).closest(".multisite_ajax_form");
                    prev_next_step('init', this_form);
                    $(".form_prev_next_container").css("display", "flex");
                    $(".msg_container").css("display", "flex");
                }
            });

            //Move Submit Button in Container
            $(this).find('.acf-accordion-title').on("click", function(){
                $(this).closest(".multisite_ajax_form").find(".acf-form-submit input").appendTo($(this).closest(".multisite_ajax_form").find(".form_prev_next_container"));
            });

            // Placeholder Texts
            var d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var output = (('' + day).length < 2 ? '0' : '') + day + "." + (('' + month).length < 2 ? '0' : '') + month + '.' + d.getFullYear();
            $(this).find('div[data-name="datum"] input').attr("placeholder", output);
            $(this).find('div[data-name="von"] input').attr("placeholder", "00:00");
            $(this).find('div[data-name="bis"] input').attr("placeholder", "00:00");

            /* add "Aufräumen" text to group field "datum_und_uhrzeit_angeben" */
            $('<p class="aufraumen">Zeitangabe inkl. Aufräumen</p>').insertBefore($(this).find('.form_container[data-name="datum_und_uhrzeit_angeben"] .acf-actions'));


            /* =============================================================== *\ 
            Form Steps
            \* =============================================================== */
            // array for all form steps
            var data_step_container_array = [];
            
            // add data-attribute "data-container-step" to form_containers
            var $container_step = 1;
            $(this).find(".form_container").each(function () {
                $(this).attr("data-container-step", $container_step);

                // push data-step in data_step_container array
                data_step_container_array.push(parseInt($(this).attr("data-container-step")));
                $container_step++;
            });
            
            // add prev + next buttons
            $('<div class="form_prev_next_container"><div class="form_btn_prev"><i class="fa-solid fa-arrow-left"></i> zurück</div><div class="form_btn_next">weiter <i class="fa-solid fa-arrow-right"></i></div></div>').insertAfter($(this).find(".acf-accordion-content"));

            $(this).find(".form_btn_prev").on("click", function () {
                var this_form = $(this).closest(".multisite_ajax_form");
                prev_next_step('prev', this_form);
            });

            $(this).find(".form_btn_next").on("click", function () {
                // container-steps
                var this_form = $(this).closest(".multisite_ajax_form");
                prev_next_step('next', this_form);

                /* =============================================================== *\ 
                Populate Content to .summary
                \* =============================================================== */
                $(this).closest(".multisite_ajax_form").find(".summary").each(function () {
                    $(this).empty();
                });

                // add Class to the last Container (Abfrage absenden) 
                $(this).closest(".multisite_ajax_form").find(".form_container").last().addClass("hide_me");

                $(this).closest(".multisite_ajax_form").find(".form_container").each(function () {
                    // add titles to summary, exept last one
                    if ($(this).hasClass("hide_me") == false) {
                        var $my_title = $(this).children(".acf-label").children("label").text();
                        $('<h2>' + $my_title + "</h2>").appendTo($(this).closest(".multisite_ajax_form").find(".summary"));
                    }

                    // add <br/> between title and div (Email)
                    $("<br />").insertBefore($(this).closest(".multisite_ajax_form").find(".summary div + h2"));
                    
                    // Input-Fields
                    $(this).find("input, textarea").each(function(){
                        var $input_id = $(this).attr('id');
                        var $input_val = $(this).val();
                        var $input_type = $(this).attr('type');
                        var $id_selector = ".summary #" + $input_id;
                        var $my_class = "";
                        var $data_repeater;
                    
                        if($input_type == "checkbox"){
                            
                            // checkbox
                            if ($(this).closest('label').hasClass("selected")==true){
                                $input_val = $(this).attr("value");
                                var $new_input = '<div id="' + $input_id + '">' + $input_val + '</div>';
                                $($new_input).appendTo($(this_form).find(".summary"));
                        }; 

                            //switch
                            if($(this).closest("label").find(".acf-switch").hasClass("-on")){
                                var $my_label = $(this).closest(".acf-field").find(".acf-label label").html();
                                var $new_input = '<div id="' + $input_id + '">' + $my_label + ': ja</div>';
                                $($new_input).appendTo($(this_form).find(".summary"));
                            }
                        
                        }else if(($input_type == "text") || ($input_type == "email")){
                            
                            // Text
                            // Datepicker
                            // Email
                            if($input_val!=""){
                                if ($($id_selector).length > 0) {
                                    $($id_selector).remove();
                                }

                                if($(this).hasClass("hasDatepicker")){
                                    $my_class = "hasDatepicker";
                                }

                                if ($(this).parent().hasClass("acf-time-picker")){
                                    $my_class = $my_class + " isTimePicker";
                                }

                                // add data-attribute data-repeater-row if is a repeater-field
                                $row_id = repeater_check($(this));
                                if( ($row_id != "") && ($row_id != "undefined") && (typeof($row_id)!=="undefined") ){
                                    $data_repeater = ' data-repeater-row="' + $row_id + '"';
                                }
                                                        
                                var $new_input = '<div class="' + $my_class + '" id="' + $input_id + '" ' + $data_repeater + '>' + $input_val + '</div>';
                                $($new_input).appendTo($(this_form).find(".summary"));
                            }
                        
                        }else if(($input_type == "number") &&($input_val!="")){    
                            
                            // Number
                            if ($($id_selector).length > 0) {
                                $($id_selector).remove();
                            }
                            var $my_label = $(this).closest(".acf-field").find(".acf-label label").html();
                            var $new_input = '<div id="' + $input_id + '">' + $my_label + ': ' + $input_val + '</div>';
                            $($new_input).appendTo($(this).find(".summary"));
                        
                        } else if ($(this).is("textarea")) {
                        
                            // Textarea
                            $input_val = $(this).val();
                            var $new_input = '<div id="' + $input_id + '">' + $input_val + '</div>';
                            $($new_input).appendTo($(this).find(".summary"));
                        }

                    }); // $(this).find("input, textarea").each(function(){
                }); // $(".multisite_ajax_form .form_container").each(function(){


                // pack repeater field siblings in a container 
                $(this_form).find('.summary [data-repeater-row]').each(function () {
                    var row_id = $(this).attr('data-repeater-row');
                    if (!$(this).parent().hasClass("repeater_row")) {
                        $(this_form).find(".summary [data-repeater-row='" + row_id + "']").wrapAll('<div class="repeater_row"">');
                    }
                });

                // add " – " und " Uhr " by time fields
                $('<span style="margin-left:5px; margin-right:5px"> – </span>').insertBefore($(this_form).find('.summary .isTimePicker + .isTimePicker'));
                $('<span style="margin-left:5px; margin-right:5px"> Uhr </span>').insertAfter($(this_form).find('.summary .isTimePicker'));

                // replace the divs in the repeater_container with spans (Email)
                $(this_form).find(".summary .repeater_row").each(function () {
                    $(this).find("div").replaceWith(function () {
                        return "<span> " + this.innerHTML + "</span>";
                    });
                });

            }); // $(".form_btn_next").on("click", function () {

            //returns the id from the repeater row
            function repeater_check($this){
                if ($($this).closest('.acf-field-repeater').length > 0) {
                    $my_row_id = $($this).closest('.acf-row').attr("data-id");
                    return ($my_row_id);
                } 
            }

            /* =============================================================== *\
            Handle prev and next properties 
            form.multisite_ajax_form
            - set current step to data-attribute "data-step" 
            - add / remove ".is_first_step" class 
            - add / remove ".is_last_step" class

            form .form_container
            - add / remove ".current_container" class
            \* =============================================================== */        
            function prev_next_step(prev_next, this_form) {

                // find min and max step values
                var minDataStep = Math.min(...data_step_container_array).toString();
                var maxDataStep = Math.max(...data_step_container_array).toString();

                // what is the current_step
                var current_step = parseInt($(".current_container").attr("data-container-step"));

                // current_step ± 1
                if (prev_next == "next") {
                    var $prev_next_step = current_step + 1;
                } else if (prev_next == "prev") {
                    var $prev_next_step = current_step - 1;
                } else if (prev_next == "init") {
                    var $prev_next_step = 1;
                    $(this_form).find(".form_container").each(function () {
                        $(this).removeClass("current_container");
                    });

                    // Add .summary to DOM
                    $(this_form).find(".summary").each(function () {
                        $(this).remove();
                    });
                    $(this_form).find('.form_container[data-name="anfrage_absenden"] > .acf-input').prepend('<div class="summary"></div>');
                }

                // add / remove ".current_container" class in .form_container
                $prev_next_step = $prev_next_step.toString();
                $(this_form).attr('data-step', $prev_next_step);

                $(this_form).find(".form_container").each(function () {
                    $(this).removeClass("current_container");
                    if ($(this).attr('data-container-step') == $prev_next_step) {
                        $(this).addClass("current_container");
                    }
                });

                // add / remove ".is_first_step" Class to form
                // add / remove ".is_last_step" Class to form
                $(this_form).removeClass("is_last_step");
                $(this_form).removeClass("is_first_step");
                if ($(this_form).attr('data-step') == minDataStep) {
                    $(this_form).addClass("is_first_step");
                } else if ($(this_form).attr('data-step') == maxDataStep) {
                    $(this_form).addClass("is_last_step");
                }          
            }
        }); //$(".multisite_ajax_form").each(function(i){
    } //if($(".multisite_ajax_form").length > 0){
});
