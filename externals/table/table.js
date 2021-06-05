function Table(data, wrapper, basePath, params) {
	var _this = this,
	    $container = $(wrapper),
	    $baseWrapper = $("<div class='base-model interactive-table'/>"),
			$wrapper = $('<div class="scrolling invisible"></div>'),
	    $comboBox = $('<select></select>'),
	    $table,
	    striped = false,
	    combobox = false,
	    content = '',
	    comboboxData = [],
	    columnWidth = [],
	    xmlData = data,
	    bPath = basePath,
	    DEFAULT_WIDTH = 500,
	    DEFAULT_HEIGHT = 300,
	    firstSelected = false,
	    logging = false,
	    popupCollection,

			$xml = $(typeof(xmlData) == 'string' ? $.parseXML(xmlData) : xmlData),
			$root = $xml.find('itable'),
			xmlHeight = $root.attr('height')*1||0,
			xmlWidth = $root.attr('width')*1||0,

		$colspanned=false,
		$rowspanned=false,

		$params = params||{},
		$Sort_value_num=params.sort?params.sort.split(';')[0]:false,
		$Sort_value_type=params.sort?params.sort.split(';')[params.sort.split(';').length-1]:false,
		$FilterItem_value=params.filter ? params.filter.split(';') : [],
		$FilterItem_flags=[];

	this.log = function(msg) {
		if (logging) {
			console.log(msg);
		}
	};

	this.init = function() {
		$baseWrapper.css('width', xmlWidth);

		$container.append($baseWrapper);
		$baseWrapper.append($wrapper);
		console.log(xmlData)
		parseAndRender(xmlData);
	};

	function parseAndRender(xml) {
		xml = xml.replace(/itable/g, 'table');
		var $xml = $('<root>' + xml + '</root>'),
				$itable = $($xml.find('table').get(0)),
				width = $itable.attr('width')*1||0,
				height = $itable.attr('height')*1||0,
				striped = $itable.attr('striped')=='true'?true:false;

		if ($itable.attr('combobox') === 'true')combobox = true;

		$container.css({'width': 'auto', 'height': 'auto'});

		var popups = [];
		$xml.find('popup').each(function() {
			try {
				var id = $(this).attr('id') || '' ? $(this).attr('id') : $(this).attr('name'),
					w = $(this).attr('width'),
					h = $(this).attr('height'),
				    content = courseML.getHTMLFromCourseML($(this));
				popups.push({
					closableOnOverlayClick: true,
					id: id,
					width: w,
					height: h,
					content: content,
					autoWidth : true,
					maxWidth : width,
					maxHeight : height
				});
			} catch (e) {}
		});
		if (popups.length != 0) {
			$xml.find('popup').remove();
			popupCollection = new modelNS.PopupCollection(popups);
		}

		try {
			content = courseML.getHTMLFromCourseML('<page>' + xml + '</page>', {orgTable:true});
		} catch (e) {
			alert('Невозможно отобразить таблицу. Модуль CourseML не найден.');
		}

		$wrapper.html(content);

		$table = $($wrapper.find('> table').get(0));
		$table.addClass('itable');

		// -- fix lost id's to content && define cell width attr -----------------------------------------------------------------
		var xml_TDs = $xml.find('table:first > tbody > tr > td'),
			xml_THs = $xml.find('table:first > tbody > tr > th'),
			wrap_TDs = $wrapper.find('table:first > tbody > tr > td'),
			wrap_THs = $wrapper.find('table:first > tbody > tr > th'),
			$TD_width,
			$TH_width,
			$table_layout='auto';

		if(xml_TDs.length == wrap_TDs.length){
			wrap_TDs.each(function(i){

				if($(xml_TDs[i]).attr('colspan')!==undefined || $(this).attr('colspan')!==undefined)$colspanned=true;
				if($(xml_TDs[i]).attr('rowspan')!==undefined || $(this).attr('rowspan')!==undefined){$rowspanned=true;

					$table.addClass('spanned'); // table border fix rowspanned if

					if(striped)console.log('Attribute \'striped="true" \' was canseled because table is rowspanned!');
					striped=false; // stripped fix rowspanned if
				}

				if(xml_TDs[i].id)this.id = xml_TDs[i].id;

				if($(xml_TDs[i]).attr('width')!== undefined){
																					// 14*2 - td's left+right padding, 2 - border
					$TD_width='width:'+(parseInt($(xml_TDs[i]).attr('width'))-(14*2)-2)+'px';
					$table_layout='fixed';
					//$table.css('table-layout','auto');
				} else {
					$TD_width='width:auto';
				}
				$(this).html('<div style="overflow:auto;'+$TD_width+'">'+$(this).html()+'</div>');
			});
		} else {alert('ERROR in XML data!!'); return}

		if(xml_THs.length == wrap_THs.length){
			wrap_THs.each(function(i){

				if($(xml_THs[i]).attr('colspan')!==undefined || $(this).attr('colspan')!==undefined)$colspanned=true;
				if($(xml_THs[i]).attr('rowspan')!==undefined || $(this).attr('rowspan')!==undefined)$rowspanned=true;

				if(xml_THs[i].id)this.id = xml_THs[i].id;

				if($(xml_THs[i]).attr('width')!== undefined){
																					// 15+20 - th's left+right padding, 2 - border
					$TH_width='width:'+(parseInt($(xml_THs[i]).attr('width'))-(15+20)-2)+'px';
					$table_layout='fixed';
					//$table.css('table-layout','auto');
				} else {
					$TH_width='width:auto';
				}
				$(this).html('<div style="overflow:auto;'+$TH_width+'">'+$(this).html()+'</div>');
			});
		} else {alert('ERROR in XML data!!'); return}

		//$table.css('table-layout',combobox?$table_layout:'auto');
		$table.css('table-layout',$table_layout);
		// ----------------------------------------------------------------------------------------------------------------------

		if (striped) {
			$table.addClass('striped');
		}
		$table.find('tbody:first > tr').each(function(i) {
			if (i == 0)return;

			$(this).attr('index', (i - 1));
		});

			// если задан ресайз
		var $table_scalable = $itable.attr('scalable') == 'true' || false,
			//  если задана высота таблицы
			$table_height = parseInt($itable.attr('height')) || false,
			//  если задана ширина таблицы
			$table_width = parseInt($itable.attr('width')) || false,
			// если скролл
			$table_scrolled = false,
			// если вертикальный скролл
			$table_scrolled_Y = false,
			// если горизонтальный скролл
			$table_scrolled_X = false,
			// если чекбоксы для всей таблицы (значения true/false/none)
			$table_check = $itable.attr('check') || false,
			// f(x) for set column sizes
			Column_Sizes_Set = function(){
				$table.find('tbody:first > tr > th').each(function(i){
					columnWidth.push($(this).attr('width')?parseInt($(this).attr('width')):0);
				});

				if(columnWidth.some(function(x){return x>0})){
					var $tmp_count=0;
					for (c1=0;c1<columnWidth.length;c1++)if(columnWidth[c1]===0)$tmp_count++;

					columnWidth=columnWidth.map(function(x){
						if(!x)return ((($table_width?$table_width:$table.width()) -
											columnWidth.reduce(function(a,b){return a+b})) / $tmp_count);
						return x;
					});
				}

				$table.find('tbody:first > tr > th').each(function(i){
					if(columnWidth.some(function(x){return x>0})){
						columnWidth=columnWidth.map(function(x){
							if(!x)return 'auto';
							return x;
						});
					}
					$(this).css({'width':parseInt(columnWidth[i])?columnWidth[i]+'px':'auto'});
					$(this).find(' > div:first').css({'width':parseInt(columnWidth[i])?columnWidth[i]-15-20+'px':'auto'});//15,20-th paddiing
				});
			}




		if (combobox) {
			$wrapper.addClass('comboboxed');
			$wrapper.css({'height':'auto'});
			var header = $($table.find('tbody:first > tr').get(0)),
			    workingRow = $('<tr class="working-row"></tr>');
			for (var i = 0; i < header.find('th').length; i++){
				workingRow.append('<td' + (i == 0 ? ' class="first-row" ' : '') + '></td>');
			}

			header.after(workingRow);

			$table.find('tbody:first > tr').each(function(i) {
				if (i < 2) {return;}

				var rowValues = {};
				$(this).find('> td').each(function(k) {
					rowValues[k] = $(this).html();
				});
				comboboxData.push(rowValues);
				//$(this).hide(); // #10686 Пока не будем скрывать. Скроем их после установки ширин ячеек
			});

			//=>  if set <param name="combobox"> $Combobox_value </param>
			var $Combobox_value = ($params.combobox < comboboxData.length ? $params.combobox : 0)||0;

			var option;
			for (var i = 0; i < comboboxData.length; i++) {
				option = $('<option value="' + i + '" ' +(i==$Combobox_value?'selected':'')+ '></option>');
				option.append(comboboxData[i]['0']);
				$comboBox.append(option);
			}

			setValue(workingRow, $Combobox_value);

			$(workingRow.find('> td').get(0)).append($comboBox);

			$comboBox.selectWidget({
				change: function(changes) {
					$(this).html(comboboxData[0][changes]);
					setValue(workingRow, changes);
                    if ($table_height) {// #13014 Меняем высоту строки с динамическими ячейками при переключении
                        resizeWorkingRow();
                    }
                    resizeSelectList($comboBox); // #13014 При переключении меняем высоту выпадающего списка
					return changes;
				},
				scrollHeight : 350  //=>  why hardcode 250?  maybe set it on some attr? @Saimon Say
			});

            // #10686
			// Делаем выпадающий список видимым и меняем позиционирование, чтобы он заполнил ячейку перед расчетом ширин.
			$('.select-main .select-block').addClass('select-block_pos').css('display', 'block');
            $(workingRow).find('> td').each(function(index, item) {
                var itemWidth = $(item).outerWidth();
                $(item).css({
                    width: itemWidth,
                    minWidth: itemWidth,
                    maxWidth: itemWidth
                });
            });
            // Возвращаем выпадающий список в исходное состояние после расчетов
            $('.select-main .select-block').removeClass('select-block_pos').css('display', 'none');

            // #10686 Скроем строки
            $table.find('tbody:first > tr').each(function(i) {
                if (i < 2) {return;}
                $(this).hide();
            });

			Column_Sizes_Set();

		} else {

			var header = $xml.find('tr:first > th');

			Column_Sizes_Set ();

			$table.find('tbody:first > tr > th').each(function(i){
				var sortable = $(header[i]).attr('sortable') ? $(header[i]).attr('sortable') == 'true' : false,
				    filterable = $(header[i]).attr('filterable') ? $(header[i]).attr('filterable') == 'true' : false,
				    filterWidth = parseInt($(header[i]).attr('filterwidth'));

				// включаем сортировку для params
				if ($Sort_value_num == i+1) sortable = true;

				if ($FilterItem_value.indexOf(this.id)>=0) filterable = true;

				new Filter(this, i, sortable, filterable, filterWidth).init();
			});
			resizeWrapper();

			// =>  param filter if
			if($FilterItem_value && (!$colspanned&&!$rowspanned)){
 				if($FilterItem_flags.length != 0){
					var Filta = $table.find('tr[index]');
					Filta.css('display','none');
					Filta.each(function(i){
						for(f3=0;f3<$FilterItem_flags.length;f3++){
							if ($(this).attr('index') == $FilterItem_flags[f3]) {
								$(this).css('display','table-row');
							}
						}
					});
				}
			}
			//=>  $table_check!
			if($table_check && $table_check !== 'none'){
				$table.find('tbody:first tr[index] > td').each(function(){
					$(this).css({'position':'relative'});
					$(this).prepend('<input type="checkbox" class="check_box"'+($table_check==='true'?'checked':'')+'></input>');
				});
			}
			//=>  $tr_check!
			$itable.find('tbody:first tr').each(function(i){
				if(i==0)return;
				var $tr_check = $(this).attr('check')||false;
				if($tr_check){
					$table.find('tbody:first tr:eq('+i+') > td').each(function(){
						$(this).find('> input').remove();
						if($tr_check ==='none')return;
						$(this).css({'position':'relative'});
						$(this).prepend('<input type="checkbox" class="check_box"'+($tr_check==='true'?'checked':'')+'></input>');
					});
				}
			});
			//=>  $td_check!
			$itable.find('tbody:first tr').each(function(i){
				if(i==0)return;
				var $table_tmp = i;
				$(this).find('> td').each(function(x){
					var $td_check = $(this).attr('check')||false;
					if($td_check){
						$table.find('tbody:first tr:eq('+$table_tmp+') > td:eq('+x+')').each(function(){
							$(this).find('> input').remove();
							if($td_check==='none')return;
							$(this).css({'position':'relative'});
							$(this).prepend('<input type="checkbox" class="check_box"'+($td_check==='true'?'checked':'')+'></input>');
						});
					}
				});
			});
		}

		var $tableWidth 		= parseInt($table.width()),
			$tableHeight		= parseInt($table.height()),
			$table_sum_th		= 0;
			$table.find('tbody:first > tr:first > th').each(function(){$table_sum_th+=$(this).outerWidth()});

		var	$tableSettedWidth	= ($table_sum_th>$table_width?$table_sum_th:$table_width) || $tableWidth,
			$tableScale			= $tableSettedWidth/$tableWidth,
			$tableSettedHeight	= $tableHeight*$tableScale,
			$table_th_height	= $table.find('tbody:first > tr')[0].offsetHeight;

		// #13014 Изменяет высоту выпадающего списка, чтобы внутри ячейки был только скролл виджета и не было стандартного скролла
		function resizeSelectList($comboBox) {
            var $comboBoxTdParent = $comboBox.parent('td');
            var $comboBoxSelectMain = $comboBoxTdParent.find('.select-main');
            var $comboBoxSelectBlock = $comboBoxSelectMain.find('.select-block');
            var $comboBoxSelectList = $comboBoxSelectMain.find('.select-block .select-list');
            $comboBoxSelectList.height($comboBoxTdParent.height() - $comboBoxSelectMain.outerHeight()); // Использован outerHeight, т.к. нужно учитывать border.
            $comboBoxSelectBlock.css('top', $comboBoxSelectMain.outerHeight());
		}

		// #13014 Изменяет высоту строки с ячейками, если используется comboBox. Подробнее в тикете.
		function resizeWorkingRow() {
            $table.find('tbody:first > tr.working-row')
                .height($table_height - $table.find('tbody:first > tr:first').height());
		}

		// скроллы  при заданных размерах
		function table_Scroller(){
			if ($table_height || $table_width){

				$table.css({
					'height':'auto',
					'width':combobox?'auto':($table_width?$table_width+'px':'auto')
				});

				// #13014 Если используется combobox, то меняем высоту строки с динамическими ячейками, чтобы они запонили оставшуюся высоту.
				// И подстраиваем высоту выпадающего списка под новую высоту ячейки.
				if (combobox) {
					if ($table_height) {
                        resizeWorkingRow();
					}
                    resizeSelectList($comboBox);
				}

				$container.find('div.base-model').css({'padding':'0px'});  // padding: 8px - removed


				//  скролл по вертикали
				if($table_height && ($table.height()>$table_height)){

					$table_scrolled = true;
					$table_scrolled_Y = true;

					var wrap_table_width = $table_scalable?$table_scalable+'px;':($table_width?$table_width+'px;':'')
					$table.wrap('<table style="table-layout:'+$table_layout+';'+(combobox?'width:auto':(wrap_table_width?'width:'+wrap_table_width:''))+'" class="'+$table.attr('class')+'" />');
					$table.wrap('<tbody />');
					$table.wrap('<tr />');
					$table.wrap('<td colspan="'+columnWidth.length+'" style="padding:0;border:none;" />');
					$table.wrap('<div style="height:'+($table_height-$table_th_height)+'px;width:100%;overflow-x:hidden" />');

					$table2 = $table.clone();
					$table2 = $($table2.find('tbody').html());
					$table2.find('input[type="checkbox"]').css({'display':'none'});
					$table2.find('td,td > div,th,th > div').css({
						'height':'0px',
						'padding-top':'0px',
						'padding-bottom':'0px',
						'margin':'0',
						'border':'0px',
						'overflow-y':'hidden'
					});

					var $insert = $table.parent().parent().parent();
					$insert.before($table2);
					$insert.parent().prepend($table.find('tbody:first > tr:first'));
					$table.prepend($insert.parent().find('tr:eq(1)'));

					$container.css({
						'height':$table_height+'px'
					});
					$wrapper.css({
						'height':$table_height+'px'
					});
					$table.css({
						'width':combobox?'100%':($table_width?$table_width+'px':'auto'),
						'margin':'0'
					});

					if(combobox)$container.css({'width':$table_width+'px'});
				}
				//  скролл по горизонтали
				if ($table_width && ($table.width()>$table_width) && !$table_scalable){

					$table_scrolled_X = true;

					if($table_scrolled_Y)$table.parent().css({'height':'-=10px'})

					$container.find('div.base-model').css({
						'width':$table_width+($table_scrolled_Y?(10):0)+'px',
						'overflow-y':'hidden'
					});
				}
			}
		};
		table_Scroller();

		//=>   если в модели заданa общая ширина таблицы && scalable="true" (вариант с масштабированием)
		function table_Scaler(){

			if(!$table_scalable)return;

			var $tableWidth 		= parseInt($table.width()),
				$tableHeight		= parseInt($table.height()),
				$tableSettedWidth 	= parseInt($itable.attr('width')) || $tableWidth,
				$tableScale			= $tableSettedWidth/$tableWidth,
				$tableSettedHeight	= $tableHeight*$tableScale;

			if(combobox)$tableSettedWidth	= ($table_sum_th>$table_width?$table_sum_th:$table_width) || $tableWidth;

			$container.find('div.base-model').css({'padding':'0px'});  // padding: 8px - removed

			if($tableScale < 1){
				$container.css({
					'width':$table_width+'px'
				});
				$container.find('div.base-model').css({
					scale: $tableScale
					// 'margin-left': -(($tableWidth-$tableSettedWidth)/($tableSettedWidth)*100)/2+'%',
					// 'margin-top': -($tableHeight-$tableSettedHeight)/2+'px'
				});

				$table.parent().css({
					'height':$table_height?(($table_height-($table_th_height*$tableScale))/$tableScale):'auto'
				});
			} else {

			}
			$table.css({
				'margin':'0',
				'height':'auto'
			});
		};
		table_Scaler();

		//=>  fix for filter engine in scrolled frame
		if($table_scrolled_Y && !combobox){
			$table.prepend('<tr class="fake-tr"></tr>');
			var $fake_tr = $($table.find('tbody:first tr.fake-tr').get(0));
			$table.find('tbody:first > tr:eq(2) td').each(function(i){
				var $fake_td = $('<td style="width:'+(parseInt(columnWidth[i])?columnWidth[i]+'px':'auto')+'"></td>');
				$fake_tr.append($fake_td);
			});

			// if scrolled - last td IE right-padding fix
			if(~navigator.userAgent.indexOf("MSIE") ||
				(~navigator.userAgent.indexOf("Trident") && ~navigator.userAgent.indexOf("rv:11.0"))){
					$table.find('tr.fake-tr ~ tr td:last-child').css({'padding-right':'29px'});
			}
		}

        $table.on('click', '.fakelink', function (e) {
			var popupId = $(this).attr('popup');
			if (popupId || '') {
				var popup = popupCollection.get(popupId);
				if (popup) {
					$container.addClass('base-model').append(new modelNS.PopupView({model: popup}).render().el);
					// setTimeout(function(){$('body').append($container.find('div.ui-widget-overlay'))},350); //time for render popup // ?????
				}
			}
		});

		$wrapper.removeClass('invisible');

		function resizeWrapper() {
			$wrapper.find('tbody:first > tr > th').each(function(i) {
				$(this).css({'width':parseInt(columnWidth[i])?columnWidth[i]+'px':'auto'});
			});
		}

		function setValue(workingRow, value) {
			workingRow.find('> td').each(function(i) {
				if (i == 0) {return;}
				$(this).html('<div class="td-data">' + comboboxData[value][i] + '</div>');
			});
		}

		function Filter(th, index, sortable, filterable, filterWidth) {
			var $th = $(th),
				$filterLayout = $('<div class="filter-layout"></div>'),
				$checkboxesLayout = $('<div class="checkboxes-layout"></div>'),
				$sortingLayout = $('<div class="sorting-layout"></div>'),
			    $filterBtn = $('<div class="filter-btn"></div>'),
			    $applyBtn = $('<button class="apply-btn"></button>'),
			    $cancelBtn = $('<button class="cancel-btn"></button>'),
				$sortDesc = $('<div class="sort desc"></div>'),
				$sortAsc = $('<div class="sort asc"></div>'),
				$refresh = $('<div class="sort reset"></div>'),
				selectAll,
			    filterItems = [],
				$filterWidthMax = /* $table_width ? $table_width*.6 :  */$table.width()*.6, // .6 - 60% max width for $filterLayout;
				// $filterWidth = filterWidth ? (filterWidth>226 ? filterWidth : 226) : 'auto';
				$filterWidth = filterWidth || 226;

			this.init = function() {

				$filterBtn.hide();
				$th.append($filterBtn);

				filterWidth = filterWidth>210 ? filterWidth : 210;
				filterWidth = filterWidth>$filterWidthMax ? $filterWidthMax : filterWidth;

				// $th.css({'position':'relative'});
				// $th.append($filterLayout);
				$baseWrapper.append($filterLayout);
				$filterLayout.css('left', $th.position().left);
				$filterLayout.css('top', $th.height());

				$sortingLayout.append($sortDesc);
				$sortingLayout.append($sortAsc);
				$sortingLayout.append($refresh);

				$sortingLayout.hide();
				$filterLayout.append($sortingLayout);

				$checkboxesLayout.hide();
				$filterLayout.append($checkboxesLayout);

				var $th_offset = $table.width()+$table.offset().left-$filterLayout.parent().offset().left,
				    left = '3px',//=>   3px for some margin
					right = 'auto';


				if($th_offset <= filterWidth){  //=>  смещение $filterLayout влево, если он выходит за край таблицы
					left = 'auto';
					right = '3px'; //=> 3 px for some margin
				};

				$filterLayout.css({
					//'top': th_OffsetHeight + 'px',
					'left': left,
					'right': right,
					'min-width': '226px',
					'width':($filterWidth==='auto'?'auto':filterWidth+'px'),
					'max-width': $filterWidthMax+'px'
					});

				$filterBtn.click(function(e){

					if($filterLayout.is(':visible')){$cancelBtn.click();return}

					$wrapper.find('.filter-layout').hide();
					$wrapper.find('tbody:first > tr th').removeClass('active');
					$th.addClass('active');
					removeAllItems();
					filterItems = [];

					$table.find('tbody:first > tr').each(function(i) {

						if(i == 0 && $table_scrolled_Y)return;

						if ((i == 0 /* || !$(this).is(':visible') */) && !$filterLayout.hasClass('first-selected'))return;

						$(this).find('> td').each(function(k) {
							if (k != index) {
								return;
							}
							var hidden = false;

							for (var j = 0; j < filterItems.length; j++) {
								var fi = filterItems[j];
								if ($(this).text() == fi.getName()) {
									hidden = true;
								}
							}

							item = new FilterItem(this, $checkboxesLayout, null, hidden, filterItems);
							filterItems.push(item);
							item.init();
						});
					});

					//if (filterable) {
						$wrapper.find('.filter-layout').hide();
						var item;
						selectAll = new FilterItem($('<td chk="true">Выделить все</td>'), $checkboxesLayout, selectAllItems);
						selectAll.init();

						if (!areAllItemsVisible()) {
							selectAll.uncheck();
						}
						if (filterItems.length == 0) {
							removeAllItems();
						}

						$filterLayout.append($applyBtn);
						$applyBtn.click(function(){

							for (var i = 0; i < filterItems.length; i++) {
								var item = filterItems[i],
								    state = item.getState();
								if (!state) {
									item.switchOff();
								} else {
									item.switchOn();
								}
							}
							if (!areAllItemsVisible() && !firstSelected) {
								$filterLayout.addClass('first-selected');
								firstSelected = true;
							} else
							if (areAllItemsVisible() && $filterLayout.hasClass('first-selected')) {
								$filterLayout.removeClass('first-selected');
								firstSelected = false;
							}
							resizeWrapper();
							$th.removeClass('active');
							$filterLayout.hide();
						});
					//}
					$filterLayout.css({
						'top': $wrapper.find('tbody:first > tr:first > th').get(0).offsetHeight+3+'px', // 3px - some margin
						'opacity':0,
						'transition':'none',
						'display':'block'
					});

					//=>  $filterLayout width calculation, switcher-title length control &&  smooth show
					$filterLayout.find('div.switcher-title').each(function(){
						var $switch_title = parseInt($(this).width()),
							$switch_button = 130; //=>  130px - add width switcher button
						if($(this).is(':visible')){

							// fix for IE scroll width
							if(~navigator.userAgent.indexOf("MSIE") ||
								(~navigator.userAgent.indexOf("Trident") && ~navigator.userAgent.indexOf("rv:11.0"))){
									$switch_title+=5;
									$switch_button+=5;
							}

							if($filterWidthMax>($switch_title+$switch_button)){
								$(this).css({'width':$switch_title+'px'});
							} else {
								$(this).css({'width':$filterWidthMax-$switch_button+'px'});

								var left = '3px',
									right = 'auto';

								if($th_offset<=$filterWidthMax){
									left = 'auto';
									right = '3px';
								}
								$filterLayout.css({
									'width':$filterWidthMax+'px',
									'left':left,
									'right':right
								});
							}
						}
					});

					setTimeout(function(){
						$filterLayout.css({
							'transition':'.5s ease-out',
							'opacity':1
						})
					},50);
				});

				$filterLayout.append($cancelBtn);
				$cancelBtn.click(function() {
					$th.removeClass('active');
					$filterLayout.hide();
				});

				//if (sortable) {
					$sortDesc.click(function() {
						$sortDesc.addClass('disabled');
						$sortAsc.removeClass('disabled');
						sortDesc();
					});

					$sortAsc.click(function() {
						$sortAsc.addClass('disabled');
						$sortDesc.removeClass('disabled');
						sortAsc();
					});

					$refresh.click(function() {
						$sortAsc.removeClass('disabled');
						$sortDesc.removeClass('disabled');
						refresh();
					});
				//}

				//  <param name="sort">
				if ($Sort_value_num == $th[0].id && (!$colspanned&&!$rowspanned)) {
					$srt = function(obj){
						$filterBtn.trigger('click');
						obj.trigger('click');
					}
					//sortable=true;
					switch($Sort_value_type){
						case 'SAZ': $srt($sortAsc); break;

						case 'SZA': $srt($sortDesc); break;

						case 'SDA': /* $srt($refresh); */ break; // (рефреш канселит сортировку)
					}
				}

				//  <param name="filter">
				if($FilterItem_value && (!$colspanned&&!$rowspanned)){
					//$filterBtn.trigger('click');
					//$filterLayout.hide();
					//$th.removeClass('active');
					for(f1=0;f1<$FilterItem_value.length;f1++){
						for(f2=0;f2<filterItems.length;f2++){
							if($FilterItem_value[f1] == filterItems[f2].id){
								$FilterItem_flags.push(filterItems[f2].index);
								filterable = true;
							}
						}
					}
				}

				if (filterable)$checkboxesLayout.show();
				if (sortable)$sortingLayout.show();
				if((sortable || filterable) && (!$colspanned&&!$rowspanned))$filterBtn.show();
			};

			function areAllItemsVisible() {
				var item, visible = true;
				for (var i = 0; i < filterItems.length; i++) {
					item = filterItems[i];
					if (!item.getState()) {
						visible = false;
					}
				}
				return visible;
			}

			function selectAllItems() {
				var item;
				for (var i = 0; i < filterItems.length; i++) {
					item = filterItems[i];
					if (selectAll.getState()) {
						item.check();
					} else {
						item.uncheck();
					}
				}
			}

			function refresh() {
				$table.find('tbody:first > tr').each(function(i) {

					if (i == 0)return;

					var $this = $(this),
					    index = $this.attr('index'),
					    after = findIndex(index);
					after.after($this);
					$this.show();
				});
				firstSelected = false;
				$wrapper.find('.filter-layout').removeClass('first-selected');
				resizeWrapper();
				$th.removeClass('active');
				$filterLayout.hide();
			}

			function findIndex(index) {
				var item;
				$table.find('tbody:first > tr').each(function(i) {
					if (i == index) {
						item = $(this);
					}
				});
				return item;
			}

			function sortAsc() {
 				filterItems.sort(function(a, b) {
					var name1 = a.getName(),
					    name2 = b.getName();
					return -name1.localeCompare(name2);
				});
				reorderTable();
				$th.removeClass('active');
				$filterLayout.hide();
			}

			function sortDesc() {
				filterItems.sort(function(a, b) {
					var name1 = a.getName(),
					    name2 = b.getName();
					return name1.localeCompare(name2);
				});
				reorderTable();
				$th.removeClass('active');
				$filterLayout.hide();
			}

			function reorderTable() {
				var th = $($table.find('tbody:first > tr').get(0)),
					item,
					tr;

				for (var i = 0; i < filterItems.length; i++) {
					item = filterItems[i],
					tr = item.getTr();
					th.after(tr);
				}
			}

			function removeAllItems() {
				$checkboxesLayout.html('');
			}
		}

		function FilterItem(td, layout, oncheck, hidden, filterItems) {
			var $td = $(td),
				$tr = $td.parent(),
			    name = $td.text(),
				$item = $('<div class="filter-item"></div>'),
				$switcher,
			    $layout = $(layout);

			this.id = $td.attr('id');
			this.index = $tr.attr('index');

			this.init = function() {
				$switcher = new Switcher({
							title: name,
							checked: true,
							disabled: false,
							bordered: true,
							click: oncheck,
							filterItems: filterItems
						});
				$layout.append($switcher.render());

				if ($tr.is(':visible') || $td.attr('chk') === 'true') {
					this.check();
				} else {
					this.uncheck();
				}
				if (typeof hidden != 'undefined' && hidden == true) {
					$switcher.render().css({'display': 'none'});
				}
			};

			this.check = function() {
				$switcher.check();
			};

			this.uncheck = function() {
				$switcher.uncheck();
			};

			this.getLayout = function() {
				return $layout;
			};

			this.getTr = function() {
				return $tr;
			};

			this.getName = function() {
				return name;
			};

			this.remove = function() {
				$item.remove();
			};

			this.switchOff = function() {
				$tr.hide();
			};

			this.switchOn = function() {
				$tr.show();
			};

			this.getState = function() {
				return $switcher.checked();
			};
		}

		function Switcher(params) {
			var isChecked = true,
				_this = this;
			if (!(params.disabled || '')) {
				params.disabled = false;
			}
			if (!(params.bordered || '')) {
				params.bordered = false;
			}
			var layout = $('<div class="switcher-layout ' + (params.disabled ? 'disabled' : '') + ' ' + (params.bordered ? 'bordered' : '') + '"></div>'),
			    titleHnadler = $('<div class="switcher-title"></div>'),
			    switcher = $('<div class="switcher" layerid="' + params.name + '" excluded="' + params.excluded + '"></div>'),
			    button = $('<div class="switcher-button"></div>'),
			    settings = {
					color: '#0B72B4',
					title: '',
					click: null,
					checked: isChecked
				},
			    switcherContext = this;
			if (params.id || '') {
				layout.attr('layout-id', params.id);
			}
			switcher.append('<div class="plus">+</div>');
			switcher.append('<div class="minus">-</div>');
			switcher.append(button);
			layout.append(switcher);
			layout.append(titleHnadler);
			if (params || '') {
				if (params.color || '') {
					settings.color = params.color;
				}
				if (params.title || '') {
					settings.title = params.title;
				}
				if (params.click || '') {
					settings.click = params.click;
				}
				settings.checked = params.checked;
			}

			switcher.css('background-color', settings.color);
			button.css('left', settings.checked ? '33px' : '0px');
			switcher.addClass(settings.checked ? 'checked' : '');
			titleHnadler.append(settings.title);

			switcher.click(function(e){

				if ($(this).parent().hasClass('disabled') && e.originalEvent !== undefined)return;

				var that = this,
				    slider = $($(this).find('.switcher-button')[0]),
				    sliderStartPosition = Math.round(slider.position().left);
				isChecked = $(that).hasClass('checked');

				if (isChecked) {
					slider.css({'left': 0, 'right': 'auto'});
					$(that).removeClass('checked');
				} else {
					slider.css({'right': 0, 'left': 'auto'});
					$(that).addClass('checked');
				}
				isChecked = !isChecked;
				_this.switchSimilar(isChecked);
				if (settings.click || '') {
					settings.click();
				}
			});
			this.switchSimilar = function(isChecked) {
				if (!params.filterItems) {
					return;
				}
				for (var i = 0; i < params.filterItems.length; i++) {
					var fi = params.filterItems[i];
					if (fi.getName().trim() != params.title.trim()) {
						continue;
					}
					if (isChecked) {
						fi.check();
					} else {
						fi.uncheck();
					}
				}
			};
			this.check = function() {
				button.css({'right': 0, 'left': 'auto'});
				switcher.addClass('checked');
				isChecked = true;
			};
			this.uncheck = function() {
				button.css({'left': 0, 'right': 'auto'});
				switcher.removeClass('checked');
				isChecked = false;
			};
			this.checked = function() {
				return isChecked;
			};

			this.render = function() {
				return layout;
			};
		};
	};
}
