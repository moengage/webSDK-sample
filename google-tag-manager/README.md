##MoEngage
Using GTM for integrating and using the Moengage WEB SDK:

1. create a test page (index.html)
2. add GTM script to the head of this test page
3. add moengage script via GTM tag
  a. create Custom HTML tag in GTM admin panel
  b. insert sdk code inside a script in this tag (use your app ID)
  c. trigger the tag on every page view
  d. add serviceworker.js file in the root folder of your project
4. now Moengage WEB SDK is integrated successfully. you can use all its products.
5. track data using GTM events
  a. add dataLayer to the test page and send GTM event by pushing the event object to dataLayer
  b. create variable in GTM admin panel and send the value to GTM from the test page (through the GTM event)
  c. moengage will pick that variable from GTM.
6. now you know how to pass a variable from your website to GTM and how Moengage will pick it up from GTM.