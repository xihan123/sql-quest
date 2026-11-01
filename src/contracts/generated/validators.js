/* Generated from schemas/contracts.schema.json. Do not edit. */
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS({
  "node_modules/ajv-formats/dist/formats.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
    function fmtDef(validate, compare) {
      return { validate, compare };
    }
    exports.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: fmtDef(date, compareDate),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: fmtDef(getTime(true), compareTime),
      "date-time": fmtDef(getDateTime(true), compareDateTime),
      "iso-time": fmtDef(getTime(), compareIsoTime),
      "iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte,
      // signed 32 bit integer
      int32: { type: "number", validate: validateInt32 },
      // signed 64 bit integer
      int64: { type: "number", validate: validateInt64 },
      // C-type float
      float: { type: "number", validate: validateNumber },
      // C-type double
      double: { type: "number", validate: validateNumber },
      // hint to the UI to hide input strings
      password: true,
      // unchecked string payload
      binary: true
    };
    exports.fastFormats = {
      ...exports.fullFormats,
      date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
      time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
      "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
      "iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
      "iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    exports.formatNames = Object.keys(exports.fullFormats);
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
    var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function date(str) {
      const matches = DATE.exec(str);
      if (!matches)
        return false;
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
    }
    function compareDate(d1, d2) {
      if (!(d1 && d2))
        return void 0;
      if (d1 > d2)
        return 1;
      if (d1 < d2)
        return -1;
      return 0;
    }
    var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function getTime(strictTimeZone) {
      return function time(str) {
        const matches = TIME.exec(str);
        if (!matches)
          return false;
        const hr = +matches[1];
        const min = +matches[2];
        const sec = +matches[3];
        const tz = matches[4];
        const tzSign = matches[5] === "-" ? -1 : 1;
        const tzH = +(matches[6] || 0);
        const tzM = +(matches[7] || 0);
        if (tzH > 23 || tzM > 59 || strictTimeZone && !tz)
          return false;
        if (hr <= 23 && min <= 59 && sec < 60)
          return true;
        const utcMin = min - tzM * tzSign;
        const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
        return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
      };
    }
    function compareTime(s1, s2) {
      if (!(s1 && s2))
        return void 0;
      const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
      const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
      if (!(t1 && t2))
        return void 0;
      return t1 - t2;
    }
    function compareIsoTime(t1, t2) {
      if (!(t1 && t2))
        return void 0;
      const a1 = TIME.exec(t1);
      const a2 = TIME.exec(t2);
      if (!(a1 && a2))
        return void 0;
      t1 = a1[1] + a1[2] + a1[3];
      t2 = a2[1] + a2[2] + a2[3];
      if (t1 > t2)
        return 1;
      if (t1 < t2)
        return -1;
      return 0;
    }
    var DATE_TIME_SEPARATOR = /t|\s/i;
    function getDateTime(strictTimeZone) {
      const time = getTime(strictTimeZone);
      return function date_time(str) {
        const dateTime = str.split(DATE_TIME_SEPARATOR);
        return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
      };
    }
    function compareDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const d1 = new Date(dt1).valueOf();
      const d2 = new Date(dt2).valueOf();
      if (!(d1 && d2))
        return void 0;
      return d1 - d2;
    }
    function compareIsoDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
      const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
      const res = compareDate(d1, d2);
      if (res === void 0)
        return void 0;
      return res || compareTime(t1, t2);
    }
    var NOT_URI_FRAGMENT = /\/|:/;
    var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function uri(str) {
      return NOT_URI_FRAGMENT.test(str) && URI.test(str);
    }
    var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function byte(str) {
      BYTE.lastIndex = 0;
      return BYTE.test(str);
    }
    var MIN_INT32 = -(2 ** 31);
    var MAX_INT32 = 2 ** 31 - 1;
    function validateInt32(value) {
      return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
    }
    function validateInt64(value) {
      return Number.isInteger(value);
    }
    function validateNumber() {
      return true;
    }
    var Z_ANCHOR = /[^\\]\\Z/;
    function regex(str) {
      if (Z_ANCHOR.test(str))
        return false;
      try {
        new RegExp(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// standalone-validators.js
var validateContentIdStructure = validate289;
var func55 = require_ucs2length().default;
var pattern0 = new RegExp("^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?![\\s\\S])", "u");
function validate289(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 64) {
        validate289.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 64 }, message: "must NOT have more than 64 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate289.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern0.test(data)) {
            validate289.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?![\\s\\S])" }, message: 'must match pattern "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?![\\s\\S])"' }];
            return false;
          }
        }
      }
    } else {
      validate289.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate289.errors = vErrors;
  return errors === 0;
}
var validateIdentifierStructure = validate290;
var pattern4 = new RegExp("^[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?![\\s\\S])", "u");
function validate290(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 64) {
        validate290.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 64 }, message: "must NOT have more than 64 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate290.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern4.test(data)) {
            validate290.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "^[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?![\\s\\S])" }, message: 'must match pattern "^[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?![\\s\\S])"' }];
            return false;
          }
        }
      }
    } else {
      validate290.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate290.errors = vErrors;
  return errors === 0;
}
var validateTokenStructure = validate291;
var pattern8 = new RegExp("^[A-Za-z0-9_-]+(?![\\s\\S])", "u");
function validate291(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 128) {
        validate291.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 128 }, message: "must NOT have more than 128 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate291.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern8.test(data)) {
            validate291.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "^[A-Za-z0-9_-]+(?![\\s\\S])" }, message: 'must match pattern "^[A-Za-z0-9_-]+(?![\\s\\S])"' }];
            return false;
          }
        }
      }
    } else {
      validate291.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate291.errors = vErrors;
  return errors === 0;
}
var validateRevisionStructure = validate292;
function validate292(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (!(typeof data == "number" && (!(data % 1) && !isNaN(data)) && isFinite(data))) {
    validate292.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
    return false;
  }
  if (errors === 0) {
    if (typeof data == "number" && isFinite(data)) {
      if (data > 9007199254740991 || isNaN(data)) {
        validate292.errors = [{ instancePath, schemaPath: "#/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
        return false;
      } else {
        if (data < 1 || isNaN(data)) {
          validate292.errors = [{ instancePath, schemaPath: "#/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" }];
          return false;
        }
      }
    }
  }
  validate292.errors = vErrors;
  return errors === 0;
}
var validateCounterStructure = validate293;
function validate293(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (!(typeof data == "number" && (!(data % 1) && !isNaN(data)) && isFinite(data))) {
    validate293.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
    return false;
  }
  if (errors === 0) {
    if (typeof data == "number" && isFinite(data)) {
      if (data > 9007199254740991 || isNaN(data)) {
        validate293.errors = [{ instancePath, schemaPath: "#/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
        return false;
      } else {
        if (data < 0 || isNaN(data)) {
          validate293.errors = [{ instancePath, schemaPath: "#/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
          return false;
        }
      }
    }
  }
  validate293.errors = vErrors;
  return errors === 0;
}
var validateSafeIntegerStructure = validate294;
function validate294(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (!(typeof data == "number" && (!(data % 1) && !isNaN(data)) && isFinite(data))) {
    validate294.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
    return false;
  }
  if (errors === 0) {
    if (typeof data == "number" && isFinite(data)) {
      if (data > 9007199254740991 || isNaN(data)) {
        validate294.errors = [{ instancePath, schemaPath: "#/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
        return false;
      } else {
        if (data < -9007199254740991 || isNaN(data)) {
          validate294.errors = [{ instancePath, schemaPath: "#/minimum", keyword: "minimum", params: { comparison: ">=", limit: -9007199254740991 }, message: "must be >= -9007199254740991" }];
          return false;
        }
      }
    }
  }
  validate294.errors = vErrors;
  return errors === 0;
}
var validateSafeNumberStructure = validate295;
function validate295(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data == "number" && isFinite(data)) {
      if (data > 9007199254740991 || isNaN(data)) {
        validate295.errors = [{ instancePath, schemaPath: "#/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
        return false;
      } else {
        if (data < -9007199254740991 || isNaN(data)) {
          validate295.errors = [{ instancePath, schemaPath: "#/minimum", keyword: "minimum", params: { comparison: ">=", limit: -9007199254740991 }, message: "must be >= -9007199254740991" }];
          return false;
        }
      }
    } else {
      validate295.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
      return false;
    }
  }
  validate295.errors = vErrors;
  return errors === 0;
}
var validateTitleStructure = validate296;
var pattern1 = new RegExp("\\S", "u");
function validate296(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 256) {
        validate296.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 256 }, message: "must NOT have more than 256 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate296.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern1.test(data)) {
            validate296.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
            return false;
          }
        }
      }
    } else {
      validate296.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate296.errors = vErrors;
  return errors === 0;
}
var validateProseStructure = validate297;
function validate297(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 1e4) {
        validate297.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 1e4 }, message: "must NOT have more than 10000 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate297.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern1.test(data)) {
            validate297.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
            return false;
          }
        }
      }
    } else {
      validate297.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate297.errors = vErrors;
  return errors === 0;
}
var validateDescriptionStructure = validate298;
function validate298(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 2e3) {
        validate298.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 2e3 }, message: "must NOT have more than 2000 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate298.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern1.test(data)) {
            validate298.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
            return false;
          }
        }
      }
    } else {
      validate298.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate298.errors = vErrors;
  return errors === 0;
}
var validateSqlStructure = validate299;
function validate299(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 2e4) {
        validate299.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 2e4 }, message: "must NOT have more than 20000 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate299.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern1.test(data)) {
            validate299.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
            return false;
          }
        }
      }
    } else {
      validate299.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate299.errors = vErrors;
  return errors === 0;
}
var validateSqlDraftStructure = validate300;
function validate300(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 2e4) {
        validate300.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 2e4 }, message: "must NOT have more than 20000 characters" }];
        return false;
      } else {
        if (func55(data) < 0) {
          validate300.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 0 }, message: "must NOT have fewer than 0 characters" }];
          return false;
        }
      }
    } else {
      validate300.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate300.errors = vErrors;
  return errors === 0;
}
var validateContentPathStructure = validate301;
var pattern3 = new RegExp("^(?:[a-z0-9_-]+/)*[a-z0-9_-]+\\.json(?![\\s\\S])", "u");
function validate301(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 512) {
        validate301.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 512 }, message: "must NOT have more than 512 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate301.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern3.test(data)) {
            validate301.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "^(?:[a-z0-9_-]+/)*[a-z0-9_-]+\\.json(?![\\s\\S])" }, message: 'must match pattern "^(?:[a-z0-9_-]+/)*[a-z0-9_-]+\\.json(?![\\s\\S])"' }];
            return false;
          }
        }
      }
    } else {
      validate301.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate301.errors = vErrors;
  return errors === 0;
}
var validateTimestampStructure = validate302;
var formats0 = require_formats().fullFormats["date-time"];
var pattern9 = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\.[0-9]{3}Z$", "u");
function validate302(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (errors === 0) {
      if (typeof data === "string") {
        if (func55(data) > 24) {
          validate302.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 24 }, message: "must NOT have more than 24 characters" }];
          return false;
        } else {
          if (func55(data) < 24) {
            validate302.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 24 }, message: "must NOT have fewer than 24 characters" }];
            return false;
          } else {
            if (!pattern9.test(data)) {
              validate302.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\.[0-9]{3}Z$" }, message: 'must match pattern "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\.[0-9]{3}Z$"' }];
              return false;
            } else {
              if (!formats0.validate(data)) {
                validate302.errors = [{ instancePath, schemaPath: "#/format", keyword: "format", params: { format: "date-time" }, message: 'must match format "date-time"' }];
                return false;
              }
            }
          }
        }
      } else {
        validate302.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
        return false;
      }
    }
  }
  validate302.errors = vErrors;
  return errors === 0;
}
var validateInputModeStructure = validate303;
var schema58 = { "type": "string", "enum": ["text", "puzzle"] };
function validate303(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (typeof data !== "string") {
    validate303.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
    return false;
  }
  if (!(data === "text" || data === "puzzle")) {
    validate303.errors = [{ instancePath, schemaPath: "#/enum", keyword: "enum", params: { allowedValues: schema58.enum }, message: "must be equal to one of the allowed values" }];
    return false;
  }
  validate303.errors = vErrors;
  return errors === 0;
}
var validateExecutionModeStructure = validate304;
var schema57 = { "type": "string", "enum": ["run", "submit"] };
function validate304(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (typeof data !== "string") {
    validate304.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
    return false;
  }
  if (!(data === "run" || data === "submit")) {
    validate304.errors = [{ instancePath, schemaPath: "#/enum", keyword: "enum", params: { allowedValues: schema57.enum }, message: "must be equal to one of the allowed values" }];
    return false;
  }
  validate304.errors = vErrors;
  return errors === 0;
}
var validateHintIdStructure = validate305;
var schema69 = { "type": "string", "enum": ["idea", "syntax", "skeleton"] };
function validate305(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (typeof data !== "string") {
    validate305.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
    return false;
  }
  if (!(data === "idea" || data === "syntax" || data === "skeleton")) {
    validate305.errors = [{ instancePath, schemaPath: "#/enum", keyword: "enum", params: { allowedValues: schema69.enum }, message: "must be equal to one of the allowed values" }];
    return false;
  }
  validate305.errors = vErrors;
  return errors === 0;
}
var validateLessonIndexStructure = validate306;
var func0 = Object.prototype.hasOwnProperty;
var func32 = require_equal().default;
function validate23(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 64) {
        validate23.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 64 }, message: "must NOT have more than 64 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate23.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern0.test(data)) {
            validate23.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?![\\s\\S])" }, message: 'must match pattern "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?![\\s\\S])"' }];
            return false;
          }
        }
      }
    } else {
      validate23.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate23.errors = vErrors;
  return errors === 0;
}
function validate27(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 256) {
        validate27.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 256 }, message: "must NOT have more than 256 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate27.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern1.test(data)) {
            validate27.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
            return false;
          }
        }
      }
    } else {
      validate27.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate27.errors = vErrors;
  return errors === 0;
}
function validate41(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 512) {
        validate41.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 512 }, message: "must NOT have more than 512 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate41.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern3.test(data)) {
            validate41.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "^(?:[a-z0-9_-]+/)*[a-z0-9_-]+\\.json(?![\\s\\S])" }, message: 'must match pattern "^(?:[a-z0-9_-]+/)*[a-z0-9_-]+\\.json(?![\\s\\S])"' }];
            return false;
          }
        }
      }
    } else {
      validate41.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate41.errors = vErrors;
  return errors === 0;
}
function validate306(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.title === void 0 || !func0.call(data, "title")) && (missing0 = "title") || (data.prerequisites === void 0 || !func0.call(data, "prerequisites")) && (missing0 = "prerequisites") || (data.path === void 0 || !func0.call(data, "path")) && (missing0 = "path")) {
        validate306.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "title" || key0 === "prerequisites" || key0 === "path")) {
            validate306.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.title !== void 0 && func0.call(data, "title")) {
              const _errs3 = errors;
              if (!validate27(data.title, { instancePath: instancePath + "/title", parentData: data, parentDataProperty: "title", rootData })) {
                vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.prerequisites !== void 0 && func0.call(data, "prerequisites")) {
                let data2 = data.prerequisites;
                const _errs4 = errors;
                if (errors === _errs4) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 256) {
                      validate306.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                      return false;
                    } else {
                      if (data2.length < 0) {
                        validate306.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs6 = errors;
                          if (!validate23(data2[i0], { instancePath: instancePath + "/prerequisites/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs6 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                        if (valid1) {
                          let i1 = data2.length;
                          let j0;
                          if (i1 > 1) {
                            outer0:
                              for (; i1--; ) {
                                for (j0 = i1; j0--; ) {
                                  if (func32(data2[i1], data2[j0])) {
                                    validate306.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" }];
                                    return false;
                                    break outer0;
                                  }
                                }
                              }
                          }
                        }
                      }
                    }
                  } else {
                    validate306.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.path !== void 0 && func0.call(data, "path")) {
                  let data4 = data.path;
                  const _errs7 = errors;
                  const _errs8 = errors;
                  let valid3 = false;
                  const _errs9 = errors;
                  if (!validate41(data4, { instancePath: instancePath + "/path", parentData: data, parentDataProperty: "path", rootData })) {
                    vErrors = vErrors === null ? validate41.errors : vErrors.concat(validate41.errors);
                    errors = vErrors.length;
                  }
                  var _valid0 = _errs9 === errors;
                  valid3 = valid3 || _valid0;
                  if (!valid3) {
                    const _errs10 = errors;
                    if (data4 !== null) {
                      const err0 = { instancePath: instancePath + "/path", schemaPath: "#/properties/path/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                      if (vErrors === null) {
                        vErrors = [err0];
                      } else {
                        vErrors.push(err0);
                      }
                      errors++;
                    }
                    var _valid0 = _errs10 === errors;
                    valid3 = valid3 || _valid0;
                  }
                  if (!valid3) {
                    const err1 = { instancePath: instancePath + "/path", schemaPath: "#/properties/path/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                    if (vErrors === null) {
                      vErrors = [err1];
                    } else {
                      vErrors.push(err1);
                    }
                    errors++;
                    validate306.errors = vErrors;
                    return false;
                  } else {
                    errors = _errs8;
                    if (vErrors !== null) {
                      if (_errs8) {
                        vErrors.length = _errs8;
                      } else {
                        vErrors = null;
                      }
                    }
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate306.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate306.errors = vErrors;
  return errors === 0;
}
var validateChapterStructure = validate311;
function validate37(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.title === void 0 || !func0.call(data, "title")) && (missing0 = "title") || (data.prerequisites === void 0 || !func0.call(data, "prerequisites")) && (missing0 = "prerequisites") || (data.path === void 0 || !func0.call(data, "path")) && (missing0 = "path")) {
        validate37.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "title" || key0 === "prerequisites" || key0 === "path")) {
            validate37.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.title !== void 0 && func0.call(data, "title")) {
              const _errs3 = errors;
              if (!validate27(data.title, { instancePath: instancePath + "/title", parentData: data, parentDataProperty: "title", rootData })) {
                vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.prerequisites !== void 0 && func0.call(data, "prerequisites")) {
                let data2 = data.prerequisites;
                const _errs4 = errors;
                if (errors === _errs4) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 256) {
                      validate37.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                      return false;
                    } else {
                      if (data2.length < 0) {
                        validate37.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs6 = errors;
                          if (!validate23(data2[i0], { instancePath: instancePath + "/prerequisites/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs6 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                        if (valid1) {
                          let i1 = data2.length;
                          let j0;
                          if (i1 > 1) {
                            outer0:
                              for (; i1--; ) {
                                for (j0 = i1; j0--; ) {
                                  if (func32(data2[i1], data2[j0])) {
                                    validate37.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" }];
                                    return false;
                                    break outer0;
                                  }
                                }
                              }
                          }
                        }
                      }
                    }
                  } else {
                    validate37.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.path !== void 0 && func0.call(data, "path")) {
                  let data4 = data.path;
                  const _errs7 = errors;
                  const _errs8 = errors;
                  let valid3 = false;
                  const _errs9 = errors;
                  if (!validate41(data4, { instancePath: instancePath + "/path", parentData: data, parentDataProperty: "path", rootData })) {
                    vErrors = vErrors === null ? validate41.errors : vErrors.concat(validate41.errors);
                    errors = vErrors.length;
                  }
                  var _valid0 = _errs9 === errors;
                  valid3 = valid3 || _valid0;
                  if (!valid3) {
                    const _errs10 = errors;
                    if (data4 !== null) {
                      const err0 = { instancePath: instancePath + "/path", schemaPath: "#/properties/path/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                      if (vErrors === null) {
                        vErrors = [err0];
                      } else {
                        vErrors.push(err0);
                      }
                      errors++;
                    }
                    var _valid0 = _errs10 === errors;
                    valid3 = valid3 || _valid0;
                  }
                  if (!valid3) {
                    const err1 = { instancePath: instancePath + "/path", schemaPath: "#/properties/path/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                    if (vErrors === null) {
                      vErrors = [err1];
                    } else {
                      vErrors.push(err1);
                    }
                    errors++;
                    validate37.errors = vErrors;
                    return false;
                  } else {
                    errors = _errs8;
                    if (vErrors !== null) {
                      if (_errs8) {
                        vErrors.length = _errs8;
                      } else {
                        vErrors = null;
                      }
                    }
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate37.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate37.errors = vErrors;
  return errors === 0;
}
function validate311(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.title === void 0 || !func0.call(data, "title")) && (missing0 = "title") || (data.lessons === void 0 || !func0.call(data, "lessons")) && (missing0 = "lessons")) {
        validate311.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "title" || key0 === "lessons")) {
            validate311.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.title !== void 0 && func0.call(data, "title")) {
              const _errs3 = errors;
              if (!validate27(data.title, { instancePath: instancePath + "/title", parentData: data, parentDataProperty: "title", rootData })) {
                vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.lessons !== void 0 && func0.call(data, "lessons")) {
                let data2 = data.lessons;
                const _errs4 = errors;
                if (errors === _errs4) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 256) {
                      validate311.errors = [{ instancePath: instancePath + "/lessons", schemaPath: "#/properties/lessons/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                      return false;
                    } else {
                      if (data2.length < 1) {
                        validate311.errors = [{ instancePath: instancePath + "/lessons", schemaPath: "#/properties/lessons/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs6 = errors;
                          if (!validate37(data2[i0], { instancePath: instancePath + "/lessons/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs6 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate311.errors = [{ instancePath: instancePath + "/lessons", schemaPath: "#/properties/lessons/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate311.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate311.errors = vErrors;
  return errors === 0;
}
var validateConceptStructure = validate315;
function validate315(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.title === void 0 || !func0.call(data, "title")) && (missing0 = "title") || (data.introducedAt === void 0 || !func0.call(data, "introducedAt")) && (missing0 = "introducedAt")) {
        validate315.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "title" || key0 === "introducedAt")) {
            validate315.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.title !== void 0 && func0.call(data, "title")) {
              const _errs3 = errors;
              if (!validate27(data.title, { instancePath: instancePath + "/title", parentData: data, parentDataProperty: "title", rootData })) {
                vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.introducedAt !== void 0 && func0.call(data, "introducedAt")) {
                const _errs4 = errors;
                if (!validate23(data.introducedAt, { instancePath: instancePath + "/introducedAt", parentData: data, parentDataProperty: "introducedAt", rootData })) {
                  vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate315.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate315.errors = vErrors;
  return errors === 0;
}
var validateThemeStructure = validate319;
function validate34(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.title === void 0 || !func0.call(data, "title")) && (missing0 = "title") || (data.lessons === void 0 || !func0.call(data, "lessons")) && (missing0 = "lessons")) {
        validate34.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "title" || key0 === "lessons")) {
            validate34.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.title !== void 0 && func0.call(data, "title")) {
              const _errs3 = errors;
              if (!validate27(data.title, { instancePath: instancePath + "/title", parentData: data, parentDataProperty: "title", rootData })) {
                vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.lessons !== void 0 && func0.call(data, "lessons")) {
                let data2 = data.lessons;
                const _errs4 = errors;
                if (errors === _errs4) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 256) {
                      validate34.errors = [{ instancePath: instancePath + "/lessons", schemaPath: "#/properties/lessons/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                      return false;
                    } else {
                      if (data2.length < 1) {
                        validate34.errors = [{ instancePath: instancePath + "/lessons", schemaPath: "#/properties/lessons/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs6 = errors;
                          if (!validate37(data2[i0], { instancePath: instancePath + "/lessons/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs6 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate34.errors = [{ instancePath: instancePath + "/lessons", schemaPath: "#/properties/lessons/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate34.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate34.errors = vErrors;
  return errors === 0;
}
function validate45(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.title === void 0 || !func0.call(data, "title")) && (missing0 = "title") || (data.introducedAt === void 0 || !func0.call(data, "introducedAt")) && (missing0 = "introducedAt")) {
        validate45.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "title" || key0 === "introducedAt")) {
            validate45.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.title !== void 0 && func0.call(data, "title")) {
              const _errs3 = errors;
              if (!validate27(data.title, { instancePath: instancePath + "/title", parentData: data, parentDataProperty: "title", rootData })) {
                vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.introducedAt !== void 0 && func0.call(data, "introducedAt")) {
                const _errs4 = errors;
                if (!validate23(data.introducedAt, { instancePath: instancePath + "/introducedAt", parentData: data, parentDataProperty: "introducedAt", rootData })) {
                  vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate45.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate45.errors = vErrors;
  return errors === 0;
}
function validate319(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.title === void 0 || !func0.call(data, "title")) && (missing0 = "title") || (data.chapters === void 0 || !func0.call(data, "chapters")) && (missing0 = "chapters") || (data.concepts === void 0 || !func0.call(data, "concepts")) && (missing0 = "concepts")) {
        validate319.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "title" || key0 === "chapters" || key0 === "concepts")) {
            validate319.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.title !== void 0 && func0.call(data, "title")) {
              const _errs3 = errors;
              if (!validate27(data.title, { instancePath: instancePath + "/title", parentData: data, parentDataProperty: "title", rootData })) {
                vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.chapters !== void 0 && func0.call(data, "chapters")) {
                let data2 = data.chapters;
                const _errs4 = errors;
                if (errors === _errs4) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 64) {
                      validate319.errors = [{ instancePath: instancePath + "/chapters", schemaPath: "#/properties/chapters/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                      return false;
                    } else {
                      if (data2.length < 1) {
                        validate319.errors = [{ instancePath: instancePath + "/chapters", schemaPath: "#/properties/chapters/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs6 = errors;
                          if (!validate34(data2[i0], { instancePath: instancePath + "/chapters/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate34.errors : vErrors.concat(validate34.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs6 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate319.errors = [{ instancePath: instancePath + "/chapters", schemaPath: "#/properties/chapters/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.concepts !== void 0 && func0.call(data, "concepts")) {
                  let data4 = data.concepts;
                  const _errs7 = errors;
                  if (errors === _errs7) {
                    if (Array.isArray(data4)) {
                      if (data4.length > 256) {
                        validate319.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                        return false;
                      } else {
                        if (data4.length < 0) {
                          validate319.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                          return false;
                        } else {
                          var valid2 = true;
                          const len1 = data4.length;
                          for (let i1 = 0; i1 < len1; i1++) {
                            const _errs9 = errors;
                            if (!validate45(data4[i1], { instancePath: instancePath + "/concepts/" + i1, parentData: data4, parentDataProperty: i1, rootData })) {
                              vErrors = vErrors === null ? validate45.errors : vErrors.concat(validate45.errors);
                              errors = vErrors.length;
                            }
                            var valid2 = _errs9 === errors;
                            if (!valid2) {
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      validate319.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                      return false;
                    }
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate319.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate319.errors = vErrors;
  return errors === 0;
}
var validateFixtureIndexStructure = validate324;
function validate324(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.path === void 0 || !func0.call(data, "path")) && (missing0 = "path")) {
        validate324.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "path")) {
            validate324.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.path !== void 0 && func0.call(data, "path")) {
              const _errs3 = errors;
              if (!validate41(data.path, { instancePath: instancePath + "/path", parentData: data, parentDataProperty: "path", rootData })) {
                vErrors = vErrors === null ? validate41.errors : vErrors.concat(validate41.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate324.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate324.errors = vErrors;
  return errors === 0;
}
var validateCourseStructure = validate327;
function validate25(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (!(typeof data == "number" && (!(data % 1) && !isNaN(data)) && isFinite(data))) {
    validate25.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
    return false;
  }
  if (errors === 0) {
    if (typeof data == "number" && isFinite(data)) {
      if (data > 9007199254740991 || isNaN(data)) {
        validate25.errors = [{ instancePath, schemaPath: "#/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
        return false;
      } else {
        if (data < 1 || isNaN(data)) {
          validate25.errors = [{ instancePath, schemaPath: "#/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" }];
          return false;
        }
      }
    }
  }
  validate25.errors = vErrors;
  return errors === 0;
}
function validate29(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 1e4) {
        validate29.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 1e4 }, message: "must NOT have more than 10000 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate29.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern1.test(data)) {
            validate29.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
            return false;
          }
        }
      }
    } else {
      validate29.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate29.errors = vErrors;
  return errors === 0;
}
function validate31(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.title === void 0 || !func0.call(data, "title")) && (missing0 = "title") || (data.chapters === void 0 || !func0.call(data, "chapters")) && (missing0 = "chapters") || (data.concepts === void 0 || !func0.call(data, "concepts")) && (missing0 = "concepts")) {
        validate31.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "title" || key0 === "chapters" || key0 === "concepts")) {
            validate31.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.title !== void 0 && func0.call(data, "title")) {
              const _errs3 = errors;
              if (!validate27(data.title, { instancePath: instancePath + "/title", parentData: data, parentDataProperty: "title", rootData })) {
                vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.chapters !== void 0 && func0.call(data, "chapters")) {
                let data2 = data.chapters;
                const _errs4 = errors;
                if (errors === _errs4) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 64) {
                      validate31.errors = [{ instancePath: instancePath + "/chapters", schemaPath: "#/properties/chapters/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                      return false;
                    } else {
                      if (data2.length < 1) {
                        validate31.errors = [{ instancePath: instancePath + "/chapters", schemaPath: "#/properties/chapters/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs6 = errors;
                          if (!validate34(data2[i0], { instancePath: instancePath + "/chapters/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate34.errors : vErrors.concat(validate34.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs6 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate31.errors = [{ instancePath: instancePath + "/chapters", schemaPath: "#/properties/chapters/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.concepts !== void 0 && func0.call(data, "concepts")) {
                  let data4 = data.concepts;
                  const _errs7 = errors;
                  if (errors === _errs7) {
                    if (Array.isArray(data4)) {
                      if (data4.length > 256) {
                        validate31.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                        return false;
                      } else {
                        if (data4.length < 0) {
                          validate31.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                          return false;
                        } else {
                          var valid2 = true;
                          const len1 = data4.length;
                          for (let i1 = 0; i1 < len1; i1++) {
                            const _errs9 = errors;
                            if (!validate45(data4[i1], { instancePath: instancePath + "/concepts/" + i1, parentData: data4, parentDataProperty: i1, rootData })) {
                              vErrors = vErrors === null ? validate45.errors : vErrors.concat(validate45.errors);
                              errors = vErrors.length;
                            }
                            var valid2 = _errs9 === errors;
                            if (!valid2) {
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      validate31.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                      return false;
                    }
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate31.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate31.errors = vErrors;
  return errors === 0;
}
function validate51(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.path === void 0 || !func0.call(data, "path")) && (missing0 = "path")) {
        validate51.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "path")) {
            validate51.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.path !== void 0 && func0.call(data, "path")) {
              const _errs3 = errors;
              if (!validate41(data.path, { instancePath: instancePath + "/path", parentData: data, parentDataProperty: "path", rootData })) {
                vErrors = vErrors === null ? validate41.errors : vErrors.concat(validate41.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate51.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate51.errors = vErrors;
  return errors === 0;
}
function validate327(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.revision === void 0 || !func0.call(data, "revision")) && (missing0 = "revision") || (data.title === void 0 || !func0.call(data, "title")) && (missing0 = "title") || (data.objective === void 0 || !func0.call(data, "objective")) && (missing0 = "objective") || (data.dialect === void 0 || !func0.call(data, "dialect")) && (missing0 = "dialect") || (data.themes === void 0 || !func0.call(data, "themes")) && (missing0 = "themes") || (data.fixtures === void 0 || !func0.call(data, "fixtures")) && (missing0 = "fixtures")) {
        validate327.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "schemaVersion" || key0 === "id" || key0 === "revision" || key0 === "title" || key0 === "objective" || key0 === "dialect" || key0 === "themes" || key0 === "fixtures")) {
            validate327.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
            let data0 = data.schemaVersion;
            const _errs3 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)) && isFinite(data0))) {
              validate327.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (1 !== data0) {
              validate327.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.id !== void 0 && func0.call(data, "id")) {
              const _errs5 = errors;
              if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.revision !== void 0 && func0.call(data, "revision")) {
                const _errs6 = errors;
                if (!validate25(data.revision, { instancePath: instancePath + "/revision", parentData: data, parentDataProperty: "revision", rootData })) {
                  vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.title !== void 0 && func0.call(data, "title")) {
                  const _errs7 = errors;
                  if (!validate27(data.title, { instancePath: instancePath + "/title", parentData: data, parentDataProperty: "title", rootData })) {
                    vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.objective !== void 0 && func0.call(data, "objective")) {
                    const _errs8 = errors;
                    if (!validate29(data.objective, { instancePath: instancePath + "/objective", parentData: data, parentDataProperty: "objective", rootData })) {
                      vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.dialect !== void 0 && func0.call(data, "dialect")) {
                      let data5 = data.dialect;
                      const _errs9 = errors;
                      if (typeof data5 !== "string") {
                        validate327.errors = [{ instancePath: instancePath + "/dialect", schemaPath: "#/properties/dialect/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                      if ("sqlite" !== data5) {
                        validate327.errors = [{ instancePath: instancePath + "/dialect", schemaPath: "#/properties/dialect/const", keyword: "const", params: { allowedValue: "sqlite" }, message: "must be equal to constant" }];
                        return false;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themes !== void 0 && func0.call(data, "themes")) {
                        let data6 = data.themes;
                        const _errs11 = errors;
                        if (errors === _errs11) {
                          if (Array.isArray(data6)) {
                            if (data6.length > 64) {
                              validate327.errors = [{ instancePath: instancePath + "/themes", schemaPath: "#/properties/themes/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                              return false;
                            } else {
                              if (data6.length < 1) {
                                validate327.errors = [{ instancePath: instancePath + "/themes", schemaPath: "#/properties/themes/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                return false;
                              } else {
                                var valid1 = true;
                                const len0 = data6.length;
                                for (let i0 = 0; i0 < len0; i0++) {
                                  const _errs13 = errors;
                                  if (!validate31(data6[i0], { instancePath: instancePath + "/themes/" + i0, parentData: data6, parentDataProperty: i0, rootData })) {
                                    vErrors = vErrors === null ? validate31.errors : vErrors.concat(validate31.errors);
                                    errors = vErrors.length;
                                  }
                                  var valid1 = _errs13 === errors;
                                  if (!valid1) {
                                    break;
                                  }
                                }
                              }
                            }
                          } else {
                            validate327.errors = [{ instancePath: instancePath + "/themes", schemaPath: "#/properties/themes/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                            return false;
                          }
                        }
                        var valid0 = _errs11 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.fixtures !== void 0 && func0.call(data, "fixtures")) {
                          let data8 = data.fixtures;
                          const _errs14 = errors;
                          if (errors === _errs14) {
                            if (Array.isArray(data8)) {
                              if (data8.length > 1024) {
                                validate327.errors = [{ instancePath: instancePath + "/fixtures", schemaPath: "#/properties/fixtures/maxItems", keyword: "maxItems", params: { limit: 1024 }, message: "must NOT have more than 1024 items" }];
                                return false;
                              } else {
                                if (data8.length < 0) {
                                  validate327.errors = [{ instancePath: instancePath + "/fixtures", schemaPath: "#/properties/fixtures/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                                  return false;
                                } else {
                                  var valid2 = true;
                                  const len1 = data8.length;
                                  for (let i1 = 0; i1 < len1; i1++) {
                                    const _errs16 = errors;
                                    if (!validate51(data8[i1], { instancePath: instancePath + "/fixtures/" + i1, parentData: data8, parentDataProperty: i1, rootData })) {
                                      vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
                                      errors = vErrors.length;
                                    }
                                    var valid2 = _errs16 === errors;
                                    if (!valid2) {
                                      break;
                                    }
                                  }
                                }
                              }
                            } else {
                              validate327.errors = [{ instancePath: instancePath + "/fixtures", schemaPath: "#/properties/fixtures/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                              return false;
                            }
                          }
                          var valid0 = _errs14 === errors;
                        } else {
                          var valid0 = true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate327.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate327.errors = vErrors;
  return errors === 0;
}
var validateCellStructure = validate334;
function validate104(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data == "number" && isFinite(data)) {
      if (data > 9007199254740991 || isNaN(data)) {
        validate104.errors = [{ instancePath, schemaPath: "#/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
        return false;
      } else {
        if (data < -9007199254740991 || isNaN(data)) {
          validate104.errors = [{ instancePath, schemaPath: "#/minimum", keyword: "minimum", params: { comparison: ">=", limit: -9007199254740991 }, message: "must be >= -9007199254740991" }];
          return false;
        }
      }
    } else {
      validate104.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
      return false;
    }
  }
  validate104.errors = vErrors;
  return errors === 0;
}
function validate334(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  const _errs1 = errors;
  if (data !== null) {
    const err0 = { instancePath, schemaPath: "#/anyOf/0/type", keyword: "type", params: { type: "null" }, message: "must be null" };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
  }
  var _valid0 = _errs1 === errors;
  valid0 = valid0 || _valid0;
  if (!valid0) {
    const _errs3 = errors;
    if (!validate104(data, { instancePath, parentData, parentDataProperty, rootData })) {
      vErrors = vErrors === null ? validate104.errors : vErrors.concat(validate104.errors);
      errors = vErrors.length;
    }
    var _valid0 = _errs3 === errors;
    valid0 = valid0 || _valid0;
    if (!valid0) {
      const _errs4 = errors;
      if (errors === _errs4) {
        if (typeof data === "string") {
          if (func55(data) > 1048576) {
            const err1 = { instancePath, schemaPath: "#/anyOf/2/maxLength", keyword: "maxLength", params: { limit: 1048576 }, message: "must NOT have more than 1048576 characters" };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          } else {
            if (func55(data) < 0) {
              const err2 = { instancePath, schemaPath: "#/anyOf/2/minLength", keyword: "minLength", params: { limit: 0 }, message: "must NOT have fewer than 0 characters" };
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
          }
        } else {
          const err3 = { instancePath, schemaPath: "#/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
      }
      var _valid0 = _errs4 === errors;
      valid0 = valid0 || _valid0;
    }
  }
  if (!valid0) {
    const err4 = { instancePath, schemaPath: "#/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
    if (vErrors === null) {
      vErrors = [err4];
    } else {
      vErrors.push(err4);
    }
    errors++;
    validate334.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate334.errors = vErrors;
  return errors === 0;
}
var validateRowStructure = validate336;
function validate103(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  const _errs1 = errors;
  if (data !== null) {
    const err0 = { instancePath, schemaPath: "#/anyOf/0/type", keyword: "type", params: { type: "null" }, message: "must be null" };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
  }
  var _valid0 = _errs1 === errors;
  valid0 = valid0 || _valid0;
  if (!valid0) {
    const _errs3 = errors;
    if (!validate104(data, { instancePath, parentData, parentDataProperty, rootData })) {
      vErrors = vErrors === null ? validate104.errors : vErrors.concat(validate104.errors);
      errors = vErrors.length;
    }
    var _valid0 = _errs3 === errors;
    valid0 = valid0 || _valid0;
    if (!valid0) {
      const _errs4 = errors;
      if (errors === _errs4) {
        if (typeof data === "string") {
          if (func55(data) > 1048576) {
            const err1 = { instancePath, schemaPath: "#/anyOf/2/maxLength", keyword: "maxLength", params: { limit: 1048576 }, message: "must NOT have more than 1048576 characters" };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          } else {
            if (func55(data) < 0) {
              const err2 = { instancePath, schemaPath: "#/anyOf/2/minLength", keyword: "minLength", params: { limit: 0 }, message: "must NOT have fewer than 0 characters" };
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
          }
        } else {
          const err3 = { instancePath, schemaPath: "#/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
      }
      var _valid0 = _errs4 === errors;
      valid0 = valid0 || _valid0;
    }
  }
  if (!valid0) {
    const err4 = { instancePath, schemaPath: "#/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
    if (vErrors === null) {
      vErrors = [err4];
    } else {
      vErrors.push(err4);
    }
    errors++;
    validate103.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate103.errors = vErrors;
  return errors === 0;
}
function validate336(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (Array.isArray(data)) {
      if (data.length > 100) {
        validate336.errors = [{ instancePath, schemaPath: "#/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
        return false;
      } else {
        if (data.length < 1) {
          validate336.errors = [{ instancePath, schemaPath: "#/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
          return false;
        } else {
          var valid0 = true;
          const len0 = data.length;
          for (let i0 = 0; i0 < len0; i0++) {
            const _errs1 = errors;
            if (!validate103(data[i0], { instancePath: instancePath + "/" + i0, parentData: data, parentDataProperty: i0, rootData })) {
              vErrors = vErrors === null ? validate103.errors : vErrors.concat(validate103.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs1 === errors;
            if (!valid0) {
              break;
            }
          }
        }
      }
    } else {
      validate336.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
      return false;
    }
  }
  validate336.errors = vErrors;
  return errors === 0;
}
var validateQueryResultStructure = validate338;
function validate102(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (Array.isArray(data)) {
      if (data.length > 100) {
        validate102.errors = [{ instancePath, schemaPath: "#/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
        return false;
      } else {
        if (data.length < 1) {
          validate102.errors = [{ instancePath, schemaPath: "#/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
          return false;
        } else {
          var valid0 = true;
          const len0 = data.length;
          for (let i0 = 0; i0 < len0; i0++) {
            const _errs1 = errors;
            if (!validate103(data[i0], { instancePath: instancePath + "/" + i0, parentData: data, parentDataProperty: i0, rootData })) {
              vErrors = vErrors === null ? validate103.errors : vErrors.concat(validate103.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs1 === errors;
            if (!valid0) {
              break;
            }
          }
        }
      }
    } else {
      validate102.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
      return false;
    }
  }
  validate102.errors = vErrors;
  return errors === 0;
}
function validate338(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.columns === void 0 || !func0.call(data, "columns")) && (missing0 = "columns") || (data.rows === void 0 || !func0.call(data, "rows")) && (missing0 = "rows")) {
        validate338.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "columns" || key0 === "rows")) {
            validate338.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.columns !== void 0 && func0.call(data, "columns")) {
            let data0 = data.columns;
            const _errs3 = errors;
            if (errors === _errs3) {
              if (Array.isArray(data0)) {
                if (data0.length > 100) {
                  validate338.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                  return false;
                } else {
                  if (data0.length < 1) {
                    validate338.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                    return false;
                  } else {
                    var valid1 = true;
                    const len0 = data0.length;
                    for (let i0 = 0; i0 < len0; i0++) {
                      let data1 = data0[i0];
                      const _errs5 = errors;
                      if (errors === _errs5) {
                        if (typeof data1 === "string") {
                          if (func55(data1) > 256) {
                            validate338.errors = [{ instancePath: instancePath + "/columns/" + i0, schemaPath: "#/properties/columns/items/maxLength", keyword: "maxLength", params: { limit: 256 }, message: "must NOT have more than 256 characters" }];
                            return false;
                          } else {
                            if (func55(data1) < 0) {
                              validate338.errors = [{ instancePath: instancePath + "/columns/" + i0, schemaPath: "#/properties/columns/items/minLength", keyword: "minLength", params: { limit: 0 }, message: "must NOT have fewer than 0 characters" }];
                              return false;
                            }
                          }
                        } else {
                          validate338.errors = [{ instancePath: instancePath + "/columns/" + i0, schemaPath: "#/properties/columns/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                          return false;
                        }
                      }
                      var valid1 = _errs5 === errors;
                      if (!valid1) {
                        break;
                      }
                    }
                  }
                }
              } else {
                validate338.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                return false;
              }
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.rows !== void 0 && func0.call(data, "rows")) {
              let data2 = data.rows;
              const _errs7 = errors;
              if (errors === _errs7) {
                if (Array.isArray(data2)) {
                  if (data2.length > 1e3) {
                    validate338.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/maxItems", keyword: "maxItems", params: { limit: 1e3 }, message: "must NOT have more than 1000 items" }];
                    return false;
                  } else {
                    if (data2.length < 0) {
                      validate338.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                      return false;
                    } else {
                      var valid2 = true;
                      const len1 = data2.length;
                      for (let i1 = 0; i1 < len1; i1++) {
                        const _errs9 = errors;
                        if (!validate102(data2[i1], { instancePath: instancePath + "/rows/" + i1, parentData: data2, parentDataProperty: i1, rootData })) {
                          vErrors = vErrors === null ? validate102.errors : vErrors.concat(validate102.errors);
                          errors = vErrors.length;
                        }
                        var valid2 = _errs9 === errors;
                        if (!valid2) {
                          break;
                        }
                      }
                    }
                  }
                } else {
                  validate338.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                  return false;
                }
              }
              var valid0 = _errs7 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate338.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate338.errors = vErrors;
  return errors === 0;
}
var validateToleranceStructure = validate340;
function validate340(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.column === void 0 || !func0.call(data, "column")) && (missing0 = "column") || (data.absTolerance === void 0 || !func0.call(data, "absTolerance")) && (missing0 = "absTolerance") || (data.relTolerance === void 0 || !func0.call(data, "relTolerance")) && (missing0 = "relTolerance")) {
        validate340.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "column" || key0 === "absTolerance" || key0 === "relTolerance")) {
            validate340.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.column !== void 0 && func0.call(data, "column")) {
            let data0 = data.column;
            const _errs2 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)) && isFinite(data0))) {
              validate340.errors = [{ instancePath: instancePath + "/column", schemaPath: "#/properties/column/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (errors === _errs2) {
              if (typeof data0 == "number" && isFinite(data0)) {
                if (data0 > 99 || isNaN(data0)) {
                  validate340.errors = [{ instancePath: instancePath + "/column", schemaPath: "#/properties/column/maximum", keyword: "maximum", params: { comparison: "<=", limit: 99 }, message: "must be <= 99" }];
                  return false;
                } else {
                  if (data0 < 0 || isNaN(data0)) {
                    validate340.errors = [{ instancePath: instancePath + "/column", schemaPath: "#/properties/column/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                    return false;
                  }
                }
              }
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.absTolerance !== void 0 && func0.call(data, "absTolerance")) {
              let data1 = data.absTolerance;
              const _errs4 = errors;
              if (errors === _errs4) {
                if (typeof data1 == "number" && isFinite(data1)) {
                  if (data1 > 9007199254740991 || isNaN(data1)) {
                    validate340.errors = [{ instancePath: instancePath + "/absTolerance", schemaPath: "#/properties/absTolerance/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
                    return false;
                  } else {
                    if (data1 < 0 || isNaN(data1)) {
                      validate340.errors = [{ instancePath: instancePath + "/absTolerance", schemaPath: "#/properties/absTolerance/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                      return false;
                    }
                  }
                } else {
                  validate340.errors = [{ instancePath: instancePath + "/absTolerance", schemaPath: "#/properties/absTolerance/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                  return false;
                }
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.relTolerance !== void 0 && func0.call(data, "relTolerance")) {
                let data2 = data.relTolerance;
                const _errs6 = errors;
                if (errors === _errs6) {
                  if (typeof data2 == "number" && isFinite(data2)) {
                    if (data2 > 9007199254740991 || isNaN(data2)) {
                      validate340.errors = [{ instancePath: instancePath + "/relTolerance", schemaPath: "#/properties/relTolerance/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
                      return false;
                    } else {
                      if (data2 < 0 || isNaN(data2)) {
                        validate340.errors = [{ instancePath: instancePath + "/relTolerance", schemaPath: "#/properties/relTolerance/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                        return false;
                      }
                    }
                  } else {
                    validate340.errors = [{ instancePath: instancePath + "/relTolerance", schemaPath: "#/properties/relTolerance/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                    return false;
                  }
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate340.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate340.errors = vErrors;
  return errors === 0;
}
var validateExactComparisonStructure = validate341;
var schema28 = { "type": "object", "additionalProperties": false, "properties": { "rowOrder": { "type": "string", "enum": ["ordered", "unordered"] }, "columnNames": { "const": "exact", "type": "string" }, "numbers": { "const": "exact", "type": "string" } }, "required": ["rowOrder", "columnNames", "numbers"] };
function validate341(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.rowOrder === void 0 || !func0.call(data, "rowOrder")) && (missing0 = "rowOrder") || (data.columnNames === void 0 || !func0.call(data, "columnNames")) && (missing0 = "columnNames") || (data.numbers === void 0 || !func0.call(data, "numbers")) && (missing0 = "numbers")) {
        validate341.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "rowOrder" || key0 === "columnNames" || key0 === "numbers")) {
            validate341.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.rowOrder !== void 0 && func0.call(data, "rowOrder")) {
            let data0 = data.rowOrder;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate341.errors = [{ instancePath: instancePath + "/rowOrder", schemaPath: "#/properties/rowOrder/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if (!(data0 === "ordered" || data0 === "unordered")) {
              validate341.errors = [{ instancePath: instancePath + "/rowOrder", schemaPath: "#/properties/rowOrder/enum", keyword: "enum", params: { allowedValues: schema28.properties.rowOrder.enum }, message: "must be equal to one of the allowed values" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.columnNames !== void 0 && func0.call(data, "columnNames")) {
              let data1 = data.columnNames;
              const _errs4 = errors;
              if (typeof data1 !== "string") {
                validate341.errors = [{ instancePath: instancePath + "/columnNames", schemaPath: "#/properties/columnNames/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              if ("exact" !== data1) {
                validate341.errors = [{ instancePath: instancePath + "/columnNames", schemaPath: "#/properties/columnNames/const", keyword: "const", params: { allowedValue: "exact" }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.numbers !== void 0 && func0.call(data, "numbers")) {
                let data2 = data.numbers;
                const _errs6 = errors;
                if (typeof data2 !== "string") {
                  validate341.errors = [{ instancePath: instancePath + "/numbers", schemaPath: "#/properties/numbers/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
                if ("exact" !== data2) {
                  validate341.errors = [{ instancePath: instancePath + "/numbers", schemaPath: "#/properties/numbers/const", keyword: "const", params: { allowedValue: "exact" }, message: "must be equal to constant" }];
                  return false;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate341.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate341.errors = vErrors;
  return errors === 0;
}
var validateTolerantComparisonStructure = validate342;
var schema29 = { "type": "object", "additionalProperties": false, "properties": { "rowOrder": { "type": "string", "enum": ["ordered", "unordered"] }, "columnNames": { "const": "exact", "type": "string" }, "numbers": { "const": "tolerant", "type": "string" }, "tolerances": { "type": "array", "items": { "$ref": "#/definitions/Tolerance" }, "minItems": 1, "maxItems": 100 } }, "required": ["rowOrder", "columnNames", "numbers", "tolerances"], "$comment": "Semantic: unique, in-range numeric output columns; author must justify tolerances." };
function validate94(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.column === void 0 || !func0.call(data, "column")) && (missing0 = "column") || (data.absTolerance === void 0 || !func0.call(data, "absTolerance")) && (missing0 = "absTolerance") || (data.relTolerance === void 0 || !func0.call(data, "relTolerance")) && (missing0 = "relTolerance")) {
        validate94.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "column" || key0 === "absTolerance" || key0 === "relTolerance")) {
            validate94.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.column !== void 0 && func0.call(data, "column")) {
            let data0 = data.column;
            const _errs2 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)) && isFinite(data0))) {
              validate94.errors = [{ instancePath: instancePath + "/column", schemaPath: "#/properties/column/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (errors === _errs2) {
              if (typeof data0 == "number" && isFinite(data0)) {
                if (data0 > 99 || isNaN(data0)) {
                  validate94.errors = [{ instancePath: instancePath + "/column", schemaPath: "#/properties/column/maximum", keyword: "maximum", params: { comparison: "<=", limit: 99 }, message: "must be <= 99" }];
                  return false;
                } else {
                  if (data0 < 0 || isNaN(data0)) {
                    validate94.errors = [{ instancePath: instancePath + "/column", schemaPath: "#/properties/column/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                    return false;
                  }
                }
              }
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.absTolerance !== void 0 && func0.call(data, "absTolerance")) {
              let data1 = data.absTolerance;
              const _errs4 = errors;
              if (errors === _errs4) {
                if (typeof data1 == "number" && isFinite(data1)) {
                  if (data1 > 9007199254740991 || isNaN(data1)) {
                    validate94.errors = [{ instancePath: instancePath + "/absTolerance", schemaPath: "#/properties/absTolerance/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
                    return false;
                  } else {
                    if (data1 < 0 || isNaN(data1)) {
                      validate94.errors = [{ instancePath: instancePath + "/absTolerance", schemaPath: "#/properties/absTolerance/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                      return false;
                    }
                  }
                } else {
                  validate94.errors = [{ instancePath: instancePath + "/absTolerance", schemaPath: "#/properties/absTolerance/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                  return false;
                }
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.relTolerance !== void 0 && func0.call(data, "relTolerance")) {
                let data2 = data.relTolerance;
                const _errs6 = errors;
                if (errors === _errs6) {
                  if (typeof data2 == "number" && isFinite(data2)) {
                    if (data2 > 9007199254740991 || isNaN(data2)) {
                      validate94.errors = [{ instancePath: instancePath + "/relTolerance", schemaPath: "#/properties/relTolerance/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
                      return false;
                    } else {
                      if (data2 < 0 || isNaN(data2)) {
                        validate94.errors = [{ instancePath: instancePath + "/relTolerance", schemaPath: "#/properties/relTolerance/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                        return false;
                      }
                    }
                  } else {
                    validate94.errors = [{ instancePath: instancePath + "/relTolerance", schemaPath: "#/properties/relTolerance/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                    return false;
                  }
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate94.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate94.errors = vErrors;
  return errors === 0;
}
function validate342(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.rowOrder === void 0 || !func0.call(data, "rowOrder")) && (missing0 = "rowOrder") || (data.columnNames === void 0 || !func0.call(data, "columnNames")) && (missing0 = "columnNames") || (data.numbers === void 0 || !func0.call(data, "numbers")) && (missing0 = "numbers") || (data.tolerances === void 0 || !func0.call(data, "tolerances")) && (missing0 = "tolerances")) {
        validate342.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "rowOrder" || key0 === "columnNames" || key0 === "numbers" || key0 === "tolerances")) {
            validate342.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.rowOrder !== void 0 && func0.call(data, "rowOrder")) {
            let data0 = data.rowOrder;
            const _errs3 = errors;
            if (typeof data0 !== "string") {
              validate342.errors = [{ instancePath: instancePath + "/rowOrder", schemaPath: "#/properties/rowOrder/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if (!(data0 === "ordered" || data0 === "unordered")) {
              validate342.errors = [{ instancePath: instancePath + "/rowOrder", schemaPath: "#/properties/rowOrder/enum", keyword: "enum", params: { allowedValues: schema29.properties.rowOrder.enum }, message: "must be equal to one of the allowed values" }];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.columnNames !== void 0 && func0.call(data, "columnNames")) {
              let data1 = data.columnNames;
              const _errs5 = errors;
              if (typeof data1 !== "string") {
                validate342.errors = [{ instancePath: instancePath + "/columnNames", schemaPath: "#/properties/columnNames/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              if ("exact" !== data1) {
                validate342.errors = [{ instancePath: instancePath + "/columnNames", schemaPath: "#/properties/columnNames/const", keyword: "const", params: { allowedValue: "exact" }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.numbers !== void 0 && func0.call(data, "numbers")) {
                let data2 = data.numbers;
                const _errs7 = errors;
                if (typeof data2 !== "string") {
                  validate342.errors = [{ instancePath: instancePath + "/numbers", schemaPath: "#/properties/numbers/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
                if ("tolerant" !== data2) {
                  validate342.errors = [{ instancePath: instancePath + "/numbers", schemaPath: "#/properties/numbers/const", keyword: "const", params: { allowedValue: "tolerant" }, message: "must be equal to constant" }];
                  return false;
                }
                var valid0 = _errs7 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.tolerances !== void 0 && func0.call(data, "tolerances")) {
                  let data3 = data.tolerances;
                  const _errs9 = errors;
                  if (errors === _errs9) {
                    if (Array.isArray(data3)) {
                      if (data3.length > 100) {
                        validate342.errors = [{ instancePath: instancePath + "/tolerances", schemaPath: "#/properties/tolerances/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                        return false;
                      } else {
                        if (data3.length < 1) {
                          validate342.errors = [{ instancePath: instancePath + "/tolerances", schemaPath: "#/properties/tolerances/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                          return false;
                        } else {
                          var valid1 = true;
                          const len0 = data3.length;
                          for (let i0 = 0; i0 < len0; i0++) {
                            const _errs11 = errors;
                            if (!validate94(data3[i0], { instancePath: instancePath + "/tolerances/" + i0, parentData: data3, parentDataProperty: i0, rootData })) {
                              vErrors = vErrors === null ? validate94.errors : vErrors.concat(validate94.errors);
                              errors = vErrors.length;
                            }
                            var valid1 = _errs11 === errors;
                            if (!valid1) {
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      validate342.errors = [{ instancePath: instancePath + "/tolerances", schemaPath: "#/properties/tolerances/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                      return false;
                    }
                  }
                  var valid0 = _errs9 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate342.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate342.errors = vErrors;
  return errors === 0;
}
var validateComparisonStructure = validate344;
function validate91(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.rowOrder === void 0 || !func0.call(data, "rowOrder")) && (missing0 = "rowOrder") || (data.columnNames === void 0 || !func0.call(data, "columnNames")) && (missing0 = "columnNames") || (data.numbers === void 0 || !func0.call(data, "numbers")) && (missing0 = "numbers")) {
        validate91.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "rowOrder" || key0 === "columnNames" || key0 === "numbers")) {
            validate91.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.rowOrder !== void 0 && func0.call(data, "rowOrder")) {
            let data0 = data.rowOrder;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate91.errors = [{ instancePath: instancePath + "/rowOrder", schemaPath: "#/properties/rowOrder/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if (!(data0 === "ordered" || data0 === "unordered")) {
              validate91.errors = [{ instancePath: instancePath + "/rowOrder", schemaPath: "#/properties/rowOrder/enum", keyword: "enum", params: { allowedValues: schema28.properties.rowOrder.enum }, message: "must be equal to one of the allowed values" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.columnNames !== void 0 && func0.call(data, "columnNames")) {
              let data1 = data.columnNames;
              const _errs4 = errors;
              if (typeof data1 !== "string") {
                validate91.errors = [{ instancePath: instancePath + "/columnNames", schemaPath: "#/properties/columnNames/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              if ("exact" !== data1) {
                validate91.errors = [{ instancePath: instancePath + "/columnNames", schemaPath: "#/properties/columnNames/const", keyword: "const", params: { allowedValue: "exact" }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.numbers !== void 0 && func0.call(data, "numbers")) {
                let data2 = data.numbers;
                const _errs6 = errors;
                if (typeof data2 !== "string") {
                  validate91.errors = [{ instancePath: instancePath + "/numbers", schemaPath: "#/properties/numbers/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
                if ("exact" !== data2) {
                  validate91.errors = [{ instancePath: instancePath + "/numbers", schemaPath: "#/properties/numbers/const", keyword: "const", params: { allowedValue: "exact" }, message: "must be equal to constant" }];
                  return false;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate91.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate91.errors = vErrors;
  return errors === 0;
}
function validate93(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.rowOrder === void 0 || !func0.call(data, "rowOrder")) && (missing0 = "rowOrder") || (data.columnNames === void 0 || !func0.call(data, "columnNames")) && (missing0 = "columnNames") || (data.numbers === void 0 || !func0.call(data, "numbers")) && (missing0 = "numbers") || (data.tolerances === void 0 || !func0.call(data, "tolerances")) && (missing0 = "tolerances")) {
        validate93.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "rowOrder" || key0 === "columnNames" || key0 === "numbers" || key0 === "tolerances")) {
            validate93.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.rowOrder !== void 0 && func0.call(data, "rowOrder")) {
            let data0 = data.rowOrder;
            const _errs3 = errors;
            if (typeof data0 !== "string") {
              validate93.errors = [{ instancePath: instancePath + "/rowOrder", schemaPath: "#/properties/rowOrder/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if (!(data0 === "ordered" || data0 === "unordered")) {
              validate93.errors = [{ instancePath: instancePath + "/rowOrder", schemaPath: "#/properties/rowOrder/enum", keyword: "enum", params: { allowedValues: schema29.properties.rowOrder.enum }, message: "must be equal to one of the allowed values" }];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.columnNames !== void 0 && func0.call(data, "columnNames")) {
              let data1 = data.columnNames;
              const _errs5 = errors;
              if (typeof data1 !== "string") {
                validate93.errors = [{ instancePath: instancePath + "/columnNames", schemaPath: "#/properties/columnNames/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              if ("exact" !== data1) {
                validate93.errors = [{ instancePath: instancePath + "/columnNames", schemaPath: "#/properties/columnNames/const", keyword: "const", params: { allowedValue: "exact" }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.numbers !== void 0 && func0.call(data, "numbers")) {
                let data2 = data.numbers;
                const _errs7 = errors;
                if (typeof data2 !== "string") {
                  validate93.errors = [{ instancePath: instancePath + "/numbers", schemaPath: "#/properties/numbers/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
                if ("tolerant" !== data2) {
                  validate93.errors = [{ instancePath: instancePath + "/numbers", schemaPath: "#/properties/numbers/const", keyword: "const", params: { allowedValue: "tolerant" }, message: "must be equal to constant" }];
                  return false;
                }
                var valid0 = _errs7 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.tolerances !== void 0 && func0.call(data, "tolerances")) {
                  let data3 = data.tolerances;
                  const _errs9 = errors;
                  if (errors === _errs9) {
                    if (Array.isArray(data3)) {
                      if (data3.length > 100) {
                        validate93.errors = [{ instancePath: instancePath + "/tolerances", schemaPath: "#/properties/tolerances/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                        return false;
                      } else {
                        if (data3.length < 1) {
                          validate93.errors = [{ instancePath: instancePath + "/tolerances", schemaPath: "#/properties/tolerances/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                          return false;
                        } else {
                          var valid1 = true;
                          const len0 = data3.length;
                          for (let i0 = 0; i0 < len0; i0++) {
                            const _errs11 = errors;
                            if (!validate94(data3[i0], { instancePath: instancePath + "/tolerances/" + i0, parentData: data3, parentDataProperty: i0, rootData })) {
                              vErrors = vErrors === null ? validate94.errors : vErrors.concat(validate94.errors);
                              errors = vErrors.length;
                            }
                            var valid1 = _errs11 === errors;
                            if (!valid1) {
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      validate93.errors = [{ instancePath: instancePath + "/tolerances", schemaPath: "#/properties/tolerances/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                      return false;
                    }
                  }
                  var valid0 = _errs9 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate93.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate93.errors = vErrors;
  return errors === 0;
}
function validate344(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  let passing0 = null;
  const _errs1 = errors;
  if (!validate91(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate91.errors : vErrors.concat(validate91.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs1 === errors;
  if (_valid0) {
    valid0 = true;
    passing0 = 0;
  }
  const _errs2 = errors;
  if (!validate93(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate93.errors : vErrors.concat(validate93.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs2 === errors;
  if (_valid0 && valid0) {
    valid0 = false;
    passing0 = [passing0, 1];
  } else {
    if (_valid0) {
      valid0 = true;
      passing0 = 1;
    }
  }
  if (!valid0) {
    const err0 = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
    validate344.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate344.errors = vErrors;
  return errors === 0;
}
var validateIdeaHintStructure = validate347;
function validate347(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.text === void 0 || !func0.call(data, "text")) && (missing0 = "text")) {
        validate347.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "text")) {
            validate347.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            let data0 = data.id;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate347.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("idea" !== data0) {
              validate347.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/const", keyword: "const", params: { allowedValue: "idea" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.text !== void 0 && func0.call(data, "text")) {
              const _errs4 = errors;
              if (!validate29(data.text, { instancePath: instancePath + "/text", parentData: data, parentDataProperty: "text", rootData })) {
                vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate347.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate347.errors = vErrors;
  return errors === 0;
}
var validateSyntaxHintStructure = validate349;
function validate349(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.text === void 0 || !func0.call(data, "text")) && (missing0 = "text")) {
        validate349.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "text")) {
            validate349.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            let data0 = data.id;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate349.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("syntax" !== data0) {
              validate349.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/const", keyword: "const", params: { allowedValue: "syntax" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.text !== void 0 && func0.call(data, "text")) {
              const _errs4 = errors;
              if (!validate29(data.text, { instancePath: instancePath + "/text", parentData: data, parentDataProperty: "text", rootData })) {
                vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate349.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate349.errors = vErrors;
  return errors === 0;
}
var validateSkeletonHintStructure = validate351;
function validate351(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.text === void 0 || !func0.call(data, "text")) && (missing0 = "text")) {
        validate351.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "text")) {
            validate351.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            let data0 = data.id;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate351.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("skeleton" !== data0) {
              validate351.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/const", keyword: "const", params: { allowedValue: "skeleton" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.text !== void 0 && func0.call(data, "text")) {
              const _errs4 = errors;
              if (!validate29(data.text, { instancePath: instancePath + "/text", parentData: data, parentDataProperty: "text", rootData })) {
                vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate351.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate351.errors = vErrors;
  return errors === 0;
}
var validateHintsStructure = validate353;
function validate75(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.text === void 0 || !func0.call(data, "text")) && (missing0 = "text")) {
        validate75.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "text")) {
            validate75.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            let data0 = data.id;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate75.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("idea" !== data0) {
              validate75.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/const", keyword: "const", params: { allowedValue: "idea" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.text !== void 0 && func0.call(data, "text")) {
              const _errs4 = errors;
              if (!validate29(data.text, { instancePath: instancePath + "/text", parentData: data, parentDataProperty: "text", rootData })) {
                vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate75.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate75.errors = vErrors;
  return errors === 0;
}
function validate78(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.text === void 0 || !func0.call(data, "text")) && (missing0 = "text")) {
        validate78.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "text")) {
            validate78.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            let data0 = data.id;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate78.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("syntax" !== data0) {
              validate78.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/const", keyword: "const", params: { allowedValue: "syntax" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.text !== void 0 && func0.call(data, "text")) {
              const _errs4 = errors;
              if (!validate29(data.text, { instancePath: instancePath + "/text", parentData: data, parentDataProperty: "text", rootData })) {
                vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate78.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate78.errors = vErrors;
  return errors === 0;
}
function validate81(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.text === void 0 || !func0.call(data, "text")) && (missing0 = "text")) {
        validate81.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "text")) {
            validate81.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            let data0 = data.id;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate81.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("skeleton" !== data0) {
              validate81.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/const", keyword: "const", params: { allowedValue: "skeleton" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.text !== void 0 && func0.call(data, "text")) {
              const _errs4 = errors;
              if (!validate29(data.text, { instancePath: instancePath + "/text", parentData: data, parentDataProperty: "text", rootData })) {
                vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate81.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate81.errors = vErrors;
  return errors === 0;
}
function validate353(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (Array.isArray(data)) {
      if (data.length > 3) {
        validate353.errors = [{ instancePath, schemaPath: "#/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
        return false;
      } else {
        if (data.length < 3) {
          validate353.errors = [{ instancePath, schemaPath: "#/minItems", keyword: "minItems", params: { limit: 3 }, message: "must NOT have fewer than 3 items" }];
          return false;
        } else {
          const len0 = data.length;
          if (!(len0 <= 3)) {
            validate353.errors = [{ instancePath, schemaPath: "#/additionalItems", keyword: "additionalItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
            return false;
          } else {
            const len1 = data.length;
            if (len1 > 0) {
              const _errs1 = errors;
              if (!validate75(data[0], { instancePath: instancePath + "/0", parentData: data, parentDataProperty: 0, rootData })) {
                vErrors = vErrors === null ? validate75.errors : vErrors.concat(validate75.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs1 === errors;
            }
            if (valid0) {
              if (len1 > 1) {
                const _errs2 = errors;
                if (!validate78(data[1], { instancePath: instancePath + "/1", parentData: data, parentDataProperty: 1, rootData })) {
                  vErrors = vErrors === null ? validate78.errors : vErrors.concat(validate78.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs2 === errors;
              }
              if (valid0) {
                if (len1 > 2) {
                  const _errs3 = errors;
                  if (!validate81(data[2], { instancePath: instancePath + "/2", parentData: data, parentDataProperty: 2, rootData })) {
                    vErrors = vErrors === null ? validate81.errors : vErrors.concat(validate81.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs3 === errors;
                }
              }
            }
          }
        }
      }
    } else {
      validate353.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
      return false;
    }
  }
  validate353.errors = vErrors;
  return errors === 0;
}
var validateReferenceSolutionStructure = validate357;
function validate86(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 2e4) {
        validate86.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 2e4 }, message: "must NOT have more than 20000 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate86.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern1.test(data)) {
            validate86.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
            return false;
          }
        }
      }
    } else {
      validate86.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate86.errors = vErrors;
  return errors === 0;
}
function validate357(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.sql === void 0 || !func0.call(data, "sql")) && (missing0 = "sql") || (data.explanation === void 0 || !func0.call(data, "explanation")) && (missing0 = "explanation")) {
        validate357.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "sql" || key0 === "explanation")) {
            validate357.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.sql !== void 0 && func0.call(data, "sql")) {
            const _errs2 = errors;
            if (!validate86(data.sql, { instancePath: instancePath + "/sql", parentData: data, parentDataProperty: "sql", rootData })) {
              vErrors = vErrors === null ? validate86.errors : vErrors.concat(validate86.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.explanation !== void 0 && func0.call(data, "explanation")) {
              const _errs3 = errors;
              if (!validate29(data.explanation, { instancePath: instancePath + "/explanation", parentData: data, parentDataProperty: "explanation", rootData })) {
                vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate357.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate357.errors = vErrors;
  return errors === 0;
}
var validateTestCaseStructure = validate360;
function validate101(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.columns === void 0 || !func0.call(data, "columns")) && (missing0 = "columns") || (data.rows === void 0 || !func0.call(data, "rows")) && (missing0 = "rows")) {
        validate101.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "columns" || key0 === "rows")) {
            validate101.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.columns !== void 0 && func0.call(data, "columns")) {
            let data0 = data.columns;
            const _errs3 = errors;
            if (errors === _errs3) {
              if (Array.isArray(data0)) {
                if (data0.length > 100) {
                  validate101.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                  return false;
                } else {
                  if (data0.length < 1) {
                    validate101.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                    return false;
                  } else {
                    var valid1 = true;
                    const len0 = data0.length;
                    for (let i0 = 0; i0 < len0; i0++) {
                      let data1 = data0[i0];
                      const _errs5 = errors;
                      if (errors === _errs5) {
                        if (typeof data1 === "string") {
                          if (func55(data1) > 256) {
                            validate101.errors = [{ instancePath: instancePath + "/columns/" + i0, schemaPath: "#/properties/columns/items/maxLength", keyword: "maxLength", params: { limit: 256 }, message: "must NOT have more than 256 characters" }];
                            return false;
                          } else {
                            if (func55(data1) < 0) {
                              validate101.errors = [{ instancePath: instancePath + "/columns/" + i0, schemaPath: "#/properties/columns/items/minLength", keyword: "minLength", params: { limit: 0 }, message: "must NOT have fewer than 0 characters" }];
                              return false;
                            }
                          }
                        } else {
                          validate101.errors = [{ instancePath: instancePath + "/columns/" + i0, schemaPath: "#/properties/columns/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                          return false;
                        }
                      }
                      var valid1 = _errs5 === errors;
                      if (!valid1) {
                        break;
                      }
                    }
                  }
                }
              } else {
                validate101.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                return false;
              }
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.rows !== void 0 && func0.call(data, "rows")) {
              let data2 = data.rows;
              const _errs7 = errors;
              if (errors === _errs7) {
                if (Array.isArray(data2)) {
                  if (data2.length > 1e3) {
                    validate101.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/maxItems", keyword: "maxItems", params: { limit: 1e3 }, message: "must NOT have more than 1000 items" }];
                    return false;
                  } else {
                    if (data2.length < 0) {
                      validate101.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                      return false;
                    } else {
                      var valid2 = true;
                      const len1 = data2.length;
                      for (let i1 = 0; i1 < len1; i1++) {
                        const _errs9 = errors;
                        if (!validate102(data2[i1], { instancePath: instancePath + "/rows/" + i1, parentData: data2, parentDataProperty: i1, rootData })) {
                          vErrors = vErrors === null ? validate102.errors : vErrors.concat(validate102.errors);
                          errors = vErrors.length;
                        }
                        var valid2 = _errs9 === errors;
                        if (!valid2) {
                          break;
                        }
                      }
                    }
                  }
                } else {
                  validate101.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                  return false;
                }
              }
              var valid0 = _errs7 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate101.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate101.errors = vErrors;
  return errors === 0;
}
function validate360(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.fixtureId === void 0 || !func0.call(data, "fixtureId")) && (missing0 = "fixtureId") || (data.expected === void 0 || !func0.call(data, "expected")) && (missing0 = "expected")) {
        validate360.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "fixtureId" || key0 === "expected")) {
            validate360.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.fixtureId !== void 0 && func0.call(data, "fixtureId")) {
              const _errs3 = errors;
              if (!validate23(data.fixtureId, { instancePath: instancePath + "/fixtureId", parentData: data, parentDataProperty: "fixtureId", rootData })) {
                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.expected !== void 0 && func0.call(data, "expected")) {
                const _errs4 = errors;
                if (!validate101(data.expected, { instancePath: instancePath + "/expected", parentData: data, parentDataProperty: "expected", rootData })) {
                  vErrors = vErrors === null ? validate101.errors : vErrors.concat(validate101.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate360.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate360.errors = vErrors;
  return errors === 0;
}
var validateExpectedFailureStructure = validate364;
function validate364(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.sql === void 0 || !func0.call(data, "sql")) && (missing0 = "sql")) {
        validate364.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "sql")) {
            validate364.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.sql !== void 0 && func0.call(data, "sql")) {
              const _errs3 = errors;
              if (!validate86(data.sql, { instancePath: instancePath + "/sql", parentData: data, parentDataProperty: "sql", rootData })) {
                vErrors = vErrors === null ? validate86.errors : vErrors.concat(validate86.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate364.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate364.errors = vErrors;
  return errors === 0;
}
var validateFlowNodeStructure = validate367;
function validate119(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 2e3) {
        validate119.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 2e3 }, message: "must NOT have more than 2000 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate119.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern1.test(data)) {
            validate119.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
            return false;
          }
        }
      }
    } else {
      validate119.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate119.errors = vErrors;
  return errors === 0;
}
function validate367(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.label === void 0 || !func0.call(data, "label")) && (missing0 = "label") || (data.description === void 0 || !func0.call(data, "description")) && (missing0 = "description")) {
        validate367.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "label" || key0 === "description")) {
            validate367.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.label !== void 0 && func0.call(data, "label")) {
              const _errs3 = errors;
              if (!validate27(data.label, { instancePath: instancePath + "/label", parentData: data, parentDataProperty: "label", rootData })) {
                vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.description !== void 0 && func0.call(data, "description")) {
                const _errs4 = errors;
                if (!validate119(data.description, { instancePath: instancePath + "/description", parentData: data, parentDataProperty: "description", rootData })) {
                  vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate367.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate367.errors = vErrors;
  return errors === 0;
}
var validateFlowEdgeStructure = validate371;
function validate371(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.from === void 0 || !func0.call(data, "from")) && (missing0 = "from") || (data.to === void 0 || !func0.call(data, "to")) && (missing0 = "to")) {
        validate371.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "from" || key0 === "to" || key0 === "label")) {
            validate371.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.from !== void 0 && func0.call(data, "from")) {
            const _errs2 = errors;
            if (!validate23(data.from, { instancePath: instancePath + "/from", parentData: data, parentDataProperty: "from", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.to !== void 0 && func0.call(data, "to")) {
              const _errs3 = errors;
              if (!validate23(data.to, { instancePath: instancePath + "/to", parentData: data, parentDataProperty: "to", rootData })) {
                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.label !== void 0 && func0.call(data, "label")) {
                const _errs4 = errors;
                if (!validate27(data.label, { instancePath: instancePath + "/label", parentData: data, parentDataProperty: "label", rootData })) {
                  vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate371.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate371.errors = vErrors;
  return errors === 0;
}
var validateFlowchartStructure = validate375;
function validate116(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.label === void 0 || !func0.call(data, "label")) && (missing0 = "label") || (data.description === void 0 || !func0.call(data, "description")) && (missing0 = "description")) {
        validate116.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "label" || key0 === "description")) {
            validate116.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.label !== void 0 && func0.call(data, "label")) {
              const _errs3 = errors;
              if (!validate27(data.label, { instancePath: instancePath + "/label", parentData: data, parentDataProperty: "label", rootData })) {
                vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.description !== void 0 && func0.call(data, "description")) {
                const _errs4 = errors;
                if (!validate119(data.description, { instancePath: instancePath + "/description", parentData: data, parentDataProperty: "description", rootData })) {
                  vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate116.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate116.errors = vErrors;
  return errors === 0;
}
function validate122(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.from === void 0 || !func0.call(data, "from")) && (missing0 = "from") || (data.to === void 0 || !func0.call(data, "to")) && (missing0 = "to")) {
        validate122.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "from" || key0 === "to" || key0 === "label")) {
            validate122.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.from !== void 0 && func0.call(data, "from")) {
            const _errs2 = errors;
            if (!validate23(data.from, { instancePath: instancePath + "/from", parentData: data, parentDataProperty: "from", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.to !== void 0 && func0.call(data, "to")) {
              const _errs3 = errors;
              if (!validate23(data.to, { instancePath: instancePath + "/to", parentData: data, parentDataProperty: "to", rootData })) {
                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.label !== void 0 && func0.call(data, "label")) {
                const _errs4 = errors;
                if (!validate27(data.label, { instancePath: instancePath + "/label", parentData: data, parentDataProperty: "label", rootData })) {
                  vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate122.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate122.errors = vErrors;
  return errors === 0;
}
function validate375(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.exampleSql === void 0 || !func0.call(data, "exampleSql")) && (missing0 = "exampleSql") || (data.nodes === void 0 || !func0.call(data, "nodes")) && (missing0 = "nodes") || (data.edges === void 0 || !func0.call(data, "edges")) && (missing0 = "edges")) {
        validate375.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "exampleSql" || key0 === "nodes" || key0 === "edges")) {
            validate375.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.exampleSql !== void 0 && func0.call(data, "exampleSql")) {
            const _errs3 = errors;
            if (!validate86(data.exampleSql, { instancePath: instancePath + "/exampleSql", parentData: data, parentDataProperty: "exampleSql", rootData })) {
              vErrors = vErrors === null ? validate86.errors : vErrors.concat(validate86.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.nodes !== void 0 && func0.call(data, "nodes")) {
              let data1 = data.nodes;
              const _errs4 = errors;
              if (errors === _errs4) {
                if (Array.isArray(data1)) {
                  if (data1.length > 20) {
                    validate375.errors = [{ instancePath: instancePath + "/nodes", schemaPath: "#/properties/nodes/maxItems", keyword: "maxItems", params: { limit: 20 }, message: "must NOT have more than 20 items" }];
                    return false;
                  } else {
                    if (data1.length < 1) {
                      validate375.errors = [{ instancePath: instancePath + "/nodes", schemaPath: "#/properties/nodes/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                      return false;
                    } else {
                      var valid1 = true;
                      const len0 = data1.length;
                      for (let i0 = 0; i0 < len0; i0++) {
                        const _errs6 = errors;
                        if (!validate116(data1[i0], { instancePath: instancePath + "/nodes/" + i0, parentData: data1, parentDataProperty: i0, rootData })) {
                          vErrors = vErrors === null ? validate116.errors : vErrors.concat(validate116.errors);
                          errors = vErrors.length;
                        }
                        var valid1 = _errs6 === errors;
                        if (!valid1) {
                          break;
                        }
                      }
                    }
                  }
                } else {
                  validate375.errors = [{ instancePath: instancePath + "/nodes", schemaPath: "#/properties/nodes/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                  return false;
                }
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.edges !== void 0 && func0.call(data, "edges")) {
                let data3 = data.edges;
                const _errs7 = errors;
                if (errors === _errs7) {
                  if (Array.isArray(data3)) {
                    if (data3.length > 32) {
                      validate375.errors = [{ instancePath: instancePath + "/edges", schemaPath: "#/properties/edges/maxItems", keyword: "maxItems", params: { limit: 32 }, message: "must NOT have more than 32 items" }];
                      return false;
                    } else {
                      if (data3.length < 0) {
                        validate375.errors = [{ instancePath: instancePath + "/edges", schemaPath: "#/properties/edges/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                        return false;
                      } else {
                        var valid2 = true;
                        const len1 = data3.length;
                        for (let i1 = 0; i1 < len1; i1++) {
                          const _errs9 = errors;
                          if (!validate122(data3[i1], { instancePath: instancePath + "/edges/" + i1, parentData: data3, parentDataProperty: i1, rootData })) {
                            vErrors = vErrors === null ? validate122.errors : vErrors.concat(validate122.errors);
                            errors = vErrors.length;
                          }
                          var valid2 = _errs9 === errors;
                          if (!valid2) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate375.errors = [{ instancePath: instancePath + "/edges", schemaPath: "#/properties/edges/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs7 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate375.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate375.errors = vErrors;
  return errors === 0;
}
var validateSqlCardStructure = validate379;
function validate379(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.sql === void 0 || !func0.call(data, "sql")) && (missing0 = "sql")) {
        validate379.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "sql")) {
            validate379.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.sql !== void 0 && func0.call(data, "sql")) {
              let data1 = data.sql;
              const _errs3 = errors;
              if (errors === _errs3) {
                if (typeof data1 === "string") {
                  if (func55(data1) > 1e3) {
                    validate379.errors = [{ instancePath: instancePath + "/sql", schemaPath: "#/properties/sql/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" }];
                    return false;
                  } else {
                    if (func55(data1) < 1) {
                      validate379.errors = [{ instancePath: instancePath + "/sql", schemaPath: "#/properties/sql/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                      return false;
                    } else {
                      if (!pattern1.test(data1)) {
                        validate379.errors = [{ instancePath: instancePath + "/sql", schemaPath: "#/properties/sql/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
                        return false;
                      }
                    }
                  }
                } else {
                  validate379.errors = [{ instancePath: instancePath + "/sql", schemaPath: "#/properties/sql/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate379.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate379.errors = vErrors;
  return errors === 0;
}
var validateSqlPuzzleStructure = validate381;
function validate129(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.sql === void 0 || !func0.call(data, "sql")) && (missing0 = "sql")) {
        validate129.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "sql")) {
            validate129.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.sql !== void 0 && func0.call(data, "sql")) {
              let data1 = data.sql;
              const _errs3 = errors;
              if (errors === _errs3) {
                if (typeof data1 === "string") {
                  if (func55(data1) > 1e3) {
                    validate129.errors = [{ instancePath: instancePath + "/sql", schemaPath: "#/properties/sql/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" }];
                    return false;
                  } else {
                    if (func55(data1) < 1) {
                      validate129.errors = [{ instancePath: instancePath + "/sql", schemaPath: "#/properties/sql/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                      return false;
                    } else {
                      if (!pattern1.test(data1)) {
                        validate129.errors = [{ instancePath: instancePath + "/sql", schemaPath: "#/properties/sql/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
                        return false;
                      }
                    }
                  }
                } else {
                  validate129.errors = [{ instancePath: instancePath + "/sql", schemaPath: "#/properties/sql/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate129.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate129.errors = vErrors;
  return errors === 0;
}
function validate381(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.cards === void 0 || !func0.call(data, "cards")) && (missing0 = "cards") || (data.solutionOrder === void 0 || !func0.call(data, "solutionOrder")) && (missing0 = "solutionOrder")) {
        validate381.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "cards" || key0 === "solutionOrder")) {
            validate381.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.cards !== void 0 && func0.call(data, "cards")) {
            let data0 = data.cards;
            const _errs3 = errors;
            if (errors === _errs3) {
              if (Array.isArray(data0)) {
                if (data0.length > 40) {
                  validate381.errors = [{ instancePath: instancePath + "/cards", schemaPath: "#/properties/cards/maxItems", keyword: "maxItems", params: { limit: 40 }, message: "must NOT have more than 40 items" }];
                  return false;
                } else {
                  if (data0.length < 2) {
                    validate381.errors = [{ instancePath: instancePath + "/cards", schemaPath: "#/properties/cards/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" }];
                    return false;
                  } else {
                    var valid1 = true;
                    const len0 = data0.length;
                    for (let i0 = 0; i0 < len0; i0++) {
                      const _errs5 = errors;
                      if (!validate129(data0[i0], { instancePath: instancePath + "/cards/" + i0, parentData: data0, parentDataProperty: i0, rootData })) {
                        vErrors = vErrors === null ? validate129.errors : vErrors.concat(validate129.errors);
                        errors = vErrors.length;
                      }
                      var valid1 = _errs5 === errors;
                      if (!valid1) {
                        break;
                      }
                    }
                  }
                }
              } else {
                validate381.errors = [{ instancePath: instancePath + "/cards", schemaPath: "#/properties/cards/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                return false;
              }
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.solutionOrder !== void 0 && func0.call(data, "solutionOrder")) {
              let data2 = data.solutionOrder;
              const _errs6 = errors;
              if (errors === _errs6) {
                if (Array.isArray(data2)) {
                  if (data2.length > 40) {
                    validate381.errors = [{ instancePath: instancePath + "/solutionOrder", schemaPath: "#/properties/solutionOrder/maxItems", keyword: "maxItems", params: { limit: 40 }, message: "must NOT have more than 40 items" }];
                    return false;
                  } else {
                    if (data2.length < 1) {
                      validate381.errors = [{ instancePath: instancePath + "/solutionOrder", schemaPath: "#/properties/solutionOrder/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                      return false;
                    } else {
                      var valid2 = true;
                      const len1 = data2.length;
                      for (let i1 = 0; i1 < len1; i1++) {
                        const _errs8 = errors;
                        if (!validate23(data2[i1], { instancePath: instancePath + "/solutionOrder/" + i1, parentData: data2, parentDataProperty: i1, rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid2 = _errs8 === errors;
                        if (!valid2) {
                          break;
                        }
                      }
                      if (valid2) {
                        let i2 = data2.length;
                        let j0;
                        if (i2 > 1) {
                          outer0:
                            for (; i2--; ) {
                              for (j0 = i2; j0--; ) {
                                if (func32(data2[i2], data2[j0])) {
                                  validate381.errors = [{ instancePath: instancePath + "/solutionOrder", schemaPath: "#/properties/solutionOrder/uniqueItems", keyword: "uniqueItems", params: { i: i2, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i2 + " are identical)" }];
                                  return false;
                                  break outer0;
                                }
                              }
                            }
                        }
                      }
                    }
                  }
                } else {
                  validate381.errors = [{ instancePath: instancePath + "/solutionOrder", schemaPath: "#/properties/solutionOrder/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                  return false;
                }
              }
              var valid0 = _errs6 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate381.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate381.errors = vErrors;
  return errors === 0;
}
var validateLessonStructure = validate384;
var schema18 = { "type": "object", "additionalProperties": false, "properties": { "schemaVersion": { "type": "integer", "const": 1 }, "courseId": { "$ref": "#/definitions/ContentId" }, "themeId": { "$ref": "#/definitions/ContentId" }, "chapterId": { "$ref": "#/definitions/ContentId" }, "id": { "$ref": "#/definitions/ContentId" }, "revision": { "$ref": "#/definitions/Revision" }, "dialect": { "const": "sqlite", "type": "string" }, "mode": { "type": "string", "enum": ["guided", "practice", "challenge"] }, "title": { "$ref": "#/definitions/Title" }, "prerequisites": { "type": "array", "items": { "$ref": "#/definitions/ContentId" }, "minItems": 0, "maxItems": 256, "uniqueItems": true }, "concepts": { "type": "array", "items": { "$ref": "#/definitions/ContentId" }, "minItems": 0, "maxItems": 256, "uniqueItems": true }, "introducedConcepts": { "type": "array", "items": { "$ref": "#/definitions/ContentId" }, "minItems": 0, "maxItems": 256, "uniqueItems": true }, "objective": { "$ref": "#/definitions/Prose" }, "statement": { "$ref": "#/definitions/Prose" }, "knowledge": { "type": "array", "items": { "$ref": "#/definitions/Prose" }, "minItems": 1, "maxItems": 32 }, "readableTables": { "type": "array", "items": { "$ref": "#/definitions/Identifier" }, "minItems": 1, "maxItems": 64, "uniqueItems": true }, "previewFixtureId": { "$ref": "#/definitions/ContentId" }, "duplicatePolicy": { "type": "string", "enum": ["preserve", "distinct"] }, "starterSql": { "$ref": "#/definitions/SqlDraft" }, "hints": { "$ref": "#/definitions/Hints" }, "referenceSolutions": { "type": "array", "items": { "$ref": "#/definitions/ReferenceSolution" }, "minItems": 1, "maxItems": 16 }, "comparison": { "$ref": "#/definitions/Comparison" }, "tests": { "type": "array", "items": { "$ref": "#/definitions/TestCase" }, "minItems": 1, "maxItems": 100 }, "expectedFailures": { "type": "array", "items": { "$ref": "#/definitions/ExpectedFailure" }, "minItems": 1, "maxItems": 100 }, "flowchart": { "$ref": "#/definitions/Flowchart" }, "sqlPuzzle": { "$ref": "#/definitions/SqlPuzzle" } }, "required": ["schemaVersion", "courseId", "themeId", "chapterId", "id", "revision", "dialect", "mode", "title", "prerequisites", "concepts", "introducedConcepts", "objective", "statement", "knowledge", "readableTables", "previewFixtureId", "duplicatePolicy", "starterSql", "hints", "referenceSolutions", "comparison", "tests", "expectedFailures"], "$comment": "Semantic: identity and prerequisites match root; concepts introduced no later than lesson; unique test/failure IDs; preview fixture occurs exactly once among tests; required fixtures expose compatible readable tables. SQL safety and teaching correctness are not structural validation." };
function validate69(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 64) {
        validate69.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 64 }, message: "must NOT have more than 64 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate69.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern4.test(data)) {
            validate69.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "^[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?![\\s\\S])" }, message: 'must match pattern "^[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?![\\s\\S])"' }];
            return false;
          }
        }
      }
    } else {
      validate69.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate69.errors = vErrors;
  return errors === 0;
}
function validate72(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 2e4) {
        validate72.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 2e4 }, message: "must NOT have more than 20000 characters" }];
        return false;
      } else {
        if (func55(data) < 0) {
          validate72.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 0 }, message: "must NOT have fewer than 0 characters" }];
          return false;
        }
      }
    } else {
      validate72.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate72.errors = vErrors;
  return errors === 0;
}
function validate74(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (Array.isArray(data)) {
      if (data.length > 3) {
        validate74.errors = [{ instancePath, schemaPath: "#/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
        return false;
      } else {
        if (data.length < 3) {
          validate74.errors = [{ instancePath, schemaPath: "#/minItems", keyword: "minItems", params: { limit: 3 }, message: "must NOT have fewer than 3 items" }];
          return false;
        } else {
          const len0 = data.length;
          if (!(len0 <= 3)) {
            validate74.errors = [{ instancePath, schemaPath: "#/additionalItems", keyword: "additionalItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
            return false;
          } else {
            const len1 = data.length;
            if (len1 > 0) {
              const _errs1 = errors;
              if (!validate75(data[0], { instancePath: instancePath + "/0", parentData: data, parentDataProperty: 0, rootData })) {
                vErrors = vErrors === null ? validate75.errors : vErrors.concat(validate75.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs1 === errors;
            }
            if (valid0) {
              if (len1 > 1) {
                const _errs2 = errors;
                if (!validate78(data[1], { instancePath: instancePath + "/1", parentData: data, parentDataProperty: 1, rootData })) {
                  vErrors = vErrors === null ? validate78.errors : vErrors.concat(validate78.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs2 === errors;
              }
              if (valid0) {
                if (len1 > 2) {
                  const _errs3 = errors;
                  if (!validate81(data[2], { instancePath: instancePath + "/2", parentData: data, parentDataProperty: 2, rootData })) {
                    vErrors = vErrors === null ? validate81.errors : vErrors.concat(validate81.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs3 === errors;
                }
              }
            }
          }
        }
      }
    } else {
      validate74.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
      return false;
    }
  }
  validate74.errors = vErrors;
  return errors === 0;
}
function validate85(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.sql === void 0 || !func0.call(data, "sql")) && (missing0 = "sql") || (data.explanation === void 0 || !func0.call(data, "explanation")) && (missing0 = "explanation")) {
        validate85.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "sql" || key0 === "explanation")) {
            validate85.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.sql !== void 0 && func0.call(data, "sql")) {
            const _errs2 = errors;
            if (!validate86(data.sql, { instancePath: instancePath + "/sql", parentData: data, parentDataProperty: "sql", rootData })) {
              vErrors = vErrors === null ? validate86.errors : vErrors.concat(validate86.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.explanation !== void 0 && func0.call(data, "explanation")) {
              const _errs3 = errors;
              if (!validate29(data.explanation, { instancePath: instancePath + "/explanation", parentData: data, parentDataProperty: "explanation", rootData })) {
                vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate85.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate85.errors = vErrors;
  return errors === 0;
}
function validate90(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  let passing0 = null;
  const _errs1 = errors;
  if (!validate91(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate91.errors : vErrors.concat(validate91.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs1 === errors;
  if (_valid0) {
    valid0 = true;
    passing0 = 0;
  }
  const _errs2 = errors;
  if (!validate93(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate93.errors : vErrors.concat(validate93.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs2 === errors;
  if (_valid0 && valid0) {
    valid0 = false;
    passing0 = [passing0, 1];
  } else {
    if (_valid0) {
      valid0 = true;
      passing0 = 1;
    }
  }
  if (!valid0) {
    const err0 = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
    validate90.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate90.errors = vErrors;
  return errors === 0;
}
function validate98(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.fixtureId === void 0 || !func0.call(data, "fixtureId")) && (missing0 = "fixtureId") || (data.expected === void 0 || !func0.call(data, "expected")) && (missing0 = "expected")) {
        validate98.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "fixtureId" || key0 === "expected")) {
            validate98.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.fixtureId !== void 0 && func0.call(data, "fixtureId")) {
              const _errs3 = errors;
              if (!validate23(data.fixtureId, { instancePath: instancePath + "/fixtureId", parentData: data, parentDataProperty: "fixtureId", rootData })) {
                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.expected !== void 0 && func0.call(data, "expected")) {
                const _errs4 = errors;
                if (!validate101(data.expected, { instancePath: instancePath + "/expected", parentData: data, parentDataProperty: "expected", rootData })) {
                  vErrors = vErrors === null ? validate101.errors : vErrors.concat(validate101.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate98.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate98.errors = vErrors;
  return errors === 0;
}
function validate110(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.sql === void 0 || !func0.call(data, "sql")) && (missing0 = "sql")) {
        validate110.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "id" || key0 === "sql")) {
            validate110.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.id !== void 0 && func0.call(data, "id")) {
            const _errs2 = errors;
            if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.sql !== void 0 && func0.call(data, "sql")) {
              const _errs3 = errors;
              if (!validate86(data.sql, { instancePath: instancePath + "/sql", parentData: data, parentDataProperty: "sql", rootData })) {
                vErrors = vErrors === null ? validate86.errors : vErrors.concat(validate86.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate110.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate110.errors = vErrors;
  return errors === 0;
}
function validate114(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.exampleSql === void 0 || !func0.call(data, "exampleSql")) && (missing0 = "exampleSql") || (data.nodes === void 0 || !func0.call(data, "nodes")) && (missing0 = "nodes") || (data.edges === void 0 || !func0.call(data, "edges")) && (missing0 = "edges")) {
        validate114.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "exampleSql" || key0 === "nodes" || key0 === "edges")) {
            validate114.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.exampleSql !== void 0 && func0.call(data, "exampleSql")) {
            const _errs3 = errors;
            if (!validate86(data.exampleSql, { instancePath: instancePath + "/exampleSql", parentData: data, parentDataProperty: "exampleSql", rootData })) {
              vErrors = vErrors === null ? validate86.errors : vErrors.concat(validate86.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.nodes !== void 0 && func0.call(data, "nodes")) {
              let data1 = data.nodes;
              const _errs4 = errors;
              if (errors === _errs4) {
                if (Array.isArray(data1)) {
                  if (data1.length > 20) {
                    validate114.errors = [{ instancePath: instancePath + "/nodes", schemaPath: "#/properties/nodes/maxItems", keyword: "maxItems", params: { limit: 20 }, message: "must NOT have more than 20 items" }];
                    return false;
                  } else {
                    if (data1.length < 1) {
                      validate114.errors = [{ instancePath: instancePath + "/nodes", schemaPath: "#/properties/nodes/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                      return false;
                    } else {
                      var valid1 = true;
                      const len0 = data1.length;
                      for (let i0 = 0; i0 < len0; i0++) {
                        const _errs6 = errors;
                        if (!validate116(data1[i0], { instancePath: instancePath + "/nodes/" + i0, parentData: data1, parentDataProperty: i0, rootData })) {
                          vErrors = vErrors === null ? validate116.errors : vErrors.concat(validate116.errors);
                          errors = vErrors.length;
                        }
                        var valid1 = _errs6 === errors;
                        if (!valid1) {
                          break;
                        }
                      }
                    }
                  }
                } else {
                  validate114.errors = [{ instancePath: instancePath + "/nodes", schemaPath: "#/properties/nodes/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                  return false;
                }
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.edges !== void 0 && func0.call(data, "edges")) {
                let data3 = data.edges;
                const _errs7 = errors;
                if (errors === _errs7) {
                  if (Array.isArray(data3)) {
                    if (data3.length > 32) {
                      validate114.errors = [{ instancePath: instancePath + "/edges", schemaPath: "#/properties/edges/maxItems", keyword: "maxItems", params: { limit: 32 }, message: "must NOT have more than 32 items" }];
                      return false;
                    } else {
                      if (data3.length < 0) {
                        validate114.errors = [{ instancePath: instancePath + "/edges", schemaPath: "#/properties/edges/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                        return false;
                      } else {
                        var valid2 = true;
                        const len1 = data3.length;
                        for (let i1 = 0; i1 < len1; i1++) {
                          const _errs9 = errors;
                          if (!validate122(data3[i1], { instancePath: instancePath + "/edges/" + i1, parentData: data3, parentDataProperty: i1, rootData })) {
                            vErrors = vErrors === null ? validate122.errors : vErrors.concat(validate122.errors);
                            errors = vErrors.length;
                          }
                          var valid2 = _errs9 === errors;
                          if (!valid2) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate114.errors = [{ instancePath: instancePath + "/edges", schemaPath: "#/properties/edges/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs7 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate114.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate114.errors = vErrors;
  return errors === 0;
}
function validate128(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.cards === void 0 || !func0.call(data, "cards")) && (missing0 = "cards") || (data.solutionOrder === void 0 || !func0.call(data, "solutionOrder")) && (missing0 = "solutionOrder")) {
        validate128.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "cards" || key0 === "solutionOrder")) {
            validate128.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.cards !== void 0 && func0.call(data, "cards")) {
            let data0 = data.cards;
            const _errs3 = errors;
            if (errors === _errs3) {
              if (Array.isArray(data0)) {
                if (data0.length > 40) {
                  validate128.errors = [{ instancePath: instancePath + "/cards", schemaPath: "#/properties/cards/maxItems", keyword: "maxItems", params: { limit: 40 }, message: "must NOT have more than 40 items" }];
                  return false;
                } else {
                  if (data0.length < 2) {
                    validate128.errors = [{ instancePath: instancePath + "/cards", schemaPath: "#/properties/cards/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" }];
                    return false;
                  } else {
                    var valid1 = true;
                    const len0 = data0.length;
                    for (let i0 = 0; i0 < len0; i0++) {
                      const _errs5 = errors;
                      if (!validate129(data0[i0], { instancePath: instancePath + "/cards/" + i0, parentData: data0, parentDataProperty: i0, rootData })) {
                        vErrors = vErrors === null ? validate129.errors : vErrors.concat(validate129.errors);
                        errors = vErrors.length;
                      }
                      var valid1 = _errs5 === errors;
                      if (!valid1) {
                        break;
                      }
                    }
                  }
                }
              } else {
                validate128.errors = [{ instancePath: instancePath + "/cards", schemaPath: "#/properties/cards/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                return false;
              }
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.solutionOrder !== void 0 && func0.call(data, "solutionOrder")) {
              let data2 = data.solutionOrder;
              const _errs6 = errors;
              if (errors === _errs6) {
                if (Array.isArray(data2)) {
                  if (data2.length > 40) {
                    validate128.errors = [{ instancePath: instancePath + "/solutionOrder", schemaPath: "#/properties/solutionOrder/maxItems", keyword: "maxItems", params: { limit: 40 }, message: "must NOT have more than 40 items" }];
                    return false;
                  } else {
                    if (data2.length < 1) {
                      validate128.errors = [{ instancePath: instancePath + "/solutionOrder", schemaPath: "#/properties/solutionOrder/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                      return false;
                    } else {
                      var valid2 = true;
                      const len1 = data2.length;
                      for (let i1 = 0; i1 < len1; i1++) {
                        const _errs8 = errors;
                        if (!validate23(data2[i1], { instancePath: instancePath + "/solutionOrder/" + i1, parentData: data2, parentDataProperty: i1, rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid2 = _errs8 === errors;
                        if (!valid2) {
                          break;
                        }
                      }
                      if (valid2) {
                        let i2 = data2.length;
                        let j0;
                        if (i2 > 1) {
                          outer0:
                            for (; i2--; ) {
                              for (j0 = i2; j0--; ) {
                                if (func32(data2[i2], data2[j0])) {
                                  validate128.errors = [{ instancePath: instancePath + "/solutionOrder", schemaPath: "#/properties/solutionOrder/uniqueItems", keyword: "uniqueItems", params: { i: i2, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i2 + " are identical)" }];
                                  return false;
                                  break outer0;
                                }
                              }
                            }
                        }
                      }
                    }
                  }
                } else {
                  validate128.errors = [{ instancePath: instancePath + "/solutionOrder", schemaPath: "#/properties/solutionOrder/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                  return false;
                }
              }
              var valid0 = _errs6 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate128.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate128.errors = vErrors;
  return errors === 0;
}
function validate384(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.chapterId === void 0 || !func0.call(data, "chapterId")) && (missing0 = "chapterId") || (data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.revision === void 0 || !func0.call(data, "revision")) && (missing0 = "revision") || (data.dialect === void 0 || !func0.call(data, "dialect")) && (missing0 = "dialect") || (data.mode === void 0 || !func0.call(data, "mode")) && (missing0 = "mode") || (data.title === void 0 || !func0.call(data, "title")) && (missing0 = "title") || (data.prerequisites === void 0 || !func0.call(data, "prerequisites")) && (missing0 = "prerequisites") || (data.concepts === void 0 || !func0.call(data, "concepts")) && (missing0 = "concepts") || (data.introducedConcepts === void 0 || !func0.call(data, "introducedConcepts")) && (missing0 = "introducedConcepts") || (data.objective === void 0 || !func0.call(data, "objective")) && (missing0 = "objective") || (data.statement === void 0 || !func0.call(data, "statement")) && (missing0 = "statement") || (data.knowledge === void 0 || !func0.call(data, "knowledge")) && (missing0 = "knowledge") || (data.readableTables === void 0 || !func0.call(data, "readableTables")) && (missing0 = "readableTables") || (data.previewFixtureId === void 0 || !func0.call(data, "previewFixtureId")) && (missing0 = "previewFixtureId") || (data.duplicatePolicy === void 0 || !func0.call(data, "duplicatePolicy")) && (missing0 = "duplicatePolicy") || (data.starterSql === void 0 || !func0.call(data, "starterSql")) && (missing0 = "starterSql") || (data.hints === void 0 || !func0.call(data, "hints")) && (missing0 = "hints") || (data.referenceSolutions === void 0 || !func0.call(data, "referenceSolutions")) && (missing0 = "referenceSolutions") || (data.comparison === void 0 || !func0.call(data, "comparison")) && (missing0 = "comparison") || (data.tests === void 0 || !func0.call(data, "tests")) && (missing0 = "tests") || (data.expectedFailures === void 0 || !func0.call(data, "expectedFailures")) && (missing0 = "expectedFailures")) {
        validate384.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema18.properties, key0)) {
            validate384.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
            let data0 = data.schemaVersion;
            const _errs3 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)) && isFinite(data0))) {
              validate384.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (1 !== data0) {
              validate384.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.courseId !== void 0 && func0.call(data, "courseId")) {
              const _errs5 = errors;
              if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                const _errs6 = errors;
                if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                  vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.chapterId !== void 0 && func0.call(data, "chapterId")) {
                  const _errs7 = errors;
                  if (!validate23(data.chapterId, { instancePath: instancePath + "/chapterId", parentData: data, parentDataProperty: "chapterId", rootData })) {
                    vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.id !== void 0 && func0.call(data, "id")) {
                    const _errs8 = errors;
                    if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
                      vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.revision !== void 0 && func0.call(data, "revision")) {
                      const _errs9 = errors;
                      if (!validate25(data.revision, { instancePath: instancePath + "/revision", parentData: data, parentDataProperty: "revision", rootData })) {
                        vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.dialect !== void 0 && func0.call(data, "dialect")) {
                        let data6 = data.dialect;
                        const _errs10 = errors;
                        if (typeof data6 !== "string") {
                          validate384.errors = [{ instancePath: instancePath + "/dialect", schemaPath: "#/properties/dialect/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                          return false;
                        }
                        if ("sqlite" !== data6) {
                          validate384.errors = [{ instancePath: instancePath + "/dialect", schemaPath: "#/properties/dialect/const", keyword: "const", params: { allowedValue: "sqlite" }, message: "must be equal to constant" }];
                          return false;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.mode !== void 0 && func0.call(data, "mode")) {
                          let data7 = data.mode;
                          const _errs12 = errors;
                          if (typeof data7 !== "string") {
                            validate384.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                            return false;
                          }
                          if (!(data7 === "guided" || data7 === "practice" || data7 === "challenge")) {
                            validate384.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/enum", keyword: "enum", params: { allowedValues: schema18.properties.mode.enum }, message: "must be equal to one of the allowed values" }];
                            return false;
                          }
                          var valid0 = _errs12 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.title !== void 0 && func0.call(data, "title")) {
                            const _errs14 = errors;
                            if (!validate27(data.title, { instancePath: instancePath + "/title", parentData: data, parentDataProperty: "title", rootData })) {
                              vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs14 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.prerequisites !== void 0 && func0.call(data, "prerequisites")) {
                              let data9 = data.prerequisites;
                              const _errs15 = errors;
                              if (errors === _errs15) {
                                if (Array.isArray(data9)) {
                                  if (data9.length > 256) {
                                    validate384.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                    return false;
                                  } else {
                                    if (data9.length < 0) {
                                      validate384.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                                      return false;
                                    } else {
                                      var valid1 = true;
                                      const len0 = data9.length;
                                      for (let i0 = 0; i0 < len0; i0++) {
                                        const _errs17 = errors;
                                        if (!validate23(data9[i0], { instancePath: instancePath + "/prerequisites/" + i0, parentData: data9, parentDataProperty: i0, rootData })) {
                                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                          errors = vErrors.length;
                                        }
                                        var valid1 = _errs17 === errors;
                                        if (!valid1) {
                                          break;
                                        }
                                      }
                                      if (valid1) {
                                        let i1 = data9.length;
                                        let j0;
                                        if (i1 > 1) {
                                          outer0:
                                            for (; i1--; ) {
                                              for (j0 = i1; j0--; ) {
                                                if (func32(data9[i1], data9[j0])) {
                                                  validate384.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" }];
                                                  return false;
                                                  break outer0;
                                                }
                                              }
                                            }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  validate384.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                  return false;
                                }
                              }
                              var valid0 = _errs15 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.concepts !== void 0 && func0.call(data, "concepts")) {
                                let data11 = data.concepts;
                                const _errs18 = errors;
                                if (errors === _errs18) {
                                  if (Array.isArray(data11)) {
                                    if (data11.length > 256) {
                                      validate384.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                      return false;
                                    } else {
                                      if (data11.length < 0) {
                                        validate384.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                                        return false;
                                      } else {
                                        var valid3 = true;
                                        const len1 = data11.length;
                                        for (let i2 = 0; i2 < len1; i2++) {
                                          const _errs20 = errors;
                                          if (!validate23(data11[i2], { instancePath: instancePath + "/concepts/" + i2, parentData: data11, parentDataProperty: i2, rootData })) {
                                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                            errors = vErrors.length;
                                          }
                                          var valid3 = _errs20 === errors;
                                          if (!valid3) {
                                            break;
                                          }
                                        }
                                        if (valid3) {
                                          let i3 = data11.length;
                                          let j1;
                                          if (i3 > 1) {
                                            outer1:
                                              for (; i3--; ) {
                                                for (j1 = i3; j1--; ) {
                                                  if (func32(data11[i3], data11[j1])) {
                                                    validate384.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/uniqueItems", keyword: "uniqueItems", params: { i: i3, j: j1 }, message: "must NOT have duplicate items (items ## " + j1 + " and " + i3 + " are identical)" }];
                                                    return false;
                                                    break outer1;
                                                  }
                                                }
                                              }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    validate384.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                    return false;
                                  }
                                }
                                var valid0 = _errs18 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.introducedConcepts !== void 0 && func0.call(data, "introducedConcepts")) {
                                  let data13 = data.introducedConcepts;
                                  const _errs21 = errors;
                                  if (errors === _errs21) {
                                    if (Array.isArray(data13)) {
                                      if (data13.length > 256) {
                                        validate384.errors = [{ instancePath: instancePath + "/introducedConcepts", schemaPath: "#/properties/introducedConcepts/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                        return false;
                                      } else {
                                        if (data13.length < 0) {
                                          validate384.errors = [{ instancePath: instancePath + "/introducedConcepts", schemaPath: "#/properties/introducedConcepts/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                                          return false;
                                        } else {
                                          var valid5 = true;
                                          const len2 = data13.length;
                                          for (let i4 = 0; i4 < len2; i4++) {
                                            const _errs23 = errors;
                                            if (!validate23(data13[i4], { instancePath: instancePath + "/introducedConcepts/" + i4, parentData: data13, parentDataProperty: i4, rootData })) {
                                              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                              errors = vErrors.length;
                                            }
                                            var valid5 = _errs23 === errors;
                                            if (!valid5) {
                                              break;
                                            }
                                          }
                                          if (valid5) {
                                            let i5 = data13.length;
                                            let j2;
                                            if (i5 > 1) {
                                              outer2:
                                                for (; i5--; ) {
                                                  for (j2 = i5; j2--; ) {
                                                    if (func32(data13[i5], data13[j2])) {
                                                      validate384.errors = [{ instancePath: instancePath + "/introducedConcepts", schemaPath: "#/properties/introducedConcepts/uniqueItems", keyword: "uniqueItems", params: { i: i5, j: j2 }, message: "must NOT have duplicate items (items ## " + j2 + " and " + i5 + " are identical)" }];
                                                      return false;
                                                      break outer2;
                                                    }
                                                  }
                                                }
                                            }
                                          }
                                        }
                                      }
                                    } else {
                                      validate384.errors = [{ instancePath: instancePath + "/introducedConcepts", schemaPath: "#/properties/introducedConcepts/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                      return false;
                                    }
                                  }
                                  var valid0 = _errs21 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.objective !== void 0 && func0.call(data, "objective")) {
                                    const _errs24 = errors;
                                    if (!validate29(data.objective, { instancePath: instancePath + "/objective", parentData: data, parentDataProperty: "objective", rootData })) {
                                      vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                                      errors = vErrors.length;
                                    }
                                    var valid0 = _errs24 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.statement !== void 0 && func0.call(data, "statement")) {
                                      const _errs25 = errors;
                                      if (!validate29(data.statement, { instancePath: instancePath + "/statement", parentData: data, parentDataProperty: "statement", rootData })) {
                                        vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                                        errors = vErrors.length;
                                      }
                                      var valid0 = _errs25 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                    if (valid0) {
                                      if (data.knowledge !== void 0 && func0.call(data, "knowledge")) {
                                        let data17 = data.knowledge;
                                        const _errs26 = errors;
                                        if (errors === _errs26) {
                                          if (Array.isArray(data17)) {
                                            if (data17.length > 32) {
                                              validate384.errors = [{ instancePath: instancePath + "/knowledge", schemaPath: "#/properties/knowledge/maxItems", keyword: "maxItems", params: { limit: 32 }, message: "must NOT have more than 32 items" }];
                                              return false;
                                            } else {
                                              if (data17.length < 1) {
                                                validate384.errors = [{ instancePath: instancePath + "/knowledge", schemaPath: "#/properties/knowledge/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                                return false;
                                              } else {
                                                var valid7 = true;
                                                const len3 = data17.length;
                                                for (let i6 = 0; i6 < len3; i6++) {
                                                  const _errs28 = errors;
                                                  if (!validate29(data17[i6], { instancePath: instancePath + "/knowledge/" + i6, parentData: data17, parentDataProperty: i6, rootData })) {
                                                    vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                                                    errors = vErrors.length;
                                                  }
                                                  var valid7 = _errs28 === errors;
                                                  if (!valid7) {
                                                    break;
                                                  }
                                                }
                                              }
                                            }
                                          } else {
                                            validate384.errors = [{ instancePath: instancePath + "/knowledge", schemaPath: "#/properties/knowledge/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                            return false;
                                          }
                                        }
                                        var valid0 = _errs26 === errors;
                                      } else {
                                        var valid0 = true;
                                      }
                                      if (valid0) {
                                        if (data.readableTables !== void 0 && func0.call(data, "readableTables")) {
                                          let data19 = data.readableTables;
                                          const _errs29 = errors;
                                          if (errors === _errs29) {
                                            if (Array.isArray(data19)) {
                                              if (data19.length > 64) {
                                                validate384.errors = [{ instancePath: instancePath + "/readableTables", schemaPath: "#/properties/readableTables/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                                                return false;
                                              } else {
                                                if (data19.length < 1) {
                                                  validate384.errors = [{ instancePath: instancePath + "/readableTables", schemaPath: "#/properties/readableTables/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                                  return false;
                                                } else {
                                                  var valid8 = true;
                                                  const len4 = data19.length;
                                                  for (let i7 = 0; i7 < len4; i7++) {
                                                    const _errs31 = errors;
                                                    if (!validate69(data19[i7], { instancePath: instancePath + "/readableTables/" + i7, parentData: data19, parentDataProperty: i7, rootData })) {
                                                      vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
                                                      errors = vErrors.length;
                                                    }
                                                    var valid8 = _errs31 === errors;
                                                    if (!valid8) {
                                                      break;
                                                    }
                                                  }
                                                  if (valid8) {
                                                    let i8 = data19.length;
                                                    let j3;
                                                    if (i8 > 1) {
                                                      outer3:
                                                        for (; i8--; ) {
                                                          for (j3 = i8; j3--; ) {
                                                            if (func32(data19[i8], data19[j3])) {
                                                              validate384.errors = [{ instancePath: instancePath + "/readableTables", schemaPath: "#/properties/readableTables/uniqueItems", keyword: "uniqueItems", params: { i: i8, j: j3 }, message: "must NOT have duplicate items (items ## " + j3 + " and " + i8 + " are identical)" }];
                                                              return false;
                                                              break outer3;
                                                            }
                                                          }
                                                        }
                                                    }
                                                  }
                                                }
                                              }
                                            } else {
                                              validate384.errors = [{ instancePath: instancePath + "/readableTables", schemaPath: "#/properties/readableTables/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                              return false;
                                            }
                                          }
                                          var valid0 = _errs29 === errors;
                                        } else {
                                          var valid0 = true;
                                        }
                                        if (valid0) {
                                          if (data.previewFixtureId !== void 0 && func0.call(data, "previewFixtureId")) {
                                            const _errs32 = errors;
                                            if (!validate23(data.previewFixtureId, { instancePath: instancePath + "/previewFixtureId", parentData: data, parentDataProperty: "previewFixtureId", rootData })) {
                                              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                              errors = vErrors.length;
                                            }
                                            var valid0 = _errs32 === errors;
                                          } else {
                                            var valid0 = true;
                                          }
                                          if (valid0) {
                                            if (data.duplicatePolicy !== void 0 && func0.call(data, "duplicatePolicy")) {
                                              let data22 = data.duplicatePolicy;
                                              const _errs33 = errors;
                                              if (typeof data22 !== "string") {
                                                validate384.errors = [{ instancePath: instancePath + "/duplicatePolicy", schemaPath: "#/properties/duplicatePolicy/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                return false;
                                              }
                                              if (!(data22 === "preserve" || data22 === "distinct")) {
                                                validate384.errors = [{ instancePath: instancePath + "/duplicatePolicy", schemaPath: "#/properties/duplicatePolicy/enum", keyword: "enum", params: { allowedValues: schema18.properties.duplicatePolicy.enum }, message: "must be equal to one of the allowed values" }];
                                                return false;
                                              }
                                              var valid0 = _errs33 === errors;
                                            } else {
                                              var valid0 = true;
                                            }
                                            if (valid0) {
                                              if (data.starterSql !== void 0 && func0.call(data, "starterSql")) {
                                                const _errs35 = errors;
                                                if (!validate72(data.starterSql, { instancePath: instancePath + "/starterSql", parentData: data, parentDataProperty: "starterSql", rootData })) {
                                                  vErrors = vErrors === null ? validate72.errors : vErrors.concat(validate72.errors);
                                                  errors = vErrors.length;
                                                }
                                                var valid0 = _errs35 === errors;
                                              } else {
                                                var valid0 = true;
                                              }
                                              if (valid0) {
                                                if (data.hints !== void 0 && func0.call(data, "hints")) {
                                                  const _errs36 = errors;
                                                  if (!validate74(data.hints, { instancePath: instancePath + "/hints", parentData: data, parentDataProperty: "hints", rootData })) {
                                                    vErrors = vErrors === null ? validate74.errors : vErrors.concat(validate74.errors);
                                                    errors = vErrors.length;
                                                  }
                                                  var valid0 = _errs36 === errors;
                                                } else {
                                                  var valid0 = true;
                                                }
                                                if (valid0) {
                                                  if (data.referenceSolutions !== void 0 && func0.call(data, "referenceSolutions")) {
                                                    let data25 = data.referenceSolutions;
                                                    const _errs37 = errors;
                                                    if (errors === _errs37) {
                                                      if (Array.isArray(data25)) {
                                                        if (data25.length > 16) {
                                                          validate384.errors = [{ instancePath: instancePath + "/referenceSolutions", schemaPath: "#/properties/referenceSolutions/maxItems", keyword: "maxItems", params: { limit: 16 }, message: "must NOT have more than 16 items" }];
                                                          return false;
                                                        } else {
                                                          if (data25.length < 1) {
                                                            validate384.errors = [{ instancePath: instancePath + "/referenceSolutions", schemaPath: "#/properties/referenceSolutions/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                                            return false;
                                                          } else {
                                                            var valid10 = true;
                                                            const len5 = data25.length;
                                                            for (let i9 = 0; i9 < len5; i9++) {
                                                              const _errs39 = errors;
                                                              if (!validate85(data25[i9], { instancePath: instancePath + "/referenceSolutions/" + i9, parentData: data25, parentDataProperty: i9, rootData })) {
                                                                vErrors = vErrors === null ? validate85.errors : vErrors.concat(validate85.errors);
                                                                errors = vErrors.length;
                                                              }
                                                              var valid10 = _errs39 === errors;
                                                              if (!valid10) {
                                                                break;
                                                              }
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        validate384.errors = [{ instancePath: instancePath + "/referenceSolutions", schemaPath: "#/properties/referenceSolutions/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                        return false;
                                                      }
                                                    }
                                                    var valid0 = _errs37 === errors;
                                                  } else {
                                                    var valid0 = true;
                                                  }
                                                  if (valid0) {
                                                    if (data.comparison !== void 0 && func0.call(data, "comparison")) {
                                                      const _errs40 = errors;
                                                      if (!validate90(data.comparison, { instancePath: instancePath + "/comparison", parentData: data, parentDataProperty: "comparison", rootData })) {
                                                        vErrors = vErrors === null ? validate90.errors : vErrors.concat(validate90.errors);
                                                        errors = vErrors.length;
                                                      }
                                                      var valid0 = _errs40 === errors;
                                                    } else {
                                                      var valid0 = true;
                                                    }
                                                    if (valid0) {
                                                      if (data.tests !== void 0 && func0.call(data, "tests")) {
                                                        let data28 = data.tests;
                                                        const _errs41 = errors;
                                                        if (errors === _errs41) {
                                                          if (Array.isArray(data28)) {
                                                            if (data28.length > 100) {
                                                              validate384.errors = [{ instancePath: instancePath + "/tests", schemaPath: "#/properties/tests/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                                                              return false;
                                                            } else {
                                                              if (data28.length < 1) {
                                                                validate384.errors = [{ instancePath: instancePath + "/tests", schemaPath: "#/properties/tests/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                                                return false;
                                                              } else {
                                                                var valid11 = true;
                                                                const len6 = data28.length;
                                                                for (let i10 = 0; i10 < len6; i10++) {
                                                                  const _errs43 = errors;
                                                                  if (!validate98(data28[i10], { instancePath: instancePath + "/tests/" + i10, parentData: data28, parentDataProperty: i10, rootData })) {
                                                                    vErrors = vErrors === null ? validate98.errors : vErrors.concat(validate98.errors);
                                                                    errors = vErrors.length;
                                                                  }
                                                                  var valid11 = _errs43 === errors;
                                                                  if (!valid11) {
                                                                    break;
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          } else {
                                                            validate384.errors = [{ instancePath: instancePath + "/tests", schemaPath: "#/properties/tests/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                            return false;
                                                          }
                                                        }
                                                        var valid0 = _errs41 === errors;
                                                      } else {
                                                        var valid0 = true;
                                                      }
                                                      if (valid0) {
                                                        if (data.expectedFailures !== void 0 && func0.call(data, "expectedFailures")) {
                                                          let data30 = data.expectedFailures;
                                                          const _errs44 = errors;
                                                          if (errors === _errs44) {
                                                            if (Array.isArray(data30)) {
                                                              if (data30.length > 100) {
                                                                validate384.errors = [{ instancePath: instancePath + "/expectedFailures", schemaPath: "#/properties/expectedFailures/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                                                                return false;
                                                              } else {
                                                                if (data30.length < 1) {
                                                                  validate384.errors = [{ instancePath: instancePath + "/expectedFailures", schemaPath: "#/properties/expectedFailures/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                                                  return false;
                                                                } else {
                                                                  var valid12 = true;
                                                                  const len7 = data30.length;
                                                                  for (let i11 = 0; i11 < len7; i11++) {
                                                                    const _errs46 = errors;
                                                                    if (!validate110(data30[i11], { instancePath: instancePath + "/expectedFailures/" + i11, parentData: data30, parentDataProperty: i11, rootData })) {
                                                                      vErrors = vErrors === null ? validate110.errors : vErrors.concat(validate110.errors);
                                                                      errors = vErrors.length;
                                                                    }
                                                                    var valid12 = _errs46 === errors;
                                                                    if (!valid12) {
                                                                      break;
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            } else {
                                                              validate384.errors = [{ instancePath: instancePath + "/expectedFailures", schemaPath: "#/properties/expectedFailures/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                              return false;
                                                            }
                                                          }
                                                          var valid0 = _errs44 === errors;
                                                        } else {
                                                          var valid0 = true;
                                                        }
                                                        if (valid0) {
                                                          if (data.flowchart !== void 0 && func0.call(data, "flowchart")) {
                                                            const _errs47 = errors;
                                                            if (!validate114(data.flowchart, { instancePath: instancePath + "/flowchart", parentData: data, parentDataProperty: "flowchart", rootData })) {
                                                              vErrors = vErrors === null ? validate114.errors : vErrors.concat(validate114.errors);
                                                              errors = vErrors.length;
                                                            }
                                                            var valid0 = _errs47 === errors;
                                                          } else {
                                                            var valid0 = true;
                                                          }
                                                          if (valid0) {
                                                            if (data.sqlPuzzle !== void 0 && func0.call(data, "sqlPuzzle")) {
                                                              const _errs48 = errors;
                                                              if (!validate128(data.sqlPuzzle, { instancePath: instancePath + "/sqlPuzzle", parentData: data, parentDataProperty: "sqlPuzzle", rootData })) {
                                                                vErrors = vErrors === null ? validate128.errors : vErrors.concat(validate128.errors);
                                                                errors = vErrors.length;
                                                              }
                                                              var valid0 = _errs48 === errors;
                                                            } else {
                                                              var valid0 = true;
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate384.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate384.errors = vErrors;
  return errors === 0;
}
var validateForeignKeyStructure = validate407;
function validate407(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.table === void 0 || !func0.call(data, "table")) && (missing0 = "table") || (data.column === void 0 || !func0.call(data, "column")) && (missing0 = "column")) {
        validate407.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "table" || key0 === "column")) {
            validate407.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.table !== void 0 && func0.call(data, "table")) {
            const _errs2 = errors;
            if (!validate69(data.table, { instancePath: instancePath + "/table", parentData: data, parentDataProperty: "table", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.column !== void 0 && func0.call(data, "column")) {
              const _errs3 = errors;
              if (!validate69(data.column, { instancePath: instancePath + "/column", parentData: data, parentDataProperty: "column", rootData })) {
                vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate407.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate407.errors = vErrors;
  return errors === 0;
}
var validateIntegerColumnStructure = validate410;
function validate144(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.table === void 0 || !func0.call(data, "table")) && (missing0 = "table") || (data.column === void 0 || !func0.call(data, "column")) && (missing0 = "column")) {
        validate144.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "table" || key0 === "column")) {
            validate144.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.table !== void 0 && func0.call(data, "table")) {
            const _errs2 = errors;
            if (!validate69(data.table, { instancePath: instancePath + "/table", parentData: data, parentDataProperty: "table", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.column !== void 0 && func0.call(data, "column")) {
              const _errs3 = errors;
              if (!validate69(data.column, { instancePath: instancePath + "/column", parentData: data, parentDataProperty: "column", rootData })) {
                vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate144.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate144.errors = vErrors;
  return errors === 0;
}
function validate148(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (!(typeof data == "number" && (!(data % 1) && !isNaN(data)) && isFinite(data))) {
    validate148.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
    return false;
  }
  if (errors === 0) {
    if (typeof data == "number" && isFinite(data)) {
      if (data > 9007199254740991 || isNaN(data)) {
        validate148.errors = [{ instancePath, schemaPath: "#/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
        return false;
      } else {
        if (data < -9007199254740991 || isNaN(data)) {
          validate148.errors = [{ instancePath, schemaPath: "#/minimum", keyword: "minimum", params: { comparison: ">=", limit: -9007199254740991 }, message: "must be >= -9007199254740991" }];
          return false;
        }
      }
    }
  }
  validate148.errors = vErrors;
  return errors === 0;
}
function validate410(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs1 = errors;
  const _errs2 = errors;
  if (errors === _errs2) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.primaryKey === void 0 || !func0.call(data, "primaryKey")) && (missing0 = "primaryKey") || (data.nullable === void 0 || !func0.call(data, "nullable")) && (missing0 = "nullable")) {
        const err0 = {};
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      } else {
        if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
          const _errs4 = errors;
          if (true !== data.primaryKey) {
            const err1 = {};
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
          var valid1 = _errs4 === errors;
        } else {
          var valid1 = true;
        }
        if (valid1) {
          if (data.nullable !== void 0 && func0.call(data, "nullable")) {
            const _errs5 = errors;
            if (true !== data.nullable) {
              const err2 = {};
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
            var valid1 = _errs5 === errors;
          } else {
            var valid1 = true;
          }
        }
      }
    } else {
      const err3 = {};
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
  }
  var valid0 = _errs2 === errors;
  if (valid0) {
    validate410.errors = [{ instancePath, schemaPath: "#/not", keyword: "not", params: {}, message: "must NOT be valid" }];
    return false;
  } else {
    errors = _errs1;
    if (vErrors !== null) {
      if (_errs1) {
        vErrors.length = _errs1;
      } else {
        vErrors = null;
      }
    }
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing1;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing1 = "name") || (data.description === void 0 || !func0.call(data, "description")) && (missing1 = "description") || (data.type === void 0 || !func0.call(data, "type")) && (missing1 = "type")) {
        validate410.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
        return false;
      } else {
        const _errs6 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "description" || key0 === "nullable" || key0 === "primaryKey" || key0 === "references" || key0 === "type" || key0 === "minimum")) {
            validate410.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs6 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs7 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid2 = _errs7 === errors;
          } else {
            var valid2 = true;
          }
          if (valid2) {
            if (data.description !== void 0 && func0.call(data, "description")) {
              const _errs8 = errors;
              if (!validate119(data.description, { instancePath: instancePath + "/description", parentData: data, parentDataProperty: "description", rootData })) {
                vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                errors = vErrors.length;
              }
              var valid2 = _errs8 === errors;
            } else {
              var valid2 = true;
            }
            if (valid2) {
              if (data.nullable !== void 0 && func0.call(data, "nullable")) {
                const _errs9 = errors;
                if (typeof data.nullable !== "boolean") {
                  validate410.errors = [{ instancePath: instancePath + "/nullable", schemaPath: "#/properties/nullable/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                  return false;
                }
                var valid2 = _errs9 === errors;
              } else {
                var valid2 = true;
              }
              if (valid2) {
                if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
                  const _errs11 = errors;
                  if (typeof data.primaryKey !== "boolean") {
                    validate410.errors = [{ instancePath: instancePath + "/primaryKey", schemaPath: "#/properties/primaryKey/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                    return false;
                  }
                  var valid2 = _errs11 === errors;
                } else {
                  var valid2 = true;
                }
                if (valid2) {
                  if (data.references !== void 0 && func0.call(data, "references")) {
                    const _errs13 = errors;
                    if (!validate144(data.references, { instancePath: instancePath + "/references", parentData: data, parentDataProperty: "references", rootData })) {
                      vErrors = vErrors === null ? validate144.errors : vErrors.concat(validate144.errors);
                      errors = vErrors.length;
                    }
                    var valid2 = _errs13 === errors;
                  } else {
                    var valid2 = true;
                  }
                  if (valid2) {
                    if (data.type !== void 0 && func0.call(data, "type")) {
                      let data7 = data.type;
                      const _errs14 = errors;
                      if (typeof data7 !== "string") {
                        validate410.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                      if ("INTEGER" !== data7) {
                        validate410.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "INTEGER" }, message: "must be equal to constant" }];
                        return false;
                      }
                      var valid2 = _errs14 === errors;
                    } else {
                      var valid2 = true;
                    }
                    if (valid2) {
                      if (data.minimum !== void 0 && func0.call(data, "minimum")) {
                        const _errs16 = errors;
                        if (!validate148(data.minimum, { instancePath: instancePath + "/minimum", parentData: data, parentDataProperty: "minimum", rootData })) {
                          vErrors = vErrors === null ? validate148.errors : vErrors.concat(validate148.errors);
                          errors = vErrors.length;
                        }
                        var valid2 = _errs16 === errors;
                      } else {
                        var valid2 = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate410.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate410.errors = vErrors;
  return errors === 0;
}
var validateRealColumnStructure = validate415;
function validate415(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs1 = errors;
  const _errs2 = errors;
  if (errors === _errs2) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.primaryKey === void 0 || !func0.call(data, "primaryKey")) && (missing0 = "primaryKey") || (data.nullable === void 0 || !func0.call(data, "nullable")) && (missing0 = "nullable")) {
        const err0 = {};
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      } else {
        if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
          const _errs4 = errors;
          if (true !== data.primaryKey) {
            const err1 = {};
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
          var valid1 = _errs4 === errors;
        } else {
          var valid1 = true;
        }
        if (valid1) {
          if (data.nullable !== void 0 && func0.call(data, "nullable")) {
            const _errs5 = errors;
            if (true !== data.nullable) {
              const err2 = {};
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
            var valid1 = _errs5 === errors;
          } else {
            var valid1 = true;
          }
        }
      }
    } else {
      const err3 = {};
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
  }
  var valid0 = _errs2 === errors;
  if (valid0) {
    validate415.errors = [{ instancePath, schemaPath: "#/not", keyword: "not", params: {}, message: "must NOT be valid" }];
    return false;
  } else {
    errors = _errs1;
    if (vErrors !== null) {
      if (_errs1) {
        vErrors.length = _errs1;
      } else {
        vErrors = null;
      }
    }
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing1;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing1 = "name") || (data.description === void 0 || !func0.call(data, "description")) && (missing1 = "description") || (data.type === void 0 || !func0.call(data, "type")) && (missing1 = "type")) {
        validate415.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
        return false;
      } else {
        const _errs6 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "description" || key0 === "nullable" || key0 === "primaryKey" || key0 === "references" || key0 === "type" || key0 === "minimum")) {
            validate415.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs6 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs7 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid2 = _errs7 === errors;
          } else {
            var valid2 = true;
          }
          if (valid2) {
            if (data.description !== void 0 && func0.call(data, "description")) {
              const _errs8 = errors;
              if (!validate119(data.description, { instancePath: instancePath + "/description", parentData: data, parentDataProperty: "description", rootData })) {
                vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                errors = vErrors.length;
              }
              var valid2 = _errs8 === errors;
            } else {
              var valid2 = true;
            }
            if (valid2) {
              if (data.nullable !== void 0 && func0.call(data, "nullable")) {
                const _errs9 = errors;
                if (typeof data.nullable !== "boolean") {
                  validate415.errors = [{ instancePath: instancePath + "/nullable", schemaPath: "#/properties/nullable/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                  return false;
                }
                var valid2 = _errs9 === errors;
              } else {
                var valid2 = true;
              }
              if (valid2) {
                if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
                  const _errs11 = errors;
                  if (typeof data.primaryKey !== "boolean") {
                    validate415.errors = [{ instancePath: instancePath + "/primaryKey", schemaPath: "#/properties/primaryKey/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                    return false;
                  }
                  var valid2 = _errs11 === errors;
                } else {
                  var valid2 = true;
                }
                if (valid2) {
                  if (data.references !== void 0 && func0.call(data, "references")) {
                    const _errs13 = errors;
                    if (!validate144(data.references, { instancePath: instancePath + "/references", parentData: data, parentDataProperty: "references", rootData })) {
                      vErrors = vErrors === null ? validate144.errors : vErrors.concat(validate144.errors);
                      errors = vErrors.length;
                    }
                    var valid2 = _errs13 === errors;
                  } else {
                    var valid2 = true;
                  }
                  if (valid2) {
                    if (data.type !== void 0 && func0.call(data, "type")) {
                      let data7 = data.type;
                      const _errs14 = errors;
                      if (typeof data7 !== "string") {
                        validate415.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                      if ("REAL" !== data7) {
                        validate415.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "REAL" }, message: "must be equal to constant" }];
                        return false;
                      }
                      var valid2 = _errs14 === errors;
                    } else {
                      var valid2 = true;
                    }
                    if (valid2) {
                      if (data.minimum !== void 0 && func0.call(data, "minimum")) {
                        const _errs16 = errors;
                        if (!validate104(data.minimum, { instancePath: instancePath + "/minimum", parentData: data, parentDataProperty: "minimum", rootData })) {
                          vErrors = vErrors === null ? validate104.errors : vErrors.concat(validate104.errors);
                          errors = vErrors.length;
                        }
                        var valid2 = _errs16 === errors;
                      } else {
                        var valid2 = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate415.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate415.errors = vErrors;
  return errors === 0;
}
var validateTextColumnStructure = validate420;
function validate420(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs1 = errors;
  const _errs2 = errors;
  if (errors === _errs2) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.primaryKey === void 0 || !func0.call(data, "primaryKey")) && (missing0 = "primaryKey") || (data.nullable === void 0 || !func0.call(data, "nullable")) && (missing0 = "nullable")) {
        const err0 = {};
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      } else {
        if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
          const _errs4 = errors;
          if (true !== data.primaryKey) {
            const err1 = {};
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
          var valid1 = _errs4 === errors;
        } else {
          var valid1 = true;
        }
        if (valid1) {
          if (data.nullable !== void 0 && func0.call(data, "nullable")) {
            const _errs5 = errors;
            if (true !== data.nullable) {
              const err2 = {};
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
            var valid1 = _errs5 === errors;
          } else {
            var valid1 = true;
          }
        }
      }
    } else {
      const err3 = {};
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
  }
  var valid0 = _errs2 === errors;
  if (valid0) {
    validate420.errors = [{ instancePath, schemaPath: "#/not", keyword: "not", params: {}, message: "must NOT be valid" }];
    return false;
  } else {
    errors = _errs1;
    if (vErrors !== null) {
      if (_errs1) {
        vErrors.length = _errs1;
      } else {
        vErrors = null;
      }
    }
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing1;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing1 = "name") || (data.description === void 0 || !func0.call(data, "description")) && (missing1 = "description") || (data.type === void 0 || !func0.call(data, "type")) && (missing1 = "type")) {
        validate420.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
        return false;
      } else {
        const _errs6 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "description" || key0 === "nullable" || key0 === "primaryKey" || key0 === "references" || key0 === "type")) {
            validate420.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs6 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs7 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid2 = _errs7 === errors;
          } else {
            var valid2 = true;
          }
          if (valid2) {
            if (data.description !== void 0 && func0.call(data, "description")) {
              const _errs8 = errors;
              if (!validate119(data.description, { instancePath: instancePath + "/description", parentData: data, parentDataProperty: "description", rootData })) {
                vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                errors = vErrors.length;
              }
              var valid2 = _errs8 === errors;
            } else {
              var valid2 = true;
            }
            if (valid2) {
              if (data.nullable !== void 0 && func0.call(data, "nullable")) {
                const _errs9 = errors;
                if (typeof data.nullable !== "boolean") {
                  validate420.errors = [{ instancePath: instancePath + "/nullable", schemaPath: "#/properties/nullable/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                  return false;
                }
                var valid2 = _errs9 === errors;
              } else {
                var valid2 = true;
              }
              if (valid2) {
                if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
                  const _errs11 = errors;
                  if (typeof data.primaryKey !== "boolean") {
                    validate420.errors = [{ instancePath: instancePath + "/primaryKey", schemaPath: "#/properties/primaryKey/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                    return false;
                  }
                  var valid2 = _errs11 === errors;
                } else {
                  var valid2 = true;
                }
                if (valid2) {
                  if (data.references !== void 0 && func0.call(data, "references")) {
                    const _errs13 = errors;
                    if (!validate144(data.references, { instancePath: instancePath + "/references", parentData: data, parentDataProperty: "references", rootData })) {
                      vErrors = vErrors === null ? validate144.errors : vErrors.concat(validate144.errors);
                      errors = vErrors.length;
                    }
                    var valid2 = _errs13 === errors;
                  } else {
                    var valid2 = true;
                  }
                  if (valid2) {
                    if (data.type !== void 0 && func0.call(data, "type")) {
                      let data7 = data.type;
                      const _errs14 = errors;
                      if (typeof data7 !== "string") {
                        validate420.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                      if ("TEXT" !== data7) {
                        validate420.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "TEXT" }, message: "must be equal to constant" }];
                        return false;
                      }
                      var valid2 = _errs14 === errors;
                    } else {
                      var valid2 = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate420.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate420.errors = vErrors;
  return errors === 0;
}
var validateFixtureColumnStructure = validate424;
function validate141(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs1 = errors;
  const _errs2 = errors;
  if (errors === _errs2) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.primaryKey === void 0 || !func0.call(data, "primaryKey")) && (missing0 = "primaryKey") || (data.nullable === void 0 || !func0.call(data, "nullable")) && (missing0 = "nullable")) {
        const err0 = {};
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      } else {
        if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
          const _errs4 = errors;
          if (true !== data.primaryKey) {
            const err1 = {};
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
          var valid1 = _errs4 === errors;
        } else {
          var valid1 = true;
        }
        if (valid1) {
          if (data.nullable !== void 0 && func0.call(data, "nullable")) {
            const _errs5 = errors;
            if (true !== data.nullable) {
              const err2 = {};
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
            var valid1 = _errs5 === errors;
          } else {
            var valid1 = true;
          }
        }
      }
    } else {
      const err3 = {};
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
  }
  var valid0 = _errs2 === errors;
  if (valid0) {
    validate141.errors = [{ instancePath, schemaPath: "#/not", keyword: "not", params: {}, message: "must NOT be valid" }];
    return false;
  } else {
    errors = _errs1;
    if (vErrors !== null) {
      if (_errs1) {
        vErrors.length = _errs1;
      } else {
        vErrors = null;
      }
    }
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing1;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing1 = "name") || (data.description === void 0 || !func0.call(data, "description")) && (missing1 = "description") || (data.type === void 0 || !func0.call(data, "type")) && (missing1 = "type")) {
        validate141.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
        return false;
      } else {
        const _errs6 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "description" || key0 === "nullable" || key0 === "primaryKey" || key0 === "references" || key0 === "type" || key0 === "minimum")) {
            validate141.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs6 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs7 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid2 = _errs7 === errors;
          } else {
            var valid2 = true;
          }
          if (valid2) {
            if (data.description !== void 0 && func0.call(data, "description")) {
              const _errs8 = errors;
              if (!validate119(data.description, { instancePath: instancePath + "/description", parentData: data, parentDataProperty: "description", rootData })) {
                vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                errors = vErrors.length;
              }
              var valid2 = _errs8 === errors;
            } else {
              var valid2 = true;
            }
            if (valid2) {
              if (data.nullable !== void 0 && func0.call(data, "nullable")) {
                const _errs9 = errors;
                if (typeof data.nullable !== "boolean") {
                  validate141.errors = [{ instancePath: instancePath + "/nullable", schemaPath: "#/properties/nullable/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                  return false;
                }
                var valid2 = _errs9 === errors;
              } else {
                var valid2 = true;
              }
              if (valid2) {
                if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
                  const _errs11 = errors;
                  if (typeof data.primaryKey !== "boolean") {
                    validate141.errors = [{ instancePath: instancePath + "/primaryKey", schemaPath: "#/properties/primaryKey/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                    return false;
                  }
                  var valid2 = _errs11 === errors;
                } else {
                  var valid2 = true;
                }
                if (valid2) {
                  if (data.references !== void 0 && func0.call(data, "references")) {
                    const _errs13 = errors;
                    if (!validate144(data.references, { instancePath: instancePath + "/references", parentData: data, parentDataProperty: "references", rootData })) {
                      vErrors = vErrors === null ? validate144.errors : vErrors.concat(validate144.errors);
                      errors = vErrors.length;
                    }
                    var valid2 = _errs13 === errors;
                  } else {
                    var valid2 = true;
                  }
                  if (valid2) {
                    if (data.type !== void 0 && func0.call(data, "type")) {
                      let data7 = data.type;
                      const _errs14 = errors;
                      if (typeof data7 !== "string") {
                        validate141.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                      if ("INTEGER" !== data7) {
                        validate141.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "INTEGER" }, message: "must be equal to constant" }];
                        return false;
                      }
                      var valid2 = _errs14 === errors;
                    } else {
                      var valid2 = true;
                    }
                    if (valid2) {
                      if (data.minimum !== void 0 && func0.call(data, "minimum")) {
                        const _errs16 = errors;
                        if (!validate148(data.minimum, { instancePath: instancePath + "/minimum", parentData: data, parentDataProperty: "minimum", rootData })) {
                          vErrors = vErrors === null ? validate148.errors : vErrors.concat(validate148.errors);
                          errors = vErrors.length;
                        }
                        var valid2 = _errs16 === errors;
                      } else {
                        var valid2 = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate141.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate141.errors = vErrors;
  return errors === 0;
}
function validate151(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs1 = errors;
  const _errs2 = errors;
  if (errors === _errs2) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.primaryKey === void 0 || !func0.call(data, "primaryKey")) && (missing0 = "primaryKey") || (data.nullable === void 0 || !func0.call(data, "nullable")) && (missing0 = "nullable")) {
        const err0 = {};
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      } else {
        if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
          const _errs4 = errors;
          if (true !== data.primaryKey) {
            const err1 = {};
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
          var valid1 = _errs4 === errors;
        } else {
          var valid1 = true;
        }
        if (valid1) {
          if (data.nullable !== void 0 && func0.call(data, "nullable")) {
            const _errs5 = errors;
            if (true !== data.nullable) {
              const err2 = {};
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
            var valid1 = _errs5 === errors;
          } else {
            var valid1 = true;
          }
        }
      }
    } else {
      const err3 = {};
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
  }
  var valid0 = _errs2 === errors;
  if (valid0) {
    validate151.errors = [{ instancePath, schemaPath: "#/not", keyword: "not", params: {}, message: "must NOT be valid" }];
    return false;
  } else {
    errors = _errs1;
    if (vErrors !== null) {
      if (_errs1) {
        vErrors.length = _errs1;
      } else {
        vErrors = null;
      }
    }
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing1;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing1 = "name") || (data.description === void 0 || !func0.call(data, "description")) && (missing1 = "description") || (data.type === void 0 || !func0.call(data, "type")) && (missing1 = "type")) {
        validate151.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
        return false;
      } else {
        const _errs6 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "description" || key0 === "nullable" || key0 === "primaryKey" || key0 === "references" || key0 === "type" || key0 === "minimum")) {
            validate151.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs6 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs7 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid2 = _errs7 === errors;
          } else {
            var valid2 = true;
          }
          if (valid2) {
            if (data.description !== void 0 && func0.call(data, "description")) {
              const _errs8 = errors;
              if (!validate119(data.description, { instancePath: instancePath + "/description", parentData: data, parentDataProperty: "description", rootData })) {
                vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                errors = vErrors.length;
              }
              var valid2 = _errs8 === errors;
            } else {
              var valid2 = true;
            }
            if (valid2) {
              if (data.nullable !== void 0 && func0.call(data, "nullable")) {
                const _errs9 = errors;
                if (typeof data.nullable !== "boolean") {
                  validate151.errors = [{ instancePath: instancePath + "/nullable", schemaPath: "#/properties/nullable/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                  return false;
                }
                var valid2 = _errs9 === errors;
              } else {
                var valid2 = true;
              }
              if (valid2) {
                if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
                  const _errs11 = errors;
                  if (typeof data.primaryKey !== "boolean") {
                    validate151.errors = [{ instancePath: instancePath + "/primaryKey", schemaPath: "#/properties/primaryKey/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                    return false;
                  }
                  var valid2 = _errs11 === errors;
                } else {
                  var valid2 = true;
                }
                if (valid2) {
                  if (data.references !== void 0 && func0.call(data, "references")) {
                    const _errs13 = errors;
                    if (!validate144(data.references, { instancePath: instancePath + "/references", parentData: data, parentDataProperty: "references", rootData })) {
                      vErrors = vErrors === null ? validate144.errors : vErrors.concat(validate144.errors);
                      errors = vErrors.length;
                    }
                    var valid2 = _errs13 === errors;
                  } else {
                    var valid2 = true;
                  }
                  if (valid2) {
                    if (data.type !== void 0 && func0.call(data, "type")) {
                      let data7 = data.type;
                      const _errs14 = errors;
                      if (typeof data7 !== "string") {
                        validate151.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                      if ("REAL" !== data7) {
                        validate151.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "REAL" }, message: "must be equal to constant" }];
                        return false;
                      }
                      var valid2 = _errs14 === errors;
                    } else {
                      var valid2 = true;
                    }
                    if (valid2) {
                      if (data.minimum !== void 0 && func0.call(data, "minimum")) {
                        const _errs16 = errors;
                        if (!validate104(data.minimum, { instancePath: instancePath + "/minimum", parentData: data, parentDataProperty: "minimum", rootData })) {
                          vErrors = vErrors === null ? validate104.errors : vErrors.concat(validate104.errors);
                          errors = vErrors.length;
                        }
                        var valid2 = _errs16 === errors;
                      } else {
                        var valid2 = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate151.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate151.errors = vErrors;
  return errors === 0;
}
function validate157(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs1 = errors;
  const _errs2 = errors;
  if (errors === _errs2) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.primaryKey === void 0 || !func0.call(data, "primaryKey")) && (missing0 = "primaryKey") || (data.nullable === void 0 || !func0.call(data, "nullable")) && (missing0 = "nullable")) {
        const err0 = {};
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      } else {
        if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
          const _errs4 = errors;
          if (true !== data.primaryKey) {
            const err1 = {};
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
          var valid1 = _errs4 === errors;
        } else {
          var valid1 = true;
        }
        if (valid1) {
          if (data.nullable !== void 0 && func0.call(data, "nullable")) {
            const _errs5 = errors;
            if (true !== data.nullable) {
              const err2 = {};
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
            var valid1 = _errs5 === errors;
          } else {
            var valid1 = true;
          }
        }
      }
    } else {
      const err3 = {};
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
  }
  var valid0 = _errs2 === errors;
  if (valid0) {
    validate157.errors = [{ instancePath, schemaPath: "#/not", keyword: "not", params: {}, message: "must NOT be valid" }];
    return false;
  } else {
    errors = _errs1;
    if (vErrors !== null) {
      if (_errs1) {
        vErrors.length = _errs1;
      } else {
        vErrors = null;
      }
    }
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing1;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing1 = "name") || (data.description === void 0 || !func0.call(data, "description")) && (missing1 = "description") || (data.type === void 0 || !func0.call(data, "type")) && (missing1 = "type")) {
        validate157.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
        return false;
      } else {
        const _errs6 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "description" || key0 === "nullable" || key0 === "primaryKey" || key0 === "references" || key0 === "type")) {
            validate157.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs6 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs7 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid2 = _errs7 === errors;
          } else {
            var valid2 = true;
          }
          if (valid2) {
            if (data.description !== void 0 && func0.call(data, "description")) {
              const _errs8 = errors;
              if (!validate119(data.description, { instancePath: instancePath + "/description", parentData: data, parentDataProperty: "description", rootData })) {
                vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                errors = vErrors.length;
              }
              var valid2 = _errs8 === errors;
            } else {
              var valid2 = true;
            }
            if (valid2) {
              if (data.nullable !== void 0 && func0.call(data, "nullable")) {
                const _errs9 = errors;
                if (typeof data.nullable !== "boolean") {
                  validate157.errors = [{ instancePath: instancePath + "/nullable", schemaPath: "#/properties/nullable/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                  return false;
                }
                var valid2 = _errs9 === errors;
              } else {
                var valid2 = true;
              }
              if (valid2) {
                if (data.primaryKey !== void 0 && func0.call(data, "primaryKey")) {
                  const _errs11 = errors;
                  if (typeof data.primaryKey !== "boolean") {
                    validate157.errors = [{ instancePath: instancePath + "/primaryKey", schemaPath: "#/properties/primaryKey/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                    return false;
                  }
                  var valid2 = _errs11 === errors;
                } else {
                  var valid2 = true;
                }
                if (valid2) {
                  if (data.references !== void 0 && func0.call(data, "references")) {
                    const _errs13 = errors;
                    if (!validate144(data.references, { instancePath: instancePath + "/references", parentData: data, parentDataProperty: "references", rootData })) {
                      vErrors = vErrors === null ? validate144.errors : vErrors.concat(validate144.errors);
                      errors = vErrors.length;
                    }
                    var valid2 = _errs13 === errors;
                  } else {
                    var valid2 = true;
                  }
                  if (valid2) {
                    if (data.type !== void 0 && func0.call(data, "type")) {
                      let data7 = data.type;
                      const _errs14 = errors;
                      if (typeof data7 !== "string") {
                        validate157.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                      if ("TEXT" !== data7) {
                        validate157.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "TEXT" }, message: "must be equal to constant" }];
                        return false;
                      }
                      var valid2 = _errs14 === errors;
                    } else {
                      var valid2 = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate157.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate157.errors = vErrors;
  return errors === 0;
}
function validate424(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  let passing0 = null;
  const _errs1 = errors;
  if (!validate141(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate141.errors : vErrors.concat(validate141.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs1 === errors;
  if (_valid0) {
    valid0 = true;
    passing0 = 0;
  }
  const _errs2 = errors;
  if (!validate151(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate151.errors : vErrors.concat(validate151.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs2 === errors;
  if (_valid0 && valid0) {
    valid0 = false;
    passing0 = [passing0, 1];
  } else {
    if (_valid0) {
      valid0 = true;
      passing0 = 1;
    }
    const _errs3 = errors;
    if (!validate157(data, { instancePath, parentData, parentDataProperty, rootData })) {
      vErrors = vErrors === null ? validate157.errors : vErrors.concat(validate157.errors);
      errors = vErrors.length;
    }
    var _valid0 = _errs3 === errors;
    if (_valid0 && valid0) {
      valid0 = false;
      passing0 = [passing0, 2];
    } else {
      if (_valid0) {
        valid0 = true;
        passing0 = 2;
      }
    }
  }
  if (!valid0) {
    const err0 = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
    validate424.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate424.errors = vErrors;
  return errors === 0;
}
var validateFixtureTableStructure = validate428;
function validate140(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  let passing0 = null;
  const _errs1 = errors;
  if (!validate141(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate141.errors : vErrors.concat(validate141.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs1 === errors;
  if (_valid0) {
    valid0 = true;
    passing0 = 0;
  }
  const _errs2 = errors;
  if (!validate151(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate151.errors : vErrors.concat(validate151.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs2 === errors;
  if (_valid0 && valid0) {
    valid0 = false;
    passing0 = [passing0, 1];
  } else {
    if (_valid0) {
      valid0 = true;
      passing0 = 1;
    }
    const _errs3 = errors;
    if (!validate157(data, { instancePath, parentData, parentDataProperty, rootData })) {
      vErrors = vErrors === null ? validate157.errors : vErrors.concat(validate157.errors);
      errors = vErrors.length;
    }
    var _valid0 = _errs3 === errors;
    if (_valid0 && valid0) {
      valid0 = false;
      passing0 = [passing0, 2];
    } else {
      if (_valid0) {
        valid0 = true;
        passing0 = 2;
      }
    }
  }
  if (!valid0) {
    const err0 = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
    validate140.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate140.errors = vErrors;
  return errors === 0;
}
function validate428(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing0 = "name") || (data.description === void 0 || !func0.call(data, "description")) && (missing0 = "description") || (data.columns === void 0 || !func0.call(data, "columns")) && (missing0 = "columns") || (data.rows === void 0 || !func0.call(data, "rows")) && (missing0 = "rows")) {
        validate428.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "description" || key0 === "columns" || key0 === "rows")) {
            validate428.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs3 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.description !== void 0 && func0.call(data, "description")) {
              const _errs4 = errors;
              if (!validate119(data.description, { instancePath: instancePath + "/description", parentData: data, parentDataProperty: "description", rootData })) {
                vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.columns !== void 0 && func0.call(data, "columns")) {
                let data2 = data.columns;
                const _errs5 = errors;
                if (errors === _errs5) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 100) {
                      validate428.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                      return false;
                    } else {
                      if (data2.length < 1) {
                        validate428.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs7 = errors;
                          if (!validate140(data2[i0], { instancePath: instancePath + "/columns/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate140.errors : vErrors.concat(validate140.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs7 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate428.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs5 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.rows !== void 0 && func0.call(data, "rows")) {
                  let data4 = data.rows;
                  const _errs8 = errors;
                  if (errors === _errs8) {
                    if (Array.isArray(data4)) {
                      if (data4.length > 5e3) {
                        validate428.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/maxItems", keyword: "maxItems", params: { limit: 5e3 }, message: "must NOT have more than 5000 items" }];
                        return false;
                      } else {
                        if (data4.length < 0) {
                          validate428.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                          return false;
                        } else {
                          var valid2 = true;
                          const len1 = data4.length;
                          for (let i1 = 0; i1 < len1; i1++) {
                            const _errs10 = errors;
                            if (!validate102(data4[i1], { instancePath: instancePath + "/rows/" + i1, parentData: data4, parentDataProperty: i1, rootData })) {
                              vErrors = vErrors === null ? validate102.errors : vErrors.concat(validate102.errors);
                              errors = vErrors.length;
                            }
                            var valid2 = _errs10 === errors;
                            if (!valid2) {
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      validate428.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                      return false;
                    }
                  }
                  var valid0 = _errs8 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate428.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate428.errors = vErrors;
  return errors === 0;
}
var validateIndexColumnStructure = validate433;
var schema52 = { "type": "object", "additionalProperties": false, "properties": { "name": { "$ref": "#/definitions/Identifier" }, "direction": { "type": "string", "enum": ["ASC", "DESC"] } }, "required": ["name", "direction"] };
function validate433(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing0 = "name") || (data.direction === void 0 || !func0.call(data, "direction")) && (missing0 = "direction")) {
        validate433.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "direction")) {
            validate433.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs2 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.direction !== void 0 && func0.call(data, "direction")) {
              let data1 = data.direction;
              const _errs3 = errors;
              if (typeof data1 !== "string") {
                validate433.errors = [{ instancePath: instancePath + "/direction", schemaPath: "#/properties/direction/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              if (!(data1 === "ASC" || data1 === "DESC")) {
                validate433.errors = [{ instancePath: instancePath + "/direction", schemaPath: "#/properties/direction/enum", keyword: "enum", params: { allowedValues: schema52.properties.direction.enum }, message: "must be equal to one of the allowed values" }];
                return false;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate433.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate433.errors = vErrors;
  return errors === 0;
}
var validateFixtureIndexDefinitionStructure = validate435;
function validate168(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing0 = "name") || (data.direction === void 0 || !func0.call(data, "direction")) && (missing0 = "direction")) {
        validate168.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "direction")) {
            validate168.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs2 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.direction !== void 0 && func0.call(data, "direction")) {
              let data1 = data.direction;
              const _errs3 = errors;
              if (typeof data1 !== "string") {
                validate168.errors = [{ instancePath: instancePath + "/direction", schemaPath: "#/properties/direction/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              if (!(data1 === "ASC" || data1 === "DESC")) {
                validate168.errors = [{ instancePath: instancePath + "/direction", schemaPath: "#/properties/direction/enum", keyword: "enum", params: { allowedValues: schema52.properties.direction.enum }, message: "must be equal to one of the allowed values" }];
                return false;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate168.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate168.errors = vErrors;
  return errors === 0;
}
function validate435(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing0 = "name") || (data.table === void 0 || !func0.call(data, "table")) && (missing0 = "table") || (data.columns === void 0 || !func0.call(data, "columns")) && (missing0 = "columns")) {
        validate435.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "table" || key0 === "columns")) {
            validate435.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs2 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.table !== void 0 && func0.call(data, "table")) {
              const _errs3 = errors;
              if (!validate69(data.table, { instancePath: instancePath + "/table", parentData: data, parentDataProperty: "table", rootData })) {
                vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.columns !== void 0 && func0.call(data, "columns")) {
                let data2 = data.columns;
                const _errs4 = errors;
                if (errors === _errs4) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 100) {
                      validate435.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                      return false;
                    } else {
                      if (data2.length < 1) {
                        validate435.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs6 = errors;
                          if (!validate168(data2[i0], { instancePath: instancePath + "/columns/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate168.errors : vErrors.concat(validate168.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs6 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate435.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate435.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate435.errors = vErrors;
  return errors === 0;
}
var validateFixtureStructure = validate439;
function validate137(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing0 = "name") || (data.description === void 0 || !func0.call(data, "description")) && (missing0 = "description") || (data.columns === void 0 || !func0.call(data, "columns")) && (missing0 = "columns") || (data.rows === void 0 || !func0.call(data, "rows")) && (missing0 = "rows")) {
        validate137.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "description" || key0 === "columns" || key0 === "rows")) {
            validate137.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs3 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.description !== void 0 && func0.call(data, "description")) {
              const _errs4 = errors;
              if (!validate119(data.description, { instancePath: instancePath + "/description", parentData: data, parentDataProperty: "description", rootData })) {
                vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.columns !== void 0 && func0.call(data, "columns")) {
                let data2 = data.columns;
                const _errs5 = errors;
                if (errors === _errs5) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 100) {
                      validate137.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                      return false;
                    } else {
                      if (data2.length < 1) {
                        validate137.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs7 = errors;
                          if (!validate140(data2[i0], { instancePath: instancePath + "/columns/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate140.errors : vErrors.concat(validate140.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs7 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate137.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs5 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.rows !== void 0 && func0.call(data, "rows")) {
                  let data4 = data.rows;
                  const _errs8 = errors;
                  if (errors === _errs8) {
                    if (Array.isArray(data4)) {
                      if (data4.length > 5e3) {
                        validate137.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/maxItems", keyword: "maxItems", params: { limit: 5e3 }, message: "must NOT have more than 5000 items" }];
                        return false;
                      } else {
                        if (data4.length < 0) {
                          validate137.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                          return false;
                        } else {
                          var valid2 = true;
                          const len1 = data4.length;
                          for (let i1 = 0; i1 < len1; i1++) {
                            const _errs10 = errors;
                            if (!validate102(data4[i1], { instancePath: instancePath + "/rows/" + i1, parentData: data4, parentDataProperty: i1, rootData })) {
                              vErrors = vErrors === null ? validate102.errors : vErrors.concat(validate102.errors);
                              errors = vErrors.length;
                            }
                            var valid2 = _errs10 === errors;
                            if (!valid2) {
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      validate137.errors = [{ instancePath: instancePath + "/rows", schemaPath: "#/properties/rows/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                      return false;
                    }
                  }
                  var valid0 = _errs8 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate137.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate137.errors = vErrors;
  return errors === 0;
}
function validate165(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.name === void 0 || !func0.call(data, "name")) && (missing0 = "name") || (data.table === void 0 || !func0.call(data, "table")) && (missing0 = "table") || (data.columns === void 0 || !func0.call(data, "columns")) && (missing0 = "columns")) {
        validate165.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "name" || key0 === "table" || key0 === "columns")) {
            validate165.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.name !== void 0 && func0.call(data, "name")) {
            const _errs2 = errors;
            if (!validate69(data.name, { instancePath: instancePath + "/name", parentData: data, parentDataProperty: "name", rootData })) {
              vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
              errors = vErrors.length;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.table !== void 0 && func0.call(data, "table")) {
              const _errs3 = errors;
              if (!validate69(data.table, { instancePath: instancePath + "/table", parentData: data, parentDataProperty: "table", rootData })) {
                vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.columns !== void 0 && func0.call(data, "columns")) {
                let data2 = data.columns;
                const _errs4 = errors;
                if (errors === _errs4) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 100) {
                      validate165.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                      return false;
                    } else {
                      if (data2.length < 1) {
                        validate165.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs6 = errors;
                          if (!validate168(data2[i0], { instancePath: instancePath + "/columns/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate168.errors : vErrors.concat(validate168.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs6 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate165.errors = [{ instancePath: instancePath + "/columns", schemaPath: "#/properties/columns/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate165.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate165.errors = vErrors;
  return errors === 0;
}
function validate439(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.tables === void 0 || !func0.call(data, "tables")) && (missing0 = "tables")) {
        validate439.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "schemaVersion" || key0 === "id" || key0 === "tables" || key0 === "indexes")) {
            validate439.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
            let data0 = data.schemaVersion;
            const _errs3 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)) && isFinite(data0))) {
              validate439.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (1 !== data0) {
              validate439.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.id !== void 0 && func0.call(data, "id")) {
              const _errs5 = errors;
              if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.tables !== void 0 && func0.call(data, "tables")) {
                let data2 = data.tables;
                const _errs6 = errors;
                if (errors === _errs6) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 64) {
                      validate439.errors = [{ instancePath: instancePath + "/tables", schemaPath: "#/properties/tables/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                      return false;
                    } else {
                      if (data2.length < 1) {
                        validate439.errors = [{ instancePath: instancePath + "/tables", schemaPath: "#/properties/tables/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs8 = errors;
                          if (!validate137(data2[i0], { instancePath: instancePath + "/tables/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate137.errors : vErrors.concat(validate137.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs8 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate439.errors = [{ instancePath: instancePath + "/tables", schemaPath: "#/properties/tables/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.indexes !== void 0 && func0.call(data, "indexes")) {
                  let data4 = data.indexes;
                  const _errs9 = errors;
                  if (errors === _errs9) {
                    if (Array.isArray(data4)) {
                      if (data4.length > 128) {
                        validate439.errors = [{ instancePath: instancePath + "/indexes", schemaPath: "#/properties/indexes/maxItems", keyword: "maxItems", params: { limit: 128 }, message: "must NOT have more than 128 items" }];
                        return false;
                      } else {
                        if (data4.length < 0) {
                          validate439.errors = [{ instancePath: instancePath + "/indexes", schemaPath: "#/properties/indexes/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                          return false;
                        } else {
                          var valid2 = true;
                          const len1 = data4.length;
                          for (let i1 = 0; i1 < len1; i1++) {
                            const _errs11 = errors;
                            if (!validate165(data4[i1], { instancePath: instancePath + "/indexes/" + i1, parentData: data4, parentDataProperty: i1, rootData })) {
                              vErrors = vErrors === null ? validate165.errors : vErrors.concat(validate165.errors);
                              errors = vErrors.length;
                            }
                            var valid2 = _errs11 === errors;
                            if (!valid2) {
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      validate439.errors = [{ instancePath: instancePath + "/indexes", schemaPath: "#/properties/indexes/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                      return false;
                    }
                  }
                  var valid0 = _errs9 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate439.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate439.errors = vErrors;
  return errors === 0;
}
var validatePrepareRequestStructure = validate443;
var schema55 = { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "prepare", "type": "string" }, "schemaVersion": { "type": "integer", "const": 1 }, "requestId": { "$ref": "#/definitions/Token" }, "contentToken": { "$ref": "#/definitions/Token" }, "rootRevision": { "$ref": "#/definitions/Revision" }, "courseId": { "$ref": "#/definitions/ContentId" }, "themeId": { "$ref": "#/definitions/ContentId" }, "lessonId": { "$ref": "#/definitions/ContentId" }, "lessonRevision": { "$ref": "#/definitions/Revision" }, "mode": { "$ref": "#/definitions/ExecutionMode" }, "inputMode": { "$ref": "#/definitions/InputMode" }, "sql": { "$ref": "#/definitions/Sql" }, "lesson": { "$ref": "#/definitions/Lesson" }, "fixtures": { "type": "array", "items": { "$ref": "#/definitions/Fixture" }, "minItems": 1, "maxItems": 100 } }, "required": ["type", "schemaVersion", "requestId", "contentToken", "rootRevision", "courseId", "themeId", "lessonId", "lessonRevision", "mode", "inputMode", "sql", "lesson", "fixtures"], "$comment": "Semantic: immutable identity must match lesson; fixtures are exactly the execution closure for run (preview) or submit (all tests). No recordGeneration, URLs, root document, fetch or progress. Worker rechecks closure." };
function validate176(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (typeof data === "string") {
      if (func55(data) > 128) {
        validate176.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 128 }, message: "must NOT have more than 128 characters" }];
        return false;
      } else {
        if (func55(data) < 1) {
          validate176.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
          return false;
        } else {
          if (!pattern8.test(data)) {
            validate176.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "^[A-Za-z0-9_-]+(?![\\s\\S])" }, message: 'must match pattern "^[A-Za-z0-9_-]+(?![\\s\\S])"' }];
            return false;
          }
        }
      }
    } else {
      validate176.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
      return false;
    }
  }
  validate176.errors = vErrors;
  return errors === 0;
}
function validate184(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (typeof data !== "string") {
    validate184.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
    return false;
  }
  if (!(data === "run" || data === "submit")) {
    validate184.errors = [{ instancePath, schemaPath: "#/enum", keyword: "enum", params: { allowedValues: schema57.enum }, message: "must be equal to one of the allowed values" }];
    return false;
  }
  validate184.errors = vErrors;
  return errors === 0;
}
function validate186(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (typeof data !== "string") {
    validate186.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
    return false;
  }
  if (!(data === "text" || data === "puzzle")) {
    validate186.errors = [{ instancePath, schemaPath: "#/enum", keyword: "enum", params: { allowedValues: schema58.enum }, message: "must be equal to one of the allowed values" }];
    return false;
  }
  validate186.errors = vErrors;
  return errors === 0;
}
function validate56(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.chapterId === void 0 || !func0.call(data, "chapterId")) && (missing0 = "chapterId") || (data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.revision === void 0 || !func0.call(data, "revision")) && (missing0 = "revision") || (data.dialect === void 0 || !func0.call(data, "dialect")) && (missing0 = "dialect") || (data.mode === void 0 || !func0.call(data, "mode")) && (missing0 = "mode") || (data.title === void 0 || !func0.call(data, "title")) && (missing0 = "title") || (data.prerequisites === void 0 || !func0.call(data, "prerequisites")) && (missing0 = "prerequisites") || (data.concepts === void 0 || !func0.call(data, "concepts")) && (missing0 = "concepts") || (data.introducedConcepts === void 0 || !func0.call(data, "introducedConcepts")) && (missing0 = "introducedConcepts") || (data.objective === void 0 || !func0.call(data, "objective")) && (missing0 = "objective") || (data.statement === void 0 || !func0.call(data, "statement")) && (missing0 = "statement") || (data.knowledge === void 0 || !func0.call(data, "knowledge")) && (missing0 = "knowledge") || (data.readableTables === void 0 || !func0.call(data, "readableTables")) && (missing0 = "readableTables") || (data.previewFixtureId === void 0 || !func0.call(data, "previewFixtureId")) && (missing0 = "previewFixtureId") || (data.duplicatePolicy === void 0 || !func0.call(data, "duplicatePolicy")) && (missing0 = "duplicatePolicy") || (data.starterSql === void 0 || !func0.call(data, "starterSql")) && (missing0 = "starterSql") || (data.hints === void 0 || !func0.call(data, "hints")) && (missing0 = "hints") || (data.referenceSolutions === void 0 || !func0.call(data, "referenceSolutions")) && (missing0 = "referenceSolutions") || (data.comparison === void 0 || !func0.call(data, "comparison")) && (missing0 = "comparison") || (data.tests === void 0 || !func0.call(data, "tests")) && (missing0 = "tests") || (data.expectedFailures === void 0 || !func0.call(data, "expectedFailures")) && (missing0 = "expectedFailures")) {
        validate56.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema18.properties, key0)) {
            validate56.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
            let data0 = data.schemaVersion;
            const _errs3 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)) && isFinite(data0))) {
              validate56.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (1 !== data0) {
              validate56.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.courseId !== void 0 && func0.call(data, "courseId")) {
              const _errs5 = errors;
              if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                const _errs6 = errors;
                if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                  vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.chapterId !== void 0 && func0.call(data, "chapterId")) {
                  const _errs7 = errors;
                  if (!validate23(data.chapterId, { instancePath: instancePath + "/chapterId", parentData: data, parentDataProperty: "chapterId", rootData })) {
                    vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.id !== void 0 && func0.call(data, "id")) {
                    const _errs8 = errors;
                    if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
                      vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.revision !== void 0 && func0.call(data, "revision")) {
                      const _errs9 = errors;
                      if (!validate25(data.revision, { instancePath: instancePath + "/revision", parentData: data, parentDataProperty: "revision", rootData })) {
                        vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.dialect !== void 0 && func0.call(data, "dialect")) {
                        let data6 = data.dialect;
                        const _errs10 = errors;
                        if (typeof data6 !== "string") {
                          validate56.errors = [{ instancePath: instancePath + "/dialect", schemaPath: "#/properties/dialect/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                          return false;
                        }
                        if ("sqlite" !== data6) {
                          validate56.errors = [{ instancePath: instancePath + "/dialect", schemaPath: "#/properties/dialect/const", keyword: "const", params: { allowedValue: "sqlite" }, message: "must be equal to constant" }];
                          return false;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.mode !== void 0 && func0.call(data, "mode")) {
                          let data7 = data.mode;
                          const _errs12 = errors;
                          if (typeof data7 !== "string") {
                            validate56.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                            return false;
                          }
                          if (!(data7 === "guided" || data7 === "practice" || data7 === "challenge")) {
                            validate56.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/enum", keyword: "enum", params: { allowedValues: schema18.properties.mode.enum }, message: "must be equal to one of the allowed values" }];
                            return false;
                          }
                          var valid0 = _errs12 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.title !== void 0 && func0.call(data, "title")) {
                            const _errs14 = errors;
                            if (!validate27(data.title, { instancePath: instancePath + "/title", parentData: data, parentDataProperty: "title", rootData })) {
                              vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs14 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.prerequisites !== void 0 && func0.call(data, "prerequisites")) {
                              let data9 = data.prerequisites;
                              const _errs15 = errors;
                              if (errors === _errs15) {
                                if (Array.isArray(data9)) {
                                  if (data9.length > 256) {
                                    validate56.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                    return false;
                                  } else {
                                    if (data9.length < 0) {
                                      validate56.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                                      return false;
                                    } else {
                                      var valid1 = true;
                                      const len0 = data9.length;
                                      for (let i0 = 0; i0 < len0; i0++) {
                                        const _errs17 = errors;
                                        if (!validate23(data9[i0], { instancePath: instancePath + "/prerequisites/" + i0, parentData: data9, parentDataProperty: i0, rootData })) {
                                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                          errors = vErrors.length;
                                        }
                                        var valid1 = _errs17 === errors;
                                        if (!valid1) {
                                          break;
                                        }
                                      }
                                      if (valid1) {
                                        let i1 = data9.length;
                                        let j0;
                                        if (i1 > 1) {
                                          outer0:
                                            for (; i1--; ) {
                                              for (j0 = i1; j0--; ) {
                                                if (func32(data9[i1], data9[j0])) {
                                                  validate56.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" }];
                                                  return false;
                                                  break outer0;
                                                }
                                              }
                                            }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  validate56.errors = [{ instancePath: instancePath + "/prerequisites", schemaPath: "#/properties/prerequisites/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                  return false;
                                }
                              }
                              var valid0 = _errs15 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.concepts !== void 0 && func0.call(data, "concepts")) {
                                let data11 = data.concepts;
                                const _errs18 = errors;
                                if (errors === _errs18) {
                                  if (Array.isArray(data11)) {
                                    if (data11.length > 256) {
                                      validate56.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                      return false;
                                    } else {
                                      if (data11.length < 0) {
                                        validate56.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                                        return false;
                                      } else {
                                        var valid3 = true;
                                        const len1 = data11.length;
                                        for (let i2 = 0; i2 < len1; i2++) {
                                          const _errs20 = errors;
                                          if (!validate23(data11[i2], { instancePath: instancePath + "/concepts/" + i2, parentData: data11, parentDataProperty: i2, rootData })) {
                                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                            errors = vErrors.length;
                                          }
                                          var valid3 = _errs20 === errors;
                                          if (!valid3) {
                                            break;
                                          }
                                        }
                                        if (valid3) {
                                          let i3 = data11.length;
                                          let j1;
                                          if (i3 > 1) {
                                            outer1:
                                              for (; i3--; ) {
                                                for (j1 = i3; j1--; ) {
                                                  if (func32(data11[i3], data11[j1])) {
                                                    validate56.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/uniqueItems", keyword: "uniqueItems", params: { i: i3, j: j1 }, message: "must NOT have duplicate items (items ## " + j1 + " and " + i3 + " are identical)" }];
                                                    return false;
                                                    break outer1;
                                                  }
                                                }
                                              }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    validate56.errors = [{ instancePath: instancePath + "/concepts", schemaPath: "#/properties/concepts/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                    return false;
                                  }
                                }
                                var valid0 = _errs18 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.introducedConcepts !== void 0 && func0.call(data, "introducedConcepts")) {
                                  let data13 = data.introducedConcepts;
                                  const _errs21 = errors;
                                  if (errors === _errs21) {
                                    if (Array.isArray(data13)) {
                                      if (data13.length > 256) {
                                        validate56.errors = [{ instancePath: instancePath + "/introducedConcepts", schemaPath: "#/properties/introducedConcepts/maxItems", keyword: "maxItems", params: { limit: 256 }, message: "must NOT have more than 256 items" }];
                                        return false;
                                      } else {
                                        if (data13.length < 0) {
                                          validate56.errors = [{ instancePath: instancePath + "/introducedConcepts", schemaPath: "#/properties/introducedConcepts/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                                          return false;
                                        } else {
                                          var valid5 = true;
                                          const len2 = data13.length;
                                          for (let i4 = 0; i4 < len2; i4++) {
                                            const _errs23 = errors;
                                            if (!validate23(data13[i4], { instancePath: instancePath + "/introducedConcepts/" + i4, parentData: data13, parentDataProperty: i4, rootData })) {
                                              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                              errors = vErrors.length;
                                            }
                                            var valid5 = _errs23 === errors;
                                            if (!valid5) {
                                              break;
                                            }
                                          }
                                          if (valid5) {
                                            let i5 = data13.length;
                                            let j2;
                                            if (i5 > 1) {
                                              outer2:
                                                for (; i5--; ) {
                                                  for (j2 = i5; j2--; ) {
                                                    if (func32(data13[i5], data13[j2])) {
                                                      validate56.errors = [{ instancePath: instancePath + "/introducedConcepts", schemaPath: "#/properties/introducedConcepts/uniqueItems", keyword: "uniqueItems", params: { i: i5, j: j2 }, message: "must NOT have duplicate items (items ## " + j2 + " and " + i5 + " are identical)" }];
                                                      return false;
                                                      break outer2;
                                                    }
                                                  }
                                                }
                                            }
                                          }
                                        }
                                      }
                                    } else {
                                      validate56.errors = [{ instancePath: instancePath + "/introducedConcepts", schemaPath: "#/properties/introducedConcepts/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                      return false;
                                    }
                                  }
                                  var valid0 = _errs21 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.objective !== void 0 && func0.call(data, "objective")) {
                                    const _errs24 = errors;
                                    if (!validate29(data.objective, { instancePath: instancePath + "/objective", parentData: data, parentDataProperty: "objective", rootData })) {
                                      vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                                      errors = vErrors.length;
                                    }
                                    var valid0 = _errs24 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.statement !== void 0 && func0.call(data, "statement")) {
                                      const _errs25 = errors;
                                      if (!validate29(data.statement, { instancePath: instancePath + "/statement", parentData: data, parentDataProperty: "statement", rootData })) {
                                        vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                                        errors = vErrors.length;
                                      }
                                      var valid0 = _errs25 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                    if (valid0) {
                                      if (data.knowledge !== void 0 && func0.call(data, "knowledge")) {
                                        let data17 = data.knowledge;
                                        const _errs26 = errors;
                                        if (errors === _errs26) {
                                          if (Array.isArray(data17)) {
                                            if (data17.length > 32) {
                                              validate56.errors = [{ instancePath: instancePath + "/knowledge", schemaPath: "#/properties/knowledge/maxItems", keyword: "maxItems", params: { limit: 32 }, message: "must NOT have more than 32 items" }];
                                              return false;
                                            } else {
                                              if (data17.length < 1) {
                                                validate56.errors = [{ instancePath: instancePath + "/knowledge", schemaPath: "#/properties/knowledge/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                                return false;
                                              } else {
                                                var valid7 = true;
                                                const len3 = data17.length;
                                                for (let i6 = 0; i6 < len3; i6++) {
                                                  const _errs28 = errors;
                                                  if (!validate29(data17[i6], { instancePath: instancePath + "/knowledge/" + i6, parentData: data17, parentDataProperty: i6, rootData })) {
                                                    vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                                                    errors = vErrors.length;
                                                  }
                                                  var valid7 = _errs28 === errors;
                                                  if (!valid7) {
                                                    break;
                                                  }
                                                }
                                              }
                                            }
                                          } else {
                                            validate56.errors = [{ instancePath: instancePath + "/knowledge", schemaPath: "#/properties/knowledge/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                            return false;
                                          }
                                        }
                                        var valid0 = _errs26 === errors;
                                      } else {
                                        var valid0 = true;
                                      }
                                      if (valid0) {
                                        if (data.readableTables !== void 0 && func0.call(data, "readableTables")) {
                                          let data19 = data.readableTables;
                                          const _errs29 = errors;
                                          if (errors === _errs29) {
                                            if (Array.isArray(data19)) {
                                              if (data19.length > 64) {
                                                validate56.errors = [{ instancePath: instancePath + "/readableTables", schemaPath: "#/properties/readableTables/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                                                return false;
                                              } else {
                                                if (data19.length < 1) {
                                                  validate56.errors = [{ instancePath: instancePath + "/readableTables", schemaPath: "#/properties/readableTables/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                                  return false;
                                                } else {
                                                  var valid8 = true;
                                                  const len4 = data19.length;
                                                  for (let i7 = 0; i7 < len4; i7++) {
                                                    const _errs31 = errors;
                                                    if (!validate69(data19[i7], { instancePath: instancePath + "/readableTables/" + i7, parentData: data19, parentDataProperty: i7, rootData })) {
                                                      vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
                                                      errors = vErrors.length;
                                                    }
                                                    var valid8 = _errs31 === errors;
                                                    if (!valid8) {
                                                      break;
                                                    }
                                                  }
                                                  if (valid8) {
                                                    let i8 = data19.length;
                                                    let j3;
                                                    if (i8 > 1) {
                                                      outer3:
                                                        for (; i8--; ) {
                                                          for (j3 = i8; j3--; ) {
                                                            if (func32(data19[i8], data19[j3])) {
                                                              validate56.errors = [{ instancePath: instancePath + "/readableTables", schemaPath: "#/properties/readableTables/uniqueItems", keyword: "uniqueItems", params: { i: i8, j: j3 }, message: "must NOT have duplicate items (items ## " + j3 + " and " + i8 + " are identical)" }];
                                                              return false;
                                                              break outer3;
                                                            }
                                                          }
                                                        }
                                                    }
                                                  }
                                                }
                                              }
                                            } else {
                                              validate56.errors = [{ instancePath: instancePath + "/readableTables", schemaPath: "#/properties/readableTables/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                              return false;
                                            }
                                          }
                                          var valid0 = _errs29 === errors;
                                        } else {
                                          var valid0 = true;
                                        }
                                        if (valid0) {
                                          if (data.previewFixtureId !== void 0 && func0.call(data, "previewFixtureId")) {
                                            const _errs32 = errors;
                                            if (!validate23(data.previewFixtureId, { instancePath: instancePath + "/previewFixtureId", parentData: data, parentDataProperty: "previewFixtureId", rootData })) {
                                              vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                              errors = vErrors.length;
                                            }
                                            var valid0 = _errs32 === errors;
                                          } else {
                                            var valid0 = true;
                                          }
                                          if (valid0) {
                                            if (data.duplicatePolicy !== void 0 && func0.call(data, "duplicatePolicy")) {
                                              let data22 = data.duplicatePolicy;
                                              const _errs33 = errors;
                                              if (typeof data22 !== "string") {
                                                validate56.errors = [{ instancePath: instancePath + "/duplicatePolicy", schemaPath: "#/properties/duplicatePolicy/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                return false;
                                              }
                                              if (!(data22 === "preserve" || data22 === "distinct")) {
                                                validate56.errors = [{ instancePath: instancePath + "/duplicatePolicy", schemaPath: "#/properties/duplicatePolicy/enum", keyword: "enum", params: { allowedValues: schema18.properties.duplicatePolicy.enum }, message: "must be equal to one of the allowed values" }];
                                                return false;
                                              }
                                              var valid0 = _errs33 === errors;
                                            } else {
                                              var valid0 = true;
                                            }
                                            if (valid0) {
                                              if (data.starterSql !== void 0 && func0.call(data, "starterSql")) {
                                                const _errs35 = errors;
                                                if (!validate72(data.starterSql, { instancePath: instancePath + "/starterSql", parentData: data, parentDataProperty: "starterSql", rootData })) {
                                                  vErrors = vErrors === null ? validate72.errors : vErrors.concat(validate72.errors);
                                                  errors = vErrors.length;
                                                }
                                                var valid0 = _errs35 === errors;
                                              } else {
                                                var valid0 = true;
                                              }
                                              if (valid0) {
                                                if (data.hints !== void 0 && func0.call(data, "hints")) {
                                                  const _errs36 = errors;
                                                  if (!validate74(data.hints, { instancePath: instancePath + "/hints", parentData: data, parentDataProperty: "hints", rootData })) {
                                                    vErrors = vErrors === null ? validate74.errors : vErrors.concat(validate74.errors);
                                                    errors = vErrors.length;
                                                  }
                                                  var valid0 = _errs36 === errors;
                                                } else {
                                                  var valid0 = true;
                                                }
                                                if (valid0) {
                                                  if (data.referenceSolutions !== void 0 && func0.call(data, "referenceSolutions")) {
                                                    let data25 = data.referenceSolutions;
                                                    const _errs37 = errors;
                                                    if (errors === _errs37) {
                                                      if (Array.isArray(data25)) {
                                                        if (data25.length > 16) {
                                                          validate56.errors = [{ instancePath: instancePath + "/referenceSolutions", schemaPath: "#/properties/referenceSolutions/maxItems", keyword: "maxItems", params: { limit: 16 }, message: "must NOT have more than 16 items" }];
                                                          return false;
                                                        } else {
                                                          if (data25.length < 1) {
                                                            validate56.errors = [{ instancePath: instancePath + "/referenceSolutions", schemaPath: "#/properties/referenceSolutions/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                                            return false;
                                                          } else {
                                                            var valid10 = true;
                                                            const len5 = data25.length;
                                                            for (let i9 = 0; i9 < len5; i9++) {
                                                              const _errs39 = errors;
                                                              if (!validate85(data25[i9], { instancePath: instancePath + "/referenceSolutions/" + i9, parentData: data25, parentDataProperty: i9, rootData })) {
                                                                vErrors = vErrors === null ? validate85.errors : vErrors.concat(validate85.errors);
                                                                errors = vErrors.length;
                                                              }
                                                              var valid10 = _errs39 === errors;
                                                              if (!valid10) {
                                                                break;
                                                              }
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        validate56.errors = [{ instancePath: instancePath + "/referenceSolutions", schemaPath: "#/properties/referenceSolutions/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                        return false;
                                                      }
                                                    }
                                                    var valid0 = _errs37 === errors;
                                                  } else {
                                                    var valid0 = true;
                                                  }
                                                  if (valid0) {
                                                    if (data.comparison !== void 0 && func0.call(data, "comparison")) {
                                                      const _errs40 = errors;
                                                      if (!validate90(data.comparison, { instancePath: instancePath + "/comparison", parentData: data, parentDataProperty: "comparison", rootData })) {
                                                        vErrors = vErrors === null ? validate90.errors : vErrors.concat(validate90.errors);
                                                        errors = vErrors.length;
                                                      }
                                                      var valid0 = _errs40 === errors;
                                                    } else {
                                                      var valid0 = true;
                                                    }
                                                    if (valid0) {
                                                      if (data.tests !== void 0 && func0.call(data, "tests")) {
                                                        let data28 = data.tests;
                                                        const _errs41 = errors;
                                                        if (errors === _errs41) {
                                                          if (Array.isArray(data28)) {
                                                            if (data28.length > 100) {
                                                              validate56.errors = [{ instancePath: instancePath + "/tests", schemaPath: "#/properties/tests/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                                                              return false;
                                                            } else {
                                                              if (data28.length < 1) {
                                                                validate56.errors = [{ instancePath: instancePath + "/tests", schemaPath: "#/properties/tests/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                                                return false;
                                                              } else {
                                                                var valid11 = true;
                                                                const len6 = data28.length;
                                                                for (let i10 = 0; i10 < len6; i10++) {
                                                                  const _errs43 = errors;
                                                                  if (!validate98(data28[i10], { instancePath: instancePath + "/tests/" + i10, parentData: data28, parentDataProperty: i10, rootData })) {
                                                                    vErrors = vErrors === null ? validate98.errors : vErrors.concat(validate98.errors);
                                                                    errors = vErrors.length;
                                                                  }
                                                                  var valid11 = _errs43 === errors;
                                                                  if (!valid11) {
                                                                    break;
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          } else {
                                                            validate56.errors = [{ instancePath: instancePath + "/tests", schemaPath: "#/properties/tests/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                            return false;
                                                          }
                                                        }
                                                        var valid0 = _errs41 === errors;
                                                      } else {
                                                        var valid0 = true;
                                                      }
                                                      if (valid0) {
                                                        if (data.expectedFailures !== void 0 && func0.call(data, "expectedFailures")) {
                                                          let data30 = data.expectedFailures;
                                                          const _errs44 = errors;
                                                          if (errors === _errs44) {
                                                            if (Array.isArray(data30)) {
                                                              if (data30.length > 100) {
                                                                validate56.errors = [{ instancePath: instancePath + "/expectedFailures", schemaPath: "#/properties/expectedFailures/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                                                                return false;
                                                              } else {
                                                                if (data30.length < 1) {
                                                                  validate56.errors = [{ instancePath: instancePath + "/expectedFailures", schemaPath: "#/properties/expectedFailures/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                                                  return false;
                                                                } else {
                                                                  var valid12 = true;
                                                                  const len7 = data30.length;
                                                                  for (let i11 = 0; i11 < len7; i11++) {
                                                                    const _errs46 = errors;
                                                                    if (!validate110(data30[i11], { instancePath: instancePath + "/expectedFailures/" + i11, parentData: data30, parentDataProperty: i11, rootData })) {
                                                                      vErrors = vErrors === null ? validate110.errors : vErrors.concat(validate110.errors);
                                                                      errors = vErrors.length;
                                                                    }
                                                                    var valid12 = _errs46 === errors;
                                                                    if (!valid12) {
                                                                      break;
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            } else {
                                                              validate56.errors = [{ instancePath: instancePath + "/expectedFailures", schemaPath: "#/properties/expectedFailures/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                              return false;
                                                            }
                                                          }
                                                          var valid0 = _errs44 === errors;
                                                        } else {
                                                          var valid0 = true;
                                                        }
                                                        if (valid0) {
                                                          if (data.flowchart !== void 0 && func0.call(data, "flowchart")) {
                                                            const _errs47 = errors;
                                                            if (!validate114(data.flowchart, { instancePath: instancePath + "/flowchart", parentData: data, parentDataProperty: "flowchart", rootData })) {
                                                              vErrors = vErrors === null ? validate114.errors : vErrors.concat(validate114.errors);
                                                              errors = vErrors.length;
                                                            }
                                                            var valid0 = _errs47 === errors;
                                                          } else {
                                                            var valid0 = true;
                                                          }
                                                          if (valid0) {
                                                            if (data.sqlPuzzle !== void 0 && func0.call(data, "sqlPuzzle")) {
                                                              const _errs48 = errors;
                                                              if (!validate128(data.sqlPuzzle, { instancePath: instancePath + "/sqlPuzzle", parentData: data, parentDataProperty: "sqlPuzzle", rootData })) {
                                                                vErrors = vErrors === null ? validate128.errors : vErrors.concat(validate128.errors);
                                                                errors = vErrors.length;
                                                              }
                                                              var valid0 = _errs48 === errors;
                                                            } else {
                                                              var valid0 = true;
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate56.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate56.errors = vErrors;
  return errors === 0;
}
function validate135(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.id === void 0 || !func0.call(data, "id")) && (missing0 = "id") || (data.tables === void 0 || !func0.call(data, "tables")) && (missing0 = "tables")) {
        validate135.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "schemaVersion" || key0 === "id" || key0 === "tables" || key0 === "indexes")) {
            validate135.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
            let data0 = data.schemaVersion;
            const _errs3 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)) && isFinite(data0))) {
              validate135.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (1 !== data0) {
              validate135.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.id !== void 0 && func0.call(data, "id")) {
              const _errs5 = errors;
              if (!validate23(data.id, { instancePath: instancePath + "/id", parentData: data, parentDataProperty: "id", rootData })) {
                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.tables !== void 0 && func0.call(data, "tables")) {
                let data2 = data.tables;
                const _errs6 = errors;
                if (errors === _errs6) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 64) {
                      validate135.errors = [{ instancePath: instancePath + "/tables", schemaPath: "#/properties/tables/maxItems", keyword: "maxItems", params: { limit: 64 }, message: "must NOT have more than 64 items" }];
                      return false;
                    } else {
                      if (data2.length < 1) {
                        validate135.errors = [{ instancePath: instancePath + "/tables", schemaPath: "#/properties/tables/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                        return false;
                      } else {
                        var valid1 = true;
                        const len0 = data2.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          const _errs8 = errors;
                          if (!validate137(data2[i0], { instancePath: instancePath + "/tables/" + i0, parentData: data2, parentDataProperty: i0, rootData })) {
                            vErrors = vErrors === null ? validate137.errors : vErrors.concat(validate137.errors);
                            errors = vErrors.length;
                          }
                          var valid1 = _errs8 === errors;
                          if (!valid1) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate135.errors = [{ instancePath: instancePath + "/tables", schemaPath: "#/properties/tables/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.indexes !== void 0 && func0.call(data, "indexes")) {
                  let data4 = data.indexes;
                  const _errs9 = errors;
                  if (errors === _errs9) {
                    if (Array.isArray(data4)) {
                      if (data4.length > 128) {
                        validate135.errors = [{ instancePath: instancePath + "/indexes", schemaPath: "#/properties/indexes/maxItems", keyword: "maxItems", params: { limit: 128 }, message: "must NOT have more than 128 items" }];
                        return false;
                      } else {
                        if (data4.length < 0) {
                          validate135.errors = [{ instancePath: instancePath + "/indexes", schemaPath: "#/properties/indexes/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                          return false;
                        } else {
                          var valid2 = true;
                          const len1 = data4.length;
                          for (let i1 = 0; i1 < len1; i1++) {
                            const _errs11 = errors;
                            if (!validate165(data4[i1], { instancePath: instancePath + "/indexes/" + i1, parentData: data4, parentDataProperty: i1, rootData })) {
                              vErrors = vErrors === null ? validate165.errors : vErrors.concat(validate165.errors);
                              errors = vErrors.length;
                            }
                            var valid2 = _errs11 === errors;
                            if (!valid2) {
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      validate135.errors = [{ instancePath: instancePath + "/indexes", schemaPath: "#/properties/indexes/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                      return false;
                    }
                  }
                  var valid0 = _errs9 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate135.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate135.errors = vErrors;
  return errors === 0;
}
function validate443(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.mode === void 0 || !func0.call(data, "mode")) && (missing0 = "mode") || (data.inputMode === void 0 || !func0.call(data, "inputMode")) && (missing0 = "inputMode") || (data.sql === void 0 || !func0.call(data, "sql")) && (missing0 = "sql") || (data.lesson === void 0 || !func0.call(data, "lesson")) && (missing0 = "lesson") || (data.fixtures === void 0 || !func0.call(data, "fixtures")) && (missing0 = "fixtures")) {
        validate443.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema55.properties, key0)) {
            validate443.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs3 = errors;
            if (typeof data0 !== "string") {
              validate443.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("prepare" !== data0) {
              validate443.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "prepare" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs5 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate443.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate443.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs7 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs7 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs8 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs8 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs9 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs9 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs10 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs10 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs11 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs11 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs12 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs12 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs13 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs13 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.mode !== void 0 && func0.call(data, "mode")) {
                              const _errs14 = errors;
                              if (!validate184(data.mode, { instancePath: instancePath + "/mode", parentData: data, parentDataProperty: "mode", rootData })) {
                                vErrors = vErrors === null ? validate184.errors : vErrors.concat(validate184.errors);
                                errors = vErrors.length;
                              }
                              var valid0 = _errs14 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.inputMode !== void 0 && func0.call(data, "inputMode")) {
                                const _errs15 = errors;
                                if (!validate186(data.inputMode, { instancePath: instancePath + "/inputMode", parentData: data, parentDataProperty: "inputMode", rootData })) {
                                  vErrors = vErrors === null ? validate186.errors : vErrors.concat(validate186.errors);
                                  errors = vErrors.length;
                                }
                                var valid0 = _errs15 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.sql !== void 0 && func0.call(data, "sql")) {
                                  const _errs16 = errors;
                                  if (!validate86(data.sql, { instancePath: instancePath + "/sql", parentData: data, parentDataProperty: "sql", rootData })) {
                                    vErrors = vErrors === null ? validate86.errors : vErrors.concat(validate86.errors);
                                    errors = vErrors.length;
                                  }
                                  var valid0 = _errs16 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.lesson !== void 0 && func0.call(data, "lesson")) {
                                    const _errs17 = errors;
                                    if (!validate56(data.lesson, { instancePath: instancePath + "/lesson", parentData: data, parentDataProperty: "lesson", rootData })) {
                                      vErrors = vErrors === null ? validate56.errors : vErrors.concat(validate56.errors);
                                      errors = vErrors.length;
                                    }
                                    var valid0 = _errs17 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.fixtures !== void 0 && func0.call(data, "fixtures")) {
                                      let data13 = data.fixtures;
                                      const _errs18 = errors;
                                      if (errors === _errs18) {
                                        if (Array.isArray(data13)) {
                                          if (data13.length > 100) {
                                            validate443.errors = [{ instancePath: instancePath + "/fixtures", schemaPath: "#/properties/fixtures/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                                            return false;
                                          } else {
                                            if (data13.length < 1) {
                                              validate443.errors = [{ instancePath: instancePath + "/fixtures", schemaPath: "#/properties/fixtures/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                              return false;
                                            } else {
                                              var valid1 = true;
                                              const len0 = data13.length;
                                              for (let i0 = 0; i0 < len0; i0++) {
                                                const _errs20 = errors;
                                                if (!validate135(data13[i0], { instancePath: instancePath + "/fixtures/" + i0, parentData: data13, parentDataProperty: i0, rootData })) {
                                                  vErrors = vErrors === null ? validate135.errors : vErrors.concat(validate135.errors);
                                                  errors = vErrors.length;
                                                }
                                                var valid1 = _errs20 === errors;
                                                if (!valid1) {
                                                  break;
                                                }
                                              }
                                            }
                                          }
                                        } else {
                                          validate443.errors = [{ instancePath: instancePath + "/fixtures", schemaPath: "#/properties/fixtures/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                          return false;
                                        }
                                      }
                                      var valid0 = _errs18 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate443.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate443.errors = vErrors;
  return errors === 0;
}
var validateReadyResponseStructure = validate456;
var schema61 = { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "ready", "type": "string" }, "schemaVersion": { "type": "integer", "const": 1 }, "requestId": { "$ref": "#/definitions/Token" }, "contentToken": { "$ref": "#/definitions/Token" }, "rootRevision": { "$ref": "#/definitions/Revision" }, "courseId": { "$ref": "#/definitions/ContentId" }, "themeId": { "$ref": "#/definitions/ContentId" }, "lessonId": { "$ref": "#/definitions/ContentId" }, "lessonRevision": { "$ref": "#/definitions/Revision" } }, "required": ["type", "schemaVersion", "requestId", "contentToken", "rootRevision", "courseId", "themeId", "lessonId", "lessonRevision"] };
function validate456(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision")) {
        validate456.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema61.properties, key0)) {
            validate456.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate456.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("ready" !== data0) {
              validate456.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "ready" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate456.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate456.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate456.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate456.errors = vErrors;
  return errors === 0;
}
var validateRunCaseRequestStructure = validate464;
var schema59 = { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "run-case", "type": "string" }, "schemaVersion": { "type": "integer", "const": 1 }, "requestId": { "$ref": "#/definitions/Token" }, "contentToken": { "$ref": "#/definitions/Token" }, "rootRevision": { "$ref": "#/definitions/Revision" }, "courseId": { "$ref": "#/definitions/ContentId" }, "themeId": { "$ref": "#/definitions/ContentId" }, "lessonId": { "$ref": "#/definitions/ContentId" }, "lessonRevision": { "$ref": "#/definitions/Revision" }, "caseId": { "$ref": "#/definitions/ContentId" }, "caseIndex": { "type": "integer", "minimum": 0, "maximum": 99 } }, "required": ["type", "schemaVersion", "requestId", "contentToken", "rootRevision", "courseId", "themeId", "lessonId", "lessonRevision", "caseId", "caseIndex"] };
function validate464(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.caseId === void 0 || !func0.call(data, "caseId")) && (missing0 = "caseId") || (data.caseIndex === void 0 || !func0.call(data, "caseIndex")) && (missing0 = "caseIndex")) {
        validate464.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema59.properties, key0)) {
            validate464.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate464.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("run-case" !== data0) {
              validate464.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "run-case" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate464.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate464.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.caseId !== void 0 && func0.call(data, "caseId")) {
                              const _errs13 = errors;
                              if (!validate23(data.caseId, { instancePath: instancePath + "/caseId", parentData: data, parentDataProperty: "caseId", rootData })) {
                                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                errors = vErrors.length;
                              }
                              var valid0 = _errs13 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.caseIndex !== void 0 && func0.call(data, "caseIndex")) {
                                let data10 = data.caseIndex;
                                const _errs14 = errors;
                                if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)) && isFinite(data10))) {
                                  validate464.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                  return false;
                                }
                                if (errors === _errs14) {
                                  if (typeof data10 == "number" && isFinite(data10)) {
                                    if (data10 > 99 || isNaN(data10)) {
                                      validate464.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/maximum", keyword: "maximum", params: { comparison: "<=", limit: 99 }, message: "must be <= 99" }];
                                      return false;
                                    } else {
                                      if (data10 < 0 || isNaN(data10)) {
                                        validate464.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                        return false;
                                      }
                                    }
                                  }
                                }
                                var valid0 = _errs14 === errors;
                              } else {
                                var valid0 = true;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate464.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate464.errors = vErrors;
  return errors === 0;
}
var validateRunCaseResultStructure = validate473;
var schema62 = { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "case-result", "type": "string" }, "schemaVersion": { "type": "integer", "const": 1 }, "requestId": { "$ref": "#/definitions/Token" }, "contentToken": { "$ref": "#/definitions/Token" }, "rootRevision": { "$ref": "#/definitions/Revision" }, "courseId": { "$ref": "#/definitions/ContentId" }, "themeId": { "$ref": "#/definitions/ContentId" }, "lessonId": { "$ref": "#/definitions/ContentId" }, "lessonRevision": { "$ref": "#/definitions/Revision" }, "caseId": { "$ref": "#/definitions/ContentId" }, "caseIndex": { "type": "integer", "minimum": 0, "maximum": 99 }, "mode": { "const": "run", "type": "string" }, "outcome": { "const": "executed", "type": "string" }, "result": { "$ref": "#/definitions/QueryResult" } }, "required": ["type", "schemaVersion", "requestId", "contentToken", "rootRevision", "courseId", "themeId", "lessonId", "lessonRevision", "caseId", "caseIndex", "mode", "outcome", "result"] };
function validate473(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.caseId === void 0 || !func0.call(data, "caseId")) && (missing0 = "caseId") || (data.caseIndex === void 0 || !func0.call(data, "caseIndex")) && (missing0 = "caseIndex") || (data.mode === void 0 || !func0.call(data, "mode")) && (missing0 = "mode") || (data.outcome === void 0 || !func0.call(data, "outcome")) && (missing0 = "outcome") || (data.result === void 0 || !func0.call(data, "result")) && (missing0 = "result")) {
        validate473.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema62.properties, key0)) {
            validate473.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate473.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("case-result" !== data0) {
              validate473.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "case-result" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate473.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate473.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.caseId !== void 0 && func0.call(data, "caseId")) {
                              const _errs13 = errors;
                              if (!validate23(data.caseId, { instancePath: instancePath + "/caseId", parentData: data, parentDataProperty: "caseId", rootData })) {
                                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                errors = vErrors.length;
                              }
                              var valid0 = _errs13 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.caseIndex !== void 0 && func0.call(data, "caseIndex")) {
                                let data10 = data.caseIndex;
                                const _errs14 = errors;
                                if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)) && isFinite(data10))) {
                                  validate473.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                  return false;
                                }
                                if (errors === _errs14) {
                                  if (typeof data10 == "number" && isFinite(data10)) {
                                    if (data10 > 99 || isNaN(data10)) {
                                      validate473.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/maximum", keyword: "maximum", params: { comparison: "<=", limit: 99 }, message: "must be <= 99" }];
                                      return false;
                                    } else {
                                      if (data10 < 0 || isNaN(data10)) {
                                        validate473.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                        return false;
                                      }
                                    }
                                  }
                                }
                                var valid0 = _errs14 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.mode !== void 0 && func0.call(data, "mode")) {
                                  let data11 = data.mode;
                                  const _errs16 = errors;
                                  if (typeof data11 !== "string") {
                                    validate473.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  if ("run" !== data11) {
                                    validate473.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/const", keyword: "const", params: { allowedValue: "run" }, message: "must be equal to constant" }];
                                    return false;
                                  }
                                  var valid0 = _errs16 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.outcome !== void 0 && func0.call(data, "outcome")) {
                                    let data12 = data.outcome;
                                    const _errs18 = errors;
                                    if (typeof data12 !== "string") {
                                      validate473.errors = [{ instancePath: instancePath + "/outcome", schemaPath: "#/properties/outcome/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    if ("executed" !== data12) {
                                      validate473.errors = [{ instancePath: instancePath + "/outcome", schemaPath: "#/properties/outcome/const", keyword: "const", params: { allowedValue: "executed" }, message: "must be equal to constant" }];
                                      return false;
                                    }
                                    var valid0 = _errs18 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.result !== void 0 && func0.call(data, "result")) {
                                      const _errs20 = errors;
                                      if (!validate101(data.result, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                                        vErrors = vErrors === null ? validate101.errors : vErrors.concat(validate101.errors);
                                        errors = vErrors.length;
                                      }
                                      var valid0 = _errs20 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate473.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate473.errors = vErrors;
  return errors === 0;
}
var validateSubmitCaseResultStructure = validate483;
var schema63 = { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "case-result", "type": "string" }, "schemaVersion": { "type": "integer", "const": 1 }, "requestId": { "$ref": "#/definitions/Token" }, "contentToken": { "$ref": "#/definitions/Token" }, "rootRevision": { "$ref": "#/definitions/Revision" }, "courseId": { "$ref": "#/definitions/ContentId" }, "themeId": { "$ref": "#/definitions/ContentId" }, "lessonId": { "$ref": "#/definitions/ContentId" }, "lessonRevision": { "$ref": "#/definitions/Revision" }, "caseId": { "$ref": "#/definitions/ContentId" }, "caseIndex": { "type": "integer", "minimum": 0, "maximum": 99 }, "mode": { "const": "submit", "type": "string" }, "outcome": { "type": "string", "enum": ["passed", "mismatch"] }, "result": { "$ref": "#/definitions/QueryResult" } }, "required": ["type", "schemaVersion", "requestId", "contentToken", "rootRevision", "courseId", "themeId", "lessonId", "lessonRevision", "caseId", "caseIndex", "mode", "outcome", "result"] };
function validate483(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.caseId === void 0 || !func0.call(data, "caseId")) && (missing0 = "caseId") || (data.caseIndex === void 0 || !func0.call(data, "caseIndex")) && (missing0 = "caseIndex") || (data.mode === void 0 || !func0.call(data, "mode")) && (missing0 = "mode") || (data.outcome === void 0 || !func0.call(data, "outcome")) && (missing0 = "outcome") || (data.result === void 0 || !func0.call(data, "result")) && (missing0 = "result")) {
        validate483.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema63.properties, key0)) {
            validate483.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate483.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("case-result" !== data0) {
              validate483.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "case-result" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate483.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate483.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.caseId !== void 0 && func0.call(data, "caseId")) {
                              const _errs13 = errors;
                              if (!validate23(data.caseId, { instancePath: instancePath + "/caseId", parentData: data, parentDataProperty: "caseId", rootData })) {
                                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                errors = vErrors.length;
                              }
                              var valid0 = _errs13 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.caseIndex !== void 0 && func0.call(data, "caseIndex")) {
                                let data10 = data.caseIndex;
                                const _errs14 = errors;
                                if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)) && isFinite(data10))) {
                                  validate483.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                  return false;
                                }
                                if (errors === _errs14) {
                                  if (typeof data10 == "number" && isFinite(data10)) {
                                    if (data10 > 99 || isNaN(data10)) {
                                      validate483.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/maximum", keyword: "maximum", params: { comparison: "<=", limit: 99 }, message: "must be <= 99" }];
                                      return false;
                                    } else {
                                      if (data10 < 0 || isNaN(data10)) {
                                        validate483.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                        return false;
                                      }
                                    }
                                  }
                                }
                                var valid0 = _errs14 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.mode !== void 0 && func0.call(data, "mode")) {
                                  let data11 = data.mode;
                                  const _errs16 = errors;
                                  if (typeof data11 !== "string") {
                                    validate483.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  if ("submit" !== data11) {
                                    validate483.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/const", keyword: "const", params: { allowedValue: "submit" }, message: "must be equal to constant" }];
                                    return false;
                                  }
                                  var valid0 = _errs16 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.outcome !== void 0 && func0.call(data, "outcome")) {
                                    let data12 = data.outcome;
                                    const _errs18 = errors;
                                    if (typeof data12 !== "string") {
                                      validate483.errors = [{ instancePath: instancePath + "/outcome", schemaPath: "#/properties/outcome/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    if (!(data12 === "passed" || data12 === "mismatch")) {
                                      validate483.errors = [{ instancePath: instancePath + "/outcome", schemaPath: "#/properties/outcome/enum", keyword: "enum", params: { allowedValues: schema63.properties.outcome.enum }, message: "must be equal to one of the allowed values" }];
                                      return false;
                                    }
                                    var valid0 = _errs18 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.result !== void 0 && func0.call(data, "result")) {
                                      const _errs20 = errors;
                                      if (!validate101(data.result, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                                        vErrors = vErrors === null ? validate101.errors : vErrors.concat(validate101.errors);
                                        errors = vErrors.length;
                                      }
                                      var valid0 = _errs20 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate483.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate483.errors = vErrors;
  return errors === 0;
}
var validateWorkerErrorCodeStructure = validate493;
var schema65 = { "type": "string", "enum": ["invalid-request", "protocol", "engine-load", "sql", "forbidden", "limit", "comparison", "internal"] };
function validate493(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (typeof data !== "string") {
    validate493.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
    return false;
  }
  if (!(data === "invalid-request" || data === "protocol" || data === "engine-load" || data === "sql" || data === "forbidden" || data === "limit" || data === "comparison" || data === "internal")) {
    validate493.errors = [{ instancePath, schemaPath: "#/enum", keyword: "enum", params: { allowedValues: schema65.enum }, message: "must be equal to one of the allowed values" }];
    return false;
  }
  validate493.errors = vErrors;
  return errors === 0;
}
var validatePrepareErrorStructure = validate494;
var schema64 = { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "error", "type": "string" }, "schemaVersion": { "type": "integer", "const": 1 }, "requestId": { "$ref": "#/definitions/Token" }, "contentToken": { "$ref": "#/definitions/Token" }, "rootRevision": { "$ref": "#/definitions/Revision" }, "courseId": { "$ref": "#/definitions/ContentId" }, "themeId": { "$ref": "#/definitions/ContentId" }, "lessonId": { "$ref": "#/definitions/ContentId" }, "lessonRevision": { "$ref": "#/definitions/Revision" }, "phase": { "const": "prepare", "type": "string" }, "code": { "$ref": "#/definitions/WorkerErrorCode" }, "message": { "$ref": "#/definitions/Description" } }, "required": ["type", "schemaVersion", "requestId", "contentToken", "rootRevision", "courseId", "themeId", "lessonId", "lessonRevision", "phase", "code", "message"] };
function validate243(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (typeof data !== "string") {
    validate243.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
    return false;
  }
  if (!(data === "invalid-request" || data === "protocol" || data === "engine-load" || data === "sql" || data === "forbidden" || data === "limit" || data === "comparison" || data === "internal")) {
    validate243.errors = [{ instancePath, schemaPath: "#/enum", keyword: "enum", params: { allowedValues: schema65.enum }, message: "must be equal to one of the allowed values" }];
    return false;
  }
  validate243.errors = vErrors;
  return errors === 0;
}
function validate494(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.phase === void 0 || !func0.call(data, "phase")) && (missing0 = "phase") || (data.code === void 0 || !func0.call(data, "code")) && (missing0 = "code") || (data.message === void 0 || !func0.call(data, "message")) && (missing0 = "message")) {
        validate494.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema64.properties, key0)) {
            validate494.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate494.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("error" !== data0) {
              validate494.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "error" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate494.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate494.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.phase !== void 0 && func0.call(data, "phase")) {
                              let data9 = data.phase;
                              const _errs13 = errors;
                              if (typeof data9 !== "string") {
                                validate494.errors = [{ instancePath: instancePath + "/phase", schemaPath: "#/properties/phase/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                              if ("prepare" !== data9) {
                                validate494.errors = [{ instancePath: instancePath + "/phase", schemaPath: "#/properties/phase/const", keyword: "const", params: { allowedValue: "prepare" }, message: "must be equal to constant" }];
                                return false;
                              }
                              var valid0 = _errs13 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.code !== void 0 && func0.call(data, "code")) {
                                const _errs15 = errors;
                                if (!validate243(data.code, { instancePath: instancePath + "/code", parentData: data, parentDataProperty: "code", rootData })) {
                                  vErrors = vErrors === null ? validate243.errors : vErrors.concat(validate243.errors);
                                  errors = vErrors.length;
                                }
                                var valid0 = _errs15 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.message !== void 0 && func0.call(data, "message")) {
                                  const _errs16 = errors;
                                  if (!validate119(data.message, { instancePath: instancePath + "/message", parentData: data, parentDataProperty: "message", rootData })) {
                                    vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                                    errors = vErrors.length;
                                  }
                                  var valid0 = _errs16 === errors;
                                } else {
                                  var valid0 = true;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate494.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate494.errors = vErrors;
  return errors === 0;
}
var validateCaseErrorStructure = validate504;
var schema66 = { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "error", "type": "string" }, "schemaVersion": { "type": "integer", "const": 1 }, "requestId": { "$ref": "#/definitions/Token" }, "contentToken": { "$ref": "#/definitions/Token" }, "rootRevision": { "$ref": "#/definitions/Revision" }, "courseId": { "$ref": "#/definitions/ContentId" }, "themeId": { "$ref": "#/definitions/ContentId" }, "lessonId": { "$ref": "#/definitions/ContentId" }, "lessonRevision": { "$ref": "#/definitions/Revision" }, "caseId": { "$ref": "#/definitions/ContentId" }, "caseIndex": { "type": "integer", "minimum": 0, "maximum": 99 }, "phase": { "const": "case", "type": "string" }, "code": { "$ref": "#/definitions/WorkerErrorCode" }, "message": { "$ref": "#/definitions/Description" } }, "required": ["type", "schemaVersion", "requestId", "contentToken", "rootRevision", "courseId", "themeId", "lessonId", "lessonRevision", "caseId", "caseIndex", "phase", "code", "message"] };
function validate504(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.caseId === void 0 || !func0.call(data, "caseId")) && (missing0 = "caseId") || (data.caseIndex === void 0 || !func0.call(data, "caseIndex")) && (missing0 = "caseIndex") || (data.phase === void 0 || !func0.call(data, "phase")) && (missing0 = "phase") || (data.code === void 0 || !func0.call(data, "code")) && (missing0 = "code") || (data.message === void 0 || !func0.call(data, "message")) && (missing0 = "message")) {
        validate504.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema66.properties, key0)) {
            validate504.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate504.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("error" !== data0) {
              validate504.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "error" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate504.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate504.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.caseId !== void 0 && func0.call(data, "caseId")) {
                              const _errs13 = errors;
                              if (!validate23(data.caseId, { instancePath: instancePath + "/caseId", parentData: data, parentDataProperty: "caseId", rootData })) {
                                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                errors = vErrors.length;
                              }
                              var valid0 = _errs13 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.caseIndex !== void 0 && func0.call(data, "caseIndex")) {
                                let data10 = data.caseIndex;
                                const _errs14 = errors;
                                if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)) && isFinite(data10))) {
                                  validate504.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                  return false;
                                }
                                if (errors === _errs14) {
                                  if (typeof data10 == "number" && isFinite(data10)) {
                                    if (data10 > 99 || isNaN(data10)) {
                                      validate504.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/maximum", keyword: "maximum", params: { comparison: "<=", limit: 99 }, message: "must be <= 99" }];
                                      return false;
                                    } else {
                                      if (data10 < 0 || isNaN(data10)) {
                                        validate504.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                        return false;
                                      }
                                    }
                                  }
                                }
                                var valid0 = _errs14 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.phase !== void 0 && func0.call(data, "phase")) {
                                  let data11 = data.phase;
                                  const _errs16 = errors;
                                  if (typeof data11 !== "string") {
                                    validate504.errors = [{ instancePath: instancePath + "/phase", schemaPath: "#/properties/phase/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  if ("case" !== data11) {
                                    validate504.errors = [{ instancePath: instancePath + "/phase", schemaPath: "#/properties/phase/const", keyword: "const", params: { allowedValue: "case" }, message: "must be equal to constant" }];
                                    return false;
                                  }
                                  var valid0 = _errs16 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.code !== void 0 && func0.call(data, "code")) {
                                    const _errs18 = errors;
                                    if (!validate243(data.code, { instancePath: instancePath + "/code", parentData: data, parentDataProperty: "code", rootData })) {
                                      vErrors = vErrors === null ? validate243.errors : vErrors.concat(validate243.errors);
                                      errors = vErrors.length;
                                    }
                                    var valid0 = _errs18 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.message !== void 0 && func0.call(data, "message")) {
                                      const _errs19 = errors;
                                      if (!validate119(data.message, { instancePath: instancePath + "/message", parentData: data, parentDataProperty: "message", rootData })) {
                                        vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                                        errors = vErrors.length;
                                      }
                                      var valid0 = _errs19 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate504.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate504.errors = vErrors;
  return errors === 0;
}
var validateWorkerRequestStructure = validate515;
function validate175(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.mode === void 0 || !func0.call(data, "mode")) && (missing0 = "mode") || (data.inputMode === void 0 || !func0.call(data, "inputMode")) && (missing0 = "inputMode") || (data.sql === void 0 || !func0.call(data, "sql")) && (missing0 = "sql") || (data.lesson === void 0 || !func0.call(data, "lesson")) && (missing0 = "lesson") || (data.fixtures === void 0 || !func0.call(data, "fixtures")) && (missing0 = "fixtures")) {
        validate175.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema55.properties, key0)) {
            validate175.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs3 = errors;
            if (typeof data0 !== "string") {
              validate175.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("prepare" !== data0) {
              validate175.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "prepare" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs5 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate175.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate175.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs7 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs7 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs8 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs8 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs9 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs9 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs10 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs10 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs11 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs11 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs12 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs12 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs13 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs13 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.mode !== void 0 && func0.call(data, "mode")) {
                              const _errs14 = errors;
                              if (!validate184(data.mode, { instancePath: instancePath + "/mode", parentData: data, parentDataProperty: "mode", rootData })) {
                                vErrors = vErrors === null ? validate184.errors : vErrors.concat(validate184.errors);
                                errors = vErrors.length;
                              }
                              var valid0 = _errs14 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.inputMode !== void 0 && func0.call(data, "inputMode")) {
                                const _errs15 = errors;
                                if (!validate186(data.inputMode, { instancePath: instancePath + "/inputMode", parentData: data, parentDataProperty: "inputMode", rootData })) {
                                  vErrors = vErrors === null ? validate186.errors : vErrors.concat(validate186.errors);
                                  errors = vErrors.length;
                                }
                                var valid0 = _errs15 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.sql !== void 0 && func0.call(data, "sql")) {
                                  const _errs16 = errors;
                                  if (!validate86(data.sql, { instancePath: instancePath + "/sql", parentData: data, parentDataProperty: "sql", rootData })) {
                                    vErrors = vErrors === null ? validate86.errors : vErrors.concat(validate86.errors);
                                    errors = vErrors.length;
                                  }
                                  var valid0 = _errs16 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.lesson !== void 0 && func0.call(data, "lesson")) {
                                    const _errs17 = errors;
                                    if (!validate56(data.lesson, { instancePath: instancePath + "/lesson", parentData: data, parentDataProperty: "lesson", rootData })) {
                                      vErrors = vErrors === null ? validate56.errors : vErrors.concat(validate56.errors);
                                      errors = vErrors.length;
                                    }
                                    var valid0 = _errs17 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.fixtures !== void 0 && func0.call(data, "fixtures")) {
                                      let data13 = data.fixtures;
                                      const _errs18 = errors;
                                      if (errors === _errs18) {
                                        if (Array.isArray(data13)) {
                                          if (data13.length > 100) {
                                            validate175.errors = [{ instancePath: instancePath + "/fixtures", schemaPath: "#/properties/fixtures/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                                            return false;
                                          } else {
                                            if (data13.length < 1) {
                                              validate175.errors = [{ instancePath: instancePath + "/fixtures", schemaPath: "#/properties/fixtures/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" }];
                                              return false;
                                            } else {
                                              var valid1 = true;
                                              const len0 = data13.length;
                                              for (let i0 = 0; i0 < len0; i0++) {
                                                const _errs20 = errors;
                                                if (!validate135(data13[i0], { instancePath: instancePath + "/fixtures/" + i0, parentData: data13, parentDataProperty: i0, rootData })) {
                                                  vErrors = vErrors === null ? validate135.errors : vErrors.concat(validate135.errors);
                                                  errors = vErrors.length;
                                                }
                                                var valid1 = _errs20 === errors;
                                                if (!valid1) {
                                                  break;
                                                }
                                              }
                                            }
                                          }
                                        } else {
                                          validate175.errors = [{ instancePath: instancePath + "/fixtures", schemaPath: "#/properties/fixtures/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                          return false;
                                        }
                                      }
                                      var valid0 = _errs18 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate175.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate175.errors = vErrors;
  return errors === 0;
}
function validate192(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.caseId === void 0 || !func0.call(data, "caseId")) && (missing0 = "caseId") || (data.caseIndex === void 0 || !func0.call(data, "caseIndex")) && (missing0 = "caseIndex")) {
        validate192.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema59.properties, key0)) {
            validate192.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate192.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("run-case" !== data0) {
              validate192.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "run-case" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate192.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate192.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.caseId !== void 0 && func0.call(data, "caseId")) {
                              const _errs13 = errors;
                              if (!validate23(data.caseId, { instancePath: instancePath + "/caseId", parentData: data, parentDataProperty: "caseId", rootData })) {
                                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                errors = vErrors.length;
                              }
                              var valid0 = _errs13 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.caseIndex !== void 0 && func0.call(data, "caseIndex")) {
                                let data10 = data.caseIndex;
                                const _errs14 = errors;
                                if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)) && isFinite(data10))) {
                                  validate192.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                  return false;
                                }
                                if (errors === _errs14) {
                                  if (typeof data10 == "number" && isFinite(data10)) {
                                    if (data10 > 99 || isNaN(data10)) {
                                      validate192.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/maximum", keyword: "maximum", params: { comparison: "<=", limit: 99 }, message: "must be <= 99" }];
                                      return false;
                                    } else {
                                      if (data10 < 0 || isNaN(data10)) {
                                        validate192.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                        return false;
                                      }
                                    }
                                  }
                                }
                                var valid0 = _errs14 === errors;
                              } else {
                                var valid0 = true;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate192.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate192.errors = vErrors;
  return errors === 0;
}
function validate515(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  let passing0 = null;
  const _errs1 = errors;
  if (!validate175(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate175.errors : vErrors.concat(validate175.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs1 === errors;
  if (_valid0) {
    valid0 = true;
    passing0 = 0;
  }
  const _errs2 = errors;
  if (!validate192(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate192.errors : vErrors.concat(validate192.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs2 === errors;
  if (_valid0 && valid0) {
    valid0 = false;
    passing0 = [passing0, 1];
  } else {
    if (_valid0) {
      valid0 = true;
      passing0 = 1;
    }
  }
  if (!valid0) {
    const err0 = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
    validate515.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate515.errors = vErrors;
  return errors === 0;
}
var validateWorkerResponseStructure = validate518;
function validate204(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision")) {
        validate204.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema61.properties, key0)) {
            validate204.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate204.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("ready" !== data0) {
              validate204.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "ready" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate204.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate204.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate204.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate204.errors = vErrors;
  return errors === 0;
}
function validate213(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.caseId === void 0 || !func0.call(data, "caseId")) && (missing0 = "caseId") || (data.caseIndex === void 0 || !func0.call(data, "caseIndex")) && (missing0 = "caseIndex") || (data.mode === void 0 || !func0.call(data, "mode")) && (missing0 = "mode") || (data.outcome === void 0 || !func0.call(data, "outcome")) && (missing0 = "outcome") || (data.result === void 0 || !func0.call(data, "result")) && (missing0 = "result")) {
        validate213.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema62.properties, key0)) {
            validate213.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate213.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("case-result" !== data0) {
              validate213.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "case-result" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate213.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate213.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.caseId !== void 0 && func0.call(data, "caseId")) {
                              const _errs13 = errors;
                              if (!validate23(data.caseId, { instancePath: instancePath + "/caseId", parentData: data, parentDataProperty: "caseId", rootData })) {
                                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                errors = vErrors.length;
                              }
                              var valid0 = _errs13 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.caseIndex !== void 0 && func0.call(data, "caseIndex")) {
                                let data10 = data.caseIndex;
                                const _errs14 = errors;
                                if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)) && isFinite(data10))) {
                                  validate213.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                  return false;
                                }
                                if (errors === _errs14) {
                                  if (typeof data10 == "number" && isFinite(data10)) {
                                    if (data10 > 99 || isNaN(data10)) {
                                      validate213.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/maximum", keyword: "maximum", params: { comparison: "<=", limit: 99 }, message: "must be <= 99" }];
                                      return false;
                                    } else {
                                      if (data10 < 0 || isNaN(data10)) {
                                        validate213.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                        return false;
                                      }
                                    }
                                  }
                                }
                                var valid0 = _errs14 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.mode !== void 0 && func0.call(data, "mode")) {
                                  let data11 = data.mode;
                                  const _errs16 = errors;
                                  if (typeof data11 !== "string") {
                                    validate213.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  if ("run" !== data11) {
                                    validate213.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/const", keyword: "const", params: { allowedValue: "run" }, message: "must be equal to constant" }];
                                    return false;
                                  }
                                  var valid0 = _errs16 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.outcome !== void 0 && func0.call(data, "outcome")) {
                                    let data12 = data.outcome;
                                    const _errs18 = errors;
                                    if (typeof data12 !== "string") {
                                      validate213.errors = [{ instancePath: instancePath + "/outcome", schemaPath: "#/properties/outcome/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    if ("executed" !== data12) {
                                      validate213.errors = [{ instancePath: instancePath + "/outcome", schemaPath: "#/properties/outcome/const", keyword: "const", params: { allowedValue: "executed" }, message: "must be equal to constant" }];
                                      return false;
                                    }
                                    var valid0 = _errs18 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.result !== void 0 && func0.call(data, "result")) {
                                      const _errs20 = errors;
                                      if (!validate101(data.result, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                                        vErrors = vErrors === null ? validate101.errors : vErrors.concat(validate101.errors);
                                        errors = vErrors.length;
                                      }
                                      var valid0 = _errs20 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate213.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate213.errors = vErrors;
  return errors === 0;
}
function validate224(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.caseId === void 0 || !func0.call(data, "caseId")) && (missing0 = "caseId") || (data.caseIndex === void 0 || !func0.call(data, "caseIndex")) && (missing0 = "caseIndex") || (data.mode === void 0 || !func0.call(data, "mode")) && (missing0 = "mode") || (data.outcome === void 0 || !func0.call(data, "outcome")) && (missing0 = "outcome") || (data.result === void 0 || !func0.call(data, "result")) && (missing0 = "result")) {
        validate224.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema63.properties, key0)) {
            validate224.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate224.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("case-result" !== data0) {
              validate224.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "case-result" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate224.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate224.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.caseId !== void 0 && func0.call(data, "caseId")) {
                              const _errs13 = errors;
                              if (!validate23(data.caseId, { instancePath: instancePath + "/caseId", parentData: data, parentDataProperty: "caseId", rootData })) {
                                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                errors = vErrors.length;
                              }
                              var valid0 = _errs13 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.caseIndex !== void 0 && func0.call(data, "caseIndex")) {
                                let data10 = data.caseIndex;
                                const _errs14 = errors;
                                if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)) && isFinite(data10))) {
                                  validate224.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                  return false;
                                }
                                if (errors === _errs14) {
                                  if (typeof data10 == "number" && isFinite(data10)) {
                                    if (data10 > 99 || isNaN(data10)) {
                                      validate224.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/maximum", keyword: "maximum", params: { comparison: "<=", limit: 99 }, message: "must be <= 99" }];
                                      return false;
                                    } else {
                                      if (data10 < 0 || isNaN(data10)) {
                                        validate224.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                        return false;
                                      }
                                    }
                                  }
                                }
                                var valid0 = _errs14 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.mode !== void 0 && func0.call(data, "mode")) {
                                  let data11 = data.mode;
                                  const _errs16 = errors;
                                  if (typeof data11 !== "string") {
                                    validate224.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  if ("submit" !== data11) {
                                    validate224.errors = [{ instancePath: instancePath + "/mode", schemaPath: "#/properties/mode/const", keyword: "const", params: { allowedValue: "submit" }, message: "must be equal to constant" }];
                                    return false;
                                  }
                                  var valid0 = _errs16 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.outcome !== void 0 && func0.call(data, "outcome")) {
                                    let data12 = data.outcome;
                                    const _errs18 = errors;
                                    if (typeof data12 !== "string") {
                                      validate224.errors = [{ instancePath: instancePath + "/outcome", schemaPath: "#/properties/outcome/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    if (!(data12 === "passed" || data12 === "mismatch")) {
                                      validate224.errors = [{ instancePath: instancePath + "/outcome", schemaPath: "#/properties/outcome/enum", keyword: "enum", params: { allowedValues: schema63.properties.outcome.enum }, message: "must be equal to one of the allowed values" }];
                                      return false;
                                    }
                                    var valid0 = _errs18 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.result !== void 0 && func0.call(data, "result")) {
                                      const _errs20 = errors;
                                      if (!validate101(data.result, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                                        vErrors = vErrors === null ? validate101.errors : vErrors.concat(validate101.errors);
                                        errors = vErrors.length;
                                      }
                                      var valid0 = _errs20 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate224.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate224.errors = vErrors;
  return errors === 0;
}
function validate235(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.phase === void 0 || !func0.call(data, "phase")) && (missing0 = "phase") || (data.code === void 0 || !func0.call(data, "code")) && (missing0 = "code") || (data.message === void 0 || !func0.call(data, "message")) && (missing0 = "message")) {
        validate235.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema64.properties, key0)) {
            validate235.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate235.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("error" !== data0) {
              validate235.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "error" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate235.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate235.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.phase !== void 0 && func0.call(data, "phase")) {
                              let data9 = data.phase;
                              const _errs13 = errors;
                              if (typeof data9 !== "string") {
                                validate235.errors = [{ instancePath: instancePath + "/phase", schemaPath: "#/properties/phase/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                              if ("prepare" !== data9) {
                                validate235.errors = [{ instancePath: instancePath + "/phase", schemaPath: "#/properties/phase/const", keyword: "const", params: { allowedValue: "prepare" }, message: "must be equal to constant" }];
                                return false;
                              }
                              var valid0 = _errs13 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.code !== void 0 && func0.call(data, "code")) {
                                const _errs15 = errors;
                                if (!validate243(data.code, { instancePath: instancePath + "/code", parentData: data, parentDataProperty: "code", rootData })) {
                                  vErrors = vErrors === null ? validate243.errors : vErrors.concat(validate243.errors);
                                  errors = vErrors.length;
                                }
                                var valid0 = _errs15 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.message !== void 0 && func0.call(data, "message")) {
                                  const _errs16 = errors;
                                  if (!validate119(data.message, { instancePath: instancePath + "/message", parentData: data, parentDataProperty: "message", rootData })) {
                                    vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                                    errors = vErrors.length;
                                  }
                                  var valid0 = _errs16 === errors;
                                } else {
                                  var valid0 = true;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate235.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate235.errors = vErrors;
  return errors === 0;
}
function validate247(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.type === void 0 || !func0.call(data, "type")) && (missing0 = "type") || (data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.requestId === void 0 || !func0.call(data, "requestId")) && (missing0 = "requestId") || (data.contentToken === void 0 || !func0.call(data, "contentToken")) && (missing0 = "contentToken") || (data.rootRevision === void 0 || !func0.call(data, "rootRevision")) && (missing0 = "rootRevision") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing0 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing0 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing0 = "lessonId") || (data.lessonRevision === void 0 || !func0.call(data, "lessonRevision")) && (missing0 = "lessonRevision") || (data.caseId === void 0 || !func0.call(data, "caseId")) && (missing0 = "caseId") || (data.caseIndex === void 0 || !func0.call(data, "caseIndex")) && (missing0 = "caseIndex") || (data.phase === void 0 || !func0.call(data, "phase")) && (missing0 = "phase") || (data.code === void 0 || !func0.call(data, "code")) && (missing0 = "code") || (data.message === void 0 || !func0.call(data, "message")) && (missing0 = "message")) {
        validate247.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema66.properties, key0)) {
            validate247.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== void 0 && func0.call(data, "type")) {
            let data0 = data.type;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate247.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("error" !== data0) {
              validate247.errors = [{ instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "error" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
              let data1 = data.schemaVersion;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)) && isFinite(data1))) {
                validate247.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate247.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.requestId !== void 0 && func0.call(data, "requestId")) {
                const _errs6 = errors;
                if (!validate176(data.requestId, { instancePath: instancePath + "/requestId", parentData: data, parentDataProperty: "requestId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.contentToken !== void 0 && func0.call(data, "contentToken")) {
                  const _errs7 = errors;
                  if (!validate176(data.contentToken, { instancePath: instancePath + "/contentToken", parentData: data, parentDataProperty: "contentToken", rootData })) {
                    vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.rootRevision !== void 0 && func0.call(data, "rootRevision")) {
                    const _errs8 = errors;
                    if (!validate25(data.rootRevision, { instancePath: instancePath + "/rootRevision", parentData: data, parentDataProperty: "rootRevision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.courseId !== void 0 && func0.call(data, "courseId")) {
                      const _errs9 = errors;
                      if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                        const _errs10 = errors;
                        if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                          vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                          errors = vErrors.length;
                        }
                        var valid0 = _errs10 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                          const _errs11 = errors;
                          if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                            errors = vErrors.length;
                          }
                          var valid0 = _errs11 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.lessonRevision !== void 0 && func0.call(data, "lessonRevision")) {
                            const _errs12 = errors;
                            if (!validate25(data.lessonRevision, { instancePath: instancePath + "/lessonRevision", parentData: data, parentDataProperty: "lessonRevision", rootData })) {
                              vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                              errors = vErrors.length;
                            }
                            var valid0 = _errs12 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.caseId !== void 0 && func0.call(data, "caseId")) {
                              const _errs13 = errors;
                              if (!validate23(data.caseId, { instancePath: instancePath + "/caseId", parentData: data, parentDataProperty: "caseId", rootData })) {
                                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                errors = vErrors.length;
                              }
                              var valid0 = _errs13 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.caseIndex !== void 0 && func0.call(data, "caseIndex")) {
                                let data10 = data.caseIndex;
                                const _errs14 = errors;
                                if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)) && isFinite(data10))) {
                                  validate247.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                  return false;
                                }
                                if (errors === _errs14) {
                                  if (typeof data10 == "number" && isFinite(data10)) {
                                    if (data10 > 99 || isNaN(data10)) {
                                      validate247.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/maximum", keyword: "maximum", params: { comparison: "<=", limit: 99 }, message: "must be <= 99" }];
                                      return false;
                                    } else {
                                      if (data10 < 0 || isNaN(data10)) {
                                        validate247.errors = [{ instancePath: instancePath + "/caseIndex", schemaPath: "#/properties/caseIndex/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                        return false;
                                      }
                                    }
                                  }
                                }
                                var valid0 = _errs14 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.phase !== void 0 && func0.call(data, "phase")) {
                                  let data11 = data.phase;
                                  const _errs16 = errors;
                                  if (typeof data11 !== "string") {
                                    validate247.errors = [{ instancePath: instancePath + "/phase", schemaPath: "#/properties/phase/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  if ("case" !== data11) {
                                    validate247.errors = [{ instancePath: instancePath + "/phase", schemaPath: "#/properties/phase/const", keyword: "const", params: { allowedValue: "case" }, message: "must be equal to constant" }];
                                    return false;
                                  }
                                  var valid0 = _errs16 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.code !== void 0 && func0.call(data, "code")) {
                                    const _errs18 = errors;
                                    if (!validate243(data.code, { instancePath: instancePath + "/code", parentData: data, parentDataProperty: "code", rootData })) {
                                      vErrors = vErrors === null ? validate243.errors : vErrors.concat(validate243.errors);
                                      errors = vErrors.length;
                                    }
                                    var valid0 = _errs18 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.message !== void 0 && func0.call(data, "message")) {
                                      const _errs19 = errors;
                                      if (!validate119(data.message, { instancePath: instancePath + "/message", parentData: data, parentDataProperty: "message", rootData })) {
                                        vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
                                        errors = vErrors.length;
                                      }
                                      var valid0 = _errs19 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate247.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate247.errors = vErrors;
  return errors === 0;
}
function validate518(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  let passing0 = null;
  const _errs1 = errors;
  if (!validate204(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate204.errors : vErrors.concat(validate204.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs1 === errors;
  if (_valid0) {
    valid0 = true;
    passing0 = 0;
  }
  const _errs2 = errors;
  if (!validate213(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate213.errors : vErrors.concat(validate213.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs2 === errors;
  if (_valid0 && valid0) {
    valid0 = false;
    passing0 = [passing0, 1];
  } else {
    if (_valid0) {
      valid0 = true;
      passing0 = 1;
    }
    const _errs3 = errors;
    if (!validate224(data, { instancePath, parentData, parentDataProperty, rootData })) {
      vErrors = vErrors === null ? validate224.errors : vErrors.concat(validate224.errors);
      errors = vErrors.length;
    }
    var _valid0 = _errs3 === errors;
    if (_valid0 && valid0) {
      valid0 = false;
      passing0 = [passing0, 2];
    } else {
      if (_valid0) {
        valid0 = true;
        passing0 = 2;
      }
      const _errs4 = errors;
      if (!validate235(data, { instancePath, parentData, parentDataProperty, rootData })) {
        vErrors = vErrors === null ? validate235.errors : vErrors.concat(validate235.errors);
        errors = vErrors.length;
      }
      var _valid0 = _errs4 === errors;
      if (_valid0 && valid0) {
        valid0 = false;
        passing0 = [passing0, 3];
      } else {
        if (_valid0) {
          valid0 = true;
          passing0 = 3;
        }
        const _errs5 = errors;
        if (!validate247(data, { instancePath, parentData, parentDataProperty, rootData })) {
          vErrors = vErrors === null ? validate247.errors : vErrors.concat(validate247.errors);
          errors = vErrors.length;
        }
        var _valid0 = _errs5 === errors;
        if (_valid0 && valid0) {
          valid0 = false;
          passing0 = [passing0, 4];
        } else {
          if (_valid0) {
            valid0 = true;
            passing0 = 4;
          }
        }
      }
    }
  }
  if (!valid0) {
    const err0 = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
    validate518.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate518.errors = vErrors;
  return errors === 0;
}
var validateWorkerMessageStructure = validate524;
function validate174(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  let passing0 = null;
  const _errs1 = errors;
  if (!validate175(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate175.errors : vErrors.concat(validate175.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs1 === errors;
  if (_valid0) {
    valid0 = true;
    passing0 = 0;
  }
  const _errs2 = errors;
  if (!validate192(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate192.errors : vErrors.concat(validate192.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs2 === errors;
  if (_valid0 && valid0) {
    valid0 = false;
    passing0 = [passing0, 1];
  } else {
    if (_valid0) {
      valid0 = true;
      passing0 = 1;
    }
  }
  if (!valid0) {
    const err0 = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
    validate174.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate174.errors = vErrors;
  return errors === 0;
}
function validate203(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  let passing0 = null;
  const _errs1 = errors;
  if (!validate204(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate204.errors : vErrors.concat(validate204.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs1 === errors;
  if (_valid0) {
    valid0 = true;
    passing0 = 0;
  }
  const _errs2 = errors;
  if (!validate213(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate213.errors : vErrors.concat(validate213.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs2 === errors;
  if (_valid0 && valid0) {
    valid0 = false;
    passing0 = [passing0, 1];
  } else {
    if (_valid0) {
      valid0 = true;
      passing0 = 1;
    }
    const _errs3 = errors;
    if (!validate224(data, { instancePath, parentData, parentDataProperty, rootData })) {
      vErrors = vErrors === null ? validate224.errors : vErrors.concat(validate224.errors);
      errors = vErrors.length;
    }
    var _valid0 = _errs3 === errors;
    if (_valid0 && valid0) {
      valid0 = false;
      passing0 = [passing0, 2];
    } else {
      if (_valid0) {
        valid0 = true;
        passing0 = 2;
      }
      const _errs4 = errors;
      if (!validate235(data, { instancePath, parentData, parentDataProperty, rootData })) {
        vErrors = vErrors === null ? validate235.errors : vErrors.concat(validate235.errors);
        errors = vErrors.length;
      }
      var _valid0 = _errs4 === errors;
      if (_valid0 && valid0) {
        valid0 = false;
        passing0 = [passing0, 3];
      } else {
        if (_valid0) {
          valid0 = true;
          passing0 = 3;
        }
        const _errs5 = errors;
        if (!validate247(data, { instancePath, parentData, parentDataProperty, rootData })) {
          vErrors = vErrors === null ? validate247.errors : vErrors.concat(validate247.errors);
          errors = vErrors.length;
        }
        var _valid0 = _errs5 === errors;
        if (_valid0 && valid0) {
          valid0 = false;
          passing0 = [passing0, 4];
        } else {
          if (_valid0) {
            valid0 = true;
            passing0 = 4;
          }
        }
      }
    }
  }
  if (!valid0) {
    const err0 = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
    validate203.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate203.errors = vErrors;
  return errors === 0;
}
function validate524(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs1 = errors;
  let valid0 = false;
  let passing0 = null;
  const _errs2 = errors;
  if (!validate174(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate174.errors : vErrors.concat(validate174.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs2 === errors;
  if (_valid0) {
    valid0 = true;
    passing0 = 0;
  }
  const _errs3 = errors;
  if (!validate203(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate203.errors : vErrors.concat(validate203.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs3 === errors;
  if (_valid0 && valid0) {
    valid0 = false;
    passing0 = [passing0, 1];
  } else {
    if (_valid0) {
      valid0 = true;
      passing0 = 1;
    }
  }
  if (!valid0) {
    const err0 = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
    validate524.errors = vErrors;
    return false;
  } else {
    errors = _errs1;
    if (vErrors !== null) {
      if (_errs1) {
        vErrors.length = _errs1;
      } else {
        vErrors = null;
      }
    }
  }
  validate524.errors = vErrors;
  return errors === 0;
}
var validatePuzzleDraftStructure = validate527;
function validate527(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.cardOrder === void 0 || !func0.call(data, "cardOrder")) && (missing0 = "cardOrder") || (data.sql === void 0 || !func0.call(data, "sql")) && (missing0 = "sql")) {
        validate527.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "cardOrder" || key0 === "sql")) {
            validate527.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.cardOrder !== void 0 && func0.call(data, "cardOrder")) {
            let data0 = data.cardOrder;
            const _errs3 = errors;
            if (errors === _errs3) {
              if (Array.isArray(data0)) {
                if (data0.length > 40) {
                  validate527.errors = [{ instancePath: instancePath + "/cardOrder", schemaPath: "#/properties/cardOrder/maxItems", keyword: "maxItems", params: { limit: 40 }, message: "must NOT have more than 40 items" }];
                  return false;
                } else {
                  if (data0.length < 0) {
                    validate527.errors = [{ instancePath: instancePath + "/cardOrder", schemaPath: "#/properties/cardOrder/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                    return false;
                  } else {
                    var valid1 = true;
                    const len0 = data0.length;
                    for (let i0 = 0; i0 < len0; i0++) {
                      const _errs5 = errors;
                      if (!validate23(data0[i0], { instancePath: instancePath + "/cardOrder/" + i0, parentData: data0, parentDataProperty: i0, rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid1 = _errs5 === errors;
                      if (!valid1) {
                        break;
                      }
                    }
                    if (valid1) {
                      let i1 = data0.length;
                      let j0;
                      if (i1 > 1) {
                        outer0:
                          for (; i1--; ) {
                            for (j0 = i1; j0--; ) {
                              if (func32(data0[i1], data0[j0])) {
                                validate527.errors = [{ instancePath: instancePath + "/cardOrder", schemaPath: "#/properties/cardOrder/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" }];
                                return false;
                                break outer0;
                              }
                            }
                          }
                      }
                    }
                  }
                }
              } else {
                validate527.errors = [{ instancePath: instancePath + "/cardOrder", schemaPath: "#/properties/cardOrder/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                return false;
              }
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.sql !== void 0 && func0.call(data, "sql")) {
              const _errs6 = errors;
              if (!validate72(data.sql, { instancePath: instancePath + "/sql", parentData: data, parentDataProperty: "sql", rootData })) {
                vErrors = vErrors === null ? validate72.errors : vErrors.concat(validate72.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs6 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate527.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate527.errors = vErrors;
  return errors === 0;
}
var validateLearningRecordStructure = validate530;
var schema67 = { "type": "object", "additionalProperties": false, "properties": { "schemaVersion": { "type": "integer", "const": 1 }, "courseId": { "$ref": "#/definitions/ContentId" }, "themeId": { "$ref": "#/definitions/ContentId" }, "lessonId": { "$ref": "#/definitions/ContentId" }, "revision": { "$ref": "#/definitions/Revision" }, "draftSql": { "$ref": "#/definitions/SqlDraft" }, "puzzleDraft": { "$ref": "#/definitions/PuzzleDraft" }, "inputMode": { "$ref": "#/definitions/InputMode" }, "passed": { "type": "boolean" }, "viewedHintIds": { "type": "array", "items": { "$ref": "#/definitions/HintId" }, "minItems": 0, "maxItems": 3, "uniqueItems": true }, "reviewMarked": { "type": "boolean" } }, "required": ["schemaVersion", "courseId", "themeId", "lessonId", "revision", "draftSql", "inputMode", "passed", "viewedHintIds", "reviewMarked"], "if": { "properties": { "inputMode": { "const": "puzzle" } }, "required": ["inputMode"] }, "then": { "properties": { "puzzleDraft": { "$ref": "#/definitions/PuzzleDraft" } }, "required": ["puzzleDraft"] }, "$comment": "One revision slot, keyed by courseId/themeId/lessonId/revision. Both draft budgets are identical to execution SQL. Unknown courses and historical revisions remain valid. Ordinary saves patch changed fields only, never regress passed or replace other slots." };
function validate262(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.cardOrder === void 0 || !func0.call(data, "cardOrder")) && (missing0 = "cardOrder") || (data.sql === void 0 || !func0.call(data, "sql")) && (missing0 = "sql")) {
        validate262.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "cardOrder" || key0 === "sql")) {
            validate262.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.cardOrder !== void 0 && func0.call(data, "cardOrder")) {
            let data0 = data.cardOrder;
            const _errs3 = errors;
            if (errors === _errs3) {
              if (Array.isArray(data0)) {
                if (data0.length > 40) {
                  validate262.errors = [{ instancePath: instancePath + "/cardOrder", schemaPath: "#/properties/cardOrder/maxItems", keyword: "maxItems", params: { limit: 40 }, message: "must NOT have more than 40 items" }];
                  return false;
                } else {
                  if (data0.length < 0) {
                    validate262.errors = [{ instancePath: instancePath + "/cardOrder", schemaPath: "#/properties/cardOrder/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                    return false;
                  } else {
                    var valid1 = true;
                    const len0 = data0.length;
                    for (let i0 = 0; i0 < len0; i0++) {
                      const _errs5 = errors;
                      if (!validate23(data0[i0], { instancePath: instancePath + "/cardOrder/" + i0, parentData: data0, parentDataProperty: i0, rootData })) {
                        vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                        errors = vErrors.length;
                      }
                      var valid1 = _errs5 === errors;
                      if (!valid1) {
                        break;
                      }
                    }
                    if (valid1) {
                      let i1 = data0.length;
                      let j0;
                      if (i1 > 1) {
                        outer0:
                          for (; i1--; ) {
                            for (j0 = i1; j0--; ) {
                              if (func32(data0[i1], data0[j0])) {
                                validate262.errors = [{ instancePath: instancePath + "/cardOrder", schemaPath: "#/properties/cardOrder/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" }];
                                return false;
                                break outer0;
                              }
                            }
                          }
                      }
                    }
                  }
                }
              } else {
                validate262.errors = [{ instancePath: instancePath + "/cardOrder", schemaPath: "#/properties/cardOrder/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                return false;
              }
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.sql !== void 0 && func0.call(data, "sql")) {
              const _errs6 = errors;
              if (!validate72(data.sql, { instancePath: instancePath + "/sql", parentData: data, parentDataProperty: "sql", rootData })) {
                vErrors = vErrors === null ? validate72.errors : vErrors.concat(validate72.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs6 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate262.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate262.errors = vErrors;
  return errors === 0;
}
function validate273(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (typeof data !== "string") {
    validate273.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
    return false;
  }
  if (!(data === "idea" || data === "syntax" || data === "skeleton")) {
    validate273.errors = [{ instancePath, schemaPath: "#/enum", keyword: "enum", params: { allowedValues: schema69.enum }, message: "must be equal to one of the allowed values" }];
    return false;
  }
  validate273.errors = vErrors;
  return errors === 0;
}
function validate530(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs2 = errors;
  let valid0 = true;
  const _errs3 = errors;
  if (data && typeof data == "object" && !Array.isArray(data)) {
    let missing0;
    if ((data.inputMode === void 0 || !func0.call(data, "inputMode")) && (missing0 = "inputMode")) {
      const err0 = {};
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    } else {
      if (data.inputMode !== void 0 && func0.call(data, "inputMode")) {
        if ("puzzle" !== data.inputMode) {
          const err1 = {};
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
      }
    }
  }
  var _valid0 = _errs3 === errors;
  errors = _errs2;
  if (vErrors !== null) {
    if (_errs2) {
      vErrors.length = _errs2;
    } else {
      vErrors = null;
    }
  }
  if (_valid0) {
    const _errs5 = errors;
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing1;
      if ((data.puzzleDraft === void 0 || !func0.call(data, "puzzleDraft")) && (missing1 = "puzzleDraft")) {
        validate530.errors = [{ instancePath, schemaPath: "#/then/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
        return false;
      } else {
        if (data.puzzleDraft !== void 0 && func0.call(data, "puzzleDraft")) {
          if (!validate262(data.puzzleDraft, { instancePath: instancePath + "/puzzleDraft", parentData: data, parentDataProperty: "puzzleDraft", rootData })) {
            vErrors = vErrors === null ? validate262.errors : vErrors.concat(validate262.errors);
            errors = vErrors.length;
          }
        }
      }
    }
    var _valid0 = _errs5 === errors;
    valid0 = _valid0;
  }
  if (!valid0) {
    const err2 = { instancePath, schemaPath: "#/if", keyword: "if", params: { failingKeyword: "then" }, message: 'must match "then" schema' };
    if (vErrors === null) {
      vErrors = [err2];
    } else {
      vErrors.push(err2);
    }
    errors++;
    validate530.errors = vErrors;
    return false;
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing2;
      if ((data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing2 = "schemaVersion") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing2 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing2 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing2 = "lessonId") || (data.revision === void 0 || !func0.call(data, "revision")) && (missing2 = "revision") || (data.draftSql === void 0 || !func0.call(data, "draftSql")) && (missing2 = "draftSql") || (data.inputMode === void 0 || !func0.call(data, "inputMode")) && (missing2 = "inputMode") || (data.passed === void 0 || !func0.call(data, "passed")) && (missing2 = "passed") || (data.viewedHintIds === void 0 || !func0.call(data, "viewedHintIds")) && (missing2 = "viewedHintIds") || (data.reviewMarked === void 0 || !func0.call(data, "reviewMarked")) && (missing2 = "reviewMarked")) {
        validate530.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
        return false;
      } else {
        const _errs7 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema67.properties, key0)) {
            validate530.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs7 === errors) {
          if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
            let data2 = data.schemaVersion;
            const _errs8 = errors;
            if (!(typeof data2 == "number" && (!(data2 % 1) && !isNaN(data2)) && isFinite(data2))) {
              validate530.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (1 !== data2) {
              validate530.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
              return false;
            }
            var valid3 = _errs8 === errors;
          } else {
            var valid3 = true;
          }
          if (valid3) {
            if (data.courseId !== void 0 && func0.call(data, "courseId")) {
              const _errs10 = errors;
              if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                errors = vErrors.length;
              }
              var valid3 = _errs10 === errors;
            } else {
              var valid3 = true;
            }
            if (valid3) {
              if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                const _errs11 = errors;
                if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                  vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                  errors = vErrors.length;
                }
                var valid3 = _errs11 === errors;
              } else {
                var valid3 = true;
              }
              if (valid3) {
                if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                  const _errs12 = errors;
                  if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                    vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                    errors = vErrors.length;
                  }
                  var valid3 = _errs12 === errors;
                } else {
                  var valid3 = true;
                }
                if (valid3) {
                  if (data.revision !== void 0 && func0.call(data, "revision")) {
                    const _errs13 = errors;
                    if (!validate25(data.revision, { instancePath: instancePath + "/revision", parentData: data, parentDataProperty: "revision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid3 = _errs13 === errors;
                  } else {
                    var valid3 = true;
                  }
                  if (valid3) {
                    if (data.draftSql !== void 0 && func0.call(data, "draftSql")) {
                      const _errs14 = errors;
                      if (!validate72(data.draftSql, { instancePath: instancePath + "/draftSql", parentData: data, parentDataProperty: "draftSql", rootData })) {
                        vErrors = vErrors === null ? validate72.errors : vErrors.concat(validate72.errors);
                        errors = vErrors.length;
                      }
                      var valid3 = _errs14 === errors;
                    } else {
                      var valid3 = true;
                    }
                    if (valid3) {
                      if (data.puzzleDraft !== void 0 && func0.call(data, "puzzleDraft")) {
                        const _errs15 = errors;
                        if (!validate262(data.puzzleDraft, { instancePath: instancePath + "/puzzleDraft", parentData: data, parentDataProperty: "puzzleDraft", rootData })) {
                          vErrors = vErrors === null ? validate262.errors : vErrors.concat(validate262.errors);
                          errors = vErrors.length;
                        }
                        var valid3 = _errs15 === errors;
                      } else {
                        var valid3 = true;
                      }
                      if (valid3) {
                        if (data.inputMode !== void 0 && func0.call(data, "inputMode")) {
                          const _errs16 = errors;
                          if (!validate186(data.inputMode, { instancePath: instancePath + "/inputMode", parentData: data, parentDataProperty: "inputMode", rootData })) {
                            vErrors = vErrors === null ? validate186.errors : vErrors.concat(validate186.errors);
                            errors = vErrors.length;
                          }
                          var valid3 = _errs16 === errors;
                        } else {
                          var valid3 = true;
                        }
                        if (valid3) {
                          if (data.passed !== void 0 && func0.call(data, "passed")) {
                            const _errs17 = errors;
                            if (typeof data.passed !== "boolean") {
                              validate530.errors = [{ instancePath: instancePath + "/passed", schemaPath: "#/properties/passed/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                              return false;
                            }
                            var valid3 = _errs17 === errors;
                          } else {
                            var valid3 = true;
                          }
                          if (valid3) {
                            if (data.viewedHintIds !== void 0 && func0.call(data, "viewedHintIds")) {
                              let data11 = data.viewedHintIds;
                              const _errs19 = errors;
                              if (errors === _errs19) {
                                if (Array.isArray(data11)) {
                                  if (data11.length > 3) {
                                    validate530.errors = [{ instancePath: instancePath + "/viewedHintIds", schemaPath: "#/properties/viewedHintIds/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                                    return false;
                                  } else {
                                    if (data11.length < 0) {
                                      validate530.errors = [{ instancePath: instancePath + "/viewedHintIds", schemaPath: "#/properties/viewedHintIds/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                                      return false;
                                    } else {
                                      var valid4 = true;
                                      const len0 = data11.length;
                                      for (let i0 = 0; i0 < len0; i0++) {
                                        const _errs21 = errors;
                                        if (!validate273(data11[i0], { instancePath: instancePath + "/viewedHintIds/" + i0, parentData: data11, parentDataProperty: i0, rootData })) {
                                          vErrors = vErrors === null ? validate273.errors : vErrors.concat(validate273.errors);
                                          errors = vErrors.length;
                                        }
                                        var valid4 = _errs21 === errors;
                                        if (!valid4) {
                                          break;
                                        }
                                      }
                                      if (valid4) {
                                        let i1 = data11.length;
                                        let j0;
                                        if (i1 > 1) {
                                          outer0:
                                            for (; i1--; ) {
                                              for (j0 = i1; j0--; ) {
                                                if (func32(data11[i1], data11[j0])) {
                                                  validate530.errors = [{ instancePath: instancePath + "/viewedHintIds", schemaPath: "#/properties/viewedHintIds/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" }];
                                                  return false;
                                                  break outer0;
                                                }
                                              }
                                            }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  validate530.errors = [{ instancePath: instancePath + "/viewedHintIds", schemaPath: "#/properties/viewedHintIds/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                  return false;
                                }
                              }
                              var valid3 = _errs19 === errors;
                            } else {
                              var valid3 = true;
                            }
                            if (valid3) {
                              if (data.reviewMarked !== void 0 && func0.call(data, "reviewMarked")) {
                                const _errs22 = errors;
                                if (typeof data.reviewMarked !== "boolean") {
                                  validate530.errors = [{ instancePath: instancePath + "/reviewMarked", schemaPath: "#/properties/reviewMarked/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                  return false;
                                }
                                var valid3 = _errs22 === errors;
                              } else {
                                var valid3 = true;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate530.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate530.errors = vErrors;
  return errors === 0;
}
var validateRecordMetadataStructure = validate540;
function validate277(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (!(typeof data == "number" && (!(data % 1) && !isNaN(data)) && isFinite(data))) {
    validate277.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
    return false;
  }
  if (errors === 0) {
    if (typeof data == "number" && isFinite(data)) {
      if (data > 9007199254740991 || isNaN(data)) {
        validate277.errors = [{ instancePath, schemaPath: "#/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
        return false;
      } else {
        if (data < 0 || isNaN(data)) {
          validate277.errors = [{ instancePath, schemaPath: "#/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
          return false;
        }
      }
    }
  }
  validate277.errors = vErrors;
  return errors === 0;
}
function validate540(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.recordSetVersion === void 0 || !func0.call(data, "recordSetVersion")) && (missing0 = "recordSetVersion") || (data.recordGeneration === void 0 || !func0.call(data, "recordGeneration")) && (missing0 = "recordGeneration")) {
        validate540.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "schemaVersion" || key0 === "recordSetVersion" || key0 === "recordGeneration")) {
            validate540.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
            let data0 = data.schemaVersion;
            const _errs3 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)) && isFinite(data0))) {
              validate540.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (1 !== data0) {
              validate540.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.recordSetVersion !== void 0 && func0.call(data, "recordSetVersion")) {
              const _errs5 = errors;
              if (!validate277(data.recordSetVersion, { instancePath: instancePath + "/recordSetVersion", parentData: data, parentDataProperty: "recordSetVersion", rootData })) {
                vErrors = vErrors === null ? validate277.errors : vErrors.concat(validate277.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.recordGeneration !== void 0 && func0.call(data, "recordGeneration")) {
                const _errs6 = errors;
                if (!validate277(data.recordGeneration, { instancePath: instancePath + "/recordGeneration", parentData: data, parentDataProperty: "recordGeneration", rootData })) {
                  vErrors = vErrors === null ? validate277.errors : vErrors.concat(validate277.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate540.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate540.errors = vErrors;
  return errors === 0;
}
var validateBackupPartStructure = validate543;
function validate282(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (errors === 0) {
      if (typeof data === "string") {
        if (func55(data) > 24) {
          validate282.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 24 }, message: "must NOT have more than 24 characters" }];
          return false;
        } else {
          if (func55(data) < 24) {
            validate282.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 24 }, message: "must NOT have fewer than 24 characters" }];
            return false;
          } else {
            if (!pattern9.test(data)) {
              validate282.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\.[0-9]{3}Z$" }, message: 'must match pattern "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\.[0-9]{3}Z$"' }];
              return false;
            } else {
              if (!formats0.validate(data)) {
                validate282.errors = [{ instancePath, schemaPath: "#/format", keyword: "format", params: { format: "date-time" }, message: 'must match format "date-time"' }];
                return false;
              }
            }
          }
        }
      } else {
        validate282.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
        return false;
      }
    }
  }
  validate282.errors = vErrors;
  return errors === 0;
}
function validate261(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs2 = errors;
  let valid0 = true;
  const _errs3 = errors;
  if (data && typeof data == "object" && !Array.isArray(data)) {
    let missing0;
    if ((data.inputMode === void 0 || !func0.call(data, "inputMode")) && (missing0 = "inputMode")) {
      const err0 = {};
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    } else {
      if (data.inputMode !== void 0 && func0.call(data, "inputMode")) {
        if ("puzzle" !== data.inputMode) {
          const err1 = {};
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
      }
    }
  }
  var _valid0 = _errs3 === errors;
  errors = _errs2;
  if (vErrors !== null) {
    if (_errs2) {
      vErrors.length = _errs2;
    } else {
      vErrors = null;
    }
  }
  if (_valid0) {
    const _errs5 = errors;
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing1;
      if ((data.puzzleDraft === void 0 || !func0.call(data, "puzzleDraft")) && (missing1 = "puzzleDraft")) {
        validate261.errors = [{ instancePath, schemaPath: "#/then/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
        return false;
      } else {
        if (data.puzzleDraft !== void 0 && func0.call(data, "puzzleDraft")) {
          if (!validate262(data.puzzleDraft, { instancePath: instancePath + "/puzzleDraft", parentData: data, parentDataProperty: "puzzleDraft", rootData })) {
            vErrors = vErrors === null ? validate262.errors : vErrors.concat(validate262.errors);
            errors = vErrors.length;
          }
        }
      }
    }
    var _valid0 = _errs5 === errors;
    valid0 = _valid0;
  }
  if (!valid0) {
    const err2 = { instancePath, schemaPath: "#/if", keyword: "if", params: { failingKeyword: "then" }, message: 'must match "then" schema' };
    if (vErrors === null) {
      vErrors = [err2];
    } else {
      vErrors.push(err2);
    }
    errors++;
    validate261.errors = vErrors;
    return false;
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing2;
      if ((data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing2 = "schemaVersion") || (data.courseId === void 0 || !func0.call(data, "courseId")) && (missing2 = "courseId") || (data.themeId === void 0 || !func0.call(data, "themeId")) && (missing2 = "themeId") || (data.lessonId === void 0 || !func0.call(data, "lessonId")) && (missing2 = "lessonId") || (data.revision === void 0 || !func0.call(data, "revision")) && (missing2 = "revision") || (data.draftSql === void 0 || !func0.call(data, "draftSql")) && (missing2 = "draftSql") || (data.inputMode === void 0 || !func0.call(data, "inputMode")) && (missing2 = "inputMode") || (data.passed === void 0 || !func0.call(data, "passed")) && (missing2 = "passed") || (data.viewedHintIds === void 0 || !func0.call(data, "viewedHintIds")) && (missing2 = "viewedHintIds") || (data.reviewMarked === void 0 || !func0.call(data, "reviewMarked")) && (missing2 = "reviewMarked")) {
        validate261.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
        return false;
      } else {
        const _errs7 = errors;
        for (const key0 of Object.keys(data)) {
          if (!func0.call(schema67.properties, key0)) {
            validate261.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs7 === errors) {
          if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
            let data2 = data.schemaVersion;
            const _errs8 = errors;
            if (!(typeof data2 == "number" && (!(data2 % 1) && !isNaN(data2)) && isFinite(data2))) {
              validate261.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (1 !== data2) {
              validate261.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
              return false;
            }
            var valid3 = _errs8 === errors;
          } else {
            var valid3 = true;
          }
          if (valid3) {
            if (data.courseId !== void 0 && func0.call(data, "courseId")) {
              const _errs10 = errors;
              if (!validate23(data.courseId, { instancePath: instancePath + "/courseId", parentData: data, parentDataProperty: "courseId", rootData })) {
                vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                errors = vErrors.length;
              }
              var valid3 = _errs10 === errors;
            } else {
              var valid3 = true;
            }
            if (valid3) {
              if (data.themeId !== void 0 && func0.call(data, "themeId")) {
                const _errs11 = errors;
                if (!validate23(data.themeId, { instancePath: instancePath + "/themeId", parentData: data, parentDataProperty: "themeId", rootData })) {
                  vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                  errors = vErrors.length;
                }
                var valid3 = _errs11 === errors;
              } else {
                var valid3 = true;
              }
              if (valid3) {
                if (data.lessonId !== void 0 && func0.call(data, "lessonId")) {
                  const _errs12 = errors;
                  if (!validate23(data.lessonId, { instancePath: instancePath + "/lessonId", parentData: data, parentDataProperty: "lessonId", rootData })) {
                    vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                    errors = vErrors.length;
                  }
                  var valid3 = _errs12 === errors;
                } else {
                  var valid3 = true;
                }
                if (valid3) {
                  if (data.revision !== void 0 && func0.call(data, "revision")) {
                    const _errs13 = errors;
                    if (!validate25(data.revision, { instancePath: instancePath + "/revision", parentData: data, parentDataProperty: "revision", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid3 = _errs13 === errors;
                  } else {
                    var valid3 = true;
                  }
                  if (valid3) {
                    if (data.draftSql !== void 0 && func0.call(data, "draftSql")) {
                      const _errs14 = errors;
                      if (!validate72(data.draftSql, { instancePath: instancePath + "/draftSql", parentData: data, parentDataProperty: "draftSql", rootData })) {
                        vErrors = vErrors === null ? validate72.errors : vErrors.concat(validate72.errors);
                        errors = vErrors.length;
                      }
                      var valid3 = _errs14 === errors;
                    } else {
                      var valid3 = true;
                    }
                    if (valid3) {
                      if (data.puzzleDraft !== void 0 && func0.call(data, "puzzleDraft")) {
                        const _errs15 = errors;
                        if (!validate262(data.puzzleDraft, { instancePath: instancePath + "/puzzleDraft", parentData: data, parentDataProperty: "puzzleDraft", rootData })) {
                          vErrors = vErrors === null ? validate262.errors : vErrors.concat(validate262.errors);
                          errors = vErrors.length;
                        }
                        var valid3 = _errs15 === errors;
                      } else {
                        var valid3 = true;
                      }
                      if (valid3) {
                        if (data.inputMode !== void 0 && func0.call(data, "inputMode")) {
                          const _errs16 = errors;
                          if (!validate186(data.inputMode, { instancePath: instancePath + "/inputMode", parentData: data, parentDataProperty: "inputMode", rootData })) {
                            vErrors = vErrors === null ? validate186.errors : vErrors.concat(validate186.errors);
                            errors = vErrors.length;
                          }
                          var valid3 = _errs16 === errors;
                        } else {
                          var valid3 = true;
                        }
                        if (valid3) {
                          if (data.passed !== void 0 && func0.call(data, "passed")) {
                            const _errs17 = errors;
                            if (typeof data.passed !== "boolean") {
                              validate261.errors = [{ instancePath: instancePath + "/passed", schemaPath: "#/properties/passed/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                              return false;
                            }
                            var valid3 = _errs17 === errors;
                          } else {
                            var valid3 = true;
                          }
                          if (valid3) {
                            if (data.viewedHintIds !== void 0 && func0.call(data, "viewedHintIds")) {
                              let data11 = data.viewedHintIds;
                              const _errs19 = errors;
                              if (errors === _errs19) {
                                if (Array.isArray(data11)) {
                                  if (data11.length > 3) {
                                    validate261.errors = [{ instancePath: instancePath + "/viewedHintIds", schemaPath: "#/properties/viewedHintIds/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                                    return false;
                                  } else {
                                    if (data11.length < 0) {
                                      validate261.errors = [{ instancePath: instancePath + "/viewedHintIds", schemaPath: "#/properties/viewedHintIds/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                                      return false;
                                    } else {
                                      var valid4 = true;
                                      const len0 = data11.length;
                                      for (let i0 = 0; i0 < len0; i0++) {
                                        const _errs21 = errors;
                                        if (!validate273(data11[i0], { instancePath: instancePath + "/viewedHintIds/" + i0, parentData: data11, parentDataProperty: i0, rootData })) {
                                          vErrors = vErrors === null ? validate273.errors : vErrors.concat(validate273.errors);
                                          errors = vErrors.length;
                                        }
                                        var valid4 = _errs21 === errors;
                                        if (!valid4) {
                                          break;
                                        }
                                      }
                                      if (valid4) {
                                        let i1 = data11.length;
                                        let j0;
                                        if (i1 > 1) {
                                          outer0:
                                            for (; i1--; ) {
                                              for (j0 = i1; j0--; ) {
                                                if (func32(data11[i1], data11[j0])) {
                                                  validate261.errors = [{ instancePath: instancePath + "/viewedHintIds", schemaPath: "#/properties/viewedHintIds/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" }];
                                                  return false;
                                                  break outer0;
                                                }
                                              }
                                            }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  validate261.errors = [{ instancePath: instancePath + "/viewedHintIds", schemaPath: "#/properties/viewedHintIds/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                  return false;
                                }
                              }
                              var valid3 = _errs19 === errors;
                            } else {
                              var valid3 = true;
                            }
                            if (valid3) {
                              if (data.reviewMarked !== void 0 && func0.call(data, "reviewMarked")) {
                                const _errs22 = errors;
                                if (typeof data.reviewMarked !== "boolean") {
                                  validate261.errors = [{ instancePath: instancePath + "/reviewMarked", schemaPath: "#/properties/reviewMarked/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                  return false;
                                }
                                var valid3 = _errs22 === errors;
                              } else {
                                var valid3 = true;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate261.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate261.errors = vErrors;
  return errors === 0;
}
function validate543(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((data.schemaVersion === void 0 || !func0.call(data, "schemaVersion")) && (missing0 = "schemaVersion") || (data.exportedAt === void 0 || !func0.call(data, "exportedAt")) && (missing0 = "exportedAt") || (data.backupId === void 0 || !func0.call(data, "backupId")) && (missing0 = "backupId") || (data.partIndex === void 0 || !func0.call(data, "partIndex")) && (missing0 = "partIndex") || (data.partCount === void 0 || !func0.call(data, "partCount")) && (missing0 = "partCount") || (data.records === void 0 || !func0.call(data, "records")) && (missing0 = "records")) {
        validate543.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs2 = errors;
        for (const key0 of Object.keys(data)) {
          if (!(key0 === "schemaVersion" || key0 === "exportedAt" || key0 === "backupId" || key0 === "partIndex" || key0 === "partCount" || key0 === "records")) {
            validate543.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs2 === errors) {
          if (data.schemaVersion !== void 0 && func0.call(data, "schemaVersion")) {
            let data0 = data.schemaVersion;
            const _errs3 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)) && isFinite(data0))) {
              validate543.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (1 !== data0) {
              validate543.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.exportedAt !== void 0 && func0.call(data, "exportedAt")) {
              const _errs5 = errors;
              if (!validate282(data.exportedAt, { instancePath: instancePath + "/exportedAt", parentData: data, parentDataProperty: "exportedAt", rootData })) {
                vErrors = vErrors === null ? validate282.errors : vErrors.concat(validate282.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.backupId !== void 0 && func0.call(data, "backupId")) {
                const _errs6 = errors;
                if (!validate176(data.backupId, { instancePath: instancePath + "/backupId", parentData: data, parentDataProperty: "backupId", rootData })) {
                  vErrors = vErrors === null ? validate176.errors : vErrors.concat(validate176.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.partIndex !== void 0 && func0.call(data, "partIndex")) {
                  const _errs7 = errors;
                  if (!validate25(data.partIndex, { instancePath: instancePath + "/partIndex", parentData: data, parentDataProperty: "partIndex", rootData })) {
                    vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                    errors = vErrors.length;
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.partCount !== void 0 && func0.call(data, "partCount")) {
                    const _errs8 = errors;
                    if (!validate25(data.partCount, { instancePath: instancePath + "/partCount", parentData: data, parentDataProperty: "partCount", rootData })) {
                      vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs8 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.records !== void 0 && func0.call(data, "records")) {
                      let data5 = data.records;
                      const _errs9 = errors;
                      if (errors === _errs9) {
                        if (Array.isArray(data5)) {
                          if (data5.length > 1e4) {
                            validate543.errors = [{ instancePath: instancePath + "/records", schemaPath: "#/properties/records/maxItems", keyword: "maxItems", params: { limit: 1e4 }, message: "must NOT have more than 10000 items" }];
                            return false;
                          } else {
                            if (data5.length < 0) {
                              validate543.errors = [{ instancePath: instancePath + "/records", schemaPath: "#/properties/records/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" }];
                              return false;
                            } else {
                              var valid1 = true;
                              const len0 = data5.length;
                              for (let i0 = 0; i0 < len0; i0++) {
                                const _errs11 = errors;
                                if (!validate261(data5[i0], { instancePath: instancePath + "/records/" + i0, parentData: data5, parentDataProperty: i0, rootData })) {
                                  vErrors = vErrors === null ? validate261.errors : vErrors.concat(validate261.errors);
                                  errors = vErrors.length;
                                }
                                var valid1 = _errs11 === errors;
                                if (!valid1) {
                                  break;
                                }
                              }
                            }
                          }
                        } else {
                          validate543.errors = [{ instancePath: instancePath + "/records", schemaPath: "#/properties/records/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                          return false;
                        }
                      }
                      var valid0 = _errs9 === errors;
                    } else {
                      var valid0 = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate543.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate543.errors = vErrors;
  return errors === 0;
}
export {
  validateBackupPartStructure,
  validateCaseErrorStructure,
  validateCellStructure,
  validateChapterStructure,
  validateComparisonStructure,
  validateConceptStructure,
  validateContentIdStructure,
  validateContentPathStructure,
  validateCounterStructure,
  validateCourseStructure,
  validateDescriptionStructure,
  validateExactComparisonStructure,
  validateExecutionModeStructure,
  validateExpectedFailureStructure,
  validateFixtureColumnStructure,
  validateFixtureIndexDefinitionStructure,
  validateFixtureIndexStructure,
  validateFixtureStructure,
  validateFixtureTableStructure,
  validateFlowEdgeStructure,
  validateFlowNodeStructure,
  validateFlowchartStructure,
  validateForeignKeyStructure,
  validateHintIdStructure,
  validateHintsStructure,
  validateIdeaHintStructure,
  validateIdentifierStructure,
  validateIndexColumnStructure,
  validateInputModeStructure,
  validateIntegerColumnStructure,
  validateLearningRecordStructure,
  validateLessonIndexStructure,
  validateLessonStructure,
  validatePrepareErrorStructure,
  validatePrepareRequestStructure,
  validateProseStructure,
  validatePuzzleDraftStructure,
  validateQueryResultStructure,
  validateReadyResponseStructure,
  validateRealColumnStructure,
  validateRecordMetadataStructure,
  validateReferenceSolutionStructure,
  validateRevisionStructure,
  validateRowStructure,
  validateRunCaseRequestStructure,
  validateRunCaseResultStructure,
  validateSafeIntegerStructure,
  validateSafeNumberStructure,
  validateSkeletonHintStructure,
  validateSqlCardStructure,
  validateSqlDraftStructure,
  validateSqlPuzzleStructure,
  validateSqlStructure,
  validateSubmitCaseResultStructure,
  validateSyntaxHintStructure,
  validateTestCaseStructure,
  validateTextColumnStructure,
  validateThemeStructure,
  validateTimestampStructure,
  validateTitleStructure,
  validateTokenStructure,
  validateToleranceStructure,
  validateTolerantComparisonStructure,
  validateWorkerErrorCodeStructure,
  validateWorkerMessageStructure,
  validateWorkerRequestStructure,
  validateWorkerResponseStructure
};
