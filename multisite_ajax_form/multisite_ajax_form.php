<?php

/**
 * Multi-Page-AJAX-Form Template.
 *
 * @param   array $block The block settings and attributes.
 * @param   string $content The block inner HTML (empty).
 * @param   bool $is_preview True during backend preview render.
 * @param   int $post_id The post ID the block is rendering content against.
 *          This is either the post ID currently being displayed inside a query loop,
 *          or the post ID of the post hosting this block.
 * @param   array $context The context provided to the block by the post or it's parent block.
 */

acf_form([
    'field_groups' => ['group_63e6803ee1c1f'],
    'form_attributes' => array("class" => "multisite_ajax_form"),
    'id' => 'new-facility-request',
    'post_id'  => 'new_post',
    'submit_value' => "Anfragen"
]);
?>

<div class="msg_container">
    <div class="msg_success">Ihre Anfrage wurde erfolgreich gesendet.</div>
    <div class="msg_failed">Bitte füllen Sie alle erforderlichen Felder aus.</div>
</div>
