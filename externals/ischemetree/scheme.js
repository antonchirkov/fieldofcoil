/*
 * НАСТРОЙКИ СХЕМЫ:
 *
 * data - объект с данными
 * smallBlockWidth - ширина маленького блока (100)
 * smallBlockHeight - высота маленького блока (60)
 * smallBlockRenderer - рендерер маленького блока
 * smallBlockColors
 * smallBlockHorizontalGap
 * smallBlockVerticalGap
 * smallBlockVerticalGap2
 * smallBlockVerticalGap3
 * openedBlocks
 *
 * */

/*
 * СОБЫТИЯ:
 *
 * datachange
 *
 * */

/*
 * Возможные свойства для маленького блока (smallBlock):
 * width - ширина блока в пикселях, необязательое
 * height - высота блока в пикселях, необязательое
 * title - заголовок блока, необязательое
 * img - картинка для блока, необязательое
 * color - цвет фона блока, необязательое
 * customData - кастомные данные для блока, необязательое
 *
 * Возможные свойства для большого блока (bigBlock):
 * width - ширина блока в пикселях, необязательое
 * height - высота блока в пикселях или 'auto', необязательое
 * title - заголовок блока, необязательое
 * content - содержимое блока, необязательое
 * img - картинка для блока, необязательое
 * color - цвет фона блока, необязательое
 * customData - кастомные данные для блока, необязательое
 *
 * Возможные свойства для попапов:
 * width - ширина окна в пикселях, необязательое
 * height - высота окна в пикселях или 'auto', необязательое
 * title - заголовок блока, необязательое
 * content - содержимое блока, необязательое
 *
 * */

