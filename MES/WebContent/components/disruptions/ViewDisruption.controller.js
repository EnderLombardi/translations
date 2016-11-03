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
					 onInit: function() {
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
					 
					 showCommentBox : function(oEvt) {
							var path = oEvt.getSource().sId;
							var listnum = path.split("-");
							listnum = listnum[listnum.length-1];
							var a=this.getView().byId("ViewDisruptionView--commentBox-ViewDisruptionView--disrptlist-" + listnum);
							a.setVisible(true);
							
						},
						
						onMarkSolved : function(oEvt) {
							var path = oEvt.getSource().getBindingContext(
									"disruptionModel").getPath();
							this.getView().getModel("disruptionModel").setProperty(
									path + "/Status", "Solved");
							this.getView().getModel("disruptionModel").setProperty(
									path + "/commentVisible", "false");
							this.getView().getModel("disruptionModel").setProperty(
									path + "/message", " ");
							oEvt.getSource().setType("Accept");

						},
						
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
					
					onCloseOperationDetailPopup : function() {

						airbus.mes.stationtracker.operationDetailPopup.close();
						airbus.mes.shell.oView.getController()
								.renderStationTracker();
					}

				});