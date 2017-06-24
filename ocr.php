<?php

/*
PHP iEdon-WebTesseract.js Front Proxy
@Author: iEdon Inside(www.iedon.com)
*/


header('Content-Type: text/plain; charset=utf-8');
if(!isset($_SERVER['HTTP_ORIGIN']))
{
	die("Invalid request.");
}
if(strpos($_SERVER['HTTP_ORIGIN'], "yourdomain"))
{
	header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}
header('Expires: -1');
header('Pragma: no-cache');
header('Cache-Control: no-cache');
header('X-Powered-By: iEdon-WebTesseract.js');
if(!isset($_POST['pic']))
{
	die("Nothing data pushed.");
}

class runtime
{ 
    var $StartTime = 0; 
    var $StopTime = 0; 
  
    function get_microtime() 
    { 
        list($usec, $sec) = explode(' ', microtime()); 
        return ((float)$usec + (float)$sec); 
    } 
  
    function start() 
    { 
        $this->StartTime = $this->get_microtime(); 
    } 
  
    function stop() 
    { 
        $this->StopTime = $this->get_microtime(); 
    } 
  
    function spent() 
    { 
        return round(($this->StopTime - $this->StartTime) * 1000, 1); 
    } 
  
}
   
$runtime= new runtime;
$runtime->start();

$url = "http://127.0.0.1:8123";
$post_data = str_replace(" ", "+", 'pic=' . $_POST['pic']);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// set post
curl_setopt($ch, CURLOPT_POST, 1);
// set post data 
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
$output = curl_exec($ch);
$runtime->stop();

header('HTTP/1.1 '.curl_getinfo($ch,CURLINFO_HTTP_CODE).' PROCEEDED');
header('X-Proceeded-In: '.$runtime->spent().' ms');

curl_close($ch);
print_r($output);

?>