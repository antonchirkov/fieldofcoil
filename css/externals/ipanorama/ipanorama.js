var viewer = null;
var globalGb = null;
var imgW = 6000;
var imgH = 3000;
var panorama, infospot, Reticle;

function fullScreen(element) {
    if (element.requestFullScreen) {
        element.requestFullScreen();
    }
    else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
    else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
}


function bigMapLoad(el) {
    // рисуем точки на карте
    var vi = $(window).data('viewer');
    var locations = vi.locations;
    for (var key in locations) {
        if (key.indexOf('solution') == -1) {
            var elDiv = $('<div style="position:absolute;z-index:600">').appendTo($(el).parent());
            var a = $('<a href="#" locName="' + key + '"></a>').appendTo(elDiv);
            a.click(function() {
                var locName = $(this).attr('locName');
                $(window).data('viewer').loadLocation(locName);
                var p = $(this).parent();
                while (p.attr('role') != 'dialog') {
                    p = p.parent();
                }
                p.find('button').click();

            })
            elDiv.css('top', locations[key].ymap + 'px');
            elDiv.css('left', locations[key].xmap + 'px');

            if (key == vi.curentlocation) {
                var img = $('<img src="'+modelNS.panoramaInternalImage('mapPoint_a.png') + '" style="width:32px">').appendTo(a);

            }
            else {
                var img = $('<img src="'+modelNS.panoramaInternalImage('mapPoint.png')+'" style="width:32px">').appendTo(a);

            }



        }
    }
    console.log(el);
}

function ipanoramaFOV(canvas) {
    "use strict";

    // Constants:
    var C = {
        VERSION: "1.0.1.5",
        DEG_TO_RAD: Math.PI / 180.0,
        RAD_TO_DEG: 180.0 / Math.PI,
        FOV_MIN: 1.0,
        FOV_MAX: 120.0,
        FOV_DEF: 90,
        XCENTER_DEF: 0.5,
        YCENTER_DEF: 0.5,
        RADIUS_MIN: 20
    };


    if (typeof(canvas) != "object") {
        alert("ipanoramaFOV object constructor requires a Canvas parameter!");
        return;
    }
    var Iwidth = 0;
    var Iheight = 0;
    // Canvas:
    var _canvas = canvas;
    var _ctx = _canvas.getContext("2d");
    _canvas.setAttribute("hidefocus", true); // MSIE only

    var style = _canvas.style;
    style.outline = "none"; // no focus rect; all browsers
    style.boxSizing = "content-box"; // border-box not supported
    style["-ms-touch-action"] = "none"; // MSIE 10 only
    style["touch-action"] = "none"; // other browsers
    style["-ms-content-zooming"] = "none"; // MSIE
    style["content-zooming"] = "none"; //
    style["pointer-events"] = "none"; // transparent to mouse/touch input

    var strOldDisplay = _canvas.style.display; // 1.0.1.2
    _canvas.style.display = "inline";

    // Windows: depends on viewport scaling; Adroid: constant (1.0.1.3)
    var _dpRatio = window.devicePixelRatio;
    if (!_dpRatio) _dpRatio = 1;

    _canvas.width = _canvas.clientWidth * _dpRatio; // Device px. Requires that style.display != "none"
    _canvas.height = _canvas.clientHeight * _dpRatio; //
    _canvas.style.display = strOldDisplay;

    Object.defineProperty(this, "IMGwidth", { get: function() { return Iwidth; } });
    Object.defineProperty(this, "IMGheight", { get: function() { return Iheight; } });

    // Version:
    Object.defineProperty(this, "version", { get: function() { return C.VERSION; } });

    // Background image:
    var _imgBk = null;
    Object.defineProperty(this, "bkImage", { set: function(val) { _setBkImage(val); }, get: function() { return _imgBk ? _imgBk.src : null; } });

    // Retrieve canvas drawing context to set drawing properties:
    Object.defineProperty(this, "ctx", { get: function() { return _ctx; } });

    // Retrieve canvas object:
    ///Object.defineProperty(this, "canvas", { get: function() { return _canvas; } });

    // Center (1.0.1.4):
    var _xCenter = C.XCENTER_DEF;
    Object.defineProperty(this, "xCenter", {
        set: function(val) {
            _xCenter = _checkRange(val, 0, 1);
            _paint();
        },
        get: function() { return _xCenter; }
    });

    var _yCenter = C.YCENTER_DEF;
    Object.defineProperty(this, "yCenter", {
        set: function(val) {
            _yCenter = _checkRange(val, 0, 1);
            _paint();
        },
        get: function() { return _yCenter; }
    });

    // Radius (CSS pixels):
    var _radius = _maxRadius();
    Object.defineProperty(this, "radius", {
        set: function(val) {
            _radius = _checkRange(val, C.RADIUS_MIN, _maxRadius());
            _paint();
        },
        get: function() { return _radius; }
    });

    // Pan:
    var _pan = 0;
    Object.defineProperty(this, "pan", {
        set: function(val) {
            _pan = _checkPan(val);
            _paint();
        },
        get: function() { return _pan; }
    });

    // FOV:
    var _fov = C.FOV_DEF;
    Object.defineProperty(this, "fov", {
        set: function(val) {
            //console.log(val)
            _fov = _checkRange(val, C.FOV_MIN, C.FOV_MAX);
            _paint();
        },
        get: function() { return _fov; }
    });

    _paint();


    // Functions:
    function _setBkImage(strUrl) {
        //console.log(strUrl)
        if (strUrl) {
            _imgBk = new Image();
            _imgBk.onload = function() { _paint(); };
            _imgBk.onerror = function() { _imgBk = null; };
            _imgBk.src = strUrl;
        }
        else
            _imgBk = null;
    }


    function _paint() {
        if (!_ctx) return;
        _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
        if (_imgBk && _imgBk.complete) {
            Iwidth = _imgBk.width;
            Iheight = _imgBk.height;

            var alpha = _ctx.globalAlpha;
            _ctx.globalAlpha = 1;
            _ctx.drawImage(_imgBk, 0, 0, _imgBk.width, _imgBk.height, 0, 0, _canvas.width, _canvas.height);
            _ctx.globalAlpha = alpha;
        }

        var x = _canvas.width * _xCenter;
        var y = _canvas.height * _yCenter;
        var radius = _radius * _dpRatio;
        var ang1 = (_pan - _fov / 2 - 90) * C.DEG_TO_RAD;
        var ang2 = (_pan + _fov / 2 - 90) * C.DEG_TO_RAD;

        _ctx.beginPath();
        _ctx.arc(x, y, radius, ang1, ang2);
        _ctx.lineTo(x, y);
        _ctx.closePath();
        _ctx.fill();
        _ctx.stroke();
    }


    function _checkPan(val) {
        if (val < 0) val += 360;
        return val % 360;
    }


    function _maxRadius() {
        return _hypo(_canvas.width, _canvas.height);
    }


    // general purpose functions & classes:
    function _checkRange(val, min, max) {
        if (val <= min) return min;
        if (val >= max) return max;
        return val;
    }


    function _hypo(c1, c2) {
        return Math.sqrt(c1 * c1 + c2 * c2);
    }
}

function webgl_detect(return_context) {
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
            context = false;

        for (var i = 0; i < 4; i++) {
            try {
                context = canvas.getContext(names[i]);
                if (context && typeof context.getParameter == "function") {
                    // WebGL is enabled
                    if (return_context) {
                        // return WebGL object if the function argument is present
                        return { name: names[i], gl: context };
                    }
                    // else, return just true
                    return true;
                }
            }
            catch (e) {}
        }
        canvas = null;
        // WebGL is supported, but disabled
        return false;
    }

    // WebGL not supported
    return false;
}

function getAreaCenter(shape, coords) {
    var coordsArray = coords.split(','),
        center = [];
    if (shape == 'circle') {
        // для окружности одни вычисления
        center = [coordsArray[0], coordsArray[1]];
    }
    else {
        // для квадрата другие
        var coord,
            minX = maxX = parseInt(coordsArray[0], 10),
            minY = maxY = parseInt(coordsArray[1], 10);
        for (var i = 0, l = coordsArray.length; i < l; i++) {
            coord = parseInt(coordsArray[i], 10);
            if (i % 2 == 0) {
                if (coord < minX) {
                    minX = coord;
                }
                else if (coord > maxX) {
                    maxX = coord;
                }
            }
            else {
                if (coord < minY) {
                    minY = coord;
                }
                else if (coord > maxY) {
                    maxY = coord;
                }
            }
        }
        center = [parseInt((minX + maxX) / 2, 10), parseInt((minY + maxY) / 2, 10)];
    }
    return (center);
}

function PixelToGrade(x, y, w, h) {
    if (x != x) x = 0;
    if (y != y) y = 0;
    var gradeW, gradeH = null;
    var wAngle = w / 360;
    var hAngle = h / 180;
    var wCenter = (w / 4) * 3;
    var hCenter = (h / 2);
    gradeH = y / hAngle;
    gradeW = (wCenter - x) / wAngle;
    if (gradeH != gradeH) gradeH = 0;
    if (gradeW != gradeW) gradeW = 0;
    if (gradeW < 0) {
        gradeW = 360 + gradeW;
    }
    var lat = (Math.PI / 2) - (gradeH * Math.PI / 180);
    var lng = Math.PI - (gradeW * Math.PI / 180);
    var cosLat = Math.cos(lat * Math.PI / 180.0);
    var sinLat = Math.sin(lat * Math.PI / 180.0);
    var cosLon = Math.cos(lng * Math.PI / 180.0);
    var sinLon = Math.sin(lng * Math.PI / 180.0);
    var rad = 5000;
    var y = Math.sin(lat) * rad; //rad * cosLat * sinLon;
    var x = Math.sin(lng) * rad;
    var z = Math.cos(lng) * rad;
    x = x * (Math.abs(Math.cos(lat)));
    z = z * (Math.abs(Math.cos(lat)));
    var p = new THREE.Vector3(x, y, z);
    x = x.toFixed(10) * 1;
    z = z.toFixed(10) * 1;
    return { gradeW: gradeW, gradeH: gradeH, lat: lat, lng: lng, x: x, y: y, z: z, p: p }
}

function lonLatToVector3(lng, lat) {
    var out = new THREE.Vector3();
    //    out.normalize();

    //flips the Y axis
    lat = Math.PI / 2 - lat;
    //distribute to sphere cosLat * sinLon
    out.set(
        Math.sin(lat) * Math.sin(lng),
        Math.cos(lat),
        Math.sin(lat) * Math.cos(lng)
    );
    return out;
}

function vector3toLonLat(vector3) {
    var lng = 0;
    var lat = 0;
    if (vector3.x < 0 && vector3.z > 0) {
        lng = Math.atan(-vector3.x / vector3.z)
        lng = lng * 180 / Math.PI;
    }
    if (vector3.x < 0 && vector3.z < 0) {
        lng = Math.atan(-vector3.z / -vector3.x);
        lng = lng * 180 / Math.PI;
        lng = lng + 90;
    }
    if (vector3.x > 0 && vector3.z < 0) {
        lng = Math.atan(vector3.x / -vector3.z);
        lng = lng * 180 / Math.PI;
        lng = lng + 180;
    }
    if (vector3.x > 0 && vector3.z > 0) {
        lng = Math.atan(vector3.z / vector3.x);
        lng = lng * 180 / Math.PI;
        lng = lng + 270;
    }


    lat = Math.asin(-vector3.y);
    lat = 90 - (lat * 180 / Math.PI);

    var wAngle = imgW / 360;
    var hAngle = imgH / 180;
    var wCenter = (imgW / 4) * 3;
    var hCenter = (imgH / 2);

    var xBg = (((lng + 270) / 360) * imgW) % imgW;
    var yBg = Math.round(lat * hAngle);
    xBg = Math.round(xBg);
    var el = { x: xBg, y: yBg, lng: lng, lat: lat };
    return (el);
}

