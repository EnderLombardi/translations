"use strict";

jQuery.sap.declare("airbus.mes.stationtracker.customButton");

sap.m.Button.extend("airbus.mes.stationtracker.customButton", {
	metadata : {
			  
		properties : {
			
			text1 : {
				type : 'string',
				group : 'Appearance',
				defaultValue : '0'
			},
			text2 : {
				type : 'string',
				group : 'Appearance',
				defaultValue : '0'
			},
			
		},
	},
	

	renderer : function(oRm,oControl) {
		
		oRm.write("<button");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMBtn sapMBtnBase");
        oRm.writeClasses();
        oRm.write(">");
        oRm.write("<div");
        oRm.addClass("sapMBtnHoverable sapMBtnIconFirst sapMBtnInner sapMBtnText sapMBtnTransparent sapMFocusable customButton");
        oRm.writeClasses();
        oRm.write(">");
        oRm.write("<span");
        oRm.writeClasses();
        oRm.write(">");
        oRm.write(oControl.getText1());
        oRm.write("</span>")
        oRm.write("<span");
        oRm.addClass("circle");
        oRm.writeClasses();
        oRm.write(">");
        oRm.write(oControl.getText2());
        oRm.write("</span>")
        oRm.write("</div>");
        oRm.write("</button>");
	
	}
});
