# MoEngage

Using GTM for integrating and using the Moengage WEB SDK:

1. create a test page (index.html)
2. add GTM script to the head of this test page
3. add moengage script via GTM tag <br/>
  a. create Custom HTML tag in GTM admin panel <br/>
  b. insert [sdk code](https://developers.moengage.com/hc/en-us/articles/360060713252-Web-SDK-Integration) inside a script in this tag (use your app ID) <br/>
  c. trigger the tag on every page view <br/>
  d. add [serviceworker.js](https://cdn.moengage.com/webpush/releases/serviceworker.js) file in the root folder of your project <br/>
4. now Moengage WEB SDK is integrated successfully. you can use all its products.
5. track data using GTM events <br/>
  a. add dataLayer to the test page and send GTM event by pushing the event object to dataLayer <br/>
  b. create variable in GTM admin panel and send the value to GTM from the test page (through the GTM event) <br/>
  c. moengage will pick that variable from GTM. <br/>
6. now you know how to pass a variable from your website to GTM and how Moengage will pick it up from GTM.
