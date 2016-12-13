"use strict";
sap.ui.core.Control.extend("airbus.mes.linetracker.customControl.customStationBox", {
	metadata : {
		properties : {
			heading : {
				type : 'string',
				group : 'Misc',
				defaultValue : null
			},
			msn : {
				type : 'string',
				group : 'Misc',
				defaultValue : null
			},
			msnLabel : {
				type : 'string',
				group : 'Misc',
				defaultValue : "MSN:"
			},
			handLabel : {
				type : 'string',
				group : 'Misc',
				defaultValue : "HAND:"
			},
			hand : {
				type : 'string',
				group : 'Misc',
				defaultValue : null
			},
			lineNumber : {
				type : 'string',
				group : 'Misc',
				defaultValue : ""
			},
			height : {
				type : 'sap.ui.core.CSSSize',
				group : 'Misc',
				defaultValue : "8rem"
			},
			width : {
				type : 'sap.ui.core.CSSSize',
				group : 'Misc',
				defaultValue : "8rem"
			},
			stationHeadColor : {
				type : 'string',
				group : 'Misc',
				defaultValue : ""
			},
			taktResourceStatus  : {
				type : 'string',
				group : 'Misc',
				defaultValue : ""
			},
		},
		defaultAggregation : 'content',

		aggregations : {
			content : {
				type : 'sap.m.Image',
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
		var shc = t.getStationHeadColor();
		var ml = t.getMsnLabel();
		var hl = t.getHandLabel();
		var n = t.getMsn();
		var hd = t.getHand();
		var h = t.getHeading();
		var c = t.getContent();
		var trs = t.getTaktResourceStatus();
//		var cs = t.getConveyerStatus();
//		var ts = t.getTaktStatus();
		
		r.write("<div align='center'");/*
										 * style='width:");
										 * r.writeEscaped(t.getWidth());
										 * r.write("; height:");
										 * r.writeEscaped(t.getHeight());
										 * r.write(";");
										 */
		r.writeControlData(t);
		r.addClass("structureStationBox");
		r.writeClasses();
		r.write('>');
		r.write("<div");
		r.addClass("stationBoxHeader");
		if (trs === "BAD" || trs ==="KO") {
			r.addClass("headBlinker");
		}
//		else
//			r.addClass("greenHeading");
		r.writeClasses();
		r.write('>');
		/* Title */
		r.writeEscaped(h);
		r.write('</div>');
		r.write("<div");
		r.addClass("stationBoxBodyTop");
		switch (shc) {
		case "green":
			r.addClass("stationBoxSuccessBdr");
			break;
		default:
			r.addClass("stationBoxErrorBdr");
		}
		r.writeClasses();
		r.write("></div>");
		r.write('<div');
		r.addClass("stationBoxLower");
		r.writeClasses();
		r.write('>')
		r.write("<div");
		r.addClass("stationBoxBody");
		r.writeClasses();
		r.write('>');
		//delete
//		r.write("<img src='");
//
//		switch (i) {
//		case "GOOD":
//			r.writeEscaped("images/green.png");
//			break;
//		case "BAD":
//			r.writeEscaped("images/red_new.png");
//			break;
//		default:
//			r.writeEscaped("images/grey.png");
//		}
//		r.write("'");
//		r.addClass("stationBoxImg");
//		r.writeClasses();
//		r.write("></div>");
		// add
		r.renderControl(c);
		r.write("</div>");
		//
		r.write("<div");
		r.addClass("stationBoxFooter");
		r.writeClasses();
		r.write(">");
		r.write("<div class='factStationBoxText'>");
		r.writeEscaped(ml);
		r.write("<span");
		r.addClass("boldFont");
		r.writeClasses();
		r.write(">");
		r.writeEscaped(n);
		r.write("</span>");
		r.write("</div>");
		r.write("<div class='factStationBoxText'>");
		r.writeEscaped(hl);
		r.write("<span");
		r.addClass("boldFont");
		r.writeClasses();
		r.write(">");
		r.writeEscaped(hd);
		r.write("</span>");
		r.write("</div>");
		r.write("</div>");
		r.write("</div>");
		r.write("</div>");
	}
});