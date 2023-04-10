import React from 'react';
import SourceDocument, { Html, Head, Main, NextScript } from 'next/document';

export default class Document extends SourceDocument {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <script dangerouslySetInnerHTML={ {__html:`!function(e,t,n,a,i){let o=e.Moengage=e.Moengage||[];if(o.invoked=0,o.initialised>0||o.invoked>0)return console.error("MoEngage Web SDK initialised multiple times. Please integrate the Web SDK only once!"),!1;let d;e.moengage_object=i;let r={},l=function(t){return function(...n){(e.moengage_q=e.moengage_q||[]).push({f:t,a:n})}},s=["track_event","add_user_attribute","add_first_name","add_last_name","add_email","add_mobile","add_user_name","add_gender","add_birthday","destroy_session","add_unique_user_id","moe_events","call_web_push","track","location_type_attribute",],g={onsite:["getData","registerCallback"]};for(let u in s)r[s[u]]=l(s[u]);for(let m in g)for(let c in g[m])null==r[m]&&(r[m]={}),r[m][g[m][c]]=l(m+"."+g[m][c]);let b=t.createElement(n),f=t.getElementsByTagName("head")[0];b.async=1,b.src=a,f.appendChild(b),e.moe=e.moe||function(...e){return(o.invoked=o.invoked+1,o.invoked>1)?(console.error("MoEngage Web SDK initialised multiple times. Please integrate the Web SDK only once!"),!1):(d=e[0],r)},b.addEventListener("load",()=>{if(d)return e[i]=e.moe(d),e.Moengage.initialised=e.Moengage.initialised+1||1,!0}),b.addEventListener("error",()=>(console.error("Moengage Web SDK loading failed."),!1))}(window,document,"script","https://cdn.moengage.com/webpush/moe_webSdk.min.latest.js","Moengage")`} }>
        </script>  
        <script dangerouslySetInnerHTML={ {__html:`
          Moengage = moe({
            app_id:"3RADPYNEBZ2MCOJ43EEW5FWV",
            debug_logs: 0,
            swPath: '/_next/static/sw.js',
            swScope: '/_next/static/'
          });`} }>
        </script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
