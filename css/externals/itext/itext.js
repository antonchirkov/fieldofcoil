function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function generateUID() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}


modelNS.ITextModel = modelNS.BaseModel.extend({
    defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {}),
    initialize: function(options) {
        this.defaults.width = options.width; // > 600 ? options.width : 600;	// fix #8265
        this.defaults.height = options.height > 400 ? options.height : 400;
        modelNS.BaseModel.prototype.initialize.apply(this, [options]);
    },
    parseXML: function(xmlData) {

    }
});
modelNS.ITextView = modelNS.BaseModelView.extend({
    lock: function(els) {
        for (var i = 0; i < els.length; i++) {
            $(els[i]).css('position', 'relative');
            if ($(els[i]).find('#lockDiv').length == 0) {
                $('<div id="lockDiv" class="lockclass"></div>').appendTo($(els[i]));
            }

        }
    },
    unlock: function(els) {
        for (var i = 0; i < els.length; i++) {
            $(els[i]).find('#lockDiv').remove();
        }
    },
    getSelectedText: function() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection();
        }
        else if (document.getSelection) {
            text = document.getSelection();
        }
        else if (document.selection) {
            text = document.selection.createRange().text;

        }
        return text;
    },
    clickAddLinc: function(flag) {
        if (flag) {
            // пляшем с добавлением
            $('<a href="' + $('.hrefUrl').val() + '" target="_blank">' + $('.hrefText').val() + '</a>').insertBefore($('.spanCl')[window.itext.startSelect]);
            window.itext.removeSpanCl(window.itext.divs.divEdit);
        }
        window.itext.popupSetColor.find('.ui-dialog-titlebar-close').click();
        window.itext.unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);

    },
    clickSetColor: function(el) {
        $('.setColorB_active').removeClass('setColorB_active');
        $(el).addClass('setColorB_active');
        window.itext.colorSelect = $(el).attr('namecolor');
        window.itext.unlock([$('.TdSave'), $('.TdClearS'), $('.divEd')]);
        window.itext.startSelect = -1;
        window.itext.endSelect = -1;
        //window.itext.divs.divEdit.html(window.itext.currentText);
        window.itext.dAr = 0;
        window.itext.createSpanCl(window.itext.divs.divEdit);

    },
    showColor: function() {
        //this.lock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor'), $('.divEd')]);
        var col = 10;
        if ($(this.el).find('#divWinUpr').find('.winColor').length == 0) {
            // создаём окно вывода выбора цвета
            var winColor = $('<div class="winColor">'); //.appendTo($(this.el).find('#divWinUpr'));
            var colors = this.xmlData.find('colors').html().split(';');
            for (var i = 0; i < colors.length; i++) {
                if ((i % col) == 0) {
                    var div = $('<div style="display:flex">').appendTo(winColor);
                }
                var a = $('<div class="setColorB" style="background-color:' + colors[i] + '" onclick="window.itext.clickSetColor(this)">').appendTo(div);
            }
        }
        var t = this.getSelectedText();
        $(this.el).find('#divWinUpr').find('.winColor').show();
        var popup = this.popupCollection.get('setColor');
        popup.content = winColor.html();
        popup.width = 'auto';
        popup.height = 'auto';
        popup.title = 'Выбор цвета';
        popup.hasTitle = true;
        window.itext.popupSetColor = $(new modelNS.PopupView({ model: popup }).render().el).appendTo($(this.el));



    },
    removeSpanCl: function(el) {
        this.startSelect = -1;
        this.endSelect = -1;
        el = $(el);
        var list = el.find('.spanCl');
        for (var i = list.length - 1; i >= 0; i--) {
            if ($(list[i]).children().hasClass('MathJax_SVG')) { // #8351 Если внутри формула, то копируем разметку, а не текстовый узел
                $(list[i]).children().insertBefore($(list[i]));
            } else {
                $(document.createTextNode($(list[i]).text())).insertBefore($(list[i]))
            }
            $(list[i]).remove();
        }
        el.html(el.html());

        el.find('.fakelink').click(function () {
            // #8351 Вызывать функцию только если мы не находимся в режиме выделения текста
            if ($(this).find('.spanCl').length == 0) {
                window.itext.popupLinc(this);
            }
        })

    },
    addSubSpan: function(ob) {

    },

    findSelectFromXML: function() {
        var spanList = $('.spanCl');
        var ob = {
            startSelect: this.startSelect * 1,
            endSelect: this.endSelect * 1,
            startText: this.startText.html(),
            spanList: $('.spanCl'),
            endText: ''
        }
        var parentList = {};
        console.log(ob);


        for (var i = this.startSelect * 1; i <= this.endSelect * 1; i++) {

            var p = $(spanList[i]).parent();
            if (p.data('uid') == undefined) {
                p.data('uid', generateUID());
                parentList[p.data('uid')] = p;
            }
        }
        for (var key in parentList) {
            var list = parentList[key].find('.spanCl');
            var flag = true;
            for (var f = 0; f < list.length; f++) {
                if ($(list[f]).attr('position') * 1 >= this.startSelect && $(list[f]).attr('position') * 1 <= this.endSelect) {
                    if (flag) {
                        var s = window.itext.colorSelect
                            ? $('<span class="highlight" style="background:' + window.itext.colorSelect + '">').insertBefore(list[f])
                            : $('<span class="highlight" style="background:none;">').insertBefore(list[f]);
                        var e = '';
                        flag = false;
                    }
                    e += list[f].innerHTML;
                    $(list[f]).remove();
                }
            }

            s.html(e);
            
            // #8351 Если у текста есть старая обёртка с выделением фона, то удаляем её
            // Такая манипуляция нужна, если пользователь решит задать прозрачный фон, а до этого был цветной
            if ($(s).parents('.highlight').length != 0) {
                $(s).unwrap();
            }
            
            // #8351 Если был выбран пустой цвет, то удаляем обёртку вокруг текста
            if (!window.itext.colorSelect) {
                $(s).replaceWith(e);
            }
        }
        if (this.startSelect != -1 && this.endSelect != -1) {
            window.itext.resetButton();
        }

        //console.log(parentList);
    },
    createSpanCl: function(el) {
        // #8351 Если символы уже обернуты в .spanCl, то выходим
        if ($(el).find('.spanCl').length != 0) {
            return;
        }
        this.dAr++;
        el = $(el);
        //el.find('a').attr('href', null);
        el.find('a').click(function() {
            return false;
        })
        //        console.log(el);
        if (el[0].children.length == 0) {
            var ls = $(el[0]).html();
            var s = '';
            for (var i = 0; i < ls.length; i++) {
                s += '<span class="spanCl">';
                s += ls[i];
                s += '</span>';
            }
            $(el[0]).html(s);
            this.dAr--;
        }
        else {
            if ($(el).hasClass('MathJax_SVG')) {
                $(el).wrap('<span class="spanCl" />');
            }
            for (var i = 0; i < el[0].children.length; i++) {
                // #8351 Оборачиваем символы потомков в span только если это не относится к формуле mathJax и скриптам
                if (!el.hasClass('MathJax_SVG') && el[0].children[i].tagName.toLowerCase() != 'script') {
                    this.createSpanCl(el[0].children[i]);
                }
                //this.createSpanCl(el[0].children[i]) //#8351 Закомментил
            }
            //console.log($(el[0]));

            var nodes = $(el[0])[0].childNodes;
            var dAr = [];
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].nodeName == '#text') {
                    //console.log(nodes[i].nodeName, $(nodes[i]))
                    var ls = $(nodes[i])[0].textContent;
                    if (ls.trim() != '') {
                        var s = '';
                        var elN = $('<div>');
                        for (var e = 0; e < ls.length; e++) {
                            if (ls[e] != '') {
                                var d = $('<span class="spanCl">').appendTo(elN);
                                d.html(ls[e]);
                            }
                        }
                        dAr.push({
                            el: nodes[i],
                            insert: elN
                        })

                    }
                } else if (nodes[i].tagName.toLowerCase() == 'svg') {//#8351
                    /*var elN = $('<div>');
                    var d = $('<span class="spanCl">').appendTo(elN);
                    d.html(nodes[i].outerHTML);
                    dAr.push({
                        el: nodes[i],
                        insert: elN
                    })*/
                }
            }
            //console.log(dAr);
            for (var i = 0; i < dAr.length; i++) {
                var children = dAr[i].insert.children();
                for (var e = 0; e < children.length; e++) {
                    $(children[e]).insertBefore(dAr[i].el)
                }
                $(dAr[i].el).remove();
            }
            this.dAr--;

        }

        if (this.dAr == 0) {
            var spanList = $('.spanCl');
            for (var i = 0; i < spanList.length; i++) {
                $(spanList[i]).attr('position', i);
            }
            spanList.data('itext', this);
            spanList.click(function(e) {
                //e.stopPropagation();
                e.preventDefault();
                var it = $(this).data('itext');
                if ($(this).data('itext').startSelect == -1) {
                    $(this).data('itext').startSelect = $(this).attr('position');
                    $(this).addClass('selectSpan')
                }
                else {
                    if ($(this).data('itext').endSelect == -1) {
                        $(this).data('itext').endSelect = $(this).attr('position');
                    }
                }
                if ($(this).data('itext').opp == 'setColor') {
                    window.itext.findSelectFromXML();
                    return;
                    if (window.itext.endSelect != -1 && window.itext.startSelect != -1) {
                        var spanList = $('.spanCl');
                        var listParent = {};
                        if (it.endSelect * 1 > it.startSelect * 1) {
                            //console.log('=====');
                            for (var i = window.itext.startSelect * 1; i <= window.itext.endSelect * 1; i++) {
                                // жуткая проверка на присуствие разных парентов
                                if (!$(spanList[i]).parent()) {
                                    console.log('А парента то нет');
                                }
                                else {
                                    var p = $(spanList[i]).parent();
                                    if (p.data('uid') == undefined) {
                                        p.data('uid', generateUID());
                                    }
                                    if (listParent[p.data('uid')] == undefined) {
                                        listParent[p.data('uid')] = { parent: p, list: [], flag: false };
                                    }
                                    listParent[p.data('uid')].list.push(spanList[i]);
                                }
                                $(spanList[i]).css('background-color', $(this).data('itext').colorSelect);
                            }
                            // после долгих мучений иизысканий добавляем проверку внутренних парентов и отрабатываем сначала их
                            for (var key in listParent) {
                                var list = listParent[key].list;
                                var p = listParent[key].parent;
                                for (var i = 0; i < list.length; i++) {
                                    //console.log('parent', p)

                                }

                                if (p.hasClass('spanCl')) {
                                    //console.log('spanCl', listParent[key].parent)

                                }

                            }
                            for (var key in listParent) {
                                var list = listParent[key];
                                for (var i = 0; i < list.list.length; i++) {
                                    if (i == 0) {
                                        s = $('<span style="color:' + window.itext.colorSelect + '">').insertBefore(list.list[i])
                                        //var s = $('<span style="color:' + window.itext.colorSelect + '">').appendTo(listParent[key].parent)
                                        var e = '';
                                    }
                                    e += list.list[i].innerHTML;
                                    $(list.list[i]).remove();
                                }
                                s.html(e);
                            }
                            window.itext.removeSpanCl(window.itext.divs.divEdit);

                        }
                    }
                    if (window.itext.endSelect == -1 || window.itext.startSelect == -1) {
                        $(this).css('color', window.itext.colorSelect);
                    }
                }

                if (window.itext.opp == 'setLinc') {
                    // #8351 Если выделяемые символы находятся внутри попапа, то ссылка будет добавляться
                    // по другому принципу
                    if ($(this).parent('#popup').length != 0) {
                        if ($(this).parent().hasClass('fakelink') || $(this).parent()[0].localName == 'a') {
                            alert('Вы не можете добавить ссылку во внутрь выбранного элемента');
                            window.itext.startSelect = -1;
                            window.itext.endSelect = -1;
                            window.itext.removeSpanCl($(this).parent('#popup'));
                            window.itext.resetButton();
                            return;
                        }
                        // Если есть конечная точка выделения, то отобразим поле для ввода ссылки и заменим кнопки.
                        else if (window.itext.endSelect != -1) {
                            var $spanClList = $('.spanCl');
                            $spanClList.each(function (index, item) {
                                if (
                                    parseInt($(item).attr('position')) >= parseInt(window.itext.startSelect)
                                    && parseInt($(item).attr('position')) <= parseInt(window.itext.endSelect)
                                ) {
                                    $(item).addClass('selectSpan');
                                }
                            });
                        }
                    } else {
                            // #8351 Перенес сюда еще и проверку на ссылку. Если при выделении мы попали на ссылку,
                            // то отменяем выделение с предупреждением
                            if ($(this).parent().hasClass('fakelink') || $(this).parent()[0].localName == 'a') {
                                alert('Вы не можете добавить ссылку во внутрь выбранного элемента');
                                window.itext.startSelect = -1;
                                window.itext.endSelect = -1;
                                window.itext.removeSpanCl(window.itext.divs.divEdit);
                                window.itext.resetButton();
                                window.itext.unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);
                                return;
                            }
                            // #8351 Закомментил
                            /*if ($(this).parent()[0].localName == 'a') {
                                if (confirm("Удалить ссылку?")) {
                                    $(this).parent().remove();
                                    window.itext.removeSpanCl(window.itext.divs.divEdit);
                                    window.itext.unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);
                                    return;
                                }
                                else {
                                    alert('Вы не можете добавить ссылку во внутрь выбранного елемента');
                                    window.itext.removeSpanCl(window.itext.divs.divEdit);
                                    window.itext.unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);
                                    return;
                                }

                            }*/
                            // Если есть конечная точка выделения, то отобразим поле для ввода ссылки и заменим кнопки.
                            else if (window.itext.endSelect != -1) {
                                // #8351 Если крайние точки выделения находятся в разных родителях, то запрещаем добавление
                                if ($('.spanCl[position="' + window.itext.startSelect + '"]').parent()[0] !== $('.spanCl[position="' + window.itext.endSelect + '"]').parent()[0]) {
                                    alert('Нельзя добавить ссылку к тексту из разных блоков');
                                    window.itext.startSelect = -1;
                                    window.itext.endSelect = -1;
                                    window.itext.removeSpanCl(window.itext.divs.divEdit);
                                    window.itext.resetButton();
                                    window.itext.unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);
                                    return;
                                }
                                var $spanClList = $('.spanCl');
                                $spanClList.each(function (index, item) {
                                    if (
                                        parseInt($(item).attr('position')) >= parseInt(window.itext.startSelect)
                                        && parseInt($(item).attr('position')) <= parseInt(window.itext.endSelect)
                                    ) {
                                        if ($(item).parent().hasClass('fakelink') || $(item).parent()[0].localName == 'a') {
                                            alert('Вы не можете добавить ссылку во внутрь выбранного элемента');
                                            window.itext.startSelect = -1;
                                            window.itext.endSelect = -1;
                                            window.itext.removeSpanCl(window.itext.divs.divEdit);
                                            window.itext.resetButton();
                                            return;
                                        }
                                        $(item).addClass('selectSpan');
                                    }
                                });
                                window.itext.win.SetLinc.find('.TdWin').show();
                                var list = window.itext.win.SetLinc.find('a');
                                $('.buttonUpr').removeClass('Uprselect');
                                $(list[0]).addClass('bOk');
                                $(list[1]).addClass('bOk');
                                $(list[0]).html('Применить');
                                $(list[1]).html('Отменить');
                                $(list[2]).hide();
                                /*


                                                        var popup = window.itext.popupCollection.get('setColor');
                                                        var div = $('<div>');
                                                        var d = $('<div style="display:flex">').appendTo(div);
                                                        $('<span class="labelForm">Текст ссылки</span>').appendTo(d);
                                                        $('<input class="textInput hrefText">').appendTo(d);
                                                        var d = $('<div style="display:flex;margin-top:12px">').appendTo(div);
                                                        $('<span class="labelForm">Урл ссылки</span>').appendTo(d);
                                                        $('<input class="textInput hrefUrl">').appendTo(d);
                                                        var d = $('<div style="display:flex;margin-top:12px">').appendTo(div);
                                                        $('<table style="width:100%"><tr><td style="width:49%"></td><td style="display:flex"><button onclick="window.itext.clickAddLinc(false)">Отменить</button><div style="width:22px" ></div><button onclick="window.itext.clickAddLinc(true)">Вставить</button></td><td style="width:49%"></td></tr></table>').appendTo(d);
                                                        popup.content = div.html();
                                                        popup.width = '400px';
                                                        popup.height = 'auto';
                                                        popup.title = 'Добавление ссылки';
                                                        popup.hasTitle = true;
                                                        window.itext.popupSetColor = $(new modelNS.PopupView({ model: popup }).render().el).appendTo($(window.itext.el));

                                */
                            }
                    }
                }
                if (window.itext.opp == 'addPopup') {
                    if (window.itext.endSelect == -1 || window.itext.startSelect == -1) {
                        $(this).addClass('borderSelect');
                    }
                    if (window.itext.endSelect != -1 && window.itext.startSelect != -1) {
                        // #8351 Если крайние точки выделения находятся в разных родителях, то запрещаем добавление
                        if ($('.spanCl[position="' + window.itext.startSelect + '"]').parent()[0] !== $('.spanCl[position="' + window.itext.endSelect + '"]').parent()[0]) {
                            alert('Нельзя добавить ссылку к тексту из разных блоков');
                            window.itext.startSelect = -1;
                            window.itext.endSelect = -1;
                            window.itext.removeSpanCl(window.itext.divs.divEdit);
                            window.itext.resetButton();
                            window.itext.unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);
                            return;
                        }

                        var spanList = $('.spanCl');

                        if (window.itext.startSelect <= window.itext.endSelect) {
                            for (var i = window.itext.startSelect; i <= window.itext.endSelect; i++) {
                                $(spanList[i]).addClass('borderSelect');
                            }
                        }
                        else {
                            for (var i = window.itext.endSelect; i >= window.itext.startSelect; i--) {
                                $(spanList[i]).addClass('borderSelect');
                            }

                        }
                        // создаём саму ссылку для попуп с именем new At revision: 3973
                        var list = $('.borderSelect');
                        var e = '';
                        for (var i = 0; i < list.length; i++) {

                            if (i == 0) {
                                var l = $('<span class="fakelink" popup="new">').insertBefore(list[i]);
                            }
                            e += $(list[i]).html();
                            $(list[i]).remove();
                        }
                        l.html(e);
                        window.itext.removeSpanCl(window.itext.divs.divEdit);
                        window.itext.unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);

                    }

                }

                // #8351 Добавление ссылки внутри ВО
                if (window.itext.opp == 'setLincPopup') {
                    if (window.itext.endSelect != -1) {
                        var $spanClList = $('.spanCl');
                        $spanClList.each(function (index, item) {
                            if (
                                parseInt($(item).attr('position')) >= parseInt(window.itext.startSelect)
                                && parseInt($(item).attr('position')) <= parseInt(window.itext.endSelect)
                            ) {
                                $(item).addClass('selectSpan');
                            }
                        });
                        $('.add-link-block').addClass('add-link-block_visible');
                    }
                }

            })
        }
    },
    setPopupOpp: function(flag) {
        if (!flag) {
            // если удаление окна
            window.itext.divs.divEdit.find('.fakelink').addClass('borderSelect');
            window.itext.divs.divEdit.find('.fakelink').click(function () {
                //Вы действительно хотите удалить данное ВО?
                if (confirm("Вы действительно хотите удалить данное ВО?")) {
                    var e = $(this).html();
                    $(document.createTextNode($(this).html())).insertBefore($(this))
                    $(this).remove();
                    window.itext.unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);
                }
                else {
                    window.itext.divs.divEdit.find('.fakelink').removeClass('borderSelect');
                    window.itext.unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);
                }
            })
            window.itext.popupSetColor.find('.ui-dialog-titlebar-close').click();
        }
        else {
            window.itext.opp = 'addPopup';
            window.itext.colorSelect = '#ddccdd';
            window.itext.startSelect = -1;
            window.itext.endSelect = -1;
            //$(this).data('itext').divs.divEdit.html($(this).data('itext').currentText);
            window.itext.dAr = 0;
            window.itext.createSpanCl(window.itext.divs.divEdit);
            window.itext.popupSetColor.find('.ui-dialog-titlebar-close').click();
        }
    },
    popupLinc: function(el) {
        var popup = window.itext.popupCollection.get($(el).attr('popup'));
        // #8351 Закомментил этот код, т.к. он использует старый способ открытия ВО.
        /*if (popup) {
            if ($(el).attr('popup') == 'new') {
                popup.title = 'Содержимое окна - редактирование';
                popup.hasTitle = true;
                setTimeout(function() {
                    $('.ui-dialog-titlebar-close').hide();
                }, 600);

            }

            $(new modelNS.PopupView({ model: popup }).render().el).appendTo($(window.itext.el));
        }*/
        // #8351 Используем стандартный способ открытия ВО.
        if (popup) {
            var $buttonsBlock = $('<div class="edit-popup-buttons"></div>');
            var $addLinkBlock = $('<div class="add-link-block"><input class="textInput hrefUrl" /></div>');
            var $popup = $('#popup');
            $popup.html('<div class="popup-content">' + popup.content + '</div>');
            $popup.popup('option', 'width', popup.width ? parseInt(popup.width) : 900);
            $popup.popup('option', 'height', popup.height ? parseInt(popup.height) - 100 : 500); // #8351 Вычитаем 100px, чтобы было место под кнопки
            $popup.popup('option', 'draggable', false);
            $popup.popup('option', 'title', false);
            $popup.popup({
                close: function() {
                    if ($(el).attr('popup') == 'new') {
                        window.itext.opp = 'addPopup'; // При закрытии ВО возвращаем режим редактирования ВО, но только для окон, которые редактировались(имели атрибут popup=new)
                    }
                    $buttonsBlock.remove();
                    $addLinkBlock.remove();
                    window.itext.removeSpanCl($popup);
                }
            });
            PlayerCourse.openPopup();
            // Если это новое созданное ВО, то делаем блок редактируемым.
            if ($(el).attr('popup') == 'new') {
                var $addLinkButton = $('<a href="#" class="edit-popup-buttons__item button11 blinc oppB"><img /></a>').appendTo($buttonsBlock);
                var $saveButton = $('<a href="#" class="edit-popup-buttons__item button11 buttonUpr btext Uprselect">Сохранить</a>').appendTo($buttonsBlock);
                var $cancelButton = $('<a href="#" class="edit-popup-buttons__item button11 buttonUpr btext">Отменить</a>').appendTo($buttonsBlock);
                $addLinkButton.click(function() {
                    window.itext.opp = 'setLincPopup';
                    window.itext.createSpanCl($popup);
                    $popup.find('.popup-content').removeAttr('contenteditable');
                    $(this).addClass('bOppselect');
                });
                $cancelButton.click(function() {
                    $popup.popup('close');
                });

                var $addLinkOkButton = $('<a href="#" class="button11 buttonUpr btext Uprselect">Применить</a>').appendTo($addLinkBlock);
                $addLinkOkButton.click(function() {
                    $popup.find('.spanCl.selectSpan')
                        .wrapAll('<a href="' + $addLinkBlock.find('.hrefUrl').val() + '" target="_blank"></a>');
                    window.itext.removeSpanCl($popup);
                    $addLinkBlock.find('.hrefUrl').val('');
                    $addLinkBlock.removeClass('add-link-block_visible');
                    $addLinkButton.removeClass('bOppselect');
                });

                var $addLinkCancelButton = $('<a href="#" class="button11 buttonUpr btext">Отменить</a>').appendTo($addLinkBlock);
                $addLinkCancelButton.click(function() {
                    window.itext.removeSpanCl($popup);
                    $addLinkBlock.find('.hrefUrl').val('');
                    $addLinkBlock.removeClass('add-link-block_visible');
                    $addLinkButton.removeClass('bOppselect');
                });

                $popup.find('.popup-content').attr('contenteditable', 'true');
                $popup.after($buttonsBlock);
                $('#popup').after($addLinkBlock);
            }
        }
    },
    resetButton: function() {
        $('.Uprselect').removeClass('Uprselect');
        $('.bOppselect').removeClass('bOppselect');
        $('.borderSelect').removeClass('borderSelect');
        window.itext.removeSpanCl(window.itext.divs.divEdit);
        var list = window.itext.win.SetLinc.find('a');
        $(list[0]).html('Добавить');
        $(list[2]).show();
        $('.bOk').removeClass('bOk');
        $(list[1]).html('Удалить');


        for (var key in window.itext.win) {
            window.itext.win[key].hide();
        }


    },
    render: function() {
        modelNS.BaseModelView.prototype.render.apply(this);
        this.xmlData = $($.parseXML(this.model.options.xmlData));

        var self = this;
        this.dAr = [];
        this.startSelect = -1;
        this.endSelect = -1;
        this.colorSelect = null;
        window.itext = this;
        this.win = {};
        this.divs = {};
        this.divs.divTitle = $('<div class="title">').appendTo($(this.el));
        this.divs.divMain = $('<div class="itext">').appendTo($(this.el));
        var divEd = $('<div class="divEd">').appendTo(this.divs.divMain);
        this.divs.divUpr = $('<div class="uprDiv">').appendTo($(this.el));
        this.divs.divW = $('<div class="WDiv">').appendTo($(this.el));

        // создание окна действий
        this.win.SetColor = $('<div class="subWin">').appendTo(this.divs.divW);
        var table = $('<table style="width:100%;margin-top:13px" >').appendTo(this.win.SetColor);
        var tr = $('<tr>').appendTo(table);
        var td1 = $('<td style="width:99%;vertical-align:top;padding-top:0px;padding-right:12px" >').appendTo(tr);
        var td2 = $('<td style="padding-top:0px;">').appendTo(tr);
        $('<div class="TdWin"><div class="winHeader"><span>Выберите цвет</span></div></div>').appendTo(td1);


        $('<div style="width:170px">').appendTo(td2);
        //        var a = $('<a href="#" class="button11 buttonUpr">Добавить</a>').appendTo(td2);
        //        var a = $('<a href="#" class="button11 buttonUpr">Удалить</a>').appendTo(td2);
        //        var a = $('<a href="#" class="button11 buttonUpr">Удалить всё</a>').appendTo(td2);

        var col = 8;

        //var colors = this.xmlData.find('colors').text().split(';'); // #8351 Закомментил
        var highlights = this.xmlData.find('highlights').find('highlight'); // #8351

        var div = $('<div style="display:flex;align-items: center;align-content: center;justify-content: center;margin-top:24px">').appendTo($('.TdWin'));
        $('<div class="setColorB" nameColor="" onclick="window.itext.clickSetColor(this)">').appendTo(div);

        for (var i = 0, j = 1; i < highlights.length; i++, j++) {
            if ((j % col) == 0) {
                div = $('<div style="display:flex;    align-items: center;  align-content: center;  justify-content: center;margin-top:24px">').appendTo($('.TdWin'));
            }
            var a = $('<div class="setColorB" nameColor="' + $(highlights[i]).attr('color') + '" style="background-color:' + $(highlights[i]).attr('color') + '" onclick="window.itext.clickSetColor(this)">').appendTo(div);
        }

        this.win.SetColor.hide();

        this.win.SetLinc = $('<div class="subWin">').appendTo(this.divs.divW);
        var table = $('<table style="width:100%;margin-top:13px" >').appendTo(this.win.SetLinc);
        var tr = $('<tr>').appendTo(table);
        var td1 = $('<td style="width:99%;vertical-align:top;padding-top:0px;padding-right:12px" >').appendTo(tr);
        var td2 = $('<td style="padding-top:0px;vertical-align:top;">').appendTo(tr);
        $('<div class="TdWin"><div class="winHeader"><span>Добавить ссылку</span></div></div>').appendTo(td1);
        var div = $('<div style="margin-top:22px;">').appendTo(this.win.SetLinc.find('.TdWin'));
        var t = $('<table style="width:100%">').appendTo(div);
        var r = $('<tr>').appendTo(t);
        var t_ = $('<td style="width:49%">').appendTo(r);
        div = $('<td>').appendTo(r);
        var t_ = $('<td style="width:49%">').appendTo(r);
        var d = $('<div style="display:flex">').appendTo(div);
        //$('<span class="labelForm">Текст ссылки</span>').appendTo(d); // #8351 Закомментил. Текст менять не нужно, т.к. он уже выделен для прикрепления ссылки.
        //$('<input class="textInput hrefText">').appendTo(d); // #8351 Закомментил. Текст менять не нужно, т.к. он уже выделен для прикрепления ссылки.
        var d = $('<div style="display:flex;margin-top:12px">').appendTo(div);
        $('<span class="labelForm">Урл ссылки</span>').appendTo(d);
        $('<input class="textInput hrefUrl">').appendTo(d);
        var a = $('<a href="#" class="button11 buttonUpr btext">Добавить</a>').appendTo(td2);
        a.click(function() {
            if ($(this).hasClass('bOk')) {
                var list = window.itext.win.SetLinc.find('a');
                $(list[1]).html('Удалить');
                $(list[2]).show();
                $('.bOk').removeClass('bOk');
                $(this).html('Добавить');
                // вставляем ссылку
                //$('<a href="' + $('.hrefUrl').val() + '" target="_blank">' + $('.hrefText').val() + '</a>').insertBefore($('.spanCl')[window.itext.startSelect]);
                $('.spanCl.selectSpan').wrapAll('<a href="' + $('.hrefUrl').val() + '" target="_blank"></a>');
                //$('<a href="' + $('.hrefUrl').val() + '" target="_blank">').insertBefore($('.spanCl')[window.itext.startSelect]);
                //$('</a>').insertBefore($('.spanCl')[window.itext.endSelect]);
                window.itext.resetButton();
                window.itext.removeSpanCl(window.itext.divs.divEdit);
                return;
            }
            $('.Uprselect').removeClass('Uprselect');
            $(this).addClass('Uprselect');
            // Вызов добавления ссылки
            window.itext.opp = 'setLinc';
            window.itext.createSpanCl(window.itext.divs.divEdit);
        })
        var a = $('<a href="#" class="button11 buttonUpr btext">Удалить</a>').appendTo(td2);
        a.click(function() {
            if ($(this).hasClass('bOk')) {
                var list = window.itext.win.SetLinc.find('a');
                $(list[0]).html('Добавить');
                $(list[2]).show();
                $('.bOk').removeClass('bOk');
                $(this).html('Удалить');
                window.itext.resetButton();
                window.itext.removeSpanCl(window.itext.divs.divEdit);
                return;
            }
            $('.Uprselect').removeClass('Uprselect');
            $(this).addClass('Uprselect');
            window.itext.divs.divEdit.find('a').addClass('borderSelect');
            window.itext.divs.divEdit.find('a').unbind('click');
            window.itext.divs.divEdit.find('a').click(function() {
                if (confirm("Вы действительно хотите удалить ссылку ?")) {
                    var e = $(this).html();
                    $(this).remove();
                }
                else {}
                window.itext.resetButton();
                window.itext.divs.divEdit.find('a').unbind('click');
                return false;
            })

        });
        this.win.SetLinc.hide();



        this.win.Setpopup = $('<div class="subWin">').appendTo(this.divs.divW);
        var table = $('<table style="width:100%;margin-top:13px" >').appendTo(this.win.Setpopup);
        var tr = $('<tr>').appendTo(table);
        var td1 = $('<td style="width:99%;vertical-align:top;padding-top:0px;padding-right:12px" >').appendTo(tr);
        var td2 = $('<td style="padding-top:0px;vertical-align:top;">').appendTo(tr);
        $('<div class="TdWin"><div class="winHeader"><span>Добавить Окно</span></div></div>').appendTo(td1);
        var div = $('<div style="margin-top:22px;">').appendTo(this.win.Setpopup.find('.TdWin'));
        var t = $('<table style="width:100%">').appendTo(div);
        var r = $('<tr>').appendTo(t);
        var t_ = $('<td style="width:49%">').appendTo(r);
        div = $('<td>').appendTo(r);
        var t_ = $('<td style="width:49%">').appendTo(r);
        var d = $('<div style="display:flex">').appendTo(div);
        $('<span class="labelForm">Текст ссылки</span>').appendTo(d);
        $('<input class="textInput hrefText">').appendTo(d);
        var d = $('<div style="display:flex;margin-top:12px">').appendTo(div);
        $('<span class="labelForm">Урл ссылки</span>').appendTo(d);
        $('<input class="textInput hrefUrl">').appendTo(d);
        var a = $('<a href="#" class="button11 buttonUpr btext">Добавить</a>').appendTo(td2);
        a.click(function() {
            if ($(this).hasClass('bOk')) {
                var list = window.itext.win.Setpopup.find('a');
                $(list[1]).html('Удалить');
                $(list[2]).show();
                $('.bOk').removeClass('bOk');
                $(this).html('Добавить');
                window.itext.resetButton();
                // вставляем ссылку
                $('<a href="' + $('.hrefUrl').val() + '" target="_blank">' + $('.hrefText').val() + '</a>').insertBefore($('.spanCl')[window.itext.startSelect]);
                window.itext.removeSpanCl(window.itext.divs.divEdit);
                return;
            }
            $('.Uprselect').removeClass('Uprselect');
            $(this).addClass('Uprselect');
            // Вызов добавления ссылки
            window.itext.opp = 'addPopup';
            window.itext.createSpanCl(window.itext.divs.divEdit);
        })
        var a = $('<a href="#" class="button11 buttonUpr btext">Удалить</a>').appendTo(td2);
        a.click(function() {
            if ($(this).hasClass('bOk')) {
                var list = window.itext.win.Setpopup.find('a');
                $(list[0]).html('Добавить');
                $(list[2]).show();
                $('.bOk').removeClass('bOk');
                $(this).html('Удалить');
                window.itext.resetButton();
                window.itext.removeSpanCl(window.itext.divs.divEdit);
                return;
            }
            $('.Uprselect').removeClass('Uprselect');
            $(this).addClass('Uprselect');
            window.itext.divs.divEdit.find('.fakelink').addClass('borderSelect');
            window.itext.divs.divEdit.find('.fakelink').unbind('click');
            window.itext.divs.divEdit.find('.fakelink').click(function () {
                if (confirm("Вы действительно хотите удалить окно ?")) {
                    var e = $(this).html();
                    $(document.createTextNode($(this).html())).insertBefore($(this))
                    $(this).remove();
                }
                else {}
                window.itext.resetButton();
                window.itext.divs.divEdit.find('fakelink').unbind('click');

                return false;
            })

        })
        /*
                var a = $('<a href="#" class="button11 buttonUpr btext">Удалить всё</a>').appendTo(td2);
                a.click(function() {
                    $('.Uprselect').removeClass('Uprselect');
                    $(this).addClass('Uprselect');
                })
        */
        this.win.Setpopup.hide();





        this.divs.divEdit = $('<div class="editDiv" contentEditable="false">').appendTo(divEd);
        var d = $('<div class="noEditJS">').appendTo(divEd);

        this.divs.divEditJS = $('<div class="editDivJS">').appendTo(d);

        //$(".editDivJS").jqte({});

        this.divs.divTitle.html('Выполните задание');

        var table = $('<table style="width:100%" class="tableUprBut">').appendTo(this.divs.divUpr);

        $('<table style="width:100%" ><tr><td style="width:49%"></td><td id="divWinUpr"></td><td style="width:49%"></td></tr></table>').appendTo(this.divs.divUpr);

        var tr = $('<tr>').appendTo(table);
        var td = $('<td class="TdColor" style="width:20%">').appendTo(tr);
        var a = $('<a href="#" class="button11 bselect oppB"><img border=0 /></a>').appendTo(td);
        var td = $('<td class="TdClearS" style="width:20%">').appendTo(tr);
        var a = $('<a href="#"  class="button11 blinc oppB"><img /></a>').appendTo(td);
        var td = $('<td class="TdLinc" style="width:20%">').appendTo(tr);
        var a = $('<a href="#" class="button11 bpopup oppB"><img /></a>').appendTo(td);
        var td = $('<td class="TdPopup" style="width:20%">').appendTo(tr);
        var a = $('<a href="#" class="button11 bclear oppB"><img /></a>').appendTo(td);
        var td = $('<td class="TdSave" style="width:20%">').appendTo(tr);
        var a = $('<a href="#" class="button11 bsave oppB"><img /></a>').appendTo(td);
        var startText = this.xmlData.find('content'); //'<p><style color=”green”>РЕДЬКА ДИКАЯ</style >, или <style color=”red”>РЕДЬКА ПОЛЕВАЯ</style > (Raphanistrum). Однолетний яровой сорняк <a popup=”my1”>семейства</a> Крестоцветных. <a popup=”my2”>Стержнекорневое</a>  растение. Главный корень тонкий, ветвящийся. <a href= "http://physicon.ru"> ФИЗИКОН</a></p>';

        $('.oppB').click(function() {

            $('.bOppselect').removeClass('bOppselect');
            $('.Uprselect').removeClass('Uprselect');
            window.itext.resetButton();
            for (var key in window.itext.win) {
                window.itext.win[key].hide();
            }

            if ($(this).hasClass('bclear')) {
                // если кнопка отмены цвета
                $(this).addClass('bOppselect');
                window.itext.opp = 'Colorclear';
                var list = window.itext.divs.divEdit.find('span');
                for (var i = 0; i < list.length; i++) {
                    if (!$(list[i]).hasClass('fakelink')) {
                        $(list[i]).addClass('borderSelect');
                        $(list[i]).unbind('click');
                        $(list[i]).click(function() {
                            if (confirm("Вы действительно хотите отменить стиль ?")) {
                                var e = $(this).html();
                                var e = $(this).html();
                                $(document.createTextNode($(this).html())).insertBefore($(this))
                                $(this).remove();
                            }
                            else {}
                            window.itext.resetButton();
                            var list = window.itext.divs.divEdit.find('span');
                            for (var i = 0; i < list.length; i++) {
                                if (!$(list[i]).hasClass('fakelink')) {
                                    $(list[i]).unbind('click');

                                }

                            }


                        });


                    }

                }
            }


            if ($(this).hasClass('bselect')) {
                // если кнопка выбора цвета
                $(this).addClass('bOppselect');
                window.itext.opp = 'setColor';
                window.itext.win.SetColor.show();
            }
            if ($(this).hasClass('blinc')) {
                // если кнопка выбора цвета
                $(this).addClass('bOppselect');
                window.itext.opp = 'linc';
                window.itext.win.SetLinc.find('.TdWin').hide();
                window.itext.win.SetLinc.show();
            }
            if ($(this).hasClass('bpopup')) {
                // если кнопка выбора окон
                $(this).addClass('bOppselect');
                window.itext.opp = 'popup';
                window.itext.win.Setpopup.find('.TdWin').hide();
                window.itext.win.Setpopup.show();

            }

        });


        this.popupsData = [];
        this.popupCollection = null;
        var popups = this.xmlData.find('popup');
        for (var i = 0; i < popups.length; i++) {
            var id = $(popups[i]).attr('id'),
                width = $(popups[i]).attr('width'),
                height = $(popups[i]).attr('height'),
                content = courseML.getHTMLFromCourseML($(popups[i]));
            if (id == undefined) {
                id = $(popups[i]).attr('name');
            }
            if (width) width -= 8; // fix jquery .popup() generate size +8px
            if (width == undefined) width = 'auto';
            if (height == undefined) height = 'auto';
            this.popupsData.push({ closableOnOverlayClick: true, id: id, content: content, width: width, height: height });
        }

        this.popupsData.push({
            closableOnOverlayClick: true,
            id: 'setColor',
            content: '',
            className: 'ITextSetColor',
            onClose: function() {
                window.itext.unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);
            },
        });

        this.popupsData.push({
            closableOnOverlayClick: false,
            id: 'new',
            hasBackground: false,
            content: '',// Изначально новое созданное ВО будет пустым
            width: 900,
            height: 600,
            className: 'ITextSetColor',
            onClose: function() {
                window.itext.unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);
            },
        });


        //console.log(this.popupsData);
        this.popupCollection = new modelNS.PopupCollection(this.popupsData);



        //console.log($(startText).text())
        $('.button13').data('itext', this);
        $('.button13').click(function() {
            if ($(this).hasClass('bcolor')) {
                // если кнопка выбора цвета
                $(this).data('itext').opp = 'setColor';
                $(this).data('itext').showColor();
            }
            if ($(this).hasClass('blinc')) {
                $(this).data('itext').lock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);
                $(this).data('itext').opp = 'setLinc';
                $(this).data('itext').colorSelect = '#ddccdd';
                $(this).data('itext').startSelect = -1;
                $(this).data('itext').endSelect = -1;
                //$(this).data('itext').divs.divEdit.html($(this).data('itext').currentText);
                $(this).data('itext').dAr = 0;
                $(this).data('itext').createSpanCl($(this).data('itext').divs.divEdit);
            }
            if ($(this).hasClass('bpopup')) {
                $(this).data('itext').lock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor')]);
                $(this).data('itext').startSelect = -1;
                $(this).data('itext').endSelect = -1;
                $(this).data('itext').colorSelect = null;
                $(this).data('itext').opp = 'popup';
                var popup = window.itext.popupCollection.get('setColor');
                var div = $('<div>');
                var d = $('<div style="display:flex;margin-top:12px">').appendTo(div);
                $('<table style="width:100%"><tr><td style="width:49%"></td><td style="display:flex"><button onclick="window.itext.setPopupOpp(false)">Удалить</button><div style="width:22px" ></div><button onclick="window.itext.setPopupOpp(true)">Вставить</button></td><td style="width:49%"></td></tr></table>').appendTo(d);
                popup.content = div.html();
                popup.width = '400px';
                popup.height = 'auto';
                popup.title = 'Выберите режим';
                popup.hasTitle = true;
                window.itext.popupSetColor = $(new modelNS.PopupView({ model: popup }).render().el).appendTo($(window.itext.el));





            }
            if ($(this).hasClass('bClearS')) {
                // если кнопка сброса выделения
                $(this).data('itext').unlock([$('.TdLinc'), $('.TdSave'), $('.TdPopup'), $('.TdClearS'), $('.TdColor'), $('.divEd')]);
                $(this).data('itext').startSelect = -1;
                $(this).data('itext').endSelect = -1;
                $(this).data('itext').colorSelect = null;
                //$(this).data('itext').divs.divEdit.html($(this).data('itext').currentText);
                $(this).data('itext').opp = '';
            }



        })
        var dd = courseML.getHTMLFromCourseML($(startText));
        this.startText = $(startText);

        //console.log(dd);
        var Start_tags = [];
        var End_tags = [];
        var flagTag = false;
        var nametag = '';
        var flagname = false;



        this.currentText = dd;
        this.divs.divEdit.html(dd);
        this.divs.divEdit.data('itext', this);
        this.divs.divEdit.find('.fakelink').click(function () {
            window.itext.popupLinc(this);
        })
        AppModels.updateMathJax(); // #8351
        return this;

    },
    clickSpan: function(el) {
        console.log(el)
    }
});

function IText(xmlData, container, basePath, params) {
    xmlData = xmlData.substring(xmlData.indexOf('?>') + 2, xmlData.length);
    var $xml = $($.parseXML(xmlData));
    var width = container.width() != 0 ? container.width() :
        $xml.find('itext').attr('width') ? $xml.find('itext').attr('width') : 800,
        height = container.height() != 0 ? container.height() :
        $xml.find('itext').attr('height') ? $xml.find('itext').attr('height') : 600;



    model = new modelNS.ITextModel({
        xmlData: xmlData,
        wrapper: container,
        basePath: basePath,
        scalable: false,
        params: params,
        width: width,
        height: height
    });




    this.init = function() {
        view = new modelNS.ITextView({ model: model }).render();
        return view;
    }

};
