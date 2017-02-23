"use strict";
//Require the base first
jQuery.sap.require("airbus.mes.disruptions.createDisruptions");

airbus.mes.disruptions.createDisruptions.extend("airbus.mes.disruptiondetail.disruptionDetail", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf airbus.mes.components.disruptions.CreateDisruption
	 */
	onInit : function() {
		this.getView().byId("timeLost").setPlaceholder(airbus.mes.disruptions.Formatter.getConfigTimeFullUnit());
	},


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
	

	/***************************************************************************
	 * From Disruption Detail Screen - Hide Comment Box to Add Comments
	 * 
	 * @param {object}
	 *            oEvt take event triggering control as an input
	 */
	hideCommentBox : function(oEvt) {
		this.getView().byId("commentBox").setVisible(false);
	},

	/***************************************************************************
	 * From Disruption Detail Screen - Submit Disruption Comment
	 * 
	 * @param {object}
	 *            oEvt take event triggering control as an input
	 */
	submitComment : function(oEvt) {

		var status = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("Status");

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {

			sap.m.MessageToast.show(this.getView().getModel("i18nModel").getProperty("cannotComment"));

			return;
		}

		var path = oEvt.getSource().sId;

		var msgRef = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("MessageRef");

		var listnum = path.split("-");
		listnum = listnum[listnum.length - 1];

		var sComment = airbus.mes.disruptions.Formatter.actions.comment
			+ this.getView().byId(this.getView().sId + "--commentArea-" + this.getView().sId + "--disrptlist-" + listnum).getValue();

		var currDate = new Date();
		var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();

		var oComment = {
			"Action" : this.getView().getModel("i18nModel").getProperty("comment"),
			"Comments" : sComment,
			"Counter" : "",
			"Date" : date,
			"MessageRef" : msgRef,
			"UserFullName" : (sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " + sap.ui
				.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase())
		};

		var i18nModel = this.getView().getModel("i18nModel");

		// Call Add comment Service
		airbus.mes.disruptions.ModelManager.addComment(oComment, i18nModel);

		this.getView().byId(this.getView().sId + "--commentArea-" + this.getView().sId + "--disrptlist-" + listnum).setValue("");
	},

	onNavBack : function() {
		nav.back();
		airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();
	},
	/**
	 * ON acknowledge disruption from disruption detail page from dekstop MES
	 * MESV1.5
	 * 
	 * @param {object}
	 *            oEvt object of control
	 */
	onAckDisruption : function(oEvt) {
		if (this.getView().byId("promisedDate").getValue() == "" || this.getView().byId("promisedTime").getValue() == "") {
			airbus.mes.shell.ModelManager.messageShow(this.getView().getModel("i18nModel").getProperty("emptyPromiseDate"));
			return;
		}

		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/MessageRef");
		// this.getView().byId("promisedDate").setDateValue(new Date());

		var date = this.getView().byId("promisedDate").getValue();

		var obDate = new Date(date);

		// Validate Promised Date Time
		if (obDate == "Invalid Date" || date.length != 10) {
			airbus.mes.shell.ModelManager.messageShow(this.getView().getModel("i18nModel").getProperty("invalidDateError"));

			return;
		}

		// Calculate Promised Date Time
		var time = this.getView().byId("promisedTime").getValue();

		if (time == "")
			time = "00:00:00";

		var dateTime = date + " " + time;

		var comment = airbus.mes.disruptions.Formatter.actions.acknowledge + this.getView().byId("comment").getValue();

		// Call to Acknowledge Disruption
		var bSuccess = airbus.mes.disruptions.ModelManager.ackDisruption(dateTime, sMessageRef, comment);
		
		if (bSuccess) {
            
            this.getView().getModel("DisruptionDetailModel").setProperty("/Status",airbus.mes.disruptions.Formatter.status.acknowledged);
            
            var currDate = new Date();
            var commentDate = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
            
            var oComment = {
                          "Action" : this.getView().getModel("i18nModel").getProperty("acknowledge"),
                          "Comments" : comment,
                          "Counter" : "",
                          "Date" : commentDate,
                          "MessageRef" : sMessageRef,
                          "UserFullName" : ( sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
                                                        sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase() )
            };
            this.getView().getModel("DisruptionDetailModel").getProperty("/comments").push(oComment);
            this.getView().getModel("DisruptionDetailModel").setProperty("/Status",airbus.mes.disruptions.Formatter.status.acknowledged);
            this.getView().getModel("DisruptionDetailModel").setProperty("/PromisedDateTime",dateTime);
            this.getView().getModel("DisruptionDetailModel").refresh();
     }

	},
	/***************************************************************************
	 * Reject the Disruption MESV1.5
	 * 
	 * @param {object}
	 *            oEvt object of control
	 */
	onRejectDisruption : function(oEvt) {
		var i18nModel = this.getView().getModel("i18nModel");
		if (this.getView().byId("comment").getValue() == "") {
			sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
			return;
		} else {
			var sComment = airbus.mes.disruptions.Formatter.actions.reject + this.getView().byId("comment").getValue();
		}
		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/MessageRef");
		var sStatus = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/Status");
		var sMessage = i18nModel.getProperty("successReject");
		airbus.mes.disruptions.ModelManager.rejectDisruption(sComment, sMessageRef, sStatus, sMessage, i18nModel);

	},
	/***************************************************************************
	 * solve the Disruption MESV1.5
	 * 
	 * @param {object}
	 *            oEvt object of control
	 */
	onMarkSolvedDisruption : function(oEvt) {
		var i18nModel = this.getView().getModel("i18nModel");
		if (this.getView().byId("comment").getValue() == "") {
			sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
			return;
		} else {
			this.sComment = airbus.mes.disruptions.Formatter.actions.solve + this.getView().byId("comment").getValue();
		}
		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/MessageRef");
		// Call to Mark Solved Disruption
		airbus.mes.disruptions.ModelManager.markSolvedDisruption(sMessageRef, this.sComment, i18nModel);

	},
	/***************************************************************************
	 * Refuse the Disruption MESV1.5
	 * 
	 * @param {object}
	 *            oEvt object of control
	 */
	onRefuseDisruption : function() {
		var i18nModel = this.getView().getModel("i18nModel");

		if (this.getView().byId("comment").getValue() == "") {
			sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
			return;
		} else {
			this.sComment = airbus.mes.disruptions.Formatter.actions.refuse + this.getView().byId("comment").getValue();
		}

		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/MessageRef");
		var sMessage = i18nModel.getProperty("successRefuse");
		// Call Disruption Service
		airbus.mes.disruptions.ModelManager.refuseDisruption(this.sComment, sMessageRef, sMessage, i18nModel);
	}
	
});
