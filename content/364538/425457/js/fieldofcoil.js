
// Функция строитель для вашей модели
// Наименование функции - CamelCase от type модели из XML
// Код этой функции в большинстве случаев копируется и не редактируется разработчиком кастомной модели
function fieldOfCoil(xmlData, wrapper, basePath, params) {

    var model;

    this.init = function() {

        model = new modelNS.fieldOfCoil({

            // Доступ к xmlData, используется в случае необходимости контролирования поведения модели через xml
            xmlData: xmlData,

            // Объект куда вставляется модель, для передается автоматически
            wrapper: wrapper,

            // Путь к ресурсам модели для динамических подключений
            basePath: basePath,

            // Обозначение что модель использует поддерживает обновленнный тип стилизирования, для кастомных должен быть true
            restyling: true,

            // Ширина модели, в кастомных оставлять без изменений
            width: wrapper.data('width'),

            // Высота модели, в кастомных оставлять без изменений
            height: wrapper.data('height'),

            // Дополнительная параметризация, в кастомных оставлять без изменений
            params:params
        });
        return new modelNS.fieldOfCoilView({model: model}).render();
    };

}

// Важно, чтобы ключ modelNS.CommonModel.models.fieldOfCoil - соответствовал типу в XML
// fieldOfCoil - функция-строитель данной модели
modelNS.CommonModel.models.fieldofcoil = fieldOfCoil;

modelNS.addLangs({
	ru : {
		animation : 'Анимация',
		system_params : 'Параметры системы',
		speed_impulses : 'Скорости, импульсы и энергии',
		collision_type : 'Тип столкновения',
		collision_v1 : 'Скорость первой тележки',
		collision_v2 : 'Скорость второй тележки',
		collision_m1 : 'Масса первой тележки',
		collision_m2 : 'Масса второй тележки',
		collision_elastic : 'Абсолютно упругое',
		collision_notelastic : 'Абсолютно неупругое',
		collision_Ek1 : 'Кинетическая энергия первой тележки',
		collision_Ek2 : 'Кинетическая энергия второй тележки',
		collision_dE : 'Изменение кинетической энергии при столкновении',
		collision_p1 : 'Импульс первой тележки',
		collision_p2 : 'Импульс второй тележки',
		m_s : 'м/c',
		kg : 'кг',
		J : 'Дж',
	}
});

modelNS.fieldOfCoil = modelNS.BaseModel.extend({
	initialize: function(options) {
		modelNS.BaseModel.prototype.initialize.apply(this, arguments);
	},
	parseXML: function(xmlData) {
		modelNS.BaseModel.prototype.parseXML.apply(this, arguments);
	},
});

