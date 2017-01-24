"use strict";
jQuery.sap.declare("airbus.mes.worktracker.custom.ClickText");
jQuery.sap.require("sap.m.Text");
jQuery.sap.require("sap.m.TextRenderer");

sap.m.Text.extend("airbus.mes.worktracker.custom.ClickText", {
	renderer : "sap.m.TextRenderer",
	metadata : {
		events : {
			press : {},
		}
	},
	onmouseup : function(evt) {   // is called when the Button is hovered - no event registration required
	    this.firePress();
	},

});
