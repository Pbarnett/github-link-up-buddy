import {
  require_hoist_non_react_statics_cjs
} from "./chunk-F6OQOHBF.js";
import {
  require_react
} from "./chunk-YFF3FIXT.js";
import {
  __commonJS,
  __toESM
} from "./chunk-WOOG5QLI.js";

// node_modules/.pnpm/lodash.camelcase@4.3.0/node_modules/lodash.camelcase/index.js
var require_lodash = __commonJS({
  "node_modules/.pnpm/lodash.camelcase@4.3.0/node_modules/lodash.camelcase/index.js"(exports, module) {
    var INFINITY = 1 / 0;
    var symbolTag = "[object Symbol]";
    var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
    var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23";
    var rsComboSymbolsRange = "\\u20d0-\\u20f0";
    var rsDingbatRange = "\\u2700-\\u27bf";
    var rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff";
    var rsMathOpRange = "\\xac\\xb1\\xd7\\xf7";
    var rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf";
    var rsPunctuationRange = "\\u2000-\\u206f";
    var rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000";
    var rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde";
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
    var rsApos = "['’]";
    var rsAstral = "[" + rsAstralRange + "]";
    var rsBreak = "[" + rsBreakRange + "]";
    var rsCombo = "[" + rsComboMarksRange + rsComboSymbolsRange + "]";
    var rsDigits = "\\d+";
    var rsDingbat = "[" + rsDingbatRange + "]";
    var rsLower = "[" + rsLowerRange + "]";
    var rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]";
    var rsFitz = "\\ud83c[\\udffb-\\udfff]";
    var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
    var rsNonAstral = "[^" + rsAstralRange + "]";
    var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
    var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
    var rsUpper = "[" + rsUpperRange + "]";
    var rsZWJ = "\\u200d";
    var rsLowerMisc = "(?:" + rsLower + "|" + rsMisc + ")";
    var rsUpperMisc = "(?:" + rsUpper + "|" + rsMisc + ")";
    var rsOptLowerContr = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?";
    var rsOptUpperContr = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?";
    var reOptMod = rsModifier + "?";
    var rsOptVar = "[" + rsVarRange + "]?";
    var rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
    var rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq;
    var rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reApos = RegExp(rsApos, "g");
    var reComboMark = RegExp(rsCombo, "g");
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    var reUnicodeWord = RegExp([
      rsUpper + "?" + rsLower + "+" + rsOptLowerContr + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
      rsUpperMisc + "+" + rsOptUpperContr + "(?=" + [rsBreak, rsUpper + rsLowerMisc, "$"].join("|") + ")",
      rsUpper + "?" + rsLowerMisc + "+" + rsOptLowerContr,
      rsUpper + "+" + rsOptUpperContr,
      rsDigits,
      rsEmoji
    ].join("|"), "g");
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + "]");
    var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
    var deburredLetters = {
      // Latin-1 Supplement block.
      "À": "A",
      "Á": "A",
      "Â": "A",
      "Ã": "A",
      "Ä": "A",
      "Å": "A",
      "à": "a",
      "á": "a",
      "â": "a",
      "ã": "a",
      "ä": "a",
      "å": "a",
      "Ç": "C",
      "ç": "c",
      "Ð": "D",
      "ð": "d",
      "È": "E",
      "É": "E",
      "Ê": "E",
      "Ë": "E",
      "è": "e",
      "é": "e",
      "ê": "e",
      "ë": "e",
      "Ì": "I",
      "Í": "I",
      "Î": "I",
      "Ï": "I",
      "ì": "i",
      "í": "i",
      "î": "i",
      "ï": "i",
      "Ñ": "N",
      "ñ": "n",
      "Ò": "O",
      "Ó": "O",
      "Ô": "O",
      "Õ": "O",
      "Ö": "O",
      "Ø": "O",
      "ò": "o",
      "ó": "o",
      "ô": "o",
      "õ": "o",
      "ö": "o",
      "ø": "o",
      "Ù": "U",
      "Ú": "U",
      "Û": "U",
      "Ü": "U",
      "ù": "u",
      "ú": "u",
      "û": "u",
      "ü": "u",
      "Ý": "Y",
      "ý": "y",
      "ÿ": "y",
      "Æ": "Ae",
      "æ": "ae",
      "Þ": "Th",
      "þ": "th",
      "ß": "ss",
      // Latin Extended-A block.
      "Ā": "A",
      "Ă": "A",
      "Ą": "A",
      "ā": "a",
      "ă": "a",
      "ą": "a",
      "Ć": "C",
      "Ĉ": "C",
      "Ċ": "C",
      "Č": "C",
      "ć": "c",
      "ĉ": "c",
      "ċ": "c",
      "č": "c",
      "Ď": "D",
      "Đ": "D",
      "ď": "d",
      "đ": "d",
      "Ē": "E",
      "Ĕ": "E",
      "Ė": "E",
      "Ę": "E",
      "Ě": "E",
      "ē": "e",
      "ĕ": "e",
      "ė": "e",
      "ę": "e",
      "ě": "e",
      "Ĝ": "G",
      "Ğ": "G",
      "Ġ": "G",
      "Ģ": "G",
      "ĝ": "g",
      "ğ": "g",
      "ġ": "g",
      "ģ": "g",
      "Ĥ": "H",
      "Ħ": "H",
      "ĥ": "h",
      "ħ": "h",
      "Ĩ": "I",
      "Ī": "I",
      "Ĭ": "I",
      "Į": "I",
      "İ": "I",
      "ĩ": "i",
      "ī": "i",
      "ĭ": "i",
      "į": "i",
      "ı": "i",
      "Ĵ": "J",
      "ĵ": "j",
      "Ķ": "K",
      "ķ": "k",
      "ĸ": "k",
      "Ĺ": "L",
      "Ļ": "L",
      "Ľ": "L",
      "Ŀ": "L",
      "Ł": "L",
      "ĺ": "l",
      "ļ": "l",
      "ľ": "l",
      "ŀ": "l",
      "ł": "l",
      "Ń": "N",
      "Ņ": "N",
      "Ň": "N",
      "Ŋ": "N",
      "ń": "n",
      "ņ": "n",
      "ň": "n",
      "ŋ": "n",
      "Ō": "O",
      "Ŏ": "O",
      "Ő": "O",
      "ō": "o",
      "ŏ": "o",
      "ő": "o",
      "Ŕ": "R",
      "Ŗ": "R",
      "Ř": "R",
      "ŕ": "r",
      "ŗ": "r",
      "ř": "r",
      "Ś": "S",
      "Ŝ": "S",
      "Ş": "S",
      "Š": "S",
      "ś": "s",
      "ŝ": "s",
      "ş": "s",
      "š": "s",
      "Ţ": "T",
      "Ť": "T",
      "Ŧ": "T",
      "ţ": "t",
      "ť": "t",
      "ŧ": "t",
      "Ũ": "U",
      "Ū": "U",
      "Ŭ": "U",
      "Ů": "U",
      "Ű": "U",
      "Ų": "U",
      "ũ": "u",
      "ū": "u",
      "ŭ": "u",
      "ů": "u",
      "ű": "u",
      "ų": "u",
      "Ŵ": "W",
      "ŵ": "w",
      "Ŷ": "Y",
      "ŷ": "y",
      "Ÿ": "Y",
      "Ź": "Z",
      "Ż": "Z",
      "Ž": "Z",
      "ź": "z",
      "ż": "z",
      "ž": "z",
      "Ĳ": "IJ",
      "ĳ": "ij",
      "Œ": "Oe",
      "œ": "oe",
      "ŉ": "'n",
      "ſ": "ss"
    };
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1, length = array ? array.length : 0;
      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }
    function asciiToArray(string) {
      return string.split("");
    }
    function asciiWords(string) {
      return string.match(reAsciiWord) || [];
    }
    function basePropertyOf(object) {
      return function(key) {
        return object == null ? void 0 : object[key];
      };
    }
    var deburrLetter = basePropertyOf(deburredLetters);
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    function hasUnicodeWord(string) {
      return reHasUnicodeWord.test(string);
    }
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    function unicodeWords(string) {
      return string.match(reUnicodeWord) || [];
    }
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var Symbol2 = root.Symbol;
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function baseSlice(array, start, end) {
      var index = -1, length = array.length;
      if (start < 0) {
        start = -start > length ? 0 : length + start;
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : end - start >>> 0;
      start >>>= 0;
      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }
    function baseToString(value) {
      if (typeof value == "string") {
        return value;
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === void 0 ? length : end;
      return !start && end >= length ? array : baseSlice(array, start, end);
    }
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);
        var strSymbols = hasUnicode(string) ? stringToArray(string) : void 0;
        var chr = strSymbols ? strSymbols[0] : string.charAt(0);
        var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
        return chr[methodName]() + trailing;
      };
    }
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
      };
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toString(value) {
      return value == null ? "" : baseToString(value);
    }
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
    }
    var upperFirst = createCaseFirst("toUpperCase");
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? void 0 : pattern;
      if (pattern === void 0) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }
    module.exports = camelCase;
  }
});

// node_modules/.pnpm/launchdarkly-react-client-sdk@3.8.1_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/launchdarkly-react-client-sdk/lib/esm/index.js
var e4 = __toESM(require_react());
var import_react = __toESM(require_react());

