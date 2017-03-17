"use strict";

sap.ui.controller("airbus.mes.jigtools.controller.jigtools", {

//	Contain value of radiobutton setting by default mode or by user 
	sSet : undefined,
	
	/**
	 * Launch after rendering
	 * Define the radiobutton set
	 */	
	onAfterRendering: function () {
		this.filterJigsTools(this.sSet);
	},

	/**
	 * Get setting from ME/MII and select the good button between operation and work order
	 */		
	checkSettingJigsTools: function () {
		
		// confirm if we have already check the ME settings
		if (this.sSet === undefined){
			if (this.getOwnerComponent().getSSet() === undefined){
				
				//will be the configuration received in AppConfManager
//				Application manager configuration is setting to physical station level, we concatenate the ID VIEW_ATTACHED_TOOL with the physical station
				var sSet = airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_TOOL_" + airbus.mes.settings.ModelManager.station);
				
				if(sSet === null) {
//					Default mode
					this.sSet = airbus.mes.jigtools.util.ModelManager.operation;
				} else {
					this.sSet = sSet;
				}
				
			} else {
				
// 				Set the global variable
				this.sSet = this.getOwnerComponent().getSSet();
			}
		}
		 //coming from acpnglinks
		 if(airbus.mes.stationtracker.opeDetailCallStack.arr && airbus.mes.stationtracker.opeDetailCallStack.arr.length > 1 && airbus.mes.stationtracker.opeDetailCallStack.sOrigin){
			 this.sSet = airbus.mes.jigtools.util.ModelManager.workOrder;
		 }
		switch (this.sSet) {
			case airbus.mes.jigtools.util.ModelManager.operation:
				sap.ui.getCore().byId("jigtoolsView--operationButton").setSelected(true);
				break;
			case airbus.mes.jigtools.util.ModelManager.workOrder:
				sap.ui.getCore().byId("jigtoolsView--workOrderButton").setSelected(true);
				break;
			default: //if Null operation default mode
				sap.ui.getCore().byId("jigtoolsView--operationButton").setSelected(true);
				break;
		}
		
	},

	//
	/**
	 * Get user action on the checkbox field
	 * 
	 * @param {object} oEvent : Current event
	 */	
	onSelectLevel: function (oEvent) {
//		Retrieve index of selected radiobutton 
		var sId = oEvent.mParameters.selectedIndex;
		switch (sId) {
			case 0://operation button
				this.filterJigsTools(airbus.mes.jigtools.util.ModelManager.operation);
				break;
			case 1://work order button
				this.filterJigsTools(airbus.mes.jigtools.util.ModelManager.workOrder);
				break;
			default:
				break;
		}
	},

	/**
	 * Apply the filter on the model 
	 * 
	 * @param {string} sScope : radiobutton selected by user
	 */	
	filterJigsTools: function (sScope) {
//		Update the user choice to retrieve it when popup is reopen
		this.sSet = sScope;
		switch (sScope) {
			case airbus.mes.jigtools.util.ModelManager.operation:
				sap.ui.getCore().byId("jigtoolsView--jigToolList").getBinding("rows").filter(new sap.ui.model.Filter("routerStep", "EQ", sap.ui.getCore().getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].routerStepBo));
				break;
			case airbus.mes.jigtools.util.ModelManager.workOrder:
				sap.ui.getCore().byId("jigtoolsView--jigToolList").getBinding("rows").filter();
				break;
			default:
				sap.ui.getCore().byId("jigtoolsView--jigToolList").getBinding("rows").filter(new sap.ui.model.Filter("routerStep", "EQ", sap.ui.getCore().getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].routerStepBo));
				break;
			}
		}
	}
);
