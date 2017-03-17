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
	
	/***************************************************************************
	 * Load Category and custom Data
	 * @param {string} sMode tells it is edit disruption page or new disruption page
	 */
	loadData : function(oData) {

		var ModelManager = airbus.mes.disruptions.ModelManager;
		ModelManager.createViewMode = "Edit";

		var oModel = sap.ui.getCore().getModel("DisruptionDetailModel");
		oModel.setData(oData);
		oModel.refresh();

		// Get View
		var oView = this.getView();
		ModelManager.sCurrentViewId = oView.sId;

		// Set Busy's
		oView.setBusyIndicatorDelay(0);
		oView.setBusy(true);
	

		// Reset All fields
		this.resetAllFields();
		
		this.loadDisruptionCategory();

		
		this.loadRsnResponsibleGrp(oData.messageType);
		this.editPreSettings();
		this.loadAttachedDocument(oData.messageRef);

	},

	/***************************************************************************
	 * Load disruptions detail from message reference
	 **************************************************************************/
	/*loadDisruptionDetail: function(msgRef){
		jQuery.ajax({
			type : 'post',
			url : airbus.mes.disruptions.ModelManager.urlModel.getProperty("getDisruptionDetailsURL"),
			contentType : 'application/json',
			cache : false,
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"messageRef" : msgRef,
				"lang": sap.ui.getCore().byId("globalNavView--SelectLanguage").getSelectedKey()
			}),
			success : function(data) {

				if (typeof data == "string") {
					data = JSON.parse(data);
				}
  				if(data.disruptionComments && data.disruptionComments[0] == undefined){
  					data.disruptionComments = [data.disruptionComments];
  				}
  				
				var oModel = sap.ui.getCore().getModel("DisruptionDetailModel");
				oModel.setData(data);
				oModel.refresh();				
				airbus.mes.disruptiondetail.oView.oController.editPreSettings();
				airbus.mes.disruptiondetail.oView.setBusy(false);
				
				var operation = data.operation.split(",")[1];
				airbus.mes.disruptions.ModelManager.loadMaterialList(data.workOrder, operation);
				airbus.mes.disruptions.ModelManager.loadJigtoolList(data.workOrder, operation);
			},

			error : function(error, jQXHR) {
				airbus.mes.disruptiondetail.oView.setBusy(false);
			}

		});
	},*/
	

	/***************************************************************************
	 * Load Step3 model for create disruption screen (Resolver Names for a
	 * Resolver Group)
	 **************************************************************************/
	loadResolverModel : function(sResolverGroup) {
		var oView = this.getView();

		// Set Busy's
		oView.byId("selectResolver").setBusyIndicatorDelay(0);
		oView.byId("selectResolver").setBusy(true);

		var url = airbus.mes.disruptions.ModelManager.getResolverModelURL(sResolverGroup)
		sap.ui.getCore().getModel("disruptionResolverModel").loadData(url);
		
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
	onUpdateDisruption : function(oEvt) {
		var oView = this.getView();
		var i18nModel = oView.getModel("i18nModel");
		var sComment = airbus.mes.disruptions.Formatter.actions.update+this.getView().byId("comment").getValue();
		var resolverId = this.getView().byId("selectResolver").getSelectedKey()
		var resolverGroup = this.getView().byId("selectResponsibleGrp").getSelectedKey();
		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef");
		jQuery
		.ajax({
			url : airbus.mes.disruptions.ModelManager.getUrlupdateDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : sMessageRef,
				"Param.4" : resolverGroup,
				"Param.5" : resolverId,
				"Param.6" : sComment
			},
			error : function(xhr, status, error) {
				airbus.mes.disruptions.func.tryAgainError(i18nModel);
			},
			success : function(result, status, xhr) {

				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

				} else { // Success
					var sMessageSuccess = i18nModel.getProperty("successUpdate");
					airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);
					var currDate = new Date();
					var commentDate = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
					var oUserDetailModel = sap.ui.getCore().getModel("userDetailModel")
					var oComment = {
						"action" : i18nModel.getProperty("update"),
						"comments" : sComment,
						"date" : commentDate,
						"userFullName" : (oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " + oUserDetailModel
							.getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase())
					};
					oView.getModel("DisruptionDetailModel").getProperty("/disruptionComments").push(oComment);
					oView.getModel("DisruptionDetailModel").setProperty("/resolverID",resolverId);
					oView.getModel("DisruptionDetailModel").setProperty("/responsibleGroup",resolverGroup);
					//oView.getModel("DisruptionDetailModel").setProperty("/promisedDateTime", sPromisedDateTime);
					//oView.getModel("DisruptionDetailModel").setProperty("/ResolverName",oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/last_name") + " "	+ oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/first_name"));
					oView.getModel("DisruptionDetailModel").refresh();
					sap.ui.getCore().byId("disruptionDetailView--comment").setValue();
					sap.ui.getCore().byId("disruptionDetailView--selectResolver").setSelectedKey(resolverId);

				}

			}
		})
	},

	onNavBack : function() {
		nav.back();
		airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();
	},
	
	/**
	 * On acknowledge disruption from disruption detail page from desktop MES
	 * @param {object}
	 *            oEvt object of control
	 */
	onAckDisruption : function(oEvt) {
		var oView = this.getView();
		var i18nModel = oView.getModel("i18nModel");
		var sPromisedDateTime = "";
		var oPromisedDateTime
		var date = this.getView().byId("promisedDate").getValue();
		var time = this.getView().byId("promisedTime").getValue();
		if(date == ""){
				airbus.mes.shell.ModelManager.messageShow(i18nModel.getProperty("invalidDateError"));
				return;
		}else{
			if (time == ""){time = "00:00:00";}
			sPromisedDateTime = date + " " + time;
			oPromisedDateTime = new Date(sPromisedDateTime);
			if (oPromisedDateTime == "Invalid Date"){
				airbus.mes.shell.ModelManager.messageShow(i18nModel.getProperty("invalidDateError"));
				return;
			}
			//Check - User can't enter old date time
			if(new Date().getTime() > oPromisedDateTime.getTime()){
				airbus.mes.shell.ModelManager.messageShow(i18nModel.getProperty("errorPrevPromisedDateTime"));
				return;
			}
		}
		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef");

		var comment = airbus.mes.disruptions.Formatter.actions.acknowledge + oView.byId("comment").getValue();
		
		// Call to Acknowledge Disruption
		jQuery
		.ajax({
			url : airbus.mes.disruptions.ModelManager.getUrlToAckDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : sMessageRef,
				"Param.4" : comment,
				"Param.5" : sPromisedDateTime
			},
			error : function(xhr, status, error) {
				airbus.mes.disruptions.func.tryAgainError(i18nModel);
			},
			success : function(result, status, xhr) {

				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

				} else { // Success
					var sMessageSuccess = i18nModel.getProperty("successfulAcknowledge");
					airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);

					// load again disruptions data
					oView.getModel("DisruptionDetailModel").setProperty("/status", airbus.mes.disruptions.Formatter.status.acknowledged);

					var currDate = new Date();
					var commentDate = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
					var oUserDetailModel = sap.ui.getCore().getModel("userDetailModel")
					var oComment = {
						"action" : i18nModel.getProperty("acknowledge"),
						"comments" : comment,
						"date" : commentDate,
						"userFullName" : (oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " + oUserDetailModel
							.getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase())
					};
					oView.getModel("DisruptionDetailModel").getProperty("/disruptionComments").push(oComment);
					oView.getModel("DisruptionDetailModel").setProperty("/promisedDateTime", sPromisedDateTime);
					//oView.getModel("DisruptionDetailModel").setProperty("/ResolverName",oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/last_name") + " "	+ oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/first_name"));
					oView.getModel("DisruptionDetailModel").refresh();
					sap.ui.getCore().byId("disruptionDetailView--comment").setValue();
					sap.ui.getCore().byId("disruptionDetailView--selectResolver").setSelectedKey(sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"));

				}

			}
		})
		

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
		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef");
		var sStatus = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/status");
		var oView = this.getView();
		jQuery.ajax({
			url :  airbus.mes.disruptions.ModelManager.getUrlToRejectDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : sMessageRef,
				"Param.4" : sComment,
				"Param.5" : sStatus
			},
			error : function(xhr, status, error) {

				airbus.mes.disruptions.__enterCommentDialogue.setBusy(false);
				airbus.mes.disruptions.func.tryAgainError(i18nModel);

			},
			success : function(result, status, xhr) {
				
				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

				} else { // Success
					var sMessageSuccess = i18nModel.getProperty("successReject");
					airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);
					var currDate = new Date();
					var commentDate = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
					var oUserDetailModel = sap.ui.getCore().getModel("userDetailModel")
					var oComment = {
						"action" : i18nModel.getProperty("rejected"),
						"comments" : sComment,
						"date" : commentDate,
						"userFullName" : (oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " + oUserDetailModel
							.getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase())
					};
					oView.getModel("DisruptionDetailModel").setProperty("/status", airbus.mes.disruptions.Formatter.status.rejected);
					oView.getModel("DisruptionDetailModel").getProperty("/disruptionComments").push(oComment);
					//oView.getModel("DisruptionDetailModel").setProperty("/ResolverName",oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/last_name") + " "	+ oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/first_name"));
					oView.getModel("DisruptionDetailModel").refresh();
					sap.ui.getCore().byId("disruptionDetailView--comment").setValue();

				}
			}
		});

	},
	
	/***************************************************************************
	 * solve the Disruption MESV1.5
	 * 
	 * @param {object}
	 *            oEvt object of control
	 */
	onMarkSolvedDisruption : function(oEvt) {
		var i18nModel = this.getView().getModel("i18nModel");
		var oView = this.getView();
		var sComment;
		if (this.getView().byId("comment").getValue() == "") {
			sap.m.MessageToast.show(i18nModel.getProperty("plsEnterSolution"));
			return;
		} else {
			sComment = airbus.mes.disruptions.Formatter.actions.solve + this.getView().byId("comment").getValue();
		}
		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef");
		// Call to Mark Solved Disruption
		
		jQuery.ajax({
			url : airbus.mes.disruptions.ModelManager.getUrlToMarkSolvedDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : sMessageRef,
				"Param.4" : sComment
			},
			error : function(xhr, status, error) {

				airbus.mes.shell.ModelManager.messageShow(i18nModel.getProperty("tryAgain"));
			},
			success : function(result, status, xhr) {
				
				
				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

				} else { // Success					
					var sMessageSuccess = i18nModel.getProperty("successSolved");
					airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);
					// load again disruptions data
					oView.getModel("DisruptionDetailModel").setProperty("/status", airbus.mes.disruptions.Formatter.status.solved);

					var currDate = new Date();
					var commentDate = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
					var oUserDetailModel = sap.ui.getCore().getModel("userDetailModel")
					var oComment = {
						"action" : i18nModel.getProperty("acknowledge"),
						"comments" : comment,
						"date" : commentDate,
						"userFullName" : (oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " + oUserDetailModel
							.getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase())
					};
					oView.getModel("DisruptionDetailModel").getProperty("/disruptionComments").push(oComment);
					
					
					//oView.getModel("DisruptionDetailModel").setProperty("/ResolverName",oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/last_name") + " "	+ oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/first_name"));
					oView.getModel("DisruptionDetailModel").refresh();
					sap.ui.getCore().byId("disruptionDetailView--comment").setValue();
					//sap.ui.getCore().byId("disruptionDetailView--selectResolver").setSelectedKey(sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"));

					
				}
			}
		});
	},
	/***************************************************************************
	 * Refuse the Disruption MESV1.5
	 * 
	 * @param {object}
	 *            oEvt object of control
	 */
	onRefuseDisruption : function() {
		var sComment;
		var i18nModel = this.getView().getModel("i18nModel");
		var oView = this.getView();
		if (this.getView().byId("comment").getValue() == "") {
			sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
			return;
		} else {
			sComment = airbus.mes.disruptions.Formatter.actions.refuse + this.getView().byId("comment").getValue();
		}

		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef");
		// Call Disruption Service
		 
		jQuery.ajax({
			url :airbus.mes.disruptions.ModelManager.getUrlToRefuseDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sMessageRef,
				"Param.3" : sComment,
				"Param.4" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user")
			},
			error : function(xhr, status, error) {
				airbus.mes.disruptions.func.tryAgainError(i18nModel);

			},
			success : function(result, status, xhr) {
				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

				} else { // Success
					
					var sMessageSuccess = i18nModel.getProperty("successRefused");
					airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);
					
					oView.getModel("DisruptionDetailModel").setProperty("/status", airbus.mes.disruptions.Formatter.status.pending);

					var currDate = new Date();
					var commentDate = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
					var oUserDetailModel = sap.ui.getCore().getModel("userDetailModel")
					var oComment = {
						"action" : i18nModel.getProperty("acknowledge"),
						"comments" : comment,
						"date" : commentDate,
						"userFullName" : (oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " + oUserDetailModel
							.getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase())
					};
					oView.getModel("DisruptionDetailModel").getProperty("/disruptionComments").push(oComment);					
					oView.getModel("DisruptionDetailModel").refresh();
					sap.ui.getCore().byId("disruptionDetailView--comment").setValue();				
				}

			}
		});
	},
	 onCloseDisruption : function(oEvt) {
		 	var sComment;
			var i18nModel = this.getView().getModel("i18nModel");
			var oView = this.getView();
			sComment = airbus.mes.disruptions.Formatter.actions.refuse + this.getView().byId("comment").getValue();
			var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef");
			var timeLostValue = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/timeLost");
			  // Call Close Disruption Service
            jQuery.ajax({
                   url : airbus.mes.disruptions.ModelManager.getUrlToCloseDisruption(),
                   data : {
                          "Param.1" : airbus.mes.settings.ModelManager.site,
                          "Param.2" : sap.ui.getCore().getModel(
                                        "userSettingModel").getProperty(
                                        "/Rowsets/Rowset/0/Row/0/user"),
                          "Param.3" : sMessageRef,
                          "Param.4" : sComment,
                          "Param.5" : timeLostValue
                   },
                   error : function(xhr, status, error) {
                   	airbus.mes.operationdetail.oView.setBusy(false);
          				airbus.mes.disruptions.func.tryAgainError();

                   },
                   success : function(result, status, xhr) {

                          
                          
                          if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined &&
                                 result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
                       	   
                                 airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message)

                          } else {
                                 var message = i18nModel.getProperty("successClosed");
                                 airbus.mes.shell.ModelManager.messageShow(message);
                                 
                                 oView.getModel("DisruptionDetailModel").setProperty("/status", airbus.mes.disruptions.Formatter.status.closed);

                                var currDate = new Date();
             					var commentDate = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
             					var oUserDetailModel = sap.ui.getCore().getModel("userDetailModel")
             					var oComment = {
             						"action" : i18nModel.getProperty("acknowledge"),
             						"comments" : comment,
             						"date" : commentDate,
             						"userFullName" : (oUserDetailModel.getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " + oUserDetailModel
             							.getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase())
             					};
             					oView.getModel("DisruptionDetailModel").getProperty("/disruptionComments").push(oComment);					
             					oView.getModel("DisruptionDetailModel").refresh();
             					sap.ui.getCore().byId("disruptionDetailView--comment").setValue();	
                                 
      
                          }

                   }
            });
	 }
	 
	
});
