
$.extend(IReact, {

	// комнатная температура
	roomTemperature: 20,

	// uniqueID
	_uniqueID: 0,

});

IReact.EquipModel = Backbone.Model.extend({
	initialize: function(options) {
		if (!options.id) options.id = 'equip' + IReact._uniqueID++;
		this.set(options);
		this.type = options.type;
	},
	delete: function ()
	{
		this.trigger("delete", this);
	}
});


IReact.EquipCollection = Backbone.Collection.extend({
	model: IReact.EquipModel
});


// Базовый интерфейс для оборудования(колбы, стенды, инструменты и др) на химическом столе
IReact.EquipView = Backbone.View.extend({
	className: 'equip',

	// можно ли приблизить предмет
	zoomer: false,

	// класс который добавляется элементу как индикатор что элемент активен для взаимодействия
	activeClass: "active",

	// можно ли передвигать по сцене
	isDraggable: true,

	// включено ли событие перетаскивания
	dragTriggerEnabled: false,

	tolerance: "touch",

	// название слота, куда присоединится элемент при attachTo, equip[slotName]
	slotName: 'slot',

	// теплопроводность, влияет на скорость нагрева
  transcalency: null,

	// теплопроводность реагента, по умолчанию до 100 градусов за 10 минут
  transcalencyReagent: (100-IReact.roomTemperature)/(10*60),

	// при отсоединении элемента, ставить курсор по центру элемента
	detachingCursorAtCenter: false,

	// некоторые элементы должны быть всегда поверх других, например крышка
	zIndexInShelf: 0,

	// по умолчанию курсор при хватании элемента распологается в месте хватания
	cursorAt: null,

	// функция вызывается во время скриптового передвижения (revert, solution)
	animatePosition: null,

	// поддерживаемые состояния
	supportedStates: 'all',

	// температура
	// temperature: IReact.roomTemperature,

	// увеличивать ли если добавляется реагент
	hasZoomWhenReagentAdd: true,

	// конфиг, какие объекты могут быть присоеденены
	allowAttach: {},

	// по умолчанию какую максимальную дозу может вместить оборудование
	maxdose: Infinity,

	// по умолчанию какую максимальную дозу может вместить оборудование
	maxdose: Infinity,

	// размер регистрируемого реагента
	size: Infinity,

	// размещение в родительском оборудовании
	valign: "bottom",
	align: "center",

	initialize: function(options) {
		this.model = options.model;
		this.$parent = options.parent;
		this.iReact = options.iReact;
		this.reagents = [];
    this.effects = [];

		if (options.slotName) this.slotName = options.slotName;

		this.listenTo(this.model, 'remove', this.remove);
		this.listenTo(this.model, 'change:disable', this.disable);

		// синхронизируем dom, для удобства
		// используется в iReact.verifyStep
		// TODO: метод? используется в burner
		this.listenTo(this.model, 'change:status', function (model, status) {
			this.$el.attr('status', status);
		});

		this.slots = {};

		this.promise = $.when();

    // this.model.on("change:attachedTo", function (model, attachedTo) {
		// 	this.attachTo
		// }, this);

		// <equip dose=".."/> сколько ml по умолчанию передаст
    var dose = this.model.get("dose");
    if (dose) this.dose = dose;
	},
	render: function() {
		var self = this,
				model = this.model,
				id = model.get('id'),
				left = model.get('left'),
				top = model.get('top'),
				type = model.get('type'),
				subtype = model.get('subtype'),
				reagent = this.iReact.findReagent(model.get('reagent')),
				color = reagent && reagent.color,
				state = reagent && reagent.state,
				status = model.get('status'),
				size = model.get('size'),
				closed = model.get('closed'),
        title = this.title || model.get('title'),
				attachto = model.get('attachto') || model.get('stand') || model.get('setupto'), // old support
				paint = model.get('color'),	// цвет окрашивания модели
				label = this.model.get('label');

		// установки, в которых принимает участие
		this.setups = [];

		this.$parent.append(this.$el);

		this.$el
				.addClass("empty")	// ??
				.addClass(type)
				.addClass(subtype)
				.attr({
					id:id,
					type:type,
					subtype:subtype,
					title:title,
					effect:this.hasEffect ? this.effect : "",
					"react-valign": this.valign,
					"react-align": this.align,
					"react-object": this['react-object'] ? "" : null,
				})
				.droppable({
					drop: function(event, ui) {self.onDrop($(ui.draggable))},
					// greedy : true,
					// accept: ".special",
					// tolerance: "pointer"	// Не можем использовать потому что область взаимодействия у шпателя больше
					over: function(event, ui) {self.onOver(event, ui)},
					out: function(event, ui) {self.onOut(event, ui)},
					tolerance: this.tolerance,
					// accept: this.accept,
					// accept: function ($ui) {
					// 	console.log(this.className);
						// $(this).stop().css('border', '1px solid red').delay(1000).animate({border:''})
						// return true;
					// }
				});
				// TODO: over и out включать по необходимости

				// .mousedown(function () {	// при нажатии - открепляем, что бы не было конфликтов координат в dragging, в dragging нужно что бы уже было откреплено, из-за zindex
				// 	self.detaching();
				// 	return true;
				// })
		    // .mouseup(function () {
				// 	if (!self.isDragging()) { 	// если не тянули, то прикрепряем обратно
				// 		self.attach();
				// 	}
				// })
				// .css('border', '1px solid red');

		if (label) {
			$('<div/>')
				.appendTo(this.$el)
				.addClass('label')
				.attr({
					"react-valign": "middle",
					"react-align": "left",
					"react-width": "full",
					"length": label.length,
				})
				.html(label);
		}

		if (this.isDraggable) {
			this.$el.draggable({
				classes: {
					"ui-draggable-dragging": "detaching"
				},
				start: function (event, ui) {return self.dragStart(event, ui)},
				stop: function (event, ui) {return self.dragStop(event, ui)},
				cursorAt: this.cursorAt,
			});
			if (this.dragTriggerEnabled) this.dragTriggerEnable();
		}

		// closed
		if (closed) this.$el.addClass('closed');

		this.$el.data('equip', this);

		// создаем .animation перед тем как добавим реагент
		this.renderAnimation({
			type: type,
			color: color,
			state: state,
			status: status ? status : (reagent ? "full" : "empty"),
			size: size,
			paint: paint,
		});

		// base reagent
		if (reagent) {
			this.isSender = true;
			this.addReagent($.extend({}, reagent), {initialize: true});
		}

		// if (this.isSender) {
		// 	this.$el.droppable({
		// 		over: function(event, ui) {self.onOver(event, ui)},
		// 		out: function(event, ui) {self.onOut(event, ui)},
		// 	});
		// }

		// TODO: method ?
		if (this.isReceiver) {
			this.$el.attr("receiver", ""); // for easyest selecting [receiver]
		}

		// присоединен
		if (attachto) {
			var $attachTo = this.iReact.$el.find('#' + attachto),
					equip = $attachTo.data('equip');
			this.attachTo(equip, {initialize: true});
		}

		if (this.zoomer) this.renderZoomer();

		// this.up();

		return this;
	},

	dragTriggerEnable: function () {
		var self = this;
		this.$el.draggable({
		  drag: function (event, ui) {return self.onDrag(event, ui)}
		});
	},

	isReactor: function () {
		if (this.reagents.length 	// .isReceiver плохо работает с tool, потому как toggle iSReceiver
			|| this.isReceiver // на случай если по каким-то причинам receiver пуст
			|| this.isTool // на случай если тул (вообще в сборке используется с проводимостью медной проволки)
		) {
			return true;
		}
	},

	renderAnimation: function (options) {
		if (modelNS.IReact[options.type]) {
			this.animation = new modelNS.IReact[options.type](options).render(this.$el);
			this.$el.data("animation", this.animation);	// old support
			if (!this.animation) console.warn("animation ["+this.model.get('type')+"] return " + this.animation);	// helper
		}
	},

	// перенаправляет взаимодействия связаные на другое оборудование
	redirect: function (equip) {
		this.redirectTarget = equip;
	},

	touchTarget: function (equip) {
		if (equip && equip.redirectTarget) {
			return this.touchTarget(equip.redirectTarget);
		}
		if (this.touchEquip) {
			if (this.touchEquip == equip)
				return;
			this.touchEquip.active(false);
			this.unposible(false);
		}
		this.touchEquip = equip;
		if (this.touchEquip) {
			this.touchEquip.active();
			if (equip.reagents.length>0																	// если емкость не пустая
				&& !this.iReact.findReaction(equip.getReagent(), this)		// и не существует реакция
				&& (this.reagents.length && !equip.reagents[0].name == this.reagents[0].name) // и реагент не тот же самый, то помечаем что не возможна реакция
			) {
				this.unposible();
			}
		}
	},

	onOver: function (event, ui) {
		var equip = ui.draggable.data('equip');

		if (!equip) {	// posible when angle change etc
			return;
		}

		this.onEquipOver(equip);
		equip.onDragOver(this);
	},

	onOut: function (event, ui) {
		var equip = ui.draggable.data('equip');

		if (!equip) {
			return;
		}

		this.onEquipOut(equip);
		equip.onDragOut(this);
	},

	// на это оборудование навели
	onEquipOver: function (equip) {},
	onEquipOut: function (equip) {},

	// это оборудование наведено на другое
	onDragOver: function (equip) {},
	onDragOut: function (equip) {},

	zoom: function (is)
	{
		if (is || is === undefined) {
			this.iReact.zoom(this);
		} else {
			if (this.iReact.zoomTimer) this.iReact.zoomOut();
		}
	},

	zoomIn: function ()
	{
		if (this.animation) this.animation.zoomIn();
	},

	zoomOut: function ()
	{
		if (this.animation) this.animation.zoomOut();
	},

	renderZoomer: function ()
	{
		var self = this;

		this.$zoomer = $('<div class="equip-zoomer"/>')
			.click(function () {
				self.iReact.zoom(self);
				return false;
			})
			.appendTo(this.$el);
	},

	dragStart: function (event, ui) {
		this.savePosition(ui ? ui.position : this.position(), this.$shelf); // ui.position wrong after

		this.detachEventCorrecting(event, ui);

		this.closeTooltip();
		this.disableTooltip();

    this.up();

		this.catchedBy = null;

		this.defineShelf(null);

		this.trigger("dragStart");
  },

	onDrag: function (event, ui) {
		this.trigger("drag", event, ui);
	},

	// если произошло отсоединенеие
	// то позицию нужно откоректировать относительно нового родителя
	detachEventCorrecting: function (event, ui) {
		if (this.detaching() && event) {	// в случае симуляции event пустой

			var draggable = this.$el.draggable("instance"),
					offset = draggable.offset,
					width = this.$el.width(),
					height = this.$el.height();

			// если после отсоединения уменьшились размеры двигаемого элемента
			if (offset.click.left > width || this.detachingCursorAtCenter) {
				this.$el.draggable({cursorAt:{left:width/2, top:height/2}});
			}
			// console.log(this.$el.draggable("instance").offset)
			draggable._mouseStart( event );

			// после разового просчета сбрасываем позицианирование по курсору
			this.$el.draggable({cursorAt:this.cursorAt});
		}
	},

	dragStop: function () {
		// Если полка не нашлась и при этом не происходит анимации выливания, то возвращаемся откуда пришли
		if (!this.$shelf && !this.isDischarging()) {
			this.revert();
		}

		// Если приземлились на полку, то отсоединяемся
		if (this.$shelf) {
			if (this.iReact.validateStep(this, {detach: true}) ||
				this.iReact.validateStep(this, {attachto: 'shelf_' + this.$shelf.data("level")})
			) {
				this.detach();
				// this.clearRevert();
			} else {
				this.revert();
			}
		}

		this.enableTooltip();

		this.trigger("dragStop");
	},

	cancelDrag: function () {
		this.ignoreMouse = true;
		// var draggable = this.$el.draggable("instance");
		// draggable.cancel();
		// this.revert();
		$(document).trigger("mouseup");
		this.ignoreMouse = false;
	},

	remove : function ()
	{
		this.$el.remove();
	},

	setShelf: function ($shelf, align, position, level) {
		// presetuped
		if (this.setup) return;

		// до просчета ширины, что бы применились необходимые стили
		this.defineShelf($shelf);

		// отступ между элементами
		var $equip = this.$el,
				indent = 10,
				rect = $equip[0].getBoundingClientRect(),
				width = rect.width / CourseConfig.zoomScale;

		if (position.left) {
			$equip.css('left', position.left);
		} else if (position.right) {
			$equip.css('right', position.right);
		} else if (align == 'right') {
			var outset = $shelf.data("rightOutset");
			$equip.css('right', outset + indent);
			$shelf.data("rightOutset", outset + width + indent);
		} else {
			var outset = $shelf.data("leftOutset");
			$equip.css('left', outset + indent);
			$shelf.data("leftOutset", outset + width + indent);
		}

		if ($shelf.hasClass('level-0') && (position.bottom || position.top)) {
			if (position.top) $equip.css('top', $shelf.position().top + position.top);
			if (position.bottom) $equip.css('bottom', position.bottom);
		} else {
			this.landToShelf($shelf);
		}

		this.up({level:level});
	},

	// "приземляет" элемент на полку
	landToShelf: function ($shelf) {
		this.$el.css('top', $shelf.position().top/CourseConfig.zoomScale + $shelf.height() - this.$el.height());
	},

	// обозначить на полке
	defineShelf: function ($shelf) {
		this.$shelf = $shelf;
		if ($shelf) {
			this.$el.attr('shelf', $shelf.data('level'));
		} else {
			this.$el.attr('shelf', null);
		}
	},

  addEffect: function (type, options) {
		// TODO: эффекты нужно к реагентам присваивать, а не к оборудованию
		this.effects.push(type);

		this.checkReaction(null, {initiator:type});

		this.iReact.verifyStep();
		this.iReact.verifyStep({effect:type}, options);

    // TODO: неправильные действия сохранять? (burn, but what with mix?)
		// ..
  },

	revert: function (callback) {
		var self = this;

		if (this.savedPosition) {
			this.$el
				.stop()
				.addClass('revert')
				.animate(this.savedPosition, {
					progress: this.animatePosition && function () {self.animatePosition()},
					complete: function () {
					 	$(this).removeClass('revert');

						// verifystep - если инструмент перетащили из сборки чтобы набрать реагент, то нужно проверить шаг
						// TODO: передавать в .revert нужен ли verifyStep из инструмента (т.е. был ли взят реагент)
						self.attach({verifystep:true});

						self.trigger("reverted"); // после аттача, используется в инструментах и реверт шага

						if (self.$shelf) {	// ??
							self.up({level:self.$shelf.data("level")});
						}
					}
				});
			this.defineShelf(this.savedPosition.$shelf);
		}

		// сбрасываем touchTarget в следующем такте
		// так как возможно что пересечений drop более одного
		setTimeout(function () {
			self.touchTarget(null);
		}, 0);
	},

	isReversing: function () {
		return this.$el.hasClass('revert');
	},

	// полностью очищает и отменяет [revert]
	clearRevert: function () {
		this.$el.stop().removeClass('revert');
		this.clearPosition();
	},

	// очищаем сохраненую позицию, [rever] более не актуален
	clearPosition: function () {
		this.savedPosition = null;
		// this.$shelf = null;	// ??
		// this.$fromShelf = null;
	},

	setPosition: function (position)
	{
		// if not presetuped
		if (!this.setup) this.$el.css(position);
	},

	connectTo : function (conntect_to)
	{
		this.$el.appendTo('#' + conntect_to);
		// TODO: posibility disconnect ?
	},

	onDrop: function ($drag) {
		var equip = $drag.data("equip");

		if (!equip) {
			return;
		}

		// если прерывать перетягивание мышки, тогда события не должны срабатывать
		if (equip.ignoreMouse || this.ignoreMouse) {
			return;
		}

		equip.catchedBy = this;
		// console.log('#onDrop', equip.model.id)

		this.onCatch(equip);
	},

	validate: function (equip) {

		// пересечение элементов с элементами которые внутри них не обрабатываем
		if (equip.$el.find(this.$el).length) {
			return false;
		}

		// если объект не тот на который показывает индикатор
		if (equip.touchEquip && equip.touchEquip != this) {
			return false;
	 	}

		// когда среди всех попавших под пересечение есть выбранный элемент
		// это больше не работает, потому как делаем .detach в начале, значит
		if (this.attachedTo == equip || equip.attachedTo == this) {
			// verifystep - если пока таскали, наведением что-то взяли
			// TODO: контролировать это по событию смены реагентов в таскаемом элементе?
			equip.attach({verifystep:true});	// в начале же сделали .detach, .revert - смотрится не красиво
			return false;
		}

		// валидация шагов
		if (!this.validateStep(equip) && !equip.validateStep(this)) {
			equip.revert();
			return false;
		}

		return true;
	},

	validateStep: function (equip) {
		// console.log('#validateStep from ', equip.model.id)

		if (!this.iReact.validateStep(this, {from:equip}) &&
			!this.iReact.validateStep(equip, {attachto:this.model.id})	&& // <condition equip="gastube" attachto="P2"/>
			!this.iReact.validateStep(equip, {from:this}) &&
			!this.iReact.validateStep(this, {attachto:equip.model.id})
		) {
			return false;
		}
		return true;
	},

	// options {validate}
	// - validate: не производить реального действия, а выяснить возможно ли оно
	onCatch: function (equip) {

		if (equip) {
			// валидация
			if (!this.validate(equip)) {
				return false;
			}

			// console.log(equip.model.id, this.model.id)

			// еслvи реакция возможна
			if (equip.isSender && this.isReceiver && this.reagents.length > 0 && this.isReactionPosible(equip)) {
				this.addReagentFrom(equip);
			}
			// если объект можно присоединить напрямую
			else if (equip.attachTo(this, {direct:true})) {
				return true;
			}
			// если переливание
			else if (this.isReceiver && equip.reagents.length) {

				// if (equip.reagents.length == 1) {
					this.addReagentFrom(equip);
				// }
      }
			// если объект можно присоединить косвенно
			else if (equip.attachTo(this)) {
				return true;
			}
			// зажикагие можно производить перенося предмет или на предмет
			else if (equip.hasEffect || this.hasEffect) {
        if (equip.hasEffect) equip.addEffectTo(this);
        if (this.effectMode == 'open') this.addEffectTo(equip);
			}
			// инструмент (ложка, щипцы и др)
			else if (equip.isTool) {
				if (equip.reagents.length && this.isReceiver) {
					this.addReagentFrom(equip);
				} else if (this.reagents.length && this.isSender) {
					equip.addReagentFrom(this);
				}
			}
			// TODO: Wrong using equip: in burner_block dropped stand orange
			else {
				this.warn("Wrong using equip: in " + this.model.get('type') + ' dropped ' + equip.model.get('type'));
			}

			equip.onDroppedIn(this);
		}
	},

	// возможна ли реакция если будет добавлен реагент из equip
	isReactionPosible: function (equip) {
		return this.iReact.findReaction(this.getReagentFrom(equip), this);
	},

	position: function (left, top) { // start left and top
		var left = left || 0,
				top = top || 0,
				$position = this.$el,
				wrapper = this.iReact.$zoomer[0],
				wrapRect = wrapper.getBoundingClientRect(),
				rect = this.$el[0].getBoundingClientRect();

		return {left: (rect.left - wrapRect.left + left) / CourseConfig.zoomScale, top: (rect.top - wrapRect.top + top) / CourseConfig.zoomScale};
	},

	// добавить и применить связь
	attachTo: function (equip, options) {
		if (!options) options = {};

		if (equip) {

			var type = this.model.get('type');

			var settings = equip.allowAttach[type];
			if (settings && typeof(settings) != 'object') settings = {};

			// насильственное поглощение
			// например кабель поглощает переключатель и др
			if (this.attachActivator) {
				return equip.attachTo(this);
			}

			// Если присоеденить напрямую нельзя
			if (!settings) {

				// запрос только на прямое присоединение
				if (options.direct) {
					return false;
				}

				// сначала пытаемся присоединить в древо equip
				for (var s in equip.slots) {
					var slot = equip.slots[s];
					if (options.bubbling == slot) {	// если всплыли из этого слота, его повторно не проверяем
						continue;
					}
					if (this.attachTo(slot, {dive: true})) {	// в глубину dive
						return true;
					}
				}

				// если не вышло - пытаемся присоединить к более высокого уровня оборудования (всплываем)
				if (!options.dive && equip.attachedTo) {
					if (this.attachTo(equip.attachedTo, {bubbling: equip})) {
						return true;
					}
				}

				// проверяем объект к которому присоединен текущий
				// содержит ли он возможность присоединиться

				// проверить, может быть присоединяемый объект содержит слот для текущего
				// TODO: .active ?

				console.warn('trying attach ' + this.model.get('type') + " to " + equip.model.get('type') + " but no allowAttach");
				return false;
			}

			equip.trigger('beforeAttachTo:'+type, this);

			// поиск доступного слота
			// в настройках слоты могут быть заданы через "..,.."
			// слот в настройках перебивает слот оборудования (в бане пробирка может встать только в holder)
			var slot = null, slots = (settings.slotName||this.slotName||'').split(",");
			for (var i=0; i<slots.length; i++) {
				var s = slots[i];
				if (s && !equip.slots[s]) { // "cable1,cable2" если один занят, то другой используется
					slot = s;
					break;
				}
			}

			// если слот занят
			if (!slot) {
				return false;
			}

			// если уже присоединен, то сначала отсоединяем от прежнего владельца
			if (this.attachedTo) {
				this.detach();
			}

			// в какой слот присоединился элемент
			this.attachedToSlot = slot;

			// для контролирование позиций элементов в зависимости от слота, так как есть элементы которые могут быть в разных слотах
			this.$el.attr('slot', slot);
		}

		this.attachedTo = equip;
		this.attach();

		if (equip) {
			// после .attach проверяем сборку
			this.setupTo(equip);
		}

		// после сборки проверяем шаг
		this.iReact.verifyStep();

		// проверка на реакцию, условие в реакции: "какое-то оборудование где-то"
		if (!options.initialize) this.checkReaction(null, {initiator:'equip'});

		return true;
	},

	// применить существующую связь
	attach: function (options)	{
		if (this.attachedTo) {
			this.clearRevert();

			this.defineShelf(null);

			this.$el
				.addClass('attached')
				.removeClass('detaching')
				.css({
					left: '',
					right:'',
					top: '',
					bottom: '',
					zIndex:'',
				})
				.appendTo(this.attachedToSlot && this.attachedTo['$'+this.attachedToSlot] || this.$attachTo || this.attachedTo.$el);	// $attachTo - old support

			this.attachedTo.slots[this.attachedToSlot] = this;

			var type = this.model.get('type');

			this.attachedTo.$el.addClass("attached-" + type);

			this.attachedTo.trigger("equipAttached", this);
			this.attachedTo.trigger("attach:"+type, this);

			// если объект обладает теплопроводностью
			if (this.transcalency) {
				// задаем температуру родительского элемента
				var temperature = this.attachedTo.model.get('temperature');
				if (temperature !== undefined) this.startTemperatureChanging(temperature);
				// отслеживаем смену температуры родительского элемента
				this.listenTo(this.attachedTo.model, 'change:temperature', function (model, temperature) {
					this.startTemperatureChanging(temperature);
				});
			}

			// испольуется в addEffect("mix") добавляем после присоединения назад, что бы реакция шла не на лету
			this.trigger("attached", this.attachedTo);

			// на тот случай если инструмент отсоединился и взял реагент, затем произошел .revert
			if (options && options.verifystep) {
				this.iReact.verifyStep();
			}

		} else {
			this.$el.removeClass('attached');
			this.$attachTo = null; // используется для пробирки которая в $rotate
		}
	},

	// начало отсоединение элемента, когда элемент физически отсоединен
	// но связь еще существует
	detaching: function () {
		if (!this.attachedTo) {
			return false;
		}

		if (this.$parent[0] == this.$el.parent()[0]) {
			return false;
		}

		var position = this.position(),
				left = position.left,
				top = position.top;

		this.$el
			.stop()
			.addClass('detaching')
			.css({
				left: left,
				top: top,
				// zIndex: this.$el.parent().css('zIndex')
			})
			.appendTo(this.$parent);

		// this.up();
		// console.log(this.$el.css('zIndex'))

		delete this.attachedTo.slots[this.attachedToSlot];

		var type = this.model.get('type');

		this.attachedTo.$el.removeClass("attached-" + type);

		this.attachedTo.trigger("equipDetaching", this);
		this.attachedTo.trigger("detaching:"+type, this);

		// если изменена температура, то привести ее в комнатную
		if (this.transcalency) {
			var temperature = this.attachedTo.model.get('temperature');
			if (temperature !== undefined) this.startTemperatureChanging(IReact.roomTemperature);
		}

		// прерываем все отслеживания родетеля (изменение температуры и др)
		this.stopListening(this.attachedTo.model);

		// TODO: переименовать в detaching
		this.trigger("detaching", this.attachedTo);

		return true;

		// this.$el.draggable( 'disable' );	// in setup elemnts not more draggable
	},

	// полностью прервать связь
	detach: function () {
		if (!this.attachedTo) {
			return;
		}

		this.detaching();

		this.$el.removeClass('detaching');

		this.attachedTo.trigger("equipDetached", this);
		this.attachedTo.trigger("detach:"+this.model.get('type'), this);

		this.trigger("detached", this.attachedTo);

		// перестаем отслеживать изменения температурыы
		// if (this.transcalency) {
		// 	this.stopListening(this.attachedTo, 'change:temperature');
		// }

		// очищаем слот (используется в css когда может попасть в более чем один слот)
		this.$el.attr('slot', null);

		// если был в установке, то что бы присоединить кудато нужно вытащить из установки
		this.unSetup();

		this.attachTo(null);

		// this.iReact.verifyStep();
	},

	isDragging: function () {
		return this.$el.hasClass('ui-draggable-dragging');
	},

	unSetup: function () {
		// if (!this.setupedTo) {
		// 	return;
		// }

		// this.attachedTo = this.setupedTo; // tmp fix for work detach, where?

		// this.detach();

		// this.setupedTo.onEquipRemoved(this);

		// у attachto больше нет ссылки на это оборудование
		// if (this.attachedTo) {
			// var type = this.model.get('type');
			// this.attachedTo[type] = null; // ????
		// }

		var setups = this.iReact.model.dataJSON.setups,
				setup = setups[this.setup],
				root = this.attachedTo.findRoot();	// TODO: root сборки, а не всего подряд, если несколько сборок?

		// рассылаем событие о том что сборка разобрана
		for (var name in setup) {
			var equip = root.findInside(name);
			console.log(name, equip)
			if (equip) equip.trigger("setupBroken", this);
		}
		this.trigger("setupBroken", this);

		this.setup = null;	//
		this.setups = [];

		// equip.setup = name;

		// this.checkSetupComplete();
		// if (this.$shelf) this.onDropInShelf(null, this.$shelf); // ????

		this.iReact.verifyStep();
	},

	// если часть установки то добавляем в установку и возвращаем setup
	setupTo: function (equip) {
		var setups = this.iReact.model.dataJSON.setups,
				type = this.model.get('type');

		// console.log(this.model.id, ' setup to ', equip.model.id)
		for (var name in setups) {
			var setup = setups[name];

			if (!setup) continue;

			var item = setup[this.model.id] || setup[this.model.get('type')];	// setups can configure by id or by type

			if (!item) continue;

			var attachto = item.attachto,
					$attachto = $($.find([
						'#'+attachto,						// это скорей всего устарело, раньше id был равен типу
						'[type="'+attachto+'"]'	// ищем по типу
					].join(', '))),
					attachtoEquip = $attachto.data('equip');

			if (!attachtoEquip) {	// если такое оборудование не найдено
				return;
			}

			if (item.attachto == equip.model.id
				|| item.attachto == equip.model.get('type')
				|| attachtoEquip.setup == equip.setup && equip.setup == name	// если то куда должен вставляться элемент, внутри той же сборки что и оборудование
			) {

				// устаревшее, теперь установку проверяем из .attachTo
				// TODO: пока что так, потом в дальнейшем возможны сборки будут с 2 мя одинаковыми типами (2 пробирки ?)
				// if (attachto[type]) return;
				//
				// attachto[type] = this;
				// this.attachTo(attachto);

				// нужно знать название сборки в которой состоит элемент
				this.setup = name;
				equip.setup = name;

				// на тот случай если участвует в нескольких установках
				equip.setups.push(name);
				this.setups.push(name);

				this.defineShelf(null);

				// уже не нужно наверно, так как после каждого .attachTo происходит проверка реакции
				// потому как добавилось условие <condition equip=".." attachto=".."/>
				// this.checkSetupComplete();

				// this.iReact.verifyStep();

				return setup;
			}
		}
	},



	// присоединить оборудование
	// connectEquip: function (equip)	// old
	// {
	// 	return true;
	// },

	onEquipAdded: function (equip) {
		equip.setupedTo = this;
	},

	onEquipedTo: function (equip)
	{

	},

	onEquipRemoved : function (equip) {
		equip.setupedTo = null;
	},

	// проверяем собралась ли установка
	checkSetupComplete: function ()	{
		// var name = this.setup;
		//
		// if (this.iReact.isSetupComplete(name)) {
		// 	console.log('#setup [' +name+ '] complete');
		// 	this.checkReaction(null, {initiator:'setup'});
		// 	return true;
		// }
		// return false;

		// Не можем использовать старую версия безполезна?

		this.iReact.startReactions(this);

	},

	onDropInShelf: function (event, $shelf) {
		// if (this.setupedTo) {	// ????
		// 	return;
		// }

		// уже перехвачено
		if (this.catchedBy) {
			return;
		}
		this.catchedBy = $shelf;
		// console.log('#onDropInShelf', this.model.id, this.dragging)

		if (!this.iReact.validateStep(this, {attachto:'shelf_' + $shelf.data("level")})) {
			return;
		}

		this.defineShelf($shelf);

		if (!$shelf.hasClass('level-0')) {
			this.landToShelf($shelf);
		}
		this.up({level:$shelf.data("level")});

		// у этого оборудования больше нет соранненной позиции потом как оно призимлилось
		this.clearPosition();

		this.trigger("dropInShelf");
	},

	onDroppedIn: function (equipView) {
		// пока что не понятно, промис тут должен быть или в .revert?
		// используется для rod_animate_elesticity
		// this.promise = this.promise.then(function () {
			// плохо. Найти другой способ.
			// в revert есть .stop() который убирает лаги анимации? с задержкой смотрится отвратно.
			// и так вроде заработало) скорей всего потому что анимация палочки хорошо прописана, ну нужен тут промис!
			this.revert();
		// });
	},

	// содержит ли реагент в чистом виде
	isReagent: function (reagent)
	{
		return this.reagents.length == 1 && this.reagents[0].name == reagent;
	},

	// содержит ли элементы
	isEmpty: function () {
		return this.reagents.length == 0;
	},

	sortReagents: function () {
		// сортируем, газ передается первый потом вода и тд.
		this.reagents.sort(function (reagent, reagent2) {
			if (reagent.state == 'gas') return -10;
			if (reagent.state == 'liquid') return -5;
			return 0;
		});
	},

	getReagent: function (options) {
		this.sortReagents();

		if (!options) options = {supportedStates:'all'};

		for (var i=0; i<this.reagents.length; i++) {
			var reagent = this.reagents[i];
			if (options.supportedStates == 'all' || options.supportedStates.indexOf(reagent.state) >= 0) {
				return $.extend({source:this}, reagent, {
					size: Math.min(options.size, reagent.size),
					from: options.from,
				});
			}
		}

		return null;
	},

	findReagentByState: function (state) {
		return _.find(this.reagents, function (reagent) {
			if (reagent.state == state) return reagent;
		});
	},

	findReagentByName: function (name) {
		return _.find(this.reagents, function (reagent) {
			if (reagent.name == name) return reagent;
		});
	},

	checkClosed: function (equip) {
		if (this.isClosed()) {
			if (this.cap) this.wrong(modelNS.lang('cap_closed'), {
				to: this.cap.$el,
				// afterRevert: true,	 // ??? создает проблемы если перетащить стакан на закрытую пробирку
			});
			return true;
		}
	},

	getReagentFrom: function (equip) {
		return equip.getReagent({
				size: Math.min(equip.dose, this.maxSize || this.size, this.maxdose), // Math.min(equip.dose, equip.size) - equip.size это только размер по умолчанию
				from: equip,
				supportedStates: this.supportedStates,	// порядок передачи состояний реагентов
		});
	},

	addReagentFrom:  function (equip, options) {
		if (!options) options = {};

		// временно устанавливаем обородувоние как отдающего
		// очищаем эту устновку в .clear()
		// возможно нужну лучше решение
		// используется для перелива из одной пробирки в другую
		equip.isSender = true;

		var reagent = this.getReagentFrom(equip);

		if (options.validate !== false && !this.iReact.validateStep(this, {reagent:reagent, from:equip})) {
			return;
		}

		// взять ложкой гранулы нельзя, но передать пинцетом в ложку можно
		// TODO: у инструмента должен быть список того что он может брать, и что получить?
		// 		или список того что содержать?
		// проблема определять в этом методе был передан этому оборудованию или был взят этим оборудованием
		// это надо будет в onCatch через опции передавать

		if (!reagent) {
			this.informAboutReagentWrong(equip);
			if (!this.reagents.length) {
				this.warn("ERROR: State '"+state+"' not supported by "+this.model.get('type'));
			}
			return;
		}

		var state = reagent.state;

		if (!options.skipCap) {	// используется в cap_dropper
			if (this.checkClosed(equip) || equip.checkClosed(this)) {
				return;
			}
		}

		// газ может добавлен только в колбы
		// if (state == 'gas' && this.model.get('type') != 'glassware') {
		// 	this.warn("WARNING: Trying add '"+state+"' in "+this.model.get('type'));
		// 	equip.addReagentFrom(this);	// если то что перетаскиваем может срегировать с газом
		// 	return;
		// }

		var contain = this.iReact.reagentsToString(this.reagents), // для verify step
				reaction = this.addReagent(reagent, {from: equip}); // Добавляем реагент, проверяем наличие реакции

		if (!equip.isSender && reaction) {	// TODO: старое, переделать ?? не проверка реакции, а "поделиться" реагентом
			// equip.checkReaction(reaction); // если горящая сера на ложке в банке, то результат остается и в банке
		}

		// if reaction.product тогда реакция анимируется в checkReaction который вызывается в addReagent
		// сейчас анимируется просто наполнение
		// TODO: перенести в checkReaction ? через addReagent({from:..}) ? checkReaction({from:..}) не логично
		// логично что бы анимация чекалась отдельно. Должен ли addReagent содержать animateReaction ?
		// может разделить animateReaction на отрисовку конечного результата, и реакцию?
		// но както не логично каждый раз отрисовку вызывать после addReagent
		// может быть сдесь дополнительную делать анимацию - только для from ?
		// но как тогда быть с анимацией когда оба должны поддерживать, в одном уровень повышается когда из другого выливается
		// может научиться прерывать анимацию?
		// наверно самый верный способ - это прерывать анимацию, но только если существует совместная
		// тут выходит делать проверку на совместную
		// а эту логику переместить в checkReaction ?
		// а вообще тут дулирование из-за createReagent!
		// выходит что createReagent надо что бы вызывался без вызова реакции?
		// должен ли в checkReaction учавствовать createReagent?
		// всетаки первым делом перенести надо?
		// 1. мне не нравится что 2 раза пишется "in tube added .." - исправить это
		// if (reaction) {
		// 	this.animateReaction(reaction, equip);
		// }

		if (reaction) {
			// console.log('#from', equip.model.id, '#to', this.model.id)
			equip.onReagentAddedTo(reagent, this);

			this.iReact.verifyStep({
				from: equip.model.get('id'),
				to: this.model.get('id'),
				reagent: reagent,
				contain: contain,
			});
		}

		return reaction;
	},

	// пока что переопределяется только в кирюшкина (test_tube_gas)
	informAboutReagentWrong: function (equip) {},

	addReagent: function (reagent, options) {
		if (!options) options = {};

		// при необходимости применяем температуру реагента
    if (this.reagents.length == 0 ||
      this.reagents.length == 1 && this.reagents[0].name == reagent.name)
    {
			// если температурный режим включен
			// или если реагент имеет свою температуру
			// тогда выставляем новую температуру - реагента
      if (this.model.get('temperature') || reagent.temperature !== undefined) {
				this.stopTemperatureChanging();
				this.model.set('temperature', reagent.temperature !== undefined ? reagent.temperature : IReact.roomTemperature);

				// если есть родитель, то при необходимости влючаем его влияние на температуру этого элемента
				if (this.attachedTo && this.attachedTo.model.get('temperature')) {
					this.startTemperatureChanging(this.attachedTo.model.get('temperature'));
				}
      }
    }

		// когда тот же самый реагент залит
		// TODO: не только для одного ?? но одного и того же типа не могут быть разыне реагенты на данный момент
		var exist = this.findReagentByName(reagent.name);
		if (exist) {
			exist.increase = reagent.size;
			exist.size += reagent.size;
			// this.reagents = [];	// TODO: проверка на размерность? и если слишком много то не добавлять
			// пока что пропускаем дальше, что бы при необходимости проиграть анимацию увеличения уровня жидкости
		}

		var state = reagent.state,
				reaction = !options.initialize ? this.iReact.findReaction(reagent, this) : null;

		// if (equip != this && !label) {
		// 	label = reagent || equip.model.get("id");
		// }

		// передача реагента через инструмент
		if (this.isTool
			&& this.toolType.indexOf(state)<0
			&& this.repositoryType.indexOf(state)<0
		) {
			this.warn("ERROR: State '"+state+"' not supported by "+this.model.get('type'));
			return;
		}

		// если это не ход реакции
		// и реакция не найдена, тогда выдаем ошибку
		if (!options.reaction && !reaction && this.reagents.length > 0) {
			// и если это не доливание реагента
			// (бывает что реагент не образует ни одной реакции, но налиться в пробирку сам по себе может)
			if (this.reagents.length > 1 || this.reagents[0].name != reagent.name) {
				console.log("Попытка создать неизвестную реакцию с " + reagent.name, this.reagents);
				console.log('#', reagent, this)
				this.wrong(modelNS.lang("undefined_reaction"));
				return;
			}
		}

		if (options.initialize) {
			if (!reagent.size) reagent.size = this.model.get('size') || this.size; // ??
		}

		if (!exist) {
			this.reagents.push(reagent);
		}

		this.$el.attr({
			"reagent": this.reagents.length == 1 ? reagent.name : "", 	// проще находить через selector // TODO: multiple?
			"state": reagent.state,	// разные состояния разный стиль (тигельные щипцы приоткрыты когда кристал)
		});

		// перемешивание очищаем
    this.effects = [];

		// старое
		this.$el.addClass('full');

		// регистрирация или анимация реагента в equip
		if (options.initialize) {
			if (this.animation) {
				this.animation.initReagent(reagent, $.extend(options, {full: this.howMuchFull(reagent)}));
			}
		} else {
			// тригер срабатывает до того как может произойти реакция и образуется новый продукт
			this.trigger("reagentAdded", reagent);

			// если реагент добавлен в ходе реакции
			if (options.reaction) {
				this.animateAddReagent(exist || reagent, $.extend({zoomable:"finish"}, options));
			} else {
				var reaction = this.iReact.findReactionReadyToStart(this, {reaction: reaction});

				// если реакция найдена
				if (reaction) {
					// сначала добавляем реагент
					this.animateAddReagent(exist || reagent, $.extend({zoomable:"start", color: null}, options));
					// потом анимируем реакцию
					// через promise что бы смог просчитаться отображение добавление реагента с еще не изменненным списком реагентов
					// и более логично запускать реакцию в тайминге после того как отображение добавления реагента будет завершено?
					this.promise = this.promise.then(function () {
						reaction.reactor.startReaction(reaction, {promised: true});
					});
				} else {
					// если добавление реагента не вызвало реакцию
					this.animateAddReagent(exist || reagent, options);
				}
			}
		}

		return true;	// реагент добавлен успешно
	},

	// визуальное отображение как добавляется продукт
	// льется из емкости, пополняется уровень
	// для этого анимации должны существовать
	animateAddReagent: function (reagent, options) {

		var self = this;

		options = $.extend({
			full: this.howMuchFull(reagent),
			reagent: reagent,
			reagents: this.reagents,
			maxSize: this.maxSize,
		}, options);

		if (options.zoomable != "finish" && options.zoomable !== false) {
			this.animationStart(options.reaction, options);
		}

		// трансформируем жидкий реагент
		// if (reagent.state == 'liquid') {
			// options.transform = 'liquid';
			// var liquid = this.findReagentByState('liquid');
			// if (liquid && liquid != reagent) {
			// 	this.animation.transformReagent(liquid, {transform: 'liquiq'});
				// options = $.extend(options, {
				// 	full: Math.min(this.getReagentsSize({state: 'liquid'})/this.maxSize, 1)
				// });
			// 	console.log('#transform', liquid.name, this.animation.reagents)
		// 	}
		// }

		var receiverPromise = this.animation && this.promise.then(function () { // у некоторых нет .animation например фильтровальная бумага
					return self.animation.receiveReagent(reagent, options);
				}),
				senderPromise = options.from && this.promise.then(function () {
					// return options.from.promise;	// чего-то долго как-то задерживает зум из пробирки в пробирку перелив, нет времени разбираться поэтому пока что отключим
				});

		this.promise = $.when(receiverPromise, senderPromise);

		// не для цепных реакций
		if (!options.reaction && options.zoomable != "start") {
			this.animationFinish();
		}

		// используется в solution, пока идет отображение, не переходим на следующий шаг
		this.iReact.promise = this.promise;
	},

	animateRemoveReagent: function (reagent, options) {
		if (this.animation) {
			var self = this,
					options = $.extend({full: this.howMuchFull(reagent)}, options);
			return this.iReact.zoomPromise().then(function () { // после зума
				return self.animation.sendReagent(reagent, options);
			});
		}
	},

	// используется для демонстрации анимации
	// подготовка увеличения и уменьшения зума
	// TODO: ??
	// animateReaction: function () {
	// },

	// старт реакции или цепочки реакций
	// TODO: что если только некоторые реакции имеет зум в цепочке?
	animationStart: function (reaction, options) {
		var zoomable = reaction && reaction.zoomable !== null ? reaction.zoomable : this.hasZoomWhenReagentAdd,
				zoomEquip = options && options.zoomEquip,
				self = this;

		if (zoomable) {
				this.promise = this.promise
				.then(function () {
					// для того что бы когда в бане что-то происходит, то баня становилась прозрачной
					self.$el.parents('.equip').attr('action', 'animation');
				})
				.then(function () {
						return self.iReact.zoomIn(zoomEquip || self);
				});

			this.iReact.promise = this.promise;
		}
	},

	// финиш реакции или цепочки реакций
	animationFinish: function () {
		var self = this;

		this.promise = this.promise
			.then(function () {
				if (self.iReact.zoomEquip) {
					// return $({}).delay(400).promise();	// минимальное время для демонстрации
						// если реакция без видимых изменений, тогда эта задержка лишняя, например 2 порошка = новый порошок
				}
			}).then(function () {
				return self.iReact.zoomOut();
			}).then(function () {
				// завершение индикатора анимации (для родителей только?)
				self.$el.parents('.equip').attr('action', '');
			});

		this.iReact.promise = this.promise;
	},



	howMuchFull: function (reagent) {
		// console.log(this.getReagentsSize({state: reagent.state}),reagent.state ,this.maxSize);
		// return Math.min(this.getReagentsSize({state: reagent.state})/this.maxSize, 1);
		return Math.min(reagent.size/this.maxSize, 1);
	},

	checkAngle: function (angle) {
		 return (this.angle > angle - 5) && (this.angle < angle + 5);
	},

	getReagentsSize: function (options) {
		if (!options) options = {};

    var size = 0;
    for (var i=0; i<this.reagents.length; i++) {
			var reagent = this.reagents[i];
				if (options.state == reagent.state) {
					size += reagent.size;
				}
				// пока что мы это не складываем, так как нужны еще обработчики когда порошок добавлен, что бы уровень поднимался жидкости, а их нет
				// поэтому только жидкость складываем
				// if (options.state == "liquid" && reagent.state == "powder") {
				// 	size += reagent.size*0.75;	// уровень жидкости зависит от порошка, но уменьшается, входит в поры порошка
				// }
    }

    return size; // Math.max(this.minSize, size); ??? для капель воды плохо, там уже не 6
  },

  checkReaction: function (reaction, options) {
    // this.lastReaction = reaction;	// old ??

		return this.iReact.checkReaction(reaction, this, options);
  },

	// запуск реакции
  startReaction: function (reaction, options) {
		if (!options) options = {};

		var self = this;

		if (!options.promised && reaction.find_warn) {
			return;
		}

		console.log('--> reaction #' + reaction.id + ' at #' + this.model.id);
		// if (reaction.id == 'c52') debugger;

		// в теории надо для запуска эффектов присоединенных к <reaction/>
		// this.animateReaction(reaction);

		// проверяем шаг до того как создастся продукт
		// что бы могли провериться условие на содержимое до реакции если они есть
		this.iReact.verifyStep({reaction: reaction.get('id')});

		if (reaction.get('products').length) {
			// если реакция запустилась после того как собралась установка
			// запускаем начало реакции, так как обычно запуск происходит с момента добавления реагента
			if (options.initiator) {
				this.animationStart(reaction);
			}

			// продукты реакции
			var reactionProducts = reaction.createProducts(this.reagents);

			this.removeReagents(reactionProducts.removeReagents, {reaction:reaction, productsStates:reactionProducts.productsStates});

			// продукты которые не изменились
			this.reagents = reactionProducts.reagents;

			// console.log('reaction addReagents #' + reaction.get('id'));

			this.addReagents(reactionProducts.newReagents, $.extend({reaction:reaction}, options));

			// console.log('reaction complete #' + reaction.get('id'));

			this.reactionResult(reaction);

			// после того как создан новый реагент, и анимация закончилась - проверяем еще раз на возможную реакцию
			this.promise = this.promise.then(function () {
				if (!self.checkReaction()) {
					self.animationFinish();
				}
				// не уверен что так правильно, но а иначе возвращать промис с checkReaction - не логично
				// return this.promise; 	// ??
			});

			// this.addReagent($.extend(reagent, {size:size}), options);
			// this.effects = [];

		} else {
			// если в итоговых продуктах пусто, тогда это реакция заглушка без секции <products/>
			// просто производим увеличение
			this.animationStart(reaction);
			this.reactionResult(reaction);
			this.animationFinish();
		}

		this.trigger("reactioncomplete");

		return true;
  },

	findRoot: function () {
		var parents = this.$el.parents('.equip'),
				root = parents.length ? $(parents.last()).data('equip') : this;
		return root;
	},

	// ищем так же внешние элементы по id
	// TODO: переименовать метод
	findInside: function (id) {
		return this.model.id == id ? this : this.iReact.$el.find('#'+this.model.id+' [type='+id+'], #' + id).data('equip');
	},

	// применить изменения вызыванные реакцией к элементам сцены
	reactionResult: function (reaction) {
		var root = this.findRoot();

		for (var id in reaction.result) {
			var result = reaction.result[id],
					equip = root.findInside(id);
			if (equip) {
				this.promise.then(function () {
					equip.model.set(result);
				});
			}
		}
	},

	// TODO: пока что временное решение, новые реагенты только 1
	addReagents: function (reagents, options) {
		if (reagents.length) {
			for (var i=0; i<reagents.length; i++) {
				if (reagents.length > 1) {
					var zoomable = false;
					if (i == 0) {
						zoomable = 'start';
					} else if (i == reagents.length - 1) {
						zoomable = 'finish';
					}
					options = $.extend({zoomable:zoomable}, options);
				}
				this.addReagent(reagents[i], options);
			}
		}
	},

	removeReagents: function (reagents, options) {
		if (!options) options = {};

		// после реакции реагенты задаются сразу, поэтому проверки на реакцию не происходит
		// только визуальное удаление
		// функциональное происходит от трубки с газом

		for (var i=0; i<reagents.length; i++) {
			this.removeReagent(reagents[i], options);
		}
	},

	removeReagent: function (reagent, options) {
		if (!options) options = {};

		var name = reagent.name || reagent; // когда на входе просто имя реагента

		var productsStates = options.productsStates || "",
				self = this;

		// console.log('# удаляем реагент', name)

		// возможно эту логику перенести в animation.removeReagents?
		for (var i=0; i<this.reagents.length; i++) {
			reagent = this.reagents[i];

			// возможно реагент не удалился а лишь трансформировался в другой того же типа
			// на данный момент актуально только для жидкости
			// TODO: ввести поддержку одного типа нескольких реагентов в емкости (пока что проблема только с жидкостью?)
			// но уровень жидкости всеравно по принципу трансформации должен работать
			// нужно для удаления добавленных к реагенту эффектов

			if (this.reagents[i].name == name) {
				var transform = productsStates.indexOf(reagent.state) >= 0;

				this.reagents.splice(i, 1);
				i--;

				// визуальное
				// if (reagent.state == 'chips' || reagent.state == 'powder') {
					// TODO: фильтр по reagent.id создавать при addReagent
					// очищаем старые реагенты визуально, используется для chips
					// пока что прям в этой функции, пока не придумал где лучше расположить

				// TODO: отрисовывать после того как объявятся реагенты
				this.promise = this.promise.then(function () {
						if (!transform) {
							return self.animation && self.animation.removeReagent(reagent, {reagents: self.reagents});
						}
				});

				// } else {
				// 	this.$el.find('.reagent[reagent="'+reagent.name+'"]').remove();
				// }

				break;
			}
		}

		this.trigger("reagentRemoved", reagent);

		// проверяем реакцию, если это не ход реакции
		// сейчас используется при вынимании газовой трубки
		if (!options.reaction) {
			this.checkReaction();
		}
	},

	isClosed: function ()
	{
		return this.model.get('status') == "closed"
			|| this.status == "closed"; // old support ?
	},

	warn: function (msg) {
		this.iReact.log(msg, 'orange');
	},

	savePosition: function (position, $shelf) {
		this.savedPosition = {left: position.left, top: position.top, $shelf: $shelf, attachedTo: this.attachedTo};

		// изначальная позиция объекта
		if (!this.initPosition) {
			this.initPosition = this.savedPosition;
		}
	},

	up: function (options) {
		var baseIndex = 4000;
		if (options) {
			if (options === true) options = {level: this.$shelf && this.$shelf.data('level')};	// автоматически up на полке .up(true)
			// нижние полки должны иметь выше zIndex
			baseIndex -= (options.level+1)*1000 - this.zIndexInShelf;
		}
		this.$el.css('z-index', baseIndex + this.iReact.zIndex++);
	},

	discharge: function () {
		// если содержимое не очищаемое
		if (this.model.get('disable') == 'inside') {
			return this.revert();
		}

		if (this.isClosed()) {
			this.once("reverted", function () {
				if (this.cap) this.cap.wrong(modelNS.lang("cap_closed"));
			}, this);
		} else if (this.reagents.length && (this.isReceiver || this.isTool)) {
			this.clear();
			if (this.animation) this.animation.discharge(this.iReact.$discharge);
			this.$el.removeClass('discharging');	// some times its added before animation
		}
		// если очищаем палочку в стакане, то она возвращается на полку
		if (this.isTool) {
			if (!this.initPosition.attachedTo) {
				this.detach();
				this.savedPosition = this.initPosition;
			}
		}
		this.revert();
	},

	isDischarging: function () {
		return this.$el.hasClass('discharging');
	},

	clear: function () {
		// this.$el.find('.label').html("");	// ?? если пронумерованую пробирку очищать - проблема

		// if (this.animation) {
			// this.animation.clearReagents();
		// }
		this.removeReagents(this.reagents);

		// this.isSender = false; // мешает для restoreStep,
		this.$el.removeClass('full')
			.attr({
				'reagent': null,
				'state': null,
			});
		// TODO: только для discharge, а для clear мб сделать в анимации метод clear. Discharge - это именно раковина, а clear - где угодно
		if (this.animation) {
			this.animation.clear();
		}
		this.iReact.log(this.model.get('type') + " cleared");
	},

	setStatus: function (status) {
		this.model.set({status:status});
		this.iReact.verifyStep();
	},

	onReagentAddedTo: function (reagent, equip) {
		var sourceReagent = this.findReagentByName(reagent.name),
				self = this;
		if (sourceReagent.size == reagent.size) {
			$.when().then(function () {
				 // отображания анимации удаления жидкого реагента (исходный в размере не меняем)
				return self.animateRemoveReagent($.extend({}, reagent, {size:0}));
			}).then(function () {
				self.removeReagent(reagent);
			});
		} else if (sourceReagent.size != Infinity) {
				sourceReagent.size -= reagent.size;
				this.animateRemoveReagent(sourceReagent);
				// this.animateAddReagent(reagent);	// это должно автоматически вызываться в качестве source.animation.sendReagent
		}
		// equip.clear();
	},

	closeTooltip: function ()
	{
		this.iReact.closeTooltip(this.$el);
	},

	disableTooltip: function () {
		this.$el.find(':ui-tooltip').tooltip('disable');
		if (this.$el.is(':ui-tooltip')) this.$el.tooltip('disable');
	},

	enableTooltip: function () {
		this.$el.find(':ui-tooltip').tooltip('enable');
		if (this.$el.is(':ui-tooltip')) this.$el.tooltip('enable');
	},

	tooltip: function (tooltip, options)
	{
		this.iReact.tooltip(this.$el, tooltip, options);
	},

	inform: function (title, options)
	{
		if (this.isReversing()) {
			this.once("reverted", function () {
				this.iReact.inform(this.$el, title, options);
			}, this);
		} else {
				this.iReact.inform(this.$el, title, options);
		}
	},

	wrong: function (title, options) {
		if (!options) options = {};

		if (this.isReversing() || this.isDragging() || options.afterRevert) {
			this.once("reverted", function () {
				this.iReact.wrong(options.to || this.$el, title, options);
			}, this);
		} else {
				this.iReact.wrong(options.to || this.$el, title, options);
		}
	},

	disable: function (model, key)
	{
		if (key) {
			this.trigger("disable:"+key);
		} else {
			this.trigger("disable");	// ?? не используется
		}
	},

	// визуально выделить объект на экране
	active: function (is) {
		if (this.activeClass) {
			if (is || is === undefined) {
				this.$el.addClass(this.activeClass);
			} else {
				this.$el.removeClass(this.activeClass);
			}
		}
	},

	// прекратить визуально выделять объект
	// deactive: function () {
	//
	// },

	// добавляет индиктор невозможного действия
	unposible: function (is) {
		if (is || is === undefined) {
			this.$el.addClass('unposible');
		} else {
			this.$el.removeClass('unposible');
		}
	},

	// прерываем изменение температуры
	stopTemperatureChanging: function ()
	{
		// прерываем предыдущую назначенную температуру
		if (this.temperatureID) {
			cancelAnimationFrame(this.temperatureID);
			this.temperatureID = null;
			this.temperatureAt = null;
			this.temperature = null;
		}
	},

	// изменение температуры согласно теплопроводимости
	startTemperatureChanging: function (temperature)
	{
		this.stopTemperatureChanging();

		// this.listenTo(this.iReact, "timer", function () {
		// 	this.temperatureUpByTime(time, temperature);
		// });

		// TODO: привязать к iReact.timer
    var self = this,
        frame = function (time) {
          if (self.temperatureUpByTime(time, temperature)) {
						self.temperatureID = requestAnimationFrame(frame);
					}
        };

    requestAnimationFrame(frame);
	},

	// по упрощенному варианту без учета теплоемкости
	// скорость прямо пропорциональна разнице температур
	temperatureSpeed: function (temperature, fromC)
	{
		var transcalency = this.reagents.length ? this.transcalencyReagent : this.transcalency;
		return (temperature-fromC) * (transcalency / 1000 / 15); // 15 - коррекция на нагревание по времени
	},

	temperatureUpByTime: function (time, temperature)
  {
		var time = this.iReact.timer;
    if (!this.temperatureAt) this.temperatureAt = time;

		var modelC = this.model.get('temperature'),
				fromC = this.temperature || modelC || IReact.roomTemperature,
        speedC = this.temperatureSpeed(temperature, fromC),
        toC = fromC + (time - this.temperatureAt) * speedC,
				roundC = Math.roundDec(toC, 1);

		this.temperature = toC;

		// дозволенные рамки температуры
		if (speedC > 0) {
			if (roundC >= temperature) {
				roundC = temperature;
			}
		} else {
			if (roundC <= temperature) {
				roundC = temperature;
			}
		}

		// в целях оптимизации, вызываем изменения только на целые градусы
		if (roundC != modelC) {
			this.model.set({temperature: roundC});
		}

		if (roundC == temperature) {
			return this.stopTemperatureChanging();
		}

		this.temperatureAt = time;

		return true;
  },

	// информация о наклоне оборудования, угол и центральная позиция
	getRotation: function () {
		if (this.attachedTo) {
			return this.attachedTo.getRotation();
		} else {
			return {};
		}
	},

	// угол наклона, при необходимости переопрелить
	setAngle: function () {},

	// svg если фоном то не скалятся в ие
	// а фоном надо что бы менять через css (РЭШ)
	fixSVG: function () {
    // fon
    var src = this.$el.css('background-image').replace(/url\(\"(.*)\"\)/gi, '$1');
    if (src.indexOf('.svg') > 0) {
      $('<img/>').attr('src', src).appendTo(this.$el);
      this.$el.css('background', 'none');
    }
  },

	// должен переопределиться оборудованием
	// если для визуализации ответа изменения состояния
	// нужны дополнительные действия
	showStatusSolution: function (options) {
		this.model.set({status: options.status});
  },

	// если у оборудования есть подсказка в использовании, она вызовется когда будет затронут шаг
	hint: function () {},

	//
	progress: function (value, options) {
		if (!this.progresses) this.progresses = {};

		var name = options.name,
				progress = this.progresses[name];

		if (value === null) {
			if (progress) {
				progress.remove();
				delete this.progresses[name];
			}
		} else {
			if (!this.progresses[name]) {
				this.progresses[name] = new modelNS.ProgressCircle($.extend({
		      parent: this.$el,
					color:"rgb(91,202,229)",
	        radius:8,
	        lineWidth:3
		    }, options)).render();
				this.progresses[name].$el.addClass('progress-' + name);
			}
			this.progresses[name].progress(value);
		}

		return this.progresses[name];
	},

});

IReact.equips = {};

// TODO: ie fix

function IReact(xmlData, wrapper, basePath, params) {

	var model;

	this.init = function() {

		model = new modelNS.IReact({
			xmlData: xmlData,
			wrapper: wrapper,
			basePath: basePath,
			// scalable: false,
			restyling: true,
			width: wrapper.data('width')||null,
			height: wrapper.data('height')||null,
			params:params
		});
		return new modelNS.IReactView({model: model}).renderOnShow();
	};
}

modelNS.addLangs({
	ru: {
		cap_closed: 'Сначала откройте крышку',
		close_cap: 'Закройте крышку',
		can_rotate: 'Тяните чтобы вращать',
		mixed: 'Перемешано',
		smolder: 'Тлеет',
		grind: 'Перемолототь',
		mix: 'Перемешать',
		undefined_reaction: 'Cценарий не предусмотрен',
		mix_click: 'Щелкнуть чтобы перемешать',
		use_pipette: 'Используйте пипетку',
		make_current_step: 'Необходимо выполнить текущий этап работы',
		already_completed: 'Этот этап уже выполнен',
		success_completed: 'Вы успешно выполнили работу',
		timer_but_start: 'Старт/Стоп',
		timer_but_speedup: 'Ускорять',
		timer_but_clear: 'Сброс',
		heatedevenly: 'Разогрето',
		extinguish: 'Кликните чтобы потушить',
		open_click: 'Кликните чтобы открыть',
		close_click: 'Кликните чтобы закрыть',
		wrong_step: 'Шаг выполнен неверно, попробуйте еще раз',
	}
});

modelNS.IReact = modelNS.BaseModel.extend({
	// defaults: $.extend({}, modelNS.BaseModel.prototype.defaults, {}),
	// initialize: function(options) {
	// 	modelNS.BaseModel.prototype.initialize.apply(this, [options]);
	// 	this.options = options;
	// },
	parseXML: function(xmlData) {
		modelNS.BaseModel.prototype.parseXML.apply(this, arguments);

		var self = this,
		    $xml = $(typeof(xmlData) == 'string' ? $.parseXML(xmlData) : xmlData),
				$root = $xml.find('experiment'),
				xmlHeigh = $root.attr('height')*1||0,
				xmlWidth = $root.attr('width')*1||0,
				$steps = $xml.find('step'),
				$reagents = $xml.find('experiment>reagents>reagent, experiment>products>product'),
				$reactionsProducts = $xml.find('reactions product'),
				$equipment = $xml.find('experiment>equipment>equip_item, experiment>equipment>equip'),
				$reactions = $xml.find('reactions>reaction'),
				$setups = $xml.find('setups>setup'),
				strict = $xml.find('steps').attr('strict'),	// действия на сцене возможно только по шагам
				reagents = {},
				setups = {},
				steps = [],
				rotable = false;

		// Реагенты и продукты реакций
		this.parseReagents($reagents);

		// Незарегистрированные продукты в реакциях
		this.parseReagents($reactionsProducts);  // ??

		// Обородование
		this.parseEquipments($equipment);

		// Шаги
		// после оборудования (проверка attachto)
		this.parseSteps($steps);

		// Установки
		// после оборудования (проверка на существование)
		this.parseSetups($setups);

		// Реакции
		// после установок (проверка на существование)
		this.parseReactions($reactions);

		return $.extend(self.defaults, {
			width: self.width,
			height: self.height,
			equipment: this.equipment,
			reagents: self.reagents,
			setups: self.setups,
			steps: this.steps,
			rotable: rotable,
			strict: strict
		})
	},

	parseSteps: function ($steps) {
		var steps = [],
				self = this;

		$steps.each(function () {
			var $this = $(this),
					conditions = self.parseConditions($this.find('>condition')),
					caption = courseML.getHTMLFromCourseML($this.find('caption')),
					conditiongroups = [];

			var index = 0;
			$this.find('conditiongroup').each(function (i) {
				conditions = self.parseConditions($(this).find('condition'), index);
				conditiongroups.push(conditions);
				index = conditions[conditions.length-1].index+1;
			});

			if (!conditions.length) {
				alert('В шаге "'+caption+'" отсутствует <condition../>');
				return;
			}

			steps.push({
				caption: caption,
				conditiongroups: conditiongroups,
				conditions: conditions,
				count: conditions[conditions.length-1].index+1,
			});
		});

		this.steps = steps;
	},

	parseConditions: function ($conditions, index) {
		var self = this,
				conditions = [],
				index = index || 0;

		$conditions.each(function () {
			var $condition = $(this),
					wait = $condition.attr('wait'),
					condition = {
						reagent: $condition.attr('reagent'),
						from: $condition.attr('from'),
						equip: $condition.attr('equip'),
						type: $condition.attr('type'),
						contain: $condition.attr('contain'),
						attachto: $condition.attr('attachto'),
						setup: $condition.attr('setup'),  // уст.
						status: $condition.attr('status') || $condition.attr('state'),	// state - old support
						reaction: $condition.attr('reaction'),	// уст. возможно в будущем реализовать поддержку, основная проблема в демонстрации ответа
						wait: wait ? parseInt(wait) : null,
						angle: $condition.attr('angle'),
						degree: $condition.attr('degree'),
						zoom: $condition.attr('zoom'),
						size: $condition.attr('size'),
						empty: $condition.attr('empty'),
						action: $condition.attr('action'),	// mix
						effect: $condition.attr('action'),	// old support
						discharge: $condition.attr('discharge'),
						index: index++,
					};

			conditions.push(condition);

			// TODO:
			// if ($condition.attr('angle')) rotable = true;	// используется для сборок где не надо вращать стенд, тогда мы отключаем вращение и подсказку

			self.warnUndefinedEquip({id: condition.equip});
			self.warnUndefinedEquip({id: condition.attachto});
		});

		return conditions;
	},

	parseEquipments: function ($equipment) {

		var	equipment = [],
				equipmentIds = ['shelf_0', 'shelf_1', 'shelf_2'], // зарезервированные id
				equipmentType = {};

		$equipment.each(function () {
			var $this = $(this),
					$label = $this.find('label'),
					label =  courseML.getHTMLFromCourseML($label),
					// labelAttached = $label.attr('attached') != 'false',
					reagent = $this.attr('reagent'),
					type = $this.attr('type'),
					subtype = $this.attr('subtype'),
					id = $this.attr('id');

			if (!label) label = $this.attr("label");

			// auto equipment id
			if (!id) {
				id = type;
				var i=1;
				while (equipmentIds.indexOf(id)!=-1) {
					id = type + ++i;
				}
			}
			equipmentIds.push(id);


			equipment.push({
				id: id,
				type: type,
				subtype: subtype,	// уст.
				reagent: reagent,
				shelf: $this.attr('shelf'),
				align: $this.attr('align'),
				left: $this.attr('left'),
				right: $this.attr('right'),
				top: $this.attr('top'),
				bottom: $this.attr('bottom'),
				connected_to: $this.attr('connected_to'),	// уст.
				closable: $this.attr('closable'),	// уст.
				closed: $this.attr('closed'), 	// уст.
				stand: $this.attr('stand'), 	// уст.
				position: $this.attr('position'),	// используется у пробирок, что бы указать слот в полке
				title: $this.attr('title'),
				degree: parseInt($this.attr('degree')),	// ?? градусник
				status: $this.attr('status') || $this.attr('state'), // state - old support
				label: label, // labelAttached ? label : '', 	// уст.
				setupto: $this.attr('setupto'), // уст.
				attachto: $this.attr('attachto'),	// улучшенный метод присоединения, все остальное устаревшее
				color: $this.attr('color'),
				size: parseFloat($this.attr('size')),	// количество reagent
				dose: parseFloat($this.attr('dose')),
				maxdose: parseFloat($this.attr('maxdose')),
				angle: parseInt($this.attr('angle') || 0), // используется у stand угол наклона
			});

			// используется для проверки в блоке установок
			equipmentType[type] = true;

			// if (!labelAttached) {
			// 	equipment.push({
			// 		type : 'label',
			// 		html : label,
			// 		for : reagent
			// 	});
			// }
		});

		// auto equipment id
		// если не установлен id и тип или подтип (утаревшее?) уникален, то id=тип
		// for (var i=0; i<equipment.length; i++) {
		// 	var eq = equipment[i];
		// 	if (!eq.id && equipmentIds.indexOf(eq.type)<0) {
		// 		eq.id = eq.type;
		// 	}
		// }

		this.equipment = equipment;
		this.equipmentType = equipmentType;
		this.equipmentIds = equipmentIds;
	},

	parseReactions: function ($reactions) {
		var setups = this.setups,
				reactions = [];

		$reactions.each(function () {
			var $this = $(this),
					$reagents = $this.find('reagents>reagent'),
					$conditions = $this.find('condition'),
					setup = $this.find('setup_complete').attr('id'),
					$item_activated = $this.find('item_activated'),
					$cap_closed = $this.find('cap_closed'),
					$item_angle = $this.find('item_angle'),
					$result = $this.find('results>equip, result>equip'),	// поддерживаем и <result> и <results>
					reagents = new IReact.ReactionReagentCollection(),
					products = [],
					conditions = [],
					item_angle = {},
					result = {},
					item_activated = [],
					cap_closed = [],
					zoomable = $this.attr('zoomable'),	// по умаолчанию зум полностью зависит от animating
					plaque = $this.attr('plaque'),
					time = $this.attr('time');

			$reagents.each(function () {
				reagents.add({
					name: $(this).attr('id') || $(this).attr('name'),	// name - old support
					size: $(this).attr('size'),
				});
			});

			$conditions.each(function () {
				conditions.push({
					action: $(this).attr('action') || $(this).attr('type'), // type - old support
					equip: $(this).attr('equip'),
					attachto: $(this).attr('attachto'),
					status: $(this).attr('status'),
					wait: $(this).attr('wait'),
				});
			});

			$item_activated.each(function () {
				item_activated.push($(this).attr('id'));
			});

			$cap_closed.each(function () {
				cap_closed.push($(this).attr('id'));
			});

			$item_angle.each(function () {
				item_angle[$(this).attr('id')] = $(this).attr('angle');
			});

			// TODO: если несколько key=>value
			$result.each(function () {
				var attributes = {},
						value = $result.attr('value'),
						key = $result.attr('key') || $result.attr('name'), // name или key
						status = $result.attr('status'),
						id = $result.attr('id') || 'self';
				if (key) attributes[key] = value;
				if (status) attributes.status = status;
				result[id] = attributes;
			});

			$this.find('product, products>reagent').each(function () {
				products.push({
					name: this.getAttribute('id') || this.getAttribute('name'), // this.id - не работает в ie
					size: this.getAttribute('size'),
				});
			});

			// Проверка на корректность названия установки в условии реакции
			if (setup && !setups[setup]) {
				alert('WARRING! Неизвестная установка в условии реакции: ' + setup);
			}

			reactions.push({
				id: $this.attr('id'),
				zoomable: zoomable == 'true' || (zoomable == 'false' ? false : null),
				reagents: reagents,
				conditions: conditions,
				item_activated: item_activated,
				cap_closed: cap_closed,
				item_angle: item_angle,
				setup: setup,
				result: result,
				products: products,
				plaque: plaque,
				time: time
			});

		});

		this.reactions = reactions;
	},

	parseSetups: function ($setups) {
		var setups = {},
				self = this;

		$setups.each(function () {
			var $this = $(this),
					setup = {},
					name = $this.attr('id');

			$this.find('equip').each(function () {
				var $equip = $(this),
						id = $equip.attr('id')||$equip.attr('type'),
						attachto = $equip.attr('attachto');

				setup[id] = {
					attachto: attachto,
				};

				self.warnUndefinedEquip({type: id});
				self.warnUndefinedEquip({type: attachto});
			});

			setups[name] = setup;
		});

		this.setups = setups;
	},

	warnUndefinedEquip: function (equip) {
		var equipmentType = this.equipmentType,
				equipmentIds = this.equipmentIds;

		// проверка на неверный xml
		// когда в сборке используется не существующее оборудование
		if (equip.type !== undefined && !equipmentType[equip.type]) {
			alert('WARRNING! Неизветсное оборудование type='+equip.type);
		}

		if (equip.id !== undefined && equipmentIds.indexOf(equip.id) < 0) {
			var equipId = equip.id.split('-')[0]; // "-" системный символ, используется для автоматического оборудования (dropper)
			if (equipmentIds.indexOf(equipId) < 0) {
				alert('WARRNING! Неизветсное оборудование id='+equip.id);
			}
		}
	},

	parseReagents: function ($reagents) {
		var reagents = this.reagents || [];

		$reagents.each(function () {
			var $this = $(this),
					name = $this.attr('id'),
					color = $this.attr('color'),
					type = $this.attr('type') || "",	// ??
					indicator = $this.attr('indicator'),
					$label = $this.find('label'),	// уст.
					attached = $label.attr('attached') != 'false', // уст.
					label = courseML.getHTMLFromCourseML($label),
					temperature = $this.attr('temperature') || $this.attr('temp'),
					state = $this.attr('state') || 'liquid',
					gasup = $this.attr('gasup'),
					minigasup = $this.attr('minigasup'),
					gasupslow = $this.attr('gasupslow'),
					sludge = $this.attr('sludge'),
					blur = $this.attr('blur'),
					foam = $this.attr('foam'),
					burn = $this.attr('burn'),
					fume = $this.attr('fume'),
					oil_film = $this.attr('oil_film'),
					faraon = $this.attr('faraon'),
					clap = $this.attr('clap'),
					elasticity = $this.attr('elasticity') || null;

			if (state == 'liquid' && !color) color = 'rgba(91,202,229,0.5)';

			// используем волокна как проволоку
			// if (state == 'wirew') state = 'fiber';
			// if (state == 'granules') state = 'balls';

			if (name && !reagents[name]) reagents[name] = {
				color: color,
				name: name,
				state: state,
				label: attached ? label : '',
				color: color,
				type: type,
				indicator: indicator,
				elasticity: elasticity ? parseInt(elasticity) : elasticity,
				burn: burn,
				gasup: gasup ? {color: gasup} : null,
				minigasup: minigasup ? {color: minigasup} : null,
				gasupslow: gasupslow ? {color: gasupslow} : null,
				blur: blur ? {color: blur} : null,
				foam: foam ? {color: foam} : null,
				sludge: sludge ? {color: sludge} : null,
				fume: fume ? {color: fume} : null,
				oil_film: oil_film ? {color: oil_film} : null,
				faraon: faraon ? {} : null,
				clap: clap ? {} : null,
			};

			if (temperature) reagents[name].temperature = parseInt(temperature);	 // "0" => 0
		});

		this.reagents = reagents;
	}
});

// animation libs
modelNS.IReact.libs = {};

modelNS.IReactView = modelNS.BaseModelView.extend({

	zIndex: 10,
	zoomTime: 7,

	events: {
		'click .step' : 'stepClick',
	},

	equips : {
		stand : ["burner", "glassware"]
	},

	initialize: function(options) {
		// this.developing = true;

		// время начала работы с эксперементом
		this.timer = 0;

		// Скорость времени
		this.timeSpeed = 1;

		this.startTimer();

		this.logging = true;

		this.promise = $.when();

		window.IR = this;

		this.reactions = new IReact.ReactionCollection(this.model.reactions, {iReact:this});

		this.ReactionManager = new IReact.ReactionManager({
			iReact: this,
			reactions: this.reactions,
			setups: this.model.dataJSON.setups,
		});
	},

	// показывает правильный ответ в моделе
	showSolution: function() {
		new IReact.Solution({
			iReact: this,
		}).show();
	},

	// глобальный таймер эксперемента
	startTimer: function ()
	{
		var self = this,
				frame = function (time) {
					self.timerFrame(time);
					requestAnimationFrame(frame);
				};

		requestAnimationFrame(frame);
	},

	timerFrame: function (time) {
		this.timer += (time - (this.prevTime||0))*this.timeSpeed;

		var seconds = Math.ceil(this.timer/1000);

    if (this.seconds != seconds) {
      this.trigger("timer", seconds);
      this.seconds = seconds;
    }

		this.prevTime = time;
  },

	log : function ()
	{
		if (this.logging) console.log.apply(console, arguments);
	},

	// сохранить ответ
	saveAnswer : function () {},

	// загрузить ответ
	loadAnswer : function () {},

	// 0 - 100 баллов
	answerScore : function ()	{
		if (this.model.dataJSON.steps) {
			return this.Steps.complete ? 100 : 0;
		}
		return this.isValidLabels() ? 100 : 0;
	},

	// показывает правильный ответ в моделе
	// showSolution : function () {	// старое, использовалось для тех случаев когда метки угадать надо было
	// 	this.solutionLabels();
	// },

	// приведение в изначальное состояние
	// reload: function () {
		// modelNS.BaseModelView.prototype.reload.apply(this, arguments);
		// this.undelegateEvents();
	// },

	onDischarge: function ($drop) {
		var equip = $drop.data("equip");

		if (equip) {
			if (!this.Steps.validate(equip, {discharge:equip.model.id})) {
				return false;
			}
			equip.discharge();
			this.Steps.verify({discharge:equip.model.id});
		}

		// var equipView = $drop.data("equip");
		// 		equipView.reagents = [];
    //
		// $drop.attr('reagent', '');
		// $drop.data('reagentsCount', 0);

		// $drop.addClass('empty');
	},

	zoom: function (equip, options) {
		if (this.zoomTimer) {
			return;
		}

		if (!options) options = {};

		// glassware.zoomIn();
		// if (reagent) reagent.zoomIn(); // TODO: change as arguments?

		var duration = options.duration && options.duration !== true ? options.duration : this.zoomTime * 1000;

		// zoom on
		this.zoomIn(equip);

		var self = this;
		this.zoomEquip = equip;
		this.zoomTimer = setTimeout(function () {self.zoomOut()}, duration);

		// this.verifyStep({zoom : equip.model.get('id')});
	},

	// TODO: argument equip?
	zoomIn: function (equip) {

		if (this.zoomEquip) { // only once we make zoomIn
			return this.$zoomer.promise();
		}

		this.zoomEquip = equip;

		var $target = equip.$el,
				pos = $target.position(),
				outset = 100/CourseConfig.zoomScale, // что бы объект не был прижат по краям сверху
				targetWidth = $target.width(),
				targetHeight = $target.height() + outset,
				sceneWidth = this.sceneWidth(),
				sceneHeight = this.sceneHeight(),
				scale = Math.min(sceneWidth/targetWidth, sceneHeight/targetHeight),
				self = this;

		// hight quality all equips
		var $equips = this.$el.find('.equip');
		$equips.each(function () {
			var equip = $(this).data('equip'); // discharge has not equip ???
			if (equip) equip.zoomIn();
		});

		// calculate zooming
		while ($target.offsetParent()[0] != this.$zoomer[0]) {
			$target = $target.offsetParent();
			var parentPos = $target.position();
			pos.left += parentPos.left;
			pos.top += parentPos.top;
		}

		var posLeft = pos.left/CourseConfig.zoomScale,
				posTop = pos.top/CourseConfig.zoomScale - outset/2, // - this.captionPane.$el.height()/CourseConfig.zoomScale,	// плохо отрабатывает без масштабирования
				left = (-posLeft + (sceneWidth - targetWidth)/2)*scale,
				top = (-posTop + (sceneHeight - targetHeight)/2)*scale,
				minLeft = (sceneWidth/2 - sceneWidth*scale/2),
				maxLeft = minLeft*-1,
				mattachtop = (sceneHeight/2 - sceneHeight*scale/2),
				maxTop = mattachtop*-1;

		if (left < minLeft) left = minLeft;
		if (left > maxLeft) left = maxLeft;
		if (top < mattachtop) top = mattachtop;
		if (top > maxTop) top = maxTop;

		this.$zoomer.animate({
			left: left,
			top: top,
		}, {
			// easing: 'linear',
		});

		this.$overlay = $('<div class="overlay"/>')
			.click(function () {
				self.zoomOut();
			})
			.appendTo(this.$zoomer);

		var promise = this.$zoomer.data('scale', scale).css('borderSpacing', 1).animate({
			borderSpacing: scale
		},{
			// easing: 'linear',
			step: function(now) {
				$(this).css('transform','scale('+now+')');
				// console.log('zoom', now)
			},
			queue: false
		}).promise();

		this.promise = promise;

		return promise;
	},

	afterZooming: function (fn) {
		if (!this.zoomEquip) {
			this.$zoomer.promise().then(fn);
		} else {
			this.once("zoomout", fn);
		}
	},

	zoomPromise: function () {
		return this.$zoomer.promise();
	},

	zoomOut: function (complete) {
		if (!this.zoomEquip) { // only once we make zoomOut
			return this.$zoomer.promise();
		}

		var self = this,
				equipId = this.zoomEquip.model.get('id');

		clearTimeout(this.zoomTimer);
		this.zoomEquip = null;

		this.$zoomer.stop().animate({
			left : 0,
			top : 0
		}, complete);

		// TODO: animate over $({.}).animate
		var scale = this.$zoomer.data('scale'),
				$animate = $({scale:scale}).animate({
					scale: 1
				},{
					complete : function () {
						var $equips = self.$el.find('.equip');
						$equips.each(function () {
							var equip = $(this).data('equip'); // discharge has not equip ???
							if (equip) equip.zoomOut();
						});

						self.$overlay.remove();
						self.$zoomer.removeClass('zoomout');
						self.zoomTimer = null;
						self.verifyStep({zoom: equipId});

						self.trigger("zoomout");
					},
					step: function(now) {
						self.$zoomer.css('transform','scale('+now+')');
					},
					queue: false
				});

		// this.zoomOutPromise = $animate.promise();

		return this.promise = $animate.promise();
	},

	onDropInShelf : function ($parent, $drop, event) {
		var equip = $drop.data('equip');

		if (equip) equip.onDropInShelf(event, $parent);
	},

	// onLabelDrop : function ($parent, $label)
	// {
	// 	$label
	// 		.appendTo($parent)
	// 		.css({left:'auto', top:'auto'});
	// },

	solutionLabels: function () {
		this.$el.find('.label[for]').each(function () {
			var $this = $(this);
					reagent = $this.attr("for"),
					$reagent = $('#'+reagent);

			$this.appendTo($reagent);
		});
	},

	isValidLabels : function () {
		var isValid = true;
		this.$el.find('.tubes_stand .test_tube').each(function () {	// TODO: test_tube - более универсально сделать
			var $label = $(this).find('.label'),
					labelFor =	$label.attr('for'),
					reagent = $(this).attr('reagent');

			if (!$label.length || labelFor && reagent != labelFor) {
				isValid = false;
				return false;
			}
		});

		return isValid;
	},

	render: function() {
		var self = this;

		modelNS.BaseModelView.prototype.render.apply(this);

		// обновляем значение таймера
		this.timer = 0;
		this.seconds = 0;

		this.$el.addClass('ireact');

		// var params = this.model.dataJSON,
		// 		sizes = _.pick(params, ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight"]);

		// размеры модели
		// this.$el.css(sizes);

		this.renderLayout();

		this.scenePane.$el.wrapInner('<div class="zoomer"/>');
		this.$zoomer = this.$el.find('.zoomer')
		// .droppable({
		// 	drop: function (event, ui) {
		// 		console.log('zoomer')
		// 	}
		// });

		this.Steps = new IReact.Steps({iReact: this}).render();

		this.renderShelfs();
		this.renderEquipments();

		// сначала события на оборудования, после события на полку
		this.shelfsDroppable();

		this.Steps.activateStep(0);

		// init jquery ui tooltip's
		this.$el.find('[tooltip]').tooltip({
			classes: {
		    "ui-tooltip": "ireact-tooltip"
		  },
			// tooltipClass: "ireact-tooltip"
		});

		return this;
	},

	sceneWidth: function () {
		return this.scenePane.$el.width()
	},

	sceneHeight: function () {
		return this.scenePane.$el.height();
	},

	renderLayout: function () {
		this.maintLayout = new modelNS.DualVerticalLayout({
			firstPaneWidth : 48,
			parent : this.$el
		}).render();

		this.sceneLayout = new modelNS.DualHorizontalLayout({
			bottomPaneHeight: 42,
			parent: this.maintLayout.$secondPane,
		}).render();

		this.stepsPane = new modelNS.SingleLayout({
			// title : modelNS.lang('system_params'),
			parent : this.maintLayout.$firstPane,
		}).render();

		this.scenePane = new modelNS.SingleLayout({
			parent : this.sceneLayout.$topPane,
			cls : 'scene'
		}).render();

		this.captionPane = new modelNS.SingleLayout({
			parent : this.sceneLayout.$bottomPane,
			hasContent : true,
			cls : 'step-caption',
		}).render();
	},

	// валидация шага, происходит в stric mode
	validateStep: function (equip, options) {
		return this.Steps.validate(equip, options);
	},

	verifyStep: function (action) {
		return this.Steps.verify(action);
	},

	notify: function (text, options) {
		// this.log(text);
		// if (!this.developing) return;
		if (!options) options = {};

		var self = this;

		// if (!this.$notify) this.$notify =
		var $notify = $("<div class='ireact-notify'/>")
			.html(text)
			.appendTo(this.scenePane.$el)
			.delay(options.delay || 2000)
			.fadeOut(500);

		$notify.css({left:this.$zoomer.width()/2 - $notify.width()/2});

		return $notify;

		// $("<div class='msg'>"+text+"</div>")
		// 	.appendTo(this.$notify)
			// .delay(2000)
			// .fadeOut(500);

		// this.$notify.stop().show();
		// clearTimeout(this.notifyTimeout);
		// this.notifyTimeout = setTimeout(function () {
		// 	self.$notify.fadeOut(500)
		// }, 2000);
	},

	renderShelfs: function () {
		var self = this,
				params = this.model.dataJSON,
				shelfsCount = 3,
				modelHeight = this.$zoomer.height(),
				shelfParams = [	// % ?
					{height:35},
					{height:35},
					{height:30},
				];

		this.shelfs = [];

		for (var i=shelfsCount-1; i>=0; i--) {
			var $shelf = $('<div class="shelf level-' + i + '"/>')
				.appendTo(this.$zoomer)
				.attr("level", i)
				.data("level", i);

			$shelf.data("leftOutset", $shelf.css('paddingLeft').replace('px','')*1);
			$shelf.data("rightOutset", $shelf.css('paddingRight').replace('px','')*1);

			$shelf.css("height", modelHeight/100*shelfParams[i].height);

			this.shelfs[i] = $shelf;
		}

		// table = auto height
		// this.shelfs[0].height(params.height - height - 3);	// 3 - border compensasion
	},

	shelfsDroppable: function () {
		var self = this;
		for (var i=0; i<this.shelfs.length; i++) {
			this.shelfs[i].droppable({
					drop: function (event, ui) {
						self.onDropInShelf($(this), $(ui.draggable), event);
					},
					tolerance: "pointer"
				});
		}
	},

	clearEquipments: function () {
		var self = this,
				models = this.equipCollection.models;

		while (models.length) {
			this.equipCollection.remove(models[0]);
		}
	},

	clearShelfs: function () {
		var shelfsCount = 3;
		for (var i=0; i<this.shelfs.length; i++) {
			var $shelf = this.shelfs[i];
			$shelf.data("leftOutset", $shelf.css('paddingLeft').replace('px','')*1);
			$shelf.data("rightOutset", $shelf.css('paddingRight').replace('px','')*1);
		}
		this.clearEquipments();
	},

	findReagent: function (name) {
		var params = this.model.dataJSON,
				reagents = params.reagents;
		return reagents[name];
	},

	renderEquipments: function () {
		// раковина
		this.renderDischarge();

		var self = this,
				params = this.model.dataJSON,
				equipment = params.equipment;

		this.equipCollection = new IReact.EquipCollection();

		for (var i=0; i<equipment.length; i++) {

				var equip = equipment[i],
						equipModel = new IReact.EquipModel(equip),
						stand = equip.stand,
						subtype = equip.subtype,
						type = equip.type,
						equipView = new (IReact.equips[subtype] || IReact.equips[type] || IReact.EquipView)({ parent: this.$zoomer, model: equipModel }),
						left = equip.left*1,
						right = equip.right*1,
						top = equip.top*1,
						bottom = equip.bottom*1,
						isAttachToShelf = equip.attachto && equip.attachto.indexOf('shelf_')===0,
						shelf = isAttachToShelf ? equip.attachto.replace('shelf_', '') : 0,	// attachto="shelf_0|shelf_1|shelf_2"
						level = (equip.shelf || shelf)*1,
						$shelf = this.shelfs[level],
						align = equip.align || 'left',
						connected_to = equip.connected_to;

				if (isAttachToShelf) {
					delete equip.attachto; // not real attach
					equip.shelf = level;
				}

				equipView.iReact = this;

				var $equip = equipView.render().$el;

				this.equipCollection.add(equipModel);

				this.listenTo(equipModel, "delete", function (model) {self.equipCollection.remove(model)});

				if (equip.attachto) { // не устанавливаем позиции если присоединен
					// continue;
				} else if (left && (top || bottom)) {
					equipView.setPosition({left:left, top:top, right:right, bottom:bottom});
				} else if (connected_to) {
					equipView.connectTo(connected_to);
				} else if ($shelf) {
					equipView.setShelf($shelf, align, {left:left, right:right, bottom:bottom, top:top}, level);
				}
		}

	},

	// unConstruct : function ($equip, ui) {
	// 	if ($equip.parent().hasClass('equip')) {
	// 		var left = $equip.css('left').replace('px', '')*1,
	// 		 		top = $equip.css('top').replace('px', '')*1,
	// 				$parent = $equip.parent(),
	// 				parentLeft = $parent.css('left').replace('px', '')*1,
	// 				parentTop = $parent.css('top').replace('px', '')*1;
	//
	// 			console.log(left + parentLeft, left, parentLeft)
	//
	// 		$equip.appendTo($parent.parent());
	// 		$equip.css({left:left + parentLeft, top:top + parentTop});
	// 		ui.position.left = left + parentLeft;
	// 		ui.position.top = top + parentTop;
	// 	}
	// },

	renderDischarge: function () {
		var self = this;

		this.$discharge = $('<div class="equip discharge"/>').appendTo(this.shelfs[0]).droppable({
    	drop: function(event, ui) {
				 var $drop = $(ui.draggable);
				 // if ($drop.hasClass('glassware')) {
					 self.onDischarge($drop);
				 // }
				 // self.onCatch($(this), $drop);	// ???
      },
			// over: function(event, ui) {

			// },
			// out: function(event, ui) {
			//
			// },
	  });

		// исполльзуется для настройки области куда выливается жидкость, при смене скина
		this.$dischargingArea = $('<div class="discharging-area"/>').appendTo(this.$discharge);
	},

	tooltip: function ($el, title, options) {
		if (!options) options = {};

		$el.attr({title:title});

		$el.tooltip($.extend( {
        position: { my: "left+50 bottom+25", at: "right top"},
	      classes: {
			    "ui-tooltip": "ireact-tooltip " + (options.className||'')
			  },
				open: function (event, ui) {

					var $line = $('<div class="ireact-tooltip-line"/>')
							.addClass(options.className)
							.appendTo(document.body)
							.position({	of: $el }) // prepare position before .open becose of bug in chrome
							.position({
								of: $el,
								my: "left top",
								at: "left top"
							});

					var point = $.extend({valign:"middle", align:"center"}, options.point),
							$tooltip = ui.tooltip,
							pos1 = $tooltip.position(),
							pos2 = $line.position(),
							x2 = pos2.left + (point.align == "center" && $el.width()/2*CourseConfig.zoomScale),
							y2 = pos2.top + 2 + (point.valign == "middle" && $el.height()/2*CourseConfig.zoomScale),
							x1 = pos1.left + $tooltip.width()/2,
							y1 = pos1.top + $tooltip.height()/2;

					$el.data({
							tooltip: $tooltip,
							tooltipLine: $line
					});

					modelNS.drawLine(x1,y1,x2,y2,$line).hide().fadeIn(400);
				},
				close: function () {
					// $(this).stop(true);
					$el.data('tooltipLine').stop().fadeOut(200, function () {$(this).remove()});
					if (options.once) $el.attr('title',"");
				}
      }, options ));
	},

	inform: function ($el, title, options) {
		if (!options) options = {};

		var self = this;

		this.afterZooming(function () {
			self.tooltip($el, title, $.extend({once:true}, options));
			$el.off("mouseleave");
			$el.tooltip("open");

			$el.data('tooltipLine').mouseover(function () {$(this).fadeOut(200)});
			$el.mouseleave(function () {$(this).data('tooltipLine').fadeIn(200)});
			$el.data('tooltipTimer', setTimeout(function () { self.closeTooltip($el)	}, options.duration || 2000));
		});
	},

	closeTooltip: function ($el) {
		$el.find(':ui-tooltip').tooltip('close').each(function () {
			clearTimeout($(this).data('tooltipTimer'));
		});
		if ($el.is(':ui-tooltip')) $el.tooltip('close');
		clearTimeout($el.data('tooltipTimer'));
	},

	wrong: function ($el, title, options) {
		this.inform($el, title, $.extend({className:"wrong", duration:3000}, options));
	},

	stepClick: function (event) {
		var $step = $(event.target);
		this.Steps.stepInfo($step);
	},

	findSetupedInto: function (id, attachto) {
		return $.find([
				'#'+attachto + ' #' + id,
				'#'+attachto + ' [type="' + id + '"]',
				'[type="'+attachto+'"] [type="' + id + '"]'
			].join(', '));
	},

	reagentsToString: function (reagents) {
		var reagentsArr = [];
		for (var i=0; i<reagents.length; i++) {
			reagentsArr.push(reagents[i].name);
		}
		reagentsArr.sort();
		return reagentsArr.join(" ");
	},

	isSetupComplete: function (name) {
		var setups = this.model.dataJSON.setups,
				setup = setups[name];
// console.clear();
		for (var id in setup) {
			var attachto = setup[id].attachto,
					$setuped = this.findSetupedInto(id, attachto);

// console.log(attachto, id, $setup.length, '#'+attachto + ' #' + id + ', #'+attachto + ' [type="' + id + '"]')
			if ($setuped.length) {
				// console.log(id + ' in ' + attachto);
			} else {
				// console.log('setup not complete: ', '#'+attachto + ' #' + id + ', #'+attachto + ' [type="' + id + '"]');
				return false;
			}
		}
		return true;
	},

	findReaction: function (reagent, reactor) {
		return this.ReactionManager.findReaction(reagent, reactor);
	},

	findReactions: function (reagent, reactor) {
		return this.ReactionManager.findReactions(reagent, reactor);
	},

	// TODO: optimize добавить аттрибут [receiver] ?
	findReactors: function (equip) {
		return this.ReactionManager.findReactors(equip);
	},

	findReactor: function (equip) {
		return this.ReactionManager.findReactor(equip);
	},

	startReactions: function (initiator) {
		return this.ReactionManager.startReactions(initiator);
	},

	isCanStartReaction: function (reaction, reactor) {
		return this.ReactionManager.isCanStartReaction(reaction, reactor);
	},

	findReactionReadyToStart: function (equip, options) {
		return this.ReactionManager.findReactionReadyToStart(equip, options);
	},

	checkReaction: function (reaction, equip, options) {
		return this.ReactionManager.checkReaction(reaction, equip, options);
	},

	revertStep: function () {
		this.notify(modelNS.lang('wrong_step'));
		this.Steps.restoreStep();
	}

});

// modelNS.IReact.AudioUtils.playAudio("clap.mp3")
modelNS.IReact.AudioUtils = {
	playAudio: function (file) {
		var path = 'externals/ireact/sounds/' + file,
				audio = new Audio(path);

		audio.loop = false;
		audio.play();
	}
}




function xmlToHtml ($tag) {
	if (/(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent)) {
		return $tag[0] && (new XMLSerializer()).serializeToString($tag[0]).replace(/\n/gi, '').replace(/<.*?>(.*)<\/.*?>/gi,'$1') || "";
	} else {
		return $tag.html();
	}
}

function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}


// TODO: Все это требует какой-то оптимизации, особенно reaction.reactor ??
// если у описания реакции нет реактора, тогда он не может быть частью реакции

IReact.ReactionManager = Backbone.Model.extend({
  initialize: function (options) {
    this.iReact = options.iReact;

    this.setups = options.setups;
    this.reactions = options.reactions;
  },

  findReactions: function (reagent, reactor) {
    // из .findReactor может ничего не прийти
		if (!reactor) {
			return [];
		}

		var reactions = this.reactions,
				reagents = reactor.reagents.slice();

		if (!reactions.length) {
			return [];
		}

		if (reagent) {
			reagents.push(reagent);
		}

		// почему?? мешает для откатной реакции (потушить лампу) где реагенты не нужны
		// для лампы мы уже используем другой механизм, лампа автоматически выключается если разорвано соединение
		// теперь нужно для предметного стекла
		// if (!reagents.length) {
		// 	return [];
		// }

		var exist,
				find_warn,
				find_reactions = [];

		for (var i=0; i<reactions.length; i++) {
				var reaction = reactions.at(i);

				if (!reaction.checkEquip(reactor)) {
					continue;
				}
				if (!reaction.checkReagents(reagents)) {
					continue;
				}

				exist = true;

				var setup = reaction.get('setup');

				if (reaction.check_err) {	// ??
					find_warn = reaction.check_err;
				} else if (setup && setup != reactor.setup) {
					find_warn = "#" + reactor.model.id + " not_in_setup #" + setup + "(#"+(reactor.setup||"null")+")";
				} else {
					find_warn = "";
				}

				reaction.find_warn = find_warn;

				if (!find_warn) {
					find_reactions.push(reaction);
				}
		}

		// заглушка на то что действие все же возможно (если нет реакции доступной то действие не возможно)
		if (!find_reactions.length && exist) {
			reaction = new Backbone.Model();
			reaction.find_warn = find_warn;
			find_reactions.push(reaction);
		}

		return find_reactions;
  },

  findReaction: function (reagent, reactor) {
    return this.findReactions(reagent, reactor)[0];
  },

  findReactors: function (equip) {
		if (equip.isReactor()) { // предметное стекло, equip.isReseiver - старое
			return [equip];
		}

		var reactors = [];

		// если часть установки
		if (equip.setup) {

			// когда учавствует более чем в одной установке
			for (var i=0; i<equip.setups.length; i++) {
				var type = equip.model.type,
						setups = this.setups,
						setup = setups[equip.setups[i]];

				// setup complete
				for (var id in setup) {
					var attachto = setup[id].attachto,
							setuped = this.iReact.findSetupedInto(id, attachto);

					if (setuped.length) {
						var setupedEquip = $(setuped[0]).data("equip");
						if (setupedEquip.isReactor()) {
							reactors.push(setupedEquip);
						}
					}
				}
			}
		} else if (equip.attachedTo) {	// проверяем вверх по присоединенным элементам, когда инициатор в условии но без установки (лучина в пробирке)
			var attachedTo = equip.attachedTo;
			while (attachedTo) {
				if (attachedTo.isReactor()) {
					return [attachedTo];
				} else {
					attachedTo = attachedTo.attachedTo;
				}
			}
		}

		return reactors;
	},

	findReactor: function (equip) {
		return this.findReactors(equip)[0] || null;
	},

	startReactions: function (initiator) {
		var reactors = this.findReactors(initiator);

		for (var i=0; i<reactors.length; i++) {
				var reactor = reactors[i],
						reaction = this.findReaction(null, reactor);

				if (this.isCanStartReaction(reaction, reactor)) {
					reactor.startReaction(reaction, {initiator: initiator});
				}
		}
	},

	isCanStartReaction: function (reaction, reactor) {
		if (!reaction) {
      return;
    }

		console.log('Try run Reaction:', reaction);

		if (reaction.find_warn) {
			return;
		}

		if (!reaction.checkConditions(reactor)) {
			return false;
		}


		// TODO: проверять на лишниае выполненные condition которые не требовались для реакции

		// check cap_closed
		if (reaction.cap_closed) for (var i=0; i<reaction.cap_closed.length; i++) {
			var capId = reaction.cap_closed[i],
					capEquip = $('#'+capId).data('equip');
			if (!capEquip) return alert('undefined cap #' + capId);
			// console.log(capEquip.model.get('type'), capEquip.isClosed())
			if (!capEquip.isClosed()) {
				reaction.check_err = "cap_closed_error";
				return false;
			}
    }

		for (var id in reaction.item_angle) {
			var angle = reaction.item_angle[id];
					$equip = $('#' + id),
					equip = $equip.data('equip');

			if (!equip || !equip.checkAngle(angle)) {
				reaction.check_err = "angle_error";
				return false;
			}
		}

		if (reaction) {
			reaction.reactor = reactor;
		}

		return reaction;
	},

	// TODO: Все это требует какой-то оптимизации, особенно reaction.reactor ??

	findReactionReadyToStart: function (equip, options) {
		if (!options) options = {};

		// если будет искать в стенде, то найти может другую пробирку реактор с похожими условиями
		// поэтому проверяем переданный equip не является ли он реактором
		var reactor = equip.isReactor() ? equip : this.findReactor(equip),
				reactions = [];

    // мы игнорируем реакцию в опциях, потому как это было сделано для оптимизации
    // но сейчас оптимизировать не возможно, потому как реакция может найтись несколько и нужно запустить самую приоритетную
		// if (options.reaction) reactions.push(options.reaction);

		if (!reactions.length) {
			reactions = this.findReactions(null, reactor);
    }

		// console.log('#findReactionReadyToStart', reactions.length)

    // ищем все возможные реакции, потом выполняем более приоритетную
    var reactionsReadyToStart = [];
		for (var i=0; i<reactions.length; i++) {
			var reaction = reactions[i];
			if (this.isCanStartReaction(reaction, reactor)) {
        reactionsReadyToStart.push(reaction);
        // console.log('#reaction.order', reaction.order)
			}
		}

    if (reactionsReadyToStart.length) {
      reactionsReadyToStart.sort(function (reaction, reaction2) {
    		return reaction.order > reaction2.order ? 1 : -1;
      });
      // console.log('#reactionsReadyStart', reactionsReadyToStart[0].cid);
      return reactionsReadyToStart[0];
    }
	},

	checkReaction: function (reaction, equip, options) {
		reaction = this.findReactionReadyToStart(equip, {reaction: reaction});

		if (!reaction) {
			return;
		}

		return reaction.reactor.startReaction(reaction, options);
	},

});


IReact.Reaction = Backbone.Model.extend({
  initialize: function (options) {
    this.reagents = options.reagents;
    this.conditions = options.conditions;
    this.item_activated = options.item_activated;
    this.cap_closed = options.cap_closed;
    this.item_angle = options.item_angle;
    this.result = options.result;
    this.zoomable = options.zoomable;
    this.plaque = options.plaque ? options.plaque == 'true' ? {} : {color: options.plaque} : null; // может в xml указываться как true или как цвет.
    this.time = options.time;
    // this.blur = options.blur && {color:options.blur};
    this.iReact = options.iReact;

    this.id = options.id || this.cid;

    this.set({
      setup: options.setup||null
    });

    // приоритет выполнения реакции
    this.order = 0;

    this.timers = {};
  },

  findReagents: function (reagents) {
    var self = this;

    // find reagent wich not exist in reagents
    if (_.find(reagents, function (reagent) {
      return !self.reagents.find({name : reagent.name});
    })) {
      return false;
    }
    return reagents;
  },

  checkReagents: function (reagents) {
    var checkReagents = {};

    // обнуление
    // TODO: по логике в другое мето перенести? Либо один общий метод .check создать?
    this.check_err = "";

    if (reagents.length == 0) {
      // реакция не нуждается в реагентах
      // ТОDО: таким реакциям и не нужен реактор
      if (this.reagents.length == 0) {
        return true;
      } else {
        return false;
      }
    }

    // TODO: this.check_err - нужно оптимизировать ???
    // если будет параллельная проверка реакции (по событиям или по таймеру) то произойдет перезапись

    for (var i=0; i<reagents.length; i++) {
      var reagent = reagents[i];
      if (!this.reagents.find({name : reagent.name})) {
        this.check_err = "contain_wrong_reagent ["+reagent.name+"] in reaction #" + this.get('id');
        return false;
      }
      // size сложен зарание
      // TODO: Возможно, если реагент уже содержится, то не прислать его в массиве
      if (!checkReagents[reagent.name]) {
        checkReagents[reagent.name] = reagent.size;
      }
    }

    for (var i=0; i<this.reagents.length; i++) {
      var reagent = this.reagents.at(i),
          name = reagent.get('name'),
          size = reagent.get('size');

      if (!checkReagents[name]) {
        this.check_err = "miss reagent " + name + " in " + (this.reactor && this.reactor.model.id); // + " " + JSON.stringify(checkReagents);
        return true;
      }
      if (size && size != checkReagents[name]) {
        this.check_err = "wrong reagent " + name + " size " + checkReagents[name] + "("+size+")";
        return true;
      }
    }

    return true;
  },

  createProducts: function (reagents) {
    var products = this.get('products'),
        reagentsArr = [],
        removeReagents = [],
        newReagents = [],
        notChangedReagents = [],
        productsStates = [],
        productsList = [],
        size = {
          liquid: 0, // так как в процессе счета может вызваться еще до проверки и присваивания к 0
        },
        mostOfRemove = {};

    if (!products) {
      return null;
    }

    for (var i=0; i<products.length; i++) {
      productsList.push(products[i].name);
    }

    // список реагентов на удаление
    // подсчитываем результирующие размеры реагентов
    // mostOfRemove, [most] - определяем. какой из удаляемых реагентов занимает больше всего места
    for (var i=0; i<reagents.length; i++) {
      var reagent = reagents[i];
      if (productsList.indexOf(reagent.name)<0) {
        removeReagents.push(reagent);
        if (!mostOfRemove[reagent.state]) {
          mostOfRemove[reagent.state] = reagent;
          reagent.most = true;
        }
        // console.log('#createProducts:most', mostOfRemove[reagent.state].size, reagent.name, reagent.size)
        if (reagent.size > mostOfRemove[reagent.state].size) {
          mostOfRemove[reagent.state].most = false;
          reagent.most = true;
          mostOfRemove[reagent.state] = reagent;
        }
      } else {
        notChangedReagents.push(reagent);
        reagentsArr.push(reagent.name);
        productsStates.push(reagent.state);
      }

      if (!size[reagent.state]) {
        size[reagent.state] = 0;
      }

      size[reagent.state] += reagent.size;

      // порошок вытесняет жидкость
      if (reagent.state == 'powder') {
        size.liquid += reagent.size * 0.75; // TODO: похожее в equip.getReagentsSize - както синхронизировать это все
      }

      // чипсы вытесняют жидкость
      if (reagent.state == 'chips') {
        size.liquid += reagent.size; // TODO: похожее в equip.getReagentsSize - както синхронизировать это все
      }
    }

    // составим список новых продуктов
    for (var i=0; i<products.length; i++) {
      var product = products[i],
          reagent = this.iReact.findReagent(product.name);
      if (reagentsArr.indexOf(product.name)<0) {
        // например, новосозданный кристал не может быть size:0.
        // Нужно продумать либо систему определения размеров, либо записывать в продуктах <product.. size=".."/>
        newReagents.push($.extend({}, reagent, { // в новый объект что бы не перезаписывались sourceReagents
          size: product.size || size[reagent.state] || 1,
          sourceReagents: removeReagents, // исходные реагенты
        }));
        productsStates.push(reagent.state);
      }
    }

    return {
      reagents: notChangedReagents,
      newReagents: newReagents,
      removeReagents: removeReagents,
      productsStates: productsStates,
    }
  },

  // определенное оборудование в сборке с определенным статусом
  checkEquip: function (equip) {

    // .root() проверяется, например: включена ли лампа. Лампа учавствует в сборке, но не приатачена к реактору, и находится выше его "уровнем".
    // выходит нужно проверять - если equip - реактор, то он должен быть равен текущему reactor?
    // checkReactor ?
    var root = equip.findRoot();

    if (this.conditions) {
      for (var i=0; i<this.conditions.length; i++) {
        var condition = this.conditions[i];
        if (condition.equip) {
          var checkEquip = root.findInside(condition.equip);
          if (checkEquip) { // если вообще учавствует в сборке
            if (condition.attachto) {
              if (this.iReact.findSetupedInto(condition.equip, condition.attachto).length) { // equip.model.id - ??? был баг с лучиной в пробирке 51105002
                this.check_err = "";
              } else {
                this.check_err = "equip_attach_error eq:#"+condition.equip+" to:#"+condition.attachto + " r:#" + this.id;
                return false;
              }
            }
            if (condition.status) {
              if (condition.status != checkEquip.model.get('status')) {
                this.check_err = "equip_status_error eq:#"+condition.equip+" status:"+condition.status + " r:#" + this.id;
                return false;
              }
            }

            // если в условиях есть реактор, и он не соответствует проверяемому оборудованию, которое тоже - реактор
            // <condition equip="P7"/>
            if (checkEquip.isReactor() && equip.isReactor() && checkEquip != equip) {
                this.check_err = "wrong_reactor:#"+equip.model.id+" #"+checkEquip.model.id+" r:#" + this.id;
              return false;
            }
          } else {
            if (condition.wait) { // timer
              // реакция возможна поэтому false не возвращаем
              // условие ожидания времени проверяется в методе проверки условий .checkConditions
            } else {
              this.check_err = "equip_error #" + this.get('id');
              return false;
            }
          }
        }
      }
    }

    return true;
  },

  checkConditions: function (equip) {

    // проверяем эффекты
    if (this.conditions) {
      for (var i=0; i<this.conditions.length; i++) {
        var condition = this.conditions[i];

        // type = "mix"
        if (condition.action) {
          if (equip.effects.indexOf(condition.action) < 0) {
    				this.check_err = "conditions_error";
            return false;
          }
        }

        // wait
        if (condition.wait) {

          // чем позже реакция, тем больший приоритет она имеет к выполнению
          this.order = -condition.wait;

          // console.log('#condition.wait', equip.model.id, condition.wait)
          // TODO: iReact.Conditions utils
          if (condition.equip) {
            var timer = $('#' + condition.equip).data('equip'),
                wait = function () {
                  // console.log('#wait', equip.model.id, condition.wait - timer.seconds);
                  return condition.wait - timer.seconds;
                };
            if (wait() > 0) {
              var self = this;

              if (!this.timers[equip.model.id]) {
                this.timers[equip.model.id] = this.listenTo(this.iReact, "timer", function (seconds) {
                  if (wait() <= 0) {
                    this.stopListening(this.iReact, "timer");
                    this.timers[equip.model.id] = null;
                    this.check_err = "conditions_error_wait";
                    equip.checkReaction(this); // проверяем именно эту реакцию?
                  }
                });
              }
              return false;
            }
          }
          // TODO: общее ожидание
        }
      }
    }

    // проверяем условие - собрана ли сборка
		if (this.get('setup') && !this.iReact.isSetupComplete(this.get('setup'))) {
			this.check_err = "setup #" + this.get('setup') + " not_complete";
			return false;
		}

    // check active items
		if (this.item_activated) for (var i=0; i<this.item_activated.length; i++) {
			var item_activated = this.item_activated[i],
					item = $('#'+item_activated).data('equip'),
					status = item.model.get('status') || item.model.get('state'); // state - old support
			if (!item) return alert('undefined item_activated #' + item_activated);
			if (status != 'active' && status != 'on') {	// TODO: <item_status/> ???
				this.check_err = "item_activated_error";
				return false;
			}
    }

    return true;

  }
});


IReact.ReactionCollection = Backbone.Collection.extend({
	model: function (attr, options) {
    attr.iReact = options.iReact;
    return new IReact.Reaction(attr, options);
  }
});


IReact.ReactionReagent = Backbone.Model.extend({
  initialize: function (options)
  {
    this.set(options);
  }
});

IReact.ReactionReagentCollection = Backbone.Collection.extend({
	model: IReact.ReactionReagent
});

// Демонстрация ответа

// TODO:
// Спички всеравно переносятся ??
// блокировка экрана
// пинцет мышка не в том месте


IReact.Solution = Backbone.View.extend({
  initialize: function (options) {
    this.iReact = options.iReact;
    this.$cursor = $('<div class="solutionCursor"/>');
  },
  show: function () {
    var self = this,
        promise = $().promise(),
        steps = this.iReact.model.dataJSON.steps;

    this.iReact.reload();

		for (var i=0; i<steps.length; i++) {
			var step = steps[i];

      (function (step) {
        promise = promise.then(function () {
          return self.showSolutionStep(step);
        });
      })(step);
		}

    // self.showSolutionStep(steps[1]);
  },

  showSolutionStep: function (step) {
    var self = this,
        conditions = step.conditions,
        promise = $().promise();

    for (var i=0; i<conditions.length; i++) {
      var condition = conditions[i];

      (function (condition) {
        promise = promise.then(function () {
          return self.showConditionSolution(condition);
        });
      })(condition);

      // ждем выполнения всех визуальных эффектов прежде чем перейти к демонстрации следующего шага
      promise = promise.then(function () {
        return self.iReact.promise;
      });
    }

    return promise;
  },

  showConditionSolution: function(condition) {
    var self = this,
        $targetEquip = $('#' + (condition.equip)), // [type='+condition.equip+'] // ??	// .to - old support
        targetEquip  = $targetEquip.data('equip'), // то, с чем происходит действие
        $fromEquip = $('#' + (condition.from)),
        fromEquip = $fromEquip.data('equip'),
        promise = this.iReact.promise,  // $().promise(); // ждем выполнения всех визуальных эффектов прежде чем перейти к демонстрации следующего шага
        dragEquip = fromEquip,
        dropToEquip = targetEquip;

        // ждем выполнения всех визуальных эффектов прежде чем перейти к демонстрации следующего шага
        promise = promise.then(function () {
          return self.iReact.promise;
        });

      // console.log('#',condition)

    // определяем что куда переносится
    if (condition.attachto) {
      dropToEquip = $('#' + (condition.attachto)).data('equip');
      dragEquip = targetEquip;
    }

    // type[=equip=dropToEquip] (TODO: index)
    if (condition.type && !dragEquip) {
      var find = ["[type='"+condition.type+"']"];
      if (condition.status) find.push("[status='"+condition.status+"']");
      dragEquip = this.iReact.$el.find(find.join('')).data('equip');
      if (!targetEquip) targetEquip = dragEquip;
    }

    // reagent, если указан только реагент, ищем емкость с ним
    if (condition.reagent && !dragEquip) {
      var $reagentEquip = this.iReact.$el.find("[reagent='"+condition.reagent+"']");
      dragEquip = $reagentEquip.data('equip');
    }

    // .. from ..
    if (dragEquip) {
      // .. size ..
      if (condition.size) {
        var reagent = dropToEquip.findReagentByName(condition.reagent) || {size:0},
            times = (condition.size-reagent.size)/dragEquip.dose;
        if (times > 0) while (times) {
          promise = promise.then(function () {
            return self.equipConditionFrom(dropToEquip, dragEquip);
          });
          times--;
        }
      } else {
        // once
        promise = promise.then(function () {
          return self.equipConditionFrom(dropToEquip, dragEquip);
        });
      }
    }

    // status:
    if (condition.status) {
      promise = promise.then(function () {
        return self.showStatusSolution(targetEquip, condition.status);
      });
    }

    // attachto:
    if (condition.attachto) {
      // если equip не в attachto тогда перемещаем его туда
      if (!dragEquip.$el.parents(dropToEquip.$el).length) {
        promise = promise.then(function () {
          return self.equipDropInEquip(dragEquip, dropToEquip);
        });
      }
    }

    // action
    if (condition.action) {
      promise = promise.then(function () {
        return self.equipMix(targetEquip);
      });
    }

    return promise;
  },

  equipConditionFrom: function (dropToEquip, dragEquip) {
    var promise = $.when(),
        self = this;
    if (dragEquip.isClosed()) {
      promise = promise.then(function () {
        return self.equipOpenCap(dragEquip);
      });
    }
    if (dropToEquip && (!dropToEquip.isTool || dragEquip.hasEffect)) { // если не передача эффекта (спички) и инструмент, то рекурсируем движение
      promise = promise.then(function () {
        return self.equipDropInEquip(dragEquip, dropToEquip);
      });
    } else {
      promise = promise.then(function () {
        return self.equipDropInEquip(dropToEquip, dragEquip);
      });
    }
    return promise;
  },

  equipDragStart: function (equip) {
    return this.visualizeMouseDown(equip.$el)
      .then(function () {
        equip.dragStart();
      });
  },

  equipDragStop: function (equip, options) {
    if (!options) {
      options = {};
    }
    return this.visualizeMouseUp()
      .then(function () {
        if (options.$shelf) {
          equip.onDropInShelf(null, options.$shelf);
        }
        if (options.dropToEquip) {
          options.dropToEquip.onCatch(equip);
        }
        equip.dragStop();
        return equip.promise; // взаимодействие с элементом
      });
  },

  // action:
  equipMix: function (equip) {
    var self = this,
        $equip = equip.$el,
        mixSettings = {duration:100, step: function () {equip.onDrag()}};

    return this.equipDragStart(equip)
            .then(function () {
              return $equip.animate({left:self.iReact.sceneWidth()/2, top:self.iReact.sceneHeight()/2})
                  .animate({left:"-=50"}, mixSettings)
                  .animate({left:"+=100"}, mixSettings)
                  .animate({left:"-=100"}, mixSettings)
                  .animate({left:"+=100"}, mixSettings)
                  .animate({left:"-=100"}, mixSettings)
                  .animate({left:"+=100"}, mixSettings)
                  .animate({left:"-=100"}, mixSettings)
                  .animate({left:"+=100"}, mixSettings)
                  .animate({left:"-=100"}, mixSettings)
                  .animate({left:"+=50"}, mixSettings)
                  .delay(400)
                  .promise()
            })
            .then(function () {
              return self.equipDragStop(equip);
            })
            .then(function () {
              return equip.$el.delay(500).promise();
            });
  },

  // эмуляция поиск реагентом и добавление его в оборудование
  // reagentDropInEquip: function (reagent, equip) {
  //   var $reagentEquip = this.iReact.$el.find("[reagent='"+reagent+"']"),
  //       reagentEquip = $reagentEquip.data('equip');
  //
  //   if (reagentEquip.solutionToolName) {
  //     var tool = reagentEquip[reagentEquip.solutionToolName];
  //     return this.equipDropInEquip(tool, equip);
  //   }
  // },

  // эмуляция оборудование бросаем в другое оборудование
  equipDropInEquip: function (dragEquip, dropToEquip) {

    // Используем инструмент взаимодействия (флаконпипетка) по возможности
    if (dragEquip.tool) {
      dragEquip = dragEquip.tool;
    }

    var self = this,
        toPosition = dropToEquip.position();

    return this.equipDragStart(dragEquip)
      .then(function () {
        return self.equipDrag(dragEquip, {top:'-=30'}, {duration:400})
      })
      .then(function () {
        return $({}).delay(400).promise()
      })
      .then(function () {
        // после того как equip приготовился к движению
        // вычесляем позицию взаимодействия
        var $output = dragEquip.$el.find('.output'),
            interaction = $output.length ? $output.position() : {
              left: dragEquip.$el.width()/2,
              top: dragEquip.$el.height()/2,
            };
        return self.equipDrag(dragEquip, {
          left: toPosition.left + dropToEquip.$el.width()/2 - interaction.left,
          top: toPosition.top + dropToEquip.$el.height()/2 - interaction.top,
        });
      })
      .then(function () {  // подсвечиваем активацию
        dragEquip.touchTarget(dropToEquip);
        return dropToEquip.$el.delay(500).promise();
      })
      .then(function () {
        return self.equipDragStop(dragEquip, {dropToEquip:dropToEquip});
      })
      .then(function () { // взаимодействие
        return dropToEquip.promise;
      })
      .then(function () {
        return $({}).delay(1000).promise();
      });
  },
  equipDrag: function (equip, position, options) {
    return equip.$el.animate(position, $.extend(options, {
      progress: equip.animatePosition && function () {equip.animatePosition()},
    })).promise();
  },
  showStatusSolution: function (targetEquip, status) {
    var self = this;

    if (status == 'closed' && targetEquip.hasCap) {  // у burner closed другая логика
      return this.equipCloseCap(targetEquip);
    } else {
      return targetEquip.showStatusSolution({
        status: status,
        Solution: self
      });
    }
  },
  equipCloseCap: function (equip) {
    var self = this,
        $shelf = equip.$shelf,
        cap = equip.linkedCap,
        toPosition = equip.position();

    if (!cap) {
      return;
    }

    return this.equipDragStart(cap)
      .then(function () {
        return self.equipDrag(cap, {top:'-=100'});
      })
      .then(function () {
        return $(this).delay(400).promise();
      })
      .then(function () {
        return self.equipDrag(cap, {
          top:toPosition.top + equip.$el.height()/2 - cap.$el.height()/2,
          left:toPosition.left + equip.$el.width()/2 - cap.$el.width()/2,
        }, {duration:400});
      })
      .then(function () {
        return self.equipDragStop(cap, {dropToEquip:equip});
      })
      .then(function () {
        return $(this).delay(500).promise();
      });
  },
  equipOpenCap: function (equip) {
    var self = this,
        $shelf = equip.$shelf,
        cap = equip.cap;

    if (!cap) {
      return;
    }

    return this.equipDragStart(cap)
      .then(function () {
        return cap.$el.animate({left:'+=20', top:'-=30'})
          .delay(400)
          .promise()
      })
      .then(function () {
        return self.equipDragStop(cap, {$shelf: $shelf});
      })
      .then(function () {
        return $(this).delay(500).promise();
      });
  },
  visualizeMouseDown: function ($target) {
    return this.$cursor.appendTo($target)
      .css({
        width:100,
        height:100,
        opacity:0,
        marginLeft:-50,
        marginTop:-50,
      })
      .show()
      .animate({
        opacity:0.9,
        width:8,
        height:8,
        marginLeft:-4,
        marginTop:-4,
      }, 200)
      .animate({
        opacity:0.6,
        width:24,
        height:24,
        marginLeft:-12,
        marginTop:-12,
      }, 100).promise();
  },
  visualizeMouseUp: function () {
    return this.$cursor
      .animate({
        opacity:0.8,
        width:16,
        height:16,
        marginLeft:-8,
        marginTop:-8,
      }, 100).animate({
        opacity:0,
        width:50,
        height:50,
        marginLeft:-25,
        marginTop:-25,
      }, 200).delay(100).promise();
  },
  showClick: function ($target) {
    var self = this;
    return this.visualizeMouseDown($target).then(function () {
        return self.visualizeMouseUp();
      });
  }
});

// Шаги

// TODO:


IReact.Steps = Backbone.View.extend({
  initialize: function (options) {
    this.iReact = options.iReact;
    this.stepsPane = this.iReact.stepsPane;
    this.captionPane = this.iReact.captionPane;
    this.steps = this.iReact.model.dataJSON.steps;
    this.strict = this.iReact.model.dataJSON.strict;
  },

  render: function () {
    var $captionContent = this.captionPane.$content,
				maxCaptionHeight = 0;	// TODO: dont show at all if 0 ??

    this.$stepsScroll = $('<div class="steps"/>').appendTo(this.stepsPane.$el);
    this.scrollPosition = 0;

		for (var i=0; i<this.steps.length; i++) {
			var step = this.steps[i],
          dashoffset = modelNS.isIE ? 0: 629,
          svgHTML = '<svg viewBox="-10 -10 220 220"> <path d="M200,100 C200,44.771525 155.228475,0 100,0 C44.771525,0 0,44.771525 0,100 C0,155.228475 44.771525,200 100,200 C155.228475,200 200,155.228475 200,100 Z" stroke-dashoffset="'+dashoffset+'"></path> </svg>';
					$step = $('<div class="step"><a>'+(i+1)+'</a>'
            +svgHTML
          +'</div>').appendTo(this.$stepsScroll);
			$step.data('data', step);
			$step.attr('tooltip', step);
			$captionContent.html(step.caption);
			maxCaptionHeight = Math.max(maxCaptionHeight, $captionContent[0].scrollHeight + 4); // 4 - padding compensation
		}
		this.iReact.sceneLayout.bottomPaneHeight(maxCaptionHeight);

    // обновление текущего шага
    this.$step = null;

    return this;
  },

  getActiveConditions: function () {
    var data = this.$step.data('data'),
        groupIndex = parseInt(this.$step.attr('condition-group')||0),
        conditions = data.conditiongroups.length ? data.conditiongroups[groupIndex] : data.conditions;

    return conditions;
  },

  activateNextConditions: function () {
    var data = this.$step.data('data'),
        groupIndex = parseInt(this.$step.attr('condition-group')||0);

    if (groupIndex < data.conditiongroups.length-1) {
      this.$step.attr('condition-group', groupIndex+1);
  		this.verify();
    } else {
      this.activateNextStep();
    }
  },

  // <condition reaction="..."/>
  // TODO: обнуление шагов, так например после очистки оборудования сбрасывается reagent from=>to
  //		а может from=>to свести к размеру? но тогда можно добавить палочкой, а не пипеткой, а это не то
  // 		еще у шагов должна быть возможность не кешированой проверки
  //		для status ?
  // Шаги прошедшие верификацию - отмечаются выполненными
  verify: function (action) {
      if (!this.$step) {
        return;
      }

      if (!action) action = {};

      var conditions = this.getActiveConditions(),
          complete = 1,
          reagent = action.reagent || {},
          desc = "",
          self = this,
          i;

      for (i=0; i<conditions.length; i++) {
        var condition = conditions[i],
            equip = null,
            from = null;

        if (this.$step.data('condition' + condition.index)) {
          continue;
        }

        // обнаружение equip
        if (condition.equip || condition.to) {
          equip = this.iReact.$('#' + condition.equip || condition.to).data('equip');

          // подсказка
          equip.hint(condition);
        }

        // пока что только для подсказки используется (перемешать палочкой)
        if (condition.from) {
          from = this.iReact.$('#' + condition.from).data('equip');

          // подсказка
          from.hint(condition);
        }

        if (condition.type) {
          var selector = '[type='+condition.type+']';

          if (condition.status) {
            selector += '[status='+condition.status+']';
          }

          if (condition.attachto) {
            selector = '#'+condition.attachto + ' ' + selector;
          }

          if (!this.iReact.$(selector).length) {
            complete = -100;
            break;
          }
        }

        if (condition.equip) { // .to - old support
          // reagent
          // <condition to|equip=".." reagent=".." [from=".."] [contain=".."]/>
          if (condition.reagent) {
            function condition_reagents(reagents) {

              if (!reagents) return;

              // TODO: для не strict mode использовать contain ?
              // тогда, после очищения, или не правильной верификации action для equip
              // сбрасывать весь кэш сохраненных условий

              for (var r=0; r<reagents.length; r++) {
                var reagent = reagents[r],
                    reagentFrom = reagent.from && reagent.from.model.id, // откуда внесен реагент, например из щипцов
                    reagentSource = reagent.source && reagent.source.model.id; // источник реагента, например некая банка

                if (condition.reagent == reagent.name
                  && (!condition.from || condition.from == reagentFrom || condition.from == reagentSource)
                  && (!condition.size || condition.size == reagent.size)
                  && (!condition.contain || equip.findReagentByName(condition.contain))
                ) {
                  return true;
                // проверяем исходные реагенты на условие, TODO: в исходных не верный [contain]
                } else if (condition_reagents(reagent.sourceReagents)) {
                  return true;
                }
              }
            }

            if (condition_reagents(equip.reagents)) {
              // проблема 2х условий в одном шаге, из банки в шпатель, из шпателя в банку, после выполнения 2го, 1е уже не выполняется
              // TODO: мб сохранять историю реагентов в шпателе?
              if (equip.simpleVerify) {
                this.$step.data('condition' + condition.index, true);
              }
              continue;
            } else {
              complete = -2;
              desc = "[" + condition.reagent + " to="+(condition.equip || condition.to)+" contain="+this.iReact.reagentsToString(equip.reagents)+"]";
              break;
            }
          }

          // status
          // <condition equip="..." status="..."/>
          if (condition.status) {
            var status = equip && equip.model.get("status") || equip.model.get("status"); // state - old support;
            if (status == condition.status) {	// TODO: в одном шаге проблема если несколько состояний на один объект ??
              // в строгом режиме сохраняем успешность шага
              // if (this.model.dataJSON.strict) {	// не только в строгом для состояния? потому как откройте спиртовку потом зажгите не работает
                this.$step.data('condition' + condition.index, true);
              // }
              continue;
            } else {
              complete = -6;
              break;
            }
          }

          if (condition.action) {
            if (equip.effects.indexOf(condition.action) != -1) {
                this.$step.data('condition' + condition.index, true); // TODO: применять с contain в не [strict] mode
              continue;
            } else {
              complete = -12;
              break;
            }
          }

          // attachto
          // <condition equip="..." attachto="..."/>
          if (condition.attachto) {
            // присоединить к полке
            if (condition.attachto.indexOf("shelf_") == 0) {
              if (equip.$shelf && equip.$shelf.data("level") == condition.attachto.replace('shelf_','')) {
                continue;
              } else {
                complete = -8.1;
                break;
              }
            }
            if (equip.$el.parents('#' + condition.attachto).length) {
              continue;
            } else {
              // console.log(condition);
              complete = -8;
              break;
            }
          }
        }

        // old support
        // setup
        if (condition.setup) {
          if (equip.setup != condition.setup) {
            complete = -5;
            break;
          } else {
            this.$step.data('condition' + condition.index, true);
          }
        }

        // old support
        // angle
        if (condition.angle) {
          if (!equip.checkAngle(condition.angle)) {
            complete = -7;
            break;
          } else {
            this.$step.data('condition' + condition.index, true);
          }
        }

        // old support - пока что отказываемся от поддержки этого тега, для strict тяжело реализовать (как демонстрация шагов)
        // <condition reaction="..."/>
        // if (condition.reaction) {
        //   if (condition.reaction != action.reaction) {
        //     complete = -9;
        //     break;
        //   } else {
        //     this.$step.data('condition' + i, true);
        //   }
        // }

        // old support
        // wait
        if (condition.wait !== null) {
          // Сброс
          if (condition.wait == 0 && equip.seconds != 0) {
            if (!this.listenTimer) this.listenTimer = this.listenTo(this.iReact, "timer", function (seconds) {
              if (equip.seconds == 0) {
                this.stopListening(this.iReact, "timer");
                this.listenTimer = null;
                this.verify();
              }
            });
            return;
          }

          var self = this,
              wait;

          if (equip) { // ждать таймер
            wait = function () {
              return condition.wait - equip.seconds;
            }
          } else { // глобально ждать
            var startedAt = this.$step.data('startedAt');
            wait = function () {
              return condition.wait - self.iReact.seconds + startedAt;
            }
          }
          if (wait() > 0) {
             if (!this.listenTimer) this.listenTimer = this.listenTo(this.iReact, "timer", function (seconds) {
               if (wait() <= 0) {
                 this.stopListening(this.iReact, "timer");
                 this.listenTimer = null;
                 this.verify();

                 // подсказка о выключении таймера
                 if (!this.strict) equip.hint({stop: true});
               }
       			 });
             complete = -10;
             break;
           }
           this.$step.data('condition' + condition.index, true);
        }

        // old support
        // zoom
        if (condition.zoom) {
          if (condition.zoom != action.zoom) {
            complete = -11;
            break;
          } else {
            this.$step.data('condition' + condition.index, true);
          }
        }

        if (condition.discharge && this.strict) {
          if (condition.discharge != action.discharge) {
            complete = -12;
            break;
          } else {
            this.$step.data('condition' + condition.index, true);
          }
        }

      }

      // console.log('verifyStep : ' + complete);

      if (complete > 0) {
        console.log('Next step activate!');
        this.activateNextConditions();
      } else {
        if (condition.index) {
          this.progress(condition.index/this.$step.data('data').count);
        }
        // console.log('#verify', action)
        console.log('Checking step.. failed. ['+complete+']; ' + desc); //, condition);
      }
  },

  progress: function (value) {
    var $svg = this.$step.find('svg');
    // if (value > 0) {
    //   $svg.show();
    // }
    // setTimeout(function () {
      $svg.find('path').attr("stroke-dashoffset", Math.round(629 - value*629));
    // }, 0);
  },

  activateNextStep: function () {
    var index = this.$step.index();

    this.$step.addClass('complete');
    this.$step = null;

    this.complete = true;

    this.activateStep(index + 1);
  },

  activateStep: function (index) {
		var $steps = this.stepsPane.$el.find('.step'),
				$step = $($steps[index]),
				data = $step.data('data');

		if (!$step.length) {
			this.iReact.notify(modelNS.lang('success_completed'), {delay: 6000});
			return;
		}

		$steps.removeClass('act');
		$step.addClass('act');

		$step.data('startedAt', this.iReact.seconds);

		this.$step = $step;
		this.complete = false;

		if (data) this.captionPane.$content.html(data.caption);

		this.trigger('activateStep', $step);

    // динамический скролл
    var iconPosition = $step.position().top,
        iconHeight = $step.height() + 8 + 2, // 8 - margin, 2-outset from bottom compensasion
        panelHeight = this.iReact.model.height*1;

    if ((iconPosition + iconHeight) > (panelHeight + this.scrollPosition)) {
      this.scrollPosition = iconPosition + iconHeight - panelHeight + this.scrollPosition;
      this.$stepsScroll.animate({
        marginTop: -this.scrollPosition
      });
    }

    this.progress(0);

    // цепной шаг и в строгом режиме чтобы задействовать механизм показа подсказок
		this.verify();

    this.backupStep();
	},

  backupStep: function () {
    var equipment = this.iReact.model.equipment,
        backup = [];
    for (var i=0; i<equipment.length; i++) {
      var id = equipment[i].id,
          $equip = this.iReact.$el.find('#'+id),
          equip = $equip.data('equip'),
          backupEquip = {
            equip: equip,
            left: $equip.css('left'),
            top: $equip.css('top'),
            appendTo: $equip.parent(),
            attachedTo: equip.attachedTo,
            reagents: []
          };

      // backup reagents
      for (var r=0; r<equip.reagents.length; r++) {
        var reagent = equip.reagents[r];
        backupEquip.reagents.push({
          reagent: reagent,
          size: reagent.size,
        });
      }

      backup.push(backupEquip);
    }

    this.backup = backup;
  },

  restoreStep: function () {
    for (var i=0; i<this.backup.length; i++) {
      var backupEquip = this.backup[i],
          equip = this.backup[i].equip;

      equip.$el.css({
        left: backupEquip.left,
        top: backupEquip.top
      }).appendTo(backupEquip.appendTo);

      equip.attachedTo = backupEquip.attachedTo;
      // shelf?

      equip.clear();
      for (var r=0; r<backupEquip.reagents.length; r++) {
        var backupReagent = backupEquip.reagents[r];
            backupReagent.reagent.size = backupReagent.size;
        equip.addReagent(backupReagent.reagent, {initialize: true}); // при initialize собьется size?
      }
    }

    this.progress(0);
  },

  // Валидация перед действием
  validate: function (equip, options) {
    if (!this.strict) {
			return true;
		}

		// если шаги закончились - то все действия отменены
		if (!this.$step) {
			return false;
		}

    // постепенное переимнование
    if (options.state) options.status = options.state;

    if (options.effect) options.action = options.effect;

    // debugger;
		// валидация по шагам <steps/>
		var conditions = this.getActiveConditions();

		for (var i=0; i<conditions.length; i++) {
			var condition = conditions[i],
					$equip = this.iReact.$('#' + (condition.equip)), // [type='+condition.equip+'] // ??	// .to - old support
					condition_equip = $equip.data('equip'),
          status = equip.model.get('status') || equip.model.get('state'), // state = old support
          from = options.from,
          reagent = null,
          source = null,  // источник сырья
          success = 0;

      // постепенное переимнование
      if (condition.state) condition.status = condition.state;

      // условия с эффектами пропускаем (mix) пока не реализовано
      // вообще action/effect пока не понятно насколько хорошая идея??
      // если понадобилось - использовать status. Status - состояние объекта, может быть более одного и у каждого свои условия (toggle closed/active и др)
      // но нужно продумать как хранить status потому как он сейчас - одиночный
      // может быть эффектов много может быть, а вот статус только один? И разные эффекты могут менять статус.
      // сюда же можно отнести и action/effect burn, по суте это не статус - но действие для смены статуса.
      // почему не нра action, потому что если действие выполнится зарание, то действие уже выполнено
      // а в ней еще не хватало реагентов, а если как эффект, то можно сбрасывать эффект каждый раз после изменения состава реагентов
      if (condition.action) { // тоже что и [action] (mix)
        if (condition.action == options.action) {
          success = 15; // ниже будет проверка на .from
        } else {
          continue;
        }
      }

      // угол
      if (condition.angle) {
        if (Math.abs(condition.angle-options.angle)<Math.abs(condition.angle-condition_equip.angle)) {
          success = 20; // ниже будет проверка на .from
        } else {
          continue;
        }
      }

      // таймер
      if (condition.wait !== null) {
        if (condition.wait == 0 && options.wait == 0) {
          return true;
        }
        // Сброс
        if (options.wait) {
          return condition.wait;
        } else {
          continue;
        }
      }

      if (condition.discharge) {
        if (condition.discharge == options.discharge) {
          return true;
        } else {
          continue;
        }
      }

      // от фласок крышки снимать можно без валидации
      if (equip.isNotStrict) {
        return true;
      }

      // TODO: переделать все на проверку condition а не options

			// переходим к проверке следующего условия если текущее не соответствует требованиям
			if (equip.model.get('id') != condition.equip
				&& equip.model.get('type') != condition.type) {
				continue;
			} else {
        success = 1;
      }

      if (condition.reagent) {
        reagent = from && from.findReagentByName(condition.reagent);
        if (!reagent) {
          continue;
        }
        // не привышаем size
        if (condition.size) {
          var containReagent = equip.findReagentByName(condition.reagent) || {size:0};
          // TODO: from.getReagentDose()
          if (containReagent.size + Math.min(from.dose, reagent ? reagent.size : Infinity) > condition.size) {
            continue;
          }
        }
      }

      if (condition.from) {
        source = reagent && reagent.source; // проверяем так же источник сырья
        if (!from || condition.from != from.model.id && condition.from != (source && source.model.id)) {
          // console.log(condition.from, options.from && options.from.model.get('id'))
          continue;
        } else {
          success = 2;
        }
      }

			if (condition.attachto) {
				if (!options.attachto || options.attachto != condition.attachto) {
					continue;
				} else {
          success = 3;
        }
			}

      // status validate
			// <condition equip=".." status=".."/>
			if (condition.status) {
        status = options.status || status;
        // hasEffect нужно для валидации dropInMe
        // status уже для самого эффекта

        if (options.from) { // перенети спички
          if (options.from.effect == condition.status ||
            // мб переделать в будущем, заточено под condition[active], matchbox[burn] == burner[burn]
            condition.status == "active" && options.from.effect == equip.effect
          ) {
            success = 4;
          } else {
            continue;
          }
        } else if (condition.status == status) {
          success = 4;
        } else {
          continue;
        }
        //
				// if ((!options.from || !options.from.hasEffect) && !status) {
				// 	continue;
				// } else if (condition.status == status) {
        //   success = 4;
        // } else {
        //   continue;
        // }
			}

      // <condition equip=".." attachto=".."/>
			if (condition.attachto) {
				if (condition.attachto == options.attachto
					&& (!condition.status || condition.status == status)  // <condition type="indicator" attachto="indicator_pack" status="12"/>
				) {
					success = 5;
				}
			}

      // попытка добавить реагент
      // if (options.reagent) {
      //   if (condition.reagent != options.reagent.name
      //     && condition.from != from.model.id // можно не указывать реагент а просто указать откуда брать
      //   ) {
      //     continue;
      //   }
      // }

      if (success) {
        return true;
      }

			// <condition equip=".." from=".." contain=".."/>
			if (options.from) {
				// if (from.hasEffect) return true; // на добавление condition отдельная валидация
				if ((!condition.from || from.model.get('id') == condition.from)	// check [from]
						&& (!condition.contain || equip.isReagent(condition.contain)) // check [contain] TODO: hasReagent? или все же должен быть length == 1
						&& (!condition.empty || equip.isEmpty())
				) {
					return true;
				}
			}

			// detach validate, action from equip
			if (options.detach) {
				if (condition.attachto) return true;
			}
		}
  },

  stepInfo: function ($step) {
    if (!this.$step || $step.index() > this.$step.index()) {
			// $('<div/>').html(modelNS.lang('make_current_step')).popup();
			this.iReact.notify(modelNS.lang('make_current_step'));
		} else if ($step.index() < this.$step.index()) {
			// $('<div/>').html(modelNS.lang('already_completed')).popup();
			this.iReact.notify(modelNS.lang('already_completed'));
		}
  }

});


modelNS.IReact.baseCanvas = modelNS.IReact.baseView = Backbone.View.extend({

	zoom: 1/CourseConfig.zoomScale, // becose of global zoom

	className: 'canvas-wrap',

	hasCanvas: true,

	initialize: function (options) {
		this.options = options || {};

		if (this.hasCanvas) {
			if (!this.options.properties) this.options.properties = {};
			this.$canvas = $('<canvas/>');
			this.stage = new createjs.Stage(this.$canvas[0]);
			this.stage.enableDOMEvents(false);

		} else {
			// this.$el.attr("part", "default");
		}

		// if (!options.type) console.log(options)

		// ??????????????
		// this.loadMovie({
		// 		src : "js/blur.js",
		// 		name : "blur",
		// 		open : false
		// });

		this.type = this.options.type;

		// анимация из которой произошел вызов
		this.initiator = this.options.initiator;

		// добавленные еффекты
		this.effects = {};

		// promise
		this.promise = $.when();
	},

	render: function ($parent) {
		var options = this.options;

		this.$parent = $parent;
		this.$el.appendTo($parent);

		if (this.hasCanvas) {
			this.$canvas.appendTo(this.$el);
		}

		if (this["react-object"]) this.$parent.attr("react-object", "");

		return this;
	},

	loadMovie: function (options) {
		var src = options.src,
				basePath = CourseConfig.templatePath + "externals/ireact/", // #11309
				fullPath = basePath + src;

		modelNS.FileManager.onReady(options.name, function () {
			this.onAnimationJsLoaded(options);
		}, this);

		modelNS.FileManager.loadFile({
			src: fullPath,
			name: options.name
		});
	},

	isLoaded : function (options) {
			return this.getLib(options.name);
	},

	getLib: function (name) {
			return modelNS.IReact.libs[name];// || window[name];	old support
	},

	onAnimationJsLoaded: function (options) {
		// if (this.playWhenReady) {
		// 	if (this.playWhenReady == options.name) this.open(options);
		// } else {

		// если еще до загрузки были вызван .open переопределяющий анимацию которую нужно отрисовать
		if (this.options.name) {
			if (this.options.name == options.name) {
				this.open(options);
			}
		} else {
			if (options.open || (options.open === undefined)) {
				this.open(options);	// TODO: remake all in .play ?
			}
		}

		// }
		// if (options.onload) options.onload.apply(self);
		// this.trigger("loaded", options.name);
	},

	open: function (options) {
		var self = this,
				name = options.name,
				lib = this.getLib(name),
				stage = options.stage || this.stage;

		if (!lib) {	// когда .refresh вызывается раньше чем загрузится .js файл
			return;
		}

		this.name = name;

		if (options.clear || options.clear === undefined) this.clearCanvas();

		// way in old libs color support, in wich not exists properties
		lib.color = options.color;

		if (lib.properties) {
			if (options.properties) for (var p in options.properties) lib.properties[p] = options.properties[p];
			lib.properties = $.extend(lib.properties,
				options.properties, {
					state: options.state, // состояние реагента
					status: options.status, // состояние оборудования
					color: options.color,
					type: this.type,
					paint: options.paint,
					// oil_film: null	// TEMP solution, clear filter after refresh
				});
		}

		var exportRoot = new lib[name]();

		this.exportRoot = exportRoot;
		this.clip =  exportRoot.clip || exportRoot;
		this.playClip = exportRoot.playClip || this.clip; // тот клип к которому применяется gotoAndPlay
		if (!exportRoot.frameClip) exportRoot.frameClip = this.playClip; // old support

		var x = options.x || lib.properties.x,
				y = options.y || lib.properties.y,
				rotation = options.rotation || lib.properties.rotation;
		if (x) this.clip.x = x;
		if (y) this.clip.y = y;
		if (rotation) this.clip.rotation = rotation;

		// good quality scale animation compensation
		this.scale = {
			x : (lib.properties.scale || options.scale || options.scaleX || ((options.width || this.width || lib.properties.width) / lib.properties.width)),
			y : (lib.properties.scale || options.scale || options.scaleY || ((options.height || this.height || lib.properties.height) / lib.properties.height))
		};

		this.properties = lib.properties;

		this.setZoom(this.initiator && this.initiator.zoom || this.zoom);

		stage.addChild(exportRoot);
		// this.stage.tick();	// ?? is work?? trying make faster change canvas
		// exportRoot.draw();

		// loop
		if (!options.loop) exportRoot.loop = false;

		// pause
		if (options.pause || options.pause === undefined) this.pause();

		if (options.at !== undefined) {
			this.clip.gotoAndPlay (options.at);
			this.exportRoot.gotoAndPlay (options.at);
		}

		// playTimeout
		// if (options.playTimeout) {
		// 	setTimeout(function () {
		// 		exportRoot.framerate = null;	// cant use .play(); bug with 2 animations played same time fill + blur
		// 	}, options.playTimeout)
		// }

		// how long play ?? TODO: move to .play ?
		// if (options.playTime) {
		// 	self.playTime = setTimeout (function () {
		// 		self.onMovieEnd(options);
		// 	}, (options.playTimeout||0)+options.playTime);
		// }

		//Registers the "tick" event listener.
		createjs.Ticker.setFPS(lib.properties.fps);
		// createjs.Ticker.addEventListener("tick", this.stage);
		// initial update
		stage.update();

		if (options.at !== undefined) {	// openFrame
			this.playClip.gotoAndPlay (options.at);
			this.exportRoot.gotoAndPlay (options.at);	// ?
			this.update();
		}

		this.playTo = options.duration || options.to;

		// TODO: here posible add reverse?
		exportRoot.on("tick", function (e) {
			var frameClip = e.currentTarget;
			if (frameClip.frameClip) frameClip = frameClip.frameClip;

			if (!options.playTime) {
				if (frameClip.currentFrame >= (self.playTo || exportRoot.duration)) {
					self.onMovieEnd(options);
				}
			}
			// console.log(name, frameClip.currentFrame, self.playTo)
		});

		if (options.from || options.from === 0) {
			this.play({from:options.from, to:options.to});
		}

		this.$canvas.addClass(name + '-canvas');

		this.options = options;

		this.trigger("opened");
	},

	pause : function ()
	{
		this.exportRoot.framerate = 0;
	},

	clearCanvas: function () {
			if (this.exportRoot) {
				this.exportRoot.gotoAndPlay (0);
				// this.movie.exportRoot.stop();
				this.pause();
			}
			if (this.stage) {
				this.stage.clear();
				this.stage.removeAllChildren();
				createjs.Ticker.removeEventListener("tick", this.stage);
			}
	},

	onMovieEnd: function (options) {
		console.log("onMovieEnd");

		this.pause();
		options.onMovieEnd && options.onMovieEnd.apply(this);

		if (this.onMovieEndOnce) {
			this.onMovieEndOnce.apply(this);
			this.onMovieEndOnce = null;
		}

		createjs.Ticker.removeEventListener("tick", this.stage);

		this.trigger("played");

		// отыграла то показываем только конечное состояние
		// используется для glass[state=cream] если реакция
		this.options.at = this.options.to;
		this.options.from = null;
		this.options.to = null;

		if (this.autoDestroy) this.destroy();
	},

	zoomIn: function () {
		this.setZoom(0.2);
		for (var f in this.effects) {
			this.effects[f].zoomIn();
		}
	},

	zoomOut: function () {
		this.setZoom(1/CourseConfig.zoomScale);
		for (var f in this.effects) {
			this.effects[f].zoomOut();
		}
	},

	setZoom: function (zoom) {
		if (!this.scale) {
			console.warn(this.options.type + " haven't scale. Posible haven't canvas.");
			return;
		}
		this.zoom = zoom;
		this.stage.scaleX = this.scale.x / zoom;
		this.stage.scaleY = this.scale.y / zoom;
		this.$canvas[0].width = this.stage.scaleX * this.properties.width;
		this.$canvas[0].height = this.stage.scaleY * this.properties.height;
		// this.$canvas.css('zoom', zoom);	// in Chrome position of reagents bug
		this.$canvas.css({'transform':'scale(' + zoom + ')'});
		this.update();
	},

	// OLD
	// react: function (options)
	// {
	// 	if (options.type == 'receiver') {
	// 		if (options.reaction && options.reaction.fume) {
	// 			this.fume();
	// 		}
	// 	}
	// 	return this.getReact(options).apply(this, [options.$reagent, options.reagent, options]);	// options.product если реакция еще не произошла, то не продукт передаем (как с установкой где надо подогреть)
	// },

	isSupport: function (options)
	{
		return this.getReact(options);
	},

	update: function () {
		this.stage.tickOnUpdate = false;
		this.stage.update();
		this.stage.tickOnUpdate = true;
	},

	// подготовить настройки, но не вызывать .open
	prepare: function (options) {
		if (!options) options = {};
		options.properties = $.extend(this.options.properties, options.properties); // apply properties
		this.options = $.extend(this.options, options);
	},

	// если меняется какоето свойство, то нужно переоткрывать
	redraw: function (options) {
		this.prepare(options);
		this.open(this.options);
	},

	// OLD support
	refresh: function (options) {
		return this.redraw(options);
	},

	play: function (options) {
		var self = this;

		if (!options) options = this.default;

		if (options.wait) {
			options.delay = options.wait;
			delete options.wait;
		}

		if (options.delay) {
			return setTimeout(function () {
				delete options.delay;
				self.play(options);
			}, options.delay);
		}

		if (options.refresh) {
			this.refresh(options);
			// console.log(options)
		}

		if (options.name) {
			if (!this.getLib(options.name)) {
				// сохраняем опции
				options.properties = $.extend(this.options.properties, options.properties);
				this.options = $.extend(this.options, options);

				// и ждем пока загрузится файл
				return;
			}
			this.open(options);
		}

		// if (options.color && options.color !=)

		// if (options.properties) {
		//
		// }

		if (options.x) this.clip.x = options.x;
		if (options.y) this.clip.y = options.y;

		if (!options.from && !options.to) {
			options.from = 0;
			options.to = this.clip.duration;
		}

		if (options) {
			this.playTo = options.to;
			if (options.from !== undefined) {
				this.playClip.gotoAndPlay(options.from);
				this.exportRoot.gotoAndPlay(options.from);	// ?? old support
				// this.stage.update();
			}
			if (options.complete) this.onMovieEndOnce = options.complete;	// TODO: add this movie end to clip ?
		}
		if (this.playTo) {
			this.exportRoot.framerate = null;
			createjs.Ticker.addEventListener("tick", this.stage);
		} else {
			this.update();
			this.trigger("played");
		}
	},

	replay: function (options)
	{
		$.extend(this.options.properties, options && options.properties); // apply properties
		this.play($.extend(this.options, options));
	},

	colorize: function (options) {
		return IReact.ViewUtils.colorize(options, this);
	},

	rotate: function () {},

	destroy: function () {
		this.clearCanvas();
		this.$el.remove();
	},


	setEffect: function (name, options) {
		var initiator = this.initiator || this,
				self = this;
		if (!options) {
			if (options === false && this.effects[name]) {
				this.effects[name].hide();
			}
			return;
		}

		if (!this.effects[name]) {
			this.promise = this.promise.then(function () {
				self.effects[name] = new modelNS.IReact[name]($.extend(options, {
					type: initiator.type,	// тип берется из вызываемого оборудования
					initiator: initiator,	// масштаб берется из вызываемого оборудования
				})).render(initiator.$parent);

				return self.effects[name].promise;
			});
		} else {
			this.effects[name].show(options);
			this.promise = this.promise.then(function () {
				return self.effects[name].promise;
			});
		}
	},

	// Пламя общее
	flame: function (options) {
		return this.setEffect('flame', options);
	},

	// Налет не относится к реагенту
	// TODO: отнести к реагенту, но тогда:
	// - пробирка до конца не очищается? только через мойку?
	// - налет не дублируется в другую пробирку?
	plaque: function (options) {
		return this.setEffect('plaque', options);
	},


});


IReact.ViewUtils = {
	colorize: function (options, context) {
		if (!context.$colorize) context.$colorize = $('<div/>');

		var setColor = options.colorize || context.setColor;

		return context.$colorize.finish().delay(options.delay || 0).css({
			backgroundColor:colorToString(options.fromColor)
		}).animate({
			backgroundColor:colorToString(options.toColor)
		}, {
			duration: options.duration || 3000,
			progress: function(animation, progress, msRemaining) {
				setColor.apply(context, [this.style.backgroundColor, progress]);
			},
			// complete: function ()
			// {
			// 	console.log('COMPLETE_COLORIZE')
			// }
		});
	},

	rotate: function (options) {
		var radius = options.radius,
				angle = options.angle,
				degree = (angle-90) * Math.PI / 180;

		var x1 = radius * Math.cos(degree),
				y1 = radius * Math.sin(degree);

		return {left: options.centerX + x1, top: options.centerY + y1};
	},
}

// расстворение (размытые кляксы)
modelNS.IReact.effectCanvas = modelNS.IReact.baseCanvas.extend({

  effectTime: 400,

  className: 'canvas-wrap effect',

  config: {},

  fadeOutTime: 1000,

  initialize: function (options) {
    modelNS.IReact.animation.prototype.initialize.apply(this, arguments);
    this.setOptions(options);

    // ????
    this.promise = $({}).delay(this.effectTime).promise();

    // на сколько понимаю что-бы легче потом найти было при удалении
    // стоит заменить может название аттрибута что бы при поиске не кофликтовало когда демонстрация ответа??
    if (options && options.reagent) {
      this.$el.attr('reagent', options.reagent);
    }
  },

  setOptions: function () {

  },

  show: function (options) {
    this.setOptions(options);
    this.$el.show();
    this.promise = $({}).delay(this.effectTime).promise();
  },

  hide: function () {
    // complete: function () {$(this).remove()}  // ??? вроде как вернуть становится проблемно эффект
    return this.$el.fadeOut(this.fadeOutTime).promise();
  },
});


modelNS.IReact.animation = modelNS.IReact.equipCanvas = modelNS.IReact.equipView = modelNS.IReact.baseView.extend({

	// визуальные составлющие, представляются отдельными канвасами
	visualParts: [],

	// высота реагента для полной емкости
	fullHeight: 100,

	initialize: function (options) {
		modelNS.IReact.baseView.prototype.initialize.apply(this, arguments);

		// если объект состоит из нескольких частей (канвасов)
		this.parts = {};

		this.reagents = {};
	},

	onAnimationJsLoaded: function (options) {
		// пока файл грузился, некоторые значения установленных опций могли поменяться
		return modelNS.IReact.baseView.prototype.onAnimationJsLoaded.apply(this, [$.extend(options, {
			status: this.options.status,
			// properties: this.options.properties // ?? не перебьет ли текущим?
		})]);
	},

	render: function () {
		modelNS.IReact.baseView.prototype.render.apply(this, arguments);

		var options = this.options,
				part = options.properties && options.properties.part;

		if (this.hasCanvas) {

			if (part) {
				this.$el.attr("part", part);
			} else {
				this.$el.attr("part", "default");
			}

			// визуальные составлющие, представляются отдельными канвасами
			if (this.visualParts.length) {
				for (var i=0; i<this.visualParts.length; i++) {
					this.renderPart(this.visualParts[i]);
				}
			}
		}

		this.$reagentParent = this.$parent;

		return this;
	},

	renderPart: function (options) {
		var part = options.part,
				name = options.name,
				$parent = options.parent ? this.$parent.find(options.parent) : this.$parent;

		this.parts[part] = new modelNS.IReact.animation($.extend(options, {
			properties: {part:part},
			className: "canvas-wrap " + name + "_" + part
		})).render($parent);

		modelNS.FileManager.onReady(name, function () {
			this.drawParts();
		}, this);
	},

	drawParts: function () {
		for (var p in this.parts) {
			this.parts[p].refresh();
		}
	},

	zoomIn: function () {
		modelNS.IReact.baseView.prototype.zoomIn.apply(this, arguments);

		for (var p in this.parts) {
			this.parts[p].zoomIn();
		}

		for (var r in this.reagents) {
			if (this.reagents[r].hasCanvas) {
				this.reagents[r].zoomIn();
			}
		}
	},

	zoomOut: function () {
		modelNS.IReact.baseView.prototype.zoomOut.apply(this, arguments);

		for (var p in this.parts) {
			this.parts[p].zoomOut();
		}

		for (var r in this.reagents) {
			if (this.reagents[r].hasCanvas) {
				this.reagents[r].zoomOut();
			}
		}
	},

	setAngle: function (angle) {
		this.angle = angle;
		for (var r in this.reagents) {
			this.reagents[r].setAngle(angle);
		}
	},

	// устаревшее? переделать?
	// на данный момент это чипсы (chips) и капля индикатор
	create_reagent: function (reagent) {
		var rgb = colorToArray(reagent.color).splice(0,3),
				color = 'rgb('+rgb.join(',')+')';

		// TODO: alfa ?

		return $('<div class="reagent"/>')
			.attr({
				name: reagent.name,
				state: reagent.state,
			})
			.css({
				// backgroundColor:reagentInfo.color,
				color: color,
				borderBottomColor: color,
			})
			.appendTo(this.$el);
	},

	animate_slow_remove: function (reagent) {
		var fadeOutTime = 1000,
				self = this;

		return $.when().then(function () {
			var $reagent = self.$parent.find('.reagent[state="'+reagent.state+'"]');
			if ($reagent.length) {
				$reagent.fadeOut(fadeOutTime, function () {
					$(this).remove();
				});
				return $({}).delay(fadeOutTime).promise();
			}
		});

		// return this.promise; // не правильно вешать на this.promise происходит зацикливание?
	},

	animate_remove_chips: function (reagent, options) {
		return this.animate_slow_remove(reagent);
	},

	animate_receive_chips: function (reagent, options) {
		var self = this;

		this.promise = this.promise.then(function () {
				return $({}).delay(400).promise();
			}).then(function () {
				self.create_reagent(reagent);
				return $({}).delay(400).promise();
			});

		return this.promise;
	},

	animate_receive_gas: function (reagent, options) {
		var delay = $({}).delay(800);

		// просто задержка что-бы как правило показать анимацию
		this.promise = this.promise.then(function () {
			return delay.promise();
		});

		this.addReagentView(reagent, options, modelNS.IReact.gasReagent);

		return this.promise;
	},

	// реагент который занимает больше всего места
	mostReagent: function (reagent, options) {
		var reagents = options.reagents,
				most = reagent;
		if (reagents) {
		  for (var i=0; i<reagents.length; i++) {
		    if (reagents[i].state == reagent.state) {
		      if (most.size < reagents[i].size) {
		        most = reagents[i];
		      }
		    }
		  }
		}
		return most;
	},

	receiveReagent: function (reagent, options) {
		if (!options) options = {};

		var promise = options.promise || $.when(),
				self = this;

		var animate = this['animate_receive_' + reagent.state] || this['react' + reagent.state];

		if (animate) promise = promise.then(function () {
			return animate.apply(self, [reagent, options]);
		});

		this.promise = promise;

		this.promise = this.promise.then(function () {
			var reagentView = self.reagents[reagent.state];
			if (reagentView) {
				return reagentView.startEffects(options);
			}
		});

		// if (reagent.state == "liquid") {	// дым нужен для чипсов (горение пластика)
			// запускаем всегда, на тот случай если это отключение эффекта

			// if (reagent.sludge) {
			// 	promise = this.sludge($.extend(reagent.sludge, {promise:promise}));
			// }
		// }

		if (options.reaction) {
			var plaque = options.reaction.plaque;
			if (plaque) this.plaque(plaque ? $.extend({size: options.full}, plaque) : false);
			// if (reaction.sludge) promise = receiver.animation.sludge($.extend(reaction.sludge, {promise:promise}));
		}

		return this.promise;
	},

	// Вместо удаления, отмечаем реагент как готовый к трансформации
	// transformReagent: function (reagent, options) {
	// 	var promise = options.promise || $.when(),
	// 			self = this;
	//
	// 	this.reagents[options.transform] = this.reagents[reagent.name];
	// 	delete this.reagents[reagent.name];
	// },

	// удаление реагента
	removeReagent: function (reagent, options) {
		if (!options) options = {};

		var promise = this.promise,
				self = this;

		var animate = this['animate_remove_' + reagent.state];

		if (animate) {
			promise = promise.then(function () {
				return animate.apply(self, [reagent, options]);
			});
		} else {
			promise = promise.then(function () {
				self.$parent.find('.reagent[reagent="'+reagent.name+'"]').remove();
			});
		}

		promise = promise.then(function () {
			// если инизцилизировался прямо в пробирке тогда эффектов считается нет
			if (!self.reagents[reagent.state]) {
				return;
			}
			var promise = self.reagents[reagent.state].removeEffects();
			delete self.reagents[reagent.state];
			return promise;
		});

		return this.promise = promise;
	},


	// очистка
	clearReagents: function () {
		this.$el.find('.reagent').remove();
	},

	// TODO: тут анимироваться будет процесс передачи реакгента
	// переливание из колбы и тд
	sendReagent: function (reagent, options) {
		if (!options) options = {};

		var promise = options.promise || $.when(),
				self = this;

		var animate = this['animate_send_' + reagent.state];

		if (animate) promise = promise.then(function () {
			return animate.apply(self, [reagent, options]);
		});

		this.promise = promise;

		return this.promise;
	},

	// инициализация реагента в емкости (пока что только для кристалов)
	initReagent: function (reagent, options) {
		if (!options) options = {};

		var animate = this['animate_init_' + reagent.state];
		if (animate) animate.apply(this, [reagent, options]);
	},

	// Жидкость
	animate_send_liquid: function (reagent, options) {
		return this.animate_receive_liquid(reagent, options)
	},

	animate_receive_liquid: function (reagent, options) {
		return this.addCylinderReagent(reagent, options);
	},

	animate_init_liquid: function (reagent, options) {
		return this.addCylinderReagent(reagent, options);
	},

	// Порошок
	animate_receive_powder: function (reagent, options) {
		return this.addCylinderReagent(reagent, options);
	},

	animate_remove_powder: function (reagent, options) {
		return this.animate_slow_remove(reagent);
	},

	animate_init_powder: function (reagent, options) {
		return this.addCylinderReagent(reagent, $.extend(options, {init:1}));
	},


	// Комки
	animate_remove_balls: function (reagent, options) {
		return this.animate_slow_remove(reagent);
	},

	animate_init_balls: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	animate_receive_balls: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	// Кристалы
	animate_remove_crystal: function (reagent, options) {
		return this.animate_slow_remove(reagent);
	},

	animate_init_crystal: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	animate_receive_crystal: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	// Волокна
	animate_remove_fiber: function (reagent, options) {
		return this.animate_slow_remove(reagent);
	},

	animate_init_fiber: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	animate_receive_fiber: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	// Проволка
	animate_remove_wirew: function (reagent, options) {
		return this.animate_slow_remove(reagent);
	},

	animate_init_wirew: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	animate_receive_wirew: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	// Гранулы
	animate_remove_granules: function (reagent, options) {
		return this.animate_slow_remove(reagent);
	},

	animate_init_granules: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	animate_receive_granules: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	addReagentView: function (reagent, options, reagentView) {
		if (!options) options = {};

		// каждое состояние имеет свое отображение, зависящее от набора реагентов
		var state = reagent.state;

		if (!this.reagents[state]) {
			this.reagents[state] = new reagentView({
				reagent: reagent,
				initiator: this,
				fullHeight: this.fullHeight,
				angle: this.angle,
			}).render(this.$reagentParent);
		} else {
			// для применения эффектов (transform ??)
			this.reagents[state].reagent = reagent;
		}

		return this.reagents[state].draw(reagent, options);
	},

	// реагент ввиде цилиндра
	addCylinderReagent: function (reagent, options) {
		return this.addReagentView(reagent, options, modelNS.IReact.cylinderReagent);
	},

	// самый простой вид реагента, контейнер в контейнере
	addSimpleReagent: function (reagent, options) {
		this.addReagentView(reagent, options, modelNS.IReact.simpleReagent);
	},

	// реагент ввиде круга
	addCircleReagent: function (reagent, options) {
		this.addReagentView(reagent, options, modelNS.IReact.circleReagent);
	},

	// уникальный вид реагента, в зависимости от состояния отрисованый на канвасе
	addCanvasReagent: function (reagent, options) {
		var canvasView = modelNS.IReact[reagent.state] || modelNS.IReact.ireagent;
		return this.addReagentView(reagent, options, canvasView);
	},

	discharge: function () {
		this.clear();
	},

	clear: function () {
		// this.refresh({color: null});	// работает только для пипетки но для остального устарело
	}

});

// Интерфейс Реагента
modelNS.IReact.reagentCanvas =
modelNS.IReact.reagent_view =
modelNS.IReact.ireagent = modelNS.IReact.baseCanvas.extend({

	className: 'reagent',

	initialize: function(options) {

		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.$el.attr('state', options.reagent.state);

		this.reagent = options.reagent;
		this.angle = options.angle;
		this.fullHeight = options.fullHeight;
	},

	// метод вызывается когда меняется угол наклона
	setAngle: function () {},

	// метод вызывается для отрисовки реагента
	draw: function () {},

	// тут собрать нужно будет информацию
	// config: function (reagents) {
	//
	// },

	// OLD
	// transform: function (reagent) {
  //   this.$el.attr({
  //     reagent: reagent.name,
  //   });
	// 	this.reagent = reagent;
  // },

	// нельзя использовать для канвасных реагентов, метод уже используется
	// update: function (reagent, options) {
	//
	// },

	startEffects: function (options) {
		var reagent = this.reagent;

		if (!reagent) {
			return;
		}

		this.gasup(reagent.gasup ? $.extend({full: options.full, fullHeight: this.fullHeight}, reagent.gasup) : false);
		this.minigasup(reagent.minigasup ? $.extend({size: options.full}, reagent.minigasup) : false);
		this.gasupslow(reagent.gasupslow ? $.extend({size: options.full}, reagent.gasupslow) : false);
		this.blur(reagent.blur ? $.extend({size: options.full}, reagent.blur) : false);
		this.foam(reagent.foam ? $.extend({size: options.full}, reagent.foam) : false);
		this.sludge(reagent.sludge ? $.extend({size: options.full}, reagent.sludge) : false);
		this.fume(reagent.fume ? $.extend({size: options.full}, reagent.fume) : false);
		this.oil_film(reagent.oil_film ? $.extend({size: options.full}, reagent.oil_film) : false);
		this.faraon(reagent.faraon);

		return this.promise;
	},

	// искра
	spark: function () {
		new modelNS.IReact.spark().render(this.$parent);
	},

	// газ - пузыри
	gasup: function (options) {
		return this.setEffect('gasup', options);
	},

	// газ - пузыри маленькие
	minigasup: function (options) {
		return this.setEffect('minigasup', options);
	},

	// газ - пузыри не двигаются
	gasupslow: function (options) {
		return this.setEffect('gasupslow', options);
	},

	// Эмульсия
	blur: function (options) {
		return this.setEffect('blur', options);
	},

	// Пена сверху (кляксы с размытием)
	foam: function (options) {
		return this.setEffect('foam', options);
	},

	// Выпадение осадка
	sludge: function (options) {
		return this.setEffect('sludge', options);
	},

	// Дым
	fume: function (options) {
		return this.setEffect('fume', options);
	},

	// Пенообразный столб вещества (змея фараона)
	faraon: function (options) {
		return this.setEffect('faraon', options);
	},

	// Пленка
	oil_film: function (options) {},

	removeEffects: function () {
		var fadeOutTime = 1000,
				reagent = this.reagent.name,
				self = this;

		if (!$.isEmptyObject(self.effects)) {
			return $.when().then(function () {
				// TODO: оптимизировать на самый долгий эффект, некоторые эффекты могут отключаться быстро
				for (var e in self.effects) {
					var effect = self.effects[e];
					effect.hide();
				}
				// TODO: when для всех эффектов?
				return $({}).delay(fadeOutTime).promise();
			});
		}
	},

	setEffect: function (name, options) {
		if (options) options = $.extend({}, options, {reagent:this.reagent.name});	// options может быть равен true
		return modelNS.IReact.animation.prototype.setEffect.apply(this, [name, options]);
	},

});

modelNS.IReact.hose = modelNS.IReact.animation.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name : "hose",
			src : "js/hose.js",
			at : 0
		});

		this.loadMovie({
			name : "hose_in",
			src : "js/hose_in.js",
			open:false
		});
	},

	inset: function ()
	{
		this.play({name:"hose_in"});
	},
 
	outset: function ()
	{
		this.play({name:"hose"});
	}

});

/* Ложка для сжигания веществ */
IReact.equips.burning_spoon = IReact.EquipView.extend({
    isTool : true,
    toolType : ['powder', 'liquid'], // что можно взять
    repositoryType : ['granules'], // что можно положить
});

/* Крышка */
IReact.equips.cap = IReact.EquipView.extend({
  isCap: true,
  zIndexInShelf: 500,

  attach: function () {
    IReact.EquipView.prototype.attach.apply(this, arguments);
    if (this.attachedTo) {
      this.attachedTo.closeCap();
    }
  },

  detaching: function () {
    if (this.attachedTo) {
      this.attachedTo.openCap();
    }

    return IReact.EquipView.prototype.detaching.apply(this, arguments);
  }
});

// Интерфейс емкости для реагентов
IReact.equips.capacity = IReact.equips.glassware = IReact.EquipView.extend({

  className: 'equip glassware',

  // теплопроводность, не настоящая, просто коэффициент кол-во градусов за секунду
  transcalency: (100-20)/10,	// 80С за 10 секунд

  zoomer: true,

  // можно ли перемешивать таская мышкой
  mixableByDrag: true,

  // размерность емкости
  maxSize: 200,
	minSize: 0,

  // сколько ml по умолчанию передаст
  dose: 40,

  // сколько ml максимально примет за раз
  maxdose: Infinity,

  // по умолчанию содержит реагента (безмерный стакан)
  size: Infinity,

  // способность элемента принимать другие элементы (зависит от поддержки, и.. если это стакан то надо как-то определять что в него нелья?)
  isReceiver: false,

  // способность что-то передовать, по суте это есть тип glassware ?
  isSender: true,

  // длинная ли подпись у этой емкости
  isLongLabel: true,

  // включено ли событие перетаскивания
	dragTriggerEnabled: true,

  // может ли газ улетучиваться
  canGasEscape: true,

  // maxSize:, // максимально можно вместить
  // minSize:, // используется в пробирке, вроде для расчетов

  initialize: function () {
    IReact.EquipView.prototype.initialize.apply(this, arguments);

    // <equip maxdose=".."/> сколько ml максимально примет за раз
    var maxdose = this.model.get("maxdose");
    if (maxdose) this.maxdose = maxdose;

    this.on("equipAttached", function (equip) {
      if (equip.isCap) {
        this.closeCap(equip);
      }
    }, this);

    this.on("equipDetached", function (equip) {
      if (equip.isCap) {
        this.openCap();
      }
    }, this);
  },

  render: function () {
    IReact.EquipView.prototype.render.apply(this, arguments);

    var self = this,
        label = this.model.get('label'),
        reagent = this.model.get('reagent');

    // check mixing
    // this.$el.draggable({
    //   drag: function (event, ui) {return self.onDrag(event, ui)}
    // });

    // this.$el.attr('reagent', reagent);
    this.$el.append("<div class='react'/>"); // ???

    if (!this.isReceiver) {
      this.$el.attr('receiver', '');
    }

    if (label && this.isLongLabel) {
      // TODO: только если на полке? иначе в стенде поверх становится ножки
      this.$el.mouseover(function () {self.up(true)}); // надпись может закрыться другими банками
    }

    // flask
    if (this.hasCap) {
      this.renderCap();
      // this.closeCap();
    }

    return this;
  },

  renderCap: function () {
    var cap_type = this.model.get('type') + '_cap';
    this.cap = new IReact.equips[cap_type]({
      model: new IReact.EquipModel({
        type: cap_type,
				// capfor: this,
        // id: this.model.get('id') + '_cap',
      }),
      iReact: this.iReact,
      parent: this.$parent
    }).render();

    this.allowAttach = $.extend({}, this.allowAttach); // общий конфиг не переписываем
    this.allowAttach[cap_type] = true;

    this.cap.attachTo(this);

    this.closeCap();
  },

  onDrag: function (event, ui) {
    IReact.EquipView.prototype.onDrag.apply(this, arguments);

    var self = this;
    // оптимизация в основном для ie9 что бы не часто вызывался расчет
    if (!this.dragListenerRequested) {
      this.dragListenerRequested = true;
      requestAnimationFrame(function () {
        self.dragListener(event, ui);
      });
    }
  },

  dragListener: function (event, ui) {
    this.mixing(ui);
    if (event) {
      this.detectMouseIntersect(event, ui);
    }
    this.autoUnTouch();
    this.dragListenerRequested = false;
  },

  // toggleCap : function ()  // old, now cap openinng by mouse drag
  // {
  //   if (this.isClosed()) {
  //     this.openCap();
  //   } else {
  //     this.closeCap();
  //   }
  //
  //   this.checkReaction(this.lastReaction);
  // },

  closeCap: function (cap) {
    this.$el.addClass('closed');
    this.setStatus('closed');
    if (cap) this.cap = cap;
    // this.animation.refresh({properties:{cap:true}});
  },

  openCap: function () {
    if (this.cap) {
      this.$el.removeClass('closed');
      this.setStatus('opened');
      this.linkedCap = this.cap;
      this.cap = null;
      // this.animation.refresh({properties:{cap:false}});
    }
  },


  dragStart: function (event, ui) {
    IReact.EquipView.prototype.dragStart.apply(this, arguments);
    if (this.mixableByDrag) this.startMixing(ui);
  },

  startMixing : function (ui) {
    if (!this.isReceiver || !this.reagents.length) {
      return;
    }

    if (this.Progress) {
      return;
    }

    this.Progress = new modelNS.ProgressCircle({
      parent:this.$el,
      color:"rgb(91,202,229)",
      radius:13,
      lineWidth:1
    })
    .render();

    this.Progress.$el.addClass("mix-progress");

    this.Progress.once("done", function () {
      this.mixed();
    }, this);

    this.Progress.on("progress", function (val) {
      this.Progress.$el.css('opacity', val);
    }, this);

    this.fromPosition = ui ? ui.position : this.$el.position();

    // this.dragStartTime = Date.now();
    // this.dragDistance = 0;
    // this.startPosition = this.mixingPosition = {left:ui.position.left, top:ui.position.top};
  },

  mixed: function () {
    this.iReact.notify(modelNS.lang("mixed"), {duration:1000});
    this.stopMixing();

    if (this.attachedTo) {
      this.once("attached", function () {
        this.addEffect("mix");
      }, this);
    } else {
      this.addEffect("mix");
    }
  },

  dragStop: function (event, ui) {
    IReact.EquipView.prototype.dragStop.apply(this, arguments);

    this.stopMixing(ui);
  },

  stopMixing: function (ui) {
    if (this.Progress) {
      this.Progress.remove();
      this.Progress = null;
    }
  },

  mixing: function (ui) {
    if (!this.isReceiver || !this.reagents.length) {
      return;
    }

    var position = ui ? ui.position : this.position(),
        left = position.left,
        top = position.top;

    if (this.Progress) {
      var value = Math.abs(left-this.fromPosition.left) + Math.abs(top-this.fromPosition.top);
      this.fromPosition = {left:left, top:top};

      this.Progress.progress(this.Progress.value+value*0.001);
    }
  },

  distance: function (from, to) {
    var x1 = from.left,
        y1 = from.top,
        x2 = to.left,
        y2 = to.top,
        a = x1 - x2,
        b = y1 - y2;

    return Math.sqrt( a*a + b*b );
  },

  // onDrop: function ($drop) {
	// 	this.lastDropped = $drop; // ???

    // var equip = $drop.data("equip");
    // if (equip) {  // в стенде если вращать то иногда получается что нет эквипа, наверно когда вращающийся элемент создает событие
    //   if (equip.model.get('type') == this.model.get('type') + '_cap') {
    //     if (!this.cap) equip.attachTo(this);
    //     return;
    //   }
    // }

  //   IReact.EquipView.prototype.onDrop.apply(this, arguments);
  // },

  autoUnTouch: function () {
    if (this.touchEquip && !this.touchEquip.$el.hasClass('ui-droppable-hover')) this.touchTarget(null);
  },

  // так как объект часто большой
  // то при наведении на несколько пробирок
  // помечаем ту на которой мышка
  detectMouseIntersect: function (event, ui) {
    var self = this;
    this.iReact.$el.find('.ui-droppable-hover.equip[receiver]').each(function () {
      var $receiver = $(this);
      if (self.isEventIntersect($receiver, event)) {
        self.onMouseIntersect($receiver.data('equip'));
        return false;
      }
    });
  },

  isEventIntersect: function ($drop, event) {
    return $.ui.intersect( this.$el.draggable('instance'), $drop.droppable('instance'), "pointer", event );
  },

  onMouseIntersect: function (equip) {
    this.touchTarget(equip);
  },

  onDragOver: function (equip) {
    IReact.EquipView.prototype.onDragOver.apply(this, arguments);

    // определяем цель взаимодействия
    if (!this.touchEquip && equip.isReceiver) this.touchTarget(equip);
  },

  // onDragOut: function (equip) {
  //   IReact.EquipView.prototype.onDragOut.apply(this, arguments);
  //
  //   // отмена индикации цели взаимодействия
  //   if (this.touchEquip == equip) {
  //     var equip = this.iReact.$el.find('.ui-droppable-hover.equip[receiver]').data('equip');
  //     this.touchTarget(equip);
  //   }
  // }


});

/* Инструмент */
IReact.equips.tool = IReact.EquipView.extend({
    isTool: true,
    size: 1,
    dose: 1,

    // какие типы реагентов поддерживает
    toolType: '',

    // ???
    repositoryType: '',

    // увеличивать ли если добавляется реагент
    hasZoomWhenReagentAdd: false,

    // дополнительный элемент идентифицирующий контакт инструмента
    hasOutput: false,

    // из каких типов оборудования инструмент может брать реагент
    supportedEquips: "",

    // селектор по элементам которые могут служить целью данного инструмента
    intersectSuccess: "[receiver]",

    // после использования отправляется в лоток для использованого оборудования
    disposable: false,

    initialize: function () {
      IReact.EquipView.prototype.initialize.apply(this, arguments);

      this.generateIntersectSuccess();

      var disposable = this.model.get("disposable");
      if (disposable !== undefined) this.disposable = disposable;
    },

    generateIntersectSuccess: function () {
      var selectors = [],
          intersectSuccess = this.intersectSuccess.replace(/\, /gi, ',').split(",");
      for (var i=0; i<intersectSuccess.length; i++) {
        selectors.push(".ui-droppable-hover.equip" + intersectSuccess[i]);
      }
      this._intersectSuccess = selectors.join(",");
    },

    render: function () {
      var self = this;
      IReact.EquipView.prototype.render.apply(this, arguments);

      if (this.hasOutput) {
        this.$output = $('<div class="output"/>').appendTo(this.$el);
        this.$el.draggable({
          drag: function (event, ui) {
            self.onDrag(event, ui);
          }
        });
        this.output = $.extend(this.$output.position(), { // caching
          width: this.$output.width(),
          height: this.$output.height(),
        });
      }

      return this;
    },

    // для инструменов шаги задаются и проверяются согласно другой логике
    /*
    validateStep: function (equip) {
      // console.log('#validateStep from:', equip.model.id)

      if (!this.reagents.length) {
        // когда инструмент пустой, то проверяем есть ли шаг где он что-то берет из equip
        // <condition equip="tweezers" reagent="splav1" from="bottle1"/>
        if (!this.iReact.validateStep(this, {from:equip})) {
    			return false;
    		}
      } else {
        // если инструмент заполнен, то проверяем есть ли шаг с источником реагента
        // <condition equip="tube3" reagent="HCl" from="HCl_f"/>
        if (!this.iReact.validateStep(equip, {from:this.reagents[0].from})) {
    			return false;
    		}
      }

      return true;
    },
*/
    startFill: function (equip) {
      if (this.reagents.length) {  // ?? rename
        return;
      }

      if (equip.isClosed()) {
        return;
      }

      if (this.Progress) {
        this.Progress.remove();
      }

      this.Progress = new modelNS.ProgressCircle({
        parent:this.$el,
        color:"rgb(91,202,229)",
        radius:8,
        lineWidth:3
      })
      .render();

      this.Progress.$el.addClass('action-progress');

  		this.Progress.animate({
        from:0,
        to:1,
        duration:2000
      });

      this.Progress.once("complete", function () {
        this.addReagentFrom(this.touchEquip || equip);
      }, this);

      this.targetEquip = equip;
    },

    stopFill: function (equip) {
      if (!equip || this.targetEquip == equip) {
        if (this.Progress) {
          this.Progress.remove();
          this.Progress = null;
        }
        this.targetEquip = null;
      }
    },

    addReagentFrom: function () {
      this.stopFill();
      IReact.EquipView.prototype.addReagentFrom.apply(this, arguments);
      this.isSender = true;
      this.used = true;
    },

    onReagentAddedTo: function () {
        IReact.EquipView.prototype.onReagentAddedTo.apply(this, arguments);
        this.clear();
    },

    clear: function () {
      IReact.EquipView.prototype.clear.apply(this, arguments);
      this.isSender = false;
    },

    attach: function () {
      IReact.EquipView.prototype.attach.apply(this, arguments);

      if (this.attachedTo) {
        this.listenTo(this.attachedTo, "disable:inside", function () {
          this.$el.draggable("disable");
          this.disabled = true;
        });
      }
    },

    onDragOver: function (equip) {
      IReact.EquipView.prototype.onDragOver.apply(this, arguments);

      if (this.canFillFrom(equip)) this.startFill(equip);
      // this.overEquips.push(equip);
    },

    canFillFrom: function (equip) {
      // валидация
			if (!this.iReact.validateStep(this, {from:equip})) {
				return false;
			}

      if (!equip.isSender) {
        return false;
      }

      // console.log(equip.model.type, this.supportedEquips)

      if (this.supportedEquips && this.supportedEquips.indexOf(equip.model.type) <0) {
        return false;
      }

      return true;
    },

    onDragOut: function (equip) {
      IReact.EquipView.prototype.onDragOut.apply(this, arguments);

      if (equip.isSender) this.stopFill(equip);
    },

    onIntersect: function (equip) {
      this.touchTarget(equip);
    },

    onDrag: function () {
      var self = this;
      // оптимизация в основном для ie9 что бы не часто вызывался расчет
      if (!this.recalcIntersectRequested) {
        this.recalcIntersectRequested = true;
        requestAnimationFrame(function () {
          self.recalcIntersect();
        });
      }
    },

    recalcIntersect: function () {
      this.detectIntersect();
      this.autoUnTouch();
      this.recalcIntersectRequested = false;
    },

    autoUnTouch: function () {
      if (this.touchEquip && !this.touchEquip.$el.hasClass('ui-droppable-hover')) this.touchTarget(null);
    },

    detectIntersect: function () {
      var self = this,
          selector = [];

      this.iReact.$el.find(this._intersectSuccess).each(function () {
        var $receiver = $(this);
        if (self.isIntersect($receiver)) {
          self.onIntersect($receiver.data('equip'));
          // $(this).stop().css('border', '1px solid red').delay(1000).animate({border:''})
          return false;
        }
      });
    },

    isIntersect: function ($drop) {
      var draggable = this.$el.draggable('instance'),
  				$output = this.$el.find('.output'),
  				position = this.$output.position();

      // TODO: optimize ??
      return $.ui.intersect( {
  				positionAbs: {left:draggable.positionAbs.left + this.output.left, top:draggable.positionAbs.top + this.output.top},
  				helperProportions: this.output,
  				margins: draggable.margins
  			}, $drop.droppable('instance'), "touch" );
    },

    revert: function () {
      if (this.disposable && this.used) {
        var $used_tools = this.iReact.$el.find('[type="used_tools"]'),
            used_tools = $used_tools.data('equip');
        if (used_tools) {
          this.attachedTo = used_tools;
          this.savedPosition = used_tools.position(20, 40);
        }

        // подразумеваем если остался реагент значит использована неверно
        if (this.reagents.length) {
          this.once("reverted", function () {
            this.iReact.revertStep();
          }, this)
        }

        // проверка не осталось ли подшагов с этим оборудованием
        // и если осталось
        // - выводить сообщение
        // - откатывать шаг:
        //   - наличие жидкостей? нуда, ведь если воспользовались
      }
      return IReact.EquipView.prototype.revert.apply(this, arguments);
    }

});

/* Пробиркодержатель */
// TODO: angle во view
IReact.equips.stand = IReact.EquipView.extend({

  isStand:true,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    burner_block: {slotName: 'burnerSlot'},
    test_tube: {slotName: 'holder'},
    test_tube_gas: {slotName: 'holder'},
    wurtz_flask: {slotName: 'holder'},
    test_tube_reverse: {slotName: 'holder'},
    florence_flask_100: {slotName: 'holder'},
    florence_flask_500: {slotName: 'holder'},
  },

  initialize: function () {
    IReact.EquipView.prototype.initialize.apply(this, arguments);

    this.on('equipAttached', function (equip) {
      this.onEquipAttached(equip);
    }, this);

    this.on('equipDetaching', function (equip) {
      this.onEquipDetaching(equip);
    }, this);

    // this.on('detach:test_tube', function (equip) {
    //   this.onTestTubeDetach(equip);
    // }, this);

    this.model.on('change:angle', function (model, angle) {
      this.refresh_rotation();
    }, this);
  },

  render: function () {
    IReact.EquipView.prototype.render.apply(this, arguments);

    var self = this,
        angle = this.model.get('angle') || 0;

    this.$foot = $("<div class='stand-foot'/>").appendTo(this.$el);

    this.$rotate = $("<div class='stand-rotate'/>")
      .appendTo(this.$foot);

    this.$holder = $("<div class='stand-holder'/>")
      .appendTo(this.$rotate);

    // if (this.iReact.model.dataJSON.rotable) {
      this.$rotate.draggable({
        start: function (e, ui) {return self.startRotating(ui); },
        drag: function (e, ui) { return self.rotating(ui); },
        stop: function (e, ui) { return self.stopRotating(ui); },
      });
    // }

    // this.model.set('angle', angle);
    this.refresh_rotation();

    return this;
  },

  startRotating: function (ui) {
    // if (!this.iReact.model.dataJSON.rotable) {
    //   return false;
    // }

    if (!this.startPosition) this.startPosition = ui.position;
    this.startAngle = this.angle;
  },

  rotating: function (ui) {

    var topDiff = ui.position.top - this.startPosition.top;

    if (ui.position.left < this.startPosition.left && ui.position.top < this.startPosition.top ) topDiff *= -1;

    var angle = topDiff + this.startPosition.left - ui.position.left;

    angle += this.startAngle*2;

    if (angle < 0) angle = 0;
    if (angle > 100) angle = 100;

    // this.$el.attr("angle", Math.round(angle));

    ui.position = {left:0, top:0};

    if (this.iReact.validateStep(this, {angle:angle})) {
      this.model.set({angle: angle});
    }

    // TODO: listen model change angle
    // this.refresh_rotation();
  },

  stopRotating: function () {
    // if (!this.iReact.model.dataJSON.rotable) {
    //   return false;
    // }

    if (this.setup) this.checkReaction();
    this.iReact.verifyStep();
  },

  // старое, раньше так проверялось можно ли присоединить предмет, сейчас автоматически в setupTo
  // connectEquip: function (equip)
  // {
  //   var type = equip.model.get('type');
  //
  //   if (type == 'test_tube') {
  //     if (this.$rotate.children().length) {  // защита от 2х пробирок в одном стенде TODO: сделать получше
  //       return false;
  //     }
  //   }
  //
  //   return true;
  // },

  onEquipDetaching: function (equip) {
    equip.setAngle(0);
  },

  refresh_rotation: function () {
    var angle = this.model.get('angle');

    if (angle != 0) {
      this.iReact.closeTooltip(this.$rotate);
    }
    // test_tube
    if (this.slots.defaultSlot) {
      this.slots.defaultSlot.animation.rotate(angle);
    }
    if (this.slots.burnerSlot) {
      // this.slots.burnerSlot.$el.css({
      //   marginLeft: -Math.round(90/100*angle),
      //   height: 21 + Math.round(10/100*angle),
      //   marginTop: 10 -Math.round(10/100*angle),
      // })
      // this.slots.burnerSlot.$el.css('marginLeft', -Math.round(77/100*angle))
    }
    // if (this.kippa) {
    //   this.kippa.angleChanged(angle);
    // }

    // this.$rotate.css('transform', 'rotate('+angle+'deg)');
    // this.footPosition = Math.round(30/100*angle) + 25;   // 25 - стартовый отступ
    // this.$foot.css('top', this.footPosition);

    for (var slot in this.slots) {
      this.slots[slot].setAngle(angle);
    }

    this.$el.attr('angle', Math.round(angle) || null);

    this.angle = angle;

    // for (var i=0; i<)

    // this.trigger('change:rotation', {
    //   angle: angle,
    //
    // });
  },

  getRotation: function () {
    var position = this.position(),
        top = this.$foot.css('top').replace('px','')*1,
        center = {top:top + 15/2, left:50+72/2}; // 15 - высота держателя, 50 - ширина, 72 - ширина крутящегося элемента

    return {
      angle: this.angle,
      centerX: position.left + center.left,
      centerY: position.top + center.top,
    }
  },

  onEquipAttached: function (equip) {
    if (this.allowAttach[equip.model.type].slotName == 'defaultSlot') {
      equip.$attachTo = this.$rotate;
      this.$rotate.append(equip.$el);
    }

    this.refresh_rotation();
  },

  informAboutAngle: function () {
    if (!IReact.equips.stand.informedAboutAngle) {
      this.iReact.inform(this.$rotate, modelNS.lang("can_rotate"));
      IReact.equips.stand.informedAboutAngle = true;
    }
  },

  hint: function (about) {
    if (about.angle) {
      this.informAboutAngle();
    }
  },

});

modelNS.IReact.test_tube = modelNS.IReact.equipCanvas.extend({

	// width : 200,
	// height : 200,

	// универсальная система привязки содержимого
	"react-object": true,

	// визуальные составлющие, представляются отдельными канвасами
	visualParts: [{
		name: "test_tube_3",
		part: "front",
	}],

	defColor: "#5BCAE5",

	maxSize: 40,
	minSize: 6,

	// высота реагента для полной емкости
	fullHeight: 80,

	initialize: function( options ) {
		modelNS.IReact.equipCanvas.prototype.initialize.apply(this, arguments);

		this.options = options;

		var self = this,
				isEmpty = options.status == 'empty';

		if (!options.color && options.status != 'empty') options.color = this.defColor;	// TODO: для сыпучих цвет не нужен

		// жидкое (старое?)
		// TODO: убрать все лишние из анимаций пробирок и превратить ее в одну, потому как проще делать анимации через js
		// this.loadMovie({
		// 	name : "test_tube",
		// 	src : "js/test_tube.js",
		// 	color : options.color,
		// 	at : 0,
		// 	// duration : 70,
		// 	properties: {part:"front", size: options.size || this.maxSize, oil_film:null},	// TODO: получше придумать обнуление пленки
		// 	open: options.status != 'empty'
		// });

		this.loadMovie({
			name : "test_tube_3",
			src : "js/test_tube_3.js",
			color : options.color,
			properties: {
				empty: true,
				plaque: false,	// фикс: "налет, а потом осадок в другой пробирке - налет не сбивается"
				sludge: false,
				blur: false,
				part: 'back',
			}
		});

		this.angle = 0;
	},

	// старое
	/* animate_receive_liquid: function (reagent, options) {

		if (!options) options = {full:1};

		var self = this,
				color = reagent && reagent.color || this.defColor,
				fromColor = (this.options.color||'').replace(/ /gi, ''),
				fromSize = this.options.properties.size || 0,	// начинаем с 10ти что бы плавно было наливание, ибо с 0-10 анимация не меняется, так же если доза 10 то баг не меняется размер
				size = Math.max(Math.min(options.full*this.maxSize, this.maxSize), 0),	// product.size может быть NaN, не должен быть! Минимальный должен быть 0 на случай испарения жидкости
				properties = {},
				time = options.reaction ? options.reaction.time || 3 : 3,
				promise = $.when();
				// startFrame = this.angleFrame(this.angle);

		// console.log(fromSize, size, options.full)

		this.prepare({name: "test_tube", properties: {
			discharging:false,
		}});

		function openliquid (color, progress)
		{
			self.redraw({color: color});
		};

		if (fromSize != size) {
			// перед началом визуальных эффектов подождем немного
			promise = promise
				.then(function () {
					return $({}).delay(300).promise();
				})
				.then(function () {
					if (!fromColor) self.prepare({color: color});
					return self.animateSize({fromSize:fromSize, size:size}).promise();
				});
			this.sizePromise = promise;
			// self.redraw({properties: {size:size}});
		}

		if (this.options.name == "test_tube"	 // liquid
			&& fromColor && fromColor != color
			&& options.color !== null	// отключение изменение цвета через опции, если реагент добавляется перед реакцией, то меняем только уровень
		) {
			promise = promise.then(function () {
				return self.colorize({
					fromColor: fromColor,
					toColor: color,
					colorize: openliquid,
					duration: time*1000,
				}).promise();
			});
		}

		var promise = promise.then(function () {
				if (options.zoomable !== 'start') {	// в цепной реакции нет задержки
					return $({}).delay(400).promise();
				}
		});

		return promise;
	},
	*/

	/*
	animateSize: function (options)
	{
		var self = this,
				fromSize = options.fromSize,
				size = options.size;

		return $({size:fromSize}).animate({size:size}, {
			duration: 1000,
	    step: function(val) {
	        self.redraw({properties: {size:val}});
					// console.log('animateSize', val);
	    }
		});
	},
	*/

	//
	// reactliquid : function ($glassware)	// TODO: backsupport to base example
	// {
	// 		var $react = $glassware.find('.react'),
	// 				$canvasWrap = this.$canvas.parent();
	// 		this.$parent.addClass('in-react');
	// 		this.$canvas.appendTo($react);
	//
	// 		var flip = $glassware.data("flip");
	// 		if (flip) {
	// 			$react.addClass('flip');
	// 		} else {
	// 			$react.removeClass('flip');
	// 		}
	// 		$glassware.data("flip", !flip);
	//
	// 		this.play({
	// 			from:0,
	// 			to:70,
	// 			complete : function () {
	// 				// this.$canvas.appendTo($canvasWrap);
	// 				this.$canvas.appendTo(this.$parent.find('.canvas-wrap'));
	// 				this.$parent.removeClass('in-react');
	// 				// this.exportRoot.gotoAndPlay (0);
	// 				this.play({from:0});
	// 			}
	// 		});
	//
	// 		// return true;
	// },


	// rotate : function (angle)
	// {
	// 	this.angle = angle;
	// 	if (this.options.name == "test_tube_3" && this.options.color) {
	// 		this.play({
	//       // from : 27 + (13 * angle/100)	// test_tube_2
	// 			from : this.angleFrame(this.angle)
	//     });
	// 	}
	// 	// 26 - 39
	// },
	//
	// angleFrame: function (angle) {
	// 	// return 27 + (13 * angle/100)	// test_tube_2
	// 	return 0 + Math.round(6 * angle/100);
	// },

	discharge: function (state)
	{
		if (state == 'liquid') {

			this.redraw({properties:{discharging:true}})

			// finish colorize;
			if (this.$colorize) {
				this.$colorize.finish();
			}

// console.log(this.options)
			this.clear();
			this.play({
				name: "test_tube",
				color: this.options.color,	// ??
				// from: 0,
				to: 55
			});

		} else {	// default action, empty test_tube

				this.options.color = null;
				this.open({
					name: "test_tube_3",
					at: 25,
					color:null,
					properties: {empty:true},
				});

		}
	}

});

// Пробирка
IReact.equips.test_tube = IReact.equips.glassware.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    therm: true,
    indicator: {slotName:'indicator'},
    cork_gastube: true,
    gastube: true,
    rod: true, // #10539 - палочка ложится внутрь, потом перемешивается
              // TODO: анимация нити - продумать, там палочка по итогу не должна оставаться внутри
              // возможно, запускать нить без увеличения при вынимании
              // а при "навести и ждать" запускать с увеличением
    splinter: true, // если в пробирке есть реагент с burn, то тлеющая лучина зажжется
    wire: true, // задумка в том что можно поместить что-то, и что-бы это что-то не касалось дна
    cork: true, // корковая пробка
    gluesticker: {slotName:'gluesticker'}, // навешиваемая подпись
    cap_dropper: true,
    cap_dropper_closable: true,
  },

  // размер регистрируемого реагента
	size: 40,

  maxSize: 40,
	minSize: 6,

  // способность элемента принимать другие элементы
  isReceiver: true,

  // длинная ли подпись у этой емкости
  isLongLabel: false,

  // по умолчанию курсор при хватании элемента распологается в месте хватания
  cursorAt: {left:16, top:80},

  // разрешено ли распологаться на полке
  canPlaceInShelf: false,

  initialize: function () {
    IReact.equips.glassware.prototype.initialize.apply(this, arguments);

    var position = this.model.get("position");
    this.setPosition(position);
  },

  render: function () {
    IReact.equips.glassware.prototype.render.apply(this, arguments);

    var id = this.model.get("name"),
        subtype = this.model.get("subtype"),
        label = this.model.get('label'),
        self = this;

    // TODO: в зависимости куда бросили пробирку - менять ей слот, что бы можно было перемещать в полочке для пробирок

    // this.listenTo(this.model, 'beforeAttachedTo:tubes_stand', this)

    return this;
  },

  setPosition: function (position) {
    if (position) {
      this.$el.addClass('position-' + position);
      this.slotName = "tube" + position;
    }
  },

  setShelf: function () { // TODO: create tubes_stand ?
    if (!this.canPlaceInShelf) {
      return false
    }
    return IReact.equips.glassware.prototype.setShelf.apply(this, arguments);
  },

  onDropInShelf: function () {
    if (!this.canPlaceInShelf) {
      return this.revert();
    }
    return IReact.equips.glassware.prototype.onDropInShelf.apply(this, arguments);
  },

  revert: function () {
    if (this.setupedTo && this.setupedTo.model.get('type') == 'stand') {
      this.$el.appendTo(this.setupedTo.$rotate);
      this.$el.css({
         transform: 'rotate(0deg)',
         left : '',
         top : ''
      });
    } else {
      IReact.equips.glassware.prototype.revert.apply(this, arguments);
    };
  },

  discharge: function () {
    // return IReact.equips.glassware.prototype.discharge.apply(this, arguments);

    var reagent = this.reagents[0],
        state = reagent && reagent.state;

    if (state != "liquid") {

      return IReact.equips.glassware.prototype.discharge.apply(this, arguments);

    } else {  // liquid

      this.$el.stop().addClass('discharging');

      var position = this.iReact.$discharge.position(),
          from = {top : this.$el.css('top'), left : this.$el.css('left')},
          self = this;

      this.$el
        .position({	of: this.iReact.$discharge }) // prepare position before .open becose of bug in chrome
        .position({
          of: this.iReact.$dischargingArea,
          my: "left-50 center-50",
          at: "center center"
        })
        .draggable( 'disable' );

      var to = {top : this.$el.css('top'), left : this.$el.css('left')};

      this.$el.css({
        left: from.left,
        top: from.top,
      }).animate({
        left: to.left,
        top: to.top
      }, {
        complete: function () {
          self.animation.discharge(state);
          self.animation.once("played", function () {
            IReact.equips.glassware.prototype.discharge.apply(this, arguments);
            self.$el.draggable( 'enable' );
          }, self);
        }
      });
    }
  },

  setAngle: function (angle) {
    this.animation.setAngle(angle);
  },

  // stand => test_tube => cork_gastube
  getRotation: function () {
    return $.extend(IReact.equips.glassware.prototype.getRotation.apply(this, arguments), {
      radius: 102, // -> Math.hypot(width/CourseConfig.zoomScale, height/CourseConfig.zoomScale)
      baseAngle: 12.5 // -> Math.degrees(Math.tan(width/height))
    });
  },

});

modelNS.IReact.florence_flask = modelNS.IReact.equipCanvas.extend({

	visualParts: [{
			name: "florence_flask",
			part: "front",
		}],

	initialize: function () {
		modelNS.IReact.equipCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "florence_flask",
			src: "js/florence_flask.js",
			properties: {part:"back"},
		});

	},

	animate_receive_liquid: function (reagent, options) {
		return this.addCircleReagent(reagent, options);
	},

	animate_init_liquid: function (reagent, options) {
		return this.addCircleReagent(reagent, $.extend(options, {init:1}));
	},


});

// Колба
IReact.equips.florence_flask = IReact.equips.glassware.extend({

  // может ли содержимое быть перемешанным посредством таскания мышкой
  mixableByDrag: false,

  // способность элемента принимать другие элементы
  isReceiver: true,

  // по умолчанию содержит реагента
  size: 150,

	minSize: 0,
	maxSize: 200,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    cork: true,
    cork_gastube: true,
  },

});

modelNS.IReact.tools_pack = modelNS.IReact.equipCanvas.extend({

	// универсальная система отображения
	"react-object": true,

	visualParts: [{
			name: "glass_half",
			part: "down",
		},
		{// кусочек стакана передней части, тот который перекрывает заднюю, но при этом его может перекрыть верхняя часть электрокрышки
			name: "glass_half",
			part: "front",
		}],

	// высота реагента для полной емкости
	fullHeight: 41,

	initialize: function(options) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);
// TODO: null - no glass

		this.loadMovie({
			name: "glass_half",
			src: "js/glass_half.js",
			state: options.state || 'liquid',
			color: options.color || null,
			properties: {part:'front'},
			at:0,
		});

	},

});

/* Набор пипеток */
IReact.equips.tools_pack = IReact.EquipView.extend({

  className: 'equip tools_pack',

  render: function () {
    IReact.EquipView.prototype.render.apply(this, arguments);

    this.renderTools();

    return this;
  },

  renderTools: function () {
    for (var i=0; i<this.toolsCount; i++) {
      var tool = new IReact.equips[this.toolType]({
        model: new IReact.EquipModel({
          type: this.toolType,
          dose: this.dose,
          disposable: false,
        }),
        slotName: 'tool-' + i,
        iReact: this.iReact,
        parent: this.$parent,
      }).render();

      tool.attachTo(this);
    }
  }
});

/* Водяная баня */
modelNS.IReact.bath = modelNS.IReact.animation.extend({

	// визуальные составлющие, представляются отдельными канвасами
	visualParts: [{
			name: "bath",
			part: "back",
			y: -110,
			parent: '.holder',
		}, {
			name: "bath",
			part: "front_clip",
			y: -110,
			parent: '.holder',
		}, {
			name: "bath",
			part: "front_bath",
			y: -110,
			parent: '.holder',
		}, {
			name: "bath",
			part: "stick",
		}],

	initialize: function( options ) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
				name: "bath",
				src: "js/bath.js",
				properties: {part:"stand"}
			});
	},

	render: function ($parent) {
		// объявляем перед рендерингом общим, так как будет в нем использоваться
		this.$holder = $('<div class="holder"/>').appendTo($parent);

		modelNS.IReact.animation.prototype.render.apply(this, arguments);

		return this;
	}

});

/* Водяная баня */
IReact.equips.bath = IReact.EquipView.extend({

  isStand:true,

  minDegree: IReact.roomTemperature, // комнатная
  maxDegree: 100,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    burner: true,
    test_tube: {slotName: 'holder'},
  },

  // heartDuration: 10*60*1000, // 10 минут
  // heartDuration: 10*1000, // 10 минут

  // теплопроводность, с какой скоростью нагревается 1 градус
  // transcalency:

  render: function ()
  {
    IReact.EquipView.prototype.render.apply(this, arguments);

    this.$holder = this.$defaultSlot = this.animation.$holder;
    // this.$burnerSlot = this.$parent

    this.forTemperature(this.model.get('degree'));

    // упрощенно считаем что уже нагрет ? или только если присоеден был burner?
    this.model.set({temperature: this.model.get('degree')});

    this.on("attach:burner", function (burner) {
      this.trackBurner(burner);
    }, this);

    this.on("detaching:burner", function (burner) {
      this.stopTrackBurner(burner);
    }, this);

    // this.on("attach:test_tube", function (equip) {
    //   this.heat(equip);
    // }, this);
    //
    // this.on("detaching:test_tube", function (equip) {
    //   this.stopHeat(equip);
    // }, this);

    return this;
  },

  trackBurner: function (burner)
  {
    this.listenTo(burner.model, "change:status", function (model, status) {
      if (status == "active") this.heart();
    });

    // начать нагревание если включен
    // if (burner.model.get("status") == "active") this.heart();

  },

  stopTrackBurner: function (burner)
  {
    this.stopListening(burner.model);
    // остановить нагревание
  },

  /* Уровень по высоте в зависимости от требуемой температуры */
  forTemperature: function (degree) {
    // 45px = 100C
    // 20px = 20C
    this.$holder.css({
      top: -65 + 20 * (degree - this.minDegree) / (this.maxDegree - this.minDegree)
    });
    this.iReact.tooltip(this.animation.parts.front_bath.$el, degree + "° С");

    // пока что считаем что изначально burner активный и подключен и баня нагрета
    this.degree = degree;
  },

  // TODO: остаывание при выключеном огне?






});

/* Аккамулятор */
IReact.equips.battery = IReact.EquipView.extend({

  // конфиг, какие объекты могут быть присоеденены
  // если активный, то присоединяется когда переносят на него

  // initialize: function () {
  //   IReact.EquipView.prototype.initialize.apply(this, arguments);
  //
  //   this.on('equipAttached', function (equip) {
  //     if (equip.animation && equip.animation.setInScheme) {
  //       equip.animation.setInScheme();
  //     }
  //   }, this);
  //
  //   this.on('equipDetaching', function (equip) {
  //     if (equip.animation && equip.animation.setOutScheme) {
  //       equip.animation.setOutScheme();
  //     }
  //   }, this);
  // },

});

// Интерфейс для мерного стакана, ниже наследования на 50, 100, 150 и 200 мл
modelNS.IReact.beaker = modelNS.IReact.equipCanvas.extend({

	// отображение поддерживает универсальную систему attach
	"react-object": true,

	// название анимации
	equipName: null,

	initialize: function(options) {
		if (!this.equipName) {
			alert("Невозможно использовать интерфейс 'beaker', необходимо указать размерность, например 'beaker50'")
		}

		this.visualParts = [{
			name: this.equipName,
			part: "front",
		}];

		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);
// TODO: null - no glass

		this.loadMovie({
			name: this.equipName,
			src: "js/" + this.equipName + ".js",
			properties: {part:'back'},
		});

	},

});


modelNS.IReact.beaker50 = modelNS.IReact.beaker.extend({

	// название анимации
	equipName: "beaker50",

	// высота реагента для полной емкости
	fullHeight: 29,

});

modelNS.IReact.beaker100 = modelNS.IReact.beaker.extend({

	// название анимации
	equipName: "beaker100",

	// высота реагента для полной емкости
	fullHeight: 32,

});

modelNS.IReact.beaker150 = modelNS.IReact.beaker.extend({

	// название анимации
	equipName: "beaker150",

	// высота реагента для полной емкости
	fullHeight: 35,

});

modelNS.IReact.beaker200 = modelNS.IReact.beaker.extend({

	// название анимации
	equipName: "beaker200",

	// высота реагента для полной емкости
	fullHeight: 48,

});

// Мерный стакан
IReact.equips.beaker = IReact.equips.glassware.extend({

  // может ли содержимое быть перемешанным посредством таскания мышкой
  mixableByDrag: false,

  // способность элемента принимать другие элементы
  isReceiver: true,

  // maxSize: 50,
	minSize: 0,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    test_tube: true,
    indicator: true,
    rod: true,
  },

  // initialize: function () {
  //   IReact.equips.glassware.prototype.initialize.apply(this, arguments);
  // },
});

IReact.equips.beaker50 = IReact.equips.beaker.extend({
  size: 50,
  maxSize: 50,
});
IReact.equips.beaker100 = IReact.equips.beaker.extend({
  size: 100,
  maxSize: 100,
});
IReact.equips.beaker150 = IReact.equips.beaker.extend({
  size: 150,
  maxSize: 150,
});
IReact.equips.beaker200 = IReact.equips.beaker.extend({
  size: 200,
  maxSize: 200,
});

modelNS.IReact.bottle = modelNS.IReact.equipCanvas.extend({

	// универсальная система отображения
	"react-object": true,

	// если понадобится - реализовать в будущем
	// визуальные составлющие, представляются отдельными канвасами
	// visualParts: [{
	// 		name: "bottle",
	// 		part: "up",
	// 	}],

	initialize: function( options ) {
		modelNS.IReact.equipCanvas.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie($.extend(options, {
			name: "bottle",
			src: "js/bottle.js",
			properties: {keros: false},	// part:'down' пока что нет необходимости делать переднюю стенку, реагенты и поверх красиво смотрятся
			color: options.color
		}));
	},

	animate_init_powder: function () {},
	animate_receive_powder: function () {},

});


modelNS.IReact.bottle_keros = modelNS.IReact.equipCanvas.extend({

	initialize: function( options ) {
		modelNS.IReact.equipCanvas.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie($.extend(options, {
			name : "bottle",
			src : "js/bottle.js",
			// state: 'powder',
			properties: {keros: true},
			color : options.color
		}));
	}

});

// Банка для сыпучих веществ
IReact.equips.bottle = IReact.equips.glassware.extend({
  size: Infinity,
  dose: 10,
});

// Банка для с керосином для Na и др
IReact.equips.bottle_keros = IReact.equips.bottle.extend({
  size: Infinity,
  dose: 10,
  className: IReact.equips.glassware.prototype.className + ' bottle'
});

modelNS.IReact.burner = modelNS.IReact.equipCanvas.extend({

	initialize: function(options) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		var self = this;

		this.loadMovie({
			name: "burner",
			src: "js/burner.js",
			// status: options.status || "open",
		});
	},

	open: function (options) {
		if (options.status == "active") {
			this.flame({color:options.color});
		} else {
			this.flame(false);
		}
		modelNS.IReact.animation.prototype.open.apply(this, arguments);
	},

	render: function () {
		modelNS.IReact.animation.prototype.render.apply(this, arguments);
		if (this.effects.flame) this.effects.flame.$el.appendTo(this.$parent); // fix РЭШ2 грузится эффект раньше чем рендерится спиртовка
		return this;
	}

});

/* Подставка для горелки */
IReact.equips.burner_block = IReact.EquipView.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    burner: true
  },

});

// TODO: status="heatevenly" - равномерное прогревание


/* Горелка */
IReact.equips.burner = IReact.EquipView.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    tweezers_tigel: true,  // сжечь капрон над горелкой используя тигельные щипцы
    wire: true, // проволка (медная)
    spoon: true, // ложка
    slideglass: true, // предметное стекло
  },

  heatEvenlyEquips: 'test_tube',

  // название слота, куда присоединится элемент при attachTo, equip[slotName]
  slotName: 'burnerSlot',

  // наличие эффекта и способность его передовать
  hasEffect: false, // по умолчанию эффекта нет

  // название эффекта
  effect: "burn",

  // Тип источника эффекта (например открытый огонь или только способ получания огня)
  // от этого зависит если перенести на предмет произойдет ли переача эффекта
  effectMode: "open",

  // цвет пламени по умолчанию
  defaultBurn: "rgba(255,0,0,0.773)",

  addEffectTo: function (equip) {
    if (this.model.get('status') == 'active') {
      equip.addEffect(this.effect);
    }
  },

  initialize: function () {
    IReact.EquipView.prototype.initialize.apply(this, arguments);

    // способность загораться, облечает selector
    this.$el.attr('can_burn', "");

    this.listenTo(this.model, "change:status", this.status);

    this.on("equipAttached", this.equipAttached);
    this.on("equipDetaching", this.equipDetaching);
  },

  render: function () {
    IReact.EquipView.prototype.render.apply(this, arguments);

    var self = this;

    this.$el.click(function () { self.toggle() });

    // this.status = "open";
    // console.log(this.model.get('status'))
    this.status(this.model, this.model.get('status'));

    return this;
  },

  onDragOver: function (equip) {
    if (this.canHeatEvenly(equip)) {
      this.startHeatEvenly(equip);
    }
  },

  onDragOut: function (equip) {
    if (this.canHeatEvenly(equip)) {
      this.stopHeatEvenly(equip);
    }
  },

  canHeatEvenly: function (equip) {
    if (!this.iReact.validateStep(equip, {action:'heatevenly'})) {
      return;
    }
    if (equip.effects.indexOf('heatevenly') >= 0) {
      return false;
    }
    if (this.model.get('status') != 'active') {
      return false;
    }
    if (this.heatEvenlyEquips.indexOf(equip.model.type) < 0) {
      return false;
    }
    return true;
  },

  startHeatEvenly: function (equip) {
    var self = this;

    this.HeatEvenlyProgress = equip.progress(0, {
      color: 'orange',
      name: 'heatevenly',
    });
    this.HeatEvenlyProgress.animate({
      to: 1,
      duration: 2000,
    });
    this.HeatEvenlyProgress.once('done', function () {this.heatedEvenly(equip)}, this);
  },

  stopHeatEvenly: function (equip) {
    equip.progress(null, {name: 'heatevenly'});
  },

  heatedEvenly: function (equip) {
    this.iReact.notify(modelNS.lang("heatedevenly"), {duration:1000});
    this.stopHeatEvenly(equip);

    equip.addEffect("heatevenly");
  },

  // цвет пламени реагента присоединенного
  getAttachedBurn: function () {
    var slot = this.slots.slot,
        color = slot && slot.reagents.length && slot.reagents[0].burn;
    return color;
  },

  equipDetaching: function (equip) {
    this.animation.refresh({color:this.defaultBurn});
  },

  equipAttached: function (equip) {
    this.animation.refresh({color:this.getAttachedBurn()});
  },

  status: function (model, status) {
    this.animation.refresh({status: status, color:this.getAttachedBurn()});

    if (status == "active") {
      // TODO: оптимизировать в метод?
      this.hasEffect = true;
      this.$el.attr("effect", this.effect);
    } else {
      // TODO: оптимизировать в метод?
      this.hasEffect = false;
      this.$el.attr("effect", "");
    }
    // на гашение огня может весеть реакция что бы убрать газ и др
    this.checkSetupComplete();
    this.iReact.verifyStep();
  },

  toggle: function () {
    var status = this.model.get("status") == "closed" ? "open" : "closed";

    if (!this.iReact.validateStep(this, {status:status})) {
      return;
    }

    this.model.set({status:status});
  },

  addEffect: function (condition, options) {
    if (!this.iReact.validateStep(this, {status:"active", from: options.from})) {
      return;
    }

    if (condition == 'burn' && this.model.get("status") != "closed") {
      this.model.set({status:"active"});
      IReact.EquipView.prototype.addEffect.apply(this, arguments);
    }
  },

  informAboutClosed: function () {
    if (!IReact.equips.burner.informedAboutClosed) {
      this.iReact.inform(this.$el, modelNS.lang("extinguish"), {point:{valign: "top"}})
      IReact.equips.burner.informedAboutClosed = true;
    }
  },

  hint: function (about) {
    if (about.status == 'closed') {
      this.informAboutClosed();
    }
  },

  showStatusSolution: function (options) {
    var self = this,
        status = this.model.get("status"),
        Solution = options.Solution,
        promise = $.when();

    // открыть или закрыть
    if (options.status == "open" && status != "open"
      || options.status == "closed" && status != "closed"
      || options.status == "active" && status == "closed" // открываем перед тем как зажечь
    ) {
      var position = this.position();
      promise = promise.then(function () {
        return Solution.showClick(self.$el)
          .then(function () {
            self.toggle();
            return self.$el.delay(400).promise();
          });
      });
    }

    if (options.status == "active" && status != "active") {
      var $burn = this.iReact.$el.find("[effect='burn']"),
          burnEquip = $burn.data('equip');

      promise = promise.then(function () {
        return Solution.equipDropInEquip(burnEquip, self);
      });
    }

    return promise;
  }

});

modelNS.IReact.cable = modelNS.IReact.animation.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		var self = this;

		// иногда в сборке открываются провода в таком виде, так как они не используется отдельно
		// то как временный фикс просто убираем этот вариант
		// this.loadMovie({
		// 	name : "cable",
		// 	src : "js/cable.js",
		// 	at : 0,
		// });

		// this.loadMovie({
		// 	name : "cable_scheme",
		// 	src : "js/cable_scheme.js",
		// 	open: false,
		// });
	},

	render: function () {
		modelNS.IReact.animation.prototype.render.apply(this, arguments);

		this.$el.addClass('cable2');

		// делаем не через css так как в ie9 svg дополнительная обработка нужна
		// this.$cable2 = $('<div class="cable2">').appendTo(this.$parent);

		return this;
	},


	// dublingCable : function ()
	// {
	// 	if (this.options.name == "cable") {
	// 		this.open({name:"cable", y:26, x:22, at:0, clear:false});
	// 		this.open({name:"cable", y:-4, x:10, rotation:10, at:0, clear:false});
	// 	}
	// },
	//
	// setInScheme: function ()
	// {
	// 	this.play({name:"cable_scheme"});
	// },
	//
	// setOutScheme: function ()
	// {
	// 	this.play({name:"cable"});
	// },
	//
	// open: function (options)
	// {
	// 	modelNS.IReact.animation.prototype.open.apply(this, arguments);
	// 	if (options.name == "cable" && options.clear !== false) {
	// 		this.dublingCable();
	// 	}
	// }

});

/* Кабель */
IReact.equips.cable = IReact.EquipView.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    glass: {slotName:'glass'},
    wire: {slotName:'glass'}, // проводимость медной проволки
    battery: {slotName:'cable1,cable2'},
    switch: {slotName:'cable2,cable1'},
    lamp: {slotName:'cable2,cable1'},
  },

  // если этот предмет был брошен на другой, он может поглотить его
  attachActivator: true,

  initialize: function () {
    IReact.EquipView.prototype.initialize.apply(this, arguments);

    // если есть присоединенные предметы, тогда вид меняется
    this.slotsinuse = 0;

    this.on('equipAttached', this.equipAttached);
    this.on('equipDetaching', this.equipDetaching);
  },

  // render: function () {
  //   IReact.EquipView.prototype.render.apply(this, arguments);

    // $('<div class="iteraction zone1"/>').appendTo(this.$el);

  //   return this;
  // },

  equipAttached: function () {
    this.$el.attr("slotsinuse", ++this.slotsinuse);
    // this.$el.addClass('drop-iteraction')
    // TODO: для ie9 надо будет переключать svg ? или сразу инициировать 3й и только toggle display через css?
  },

  equipDetaching: function () {
    this.$el.attr("slotsinuse", --this.slotsinuse || null);
    // TODO: для ie9 надо будет переключать svg ? или сразу инициировать 3й и только toggle display через css?
  }

});


modelNS.IReact.cap_dropper_closable = modelNS.IReact.equipCanvas.extend({

	initialize: function(options) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "cap_dropper_closable",
			src: "js/cap_dropper_closable.js",
			color: options.color || null,
			properties: {closed:true},
		});
	},

	close: function (close) {
		this.redraw({properties:{closed: close}});
	},

	// TODO: прием реагента - перекрашивание цвета
	animate_receive_liquid: function (reagent, options) {
		this.redraw({color: reagent.color});
	}

	// TODO: очистка

});

/* Крышка с капельницей */

// TODO: налить реагент когда крышка в пробирке
// TODO: запрет реакций в крышке (не более одного реагента)
// TODO: когда крышка вынимается, то реагент пропадает
//      возможно только визуально его пропадать нужно, до окончательного перемещения крышки
//      что бы реакции не запускались от того что реагент забирается
//      и не надо было реакцию прописывать на забирание реагента

IReact.equips.cap_dropper_closable = IReact.equips.cap.extend({

  // способность элемента принимать другие элементы
  isReceiver: true,

  // поддерживаемые состояния
  supportedStates: 'liquid',

  // сколько ml по умолчанию передаст
  dose: 0.01,

  // сколько ml максимально примет за раз
  maxdose: Infinity,

  // по умолчанию содержит реагента
  size: 20,

  // по умолчанию курсор при хватании элемента распологается в месте хватания
  cursorAt: {left:20, top:20},

  // увеличивать ли если добавляется реагент
  // hasZoomWhenReagentAdd: false,

  initialize: function (options) {
    IReact.equips.cap.prototype.initialize.apply(this, arguments);

    // по умолчанию открыта
    this.model.set('status', 'closed');

    this.on("attached", function (equip) {
      this.startDropping(equip);
    }, this);

    this.on("detaching", function (equip) {
      this.stopDropping(equip);
    }, this);

    // окончательное отсоединение
    this.on("detach", function (equip) {
      this.stopDropping(equip);
    }, this);

    this.on("reagentAdded", function () {
      this.startDropping();
    });

    this.listenTo(this.model, "change:status", this.status);

  },

  render: function () {
    IReact.equips.cap.prototype.render.apply(this, arguments);

    var self = this;

    this.$el.attr({
      "react-valign": "top",
      "react-align": "center",
    });

    this.$el.click(function () { self.toggle() });

    return this;
  },
  status: function (model, status) {
    // this.checkSetupComplete();

    if (status == "closed") {
      this.animation.close(true);
      this.stopDropping();
    } else {
      this.animation.close(false);
      this.startDropping();
    }

    this.iReact.verifyStep();
  },

  toggle: function () {
    var status = this.model.get("status") == "closed" ? "open" : "closed";

    if (!this.iReact.validateStep(this, {status:status})) {
      return;
    }

    this.model.set({status:status});
  },

  startDropping: function () {
    if (!this.attachedTo) {
      return;
    }

    this.attachedTo.redirect(this);

    if (!this.reagents.length) {
      return;
    }

    if (this.model.get('status') == 'closed') {
      return;
    }

    // иногда повторно событие вызывается, когда пробирка в стенде, то первый раз через стенд
    // похоже на такой тип аттача нужно сделать настройку
    // что бы крышки событие срабатывало только для test_tube
    //  (intersectSuccess: ???) тогда крыша должна стать тулом
    // или эту способность вынести отдельно с возможностью прикреплять (лучше)
    if (this.attachedTo == this.droppingTo) {
      return;
    }

    this.droppingTo = this.attachedTo;

    this.attachedTo.addReagentFrom(this, {skipCap: true, validate: false});

    // анимация
    if (!this.dropping) {
      this.dropping = new modelNS.IReact.dropping({color: this.reagents[0].color}).render();
    }
    this.dropping.$el.appendTo(this.attachedTo.$el);
    this.dropping.startDropping();
  },

  stopDropping: function (equip) {
    if (this.dropping) {
      this.dropping.stopDropping();
    }

    if (this.attachedTo) {
      this.attachedTo.redirect(null);
    }

    // при окончательное отсоединение или перекрытии удаляем реагент
    if ((!this.attachedTo || this.model.get('status') == 'closed')
      && this.droppingTo
      && this.reagents.length
    ) {
      this.droppingTo.removeReagent(this.reagents[0]);
    }

    this.droppingTo = null;
  },

  // даже когда перекрыта, реагент может заливаться
  isClosed: function () {return false},


  informAboutOpen: function () {
    if (!IReact.equips.cap_dropper_closable.informedAboutOpen) {
      this.iReact.inform(this.$el, modelNS.lang("open_click"), {point:{valign: "top"}});
      IReact.equips.cap_dropper_closable.informedAboutOpen = true;
    }
  },

  hint: function (about) {
    if (about.status == 'open') {
      this.informAboutOpen();
    }
  },

});


modelNS.IReact.cap_dropper = modelNS.IReact.equipCanvas.extend({

	initialize: function(options) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "cap_dropper",
			src: "js/cap_dropper.js",
			color: options.color || null,
		});
	},

	// TODO: прием реагента - перекрашивание цвета
	animate_receive_liquid: function (reagent, options) {
		this.redraw({color: reagent.color});
	}

	// TODO: очистка

});

/* Крышка с капельницей */

// TODO: налить реагент когда крышка в пробирке
// TODO: запрет реакций в крышке (не более одного реагента)
// TODO: когда крышка вынимается, то реагент пропадает
//      возможно только визуально его пропадать нужно, до окончательного перемещения крышки
//      что бы реакции не запускались от того что реагент забирается
//      и не надо было реакцию прописывать на забирание реагента

IReact.equips.cap_dropper = IReact.equips.cap.extend({

  // способность элемента принимать другие элементы
  isReceiver: true,

  // поддерживаемые состояния
  supportedStates: 'liquid',

  // сколько ml по умолчанию передаст
  dose: 0.01,

  // сколько ml максимально примет за раз
  maxdose: Infinity,

  // по умолчанию содержит реагента
  size: 20,

  // увеличивать ли если добавляется реагент
  // hasZoomWhenReagentAdd: false,

  initialize: function (options) {
    IReact.equips.cap.prototype.initialize.apply(this, arguments);

    this.on("attached", function (equip) {
      this.startDropping(equip);
    }, this);

    this.on("detaching", function (equip) {
      this.stopDropping(equip);
    }, this);

    // окончательное отсоединение
    this.on("detach", function (equip) {
      this.disconnect(equip);
    }, this);

    this.on("reagentAdded", function () {
      this.startDropping();
    });
  },

  render: function () {
    IReact.equips.cap.prototype.render.apply(this, arguments);

    this.$el.attr({
      "react-valign": "top",
      "react-align": "center",
    });

    return this;
  },

  disconnect: function (equip) {
    if (equip && this.reagents.length) {
      equip.removeReagent(this.reagents[0]);
    }
  },

  startDropping: function () {
    if (!this.attachedTo) {
      return;
    }
    
    this.attachedTo.redirect(this);

    if (!this.reagents.length) {
      return;
    }

    // иногда повторно событие вызывается, когда пробирка в стенде, то первый раз через стенд
    // похоже на такой тип аттача нужно сделать настройку
    // что бы крышки событие срабатывало только для test_tube
    //  (intersectSuccess: ???) тогда крыша должна стать тулом
    // или эту способность вынести отдельно с возможностью прикреплять (лучше)
    if (this.attachedTo == this.droppingTo) {
      return;
    }

    this.droppingTo = this.attachedTo;

    this.attachedTo.addReagentFrom(this, {skipCap: true});

    // анимация
    if (!this.dropping) {
      this.dropping = new modelNS.IReact.dropping({color: this.reagents[0].color}).render();
    }
    this.dropping.$el.appendTo(this.attachedTo.$el);
    this.dropping.startDropping();
  },

  stopDropping: function (equip) {
    if (this.dropping) {
      this.dropping.stopDropping();
    }
    this.droppingTo = null;
    this.attachedTo.redirect(null);
  },

});


modelNS.IReact.cap_electrodes = modelNS.IReact.equipCanvas.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "glass_electrodes",
			src: "js/glass_electrodes.js",
			properties:{hasGlass:false, color:'', right_color:'', left_color:''},
			at: 0
		});
	}

});

/* Крышка для стакана с электродами */
IReact.equips.cap_electrodes = IReact.equips.cap.extend({

  render: function () {
    IReact.EquipView.prototype.render.apply(this, arguments);

    // var self = this;
    // this.$el.mousedown(function () {self.detaching()});
    // this.$el.mouseup(function () {if (!self.isDragging()) self.attach()});

    this.listenTo(this.model, "change:right_color", this.right_color);
    this.listenTo(this.model, "change:left_color", this.left_color);
    this.listenTo(this.model, "change:right_gasup", this.right_gasup);
    this.listenTo(this.model, "change:left_gasup", this.left_gasup);

    // встроеный функционал, при поломки установки
    this.on("setupBroken", this.gasupoff);

    // встроеный функционал, при отключении переключателя
    this.on("switchOff", this.gasupoff);

    return this;
  },

  gasupoff: function () {
    this.model.set("right_gasup", false);
    this.model.set("left_gasup", false);
  },

  spark: function () {
    this.animation.spark();
  },

  right_color: function (model, color) {
    this.animation.refresh({properties: {right_color:color}});
  },

  left_color: function (model, color) {
    this.animation.refresh({properties: {left_color:color}});
  },

  left_gasup: function (model, gasup) {
    this.gasup({
      name: 'leftgasup',
      gasup: gasup,
    });
  },

  right_gasup: function (model, gasup) {
    this.gasup({
      name: 'rightgasup',
      gasup: gasup,
    });
  },

  gasup: function (options) {
    if (options.gasup) {
      if (!this[options.name]) {
        this[options.name] = new modelNS.IReact.gasup({scale: 0.2, properties:{size:2, speed:1}}).render(this.$el);
        this[options.name].$el.addClass(options.name);
      }
    } else {
      if (this[options.name]) {
        this[options.name].remove();
        this[options.name] = null;
      }
    }
  },

  // ??????????? Если это оставить то после [revert] крышка не возвращается в объект
  // dragStop: function ($drop) {
  //   IReact.EquipView.prototype.dragStop.apply(this, arguments);
  //
  //   if (this.$el.hasClass('detaching')) this.detach();
  // },

});

/* Пробка со шлангом */
modelNS.IReact.cork_gastube = modelNS.IReact.equipCanvas.extend({

	// size: 1,	// ml

	visualParts: [{
			name: "cork_gastube",
			// part: "hose",
		}],

	initialize: function( options ) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
				name: "cork_gastube",
				src: "js/cork_gastube.js",
				properties: {part: "cork", gas: false},
			});
	},

	gasOn: function () {
		this.play({from:0, to:100, properties: {gas: true}, refresh: true})
	},

	gasOff: function () {
		this.refresh({properties: {gas: false}})
	}

});

// TODO: перемещения пробирки тянут шланг
// TODO: пузырьки (gas) в анимации = true

/* Крышка с газоотводной трубкой */
IReact.equips.cork_gastube = IReact.EquipView.extend({

    // конфиг, какие объекты могут быть присоеденены
    allowAttach: {
      gastube: true,
      needle: true,
    },

    // Позиция курсора после хватания
    cursorAt:[15, 60],

    render: function () {
      IReact.EquipView.prototype.render.apply(this, arguments);

      // индикатор соединения со шлангом
      // this.$el.attr('connection', 'gastube');

      var self = this;

      this.on("attached", function (equip) {
        this.listenGas(equip);
      }, this);

      this.on("detached", function (equip) {
        this.stopListenGas(equip);
      }, this);

      // не генерим тут gastube потому что иначе тяжело обращаться к нему
      // this.renderGastube();

      this.$el.attr({
        "react-valign": "top"
      });

      return this;
    },

    listenGas: function (equip) {
      for (var i=0; i<equip.reagents.length; i++) {
        var reagent = equip.reagents[i];
        if (reagent.state == 'gas') {
          this.gasOn(reagent);
          break;
        }
      }
      this.listenTo(equip, 'reagentAdded', function (reagent) {
        if (reagent.state == 'gas') {
          this.gasOn(reagent);
        }
      });
    },

    gasOn: function (gas) {
      this.gas = gas;
      this.animation.gasOn();
      if (this.gastube) {
        this.gastube.gasOn();
      }
    },

    stopListenGas: function (equip) {
      if (equip) {
        this.stopListening(equip);
      }

      this.gasOff();
    },

    gasOff: function (equip) {
      this.animation.gasOff();
      if (this.gastube) {
        this.gastube.gasOff();
      }

      // обнуляем газ после того как удалили
      this.gas = null;
    },

    // координаты наконечника для отрисовки шланга
    getHoseContact: function () {
      var rotation = this.getRotation();
  		if (rotation.angle === undefined) {
        if (this.attachedTo) {
          return this.position(4*CourseConfig.zoomScale, -38*CourseConfig.zoomScale); // wurtz_flask ?
        } else {
          return this.position(12*CourseConfig.zoomScale, 12*CourseConfig.zoomScale); // на столе
        }
  		} else {
        // в стенде
        return IReact.ViewUtils.rotate($.extend(rotation, {
          radius: rotation.radius,
          angle: rotation.baseAngle + rotation.angle, // базовый угол = 12.5
        }));
      }
    },

    // стенд -> пробирка-> пробка с трубкой
    // TODO: через конфиг?? пока что значения только для пробирки
    // либо передавать отступ и высоту (расчитывать сложением) тогда можно будет высчитать базовый угол и радиус (гипотенуза)
        // но поидее плохо для оптимизации?
        // включать только если angle != 0 ?
    // либо сделать что-бы пробка в стенде всегда на одной высоте была
    // getRotation: function () {
    //   return $.extend(IReact.equips.glassware.prototype.getRotation.apply(this, arguments), {
    //     radius: 102,
    //     baseAngle: 12.5
    //   });
    // },
});

/* Корковая пробка */
IReact.equips.cork = IReact.EquipView.extend({ // TODO: просто equip ?

	hasCanvas: false,

	isCap: true,

	render: function () {
		IReact.EquipView.prototype.render.apply(this, arguments);

		this.$img = $('<div class="img"/>').appendTo(this.$el);

		this.$el.attr({
			"react-valign": "top",
		});

		return this;
	}

});

// Интерфейс для мерного стакана, ниже наследования на 50, 100, 150 и 200 мл
modelNS.IReact.crystallizer = modelNS.IReact.equipCanvas.extend({

	// отображение поддерживает универсальную систему attach
	"react-object": true,

	visualParts: [{
		name: "crystallizer",
		part: "front",
	}],

	// высота реагента для полной емкости
	fullHeight: 31,

	initialize: function(options) {

		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);
// TODO: null - no glass

		this.loadMovie({
			name: "crystallizer",
			src: "js/crystallizer.js",
			properties: {part:'back'},
		});

	},

});

// Мерный стакан
IReact.equips.crystallizer = IReact.equips.glassware.extend({

  // может ли содержимое быть перемешанным посредством таскания мышкой
  mixableByDrag: false,

  // способность элемента принимать другие элементы
  isReceiver: false,

  maxSize: 200,
  minSize: 0,
  size: 100,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    glass_cylinder: true,
  },

  // initialize: function () {
  //   IReact.equips.glassware.prototype.initialize.apply(this, arguments);
  // },
});

/* Фильтровальная бумага */
IReact.equips.filter_paper = IReact.equips.glassware.extend({

  // способность элемента принимать другие элементы
  isReceiver: true,

  // size: 5,

  // можно ли перемешивать таская мышкой
  mixableByDrag: false,

  initialize: function () {
    IReact.equips.glassware.prototype.initialize.apply(this, arguments);

    this.listenTo(this.model, "change:oil", this.oil);
  },

  oil: function (model, oil) {
    this.renderOil();
  },

  renderOil: function () {
    this.$oil = $('<div class="oil"/>').appendTo(this.$el);
  }

});


/* Отображение фильтровальной бумаги */
modelNS.IReact.filter_paper = modelNS.IReact.animation.extend({

	hasCanvas: false,

});

modelNS.IReact.flaconpipette = modelNS.IReact.equipCanvas.extend({

	initialize: function( options ) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
				name: "flaconpipette",
				src: "js/flaconpipette.js",
				color: options.color,
				paint: options.paint || null,	// цвет стекла
			});
	},

	animate_init_liquid: function () {},
	animate_receive_liquid: function () {},

});

// Фласка с пипеткой
IReact.equips.flaconpipette = IReact.equips.glassware.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    pipette: true,
  },

  dose: 5,

  // инструмент управления (пипетка)
  // используется для демонстрации ответа
  tool: null,

  render: function () {
    IReact.equips.glassware.prototype.render.apply(this, arguments);

    this.on("attach:pipette", function (equip) {
      this.putinPipette(equip);
    }, this);

    this.on("detaching:pipette", function (equip) {
      this.takeoutPipette();
    }, this);

    this.renderPipette();

    return this;
  },

  renderPipette: function ()
  {
    var pipette = new IReact.equips.pipette({
      model: new IReact.EquipModel({
        type: 'pipette',
        dose: this.dose,
        disposable: false,
				// capfor: this,
        // id: this.model.get('id') + '_cap',
      }),
      iReact: this.iReact,
      parent: this.$parent,
    }).render();

    pipette.attachTo(this);
  },

  putinPipette: function (pipette)
  {
    // TODO: если пипетка полная то отмена и требование очистки пипетки? Если не тот же самый реагент?
    if (this.pipette) {
      return;
    }
    this.pipette = pipette;
    this.pipette.clear();
    this.setStatus("closed");
    this.animation.refresh({properties:{pipette:true}});

    // TODO: универсально, если в емкость встроен инструмент управления
    this.tool = pipette;
  },

  takeoutPipette: function () {
    this.pipette.addReagentFrom(this, {validate: false});
    this.animation.refresh({properties:{pipette:false}});
    this.pipette = null;
    this.setStatus("opened");

    this.tool = null;
  },

  checkClosed: function (equip) {
    if (equip.model.get('type') !== 'pipette' || this.pipette && this.pipette != equip) {
      this.wrong(modelNS.lang('use_pipette'), {to:this.pipette ? this.pipette.$el : this.$el});
      return true;
    }
  },

});

modelNS.IReact.flask = modelNS.IReact.equipCanvas.extend({

	initialize: function( options ) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.options = options;
		if (!this.options.properties) this.options.properties = {};

		this.loadMovie($.extend(this.options, {
			name: "flask",
			src: "js/flask.js",
			properties: {hasGlass:true},
			paint: options.paint || null,	// цвет стекла
		}));
	},

	animate_init_liquid: function () {

	},

	animate_receive_liquid: function () {

	},

});

modelNS.IReact.flask_cap = modelNS.IReact.animation.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "flask",
			src: "js/flask.js",
			properties:{hasGlass:false},
			at: 0
		});
	}

});

// Флакон / Банка
IReact.equips.flask = IReact.equips.glassware.extend({
  hasCap: true,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    flask_cap: true, // пробка
  },

});


/* Крышка для флакона */
IReact.equips.flask_cap = IReact.equips.cap.extend({

  // действия с объектом свободны от валидации
  isNotStrict: true,

});

modelNS.IReact.florence_flask_100 = modelNS.IReact.equipCanvas.extend({


	visualParts: [{
			name: "florence_flask_100",
			part: "front",
		}],

	initialize: function () {
		modelNS.IReact.equipCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "florence_flask_100",
			src: "js/florence_flask_100.js",
			properties: {part:"back"},
		});

	},

	animate_receive_liquid: function (reagent, options) {
		return this.addCircleReagent(reagent, options);
	},

	animate_init_liquid: function (reagent, options) {
		return this.addCircleReagent(reagent, $.extend(options, {init:1}));
	},


});

IReact.equips.florence_flask_100 = IReact.equips.glassware.extend({

	// может ли содержимое быть перемешанным посредством таскания мышкой
  mixableByDrag: false,

  // способность элемента принимать другие элементы
  isReceiver: true,

  // по умолчанию содержит реагента
  size: 80,

	minSize: 0,
	maxSize: 100,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    cork: true,
    cork_gastube: true,
  },

});

modelNS.IReact.florence_flask_500 = modelNS.IReact.equipCanvas.extend({


	visualParts: [{
			name: "florence_flask_500",
			part: "front",
		}],

	initialize: function () {
		modelNS.IReact.equipCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "florence_flask_500",
			src: "js/florence_flask_500.js",
			properties: {part:"back"},
		});

	},

	animate_receive_liquid: function (reagent, options) {
		return this.addCircleReagent(reagent, options);
	},

	animate_init_liquid: function (reagent, options) {
		return this.addCircleReagent(reagent, $.extend(options, {init:1}));
	},


});

IReact.equips.florence_flask_500 = IReact.equips.glassware.extend({

	// может ли содержимое быть перемешанным посредством таскания мышкой
  mixableByDrag: false,

  // способность элемента принимать другие элементы
  isReceiver: true,


  size: 400,

	minSize: 0,
	maxSize: 500,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    cork: true,
    cork_gastube: true,
  },

});

/* Газовая трубка за которую тянем */
modelNS.IReact.gastube = modelNS.IReact.equipCanvas.extend({

	initialize: function( options ) {
		modelNS.IReact.equipCanvas.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
				name: "cork_gastube",
				src: "js/cork_gastube.js",
				properties: {part: "gastube"},
			});
	},

	gasOn: function () {
		this.play({from:0, to:100, properties: {gas: true}, refresh: true})
	},

	gasOff: function () {
		this.refresh({properties: {gas: false}})
	}

});

// Резиновая трубка со стеклянным наконечником
IReact.equips.gastube = IReact.equips.tool.extend({

  // дополнительный элемент идентифицирующий контакт инструмента
  hasOutput: true,

  // список оборудования к которому трубка может прилипнуть
  allowConnect: ["cork_gastube", "kippa", "wurtz_flask", "test_tube_gas"],

  // селектор по элементам которые могут служить целью данного инструмента
  intersectSuccess: ".test_tube",

  /* --- настройки огня ---- */
  // наличие эффекта и способность его передовать (по умолчанию эффекта нет)
  hasEffect: false,

  // название эффекта
  effect: "burn",

  // Тип источника эффекта (открытый огонь и др) происходит ли передача эффекта onCatch
  effectMode: "open",
  /* --- настройки огня ---- */

  initialize: function (options) {
    IReact.equips.tool.prototype.initialize.apply(this, arguments);

    // способность загораться, облечает selector
    this.$el.attr('can_burn', "");

    // отслеживание смены состояния оборудования (горит / не горит)
    this.listenTo(this.model, "change:status", this.status);

    this.on("attached", function (equip) {
      this.putin(equip);
    }, this);

    this.on("detaching", function (equip) {
      this.takeout(equip);
    }, this);
  },

  render: function () {
    var self = this;

    this.$gastube = $('<div class="connection-line gastube-line"/>')
      .mousedown(function (event) {self.simulateStartDrag(event)})
      .appendTo(this.iReact.$zoomer);

    IReact.equips.tool.prototype.render.apply(this, arguments);

    this.on("attached", function (equip) {
      if (this.connectedTo.gas) this.gasOn();
      this.drawHose();
    }, this);

    this.on("detaching", function (equip) {
      this.equipGasOff(equip);
    }, this);

    this.$el.draggable({
      drag: function (event, ui) {
        self.onDrag(event, ui);
      },
      cursorAt: {left:3, top:10}
    })
    .attr({
      "react-valign": "middle",
    });

    return this;
  },

  // этот инструмент не наполняется
  // TODO: индикатор зажигания при наведении, фильтр инструментов на которые происходит индиктор?
  startFill: function () {
    return false;
  },

  // добавление огня
  addEffect: function (effect, options) {
    var gas = this.connectedTo.gas;
    // test_tube = this.connectedTo.attachedTo,
    //     reagents = test_tube && test_tube.reagents

    if (!gas) {
      return;
    }

    if (!this.iReact.validateStep(this, {status:"burn", from: options.from})) {
      return;
    }

    if (effect == 'burn') {
      this.model.set({status:"burn"});
      IReact.equips.tool.prototype.addEffect.apply(this, arguments);
    }
  },

  // переключение состояния (горит/не горит)
  status: function (model, status) {
    var gas = this.connectedTo.gas;

    if (status == 'burn') {
      // TODO: оптимизировать в метод?
      this.hasEffect = true;
      this.$el.attr("effect", this.effect); // TODO: все эффекты а не только один

      this.animation.flame({color:gas.burn});
    } else {
      this.hasEffect = false;
      this.$el.attr("effect", "");

      this.animation.flame(false);
    }

    this.iReact.verifyStep();
  },

  // передача огня
  addEffectTo: function (equip) {
    if (this.model.get('status') == 'burn') {
      equip.addEffect(this.effect);
    }
  },

  // симуляция начала движения по событию mousedown на шланге
  simulateStartDrag: function (event) {
    var draggable = this.$el.draggable("instance"),
         offset = draggable.offset,
         width = this.$el.width(),
         height = this.$el.height();

    this.$el.draggable({cursorAt:{left:width/2, top:10}});
    draggable._mouseDown( event );
  },

  // трубка в свободном режиме
  takeout: function (equip) {
    if (this.allowConnect.indexOf(equip.model.type)>=0) {
      this.$el.removeClass('putin');
      this.$gastube.show();

      // нельзя водить с огнем, гаснет огонь при вождении
      if (this.model.get('status') == 'burn') {
        this.model.set('status', '');
      }

      equip.$el.addClass('takeout-gastube');
    }
  },

  // трубка вставлена во что-то
  putin: function (equip) {
    if (this.allowConnect.indexOf(equip.model.type)>=0) {
      this.$el.addClass('putin connected');
      this.$gastube.hide();
      this.connectedTo = equip;
      equip.gastube = this;
      equip.$el.removeClass('takeout-gastube');

      // TODO: если переместить трубку на другой контакт
      if (!this.hose) {
        this.hose = new IReact.Hose({
          connection: equip,
        });
      }
    }
  },

  cacheStartHoseContact: function () {
    if (this.connectedTo) {
      this.startHoseContact = this.connectedTo.getHoseContact();
    }
  },

  dragStart: function () {
    this.cacheStartHoseContact();
    return IReact.EquipView.prototype.dragStart.apply(this, arguments);
  },

  onDrag: function (event, ui) {
    IReact.equips.tool.prototype.onDrag.apply(this, arguments);
    this.drawHoseEvent(event, ui);
  },

  drawHoseEvent: function (event, ui) {
    this.drawHose();
  },

  drawHose: function (startHoseContact, endHoseContact, options) {
    if (!startHoseContact) startHoseContact = this.startHoseContact;
    if (!endHoseContact) endHoseContact = this.getHoseContact(options);

    if (!startHoseContact) return;

    this.$gastube = modelNS.drawLine(startHoseContact.left, startHoseContact.top, endHoseContact.left, endHoseContact.top, this.$gastube);
  },

  getHoseContact: function (options) {
    var rotation = this.getRotation(),
        detaching = this.$el.parents('.equip').length == 0;

    if (!detaching) {
      // stand => test_tube => gastube
      if (this.attachedTo != this.connectedTo && rotation.angle) {
        return IReact.ViewUtils.rotate($.extend(rotation, {
          radius: 60,
          angle: 23.5 + rotation.angle, // базовый угол = 12.5
        }));
      }

      // glass_cylinder, временное решение
      else if (rotation.verticalReverse) {
        return this.position(4*CourseConfig.zoomScale, 72*CourseConfig.zoomScale);
      }
    }

    // перетягиваем кончик трубки
    return this.position(2*CourseConfig.zoomScale, 0*CourseConfig.zoomScale);
  },

  onDropInShelf: function (event, $shelf) {
    // уже перехвачено
		if (this.catchedBy) {
			return;
		}
		this.catchedBy = $shelf;

		if (!this.iReact.validateStep(this, {attachto:this.connectedTo.model.id})) {
			return;
		}

    this.attachTo(this.connectedTo);
    // this.revert();
  },

  animatePosition: function () {
    this.drawHose();
  },

  gasOn: function () {
    this.animation.gasOn();
    if (this.attachedTo && this.attachedTo != this.connectedTo) {
      this.attachedTo.addReagent(this.connectedTo.gas);
    }
  },

  gasOff: function () {
    this.animation.gasOff();
    if (this.attachedTo != this.connectedTo) {
      this.equipGasOff(this.attachedTo);
    }
  },

  equipGasOff: function (equip) {
    if (equip && equip != this.connectedTo && this.connectedTo.gas) {
      if (equip.canGasEscape) equip.removeReagent(this.connectedTo.gas.name, {initiator: 'gastube'});
    }
  },

});

// Дополнительный функционал шланга

IReact.Hose = Backbone.View.extend({

  initialize: function (options) {
    this.connection = options.connection;

    var self = this;

    // TODO: через событие + индикатор стартующий событие
    // this.connection.$el.draggable({
    //   drag: function (event, ui) {
    //
    //   },
    // });

    this.connection.dragTriggerEnable();

    this.listenTo(this.connection, "drag", function (event, ui) {
      this.onDrag(event, ui);
    });

    this.listenTo(this.connection, "attached", function (equip) {
      this.draw();
    });

    this.listenTo(this.connection, "dragStart", function () {
      this.cacheGastubeContact();
    });

    this.listenTo(this.connection, "dropInShelf", function () {
      self.draw();
    });

    // TODO: через событие + индикатор стартующий событие
    this.connection.animatePosition = function () {
      self.draw();
    };

  },

  onDrag: function () {
    this.connection.gastube.drawHose(this.connection.getHoseContact(), this.gastubeContact);
  },

  cacheGastubeContact: function () {
    this.gastubeContact = this.connection.gastube.getHoseContact();
  },

  draw: function (options) {
    this.connection.gastube.drawHose(this.connection.getHoseContact(options), this.gastubeContact);
  },

});

// Интерфейс для мерного стакана, ниже наследования на 50, 100, 150 и 200 мл
modelNS.IReact.glass_cylinder = modelNS.IReact.equipCanvas.extend({

	// отображение поддерживает универсальную систему attach
	"react-object": true,

	// высота реагента для полной емкости
	fullHeight: 100,

	initialize: function(options) {

		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "glass_cylinder",
			src: "js/glass_cylinder.js"
		});

	},

});

// Мерный стакан
IReact.equips.glass_cylinder = IReact.equips.glassware.extend({

  // может ли содержимое быть перемешанным посредством таскания мышкой
  mixableByDrag: false,

  // способность элемента принимать другие элементы
  isReceiver: false,

  supportedStates: "",

  size: 100,
  minSize: 0,
  maxSize: 200,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    gastube: true,
  },

  initialize: function () {
    IReact.EquipView.prototype.initialize.apply(this, arguments);

    this.listenTo(this.model, "change:freespace", this.freespace);
  },

  render: function () {
    IReact.equips.glassware.prototype.render.apply(this, arguments);
    this.$el.attr({
      "react-valign": "middle",
    });
    return this;
  },

  // жидкость должна возвращаться первой, без сортировки
  sortReagents: function () {
		// сортируем, газ передается первый потом вода и тд.
		this.reagents.sort(function (reagent, reagent2) {
			if (reagent.state == 'liquid') return -10;
			return 0;
		});
	},

  freespace: function (model, freesize) {
    if (!this.reagents.length) {
      return;
    }
    if (!this.attachedTo) {
      return;
    }
    var newsize = this.maxSize - parseInt(freesize);

    if (newsize<0) newsize = 0;

    var sizeout = this.reagents[0].size - newsize;

    // this.reagents[0].size = newsize;
    // this.animation.reagents.liquid.draw(this.reagents[0], {full: this.howMuchFull(this.reagents[0])});

    this.dose = sizeout;
    this.attachedTo.addReagentFrom(this, {validate: false});
  },

  getRotation: function () {
    return $.extend(IReact.equips.glassware.prototype.getRotation.apply(this, arguments), {
      // angle: 180
      verticalReverse: true
    });
  },

});

modelNS.IReact.glass = modelNS.IReact.equipCanvas.extend({

	// универсальная система отображения
	"react-object": true,

	visualParts: [{
			name: "glass_half",
			part: "down",
		},
		{// кусочек стакана передней части, тот который перекрывает заднюю, но при этом его может перекрыть верхняя часть электрокрышки
			name: "glass_half",
			part: "front",
		}],

	// высота реагента для полной емкости
	fullHeight: 41,

	initialize: function(options) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);
// TODO: null - no glass

		this.loadMovie({
			name: "glass_half",
			src: "js/glass_half.js",
			state: options.state || 'liquid',
			color: options.color || null,
			properties: {part:'front'},
			at:0,
		});

		// this.fume = new modelNS.IReact.fume().render(this.$parent);

		this.reacts = {};
		this.reacts.liquid = {	// used.. in lab where electrodes?
			name: "glass_half",
			state: 'liquid',
			at: 0
		};
	},

	// animate_init_liquid: function (reagent, options) {
	// 	return this.addCylinderReagent(reagent, $.extend(options, {full:1, init:true}));
	// },

	// animate_receive_liquid: function (reagent, options) {
	// 	return this.addCylinderReagent(reagent, options);
	// },

	// animate_remove_liquid: function (reagent, options) {
	// 	// если не процесс трансформирования
	// 	if (!options.transform) {
	// 		return this.animate_receive_liquid({}, {full:0})
	// 	}
	// },


	animate_init_powder: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	animate_receive_powder: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},


	// пока что поддерживается только черный цвет
	// animate_receive_cream: function ()
	// {
	// 	// TODO: color
	// 	this.open({
	// 		name: "glass_half",
	// 		properties: $.extend(this.options.properties, {
	// 			state:'cream',
	// 			down:false
	// 		}),
	// 		from: 0,
	// 		to: 35,
	// 		// at:35	// TODO: .at autoset in onMoviePlay ?? for cream ok, what about mix?? posible not use .at when have from ?
	// 							// возможно не запускать mix если state = cream?
	// 							// либо не запускать только когда идет реакция, по окончанию как-то определять что анимация закончилась и проигрывать как с водой, только фрейм последний
	// 							// управлять временным from что бы знать откуда запускать если прервано вытягиванием палочки
	// 							// пока что используется только в змее фараона 8-03 и там блокируется палочка
	// 	});
	// 	return {zoomable: true}
	// },

	discharge: function () {
		modelNS.IReact.animation.prototype.discharge.apply(this, arguments);	// discharge?

		this.refresh({	// used.. in lab where electrodes?
			name: "glass_half",
			state: null,
			at: 0,
			from: null,
			to: null,
		});

		console.log(this.options)
	},

	rod: function (rod) {
		if (rod == "mix") {
			// if (this.options.state ==
			this.options = $.extend(this.options, {
				properties: $.extend(this.options.properties, {rod: rod}),
				from: 0,
				to: 69,
			});
			this.open(this.options);
		} else {
			this.options = _.omit(this.options, "from", "to");
			this.options.properties = $.extend(this.options.properties, {rod: rod});
			this.open(this.options);
		}
	}

});

// Стакан
IReact.equips.glass = IReact.equips.glassware.extend({

  // может ли содержимое быть перемешанным посредством таскания мышкой
  mixableByDrag: false,

  // способность элемента принимать другие элементы
  isReceiver: true,

  maxSize: 200,
	minSize: 0,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    test_tube: true,
    rod: true,
    cap_electrodes: true,
    gastube: true,
  },

  initialize: function () {
    IReact.equips.glassware.prototype.initialize.apply(this, arguments);

    this.on("attach:rod", function (rod) {
      this.onRodAttached(rod);
    }, this);

    this.on("detaching:rod", function (rod) {
      this.onRodTouch(rod);
    }, this);

    this.on("detach:rod", function (rod) {
      this.onRodDetach(rod);
    }, this);
  },

  onRodAttached: function (rod) {
    this.animation.rod(true);
    if (!this.wasMixInform) { // TODO: add event and .once ??
      rod.inform(modelNS.lang("mix_click"));
      this.wasMixInform = true;
    }
    this.listenTo(rod, "mix", function () {
      this.rod_mix();
    });
    this.$el.removeClass("mixing");
  },

  onRodTouch: function (rod)
  {
    this.animation.rod(false);
  },

  onRodDetach: function (rod)
  {
    this.stopListening(rod);
  },

  rod_mix: function ()
  {
    this.$el.addClass("mixing"); // временное решение, нам надо менять размер области калочки когда идет анимация перемешивания
    this.animation.rod("mix");

    this.listenToOnce(this.animation, "played", function () {
      this.addEffect("mix");
      this.$el.removeClass("mixing");
    });
  },

});

IReact.equips.labels = IReact.EquipView.extend({

  render : function ()
  {
    IReact.EquipView.prototype.render.apply(this, arguments);

    this.$el.draggable( "disable" );

    return this;
  },

  // onDrop : function ($drop)
  // {
  //   IReact.EquipView.prototype.onDrop.apply(this, arguments);
  //
  //   if ($drop.hasClass('label') && $drop.parent()[0] != self.$labels[0]) {
  //     self.onLabelDrop(self.$labels, $drop);
  //   }
  // }
});

IReact.equips.gluesticker = IReact.EquipView.extend({

  _render : function ()
  {
    IReact.EquipView.prototype.render.apply(this, arguments);

    var reagent = this.model.get("for"),
        html = this.model.get("html");

    // pack ?
    // this.$labels = this.iReact.$el.find('.labels');

    this.$el
      .attr("for", reagent)
      .draggable({
        // revert : true,
        // stop : function (event, ui)
        // {
        //   console.log(ui)
        // }
      })
      .html(html);

    // random position
    this.$el[Math.random() >= 0.5 ? 'appendTo' : 'prependTo'](this.$labels);

    return this.$el;
  },

  // это если нужна будет область куда метки должны групироваться
  // onDropInShelf: function (event, $shelf) {
  //   if (!this.$el.parent(".labels").length) {
  //     this.$el
  // 			.appendTo(this.$labels)
  // 			.css({left:'auto', top:'auto'});
  //   } else {
  //     this.revert();
  //   }
  // },

  // setShelf : function () {return false},
  // onDroppedIn : function () {return false},
  // up : function () {return false},

});

modelNS.IReact.indicator_pack = modelNS.IReact.animation.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "indicator_pack",
			src: "js/indicator_pack.js",
			at: 0,
		});
	},

});

/* Универсальный индиктор */
IReact.equips.indicator_pack = IReact.EquipView.extend({

    zoomer: true,

    allowAttach: {
      indicator: true
    },

    colors: [
      "#a51a54",
      "#c01f44",
      "#cb2836",
      "#df2c23",
      "#fe6b2a",
      "#eb7804",
      "#face1c",
      "#dab90a",
      "#4ba805",
      "#15761d",
      "#014103",
      "#0a1d1c",
      "#020c54",
    ],

    render: function ()
    {
      IReact.EquipView.prototype.render.apply(this, arguments);

      // colors
      // for (var c=0; c<this.colors.length; c++) {
      //   var color = this.colors[c];
      //   var $color = $('<div class="icolor"/>').css({
      //     background: color
      //   }).appendTo(this.$el);
      //   $('<div class="inum"/>').html(c).appendTo($color);
      // }

      this.$indicators = $('<div class="indicators"/>').appendTo(this.$el);

      // indicators
      for (var i=0; i<6; i++) {
        this['$indicator' + i] = this.$indicators;
        this['$indicator' + i + '_used'] = this.$el; // slotName for uset indicators
        this.newIndicator({
          slotName: 'indicator' + i
        });
      }

      // создаем индикатор который вытягивается из коробки
      // this.newIndicator();

      return this;
    },

    newIndicator: function (options) {
      if (!options) options = {};

      var indicarot = new IReact.equips.indicator({
        model: new IReact.EquipModel({type: 'indicator'}),
        iReact: this.iReact,
        parent: this.$parent,
        slotName: options.slotName,
      }).render();

      indicarot.attachTo(this);
    }

});

/* Универсальный индиктор */
IReact.equips.indicator = IReact.equips.tool.extend({

    // нам не нужен класс 'glassware'
    className: 'equip',

    size: 1,

    isTool: true,
    toolType: ["liquid"],
    repositoryType: [],

    // способность элемента принимать другие элементы
    // isReceiver: true,

    // можно ли приблизить предмет
  	zoomer: false,

    initialize: function () {
      IReact.EquipView.prototype.initialize.apply(this, arguments);

      this.on('attached', function (equip) {
        this.onAttached(this.attachedTo);
      });

      this.on('reagentAdded', function (reagent) {
        this.indicate(reagent);
      });

      this.listenTo(this.model, 'change:status', function (model, status) {
        this.colorize(status);
      });
    },

    onAttached: function (equip) {
      if (!equip || equip.reagents.length != 1) {
        return;
      }

      var reagent = equip.reagents[0];

      this.indicate(reagent);
    },

    indicate: function (reagent) {
      var color = IReact.equips.indicator_pack.prototype.colors[reagent.indicator];

      if (reagent.indicator !== undefined) {
        this.model.set({status: reagent.indicator});
      }

      this.isReceiver = false;
      this.isSender = false;

      // мы не можем очищать, потому что по реагенту ставится условие в шагах
      // this.clear();
    },

    colorize: function (ph) {
      var color = IReact.equips.indicator_pack.prototype.colors[ph];

      if (!this.$ph) this.$ph = $("<div class='ph'/>").appendTo(this.$el);

      this.$el.attr('ph', ph);

      this.$ph.animate({"backgroundColor": color}, 1000);
      this.slotName += '_used';
    }

});

modelNS.IReact.kippa = modelNS.IReact.equipCanvas.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name : "kippa",
			src : "js/kippa.js",
			at : 0
		});

		this.loadMovie({
			name : "kippa_open",
			src : "js/kippa_open.js",
			open:false
		});
	},

	open_tap: function ()
	{
		this.play({
			name:"kippa_open",
			from:0,
			to:100
		});
	},

	close_tap: function ()
	{
		this.play({name:"kippa"});
	}

});

IReact.equips.kippa = IReact.equips.glassware.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    gastube: true,
  },

  // способность элемента принимать другие элементы (зависит от поддержки, и.. если это стакан то надо как-то определять что в него нелья?)
  isReceiver: false,

  // способность что-то передовать, по суте это есть тип glassware ?
  isSender: true,

  // поддерживаемые состояния
	supportedStates: 'gas',

  render: function () {
    IReact.equips.glassware.prototype.render.apply(this, arguments);

    var self = this;

    this.$el.click(function () { self.toggle() });

    this.listenTo(this.model, "change:status", this.status);

    // this.hose = new IReact.Hose({
    //   connection: this,
    // });

    return this;
  },

  toggle: function () {
    var status = this.model.get('status') == 'active' ? 'closed' : 'active';

    if (!this.iReact.validateStep(this, {status:status})) {
      return;
    }

    this.model.set('status', status);
  },

  status: function (model, status) {
    if (status == 'active') {
      this.$el.addClass('act');
      this.animation.open_tap();
      this.active = true;

      if (!this.checkSetupComplete()) { // zoom Kippa on activate, if its not start reaction
        this.iReact.zoom(this, {duration: 1200});
      }

      this.gas = this.reagents[0];

      if (this.gastube) {
        this.gastube.gasOn();
      }
    } else {
      this.animation.close_tap();
      this.active = false;

      this.gas = null;

      if (this.gastube) {
        this.gastube.gasOff();
      }
    }
  },

  // координаты наконечника для отрисовки шланга
  getHoseContact: function () {
    return this.position(0*CourseConfig.zoomScale, 204*CourseConfig.zoomScale);
  },

  informAboutActive: function () {
    if (!IReact.equips.kippa.informedAboutActive) {
      this.iReact.inform(this.$el, modelNS.lang("open_click"));
      IReact.equips.kippa.informedAboutActive = true;
    }
  },

  hint: function (about) {
    if (about.status == 'active') {
      this.informAboutActive();
    }
  },

});

modelNS.IReact.lamp = modelNS.IReact.animation.extend({

	initialize: function( options ) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
				name: "lamp",
				src: "js/lamp.js",
				at: 0
			});
	},

	render: function () {
		modelNS.IReact.animation.prototype.render.apply(this, arguments);

		this.$light = $('<div class="light"/>').appendTo(this.$parent).css('opacity', 0);

		return this;
	},

	light: function (light) {
		if (light == 'on') light = 0.8;
		if (light == 'onhalf') light = 0.4;
		if (light == 'off') light = 0;

		this.$light.css('opacity', light);
	}

});

// Лампа
IReact.equips.lamp = IReact.EquipView.extend({
  initialize: function () {
    IReact.EquipView.prototype.initialize.apply(this, arguments);

    // по умолчанию выключена
    this.model.set('status', 'off');

    this.listenTo(this.model, "change:status", this.status);

    // встроеный функционал лампы, при поломки установки она гаснет
    this.on("setupBroken", this.off);

    // встроеный функционал лампы, при отключении переключателя она гаснет
    this.on("switchOff", this.off);
  },

  status: function (model, status) {
    this.animation.light(status);
  },

  off: function () {
    this.model.set('status', 'off');
  }

});

modelNS.IReact.matchbox = modelNS.IReact.animation.extend({

	initialize: function() {

		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name : "matchbox",
			src : "js/matchbox.js",
			at : 0,
			x:-25,
			y:-45
		});

	}

});

modelNS.IReact.matchbox = modelNS.IReact.equipCanvas.extend({

	initialize: function() {

		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name : "matchbox",
			src : "js/matchbox.js",
			at : 0,
			x:-25,
			y:-45
		});

	}

});

IReact.equips.matchbox = IReact.EquipView.extend({

    hasEffect: true,
    effect: "burn",

    // Тип источника эффекта (например открытый огонь или только способ получания огня)
    // от этого зависит если перенести на предмет произойдет ли переача эффекта
    effectMode: "closed",

    addEffectTo: function (equip) {
      equip.addEffect(this.effect, {from:this});
      modelNS.IReact.AudioUtils.playAudio("matchbox.mp3");
    }

});

/* Ступка */
modelNS.IReact.mortar = modelNS.IReact.equipView.extend({

	initialize: function( options ) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
				name : "mortar",
				src : "js/mortar.js",
				color : options.color
			});
	},

	mill: function ()
	{
		this.play({from:0, to:80});
	},

	// заглушки, реагентов не видно внутри
	animate_receive_powder: function () {},
	animate_receive_crystal: function () {},
	animate_remove_crystal: function () {},

});

// Ступка
IReact.equips.mortar = IReact.equips.glassware.extend({

  // может ли содержимое быть перемешанным посредством таскания мышкой
  mixableByDrag: false,

  // способность элемента принимать другие элементы
  isReceiver: true,

  // увеличивать ли если добавляется реагент
  hasZoomWhenReagentAdd: false,

  render: function () {
    IReact.equips.glassware.prototype.render.apply(this, arguments);

    var self = this;
    this.$pestle = $('<div class="pestle"/>')
      .click(function () {self.mill()})
      .appendTo(this.$el);

    // this.on("reagentAdded", function () {
    //   this.informAboutMill();
    // }, this);

    return this;
  },

  informAboutMill: function () {
    if (!IReact.equips.mortar.informedAboutMill) {
      this.iReact.inform(this.$pestle, modelNS.lang("grind"));
      IReact.equips.mortar.informedAboutMill = true;
    }
  },

  mill: function () {
    if (!this.iReact.validateStep(this, {action:"mill"})) {
      return;
    }

    this.off("reagentAdded");
    this.animation.mill();
    this.closeTooltip();
    this.zoom();

    this.animation.once("played", function () {
      this.zoom(false);
      if (this.reagents.length) {
          this.addEffect('mill');
      }
    }, this);
  },

  hint: function (condition) {
    if (condition.action == 'mill') this.informAboutMill();
  },
});

/* Игла */
IReact.equips.needle = IReact.EquipView.extend({

  "react-object": true,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    slideglass: true, // предметное стекло
  },

	/* --- настройки огня ---- */
  // наличие эффекта и способность его передовать (по умолчанию эффекта нет)
  hasEffect: false,

  // название эффекта
  effect: "burn",

  // Тип источника эффекта (открытый огонь и др) происходит ли передача эффекта onCatch
  effectMode: "open",
  /* --- настройки огня ---- */

	initialize: function () {
		IReact.EquipView.prototype.initialize.apply(this, arguments);

		// отслеживание смены состояния оборудования (горит / не горит)
    this.listenTo(this.model, "change:status", this.status);
	},

	render: function () {
		IReact.EquipView.prototype.render.apply(this, arguments);

		$('<div class="svg-wrap"><div class="svg"/></div>').appendTo(this.$el);

		// способность загораться, облечает selector
    this.$el.attr('can_burn', "");

		return this;
	},

	// добавление огня
  addEffect: function (effect, options) {
    var gas = this.attachedTo && this.attachedTo.gas;

    if (!gas || !gas.burn) {
      return;
    }

    if (!this.iReact.validateStep(this, {status:"burn", from: options.from})) {
      return;
    }

    if (effect == 'burn') {
      this.model.set({status:"burn"});
      IReact.equips.tool.prototype.addEffect.apply(this, arguments);
    }
  },

	// переключение состояния (горит/не горит)
  status: function (model, status) {
    var gas = this.attachedTo.gas;

    if (status == 'burn') {
      // TODO: оптимизировать в метод?
      this.hasEffect = true;
      this.$el.attr("effect", this.effect); // TODO: все эффекты а не только один

			this.flame = new modelNS.IReact.flame({color:gas.burn}).render(this.$el);
    } else {
      this.hasEffect = false;
      this.$el.attr("effect", "");

      this.flame.remove();
			this.flame = null;
    }

    this.iReact.verifyStep();
  },

	// TODO: передача огня, по суте может поддерживаться если пробирку перетащить
	// но событие не вызовется
	// + если отсоединить иголку огонь должен потухнуть или вообще ошибка опасная
	// триген на пробирку вешать??
  addEffectTo: function (equip) {
    // if (this.model.get('status') == 'burn') {
    //   equip.addEffect(this.effect);
    // }
  },

});

modelNS.IReact.petri = modelNS.IReact.animation.extend({

	initialize: function( options ) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
				name: "petri",
				src: "js/petri.js",
				color: options.color,
				properties: {oil_film:null}
			});
	},

	animate_receive_liquid: function (reagent, options) {
		this.refresh({color:reagent.color})
	},

	// кастомный эффект, что-бы не разбирать стенку
	oil_film: function (options) {
		this.refresh({properties:{oil_film:options.color}});
	},

});

// Чаша петри, плоская низкая, для масла
IReact.equips.petri = IReact.equips.glassware.extend({

  // способность элемента принимать другие элементы
  isReceiver: true,

  size: 5,

  // можно ли перемешивать таская мышкой
  mixableByDrag: false,

});

/* Пипетка */
modelNS.IReact.pipette_2 = modelNS.IReact.equipCanvas.extend({

	size: 2,	// ml

	initialize: function( options ) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
				name : "pipette_2",
				src : "js/pipette_2.js",
				color : options.color
			});
	},

	animate_receive_liquid: function (reagent, options)	{
		this.open({
			name : "pipette_2",
			properties: {color:reagent.color}
		});
	},

	discharge: function () {
		this.open({
			name : "pipette_2",
			properties: {color:""}
		});
	}

});

/* Пипетка */
IReact.equips.pipette_2 = IReact.equips.tool.extend({

    toolType : ["liquid"],
    dose: 2,
    size: 2,

    // упрощенная верификация, достаточно выполнить один раз за шаг
    simpleVerify: true,

    // дополнительный элемент идентифицирующий контакт инструмента
    // кончик пипетки
    hasOutput: true,

    // увеличивать ли если добавляется реагент
  	hasZoomWhenReagentAdd: false,

    // после использования отправляется в лоток для использованого оборудования
    disposable: true,

    // расположение сукрсора при хватании элемента
    cursorAt: {left:10, top:20},

    // initialize: function ()
    // {
    //   IReact.equips.tool.prototype.initialize.apply(this, arguments);
    // },
    //
    // render: function ()
    // {
    //   IReact.equips.tool.prototype.render.apply(this, arguments);
    //
    //   return this;
    // }
});

/* Наследуем контейнер для инструментов в виде стакана */
modelNS.IReact.pipette_pack = modelNS.IReact.tools_pack.extend({

});

/* Набор пипеток */
IReact.equips.pipette_pack = IReact.equips.tools_pack.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    pipette: true,
  },

  // тип инструмента
  toolType: 'pipette',

  // количество инструментов в паке
  toolsCount: 7,

});

/* Пипетка */
modelNS.IReact.pipette = modelNS.IReact.equipCanvas.extend({

	size: 1,	// ml

	initialize: function( options ) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
				name : "pipette",
				src : "js/pipette.js",
				color : options.color
			});
	},

	animate_receive_liquid: function (reagent, options)	{
		this.open({
			name : "pipette",
			properties: {color:reagent.color}
		});
	},

	clear: function () {
		this.refresh({color:""});
	},

	discharge: function () {
		this.clear();
	}

});

/* Пипетка */
IReact.equips.pipette = IReact.equips.tool.extend({

    toolType : ["liquid"],
    dose: 1,
    size: 10,

    // упрощенная верификация, достаточно выполнить один раз за шаг
    simpleVerify: true,

    // дополнительный элемент идентифицирующий контакт инструмента
    // кончик пипетки
    hasOutput: true,

    // увеличивать ли если добавляется реагент
  	hasZoomWhenReagentAdd: false,

    // после использования отправляется в лоток для использованого оборудования
    disposable: true,

    // initialize: function ()
    // {
    //   IReact.equips.tool.prototype.initialize.apply(this, arguments);
    // },
    //
    // render: function ()
    // {
    //   IReact.equips.tool.prototype.render.apply(this, arguments);
    //
    //   return this;
    // }
});

modelNS.IReact.plate = modelNS.IReact.animation.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name : "plate",
			src : "js/plate.js",
			at : 0
		});
	},

});


/* Капля */
modelNS.IReact.dropper = modelNS.IReact.animation.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "dropper",
			src: "js/dropper.js",
			at: 0
		});
	},

	animate_receive_liquid: function (reagent, options)
	{
		this.refresh({color: reagent.color});
	}

});

modelNS.IReact.plate = modelNS.IReact.equipCanvas.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name : "plate",
			src : "js/plate.js",
			at : 0
		});
	},

});


/* Капля */
modelNS.IReact.dropper = modelNS.IReact.animation.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "dropper",
			src: "js/dropper.js",
			at: 0
		});
	},

	animate_receive_liquid: function (reagent, options) {
		this.refresh({color: this.mostReagent(reagent, options).color});
	}

});

/* Фарфоровая плстинка */
IReact.equips.plate = IReact.EquipView.extend({

  render: function ()
  {
    IReact.EquipView.prototype.render.apply(this, arguments);

    this.$droppers = $('<div/>').appendTo(this.$el);

    this.droppers = [];

    for (var i=0; i<7; i++) {
      this.droppers.push(
        new IReact.equips.dropper({
          model: new IReact.EquipModel({
            type: "dropper",
            id: this.model.id + "-dropper" + (i+1),
            label: i+1,
          }),
          iReact: this.iReact,
          parent: this.$droppers
        }).render()
      )
    }

    var label = this.model.get('label');

    if (label) {
      $('<div/>')
        .appendTo(this.$el)
        .addClass('label')
        .html(label);
    }

    return this;
  }

});


/* Капля */
IReact.equips.dropper = IReact.EquipView.extend({

  isReceiver: true,

  isDraggable: false,

  // класс который добавляется элементу как индикатор что элемент активен для взаимодействия
  activeClass: "active",



});

/* Наследуем контейнер для инструментов в виде стакана */
modelNS.IReact.rod_pack = modelNS.IReact.tools_pack.extend({

});

/* Набор стеклянных палочек */
IReact.equips.rod_pack = IReact.equips.tools_pack.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    rod: true,
  },

  // тип инструмента
  toolType: 'rod',

  // количество инструментов в паке
  toolsCount: 7,

});

/* Ступка */
modelNS.IReact.rod = modelNS.IReact.equipCanvas.extend({

	initialize: function( options ) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
				name : "rod",
				src : "js/rod.js",
				color : options.color
			});
	},

	mix: function () {
		return this.$el.animate({
			left: -7,
		}, 400).animate({
			left: 7,
		}, 800).animate({
			left: -7,
		}, 400).animate({
			left: 0,
		}).promise();
	},

	animate_receive_liquid: function (reagent, options) {
		this.refresh({color:reagent.color});

		if (options.elasticity) {
			return this.animate_elasticity(reagent, options);
		}
	},

	animate_elasticity: function (reagent, options) {
		var promise = $.when(),
				self = this,
				from = options.from,
				$rod = this.$parent.clone() // настоящий элемент делает .revert()
					.attr('shelf', true),	// анимация настроена на родителя лежащего на полке
				$elasticity = $('<div class="elasticity"/>').css({
					background: reagent.color
				}).appendTo($rod);

		this.$el.appendTo($rod);

		$rod.appendTo(from.$el);

		promise = promise.then(function () {
				$rod.css({
					zIndex: 0,
					left: -33,
					transform: "rotate(-90deg)",
					top: 70,
				}).stop().animate({
					top:0
				}, 3000);

				$elasticity.animate({
					 width: 72,
					 height: 1,
				}, {
					duration: 3000
				});

				return $elasticity.promise();
			}).then(function () {
				return $({}).delay(100).promise();
			}).then(function () {
				// возвращаем в состояние до анимации
				// $elasticity.remove();
				self.$el.appendTo(self.$parent);
				$rod.stop().remove();
			});

		return promise;
	},

});

/* Шпатель */
IReact.equips.rod = IReact.equips.tool.extend({
    size: 1,

    isTool: true,
    toolType: ["liquid"],
    repositoryType: [],

    events: {
      click: "mix",
    },

    // упрощенная верификация, достаточно выполнить один раз за шаг
    simpleVerify: true,

    // элемент для точности соприкосновения
    hasOutput: true,

    // расположение сукрсора при хватании элемента
    cursorAt: {left:10, top:25},

    // увеличивать ли если добавляется реагент
  	hasZoomWhenReagentAdd: false,

    initialize: function () {
      IReact.equips.tool.prototype.initialize.apply(this, arguments);

      // this.listenTo(this.model, "change:disable", function () {
      //   this.disable();
      // });

      // this.on("attached", function () {
      //   this.checkIsCanMix();
      // }, this);
    },

    // checkIsCanMix: function () {
    //   if (this.iReact.validateStep(this.attachedTo, {action: "mix", from: this})) {
    //     // this.$el.addClass('mixable');
    //     this.informAboutMix();
    //   }
    // },

    render: function () {
      IReact.equips.tool.prototype.render.apply(this, arguments);

      var self = this;

      // с подсказкой смотрится лучше
      // this.$mix = $('<div class="mix"/>')
        // .appendTo(this.$el);

      return this;
    },

    mix: function () {
      if (!this.attachedTo || this.disabled) {
          return;
      }

      if (!this.iReact.validateStep(this.attachedTo, {action: "mix", from: this})) {
        return;
      }

      var self = this;
      this.animation.mix().then(function () {
        self.iReact.notify(modelNS.lang("mixed"), {duration:1000});
        self.attachedTo.addEffect("mix", {from: self});
      });
    },

    // переопределяем зум при необходимости (анимация тягучести)
    // для тестов: .addReagent({state:'liquid', color:"#000000", name:'testreagent', elasticity:100, size:20})
    animationStart: function (reaction, options) {
      if (!reaction) reaction = {};

      // в чем разница между options.from и options.reagent.from ??
      // вроде как одно и тоже, просто в разных местах опции используются, и при создании реагента тоже

      // Если есть elasticity >= 100 запускаем визуальную демонстрацию
      var from = options && options.from,
          reagent = options && options.reagent;
      if (from.model.get('type') == 'test_tube') {
         if (reagent.elasticity >= 100) {
           reaction.zoomable = true;
           options.zoomEquip = options.from;
           options.elasticity = true; // индикатор для анимации
         }
      }
      return IReact.equips.tool.prototype.animationStart.apply(this, [reaction, options]);
    },

    informAboutMix: function () {
      if (!IReact.equips.rod.informedAboutMix) {
        this.iReact.inform(this.$el, modelNS.lang("mix"), {point:{valign: "top"}})
        IReact.equips.rod.informedAboutMix = true;
      }
    },

    hint: function (condition) {
      if (condition.action == "mix") {
        this.informAboutMix();
      }
    }

    //
    // onDrag: function (event, ui) {
    //   IReact.equips.tool.prototype.onDrag.apply(this, arguments);
    //   this.checkingMix(event, ui);
    // },

    // в пробирке возможно 2 положения, одно из них - прилипает ко дну
    // checkingMix: function (event, ui) {
    //   if (this.attachedTo && this.attachedTo.model.type == 'test_tube') {
    //     var status = this.model.get('status'),
    //         top = ui.position.top - this.savedPosition.top, // (status == 'bottom' ? 20 : 0),
    //         left = ui.position.left - this.savedPosition.left,
    //         backlash = 8;
    //
    //     if (Math.abs(left) < 20 && Math.abs(top) < 50) {
    //       if (left < -backlash) ui.position.left = this.savedPosition.left - backlash;
    //       if (left > backlash) ui.position.left = this.savedPosition.left + backlash;
    //       ui.position.top = this.savedPosition.top;
    //     }
    //   }
    // },



    // Старое, для стакана
    // mix: function ()
    // {
    //   if (!this.attachedTo || this.disabled) {
    //     return;
    //   }
    //
    //   this.trigger("mix");
    // }
});


modelNS.IReact.slideglass = modelNS.IReact.equipCanvas.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "slideglass",
			src: "js/slideglass.js",
			properties:{soot:false},
		});
	}

});

/*  */
IReact.equips.slideglass = IReact.EquipView.extend({

  // размещение в родительском оборудовании
  valign: "top",

  render: function () {
    IReact.EquipView.prototype.render.apply(this, arguments);

    this.listenTo(this.model, "change:soot", this.soot);

    return this;
  },

  soot: function (model, soot) {
    this.animation.refresh({properties: {soot:soot}});
  },

  // что-бы реакция с сажей пошла, что-то должно быть реактором
  isReactor: function () {
    return true;
  }

});

modelNS.IReact.spatula = modelNS.IReact.equipView.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name : "spatula",
			src : "js/spatula.js",
			at : 0,
		});

	},

	animate_receive_powder: function (reagent, options) {
		this.addSimpleReagent(reagent);
	},

	animate_receive_liquid: function (reagent, options) {
		this.addSimpleReagent(reagent);
	},

});

/* Шпатель */
IReact.equips.spatula = IReact.equips.tool.extend({
    toolType : ['powder', 'crystal'],
    repositoryType : [],
    size: 30,
    dose: 30,

    // упрощенная верификация, достаточно выполнить один раз за шаг
    simpleVerify: true,

    // селектор по элементам которые могут служить целью данного инструмента
    intersectSuccess: ".test_tube",

    // дополнительный элемент идентифицирующий контакт инструмента
    hasOutput: true,

    // render : function ()
    // {
    //   IReact.EquipView.prototype.render.apply(this, arguments);
    //   this.$el.css('border', '1px solid green');
      // this.$el.droppable({})
    // },
});

/* Лучина */
modelNS.IReact.splinter = modelNS.IReact.animation.extend({

	initialize: function(options) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		var self = this;

		this.loadMovie({
			name: "splinter",
			src: "js/splinter.js",
			// status: options.status || "open",
		});
	},

	render: function () {
		modelNS.IReact.animation.prototype.render.apply(this, arguments);
		return this;
	},

	burn: function (options) {
		this.flame($.extend({color:'rgba(255,0,0,0.773)', smoke: false}, options));	// default
		if (this.$smolder) this.$smolder.hide();
	},

	smolder: function () {
		if (!this.$smolder) this.$smolder = $('<div class="smolder"/>')
			.appendTo(this.$el);
		this.$smolder.show();
		this.smoke();
	},

	smoke: function () {
		this.flame({color:'rgba(255,255,255,0.5)', smoke:true});
	}

	// open: function (options)
	// {
	// 	if (options.status == "active") {
	// 		options.from = 0;
	// 		options.to = 10;
	// 	}
	// 	modelNS.IReact.animation.prototype.open.apply(this, arguments);
	// }

});

/* Подставка для Лучины */
IReact.equips.splinter_block = IReact.EquipView.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    splinter: true
  },

});

modelNS.IReact.splinter_block = modelNS.IReact.animation.extend({

  // визуальные составлющие, представляются отдельными канвасами
  visualParts: [{
      name: "splinter_block",
      part: "over",
    }],

	initialize: function(options) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		var self = this;

		this.loadMovie({
			name: "splinter_block",
			src: "js/splinter_block.js",
			properties: {part: "under"},
		});
	},

});

/* Лучина */
modelNS.IReact.splinter = modelNS.IReact.equipCanvas.extend({

	initialize: function(options) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		var self = this;

		this.loadMovie({
			name: "splinter",
			src: "js/splinter.js",
			// status: options.status || "open",
		});
	},

	render: function () {
		modelNS.IReact.animation.prototype.render.apply(this, arguments);
		return this;
	},

	burn: function (options) {
		this.flame($.extend({color:'rgba(255,0,0,0.773)', smoke: false}, options));	// default
		if (this.$smolder) this.$smolder.hide();
	},

	smolder: function () {
		if (!this.$smolder) this.$smolder = $('<div class="smolder"/>')
			.appendTo(this.$el);
		this.$smolder.show();
		this.smoke();
	},

	smoke: function () {
		this.flame({color:'rgba(255,255,255,0.5)', smoke:true});
	}

	// open: function (options)
	// {
	// 	if (options.status == "active") {
	// 		options.from = 0;
	// 		options.to = 10;
	// 	}
	// 	modelNS.IReact.animation.prototype.open.apply(this, arguments);
	// }

});

/* Лучина */
IReact.equips.splinter = IReact.equips.tool.extend({

  // расположение сукрсора при хватании элемента
  cursorAt: {left:120, top:8},

  // дополнительный элемент идентифицирующий контакт инструмента
  hasOutput: true,

  // селектор по элементам которые могут служить целью данного инструмента
  intersectSuccess: ".test_tube,[can_burn]" ,

  hasEffect: false,
  effect: "burn",

  // Тип источника эффекта (например открытый огонь или только способ получания огня)
  // от этого зависит если перенести на предмет произойдет ли переача эффекта
  effectMode: "open",

  // не может быть реактором
  isReactor: function () {
    return false;
  },

  // этот инструмент не наполняется
  // TODO: индикатор зажигания при наведении, фильтр инструментов на которые происходит индиктор?
  startFill: function () {
    return false;
  },

  // реагент не добавляется
  addReagent: function () {
    return false;
  },

  addEffectTo: function (equip) {
    if (this.model.get('status') == 'active') {
      equip.addEffect(this.effect, {from:this});
    }
  },

  initialize: function () {
    var self = this;

    IReact.equips.tool.prototype.initialize.apply(this, arguments);

    this.listenTo(this.model, "change:status", this.status);
    this.listenTo(this, "attached", this.checkGasBurn);
    this.listenTo(this, "detaching", this.defaultBurn);
  },

  render: function () {
    IReact.equips.tool.prototype.render.apply(this, arguments);

    // check mixing
    this.$el.draggable({
      drag: function (event, ui) {return self.onDrag(event, ui)}
    });

    var self = this;

    this.status = "";

    return this;
  },

  // если у объекта к которому присоединились есть реагенты с аттрибутом огня
  // то если тлеет или горит - меняем цвет пламени
  // вообще на будущее у реагента должно быть 2 параметра для огня, цвет горения, и способность увеличивать пламя (кислород)
  checkGasBurn: function (equip) {
    var status = this.model.get('status');
    if (status != 'active' && status != 'smolder') {
      return;
    }

    var gas = equip.findReagentByState('gas');
    if (gas && gas.burn) {
      this.model.set('status', 'active');
      this.animation.burn({color:gas.burn});
    }
  },

  // возвращаем стандартный цвет горения
  defaultBurn: function () {
    var status = this.model.get('status');
    if (status == 'active') {
      this.animation.burn();
    }
  },

  status: function (model, status) {
    if (status == 'active') {
      // TODO: оптимизировать в метод?
      this.hasEffect = true;
      this.$el.attr("effect", this.effect); // TODO: все эффекты а не только один

      this.animation.burn();
      this.iReact.verifyStep();
    } else if (status == 'smolder') {
      // TODO: оптимизировать в метод?
      this.hasEffect = false;
      this.$el.attr("effect", null); // TODO: все эффекты а не только один

      this.animation.smolder();
      this.iReact.verifyStep();
    }
  },

  addEffect: function (effect, options) {
    if (!options) options = {};

    if (effect == "burn") {
      if (!this.iReact.validateStep(this, {status:"active", from:options.from})) {
        return;
      }
      this.model.set({status:"active"});
      IReact.equips.tool.prototype.addEffect.apply(this, arguments);
    }

    if (effect == "mix" && this.model.get('status') == 'active') {
      if (!this.iReact.validateStep(this, {status:"smolder"})) {
        return;
      }

      this.model.set({status:"smolder"});
      IReact.equips.tool.prototype.addEffect.apply(this, arguments);
    }
  },

  onDropInShelf: function () {
    this.revert();
  },

  onDrag: function (event, ui)	{
    if (this.hasOutput) {
      IReact.equips.tool.prototype.onDrag.apply(this, arguments);
    }
    this.mixing(ui);
  },

  // Тут используется тот же эффект что и в mix
  // нужно подумать, может как-то оформить в удобное подключение mix ?
  // потому как он сейчас только для емкостей, и тут его отдельно копировать приходится
  dragStart: function (event, ui) {
    IReact.equips.tool.prototype.dragStart.apply(this, arguments);
    if (this.iReact.validateStep(this, {status:"smolder"})) {
      this.startMixing(ui);
    }
  },

  startMixing : function (ui) {
    if (this.model.get('status') != 'active') {
      return;
    }

    if (this.Progress) {
      return;
    }

    this.Progress = new modelNS.ProgressCircle({
      parent:this.$el,
      color:"rgb(91,202,229)",
      radius:13,
      lineWidth:1
    })
    .render();

    this.Progress.$el.addClass("mix-progress");

    this.Progress.once("done", function () {
      this.mixed();
    }, this);

    this.Progress.on("progress", function (val) {
      this.Progress.$el.css('opacity', val);
    }, this);

    this.fromPosition = ui ? ui.position : this.$el.position();

    // this.dragStartTime = Date.now();
    // this.dragDistance = 0;
    // this.startPosition = this.mixingPosition = {left:ui.position.left, top:ui.position.top};
  },

  mixed: function () {
    if (this.model.get('status') != 'active') {
      return;
    }

    this.iReact.notify(modelNS.lang("smolder"), {duration:1000});
    this.stopMixing();

    // if (this.attachedTo) {  // ??? для тлеет это не нужно
      // this.once("attached", function () {
        this.addEffect("mix");
      // }, this);
    // } else {
      // this.addEffect("mix");
    // }
  },

  dragStop: function (event, ui) {
    IReact.equips.tool.prototype.dragStop.apply(this, arguments);

    this.stopMixing(ui);
  },

  stopMixing: function (ui) {
    if (this.Progress) {
      this.Progress.remove();
      this.Progress = null;
    }
  },

  mixing: function (ui) {
    if (this.model.get('status') != 'active') {
      return;
    }

    if (!this.Progress) {
      return;
    }

    var position = ui ? ui.position : this.position(),
        left = position.left,
        top = position.top;

    if (this.Progress) {
      var value = Math.abs(left-this.fromPosition.left) + Math.abs(top-this.fromPosition.top);
      this.fromPosition = {left:left, top:top};

      this.Progress.progress(this.Progress.value+value*0.001);
    }
  },

  distance : function (from, to) {
    var x1 = from.left,
        y1 = from.top,
        x2 = to.left,
        y2 = to.top,
        a = x1 - x2,
        b = y1 - y2;

    return Math.sqrt( a*a + b*b );
  },


});

/* Наследуем контейнер для инструментов в виде стакана */
modelNS.IReact.spoon_pack = modelNS.IReact.tools_pack.extend({

});

/* Набор ложечек */
IReact.equips.spoon_pack = IReact.equips.tools_pack.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    spoon: true,
  },

  // тип инструмента
  toolType: 'spoon',

  // количество инструментов в паке
  toolsCount: 7,

});

/* Ложечка для пробирок */
modelNS.IReact.spoon = modelNS.IReact.equipView.extend({
    hasCanvas: false,

    animate_receive_powder: function (reagent, options) {
  		this.addSimpleReagent(reagent, options);
  	},

    animate_receive_liquid: function (reagent, options) {
      this.addSimpleReagent(reagent, options);
    },
});

/* Ложечка для пробирок */
IReact.equips.spoon = IReact.equips.tool.extend({

    // размещение в родительском оборудовании
    valign: "top",

    // какие типы реагентов поддерживает
    toolType: 'powder liquid',

    // render: function () {
    //   IReact.equips.tool.prototype.render.apply(this, arguments);
    //
    //   this.$el.attr({
    //     "react-valign": "top"
    //   });
    //
    //   return this;
    // }

});

// Колба
// TODO: реакция срабатывает когда реагенты добавлены но крышка не закрыта
IReact.equips.stand_reverse = IReact.equips.stand.extend({
  className: "equip stand stand_reverse",

  initialize: function () {
    IReact.equips.stand.prototype.initialize.apply(this, arguments);
  },

  render: function () {
    IReact.equips.stand.prototype.render.apply(this, arguments);
    return this;
  },

});

modelNS.IReact.switch = modelNS.IReact.equipCanvas.extend({

	initialize: function( options ) {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
			name : "switch",
			src : "js/switch.js",
			at : 7
		});
	},

	turnON : function (complete) {
		this.play({
      from : 7,
      to : 14,
      complete : complete
    });
	},

	turnOFF: function (complete) {
		this.play({
      from : 0,
      to : 7,
      complete : complete
    });
	}

});

/* Переключатель */
IReact.equips.switch = IReact.EquipView.extend({

  indicators: ["lamp", "cap_electrodes"],

  initialize: function () {
    IReact.EquipView.prototype.initialize.apply(this, arguments);

    // по умолчанию выключена
    this.model.set('status', 'off');

    this.listenTo(this.model, "change:status", this.status);
  },

  render: function () {
    IReact.EquipView.prototype.render.apply(this, arguments);

    var self = this;

    this.$el.click(function () { self.toggle() });

    return this;
  },

  status: function (model, status) {
    var self = this;

    if (status == 'on') {
      this.animation.turnON(function () {
        self.checkReaction();
        self.iReact.verifyStep();
      });
    } else {
      this.animation.turnOFF(function () {
        self.switchOffTrigger();
        self.iReact.verifyStep();
      });
    }
  },

  // автоматически тушим индикатор если он есть в сборке
  switchOffTrigger: function () {
    if (!this.setup) {
      return;
    }

    for (var i=0; i<this.indicators.length; i++) {
      var $indicator = this.$parent.find('[type="'+this.indicators[i]+'"]');
      if ($indicator.length) $indicator.data('equip').trigger("switchOff", this);
    }
  },

  toggle: function () {
    if (this.model.get('status') == 'on') {
      this.model.set('status', 'off');
    } else {
      this.model.set('status', 'on');
    }
  }

});

modelNS.IReact.test_tube_gas = modelNS.IReact.test_tube.extend({

	reagentsInCap: "granules crystal chips",

	visualParts: [{
		name: "test_tube_3",
		part: "front",
	},{
		name: "test_tube_gas",
		part: "cap",
	},{
		name: "test_tube_gas",
		part: "tube",
	}],

	initialize: function () {
		modelNS.IReact.test_tube.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "test_tube_gas",
			src: "js/test_tube_gas.js",
			open: false,
		});
	},

	receiveReagent: function (reagent, options) {
		if (this.reagentsInCap.indexOf(reagent.state) >= 0) {
			this.$reagentParent = this.parts.cap.$el;
		} else {
			this.$reagentParent = this.$parent;
		}

		return modelNS.IReact.test_tube.prototype.receiveReagent.apply(this, arguments);
	},



});

// Колба
// TODO: реакция срабатывает когда реагенты добавлены но крышка не закрыта
IReact.equips.test_tube_gas = IReact.equips.test_tube.extend({
  className: "equip glassware test_tube test_tube_gas",

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    gastube: true,
  },

  supportedStatesClosed: "liquid",
  supportedStatesOpen: "granules chips crystal",

  // разрешено ли распологаться на полке
  canPlaceInShelf: true,

  initialize: function () {
    IReact.equips.test_tube.prototype.initialize.apply(this, arguments);

    // по умолчанию открыта
    this.model.set('status', 'open');

    this.on('reagentAdded', function (reagent) {
      if (reagent.state == 'gas') {
        this.gasOn(reagent);
      }
    });

    this.on('reagentRemoved', function (reagent) {
      if (reagent.state == 'gas') {
        this.gasOn(reagent);
      }
    });

    this.listenTo(this.model, "change:status", this.status);

    if (this.model.get('status') == 'closed') {
      this.supportedStates = this.supportedStatesClosed;
    } else {
      this.supportedStates = this.supportedStatesOpen;
    }
  },

  render: function () {
    IReact.equips.test_tube.prototype.render.apply(this, arguments);

    var self = this;

    this.$el.find("[part='cap']").click(function () { self.toggle() });

    return this;
  },

  status: function (model, status) {
    // this.checkSetupComplete();

    if (status == "closed") {
      // this.closeCap(this);
      this.supportedStates = this.supportedStatesClosed;
    } else {
      // this.openCap(this);
      this.supportedStates = this.supportedStatesOpen;
    }

    this.iReact.verifyStep();
  },

  informAboutReagentWrong: function (equip) {
    var reagent = equip.reagents[0];
    if (this.model.get('status') == 'closed'
      && this.supportedStatesOpen.indexOf(reagent.state) >= 0
    ) {
      this.wrong(modelNS.lang('cap_closed'), {
        to: this.$el,
        point:{valign: "top"},
      });
    } else if (this.model.get('status') == 'open'
      && this.supportedStatesClosed.indexOf(reagent.state) >= 0
    ) {
      this.wrong(modelNS.lang('close_cap'), {
        to: this.$el,
        point:{valign: "top"},
      });
    }
	},

  toggle: function () {
    var status = this.model.get("status") == "closed" ? "open" : "closed";

    if (!this.iReact.validateStep(this, {status:status})) {
      return;
    }

    this.model.set({status:status});
  },

  // даже когда закрыто, может принимать реагент
  checkClosed: function (equip, options) {
		return false;
	},

  // координаты наконечника для отрисовки шланга
  getHoseContact: function () {
    return this.position(48*CourseConfig.zoomScale, 34*CourseConfig.zoomScale);
  },

  gasOn: function (gas) {
    this.gas = gas;
    // TODO: по трубке идет газ
    // this.animation.gasOn();
    if (this.gastube) {
      this.gastube.gasOn();
    }
  },

  gasOff: function () {
    this.gas = null;
    // TODO: по трубке идет газ
    // this.animation.gasOff();
    if (this.gastube) {
      this.gastube.gasOff();
    }
  },

  informAboutClosed: function () {
    if (!IReact.equips.test_tube_gas.informedAboutClosed) {
      this.iReact.inform(this.$el, modelNS.lang("close_click"), {point:{valign: "top"}})
      IReact.equips.test_tube_gas.informedAboutClosed = true;
    }
  },

  hint: function (about) {
    if (about.status == 'closed') {
      this.informAboutClosed();
    }
  },

});

modelNS.IReact.test_tube_reverse = modelNS.IReact.test_tube.extend({

});

// Перевернутая пробирка
IReact.equips.test_tube_reverse = IReact.equips.test_tube.extend({
  className: "equip glassware test_tube test_tube_reverse",

  // может ли газ улетучиваться
  canGasEscape: false,

  getRotation: function () {
    // TODO: учитывать родительский поворот

    return {
      verticalReverse: true,
    }
  },

  // removeReagent: function (reagent, options) {
  //   if (!options) options = {};
  //
  //   // перевернутая пробирка сохраняет газ
  //   if (options.initiator == 'gastube') {
  //     return;
  //   }
  //
  //   return IReact.equips.test_tube.prototype.removeReagent.apply(this, arguments);
  // }

});

/* Наследуем контейнер для инструментов в виде стакана */
modelNS.IReact.therm_pack = modelNS.IReact.tools_pack.extend({

});

/* Набор пипеток */
IReact.equips.therm_pack = IReact.equips.tools_pack.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    therm: true,
  },

  // тип инструмента
  toolType: 'therm',

  // количество инструментов в паке
  toolsCount: 5,

});

modelNS.IReact.therm = modelNS.IReact.animation.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "therm",
			src: "js/therm.js",
			at: 0,
			properties: {temperature:IReact.roomTemperature}
		});
	},

});

/* Термометр */
IReact.equips.therm = IReact.EquipView.extend({

  // cursorAt: [0, 100],

  // при отсоединении элемента, ставить курсор по центру элемента
  detachingCursorAtCenter: true,

  // теплопроводность, урощенная, кол-во градусов / секунду
  transcalency: 100/10,

  render: function () {
    IReact.EquipView.prototype.render.apply(this, arguments);

    this.listenTo(this.model, "change:temperature", function (mode, temperature) {
      this.setTemperature(temperature);
    });

    this.$el.draggable({cursorAt:this.cursorAt});

    this.tooltip(IReact.roomTemperature+"°");

    return this;
  },

  setTemperature: function (temperature)
  {
    this.animation.refresh({properties:{temperature:temperature}});
    this.tooltip(temperature+"°", {content:temperature+"°"});
  },

  // у градусника свой алгоритм повышения температуры, стабильных 24 градуса в секунду
  // temperatureSpeed: function ()
  // {
  //   return 1/1000;
  // }

});

/* Тигельная (фарфоровая) чаша */
IReact.equips.tigel = IReact.EquipView.extend({

  // размер емкости
  size: 20,

  // наличие эффекта и способность его передовать
  hasEffect: false, // по умолчанию эффекта нет

  effect: "burn",

  // способность элемента принимать другие элементы
  isReceiver: true,

  // увеличивать ли если добавляется реагент
  hasZoomWhenReagentAdd: false,

  initialize: function () {
    IReact.EquipView.prototype.initialize.apply(this, arguments);

    // способность загораться, облечает selector
    this.$el.attr('can_burn', "");
    
    this.listenTo(this.model, "change:status", this.status);
  },

  // добавление огня
  addEffect: function (effect, options) {
    if (!this.reagents.length) {
      return;
    }

    if (!this.reagents[0].burn) {
      return;
    }

    if (!this.iReact.validateStep(this, {status:"burn", from:options.from})) {
      return;
    }

    if (effect == 'burn') {
      this.model.set({status:"burn"});
      IReact.equips.tool.prototype.addEffect.apply(this, arguments);
    }
  },

  status: function (model, status) {
    var burn = this.reagents[0].burn;

    if (status == 'burn') {
      // TODO: оптимизировать в метод?
      this.hasEffect = true;
      this.$el.attr("effect", this.effect); // TODO: все эффекты а не только один

      this.animation.flame({color:burn});
    } else {
      this.hasEffect = false;
      this.$el.attr("effect", "");

      this.animation.flame(false);
    }

    this.iReact.verifyStep();
  },

});

// что бы был доступен огонь
modelNS.IReact.tigel = modelNS.IReact.animation.extend({

});


/* Секундомер */
IReact.equips.timer = IReact.EquipView.extend({

  events: {
    'mousedown .speedslow': 'clearTimer',
    'mousedown .speedup': 'speedUp',
    'mousedown .normalspeed': 'toggleTimer',
  },

  render: function () {
    IReact.EquipView.prototype.render.apply(this, arguments);

    var self = this;

    this.$time = $('<div class="time"/>').appendTo(this.el);

    this.$speedup = $('<div class="timer-but speedup"/>').appendTo(this.el);
    this.$clear = $('<div class="timer-but speedslow"/>').appendTo(this.el);
    this.$start = $('<div class="timer-but normalspeed"/>').appendTo(this.el);

    if (isIE()) {
      this.fixSVG();
    }

    // this.listenTo(this.iReact, "timer", this.time);
    this.startedAt = 0;
    this.time(0);

    return this;
  },

  clearTimer: function (options) {
    if (!options) options = {};

    if (!options.system && !this.iReact.validateStep(this, {wait:0, from:this})) {
      return;
    }

    this.time(this.startedAt);
    this.pauseTimer();
    this.seconds = 0;
  },

  pauseTimer: function () {
    // console.log('pauseTimer')
    this.stopListening(this.iReact, "timer");
    this.isPlaying = false;
    this.normalSpeed();
  },

  toggleTimer: function () {
    if (!this.isPlaying) {
      this.playTimer();
    } else {
      this.pauseTimer();
    }
  },

  playTimer: function () {
    if (!this.iReact.validateStep(this, {wait:true, from:this})) {
      return;
    }
    this.startedAt = this.iReact.seconds - this.seconds;
    this.listenTo(this.iReact, "timer", this.time);
    this.isPlaying = true;

    this.informAboutSpeedUp();
  },

  speedSlow: function () {
    this.iReact.timeSpeed /= 10;
    if (this.iReact.timeSpeed < 1) this.iReact.timeSpeed = 1;
  },

  speedUp: function () {
    if (this.isPlaying) this.iReact.timeSpeed *= 10;
  },

  normalSpeed: function () {
    this.iReact.timeSpeed = 1;
  },

  time: function (seconds) {
    seconds = seconds - this.startedAt;

    var wait = this.iReact.validateStep(this, {wait:seconds, from:this});
    if (wait !== true) {
      if (seconds >= wait) {
        seconds = wait;
        this.pauseTimer();
      }
    }

    var ss = seconds%60,
        mm = (seconds-ss)/60%60,
        hh = ((seconds-ss)/60 - mm)/60;

    if (ss < 10) ss = '0' + ss;
    if (mm < 10) mm = '0' + mm;
    if (hh < 10) hh = '0' + hh;

    this.$time.html(hh + ':' + mm + ':' + ss);

    this.seconds = seconds;
  },

  informAboutClear: function () {
    if (!IReact.equips.timer.informedAboutClear) {
      this.iReact.inform(this.$clear, modelNS.lang("timer_but_clear"));
      IReact.equips.timer.informedAboutClear = true;
    }
  },

  informAboutStart: function () {
    if (!IReact.equips.timer.informedAboutStart) {
      this.iReact.inform(this.$start, modelNS.lang("timer_but_start"));
      // this.iReact.inform(this.$clear, modelNS.lang("timer_but_clear"));
      IReact.equips.timer.informedAboutStart = true;
    }
  },

  informAboutStop: function () {
    if (!IReact.equips.timer.informedAboutStop) {
      this.iReact.inform(this.$start, modelNS.lang("timer_but_start"));
      IReact.equips.timer.informedAboutStop = true;
    }
  },

  informAboutSpeedUp: function () {
    if (!IReact.equips.timer.informedAboutSpeedUp) {
      this.iReact.inform(this.$speedup, modelNS.lang("timer_but_speedup"));
      IReact.equips.timer.informedAboutSpeedUp = true;
    }
  },

  hint: function (about) {
    if (about.stop) {
      this.informAboutStop();
    } else if (about.wait == 0) {
      this.informAboutClear();
    } else {
      this.informAboutStart();
    }
  },

});

modelNS.IReact.tubes_stand_front = modelNS.IReact.animation.extend({

	initialize: function() {
		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);

		var self = this;

		this.$el.addClass("tubes_stand_front");
	},

	render: function ()
	{
		modelNS.IReact.animation.prototype.render.apply(this, arguments);

		this.play({
			name: "tubes_stand",
			at: 0,
			properties: {front:true}
		});
	}

});


// modelNS.IReact.tubes_stand = modelNS.IReact.animation.extend({
//
// 	initialize: function() {
// 		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);
//
// 		var self = this;
//
// 		this.loadMovie({
// 			name: "tubes_stand",
// 			src: "js/tubes_stand.js",
// 			at: 0,
// 			properties: {front:false}
// 		});
// 		window.tubes = this;
// 	},
//
// 	render: function () {
// 		modelNS.IReact.animation.prototype.render.apply(this, arguments);
// 		this.renderFront();
// 		return this;
// 	},
//
// 	renderFront: function ()
// 	{
// 		this.front = new modelNS.IReact.animation({
// 			className: "canvas-wrap tubes_stand_front"
// 		}).render(this.$parent);
//
// 		modelNS.FileManager.once("ready:tubes_stand", function () {
// 			this.drawFront();
// 		}, this);
// 	},
//
// 	drawFront: function ()	// TODO: проверять загрузился ли tubes_stand, и отрисовывать только после его загрузки
// 	{
// 		this.front.play({
// 			name: "tubes_stand",
// 			at: 0,
// 			properties: {front:true}
// 		});
// 	},
//
// 	zoomIn: function ()
// 	{
// 		modelNS.IReact.animation.prototype.zoomIn.apply(this, arguments);
// 		this.front.zoomIn();
// 	},
//
// 	zoomOut: function ()
// 	{
// 		modelNS.IReact.animation.prototype.zoomIn.apply(this, arguments);
// 		this.front.zoomOut();
// 	}
//
// });

/* Полочка для пробирок */
IReact.equips.tubes_stand = IReact.EquipView.extend({

  // не работает, т.к. хоть только пробирки и можно засунуть, остальные элементы должны возвращаться назад
  // accept: '.test_tube',

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    test_tube: true,
  },

  initialize: function ()
  {
    IReact.EquipView.prototype.initialize.apply(this, arguments);
  },

  render: function () {
    IReact.EquipView.prototype.render.apply(this, arguments);

    this.$front = $('<div class="tubes_stand-front"/>').appendTo(this.$el);

    // svg если фоном то не скалятся в ие, а фоном надо что бы менять через css (РЭШ)
    if (isIE()) {
      this.fixSVG();
    }

    this.on("beforeAttachTo:test_tube", function (tube) {
      this.beforeTubeAttached(tube);
    }, this);

    return this;
  },

  // перед тем как добавится пробирка, определяем ей место при необходимости
  beforeTubeAttached: function (tube) {
    var position = tube.model.get('position');
    if (!position || this.slots['tube'+position]) {
      tube.setPosition(this.freePosition());
    }
  },

  // возвращает название слот для tube (свободный)
  freePosition: function () {
    for (var p=1; p<=6; p++) {
      if (!this.slots['tube'+p]) break;
    }
    // TODO: если слоты все забиты

    return p;
  },

  fixSVG: function () {
    IReact.EquipView.prototype.fixSVG.apply(this, arguments);

    // front  // TODO: global method
    var src = this.$front.css('background-image').replace(/url\(\"(.*)\"\)/gi, '$1');
    if (src.indexOf('.svg') > 0) {
      $('<img/>').attr('src', src).appendTo(this.$front);
      this.$front.css('background', 'none');
    }
  },

  addReagentFrom: function () {
    return false;
  },

});

/* Наследуем контейнер для инструментов в виде стакана */
modelNS.IReact.tweezers_pack = modelNS.IReact.tools_pack.extend({

});

/* Набор пинцетов */
IReact.equips.tweezers_pack = IReact.equips.tools_pack.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    tweezers: true,
  },

  // тип инструмента
  toolType: 'tweezers',

  // количество инструментов в паке
  toolsCount: 5,

});

/* Набор пинцетов */
IReact.equips.tweezers_tigel_pack = IReact.equips.tools_pack.extend({

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    tweezers_tigel: true,
  },

  // тип инструмента
  toolType: 'tweezers_tigel',

  // количество инструментов в паке
  toolsCount: 5,

});

/* Наследуем контейнер для инструментов в виде стакана */
modelNS.IReact.tweezers_tigel_pack = modelNS.IReact.tools_pack.extend({

});

/* Отображение Пинцета */
modelNS.IReact.tweezers_tigel = modelNS.IReact.animation.extend({

	hasCanvas: false,

	render: function( options ) {
		modelNS.IReact.animation.prototype.render.apply(this, arguments);

		this.$up = $('<div class="tweezers_up"/>').appendTo(this.$el);
		this.$down = $('<div class="tweezers_down"/>').appendTo(this.$el);

		this.$reagentParent = this.$down;

		return this;
	},

	clench: function () {

	},

	unclench: function () {

	},


		animate_receive_chips: function (reagent, options) {
			modelNS.IReact.animation.prototype.animate_receive_chips.apply(this, arguments);

			if (options.elasticity) {
				return this.animate_elasticity(reagent, options);
			}
		},

		animate_elasticity: function (reagent, options) {
			var promise = $.when(),
					self = this,
					from = options.from,
					$equip = this.$parent,
					$scene = $equip.parent(),	// TODO: если из другой сборки пришли щипцы
					saveCss = { // сохраняем состояние (не понятно, если был прерван .revert() то как это вообще работает?)
						zIndex: $equip.css('zIndex'),
						left: $equip.css('left'),
						top: $equip.css('top'),
						transform: "", // $equip.css('transform'), - управление через css
					},
					$elasticity = $('<div class="elasticity"/>').css({
						background: reagent.color
					}).appendTo($equip);

			$equip.appendTo(from.$el);

			promise = promise.then(function () {

					$equip.finish().css({	// finish - завершаем .revert()
						zIndex: 0,
						left: -146,
						top: 0,
					}).animate({
						left: -146 - reagent.elasticity
					}, 3000);

					$elasticity.animate({
						 width: reagent.elasticity,
					}, {
						duration: 3000
					});

					return $elasticity.promise();
				}).then(function () {
					return $elasticity.animate({
						 width: 0,
					}, {
						duration: 100
					}).promise();
				}).then(function () {
					// возвращаем в исходное состояние
					$elasticity.remove();
					$equip.stop().css(saveCss).appendTo($scene);
				});

			return promise;
		},


});

/* Тигельные щипцы */
IReact.equips.tweezers_tigel = IReact.equips.tool.extend({

  isTool: true,
  // TODO: разобраться с supportedStates в чем разница?
  toolType: ['granules', 'chips', 'crystal', 'wirew'],
  repositoryType: [],

  // поддерживаемые состояния
  supportedStates: 'granules, chips, crystal, wirew',

  // расположение сукрсора при хватании элемента
  cursorAt: {left:100, top:30},

  // упрощенная верификация, достаточно выполнить один раз за шаг
  simpleVerify: true,

  // дополнительный элемент идентифицирующий контакт инструмента
  // кончик пинцета
  hasOutput: true,

  // увеличивать ли если добавляется реагент
  hasZoomWhenReagentAdd: false,

  addReagentFrom: function () {
    IReact.equips.tool.prototype.addReagentFrom.apply(this, arguments);
    this.animation.clench();
  },

  // переопределяем зум при необходимости (анимация растягивания)
  animationStart: function (reaction, options) {
    if (!reaction) reaction = {};

    // Если есть elasticity >= 100 запускаем визуальную демонстрацию
    var from = options && options.from,
        reagent = options && options.reagent,
        type = from && from.model.get('type');
    if (type == 'tweezers_tigel') { // только для при получении реагента из других щипцов
       if (reagent.elasticity !== null) {
         reaction.zoomable = true;
         options.zoomEquip = options.from;
         options.elasticity = true; // индикатор запуска анимации растягивания

         // прерываем драг-дроп, если это было наведение
         this.cancelDrag();
       }
    }
    return IReact.equips.tool.prototype.animationStart.apply(this, [reaction, options]);
  },
});

/* Отображение Пинцета */
modelNS.IReact.tweezers = modelNS.IReact.equipCanvas.extend({

	initialize: function( options ) {
		modelNS.IReact.equipCanvas.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadMovie({
				name: "tweezers",
				src: "js/tweezers.js",
				// at: 7,
			});
	},

	render: function( options ) {
		modelNS.IReact.equipCanvas.prototype.render.apply(this, arguments);
		this.$reagentParent = this.$el;
		return this;
	},

	clench: function () {
		this.play({from:0, to:7});
	},

	unclench: function () {
		this.play({from:7, to:14});
	}

});

/* Пинцет */
IReact.equips.tweezers = IReact.equips.tool.extend({
    isTool: true,
    toolType: ['granules', 'chips', 'crystal'],
    repositoryType: [],

    // поддерживаемые состояния
    supportedStates: 'granules, chips, crystal',

    // расположение сукрсора при хватании элемента
    cursorAt: {left:63, top:65},

    // дополнительный элемент идентифицирующий контакт инструмента
    // кончик пинцета
    hasOutput: true,

    // увеличивать ли если добавляется реагент
  	hasZoomWhenReagentAdd: false,

    // упрощенная верификация, достаточно выполнить один раз за шаг
    simpleVerify: true,

    addReagentFrom: function () {
      IReact.equips.tool.prototype.addReagentFrom.apply(this, arguments);
      this.animation.clench();
      // this.$reagent.css({
      //   color: this.reagents[0].color
      // });
    }
});

// Интерфейс для мерного стакана, ниже наследования на 50, 100, 150 и 200 мл
modelNS.IReact.used_tools = modelNS.IReact.equipCanvas.extend({

	// отображение поддерживает универсальную систему attach
	"react-object": true,

	visualParts: [{
		name: "used_tools",
		part: "front",
	}],

	initialize: function(options) {

		modelNS.IReact.animation.prototype.initialize.apply(this, arguments);
// TODO: null - no glass

		this.loadMovie({
			name: "used_tools",
			src: "js/used_tools.js",
			properties: {part:'back'},
		});

	},

});

// Контейнер для использованого оборудования
IReact.equips.used_tools = IReact.EquipView.extend({

  initialize: function () {
    this.allowAttach = $.extend({}, this.allowAttach); // общий конфиг не переписываем
    IReact.EquipView.prototype.initialize.apply(this, arguments);

    // this.on("equipAttached", this.checkIsCorrect)
  },

  onCatch: function (equip) {
    var equips = this.$el.find('.equip');
    this.allowAttach[equip.model.type] = {slotName: 'slot-' + equips.length};
    return IReact.EquipView.prototype.onCatch.apply(this, arguments);
  },

});

/* Отображение проволоки */
modelNS.IReact.wire = modelNS.IReact.animation.extend({

	hasCanvas: false,

	animate_remove_liquid: function (reagent, options) {
		console.log('animate_remove_liquid')
		return this.animate_slow_remove(reagent);
	},

	animate_init_liquid: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

	animate_receive_liquid: function (reagent, options) {
		this.addCanvasReagent(reagent, options);
	},

});

/* Проволка, на ней жгут реагент */
IReact.equips.wire = IReact.equips.tool.extend({
    isTool: true,
    toolType: ['granules', 'chips', 'crystal', 'powder', 'fiber', 'balls', 'liquid'],
    repositoryType: [],

    // расположение сукрсора при хватании элемента
    cursorAt: {left:10, top:30},

    // селектор по элементам которые могут служить целью данного инструмента
    intersectSuccess: ".test_tube",

    // дополнительный элемент идентифицирующий контакт инструмента
    // кончик пинцета
    hasOutput: true,

    // из каких типов оборудования инструмент может брать реагент
    supportedEquips: "bottle test_tube",

    initialize: function () {
      var self = this;

      IReact.equips.tool.prototype.initialize.apply(this, arguments);

      this.listenTo(this.model, "change:status", this.status);
    },

    status: function (model, status) {
      this.$el.attr('status', status);
    },

    // особенность проволки, что она крепит реагент и потом никуда его не отпускает
    addReagentFrom: function () {
      IReact.equips.tool.prototype.addReagentFrom.apply(this, arguments);
      this.isReceiver = false;
      this.isSender = false;
    },

    //
    onDrag: function (event, ui) {
      IReact.equips.tool.prototype.onDrag.apply(this, arguments);
      this.checkDragInTestTube(event, ui);
    },

    // TODO: пробирку надо убменьшать иначе проволку не достать когда она дна касается

    // в пробирке возможно 2 положения, одно из них - прилипает ко дну
    checkDragInTestTube: function (event, ui) {
      if (this.attachedTo && this.attachedTo.model.type == 'test_tube') {
        var status = this.model.get('status'),
            top = this.savedPosition.top - ui.position.top - (status == 'bottom' ? 20 : 0);
        if (Math.abs(this.savedPosition.left - ui.position.left) < 20) {  // близко к пробирке по горизонтале
          if (top < -16) {
            ui.position.left = this.savedPosition.left;
            ui.position.top = this.savedPosition.top + 20;
            if (status != 'bottom') {
              this.model.set('status', 'bottom');
            }
          } else if (top < 22) {
            ui.position.left = this.savedPosition.left;
            if (status != 'middle') {
              this.model.set('status', 'middle');
            }
          }
        } else {
          if (status != 'middle') {
            this.model.set('status', 'middle');
          }
        }
      }
    },
});

modelNS.IReact.wurtz_flask = modelNS.IReact.equipCanvas.extend({

	visualParts: [{
			name: "wurtz_flask",
			part: "front",
		},{
			name: "curvetube",
			part: "tube",
	}],

	initialize: function () {
		modelNS.IReact.equipCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "wurtz_flask",
			src: "js/wurtz_flask.js",
			properties: {part:"back"},
		});

		this.loadMovie({
			name: "curvetube",
			src: "js/curvetube.js",
			open: false,
		});

	},

	animate_receive_liquid: function (reagent, options) {
		return this.addCircleReagent(reagent, options);
	},

	animate_init_liquid: function (reagent, options) {
		return this.addCircleReagent(reagent, $.extend(options, {init:1}));
	},



});

// Колба
IReact.equips.wurtz_flask = IReact.equips.glassware.extend({

  "react-object": true,

  // способность элемента принимать другие элементы
  isReceiver: true,

  // конфиг, какие объекты могут быть присоеденены
  allowAttach: {
    gastube: {slotName: 'gastube'},
    cork: true, // корковая пробка
    cork_gastube: true,
    cap_dropper_closable: true,
  },

  initialize: function () {
    IReact.equips.glassware.prototype.initialize.apply(this, arguments);

    this.on('reagentAdded', function (reagent) {
      if (reagent.state == 'gas') {
        this.gasOn(reagent);
      }
    });

    this.on('reagentRemoved', function (reagent) {
      if (reagent.state == 'gas') {
        this.gasOn(reagent);
      }
    });
  },

  // координаты наконечника для отрисовки шланга
  getHoseContact: function () {
    var rotation = this.getRotation();
    if (rotation.angle === undefined) {
      return this.position(131*CourseConfig.zoomScale, 79*CourseConfig.zoomScale);
    } else {
      // в стенде
      return IReact.ViewUtils.rotate($.extend(rotation, {
        radius: 107,
        angle: 92.1 + rotation.angle, // базовый угол = 12.5
      }));
    }
  },

  gasOn: function (gas) {
    this.gas = gas;
    // TODO: по трубке идет газ
    // this.animation.gasOn();
    if (this.gastube) {
      this.gastube.gasOn();
    }
  },

  gasOff: function () {
    this.gas = null;
    // TODO: по трубке идет газ
    // this.animation.gasOff();
    if (this.gastube) {
      this.gastube.gasOff();
    }
  },

  getRotation: function () {
    return $.extend(IReact.equips.glassware.prototype.getRotation.apply(this, arguments), {
      radius: 130,
      baseAngle: 8.5 // для стенда
    });
  },

});

// расстворение эмульсии
modelNS.IReact.blur = modelNS.IReact.effectCanvas.extend({

	initialize: function(options) {

		if (!options) options = {};

		modelNS.IReact.effectCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "blur",
			src: "js/blur.js",
			color: options.color,
			// from:0,
			// to:49,
			// loop: true
		});

		this.$el.addClass('blur');

		// TODO: optimize в loaded или как там
		this.$el.hide();
		this.show();
	},

	setOptions: function (options) {
		if (!options) options = {};
		if (options.size) {
			if (options.size > 1) options.size = 1;
			if (options.size < 0.11) options.size = 0.11;
      this.$el.css('height', Math.max(options.size*72, 10));
    }
	},

	show: function (options) {
		this.setOptions(options);
		this.$el.fadeIn(800);
	}

});

// расстворение эмульсии
modelNS.IReact.dropping = Backbone.View.extend({

	initialize: function(options) {

		if (!options) options = {};

		Backbone.View.prototype.initialize.apply(this, arguments);

		this.$el.addClass('dropping');

    this.$el.attr({
      "react-object": "",
      "react-effect": "",
      "react-height": "full",
      "react-align": "center",
      "react-valign": "bototm",
      // "react-width": "full",
    });

    this.setColor(options.color);
	},

  setColor: function (color) {
    if (color) {
      color = modelNS.colorUtils.colorToArray(color);
      this.$el.find("[drop-color]").attr("fill", modelNS.colorUtils.colorToString(color));
      this.color = color;
    }
  },

  startDropping: function () {
    var self = this;

    this.stopDropping();

    self.drop();

    this.timer = setInterval(function () {
      self.drop();
    }, 1800);
  },

  stopDropping: function () {
    clearInterval(this.timer);
  },

  createDrop: function () {
    return $('<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 372.000000 356.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,356.000000) scale(0.100000,-0.100000)" drop-color fill="#000000" stroke="none"> <path d="M1801 3095 c-31 -111 -153 -357 -292 -585 -305 -502 -407 -696 -475 -900 -37 -110 -39 -121 -39 -245 0 -116 3 -140 29 -220 67 -209 184 -377 341 -487 116 -81 225 -126 354 -148 207 -35 479 53 655 209 53 48 147 173 183 244 71 141 92 222 100 373 7 145 -8 227 -69 379 -51 128 -95 209 -231 425 -190 301 -275 446 -346 588 -67 133 -152 343 -166 409 -3 18 -10 35 -14 37 -4 3 -17 -33 -30 -79z"/> </g> </svg>');
  },

	drop: function () {
    if (!this.$drop) {
      this.$drop = this.createDrop();
      this.$drop.appendTo(this.$el);
      this.setColor(this.color);
    }
    this.$drop.stop().css({
      top: 0,
      opacity: 1,
    }).animate({
      top: '100%',
      opacity: -0.5,
    }, 1400);
  },

});

/* Пенообразный столб вещества (змея фараона) */
modelNS.IReact.faraon = modelNS.IReact.effectCanvas.extend({

	effectTime: 4000,

	config: {
		glass: {
			scale: 0.34,
		},
		beaker150: {
			scaleX: 0.29,
			scaleY: 0.35,
		}
	},

	initialize: function(options) {
		modelNS.IReact.effectCanvas.prototype.initialize.apply(this, arguments);

		// TODO: color
		this.loadMovie($.extend({
			name: 'faraon',
			src : "js/faraon.js",
			from: 0,
			to: 34,
		}, this.config[options.type]));

		this.$el.attr({
			"react-align": "left",
			"react-valign": "bottom",
		}).addClass('faraon');
	}

});

modelNS.IReact.flame = modelNS.IReact.effectCanvas.extend({

	initialize: function(options) {
		modelNS.IReact.effectCanvas.prototype.initialize.apply(this, arguments);

		if (!options) options = {};

		var color = options.color;
		if (!color || color === true || color == "true") {
			color = 'rgba(255,0,0,0.773)'
		}

		this.loadMovie({
			name: "flame",
			src: "js/flame.js",
			color: color,
			from:0,
			to:29,
			properties: {smoke:options.smoke || false}	// режим дыма
		});

		this.$el.addClass('flame');
		this.$el.attr({
			"react-effect": "",
			"react-align": "center",
			"react-valign": "top",
		});
	},

	setOptions: function (options) {
		this.refresh({color:options.color, properties:{smoke:options.smoke}});
	},

	hide: function () {
		this.$el.hide();	// огонь затухает резко, без задержки
	}

});

// пена, расстворение (размытые кляксы)
modelNS.IReact.foam = modelNS.IReact.effectCanvas.extend({

	effectTime: 4400,

	initialize: function(options) {

		if (!options) options = {};

		modelNS.IReact.effectCanvas.prototype.initialize.apply(this, arguments);

		var scale = {};

		console.log('#foam', options.type, options)

		if (options.type == 'glass') {
			scale.scaleX = 0.35;
			scale.scaleY = 0.25;
		} else {
			scale.scale = 0.2; // test_tube
		}

		this.loadMovie($.extend({
			name: "foam",
			src: "js/foam.js",
			from:0,
			color: options.color,
			// to:49,
			// loop: true
		}, scale));

		this.$el.addClass('foam');
	},

	setOptions: function (options) {
		if (options.size) {
			if (options.size > 1) options.size = 1;
			if (options.size < 0.11) options.size = 0.11;
			if (this.initiator.type == 'test_tube') {
				this.$el.css('bottom', Math.max(options.size*73, 6)); // OLD support for test_tube
			} else {
				// на текущий момент для glass, но в целом механизм для всех
				// console.log(this.$canvas)
				this.$canvas.css({
					top: (1-options.size)*100 + '%'
				});
			}
    }
	},

});

/* Туманка */
modelNS.IReact.fume = modelNS.IReact.effectCanvas.extend({

	initialize: function(options) {
		modelNS.IReact.effectCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name : "fume",
			src : "js/fume.js",
			color: options.color,
			from:0,
			to:29
		});

		this.$el.addClass('fume');

	}

});

// поднятие пузырьков
modelNS.IReact.gasup = modelNS.IReact.effectCanvas.extend({

	autoDestroy: true,

	initialize: function(options) {

		if (!options) options = {};

		modelNS.IReact.effectCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie($.extend({
			name: "gasup",
			src: "js/gasup.js",
			from:0,
      loop:true,
			scale: 0.6,
			properties:{size:1, speed:1}	// размер пузырьков
		}, options));

		this.$el.attr({
			"react-effect": "",
			"react-align": "center",
			"react-valign": "bottom",
		}).addClass('effect gasup');

		modelNS.IReact.AudioUtils.playAudio("gasup.mp3");
	},

	setOptions: function (options) {
		if (options.full) {	// для пробирки
	    this.$el.css('height', options.full*options.fullHeight);
			// this.$canvas.css('clip', 'rect(' + (1-options.size)*83 + 'px, auto, auto, auto)'); // плохо работает при масштабировании
		}

	}

});

// поднятие пузырьков маленьких
modelNS.IReact.gasupslow = modelNS.IReact.gasup.extend({

	autoDestroy: true,

	initialize: function(options) {

		if (!options) options = {};

		modelNS.IReact.effectCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie($.extend({
			name: "gasup",
			src: "js/gasup.js",
			from:0,
      loop:true,
			properties:{size:1, speed:0}	// размер пузырьков
		}, options));

		this.$el.addClass('effect gasup gasupslow');
	}

});

// поднятие пузырьков маленьких
modelNS.IReact.minigasup = modelNS.IReact.effectCanvas.extend({

	autoDestroy: true,

	initialize: function(options) {

		if (!options) options = {};

		modelNS.IReact.effectCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie($.extend({
			name: "gasup",
			src: "js/gasup.js",
			from:0,
      loop:true,
			properties:{size:0.5, speed:1}	// размер пузырьков
		}, options));

		this.$el.addClass('effect gasup minigasup');
	}

});

// Напыление на пробирке
modelNS.IReact.plaque = modelNS.IReact.effectCanvas.extend({

	initialize: function(options) {

		if (!options) options = {};

		modelNS.IReact.effectCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "plaque",
			src: "js/plaque.js",
			from:0,
			to: 10,
			color: options.color,
			// to:49,
		});

		this.$el.addClass('effect plaque');

    // if (options.size) {
		// 	if (options.size > 1) options.size = 1;
		// 	if (options.size < 0.11) options.size = 11;
    //   this.$el.css('bottom', Math.max(options.size*58, 6));
    // }
	}

});

// Осадок
modelNS.IReact.sludge = modelNS.IReact.effectCanvas.extend({

	initialize: function(options) {

		if (!options) options = {};

		modelNS.IReact.effectCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "sludge",
			src: "js/sludge.js",
			from:0,
			color: options.color,
			// to:49,
			// loop: true
		});

		this.$el.addClass('sludge');
	},

	setOptions: function (options) {
		// if (options.size) {
		// 	if (options.size > 1) options.size = 1;
		// 	if (options.size < 0.11) options.size = 11;
		// 	this.$el.css('height', Math.max(options.size*63, 6));
		// }
	},

	show: function (options) {
		if (!options) options = {};

		if (options.color != this.options.color) {
			this.redraw(options);
			this.play({from:0});
		} else if (this.$el.is(":hidden")) {
			this.play({from:0});
		}

		modelNS.IReact.effectCanvas.prototype.show.apply(this, arguments);
	}

});

// Искра
modelNS.IReact.spark = modelNS.IReact.effectCanvas.extend({

	autoDestroy: true,

	initialize: function() {

		modelNS.IReact.effectCanvas.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "spark",
			src: "js/spark.js",
			from:0,
			to:4,
		});

		this.$el.addClass('spark');
	}

});

// Комки
modelNS.IReact.balls = modelNS.IReact.ireagent.extend({

	className: 'canvas-wrap reagent balls',

	initialize: function(options) {

		modelNS.IReact.ireagent.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "balls",
			src: "js/balls.js",
			color: options.reagent.color,
			properties: {
				size: options.reagent.size || 1,
				type: this.initiator.type
			},
		});

		this.$el.attr({
			state: 'balls',
			"react-reagent": "",
			"react-valign": "bottom",
			"react-align": "left",
			"react-width": "full",
			"react-height": "full",
		});
	}

});

// Интерфейс для мерного стакана, ниже наследования на 50, 100, 150 и 200 мл
// - http://ru.solverbook.com/question/najdite-dlinu-xordy-okruzhnosti-radiusom-13-sm/
modelNS.IReact.circleReagent = modelNS.IReact.ireagent.extend({

  initialize: function (options) {
    modelNS.IReact.ireagent.prototype.initialize.apply(this, arguments);

    this.reagent = options.reagent;
    this.fullHeight = options.fullHeight || 100;
  },
  render: function ($parent) {
      modelNS.IReact.ireagent.prototype.render.apply(this, arguments);

      var reagent = this.reagent,
			    reagentHTML =
              '<div class="top">'
    				+ '	<div class="round-corner clip"></div>'
    				+ '</div>'
            + '<div class="top half">'
            + '	<div class="round-corner color1"></div>'
            + '</div>'
    				+ '<div class="center color1"></div>';

      this.$el.html(reagentHTML)
				.attr({
					reagent: reagent.name,
					state: reagent.state,
					"reagent-view": "circle",
					"react-valign": "bottom",
					"react-align": "left",
					"react-width": "full",
					"react-height": "full",
				})
        // .css({height:0})
				.appendTo($parent);	// parent, что бы работали >[react-width] и др

      this.height = 0;

      this.promise = $.when();

      return this;
  },

  draw: function (reagent, options) {
    var reagent = reagent || this.reagent,
				color = reagent.color,
				fromColor = this.color,
				height = options.full*this.fullHeight,
        time = 1, // options.time || 1, // TODO: длительность реакции (общая, у тут только на перекрашивание)
        $top = this.$el.find('.top'),
        self = this;

    if (options.initialize) {
      // this.$el.css({height: height});
      this.$el.find('.center').css('clip', 'rect('+(this.fullHeight - height)+'px, auto, auto, auto)');
      this.height = height;
      var missHeight = this.fullHeight-height;
      $top.css('top', missHeight);
      // this.$el.attr("reagent-full", Math.round(now/self.fullHeight*100));
    }

    if (!options.initialize && this.height != height) {
      var duration = 4000/this.fullHeight * Math.abs(this.height-height),
          $center = self.$el.find('.center');

      this.promise = $({
        height: this.height
      }).animate({
        height: height
      }, {
          duration: duration,
          easing: 'linear',
          step: function(now, fx) { // called for each animation step (now refers to the value changed)
            // px.prop == 'height'
            var missHeight = self.fullHeight-now;
            $center.css('clip', 'rect('+missHeight+'px, auto, auto, auto)');
            $top.css('top', missHeight);
            self.$el.attr("reagent-full", Math.round(now/self.fullHeight*100));
          }
      }).promise();

      // this.$el.animate({
      //    height: height
      // }, 1000/40*Math.abs(this.height-height));
      this.height = height;
    }


    if (options.color !== null) { // отключение изменение цвета через опции, если реагент добавляется перед реакцией, то меняем только уровень
      if (fromColor && fromColor != color	) {
  			IReact.ViewUtils.colorize({
  				fromColor: fromColor,
  				toColor: color,
  				duration: time*1000,
  			}, self);
  		} else {
  			this.setColor(color);
  		}
    }

    // минимальное время просмотра реакции
		var delay = $({}).delay(800);

    this.promise = this.promise.then(function () {
				return delay.promise();
		});

		return this.promise;
  },

  getRgbaCss: function (rgba, diff) {
    var diffColor = [];
    for (var i=0; i<3; i++) {
      var c = rgba[i] - diff[i];
      if (c<0) c=0;
      if (c>255) c=255;
      diffColor.push(c);
    }
    var alfa = rgba[3] ? rgba[3] : 1;
    if (diff[3]) alfa -= diff[3];

    return {
      backgroundColor: 'rgb(' + diffColor.join(',')+')',
      opacity: alfa,
    }
  },

  setColor: function (color) {
    var rgba = colorToArray(color),
        styles = [
          this.getRgbaCss(rgba, [0, 0, 0]),
          // this.getRgbaCss(rgba, [-87, -76, -55]), //  [-132, -70, 20, -10] - вариант верхушки без прозрачности
        ];

    this.$el.find('.color1').css(styles[0]);
    // this.$el.find('.color2').css(styles[1]);

    if (modelNS.colorUtils.isWhited(rgba)) {
      this.$el.find('.clip').addClass('whited');
    } else {
      this.$el.find('.clip').removeClass('whited');
    }

    this.color = color;
  },

  // TEMP пока что нет нормальной поддержки
  setAngle: function (angle) {
    this.$el.attr("angle", "");
  },

  // Пленка
	oil_film: function (options) {
		// TODO:
	},


});


// Кристалы
modelNS.IReact.crystal = modelNS.IReact.ireagent.extend({

	className: 'canvas-wrap reagent crystal',

	config: {
		defaults: {
			scale: 0.5,
		},
		// beaker200: { // центрирование при изменении масштаба нуждается в доработке
		// 	scale: 0.36,
		// }
	},

	initialize: function(options) {

		modelNS.IReact.ireagent.prototype.initialize.apply(this, arguments);

		this.loadMovie($.extend({
			name: "crystal",
			src: "js/crystal.js",
			color: options.reagent.color,
			properties:{size:options.reagent.size || 1, type: options.initiator.type},
		}, this.config[options.initiator.type] || this.config.defaults));

		this.$el.attr({
			state: 'crystal',
			"react-reagent": "",
			"react-valign": "bottom",
			"react-align": "left",
			"react-width": "full",
			"react-height": "full",
		});
	}

});

// Интерфейс для мерного стакана, ниже наследования на 50, 100, 150 и 200 мл
modelNS.IReact.cylinderReagent = modelNS.IReact.ireagent.extend({

  initialize: function (options) {
    modelNS.IReact.ireagent.prototype.initialize.apply(this, arguments);

    this.reagent = options.reagent;
  },
  render: function ($parent) {
    modelNS.IReact.ireagent.prototype.render.apply(this, arguments);

    var reagent = this.reagent,
		    reagentHTML =
            '<div class="top">'
  				+ '	<div class="round-corner clip"></div>'
          + ' <div class="half">'
          + '	 <div class="round-corner color1"></div>'
          + ' </div>'
  				+ '</div>'
  				+ '<div class="clip-wrap">'
  				+ ' <div class="center color1"/></div>'
          + ' <div class="bottom">'
  				+ '	 <div class="round-corner color1"></div>'
  				+ ' </div>'
  				+ '</div>';

    this.$el.html(reagentHTML)
			.attr({
				reagent: reagent.name,
				state: reagent.state,
				"reagent-view": "cylinder",
				"react-valign": "bottom",
				"react-align": "left",
				"react-width": "full",
				"react-height": "full",
			})
			.appendTo($parent);	// parent, что бы работали >[react-width] и др

    this.$top = this.$el.find('.top');
    this.$clip = this.$el.find('.clip-wrap');
    this.$center = this.$el.find('.center');

    this.full = 0;

    return this;
  },

  draw: function (reagent, options) {

    var full = options.full,
        most = reagent,
        self = this;

    // размер и цвет
    if (!options.initialize && options.reagents) {
      var reagents = options.reagents,
          size = 0,
          state = reagent.state;
      for (var i=0; i<reagents.length; i++) {
        if (reagents[i].state == state) {
          size += reagents[i].size;
          if (most.size < reagents[i].size) {
            most = reagents[i];
          }
        }
      }
      full = Math.min(size/options.maxSize, 1);
    }
    // if (!full) debugger;

    var reagent = reagent || this.reagent,
				color = most.color,
				fromColor = this.color,
        time = 1; // options.time || 1, // TODO: длительность реакции (общая, у тут только на перекрашивание)

    if (options.initialize) {
      // TODO:
      // self.$el.attr("reagent-full", Math.round(full*100));
      this.full = full;
      this.drawFull(full);
    }

    if (!options.initialize && this.full != full) {
      var duration = 1000*Math.abs(this.full-full);

      this.promise = $({
        full: this.full
      }).animate({
        full: full
      }, {
          duration: duration,
          easing: 'linear',
          step: function(now, fx) { // called for each animation step (now refers to the value changed)
            self.drawFull(now);
          }
      }).promise();

      // this.$el.animate({height: height}, 1000/40*Math.abs(this.height-height));
      this.full = full;
    }

    if (options.color !== null || !fromColor) { // отключение изменение цвета через опции, если реагент добавляется перед реакцией, то меняем только уровень
      if (fromColor && fromColor != color	) {
  			IReact.ViewUtils.colorize({
  				fromColor: fromColor,
  				toColor: color,
  				duration: time*1000, // это время хорошо смотрится с увеличением высоты
  			}, self);
  		} else {
  			this.setColor(color);
  		}
    }

    // минимальное время просмотра реакции
		var delay = $({}).delay(800),
				promise = this.$el.promise().then(function () {
					return delay.promise();
				});

		return promise;
  },

  setAngle: function (angle) {
    this.angle = angle;
    this.drawFull(this.full);
  },

  drawFull: function (full) {
    if (!this.angle) {
      var height = full*this.fullHeight,
          outset = this.fullHeight - height;

      this.$clip.css({
        clip: 'rect('+outset+'px, auto, 1000px, auto)',
        transform: '',
      });
      this.$top.css('top', outset);
      this.$center.css({ transform: '' });
    } else {
      // test_tube пока что только
      // angle=80: 99 to 116;
      // angle=1: 20 to 103;
      var angle = this.reagent.state == 'powder' ? this.angle/2 : this.angle,
          from = 20 + 79*(angle - 1)/79, // 79 = from 1 through 80
          to = 103 + 3*(angle - 1)/79,
          fullHeight = to - from,
          height = full*fullHeight,
          clip = from + fullHeight - height;
      this.$clip.css({
        clip: 'rect('+clip+'px, 200px, 200px, -200px)',
        transform: 'rotate('+(-angle)+'deg)'
      })
      this.$center.css({
        transform: 'rotate('+angle+'deg)'
      })
    }
  },

  getRgbaCss: function (rgba, diff) {
    var diffColor = [];
    for (var i=0; i<3; i++) {
      var c = rgba[i] - diff[i];
      if (c<0) c=0;
      if (c>255) c=255;
      diffColor.push(c);
    }
    var alfa = rgba[3] ? rgba[3] : 1;
    if (diff[3]) alfa -= diff[3];

    return {
      backgroundColor: 'rgb(' + diffColor.join(',')+')',
      opacity: alfa,
    }
  },

  setColor: function (color) {
    var rgba = colorToArray(color),
        styles = [
          this.getRgbaCss(rgba, [0, 0, 0]),
          // this.getRgbaCss(rgba, [-87, -76, -55]), //  [-132, -70, 20, -10] - вариант верхушки без прозрачности
        ];

    this.$el.find('.color1').css(styles[0]);
    // this.$el.find('.color2').css(styles[1]);

    if (modelNS.colorUtils.isWhited(rgba)) {
      this.$el.find('.clip').addClass('whited');
    } else {
      this.$el.find('.clip').removeClass('whited');
    }

    this.color = color;
  },

  // Пленка
	oil_film: function (options) {
		// TODO:
	},


});


// Волокна
modelNS.IReact.fiber = modelNS.IReact.ireagent.extend({

	className: 'canvas-wrap reagent fiber',

	initialize: function(options) {

		modelNS.IReact.ireagent.prototype.initialize.apply(this, arguments);

		// TODO: через config как в faraon
		var scale;
		if (options.initiator.type == 'glass') {
			scale = {scaleY: 0.36, scaleX: 0.26}
		} else {
			scale = {	scale: 0.36 }
		}

		this.loadMovie($.extend({
			name: "fiber",
			src: "js/fiber.js",
			color: options.reagent.color,
			properties:{size:options.reagent.size || 1},
		}, scale));

		this.$el.attr({
			state: 'fiber',
			"reagent-view": "",
			"react-valign": "bottom",
			"react-align": "left", // возможно center, но тогда нужно указывать ширину и отрицательный margin в css, сейчас настроено для стакана
			"react-width": "full", // и ширина full наверно не нужна, уже не трогал чтоб РЭШ не перепроверять
			"react-height": "full",
		});
	}

});

// Интерфейс для мерного стакана, ниже наследования на 50, 100, 150 и 200 мл
modelNS.IReact.gasReagent = Backbone.View.extend({

  initialize: function (options) {
    modelNS.IReact.ireagent.prototype.initialize.apply(this, arguments);

    this.reagent = options.reagent;
  },

  startEffects: function (options) {
		var reagent = this.reagent;

    // хлоп
		if (reagent.clap) this.clap(reagent.clap);
	},

  // хлоп
  clap: function (options) {
		modelNS.IReact.AudioUtils.playAudio("clap.mp3");
	},

  // метод вызывается когда меняется угол наклона
  setAngle: function () {},

  // метод вызывается для отрисовки реагента
  draw: function () {},

  removeEffects: function () {},


});


// Гранулы
modelNS.IReact.granules = modelNS.IReact.reagentCanvas.extend({

	className: 'canvas-wrap reagent granules',

	config: {},

	initialize: function(options) {

		modelNS.IReact.ireagent.prototype.initialize.apply(this, arguments);

		this.loadMovie($.extend({
			name: "granules",
			src: "js/granules.js",
			color: options.reagent.color,
			properties:{size:options.reagent.size || 1},
			scale: 0.36,
		}, this.config[options.type]));

		this.$el.attr({
			state: 'granules',
			"react-reagent": "",
			"react-valign": "bottom",
			"react-align": "left", // полная ширина должна начинаться с левого отступа
			"react-width": "full", // если много в маленькой емкости - что бы обрезалось
			"react-height": "full", // для того что бы высота не была больше максимальной (и не перекрывалась крышка)
		});
	}

});

// Жидкость, пока что только для проволоки
modelNS.IReact.liquid = modelNS.IReact.ireagent.extend({

	className: modelNS.IReact.ireagent.prototype.className + ' liquid',

	initialize: function(options) {

		modelNS.IReact.ireagent.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "liquid",
			src: "js/liquid.js",
			color: options.reagent.color,
			properties:{size:options.reagent.size || 1},
		});

		this.$el.attr('state', 'liquid');
	}

});

// Порошок, пока что только для стакана
// поддерживает перемешивание
modelNS.IReact.powder = modelNS.IReact.ireagent.extend({

	className: 'canvas-wrap reagent powder',

	initialize: function(options) {

		modelNS.IReact.ireagent.prototype.initialize.apply(this, arguments);

		this.loadMovie({
			name: "powder",
			src: "js/powder.js",
			color: options.reagent.color,
			properties:{size:options.reagent.size || 1},
		});

		this.$el.attr({
			state: 'powder',
			"react-reagent":"",
			"react-valign": "bottom",
			"react-align": "left",
			"react-width": "full",
		});
	}

});

// Интерфейс для мерного стакана, ниже наследования на 50, 100, 150 и 200 мл
modelNS.IReact.simpleReagent = modelNS.IReact.ireagent.extend({

  initialize: function (options) {
    modelNS.IReact.ireagent.prototype.initialize.apply(this, arguments);

    var reagent = options.reagent;

    this.$el.attr({
      name: reagent.name,
      state: reagent.state,
      "reagent-view": "simple",
    });

    this.reagent = reagent;
  },
  render: function ($parent) {
    this.$inside = $('<div class="reagent-inside"/>').appendTo(this.$el);

    this.$el.appendTo($parent);

    // this.draw(this.reagent);

    return this;
  },
  draw: function (reagent, options) {
    var rgba = colorToArray(reagent.color),
        rgb = rgba.slice(0,3),
        color = 'rgb('+rgb.join(',')+')';

    this.$inside.css({
      backgroundColor:color,
      opacity:rgba[3]
    })
  },
});


// Проволка
modelNS.IReact.wirew = modelNS.IReact.fiber.extend({

	initialize: function(options) {

		modelNS.IReact.fiber.prototype.initialize.apply(this, arguments);

		this.$el.attr({
			state: 'wirew',
		});
	},

});
