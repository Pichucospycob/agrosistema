import nr, { app as jt, BrowserWindow as oc, dialog as rd, ipcMain as He, Menu as Ha } from "electron";
import bt from "fs";
import nd from "constants";
import tn from "stream";
import ua from "util";
import lc from "assert";
import Be from "path";
import qn from "child_process";
import uc from "events";
import rn from "crypto";
import cc from "tty";
import $n from "os";
import Gt from "url";
import fc from "zlib";
import id from "http";
import { createRequire as sd } from "node:module";
import { fileURLToPath as dc } from "node:url";
import Sr from "node:path";
import ad from "sql.js";
var St = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Xt = {}, Jn = {}, pn = {}, Qa;
function pt() {
  return Qa || (Qa = 1, pn.fromCallback = function(r) {
    return Object.defineProperty(function(...e) {
      if (typeof e[e.length - 1] == "function") r.apply(this, e);
      else
        return new Promise((t, n) => {
          e.push((i, s) => i != null ? n(i) : t(s)), r.apply(this, e);
        });
    }, "name", { value: r.name });
  }, pn.fromPromise = function(r) {
    return Object.defineProperty(function(...e) {
      const t = e[e.length - 1];
      if (typeof t != "function") return r.apply(this, e);
      e.pop(), r.apply(this, e).then((n) => t(null, n), t);
    }, "name", { value: r.name });
  }), pn;
}
var Xn, Ga;
function od() {
  if (Ga) return Xn;
  Ga = 1;
  var r = nd, e = process.cwd, t = null, n = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    return t || (t = e.call(process)), t;
  };
  try {
    process.cwd();
  } catch {
  }
  if (typeof process.chdir == "function") {
    var i = process.chdir;
    process.chdir = function(a) {
      t = null, i.call(process, a);
    }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, i);
  }
  Xn = s;
  function s(a) {
    r.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && u(a), a.lutimes || o(a), a.chown = c(a.chown), a.fchown = c(a.fchown), a.lchown = c(a.lchown), a.chmod = f(a.chmod), a.fchmod = f(a.fchmod), a.lchmod = f(a.lchmod), a.chownSync = d(a.chownSync), a.fchownSync = d(a.fchownSync), a.lchownSync = d(a.lchownSync), a.chmodSync = l(a.chmodSync), a.fchmodSync = l(a.fchmodSync), a.lchmodSync = l(a.lchmodSync), a.stat = p(a.stat), a.fstat = p(a.fstat), a.lstat = p(a.lstat), a.statSync = g(a.statSync), a.fstatSync = g(a.fstatSync), a.lstatSync = g(a.lstatSync), a.chmod && !a.lchmod && (a.lchmod = function(m, E, C) {
      C && process.nextTick(C);
    }, a.lchmodSync = function() {
    }), a.chown && !a.lchown && (a.lchown = function(m, E, C, N) {
      N && process.nextTick(N);
    }, a.lchownSync = function() {
    }), n === "win32" && (a.rename = typeof a.rename != "function" ? a.rename : (function(m) {
      function E(C, N, O) {
        var R = Date.now(), I = 0;
        m(C, N, function _(S) {
          if (S && (S.code === "EACCES" || S.code === "EPERM" || S.code === "EBUSY") && Date.now() - R < 6e4) {
            setTimeout(function() {
              a.stat(N, function(y, k) {
                y && y.code === "ENOENT" ? m(C, N, _) : O(S);
              });
            }, I), I < 100 && (I += 10);
            return;
          }
          O && O(S);
        });
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(E, m), E;
    })(a.rename)), a.read = typeof a.read != "function" ? a.read : (function(m) {
      function E(C, N, O, R, I, _) {
        var S;
        if (_ && typeof _ == "function") {
          var y = 0;
          S = function(k, B, F) {
            if (k && k.code === "EAGAIN" && y < 10)
              return y++, m.call(a, C, N, O, R, I, S);
            _.apply(this, arguments);
          };
        }
        return m.call(a, C, N, O, R, I, S);
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(E, m), E;
    })(a.read), a.readSync = typeof a.readSync != "function" ? a.readSync : /* @__PURE__ */ (function(m) {
      return function(E, C, N, O, R) {
        for (var I = 0; ; )
          try {
            return m.call(a, E, C, N, O, R);
          } catch (_) {
            if (_.code === "EAGAIN" && I < 10) {
              I++;
              continue;
            }
            throw _;
          }
      };
    })(a.readSync);
    function u(m) {
      m.lchmod = function(E, C, N) {
        m.open(
          E,
          r.O_WRONLY | r.O_SYMLINK,
          C,
          function(O, R) {
            if (O) {
              N && N(O);
              return;
            }
            m.fchmod(R, C, function(I) {
              m.close(R, function(_) {
                N && N(I || _);
              });
            });
          }
        );
      }, m.lchmodSync = function(E, C) {
        var N = m.openSync(E, r.O_WRONLY | r.O_SYMLINK, C), O = !0, R;
        try {
          R = m.fchmodSync(N, C), O = !1;
        } finally {
          if (O)
            try {
              m.closeSync(N);
            } catch {
            }
          else
            m.closeSync(N);
        }
        return R;
      };
    }
    function o(m) {
      r.hasOwnProperty("O_SYMLINK") && m.futimes ? (m.lutimes = function(E, C, N, O) {
        m.open(E, r.O_SYMLINK, function(R, I) {
          if (R) {
            O && O(R);
            return;
          }
          m.futimes(I, C, N, function(_) {
            m.close(I, function(S) {
              O && O(_ || S);
            });
          });
        });
      }, m.lutimesSync = function(E, C, N) {
        var O = m.openSync(E, r.O_SYMLINK), R, I = !0;
        try {
          R = m.futimesSync(O, C, N), I = !1;
        } finally {
          if (I)
            try {
              m.closeSync(O);
            } catch {
            }
          else
            m.closeSync(O);
        }
        return R;
      }) : m.futimes && (m.lutimes = function(E, C, N, O) {
        O && process.nextTick(O);
      }, m.lutimesSync = function() {
      });
    }
    function f(m) {
      return m && function(E, C, N) {
        return m.call(a, E, C, function(O) {
          w(O) && (O = null), N && N.apply(this, arguments);
        });
      };
    }
    function l(m) {
      return m && function(E, C) {
        try {
          return m.call(a, E, C);
        } catch (N) {
          if (!w(N)) throw N;
        }
      };
    }
    function c(m) {
      return m && function(E, C, N, O) {
        return m.call(a, E, C, N, function(R) {
          w(R) && (R = null), O && O.apply(this, arguments);
        });
      };
    }
    function d(m) {
      return m && function(E, C, N) {
        try {
          return m.call(a, E, C, N);
        } catch (O) {
          if (!w(O)) throw O;
        }
      };
    }
    function p(m) {
      return m && function(E, C, N) {
        typeof C == "function" && (N = C, C = null);
        function O(R, I) {
          I && (I.uid < 0 && (I.uid += 4294967296), I.gid < 0 && (I.gid += 4294967296)), N && N.apply(this, arguments);
        }
        return C ? m.call(a, E, C, O) : m.call(a, E, O);
      };
    }
    function g(m) {
      return m && function(E, C) {
        var N = C ? m.call(a, E, C) : m.call(a, E);
        return N && (N.uid < 0 && (N.uid += 4294967296), N.gid < 0 && (N.gid += 4294967296)), N;
      };
    }
    function w(m) {
      if (!m || m.code === "ENOSYS")
        return !0;
      var E = !process.getuid || process.getuid() !== 0;
      return !!(E && (m.code === "EINVAL" || m.code === "EPERM"));
    }
  }
  return Xn;
}
var Zn, za;
function ld() {
  if (za) return Zn;
  za = 1;
  var r = tn.Stream;
  Zn = e;
  function e(t) {
    return {
      ReadStream: n,
      WriteStream: i
    };
    function n(s, a) {
      if (!(this instanceof n)) return new n(s, a);
      r.call(this);
      var u = this;
      this.path = s, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, a = a || {};
      for (var o = Object.keys(a), f = 0, l = o.length; f < l; f++) {
        var c = o[f];
        this[c] = a[c];
      }
      if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.end === void 0)
          this.end = 1 / 0;
        else if (typeof this.end != "number")
          throw TypeError("end must be a Number");
        if (this.start > this.end)
          throw new Error("start must be <= end");
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          u._read();
        });
        return;
      }
      t.open(this.path, this.flags, this.mode, function(d, p) {
        if (d) {
          u.emit("error", d), u.readable = !1;
          return;
        }
        u.fd = p, u.emit("open", p), u._read();
      });
    }
    function i(s, a) {
      if (!(this instanceof i)) return new i(s, a);
      r.call(this), this.path = s, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, a = a || {};
      for (var u = Object.keys(a), o = 0, f = u.length; o < f; o++) {
        var l = u[o];
        this[l] = a[l];
      }
      if (this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.start < 0)
          throw new Error("start must be >= zero");
        this.pos = this.start;
      }
      this.busy = !1, this._queue = [], this.fd === null && (this._open = t.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
    }
  }
  return Zn;
}
var ei, Va;
function ud() {
  if (Va) return ei;
  Va = 1, ei = e;
  var r = Object.getPrototypeOf || function(t) {
    return t.__proto__;
  };
  function e(t) {
    if (t === null || typeof t != "object")
      return t;
    if (t instanceof Object)
      var n = { __proto__: r(t) };
    else
      var n = /* @__PURE__ */ Object.create(null);
    return Object.getOwnPropertyNames(t).forEach(function(i) {
      Object.defineProperty(n, i, Object.getOwnPropertyDescriptor(t, i));
    }), n;
  }
  return ei;
}
var mn, Wa;
function ft() {
  if (Wa) return mn;
  Wa = 1;
  var r = bt, e = od(), t = ld(), n = ud(), i = ua, s, a;
  typeof Symbol == "function" && typeof Symbol.for == "function" ? (s = /* @__PURE__ */ Symbol.for("graceful-fs.queue"), a = /* @__PURE__ */ Symbol.for("graceful-fs.previous")) : (s = "___graceful-fs.queue", a = "___graceful-fs.previous");
  function u() {
  }
  function o(m, E) {
    Object.defineProperty(m, s, {
      get: function() {
        return E;
      }
    });
  }
  var f = u;
  if (i.debuglog ? f = i.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (f = function() {
    var m = i.format.apply(i, arguments);
    m = "GFS4: " + m.split(/\n/).join(`
GFS4: `), console.error(m);
  }), !r[s]) {
    var l = St[s] || [];
    o(r, l), r.close = (function(m) {
      function E(C, N) {
        return m.call(r, C, function(O) {
          O || g(), typeof N == "function" && N.apply(this, arguments);
        });
      }
      return Object.defineProperty(E, a, {
        value: m
      }), E;
    })(r.close), r.closeSync = (function(m) {
      function E(C) {
        m.apply(r, arguments), g();
      }
      return Object.defineProperty(E, a, {
        value: m
      }), E;
    })(r.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
      f(r[s]), lc.equal(r[s].length, 0);
    });
  }
  St[s] || o(St, r[s]), mn = c(n(r)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !r.__patched && (mn = c(r), r.__patched = !0);
  function c(m) {
    e(m), m.gracefulify = c, m.createReadStream = ye, m.createWriteStream = oe;
    var E = m.readFile;
    m.readFile = C;
    function C(ee, Se, b) {
      return typeof Se == "function" && (b = Se, Se = null), v(ee, Se, b);
      function v(H, x, pe, we) {
        return E(H, x, function(ve) {
          ve && (ve.code === "EMFILE" || ve.code === "ENFILE") ? d([v, [H, x, pe], ve, we || Date.now(), Date.now()]) : typeof pe == "function" && pe.apply(this, arguments);
        });
      }
    }
    var N = m.writeFile;
    m.writeFile = O;
    function O(ee, Se, b, v) {
      return typeof b == "function" && (v = b, b = null), H(ee, Se, b, v);
      function H(x, pe, we, ve, Ne) {
        return N(x, pe, we, function(_e) {
          _e && (_e.code === "EMFILE" || _e.code === "ENFILE") ? d([H, [x, pe, we, ve], _e, Ne || Date.now(), Date.now()]) : typeof ve == "function" && ve.apply(this, arguments);
        });
      }
    }
    var R = m.appendFile;
    R && (m.appendFile = I);
    function I(ee, Se, b, v) {
      return typeof b == "function" && (v = b, b = null), H(ee, Se, b, v);
      function H(x, pe, we, ve, Ne) {
        return R(x, pe, we, function(_e) {
          _e && (_e.code === "EMFILE" || _e.code === "ENFILE") ? d([H, [x, pe, we, ve], _e, Ne || Date.now(), Date.now()]) : typeof ve == "function" && ve.apply(this, arguments);
        });
      }
    }
    var _ = m.copyFile;
    _ && (m.copyFile = S);
    function S(ee, Se, b, v) {
      return typeof b == "function" && (v = b, b = 0), H(ee, Se, b, v);
      function H(x, pe, we, ve, Ne) {
        return _(x, pe, we, function(_e) {
          _e && (_e.code === "EMFILE" || _e.code === "ENFILE") ? d([H, [x, pe, we, ve], _e, Ne || Date.now(), Date.now()]) : typeof ve == "function" && ve.apply(this, arguments);
        });
      }
    }
    var y = m.readdir;
    m.readdir = B;
    var k = /^v[0-5]\./;
    function B(ee, Se, b) {
      typeof Se == "function" && (b = Se, Se = null);
      var v = k.test(process.version) ? function(pe, we, ve, Ne) {
        return y(pe, H(
          pe,
          we,
          ve,
          Ne
        ));
      } : function(pe, we, ve, Ne) {
        return y(pe, we, H(
          pe,
          we,
          ve,
          Ne
        ));
      };
      return v(ee, Se, b);
      function H(x, pe, we, ve) {
        return function(Ne, _e) {
          Ne && (Ne.code === "EMFILE" || Ne.code === "ENFILE") ? d([
            v,
            [x, pe, we],
            Ne,
            ve || Date.now(),
            Date.now()
          ]) : (_e && _e.sort && _e.sort(), typeof we == "function" && we.call(this, Ne, _e));
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var F = t(m);
      P = F.ReadStream, V = F.WriteStream;
    }
    var q = m.ReadStream;
    q && (P.prototype = Object.create(q.prototype), P.prototype.open = G);
    var D = m.WriteStream;
    D && (V.prototype = Object.create(D.prototype), V.prototype.open = ie), Object.defineProperty(m, "ReadStream", {
      get: function() {
        return P;
      },
      set: function(ee) {
        P = ee;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(m, "WriteStream", {
      get: function() {
        return V;
      },
      set: function(ee) {
        V = ee;
      },
      enumerable: !0,
      configurable: !0
    });
    var L = P;
    Object.defineProperty(m, "FileReadStream", {
      get: function() {
        return L;
      },
      set: function(ee) {
        L = ee;
      },
      enumerable: !0,
      configurable: !0
    });
    var Q = V;
    Object.defineProperty(m, "FileWriteStream", {
      get: function() {
        return Q;
      },
      set: function(ee) {
        Q = ee;
      },
      enumerable: !0,
      configurable: !0
    });
    function P(ee, Se) {
      return this instanceof P ? (q.apply(this, arguments), this) : P.apply(Object.create(P.prototype), arguments);
    }
    function G() {
      var ee = this;
      be(ee.path, ee.flags, ee.mode, function(Se, b) {
        Se ? (ee.autoClose && ee.destroy(), ee.emit("error", Se)) : (ee.fd = b, ee.emit("open", b), ee.read());
      });
    }
    function V(ee, Se) {
      return this instanceof V ? (D.apply(this, arguments), this) : V.apply(Object.create(V.prototype), arguments);
    }
    function ie() {
      var ee = this;
      be(ee.path, ee.flags, ee.mode, function(Se, b) {
        Se ? (ee.destroy(), ee.emit("error", Se)) : (ee.fd = b, ee.emit("open", b));
      });
    }
    function ye(ee, Se) {
      return new m.ReadStream(ee, Se);
    }
    function oe(ee, Se) {
      return new m.WriteStream(ee, Se);
    }
    var Ae = m.open;
    m.open = be;
    function be(ee, Se, b, v) {
      return typeof b == "function" && (v = b, b = null), H(ee, Se, b, v);
      function H(x, pe, we, ve, Ne) {
        return Ae(x, pe, we, function(_e, lt) {
          _e && (_e.code === "EMFILE" || _e.code === "ENFILE") ? d([H, [x, pe, we, ve], _e, Ne || Date.now(), Date.now()]) : typeof ve == "function" && ve.apply(this, arguments);
        });
      }
    }
    return m;
  }
  function d(m) {
    f("ENQUEUE", m[0].name, m[1]), r[s].push(m), w();
  }
  var p;
  function g() {
    for (var m = Date.now(), E = 0; E < r[s].length; ++E)
      r[s][E].length > 2 && (r[s][E][3] = m, r[s][E][4] = m);
    w();
  }
  function w() {
    if (clearTimeout(p), p = void 0, r[s].length !== 0) {
      var m = r[s].shift(), E = m[0], C = m[1], N = m[2], O = m[3], R = m[4];
      if (O === void 0)
        f("RETRY", E.name, C), E.apply(null, C);
      else if (Date.now() - O >= 6e4) {
        f("TIMEOUT", E.name, C);
        var I = C.pop();
        typeof I == "function" && I.call(null, N);
      } else {
        var _ = Date.now() - R, S = Math.max(R - O, 1), y = Math.min(S * 1.2, 100);
        _ >= y ? (f("RETRY", E.name, C), E.apply(null, C.concat([O]))) : r[s].push(m);
      }
      p === void 0 && (p = setTimeout(w, 0));
    }
  }
  return mn;
}
var Ya;
function _r() {
  return Ya || (Ya = 1, (function(r) {
    const e = pt().fromCallback, t = ft(), n = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((i) => typeof t[i] == "function");
    Object.assign(r, t), n.forEach((i) => {
      r[i] = e(t[i]);
    }), r.exists = function(i, s) {
      return typeof s == "function" ? t.exists(i, s) : new Promise((a) => t.exists(i, a));
    }, r.read = function(i, s, a, u, o, f) {
      return typeof f == "function" ? t.read(i, s, a, u, o, f) : new Promise((l, c) => {
        t.read(i, s, a, u, o, (d, p, g) => {
          if (d) return c(d);
          l({ bytesRead: p, buffer: g });
        });
      });
    }, r.write = function(i, s, ...a) {
      return typeof a[a.length - 1] == "function" ? t.write(i, s, ...a) : new Promise((u, o) => {
        t.write(i, s, ...a, (f, l, c) => {
          if (f) return o(f);
          u({ bytesWritten: l, buffer: c });
        });
      });
    }, typeof t.writev == "function" && (r.writev = function(i, s, ...a) {
      return typeof a[a.length - 1] == "function" ? t.writev(i, s, ...a) : new Promise((u, o) => {
        t.writev(i, s, ...a, (f, l, c) => {
          if (f) return o(f);
          u({ bytesWritten: l, buffers: c });
        });
      });
    }), typeof t.realpath.native == "function" ? r.realpath.native = e(t.realpath.native) : process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  })(Jn)), Jn;
}
var gn = {}, ti = {}, Ka;
function cd() {
  if (Ka) return ti;
  Ka = 1;
  const r = Be;
  return ti.checkPath = function(t) {
    if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(r.parse(t).root, ""))) {
      const i = new Error(`Path contains invalid characters: ${t}`);
      throw i.code = "EINVAL", i;
    }
  }, ti;
}
var Ja;
function fd() {
  if (Ja) return gn;
  Ja = 1;
  const r = /* @__PURE__ */ _r(), { checkPath: e } = /* @__PURE__ */ cd(), t = (n) => {
    const i = { mode: 511 };
    return typeof n == "number" ? n : { ...i, ...n }.mode;
  };
  return gn.makeDir = async (n, i) => (e(n), r.mkdir(n, {
    mode: t(i),
    recursive: !0
  })), gn.makeDirSync = (n, i) => (e(n), r.mkdirSync(n, {
    mode: t(i),
    recursive: !0
  })), gn;
}
var ri, Xa;
function Nt() {
  if (Xa) return ri;
  Xa = 1;
  const r = pt().fromPromise, { makeDir: e, makeDirSync: t } = /* @__PURE__ */ fd(), n = r(e);
  return ri = {
    mkdirs: n,
    mkdirsSync: t,
    // alias
    mkdirp: n,
    mkdirpSync: t,
    ensureDir: n,
    ensureDirSync: t
  }, ri;
}
var ni, Za;
function ar() {
  if (Za) return ni;
  Za = 1;
  const r = pt().fromPromise, e = /* @__PURE__ */ _r();
  function t(n) {
    return e.access(n).then(() => !0).catch(() => !1);
  }
  return ni = {
    pathExists: r(t),
    pathExistsSync: e.existsSync
  }, ni;
}
var ii, eo;
function hc() {
  if (eo) return ii;
  eo = 1;
  const r = ft();
  function e(n, i, s, a) {
    r.open(n, "r+", (u, o) => {
      if (u) return a(u);
      r.futimes(o, i, s, (f) => {
        r.close(o, (l) => {
          a && a(f || l);
        });
      });
    });
  }
  function t(n, i, s) {
    const a = r.openSync(n, "r+");
    return r.futimesSync(a, i, s), r.closeSync(a);
  }
  return ii = {
    utimesMillis: e,
    utimesMillisSync: t
  }, ii;
}
var si, to;
function Tr() {
  if (to) return si;
  to = 1;
  const r = /* @__PURE__ */ _r(), e = Be, t = ua;
  function n(d, p, g) {
    const w = g.dereference ? (m) => r.stat(m, { bigint: !0 }) : (m) => r.lstat(m, { bigint: !0 });
    return Promise.all([
      w(d),
      w(p).catch((m) => {
        if (m.code === "ENOENT") return null;
        throw m;
      })
    ]).then(([m, E]) => ({ srcStat: m, destStat: E }));
  }
  function i(d, p, g) {
    let w;
    const m = g.dereference ? (C) => r.statSync(C, { bigint: !0 }) : (C) => r.lstatSync(C, { bigint: !0 }), E = m(d);
    try {
      w = m(p);
    } catch (C) {
      if (C.code === "ENOENT") return { srcStat: E, destStat: null };
      throw C;
    }
    return { srcStat: E, destStat: w };
  }
  function s(d, p, g, w, m) {
    t.callbackify(n)(d, p, w, (E, C) => {
      if (E) return m(E);
      const { srcStat: N, destStat: O } = C;
      if (O) {
        if (f(N, O)) {
          const R = e.basename(d), I = e.basename(p);
          return g === "move" && R !== I && R.toLowerCase() === I.toLowerCase() ? m(null, { srcStat: N, destStat: O, isChangingCase: !0 }) : m(new Error("Source and destination must not be the same."));
        }
        if (N.isDirectory() && !O.isDirectory())
          return m(new Error(`Cannot overwrite non-directory '${p}' with directory '${d}'.`));
        if (!N.isDirectory() && O.isDirectory())
          return m(new Error(`Cannot overwrite directory '${p}' with non-directory '${d}'.`));
      }
      return N.isDirectory() && l(d, p) ? m(new Error(c(d, p, g))) : m(null, { srcStat: N, destStat: O });
    });
  }
  function a(d, p, g, w) {
    const { srcStat: m, destStat: E } = i(d, p, w);
    if (E) {
      if (f(m, E)) {
        const C = e.basename(d), N = e.basename(p);
        if (g === "move" && C !== N && C.toLowerCase() === N.toLowerCase())
          return { srcStat: m, destStat: E, isChangingCase: !0 };
        throw new Error("Source and destination must not be the same.");
      }
      if (m.isDirectory() && !E.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${p}' with directory '${d}'.`);
      if (!m.isDirectory() && E.isDirectory())
        throw new Error(`Cannot overwrite directory '${p}' with non-directory '${d}'.`);
    }
    if (m.isDirectory() && l(d, p))
      throw new Error(c(d, p, g));
    return { srcStat: m, destStat: E };
  }
  function u(d, p, g, w, m) {
    const E = e.resolve(e.dirname(d)), C = e.resolve(e.dirname(g));
    if (C === E || C === e.parse(C).root) return m();
    r.stat(C, { bigint: !0 }, (N, O) => N ? N.code === "ENOENT" ? m() : m(N) : f(p, O) ? m(new Error(c(d, g, w))) : u(d, p, C, w, m));
  }
  function o(d, p, g, w) {
    const m = e.resolve(e.dirname(d)), E = e.resolve(e.dirname(g));
    if (E === m || E === e.parse(E).root) return;
    let C;
    try {
      C = r.statSync(E, { bigint: !0 });
    } catch (N) {
      if (N.code === "ENOENT") return;
      throw N;
    }
    if (f(p, C))
      throw new Error(c(d, g, w));
    return o(d, p, E, w);
  }
  function f(d, p) {
    return p.ino && p.dev && p.ino === d.ino && p.dev === d.dev;
  }
  function l(d, p) {
    const g = e.resolve(d).split(e.sep).filter((m) => m), w = e.resolve(p).split(e.sep).filter((m) => m);
    return g.reduce((m, E, C) => m && w[C] === E, !0);
  }
  function c(d, p, g) {
    return `Cannot ${g} '${d}' to a subdirectory of itself, '${p}'.`;
  }
  return si = {
    checkPaths: s,
    checkPathsSync: a,
    checkParentPaths: u,
    checkParentPathsSync: o,
    isSrcSubdir: l,
    areIdentical: f
  }, si;
}
var ai, ro;
function dd() {
  if (ro) return ai;
  ro = 1;
  const r = ft(), e = Be, t = Nt().mkdirs, n = ar().pathExists, i = hc().utimesMillis, s = /* @__PURE__ */ Tr();
  function a(B, F, q, D) {
    typeof q == "function" && !D ? (D = q, q = {}) : typeof q == "function" && (q = { filter: q }), D = D || function() {
    }, q = q || {}, q.clobber = "clobber" in q ? !!q.clobber : !0, q.overwrite = "overwrite" in q ? !!q.overwrite : q.clobber, q.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0001"
    ), s.checkPaths(B, F, "copy", q, (L, Q) => {
      if (L) return D(L);
      const { srcStat: P, destStat: G } = Q;
      s.checkParentPaths(B, P, F, "copy", (V) => V ? D(V) : q.filter ? o(u, G, B, F, q, D) : u(G, B, F, q, D));
    });
  }
  function u(B, F, q, D, L) {
    const Q = e.dirname(q);
    n(Q, (P, G) => {
      if (P) return L(P);
      if (G) return l(B, F, q, D, L);
      t(Q, (V) => V ? L(V) : l(B, F, q, D, L));
    });
  }
  function o(B, F, q, D, L, Q) {
    Promise.resolve(L.filter(q, D)).then((P) => P ? B(F, q, D, L, Q) : Q(), (P) => Q(P));
  }
  function f(B, F, q, D, L) {
    return D.filter ? o(l, B, F, q, D, L) : l(B, F, q, D, L);
  }
  function l(B, F, q, D, L) {
    (D.dereference ? r.stat : r.lstat)(F, (P, G) => P ? L(P) : G.isDirectory() ? O(G, B, F, q, D, L) : G.isFile() || G.isCharacterDevice() || G.isBlockDevice() ? c(G, B, F, q, D, L) : G.isSymbolicLink() ? y(B, F, q, D, L) : G.isSocket() ? L(new Error(`Cannot copy a socket file: ${F}`)) : G.isFIFO() ? L(new Error(`Cannot copy a FIFO pipe: ${F}`)) : L(new Error(`Unknown file: ${F}`)));
  }
  function c(B, F, q, D, L, Q) {
    return F ? d(B, q, D, L, Q) : p(B, q, D, L, Q);
  }
  function d(B, F, q, D, L) {
    if (D.overwrite)
      r.unlink(q, (Q) => Q ? L(Q) : p(B, F, q, D, L));
    else return D.errorOnExist ? L(new Error(`'${q}' already exists`)) : L();
  }
  function p(B, F, q, D, L) {
    r.copyFile(F, q, (Q) => Q ? L(Q) : D.preserveTimestamps ? g(B.mode, F, q, L) : C(q, B.mode, L));
  }
  function g(B, F, q, D) {
    return w(B) ? m(q, B, (L) => L ? D(L) : E(B, F, q, D)) : E(B, F, q, D);
  }
  function w(B) {
    return (B & 128) === 0;
  }
  function m(B, F, q) {
    return C(B, F | 128, q);
  }
  function E(B, F, q, D) {
    N(F, q, (L) => L ? D(L) : C(q, B, D));
  }
  function C(B, F, q) {
    return r.chmod(B, F, q);
  }
  function N(B, F, q) {
    r.stat(B, (D, L) => D ? q(D) : i(F, L.atime, L.mtime, q));
  }
  function O(B, F, q, D, L, Q) {
    return F ? I(q, D, L, Q) : R(B.mode, q, D, L, Q);
  }
  function R(B, F, q, D, L) {
    r.mkdir(q, (Q) => {
      if (Q) return L(Q);
      I(F, q, D, (P) => P ? L(P) : C(q, B, L));
    });
  }
  function I(B, F, q, D) {
    r.readdir(B, (L, Q) => L ? D(L) : _(Q, B, F, q, D));
  }
  function _(B, F, q, D, L) {
    const Q = B.pop();
    return Q ? S(B, Q, F, q, D, L) : L();
  }
  function S(B, F, q, D, L, Q) {
    const P = e.join(q, F), G = e.join(D, F);
    s.checkPaths(P, G, "copy", L, (V, ie) => {
      if (V) return Q(V);
      const { destStat: ye } = ie;
      f(ye, P, G, L, (oe) => oe ? Q(oe) : _(B, q, D, L, Q));
    });
  }
  function y(B, F, q, D, L) {
    r.readlink(F, (Q, P) => {
      if (Q) return L(Q);
      if (D.dereference && (P = e.resolve(process.cwd(), P)), B)
        r.readlink(q, (G, V) => G ? G.code === "EINVAL" || G.code === "UNKNOWN" ? r.symlink(P, q, L) : L(G) : (D.dereference && (V = e.resolve(process.cwd(), V)), s.isSrcSubdir(P, V) ? L(new Error(`Cannot copy '${P}' to a subdirectory of itself, '${V}'.`)) : B.isDirectory() && s.isSrcSubdir(V, P) ? L(new Error(`Cannot overwrite '${V}' with '${P}'.`)) : k(P, q, L)));
      else
        return r.symlink(P, q, L);
    });
  }
  function k(B, F, q) {
    r.unlink(F, (D) => D ? q(D) : r.symlink(B, F, q));
  }
  return ai = a, ai;
}
var oi, no;
function hd() {
  if (no) return oi;
  no = 1;
  const r = ft(), e = Be, t = Nt().mkdirsSync, n = hc().utimesMillisSync, i = /* @__PURE__ */ Tr();
  function s(_, S, y) {
    typeof y == "function" && (y = { filter: y }), y = y || {}, y.clobber = "clobber" in y ? !!y.clobber : !0, y.overwrite = "overwrite" in y ? !!y.overwrite : y.clobber, y.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0002"
    );
    const { srcStat: k, destStat: B } = i.checkPathsSync(_, S, "copy", y);
    return i.checkParentPathsSync(_, k, S, "copy"), a(B, _, S, y);
  }
  function a(_, S, y, k) {
    if (k.filter && !k.filter(S, y)) return;
    const B = e.dirname(y);
    return r.existsSync(B) || t(B), o(_, S, y, k);
  }
  function u(_, S, y, k) {
    if (!(k.filter && !k.filter(S, y)))
      return o(_, S, y, k);
  }
  function o(_, S, y, k) {
    const F = (k.dereference ? r.statSync : r.lstatSync)(S);
    if (F.isDirectory()) return E(F, _, S, y, k);
    if (F.isFile() || F.isCharacterDevice() || F.isBlockDevice()) return f(F, _, S, y, k);
    if (F.isSymbolicLink()) return R(_, S, y, k);
    throw F.isSocket() ? new Error(`Cannot copy a socket file: ${S}`) : F.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${S}`) : new Error(`Unknown file: ${S}`);
  }
  function f(_, S, y, k, B) {
    return S ? l(_, y, k, B) : c(_, y, k, B);
  }
  function l(_, S, y, k) {
    if (k.overwrite)
      return r.unlinkSync(y), c(_, S, y, k);
    if (k.errorOnExist)
      throw new Error(`'${y}' already exists`);
  }
  function c(_, S, y, k) {
    return r.copyFileSync(S, y), k.preserveTimestamps && d(_.mode, S, y), w(y, _.mode);
  }
  function d(_, S, y) {
    return p(_) && g(y, _), m(S, y);
  }
  function p(_) {
    return (_ & 128) === 0;
  }
  function g(_, S) {
    return w(_, S | 128);
  }
  function w(_, S) {
    return r.chmodSync(_, S);
  }
  function m(_, S) {
    const y = r.statSync(_);
    return n(S, y.atime, y.mtime);
  }
  function E(_, S, y, k, B) {
    return S ? N(y, k, B) : C(_.mode, y, k, B);
  }
  function C(_, S, y, k) {
    return r.mkdirSync(y), N(S, y, k), w(y, _);
  }
  function N(_, S, y) {
    r.readdirSync(_).forEach((k) => O(k, _, S, y));
  }
  function O(_, S, y, k) {
    const B = e.join(S, _), F = e.join(y, _), { destStat: q } = i.checkPathsSync(B, F, "copy", k);
    return u(q, B, F, k);
  }
  function R(_, S, y, k) {
    let B = r.readlinkSync(S);
    if (k.dereference && (B = e.resolve(process.cwd(), B)), _) {
      let F;
      try {
        F = r.readlinkSync(y);
      } catch (q) {
        if (q.code === "EINVAL" || q.code === "UNKNOWN") return r.symlinkSync(B, y);
        throw q;
      }
      if (k.dereference && (F = e.resolve(process.cwd(), F)), i.isSrcSubdir(B, F))
        throw new Error(`Cannot copy '${B}' to a subdirectory of itself, '${F}'.`);
      if (r.statSync(y).isDirectory() && i.isSrcSubdir(F, B))
        throw new Error(`Cannot overwrite '${F}' with '${B}'.`);
      return I(B, y);
    } else
      return r.symlinkSync(B, y);
  }
  function I(_, S) {
    return r.unlinkSync(S), r.symlinkSync(_, S);
  }
  return oi = s, oi;
}
var li, io;
function ca() {
  if (io) return li;
  io = 1;
  const r = pt().fromCallback;
  return li = {
    copy: r(/* @__PURE__ */ dd()),
    copySync: /* @__PURE__ */ hd()
  }, li;
}
var ui, so;
function pd() {
  if (so) return ui;
  so = 1;
  const r = ft(), e = Be, t = lc, n = process.platform === "win32";
  function i(g) {
    [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ].forEach((m) => {
      g[m] = g[m] || r[m], m = m + "Sync", g[m] = g[m] || r[m];
    }), g.maxBusyTries = g.maxBusyTries || 3;
  }
  function s(g, w, m) {
    let E = 0;
    typeof w == "function" && (m = w, w = {}), t(g, "rimraf: missing path"), t.strictEqual(typeof g, "string", "rimraf: path should be a string"), t.strictEqual(typeof m, "function", "rimraf: callback function required"), t(w, "rimraf: invalid options argument provided"), t.strictEqual(typeof w, "object", "rimraf: options should be object"), i(w), a(g, w, function C(N) {
      if (N) {
        if ((N.code === "EBUSY" || N.code === "ENOTEMPTY" || N.code === "EPERM") && E < w.maxBusyTries) {
          E++;
          const O = E * 100;
          return setTimeout(() => a(g, w, C), O);
        }
        N.code === "ENOENT" && (N = null);
      }
      m(N);
    });
  }
  function a(g, w, m) {
    t(g), t(w), t(typeof m == "function"), w.lstat(g, (E, C) => {
      if (E && E.code === "ENOENT")
        return m(null);
      if (E && E.code === "EPERM" && n)
        return u(g, w, E, m);
      if (C && C.isDirectory())
        return f(g, w, E, m);
      w.unlink(g, (N) => {
        if (N) {
          if (N.code === "ENOENT")
            return m(null);
          if (N.code === "EPERM")
            return n ? u(g, w, N, m) : f(g, w, N, m);
          if (N.code === "EISDIR")
            return f(g, w, N, m);
        }
        return m(N);
      });
    });
  }
  function u(g, w, m, E) {
    t(g), t(w), t(typeof E == "function"), w.chmod(g, 438, (C) => {
      C ? E(C.code === "ENOENT" ? null : m) : w.stat(g, (N, O) => {
        N ? E(N.code === "ENOENT" ? null : m) : O.isDirectory() ? f(g, w, m, E) : w.unlink(g, E);
      });
    });
  }
  function o(g, w, m) {
    let E;
    t(g), t(w);
    try {
      w.chmodSync(g, 438);
    } catch (C) {
      if (C.code === "ENOENT")
        return;
      throw m;
    }
    try {
      E = w.statSync(g);
    } catch (C) {
      if (C.code === "ENOENT")
        return;
      throw m;
    }
    E.isDirectory() ? d(g, w, m) : w.unlinkSync(g);
  }
  function f(g, w, m, E) {
    t(g), t(w), t(typeof E == "function"), w.rmdir(g, (C) => {
      C && (C.code === "ENOTEMPTY" || C.code === "EEXIST" || C.code === "EPERM") ? l(g, w, E) : C && C.code === "ENOTDIR" ? E(m) : E(C);
    });
  }
  function l(g, w, m) {
    t(g), t(w), t(typeof m == "function"), w.readdir(g, (E, C) => {
      if (E) return m(E);
      let N = C.length, O;
      if (N === 0) return w.rmdir(g, m);
      C.forEach((R) => {
        s(e.join(g, R), w, (I) => {
          if (!O) {
            if (I) return m(O = I);
            --N === 0 && w.rmdir(g, m);
          }
        });
      });
    });
  }
  function c(g, w) {
    let m;
    w = w || {}, i(w), t(g, "rimraf: missing path"), t.strictEqual(typeof g, "string", "rimraf: path should be a string"), t(w, "rimraf: missing options"), t.strictEqual(typeof w, "object", "rimraf: options should be object");
    try {
      m = w.lstatSync(g);
    } catch (E) {
      if (E.code === "ENOENT")
        return;
      E.code === "EPERM" && n && o(g, w, E);
    }
    try {
      m && m.isDirectory() ? d(g, w, null) : w.unlinkSync(g);
    } catch (E) {
      if (E.code === "ENOENT")
        return;
      if (E.code === "EPERM")
        return n ? o(g, w, E) : d(g, w, E);
      if (E.code !== "EISDIR")
        throw E;
      d(g, w, E);
    }
  }
  function d(g, w, m) {
    t(g), t(w);
    try {
      w.rmdirSync(g);
    } catch (E) {
      if (E.code === "ENOTDIR")
        throw m;
      if (E.code === "ENOTEMPTY" || E.code === "EEXIST" || E.code === "EPERM")
        p(g, w);
      else if (E.code !== "ENOENT")
        throw E;
    }
  }
  function p(g, w) {
    if (t(g), t(w), w.readdirSync(g).forEach((m) => c(e.join(g, m), w)), n) {
      const m = Date.now();
      do
        try {
          return w.rmdirSync(g, w);
        } catch {
        }
      while (Date.now() - m < 500);
    } else
      return w.rmdirSync(g, w);
  }
  return ui = s, s.sync = c, ui;
}
var ci, ao;
function kn() {
  if (ao) return ci;
  ao = 1;
  const r = ft(), e = pt().fromCallback, t = /* @__PURE__ */ pd();
  function n(s, a) {
    if (r.rm) return r.rm(s, { recursive: !0, force: !0 }, a);
    t(s, a);
  }
  function i(s) {
    if (r.rmSync) return r.rmSync(s, { recursive: !0, force: !0 });
    t.sync(s);
  }
  return ci = {
    remove: e(n),
    removeSync: i
  }, ci;
}
var fi, oo;
function md() {
  if (oo) return fi;
  oo = 1;
  const r = pt().fromPromise, e = /* @__PURE__ */ _r(), t = Be, n = /* @__PURE__ */ Nt(), i = /* @__PURE__ */ kn(), s = r(async function(o) {
    let f;
    try {
      f = await e.readdir(o);
    } catch {
      return n.mkdirs(o);
    }
    return Promise.all(f.map((l) => i.remove(t.join(o, l))));
  });
  function a(u) {
    let o;
    try {
      o = e.readdirSync(u);
    } catch {
      return n.mkdirsSync(u);
    }
    o.forEach((f) => {
      f = t.join(u, f), i.removeSync(f);
    });
  }
  return fi = {
    emptyDirSync: a,
    emptydirSync: a,
    emptyDir: s,
    emptydir: s
  }, fi;
}
var di, lo;
function gd() {
  if (lo) return di;
  lo = 1;
  const r = pt().fromCallback, e = Be, t = ft(), n = /* @__PURE__ */ Nt();
  function i(a, u) {
    function o() {
      t.writeFile(a, "", (f) => {
        if (f) return u(f);
        u();
      });
    }
    t.stat(a, (f, l) => {
      if (!f && l.isFile()) return u();
      const c = e.dirname(a);
      t.stat(c, (d, p) => {
        if (d)
          return d.code === "ENOENT" ? n.mkdirs(c, (g) => {
            if (g) return u(g);
            o();
          }) : u(d);
        p.isDirectory() ? o() : t.readdir(c, (g) => {
          if (g) return u(g);
        });
      });
    });
  }
  function s(a) {
    let u;
    try {
      u = t.statSync(a);
    } catch {
    }
    if (u && u.isFile()) return;
    const o = e.dirname(a);
    try {
      t.statSync(o).isDirectory() || t.readdirSync(o);
    } catch (f) {
      if (f && f.code === "ENOENT") n.mkdirsSync(o);
      else throw f;
    }
    t.writeFileSync(a, "");
  }
  return di = {
    createFile: r(i),
    createFileSync: s
  }, di;
}
var hi, uo;
function yd() {
  if (uo) return hi;
  uo = 1;
  const r = pt().fromCallback, e = Be, t = ft(), n = /* @__PURE__ */ Nt(), i = ar().pathExists, { areIdentical: s } = /* @__PURE__ */ Tr();
  function a(o, f, l) {
    function c(d, p) {
      t.link(d, p, (g) => {
        if (g) return l(g);
        l(null);
      });
    }
    t.lstat(f, (d, p) => {
      t.lstat(o, (g, w) => {
        if (g)
          return g.message = g.message.replace("lstat", "ensureLink"), l(g);
        if (p && s(w, p)) return l(null);
        const m = e.dirname(f);
        i(m, (E, C) => {
          if (E) return l(E);
          if (C) return c(o, f);
          n.mkdirs(m, (N) => {
            if (N) return l(N);
            c(o, f);
          });
        });
      });
    });
  }
  function u(o, f) {
    let l;
    try {
      l = t.lstatSync(f);
    } catch {
    }
    try {
      const p = t.lstatSync(o);
      if (l && s(p, l)) return;
    } catch (p) {
      throw p.message = p.message.replace("lstat", "ensureLink"), p;
    }
    const c = e.dirname(f);
    return t.existsSync(c) || n.mkdirsSync(c), t.linkSync(o, f);
  }
  return hi = {
    createLink: r(a),
    createLinkSync: u
  }, hi;
}
var pi, co;
function wd() {
  if (co) return pi;
  co = 1;
  const r = Be, e = ft(), t = ar().pathExists;
  function n(s, a, u) {
    if (r.isAbsolute(s))
      return e.lstat(s, (o) => o ? (o.message = o.message.replace("lstat", "ensureSymlink"), u(o)) : u(null, {
        toCwd: s,
        toDst: s
      }));
    {
      const o = r.dirname(a), f = r.join(o, s);
      return t(f, (l, c) => l ? u(l) : c ? u(null, {
        toCwd: f,
        toDst: s
      }) : e.lstat(s, (d) => d ? (d.message = d.message.replace("lstat", "ensureSymlink"), u(d)) : u(null, {
        toCwd: s,
        toDst: r.relative(o, s)
      })));
    }
  }
  function i(s, a) {
    let u;
    if (r.isAbsolute(s)) {
      if (u = e.existsSync(s), !u) throw new Error("absolute srcpath does not exist");
      return {
        toCwd: s,
        toDst: s
      };
    } else {
      const o = r.dirname(a), f = r.join(o, s);
      if (u = e.existsSync(f), u)
        return {
          toCwd: f,
          toDst: s
        };
      if (u = e.existsSync(s), !u) throw new Error("relative srcpath does not exist");
      return {
        toCwd: s,
        toDst: r.relative(o, s)
      };
    }
  }
  return pi = {
    symlinkPaths: n,
    symlinkPathsSync: i
  }, pi;
}
var mi, fo;
function vd() {
  if (fo) return mi;
  fo = 1;
  const r = ft();
  function e(n, i, s) {
    if (s = typeof i == "function" ? i : s, i = typeof i == "function" ? !1 : i, i) return s(null, i);
    r.lstat(n, (a, u) => {
      if (a) return s(null, "file");
      i = u && u.isDirectory() ? "dir" : "file", s(null, i);
    });
  }
  function t(n, i) {
    let s;
    if (i) return i;
    try {
      s = r.lstatSync(n);
    } catch {
      return "file";
    }
    return s && s.isDirectory() ? "dir" : "file";
  }
  return mi = {
    symlinkType: e,
    symlinkTypeSync: t
  }, mi;
}
var gi, ho;
function Ed() {
  if (ho) return gi;
  ho = 1;
  const r = pt().fromCallback, e = Be, t = /* @__PURE__ */ _r(), n = /* @__PURE__ */ Nt(), i = n.mkdirs, s = n.mkdirsSync, a = /* @__PURE__ */ wd(), u = a.symlinkPaths, o = a.symlinkPathsSync, f = /* @__PURE__ */ vd(), l = f.symlinkType, c = f.symlinkTypeSync, d = ar().pathExists, { areIdentical: p } = /* @__PURE__ */ Tr();
  function g(E, C, N, O) {
    O = typeof N == "function" ? N : O, N = typeof N == "function" ? !1 : N, t.lstat(C, (R, I) => {
      !R && I.isSymbolicLink() ? Promise.all([
        t.stat(E),
        t.stat(C)
      ]).then(([_, S]) => {
        if (p(_, S)) return O(null);
        w(E, C, N, O);
      }) : w(E, C, N, O);
    });
  }
  function w(E, C, N, O) {
    u(E, C, (R, I) => {
      if (R) return O(R);
      E = I.toDst, l(I.toCwd, N, (_, S) => {
        if (_) return O(_);
        const y = e.dirname(C);
        d(y, (k, B) => {
          if (k) return O(k);
          if (B) return t.symlink(E, C, S, O);
          i(y, (F) => {
            if (F) return O(F);
            t.symlink(E, C, S, O);
          });
        });
      });
    });
  }
  function m(E, C, N) {
    let O;
    try {
      O = t.lstatSync(C);
    } catch {
    }
    if (O && O.isSymbolicLink()) {
      const S = t.statSync(E), y = t.statSync(C);
      if (p(S, y)) return;
    }
    const R = o(E, C);
    E = R.toDst, N = c(R.toCwd, N);
    const I = e.dirname(C);
    return t.existsSync(I) || s(I), t.symlinkSync(E, C, N);
  }
  return gi = {
    createSymlink: r(g),
    createSymlinkSync: m
  }, gi;
}
var yi, po;
function Sd() {
  if (po) return yi;
  po = 1;
  const { createFile: r, createFileSync: e } = /* @__PURE__ */ gd(), { createLink: t, createLinkSync: n } = /* @__PURE__ */ yd(), { createSymlink: i, createSymlinkSync: s } = /* @__PURE__ */ Ed();
  return yi = {
    // file
    createFile: r,
    createFileSync: e,
    ensureFile: r,
    ensureFileSync: e,
    // link
    createLink: t,
    createLinkSync: n,
    ensureLink: t,
    ensureLinkSync: n,
    // symlink
    createSymlink: i,
    createSymlinkSync: s,
    ensureSymlink: i,
    ensureSymlinkSync: s
  }, yi;
}
var wi, mo;
function fa() {
  if (mo) return wi;
  mo = 1;
  function r(t, { EOL: n = `
`, finalEOL: i = !0, replacer: s = null, spaces: a } = {}) {
    const u = i ? n : "";
    return JSON.stringify(t, s, a).replace(/\n/g, n) + u;
  }
  function e(t) {
    return Buffer.isBuffer(t) && (t = t.toString("utf8")), t.replace(/^\uFEFF/, "");
  }
  return wi = { stringify: r, stripBom: e }, wi;
}
var vi, go;
function bd() {
  if (go) return vi;
  go = 1;
  let r;
  try {
    r = ft();
  } catch {
    r = bt;
  }
  const e = pt(), { stringify: t, stripBom: n } = fa();
  async function i(l, c = {}) {
    typeof c == "string" && (c = { encoding: c });
    const d = c.fs || r, p = "throws" in c ? c.throws : !0;
    let g = await e.fromCallback(d.readFile)(l, c);
    g = n(g);
    let w;
    try {
      w = JSON.parse(g, c ? c.reviver : null);
    } catch (m) {
      if (p)
        throw m.message = `${l}: ${m.message}`, m;
      return null;
    }
    return w;
  }
  const s = e.fromPromise(i);
  function a(l, c = {}) {
    typeof c == "string" && (c = { encoding: c });
    const d = c.fs || r, p = "throws" in c ? c.throws : !0;
    try {
      let g = d.readFileSync(l, c);
      return g = n(g), JSON.parse(g, c.reviver);
    } catch (g) {
      if (p)
        throw g.message = `${l}: ${g.message}`, g;
      return null;
    }
  }
  async function u(l, c, d = {}) {
    const p = d.fs || r, g = t(c, d);
    await e.fromCallback(p.writeFile)(l, g, d);
  }
  const o = e.fromPromise(u);
  function f(l, c, d = {}) {
    const p = d.fs || r, g = t(c, d);
    return p.writeFileSync(l, g, d);
  }
  return vi = {
    readFile: s,
    readFileSync: a,
    writeFile: o,
    writeFileSync: f
  }, vi;
}
var Ei, yo;
function _d() {
  if (yo) return Ei;
  yo = 1;
  const r = bd();
  return Ei = {
    // jsonfile exports
    readJson: r.readFile,
    readJsonSync: r.readFileSync,
    writeJson: r.writeFile,
    writeJsonSync: r.writeFileSync
  }, Ei;
}
var Si, wo;
function da() {
  if (wo) return Si;
  wo = 1;
  const r = pt().fromCallback, e = ft(), t = Be, n = /* @__PURE__ */ Nt(), i = ar().pathExists;
  function s(u, o, f, l) {
    typeof f == "function" && (l = f, f = "utf8");
    const c = t.dirname(u);
    i(c, (d, p) => {
      if (d) return l(d);
      if (p) return e.writeFile(u, o, f, l);
      n.mkdirs(c, (g) => {
        if (g) return l(g);
        e.writeFile(u, o, f, l);
      });
    });
  }
  function a(u, ...o) {
    const f = t.dirname(u);
    if (e.existsSync(f))
      return e.writeFileSync(u, ...o);
    n.mkdirsSync(f), e.writeFileSync(u, ...o);
  }
  return Si = {
    outputFile: r(s),
    outputFileSync: a
  }, Si;
}
var bi, vo;
function Td() {
  if (vo) return bi;
  vo = 1;
  const { stringify: r } = fa(), { outputFile: e } = /* @__PURE__ */ da();
  async function t(n, i, s = {}) {
    const a = r(i, s);
    await e(n, a, s);
  }
  return bi = t, bi;
}
var _i, Eo;
function Cd() {
  if (Eo) return _i;
  Eo = 1;
  const { stringify: r } = fa(), { outputFileSync: e } = /* @__PURE__ */ da();
  function t(n, i, s) {
    const a = r(i, s);
    e(n, a, s);
  }
  return _i = t, _i;
}
var Ti, So;
function Ad() {
  if (So) return Ti;
  So = 1;
  const r = pt().fromPromise, e = /* @__PURE__ */ _d();
  return e.outputJson = r(/* @__PURE__ */ Td()), e.outputJsonSync = /* @__PURE__ */ Cd(), e.outputJSON = e.outputJson, e.outputJSONSync = e.outputJsonSync, e.writeJSON = e.writeJson, e.writeJSONSync = e.writeJsonSync, e.readJSON = e.readJson, e.readJSONSync = e.readJsonSync, Ti = e, Ti;
}
var Ci, bo;
function Rd() {
  if (bo) return Ci;
  bo = 1;
  const r = ft(), e = Be, t = ca().copy, n = kn().remove, i = Nt().mkdirp, s = ar().pathExists, a = /* @__PURE__ */ Tr();
  function u(d, p, g, w) {
    typeof g == "function" && (w = g, g = {}), g = g || {};
    const m = g.overwrite || g.clobber || !1;
    a.checkPaths(d, p, "move", g, (E, C) => {
      if (E) return w(E);
      const { srcStat: N, isChangingCase: O = !1 } = C;
      a.checkParentPaths(d, N, p, "move", (R) => {
        if (R) return w(R);
        if (o(p)) return f(d, p, m, O, w);
        i(e.dirname(p), (I) => I ? w(I) : f(d, p, m, O, w));
      });
    });
  }
  function o(d) {
    const p = e.dirname(d);
    return e.parse(p).root === p;
  }
  function f(d, p, g, w, m) {
    if (w) return l(d, p, g, m);
    if (g)
      return n(p, (E) => E ? m(E) : l(d, p, g, m));
    s(p, (E, C) => E ? m(E) : C ? m(new Error("dest already exists.")) : l(d, p, g, m));
  }
  function l(d, p, g, w) {
    r.rename(d, p, (m) => m ? m.code !== "EXDEV" ? w(m) : c(d, p, g, w) : w());
  }
  function c(d, p, g, w) {
    t(d, p, {
      overwrite: g,
      errorOnExist: !0
    }, (E) => E ? w(E) : n(d, w));
  }
  return Ci = u, Ci;
}
var Ai, _o;
function Nd() {
  if (_o) return Ai;
  _o = 1;
  const r = ft(), e = Be, t = ca().copySync, n = kn().removeSync, i = Nt().mkdirpSync, s = /* @__PURE__ */ Tr();
  function a(c, d, p) {
    p = p || {};
    const g = p.overwrite || p.clobber || !1, { srcStat: w, isChangingCase: m = !1 } = s.checkPathsSync(c, d, "move", p);
    return s.checkParentPathsSync(c, w, d, "move"), u(d) || i(e.dirname(d)), o(c, d, g, m);
  }
  function u(c) {
    const d = e.dirname(c);
    return e.parse(d).root === d;
  }
  function o(c, d, p, g) {
    if (g) return f(c, d, p);
    if (p)
      return n(d), f(c, d, p);
    if (r.existsSync(d)) throw new Error("dest already exists.");
    return f(c, d, p);
  }
  function f(c, d, p) {
    try {
      r.renameSync(c, d);
    } catch (g) {
      if (g.code !== "EXDEV") throw g;
      return l(c, d, p);
    }
  }
  function l(c, d, p) {
    return t(c, d, {
      overwrite: p,
      errorOnExist: !0
    }), n(c);
  }
  return Ai = a, Ai;
}
var Ri, To;
function Od() {
  if (To) return Ri;
  To = 1;
  const r = pt().fromCallback;
  return Ri = {
    move: r(/* @__PURE__ */ Rd()),
    moveSync: /* @__PURE__ */ Nd()
  }, Ri;
}
var Ni, Co;
function zt() {
  return Co || (Co = 1, Ni = {
    // Export promiseified graceful-fs:
    .../* @__PURE__ */ _r(),
    // Export extra methods:
    .../* @__PURE__ */ ca(),
    .../* @__PURE__ */ md(),
    .../* @__PURE__ */ Sd(),
    .../* @__PURE__ */ Ad(),
    .../* @__PURE__ */ Nt(),
    .../* @__PURE__ */ Od(),
    .../* @__PURE__ */ da(),
    .../* @__PURE__ */ ar(),
    .../* @__PURE__ */ kn()
  }), Ni;
}
var Or = {}, Zt = {}, Oi = {}, er = {}, Ao;
function ha() {
  if (Ao) return er;
  Ao = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.CancellationError = er.CancellationToken = void 0;
  const r = uc;
  let e = class extends r.EventEmitter {
    get cancelled() {
      return this._cancelled || this._parent != null && this._parent.cancelled;
    }
    set parent(i) {
      this.removeParentCancelHandler(), this._parent = i, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
    }
    // babel cannot compile ... correctly for super calls
    constructor(i) {
      super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, i != null && (this.parent = i);
    }
    cancel() {
      this._cancelled = !0, this.emit("cancel");
    }
    onCancel(i) {
      this.cancelled ? i() : this.once("cancel", i);
    }
    createPromise(i) {
      if (this.cancelled)
        return Promise.reject(new t());
      const s = () => {
        if (a != null)
          try {
            this.removeListener("cancel", a), a = null;
          } catch {
          }
      };
      let a = null;
      return new Promise((u, o) => {
        let f = null;
        if (a = () => {
          try {
            f != null && (f(), f = null);
          } finally {
            o(new t());
          }
        }, this.cancelled) {
          a();
          return;
        }
        this.onCancel(a), i(u, o, (l) => {
          f = l;
        });
      }).then((u) => (s(), u)).catch((u) => {
        throw s(), u;
      });
    }
    removeParentCancelHandler() {
      const i = this._parent;
      i != null && this.parentCancelHandler != null && (i.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
    }
    dispose() {
      try {
        this.removeParentCancelHandler();
      } finally {
        this.removeAllListeners(), this._parent = null;
      }
    }
  };
  er.CancellationToken = e;
  class t extends Error {
    constructor() {
      super("cancelled");
    }
  }
  return er.CancellationError = t, er;
}
var yn = {}, Ro;
function Bn() {
  if (Ro) return yn;
  Ro = 1, Object.defineProperty(yn, "__esModule", { value: !0 }), yn.newError = r;
  function r(e, t) {
    const n = new Error(e);
    return n.code = t, n;
  }
  return yn;
}
var Ze = {}, wn = { exports: {} }, vn = { exports: {} }, Ii, No;
function Id() {
  if (No) return Ii;
  No = 1;
  var r = 1e3, e = r * 60, t = e * 60, n = t * 24, i = n * 7, s = n * 365.25;
  Ii = function(l, c) {
    c = c || {};
    var d = typeof l;
    if (d === "string" && l.length > 0)
      return a(l);
    if (d === "number" && isFinite(l))
      return c.long ? o(l) : u(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function a(l) {
    if (l = String(l), !(l.length > 100)) {
      var c = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (c) {
        var d = parseFloat(c[1]), p = (c[2] || "ms").toLowerCase();
        switch (p) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * s;
          case "weeks":
          case "week":
          case "w":
            return d * i;
          case "days":
          case "day":
          case "d":
            return d * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * t;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * r;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
          default:
            return;
        }
      }
    }
  }
  function u(l) {
    var c = Math.abs(l);
    return c >= n ? Math.round(l / n) + "d" : c >= t ? Math.round(l / t) + "h" : c >= e ? Math.round(l / e) + "m" : c >= r ? Math.round(l / r) + "s" : l + "ms";
  }
  function o(l) {
    var c = Math.abs(l);
    return c >= n ? f(l, c, n, "day") : c >= t ? f(l, c, t, "hour") : c >= e ? f(l, c, e, "minute") : c >= r ? f(l, c, r, "second") : l + " ms";
  }
  function f(l, c, d, p) {
    var g = c >= d * 1.5;
    return Math.round(l / d) + " " + p + (g ? "s" : "");
  }
  return Ii;
}
var Pi, Oo;
function pc() {
  if (Oo) return Pi;
  Oo = 1;
  function r(e) {
    n.debug = n, n.default = n, n.coerce = f, n.disable = u, n.enable = s, n.enabled = o, n.humanize = Id(), n.destroy = l, Object.keys(e).forEach((c) => {
      n[c] = e[c];
    }), n.names = [], n.skips = [], n.formatters = {};
    function t(c) {
      let d = 0;
      for (let p = 0; p < c.length; p++)
        d = (d << 5) - d + c.charCodeAt(p), d |= 0;
      return n.colors[Math.abs(d) % n.colors.length];
    }
    n.selectColor = t;
    function n(c) {
      let d, p = null, g, w;
      function m(...E) {
        if (!m.enabled)
          return;
        const C = m, N = Number(/* @__PURE__ */ new Date()), O = N - (d || N);
        C.diff = O, C.prev = d, C.curr = N, d = N, E[0] = n.coerce(E[0]), typeof E[0] != "string" && E.unshift("%O");
        let R = 0;
        E[0] = E[0].replace(/%([a-zA-Z%])/g, (_, S) => {
          if (_ === "%%")
            return "%";
          R++;
          const y = n.formatters[S];
          if (typeof y == "function") {
            const k = E[R];
            _ = y.call(C, k), E.splice(R, 1), R--;
          }
          return _;
        }), n.formatArgs.call(C, E), (C.log || n.log).apply(C, E);
      }
      return m.namespace = c, m.useColors = n.useColors(), m.color = n.selectColor(c), m.extend = i, m.destroy = n.destroy, Object.defineProperty(m, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => p !== null ? p : (g !== n.namespaces && (g = n.namespaces, w = n.enabled(c)), w),
        set: (E) => {
          p = E;
        }
      }), typeof n.init == "function" && n.init(m), m;
    }
    function i(c, d) {
      const p = n(this.namespace + (typeof d > "u" ? ":" : d) + c);
      return p.log = this.log, p;
    }
    function s(c) {
      n.save(c), n.namespaces = c, n.names = [], n.skips = [];
      const d = (typeof c == "string" ? c : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const p of d)
        p[0] === "-" ? n.skips.push(p.slice(1)) : n.names.push(p);
    }
    function a(c, d) {
      let p = 0, g = 0, w = -1, m = 0;
      for (; p < c.length; )
        if (g < d.length && (d[g] === c[p] || d[g] === "*"))
          d[g] === "*" ? (w = g, m = p, g++) : (p++, g++);
        else if (w !== -1)
          g = w + 1, m++, p = m;
        else
          return !1;
      for (; g < d.length && d[g] === "*"; )
        g++;
      return g === d.length;
    }
    function u() {
      const c = [
        ...n.names,
        ...n.skips.map((d) => "-" + d)
      ].join(",");
      return n.enable(""), c;
    }
    function o(c) {
      for (const d of n.skips)
        if (a(c, d))
          return !1;
      for (const d of n.names)
        if (a(c, d))
          return !0;
      return !1;
    }
    function f(c) {
      return c instanceof Error ? c.stack || c.message : c;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return Pi = r, Pi;
}
var Io;
function Pd() {
  return Io || (Io = 1, (function(r, e) {
    e.formatArgs = n, e.save = i, e.load = s, e.useColors = t, e.storage = a(), e.destroy = /* @__PURE__ */ (() => {
      let o = !1;
      return () => {
        o || (o = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), e.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function t() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let o;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (o = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(o[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(o) {
      if (o[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + o[0] + (this.useColors ? "%c " : " ") + "+" + r.exports.humanize(this.diff), !this.useColors)
        return;
      const f = "color: " + this.color;
      o.splice(1, 0, f, "color: inherit");
      let l = 0, c = 0;
      o[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (l++, d === "%c" && (c = l));
      }), o.splice(c, 0, f);
    }
    e.log = console.debug || console.log || (() => {
    });
    function i(o) {
      try {
        o ? e.storage.setItem("debug", o) : e.storage.removeItem("debug");
      } catch {
      }
    }
    function s() {
      let o;
      try {
        o = e.storage.getItem("debug") || e.storage.getItem("DEBUG");
      } catch {
      }
      return !o && typeof process < "u" && "env" in process && (o = process.env.DEBUG), o;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    r.exports = pc()(e);
    const { formatters: u } = r.exports;
    u.j = function(o) {
      try {
        return JSON.stringify(o);
      } catch (f) {
        return "[UnexpectedJSONParseError]: " + f.message;
      }
    };
  })(vn, vn.exports)), vn.exports;
}
var En = { exports: {} }, Di, Po;
function Dd() {
  return Po || (Po = 1, Di = (r, e = process.argv) => {
    const t = r.startsWith("-") ? "" : r.length === 1 ? "-" : "--", n = e.indexOf(t + r), i = e.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), Di;
}
var Li, Do;
function Ld() {
  if (Do) return Li;
  Do = 1;
  const r = $n, e = cc, t = Dd(), { env: n } = process;
  let i;
  t("no-color") || t("no-colors") || t("color=false") || t("color=never") ? i = 0 : (t("color") || t("colors") || t("color=true") || t("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function s(o) {
    return o === 0 ? !1 : {
      level: o,
      hasBasic: !0,
      has256: o >= 2,
      has16m: o >= 3
    };
  }
  function a(o, f) {
    if (i === 0)
      return 0;
    if (t("color=16m") || t("color=full") || t("color=truecolor"))
      return 3;
    if (t("color=256"))
      return 2;
    if (o && !f && i === void 0)
      return 0;
    const l = i || 0;
    if (n.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const c = r.release().split(".");
      return Number(c[0]) >= 10 && Number(c[2]) >= 10586 ? Number(c[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((c) => c in n) || n.CI_NAME === "codeship" ? 1 : l;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const c = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return c >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : l;
  }
  function u(o) {
    const f = a(o, o && o.isTTY);
    return s(f);
  }
  return Li = {
    supportsColor: u,
    stdout: s(a(!0, e.isatty(1))),
    stderr: s(a(!0, e.isatty(2)))
  }, Li;
}
var Lo;
function xd() {
  return Lo || (Lo = 1, (function(r, e) {
    const t = cc, n = ua;
    e.init = l, e.log = u, e.formatArgs = s, e.save = o, e.load = f, e.useColors = i, e.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), e.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = Ld();
      d && (d.stderr || d).level >= 2 && (e.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    e.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, p) => {
      const g = p.substring(6).toLowerCase().replace(/_([a-z])/g, (m, E) => E.toUpperCase());
      let w = process.env[p];
      return /^(yes|on|true|enabled)$/i.test(w) ? w = !0 : /^(no|off|false|disabled)$/i.test(w) ? w = !1 : w === "null" ? w = null : w = Number(w), d[g] = w, d;
    }, {});
    function i() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : t.isatty(process.stderr.fd);
    }
    function s(d) {
      const { namespace: p, useColors: g } = this;
      if (g) {
        const w = this.color, m = "\x1B[3" + (w < 8 ? w : "8;5;" + w), E = `  ${m};1m${p} \x1B[0m`;
        d[0] = E + d[0].split(`
`).join(`
` + E), d.push(m + "m+" + r.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = a() + p + " " + d[0];
    }
    function a() {
      return e.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function u(...d) {
      return process.stderr.write(n.formatWithOptions(e.inspectOpts, ...d) + `
`);
    }
    function o(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function f() {
      return process.env.DEBUG;
    }
    function l(d) {
      d.inspectOpts = {};
      const p = Object.keys(e.inspectOpts);
      for (let g = 0; g < p.length; g++)
        d.inspectOpts[p[g]] = e.inspectOpts[p[g]];
    }
    r.exports = pc()(e);
    const { formatters: c } = r.exports;
    c.o = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts).split(`
`).map((p) => p.trim()).join(" ");
    }, c.O = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts);
    };
  })(En, En.exports)), En.exports;
}
var xo;
function Fd() {
  return xo || (xo = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? wn.exports = Pd() : wn.exports = xd()), wn.exports;
}
var Ir = {}, Fo;
function mc() {
  if (Fo) return Ir;
  Fo = 1, Object.defineProperty(Ir, "__esModule", { value: !0 }), Ir.ProgressCallbackTransform = void 0;
  const r = tn;
  let e = class extends r.Transform {
    constructor(n, i, s) {
      super(), this.total = n, this.cancellationToken = i, this.onProgress = s, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
    }
    _transform(n, i, s) {
      if (this.cancellationToken.cancelled) {
        s(new Error("cancelled"), null);
        return;
      }
      this.transferred += n.length, this.delta += n.length;
      const a = Date.now();
      a >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = a + 1e3, this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.total * 100,
        bytesPerSecond: Math.round(this.transferred / ((a - this.start) / 1e3))
      }), this.delta = 0), s(null, n);
    }
    _flush(n) {
      if (this.cancellationToken.cancelled) {
        n(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.total,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, n(null);
    }
  };
  return Ir.ProgressCallbackTransform = e, Ir;
}
var Uo;
function Ud() {
  if (Uo) return Ze;
  Uo = 1, Object.defineProperty(Ze, "__esModule", { value: !0 }), Ze.DigestTransform = Ze.HttpExecutor = Ze.HttpError = void 0, Ze.createHttpError = f, Ze.parseJson = d, Ze.configureRequestOptionsFromUrl = w, Ze.configureRequestUrl = m, Ze.safeGetHeader = N, Ze.configureRequestOptions = R, Ze.safeStringifyJson = I;
  const r = rn, e = Fd(), t = bt, n = tn, i = Gt, s = ha(), a = Bn(), u = mc(), o = (0, e.default)("electron-builder");
  function f(_, S = null) {
    return new c(_.statusCode || -1, `${_.statusCode} ${_.statusMessage}` + (S == null ? "" : `
` + JSON.stringify(S, null, "  ")) + `
Headers: ` + I(_.headers), S);
  }
  const l = /* @__PURE__ */ new Map([
    [429, "Too many requests"],
    [400, "Bad request"],
    [403, "Forbidden"],
    [404, "Not found"],
    [405, "Method not allowed"],
    [406, "Not acceptable"],
    [408, "Request timeout"],
    [413, "Request entity too large"],
    [500, "Internal server error"],
    [502, "Bad gateway"],
    [503, "Service unavailable"],
    [504, "Gateway timeout"],
    [505, "HTTP version not supported"]
  ]);
  class c extends Error {
    constructor(S, y = `HTTP error: ${l.get(S) || S}`, k = null) {
      super(y), this.statusCode = S, this.description = k, this.name = "HttpError", this.code = `HTTP_ERROR_${S}`;
    }
    isServerError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
  }
  Ze.HttpError = c;
  function d(_) {
    return _.then((S) => S == null || S.length === 0 ? null : JSON.parse(S));
  }
  class p {
    constructor() {
      this.maxRedirects = 10;
    }
    request(S, y = new s.CancellationToken(), k) {
      R(S);
      const B = k == null ? void 0 : JSON.stringify(k), F = B ? Buffer.from(B) : void 0;
      if (F != null) {
        o(B);
        const { headers: q, ...D } = S;
        S = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": F.length,
            ...q
          },
          ...D
        };
      }
      return this.doApiRequest(S, y, (q) => q.end(F));
    }
    doApiRequest(S, y, k, B = 0) {
      return o.enabled && o(`Request: ${I(S)}`), y.createPromise((F, q, D) => {
        const L = this.createRequest(S, (Q) => {
          try {
            this.handleResponse(Q, S, y, F, q, B, k);
          } catch (P) {
            q(P);
          }
        });
        this.addErrorAndTimeoutHandlers(L, q, S.timeout), this.addRedirectHandlers(L, S, q, B, (Q) => {
          this.doApiRequest(Q, y, k, B).then(F).catch(q);
        }), k(L, q), D(() => L.abort());
      });
    }
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line
    addRedirectHandlers(S, y, k, B, F) {
    }
    addErrorAndTimeoutHandlers(S, y, k = 60 * 1e3) {
      this.addTimeOutHandler(S, y, k), S.on("error", y), S.on("aborted", () => {
        y(new Error("Request has been aborted by the server"));
      });
    }
    handleResponse(S, y, k, B, F, q, D) {
      var L;
      if (o.enabled && o(`Response: ${S.statusCode} ${S.statusMessage}, request options: ${I(y)}`), S.statusCode === 404) {
        F(f(S, `method: ${y.method || "GET"} url: ${y.protocol || "https:"}//${y.hostname}${y.port ? `:${y.port}` : ""}${y.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
        return;
      } else if (S.statusCode === 204) {
        B();
        return;
      }
      const Q = (L = S.statusCode) !== null && L !== void 0 ? L : 0, P = Q >= 300 && Q < 400, G = N(S, "location");
      if (P && G != null) {
        if (q > this.maxRedirects) {
          F(this.createMaxRedirectError());
          return;
        }
        this.doApiRequest(p.prepareRedirectUrlOptions(G, y), k, D, q).then(B).catch(F);
        return;
      }
      S.setEncoding("utf8");
      let V = "";
      S.on("error", F), S.on("data", (ie) => V += ie), S.on("end", () => {
        try {
          if (S.statusCode != null && S.statusCode >= 400) {
            const ie = N(S, "content-type"), ye = ie != null && (Array.isArray(ie) ? ie.find((oe) => oe.includes("json")) != null : ie.includes("json"));
            F(f(S, `method: ${y.method || "GET"} url: ${y.protocol || "https:"}//${y.hostname}${y.port ? `:${y.port}` : ""}${y.path}

          Data:
          ${ye ? JSON.stringify(JSON.parse(V)) : V}
          `));
          } else
            B(V.length === 0 ? null : V);
        } catch (ie) {
          F(ie);
        }
      });
    }
    async downloadToBuffer(S, y) {
      return await y.cancellationToken.createPromise((k, B, F) => {
        const q = [], D = {
          headers: y.headers || void 0,
          // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
          redirect: "manual"
        };
        m(S, D), R(D), this.doDownload(D, {
          destination: null,
          options: y,
          onCancel: F,
          callback: (L) => {
            L == null ? k(Buffer.concat(q)) : B(L);
          },
          responseHandler: (L, Q) => {
            let P = 0;
            L.on("data", (G) => {
              if (P += G.length, P > 524288e3) {
                Q(new Error("Maximum allowed size is 500 MB"));
                return;
              }
              q.push(G);
            }), L.on("end", () => {
              Q(null);
            });
          }
        }, 0);
      });
    }
    doDownload(S, y, k) {
      const B = this.createRequest(S, (F) => {
        if (F.statusCode >= 400) {
          y.callback(new Error(`Cannot download "${S.protocol || "https:"}//${S.hostname}${S.path}", status ${F.statusCode}: ${F.statusMessage}`));
          return;
        }
        F.on("error", y.callback);
        const q = N(F, "location");
        if (q != null) {
          k < this.maxRedirects ? this.doDownload(p.prepareRedirectUrlOptions(q, S), y, k++) : y.callback(this.createMaxRedirectError());
          return;
        }
        y.responseHandler == null ? O(y, F) : y.responseHandler(F, y.callback);
      });
      this.addErrorAndTimeoutHandlers(B, y.callback, S.timeout), this.addRedirectHandlers(B, S, y.callback, k, (F) => {
        this.doDownload(F, y, k++);
      }), B.end();
    }
    createMaxRedirectError() {
      return new Error(`Too many redirects (> ${this.maxRedirects})`);
    }
    addTimeOutHandler(S, y, k) {
      S.on("socket", (B) => {
        B.setTimeout(k, () => {
          S.abort(), y(new Error("Request timed out"));
        });
      });
    }
    static prepareRedirectUrlOptions(S, y) {
      const k = w(S, { ...y }), B = k.headers;
      if (B?.authorization) {
        const F = p.reconstructOriginalUrl(y), q = g(S, y);
        p.isCrossOriginRedirect(F, q) && (o.enabled && o(`Given the cross-origin redirect (from ${F.host} to ${q.host}), the Authorization header will be stripped out.`), delete B.authorization);
      }
      return k;
    }
    static reconstructOriginalUrl(S) {
      const y = S.protocol || "https:";
      if (!S.hostname)
        throw new Error("Missing hostname in request options");
      const k = S.hostname, B = S.port ? `:${S.port}` : "", F = S.path || "/";
      return new i.URL(`${y}//${k}${B}${F}`);
    }
    static isCrossOriginRedirect(S, y) {
      if (S.hostname.toLowerCase() !== y.hostname.toLowerCase())
        return !0;
      if (S.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
      ["80", ""].includes(S.port) && y.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
      ["443", ""].includes(y.port))
        return !1;
      if (S.protocol !== y.protocol)
        return !0;
      const k = S.port, B = y.port;
      return k !== B;
    }
    static retryOnServerError(S, y = 3) {
      for (let k = 0; ; k++)
        try {
          return S();
        } catch (B) {
          if (k < y && (B instanceof c && B.isServerError() || B.code === "EPIPE"))
            continue;
          throw B;
        }
    }
  }
  Ze.HttpExecutor = p;
  function g(_, S) {
    try {
      return new i.URL(_);
    } catch {
      const y = S.hostname, k = S.protocol || "https:", B = S.port ? `:${S.port}` : "", F = `${k}//${y}${B}`;
      return new i.URL(_, F);
    }
  }
  function w(_, S) {
    const y = R(S), k = g(_, S);
    return m(k, y), y;
  }
  function m(_, S) {
    S.protocol = _.protocol, S.hostname = _.hostname, _.port ? S.port = _.port : S.port && delete S.port, S.path = _.pathname + _.search;
  }
  class E extends n.Transform {
    // noinspection JSUnusedGlobalSymbols
    get actual() {
      return this._actual;
    }
    constructor(S, y = "sha512", k = "base64") {
      super(), this.expected = S, this.algorithm = y, this.encoding = k, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, r.createHash)(y);
    }
    // noinspection JSUnusedGlobalSymbols
    _transform(S, y, k) {
      this.digester.update(S), k(null, S);
    }
    // noinspection JSUnusedGlobalSymbols
    _flush(S) {
      if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
        try {
          this.validate();
        } catch (y) {
          S(y);
          return;
        }
      S(null);
    }
    validate() {
      if (this._actual == null)
        throw (0, a.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
      if (this._actual !== this.expected)
        throw (0, a.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
      return null;
    }
  }
  Ze.DigestTransform = E;
  function C(_, S, y) {
    return _ != null && S != null && _ !== S ? (y(new Error(`checksum mismatch: expected ${S} but got ${_} (X-Checksum-Sha2 header)`)), !1) : !0;
  }
  function N(_, S) {
    const y = _.headers[S];
    return y == null ? null : Array.isArray(y) ? y.length === 0 ? null : y[y.length - 1] : y;
  }
  function O(_, S) {
    if (!C(N(S, "X-Checksum-Sha2"), _.options.sha2, _.callback))
      return;
    const y = [];
    if (_.options.onProgress != null) {
      const q = N(S, "content-length");
      q != null && y.push(new u.ProgressCallbackTransform(parseInt(q, 10), _.options.cancellationToken, _.options.onProgress));
    }
    const k = _.options.sha512;
    k != null ? y.push(new E(k, "sha512", k.length === 128 && !k.includes("+") && !k.includes("Z") && !k.includes("=") ? "hex" : "base64")) : _.options.sha2 != null && y.push(new E(_.options.sha2, "sha256", "hex"));
    const B = (0, t.createWriteStream)(_.destination);
    y.push(B);
    let F = S;
    for (const q of y)
      q.on("error", (D) => {
        B.close(), _.options.cancellationToken.cancelled || _.callback(D);
      }), F = F.pipe(q);
    B.on("finish", () => {
      B.close(_.callback);
    });
  }
  function R(_, S, y) {
    y != null && (_.method = y), _.headers = { ..._.headers };
    const k = _.headers;
    return S != null && (k.authorization = S.startsWith("Basic") || S.startsWith("Bearer") ? S : `token ${S}`), k["User-Agent"] == null && (k["User-Agent"] = "electron-builder"), (y == null || y === "GET" || k["Cache-Control"] == null) && (k["Cache-Control"] = "no-cache"), _.protocol == null && process.versions.electron != null && (_.protocol = "https:"), _;
  }
  function I(_, S) {
    return JSON.stringify(_, (y, k) => y.endsWith("Authorization") || y.endsWith("authorization") || y.endsWith("Password") || y.endsWith("PASSWORD") || y.endsWith("Token") || y.includes("password") || y.includes("token") || S != null && S.has(y) ? "<stripped sensitive data>" : k, 2);
  }
  return Ze;
}
var Pr = {}, qo;
function qd() {
  if (qo) return Pr;
  qo = 1, Object.defineProperty(Pr, "__esModule", { value: !0 }), Pr.MemoLazy = void 0;
  let r = class {
    constructor(n, i) {
      this.selector = n, this.creator = i, this.selected = void 0, this._value = void 0;
    }
    get hasValue() {
      return this._value !== void 0;
    }
    get value() {
      const n = this.selector();
      if (this._value !== void 0 && e(this.selected, n))
        return this._value;
      this.selected = n;
      const i = this.creator(n);
      return this.value = i, i;
    }
    set value(n) {
      this._value = n;
    }
  };
  Pr.MemoLazy = r;
  function e(t, n) {
    if (typeof t == "object" && t !== null && (typeof n == "object" && n !== null)) {
      const a = Object.keys(t), u = Object.keys(n);
      return a.length === u.length && a.every((o) => e(t[o], n[o]));
    }
    return t === n;
  }
  return Pr;
}
var hr = {}, $o;
function $d() {
  if ($o) return hr;
  $o = 1, Object.defineProperty(hr, "__esModule", { value: !0 }), hr.githubUrl = r, hr.githubTagPrefix = e, hr.getS3LikeProviderBaseUrl = t;
  function r(a, u = "github.com") {
    return `${a.protocol || "https"}://${a.host || u}`;
  }
  function e(a) {
    var u;
    return a.tagNamePrefix ? a.tagNamePrefix : !((u = a.vPrefixedTagName) !== null && u !== void 0) || u ? "v" : "";
  }
  function t(a) {
    const u = a.provider;
    if (u === "s3")
      return n(a);
    if (u === "spaces")
      return s(a);
    throw new Error(`Not supported provider: ${u}`);
  }
  function n(a) {
    let u;
    if (a.accelerate == !0)
      u = `https://${a.bucket}.s3-accelerate.amazonaws.com`;
    else if (a.endpoint != null)
      u = `${a.endpoint}/${a.bucket}`;
    else if (a.bucket.includes(".")) {
      if (a.region == null)
        throw new Error(`Bucket name "${a.bucket}" includes a dot, but S3 region is missing`);
      a.region === "us-east-1" ? u = `https://s3.amazonaws.com/${a.bucket}` : u = `https://s3-${a.region}.amazonaws.com/${a.bucket}`;
    } else a.region === "cn-north-1" ? u = `https://${a.bucket}.s3.${a.region}.amazonaws.com.cn` : u = `https://${a.bucket}.s3.amazonaws.com`;
    return i(u, a.path);
  }
  function i(a, u) {
    return u != null && u.length > 0 && (u.startsWith("/") || (a += "/"), a += u), a;
  }
  function s(a) {
    if (a.name == null)
      throw new Error("name is missing");
    if (a.region == null)
      throw new Error("region is missing");
    return i(`https://${a.name}.${a.region}.digitaloceanspaces.com`, a.path);
  }
  return hr;
}
var Sn = {}, ko;
function kd() {
  if (ko) return Sn;
  ko = 1, Object.defineProperty(Sn, "__esModule", { value: !0 }), Sn.retry = e;
  const r = ha();
  async function e(t, n) {
    var i;
    const { retries: s, interval: a, backoff: u = 0, attempt: o = 0, shouldRetry: f, cancellationToken: l = new r.CancellationToken() } = n;
    try {
      return await t();
    } catch (c) {
      if (await Promise.resolve((i = f?.(c)) !== null && i !== void 0 ? i : !0) && s > 0 && !l.cancelled)
        return await new Promise((d) => setTimeout(d, a + u * o)), await e(t, { ...n, retries: s - 1, attempt: o + 1 });
      throw c;
    }
  }
  return Sn;
}
var bn = {}, Bo;
function Bd() {
  if (Bo) return bn;
  Bo = 1, Object.defineProperty(bn, "__esModule", { value: !0 }), bn.parseDn = r;
  function r(e) {
    let t = !1, n = null, i = "", s = 0;
    e = e.trim();
    const a = /* @__PURE__ */ new Map();
    for (let u = 0; u <= e.length; u++) {
      if (u === e.length) {
        n !== null && a.set(n, i);
        break;
      }
      const o = e[u];
      if (t) {
        if (o === '"') {
          t = !1;
          continue;
        }
      } else {
        if (o === '"') {
          t = !0;
          continue;
        }
        if (o === "\\") {
          u++;
          const f = parseInt(e.slice(u, u + 2), 16);
          Number.isNaN(f) ? i += e[u] : (u++, i += String.fromCharCode(f));
          continue;
        }
        if (n === null && o === "=") {
          n = i, i = "";
          continue;
        }
        if (o === "," || o === ";" || o === "+") {
          n !== null && a.set(n, i), n = null, i = "";
          continue;
        }
      }
      if (o === " " && !t) {
        if (i.length === 0)
          continue;
        if (u > s) {
          let f = u;
          for (; e[f] === " "; )
            f++;
          s = f;
        }
        if (s >= e.length || e[s] === "," || e[s] === ";" || n === null && e[s] === "=" || n !== null && e[s] === "+") {
          u = s - 1;
          continue;
        }
      }
      i += o;
    }
    return a;
  }
  return bn;
}
var tr = {}, Mo;
function Md() {
  if (Mo) return tr;
  Mo = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.nil = tr.UUID = void 0;
  const r = rn, e = Bn(), t = "options.name must be either a string or a Buffer", n = (0, r.randomBytes)(16);
  n[0] = n[0] | 1;
  const i = {}, s = [];
  for (let c = 0; c < 256; c++) {
    const d = (c + 256).toString(16).substr(1);
    i[d] = c, s[c] = d;
  }
  class a {
    constructor(d) {
      this.ascii = null, this.binary = null;
      const p = a.check(d);
      if (!p)
        throw new Error("not a UUID");
      this.version = p.version, p.format === "ascii" ? this.ascii = d : this.binary = d;
    }
    static v5(d, p) {
      return f(d, "sha1", 80, p);
    }
    toString() {
      return this.ascii == null && (this.ascii = l(this.binary)), this.ascii;
    }
    inspect() {
      return `UUID v${this.version} ${this.toString()}`;
    }
    static check(d, p = 0) {
      if (typeof d == "string")
        return d = d.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(d) ? d === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
          version: (i[d[14] + d[15]] & 240) >> 4,
          variant: u((i[d[19] + d[20]] & 224) >> 5),
          format: "ascii"
        } : !1;
      if (Buffer.isBuffer(d)) {
        if (d.length < p + 16)
          return !1;
        let g = 0;
        for (; g < 16 && d[p + g] === 0; g++)
          ;
        return g === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
          version: (d[p + 6] & 240) >> 4,
          variant: u((d[p + 8] & 224) >> 5),
          format: "binary"
        };
      }
      throw (0, e.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
    }
    // read stringified uuid into a Buffer
    static parse(d) {
      const p = Buffer.allocUnsafe(16);
      let g = 0;
      for (let w = 0; w < 16; w++)
        p[w] = i[d[g++] + d[g++]], (w === 3 || w === 5 || w === 7 || w === 9) && (g += 1);
      return p;
    }
  }
  tr.UUID = a, a.OID = a.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
  function u(c) {
    switch (c) {
      case 0:
      case 1:
      case 3:
        return "ncs";
      case 4:
      case 5:
        return "rfc4122";
      case 6:
        return "microsoft";
      default:
        return "future";
    }
  }
  var o;
  (function(c) {
    c[c.ASCII = 0] = "ASCII", c[c.BINARY = 1] = "BINARY", c[c.OBJECT = 2] = "OBJECT";
  })(o || (o = {}));
  function f(c, d, p, g, w = o.ASCII) {
    const m = (0, r.createHash)(d);
    if (typeof c != "string" && !Buffer.isBuffer(c))
      throw (0, e.newError)(t, "ERR_INVALID_UUID_NAME");
    m.update(g), m.update(c);
    const C = m.digest();
    let N;
    switch (w) {
      case o.BINARY:
        C[6] = C[6] & 15 | p, C[8] = C[8] & 63 | 128, N = C;
        break;
      case o.OBJECT:
        C[6] = C[6] & 15 | p, C[8] = C[8] & 63 | 128, N = new a(C);
        break;
      default:
        N = s[C[0]] + s[C[1]] + s[C[2]] + s[C[3]] + "-" + s[C[4]] + s[C[5]] + "-" + s[C[6] & 15 | p] + s[C[7]] + "-" + s[C[8] & 63 | 128] + s[C[9]] + "-" + s[C[10]] + s[C[11]] + s[C[12]] + s[C[13]] + s[C[14]] + s[C[15]];
        break;
    }
    return N;
  }
  function l(c) {
    return s[c[0]] + s[c[1]] + s[c[2]] + s[c[3]] + "-" + s[c[4]] + s[c[5]] + "-" + s[c[6]] + s[c[7]] + "-" + s[c[8]] + s[c[9]] + "-" + s[c[10]] + s[c[11]] + s[c[12]] + s[c[13]] + s[c[14]] + s[c[15]];
  }
  return tr.nil = new a("00000000-0000-0000-0000-000000000000"), tr;
}
var pr = {}, xi = {}, jo;
function jd() {
  return jo || (jo = 1, (function(r) {
    (function(e) {
      e.parser = function(b, v) {
        return new n(b, v);
      }, e.SAXParser = n, e.SAXStream = l, e.createStream = f, e.MAX_BUFFER_LENGTH = 64 * 1024;
      var t = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      e.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function n(b, v) {
        if (!(this instanceof n))
          return new n(b, v);
        var H = this;
        s(H), H.q = H.c = "", H.bufferCheckPosition = e.MAX_BUFFER_LENGTH, H.opt = v || {}, H.opt.lowercase = H.opt.lowercase || H.opt.lowercasetags, H.looseCase = H.opt.lowercase ? "toLowerCase" : "toUpperCase", H.tags = [], H.closed = H.closedRoot = H.sawRoot = !1, H.tag = H.error = null, H.strict = !!b, H.noscript = !!(b || H.opt.noscript), H.state = y.BEGIN, H.strictEntities = H.opt.strictEntities, H.ENTITIES = H.strictEntities ? Object.create(e.XML_ENTITIES) : Object.create(e.ENTITIES), H.attribList = [], H.opt.xmlns && (H.ns = Object.create(w)), H.opt.unquotedAttributeValues === void 0 && (H.opt.unquotedAttributeValues = !b), H.trackPosition = H.opt.position !== !1, H.trackPosition && (H.position = H.line = H.column = 0), B(H, "onready");
      }
      Object.create || (Object.create = function(b) {
        function v() {
        }
        v.prototype = b;
        var H = new v();
        return H;
      }), Object.keys || (Object.keys = function(b) {
        var v = [];
        for (var H in b) b.hasOwnProperty(H) && v.push(H);
        return v;
      });
      function i(b) {
        for (var v = Math.max(e.MAX_BUFFER_LENGTH, 10), H = 0, x = 0, pe = t.length; x < pe; x++) {
          var we = b[t[x]].length;
          if (we > v)
            switch (t[x]) {
              case "textNode":
                q(b);
                break;
              case "cdata":
                F(b, "oncdata", b.cdata), b.cdata = "";
                break;
              case "script":
                F(b, "onscript", b.script), b.script = "";
                break;
              default:
                L(b, "Max buffer length exceeded: " + t[x]);
            }
          H = Math.max(H, we);
        }
        var ve = e.MAX_BUFFER_LENGTH - H;
        b.bufferCheckPosition = ve + b.position;
      }
      function s(b) {
        for (var v = 0, H = t.length; v < H; v++)
          b[t[v]] = "";
      }
      function a(b) {
        q(b), b.cdata !== "" && (F(b, "oncdata", b.cdata), b.cdata = ""), b.script !== "" && (F(b, "onscript", b.script), b.script = "");
      }
      n.prototype = {
        end: function() {
          Q(this);
        },
        write: Se,
        resume: function() {
          return this.error = null, this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          a(this);
        }
      };
      var u;
      try {
        u = require("stream").Stream;
      } catch {
        u = function() {
        };
      }
      u || (u = function() {
      });
      var o = e.EVENTS.filter(function(b) {
        return b !== "error" && b !== "end";
      });
      function f(b, v) {
        return new l(b, v);
      }
      function l(b, v) {
        if (!(this instanceof l))
          return new l(b, v);
        u.apply(this), this._parser = new n(b, v), this.writable = !0, this.readable = !0;
        var H = this;
        this._parser.onend = function() {
          H.emit("end");
        }, this._parser.onerror = function(x) {
          H.emit("error", x), H._parser.error = null;
        }, this._decoder = null, o.forEach(function(x) {
          Object.defineProperty(H, "on" + x, {
            get: function() {
              return H._parser["on" + x];
            },
            set: function(pe) {
              if (!pe)
                return H.removeAllListeners(x), H._parser["on" + x] = pe, pe;
              H.on(x, pe);
            },
            enumerable: !0,
            configurable: !1
          });
        });
      }
      l.prototype = Object.create(u.prototype, {
        constructor: {
          value: l
        }
      }), l.prototype.write = function(b) {
        return typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(b) && (this._decoder || (this._decoder = new TextDecoder("utf8")), b = this._decoder.decode(b, { stream: !0 })), this._parser.write(b.toString()), this.emit("data", b), !0;
      }, l.prototype.end = function(b) {
        if (b && b.length && this.write(b), this._decoder) {
          var v = this._decoder.decode();
          v && (this._parser.write(v), this.emit("data", v));
        }
        return this._parser.end(), !0;
      }, l.prototype.on = function(b, v) {
        var H = this;
        return !H._parser["on" + b] && o.indexOf(b) !== -1 && (H._parser["on" + b] = function() {
          var x = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          x.splice(0, 0, b), H.emit.apply(H, x);
        }), u.prototype.on.call(H, b, v);
      };
      var c = "[CDATA[", d = "DOCTYPE", p = "http://www.w3.org/XML/1998/namespace", g = "http://www.w3.org/2000/xmlns/", w = { xml: p, xmlns: g }, m = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, E = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, C = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, N = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function O(b) {
        return b === " " || b === `
` || b === "\r" || b === "	";
      }
      function R(b) {
        return b === '"' || b === "'";
      }
      function I(b) {
        return b === ">" || O(b);
      }
      function _(b, v) {
        return b.test(v);
      }
      function S(b, v) {
        return !_(b, v);
      }
      var y = 0;
      e.STATE = {
        BEGIN: y++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: y++,
        // leading whitespace
        TEXT: y++,
        // general stuff
        TEXT_ENTITY: y++,
        // &amp and such.
        OPEN_WAKA: y++,
        // <
        SGML_DECL: y++,
        // <!BLARG
        SGML_DECL_QUOTED: y++,
        // <!BLARG foo "bar
        DOCTYPE: y++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: y++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: y++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: y++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: y++,
        // <!-
        COMMENT: y++,
        // <!--
        COMMENT_ENDING: y++,
        // <!-- blah -
        COMMENT_ENDED: y++,
        // <!-- blah --
        CDATA: y++,
        // <![CDATA[ something
        CDATA_ENDING: y++,
        // ]
        CDATA_ENDING_2: y++,
        // ]]
        PROC_INST: y++,
        // <?hi
        PROC_INST_BODY: y++,
        // <?hi there
        PROC_INST_ENDING: y++,
        // <?hi "there" ?
        OPEN_TAG: y++,
        // <strong
        OPEN_TAG_SLASH: y++,
        // <strong /
        ATTRIB: y++,
        // <a
        ATTRIB_NAME: y++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: y++,
        // <a foo _
        ATTRIB_VALUE: y++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: y++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: y++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: y++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: y++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: y++,
        // <foo bar=&quot
        CLOSE_TAG: y++,
        // </a
        CLOSE_TAG_SAW_WHITE: y++,
        // </a   >
        SCRIPT: y++,
        // <script> ...
        SCRIPT_ENDING: y++
        // <script> ... <
      }, e.XML_ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'"
      }, e.ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'",
        AElig: 198,
        Aacute: 193,
        Acirc: 194,
        Agrave: 192,
        Aring: 197,
        Atilde: 195,
        Auml: 196,
        Ccedil: 199,
        ETH: 208,
        Eacute: 201,
        Ecirc: 202,
        Egrave: 200,
        Euml: 203,
        Iacute: 205,
        Icirc: 206,
        Igrave: 204,
        Iuml: 207,
        Ntilde: 209,
        Oacute: 211,
        Ocirc: 212,
        Ograve: 210,
        Oslash: 216,
        Otilde: 213,
        Ouml: 214,
        THORN: 222,
        Uacute: 218,
        Ucirc: 219,
        Ugrave: 217,
        Uuml: 220,
        Yacute: 221,
        aacute: 225,
        acirc: 226,
        aelig: 230,
        agrave: 224,
        aring: 229,
        atilde: 227,
        auml: 228,
        ccedil: 231,
        eacute: 233,
        ecirc: 234,
        egrave: 232,
        eth: 240,
        euml: 235,
        iacute: 237,
        icirc: 238,
        igrave: 236,
        iuml: 239,
        ntilde: 241,
        oacute: 243,
        ocirc: 244,
        ograve: 242,
        oslash: 248,
        otilde: 245,
        ouml: 246,
        szlig: 223,
        thorn: 254,
        uacute: 250,
        ucirc: 251,
        ugrave: 249,
        uuml: 252,
        yacute: 253,
        yuml: 255,
        copy: 169,
        reg: 174,
        nbsp: 160,
        iexcl: 161,
        cent: 162,
        pound: 163,
        curren: 164,
        yen: 165,
        brvbar: 166,
        sect: 167,
        uml: 168,
        ordf: 170,
        laquo: 171,
        not: 172,
        shy: 173,
        macr: 175,
        deg: 176,
        plusmn: 177,
        sup1: 185,
        sup2: 178,
        sup3: 179,
        acute: 180,
        micro: 181,
        para: 182,
        middot: 183,
        cedil: 184,
        ordm: 186,
        raquo: 187,
        frac14: 188,
        frac12: 189,
        frac34: 190,
        iquest: 191,
        times: 215,
        divide: 247,
        OElig: 338,
        oelig: 339,
        Scaron: 352,
        scaron: 353,
        Yuml: 376,
        fnof: 402,
        circ: 710,
        tilde: 732,
        Alpha: 913,
        Beta: 914,
        Gamma: 915,
        Delta: 916,
        Epsilon: 917,
        Zeta: 918,
        Eta: 919,
        Theta: 920,
        Iota: 921,
        Kappa: 922,
        Lambda: 923,
        Mu: 924,
        Nu: 925,
        Xi: 926,
        Omicron: 927,
        Pi: 928,
        Rho: 929,
        Sigma: 931,
        Tau: 932,
        Upsilon: 933,
        Phi: 934,
        Chi: 935,
        Psi: 936,
        Omega: 937,
        alpha: 945,
        beta: 946,
        gamma: 947,
        delta: 948,
        epsilon: 949,
        zeta: 950,
        eta: 951,
        theta: 952,
        iota: 953,
        kappa: 954,
        lambda: 955,
        mu: 956,
        nu: 957,
        xi: 958,
        omicron: 959,
        pi: 960,
        rho: 961,
        sigmaf: 962,
        sigma: 963,
        tau: 964,
        upsilon: 965,
        phi: 966,
        chi: 967,
        psi: 968,
        omega: 969,
        thetasym: 977,
        upsih: 978,
        piv: 982,
        ensp: 8194,
        emsp: 8195,
        thinsp: 8201,
        zwnj: 8204,
        zwj: 8205,
        lrm: 8206,
        rlm: 8207,
        ndash: 8211,
        mdash: 8212,
        lsquo: 8216,
        rsquo: 8217,
        sbquo: 8218,
        ldquo: 8220,
        rdquo: 8221,
        bdquo: 8222,
        dagger: 8224,
        Dagger: 8225,
        bull: 8226,
        hellip: 8230,
        permil: 8240,
        prime: 8242,
        Prime: 8243,
        lsaquo: 8249,
        rsaquo: 8250,
        oline: 8254,
        frasl: 8260,
        euro: 8364,
        image: 8465,
        weierp: 8472,
        real: 8476,
        trade: 8482,
        alefsym: 8501,
        larr: 8592,
        uarr: 8593,
        rarr: 8594,
        darr: 8595,
        harr: 8596,
        crarr: 8629,
        lArr: 8656,
        uArr: 8657,
        rArr: 8658,
        dArr: 8659,
        hArr: 8660,
        forall: 8704,
        part: 8706,
        exist: 8707,
        empty: 8709,
        nabla: 8711,
        isin: 8712,
        notin: 8713,
        ni: 8715,
        prod: 8719,
        sum: 8721,
        minus: 8722,
        lowast: 8727,
        radic: 8730,
        prop: 8733,
        infin: 8734,
        ang: 8736,
        and: 8743,
        or: 8744,
        cap: 8745,
        cup: 8746,
        int: 8747,
        there4: 8756,
        sim: 8764,
        cong: 8773,
        asymp: 8776,
        ne: 8800,
        equiv: 8801,
        le: 8804,
        ge: 8805,
        sub: 8834,
        sup: 8835,
        nsub: 8836,
        sube: 8838,
        supe: 8839,
        oplus: 8853,
        otimes: 8855,
        perp: 8869,
        sdot: 8901,
        lceil: 8968,
        rceil: 8969,
        lfloor: 8970,
        rfloor: 8971,
        lang: 9001,
        rang: 9002,
        loz: 9674,
        spades: 9824,
        clubs: 9827,
        hearts: 9829,
        diams: 9830
      }, Object.keys(e.ENTITIES).forEach(function(b) {
        var v = e.ENTITIES[b], H = typeof v == "number" ? String.fromCharCode(v) : v;
        e.ENTITIES[b] = H;
      });
      for (var k in e.STATE)
        e.STATE[e.STATE[k]] = k;
      y = e.STATE;
      function B(b, v, H) {
        b[v] && b[v](H);
      }
      function F(b, v, H) {
        b.textNode && q(b), B(b, v, H);
      }
      function q(b) {
        b.textNode = D(b.opt, b.textNode), b.textNode && B(b, "ontext", b.textNode), b.textNode = "";
      }
      function D(b, v) {
        return b.trim && (v = v.trim()), b.normalize && (v = v.replace(/\s+/g, " ")), v;
      }
      function L(b, v) {
        return q(b), b.trackPosition && (v += `
Line: ` + b.line + `
Column: ` + b.column + `
Char: ` + b.c), v = new Error(v), b.error = v, B(b, "onerror", v), b;
      }
      function Q(b) {
        return b.sawRoot && !b.closedRoot && P(b, "Unclosed root tag"), b.state !== y.BEGIN && b.state !== y.BEGIN_WHITESPACE && b.state !== y.TEXT && L(b, "Unexpected end"), q(b), b.c = "", b.closed = !0, B(b, "onend"), n.call(b, b.strict, b.opt), b;
      }
      function P(b, v) {
        if (typeof b != "object" || !(b instanceof n))
          throw new Error("bad call to strictFail");
        b.strict && L(b, v);
      }
      function G(b) {
        b.strict || (b.tagName = b.tagName[b.looseCase]());
        var v = b.tags[b.tags.length - 1] || b, H = b.tag = { name: b.tagName, attributes: {} };
        b.opt.xmlns && (H.ns = v.ns), b.attribList.length = 0, F(b, "onopentagstart", H);
      }
      function V(b, v) {
        var H = b.indexOf(":"), x = H < 0 ? ["", b] : b.split(":"), pe = x[0], we = x[1];
        return v && b === "xmlns" && (pe = "xmlns", we = ""), { prefix: pe, local: we };
      }
      function ie(b) {
        if (b.strict || (b.attribName = b.attribName[b.looseCase]()), b.attribList.indexOf(b.attribName) !== -1 || b.tag.attributes.hasOwnProperty(b.attribName)) {
          b.attribName = b.attribValue = "";
          return;
        }
        if (b.opt.xmlns) {
          var v = V(b.attribName, !0), H = v.prefix, x = v.local;
          if (H === "xmlns")
            if (x === "xml" && b.attribValue !== p)
              P(
                b,
                "xml: prefix must be bound to " + p + `
Actual: ` + b.attribValue
              );
            else if (x === "xmlns" && b.attribValue !== g)
              P(
                b,
                "xmlns: prefix must be bound to " + g + `
Actual: ` + b.attribValue
              );
            else {
              var pe = b.tag, we = b.tags[b.tags.length - 1] || b;
              pe.ns === we.ns && (pe.ns = Object.create(we.ns)), pe.ns[x] = b.attribValue;
            }
          b.attribList.push([b.attribName, b.attribValue]);
        } else
          b.tag.attributes[b.attribName] = b.attribValue, F(b, "onattribute", {
            name: b.attribName,
            value: b.attribValue
          });
        b.attribName = b.attribValue = "";
      }
      function ye(b, v) {
        if (b.opt.xmlns) {
          var H = b.tag, x = V(b.tagName);
          H.prefix = x.prefix, H.local = x.local, H.uri = H.ns[x.prefix] || "", H.prefix && !H.uri && (P(
            b,
            "Unbound namespace prefix: " + JSON.stringify(b.tagName)
          ), H.uri = x.prefix);
          var pe = b.tags[b.tags.length - 1] || b;
          H.ns && pe.ns !== H.ns && Object.keys(H.ns).forEach(function(h) {
            F(b, "onopennamespace", {
              prefix: h,
              uri: H.ns[h]
            });
          });
          for (var we = 0, ve = b.attribList.length; we < ve; we++) {
            var Ne = b.attribList[we], _e = Ne[0], lt = Ne[1], De = V(_e, !0), rt = De.prefix, xt = De.local, Ot = rt === "" ? "" : H.ns[rt] || "", At = {
              name: _e,
              value: lt,
              prefix: rt,
              local: xt,
              uri: Ot
            };
            rt && rt !== "xmlns" && !Ot && (P(
              b,
              "Unbound namespace prefix: " + JSON.stringify(rt)
            ), At.uri = rt), b.tag.attributes[_e] = At, F(b, "onattribute", At);
          }
          b.attribList.length = 0;
        }
        b.tag.isSelfClosing = !!v, b.sawRoot = !0, b.tags.push(b.tag), F(b, "onopentag", b.tag), v || (!b.noscript && b.tagName.toLowerCase() === "script" ? b.state = y.SCRIPT : b.state = y.TEXT, b.tag = null, b.tagName = ""), b.attribName = b.attribValue = "", b.attribList.length = 0;
      }
      function oe(b) {
        if (!b.tagName) {
          P(b, "Weird empty close tag."), b.textNode += "</>", b.state = y.TEXT;
          return;
        }
        if (b.script) {
          if (b.tagName !== "script") {
            b.script += "</" + b.tagName + ">", b.tagName = "", b.state = y.SCRIPT;
            return;
          }
          F(b, "onscript", b.script), b.script = "";
        }
        var v = b.tags.length, H = b.tagName;
        b.strict || (H = H[b.looseCase]());
        for (var x = H; v--; ) {
          var pe = b.tags[v];
          if (pe.name !== x)
            P(b, "Unexpected close tag");
          else
            break;
        }
        if (v < 0) {
          P(b, "Unmatched closing tag: " + b.tagName), b.textNode += "</" + b.tagName + ">", b.state = y.TEXT;
          return;
        }
        b.tagName = H;
        for (var we = b.tags.length; we-- > v; ) {
          var ve = b.tag = b.tags.pop();
          b.tagName = b.tag.name, F(b, "onclosetag", b.tagName);
          var Ne = {};
          for (var _e in ve.ns)
            Ne[_e] = ve.ns[_e];
          var lt = b.tags[b.tags.length - 1] || b;
          b.opt.xmlns && ve.ns !== lt.ns && Object.keys(ve.ns).forEach(function(De) {
            var rt = ve.ns[De];
            F(b, "onclosenamespace", { prefix: De, uri: rt });
          });
        }
        v === 0 && (b.closedRoot = !0), b.tagName = b.attribValue = b.attribName = "", b.attribList.length = 0, b.state = y.TEXT;
      }
      function Ae(b) {
        var v = b.entity, H = v.toLowerCase(), x, pe = "";
        return b.ENTITIES[v] ? b.ENTITIES[v] : b.ENTITIES[H] ? b.ENTITIES[H] : (v = H, v.charAt(0) === "#" && (v.charAt(1) === "x" ? (v = v.slice(2), x = parseInt(v, 16), pe = x.toString(16)) : (v = v.slice(1), x = parseInt(v, 10), pe = x.toString(10))), v = v.replace(/^0+/, ""), isNaN(x) || pe.toLowerCase() !== v || x < 0 || x > 1114111 ? (P(b, "Invalid character entity"), "&" + b.entity + ";") : String.fromCodePoint(x));
      }
      function be(b, v) {
        v === "<" ? (b.state = y.OPEN_WAKA, b.startTagPosition = b.position) : O(v) || (P(b, "Non-whitespace before first tag."), b.textNode = v, b.state = y.TEXT);
      }
      function ee(b, v) {
        var H = "";
        return v < b.length && (H = b.charAt(v)), H;
      }
      function Se(b) {
        var v = this;
        if (this.error)
          throw this.error;
        if (v.closed)
          return L(
            v,
            "Cannot write after close. Assign an onready handler."
          );
        if (b === null)
          return Q(v);
        typeof b == "object" && (b = b.toString());
        for (var H = 0, x = ""; x = ee(b, H++), v.c = x, !!x; )
          switch (v.trackPosition && (v.position++, x === `
` ? (v.line++, v.column = 0) : v.column++), v.state) {
            case y.BEGIN:
              if (v.state = y.BEGIN_WHITESPACE, x === "\uFEFF")
                continue;
              be(v, x);
              continue;
            case y.BEGIN_WHITESPACE:
              be(v, x);
              continue;
            case y.TEXT:
              if (v.sawRoot && !v.closedRoot) {
                for (var we = H - 1; x && x !== "<" && x !== "&"; )
                  x = ee(b, H++), x && v.trackPosition && (v.position++, x === `
` ? (v.line++, v.column = 0) : v.column++);
                v.textNode += b.substring(we, H - 1);
              }
              x === "<" && !(v.sawRoot && v.closedRoot && !v.strict) ? (v.state = y.OPEN_WAKA, v.startTagPosition = v.position) : (!O(x) && (!v.sawRoot || v.closedRoot) && P(v, "Text data outside of root node."), x === "&" ? v.state = y.TEXT_ENTITY : v.textNode += x);
              continue;
            case y.SCRIPT:
              x === "<" ? v.state = y.SCRIPT_ENDING : v.script += x;
              continue;
            case y.SCRIPT_ENDING:
              x === "/" ? v.state = y.CLOSE_TAG : (v.script += "<" + x, v.state = y.SCRIPT);
              continue;
            case y.OPEN_WAKA:
              if (x === "!")
                v.state = y.SGML_DECL, v.sgmlDecl = "";
              else if (!O(x)) if (_(m, x))
                v.state = y.OPEN_TAG, v.tagName = x;
              else if (x === "/")
                v.state = y.CLOSE_TAG, v.tagName = "";
              else if (x === "?")
                v.state = y.PROC_INST, v.procInstName = v.procInstBody = "";
              else {
                if (P(v, "Unencoded <"), v.startTagPosition + 1 < v.position) {
                  var pe = v.position - v.startTagPosition;
                  x = new Array(pe).join(" ") + x;
                }
                v.textNode += "<" + x, v.state = y.TEXT;
              }
              continue;
            case y.SGML_DECL:
              if (v.sgmlDecl + x === "--") {
                v.state = y.COMMENT, v.comment = "", v.sgmlDecl = "";
                continue;
              }
              v.doctype && v.doctype !== !0 && v.sgmlDecl ? (v.state = y.DOCTYPE_DTD, v.doctype += "<!" + v.sgmlDecl + x, v.sgmlDecl = "") : (v.sgmlDecl + x).toUpperCase() === c ? (F(v, "onopencdata"), v.state = y.CDATA, v.sgmlDecl = "", v.cdata = "") : (v.sgmlDecl + x).toUpperCase() === d ? (v.state = y.DOCTYPE, (v.doctype || v.sawRoot) && P(
                v,
                "Inappropriately located doctype declaration"
              ), v.doctype = "", v.sgmlDecl = "") : x === ">" ? (F(v, "onsgmldeclaration", v.sgmlDecl), v.sgmlDecl = "", v.state = y.TEXT) : (R(x) && (v.state = y.SGML_DECL_QUOTED), v.sgmlDecl += x);
              continue;
            case y.SGML_DECL_QUOTED:
              x === v.q && (v.state = y.SGML_DECL, v.q = ""), v.sgmlDecl += x;
              continue;
            case y.DOCTYPE:
              x === ">" ? (v.state = y.TEXT, F(v, "ondoctype", v.doctype), v.doctype = !0) : (v.doctype += x, x === "[" ? v.state = y.DOCTYPE_DTD : R(x) && (v.state = y.DOCTYPE_QUOTED, v.q = x));
              continue;
            case y.DOCTYPE_QUOTED:
              v.doctype += x, x === v.q && (v.q = "", v.state = y.DOCTYPE);
              continue;
            case y.DOCTYPE_DTD:
              x === "]" ? (v.doctype += x, v.state = y.DOCTYPE) : x === "<" ? (v.state = y.OPEN_WAKA, v.startTagPosition = v.position) : R(x) ? (v.doctype += x, v.state = y.DOCTYPE_DTD_QUOTED, v.q = x) : v.doctype += x;
              continue;
            case y.DOCTYPE_DTD_QUOTED:
              v.doctype += x, x === v.q && (v.state = y.DOCTYPE_DTD, v.q = "");
              continue;
            case y.COMMENT:
              x === "-" ? v.state = y.COMMENT_ENDING : v.comment += x;
              continue;
            case y.COMMENT_ENDING:
              x === "-" ? (v.state = y.COMMENT_ENDED, v.comment = D(v.opt, v.comment), v.comment && F(v, "oncomment", v.comment), v.comment = "") : (v.comment += "-" + x, v.state = y.COMMENT);
              continue;
            case y.COMMENT_ENDED:
              x !== ">" ? (P(v, "Malformed comment"), v.comment += "--" + x, v.state = y.COMMENT) : v.doctype && v.doctype !== !0 ? v.state = y.DOCTYPE_DTD : v.state = y.TEXT;
              continue;
            case y.CDATA:
              for (var we = H - 1; x && x !== "]"; )
                x = ee(b, H++), x && v.trackPosition && (v.position++, x === `
` ? (v.line++, v.column = 0) : v.column++);
              v.cdata += b.substring(we, H - 1), x === "]" && (v.state = y.CDATA_ENDING);
              continue;
            case y.CDATA_ENDING:
              x === "]" ? v.state = y.CDATA_ENDING_2 : (v.cdata += "]" + x, v.state = y.CDATA);
              continue;
            case y.CDATA_ENDING_2:
              x === ">" ? (v.cdata && F(v, "oncdata", v.cdata), F(v, "onclosecdata"), v.cdata = "", v.state = y.TEXT) : x === "]" ? v.cdata += "]" : (v.cdata += "]]" + x, v.state = y.CDATA);
              continue;
            case y.PROC_INST:
              x === "?" ? v.state = y.PROC_INST_ENDING : O(x) ? v.state = y.PROC_INST_BODY : v.procInstName += x;
              continue;
            case y.PROC_INST_BODY:
              if (!v.procInstBody && O(x))
                continue;
              x === "?" ? v.state = y.PROC_INST_ENDING : v.procInstBody += x;
              continue;
            case y.PROC_INST_ENDING:
              x === ">" ? (F(v, "onprocessinginstruction", {
                name: v.procInstName,
                body: v.procInstBody
              }), v.procInstName = v.procInstBody = "", v.state = y.TEXT) : (v.procInstBody += "?" + x, v.state = y.PROC_INST_BODY);
              continue;
            case y.OPEN_TAG:
              _(E, x) ? v.tagName += x : (G(v), x === ">" ? ye(v) : x === "/" ? v.state = y.OPEN_TAG_SLASH : (O(x) || P(v, "Invalid character in tag name"), v.state = y.ATTRIB));
              continue;
            case y.OPEN_TAG_SLASH:
              x === ">" ? (ye(v, !0), oe(v)) : (P(
                v,
                "Forward-slash in opening tag not followed by >"
              ), v.state = y.ATTRIB);
              continue;
            case y.ATTRIB:
              if (O(x))
                continue;
              x === ">" ? ye(v) : x === "/" ? v.state = y.OPEN_TAG_SLASH : _(m, x) ? (v.attribName = x, v.attribValue = "", v.state = y.ATTRIB_NAME) : P(v, "Invalid attribute name");
              continue;
            case y.ATTRIB_NAME:
              x === "=" ? v.state = y.ATTRIB_VALUE : x === ">" ? (P(v, "Attribute without value"), v.attribValue = v.attribName, ie(v), ye(v)) : O(x) ? v.state = y.ATTRIB_NAME_SAW_WHITE : _(E, x) ? v.attribName += x : P(v, "Invalid attribute name");
              continue;
            case y.ATTRIB_NAME_SAW_WHITE:
              if (x === "=")
                v.state = y.ATTRIB_VALUE;
              else {
                if (O(x))
                  continue;
                P(v, "Attribute without value"), v.tag.attributes[v.attribName] = "", v.attribValue = "", F(v, "onattribute", {
                  name: v.attribName,
                  value: ""
                }), v.attribName = "", x === ">" ? ye(v) : _(m, x) ? (v.attribName = x, v.state = y.ATTRIB_NAME) : (P(v, "Invalid attribute name"), v.state = y.ATTRIB);
              }
              continue;
            case y.ATTRIB_VALUE:
              if (O(x))
                continue;
              R(x) ? (v.q = x, v.state = y.ATTRIB_VALUE_QUOTED) : (v.opt.unquotedAttributeValues || L(v, "Unquoted attribute value"), v.state = y.ATTRIB_VALUE_UNQUOTED, v.attribValue = x);
              continue;
            case y.ATTRIB_VALUE_QUOTED:
              if (x !== v.q) {
                x === "&" ? v.state = y.ATTRIB_VALUE_ENTITY_Q : v.attribValue += x;
                continue;
              }
              ie(v), v.q = "", v.state = y.ATTRIB_VALUE_CLOSED;
              continue;
            case y.ATTRIB_VALUE_CLOSED:
              O(x) ? v.state = y.ATTRIB : x === ">" ? ye(v) : x === "/" ? v.state = y.OPEN_TAG_SLASH : _(m, x) ? (P(v, "No whitespace between attributes"), v.attribName = x, v.attribValue = "", v.state = y.ATTRIB_NAME) : P(v, "Invalid attribute name");
              continue;
            case y.ATTRIB_VALUE_UNQUOTED:
              if (!I(x)) {
                x === "&" ? v.state = y.ATTRIB_VALUE_ENTITY_U : v.attribValue += x;
                continue;
              }
              ie(v), x === ">" ? ye(v) : v.state = y.ATTRIB;
              continue;
            case y.CLOSE_TAG:
              if (v.tagName)
                x === ">" ? oe(v) : _(E, x) ? v.tagName += x : v.script ? (v.script += "</" + v.tagName + x, v.tagName = "", v.state = y.SCRIPT) : (O(x) || P(v, "Invalid tagname in closing tag"), v.state = y.CLOSE_TAG_SAW_WHITE);
              else {
                if (O(x))
                  continue;
                S(m, x) ? v.script ? (v.script += "</" + x, v.state = y.SCRIPT) : P(v, "Invalid tagname in closing tag.") : v.tagName = x;
              }
              continue;
            case y.CLOSE_TAG_SAW_WHITE:
              if (O(x))
                continue;
              x === ">" ? oe(v) : P(v, "Invalid characters in closing tag");
              continue;
            case y.TEXT_ENTITY:
            case y.ATTRIB_VALUE_ENTITY_Q:
            case y.ATTRIB_VALUE_ENTITY_U:
              var ve, Ne;
              switch (v.state) {
                case y.TEXT_ENTITY:
                  ve = y.TEXT, Ne = "textNode";
                  break;
                case y.ATTRIB_VALUE_ENTITY_Q:
                  ve = y.ATTRIB_VALUE_QUOTED, Ne = "attribValue";
                  break;
                case y.ATTRIB_VALUE_ENTITY_U:
                  ve = y.ATTRIB_VALUE_UNQUOTED, Ne = "attribValue";
                  break;
              }
              if (x === ";") {
                var _e = Ae(v);
                v.opt.unparsedEntities && !Object.values(e.XML_ENTITIES).includes(_e) ? (v.entity = "", v.state = ve, v.write(_e)) : (v[Ne] += _e, v.entity = "", v.state = ve);
              } else _(v.entity.length ? N : C, x) ? v.entity += x : (P(v, "Invalid character in entity name"), v[Ne] += "&" + v.entity + x, v.entity = "", v.state = ve);
              continue;
            default:
              throw new Error(v, "Unknown state: " + v.state);
          }
        return v.position >= v.bufferCheckPosition && i(v), v;
      }
      String.fromCodePoint || (function() {
        var b = String.fromCharCode, v = Math.floor, H = function() {
          var x = 16384, pe = [], we, ve, Ne = -1, _e = arguments.length;
          if (!_e)
            return "";
          for (var lt = ""; ++Ne < _e; ) {
            var De = Number(arguments[Ne]);
            if (!isFinite(De) || // `NaN`, `+Infinity`, or `-Infinity`
            De < 0 || // not a valid Unicode code point
            De > 1114111 || // not a valid Unicode code point
            v(De) !== De)
              throw RangeError("Invalid code point: " + De);
            De <= 65535 ? pe.push(De) : (De -= 65536, we = (De >> 10) + 55296, ve = De % 1024 + 56320, pe.push(we, ve)), (Ne + 1 === _e || pe.length > x) && (lt += b.apply(null, pe), pe.length = 0);
          }
          return lt;
        };
        Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
          value: H,
          configurable: !0,
          writable: !0
        }) : String.fromCodePoint = H;
      })();
    })(r);
  })(xi)), xi;
}
var Ho;
function Hd() {
  if (Ho) return pr;
  Ho = 1, Object.defineProperty(pr, "__esModule", { value: !0 }), pr.XElement = void 0, pr.parseXml = a;
  const r = jd(), e = Bn();
  class t {
    constructor(o) {
      if (this.name = o, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !o)
        throw (0, e.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
      if (!i(o))
        throw (0, e.newError)(`Invalid element name: ${o}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
    attribute(o) {
      const f = this.attributes === null ? null : this.attributes[o];
      if (f == null)
        throw (0, e.newError)(`No attribute "${o}"`, "ERR_XML_MISSED_ATTRIBUTE");
      return f;
    }
    removeAttribute(o) {
      this.attributes !== null && delete this.attributes[o];
    }
    element(o, f = !1, l = null) {
      const c = this.elementOrNull(o, f);
      if (c === null)
        throw (0, e.newError)(l || `No element "${o}"`, "ERR_XML_MISSED_ELEMENT");
      return c;
    }
    elementOrNull(o, f = !1) {
      if (this.elements === null)
        return null;
      for (const l of this.elements)
        if (s(l, o, f))
          return l;
      return null;
    }
    getElements(o, f = !1) {
      return this.elements === null ? [] : this.elements.filter((l) => s(l, o, f));
    }
    elementValueOrEmpty(o, f = !1) {
      const l = this.elementOrNull(o, f);
      return l === null ? "" : l.value;
    }
  }
  pr.XElement = t;
  const n = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
  function i(u) {
    return n.test(u);
  }
  function s(u, o, f) {
    const l = u.name;
    return l === o || f === !0 && l.length === o.length && l.toLowerCase() === o.toLowerCase();
  }
  function a(u) {
    let o = null;
    const f = r.parser(!0, {}), l = [];
    return f.onopentag = (c) => {
      const d = new t(c.name);
      if (d.attributes = c.attributes, o === null)
        o = d;
      else {
        const p = l[l.length - 1];
        p.elements == null && (p.elements = []), p.elements.push(d);
      }
      l.push(d);
    }, f.onclosetag = () => {
      l.pop();
    }, f.ontext = (c) => {
      l.length > 0 && (l[l.length - 1].value = c);
    }, f.oncdata = (c) => {
      const d = l[l.length - 1];
      d.value = c, d.isCData = !0;
    }, f.onerror = (c) => {
      throw c;
    }, f.write(u), o;
  }
  return pr;
}
var Qo;
function Ye() {
  return Qo || (Qo = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.CURRENT_APP_PACKAGE_FILE_NAME = r.CURRENT_APP_INSTALLER_FILE_NAME = r.XElement = r.parseXml = r.UUID = r.parseDn = r.retry = r.githubTagPrefix = r.githubUrl = r.getS3LikeProviderBaseUrl = r.ProgressCallbackTransform = r.MemoLazy = r.safeStringifyJson = r.safeGetHeader = r.parseJson = r.HttpExecutor = r.HttpError = r.DigestTransform = r.createHttpError = r.configureRequestUrl = r.configureRequestOptionsFromUrl = r.configureRequestOptions = r.newError = r.CancellationToken = r.CancellationError = void 0, r.asArray = c;
    var e = ha();
    Object.defineProperty(r, "CancellationError", { enumerable: !0, get: function() {
      return e.CancellationError;
    } }), Object.defineProperty(r, "CancellationToken", { enumerable: !0, get: function() {
      return e.CancellationToken;
    } });
    var t = Bn();
    Object.defineProperty(r, "newError", { enumerable: !0, get: function() {
      return t.newError;
    } });
    var n = Ud();
    Object.defineProperty(r, "configureRequestOptions", { enumerable: !0, get: function() {
      return n.configureRequestOptions;
    } }), Object.defineProperty(r, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
      return n.configureRequestOptionsFromUrl;
    } }), Object.defineProperty(r, "configureRequestUrl", { enumerable: !0, get: function() {
      return n.configureRequestUrl;
    } }), Object.defineProperty(r, "createHttpError", { enumerable: !0, get: function() {
      return n.createHttpError;
    } }), Object.defineProperty(r, "DigestTransform", { enumerable: !0, get: function() {
      return n.DigestTransform;
    } }), Object.defineProperty(r, "HttpError", { enumerable: !0, get: function() {
      return n.HttpError;
    } }), Object.defineProperty(r, "HttpExecutor", { enumerable: !0, get: function() {
      return n.HttpExecutor;
    } }), Object.defineProperty(r, "parseJson", { enumerable: !0, get: function() {
      return n.parseJson;
    } }), Object.defineProperty(r, "safeGetHeader", { enumerable: !0, get: function() {
      return n.safeGetHeader;
    } }), Object.defineProperty(r, "safeStringifyJson", { enumerable: !0, get: function() {
      return n.safeStringifyJson;
    } });
    var i = qd();
    Object.defineProperty(r, "MemoLazy", { enumerable: !0, get: function() {
      return i.MemoLazy;
    } });
    var s = mc();
    Object.defineProperty(r, "ProgressCallbackTransform", { enumerable: !0, get: function() {
      return s.ProgressCallbackTransform;
    } });
    var a = $d();
    Object.defineProperty(r, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
      return a.getS3LikeProviderBaseUrl;
    } }), Object.defineProperty(r, "githubUrl", { enumerable: !0, get: function() {
      return a.githubUrl;
    } }), Object.defineProperty(r, "githubTagPrefix", { enumerable: !0, get: function() {
      return a.githubTagPrefix;
    } });
    var u = kd();
    Object.defineProperty(r, "retry", { enumerable: !0, get: function() {
      return u.retry;
    } });
    var o = Bd();
    Object.defineProperty(r, "parseDn", { enumerable: !0, get: function() {
      return o.parseDn;
    } });
    var f = Md();
    Object.defineProperty(r, "UUID", { enumerable: !0, get: function() {
      return f.UUID;
    } });
    var l = Hd();
    Object.defineProperty(r, "parseXml", { enumerable: !0, get: function() {
      return l.parseXml;
    } }), Object.defineProperty(r, "XElement", { enumerable: !0, get: function() {
      return l.XElement;
    } }), r.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", r.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
    function c(d) {
      return d == null ? [] : Array.isArray(d) ? d : [d];
    }
  })(Oi)), Oi;
}
var et = {}, _n = {}, $t = {}, Go;
function nn() {
  if (Go) return $t;
  Go = 1;
  function r(a) {
    return typeof a > "u" || a === null;
  }
  function e(a) {
    return typeof a == "object" && a !== null;
  }
  function t(a) {
    return Array.isArray(a) ? a : r(a) ? [] : [a];
  }
  function n(a, u) {
    var o, f, l, c;
    if (u)
      for (c = Object.keys(u), o = 0, f = c.length; o < f; o += 1)
        l = c[o], a[l] = u[l];
    return a;
  }
  function i(a, u) {
    var o = "", f;
    for (f = 0; f < u; f += 1)
      o += a;
    return o;
  }
  function s(a) {
    return a === 0 && Number.NEGATIVE_INFINITY === 1 / a;
  }
  return $t.isNothing = r, $t.isObject = e, $t.toArray = t, $t.repeat = i, $t.isNegativeZero = s, $t.extend = n, $t;
}
var Fi, zo;
function sn() {
  if (zo) return Fi;
  zo = 1;
  function r(t, n) {
    var i = "", s = t.reason || "(unknown reason)";
    return t.mark ? (t.mark.name && (i += 'in "' + t.mark.name + '" '), i += "(" + (t.mark.line + 1) + ":" + (t.mark.column + 1) + ")", !n && t.mark.snippet && (i += `

` + t.mark.snippet), s + " " + i) : s;
  }
  function e(t, n) {
    Error.call(this), this.name = "YAMLException", this.reason = t, this.mark = n, this.message = r(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return e.prototype = Object.create(Error.prototype), e.prototype.constructor = e, e.prototype.toString = function(n) {
    return this.name + ": " + r(this, n);
  }, Fi = e, Fi;
}
var Ui, Vo;
function Qd() {
  if (Vo) return Ui;
  Vo = 1;
  var r = nn();
  function e(i, s, a, u, o) {
    var f = "", l = "", c = Math.floor(o / 2) - 1;
    return u - s > c && (f = " ... ", s = u - c + f.length), a - u > c && (l = " ...", a = u + c - l.length), {
      str: f + i.slice(s, a).replace(/\t/g, "→") + l,
      pos: u - s + f.length
      // relative position
    };
  }
  function t(i, s) {
    return r.repeat(" ", s - i.length) + i;
  }
  function n(i, s) {
    if (s = Object.create(s || null), !i.buffer) return null;
    s.maxLength || (s.maxLength = 79), typeof s.indent != "number" && (s.indent = 1), typeof s.linesBefore != "number" && (s.linesBefore = 3), typeof s.linesAfter != "number" && (s.linesAfter = 2);
    for (var a = /\r?\n|\r|\0/g, u = [0], o = [], f, l = -1; f = a.exec(i.buffer); )
      o.push(f.index), u.push(f.index + f[0].length), i.position <= f.index && l < 0 && (l = u.length - 2);
    l < 0 && (l = u.length - 1);
    var c = "", d, p, g = Math.min(i.line + s.linesAfter, o.length).toString().length, w = s.maxLength - (s.indent + g + 3);
    for (d = 1; d <= s.linesBefore && !(l - d < 0); d++)
      p = e(
        i.buffer,
        u[l - d],
        o[l - d],
        i.position - (u[l] - u[l - d]),
        w
      ), c = r.repeat(" ", s.indent) + t((i.line - d + 1).toString(), g) + " | " + p.str + `
` + c;
    for (p = e(i.buffer, u[l], o[l], i.position, w), c += r.repeat(" ", s.indent) + t((i.line + 1).toString(), g) + " | " + p.str + `
`, c += r.repeat("-", s.indent + g + 3 + p.pos) + `^
`, d = 1; d <= s.linesAfter && !(l + d >= o.length); d++)
      p = e(
        i.buffer,
        u[l + d],
        o[l + d],
        i.position - (u[l] - u[l + d]),
        w
      ), c += r.repeat(" ", s.indent) + t((i.line + d + 1).toString(), g) + " | " + p.str + `
`;
    return c.replace(/\n$/, "");
  }
  return Ui = n, Ui;
}
var qi, Wo;
function at() {
  if (Wo) return qi;
  Wo = 1;
  var r = sn(), e = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ], t = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function n(s) {
    var a = {};
    return s !== null && Object.keys(s).forEach(function(u) {
      s[u].forEach(function(o) {
        a[String(o)] = u;
      });
    }), a;
  }
  function i(s, a) {
    if (a = a || {}, Object.keys(a).forEach(function(u) {
      if (e.indexOf(u) === -1)
        throw new r('Unknown option "' + u + '" is met in definition of "' + s + '" YAML type.');
    }), this.options = a, this.tag = s, this.kind = a.kind || null, this.resolve = a.resolve || function() {
      return !0;
    }, this.construct = a.construct || function(u) {
      return u;
    }, this.instanceOf = a.instanceOf || null, this.predicate = a.predicate || null, this.represent = a.represent || null, this.representName = a.representName || null, this.defaultStyle = a.defaultStyle || null, this.multi = a.multi || !1, this.styleAliases = n(a.styleAliases || null), t.indexOf(this.kind) === -1)
      throw new r('Unknown kind "' + this.kind + '" is specified for "' + s + '" YAML type.');
  }
  return qi = i, qi;
}
var $i, Yo;
function gc() {
  if (Yo) return $i;
  Yo = 1;
  var r = sn(), e = at();
  function t(s, a) {
    var u = [];
    return s[a].forEach(function(o) {
      var f = u.length;
      u.forEach(function(l, c) {
        l.tag === o.tag && l.kind === o.kind && l.multi === o.multi && (f = c);
      }), u[f] = o;
    }), u;
  }
  function n() {
    var s = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    }, a, u;
    function o(f) {
      f.multi ? (s.multi[f.kind].push(f), s.multi.fallback.push(f)) : s[f.kind][f.tag] = s.fallback[f.tag] = f;
    }
    for (a = 0, u = arguments.length; a < u; a += 1)
      arguments[a].forEach(o);
    return s;
  }
  function i(s) {
    return this.extend(s);
  }
  return i.prototype.extend = function(a) {
    var u = [], o = [];
    if (a instanceof e)
      o.push(a);
    else if (Array.isArray(a))
      o = o.concat(a);
    else if (a && (Array.isArray(a.implicit) || Array.isArray(a.explicit)))
      a.implicit && (u = u.concat(a.implicit)), a.explicit && (o = o.concat(a.explicit));
    else
      throw new r("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    u.forEach(function(l) {
      if (!(l instanceof e))
        throw new r("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (l.loadKind && l.loadKind !== "scalar")
        throw new r("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (l.multi)
        throw new r("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), o.forEach(function(l) {
      if (!(l instanceof e))
        throw new r("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    var f = Object.create(i.prototype);
    return f.implicit = (this.implicit || []).concat(u), f.explicit = (this.explicit || []).concat(o), f.compiledImplicit = t(f, "implicit"), f.compiledExplicit = t(f, "explicit"), f.compiledTypeMap = n(f.compiledImplicit, f.compiledExplicit), f;
  }, $i = i, $i;
}
var ki, Ko;
function yc() {
  if (Ko) return ki;
  Ko = 1;
  var r = at();
  return ki = new r("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(e) {
      return e !== null ? e : "";
    }
  }), ki;
}
var Bi, Jo;
function wc() {
  if (Jo) return Bi;
  Jo = 1;
  var r = at();
  return Bi = new r("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(e) {
      return e !== null ? e : [];
    }
  }), Bi;
}
var Mi, Xo;
function vc() {
  if (Xo) return Mi;
  Xo = 1;
  var r = at();
  return Mi = new r("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(e) {
      return e !== null ? e : {};
    }
  }), Mi;
}
var ji, Zo;
function Ec() {
  if (Zo) return ji;
  Zo = 1;
  var r = gc();
  return ji = new r({
    explicit: [
      yc(),
      wc(),
      vc()
    ]
  }), ji;
}
var Hi, el;
function Sc() {
  if (el) return Hi;
  el = 1;
  var r = at();
  function e(i) {
    if (i === null) return !0;
    var s = i.length;
    return s === 1 && i === "~" || s === 4 && (i === "null" || i === "Null" || i === "NULL");
  }
  function t() {
    return null;
  }
  function n(i) {
    return i === null;
  }
  return Hi = new r("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: e,
    construct: t,
    predicate: n,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  }), Hi;
}
var Qi, tl;
function bc() {
  if (tl) return Qi;
  tl = 1;
  var r = at();
  function e(i) {
    if (i === null) return !1;
    var s = i.length;
    return s === 4 && (i === "true" || i === "True" || i === "TRUE") || s === 5 && (i === "false" || i === "False" || i === "FALSE");
  }
  function t(i) {
    return i === "true" || i === "True" || i === "TRUE";
  }
  function n(i) {
    return Object.prototype.toString.call(i) === "[object Boolean]";
  }
  return Qi = new r("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: e,
    construct: t,
    predicate: n,
    represent: {
      lowercase: function(i) {
        return i ? "true" : "false";
      },
      uppercase: function(i) {
        return i ? "TRUE" : "FALSE";
      },
      camelcase: function(i) {
        return i ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  }), Qi;
}
var Gi, rl;
function _c() {
  if (rl) return Gi;
  rl = 1;
  var r = nn(), e = at();
  function t(o) {
    return 48 <= o && o <= 57 || 65 <= o && o <= 70 || 97 <= o && o <= 102;
  }
  function n(o) {
    return 48 <= o && o <= 55;
  }
  function i(o) {
    return 48 <= o && o <= 57;
  }
  function s(o) {
    if (o === null) return !1;
    var f = o.length, l = 0, c = !1, d;
    if (!f) return !1;
    if (d = o[l], (d === "-" || d === "+") && (d = o[++l]), d === "0") {
      if (l + 1 === f) return !0;
      if (d = o[++l], d === "b") {
        for (l++; l < f; l++)
          if (d = o[l], d !== "_") {
            if (d !== "0" && d !== "1") return !1;
            c = !0;
          }
        return c && d !== "_";
      }
      if (d === "x") {
        for (l++; l < f; l++)
          if (d = o[l], d !== "_") {
            if (!t(o.charCodeAt(l))) return !1;
            c = !0;
          }
        return c && d !== "_";
      }
      if (d === "o") {
        for (l++; l < f; l++)
          if (d = o[l], d !== "_") {
            if (!n(o.charCodeAt(l))) return !1;
            c = !0;
          }
        return c && d !== "_";
      }
    }
    if (d === "_") return !1;
    for (; l < f; l++)
      if (d = o[l], d !== "_") {
        if (!i(o.charCodeAt(l)))
          return !1;
        c = !0;
      }
    return !(!c || d === "_");
  }
  function a(o) {
    var f = o, l = 1, c;
    if (f.indexOf("_") !== -1 && (f = f.replace(/_/g, "")), c = f[0], (c === "-" || c === "+") && (c === "-" && (l = -1), f = f.slice(1), c = f[0]), f === "0") return 0;
    if (c === "0") {
      if (f[1] === "b") return l * parseInt(f.slice(2), 2);
      if (f[1] === "x") return l * parseInt(f.slice(2), 16);
      if (f[1] === "o") return l * parseInt(f.slice(2), 8);
    }
    return l * parseInt(f, 10);
  }
  function u(o) {
    return Object.prototype.toString.call(o) === "[object Number]" && o % 1 === 0 && !r.isNegativeZero(o);
  }
  return Gi = new e("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: s,
    construct: a,
    predicate: u,
    represent: {
      binary: function(o) {
        return o >= 0 ? "0b" + o.toString(2) : "-0b" + o.toString(2).slice(1);
      },
      octal: function(o) {
        return o >= 0 ? "0o" + o.toString(8) : "-0o" + o.toString(8).slice(1);
      },
      decimal: function(o) {
        return o.toString(10);
      },
      /* eslint-disable max-len */
      hexadecimal: function(o) {
        return o >= 0 ? "0x" + o.toString(16).toUpperCase() : "-0x" + o.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), Gi;
}
var zi, nl;
function Tc() {
  if (nl) return zi;
  nl = 1;
  var r = nn(), e = at(), t = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function n(o) {
    return !(o === null || !t.test(o) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    o[o.length - 1] === "_");
  }
  function i(o) {
    var f, l;
    return f = o.replace(/_/g, "").toLowerCase(), l = f[0] === "-" ? -1 : 1, "+-".indexOf(f[0]) >= 0 && (f = f.slice(1)), f === ".inf" ? l === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : f === ".nan" ? NaN : l * parseFloat(f, 10);
  }
  var s = /^[-+]?[0-9]+e/;
  function a(o, f) {
    var l;
    if (isNaN(o))
      switch (f) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === o)
      switch (f) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === o)
      switch (f) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (r.isNegativeZero(o))
      return "-0.0";
    return l = o.toString(10), s.test(l) ? l.replace("e", ".e") : l;
  }
  function u(o) {
    return Object.prototype.toString.call(o) === "[object Number]" && (o % 1 !== 0 || r.isNegativeZero(o));
  }
  return zi = new e("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: n,
    construct: i,
    predicate: u,
    represent: a,
    defaultStyle: "lowercase"
  }), zi;
}
var Vi, il;
function Cc() {
  return il || (il = 1, Vi = Ec().extend({
    implicit: [
      Sc(),
      bc(),
      _c(),
      Tc()
    ]
  })), Vi;
}
var Wi, sl;
function Ac() {
  return sl || (sl = 1, Wi = Cc()), Wi;
}
var Yi, al;
function Rc() {
  if (al) return Yi;
  al = 1;
  var r = at(), e = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), t = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function n(a) {
    return a === null ? !1 : e.exec(a) !== null || t.exec(a) !== null;
  }
  function i(a) {
    var u, o, f, l, c, d, p, g = 0, w = null, m, E, C;
    if (u = e.exec(a), u === null && (u = t.exec(a)), u === null) throw new Error("Date resolve error");
    if (o = +u[1], f = +u[2] - 1, l = +u[3], !u[4])
      return new Date(Date.UTC(o, f, l));
    if (c = +u[4], d = +u[5], p = +u[6], u[7]) {
      for (g = u[7].slice(0, 3); g.length < 3; )
        g += "0";
      g = +g;
    }
    return u[9] && (m = +u[10], E = +(u[11] || 0), w = (m * 60 + E) * 6e4, u[9] === "-" && (w = -w)), C = new Date(Date.UTC(o, f, l, c, d, p, g)), w && C.setTime(C.getTime() - w), C;
  }
  function s(a) {
    return a.toISOString();
  }
  return Yi = new r("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: n,
    construct: i,
    instanceOf: Date,
    represent: s
  }), Yi;
}
var Ki, ol;
function Nc() {
  if (ol) return Ki;
  ol = 1;
  var r = at();
  function e(t) {
    return t === "<<" || t === null;
  }
  return Ki = new r("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: e
  }), Ki;
}
var Ji, ll;
function Oc() {
  if (ll) return Ji;
  ll = 1;
  var r = at(), e = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function t(a) {
    if (a === null) return !1;
    var u, o, f = 0, l = a.length, c = e;
    for (o = 0; o < l; o++)
      if (u = c.indexOf(a.charAt(o)), !(u > 64)) {
        if (u < 0) return !1;
        f += 6;
      }
    return f % 8 === 0;
  }
  function n(a) {
    var u, o, f = a.replace(/[\r\n=]/g, ""), l = f.length, c = e, d = 0, p = [];
    for (u = 0; u < l; u++)
      u % 4 === 0 && u && (p.push(d >> 16 & 255), p.push(d >> 8 & 255), p.push(d & 255)), d = d << 6 | c.indexOf(f.charAt(u));
    return o = l % 4 * 6, o === 0 ? (p.push(d >> 16 & 255), p.push(d >> 8 & 255), p.push(d & 255)) : o === 18 ? (p.push(d >> 10 & 255), p.push(d >> 2 & 255)) : o === 12 && p.push(d >> 4 & 255), new Uint8Array(p);
  }
  function i(a) {
    var u = "", o = 0, f, l, c = a.length, d = e;
    for (f = 0; f < c; f++)
      f % 3 === 0 && f && (u += d[o >> 18 & 63], u += d[o >> 12 & 63], u += d[o >> 6 & 63], u += d[o & 63]), o = (o << 8) + a[f];
    return l = c % 3, l === 0 ? (u += d[o >> 18 & 63], u += d[o >> 12 & 63], u += d[o >> 6 & 63], u += d[o & 63]) : l === 2 ? (u += d[o >> 10 & 63], u += d[o >> 4 & 63], u += d[o << 2 & 63], u += d[64]) : l === 1 && (u += d[o >> 2 & 63], u += d[o << 4 & 63], u += d[64], u += d[64]), u;
  }
  function s(a) {
    return Object.prototype.toString.call(a) === "[object Uint8Array]";
  }
  return Ji = new r("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: t,
    construct: n,
    predicate: s,
    represent: i
  }), Ji;
}
var Xi, ul;
function Ic() {
  if (ul) return Xi;
  ul = 1;
  var r = at(), e = Object.prototype.hasOwnProperty, t = Object.prototype.toString;
  function n(s) {
    if (s === null) return !0;
    var a = [], u, o, f, l, c, d = s;
    for (u = 0, o = d.length; u < o; u += 1) {
      if (f = d[u], c = !1, t.call(f) !== "[object Object]") return !1;
      for (l in f)
        if (e.call(f, l))
          if (!c) c = !0;
          else return !1;
      if (!c) return !1;
      if (a.indexOf(l) === -1) a.push(l);
      else return !1;
    }
    return !0;
  }
  function i(s) {
    return s !== null ? s : [];
  }
  return Xi = new r("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: n,
    construct: i
  }), Xi;
}
var Zi, cl;
function Pc() {
  if (cl) return Zi;
  cl = 1;
  var r = at(), e = Object.prototype.toString;
  function t(i) {
    if (i === null) return !0;
    var s, a, u, o, f, l = i;
    for (f = new Array(l.length), s = 0, a = l.length; s < a; s += 1) {
      if (u = l[s], e.call(u) !== "[object Object]" || (o = Object.keys(u), o.length !== 1)) return !1;
      f[s] = [o[0], u[o[0]]];
    }
    return !0;
  }
  function n(i) {
    if (i === null) return [];
    var s, a, u, o, f, l = i;
    for (f = new Array(l.length), s = 0, a = l.length; s < a; s += 1)
      u = l[s], o = Object.keys(u), f[s] = [o[0], u[o[0]]];
    return f;
  }
  return Zi = new r("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: t,
    construct: n
  }), Zi;
}
var es, fl;
function Dc() {
  if (fl) return es;
  fl = 1;
  var r = at(), e = Object.prototype.hasOwnProperty;
  function t(i) {
    if (i === null) return !0;
    var s, a = i;
    for (s in a)
      if (e.call(a, s) && a[s] !== null)
        return !1;
    return !0;
  }
  function n(i) {
    return i !== null ? i : {};
  }
  return es = new r("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: t,
    construct: n
  }), es;
}
var ts, dl;
function pa() {
  return dl || (dl = 1, ts = Ac().extend({
    implicit: [
      Rc(),
      Nc()
    ],
    explicit: [
      Oc(),
      Ic(),
      Pc(),
      Dc()
    ]
  })), ts;
}
var hl;
function Gd() {
  if (hl) return _n;
  hl = 1;
  var r = nn(), e = sn(), t = Qd(), n = pa(), i = Object.prototype.hasOwnProperty, s = 1, a = 2, u = 3, o = 4, f = 1, l = 2, c = 3, d = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, p = /[\x85\u2028\u2029]/, g = /[,\[\]\{\}]/, w = /^(?:!|!!|![a-z\-]+!)$/i, m = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function E(h) {
    return Object.prototype.toString.call(h);
  }
  function C(h) {
    return h === 10 || h === 13;
  }
  function N(h) {
    return h === 9 || h === 32;
  }
  function O(h) {
    return h === 9 || h === 32 || h === 10 || h === 13;
  }
  function R(h) {
    return h === 44 || h === 91 || h === 93 || h === 123 || h === 125;
  }
  function I(h) {
    var j;
    return 48 <= h && h <= 57 ? h - 48 : (j = h | 32, 97 <= j && j <= 102 ? j - 97 + 10 : -1);
  }
  function _(h) {
    return h === 120 ? 2 : h === 117 ? 4 : h === 85 ? 8 : 0;
  }
  function S(h) {
    return 48 <= h && h <= 57 ? h - 48 : -1;
  }
  function y(h) {
    return h === 48 ? "\0" : h === 97 ? "\x07" : h === 98 ? "\b" : h === 116 || h === 9 ? "	" : h === 110 ? `
` : h === 118 ? "\v" : h === 102 ? "\f" : h === 114 ? "\r" : h === 101 ? "\x1B" : h === 32 ? " " : h === 34 ? '"' : h === 47 ? "/" : h === 92 ? "\\" : h === 78 ? "" : h === 95 ? " " : h === 76 ? "\u2028" : h === 80 ? "\u2029" : "";
  }
  function k(h) {
    return h <= 65535 ? String.fromCharCode(h) : String.fromCharCode(
      (h - 65536 >> 10) + 55296,
      (h - 65536 & 1023) + 56320
    );
  }
  function B(h, j, z) {
    j === "__proto__" ? Object.defineProperty(h, j, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: z
    }) : h[j] = z;
  }
  for (var F = new Array(256), q = new Array(256), D = 0; D < 256; D++)
    F[D] = y(D) ? 1 : 0, q[D] = y(D);
  function L(h, j) {
    this.input = h, this.filename = j.filename || null, this.schema = j.schema || n, this.onWarning = j.onWarning || null, this.legacy = j.legacy || !1, this.json = j.json || !1, this.listener = j.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = h.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
  }
  function Q(h, j) {
    var z = {
      name: h.filename,
      buffer: h.input.slice(0, -1),
      // omit trailing \0
      position: h.position,
      line: h.line,
      column: h.position - h.lineStart
    };
    return z.snippet = t(z), new e(j, z);
  }
  function P(h, j) {
    throw Q(h, j);
  }
  function G(h, j) {
    h.onWarning && h.onWarning.call(null, Q(h, j));
  }
  var V = {
    YAML: function(j, z, ae) {
      var W, se, re;
      j.version !== null && P(j, "duplication of %YAML directive"), ae.length !== 1 && P(j, "YAML directive accepts exactly one argument"), W = /^([0-9]+)\.([0-9]+)$/.exec(ae[0]), W === null && P(j, "ill-formed argument of the YAML directive"), se = parseInt(W[1], 10), re = parseInt(W[2], 10), se !== 1 && P(j, "unacceptable YAML version of the document"), j.version = ae[0], j.checkLineBreaks = re < 2, re !== 1 && re !== 2 && G(j, "unsupported YAML version of the document");
    },
    TAG: function(j, z, ae) {
      var W, se;
      ae.length !== 2 && P(j, "TAG directive accepts exactly two arguments"), W = ae[0], se = ae[1], w.test(W) || P(j, "ill-formed tag handle (first argument) of the TAG directive"), i.call(j.tagMap, W) && P(j, 'there is a previously declared suffix for "' + W + '" tag handle'), m.test(se) || P(j, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        se = decodeURIComponent(se);
      } catch {
        P(j, "tag prefix is malformed: " + se);
      }
      j.tagMap[W] = se;
    }
  };
  function ie(h, j, z, ae) {
    var W, se, re, ue;
    if (j < z) {
      if (ue = h.input.slice(j, z), ae)
        for (W = 0, se = ue.length; W < se; W += 1)
          re = ue.charCodeAt(W), re === 9 || 32 <= re && re <= 1114111 || P(h, "expected valid JSON character");
      else d.test(ue) && P(h, "the stream contains non-printable characters");
      h.result += ue;
    }
  }
  function ye(h, j, z, ae) {
    var W, se, re, ue;
    for (r.isObject(z) || P(h, "cannot merge mappings; the provided source object is unacceptable"), W = Object.keys(z), re = 0, ue = W.length; re < ue; re += 1)
      se = W[re], i.call(j, se) || (B(j, se, z[se]), ae[se] = !0);
  }
  function oe(h, j, z, ae, W, se, re, ue, he) {
    var Le, xe;
    if (Array.isArray(W))
      for (W = Array.prototype.slice.call(W), Le = 0, xe = W.length; Le < xe; Le += 1)
        Array.isArray(W[Le]) && P(h, "nested arrays are not supported inside keys"), typeof W == "object" && E(W[Le]) === "[object Object]" && (W[Le] = "[object Object]");
    if (typeof W == "object" && E(W) === "[object Object]" && (W = "[object Object]"), W = String(W), j === null && (j = {}), ae === "tag:yaml.org,2002:merge")
      if (Array.isArray(se))
        for (Le = 0, xe = se.length; Le < xe; Le += 1)
          ye(h, j, se[Le], z);
      else
        ye(h, j, se, z);
    else
      !h.json && !i.call(z, W) && i.call(j, W) && (h.line = re || h.line, h.lineStart = ue || h.lineStart, h.position = he || h.position, P(h, "duplicated mapping key")), B(j, W, se), delete z[W];
    return j;
  }
  function Ae(h) {
    var j;
    j = h.input.charCodeAt(h.position), j === 10 ? h.position++ : j === 13 ? (h.position++, h.input.charCodeAt(h.position) === 10 && h.position++) : P(h, "a line break is expected"), h.line += 1, h.lineStart = h.position, h.firstTabInLine = -1;
  }
  function be(h, j, z) {
    for (var ae = 0, W = h.input.charCodeAt(h.position); W !== 0; ) {
      for (; N(W); )
        W === 9 && h.firstTabInLine === -1 && (h.firstTabInLine = h.position), W = h.input.charCodeAt(++h.position);
      if (j && W === 35)
        do
          W = h.input.charCodeAt(++h.position);
        while (W !== 10 && W !== 13 && W !== 0);
      if (C(W))
        for (Ae(h), W = h.input.charCodeAt(h.position), ae++, h.lineIndent = 0; W === 32; )
          h.lineIndent++, W = h.input.charCodeAt(++h.position);
      else
        break;
    }
    return z !== -1 && ae !== 0 && h.lineIndent < z && G(h, "deficient indentation"), ae;
  }
  function ee(h) {
    var j = h.position, z;
    return z = h.input.charCodeAt(j), !!((z === 45 || z === 46) && z === h.input.charCodeAt(j + 1) && z === h.input.charCodeAt(j + 2) && (j += 3, z = h.input.charCodeAt(j), z === 0 || O(z)));
  }
  function Se(h, j) {
    j === 1 ? h.result += " " : j > 1 && (h.result += r.repeat(`
`, j - 1));
  }
  function b(h, j, z) {
    var ae, W, se, re, ue, he, Le, xe, Ee = h.kind, T = h.result, M;
    if (M = h.input.charCodeAt(h.position), O(M) || R(M) || M === 35 || M === 38 || M === 42 || M === 33 || M === 124 || M === 62 || M === 39 || M === 34 || M === 37 || M === 64 || M === 96 || (M === 63 || M === 45) && (W = h.input.charCodeAt(h.position + 1), O(W) || z && R(W)))
      return !1;
    for (h.kind = "scalar", h.result = "", se = re = h.position, ue = !1; M !== 0; ) {
      if (M === 58) {
        if (W = h.input.charCodeAt(h.position + 1), O(W) || z && R(W))
          break;
      } else if (M === 35) {
        if (ae = h.input.charCodeAt(h.position - 1), O(ae))
          break;
      } else {
        if (h.position === h.lineStart && ee(h) || z && R(M))
          break;
        if (C(M))
          if (he = h.line, Le = h.lineStart, xe = h.lineIndent, be(h, !1, -1), h.lineIndent >= j) {
            ue = !0, M = h.input.charCodeAt(h.position);
            continue;
          } else {
            h.position = re, h.line = he, h.lineStart = Le, h.lineIndent = xe;
            break;
          }
      }
      ue && (ie(h, se, re, !1), Se(h, h.line - he), se = re = h.position, ue = !1), N(M) || (re = h.position + 1), M = h.input.charCodeAt(++h.position);
    }
    return ie(h, se, re, !1), h.result ? !0 : (h.kind = Ee, h.result = T, !1);
  }
  function v(h, j) {
    var z, ae, W;
    if (z = h.input.charCodeAt(h.position), z !== 39)
      return !1;
    for (h.kind = "scalar", h.result = "", h.position++, ae = W = h.position; (z = h.input.charCodeAt(h.position)) !== 0; )
      if (z === 39)
        if (ie(h, ae, h.position, !0), z = h.input.charCodeAt(++h.position), z === 39)
          ae = h.position, h.position++, W = h.position;
        else
          return !0;
      else C(z) ? (ie(h, ae, W, !0), Se(h, be(h, !1, j)), ae = W = h.position) : h.position === h.lineStart && ee(h) ? P(h, "unexpected end of the document within a single quoted scalar") : (h.position++, W = h.position);
    P(h, "unexpected end of the stream within a single quoted scalar");
  }
  function H(h, j) {
    var z, ae, W, se, re, ue;
    if (ue = h.input.charCodeAt(h.position), ue !== 34)
      return !1;
    for (h.kind = "scalar", h.result = "", h.position++, z = ae = h.position; (ue = h.input.charCodeAt(h.position)) !== 0; ) {
      if (ue === 34)
        return ie(h, z, h.position, !0), h.position++, !0;
      if (ue === 92) {
        if (ie(h, z, h.position, !0), ue = h.input.charCodeAt(++h.position), C(ue))
          be(h, !1, j);
        else if (ue < 256 && F[ue])
          h.result += q[ue], h.position++;
        else if ((re = _(ue)) > 0) {
          for (W = re, se = 0; W > 0; W--)
            ue = h.input.charCodeAt(++h.position), (re = I(ue)) >= 0 ? se = (se << 4) + re : P(h, "expected hexadecimal character");
          h.result += k(se), h.position++;
        } else
          P(h, "unknown escape sequence");
        z = ae = h.position;
      } else C(ue) ? (ie(h, z, ae, !0), Se(h, be(h, !1, j)), z = ae = h.position) : h.position === h.lineStart && ee(h) ? P(h, "unexpected end of the document within a double quoted scalar") : (h.position++, ae = h.position);
    }
    P(h, "unexpected end of the stream within a double quoted scalar");
  }
  function x(h, j) {
    var z = !0, ae, W, se, re = h.tag, ue, he = h.anchor, Le, xe, Ee, T, M, Y = /* @__PURE__ */ Object.create(null), K, J, le, ne;
    if (ne = h.input.charCodeAt(h.position), ne === 91)
      xe = 93, M = !1, ue = [];
    else if (ne === 123)
      xe = 125, M = !0, ue = {};
    else
      return !1;
    for (h.anchor !== null && (h.anchorMap[h.anchor] = ue), ne = h.input.charCodeAt(++h.position); ne !== 0; ) {
      if (be(h, !0, j), ne = h.input.charCodeAt(h.position), ne === xe)
        return h.position++, h.tag = re, h.anchor = he, h.kind = M ? "mapping" : "sequence", h.result = ue, !0;
      z ? ne === 44 && P(h, "expected the node content, but found ','") : P(h, "missed comma between flow collection entries"), J = K = le = null, Ee = T = !1, ne === 63 && (Le = h.input.charCodeAt(h.position + 1), O(Le) && (Ee = T = !0, h.position++, be(h, !0, j))), ae = h.line, W = h.lineStart, se = h.position, De(h, j, s, !1, !0), J = h.tag, K = h.result, be(h, !0, j), ne = h.input.charCodeAt(h.position), (T || h.line === ae) && ne === 58 && (Ee = !0, ne = h.input.charCodeAt(++h.position), be(h, !0, j), De(h, j, s, !1, !0), le = h.result), M ? oe(h, ue, Y, J, K, le, ae, W, se) : Ee ? ue.push(oe(h, null, Y, J, K, le, ae, W, se)) : ue.push(K), be(h, !0, j), ne = h.input.charCodeAt(h.position), ne === 44 ? (z = !0, ne = h.input.charCodeAt(++h.position)) : z = !1;
    }
    P(h, "unexpected end of the stream within a flow collection");
  }
  function pe(h, j) {
    var z, ae, W = f, se = !1, re = !1, ue = j, he = 0, Le = !1, xe, Ee;
    if (Ee = h.input.charCodeAt(h.position), Ee === 124)
      ae = !1;
    else if (Ee === 62)
      ae = !0;
    else
      return !1;
    for (h.kind = "scalar", h.result = ""; Ee !== 0; )
      if (Ee = h.input.charCodeAt(++h.position), Ee === 43 || Ee === 45)
        f === W ? W = Ee === 43 ? c : l : P(h, "repeat of a chomping mode identifier");
      else if ((xe = S(Ee)) >= 0)
        xe === 0 ? P(h, "bad explicit indentation width of a block scalar; it cannot be less than one") : re ? P(h, "repeat of an indentation width identifier") : (ue = j + xe - 1, re = !0);
      else
        break;
    if (N(Ee)) {
      do
        Ee = h.input.charCodeAt(++h.position);
      while (N(Ee));
      if (Ee === 35)
        do
          Ee = h.input.charCodeAt(++h.position);
        while (!C(Ee) && Ee !== 0);
    }
    for (; Ee !== 0; ) {
      for (Ae(h), h.lineIndent = 0, Ee = h.input.charCodeAt(h.position); (!re || h.lineIndent < ue) && Ee === 32; )
        h.lineIndent++, Ee = h.input.charCodeAt(++h.position);
      if (!re && h.lineIndent > ue && (ue = h.lineIndent), C(Ee)) {
        he++;
        continue;
      }
      if (h.lineIndent < ue) {
        W === c ? h.result += r.repeat(`
`, se ? 1 + he : he) : W === f && se && (h.result += `
`);
        break;
      }
      for (ae ? N(Ee) ? (Le = !0, h.result += r.repeat(`
`, se ? 1 + he : he)) : Le ? (Le = !1, h.result += r.repeat(`
`, he + 1)) : he === 0 ? se && (h.result += " ") : h.result += r.repeat(`
`, he) : h.result += r.repeat(`
`, se ? 1 + he : he), se = !0, re = !0, he = 0, z = h.position; !C(Ee) && Ee !== 0; )
        Ee = h.input.charCodeAt(++h.position);
      ie(h, z, h.position, !1);
    }
    return !0;
  }
  function we(h, j) {
    var z, ae = h.tag, W = h.anchor, se = [], re, ue = !1, he;
    if (h.firstTabInLine !== -1) return !1;
    for (h.anchor !== null && (h.anchorMap[h.anchor] = se), he = h.input.charCodeAt(h.position); he !== 0 && (h.firstTabInLine !== -1 && (h.position = h.firstTabInLine, P(h, "tab characters must not be used in indentation")), !(he !== 45 || (re = h.input.charCodeAt(h.position + 1), !O(re)))); ) {
      if (ue = !0, h.position++, be(h, !0, -1) && h.lineIndent <= j) {
        se.push(null), he = h.input.charCodeAt(h.position);
        continue;
      }
      if (z = h.line, De(h, j, u, !1, !0), se.push(h.result), be(h, !0, -1), he = h.input.charCodeAt(h.position), (h.line === z || h.lineIndent > j) && he !== 0)
        P(h, "bad indentation of a sequence entry");
      else if (h.lineIndent < j)
        break;
    }
    return ue ? (h.tag = ae, h.anchor = W, h.kind = "sequence", h.result = se, !0) : !1;
  }
  function ve(h, j, z) {
    var ae, W, se, re, ue, he, Le = h.tag, xe = h.anchor, Ee = {}, T = /* @__PURE__ */ Object.create(null), M = null, Y = null, K = null, J = !1, le = !1, ne;
    if (h.firstTabInLine !== -1) return !1;
    for (h.anchor !== null && (h.anchorMap[h.anchor] = Ee), ne = h.input.charCodeAt(h.position); ne !== 0; ) {
      if (!J && h.firstTabInLine !== -1 && (h.position = h.firstTabInLine, P(h, "tab characters must not be used in indentation")), ae = h.input.charCodeAt(h.position + 1), se = h.line, (ne === 63 || ne === 58) && O(ae))
        ne === 63 ? (J && (oe(h, Ee, T, M, Y, null, re, ue, he), M = Y = K = null), le = !0, J = !0, W = !0) : J ? (J = !1, W = !0) : P(h, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), h.position += 1, ne = ae;
      else {
        if (re = h.line, ue = h.lineStart, he = h.position, !De(h, z, a, !1, !0))
          break;
        if (h.line === se) {
          for (ne = h.input.charCodeAt(h.position); N(ne); )
            ne = h.input.charCodeAt(++h.position);
          if (ne === 58)
            ne = h.input.charCodeAt(++h.position), O(ne) || P(h, "a whitespace character is expected after the key-value separator within a block mapping"), J && (oe(h, Ee, T, M, Y, null, re, ue, he), M = Y = K = null), le = !0, J = !1, W = !1, M = h.tag, Y = h.result;
          else if (le)
            P(h, "can not read an implicit mapping pair; a colon is missed");
          else
            return h.tag = Le, h.anchor = xe, !0;
        } else if (le)
          P(h, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return h.tag = Le, h.anchor = xe, !0;
      }
      if ((h.line === se || h.lineIndent > j) && (J && (re = h.line, ue = h.lineStart, he = h.position), De(h, j, o, !0, W) && (J ? Y = h.result : K = h.result), J || (oe(h, Ee, T, M, Y, K, re, ue, he), M = Y = K = null), be(h, !0, -1), ne = h.input.charCodeAt(h.position)), (h.line === se || h.lineIndent > j) && ne !== 0)
        P(h, "bad indentation of a mapping entry");
      else if (h.lineIndent < j)
        break;
    }
    return J && oe(h, Ee, T, M, Y, null, re, ue, he), le && (h.tag = Le, h.anchor = xe, h.kind = "mapping", h.result = Ee), le;
  }
  function Ne(h) {
    var j, z = !1, ae = !1, W, se, re;
    if (re = h.input.charCodeAt(h.position), re !== 33) return !1;
    if (h.tag !== null && P(h, "duplication of a tag property"), re = h.input.charCodeAt(++h.position), re === 60 ? (z = !0, re = h.input.charCodeAt(++h.position)) : re === 33 ? (ae = !0, W = "!!", re = h.input.charCodeAt(++h.position)) : W = "!", j = h.position, z) {
      do
        re = h.input.charCodeAt(++h.position);
      while (re !== 0 && re !== 62);
      h.position < h.length ? (se = h.input.slice(j, h.position), re = h.input.charCodeAt(++h.position)) : P(h, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; re !== 0 && !O(re); )
        re === 33 && (ae ? P(h, "tag suffix cannot contain exclamation marks") : (W = h.input.slice(j - 1, h.position + 1), w.test(W) || P(h, "named tag handle cannot contain such characters"), ae = !0, j = h.position + 1)), re = h.input.charCodeAt(++h.position);
      se = h.input.slice(j, h.position), g.test(se) && P(h, "tag suffix cannot contain flow indicator characters");
    }
    se && !m.test(se) && P(h, "tag name cannot contain such characters: " + se);
    try {
      se = decodeURIComponent(se);
    } catch {
      P(h, "tag name is malformed: " + se);
    }
    return z ? h.tag = se : i.call(h.tagMap, W) ? h.tag = h.tagMap[W] + se : W === "!" ? h.tag = "!" + se : W === "!!" ? h.tag = "tag:yaml.org,2002:" + se : P(h, 'undeclared tag handle "' + W + '"'), !0;
  }
  function _e(h) {
    var j, z;
    if (z = h.input.charCodeAt(h.position), z !== 38) return !1;
    for (h.anchor !== null && P(h, "duplication of an anchor property"), z = h.input.charCodeAt(++h.position), j = h.position; z !== 0 && !O(z) && !R(z); )
      z = h.input.charCodeAt(++h.position);
    return h.position === j && P(h, "name of an anchor node must contain at least one character"), h.anchor = h.input.slice(j, h.position), !0;
  }
  function lt(h) {
    var j, z, ae;
    if (ae = h.input.charCodeAt(h.position), ae !== 42) return !1;
    for (ae = h.input.charCodeAt(++h.position), j = h.position; ae !== 0 && !O(ae) && !R(ae); )
      ae = h.input.charCodeAt(++h.position);
    return h.position === j && P(h, "name of an alias node must contain at least one character"), z = h.input.slice(j, h.position), i.call(h.anchorMap, z) || P(h, 'unidentified alias "' + z + '"'), h.result = h.anchorMap[z], be(h, !0, -1), !0;
  }
  function De(h, j, z, ae, W) {
    var se, re, ue, he = 1, Le = !1, xe = !1, Ee, T, M, Y, K, J;
    if (h.listener !== null && h.listener("open", h), h.tag = null, h.anchor = null, h.kind = null, h.result = null, se = re = ue = o === z || u === z, ae && be(h, !0, -1) && (Le = !0, h.lineIndent > j ? he = 1 : h.lineIndent === j ? he = 0 : h.lineIndent < j && (he = -1)), he === 1)
      for (; Ne(h) || _e(h); )
        be(h, !0, -1) ? (Le = !0, ue = se, h.lineIndent > j ? he = 1 : h.lineIndent === j ? he = 0 : h.lineIndent < j && (he = -1)) : ue = !1;
    if (ue && (ue = Le || W), (he === 1 || o === z) && (s === z || a === z ? K = j : K = j + 1, J = h.position - h.lineStart, he === 1 ? ue && (we(h, J) || ve(h, J, K)) || x(h, K) ? xe = !0 : (re && pe(h, K) || v(h, K) || H(h, K) ? xe = !0 : lt(h) ? (xe = !0, (h.tag !== null || h.anchor !== null) && P(h, "alias node should not have any properties")) : b(h, K, s === z) && (xe = !0, h.tag === null && (h.tag = "?")), h.anchor !== null && (h.anchorMap[h.anchor] = h.result)) : he === 0 && (xe = ue && we(h, J))), h.tag === null)
      h.anchor !== null && (h.anchorMap[h.anchor] = h.result);
    else if (h.tag === "?") {
      for (h.result !== null && h.kind !== "scalar" && P(h, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + h.kind + '"'), Ee = 0, T = h.implicitTypes.length; Ee < T; Ee += 1)
        if (Y = h.implicitTypes[Ee], Y.resolve(h.result)) {
          h.result = Y.construct(h.result), h.tag = Y.tag, h.anchor !== null && (h.anchorMap[h.anchor] = h.result);
          break;
        }
    } else if (h.tag !== "!") {
      if (i.call(h.typeMap[h.kind || "fallback"], h.tag))
        Y = h.typeMap[h.kind || "fallback"][h.tag];
      else
        for (Y = null, M = h.typeMap.multi[h.kind || "fallback"], Ee = 0, T = M.length; Ee < T; Ee += 1)
          if (h.tag.slice(0, M[Ee].tag.length) === M[Ee].tag) {
            Y = M[Ee];
            break;
          }
      Y || P(h, "unknown tag !<" + h.tag + ">"), h.result !== null && Y.kind !== h.kind && P(h, "unacceptable node kind for !<" + h.tag + '> tag; it should be "' + Y.kind + '", not "' + h.kind + '"'), Y.resolve(h.result, h.tag) ? (h.result = Y.construct(h.result, h.tag), h.anchor !== null && (h.anchorMap[h.anchor] = h.result)) : P(h, "cannot resolve a node with !<" + h.tag + "> explicit tag");
    }
    return h.listener !== null && h.listener("close", h), h.tag !== null || h.anchor !== null || xe;
  }
  function rt(h) {
    var j = h.position, z, ae, W, se = !1, re;
    for (h.version = null, h.checkLineBreaks = h.legacy, h.tagMap = /* @__PURE__ */ Object.create(null), h.anchorMap = /* @__PURE__ */ Object.create(null); (re = h.input.charCodeAt(h.position)) !== 0 && (be(h, !0, -1), re = h.input.charCodeAt(h.position), !(h.lineIndent > 0 || re !== 37)); ) {
      for (se = !0, re = h.input.charCodeAt(++h.position), z = h.position; re !== 0 && !O(re); )
        re = h.input.charCodeAt(++h.position);
      for (ae = h.input.slice(z, h.position), W = [], ae.length < 1 && P(h, "directive name must not be less than one character in length"); re !== 0; ) {
        for (; N(re); )
          re = h.input.charCodeAt(++h.position);
        if (re === 35) {
          do
            re = h.input.charCodeAt(++h.position);
          while (re !== 0 && !C(re));
          break;
        }
        if (C(re)) break;
        for (z = h.position; re !== 0 && !O(re); )
          re = h.input.charCodeAt(++h.position);
        W.push(h.input.slice(z, h.position));
      }
      re !== 0 && Ae(h), i.call(V, ae) ? V[ae](h, ae, W) : G(h, 'unknown document directive "' + ae + '"');
    }
    if (be(h, !0, -1), h.lineIndent === 0 && h.input.charCodeAt(h.position) === 45 && h.input.charCodeAt(h.position + 1) === 45 && h.input.charCodeAt(h.position + 2) === 45 ? (h.position += 3, be(h, !0, -1)) : se && P(h, "directives end mark is expected"), De(h, h.lineIndent - 1, o, !1, !0), be(h, !0, -1), h.checkLineBreaks && p.test(h.input.slice(j, h.position)) && G(h, "non-ASCII line breaks are interpreted as content"), h.documents.push(h.result), h.position === h.lineStart && ee(h)) {
      h.input.charCodeAt(h.position) === 46 && (h.position += 3, be(h, !0, -1));
      return;
    }
    if (h.position < h.length - 1)
      P(h, "end of the stream or a document separator is expected");
    else
      return;
  }
  function xt(h, j) {
    h = String(h), j = j || {}, h.length !== 0 && (h.charCodeAt(h.length - 1) !== 10 && h.charCodeAt(h.length - 1) !== 13 && (h += `
`), h.charCodeAt(0) === 65279 && (h = h.slice(1)));
    var z = new L(h, j), ae = h.indexOf("\0");
    for (ae !== -1 && (z.position = ae, P(z, "null byte is not allowed in input")), z.input += "\0"; z.input.charCodeAt(z.position) === 32; )
      z.lineIndent += 1, z.position += 1;
    for (; z.position < z.length - 1; )
      rt(z);
    return z.documents;
  }
  function Ot(h, j, z) {
    j !== null && typeof j == "object" && typeof z > "u" && (z = j, j = null);
    var ae = xt(h, z);
    if (typeof j != "function")
      return ae;
    for (var W = 0, se = ae.length; W < se; W += 1)
      j(ae[W]);
  }
  function At(h, j) {
    var z = xt(h, j);
    if (z.length !== 0) {
      if (z.length === 1)
        return z[0];
      throw new e("expected a single document in the stream, but found more");
    }
  }
  return _n.loadAll = Ot, _n.load = At, _n;
}
var rs = {}, pl;
function zd() {
  if (pl) return rs;
  pl = 1;
  var r = nn(), e = sn(), t = pa(), n = Object.prototype.toString, i = Object.prototype.hasOwnProperty, s = 65279, a = 9, u = 10, o = 13, f = 32, l = 33, c = 34, d = 35, p = 37, g = 38, w = 39, m = 42, E = 44, C = 45, N = 58, O = 61, R = 62, I = 63, _ = 64, S = 91, y = 93, k = 96, B = 123, F = 124, q = 125, D = {};
  D[0] = "\\0", D[7] = "\\a", D[8] = "\\b", D[9] = "\\t", D[10] = "\\n", D[11] = "\\v", D[12] = "\\f", D[13] = "\\r", D[27] = "\\e", D[34] = '\\"', D[92] = "\\\\", D[133] = "\\N", D[160] = "\\_", D[8232] = "\\L", D[8233] = "\\P";
  var L = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ], Q = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function P(T, M) {
    var Y, K, J, le, ne, fe, ge;
    if (M === null) return {};
    for (Y = {}, K = Object.keys(M), J = 0, le = K.length; J < le; J += 1)
      ne = K[J], fe = String(M[ne]), ne.slice(0, 2) === "!!" && (ne = "tag:yaml.org,2002:" + ne.slice(2)), ge = T.compiledTypeMap.fallback[ne], ge && i.call(ge.styleAliases, fe) && (fe = ge.styleAliases[fe]), Y[ne] = fe;
    return Y;
  }
  function G(T) {
    var M, Y, K;
    if (M = T.toString(16).toUpperCase(), T <= 255)
      Y = "x", K = 2;
    else if (T <= 65535)
      Y = "u", K = 4;
    else if (T <= 4294967295)
      Y = "U", K = 8;
    else
      throw new e("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + Y + r.repeat("0", K - M.length) + M;
  }
  var V = 1, ie = 2;
  function ye(T) {
    this.schema = T.schema || t, this.indent = Math.max(1, T.indent || 2), this.noArrayIndent = T.noArrayIndent || !1, this.skipInvalid = T.skipInvalid || !1, this.flowLevel = r.isNothing(T.flowLevel) ? -1 : T.flowLevel, this.styleMap = P(this.schema, T.styles || null), this.sortKeys = T.sortKeys || !1, this.lineWidth = T.lineWidth || 80, this.noRefs = T.noRefs || !1, this.noCompatMode = T.noCompatMode || !1, this.condenseFlow = T.condenseFlow || !1, this.quotingType = T.quotingType === '"' ? ie : V, this.forceQuotes = T.forceQuotes || !1, this.replacer = typeof T.replacer == "function" ? T.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function oe(T, M) {
    for (var Y = r.repeat(" ", M), K = 0, J = -1, le = "", ne, fe = T.length; K < fe; )
      J = T.indexOf(`
`, K), J === -1 ? (ne = T.slice(K), K = fe) : (ne = T.slice(K, J + 1), K = J + 1), ne.length && ne !== `
` && (le += Y), le += ne;
    return le;
  }
  function Ae(T, M) {
    return `
` + r.repeat(" ", T.indent * M);
  }
  function be(T, M) {
    var Y, K, J;
    for (Y = 0, K = T.implicitTypes.length; Y < K; Y += 1)
      if (J = T.implicitTypes[Y], J.resolve(M))
        return !0;
    return !1;
  }
  function ee(T) {
    return T === f || T === a;
  }
  function Se(T) {
    return 32 <= T && T <= 126 || 161 <= T && T <= 55295 && T !== 8232 && T !== 8233 || 57344 <= T && T <= 65533 && T !== s || 65536 <= T && T <= 1114111;
  }
  function b(T) {
    return Se(T) && T !== s && T !== o && T !== u;
  }
  function v(T, M, Y) {
    var K = b(T), J = K && !ee(T);
    return (
      // ns-plain-safe
      (Y ? (
        // c = flow-in
        K
      ) : K && T !== E && T !== S && T !== y && T !== B && T !== q) && T !== d && !(M === N && !J) || b(M) && !ee(M) && T === d || M === N && J
    );
  }
  function H(T) {
    return Se(T) && T !== s && !ee(T) && T !== C && T !== I && T !== N && T !== E && T !== S && T !== y && T !== B && T !== q && T !== d && T !== g && T !== m && T !== l && T !== F && T !== O && T !== R && T !== w && T !== c && T !== p && T !== _ && T !== k;
  }
  function x(T) {
    return !ee(T) && T !== N;
  }
  function pe(T, M) {
    var Y = T.charCodeAt(M), K;
    return Y >= 55296 && Y <= 56319 && M + 1 < T.length && (K = T.charCodeAt(M + 1), K >= 56320 && K <= 57343) ? (Y - 55296) * 1024 + K - 56320 + 65536 : Y;
  }
  function we(T) {
    var M = /^\n* /;
    return M.test(T);
  }
  var ve = 1, Ne = 2, _e = 3, lt = 4, De = 5;
  function rt(T, M, Y, K, J, le, ne, fe) {
    var ge, Te = 0, Ue = null, Me = !1, Fe = !1, fr = K !== -1, wt = -1, Vt = H(pe(T, 0)) && x(pe(T, T.length - 1));
    if (M || ne)
      for (ge = 0; ge < T.length; Te >= 65536 ? ge += 2 : ge++) {
        if (Te = pe(T, ge), !Se(Te))
          return De;
        Vt = Vt && v(Te, Ue, fe), Ue = Te;
      }
    else {
      for (ge = 0; ge < T.length; Te >= 65536 ? ge += 2 : ge++) {
        if (Te = pe(T, ge), Te === u)
          Me = !0, fr && (Fe = Fe || // Foldable line = too long, and not more-indented.
          ge - wt - 1 > K && T[wt + 1] !== " ", wt = ge);
        else if (!Se(Te))
          return De;
        Vt = Vt && v(Te, Ue, fe), Ue = Te;
      }
      Fe = Fe || fr && ge - wt - 1 > K && T[wt + 1] !== " ";
    }
    return !Me && !Fe ? Vt && !ne && !J(T) ? ve : le === ie ? De : Ne : Y > 9 && we(T) ? De : ne ? le === ie ? De : Ne : Fe ? lt : _e;
  }
  function xt(T, M, Y, K, J) {
    T.dump = (function() {
      if (M.length === 0)
        return T.quotingType === ie ? '""' : "''";
      if (!T.noCompatMode && (L.indexOf(M) !== -1 || Q.test(M)))
        return T.quotingType === ie ? '"' + M + '"' : "'" + M + "'";
      var le = T.indent * Math.max(1, Y), ne = T.lineWidth === -1 ? -1 : Math.max(Math.min(T.lineWidth, 40), T.lineWidth - le), fe = K || T.flowLevel > -1 && Y >= T.flowLevel;
      function ge(Te) {
        return be(T, Te);
      }
      switch (rt(
        M,
        fe,
        T.indent,
        ne,
        ge,
        T.quotingType,
        T.forceQuotes && !K,
        J
      )) {
        case ve:
          return M;
        case Ne:
          return "'" + M.replace(/'/g, "''") + "'";
        case _e:
          return "|" + Ot(M, T.indent) + At(oe(M, le));
        case lt:
          return ">" + Ot(M, T.indent) + At(oe(h(M, ne), le));
        case De:
          return '"' + z(M) + '"';
        default:
          throw new e("impossible error: invalid scalar style");
      }
    })();
  }
  function Ot(T, M) {
    var Y = we(T) ? String(M) : "", K = T[T.length - 1] === `
`, J = K && (T[T.length - 2] === `
` || T === `
`), le = J ? "+" : K ? "" : "-";
    return Y + le + `
`;
  }
  function At(T) {
    return T[T.length - 1] === `
` ? T.slice(0, -1) : T;
  }
  function h(T, M) {
    for (var Y = /(\n+)([^\n]*)/g, K = (function() {
      var Te = T.indexOf(`
`);
      return Te = Te !== -1 ? Te : T.length, Y.lastIndex = Te, j(T.slice(0, Te), M);
    })(), J = T[0] === `
` || T[0] === " ", le, ne; ne = Y.exec(T); ) {
      var fe = ne[1], ge = ne[2];
      le = ge[0] === " ", K += fe + (!J && !le && ge !== "" ? `
` : "") + j(ge, M), J = le;
    }
    return K;
  }
  function j(T, M) {
    if (T === "" || T[0] === " ") return T;
    for (var Y = / [^ ]/g, K, J = 0, le, ne = 0, fe = 0, ge = ""; K = Y.exec(T); )
      fe = K.index, fe - J > M && (le = ne > J ? ne : fe, ge += `
` + T.slice(J, le), J = le + 1), ne = fe;
    return ge += `
`, T.length - J > M && ne > J ? ge += T.slice(J, ne) + `
` + T.slice(ne + 1) : ge += T.slice(J), ge.slice(1);
  }
  function z(T) {
    for (var M = "", Y = 0, K, J = 0; J < T.length; Y >= 65536 ? J += 2 : J++)
      Y = pe(T, J), K = D[Y], !K && Se(Y) ? (M += T[J], Y >= 65536 && (M += T[J + 1])) : M += K || G(Y);
    return M;
  }
  function ae(T, M, Y) {
    var K = "", J = T.tag, le, ne, fe;
    for (le = 0, ne = Y.length; le < ne; le += 1)
      fe = Y[le], T.replacer && (fe = T.replacer.call(Y, String(le), fe)), (he(T, M, fe, !1, !1) || typeof fe > "u" && he(T, M, null, !1, !1)) && (K !== "" && (K += "," + (T.condenseFlow ? "" : " ")), K += T.dump);
    T.tag = J, T.dump = "[" + K + "]";
  }
  function W(T, M, Y, K) {
    var J = "", le = T.tag, ne, fe, ge;
    for (ne = 0, fe = Y.length; ne < fe; ne += 1)
      ge = Y[ne], T.replacer && (ge = T.replacer.call(Y, String(ne), ge)), (he(T, M + 1, ge, !0, !0, !1, !0) || typeof ge > "u" && he(T, M + 1, null, !0, !0, !1, !0)) && ((!K || J !== "") && (J += Ae(T, M)), T.dump && u === T.dump.charCodeAt(0) ? J += "-" : J += "- ", J += T.dump);
    T.tag = le, T.dump = J || "[]";
  }
  function se(T, M, Y) {
    var K = "", J = T.tag, le = Object.keys(Y), ne, fe, ge, Te, Ue;
    for (ne = 0, fe = le.length; ne < fe; ne += 1)
      Ue = "", K !== "" && (Ue += ", "), T.condenseFlow && (Ue += '"'), ge = le[ne], Te = Y[ge], T.replacer && (Te = T.replacer.call(Y, ge, Te)), he(T, M, ge, !1, !1) && (T.dump.length > 1024 && (Ue += "? "), Ue += T.dump + (T.condenseFlow ? '"' : "") + ":" + (T.condenseFlow ? "" : " "), he(T, M, Te, !1, !1) && (Ue += T.dump, K += Ue));
    T.tag = J, T.dump = "{" + K + "}";
  }
  function re(T, M, Y, K) {
    var J = "", le = T.tag, ne = Object.keys(Y), fe, ge, Te, Ue, Me, Fe;
    if (T.sortKeys === !0)
      ne.sort();
    else if (typeof T.sortKeys == "function")
      ne.sort(T.sortKeys);
    else if (T.sortKeys)
      throw new e("sortKeys must be a boolean or a function");
    for (fe = 0, ge = ne.length; fe < ge; fe += 1)
      Fe = "", (!K || J !== "") && (Fe += Ae(T, M)), Te = ne[fe], Ue = Y[Te], T.replacer && (Ue = T.replacer.call(Y, Te, Ue)), he(T, M + 1, Te, !0, !0, !0) && (Me = T.tag !== null && T.tag !== "?" || T.dump && T.dump.length > 1024, Me && (T.dump && u === T.dump.charCodeAt(0) ? Fe += "?" : Fe += "? "), Fe += T.dump, Me && (Fe += Ae(T, M)), he(T, M + 1, Ue, !0, Me) && (T.dump && u === T.dump.charCodeAt(0) ? Fe += ":" : Fe += ": ", Fe += T.dump, J += Fe));
    T.tag = le, T.dump = J || "{}";
  }
  function ue(T, M, Y) {
    var K, J, le, ne, fe, ge;
    for (J = Y ? T.explicitTypes : T.implicitTypes, le = 0, ne = J.length; le < ne; le += 1)
      if (fe = J[le], (fe.instanceOf || fe.predicate) && (!fe.instanceOf || typeof M == "object" && M instanceof fe.instanceOf) && (!fe.predicate || fe.predicate(M))) {
        if (Y ? fe.multi && fe.representName ? T.tag = fe.representName(M) : T.tag = fe.tag : T.tag = "?", fe.represent) {
          if (ge = T.styleMap[fe.tag] || fe.defaultStyle, n.call(fe.represent) === "[object Function]")
            K = fe.represent(M, ge);
          else if (i.call(fe.represent, ge))
            K = fe.represent[ge](M, ge);
          else
            throw new e("!<" + fe.tag + '> tag resolver accepts not "' + ge + '" style');
          T.dump = K;
        }
        return !0;
      }
    return !1;
  }
  function he(T, M, Y, K, J, le, ne) {
    T.tag = null, T.dump = Y, ue(T, Y, !1) || ue(T, Y, !0);
    var fe = n.call(T.dump), ge = K, Te;
    K && (K = T.flowLevel < 0 || T.flowLevel > M);
    var Ue = fe === "[object Object]" || fe === "[object Array]", Me, Fe;
    if (Ue && (Me = T.duplicates.indexOf(Y), Fe = Me !== -1), (T.tag !== null && T.tag !== "?" || Fe || T.indent !== 2 && M > 0) && (J = !1), Fe && T.usedDuplicates[Me])
      T.dump = "*ref_" + Me;
    else {
      if (Ue && Fe && !T.usedDuplicates[Me] && (T.usedDuplicates[Me] = !0), fe === "[object Object]")
        K && Object.keys(T.dump).length !== 0 ? (re(T, M, T.dump, J), Fe && (T.dump = "&ref_" + Me + T.dump)) : (se(T, M, T.dump), Fe && (T.dump = "&ref_" + Me + " " + T.dump));
      else if (fe === "[object Array]")
        K && T.dump.length !== 0 ? (T.noArrayIndent && !ne && M > 0 ? W(T, M - 1, T.dump, J) : W(T, M, T.dump, J), Fe && (T.dump = "&ref_" + Me + T.dump)) : (ae(T, M, T.dump), Fe && (T.dump = "&ref_" + Me + " " + T.dump));
      else if (fe === "[object String]")
        T.tag !== "?" && xt(T, T.dump, M, le, ge);
      else {
        if (fe === "[object Undefined]")
          return !1;
        if (T.skipInvalid) return !1;
        throw new e("unacceptable kind of an object to dump " + fe);
      }
      T.tag !== null && T.tag !== "?" && (Te = encodeURI(
        T.tag[0] === "!" ? T.tag.slice(1) : T.tag
      ).replace(/!/g, "%21"), T.tag[0] === "!" ? Te = "!" + Te : Te.slice(0, 18) === "tag:yaml.org,2002:" ? Te = "!!" + Te.slice(18) : Te = "!<" + Te + ">", T.dump = Te + " " + T.dump);
    }
    return !0;
  }
  function Le(T, M) {
    var Y = [], K = [], J, le;
    for (xe(T, Y, K), J = 0, le = K.length; J < le; J += 1)
      M.duplicates.push(Y[K[J]]);
    M.usedDuplicates = new Array(le);
  }
  function xe(T, M, Y) {
    var K, J, le;
    if (T !== null && typeof T == "object")
      if (J = M.indexOf(T), J !== -1)
        Y.indexOf(J) === -1 && Y.push(J);
      else if (M.push(T), Array.isArray(T))
        for (J = 0, le = T.length; J < le; J += 1)
          xe(T[J], M, Y);
      else
        for (K = Object.keys(T), J = 0, le = K.length; J < le; J += 1)
          xe(T[K[J]], M, Y);
  }
  function Ee(T, M) {
    M = M || {};
    var Y = new ye(M);
    Y.noRefs || Le(T, Y);
    var K = T;
    return Y.replacer && (K = Y.replacer.call({ "": K }, "", K)), he(Y, 0, K, !0, !0) ? Y.dump + `
` : "";
  }
  return rs.dump = Ee, rs;
}
var ml;
function ma() {
  if (ml) return et;
  ml = 1;
  var r = Gd(), e = zd();
  function t(n, i) {
    return function() {
      throw new Error("Function yaml." + n + " is removed in js-yaml 4. Use yaml." + i + " instead, which is now safe by default.");
    };
  }
  return et.Type = at(), et.Schema = gc(), et.FAILSAFE_SCHEMA = Ec(), et.JSON_SCHEMA = Cc(), et.CORE_SCHEMA = Ac(), et.DEFAULT_SCHEMA = pa(), et.load = r.load, et.loadAll = r.loadAll, et.dump = e.dump, et.YAMLException = sn(), et.types = {
    binary: Oc(),
    float: Tc(),
    map: vc(),
    null: Sc(),
    pairs: Pc(),
    set: Dc(),
    timestamp: Rc(),
    bool: bc(),
    int: _c(),
    merge: Nc(),
    omap: Ic(),
    seq: wc(),
    str: yc()
  }, et.safeLoad = t("safeLoad", "load"), et.safeLoadAll = t("safeLoadAll", "loadAll"), et.safeDump = t("safeDump", "dump"), et;
}
var Dr = {}, gl;
function Vd() {
  if (gl) return Dr;
  gl = 1, Object.defineProperty(Dr, "__esModule", { value: !0 }), Dr.Lazy = void 0;
  class r {
    constructor(t) {
      this._value = null, this.creator = t;
    }
    get hasValue() {
      return this.creator == null;
    }
    get value() {
      if (this.creator == null)
        return this._value;
      const t = this.creator();
      return this.value = t, t;
    }
    set value(t) {
      this._value = t, this.creator = null;
    }
  }
  return Dr.Lazy = r, Dr;
}
var Tn = { exports: {} }, ns, yl;
function Mn() {
  if (yl) return ns;
  yl = 1;
  const r = "2.0.0", e = 256, t = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, n = 16, i = e - 6;
  return ns = {
    MAX_LENGTH: e,
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: i,
    MAX_SAFE_INTEGER: t,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: r,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, ns;
}
var is, wl;
function jn() {
  return wl || (wl = 1, is = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
  }), is;
}
var vl;
function an() {
  return vl || (vl = 1, (function(r, e) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: t,
      MAX_SAFE_BUILD_LENGTH: n,
      MAX_LENGTH: i
    } = Mn(), s = jn();
    e = r.exports = {};
    const a = e.re = [], u = e.safeRe = [], o = e.src = [], f = e.safeSrc = [], l = e.t = {};
    let c = 0;
    const d = "[a-zA-Z0-9-]", p = [
      ["\\s", 1],
      ["\\d", i],
      [d, n]
    ], g = (m) => {
      for (const [E, C] of p)
        m = m.split(`${E}*`).join(`${E}{0,${C}}`).split(`${E}+`).join(`${E}{1,${C}}`);
      return m;
    }, w = (m, E, C) => {
      const N = g(E), O = c++;
      s(m, O, E), l[m] = O, o[O] = E, f[O] = N, a[O] = new RegExp(E, C ? "g" : void 0), u[O] = new RegExp(N, C ? "g" : void 0);
    };
    w("NUMERICIDENTIFIER", "0|[1-9]\\d*"), w("NUMERICIDENTIFIERLOOSE", "\\d+"), w("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), w("MAINVERSION", `(${o[l.NUMERICIDENTIFIER]})\\.(${o[l.NUMERICIDENTIFIER]})\\.(${o[l.NUMERICIDENTIFIER]})`), w("MAINVERSIONLOOSE", `(${o[l.NUMERICIDENTIFIERLOOSE]})\\.(${o[l.NUMERICIDENTIFIERLOOSE]})\\.(${o[l.NUMERICIDENTIFIERLOOSE]})`), w("PRERELEASEIDENTIFIER", `(?:${o[l.NONNUMERICIDENTIFIER]}|${o[l.NUMERICIDENTIFIER]})`), w("PRERELEASEIDENTIFIERLOOSE", `(?:${o[l.NONNUMERICIDENTIFIER]}|${o[l.NUMERICIDENTIFIERLOOSE]})`), w("PRERELEASE", `(?:-(${o[l.PRERELEASEIDENTIFIER]}(?:\\.${o[l.PRERELEASEIDENTIFIER]})*))`), w("PRERELEASELOOSE", `(?:-?(${o[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${o[l.PRERELEASEIDENTIFIERLOOSE]})*))`), w("BUILDIDENTIFIER", `${d}+`), w("BUILD", `(?:\\+(${o[l.BUILDIDENTIFIER]}(?:\\.${o[l.BUILDIDENTIFIER]})*))`), w("FULLPLAIN", `v?${o[l.MAINVERSION]}${o[l.PRERELEASE]}?${o[l.BUILD]}?`), w("FULL", `^${o[l.FULLPLAIN]}$`), w("LOOSEPLAIN", `[v=\\s]*${o[l.MAINVERSIONLOOSE]}${o[l.PRERELEASELOOSE]}?${o[l.BUILD]}?`), w("LOOSE", `^${o[l.LOOSEPLAIN]}$`), w("GTLT", "((?:<|>)?=?)"), w("XRANGEIDENTIFIERLOOSE", `${o[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), w("XRANGEIDENTIFIER", `${o[l.NUMERICIDENTIFIER]}|x|X|\\*`), w("XRANGEPLAIN", `[v=\\s]*(${o[l.XRANGEIDENTIFIER]})(?:\\.(${o[l.XRANGEIDENTIFIER]})(?:\\.(${o[l.XRANGEIDENTIFIER]})(?:${o[l.PRERELEASE]})?${o[l.BUILD]}?)?)?`), w("XRANGEPLAINLOOSE", `[v=\\s]*(${o[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[l.XRANGEIDENTIFIERLOOSE]})(?:${o[l.PRERELEASELOOSE]})?${o[l.BUILD]}?)?)?`), w("XRANGE", `^${o[l.GTLT]}\\s*${o[l.XRANGEPLAIN]}$`), w("XRANGELOOSE", `^${o[l.GTLT]}\\s*${o[l.XRANGEPLAINLOOSE]}$`), w("COERCEPLAIN", `(^|[^\\d])(\\d{1,${t}})(?:\\.(\\d{1,${t}}))?(?:\\.(\\d{1,${t}}))?`), w("COERCE", `${o[l.COERCEPLAIN]}(?:$|[^\\d])`), w("COERCEFULL", o[l.COERCEPLAIN] + `(?:${o[l.PRERELEASE]})?(?:${o[l.BUILD]})?(?:$|[^\\d])`), w("COERCERTL", o[l.COERCE], !0), w("COERCERTLFULL", o[l.COERCEFULL], !0), w("LONETILDE", "(?:~>?)"), w("TILDETRIM", `(\\s*)${o[l.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", w("TILDE", `^${o[l.LONETILDE]}${o[l.XRANGEPLAIN]}$`), w("TILDELOOSE", `^${o[l.LONETILDE]}${o[l.XRANGEPLAINLOOSE]}$`), w("LONECARET", "(?:\\^)"), w("CARETTRIM", `(\\s*)${o[l.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", w("CARET", `^${o[l.LONECARET]}${o[l.XRANGEPLAIN]}$`), w("CARETLOOSE", `^${o[l.LONECARET]}${o[l.XRANGEPLAINLOOSE]}$`), w("COMPARATORLOOSE", `^${o[l.GTLT]}\\s*(${o[l.LOOSEPLAIN]})$|^$`), w("COMPARATOR", `^${o[l.GTLT]}\\s*(${o[l.FULLPLAIN]})$|^$`), w("COMPARATORTRIM", `(\\s*)${o[l.GTLT]}\\s*(${o[l.LOOSEPLAIN]}|${o[l.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", w("HYPHENRANGE", `^\\s*(${o[l.XRANGEPLAIN]})\\s+-\\s+(${o[l.XRANGEPLAIN]})\\s*$`), w("HYPHENRANGELOOSE", `^\\s*(${o[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${o[l.XRANGEPLAINLOOSE]})\\s*$`), w("STAR", "(<|>)?=?\\s*\\*"), w("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), w("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(Tn, Tn.exports)), Tn.exports;
}
var ss, El;
function ga() {
  if (El) return ss;
  El = 1;
  const r = Object.freeze({ loose: !0 }), e = Object.freeze({});
  return ss = (n) => n ? typeof n != "object" ? r : n : e, ss;
}
var as, Sl;
function Lc() {
  if (Sl) return as;
  Sl = 1;
  const r = /^[0-9]+$/, e = (n, i) => {
    if (typeof n == "number" && typeof i == "number")
      return n === i ? 0 : n < i ? -1 : 1;
    const s = r.test(n), a = r.test(i);
    return s && a && (n = +n, i = +i), n === i ? 0 : s && !a ? -1 : a && !s ? 1 : n < i ? -1 : 1;
  };
  return as = {
    compareIdentifiers: e,
    rcompareIdentifiers: (n, i) => e(i, n)
  }, as;
}
var os, bl;
function ot() {
  if (bl) return os;
  bl = 1;
  const r = jn(), { MAX_LENGTH: e, MAX_SAFE_INTEGER: t } = Mn(), { safeRe: n, t: i } = an(), s = ga(), { compareIdentifiers: a } = Lc();
  class u {
    constructor(f, l) {
      if (l = s(l), f instanceof u) {
        if (f.loose === !!l.loose && f.includePrerelease === !!l.includePrerelease)
          return f;
        f = f.version;
      } else if (typeof f != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof f}".`);
      if (f.length > e)
        throw new TypeError(
          `version is longer than ${e} characters`
        );
      r("SemVer", f, l), this.options = l, this.loose = !!l.loose, this.includePrerelease = !!l.includePrerelease;
      const c = f.trim().match(l.loose ? n[i.LOOSE] : n[i.FULL]);
      if (!c)
        throw new TypeError(`Invalid Version: ${f}`);
      if (this.raw = f, this.major = +c[1], this.minor = +c[2], this.patch = +c[3], this.major > t || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > t || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > t || this.patch < 0)
        throw new TypeError("Invalid patch version");
      c[4] ? this.prerelease = c[4].split(".").map((d) => {
        if (/^[0-9]+$/.test(d)) {
          const p = +d;
          if (p >= 0 && p < t)
            return p;
        }
        return d;
      }) : this.prerelease = [], this.build = c[5] ? c[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(f) {
      if (r("SemVer.compare", this.version, this.options, f), !(f instanceof u)) {
        if (typeof f == "string" && f === this.version)
          return 0;
        f = new u(f, this.options);
      }
      return f.version === this.version ? 0 : this.compareMain(f) || this.comparePre(f);
    }
    compareMain(f) {
      return f instanceof u || (f = new u(f, this.options)), this.major < f.major ? -1 : this.major > f.major ? 1 : this.minor < f.minor ? -1 : this.minor > f.minor ? 1 : this.patch < f.patch ? -1 : this.patch > f.patch ? 1 : 0;
    }
    comparePre(f) {
      if (f instanceof u || (f = new u(f, this.options)), this.prerelease.length && !f.prerelease.length)
        return -1;
      if (!this.prerelease.length && f.prerelease.length)
        return 1;
      if (!this.prerelease.length && !f.prerelease.length)
        return 0;
      let l = 0;
      do {
        const c = this.prerelease[l], d = f.prerelease[l];
        if (r("prerelease compare", l, c, d), c === void 0 && d === void 0)
          return 0;
        if (d === void 0)
          return 1;
        if (c === void 0)
          return -1;
        if (c === d)
          continue;
        return a(c, d);
      } while (++l);
    }
    compareBuild(f) {
      f instanceof u || (f = new u(f, this.options));
      let l = 0;
      do {
        const c = this.build[l], d = f.build[l];
        if (r("build compare", l, c, d), c === void 0 && d === void 0)
          return 0;
        if (d === void 0)
          return 1;
        if (c === void 0)
          return -1;
        if (c === d)
          continue;
        return a(c, d);
      } while (++l);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(f, l, c) {
      if (f.startsWith("pre")) {
        if (!l && c === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (l) {
          const d = `-${l}`.match(this.options.loose ? n[i.PRERELEASELOOSE] : n[i.PRERELEASE]);
          if (!d || d[1] !== l)
            throw new Error(`invalid identifier: ${l}`);
        }
      }
      switch (f) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", l, c);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", l, c);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", l, c), this.inc("pre", l, c);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", l, c), this.inc("pre", l, c);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const d = Number(c) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [d];
          else {
            let p = this.prerelease.length;
            for (; --p >= 0; )
              typeof this.prerelease[p] == "number" && (this.prerelease[p]++, p = -2);
            if (p === -1) {
              if (l === this.prerelease.join(".") && c === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(d);
            }
          }
          if (l) {
            let p = [l, d];
            c === !1 && (p = [l]), a(this.prerelease[0], l) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = p) : this.prerelease = p;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${f}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return os = u, os;
}
var ls, _l;
function Cr() {
  if (_l) return ls;
  _l = 1;
  const r = ot();
  return ls = (t, n, i = !1) => {
    if (t instanceof r)
      return t;
    try {
      return new r(t, n);
    } catch (s) {
      if (!i)
        return null;
      throw s;
    }
  }, ls;
}
var us, Tl;
function Wd() {
  if (Tl) return us;
  Tl = 1;
  const r = Cr();
  return us = (t, n) => {
    const i = r(t, n);
    return i ? i.version : null;
  }, us;
}
var cs, Cl;
function Yd() {
  if (Cl) return cs;
  Cl = 1;
  const r = Cr();
  return cs = (t, n) => {
    const i = r(t.trim().replace(/^[=v]+/, ""), n);
    return i ? i.version : null;
  }, cs;
}
var fs, Al;
function Kd() {
  if (Al) return fs;
  Al = 1;
  const r = ot();
  return fs = (t, n, i, s, a) => {
    typeof i == "string" && (a = s, s = i, i = void 0);
    try {
      return new r(
        t instanceof r ? t.version : t,
        i
      ).inc(n, s, a).version;
    } catch {
      return null;
    }
  }, fs;
}
var ds, Rl;
function Jd() {
  if (Rl) return ds;
  Rl = 1;
  const r = Cr();
  return ds = (t, n) => {
    const i = r(t, null, !0), s = r(n, null, !0), a = i.compare(s);
    if (a === 0)
      return null;
    const u = a > 0, o = u ? i : s, f = u ? s : i, l = !!o.prerelease.length;
    if (!!f.prerelease.length && !l) {
      if (!f.patch && !f.minor)
        return "major";
      if (f.compareMain(o) === 0)
        return f.minor && !f.patch ? "minor" : "patch";
    }
    const d = l ? "pre" : "";
    return i.major !== s.major ? d + "major" : i.minor !== s.minor ? d + "minor" : i.patch !== s.patch ? d + "patch" : "prerelease";
  }, ds;
}
var hs, Nl;
function Xd() {
  if (Nl) return hs;
  Nl = 1;
  const r = ot();
  return hs = (t, n) => new r(t, n).major, hs;
}
var ps, Ol;
function Zd() {
  if (Ol) return ps;
  Ol = 1;
  const r = ot();
  return ps = (t, n) => new r(t, n).minor, ps;
}
var ms, Il;
function eh() {
  if (Il) return ms;
  Il = 1;
  const r = ot();
  return ms = (t, n) => new r(t, n).patch, ms;
}
var gs, Pl;
function th() {
  if (Pl) return gs;
  Pl = 1;
  const r = Cr();
  return gs = (t, n) => {
    const i = r(t, n);
    return i && i.prerelease.length ? i.prerelease : null;
  }, gs;
}
var ys, Dl;
function _t() {
  if (Dl) return ys;
  Dl = 1;
  const r = ot();
  return ys = (t, n, i) => new r(t, i).compare(new r(n, i)), ys;
}
var ws, Ll;
function rh() {
  if (Ll) return ws;
  Ll = 1;
  const r = _t();
  return ws = (t, n, i) => r(n, t, i), ws;
}
var vs, xl;
function nh() {
  if (xl) return vs;
  xl = 1;
  const r = _t();
  return vs = (t, n) => r(t, n, !0), vs;
}
var Es, Fl;
function ya() {
  if (Fl) return Es;
  Fl = 1;
  const r = ot();
  return Es = (t, n, i) => {
    const s = new r(t, i), a = new r(n, i);
    return s.compare(a) || s.compareBuild(a);
  }, Es;
}
var Ss, Ul;
function ih() {
  if (Ul) return Ss;
  Ul = 1;
  const r = ya();
  return Ss = (t, n) => t.sort((i, s) => r(i, s, n)), Ss;
}
var bs, ql;
function sh() {
  if (ql) return bs;
  ql = 1;
  const r = ya();
  return bs = (t, n) => t.sort((i, s) => r(s, i, n)), bs;
}
var _s, $l;
function Hn() {
  if ($l) return _s;
  $l = 1;
  const r = _t();
  return _s = (t, n, i) => r(t, n, i) > 0, _s;
}
var Ts, kl;
function wa() {
  if (kl) return Ts;
  kl = 1;
  const r = _t();
  return Ts = (t, n, i) => r(t, n, i) < 0, Ts;
}
var Cs, Bl;
function xc() {
  if (Bl) return Cs;
  Bl = 1;
  const r = _t();
  return Cs = (t, n, i) => r(t, n, i) === 0, Cs;
}
var As, Ml;
function Fc() {
  if (Ml) return As;
  Ml = 1;
  const r = _t();
  return As = (t, n, i) => r(t, n, i) !== 0, As;
}
var Rs, jl;
function va() {
  if (jl) return Rs;
  jl = 1;
  const r = _t();
  return Rs = (t, n, i) => r(t, n, i) >= 0, Rs;
}
var Ns, Hl;
function Ea() {
  if (Hl) return Ns;
  Hl = 1;
  const r = _t();
  return Ns = (t, n, i) => r(t, n, i) <= 0, Ns;
}
var Os, Ql;
function Uc() {
  if (Ql) return Os;
  Ql = 1;
  const r = xc(), e = Fc(), t = Hn(), n = va(), i = wa(), s = Ea();
  return Os = (u, o, f, l) => {
    switch (o) {
      case "===":
        return typeof u == "object" && (u = u.version), typeof f == "object" && (f = f.version), u === f;
      case "!==":
        return typeof u == "object" && (u = u.version), typeof f == "object" && (f = f.version), u !== f;
      case "":
      case "=":
      case "==":
        return r(u, f, l);
      case "!=":
        return e(u, f, l);
      case ">":
        return t(u, f, l);
      case ">=":
        return n(u, f, l);
      case "<":
        return i(u, f, l);
      case "<=":
        return s(u, f, l);
      default:
        throw new TypeError(`Invalid operator: ${o}`);
    }
  }, Os;
}
var Is, Gl;
function ah() {
  if (Gl) return Is;
  Gl = 1;
  const r = ot(), e = Cr(), { safeRe: t, t: n } = an();
  return Is = (s, a) => {
    if (s instanceof r)
      return s;
    if (typeof s == "number" && (s = String(s)), typeof s != "string")
      return null;
    a = a || {};
    let u = null;
    if (!a.rtl)
      u = s.match(a.includePrerelease ? t[n.COERCEFULL] : t[n.COERCE]);
    else {
      const p = a.includePrerelease ? t[n.COERCERTLFULL] : t[n.COERCERTL];
      let g;
      for (; (g = p.exec(s)) && (!u || u.index + u[0].length !== s.length); )
        (!u || g.index + g[0].length !== u.index + u[0].length) && (u = g), p.lastIndex = g.index + g[1].length + g[2].length;
      p.lastIndex = -1;
    }
    if (u === null)
      return null;
    const o = u[2], f = u[3] || "0", l = u[4] || "0", c = a.includePrerelease && u[5] ? `-${u[5]}` : "", d = a.includePrerelease && u[6] ? `+${u[6]}` : "";
    return e(`${o}.${f}.${l}${c}${d}`, a);
  }, Is;
}
var Ps, zl;
function oh() {
  if (zl) return Ps;
  zl = 1;
  class r {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(t) {
      const n = this.map.get(t);
      if (n !== void 0)
        return this.map.delete(t), this.map.set(t, n), n;
    }
    delete(t) {
      return this.map.delete(t);
    }
    set(t, n) {
      if (!this.delete(t) && n !== void 0) {
        if (this.map.size >= this.max) {
          const s = this.map.keys().next().value;
          this.delete(s);
        }
        this.map.set(t, n);
      }
      return this;
    }
  }
  return Ps = r, Ps;
}
var Ds, Vl;
function Tt() {
  if (Vl) return Ds;
  Vl = 1;
  const r = /\s+/g;
  class e {
    constructor(L, Q) {
      if (Q = i(Q), L instanceof e)
        return L.loose === !!Q.loose && L.includePrerelease === !!Q.includePrerelease ? L : new e(L.raw, Q);
      if (L instanceof s)
        return this.raw = L.value, this.set = [[L]], this.formatted = void 0, this;
      if (this.options = Q, this.loose = !!Q.loose, this.includePrerelease = !!Q.includePrerelease, this.raw = L.trim().replace(r, " "), this.set = this.raw.split("||").map((P) => this.parseRange(P.trim())).filter((P) => P.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const P = this.set[0];
        if (this.set = this.set.filter((G) => !w(G[0])), this.set.length === 0)
          this.set = [P];
        else if (this.set.length > 1) {
          for (const G of this.set)
            if (G.length === 1 && m(G[0])) {
              this.set = [G];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let L = 0; L < this.set.length; L++) {
          L > 0 && (this.formatted += "||");
          const Q = this.set[L];
          for (let P = 0; P < Q.length; P++)
            P > 0 && (this.formatted += " "), this.formatted += Q[P].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(L) {
      const P = ((this.options.includePrerelease && p) | (this.options.loose && g)) + ":" + L, G = n.get(P);
      if (G)
        return G;
      const V = this.options.loose, ie = V ? o[f.HYPHENRANGELOOSE] : o[f.HYPHENRANGE];
      L = L.replace(ie, F(this.options.includePrerelease)), a("hyphen replace", L), L = L.replace(o[f.COMPARATORTRIM], l), a("comparator trim", L), L = L.replace(o[f.TILDETRIM], c), a("tilde trim", L), L = L.replace(o[f.CARETTRIM], d), a("caret trim", L);
      let ye = L.split(" ").map((ee) => C(ee, this.options)).join(" ").split(/\s+/).map((ee) => B(ee, this.options));
      V && (ye = ye.filter((ee) => (a("loose invalid filter", ee, this.options), !!ee.match(o[f.COMPARATORLOOSE])))), a("range list", ye);
      const oe = /* @__PURE__ */ new Map(), Ae = ye.map((ee) => new s(ee, this.options));
      for (const ee of Ae) {
        if (w(ee))
          return [ee];
        oe.set(ee.value, ee);
      }
      oe.size > 1 && oe.has("") && oe.delete("");
      const be = [...oe.values()];
      return n.set(P, be), be;
    }
    intersects(L, Q) {
      if (!(L instanceof e))
        throw new TypeError("a Range is required");
      return this.set.some((P) => E(P, Q) && L.set.some((G) => E(G, Q) && P.every((V) => G.every((ie) => V.intersects(ie, Q)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(L) {
      if (!L)
        return !1;
      if (typeof L == "string")
        try {
          L = new u(L, this.options);
        } catch {
          return !1;
        }
      for (let Q = 0; Q < this.set.length; Q++)
        if (q(this.set[Q], L, this.options))
          return !0;
      return !1;
    }
  }
  Ds = e;
  const t = oh(), n = new t(), i = ga(), s = Qn(), a = jn(), u = ot(), {
    safeRe: o,
    t: f,
    comparatorTrimReplace: l,
    tildeTrimReplace: c,
    caretTrimReplace: d
  } = an(), { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: g } = Mn(), w = (D) => D.value === "<0.0.0-0", m = (D) => D.value === "", E = (D, L) => {
    let Q = !0;
    const P = D.slice();
    let G = P.pop();
    for (; Q && P.length; )
      Q = P.every((V) => G.intersects(V, L)), G = P.pop();
    return Q;
  }, C = (D, L) => (D = D.replace(o[f.BUILD], ""), a("comp", D, L), D = I(D, L), a("caret", D), D = O(D, L), a("tildes", D), D = S(D, L), a("xrange", D), D = k(D, L), a("stars", D), D), N = (D) => !D || D.toLowerCase() === "x" || D === "*", O = (D, L) => D.trim().split(/\s+/).map((Q) => R(Q, L)).join(" "), R = (D, L) => {
    const Q = L.loose ? o[f.TILDELOOSE] : o[f.TILDE];
    return D.replace(Q, (P, G, V, ie, ye) => {
      a("tilde", D, P, G, V, ie, ye);
      let oe;
      return N(G) ? oe = "" : N(V) ? oe = `>=${G}.0.0 <${+G + 1}.0.0-0` : N(ie) ? oe = `>=${G}.${V}.0 <${G}.${+V + 1}.0-0` : ye ? (a("replaceTilde pr", ye), oe = `>=${G}.${V}.${ie}-${ye} <${G}.${+V + 1}.0-0`) : oe = `>=${G}.${V}.${ie} <${G}.${+V + 1}.0-0`, a("tilde return", oe), oe;
    });
  }, I = (D, L) => D.trim().split(/\s+/).map((Q) => _(Q, L)).join(" "), _ = (D, L) => {
    a("caret", D, L);
    const Q = L.loose ? o[f.CARETLOOSE] : o[f.CARET], P = L.includePrerelease ? "-0" : "";
    return D.replace(Q, (G, V, ie, ye, oe) => {
      a("caret", D, G, V, ie, ye, oe);
      let Ae;
      return N(V) ? Ae = "" : N(ie) ? Ae = `>=${V}.0.0${P} <${+V + 1}.0.0-0` : N(ye) ? V === "0" ? Ae = `>=${V}.${ie}.0${P} <${V}.${+ie + 1}.0-0` : Ae = `>=${V}.${ie}.0${P} <${+V + 1}.0.0-0` : oe ? (a("replaceCaret pr", oe), V === "0" ? ie === "0" ? Ae = `>=${V}.${ie}.${ye}-${oe} <${V}.${ie}.${+ye + 1}-0` : Ae = `>=${V}.${ie}.${ye}-${oe} <${V}.${+ie + 1}.0-0` : Ae = `>=${V}.${ie}.${ye}-${oe} <${+V + 1}.0.0-0`) : (a("no pr"), V === "0" ? ie === "0" ? Ae = `>=${V}.${ie}.${ye}${P} <${V}.${ie}.${+ye + 1}-0` : Ae = `>=${V}.${ie}.${ye}${P} <${V}.${+ie + 1}.0-0` : Ae = `>=${V}.${ie}.${ye} <${+V + 1}.0.0-0`), a("caret return", Ae), Ae;
    });
  }, S = (D, L) => (a("replaceXRanges", D, L), D.split(/\s+/).map((Q) => y(Q, L)).join(" ")), y = (D, L) => {
    D = D.trim();
    const Q = L.loose ? o[f.XRANGELOOSE] : o[f.XRANGE];
    return D.replace(Q, (P, G, V, ie, ye, oe) => {
      a("xRange", D, P, G, V, ie, ye, oe);
      const Ae = N(V), be = Ae || N(ie), ee = be || N(ye), Se = ee;
      return G === "=" && Se && (G = ""), oe = L.includePrerelease ? "-0" : "", Ae ? G === ">" || G === "<" ? P = "<0.0.0-0" : P = "*" : G && Se ? (be && (ie = 0), ye = 0, G === ">" ? (G = ">=", be ? (V = +V + 1, ie = 0, ye = 0) : (ie = +ie + 1, ye = 0)) : G === "<=" && (G = "<", be ? V = +V + 1 : ie = +ie + 1), G === "<" && (oe = "-0"), P = `${G + V}.${ie}.${ye}${oe}`) : be ? P = `>=${V}.0.0${oe} <${+V + 1}.0.0-0` : ee && (P = `>=${V}.${ie}.0${oe} <${V}.${+ie + 1}.0-0`), a("xRange return", P), P;
    });
  }, k = (D, L) => (a("replaceStars", D, L), D.trim().replace(o[f.STAR], "")), B = (D, L) => (a("replaceGTE0", D, L), D.trim().replace(o[L.includePrerelease ? f.GTE0PRE : f.GTE0], "")), F = (D) => (L, Q, P, G, V, ie, ye, oe, Ae, be, ee, Se) => (N(P) ? Q = "" : N(G) ? Q = `>=${P}.0.0${D ? "-0" : ""}` : N(V) ? Q = `>=${P}.${G}.0${D ? "-0" : ""}` : ie ? Q = `>=${Q}` : Q = `>=${Q}${D ? "-0" : ""}`, N(Ae) ? oe = "" : N(be) ? oe = `<${+Ae + 1}.0.0-0` : N(ee) ? oe = `<${Ae}.${+be + 1}.0-0` : Se ? oe = `<=${Ae}.${be}.${ee}-${Se}` : D ? oe = `<${Ae}.${be}.${+ee + 1}-0` : oe = `<=${oe}`, `${Q} ${oe}`.trim()), q = (D, L, Q) => {
    for (let P = 0; P < D.length; P++)
      if (!D[P].test(L))
        return !1;
    if (L.prerelease.length && !Q.includePrerelease) {
      for (let P = 0; P < D.length; P++)
        if (a(D[P].semver), D[P].semver !== s.ANY && D[P].semver.prerelease.length > 0) {
          const G = D[P].semver;
          if (G.major === L.major && G.minor === L.minor && G.patch === L.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ds;
}
var Ls, Wl;
function Qn() {
  if (Wl) return Ls;
  Wl = 1;
  const r = /* @__PURE__ */ Symbol("SemVer ANY");
  class e {
    static get ANY() {
      return r;
    }
    constructor(l, c) {
      if (c = t(c), l instanceof e) {
        if (l.loose === !!c.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), a("comparator", l, c), this.options = c, this.loose = !!c.loose, this.parse(l), this.semver === r ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(l) {
      const c = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], d = l.match(c);
      if (!d)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = d[1] !== void 0 ? d[1] : "", this.operator === "=" && (this.operator = ""), d[2] ? this.semver = new u(d[2], this.options.loose) : this.semver = r;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (a("Comparator.test", l, this.options.loose), this.semver === r || l === r)
        return !0;
      if (typeof l == "string")
        try {
          l = new u(l, this.options);
        } catch {
          return !1;
        }
      return s(l, this.operator, this.semver, this.options);
    }
    intersects(l, c) {
      if (!(l instanceof e))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new o(l.value, c).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new o(this.value, c).test(l.semver) : (c = t(c), c.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !c.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || s(this.semver, "<", l.semver, c) && this.operator.startsWith(">") && l.operator.startsWith("<") || s(this.semver, ">", l.semver, c) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  Ls = e;
  const t = ga(), { safeRe: n, t: i } = an(), s = Uc(), a = jn(), u = ot(), o = Tt();
  return Ls;
}
var xs, Yl;
function Gn() {
  if (Yl) return xs;
  Yl = 1;
  const r = Tt();
  return xs = (t, n, i) => {
    try {
      n = new r(n, i);
    } catch {
      return !1;
    }
    return n.test(t);
  }, xs;
}
var Fs, Kl;
function lh() {
  if (Kl) return Fs;
  Kl = 1;
  const r = Tt();
  return Fs = (t, n) => new r(t, n).set.map((i) => i.map((s) => s.value).join(" ").trim().split(" ")), Fs;
}
var Us, Jl;
function uh() {
  if (Jl) return Us;
  Jl = 1;
  const r = ot(), e = Tt();
  return Us = (n, i, s) => {
    let a = null, u = null, o = null;
    try {
      o = new e(i, s);
    } catch {
      return null;
    }
    return n.forEach((f) => {
      o.test(f) && (!a || u.compare(f) === -1) && (a = f, u = new r(a, s));
    }), a;
  }, Us;
}
var qs, Xl;
function ch() {
  if (Xl) return qs;
  Xl = 1;
  const r = ot(), e = Tt();
  return qs = (n, i, s) => {
    let a = null, u = null, o = null;
    try {
      o = new e(i, s);
    } catch {
      return null;
    }
    return n.forEach((f) => {
      o.test(f) && (!a || u.compare(f) === 1) && (a = f, u = new r(a, s));
    }), a;
  }, qs;
}
var $s, Zl;
function fh() {
  if (Zl) return $s;
  Zl = 1;
  const r = ot(), e = Tt(), t = Hn();
  return $s = (i, s) => {
    i = new e(i, s);
    let a = new r("0.0.0");
    if (i.test(a) || (a = new r("0.0.0-0"), i.test(a)))
      return a;
    a = null;
    for (let u = 0; u < i.set.length; ++u) {
      const o = i.set[u];
      let f = null;
      o.forEach((l) => {
        const c = new r(l.semver.version);
        switch (l.operator) {
          case ">":
            c.prerelease.length === 0 ? c.patch++ : c.prerelease.push(0), c.raw = c.format();
          /* fallthrough */
          case "":
          case ">=":
            (!f || t(c, f)) && (f = c);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${l.operator}`);
        }
      }), f && (!a || t(a, f)) && (a = f);
    }
    return a && i.test(a) ? a : null;
  }, $s;
}
var ks, eu;
function dh() {
  if (eu) return ks;
  eu = 1;
  const r = Tt();
  return ks = (t, n) => {
    try {
      return new r(t, n).range || "*";
    } catch {
      return null;
    }
  }, ks;
}
var Bs, tu;
function Sa() {
  if (tu) return Bs;
  tu = 1;
  const r = ot(), e = Qn(), { ANY: t } = e, n = Tt(), i = Gn(), s = Hn(), a = wa(), u = Ea(), o = va();
  return Bs = (l, c, d, p) => {
    l = new r(l, p), c = new n(c, p);
    let g, w, m, E, C;
    switch (d) {
      case ">":
        g = s, w = u, m = a, E = ">", C = ">=";
        break;
      case "<":
        g = a, w = o, m = s, E = "<", C = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (i(l, c, p))
      return !1;
    for (let N = 0; N < c.set.length; ++N) {
      const O = c.set[N];
      let R = null, I = null;
      if (O.forEach((_) => {
        _.semver === t && (_ = new e(">=0.0.0")), R = R || _, I = I || _, g(_.semver, R.semver, p) ? R = _ : m(_.semver, I.semver, p) && (I = _);
      }), R.operator === E || R.operator === C || (!I.operator || I.operator === E) && w(l, I.semver))
        return !1;
      if (I.operator === C && m(l, I.semver))
        return !1;
    }
    return !0;
  }, Bs;
}
var Ms, ru;
function hh() {
  if (ru) return Ms;
  ru = 1;
  const r = Sa();
  return Ms = (t, n, i) => r(t, n, ">", i), Ms;
}
var js, nu;
function ph() {
  if (nu) return js;
  nu = 1;
  const r = Sa();
  return js = (t, n, i) => r(t, n, "<", i), js;
}
var Hs, iu;
function mh() {
  if (iu) return Hs;
  iu = 1;
  const r = Tt();
  return Hs = (t, n, i) => (t = new r(t, i), n = new r(n, i), t.intersects(n, i)), Hs;
}
var Qs, su;
function gh() {
  if (su) return Qs;
  su = 1;
  const r = Gn(), e = _t();
  return Qs = (t, n, i) => {
    const s = [];
    let a = null, u = null;
    const o = t.sort((d, p) => e(d, p, i));
    for (const d of o)
      r(d, n, i) ? (u = d, a || (a = d)) : (u && s.push([a, u]), u = null, a = null);
    a && s.push([a, null]);
    const f = [];
    for (const [d, p] of s)
      d === p ? f.push(d) : !p && d === o[0] ? f.push("*") : p ? d === o[0] ? f.push(`<=${p}`) : f.push(`${d} - ${p}`) : f.push(`>=${d}`);
    const l = f.join(" || "), c = typeof n.raw == "string" ? n.raw : String(n);
    return l.length < c.length ? l : n;
  }, Qs;
}
var Gs, au;
function yh() {
  if (au) return Gs;
  au = 1;
  const r = Tt(), e = Qn(), { ANY: t } = e, n = Gn(), i = _t(), s = (c, d, p = {}) => {
    if (c === d)
      return !0;
    c = new r(c, p), d = new r(d, p);
    let g = !1;
    e: for (const w of c.set) {
      for (const m of d.set) {
        const E = o(w, m, p);
        if (g = g || E !== null, E)
          continue e;
      }
      if (g)
        return !1;
    }
    return !0;
  }, a = [new e(">=0.0.0-0")], u = [new e(">=0.0.0")], o = (c, d, p) => {
    if (c === d)
      return !0;
    if (c.length === 1 && c[0].semver === t) {
      if (d.length === 1 && d[0].semver === t)
        return !0;
      p.includePrerelease ? c = a : c = u;
    }
    if (d.length === 1 && d[0].semver === t) {
      if (p.includePrerelease)
        return !0;
      d = u;
    }
    const g = /* @__PURE__ */ new Set();
    let w, m;
    for (const S of c)
      S.operator === ">" || S.operator === ">=" ? w = f(w, S, p) : S.operator === "<" || S.operator === "<=" ? m = l(m, S, p) : g.add(S.semver);
    if (g.size > 1)
      return null;
    let E;
    if (w && m) {
      if (E = i(w.semver, m.semver, p), E > 0)
        return null;
      if (E === 0 && (w.operator !== ">=" || m.operator !== "<="))
        return null;
    }
    for (const S of g) {
      if (w && !n(S, String(w), p) || m && !n(S, String(m), p))
        return null;
      for (const y of d)
        if (!n(S, String(y), p))
          return !1;
      return !0;
    }
    let C, N, O, R, I = m && !p.includePrerelease && m.semver.prerelease.length ? m.semver : !1, _ = w && !p.includePrerelease && w.semver.prerelease.length ? w.semver : !1;
    I && I.prerelease.length === 1 && m.operator === "<" && I.prerelease[0] === 0 && (I = !1);
    for (const S of d) {
      if (R = R || S.operator === ">" || S.operator === ">=", O = O || S.operator === "<" || S.operator === "<=", w) {
        if (_ && S.semver.prerelease && S.semver.prerelease.length && S.semver.major === _.major && S.semver.minor === _.minor && S.semver.patch === _.patch && (_ = !1), S.operator === ">" || S.operator === ">=") {
          if (C = f(w, S, p), C === S && C !== w)
            return !1;
        } else if (w.operator === ">=" && !n(w.semver, String(S), p))
          return !1;
      }
      if (m) {
        if (I && S.semver.prerelease && S.semver.prerelease.length && S.semver.major === I.major && S.semver.minor === I.minor && S.semver.patch === I.patch && (I = !1), S.operator === "<" || S.operator === "<=") {
          if (N = l(m, S, p), N === S && N !== m)
            return !1;
        } else if (m.operator === "<=" && !n(m.semver, String(S), p))
          return !1;
      }
      if (!S.operator && (m || w) && E !== 0)
        return !1;
    }
    return !(w && O && !m && E !== 0 || m && R && !w && E !== 0 || _ || I);
  }, f = (c, d, p) => {
    if (!c)
      return d;
    const g = i(c.semver, d.semver, p);
    return g > 0 ? c : g < 0 || d.operator === ">" && c.operator === ">=" ? d : c;
  }, l = (c, d, p) => {
    if (!c)
      return d;
    const g = i(c.semver, d.semver, p);
    return g < 0 ? c : g > 0 || d.operator === "<" && c.operator === "<=" ? d : c;
  };
  return Gs = s, Gs;
}
var zs, ou;
function qc() {
  if (ou) return zs;
  ou = 1;
  const r = an(), e = Mn(), t = ot(), n = Lc(), i = Cr(), s = Wd(), a = Yd(), u = Kd(), o = Jd(), f = Xd(), l = Zd(), c = eh(), d = th(), p = _t(), g = rh(), w = nh(), m = ya(), E = ih(), C = sh(), N = Hn(), O = wa(), R = xc(), I = Fc(), _ = va(), S = Ea(), y = Uc(), k = ah(), B = Qn(), F = Tt(), q = Gn(), D = lh(), L = uh(), Q = ch(), P = fh(), G = dh(), V = Sa(), ie = hh(), ye = ph(), oe = mh(), Ae = gh(), be = yh();
  return zs = {
    parse: i,
    valid: s,
    clean: a,
    inc: u,
    diff: o,
    major: f,
    minor: l,
    patch: c,
    prerelease: d,
    compare: p,
    rcompare: g,
    compareLoose: w,
    compareBuild: m,
    sort: E,
    rsort: C,
    gt: N,
    lt: O,
    eq: R,
    neq: I,
    gte: _,
    lte: S,
    cmp: y,
    coerce: k,
    Comparator: B,
    Range: F,
    satisfies: q,
    toComparators: D,
    maxSatisfying: L,
    minSatisfying: Q,
    minVersion: P,
    validRange: G,
    outside: V,
    gtr: ie,
    ltr: ye,
    intersects: oe,
    simplifyRange: Ae,
    subset: be,
    SemVer: t,
    re: r.re,
    src: r.src,
    tokens: r.t,
    SEMVER_SPEC_VERSION: e.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: e.RELEASE_TYPES,
    compareIdentifiers: n.compareIdentifiers,
    rcompareIdentifiers: n.rcompareIdentifiers
  }, zs;
}
var mr = {}, Xr = { exports: {} };
Xr.exports;
var lu;
function wh() {
  return lu || (lu = 1, (function(r, e) {
    var t = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, a = 9007199254740991, u = "[object Arguments]", o = "[object Array]", f = "[object AsyncFunction]", l = "[object Boolean]", c = "[object Date]", d = "[object Error]", p = "[object Function]", g = "[object GeneratorFunction]", w = "[object Map]", m = "[object Number]", E = "[object Null]", C = "[object Object]", N = "[object Promise]", O = "[object Proxy]", R = "[object RegExp]", I = "[object Set]", _ = "[object String]", S = "[object Symbol]", y = "[object Undefined]", k = "[object WeakMap]", B = "[object ArrayBuffer]", F = "[object DataView]", q = "[object Float32Array]", D = "[object Float64Array]", L = "[object Int8Array]", Q = "[object Int16Array]", P = "[object Int32Array]", G = "[object Uint8Array]", V = "[object Uint8ClampedArray]", ie = "[object Uint16Array]", ye = "[object Uint32Array]", oe = /[\\^$.*+?()[\]{}|]/g, Ae = /^\[object .+?Constructor\]$/, be = /^(?:0|[1-9]\d*)$/, ee = {};
    ee[q] = ee[D] = ee[L] = ee[Q] = ee[P] = ee[G] = ee[V] = ee[ie] = ee[ye] = !0, ee[u] = ee[o] = ee[B] = ee[l] = ee[F] = ee[c] = ee[d] = ee[p] = ee[w] = ee[m] = ee[C] = ee[R] = ee[I] = ee[_] = ee[k] = !1;
    var Se = typeof St == "object" && St && St.Object === Object && St, b = typeof self == "object" && self && self.Object === Object && self, v = Se || b || Function("return this")(), H = e && !e.nodeType && e, x = H && !0 && r && !r.nodeType && r, pe = x && x.exports === H, we = pe && Se.process, ve = (function() {
      try {
        return we && we.binding && we.binding("util");
      } catch {
      }
    })(), Ne = ve && ve.isTypedArray;
    function _e(A, U) {
      for (var X = -1, de = A == null ? 0 : A.length, qe = 0, Oe = []; ++X < de; ) {
        var je = A[X];
        U(je, X, A) && (Oe[qe++] = je);
      }
      return Oe;
    }
    function lt(A, U) {
      for (var X = -1, de = U.length, qe = A.length; ++X < de; )
        A[qe + X] = U[X];
      return A;
    }
    function De(A, U) {
      for (var X = -1, de = A == null ? 0 : A.length; ++X < de; )
        if (U(A[X], X, A))
          return !0;
      return !1;
    }
    function rt(A, U) {
      for (var X = -1, de = Array(A); ++X < A; )
        de[X] = U(X);
      return de;
    }
    function xt(A) {
      return function(U) {
        return A(U);
      };
    }
    function Ot(A, U) {
      return A.has(U);
    }
    function At(A, U) {
      return A?.[U];
    }
    function h(A) {
      var U = -1, X = Array(A.size);
      return A.forEach(function(de, qe) {
        X[++U] = [qe, de];
      }), X;
    }
    function j(A, U) {
      return function(X) {
        return A(U(X));
      };
    }
    function z(A) {
      var U = -1, X = Array(A.size);
      return A.forEach(function(de) {
        X[++U] = de;
      }), X;
    }
    var ae = Array.prototype, W = Function.prototype, se = Object.prototype, re = v["__core-js_shared__"], ue = W.toString, he = se.hasOwnProperty, Le = (function() {
      var A = /[^.]+$/.exec(re && re.keys && re.keys.IE_PROTO || "");
      return A ? "Symbol(src)_1." + A : "";
    })(), xe = se.toString, Ee = RegExp(
      "^" + ue.call(he).replace(oe, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), T = pe ? v.Buffer : void 0, M = v.Symbol, Y = v.Uint8Array, K = se.propertyIsEnumerable, J = ae.splice, le = M ? M.toStringTag : void 0, ne = Object.getOwnPropertySymbols, fe = T ? T.isBuffer : void 0, ge = j(Object.keys, Object), Te = dr(v, "DataView"), Ue = dr(v, "Map"), Me = dr(v, "Promise"), Fe = dr(v, "Set"), fr = dr(v, "WeakMap"), wt = dr(Object, "create"), Vt = Kt(Te), uf = Kt(Ue), cf = Kt(Me), ff = Kt(Fe), df = Kt(fr), Da = M ? M.prototype : void 0, Yn = Da ? Da.valueOf : void 0;
    function Wt(A) {
      var U = -1, X = A == null ? 0 : A.length;
      for (this.clear(); ++U < X; ) {
        var de = A[U];
        this.set(de[0], de[1]);
      }
    }
    function hf() {
      this.__data__ = wt ? wt(null) : {}, this.size = 0;
    }
    function pf(A) {
      var U = this.has(A) && delete this.__data__[A];
      return this.size -= U ? 1 : 0, U;
    }
    function mf(A) {
      var U = this.__data__;
      if (wt) {
        var X = U[A];
        return X === n ? void 0 : X;
      }
      return he.call(U, A) ? U[A] : void 0;
    }
    function gf(A) {
      var U = this.__data__;
      return wt ? U[A] !== void 0 : he.call(U, A);
    }
    function yf(A, U) {
      var X = this.__data__;
      return this.size += this.has(A) ? 0 : 1, X[A] = wt && U === void 0 ? n : U, this;
    }
    Wt.prototype.clear = hf, Wt.prototype.delete = pf, Wt.prototype.get = mf, Wt.prototype.has = gf, Wt.prototype.set = yf;
    function It(A) {
      var U = -1, X = A == null ? 0 : A.length;
      for (this.clear(); ++U < X; ) {
        var de = A[U];
        this.set(de[0], de[1]);
      }
    }
    function wf() {
      this.__data__ = [], this.size = 0;
    }
    function vf(A) {
      var U = this.__data__, X = un(U, A);
      if (X < 0)
        return !1;
      var de = U.length - 1;
      return X == de ? U.pop() : J.call(U, X, 1), --this.size, !0;
    }
    function Ef(A) {
      var U = this.__data__, X = un(U, A);
      return X < 0 ? void 0 : U[X][1];
    }
    function Sf(A) {
      return un(this.__data__, A) > -1;
    }
    function bf(A, U) {
      var X = this.__data__, de = un(X, A);
      return de < 0 ? (++this.size, X.push([A, U])) : X[de][1] = U, this;
    }
    It.prototype.clear = wf, It.prototype.delete = vf, It.prototype.get = Ef, It.prototype.has = Sf, It.prototype.set = bf;
    function Yt(A) {
      var U = -1, X = A == null ? 0 : A.length;
      for (this.clear(); ++U < X; ) {
        var de = A[U];
        this.set(de[0], de[1]);
      }
    }
    function _f() {
      this.size = 0, this.__data__ = {
        hash: new Wt(),
        map: new (Ue || It)(),
        string: new Wt()
      };
    }
    function Tf(A) {
      var U = cn(this, A).delete(A);
      return this.size -= U ? 1 : 0, U;
    }
    function Cf(A) {
      return cn(this, A).get(A);
    }
    function Af(A) {
      return cn(this, A).has(A);
    }
    function Rf(A, U) {
      var X = cn(this, A), de = X.size;
      return X.set(A, U), this.size += X.size == de ? 0 : 1, this;
    }
    Yt.prototype.clear = _f, Yt.prototype.delete = Tf, Yt.prototype.get = Cf, Yt.prototype.has = Af, Yt.prototype.set = Rf;
    function ln(A) {
      var U = -1, X = A == null ? 0 : A.length;
      for (this.__data__ = new Yt(); ++U < X; )
        this.add(A[U]);
    }
    function Nf(A) {
      return this.__data__.set(A, n), this;
    }
    function Of(A) {
      return this.__data__.has(A);
    }
    ln.prototype.add = ln.prototype.push = Nf, ln.prototype.has = Of;
    function Ft(A) {
      var U = this.__data__ = new It(A);
      this.size = U.size;
    }
    function If() {
      this.__data__ = new It(), this.size = 0;
    }
    function Pf(A) {
      var U = this.__data__, X = U.delete(A);
      return this.size = U.size, X;
    }
    function Df(A) {
      return this.__data__.get(A);
    }
    function Lf(A) {
      return this.__data__.has(A);
    }
    function xf(A, U) {
      var X = this.__data__;
      if (X instanceof It) {
        var de = X.__data__;
        if (!Ue || de.length < t - 1)
          return de.push([A, U]), this.size = ++X.size, this;
        X = this.__data__ = new Yt(de);
      }
      return X.set(A, U), this.size = X.size, this;
    }
    Ft.prototype.clear = If, Ft.prototype.delete = Pf, Ft.prototype.get = Df, Ft.prototype.has = Lf, Ft.prototype.set = xf;
    function Ff(A, U) {
      var X = fn(A), de = !X && Kf(A), qe = !X && !de && Kn(A), Oe = !X && !de && !qe && Ma(A), je = X || de || qe || Oe, Ve = je ? rt(A.length, String) : [], Ke = Ve.length;
      for (var $e in A)
        he.call(A, $e) && !(je && // Safari 9 has enumerable `arguments.length` in strict mode.
        ($e == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        qe && ($e == "offset" || $e == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        Oe && ($e == "buffer" || $e == "byteLength" || $e == "byteOffset") || // Skip index properties.
        Gf($e, Ke))) && Ve.push($e);
      return Ve;
    }
    function un(A, U) {
      for (var X = A.length; X--; )
        if (qa(A[X][0], U))
          return X;
      return -1;
    }
    function Uf(A, U, X) {
      var de = U(A);
      return fn(A) ? de : lt(de, X(A));
    }
    function Rr(A) {
      return A == null ? A === void 0 ? y : E : le && le in Object(A) ? Hf(A) : Yf(A);
    }
    function La(A) {
      return Nr(A) && Rr(A) == u;
    }
    function xa(A, U, X, de, qe) {
      return A === U ? !0 : A == null || U == null || !Nr(A) && !Nr(U) ? A !== A && U !== U : qf(A, U, X, de, xa, qe);
    }
    function qf(A, U, X, de, qe, Oe) {
      var je = fn(A), Ve = fn(U), Ke = je ? o : Ut(A), $e = Ve ? o : Ut(U);
      Ke = Ke == u ? C : Ke, $e = $e == u ? C : $e;
      var dt = Ke == C, vt = $e == C, Xe = Ke == $e;
      if (Xe && Kn(A)) {
        if (!Kn(U))
          return !1;
        je = !0, dt = !1;
      }
      if (Xe && !dt)
        return Oe || (Oe = new Ft()), je || Ma(A) ? Fa(A, U, X, de, qe, Oe) : Mf(A, U, Ke, X, de, qe, Oe);
      if (!(X & i)) {
        var gt = dt && he.call(A, "__wrapped__"), yt = vt && he.call(U, "__wrapped__");
        if (gt || yt) {
          var qt = gt ? A.value() : A, Pt = yt ? U.value() : U;
          return Oe || (Oe = new Ft()), qe(qt, Pt, X, de, Oe);
        }
      }
      return Xe ? (Oe || (Oe = new Ft()), jf(A, U, X, de, qe, Oe)) : !1;
    }
    function $f(A) {
      if (!Ba(A) || Vf(A))
        return !1;
      var U = $a(A) ? Ee : Ae;
      return U.test(Kt(A));
    }
    function kf(A) {
      return Nr(A) && ka(A.length) && !!ee[Rr(A)];
    }
    function Bf(A) {
      if (!Wf(A))
        return ge(A);
      var U = [];
      for (var X in Object(A))
        he.call(A, X) && X != "constructor" && U.push(X);
      return U;
    }
    function Fa(A, U, X, de, qe, Oe) {
      var je = X & i, Ve = A.length, Ke = U.length;
      if (Ve != Ke && !(je && Ke > Ve))
        return !1;
      var $e = Oe.get(A);
      if ($e && Oe.get(U))
        return $e == U;
      var dt = -1, vt = !0, Xe = X & s ? new ln() : void 0;
      for (Oe.set(A, U), Oe.set(U, A); ++dt < Ve; ) {
        var gt = A[dt], yt = U[dt];
        if (de)
          var qt = je ? de(yt, gt, dt, U, A, Oe) : de(gt, yt, dt, A, U, Oe);
        if (qt !== void 0) {
          if (qt)
            continue;
          vt = !1;
          break;
        }
        if (Xe) {
          if (!De(U, function(Pt, Jt) {
            if (!Ot(Xe, Jt) && (gt === Pt || qe(gt, Pt, X, de, Oe)))
              return Xe.push(Jt);
          })) {
            vt = !1;
            break;
          }
        } else if (!(gt === yt || qe(gt, yt, X, de, Oe))) {
          vt = !1;
          break;
        }
      }
      return Oe.delete(A), Oe.delete(U), vt;
    }
    function Mf(A, U, X, de, qe, Oe, je) {
      switch (X) {
        case F:
          if (A.byteLength != U.byteLength || A.byteOffset != U.byteOffset)
            return !1;
          A = A.buffer, U = U.buffer;
        case B:
          return !(A.byteLength != U.byteLength || !Oe(new Y(A), new Y(U)));
        case l:
        case c:
        case m:
          return qa(+A, +U);
        case d:
          return A.name == U.name && A.message == U.message;
        case R:
        case _:
          return A == U + "";
        case w:
          var Ve = h;
        case I:
          var Ke = de & i;
          if (Ve || (Ve = z), A.size != U.size && !Ke)
            return !1;
          var $e = je.get(A);
          if ($e)
            return $e == U;
          de |= s, je.set(A, U);
          var dt = Fa(Ve(A), Ve(U), de, qe, Oe, je);
          return je.delete(A), dt;
        case S:
          if (Yn)
            return Yn.call(A) == Yn.call(U);
      }
      return !1;
    }
    function jf(A, U, X, de, qe, Oe) {
      var je = X & i, Ve = Ua(A), Ke = Ve.length, $e = Ua(U), dt = $e.length;
      if (Ke != dt && !je)
        return !1;
      for (var vt = Ke; vt--; ) {
        var Xe = Ve[vt];
        if (!(je ? Xe in U : he.call(U, Xe)))
          return !1;
      }
      var gt = Oe.get(A);
      if (gt && Oe.get(U))
        return gt == U;
      var yt = !0;
      Oe.set(A, U), Oe.set(U, A);
      for (var qt = je; ++vt < Ke; ) {
        Xe = Ve[vt];
        var Pt = A[Xe], Jt = U[Xe];
        if (de)
          var ja = je ? de(Jt, Pt, Xe, U, A, Oe) : de(Pt, Jt, Xe, A, U, Oe);
        if (!(ja === void 0 ? Pt === Jt || qe(Pt, Jt, X, de, Oe) : ja)) {
          yt = !1;
          break;
        }
        qt || (qt = Xe == "constructor");
      }
      if (yt && !qt) {
        var dn = A.constructor, hn = U.constructor;
        dn != hn && "constructor" in A && "constructor" in U && !(typeof dn == "function" && dn instanceof dn && typeof hn == "function" && hn instanceof hn) && (yt = !1);
      }
      return Oe.delete(A), Oe.delete(U), yt;
    }
    function Ua(A) {
      return Uf(A, Zf, Qf);
    }
    function cn(A, U) {
      var X = A.__data__;
      return zf(U) ? X[typeof U == "string" ? "string" : "hash"] : X.map;
    }
    function dr(A, U) {
      var X = At(A, U);
      return $f(X) ? X : void 0;
    }
    function Hf(A) {
      var U = he.call(A, le), X = A[le];
      try {
        A[le] = void 0;
        var de = !0;
      } catch {
      }
      var qe = xe.call(A);
      return de && (U ? A[le] = X : delete A[le]), qe;
    }
    var Qf = ne ? function(A) {
      return A == null ? [] : (A = Object(A), _e(ne(A), function(U) {
        return K.call(A, U);
      }));
    } : ed, Ut = Rr;
    (Te && Ut(new Te(new ArrayBuffer(1))) != F || Ue && Ut(new Ue()) != w || Me && Ut(Me.resolve()) != N || Fe && Ut(new Fe()) != I || fr && Ut(new fr()) != k) && (Ut = function(A) {
      var U = Rr(A), X = U == C ? A.constructor : void 0, de = X ? Kt(X) : "";
      if (de)
        switch (de) {
          case Vt:
            return F;
          case uf:
            return w;
          case cf:
            return N;
          case ff:
            return I;
          case df:
            return k;
        }
      return U;
    });
    function Gf(A, U) {
      return U = U ?? a, !!U && (typeof A == "number" || be.test(A)) && A > -1 && A % 1 == 0 && A < U;
    }
    function zf(A) {
      var U = typeof A;
      return U == "string" || U == "number" || U == "symbol" || U == "boolean" ? A !== "__proto__" : A === null;
    }
    function Vf(A) {
      return !!Le && Le in A;
    }
    function Wf(A) {
      var U = A && A.constructor, X = typeof U == "function" && U.prototype || se;
      return A === X;
    }
    function Yf(A) {
      return xe.call(A);
    }
    function Kt(A) {
      if (A != null) {
        try {
          return ue.call(A);
        } catch {
        }
        try {
          return A + "";
        } catch {
        }
      }
      return "";
    }
    function qa(A, U) {
      return A === U || A !== A && U !== U;
    }
    var Kf = La(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? La : function(A) {
      return Nr(A) && he.call(A, "callee") && !K.call(A, "callee");
    }, fn = Array.isArray;
    function Jf(A) {
      return A != null && ka(A.length) && !$a(A);
    }
    var Kn = fe || td;
    function Xf(A, U) {
      return xa(A, U);
    }
    function $a(A) {
      if (!Ba(A))
        return !1;
      var U = Rr(A);
      return U == p || U == g || U == f || U == O;
    }
    function ka(A) {
      return typeof A == "number" && A > -1 && A % 1 == 0 && A <= a;
    }
    function Ba(A) {
      var U = typeof A;
      return A != null && (U == "object" || U == "function");
    }
    function Nr(A) {
      return A != null && typeof A == "object";
    }
    var Ma = Ne ? xt(Ne) : kf;
    function Zf(A) {
      return Jf(A) ? Ff(A) : Bf(A);
    }
    function ed() {
      return [];
    }
    function td() {
      return !1;
    }
    r.exports = Xf;
  })(Xr, Xr.exports)), Xr.exports;
}
var uu;
function vh() {
  if (uu) return mr;
  uu = 1, Object.defineProperty(mr, "__esModule", { value: !0 }), mr.DownloadedUpdateHelper = void 0, mr.createTempUpdateFile = u;
  const r = rn, e = bt, t = wh(), n = /* @__PURE__ */ zt(), i = Be;
  let s = class {
    constructor(f) {
      this.cacheDir = f, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
    }
    get downloadedFileInfo() {
      return this._downloadedFileInfo;
    }
    get file() {
      return this._file;
    }
    get packageFile() {
      return this._packageFile;
    }
    get cacheDirForPendingUpdate() {
      return i.join(this.cacheDir, "pending");
    }
    async validateDownloadedPath(f, l, c, d) {
      if (this.versionInfo != null && this.file === f && this.fileInfo != null)
        return t(this.versionInfo, l) && t(this.fileInfo.info, c.info) && await (0, n.pathExists)(f) ? f : null;
      const p = await this.getValidCachedUpdateFile(c, d);
      return p === null ? null : (d.info(`Update has already been downloaded to ${f}).`), this._file = p, p);
    }
    async setDownloadedFile(f, l, c, d, p, g) {
      this._file = f, this._packageFile = l, this.versionInfo = c, this.fileInfo = d, this._downloadedFileInfo = {
        fileName: p,
        sha512: d.info.sha512,
        isAdminRightsRequired: d.info.isAdminRightsRequired === !0
      }, g && await (0, n.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
    async clear() {
      this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
    }
    async cleanCacheDirForPendingUpdate() {
      try {
        await (0, n.emptyDir)(this.cacheDirForPendingUpdate);
      } catch {
      }
    }
    /**
     * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
     * @param fileInfo
     * @param logger
     */
    async getValidCachedUpdateFile(f, l) {
      const c = this.getUpdateInfoFile();
      if (!await (0, n.pathExists)(c))
        return null;
      let p;
      try {
        p = await (0, n.readJson)(c);
      } catch (E) {
        let C = "No cached update info available";
        return E.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), C += ` (error on read: ${E.message})`), l.info(C), null;
      }
      if (!(p?.fileName !== null))
        return l.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
      if (f.info.sha512 !== p.sha512)
        return l.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${p.sha512}, expected: ${f.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
      const w = i.join(this.cacheDirForPendingUpdate, p.fileName);
      if (!await (0, n.pathExists)(w))
        return l.info("Cached update file doesn't exist"), null;
      const m = await a(w);
      return f.info.sha512 !== m ? (l.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${m}, expected: ${f.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = p, w);
    }
    getUpdateInfoFile() {
      return i.join(this.cacheDirForPendingUpdate, "update-info.json");
    }
  };
  mr.DownloadedUpdateHelper = s;
  function a(o, f = "sha512", l = "base64", c) {
    return new Promise((d, p) => {
      const g = (0, r.createHash)(f);
      g.on("error", p).setEncoding(l), (0, e.createReadStream)(o, {
        ...c,
        highWaterMark: 1024 * 1024
        /* better to use more memory but hash faster */
      }).on("error", p).on("end", () => {
        g.end(), d(g.read());
      }).pipe(g, { end: !1 });
    });
  }
  async function u(o, f, l) {
    let c = 0, d = i.join(f, o);
    for (let p = 0; p < 3; p++)
      try {
        return await (0, n.unlink)(d), d;
      } catch (g) {
        if (g.code === "ENOENT")
          return d;
        l.warn(`Error on remove temp update file: ${g}`), d = i.join(f, `${c++}-${o}`);
      }
    return d;
  }
  return mr;
}
var Lr = {}, Cn = {}, cu;
function Eh() {
  if (cu) return Cn;
  cu = 1, Object.defineProperty(Cn, "__esModule", { value: !0 }), Cn.getAppCacheDir = t;
  const r = Be, e = $n;
  function t() {
    const n = (0, e.homedir)();
    let i;
    return process.platform === "win32" ? i = process.env.LOCALAPPDATA || r.join(n, "AppData", "Local") : process.platform === "darwin" ? i = r.join(n, "Library", "Caches") : i = process.env.XDG_CACHE_HOME || r.join(n, ".cache"), i;
  }
  return Cn;
}
var fu;
function Sh() {
  if (fu) return Lr;
  fu = 1, Object.defineProperty(Lr, "__esModule", { value: !0 }), Lr.ElectronAppAdapter = void 0;
  const r = Be, e = Eh();
  let t = class {
    constructor(i = nr.app) {
      this.app = i;
    }
    whenReady() {
      return this.app.whenReady();
    }
    get version() {
      return this.app.getVersion();
    }
    get name() {
      return this.app.getName();
    }
    get isPackaged() {
      return this.app.isPackaged === !0;
    }
    get appUpdateConfigPath() {
      return this.isPackaged ? r.join(process.resourcesPath, "app-update.yml") : r.join(this.app.getAppPath(), "dev-app-update.yml");
    }
    get userDataPath() {
      return this.app.getPath("userData");
    }
    get baseCachePath() {
      return (0, e.getAppCacheDir)();
    }
    quit() {
      this.app.quit();
    }
    relaunch() {
      this.app.relaunch();
    }
    onQuit(i) {
      this.app.once("quit", (s, a) => i(a));
    }
  };
  return Lr.ElectronAppAdapter = t, Lr;
}
var Vs = {}, du;
function bh() {
  return du || (du = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.ElectronHttpExecutor = r.NET_SESSION_NAME = void 0, r.getNetSession = t;
    const e = Ye();
    r.NET_SESSION_NAME = "electron-updater";
    function t() {
      return nr.session.fromPartition(r.NET_SESSION_NAME, {
        cache: !1
      });
    }
    class n extends e.HttpExecutor {
      constructor(s) {
        super(), this.proxyLoginCallback = s, this.cachedSession = null;
      }
      async download(s, a, u) {
        return await u.cancellationToken.createPromise((o, f, l) => {
          const c = {
            headers: u.headers || void 0,
            redirect: "manual"
          };
          (0, e.configureRequestUrl)(s, c), (0, e.configureRequestOptions)(c), this.doDownload(c, {
            destination: a,
            options: u,
            onCancel: l,
            callback: (d) => {
              d == null ? o(a) : f(d);
            },
            responseHandler: null
          }, 0);
        });
      }
      createRequest(s, a) {
        s.headers && s.headers.Host && (s.host = s.headers.Host, delete s.headers.Host), this.cachedSession == null && (this.cachedSession = t());
        const u = nr.net.request({
          ...s,
          session: this.cachedSession
        });
        return u.on("response", a), this.proxyLoginCallback != null && u.on("login", this.proxyLoginCallback), u;
      }
      addRedirectHandlers(s, a, u, o, f) {
        s.on("redirect", (l, c, d) => {
          s.abort(), o > this.maxRedirects ? u(this.createMaxRedirectError()) : f(e.HttpExecutor.prepareRedirectUrlOptions(d, a));
        });
      }
    }
    r.ElectronHttpExecutor = n;
  })(Vs)), Vs;
}
var xr = {}, gr = {}, hu;
function or() {
  if (hu) return gr;
  hu = 1, Object.defineProperty(gr, "__esModule", { value: !0 }), gr.newBaseUrl = e, gr.newUrlFromBase = t, gr.getChannelFilename = n;
  const r = Gt;
  function e(i) {
    const s = new r.URL(i);
    return s.pathname.endsWith("/") || (s.pathname += "/"), s;
  }
  function t(i, s, a = !1) {
    const u = new r.URL(i, s), o = s.search;
    return o != null && o.length !== 0 ? u.search = o : a && (u.search = `noCache=${Date.now().toString(32)}`), u;
  }
  function n(i) {
    return `${i}.yml`;
  }
  return gr;
}
var Dt = {}, Ws, pu;
function $c() {
  if (pu) return Ws;
  pu = 1;
  var r = "[object Symbol]", e = /[\\^$.*+?()[\]{}|]/g, t = RegExp(e.source), n = typeof St == "object" && St && St.Object === Object && St, i = typeof self == "object" && self && self.Object === Object && self, s = n || i || Function("return this")(), a = Object.prototype, u = a.toString, o = s.Symbol, f = o ? o.prototype : void 0, l = f ? f.toString : void 0;
  function c(m) {
    if (typeof m == "string")
      return m;
    if (p(m))
      return l ? l.call(m) : "";
    var E = m + "";
    return E == "0" && 1 / m == -1 / 0 ? "-0" : E;
  }
  function d(m) {
    return !!m && typeof m == "object";
  }
  function p(m) {
    return typeof m == "symbol" || d(m) && u.call(m) == r;
  }
  function g(m) {
    return m == null ? "" : c(m);
  }
  function w(m) {
    return m = g(m), m && t.test(m) ? m.replace(e, "\\$&") : m;
  }
  return Ws = w, Ws;
}
var mu;
function mt() {
  if (mu) return Dt;
  mu = 1, Object.defineProperty(Dt, "__esModule", { value: !0 }), Dt.Provider = void 0, Dt.findFile = a, Dt.parseUpdateInfo = u, Dt.getFileList = o, Dt.resolveFiles = f;
  const r = Ye(), e = ma(), t = Gt, n = or(), i = $c();
  let s = class {
    constructor(c) {
      this.runtimeOptions = c, this.requestHeaders = null, this.executor = c.executor;
    }
    // By default, the blockmap file is in the same directory as the main file
    // But some providers may have a different blockmap file, so we need to override this method
    getBlockMapFiles(c, d, p, g = null) {
      const w = (0, n.newUrlFromBase)(`${c.pathname}.blockmap`, c);
      return [(0, n.newUrlFromBase)(`${c.pathname.replace(new RegExp(i(p), "g"), d)}.blockmap`, g ? new t.URL(g) : c), w];
    }
    get isUseMultipleRangeRequest() {
      return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
    }
    getChannelFilePrefix() {
      if (this.runtimeOptions.platform === "linux") {
        const c = process.env.TEST_UPDATER_ARCH || process.arch;
        return "-linux" + (c === "x64" ? "" : `-${c}`);
      } else
        return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
    }
    // due to historical reasons for windows we use channel name without platform specifier
    getDefaultChannelName() {
      return this.getCustomChannelName("latest");
    }
    getCustomChannelName(c) {
      return `${c}${this.getChannelFilePrefix()}`;
    }
    get fileExtraDownloadHeaders() {
      return null;
    }
    setRequestHeaders(c) {
      this.requestHeaders = c;
    }
    /**
     * Method to perform API request only to resolve update info, but not to download update.
     */
    httpRequest(c, d, p) {
      return this.executor.request(this.createRequestOptions(c, d), p);
    }
    createRequestOptions(c, d) {
      const p = {};
      return this.requestHeaders == null ? d != null && (p.headers = d) : p.headers = d == null ? this.requestHeaders : { ...this.requestHeaders, ...d }, (0, r.configureRequestUrl)(c, p), p;
    }
  };
  Dt.Provider = s;
  function a(l, c, d) {
    var p;
    if (l.length === 0)
      throw (0, r.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
    const g = l.filter((m) => m.url.pathname.toLowerCase().endsWith(`.${c.toLowerCase()}`)), w = (p = g.find((m) => [m.url.pathname, m.info.url].some((E) => E.includes(process.arch)))) !== null && p !== void 0 ? p : g.shift();
    return w || (d == null ? l[0] : l.find((m) => !d.some((E) => m.url.pathname.toLowerCase().endsWith(`.${E.toLowerCase()}`))));
  }
  function u(l, c, d) {
    if (l == null)
      throw (0, r.newError)(`Cannot parse update info from ${c} in the latest release artifacts (${d}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    let p;
    try {
      p = (0, e.load)(l);
    } catch (g) {
      throw (0, r.newError)(`Cannot parse update info from ${c} in the latest release artifacts (${d}): ${g.stack || g.message}, rawData: ${l}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    }
    return p;
  }
  function o(l) {
    const c = l.files;
    if (c != null && c.length > 0)
      return c;
    if (l.path != null)
      return [
        {
          url: l.path,
          sha2: l.sha2,
          sha512: l.sha512
        }
      ];
    throw (0, r.newError)(`No files provided: ${(0, r.safeStringifyJson)(l)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
  }
  function f(l, c, d = (p) => p) {
    const g = o(l).map((E) => {
      if (E.sha2 == null && E.sha512 == null)
        throw (0, r.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, r.safeStringifyJson)(E)}`, "ERR_UPDATER_NO_CHECKSUM");
      return {
        url: (0, n.newUrlFromBase)(d(E.url), c),
        info: E
      };
    }), w = l.packages, m = w == null ? null : w[process.arch] || w.ia32;
    return m != null && (g[0].packageInfo = {
      ...m,
      path: (0, n.newUrlFromBase)(d(m.path), c).href
    }), g;
  }
  return Dt;
}
var gu;
function kc() {
  if (gu) return xr;
  gu = 1, Object.defineProperty(xr, "__esModule", { value: !0 }), xr.GenericProvider = void 0;
  const r = Ye(), e = or(), t = mt();
  let n = class extends t.Provider {
    constructor(s, a, u) {
      super(u), this.configuration = s, this.updater = a, this.baseUrl = (0, e.newBaseUrl)(this.configuration.url);
    }
    get channel() {
      const s = this.updater.channel || this.configuration.channel;
      return s == null ? this.getDefaultChannelName() : this.getCustomChannelName(s);
    }
    async getLatestVersion() {
      const s = (0, e.getChannelFilename)(this.channel), a = (0, e.newUrlFromBase)(s, this.baseUrl, this.updater.isAddNoCacheQuery);
      for (let u = 0; ; u++)
        try {
          return (0, t.parseUpdateInfo)(await this.httpRequest(a), s, a);
        } catch (o) {
          if (o instanceof r.HttpError && o.statusCode === 404)
            throw (0, r.newError)(`Cannot find channel "${s}" update info: ${o.stack || o.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          if (o.code === "ECONNREFUSED" && u < 3) {
            await new Promise((f, l) => {
              try {
                setTimeout(f, 1e3 * u);
              } catch (c) {
                l(c);
              }
            });
            continue;
          }
          throw o;
        }
    }
    resolveFiles(s) {
      return (0, t.resolveFiles)(s, this.baseUrl);
    }
  };
  return xr.GenericProvider = n, xr;
}
var Fr = {}, Ur = {}, yu;
function _h() {
  if (yu) return Ur;
  yu = 1, Object.defineProperty(Ur, "__esModule", { value: !0 }), Ur.BitbucketProvider = void 0;
  const r = Ye(), e = or(), t = mt();
  let n = class extends t.Provider {
    constructor(s, a, u) {
      super({
        ...u,
        isUseMultipleRangeRequest: !1
      }), this.configuration = s, this.updater = a;
      const { owner: o, slug: f } = s;
      this.baseUrl = (0, e.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${o}/${f}/downloads`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "latest";
    }
    async getLatestVersion() {
      const s = new r.CancellationToken(), a = (0, e.getChannelFilename)(this.getCustomChannelName(this.channel)), u = (0, e.newUrlFromBase)(a, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const o = await this.httpRequest(u, void 0, s);
        return (0, t.parseUpdateInfo)(o, a, u);
      } catch (o) {
        throw (0, r.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(s) {
      return (0, t.resolveFiles)(s, this.baseUrl);
    }
    toString() {
      const { owner: s, slug: a } = this.configuration;
      return `Bitbucket (owner: ${s}, slug: ${a}, channel: ${this.channel})`;
    }
  };
  return Ur.BitbucketProvider = n, Ur;
}
var kt = {}, wu;
function Bc() {
  if (wu) return kt;
  wu = 1, Object.defineProperty(kt, "__esModule", { value: !0 }), kt.GitHubProvider = kt.BaseGitHubProvider = void 0, kt.computeReleaseNotes = f;
  const r = Ye(), e = qc(), t = Gt, n = or(), i = mt(), s = /\/tag\/([^/]+)$/;
  class a extends i.Provider {
    constructor(c, d, p) {
      super({
        ...p,
        /* because GitHib uses S3 */
        isUseMultipleRangeRequest: !1
      }), this.options = c, this.baseUrl = (0, n.newBaseUrl)((0, r.githubUrl)(c, d));
      const g = d === "github.com" ? "api.github.com" : d;
      this.baseApiUrl = (0, n.newBaseUrl)((0, r.githubUrl)(c, g));
    }
    computeGithubBasePath(c) {
      const d = this.options.host;
      return d && !["github.com", "api.github.com"].includes(d) ? `/api/v3${c}` : c;
    }
  }
  kt.BaseGitHubProvider = a;
  let u = class extends a {
    constructor(c, d, p) {
      super(c, "github.com", p), this.options = c, this.updater = d;
    }
    get channel() {
      const c = this.updater.channel || this.options.channel;
      return c == null ? this.getDefaultChannelName() : this.getCustomChannelName(c);
    }
    async getLatestVersion() {
      var c, d, p, g, w;
      const m = new r.CancellationToken(), E = await this.httpRequest((0, n.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
        accept: "application/xml, application/atom+xml, text/xml, */*"
      }, m), C = (0, r.parseXml)(E);
      let N = C.element("entry", !1, "No published versions on GitHub"), O = null;
      try {
        if (this.updater.allowPrerelease) {
          const k = ((c = this.updater) === null || c === void 0 ? void 0 : c.channel) || ((d = e.prerelease(this.updater.currentVersion)) === null || d === void 0 ? void 0 : d[0]) || null;
          if (k === null)
            O = s.exec(N.element("link").attribute("href"))[1];
          else
            for (const B of C.getElements("entry")) {
              const F = s.exec(B.element("link").attribute("href"));
              if (F === null)
                continue;
              const q = F[1], D = ((p = e.prerelease(q)) === null || p === void 0 ? void 0 : p[0]) || null, L = !k || ["alpha", "beta"].includes(k), Q = D !== null && !["alpha", "beta"].includes(String(D));
              if (L && !Q && !(k === "beta" && D === "alpha")) {
                O = q;
                break;
              }
              if (D && D === k) {
                O = q;
                break;
              }
            }
        } else {
          O = await this.getLatestTagName(m);
          for (const k of C.getElements("entry"))
            if (s.exec(k.element("link").attribute("href"))[1] === O) {
              N = k;
              break;
            }
        }
      } catch (k) {
        throw (0, r.newError)(`Cannot parse releases feed: ${k.stack || k.message},
XML:
${E}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
      }
      if (O == null)
        throw (0, r.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let R, I = "", _ = "";
      const S = async (k) => {
        I = (0, n.getChannelFilename)(k), _ = (0, n.newUrlFromBase)(this.getBaseDownloadPath(String(O), I), this.baseUrl);
        const B = this.createRequestOptions(_);
        try {
          return await this.executor.request(B, m);
        } catch (F) {
          throw F instanceof r.HttpError && F.statusCode === 404 ? (0, r.newError)(`Cannot find ${I} in the latest release artifacts (${_}): ${F.stack || F.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : F;
        }
      };
      try {
        let k = this.channel;
        this.updater.allowPrerelease && (!((g = e.prerelease(O)) === null || g === void 0) && g[0]) && (k = this.getCustomChannelName(String((w = e.prerelease(O)) === null || w === void 0 ? void 0 : w[0]))), R = await S(k);
      } catch (k) {
        if (this.updater.allowPrerelease)
          R = await S(this.getDefaultChannelName());
        else
          throw k;
      }
      const y = (0, i.parseUpdateInfo)(R, I, _);
      return y.releaseName == null && (y.releaseName = N.elementValueOrEmpty("title")), y.releaseNotes == null && (y.releaseNotes = f(this.updater.currentVersion, this.updater.fullChangelog, C, N)), {
        tag: O,
        ...y
      };
    }
    async getLatestTagName(c) {
      const d = this.options, p = d.host == null || d.host === "github.com" ? (0, n.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new t.URL(`${this.computeGithubBasePath(`/repos/${d.owner}/${d.repo}/releases`)}/latest`, this.baseApiUrl);
      try {
        const g = await this.httpRequest(p, { Accept: "application/json" }, c);
        return g == null ? null : JSON.parse(g).tag_name;
      } catch (g) {
        throw (0, r.newError)(`Unable to find latest version on GitHub (${p}), please ensure a production release exists: ${g.stack || g.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return `/${this.options.owner}/${this.options.repo}/releases`;
    }
    resolveFiles(c) {
      return (0, i.resolveFiles)(c, this.baseUrl, (d) => this.getBaseDownloadPath(c.tag, d.replace(/ /g, "-")));
    }
    getBaseDownloadPath(c, d) {
      return `${this.basePath}/download/${c}/${d}`;
    }
  };
  kt.GitHubProvider = u;
  function o(l) {
    const c = l.elementValueOrEmpty("content");
    return c === "No content." ? "" : c;
  }
  function f(l, c, d, p) {
    if (!c)
      return o(p);
    const g = [];
    for (const w of d.getElements("entry")) {
      const m = /\/tag\/v?([^/]+)$/.exec(w.element("link").attribute("href"))[1];
      e.lt(l, m) && g.push({
        version: m,
        note: o(w)
      });
    }
    return g.sort((w, m) => e.rcompare(w.version, m.version));
  }
  return kt;
}
var qr = {}, vu;
function Th() {
  if (vu) return qr;
  vu = 1, Object.defineProperty(qr, "__esModule", { value: !0 }), qr.GitLabProvider = void 0;
  const r = Ye(), e = Gt, t = $c(), n = or(), i = mt();
  let s = class extends i.Provider {
    /**
     * Normalizes filenames by replacing spaces and underscores with dashes.
     *
     * This is a workaround to handle filename formatting differences between tools:
     * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
     * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
     *
     * Because of this mismatch, we can't reliably extract the correct filename from
     * the asset path without normalization. This function ensures consistent matching
     * across different filename formats by converting all spaces and underscores to dashes.
     *
     * @param filename The filename to normalize
     * @returns The normalized filename with spaces and underscores replaced by dashes
     */
    normalizeFilename(u) {
      return u.replace(/ |_/g, "-");
    }
    constructor(u, o, f) {
      super({
        ...f,
        // GitLab might not support multiple range requests efficiently
        isUseMultipleRangeRequest: !1
      }), this.options = u, this.updater = o, this.cachedLatestVersion = null;
      const c = u.host || "gitlab.com";
      this.baseApiUrl = (0, n.newBaseUrl)(`https://${c}/api/v4`);
    }
    get channel() {
      const u = this.updater.channel || this.options.channel;
      return u == null ? this.getDefaultChannelName() : this.getCustomChannelName(u);
    }
    async getLatestVersion() {
      const u = new r.CancellationToken(), o = (0, n.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
      let f;
      try {
        const C = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, N = await this.httpRequest(o, C, u);
        if (!N)
          throw (0, r.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
        f = JSON.parse(N);
      } catch (C) {
        throw (0, r.newError)(`Unable to find latest release on GitLab (${o}): ${C.stack || C.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
      const l = f.tag_name;
      let c = null, d = "", p = null;
      const g = async (C) => {
        d = (0, n.getChannelFilename)(C);
        const N = f.assets.links.find((R) => R.name === d);
        if (!N)
          throw (0, r.newError)(`Cannot find ${d} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        p = new e.URL(N.direct_asset_url);
        const O = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
        try {
          const R = await this.httpRequest(p, O, u);
          if (!R)
            throw (0, r.newError)(`Empty response from ${p}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          return R;
        } catch (R) {
          throw R instanceof r.HttpError && R.statusCode === 404 ? (0, r.newError)(`Cannot find ${d} in the latest release artifacts (${p}): ${R.stack || R.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : R;
        }
      };
      try {
        c = await g(this.channel);
      } catch (C) {
        if (this.channel !== this.getDefaultChannelName())
          c = await g(this.getDefaultChannelName());
        else
          throw C;
      }
      if (!c)
        throw (0, r.newError)(`Unable to parse channel data from ${d}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
      const w = (0, i.parseUpdateInfo)(c, d, p);
      w.releaseName == null && (w.releaseName = f.name), w.releaseNotes == null && (w.releaseNotes = f.description || null);
      const m = /* @__PURE__ */ new Map();
      for (const C of f.assets.links)
        m.set(this.normalizeFilename(C.name), C.direct_asset_url);
      const E = {
        tag: l,
        assets: m,
        ...w
      };
      return this.cachedLatestVersion = E, E;
    }
    /**
     * Utility function to convert GitlabReleaseAsset to Map<string, string>
     * Maps asset names to their download URLs
     */
    convertAssetsToMap(u) {
      const o = /* @__PURE__ */ new Map();
      for (const f of u.links)
        o.set(this.normalizeFilename(f.name), f.direct_asset_url);
      return o;
    }
    /**
     * Find blockmap file URL in assets map for a specific filename
     */
    findBlockMapInAssets(u, o) {
      const f = [`${o}.blockmap`, `${this.normalizeFilename(o)}.blockmap`];
      for (const l of f) {
        const c = u.get(l);
        if (c)
          return new e.URL(c);
      }
      return null;
    }
    async fetchReleaseInfoByVersion(u) {
      const o = new r.CancellationToken(), f = [`v${u}`, u];
      for (const l of f) {
        const c = (0, n.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(l)}`, this.baseApiUrl);
        try {
          const d = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, p = await this.httpRequest(c, d, o);
          if (p)
            return JSON.parse(p);
        } catch (d) {
          if (d instanceof r.HttpError && d.statusCode === 404)
            continue;
          throw (0, r.newError)(`Unable to find release ${l} on GitLab (${c}): ${d.stack || d.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
        }
      }
      throw (0, r.newError)(`Unable to find release with version ${u} (tried: ${f.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
    }
    setAuthHeaderForToken(u) {
      const o = {};
      return u != null && (u.startsWith("Bearer") ? o.authorization = u : o["PRIVATE-TOKEN"] = u), o;
    }
    /**
     * Get version info for blockmap files, using cache when possible
     */
    async getVersionInfoForBlockMap(u) {
      if (this.cachedLatestVersion && this.cachedLatestVersion.version === u)
        return this.cachedLatestVersion.assets;
      const o = await this.fetchReleaseInfoByVersion(u);
      return o && o.assets ? this.convertAssetsToMap(o.assets) : null;
    }
    /**
     * Find blockmap URLs from version assets
     */
    async findBlockMapUrlsFromAssets(u, o, f) {
      let l = null, c = null;
      const d = await this.getVersionInfoForBlockMap(o);
      d && (l = this.findBlockMapInAssets(d, f));
      const p = await this.getVersionInfoForBlockMap(u);
      if (p) {
        const g = f.replace(new RegExp(t(o), "g"), u);
        c = this.findBlockMapInAssets(p, g);
      }
      return [c, l];
    }
    async getBlockMapFiles(u, o, f, l = null) {
      if (this.options.uploadTarget === "project_upload") {
        const c = u.pathname.split("/").pop() || "", [d, p] = await this.findBlockMapUrlsFromAssets(o, f, c);
        if (!p)
          throw (0, r.newError)(`Cannot find blockmap file for ${f} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        if (!d)
          throw (0, r.newError)(`Cannot find blockmap file for ${o} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        return [d, p];
      } else
        return super.getBlockMapFiles(u, o, f, l);
    }
    resolveFiles(u) {
      return (0, i.getFileList)(u).map((o) => {
        const l = [
          o.url,
          // Original filename
          this.normalizeFilename(o.url)
          // Normalized filename (spaces/underscores → dashes)
        ].find((d) => u.assets.has(d)), c = l ? u.assets.get(l) : void 0;
        if (!c)
          throw (0, r.newError)(`Cannot find asset "${o.url}" in GitLab release assets. Available assets: ${Array.from(u.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new e.URL(c),
          info: o
        };
      });
    }
    toString() {
      return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
    }
  };
  return qr.GitLabProvider = s, qr;
}
var $r = {}, Eu;
function Ch() {
  if (Eu) return $r;
  Eu = 1, Object.defineProperty($r, "__esModule", { value: !0 }), $r.KeygenProvider = void 0;
  const r = Ye(), e = or(), t = mt();
  let n = class extends t.Provider {
    constructor(s, a, u) {
      super({
        ...u,
        isUseMultipleRangeRequest: !1
      }), this.configuration = s, this.updater = a, this.defaultHostname = "api.keygen.sh";
      const o = this.configuration.host || this.defaultHostname;
      this.baseUrl = (0, e.newBaseUrl)(`https://${o}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "stable";
    }
    async getLatestVersion() {
      const s = new r.CancellationToken(), a = (0, e.getChannelFilename)(this.getCustomChannelName(this.channel)), u = (0, e.newUrlFromBase)(a, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const o = await this.httpRequest(u, {
          Accept: "application/vnd.api+json",
          "Keygen-Version": "1.1"
        }, s);
        return (0, t.parseUpdateInfo)(o, a, u);
      } catch (o) {
        throw (0, r.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(s) {
      return (0, t.resolveFiles)(s, this.baseUrl);
    }
    toString() {
      const { account: s, product: a, platform: u } = this.configuration;
      return `Keygen (account: ${s}, product: ${a}, platform: ${u}, channel: ${this.channel})`;
    }
  };
  return $r.KeygenProvider = n, $r;
}
var kr = {}, Su;
function Ah() {
  if (Su) return kr;
  Su = 1, Object.defineProperty(kr, "__esModule", { value: !0 }), kr.PrivateGitHubProvider = void 0;
  const r = Ye(), e = ma(), t = Be, n = Gt, i = or(), s = Bc(), a = mt();
  let u = class extends s.BaseGitHubProvider {
    constructor(f, l, c, d) {
      super(f, "api.github.com", d), this.updater = l, this.token = c;
    }
    createRequestOptions(f, l) {
      const c = super.createRequestOptions(f, l);
      return c.redirect = "manual", c;
    }
    async getLatestVersion() {
      const f = new r.CancellationToken(), l = (0, i.getChannelFilename)(this.getDefaultChannelName()), c = await this.getLatestVersionInfo(f), d = c.assets.find((w) => w.name === l);
      if (d == null)
        throw (0, r.newError)(`Cannot find ${l} in the release ${c.html_url || c.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      const p = new n.URL(d.url);
      let g;
      try {
        g = (0, e.load)(await this.httpRequest(p, this.configureHeaders("application/octet-stream"), f));
      } catch (w) {
        throw w instanceof r.HttpError && w.statusCode === 404 ? (0, r.newError)(`Cannot find ${l} in the latest release artifacts (${p}): ${w.stack || w.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : w;
      }
      return g.assets = c.assets, g;
    }
    get fileExtraDownloadHeaders() {
      return this.configureHeaders("application/octet-stream");
    }
    configureHeaders(f) {
      return {
        accept: f,
        authorization: `token ${this.token}`
      };
    }
    async getLatestVersionInfo(f) {
      const l = this.updater.allowPrerelease;
      let c = this.basePath;
      l || (c = `${c}/latest`);
      const d = (0, i.newUrlFromBase)(c, this.baseUrl);
      try {
        const p = JSON.parse(await this.httpRequest(d, this.configureHeaders("application/vnd.github.v3+json"), f));
        return l ? p.find((g) => g.prerelease) || p[0] : p;
      } catch (p) {
        throw (0, r.newError)(`Unable to find latest version on GitHub (${d}), please ensure a production release exists: ${p.stack || p.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
    }
    resolveFiles(f) {
      return (0, a.getFileList)(f).map((l) => {
        const c = t.posix.basename(l.url).replace(/ /g, "-"), d = f.assets.find((p) => p != null && p.name === c);
        if (d == null)
          throw (0, r.newError)(`Cannot find asset "${c}" in: ${JSON.stringify(f.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new n.URL(d.url),
          info: l
        };
      });
    }
  };
  return kr.PrivateGitHubProvider = u, kr;
}
var bu;
function Rh() {
  if (bu) return Fr;
  bu = 1, Object.defineProperty(Fr, "__esModule", { value: !0 }), Fr.isUrlProbablySupportMultiRangeRequests = u, Fr.createClient = o;
  const r = Ye(), e = _h(), t = kc(), n = Bc(), i = Th(), s = Ch(), a = Ah();
  function u(f) {
    return !f.includes("s3.amazonaws.com");
  }
  function o(f, l, c) {
    if (typeof f == "string")
      throw (0, r.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
    const d = f.provider;
    switch (d) {
      case "github": {
        const p = f, g = (p.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || p.token;
        return g == null ? new n.GitHubProvider(p, l, c) : new a.PrivateGitHubProvider(p, l, g, c);
      }
      case "bitbucket":
        return new e.BitbucketProvider(f, l, c);
      case "gitlab":
        return new i.GitLabProvider(f, l, c);
      case "keygen":
        return new s.KeygenProvider(f, l, c);
      case "s3":
      case "spaces":
        return new t.GenericProvider({
          provider: "generic",
          url: (0, r.getS3LikeProviderBaseUrl)(f),
          channel: f.channel || null
        }, l, {
          ...c,
          // https://github.com/minio/minio/issues/5285#issuecomment-350428955
          isUseMultipleRangeRequest: !1
        });
      case "generic": {
        const p = f;
        return new t.GenericProvider(p, l, {
          ...c,
          isUseMultipleRangeRequest: p.useMultipleRangeRequest !== !1 && u(p.url)
        });
      }
      case "custom": {
        const p = f, g = p.updateProvider;
        if (!g)
          throw (0, r.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
        return new g(p, l, c);
      }
      default:
        throw (0, r.newError)(`Unsupported provider: ${d}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
    }
  }
  return Fr;
}
var Br = {}, Mr = {}, yr = {}, wr = {}, _u;
function ba() {
  if (_u) return wr;
  _u = 1, Object.defineProperty(wr, "__esModule", { value: !0 }), wr.OperationKind = void 0, wr.computeOperations = e;
  var r;
  (function(a) {
    a[a.COPY = 0] = "COPY", a[a.DOWNLOAD = 1] = "DOWNLOAD";
  })(r || (wr.OperationKind = r = {}));
  function e(a, u, o) {
    const f = s(a.files), l = s(u.files);
    let c = null;
    const d = u.files[0], p = [], g = d.name, w = f.get(g);
    if (w == null)
      throw new Error(`no file ${g} in old blockmap`);
    const m = l.get(g);
    let E = 0;
    const { checksumToOffset: C, checksumToOldSize: N } = i(f.get(g), w.offset, o);
    let O = d.offset;
    for (let R = 0; R < m.checksums.length; O += m.sizes[R], R++) {
      const I = m.sizes[R], _ = m.checksums[R];
      let S = C.get(_);
      S != null && N.get(_) !== I && (o.warn(`Checksum ("${_}") matches, but size differs (old: ${N.get(_)}, new: ${I})`), S = void 0), S === void 0 ? (E++, c != null && c.kind === r.DOWNLOAD && c.end === O ? c.end += I : (c = {
        kind: r.DOWNLOAD,
        start: O,
        end: O + I
        // oldBlocks: null,
      }, n(c, p, _, R))) : c != null && c.kind === r.COPY && c.end === S ? c.end += I : (c = {
        kind: r.COPY,
        start: S,
        end: S + I
        // oldBlocks: [checksum]
      }, n(c, p, _, R));
    }
    return E > 0 && o.info(`File${d.name === "file" ? "" : " " + d.name} has ${E} changed blocks`), p;
  }
  const t = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
  function n(a, u, o, f) {
    if (t && u.length !== 0) {
      const l = u[u.length - 1];
      if (l.kind === a.kind && a.start < l.end && a.start > l.start) {
        const c = [l.start, l.end, a.start, a.end].reduce((d, p) => d < p ? d : p);
        throw new Error(`operation (block index: ${f}, checksum: ${o}, kind: ${r[a.kind]}) overlaps previous operation (checksum: ${o}):
abs: ${l.start} until ${l.end} and ${a.start} until ${a.end}
rel: ${l.start - c} until ${l.end - c} and ${a.start - c} until ${a.end - c}`);
      }
    }
    u.push(a);
  }
  function i(a, u, o) {
    const f = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
    let c = u;
    for (let d = 0; d < a.checksums.length; d++) {
      const p = a.checksums[d], g = a.sizes[d], w = l.get(p);
      if (w === void 0)
        f.set(p, c), l.set(p, g);
      else if (o.debug != null) {
        const m = w === g ? "(same size)" : `(size: ${w}, this size: ${g})`;
        o.debug(`${p} duplicated in blockmap ${m}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
      }
      c += g;
    }
    return { checksumToOffset: f, checksumToOldSize: l };
  }
  function s(a) {
    const u = /* @__PURE__ */ new Map();
    for (const o of a)
      u.set(o.name, o);
    return u;
  }
  return wr;
}
var Tu;
function Mc() {
  if (Tu) return yr;
  Tu = 1, Object.defineProperty(yr, "__esModule", { value: !0 }), yr.DataSplitter = void 0, yr.copyData = a;
  const r = Ye(), e = bt, t = tn, n = ba(), i = Buffer.from(`\r
\r
`);
  var s;
  (function(o) {
    o[o.INIT = 0] = "INIT", o[o.HEADER = 1] = "HEADER", o[o.BODY = 2] = "BODY";
  })(s || (s = {}));
  function a(o, f, l, c, d) {
    const p = (0, e.createReadStream)("", {
      fd: l,
      autoClose: !1,
      start: o.start,
      // end is inclusive
      end: o.end - 1
    });
    p.on("error", c), p.once("end", d), p.pipe(f, {
      end: !1
    });
  }
  let u = class extends t.Writable {
    constructor(f, l, c, d, p, g) {
      super(), this.out = f, this.options = l, this.partIndexToTaskIndex = c, this.partIndexToLength = p, this.finishHandler = g, this.partIndex = -1, this.headerListBuffer = null, this.readState = s.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = d.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
    }
    get isFinished() {
      return this.partIndex === this.partIndexToLength.length;
    }
    // noinspection JSUnusedGlobalSymbols
    _write(f, l, c) {
      if (this.isFinished) {
        console.error(`Trailing ignored data: ${f.length} bytes`);
        return;
      }
      this.handleData(f).then(c).catch(c);
    }
    async handleData(f) {
      let l = 0;
      if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
        throw (0, r.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
      if (this.ignoreByteCount > 0) {
        const c = Math.min(this.ignoreByteCount, f.length);
        this.ignoreByteCount -= c, l = c;
      } else if (this.remainingPartDataCount > 0) {
        const c = Math.min(this.remainingPartDataCount, f.length);
        this.remainingPartDataCount -= c, await this.processPartData(f, 0, c), l = c;
      }
      if (l !== f.length) {
        if (this.readState === s.HEADER) {
          const c = this.searchHeaderListEnd(f, l);
          if (c === -1)
            return;
          l = c, this.readState = s.BODY, this.headerListBuffer = null;
        }
        for (; ; ) {
          if (this.readState === s.BODY)
            this.readState = s.INIT;
          else {
            this.partIndex++;
            let g = this.partIndexToTaskIndex.get(this.partIndex);
            if (g == null)
              if (this.isFinished)
                g = this.options.end;
              else
                throw (0, r.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
            const w = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
            if (w < g)
              await this.copyExistingData(w, g);
            else if (w > g)
              throw (0, r.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
            if (this.isFinished) {
              this.onPartEnd(), this.finishHandler();
              return;
            }
            if (l = this.searchHeaderListEnd(f, l), l === -1) {
              this.readState = s.HEADER;
              return;
            }
          }
          const c = this.partIndexToLength[this.partIndex], d = l + c, p = Math.min(d, f.length);
          if (await this.processPartStarted(f, l, p), this.remainingPartDataCount = c - (p - l), this.remainingPartDataCount > 0)
            return;
          if (l = d + this.boundaryLength, l >= f.length) {
            this.ignoreByteCount = this.boundaryLength - (f.length - d);
            return;
          }
        }
      }
    }
    copyExistingData(f, l) {
      return new Promise((c, d) => {
        const p = () => {
          if (f === l) {
            c();
            return;
          }
          const g = this.options.tasks[f];
          if (g.kind !== n.OperationKind.COPY) {
            d(new Error("Task kind must be COPY"));
            return;
          }
          a(g, this.out, this.options.oldFileFd, d, () => {
            f++, p();
          });
        };
        p();
      });
    }
    searchHeaderListEnd(f, l) {
      const c = f.indexOf(i, l);
      if (c !== -1)
        return c + i.length;
      const d = l === 0 ? f : f.slice(l);
      return this.headerListBuffer == null ? this.headerListBuffer = d : this.headerListBuffer = Buffer.concat([this.headerListBuffer, d]), -1;
    }
    onPartEnd() {
      const f = this.partIndexToLength[this.partIndex - 1];
      if (this.actualPartLength !== f)
        throw (0, r.newError)(`Expected length: ${f} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
      this.actualPartLength = 0;
    }
    processPartStarted(f, l, c) {
      return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(f, l, c);
    }
    processPartData(f, l, c) {
      this.actualPartLength += c - l;
      const d = this.out;
      return d.write(l === 0 && f.length === c ? f : f.slice(l, c)) ? Promise.resolve() : new Promise((p, g) => {
        d.on("error", g), d.once("drain", () => {
          d.removeListener("error", g), p();
        });
      });
    }
  };
  return yr.DataSplitter = u, yr;
}
var jr = {}, Cu;
function Nh() {
  if (Cu) return jr;
  Cu = 1, Object.defineProperty(jr, "__esModule", { value: !0 }), jr.executeTasksUsingMultipleRangeRequests = n, jr.checkIsRangesSupported = s;
  const r = Ye(), e = Mc(), t = ba();
  function n(a, u, o, f, l) {
    const c = (d) => {
      if (d >= u.length) {
        a.fileMetadataBuffer != null && o.write(a.fileMetadataBuffer), o.end();
        return;
      }
      const p = d + 1e3;
      i(a, {
        tasks: u,
        start: d,
        end: Math.min(u.length, p),
        oldFileFd: f
      }, o, () => c(p), l);
    };
    return c;
  }
  function i(a, u, o, f, l) {
    let c = "bytes=", d = 0;
    const p = /* @__PURE__ */ new Map(), g = [];
    for (let E = u.start; E < u.end; E++) {
      const C = u.tasks[E];
      C.kind === t.OperationKind.DOWNLOAD && (c += `${C.start}-${C.end - 1}, `, p.set(d, E), d++, g.push(C.end - C.start));
    }
    if (d <= 1) {
      const E = (C) => {
        if (C >= u.end) {
          f();
          return;
        }
        const N = u.tasks[C++];
        if (N.kind === t.OperationKind.COPY)
          (0, e.copyData)(N, o, u.oldFileFd, l, () => E(C));
        else {
          const O = a.createRequestOptions();
          O.headers.Range = `bytes=${N.start}-${N.end - 1}`;
          const R = a.httpExecutor.createRequest(O, (I) => {
            I.on("error", l), s(I, l) && (I.pipe(o, {
              end: !1
            }), I.once("end", () => E(C)));
          });
          a.httpExecutor.addErrorAndTimeoutHandlers(R, l), R.end();
        }
      };
      E(u.start);
      return;
    }
    const w = a.createRequestOptions();
    w.headers.Range = c.substring(0, c.length - 2);
    const m = a.httpExecutor.createRequest(w, (E) => {
      if (!s(E, l))
        return;
      const C = (0, r.safeGetHeader)(E, "content-type"), N = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(C);
      if (N == null) {
        l(new Error(`Content-Type "multipart/byteranges" is expected, but got "${C}"`));
        return;
      }
      const O = new e.DataSplitter(o, u, p, N[1] || N[2], g, f);
      O.on("error", l), E.pipe(O), E.on("end", () => {
        setTimeout(() => {
          m.abort(), l(new Error("Response ends without calling any handlers"));
        }, 1e4);
      });
    });
    a.httpExecutor.addErrorAndTimeoutHandlers(m, l), m.end();
  }
  function s(a, u) {
    if (a.statusCode >= 400)
      return u((0, r.createHttpError)(a)), !1;
    if (a.statusCode !== 206) {
      const o = (0, r.safeGetHeader)(a, "accept-ranges");
      if (o == null || o === "none")
        return u(new Error(`Server doesn't support Accept-Ranges (response code ${a.statusCode})`)), !1;
    }
    return !0;
  }
  return jr;
}
var Hr = {}, Au;
function Oh() {
  if (Au) return Hr;
  Au = 1, Object.defineProperty(Hr, "__esModule", { value: !0 }), Hr.ProgressDifferentialDownloadCallbackTransform = void 0;
  const r = tn;
  var e;
  (function(n) {
    n[n.COPY = 0] = "COPY", n[n.DOWNLOAD = 1] = "DOWNLOAD";
  })(e || (e = {}));
  let t = class extends r.Transform {
    constructor(i, s, a) {
      super(), this.progressDifferentialDownloadInfo = i, this.cancellationToken = s, this.onProgress = a, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = e.COPY, this.nextUpdate = this.start + 1e3;
    }
    _transform(i, s, a) {
      if (this.cancellationToken.cancelled) {
        a(new Error("cancelled"), null);
        return;
      }
      if (this.operationType == e.COPY) {
        a(null, i);
        return;
      }
      this.transferred += i.length, this.delta += i.length;
      const u = Date.now();
      u >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = u + 1e3, this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((u - this.start) / 1e3))
      }), this.delta = 0), a(null, i);
    }
    beginFileCopy() {
      this.operationType = e.COPY;
    }
    beginRangeDownload() {
      this.operationType = e.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
    }
    endRangeDownload() {
      this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      });
    }
    // Called when we are 100% done with the connection/download
    _flush(i) {
      if (this.cancellationToken.cancelled) {
        i(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, this.transferred = 0, i(null);
    }
  };
  return Hr.ProgressDifferentialDownloadCallbackTransform = t, Hr;
}
var Ru;
function jc() {
  if (Ru) return Mr;
  Ru = 1, Object.defineProperty(Mr, "__esModule", { value: !0 }), Mr.DifferentialDownloader = void 0;
  const r = Ye(), e = /* @__PURE__ */ zt(), t = bt, n = Mc(), i = Gt, s = ba(), a = Nh(), u = Oh();
  let o = class {
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(d, p, g) {
      this.blockAwareFileInfo = d, this.httpExecutor = p, this.options = g, this.fileMetadataBuffer = null, this.logger = g.logger;
    }
    createRequestOptions() {
      const d = {
        headers: {
          ...this.options.requestHeaders,
          accept: "*/*"
        }
      };
      return (0, r.configureRequestUrl)(this.options.newUrl, d), (0, r.configureRequestOptions)(d), d;
    }
    doDownload(d, p) {
      if (d.version !== p.version)
        throw new Error(`version is different (${d.version} - ${p.version}), full download is required`);
      const g = this.logger, w = (0, s.computeOperations)(d, p, g);
      g.debug != null && g.debug(JSON.stringify(w, null, 2));
      let m = 0, E = 0;
      for (const N of w) {
        const O = N.end - N.start;
        N.kind === s.OperationKind.DOWNLOAD ? m += O : E += O;
      }
      const C = this.blockAwareFileInfo.size;
      if (m + E + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== C)
        throw new Error(`Internal error, size mismatch: downloadSize: ${m}, copySize: ${E}, newSize: ${C}`);
      return g.info(`Full: ${f(C)}, To download: ${f(m)} (${Math.round(m / (C / 100))}%)`), this.downloadFile(w);
    }
    downloadFile(d) {
      const p = [], g = () => Promise.all(p.map((w) => (0, e.close)(w.descriptor).catch((m) => {
        this.logger.error(`cannot close file "${w.path}": ${m}`);
      })));
      return this.doDownloadFile(d, p).then(g).catch((w) => g().catch((m) => {
        try {
          this.logger.error(`cannot close files: ${m}`);
        } catch (E) {
          try {
            console.error(E);
          } catch {
          }
        }
        throw w;
      }).then(() => {
        throw w;
      }));
    }
    async doDownloadFile(d, p) {
      const g = await (0, e.open)(this.options.oldFile, "r");
      p.push({ descriptor: g, path: this.options.oldFile });
      const w = await (0, e.open)(this.options.newFile, "w");
      p.push({ descriptor: w, path: this.options.newFile });
      const m = (0, t.createWriteStream)(this.options.newFile, { fd: w });
      await new Promise((E, C) => {
        const N = [];
        let O;
        if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
          const F = [];
          let q = 0;
          for (const L of d)
            L.kind === s.OperationKind.DOWNLOAD && (F.push(L.end - L.start), q += L.end - L.start);
          const D = {
            expectedByteCounts: F,
            grandTotal: q
          };
          O = new u.ProgressDifferentialDownloadCallbackTransform(D, this.options.cancellationToken, this.options.onProgress), N.push(O);
        }
        const R = new r.DigestTransform(this.blockAwareFileInfo.sha512);
        R.isValidateOnEnd = !1, N.push(R), m.on("finish", () => {
          m.close(() => {
            p.splice(1, 1);
            try {
              R.validate();
            } catch (F) {
              C(F);
              return;
            }
            E(void 0);
          });
        }), N.push(m);
        let I = null;
        for (const F of N)
          F.on("error", C), I == null ? I = F : I = I.pipe(F);
        const _ = N[0];
        let S;
        if (this.options.isUseMultipleRangeRequest) {
          S = (0, a.executeTasksUsingMultipleRangeRequests)(this, d, _, g, C), S(0);
          return;
        }
        let y = 0, k = null;
        this.logger.info(`Differential download: ${this.options.newUrl}`);
        const B = this.createRequestOptions();
        B.redirect = "manual", S = (F) => {
          var q, D;
          if (F >= d.length) {
            this.fileMetadataBuffer != null && _.write(this.fileMetadataBuffer), _.end();
            return;
          }
          const L = d[F++];
          if (L.kind === s.OperationKind.COPY) {
            O && O.beginFileCopy(), (0, n.copyData)(L, _, g, C, () => S(F));
            return;
          }
          const Q = `bytes=${L.start}-${L.end - 1}`;
          B.headers.range = Q, (D = (q = this.logger) === null || q === void 0 ? void 0 : q.debug) === null || D === void 0 || D.call(q, `download range: ${Q}`), O && O.beginRangeDownload();
          const P = this.httpExecutor.createRequest(B, (G) => {
            G.on("error", C), G.on("aborted", () => {
              C(new Error("response has been aborted by the server"));
            }), G.statusCode >= 400 && C((0, r.createHttpError)(G)), G.pipe(_, {
              end: !1
            }), G.once("end", () => {
              O && O.endRangeDownload(), ++y === 100 ? (y = 0, setTimeout(() => S(F), 1e3)) : S(F);
            });
          });
          P.on("redirect", (G, V, ie) => {
            this.logger.info(`Redirect to ${l(ie)}`), k = ie, (0, r.configureRequestUrl)(new i.URL(k), B), P.followRedirect();
          }), this.httpExecutor.addErrorAndTimeoutHandlers(P, C), P.end();
        }, S(0);
      });
    }
    async readRemoteBytes(d, p) {
      const g = Buffer.allocUnsafe(p + 1 - d), w = this.createRequestOptions();
      w.headers.range = `bytes=${d}-${p}`;
      let m = 0;
      if (await this.request(w, (E) => {
        E.copy(g, m), m += E.length;
      }), m !== g.length)
        throw new Error(`Received data length ${m} is not equal to expected ${g.length}`);
      return g;
    }
    request(d, p) {
      return new Promise((g, w) => {
        const m = this.httpExecutor.createRequest(d, (E) => {
          (0, a.checkIsRangesSupported)(E, w) && (E.on("error", w), E.on("aborted", () => {
            w(new Error("response has been aborted by the server"));
          }), E.on("data", p), E.on("end", () => g()));
        });
        this.httpExecutor.addErrorAndTimeoutHandlers(m, w), m.end();
      });
    }
  };
  Mr.DifferentialDownloader = o;
  function f(c, d = " KB") {
    return new Intl.NumberFormat("en").format((c / 1024).toFixed(2)) + d;
  }
  function l(c) {
    const d = c.indexOf("?");
    return d < 0 ? c : c.substring(0, d);
  }
  return Mr;
}
var Nu;
function Ih() {
  if (Nu) return Br;
  Nu = 1, Object.defineProperty(Br, "__esModule", { value: !0 }), Br.GenericDifferentialDownloader = void 0;
  const r = jc();
  let e = class extends r.DifferentialDownloader {
    download(n, i) {
      return this.doDownload(n, i);
    }
  };
  return Br.GenericDifferentialDownloader = e, Br;
}
var Ys = {}, Ou;
function lr() {
  return Ou || (Ou = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.UpdaterSignal = r.UPDATE_DOWNLOADED = r.DOWNLOAD_PROGRESS = r.CancellationToken = void 0, r.addHandler = n;
    const e = Ye();
    Object.defineProperty(r, "CancellationToken", { enumerable: !0, get: function() {
      return e.CancellationToken;
    } }), r.DOWNLOAD_PROGRESS = "download-progress", r.UPDATE_DOWNLOADED = "update-downloaded";
    class t {
      constructor(s) {
        this.emitter = s;
      }
      /**
       * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
       */
      login(s) {
        n(this.emitter, "login", s);
      }
      progress(s) {
        n(this.emitter, r.DOWNLOAD_PROGRESS, s);
      }
      updateDownloaded(s) {
        n(this.emitter, r.UPDATE_DOWNLOADED, s);
      }
      updateCancelled(s) {
        n(this.emitter, "update-cancelled", s);
      }
    }
    r.UpdaterSignal = t;
    function n(i, s, a) {
      i.on(s, a);
    }
  })(Ys)), Ys;
}
var Iu;
function _a() {
  if (Iu) return Zt;
  Iu = 1, Object.defineProperty(Zt, "__esModule", { value: !0 }), Zt.NoOpLogger = Zt.AppUpdater = void 0;
  const r = Ye(), e = rn, t = $n, n = uc, i = /* @__PURE__ */ zt(), s = ma(), a = Vd(), u = Be, o = qc(), f = vh(), l = Sh(), c = bh(), d = kc(), p = Rh(), g = fc, w = Ih(), m = lr();
  let E = class Hc extends n.EventEmitter {
    /**
     * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
     */
    get channel() {
      return this._channel;
    }
    /**
     * Set the update channel. Overrides `channel` in the update configuration.
     *
     * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
     */
    set channel(R) {
      if (this._channel != null) {
        if (typeof R != "string")
          throw (0, r.newError)(`Channel must be a string, but got: ${R}`, "ERR_UPDATER_INVALID_CHANNEL");
        if (R.length === 0)
          throw (0, r.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
      }
      this._channel = R, this.allowDowngrade = !0;
    }
    /**
     *  Shortcut for explicitly adding auth tokens to request headers
     */
    addAuthHeader(R) {
      this.requestHeaders = Object.assign({}, this.requestHeaders, {
        authorization: R
      });
    }
    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    get netSession() {
      return (0, c.getNetSession)();
    }
    /**
     * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
     * Set it to `null` if you would like to disable a logging feature.
     */
    get logger() {
      return this._logger;
    }
    set logger(R) {
      this._logger = R ?? new N();
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * test only
     * @private
     */
    set updateConfigPath(R) {
      this.clientPromise = null, this._appUpdateConfigPath = R, this.configOnDisk = new a.Lazy(() => this.loadUpdateConfig());
    }
    /**
     * Allows developer to override default logic for determining if an update is supported.
     * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
     */
    get isUpdateSupported() {
      return this._isUpdateSupported;
    }
    set isUpdateSupported(R) {
      R && (this._isUpdateSupported = R);
    }
    /**
     * Allows developer to override default logic for determining if the user is below the rollout threshold.
     * The default logic compares the staging percentage with numerical representation of user ID.
     * An override can define custom logic, or bypass it if needed.
     */
    get isUserWithinRollout() {
      return this._isUserWithinRollout;
    }
    set isUserWithinRollout(R) {
      R && (this._isUserWithinRollout = R);
    }
    constructor(R, I) {
      super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new m.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (y) => this.checkIfUpdateSupported(y), this._isUserWithinRollout = (y) => this.isStagingMatch(y), this.clientPromise = null, this.stagingUserIdPromise = new a.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new a.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (y) => {
        this._logger.error(`Error: ${y.stack || y.message}`);
      }), I == null ? (this.app = new l.ElectronAppAdapter(), this.httpExecutor = new c.ElectronHttpExecutor((y, k) => this.emit("login", y, k))) : (this.app = I, this.httpExecutor = null);
      const _ = this.app.version, S = (0, o.parse)(_);
      if (S == null)
        throw (0, r.newError)(`App version is not a valid semver version: "${_}"`, "ERR_UPDATER_INVALID_VERSION");
      this.currentVersion = S, this.allowPrerelease = C(S), R != null && (this.setFeedURL(R), typeof R != "string" && R.requestHeaders && (this.requestHeaders = R.requestHeaders));
    }
    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    getFeedURL() {
      return "Deprecated. Do not use it.";
    }
    /**
     * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
     * @param options If you want to override configuration in the `app-update.yml`.
     */
    setFeedURL(R) {
      const I = this.createProviderRuntimeOptions();
      let _;
      typeof R == "string" ? _ = new d.GenericProvider({ provider: "generic", url: R }, this, {
        ...I,
        isUseMultipleRangeRequest: (0, p.isUrlProbablySupportMultiRangeRequests)(R)
      }) : _ = (0, p.createClient)(R, this, I), this.clientPromise = Promise.resolve(_);
    }
    /**
     * Asks the server whether there is an update.
     * @returns null if the updater is disabled, otherwise info about the latest version
     */
    checkForUpdates() {
      if (!this.isUpdaterActive())
        return Promise.resolve(null);
      let R = this.checkForUpdatesPromise;
      if (R != null)
        return this._logger.info("Checking for update (already in progress)"), R;
      const I = () => this.checkForUpdatesPromise = null;
      return this._logger.info("Checking for update"), R = this.doCheckForUpdates().then((_) => (I(), _)).catch((_) => {
        throw I(), this.emit("error", _, `Cannot check for updates: ${(_.stack || _).toString()}`), _;
      }), this.checkForUpdatesPromise = R, R;
    }
    isUpdaterActive() {
      return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
    }
    // noinspection JSUnusedGlobalSymbols
    checkForUpdatesAndNotify(R) {
      return this.checkForUpdates().then((I) => I?.downloadPromise ? (I.downloadPromise.then(() => {
        const _ = Hc.formatDownloadNotification(I.updateInfo.version, this.app.name, R);
        new nr.Notification(_).show();
      }), I) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), I));
    }
    static formatDownloadNotification(R, I, _) {
      return _ == null && (_ = {
        title: "A new update is ready to install",
        body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
      }), _ = {
        title: _.title.replace("{appName}", I).replace("{version}", R),
        body: _.body.replace("{appName}", I).replace("{version}", R)
      }, _;
    }
    async isStagingMatch(R) {
      const I = R.stagingPercentage;
      let _ = I;
      if (_ == null)
        return !0;
      if (_ = parseInt(_, 10), isNaN(_))
        return this._logger.warn(`Staging percentage is NaN: ${I}`), !0;
      _ = _ / 100;
      const S = await this.stagingUserIdPromise.value, k = r.UUID.parse(S).readUInt32BE(12) / 4294967295;
      return this._logger.info(`Staging percentage: ${_}, percentage: ${k}, user id: ${S}`), k < _;
    }
    computeFinalHeaders(R) {
      return this.requestHeaders != null && Object.assign(R, this.requestHeaders), R;
    }
    async isUpdateAvailable(R) {
      const I = (0, o.parse)(R.version);
      if (I == null)
        throw (0, r.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${R.version}"`, "ERR_UPDATER_INVALID_VERSION");
      const _ = this.currentVersion;
      if ((0, o.eq)(I, _) || !await Promise.resolve(this.isUpdateSupported(R)) || !await Promise.resolve(this.isUserWithinRollout(R)))
        return !1;
      const y = (0, o.gt)(I, _), k = (0, o.lt)(I, _);
      return y ? !0 : this.allowDowngrade && k;
    }
    checkIfUpdateSupported(R) {
      const I = R?.minimumSystemVersion, _ = (0, t.release)();
      if (I)
        try {
          if ((0, o.lt)(_, I))
            return this._logger.info(`Current OS version ${_} is less than the minimum OS version required ${I} for version ${_}`), !1;
        } catch (S) {
          this._logger.warn(`Failed to compare current OS version(${_}) with minimum OS version(${I}): ${(S.message || S).toString()}`);
        }
      return !0;
    }
    async getUpdateInfoAndProvider() {
      await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((_) => (0, p.createClient)(_, this, this.createProviderRuntimeOptions())));
      const R = await this.clientPromise, I = await this.stagingUserIdPromise.value;
      return R.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": I })), {
        info: await R.getLatestVersion(),
        provider: R
      };
    }
    createProviderRuntimeOptions() {
      return {
        isUseMultipleRangeRequest: !0,
        platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
        executor: this.httpExecutor
      };
    }
    async doCheckForUpdates() {
      this.emit("checking-for-update");
      const R = await this.getUpdateInfoAndProvider(), I = R.info;
      if (!await this.isUpdateAvailable(I))
        return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${I.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", I), {
          isUpdateAvailable: !1,
          versionInfo: I,
          updateInfo: I
        };
      this.updateInfoAndProvider = R, this.onUpdateAvailable(I);
      const _ = new r.CancellationToken();
      return {
        isUpdateAvailable: !0,
        versionInfo: I,
        updateInfo: I,
        cancellationToken: _,
        downloadPromise: this.autoDownload ? this.downloadUpdate(_) : null
      };
    }
    onUpdateAvailable(R) {
      this._logger.info(`Found version ${R.version} (url: ${(0, r.asArray)(R.files).map((I) => I.url).join(", ")})`), this.emit("update-available", R);
    }
    /**
     * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
     * @returns {Promise<Array<string>>} Paths to downloaded files.
     */
    downloadUpdate(R = new r.CancellationToken()) {
      const I = this.updateInfoAndProvider;
      if (I == null) {
        const S = new Error("Please check update first");
        return this.dispatchError(S), Promise.reject(S);
      }
      if (this.downloadPromise != null)
        return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
      this._logger.info(`Downloading update from ${(0, r.asArray)(I.info.files).map((S) => S.url).join(", ")}`);
      const _ = (S) => {
        if (!(S instanceof r.CancellationError))
          try {
            this.dispatchError(S);
          } catch (y) {
            this._logger.warn(`Cannot dispatch error event: ${y.stack || y}`);
          }
        return S;
      };
      return this.downloadPromise = this.doDownloadUpdate({
        updateInfoAndProvider: I,
        requestHeaders: this.computeRequestHeaders(I.provider),
        cancellationToken: R,
        disableWebInstaller: this.disableWebInstaller,
        disableDifferentialDownload: this.disableDifferentialDownload
      }).catch((S) => {
        throw _(S);
      }).finally(() => {
        this.downloadPromise = null;
      }), this.downloadPromise;
    }
    dispatchError(R) {
      this.emit("error", R, (R.stack || R).toString());
    }
    dispatchUpdateDownloaded(R) {
      this.emit(m.UPDATE_DOWNLOADED, R);
    }
    async loadUpdateConfig() {
      return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, s.load)(await (0, i.readFile)(this._appUpdateConfigPath, "utf-8"));
    }
    computeRequestHeaders(R) {
      const I = R.fileExtraDownloadHeaders;
      if (I != null) {
        const _ = this.requestHeaders;
        return _ == null ? I : {
          ...I,
          ..._
        };
      }
      return this.computeFinalHeaders({ accept: "*/*" });
    }
    async getOrCreateStagingUserId() {
      const R = u.join(this.app.userDataPath, ".updaterId");
      try {
        const _ = await (0, i.readFile)(R, "utf-8");
        if (r.UUID.check(_))
          return _;
        this._logger.warn(`Staging user id file exists, but content was invalid: ${_}`);
      } catch (_) {
        _.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${_}`);
      }
      const I = r.UUID.v5((0, e.randomBytes)(4096), r.UUID.OID);
      this._logger.info(`Generated new staging user ID: ${I}`);
      try {
        await (0, i.outputFile)(R, I);
      } catch (_) {
        this._logger.warn(`Couldn't write out staging user ID: ${_}`);
      }
      return I;
    }
    /** @internal */
    get isAddNoCacheQuery() {
      const R = this.requestHeaders;
      if (R == null)
        return !0;
      for (const I of Object.keys(R)) {
        const _ = I.toLowerCase();
        if (_ === "authorization" || _ === "private-token")
          return !1;
      }
      return !0;
    }
    async getOrCreateDownloadHelper() {
      let R = this.downloadedUpdateHelper;
      if (R == null) {
        const I = (await this.configOnDisk.value).updaterCacheDirName, _ = this._logger;
        I == null && _.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
        const S = u.join(this.app.baseCachePath, I || this.app.name);
        _.debug != null && _.debug(`updater cache dir: ${S}`), R = new f.DownloadedUpdateHelper(S), this.downloadedUpdateHelper = R;
      }
      return R;
    }
    async executeDownload(R) {
      const I = R.fileInfo, _ = {
        headers: R.downloadUpdateOptions.requestHeaders,
        cancellationToken: R.downloadUpdateOptions.cancellationToken,
        sha2: I.info.sha2,
        sha512: I.info.sha512
      };
      this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (_.onProgress = (oe) => this.emit(m.DOWNLOAD_PROGRESS, oe));
      const S = R.downloadUpdateOptions.updateInfoAndProvider.info, y = S.version, k = I.packageInfo;
      function B() {
        const oe = decodeURIComponent(R.fileInfo.url.pathname);
        return oe.toLowerCase().endsWith(`.${R.fileExtension.toLowerCase()}`) ? u.basename(oe) : R.fileInfo.info.url;
      }
      const F = await this.getOrCreateDownloadHelper(), q = F.cacheDirForPendingUpdate;
      await (0, i.mkdir)(q, { recursive: !0 });
      const D = B();
      let L = u.join(q, D);
      const Q = k == null ? null : u.join(q, `package-${y}${u.extname(k.path) || ".7z"}`), P = async (oe) => {
        await F.setDownloadedFile(L, Q, S, I, D, oe), await R.done({
          ...S,
          downloadedFile: L
        });
        const Ae = u.join(q, "current.blockmap");
        return await (0, i.pathExists)(Ae) && await (0, i.copyFile)(Ae, u.join(F.cacheDir, "current.blockmap")), Q == null ? [L] : [L, Q];
      }, G = this._logger, V = await F.validateDownloadedPath(L, S, I, G);
      if (V != null)
        return L = V, await P(!1);
      const ie = async () => (await F.clear().catch(() => {
      }), await (0, i.unlink)(L).catch(() => {
      })), ye = await (0, f.createTempUpdateFile)(`temp-${D}`, q, G);
      try {
        await R.task(ye, _, Q, ie), await (0, r.retry)(() => (0, i.rename)(ye, L), {
          retries: 60,
          interval: 500,
          shouldRetry: (oe) => oe instanceof Error && /^EBUSY:/.test(oe.message) ? !0 : (G.warn(`Cannot rename temp file to final file: ${oe.message || oe.stack}`), !1)
        });
      } catch (oe) {
        throw await ie(), oe instanceof r.CancellationError && (G.info("cancelled"), this.emit("update-cancelled", S)), oe;
      }
      return G.info(`New version ${y} has been downloaded to ${L}`), await P(!0);
    }
    async differentialDownloadInstaller(R, I, _, S, y) {
      try {
        if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
          return !0;
        const k = I.updateInfoAndProvider.provider, B = await k.getBlockMapFiles(R.url, this.app.version, I.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
        this._logger.info(`Download block maps (old: "${B[0]}", new: ${B[1]})`);
        const F = async (G) => {
          const V = await this.httpExecutor.downloadToBuffer(G, {
            headers: I.requestHeaders,
            cancellationToken: I.cancellationToken
          });
          if (V == null || V.length === 0)
            throw new Error(`Blockmap "${G.href}" is empty`);
          try {
            return JSON.parse((0, g.gunzipSync)(V).toString());
          } catch (ie) {
            throw new Error(`Cannot parse blockmap "${G.href}", error: ${ie}`);
          }
        }, q = {
          newUrl: R.url,
          oldFile: u.join(this.downloadedUpdateHelper.cacheDir, y),
          logger: this._logger,
          newFile: _,
          isUseMultipleRangeRequest: k.isUseMultipleRangeRequest,
          requestHeaders: I.requestHeaders,
          cancellationToken: I.cancellationToken
        };
        this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (q.onProgress = (G) => this.emit(m.DOWNLOAD_PROGRESS, G));
        const D = async (G, V) => {
          const ie = u.join(V, "current.blockmap");
          await (0, i.outputFile)(ie, (0, g.gzipSync)(JSON.stringify(G)));
        }, L = async (G) => {
          const V = u.join(G, "current.blockmap");
          try {
            if (await (0, i.pathExists)(V))
              return JSON.parse((0, g.gunzipSync)(await (0, i.readFile)(V)).toString());
          } catch (ie) {
            this._logger.warn(`Cannot parse blockmap "${V}", error: ${ie}`);
          }
          return null;
        }, Q = await F(B[1]);
        await D(Q, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
        let P = await L(this.downloadedUpdateHelper.cacheDir);
        return P == null && (P = await F(B[0])), await new w.GenericDifferentialDownloader(R.info, this.httpExecutor, q).download(P, Q), !1;
      } catch (k) {
        if (this._logger.error(`Cannot download differentially, fallback to full download: ${k.stack || k}`), this._testOnlyOptions != null)
          throw k;
        return !0;
      }
    }
  };
  Zt.AppUpdater = E;
  function C(O) {
    const R = (0, o.prerelease)(O);
    return R != null && R.length > 0;
  }
  class N {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(R) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(R) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(R) {
    }
  }
  return Zt.NoOpLogger = N, Zt;
}
var Pu;
function zn() {
  if (Pu) return Or;
  Pu = 1, Object.defineProperty(Or, "__esModule", { value: !0 }), Or.BaseUpdater = void 0;
  const r = qn, e = _a();
  let t = class extends e.AppUpdater {
    constructor(i, s) {
      super(i, s), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
    }
    quitAndInstall(i = !1, s = !1) {
      this._logger.info("Install on explicit quitAndInstall"), this.install(i, i ? s : this.autoRunAppAfterInstall) ? setImmediate(() => {
        nr.autoUpdater.emit("before-quit-for-update"), this.app.quit();
      }) : this.quitAndInstallCalled = !1;
    }
    executeDownload(i) {
      return super.executeDownload({
        ...i,
        done: (s) => (this.dispatchUpdateDownloaded(s), this.addQuitHandler(), Promise.resolve())
      });
    }
    get installerPath() {
      return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
    }
    // must be sync (because quit even handler is not async)
    install(i = !1, s = !1) {
      if (this.quitAndInstallCalled)
        return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
      const a = this.downloadedUpdateHelper, u = this.installerPath, o = a == null ? null : a.downloadedFileInfo;
      if (u == null || o == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      this.quitAndInstallCalled = !0;
      try {
        return this._logger.info(`Install: isSilent: ${i}, isForceRunAfter: ${s}`), this.doInstall({
          isSilent: i,
          isForceRunAfter: s,
          isAdminRightsRequired: o.isAdminRightsRequired
        });
      } catch (f) {
        return this.dispatchError(f), !1;
      }
    }
    addQuitHandler() {
      this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((i) => {
        if (this.quitAndInstallCalled) {
          this._logger.info("Update installer has already been triggered. Quitting application.");
          return;
        }
        if (!this.autoInstallOnAppQuit) {
          this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
          return;
        }
        if (i !== 0) {
          this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${i}`);
          return;
        }
        this._logger.info("Auto install update on quit"), this.install(!0, !1);
      }));
    }
    spawnSyncLog(i, s = [], a = {}) {
      this._logger.info(`Executing: ${i} with args: ${s}`);
      const u = (0, r.spawnSync)(i, s, {
        env: { ...process.env, ...a },
        encoding: "utf-8",
        shell: !0
      }), { error: o, status: f, stdout: l, stderr: c } = u;
      if (o != null)
        throw this._logger.error(c), o;
      if (f != null && f !== 0)
        throw this._logger.error(c), new Error(`Command ${i} exited with code ${f}`);
      return l.trim();
    }
    /**
     * This handles both node 8 and node 10 way of emitting error when spawning a process
     *   - node 8: Throws the error
     *   - node 10: Emit the error(Need to listen with on)
     */
    // https://github.com/electron-userland/electron-builder/issues/1129
    // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
    async spawnLog(i, s = [], a = void 0, u = "ignore") {
      return this._logger.info(`Executing: ${i} with args: ${s}`), new Promise((o, f) => {
        try {
          const l = { stdio: u, env: a, detached: !0 }, c = (0, r.spawn)(i, s, l);
          c.on("error", (d) => {
            f(d);
          }), c.unref(), c.pid !== void 0 && o(!0);
        } catch (l) {
          f(l);
        }
      });
    }
  };
  return Or.BaseUpdater = t, Or;
}
var Qr = {}, Gr = {}, Du;
function Qc() {
  if (Du) return Gr;
  Du = 1, Object.defineProperty(Gr, "__esModule", { value: !0 }), Gr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
  const r = /* @__PURE__ */ zt(), e = jc(), t = fc;
  let n = class extends e.DifferentialDownloader {
    async download() {
      const u = this.blockAwareFileInfo, o = u.size, f = o - (u.blockMapSize + 4);
      this.fileMetadataBuffer = await this.readRemoteBytes(f, o - 1);
      const l = i(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
      await this.doDownload(await s(this.options.oldFile), l);
    }
  };
  Gr.FileWithEmbeddedBlockMapDifferentialDownloader = n;
  function i(a) {
    return JSON.parse((0, t.inflateRawSync)(a).toString());
  }
  async function s(a) {
    const u = await (0, r.open)(a, "r");
    try {
      const o = (await (0, r.fstat)(u)).size, f = Buffer.allocUnsafe(4);
      await (0, r.read)(u, f, 0, f.length, o - f.length);
      const l = Buffer.allocUnsafe(f.readUInt32BE(0));
      return await (0, r.read)(u, l, 0, l.length, o - f.length - l.length), await (0, r.close)(u), i(l);
    } catch (o) {
      throw await (0, r.close)(u), o;
    }
  }
  return Gr;
}
var Lu;
function xu() {
  if (Lu) return Qr;
  Lu = 1, Object.defineProperty(Qr, "__esModule", { value: !0 }), Qr.AppImageUpdater = void 0;
  const r = Ye(), e = qn, t = /* @__PURE__ */ zt(), n = bt, i = Be, s = zn(), a = Qc(), u = mt(), o = lr();
  let f = class extends s.BaseUpdater {
    constructor(c, d) {
      super(c, d);
    }
    isUpdaterActive() {
      return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
    }
    /*** @private */
    doDownloadUpdate(c) {
      const d = c.updateInfoAndProvider.provider, p = (0, u.findFile)(d.resolveFiles(c.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "AppImage",
        fileInfo: p,
        downloadUpdateOptions: c,
        task: async (g, w) => {
          const m = process.env.APPIMAGE;
          if (m == null)
            throw (0, r.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
          (c.disableDifferentialDownload || await this.downloadDifferential(p, m, g, d, c)) && await this.httpExecutor.download(p.url, g, w), await (0, t.chmod)(g, 493);
        }
      });
    }
    async downloadDifferential(c, d, p, g, w) {
      try {
        const m = {
          newUrl: c.url,
          oldFile: d,
          logger: this._logger,
          newFile: p,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          requestHeaders: w.requestHeaders,
          cancellationToken: w.cancellationToken
        };
        return this.listenerCount(o.DOWNLOAD_PROGRESS) > 0 && (m.onProgress = (E) => this.emit(o.DOWNLOAD_PROGRESS, E)), await new a.FileWithEmbeddedBlockMapDifferentialDownloader(c.info, this.httpExecutor, m).download(), !1;
      } catch (m) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${m.stack || m}`), process.platform === "linux";
      }
    }
    doInstall(c) {
      const d = process.env.APPIMAGE;
      if (d == null)
        throw (0, r.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      (0, n.unlinkSync)(d);
      let p;
      const g = i.basename(d), w = this.installerPath;
      if (w == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      i.basename(w) === g || !/\d+\.\d+\.\d+/.test(g) ? p = d : p = i.join(i.dirname(d), i.basename(w)), (0, e.execFileSync)("mv", ["-f", w, p]), p !== d && this.emit("appimage-filename-updated", p);
      const m = {
        ...process.env,
        APPIMAGE_SILENT_INSTALL: "true"
      };
      return c.isForceRunAfter ? this.spawnLog(p, [], m) : (m.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, e.execFileSync)(p, [], { env: m })), !0;
    }
  };
  return Qr.AppImageUpdater = f, Qr;
}
var zr = {}, Vr = {}, Fu;
function Ta() {
  if (Fu) return Vr;
  Fu = 1, Object.defineProperty(Vr, "__esModule", { value: !0 }), Vr.LinuxUpdater = void 0;
  const r = zn();
  let e = class extends r.BaseUpdater {
    constructor(n, i) {
      super(n, i);
    }
    /**
     * Returns true if the current process is running as root.
     */
    isRunningAsRoot() {
      var n;
      return ((n = process.getuid) === null || n === void 0 ? void 0 : n.call(process)) === 0;
    }
    /**
     * Sanitizies the installer path for using with command line tools.
     */
    get installerPath() {
      var n, i;
      return (i = (n = super.installerPath) === null || n === void 0 ? void 0 : n.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && i !== void 0 ? i : null;
    }
    runCommandWithSudoIfNeeded(n) {
      if (this.isRunningAsRoot())
        return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(n[0], n.slice(1));
      const { name: i } = this.app, s = `"${i} would like to update"`, a = this.sudoWithArgs(s);
      this._logger.info(`Running as non-root user, using sudo to install: ${a}`);
      let u = '"';
      return (/pkexec/i.test(a[0]) || a[0] === "sudo") && (u = ""), this.spawnSyncLog(a[0], [...a.length > 1 ? a.slice(1) : [], `${u}/bin/bash`, "-c", `'${n.join(" ")}'${u}`]);
    }
    sudoWithArgs(n) {
      const i = this.determineSudoCommand(), s = [i];
      return /kdesudo/i.test(i) ? (s.push("--comment", n), s.push("-c")) : /gksudo/i.test(i) ? s.push("--message", n) : /pkexec/i.test(i) && s.push("--disable-internal-agent"), s;
    }
    hasCommand(n) {
      try {
        return this.spawnSyncLog("command", ["-v", n]), !0;
      } catch {
        return !1;
      }
    }
    determineSudoCommand() {
      const n = ["gksudo", "kdesudo", "pkexec", "beesu"];
      for (const i of n)
        if (this.hasCommand(i))
          return i;
      return "sudo";
    }
    /**
     * Detects the package manager to use based on the available commands.
     * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
     * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
     * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
     * @param pms - An array of package manager commands to check for, in priority order.
     * @returns The detected package manager command or "unknown" if none are found.
     */
    detectPackageManager(n) {
      var i;
      const s = (i = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || i === void 0 ? void 0 : i.trim();
      if (s)
        return s;
      for (const a of n)
        if (this.hasCommand(a))
          return a;
      return this._logger.warn(`No package manager found in the list: ${n.join(", ")}. Defaulting to the first one: ${n[0]}`), n[0];
    }
  };
  return Vr.LinuxUpdater = e, Vr;
}
var Uu;
function qu() {
  if (Uu) return zr;
  Uu = 1, Object.defineProperty(zr, "__esModule", { value: !0 }), zr.DebUpdater = void 0;
  const r = mt(), e = lr(), t = Ta();
  let n = class Gc extends t.LinuxUpdater {
    constructor(s, a) {
      super(s, a);
    }
    /*** @private */
    doDownloadUpdate(s) {
      const a = s.updateInfoAndProvider.provider, u = (0, r.findFile)(a.resolveFiles(s.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
      return this.executeDownload({
        fileExtension: "deb",
        fileInfo: u,
        downloadUpdateOptions: s,
        task: async (o, f) => {
          this.listenerCount(e.DOWNLOAD_PROGRESS) > 0 && (f.onProgress = (l) => this.emit(e.DOWNLOAD_PROGRESS, l)), await this.httpExecutor.download(u.url, o, f);
        }
      });
    }
    doInstall(s) {
      const a = this.installerPath;
      if (a == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
        return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
      const u = ["dpkg", "apt"], o = this.detectPackageManager(u);
      try {
        Gc.installWithCommandRunner(o, a, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (f) {
        return this.dispatchError(f), !1;
      }
      return s.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(s, a, u, o) {
      var f;
      if (s === "dpkg")
        try {
          u(["dpkg", "-i", a]);
        } catch (l) {
          o.warn((f = l.message) !== null && f !== void 0 ? f : l), o.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), u(["apt-get", "install", "-f", "-y"]);
        }
      else if (s === "apt")
        o.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), u([
          "apt",
          "install",
          "-y",
          "--allow-unauthenticated",
          // needed for unsigned .debs
          "--allow-downgrades",
          // allow lower version installs
          "--allow-change-held-packages",
          a
        ]);
      else
        throw new Error(`Package manager ${s} not supported`);
    }
  };
  return zr.DebUpdater = n, zr;
}
var Wr = {}, $u;
function ku() {
  if ($u) return Wr;
  $u = 1, Object.defineProperty(Wr, "__esModule", { value: !0 }), Wr.PacmanUpdater = void 0;
  const r = lr(), e = mt(), t = Ta();
  let n = class zc extends t.LinuxUpdater {
    constructor(s, a) {
      super(s, a);
    }
    /*** @private */
    doDownloadUpdate(s) {
      const a = s.updateInfoAndProvider.provider, u = (0, e.findFile)(a.resolveFiles(s.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
      return this.executeDownload({
        fileExtension: "pacman",
        fileInfo: u,
        downloadUpdateOptions: s,
        task: async (o, f) => {
          this.listenerCount(r.DOWNLOAD_PROGRESS) > 0 && (f.onProgress = (l) => this.emit(r.DOWNLOAD_PROGRESS, l)), await this.httpExecutor.download(u.url, o, f);
        }
      });
    }
    doInstall(s) {
      const a = this.installerPath;
      if (a == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      try {
        zc.installWithCommandRunner(a, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (u) {
        return this.dispatchError(u), !1;
      }
      return s.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(s, a, u) {
      var o;
      try {
        a(["pacman", "-U", "--noconfirm", s]);
      } catch (f) {
        u.warn((o = f.message) !== null && o !== void 0 ? o : f), u.warn("pacman installation failed, attempting to update package database and retry");
        try {
          a(["pacman", "-Sy", "--noconfirm"]), a(["pacman", "-U", "--noconfirm", s]);
        } catch (l) {
          throw u.error("Retry after pacman -Sy failed"), l;
        }
      }
    }
  };
  return Wr.PacmanUpdater = n, Wr;
}
var Yr = {}, Bu;
function Mu() {
  if (Bu) return Yr;
  Bu = 1, Object.defineProperty(Yr, "__esModule", { value: !0 }), Yr.RpmUpdater = void 0;
  const r = lr(), e = mt(), t = Ta();
  let n = class Vc extends t.LinuxUpdater {
    constructor(s, a) {
      super(s, a);
    }
    /*** @private */
    doDownloadUpdate(s) {
      const a = s.updateInfoAndProvider.provider, u = (0, e.findFile)(a.resolveFiles(s.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "rpm",
        fileInfo: u,
        downloadUpdateOptions: s,
        task: async (o, f) => {
          this.listenerCount(r.DOWNLOAD_PROGRESS) > 0 && (f.onProgress = (l) => this.emit(r.DOWNLOAD_PROGRESS, l)), await this.httpExecutor.download(u.url, o, f);
        }
      });
    }
    doInstall(s) {
      const a = this.installerPath;
      if (a == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const u = ["zypper", "dnf", "yum", "rpm"], o = this.detectPackageManager(u);
      try {
        Vc.installWithCommandRunner(o, a, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (f) {
        return this.dispatchError(f), !1;
      }
      return s.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(s, a, u, o) {
      if (s === "zypper")
        return u(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", a]);
      if (s === "dnf")
        return u(["dnf", "install", "--nogpgcheck", "-y", a]);
      if (s === "yum")
        return u(["yum", "install", "--nogpgcheck", "-y", a]);
      if (s === "rpm")
        return o.warn("Installing with rpm only (no dependency resolution)."), u(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", a]);
      throw new Error(`Package manager ${s} not supported`);
    }
  };
  return Yr.RpmUpdater = n, Yr;
}
var Kr = {}, ju;
function Hu() {
  if (ju) return Kr;
  ju = 1, Object.defineProperty(Kr, "__esModule", { value: !0 }), Kr.MacUpdater = void 0;
  const r = Ye(), e = /* @__PURE__ */ zt(), t = bt, n = Be, i = id, s = _a(), a = mt(), u = qn, o = rn;
  let f = class extends s.AppUpdater {
    constructor(c, d) {
      super(c, d), this.nativeUpdater = nr.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (p) => {
        this._logger.warn(p), this.emit("error", p);
      }), this.nativeUpdater.on("update-downloaded", () => {
        this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
      });
    }
    debug(c) {
      this._logger.debug != null && this._logger.debug(c);
    }
    closeServerIfExists() {
      this.server && (this.debug("Closing proxy server"), this.server.close((c) => {
        c && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
      }));
    }
    async doDownloadUpdate(c) {
      let d = c.updateInfoAndProvider.provider.resolveFiles(c.updateInfoAndProvider.info);
      const p = this._logger, g = "sysctl.proc_translated";
      let w = !1;
      try {
        this.debug("Checking for macOS Rosetta environment"), w = (0, u.execFileSync)("sysctl", [g], { encoding: "utf8" }).includes(`${g}: 1`), p.info(`Checked for macOS Rosetta environment (isRosetta=${w})`);
      } catch (R) {
        p.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${R}`);
      }
      let m = !1;
      try {
        this.debug("Checking for arm64 in uname");
        const I = (0, u.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
        p.info(`Checked 'uname -a': arm64=${I}`), m = m || I;
      } catch (R) {
        p.warn(`uname shell command to check for arm64 failed: ${R}`);
      }
      m = m || process.arch === "arm64" || w;
      const E = (R) => {
        var I;
        return R.url.pathname.includes("arm64") || ((I = R.info.url) === null || I === void 0 ? void 0 : I.includes("arm64"));
      };
      m && d.some(E) ? d = d.filter((R) => m === E(R)) : d = d.filter((R) => !E(R));
      const C = (0, a.findFile)(d, "zip", ["pkg", "dmg"]);
      if (C == null)
        throw (0, r.newError)(`ZIP file not provided: ${(0, r.safeStringifyJson)(d)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
      const N = c.updateInfoAndProvider.provider, O = "update.zip";
      return this.executeDownload({
        fileExtension: "zip",
        fileInfo: C,
        downloadUpdateOptions: c,
        task: async (R, I) => {
          const _ = n.join(this.downloadedUpdateHelper.cacheDir, O), S = () => (0, e.pathExistsSync)(_) ? !c.disableDifferentialDownload : (p.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
          let y = !0;
          S() && (y = await this.differentialDownloadInstaller(C, c, R, N, O)), y && await this.httpExecutor.download(C.url, R, I);
        },
        done: async (R) => {
          if (!c.disableDifferentialDownload)
            try {
              const I = n.join(this.downloadedUpdateHelper.cacheDir, O);
              await (0, e.copyFile)(R.downloadedFile, I);
            } catch (I) {
              this._logger.warn(`Unable to copy file for caching for future differential downloads: ${I.message}`);
            }
          return this.updateDownloaded(C, R);
        }
      });
    }
    async updateDownloaded(c, d) {
      var p;
      const g = d.downloadedFile, w = (p = c.info.size) !== null && p !== void 0 ? p : (await (0, e.stat)(g)).size, m = this._logger, E = `fileToProxy=${c.url.href}`;
      this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${E})`), this.server = (0, i.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${E})`), this.server.on("close", () => {
        m.info(`Proxy server for native Squirrel.Mac is closed (${E})`);
      });
      const C = (N) => {
        const O = N.address();
        return typeof O == "string" ? O : `http://127.0.0.1:${O?.port}`;
      };
      return await new Promise((N, O) => {
        const R = (0, o.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), I = Buffer.from(`autoupdater:${R}`, "ascii"), _ = `/${(0, o.randomBytes)(64).toString("hex")}.zip`;
        this.server.on("request", (S, y) => {
          const k = S.url;
          if (m.info(`${k} requested`), k === "/") {
            if (!S.headers.authorization || S.headers.authorization.indexOf("Basic ") === -1) {
              y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), m.warn("No authenthication info");
              return;
            }
            const q = S.headers.authorization.split(" ")[1], D = Buffer.from(q, "base64").toString("ascii"), [L, Q] = D.split(":");
            if (L !== "autoupdater" || Q !== R) {
              y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), m.warn("Invalid authenthication credentials");
              return;
            }
            const P = Buffer.from(`{ "url": "${C(this.server)}${_}" }`);
            y.writeHead(200, { "Content-Type": "application/json", "Content-Length": P.length }), y.end(P);
            return;
          }
          if (!k.startsWith(_)) {
            m.warn(`${k} requested, but not supported`), y.writeHead(404), y.end();
            return;
          }
          m.info(`${_} requested by Squirrel.Mac, pipe ${g}`);
          let B = !1;
          y.on("finish", () => {
            B || (this.nativeUpdater.removeListener("error", O), N([]));
          });
          const F = (0, t.createReadStream)(g);
          F.on("error", (q) => {
            try {
              y.end();
            } catch (D) {
              m.warn(`cannot end response: ${D}`);
            }
            B = !0, this.nativeUpdater.removeListener("error", O), O(new Error(`Cannot pipe "${g}": ${q}`));
          }), y.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Length": w
          }), F.pipe(y);
        }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${E})`), this.server.listen(0, "127.0.0.1", () => {
          this.debug(`Proxy server for native Squirrel.Mac is listening (address=${C(this.server)}, ${E})`), this.nativeUpdater.setFeedURL({
            url: C(this.server),
            headers: {
              "Cache-Control": "no-cache",
              Authorization: `Basic ${I.toString("base64")}`
            }
          }), this.dispatchUpdateDownloaded(d), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", O), this.nativeUpdater.checkForUpdates()) : N([]);
        });
      });
    }
    handleUpdateDownloaded() {
      this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
    }
    quitAndInstall() {
      this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
    }
  };
  return Kr.MacUpdater = f, Kr;
}
var Jr = {}, An = {}, Qu;
function Ph() {
  if (Qu) return An;
  Qu = 1, Object.defineProperty(An, "__esModule", { value: !0 }), An.verifySignature = s;
  const r = Ye(), e = qn, t = $n, n = Be;
  function i(f, l) {
    return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", f], {
      shell: !0,
      timeout: l
    }];
  }
  function s(f, l, c) {
    return new Promise((d, p) => {
      const g = l.replace(/'/g, "''");
      c.info(`Verifying signature ${g}`), (0, e.execFile)(...i(`"Get-AuthenticodeSignature -LiteralPath '${g}' | ConvertTo-Json -Compress"`, 20 * 1e3), (w, m, E) => {
        var C;
        try {
          if (w != null || E) {
            u(c, w, E, p), d(null);
            return;
          }
          const N = a(m);
          if (N.Status === 0) {
            try {
              const _ = n.normalize(N.Path), S = n.normalize(l);
              if (c.info(`LiteralPath: ${_}. Update Path: ${S}`), _ !== S) {
                u(c, new Error(`LiteralPath of ${_} is different than ${S}`), E, p), d(null);
                return;
              }
            } catch (_) {
              c.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(C = _.message) !== null && C !== void 0 ? C : _.stack}`);
            }
            const R = (0, r.parseDn)(N.SignerCertificate.Subject);
            let I = !1;
            for (const _ of f) {
              const S = (0, r.parseDn)(_);
              if (S.size ? I = Array.from(S.keys()).every((k) => S.get(k) === R.get(k)) : _ === R.get("CN") && (c.warn(`Signature validated using only CN ${_}. Please add your full Distinguished Name (DN) to publisherNames configuration`), I = !0), I) {
                d(null);
                return;
              }
            }
          }
          const O = `publisherNames: ${f.join(" | ")}, raw info: ` + JSON.stringify(N, (R, I) => R === "RawData" ? void 0 : I, 2);
          c.warn(`Sign verification failed, installer signed with incorrect certificate: ${O}`), d(O);
        } catch (N) {
          u(c, N, null, p), d(null);
          return;
        }
      });
    });
  }
  function a(f) {
    const l = JSON.parse(f);
    delete l.PrivateKey, delete l.IsOSBinary, delete l.SignatureType;
    const c = l.SignerCertificate;
    return c != null && (delete c.Archived, delete c.Extensions, delete c.Handle, delete c.HasPrivateKey, delete c.SubjectName), l;
  }
  function u(f, l, c, d) {
    if (o()) {
      f.warn(`Cannot execute Get-AuthenticodeSignature: ${l || c}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    try {
      (0, e.execFileSync)(...i("ConvertTo-Json test", 10 * 1e3));
    } catch (p) {
      f.warn(`Cannot execute ConvertTo-Json: ${p.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    l != null && d(l), c && d(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${c}. Failing signature validation due to unknown stderr.`));
  }
  function o() {
    const f = t.release();
    return f.startsWith("6.") && !f.startsWith("6.3");
  }
  return An;
}
var Gu;
function zu() {
  if (Gu) return Jr;
  Gu = 1, Object.defineProperty(Jr, "__esModule", { value: !0 }), Jr.NsisUpdater = void 0;
  const r = Ye(), e = Be, t = zn(), n = Qc(), i = lr(), s = mt(), a = /* @__PURE__ */ zt(), u = Ph(), o = Gt;
  let f = class extends t.BaseUpdater {
    constructor(c, d) {
      super(c, d), this._verifyUpdateCodeSignature = (p, g) => (0, u.verifySignature)(p, g, this._logger);
    }
    /**
     * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
     * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
     */
    get verifyUpdateCodeSignature() {
      return this._verifyUpdateCodeSignature;
    }
    set verifyUpdateCodeSignature(c) {
      c && (this._verifyUpdateCodeSignature = c);
    }
    /*** @private */
    doDownloadUpdate(c) {
      const d = c.updateInfoAndProvider.provider, p = (0, s.findFile)(d.resolveFiles(c.updateInfoAndProvider.info), "exe");
      return this.executeDownload({
        fileExtension: "exe",
        downloadUpdateOptions: c,
        fileInfo: p,
        task: async (g, w, m, E) => {
          const C = p.packageInfo, N = C != null && m != null;
          if (N && c.disableWebInstaller)
            throw (0, r.newError)(`Unable to download new version ${c.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
          !N && !c.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (N || c.disableDifferentialDownload || await this.differentialDownloadInstaller(p, c, g, d, r.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(p.url, g, w);
          const O = await this.verifySignature(g);
          if (O != null)
            throw await E(), (0, r.newError)(`New version ${c.updateInfoAndProvider.info.version} is not signed by the application owner: ${O}`, "ERR_UPDATER_INVALID_SIGNATURE");
          if (N && await this.differentialDownloadWebPackage(c, C, m, d))
            try {
              await this.httpExecutor.download(new o.URL(C.path), m, {
                headers: c.requestHeaders,
                cancellationToken: c.cancellationToken,
                sha512: C.sha512
              });
            } catch (R) {
              try {
                await (0, a.unlink)(m);
              } catch {
              }
              throw R;
            }
        }
      });
    }
    // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
    // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
    // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
    async verifySignature(c) {
      let d;
      try {
        if (d = (await this.configOnDisk.value).publisherName, d == null)
          return null;
      } catch (p) {
        if (p.code === "ENOENT")
          return null;
        throw p;
      }
      return await this._verifyUpdateCodeSignature(Array.isArray(d) ? d : [d], c);
    }
    doInstall(c) {
      const d = this.installerPath;
      if (d == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const p = ["--updated"];
      c.isSilent && p.push("/S"), c.isForceRunAfter && p.push("--force-run"), this.installDirectory && p.push(`/D=${this.installDirectory}`);
      const g = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
      g != null && p.push(`--package-file=${g}`);
      const w = () => {
        this.spawnLog(e.join(process.resourcesPath, "elevate.exe"), [d].concat(p)).catch((m) => this.dispatchError(m));
      };
      return c.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), w(), !0) : (this.spawnLog(d, p).catch((m) => {
        const E = m.code;
        this._logger.info(`Cannot run installer: error code: ${E}, error message: "${m.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), E === "UNKNOWN" || E === "EACCES" ? w() : E === "ENOENT" ? nr.shell.openPath(d).catch((C) => this.dispatchError(C)) : this.dispatchError(m);
      }), !0);
    }
    async differentialDownloadWebPackage(c, d, p, g) {
      if (d.blockMapSize == null)
        return !0;
      try {
        const w = {
          newUrl: new o.URL(d.path),
          oldFile: e.join(this.downloadedUpdateHelper.cacheDir, r.CURRENT_APP_PACKAGE_FILE_NAME),
          logger: this._logger,
          newFile: p,
          requestHeaders: this.requestHeaders,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          cancellationToken: c.cancellationToken
        };
        this.listenerCount(i.DOWNLOAD_PROGRESS) > 0 && (w.onProgress = (m) => this.emit(i.DOWNLOAD_PROGRESS, m)), await new n.FileWithEmbeddedBlockMapDifferentialDownloader(d, this.httpExecutor, w).download();
      } catch (w) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${w.stack || w}`), process.platform === "win32";
      }
      return !1;
    }
  };
  return Jr.NsisUpdater = f, Jr;
}
var Vu;
function Dh() {
  return Vu || (Vu = 1, (function(r) {
    var e = Xt && Xt.__createBinding || (Object.create ? (function(m, E, C, N) {
      N === void 0 && (N = C);
      var O = Object.getOwnPropertyDescriptor(E, C);
      (!O || ("get" in O ? !E.__esModule : O.writable || O.configurable)) && (O = { enumerable: !0, get: function() {
        return E[C];
      } }), Object.defineProperty(m, N, O);
    }) : (function(m, E, C, N) {
      N === void 0 && (N = C), m[N] = E[C];
    })), t = Xt && Xt.__exportStar || function(m, E) {
      for (var C in m) C !== "default" && !Object.prototype.hasOwnProperty.call(E, C) && e(E, m, C);
    };
    Object.defineProperty(r, "__esModule", { value: !0 }), r.NsisUpdater = r.MacUpdater = r.RpmUpdater = r.PacmanUpdater = r.DebUpdater = r.AppImageUpdater = r.Provider = r.NoOpLogger = r.AppUpdater = r.BaseUpdater = void 0;
    const n = /* @__PURE__ */ zt(), i = Be;
    var s = zn();
    Object.defineProperty(r, "BaseUpdater", { enumerable: !0, get: function() {
      return s.BaseUpdater;
    } });
    var a = _a();
    Object.defineProperty(r, "AppUpdater", { enumerable: !0, get: function() {
      return a.AppUpdater;
    } }), Object.defineProperty(r, "NoOpLogger", { enumerable: !0, get: function() {
      return a.NoOpLogger;
    } });
    var u = mt();
    Object.defineProperty(r, "Provider", { enumerable: !0, get: function() {
      return u.Provider;
    } });
    var o = xu();
    Object.defineProperty(r, "AppImageUpdater", { enumerable: !0, get: function() {
      return o.AppImageUpdater;
    } });
    var f = qu();
    Object.defineProperty(r, "DebUpdater", { enumerable: !0, get: function() {
      return f.DebUpdater;
    } });
    var l = ku();
    Object.defineProperty(r, "PacmanUpdater", { enumerable: !0, get: function() {
      return l.PacmanUpdater;
    } });
    var c = Mu();
    Object.defineProperty(r, "RpmUpdater", { enumerable: !0, get: function() {
      return c.RpmUpdater;
    } });
    var d = Hu();
    Object.defineProperty(r, "MacUpdater", { enumerable: !0, get: function() {
      return d.MacUpdater;
    } });
    var p = zu();
    Object.defineProperty(r, "NsisUpdater", { enumerable: !0, get: function() {
      return p.NsisUpdater;
    } }), t(lr(), r);
    let g;
    function w() {
      if (process.platform === "win32")
        g = new (zu()).NsisUpdater();
      else if (process.platform === "darwin")
        g = new (Hu()).MacUpdater();
      else {
        g = new (xu()).AppImageUpdater();
        try {
          const m = i.join(process.resourcesPath, "package-type");
          if (!(0, n.existsSync)(m))
            return g;
          console.info("Checking for beta autoupdate feature for deb/rpm distributions");
          const E = (0, n.readFileSync)(m).toString().trim();
          switch (console.info("Found package-type:", E), E) {
            case "deb":
              g = new (qu()).DebUpdater();
              break;
            case "rpm":
              g = new (Mu()).RpmUpdater();
              break;
            case "pacman":
              g = new (ku()).PacmanUpdater();
              break;
            default:
              break;
          }
        } catch (m) {
          console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", m.message);
        }
      }
      return g;
    }
    Object.defineProperty(r, "autoUpdater", {
      enumerable: !0,
      get: () => g || w()
    });
  })(Xt)), Xt;
}
var Rn = Dh();
const te = /* @__PURE__ */ Symbol.for("drizzle:entityKind");
function Z(r, e) {
  if (!r || typeof r != "object")
    return !1;
  if (r instanceof e)
    return !0;
  if (!Object.prototype.hasOwnProperty.call(e, te))
    throw new Error(
      `Class "${e.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  let t = Object.getPrototypeOf(r).constructor;
  if (t)
    for (; t; ) {
      if (te in t && t[te] === e[te])
        return !0;
      t = Object.getPrototypeOf(t);
    }
  return !1;
}
class Lh {
  static [te] = "ConsoleLogWriter";
  write(e) {
    console.log(e);
  }
}
class xh {
  static [te] = "DefaultLogger";
  writer;
  constructor(e) {
    this.writer = e?.writer ?? new Lh();
  }
  logQuery(e, t) {
    const n = t.map((s) => {
      try {
        return JSON.stringify(s);
      } catch {
        return String(s);
      }
    }), i = n.length ? ` -- params: [${n.join(", ")}]` : "";
    this.writer.write(`Query: ${e}${i}`);
  }
}
class Fh {
  static [te] = "NoopLogger";
  logQuery() {
  }
}
const Ht = /* @__PURE__ */ Symbol.for("drizzle:Name"), Dn = /* @__PURE__ */ Symbol.for("drizzle:Schema"), Zs = /* @__PURE__ */ Symbol.for("drizzle:Columns"), Wu = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigColumns"), Ks = /* @__PURE__ */ Symbol.for("drizzle:OriginalName"), Js = /* @__PURE__ */ Symbol.for("drizzle:BaseName"), Ln = /* @__PURE__ */ Symbol.for("drizzle:IsAlias"), Yu = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigBuilder"), Uh = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleTable");
class ce {
  static [te] = "Table";
  /** @internal */
  static Symbol = {
    Name: Ht,
    Schema: Dn,
    OriginalName: Ks,
    Columns: Zs,
    ExtraConfigColumns: Wu,
    BaseName: Js,
    IsAlias: Ln,
    ExtraConfigBuilder: Yu
  };
  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [Ht];
  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [Ks];
  /** @internal */
  [Dn];
  /** @internal */
  [Zs];
  /** @internal */
  [Wu];
  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [Js];
  /** @internal */
  [Ln] = !1;
  /** @internal */
  [Uh] = !0;
  /** @internal */
  [Yu] = void 0;
  constructor(e, t, n) {
    this[Ht] = this[Ks] = e, this[Dn] = t, this[Js] = n;
  }
}
function Er(r) {
  return r[Ht];
}
function en(r) {
  return `${r[Dn] ?? "public"}.${r[Ht]}`;
}
class Ge {
  constructor(e, t) {
    this.table = e, this.config = t, this.name = t.name, this.keyAsName = t.keyAsName, this.notNull = t.notNull, this.default = t.default, this.defaultFn = t.defaultFn, this.onUpdateFn = t.onUpdateFn, this.hasDefault = t.hasDefault, this.primary = t.primaryKey, this.isUnique = t.isUnique, this.uniqueName = t.uniqueName, this.uniqueType = t.uniqueType, this.dataType = t.dataType, this.columnType = t.columnType, this.generated = t.generated, this.generatedIdentity = t.generatedIdentity;
  }
  static [te] = "Column";
  name;
  keyAsName;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = void 0;
  generated = void 0;
  generatedIdentity = void 0;
  config;
  mapFromDriverValue(e) {
    return e;
  }
  mapToDriverValue(e) {
    return e;
  }
  // ** @internal */
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
}
class qh {
  static [te] = "ColumnBuilder";
  config;
  constructor(e, t, n) {
    this.config = {
      name: e,
      keyAsName: e === "",
      notNull: !1,
      default: void 0,
      hasDefault: !1,
      primaryKey: !1,
      isUnique: !1,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType: t,
      columnType: n,
      generated: void 0
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    return this.config.notNull = !0, this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(e) {
    return this.config.default = e, this.config.hasDefault = !0, this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(e) {
    return this.config.defaultFn = e, this.config.hasDefault = !0, this;
  }
  /**
   * Alias for {@link $defaultFn}.
   */
  $default = this.$defaultFn;
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(e) {
    return this.config.onUpdateFn = e, this.config.hasDefault = !0, this;
  }
  /**
   * Alias for {@link $onUpdateFn}.
   */
  $onUpdate = this.$onUpdateFn;
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    return this.config.primaryKey = !0, this.config.notNull = !0, this;
  }
  /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
  setName(e) {
    this.config.name === "" && (this.config.name = e);
  }
}
const Ku = /* @__PURE__ */ Symbol.for("drizzle:isPgEnum");
function $h(r) {
  return !!r && typeof r == "function" && Ku in r && r[Ku] === !0;
}
class st {
  static [te] = "Subquery";
  constructor(e, t, n, i = !1, s = []) {
    this._ = {
      brand: "Subquery",
      sql: e,
      selectedFields: t,
      alias: n,
      isWith: i,
      usedTables: s
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
}
class Wc extends st {
  static [te] = "WithSubquery";
}
const kh = {
  startActiveSpan(r, e) {
    return e();
  }
}, tt = /* @__PURE__ */ Symbol.for("drizzle:ViewBaseConfig");
function Yc(r) {
  return r != null && typeof r.getSQL == "function";
}
function Bh(r) {
  const e = { sql: "", params: [] };
  for (const t of r)
    e.sql += t.sql, e.params.push(...t.params), t.typings?.length && (e.typings || (e.typings = []), e.typings.push(...t.typings));
  return e;
}
class Je {
  static [te] = "StringChunk";
  value;
  constructor(e) {
    this.value = Array.isArray(e) ? e : [e];
  }
  getSQL() {
    return new me([this]);
  }
}
class me {
  constructor(e) {
    this.queryChunks = e;
    for (const t of e)
      if (Z(t, ce)) {
        const n = t[ce.Symbol.Schema];
        this.usedTables.push(
          n === void 0 ? t[ce.Symbol.Name] : n + "." + t[ce.Symbol.Name]
        );
      }
  }
  static [te] = "SQL";
  /** @internal */
  decoder = Kc;
  shouldInlineParams = !1;
  /** @internal */
  usedTables = [];
  append(e) {
    return this.queryChunks.push(...e.queryChunks), this;
  }
  toQuery(e) {
    return kh.startActiveSpan("drizzle.buildSQL", (t) => {
      const n = this.buildQueryFromSourceParams(this.queryChunks, e);
      return t?.setAttributes({
        "drizzle.query.text": n.sql,
        "drizzle.query.params": JSON.stringify(n.params)
      }), n;
    });
  }
  buildQueryFromSourceParams(e, t) {
    const n = Object.assign({}, t, {
      inlineParams: t.inlineParams || this.shouldInlineParams,
      paramStartIndex: t.paramStartIndex || { value: 0 }
    }), {
      casing: i,
      escapeName: s,
      escapeParam: a,
      prepareTyping: u,
      inlineParams: o,
      paramStartIndex: f
    } = n;
    return Bh(e.map((l) => {
      if (Z(l, Je))
        return { sql: l.value.join(""), params: [] };
      if (Z(l, ea))
        return { sql: s(l.value), params: [] };
      if (l === void 0)
        return { sql: "", params: [] };
      if (Array.isArray(l)) {
        const c = [new Je("(")];
        for (const [d, p] of l.entries())
          c.push(p), d < l.length - 1 && c.push(new Je(", "));
        return c.push(new Je(")")), this.buildQueryFromSourceParams(c, n);
      }
      if (Z(l, me))
        return this.buildQueryFromSourceParams(l.queryChunks, {
          ...n,
          inlineParams: o || l.shouldInlineParams
        });
      if (Z(l, ce)) {
        const c = l[ce.Symbol.Schema], d = l[ce.Symbol.Name];
        return {
          sql: c === void 0 || l[Ln] ? s(d) : s(c) + "." + s(d),
          params: []
        };
      }
      if (Z(l, Ge)) {
        const c = i.getColumnCasing(l);
        if (t.invokeSource === "indexes")
          return { sql: s(c), params: [] };
        const d = l.table[ce.Symbol.Schema];
        return {
          sql: l.table[Ln] || d === void 0 ? s(l.table[ce.Symbol.Name]) + "." + s(c) : s(d) + "." + s(l.table[ce.Symbol.Name]) + "." + s(c),
          params: []
        };
      }
      if (Z(l, Ar)) {
        const c = l[tt].schema, d = l[tt].name;
        return {
          sql: c === void 0 || l[tt].isAlias ? s(d) : s(c) + "." + s(d),
          params: []
        };
      }
      if (Z(l, Qt)) {
        if (Z(l.value, br))
          return { sql: a(f.value++, l), params: [l], typings: ["none"] };
        const c = l.value === null ? null : l.encoder.mapToDriverValue(l.value);
        if (Z(c, me))
          return this.buildQueryFromSourceParams([c], n);
        if (o)
          return { sql: this.mapInlineParam(c, n), params: [] };
        let d = ["none"];
        return u && (d = [u(l.encoder)]), { sql: a(f.value++, c), params: [c], typings: d };
      }
      return Z(l, br) ? { sql: a(f.value++, l), params: [l], typings: ["none"] } : Z(l, me.Aliased) && l.fieldAlias !== void 0 ? { sql: s(l.fieldAlias), params: [] } : Z(l, st) ? l._.isWith ? { sql: s(l._.alias), params: [] } : this.buildQueryFromSourceParams([
        new Je("("),
        l._.sql,
        new Je(") "),
        new ea(l._.alias)
      ], n) : $h(l) ? l.schema ? { sql: s(l.schema) + "." + s(l.enumName), params: [] } : { sql: s(l.enumName), params: [] } : Yc(l) ? l.shouldOmitSQLParens?.() ? this.buildQueryFromSourceParams([l.getSQL()], n) : this.buildQueryFromSourceParams([
        new Je("("),
        l.getSQL(),
        new Je(")")
      ], n) : o ? { sql: this.mapInlineParam(l, n), params: [] } : { sql: a(f.value++, l), params: [l], typings: ["none"] };
    }));
  }
  mapInlineParam(e, { escapeString: t }) {
    if (e === null)
      return "null";
    if (typeof e == "number" || typeof e == "boolean")
      return e.toString();
    if (typeof e == "string")
      return t(e);
    if (typeof e == "object") {
      const n = e.toString();
      return t(n === "[object Object]" ? JSON.stringify(e) : n);
    }
    throw new Error("Unexpected param value: " + e);
  }
  getSQL() {
    return this;
  }
  as(e) {
    return e === void 0 ? this : new me.Aliased(this, e);
  }
  mapWith(e) {
    return this.decoder = typeof e == "function" ? { mapFromDriverValue: e } : e, this;
  }
  inlineParams() {
    return this.shouldInlineParams = !0, this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(e) {
    return e ? this : void 0;
  }
}
class ea {
  constructor(e) {
    this.value = e;
  }
  static [te] = "Name";
  brand;
  getSQL() {
    return new me([this]);
  }
}
function Mh(r) {
  return typeof r == "object" && r !== null && "mapToDriverValue" in r && typeof r.mapToDriverValue == "function";
}
const Kc = {
  mapFromDriverValue: (r) => r
}, Jc = {
  mapToDriverValue: (r) => r
};
({
  ...Kc,
  ...Jc
});
class Qt {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(e, t = Jc) {
    this.value = e, this.encoder = t;
  }
  static [te] = "Param";
  brand;
  getSQL() {
    return new me([this]);
  }
}
function $(r, ...e) {
  const t = [];
  (e.length > 0 || r.length > 0 && r[0] !== "") && t.push(new Je(r[0]));
  for (const [n, i] of e.entries())
    t.push(i, new Je(r[n + 1]));
  return new me(t);
}
((r) => {
  function e() {
    return new me([]);
  }
  r.empty = e;
  function t(o) {
    return new me(o);
  }
  r.fromList = t;
  function n(o) {
    return new me([new Je(o)]);
  }
  r.raw = n;
  function i(o, f) {
    const l = [];
    for (const [c, d] of o.entries())
      c > 0 && f !== void 0 && l.push(f), l.push(d);
    return new me(l);
  }
  r.join = i;
  function s(o) {
    return new ea(o);
  }
  r.identifier = s;
  function a(o) {
    return new br(o);
  }
  r.placeholder = a;
  function u(o, f) {
    return new Qt(o, f);
  }
  r.param = u;
})($ || ($ = {}));
((r) => {
  class e {
    constructor(n, i) {
      this.sql = n, this.fieldAlias = i;
    }
    static [te] = "SQL.Aliased";
    /** @internal */
    isSelectionField = !1;
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new e(this.sql, this.fieldAlias);
    }
  }
  r.Aliased = e;
})(me || (me = {}));
class br {
  constructor(e) {
    this.name = e;
  }
  static [te] = "Placeholder";
  getSQL() {
    return new me([this]);
  }
}
function Nn(r, e) {
  return r.map((t) => {
    if (Z(t, br)) {
      if (!(t.name in e))
        throw new Error(`No value for placeholder "${t.name}" was provided`);
      return e[t.name];
    }
    if (Z(t, Qt) && Z(t.value, br)) {
      if (!(t.value.name in e))
        throw new Error(`No value for placeholder "${t.value.name}" was provided`);
      return t.encoder.mapToDriverValue(e[t.value.name]);
    }
    return t;
  });
}
const jh = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleView");
class Ar {
  static [te] = "View";
  /** @internal */
  [tt];
  /** @internal */
  [jh] = !0;
  constructor({ name: e, schema: t, selectedFields: n, query: i }) {
    this[tt] = {
      name: e,
      originalName: e,
      schema: t,
      selectedFields: n,
      query: i,
      isExisting: !i,
      isAlias: !1
    };
  }
  getSQL() {
    return new me([this]);
  }
}
Ge.prototype.getSQL = function() {
  return new me([this]);
};
ce.prototype.getSQL = function() {
  return new me([this]);
};
st.prototype.getSQL = function() {
  return new me([this]);
};
function Ju(r, e, t) {
  const n = {}, i = r.reduce(
    (s, { path: a, field: u }, o) => {
      let f;
      Z(u, Ge) ? f = u : Z(u, me) ? f = u.decoder : Z(u, st) ? f = u._.sql.decoder : f = u.sql.decoder;
      let l = s;
      for (const [c, d] of a.entries())
        if (c < a.length - 1)
          d in l || (l[d] = {}), l = l[d];
        else {
          const p = e[o], g = l[d] = p === null ? null : f.mapFromDriverValue(p);
          if (t && Z(u, Ge) && a.length === 2) {
            const w = a[0];
            w in n ? typeof n[w] == "string" && n[w] !== Er(u.table) && (n[w] = !1) : n[w] = g === null ? Er(u.table) : !1;
          }
        }
      return s;
    },
    {}
  );
  if (t && Object.keys(n).length > 0)
    for (const [s, a] of Object.entries(n))
      typeof a == "string" && !t[a] && (i[s] = null);
  return i;
}
function ir(r, e) {
  return Object.entries(r).reduce((t, [n, i]) => {
    if (typeof n != "string")
      return t;
    const s = e ? [...e, n] : [n];
    return Z(i, Ge) || Z(i, me) || Z(i, me.Aliased) || Z(i, st) ? t.push({ path: s, field: i }) : Z(i, ce) ? t.push(...ir(i[ce.Symbol.Columns], s)) : t.push(...ir(i, s)), t;
  }, []);
}
function Ca(r, e) {
  const t = Object.keys(r), n = Object.keys(e);
  if (t.length !== n.length)
    return !1;
  for (const [i, s] of t.entries())
    if (s !== n[i])
      return !1;
  return !0;
}
function Xc(r, e) {
  const t = Object.entries(e).filter(([, n]) => n !== void 0).map(([n, i]) => Z(i, me) || Z(i, Ge) ? [n, i] : [n, new Qt(i, r[ce.Symbol.Columns][n])]);
  if (t.length === 0)
    throw new Error("No values to set");
  return Object.fromEntries(t);
}
function Hh(r, e) {
  for (const t of e)
    for (const n of Object.getOwnPropertyNames(t.prototype))
      n !== "constructor" && Object.defineProperty(
        r.prototype,
        n,
        Object.getOwnPropertyDescriptor(t.prototype, n) || /* @__PURE__ */ Object.create(null)
      );
}
function Qh(r) {
  return r[ce.Symbol.Columns];
}
function ta(r) {
  return Z(r, st) ? r._.alias : Z(r, Ar) ? r[tt].name : Z(r, me) ? void 0 : r[ce.Symbol.IsAlias] ? r[ce.Symbol.Name] : r[ce.Symbol.BaseName];
}
function on(r, e) {
  return {
    name: typeof r == "string" && r.length > 0 ? r : "",
    config: typeof r == "object" ? r : e
  };
}
const Zc = typeof TextDecoder > "u" ? null : new TextDecoder(), Xu = /* @__PURE__ */ Symbol.for("drizzle:PgInlineForeignKeys"), Zu = /* @__PURE__ */ Symbol.for("drizzle:EnableRLS");
class Gh extends ce {
  static [te] = "PgTable";
  /** @internal */
  static Symbol = Object.assign({}, ce.Symbol, {
    InlineForeignKeys: Xu,
    EnableRLS: Zu
  });
  /**@internal */
  [Xu] = [];
  /** @internal */
  [Zu] = !1;
  /** @internal */
  [ce.Symbol.ExtraConfigBuilder] = void 0;
  /** @internal */
  [ce.Symbol.ExtraConfigColumns] = {};
}
class zh {
  static [te] = "PgPrimaryKeyBuilder";
  /** @internal */
  columns;
  /** @internal */
  name;
  constructor(e, t) {
    this.columns = e, this.name = t;
  }
  /** @internal */
  build(e) {
    return new Vh(e, this.columns, this.name);
  }
}
class Vh {
  constructor(e, t, n) {
    this.table = e, this.columns = t, this.name = n;
  }
  static [te] = "PgPrimaryKey";
  columns;
  name;
  getName() {
    return this.name ?? `${this.table[Gh.Symbol.Name]}_${this.columns.map((e) => e.name).join("_")}_pk`;
  }
}
function ct(r, e) {
  return Mh(e) && !Yc(r) && !Z(r, Qt) && !Z(r, br) && !Z(r, Ge) && !Z(r, ce) && !Z(r, Ar) ? new Qt(r, e) : r;
}
const Ie = (r, e) => $`${r} = ${ct(e, r)}`, Wh = (r, e) => $`${r} <> ${ct(e, r)}`;
function ra(...r) {
  const e = r.filter(
    (t) => t !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new me(e) : new me([
      new Je("("),
      $.join(e, new Je(" and ")),
      new Je(")")
    ]);
}
function Yh(...r) {
  const e = r.filter(
    (t) => t !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new me(e) : new me([
      new Je("("),
      $.join(e, new Je(" or ")),
      new Je(")")
    ]);
}
function Kh(r) {
  return $`not ${r}`;
}
const Jh = (r, e) => $`${r} > ${ct(e, r)}`, Xh = (r, e) => $`${r} >= ${ct(e, r)}`, Zh = (r, e) => $`${r} < ${ct(e, r)}`, ep = (r, e) => $`${r} <= ${ct(e, r)}`;
function tp(r, e) {
  return Array.isArray(e) ? e.length === 0 ? $`false` : $`${r} in ${e.map((t) => ct(t, r))}` : $`${r} in ${ct(e, r)}`;
}
function rp(r, e) {
  return Array.isArray(e) ? e.length === 0 ? $`true` : $`${r} not in ${e.map((t) => ct(t, r))}` : $`${r} not in ${ct(e, r)}`;
}
function np(r) {
  return $`${r} is null`;
}
function ip(r) {
  return $`${r} is not null`;
}
function sp(r) {
  return $`exists ${r}`;
}
function ap(r) {
  return $`not exists ${r}`;
}
function op(r, e, t) {
  return $`${r} between ${ct(e, r)} and ${ct(
    t,
    r
  )}`;
}
function lp(r, e, t) {
  return $`${r} not between ${ct(
    e,
    r
  )} and ${ct(t, r)}`;
}
function up(r, e) {
  return $`${r} like ${e}`;
}
function cp(r, e) {
  return $`${r} not like ${e}`;
}
function fp(r, e) {
  return $`${r} ilike ${e}`;
}
function dp(r, e) {
  return $`${r} not ilike ${e}`;
}
function hp(r) {
  return $`${r} asc`;
}
function pp(r) {
  return $`${r} desc`;
}
class ef {
  constructor(e, t, n) {
    this.sourceTable = e, this.referencedTable = t, this.relationName = n, this.referencedTableName = t[ce.Symbol.Name];
  }
  static [te] = "Relation";
  referencedTableName;
  fieldName;
}
class mp {
  constructor(e, t) {
    this.table = e, this.config = t;
  }
  static [te] = "Relations";
}
class sr extends ef {
  constructor(e, t, n, i) {
    super(e, t, n?.relationName), this.config = n, this.isNullable = i;
  }
  static [te] = "One";
  withFieldName(e) {
    const t = new sr(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    return t.fieldName = e, t;
  }
}
class Vn extends ef {
  constructor(e, t, n) {
    super(e, t, n?.relationName), this.config = n;
  }
  static [te] = "Many";
  withFieldName(e) {
    const t = new Vn(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    return t.fieldName = e, t;
  }
}
function gp() {
  return {
    and: ra,
    between: op,
    eq: Ie,
    exists: sp,
    gt: Jh,
    gte: Xh,
    ilike: fp,
    inArray: tp,
    isNull: np,
    isNotNull: ip,
    like: up,
    lt: Zh,
    lte: ep,
    ne: Wh,
    not: Kh,
    notBetween: lp,
    notExists: ap,
    notLike: cp,
    notIlike: dp,
    notInArray: rp,
    or: Yh,
    sql: $
  };
}
function yp() {
  return {
    sql: $,
    asc: hp,
    desc: pp
  };
}
function wp(r, e) {
  Object.keys(r).length === 1 && "default" in r && !Z(r.default, ce) && (r = r.default);
  const t = {}, n = {}, i = {};
  for (const [s, a] of Object.entries(r))
    if (Z(a, ce)) {
      const u = en(a), o = n[u];
      t[u] = s, i[s] = {
        tsName: s,
        dbName: a[ce.Symbol.Name],
        schema: a[ce.Symbol.Schema],
        columns: a[ce.Symbol.Columns],
        relations: o?.relations ?? {},
        primaryKey: o?.primaryKey ?? []
      };
      for (const l of Object.values(
        a[ce.Symbol.Columns]
      ))
        l.primary && i[s].primaryKey.push(l);
      const f = a[ce.Symbol.ExtraConfigBuilder]?.(a[ce.Symbol.ExtraConfigColumns]);
      if (f)
        for (const l of Object.values(f))
          Z(l, zh) && i[s].primaryKey.push(...l.columns);
    } else if (Z(a, mp)) {
      const u = en(a.table), o = t[u], f = a.config(
        e(a.table)
      );
      let l;
      for (const [c, d] of Object.entries(f))
        if (o) {
          const p = i[o];
          p.relations[c] = d;
        } else
          u in n || (n[u] = {
            relations: {},
            primaryKey: l
          }), n[u].relations[c] = d;
    }
  return { tables: i, tableNamesMap: t };
}
function vp(r) {
  return function(t, n) {
    return new sr(
      r,
      t,
      n,
      n?.fields.reduce((i, s) => i && s.notNull, !0) ?? !1
    );
  };
}
function Ep(r) {
  return function(t, n) {
    return new Vn(r, t, n);
  };
}
function Sp(r, e, t) {
  if (Z(t, sr) && t.config)
    return {
      fields: t.config.fields,
      references: t.config.references
    };
  const n = e[en(t.referencedTable)];
  if (!n)
    throw new Error(
      `Table "${t.referencedTable[ce.Symbol.Name]}" not found in schema`
    );
  const i = r[n];
  if (!i)
    throw new Error(`Table "${n}" not found in schema`);
  const s = t.sourceTable, a = e[en(s)];
  if (!a)
    throw new Error(
      `Table "${s[ce.Symbol.Name]}" not found in schema`
    );
  const u = [];
  for (const o of Object.values(
    i.relations
  ))
    (t.relationName && t !== o && o.relationName === t.relationName || !t.relationName && o.referencedTable === t.sourceTable) && u.push(o);
  if (u.length > 1)
    throw t.relationName ? new Error(
      `There are multiple relations with name "${t.relationName}" in table "${n}"`
    ) : new Error(
      `There are multiple relations between "${n}" and "${t.sourceTable[ce.Symbol.Name]}". Please specify relation name`
    );
  if (u[0] && Z(u[0], sr) && u[0].config)
    return {
      fields: u[0].config.references,
      references: u[0].config.fields
    };
  throw new Error(
    `There is not enough information to infer relation "${a}.${t.fieldName}"`
  );
}
function bp(r) {
  return {
    one: vp(r),
    many: Ep(r)
  };
}
function na(r, e, t, n, i = (s) => s) {
  const s = {};
  for (const [
    a,
    u
  ] of n.entries())
    if (u.isJson) {
      const o = e.relations[u.tsKey], f = t[a], l = typeof f == "string" ? JSON.parse(f) : f;
      s[u.tsKey] = Z(o, sr) ? l && na(
        r,
        r[u.relationTableTsKey],
        l,
        u.selection,
        i
      ) : l.map(
        (c) => na(
          r,
          r[u.relationTableTsKey],
          c,
          u.selection,
          i
        )
      );
    } else {
      const o = i(t[a]), f = u.field;
      let l;
      Z(f, Ge) ? l = f : Z(f, me) ? l = f.decoder : l = f.sql.decoder, s[u.tsKey] = o === null ? null : l.mapFromDriverValue(o);
    }
  return s;
}
class xn {
  constructor(e) {
    this.table = e;
  }
  static [te] = "ColumnAliasProxyHandler";
  get(e, t) {
    return t === "table" ? this.table : e[t];
  }
}
class Aa {
  constructor(e, t) {
    this.alias = e, this.replaceOriginalName = t;
  }
  static [te] = "TableAliasProxyHandler";
  get(e, t) {
    if (t === ce.Symbol.IsAlias)
      return !0;
    if (t === ce.Symbol.Name)
      return this.alias;
    if (this.replaceOriginalName && t === ce.Symbol.OriginalName)
      return this.alias;
    if (t === tt)
      return {
        ...e[tt],
        name: this.alias,
        isAlias: !0
      };
    if (t === ce.Symbol.Columns) {
      const i = e[ce.Symbol.Columns];
      if (!i)
        return i;
      const s = {};
      return Object.keys(i).map((a) => {
        s[a] = new Proxy(
          i[a],
          new xn(new Proxy(e, this))
        );
      }), s;
    }
    const n = e[t];
    return Z(n, Ge) ? new Proxy(n, new xn(new Proxy(e, this))) : n;
  }
}
function Xs(r, e) {
  return new Proxy(r, new Aa(e, !1));
}
function Lt(r, e) {
  return new Proxy(
    r,
    new xn(new Proxy(r.table, new Aa(e, !1)))
  );
}
function tf(r, e) {
  return new me.Aliased(Fn(r.sql, e), r.fieldAlias);
}
function Fn(r, e) {
  return $.join(r.queryChunks.map((t) => Z(t, Ge) ? Lt(t, e) : Z(t, me) ? Fn(t, e) : Z(t, me.Aliased) ? tf(t, e) : t));
}
class nt {
  static [te] = "SelectionProxyHandler";
  config;
  constructor(e) {
    this.config = { ...e };
  }
  get(e, t) {
    if (t === "_")
      return {
        ...e._,
        selectedFields: new Proxy(
          e._.selectedFields,
          this
        )
      };
    if (t === tt)
      return {
        ...e[tt],
        selectedFields: new Proxy(
          e[tt].selectedFields,
          this
        )
      };
    if (typeof t == "symbol")
      return e[t];
    const i = (Z(e, st) ? e._.selectedFields : Z(e, Ar) ? e[tt].selectedFields : e)[t];
    if (Z(i, me.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !i.isSelectionField)
        return i.sql;
      const s = i.clone();
      return s.isSelectionField = !0, s;
    }
    if (Z(i, me)) {
      if (this.config.sqlBehavior === "sql")
        return i;
      throw new Error(
        `You tried to reference "${t}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    return Z(i, Ge) ? this.config.alias ? new Proxy(
      i,
      new xn(
        new Proxy(
          i.table,
          new Aa(this.config.alias, this.config.replaceOriginalName ?? !1)
        )
      )
    ) : i : typeof i != "object" || i === null ? i : new Proxy(i, new nt(this.config));
  }
}
class ur {
  static [te] = "QueryPromise";
  [Symbol.toStringTag] = "QueryPromise";
  catch(e) {
    return this.then(void 0, e);
  }
  finally(e) {
    return this.then(
      (t) => (e?.(), t),
      (t) => {
        throw e?.(), t;
      }
    );
  }
  then(e, t) {
    return this.execute().then(e, t);
  }
}
class _p {
  static [te] = "SQLiteForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate;
  /** @internal */
  _onDelete;
  constructor(e, t) {
    this.reference = () => {
      const { name: n, columns: i, foreignColumns: s } = e();
      return { name: n, columns: i, foreignTable: s[0].table, foreignColumns: s };
    }, t && (this._onUpdate = t.onUpdate, this._onDelete = t.onDelete);
  }
  onUpdate(e) {
    return this._onUpdate = e, this;
  }
  onDelete(e) {
    return this._onDelete = e, this;
  }
  /** @internal */
  build(e) {
    return new Tp(e, this);
  }
}
class Tp {
  constructor(e, t) {
    this.table = e, this.reference = t.reference, this.onUpdate = t._onUpdate, this.onDelete = t._onDelete;
  }
  static [te] = "SQLiteForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name: e, columns: t, foreignColumns: n } = this.reference(), i = t.map((u) => u.name), s = n.map((u) => u.name), a = [
      this.table[Ht],
      ...i,
      n[0].table[Ht],
      ...s
    ];
    return e ?? `${a.join("_")}_fk`;
  }
}
function Cp(r, e) {
  return `${r[Ht]}_${e.join("_")}_unique`;
}
class Ct extends qh {
  static [te] = "SQLiteColumnBuilder";
  foreignKeyConfigs = [];
  references(e, t = {}) {
    return this.foreignKeyConfigs.push({ ref: e, actions: t }), this;
  }
  unique(e) {
    return this.config.isUnique = !0, this.config.uniqueName = e, this;
  }
  generatedAlwaysAs(e, t) {
    return this.config.generated = {
      as: e,
      type: "always",
      mode: t?.mode ?? "virtual"
    }, this;
  }
  /** @internal */
  buildForeignKeys(e, t) {
    return this.foreignKeyConfigs.map(({ ref: n, actions: i }) => ((s, a) => {
      const u = new _p(() => {
        const o = s();
        return { columns: [e], foreignColumns: [o] };
      });
      return a.onUpdate && u.onUpdate(a.onUpdate), a.onDelete && u.onDelete(a.onDelete), u.build(t);
    })(n, i));
  }
}
class ut extends Ge {
  constructor(e, t) {
    t.uniqueName || (t.uniqueName = Cp(e, [t.name])), super(e, t), this.table = e;
  }
  static [te] = "SQLiteColumn";
}
class Ap extends Ct {
  static [te] = "SQLiteBigIntBuilder";
  constructor(e) {
    super(e, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(e) {
    return new Rp(e, this.config);
  }
}
class Rp extends ut {
  static [te] = "SQLiteBigInt";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const t = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return BigInt(t.toString("utf8"));
    }
    return BigInt(Zc.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(e.toString());
  }
}
class Np extends Ct {
  static [te] = "SQLiteBlobJsonBuilder";
  constructor(e) {
    super(e, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(e) {
    return new Op(
      e,
      this.config
    );
  }
}
class Op extends ut {
  static [te] = "SQLiteBlobJson";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const t = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return JSON.parse(t.toString("utf8"));
    }
    return JSON.parse(Zc.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(JSON.stringify(e));
  }
}
class Ip extends Ct {
  static [te] = "SQLiteBlobBufferBuilder";
  constructor(e) {
    super(e, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(e) {
    return new Pp(e, this.config);
  }
}
class Pp extends ut {
  static [te] = "SQLiteBlobBuffer";
  mapFromDriverValue(e) {
    return Buffer.isBuffer(e) ? e : Buffer.from(e);
  }
  getSQLType() {
    return "blob";
  }
}
function Dp(r, e) {
  const { name: t, config: n } = on(r, e);
  return n?.mode === "json" ? new Np(t) : n?.mode === "bigint" ? new Ap(t) : new Ip(t);
}
class Lp extends Ct {
  static [te] = "SQLiteCustomColumnBuilder";
  constructor(e, t, n) {
    super(e, "custom", "SQLiteCustomColumn"), this.config.fieldConfig = t, this.config.customTypeParams = n;
  }
  /** @internal */
  build(e) {
    return new xp(
      e,
      this.config
    );
  }
}
class xp extends ut {
  static [te] = "SQLiteCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(e, t) {
    super(e, t), this.sqlName = t.customTypeParams.dataType(t.fieldConfig), this.mapTo = t.customTypeParams.toDriver, this.mapFrom = t.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(e) {
    return typeof this.mapFrom == "function" ? this.mapFrom(e) : e;
  }
  mapToDriverValue(e) {
    return typeof this.mapTo == "function" ? this.mapTo(e) : e;
  }
}
function Fp(r) {
  return (e, t) => {
    const { name: n, config: i } = on(e, t);
    return new Lp(
      n,
      i,
      r
    );
  };
}
class Ra extends Ct {
  static [te] = "SQLiteBaseIntegerBuilder";
  constructor(e, t, n) {
    super(e, t, n), this.config.autoIncrement = !1;
  }
  primaryKey(e) {
    return e?.autoIncrement && (this.config.autoIncrement = !0), this.config.hasDefault = !0, super.primaryKey();
  }
}
class Na extends ut {
  static [te] = "SQLiteBaseInteger";
  autoIncrement = this.config.autoIncrement;
  getSQLType() {
    return "integer";
  }
}
class Up extends Ra {
  static [te] = "SQLiteIntegerBuilder";
  constructor(e) {
    super(e, "number", "SQLiteInteger");
  }
  build(e) {
    return new qp(
      e,
      this.config
    );
  }
}
class qp extends Na {
  static [te] = "SQLiteInteger";
}
class $p extends Ra {
  static [te] = "SQLiteTimestampBuilder";
  constructor(e, t) {
    super(e, "date", "SQLiteTimestamp"), this.config.mode = t;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default($`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(e) {
    return new kp(
      e,
      this.config
    );
  }
}
class kp extends Na {
  static [te] = "SQLiteTimestamp";
  mode = this.config.mode;
  mapFromDriverValue(e) {
    return this.config.mode === "timestamp" ? new Date(e * 1e3) : new Date(e);
  }
  mapToDriverValue(e) {
    const t = e.getTime();
    return this.config.mode === "timestamp" ? Math.floor(t / 1e3) : t;
  }
}
class Bp extends Ra {
  static [te] = "SQLiteBooleanBuilder";
  constructor(e, t) {
    super(e, "boolean", "SQLiteBoolean"), this.config.mode = t;
  }
  build(e) {
    return new Mp(
      e,
      this.config
    );
  }
}
class Mp extends Na {
  static [te] = "SQLiteBoolean";
  mode = this.config.mode;
  mapFromDriverValue(e) {
    return Number(e) === 1;
  }
  mapToDriverValue(e) {
    return e ? 1 : 0;
  }
}
function ze(r, e) {
  const { name: t, config: n } = on(r, e);
  return n?.mode === "timestamp" || n?.mode === "timestamp_ms" ? new $p(t, n.mode) : n?.mode === "boolean" ? new Bp(t, n.mode) : new Up(t);
}
class jp extends Ct {
  static [te] = "SQLiteNumericBuilder";
  constructor(e) {
    super(e, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(e) {
    return new Hp(
      e,
      this.config
    );
  }
}
class Hp extends ut {
  static [te] = "SQLiteNumeric";
  mapFromDriverValue(e) {
    return typeof e == "string" ? e : String(e);
  }
  getSQLType() {
    return "numeric";
  }
}
class Qp extends Ct {
  static [te] = "SQLiteNumericNumberBuilder";
  constructor(e) {
    super(e, "number", "SQLiteNumericNumber");
  }
  /** @internal */
  build(e) {
    return new Gp(
      e,
      this.config
    );
  }
}
class Gp extends ut {
  static [te] = "SQLiteNumericNumber";
  mapFromDriverValue(e) {
    return typeof e == "number" ? e : Number(e);
  }
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
}
class zp extends Ct {
  static [te] = "SQLiteNumericBigIntBuilder";
  constructor(e) {
    super(e, "bigint", "SQLiteNumericBigInt");
  }
  /** @internal */
  build(e) {
    return new Vp(
      e,
      this.config
    );
  }
}
class Vp extends ut {
  static [te] = "SQLiteNumericBigInt";
  mapFromDriverValue = BigInt;
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
}
function Wp(r, e) {
  const { name: t, config: n } = on(r, e), i = n?.mode;
  return i === "number" ? new Qp(t) : i === "bigint" ? new zp(t) : new jp(t);
}
class Yp extends Ct {
  static [te] = "SQLiteRealBuilder";
  constructor(e) {
    super(e, "number", "SQLiteReal");
  }
  /** @internal */
  build(e) {
    return new Kp(e, this.config);
  }
}
class Kp extends ut {
  static [te] = "SQLiteReal";
  getSQLType() {
    return "real";
  }
}
function it(r) {
  return new Yp(r ?? "");
}
class Jp extends Ct {
  static [te] = "SQLiteTextBuilder";
  constructor(e, t) {
    super(e, "string", "SQLiteText"), this.config.enumValues = t.enum, this.config.length = t.length;
  }
  /** @internal */
  build(e) {
    return new Xp(
      e,
      this.config
    );
  }
}
class Xp extends ut {
  static [te] = "SQLiteText";
  enumValues = this.config.enumValues;
  length = this.config.length;
  constructor(e, t) {
    super(e, t);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
}
class Zp extends Ct {
  static [te] = "SQLiteTextJsonBuilder";
  constructor(e) {
    super(e, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(e) {
    return new em(
      e,
      this.config
    );
  }
}
class em extends ut {
  static [te] = "SQLiteTextJson";
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(e) {
    return JSON.parse(e);
  }
  mapToDriverValue(e) {
    return JSON.stringify(e);
  }
}
function ke(r, e = {}) {
  const { name: t, config: n } = on(r, e);
  return n.mode === "json" ? new Zp(t) : new Jp(t, n);
}
function tm() {
  return {
    blob: Dp,
    customType: Fp,
    integer: ze,
    numeric: Wp,
    real: it,
    text: ke
  };
}
const ia = /* @__PURE__ */ Symbol.for("drizzle:SQLiteInlineForeignKeys");
class Et extends ce {
  static [te] = "SQLiteTable";
  /** @internal */
  static Symbol = Object.assign({}, ce.Symbol, {
    InlineForeignKeys: ia
  });
  /** @internal */
  [ce.Symbol.Columns];
  /** @internal */
  [ia] = [];
  /** @internal */
  [ce.Symbol.ExtraConfigBuilder] = void 0;
}
function rm(r, e, t, n, i = r) {
  const s = new Et(r, n, i), a = typeof e == "function" ? e(tm()) : e, u = Object.fromEntries(
    Object.entries(a).map(([f, l]) => {
      const c = l;
      c.setName(f);
      const d = c.build(s);
      return s[ia].push(...c.buildForeignKeys(d, s)), [f, d];
    })
  ), o = Object.assign(s, u);
  return o[ce.Symbol.Columns] = u, o[ce.Symbol.ExtraConfigColumns] = u, o;
}
const cr = (r, e, t) => rm(r, e);
function rr(r) {
  return Z(r, Et) ? [`${r[ce.Symbol.BaseName]}`] : Z(r, st) ? r._.usedTables ?? [] : Z(r, me) ? r.usedTables ?? [] : [];
}
class ec extends ur {
  constructor(e, t, n, i) {
    super(), this.table = e, this.session = t, this.dialect = n, this.config = { table: e, withList: i };
  }
  static [te] = "SQLiteDelete";
  /** @internal */
  config;
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(e) {
    return this.config.where = e, this;
  }
  orderBy(...e) {
    if (typeof e[0] == "function") {
      const t = e[0](
        new Proxy(
          this.config.table[ce.Symbol.Columns],
          new nt({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), n = Array.isArray(t) ? t : [t];
      this.config.orderBy = n;
    } else {
      const t = e;
      this.config.orderBy = t;
    }
    return this;
  }
  limit(e) {
    return this.config.limit = e, this;
  }
  returning(e = this.table[Et.Symbol.Columns]) {
    return this.config.returning = ir(e), this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: e, ...t } = this.dialect.sqlToQuery(this.getSQL());
    return t;
  }
  /** @internal */
  _prepare(e = !0) {
    return this.session[e ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0,
      void 0,
      {
        type: "delete",
        tables: rr(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  run = (e) => this._prepare().run(e);
  all = (e) => this._prepare().all(e);
  get = (e) => this._prepare().get(e);
  values = (e) => this._prepare().values(e);
  async execute(e) {
    return this._prepare().execute(e);
  }
  $dynamic() {
    return this;
  }
}
function nm(r) {
  return (r.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((t) => t.toLowerCase()).join("_");
}
function im(r) {
  return (r.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((t, n, i) => {
    const s = i === 0 ? n.toLowerCase() : `${n[0].toUpperCase()}${n.slice(1)}`;
    return t + s;
  }, "");
}
function sm(r) {
  return r;
}
class am {
  static [te] = "CasingCache";
  /** @internal */
  cache = {};
  cachedTables = {};
  convert;
  constructor(e) {
    this.convert = e === "snake_case" ? nm : e === "camelCase" ? im : sm;
  }
  getColumnCasing(e) {
    if (!e.keyAsName) return e.name;
    const t = e.table[ce.Symbol.Schema] ?? "public", n = e.table[ce.Symbol.OriginalName], i = `${t}.${n}.${e.name}`;
    return this.cache[i] || this.cacheTable(e.table), this.cache[i];
  }
  cacheTable(e) {
    const t = e[ce.Symbol.Schema] ?? "public", n = e[ce.Symbol.OriginalName], i = `${t}.${n}`;
    if (!this.cachedTables[i]) {
      for (const s of Object.values(e[ce.Symbol.Columns])) {
        const a = `${i}.${s.name}`;
        this.cache[a] = this.convert(s.name);
      }
      this.cachedTables[i] = !0;
    }
  }
  clearCache() {
    this.cache = {}, this.cachedTables = {};
  }
}
class Oa extends Error {
  static [te] = "DrizzleError";
  constructor({ message: e, cause: t }) {
    super(e), this.name = "DrizzleError", this.cause = t;
  }
}
class Bt extends Error {
  constructor(e, t, n) {
    super(`Failed query: ${e}
params: ${t}`), this.query = e, this.params = t, this.cause = n, Error.captureStackTrace(this, Bt), n && (this.cause = n);
  }
}
class om extends Oa {
  static [te] = "TransactionRollbackError";
  constructor() {
    super({ message: "Rollback" });
  }
}
class Ia extends Ar {
  static [te] = "SQLiteViewBase";
}
class sa {
  static [te] = "SQLiteDialect";
  /** @internal */
  casing;
  constructor(e) {
    this.casing = new am(e?.casing);
  }
  escapeName(e) {
    return `"${e}"`;
  }
  escapeParam(e) {
    return "?";
  }
  escapeString(e) {
    return `'${e.replace(/'/g, "''")}'`;
  }
  buildWithCTE(e) {
    if (!e?.length) return;
    const t = [$`with `];
    for (const [n, i] of e.entries())
      t.push($`${$.identifier(i._.alias)} as (${i._.sql})`), n < e.length - 1 && t.push($`, `);
    return t.push($` `), $.join(t);
  }
  buildDeleteQuery({ table: e, where: t, returning: n, withList: i, limit: s, orderBy: a }) {
    const u = this.buildWithCTE(i), o = n ? $` returning ${this.buildSelection(n, { isSingleTable: !0 })}` : void 0, f = t ? $` where ${t}` : void 0, l = this.buildOrderBy(a), c = this.buildLimit(s);
    return $`${u}delete from ${e}${f}${o}${l}${c}`;
  }
  buildUpdateSet(e, t) {
    const n = e[ce.Symbol.Columns], i = Object.keys(n).filter(
      (a) => t[a] !== void 0 || n[a]?.onUpdateFn !== void 0
    ), s = i.length;
    return $.join(i.flatMap((a, u) => {
      const o = n[a], f = o.onUpdateFn?.(), l = t[a] ?? (Z(f, me) ? f : $.param(f, o)), c = $`${$.identifier(this.casing.getColumnCasing(o))} = ${l}`;
      return u < s - 1 ? [c, $.raw(", ")] : [c];
    }));
  }
  buildUpdateQuery({ table: e, set: t, where: n, returning: i, withList: s, joins: a, from: u, limit: o, orderBy: f }) {
    const l = this.buildWithCTE(s), c = this.buildUpdateSet(e, t), d = u && $.join([$.raw(" from "), this.buildFromTable(u)]), p = this.buildJoins(a), g = i ? $` returning ${this.buildSelection(i, { isSingleTable: !0 })}` : void 0, w = n ? $` where ${n}` : void 0, m = this.buildOrderBy(f), E = this.buildLimit(o);
    return $`${l}update ${e} set ${c}${d}${p}${w}${g}${m}${E}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(e, { isSingleTable: t = !1 } = {}) {
    const n = e.length, i = e.flatMap(({ field: s }, a) => {
      const u = [];
      if (Z(s, me.Aliased) && s.isSelectionField)
        u.push($.identifier(s.fieldAlias));
      else if (Z(s, me.Aliased) || Z(s, me)) {
        const o = Z(s, me.Aliased) ? s.sql : s;
        t ? u.push(
          new me(
            o.queryChunks.map((f) => Z(f, Ge) ? $.identifier(this.casing.getColumnCasing(f)) : f)
          )
        ) : u.push(o), Z(s, me.Aliased) && u.push($` as ${$.identifier(s.fieldAlias)}`);
      } else if (Z(s, Ge)) {
        const o = s.table[ce.Symbol.Name];
        s.columnType === "SQLiteNumericBigInt" ? t ? u.push($`cast(${$.identifier(this.casing.getColumnCasing(s))} as text)`) : u.push(
          $`cast(${$.identifier(o)}.${$.identifier(this.casing.getColumnCasing(s))} as text)`
        ) : t ? u.push($.identifier(this.casing.getColumnCasing(s))) : u.push($`${$.identifier(o)}.${$.identifier(this.casing.getColumnCasing(s))}`);
      } else if (Z(s, st)) {
        const o = Object.entries(s._.selectedFields);
        if (o.length === 1) {
          const f = o[0][1], l = Z(f, me) ? f.decoder : Z(f, Ge) ? { mapFromDriverValue: (c) => f.mapFromDriverValue(c) } : f.sql.decoder;
          l && (s._.sql.decoder = l);
        }
        u.push(s);
      }
      return a < n - 1 && u.push($`, `), u;
    });
    return $.join(i);
  }
  buildJoins(e) {
    if (!e || e.length === 0)
      return;
    const t = [];
    if (e)
      for (const [n, i] of e.entries()) {
        n === 0 && t.push($` `);
        const s = i.table, a = i.on ? $` on ${i.on}` : void 0;
        if (Z(s, Et)) {
          const u = s[Et.Symbol.Name], o = s[Et.Symbol.Schema], f = s[Et.Symbol.OriginalName], l = u === f ? void 0 : i.alias;
          t.push(
            $`${$.raw(i.joinType)} join ${o ? $`${$.identifier(o)}.` : void 0}${$.identifier(f)}${l && $` ${$.identifier(l)}`}${a}`
          );
        } else
          t.push(
            $`${$.raw(i.joinType)} join ${s}${a}`
          );
        n < e.length - 1 && t.push($` `);
      }
    return $.join(t);
  }
  buildLimit(e) {
    return typeof e == "object" || typeof e == "number" && e >= 0 ? $` limit ${e}` : void 0;
  }
  buildOrderBy(e) {
    const t = [];
    if (e)
      for (const [n, i] of e.entries())
        t.push(i), n < e.length - 1 && t.push($`, `);
    return t.length > 0 ? $` order by ${$.join(t)}` : void 0;
  }
  buildFromTable(e) {
    return Z(e, ce) && e[ce.Symbol.IsAlias] ? $`${$`${$.identifier(e[ce.Symbol.Schema] ?? "")}.`.if(e[ce.Symbol.Schema])}${$.identifier(e[ce.Symbol.OriginalName])} ${$.identifier(e[ce.Symbol.Name])}` : e;
  }
  buildSelectQuery({
    withList: e,
    fields: t,
    fieldsFlat: n,
    where: i,
    having: s,
    table: a,
    joins: u,
    orderBy: o,
    groupBy: f,
    limit: l,
    offset: c,
    distinct: d,
    setOperators: p
  }) {
    const g = n ?? ir(t);
    for (const q of g)
      if (Z(q.field, Ge) && Er(q.field.table) !== (Z(a, st) ? a._.alias : Z(a, Ia) ? a[tt].name : Z(a, me) ? void 0 : Er(a)) && !((D) => u?.some(
        ({ alias: L }) => L === (D[ce.Symbol.IsAlias] ? Er(D) : D[ce.Symbol.BaseName])
      ))(q.field.table)) {
        const D = Er(q.field.table);
        throw new Error(
          `Your "${q.path.join("->")}" field references a column "${D}"."${q.field.name}", but the table "${D}" is not part of the query! Did you forget to join it?`
        );
      }
    const w = !u || u.length === 0, m = this.buildWithCTE(e), E = d ? $` distinct` : void 0, C = this.buildSelection(g, { isSingleTable: w }), N = this.buildFromTable(a), O = this.buildJoins(u), R = i ? $` where ${i}` : void 0, I = s ? $` having ${s}` : void 0, _ = [];
    if (f)
      for (const [q, D] of f.entries())
        _.push(D), q < f.length - 1 && _.push($`, `);
    const S = _.length > 0 ? $` group by ${$.join(_)}` : void 0, y = this.buildOrderBy(o), k = this.buildLimit(l), B = c ? $` offset ${c}` : void 0, F = $`${m}select${E} ${C} from ${N}${O}${R}${S}${I}${y}${k}${B}`;
    return p.length > 0 ? this.buildSetOperations(F, p) : F;
  }
  buildSetOperations(e, t) {
    const [n, ...i] = t;
    if (!n)
      throw new Error("Cannot pass undefined values to any set operator");
    return i.length === 0 ? this.buildSetOperationQuery({ leftSelect: e, setOperator: n }) : this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect: e, setOperator: n }),
      i
    );
  }
  buildSetOperationQuery({
    leftSelect: e,
    setOperator: { type: t, isAll: n, rightSelect: i, limit: s, orderBy: a, offset: u }
  }) {
    const o = $`${e.getSQL()} `, f = $`${i.getSQL()}`;
    let l;
    if (a && a.length > 0) {
      const g = [];
      for (const w of a)
        if (Z(w, ut))
          g.push($.identifier(w.name));
        else if (Z(w, me)) {
          for (let m = 0; m < w.queryChunks.length; m++) {
            const E = w.queryChunks[m];
            Z(E, ut) && (w.queryChunks[m] = $.identifier(this.casing.getColumnCasing(E)));
          }
          g.push($`${w}`);
        } else
          g.push($`${w}`);
      l = $` order by ${$.join(g, $`, `)}`;
    }
    const c = typeof s == "object" || typeof s == "number" && s >= 0 ? $` limit ${s}` : void 0, d = $.raw(`${t} ${n ? "all " : ""}`), p = u ? $` offset ${u}` : void 0;
    return $`${o}${d}${f}${l}${c}${p}`;
  }
  buildInsertQuery({ table: e, values: t, onConflict: n, returning: i, withList: s, select: a }) {
    const u = [], o = e[ce.Symbol.Columns], f = Object.entries(o).filter(
      ([w, m]) => !m.shouldDisableInsert()
    ), l = f.map(([, w]) => $.identifier(this.casing.getColumnCasing(w)));
    if (a) {
      const w = t;
      Z(w, me) ? u.push(w) : u.push(w.getSQL());
    } else {
      const w = t;
      u.push($.raw("values "));
      for (const [m, E] of w.entries()) {
        const C = [];
        for (const [N, O] of f) {
          const R = E[N];
          if (R === void 0 || Z(R, Qt) && R.value === void 0) {
            let I;
            if (O.default !== null && O.default !== void 0)
              I = Z(O.default, me) ? O.default : $.param(O.default, O);
            else if (O.defaultFn !== void 0) {
              const _ = O.defaultFn();
              I = Z(_, me) ? _ : $.param(_, O);
            } else if (!O.default && O.onUpdateFn !== void 0) {
              const _ = O.onUpdateFn();
              I = Z(_, me) ? _ : $.param(_, O);
            } else
              I = $`null`;
            C.push(I);
          } else
            C.push(R);
        }
        u.push(C), m < w.length - 1 && u.push($`, `);
      }
    }
    const c = this.buildWithCTE(s), d = $.join(u), p = i ? $` returning ${this.buildSelection(i, { isSingleTable: !0 })}` : void 0, g = n?.length ? $.join(n) : void 0;
    return $`${c}insert into ${e} ${l} ${d}${g}${p}`;
  }
  sqlToQuery(e, t) {
    return e.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      invokeSource: t
    });
  }
  buildRelationalQuery({
    fullSchema: e,
    schema: t,
    tableNamesMap: n,
    table: i,
    tableConfig: s,
    queryConfig: a,
    tableAlias: u,
    nestedQueryRelation: o,
    joinOn: f
  }) {
    let l = [], c, d, p = [], g;
    const w = [];
    if (a === !0)
      l = Object.entries(s.columns).map(([C, N]) => ({
        dbKey: N.name,
        tsKey: C,
        field: Lt(N, u),
        relationTableTsKey: void 0,
        isJson: !1,
        selection: []
      }));
    else {
      const E = Object.fromEntries(
        Object.entries(s.columns).map(([_, S]) => [_, Lt(S, u)])
      );
      if (a.where) {
        const _ = typeof a.where == "function" ? a.where(E, gp()) : a.where;
        g = _ && Fn(_, u);
      }
      const C = [];
      let N = [];
      if (a.columns) {
        let _ = !1;
        for (const [S, y] of Object.entries(a.columns))
          y !== void 0 && S in s.columns && (!_ && y === !0 && (_ = !0), N.push(S));
        N.length > 0 && (N = _ ? N.filter((S) => a.columns?.[S] === !0) : Object.keys(s.columns).filter((S) => !N.includes(S)));
      } else
        N = Object.keys(s.columns);
      for (const _ of N) {
        const S = s.columns[_];
        C.push({ tsKey: _, value: S });
      }
      let O = [];
      a.with && (O = Object.entries(a.with).filter((_) => !!_[1]).map(([_, S]) => ({ tsKey: _, queryConfig: S, relation: s.relations[_] })));
      let R;
      if (a.extras) {
        R = typeof a.extras == "function" ? a.extras(E, { sql: $ }) : a.extras;
        for (const [_, S] of Object.entries(R))
          C.push({
            tsKey: _,
            value: tf(S, u)
          });
      }
      for (const { tsKey: _, value: S } of C)
        l.push({
          dbKey: Z(S, me.Aliased) ? S.fieldAlias : s.columns[_].name,
          tsKey: _,
          field: Z(S, Ge) ? Lt(S, u) : S,
          relationTableTsKey: void 0,
          isJson: !1,
          selection: []
        });
      let I = typeof a.orderBy == "function" ? a.orderBy(E, yp()) : a.orderBy ?? [];
      Array.isArray(I) || (I = [I]), p = I.map((_) => Z(_, Ge) ? Lt(_, u) : Fn(_, u)), c = a.limit, d = a.offset;
      for (const {
        tsKey: _,
        queryConfig: S,
        relation: y
      } of O) {
        const k = Sp(t, n, y), B = en(y.referencedTable), F = n[B], q = `${u}_${_}`, D = ra(
          ...k.fields.map(
            (P, G) => Ie(
              Lt(k.references[G], q),
              Lt(P, u)
            )
          )
        ), L = this.buildRelationalQuery({
          fullSchema: e,
          schema: t,
          tableNamesMap: n,
          table: e[F],
          tableConfig: t[F],
          queryConfig: Z(y, sr) ? S === !0 ? { limit: 1 } : { ...S, limit: 1 } : S,
          tableAlias: q,
          joinOn: D,
          nestedQueryRelation: y
        }), Q = $`(${L.sql})`.as(_);
        l.push({
          dbKey: _,
          tsKey: _,
          field: Q,
          relationTableTsKey: F,
          isJson: !0,
          selection: L.selection
        });
      }
    }
    if (l.length === 0)
      throw new Oa({
        message: `No fields selected for table "${s.tsName}" ("${u}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    let m;
    if (g = ra(f, g), o) {
      let E = $`json_array(${$.join(
        l.map(
          ({ field: O }) => Z(O, ut) ? $.identifier(this.casing.getColumnCasing(O)) : Z(O, me.Aliased) ? O.sql : O
        ),
        $`, `
      )})`;
      Z(o, Vn) && (E = $`coalesce(json_group_array(${E}), json_array())`);
      const C = [{
        dbKey: "data",
        tsKey: "data",
        field: E.as("data"),
        isJson: !0,
        relationTableTsKey: s.tsName,
        selection: l
      }];
      c !== void 0 || d !== void 0 || p.length > 0 ? (m = this.buildSelectQuery({
        table: Xs(i, u),
        fields: {},
        fieldsFlat: [
          {
            path: [],
            field: $.raw("*")
          }
        ],
        where: g,
        limit: c,
        offset: d,
        orderBy: p,
        setOperators: []
      }), g = void 0, c = void 0, d = void 0, p = void 0) : m = Xs(i, u), m = this.buildSelectQuery({
        table: Z(m, Et) ? m : new st(m, {}, u),
        fields: {},
        fieldsFlat: C.map(({ field: O }) => ({
          path: [],
          field: Z(O, Ge) ? Lt(O, u) : O
        })),
        joins: w,
        where: g,
        limit: c,
        offset: d,
        orderBy: p,
        setOperators: []
      });
    } else
      m = this.buildSelectQuery({
        table: Xs(i, u),
        fields: {},
        fieldsFlat: l.map(({ field: E }) => ({
          path: [],
          field: Z(E, Ge) ? Lt(E, u) : E
        })),
        joins: w,
        where: g,
        limit: c,
        offset: d,
        orderBy: p,
        setOperators: []
      });
    return {
      tableTsKey: s.tsName,
      sql: m,
      selection: l
    };
  }
}
class rf extends sa {
  static [te] = "SQLiteSyncDialect";
  migrate(e, t, n) {
    const i = n === void 0 || typeof n == "string" ? "__drizzle_migrations" : n.migrationsTable ?? "__drizzle_migrations", s = $`
			CREATE TABLE IF NOT EXISTS ${$.identifier(i)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    t.run(s);
    const u = t.values(
      $`SELECT id, hash, created_at FROM ${$.identifier(i)} ORDER BY created_at DESC LIMIT 1`
    )[0] ?? void 0;
    t.run($`BEGIN`);
    try {
      for (const o of e)
        if (!u || Number(u[2]) < o.folderMillis) {
          for (const f of o.sql)
            t.run($.raw(f));
          t.run(
            $`INSERT INTO ${$.identifier(i)} ("hash", "created_at") VALUES(${o.hash}, ${o.folderMillis})`
          );
        }
      t.run($`COMMIT`);
    } catch (o) {
      throw t.run($`ROLLBACK`), o;
    }
  }
}
class lm {
  static [te] = "TypedQueryBuilder";
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
}
class Mt {
  static [te] = "SQLiteSelectBuilder";
  fields;
  session;
  dialect;
  withList;
  distinct;
  constructor(e) {
    this.fields = e.fields, this.session = e.session, this.dialect = e.dialect, this.withList = e.withList, this.distinct = e.distinct;
  }
  from(e) {
    const t = !!this.fields;
    let n;
    return this.fields ? n = this.fields : Z(e, st) ? n = Object.fromEntries(
      Object.keys(e._.selectedFields).map((i) => [i, e[i]])
    ) : Z(e, Ia) ? n = e[tt].selectedFields : Z(e, me) ? n = {} : n = Qh(e), new nf({
      table: e,
      fields: n,
      isPartialSelect: t,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
}
class um extends lm {
  static [te] = "SQLiteSelectQueryBuilder";
  _;
  /** @internal */
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  cacheConfig = void 0;
  usedTables = /* @__PURE__ */ new Set();
  constructor({ table: e, fields: t, isPartialSelect: n, session: i, dialect: s, withList: a, distinct: u }) {
    super(), this.config = {
      withList: a,
      table: e,
      fields: { ...t },
      distinct: u,
      setOperators: []
    }, this.isPartialSelect = n, this.session = i, this.dialect = s, this._ = {
      selectedFields: t,
      config: this.config
    }, this.tableName = ta(e), this.joinsNotNullableMap = typeof this.tableName == "string" ? { [this.tableName]: !0 } : {};
    for (const o of rr(e)) this.usedTables.add(o);
  }
  /** @internal */
  getUsedTables() {
    return [...this.usedTables];
  }
  createJoin(e) {
    return (t, n) => {
      const i = this.tableName, s = ta(t);
      for (const a of rr(t)) this.usedTables.add(a);
      if (typeof s == "string" && this.config.joins?.some((a) => a.alias === s))
        throw new Error(`Alias "${s}" is already used in this query`);
      if (!this.isPartialSelect && (Object.keys(this.joinsNotNullableMap).length === 1 && typeof i == "string" && (this.config.fields = {
        [i]: this.config.fields
      }), typeof s == "string" && !Z(t, me))) {
        const a = Z(t, st) ? t._.selectedFields : Z(t, Ar) ? t[tt].selectedFields : t[ce.Symbol.Columns];
        this.config.fields[s] = a;
      }
      if (typeof n == "function" && (n = n(
        new Proxy(
          this.config.fields,
          new nt({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      )), this.config.joins || (this.config.joins = []), this.config.joins.push({ on: n, table: t, joinType: e, alias: s }), typeof s == "string")
        switch (e) {
          case "left": {
            this.joinsNotNullableMap[s] = !1;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([a]) => [a, !1])
            ), this.joinsNotNullableMap[s] = !0;
            break;
          }
          case "cross":
          case "inner": {
            this.joinsNotNullableMap[s] = !0;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([a]) => [a, !1])
            ), this.joinsNotNullableMap[s] = !1;
            break;
          }
        }
      return this;
    };
  }
  /**
   * Executes a `left join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  leftJoin = this.createJoin("left");
  /**
   * Executes a `right join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  rightJoin = this.createJoin("right");
  /**
   * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  innerJoin = this.createJoin("inner");
  /**
   * Executes a `full join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  fullJoin = this.createJoin("full");
  /**
   * Executes a `cross join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
   *
   * @param table the table to join.
   *
   * @example
   *
   * ```ts
   * // Select all users, each user with every pet
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .crossJoin(pets)
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .crossJoin(pets)
   * ```
   */
  crossJoin = this.createJoin("cross");
  createSetOperator(e, t) {
    return (n) => {
      const i = typeof n == "function" ? n(cm()) : n;
      if (!Ca(this.getSelectedFields(), i.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      return this.config.setOperators.push({ type: e, isAll: t, rightSelect: i }), this;
    };
  }
  /**
   * Adds `union` set operator to the query.
   *
   * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
   *
   * @example
   *
   * ```ts
   * // Select all unique names from customers and users tables
   * await db.select({ name: users.name })
   *   .from(users)
   *   .union(
   *     db.select({ name: customers.name }).from(customers)
   *   );
   * // or
   * import { union } from 'drizzle-orm/sqlite-core'
   *
   * await union(
   *   db.select({ name: users.name }).from(users),
   *   db.select({ name: customers.name }).from(customers)
   * );
   * ```
   */
  union = this.createSetOperator("union", !1);
  /**
   * Adds `union all` set operator to the query.
   *
   * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
   *
   * @example
   *
   * ```ts
   * // Select all transaction ids from both online and in-store sales
   * await db.select({ transaction: onlineSales.transactionId })
   *   .from(onlineSales)
   *   .unionAll(
   *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   *   );
   * // or
   * import { unionAll } from 'drizzle-orm/sqlite-core'
   *
   * await unionAll(
   *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
   *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   * );
   * ```
   */
  unionAll = this.createSetOperator("union", !0);
  /**
   * Adds `intersect` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
   *
   * @example
   *
   * ```ts
   * // Select course names that are offered in both departments A and B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .intersect(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { intersect } from 'drizzle-orm/sqlite-core'
   *
   * await intersect(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  intersect = this.createSetOperator("intersect", !1);
  /**
   * Adds `except` set operator to the query.
   *
   * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
   *
   * @example
   *
   * ```ts
   * // Select all courses offered in department A but not in department B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .except(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { except } from 'drizzle-orm/sqlite-core'
   *
   * await except(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  except = this.createSetOperator("except", !1);
  /** @internal */
  addSetOperators(e) {
    return this.config.setOperators.push(...e), this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(e) {
    return typeof e == "function" && (e = e(
      new Proxy(
        this.config.fields,
        new nt({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.where = e, this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(e) {
    return typeof e == "function" && (e = e(
      new Proxy(
        this.config.fields,
        new nt({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.having = e, this;
  }
  groupBy(...e) {
    if (typeof e[0] == "function") {
      const t = e[0](
        new Proxy(
          this.config.fields,
          new nt({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(t) ? t : [t];
    } else
      this.config.groupBy = e;
    return this;
  }
  orderBy(...e) {
    if (typeof e[0] == "function") {
      const t = e[0](
        new Proxy(
          this.config.fields,
          new nt({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), n = Array.isArray(t) ? t : [t];
      this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = n : this.config.orderBy = n;
    } else {
      const t = e;
      this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = t : this.config.orderBy = t;
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(e) {
    return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).limit = e : this.config.limit = e, this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(e) {
    return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).offset = e : this.config.offset = e, this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: e, ...t } = this.dialect.sqlToQuery(this.getSQL());
    return t;
  }
  as(e) {
    const t = [];
    if (t.push(...rr(this.config.table)), this.config.joins)
      for (const n of this.config.joins) t.push(...rr(n.table));
    return new Proxy(
      new st(this.getSQL(), this.config.fields, e, !1, [...new Set(t)]),
      new nt({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new nt({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
}
class nf extends um {
  static [te] = "SQLiteSelect";
  /** @internal */
  _prepare(e = !0) {
    if (!this.session)
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    const t = ir(this.config.fields), n = this.session[e ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      t,
      "all",
      !0,
      void 0,
      {
        type: "select",
        tables: [...this.usedTables]
      },
      this.cacheConfig
    );
    return n.joinsNotNullableMap = this.joinsNotNullableMap, n;
  }
  $withCache(e) {
    return this.cacheConfig = e === void 0 ? { config: {}, enable: !0, autoInvalidate: !0 } : e === !1 ? { enable: !1 } : { enable: !0, autoInvalidate: !0, ...e }, this;
  }
  prepare() {
    return this._prepare(!1);
  }
  run = (e) => this._prepare().run(e);
  all = (e) => this._prepare().all(e);
  get = (e) => this._prepare().get(e);
  values = (e) => this._prepare().values(e);
  async execute() {
    return this.all();
  }
}
Hh(nf, [ur]);
function Wn(r, e) {
  return (t, n, ...i) => {
    const s = [n, ...i].map((a) => ({
      type: r,
      isAll: e,
      rightSelect: a
    }));
    for (const a of s)
      if (!Ca(t.getSelectedFields(), a.rightSelect.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
    return t.addSetOperators(s);
  };
}
const cm = () => ({
  union: fm,
  unionAll: dm,
  intersect: hm,
  except: pm
}), fm = Wn("union", !1), dm = Wn("union", !0), hm = Wn("intersect", !1), pm = Wn("except", !1);
class sf {
  static [te] = "SQLiteQueryBuilder";
  dialect;
  dialectConfig;
  constructor(e) {
    this.dialect = Z(e, sa) ? e : void 0, this.dialectConfig = Z(e, sa) ? void 0 : e;
  }
  $with = (e, t) => {
    const n = this;
    return { as: (s) => (typeof s == "function" && (s = s(n)), new Proxy(
      new Wc(
        s.getSQL(),
        t ?? ("getSelectedFields" in s ? s.getSelectedFields() ?? {} : {}),
        e,
        !0
      ),
      new nt({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    )) };
  };
  with(...e) {
    const t = this;
    function n(s) {
      return new Mt({
        fields: s ?? void 0,
        session: void 0,
        dialect: t.getDialect(),
        withList: e
      });
    }
    function i(s) {
      return new Mt({
        fields: s ?? void 0,
        session: void 0,
        dialect: t.getDialect(),
        withList: e,
        distinct: !0
      });
    }
    return { select: n, selectDistinct: i };
  }
  select(e) {
    return new Mt({ fields: e ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(e) {
    return new Mt({
      fields: e ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: !0
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    return this.dialect || (this.dialect = new rf(this.dialectConfig)), this.dialect;
  }
}
class tc {
  constructor(e, t, n, i) {
    this.table = e, this.session = t, this.dialect = n, this.withList = i;
  }
  static [te] = "SQLiteInsertBuilder";
  values(e) {
    if (e = Array.isArray(e) ? e : [e], e.length === 0)
      throw new Error("values() must be called with at least one value");
    const t = e.map((n) => {
      const i = {}, s = this.table[ce.Symbol.Columns];
      for (const a of Object.keys(n)) {
        const u = n[a];
        i[a] = Z(u, me) ? u : new Qt(u, s[a]);
      }
      return i;
    });
    return new rc(this.table, t, this.session, this.dialect, this.withList);
  }
  select(e) {
    const t = typeof e == "function" ? e(new sf()) : e;
    if (!Z(t, me) && !Ca(this.table[Zs], t._.selectedFields))
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    return new rc(this.table, t, this.session, this.dialect, this.withList, !0);
  }
}
class rc extends ur {
  constructor(e, t, n, i, s, a) {
    super(), this.session = n, this.dialect = i, this.config = { table: e, values: t, withList: s, select: a };
  }
  static [te] = "SQLiteInsert";
  /** @internal */
  config;
  returning(e = this.config.table[Et.Symbol.Columns]) {
    return this.config.returning = ir(e), this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(e = {}) {
    if (this.config.onConflict || (this.config.onConflict = []), e.target === void 0)
      this.config.onConflict.push($` on conflict do nothing`);
    else {
      const t = Array.isArray(e.target) ? $`${e.target}` : $`${[e.target]}`, n = e.where ? $` where ${e.where}` : $``;
      this.config.onConflict.push($` on conflict ${t} do nothing${n}`);
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(e) {
    if (e.where && (e.targetWhere || e.setWhere))
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    this.config.onConflict || (this.config.onConflict = []);
    const t = e.where ? $` where ${e.where}` : void 0, n = e.targetWhere ? $` where ${e.targetWhere}` : void 0, i = e.setWhere ? $` where ${e.setWhere}` : void 0, s = Array.isArray(e.target) ? $`${e.target}` : $`${[e.target]}`, a = this.dialect.buildUpdateSet(this.config.table, Xc(this.config.table, e.set));
    return this.config.onConflict.push(
      $` on conflict ${s}${n} do update set ${a}${t}${i}`
    ), this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: e, ...t } = this.dialect.sqlToQuery(this.getSQL());
    return t;
  }
  /** @internal */
  _prepare(e = !0) {
    return this.session[e ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0,
      void 0,
      {
        type: "insert",
        tables: rr(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  run = (e) => this._prepare().run(e);
  all = (e) => this._prepare().all(e);
  get = (e) => this._prepare().get(e);
  values = (e) => this._prepare().values(e);
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
}
class nc {
  constructor(e, t, n, i) {
    this.table = e, this.session = t, this.dialect = n, this.withList = i;
  }
  static [te] = "SQLiteUpdateBuilder";
  set(e) {
    return new mm(
      this.table,
      Xc(this.table, e),
      this.session,
      this.dialect,
      this.withList
    );
  }
}
class mm extends ur {
  constructor(e, t, n, i, s) {
    super(), this.session = n, this.dialect = i, this.config = { set: t, table: e, withList: s, joins: [] };
  }
  static [te] = "SQLiteUpdate";
  /** @internal */
  config;
  from(e) {
    return this.config.from = e, this;
  }
  createJoin(e) {
    return (t, n) => {
      const i = ta(t);
      if (typeof i == "string" && this.config.joins.some((s) => s.alias === i))
        throw new Error(`Alias "${i}" is already used in this query`);
      if (typeof n == "function") {
        const s = this.config.from ? Z(t, Et) ? t[ce.Symbol.Columns] : Z(t, st) ? t._.selectedFields : Z(t, Ia) ? t[tt].selectedFields : void 0 : void 0;
        n = n(
          new Proxy(
            this.config.table[ce.Symbol.Columns],
            new nt({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          s && new Proxy(
            s,
            new nt({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      return this.config.joins.push({ on: n, table: t, joinType: e, alias: i }), this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(e) {
    return this.config.where = e, this;
  }
  orderBy(...e) {
    if (typeof e[0] == "function") {
      const t = e[0](
        new Proxy(
          this.config.table[ce.Symbol.Columns],
          new nt({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), n = Array.isArray(t) ? t : [t];
      this.config.orderBy = n;
    } else {
      const t = e;
      this.config.orderBy = t;
    }
    return this;
  }
  limit(e) {
    return this.config.limit = e, this;
  }
  returning(e = this.config.table[Et.Symbol.Columns]) {
    return this.config.returning = ir(e), this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: e, ...t } = this.dialect.sqlToQuery(this.getSQL());
    return t;
  }
  /** @internal */
  _prepare(e = !0) {
    return this.session[e ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0,
      void 0,
      {
        type: "insert",
        tables: rr(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  run = (e) => this._prepare().run(e);
  all = (e) => this._prepare().all(e);
  get = (e) => this._prepare().get(e);
  values = (e) => this._prepare().values(e);
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
}
class Un extends me {
  constructor(e) {
    super(Un.buildEmbeddedCount(e.source, e.filters).queryChunks), this.params = e, this.session = e.session, this.sql = Un.buildCount(
      e.source,
      e.filters
    );
  }
  sql;
  static [te] = "SQLiteCountBuilderAsync";
  [Symbol.toStringTag] = "SQLiteCountBuilderAsync";
  session;
  static buildEmbeddedCount(e, t) {
    return $`(select count(*) from ${e}${$.raw(" where ").if(t)}${t})`;
  }
  static buildCount(e, t) {
    return $`select count(*) from ${e}${$.raw(" where ").if(t)}${t}`;
  }
  then(e, t) {
    return Promise.resolve(this.session.count(this.sql)).then(
      e,
      t
    );
  }
  catch(e) {
    return this.then(void 0, e);
  }
  finally(e) {
    return this.then(
      (t) => (e?.(), t),
      (t) => {
        throw e?.(), t;
      }
    );
  }
}
class gm {
  constructor(e, t, n, i, s, a, u, o) {
    this.mode = e, this.fullSchema = t, this.schema = n, this.tableNamesMap = i, this.table = s, this.tableConfig = a, this.dialect = u, this.session = o;
  }
  static [te] = "SQLiteAsyncRelationalQueryBuilder";
  findMany(e) {
    return this.mode === "sync" ? new ic(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e || {},
      "many"
    ) : new aa(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e || {},
      "many"
    );
  }
  findFirst(e) {
    return this.mode === "sync" ? new ic(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e ? { ...e, limit: 1 } : { limit: 1 },
      "first"
    ) : new aa(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e ? { ...e, limit: 1 } : { limit: 1 },
      "first"
    );
  }
}
class aa extends ur {
  constructor(e, t, n, i, s, a, u, o, f) {
    super(), this.fullSchema = e, this.schema = t, this.tableNamesMap = n, this.table = i, this.tableConfig = s, this.dialect = a, this.session = u, this.config = o, this.mode = f;
  }
  static [te] = "SQLiteAsyncRelationalQuery";
  /** @internal */
  mode;
  /** @internal */
  getSQL() {
    return this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }).sql;
  }
  /** @internal */
  _prepare(e = !1) {
    const { query: t, builtQuery: n } = this._toSQL();
    return this.session[e ? "prepareOneTimeQuery" : "prepareQuery"](
      n,
      void 0,
      this.mode === "first" ? "get" : "all",
      !0,
      (i, s) => {
        const a = i.map(
          (u) => na(this.schema, this.tableConfig, u, t.selection, s)
        );
        return this.mode === "first" ? a[0] : a;
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  _toSQL() {
    const e = this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }), t = this.dialect.sqlToQuery(e.sql);
    return { query: e, builtQuery: t };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  /** @internal */
  executeRaw() {
    return this.mode === "first" ? this._prepare(!1).get() : this._prepare(!1).all();
  }
  async execute() {
    return this.executeRaw();
  }
}
class ic extends aa {
  static [te] = "SQLiteSyncRelationalQuery";
  sync() {
    return this.executeRaw();
  }
}
class On extends ur {
  constructor(e, t, n, i, s) {
    super(), this.execute = e, this.getSQL = t, this.dialect = i, this.mapBatchResult = s, this.config = { action: n };
  }
  static [te] = "SQLiteRaw";
  /** @internal */
  config;
  getQuery() {
    return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
  }
  mapResult(e, t) {
    return t ? this.mapBatchResult(e) : e;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return !1;
  }
}
class af {
  constructor(e, t, n, i) {
    this.resultKind = e, this.dialect = t, this.session = n, this._ = i ? {
      schema: i.schema,
      fullSchema: i.fullSchema,
      tableNamesMap: i.tableNamesMap
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {}
    }, this.query = {};
    const s = this.query;
    if (this._.schema)
      for (const [a, u] of Object.entries(this._.schema))
        s[a] = new gm(
          e,
          i.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          i.fullSchema[a],
          u,
          t,
          n
        );
    this.$cache = { invalidate: async (a) => {
    } };
  }
  static [te] = "BaseSQLiteDatabase";
  query;
  /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */
  $with = (e, t) => {
    const n = this;
    return { as: (s) => (typeof s == "function" && (s = s(new sf(n.dialect))), new Proxy(
      new Wc(
        s.getSQL(),
        t ?? ("getSelectedFields" in s ? s.getSelectedFields() ?? {} : {}),
        e,
        !0
      ),
      new nt({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    )) };
  };
  $count(e, t) {
    return new Un({ source: e, filters: t, session: this.session });
  }
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...e) {
    const t = this;
    function n(o) {
      return new Mt({
        fields: o ?? void 0,
        session: t.session,
        dialect: t.dialect,
        withList: e
      });
    }
    function i(o) {
      return new Mt({
        fields: o ?? void 0,
        session: t.session,
        dialect: t.dialect,
        withList: e,
        distinct: !0
      });
    }
    function s(o) {
      return new nc(o, t.session, t.dialect, e);
    }
    function a(o) {
      return new tc(o, t.session, t.dialect, e);
    }
    function u(o) {
      return new ec(o, t.session, t.dialect, e);
    }
    return { select: n, selectDistinct: i, update: s, insert: a, delete: u };
  }
  select(e) {
    return new Mt({ fields: e ?? void 0, session: this.session, dialect: this.dialect });
  }
  selectDistinct(e) {
    return new Mt({
      fields: e ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: !0
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(e) {
    return new nc(e, this.session, this.dialect);
  }
  $cache;
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(e) {
    return new tc(e, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(e) {
    return new ec(e, this.session, this.dialect);
  }
  run(e) {
    const t = typeof e == "string" ? $.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new On(
      async () => this.session.run(t),
      () => t,
      "run",
      this.dialect,
      this.session.extractRawRunValueFromBatchResult.bind(this.session)
    ) : this.session.run(t);
  }
  all(e) {
    const t = typeof e == "string" ? $.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new On(
      async () => this.session.all(t),
      () => t,
      "all",
      this.dialect,
      this.session.extractRawAllValueFromBatchResult.bind(this.session)
    ) : this.session.all(t);
  }
  get(e) {
    const t = typeof e == "string" ? $.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new On(
      async () => this.session.get(t),
      () => t,
      "get",
      this.dialect,
      this.session.extractRawGetValueFromBatchResult.bind(this.session)
    ) : this.session.get(t);
  }
  values(e) {
    const t = typeof e == "string" ? $.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new On(
      async () => this.session.values(t),
      () => t,
      "values",
      this.dialect,
      this.session.extractRawValuesValueFromBatchResult.bind(this.session)
    ) : this.session.values(t);
  }
  transaction(e, t) {
    return this.session.transaction(e, t);
  }
}
class ym {
  static [te] = "Cache";
}
class wm extends ym {
  strategy() {
    return "all";
  }
  static [te] = "NoopCache";
  async get(e) {
  }
  async put(e, t, n, i) {
  }
  async onMutate(e) {
  }
}
async function sc(r, e) {
  const t = `${r}-${JSON.stringify(e)}`, i = new TextEncoder().encode(t), s = await crypto.subtle.digest("SHA-256", i);
  return [...new Uint8Array(s)].map((o) => o.toString(16).padStart(2, "0")).join("");
}
class vm extends ur {
  constructor(e) {
    super(), this.resultCb = e;
  }
  static [te] = "ExecuteResultSync";
  async execute() {
    return this.resultCb();
  }
  sync() {
    return this.resultCb();
  }
}
class Em {
  constructor(e, t, n, i, s, a) {
    this.mode = e, this.executeMethod = t, this.query = n, this.cache = i, this.queryMetadata = s, this.cacheConfig = a, i && i.strategy() === "all" && a === void 0 && (this.cacheConfig = { enable: !0, autoInvalidate: !0 }), this.cacheConfig?.enable || (this.cacheConfig = void 0);
  }
  static [te] = "PreparedQuery";
  /** @internal */
  joinsNotNullableMap;
  /** @internal */
  async queryWithCache(e, t, n) {
    if (this.cache === void 0 || Z(this.cache, wm) || this.queryMetadata === void 0)
      try {
        return await n();
      } catch (i) {
        throw new Bt(e, t, i);
      }
    if (this.cacheConfig && !this.cacheConfig.enable)
      try {
        return await n();
      } catch (i) {
        throw new Bt(e, t, i);
      }
    if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0)
      try {
        const [i] = await Promise.all([
          n(),
          this.cache.onMutate({ tables: this.queryMetadata.tables })
        ]);
        return i;
      } catch (i) {
        throw new Bt(e, t, i);
      }
    if (!this.cacheConfig)
      try {
        return await n();
      } catch (i) {
        throw new Bt(e, t, i);
      }
    if (this.queryMetadata.type === "select") {
      const i = await this.cache.get(
        this.cacheConfig.tag ?? await sc(e, t),
        this.queryMetadata.tables,
        this.cacheConfig.tag !== void 0,
        this.cacheConfig.autoInvalidate
      );
      if (i === void 0) {
        let s;
        try {
          s = await n();
        } catch (a) {
          throw new Bt(e, t, a);
        }
        return await this.cache.put(
          this.cacheConfig.tag ?? await sc(e, t),
          s,
          // make sure we send tables that were used in a query only if user wants to invalidate it on each write
          this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [],
          this.cacheConfig.tag !== void 0,
          this.cacheConfig.config
        ), s;
      }
      return i;
    }
    try {
      return await n();
    } catch (i) {
      throw new Bt(e, t, i);
    }
  }
  getQuery() {
    return this.query;
  }
  mapRunResult(e, t) {
    return e;
  }
  mapAllResult(e, t) {
    throw new Error("Not implemented");
  }
  mapGetResult(e, t) {
    throw new Error("Not implemented");
  }
  execute(e) {
    return this.mode === "async" ? this[this.executeMethod](e) : new vm(() => this[this.executeMethod](e));
  }
  mapResult(e, t) {
    switch (this.executeMethod) {
      case "run":
        return this.mapRunResult(e, t);
      case "all":
        return this.mapAllResult(e, t);
      case "get":
        return this.mapGetResult(e, t);
    }
  }
}
class Sm {
  constructor(e) {
    this.dialect = e;
  }
  static [te] = "SQLiteSession";
  prepareOneTimeQuery(e, t, n, i, s, a, u) {
    return this.prepareQuery(
      e,
      t,
      n,
      i,
      s,
      a,
      u
    );
  }
  run(e) {
    const t = this.dialect.sqlToQuery(e);
    try {
      return this.prepareOneTimeQuery(t, void 0, "run", !1).run();
    } catch (n) {
      throw new Oa({ cause: n, message: `Failed to run the query '${t.sql}'` });
    }
  }
  /** @internal */
  extractRawRunValueFromBatchResult(e) {
    return e;
  }
  all(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).all();
  }
  /** @internal */
  extractRawAllValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
  get(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).get();
  }
  /** @internal */
  extractRawGetValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
  values(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).values();
  }
  async count(e) {
    return (await this.values(e))[0][0];
  }
  /** @internal */
  extractRawValuesValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
}
class bm extends af {
  constructor(e, t, n, i, s = 0) {
    super(e, t, n, i), this.schema = i, this.nestedIndex = s;
  }
  static [te] = "SQLiteTransaction";
  rollback() {
    throw new om();
  }
}
class _m extends Sm {
  constructor(e, t, n, i = {}) {
    super(t), this.client = e, this.schema = n, this.logger = i.logger ?? new Fh();
  }
  static [te] = "SQLJsSession";
  logger;
  prepareQuery(e, t, n, i) {
    return new Tm(this.client, e, this.logger, t, n, i);
  }
  transaction(e, t = {}) {
    const n = new Pa("sync", this.dialect, this, this.schema);
    this.run($.raw(`begin${t.behavior ? ` ${t.behavior}` : ""}`));
    try {
      const i = e(n);
      return this.run($`commit`), i;
    } catch (i) {
      throw this.run($`rollback`), i;
    }
  }
}
class Pa extends bm {
  static [te] = "SQLJsTransaction";
  transaction(e) {
    const t = `sp${this.nestedIndex + 1}`, n = new Pa("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    n.run($.raw(`savepoint ${t}`));
    try {
      const i = e(n);
      return n.run($.raw(`release savepoint ${t}`)), i;
    } catch (i) {
      throw n.run($.raw(`rollback to savepoint ${t}`)), i;
    }
  }
}
class Tm extends Em {
  constructor(e, t, n, i, s, a, u) {
    super("sync", s, t), this.client = e, this.logger = n, this.fields = i, this._isResponseInArrayMode = a, this.customResultMapper = u;
  }
  static [te] = "SQLJsPreparedQuery";
  run(e) {
    const t = this.client.prepare(this.query.sql), n = Nn(this.query.params, e ?? {});
    this.logger.logQuery(this.query.sql, n);
    const i = t.run(n);
    return t.free(), i;
  }
  all(e) {
    const t = this.client.prepare(this.query.sql), { fields: n, joinsNotNullableMap: i, logger: s, query: a, customResultMapper: u } = this;
    if (!n && !u) {
      const f = Nn(a.params, e ?? {});
      s.logQuery(a.sql, f), t.bind(f);
      const l = [];
      for (; t.step(); )
        l.push(t.getAsObject());
      return t.free(), l;
    }
    const o = this.values(e);
    return u ? u(o, In) : o.map((f) => Ju(n, f.map((l) => In(l)), i));
  }
  get(e) {
    const t = this.client.prepare(this.query.sql), n = Nn(this.query.params, e ?? {});
    this.logger.logQuery(this.query.sql, n);
    const { fields: i, joinsNotNullableMap: s, customResultMapper: a } = this;
    if (!i && !a) {
      const o = t.getAsObject(n);
      return t.free(), o;
    }
    const u = t.get(n);
    if (t.free(), !(!u || u.length === 0 && i.length > 0))
      return a ? a([u], In) : Ju(i, u.map((o) => In(o)), s);
  }
  values(e) {
    const t = this.client.prepare(this.query.sql), n = Nn(this.query.params, e ?? {});
    this.logger.logQuery(this.query.sql, n), t.bind(n);
    const i = [];
    for (; t.step(); )
      i.push(t.get());
    return t.free(), i;
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
function In(r) {
  if (r instanceof Uint8Array) {
    if (typeof Buffer < "u")
      return r instanceof Buffer ? r : Buffer.from(r);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(r);
    throw new Error("TextDecoder is not available. Please provide either Buffer or TextDecoder polyfill.");
  }
  return r;
}
function Cm(r, e = {}) {
  const t = new rf({ casing: e.casing });
  let n;
  e.logger === !0 ? n = new xh() : e.logger !== !1 && (n = e.logger);
  let i;
  if (e.schema) {
    const a = wp(
      e.schema,
      bp
    );
    i = {
      fullSchema: e.schema,
      schema: a.tables,
      tableNamesMap: a.tableNamesMap
    };
  }
  const s = new _m(r, t, i, { logger: n });
  return new af("sync", t, s, i);
}
const Ce = cr("products", {
  id: ze("id").primaryKey({ autoIncrement: !0 }),
  name: ke("name").notNull(),
  activeIngredient: ke("active_ingredient"),
  // Principio activo
  presentation: ke("presentation"),
  // Ej: Bidón 20L
  currentStock: it("current_stock").default(0).notNull(),
  // Stock actual calculado
  createdAt: ke("created_at").default($`CURRENT_TIMESTAMP`)
}), ht = cr("lots", {
  id: ze("id").primaryKey({ autoIncrement: !0 }),
  name: ke("name").notNull(),
  surface: it("surface").notNull(),
  // Hectareas
  createdAt: ke("created_at").default($`CURRENT_TIMESTAMP`)
}), Re = cr("orders", {
  id: ze("id").primaryKey({ autoIncrement: !0 }),
  orderNumber: ze("order_number").notNull(),
  // Visible al usuario (ej: 604)
  remitoNumber: ze("remito_number"),
  // Numero de remito correlativo
  date: ke("date").notNull(),
  // Fecha emisión
  campaign: ke("campaign"),
  // Ej: 2025/2026
  contractor: ke("contractor"),
  // Contratista (Ej: Gatti Facundo)
  // Datos Lote/Labor
  field: ke("field"),
  // Campo (Ej: Colaneri-Fiori)
  crop: ke("crop"),
  // Cultivo (Ej: Soja 2da)
  labor: ke("labor"),
  // Labor
  implanted: ze("implanted", { mode: "boolean" }),
  // Implantado S/N
  totalSurface: it("total_surface"),
  // Hectareas totales de la orden
  status: ke("status").notNull().default("BORRADOR"),
  // BORRADOR, EMITIDA, CERRADA, ANULADA
  // Datos Técnicos Pulverización
  nozzleType: ke("nozzle_type"),
  // Pastilla
  nozzleDescription: ke("nozzle_description"),
  // Ej: Abanico plano martillo
  waterPerHa: it("water_per_ha"),
  // Lts agua
  pressure: it("pressure"),
  // Presion (guardamos valor genérico o string si usa varias unidades)
  pressureUnit: ke("pressure_unit"),
  // Bares, PSI, etc.
  windSpeed: it("wind_speed"),
  // Velocidad viento / Atmosferas
  humidity: it("humidity"),
  // Humedad (si aplica)
  instructions: ke("instructions"),
  observations: ke("observations"),
  createdAt: ke("created_at").default($`CURRENT_TIMESTAMP`)
}), Rt = cr("order_lots", {
  id: ze("id").primaryKey({ autoIncrement: !0 }),
  orderId: ze("order_id").references(() => Re.id).notNull(),
  lotId: ze("lot_id").references(() => ht.id).notNull(),
  appliedSurface: it("applied_surface").notNull()
  // Superficie a aplicar en esta orden
}), Pe = cr("order_items", {
  id: ze("id").primaryKey({ autoIncrement: !0 }),
  orderId: ze("order_id").references(() => Re.id).notNull(),
  productId: ze("product_id").references(() => Ce.id).notNull(),
  dose: it("dose").notNull(),
  // Dosis por ha
  quantityTheoretical: it("quantity_theoretical").notNull(),
  // Dosis Total (Teorico)
  // Remito / Devolución
  quantityDelivered: it("quantity_delivered").default(0),
  // Entreg. [lts]
  quantityReturned: it("quantity_returned").default(0),
  // Devuelto [lts]
  quantityReal: it("quantity_real").default(0)
  // Consumo real final
}), Qe = cr("stock_movements", {
  id: ze("id").primaryKey({ autoIncrement: !0 }),
  date: ke("date").default($`CURRENT_TIMESTAMP`),
  productId: ze("product_id").references(() => Ce.id).notNull(),
  orderId: ze("order_id").references(() => Re.id),
  // Opcional, si viene de una orden
  type: ke("type").notNull(),
  // COMPRA, SALIDA_REMITO, RETORNO_SOBRANTE, AJUSTE
  quantity: it("quantity").notNull(),
  // Positivo suma, Negativo resta
  description: ke("description")
}), Zr = cr("empty_containers", {
  id: ze("id").primaryKey({ autoIncrement: !0 }),
  productId: ze("product_id").references(() => Ce.id).notNull(),
  pendingReturn: ze("pending_return").default(0).notNull(),
  // En el campo/galpón
  deliveredCat: ze("delivered_cat").default(0).notNull()
  // Entregados al CAT
}), Am = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  emptyContainers: Zr,
  lots: ht,
  orderItems: Pe,
  orderLots: Rt,
  orders: Re,
  products: Ce,
  stockMovements: Qe
}, Symbol.toStringTag, { value: "Module" })), oa = "local.db";
let Pn = null, We = null;
async function Rm() {
  if (Pn && We) return { db: Pn, save: la };
  const r = await ad();
  let e = null;
  return bt.existsSync(oa) && (e = bt.readFileSync(oa)), We = new r.Database(e), Pn = Cm(We, { schema: Am }), { db: Pn, save: la };
}
function la() {
  if (!We) return;
  const r = We.export(), e = Buffer.from(r);
  bt.writeFileSync(oa, e);
}
function Nm() {
  if (We)
    try {
      const r = (e, t) => {
        const n = We.exec(`PRAGMA table_info(${e})`);
        return n.length > 0 ? n[0].values.map((s) => s[1]).includes(t) : !1;
      };
      r("orders", "field") || We.run("ALTER TABLE orders ADD COLUMN field text"), r("orders", "implanted") || We.run("ALTER TABLE orders ADD COLUMN implanted integer"), r("orders", "total_surface") || We.run("ALTER TABLE orders ADD COLUMN total_surface real"), r("orders", "nozzle_description") || We.run("ALTER TABLE orders ADD COLUMN nozzle_description text"), r("orders", "instructions") || We.run("ALTER TABLE orders ADD COLUMN instructions text"), r("orders", "pressure_unit") || We.run("ALTER TABLE orders ADD COLUMN pressure_unit text"), r("orders", "remito_number") || We.run("ALTER TABLE orders ADD COLUMN remito_number integer"), r("order_items", "quantity_delivered") || We.run("ALTER TABLE order_items ADD COLUMN quantity_delivered real DEFAULT 0"), r("order_items", "quantity_returned") || We.run("ALTER TABLE order_items ADD COLUMN quantity_returned real DEFAULT 0"), r("order_items", "quantity_real") || We.run("ALTER TABLE order_items ADD COLUMN quantity_real real DEFAULT 0"), r("order_items", "quantity_theoretical") || We.run("ALTER TABLE order_items ADD COLUMN quantity_theoretical real DEFAULT 0"), la(), console.log("Migrations applied successfully.");
    } catch (r) {
      console.error("Migration error:", r);
    }
}
const Om = sd(import.meta.url), of = Sr.dirname(dc(import.meta.url));
dc(import.meta.url);
process.env.DIST = Sr.join(of, "../dist");
process.env.VITE_PUBLIC = jt.isPackaged ? process.env.DIST : Sr.join(process.env.DIST, "../public");
let vr;
const ac = process.env.VITE_DEV_SERVER_URL;
function lf() {
  vr = new oc({
    width: 1200,
    height: 800,
    icon: Sr.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    webPreferences: {
      preload: Sr.join(of, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  const r = [
    {
      label: "Archivo",
      submenu: [
        { label: "Salir", role: "quit" }
      ]
    },
    {
      label: "Editar",
      submenu: [
        { label: "Deshacer", role: "undo" },
        { label: "Rehacer", role: "redo" },
        { type: "separator" },
        { label: "Cortar", role: "cut" },
        { label: "Copiar", role: "copy" },
        { label: "Pegar", role: "paste" },
        { label: "Seleccionar todo", role: "selectAll" }
      ]
    },
    {
      label: "Ver",
      submenu: [
        { label: "Recargar", role: "reload" },
        { label: "Forzar recarga", role: "forceReload" },
        { label: "Herramientas de desarrollo", role: "toggleDevTools" },
        { type: "separator" },
        { label: "Zoom +", role: "zoomIn" },
        { label: "Zoom -", role: "zoomOut" },
        { label: "Restablecer zoom", role: "resetZoom" },
        { type: "separator" },
        { label: "Pantalla completa", role: "togglefullscreen" }
      ]
    },
    {
      label: "Ventana",
      submenu: [
        { label: "Minimizar", role: "minimize" },
        { label: "Cerrar", role: "close" }
      ]
    },
    {
      label: "Ayuda",
      submenu: [
        {
          label: "Instrucciones de Uso",
          click: () => {
            vr?.webContents.send("navigate-to", "/guia");
          }
        },
        { type: "separator" },
        {
          label: "Acerca de Agrosistema",
          click: async () => {
            const { dialog: t } = Om("electron");
            t.showMessageBox({
              type: "info",
              title: "Agrosistema",
              message: "Gestión Agropecuaria v1.0.0",
              detail: "Herramienta integral para el control de insumos y aplicaciones."
            });
          }
        }
      ]
    }
  ], e = Ha.buildFromTemplate(r);
  Ha.setApplicationMenu(e), vr.webContents.on("did-finish-load", () => {
    vr?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), ac ? vr.loadURL(ac) : vr.loadFile(Sr.join(process.env.DIST || "", "index.html"));
}
jt.on("window-all-closed", () => {
  process.platform !== "darwin" && jt.quit();
});
jt.on("activate", () => {
  oc.getAllWindows().length === 0 && lf();
});
jt.whenReady().then(async () => {
  try {
    const { db: r, save: e } = await Rm();
    Nm(), lf(), Im(r, e), jt.isPackaged && (Rn.autoUpdater.checkForUpdatesAndNotify(), Rn.autoUpdater.on("update-available", () => {
      console.log("Update available.");
    }), Rn.autoUpdater.on("update-downloaded", (t) => {
      rd.showMessageBox({
        type: "info",
        title: "Actualización lista",
        message: `Una nueva versión (${t.version}) ha sido descargada. ¿Deseas reiniciar la aplicación para instalarla ahora?`,
        buttons: ["Instalar ahora", "Más tarde"]
      }).then((n) => {
        n.response === 0 && (e(), Rn.autoUpdater.quitAndInstall());
      });
    }));
  } catch (r) {
    console.error("Failed to initialize database:", r), jt.quit();
  }
});
function Im(r, e) {
  He.handle("get-products", async () => await r.select().from(Ce).orderBy(Ce.name)), He.handle("create-product", async (t, n) => {
    const i = await r.insert(Ce).values(n).returning();
    return e(), i[0];
  }), He.handle("delete-product", async (t, n) => (await r.delete(Ce).where(Ie(Ce.id, n)), e(), !0)), He.handle("quit-app", () => {
    e(), jt.quit();
  }), He.handle("get-lots", async () => await r.select().from(ht).orderBy(ht.name)), He.handle("create-lot", async (t, n) => {
    const i = await r.insert(ht).values(n).returning();
    return e(), i[0];
  }), He.handle("delete-lot", async (t, n) => (await r.delete(ht).where(Ie(ht.id, n)), e(), !0)), He.handle("add-stock-movement", async (t, { productId: n, quantity: i, description: s, type: a }) => {
    try {
      const u = await r.transaction(async (o) => {
        await o.insert(Qe).values({
          productId: n,
          quantity: i,
          type: a,
          description: s
        });
        const f = await o.select().from(Ce).where(Ie(Ce.id, n)).get();
        if (!f) throw new Error("Product not found");
        const l = (f.currentStock || 0) + i;
        return await o.update(Ce).set({ currentStock: l }).where(Ie(Ce.id, n)), { success: !0, newStock: l };
      });
      return e(), u;
    } catch (u) {
      throw console.warn("Transaction might have failed, attempting sequential for compatibility if needed:", u), u;
    }
  }), He.handle("get-orders", async () => {
    try {
      return await r.select().from(Re).orderBy(Re.date);
    } catch (t) {
      throw console.error(t), t;
    }
  }), He.handle("create-order", async (t, n) => {
    try {
      const i = await r.transaction(async (s) => {
        const u = ((await s.select().from(Re).orderBy($`${Re.orderNumber} DESC`).limit(1).get())?.orderNumber || 0) + 1, [o] = await s.insert(Re).values({
          orderNumber: u,
          date: n.date,
          campaign: n.campaign,
          contractor: n.contractor,
          field: n.field,
          crop: n.crop,
          labor: n.labor,
          implanted: n.implanted,
          totalSurface: n.totalSurface,
          // from frontend
          nozzleType: n.nozzleType,
          nozzleDescription: n.nozzleDescription,
          waterPerHa: n.waterPerHa,
          pressure: n.pressure,
          pressureUnit: n.pressureUnit,
          windSpeed: n.windSpeed,
          humidity: n.humidity,
          observations: n.observations,
          status: "BORRADOR"
        }).returning();
        if (n.lotDetails && n.lotDetails.length > 0)
          for (const f of n.lotDetails)
            await s.insert(Rt).values({
              orderId: o.id,
              lotId: f.lotId,
              appliedSurface: f.appliedSurface
            });
        for (const f of n.items)
          await s.insert(Pe).values({
            orderId: o.id,
            productId: f.productId,
            dose: f.dose,
            quantityTheoretical: f.total,
            quantityDelivered: f.total
            // Default setup
          });
        return o;
      });
      return e(), i;
    } catch (i) {
      throw console.error("Error creating order:", i), i;
    }
  }), He.handle("update-order", async (t, { id: n, ...i }) => {
    try {
      const s = await r.transaction(async (a) => {
        const [u] = await a.update(Re).set({
          date: i.date,
          campaign: i.campaign,
          contractor: i.contractor,
          field: i.field,
          crop: i.crop,
          labor: i.labor,
          implanted: i.implanted,
          totalSurface: i.totalSurface,
          nozzleType: i.nozzleType,
          nozzleDescription: i.nozzleDescription,
          waterPerHa: i.waterPerHa,
          pressure: i.pressure,
          pressureUnit: i.pressureUnit,
          windSpeed: i.windSpeed,
          humidity: i.humidity,
          instructions: i.instructions,
          observations: i.observations
        }).where(Ie(Re.id, n)).returning();
        await a.delete(Pe).where(Ie(Pe.orderId, n));
        for (const o of i.items)
          await a.insert(Pe).values({
            orderId: n,
            productId: o.productId,
            dose: o.dose,
            quantityTheoretical: o.total,
            quantityDelivered: o.total
          });
        await a.delete(Rt).where(Ie(Rt.orderId, n));
        for (const o of i.lotDetails)
          await a.insert(Rt).values({
            orderId: n,
            lotId: o.lotId,
            appliedSurface: o.appliedSurface
          });
        return u;
      });
      return e(), s;
    } catch (s) {
      throw console.error("Error updating order:", s), s;
    }
  }), He.handle("get-order-details", async (t, n) => {
    const i = await r.select().from(Re).where(Ie(Re.id, n)).get();
    if (!i) throw new Error("Order not found");
    const s = await r.select({
      id: Pe.id,
      productId: Pe.productId,
      productName: Ce.name,
      productPresentation: Ce.presentation,
      dose: Pe.dose,
      quantityTheoretical: Pe.quantityTheoretical,
      quantityDelivered: Pe.quantityDelivered,
      quantityReturned: Pe.quantityReturned,
      quantityReal: Pe.quantityReal
    }).from(Pe).leftJoin(Ce, Ie(Pe.productId, Ce.id)).where(Ie(Pe.orderId, n)), a = await r.select({
      id: ht.id,
      name: ht.name,
      appliedSurface: Rt.appliedSurface
    }).from(Rt).leftJoin(ht, Ie(Rt.lotId, ht.id)).where(Ie(Rt.orderId, n));
    return { ...i, items: s, lots: a };
  }), He.handle("emit-remito", async (t, { orderId: n, items: i }) => (await r.transaction(async (s) => {
    const a = await s.select().from(Re).where(Ie(Re.id, n)).get();
    if (!a) throw new Error("Order not found");
    let u = a.remitoNumber;
    u || (u = ((await s.select().from(Re).where($`${Re.remitoNumber} IS NOT NULL`).orderBy($`${Re.remitoNumber} DESC`).limit(1).get())?.remitoNumber || 0) + 1), await s.update(Re).set({
      status: "EMITIDA",
      remitoNumber: u
    }).where(Ie(Re.id, n));
    for (const o of i)
      if (o.id && await s.update(Pe).set({ quantityDelivered: o.quantityDelivered }).where(Ie(Pe.id, o.id)), o.productId) {
        await s.insert(Qe).values({
          productId: o.productId,
          quantity: -o.quantityDelivered,
          // Negative for output
          type: "SALIDA_REMITO",
          orderId: n,
          description: `Remito Orden #${a?.orderNumber}`
        });
        const f = await s.select().from(Ce).where(Ie(Ce.id, o.productId)).get();
        f && await s.update(Ce).set({ currentStock: (f.currentStock || 0) - o.quantityDelivered }).where(Ie(Ce.id, o.productId));
      } else
        console.warn("Item missing productId, skipping stock deduction:", o);
  }), e(), !0)), He.handle("close-order", async (t, { orderId: n, items: i }) => (await r.transaction(async (s) => {
    await s.update(Re).set({ status: "CERRADA" }).where(Ie(Re.id, n));
    const a = await s.select().from(Re).where(Ie(Re.id, n)).get();
    for (const u of i) {
      const o = u.quantityReturned || 0, f = await s.select().from(Pe).where(Ie(Pe.id, u.id)).get();
      if (!f) continue;
      const l = (f.quantityDelivered || 0) - o;
      if (await s.update(Pe).set({
        quantityReturned: o,
        quantityReal: l
      }).where(Ie(Pe.id, u.id)), o > 0) {
        await s.insert(Qe).values({
          productId: u.productId,
          quantity: o,
          type: "RETORNO_SOBRANTE",
          orderId: n,
          description: `Retorno Orden #${a?.orderNumber}`
        });
        const c = await s.select().from(Ce).where(Ie(Ce.id, u.productId)).get();
        c && await s.update(Ce).set({ currentStock: c.currentStock + o }).where(Ie(Ce.id, u.productId));
      }
    }
  }), e(), !0)), He.handle("get-stock-movements", async () => {
    try {
      return await r.select({
        id: Qe.id,
        date: Qe.date,
        productId: Qe.productId,
        productName: Ce.name,
        type: Qe.type,
        quantity: Qe.quantity,
        description: Qe.description,
        orderId: Qe.orderId
      }).from(Qe).leftJoin(Ce, Ie(Qe.productId, Ce.id)).orderBy(Qe.date);
    } catch (t) {
      throw console.error("Error fetching movements:", t), t;
    }
  }), He.handle("get-consumption-by-campaign", async () => {
    try {
      return (await r.select({
        id: Re.id,
        campaign: Re.campaign
      }).from(Re).where(Ie(Re.status, "CERRADA"))).map((s) => s.id).length === 0 ? [] : await r.select({
        productId: Pe.productId,
        productName: Ce.name,
        quantityReal: Pe.quantityReal,
        campaign: Re.campaign
      }).from(Pe).leftJoin(Re, Ie(Pe.orderId, Re.id)).leftJoin(Ce, Ie(Pe.productId, Ce.id)).where(Ie(Re.status, "CERRADA"));
    } catch (t) {
      throw console.error(t), t;
    }
  }), He.handle("get-container-status", async () => {
    try {
      return await r.select({
        productName: Ce.name,
        presentation: Ce.presentation,
        pendingReturn: Zr.pendingReturn,
        deliveredCat: Zr.deliveredCat
      }).from(Zr).leftJoin(Ce, Ie(Zr.productId, Ce.id));
    } catch (t) {
      throw console.error(t), t;
    }
  }), He.handle("update-product", async (t, n) => {
    try {
      return await r.update(Ce).set({
        name: n.name,
        activeIngredient: n.activeIngredient,
        presentation: n.presentation
      }).where(Ie(Ce.id, n.id)), !0;
    } catch (i) {
      throw console.error(i), i;
    }
  }), He.handle("update-lot", async (t, n) => {
    try {
      return await r.update(ht).set({
        name: n.name,
        surface: n.surface
      }).where(Ie(ht.id, n.id)), !0;
    } catch (i) {
      throw console.error(i), i;
    }
  }), He.handle("get-efficiency-report", async () => {
    try {
      return await r.select({
        orderNumber: Re.orderNumber,
        field: Re.field,
        productName: Ce.name,
        theoretical: Pe.quantityTheoretical,
        real: Pe.quantityReal,
        campaign: Re.campaign
      }).from(Pe).leftJoin(Re, Ie(Pe.orderId, Re.id)).leftJoin(Ce, Ie(Pe.productId, Ce.id)).where(Ie(Re.status, "CERRADA"));
    } catch (t) {
      throw console.error(t), t;
    }
  }), He.handle("get-campaign-cost-report", async () => {
    try {
      const t = await r.select({
        productId: Qe.productId,
        productName: Ce.name,
        totalPurchased: $`sum(${Qe.quantity})`
      }).from(Qe).leftJoin(Ce, Ie(Qe.productId, Ce.id)).where(Ie(Qe.type, "COMPRA")).groupBy(Qe.productId), n = await r.select({
        productId: Pe.productId,
        totalConsumed: $`sum(${Pe.quantityReal})`
      }).from(Pe).leftJoin(Re, Ie(Pe.orderId, Re.id)).where(Ie(Re.status, "CERRADA")).groupBy(Pe.productId);
      return { purchases: t, consumption: n };
    } catch (t) {
      throw console.error(t), t;
    }
  }), He.handle("truncate-orders", async () => {
    try {
      return await r.delete(Pe), await r.delete(Rt), await r.delete(Re), e(), !0;
    } catch (t) {
      throw console.error("Error truncating orders:", t), t;
    }
  });
}
