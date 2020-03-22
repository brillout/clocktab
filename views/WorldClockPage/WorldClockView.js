import "./assets/css/style.css";

import "./assets/js/lists.js";
import "./assets/js/date.js";
import "./assets/js/worldclock.js";

import React from 'react';

export default WorldClockView;

function WorldClockView() {
  return <>

<div className="container">
    <h1 className="text-center">World Clock</h1>
    <div className='text-center'>
      Change the time to convert timezones!
    </div>
    <div id="clock_holder" className="row justify-content-center">
        {[0,1,2,3,4].map(clockId => {
          return (
            <div id={"clock"+clockId}
                key={'clock-key-'+clockId}
                style={{display: clockId===0?'none':''}}
                className="mt-4 mt-md-5 col-lg-3 col-md-6 px-md-4">
                <div className="row flex-row-reverse">
                    <div className="col-md-12 col-6 pl-1 pr-2 px-md-3" style={{position: 'relative'}}>
                        <div id={"time"+clockId+"i"} onclick={"document.getElementById('time"+clockId+"').focus();"}
                          className="text-color-light"
                          style={{top: 10, fontVariant: 'small-caps', right: 22, width: 'auto',
                              fontSize: '1em', textAlign: 'right', float: 'right', zIndex: 1, position: 'absolute'}}></div>
                        <input id={"time"+clockId} type="text"/>
                    </div>
                    <div className="mt-md-2 col-md-12 col-6 pl-2 pr-1 px-md-3" style={{position: 'relative'}}>
                        <select id={"c"+clockId}></select>
                    </div>
                </div>
            </div>
          );
        })}
    </div>

    <table className="mt-5" style={{margin: '0 auto', marginTop: 20}}>
        <tr>
            <td id="12" style={{borderRadius: 3, paddingRight: 1}}>
                <a style={{cursor: 'pointer', textDecoration: 'none'}} onclick="ttzc.swap24h(this);">12</a>
            </td>
            <td style={{width: 5}}></td>
            <td id="24" style={{borderRadius: 3, paddingLeft: 2}}>
                <a style={{cursor: 'pointer', textDecoration: 'none'}} onclick="ttzc.swap24h(this);">24</a>
            </td>
        </tr>
    </table>

    <table style={{margin: '0 auto', marginTop: 20}}>
        <tr>
            <td className="num_clocks">Clocks &nbsp;</td>
            <td><input id="num_clocks" className="num_clocks" type="number" pattern="\d*" value="0" min="1" max="20" /></td>
        </tr>
    </table>

    <div id="warning" style={{margin: '20px auto 0 auto', textAlign: 'center', fontSize: 13}}>
    </div>

</div>

  </>;
}
