window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'UA-116298107-5');

(function() {
	var po = document.createElement('script');
	po.type = 'text/javascript';
	po.async = true;
	po.src = '//www.googletagmanager.com/gtag/js?id=UA-116298107-5';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(po, s);
})();

jQuery(document).ready(function ($) {
	// $('.amnesty_cookie_text').html('本网站为备份之用，如要浏览最新内容请前往<a href="https://zh.amnesty.org/">国际特赦组织中文网站</a>');
	$('a[href*="wp-content/uploads/"][href*=".pdf"]').each(function() {
		var self = $(this);
		var path = self.attr('href').split('wp-content/uploads/');
		if(path.length > 1) {
			var url = 'https://github.com/AmnestyChinese/AmnestyChinese.github.io/raw/master/wp-content/uploads/' + path[1];
			self.attr('href', url);
		}
	});
	$('a[href*="wp-content/uploads/"][href*=".PDF"]').each(function() {
		var self = $(this);
		var path = self.attr('href').split('wp-content/uploads/');
		if(path.length > 1) {
			var url = 'https://github.com/AmnestyChinese/AmnestyChinese.github.io/raw/master/wp-content/uploads/' + path[1];
			self.attr('href', url);
		}
	});
	$('.textwidget iframe.iframe--action').remove();
	if($('#ar-download').length > 0) {
		$('#ar-download option[value*="wp-content/uploads/"][value*=".pdf"]').each(function() {
			var self = $(this);
			var path = self.attr('value').split('wp-content/uploads/');
			if(path.length > 1) {
				var url = 'https://github.com/AmnestyChinese/AmnestyChinese.github.io/raw/master/wp-content/uploads/' + path[1];
				self.attr('value', url);
			}
		});
		$('#ar-download option[value*="wp-content/uploads/"][value*=".PDF"]').each(function() {
			var self = $(this);
			var path = self.attr('value').split('wp-content/uploads/');
			if(path.length > 1) {
				var url = 'https://github.com/AmnestyChinese/AmnestyChinese.github.io/raw/master/wp-content/uploads/' + path[1];
				self.attr('value', url);
			}
		});
	}
});