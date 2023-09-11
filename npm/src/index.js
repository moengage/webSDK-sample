import _ from 'lodash';
import moengage from '@moengage/web-sdk';

function component() {
  const element = document.createElement('button');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.addEventListener('click', () => {
    moengage.add_email('dummy')
  })
  return element;
}

function initMoe() {
  // import Moengage from 'moengage';
  console.log(moengage)
  // var a = moengage;
  moengage.initialize({app_id: 'PMUIV063ELNBKN1BG8XDQTLZ'});
  moengage.setDebugLevel(2) 
}

initMoe();

document.body.appendChild(component());
