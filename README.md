WebTesseract.js
=
*A simple node.js web front of tesseract.js OCR engine, comes with a PHP front proxy.*

Usage: 
-
POST data like this: pic=[captcha data encoded in dataURI(base64)]

Return value:
-
Return recognized captcha code if succeed, otherwise return an error or empty response.

Credits:
-
Tesseract.js, Tesseract-OCR