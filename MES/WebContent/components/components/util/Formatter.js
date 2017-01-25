"use strict";

jQuery.sap.declare("airbus.mes.components.util.Formatter");

airbus.mes.components.util.Formatter = {

	translateFilter : function(sName) {
		return  airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty(sName);
	}

};

