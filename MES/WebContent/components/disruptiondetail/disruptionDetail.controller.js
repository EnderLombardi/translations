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
		this.loadResolverModel(oData.responsibleGroup);
		this.editPreSettings();

		sap.ui.getCore().getModel("DesktopFilesModel").setData([]);
		this.loadAttachedDocument(oData.messageRef);

	},	

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
					airbus.mes.disruptiondetail.oView.oController.sendAttachedDocument(sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef"));


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
					sap.ui.getCore().byId("disruptionDetailView--selectResolver").setSelectedKey(sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"));
					oView.getModel("DisruptionDetailModel").setProperty("/resolverName", sap.ui.getCore().byId("disruptionDetailView--selectResolver").getSelectedItem().getText());
					oView.getModel("DisruptionDetailModel").refresh();
					sap.ui.getCore().byId("disruptionDetailView--comment").setValue();
					airbus.mes.disruptiondetail.oView.oController.sendAttachedDocument(sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef"));
					
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
					airbus.mes.disruptiondetail.oView.oController.sendAttachedDocument(sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef"));

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
					airbus.mes.disruptiondetail.oView.oController.sendAttachedDocument(sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef"));
					
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
					airbus.mes.disruptiondetail.oView.oController.sendAttachedDocument(sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef"));	
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
								airbus.mes.disruptiondetail.oView.oController.sendAttachedDocument(sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/messageRef"));
                          }

                   }
            });
	 },

	 /*********************
	  * Uploadin Part
	  **********************/

	  loadAttachedDocument: function (messageRef) {
		sap.ui.getCore().getModel("DesktopFilesModel").setData([]);
		airbus.mes.disruptions.ModelManager.retrieveDocument(messageRef, function (data) {
			if (data) {
				if (data.listkMResources.length) {
					var list = data.listkMResources;
					var i = list.length - 1;

					for (; i >= 0; i -= 1) {
						var item = list[i];
						var status = item.isDeleted === 'true' ? 'DELETE' : 'UPDATE';
						airbus.mes.disruptiondetail.oView.oController.addUpdateFilesToList(item.fileName, item.fileDescription, item.fileCount, item.fileSize, status);
					}
				} else {
					var item = data.listkMResources;
					var status = item.isDeleted === 'true' ? 'DELETE' : 'UPDATE';
					airbus.mes.disruptiondetail.oView.oController.addUpdateFilesToList(item.fileName, item.fileDescription, item.fileCount, item.fileSize, status);
				}
			}
		});
		var oModel = sap.ui.getCore().getModel("DesktopFilesModel");
		var oData = oModel.getData();
		oData = oData.sort(airbus.mes.shell.util.Formatter.fieldComparator(['fileCount']));
		oModel.setData(oData);
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

	/*
	 * Local json model is maintained to store the list of attachments 
	 * attached from the desktop
	 */
	onUploadComplete: function (filesListBase64) {

		this.removeEditMode();

		var oInput = sap.ui.getCore().byId("idTitleInput");
		var description = oInput.getValue();

		this.addFilesToList(filesListBase64.fileName, description, filesListBase64.fileBase64, filesListBase64.size);
		oInput.destroy();
	},

	/*
	 * Local json model is maintained to store the list of attachments 
	 * attached from the desktop
	 */
	onUploadMediaComplete: function (filesListBase64) {

		var oInputComment = sap.ui.getCore().byId("idCommentInput");
		var oInputName = sap.ui.getCore().byId("idNameInput");
		var description = oInputComment.getValue();
		filesListBase64.fileName = oInputName.getValue() + '.' + filesListBase64.type;
		filesListBase64.size = filesListBase64.size || '';

		this.addFilesToList(filesListBase64.fileName, description, filesListBase64.fileBase64, filesListBase64.size);
		oInputComment.destroy();
		oInputName.destroy();
	},

	addFilesToList: function (fileName, description, fileBase64, size) {
		var oModel = sap.ui.getCore().getModel("DesktopFilesModel");
		var oData = oModel.getData();
		var item = {};
		item.Title = fileName;
		item.Description = description;
		item.oldDescription = description;
		item.File = fileBase64;
		item.Size = size;
		item.fileCount = " ";
		item.Status = 'CREATE';
		oData.unshift(item);
		oModel.refresh();
	},

	addUpdateFilesToList: function (fileName, description, fileCount, size, status) {
		var oModel = sap.ui.getCore().getModel("DesktopFilesModel");
		var oData = oModel.getData();
		var item = {};
		item.Title = fileName;
		item.Description = description;
		item.oldDescription = description;
		item.Size = size*1000;
		item.fileCount = fileCount;
		item.Status = status;
		oData.unshift(item);
		oModel.refresh();
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
					airbus.mes.disruptiondetail.oView.oController.onUploadComplete(filesListBase64);
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
		if (oModel.oData[iIndex].Status === 'UPDATE') {
			oModel.oData[iIndex].Status = 'DELETE';
		} else if (oModel.oData[iIndex].Status === 'CREATE') {
			oModel.oData.splice(iIndex, 1);
		}

		oModel.refresh();
	},

	onEditPress: function (oEvent) {
		var sPath = oEvent.oSource.oParent.oPropagatedProperties.oBindingContexts.DesktopFilesModel.sPath;
		var iIndex = sPath.split("/")[1];
		this.onEditMode(iIndex, true);
	},

	onCancelPress: function (oEvent) {
		var sPath = oEvent.oSource.oParent.oPropagatedProperties.oBindingContexts.DesktopFilesModel.sPath;
		var iIndex = sPath.split("/")[1];
		var oModel = sap.ui.getCore().getModel("DesktopFilesModel");
		var oData = oModel.getData();
		oData[iIndex].Description = oData[iIndex].oldDescription;
		this.onEditMode(iIndex, false);
		oModel.refresh();
	},

	onSaveEditPress: function (oEvent) {
		var sPath = oEvent.oSource.oParent.oPropagatedProperties.oBindingContexts.DesktopFilesModel.sPath;
		var iIndex = sPath.split("/")[1];
		var oModel = sap.ui.getCore().getModel("DesktopFilesModel");
		var oData = oModel.getData();
		oData[iIndex].oldDescription = oData[iIndex].Description;
		this.onEditMode(iIndex, false);
		oModel.refresh();
	},

	onEditMode: function (iIndex, isEdit) {
		this.getView().byId('disruptionDetailView--document-button-disruptionDetailView--idListDocument-' + iIndex).setVisible(!isEdit);
		this.getView().byId('disruptionDetailView--document-button-edit-disruptionDetailView--idListDocument-' + iIndex).setVisible(isEdit);
		this.getView().byId('disruptionDetailView--document-description-disruptionDetailView--idListDocument-' + iIndex).setVisible(!isEdit);
		this.getView().byId('disruptionDetailView--document-description-input-disruptionDetailView--idListDocument-' + iIndex).setVisible(isEdit);
	},

	removeEditMode: function () {
		var oModel = sap.ui.getCore().getModel("DesktopFilesModel");
		var oData = oModel.getData();
		var len = oData.length;
		var i = 0;
		for (; i < len; i += 1) {
			if (oData[i].Status !== 'DELETE') {
				oData[i].Description = oData[i].oldDescription;
				this.onEditMode(i, false);
			}
		}
	},

	sendAttachedDocument: function (ref) {
		var attachedDocumentList = sap.ui.getCore().getModel("DesktopFilesModel").getData();
		var length = attachedDocumentList.length;
		var i = 0;
		for (; i < length; i += 1) {
			var document = attachedDocumentList[i];
			if (document.Status === 'CREATE') {
				airbus.mes.disruptions.ModelManager.attachDocument(ref, document.Title, document.File, document.Description);
			} else if (document.Status === 'UPDATE') {
				airbus.mes.disruptions.ModelManager.updateAttachDocument(ref, document.fileCount, document.Description);
			} else if (document.Status === 'DELETE') {
				airbus.mes.disruptions.ModelManager.deleteAttachDocument(ref, document.fileCount);
			}
		}
	},

	onCameraPress: function (oEvt) {
		var that = this;
		var recorder, videoElement;
		var isRecordingStarted = false;
		var isStoppedRecording = false;

		that.cameraDialog = new sap.m.Dialog({
			title: 'Take a video or a picture',
			content: new sap.m.HBox("video-area"),
			buttons: [
				new sap.m.Button({
					text: 'Record',
					press: function () {
						if (that.cameraDialog.getButtons()[0].getText() === 'Record') {
							launchVideo();
							that.cameraDialog.getButtons()[0].setText('Stop');
						} else {
							stopVideo(function (filesListBase64) {
								that.cameraDialog.close();
								that.openCommentDialog(oEvt, filesListBase64);
							});
							that.cameraDialog.getButtons()[0].setText('Record');
						}

					}
				}),
				new sap.m.Button({
					text: 'Take a Picture',
					press: function () {
						that.cameraDialog.close();
						takePicture(function (filesListBase64) {
							that.openCommentDialog(oEvt, filesListBase64);
						});
					}
				}),
				new sap.m.Button({
					text: 'Cancel',
					press: function () {
						window.localStream.getVideoTracks()[0].stop();
						that.cameraDialog.close();
					}
				})
			],
			afterClose: function () {
				that.cameraDialog.destroy();
			}
		});

		//to get access to the global model
		this.getView().addDependent(that.cameraDialog);


		that.cameraDialog.attachAfterOpen(null, function () {
			var elementToShare = document.getElementById('video-area');
			elementToShare.innerHTML = '<video autoplay style="width:100%; height: 100%; position:absolute;right:0px; top:0px; bottom: 0px; background-color:black;"></video>';
			var canvas2d = document.createElement('canvas');
			var context = canvas2d.getContext('2d');
			canvas2d.width = elementToShare.clientWidth;
			canvas2d.height = elementToShare.clientHeight;
			canvas2d.style.top = 0;
			canvas2d.style.left = 0;
			canvas2d.style.zIndex = -1;
			(document.body || document.documentElement).appendChild(canvas2d);

			(function looper() {
				if (!isRecordingStarted) {
					return setTimeout(looper, 500);
				}
				html2canvas(elementToShare, {
					grabMouse: true,
					onrendered: function (canvas) {
						context.clearRect(0, 0, canvas2d.width, canvas2d.height);
						context.drawImage(canvas, 0, 0, canvas2d.width, canvas2d.height);
						if (isStoppedRecording) {
							return;
						}
						setTimeout(looper, 1);
					}
				});
			})();

			recorder = RecordRTC(canvas2d, {
				type: 'canvas',
				showMousePointer: true
			});

			videoElement = document.querySelector('video');
			videoElement.onloadedmetadata = function () {
				console.log('video started');
			};
			
			videoElement.src = URL.createObjectURL(window.localStream);
			videoElement.play();


		});

		function startVideo(callback) {
			function successCallback(stream) {
				window.localStream = stream;
				callback();
			}
			function errorCallback(error) {
				console.error('get-user-media error', error);
			}
			var mediaConstraints = { video: true, facingMode: { exact: "environment" } };
			navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
		}

		startVideo(function () {
			that.cameraDialog.open();
		});

		function launchVideo() {
			isStoppedRecording = false;
			isRecordingStarted = true;
			recorder.startRecording();
		}

		function takePicture(callback) {
			isStoppedRecording = true;
			var imageManipulationCanvas = document.createElement('canvas');
			imageManipulationCanvas.height = 400;
			imageManipulationCanvas.width = 500;
			var imageManipulationCtx = imageManipulationCanvas.getContext('2d');
			imageManipulationCtx.drawImage(videoElement, 0, 0, 500, 400); // Draw image on temporary canvas
			var dataURL = imageManipulationCanvas.toDataURL();
			videoElement.pause();
			window.localStream.getVideoTracks()[0].stop();
			var filesListBase64 = {};
			filesListBase64.type = dataURL.substring(dataURL.indexOf('/') + 1, dataURL.indexOf(';'));
			filesListBase64.fileBase64 = dataURL.substring(dataURL.indexOf('base64,') + 7);
			imageManipulationCanvas.toBlob(function (blob) {
				filesListBase64.size = blob.size;
				callback(filesListBase64);
			}, 'image/png', 1);
		}

		function stopVideo(callback) {
			isStoppedRecording = true;
			recorder.stopRecording(function (url) {
				videoElement.pause();
				window.localStream.getVideoTracks()[0].stop();
				recorder.getDataURL(function (dataURL) {
					var filesListBase64 = {};
					var blob = recorder.getBlob();
					filesListBase64.type = blob.type.substring(blob.type.indexOf('/') + 1);
					filesListBase64.fileBase64 = dataURL.substring(dataURL.indexOf('base64,') + 7);
					filesListBase64.size = blob.size;
					callback(filesListBase64);
				});
			});

		}


	},

	openCommentDialog: function (oEvt, filesListBase64) {
		var dialog = new sap.m.Dialog({
			customHeader: [new sap.m.Toolbar({
				content: [new sap.m.Title({
					text: "{i18nModel>EntDesc}"
				}).addStyleClass("sapUiSmallMarginBegin")]
			})],
			content: [new sap.m.Input("idNameInput", {
				placeholder: '{i18nModel>fileName}',
				liveChange: function (oEvt) {
					var oInputComment = sap.ui.getCore().byId("idCommentInput");
					var oInputName = sap.ui.getCore().byId("idNameInput");
					if (oInputComment.getValue().length > 0 && oInputName.getValue().length > 0) {
						oEvt.getSource().oParent.mAggregations.beginButton.setEnabled(true);
					} else {
						oEvt.getSource().oParent.mAggregations.beginButton.setEnabled(false)
					}
				}
			}), new sap.m.Input("idCommentInput", {
				placeholder: '{i18nModel>description}',
				liveChange: function (oEvt) {
					var oInputComment = sap.ui.getCore().byId("idCommentInput");
					var oInputName = sap.ui.getCore().byId("idNameInput");
					if (oInputComment.getValue().length > 0 && oInputName.getValue().length > 0) {
						oEvt.getSource().oParent.mAggregations.beginButton.setEnabled(true);
					} else {
						oEvt.getSource().oParent.mAggregations.beginButton.setEnabled(false)
					}
				}
			}),
			],
			beginButton: new sap.m.Button({
				enabled: false,
				text: '{i18nModel>OK}',
				press: function () {
					dialog.close();
					airbus.mes.disruptiondetail.oView.oController.onUploadMediaComplete(filesListBase64)
				}
			}),
			endButton: new sap.m.Button({
				text: '{i18nModel>cancel}',
				press: function () {
					dialog.close();
					var oInputName = sap.ui.getCore().byId("idNameInput");
					var oInputCommment = sap.ui.getCore().byId("idCommentInput");
					oInputName.destroy();
					oInputCommment.destroy();
				}
			})
		});


		this.getView().addDependent(dialog);
		dialog.open();
	},
	 
	
});
