(function() {
  if( typeof window === "undefined" ){
    return;
  }

window['--text-color-light'] = '#aaa';
window.ga = function() {};
window.worldclock = function(t) {
  var e = {};

  function i(o) {
    if (e[o]) return e[o].exports;
    var n = e[o] = {
      i: o,
      l: !1,
      exports: {}
    };
    return t[o].call(n.exports, n, n.exports, i), n.l = !0, n.exports
  }
  return i.m = t, i.c = e, i.d = function(t, e, o) {
    i.o(t, e) || Object.defineProperty(t, e, {
      enumerable: !0,
      get: o
    })
  }, i.r = function(t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    })
  }, i.t = function(t, e) {
    if (1 & e && (t = i(t)), 8 & e) return t;
    if (4 & e && "object" == typeof t && t && t.__esModule) return t;
    var o = Object.create(null);
    if (i.r(o), Object.defineProperty(o, "default", {
        enumerable: !0,
        value: t
      }), 2 & e && "string" != typeof t)
      for (var n in t) i.d(o, n, function(e) {
        return t[e]
      }.bind(null, n));
    return o
  }, i.n = function(t) {
    var e = t && t.__esModule ? function() {
      return t.default
    } : function() {
      return t
    };
    return i.d(e, "a", e), e
  }, i.o = function(t, e) {
    return Object.prototype.hasOwnProperty.call(t, e)
  }, i.p = "", i(i.s = 0)
}([function(t, e, i) {
  "use strict";
  i.r(e);

  function o(t, e, i) {
    this.local_time_str = i, this.view = null, this.warningView = null, this.time = null, this.context =
      t || null, this.place_id = null, this.convert_map = e
  }
  o.prototype.getView = function() {
    return this.view
  }, o.prototype.setViews = function(t, e) {
    this.view = t, this.warningView = e
  }, o.prototype.getTime = function() {
    return this.time
  }, o.prototype.setTime = function(t) {
    this.time != t && (this.time = t, this.notify())
  }, o.prototype.getContext = function() {
    return this.context
  }, o.prototype.getPlaceId = function() {
    return this.place_id
  }, o.prototype.setContext = function(t) {
    null != this.convert_map[t] ? this.context = t : this.context = "GMT", this.notify()
  }, o.prototype.getAbbreviation = function() {
    return abbreviations[this.context]
  }, o.prototype.getOffset = function() {
    return this.convert_map[this.context]
  }, o.prototype.isLocal = function() {
    return this.context == this.local_time_str
  }, o.prototype.notify = function() {
    this.view && this.view.update(), this.warningView && this.warningView.update()
  };
  var n = new Date;
  n.setFullYear(n.getFullYear() + 1);
  var s = "expires=" + n.toGMTString();

  function r(t, e) {
    return new Date(t.getTime() - 1e3 * e)
  }

  function a(t, e) {
    return new Date(t.getTime() + 1e3 * e)
  }

  function l() {
    return r(new Date, h())
  }

  function h() {
    return 60 * -(new Date).getTimezoneOffset()
  }

  function c(t, e) {
    return t.setSeconds(0), e.setSeconds(0), t.setMilliseconds(0), e.setMilliseconds(0), t.getTime() ==
      e.getTime()
  }

  function u(t) {
    this.$name = t;
    var e = document.cookie;
    if ("" != e) {
      for (var i = e.replace(/ /g, "").split(";"), o = null, n = 0; n < i.length; n++)
        if (i[n].substring(0, t.length + 1) == t + "=") {
          o = i[n];
          break
        } if (null != o) {
        var s = o.substring(t.length + 1).split("&");
        for (n = 0; n < s.length; n++) s[n] = s[n].split(":");
        for (n = 0; n < s.length; n++) this[s[n][0]] = decodeURIComponent(s[n][1])
      }
    }
  }

  function m(t) {
    if (null == t) return null;
    if (isNaN(Number(t.charAt(0)))) return null;
    var e, i = null,
      o = null,
      n = null,
      s = null;
    return e = Date.parse(t), t.length >= 3 && (i = t.substr(0, 1) + ":" + t.substr(1, t.length), o = t
        .substr(0, 2) + ":" + t.substr(2, t.length), n = Date.parse(i), s = Date.parse(o)), (t
        .icontains("A") || t.icontains("P")) && t.icontains(":") ? e : !t.icontains("A") && !t
      .icontains("P") || t.icontains(":") ? !t.icontains(":") && t.length >= 3 ? n || (s || e) : Date
      .parse(t + ":00") : e || (n || s)
  }

  function d(t) {
    return document.getElementById(t)
  }

  function p(t) {
    var e = null,
      i = window.location.search.match(RegExp(t + "=([^&]*)"));
    if (i && i.length >= 2) {
      var o = i[1].split("+").join(" ");
      e = decodeURIComponent(o)
    }
    return e
  }

  function f(t, e, i, o) {
    this.model = t, this.timeElem = document.getElementById("time" + e), this.contextElem = document
      .getElementById("c" + e), this.timeInfoElem = document.getElementById("time" + e + "i"), this
      .contextInfoElem = document.getElementById("c" + e + "i"), this.select2_data = [], this.dirty = !
      1, this.controller = o, this.initSelect2Data(i), this.setContextChangeHandler(), this
      .setOnKeyUpHandler()
  }

  function g(t) {
    this.view = null, this.cookie = t, this.is24 = !1
  }

  function y() {
    this.models = [], this.elem = document.getElementById("warning")
  }

  function v(t) {
    this.model = t, this.td12 = document.getElementById("12"), this.td24 = document.getElementById("24")
  }
  u.prototype.store = function() {
    var t = "";
    for (var e in this) "$" != e.charAt(0) && "function" != typeof this[e] && ("" != t && (t += "&"),
      t += e + ":" + encodeURIComponent(this[e]));
    var i = this.$name + "=" + t + ";" + s;
    document.cookie = i
  }, String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "")
  }, String.prototype.contains = function(t) {
    return -1 != this.indexOf(t)
  }, String.prototype.icontains = function(t) {
    return -1 != this.toUpperCase().indexOf(t.toUpperCase())
  }, String.prototype.removeSpaces = function() {
    return this.replace(/\s/g, "")
  }, f.changeElemIds = function(t, e, i) {
    t.id = "clock" + i, t.querySelector("#time" + e).id = "time" + i, t.querySelector("#time" + e +
      "i").id = "time" + i + "i", t.querySelector("#c" + e).id = "c" + i
  }, f.prototype.initSelect2Data = function(t) {
    var e = 1;
    for (var i in t) this.select2_data.push({
      id: e,
      text: i
    }), e++;
    var o = this;
    var n = "#" + this.contextElem.id,
      s = {
        data: this.select2_data,
        matcher: function(t, e) {
          return "" === $.trim(t.term) ? e : 0 == e.text.toUpperCase().indexOf(t.term
          .toUpperCase()) ? e : null
        },
        templateSelection: function(t) {
          var e = "";
          return e += "<div>", e +=
            "<div style='float:right; font-variant:small-caps; color:"+window['--text-color-light']+"; font-size:0.7em;'>", o
            .model.getAbbreviation() && (e += o.model.getAbbreviation()), e += "</div>", e += t
            .text, e += "</div>", $(e)
        }
      };
    $(n).select2(s)
  }, f.prototype.setContextChangeHandler = function() {
    var t = "#" + this.contextElem.id,
      e = this;
    $(t).on("change", function(i) {
      var o = $(t + " option:selected").text();
      e.handleContextChange(o)
    })
  }, f.prototype.handleContextChange = function(t) {
    this.model.setContext(t), this.controller.handleContextChange(this)
  }, f.prototype.setOnKeyUpHandler = function() {
    var t = this;
    this.timeElem.onkeyup = function(e) {
      var i = e || window.event;
      i.charCode || i.keyCode;
      t.handleTimeChange()
    }
  }, f.prototype.handleTimeChange = function() {
    var t = m(this.getTimeValue());
    if (null != t) {
      var e = r(t, this.model.getOffset());
      this.controller.setMasterTime(e, this)
    }
    this.controller.handleTimeChange(this)
  }, f.prototype.getContextValue = function() {
    return this.contextElem.options[this.contextElem.selectedIndex].text
  }, f.prototype.getTimeValue = function() {
    return this.timeElem.value
  }, f.prototype.getContextId = function() {
    return this.contextElem.id
  }, f.prototype.getTimeId = function() {
    return this.timeElem.id
  }, f.prototype.setTimeInfo = function(t) {
    this.timeInfoElem.innerHTML = t
  }, f.prototype.clearTimeInfo = function() {
    this.timeInfoElem.innerHTML = ""
  }, f.prototype.getTimeInfo = function() {
    return this.timeInfoElem.innerHTML
  }, f.prototype.disableTime = function() {
    this.timeElem.disabled = !0, this.timeElem.className += "disabled_color"
  }, f.prototype.disableContext = function() {
    this.contextElem.disabled = !0
  }, f.prototype.getDirty = function() {
    return this.dirty
  }, f.prototype.setDirty = function() {
    this.dirty = !0
  }, f.prototype.clearDirty = function(t) {
    this.dirty = !1
  }, f.prototype.getOffset = function() {
    return this.model.getOffset()
  }, f.prototype.setTimeFormat = function(t) {
    var e = m(this.getTimeValue());
    if (e) {
      var i = e.toString(t);
      this.model.setTime(i)
    }
  }, f.prototype.update = function() {
    var t, e, i;
    if (this.timeElem.value = (t = this.controller.getMasterTime(), e = this.controller
      .getTimeFormat(), i = this.model.getOffset(), a(t, i).toString(e)), this.model.getContext()) {
      var o = this.text_to_id(this.model.getContext());
      $("#" + this.contextElem.id).val(o), $("#" + this.contextElem.id).trigger("change.select2")
    }
  }, f.prototype.text_to_id = function(t) {
    var e;
    for (e = 0; e < this.select2_data.length && this.select2_data[e].text != t; e++);
    return e == this.select2_data.length ? 1 : this.select2_data[e].id
  }, g.prototype.getIs24 = function() {
    return this.is24
  }, g.prototype.toggleFormat = function() {
    this.is24 = !this.is24, this.is24 ? this.cookie.time_format = "24h" : this.cookie.time_format =
      "12h", this.cookie.store(), this.notify()
  }, g.prototype.setTo12 = function() {
    this.is24 = !1, this.cookie.time_format = "12h", this.notify()
  }, g.prototype.setTo24 = function() {
    this.is24 = !0, this.cookie.time_format = "24h", this.notify()
  }, g.prototype.setView = function(t) {
    this.view = t
  }, g.prototype.notify = function() {
    this.view && this.view.update()
  }, y.prototype.addModel = function(t) {
    this.models.push(t)
  }, y.prototype.update = function() {
    for (var t = "", e = 0; e < this.models.length; e++)
      if (warnings[this.models[e].getContext()]) {
        t = warnings[this.models[e].getContext()];
        break
      } this.elem.innerHTML = t
  }, v.prototype.update = function() {
    this.model.getIs24() ? (this.td12.style.backgroundColor = null, this.td12.getElementsByTagName(
        "a")[0].style.color = window['--text-color-light'], this.td24.style.backgroundColor = window['--text-color-light'], this.td24
      .getElementsByTagName("a")[0].style.color = "white") : (this.td12.style.backgroundColor =
      window['--text-color-light'], this.td12.getElementsByTagName("a")[0].style.color = "white", this.td24.style
      .backgroundColor = null, this.td24.getElementsByTagName("a")[0].style.color = window['--text-color-light'])
  };

  function w(t, e) {
    this.model = t, this.controller = e, this.elem = document.getElementById("num_clocks");
    var i = this;
    this.elem.addEventListener("input", function() {
      i.handleNumChange()
    })
  }
  w.prototype.update = function() {
    this.elem.value = this.model.getNum()
  }, w.prototype.handleNumChange = function() {
    var t;
    "" != this.elem.value && (t = this.elem.value, ga("send", {
    }), this.model.setNum(this.elem.value), this.controller.handleNumClocksChange())
  };

  function _(t) {
    this.view = null, this.num = t
  }
  _.prototype.getView = function() {
    return this.view
  }, _.prototype.setView = function(t) {
    this.view = t
  }, _.prototype.setNum = function(t) {
    this.num != t && (t >= 1 && t <= 20 ? this.num = t : t < 1 ? this.num = 1 : t > 20 && (this.num =
      20), this.notify())
  }, _.prototype.getNum = function(t) {
    return this.num
  }, _.prototype.notify = function() {
    this.view && this.view.update()
  };
  var C = "prefs";

  function T(t, e) {
    if (!("object" == typeof t && "LOCAL_TIME" in t && "NEXT_DAY" in t))
    throw "Localized strings not provided.";
    this.loc_strings = t, this.time_format = "t", this.cookie = new u(C), this
      .local_time_update_timeout_id = null, this.convert_map = {}, this.masterTime = l(), this
      .isMasterTimeNow = !0, this.initTzArrays(), this.swap24 = new g(this.cookie), this.swap24View =
      new v(this.swap24), this.swap24.setView(this.swap24View), this.warningView = new y, this
      .sideViews = [], this.sideModels = [];
    for (var i = 0; i < e; i++) this.addSideModelAndView(i);
    this.siteInit()
  }
  T.prototype.addSideModelAndView = function(t) {
    var e = new o(this.loc_strings.LOCAL_TIME, this.convert_map, this.loc_strings.LOCAL_TIME),
      i = new f(e, t + 1, this.convert_map, this);
    e.setViews(i, this.warningView), this.sideViews.push(i), this.sideModels.push(e), this.warningView
      .addModel(e), 0 == t ? (this.leftSide = e, this.leftSideView = i) : 1 == t && (this.rightSide =
        e, this.rightSideView = i)
  }, T.prototype.getMasterTime = function() {
    return this.masterTime
  }, T.prototype.setMasterTime = function(t, e) {
    if (!c(this.masterTime, t)) {
      this.masterTime = t;
      for (var i = 0; i < this.sideViews.length; i++) this.sideViews[i] != e && this.sideViews[i]
        .update()
    }
    this.isMasterTimeNow = c(this.masterTime, l())
  }, T.prototype.setMasterTimeToNow = function() {
    this.setMasterTime(l(), null)
  }, T.prototype.getTimeFormat = function() {
    return this.time_format
  }, T.prototype.initTzArrays = function() {
    var t = h();
    for (var e in this.convert_map[this.loc_strings.LOCAL_TIME] = t, cities) this.convert_map[e] =
      cities[e];
    for (var e in tznames) this.convert_map[e] = tznames[e];
    for (var e in gmts) this.convert_map[e] = gmts[e];
    this.tzParamFallbackLookupAndAdd()
  }, T.prototype.tzParamFallbackLookupAndAdd = function() {
    if (p("tz") && "en" in loc_strings && !(p("tz") in this.convert_map)) {
      var t = loc_strings.en();
      p("tz") in t && this.add_context_string_to_convert_map(p("tz"), t[p("tz")])
    }
  }, T.prototype.add_context_string_to_convert_map = function(t, e) {
    this.convert_map[t] = e
  }, T.prototype.siteInit = function() {
    this.initLocalTimeFormat(), this.setFieldDefaults(), this.updateTimeInfos(), this.setAutofocus(p(
      "tz"));
    var t, e = this;
    this.local_time_update_timeout_id = setTimeout(function() {
      e.updateLocaltime()
    }, ((t = new Date).setMinutes(t.getMinutes() + 1), t.setSeconds(0), t - new Date))
  }, T.prototype.initLocalTimeFormat = function() {
    var t = this.cookie.time_format;
    if (t) this.time_format = "24h" == t ? "HH:mm" : "h:mm tt";
    else
      for (var e = function(t) {
          if ("<" == t[0]) return ["en-us"];
          for (var e = t.split(","), i = [], o = 0; o < e.length; o++) {
            var n = e[o].trim().split(";")[0];
            i.push(n.toLowerCase())
          }
          return i
        }('\x3c!--#echo var="HTTP_ACCEPT_LANGUAGE" --\x3e'), i = 0; i < e.length; i++)
        if (shortTimes[e[i]]) {
          this.time_format = shortTimes[e[i]];
          break
        } this.time_format.contains("H") ? this.swap24.setTo24() : this.swap24.setTo12()
  }, T.prototype.updateLocaltime = function() {
    if (this.isMasterTimeNow) {
      this.setMasterTimeToNow();
      var t = this;
      this.local_time_update_timeout_id = setTimeout(function() {
        t.updateLocaltime()
      }, 6e4)
    } else clearTimeout(this.local_time_update_timeout_id)
  }, T.prototype.setAutofocus = function(t) {
    var e;
    !p("t") && t && (d(e = "time1").focus(), d(e).select())
  }, T.prototype.handleContextChange = function(t) {
    var e;
    this.cookie[t.getContextId()] = t.getContextValue(), this.cookie.store(), this.updateTimeInfos(),
      e = t.getContextValue(), ga("send", {
      })
  }, T.prototype.handleTimeChange = function(t) {
    this.updateTimeInfos()
  }, T.prototype.updateTimeInfos = function() {
    this.sideViews.forEach(function(t) {
      t.clearTimeInfo()
    });
    var t = this.sideViews[0].getOffset();
    this.sideViews.forEach(function(e) {
      e.getOffset() < t && (t = e.getOffset())
    }), this.sideViews.forEach(function(e) {
      var i, o, n, s, r;
      i = t, o = e.getOffset(), n = this.getMasterTime(), s = a(n, i), r = a(n, o), s.getDay() !=
        r.getDay() && e.setTimeInfo(this.loc_strings.NEXT_DAY)
    }, this)
  }, T.prototype.swap24h = function(t) {
    this.swap24.toggleFormat(), this.swap24.getIs24() ? this.time_format = "HH:mm" : this
      .time_format = "h:mm tt", this.sideViews.forEach(function(t) {
        t.setTimeFormat(this.time_format)
      }, this)
  }, i.d(e, "WorldClock", function() {
    return E
  });
  var x = 4,
    k = ["San Francisco", "London", "Mumbai", "Hong Kong"];

  function E(t) {
    this.numClocks = new _(x), this.numClocksView = new w(this.numClocks, this), this.numClocks.setView(
      this.numClocksView), T.call(this, t, x)
  }
  E.prototype = Object.create(T.prototype), E.prototype.setFieldDefaults = function() {
    this.setNumClocksWidgetDefault(), this.adjustTheNumberOfSides(), this.setContextDefaults()
  }, E.prototype.calculateClosestContextIndex = function() {
    for (var t, e, i = h(), o = 0; o < k.length; o++) {
      var n = Math.abs(i - this.convert_map[k[o]]);
      (null == t || n < t) && (t = n, e = o)
    }
    return e
  }, E.prototype.setContextDefaults = function() {
    for (var t = this.calculateClosestContextIndex(), e = 0; e < this.sideModels.length; e++) this
      .sideViews[e].getContextId() in this.cookie ? this.sideModels[e].setContext(this.cookie[this
        .sideViews[e].getContextId()]) : e == t ? this.sideModels[e].setContext(this.loc_strings
        .LOCAL_TIME) : this.sideModels[e].setContext(k[e])
  }, E.prototype.setNumClocksWidgetDefault = function() {
    this.numClocksView.update(), this.cookie.num_clocks && this.numClocks.setNum(this.cookie
      .num_clocks)
  }, E.prototype.addSide = function(t) {
    var e = document.getElementById("clock0").cloneNode(!0);
    e.style.display = "block", f.changeElemIds(e, 0, t + 1), document.getElementById("clock_holder")
      .appendChild(e), this.addSideModelAndView(t), this.sideViews[t].update()
  }, E.prototype.deleteSide = function(t) {
    this.sideViews.splice(t, 1), this.sideModels.splice(t, 1), document.getElementById("clock" + (t +
      1)).remove(), delete this.cookie["c" + (t + 1)], this.cookie.store()
  }, E.prototype.handleNumClocksChange = function() {
    this.adjustTheNumberOfSides(), this.cookie.num_clocks = this.numClocks.getNum(), this.cookie
      .store(), this.saveAllSideStatesToCookie()
  }, E.prototype.saveAllSideStatesToCookie = function() {
    for (var t = 0; t < this.sideModels.length; t++) this.cookie["c" + (t + 1)] = this.sideViews[t]
      .getContextValue();
    this.cookie.store()
  }, E.prototype.adjustTheNumberOfSides = function() {
    for (; this.numClocks.getNum() != this.sideViews.length;) this.numClocks.getNum() > this.sideViews
      .length ? this.addSide(this.sideViews.length) : this.numClocks.getNum() < this.sideViews
      .length && this.deleteSide(this.sideViews.length - 1)
  }
}]);

})();