modelNS.fieldOfCoilView = modelNS.BaseModelView.extend({
	initialize : function ()
	{
		modelNS.BaseModelView.prototype.initialize.apply(this, arguments);

		this.defaults = {
			x : 5,
			y : 0,
			i : 20,
			r : 5,
			dB: 10,
		}
	},
	render : function() {
		var self = this;

		modelNS.BaseModelView.prototype.render.apply(this);

		this.$el.addClass('fieldofcoil');

		this.renderLayout();
		this.renderParams();
		this.renderTypes();
		this.renderOutput();

		$(document.body).tooltip();

		this.writeOutput();

		window.PC = this;

		return this;
	},

	renderLayout : function ()
	{
		this.topBotLayout = new modelNS.DualHorizontalLayout({
			bottomPaneHeight: 120,
			parent: this.$el,
		}).render();

		this.animationPanel = new modelNS.SingleLayout({
			title : 'Анимация',
			parent : this.topBotLayout.$topPane,
			cls : 'animation'
		}).render();

		this.botLayout = new modelNS.DualVerticalLayout({
			firstPaneWidth : 600,
			secondPaneWidth:400,
			parent : this.topBotLayout.$bottomPane,
		}).render();

		this.paramsPane = new modelNS.SingleLayout({
			title:"Входные данные",
			parent : this.botLayout.$firstPane,
			cls : 'params',
			hasContent : true,
		}).render();

		this.botRight = new modelNS.DualVerticalLayout({
			firstPaneWidth :200,
			secondPaneWidth:200,
			parent : this.botLayout.$secondPane,
		}).render();

		this.typePane = new modelNS.SingleLayout({
			title : 'Режим',
			 parent : this.botRight.$firstPane,
			hasContent : true
		}).render();

		this.outputPane = new modelNS.SingleLayout({
			title : 'Выходные данные',
			 parent : this.botRight.$secondPane,
			 columns : 1,
			hasContent : true
		}).render();
	},

	renderOutput : function ()
	{
		this.labels = {};

		this.labels.b = new modelNS.LabelView({
			text: 'B = %d мкТл',
			parent : this.outputPane.$content,
			title: 'Магнитная индукция'
		}).render();

		this.labels.bx = new modelNS.LabelView({
			text: ' B<sub>x</sub>  = %d мкТл',
			parent : this.outputPane.$content,
			title: 'Проекция индукции на абсциссу'
		}).render();

		this.labels.by = new modelNS.LabelView({
			text: 'B<sub>y</sub> = %d мкТл',
			parent : this.outputPane.$content,
			title: 'Проекция индукции на ординату'
		}).render();

	},
	renderTypes : function ()
	{
		// RadioButtonGroup
		this.types = new modelNS.RadioButtonGroup({
			collection: new modelNS.RadioButtonCollection([
				{label:'Линии', value : 0},
				{label:'Опилки', value : 1, checked : true},
			]),
			parent: this.typePane.$content,
			columns: 1,
			verticalAlign : 'middle'
		}).render();
	},

	renderParams : function ()
	{

		this.inputs = {};
		this.inputs.x = new modelNS.Input({
			parent: this.paramsPane.$content,
			value: this.defaults.x,
			step:0.1,
			min:-19.0,
			max:19.0,
			inputType: 'number',
			width:60,
			label: 'x = ',
			labelAfter: 'см',
			title: 'Абсцисса',
		}).render();

		this.inputs.y = new modelNS.Input({
			parent: this.paramsPane.$content,
			value: this.defaults.y,
			step:0.1,
			max:9.5,
			min:-9.5,
			inputType: 'number',
			width:60,
			label: 'y = ',
			labelAfter: 'см',
			title: 'Ордината',
		}).render();

		this.inputs.i = new modelNS.Input({
			parent: this.paramsPane.$content,
			value: this.defaults.i,
			step:1,
			min:-20,
			max:20,
			inputType: 'number',
			width:60,
			label: 'I = ',
			labelAfter: 'A',
			title: 'Cила тока',
		}).render();

		this.inputs.r = new modelNS.Input({
			parent: this.paramsPane.$content,
			value: this.defaults.r,
			step:0.1,
			max:7,
			min:3,
			inputType: 'number',
			width:60,
			label: 'R = ',
			labelAfter: 'см',
			title: 'Радиус витка',
			row:true,
		}).render();

		this.inputs.dB = new modelNS.Input({
			parent: this.paramsPane.$content,
			value: this.defaults.dB,
			step:10,
			max:100,
			min:40,
			inputType: 'number',
			width:60,
			label: 'ΔB = ',
			labelAfter: 'мкТл',
			title: 'Изменение магнитного поля',
		}).render();

		var self = this,
				onchange = function () {self.writeOutput() };

		this.listenTo(this.inputs.x, 'Change', onchange);
		this.listenTo(this.inputs.y, 'Change', onchange);
		this.listenTo(this.inputs.i, 'Change', onchange);
		this.listenTo(this.inputs.r, 'Change', onchange);
		this.listenTo(this.inputs.dB, 'Change', onchange);
	},
	writeOutput : function ()
	{
		var x = this.inputs.x.getText()*1,
				y = this.inputs.y.getText()*1,
				i = this.inputs.i.getText()*1,
				r = this.inputs.r.getText()*1;
				dB = this.inputs.dB.getText()*1;
				let parameters = findBxy(x,y,r,i);

		// before:
		var
		bx = parameters[0],
		by = parameters[1],
		b = parameters[2];
		console.log(parameters)

		this.labels.b.set({'%d': this.toLabelView(b)});
		this.labels.bx.set({'%d': this.toLabelView(bx)});
		this.labels.by.set({'%d': this.toLabelView(by)});
	},
	renderAnimation : function (){

	},
	toLabelView : function (num)
	{
		return courseML.postProcessingCourseML(Math.roundDec(num, 3).toString().replace('-', '–').replace('.',','));
	},
	refresh : function ()
	{
		this.writeOutput();
	},


});

function findBxy(x,y,r,i){
	let dFi = 3.141593/360
	let answerBx =0;
	let answerBy =0;
	let fi=-3.141593/2;
	// Интегралл
	while (fi<=3.141593/2)
	{
		answerBx=answerBx + (r/100-Math.abs(x)/100*Math.sin(fi))*r/100/Math.pow(y*y/10000+x*x/10000+r*r/10000-2*r*Math.abs(y)/10000*Math.sin(fi),3/2);
		answerBy=answerBy + Math.abs(y)/100*Math.sin(fi)*r/100/Math.pow(y*y/10000+x*x/10000+r*r/10000-2*r*Math.abs(y)/10000*Math.sin(fi),3/2);
		fi=fi+dFi;
	}
	answerBx=dFi*2*Math.pow(10,-7)*i*answerBx*1000000;
	answerBy=dFi*2*Math.pow(10,-7)*i*answerBy*1000000;
	// Распределение на кварталах с отрицательными x/y (зеркаление)
	if(x>=0)
	{
		if(y<0) answerBy=-answerBy;
	}
	else{
		if(y>0) answerBy=-answerBy;
	}
	return [answerBx, answerBy, Math.sqrt(answerBx*answerBx+answerBy*answerBy)];
}
