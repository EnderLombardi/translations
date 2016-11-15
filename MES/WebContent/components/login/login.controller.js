sap.ui.controller("airbus.mes.login.login", {
	
	onConfirm : function(oEvent) {
		airbus.mes.login.user = oEvent.getSource().getParent().getAggregation("content")[1].getValue();
		airbus.mes.login.pass = oEvent.getSource().getParent().getAggregation("content")[2].getValue() ;
	}
});