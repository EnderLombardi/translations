"use strict";

jQuery.sap.declare("airbus.mes.disruptions.AttachmentManager")

airbus.mes.disruptions.AttachmentManager = {
	onUploadComplete : function(loValue) {
		var oFileUploader = this.getView().byId("idfileUploader");
		
		var oModel = sap.ui.getCore().getModel("AttachmentList");
		var oData = oModel.getData();
		var loName = oFileUploader.oFilePath._lastValue;
		var loType = oFileUploader.oFilePath._lastValue.split(".")[1];
		if(loType === 'png' || loType === 'jpg'){var loIcon = "sap-icon://camera"}
		if(loType === 'txt'){var loIcon = "sap-icon://document-text"}
		if(loType === 'doc' || loType === 'docs'){var loIcon = "sap-icon://doc-attachment"}
		if(loType === 'pdf'){var loIcon = "sap-icon://pdf-attachment"}
		if(loType === 'xlsx'){var loIcon = "sap-icon://excel-attachment"}
		if(loType === 'pptx' || loType === 'ppt'){var loIcon = "sap-icon://ppt-attachment"}
		
		else {var loIcon = "sap-icon://document-text"}
		oData.items.unshift({"Title":"File","type":loName,"icon":loIcon});
//	    var oTable = sap.ui.getCore().byId("idAttachmentTable");
	    oModel.setData(oData);
	    
//	    var loLink = this.getView().byId("idLink");
//	    var loCount = oModel.getData().items.length;
//	    loLink.setText(loCount + " Attachments");
	    
		var loAttachmentHeader = sap.ui.getCore().byId("idAttachmentHeader");
		var loModel = sap.ui.getCore().getModel("AttachmentList");
		var loLength = loModel.getData().items.length;
		loAttachmentHeader.setText("Attachments ("+loLength+")");
	},
	
	onFileSelect: function(oEvt){
		var that = this;
		var dialog = new sap.m.Dialog({
			content:[ new sap.m.Label({
				text:"Enter the Title"
			}),
			new sap.m.Input("idTitleInput",{
				
			})
			],
			beginButton: new sap.m.Button({
				text: 'oK',
				press: function () {
//					var loValue = sap.ui.getCore().byId("idTitleInput").getValue();
					dialog.close();
					var oFileUploader = that.getView().byId("idfileUploader");
					oFileUploader.upload();
//					that.getView().byId("idfileUploader").attachPress(that.onUploadStart(loValue));
					
				}
			}),
			afterClose: function() {
				dialog.destroy();
//				sap.ui.getCore().byId("idTitleInput").destroy();
			}
		});

		//to get access to the global model
		this.getView().addDependent(dialog);
		dialog.open();
	},
	

	onUploadStart : function(loValue) {

	},

	onCameraPress : function() {

	},
	showAttachedDocsList : function(oEvent) {
		var _self = this;
		if (!this._oPopover) {
			this._oPopover = sap.ui
					.xmlfragment(
							"airbus.mes.disruptions.Dialog",
							airbus.mes.disruptions.oView.createDisruption
									.getController());
			this.getView().addDependent(this._oPopover);
		}
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function() {
			this._oPopover.openBy(oButton);
		});
		var loAttachmentHeader = sap.ui.getCore().byId("idAttachmentHeader");
		var loModel = sap.ui.getCore().getModel("AttachmentList");
		var loLength = loModel.oData.items.length;
		loAttachmentHeader.setText("Attachments ("+loLength+")");
		
	},

	onPressDeleteButton : function(oEvent) {
		this.getView().byId("idAttachmentTable");
		var sPath = oEvent.mParameters.listItem.oBindingContexts.AttachmentList.sPath;
		var iLength = sPath.length;
		var iIndex = sPath.slice(iLength - 1);

		var oModel = sap.ui.getCore()
				.getModel("AttachmentList")
//		var oData = oModel.oData.Rowsets.Rowset[0];
//		var removed = oData.Row.splice(iIndex, 1);
//		oModel.setData(oData);
//		oModel.refresh();
		
		var oData = oModel.oData;
		var removed = oData.items.splice(iIndex, 1);
		oModel.setData(oData);
		var loAttachmentHeader = sap.ui.getCore().byId("idAttachmentHeader");
		oModel.refresh();
	}
};
