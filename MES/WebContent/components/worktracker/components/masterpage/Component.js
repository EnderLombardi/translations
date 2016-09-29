jQuery.sap.require("sap.ui.core.UIComponent");

sap.ui.core.UIComponent.extend("airbus.mes.worktracker.components.masterpage.Component", {
	metadata : {
		properties : {},
		includes : [ "../../css/shell.css"  
		           /*  "../../css/workTracker.css",
		             "../../css/sideNavigation.css",
		             "../../util/Formatter.js",
		             "../../util/Functions.js"*/
		           ]
	},
	manifestUrl : "component.json"
});

airbus.mes.worktracker.components.masterpage.Component.prototype.createContent = function() {

	this.oView = sap.ui.view({
		id : "WT_Master",
		viewName : "airbus.mes.worktracker.views.masterpage",
		type : "XML",
		height : "auto"

	}).addStyleClass("absolute");
	airbus.mes.worktracker.components.masterpage.oView = this.oView;

	return this.oView;

};
