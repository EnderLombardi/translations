"use strict";

jQuery.sap.declare("airbus.mes.disruptions.AttachmentFile");

airbus.mes.disruptions.AttachmentFile = {

	init: function (core) {

		if (this.core) { return; }

		this.core = core;

		airbus.mes.shell.ModelManager.createJsonModel(core, ["DesktopFilesModel"]);
	},

	onAttachPress: function (oEvt) {
		if (!this.AttachmentDialog) {
			this.AttachmentDialog = sap.ui.xmlfragment("airbus.mes.disruptions.fragment.AttachmentDialog", airbus.mes.disruptions.AttachmentFile);
			this.getView().addDependent(this.AttachmentDialog);
		}

		this.AttachmentDialog.open();
	},

	/*
	 * Local json model is maintained to store the list of attachments 
	 * attached from the desktop
	 */
	onUploadComplete: function (filesListBase64) {

		var oModel = sap.ui.getCore().getModel("DesktopFilesModel");
		var oData = oModel.getData();

		var oInput = sap.ui.getCore().byId("idTitleInput");
		var description = oInput.getValue();
		var item = {};
		var iLen = oData.length;
		item.Title = filesListBase64.fileName;
		item.Description = description;
		item.File = filesListBase64.fileBase64;
		item.Size = filesListBase64.size;
		if (iLen === undefined) {
			var jsonObj = [item];
			oModel.setData(jsonObj);
		} else {
			oData.unshift(item);
		}
		oModel.refresh();
		oInput.destroy();
	},

	/*
	 * A Dialog Appears on press of attach button,
	 * to enter the title of the attached file
	 */
	onPressAttachBttn: function (oEvt) {
		// When user selects a file, a popup is displayed
		// here the title is to be given
		var files = oEvt.getParameters().files;
		var file = files[0];
		var reader = new FileReader();
		var filesListBase64 = {};
		reader.onload = function (readerEvt) {
			var binaryString = readerEvt.target.result;
			filesListBase64.fileName = file.name;
			filesListBase64.type = file.type;
			filesListBase64.fileBase64 = btoa(binaryString);
			filesListBase64.size = file.size;
		}
		reader.readAsBinaryString(files[0]);


		var dialog = new sap.m.Dialog({
			customHeader: [new sap.m.Toolbar({
				content: [new sap.m.Title({
					text: "{i18nModel>EntDesc}"
				}).addStyleClass("sapUiSmallMarginBegin")]
			})],
			content: [new sap.m.Input("idTitleInput", {
				liveChange: function (oEvt) {
					var iLen = oEvt.getParameters().value.length;
					if (iLen === 0) {
						oEvt.getSource().oParent.mAggregations.beginButton.setEnabled(false);
					} else {
						oEvt.getSource().oParent.mAggregations.beginButton.setEnabled(true)
					}
				}
			})],
			beginButton: new sap.m.Button({
				enabled: false,
				text: '{i18nModel>OK}',
				press: function () {
					dialog.close();
					airbus.mes.disruptions.AttachmentFile.onUploadComplete(filesListBase64);
				}
			}),
			endButton: new sap.m.Button({
				text: '{i18nModel>cancel}',
				press: function () {
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
	onDeletePress: function (oEvent) {
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