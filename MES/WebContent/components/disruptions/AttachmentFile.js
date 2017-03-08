"use strict";

jQuery.sap.declare("airbus.mes.disruptions.AttachmentFile");

airbus.mes.disruptions.AttachmentFile = {
	onNavPress : function(oEvt){
		oEvt.getSource().getParent().getParent().close();
	},
	onUploadComplete : function(oEvt){
		var oFileUploader = sap.ui.getCore().byId("idfileUploader");
		
				var oModel = sap.ui.getCore().getModel("DesktopFilesModel");
				var oData = oModel.getData();
				var sName = oFileUploader.oFilePath._lastValue;
				
				var oInput = sap.ui.getCore().byId("idTitleInput");
				var sTitle = oInput.getValue();
		
				var sType = oFileUploader.oFilePath._lastValue.split(".")[1];
				var sIcon = airbus.mes.disruptions.AttachmentManager.getFileIcon(sType);
				var jsonObj = [];
				var item={};
				var iLen = oData.length;
				if(iLen === undefined){
				item ["Title"] = sTitle,
				item ["type"] = sName,
				item ["icon"] = sIcon

				jsonObj.push(item);
				oModel.setData(jsonObj);
				} else {
					oData.unshift({
	     				"Title": sTitle,
	 					"type" : sName,
	 					"icon" : sIcon
	 					})
				}
				oModel.refresh();
				oInput.destroy();
		
				// updates the attachment number on adding an attachment
//				var loLink = this.getView().byId("idAttachmentLink");
//				var loCount = oModel.getData().items.length;
//				var sAttachment = airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("Attachment");
//				loLink.setText(loCount + " " + sAttachment);
	},
	onFileSelect : function(oEvt) {
		// When user selects a file, a popup is displayed
		// here the title is to be given
		var dialog = new sap.m.Dialog({
			customHeader : [ new sap.m.Toolbar({
				content : [ new sap.m.Title({
					text : "{i18nModel>EntDesc}"
				}).addStyleClass("sapUiSmallMarginBegin") ]
			}) ],
			content : [ new sap.m.Input("idTitleInput", {}) ],
			beginButton : new sap.m.Button({
				text : '{i18nModel>OK}',
				press : function() {
					dialog.close();
					airbus.mes.disruptions.AttachmentFile.onUploadComplete();
				}
			}),
			endButton : new sap.m.Button({
				text : '{i18nModel>cancel}',
				press : function() {
					dialog.close();
				}
			})
		});

		oEvt.getSource().getParent().getParent().addDependent(dialog);
		dialog.open();
	},
	onDeletePress: function(oEvent){
//		var list = sap.ui.getCore().byId("idList")
		// calculating the index of the selected list item
		var sPath = oEvent.mParameters.listItem.oBindingContexts.Model.sPath;
		var iLength = sPath.length;
		var iIndex = sPath.slice(iLength - 1);
		// Removing the selected list item from the model based on the index
		// calculated
		var oModel = this.getView().getModel("DesktopFilesModel");
		var oData = oModel.oData;
		var removed = oData.items.splice(iIndex, 1);
		oModel.setData(oData);
		
	}
}