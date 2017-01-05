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



//		onBeforeRendering: function(oEvt){
//			var aFilter = [];
//			var that = this;
//			//by default the list is filtered according to the current disruption
//			this.getView().addEventDelegate({
//				onAfterShow: function(evt) {
//					var oCurrDisVal = evt.data.Desc;
//					var oList = that.getView().byId("idList");
//					var oBinding = oList.getBinding("items");
//					aFilter.push(new Filter("dis_des", FilterOperator.Contains, oCurrDisVal));	
//
//					oBinding.filter(aFilter);
//				},
//
//			});
//
//		},
//		/***************************************
//		 * when user selects an option from the drop down menu
//		 */
//		onFilterChange: function(oEvent){
//			var loValue = oEvent.getSource().getSelectedKey();
//
//			//on select of a particular select option the check box is checked, if checked, it is unchecked
//			if (loValue === "Current Disruption"){
//				if(this.getView().byId("idCheckBox").getSelected() === true){
//					this.getView().byId("idCheckBox").setSelected(false)
//				}
//				var oCurrDisVal = sap.ui.getCore().getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].Description
//			}
//			if (loValue==="Current Work Order"){
//				if(this.getView().byId("idCheckBox").getSelected() === true){
//					this.getView().byId("idCheckBox").setSelected(false)
//				}
//				var oCurrWo_noVal = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;	
//			}
//			if (loValue === "Current Operation"){
//				if(this.getView().byId("idCheckBox").getSelected() === true){
//					this.getView().byId("idCheckBox").setSelected(false)
//				}
//				var oCurrop_noVal = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no;	
//			}
//			//filtering according to the select option
//			var aFilter = [];
//			var oList = this.getView().byId("idList");
//			var oBinding = oList.getBinding("items");
//			if(oCurrop_noVal){
//				aFilter.push(new Filter("op_no", FilterOperator.Contains, oCurrop_noVal));
//			}
//			if(oCurrWo_noVal){
//				aFilter.push(new Filter("wo_no", FilterOperator.Contains, oCurrWo_noVal));
//			}
//			if(oCurrDisVal){
//				aFilter.push(new Filter("dis_des", FilterOperator.Contains, oCurrDisVal));	
//			}
//			oBinding.filter(aFilter);
//
//		},
		/***************************************
		 * when user checks the select all check box
		 */
		onSelectAll: function(){
			//filter is applied when the user selects the checkbox
			var aFilter = [];
			var oCurrWo_noVal = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;	
			var oList = this.getView().byId("idList");
			var oBinding = oList.getBinding("items");
			aFilter.push(new Filter("wo_no", FilterOperator.Contains, oCurrWo_noVal));
			oBinding.filter(aFilter);
		},


		/***************************************
		 * Open document in MES Document Viewer
		 */
		openDocument: function(oEvent){
			var url = oEvent.getSource().getCustomData()[0].getValue();


			// Hide backdrop
			$("#sap-ui-blocklayer-popup").css('zIndex', '-1');


			// Hide Pop-Up
			switch(nav.getCurrentPage().sId){
			case "stationTrackerView":
				$("#operationDetailPopup--operationDetailPopUp").css('display', 'none');
				break;
			case "disruptiontrackerView":
				$("#disruptionDetailPopup--disruptionDetailPopUp").css('display', 'none');
			}

			// Open Document viewer
			airbus.mes.shell.util.navFunctions.docViewer(url, airbus.mes.disruptions.attachments.oView.oController.onMESDocViewerClose);
		},

		/******************************************
		 * To be executed when the document viewer is closed
		 * In order to re-appear the ackdrop and pop-up
		 */
		onMESDocViewerClose: function(){
			$("#sap-ui-blocklayer-popup").css('zIndex', '38');

			switch(nav.getCurrentPage().sId){
			case "stationTrackerView":
				$("#operationDetailPopup--operationDetailPopUp").css('display', 'block');
				break;
			case "disruptiontrackerView":
				$("#disruptionDetailPopup--disruptionDetailPopUp").css('display', 'block');
			}
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
