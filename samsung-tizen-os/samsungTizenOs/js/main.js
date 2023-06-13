var value = tizen.tvinputdevice.getSupportedKeys();
console.log(value); 

window.onload = function() {
  document.body.addEventListener('keydown', function(e) {
    console.log('pressed keycode: ', e.keyCode)
    switch (e.keyCode) {
      case tizen.tvinputdevice.getKey('ArrowDown').code: //40
        console.log('Down key')
      break;

      case tizen.tvinputdevice.getKey('ArrowUp').code: //403
      console.log('Up key')
      break;
    }
  });
}