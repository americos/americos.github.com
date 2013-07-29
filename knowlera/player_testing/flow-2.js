/*
Taken from: http://lp.longtailvideo.com/5/flow/flow-2.js
*/
/*

 @author sole / http://soledadpenades.com
 @author mr.doob / http://mrdoob.com
 @author Robert Eisele / http://www.xarg.org
 @author Philippe / http://philippe.elsass.me
 @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 @author Paul Lewis / http://www.aerotwist.com/
 @author lechecacharro
 @author Josh Faul / http://jocafa.com/
*/
var TWEEN = TWEEN || function () {
        var e, a, b = 60,
            c = !1,
            n = [],
            f;
        return {
            setFPS: function (a) {
                b = a || 60
            },
            start: function (c) {
                0 !== arguments.length && this.setFPS(c);
                a = setInterval(this.update, 1E3 / b)
            },
            stop: function () {
                clearInterval(a)
            },
            setAutostart: function (b) {
                (c = b) && !a && this.start()
            },
            add: function (b) {
                n.push(b);
                c && !a && this.start()
            },
            getAll: function () {
                return n
            },
            removeAll: function () {
                n = []
            },
            remove: function (a) {
                e = n.indexOf(a); - 1 !== e && n.splice(e, 1)
            },
            update: function (a) {
                e = 0;
                f = n.length;
                for (a = a || (new Date).getTime(); e < f;) n[e].update(a) ?
                    e++ : (n.splice(e, 1), f--);
                0 === f && !0 === c && this.stop()
            }
        }
    }();
