<?php

class PgenInjector {
    public function __construct() {
        add_action('init',array($this, 'boot'));
        wp_enqueue_style( 'pgen',plugin_dir_url(__FILE__) . 'css/index.css', array(), false, true );
        wp_enqueue_script( 'pgen',plugin_dir_url(__FILE__) . 'js/index.js', array('jquery'), false, true );
    }
    
    
    public function boot() {
        $this->createMenuOption();
        $this->injectScripts();

    }



    private function createMenuOption() {
        $args = [
        'public' => true,
        'has_archive' => false,
        'supports' => array('productKey'),
        'exclude_from_search' => true,
        'publicly_queryable' => false,
        'capability' => 'manage_options',
        'labels' => [
           'name' => 'Pgen AI Settings', 
           'singular_name' => 'Pgen AI Settings'],
        'menu_icon' => 'dashicons-admin-settings'
        ];
        register_post_type('pgen_ai_settings', $args);
    }

    private function injectScripts() {

    }
}