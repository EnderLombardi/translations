"use strict";
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"airbus/mes/disruptions/attachments/Formatter"
], function(Controller,JSONModel,Filter,FilterOperator,Formatter) {
	

	return Controller.extend("airbus.mes.disruptions.attachments.disruptionAttachment", {
		formatter:Formatter,


		
		onBeforeRendering: function(oEvt){
			var aFilter = [];
			var that = this;
			this.getView().addEventDelegate({
				onAfterShow: function(evt) {
				      var oCurrDisVal = evt.data.Desc;
				      
				      var oList = that.getView().byId("idList");
						var oBinding = oList.getBinding("items");
//						var oCurrDisVal = sap.ui.getCore().getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].Description;
							aFilter.push(new Filter("dis_des", FilterOperator.Contains, oCurrDisVal));	
							
						oBinding.filter(aFilter);
				      // ...now retrieve the data element with the given ID and update the page UI
				   },
				   
				});

		      
//			var idToRetrieve = evt.data.Desc;
			
		},
		onFilterChange: function(oEvent){
			var loValue = oEvent.getSource().getSelectedKey();
			
			
			if (loValue === "Current Disruption"){
				if(this.getView().byId("idCheckBox").getSelected() === true){
					this.getView().byId("idCheckBox").setSelected(false)
				}
//			var oCurrDisVal = "Disruption 1";
			var oCurrDisVal = sap.ui.getCore().getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].Description
			}
			if (loValue==="Current Work Order"){
				if(this.getView().byId("idCheckBox").getSelected() === true){
					this.getView().byId("idCheckBox").setSelected(false)
				}
//			var oCurrWo_noVal = "26557";
			var oCurrWo_noVal = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;	
			}
			if (loValue === "Current Operation"){
				if(this.getView().byId("idCheckBox").getSelected() === true){
					this.getView().byId("idCheckBox").setSelected(false)
				}
//			var oCurrop_noVal= "50002137-1-0-0011";
			var oCurrop_noVal = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no;	
			}
			
			var aFilter = [];
			var oList = this.getView().byId("idList");
			var oBinding = oList.getBinding("items");
				if(oCurrop_noVal){
				aFilter.push(new Filter("op_no", FilterOperator.Contains, oCurrop_noVal));
				}
				if(oCurrWo_noVal){
				aFilter.push(new Filter("wo_no", FilterOperator.Contains, oCurrWo_noVal));
				}
				if(oCurrDisVal){
				aFilter.push(new Filter("dis_des", FilterOperator.Contains, oCurrDisVal));	
				}
			oBinding.filter(aFilter);
			
		},
		onSelectAll: function(){
			var aFilter = [];
			var oCurrWo_noVal = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;	
			var oList = this.getView().byId("idList");
			var oBinding = oList.getBinding("items");
			aFilter.push(new Filter("wo_no", FilterOperator.Contains, oCurrWo_noVal));
			oBinding.filter(aFilter);
		},
		onPressDelete: function(oEvt){
			 var loPath = oEvt.oSource.oPropagatedProperties.oBindingContexts.attachDisruption.sPath;
			 var loLength = loPath.length;
			 var loindex = loPath.slice(loLength-1);
		},
		

		onNavPress: function(){
			this.nav = this.getView().oParent;
			this.nav.back();
		}

	});
});