function getBase64Image(img) {
    // создаем канвас элемент
    var canvas = document.createElement("canvas");
    //    document.body.appendChild(canvas);
    canvas.width = img.width;
    canvas.height = img.height;

    // Копируем изображение на канвас
    var ctx = canvas.getContext("2d");
    //    console.log('--0---')

    ctx.drawImage(img, 0, 0);
    //    console.log('--1---')
    // Получаем data-URL отформатированную строку
    // Firefox поддерживает PNG и JPEG.
    var dataURL = canvas.toDataURL();
    //    console.log('--2---')

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function getBase64ImageById(id) {
    return getBase64Image(document.getElementById(id));
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function generateUID() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

function drawDivFirsov(ob, a) {

    if ($('#upr' + ob.uid).length == 0) {
        // если нет дива - то создаём
        var div = $('<div id="upr' + ob.uid + '" style="position:absolute;cursor:pointer;z-index:0">').appendTo($('#DivPanoram'));
        var img = $('<a htef="#"><img src="' + ob.img + '" /></a>').appendTo(div);

    }
    var div = $('#upr' + ob.uid);
    div.css('left', a.x + 'px');
    div.css('top', a.y + 'px');

    div.show();
    //console.log(ob.uid, a);

}


function pointIsInPoly(p, polygon) {
    var isInside = false;
    var minX = polygon[0].x,
        maxX = polygon[0].x;
    var minY = polygon[0].y,
        maxY = polygon[0].y;
    for (var n = 1; n < polygon.length; n++) {
        var q = polygon[n];
        minX = Math.min(q.x, minX);
        maxX = Math.max(q.x, maxX);
        minY = Math.min(q.y, minY);
        maxY = Math.max(q.y, maxY);
    }

    if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
        return false;
    }

    var i = 0,
        j = polygon.length - 1;
    for (i, j; i < polygon.length; j = i++) {
        if ((polygon[i].y > p.y) != (polygon[j].y > p.y) &&
            p.x < (polygon[j].x - polygon[i].x) * (p.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
            isInside = !isInside;
        }
    }

    return isInside;
}

modelNS.IPanoramaModel = modelNS.BaseModel.extend({
    defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {}),
    initialize: function(options) {
        this.defaults.width = options.width; // > 600 ? options.width : 600;	// fix #8265
        this.defaults.height = options.height > 400 ? options.height : 400;
        modelNS.BaseModel.prototype.initialize.apply(this, [options]);
    },
    parseXML: function(xmlData) {

    }

});

modelNS.panoramaInternalImage = function (img) {
  return CourseConfig.templatePath + 'externals/ipanorama/img/' + img;
}

modelNS.IPanoramaView = modelNS.BaseModelView.extend({
    drawUprPanel: function(parent) {
        $('#uprTableF').remove();
        var table = $('<table id="uprTableF" style="width:100%;margin-top:-70px">').appendTo(parent);
        var tr = $('<tr>').appendTo(table);
        var td1 = $('<td style="width:49%">').appendTo(tr);
        var td = $('<td>').appendTo(tr);
        var div = $('<div class="panUprPanel">').appendTo(td);
        var tableUpr = $('<table >').appendTo(div);
        var trupr = $('<tr>').appendTo(tableUpr);
        var td = $('<td>').appendTo(trupr);
        var a = $('<a class="uprBipanoram buttonFa" href="#" style="pointer-events: all;"><img id="b_left" src="'+modelNS.panoramaInternalImage('left.png')+'" /></a>').appendTo(td);
        a.data('viewer', this);
        a.click(function() {
            $(this).find('img').attr('src', modelNS.panoramaInternalImage('v2/left_d.png'));
            $(this).data('viewer').nextLocation('-');
            setTimeout(function() {
                $('#b_left').attr('src', modelNS.panoramaInternalImage('left.png'));
            }, 300);

        })


        var td = $('<td style="min-width:12px">').appendTo(trupr);
        var td = $('<td>').appendTo(trupr);
        var a = $('<a class="uprBipanoram buttonFa" href="#" style="pointer-events: all;"><img id="b_plus" src="'+modelNS.panoramaInternalImage('plus.png')+'"/></a>').appendTo(td);
        a.data('viewer', this);
        $('#b_plus').load(function() {
            $(window).data('viewer').startUpdate = true;
            setTimeout(function() {
                el = $(window).data('viewer').tempPoint;
                //console.log(el)
                var p = $(window).data('viewer').viewer.camera.position;
                if (el && el.x == p.x && el.y == p.y && el.z == p.z && $(window).data('viewer').startUpdate) {
                    if ($('#b_plus').attr('src').indexOf('/v2/') != -1) {
                        $(window).data('viewer').startUpdate = false;
                        $('#b_plus').attr('src', modelNS.panoramaInternalImage('plus.png'));
                    }

                }
            }, 300);
        })
        a.click(function() {
            var viewer_ = $(this).data('viewer').viewer;
            if (viewer_.camera.fov > 35) {
                $(this).find('img').attr('src', modelNS.panoramaInternalImage('v2/plus.png'));
                viewer_.setCameraFov(viewer_.camera.fov - 5);
            }
        })
        var td = $('<td>').appendTo(trupr);
        var a = $('<a class="uprBipanoram buttonFa" href="#" style="pointer-events: all;"><img id="b_minus" src="'+modelNS.panoramaInternalImage('minus.png')+'"/></a>').appendTo(td);
        a.data('viewer', this);
        $('#b_minus').load(function() {
            $(window).data('viewer').startUpdate = true;
            setTimeout(function() {
                el = $(window).data('viewer').tempPoint;
                //console.log(el)
                var p = $(window).data('viewer').viewer.camera.position;
                if (el && el.x == p.x && el.y == p.y && el.z == p.z && $(window).data('viewer').startUpdate) {
                    if ($('#b_minus').attr('src').indexOf('/v2/') != -1) {
                        $(window).data('viewer').startUpdate = false;
                        $('#b_minus').attr('src', modelNS.panoramaInternalImage('minus.png'));
                    }
                }
            }, 300);
        })

        a.click(function() {
            var viewer_ = $(this).data('viewer').viewer;
            if (viewer_.camera.fov < 85) {
                $(this).find('img').attr('src', modelNS.panoramaInternalImage('v2/minus.png'));
                viewer_.setCameraFov(viewer_.camera.fov + 5);

            }
        })
        var td = $('<td style="min-width:18px">').appendTo(trupr);
        var td = $('<td>').appendTo(trupr);
        var a = $('<a class="uprBipanoram buttonFa" href="#" style="pointer-events: all;"><img id="b_caretleft" src="'+modelNS.panoramaInternalImage('caret-left.png')+'"/></a>').appendTo(td);
        $('#b_caretleft').load(function() {
            $(window).data('viewer').startUpdate = true;
            setTimeout(function() {
                el = $(window).data('viewer').tempPoint;
                //console.log(el)
                var p = $(window).data('viewer').viewer.camera.position;
                if (el && el.x == p.x && el.y == p.y && el.z == p.z && $(window).data('viewer').startUpdate) {
                    if ($('#b_caretleft').attr('src').indexOf('/v2/') != -1) {
                        $(window).data('viewer').startUpdate = false;
                        $('#b_caretleft').attr('src', modelNS.panoramaInternalImage('caret-left.png'));
                    }
                }
            }, 300);
        })

        a.data('viewer', this);
        a.click(function() {
            $('#b_caretleft').attr('src', modelNS.panoramaInternalImage('v2/caret-left.png'))

            var viewer_ = $(this).data('viewer').viewer;
            var el = vector3toLonLat(viewer_.camera.position);
            el.x = el.x - 100;
            var pos = PixelToGrade(el.x, el.y, imgW, imgH);
            viewer_.tweenControlCenter(pos.p, 1500);
        })

        var td = $('<td>').appendTo(trupr);
        var a = $('<a class="uprBipanoram buttonFa" href="#" style="pointer-events: all;"><img id="b_caretright" src="'+modelNS.panoramaInternalImage('caret-right.png')+'"/></a>').appendTo(td);
        $('#b_caretright').load(function() {
            $(window).data('viewer').startUpdate = true;
            setTimeout(function() {
                el = $(window).data('viewer').tempPoint;
                //console.log(el)
                var p = $(window).data('viewer').viewer.camera.position;
                if (el && el.x == p.x && el.y == p.y && el.z == p.z && $(window).data('viewer').startUpdate) {
                    if ($('#b_caretright').attr('src').indexOf('/v2/') != -1) {
                        $(window).data('viewer').startUpdate = false;
                        $('#b_caretright').attr('src', modelNS.panoramaInternalImage('caret-right.png'));
                    }
                }
            }, 300);
        })

        a.data('viewer', this);
        a.click(function() {
            $('#b_caretright').attr('src', modelNS.panoramaInternalImage('v2/caret-right.png'))
            var viewer_ = $(this).data('viewer').viewer;
            var el = vector3toLonLat(viewer_.camera.position);
            el.x = el.x + 100;
            var pos = PixelToGrade(el.x, el.y, imgW, imgH);
            viewer_.tweenControlCenter(pos.p, 1500);
        })

        var td = $('<td>').appendTo(trupr);
        var a = $('<a class="uprBipanoram buttonFa" href="#" style="pointer-events: all;"><img id="b_caretup" src="'+modelNS.panoramaInternalImage('caret-up.png')+'"/></a>').appendTo(td);
        a.data('viewer', this);
        $('#b_caretup').load(function() {
            $(window).data('viewer').startUpdate = true;
            setTimeout(function() {
                el = $(window).data('viewer').tempPoint;
                //console.log(el)
                var p = $(window).data('viewer').viewer.camera.position;
                if (el && el.x == p.x && el.y == p.y && el.z == p.z && $(window).data('viewer').startUpdate) {
                    if ($('#b_caretup').attr('src').indexOf('/v2/') != -1) {
                        $(window).data('viewer').startUpdate = false;
                        $('#b_caretup').attr('src', modelNS.panoramaInternalImage('caret-up.png'));
                    }
                }
            }, 300);
        })
        a.click(function() {
            $('#b_caretup').attr('src', modelNS.panoramaInternalImage('v2/caret-up.png'))
            var viewer_ = $(this).data('viewer').viewer;
            var el = vector3toLonLat(viewer_.camera.position);
            el.y = el.y - 100;
            var pos = PixelToGrade(el.x, el.y, imgW, imgH);
            viewer_.tweenControlCenter(pos.p, 1500);
        })
        var td = $('<td>').appendTo(trupr);
        var a = $('<a class="uprBipanoram buttonFa" href="#" style="pointer-events: all;"><img id="b_caretdown" src="'+modelNS.panoramaInternalImage('caret-down.png')+'"/></a>').appendTo(td);
        a.data('viewer', this);
        $('#b_caretdown').load(function() {
            $(window).data('viewer').startUpdate = true;
            setTimeout(function() {
                el = $(window).data('viewer').tempPoint;
                //console.log(el)
                var p = $(window).data('viewer').viewer.camera.position;
                if (el && el.x == p.x && el.y == p.y && el.z == p.z && $(window).data('viewer').startUpdate) {
                    if ($('#b_caretdown').attr('src').indexOf('/v2/') != -1) {
                        $(window).data('viewer').startUpdate = false;
                        $('#b_caretdown').attr('src', modelNS.panoramaInternalImage('caret-down.png'));
                    }
                }
            }, 300);
        })

        a.click(function() {
            $('#b_caretdown').attr('src', modelNS.panoramaInternalImage('v2/caret-down.png'))
            var viewer_ = $(this).data('viewer').viewer;
            var el = vector3toLonLat(viewer_.camera.position);
            el.y = el.y + 100;
            var pos = PixelToGrade(el.x, el.y, imgW, imgH);
            viewer_.tweenControlCenter(pos.p, 1500);
        })
        var td = $('<td style="min-width:12px">').appendTo(trupr);
        var td = $('<td>').appendTo(trupr);
        var a = $('<a class="uprBipanoram buttonFa bfullS" href="#" style="pointer-events: all;"><img src="'+modelNS.panoramaInternalImage('img/arrows-alt.png')+'"/></a>').appendTo(td);
        a.data('viewer', this);
        a.click(function() {
            if ($(this).data('viewer').fullScrin) {
                $(document.body).css('overflow', 'auto');

                $(this).find('img').attr('src', modelNS.panoramaInternalImage('img/arrows-alt.png'))
                var width = $(this).data('viewer').width;
                var height = $(this).data('viewer').height;
                $('#DivPanoram').css('top', $('#DivPos').offset().top + 'px');
                $('#DivPanoram').css('left', $('#DivPos').offset().left + 'px');
                $('#DivPanoram').css('width', width + 'px');
                $('#DivPanoram').css('height', height + 'px');
                $(this).data('viewer').viewer.onWindowResize(width, height);
                $(this).data('viewer').fullScrin = false;
                $('#fov2').css('left', ((width - $('#fov2').width()) - 30) + 'px');
                $('#fov2').css('top', 30 + 'px');
                $(window).resize();

            }
            else {
                //                fullScreen($('#DivPanoram')[0]);

                $(this).find('img').attr('src', modelNS.panoramaInternalImage('v2/arrows-alt.png'));
                $(document.body).css('overflow', 'hidden');

                $('#DivPanoram').css('top', $('header').height() + 'px');
                var width = $(window).width();
                if ($('#checkPanel').css('display') != 'none') {
                    var height = $('#checkPanel').offset().top - $('header').height();

                }
                else {
                    var height = $(window).height() - $('header').height();
                }
                var height = $(window).height();
                $('#DivPanoram').css('width', width + 'px');
                $('#DivPanoram').css('height', height + 'px');
                $('#DivPanoram').css('left', '0px');
                $('#DivPanoram').css('top', '0px');
                $('#fov2').css('left', ((width - $('#fov2').width()) - 30) + 'px');
                $('#fov2').css('top', 30 + 'px');
                $(this).data('viewer').viewer.onWindowResize(width, height);
                $(this).data('viewer').fullScrin = true;
                $(window).resize();
            }

        })




        var td = $('<td>').appendTo(trupr);
        var a = $('<a class="uprBipanoram buttonFa" href="#" style="pointer-events: all;"><img src="'+modelNS.panoramaInternalImage('v2/binoculars.png')+'"/></a>').appendTo(td);
        a.data('viewer', this);
        a.click(function() {
            var viewer_ = $(this).data('viewer').viewer.panorama.children;
            var flag = false;
            for (var i = 0; i < viewer_.length; i++) {
                if (viewer_[i].visible) {
                    viewer_[i].hide();
                }
                else {
                    viewer_[i].show();
                    flag = true;
                }
            }
            if (!flag) {
                $(this).find('img').attr('src', modelNS.panoramaInternalImage('binoculars.png'))
            }
            else {
                $(this).find('img').attr('src', modelNS.panoramaInternalImage('v2/binoculars.png'))

            }

        })

        var td = $('<td style="min-width:12px">').appendTo(trupr);
        if (this.locsound != undefined) {
            var td = $('<td>').appendTo(trupr);
            var a = $('<a alt="Фоновый звук" class="uprBipanoram buttonFa bfullS" href="#" style="pointer-events: all;"><img src="'+modelNS.panoramaInternalImage('v2/bgsound_on.png')+'"/></a>').appendTo(td);
            a.click(function() {
                if ($('#bgAudio')[0].paused) {
                    $(this).find('img').prop('src', modelNS.panoramaInternalImage('v2/bgsound_on.png'))
                    $('#bgAudio')[0].play();
                }
                else {
                    $(this).find('img').prop('src', modelNS.panoramaInternalImage('v2/bgsound.png'));
                    $('#bgAudio')[0].pause();
                }
            });
            var td = $('<td style="min-width:12px">').appendTo(trupr);

        }
        /*
                if (this.map) {
                    var td = $('<td>').appendTo(trupr);
                    var a = $('<a alt="Показать карту" class="uprBipanoram buttonFa bfullS" href="#" style="pointer-events: all;"><img src="externals/ipanorama/img/arrows-alt.png"/></a>').appendTo(td);
                    a.click(function() {
                        $(window).data('viewer').showMap();
                    });
                    var td = $('<td style="min-width:12px">').appendTo(trupr);
                }
        */
        var td = $('<td>').appendTo(trupr);
        var a = $('<a class="uprBipanoram buttonFa" href="#" style="pointer-events: all;"><img id="b_right" src="'+modelNS.panoramaInternalImage('right.png')+'"/></a>').appendTo(td);
        a.data('viewer', this);
        a.click(function() {

            $(this).find('img').attr('src', modelNS.panoramaInternalImage('v2/right_d.png'));


            $(this).data('viewer').nextLocation('+');
            setTimeout(function() {
                $('#b_right').attr('src', modelNS.panoramaInternalImage('right.png'));
            }, 300);
        })

        var td1 = $('<td style="width:49%">').appendTo(tr);
    },
    showMap: function() {
        var content = this.map.text;
        var popup = this.popupCollection.get('map');
        var el = $(new modelNS.PopupView({ model: popup }).render().el).appendTo('#DivPanoram');
        //$(el).show(function() {
        //    var img = $(this).find('#bigMapImg');

        //    // alert();
        //})
        //console.log(el);
    },
    initialize: function(options) {
        modelNS.BaseModelView.prototype.initialize.apply(this, [options]);
    },
    clickCheckAnswer: function() {
        // this.checkBut.hide();
        // this.reloadBut.show();
        // this.solutionBut.show();
    },
    getDataUri: function(url, key, self, viewer, callback) {

        var image = new Image(); //$('<img src="' + url + '" style="display:none">').appendTo(document.body);
        $(image).load(function() {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
            canvas.getContext('2d').drawImage(this, 0, 0);
            //return canvas.toDataURL('image/jpeg')
            // Get raw image data
            $(this).remove();
            $(canvas).remove();

            callback({ viewer: viewer, self: self, key: key, data: canvas.toDataURL('image/jpeg') /*.replace(/^data:image\/(png|jpg);base64,/, '')*/ });

            // ... or get as Data URI
            //callback(canvas.toDataURL('image/png'));
        });
        image.src = url;
    },
    reload: function() {
        //alert(this.startLocation);
        //this.viewer.update();
        this.loadLocation(this.startLocation);
    },
    OnPanoLoad: function(el) {
        //console.log(el)
        var w = $(window).data('viewer');
        if (w.curentlocation.indexOf('solution') != -1) {
            for (var key in w.region) {
                var r = w.region[key];
                //el.target.load(r.solutionloc);
                for (var e = 0; e < r.answer.length; e++) {
                    for (var p = 0; p < r.answer[e].points.length; p++) {
                        var pos = getAreaCenter('', r.answer[e].points[p].srcText);
                        pos = PixelToGrade(pos[0], pos[1], imgW, imgH);
                        //PixelToGrade
                        w.viewer.tweenControlCenter(pos.p, 2000);
                    }
                }
            }

        }

    },
    showSolution: function() {
        // загружаем панораму с ответом
        for (var key in this.region) {
            this.loadLocation(key + 'solution');
            //            console.log(key);
        }
        return;
        // проверяем в какой локации находимся
        if (this.region[this.curentlocation] == undefined) {
            // делаем переход на нужную локацию
            // читаем кнопки из панорамы
            var infospot = this.viewer.panorama.children;
            for (var i = 0; i < infospot.length; i++) {
                if (infospot[i].FDATA.type == 'location') {
                    for (var key in this.region) {
                        if (key == infospot[i].FDATA.location) {
                            // помещаем центер на точку перехода медленно и печально
                            // this.viewer.tweenControlCenter(infospot[i].position, 4000);
                            // делаем переход предварительно прицепив к панораме обработчик на загрузку
                            this.locations[infospot[i].FDATA.location].panorama.addEventListener("infospot-animation-complete", this.OnPanoLoad);
                            // подменяем картинку
                            //this.viewer.update();
                            //this.locations[infospot[i].FDATA.location].panorama.load(this.region[key].solutionloc);

                            this.loadLocation(infospot[i].FDATA.location);
                        }
                    }

                }
            }
        }
        else {
            for (var key in this.region) {
                var r = this.region[key];
                for (var e = 0; e < r.answer.length; e++) {
                    for (var p = 0; p < r.answer[e].points.length; p++) {
                        var pos = getAreaCenter('', r.answer[e].points[p].srcText);
                        pos = PixelToGrade(pos[0], pos[1], imgW, imgH);
                        //PixelToGrade
                        this.viewer.tweenControlCenter(pos.p, 4000);
                    }
                }
            }

        }
    },
    onRedrawPano: function() {
        //console.log(this.position, this.fov);
    },
    checkAnswer: function() {
        console.log('mode', this.model.get('params').mode)
        switch (this.model.get('params').mode) {
            case 'answer':
                {
                    // проверяем в какой локации находимся
                    if (this.region[this.curentlocation] == undefined) {
                        console.log(this.curentlocation, this.region[this.curentlocation])

                        return false;
                    }
                    else {
                        var el = vector3toLonLat(this.viewer.camera.position);
                        var flag = false;
                        for (key in this.region) {
                            var p = this.region[key];

                            for (var i = 0; i < p.answer.length; i++) {
                                var p_ = p.answer[i].points;
                                for (var e = 0; e < p_.length; e++) {
                                    console.log(el, p_[e].poligon)
                                    if (flag == false) {
                                        flag = pointIsInPoly(el, p_[e].poligon)
                                        //console.log(el, p_[e].poligon)

                                    }
                                }
                            }

                        }
                        return flag;
                    }

                    break;
                }
            case 'solution':
                {
                    alert('q2');
                    break;
                }
            default:
                return false;
        }
    },

    pointClick: function(el) {
        var el = el.target;
        var el1 = el;
        var infospot = null;
        var popup = this.popupCollection.get(el.FDATA.type);
        if (popup) {
            if (el.FDATA.type == 'video') {
                popup.content = '<video style="width:100%" src="' + el.FDATA.media + '" autoplay="autoplay" loop="loop" controls="controls" tabindex="0" ></video>';

            }

            if (el.FDATA.type == 'photo') {
                popup.content = '<img style="height:' + el.FDATA.height + 'px;width:' + el.FDATA.width + 'px" src="' + el.FDATA.media + '" />';
                popup.width = (el.FDATA.width * 1) - 8;
                popup.height = (el.FDATA.height * 1);
                popup.title = el.FDATA.text;
                console.log(popup.title)
                if (popup.title != undefined && popup.title != '') {
                    popup.hasTitle = true;

                }
                //console.log(popup);

            }
            var el = $(new modelNS.PopupView({ model: popup }).render().el).appendTo('#DivPanoram');

        }
        else {
            //console.log(el)
            //console.log(this)
            var popup = this.popupCollection.get(el.FDATA.location);
            if (popup) {
                var el = $(new modelNS.PopupView({ model: popup }).render().el).appendTo('#DivPanoram');
            }
            else {
                switch (el.FDATA.type) {
                    case 'location':
                        this.ipanoram.loadLocation(el.FDATA.location);
                        break;
                    case 'audio':
                        var imgOn = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAfCAYAAAGHa02RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABOFJREFUeNpi+P//PwMIm5ube4FoMEer98r/mbsv/5eVle1nePrxV3Tnnkf/QQAkAVbx+svvLBAHxAYIIAaoGQIws8AckGxRURFYBSOIUyp9m+HyqcMM/1k5d8BtaezoOwxiAwQQzAy4VhAGWQ8TZwRJaPddfc8ABCWy9xl6HisyeDydx7BDOonh8wTPCSAFDG++/sl69/HT1ODF9xj+sXKC1DKE/951pK680BbZCrD7YXbDMEAAoSh4+fLlJaySOZ3zwI6r2vHkP0yMCWRPbtf8//tYzMB2trpLM1TvfPofxGZBlgABoC9gzP9M249eALMiRB6D6atF2mB6753PYD8zqPjn/9/Zl8fgt/EHWIKXnZnhRLYGI1gSBEAK2O3T4BIQg5GcvnnP4ZfIfIAAQpFEDndkryGHPTKGWwsFAkDfvUf2HQwEaAswLE61nPDo0aNCmBhMM4YmmK+Boc4we9tJhvdXDoIjFtkQxs8//94xn3JdGd0mWGoABQBQDTxVwMDJHM27TDxsTCoH09Wzfx6cBbcRhH+8gYQ7MOTA/IP/teHBDEo5IH0ofgYlMYuo4qmgIEcHIE1eX7ZDkhs8jrGEIij5KfvlgUMb6KX/6EkRV2iTBAACCFc8M3z48CFt7ty524BquHCpYcFm4Luvvx8bV2+Q4VIyZ7j/4v0LRkZGCaDib+jqmLBqLF8G1GgC5nsvfcoLNYALr2Z0jTCAywAWfBrNJVkYco04GAzV5UGZkBfdCyzYNGZbijFkWYqC2Tv2H2HY8uUfugvABrDgcioiuwsCDeMB0t8wDGBS98vC0IiSzf5/whADGQCkapmOL+35+e/XD7hEvc5HBjm2L5DEn6XOcLTYEu4FGFgfq/QXSK0FR/btZ+9+aLSf+Y8MQElzw+U3YPbOnTv/wwrlm6++/QFqtENJnneev/9RuuMF+/pETYbK/nkMm/6bYzgXZKO6GJcTUM8h5MIAboDvwnvsTGwcBDViJBIVSUGOzfFKKGGASyPOjAELA3Q/omOcuerxqw9v7z158RGXRorzM0CA4bQZV3n+9suvx10LN/23qljyv23H3f93n73+DK7S8eR7SlwtAMwCl+unLpHZ8oiJAT01g4ryVAPuz3amenMfP35cja3cQAeELMZrIbYKiVgH4LKYJAthNYKF+D+GezeuMOiaWhN0AEb1is9CaT5WBlcZYNtNkpnBWFWagZuLE8MBxcXF8MoQXwjAq2ZifAgqE4NUmBkuXLnGcObBO4aTLxkZHjBKwptcIPm7azpQamFcDmB5+un30lnr9kYtOvMSaKEZEOMP0u0HjoGre1B5ysBGXM7ZcPUDCPPGzj5eECjzzRZY5k5i4WJl0t68+wADh24oyVnRVJabYYqPJAMPJzu40cLAxMjQhUc9qDlXZqsoDGTKswhyMhvsmtWS9eHT5z6PjAZ2Vss4BljBV2knwhBjIo6iedGid0BSEcxeEKoAFxcXh6j78uMP1oS3KEz+74p5M44LcBeBgvoQRjsG2QH7MrQYJAVQE1B4RjHDFTVEHLoosDPocL5nuPPwKcP2t8IMfzmFsFpYXwGxEG92QncAtqKfUNbCZSFRBQipDiDGQmJLLqIcQIqFZFUSoGYoqN4DNUVBdR+oKQqq+0DNUXzVGLWrNgdgfnwF1H+NHM0AS0TMo45BfOgAAAAASUVORK5CYII=';
                        var h = el.FDATA;
                        var infospot = new PANOLENS.Infospot(500, imgOn);
                        var p = PixelToGrade(h.x, h.y, imgW, imgH);
                        infospot.position.copy(p.p);
                        infospot.delta = 40;
                        infospot.addHoverText(h.text);
                        infospot.FDATA = h;
                        infospot.FDATA.type = 'audioOn';
                        infospot.popupCollection = $(window).data('viewer').popupCollection;
                        infospot.ipanoram = $(window).data('viewer');
                        infospot.addEventListener("click", $(window).data('viewer').pointClick);
                        infospot.cursorStyle = 'pointer';
                        var p = $(window).data('viewer').locations[$(window).data('viewer').curentlocation];
                        p.panorama.add(infospot);
                        infospot.show();
                        $('<audio id="audio' + h.uid + '" autoplay="autoplay" class="audiob"><source src="' + h.media + '" type="audio/mp3" /></audio>').appendTo($(window).data('viewer').audio);
                        el.dispose();
                        break;
                    case 'audioOn':
                        var imgOff = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAfCAYAAAGHa02RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABLVJREFUeNpi+P//PwMIm5ube4FoFgYgYGRkbFi+fHmInJycK8OHDx9CZ8+evec/SJqBoQGs/NOnT6kgDogNEEAMUDMEYGYxAWUEgGYUFBcX/webB1K6aNGikgsXLnADJTYzQMxiaGhubt4NYgMEECNUgAGmFcSQlZXlf/ToUSGIDTOzASS5ePFisILQ0NACkBjQnf1wZwF1fODg4OgAuxXJCpgz4QphEjAMEEAoCl6+fHkJq2RBQcEtkLHd3d0bUCRhEtBg+Q9TwFJYWHhrwoQJy2D+A7q4EcrcwCAqKnocpKOrq+sGTCeIBnqpA2wsSMGdO3f+w4wGSaA4CGYCTALDKzt37ryLzAcIIBRJJCyA7DVg2PdjU4dTEzrGZghOTf+h4MWLF/+BIXG3qKjoP7ohLD9//rwGjNhVQAl4WILAkiVLPsbGxk4ABgAHMPJ/ADXXg8RLS0svgGiQPiZ2dnYtYKQ/BYaWO0gQaGI9CH/+/JkfxH/48GE5iL958+aNID7IMGACsQbpQ06cDEANqcrKykmvX7/eyYAGQJpSU1ONa2pqXOGC2EIRlPyQ4w09KcIwis2kAoAAwhXPoBydNnfu3G1ANVy41LBgM/DLly+3BAQEjgKZp549e3YXmJKVgYq/oatjwqaRl5cXpPEhiC8lJTUTagAXXs3oGmEAlwFM+DSmp6erXb16tRAUz9gMYMGmcdWqVQ7AcsYexN6zZ893YLw/QHMBOAxYcDkVKbuDDcPiBWUmoMaX6BqRgYaGhji6GMgAIFXL8uTJEzUZGZlDQM5vcKmyYUM2MJq+gNjfv3+vBGYaNqieAzDNQJvTgQb4giP78ePHr4Birf+RAChpHj58+DKIDSxB4OUPUONzIG2HUhiADPDz85sDUlxbW/sEW4GArBEjbQO98AqY0WfDvIAMoE4NB6o/hDWRAP0uBnQBqEJiJaQRZ8aAhQE2pxJTeoJqjCdQQ+xwqaEoPwMEGE6bcZXnwKLq1sSJEx/q6+uvnz59+l5gIL8Elab48j1JXsZmIbRon4+tPgCFKykOIBRcAsA8dwqY3hiA1etRfNkHBIAOMIiOjgY2dMxXAOOpGlvBhbMAQ7LwFrA+PwXK6NA6Ha+loBrh/fv3zMBa4XJeXp4iKMODWivYCj5scYw3SC0tLSfMmjXr6KlTp14DHfbvPxYAq0kJRQETKT4EyhsEBASYffz4kXvatGn3PT09t3BycnaCijoQXr169UFk9aCaGFRaYQsBFmDwzJoxY4Z1VVUVwTgEAWBh9BVU3ZOSc0AOAGFQGnB1dd0FtHwWqEmgB2yUghLBM1KzYlpamsLXr19rQFUJsNFS7+DgYINP/eTJk2+oqKiIApnyLFxcXBbAOEsFBl+rkZHRXWCVsg9W8G3fvt3bw8PDBFkz0JFw9syZM+NhbHFxcJ3ADIyyX9gS3okTJ+KB9fwVHh6eVHAZiN4EARVX0GZI67t37z6hJ57w8PDXyAkOGEVrly5degfYvrnCz88/AVkO1IwBJS5QUwa9CMSaj0ENKWwhQCxA9iGwDGjGKOVBdS++AoRUBxBjIUllNXoUoOdvfEFKaVmN1QHkWEiNqs0BmB9fAfVfI0czABtVkI2IicYuAAAAAElFTkSuQmCC';
                        h = el.FDATA;
                        var infospot = new PANOLENS.Infospot(500, imgOff);
                        var p = PixelToGrade(h.x, h.y, imgW, imgH);
                        infospot.position.copy(p.p);
                        infospot.delta = 40;
                        infospot.addHoverText(h.text);
                        infospot.FDATA = h;
                        infospot.FDATA.type = 'audio';
                        infospot.popupCollection = $(window).data('viewer').popupCollection;
                        infospot.ipanoram = $(window).data('viewer');
                        infospot.addEventListener("click", $(window).data('viewer').pointClick);
                        infospot.cursorStyle = 'pointer';
                        var p = $(window).data('viewer').locations[$(window).data('viewer').curentlocation];
                        p.panorama.add(infospot);
                        infospot.show();
                        $('#audio' + h.uid).remove();
                        el.dispose();
                        break;


                    default:
                        console.log(el.FDATA.type);

                }
            }
        }
    },
    loadLocation: function(id) {
        $('.audiob').remove();
        var list = this.locations[this.curentlocation].panorama.children;
        var imgOff = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAfCAYAAAGHa02RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABLVJREFUeNpi+P//PwMIm5ube4FoFgYgYGRkbFi+fHmInJycK8OHDx9CZ8+evec/SJqBoQGs/NOnT6kgDogNEEAMUDMEYGYxAWUEgGYUFBcX/webB1K6aNGikgsXLnADJTYzQMxiaGhubt4NYgMEECNUgAGmFcSQlZXlf/ToUSGIDTOzASS5ePFisILQ0NACkBjQnf1wZwF1fODg4OgAuxXJCpgz4QphEjAMEEAoCl6+fHkJq2RBQcEtkLHd3d0bUCRhEtBg+Q9TwFJYWHhrwoQJy2D+A7q4EcrcwCAqKnocpKOrq+sGTCeIBnqpA2wsSMGdO3f+w4wGSaA4CGYCTALDKzt37ryLzAcIIBRJJCyA7DVg2PdjU4dTEzrGZghOTf+h4MWLF/+BIXG3qKjoP7ohLD9//rwGjNhVQAl4WILAkiVLPsbGxk4ABgAHMPJ/ADXXg8RLS0svgGiQPiZ2dnYtYKQ/BYaWO0gQaGI9CH/+/JkfxH/48GE5iL958+aNID7IMGACsQbpQ06cDEANqcrKykmvX7/eyYAGQJpSU1ONa2pqXOGC2EIRlPyQ4w09KcIwis2kAoAAwhXPoBydNnfu3G1ANVy41LBgM/DLly+3BAQEjgKZp549e3YXmJKVgYq/oatjwqaRl5cXpPEhiC8lJTUTagAXXs3oGmEAlwFM+DSmp6erXb16tRAUz9gMYMGmcdWqVQ7AcsYexN6zZ893YLw/QHMBOAxYcDkVKbuDDcPiBWUmoMaX6BqRgYaGhji6GMgAIFXL8uTJEzUZGZlDQM5vcKmyYUM2MJq+gNjfv3+vBGYaNqieAzDNQJvTgQb4giP78ePHr4Birf+RAChpHj58+DKIDSxB4OUPUONzIG2HUhiADPDz85sDUlxbW/sEW4GArBEjbQO98AqY0WfDvIAMoE4NB6o/hDWRAP0uBnQBqEJiJaQRZ8aAhQE2pxJTeoJqjCdQQ+xwqaEoPwMEGE6bcZXnwKLq1sSJEx/q6+uvnz59+l5gIL8Elab48j1JXsZmIbRon4+tPgCFKykOIBRcAsA8dwqY3hiA1etRfNkHBIAOMIiOjgY2dMxXAOOpGlvBhbMAQ7LwFrA+PwXK6NA6Ha+loBrh/fv3zMBa4XJeXp4iKMODWivYCj5scYw3SC0tLSfMmjXr6KlTp14DHfbvPxYAq0kJRQETKT4EyhsEBASYffz4kXvatGn3PT09t3BycnaCijoQXr169UFk9aCaGFRaYQsBFmDwzJoxY4Z1VVUVwTgEAWBh9BVU3ZOSc0AOAGFQGnB1dd0FtHwWqEmgB2yUghLBM1KzYlpamsLXr19rQFUJsNFS7+DgYINP/eTJk2+oqKiIApnyLFxcXBbAOEsFBl+rkZHRXWCVsg9W8G3fvt3bw8PDBFkz0JFw9syZM+NhbHFxcJ3ADIyyX9gS3okTJ+KB9fwVHh6eVHAZiN4EARVX0GZI67t37z6hJ57w8PDXyAkOGEVrly5degfYvrnCz88/AVkO1IwBJS5QUwa9CMSaj0ENKWwhQCxA9iGwDGjGKOVBdS++AoRUBxBjIUllNXoUoOdvfEFKaVmN1QHkWEiNqs0BmB9fAfVfI0czABtVkI2IicYuAAAAAElFTkSuQmCC';
        for (var i = 0; i < list.length; i++) {
            var el = list[i];
            h = el.FDATA;
            if (h.type == 'audioOn') {
                var infospot = new PANOLENS.Infospot(500, imgOff);
                var p = PixelToGrade(h.x, h.y, imgW, imgH);
                infospot.position.copy(p.p);
                infospot.delta = 40;
                infospot.addHoverText(h.text);
                infospot.FDATA = h;
                infospot.FDATA.type = 'audio';
                infospot.popupCollection = $(window).data('viewer').popupCollection;
                infospot.ipanoram = $(window).data('viewer');
                infospot.addEventListener("click", $(window).data('viewer').pointClick);
                infospot.cursorStyle = 'pointer';
                var p = $(window).data('viewer').locations[$(window).data('viewer').curentlocation];
                p.panorama.add(infospot);
                infospot.show();
                el.dispose();

            }
        }
        if (!this.locations[id]) {
            alert('Неверно прописан переход в XML !!!');
        }
        else {
            this.curentlocation = id;
            this.viewer.setPanorama(this.locations[id].panorama);

        }
    },
    createMap: function(parentEl) {
        var difovv = $('<canvas id="fov2" style="cursor:pointer;z-index:600">').appendTo(parentEl);
        $('#fov2').hide();

        this.viewer.container.addEventListener('mousedown', function(e) {
            var l = $('#fov2').css('left').replace('px', '') * 1;
            var x = e.clientX - $('#DivPanoram').offset().left;
            var w = $('#fov2').css('width').replace('px', '') * 1;

            var t = $('#fov2').css('top').replace('px', '') * 1;
            var y = e.clientY - $('#DivPanoram').offset().top;
            var h = $('#fov2').css('height').replace('px', '') * 1;

            if (x > l && x < l + w && y > t && y < t + h) {
                $(window).data('viewer').showMap();

            }
        })

        this.fov2 = new ipanoramaFOV(document.getElementById("fov2"));
        this.fov2.ctx.globalAlpha = 0.5;
        this.fov2.ctx.lineWidth = 2;
        this.fov2.ctx.strokeStyle = "#04c";
        this.fov2.ctx.fillStyle = "#6df";
        var _imgBk = new Image();
        _imgBk.onload = function() {
            var s = this.width / this.height;
            //            console.log('========', this.width, this.height, $('#fov2').width(), $('#fov2').height(), s);
            $('#fov2').css('height', ($('#fov2').width() / s) + 'px');
            $(window).resize();
            $('#fov2').show();


        };
        _imgBk.map = this;
        _imgBk.src = this.map.src;
        this.fov2.bkImage = this.map.src;
        this.fov2.radius = 350;
        $('#fov2').css('left', ((this.width - $('#fov2').width()) - 30) + 'px');
        $(window).resize();
        $('#fov2').hide();
        //$('#fov2').css('top', 30 + 'px');



    },
    createPanoram: function() {
        self = this;
        this.webGl = webgl_detect();
        //alert(this.webGl)
        if (!this.webGl) {
            alert('Ираузер не поддерживает WebGl');
            // создаём без three

        }
        else {
            $('#viewerCanvas').hide();
            if ($(window).data('viewer') == undefined) {}
            else {
                console.log('Надо удалять', $(window).data('viewer'));

                for (key in $(window).data('viewer').locations) {
                    $(window).data('viewer').viewer.remove($(window).data('viewer').locations[key].panorama);
                    $(window).data('viewer').locations[key].panorama.dispose();
                    $(window).data('viewer').locations[key].panorama.reset();
                    $(window).data('viewer').locations[key].panorama = null;
                }
                //$(window).data('viewer').locations = {};
                //$(window).data('viewer').viewer.dispose();
                $(window).data('viewer').viewer.destory();
                $(window).data('viewer').viewer = null;
                $(window).data('viewer', null);
                this.viewer = null;
            }

            viewer = new PANOLENS.Viewer({
                container: document.getElementById('DivPanoram'), // A DOM Element container
                autoHideInfospot: false, // Auto hide infospots
                output: 'overlay', // Whether and where to output infospot position. Could be 'console' or 'overlay'
                enableReticle: false, // Enable reticle for mouseless interaction
                autoReticleSelect: false, // Auto select a clickable target after dwellTime
                controlButtons: [''],
                //viewIndicator: true, // Adds an angle view indicator in upper left corner
                //indicatorSize: 30,
            });
            this.viewer = viewer;

            $(window).data('viewer', this);
            this.fullScrin = false;

            var basePath = this.model.basePath;

            var bpatch = basePath.split('content/');
            imgW = 6000;
            imgH = 3000;

            $(window).data('viewer', this);


            window['allLoc'] = 0;
            for (var key in $(window).data('viewer').locations) {
                window['allLoc'] = window['allLoc'] + 1;
            }
            window['Loc'] = 0;
            for (var key in $(window).data('viewer').locations) {
                var location = $(window).data('viewer').locations[key];
                var imgUrl = courseML.modelPath(this.locations[key].src); //'./content/' + bpatch[1] + this.locations[key].src.toLowerCase().substring(this.locations[key].src.toLowerCase().indexOf('img'));
                $(window).data('viewer').locations[key].panorama = new PANOLENS.ImagePanorama(imgUrl);
                $(window).data('viewer').locations[key].panorama.addEventListener('leave', function() {
                    //$('#b_left').attr('src', 'externals/ipanorama/img/left.png');
                    //console.log('leave');
                })
                $(window).data('viewer').locations[key].panorama.addEventListener('leave-complete', function() {
                    //$('#b_left').attr('src', 'externals/ipanorama/img/left.png');
                    //console.log('leave-complete');

                })
                $(window).data('viewer').locations[key].panorama.addEventListener('infospot-animation-complete', function() {
                    //$('#b_left').attr('src', 'externals/ipanorama/img/left.png');
                    //console.log('infospot-animation-complete');
                    //console.log($(window).data('viewer'));

                })
                var radius = $(window).data('viewer').locations[key].panorama.geometry.parameters.radius;
                var hotspots = $(window).data('viewer').locations[key].hotspots;


                for (var i = 0; i < hotspots.length; i++) {
                    var h = hotspots[i];
                    infospot = new PANOLENS.Infospot(600, h.img);
                    var p = PixelToGrade(h.x, h.y, imgW, imgH);
                    infospot.position.copy(p.p);
                    infospot.delta = 40;
                    //infospot.animated = false;
                    infospot.addHoverText(h.text);
                    infospot.FDATA = h;
                    infospot.popupCollection = $(window).data('viewer').popupCollection;
                    infospot.ipanoram = $(window).data('viewer');
                    infospot.addEventListener("click", $(window).data('viewer').pointClick);


                    infospot.addEventListener('hoverenter', function(event) {
                        //this.material.opacity = 0.6;
                        //this.material.color.set(0x00ff00);
                        //this.material.map = tex2;
                        this.scale.x *= 1.5;
                        this.scale.y *= 1.5;
                        this.delta = 80;

                    });
                    infospot.addEventListener('hoverleave', function(event) {
                        //this.material.opacity = 1;
                        // this.material.color.set(0xffffff);
                        //this.material.map = tex1;
                        this.scale.x /= 1.5;
                        this.scale.y /= 1.5;
                    });


                    infospot.cursorStyle = 'pointer';
                    $(window).data('viewer').locations[key].panorama.add(infospot);
                }


                $(window).data('viewer').viewer.add($(window).data('viewer').locations[key].panorama);
                window['Loc']++;
                if (window['Loc'] == window['allLoc']) {
                    // создаём отдельно панорамы с правельными ответами
                    var w = $(window).data('viewer');
                    for (var key_ in w.region) {
                        var r = w.region[key_];
                        $(window).data('viewer').locations[key_ + 'solution'] = {};
                        //console.log(key_ + 'solution', $(window).data('viewer').locations[key_ + 'solution'])
                        /*
                                                var img = new Image();
                                                img.src = r.solutionloc;
                                                img.key_ = key_;
                                                img.r = r;
                                                img.onload = function() {
                                                    console.log('r.solutionloc', this.r);
                                                    img_ = this;
                                                    var key_ = this.key_;
                                                    var canvas = document.createElement('CANVAS');
                                                    var ctx = canvas.getContext('2d');
                                                    canvas.height = this.naturalHeight;
                                                    canvas.width = this.naturalWidth;
                                                    ctx.drawImage(this, 0, 0);
                                                    ctx.fillStyle = "red";
                                                    ctx.strokeStyle = "red";
                                                    ctx.lineWidth = 10;
                                                    for (var i = 0; i < this.r.answer.length; i++) {
                                                        var p = this.r.answer[i].points[0].srcText.split(',');
                                                        console.log('start point', p);
                                                        for (var pos = 0; pos < p.length; pos = pos + 2) {
                                                            if (pos == 0) {
                                                                ctx.moveTo(p[0] * 1, p[1] * 1);
                                                            }
                                                            else {
                                                                ctx.lineTo(p[pos] * 1, p[pos + 1] * 1);
                                                            }
                                                        }
                                                        ctx.lineTo(p[0] * 1, p[1] * 1);
                                                    }
                                                    ctx.stroke();
                                                    $(window).data('viewer').locations[key_ + 'solution'].panorama = new PANOLENS.ImagePanorama(canvas.toDataURL());
                                                    img_ = null;
                                                    canvas = null;
                                                    ctx = null;
                                                    $(window).data('viewer').locations[key_ + 'solution'].panorama.addEventListener("infospot-animation-complete", $(window).data('viewer').OnPanoLoad);
                                                    $(window).data('viewer').viewer.add($(window).data('viewer').locations[key_ + 'solution'].panorama);

                                                };
                        */

                        $(window).data('viewer').locations[key_ + 'solution'].panorama = new PANOLENS.ImagePanorama(r.solutionloc);
                        $(window).data('viewer').locations[key_ + 'solution'].panorama.addEventListener("infospot-animation-complete", this.OnPanoLoad);

                        $(window).data('viewer').viewer.add($(window).data('viewer').locations[key_ + 'solution'].panorama);


                    }
                    //                    $(window).data('viewer').viewer.setPanorama($(window).data('viewer').curentlocation);
                }
            }


            this.dinPos = { x: 0, y: 0, z: 0 };
            this.drawUprPanel($('#DivPanoram'));
            if (this.map != false) {
                this.createMap($('#DivPanoram'));

            }




        }
        this.viewer.updateCallbacks.push(function() {
            var p = this.viewer.camera.position;
            el = $(window).data('viewer').dinPos;
            //console.log(p);
            $(window).data('viewer').tempPoint = p;
            //            if (el.x != p.x || el.y != p.y || el.z != p.z) {
            var pos = vector3toLonLat(this.viewer.camera.position);
            var location = $(window).data('viewer').locations[$(window).data('viewer').curentlocation];
            if ($(window).data('viewer').fov2 != undefined) {
                var canvas = $(window).data('viewer').fov2.ctx.canvas;
                var yscale = $(canvas).height() / $(window).data('viewer').fov2.IMGheight;
                var xscale = $(canvas).width() / $(window).data('viewer').fov2.IMGwidth;
                //console.log(location.ymap * yscale, yscale); //IMGheight IMGwidth
                $(window).data('viewer').fov2.radius = 45;
                $(window).data('viewer').fov2.yCenter = (location.ymap * yscale) / $(canvas).height();
                $(window).data('viewer').fov2.xCenter = (location.xmap * xscale) / $(canvas).width();
                $(window).data('viewer').fov2.pan = (pos.lng - 90);
                //console.log(pos.lng)
                $(window).data('viewer').fov2.fov = this.viewer.camera.fov;
                el.x = p.x;
                el.z = p.z;
                el.y = p.y;
                //console.log(location.ymap, location.xmap)
            }
            //            }
        });
        //this.viewer.render();

    },
    nextLocation: function(step) {
        var locations = this.locations;
        var curentlocation = this.curentlocation;
        var countLocation = 0;
        var d = -1;
        for (var key in locations) {
            if (key.indexOf('solution') == -1) {
                countLocation++;

                if (key == curentlocation) {
                    d = countLocation;
                }
            }
        }
        if (step == '+') {
            if (d < countLocation) {
                d++;
            }
            else
            if (d == countLocation) {
                d = 1;
            }
        }

        //console.log(d, 'd')
        if (step == '-') {
            if (d == 1) {
                d = countLocation;
            }
            else
            if (d > 1) {
                d--;
            }
        }


        var nextLocation = 0;
        var nameL = '';
        for (var key in locations) {
            if (key.indexOf('solution') == -1) {
                nextLocation++;
                if (nextLocation == d) {
                    nameL = key;
                }
            }
        }
        this.loadLocation(nameL);

        //console.log(d, nextLocation, nameL);

    },
    render: function() {
        modelNS.BaseModelView.prototype.render.apply(this);
        var self = this;
        this.xmlData = $($.parseXML(this.model.options.xmlData));
        //this.xmlData = courseML.getHTMLFromCourseML(this.xmlData);
        //console.log(this.xmlData);
        this.audio = $('<div style="display:none">').appendTo($(this.el))

        var basePath = this.model.basePath;

        this.curentlocation = this.xmlData.find('ipanorama').attr('location');
        this.startLocation = this.xmlData.find('ipanorama').attr('location');



        this.webGl = true;

        this.width = this.xmlData.find('ipanorama').attr('width');
        this.height = this.xmlData.find('ipanorama').attr('height');
        this.showpoints = this.xmlData.find('ipanorama').attr('showpoints');

        this.model.width = this.width;
        this.model.height = this.height;

        if (this.height == undefined) this.height = 400;
        if (this.width == undefined) this.height = 600;
        if (this.showpoints == undefined) this.showpoints = true;
        this.locsound = this.xmlData.find('locations').attr('locsound');
        if (this.locsound != undefined) {
            $('<audio id="bgAudio" autoplay="autoplay"><source src="' + basePath + this.locsound + '" type="audio/mp3" /></ausio>').appendTo(this.audio)
        }
        //console.log('this.locsound', this.locsound)
        this.locations = {};
        var locations_ = this.xmlData.find('locations').find('location');
        // подготовка картинок
        //this.getDataUri()
        //делаем карту
        this.map = false;
        this.startUpdate = false;
        if (this.xmlData.find('map').length > 0) {
            this.map = {};
            this.map.src = courseML.modelPath(this.xmlData.find('map').attr('file'));
            this.map.text = this.xmlData.find('map').html();
            //PANOLENS.DataImage.ViewIndicator = this.map.src;
        }
        //console.log('this.map', this.xmlData.find('map'))


        //console.log(locations_);
        for (var i = 0; i < locations_.length; i++) {
            // формирование кнопок интерактивных
            var points = $(locations_[i]).find('point');
            var p = [];
            for (var e = 0; e < points.length; e++) {
                var t = '';
                if ($(points[e]).find('title')[0] != undefined) {
                    if ($($(points[e]).find('title')[0]).length == 1) {
                        //console.log($(points[e]).find('title')[0].textContent);
                        t = $(points[e]).find('title')[0].textContent;

                    }
                }
                var b = {
                    pan: $(points[e]).attr('x') / 16.66,
                    tilt: (1500 - $(points[e]).attr('y')) / 16.66,
                    text: t,
                    type: $(points[e]).attr('type'),
                    orientation: $(points[e]).attr('orientation'),
                    location: $(points[e]).attr('id'),
                    x: $(points[e]).attr('x'),
                    y: $(points[e]).attr('y'),
                    width: $(points[e]).attr('width'),
                    height: $(points[e]).attr('height'),
                    uid: generateUID()
                }
                if (b.orientation == undefined) {
                    b.orientation = 'diagright';
                }
                switch ($(points[e]).attr('type')) {
                    case 'photo':
                        //b.img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABHVJREFUeNpi/P//P8NAASaGAQQDajkLkeoEgNiACHUPoJhqljv8+PFz65VLV9/8/v0br3o9fR3he3fvd+jq6zQQYzkjoQT38sWrPbU1DYzzFswWBHI/4FMrISHDceXyeVMRUVG/P39+b6fU5wLiEmLOK9es2gdkXwTih/gUv3jxhOHtm3eK/r5BRUDudlJ8jhGvQF/XnDxxUjgoJAjkyE1A/JuQgTmZeQbJKYl2R48ea8vISjuDLz3ALA/49ev3kksXLr9FjteDBw8/ramrfA+19AyxCcnPJ9A2IyPNmIeH+xsjIxPYAn1DPaHnT59PV1ZVKkKxHGjxl6yM3DMLFs3lwxKvr4H4OsxXKWnJJjq6WtIwyVcvX39cOH/xmc7e7jMf3r/5gaRPCohVYBw1NW2eY0cPGCbEp1Rs2LSmF2a5w5PHTxcpKCq8wRWvAoIiHKdOHEuSV5AXZmZmwigb/vz58//r129/3N29F505c+IJsr6pkya5RMdGbQHxp0+Z4ffy5SuGhua6QGCCfAg26M3rN3+A1FdcFl+7cilDSVlRFJvF4FTLwsLIz8/Heujg3iQjQzO4b+/cup4bHhlqvG71unQQ/9v3758UlRRAdpigl3BYE9OiefO8xMRF+WH8f//+MXx4/+HfiWMnfzx88Og3iA8DbOxsjKtXrwgDMsHqF8xbdOr3r9//65tavgO5ViAxDnb2X0QVr8rKGgJevp66MP7fv3+B8Z7/EpiPr9rY2dxQVlE+aWFhd+Pnz5/wLCMtI8niYO/iA2KXlBcfFBGX3HD58rnPQO4tksp2Tzc3BWT+quWrP8+aO+MVkHkViDcC8d5z506urCitPgyKd1gUZGWmi0MTHMPXzx8vASlQnL8hyXJLKwsZGPvTp8//+iZMAhnwAohvIqubPG3ifpClML6GhgY7kFIiFKV4LefgYIfneWD+/8/IyPgXyLxNsNhkBTuEm6Iq9cL5Sy9gbGFhIWZnJyc+rNHj7q0ATHjweH9w/8FvYqprvAp27dnz4O9fhKENTTWiWpp66uhZce682QFMTEzwYN+wfiMogX2nqGI5eeroi7t37r1TU1cRBvHZ2dkZz5494bR1yzbpdes2XnR2clQICQvS5+bh5oDpAVa//xcvX/oOyHxOcX2emJiyZv+BXWlsbGxgn7GysTIGBPlrgDC6WlBWTE5Me/7922dQXr5HcTMK5Hsba8dlyHkZGwBltbiYpGcrVy97C+ReIqYGJKoNd+78qTva2obz163Z8BkWtDALoQnzp6WF3QOgxaCseIEYX8OC/YOahpokobbXgwe3H4dFhM7g4uYzU1dVlwMKgSxmfPrs6c9Xr56B6gaQw85Da0HszSw9XYl7d+/dR6lSgbXahfXrNso2tjTPRqsWcQFWaOMDBkCV0jd8Gmqr6i0qa8ptZGQVO969fXkW3MwCWQ7EAqtXrLn6n4YA2Co6ExYSlc3MzDIHiLlA9sKbUSwsrFxAKg6I7WjYVAc1ShaB6nKiWq+j3aVhZzlAgAEA/gRQK2EIdrAAAAAASUVORK5CYII=';
                        b.img = modelNS.panoramaInternalImage('foto.png');
                        break;
                    case 'location':
                        switch (b.orientation) {
                            case 'straight':
                                //b.img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAnCAYAAACbgcH8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWVJREFUeNrUmF9MW1Ucx8+5/0oLlL8tFJD/K+AgqVm2EeMciXGJ0yVLzBJ0uuxFfdGE6IOP4pvRuJD44IMx7kF8mNFnYpaImzqyjX9qEBiFFkppoX9oudzbv/f6O6UllNH23q44+IXTW07Pvedzzvn9vud3LpZlGR03o9AxtEODDofDFlKOBTSA9vn9/omRsb/Gfn04M85vb48VGh4XyqcBrBnKF/9YHReH/3XrXOF4or5WQ6M3Omuip0+2/QD/Dmg0ms2nDg2g5XAZWrA7X/92wl7iTsLut65SDl2xNG0119fcIO2fBD5v6CTsgGPN/f6tyeWqOT664284+33nDDr0ynOtvooy/UcAfvN/gwbggc1g8NOfHy7qp/yhDE8mf5lH8GpDMTpvMS9oOO4dgB89NGiAvc5vC5+NTFqN9zwi3seYPeIzNHiz0xjpbmuYZBimH+BtBYMmiiAIwo0Hs/aTI6vbnOIZyTmUHavkKHS5q1ZsbzTdUhKsWaGJVEWj0a9nrMstPy0GatTMbD7aWq+l0ZVTrXyZvvRLAB9UBZ2Sr2Xn+gsji/7aQEwqqNBjnH3I3WUMeqmnZV2n0318ULCmQacUwbXu+eD2vLtiVYzjDDGmeqpx8rOUwWgrpiyOeqtZ6UxXyzSAf7g3WHehAXjQ6/O9e3tuvdYhRBN91GiohL8VMZRsLGEFmqKipVpWh2RZAh/XNDQ04FmbUxh1hXSZQdPNCM/s7+1AgUAASZIkkmZbQkiIxOKUEI5p3NtRLWGa53f0voShUG9daaijyXQHgvU9EqwJ6GAweD4ej4/6/P4IAYIHFpEb/D4fAp9GkUgEeX3etM5NtSZ0+sxZ8btxu1b5TO9YX32xXFdZin3w/DRXoygEUInv5ErYMEwUfIkzDCuDVw0ajcbPGdIgFAqFOY5Dv9+9w8HocwKQtmd7e9Gf806OhY6wSleZ9oSwubFOhsnCsVhst570LYpi4nvqCsaSYltaEmGQ99++dm0njqCxR41ed3U9i5zrHq9dkGiWphBD5S6kXaqEZYzG55awwWBQ3Ke8B5BKVsSU3lxVWYXMZnP8D3e4iiHAWcpe0P2DeCRQKBaX4lqtVrX6MMnr8r6ZJg7sIG4N5bdkXSJ6X75w4av7s7YT0DG9T8dU6/e0fZ1+sadtemFhYSBZRVLYclj5buBpB2ksAT9vS/4mpkGbTCZpePj7KohO6erVtzaz5Ryra26jPURpGPoxXtUS6Ib1dbo9ne3t7RYIvKHUxBxkGxsb1a9duuRRlXuQDQcUZvqXGYdelJ58606ZnpZRX1fDFk3TjUrTVTUb2s2/rSugP9mDjKFxsijzdxHRyOpwEZ0bLGiWB7N82b8Z+Oaek6/e3dvydIkDJRTL6FybUWJZtk1JppcTmmzt4BZ2CJpiTxTRebkEzl1VjUKSxdx8F6D7lKpHNhuyrThcm1KROS348j0qZajfRFpqi+efJxtmrkNBrtS0D3bLkQkXr4lJclZQde5ysDwWoyiytJjsAN2cF3Qy45uaXXYZ/TKrzXfZ1f7SqkO8obpSfT6dyvpWHI5+F9J1FOSMgpVV07KEekzlQZDApkwSmOkQYIHM7sEjr0BH5MwLj/N07Fz3lUui0FRX+yNAX1cDPWVdcTYKbEmFwhXOOzgznWLMFUVEAk8B+FRO9SBu4fF6DeEifQWjYM0Lqdd7zba2IZ1orCNbe19OaDiRfOL1eORYOKwahuM0SF+mL8wLOxYzMIGtqUNBVmiSiNttNkxOEXnZSuFeNELS/wxJ+nPmHsfhJfuB0DhfWXha0Ango838uE/zPN8Cl+YjwEambuxQ3k8fCfc4DvafAAMAxeWF4bcoPXgAAAAASUVORK5CYII='; // basePath + '../../../externals/ipanorama/img/arrowUp1.png';
                                b.img = modelNS.panoramaInternalImage('astraight.png');
                                break;
                            case 'left':
                                //b.img = 'data:image/png;base64,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';
                                b.img = modelNS.panoramaInternalImage('aleft.png');
                                break;
                            case 'right':
                                //b.img = 'data:image/png;base64,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';
                                b.img = modelNS.panoramaInternalImage('aright.png');
                                break;
                            case 'back':
                                //b.img = 'data:image/png;base64,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';
                                b.img = modelNS.panoramaInternalImage('aback.png');
                                break;
                            case 'diagleft':
                                //b.img = 'data:image/png;base64,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';
                                b.img = modelNS.panoramaInternalImage('adiagleft.png');
                                break;
                            case 'diagright':
                                //b.img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAAyCAYAAAAUYybjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAB8ZJREFUeNrsm9tvG0UUh8/s2l7HsePc41waNb3QUlpECxQQFAWJUgm1pQiJPkBFVJ6RigTPFIk/oAiJ5yKEeGwRr0hNKaAAEXIV0pCUNqnT1HZ8X9/2Yu9wxnVS29l1bMdNTOQjrWY9u+vd+Xx+Z86cbAilFJpWmXFNBE1YTVhNWE1YTVhNWE0ETVhNWE1YTVjb00xNBA9NluVnsGkv6HILghDdVrBwkDux2VnSPbqyk0wmhwnHHeUIZ8WPhBDsS0sOi9ksaJSashrlZDVr9UdTqxcfGunLeL3e73bt2jXWMLB0BjpacMypqOorZpO582EPJcm03GKxmO2UUk7DQVJ8fk8gXjSGO+Ek3IsmVz8n1CzciiR0758jV2LtZh6+3t1vunvnjoawGkeGqqrOm81mUDNZ+OvuMkx4AkXHJwNiXYKuheMKAJU/91lXR671LHqWGypmofdAJpPJ/cKHhpz0yK4emkhJ6tRiRPj9fggEznhkHKn+fgTWv+jYSDcEg0EZd+81XIBnxcd8AZKoikJaLCbh6O4ewI0ixWw0IdFJT8js9sXAm5Sq9jK6jjuVXtPtsFLf0mIWd+82/GyoadojR8Dna28V4PUnB+D4gUHK8TwNxpLUvRjhf0PPi6vZmvMfI36dTgdxT3ptuDv7v0sdGDye54HjOKJls4DwtP19bZo/KXMzIdFAbrXAI7C/y5HbD4VD4vnzHy40FCwEwKLpKAI5ge07+Lkn358DhP0Up30aEVN06kGMnw7ESDCtrD6zhecqh2TgSoW9zw91QiwWU9CuNVxS2tHRwZK+qxjo2a84K0nSeYwxe4NxyXp7OQ4zAZGEJIUUDsmCECudESmpLr4NdNi0gN/Lgvt4w8DKZ8ujaUl6H9t9kYTc+m8gTmaCcYhIatG5Zh04G5Ob8TG7zcpNeb1Mi+4tg7UCB937HZTVYTEp2RaCSeL2RRGOUvxAFeQElUBymAic2N0FbW0O7crUEheV1bLf5XK0gAl/mHA4BBivNs+z8pn5KLZncQY7hrmTdSGU5GeDCfAn0sWeUwqHVO8vpfnTSCsPr+7rp4osE1VKcWMv7aU35rzkJqYfRrc60OOAVCqVSSQSvz7WhXQBnHexfTGlZByeUNI0F2JwpKKlhclAVqQG3egdOdotwNN7hmB2dpbcvOmGw4ePsNhIXtnrgoMD7dqP00uclNHWXDfY3sKS0bRRvKoZ1gocXK6cRAjHJVkRvDFJ+NsvwnJJ4mjOz1j6Yya1y63koA099NgOB/T3dsONn38Gr8+7JgVpa7Fw7z03kv1p1s8vicnieGW10PsLYWIUryqGhXBY6eIMgwMP4ViX47LldigJS2Kq+AtX4NQSfMtdRYy7B6wcvIBLJSa7q1eugKI+ioMtLS2ll/AnDgzA/LIIv9wL5L7BYTGB1SoQr/eBvWrPysNhnnNKo/S0rGbaA6Jsmo+k4EG8NOZwVc04tXmR8dGDTh6eGhlclV2JxZ1OJ3OxJwo7s5jcDne1wtkOm3r9TsDc22phi3oaDoc9GNyj68JCQKw8ckZR1HezmtYVSkgWT0yGhZLyhonnDEdbd28qYzac7Q73CODq0ZcdGgvUJ/v7+6MYtC/i/mdrXIwj5uP7+6mkqCQej5eNV0WwkPb3mDW7wqjlSa8IqXwQNISzoXyH1OR9K/dqx6d+brgDUHZQKru8fY4ecnE1HtntFxHYOC7Yf8QYay88EWdA4vf7YebWrVg1sFxsxupytsKbnW3gDUZhKpiCtKrVNfErh7cSgMOCBgdHBpjsQEd2TAan9PIkBDaOwHbg7mXc3iqU5D8zMyDGxWi54L4mZrFSCZePQb0dDnijux18oRjcjaQhomQ3NnttCO5De8rJwWCfy0h2f+dBLRhm6HY7A3IGoV3AsX6BztHKxpyvdITxWnelnpVbvOpBc3U5ISrGYTaUhqiibRKkRwftHHqTy1FOdl/iQC9Uel+Edikvy2/ZHEGBlc6Ie73rVmHxOskig8akydo2eyu80ObIQbsdlkBUqSGpesLr4zOwb0dfOdmdQ1BXq70XAmNfdggTURwencFxfrXu8xW+JonBbizvnoPlKpsMoIS/sgfl6UtnimpC9ZToiDWDSWZPOdmdW0869TSi905pJdBWjEG7H5MgKGt1A2UFDXZ3WnNJ5vi1a3qy+wa3C+Vyok2DVQs09seHUEKGBxKtKOs2rBZoEuwZ6IH5+Xn4888/9GT3EUK6vBWlJVLJ28oIbTQP7eVyZVk2STCl+mMJ4perT0J7SRr6MMmcmJgAj+felsuuJli1QltGaMEMt266YdIyMGg3A8Up/Pr1ccCZqvS0H3Ab22zZbQhWLdDYLBuKxSGc5WBNZQRJWaQE7HR1G8mO2ccI6RI0gJGN/NMAg4YJ3aeYk71ZCbQwph1RaoJs/pZ2OQ693V1GslvE7fRWyq6usAqgsfoWW4t9UAm0aEzElisnu+ss095q2T0WWNVC8/l8sIyL1+lb03qnFC2CG8nq+jKbzWZbwG2M5ZP5XEg3qRUEAebm5tbUnnB7rVFB1R2WAbTPEVCy1Lt0ZDds9FeVbSnDMvJklVe20v+ErfRZ/eiXGzdAzahVL4K3nWfpeFoUt4sIaoh5mqIouM6n/+L+2/8XUJvmWdvFmm8rV2H/CTAA0IIDXzGR57gAAAAASUVORK5CYII=';
                                b.img = modelNS.panoramaInternalImage('adiagright.png');
                                break;
                            case 'diagdownright':
                                //b.img = 'data:image/png;base64,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';
                                b.img = modelNS.panoramaInternalImage('adiagdownright.png');
                                break;
                            case 'diagdownleft':
                                //b.img = 'data:image/png;base64,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';
                                b.img = modelNS.panoramaInternalImage('adiagdownleft.png');

                                break;

                            default:
                                b.img = modelNS.panoramaInternalImage('astraight.png');

                        }
                        break;
                    case 'popup':
                        b.img = modelNS.panoramaInternalImage('info.png');
                        //b.img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArZJREFUeNpi+P//PwMZWOHm9Vv9/r7BxczMLKLkmEGyhtevXq88dODwi7iYpJO7d+29tXzJihtAyzNoajHI0rmz5z8EWrQFiBtAeMPajRfWrdlwkVTLmRiIBG9ev1m5aeMWi7SM1MtA7hmYeHBY8AYmRsb/q1euyWRhYc0g1jwmSiylxHImSi0l13ImSiw1N7OW4BMQFiLHciZyLZ0za57n0WMH0u/dvpGpqanrQKrlTOQGb0JSrBmIFhAUYPH28JQDMrlJsZyJ3Djdt2f/LRj7yLGjL4HUV1LinBGcmUm0FAayM3KNtmzf/v7hwzuPgdw/2NSsXbU24N///4yh4SHT//z5PQPDYlItJQVgsxxsMbGWCgiKcJQVl9hLSUmKyMjI8Ds42YlWlFbf7+nvWose1IQsZ3r25Fnl9q07TYjxqaWZuYScrIxgTFyUCshSXPGLL59PnjAlGBjnnoxfv367JiEp8/Hb1087iQk2T3dvhc1bN8SD2B/ef/gjIiq6Csi8TWywv3//LkJQUGg9E6nxFRoSrAFj79m19z2QekdOvDN9ePd+8dSJk8SAbBNiNJhbmCvB2GvWrn8NpD6SksiWLFwGygGHmKRkpNo9vd3PzJoxW5eQ5crKGgLqmmqiMP7xkyce4cpGuBJXbkHOWmDi2g4OahFRkXA/f58ThCyPCg+HB/OZU+e+PH368DG52Qkex8RYbmtnrQgP5tVrXwMriB/IlQQpBQhK4iJkuZOLoxqMffnKlXfHDx+K0FLXMCXVUqxlNS7LQfGLrK6puUFt48bN306cPHqEVEtx1k7YLL9798YHYMvyNUzN3j373lXVVGzGVngQshSjkiCmpjI1sZR+/eYN04MHtx+T41OiLCa18iDWUqLaXMRmNVIsJbqVSchyUi0Fg4Fq0A+NLgw1O20AAQYA3iXb+x8uGRcAAAAASUVORK5CYII=';
                        break;
                    case 'video':
                        b.img = modelNS.panoramaInternalImage('video.png');
                        //b.img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAfCAYAAADwbH0HAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABHJJREFUeNpi/P//P8NAACaGAQIsFOh1AGIPKAaBA0C8AIgvEKUbFNQkYoXfv3+f+o8D/Pr1+zKQEiBkDjIHpLjh589f95EMeQgSQzJI4e/fv1/+EwC/fv762dHWLUmMxQJAC+/gMujd2/ePQWqAPj2GLP7g/qOfxQVlT9qaO57ev/vgB7LcjWs3XzIzs3DhtRjos5uEfPHixauPyPwZU2d+ABp8GYr3gfCk/invkdXY27n04rM4AVnxrh17vpiaWl93cnR7CGR/xeaIZ0+f/4ZaeBiIu4C4AYpbkX3e0dp9DSimhc1ipj9//gTBEtr+vQe/eXp73D937uT3g4f2nQOyt+zZuffLv3//GUAYBubNXfAGyjwOxN+Q0urvA/sPXIJxbO1sRICUCdZ8/O3rNzEYZ+nS5SADfwPxHiC+CMTXL1++cp6JiZEBhNHAazRLIQYyMf2DsTk5OX4CKXmsFjMzM8MV8vLwcACph8gGCgsLsaFrSkpOEMFmqYCgCIe7l4cmjH/mzLn7OEsubh7uWzBOU2uDiKamLj+Mb25mLREaEWKIrklSSoIFmLgsQBYhWzp35kwPcXFRPpjY9Bkz30JDBgMwAiMaVALtB3FA8fj169d/e3buvsrExPzP3ctNk42NjZUJSziDwJPHT3/s27MPFCUMIJ8iW3rqxOnnVjZWoNJsxp8/v5mgJd0BKIZkp48fPp74T0Xw6OHjb/wCImsEhcRmArkTkOVOnjgTB8tOASCBc2fOf/Ty8H08acLUt9u37Pi0bfP2L6B8aWpidQuabWB59rKkpNxNkDqMvP785R8QHReTdAKYh/d8/frtGYgPNO9ecmI6qBT8f3D/IVDBYsIILI02/fzx001CWvbm96+f/0JTMyiBcQExKxB/BGJQvGMkMj4B4T/W5hb8P3/94r5z9953VlbWdzdvXs7/9PHTbz5+PtavX77+jAiPvrB951ZuUG7ZvXOPLDMz0z8nF6cpLKDsdPbM+c9AS0HxsA9qEQNaqv2ILY4/fXjLADT0PbLY2lXrrgSHBemsWLryfWpW5j2guSBLn4ESOdAx0UyMjP/h1eLfP39A9AdcFpACrly59nTe/IU/d+7exg6t749DLcZZH/+mRgXf3NZ4AkiB8rIAyJe4zGWhUQPj+qBt+gwfi2ur6i1AmO4WCwgKcNQ31bgfPngkVVlZQwCnxVzcXK9MzIx5uLj5qJLQwiNCDX58//7d0tpc6vSpo1lVFTXWWC1mYWHpA7qSZc+OHSYmJhYy5FoI8h2wZIqQkBTnb23uWq2vb7rj3t3735pa6l1AvgcFv7GJofzHj59+wCsJYLlcRa0KAtiK2QAsi5cBcQaoTG5uaDuHLB8UELYbKF7LCOvC6OmZVDvZ2wcJCgqyCQkLvSbVxx/ef/ixYPHiVw8f3mGDlvXNwOrwGwsLK5eNtUOzo72927qNG59cvXoBVMSuZUTuOwEVaQEpOyAWJTPEQeX7aaCFhzBKKhZWUNvLE1SaAeW3M464ThtAgAEAfWIwBUMJEy8AAAAASUVORK5CYII=';
                        break;
                    case 'audio':
                        b.img = modelNS.panoramaInternalImage('sound.png');
                        //b.img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAfCAYAAAGHa02RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABLVJREFUeNpi+P//PwMIm5ube4FoFgYgYGRkbFi+fHmInJycK8OHDx9CZ8+evec/SJqBoQGs/NOnT6kgDogNEEAMUDMEYGYxAWUEgGYUFBcX/webB1K6aNGikgsXLnADJTYzQMxiaGhubt4NYgMEECNUgAGmFcSQlZXlf/ToUSGIDTOzASS5ePFisILQ0NACkBjQnf1wZwF1fODg4OgAuxXJCpgz4QphEjAMEEAoCl6+fHkJq2RBQcEtkLHd3d0bUCRhEtBg+Q9TwFJYWHhrwoQJy2D+A7q4EcrcwCAqKnocpKOrq+sGTCeIBnqpA2wsSMGdO3f+w4wGSaA4CGYCTALDKzt37ryLzAcIIBRJJCyA7DVg2PdjU4dTEzrGZghOTf+h4MWLF/+BIXG3qKjoP7ohLD9//rwGjNhVQAl4WILAkiVLPsbGxk4ABgAHMPJ/ADXXg8RLS0svgGiQPiZ2dnYtYKQ/BYaWO0gQaGI9CH/+/JkfxH/48GE5iL958+aNID7IMGACsQbpQ06cDEANqcrKykmvX7/eyYAGQJpSU1ONa2pqXOGC2EIRlPyQ4w09KcIwis2kAoAAwhXPoBydNnfu3G1ANVy41LBgM/DLly+3BAQEjgKZp549e3YXmJKVgYq/oatjwqaRl5cXpPEhiC8lJTUTagAXXs3oGmEAlwFM+DSmp6erXb16tRAUz9gMYMGmcdWqVQ7AcsYexN6zZ893YLw/QHMBOAxYcDkVKbuDDcPiBWUmoMaX6BqRgYaGhji6GMgAIFXL8uTJEzUZGZlDQM5vcKmyYUM2MJq+gNjfv3+vBGYaNqieAzDNQJvTgQb4giP78ePHr4Birf+RAChpHj58+DKIDSxB4OUPUONzIG2HUhiADPDz85sDUlxbW/sEW4GArBEjbQO98AqY0WfDvIAMoE4NB6o/hDWRAP0uBnQBqEJiJaQRZ8aAhQE2pxJTeoJqjCdQQ+xwqaEoPwMEGE6bcZXnwKLq1sSJEx/q6+uvnz59+l5gIL8Elab48j1JXsZmIbRon4+tPgCFKykOIBRcAsA8dwqY3hiA1etRfNkHBIAOMIiOjgY2dMxXAOOpGlvBhbMAQ7LwFrA+PwXK6NA6Ha+loBrh/fv3zMBa4XJeXp4iKMODWivYCj5scYw3SC0tLSfMmjXr6KlTp14DHfbvPxYAq0kJRQETKT4EyhsEBASYffz4kXvatGn3PT09t3BycnaCijoQXr169UFk9aCaGFRaYQsBFmDwzJoxY4Z1VVUVwTgEAWBh9BVU3ZOSc0AOAGFQGnB1dd0FtHwWqEmgB2yUghLBM1KzYlpamsLXr19rQFUJsNFS7+DgYINP/eTJk2+oqKiIApnyLFxcXBbAOEsFBl+rkZHRXWCVsg9W8G3fvt3bw8PDBFkz0JFw9syZM+NhbHFxcJ3ADIyyX9gS3okTJ+KB9fwVHh6eVHAZiN4EARVX0GZI67t37z6hJ57w8PDXyAkOGEVrly5degfYvrnCz88/AVkO1IwBJS5QUwa9CMSaj0ENKWwhQCxA9iGwDGjGKOVBdS++AoRUBxBjIUllNXoUoOdvfEFKaVmN1QHkWEiNqs0BmB9fAfVfI0czABtVkI2IicYuAAAAAElFTkSuQmCC'
                        break;
                    default:
                        b.img = '';
                }
                if ($(points[e]).attr('file') != undefined) {
                    if ($(points[e]).attr('file').indexOf('img') != -1) {
                        b.media = basePath + $(points[e]).attr('file').toLowerCase().substring($(points[e]).attr('file').toLowerCase().indexOf('img'))
                    }
                    if ($(points[e]).attr('file').indexOf('videos') != -1) {
                        b.media = basePath + $(points[e]).attr('file').toLowerCase().substring($(points[e]).attr('file').toLowerCase().indexOf('videos'))
                    }
                    if ($(points[e]).attr('file').indexOf('media') != -1) {
                        b.media = basePath + $(points[e]).attr('file').toLowerCase().substring($(points[e]).attr('file').toLowerCase().indexOf('media'))
                    }
                }
                p.push(b);
            }
            this.locations[$(locations_[i]).attr('id')] = {
                src: $(locations_[i]).attr('file'),
                xmap: $(locations_[i]).attr('xmap'),
                ymap: $(locations_[i]).attr('ymap'),
                hotspots: p,
            };
        }

        // формирование областей интерактивных
        var hotspot = this.xmlData.find('hotspot');
        var hotspot_ = {};
        for (var i = 0; i < hotspot.length; i++) {
            hotspot_[$(hotspot[i]).attr('id')] = {
                answer: [],
                solutionloc: this.model.basePath + $(hotspot[i]).attr('solutionloc')
            };
            var answers = $(hotspot[i]).find('answer');
            for (var a = 0; a < answers.length; a++) {
                var regions = $(answers[a]).find('region');
                var r_ = [];
                for (var r = 0; r < regions.length; r++) {
                    var p_ = $(regions[r]).attr('coords').split(',');
                    var cord = [];
                    if ($(regions[r]).attr('type') == 'poly') {
                        for (var m = 0; m < p_.length; m++) {
                            cord.push({ x: (p_[m]) * 1, y: (p_[m + 1]) * 1 });
                            m++;
                        }

                    }

                    if ($(regions[r]).attr('type') == 'circle') {
                        var x = p_[0];
                        var y = p_[1];
                        var r = p_[2];
                        var points = 32;
                        var angle = 360 / points;
                        for (var ir = 0; ir < points; ir++) {
                            var angle_ = (angle * ir) * Math.PI / 180;
                            cord.push({ x: x + Math.sin(angle_) * r, y: y + Math.cos(angle_) * r });
                        }
                    }
                    if ($(regions[r]).attr('type') == 'rect') {
                        cord.push({ x: p_[0], y: p_[1] });
                        cord.push({ x: p_[0], y: p_[3] });
                        cord.push({ x: p_[2], y: p_[3] });
                        cord.push({ x: p_[2], y: p_[1] });

                    }
                    var poligon = {
                        type: $(regions[r]).attr('type'),
                        srcText: $(regions[r]).attr('coords'),
                        poligon: cord
                    };
                    r_.push(poligon);
                }
                hotspot_[$(hotspot[i]).attr('id')].answer.push({ valid: $(answers[a]).attr('valid'), points: r_ })
            }
        }
        // в region точки для задания
        this.region = hotspot_;
        // создаём попуп окна
        this.popupsData = [];
        this.popupCollection = null;
        var popups = this.xmlData.find('popup');
        for (var i = 0; i < popups.length; i++) {

            var id = $(popups[i]).attr('id'),
                width = $(popups[i]).attr('width'),
                height = $(popups[i]).attr('height'),
                content = courseML.getHTMLFromCourseML($(popups[i]));
            if (id == undefined) {
                id = $(popups[i]).attr('name');
            }

            //console.log($(popups[i]).attr('id'), width)

            if (width) width -= 8; // fix jquery .popup() generate size +8px
            if (width == undefined) width = 'auto';
            if (height == undefined) height = 'auto';
            this.popupsData.push({ closableOnOverlayClick: true, id: id, content: content, width: width, height: height });
        }
        this.popupsData.push({
            closableOnOverlayClick: true,
            id: 'video',
            content: 'aaaaaaa',
            width: 300, // fix jquery .popup() generate size +8px
            height: 200,
            onClose: function() {}
        });
        this.popupsData.push({
            closableOnOverlayClick: true,
            id: 'photo',
            content: '',
            width: 300, // fix jquery .popup() generate size +8px
            height: 200,
            className: 'IpanoramPhotoPopup',
            onClose: function() {},

        });
        if (this.map != false) {
            var content = "<div style='display:flex;'>";
            content += '<div style="display:inline-flex;">';
            content += courseML.getHTMLFromCourseML(this.xmlData.find('map'));;
            content += '</div>';
            content += '<div style="display:inline-flex;position: relative">';
            content += '<img id="bigMapImg"  src="' + this.map.src + '" onload="bigMapLoad(this)"   />';
            content += '</div>';
            content += '</div>';
            //console.log(content);
            this.popupsData.push({ closableOnOverlayClick: true, id: 'map', content: content, width: 'auto' /*, height: 480*/ });

        }


        if (this.popupsData.length != 0) {
            this.popupCollection = new modelNS.PopupCollection(this.popupsData);
        }

        if ($(window).data('viewer') != undefined) {
            var el = $($(window).data('viewer').viewer.container);
            el.remove()
        } {
            var table = $('<table style="width:100%" id="PanoramTable">').appendTo(this.el);
            var tr = $('<tr>').appendTo(table);
            var t1 = $('<td style="width:49%">').appendTo(tr);
            var td = $('<td id="parentPanoram" >').appendTo(tr);
            var t1 = $('<td style="width:49%" >').appendTo(tr);
            //        var img = $('<img id="DivPanoramImg" style="display:none">').appendTo(td);
            var divP = $('<div id="DivPos"  style="width:' + this.width + 'px;height:' + this.height + 'px;">').appendTo(td);
            var divN = $('<div id="DivPanoram"  style="width:' + this.width + 'px;height:' + this.height + 'px;position:absolute;top:1px;z-index:300">').appendTo($(document.body));

            if (this.model.params && this.model.params.mode != undefined) {
                if (this.model.params.mode == 'answer') {
                    $('#pricelF').remove();
                    var img = $('<img id="pricelF" src="'+modelNS.panoramaInternalImage('pricel.png')+'" style="width:64px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"  />').appendTo(divN);

                }
            }
            divN.css('top', $('#DivPos').offset().top + 'px');
            divN.css('left', $('#DivPos').offset().left + 'px');
            //console.log(this);

            this.createPanoram();
            $(window).keydown(function(e) {
                if (e.keyCode == 27 && $(window).data('viewer').fullScrin) {
                    $('.bfullS').click();
                }
            });
            $(window).resize(function() {
                if ($(window).data('viewer').fullScrin == true) {
                    $('#DivPanoram').css('top', $('header').height() + 'px');
                    var width = $(window).width();
                    if ($('#checkPanel').css('display') != 'none') {
                        var height = $('#checkPanel').offset().top - $('header').height();

                    }
                    else {
                        var height = $(window).height() - $('header').height();
                    }
                    var height = $(window).height();
                    $('#DivPanoram').css('width', width + 'px');
                    $('#DivPanoram').css('height', height + 'px');
                    $('#DivPanoram').css('left', '0px');
                    $('#DivPanoram').css('top', '0px');
                    $(this).data('viewer').viewer.onWindowResize(width, height);
                    $(this).data('viewer').fullScrin = true;
                    $('#fov2').css('left', ((width - $('#fov2').width()) - 30) + 'px');
                    $('#fov2').css('top', ((height - 18) - $('#fov2').height()) + 'px');

                    $(document.body).css('overflow', 'hidden');

                }
                else {
                    $('#DivPanoram').css('top', $('#DivPos').offset().top + 'px');
                    $('#DivPanoram').css('left', $('#DivPos').offset().left + 'px');
                    $('#fov2').css('left', (($(this).data('viewer').width - $('#fov2').width()) - 30) + 'px');
                    $('#fov2').css('top', (($(this).data('viewer').height - 18) - $('#fov2').height()) + 'px');

                    // $('#fov2').css('top', 30 + 'px');
                    $(document.body).css('overflow', 'auto');
                }
            });
        }

        return this;
    },
});


function Panorama(xmlData, container, basePath, params) {
    var view, model;
    xmlData = xmlData.substring(xmlData.indexOf('?>') + 2, xmlData.length);
    var $xml = $($.parseXML(xmlData));

    var width = container.width() != 0 ? container.width() :
        $xml.find('ipanorama').attr('width') ? $xml.find('ipanorama').attr('width') : 800,
        height = container.height() != 0 ? container.height() :
        $xml.find('ipanorama').attr('height') ? $xml.find('ipanorama').attr('height') : 600;

    //console.log(width, height)

    model = new modelNS.IPanoramaModel({
        xmlData: xmlData,
        wrapper: container,
        basePath: basePath,
        scalable: false,
        params: params,
        width: width,
        height: height
    });




    this.init = function() {
        view = new modelNS.IPanoramaView({ model: model }).render();
        return view;
    }






}
