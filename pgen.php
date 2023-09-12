<?php
/** 
 * Plugin Name: Pgen 
 * Description: AI Auto generator for products and pages
 * Author: Yuval Gal
 * Author UII: https://github.com/yuvalgal2
 * Version: 1.0.0
 * Text Domain: https://codegalaxy.tech
 */

 if (!defined('ABSPATH')) {
    die();
 }

 include_once("PgenInjector.class.php");

 $pgen = new PgenInjector();
