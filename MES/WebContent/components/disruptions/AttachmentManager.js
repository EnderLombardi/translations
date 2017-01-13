"use strict";

jQuery.sap.declare("airbus.mes.disruptions.AttachmentManager")

airbus.mes.disruptions.AttachmentManager = {

	/***************************************************************************
	 * This event is triggered when the user has selected the title and has
	 * pressed the Ok Button
	 **************************************************************************/
	onUploadComplete : function(loValue) {
		var oFileUploader = this.getView().byId("idfileUploader");

		var oModel = sap.ui.getCore().getModel("AttachmentList");
		var oData = oModel.getData();
		var sName = oFileUploader.oFilePath._lastValue;
		
		var sTitle = sap.ui.getCore().byId("idTitleInput").getValue();

		var sType = oFileUploader.oFilePath._lastValue.split(".")[1];
		var sIcon = airbus.mes.disruptions.Formatter.getFileIcon(sType);

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

	/***************************************************************************
	 * The event is triggered when the user select a file from the browse popup
	 * 
	 **************************************************************************/
	onFileSelect : function(oEvt) {
		var that = this;
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
					var oFileUploader = that.getView().byId("idfileUploader");
					oFileUploader.upload();
				}
			}),
			endButton : new sap.m.Button({
				text : '{i18nModel>cancel}',
				press : function(){
					dialog.close();
				}
			}),
			afterClose : function() {
				dialog.destroy();
			}
		});

		// to get access to the global model
		this.getView().addDependent(dialog);
		dialog.open();
	},

	/***************************************************************************
	 * Displays a popover when the user click on the attachments link
	 **************************************************************************/
	showAttachedDocsList : function(oEvent) {
		var _self = this;
		if (!this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("airbus.mes.disruptions.fragment.AttachmentPopover", airbus.mes.disruptions.oView.createDisruption
				.getController());
			this.getView().addDependent(this._oPopover);
		}
		// Popover opens on the clcik of attachment link
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function() {
			this._oPopover.openBy(oButton);
		});
		// Number of attachments is is set on the popover's table header
		var AttachmentHeader = sap.ui.getCore().byId("idAttachmentHeader");
		var loModel = sap.ui.getCore().getModel("AttachmentList");
		var iLength = loModel.oData.items.length;
		var sAttachment = airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("Attachment");
		AttachmentHeader.setText(sAttachment + " (" + iLength + ")");

	},

	/***************************************************************************
	 * When User deletes an attachment from the list of attachment from the
	 * popover
	 **************************************************************************/
	onPressDeleteButton : function(oEvent) {
		this.getView().byId("idAttachmentTable");
		// calculating the index of the selected list item
		var sPath = oEvent.mParameters.listItem.oBindingContexts.AttachmentList.sPath;
		var iLength = sPath.length;
		var iIndex = sPath.slice(iLength - 1);
		// Removing the selected list item from the model based on the index
		// calculated
		var oModel = sap.ui.getCore().getModel("AttachmentList")
		var oData = oModel.oData;
		var removed = oData.items.splice(iIndex, 1);
		oModel.setData(oData);
		oModel.refresh();

		// updates the attachment number on deleting an attachment
		var oLink = this.getView().byId("idAttachmentLink");
		var iCount = oModel.getData().items.length;
		var sAttachment = airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("Attachment");
		oLink.setText(iCount + " " + sAttachment);
		// Updates Number of attachment on the popover's table header on delete
		var oAttachmentHeader = sap.ui.getCore().byId("idAttachmentHeader");
		var oModel = sap.ui.getCore().getModel("AttachmentList");
		var iLength = oModel.getData().items.length;
		oAttachmentHeader.setText(sAttachment + " (" + iLength + ")");
	}
};
