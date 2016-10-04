jQuery.sap.require("sap.ui.core.UIComponent");

sap.ui.core.UIComponent.extend("airbus.mes.masterpage.Component", {
	metadata : {
		properties : {},
		includes : [ "../css/shell.css"]
	},
	manifestUrl : "component.json"
});

airbus.mes.masterpage.Component.prototype.createContent = function() {

	this.oView = sap.ui.view({
		id : "mes",
		viewName : "airbus.mes.masterpage.masterpage",
		type : "XML",
		height : "100%"

	}).addStyleClass("absoultePosition");
	airbus.mes.masterpage.oView = this.oView;
	return this.oView;

};
