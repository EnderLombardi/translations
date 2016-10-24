//jQuery.sap.require("airbus.mes.stationtracker.util.Formatter");

sap.ui.controller("airbus.mes.operationdetail.progressSlider", {
	reasonCodeText : undefined,
	operationStatus : undefined,

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf components.stationtracker.stationtracker
	 */
	onInit : function() {
		
		
		
					
	},
	expandOperationDetailPanel : function(oEvent) {
		var toggleButton = this.getView().byId("opDetailExpandButton");
		toggleButton.setVisible(!toggleButton.getVisible());
		
		this.getView().byId("operationDetailPanel")
				.setExpanded();
	},
	/* increase or decrease Progress Functions */

	addProgress : function() {
		oProgressSlider = this.getView().byId("progressSlider");
		oProgressSlider.stepUp(1);
	},

	reduceProgress : function() {
		oProgressSlider = this.getView().byId("progressSlider");
		oProgressSlider.stepDown(1);
	},
	
	/*****************************************************************************************
	 * 
	 * activate pause or confirm operation
	 * 
	 *****************************************************************************************/
	activateOperation : function() {

		var data = this.getView().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0];
		var sMessage = this.getView().getModel("i18n")
				.getProperty("SuccessfulActivation");
		var flag_success;
		jQuery
				.ajax({
					url : airbus.mes.operationdetail.ModelManager
							.getUrlStartOperation(data),
					async : false,
					error : function(xhr, status, error) {
						airbus.mes.operationdetail.ModelManager
								.messageShow("Error");
					},
					success : function(result, status, xhr) {

						if (result.Rowsets.Rowset[0].Row[0].Message_Type == undefined) {
							airbus.mes.operationdetail.ModelManager
									.messageShow(sMessage);
							flag_success = true;
						} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
							airbus.mes.operationdetail.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
							flag_success = false;
						} else {
							airbus.mes.operationdetail.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
							flag_success = true;
						}

					}
				});

		// Refresh User Operation Model and Operation Detail
		airbus.mes.operationdetail.ModelManager.loadUserOperationsModel();
		
		//this.refreshOperationData();

		if (flag_success == true) {
			this.setProgressScreenBtn(true, true, false);
			this.getView().byId("progressSlider").setEnabled(
					true);
			this.getView().byId("operationStatus").setText(
					this.getView().getModel("i18n")
							.getProperty("in_progress"));
		}
	},
	pauseOperation : function() {
		var data = this.getView().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0];
		var sMessage = this.getView().getModel("i18n")
				.getProperty("SuccessfulPause");

		jQuery
				.ajax({
					url : airbus.mes.operationdetail.ModelManager
							.getUrlPauseOperation(data),
					async : false,
					error : function(xhr, status, error) {
						airbus.mes.operationdetail.ModelManager
								.messageShow("Error");

					},
					success : function(result, status, xhr) {

						if (result.Rowsets.Rowset[0].Row[0].Message_Type == undefined) {
							airbus.mes.operationdetail.ModelManager
									.messageShow(sMessage);
							flag_success = true;
						} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
							airbus.mes.operationdetail.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
							flag_success = false;
						} else {
							airbus.mes.operationdetail.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
							flag_success = true;
						}

					}
				});

		// Refresh User Operation Model and Operation Detail
		airbus.mes.operationdetail.ModelManager
				.loadUserOperationsModel();
		//this.refreshOperationData();

		if (flag_success == true) {
			this.setProgressScreenBtn(false, false, true);
			this.getView().byId("progressSlider").setEnabled(
					false);
			this.getView().byId("btnActivate")
					.setType("Accept");
			this.getView().byId("operationStatus").setText(
					this.getView().getModel("i18n")
							.getProperty("paused"));
		}

	},

	confirmOperation : function(oEvent) {

		if (oEvent.getSource().getText() == this.getView()
				.getModel("i18n").getProperty("confirm")) {
			if (!this._reasonCodeDialog) {

				this._reasonCodeDialog = sap.ui
						.xmlfragment(
								"airbus.mes.operationdetail.fragments.reasonCode",
								this);

				this.getView().addDependent(
						this._reasonCodeDialog);
				// click on confirm
				this.operationStatus = "C";
			}
			this._reasonCodeDialog.open();
		} else if (oEvent.getSource().getText() == this
				.getView().getModel("i18n").getProperty(
						"complete")) {
			if (!this._oUserConfirmationDialog) {

				this._oUserConfirmationDialog = sap.ui
						.xmlfragment(
								"airbus.mes.operationdetail.fragments.userConfirmation",
								this);

				this.getView().addDependent(
						this._oUserConfirmationDialog);
				// click on complete
				this.operationStatus = "X";
			}
			this._oUserConfirmationDialog.open();

		}
	},
	/***************************************************************************************************
	 * 
	 * User Confirmation Dialog Methods
	 * 
	 ************************************************************************************************/
	onCancelConfirmation : function() {
		this._oUserConfirmationDialog.close();
		sap.ui.getCore().byId("msgstrpConfirm").setVisible(
				false);
	},

	onOKConfirmation : function(oEvent) {

		var user = sap.ui.getCore().byId(
				"userNameForConfirmation").getValue();
		var pass = sap.ui.getCore().byId(
				"passwordForConfirmation").getValue();
		
		var sMessageSuccess = this.getView().getModel("i18n").getProperty("SuccessfulConfirmation");
		var sMessageError = this.getView().getModel("i18n").getProperty("ErrorDuringConfirmation");
		

		if (user == "" || pass == "") {
			sap.ui.getCore().byId("msgstrpConfirm").setVisible(
					true);
			sap.ui.getCore().byId("msgstrpConfirm").setType(
					"Error");
			sap.ui.getCore().byId("msgstrpConfirm").setText(
					this.getView().getModel("i18n")
							.getProperty(
									"CompulsaryConfirmation"));
		} else {
			sap.ui.getCore().byId("msgstrpConfirm").setVisible(
					false);
			var sfc = airbus.mes.operationdetail.ModelManager.sfc;
			if (this.operationStatus == "X")
				var percent = "100"
			else {
				var percent = this.getView().byId(
						"progressSlider").getValue();
			}

			// Call service for Operation Confirmation
			jQuery
					.ajax({
						url : airbus.mes.operationdetail.ModelManager
								.getConfirmationUrl(
										user,
										pass,
										this.operationStatus,
										percent,
										this
												.getView()
												.getModel(
														"operationDetailModel")
												.getProperty(
														"/Rowsets/Rowset/0/Row/0/sfc_step_ref"),
										this.reasonCodeText),
						async : false,
						error : function(xhr, status, error) {
							airbus.mes.operationdetail.ModelManager
									.messageShow(sMessageError);

						},
						success : function(result, status, xhr) {

							airbus.mes.operationdetail.ModelManager
									.messageShow(sMessageSuccess);

						}
					});

			this._oUserConfirmationDialog.close();

			// Refresh User Operation Model and Operation Detail
			airbus.mes.operationdetail.ModelManager.loadUserOperationsModel();
			
			this.refreshOperationData(percent);

		}
	},
	
	refreshOperationData: function(percentage){
		this.getView().byId("progressSliderfirst").setWidth(percentage+"%");
		this.getView().byId("progressSlider").setWidth((100- parseInt(percentage))+"%");
		
		this.getView().byId("progressSliderfirst").setMax(parseInt(percentage));
		this.getView().byId("progressSlider").setMin(parseInt(percentage));
		
		this.getView().byId("progressSliderfirst").setValue(parseInt(percentage));
		this.getView().byId("progressSlider").setValue(parseInt(percentage));
		

		switch(parseInt(percentage)){
			case 100:
				this.getView().byId("progressSliderfirst").setVisible(true);
				this.getView().byId("progressSlider").setVisible(false);
				break;
			case 0:
				this.getView().byId("progressSliderfirst").setVisible(false);
				this.getView().byId("progressSlider").setVisible(true);
				this.getView().byId("progressSlider").removeStyleClass("dynProgressSlider");
				break;
			default:
				this.getView().byId("progressSliderfirst").setVisible(true);
				this.getView().byId("progressSlider").setVisible(true);
				this.getView().byId("progressSlider").addStyleClass("dynProgressSlider");
				break;
		}
	},
	/***********************************************************
	 * ReasonCode Fragment Methods
	 **********************************************************/

	onSubmitReasonCode : function(oEvent) {
		// store reason Code text
		this.reasonCodeText = sap.ui.getCore().byId(
				"reasonCodeSelectBox").getSelectedKey()
				+ "-"
				+ sap.ui.getCore().byId("reasonCodeComments")
						.getValue()
		// Close reason code dialog
		this._reasonCodeDialog.close();

		if (!this._oUserConfirmationDialog) {

			this._oUserConfirmationDialog = sap.ui
					.xmlfragment(
							"airbus.mes.worktracker.fragments.userConfirmation",
							this);

			this.getView().addDependent(
					this._oUserConfirmationDialog);
		}
		this._oUserConfirmationDialog.open();

	},

	onCancelReasonCode : function() {
		this._reasonCodeDialog.close();
	},
	/***************************************************************************
	 * set Buttons on the screen according to status
	 * 
	 **************************************************************************/
	
	setProgressScreenBtn : function(progressBtnStatus,
			actionBtnStatus, activateBtnStatus) {
		this.getView().byId("btnAdd").setEnabled(
				progressBtnStatus);
		this.getView().byId("btnReduce").setEnabled(
				progressBtnStatus);
		this.getView().byId("btnPause").setVisible(
				actionBtnStatus);
		this.getView().byId("btnConfirm").setVisible(
				actionBtnStatus);
		this.getView().byId("btnComplete").setVisible(
				actionBtnStatus);
		this.getView().byId("btnActivate").setVisible(
				activateBtnStatus);
	},
	
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf components.stationtracker.stationtracker
	 */
	onBeforeRendering : function() {

		//				
	},
	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf components.stationtracker.stationtracker
	 */
	onAfterRendering : function() {
		if (this.getView().byId("operationStatus").getText() === "Not Started"
			|| this.getView().byId("operationStatus")
					.getText() === "Paused") {

		this.setProgressScreenBtn(false, false, true);
		this.getView().byId("progressSlider").setEnabled(
				false);

	} else if (this.getView().byId("operationStatus")
			.getText() === "In Progress") {

		this.setProgressScreenBtn(true, true, false);
		this.getView().byId("progressSlider").setEnabled(
				true);

	} else if (this.getView().byId("operationStatus")
			.getText() === "Blocked"
			|| this.getView().byId("operationStatus")
					.getText() === "Confirmed") {

		this.setProgressScreenBtn(false, false, false);
		this.getView().byId("progressSlider").setEnabled(
				false);
		this.getView().byId("progressSliderfirst")
				.setEnabled(false);

	}

	}

});
