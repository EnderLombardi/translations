"use strict";
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("airbus.mes.disruptionslist.ViewDisruption", {
	commentPopUpOkEvt : undefined,
	sExpandedPanelPath : undefined,

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf components.disruptions.ViewDisruption
	 */
	// onInit : function() {
	//
	// },
	/**
	 * Similar to onBeforeRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf components.disruptions.ViewDisruption
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf components.disruptions.ViewDisruption
	 */
	/*onAfterRendering : function() {
		
	},*/
	
	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf components.disruptions.ViewDisruption
	 */
	// onExit: function() {
	//
	// },

	/***************************************************************************
	 * Turn buttons on off based on execution mode
	 */
	turnOnOffButtons : function() {
		// Check status of operation - If Complete
		// if operation is not complete complete, we can create a disruption
		var sStatus = sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/status");
		if (sStatus !== airbus.mes.disruptions.Formatter.opStatus.completed) {
			sap.ui.getCore().byId("operationDetailPopup--reportDisruption").setVisible(true);
		}

	},


	/***************************************************************************
	 * Open Pop-Up to ask Time Lost while Closing the Disruption
	 */
	onCloseDisruption : function(oEvt) {
		// Get Fields to Pre-Fill Comment Pop-up
		var sPath = oEvt.getSource().getParent().getParent().getParent().getBindingContext("operationDisruptionsModel").sPath;
		var msgRef = this.getView().getModel("operationDisruptionsModel").getProperty(sPath + "/messageRef");
		var timeLost = this.getView().getModel("operationDisruptionsModel").getProperty(sPath + "/timeLost");

		// Call Close Disruption fragment
		if (!this._closeDialog) {

			this._closeDialog = sap.ui.xmlfragment("airbus.mes.disruptions.fragment.closeDisruption", this);

			var title = this.getView().getModel("i18nModel").getProperty("closeDisruption");

			sap.ui.getCore().byId("disruptionCloseDialogue").setTitle(title);

			this.getView().addDependent(this._closeDialog);

		}

		sap.ui.getCore().byId("closeDisruption-timeLost").setValue(airbus.mes.disruptions.Formatter.timeMillisecondsToConfig(timeLost));
		sap.ui.getCore().byId("closeDisruption-timeLostUnit").setText(airbus.mes.disruptions.Formatter.getConfigTimeUnit());
		sap.ui.getCore().byId("closeDisruption-msgRef").setText(msgRef);
		sap.ui.getCore().byId("closeDisruption-sPath").setText(sPath);
		sap.ui.getCore().byId("closeDisruptionComments").setValue("");

		this._closeDialog.open();
	},

	/***************************************************************************
	 * Close selected disruption
	 */
	onAcceptCloseDisruption : function(oEvent) {

		// close the dialog box
		this._closeDialog.close();

		airbus.mes.operationdetail.oView.setBusy(true);

		// Get values for Ajax Call
		var sMsgRef = sap.ui.getCore().byId("closeDisruption-msgRef").getText();
		var sPath = sap.ui.getCore().byId("closeDisruption-sPath").getText();
		var sComment = airbus.mes.disruptions.Formatter.actions.close + sap.ui.getCore().byId("closeDisruptionComments").getValue();

		var oTimeLost = sap.ui.getCore().byId("closeDisruption-timeLost");
		var timeLostValue = airbus.mes.disruptions.Formatter.timeToMilliseconds(oTimeLost.getValue());

		var i18nModel = airbus.mes.disruptionslist.oView.getModel("i18nModel");

		// Call Close Disruption Service
		jQuery.ajax({
			url : airbus.mes.disruptions.ModelManager.getUrlToCloseDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : sMsgRef,
				"Param.4" : sComment,
				"Param.5" : timeLostValue
			},
			error : function(xhr, status, error) {
				airbus.mes.operationdetail.oView.setBusy(false);
				airbus.mes.disruptions.func.tryAgainError(i18nModel);

			},
			success : function(result, status, xhr) {

				airbus.mes.operationdetail.oView.setBusy(false);

				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {

					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message)

				} else {
					var message = i18nModel.getProperty("successClosed");
					airbus.mes.shell.ModelManager.messageShow(message);

					var operationDisruptionsModel = airbus.mes.disruptionslist.oView.getModel("operationDisruptionsModel");
					
					// No need to keep the panel expanded after closing the disruption
					var oData = sap.ui.getCore().getModel("operationDisruptionsModel").getProperty(sPath);
					oData.expanded 				= "false";
					oData.prevCommentsLoaded	= "false";
					oData.internalPanelExpanded = "false";	
					oData.isCommentsLastUpdated 			= "false";
					sap.ui.getCore().getModel("operationDisruptionsModel").setProperty(sPath, oData);
	  	  				
					airbus.mes.disruptionslist.oView.getController().loadDisruptionDetail(sMsgRef, sPath);

					if (nav.getCurrentPage().sId == "stationTrackerView") {

						airbus.mes.disruptions.ModelManager.checkDisruptionStatus(operationDisruptionsModel);

						// Refresh station tracker
						airbus.mes.shell.oView.getController().renderStationTracker();

					} else if (nav.getCurrentPage().getId() == "disruptiontrackerView")
						airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
				}

			}
		});

	},

	/***************************************************************************
	 * Close Pop-Up - Closing Disruption Pop-Up
	 */
	cancelClosingDisruption : function(oEvent) {
		this._closeDialog.close();
	},

	/***************************************************************************
	 * Open the Enter Comment Pop-Up
	 */
	onOpenDisruptionComment : function(title, msgRef, sPath, okEvent, sStatus) {
		// Call Disruption Comment Pop-up fragment
		if (!airbus.mes.disruptions.__enterCommentDialogue) {
			airbus.mes.disruptions.__enterCommentDialogue = sap.ui.xmlfragment("airbus.mes.disruptions.fragment.commentBoxDisruption", this);
			this.getView().addDependent(airbus.mes.disruptions.__enterCommentDialogue);

		}
		sap.ui.getCore().byId("disruptionCommentDialogue").setTitle(title);
		sap.ui.getCore().byId("disruptionCommentMsgRef").setText(msgRef);
		sap.ui.getCore().byId("disruptionCommentSpath").setText(sPath);

		if (sStatus == undefined)
			sStatus = "";
		sap.ui.getCore().byId("disruptionCommentStatus").setText(sStatus);
		sap.ui.getCore().byId("disruptionCommentBox").setValue("");

		sap.ui.getCore().byId("disruptionCommentOK").detachPress(this.commentPopUpOkEvt);
		sap.ui.getCore().byId("disruptionCommentOK").attachPress(okEvent);
		this.commentPopUpOkEvt = okEvent;

		airbus.mes.disruptions.__enterCommentDialogue.open();
	},

	/***************************************************************************
	 * Close the Enter Comment Pop-Up
	 */
	onCloseDisruptionComment : function(oEvent) {
		sap.ui.getCore().byId("disruptionCommentBox").setValue("");
		airbus.mes.disruptions.__enterCommentDialogue.close();

	},

	/***************************************************************************
	 * Delete the Disruption
	 */
	onDeleteDisruption : function(oEvt) {
		var status = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("status");

		if (status == airbus.mes.disruptions.Formatter.status.acknowledged) {
			sap.m.MessageBox.error(airbus.mes.disruptionslist.oView.getModel("i18nModel").getProperty("disruptionDeleteError"));
		} else {

			var title = this.getView().getModel("i18nModel").getProperty("deleteDisruption");
			var msgRef = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("messageRef");
			var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;

			this.onOpenDisruptionComment(title, msgRef, sPath, this.onConfirmDelete);
		}

	},

	/***************************************************************************
	 * Confirming Delete Disruption
	 */
	onConfirmDelete : function(oEvent) {

		airbus.mes.disruptionslist.oView.setBusy(true);

		var comment = airbus.mes.disruptions.Formatter.actions.del + sap.ui.getCore().byId("disruptionCommentBox").getValue();

		var msgRef = sap.ui.getCore().byId("disruptionCommentMsgRef").getText();
		var sPath = sap.ui.getCore().byId("disruptionCommentSpath").getText();

		var i18nModel = airbus.mes.disruptionslist.oView.getModel("i18nModel");

		// Call Revoke Disruption Service
		jQuery.ajax({
			url : airbus.mes.disruptions.ModelManager.getUrlDeleteDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : msgRef,
				"Param.4" : comment
			},
			error : function(xhr, status, error) {
				airbus.mes.disruptionslist.oView.setBusy(false);
				airbus.mes.disruptions.func.tryAgainError(i18nModel);
			},
			success : function(result, status, xhr) {

				airbus.mes.disruptions.__enterCommentDialogue.close();
				airbus.mes.disruptionslist.oView.setBusy(false);

				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

				} else { // Success

					var sMessageSuccess = i18nModel.getProperty("successDelete");
					airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);

					var operationDisruptionsModel = sap.ui.getCore().getModel("operationDisruptionsModel");

					if (nav.getCurrentPage().sId == "stationTrackerView") {
						var deletedRowIndex = sPath.split("/").slice(-1).pop();
						operationDisruptionsModel.oData.splice(deletedRowIndex, 1);
						operationDisruptionsModel.refresh();
						airbus.mes.disruptions.ModelManager.checkDisruptionStatus(operationDisruptionsModel);

						// Refresh station tracker
						airbus.mes.shell.oView.getController().renderStationTracker();

					} else if (nav.getCurrentPage().getId() == "disruptiontrackerView")
						airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
						airbus.mes.disruptiontracker.detailPopUp.close();

				}

			}
		});

	},

	/***************************************************************************
	 * Reject the Disruption
	 */
	onRejectDisruption : function(oEvt) {
		var title = airbus.mes.disruptionslist.oView.getModel("i18nModel").getProperty("rejectDisruption");
		var msgRef = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("messageRef");
		var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;
		var sStatus = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("status");

		this.onOpenDisruptionComment(title, msgRef, sPath, this.onConfirmRejection, sStatus);

	},

	/***************************************************************************
	 * Confirming Reject Disruption
	 */
	onConfirmRejection : function(oEvent) {
		var i18nModel = airbus.mes.disruptionslist.oView.getModel("i18nModel");

		var comment = airbus.mes.disruptions.Formatter.actions.reject + sap.ui.getCore().byId("disruptionCommentBox").getValue();

		// Comment is mandatory while rejection
		if (comment == "") {
			airbus.mes.shell.ModelManager.messageShow(i18nModel.getProperty("plsEnterComment"));
			return;
		}

		var sPath = sap.ui.getCore().byId("disruptionCommentSpath").getText();
		var msgRef = sap.ui.getCore().byId("disruptionCommentMsgRef").getText();
		var sStatus = sap.ui.getCore().byId("disruptionCommentStatus").getText();

		// Call Reject disruption Service
		airbus.mes.disruptions.ModelManager.rejectDisruption(comment, msgRef, sStatus, sPath, i18nModel);
	},

	/***************************************************************************
	 * Refuse the Disruption
	 */
	onRefuseDisruption : function(oEvt) {
		var title = airbus.mes.disruptionslist.oView.getModel("i18nModel").getProperty("refuseDisruption");
		var msgRef = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("messageRef");
		var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;

		this.onOpenDisruptionComment(title, msgRef, sPath, this.onConfirmRefuse);
	},

	/***************************************************************************
	 * Confirming Refuse Disruption
	 */
	onConfirmRefuse : function(oEvent) {
		var i18nModel = airbus.mes.disruptionslist.oView.getModel("i18nModel");

		var comment = airbus.mes.disruptions.Formatter.actions.refuse + sap.ui.getCore().byId("disruptionCommentBox").getValue();

		if (comment == "") {
			sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
			return;
		}

		var msgRef = sap.ui.getCore().byId("disruptionCommentMsgRef").getText();
		var sPath = sap.ui.getCore().byId("disruptionCommentSpath").getText();
		
		// Call Refuse solution Service
		airbus.mes.disruptions.ModelManager.refuseDisruption(comment, msgRef, sPath, i18nModel);

	},

	/***************************************************************************
	 * Show Comment Box to Add Comments
	 */
	showCommentBox : function(oEvt) {
		var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;
		this.getView().getModel("operationDisruptionsModel").setProperty(sPath + "/commentBoxOpened", "true");
		this.getView().getModel("operationDisruptionsModel").refresh();

	},

	/***************************************************************************
	 * Hide Comment Box to Add Comments
	 */
	hideCommentBox : function(oEvt) {
		var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;
		this.getView().getModel("operationDisruptionsModel").setProperty(sPath + "/commentBoxOpened", "false");
		this.getView().getModel("operationDisruptionsModel").refresh();

	},

	/***************************************************************************
	 * Submit Disruption Comment
	 */
	submitComment : function(oEvt) {
		var status = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("status");

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {

			sap.m.MessageToast.show(this.getView().getModel("i18nModel").getProperty("cannotComment"));
			return;
		}

		var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;
		var sComment = this.getView().getModel("operationDisruptionsModel").getProperty(sPath + "/disruptionNewComment");

		if (sComment == undefined || !sComment.length || sComment.length < 1) {
			sap.m.MessageToast.show(this.getView().getModel("i18nModel").getProperty("plsEnterComment"));
			return;
		}

		sComment = airbus.mes.disruptions.Formatter.actions.comment + sComment;

		var msgRef = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("messageRef");

		// Call Add comment Service
		var i18nModel = airbus.mes.disruptionslist.oView.getModel("i18nModel");
		airbus.mes.disruptions.ModelManager.addComment(sComment, msgRef, sPath, i18nModel);

		this.getView().getModel("operationDisruptionsModel").setProperty(sPath + "/disruptionNewComment", "");
		this.getView().getModel("operationDisruptionsModel").refresh();
	},

	/***************************************************************************
	 * When Acknowledge Button is Pressed
	 */
	onAckDisruption : function(oEvt) {

		// Close Comment Box if open
		var path = oEvt.getSource().sId;
		var listnum = path.split("-");
		listnum = listnum[listnum.length - 1];
		
		var title = this.getView().getModel("i18nModel").getProperty("ackDisruption");
		var msgRef = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("messageRef");

		// Call Acknowledge Disruption fragment
		if (!airbus.mes.disruptions.__enterAckCommentDialogue) {
			airbus.mes.disruptions.__enterAckCommentDialogue = sap.ui.xmlfragment("airbus.mes.disruptions.fragment.ackDisruption", this);
			this.getView().addDependent(airbus.mes.disruptions.__enterAckCommentDialogue);

		}
		sap.ui.getCore().byId("disruptionAckCommentDialogue").setTitle(title);
		
		sap.ui.getCore().byId("disruptionAckDate").setDateValue(new Date());
		sap.ui.getCore().byId("disruptionAckTime").setDateValue();

		sap.ui.getCore().byId("disruptionAckMsgRef").setText(msgRef);

		sap.ui.getCore().byId("disruptionAckSpath").setText(oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath);

		sap.ui.getCore().byId("disruptionAckComment").setValue("");

		airbus.mes.disruptions.__enterAckCommentDialogue.open();
	},

	/***************************************************************************
	 * When Comment is Added to Acknowledge Disruption
	 */
	onAcceptAckDisruptionComment : function() {
		var oView = airbus.mes.disruptionslist.oView;
		var sPromisedDateTime = "";

		var date = sap.ui.getCore().byId("disruptionAckDate").getValue();
		var time = sap.ui.getCore().byId("disruptionAckTime").getValue();
		if(date != ""){

			if (time == ""){time = "00:00:00";}
			
			sPromisedDateTime = date + " " + time;
			
			var oPromisedDateTime = new Date(sPromisedDateTime);

			// Validate Promised Date Time
			if (oPromisedDateTime == "Invalid Date"){
				airbus.mes.shell.ModelManager.messageShow(
					oView.getModel("i18nModel").getProperty("invalidDateError"));
				return;
			}
			
			//Check - User can't enter old date time
			if(new Date().getTime() > oPromisedDateTime.getTime()){
				airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("errorPrevPromisedDateTime"));
				return;
			}
		}
		

		// Set Busy
		airbus.mes.disruptions.__enterAckCommentDialogue.setBusyIndicatorDelay(0);
		airbus.mes.disruptions.__enterAckCommentDialogue.setBusy(true);

		var sPath = sap.ui.getCore().byId("disruptionAckSpath").getText();
		
		var msgRef = sap.ui.getCore().byId("disruptionAckMsgRef").getText();

		var comment = airbus.mes.disruptions.Formatter.actions.acknowledge + sap.ui.getCore().byId("disruptionAckComment").getValue();

		// Call to Acknowledge Disruption
		var i18nModel = oView.getModel("i18nModel");
		airbus.mes.disruptions.ModelManager.ackDisruption(sPromisedDateTime, msgRef, comment, sPath, i18nModel);

	},

	/***************************************************************************
	 * Close the Acknowledge Pop-Up
	 */
	onCloseAckDisruptionComment : function(oEvent) {

		sap.ui.getCore().byId("disruptionAckDate").setValue("");
		sap.ui.getCore().byId("disruptionAckTime").setValue("");
		sap.ui.getCore().byId("disruptionAckComment").setValue("");
		airbus.mes.disruptions.__enterAckCommentDialogue.close();

	},

	onMarkSolvedDisruption : function(oEvt) {

		var title = this.getView().getModel("i18nModel").getProperty("markSolvedDisruption");
		var msgRef = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("messageRef");
		var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;

		this.onOpenDisruptionComment(title, msgRef, sPath, this.onMarkSolvedDisruptionComment);

	},

	/***************************************************************************
	 * When Comment is Submitted to Mark Solved Disruption
	 */
	onMarkSolvedDisruptionComment : function() {

		var i18nModel = airbus.mes.disruptionslist.oView.getModel("i18nModel");
		
		//Comment is mandatory while solving
		var sComment = sap.ui.getCore().byId("disruptionCommentBox").getValue();
		if (sComment == "") {
			airbus.mes.shell.ModelManager.messageShow(i18nModel.getProperty("plsEnterComment"));
			return;
		}
		sComment = airbus.mes.disruptions.Formatter.actions.solve + sComment;


		var msgRef = sap.ui.getCore().byId("disruptionCommentMsgRef").getText();
		var sPath = sap.ui.getCore().byId("disruptionCommentSpath").getText();
		
		// Call to mark solve service
		airbus.mes.disruptions.ModelManager.markSolvedDisruption(msgRef, sComment, sPath, i18nModel);

	},

	/***************************************************************************
	 * When Comment is Submitted to Escalate Disruption
	 */
	onEscalateDisruptionComment : function(oEvt) {

		var title = airbus.mes.disruptionslist.oView.getModel("i18nModel").getProperty("escalateDisruption");

		var msgRef = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("messageRef");

		var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;

		this.onOpenDisruptionComment(title, msgRef, sPath, this.onEscalateDisruption);

	},

	onEscalateDisruption : function(oEvent) {
		
		// Set Busy
		airbus.mes.disruptions.__enterCommentDialogue.setBusyIndicatorDelay(0);
		airbus.mes.disruptions.__enterCommentDialogue.setBusy(true);

		var msgRef = sap.ui.getCore().byId("disruptionCommentMsgRef").getText();
		var sPath = sap.ui.getCore().byId("disruptionCommentSpath").getText();

		var sComment = airbus.mes.disruptions.Formatter.actions.escalation + sap.ui.getCore().byId("disruptionCommentBox").getValue();

		var i18nModel = airbus.mes.disruptionslist.oView.getModel("i18nModel");

		// Set Busy
		airbus.mes.disruptions.__enterCommentDialogue.setBusyIndicatorDelay(0);
		airbus.mes.disruptions.__enterCommentDialogue.setBusy(true);
		
		// Call Escalate Service
		jQuery.ajax({
			url: airbus.mes.disruptions.ModelManager.getUrlOnEscalate(),
			data: {
				"Param.1": airbus.mes.settings.ModelManager.site,
				"Param.2": msgRef,
				"Param.3": sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.4": sComment
			},
			type: 'POST',
			error: function (xhr, status, error) {

				airbus.mes.disruptions.__enterCommentDialogue.setBusy(false);
				airbus.mes.disruptions.func.tryAgainError(i18nModel);

			},
			success: function (result, status, xhr) {
				airbus.mes.disruptions.__enterCommentDialogue.setBusy(false);

				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

				} else { // Success
					airbus.mes.disruptions.__enterCommentDialogue.close();
					airbus.mes.shell.ModelManager.messageShow(i18nModel.getProperty("successfulEscalation"));

					airbus.mes.disruptionslist.oView.getController().loadDisruptionDetail(msgRef, sPath);

					// Refresh station tracker
					if (nav.getCurrentPage().getId() == "stationtrackerView")
						airbus.mes.shell.oView.getController().renderStationTracker();

					// Set Refresh disruption tracker flag
					else if (nav.getCurrentPage().getId() == "disruptiontrackerView")
						airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;

				}
			}
		});;

	},



	/***************************************************************************
	 * Edit Disruption
	 */
	onEditDisruption : function(oEvent) {

		// Set the data for this new model from the already loaded model
		var oBindingContext = oEvent.getSource().getBindingContext("operationDisruptionsModel");
		var oData = oBindingContext.getProperty(oBindingContext.sPath);

		// Navigate to Edit Screen
		airbus.mes.shell.util.navFunctions.createDisruptionScreen(this.getView().getParent(),
			{
				mode : "Edit",
				oData : oData
			},
			sap.ui.getCore().byId("operationDetailPopup--btnCreateDisruption"), // Create Button
			sap.ui.getCore().byId("operationDetailPopup--btnUpdateDisruption"), // Update Button
			sap.ui.getCore().byId("operationDetailPopup--btnCancelDisruption") // Cancel Button
		);
	},
	

	 /***************************************************************************
	  * Call Report Disruption Screen
	  */
	  onReportDisruption : function(oEvent) {
		  
		  airbus.mes.shell.util.navFunctions.createDisruptionScreen(
			  sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer"),
			  {mode: "Create", oData: {}},
			  sap.ui.getCore().byId("operationDetailPopup--btnCreateDisruption"), // Create Button
			  sap.ui.getCore().byId("operationDetailPopup--btnUpdateDisruption"), // Update Button
			  sap.ui.getCore().byId("operationDetailPopup--btnCancelDisruption"),  // Cancel Button
			  sap.ui.getCore().byId("operationDetailPopup--reportandCloseDisruption")   //create and close button
		  );
	         
	       // Destroying Material List dialog which might have already loaded and will show inconsistent data otherwise
	       if(sap.ui.getCore().byId("createDisruptionView").oController._materialListDialog){
	    	   sap.ui.getCore().byId("createDisruptionView").oController._materialListDialog.destroy(false);
	    	   sap.ui.getCore().byId("createDisruptionView").oController._materialListDialog = undefined;
	       }
	       if(sap.ui.getCore().byId("createDisruptionView").oController.jigToolSelectDialog){
	    	   sap.ui.getCore().byId("createDisruptionView").oController.jigToolSelectDialog.destroy(false);
	    	   sap.ui.getCore().byId("createDisruptionView").oController.jigToolSelectDialog = undefined;
	       }
	  },

      /***********************************************************
      * Close other panels when one panel is expanded
      */
      handleDisruptionPanelExpand : function(oEvent) {
    	  var oPanel = oEvent.oSource.getParent().getParent();
    	  if(oPanel.getExpanded()){
    		  return;
    	  }
    	  
    	  var oView = this.getView();
    	  
    	  // Close previously expanded panel
    	  if(this.sExpandedPanelPath != undefined){
    		  oView.getModel("operationDisruptionsModel").setProperty(this.sExpandedPanelPath + "/expanded", "false");
    	  }
    		  
    	  var sPath = oEvent.getSource().getBindingContext("operationDisruptionsModel").sPath;
          oView.getModel("operationDisruptionsModel").setProperty(sPath+"/expanded", "true");
          oView.getModel("operationDisruptionsModel").refresh();
          this.sExpandedPanelPath = sPath;
          
          var messageRef = oView.getModel("operationDisruptionsModel").getProperty(sPath+"/messageRef");
          
          // Load detailed data
          this.loadDisruptionDetail(messageRef, sPath);
          
          
          //Mark message as read
          if(oView.getModel("operationDisruptionsModel").getProperty(sPath+"/isCommentsLastUpdated") == "true"){
        	  	var urlToCreateMsgLogCode = airbus.mes.disruptions.ModelManager.urlModel.getProperty("urlCreateMsgLogCode");
      			jQuery.ajax({
      				cache : false,
      				url : urlToCreateMsgLogCode,
      				type : 'POST',
      				data : {
      					"Param.1" : airbus.mes.settings.ModelManager.site,
      					"Param.2" : messageRef,
      					"Param.3" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
      					"Param.4" : "READ",
      				}      			
      			});	
      			oView.getModel("operationDisruptionsModel").setProperty(sPath+"/isCommentsLastUpdated", "false");
          }
      },
      handleDisruptionPanelCollapse: function(){
    	  this.getView().getModel("operationDisruptionsModel").setProperty(this.sExpandedPanelPath+"/expanded", "false");
    	  this.sExpandedPanelPath = undefined;
      },
      onInternalPanelexpand:function(oEvt){
    	  var sPath = oEvt.getSource().getParent().getParent().getBindingContext("operationDisruptionsModel").sPath;
    	  this.getView().getModel("operationDisruptionsModel").setProperty(sPath+"/internalPanelExpanded", "true");
      },
      onInternalPanelCollapse:function(oEvt){
    	  var sPath = oEvt.getSource().getParent().getParent().getBindingContext("operationDisruptionsModel").sPath;
    	  this.getView().getModel("operationDisruptionsModel").setProperty(sPath+"/internalPanelExpanded", "false");
    	  
      },
      
      
      /***************************************************************************
       * Load previsous messages to the selected disruption
       */
      seeMoreMesssages : function(oEvt) {

    	  var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;

    	  // Update binding inorder to hide the see more button
    	  this.getView().getModel("operationDisruptionsModel").setProperty(sPath + "/prevCommentsLoaded", "true");
    	  //this.getView().getModel("operationDisruptionsModel").refresh();
      },

      /***************************************************************************
       * Hide previsous messages to the selected disruption
       */
      seeLessMesssages : function(oEvt) {

    	  var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;
    	  
    	  // Update binding inorder to un-hide the see more button
    	  this.getView().getModel("operationDisruptionsModel").setProperty(sPath + "/prevCommentsLoaded", "false");
    	  //this.getView().getModel("operationDisruptionsModel").refresh();
      },

      /***************************************************************************
       * Open Attachment linked to a disruptions
       */
      viewAttachments : function(oEvt) {
    	  airbus.mes.shell.util.navFunctions.disruptionAttachment(this.getView().oParent);
      },
  	
  	/***************************************************************************
  	 * Load disruptions detail from message reference
  	 **************************************************************************/
  	loadDisruptionDetail: function(msgRef, sPath){
  		sap.ui.getCore().getModel("operationDisruptionsModel").setProperty(sPath+"/itemBusy","true");
  		jQuery.ajax({
  			type : 'post',
  			url : airbus.mes.disruptions.ModelManager.urlModel.getProperty("getDisruptionDetailsURL"),
  			contentType : 'application/json',
  			cache : false,
  			data : JSON.stringify({
  				"site" : airbus.mes.settings.ModelManager.site,
  				"messageRef" : msgRef,
  				"forMobile" : false
  			}),
  			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
  				
  				// No need to keep the panel expanded after closing the disruption
  				data.expanded 				= sap.ui.getCore().getModel("operationDisruptionsModel").getProperty(sPath+"/expanded");
  				data.prevCommentsLoaded		= sap.ui.getCore().getModel("operationDisruptionsModel").getProperty(sPath+"/prevCommentsLoaded");
  				data.internalPanelExpanded  = sap.ui.getCore().getModel("operationDisruptionsModel").getProperty(sPath+"/internalPanelExpanded");	
  				data.isCommentsLastUpdated 			= sap.ui.getCore().getModel("operationDisruptionsModel").getProperty(sPath+"/isCommentsLastUpdated");	
  				
  				if(data.disruptionComments && data.disruptionComments[0] == undefined){
  					data.disruptionComments = [data.disruptionComments];
  				}
  				
  				sap.ui.getCore().getModel("operationDisruptionsModel").setProperty(sPath,data);
  			},

  			error : function(error, jQXHR) {
  				sap.ui.getCore().getModel("operationDisruptionsModel").setProperty(sPath+"/itemBusy","false");
  			}

  		});
  	},
  	

	/***********************
	 * value in time lost should't be greater than four
	 * Mesv1.5 defect correction
	 */
	liveChangeTimeLost:function(oEvt){
		var oView = airbus.mes.disruptionslist.oView;
		if(oEvt.getParameters().value.length == 4){
			this.sTimeLost = oEvt.getSource().getValue();
			return;
		} else if(oEvt.getParameters().value.length >4){
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("fourDigitsOnly"));
			oEvt.getSource().setValue(this.sTimeLost);
			return;
		}
	},

});
