/*
	Venue by Pixelarity
	pixelarity.com | hello@pixelarity.com
	License: pixelarity.com/license
*/

(function($) {

	var	$window		= $(window),
		$header		= $('#header'),
		$banner		= $('#banner'),
		$body		= $('body');

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (browser.name == 'ie' | browser.name == 'edge' || browser.mobile) ? function() { return $(this) } : function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				on, off;

			on = function() {

				$t.css('background-position', 'center 0px');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function() {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			breakpoints.on('<=large', off);
			breakpoints.on('>large', on);

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Banner.
		/*if ($banner.length > 0)
			$banner._parallax(0.25);*/
		

	// Menu.
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				target: $body,
				visibleClass: 'is-menu-visible',
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right'
			});

			if(window.location.href.indexOf('programa-m') < 0) {
				setTimeout(function () {
					$(".backgroud-modal").animate({opacity:1},750);

					$(".backgroud-modal").on( "click", function() {
						$(".backgroud-modal").animate({opacity:0}, 300, function() {
							$(".backgroud-modal").hide();
						});
					} );
				}, 2000);
			}

			$(document).ready(function() {
				$("#line2021").on("click", function() {
					if ($(".line2021")[0].style.display == 'block') {
						$("#line2021 .keyboard_arrow_up").toggle("slow", function () {
							$("#line2021 .keyboard_arrow_down").toggle("slow");
						});
					  }
					  if ($(".line2021")[0].style.display == 'none' || $(".line2021")[0].style.display == '') {
						$("#line2021 .keyboard_arrow_down").toggle("slow", function () {
							$("#line2021 .keyboard_arrow_up").toggle("slow");
						});
					  }
					  
				  $(".line2021").toggle("slow");
				  
				});
				$("#line2022").on("click", function() {
					if ($(".line2022")[0].style.display == 'block') {
						$("#line2022 .keyboard_arrow_up").toggle("slow", function () {
							$("#line2022 .keyboard_arrow_down").toggle("slow");
						});
					  }
					  if ($(".line2022")[0].style.display == 'none' || $(".line2022")[0].style.display == '') {
						$("#line2022 .keyboard_arrow_down").toggle("slow", function () {
							$("#line2022 .keyboard_arrow_up").toggle("slow");
						});
					  }
					$(".line2022").toggle("slow");
				  });
				  $("#line2023").on("click", function() {
					if ($(".line2023")[0].style.display == 'block') {
						$("#line2023 .keyboard_arrow_up").toggle("slow", function () {
							$("#line2023 .keyboard_arrow_down").toggle("slow");
						});
					  }
					  if ($(".line2023")[0].style.display == 'none' || $(".line2023")[0].style.display == '') {
						$("#line2023 .keyboard_arrow_down").toggle("slow", function () {
							$("#line2023 .keyboard_arrow_up").toggle("slow");
						});
					  }
					$(".line2023").toggle("slow");
				  });
				  $("#line2024").on("click", function() {
					if ($(".line2024")[0].style.display == 'block') {
						$("#line2024 .keyboard_arrow_up").toggle("slow", function () {
							$("#line2024 .keyboard_arrow_down").toggle("slow");
						});
					  }
					  if ($(".line2024")[0].style.display == 'none' || $(".line2024")[0].style.display == '') {
						$("#line2024 .keyboard_arrow_down").toggle("slow", function () {
							$("#line2024 .keyboard_arrow_up").toggle("slow");
						});
					  }
					$(".line2024").toggle("slow");
				  });
			  });

})(jQuery);