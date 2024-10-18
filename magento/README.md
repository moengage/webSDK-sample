## Installing and Running Magento locally

Go through their documentations on installing and running it locally (https://experienceleague.adobe.com/en/docs/commerce-operations/installation-guide/composer)[https://experienceleague.adobe.com/en/docs/commerce-operations/installation-guide/composer]

It involves many steps like, instally apache, php, mysql, elasticsearch etc.  

Once the app is running, check the Admin URL using the command php bin/magento info:adminuri and open it in the browser and login with the admin credentials.  

In the admin panel, the store can be configured.  


## SDK Integration  

To inject the web SDK script, follow these steps:

1. Navigate to Admin Panel > Content > Configuration.

2. Choose the store view you want the head tag to be changed on or select Global to change it on every store view.

3. Find the HTML Head section and add the SDK script code in the Scripts and Style Sheets fiel

4. Don't forget to press the Save button once you finish and flush cache

5. To flush the cache, type: php bin/magento c:c

## Serviceworker

serviceworker file is added at `/pub/media/serviceworker.js`