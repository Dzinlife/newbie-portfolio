// Cross browser, backward compatible solution
(function( window, Date ) {
// feature testing
var raf = window.mozRequestAnimationFrame    ||
          window.webkitRequestAnimationFrame ||
          window.msRequestAnimationFrame     ||
          window.oRequestAnimationFrame;
 
window.animLoop = function( render, element ) {
  var running, lastFrame = +new Date;
  function loop( now ) {
    if ( running !== false ) {
      raf ?
        raf( loop, element ) :
        // fallback to setTimeout
        setTimeout( loop, 16 );
      // Make sure to use a valid time, since:
      // - Chrome 10 doesn't return it at all
      // - setTimeout returns the actual timeout
      now = now && now > 1E4 ? now : +new Date;
      var deltaT = now - lastFrame;
      // do not render frame when deltaT is too high
      if ( deltaT < 160 ) {
        running = render( deltaT, now );
      }
      lastFrame = now;
    }
  }
  loop();
};
})( window, Date );
 
// Usage
animLoop(function( deltaT, now ) {
    // rendering code goes here
    // return false; will stop the loop
//    console.log("aaa");
    return false;
// optional 2nd arg: elem containing the animation
});

function mapping(t1,f1,f2) {
	a1 = f1[0];
	b1 = f1[1];
	a2 = f2[0];
	b2 = f2[1];
	t2 = (t1 - a1) / (b1 - a1) * (b2 - a2) + a2
	return t2;
}

$.fn.extend({
	scrollToMotion: function (scrollToPos, duration, option, callback) {
		// this jQuery object
		return this.each(function () {
			// this dom object
			option = $.extend({
				direction: "y",
				easing: "swing",
				fps: 62.5,
				interruptible:true,
			}, option);
			
			if (duration === undefined) {
				var _duration = 400;
			}else {
				var _duration = duration;
			}
			var $this = $(this)
			
			if (!$.isFunction(callback)) {
				var callback = function () {};
			}
			
			clearInterval($this.scrollMotionTimer);
			var direction = (option.direction === 'x') ? 'scrollLeft' : 'scrollTop';
			var easing = option.easing;
			var steps = _duration/1000 * option.fps;
			var startValue = $(this)[direction]();
			
			if (scrollToPos.jquery) {
				var endValue = scrollToPos.offset().left + startValue;
				scroll(endValue, direction);
			}else if ($.isArray(scrollToPos)) {
				if (scrollToPos[0] < 0) {
					scrollToPos[0] = 0;
				};
				if (scrollToPos[1] < 0) {
					scrollToPos[1] = 0;
				}
				scroll(scrollToPos[0], 'scrollLeft', {timer: 'x'});
				scroll(scrollToPos[1], 'scrollTop', {timer: 'y'});
			}else {
				scroll(scrollToPos, direction);
			}
			
			function scroll(endValue, direction) {
				if (_duration < 10) {
					$this[direction](endValue);
					return;
				}
				
				var step = 1;
				var t = 0;
				$this.scrollMotionTimer = setInterval(function () {
					t = step++ / steps * _duration;
					$this[direction](function () {
						return $.easing[easing](null, t, startValue, endValue-startValue, _duration);
					})
					if (step > steps) {
						
						clearInterval($this.scrollMotionTimer);
						$this.unbind("touchstart");
						callback();
					}
				}, 1000/option.fps);
			}
			if (option.interruptible) {
				$this.on("touchstart mousedown mousewheel",function () {
					clearInterval($this.scrollMotionTimer); 
				})
			}
//			else {
//				$this.on("touchstart mousedown mousewheel",function (e) {
//					e.preventDefault();
//				});
//			}
		})
	}	
})
//
//$.fn.extend({
//	scrollToMotion: function (scrollToPos, duration, option, callback) {
//		// this jQuery object
//		return this.each(function () {
//			// this dom object
//			option = $.extend({
//				direction: "y",
//				easing: "swing",
//				fps: 62.5,
//				interruptible:true,
//			}, option);
//			
//			var _duration = duration || 400;
//			var $this = $(this)
//			
//			if (!$.isFunction(callback)) {
//				var callback = function () {};
//			}
//			var direction = (option.direction === 'x') ? 'scrollLeft' : 'scrollTop';
//			var easing = option.easing;
//			var startValue = $(this)[direction]();
//			
//			if (scrollToPos.jquery) {
//				var endValue = scrollToPos.position().left + startValue;
//				scroll(endValue, direction);
//			}else if ($.isArray(scrollToPos)) {
//				if (scrollToPos[0] < 0) {
//					scrollToPos[0] = 0;
//				};
//				if (scrollToPos[1] < 0) {
//					scrollToPos[1] = 0;
//				}
//				scroll(scrollToPos[0], 'scrollLeft', {timer: 'x'});
//				scroll(scrollToPos[1], 'scrollTop', {timer: 'y'});
//			}else {
//				var endValue = scrollToPos;
//			}
//			
//			var t = 0;
//			var interruptSignal = false;
//			animLoop(function( deltaT, now ) {
//				if (interruptSignal) {
//					return;
//				}
//				t += deltaT;
//				$this[direction](function () {
//					return $.easing[easing](null, t, startValue, endValue-startValue, _duration);
//				});
//				if (t > _duration) {
//					return false;
//					$this.unbind("touchstart");
//					callback();
//				}
//			});
//				if (option.interruptible) {
//				$this.on("touchstart mousedown mousewheel",function () {
//					interruptSignal = true;
//				})
//			}else {
//				$this.on("touchstart mousedown mousewheel",function (e) {
//					
//				});
//			}
//		})
//	}	
//})



