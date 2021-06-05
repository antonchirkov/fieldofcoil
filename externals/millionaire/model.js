function Millionaire(xmlData, wrapper, basePath) {
	
	// Constants
	var WIDTH = 960,
	    HEIGHT = 630,
	    HIGHLIGHT_DELAY = 600,
	    GAME_OVER_DELAY = 1000,
	    RULES = 'Правила игры</br></br>' +
	    		'Игра составлена по мотивам популярного шоу &laquo;Кто хочет стать миллионером&raquo;. ' +
	    		'Вам предстоит последовательно ответить на 15 вопросов: пять очень простых, пять &mdash; средней сложности и пять, требующих специальных знаний. ' + 
	    		'Во время игры вы можете воспользоваться тремя подсказками: &laquo;Помощь компьютера&raquo;, &laquo;Помощь знатоков&raquo;, &laquo;Помощь зрителей&raquo;. ' +
	    		'При помощи первой подсказки вы можете отсеять два неверных ответа; вторая подсказка даст более подробную информацию по вопросу; третья подсказка покажет мнение зрителей. ' +
	    		'Вы можете прекратить игру в любой момент, оставшись с теми очками, которые успели набрать. ' +
	    		'У вас есть возможность один раз изменить неправильный ответ, но если вы ответите неверно два раза, то все ваши очки &laquo;сгорают&raquo; и вы остаётесь ни с чем. ',
	    STEPS = [500, 1000, 2000, 3000, 5000, 10000, 
	             15000, 25000, 50000, 100000, 200000, 400000,
	             800000, 1500000, 3000000],
	    LEFT_BTN_WIDTH = '25%';
	
	// View
	var $container = $(wrapper),
	    $wrapper = $('<div class="millionaire"></div>'),
	    $leftBlock = $('<div class="leftBlock"></div>'),
	    $leftBlockInner  =$('<div class="leftInner"></div>'),
	    $rightBlock = $('<div class="rightBlock"></div>'),
	    $rightBlockInner  =$('<div class="rightInner"></div>'),
	    $leftButtonsBlock = $('<div class="leftBtns"></div>'),
	    $progressHandler = $('<div class="progressHandler"></div>'),
	    $banner = $('<div class="banner"></div>'),
	    $bottomBtns = $('<div class="bottomBtns"></div>'),
	    $blockingDiv = $('<div class="blockingDiv"></div>'),
	    $topBtns = $('<div class="topBtns"></div>'),
	    $popup = new Popup($wrapper),
	    $helpBtn = new Button({
	    	onClick: help
	    }),
	    $refreshBtn = new Button({
	    	onClick: refresh
	    }),
	    $answerBtn = new Button({
	    	disabled: true,
	    	text: 'Ответить',
	    	onClick: answerQuestion
	    }),
	    $takeMoneyBtn = new Button({
	    	disabled: true,
	    	text: 'Забрать деньги',
	    	last: true,
	    	onClick: takeMoney
	    }),
	    $fiftyFifty = new Button({
	    	width: LEFT_BTN_WIDTH,
	    	onClick: fiftyFifty,
	    	cls: 'fifty-fifty-btn'
	    }),
	    $callFriend = new Button({
	    	width: LEFT_BTN_WIDTH,
	    	onClick: callFriend,
	    	cls: 'call-friend-btn'
	    }),
	    $auditoriumHelp = new Button({
	    	width: LEFT_BTN_WIDTH,
	    	onClick: auditoriumHelp,
	    	cls: 'auditorium-help-btn'
	    }),
	    $renew = new Button({
	    	width: LEFT_BTN_WIDTH,
	    	last: true,
	    	cls: 'renew-btn'
	    }),
	    width = WIDTH,
	    height = HEIGHT,
	    wrongSound = new Audio('externals/millionaire/sounds/sound66.mp3'),
	    correctSound = new Audio('externals/millionaire/sounds/sound65.mp3');
	
	// Logic
	var xmlData = xmlData,
	    data = m_parseData(xmlData),
	    progress = new Progress($progressHandler),
		question = new Question({wrapper: $rightBlockInner}),
		gameOver = false,
	    currentStep = 1;
	
	this.init = function() {
		if ($container.width() != 0) {
			width = $container.width();
		}
		if ($container.height() != 0) {
			height = $container.height();
		}
		var scale = width / WIDTH;
		$container.width(WIDTH * scale);
		$container.height(HEIGHT * scale);
		$container.css({'overflow': 'hidden', 'padding': '8px'});
		$wrapper.css({'-moz-transform': 'scale(' + scale + ')',
					  '-webkit-transform': 'scale(' + scale + ')',
					  '-o-transform': 'scale(' + scale + ')',
					  'transform': 'scale(' + scale + ')'});
		$container.append($wrapper);
		$wrapper.append($blockingDiv);
		$wrapper.append($leftBlock);
		$wrapper.append($rightBlock);
		$leftBlock.append($leftBlockInner);
		$leftBlockInner.append($leftButtonsBlock);
		$leftBlockInner.append($progressHandler);
		$rightBlock.append($rightBlockInner);
		$rightBlockInner.append($banner);
		$rightBlock.append($bottomBtns);
		$answerBtn.renderTo($bottomBtns);
		$takeMoneyBtn.renderTo($bottomBtns);
		$rightBlock.append($topBtns);
		$refreshBtn.renderTo($topBtns);
		$helpBtn.renderTo($topBtns);
		if ($fiftyFifty != null) {
			$fiftyFifty.renderTo($leftButtonsBlock);
		}
		if ($callFriend != null) {
			$callFriend.renderTo($leftButtonsBlock);
		}
		if ($auditoriumHelp != null) {
			$auditoriumHelp.renderTo($leftButtonsBlock);
		}
		if ($renew != null) {
			$renew.renderTo($leftButtonsBlock);
		}
		$popup.init();
		progress.init();
		question.init();
		
		setTimeout(function() {
			var margin = ($leftBlock.height() - $leftButtonsBlock.outerHeight() -$progressHandler.height()) / 2;
			$progressHandler.css('margin', margin + 'px 0 ' + margin + 'px 0');
			
			var questionHeight = $rightBlockInner.height() - $banner.height();
			question.setHeight(questionHeight);
		}, 400);
		
		question.createVariants(data[currentStep - 1]);
		setTimeout(function() {
			$blockingDiv.hide();
		}, 400);
	};
	
	function fiftyFifty() {
		$fiftyFifty.disable();
		var variants = question.getVariants(),
		    variant;
		for (var i = 0; i < variants.length; i++) {
			variant = variants[i];
			if (variant.getParams().laga == 'true') {
				variant.hideVariant();
			}
		}
	}
	
	function callFriend() {
		$callFriend.disable();
		$popup.show({text: question.getTip()});
	}
	
	function auditoriumHelp() {
		$auditoriumHelp.disable();
		$popup.show({text: 'Помощь зала', stat: true});
	}
	
	function answerQuestion() {
		var variant = question.getActive(),
		    params = variant.getParams();
		question.setActive(null);
		$answerBtn.disable();
		if (params.wrong == 'false') {
			variant.highlightGreen(HIGHLIGHT_DELAY);
			try {
				correctSound.play();
			} catch(e) {}
			setTimeout(function() {
				currentStep += 1;
				if (currentStep == 16) {
					mGameOver(STEPS[currentStep - 2]);
					return;
				}
				progress.setActiveItem(currentStep - 1);
				question.createVariants(data[currentStep - 1]);
				if (currentStep > 1) {
					$takeMoneyBtn.enable();
				}
			}, HIGHLIGHT_DELAY + 1);
		} else if (params.wrong == 'true' && !$renew.isDisabled()) {
			variant.highlightRed(HIGHLIGHT_DELAY);
			try {
				wrongSound.play();
			} catch(e) {}
			setTimeout(function() {
				$renew.disable();
				variant.disable();
				variant.setNonActive();
				$answerBtn.disable();
			}, HIGHLIGHT_DELAY + 1);
		} else {
			variant.highlightRed(GAME_OVER_DELAY);
			question.getRightVariant().highlightGreen(GAME_OVER_DELAY);
			try {
				wrongSound.play();
			} catch(e) {}
			setTimeout(function() {
				var score = currentStep == 14 ? STEPS[9] : currentStep > 10 ? STEPS[9] : currentStep > 5 ? STEPS[4] : 0; 
				mGameOver(score);
			}, GAME_OVER_DELAY + 1);
		}
	}
	
	function mGameOver(score) {
		$popup.show({text: 'Игра закончена.</br>Вы заработали ' + score + ' очков.'});
		$takeMoneyBtn.disable();
		$answerBtn.disable();
		question.disableAll();
		$fiftyFifty.disable();
		$callFriend.disable();
		$auditoriumHelp.disable();
		$renew.disable();
		gameOver = true;
	}
	
	function takeMoney() {
		mGameOver(STEPS[currentStep - 1]);
	}
	
	function help() {
		
		$popup.show({text: RULES});
	}
	
	function refresh() {
		$container.html('');
		new Millionaire(xmlData, $container, basePath).init();
	}
	
	function Question(params) {
		
		// View
		var questionBlk = $('<div class="question"></div>'),
		    mainQuestion = $('<div class="mainQuestion"></div>'),
		    mainQuestionText = $('<div class="mainQuestionText"></div>'),
		    variantsWrapper = $('<div class="variantsWrp"></div>'),
		    wrapper = params.wrapper,
		    currentData,
		    activeVariant,
		    variants = [];
		
		this.init = function() {
			wrapper.append(questionBlk);
			questionBlk.append(mainQuestion);
			mainQuestion.append(mainQuestionText);
			questionBlk.append(variantsWrapper);
			setTimeout(function() {
				var height = questionBlk.height() - mainQuestion.height() - (mainQuestion.css('margin-top').replace('px', '') * 2); 
				variantsWrapper.height(height);
			}, 500);
		};
		
		this.getRightVariant = function() {
			var variant;
			for (var i = 0; i < variants.length; i++) {
				variant = variants[i];
				if (variant.getParams().wrong == 'false') {
					return variant;
				}
			}
			return null;
		};
		
		this.getTip = function() {
			return currentData.tip;
		};
		
		this.getVariants = function() {
			return variants;
		};
		
        this.getActive = function() {
        	return activeVariant;
        };	
        
        this.setActive = function(variant) {
        	activeVariant = variant;
        };
		
		this.setHeight = function(height) {
			questionBlk.height(height);
		};
		
		this.disableAll = function() {
			for (var i = 0; i < variants.length; i++) {
				variants[i].setNonActive();
				variants[i].disable();
			}
		}; 
		
		this.createVariants = function(data) {
			variants = [];
			variantsWrapper.html('');
			currentData = data;
			mainQuestionText.hide();
			mainQuestionText.html(data.question);
			setTimeout(function() {
				var margin = (mainQuestion.height() - mainQuestionText.height()) / 2;
				mainQuestionText.css('margin', margin + 'px 0');
				mainQuestionText.show();
			}, 400);
			var tempArray = shuffle(data.variants);
			data.variants = tempArray;
			for (var i = 0; i < data.variants.length; i++) {
				var varData = data.variants[i];
				varData['index'] = i;  
				var variant = new Variant(varData);
				variant.init();
				variant.renderTo(variantsWrapper);
				variants.push(variant);
			}
		};
		
		function Variant(params) {
			// Constants
			var LABELS = ['A', 'B', 'C', 'D'];
			
			// Params
			var text = params.text,
			    index = params.index,
			    params = params;
			
			// View
			var $variant = $('<div class="variant"></div>'),
			    $label = $('<div class="label ' + LABELS[index] + '"></div>'),
			    $text = $('<div class="text"></div>'),
			    $innerText = $('<div class="innerText"></div>'),
			    _this = this;
			
			this.init = function() {
				$variant.append($label);
				$variant.append($text);
				$text.append($innerText);
				
				if (text || '') {
					$innerText.hide();
					$innerText.html(text);
					setTimeout(function() {
						var margin = ($text.height() - $innerText.height()) / 2;
						$innerText.css('margin', margin + 'px 0');
						$innerText.show();
					}, 500);
				}
				
				if (index > 1) {
					$variant.css('margin-bottom', '0');
				}
				
				$variant.click(function() {
					for (var i = 0; i < variants.length; i++) {
						variants[i].setNonActive();
					}
					_this.setActive();
					$answerBtn.enable();
				});
			};
			
			this.getParams = function() {
				return params;
			};
			
			this.setActive = function() {
				$variant.addClass('active');
				question.setActive(_this);
			};
			
			this.setNonActive = function() {
				$variant.removeClass('active');
				question.setActive(null);
			};
			
			this.disable = function() {
				$variant.addClass('disabled');
				$variant.unbind('click');
			};
			
			this.renderTo = function(wrapper) {
				wrapper.append($variant);
			};
			
			this.hideVariant = function() {
				$variant.unbind('click');
				$variant.addClass('disabled');
				$variant.html('');
			};
			
			this.highlightGreen = function(time) {
				$variant.addClass('green');
				setTimeout(function() {
					$variant.removeClass('green');
				}, time);
			};
			
			this.highlightRed = function(time) {
				$variant.addClass('red');
				setTimeout(function() {
					$variant.removeClass('red');
				}, time);
			};
		}
	}
	
	function Button(params) {
		if (!(params || '')) {
			return null;
		}
		// Params
		var width = params.width,
		    height = params.height,
		    cls = params.cls,
		    last = params.last,
		    text = params.text,
		    disabled = params.disabled,
		    onHover = params.onHover,
		    onClick = params.onClick,
		    activeOnClick = onClick;
		
		// View
		var button = $('<div class="button"></div>'),
		    img;
		if (cls || '') {
			button.addClass(cls);
		}
		if (last || '') {
			button.addClass('last');
		}
		if (width || '') {
			button.css('width', width);
		}
		if (disabled || '' && disabled) {
			disable();
		}
		if (text || '') {
			button.html(text);
			setTimeout(function() {
				button.css('line-height', button.height() + 'px');	
			}, 500);
		}
		if (activeOnClick == null) {
			button.css('cursor', 'default');
		}
		button.click(function() {
			if (activeOnClick != null) {
				activeOnClick();
			}
		});
		
		this.renderTo = function(wrapper) {
			wrapper.append(button);
		};
		
		this.disable = function() {
			disable();
		};
		
		this.enable = function() {
			button.removeClass('disabled');
			activeOnClick = onClick;
			button.css('cursor', 'pointer');
		};
		
		this.isDisabled = function() {
			return button.hasClass('disabled');
		};
		
		function disable() {
			button.addClass('disabled');
			activeOnClick = null;
		}
	}
	
	function Progress(wrapper) {
		// View
		var $wrapper = $(wrapper);
		
		// Logic
		var items = [],
		    activeItem = null;
		
		this.init = function() {
			for (var i = STEPS.length - 1; i >= 0; i--) {
				var solid = false;
				if ((i + 1) % 5 == 0) {
					solid = true;
				}
				var item = new Item({index: i + 1, value: STEPS[i], solid: solid});
				items.unshift(item);
				item.renderTo($wrapper);
				if (i == 0) {
					activeItem = item;
					item.setActive();
				}
			}
		};
		
		this.resize = function() {
			$.each(items, function() {
				$(this).resize();
			});
		};
		
		this.getItems = function() {
			return items;
		};
		
		this.setActiveItem = function(index) {
			for (var i = 0; i < items.length; i++) {
				items[i].setNonActive();
			}
			items[index].setActive();
		};
		
		this.getActiveItem = function() {
			return activeItem;
		};
		
		function Item(params) {
            
			// Data  			
			var params = params;
			
			if (!(params || '')) {
				return;
			}
			// Constants
			var DEFAULT_FONT_SIZE = 22;
			
			// View
			var item = $('<div class="item"></div>'),
			    index = $('<div class="index">' + params.index + '</div>'),
			    value = $('<div class="value">' + params.value + '</div>');
			
			item.append(index);
			item.append(value);
			
			if ((params.solid || '') && params.solid) {
				item.addClass('solid');
			}
					
			this.getParams = function() {
				return params;
			};
			
			this.renderTo = function(wrapper) {
				$(wrapper).append(item);
			};
			
			this.setActive = function() {
				item.addClass('active');
			};
			
			this.setNonActive = function() {
				item.removeClass('active');
			};
		}
	}
	
	function Popup(wrapper) {
		
		var _this = this;
		
		// View
		var $wrapper = wrapper,
		    $popup = $('<div class="popup"></div>'),
		    $popupBack = $('<div class="popupBack"></div>'),
		    $content = $('<div class="content"></div>'),
		    $buttonWrapper = $('<div class="buttonWrapper"></div>'),
		    $stat = $('<div class="stat"></div>'),
		    $A = $('<div class="A percent 1"></div>'),
		    $B = $('<div class="B percent 2"></div>'),
		    $C = $('<div class="C percent 3"></div>'),
		    $D = $('<div class="D percent 4"></div>'),
		    $okBtn = new Button({
		    	text: 'Ok',
		    	onClick: buttonClick
		    });
		
		this.init = function() {
			var _this = this;
			$wrapper.append($popup);
			$wrapper.append($popupBack);
			$popup.append($content);
			$popup.append($stat);
			$stat.append($A);
			$stat.append($B);
			$stat.append($C);
			$stat.append($D);
			$popup.append($buttonWrapper);
			$okBtn.renderTo($buttonWrapper);
			$popupBack.click(function() {
				_this.close();
			});
		};
		
		this.show = function(params) {
			var html = params.text;
			if (params.stat || '' && params.stat) {
				$stat.show();
				$stat.addClass('visible');
			} else {
				$stat.hide();
				$stat.removeClass('visible');
			}
			$content.html(html);
			$popupBack.show();
			statPositioning();
			setTimeout(function() {
				if (params.stat || '' && params.stat) {
					$popup.css('width', '50%');
				}	
				popupPositioning();
				$popup.fadeIn(400);
			}, 300);
		};
		
		this.close = function() {
			$popup.fadeOut(400);
			setTimeout(function() {
				$popup.css('width', '60%');
				$popupBack.hide();
			}, 400);
		};
		
		function popupPositioning() {
			if (!$stat.hasClass('visible')) {
				if ($popup.height() > $wrapper.height() * 0.8) {
					$popup.width($popup.width() + ($wrapper.height() / 100));
					popupPositioning();
					return;
				}
			}
			var statMargin = ($popup.width() - $stat.width()) / 2;
			$stat.css('margin', '0 ' + statMargin + 'px 0 ' + statMargin + 'px');
			
			var top = ($wrapper.height() - $popup.outerHeight()) / 2,
			    left = ($wrapper.width() - $popup.outerWidth()) / 2;
			$popup.css({'top': top + 'px', 'left': left});
			$popup.fadeIn(400);
		}
		
		function statPositioning() {
			$stat.width($wrapper.width() * 0.4);
			$stat.height($stat.width() * 1.1);
			var variants = question.getVariants(),
			    variant, percent,
			    scale = ($stat.height() * 0.77) / 100;
			for (var i = 0; i < variants.length; i++) {
				variant = variants[i];
				percent = variant.getParams().percent;
				$stat.find('.percent.' + (i + 1)).height(percent * scale);
			}
		}
		
		function buttonClick() {
			_this.close();
		}
		
	};
	
	function m_parseData(xmlData) {
		var div = $('<div></div>'),
		    data = [];
		div.append(xmlData);
		
		var levels = div.find('level');
		levels.each(function() {
			var level = {},
				question = typeof $(this).attr('text') != 'undefined' ? $(this).attr('text').substring(0, 90) : '',
				tip = $(this).attr('tip'),
				variants = $(this).find('variant');
			level['tip'] = tip;
			level['question'] = question;
			level['variants'] = [];
			
			variants.each(function() {
				var variant = {};
				variant['text'] = typeof $(this).attr('text') != 'undefined' ? $(this).attr('text').substring(0, 40) : '';
				variant['wrong'] = $(this).attr('wrong');
				variant['percent'] = $(this).attr('percent');
				variant['laga'] = typeof $(this).attr('laga') != 'undefined' ? $(this).attr('laga') : $(this).attr('fifty');
				variant['color'] = $(this).attr('color');
				level.variants.push(variant);
			});
			data.push(level);
		});
		return data;
	}
	
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		}

		return array;
	}
}; 