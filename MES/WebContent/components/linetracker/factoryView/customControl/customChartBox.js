"use strict";
sap.ui.core.Control.extend("airbus.mes.factoryView.customControl.customChartBox", {
	metadata : {
		properties : {
			heading : {
				type : 'string',
				group : 'Misc',
				defaultValue : null
			},
			rtoLabel : {
				type : 'string',
				group : 'Misc',
				defaultValue : "RTO"
			},
			rto : {
				type : 'string',
				group : 'Misc',
				defaultValue : "0"
			},
			taktLabel : {
				type : 'string',
				group : 'Misc',
				defaultValue : "Target Takt"
			},
			takt : {
				type : 'string',
				group : 'Misc',
				defaultValue : "0"
			},
			allocValue:{
				type : 'string',
				group : 'Misc',
				defaultValue : "0"
			},
			alloc : {
				type : 'string',
				group : 'Misc',
				defaultValue : "Allocated Resources"
			},
			totalTime:{
				type : 'string',
				group : 'Misc',
				defaultValue : "Total Time"
			},
			totalTimeValue:{
				type : 'string',
				group : 'Misc',
				defaultValue : "0"
			},
			width:{
				type : 'sap.ui.core.CSSSize',
				group : 'Misc',
				defaultValue : "8rem"
			}
			
		},
		defaultAggregation : 'content',
		
		aggregations : {
			content : {
				type : 'sap.ui.core.Control',
				multiple : false,
				singularName : 'content'
			}
		},
		events : {
			"press" : {}
		}
	},
	onclick : function(evt) {
		this.firePress();
	},
	renderer : function(r, t) {
		var rl = t.getRtoLabel();
		var tl = t.getTaktLabel();
		var rt = t.getRto();
		var tt = t.getTakt();
		var ar = t.getAlloc();
		var av = t.getAllocValue();
		var c = t.getContent();
		var total = t.getTotalTime();
		var totalValue = t.getTotalTimeValue();
		var w = t.getWidth();
		
		r.write("<div align='center'");
		r.writeControlData(t);
		r.addClass("structureChartBox");
		r.writeClasses();
		if (w != '' || w.toLowerCase() === 'auto') {
            r.addStyle('width', w);
            r.writeStyles();
        };
		r.write('>');
		
		r.write("<div");
		r.addClass("firstheight");
		r.writeClasses();
		r.write('>');
		
		r.write("<div");
		r.addClass("firstComponent");
		r.writeClasses();
		r.write('>');
		r.write("<div align='left'");
		r.addClass("firstLabel");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(rl);
		r.write('</div>');
		r.write("<div align='left'");
		r.addClass("firstValue");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(rt);
		r.write('</div>');
		r.write('</div>');
		
		r.write("<div");
		r.addClass("firstComponent");
		r.writeClasses();
		r.write('>');
		r.write("<div align='left'");
		r.addClass("firstLabel");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(tl);
		r.write('</div>');
		r.write("<div align='left'");
		r.addClass("firstValue");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(tt);
		r.write('</div>');
		r.write('</div>');
		
		r.write('</div>');
		
		/*second*/
		r.write("<div align='left'");
		r.addClass("secondHeight");
		r.writeClasses();
		r.write('>');
		/*r.write("<div align='left'>");*/
		r.writeEscaped(av);
		r.writeEscaped(' '+ar);
		/*r.write('</div>');*/
		r.write('</div>');
		
		/*third*/
		r.write("<div");
		r.addClass("thirdHeight");
		r.writeClasses();
		r.write('>');
		r.renderControl(c);
		r.write('</div>');
		
		/*fourth*/
		r.write("<div align='left'");
		r.addClass("fourthHeight");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(total);
		r.writeEscaped(':'+totalValue);
		r.write('</div>');
		
		
		r.write('</div>');
		
	}
});