$(document).ready(function () {
	
	function preventMacBackFwdGesture(element, scrollable) {
		if (scrollable === undefined) {
			var scrollable = true;
		}
		$(element).each(function () {
			var $this = $(this);
			var scrollDirection;
			$this.mousewheel(function(event, delta, deltaX, deltaY) {
			    if (Math.abs(deltaX) < Math.abs(deltaY)) {
			    	scrollDirection = "vertical";
			    }else if (deltaX > 0) {
			    	scrollDirection = "right";
			    }else if (deltaX < 0) {
			    	scrollDirection = "left";
			    };
			});
			
			function scrollLeftMax(element) {
				return element[0].scrollWidth - element[0].clientWidth;
			}
			
			var _method = {};
			_method.scrollable = function () {
				$this.on('mousewheel', function(e){
					if (scrollDirection === "vertical"){
						return;
					}else {
						if ($this.scrollLeft() === 0) {
							if (scrollDirection === "right") {
								return;
							}else {					
								e.preventDefault();
							};
						};
						
						if ($this.scrollLeft() === scrollLeftMax($this) ) {
							if (scrollDirection === "left") {
								return;
							}else {					
								e.preventDefault();
							};
						};
					}
				});
			}
			
			_method.unscrollable = function () {
				$this.on("mousewheel", function (e) {
					if (scrollDirection !== "vertical") {
						e.preventDefault();
					};
				});
			}
			
			if (scrollable) {
				_method.scrollable();
			}else {
				_method.unscrollable();
			}
		})
	}
	preventMacBackFwdGesture($('#scroller-0-inner, #scroller-1-inner'));
	preventMacBackFwdGesture($('#dock-wrapper'),false);
	
	var drawPeriodBaseline = SVG('period-baseline');
	var drawPeriodBaseline_line = drawPeriodBaseline.line(0, 0.75, 700, 0.75).stroke({ width: 0.5, color: "rgba(0,0,0,0.2)"});
	
	$(".period-line").each(function () {
		var drawPeriodLine = SVG(this);
		var drawPeriodLine_line = drawPeriodLine.line(0.25,0,0.25,300).stroke({ width: 0.5, color: "rgba(0,0,0,0.2)" });
	})
	
	$(".period-interval").each(function () {
		var drawPeriodInterval = SVG(this);
		var drawPeriodInterval_line = drawPeriodInterval.line(0,0,0.5,0).stroke({ width: 6, color: "rgba(0,0,0,0)" });
	})
	
	//experience
	$(".period-company-wrapper").width(function () {
		return $(this).parent().width();
	});
	$(".period").each(function () {
		$(this).data({
			"posLeft": $(this).position().left,
			"widthOpen": parseInt($(this).find(".period-detail").width()) + 40,
			"titleWidth" : parseInt($(this).find(".period-title").width()/1.414 + 60)
		});
	})
	
	var windowHeight, windowWidth, windowHeightRes, csrX, csrY, dx, dy, touchX, touchY, worksHeight;
	
	var worksHeightMax = 640;
	var worksHeightMin = 220;
	
	$(".collection-title").each(function () {
		$(this).width($(this).width())
	})
	
	var arrPosCenterX = new Array($(".dock-cell").length);

	FastClick.attach(document.body);
	$(window).resize(function() {init();})
	
	$(".works-wrapper").each(function () {
		var $this = $(this);
		imgReady($this.find(".works")[0].src, function () {
			var ratio = $this.height() / this.height;
			var width = this.width;
			var height = this.height;
			var transX = Math.round( -(width - width * ratio)/2 );
			var transY = (height - height * ratio)/2;
			
			$this.find(".works-focus-wrapper-inner").css({
				"transform": "translate3d(0,0,0) scale(" + ratio + ")",
				"width": width,
				"height": height,
			});
			$this.find(".works-focus-wrapper-inner").data({
				"width": width,
				"height": height,
				"scale": ratio
			})
			$this.find(".works-focus-wrapper").css({
				"width" : width * ratio,
				"height" : windowHeight * ratio,
			});
			$this.find(".works-focus-wrapper").data("transX", transX);
			
		})
	})
	
	$(".dock-cell").each(function () {
		var bgSrc = $(".works").eq($(this).index()).attr("src");
		$(this).css("background-image", "url(" + bgSrc + ")");
		console.log(bgSrc);
	})
	$("<div id='works-wrapper-end'></div>").insertAfter($(".works-wrapper:last"));
	
	init();
	function init() {
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		centerX = $(window).width()/2;
		centerY = $(window).height()/2;
				
		worksHeight = Math.min(windowHeight - 120, windowWidth / 5 * 3);
		worksHeight = (worksHeight < worksHeightMin) ? 220 : worksHeight;
		worksHeight = (worksHeight > worksHeightMax) ? 640 : worksHeight;				
		
		
		if (windowHeight > 1200) {
			$("#scroller-1, #scroller-1-inner").height(windowHeight);
		}
		//dock
		$(".dock-cell").each(function () {
			$(this).data({
				posCenterX: $(this)[0].getBoundingClientRect().left + $(this).width()/2
			})
		})
		
		for (var i = 0; i < arrPosCenterX.length; i++) {
			arrPosCenterX[i] = $(".dock-cell").eq(i).data().posCenterX;
		}
		
	}
	
	$("#container-0").click(function () {
		$("#wrapper").scrollToMotion(0,400,{easing: "easeOutSine"})
	})
	$("#resume-section-0").click(function () {
		$("#scroller-0-inner").scrollToMotion(0, 800, {direction: 'x',easing:"easeOutQuad"});
	})
	
	var periodOpened = null;
	$(".period").on("click", function () {
		periodSelect($(this));
		if (skillOpened !== null) {
			skillsSelect();		
		}
	})
	
	function periodSelect($this) {
		if ($this === undefined) {
			periodOff();
			return;
		}
		if (periodOpened === null) {
			periodOpened = $this;
			periodToggleOpen(periodOpened);
		}else if($(periodOpened)[0] === $this[0]) {
			function periodOff() {
				periodToggleClose(periodOpened);
				periodOpened = null;
				
				drawPeriodBaseline_line.animate(400).scale(1,1);//baseline复位
				$(".period").css("transform", "translate3d(0,0,0)");//横向坐标复位
				$(".year-rular, .year").removeAttr("style");	
				$("#resume-section-2").css("transform", "translate3d(0,0,0)");
			};
			periodOff();
			
		}else {
			periodToggleClose(periodOpened);
			periodOpened = $this;
			periodToggleOpen(periodOpened);
		}
		
		var periodOpenedWidth;
		function periodToggleOpen($this) {
			periodOpenedWidth = $this.width();//展开宽度最小值
			$this.find(".period-head").addClass("period-open");
			$this.find(".period-title").addClass("period-title-open");
			$this.find(".period-detail").css({
				"transition": "0.5s ease-in",
				"opacity": 1,
				"pointer-events": "auto",
			});
			
			var periodSubtitleSpaceLeft = $this.find(".period-company").width() - $this.find(".period-company-wrapper").width();
			$this.find(".period-company").css({
					"transform": "translate3d(" + periodSubtitleSpaceLeft + "px,0,0)",
				});//副标题左对齐
				
						
			if ($this.data().widthOpen > periodOpenedWidth) {
				periodOpenedWidth = $this.data().widthOpen;//展开内容宽超出标题宽
			}
			
			var firstElement = $(".period").first()[0];
			var lastElement = $(".period").last()[0];
			if ($this[0] === firstElement) {
				var periodOpenedIncrement = 0;//首元素无横向位移
			}else {
				var neighborDistanceLeft = $this.data().posLeft - $this.prev().data().posLeft;//左邻间距
				var periodOpenedIncrement = $this.prev().data().titleWidth - neighborDistanceLeft;//展开增量为左邻标题占位宽-左邻间距
				if (periodOpenedIncrement < 0) {
					periodOpenedIncrement = 0;
				}
			}
			if ($this[0] === lastElement) {
				var neighborDistanceRight = 0;//末元素无右邻间距
			}else {
				var neighborDistanceRight = $this.next().data().posLeft - $this.data().posLeft;//右邻间距
			}
			
			$this.prevAll().each(function () {
				$(this).data("currentPos", $(this).data().posLeft);
			})//当前位置记录
			$this.prevAll().css("transform","translate3d(0,0,0)" );
			$this.data("currentPos", $(periodOpened).data().posLeft + periodOpenedIncrement);//当前位置记录
			$this.css("transform","translate3d(" + periodOpenedIncrement + "px,0,0)" );
			if (neighborDistanceRight < periodOpenedWidth) {
				var nextAllIncrement = periodOpenedWidth - neighborDistanceRight + periodOpenedIncrement;
				if ($this[0] === lastElement){
					nextAllIncrement = 160;
				}
				
				$this.nextAll().each(function () {
					$(this).data("currentPos", $(this).data().posLeft + nextAllIncrement);
					$(this).css("transform","translate3d(" + nextAllIncrement + "px,0,0)");
				})
			}
			
			$("#resume-section-2").css("transform", "translate3d(" + nextAllIncrement + "px,0,0)");
			drawPeriodBaseline_line.animate(400).scale( (700 + nextAllIncrement)/700, 1);
			
			
			//时间戳位移
			$(".year-2012").css("transform", "translateX(" + (($("#period-3").data().currentPos - $("#period-2").data().currentPos) * 0.375 + $("#period-2").data().currentPos) + "px,0,0)");
			$(".year-2013").css("transform", "translate3d(" + ($("#period-3").data().currentPos + 150) + "px,0,0)");
			
			periodIntervalControl().open();
			
			var scrollToPos = $this.data().currentPos + $("#resume-section-0").width() - windowWidth/2 + $this.width()/2 + 160;
			$("#scroller-0-inner").scrollToMotion(scrollToPos, 400, {direction: 'x', easing:"easeOutSine"});
		}
		
		function periodToggleClose($this) {
			$this.find(".period-head").removeClass("period-open");
			$this.find(".period-title").removeClass("period-title-open");
			$this.find(".period-detail").css({
				"transition": "0.2s ease-out",
				"opacity": 0,
				"pointer-events": "none",
			});
			$this.find(".period-company").css("transform", "translate3d(0,0,0)");//副标题右对齐复位
			periodIntervalControl().close();
		}
		
		
		function periodIntervalControl() {
			switch ($(periodOpened)[0]) {
				case $("#period-0")[0]:
					var periodOpenedInterval = $("#period-2").data().currentPos - $("#period-0").data().currentPos;
					break;
				case $("#period-1")[0]:
					var periodOpenedInterval = 0;
					var periodInterval_skip = true;
					break;
				case $("#period-2")[0]:
					var periodOpenedInterval = periodOpenedWidth;
					break;
				case $("#period-3")[0]:
					var periodOpenedInterval = periodOpenedWidth - 14;
			}
			
			var periodIntervalSvgId = $(periodOpened).children(".period-interval").find("line").attr("id");
			var periodIntervalSvg = SVG.get(periodIntervalSvgId);
			
			var _method = {};
			
			_method.open = function () {
				if (!periodInterval_skip) {
					periodIntervalSvg.stroke("white");
					periodIntervalSvg.animate(400).scale(2*periodOpenedInterval, 1);
				}
			}
			
			_method.close = function () {
				if (!periodInterval_skip) {
					periodIntervalSvg.animate(400).scale(1, 1).stroke("rgba(0,0,0,0)");
				}
			}
			return _method;
		}
		
	}
	
	$(".period").hover(function () {
		if ($(periodOpened)[0] != this) {
			$(this).find(".period-title, .period-company").css({
				"font-weight": "bold",
//				"color": "white"
			});
		}
	}, function () {
		$(this).find(".period-title, .period-company").css({
			"font-weight": "normal",
//			"color": "white"
		});
	})
	
	var scrollToPos = $("#resume-section-content-2").position().left + $("#scroller-0-inner").scrollLeft() - windowWidth + $("#resume-section-2").width();
	
	$("#resume-section-2").click(function () {
		$("#scroller-0-inner").scrollToMotion(scrollToPos, 800, {direction: 'x',easing:"easeOutQuad"});
	})
	
	var skillOpened = null;
	$(".skills-tab").click(function () {
		if (periodOpened != null) {
			periodSelect();		
		}
		skillsSelect($(this));
	})
	
	function skillsSelect(select) {
		if (select === undefined) {
			skillClose();
			return;
		}
		var $this = select;
		if (skillOpened === null) {
			skillOpened = $this;
			$("#skills-detail").scrollToMotion($this.index()*360, 0,{direction:"x"});
			skillOpen();
		}else if ($(skillOpened)[0] === $this[0]) {
			skillClose();	 
		}else {
			skillOpened = $this;
			skillOpen();
		}
		
		function skillOpen() {
			var tabPos = $this.position().left - 320 + $this.width()/2;
			$("#skills-detail-container").css("opacity", "1");
			$("#skills-tab-pointer").css({
				"transform": "translate3d(" + tabPos + "px,0,0)"
			});
			$(".skills-tab").removeClass("skills-tab-focus");
			$this.siblings().css("opacity", "0.4");
			$this.css("opacity", "1");
			$this.addClass("skills-tab-focus");
			$("#skills-brief").css({
				"transform": "perspective(200) translateZ(-50px)",
				"opacity": "0"
			});
			$("#skills-detail-container").css({
				"transform": "perspective(200) translateZ(0)",
				"opacity": "1"
			});
			$("#skills-detail").css("opacity", "1");
			$("#skills-detail").scrollToMotion($this.index()*360, 400,{direction:"x"});
		}
		
		
		function skillClose() {
			$(".skills-tab").css("opacity", "0.6");
			skillOpened.removeClass("skills-tab-focus");
			$("#skills-brief").css({
				"transform": "perspective(200) translateZ(0)",
				"opacity": "1"
			});
			$("#skills-detail-container").css({
				"transform": "perspective(200) translateZ(50)",
				"opacity": "0"
			});
			$("#skills-detail").css("opacity", "0");
			skillOpened = null;
		}
	}
	
	$(".works-focus-wrapper-inner").click(function () {
		worksFocus($(this)).play();
		clearInterval(timer);
	})
	
	$("#focus-nav-prev").click(function () {
		worksFocus().prev();
	});
	$("#focus-nav-next").click(function () {
		worksFocus().next();
	})
	
	$("body").on("galleryOn", function () {
		worksFocus().galleryOn();
	});
	$("body").on("galleryOff", function () {
		worksFocus().galleryOff();
		dock().close();
	});
	$("body").on("worksOpen", function (e,worksOpenedIndex) {
		if (worksOpenedIndex === 0) {
			$("#focus-nav-prev").hide();
			$("#focus-nav-next").show();
		}else if (worksOpenedIndex === $(".works").length - 1) {
			$("#focus-nav-prev").show();
			$("#focus-nav-next").hide();
		}else {
			$(".focus-nav-btn").show();	
		}
	})
	
	var worksFocusWrapperInner = $(".works-focus-wrapper-inner");
	var worksWrapper = $(".works-wrapper");
	var thisIndex;
	var scrollYDistance = 0;
	var worksOpened = null;
	function worksFocus($this, option) {
		var scrollToPos;
		var galleryOpen = false;
		var alignYScrollToPos;
		if (!option) {
			var option = {};
		}
		option = $.extend({
			duration: 300,
			zoom: true,
			scroll: true,
			alignY:true,
			dockUpdate: true,
			lightup: true,
		}, option);
		
		
		var _method = {};
		

		_method.open = function () {
			if (option.alignY) {
				var screenPosAdjust;
				if ($("#container-1").height() > windowHeight) {
//					screenPosAdjust = windowHeight - $("#container-1").height();
					screenPosAdjust = 0;
				}else{
					screenPosAdjust = (windowHeight - $("#container-1").height())/2;	
				}
				alignYScrollToPos = $("#container-1").offset().top + $("#wrapper").scrollTop() - screenPosAdjust;
				scrollYDistance = alignYScrollToPos - $("#wrapper").scrollTop();
				if ($("#wrapper").scrollTop() !== alignYScrollToPos ) {
					$("#wrapper").scrollToMotion(alignYScrollToPos, option.duration, {direction:'y', easing: 'easeOutQuad', interruptible:false});
				}
			};
			
			
			if (option.scroll) {
				var thisMatrixValue = $this.parents(".works-wrapper").unmatrix();
				var thisTransX = thisMatrixValue[0].x;
				scrollToPos = $this.parents(".works-wrapper").offset().left + $("#scroller-1-inner").scrollLeft() + $this.parents(".works-wrapper").width()/2 - windowWidth/2 - thisTransX;
				$("#scroller-1-inner").scrollToMotion(scrollToPos,option.duration,{easing:"easeOutSine", direction:"x", interruptible:false});
			};
			if (worksOpened !== null) {
				worksFocusHandle(worksOpened).close()
			}else {
				$("body").trigger("galleryOn");
				galleryOpen = true;
			}
			worksOpened = $this;
			worksFocusHandle(worksOpened).open();
			
			$("#wrapper").css("pointer-events", "none");
			setTimeout(function () {
				$("#wrapper").css("overflow", "hidden");
				$("#scroller-1-inner").css("overflow-x", "hidden");
				$("#wrapper").css("pointer-events", "auto");
			}, 300)
			
			if (option.dockUpdate) {
				dock(thisIndex, {indexMode: true, c:0.2, spreadRange:1, transition: true, hoverStop: true, transitionDuration: option.duration/1.6}).update();
			}
		}
		
		_method.close = function () {
			worksFocusHandle(worksOpened).close();
			worksOpened = null;
			setTimeout(function () {
				$("#wrapper").css("overflow", "auto");
				$("#scroller-1-inner").css("overflow-x", "auto");		
			}, 300);
			$("body").trigger("galleryOff");
		}
		
		_method.play = function () {
			thisIndex = worksFocusWrapperInner.index($this);
			if ($this) {
				if ($(worksOpened)[0] === $this[0]) {
					_method.close();
				}else {
					_method.open();	
					$("body").trigger("worksOpen",thisIndex);
				}
//				
//				if (thisIndex = 0) {
//					$(body).trigger("worksFocusFirstChild");
//				} else if (thisIndex === lastIndex) {
//					$(body).trigger("worksFocusLastChild");
//				} else {					
//					$(body).trigger("worksFocusMiddleChild")
//				}
				
			}
		}
		
		_method.prev = function () {
			worksFocus(worksFocusWrapperInner.eq(thisIndex - 1)).play();
		}
		_method.next = function () {
			worksFocus(worksFocusWrapperInner.eq(thisIndex + 1)).play();
		}
		
		_method.galleryOn = function () {			
			$("#container-0, #container-2").css("z-index", "0");
			$("#black").css("opacity", "1");
			dockBottom().open()
			
			$("#scroller-1-inner").on("touchstart", function () {
			});
			$("#focus-nav").fadeIn(300);
			$("#scroller-1-inner").on('mousewheel', function(e){		
				e.preventDefault();
			});
			
			worksFocusWrapperInner.css("opacity", 0.4);
		}
		_method.galleryOff = function () {
			$("#black").css("opacity", "0");
			$("#scroller-1-inner").unbind("touchstart touchend touchmove");
			$("#focus-nav").fadeOut(300, function () {
				$("#container-0, #container-2").css("z-index", "3");
			});
			dockBottom().close();
			$("#scroller-1-inner").unbind('mousewheel');
			preventMacBackFwdGesture($('#scroller-1-inner'));
			worksFocusWrapperInner.css("opacity", 0.66);
		}
		
		_method.option = option;
		
		return _method;
		
		function worksFocusHandle($this) {
			var _method = {};
			_method.open = function () {
				if (option.zoom) {
					$this.css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(0,0,0)",
					});
					focusScrollWrapper($this).open();
					focusWorksAdjacent($this).open();
					$this.parents(".works-wrapper").addClass("works-wrapper-z");
				};
				if (option.lightup) {
					$this.css({
					"transition": option.duration/1000 + "s ease-out",
					"opacity": "1",
					});
				}
			};
			_method.close = function () {
				$this.css({
					"transition": option.duration/1000 + "s ease-out",
					"opacity": "0.4",
					});
				focusWorksAdjacent($this).close();
				setTimeout(function () {
					$this.parents(".works-wrapper").removeClass("works-wrapper-z");
				}, option.duration);
				focusScrollWrapper($this).close();
			};
			return _method;
		}
		
		
		
		function dockBottom() {
			var dockTransY = windowHeight - $("#dock-wrapper")[0].getBoundingClientRect().top - 40;
			dockTransY += scrollYDistance;
			var _method = {};
			_method.open = function () {
				$("#dock-wrapper").css("transform", "translate3d(0," + dockTransY + "px,0)");
			}
			_method.close = function () {
				$("#dock-wrapper").removeAttr("style");
			}
			return _method;
		};
		
		function focusScrollWrapper($this) {
			$this.parents(".works-focus-wrapper").css("transition", option.duration/1000 + "s ease-out");
			$this.css("transition", option.duration/1000 + "s ease-out");
			var _method = {};
			var scroll = false;
			var thisWorksFocusWrapper = $this.parents(".works-focus-wrapper");	
			var thisWorksFocusScroller = $this.parents(".works-focus-scroller");
			var transX = thisWorksFocusWrapper.data().transX;
			var transY = -$this[0].getBoundingClientRect().top + (windowHeight - 40 - $this.data().height)/2;
			transY = Math.round(transY);
			transY += scrollYDistance;
			var scale = $this.data().scale;
			_method.open = function () {
				$this.parents(".works-focus-wrapper").css("transition", option.duration/1000 + "s ease-out");
				$this.css({
					"transition": option.duration/1000 + "s ease-out",
					"cursor": "-webkit-zoom-out",
				});
				if ($this.data().height < windowHeight - 40 && $this.data().width < windowWidth) {
					thisWorksFocusWrapper.css({
						"transform" : "translate3d(" + transX + "px," + transY + "px,0)",
					});
				}else {
					scroll = true;
					var scrollerX = false;
					var scrollerY = false;
					
					var wrapperWidth, scrollWidth, wrapperHeight, scrollHeight, wrapperTransX, wrapperTransY, scrollerTransX, scrollerTransY;
					
					if ($this.data().width < windowWidth - 32) {
						wrapperWidth = $this.data().width;
						scrollWidth = $this.data().width;
						wrapperTransX = transX;
						scrollerTransX = 0;
					}else {
						scrollerX = true;
						wrapperWidth = windowWidth;
						scrollWidth = $this.data().width + 16;
						wrapperTransX =  -$this.data().width * (1 - $this.data().scale)/2;
						scrollerTransX =  -($this.data().width - windowWidth)/2;
					}
					
					if ($this.data().height < windowHeight - 80) {
						wrapperHeight = $this.data().height;
						scrollHeight = $this.data().height;
						wrapperTransY = transY;
						scrollerTransY = 0;
					}else {
						scrollerY = true;
						wrapperHeight = windowHeight;
						scrollHeight = $this.data().height + 60;
						wrapperTransY = -$this[0].getBoundingClientRect().top + 16;
					}
					
					
					wrapperTransX = Math.round(wrapperTransX);
					wrapperTransY = Math.round(wrapperTransY);
					if (scrollerY) {
						wrapperTransY += scrollYDistance;
					}
					
					thisWorksFocusWrapper.css({
						"transform" : "translate3d(" + wrapperTransX + "px," + wrapperTransY + "px,0)",
					});
					
					
					
					var scrollX = 0;
					var scrollY = 0;
					var scrollYMax = $this.data().height - windowHeight + 72;
					var scrollXMax = ($this.data().width - windowWidth)/2 + 32;
					thisWorksFocusScroller.on("mousewheel", function (event, delta, deltaX, deltaY) {
						event.prevertDefault;
						if (scrollerY === true) {
							scrollY -= 2 * deltaY;
							if (scrollY < 0) {
								scrollY += -scrollY/1;
							};
							if (scrollY > scrollYMax) {
								scrollY -= (scrollY - scrollYMax)/1;
							};
						};
						
						if (scrollerX === true) {
							scrollX += 2 * deltaX;
							if (scrollX < -scrollXMax) {
								scrollX += (-scrollXMax - scrollX)/1;
							};
							if (scrollX > scrollXMax) {
								scrollX -= (scrollX - scrollXMax)/1;
							};
						};
						$this.css({
							"transition" : "none",
							"transform": "translate3d(" + (-scrollX) + "px," + (-scrollY) + "px,0)",
						});
					})
					
					
				}
			}
			_method.close = function () {
				thisWorksFocusScroller.unbind("mousewheel");
				$this.scrollerCloseDelay = setTimeout(function () {
					thisWorksFocusWrapper.css("overflow" , "inherit");
				}, option.duration);
				
				thisWorksFocusWrapper.css({
					"transform": "translate3d(0,0,0)",
				});
				$this.css({
					"transform": "translate3d(0,0,0) scale(" + scale + ")",
					"transition": option.duration/1000 + "s ease-out",
					"cursor": "-webkit-zoom-in",
				});
				$(window).unbind("mousemove");
				$this.parents(".works-focus-scroller").css({
					"transform": "translate3d(0,0,0)",
					"transition": "0.3s ease-out",
				});
				
			}
			return _method;
		}
		
		function focusWorksAdjacent($this){			
			var thisIndex = worksFocusWrapperInner.index($this);
			var lastIndex = worksFocusWrapperInner.length - 1;
			
			var scaleThis = worksFocusWrapperInner.eq(thisIndex).data().scale;
			
			var _method  = {};
			
			_method.open = function () {
				var trans = ( $this.data().width * (1 - scaleThis) )/2;
				if ($this.parents(".works-wrapper").prev(".works-wrapper").length === 1) {
					var scalePrev = worksFocusWrapperInner.eq(thisIndex-1).data().scale;
					worksWrapper.eq(thisIndex - 1).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(" + -trans + "px,0,0)",
						});
				};
				if ($this.parents(".works-wrapper").prev(".works-wrapper").prev(".works-wrapper").length === 1) {
					var scalePrev = worksFocusWrapperInner.eq(thisIndex-2).data().scale;
					worksWrapper.eq(thisIndex - 2).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(" + -trans + "px,0,0)",
						});
				};
				if ($this.parents(".works-wrapper").prev(".works-wrapper").prev(".works-wrapper").prev(".works-wrapper").length === 1) {
					var scalePrev = worksFocusWrapperInner.eq(thisIndex-3).data().scale;
					worksWrapper.eq(thisIndex - 3).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(" + -trans + "px,0,0)",
						});
				};
				if ($this.parents(".works-wrapper").next(".works-wrapper").length === 1) {
					var scaleNext = worksFocusWrapperInner.eq(thisIndex+1).data().scale;
					worksWrapper.eq(thisIndex+1).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(" + trans + "px,0,0)",
						});
				};
				if ($this.parents(".works-wrapper").next(".works-wrapper").next(".works-wrapper").length === 1) {
					var scaleNext = worksFocusWrapperInner.eq(thisIndex+2).data().scale;
					worksWrapper.eq(thisIndex+2).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(" + trans + "px,0,0)",
						});
				};
				if ($this.parents(".works-wrapper").next(".works-wrapper").next(".works-wrapper").next(".works-wrapper").length === 1) {
					var scaleNext = worksFocusWrapperInner.eq(thisIndex+3).data().scale;
					worksWrapper.eq(thisIndex+3).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(" + trans + "px,0,0)",
						});
				};
			}
			_method.close = function () {
				if ($this.parents(".works-wrapper").prev(".works-wrapper").length === 1) {
					var scalePrev = worksFocusWrapperInner.eq(thisIndex-1).data().scale;
					worksWrapper.eq(thisIndex - 1).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(0,0,0)",
						});
				};
				if ($this.parents(".works-wrapper").prev(".works-wrapper").prev(".works-wrapper").length === 1) {
					var scalePrev = worksFocusWrapperInner.eq(thisIndex-2).data().scale;
					worksWrapper.eq(thisIndex - 2).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(0,0,0)",
						});
				};
				if ($this.parents(".works-wrapper").prev(".works-wrapper").prev(".works-wrapper").prev(".works-wrapper").length === 1) {
					var scalePrev = worksFocusWrapperInner.eq(thisIndex-3).data().scale;
					worksWrapper.eq(thisIndex - 3).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(0,0,0)",
						});
				};
				if ($this.parents(".works-wrapper").next(".works-wrapper").length === 1) {
					var scaleNext = worksFocusWrapperInner.eq(thisIndex+1).data().scale;
					worksWrapper.eq(thisIndex+1).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(0,0,0)",
					});
				};
				if ($this.parents(".works-wrapper").next(".works-wrapper").next(".works-wrapper").length === 1) {
					var scaleNext = worksFocusWrapperInner.eq(thisIndex+2).data().scale;
					worksWrapper.eq(thisIndex+2).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(0,0,0)",
					});
				};
				if ($this.parents(".works-wrapper").next(".works-wrapper").next(".works-wrapper").next(".works-wrapper").length === 1) {
					var scaleNext = worksFocusWrapperInner.eq(thisIndex+3).data().scale;
					worksWrapper.eq(thisIndex+3).css({
						"transition": option.duration/1000 + "s ease-out",
						"transform": "translate3d(0,0,0)",
					});
				};
			}
			return _method;
		}
	}
	
	var hoveredCell = $(".dock-cell").eq(0);
	$(".dock-cell").on("mouseenter touchmove", function (e) {
		hoveredCell = $(e.target);
	})
	
	function dock(csrX,option) {
		if (!option) {
			var option = {};
		}	
		option = $.extend({
			indexMode:false,
			b:1,
			c:0.7,
			spreadRange:6,
			easing:"easeOutSine",
			transition: false,
			normalize: false,
			hoverStop:false,
			transitionDuration:100,
		}, option)
		
		var _method = {}
		
		_method.update = function () {
			if (option.hoverStop) {
				if ($("#dock-wrapper").is(":hover")) {
					return;
				}
			}
			
			if (option.transition) {
				$("#dock").css("transition", option.transitionDuration/1000 + "s");
			}
			
			
//			var $this = hoveredCell;
//			if (option.indexMode) {
//				csrX = $(".dock-cell").eq(csrX).data().posCenterX;
//			} else if (option.normalize) {
//				csrX = $this.data().posCenterX;
//			} else {
//				csrX = csrX + dockCellWidth/2;
//			}
			
			var nearestCellIndex = 0; 
			var nearestDistance = windowWidth;
			for (var i = 0; i < arrPosCenterX.length; i++) {
				if ( Math.abs(csrX + dockCellWidth/2 - arrPosCenterX[i]) < nearestDistance) {
					nearestDistance = Math.abs(arrPosCenterX[i] - csrX);
					nearestCellIndex = i;
				}
			}
			
			if (option.indexMode) {
				csrX = $(".dock-cell").eq(csrX).data().posCenterX;
			} else if (option.normalize) {
				csrX = $(".dock-cell").eq(nearestCellIndex).data().posCenterX;
			} else {
				csrX = csrX + dockCellWidth/2;
			}
			
			var $this = $(".dock-cell").eq(nearestCellIndex);
			
			if (transitionDelayStart && !option.indexMode) {
				$("#dock").css("transition", "0.07s ease-in-out");
			}
			
			update();
			
			function update() {
				var t = Math.abs(csrX - $this.data().posCenterX);
				var d = $("#dock").width() / dockCellQuantity * option.spreadRange/2;
				t = d - t;
				var scale = (t < 0) ? option.b : $.easing[option.easing](null, t, option.b, option.c, d);
				var scaleOrigin = scale;
				if ((csrX - $this.data().posCenterX) > 0) {
					iterateTransOrigin = -mapping(csrX - $this.data().posCenterX, [0, dockCellWidth/2], [0,dockCellWidth/2 * (scale-1)])
				}else {
					iterateTransOrigin = mapping(-csrX + $this.data().posCenterX, [0, dockCellWidth/2], [0,dockCellWidth/2 * (scale-1)])
				}
				
				$this.css({
					"transform": "translate3d(" + iterateTransOrigin + "px,0,0) scale(" + scale/2 + ")",
				});
				
				iterateTransOrigin = dockCellWidth/2 * (scale-1) - iterateTransOrigin;
				var iterateTrans = Math.abs(iterateTransOrigin);
				var iterateObj = $this;
				var _easingScale = true;
				if (iterateObj.prev().length != 0){
					var iterateObj = $this.prev();
					var i = true;
					}
				while (i === true) {
					var t = Math.abs(csrX - iterateObj.data().posCenterX);
					t = d - t;
					if (_easingScale == true) {
						var scale = (t < 0) ? option.b : $.easing[option.easing](null, t, option.b, option.c, d);
					}else {
						var scale = 1;
					}
					var iterateTran = iterateTrans + dockCellWidth/2  * (scale - 1);
					iterateTrans += dockCellWidth  * (scale - 1);
					iterateObj.css({
						"transform": "translate3d(" + -iterateTran + "px,0,0) scale(" + scale/2 + ")",
					});
					if (iterateObj.prev().length === 0) {
						i = false;
					}else {
						iterateObj = iterateObj.prev();
					}
					
				}
				
				var iterateObj = $this;
				var iterateTrans =  dockCellWidth * (scaleOrigin - 1) - iterateTransOrigin;
				if (iterateObj.next().length !== 0){
					var iterateObj = $this.next();
					var i = true;
				}else {
					i = false;
				}
				while (i === true) {
					var t = Math.abs(csrX - iterateObj.data().posCenterX);
					t = d - t;
					if (_easingScale == true) {
						var scale = (t < 0) ? option.b : $.easing[option.easing](null, t, option.b, option.c, d);
					}else {
						var scale = 1;
					}
					var iterateTran = iterateTrans + dockCellWidth/2  * (scale - 1);
					iterateTrans += dockCellWidth * (scale - 1);
					iterateObj.css({
						"transform": "translate3d(" + iterateTran + "px,0,0) scale(" + scale/2 + ")",
					});
					if (iterateObj.next().length === 0) {
						i = false;
					}else {
						iterateObj = iterateObj.next();
					}
				}
			}
			
			transitionDelayStart = false;
			if (option.indexMode) {
				transitionDelayStart = true;
				transitionDelayOver = false
			}
			
		}
		
		_method.close = function () {
	//		clearTimeout(dockTransitionDelay);
	//		clearTimeout(dockScrollDelay)
			transitionDelayStart = true;
			transitionDelayOver = false
			$("#dock").css({
				"transition": "0.3s ease-in-out"
			});
			$(".dock-cell").css("transform", "translate3d(0,0,0) scale(0.5)");
		}
		
		return _method;
	}
	
	
	var transitionDelayOver = false;
	var transitionDelayStart = true;
	var dockCellWidth = $(".dock-cell").width()/2;
	var dockCellQuantity = $(".dock-cell").length;
	$("#dock").on('touchstart mousemove touchmove',function (e) {
		if (!e.originalEvent.touches) {
			e.touches = [{
				pageX: e.pageX,
			}]
		}else {
			e.touches = e.originalEvent.touches;
		}
		csrX = e.touches[0].pageX;
		
		if (transitionDelayOver||transitionDelayStart) {
			dock(csrX).update();
		}
		
	})
	
	var dockTransitionDelay;
	
	$("#dock").on("mouseenter touchstart", function () {
		dockTransitionDelay = setTimeout(function () {
			$("#dock").css("transition", "none");
			transitionDelayOver = true;
		}, 70);
	});
	
	$("#dock").on("mouseleave touchend", function () {
		if (!worksOpened) {
			dock().close();
		} else {
			dock(thisIndex, {indexMode:true, spreadRange: 1, c:0.2, normalize: true, transition:true, transitionDuration:100}).update();
		}
	})
	