// node_modules/.pnpm/launchdarkly-js-client-sdk@3.8.1/node_modules/launchdarkly-js-client-sdk/dist/ldclient.es.js
function e(e5) {
  function t3(e6, t4) {
    Error.captureStackTrace && Error.captureStackTrace(this, this.constructor), this.message = e6, this.code = t4;
  }
  return t3.prototype = new Error(), t3.prototype.name = e5, t3.prototype.constructor = t3, t3;
}
var t = e("LaunchDarklyUnexpectedResponseError");
var n = e("LaunchDarklyInvalidEnvironmentIdError");
var r = e("LaunchDarklyInvalidUserError");
var o = e("LaunchDarklyInvalidEventKeyError");
var i = e("LaunchDarklyInvalidArgumentError");
var a = e("LaunchDarklyFlagFetchError");
for (s = { LDUnexpectedResponseError: t, LDInvalidEnvironmentIdError: n, LDInvalidUserError: r, LDInvalidEventKeyError: o, LDInvalidArgumentError: i, LDInvalidDataError: e("LaunchDarklyInvalidDataError"), LDFlagFetchError: a, LDTimeoutError: e("LaunchDarklyTimeoutError"), isHttpErrorRecoverable: function(e5) {
  return !(e5 >= 400 && e5 < 500) || (400 === e5 || 408 === e5 || 429 === e5);
} }, c2 = function(e5) {
  var t3 = m(e5), n3 = t3[0], r3 = t3[1];
  return 3 * (n3 + r3) / 4 - r3;
}, u2 = function(e5) {
  var t3, n3, r3 = m(e5), o3 = r3[0], i3 = r3[1], a3 = new g2(function(e6, t4, n4) {
    return 3 * (t4 + n4) / 4 - n4;
  }(0, o3, i3)), s2 = 0, c3 = i3 > 0 ? o3 - 4 : o3;
  for (n3 = 0; n3 < c3; n3 += 4) t3 = f2[e5.charCodeAt(n3)] << 18 | f2[e5.charCodeAt(n3 + 1)] << 12 | f2[e5.charCodeAt(n3 + 2)] << 6 | f2[e5.charCodeAt(n3 + 3)], a3[s2++] = t3 >> 16 & 255, a3[s2++] = t3 >> 8 & 255, a3[s2++] = 255 & t3;
  2 === i3 && (t3 = f2[e5.charCodeAt(n3)] << 2 | f2[e5.charCodeAt(n3 + 1)] >> 4, a3[s2++] = 255 & t3);
  1 === i3 && (t3 = f2[e5.charCodeAt(n3)] << 10 | f2[e5.charCodeAt(n3 + 1)] << 4 | f2[e5.charCodeAt(n3 + 2)] >> 2, a3[s2++] = t3 >> 8 & 255, a3[s2++] = 255 & t3);
  return a3;
}, l2 = function(e5) {
  for (var t3, n3 = e5.length, r3 = n3 % 3, o3 = [], i3 = 16383, a3 = 0, s2 = n3 - r3; a3 < s2; a3 += i3) o3.push(h(e5, a3, a3 + i3 > s2 ? s2 : a3 + i3));
  1 === r3 ? (t3 = e5[n3 - 1], o3.push(d2[t3 >> 2] + d2[t3 << 4 & 63] + "==")) : 2 === r3 && (t3 = (e5[n3 - 2] << 8) + e5[n3 - 1], o3.push(d2[t3 >> 10] + d2[t3 >> 4 & 63] + d2[t3 << 2 & 63] + "="));
  return o3.join("");
}, d2 = [], f2 = [], g2 = "undefined" != typeof Uint8Array ? Uint8Array : Array, v2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", p2 = 0; p2 < 64; ++p2) d2[p2] = v2[p2], f2[v2.charCodeAt(p2)] = p2;
var s;
var c2;
var u2;
var l2;
var d2;
var f2;
var g2;
var v2;
var p2;
function m(e5) {
  var t3 = e5.length;
  if (t3 % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
  var n3 = e5.indexOf("=");
  return -1 === n3 && (n3 = t3), [n3, n3 === t3 ? 0 : 4 - n3 % 4];
}
function h(e5, t3, n3) {
  for (var r3, o3, i3 = [], a3 = t3; a3 < n3; a3 += 3) r3 = (e5[a3] << 16 & 16711680) + (e5[a3 + 1] << 8 & 65280) + (255 & e5[a3 + 2]), i3.push(d2[(o3 = r3) >> 18 & 63] + d2[o3 >> 12 & 63] + d2[o3 >> 6 & 63] + d2[63 & o3]);
  return i3.join("");
}
f2["-".charCodeAt(0)] = 62, f2["_".charCodeAt(0)] = 63;
var y = { byteLength: c2, toByteArray: u2, fromByteArray: l2 };
var w = Array.isArray;
var b = Object.keys;
var k = Object.prototype.hasOwnProperty;
var E = function e2(t3, n3) {
  if (t3 === n3) return true;
  if (t3 && n3 && "object" == typeof t3 && "object" == typeof n3) {
    var r3, o3, i3, a3 = w(t3), s = w(n3);
    if (a3 && s) {
      if ((o3 = t3.length) != n3.length) return false;
      for (r3 = o3; 0 !== r3--; ) if (!e2(t3[r3], n3[r3])) return false;
      return true;
    }
    if (a3 != s) return false;
    var c2 = t3 instanceof Date, u2 = n3 instanceof Date;
    if (c2 != u2) return false;
    if (c2 && u2) return t3.getTime() == n3.getTime();
    var l2 = t3 instanceof RegExp, d2 = n3 instanceof RegExp;
    if (l2 != d2) return false;
    if (l2 && d2) return t3.toString() == n3.toString();
    var f2 = b(t3);
    if ((o3 = f2.length) !== b(n3).length) return false;
    for (r3 = o3; 0 !== r3--; ) if (!k.call(n3, f2[r3])) return false;
    for (r3 = o3; 0 !== r3--; ) if (!e2(t3[i3 = f2[r3]], n3[i3])) return false;
    return true;
  }
  return t3 != t3 && n3 != n3;
};
var D = ["key", "ip", "country", "email", "firstName", "lastName", "avatar", "name"];
function x(e5) {
  const t3 = unescape(encodeURIComponent(e5));
  return y.fromByteArray(function(e6) {
    const t4 = [];
    for (let n3 = 0; n3 < e6.length; n3++) t4.push(e6.charCodeAt(n3));
    return t4;
  }(t3));
}
function C(e5, t3) {
  return Object.prototype.hasOwnProperty.call(e5, t3);
}
var P;
var S = { appendUrlPath: function(e5, t3) {
  return (e5.endsWith("/") ? e5.substring(0, e5.length - 1) : e5) + (t3.startsWith("/") ? "" : "/") + t3;
}, base64URLEncode: function(e5) {
  return x(e5).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}, btoa: x, clone: function(e5) {
  return JSON.parse(JSON.stringify(e5));
}, deepEquals: function(e5, t3) {
  return E(e5, t3);
}, extend: function(...e5) {
  return e5.reduce((e6, t3) => ({ ...e6, ...t3 }), {});
}, getLDUserAgentString: function(e5) {
  const t3 = e5.version || "?";
  return e5.userAgent + "/" + t3;
}, objectHasOwnProperty: C, onNextTick: function(e5) {
  setTimeout(e5, 0);
}, sanitizeContext: function(e5) {
  if (!e5) return e5;
  let t3;
  return null !== e5.kind && void 0 !== e5.kind || D.forEach((n3) => {
    const r3 = e5[n3];
    void 0 !== r3 && "string" != typeof r3 && (t3 = t3 || { ...e5 }, t3[n3] = String(r3));
  }), t3 || e5;
}, transformValuesToVersionedValues: function(e5) {
  const t3 = {};
  for (const n3 in e5) C(e5, n3) && (t3[n3] = { value: e5[n3], version: 0 });
  return t3;
}, transformVersionedValuesToValues: function(e5) {
  const t3 = {};
  for (const n3 in e5) C(e5, n3) && (t3[n3] = e5[n3].value);
  return t3;
}, wrapPromiseCallback: function(e5, t3) {
  const n3 = e5.then((e6) => (t3 && setTimeout(() => {
    t3(null, e6);
  }, 0), e6), (e6) => {
    if (!t3) return Promise.reject(e6);
    setTimeout(() => {
      t3(e6, null);
    }, 0);
  });
  return t3 ? void 0 : n3;
}, once: function(e5) {
  let t3, n3 = false;
  return function(...r3) {
    return n3 || (n3 = true, t3 = e5.apply(this, r3)), t3;
  };
} };
var I = new Uint8Array(16);
function O() {
  if (!P && !(P = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return P(I);
}
var T = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
function L(e5) {
  return "string" == typeof e5 && T.test(e5);
}
for (j2 = [], R2 = 0; R2 < 256; ++R2) j2.push((R2 + 256).toString(16).substr(1));
var U2;
var A2;
var j2;
var R2;
function F(e5) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n3 = (j2[e5[t3 + 0]] + j2[e5[t3 + 1]] + j2[e5[t3 + 2]] + j2[e5[t3 + 3]] + "-" + j2[e5[t3 + 4]] + j2[e5[t3 + 5]] + "-" + j2[e5[t3 + 6]] + j2[e5[t3 + 7]] + "-" + j2[e5[t3 + 8]] + j2[e5[t3 + 9]] + "-" + j2[e5[t3 + 10]] + j2[e5[t3 + 11]] + j2[e5[t3 + 12]] + j2[e5[t3 + 13]] + j2[e5[t3 + 14]] + j2[e5[t3 + 15]]).toLowerCase();
  if (!L(n3)) throw TypeError("Stringified UUID is invalid");
  return n3;
}
var N = 0;
var $ = 0;
function V(e5) {
  if (!L(e5)) throw TypeError("Invalid UUID");
  var t3, n3 = new Uint8Array(16);
  return n3[0] = (t3 = parseInt(e5.slice(0, 8), 16)) >>> 24, n3[1] = t3 >>> 16 & 255, n3[2] = t3 >>> 8 & 255, n3[3] = 255 & t3, n3[4] = (t3 = parseInt(e5.slice(9, 13), 16)) >>> 8, n3[5] = 255 & t3, n3[6] = (t3 = parseInt(e5.slice(14, 18), 16)) >>> 8, n3[7] = 255 & t3, n3[8] = (t3 = parseInt(e5.slice(19, 23), 16)) >>> 8, n3[9] = 255 & t3, n3[10] = (t3 = parseInt(e5.slice(24, 36), 16)) / 1099511627776 & 255, n3[11] = t3 / 4294967296 & 255, n3[12] = t3 >>> 24 & 255, n3[13] = t3 >>> 16 & 255, n3[14] = t3 >>> 8 & 255, n3[15] = 255 & t3, n3;
}
function H(e5, t3, n3) {
  function r3(e6, r4, o3, i3) {
    if ("string" == typeof e6 && (e6 = function(e7) {
      e7 = unescape(encodeURIComponent(e7));
      for (var t4 = [], n4 = 0; n4 < e7.length; ++n4) t4.push(e7.charCodeAt(n4));
      return t4;
    }(e6)), "string" == typeof r4 && (r4 = V(r4)), 16 !== r4.length) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
    var a3 = new Uint8Array(16 + e6.length);
    if (a3.set(r4), a3.set(e6, r4.length), (a3 = n3(a3))[6] = 15 & a3[6] | t3, a3[8] = 63 & a3[8] | 128, o3) {
      i3 = i3 || 0;
      for (var s = 0; s < 16; ++s) o3[i3 + s] = a3[s];
      return o3;
    }
    return F(a3);
  }
  try {
    r3.name = e5;
  } catch (e6) {
  }
  return r3.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8", r3.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8", r3;
}
function M(e5) {
  return 14 + (e5 + 64 >>> 9 << 4) + 1;
}
function q(e5, t3) {
  var n3 = (65535 & e5) + (65535 & t3);
  return (e5 >> 16) + (t3 >> 16) + (n3 >> 16) << 16 | 65535 & n3;
}
function z(e5, t3, n3, r3, o3, i3) {
  return q((a3 = q(q(t3, e5), q(r3, i3))) << (s = o3) | a3 >>> 32 - s, n3);
  var a3, s;
}
function K(e5, t3, n3, r3, o3, i3, a3) {
  return z(t3 & n3 | ~t3 & r3, e5, t3, o3, i3, a3);
}
function _(e5, t3, n3, r3, o3, i3, a3) {
  return z(t3 & r3 | n3 & ~r3, e5, t3, o3, i3, a3);
}
function J(e5, t3, n3, r3, o3, i3, a3) {
  return z(t3 ^ n3 ^ r3, e5, t3, o3, i3, a3);
}
function B(e5, t3, n3, r3, o3, i3, a3) {
  return z(n3 ^ (t3 | ~r3), e5, t3, o3, i3, a3);
}
var G = H("v3", 48, function(e5) {
  if ("string" == typeof e5) {
    var t3 = unescape(encodeURIComponent(e5));
    e5 = new Uint8Array(t3.length);
    for (var n3 = 0; n3 < t3.length; ++n3) e5[n3] = t3.charCodeAt(n3);
  }
  return function(e6) {
    for (var t4 = [], n4 = 32 * e6.length, r3 = "0123456789abcdef", o3 = 0; o3 < n4; o3 += 8) {
      var i3 = e6[o3 >> 5] >>> o3 % 32 & 255, a3 = parseInt(r3.charAt(i3 >>> 4 & 15) + r3.charAt(15 & i3), 16);
      t4.push(a3);
    }
    return t4;
  }(function(e6, t4) {
    e6[t4 >> 5] |= 128 << t4 % 32, e6[M(t4) - 1] = t4;
    for (var n4 = 1732584193, r3 = -271733879, o3 = -1732584194, i3 = 271733878, a3 = 0; a3 < e6.length; a3 += 16) {
      var s = n4, c2 = r3, u2 = o3, l2 = i3;
      n4 = K(n4, r3, o3, i3, e6[a3], 7, -680876936), i3 = K(i3, n4, r3, o3, e6[a3 + 1], 12, -389564586), o3 = K(o3, i3, n4, r3, e6[a3 + 2], 17, 606105819), r3 = K(r3, o3, i3, n4, e6[a3 + 3], 22, -1044525330), n4 = K(n4, r3, o3, i3, e6[a3 + 4], 7, -176418897), i3 = K(i3, n4, r3, o3, e6[a3 + 5], 12, 1200080426), o3 = K(o3, i3, n4, r3, e6[a3 + 6], 17, -1473231341), r3 = K(r3, o3, i3, n4, e6[a3 + 7], 22, -45705983), n4 = K(n4, r3, o3, i3, e6[a3 + 8], 7, 1770035416), i3 = K(i3, n4, r3, o3, e6[a3 + 9], 12, -1958414417), o3 = K(o3, i3, n4, r3, e6[a3 + 10], 17, -42063), r3 = K(r3, o3, i3, n4, e6[a3 + 11], 22, -1990404162), n4 = K(n4, r3, o3, i3, e6[a3 + 12], 7, 1804603682), i3 = K(i3, n4, r3, o3, e6[a3 + 13], 12, -40341101), o3 = K(o3, i3, n4, r3, e6[a3 + 14], 17, -1502002290), n4 = _(n4, r3 = K(r3, o3, i3, n4, e6[a3 + 15], 22, 1236535329), o3, i3, e6[a3 + 1], 5, -165796510), i3 = _(i3, n4, r3, o3, e6[a3 + 6], 9, -1069501632), o3 = _(o3, i3, n4, r3, e6[a3 + 11], 14, 643717713), r3 = _(r3, o3, i3, n4, e6[a3], 20, -373897302), n4 = _(n4, r3, o3, i3, e6[a3 + 5], 5, -701558691), i3 = _(i3, n4, r3, o3, e6[a3 + 10], 9, 38016083), o3 = _(o3, i3, n4, r3, e6[a3 + 15], 14, -660478335), r3 = _(r3, o3, i3, n4, e6[a3 + 4], 20, -405537848), n4 = _(n4, r3, o3, i3, e6[a3 + 9], 5, 568446438), i3 = _(i3, n4, r3, o3, e6[a3 + 14], 9, -1019803690), o3 = _(o3, i3, n4, r3, e6[a3 + 3], 14, -187363961), r3 = _(r3, o3, i3, n4, e6[a3 + 8], 20, 1163531501), n4 = _(n4, r3, o3, i3, e6[a3 + 13], 5, -1444681467), i3 = _(i3, n4, r3, o3, e6[a3 + 2], 9, -51403784), o3 = _(o3, i3, n4, r3, e6[a3 + 7], 14, 1735328473), n4 = J(n4, r3 = _(r3, o3, i3, n4, e6[a3 + 12], 20, -1926607734), o3, i3, e6[a3 + 5], 4, -378558), i3 = J(i3, n4, r3, o3, e6[a3 + 8], 11, -2022574463), o3 = J(o3, i3, n4, r3, e6[a3 + 11], 16, 1839030562), r3 = J(r3, o3, i3, n4, e6[a3 + 14], 23, -35309556), n4 = J(n4, r3, o3, i3, e6[a3 + 1], 4, -1530992060), i3 = J(i3, n4, r3, o3, e6[a3 + 4], 11, 1272893353), o3 = J(o3, i3, n4, r3, e6[a3 + 7], 16, -155497632), r3 = J(r3, o3, i3, n4, e6[a3 + 10], 23, -1094730640), n4 = J(n4, r3, o3, i3, e6[a3 + 13], 4, 681279174), i3 = J(i3, n4, r3, o3, e6[a3], 11, -358537222), o3 = J(o3, i3, n4, r3, e6[a3 + 3], 16, -722521979), r3 = J(r3, o3, i3, n4, e6[a3 + 6], 23, 76029189), n4 = J(n4, r3, o3, i3, e6[a3 + 9], 4, -640364487), i3 = J(i3, n4, r3, o3, e6[a3 + 12], 11, -421815835), o3 = J(o3, i3, n4, r3, e6[a3 + 15], 16, 530742520), n4 = B(n4, r3 = J(r3, o3, i3, n4, e6[a3 + 2], 23, -995338651), o3, i3, e6[a3], 6, -198630844), i3 = B(i3, n4, r3, o3, e6[a3 + 7], 10, 1126891415), o3 = B(o3, i3, n4, r3, e6[a3 + 14], 15, -1416354905), r3 = B(r3, o3, i3, n4, e6[a3 + 5], 21, -57434055), n4 = B(n4, r3, o3, i3, e6[a3 + 12], 6, 1700485571), i3 = B(i3, n4, r3, o3, e6[a3 + 3], 10, -1894986606), o3 = B(o3, i3, n4, r3, e6[a3 + 10], 15, -1051523), r3 = B(r3, o3, i3, n4, e6[a3 + 1], 21, -2054922799), n4 = B(n4, r3, o3, i3, e6[a3 + 8], 6, 1873313359), i3 = B(i3, n4, r3, o3, e6[a3 + 15], 10, -30611744), o3 = B(o3, i3, n4, r3, e6[a3 + 6], 15, -1560198380), r3 = B(r3, o3, i3, n4, e6[a3 + 13], 21, 1309151649), n4 = B(n4, r3, o3, i3, e6[a3 + 4], 6, -145523070), i3 = B(i3, n4, r3, o3, e6[a3 + 11], 10, -1120210379), o3 = B(o3, i3, n4, r3, e6[a3 + 2], 15, 718787259), r3 = B(r3, o3, i3, n4, e6[a3 + 9], 21, -343485551), n4 = q(n4, s), r3 = q(r3, c2), o3 = q(o3, u2), i3 = q(i3, l2);
    }
    return [n4, r3, o3, i3];
  }(function(e6) {
    if (0 === e6.length) return [];
    for (var t4 = 8 * e6.length, n4 = new Uint32Array(M(t4)), r3 = 0; r3 < t4; r3 += 8) n4[r3 >> 5] |= (255 & e6[r3 / 8]) << r3 % 32;
    return n4;
  }(e5), 8 * e5.length));
});
var W = G;
function X(e5, t3, n3, r3) {
  switch (e5) {
    case 0:
      return t3 & n3 ^ ~t3 & r3;
    case 1:
    case 3:
      return t3 ^ n3 ^ r3;
    case 2:
      return t3 & n3 ^ t3 & r3 ^ n3 & r3;
  }
}
function Q(e5, t3) {
  return e5 << t3 | e5 >>> 32 - t3;
}
var Y = H("v5", 80, function(e5) {
  var t3 = [1518500249, 1859775393, 2400959708, 3395469782], n3 = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  if ("string" == typeof e5) {
    var r3 = unescape(encodeURIComponent(e5));
    e5 = [];
    for (var o3 = 0; o3 < r3.length; ++o3) e5.push(r3.charCodeAt(o3));
  } else Array.isArray(e5) || (e5 = Array.prototype.slice.call(e5));
  e5.push(128);
  for (var i3 = e5.length / 4 + 2, a3 = Math.ceil(i3 / 16), s = new Array(a3), c2 = 0; c2 < a3; ++c2) {
    for (var u2 = new Uint32Array(16), l2 = 0; l2 < 16; ++l2) u2[l2] = e5[64 * c2 + 4 * l2] << 24 | e5[64 * c2 + 4 * l2 + 1] << 16 | e5[64 * c2 + 4 * l2 + 2] << 8 | e5[64 * c2 + 4 * l2 + 3];
    s[c2] = u2;
  }
  s[a3 - 1][14] = 8 * (e5.length - 1) / Math.pow(2, 32), s[a3 - 1][14] = Math.floor(s[a3 - 1][14]), s[a3 - 1][15] = 8 * (e5.length - 1) & 4294967295;
  for (var d2 = 0; d2 < a3; ++d2) {
    for (var f2 = new Uint32Array(80), g2 = 0; g2 < 16; ++g2) f2[g2] = s[d2][g2];
    for (var v2 = 16; v2 < 80; ++v2) f2[v2] = Q(f2[v2 - 3] ^ f2[v2 - 8] ^ f2[v2 - 14] ^ f2[v2 - 16], 1);
    for (var p2 = n3[0], m3 = n3[1], h3 = n3[2], y3 = n3[3], w3 = n3[4], b3 = 0; b3 < 80; ++b3) {
      var k3 = Math.floor(b3 / 20), E3 = Q(p2, 5) + X(k3, m3, h3, y3) + w3 + t3[k3] + f2[b3] >>> 0;
      w3 = y3, y3 = h3, h3 = Q(m3, 30) >>> 0, m3 = p2, p2 = E3;
    }
    n3[0] = n3[0] + p2 >>> 0, n3[1] = n3[1] + m3 >>> 0, n3[2] = n3[2] + h3 >>> 0, n3[3] = n3[3] + y3 >>> 0, n3[4] = n3[4] + w3 >>> 0;
  }
  return [n3[0] >> 24 & 255, n3[0] >> 16 & 255, n3[0] >> 8 & 255, 255 & n3[0], n3[1] >> 24 & 255, n3[1] >> 16 & 255, n3[1] >> 8 & 255, 255 & n3[1], n3[2] >> 24 & 255, n3[2] >> 16 & 255, n3[2] >> 8 & 255, 255 & n3[2], n3[3] >> 24 & 255, n3[3] >> 16 & 255, n3[3] >> 8 & 255, 255 & n3[3], n3[4] >> 24 & 255, n3[4] >> 16 & 255, n3[4] >> 8 & 255, 255 & n3[4]];
});
var Z = Y;
var ee = Object.freeze({ __proto__: null, v1: function(e5, t3, n3) {
  var r3 = t3 && n3 || 0, o3 = t3 || new Array(16), i3 = (e5 = e5 || {}).node || U2, a3 = void 0 !== e5.clockseq ? e5.clockseq : A2;
  if (null == i3 || null == a3) {
    var s = e5.random || (e5.rng || O)();
    null == i3 && (i3 = U2 = [1 | s[0], s[1], s[2], s[3], s[4], s[5]]), null == a3 && (a3 = A2 = 16383 & (s[6] << 8 | s[7]));
  }
  var c2 = void 0 !== e5.msecs ? e5.msecs : Date.now(), u2 = void 0 !== e5.nsecs ? e5.nsecs : $ + 1, l2 = c2 - N + (u2 - $) / 1e4;
  if (l2 < 0 && void 0 === e5.clockseq && (a3 = a3 + 1 & 16383), (l2 < 0 || c2 > N) && void 0 === e5.nsecs && (u2 = 0), u2 >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  N = c2, $ = u2, A2 = a3;
  var d2 = (1e4 * (268435455 & (c2 += 122192928e5)) + u2) % 4294967296;
  o3[r3++] = d2 >>> 24 & 255, o3[r3++] = d2 >>> 16 & 255, o3[r3++] = d2 >>> 8 & 255, o3[r3++] = 255 & d2;
  var f2 = c2 / 4294967296 * 1e4 & 268435455;
  o3[r3++] = f2 >>> 8 & 255, o3[r3++] = 255 & f2, o3[r3++] = f2 >>> 24 & 15 | 16, o3[r3++] = f2 >>> 16 & 255, o3[r3++] = a3 >>> 8 | 128, o3[r3++] = 255 & a3;
  for (var g2 = 0; g2 < 6; ++g2) o3[r3 + g2] = i3[g2];
  return t3 || F(o3);
}, v3: W, v4: function(e5, t3, n3) {
  var r3 = (e5 = e5 || {}).random || (e5.rng || O)();
  if (r3[6] = 15 & r3[6] | 64, r3[8] = 63 & r3[8] | 128, t3) {
    n3 = n3 || 0;
    for (var o3 = 0; o3 < 16; ++o3) t3[n3 + o3] = r3[o3];
    return t3;
  }
  return F(r3);
}, v5: Z, NIL: "00000000-0000-0000-0000-000000000000", version: function(e5) {
  if (!L(e5)) throw TypeError("Invalid UUID");
  return parseInt(e5.substr(14, 1), 16);
}, validate: L, stringify: F, parse: V });
var te = ["debug", "info", "warn", "error", "none"];
var ne = { commonBasicLogger: function(e5, t3) {
  if (e5 && e5.destination && "function" != typeof e5.destination) throw new Error("destination for basicLogger was set to a non-function");
  function n3(e6) {
    return function(t4) {
      console && console[e6] && console[e6].call(console, t4);
    };
  }
  const r3 = e5 && e5.destination ? [e5.destination, e5.destination, e5.destination, e5.destination] : [n3("log"), n3("info"), n3("warn"), n3("error")], o3 = !(!e5 || !e5.destination), i3 = e5 && void 0 !== e5.prefix && null !== e5.prefix ? e5.prefix : "[LaunchDarkly] ";
  let a3 = 1;
  if (e5 && e5.level) for (let t4 = 0; t4 < te.length; t4++) te[t4] === e5.level && (a3 = t4);
  function s(e6, n4, a4) {
    if (a4.length < 1) return;
    let s2;
    const c3 = o3 ? n4 + ": " + i3 : i3;
    if (1 !== a4.length && t3) {
      const e7 = [...a4];
      e7[0] = c3 + e7[0], s2 = t3(...e7);
    } else s2 = c3 + a4[0];
    try {
      r3[e6](s2);
    } catch (e7) {
      console && console.log && console.log("[LaunchDarkly] Configured logger's " + n4 + " method threw an exception: " + e7);
    }
  }
  const c2 = {};
  for (let e6 = 0; e6 < te.length; e6++) {
    const t4 = te[e6];
    if ("none" !== t4) if (e6 < a3) c2[t4] = () => {
    };
    else {
      const n4 = e6;
      c2[t4] = function() {
        s(n4, t4, arguments);
      };
    }
  }
  return c2;
}, validateLogger: function(e5) {
  te.forEach((t3) => {
    if ("none" !== t3 && (!e5[t3] || "function" != typeof e5[t3])) throw new Error("Provided logger instance must support logger." + t3 + "(...) method");
  });
} };
function re(e5) {
  return e5 && e5.message ? e5.message : "string" == typeof e5 || e5 instanceof String ? e5 : JSON.stringify(e5);
}
var oe = " Please see https://docs.launchdarkly.com/sdk/client-side/javascript#initialize-the-client for instructions on SDK initialization.";
var ie = { bootstrapInvalid: function() {
  return "LaunchDarkly bootstrap data is not available because the back end could not read the flags.";
}, bootstrapOldFormat: function() {
  return "LaunchDarkly client was initialized with bootstrap data that did not include flag metadata. Events may not be sent correctly." + oe;
}, clientInitialized: function() {
  return "LaunchDarkly client initialized";
}, clientNotReady: function() {
  return "LaunchDarkly client is not ready";
}, debugEnqueueingEvent: function(e5) {
  return 'enqueueing "' + e5 + '" event';
}, debugPostingDiagnosticEvent: function(e5) {
  return "sending diagnostic event (" + e5.kind + ")";
}, debugPostingEvents: function(e5) {
  return "sending " + e5 + " events";
}, debugStreamDelete: function(e5) {
  return 'received streaming deletion for flag "' + e5 + '"';
}, debugStreamDeleteIgnored: function(e5) {
  return 'received streaming deletion for flag "' + e5 + '" but ignored due to version check';
}, debugStreamPatch: function(e5) {
  return 'received streaming update for flag "' + e5 + '"';
}, debugStreamPatchIgnored: function(e5) {
  return 'received streaming update for flag "' + e5 + '" but ignored due to version check';
}, debugStreamPing: function() {
  return "received ping message from stream";
}, debugPolling: function(e5) {
  return "polling for feature flags at " + e5;
}, debugStreamPut: function() {
  return "received streaming update for all flags";
}, deprecated: function(e5, t3) {
  return t3 ? '"' + e5 + '" is deprecated, please use "' + t3 + '"' : '"' + e5 + '" is deprecated';
}, environmentNotFound: function() {
  return "Environment not found. Double check that you specified a valid environment/client-side ID." + oe;
}, environmentNotSpecified: function() {
  return "No environment/client-side ID was specified." + oe;
}, errorFetchingFlags: function(e5) {
  return "Error fetching flag settings: " + re(e5);
}, eventCapacityExceeded: function() {
  return "Exceeded event queue capacity. Increase capacity to avoid dropping events.";
}, eventWithoutContext: function() {
  return "Be sure to call `identify` in the LaunchDarkly client: https://docs.launchdarkly.com/sdk/features/identify#javascript";
}, httpErrorMessage: function(e5, t3, n3) {
  return "Received error " + e5 + (401 === e5 ? " (invalid SDK key)" : "") + " for " + t3 + " - " + (s.isHttpErrorRecoverable(e5) ? n3 : "giving up permanently");
}, httpUnavailable: function() {
  return "Cannot make HTTP requests in this environment." + oe;
}, identifyDisabled: function() {
  return "identify() has no effect here; it must be called on the main client instance";
}, inspectorMethodError: (e5, t3) => `an inspector: "${t3}" of type: "${e5}" generated an exception`, invalidContentType: function(e5) {
  return 'Expected application/json content type but got "' + e5 + '"';
}, invalidData: function() {
  return "Invalid data received from LaunchDarkly; connection may have been interrupted";
}, invalidInspector: (e5, t3) => `an inspector: "${t3}" of an invalid type (${e5}) was configured`, invalidKey: function() {
  return "Event key must be a string";
}, invalidMetricValue: (e5) => `The track function was called with a non-numeric "metricValue" (${e5}), only numeric metric values are supported.`, invalidContext: function() {
  return "Invalid context specified." + oe;
}, invalidTagValue: (e5) => `Config option "${e5}" must only contain letters, numbers, ., _ or -.`, localStorageUnavailable: function(e5) {
  return "local storage is unavailable: " + re(e5);
}, networkError: (e5) => "network error" + (e5 ? " (" + e5 + ")" : ""), optionBelowMinimum: (e5, t3, n3) => 'Config option "' + e5 + '" was set to ' + t3 + ", changing to minimum value of " + n3, streamClosing: function() {
  return "Closing stream connection";
}, streamConnecting: function(e5) {
  return "Opening stream connection to " + e5;
}, streamError: function(e5, t3) {
  return "Error on stream connection: " + re(e5) + ", will continue retrying after " + t3 + " milliseconds.";
}, tagValueTooLong: (e5) => `Value of "${e5}" was longer than 64 characters and was discarded.`, unknownCustomEventKey: function(e5) {
  return 'Custom event "' + e5 + '" does not exist';
}, unknownOption: (e5) => 'Ignoring unknown config option "' + e5 + '"', contextNotSpecified: function() {
  return "No context specified." + oe;
}, unrecoverableStreamError: (e5) => `Error on stream connection ${re(e5)}, giving up permanently`, wrongOptionType: (e5, t3, n3) => 'Config option "' + e5 + '" should be of type ' + t3 + ", got " + n3 + ", using default value", wrongOptionTypeBoolean: (e5, t3) => 'Config option "' + e5 + '" should be a boolean, got ' + t3 + ", converting to boolean" };
var { validateLogger: ae } = ne;
var se = { baseUrl: { default: "https://app.launchdarkly.com" }, streamUrl: { default: "https://clientstream.launchdarkly.com" }, eventsUrl: { default: "https://events.launchdarkly.com" }, sendEvents: { default: true }, streaming: { type: "boolean" }, sendLDHeaders: { default: true }, requestHeaderTransform: { type: "function" }, sendEventsOnlyForVariation: { default: false }, useReport: { default: false }, evaluationReasons: { default: false }, eventCapacity: { default: 100, minimum: 1 }, flushInterval: { default: 2e3, minimum: 2e3 }, samplingInterval: { default: 0, minimum: 0 }, streamReconnectDelay: { default: 1e3, minimum: 0 }, allAttributesPrivate: { default: false }, privateAttributes: { default: [] }, bootstrap: { type: "string|object" }, diagnosticRecordingInterval: { default: 9e5, minimum: 2e3 }, diagnosticOptOut: { default: false }, wrapperName: { type: "string" }, wrapperVersion: { type: "string" }, stateProvider: { type: "object" }, application: { validator: function(e5, t3, n3) {
  const r3 = {};
  t3.id && (r3.id = le(`${e5}.id`, t3.id, n3));
  t3.version && (r3.version = le(`${e5}.version`, t3.version, n3));
  return r3;
} }, inspectors: { default: [] }, hooks: { default: [] }, plugins: { default: [] } };
var ce = /^(\w|\.|-)+$/;
function ue(e5) {
  return e5 && e5.replace(/\/+$/, "");
}
function le(e5, t3, n3) {
  if ("string" == typeof t3 && t3.match(ce)) {
    if (!(t3.length > 64)) return t3;
    n3.warn(ie.tagValueTooLong(e5));
  } else n3.warn(ie.invalidTagValue(e5));
}
var de = { baseOptionDefs: se, validate: function(e5, t3, n3, r3) {
  const o3 = S.extend({ logger: { default: r3 } }, se, n3), i3 = {};
  function a3(e6) {
    S.onNextTick(() => {
      t3 && t3.maybeReportError(new s.LDInvalidArgumentError(e6));
    });
  }
  let c2 = S.extend({}, e5 || {});
  return function(e6) {
    const t4 = e6;
    Object.keys(i3).forEach((e7) => {
      if (void 0 !== t4[e7]) {
        const n4 = i3[e7];
        r3 && r3.warn(ie.deprecated(e7, n4)), n4 && (void 0 === t4[n4] && (t4[n4] = t4[e7]), delete t4[e7]);
      }
    });
  }(c2), c2 = function(e6) {
    const t4 = S.extend({}, e6);
    return Object.keys(o3).forEach((e7) => {
      void 0 !== t4[e7] && null !== t4[e7] || (t4[e7] = o3[e7] && o3[e7].default);
    }), t4;
  }(c2), c2 = function(e6) {
    const t4 = S.extend({}, e6), n4 = (e7) => {
      if (null === e7) return "any";
      if (void 0 === e7) return;
      if (Array.isArray(e7)) return "array";
      const t5 = typeof e7;
      return "boolean" === t5 || "string" === t5 || "number" === t5 || "function" === t5 ? t5 : "object";
    };
    return Object.keys(e6).forEach((i4) => {
      const s = e6[i4];
      if (null != s) {
        const c3 = o3[i4];
        if (void 0 === c3) a3(ie.unknownOption(i4));
        else {
          const o4 = c3.type || n4(c3.default), u2 = c3.validator;
          if (u2) {
            const n5 = u2(i4, e6[i4], r3);
            void 0 !== n5 ? t4[i4] = n5 : delete t4[i4];
          } else if ("any" !== o4) {
            const e7 = o4.split("|"), r4 = n4(s);
            e7.indexOf(r4) < 0 ? "boolean" === o4 ? (t4[i4] = !!s, a3(ie.wrongOptionTypeBoolean(i4, r4))) : (a3(ie.wrongOptionType(i4, o4, r4)), t4[i4] = c3.default) : "number" === r4 && void 0 !== c3.minimum && s < c3.minimum && (a3(ie.optionBelowMinimum(i4, s, c3.minimum)), t4[i4] = c3.minimum);
          }
        }
      }
    }), t4.baseUrl = ue(t4.baseUrl), t4.streamUrl = ue(t4.streamUrl), t4.eventsUrl = ue(t4.eventsUrl), t4;
  }(c2), ae(c2.logger), c2;
}, getTags: function(e5) {
  const t3 = {};
  return e5 && (e5.application && void 0 !== e5.application.id && null !== e5.application.id && (t3["application-id"] = [e5.application.id]), e5.application && void 0 !== e5.application.version && null !== e5.application.id && (t3["application-version"] = [e5.application.version])), t3;
} };
var { getLDUserAgentString: fe } = S;
var ge = { getLDHeaders: function(e5, t3) {
  if (t3 && !t3.sendLDHeaders) return {};
  const n3 = {};
  n3[e5.userAgentHeaderName || "User-Agent"] = fe(e5), t3 && t3.wrapperName && (n3["X-LaunchDarkly-Wrapper"] = t3.wrapperVersion ? t3.wrapperName + "/" + t3.wrapperVersion : t3.wrapperName);
  const r3 = de.getTags(t3), o3 = Object.keys(r3);
  return o3.length && (n3["x-launchdarkly-tags"] = o3.sort().map((e6) => Array.isArray(r3[e6]) ? r3[e6].sort().map((t4) => `${e6}/${t4}`) : [`${e6}/${r3[e6]}`]).reduce((e6, t4) => e6.concat(t4), []).join(" ")), n3;
}, transformHeaders: function(e5, t3) {
  return t3 && t3.requestHeaderTransform ? t3.requestHeaderTransform({ ...e5 }) : e5;
} };
var { v1: ve } = ee;
var { getLDHeaders: pe, transformHeaders: me } = ge;
var he = function(e5, t3, n3) {
  const r3 = S.extend({ "Content-Type": "application/json" }, pe(e5, n3)), o3 = {};
  return o3.sendEvents = (t4, o4, i3) => {
    if (!e5.httpRequest) return Promise.resolve();
    const a3 = JSON.stringify(t4), c2 = i3 ? null : ve();
    return function t5(u2) {
      const l2 = i3 ? r3 : S.extend({}, r3, { "X-LaunchDarkly-Event-Schema": "4", "X-LaunchDarkly-Payload-ID": c2 });
      return e5.httpRequest("POST", o4, me(l2, n3), a3).promise.then((e6) => {
        if (e6) return e6.status >= 400 && s.isHttpErrorRecoverable(e6.status) && u2 ? t5(false) : function(e7) {
          const t6 = { status: e7.status }, n4 = e7.header("date");
          if (n4) {
            const e8 = Date.parse(n4);
            e8 && (t6.serverTime = e8);
          }
          return t6;
        }(e6);
      }).catch(() => u2 ? t5(false) : Promise.reject());
    }(true).catch(() => {
    });
  }, o3;
};
var ye = function e3(t3, n3 = []) {
  if (null === t3 || "object" != typeof t3) return JSON.stringify(t3);
  if (n3.includes(t3)) throw new Error("Cycle detected");
  if (Array.isArray(t3)) {
    return `[${t3.map((r3) => e3(r3, [...n3, t3])).map((e5) => void 0 === e5 ? "null" : e5).join(",")}]`;
  }
  return `{${Object.keys(t3).sort().map((r3) => {
    const o3 = e3(t3[r3], [...n3, t3]);
    if (void 0 !== o3) return `${JSON.stringify(r3)}:${o3}`;
  }).filter((e5) => void 0 !== e5).join(",")}}`;
};
var { commonBasicLogger: we } = ne;
function be(e5) {
  return "string" == typeof e5 && "kind" !== e5 && e5.match(/^(\w|\.|-)+$/);
}
function ke(e5) {
  return e5.includes("%") || e5.includes(":") ? e5.replace(/%/g, "%25").replace(/:/g, "%3A") : e5;
}
var Ee = { checkContext: function(e5, t3) {
  if (e5) {
    if (t3 && (void 0 === e5.kind || null === e5.kind)) return void 0 !== e5.key && null !== e5.key;
    const n3 = e5.key, r3 = void 0 === e5.kind ? "user" : e5.kind, o3 = be(r3), i3 = "multi" === r3 || null != n3 && "" !== n3;
    if ("multi" === r3) {
      const t4 = Object.keys(e5).filter((e6) => "kind" !== e6);
      return i3 && t4.every((e6) => be(e6)) && t4.every((t5) => {
        const n4 = e5[t5].key;
        return null != n4 && "" !== n4;
      });
    }
    return i3 && o3;
  }
  return false;
}, getContextKeys: function(e5, t3 = we()) {
  if (!e5) return;
  const n3 = {}, { kind: r3, key: o3 } = e5;
  switch (r3) {
    case void 0:
      n3.user = `${o3}`;
      break;
    case "multi":
      Object.entries(e5).filter(([e6]) => "kind" !== e6).forEach(([e6, t4]) => {
        t4 && t4.key && (n3[e6] = t4.key);
      });
      break;
    case null:
      t3.warn(`null is not a valid context kind: ${e5}`);
      break;
    case "":
      t3.warn(`'' is not a valid context kind: ${e5}`);
      break;
    default:
      n3[r3] = `${o3}`;
  }
  return n3;
}, getContextKinds: function(e5) {
  return e5 ? null === e5.kind || void 0 === e5.kind ? ["user"] : "multi" !== e5.kind ? [e5.kind] : Object.keys(e5).filter((e6) => "kind" !== e6) : [];
}, getCanonicalKey: function(e5) {
  if (e5) {
    if ((void 0 === e5.kind || null === e5.kind || "user" === e5.kind) && e5.key) return e5.key;
    if ("multi" !== e5.kind && e5.key) return `${e5.kind}:${ke(e5.key)}`;
    if ("multi" === e5.kind) return Object.keys(e5).sort().filter((e6) => "kind" !== e6).map((t3) => `${t3}:${ke(e5[t3].key)}`).join(":");
  }
} };
var { getContextKinds: De } = Ee;
var xe = function() {
  const e5 = {};
  let t3 = 0, n3 = 0, r3 = {}, o3 = {};
  return e5.summarizeEvent = (e6) => {
    if ("feature" === e6.kind) {
      const i3 = e6.key + ":" + (null !== e6.variation && void 0 !== e6.variation ? e6.variation : "") + ":" + (null !== e6.version && void 0 !== e6.version ? e6.version : ""), a3 = r3[i3];
      let s = o3[e6.key];
      s || (s = /* @__PURE__ */ new Set(), o3[e6.key] = s), function(e7) {
        return e7.context ? De(e7.context) : e7.contextKeys ? Object.keys(e7.contextKeys) : [];
      }(e6).forEach((e7) => s.add(e7)), a3 ? a3.count = a3.count + 1 : r3[i3] = { count: 1, key: e6.key, version: e6.version, variation: e6.variation, value: e6.value, default: e6.default }, (0 === t3 || e6.creationDate < t3) && (t3 = e6.creationDate), e6.creationDate > n3 && (n3 = e6.creationDate);
    }
  }, e5.getSummary = () => {
    const e6 = {};
    let i3 = true;
    for (const t4 of Object.values(r3)) {
      let n4 = e6[t4.key];
      n4 || (n4 = { default: t4.default, counters: [], contextKinds: [...o3[t4.key]] }, e6[t4.key] = n4);
      const r4 = { value: t4.value, count: t4.count };
      void 0 !== t4.variation && null !== t4.variation && (r4.variation = t4.variation), void 0 !== t4.version && null !== t4.version ? r4.version = t4.version : r4.unknown = true, n4.counters.push(r4), i3 = false;
    }
    return i3 ? null : { startDate: t3, endDate: n3, features: e6, kind: "summary" };
  }, e5.clearSummary = () => {
    t3 = 0, n3 = 0, r3 = {}, o3 = {};
  }, e5;
};
var Ce = function(e5) {
  let t3 = {}, n3 = {};
  return { summarizeEvent: function(e6) {
    if ("feature" === e6.kind) {
      const r3 = ye(e6.context);
      if (!r3) return;
      let o3 = t3[r3];
      o3 || (t3[r3] = xe(), o3 = t3[r3], n3[r3] = e6.context), o3.summarizeEvent(e6);
    }
  }, getSummaries: function() {
    const r3 = t3, o3 = n3;
    return t3 = {}, n3 = {}, Object.entries(r3).map(([t4, n4]) => {
      const r4 = n4.getSummary();
      return r4.context = e5.filter(o3[t4]), r4;
    });
  } };
};
function Pe(e5) {
  return e5.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Se(e5) {
  return (e5.startsWith("/") ? e5.substring(1) : e5).split("/").map((e6) => e6.indexOf("~") >= 0 ? e6.replace(/~1/g, "/").replace(/~0/g, "~") : e6);
}
function Ie(e5) {
  return !e5.startsWith("/");
}
function Oe(e5, t3) {
  const n3 = Ie(e5), r3 = Ie(t3);
  if (n3 && r3) return e5 === t3;
  if (n3) {
    const n4 = Se(t3);
    return 1 === n4.length && e5 === n4[0];
  }
  if (r3) {
    const n4 = Se(e5);
    return 1 === n4.length && t3 === n4[0];
  }
  return e5 === t3;
}
function Te(e5) {
  return `/${Pe(e5)}`;
}
var Le = { cloneExcluding: function(e5, t3) {
  const n3 = [], r3 = {}, o3 = [];
  for (n3.push(...Object.keys(e5).map((t4) => ({ key: t4, ptr: Te(t4), source: e5, parent: r3, visited: [e5] }))); n3.length; ) {
    const e6 = n3.pop();
    if (t3.some((t4) => Oe(t4, e6.ptr))) o3.push(e6.ptr);
    else {
      const t4 = e6.source[e6.key];
      if (null === t4) e6.parent[e6.key] = t4;
      else if (Array.isArray(t4)) e6.parent[e6.key] = [...t4];
      else if ("object" == typeof t4) {
        if (e6.visited.includes(t4)) continue;
        e6.parent[e6.key] = {}, n3.push(...Object.keys(t4).map((n4) => {
          return { key: n4, ptr: (r4 = e6.ptr, o4 = Pe(n4), `${r4}/${o4}`), source: t4, parent: e6.parent[e6.key], visited: [...e6.visited, t4] };
          var r4, o4;
        }));
      } else e6.parent[e6.key] = t4;
    }
  }
  return { cloned: r3, excluded: o3.sort() };
}, compare: Oe, literalToReference: Te };
var Ue = function(e5) {
  const t3 = {}, n3 = e5.allAttributesPrivate, r3 = e5.privateAttributes || [], o3 = ["key", "kind", "_meta", "anonymous"], i3 = ["name", "ip", "firstName", "lastName", "email", "avatar", "country"], a3 = (e6, t4) => {
    if ("object" != typeof e6 || null === e6 || Array.isArray(e6)) return;
    const { cloned: i4, excluded: a4 } = Le.cloneExcluding(e6, ((e7, t5) => (n3 || t5 && e7.anonymous ? Object.keys(e7) : [...r3, ...e7._meta && e7._meta.privateAttributes || []]).filter((e8) => !o3.some((t6) => Le.compare(e8, t6))))(e6, t4));
    return i4.key = String(i4.key), a4.length && (i4._meta || (i4._meta = {}), i4._meta.redactedAttributes = a4), i4._meta && (delete i4._meta.privateAttributes, 0 === Object.keys(i4._meta).length && delete i4._meta), void 0 !== i4.anonymous && (i4.anonymous = !!i4.anonymous), i4;
  };
  return t3.filter = (e6, t4 = false) => void 0 === e6.kind || null === e6.kind ? a3(((e7) => {
    const t5 = { ...e7.custom || {}, kind: "user", key: e7.key };
    void 0 !== e7.anonymous && (t5.anonymous = !!e7.anonymous);
    for (const n4 of i3) delete t5[n4], void 0 !== e7[n4] && null !== e7[n4] && (t5[n4] = String(e7[n4]));
    return void 0 !== e7.privateAttributeNames && null !== e7.privateAttributeNames && (t5._meta = t5._meta || {}, t5._meta.privateAttributes = e7.privateAttributeNames.map((e8) => e8.startsWith("/") ? Le.literalToReference(e8) : e8)), t5;
  })(e6), t4) : "multi" === e6.kind ? ((e7, t5) => {
    const n4 = { kind: e7.kind }, r4 = Object.keys(e7);
    for (const o4 of r4) if ("kind" !== o4) {
      const r5 = a3(e7[o4], t5);
      r5 && (n4[o4] = r5);
    }
    return n4;
  })(e6, t4) : a3(e6, t4), t3;
};
var { getContextKeys: Ae } = Ee;
var je = function(e5, t3, n3, r3 = null, o3 = null, i3 = null) {
  const a3 = {}, c2 = i3 || he(e5, n3, t3), u2 = S.appendUrlPath(t3.eventsUrl, "/events/bulk/" + n3), l2 = Ue(t3), d2 = Ce(l2), f2 = t3.samplingInterval, g2 = t3.eventCapacity, v2 = t3.flushInterval, p2 = t3.logger;
  let m3, h3 = [], y3 = 0, w3 = false, b3 = false;
  function k3() {
    return 0 === f2 || 0 === Math.floor(Math.random() * f2);
  }
  function E3(e6) {
    const t4 = S.extend({}, e6);
    return "identify" === e6.kind || "feature" === e6.kind || "custom" === e6.kind ? t4.context = l2.filter(e6.context) : (t4.contextKeys = Ae(e6.context, p2), delete t4.context), "feature" === e6.kind && (delete t4.trackEvents, delete t4.debugEventsUntilDate), t4;
  }
  function D3(e6) {
    h3.length < g2 ? (h3.push(e6), b3 = false) : (b3 || (b3 = true, p2.warn(ie.eventCapacityExceeded())), r3 && r3.incrementDroppedEvents());
  }
  return a3.enqueue = function(e6) {
    if (w3) return;
    let t4 = false, n4 = false;
    var r4;
    if (d2.summarizeEvent(e6), "feature" === e6.kind ? k3() && (t4 = !!e6.trackEvents, n4 = !!(r4 = e6).debugEventsUntilDate && r4.debugEventsUntilDate > y3 && r4.debugEventsUntilDate > (/* @__PURE__ */ new Date()).getTime()) : t4 = k3(), t4 && D3(E3(e6)), n4) {
      const t5 = S.extend({}, e6, { kind: "debug" });
      t5.context = l2.filter(t5.context), delete t5.trackEvents, delete t5.debugEventsUntilDate, D3(t5);
    }
  }, a3.flush = async function() {
    if (w3) return Promise.resolve();
    const e6 = h3;
    return d2.getSummaries().forEach((t4) => {
      Object.keys(t4.features).length && e6.push(t4);
    }), r3 && r3.setEventsInLastBatch(e6.length), 0 === e6.length ? Promise.resolve() : (h3 = [], p2.debug(ie.debugPostingEvents(e6.length)), c2.sendEvents(e6, u2).then((e7) => {
      e7 && (e7.serverTime && (y3 = e7.serverTime), s.isHttpErrorRecoverable(e7.status) || (w3 = true), e7.status >= 400 && S.onNextTick(() => {
        o3.maybeReportError(new s.LDUnexpectedResponseError(ie.httpErrorMessage(e7.status, "event posting", "some events were dropped")));
      }));
    }));
  }, a3.start = function() {
    const e6 = () => {
      a3.flush(), m3 = setTimeout(e6, v2);
    };
    m3 = setTimeout(e6, v2);
  }, a3.stop = function() {
    clearTimeout(m3);
  }, a3;
};
var Re = function(e5) {
  const t3 = {}, n3 = {};
  return t3.on = function(e6, t4, r3) {
    n3[e6] = n3[e6] || [], n3[e6] = n3[e6].concat({ handler: t4, context: r3 });
  }, t3.off = function(e6, t4, r3) {
    if (n3[e6]) for (let o3 = 0; o3 < n3[e6].length; o3++) n3[e6][o3].handler === t4 && n3[e6][o3].context === r3 && (n3[e6] = n3[e6].slice(0, o3).concat(n3[e6].slice(o3 + 1)));
  }, t3.emit = function(e6) {
    if (!n3[e6]) return;
    const t4 = n3[e6].slice(0);
    for (let e7 = 0; e7 < t4.length; e7++) t4[e7].handler.apply(t4[e7].context, Array.prototype.slice.call(arguments, 1));
  }, t3.getEvents = function() {
    return Object.keys(n3);
  }, t3.getEventListenerCount = function(e6) {
    return n3[e6] ? n3[e6].length : 0;
  }, t3.maybeReportError = function(t4) {
    t4 && (n3["error"] ? this.emit("error", t4) : (e5 || console).error(t4.message));
  }, t3;
};
var Fe = "ready";
var Ne = "initialized";
var $e = "failed";
var Ve = function(e5) {
  let t3 = false, n3 = false, r3 = null, o3 = null;
  const i3 = new Promise((t4) => {
    const n4 = () => {
      e5.off(Fe, n4), t4();
    };
    e5.on(Fe, n4);
  }).catch(() => {
  });
  return { getInitializationPromise: () => o3 || (t3 ? Promise.resolve() : n3 ? Promise.reject(r3) : (o3 = new Promise((t4, n4) => {
    const r4 = () => {
      e5.off(Ne, r4), t4();
    }, o4 = (t5) => {
      e5.off($e, o4), n4(t5);
    };
    e5.on(Ne, r4), e5.on($e, o4);
  }), o3)), getReadyPromise: () => i3, signalSuccess: () => {
    t3 || n3 || (t3 = true, e5.emit(Ne), e5.emit(Fe));
  }, signalFailure: (o4) => {
    t3 || n3 || (n3 = true, r3 = o4, e5.emit($e, o4), e5.emit(Fe)), e5.maybeReportError(o4);
  } };
};
var He = function(e5, t3, n3, r3) {
  const o3 = {};
  function i3() {
    let e6 = "";
    const o4 = r3.getContext();
    return o4 && (e6 = n3 || S.btoa(JSON.stringify(o4))), "ld:" + t3 + ":" + e6;
  }
  return o3.loadFlags = () => e5.get(i3()).then((e6) => {
    if (null == e6) return null;
    try {
      let t4 = JSON.parse(e6);
      if (t4) {
        const e7 = t4.$schema;
        void 0 === e7 || e7 < 1 ? t4 = S.transformValuesToVersionedValues(t4) : delete t4.$schema;
      }
      return t4;
    } catch (e7) {
      return o3.clearFlags().then(() => null);
    }
  }), o3.saveFlags = (t4) => {
    const n4 = S.extend({}, t4, { $schema: 1 });
    return e5.set(i3(), JSON.stringify(n4));
  }, o3.clearFlags = () => e5.clear(i3()), o3;
};
var Me = function(e5, t3) {
  const n3 = {};
  let r3 = false;
  const o3 = (e6) => {
    r3 || (r3 = true, t3.warn(ie.localStorageUnavailable(e6)));
  };
  return n3.isEnabled = () => !!e5, n3.get = (t4) => new Promise((n4) => {
    e5 ? e5.get(t4).then(n4).catch((e6) => {
      o3(e6), n4(void 0);
    }) : n4(void 0);
  }), n3.set = (t4, n4) => new Promise((r4) => {
    e5 ? e5.set(t4, n4).then(() => r4(true)).catch((e6) => {
      o3(e6), r4(false);
    }) : r4(false);
  }), n3.clear = (t4) => new Promise((n4) => {
    e5 ? e5.clear(t4).then(() => n4(true)).catch((e6) => {
      o3(e6), n4(false);
    }) : n4(false);
  }), n3;
};
var { appendUrlPath: qe, base64URLEncode: ze, objectHasOwnProperty: Ke } = S;
var { getLDHeaders: _e, transformHeaders: Je } = ge;
var { isHttpErrorRecoverable: Be } = s;
var Ge = function(e5, t3, n3, r3) {
  const o3 = t3.streamUrl, i3 = t3.logger, a3 = {}, s = qe(o3, "/eval/" + n3), c2 = t3.useReport, u2 = t3.evaluationReasons, l2 = t3.streamReconnectDelay, d2 = _e(e5, t3);
  let f2, g2 = false, v2 = null, p2 = null, m3 = null, h3 = null, y3 = null, w3 = 0;
  function b3() {
    const e6 = (t4 = function() {
      const e7 = l2 * Math.pow(2, w3);
      return e7 > 3e4 ? 3e4 : e7;
    }(), t4 - Math.trunc(0.5 * Math.random() * t4));
    var t4;
    return w3 += 1, e6;
  }
  function k3(e6) {
    if (e6.status && "number" == typeof e6.status && !Be(e6.status)) return x3(), i3.error(ie.unrecoverableStreamError(e6)), void (p2 && (clearTimeout(p2), p2 = null));
    const t4 = b3();
    g2 || (i3.warn(ie.streamError(e6, t4)), g2 = true), C3(false), x3(), E3(t4);
  }
  function E3(e6) {
    p2 || (e6 ? p2 = setTimeout(D3, e6) : D3());
  }
  function D3() {
    let r4;
    p2 = null;
    let a4 = "";
    const l3 = { headers: d2, readTimeoutMillis: 3e5 };
    if (e5.eventSourceFactory) {
      null != h3 && (a4 = "h=" + h3), c2 ? e5.eventSourceAllowsReport ? (r4 = s, l3.method = "REPORT", l3.headers["Content-Type"] = "application/json", l3.body = JSON.stringify(m3)) : (r4 = qe(o3, "/ping/" + n3), a4 = "") : r4 = s + "/" + ze(JSON.stringify(m3)), l3.headers = Je(l3.headers, t3), u2 && (a4 = a4 + (a4 ? "&" : "") + "withReasons=true"), r4 = r4 + (a4 ? "?" : "") + a4, x3(), i3.info(ie.streamConnecting(r4)), f2 = (/* @__PURE__ */ new Date()).getTime(), v2 = e5.eventSourceFactory(r4, l3);
      for (const e6 in y3) Ke(y3, e6) && v2.addEventListener(e6, y3[e6]);
      v2.onerror = k3, v2.onopen = () => {
        w3 = 0;
      };
    }
  }
  function x3() {
    v2 && (i3.info(ie.streamClosing()), v2.close(), v2 = null);
  }
  function C3(e6) {
    f2 && r3 && r3.recordStreamInit(f2, !e6, (/* @__PURE__ */ new Date()).getTime() - f2), f2 = null;
  }
  return a3.connect = function(e6, t4, n4) {
    m3 = e6, h3 = t4, y3 = {};
    for (const e7 in n4 || {}) y3[e7] = function(t5) {
      g2 = false, C3(true), n4[e7] && n4[e7](t5);
    };
    E3();
  }, a3.disconnect = function() {
    clearTimeout(p2), p2 = null, x3();
  }, a3.isConnected = function() {
    return !!(v2 && e5.eventSourceIsActive && e5.eventSourceIsActive(v2));
  }, a3;
};
var We = function(e5) {
  let t3, n3, r3, o3;
  const i3 = { addPromise: (i4, a3) => {
    t3 = i4, n3 && n3(), n3 = a3, i4.then((n4) => {
      t3 === i4 && (r3(n4), e5 && e5());
    }, (n4) => {
      t3 === i4 && (o3(n4), e5 && e5());
    });
  } };
  return i3.resultPromise = new Promise((e6, t4) => {
    r3 = e6, o3 = t4;
  }), i3;
};
var { transformHeaders: Xe, getLDHeaders: Qe } = ge;
var Ye = "application/json";
var Ze = function(e5, t3, n3) {
  const r3 = t3.baseUrl, o3 = t3.useReport, i3 = t3.evaluationReasons, a3 = t3.logger, c2 = {}, u2 = {};
  function l2(n4, r4) {
    if (!e5.httpRequest) return new Promise((e6, t4) => {
      t4(new s.LDFlagFetchError(ie.httpUnavailable()));
    });
    const o4 = r4 ? "REPORT" : "GET", i4 = Qe(e5, t3);
    r4 && (i4["Content-Type"] = Ye);
    let a4 = u2[n4];
    a4 || (a4 = We(() => {
      delete u2[n4];
    }), u2[n4] = a4);
    const c3 = e5.httpRequest(o4, n4, Xe(i4, t3), r4), l3 = c3.promise.then((e6) => {
      if (200 === e6.status) {
        if (e6.header("content-type") && e6.header("content-type").substring(0, 16) === Ye) return JSON.parse(e6.body);
        {
          const t4 = ie.invalidContentType(e6.header("content-type") || "");
          return Promise.reject(new s.LDFlagFetchError(t4));
        }
      }
      return Promise.reject(function(e7) {
        return 404 === e7.status ? new s.LDInvalidEnvironmentIdError(ie.environmentNotFound()) : new s.LDFlagFetchError(ie.errorFetchingFlags(e7.statusText || String(e7.status)));
      }(e6));
    }, (e6) => Promise.reject(new s.LDFlagFetchError(ie.networkError(e6))));
    return a4.addPromise(l3, () => {
      c3.cancel && c3.cancel();
    }), a4.resultPromise;
  }
  return c2.fetchJSON = function(e6) {
    return l2(S.appendUrlPath(r3, e6), null);
  }, c2.fetchFlagSettings = function(e6, t4) {
    let s, c3, u3, d2 = "";
    return o3 ? (c3 = [r3, "/sdk/evalx/", n3, "/context"].join(""), u3 = JSON.stringify(e6)) : (s = S.base64URLEncode(JSON.stringify(e6)), c3 = [r3, "/sdk/evalx/", n3, "/contexts/", s].join("")), t4 && (d2 = "h=" + t4), i3 && (d2 = d2 + (d2 ? "&" : "") + "withReasons=true"), c3 = c3 + (d2 ? "?" : "") + d2, a3.debug(ie.debugPolling(c3)), l2(c3, u3);
  }, c2;
};
var et = function(e5, t3) {
  const n3 = {};
  let r3;
  return n3.setContext = function(e6) {
    r3 = S.sanitizeContext(e6), r3 && t3 && t3(S.clone(r3));
  }, n3.getContext = function() {
    return r3 ? S.clone(r3) : null;
  }, e5 && n3.setContext(e5), n3;
};
var { v1: tt } = ee;
var { getContextKinds: nt } = Ee;
var rt = function(e5) {
  function t3(e6) {
    return null == e6 || "user" === e6 ? "ld:$anonUserId" : `ld:$contextKey:${e6}`;
  }
  function n3(n4, r3) {
    return null !== r3.key && void 0 !== r3.key ? (r3.key = r3.key.toString(), Promise.resolve(r3)) : r3.anonymous ? function(n5) {
      return e5.get(t3(n5));
    }(n4).then((o3) => {
      if (o3) return r3.key = o3, r3;
      {
        const o4 = tt();
        return r3.key = o4, function(n5, r4) {
          return e5.set(t3(r4), n5);
        }(o4, n4).then(() => r3);
      }
    }) : Promise.reject(new s.LDInvalidUserError(ie.invalidContext()));
  }
  this.processContext = (e6) => {
    if (!e6) return Promise.reject(new s.LDInvalidUserError(ie.contextNotSpecified()));
    const t4 = S.clone(e6);
    if ("multi" === e6.kind) {
      const e7 = nt(t4);
      return Promise.all(e7.map((e8) => n3(e8, t4[e8]))).then(() => t4);
    }
    return n3(e6.kind, t4);
  };
};
var { v1: ot } = ee;
var { baseOptionDefs: it } = de;
var { appendUrlPath: at } = S;
var st = { DiagnosticId: function(e5) {
  const t3 = { diagnosticId: ot() };
  return e5 && (t3.sdkKeySuffix = e5.length > 6 ? e5.substring(e5.length - 6) : e5), t3;
}, DiagnosticsAccumulator: function(e5) {
  let t3, n3, r3, o3;
  function i3(e6) {
    t3 = e6, n3 = 0, r3 = 0, o3 = [];
  }
  return i3(e5), { getProps: () => ({ dataSinceDate: t3, droppedEvents: n3, eventsInLastBatch: r3, streamInits: o3 }), setProps: (e6) => {
    t3 = e6.dataSinceDate, n3 = e6.droppedEvents || 0, r3 = e6.eventsInLastBatch || 0, o3 = e6.streamInits || [];
  }, incrementDroppedEvents: () => {
    n3++;
  }, setEventsInLastBatch: (e6) => {
    r3 = e6;
  }, recordStreamInit: (e6, t4, n4) => {
    const r4 = { timestamp: e6, failed: t4, durationMillis: n4 };
    o3.push(r4);
  }, reset: i3 };
}, DiagnosticsManager: function(e5, t3, n3, r3, o3, i3, a3) {
  const s = !!e5.diagnosticUseCombinedEvent, c2 = "ld:" + o3 + ":$diagnostics", u2 = at(i3.eventsUrl, "/events/diagnostic/" + o3), l2 = i3.diagnosticRecordingInterval, d2 = n3;
  let f2, g2, v2 = !!i3.streaming;
  const p2 = {};
  function m3() {
    return { sdk: w3(), configuration: b3(), platform: e5.diagnosticPlatformData };
  }
  function h3(e6) {
    i3.logger && i3.logger.debug(ie.debugPostingDiagnosticEvent(e6)), r3.sendEvents(e6, u2, true).then(() => {
    }).catch(() => {
    });
  }
  function y3() {
    h3(function() {
      const e6 = (/* @__PURE__ */ new Date()).getTime();
      let t4 = { kind: s ? "diagnostic-combined" : "diagnostic", id: a3, creationDate: e6, ...d2.getProps() };
      return s && (t4 = { ...t4, ...m3() }), d2.reset(e6), t4;
    }()), g2 = setTimeout(y3, l2), f2 = (/* @__PURE__ */ new Date()).getTime(), s && function() {
      if (t3.isEnabled()) {
        const e6 = { ...d2.getProps() };
        t3.set(c2, JSON.stringify(e6));
      }
    }();
  }
  function w3() {
    const t4 = { ...e5.diagnosticSdkData };
    return i3.wrapperName && (t4.wrapperName = i3.wrapperName), i3.wrapperVersion && (t4.wrapperVersion = i3.wrapperVersion), t4;
  }
  function b3() {
    return { customBaseURI: i3.baseUrl !== it.baseUrl.default, customStreamURI: i3.streamUrl !== it.streamUrl.default, customEventsURI: i3.eventsUrl !== it.eventsUrl.default, eventsCapacity: i3.eventCapacity, eventsFlushIntervalMillis: i3.flushInterval, reconnectTimeMillis: i3.streamReconnectDelay, streamingDisabled: !v2, allAttributesPrivate: !!i3.allAttributesPrivate, diagnosticRecordingIntervalMillis: i3.diagnosticRecordingInterval, usingSecureMode: !!i3.hash, bootstrapMode: !!i3.bootstrap, fetchGoalsDisabled: !i3.fetchGoals, sendEventsOnlyForVariation: !!i3.sendEventsOnlyForVariation };
  }
  return p2.start = () => {
    s ? function(e6) {
      if (!t3.isEnabled()) return e6(false);
      t3.get(c2).then((t4) => {
        if (t4) try {
          const e7 = JSON.parse(t4);
          d2.setProps(e7), f2 = e7.dataSinceDate;
        } catch (e7) {
        }
        e6(true);
      }).catch(() => {
        e6(false);
      });
    }((e6) => {
      if (e6) {
        const e7 = (f2 || 0) + l2, t4 = (/* @__PURE__ */ new Date()).getTime();
        t4 >= e7 ? y3() : g2 = setTimeout(y3, e7 - t4);
      } else 0 === Math.floor(4 * Math.random()) ? y3() : g2 = setTimeout(y3, l2);
    }) : (h3({ kind: "diagnostic-init", id: a3, creationDate: d2.getProps().dataSinceDate, ...m3() }), g2 = setTimeout(y3, l2));
  }, p2.stop = () => {
    g2 && clearTimeout(g2);
  }, p2.setStreaming = (e6) => {
    v2 = e6;
  }, p2;
} };
var ct = function(e5, t3) {
  let n3 = false;
  const r3 = { type: e5.type, name: e5.name, synchronous: e5.synchronous, method: (...o3) => {
    try {
      e5.method(...o3);
    } catch {
      n3 || (n3 = true, t3.warn(ie.inspectorMethodError(r3.type, r3.name)));
    }
  } };
  return r3;
};
var { onNextTick: ut } = S;
var lt = { flagUsed: "flag-used", flagDetailsChanged: "flag-details-changed", flagDetailChanged: "flag-detail-changed", clientIdentityChanged: "client-identity-changed" };
Object.freeze(lt);
var dt = { InspectorTypes: lt, InspectorManager: function(e5, t3) {
  const n3 = {}, r3 = { [lt.flagUsed]: [], [lt.flagDetailsChanged]: [], [lt.flagDetailChanged]: [], [lt.clientIdentityChanged]: [] }, o3 = { [lt.flagUsed]: [], [lt.flagDetailsChanged]: [], [lt.flagDetailChanged]: [], [lt.clientIdentityChanged]: [] }, i3 = e5 && e5.map((e6) => ct(e6, t3));
  return i3 && i3.forEach((e6) => {
    Object.prototype.hasOwnProperty.call(r3, e6.type) && !e6.synchronous ? r3[e6.type].push(e6) : Object.prototype.hasOwnProperty.call(o3, e6.type) && e6.synchronous ? o3[e6.type].push(e6) : t3.warn(ie.invalidInspector(e6.type, e6.name));
  }), n3.hasListeners = (e6) => r3[e6] && r3[e6].length || o3[e6] && o3[e6].length, n3.onFlagUsed = (e6, t4, n4) => {
    const i4 = lt.flagUsed;
    o3[i4].length && o3[i4].forEach((r4) => r4.method(e6, t4, n4)), r3[i4].length && ut(() => {
      r3[i4].forEach((r4) => r4.method(e6, t4, n4));
    });
  }, n3.onFlags = (e6) => {
    const t4 = lt.flagDetailsChanged;
    o3[t4].length && o3[t4].forEach((t5) => t5.method(e6)), r3[t4].length && ut(() => {
      r3[t4].forEach((t5) => t5.method(e6));
    });
  }, n3.onFlagChanged = (e6, t4) => {
    const n4 = lt.flagDetailChanged;
    o3[n4].length && o3[n4].forEach((n5) => n5.method(e6, t4)), r3[n4].length && ut(() => {
      r3[n4].forEach((n5) => n5.method(e6, t4));
    });
  }, n3.onIdentityChanged = (e6) => {
    const t4 = lt.clientIdentityChanged;
    o3[t4].length && o3[t4].forEach((t5) => t5.method(e6)), r3[t4].length && ut(() => {
      r3[t4].forEach((t5) => t5.method(e6));
    });
  }, n3;
} };
var { LDTimeoutError: ft } = s;
var gt = function(e5, t3) {
  return new Promise((n3, r3) => {
    setTimeout(() => {
      r3(new ft(`${t3} timed out after ${e5} seconds.`));
    }, 1e3 * e5);
  });
};
var vt = "unknown hook";
function pt(e5, t3, n3, r3, o3) {
  try {
    return r3();
  } catch (r4) {
    return e5 == null ? void 0 : e5.error(`An error was encountered in "${t3}" of the "${n3}" hook: ${r4}`), o3;
  }
}
function mt(e5, t3) {
  try {
    return t3.getMetadata().name || vt;
  } catch {
    return e5.error("Exception thrown getting metadata for hook. Unable to get hook name."), vt;
  }
}
var ht = function(e5, t3) {
  const n3 = t3 ? [...t3] : [];
  return { withEvaluation: function(t4, r3, o3, i3) {
    if (0 === n3.length) return i3();
    const a3 = [...n3], s = { flagKey: t4, context: r3, defaultValue: o3 }, c2 = function(e6, t5, n4) {
      return t5.map((t6) => pt(e6, "beforeEvaluation", mt(e6, t6), () => {
        var _a;
        return ((_a = t6 == null ? void 0 : t6.beforeEvaluation) == null ? void 0 : _a.call(t6, n4, {})) ?? {};
      }, {}));
    }(e5, a3, s), u2 = i3();
    return function(e6, t5, n4, r4, o4) {
      for (let i4 = t5.length - 1; i4 >= 0; i4 -= 1) {
        const a4 = t5[i4], s2 = r4[i4];
        pt(e6, "afterEvaluation", mt(e6, a4), () => {
          var _a;
          return ((_a = a4 == null ? void 0 : a4.afterEvaluation) == null ? void 0 : _a.call(a4, n4, s2, o4)) ?? {};
        }, {});
      }
    }(e5, a3, s, c2, u2), u2;
  }, identify: function(t4, r3) {
    const o3 = [...n3], i3 = { context: t4, timeout: r3 }, a3 = function(e6, t5, n4) {
      return t5.map((t6) => pt(e6, "beforeIdentify", mt(e6, t6), () => {
        var _a;
        return ((_a = t6 == null ? void 0 : t6.beforeIdentify) == null ? void 0 : _a.call(t6, n4, {})) ?? {};
      }, {}));
    }(e5, o3, i3);
    return (t5) => {
      !function(e6, t6, n4, r4, o4) {
        for (let i4 = t6.length - 1; i4 >= 0; i4 -= 1) {
          const a4 = t6[i4], s = r4[i4];
          pt(e6, "afterIdentify", mt(e6, a4), () => {
            var _a;
            return ((_a = a4 == null ? void 0 : a4.afterIdentify) == null ? void 0 : _a.call(a4, n4, s, o4)) ?? {};
          }, {});
        }
      }(e5, o3, i3, a3, t5);
    };
  }, addHook: function(e6) {
    n3.push(e6);
  }, afterTrack: function(t4) {
    if (0 === n3.length) return;
    const r3 = [...n3];
    !function(e6, t5, n4) {
      for (let r4 = t5.length - 1; r4 >= 0; r4 -= 1) {
        const o3 = t5[r4];
        pt(e6, "afterTrack", mt(e6, o3), () => {
          var _a;
          return (_a = o3 == null ? void 0 : o3.afterTrack) == null ? void 0 : _a.call(o3, n4);
        }, void 0);
      }
    }(e5, r3, t4);
  } };
};
var yt = "unknown plugin";
function wt(e5, t3) {
  try {
    return t3.getMetadata().name || yt;
  } catch (t4) {
    return e5.error("Exception thrown getting metadata for plugin. Unable to get plugin name."), yt;
  }
}
var bt = { getPluginHooks: function(e5, t3, n3) {
  const r3 = [];
  return n3.forEach((n4) => {
    var _a;
    try {
      const o3 = (_a = n4.getHooks) == null ? void 0 : _a.call(n4, t3);
      void 0 === o3 ? e5.error(`Plugin ${wt(e5, n4)} returned undefined from getHooks.`) : o3 && o3.length > 0 && r3.push(...o3);
    } catch (t4) {
      e5.error(`Exception thrown getting hooks for plugin ${wt(e5, n4)}. Unable to get hooks.`);
    }
  }), r3;
}, registerPlugins: function(e5, t3, n3, r3) {
  r3.forEach((r4) => {
    try {
      r4.register(n3, t3);
    } catch (t4) {
      e5.error(`Exception thrown registering plugin ${wt(e5, r4)}.`);
    }
  });
}, createPluginEnvironment: function(e5, t3, n3) {
  const r3 = {};
  e5.userAgent && (r3.name = e5.userAgent), e5.version && (r3.version = e5.version), n3.wrapperName && (r3.wrapperName = n3.wrapperName), n3.wrapperVersion && (r3.wrapperVersion = n3.wrapperVersion);
  const o3 = {};
  n3.application && (n3.application.name && (o3.name = n3.application.name), n3.application.version && (o3.version = n3.application.version));
  const i3 = { sdk: r3, clientSideId: t3 };
  return Object.keys(o3).length > 0 && (i3.application = o3), i3;
} };
var { commonBasicLogger: kt } = ne;
var { checkContext: Et, getContextKeys: Dt } = Ee;
var { InspectorTypes: xt, InspectorManager: Ct } = dt;
var { getPluginHooks: Pt, registerPlugins: St, createPluginEnvironment: It } = bt;
var Ot = "change";
var Tt = "internal-change";
var Lt = { initialize: function(e5, t3, n3, r3, o3) {
  const i3 = function() {
    if (n3 && n3.logger) return n3.logger;
    return o3 && o3.logger && o3.logger.default || kt("warn");
  }(), a3 = Re(i3), c2 = Ve(a3), u2 = de.validate(n3, a3, o3, i3), l2 = Ct(u2.inspectors, i3), d2 = u2.sendEvents;
  let f2 = e5, g2 = u2.hash;
  const v2 = [...u2.plugins], p2 = It(r3, e5, u2), m3 = Pt(i3, p2, v2), h3 = ht(i3, [...u2.hooks, ...m3]), y3 = Me(r3.localStorage, i3), w3 = he(r3, f2, u2), b3 = u2.sendEvents && !u2.diagnosticOptOut, k3 = b3 ? st.DiagnosticId(f2) : null, E3 = b3 ? st.DiagnosticsAccumulator((/* @__PURE__ */ new Date()).getTime()) : null, D3 = b3 ? st.DiagnosticsManager(r3, y3, E3, w3, f2, u2, k3) : null, x3 = Ge(r3, u2, f2, E3), C3 = u2.eventProcessor || je(r3, u2, f2, E3, a3, w3), P3 = Ze(r3, u2, f2);
  let I3, O3, T3, L3 = {}, U2 = u2.streaming, A2 = false, j2 = false, R2 = true;
  const F3 = u2.stateProvider, N3 = et(null, function(e6) {
    (function(e7) {
      if (F3) return;
      e7 && H3({ kind: "identify", context: e7, creationDate: (/* @__PURE__ */ new Date()).getTime() });
    })(e6), l2.hasListeners(xt.clientIdentityChanged) && l2.onIdentityChanged(N3.getContext());
  }), $3 = new rt(y3), V3 = y3.isEnabled() ? He(y3, f2, g2, N3) : null;
  function H3(e6) {
    f2 && (F3 && F3.enqueueEvent && F3.enqueueEvent(e6) || (e6.context ? (R2 = false, !d2 || j2 || r3.isDoNotTrack() || (i3.debug(ie.debugEnqueueingEvent(e6.kind)), C3.enqueue(e6))) : R2 && (i3.warn(ie.eventWithoutContext()), R2 = false)));
  }
  function M3(e6, t4) {
    l2.hasListeners(xt.flagDetailChanged) && l2.onFlagChanged(e6.key, J3(t4));
  }
  function q3() {
    l2.hasListeners(xt.flagDetailsChanged) && l2.onFlags(Object.entries(L3).map(([e6, t4]) => ({ key: e6, detail: J3(t4) })).reduce((e6, t4) => (e6[t4.key] = t4.detail, e6), {}));
  }
  function z3(e6, t4, n4, r4) {
    const o4 = N3.getContext(), i4 = /* @__PURE__ */ new Date(), a4 = { kind: "feature", key: e6, context: o4, value: t4 ? t4.value : null, variation: t4 ? t4.variationIndex : null, default: n4, creationDate: i4.getTime() }, s = L3[e6];
    s && (a4.version = s.flagVersion ? s.flagVersion : s.version, a4.trackEvents = s.trackEvents, a4.debugEventsUntilDate = s.debugEventsUntilDate), (r4 || s && s.trackReason) && t4 && (a4.reason = t4.reason), H3(a4);
  }
  function K3(e6) {
    return Et(e6, false) ? Promise.resolve(e6) : Promise.reject(new s.LDInvalidUserError(ie.invalidContext()));
  }
  function _3(e6, t4, n4, r4, o4, i4) {
    var _a;
    let a4, s;
    return L3 && S.objectHasOwnProperty(L3, e6) && L3[e6] && !L3[e6].deleted ? (s = L3[e6], a4 = J3(s), null !== s.value && void 0 !== s.value || (a4.value = t4)) : a4 = { value: t4, variationIndex: null, reason: { kind: "ERROR", errorKind: "FLAG_NOT_FOUND" } }, n4 && (o4 || ((_a = s == null ? void 0 : s.prerequisites) == null ? void 0 : _a.forEach((e7) => {
      _3(e7, void 0, n4, false, false, false);
    })), z3(e6, a4, t4, r4)), !o4 && i4 && function(e7, t5) {
      l2.hasListeners(xt.flagUsed) && l2.onFlagUsed(e7, t5, N3.getContext());
    }(e6, a4), a4;
  }
  function J3(e6) {
    return { value: e6.value, variationIndex: void 0 === e6.variation ? null : e6.variation, reason: e6.reason || null };
  }
  function B3() {
    if (O3 = true, !N3.getContext()) return;
    const e6 = (e7) => {
      try {
        return JSON.parse(e7);
      } catch (e8) {
        return void a3.maybeReportError(new s.LDInvalidDataError(ie.invalidData()));
      }
    };
    x3.connect(N3.getContext(), g2, { ping: function() {
      i3.debug(ie.debugStreamPing());
      const e7 = N3.getContext();
      P3.fetchFlagSettings(e7, g2).then((t4) => {
        S.deepEquals(e7, N3.getContext()) && W3(t4 || {});
      }).catch((e8) => {
        a3.maybeReportError(new s.LDFlagFetchError(ie.errorFetchingFlags(e8)));
      });
    }, put: function(t4) {
      const n4 = e6(t4.data);
      n4 && (i3.debug(ie.debugStreamPut()), W3(n4));
    }, patch: function(t4) {
      const n4 = e6(t4.data);
      if (!n4) return;
      const r4 = L3[n4.key];
      if (!r4 || !r4.version || !n4.version || r4.version < n4.version) {
        i3.debug(ie.debugStreamPatch(n4.key));
        const e7 = {}, t5 = S.extend({}, n4);
        delete t5.key, L3[n4.key] = t5;
        const o4 = J3(t5);
        e7[n4.key] = r4 ? { previous: r4.value, current: o4 } : { current: o4 }, M3(n4, t5), X3(e7);
      } else i3.debug(ie.debugStreamPatchIgnored(n4.key));
    }, delete: function(t4) {
      const n4 = e6(t4.data);
      if (n4) if (!L3[n4.key] || L3[n4.key].version < n4.version) {
        i3.debug(ie.debugStreamDelete(n4.key));
        const e7 = {};
        L3[n4.key] && !L3[n4.key].deleted && (e7[n4.key] = { previous: L3[n4.key].value }), L3[n4.key] = { version: n4.version, deleted: true }, M3(n4, L3[n4.key]), X3(e7);
      } else i3.debug(ie.debugStreamDeleteIgnored(n4.key));
    } });
  }
  function G3() {
    O3 && (x3.disconnect(), O3 = false);
  }
  function W3(e6) {
    const t4 = {};
    if (!e6) return Promise.resolve();
    for (const n4 in L3) S.objectHasOwnProperty(L3, n4) && L3[n4] && (e6[n4] && !S.deepEquals(e6[n4].value, L3[n4].value) ? t4[n4] = { previous: L3[n4].value, current: J3(e6[n4]) } : e6[n4] && !e6[n4].deleted || (t4[n4] = { previous: L3[n4].value }));
    for (const n4 in e6) S.objectHasOwnProperty(e6, n4) && e6[n4] && (!L3[n4] || L3[n4].deleted) && (t4[n4] = { current: J3(e6[n4]) });
    return L3 = { ...e6 }, q3(), X3(t4).catch(() => {
    });
  }
  function X3(e6) {
    const t4 = Object.keys(e6);
    if (t4.length > 0) {
      const n4 = {};
      t4.forEach((t5) => {
        const r4 = e6[t5].current, o4 = r4 ? r4.value : void 0, i4 = e6[t5].previous;
        a3.emit(Ot + ":" + t5, o4, i4), n4[t5] = r4 ? { current: o4, previous: i4 } : { previous: i4 };
      }), a3.emit(Ot, n4), a3.emit(Tt, L3), u2.sendEventsOnlyForVariation || F3 || t4.forEach((t5) => {
        z3(t5, e6[t5].current);
      });
    }
    return I3 && V3 ? V3.saveFlags(L3) : Promise.resolve();
  }
  function Q3() {
    const e6 = U2 || T3 && void 0 === U2;
    e6 && !O3 ? B3() : !e6 && O3 && G3(), D3 && D3.setStreaming(e6);
  }
  function Y3(e6) {
    return e6 === Ot || e6.substr(0, 7) === Ot + ":";
  }
  if ("string" == typeof u2.bootstrap && "LOCALSTORAGE" === u2.bootstrap.toUpperCase() && (V3 ? I3 = true : i3.warn(ie.localStorageUnavailable())), "object" == typeof u2.bootstrap && (L3 = function(e6) {
    const t4 = Object.keys(e6), n4 = "$flagsState", r4 = "$valid", o4 = e6[n4];
    !o4 && t4.length && i3.warn(ie.bootstrapOldFormat()), false === e6[r4] && i3.warn(ie.bootstrapInvalid());
    const a4 = {};
    return t4.forEach((t5) => {
      if (t5 !== n4 && t5 !== r4) {
        let n5 = { value: e6[t5] };
        o4 && o4[t5] ? n5 = S.extend(n5, o4[t5]) : n5.version = 0, a4[t5] = n5;
      }
    }), a4;
  }(u2.bootstrap)), F3) {
    const e6 = F3.getInitialState();
    e6 ? Z3(e6) : F3.on("init", Z3), F3.on("update", function(e7) {
      e7.context && N3.setContext(e7.context);
      e7.flags && W3(e7.flags);
    });
  } else (function() {
    if (!e5) return Promise.reject(new s.LDInvalidEnvironmentIdError(ie.environmentNotSpecified()));
    let n4;
    return $3.processContext(t3).then(K3).then((e6) => (n4 = S.once(h3.identify(e6, void 0)), e6)).then((e6) => (n4 == null ? void 0 : n4({ status: "completed" }), N3.setContext(e6), "object" == typeof u2.bootstrap ? ee3() : I3 ? V3.loadFlags().then((e7) => null == e7 ? (L3 = {}, P3.fetchFlagSettings(N3.getContext(), g2).then((e8) => W3(e8 || {})).then(ee3).catch((e8) => {
      te3(new s.LDFlagFetchError(ie.errorFetchingFlags(e8)));
    })) : (L3 = e7, S.onNextTick(ee3), P3.fetchFlagSettings(N3.getContext(), g2).then((e8) => W3(e8)).catch((e8) => a3.maybeReportError(e8)))) : P3.fetchFlagSettings(N3.getContext(), g2).then((e7) => {
      L3 = e7 || {}, q3(), ee3();
    }).catch((e7) => {
      L3 = {}, te3(e7);
    }))).catch((e6) => {
      throw n4 == null ? void 0 : n4({ status: "error" }), e6;
    });
  })().catch(te3);
  function Z3(e6) {
    f2 = e6.environment, N3.setContext(e6.context), L3 = { ...e6.flags }, S.onNextTick(ee3);
  }
  function ee3() {
    i3.info(ie.clientInitialized()), A2 = true, Q3(), c2.signalSuccess();
  }
  function te3(e6) {
    c2.signalFailure(e6);
  }
  const ne3 = { waitForInitialization: function(e6 = void 0) {
    if (null != e6) {
      if ("number" == typeof e6) return function(e7) {
        e7 > 5 && i3.warn("The waitForInitialization function was called with a timeout greater than 5 seconds. We recommend a timeout of 5 seconds or less.");
        const t4 = c2.getInitializationPromise(), n4 = gt(e7, "waitForInitialization");
        return Promise.race([n4, t4]).catch((e8) => {
          throw e8 instanceof s.LDTimeoutError && i3.error(`waitForInitialization error: ${e8}`), e8;
        });
      }(e6);
      i3.warn("The waitForInitialization method was provided with a non-numeric timeout.");
    }
    return i3.warn("The waitForInitialization function was called without a timeout specified. In a future version a default timeout will be applied."), c2.getInitializationPromise();
  }, waitUntilReady: () => c2.getReadyPromise(), identify: function(e6, t4, n4) {
    if (j2) return S.wrapPromiseCallback(Promise.resolve({}), n4);
    if (F3) return i3.warn(ie.identifyDisabled()), S.wrapPromiseCallback(Promise.resolve(S.transformVersionedValuesToValues(L3)), n4);
    let r4;
    const o4 = I3 && V3 ? V3.clearFlags() : Promise.resolve();
    return S.wrapPromiseCallback(o4.then(() => $3.processContext(e6)).then(K3).then((e7) => (r4 = S.once(h3.identify(e7, void 0)), e7)).then((e7) => P3.fetchFlagSettings(e7, t4).then((n5) => {
      const r5 = S.transformVersionedValuesToValues(n5);
      return N3.setContext(e7), g2 = t4, n5 ? W3(n5).then(() => r5) : r5;
    })).then((e7) => (r4 == null ? void 0 : r4({ status: "completed" }), O3 && B3(), e7)).catch((e7) => (r4 == null ? void 0 : r4({ status: "error" }), a3.maybeReportError(e7), Promise.reject(e7))), n4);
  }, getContext: function() {
    return N3.getContext();
  }, variation: function(e6, t4) {
    const { value: n4 } = h3.withEvaluation(e6, N3.getContext(), t4, () => _3(e6, t4, true, false, false, true));
    return n4;
  }, variationDetail: function(e6, t4) {
    return h3.withEvaluation(e6, N3.getContext(), t4, () => _3(e6, t4, true, true, false, true));
  }, track: function(e6, t4, n4) {
    if ("string" != typeof e6) return void a3.maybeReportError(new s.LDInvalidEventKeyError(ie.unknownCustomEventKey(e6)));
    void 0 !== n4 && "number" != typeof n4 && i3.warn(ie.invalidMetricValue(typeof n4)), r3.customEventFilter && !r3.customEventFilter(e6) && i3.warn(ie.unknownCustomEventKey(e6));
    const o4 = N3.getContext(), c3 = { kind: "custom", key: e6, context: o4, url: r3.getCurrentUrl(), creationDate: (/* @__PURE__ */ new Date()).getTime() };
    o4 && o4.anonymous && (c3.contextKind = o4.anonymous ? "anonymousUser" : "user"), null != t4 && (c3.data = t4), null != n4 && (c3.metricValue = n4), H3(c3), h3.afterTrack({ context: o4, key: e6, data: t4, metricValue: n4 });
  }, on: function(e6, t4, n4) {
    Y3(e6) ? (T3 = true, A2 && Q3(), a3.on(e6, t4, n4)) : a3.on(...arguments);
  }, off: function(e6) {
    if (a3.off(...arguments), Y3(e6)) {
      let e7 = false;
      a3.getEvents().forEach((t4) => {
        Y3(t4) && a3.getEventListenerCount(t4) > 0 && (e7 = true);
      }), e7 || (T3 = false, O3 && void 0 === U2 && G3());
    }
  }, setStreaming: function(e6) {
    const t4 = null === e6 ? void 0 : e6;
    t4 !== U2 && (U2 = t4, Q3());
  }, flush: function(e6) {
    return S.wrapPromiseCallback(d2 ? C3.flush() : Promise.resolve(), e6);
  }, allFlags: function() {
    const e6 = {};
    if (!L3) return e6;
    for (const t4 in L3) S.objectHasOwnProperty(L3, t4) && !L3[t4].deleted && (e6[t4] = _3(t4, null, !u2.sendEventsOnlyForVariation, false, true, false).value);
    return e6;
  }, close: function(e6) {
    if (j2) return S.wrapPromiseCallback(Promise.resolve(), e6);
    const t4 = () => {
      j2 = true, L3 = {};
    }, n4 = Promise.resolve().then(() => {
      if (G3(), D3 && D3.stop(), d2) return C3.stop(), C3.flush();
    }).then(t4).catch(t4);
    return S.wrapPromiseCallback(n4, e6);
  }, addHook: function(e6) {
    h3.addHook(e6);
  } };
  return St(i3, p2, ne3, v2), { client: ne3, options: u2, emitter: a3, ident: N3, logger: i3, requestor: P3, start: function() {
    d2 && (D3 && D3.start(), C3.start());
  }, enqueueEvent: H3, getFlagsInternal: function() {
    return L3;
  }, getEnvironmentId: () => f2, internalChangeEventName: Tt };
}, commonBasicLogger: kt, errors: s, messages: ie, utils: S, getContextKeys: Dt };
var Ut = Lt.initialize;
var At = Lt.errors;
var jt = Lt.messages;
function Rt(e5, t3, n3) {
  return (t3 = function(e6) {
    var t4 = function(e7, t5) {
      if ("object" != typeof e7 || !e7) return e7;
      var n4 = e7[Symbol.toPrimitive];
      if (void 0 !== n4) {
        var r3 = n4.call(e7, t5 || "default");
        if ("object" != typeof r3) return r3;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === t5 ? String : Number)(e7);
    }(e6, "string");
    return "symbol" == typeof t4 ? t4 : t4 + "";
  }(t3)) in e5 ? Object.defineProperty(e5, t3, { value: n3, enumerable: true, configurable: true, writable: true }) : e5[t3] = n3, e5;
}
function Ft(e5, t3) {
  var n3 = Object.keys(e5);
  if (Object.getOwnPropertySymbols) {
    var r3 = Object.getOwnPropertySymbols(e5);
    t3 && (r3 = r3.filter(function(t4) {
      return Object.getOwnPropertyDescriptor(e5, t4).enumerable;
    })), n3.push.apply(n3, r3);
  }
  return n3;
}
function Nt(e5) {
  for (var t3 = 1; t3 < arguments.length; t3++) {
    var n3 = null != arguments[t3] ? arguments[t3] : {};
    t3 % 2 ? Ft(Object(n3), true).forEach(function(t4) {
      Rt(e5, t4, n3[t4]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e5, Object.getOwnPropertyDescriptors(n3)) : Ft(Object(n3)).forEach(function(t4) {
      Object.defineProperty(e5, t4, Object.getOwnPropertyDescriptor(n3, t4));
    });
  }
  return e5;
}
var $t = Lt.commonBasicLogger;
var Vt = function(e5) {
  return $t(Nt({ destination: console.log }, e5));
};
var Ht = { promise: Promise.resolve({ status: 200, header: function() {
  return null;
}, body: null }) };
function Mt(e5, t3, n3, r3, o3) {
  if (o3 && !function() {
    var e6 = window.navigator && window.navigator.userAgent;
    if (e6) {
      var t4 = e6.match(/Chrom(e|ium)\/([0-9]+)\./);
      if (t4) return parseInt(t4[2], 10) < 73;
    }
    return true;
  }()) return Ht;
  var i3 = new window.XMLHttpRequest();
  for (var a3 in i3.open(e5, t3, !o3), n3 || {}) Object.prototype.hasOwnProperty.call(n3, a3) && i3.setRequestHeader(a3, n3[a3]);
  if (o3) {
    try {
      i3.send(r3);
    } catch (e6) {
    }
    return Ht;
  }
  var s, c2 = new Promise(function(e6, t4) {
    i3.addEventListener("load", function() {
      s || e6({ status: i3.status, header: function(e7) {
        return i3.getResponseHeader(e7);
      }, body: i3.responseText });
    }), i3.addEventListener("error", function() {
      s || t4(new Error());
    }), i3.send(r3);
  });
  return { promise: c2, cancel: function() {
    s = true, i3.abort();
  } };
}
var qt = (e5) => {
  if ("string" != typeof e5) throw new TypeError("Expected a string");
  return e5.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
};
function zt(e5, t3, n3, r3) {
  var o3, i3, a3 = (("substring" === e5.kind || "regex" === e5.kind) && r3.includes("/") ? t3 : t3.replace(r3, "")).replace(n3, "");
  switch (e5.kind) {
    case "exact":
      i3 = t3, o3 = new RegExp("^" + qt(e5.url) + "/?$");
      break;
    case "canonical":
      i3 = a3, o3 = new RegExp("^" + qt(e5.url) + "/?$");
      break;
    case "substring":
      i3 = a3, o3 = new RegExp(".*" + qt(e5.substring) + ".*$");
      break;
    case "regex":
      i3 = a3, o3 = new RegExp(e5.pattern);
      break;
    default:
      return false;
  }
  return o3.test(i3);
}
function Kt(e5, t3) {
  for (var n3 = {}, r3 = null, o3 = [], i3 = 0; i3 < e5.length; i3++) for (var a3 = e5[i3], s = a3.urls || [], c2 = 0; c2 < s.length; c2++) if (zt(s[c2], window.location.href, window.location.search, window.location.hash)) {
    "pageview" === a3.kind ? t3("pageview", a3) : (o3.push(a3), t3("click_pageview", a3));
    break;
  }
  return o3.length > 0 && (r3 = function(e6) {
    for (var n4 = function(e7, t4) {
      for (var n5 = [], r5 = 0; r5 < t4.length; r5++) for (var o4 = e7.target, i4 = t4[r5], a4 = i4.selector, s2 = document.querySelectorAll(a4); o4 && s2.length > 0; ) {
        for (var c3 = 0; c3 < s2.length; c3++) o4 === s2[c3] && n5.push(i4);
        o4 = o4.parentNode;
      }
      return n5;
    }(e6, o3), r4 = 0; r4 < n4.length; r4++) t3("click", n4[r4]);
  }, document.addEventListener("click", r3)), n3.dispose = function() {
    document.removeEventListener("click", r3);
  }, n3;
}
function _t(e5, t3) {
  var n3, r3;
  function o3() {
    r3 && r3.dispose(), n3 && n3.length && (r3 = Kt(n3, i3));
  }
  function i3(t4, n4) {
    var r4 = e5.ident.getContext(), o4 = { kind: t4, key: n4.key, data: null, url: window.location.href, creationDate: (/* @__PURE__ */ new Date()).getTime(), context: r4 };
    return "click" === t4 && (o4.selector = n4.selector), e5.enqueueEvent(o4);
  }
  return e5.requestor.fetchJSON("/sdk/goals/" + e5.getEnvironmentId()).then(function(e6) {
    e6 && e6.length > 0 && (r3 = Kt(n3 = e6, i3), function(e7, t4) {
      var n4, r4 = window.location.href;
      function o4() {
        (n4 = window.location.href) !== r4 && (r4 = n4, t4());
      }
      !function e8(t5, n5) {
        t5(), setTimeout(function() {
          e8(t5, n5);
        }, n5);
      }(o4, e7), window.history && window.history.pushState ? window.addEventListener("popstate", o4) : window.addEventListener("hashchange", o4);
    }(300, o3)), t3();
  }).catch(function(n4) {
    e5.emitter.maybeReportError(new At.LDUnexpectedResponseError((n4 && n4.message, n4.message))), t3();
  }), {};
}
var Jt = "goalsReady";
var Bt = { fetchGoals: { default: true }, hash: { type: "string" }, eventProcessor: { type: "object" }, eventUrlTransformer: { type: "function" }, disableSyncEventPost: { default: false } };
function Gt(e5, t3) {
  var n3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, r3 = function(e6) {
    var t4, n4 = { userAgentHeaderName: "X-LaunchDarkly-User-Agent", synchronousFlush: false };
    if (window.XMLHttpRequest) {
      var r4 = e6 && e6.disableSyncEventPost;
      n4.httpRequest = function(e7, t5, o5, i5) {
        var a5 = n4.synchronousFlush & !r4;
        return n4.synchronousFlush = false, Mt(e7, t5, o5, i5, a5);
      };
    }
    n4.httpAllowsPost = function() {
      return void 0 === t4 && (t4 = !!window.XMLHttpRequest && "withCredentials" in new window.XMLHttpRequest()), t4;
    }, n4.httpFallbackPing = function(e7) {
      new window.Image().src = e7;
    };
    var o4, i4 = e6 && e6.eventUrlTransformer;
    n4.getCurrentUrl = function() {
      return i4 ? i4(window.location.href) : window.location.href;
    }, n4.isDoNotTrack = function() {
      var e7;
      return 1 === (e7 = window.navigator && void 0 !== window.navigator.doNotTrack ? window.navigator.doNotTrack : window.navigator && void 0 !== window.navigator.msDoNotTrack ? window.navigator.msDoNotTrack : window.doNotTrack) || true === e7 || "1" === e7 || "yes" === e7;
    };
    try {
      window.localStorage && (n4.localStorage = { get: function(e7) {
        return new Promise(function(t5) {
          t5(window.localStorage.getItem(e7));
        });
      }, set: function(e7, t5) {
        return new Promise(function(n5) {
          window.localStorage.setItem(e7, t5), n5();
        });
      }, clear: function(e7) {
        return new Promise(function(t5) {
          window.localStorage.removeItem(e7), t5();
        });
      } });
    } catch (e7) {
      n4.localStorage = null;
    }
    if (e6 && e6.useReport && "function" == typeof window.EventSourcePolyfill && window.EventSourcePolyfill.supportedOptions && window.EventSourcePolyfill.supportedOptions.method ? (n4.eventSourceAllowsReport = true, o4 = window.EventSourcePolyfill) : (n4.eventSourceAllowsReport = false, o4 = window.EventSource), window.EventSource) {
      var a4 = 3e5;
      n4.eventSourceFactory = function(e7, t5) {
        var n5 = Nt(Nt({}, { heartbeatTimeout: a4, silentTimeout: a4, skipDefaultHeaders: true }), t5);
        return new o4(e7, n5);
      }, n4.eventSourceIsActive = function(e7) {
        return e7.readyState === window.EventSource.OPEN || e7.readyState === window.EventSource.CONNECTING;
      };
    }
    return n4.userAgent = "JSClient", n4.version = "3.8.1", n4.diagnosticSdkData = { name: "js-client-sdk", version: "3.8.1" }, n4.diagnosticPlatformData = { name: "JS" }, n4.diagnosticUseCombinedEvent = true, n4;
  }(n3), o3 = Ut(e5, t3, n3, r3, Bt), i3 = o3.client, a3 = o3.options, s = o3.emitter, c2 = new Promise(function(e6) {
    var t4 = s.on(Jt, function() {
      s.off(Jt, t4), e6();
    });
  });
  i3.waitUntilGoalsReady = function() {
    return c2;
  }, a3.fetchGoals ? _t(o3, function() {
    return s.emit(Jt);
  }) : s.emit(Jt), "complete" !== document.readyState ? window.addEventListener("load", o3.start) : o3.start();
  var u2 = function() {
    r3.synchronousFlush = true, i3.flush().catch(function() {
    }), r3.synchronousFlush = false;
  };
  return document.addEventListener("visibilitychange", function() {
    "hidden" === document.visibilityState && u2();
  }), window.addEventListener("pagehide", u2), i3;
}
var Wt = Vt;
var Xt = void 0;
var Qt = "3.8.1";

// node_modules/.pnpm/launchdarkly-react-client-sdk@3.8.1_react-dom@19.1.1_react@19.1.1__react@19.1.1/node_modules/launchdarkly-react-client-sdk/lib/esm/index.js
var import_lodash = __toESM(require_lodash());
var import_hoist_non_react_statics = __toESM(require_hoist_non_react_statics_cjs());
var p = () => (0, import_react.createContext)({ flags: {}, flagKeyMap: {}, ldClient: void 0 });
var u = p();
var { Provider: f, Consumer: d } = u;
var y2 = { useCamelCaseFlagKeys: true, sendEventsOnFlagRead: true, reactContext: u };
var h2 = (e5) => {
  var t3;
  return null != (t3 = e5.context) ? t3 : e5.user;
};
var g = (e5) => {
  const t3 = {};
  for (const r3 in e5) 0 !== r3.indexOf("$") && (t3[(0, import_lodash.default)(r3)] = e5[r3]);
  return t3;
};
var O2 = (e5, t3) => {
  const r3 = {};
  for (const n3 in e5) t3 && void 0 === t3[n3] || (r3[n3] = e5[n3].current);
  return r3;
};
var b2 = (e5, t3) => {
  const r3 = e5.allFlags();
  return t3 ? Object.keys(t3).reduce((e6, n3) => (e6[n3] = Object.prototype.hasOwnProperty.call(r3, n3) ? r3[n3] : t3[n3], e6), {}) : r3;
};
function m2(e5, t3, r3 = y2, n3) {
  const o3 = function(e6, t4) {
    if (void 0 === t4) return e6;
    return Object.keys(t4).reduce((t5, r4) => (v(e6, r4) && (t5[r4] = e6[r4]), t5), {});
  }(t3, n3), { useCamelCaseFlagKeys: a3 = true } = r3, [i3, s = {}] = a3 ? function(e6) {
    const t4 = {}, r4 = {};
    for (const n4 in e6) {
      if (0 === n4.indexOf("$")) continue;
      const o4 = (0, import_lodash.default)(n4);
      t4[o4] = e6[n4], r4[o4] = n4;
    }
    return [t4, r4];
  }(o3) : [o3];
  return { flags: r3.sendEventsOnFlagRead ? C2(e5, i3, s, a3) : i3, flagKeyMap: s };
}
function v(e5, t3) {
  return Object.prototype.hasOwnProperty.call(e5, t3);
}
function C2(e5, t3, r3, n3) {
  return new Proxy(t3, { get(t4, o3, a3) {
    const i3 = Reflect.get(t4, o3, a3), s = n3 && v(r3, o3) || v(t4, o3);
    if ("symbol" == typeof o3 || !s) return i3;
    if (void 0 === i3) return;
    const l2 = n3 ? r3[o3] : o3;
    return e5.variation(l2, i3);
  } });
}
g.camelCaseKeys = g;
var x2 = { wrapperName: "react-client-sdk", wrapperVersion: "3.8.1", sendEventsOnlyForVariation: true };
var j = Object.defineProperty;
var w2 = Object.defineProperties;
var P2 = Object.getOwnPropertyDescriptors;
var F2 = Object.getOwnPropertySymbols;
var E2 = Object.prototype.hasOwnProperty;
var S2 = Object.prototype.propertyIsEnumerable;
var k2 = (e5, t3, r3) => t3 in e5 ? j(e5, t3, { enumerable: true, configurable: true, writable: true, value: r3 }) : e5[t3] = r3;
var D2 = (e5, t3) => {
  for (var r3 in t3 || (t3 = {})) E2.call(t3, r3) && k2(e5, r3, t3[r3]);
  if (F2) for (var r3 of F2(t3)) S2.call(t3, r3) && k2(e5, r3, t3[r3]);
  return e5;
};
var I2 = (e5, t3) => w2(e5, P2(t3));
var K2 = (e5, t3, r3) => new Promise((n3, o3) => {
  var a3 = (e6) => {
    try {
      s(r3.next(e6));
    } catch (e7) {
      o3(e7);
    }
  }, i3 = (e6) => {
    try {
      s(r3.throw(e6));
    } catch (e7) {
      o3(e7);
    }
  }, s = (e6) => e6.done ? n3(e6.value) : Promise.resolve(e6.value).then(a3, i3);
  s((r3 = r3.apply(e5, t3)).next());
});
var R = class extends import_react.Component {
  constructor(e5) {
    super(e5), this.getReactOptions = () => D2(D2({}, y2), this.props.reactOptions), this.subscribeToChanges = (e6) => {
      const { flags: t4 } = this.props;
      e6.on("change", (r3) => {
        const n3 = this.getReactOptions(), o3 = O2(r3, t4), a3 = D2(D2({}, this.state.unproxiedFlags), o3);
        Object.keys(o3).length > 0 && this.setState((r4) => D2(I2(D2({}, r4), { unproxiedFlags: a3 }), m2(e6, a3, n3, t4)));
      });
    }, this.onFailed = (e6, t4) => {
      this.setState((e7) => I2(D2({}, e7), { error: t4 }));
    }, this.onReady = (e6, t4, r3) => {
      const n3 = b2(e6, r3);
      this.setState((o3) => D2(I2(D2({}, o3), { unproxiedFlags: n3 }), m2(e6, n3, t4, r3)));
    }, this.prepareLDClient = () => K2(this, null, function* () {
      var e6;
      const { clientSideID: t4, flags: r3, options: n3 } = this.props;
      let o3 = yield this.props.ldClient;
      const a3 = this.getReactOptions();
      let i3, l2 = this.state.unproxiedFlags;
      if (o3) l2 = b2(o3, r3);
      else {
        const c2 = null != (e6 = h2(this.props)) ? e6 : { anonymous: true, kind: "user" };
        o3 = Gt(t4, c2, D2(D2({}, x2), n3));
        try {
          yield o3.waitForInitialization(this.props.timeout), l2 = b2(o3, r3);
        } catch (e7) {
          i3 = e7, (null == i3 ? void 0 : i3.name.toLowerCase().includes("timeout")) && (o3.on("failed", this.onFailed), o3.on("ready", () => {
            this.onReady(o3, a3, r3);
          }));
        }
      }
      this.setState((e7) => I2(D2(I2(D2({}, e7), { unproxiedFlags: l2 }), m2(o3, l2, a3, r3)), { ldClient: o3, error: i3 })), this.subscribeToChanges(o3);
    });
    const { options: t3 } = e5;
    if (this.state = { flags: {}, unproxiedFlags: {}, flagKeyMap: {} }, t3) {
      const { bootstrap: e6 } = t3;
      if (e6 && "localStorage" !== e6) {
        const { useCamelCaseFlagKeys: t4 } = this.getReactOptions();
        this.state = { flags: t4 ? g(e6) : e6, unproxiedFlags: e6, flagKeyMap: {} };
      }
    }
  }
  componentDidMount() {
    return K2(this, null, function* () {
      const { deferInitialization: e5 } = this.props;
      e5 && !h2(this.props) || (yield this.prepareLDClient());
    });
  }
  componentDidUpdate(e5) {
    return K2(this, null, function* () {
      const { deferInitialization: t3 } = this.props, r3 = !h2(e5) && h2(this.props);
      t3 && r3 && (yield this.prepareLDClient());
    });
  }
  render() {
    const { flags: e5, flagKeyMap: r3, ldClient: n3, error: o3 } = this.state, { reactContext: a3 } = this.getReactOptions();
    return import_react.default.createElement(a3.Provider, { value: { flags: e5, flagKeyMap: r3, ldClient: n3, error: o3 } }, this.props.children);
  }
};
var M2 = Object.defineProperty;
var L2 = Object.defineProperties;
var z2 = Object.getOwnPropertyDescriptors;
var T2 = Object.getOwnPropertySymbols;
var V2 = Object.prototype.hasOwnProperty;
var $2 = Object.prototype.propertyIsEnumerable;
var N2 = (e5, t3, r3) => t3 in e5 ? M2(e5, t3, { enumerable: true, configurable: true, writable: true, value: r3 }) : e5[t3] = r3;
var U = (e5, t3) => {
  for (var r3 in t3 || (t3 = {})) V2.call(t3, r3) && N2(e5, r3, t3[r3]);
  if (T2) for (var r3 of T2(t3)) $2.call(t3, r3) && N2(e5, r3, t3[r3]);
  return e5;
};
function q2(t3) {
  return function(r3) {
    const { reactOptions: n3 } = t3, o3 = U(U({}, y2), n3), a3 = (i3 = U({}, t3), L2(i3, z2({ reactOptions: o3 })));
    var i3;
    function s(t4) {
      return e4.createElement(R, U({}, a3), e4.createElement(r3, U({}, t4)));
    }
    return (0, import_hoist_non_react_statics.default)(s, r3), s;
  };
}
var A = Object.defineProperty;
var B2 = Object.defineProperties;
var G2 = Object.getOwnPropertyDescriptors;
var H2 = Object.getOwnPropertySymbols;
var J2 = Object.prototype.hasOwnProperty;
var Q2 = Object.prototype.propertyIsEnumerable;
var W2 = (e5, t3, r3) => t3 in e5 ? A(e5, t3, { enumerable: true, configurable: true, writable: true, value: r3 }) : e5[t3] = r3;
var X2 = (e5, t3) => {
  for (var r3 in t3 || (t3 = {})) J2.call(t3, r3) && W2(e5, r3, t3[r3]);
  if (H2) for (var r3 of H2(t3)) Q2.call(t3, r3) && W2(e5, r3, t3[r3]);
  return e5;
};
var Y2 = (e5, t3) => B2(e5, G2(t3));
function Z2(e5) {
  return r3 = this, n3 = null, i3 = function* () {
    var r4, n4;
    const { clientSideID: i4, flags: l2, options: c2, reactOptions: p2 } = e5, u2 = X2(X2({}, y2), p2), f2 = null != (r4 = h2(e5)) ? r4 : { anonymous: true, kind: "user" };
    let d2, g2 = {};
    const v2 = null != (n4 = yield e5.ldClient) ? n4 : Gt(i4, f2, X2(X2({}, x2), c2));
    try {
      yield v2.waitForInitialization(e5.timeout), g2 = b2(v2, l2);
    } catch (e6) {
      d2 = e6;
    }
    const C3 = (null == c2 ? void 0 : c2.bootstrap) && "localStorage" !== c2.bootstrap ? c2.bootstrap : g2;
    return ({ children: e6 }) => {
      const [r5, n5] = (0, import_react.useState)(() => Y2(X2({ unproxiedFlags: C3 }, m2(v2, C3, u2, l2)), { ldClient: v2, error: d2 }));
      (0, import_react.useEffect)(() => {
        function e7(e8) {
          const t4 = O2(e8, l2);
          Object.keys(t4).length > 0 && n5((e9) => {
            const r7 = X2(X2({}, e9.unproxiedFlags), t4);
            return X2(Y2(X2({}, e9), { unproxiedFlags: r7 }), m2(v2, r7, u2, l2));
          });
        }
        function t3() {
          const e8 = b2(v2, l2);
          n5((t4) => X2(Y2(X2({}, t4), { unproxiedFlags: e8 }), m2(v2, e8, u2, l2)));
        }
        function r6(e8) {
          n5((t4) => Y2(X2({}, t4), { error: e8 }));
        }
        return v2.on("change", e7), (null == d2 ? void 0 : d2.name.toLowerCase().includes("timeout")) && (v2.on("failed", r6), v2.on("ready", t3)), function() {
          v2.off("change", e7), v2.off("failed", r6), v2.off("ready", t3);
        };
      }, []);
      const i5 = r5, { unproxiedFlags: s } = i5, c3 = ((e7, t3) => {
        var r6 = {};
        for (var n6 in e7) J2.call(e7, n6) && t3.indexOf(n6) < 0 && (r6[n6] = e7[n6]);
        if (null != e7 && H2) for (var n6 of H2(e7)) t3.indexOf(n6) < 0 && Q2.call(e7, n6) && (r6[n6] = e7[n6]);
        return r6;
      })(i5, ["unproxiedFlags"]), { reactContext: p3 } = u2;
      return import_react.default.createElement(p3.Provider, { value: c3 }, e6);
    };
  }, new Promise((e6, t3) => {
    var o3 = (e7) => {
      try {
        s(i3.next(e7));
      } catch (e8) {
        t3(e8);
      }
    }, a3 = (e7) => {
      try {
        s(i3.throw(e7));
      } catch (e8) {
        t3(e8);
      }
    }, s = (t4) => t4.done ? e6(t4.value) : Promise.resolve(t4.value).then(o3, a3);
    s((i3 = i3.apply(r3, n3)).next());
  });
  var r3, n3, i3;
}
var _2 = Object.defineProperty;
var ee2 = Object.getOwnPropertySymbols;
var te2 = Object.prototype.hasOwnProperty;
var re2 = Object.prototype.propertyIsEnumerable;
var ne2 = (e5, t3, r3) => t3 in e5 ? _2(e5, t3, { enumerable: true, configurable: true, writable: true, value: r3 }) : e5[t3] = r3;
var oe2 = (e5, t3) => {
  for (var r3 in t3 || (t3 = {})) te2.call(t3, r3) && ne2(e5, r3, t3[r3]);
  if (ee2) for (var r3 of ee2(t3)) re2.call(t3, r3) && ne2(e5, r3, t3[r3]);
  return e5;
};
function ae2(t3 = { clientOnly: false }) {
  return function(r3) {
    var n3;
    const o3 = null != (n3 = t3.reactContext) ? n3 : y2.reactContext;
    return (n4) => e4.createElement(o3.Consumer, null, ({ flags: o4, ldClient: a3 }) => t3.clientOnly ? e4.createElement(r3, oe2({ ldClient: a3 }, n4)) : e4.createElement(r3, oe2({ flags: o4, ldClient: a3 }, n4)));
  };
}
var ie2 = (e5) => {
  const { flags: t3 } = (0, import_react.useContext)(null != e5 ? e5 : y2.reactContext);
  return t3;
};
var se2 = (e5) => {
  const { ldClient: t3 } = (0, import_react.useContext)(null != e5 ? e5 : y2.reactContext);
  return t3;
};
function le2(e5) {
  const { error: t3 } = (0, import_react.useContext)(null != e5 ? e5 : y2.reactContext);
  return t3;
}
export {
  R as LDProvider,
  Z2 as asyncWithLDProvider,
  Wt as basicLogger,
  g as camelCaseKeys,
  Xt as createConsoleLogger,
  y2 as defaultReactOptions,
  Gt as initialize,
  p as reactSdkContextFactory,
  ie2 as useFlags,
  se2 as useLDClient,
  le2 as useLDClientError,
  Qt as version,
  ae2 as withLDConsumer,
  q2 as withLDProvider
};
//# sourceMappingURL=launchdarkly-react-client-sdk.js.map
