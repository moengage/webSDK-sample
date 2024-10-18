var checkTime;

//Initialize function
var init = function () {
  var btn2 = document.getElementById("btn1");
  var btn2 = document.getElementById("btn2");
  var activeElement = 'btn1';

  function focusButton() {
    if (activeElement === 'btn1') {
      activeElement = 'btn2';
      btn2.focus();
    } else if (activeElement === 'btn2') {
      activeElement = 'btn1';
      btn1.focus();
    }
  }

  function clickFocusedButton() {
    if (activeElement === 'btn1') {
      btn1.click();
      console.log('btn1')
      alert('btn1')
    } else if (activeElement === 'btn2') {
      console.log('btn2')
      alert('btn2')
    }
  }

  // add eventListener for keydown
  document.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
      case 37: //LEFT arrow
        focusButton();
        break;
      case 38: //UP arrow
        focusButton();
        break;
      case 39: //RIGHT arrow
        focusButton();
        break;
      case 40: //DOWN arrow
        focusButton();
        break;
      case 13: //OK button
        clickFocusedButton();
        break;
      default:
        console.log("Key code : " + e.keyCode);
        break;
    }
  });
};
// window.onload can work without <body onload="">
window.onload = init;