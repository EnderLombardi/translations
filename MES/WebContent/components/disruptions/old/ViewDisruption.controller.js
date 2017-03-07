"use strict";
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui
              .controller(
                           "airbus.mes.disruptions.ViewDisruption",
                           {
                                  commentPopUpOkEvt : undefined,
                                  /*expandedDisruptionPanel : undefined,*/

                                  /**
                                  * Called when a controller is instantiated and its View
                                  * controls (if available) are already created. Can be used
                                  * to modify the View before it is displayed, to bind event
                                  * handlers and do other one-time initialization.
                                  * 
                                   * @memberOf components.disruptions.ViewDisruption
                                  */
                                  //onInit : function() {
                                  //
                                  //},
                                  /**
                                  * Similar to onAfterRendering, but this hook is invoked
                                  * before the controller's View is re-rendered (NOT before
                                  * the first rendering! onInit() is used for that one!).
                                  * 
                                   * @memberOf components.disruptions.ViewDisruption
                                  */
                                  // onBeforeRendering: function() {
                                  //
                                  // },
                                  /**
                                  * Called when the View has been rendered (so its HTML is
                                  * part of the document). Post-rendering manipulations of
                                  * the HTML could be done here. This hook is the same one
                                  * that SAPUI5 controls get after being rendered.
                                  * 
                                   * @memberOf components.disruptions.ViewDisruption
                                  */
                                  onAfterRendering : function() {
                                         var oSorter = new sap.ui.model.Sorter("OpeningTime", true);

                                         // sorting based on opening time
                                         this.getView().byId("ViewDisruptionView--disrptlist").getBinding("items").sort(oSorter);
                                  },
                                  /**
                                  * Called when the Controller is destroyed. Use this one to
                                  * free resources and finalize activities.
                                  * 
                                   * @memberOf components.disruptions.ViewDisruption
                                  */
                                  // onExit: function() {
                                  //
                                  // },
                                                                     
                                  
                                  /***********************************************************
                                  * Turn buttons on off based on execution mode
                                  */
                                  turnOnOffButtons : function() {
                                         // Check status of operation - If Complete                                         
                                         // if operation is not complete complete, we can create a disruption
                                         var sStatus = sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/status");
                                         if ( sStatus !== airbus.mes.disruptions.Formatter.opStatus.completed ) {
                                                sap.ui.getCore().byId("operationDetailPopup--reportDisruption").setVisible(true);
                                         }
                                  },

                                  /***********************************************************
                                  * Filter comments by removing comments not related to the
                                  * selected disruption
                                  */
                                  applyFiltersOnComments : function() {
                                         var listItems = this.getView().byId("disrptlist")
                                                       .getItems();
                                         $.each(listItems, function(key, oItem) {
                                                /** Apply filters on Message Comments * */

                                                // Get Message Ref from current list
                                                var messageRef = oItem.getBindingContext("operationDisruptionsModel")
                                                              .getObject().MessageRef;

                                                // Get Binding of Comment list for Current item
                                                var oBinding = oItem.getContent()[0]
                                                              .getContent()[4].getBinding("items");
                                                
                                                if(nav.getCurrentPage().getId() == "stationTrackerView"){
                                                	var firstRowFlag = true;
                                                	oBinding.filter(new sap.ui.model.Filter({
                                                		path: "MessageRef",
                                                		test: function (sValue) {
	                                                		if (firstRowFlag && sValue == messageRef.toUpperCase()){
	                                                			firstRowFlag = false;
	                                                			return true;
	                                            			}
	                                                		return false;
	                                            		}
                                                	}));
                                                } else{
                                                	oBinding.filter(new sap.ui.model.Filter("MessageRef", "EQ", messageRef));
                                                }
                                                
                                                
                                                // Apply Filters                                                
                                                //oBindings.filter(oFilters);
                                                
                                                // Hide Comment Box every time on data re-load
                                                //oItem.getContent()[0].getContent()[4].setVisible(false);
                                         });

                                  },

                                  /***********************************************************
                                  * Open Pop-Up to ask Time Lost while Closing the Disruption
                                  */
                                  onCloseDisruption : function(oEvt) {
                                         /*
                                         //Close panel
                                         oEvt.getSource().getParent().getParent().setExpanded(false);
                                         
                                         
                                         // Close Comment Box if open
                                         var path = oEvt.getSource().sId;
                                         var listnum = path.split("-");
                                         listnum = listnum[listnum.length - 1];
                                         var commentBox = this.getView().byId(
                                                       this.getView().sId + "--commentBox-"
                                                                     + this.getView().sId + "--disrptlist-"
                                                                     + listnum);
                                         commentBox.setVisible(false);
                                         
                                         var submitCommentId = sap.ui.getCore().byId(
                                                       this.getView().sId + "--addComment-"
                                                                     + this.getView().sId + "--disrptlist-"
                                                                     + listnum);

                                         submitCommentId.setVisible(true);
                                         //*********************************************************
*/                                         
                                         // Get Fields to Pre-Fill Comment Pop-up
                                         var sPath = oEvt.getSource().getParent().getParent()
                                                       .getParent().getBindingContext(
                                                                     "operationDisruptionsModel").sPath;
                                         var msgRef = this.getView().getModel(
                                                       "operationDisruptionsModel").getProperty(
                                                       sPath + "/MessageRef");
                                         var timeLost = this.getView().getModel(
                                                       "operationDisruptionsModel").getProperty(
                                                       sPath + "/TimeLost");

                                         // Call Close Disruption fragment
                                         if (!this._closeDialog) {

                                                this._closeDialog = sap.ui
                                                              .xmlfragment(
                                                                            "airbus.mes.disruptions.fragment.closeDisruption",
                                                                           this);

                                                var title = this.getView().getModel("i18nModel")
                                                              .getProperty("closeDisruption");

                                                sap.ui.getCore().byId("disruptionCloseDialogue")
                                                              .setTitle(title);

                                                this.getView().addDependent(this._closeDialog);

                                         }

                                         sap.ui.getCore().byId("closeDisruption-timeLost")
                                                       .setValue(airbus.mes.disruptions.Formatter.timeMillisecondsToConfig(timeLost));
                                         sap.ui.getCore().byId("closeDisruption-timeLostUnit")
                                                       .setText(airbus.mes.disruptions.Formatter.getConfigTimeUnit());
                                         sap.ui.getCore().byId("closeDisruption-msgRef")
                                                       .setText(msgRef);
                                         sap.ui.getCore().byId("closeDisruption-sPath").setText(
                                                       sPath);
                                         sap.ui.getCore().byId("closeDisruptionComments")
                                                       .setValue("");

                                         
                                         //give the id of add comment button to hide it if operation closed
                                         this._closeDialog.mProperties.disruptionId = this.getView().sId + "--addComment-"+ this.getView().sId + "--disrptlist-"+ listnum;

                                         this._closeDialog.open();
                                  },

                                  /***********************************************************
                                  * Close selected disruption
                                  */
                                  onAcceptCloseDisruption : function(oEvent) {

                                         /*//hide add comment button
                                         this.oView.byId(this._closeDialog.mProperties.disruptionId).setVisible(false);

                                         //hide escalate button
                                         var escalateBtnId = this._closeDialog.mProperties.disruptionId.substring(0,20) + "escalateBtn" + 
                                                this._closeDialog.mProperties.disruptionId.substring(30, this._closeDialog.mProperties.disruptionId.length);
                                         this.oView.byId(escalateBtnId).setVisible(false);*/

                                         //close the dialog box 
                                         this._closeDialog.close();
                                         
                                         airbus.mes.operationdetail.oView.setBusy(true);
                                         
                                         
                                         // Get values for Ajax Call
                                         var sMsgRef = sap.ui.getCore().byId("closeDisruption-msgRef").getText();
                                         var sComment = airbus.mes.disruptions.Formatter.actions.close +
                                                                 sap.ui.getCore().byId("closeDisruptionComments").getValue();
                                         
                                         var oTimeLost = sap.ui.getCore().byId(
                                                       "closeDisruption-timeLost");
                                         var timeLostValue = airbus.mes.disruptions.Formatter.timeToMilliseconds(oTimeLost.getValue());
                                         
                                         var i18nModel = airbus.mes.disruptionslist.oView.getModel("i18nModel");
                                         
                                         // Call Close Disruption Service
                                         jQuery.ajax({
                                                url : airbus.mes.disruptions.ModelManager.getUrlToCloseDisruption(),
                                                data : {
                                                       "Param.1" : airbus.mes.settings.ModelManager.site,
                                                       "Param.2" : sap.ui.getCore().getModel(
                                                                     "userSettingModel").getProperty(
                                                                     "/Rowsets/Rowset/0/Row/0/user"),
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
                                                       
                                                       if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined &&
                                                              result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
                                                    	   
                                                              airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message)

                                                       } else {
                                                              var message = i18nModel.getProperty("successClosed");
                                                              airbus.mes.shell.ModelManager.messageShow(message);
                                                              
                                                              var operationDisruptionsModel =  airbus.mes.disruptionslist.oView.getModel("operationDisruptionsModel");

                                                              //load again disruptions data
                                                              var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
                                                              var sSfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;
                                                              airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO,sSfcStepRef);

                                                              
                                                              if (nav.getCurrentPage().sId == "stationTrackerView"){
                                                                     
                                                                     airbus.mes.disruptions.ModelManager.checkDisruptionStatus(operationDisruptionsModel);
                                                                     
                                                                     //Refresh station tracker
                                                                     airbus.mes.shell.oView.getController().renderStationTracker();
                                                                     
                                                              }  else if(nav.getCurrentPage().getId() == "disruptiontrackerView")
                                                                     airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
                                                       }

                                                }
                                         });
                                                       
                                  },

                                  /***********************************************************
                                  * Close Pop-Up - Closing Disruption Pop-Up
                                  */
                                  cancelClosingDisruption : function(oEvent) {
                                	  this._closeDialog.close();
                                  },

                                  
                                  /***********************************************************
                                  * Open the Enter Comment Pop-Up
                                  */                               
                                  onOpenDisruptionComment : function(title, msgRef, sPath, okEvent, sStatus) {
                                	  // Call Disruption Comment Pop-up fragment
                                      if (!airbus.mes.disruptions.__enterCommentDialogue) {
                                            airbus.mes.disruptions.__enterCommentDialogue = sap.ui
                                                          .xmlfragment(
                                                                        "airbus.mes.disruptions.fragment.commentBoxDisruption",
                                                                       this);
                                            this
                                                          .getView()
                                                          .addDependent(
                                                                        airbus.mes.disruptions.__enterCommentDialogue);

                                      }
                                      sap.ui.getCore().byId("disruptionCommentDialogue").setTitle(title);
                                      sap.ui.getCore().byId("disruptionCommentMsgRef").setText(msgRef);
                                      sap.ui.getCore().byId("disruptionCommentSpath").setText(sPath);
                                     
                                      if(sStatus == undefined)
                                    	  sStatus = "";
                                      sap.ui.getCore().byId("disruptionCommentStatus")
                                                   .setText(sStatus);
                                      sap.ui.getCore().byId("disruptionCommentBox").setValue("");
                                     
                                     
                                      sap.ui.getCore().byId("disruptionCommentOK").detachPress(this.commentPopUpOkEvt);
                                      sap.ui.getCore().byId("disruptionCommentOK")
                                                   .attachPress(okEvent);
                                      this.commentPopUpOkEvt = okEvent;
                                     
                                      airbus.mes.disruptions.__enterCommentDialogue.open();
                                  },

                                  /***********************************************************
                                  * Close the Enter Comment Pop-Up
                                  */
                                  onCloseDisruptionComment : function(oEvent) {
                                         sap.ui.getCore().byId("disruptionCommentBox").setValue(
                                                       "");
                                         airbus.mes.disruptions.__enterCommentDialogue.close();

                                  },

                                  /***********************************************************
                                  * Delete the Disruption
                                  */
                                  onDeleteDisruption : function(oEvt) {
                                         
                                         /*// Close Comment Box if open
                                         var path = oEvt.getSource().sId;
                                         var listnum = path.split("-");
                                         listnum = listnum[listnum.length - 1];
                                         var commentBox = this.getView().byId(
                                                       this.getView().sId + "--commentBox-"
                                                                     + this.getView().sId + "--disrptlist-"
                                                                     + listnum);
                                         commentBox.setVisible(false);
                                         
                                         var submitCommentId = sap.ui.getCore().byId(
                                                       this.getView().sId + "--addComment-"
                                                                     + this.getView().sId + "--disrptlist-"
                                                                     + listnum);

                                         submitCommentId.setVisible(true);
                                         //*********************************************************
*/                                         
                                         var status = oEvt.getSource().getBindingContext(
                                                       "operationDisruptionsModel")
                                                       .getObject("Status");

                                         if (status == airbus.mes.disruptions.Formatter.status.acknowledged) {
                                                sap.m.MessageBox
                                                              .error(airbus.mes.disruptionslist.oView
                                                                            .getModel("i18nModel").getProperty(
                                                                                         "disruptionDeleteError"));
                                         } else {

                                                var title = this.getView().getModel("i18nModel")
                                                              .getProperty("deleteDisruption");
                                                var msgRef = oEvt.getSource().getBindingContext(
                                                              "operationDisruptionsModel").getObject(
                                                              "MessageRef");
                                                var sPath = oEvt.getSource().getBindingContext(
                                                              "operationDisruptionsModel").sPath;

                                                this.onOpenDisruptionComment(title, msgRef, sPath,
                                                              this.onConfirmDelete);
                                         }

                                  },

                                  /***********************************************************
                                  * Confirming Delete Disruption
                                  */
                                  onConfirmDelete : function(oEvent) {
                                         
                                         airbus.mes.disruptionslist.oView.setBusy(true);                                      

                                         var comment = airbus.mes.disruptions.Formatter.actions.del +
                                                                sap.ui.getCore().byId("disruptionCommentBox").getValue();

                                         var msgRef = sap.ui.getCore().byId(
                                                       "disruptionCommentMsgRef").getText();
                                         
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
                                                       
                                                       if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined
                                                                     && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
                                                              airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

                                                       } else { // Success

                                                              var sMessageSuccess = i18nModel.getProperty("successDelete");
                                                              airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);

                                                              var operationDisruptionsModel =  airbus.mes.disruptionslist.oView.getModel("operationDisruptionsModel");

                                                              //load again disruptions data
                                                              var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
                                                              var sSfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;
                                                              airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO,sSfcStepRef);

                                                              if (nav.getCurrentPage().sId == "stationTrackerView"){
                                                                     airbus.mes.disruptions.ModelManager.checkDisruptionStatus(operationDisruptionsModel);
                                                                     
                                                                     //Refresh station tracker
                                                                     airbus.mes.shell.oView.getController().renderStationTracker();
                                                                     
                                                                     
                                                              } else if(nav.getCurrentPage().getId() == "disruptiontrackerView") 
                                                                     airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
                                                              
                                                              
                                                       }

                                                }
                                         });

                                  },

                                  /***********************************************************
                                  * Reject the Disruption
                                  */
                                  onRejectDisruption : function(oEvt) {
                                         var title = airbus.mes.disruptionslist.oView
                                                       .getModel("i18nModel").getProperty("rejectDisruption");
                                         var msgRef = oEvt.getSource().getBindingContext(
                                                       "operationDisruptionsModel").getObject("MessageRef");
                                         var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;
                                         
                                         // Status required because user can reject before or after claim (Acknowledge)
                                         var sStatus = oEvt.getSource().getBindingContext(
                                                       "operationDisruptionsModel").getObject("Status");

                                         this.onOpenDisruptionComment(title, msgRef, sPath, this.onConfirmRejection, sStatus);

                                  },

                                  /***********************************************************
                                  * Confirming Reject Disruption
                                  */
                                  onConfirmRejection : function(oEvent) {
                                	 var i18nModel = this.getview().getModel("i18nModel");
                                	  
                                     var comment = airbus.mes.disruptions.Formatter.actions.reject +
                                                            sap.ui.getCore().byId("disruptionCommentBox").getValue();
                                     
                                     // Comment is mandatory while rejection
                                     if(comment == "") {
                                    	 sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
                                    	 return;
                                     }
                                   	  
                                   	  // Set Busy
                                     airbus.mes.disruptions.__enterCommentDialogue.setBusyIndicatorDelay(0);
                                     airbus.mes.disruptions.__enterCommentDialogue.setBusy(true);
                                         
                                     var msgRef = sap.ui.getCore().byId(
                                                   "disruptionCommentMsgRef").getText();
                                     var sStatus = sap.ui.getCore().byId(
                                                   "disruptionCommentStatus").getText();

                                     // Call Reject disruption Service
                                     airbus.mes.disruptions.ModelManager.rejectDisruption(comment, msgRef, sStatus, i18nModel);
                                  },
                                  
                                  /***********************************************************
                                  * Refuse the Disruption
                                  */
                                  onRefuseDisruption : function(oEvt) {
                                         
                                        /* // Close Comment Box if open
                                         var path = oEvt.getSource().sId;
                                         var listnum = path.split("-");
                                         listnum = listnum[listnum.length - 1];
                                         var commentBox = this.getView().byId(
                                                       this.getView().sId + "--commentBox-"
                                                                     + this.getView().sId + "--disrptlist-"
                                                                     + listnum);
                                         commentBox.setVisible(false);
                                         
                                         var submitCommentId = sap.ui.getCore().byId(
                                                       this.getView().sId + "--addComment-"
                                                                     + this.getView().sId + "--disrptlist-"
                                                                     + listnum);

                                         submitCommentId.setVisible(true);
                                         //*********************************************************
*/                                         
                                         var title = airbus.mes.disruptionslist.oView
                                                       .getModel("i18nModel").getProperty(
                                                                     "refuseDisruption");
                                         var msgRef = oEvt.getSource().getBindingContext(
                                                       "operationDisruptionsModel").getObject(
                                                       "MessageRef");
                                         var sPath = oEvt.getSource().getBindingContext(
                                                       "operationDisruptionsModel").sPath;

                                         this.onOpenDisruptionComment(title, msgRef, sPath,
                                                       this.onConfirmRefuse);
                                  },
                                  
                                  /***********************************************************
                                  * Confirming Refuse Disruption
                                  */
                                  onConfirmRefuse : function(oEvent) {
                                	  	 var i18nModel = airbus.mes.disruptionslist.oView.getModel("i18nModel");

                                         var comment = airbus.mes.disruptions.Formatter.actions.refuse +
                                                                sap.ui.getCore().byId("disruptionCommentBox").getValue();
                                         
                                         if(comment == "") {
                                        	 sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
                                        	 return;
                                         }
                                      	  
                                      	  // Set Busy
                                        airbus.mes.disruptions.__enterCommentDialogue.setBusyIndicatorDelay(0);
                                        airbus.mes.disruptions.__enterCommentDialogue.setBusy(true);
                                         
                                         var msgRef = sap.ui.getCore().byId("disruptionCommentMsgRef").getText();

                                         // Call Refuse solution Service
                                         airbus.mes.disruptions.ModelManager.refuseDisruption(comment, msgRef, i18nModel);

                                  },

                                  /***********************************************************
                                  * Show Comment Box to Add Comments
                                  */
                                  showCommentBox : function(oEvt) {
                                	  var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;
                                	  this.getView().getModel("operationDisruptionsModel").setProperty(sPath+"/commentBoxOpened", "true");
                                      this.getView().getModel("operationDisruptionsModel").refresh();

                                  },

                                  /***********************************************************
                                  * Hide Comment Box to Add Comments
                                  */
                                  hideCommentBox : function(oEvt) {
                                	  var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;
                                	  this.getView().getModel("operationDisruptionsModel").setProperty(sPath+"/commentBoxOpened", "false");
                                      this.getView().getModel("operationDisruptionsModel").refresh();

                                  },

                                  /***********************************************************
                                  * Submit Disruption Comment
                                  */
                                  submitComment : function(oEvt) {
                                	  var status = oEvt.getSource().getBindingContext(
                                                       "operationDisruptionsModel").getObject("Status");
                                         
                                      if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
                                                
                                    	  sap.m.MessageToast.show(this.getView().getModel("i18nModel").getProperty("cannotComment"));
                                          return;
                                      }
                                         
                                         
                                      var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;
                                      var sComment  = this.getView().getModel("operationDisruptionsModel").getProperty(sPath+"/disruptionNewComment");
                                                                               
                                      if(sComment == undefined || !sComment.length || sComment.length<1){
                                     	 sap.m.MessageToast.show(this.getView().getModel("i18nModel").getProperty("plsEnterComment"));
                                     	 return;
                                      }
                                         
                                      sComment = airbus.mes.disruptions.Formatter.actions.comment + sComment;
                                         

                                      var msgRef = oEvt.getSource().getBindingContext(
                                                       "operationDisruptionsModel").getObject(
                                                       "MessageRef");


                                      // Call Add comment Service
                                      var i18nModel = airbus.mes.disruptionslist.oView.getModel("i18nModel");
                                      airbus.mes.disruptions.ModelManager.addComment(sComment, msgRef, i18nModel);

                                      this.getView().getModel("operationDisruptionsModel").setProperty(sPath+"/disruptionNewComment", "");
                                      this.getView().getModel("operationDisruptionsModel").refresh(); 
                                  },

                                  /***********************************************************
                                  * When Acknowledge Button is Pressed
                                  */
                                  onAckDisruption : function(oEvt) {
                                         
                                         // Close Comment Box if open
                                         var path = oEvt.getSource().sId;
                                         var listnum = path.split("-");
                                         listnum = listnum[listnum.length - 1];
                                         //temporary removing so that acknowledge can work
                                         /*var commentBox = this.getView().byId(
                                                       this.getView().sId + "--commentBox-"
                                                                     + this.getView().sId + "--disrptlist-"
                                                                     + listnum);
                                         commentBox.setVisible(false);
                                         
                                         var submitCommentId = sap.ui.getCore().byId(
                                                       this.getView().sId + "--addComment-"
                                                                     + this.getView().sId + "--disrptlist-"
                                                                     + listnum);

                                         submitCommentId.setVisible(true);
*/                                         //*********************************************************
                                         
                                         var title = this.getView().getModel("i18nModel")
                                                       .getProperty("ackDisruption");
                                         var msgRef = oEvt.getSource().getBindingContext(
                                                       "operationDisruptionsModel").getObject(
                                                       "MessageRef");

                                         // Call Acknowledge Disruption fragment
                                         if (!airbus.mes.disruptions.__enterAckCommentDialogue) {
                                                airbus.mes.disruptions.__enterAckCommentDialogue = sap.ui
                                                              .xmlfragment(
                                                                            "airbus.mes.disruptions.fragment.ackDisruption",
                                                                           this);
                                                this
                                                              .getView()
                                                              .addDependent(
                                                                            airbus.mes.disruptions.__enterAckCommentDialogue);

                                         }
                                         sap.ui.getCore().byId("disruptionAckCommentDialogue")
                                                       .setTitle(title);

                                         sap.ui.getCore().byId("disruptionAckDate")
                                                       .setDateValue(new Date());

                                         sap.ui.getCore().byId("disruptionAckMsgRef")
                                                       .setText(msgRef);

                                         sap.ui.getCore().byId("disruptionAckSpath").setText(
                                                       oEvt.getSource().getBindingContext(
                                                                     "operationDisruptionsModel").sPath);

                                         sap.ui.getCore().byId("disruptionAckComment").setValue(
                                                       "");

                                         airbus.mes.disruptions.__enterAckCommentDialogue.open();
                                  },

                                  /***********************************************************
                                  * When Comment is Added to Acknowledge Disruption
                                  */
                                  onAcceptAckDisruptionComment : function() {

                                         var date = sap.ui.getCore().byId("disruptionAckDate").getValue();

                                         var obDate = new Date(date);
                                         
                                         // Validate Promised Date Time
                                         if (obDate == "Invalid Date" || date.length != 10){
                                                airbus.mes.shell.ModelManager.messageShow(
                                                       this.getView().getModel("i18nModel").getProperty("invalidDateError"));
                                                
                                                return;
                                         }
                                         
                                         // Set Busy
                                         airbus.mes.disruptions.__enterAckCommentDialogue.setBusyIndicatorDelay(0);
                                         airbus.mes.disruptions.__enterAckCommentDialogue.setBusy(true);
                                         
                                         // Calculate Promised Date Time
                                         var time = sap.ui.getCore().byId("disruptionAckTime").getValue();

                                         if (time == "")
                                                time = "00:00:00";

                                         var dateTime = date + " " + time;

                                         var msgRef = sap.ui.getCore().byId("disruptionAckMsgRef").getText();

                                         var comment = airbus.mes.disruptions.Formatter.actions.acknowledge +
                                                                sap.ui.getCore().byId("disruptionAckComment").getValue();

                                         // Call to Acknowledge Disruption
                                         var i18nModel = this.getview().getModel("i18nModel");
                                         airbus.mes.disruptions.ModelManager.ackDisruption(dateTime, msgRef, comment, i18nModel);

                                  },
                                  

                                  /***********************************************************
                                  * Close the Acknowledge Pop-Up
                                  */
                                  onCloseAckDisruptionComment : function(oEvent) {

                                         sap.ui.getCore().byId("disruptionAckDate").setValue("");
                                         sap.ui.getCore().byId("disruptionAckTime").setValue("");
                                         sap.ui.getCore().byId("disruptionAckComment").setValue(
                                                       "");
                                         airbus.mes.disruptions.__enterAckCommentDialogue
                                                       .close();

                                  },

                                  onMarkSolvedDisruption : function(oEvt) {
                                         
                                         var title = this.getView().getModel("i18nModel")
                                                       .getProperty("markSolvedDisruption");
                                         var msgRef = oEvt.getSource().getBindingContext(
                                                       "operationDisruptionsModel").getObject(
                                                       "MessageRef");
                                         var sPath = oEvt.getSource().getBindingContext(
                                                       "operationDisruptionsModel").sPath;

                                         this.onOpenDisruptionComment(title, msgRef, sPath,
                                                       this.onMarkSolvedDisruptionComment);

                                  },

                                  /***********************************************************
                                  * When Comment is Submitted to Mark Solved Disruption
                                  */
                                  onMarkSolvedDisruptionComment : function() {
                                	  
                                	  // Set Busy
                                      airbus.mes.disruptions.__enterCommentDialogue.setBusyIndicatorDelay(0);
                                      airbus.mes.disruptions.__enterCommentDialogue.setBusy(true);

                                      var msgRef = sap.ui.getCore().byId( "disruptionCommentMsgRef").getText();

                                      var comment = airbus.mes.disruptions.Formatter.actions.solve +
                                                            sap.ui.getCore().byId("disruptionCommentBox").getValue();

                                      //var i18nModel = sap.ui.getCore().byId("ViewDisruptionView").getModel("i18nModel");

                                      // Call to Mark Solved Disruption
                                      var i18nModel = this.getview().getModel("i18nModel");
                                      airbus.mes.disruptions.ModelManager.markSolvedDisruption(msgRef, comment, i18nModel);

                                      /*   if (isSuccess) {
                                                var sPath = sap.ui.getCore().byId(
                                                              "disruptionCommentSpath").getText();
                                                sap.ui.getCore().byId("ViewDisruptionView").getModel("operationDisruptionsModel").getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.solved;
                                                
                                                var currDate = new Date();
                                                var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
                                                
                                                var oComment = {
                                                              "Action" : i18nModel.getProperty("solve"),
                                                              "Comments" : comment,
                                                              "Counter" : "",
                                                              "Date" : date,
                                                              "MessageRef" : msgRef,
                                                              "UserFullName" : ( sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
                                                                                            sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase() )
                                                };
                                                sap.ui.getCore().byId("ViewDisruptionView").getModel("operationDisruptionsModel")
                                                              .getProperty("/Rowsets/Rowset/1/Row").push(oComment);
                                                
                                                sap.ui.getCore().byId("ViewDisruptionView").getModel("operationDisruptionsModel")
                                                              .refresh();
                                         }*/
                                  },

                                  /***********************************************************
                                  * When Comment is Submitted to Escalate Disruption
                                  */
                                  onEscalateDisruptionComment : function (oEvt) {
                                	  
                                	  var title = airbus.mes.disruptionslist.oView.getModel("i18nModel").getProperty("escalateDisruption");
                            	       
                                       var msgRef = oEvt.getSource().getBindingContext(
                                      "operationDisruptionsModel").getObject("MessageRef");
                    
                                       var sStatus = oEvt.getSource().getBindingContext(
                                          "operationDisruptionsModel").getObject("Status");

                                    this.onOpenDisruptionComment(title, msgRef, '', this.onEscalateDisruption, sStatus);
                                	  
                                  },
                                  
                                  onEscalateDisruption : function(oEvent) {
                                	  
                                	  var msgRef = sap.ui.getCore().byId( "disruptionCommentMsgRef").getText();

                                      var comment = airbus.mes.disruptions.Formatter.actions.escalation +
                                                            sap.ui.getCore().byId("disruptionCommentBox").getValue();
                                      
                                      var i18nModel = this.getview().getModel("i18nModel");
                                      // Call Escalate Service
                                      airbus.mes.disruptions.ModelManager.escalateDisruption(msgRef, comment, i18nModel);

                                  },

                                  /***********************************************************
                                  * Close other panels when one panel is expanded
                                  */
                                  /*handleDisruptionPanelExpand : function(oevent) {
                                         
                                         if (!oevent.oSource.getExpanded())
                                                return;
                                         
                                         this.expandedDisruptionPanel = oevent.getSource().getId();
                                         
                                         var disruptions = this.getView().byId("disrptlist");
                                         $(disruptions.getItems())
                                                       .each(
                                                                     function() {
                                                                           var currentPanel = this
                                                                                         .getContent()[0];
                                                                           if (oevent.getSource().getId() != currentPanel
                                                                                         .getId())
                                                                                  currentPanel.setExpanded(false)
                                                                     });

                                  },*/
                                  

                                  onReportDisruption : function(oEvent) {
                                         
                                         
                                         /*// Close expanded disruption panel
                                         if(this.expandedDisruptionPanel)
                                                sap.ui.getCore().byId(this.expandedDisruptionPanel).setExpanded(false);*/
                                         
                                         var oOperDetailNavContainer = sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer");
                                         oOperDetailNavContainer.to(airbus.mes.disruptions.oView.createDisruption.getId(), {mode: "Create", oData: {}});
                                         
                                         // clear disruptionDetailModel if edit is loaded before ReportDisruption
                                         //sap.ui.getCore().getModel("DisruptionDetailModel").setData();
                                         //airbus.mes.disruptions.oView.createDisruption.getModel("DisruptionDetailModel").setData();
                                         
                                         /*// V1.5 [BEG] -- no more required in v1.5
                                         // SD-SP1604983-CDP-010 and SD-SP1604983-DDR-005
                                         //To fill initially logged in user in issuer field     
                                         var sUserId = sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/user_id")
                                         
                                         var sUserName = (sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name")
                                                                     +" "
                                                                     +sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name"))
                                         
                                         var oItem = new sap.ui.core.Item({key: sUserId ,text: sUserName});
                                         
                                         
                                          if (sap.ui.getCore().byId("createDisruptionView--selectIssuer").getSelectedKey()=="") {   
                                                sap.ui.getCore().byId("createDisruptionView--selectIssuer").addItem(oItem)
                                         }
                                         sap.ui.getCore().byId("createDisruptionView--selectIssuer").setSelectedItem(oItem)
                                         // V1.5 [END]*/                                        
                                         
                                         
                                         //destroying Material List dialog which might have already loaded and will show inconsistent data otherwise
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
                                  * Edit Disruption
                                  */
                                  onEditDisruption : function(oEvent) {

                                	  	// Set the data for this new model from the already loaded model
                                      	var oBindingContext = oEvent.getSource().getBindingContext("operationDisruptionsModel");
                                	  	var oData = oBindingContext.getProperty(oBindingContext.sPath);
                                                                                  

                                         /*// Close expanded disruption panel
                                         if(this.expandedDisruptionPanel)
                                                sap.ui.getCore().byId(this.expandedDisruptionPanel).setExpanded(false);*/

                                         // Navigate to Edit Screen
                                         this.getView().oParent.to(airbus.mes.disruptions.oView.createDisruption.getId(), {mode: "Edit", oData: oData});

                                  },

                                  /***********************************************************
                                  * Load previsous messages to the selected disruption
                                  */
                                  seeMoreMesssages: function(oEvt){
                                	  
                                      var oCommentList = oEvt.getSource().getParent().getContent()[4];
                                      var oBinding = oCommentList.getBinding("items");
                                      
                                      // Show all comments to the current disruption
                                      var messageRef = oEvt.getSource().getCustomData()[0].getValue();
                                      oBinding.filter(new sap.ui.model.Filter("MessageRef", "EQ", messageRef));
                                      
                                      // Update binding inorder to hide the see more button
                                      var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;
                                      this.getView().getModel("operationDisruptionsModel").setProperty(sPath+"/prevCommentsLoaded", "true");
                                      this.getView().getModel("operationDisruptionsModel").refresh();
                                  },

                                  /***********************************************************
                                  * Hide previsous messages to the selected disruption
                                  */
                                  seeLessMesssages: function(oEvt){
                                	  
                                      var oCommentList = oEvt.getSource().getParent().getContent()[4];
                                      var oBinding = oCommentList.getBinding("items");
                                      
                                      // Show all comments to the current disruption
                                      var messageRef   = oEvt.getSource().getCustomData()[0].getValue();
                                      var firstRowFlag = true;
                                      oBinding.filter(new sap.ui.model.Filter({
                                    	  path: "MessageRef",
                                    	  test: function (sValue) {
                                    		  if (firstRowFlag && sValue == messageRef.toUpperCase()){
                                    			  firstRowFlag = false;
                                    			  return true;
                                    		  }
                                    		  return false;
                                    	  }
                                      }));
                                      
                                      // Update binding inorder to un-hide the see more button
                                      var sPath = oEvt.getSource().getBindingContext("operationDisruptionsModel").sPath;
                                      this.getView().getModel("operationDisruptionsModel").setProperty(sPath+"/prevCommentsLoaded", "false");
                                      this.getView().getModel("operationDisruptionsModel").refresh();
                                  },
                                  
                                  /***********************************************************
                                  * Open Attachment linked to a disruptions
                                  */
                                  viewAttachments : function(oEvt) {
                                         var sPath =  oEvt.oSource.oPropagatedProperties.oBindingContexts.operationDisruptionsModel.sPath;
                                         var length = sPath.length;
                                         var index = sPath.slice(length -1);
                                         
                                         var disruptionDesc = oEvt.oSource.oPropagatedProperties.oBindingContexts.operationDisruptionsModel.oModel.oData.Rowsets.Rowset[0].Row[index].Description;
                                         
                                         airbus.mes.shell.util.navFunctions.disruptionAttachment(this.getView().oParent, disruptionDesc);
                                  },

                           });