TWEEN.Tween = function (e) {
    var a = {}, b = {}, c = {}, n = 1E3,
        f = 0,
        g = null,
        j = TWEEN.Easing.Linear.EaseNone,
        u = null,
        A = null,
        B = null;
    this.to = function (a, b) {
        null !== b && (n = b);
        for (var g in a) null !== e[g] && (c[g] = a[g]);
        return this
    };
    this.start = function (C) {
        TWEEN.add(this);
        g = C ? C + f : (new Date).getTime() + f;
        for (var j in c) null !== e[j] && (a[j] = e[j], b[j] = c[j] - e[j]);
        return this
    };
    this.stop = function () {
        TWEEN.remove(this);
        return this
    };
    this.delay = function (a) {
        f = a;
        return this
    };
    this.easing = function (a) {
        j = a;
        return this
    };
    this.chain = function (a) {
        u = a;
        return this
    };
    this.onUpdate = function (a) {
        A = a;
        return this
    };
    this.onComplete = function (a) {
        B = a;
        return this
    };
    this.update = function (c) {
        var f, v;
        if (c < g) return !0;
        c = (c - g) / n;
        c = 1 < c ? 1 : c;
        v = j(c);
        for (f in b) e[f] = a[f] + b[f] * v;
        null !== A && A.call(e, v);
        return 1 == c ? (null !== B && B.call(e), null !== u && u.start(), !1) : !0
    }
};
TWEEN.Easing = {
    Linear: {},
    Quadratic: {},
    Cubic: {},
    Quartic: {},
    Quintic: {},
    Sinusoidal: {},
    Exponential: {},
    Circular: {},
    Elastic: {},
    Back: {},
    Bounce: {}
};
TWEEN.Easing.Linear.EaseNone = function (e) {
    return e
};
TWEEN.Easing.Cubic.EaseOut = function (e) {
    return --e * e * e + 1
};
/*

 @author luwes / http://luwes.co
*/
(function (e) {
    window.requestAnimationFrame || (window.requestAnimationFrame = function () {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
            window.setTimeout(a, 1E3 / 60)
        }
    }());
    Flow = function (a, b, c, e, f, g, j, u, A, B, C, D, v, r, m, w, t) {
        function y(a) {
            for (var b = 0, c = a.currentTarget; c = c.previousSibling;)++b;
            b = z[b];
            if (a.offsetY < b.halfHeight) {
                a.preventDefault();
                b.index != k ? h.to(b.index) : h.clicked(b.index)
            }
        }

        function J(a) {
            switch (a.keyCode) {
            case 37:
                h.left();
                break;
            case 39:
                h.right();
                break;
            case 38:
                h.to(0);
                break;
            case 40:
                h.to(o - 1);
                break;
            case 32:
                h.clicked(k)
            }
        }
        var h = this;
        this.GAP = f;
        this.ANGLE = g;
        this.DEPTH = -j;
        this.OFFSET = u + f;
        this.T_NEG_ANGLE = "rotateY(" + -this.ANGLE + "deg)";
        this.T_ANGLE = "rotateY(" + this.ANGLE + "deg)";
        this.OPACITY = A;
        this.DURATION = w;
        this.showComplete = this.hideComplete = null;
        var z = [],
            o = b.length,
            G = 0,
            l = 0,
            k = 0,
            s = [],
            d = [];
        this.domElement = document.createElement("div");
        this.domElement.setAttribute("id", "flow_wrap");
        this.domElement.setAttribute("class", "flow_wrap");
        f = document.createElement("div");
        f.setAttribute("id", "flow_tray");
        f.setAttribute("class", "flow_tray");
        this.domElement.appendChild(f);
        this.domElement.style.webkitPerspective = t;
        for (var t = new FlowDelegate(this, f), p = new TouchController(this, t, f), i = null, g = 0; g < b.length; g++) {
            i = new FlowItem(h, g, b[g].image, b[g].duration, c, e, C, D, v, B, r, m);
            t.cells.push(i);
            f.appendChild(i.domElement);
            i.domElement.onmousedown = y;
            i.domElement.style.webkitTransitionDuration = w + "s";
            z[g] = i
        }
        i.domElement.firstChild.addEventListener("webkitTransitionEnd",
            function (a) {
                a.stopPropagation();
                if (parseInt(i.domElement.firstChild.style.opacity, 10) === 0) {
                    h.domElement.style.opacity = 0;
                    typeof h.hideComplete == "function" && h.hideComplete()
                } else parseInt(i.domElement.firstChild.style.opacity, 10) === 1 && typeof h.showComplete == "function" && h.showComplete()
            }, true);
        this.hide = function (a) {
            h.hideComplete = a;
            for (a = 0; a < z.length; a++) z[a].domElement.firstChild.style.opacity = 0
        };
        this.show = function (a) {
            h.showComplete = a;
            h.domElement.style.opacity = 1;
            for (a = 0; a < z.length; a++) z[a].domElement.firstChild.style.opacity =
                1
        };
        this.itemComplete = function (a) {
            l = l < a ? a : l;
            ++G;
            if (G == o) {
                h.to(0);
                for (a = 0; a < o; a++) z[a].setY(l)
            }
        };
        this.left = function () {
            k > 0 && h.to(k - 1)
        };
        this.right = function () {
            k < o - 1 && h.to(k + 1)
        };
        this.prev = function () {
            k > 0 ? h.to(k - 1) : h.to(o - 1)
        };
        this.next = function () {
            k < o - 1 ? h.to(k + 1) : h.to(0)
        };
        this.to = function (a) {
            a > o - 1 ? a = o - 1 : a < 0 && (a = 0);
            k = a;
            p.to(a)
        };
        this.focused = function (a) {
            for (var b = 0; b < s.length; b++) s[b](a)
        };
        this.clicked = function (a) {
          console.log("this.clicked");
            for (var b = 0; b < d.length; b++) d[b](a)
        };
        this.onFocus = function (a) {
            s.push(a)
        };
        this.onClick = function (a) {
          console.log("this.onClick");
            d.push(a)
        };
        this.destroy = function () {
            a.removeChild(h.domElement);
            a.removeEventListener("touchstart", p, true);
            window.removeEventListener("keydown", J, false)
        };
        a.addEventListener("touchstart", p, true);
        window.addEventListener("keydown", J, false)
    };
    FlowItem = function (a, b, c, e, f, g, j, u, A, B, C, D) {
        var v = this,
            r, m;
        this.index = b;
        this.halfHeight = 0;
        this.domElement = document.createElement("div");
        this.domElement.className = "flow_cell";
        var w = this.domElement.style;
        w.backgroundColor = B;
        var t = document.createElement("canvas");
        v.domElement.appendChild(t);
        var y = document.createElement("img");
        y.addEventListener("load", function () {
            var b = y.width,
                c = y.height,
                e = 0,
                o = 0,
                n = 0;
            if (C) {
                var l = document.createElement("canvas");
                l.width = b;
                l.height = c;
                l = l.getContext("2d");
                l.drawImage(y, 0, 0);
                for (var l = l.getImageData(0, 0, b, c).data, k = 0, s = 0, d = 0, p = 0; p < c; p++) {
                    for (s = k = 0; s < b; s++) {
                        d = (p * b + s) * 4;
                        k = k + (l[d] << 16 | l[d + 1] << 8 | l[d + 2])
                    }
                    if (k / b < 460551) e++;
                    else break
                }
                for (p = c - 1; p >= 0; p--) {
                    for (s = k = 0; s < b; s++) {
                        d = (p * b + s) * 4;
                        k = k + (l[d] << 16 | l[d + 1] << 8 | l[d + 2])
                    }
                    if (k / b < 460551) o++;
                    else break
                }
                c = c - (e + o)
            }
            if (D) {
                r =
                    Math.round(f);
                m = Math.round(g);
                if (r / b < m / c) {
                    o = m / c;
                    n = n + (b - r / o) * 0.5
                } else {
                    o = r / b;
                    e = e + (c - m / o) * 0.5
                }
            } else if (f >= g) {
                r = Math.round(b / c * g);
                m = Math.round(g)
            } else {
                r = Math.round(f);
                m = Math.round(c / b * f)
            }
            v.halfHeight = m;
            w.top = -(m * 0.5) + "px";
            w.left = -(r * 0.5) + "px";
            w.width = r + "px";
            w.height = m + "px";
            t.width = r;
            t.height = m * 2;
            t.getContext("2d").drawImage(y, n, e, b - 2 * n, c - 2 * e, 0, 0, r, m);
            if (j > 0) {
                w.height = m * 2 + "px";
                v.reflect(t, r, m, j, u, A)
            }
            a.itemComplete(m)
        });
        y.src = c;
        this.setY = function (a) {
            this.domElement.style.top = -(a * 0.5 - (a - m)) + "px"
        }
    };
    FlowItem.prototype.reflect =
        function (a, b, c, e, f, g) {
            var j = a.getContext("2d");
            j.save();
            j.scale(1, -1);
            j.drawImage(a, 0, -c * 2 - g);
            j.restore();
            j.globalCompositeOperation = "destination-out";
            a = j.createLinearGradient(0, 0, 0, c);
            a.addColorStop(f / 255, "rgba(255, 255, 255, 1.0)");
            a.addColorStop(0, "rgba(255, 255, 255, " + (1 - e) + ")");
            j.translate(0, c + g);
            j.fillStyle = a;
            j.fillRect(0, 0, b, c)
    };
    TouchController = function (a, b, c) {
        this.flow = a;
        this.delegate = b;
        this.elem = c;
        this.currentX = 0
    };
    TouchController.prototype.touchstart = function (a) {
        a.stopImmediatePropagation();
        this.startX = a.touches[0].pageX - this.currentX;
        this.pageY = a.touches[0].pageY;
        this.touchMoved = false;
        window.addEventListener("touchmove", this, true);
        window.addEventListener("touchend", this, true);
        this.elem.style.webkitTransitionDuration = "0s"
    };
    TouchController.prototype.touchmove = function (a) {
        a.stopImmediatePropagation();
        this.touchMoved = true;
        this.lastX = this.currentX;
        this.lastMoveTime = (new Date).getTime();
        this.currentX = a.touches[0].pageX - this.startX;
        this.delegate.update(this.currentX)
    };
    TouchController.prototype.touchend =
        function (a) {
            a.stopImmediatePropagation();
            window.removeEventListener("touchmove", this, true);
            window.removeEventListener("touchend", this, true);
            this.elem.style.webkitTransitionDuration = this.flow.DURATION + "s";
            if (this.touchMoved) {
                var a = this.currentX - this.lastX,
                    b = (new Date).getTime() - this.lastMoveTime + 1;
                this.currentX = this.currentX + a * 50 / b;
                this.delegate.updateTouchEnd(this)
            } else this.delegate.click(a, this.pageY, this.currentX)
    };
    TouchController.prototype.to = function (a) {
        this.currentX = -a * this.delegate.flow.GAP;
        this.delegate.update(this.currentX)
    };
    TouchController.prototype.handleEvent = function (a) {
        this[a.type](a);
        a.preventDefault()
    };
    FlowDelegate = function (a, b) {
        this.flow = a;
        this.elem = b;
        this.cells = [];
        this.transforms = [];
        this.prevF = -1
    };
    FlowDelegate.prototype.updateTouchEnd = function (a) {
        var b = this.getFocusedCell(a.currentX);
        a.currentX = -b * this.flow.GAP;
        this.update(a.currentX)
    };
    FlowDelegate.prototype.getFocusedCell = function (a) {
        a = -Math.round(a / this.flow.GAP);
        return Math.min(Math.max(a, 0), this.cells.length - 1)
    };
    FlowDelegate.prototype.getFocusedCellOne =
        function (a) {
            a = -Math.round(a / this.flow.GAP);
            return Math.min(Math.max(a, -1), this.cells.length)
    };
    FlowDelegate.prototype.click = function (a, b, c) {
      console.log("FlowDelegate.prototype.click");
        c = this.cells[-Math.round(c / this.flow.GAP)];
        if (c.domElement == a.target.parentNode) {
            a = this.findPos(c.domElement);
            b - a.y < c.halfHeight && this.flow.clicked(c.index)
        }
    };
    FlowDelegate.prototype.findPos = function (a) {
        var b = 0,
            c = 0;
        if (a.offsetParent) {
            do {
                b = b + a.offsetLeft;
                c = c + a.offsetTop
            } while (a = a.offsetParent);
            return {
                x: b,
                y: c
            }
        }
    };
    FlowDelegate.prototype.setStyleForCell = function (a, b,
        c) {
        if (this.transforms[b] != c) {
            a.domElement.style.webkitTransform = c;
            this.transforms[b] = c
        }
    };
    FlowDelegate.prototype.transformForCell = function (a, b) {
        var c = b * this.flow.GAP;
        return a == b ? "translate3d(" + c + "px, 0, 0)" : b > a ? "translate3d(" + (c + this.flow.OFFSET) + "px, 0, " + this.flow.DEPTH + "px) " + this.flow.T_NEG_ANGLE : "translate3d(" + (c - this.flow.OFFSET) + "px, 0, " + this.flow.DEPTH + "px) " + this.flow.T_ANGLE
    };
    FlowDelegate.prototype.update = function (a) {
        this.elem.style.webkitTransform = "translate3d(" + a + "px, 0, 0)";
        var b = this.getFocusedCellOne(a);
        if (b != this.prevF) {
            this.flow.focused(b);
            for (var c = 0; c < this.cells.length; c++) this.cells[c].domElement.style.zIndex = c < b ? c : this.cells.length - c + b - 1;
            this.prevF = b
        }
        for (c = 0; c < this.cells.length; c++) this.setStyleForCell(this.cells[c], c, this.transformForCell(b, c, a))
    };
    e().registerPlugin("flow-2", function (a, b, c) {
        function n(a) {
            a.preventDefault();
            var b = Math.ceil(Math.abs(a.wheelDelta) / 120);
            if (b > 0) {
                var c = Math.abs(a.wheelDelta) / a.wheelDelta,
                    a = null;
                if (c > 0) a = d.left;
                else if (c < 0) a = d.right;
                if (typeof a === "function")
                    for (c =
                        0; c < b; c++) a()
            }
        }

        function f() {
            if (!p[a.getCurrentItem()]["ova.hidden"]) {
                a.pause(true);
                d.show()
            }
        }

        function g() {
            return a.getContainer().getElementsByTagName("video")[0]
        }

        function j() {
            if (g()) {
                var a = g().style.webkitTransform;
                g().style.webkitTransform = a.replace(/translate\(.+?\)/, "translate(0px,0px)")
            }
        }

        function u() {
            return b.position == "left" || b.position == "right" || b.position == "top" || b.position == "bottom"
        }

        function A(a) {
            if (b.showtext === true) {
                var c = q[a];
                if (c) x.innerHTML = "<h1>" + (c.title === void 0 ? "" : c.title) + "</h1><h2>" +
                    (c.description === void 0 ? "" : c.description) + "</h2>"
            }
            for (c = 0; c < L.length; c++) L[c](a)
        }

        function B(c) {
            b.rotatedelay > 0 && K && d.stopRotation();
            if (b.file === void 0) H[c] != a.getCurrentItem() ? a.playlistItem(H[c]) : a.getState() == "PLAYING" ? a.pause(true) : a.play(true);
            else {
                q[c].link && window.open(q[c].link, a.config.linktarget);
                if (q[c].file) {
                    a.load({
                        file: q[c].file,
                        image: q[c].image
                    });
                    a.play()
                }
            }
            for (var e = 0; e < M.length; e++) M[e](c)
        }

        function C(a) {
            if (a.target == c)
                if (parseInt(c.style.opacity, 10) === 0) m();
                else {
                    if (b.showtext === true) x.style.opacity =
                        1;
                    i.show(t)
                }
        }

        function D() {
            I = false;
            a.resize()
        }

        function v() {
            if (!(F || c.style.display != "none" === false)) {
                F = true;
                if (u())(new TWEEN.Tween(b)).to({
                    size: 0
                }, 400).easing(TWEEN.Easing.Cubic.EaseOut).onUpdate(D).onComplete(m).start();
                else {
                    setTimeout(function () {
                        if (b.showtext === true) x.style.opacity = 0;
                        i.hide(r)
                    }, 100);
                    j()
                }
                for (var a = 0; a < N.length; a++) N[a]()
            }
        }

        function r() {
            c.style.opacity = 0
        }

        function m() {
            l(false);
            F = false
        }

        function w() {
            if (!(F || c.style.display != "none" === true)) {
                F = true;
                l(true);
                if (u()) {
                    b.size = 1;
                    D();
                    (new TWEEN.Tween(b)).to({
                            size: P
                        },
                        400).easing(TWEEN.Easing.Cubic.EaseOut).onUpdate(D).onComplete(t).start()
                } else setTimeout(function () {
                    c.style.opacity = 1
                }, 100);
                for (var a = 0; a < O.length; a++) O[a]()
            }
        }

        function t() {
            F = false;
            if (!u() && g()) {
                var a = g().style.webkitTransform;
                a ? g().style.webkitTransform = a.replace(/translate\(.+?\)/, "translate(-" + d.width + "px,-" + d.height + "px)") : g().style.webkitTransform = "translate(-" + d.width + "px,-" + d.height + "px)"
            }
        }

        function y(E) {
            p = E.playlist;
            b.coverheight = b.coverheight == "auto" ? a.config.height : b.coverheight;
            if (b.file ===
                void 0) {
                q = [];
                H = [];
                for (var d = E = 0; d < p.length; d++) {
                    var f = p[d];
                    if (!f["ova.hidden"] && f.image) {
                        q[E] = {
                            title: f.title,
                            description: f.description
                        };
                        q[E].image = f.image;
                        if (b.showduration) q[E].duration = f.duration;
                        H[E] = d;
                        E++
                    }
                }
                i && i.destroy();
                i = new Flow(c, q, b.coverwidth, b.coverheight, b.covergap, b.coverangle, b.coverdepth, b.coveroffset, b.opacitydecrease, b.backgroundcolor, b.reflectionopacity, b.reflectionratio, b.reflectionoffset, b.removeblackborder, b.fixedsize, b.tweentime, b.focallength);
                c.appendChild(i.domElement);
                h()
            } else e.utils.ajax(b.file,
                J)
        }

        function J(a) {
            try {
                var d = e.utils.parsers.rssparser.parse(a.responseXML.firstChild);
                if (d.length > 0) {
                    q = [];
                    for (a = 0; a < d.length; a++) {
                        var f = d[a];
                        q[a] = {
                            title: f.title,
                            description: f.description,
                            link: f.link,
                            file: f.file
                        };
                        q[a].image = f.image;
                        if (b.showduration) q[a].duration = f.duration
                    }
                    i && i.destroy();
                    i = new Flow(c, q, b.coverwidth, b.coverheight, b.covergap, b.coverangle, b.coverdepth, b.coveroffset, b.opacitydecrease, b.backgroundcolor, b.reflectionopacity, b.reflectionratio, b.reflectionoffset, b.removeblackborder, b.fixedsize,
                        b.tweentime, b.focallength);
                    c.appendChild(i.domElement);
                    h();
                    i.to(0)
                }
            } catch (g) {}
        }

        function h() {
            i.onFocus(A);
            i.onClick(B);
            x && c.removeChild(x);
            if (b.showtext === true) {
                x = document.createElement("div");
                x.setAttribute("id", "flow_textfield");
                c.appendChild(x)
            }
            d.resize();
            z();
            c.style.display = "block";
            if (b.onidle == "hide") {
                c.style.display = "none";
                l(false);
                c.style.opacity = 0;
                i.hide(null);
                x.style.opacity = 0
            }
            if (b.rotatedelay > 0) {
                K && d.stopRotation();
                K = setInterval(k, b.rotatedelay);
                c.addEventListener("touchstart", d.stopRotation,
                    false);
                c.addEventListener("mousedown", d.stopRotation, false)
            }
            F = false;
            if (b.file !== void 0 && (a.getState() == "PLAYING" || a.getState() == "BUFFERING")) b.onplaying == "show" ? d.show() : b.onplaying == "hide" && d.hide()
        }

        function z() {
            p[a.getCurrentItem()]["ova.hidden"] ? d.hide() : b.file === void 0 && i.to(H.indexOf(a.getCurrentItem()))
        }

        function o() {
            b.oncompleted == "show" ? d.show() : b.oncompleted == "hide" && d.hide()
        }

        function G() {
            document.getElementById(a.id + "_displayarea").style.display = "block";
            switch (a.getState()) {
            case "PAUSED":
                b.onpaused ==
                    "show" ? d.show() : b.onpaused == "hide" && d.hide();
                break;
            case "BUFFERING":
            case "PLAYING":
                b.onplaying == "show" ? d.show() : b.onplaying == "hide" && d.hide()
            }
        }

        function l(a) {
            c.style.display = a ? "block" : "none"
        }

        function k() {
            i.next()
        }

        function s() {
            window.requestAnimationFrame(s);
            TWEEN.update()
        }
        var d = this,
            p, i, x, q, H, F = false,
            K, P = this.height = this.width = 0,
            I = false,
            L = [],
            M = [],
            O = [],
            N = [],
            Q = {
                size: 150,
                backgroundcolor: "000000",
                gradientcolor: void 0,
                coverwidth: 150,
                coverheight: "auto",
                covergap: 40,
                coverangle: 70,
                coverdepth: 170,
                coveroffset: 130,
                removeblackborder: false,
                fixedsize: false,
                focallength: 250,
                opacitydecrease: 0.1,
                reflectionopacity: 0.3,
                reflectionratio: 155,
                reflectionoffset: 0,
                showduration: true,
                showtext: true,
                textstyle: "div#flow_textfield{color:#f1f1f1; text-align:center; font-family:Arial Rounded MT Bold;} #flow_textfield h1{font-size:14px; font-weight:normal; line-height:21px;} #flow_textfield h2{font-size:11px; font-weight:normal;}",
                textoffset: 75,
                tweentime: 0.8,
                rotatedelay: 0,
                dockicon: true,
                onidle: "show",
                onpaused: "hide",
                onplaying: "hide",
                oncompleted: "show",
                file: void 0,
                xposition: 0,
                yposition: 0
            };
        a.onReady(function () {
            if (a.getRenderingMode() == "html5") {
                for (var d in Q) b[d] === void 0 && (b[d] = Q[d]);
                d = document.getElementsByTagName("head")[0];
                var e = document.createElement("style"),
                    i = b.textstyle;
                e.setAttribute("type", "text/css");
                e.appendChild(document.createTextNode(".jwplayer_flow {overflow:hidden;-webkit-touch-callout:none;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0);opacity:1;-webkit-transition:opacity .7s;}.jwplayer_flow div.flow_wrap {position:absolute;left:50%;top:50%;-webkit-perspective:250;-webkit-transform-style:preserve-3d;}.jwplayer_flow div.flow_tray {-webkit-transform-style:preserve-3d;}.jwplayer_flow div.flow_tray,.jwplayer_flow div.flow_cell {position:absolute;-webkit-transform:translate3d(0,0,0);-webkit-backface-visibility:hidden;-webkit-transition:-webkit-transform .8s cubic-bezier(0.190,1.000,0.220,1.000);}.jwplayer_flow div.flow_cell canvas {position:absolute;opacity:1;-webkit-transition:opacity .7s;}#flow_textfield {position:absolute;width:100%;opacity:1;-webkit-transition:opacity .7s;}#flow_textfield h1,#flow_textfield h2{margin:0;}"));
                e.appendChild(document.createTextNode(i));
                d.appendChild(e);
                c.className = c.className + "jwplayer_flow";
                c.addEventListener("webkitTransitionEnd", C);
                P = b.size;
                b.backgroundcolor = b.backgroundcolor.indexOf("#") == -1 ? "#" + b.backgroundcolor : b.backgroundcolor;
                c.style.backgroundColor = b.backgroundcolor;
                if (b.gradientcolor !== void 0) {
                    b.gradientcolor = b.gradientcolor.indexOf("#") == -1 ? "#" + b.gradientcolor : b.gradientcolor;
                    c.style.background = "-webkit-gradient(linear, left top, left bottom, from(" + b.gradientcolor + "), to(" +
                        b.backgroundcolor + "))"
                }
                b.dockicon === true && a.getPlugin("dock") && a.getPlugin("dock").setButton("flow", f, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAAAVdEVYdENyZWF0aW9uIFRpbWUANi8xOC8xMex3F/gAAAGLSURBVGiB7ZjxUYMwFIe/5/m/jOAI3UDcACfQDawbdARGYIOygbgBI7Qb4AS//kF6h4hykKIR89310hLyeN+9JORqklgDV7+dwKWIIqERRUIjioRGFAmNfy+y5LlmVuzVVOTac7wAw79C5xg2N8BqKhJFQiOKhEYUCY0oEhpRJDRWI+J7aLRee4lYsxgVMfscX9Lg9UvwVeyxv3ZnTS1bysIj9mrWSBQJjckiklINk3b60gVy/Raf7fcFqDu/a2Djl858fKZWbWZV59P0b5CUSTq4KlWSNu56IWnrvqeuL+n3/ZRI7hKoJOUDErfAHqiAeyABStfdAOdkM+AOSN2YR+AwNRmfqVV3Hjj04CfXbs2skbQD9m79FMCzSzwD3lybAO9mVvaDjeEjUphZNWegmdWSjrRVSVxb8rFqk1hy+y1cm7sq7IBjR76krVppZudNIyU0ETM7AA+0yb3Srousc0sO3NCuIVzbzJlWADZ2GFvwWDWJRQ6NIRJFQiOKhEYUCY3R98hfYTUVOQH3ZLQrcMqAigAAAABJRU5ErkJggg==",
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAAAVdEVYdENyZWF0aW9uIFRpbWUANi8xOC8xMex3F/gAAAGLSURBVGiB7ZjxUYMwFIe/5/m/jOAI3UDcACfQDawbdARGYIOygbgBI7Qb4AS//kF6h4hykKIR89310hLyeN+9JORqklgDV7+dwKWIIqERRUIjioRGFAmNfy+y5LlmVuzVVOTac7wAw79C5xg2N8BqKhJFQiOKhEYUCY0oEhpRJDRWI+J7aLRee4lYsxgVMfscX9Lg9UvwVeyxv3ZnTS1bysIj9mrWSBQJjckiklINk3b60gVy/Raf7fcFqDu/a2Djl858fKZWbWZV59P0b5CUSTq4KlWSNu56IWnrvqeuL+n3/ZRI7hKoJOUDErfAHqiAeyABStfdAOdkM+AOSN2YR+AwNRmfqVV3Hjj04CfXbs2skbQD9m79FMCzSzwD3lybAO9mVvaDjeEjUphZNWegmdWSjrRVSVxb8rFqk1hy+y1cm7sq7IBjR76krVppZudNIyU0ETM7AA+0yb3Srousc0sO3NCuIVzbzJlWADZ2GFvwWDWJRQ6NIRJFQiOKhEYUCY3R98hfYTUVOQH3ZLQrcMqAigAAAABJRU5ErkJggg==");
                a.onPlaylist(y);
                a.onPlaylistItem(z);
                a.onPlay(G);
                a.onBuffer(G);
                a.onPause(G);
                a.onComplete(o);
                c.addEventListener("mousewheel", n)
            }
        });
        this.stopRotation = function () {
            c.removeEventListener("touchstart", d.stopRotation, false);
            c.removeEventListener("mousedown", d.stopRotation, false);
            clearInterval(K)
        };
        this.left = function () {
            a.getRenderingMode() == "html5" ? i.left() : a.getRenderingMode() == "flash" && a.getContainer().flowLeft()
        };
        this.right = function () {
            a.getRenderingMode() == "html5" ? i.right() : a.getRenderingMode() == "flash" &&
                a.getContainer().flowRight()
        };
        this.prev = function () {
            a.getRenderingMode() == "html5" ? i.prev() : a.getRenderingMode() == "flash" && a.getContainer().flowPrev()
        };
        this.next = function () {
            a.getRenderingMode() == "html5" ? i.next() : a.getRenderingMode() == "flash" && a.getContainer().flowNext()
        };
        this.to = function (b) {
            a.getRenderingMode() == "html5" ? i.to(b) : a.getRenderingMode() == "flash" && a.getContainer().flowTo(b)
        };
        this.onFocus = function (b) {
            a.getRenderingMode() == "html5" ? L.push(b) : a.getRenderingMode() == "flash" && a.getContainer().flowOnFocus(b.toString())
        };
        this.onClick = function (b) {
          console.log("this.onClickl function (b)");
            a.getRenderingMode() == "html5" ? M.push(b) : a.getRenderingMode() == "flash" && a.getContainer().flowOnClick(b.toString())
        };
        this.hide = function () {
            a.getRenderingMode() == "html5" ? v() : a.getRenderingMode() == "flash" && a.getContainer().flowHide()
        };
        this.show = function () {
            a.getRenderingMode() == "html5" ? w() : a.getRenderingMode() == "flash" && a.getContainer().flowShow()
        };
        this.onHide = function (b) {
            a.getRenderingMode() == "html5" ? N.push(b) : a.getRenderingMode() == "flash" && a.getContainer().flowOnHide(b.toString())
        };
        this.onShow = function (b) {
            a.getRenderingMode() == "html5" ? O.push(b) : a.getRenderingMode() == "flash" && a.getContainer().flowOnShow(b.toString())
        };
        this.getDisplayElement = function () {
            return c
        };
        this.resize = function (e, f) {
            if (a.getRenderingMode() == "html5") {
                if (e) d.width = e;
                if (f) d.height = f;
                var g = d.width,
                    h = d.height;
                if (u() && b.size > 0) {
                    if (b.position == "left" || b.position == "right") {
                        g = b.size;
                        h = a.config.height;
                        if (!I) {
                            I = true;
                            a.resize(a.config.width - g, a.config.height)
                        }
                        c.style[b.position] = -b.size + "px"
                    } else if (b.position == "top" ||
                        b.position == "bottom") {
                        g = a.config.width;
                        h = b.size;
                        if (!I) {
                            I = true;
                            a.resize(a.config.width, a.config.height - h)
                        }
                        if (b.position == "top") c.style.top = -h + "px";
                        else if (b.position == "bottom") c.style.top = a.config.height - h + "px"
                    }
                    a.getContainer().style["margin" + (b.position.substr(0, 1).toUpperCase() + b.position.substr(1))] = b.size + "px"
                }
                c.style.width = g + "px";
                c.style.height = h + "px";
                if (i) {
                    i.domElement.style.left = g * 0.5 + b.xposition + "px";
                    i.domElement.style.top = h * 0.5 + b.yposition + "px"
                }
                if (x) x.style.top = h - b.textoffset + "px"
            } else c.parentNode &&
                c.parentNode.removeChild(c)
        };
        s()
    }, "./flow-2.swf")
})(jwplayer);
