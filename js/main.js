window._isMobile = function() {
    var t = /iphone|ipod|android|ie|blackberry|fennec/.test(navigator.userAgent.toLowerCase());
    return t
}, window.Tangents = window.Tangents || {},
    function() {
        function t() {}
        t.prototype.events = {
            resize: function() {
                Tangents.resizeCanvas(), Tangents.setRatio(), clearTimeout(Tangents.timeouts.resize), Tangents.timeouts.resize = setTimeout(function() {
                    Tangents.clearStage(function() {
                        Tangents.addCircles()
                    })
                }, Tangents.options.timeouts.resize)
            }
        }, t.prototype.config = function() {
            this.stage && this.canvas && (createjs.Ticker.setFPS(this.options.fps), createjs.Touch.enable(this.stage), this.stage.enableDOMEvents(!0), this.stage.enableMouseOver(10), createjs.Ticker.addEventListener("tick", this.tick), this.canvas.style.backgroundColor = this.options.colors.canvas, this.resizeCanvas(), this.setRatio())
        }, t.prototype.resizeCanvas = function() {
            this.canvas && (this.canvas.width = window.innerWidth, this.canvas.height = window.innerHeight)
        }, t.prototype.setRatio = function() {
            this.ratioX = window.innerWidth / 1680, this.ratioY = window.innerHeight / 1050, this.ratio = Math.min(this.ratioX, this.ratioY)
        }, t.prototype.initialize = function(t) {
            var i = this,
                e = t || {},
                a = {
                    fps: 60,
                    colors: {
                        canvas: "rgba(0, 0, 0, 0)",
                        colorDark: "rgba(0, 29, 85, 0.9)",
                        colorDarkOpacity: "rgba(0, 29, 85, 0.4)",
                        colorLight: "rgba(1, 211, 224, 0.9)",
                        colorLightOpacity: "rgba(1, 211, 224, 0.4)"
                    },
                    scale: {
                        max: .1,
                        min: .15
                    },
                    fractionalDigits: 5,
                    positions: {
                        x: {
                            max: 5,
                            min: 5
                        },
                        y: {
                            max: 5,
                            min: 5
                        }
                    },
                    animationPaused: !1,
                    easing: createjs.Ease.backInOut,
                    speed: 800,
                    ratio: .2,
                    timeouts: {
                        resize: 500
                    }
                };
            this.options = $.extend(a, e), this.timeouts = {
                resize: null
            }, this.linesCreated = !1, this.addEvent($(window), "resize", "resize"), this.getStartData("data.json", function() {
                i.prepareScene()
            })
        }, t.prototype.addEvent = function(t, i, e) {
            t.on(i, this.events[e])
        }, t.prototype.removeEvent = function(t, i, e) {
            t.off(i, this.events[e])
        }, t.prototype.getStartData = function(t, i) {
            var e = this;
            $.get("data.json").success(function(t) {
                e.data = t, i()
            })
        }, t.prototype.clearStage = function(t) {
            this.stage && (this.stage.removeAllChildren(), this.stage.update(), this.relations = [], this.circles = null, this.lines = null, this.linesCreated = !1, t())
        }, t.prototype.addCircles = function() {
            if (this.data) {
                var t = this;
                $.each(this.data, function() {
                    var i = new createjs.Shape;
                    i.name = "Circle", i.x = i._x = this.x * t.ratioX, i.y = i._y = this.y * t.ratioY, i.radius = i._radius = this.radius * t.ratio, i.scaleX = i.scaleY = i._scale = 1, i.animating = !1, i.graphics.beginLinearGradientFill([t.options.colors.colorLightOpacity, t.options.colors.colorDarkOpacity], [1, 0], -i._radius, 0, i._radius, 0).setStrokeStyle(.5).beginStroke(t.options.colors.colorLightOpacity).drawCircle(0, 0, i._radius), t.stage.addChild(i)
                })
            }
        }, t.prototype.prepareScene = function() {
            var t = this;
            this.relations = [], this.canvas = document.getElementById("stage"), this.stage = new createjs.Stage(this.canvas), this.config(), this.addCircles();
            var i = function() {
                t.stage && (requestAnimationFrame(i), t.linesCreated ? $.each(t.circles, function() {
                    var i = this;
                    i.animating || t.animateCircle(i)
                }) : t.createLines())
            };
            i()
        }, t.prototype.createLines = function() {
            if (this.stage && !this.linesCreated) {
                var t = this;
                t.linesCreated = !0, t.circles = $.grep(t.stage.children, function(t) {
                    return "Circle" === t.name
                }), $.each(t.circles, function() {
                    t.findTangents(this, t.circles)
                }), t.lines = $.grep(t.stage.children, function(t) {
                    return "Line" === t.name
                })
            }
        }, t.prototype.animateCircle = function(t) {
            if (t) {
                t.animating = !0;
                var i = this,
                    e = i.options.ratio * t._radius;
                t.animationParameters = {
                    scale: i.getRandomNumber(-i.options.scale.min, i.options.scale.max, i.options.fractionalDigits),
                    x: i.getRandomNumber(-i.options.positions.x.min * e, i.options.positions.x.max * e, i.options.fractionalDigits),
                    y: i.getRandomNumber(-i.options.positions.y.min * e, i.options.positions.x.min * e, i.options.fractionalDigits)
                }, t.animation = createjs.Tween.get(t, {
                    override: !0
                }).to({
                    x: t._x + t.animationParameters.x,
                    y: t._y + t.animationParameters.y,
                    radius: t._radius + t._radius * t.animationParameters.scale,
                    scaleX: t._scale + t.animationParameters.scale,
                    scaleY: t._scale + t.animationParameters.scale
                }, e * i.options.speed, i.options.easing).call(function() {
                    t.animation = createjs.Tween.get(t, {
                        override: !0
                    }).to({
                        x: t._x - t.animationParameters.x,
                        y: t._y - t.animationParameters.y,
                        radius: t._radius - t._radius * t.animationParameters.scale,
                        scaleX: t._scale - t.animationParameters.scale,
                        scaleY: t._scale - t.animationParameters.scale
                    }, e * i.options.speed, i.options.easing).call(i.tweenComplete)
                }), i.options.animationPaused && t.animation.setPaused(!0)
            }
        }, t.prototype.pauseAnimation = function() {
            this.circles && $.each(this.circles, function() {
                this.animation.setPaused(!0)
            })
        }, t.prototype.resumeAnimation = function() {
            this.circles && $.each(this.circles, function() {
                this.animation.setPaused(!1)
            })
        }, t.prototype.tweenComplete = function(t) {
            t.target && (t.target.animating = !1)
        }, t.prototype.getRandomNumber = function(t, i, e) {
            if (t && i) {
                var a = e || 0;
                return 0 == a ? parseInt((Math.random() * (i - t) + t).toFixed(a)) : parseFloat((Math.random() * (i - t) + t).toFixed(a))
            }
        }, t.prototype.getTangents = function(t, i, e, a, n, s) {
            if (t && i && e && a && n && s) {
                for (var o = this, r = parseFloat(((t - a) * (t - a) + (i - n) * (i - n)).toFixed(o.options.fractionalDigits)), c = parseFloat(Math.sqrt(r)), l = parseFloat(((a - t) / c).toFixed(o.options.fractionalDigits)), p = parseFloat(((n - i) / c).toFixed(o.options.fractionalDigits)), d = [], h = 0, g = 1; g >= -1; g -= 2) {
                    var u = parseFloat(((e - g * s) / c).toFixed(o.options.fractionalDigits)),
                        f = parseFloat((u * u).toFixed(o.options.fractionalDigits)),
                        m = parseFloat(Math.sqrt(Math.max(0, 1 - f)));
                    if (f > 1) return d;
                    for (var x = 1; x >= -1; x -= 2) {
                        var v = parseFloat((l * u + x * m * p).toFixed(o.options.fractionalDigits)),
                            y = parseFloat((p * u - x * m * l).toFixed(o.options.fractionalDigits));
                        d[h] = [], d[h].push(parseFloat((t + e * v).toFixed(o.options.fractionalDigits))), d[h].push(parseFloat((i + e * y).toFixed(o.options.fractionalDigits))), d[h].push(parseFloat((a + g * s * v).toFixed(o.options.fractionalDigits))), d[h].push(parseFloat((n + g * s * y).toFixed(o.options.fractionalDigits))), h++
                    }
                }
                return d
            }
        }, t.prototype.findTangents = function(t, i) {
            if (t && i) {
                var e = this,
                    a = {
                        x: t.x,
                        y: t.y
                    },
                    n = t.radius;
                $.each(i, function() {
                    var i = this;
                    if (!(this.id === t.id || $.grep(e.relations, function(e) {
                            return e.child_id === t.id && e.parent_id === i.id
                        }).length > 0)) {
                        var s = {
                                x: this.x,
                                y: this.y
                            },
                            o = this.radius,
                            r = e.getTangents(a.x, a.y, n, s.x, s.y, o);
                        r.length && (e.relations.push({
                            child_id: this.id,
                            parent_id: t.id
                        }), $.each(r, function(a) {
                            var n = new createjs.Shape;
                            n.name = "Line", n.lineIndex = a, n.parents = [], n.parents.push({
                                start: t.id,
                                end: i.id
                            }), e.stage.addChild(n)
                        }))
                    }
                })
            }
        }, t.prototype.updateTangents = function(t) {
            if (this.lines && t) {
                var i = this,
                    e = $.grep(i.circles, function(i) {
                        return i.id === t.parents[0].start
                    })[0],
                    a = $.grep(i.circles, function(i) {
                        return i.id === t.parents[0].end
                    })[0],
                    n = i.getTangents(e.x, e.y, e.radius, a.x, a.y, a.radius);
                if (t.graphics.clear(), n[t.lineIndex]) {
                    var s = n[t.lineIndex][2] - n[t.lineIndex][0],
                        o = n[t.lineIndex][3] - n[t.lineIndex][1],
                        r = parseFloat(Math.sqrt(s * s + o * o).toFixed(i.options.fractionalDigits)),
                        c = Math.max(0, Math.min(0, 1 - r / 1e3));
                    t.graphics.setStrokeStyle(.5).beginLinearGradientStroke([i.options.colors.colorLightOpacity, i.options.colors.colorDark], [1, c], 0, 0, n[t.lineIndex][2], n[t.lineIndex][3]).moveTo(n[t.lineIndex][0], n[t.lineIndex][1]).lineTo(n[t.lineIndex][2], n[t.lineIndex][3])
                }
            }
        }, t.prototype.tick = function(t) {
            Tangents.stage && Tangents.lines && ($.each(Tangents.lines, function() {
                Tangents.updateTangents(this)
            }), Tangents.stage.update(t))
        }

        if ($('.canvas').length > 0) {
            window.Tangents = new t
        }
    }(),
    function() {
        function t(t) {
            n.animate({
                scrollTop: $("#wraper" + t + " header").offset().top - 50
            }, 1e3)
        }

        if ($('.canvas').length > 0) {
            Tangents.initialize({
                animationPaused: _isMobile()
            });
        }

        var i = ($("header .nav-btn"), $("nav .pages li")),
            e = $(".nav"),
            a = $(".explore"),
            n = $("html, body");
        $(".hamburger").on("click", function() {
            e.slideToggle(400, function() {
                if (!e.is(":visible")) {
                    e.removeAttr('style');
                }
            })
        }), i.on("click", function() {
            var i = $(this).data("page");
            t(i)
        }), a.on("click", function() {
            t(2)
        })
    }();
$(function() {
    $('.faq-list > li').on('click', function() {
        $(this).toggleClass('open');
    });

    $('.faq-list > li span').on('click', function(e) {
        e.stopPropagation();
    });

    $('iframe.video-player').load(function () {
        var $player = $(this);
        $player.css('opacity', 1);
        setTimeout(function () {
            $player.parent().find('.video-placeholder').css('opacity', 0);
        }, 500);
    });
});
