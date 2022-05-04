var width, height, k, canvas, ctx, points, target, colors = [], animateHeader = true;

initHeader();
initAnimation();
addListeners();

function initHeader() {
    width = window.innerWidth;
    height = window.innerHeight * 1.2;
    target = { x: width / 2, y: height / 2 };

    canvas = document.getElementById('demo-canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');

    // create points
    points = [];
    var n = 0;
    for (var x = 0 - width / 20; x < width + width / 20; x = x + width / 20) {
        for (var y = 0 - height / 20; y < height + height / 20; y = y + height / 20) {
            var regx = x;
            var regy = y;
            var px = x + Math.random() * width / 20;
            var py = y + Math.random() * height / 20;
            if (n == 1) {
                py += (height / 40);
            }
            var p = { x: px, originX: px, y: py, originY: py, regx: regx, regy: regy };
            points.push(p);
            var col = 'rgba(0, 168, 252,';
            var opacity = 0.2 * Math.random();
            var col = col + opacity.toString() + ')';
            colors.push(col);
        }
        if (n == 1) { n = 0; } else { n = 1; }
    }

    // for each point find the (possibly) 4 adjecent points to it
    for (var i = 0; i < points.length; i++) {
        var closest = [];
        var p1 = points[i];
        if (!(p1 == p2)) {
            for (var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if (p1.regx == p2.regx) {
                    if (p2.regy == p1.regy + height / 20 || p2.regy == p1.regy - height / 20) {
                        closest.push(p2);
                    }
                }
                if (p1.regx % (width / 20) == 0) {
                    if (p2.regy == p1.regy) {
                        if (p2.regx == p1.regx + width / 20 || p2.regx == p1.regx - width / 20) {
                            closest.push(p2);
                        }
                    }
                }
                if (p1.regx % (width / 20) != 0) {
                    if (p2.regy == p1.regy) {
                        if (p2.regx == p1.regx + width / 20 || p2.regx == p1.regx - width / 20) {
                            closest.push(p2);
                        }
                    }
                }
            }
        }
        p1.closest = closest;
    }

    // assign a circle to each point
    for (var i in points) {
        var c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
        points[i].circle = c;
    }
}

function initAnimation() {
    animate();
    for (var i in points) {
        shiftPoint(points[i]);
    }
}

function animate() {
    if (animateHeader) {
        ctx.clearRect(0, 0, width, height);
        drawSurfaces();
        for (var i in points) {
            points[i].active = 0.1;
            points[i].circle.active = 0.3;

            if (Math.abs(getDistance(target, points[i])) < 4000) {
                points[i].active = 0.07;
                points[i].circle.active = 0.3;
            } else if (Math.abs(getDistance(target, points[i])) < 20000) {
                points[i].active = 0.05;
                points[i].circle.active = 0.1;
            } else if (Math.abs(getDistance(target, points[i])) < 40000) {
                points[i].active = 0.01;
                points[i].circle.active = 0.05;
            } else {
                points[i].active = 0;
                points[i].circle.active = 0;
            }

            drawLines(points[i]);
            points[i].circle.draw();
        }
    }
    requestAnimationFrame(animate);
}

// mouse detector
function shiftPoint(p) {
    TweenLite.to(p, 1 + 1 * Math.random(), {
        x: p.originX - 50 + Math.random() * 70,
        y: p.originY - 50 + Math.random() * 70, ease: Circ.easeInOut,
        onComplete: function () {
            shiftPoint(p);
        }
    });
}

function addListeners() {
    if (!('ontouchstart' in window)) {
        window.addEventListener('mousemove', mouseMove);
    }
    // window.addEventListener('scroll', scrollCheck);
    // window.addEventListener('resize', resize);
}

function mouseMove(e) {
    var posx = posy = 0;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    var my = window.scrollY;
    var mx = window.scrollX;
    target.x = posx - mx;
    target.y = posy - my;
}

function drawSurfaces() {
    k = 0;
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        if (topleftCorner(p)) { fillIn(p); }
    }
}

function topleftCorner(point) {
    var n = 0;
    for (var i = 0; i < point.closest.length; i++) {
        var p = point.closest[i];
        if (p.regx == point.regx && p.regy == (point.regy + height / 20)) {
            n++;
        }
        if (p.regx == (point.regx + width / 20) && p.regy == point.regy) {
            n++;
        }
    }
    if (n == 2) {
        return true;
    }
    return false;
}

function fillIn(point) {
    var bottom, right, bottomright;
    for (var i = 0; i < point.closest.length; i++) {
        var p = point.closest[i];
        if (p.regx == point.regx && p.regy == (point.regy + height / 20)) {
            bottom = p;
        }
        if (p.regx == (point.regx + width / 20) && p.regy == point.regy) {
            right = p;
        }
    }
    for (var i = 0; i < bottom.closest.length; i++) {
        var p = bottom.closest[i];
        if (p.regx == (bottom.regx + width / 20) && p.regy == bottom.regy) {
            bottomright = p;
            break;
        }
    }
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.lineTo(bottomright.x, bottomright.y);
    ctx.lineTo(right.x, right.y);
    ctx.strokeStyle = '#ff0000'
    ctx.fillStyle = colors[k];
    ctx.fill();
    k++;
}

function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

function Circle(pos, rad, color) {
    var _this = this;

    // constructor
    (function () {
        _this.pos = pos || null;
        _this.radius = rad || null;
        _this.color = color || null;
    })();

    this.draw = function () {
        if (!_this.active) return;
        ctx.beginPath();
        ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(156,217,249,' + _this.active + ')';
        ctx.fill();
    };
}

function drawLines(p) {
    if (!p.active) return;
    for (var i in p.closest) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.closest[i].x, p.closest[i].y);
        ctx.strokeStyle = 'rgba(156,217,249,' + p.active + ')';
        ctx.stroke();
    }
}