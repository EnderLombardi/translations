"use strict";
sap.ui.core.Control.extend("airbus.mes.linetracker.customControl.sCustomProductionBox", {
	metadata : {
		properties : {
			
			progress : {
				type : 'string',
				group:'Misc',
				defaultValue : "0"
			},
			progressLabel : {
				type : 'string',
				group : 'Misc',
				defaultValue : "Progress"
			},
			taktLabel : {
				type : 'string',
				group : 'Misc',
				defaultValue : "Takt %"
			},
			takt : {
				type : 'string',
				group:'Misc',
				defaultValue : "0"
			},
			stvLabel : {
				type : 'string',
				group : 'Misc',
				defaultValue : "Total TIme"
			},
			stv : {
				type : 'int',
				defaultValue : 0
			},
			taktTimeLabel : {
				type : 'string',
				group : 'Misc',
				defaultValue : "Remaining"
			},
			taktTime : {
				type : 'string',
				group:'Misc',
				defaultValue : "0"
			},
			andonLabel : {
				type : 'string',
				group : 'Misc',
				defaultValue : "Andon"
			},
			openLabel : {
				type : 'string',
				group : 'Misc',
				defaultValue : "Open"
			},
			open : {
				type : 'int',
				defaultValue : 0
			},
			escalatedLabel : {
				type : 'string',
				group : 'Misc',
				defaultValue : "Escalated"
			},
			escalated : {
				type : 'int',
				defaultValue : 0
			},
			unitPercentage : {
				defaultValue : "%"
			},
			unitHours : {
				defaultValue : "Hrs"
			},
			width:{
				type : 'sap.ui.core.CSSSize',
				group : 'Misc',
				defaultValue : "8rem"
			},
			openStatus:{
				type : 'string',
				group : 'Misc',
				defaultValue : "GOOD"	
			},
			escalatedStatus:{
				type : 'string',
				group : 'Misc',
				defaultValue : "GOOD"
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

		var pl = t.getProgressLabel();
		var tl = t.getTaktLabel();
		var sl = t.getStvLabel();
		var ttl = t.getTaktTimeLabel();
		var al = t.getAndonLabel();
		var ol = t.getOpenLabel();
		var el = t.getEscalatedLabel();
		var p = t.getProgress();
		var tk = t.getTakt();
		var tt = t.getTaktTime();
		var s = t.getStv();
		var o = t.getOpen();
		var e = t.getEscalated();
//		var c = t.getContent();
		var up = t.getUnitPercentage();
		var uh = t.getUnitHours();
		var w = t.getWidth();
		var os = t.getOpenStatus();
//		var es = t.getEscalatedStatus();
		
		r.write("<div align='center'");
		r.writeControlData(t);

		r.addClass("structureStationDetail whiteBackground");
		r.writeClasses();
		if (w != '' || w.toLowerCase() === 'auto') {
            r.addStyle('width', w);
            r.writeStyles();
        };
		r.write('>');

		/*r.write("<div");
		r.addClass("productionBoxheight");
		r.writeClasses();
		r.write('>');

		r.write("<div align = 'center'");
		r.addClass("imageSize");
		r.writeClasses();
		r.write('>');
		r.renderControl(c);
		r.write('</div>');

		r.write('</div>');*/

		r.write("<div");
		r.addClass("stationDetailheight");
		r.writeClasses();
		r.write('>');

		r.write("<div");
		r.addClass("stationDetailMiddle");
		r.writeClasses();
		r.write('>');
		r.write("<div");
		r.addClass("stationDetailMiddleLabel");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(pl);
		r.write('</div>');
		r.write("<div");
		r.addClass("magentacolor stationDetailFontsize");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(p + up);
		r.write('</div>');
		r.write('</div>');

		r.write("<div");
		r.addClass("stationDetailMiddle");
		r.writeClasses();
		r.write('>');
		r.write("<div");
		r.addClass("stationDetailMiddleLabel");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(tl);
		r.write('</div>');
		r.write("<div");
		r.addClass(" greenColor stationDetailFontsize");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(tk + up);
		r.write('</div>');
		r.write('</div>');

		r.write("<div");
		r.addClass("stationDetailMiddle");
		r.writeClasses();
		r.write('>');
		r.write("<div");
		r.addClass("stationDetailMiddleLabel");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(sl);
		r.write('</div>');
		r.write("<div");
		r.addClass("sizeSmall magentacolor");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(s + ' ' + uh);
		r.write('</div>');
		r.write('</div>');

		r.write("<div");
		r.addClass("stationDetailMiddle");
		r.writeClasses();
		r.write('>');
		r.write("<div");
		r.addClass("stationDetailMiddleLabel");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(ttl);
		r.write('</div>');
		r.write("<div");
		r.addClass("stationDetailHeight sizeSmall greenColor");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(tt + ' ' + uh);
		r.write('</div>');
		r.write('</div>');

		r.write("<div");
		r.addClass("andonLabel");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(al);
		r.write('</div>');

		r.write('</div>');

		r.write("<div");
		r.addClass("stationDetailMain");
		r.writeClasses();
		r.write('>');

		r.write("<div");
		r.addClass("stationDetailLower");
		if (os === "BAD")
			r.addClass("redBackground");
		else
			r.addClass("greenBackground");
		r.writeClasses();
		r.write('>');
		r.write("<div");
		r.addClass("stationDetailLowerValue");
		r.writeClasses();
		r.write('>');
		r.write(o);
		r.write('</div>');
		r.write("<div");
		r.addClass("stationDetailLowerLabel");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(ol);
		r.write('</div>');
		r.write('</div>');

		r.write("<div");
		r.addClass("stationDetailLower");
		if (e === 0 )
			r.addClass("greenBackground");
		else
			r.addClass("redBackground");
		r.writeClasses();
		r.write('>');
		r.write("<div");
		r.addClass("stationDetailLowerValue");
		r.writeClasses();
		r.write('>');
		r.write(e);
		r.write('</div>');
		r.write("<div");
		r.addClass("stationDetailLowerLabel");
		r.writeClasses();
		r.write('>');
		r.writeEscaped(el);
		r.write('</div>');
		r.write('</div>');

		r.write('</div>');

		r.write('</div>');

	}
});