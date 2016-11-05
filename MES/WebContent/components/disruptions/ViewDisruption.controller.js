sap.ui
		.controller(
				"airbus.mes.disruptions.ViewDisruption",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf components.disruptions.ViewDisruption
					 */
					onInit : function() {
					},
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
					// onAfterRendering: function() {
					//
					// },
					/**
					 * Called when the Controller is destroyed. Use this one to
					 * free resources and finalize activities.
					 * 
					 * @memberOf components.disruptions.ViewDisruption
					 */
					// onExit: function() {
					//
					// },
					
					
					/********************************************
					 * Closing the Disruption
					 */
					onCloseDisruption: function(oEvt){
						var sPath = oEvt.getSource().getParent().getParent().getParent().getBindingContext("operationDisruptionsModel").sPath;
						var messageRef = this.getView().getModel("operationDisruptionsModel").getProperty(sPath+"/MessageRef");
						
						// Call Close Disruption fragment
						if (!this._closeDialog) {

							this._closeDialog = sap.ui.xmlfragment("airbus.mes.disruptions.fragment.closeDisruption",this);

							this.getView().addDependent(this._closeDialog);

						}
						this._closeDialog.open();
					},
					
					onAcceptCloseDisruption: function(oEvent){
						this._closeDialog.close();
//	Initialize the inputs							
						sap.ui.getCore().byId("input1").setValue("");
						sap.ui.getCore().byId("closeDisruptionComments").setValue("");
//						this.onCloseOperationDetailPopup(); 
					},
					
					cancelCloseDisruption: function(oEvent){
						this._closeDialog.close();
//	Initialize the inputs					
						sap.ui.getCore().byId("input1").setValue("");					
						sap.ui.getCore().byId("closeDisruptionComments").setValue("");
//						this.onCloseOperationDetailPopup();
					},
					
					showCommentBox : function(oEvt) {
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var a = this.getView().byId(
								"ViewDisruptionView--commentBox-ViewDisruptionView--disrptlist-"
										+ listnum);
						a.setVisible(true);
						
						
						var b = sap.ui.getCore().byId(path);
						b.setVisible(false);

					},
					
					hideCommentBox : function(oEvt) {
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var a = this.getView().byId(
								"ViewDisruptionView--commentBox-ViewDisruptionView--disrptlist-"
										+ listnum);
						a.setVisible(false);
						
						var b = sap.ui.getCore().byId("ViewDisruptionView--addComment-ViewDisruptionView--disrptlist-" + listnum);
						b.setVisible(true);

					},
					
					submitComment : function(oEvt) {
						var path = oEvt.getSource().sId;
						
						var oModel = sap.ui.getCore().getModel("commentsModel");
						oModel.loadData("../components/disruptions/local/commentsModel.json", null, false);
						
						var commentsData = oModel.getData();
						
						var msgRef = oEvt.getSource().getBindingContext(
						"operationDisruptionsModel").getObject("MessageRef");
						
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var a = this.getView().byId(
								"ViewDisruptionView--commentArea-ViewDisruptionView--disrptlist-"
										+ listnum);
						listNum = a.getValue();
						
						var comment = {"MessageRef": msgRef,
										"Comment": listNum};
						commentsData.Rowsets.Rowset[0].Row.push(comment);
						oModel.setData(commentsData);
						oModel.refresh();
					},

					onMarkSolved : function(oEvt) {
						/*
						 * var path = oEvt.getSource().getBindingContext(
						 * "disruptionModel").getPath();
						 * this.getView().getModel("disruptionModel").setProperty(
						 * path + "/Status", "Solved");
						 * this.getView().getModel("disruptionModel").setProperty(
						 * path + "/commentVisible", "false");
						 * this.getView().getModel("disruptionModel").setProperty(
						 * path + "/message", " ");
						 * oEvt.getSource().setType("Accept");
						 */

					},

					/*************************************************
					 * Close other panels when one panel is expanded
					 */
					handleDisruptionPanelExpand : function(oevent) {

						if (!oevent.oSource.getExpanded())
							return;
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

					},
					
					
					

					onEscalate : function(oEvent) {

						var msgRef = oEvent.getSource().getBindingContext(
								"operationDisruptionsModel").getObject("MessageRef");

						airbus.mes.disruptions.ModelManager.escalateDisruption(msgRef);
					},
					
					
					

					onReportDisruption : function(oEvent) {

						var oOperDetailNavContainer = sap.ui.getCore().byId(
								"operationDetailsView--operDetailNavContainer");

						if (airbus.mes.operationdetail.createDisruption === undefined
								|| airbus.mes.operationdetail.createDisruption.oView === undefined) {
							sap.ui
									.getCore()
									.createComponent(
											{
												name : "airbus.mes.operationdetail.createDisruption",
											});

							oOperDetailNavContainer
									.addPage(airbus.mes.operationdetail.createDisruption.oView);
						}

						oOperDetailNavContainer
								.to(airbus.mes.operationdetail.createDisruption.oView
										.getId());
					},

					
					onEditDisruption : function(oEvent) {
                          
						
						//to auto fill fields on edit screen
						
						var oTranModel = sap.ui.getCore().getModel("DisruptionModel");
						
						// set the data for the model
						oTranModel.setData(oEvent.getSource().getBindingContext(
						"operationDisruptionsModel"));
						
						
						var oOperDetailNavContainer = sap.ui.getCore().byId(
								"operationDetailsView--operDetailNavContainer");
                        
						
						
					
						
						if (airbus.mes.operationdetail.editDisruption === undefined
								|| airbus.mes.operationdetail.editDisruption.oView === undefined) {
							sap.ui
							        .getCore()
									.createComponent(
											{
												name : "airbus.mes.operationdetail.editDisruption",
											});

							oOperDetailNavContainer
									.addPage(airbus.mes.operationdetail.editDisruption.oView);
						}

                        
						
						oOperDetailNavContainer
								.to(airbus.mes.operationdetail.editDisruption.oView
										.getId());
						
					
						
						
						
					},
					
					
					onCloseOperationDetailPopup : function() {

						airbus.mes.stationtracker.operationDetailPopup.close();
						airbus.mes.shell.oView.getController()
								.renderStationTracker();						
					}

				});