//	var dockScrollDelay;
//	$(".dock-cell").hover(function () {
//		var n = $(this).index()
//		clearTimeout(dockScrollDelay);	
//	})
	
	$(".dock-cell").on("click touchend", function () {
		clearInterval(timer);
		if (!worksOpened) {
			var target = $(".works-wrapper").eq($(this).index()).find(".works-focus-wrapper-inner");
			var scrollToPos = target.parents(".works-wrapper").offset().left + $("#scroller-1-inner").scrollLeft() + target.parents(".works-wrapper").width()/2 - windowWidth/2;
			$("#scroller-1-inner").scrollToMotion(scrollToPos, 600 ,{easing: "easeOutQuad", direction:"x"});
			
		}else {
			worksFocusMotion($(this),160);
		}
	})
	
//	$(".dock-cell").hover(function () {
//		var $this = $(this);
//		if ($this.index() < thisIndex) {
//			$this.css("cursor", "w-resize");
//		}else if ($this.index() > thisIndex){
//			$this.css("cursor", "e-resize");
//		}else {
//			$this.css("cursor", "default");
//		}
//	})
	
	var timer;
	function worksFocusMotion($this, velocity) {
		var startIndex = $(".works-focus-wrapper-inner").index(worksOpened);
		var endIndex = $this.index();
		var steps = Math.abs(endIndex - startIndex);
		velocity = $.easing['easeOutSine'](null, steps, velocity, -velocity/14*11, 14);
		var endWork = $(".works-wrapper").eq(endIndex).find(".works-focus-wrapper-inner");
		if (startIndex === endIndex) {
			
		}else if (steps === 1) {
			worksFocus(endWork, {dockUpdate:true}).play();
		}
		
		else {
			var i = startIndex;
			var direction = startIndex < endIndex ? "++i" : "--i";
			
			function motion() {
				var target = $(".works-wrapper").eq(eval(direction)).find(".works-focus-wrapper-inner");
				var duration = $.easing[$.bez([0.05,0.445,0.95,0.55])](null, Math.abs(i - startIndex), 0, velocity * steps, steps) - $.easing[$.bez([0.05,0.445,0.95,0.55])](null, Math.abs(i - startIndex)-1, 0, velocity * steps, steps);
				
				if (i == endIndex) {
					worksFocus(target, {scroll: false, zoom: true, duration:duration, dockUpdate: true}).play();
					clearInterval(timer);
				}else {
					worksFocus(target, {scroll: false, zoom: false , lightup: false, duration:duration, dockUpdate: true}).play();
					timer = setTimeout(motion, duration);
				};
				
			};
			
			motion();
			var thisMatrixValue = $(".works-wrapper").eq($this.index()).unmatrix();
			var thisTransX = thisMatrixValue[0].x;
			var scrollToPos = endWork.parents(".works-wrapper").offset().left + $("#scroller-1-inner").scrollLeft() + endWork.parents(".works-wrapper").width()/2 - windowWidth/2 - thisTransX;
			var duration = Math.abs(startIndex - endIndex) * velocity;
			$("#scroller-1-inner").scrollToMotion(scrollToPos,duration ,{easing: "easeInOutSine", direction:"x", interruptible: false});
			
		}
	}
})