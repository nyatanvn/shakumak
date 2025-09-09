var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-23070172-1']);
if (typeof(noPageView) == 'undefined') {
	_gaq.push(['_trackPageview']);
}

(function() {
	var ga = document.createElement('script');ga.type = 'text/javascript';ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(ga, s);
})();

if (typeof(skipLinkProcessing) == 'undefined') {
  $(document).ready(function() {
    $('a').each(function() {
      var href = $(this).attr('href');
      if (href == undefined) return;
      var filetypes = /\.(zip|pdf|mp3)$/i;
      // external links
      if ((href.match(/^https?\:/i)) && (!href.match(document.domain))) {
        $(this).click(function(event) {
          event.preventDefault();
          _gaq.push(['_trackPageview', '/outgoing/'+href]);
          _gaq.push(['_trackEvent', 'Outgoing link', 'Click', href]);
          setTimeout('document.location = "' + href + '"', 200);
        });
      } else
      // email links
      if (href.match(/^mailto\:/i)){
        $(this).click(function(event) {
          event.preventDefault();
          var mailLink = href.replace(/^mailto\:/i, '');
          _gaq.push(['_trackPageview', '/mailto/'+href]);
          _gaq.push(['_trackEvent', 'Mail link', 'Click', mailLink]);
          setTimeout('document.location = "' + href + '"', 200);
        });
      } else
      // files
      if (href.match(filetypes)){
        $(this).click(function(event) {
          event.preventDefault();
          _gaq.push(['_trackPageview', href]);
          _gaq.push(['_trackEvent', 'File link', 'Click', href]);
          setTimeout('document.location = "' + href + '"', 200);
        });
      } else
      // untracked
      if ($(this).hasClass('untracked')) {
        $(this).click(function(event) {
          event.preventDefault();
          _gaq.push(['_trackPageview', href]);
          _gaq.push(['_trackEvent', 'Page link', 'Click', href]);
          setTimeout('document.location = "' + href + '"', 200);
        });
      } else
      {
        $(this).click(function(event) {
          event.preventDefault();
          _gaq.push(['_trackEvent', 'Page link', 'Click', href]);
          setTimeout('document.location = "' + href + '"', 200);
        });
      }
    });
  });
}
