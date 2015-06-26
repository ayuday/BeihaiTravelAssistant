(function($) {
	var defaults = {
		width: 600,
		type: 'double',
		smooth: false,
		backColor: '#d8d8d8',
		mainColor: '#007AFF',
		tickMask: '|',
		onload: function() {},
		success: function() {}
	};
	$.slider = function(el, dialData, options) {
		var data = dialData || [],
			$this = el,
			publicFunc = {},
			opts = $.extend({}, defaults, options),
			ow = $(window).width(),
			els = {},
			moveTempValues = {},
			cellWidth = 0,
			count = 0,
			nc = '',
			rc = '',
			rulerValuePos = {},
			firstOffset = 0,
			maxBarWidth, startX, originalLeft, originalWidth;
		if ($this.length === 0) return;
		var t = {
			box: '<div class="slider-box"><div class="slider-dial"><div class="slider-number"></div><div class="slider-ruler"></div></div><div class="slider-bar"><div class="slider-selected"></div></div></div>',
			numberCell: '<p value="%value" display="%display">%display</p>',
			rulerCell: '<p value="%value">' + opts.tickMask + '</p>',
			doubleHolder: '<div class="slider-left-holder"></div><div class="slider-right-holder"></div>',
			singleHolder: '<div class="slider-right-holder"></div>',
			sliderCss: '.slider-box { width: ' + ow.width + 'px; margin: 0 auto; padding-bottom: 15px; }' + '.slider-dial { width: 100%; margin-bottom: 20px; }' + '.slider-number { font-size: 24px; color: #666; }' + '.slider-ruler { margin: 0 10px; font-size: 10px; color: #d8d8d8; }' + '.slider-number,.slider-ruler { display: -moz-box; display: -webkit-box; display: box; }' + '.slider-number p,.slider-ruler p { -webkit-box-flex: 2.0; -moz-box-flex: 2.0; box-flex: 2.0; text-align: center; }' + '.slider-number p:first-child,.slider-ruler p:first-child { -webkit-box-flex: 1.0; -moz-box-flex: 1.0; box-flex: 1.0; text-align: left; }' + '.slider-number p:last-child,.slider-ruler p:last-child { -webkit-box-flex: 1.0; -moz-box-flex: 1.0; box-flex: 1.0; text-align: right; }' + '.slider-bar { margin: 0 20px; height: 4px; background-color: ' + opts.backColor + '; border-radius: 4px; }' + '.slider-selected { position: relative; height: 4px; background-color: ' + opts.mainColor + '; border-radius: 4px; }' + '.slider-left-holder, .slider-right-holder { width: 16px; height: 16px; border-radius: 16px; background-color: #fff; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5); position: absolute; top: -6px; }' + '.slider-left-holder { left: -14px; }' + '.slider-right-holder { right: -14px; }'
		};
		els.box = $(t.box);
		els.selectedBar = $('.slider-selected', els.box);
		els.bar = $('.slider-bar', els.box);
		els.selectedBar.html(t[opts.type + 'Holder']);
		publicFunc.valueToPos = function(endValue, startValue) {
			var left, width, start, end;
			start = rulerValuePos[startValue];
			end = rulerValuePos[endValue];
			if (opts.type !== 'single' && startValue) {
				els.selectedBar.css('left', start);
			}
			els.selectedBar.css('width', end - start);
			if ('undefined' !== typeof(startValue))
				els.box.attr('startAt', startValue);
			if ('undefined' !== typeof(endValue))
				els.box.attr('endAt', endValue);
			return {
				left: left,
				width: width
			};
		}
		publicFunc.posToValue = function(width, left, leftDirection) {
			var leftC, widthC, startAt = null,
				endAt = null,
				bLeft, bRight, point;
			if (opts.smooth) {
				leftC = left;
				widthC = width;
			} else {
				if (width > cellWidth) {
					if (leftDirection) {
						point = left;
					} else {
						point = left + width;
					}
					if (point <= rulerValuePos[data[0].value]) {
						startAt = data[0].value;
						endAt = null;
					} else if (point >= rulerValuePos[data[data.length - 1].value]) {
						startAt = null;
						endAt = data[data.length - 1].value;
					} else {
						for (var i = 0; i < data.length - 1; i++) {
							bLeft = rulerValuePos[data[i].value];
							bRight = rulerValuePos[data[i + 1].value];
							if (point > bLeft && point < bRight) {
								if (point - bLeft < bRight - point) {
									if (leftDirection) {
										startAt = data[i].value;
										endAt = null;
										leftC = bLeft;
										widthC = width + point - bLeft;
									} else {
										startAt = null;
										endAt = data[i].value;
										leftC = left;
										widthC = width - point + bLeft;
									}
								} else {
									if (leftDirection) {
										startAt = data[i + 1].value;
										endAt = null;
										leftC = bRight;
										widthC = width - bRight + point;
									} else {
										startAt = null;
										endAt = data[i + 1].value;
										leftC = left;
										widthC = width + bRight - point;
									}
								}
							}
						}
					}
				}
			}
			null !== startAt ? els.box.attr('startAt', startAt) : startAt = els.box.attr('startAt');
			null !== endAt ? els.box.attr('endAt', endAt) : endAt = els.box.attr('endAt');
			if ('undefined' !== typeof(leftC)) {
				els.selectedBar.css('left', leftC);
			}
			if ('undefined' !== typeof(widthC)) {
				els.selectedBar.css('width', widthC);
			}
			if (opts.type === 'single') {
				return endAt;
			} else {
				return {
					startAt: startAt,
					endAt: endAt
				};
			}
		}
		publicFunc.changeValueToDisplay = function(value) {
			if ($('p[value="' + value + '"]', els.box).length && data[$('p[value="' + value + '"]', els.box).index()]) {
				return data[$('p[value="' + value + '"]', els.box).index()].display;
			}
			return null;
		}
		publicFunc.changeDisplayToValue = function(display) {
			if ($('p[display="' + display + '"]', els.box).length && data[$('p[display="' + display + '"]', els.box).index()]) {
				return data[$('p[display="' + display + '"]', els.box).index()].display;
			}
			return null;
		}
		publicFunc.getValues = function() {
			return {
				startAt: els.box.attr('startAt'),
				endAt: els.box.attr('endAt')
			};
		}

		function holderMoveCall(leftDirection, e) {
			var moveX = e.targetTouches[0].pageX - startX,
				left = originalLeft,
				width = originalWidth;
			if (leftDirection) {
				left = originalLeft + moveX;
				width = originalWidth - moveX;
			} else {
				left = originalLeft;
				width = originalWidth + moveX;
			}
			if (left < 0) left = 0;
			if (width + left > maxBarWidth) width = maxBarWidth - left;
			moveTempValues = publicFunc.posToValue(width, left, leftDirection);
		}

		function preventDft(e) {
			e.preventDefault();
		}
		count = data.length;
		cellWidth = (opts.width - 40) / (count - 1);
		for (var i = 0; i < count; i++) {
			nc += t.numberCell.replace(/%display/g, data[i].display).replace(/%value/g, data[i].value);
			rc += t.rulerCell;
			rulerValuePos[data[i].value] = i * cellWidth;
		}
		$('.slider-number', els.box).html(nc);
		$('.slider-ruler', els.box).html(rc);
		els.leftHolder = $('.slider-left-holder', els.box);
		els.rightHolder = $('.slider-right-holder', els.box);
		els.holders = $('.slider-left-holder, .slider-right-holder', els.box);
		if (opts.type === 'single' && opts.startAt) {
			delete opts.startAt;
		}
		if (!opts.startAt) {
			opts.startAt = 0;
		}
		els.box.attr('startAt', opts.startAt);
		if (!opts.endAt) {
			opts.endAt = data[count - 1].value;
		}
		els.box.attr('endAt', opts.endAt);
		publicFunc.valueToPos(opts.endAt, opts.startAt);
		if (opts.onload && typeof(opts.onload) === 'function') {
			opts.onload.call(publicFunc, {
				startAt: opts.startAt,
				endAt: opts.endAt
			});
		}
		els.holders.on('touchstart', function(e) {
			maxBarWidth = els.bar.width();
			startX = e.touches[0].pageX;
			originalLeft = parseInt(els.selectedBar.css('left'), 10) || 0;
			originalWidth = parseInt(els.selectedBar.css('width'), 10) || maxBarWidth;
		});
		els.leftHolder.on('touchmove', function(e) {
			holderMoveCall(true, e);
			preventDft(e);
		});
		els.rightHolder.on('touchmove', function(e) {
			holderMoveCall(false, e);
			preventDft(e);
		});
		els.holders.on('touchend', function(e) {
			if (opts.success && typeof(opts.success) === 'function') {
				opts.success.call(publicFunc, moveTempValues);
			}
			preventDft(e);
		});
		$(document).find('head').append('<style id="sliderStyle"></style>');
		$('#sliderStyle').text(t.sliderCss);
		$this.html(els.box);
		return publicFunc;
	};
})(Zepto);