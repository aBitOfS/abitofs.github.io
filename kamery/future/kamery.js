var DocumentInteractive = /** @class */ (function () {
    function DocumentInteractive() {
    }
    return DocumentInteractive;
}());
var Kamery = /** @class */ (function () {
    function Kamery() {
        this.leftContainer = document.getElementById("left");
        this.rightContainer = document.getElementById("right");
        this.leftTemplate = document.getElementById("leftTemplate");
    }
    Kamery.prototype.loadLeft = function () {
        var leftCount = localStorage.getItem("leftCount");
        if (typeof leftCount !== "number")
            return;
        for (var i = 0; i < leftCount; i++) {
            var lN = localStorage.getItem("leftName".concat(i));
            var lU = localStorage.getItem("leftUrl".concat(i));
            if (lN && lU)
                this.leftItems.push([lN, lU]);
        }
        if (this.leftContainer) {
            this.leftContainer.innerHTML = "";
            for (var _i = 0, _a = this.leftItems; _i < _a.length; _i++) {
                var el = _a[_i];
                this.addLeft(el);
            }
        }
    };
    Kamery.prototype.addLeft = function (toadd) {
        if (this.leftContainer && this.leftTemplate) {
            var sp = this.leftTemplate.getElementsByTagName("span");
            sp[0].innerText = toadd[0];
            sp[1].innerText = toadd[1];
            var ne = this.leftTemplate.cloneNode(true);
            this.leftContainer.appendChild(ne);
        }
    };
    return Kamery;
}());
var kamery = new Kamery();
