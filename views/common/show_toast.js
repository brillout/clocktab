import assert from '@brillout/assert';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import './toast.css';

export {show_toast};

function show_toast(args) {
  const text = args.text || args;
  assert(text);

  const backgroundColor = args.backgroundColor || 'linear-gradient(to right, rgb(0, 176, 84), rgb(61, 201, 64))';

  Toastify({
    duration: 8000,
    text,
    position: 'left',
    backgroundColor,
    // className: "info",
  }).showToast();
}
