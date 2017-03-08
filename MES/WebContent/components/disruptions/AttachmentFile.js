"use strict";

jQuery.sap.declare("airbus.mes.disruptions.AttachmentFile");

airbus.mes.disruptions.AttachmentFile = {
	onNavPress : function(oEvt) {
		oEvt.getSource().getParent().getParent().close();
	},

	/*
	 * Local json model is maintained to store the list of attachments 
	 * attached from the desktop
	 */
	onUploadComplete : function(filesListBase64) {
		//		var oFileUploader = sap.ui.getCore().byId("idfileUploader");

		var oModel = sap.ui.getCore().getModel("DesktopFilesModel");
		var oData = oModel.getData();
		//				var sName = oFileUploader.oFilePath._lastValue;

		var oInput = sap.ui.getCore().byId("idTitleInput");
		var sTitle = oInput.getValue();

		//				var sType = oFileUploader.oFilePath._lastValue.split(".")[1];
		//				var sIcon = airbus.mes.disruptions.AttachmentManager.getFileIcon(sType);
		var oCurrOpRadioBtt = sap.ui.getCore().byId("idCheckCurrOp");
		var oCurrWORadioBtt = sap.ui.getCore().byId("idCheckCurrWO");
		var oDesktpRadioBtt = sap.ui.getCore().byId("idCheckDesktop");

		var jsonObj = [];
		var item = {};
		var iLen = oData.length;
		if (iLen === undefined) {
			item["Title"] = sTitle,
			item ["File"] = filesListBase64[0],
			//				item ["icon"] = sIcon

			jsonObj.push(item);
			oModel.setData(jsonObj);
		} else {
			oData.unshift({
				"Title" : sTitle,
				"File" : filesListBase64[0],
			//	 					"icon" : sIcon
			})
		}
		oModel.refresh();
		oCurrOpRadioBtt.setSelected(false);
		oCurrWORadioBtt.setSelected(false);
		oDesktpRadioBtt.setSelected(true);
		oInput.destroy();
	},

	/*
	 * A Dialog Appears on press of attach button,
	 * to enter the title of the attached file
	 */
	onPressAttachBttn : function(oEvt) {
		// When user selects a file, a popup is displayed
		// here the title is to be given
        var files = oEvt.getParameters().files;
        var file = files[0];
        var reader = new FileReader();
        var filesListBase64 = [];
        reader.onload = function (readerEvt) {
            var binaryString = readerEvt.target.result;
            var oBase64 = {};
            oBase64.fileName = file.name;
            oBase64.type = file.type;
            oBase64.fileBase64 = btoa(binaryString);
            filesListBase64.push(oBase64);
        }
        reader.readAsBinaryString(files[0]);
        
        
		var dialog = new sap.m.Dialog({
			customHeader : [ new sap.m.Toolbar({
				content : [ new sap.m.Title({
					text : "{i18nModel>EntDesc}"
				}).addStyleClass("sapUiSmallMarginBegin") ]
			}) ],
			content : [ new sap.m.Input("idTitleInput", {
				liveChange : function(oEvt) {
					var iLen = oEvt.getParameters().value.length;
					if (iLen === 0) {
						oEvt.getSource().oParent.mAggregations.beginButton.setEnabled(false);
					} else {
						oEvt.getSource().oParent.mAggregations.beginButton.setEnabled(true)
					}
				}
			}) ],
			beginButton : new sap.m.Button({
				enabled : false,
				text : '{i18nModel>OK}',
				press : function() {
					dialog.close();
					airbus.mes.disruptions.AttachmentFile.onUploadComplete(filesListBase64);
				}
			}),
			endButton : new sap.m.Button({
				text : '{i18nModel>cancel}',
				press : function() {
					dialog.close();
					var oInput = sap.ui.getCore().byId("idTitleInput");
					oInput.destroy();
				}
			})
		});

		oEvt.getSource().getParent().getParent().addDependent(dialog);
		dialog.open();
	},

	/*
	 * Deleting the Attachment Title from the List of Documents
	 */
	onDeletePress : function(oEvent) {
		// calculating the index of the selected list item
		var sPath = oEvent.oSource.oParent.oPropagatedProperties.oBindingContexts.DesktopFilesModel.sPath;
		var iIndex = sPath.split("/")[1];
		// Removing the selected list item from the model based on the index
		// calculated
		var oModel = sap.ui.getCore().getModel("DesktopFilesModel");
		oModel.oData.splice(iIndex, 1);
		oModel.refresh();

	}
}