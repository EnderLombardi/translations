"use strict";

jQuery.sap.declare("airbus.mes.disruptions.AttachmentFile");

airbus.mes.disruptions.AttachmentFile = {
	onNavPress : function(oEvt){
		oEvt.getSource().getParent().getParent().close();
	},
	onUploadComplete : function(oEvt){
		var oFileUploader = sap.ui.getCore().byId("idfileUploader");
		
				var oModel = sap.ui.getCore().getModel("AttachmentList");
				var oData = oModel.getData();
				var sName = oFileUploader.oFilePath._lastValue;
				
				var sTitle = sap.ui.getCore().byId("idTitleInput").getValue();
		
				var sType = oFileUploader.oFilePath._lastValue.split(".")[1];
				var sIcon = airbus.mes.disruptions.AttachmentManager.getFileIcon(sType);
		
				oData.items.unshift({
					"Title": sTitle,
					"type" : sName,
					"icon" : sIcon
				});
				oModel.setData(oData);
		
				// updates the attachment number on adding an attachment
				var loLink = this.getView().byId("idAttachmentLink");
				var loCount = oModel.getData().items.length;
				var sAttachment = airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("Attachment");
				loLink.setText(loCount + " " + sAttachment);
	},
	onFileSelect : function(oEvt){
		// When user selects a file, a popup is displayed
		// here the title is to be given
		var dialog = new sap.m.Dialog({
			content : [ new sap.m.Label({
				text : "{i18nModel>Title}"
			}), new sap.m.Input("idTitleInput",{}) ],
			beginButton : new sap.m.Button({
				text : '{i18nModel>OK}',
				press : function() {
					dialog.close();
					var oFileUploader =sap.ui.getCore().byId("idfileUploader");
					oFileUploader.upload();
				}
			}),
			endButton : new sap.m.Button({
				text : '{i18nModel>cancel}',
				press : function(){
					dialog.close();
				}
			}),
//			afterClose : function() {
//				dialog.destroy();
//			}
		});


		oEvt.getSource().getParent().getParent().addDependent(dialog);		
		dialog.open();
	}
}