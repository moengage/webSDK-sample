import moengage from '@moengage/web-sdk';

moengage.initialize(
  {
    app_id: 'XXXXXXXXXXX',
    debug_logs: 0
  }
);


moengage.add_unique_user_id('abc@xyz.com');
moengage.add_email('abc@xyz.com');

moengage.track_event('Add to Cart', {name: 'Phone', price: '100000'});

document.addEventListener("DOMContentLoaded", function(event) {
  const element = document.createElement('h1')
  element.innerHTML = "Moengage SDK"
  document.body.appendChild(element)
})