(function($, undefined) {

    $.widget('physicon.scheme', {
        version: '1.0.0',
        options: {
            data: null,
            smallBlockWidth: 160, // Ширина маленького блока по дефолту
            smallBlockHeight: 80, // Высота маленького блока по дефолту
            linkHandler: null,
            smallBlockHorizontalGap: 20,
            smallBlockVerticalGap: 30,
            openedBlocks: [],
            editMode: false // #10829 Для отслеживания режима редактирования
        },

        _create: function() {
            this.element.addClass('physicon-scheme');
            this._createScheme();
        },

        _destroy: function() {
            this.element.removeClass('physicon-scheme').empty();
        },

        _setOptions: function(options) {
            this._super(options);
            this._createScheme();
        },

        _createScheme: function() {
            this.element.empty();

            ///////////////////////////////////////////////////////////
            // Функция, возвращающая html код тэга
            ///////////////////////////////////////////////////////////
            var createTag = function(tagName, classNames, style, unselectable, innerHTML, params) {
                var p = '';
                for (var k in params) {
                    p += ' ' + k + '="' + params[k] + '"';
                }
                return '<' + tagName +
                    (classNames ? ' class="' + classNames + '"' : '') +
                    (style ? ' style="' + style + '"' : '') +
                    (unselectable ? ' unselectable="on"' : '') +
                    p +
                    (innerHTML ? '>' + innerHTML + '</' + tagName + '>' : '/>');
            };

            ///////////////////////////////////////////////////////////
            // Функция, возвращающая html код тэга div
            ///////////////////////////////////////////////////////////
            var createDiv = function(classNames, style, unselectable, innerHTML, params) {
                return createTag('div', classNames, style, unselectable, innerHTML, params);
            };
            var that = this,
                schemeDataObj = {},
                scheme$ = this.element,
                $blocker = $(createDiv('scheme-blocker', '', 1)),
                $schemeContainer = $(createDiv('scheme-main-container', '', 1)),
                opts = this.options,
                blocksSruct = {},
                specBlocksHGap = 10,
                schemeW = scheme$.width(),
                schemeH = scheme$.height(),
                mainContHeight = 0,
                defaultSmallBlockWidth = 180,
                defaultSmallBlockHeight = 80,
                defaultSmallBlockColors = ['#97bde2', '#ECB888', '#EEEB8A', '#A8DBA0', '#A1CADC', '#E2DED3'],
                SHOW_BLOCK_CONTENT_TITLE = 'Показать содержимое блока',
                SHOW_CHILD_BLOCKS_TITLE = 'Показать дочерние элементы',
                HIDE_CHILD_BLOCKS_TITLE = 'Скрыть дочерние элементы',
                defaultSmallBlockRenderer = function(data) {
                    return createDiv('block-text-wrapper', '', 0, createTag('span', 'block-text-span', '', 1, 'test'));
                };

            if (that.options.typeline == 'none') this.element.addClass('noline');
            if (that.options.main) {
              this.element.addClass('main');
              defaultSmallBlockColors[0] = '#0E6DAD';
            }

            $.extend(true, schemeDataObj, this.options.data);

            this.resize = function() {
                updateMainContainerPosition();
            };

            // Костыль
            if (!opts.smallBlockRenderer) {
                opts.smallBlockRenderer = defaultSmallBlockRenderer;
            }

            ///////////////////////////////////////////////////////////
            // Создание элементов схемы (блоки, линии)
            ///////////////////////////////////////////////////////////
            var createBlock = function(blockObj, parent, lvl, sObj) {
                if (!lvl) {
                    lvl = 0;
                }
                var numChildren = (blockObj.childs && blockObj.childs.length > 0) ? blockObj.childs.length : 0,
                    $childsBlock,
                    $block = createSmallBlock(blockObj, lvl, sObj),
                    childs = [];

                sObj.$block = $block;
                sObj.opened = false;
                sObj.id = blockObj.id;

                if (blockObj.bigBlock) {
                    blockObj.bigBlock.color = blockObj.smallBlock.color || defaultSmallBlockColors[lvl];
                }

                if (numChildren) {
                    $childsBlock = $(createDiv('scheme-block-childs'));

                    sObj.$childs = $childsBlock;
                    sObj.maxh = 0;
                    sObj.curh = 0;
                    sObj.lvl = lvl;

                    if (numChildren > 0) { // #12292 Изменена 1 на 0, чтобы горизонтальные линии были всегда, на случай если дочерний блок слишком широкий
                        $childsBlock.append(createDiv('hline'));
                    }
                    $childsBlock.append(createDiv('vline'));

                    for (var i = 0; i < numChildren; i++) {
                        $childsBlock.append(createDiv('vline'));
                        var o = {};
                        childs.push(o);
                        createBlock(blockObj.childs[i], $childsBlock, lvl + 1, o);
                    }
                    sObj.childs = childs;
                    $schemeContainer.append($childsBlock);
                }

                parent.append($block);
            };

            // #10829 Общая функция, которая будет удалять панели редактирования и бордер у блоков,
            // если произведен выход из режима редактирования, сохранение и т.д.
            var resetEditBlock = function() {
                $('.block-edit-process').removeClass('block-edit-process');
                $('.block-edit-panel').remove();
                $('.edit-popup-btn-wrapper').remove();
            };

            ///////////////////////////////////////////////////////////
            // Создание маленького блока
            ///////////////////////////////////////////////////////////
            var createSmallBlock = function(blockObj, lvl, sObj) {
                var blockDataObj = blockObj.smallBlock,
                    id = blockObj.id,
                    w = blockDataObj.width || opts.smallBlockWidth,
                    h = blockDataObj.height || opts.smallBlockHeight,
                    title = blockDataObj.title || '',
                    valign = blockObj.smallBlock.valign,
                    img = blockDataObj.img || undefined,
                    color = blockObj.color || defaultSmallBlockColors[lvl],
                    customData = blockDataObj.customData || {},
                    hasContent = (blockObj.bigBlock) ? true : false,
                    hasChildren = (blockObj.childs && blockObj.childs.length > 0) ? true : false,
                    defaultSmallBlockImageRenderer = function(data) {
                        return createTag('img', '', 'width: 100%; height: 100%;', 0, '', { src: data.img, title: data.title });
                    },
                    renderer = blockDataObj.renderer || (img ? defaultSmallBlockImageRenderer : opts.smallBlockRenderer),

                    $block = $(createDiv('block-small bb' + id + ' ' + (blockDataObj.customClass ? blockDataObj.customClass : ''), 'width:' + w + 'px; height:' + h + 'px;', 0,
                        createDiv('block-container') +
                        createDiv('btn-show-content', '', 1, '', { title: SHOW_BLOCK_CONTENT_TITLE }) +
                        createDiv('btn-expand-childs', '', 1, '', { title: SHOW_CHILD_BLOCKS_TITLE })
                    )),

                    dataObj = {
                        width: w,
                        height: h,
                        title: title,
                        valign: valign,
                        img: img,
                        color: color,
                        customData: customData
                    },
                    open_btn$ = $('.btn-expand-childs', $block),
                    show_content_btn$ = $('.btn-show-content', $block),
                    blockContainer$ = $('.block-container', $block),
                    blockClickHandler = function(e) {
                        if (sObj.opened) {
                            closeSomeBlocks(getOpenedBlocksArray(sObj));
                        }
                        else {
                            openBlock(sObj);
                        }
                    };

                // #10829 В режиме редактирования при клике по блоку, будут отображаться кнопки с действиями.
                var editableAttr = that.options.xmlData.find('ischeme').attr('editable');
                if (editableAttr && editableAttr == 'true') {
                    blockContainer$.on('click', function(e) {
                        if (that.options.editMode) {
                            // Отключаем распространение события, чтобы одновременно не показывались / не скрывались
                            // дочерние блоки текущего блока
                            e.stopImmediatePropagation();
                            resetEditBlock();
                            $block.addClass('block-edit-process');
                            $block.append(createBlockEditPanel());
                        }
                    });
                }

                // #10829 Функция создания панели с кнопками для редактирования
                var createBlockEditPanel = function() {
                    var $panelBlock = $('<div class="block-edit-panel"></div>')
                        .tooltip({
                            open (event, ui) {
                                ui.tooltip.addClass('courseml').attr('skin', CourseConfig.templateSkin);
                            },
                        });
                    var $editText = $('<div class="block-edit-panel__text" title="' + RES.editTextTooltip + '"></div>');
                    var $addImage = $('<div class="block-edit-panel__img" title="' + RES.addImageTooltip + '"></div>');
                    var $addBlock = $('<div class="block-edit-panel__block" title="' + RES.addBlockTooltip + '"></div>');
                    var $addPopup = $('<div class="block-edit-panel__popup" title="' + RES.addPopupTooltip + '"></div>');
                    var $editColor = $('<div class="block-edit-panel__color" title="' + RES.editColorTooltip + '"></div>');
                    var $addLink = $('<div class="block-edit-panel__link"></div>');
                    var $deleteBtn = $('<div class="block-edit-panel__delete" title="' + RES.deleteBtnTooltip + '"></div>');
                    var $saveBtn = $('<div class="block-edit-panel__save" title="' + RES.saveBtnTooltip + '"></div>');
                    var schemeRerender = function ($editableBlock, xmlData) {
                        xmlData = xmlData || that.options.xmlData;
                        that.options.wrapper.html('');
                        // Устанавливаем атрибут так, чтобы схема открылась на последнем редактируемом блоке
                        xmlData.find('ischeme')
                            .attr('showblock', $editableBlock.attr('parent') == "0" ? "1" : $editableBlock.attr('parent'));
                        // Укажем в параметре, что произошел ререндеринг при работе со схемой, чтобы брались новые данные,
                        // а не с сервера
                        that.options.params.isRerender = true;

                        // #12290 Сохраняем изменения в глобальную переменную для передачи на другой слайд
                        if (that.options.params.global != void 0 && globalParam['scheme' + that.options.params.jsID] != void 0) {
                            globalParam['scheme' + that.options.params.jsID] = xmlData;
                        }

                        new InteractiveScheme().init(that.options.wrapper, xmlData, that.options.params);
                        $('.btn-edit-scheme').trigger('click');
                        $('[blockid="' + $editableBlock.attr('id') +'"]').find('.block-container').trigger('click');
                    }
                    // Возвращает размеры блока исходя из контента внутри
                    var newBlockSize = function() {
                        var fakeBlockObj = {
                            id: '-1',
                            childs: [],
                            smallBlock: {
                                title: $('.edit-scheme-text').html(),
                                valign: 'middle'
                            },
                            parent: '0'
                        }
                        // #12164
                        // Создадим фейковый блок, вставим в схему, вычислим размер и зададим атрибуты для блока
                        var $fakeBlock = createSmallBlock(fakeBlockObj).css({
                            height: '',
                            opacity: 0
                        });
                        $('.physicon-scheme').append($fakeBlock);
                        var paddingValue = parseInt($('.block-container', $fakeBlock).css('padding'));
                        // Вычисляем высоту внутреннего контейнера с текстом
                        var height = $('.block-text-wrapper', $fakeBlock).height() + paddingValue * 2;
                        var width = $fakeBlock.width();
                        if (height < 110) {
                            height = 110;
                        } else if (height < 160) {
                            height = 160;
                        } else if (height < 210) {
                            height = 210;
                        }
                        $fakeBlock.height(height);
                        // Если контент не умещается по ширине, то изменим ее
                        if (width < $('.block-text-wrapper', $fakeBlock).width() + paddingValue * 2) {
                            width = $('.block-text-wrapper', $fakeBlock).width() + paddingValue * 2;
                        }
                        return {width, height}
                    }

                    // Если велась работа с ВО блока, то удалим кнопки
                    $('.edit-popup-btn-wrapper').remove();

                    // Замена текста в блоке
                    $editText.on('click', function() {
                        $editText.addClass('block-edit-panel__text_active');

                        // Если велась работа с ВО блока, то удалим кнопки и уберем подсветку с иконки
                        $('.edit-popup-btn-wrapper').remove();
                        $addPopup.removeClass('block-edit-panel__popup_active');

                        var $currentBlock = that.options.xmlData.find('block#' + $block.attr('blockid').replace(/\./g, '\\.'));
                        var textInBlock = $('name', $currentBlock).html();
                        var alignText = $(textInBlock).attr('align') || 'center';
                        function markAsChecked(currentValue, inputValue) {
                            if (currentValue == inputValue) {
                                return 'checked';
                            }
                            return '';
                        }

                        $('#popup').html(
                            '<div class="edit-scheme-text edit-scheme-text_block" contenteditable="true">' + textInBlock + '</div>' +
                            '<form class="edit-scheme-form" id="textAlignForm">' +
                            '<span class="edit-scheme-form__item"><input ' + markAsChecked(alignText, "left") + ' name="imagePosition" value="left" type="radio" id="textAlignLeft" /><label for="textAlignLeft">' + RES.leftAlign + '</label></span>' +
                            '<span class="edit-scheme-form__item"><input ' + markAsChecked(alignText, "center") + ' name="imagePosition" value="center" type="radio" id="textAlignCenter" /><label for="textAlignCenter">' + RES.centerAlign + '</label></span>' +
                            '<span class="edit-scheme-form__item"><input ' + markAsChecked(alignText, "right") + ' name="imagePosition" value="right" type="radio" id="textAlignRight" /><label for="textAlignRight">' + RES.rightAlign + '</label></span>' +
                            '<span class="edit-scheme-form__item"><input ' + markAsChecked(alignText, "justify") + ' name="imagePosition" value="justify" type="radio" id="textAlignJustify" /><label for="textAlignJustify">' + RES.justifyAlign + '</label></span>' +
                            '</form>' +
                            '<div class="edit-scheme-btn-wrapper">' +
                            '<div class="edit-scheme-add-btn">' + RES.editableSchemeAdd + '</div>' +
                            '<div class="edit-scheme-cancel-btn">' + RES.editableSchemeCancel + '</div>' +
                            '</div>'
                        );
                        $('#popup').popup('option', 'width', 900);
                        $('#popup').popup('option', 'height', 600);
                        $('#popup').popup('option', 'title', RES.blockText);
                        $('#popup').popup('option', 'draggable', false);
                        PlayerCourse.openPopup();
                        $('.ui-widget-overlay, .edit-scheme-cancel-btn, .ui-dialog-titlebar-close')
                            .on('click', function() {
                                PlayerCourse.closePopup();
                                $editText.removeClass('block-edit-panel__text_active');
                            });
                        $('.edit-scheme-add-btn').on('click', function() {
                            var textAlign = $('#textAlignForm').serializeArray()[0]['value'];
                            $('.edit-scheme-text p').attr('align', textAlign);
                            $currentBlock.find('name').html($.parseHTML($('.edit-scheme-text').html()));
                            $currentBlock.attr(newBlockSize());
                            schemeRerender($currentBlock);
                            PlayerCourse.closePopup();
                            $editText.removeClass('block-edit-panel__text_active');
                        });
                    });

                    // Добавление картинки в блоке
                    $addImage.on('click', function() {
                        $addImage.addClass('block-edit-panel__img_active');

                        // Если велась работа с ВО блока, то удалим кнопки и уберем подсветку с иконки
                        $('.edit-popup-btn-wrapper').remove();
                        $addPopup.removeClass('block-edit-panel__popup_active');

                        var $currentBlock = that.options.xmlData.find('block#' + $block.attr('blockid').replace(/\./g, '\\.'));
                        /*var relativeImageSrcInBlock = '';

                        // Если в теге name есть элемент с картинкой
                        if ($currentBlock.find('name').find('object').length !== 0) {
                            relativeImageSrcInBlock = $currentBlock.find('name').find('object').attr('file');
                        }

                        var modelId = that.options.params.jsID;
                        // Удалим номер модели из пути к картинке
                        relativeImageSrcInBlock = relativeImageSrcInBlock.replace(modelId + '/', '');*/

                        $('#popup').html(
                            //'<textarea class="edit-scheme-text">' + relativeImageSrcInBlock + '</textarea>' +
                            '<div class="edit-scheme-btn-wrapper">' +
                            '<div class="edit-scheme-add-btn">' + RES.editableSchemeAdd + '</div>' +
                            '<div class="edit-scheme-cancel-btn">' + RES.editableSchemeCancel + '</div>' +
                            '</div>'
                        );
                        $('#popup').popup('option', 'width', 630);
                        $('#popup').popup('option', 'height', 120);
                        $('#popup').popup('option', 'title', RES.insertNewImage);
                        $('#popup').popup('option', 'draggable', false);
                        PlayerCourse.openPopup();
                        $('.ui-widget-overlay, .edit-scheme-cancel-btn, .ui-dialog-titlebar-close')
                            .on('click', function() {
                                PlayerCourse.closePopup();
                                $addImage.removeClass('block-edit-panel__img_active');
                            });
                        $('.edit-scheme-add-btn').on('click', function() {
                            /*
                            var currentImageSrc = modelId + '/' + $.trim($('.edit-scheme-text').val());
                            // Если картинка есть, то меняем путь на указанный
                            if ($currentBlock.find('name').find('object').length !== 0) {
                                $currentBlock.find('name').find('object')
                                    .attr('file', currentImageSrc);
                            } else {
                                // Если картинки не было в разметке, то вставляем элемент object в блок
                                $currentBlock.find('name')
                                    .prepend('<figure align="left"><object file="' + currentImageSrc + '" /></figure>');
                            }
                            */


                            let slideId = CourseConfig.items[CourseConfig.currentSlide].id;
                            let callback = function(doneEvent, doneData) {
                                var mimeType = doneData.files[0].type;
                                var hash = doneData.result.hash;

                                AppPlayer.getAttachDataImage({
                                    hash: hash,
                                    mimeType: mimeType,
                                    callback: function (src) {
                                        // Если картинка есть, то меняем путь на указанный
                                        if ($currentBlock.find('name').find('object').length !== 0) {
                                            // Удаляем старую картинку с сервера
                                            PlayerCourse.trigger(
                                                'deleteAttach',
                                                [
                                                    CourseConfig.items[CourseConfig.currentSlide].id,
                                                    $currentBlock.find('name').find('object').attr('hash')
                                                ]
                                            );
                                            $currentBlock.find('name').find('object')
                                                .attr({
                                                    file: src,
                                                    hash: hash
                                                });
                                        } else {
                                            // Если картинки не было в разметке, то вставляем элемент object в блок
                                            $currentBlock.find('name')
                                                .prepend('<figure align="left"><object file="' + src +'" hash="' + hash + '"/></figure>');
                                        }
                                        schemeRerender($currentBlock);

                                        PlayerCourse.closePopup();
                                        $addImage.removeClass('block-edit-panel__img_active');
                                    }
                                });
                            }
                            PlayerCourse.trigger('attachFile', [{slideId, callback}]);
                        });

                    });

                    // Добавление нового блока
                    $addBlock.on('click', function() {
                        $addBlock.addClass('block-edit-panel__block_active');

                        // Если велась работа с ВО блока, то удалим кнопки и уберем подсветку с иконки
                        $('.edit-popup-btn-wrapper').remove();
                        $addPopup.removeClass('block-edit-panel__popup_active');

                        $('#popup').html(
                            '<div class="edit-scheme-text" contenteditable="true">' + RES.newBlock + '</div>' +
                            '<div class="edit-scheme-btn-wrapper">' +
                            '<div class="edit-scheme-add-btn">' + RES.editableSchemeAdd + '</div>' +
                            '<div class="edit-scheme-cancel-btn">' + RES.editableSchemeCancel + '</div>' +
                            '</div>'
                        );
                        $('#popup').popup('option', 'width', 900);
                        $('#popup').popup('option', 'height', 600);
                        $('#popup').popup('option', 'title', RES.newBlockText);
                        $('#popup').popup('option', 'draggable', false);
                        PlayerCourse.openPopup();
                        $('.ui-widget-overlay, .edit-scheme-cancel-btn, .ui-dialog-titlebar-close')
                            .on('click', function() {
                                PlayerCourse.closePopup();
                                $addBlock.removeClass('block-edit-panel__block_active');
                            });
                        $('.edit-scheme-add-btn').on('click', function() {
                            var parentBlockId = $block.attr('blockid');
                            var parentBlockChildsLength = that.options.xmlData.find('ischeme')
                                .find('block[parent = "' + parentBlockId + '"]').length;
                            var newBlockId = parentBlockId + '.' + (parentBlockChildsLength + 1);
                            var newBlockMarkUp = '<block id="'+newBlockId+'" parent="'+parentBlockId+'"><name>' +
                                $('.edit-scheme-text').html() + '</name></block>';

                            // Если создается первый дочерний блок у текущего, то в xml добавляем новый блок сразу после
                            // текущего
                            if (parentBlockChildsLength === 0) {
                                that.options.xmlData.find('ischeme')
                                    .find('#' + parentBlockId.replace(/\./g, '\\.'))
                                    .after(newBlockMarkUp);
                            } else {
                                // Если у текущего блока уже есть дочерние, то вставляем новый блок после последнего
                                // дочернего
                                that.options.xmlData.find('ischeme')
                                    .find('#' + parentBlockId.replace(/\./g, '\\.') + '\\.' + parentBlockChildsLength)
                                    .after(newBlockMarkUp);
                            }

                            var $newBlock = that.options.xmlData.find('block#' + newBlockId.replace(/\./g, '\\.'));
                            $newBlock.attr(newBlockSize());

                            schemeRerender($newBlock);

                            PlayerCourse.closePopup();
                            $addBlock.removeClass('block-edit-panel__block_active');
                        });
                    });

                    // Добавление ВО
                    $addPopup.on('click', function() {
                        var $panelPopup = $('<div class="popup-edit-panel"></div>')
                            .tooltip({
                                open (event, ui) {
                                    ui.tooltip.addClass('courseml').attr('skin', CourseConfig.templateSkin);
                                },
                            });;
                        var $editText = $('<div class="popup-edit-panel__text" title="' + RES.editTextTooltip + '"></div>');
                        var $addImage = $('<div class="popup-edit-panel__img" title="' + RES.addImageTooltip + '"></div>');
                        var $addLink = $('<div class="popup-edit-panel__link" title="' + RES.addLinkTooltip + '"></div>');
                        $panelPopup.append($editText, [$addImage, $addLink]);

                        var selectionText = ''; // Сюда будет объект выделенного текста из ВО для оборачивания в ссылку

                        // Скопируем данные xml, т.к. они не должны менять основной до нажатия кнопки сохранения ВО блока
                        var tempXmlData = $.extend({}, that.options.xmlData);

                        var $currentBlock = tempXmlData.find('block#' + $block.attr('blockid').replace(/\./g, '\\.'));

                        // Чтобы изменения не попадали в основной XML модели, содержимое текущего ВО получаем тоже в
                        // виде разметки
                        var $currentBlockPopup = $currentBlock.find('info').length === 0 ? $('<info />') : $($currentBlock.find('info'));

                        var $popupObject = $currentBlockPopup.find('object').length === 0
                            ? '' : $currentBlockPopup.find('object');

                        $editText.on('click', function() {
                            $('.popup-edit-panel').find('.active').removeClass('active');
                            $editText.addClass('active');
                            var popupText = $currentBlockPopup.html();
                            $('#popup').html(
                                '<div class="edit-scheme-text" contenteditable="true">' + popupText + '</div>' +
                                '<div class="edit-scheme-btn-wrapper">' +
                                '<div class="edit-scheme-add-btn">' + RES.editableSchemeAdd + '</div>' +
                                '<div class="edit-scheme-cancel-btn">' + RES.editableSchemeCancel + '</div>' +
                                '</div>'
                            );
                            $('#popup').popup('option', 'width', 900);
                            $('#popup').popup('option', 'height', 600);
                            $('#popup').popup('option', 'title', RES.popupText);
                            $('#popup').popup('option', 'draggable', false);
                            PlayerCourse.openPopup();
                            $('.ui-widget-overlay, .edit-scheme-cancel-btn, .ui-dialog-titlebar-close')
                                .on('click', function() {
                                    $editText.removeClass('active');
                                    // Закрыть окно, где редактировался текст
                                    PlayerCourse.closePopup();
                                });

                            // Вешаем событие на кнопку "Добавить" у окна правки текста
                            $('.edit-scheme-add-btn').on('click', function(e) {
                                $currentBlockPopup
                                    .html($.parseHTML($('.edit-scheme-text').html()));
                                $editText.removeClass('active');
                                // Закрыть окно, где редактировался текст
                                PlayerCourse.closePopup();

                                // Закрыть старое ВО блока перед обновлением с новыми данными
                                // Возможно, есть более лаконичный способ произвести закрытие этого ВО
                                $('[popup-id="' + $block.attr('blockid').replace(/\./g, '\\.') + '"]')
                                    .parent().find('.ui-dialog-titlebar-close').trigger('click');
                                // Удаляем панель реадктирования ВО блока
                                $('.popup-edit-panel').remove();

                                schemeRerender($currentBlock);
                                $('.block-edit-panel__popup').trigger('click');
                                $('.edit-popup-btn-wrapper__add').trigger('click');
                            });

                            // Добавление возможности удалять ссылки
                            $('.edit-scheme-text a').hover(
                                function() {
                                    var $linkDeleter = $('<span class="link-deleter"></span>');
                                    $linkDeleter.click(function(e) {
                                        $(this).parent('.block-popup-link').addClass('block-popup-link_disable');
                                        $(this).remove();
                                    });
                                    $(this).addClass('block-popup-link').append($linkDeleter);
                                },
                                function() {
                                    $(this).removeClass('block-popup-link').find('.link-deleter').remove();
                                }
                            ).click(function(e) {
                                if ($(this).hasClass('block-popup-link_disable')) {
                                    $(this).replaceWith($(this).text());
                                }
                            });
                        });

                        $addImage.on('click', function() {
                            $('.popup-edit-panel').find('.active').removeClass('active');
                            $addImage.addClass('active');

                            var modelId = that.options.params.jsID;
                            $('#popup').html(
                                //'<textarea class="edit-scheme-text">' +
                                    //($popupObject ? $popupObject.attr('file').replace(modelId + '/', '') : '') +
                                //'</textarea>' +
                                '<form class="edit-scheme-form">' +
                                '<span class="edit-scheme-form__item"><input checked name="imagePosition" type="radio" id="imagePositionBottom" /><label for="imagePositionBottom">' + RES.bottomAlign + '</label></span>' +
                                '<span class="edit-scheme-form__item"><input name="imagePosition" type="radio" id="imagePositionLeft" /><label for="imagePositionLeft">' + RES.leftAlign + '</label></span>' +
                                '</form>' +
                                '<div class="edit-scheme-btn-wrapper">' +
                                '<div class="edit-scheme-add-btn">' + RES.editableSchemeAdd + '</div>' +
                                '<div class="edit-scheme-cancel-btn">' + RES.editableSchemeCancel + '</div>' +
                                '</div>'
                            );
                            $('#popup').popup('option', 'title', RES.insertNewImage);
                            $('#popup').popup('option', 'width', 630);
                            $('#popup').popup('option', 'height', 150);
                            $('#popup').popup('option', 'draggable', false);
                            PlayerCourse.openPopup();

                            $('.ui-widget-overlay, .edit-scheme-cancel-btn, .ui-dialog-titlebar-close')
                                .on('click', function() {
                                    $addImage.removeClass('active');
                                    PlayerCourse.closePopup();
                                });

                            $('.edit-scheme-add-btn').on('click', function(e) {
                                let slideId = CourseConfig.items[CourseConfig.currentSlide].id;
                                let callback = function(doneEvent, doneData) {
                                    var mimeType = doneData.files[0].type;
                                    var hash = doneData.result.hash;

                                    AppPlayer.getAttachDataImage({
                                        hash: hash,
                                        mimeType: mimeType,
                                        callback: function (src) {
                                            if ($popupObject) {
                                                // Удаляем старую картинку с сервера
                                                PlayerCourse.trigger('deleteAttach', [slideId, $popupObject.attr('hash')]);
                                                $popupObject.attr({
                                                    file: src,
                                                    hash: hash
                                                });
                                                if ($('#imagePositionBottom').is(':checked')) {
                                                    $popupObject.parent('figure').attr('align', 'center')
                                                        .appendTo($currentBlockPopup);
                                                } else {
                                                    $popupObject.parent('figure').attr('align', 'left')
                                                        .prependTo($currentBlockPopup);
                                                }
                                            } else {
                                                if ($('#imagePositionBottom').is(':checked')) {
                                                    $currentBlockPopup
                                                        .append('<figure align="center"><object file="' + src + '" hash="' + hash + '" border="1"/></figure>');
                                                } else {
                                                    $currentBlockPopup
                                                        .prepend('<figure align="left"><object file="' + src + '" hash="' + hash + '" border="1"/></figure>');
                                                }
                                            }
                                            PlayerCourse.closePopup();
                                            // Закрыть старое ВО блока перед обновлением с новыми данными
                                            // Возможно, есть более лаконичный способ произвести закрытие этого ВО
                                            $('[popup-id="' + $block.attr('blockid').replace(/\./g, '\\.') + '"]')
                                                .parent().find('.ui-dialog-titlebar-close').trigger('click');

                                            schemeRerender($currentBlock);
                                            $('.block-edit-panel__popup').trigger('click');
                                            $('.edit-popup-btn-wrapper__add').trigger('click');
                                        }
                                    });
                                }
                                PlayerCourse.trigger('attachFile', [{slideId, callback}]);
                            });
                        });

                        $addLink.on('click', function() {
                            if ($(this).hasClass('popup-edit-panel__link_disable')) {
                                return;
                            }
                            $('.popup-edit-panel').find('.active').removeClass('active');
                            $addLink.addClass('active');
                            $('#popup').html(
                                '<textarea class="edit-scheme-text"></textarea>' +
                                '<div class="edit-scheme-btn-wrapper">' +
                                '<div class="edit-scheme-add-btn">' + RES.editableSchemeAdd + '</div>' +
                                '<div class="edit-scheme-cancel-btn">' + RES.editableSchemeCancel + '</div>' +
                                '</div>'
                            );
                            $('#popup').popup('option', 'width', 900);
                            $('#popup').popup('option', 'height', 600);
                            $('#popup').popup('option', 'title', RES.insertLink);
                            $('#popup').popup('option', 'draggable', false);
                            PlayerCourse.openPopup();
                            $('.ui-widget-overlay, .edit-scheme-cancel-btn, .ui-dialog-titlebar-close')
                                .on('click', function() {
                                    $addLink.removeClass('active');
                                    // Закрыть окно, где редактировался текст
                                    PlayerCourse.closePopup();
                                });

                            $('.edit-scheme-add-btn').on('click', function(e) {
                                var linkText = $.trim($('.edit-scheme-text').val());

                                if (selectionText && $.trim(linkText)) {
                                    // Если есть выделенная область
                                    if (!selectionText.collapsed) {
                                        var $linkElem = $('<a href="' + $.trim(linkText) + '"></a>');
                                        selectionText.surroundContents($linkElem[0]);
                                        var $popupContent = $('#block-popup > div');
                                        // Переводим разметку html ВО в xml для перезаписи блока.
                                        // Изменим атрибут style на align
                                        $popupContent.find('p[style]').each(function(index, item) {
                                            var textAlign = $(item).css('text-align');
                                            $(item).removeAttr('style').attr('align', textAlign);
                                        });

                                        $currentBlockPopup.html($.parseHTML($popupContent.html()));
                                    }
                                }

                                $addLink.removeClass('active');
                                // Закрыть окно, где редактировался текст
                                PlayerCourse.closePopup();
                                // Закрыть старое ВО блока перед обновлением с новыми данными
                                // Возможно, есть более лаконичный способ произвести закрытие этого ВО
                                $('[popup-id="' + $block.attr('blockid').replace(/\./g, '\\.') + '"]')
                                    .parent().find('.ui-dialog-titlebar-close').trigger('click');
                                // Удаляем панель реадктирования ВО блока
                                $('.popup-edit-panel').remove();

                                schemeRerender($currentBlock);
                                $('.block-edit-panel__popup').trigger('click');
                                $('.edit-popup-btn-wrapper__add').trigger('click');
                            });
                        });


                        $addPopup.addClass('block-edit-panel__popup_active');
                        $('.edit-popup-btn-wrapper').remove();
                        // Если у блока уже есть ВО, то делаем активной кнопку удаления и создаем кнопку редактирования
                        if (hasContent) {
                            var $editPopupBtnGroup = $(
                                '<div class="edit-popup-btn-wrapper">' +
                                '<div class="edit-popup-btn-wrapper__add">' + RES.editableSchemeEdit + '</div>' +
                                '<div class="edit-popup-btn-wrapper__del">' + RES.editableSchemeDelete + '</div>' +
                                '</div>'
                            );
                            $panelBlock.after($editPopupBtnGroup);

                            $('.edit-popup-btn-wrapper__add', $editPopupBtnGroup).on('click', function() {
                                show_content_btn$.trigger('click');
                                $('.ui-widget-overlay, .ui-dialog-titlebar-close')
                                    .on('click', function() {
                                        $('.popup-edit-panel').remove();  // При закрытии этого окна удаляем панель редактирования ВО
                                    });

                                // Находим открывшееся ВО по id блока
                                var $openedPopup = $('[popup-id="' + $block.attr('blockid').replace(/\./g, '\\.') + '"]');
                                $openedPopup.after($panelPopup.clone(true));

                                $(document).unbind('selectionchange');
                                $(document).bind('selectionchange', function() {
                                    if ($(document.getSelection().anchorNode).closest($openedPopup).length) {
                                        selectionText = document.getSelection().getRangeAt(0);
                                        // Если область выделения находится в пределах одного элемента и это не ссылка. Позволяем добавить ссылку.
                                        if (selectionText.startContainer === selectionText.endContainer &&
                                            ($(selectionText.startContainer).parent()[0].nodeName.toLowerCase() !== 'a')) {
                                            $('.popup-edit-panel__link').removeClass('popup-edit-panel__link_disable');
                                        } else {
                                            // Если область выделения находится в разных контейнерах, то есть ссылки. Запрет добавления новой.
                                            $('.popup-edit-panel__link').addClass('popup-edit-panel__link_disable');
                                        }
                                    }
                                });
                            });
                            $('.edit-popup-btn-wrapper__del', $editPopupBtnGroup).on('click', function() {
                                $currentBlockPopup.remove();
                                schemeRerender($currentBlock);
                            });
                        } else {
                            // Если ранее ВО у блока не было, то делаем активной кнопку добавления
                            var $editPopupBtnGroup = $(
                                '<div class="edit-popup-btn-wrapper">' +
                                '<div class="edit-popup-btn-wrapper__add">' + RES.editableSchemeAdd + '</div>' +
                                '<div class="edit-popup-btn-wrapper__del">' + RES.editableSchemeDelete + '</div>' +
                                '</div>'
                            );
                            $panelBlock.after($editPopupBtnGroup);

                            $('.edit-popup-btn-wrapper__del', $editPopupBtnGroup).addClass('edit-popup-btn-wrapper__del_disable');

                            $('.edit-popup-btn-wrapper__add', $editPopupBtnGroup).on('click', function() {
                                // Вставляем пустой ВО в блок
                                $currentBlock.find('name').after($currentBlockPopup);
                                // Ререндерим схему
                                schemeRerender($currentBlock);
                                // После ререндеринга ищем кнопку открытия ВО таким образом, потому что ссылка
                                // в $block на блок теряется.
                                $('[blockid="' + $block.attr('blockid').replace(/\./g, '\\.') + '"]')
                                    .find('.btn-show-content').trigger('click');
                                $('.ui-widget-overlay, .ui-dialog-titlebar-close')
                                    .on('click', function() {
                                        $('.popup-edit-panel').remove();  // При закрытии этого окна удаляем панель редактирования ВО
                                    });

                                $('.block-edit-panel__popup').trigger('click');

                                // Находим открывшееся ВО по id блока
                                var $openedPopup = $('[popup-id="' + $block.attr('blockid').replace(/\./g, '\\.') + '"]');
                                $openedPopup.after($panelPopup.clone(true));

                                $(document).unbind('selectionchange');
                                $(document).bind('selectionchange', function() {
                                    if ($(document.getSelection().anchorNode).closest($openedPopup).length) {
                                        selectionText = document.getSelection().getRangeAt(0);
                                        // Если область выделения находится в пределах одного элемента и это не ссылка. Позволяем добавить ссылку.
                                        if (selectionText.startContainer === selectionText.endContainer &&
                                            ($(selectionText.startContainer).parent()[0].nodeName.toLowerCase() !== 'a')) {
                                            $('.popup-edit-panel__link').removeClass('popup-edit-panel__link_disable');
                                        } else {
                                            // Если область выделения находится в разных контейнерах, то есть ссылки. Запрет добавления новой.
                                            $('.popup-edit-panel__link').addClass('popup-edit-panel__link_disable');
                                        }
                                    }
                                });
                            });
                        }
                    });

                    // Изменение цвета блока
                    // #12163 Регистрируем событие, если есть блок с цветами
                    if (that.options.xmlData.find('highlights').length !== 0) {
                        $editColor.on('click', function() {
                            $editColor.addClass('block-edit-panel__color_active');

                            // Если велась работа с ВО блока, то удалим кнопки и уберем подсветку с иконки
                            $('.edit-popup-btn-wrapper').remove();
                            $addPopup.removeClass('block-edit-panel__popup_active');

                            // Создание палитры
                            var colorsList = [];
                            that.options.xmlData.find('highlights').find('highlight')
                                .each(function(index, item) {
                                    if ($(item).attr('color')) {
                                        colorsList.push($(item).attr('color'));
                                    }
                                });

                            var colorElements = '<li class="edit-scheme-colors-list__item edit-scheme-colors-list__item_empty">' +
                                '<div class="edit-scheme-colors-list__item-cross"></div>' +
                                '</li>';
                            colorsList.forEach(function(item) {
                                colorElements +=
                                    '<li class="edit-scheme-colors-list__item" ' +
                                    'data-color="' + item + '" style="background-color: ' + item + '"></li>';
                            });

                            $('#popup').html(
                                '<ul class="edit-scheme-colors-list">' + colorElements + '</ul>' +
                                '<div class="edit-scheme-btn-wrapper">' +
                                '<div class="edit-scheme-add-btn">' + RES.editableSchemeAdd + '</div>' +
                                '<div class="edit-scheme-cancel-btn">' + RES.editableSchemeCancel + '</div>' +
                                '</div>'
                            );
                            $('#popup').popup('option', 'width', 630);
                            $('#popup').popup('option', 'height', 160);
                            $('#popup').popup('option', 'title', RES.selectColor);
                            $('#popup').popup('option', 'draggable', false);
                            PlayerCourse.openPopup();

                            $('.ui-widget-overlay, .edit-scheme-cancel-btn, .ui-dialog-titlebar-close')
                                .on('click', function() {
                                    PlayerCourse.closePopup();
                                    $editColor.removeClass('block-edit-panel__color_active');
                                });

                            // Блоки с цветами
                            $('#popup .edit-scheme-colors-list__item').on('click', function() {
                                if ($(this).hasClass('edit-scheme-colors-list__item_active')) {
                                    $(this).removeClass('edit-scheme-colors-list__item_active');
                                } else {
                                    $('#popup .edit-scheme-colors-list__item_active').removeClass('edit-scheme-colors-list__item_active');
                                    $(this).addClass('edit-scheme-colors-list__item_active');
                                }
                            });

                            $('.edit-scheme-add-btn').on('click', function() {
                                // Получаем выбранный цвет, меняем разметку и производим ререндеринг
                                var currentColor = $('#popup .edit-scheme-colors-list__item_active').first().data('color');
                                var blockId = $block.attr('blockid');
                                var $currentBlock = that.options.xmlData.find('block#' + $block.attr('blockid').replace(/\./g, '\\.'));
                                if (currentColor) {
                                    that.options.xmlData.find('block#' + blockId.replace(/\./g, '\\.'))
                                        .attr('color', currentColor);
                                } else {
                                    that.options.xmlData.find('block#' + blockId.replace(/\./g, '\\.'))
                                        .removeAttr('color');
                                }

                                schemeRerender($currentBlock);

                                PlayerCourse.closePopup();
                                $editColor.removeClass('block-edit-panel__color_active');
                            });

                        });
                    }

                    // Добавление ссылки в блок
                    $addLink.on('click', function() {
                        $addLink.addClass('block-edit-panel__link_active');

                        // Если велась работа с ВО блока, то удалим кнопки и уберем подсветку с иконки
                        $('.edit-popup-btn-wrapper').remove();
                        $addPopup.removeClass('block-edit-panel__popup_active');

                        var linkInBlock = '';
                        var $currentBlock = that.options.xmlData.find('block#' + $block.attr('blockid').replace(/\./g, '\\.'));

                        // Если в теге name нет ссылок, то запишем обертку
                        if ($currentBlock.find('name').find('p').children('a').length === 0) {
                            linkInBlock = '<a href=""></a>';
                        } else {
                            linkInBlock = $currentBlock.find('name').find('p').find('a')[0].outerHTML;
                        }

                        $('#popup').html(
                            '<textarea class="edit-scheme-text">' + $.trim(linkInBlock) + '</textarea>' +
                            '<div class="edit-scheme-btn-wrapper">' +
                            '<div class="edit-scheme-add-btn">' + RES.editableSchemeAdd + '</div>' +
                            '<div class="edit-scheme-cancel-btn">' + RES.editableSchemeCancel + '</div>' +
                            '</div>'
                        );
                        $('#popup').popup('option', 'width', 900);
                        $('#popup').popup('option', 'height', 600);
                        $('#popup').popup('option', 'title', RES.insertLink);
                        $('#popup').popup('option', 'draggable', false);
                        PlayerCourse.openPopup();
                        $('.ui-widget-overlay, .edit-scheme-cancel-btn, .ui-dialog-titlebar-close')
                            .on('click', function() {
                                PlayerCourse.closePopup();
                                $addLink.removeClass('block-edit-panel__link_active');
                            });
                        $('.edit-scheme-add-btn').on('click', function() {
                            // Если нет дочерних блоков, то ссылок тоже нет.
                            // Обернуть текст в name в тег p и добавить ссылку в теге p
                            if ($currentBlock.find('name').children().length === 0) {
                                var blockText = $currentBlock.find('name').text();
                                $currentBlock.find('name').html('<p align="center">' + blockText + '</p>');
                                if ($.trim($('.edit-scheme-text').val())) {
                                    $currentBlock.find('name')
                                        .append('<p align="center">' + ($.trim($('.edit-scheme-text').val()) || '<a href=""></a>') + '</p>');
                                }
                            } else {
                                if ($.trim($('.edit-scheme-text').val())) {
                                    // Если в блоке уже есть ссылка, то редактируем ее.
                                    if ($currentBlock.find('name').find('p').children('a').length !== 0) {
                                        $currentBlock.find('name').find('p')
                                            .find('a')[0].outerHTML = ($.trim($('.edit-scheme-text').val()) || '<a href=""></a>');
                                    } else {
                                        $currentBlock
                                            .find('name')
                                            .append('<p align="center">' + ($.trim($('.edit-scheme-text').val()) || '<a href=""></a>') + '</p>');
                                    }
                                }
                            }
                            schemeRerender($currentBlock);
                            PlayerCourse.closePopup();
                            $addLink.removeClass('block-edit-panel__link_active');
                        });
                    });

                    // Удаление блока
                    $deleteBtn.on('click', function() {
                        $deleteBtn.addClass('block-edit-panel__delete_active');

                        var $currentBlock = that.options.xmlData.find('block#' + $block.attr('blockid').replace(/\./g, '\\.'));

                        $('#popup').html(
                            '<div class="edit-scheme-delete-text">' + RES.deleteBlockConfirm + '</div>' +
                            '<div class="edit-scheme-btn-wrapper">' +
                            '<div class="edit-scheme-add-btn">' + RES.editableSchemeOk + '</div>' +
                            '<div class="edit-scheme-cancel-btn">' + RES.editableSchemeCancel + '</div>' +
                            '</div>'
                        );
                        $('#popup').popup('option', 'width', 900);
                        $('#popup').popup('option', 'height', 600);
                        $('#popup').popup('option', 'title', RES.deleteBlock);
                        $('#popup').popup('option', 'draggable', false);
                        PlayerCourse.openPopup();
                        $('.ui-widget-overlay, .edit-scheme-cancel-btn, .ui-dialog-titlebar-close')
                            .on('click', function() {
                                PlayerCourse.closePopup();
                                $deleteBtn.removeClass('block-edit-panel__delete_active');
                            });
                        $('.edit-scheme-add-btn').on('click', function() {
                            $currentBlock.remove();
                            schemeRerender($currentBlock);
                            PlayerCourse.closePopup();
                        });
                    });

                    $saveBtn.on('click', function() {
                        // Если велась работа с ВО блока, то удалим кнопки и уберем подсветку с иконки
                        $('.edit-popup-btn-wrapper').remove();
                        $addPopup.removeClass('block-edit-panel__popup_active');

                        var data = encodeURIComponent(that.options.xmlData.find('ischeme')[0].outerHTML);
                        if (typeof AppConfig === 'undefined' || !AppConfig.sessionKey) {
                            PlayerCourse.showSchemeSaveHint(RES.notAuthorizedSchemeSave);
                            return;
                        }
                        var callback = function(hintText) {
                            PlayerCourse.showSchemeSaveHint(hintText);
                        }
                        AppPlayer.saveStatement({data, callback});
                    });

                    // #12162 Если блок главный, то убираем кнопку удаления
                    if ($block.hasClass('block-root')) {
                        $panelBlock.append(
                            $editText, [$addImage, $addBlock, $addPopup, $saveBtn]
                        );
                    } else {
                        $panelBlock.append(
                            $editText, [$addImage, $addBlock, $addPopup, $deleteBtn, $saveBtn]
                        );
                    }

                    // #12163
                    if (that.options.xmlData.find('highlights').length !== 0) {
                        $addPopup.after($editColor);
                    }
                    $panelBlock.addClass('block-edit-panel_' + $panelBlock.children().length);

                    return $panelBlock;
                };

                $block.attr({
                  'color': color,
                  'blockid': id
                });

                // #10829 Понадобилось менять цвет блока таким образом, т.к. палитра теперь будет добавляться разработчиком
                // и цвета теперь могут быть любые. В стилях цвета задаются путем поиска определенного кода цвета в
                // атрибуте color родительского контейнера
                // Пример:
                // .scheme .block-small[color="#ECB888"] .block-container {
                //     background-color: #ECB888;
                // }
                // Теперь цвет может быть кастомным.
                blockContainer$.css('background-color', color);

                var contData = $(renderer(dataObj));
                blockContainer$.append(contData);
                // if (lvl == 0) {
                    // blockContainer$.find('.block-text-wrapper .block-text-span').first().css('color', 'white');
                // }
                // слушаем клики по ссылкам в маленьких блоках
                $('a', blockContainer$).click(function(e) {
                    e.stopImmediatePropagation();
                    var link_id = $(this).data('link-id');
                    if (link_id !== undefined) {
                        opts.linkHandler(link_id);
                    }
                });

                if (hasContent) {
                    blockContainer$.addClass('has-popup');
                    if (!hasChildren) {
                        blockContainer$.click(function(e) {
                            if (typeof opts.showblockcontent == 'function') {
                                that._trigger("showblockcontent", e, blockObj.bigBlock);
                            }
                            else {}
                        });
                    }
                    show_content_btn$.click(function(e) {
                        // Показать окно с контентом
                        // Нужно передать в функцию объект с параметрами большого блока!!!
                        //schemeOptions.smallBlockClickCallback(blockObj.bigBlock);
                        if (typeof opts.showblockcontent == 'function') {
                            if (that.options.editMode) { // #12484 Если окно открывается при редактировании, то рассчитаем максимальную высоту, чтобы освободить место для панели управления
                                // 25 - просто число для отступа сверху и снизу
                                blockObj.bigBlock.customMaxHeight = $(window).height() - ((25 * 2) * CourseConfig.zoomScale) - ($('.block-edit-panel').height()  * CourseConfig.zoomScale);
                            // #12484 И удалить это значение, если оно было сохранено в режиме редактирования, чтобы не применялось
                            } else {
                                delete blockObj.bigBlock.customMaxHeight;
                            }
                            that._trigger("showblockcontent", e, blockObj.bigBlock);
                        }
                        else {}
                    });
                }

                else {
                    show_content_btn$.remove();
                }

                if (hasChildren) {
                    if (!hasContent) {
                        blockContainer$.click(blockClickHandler);
                    }
                    open_btn$.click(blockClickHandler);

                    blockContainer$.hover(
                        function(e) {
                            blockContainer$.addClass('state-hover');
                        },
                        function(e) {
                            blockContainer$.removeClass('state-hover');
                        }
                    );
                }
                else {
                    open_btn$.remove();
                }
                return $block;
            };


            var normalScale = function() {
                $(document.body).addClass('normal-scale');
            }

            var restoreScale = function() {
                $(document.body).removeClass('normal-scale');
            }

            ///////////////////////////////////////////////////////////
            // Рендеринг схемы
            ///////////////////////////////////////////////////////////
            var schemeRenderer = function(blockObj, $parent) {
                // for correct calculating work need scale=1
                normalScale();

                var $block = blockObj.$block,
                    $childs = blockObj.$childs,
                    childsArray = blockObj.childs,
                    childsArrayLen = (blockObj.childs ? blockObj.childs.length : 0),
                    blockW = $block.width(),
                    blockH = $block.height();

                if (!$parent) {
                    var position = { top: 0, left: schemeW / 2 - blockW / 2};
                    $block.css(position)
                        .data(position)
                        .addClass('block-root');

                    // #10829 Если это родительский блок и у ischeme установлен атрибут editable,
                    // то установим значок редактирования
                    var editableAttr = that.options.xmlData.find('ischeme').attr('editable');
                    if (editableAttr && editableAttr == 'true') {
                        var $editSchemeBtn = $('<div />').addClass('btn-edit-scheme')
                            .attr('title', RES.onEditTooltip)
                            .tooltip({
                                open (event, ui) {
                                    ui.tooltip.addClass('courseml').attr('skin', CourseConfig.templateSkin);
                                },
                            });
                        $block.append($editSchemeBtn);
                        $editSchemeBtn.on('click', function(e) {
                            e.stopPropagation();
                            if (!that.options.editMode) {
                                that.options.editMode = true;
                                $editSchemeBtn.addClass('btn-edit-scheme_active').attr('title', RES.offEditTooltip);
                            } else {
                                that.options.editMode = false;
                                $editSchemeBtn.removeClass('btn-edit-scheme_active').attr('title', RES.onEditTooltip);
                                resetEditBlock();
                            }
                        });
                    }

                }

                if ($childs) {
                    var parentPos = $parent ? $parent.data() : { left: 0, top: 0 },
                        blockLeft = $block.data('left') + parentPos.left,
                        blockTop = $block.data('top') + parentPos.top,
                        childsPos,
                        childsLeft,
                        childsTop,
                        childsW,
                        i;

                    var maxBW = 0,
                        maxBH = [0, 0],
                        hgap = opts.smallBlockHorizontalGap,
                        vgap = opts.smallBlockVerticalGap,
                        paddingRight = 10,
                        paddingLeft = 10,
                        $blocks = $('>.block-small', $childs),
                        $hline = $('>.hline', $childs),
                        vlines$ = $('>.vline', $childs),
                        blocksNum = $blocks.length,
                        allW,
                        onFirstLayer,
                        twoLayers = false;

                    $blocks.each(function() {
                        maxBW = Math.max(maxBW, $(this).width());
                        maxBH[0] = Math.max(maxBH[0], $(this).height());
                    });

                    allW = maxBW * $blocks.length + hgap * ($blocks.length - 1) + specBlocksHGap;

                    onFirstLayer = $blocks.length;
                    twoLayers = false;

                    if (allW > schemeW) {
                        maxBH = [0, 0];
                        twoLayers = true;
                        onFirstLayer = Math.round($blocks.length / 2);

                        // evry layer theys maxH
                        $blocks.each(function(i) {
                            if (i > onFirstLayer - 1) {
                                maxBH[1] = Math.max(maxBH[1], $(this).height());
                            }
                            else {
                                maxBH[0] = Math.max(maxBH[0], $(this).height());
                            }
                        });
                    }

                    // blockObj.stage - если родитель twoLayers и из 2го ряда
                    var vlineH = (blockObj.stage) ? vgap + blockObj.stage - blockObj.maxBH[0] : 0; // - maxBH[0] : 0; // ???
                    if (blockObj.stage) {
                        blockObj.offset = vgap / 2 + vlineH; // ??
                    }

                    // prepare data and calculate bbw (width of childs block, its need for correct align - center of parent block)
                    var bbw = 0;
                    for (var i = 0; i < childsArrayLen; i++) {
                        // var bx = maxBW*i + hgap*i + (maxBW - childsArray[i].$block.width())/2 + specBlocksHGap,
                        var width = childsArray[i].$block.width(),
                            bx = (childsArray[i - 1] ? childsArray[i - 1].right + hgap : specBlocksHGap), //width*i + hgap*i + specBlocksHGap,
                            by = vlineH,
                            outsetx = 0;

                        childsArray[i].stage = 0;
                        childsArray[i].maxBH = maxBH;

                        if (twoLayers && i > onFirstLayer - 1) {
                            bx = childsArray[i - onFirstLayer].right - width / 2 + hgap / 2 - 1; // 1 width of line
                            by += maxBH[0] + vgap;

                            // check for blocks not coming on each other in 2nd line
                            if (i - onFirstLayer > 0) {
                                var minLeft = childsArray[i - 1].right + hgap - 1;
                                if (minLeft > bx) outsetx = minLeft - bx;
                            }
                        }

                        childsArray[i].stage = twoLayers && i < onFirstLayer ? maxBH[0] + maxBH[1] : 0;

                        var position = { top: by + vgap, left: bx + outsetx };
                        childsArray[i].$block.css(position).data(position);
                        $(vlines$[i + 1]).css({ height: vgap / 2 + by - vlineH, left: bx + width / 2, top: vgap / 2 + vlineH });

                        childsArray[i].right = bx + width + outsetx;

                        bbw = Math.max(bbw, childsArray[i].right - specBlocksHGap);
                    }

                    // Определить размер всех блоков
                    var bbh = vgap + (twoLayers ? maxBH[0] + maxBH[1] + vgap : maxBH[0]);

                    $childs.width(bbw + specBlocksHGap * 2);
                    $childs.height(bbh + vlineH);

                    blockObj.maxh = bbh + vlineH;

                    blockLeft = $block.data().left + ($parent ? $parent.data().left : 0);

                    childsW = $childs.width();
                    childsTop = blockTop + blockH;
                    childsLeft = blockLeft + blockW / 2 - childsW / 2;

                    if (childsLeft < 0) {
                        childsLeft = paddingLeft;
                    }
                    else if (childsLeft + childsW > schemeW) {
                        childsLeft = schemeW - childsW - paddingRight;
                    }

                    var childsPos = { top: childsTop, left: childsLeft };
                    $childs.css(childsPos).data(childsPos);

                    var vlineLeft = blockLeft - childsLeft + blockW / 2;
                    $('>.vline:first', $childs).css({ height: vgap / 2 + vlineH, left: vlineLeft });

                    // render childs and calculate some lines
                    var parentCenter = vlineLeft,
                        hlineLeft = vlineLeft,
                        hlineWidth = 0;
                    for (var i = 0; i < childsArrayLen; i++) {
                        var width = childsArray[i].$block.width(),
                            bx = (childsArray[i - 1] ? childsArray[i - 1].right + hgap : specBlocksHGap);
                        if (twoLayers && i > onFirstLayer - 1) {
                            bx = childsArray[i - onFirstLayer].right - width / 2 + hgap / 2 - 1; // 1 width of line
                        }
                        if (i == 0) {
                            hlineLeft = Math.min(parentCenter || Infinity, bx + width / 2);
                            hlineWidth = vlineLeft - hlineLeft + 3;
                        }
                        var childHlineWidth = bx + width / 2 - hlineLeft;
                        hlineWidth = Math.max(childHlineWidth, hlineWidth);

                        schemeRenderer(childsArray[i], $childs);
                    }


                    // horizontal line
                    $hline.css({
                        left: hlineLeft, // maxBW / 2 + specBlocksHGap,
                        width: hlineWidth, //maxBW * (onFirstLayer - 1) + hgap * (onFirstLayer - 1)  + (twoLayers && blocksNum % 2 == 0 ? maxBW / 2 + hgap / 2 : 0 ),
                        top: vgap / 2 + vlineH
                    });

                    //ARCH #8355 firsov
                    if (that.options.typeline == 'arrow') {
                        for (var i = 0; i < vlines$.length; i++) {
                          if (i == 0) continue;  // #8842
                            var d = $('<div>').appendTo($(vlines$[i]));
                            d.css('width', '3px');
                            d.css('height', 0);
                            d.css('border', '10px solid transparent');
                            d.css('border-top-color', '#1A6DA3');
                            d.css('border-top', '10');
                            d.css('margin-left', '-10px');
                            d.css('margin-top', ($(vlines$[i]).height() - 10) + 'px');
                        }
                    }


                }

                restoreScale();
            };

            ///////////////////////////////////////////////////////////
            // Функция возвращает массив объектов открытых блоков
            ///////////////////////////////////////////////////////////
            var getOpenedBlocksArray = function(blockObj, res) {
                var i,
                    childsNum = blockObj.childs ? blockObj.childs.length : 0;
                if (!res) res = [];
                if (blockObj.opened) {
                    res.push(blockObj);
                }
                if (childsNum) {
                    for (i = 0; i < childsNum; i++) {
                        getOpenedBlocksArray(blockObj.childs[i], res);
                    }
                }
                return res;
            };

            ///////////////////////////////////////////////////////////
            //Разворачивание блока
            ///////////////////////////////////////////////////////////
            var openBlock = function(sObj) {
                $blocker.show();
                var open = function() {
                    sObj.opened = true;
                    $schemeContainer.prepend(sObj.$childs);

                    var $obj = $('.btn-expand-childs', sObj.$block);
                    $obj.addClass('expanded');
                    $obj.attr('title', HIDE_CHILD_BLOCKS_TITLE);

                    // $blocker.hide();
                    // sObj.$childs.show();
                    // return;;

                    var top = $schemeContainer.css('top').replace('px', '') * 1;

                    $(sObj.$childs).slideDown({
                        duration: 500,
                        complete: function() {
                            $blocker.hide();
                            opts.onblockopened(sObj);
                        },
                        step: function(now, fx) {
                            if (fx.prop == 'height') {
                                var shemeTop = top - now / 2;
                                if (shemeTop < 12) shemeTop = 12;

                                $schemeContainer[0].style.top = shemeTop + 'px';

                                // sObj.curh = now;
                                // mainContHeight = 0;
                                // normalScale();
                                // resizeMainCont(blocksSruct);
                                // restoreScale();
                                // $schemeContainer.height(mainContHeight + 24);
                                //
                                // // centering at vertical:
                                // var top = schemeH/2 - (mainContHeight + 24)/2;
                                // top = top < 12 ? 12 : top;
                                // $schemeContainer.css({top: top});
                            }
                        }
                    });
                };

                normalScale();

                var $curChilds = sObj.$childs;
                $curChilds.show();

                var openedBlocksArray = getOpenedBlocksArray(blocksSruct);
                var $curChilds = sObj.$childs,
                    position = $curChilds.data(),
                    curX = position.left,
                    curY = $curChilds.data('curY') * 1,
                    curW = $curChilds.width(),
                    curH = $curChilds.height();

                // fix IE in zoom mode
                if (!curY) {
                    $curChilds.data('curY', curY = position.top);
                }
                else {
                    $curChilds.css('top', curY)
                }

                $curChilds.hide();
                if (sObj.offset != undefined) {
                    curY = curY + sObj.offset;
                    curH = curH - sObj.offset;
                }

                // console.log(openedBlocksArray, sObj)

                var crossedArr = [];
                // var crossedArr = openedBlocksArray;

                for (var j = 0; j < openedBlocksArray.length; j++) {
                    if (sObj.lvl == openedBlocksArray[j].lvl) crossedArr.push(openedBlocksArray[j]);
                }
                restoreScale();

                // if (openedBlocksArray.length > 1) crossedArr = openedBlocksArray;

                var ch = [];
                for (var j = 0; j < crossedArr.length; j++) {
                    var childs = getOpenedBlocksArray(crossedArr[j]);
                    ch = ch.concat(childs);
                }

                for (var jj = 0; jj < ch.length; jj++) {
                    var no = false;
                    for (var j = 0; j < crossedArr.length; j++) {
                        if (crossedArr[j] == ch[jj]) no = true;
                    }
                    if (!no) crossedArr.push(ch[jj]);
                }

                ///
                if (crossedArr.length) {
                    closeSomeBlocks(crossedArr, function() {
                        open();
                    });
                }
                else {
                    open();
                }
            };

            ///////////////////////////////////////////////////////////
            // Сворачивание блоков
            ///////////////////////////////////////////////////////////
            var closeSomeBlocks = function(blocksArray, completeHandler) {
                normalScale();
                $blocker.show();

                var $hider = $(createDiv('', 'width:100%; position: absolute;', 1, '', { id: 'hider' }));
                $schemeContainer.append($hider);

                var hiderTop = 10000;


                for (var i = 0; i < blocksArray.length; i++) {
                    hiderTop = Math.min(hiderTop, blocksArray[i].$childs.data().top);
                }

                var hiderPos = { top: hiderTop };
                $hider.css(hiderPos).data(hiderPos);
                $hider.css('z-index', '-1'); // #10708 Чтобы соединительная линия при закрытии была под плашкой

                var arr = blocksArray;
                var hiderH = 0;
                for (var i = 0; i < arr.length; i++) {
                    arr[i].opened = false;
                    arr[i].curh = 0;
                    $hider.append(arr[i].$childs);
                    hiderH = Math.max(hiderH, arr[i].$childs.data().top + arr[i].maxh);
                    arr[i].$childs.css({ top: arr[i].$childs.data().top - hiderPos.top });
                }

                $hider.height(hiderH - hiderPos.top);

                restoreScale();


                // $hider.remove();
                // $blocker.hide();
                // if(completeHandler) completeHandler();
                // return;;

                var top = $schemeContainer.css('top').replace('px', '') * 1,
                    childsHeight = $($hider).height();

                $($hider).slideUp({
                    duration: 500,
                    complete: function() {
                        $hider.show();

                        // #10758 После закрытия дочерних блоков схема будет центрироваться по высоте, если это возможно
                        // и необходимо.
                        var openedBlocks = getOpenedBlocksArray(blocksSruct);
                        var blocksTotalHeight = 0;
                        if (openedBlocks.length == 0) { // Если открытых блоков нет, то берем высоту главного блока
                            blocksTotalHeight = blocksSruct.$block.height() + 24;
                        } else {
                            openedBlocks.forEach(function(item, index) {
                                if (index == 0) {
                                    blocksTotalHeight += item.$block.height(); // #12740 На первой итерации прибавляем высоту главного блока
                                }
                                blocksTotalHeight += item.$childs.height(); // #12740 Далее прибавляются только дочерние
                            });
                        }
                        var top = (schemeH / 2) - (blocksTotalHeight / 2);
                        top = top < 12 ? 12 : top;
                        $schemeContainer.css({top: top});

                        for (var i = 0; i < arr.length; i++) {
                            //var tt = hiderTop + arr[i].$childs.data().top; // #11281
                            var tt = arr[i].$childs.data().top; // #11281 Избавление от отступа при первом открытии

                            $schemeContainer.prepend(arr[i].$childs);
                            arr[i].$childs.css({ top: tt });
                            arr[i].$childs.hide();

                            var $obj = $('.btn-expand-childs', arr[i].$block);
                            $obj.removeClass('expanded');
                            $obj.attr('title', SHOW_CHILD_BLOCKS_TITLE);
                        }
                        $hider.remove();
                        $blocker.hide();
                        if (completeHandler) completeHandler();
                    },
                    step: function(now, fx) {
                        if (fx.prop == 'height') {
                            var shemeTop = top - (now - childsHeight) / 2;
                            if (shemeTop < 12) shemeTop = 12;

                            $schemeContainer[0].style.top = shemeTop + 'px';

                            // mainContHeight = 0;
                            // normalScale();
                            // resizeMainCont(blocksSruct);
                            // mainContHeight = Math.max(0,mainContHeight, $hider.position().top + now);
                            // restoreScale();
                            // var top = schemeH/2 - (mainContHeight + 24)/2;
                            // top = top < 12 ? 12 : top;
                            // $schemeContainer.height(mainContHeight + 24);
                            // $schemeContainer.css({top: top});
                        }
                    }
                });

            };

            ///////////////////////////////////////////////////////////
            // Пересчёт высоты основного контейнера
            ///////////////////////////////////////////////////////////
            var resizeMainCont = function(blockObj, res) {
                if (res == undefined) res = 0;
                if (blockObj.childs) {
                    // var h = (blockObj.opened==false ? 0 : blockObj.curh + blockObj.$childs.css('top').replace('px','')*1);
                    var h = (blockObj.opened == false ? 0 : blockObj.curh + blockObj.$childs.data().top);
                    mainContHeight = Math.max(mainContHeight, h);
                    res = Math.max(res, h);
                    for (var i = 0; i < blockObj.childs.length; i++) {
                        resizeMainCont(blockObj.childs[i], res);
                    }
                }
                return res;
            };

            ///////////////////////////////////////////////////////////
            // Изменение позиционирования основного контейнера
            ///////////////////////////////////////////////////////////
            var updateMainContainerPosition = function() {
                schemeW = scheme$.width();
                schemeH = scheme$.height();
                normalScale();
                resizeMainCont(blocksSruct);
                restoreScale();
                // $schemeContainer.height(mainContHeight + 24);
                var top = schemeH / 2 - (mainContHeight + 24) / 2;
                top = top < 12 ? 12 : top;
                $schemeContainer.css({ top: top });
            };

            ///////////////////////////////////////////////////////////
            // Открытие блоков при старте
            ///////////////////////////////////////////////////////////
            var openBlocks = function(blockObj) {
                var i,
                    childs = blockObj.childs,
                    childsLen = (childs ? childs.length : 0),
                    $childs = blockObj.$childs,
                    openedBlocks = opts.openedBlocks,
                    openedBlocksLen = (openedBlocks ? openedBlocks.length : 0);

                if (childsLen) {
                    if (openedBlocksLen) {
                        for (i = 0; i < openedBlocksLen; i++) {
                            blockObj.curh = blockObj.maxh;
                            if (blockObj.id == openedBlocks[i]) {
                                $childs.show();
                                blockObj.opened = true;
                                var $obj = $('.btn-expand-childs', blockObj.$block);
                                $obj.addClass('expanded');
                                $obj.attr('title', HIDE_CHILD_BLOCKS_TITLE);
                                break;
                            }
                            else {
                                $childs.hide();
                            }
                        }
                    } else {
                        $childs.hide();
                        blockObj.curh = 0;
                    }

                    for (i = 0; i < childsLen; i++) {
                        openBlocks(childs[i]);
                    }
                }

                // blockObj.$block.hide();
            };

            scheme$.append($schemeContainer).append($blocker);
            createBlock(schemeDataObj, $schemeContainer, 0, blocksSruct);
            schemeRenderer(blocksSruct);

            window.re = function () {updateMainContainerPosition(); schemeRenderer(blocksSruct)}

            // #9463
            scheme$.addClass('mathjax-calc'); // 9463#note-8 Надо скрыть этап просчета
            PlayerCourse.updateMathJax(function () {scheme$.removeClass('mathjax-calc');});

            openBlocks(blocksSruct);
            if (!opts.openedBlocks || !opts.openedBlocks.length) mainContHeight = blocksSruct.$block.height();
            updateMainContainerPosition();
            this._trigger("datachange");
        }
    });

})(jQuery);
