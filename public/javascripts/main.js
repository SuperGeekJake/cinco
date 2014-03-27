
$("a[data-reveal]").click(function (event) {
	var $this = $(this);
	var target = $this.attr("href");
	$(target).show();
});

$("a[data-close]").click(function (event) {
	var $this = $(this);
	var target = $this.attr("href");
	$(target).hide();
});