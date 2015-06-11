/*
 * by ayumi 2015.6.11
 * QQ: 44784009
 */
var ayu_loading={
	show:function(){
		$('body').prepend('<span class="ayu-loading-ajax"><span class="loading-img"></span></span>');	
	},
	hide:function(){
		$('.ayu-loading-ajax').remove();
	}
};
