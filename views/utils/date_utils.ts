import assert from "@brillout/assert";

export { get_hours };
export { get_minutes };
export { get_seconds };
export { get_day };
export { get_month };
export { get_date };
export { get_week };
export { time_icon };

const WEEKDAY_NAMES = new Array(
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
);
const MONTH_NAMES = new Array(
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
);
function get_week(
  that //{{{
) {
  /**
   * Returns the week number for that date.  dowOffset is the day of week the week
   * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
   * the week returned is the ISO 8601 week number.
   * @param int dowOffset
   * @return int
   */
  //Date.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  // var dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
  const dowOffset = 0;

  let newYear = new Date(that.getFullYear(), 0, 1);
  let day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  var daynum =
    Math.floor(
      (that.getTime() -
        newYear.getTime() -
        (that.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1;
  let weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      let nYear = new Date(that.getFullYear() + 1, 0, 1);
      let nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
          the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
  //};
}
//}}}

function getDayBegining(date) {
  var d = new Date(+date);
  var ret = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
  ret +=
    (d.getTimezoneOffset() - new Date(ret).getTimezoneOffset()) * 60 * 1000;
  return ret;
}
function get_hours(
  that,
  twelveClock //{{{
) {
  var ret = that.getHours();

  if (twelveClock) {
    ret %= 12;
    if (ret == 0) ret = 12;
  }

  if (!twelveClock) {
    ret = appendZero(ret);
  }

  return ret;
}
function get_minutes(that) {
  return appendZero(that.getMinutes());
}
function get_seconds(that) {
  return appendZero(that.getSeconds());
}
function get_date(that) {
  return appendZero(that.getDate());
}
function get_day(that) {
  return WEEKDAY_NAMES[that.getDay()];
}
function get_month(that) {
  return MONTH_NAMES[that.getMonth()];
}

function getTime(s, format, digitShift, shiftTodo) {
  assert(s !== undefined && s.constructor === Number);
  assert(digitShift === undefined || digitShift.constructor === Number);
  assert(shiftTodo === undefined || shiftTodo.constructor === Number);
  assert(
    format === "timer" ||
      format === "time12" ||
      format === "time12_pretty" ||
      format === "countdown" ||
      format === "data"
  );
  if (format === "time12" || format === "time12_pretty" || format === "data") {
    assert(digitShift === undefined && shiftTodo === undefined);
    digitShift = 0;
    shiftTodo = 2;
  } else {
    if (digitShift === undefined) digitShift = 1;
    if (shiftTodo === undefined) shiftTodo = 0;
  }

  var verbose = format === "timer";
  var cutHead = format === "timer" || format === "countdown";
  var cutTail = verbose;
  var makeAMPM = format === "time12" || format === "time12_pretty";

  //epoch digit length won't change until year 2200
  //13 digit number interpretend as milliseconds correspond to > 30 years
  if (s.toString().length > 12) {
    assert(
      format === "time12" || format === "time12_pretty" || format === "data"
    );
    //onsole.log(new Date(s));
    //onsole.log(new Date(new Date(s).getFullYear(),new Date(s).getMonth(),new Date(s).getDate()));
    s = s - getDayBegining(s);
    //onsole.log(s);
  }
  if (makeAMPM) {
    var mid_day = 12 * 60 * 60 * 1000;
    var isPm = s >= mid_day;
    if (isPm) s -= mid_day;
  }

  var DEFAULT_PARTITION = 100; //needed to add trailing zeros
  var DIGITS_PARTITION = [1000, 60, 60];
  var DIGITS_ABBREVATION = ["ms", "s", "m", "h"];

  //=====do shift
  /* failed attempt to determine digitShift (with current input information, it's not possible)
    var MAX_EPOCH_LENGTH = 13;
    var digitShift = 0;
    while((DIGITS_PARTITION.slice(0,digitShift).reverse().concat([1]).reverse().reduce(function(a,b){return a*b})*s).toString().length<MAX_EPOCH_LENGTH && digitShift<=DIGITS_PARTITION.length) digitShift++;
    assert(digitShift<=DIGITS_PARTITION.length);
    */
  digitShift += shiftTodo;
  assert(digitShift <= DIGITS_PARTITION.length);
  while (shiftTodo--) s /= DIGITS_PARTITION[digitShift - (shiftTodo + 1)];
  s = parseInt(s, 10);
  DIGITS_PARTITION.splice(0, digitShift);
  DIGITS_ABBREVATION.splice(0, digitShift);

  //====compute digits
  var d = [];
  for (var i = 0; i < DIGITS_PARTITION.length + 1; i++) {
    var digitValue = s;
    for (var j = i - 1; j >= 0; j--) digitValue /= DIGITS_PARTITION[j];
    d.push(digitValue % (DIGITS_PARTITION[i] || Infinity) | 0);
  }

  if (cutHead) while (d[d.length - 1] === 0 && d.length > 1) d.pop();
  if (makeAMPM) if (d[d.length - 1] === 0) d[d.length - 1] = 12;

  if (cutTail) {
    var trailCut = d.length;
    while (d[0] === 0 && d.length > 1) d.shift();
    trailCut -= d.length;
  }

  if (!verbose)
    for (var i = 0; i < d.length; i++)
      d[i] =
        "00".substring(
          0,
          ((DIGITS_PARTITION[i] || DEFAULT_PARTITION) - 1).toString().length -
            d[i].toString().length
        ) + d[i];

  if (verbose) {
    DIGITS_ABBREVATION.splice(0, trailCut);
    for (var i = 0; i < d.length; i++) d[i] += DIGITS_ABBREVATION[i];
  }

  //onsole.log(d.slice().reverse().join(verbose?' ':':'));
  //onsole.log('');
  d.reverse();
  if (format === "data") return d;
  let d__str: string = d.join(verbose ? " " : ":");
  if (makeAMPM) {
    if (format === "time12_pretty") {
      d__str = d__str.replace(/:00$/, "").replace(/^0/, "");
    }
    d__str = d__str + " " + (isPm ? "PM" : "AM");
    //assert(digitShift===2); if(d[0]==='0') return d.substring(1);
    return d;
  }
  return d;
}

function time_icon(scale, color, twelveClock) {
  if (!scale) scale = 1;
  if (!color) color = "black";
  var d = new Date();
  var canvas = document.createElement("canvas");
  canvas.height = 32 / scale;
  canvas.width = 32 / scale;
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = color;
  ctx.font = Math.floor(15 / scale) + "pt arial";
  ctx.fillText(get_hours(d, twelveClock), 0, 14 / scale);
  ctx.font = 16 / scale + "pt arial";
  ctx.fillText(get_minutes(d), 5 / scale, 32 / scale);

  return canvas.toDataURL();
}

function appendZero(str) {
  if (str < 10) return "0" + str;
  else return "" + str;
}
