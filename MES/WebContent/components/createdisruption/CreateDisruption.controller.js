"use strict";
//require the base first
jQuery.sap.require("airbus.mes.disruptions.createDisruptions");

airbus.mes.disruptions.createDisruptions.extend("airbus.mes.createdisruption.CreateDisruption", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf airbus.mes.components.disruptions.CreateDisruption
	 */
	/*
	 * onInit : function() { // this.loadDisruptionCustomData();
	 * this.addParent(this.selectTree, undefined); },
	 */
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf airbus.mes.components.disruptions.CreateDisruption
	 */
	// onBeforeRendering: function() {
	//
	// },
	onInit: function () {
		this.getView().byId("timeLost").setPlaceholder(airbus.mes.disruptions.Formatter.getConfigTimeFullUnit());
	},



	/***************************************************************************
	 * Load Category and custom Data
	 * @param {string} sMode tells it is edit disruption page or new disruption page
	 */
	loadData: function (sMode, oData) {

		airbus.mes.disruptions.ModelManager.createViewMode = sMode;

		var oModel = sap.ui.getCore().getModel("DisruptionDetailModel");
		oModel.setData(oData);
		oModel.refresh();


		// Get View
		var oView = this.getView();
		airbus.mes.disruptions.ModelManager.sCurrentViewId = oView.sId;

		// Set Busy's
		oView.setBusyIndicatorDelay(0);
		oView.setBusy(true);

		var ModelManager = airbus.mes.disruptions.ModelManager;
		ModelManager.createViewMode = sMode;

		// Reset All fields
		this.resetAllFields();

		this.loadDisruptionCategory();
		ModelManager.loadMaterialList();
		ModelManager.loadJigtoolList();

		if (sMode == "Create") {
			this.createDisruptionSettings();

		} else if (sMode == "Edit") {
			this.loadRsnResponsibleGrp(oData.messageType);
			this.editPreSettings();

		}

	},


	onExit: function (oEvt) {
		sap.ui.getCore().byId("idAttachmentDialog").close()
	},

	onAttachPress: function () {
		sap.ui.getCore().byId("idAttachmentDialog").close()
	},

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
	},

	onEditPress: function (oEvent) {
		var sPath = oEvent.oSource.oParent.oPropagatedProperties.oBindingContexts.DesktopFilesModel.sPath;
		var iIndex = sPath.split("/")[1];
		
		this.onEditMode(iIndex,true);
	},

	onCancelPress: function (oEvent) {
		var sPath = oEvent.oSource.oParent.oPropagatedProperties.oBindingContexts.DesktopFilesModel.sPath;
		var iIndex = sPath.split("/")[1];
		this.onEditMode(iIndex,false);
	},

	onSaveEditPress: function (oEvent) {
		var sPath = oEvent.oSource.oParent.oPropagatedProperties.oBindingContexts.DesktopFilesModel.sPath;
		var iIndex = sPath.split("/")[1];
		this.onEditMode(iIndex,false);
	},

	onEditMode(iIndex, isEdit) {
		this.getView().byId('createDisruptionView--document-button-createDisruptionView--idListDocument-' + iIndex).setVisible(!isEdit);
		this.getView().byId('createDisruptionView--document-button-edit-createDisruptionView--idListDocument-' + iIndex).setVisible(isEdit);
		this.getView().byId('createDisruptionView--document-description-createDisruptionView--idListDocument-' + iIndex).setVisible(!isEdit);
		this.getView().byId('createDisruptionView--document-description-input-createDisruptionView--idListDocument-' + iIndex).setVisible(isEdit);
	}

});
