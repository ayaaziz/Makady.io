(function () {
  function ProgressRing(ele, options, data) {
    this.options = $.extend({
      width : 100,
      height : 100,
      ringWidth : 5,
      ringRadius : 50,
      ringColor : '#ff6600',
      animateInterval : 10,
      backWidth : 3,
      backRadius : 49,
      backColor : '#999'
    }, options);
    this.selector = ele;
    this.prepare();
    this.calculateData(data);
    //this.calculateData([40, 100]);
  }

  ProgressRing.prototype.prepare = function () {
    var options = this.options;
    this.selector.addClass('progress-ring').append('<div class="progress-ring-container" style="height:' + options.height + 'px;width:' + options.width + 'px;">\
      <canvas width="' + options.width + '" height="' + options.height + '"></canvas>\
      <div class="progress-ring-percent" style="height:' + options.height + 'px;width:' + options.width + 'px;line-height:' + options.height + 'px;color:' + options.ringColor + '"><span class="progress-ring-percent-text"></span>%</div></div>');
    this.context = this.selector.find('canvas').get(0).getContext('2d');
    this.context.translate(options.width / 2, options.height / 2);
    this.percentText = this.selector.find('.progress-ring-percent-text');
  };

  ProgressRing.prototype.calculateData = function (data) {
    var options = this.options;
    var percent = data[1] ? data[0] / data[1] : 0;
    this.drawSector(0, 360, options.backRadius ,options.backWidth, options.backColor);
    percent = Math.min(1, percent);
    if (percent !== 0) {
      this.animateSector(0, 360 * percent, options.ringColor);
    }
    this.percentText.text(Math.ceil(percent * 100));
  };

  ProgressRing.prototype.drawSector = function (startAng, endAng, radius, width, color) {
    startAng = this.getAngle(startAng);
    endAng = this.getAngle(endAng);
    var options = this.options;
    this.context.beginPath();
    this.context.arc(0, 0, radius - width, startAng, endAng, false);
    this.context.lineWidth = width;
    this.context.strokeStyle = color;
    this.context.stroke();
    this.context.closePath();
  };

  ProgressRing.prototype.animateSector = function (startAng, endAng, color) {
    var options = this.options;
    var self = this;
    var count = parseInt((endAng - startAng) / 1);
    for (var i = 0; i < count; i++) {
      var endAng2 = startAng + 1 * (i + 1);
      if (endAng2 > endAng) {
        endAng2 = endAng;
      }
      (function (sAng, eAng, time) {
        window.setTimeout(function () {
          self.drawSector(sAng, eAng, options.ringRadius + 2, options.ringWidth + 2, '#fff');
          self.drawSector(sAng, eAng, options.ringRadius, options.ringWidth, color);
        }, time);
      })(startAng, endAng2, options.animateInterval * i);
    }
  };

  ProgressRing.prototype.getAngle = function (angle) {
    return 2 * Math.PI * (angle / 360) - 90;
  };

  window.ProgressRing = ProgressRing;
});