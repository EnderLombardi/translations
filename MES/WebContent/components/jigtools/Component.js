"use strict";

jQuery.sap.registerModulePath("airbus.mes.jigtools", "../components/jigtools");
jQuery.sap.require("airbus.mes.jigtools.util.ModelManager");
jQuery.sap.declare("airbus.mes.jigtools.Component");

sap.ui.core.UIComponent.extend("airbus.mes.jigtools.Component", {
	metadata : {
		properties : { 
			site : undefined,
			phStation : undefined,
			workOrder : undefined,
			operation : undefined,
			sSet      : undefined
		},
	}
});

/**
 * Initialization of the component
 */
airbus.mes.jigtools.Component.prototype.init = function () {
    // call the init function of the parent
	sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
};

/**
 * Create the content of the component.
 * it means : create the view, the i18n model and the model manager
 * 
 * @returns {object} view of the component
 */
airbus.mes.jigtools.Component.prototype.createContent = function() {

//	Create the current only if the component is not already loaded
	if (airbus.mes.jigtools.oView === undefined) {
		
// 		View on XML
		this.oView = sap.ui.view({
			id : "jigtoolsView",
			viewName : "airbus.mes.jigtools.view.jigtools",
			type : "XML",
			height:"100%"
		})
		airbus.mes.jigtools.oView = this.oView;

		var i18nModel = new sap.ui.model.resource.ResourceModel({ bundleName : "airbus.mes.jigtools.i18n.i18n" });
		this.oView.setModel(i18nModel, "i18nJigstoolsModel");		

// 		Initialize ModelManager and load needed file
        airbus.mes.jigtools.util.ModelManager.init(sap.ui.getCore());		
	} 
		
	return airbus.mes.jigtools.oView;

};
