import assert from '@brillout/assert';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import './toast.css';

export {show_toast};

function show_toast(text, {is_error=false, short_duration}={}) {
  assert(text);

  const backgroundColor = (
    is_error ? (
      'linear-gradient(to right, #e83131, #dd4c4c)'
    ) : (
      'linear-gradient(to right, rgb(0, 176, 84), rgb(61, 201, 64))'
    )
  );

  const duration = short_duration ? 4 : 8;

  Toastify({
    duration: duration*1000,
    text,
    position: 'left',
    backgroundColor,
    // className: "info",
  }).showToast();
}
