var Spots = function() {};
Spots.prototype.init = function() {
	this.bindEvent();
//	var starList = $('#chooseStarList > ul > a'),
//		i;
//	for (i = 0; i < starList.length; i++) {
//		if (starList[i].querySelector('.theme-current') && i === 0) {
//			$('.theme-arrow')[0].style.backgroundColor = '#EDEDED';
//		}
//	}

};
Spots.prototype.loadPrice = function(self, values) {
	var startAt = self.changeValueToDisplay(values.startAt) || '';
	var endAt = self.changeValueToDisplay(values.endAt) || '';
	$('#priceDisplay').text(startAt + ' - ' + endAt);
}

Spots.prototype.bindEvent = function() {
	
	var compositeCondition = null;
	var self = this;
//	$('#chooseCity,#chooseCity a').click(function() { 
		console.log('ccc');
//		$('#choosePriceList')[0].classList.toggle('hidden');
//		this.parentNode.classList.toggle('fl_on');
//		$('#chooseStarList')[0].classList.add('hidden');
//		$('#chooseStarList')[0].parentNode.classList.remove('fl_on');
//		$('#chooseSortList')[0].classList.add('hidden');
//		$('#chooseSortList')[0].parentNode.classList.remove('fl_on');
//		$('#chooseRecommendList')[0].classList.add('hidden');
//		$('#chooseRecommendList')[0].parentNode.classList.remove('fl_on');
//		if (this.parentNode.classList.contains('fl_on')) {
//			$('#trasp')[0].classList.remove('hide');
//			$('#trasp')[0].style.height = document.getElementById('wrapper').offsetHeight - 71 + 'px';
//			lockPage();
//		} else {
//			$('#trasp')[0].classList.add('hide');
//			releasePage();
//		}
		var startAt, endAt;
		if ('undefined' !== typeof($('#priceHolder').attr('initStartAt'))) {
			startAt = $('#priceHolder').attr('initStartAt')
		}

		if ('undefined' !== typeof($('#priceHolder').attr('initEndAt'))) {
			endAt = $('#priceHolder').attr('initEndAt')
		}
		if (!self.slider) {
			self.slider = $.slider($('#priceHolder'), [{
				display: '￥0',
				value: 0
			}, {
				display: '￥150',
				value: 150
			}, {
				display: '￥300',
				value: 300
			}, {
				display: '￥500',
				value: 500
			}, {
				display: '￥1500',
				value: 1500
			}, {
				display: '不限',
				value: ''
			}], {
				width: 555,
				startAt: startAt,
				endAt: endAt,
				onload: function(values) {
					self.loadPrice(this, values);
				},
				success: function(values) {
					self.loadPrice(this, values);
				}
			});
			$('#priceSubBtn').tap(function() {
				var values = self.slider.getValues();
				if ($('#priceHolder').attr('url')) {
					window.location.href = $('#priceHolder').attr('url').replace(/-lowPrice-/, values.startAt).replace(/-highPrice-/, values.endAt);
				}
			});
		} else {
			self.slider.valueToPos(endAt, startAt);
			self.loadPrice(self.slider, {
				startAt: startAt,
				endAt: endAt
			});
		}
//		return false;
//	});
	
	//价格确实事件
	$('#submitStar').click(function(event) {
		var tempArray = [],
			starStr = '',
			jumpStr = $('#chooseStarList').attr('url');
		$.each($('#chooseStarList .check.check_box'), function(i, n) {
			tempArray.push($(n).attr('value'));
		});
		starStr = tempArray.join(',');
		if (jumpStr) {
			location.href = jumpStr.replace(/-star-/g, starStr);
		}
	});
	
	
	

//	function lockPage() {
//		document.documentElement.style.overflow = 'hidden';
//		document.body.style.overflow = 'hidden';
//	}
//
//	function releasePage() {
//		document.documentElement.style.overflow = 'visible';
//		document.body.style.overflow = 'visible';
//	}
};
var spots = new Spots();
spots.init();