sap.ui
		.controller(
				"airbus.mes.operationdetail.operationDetail",
				{
					reasonCodeText : undefined,
					operationStatus : undefined,
					disruptionsFlag: false,
					disruptionCustomDataflag : false,

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf components.operationdetail.operationDetail
					 */
					onInit : function() {
						this.nav = this.getView()
								.byId("operDetailNavContainer");
						if (airbus.mes.operationdetail.status === undefined
								|| airbus.mes.operationdetail.status.oView === undefined) {
							sap.ui.getCore().createComponent({
								name : "airbus.mes.operationdetail.status",
							});
							this.nav
									.addPage(airbus.mes.operationdetail.status.oView);
						}
					},
					expandOperationDetailPanel : function(oEvent) {
						var toggleButton = this.getView().byId(
								"opDetailExpandButton");
						toggleButton.setVisible(!toggleButton.getVisible());
						
						var toggleButton2 = this.getView().byId(
						"opDetailCloseButton");
						toggleButton2.setVisible(!toggleButton2.getVisible());						
						
						
						this.getView().byId("operationDetailPanel")
								.setExpanded();
					},
					
					onCloseOperationDetailPopup : function() {

						airbus.mes.stationtracker.operationDetailPopup.close();
						airbus.mes.shell.oView.getController()
								.renderStationTracker();
					},
					

					/**
					 * Similar to onBeforeRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf components.operationdetail.operationDetail
					 */
					onBeforeRendering : function() {

						//				
					},
					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf components.operationdetail.operationDetail
					 */
					onAfterRendering : function() {
						this.disruptionsFlag = false;
						
						// Navigation to Status every time pop-up is opened
						this.nav.to(airbus.mes.operationdetail.status.oView.getId());
						this.getView().byId("opDetailSegmentButtons").setSelectedButton(
								this.getView().byId("opDetailSegmentButtons").getButtons()[0].sId
						);

						// Collapse Operation Detail panel and show Expand
						// button
						this.getView().byId("opDetailExpandButton").setVisible(
								true);
						this.getView().byId("opDetailCloseButton").setVisible(
								false);
						this.getView().byId("operationDetailPanel")
								.setExpanded(false);

						/*
						 * // Load Reason Code Model // Model for Reason Code
						 * Comments airbus.mes.operationdetail.ModelManager
						 * .loadReasonCodeModel(); // Set Slider enabled or
						 * dis-abeled based on Status
						 * sap.ui.getCore().getModel("operationDetailModel")
						 * .refresh();
						 * 
						 * if (this.getView().byId("operationStatus").getText()
						 * === "Not Started" ||
						 * this.getView().byId("operationStatus") .getText() ===
						 * "Paused") {
						 * 
						 * this.setProgressScreenBtn(false, false, true);
						 * this.getView().byId("progressSlider").setEnabled(
						 * false); } else if
						 * (this.getView().byId("operationStatus") .getText()
						 * === "In Progress") {
						 * 
						 * this.setProgressScreenBtn(true, true, false);
						 * this.getView().byId("progressSlider").setEnabled(
						 * true); } else if
						 * (this.getView().byId("operationStatus") .getText()
						 * === "Blocked" ||
						 * this.getView().byId("operationStatus") .getText() ===
						 * "Confirmed") {
						 * 
						 * this.setProgressScreenBtn(false, false, false);
						 * this.getView().byId("progressSlider").setEnabled(
						 * false); this.getView().byId("progressSliderfirst")
						 * .setEnabled(false); }
						 * 
						 * $("#operationDetailsView--operationNav-content")
						 * .height( ($("#"+
						 * airbus.mes.operationdetail.parentId).height() -
						 * $("#operationDetailsView--operationDetailPanel").height() -
						 * $("#operationDetailsView--operationNav--header").height() -
						 * $("#operationDetailsView--operationStatusFooter").height()
						 * ));
						 */

					},

					/***********************************************************
					 * 
					 * Switch Execution Mode for Operation Detail
					 * 
					 * @param oEvent
					 */
					switchMode : function(oEvent) {
						var oSwitchButton = oEvent.getSource();

						if (oSwitchButton.getState() == true) {
							this.getView().byId("switchStatusLabel").setText(
									this.getView().getModel("i18n")
											.getProperty("Execution"));
							// this.setScreenforSwitchMode(true);

						} else {
							this.getView().byId("switchStatusLabel").setText(
									this.getView().getModel("i18n")
											.getProperty("ReadOnly"));
							// this.setScreenforSwitchMode(false);						
						}
						/*****set the buttons according to the status of operation mode ******/
						sap.ui.getCore().byId("idStatusView").rerender();
						sap.ui.getCore().byId("ViewDisruptionView").rerender();

						if(this.nav.getCurrentPage().getId() == "createDisruptionView")
							{
						sap.ui.getCore().byId("createDisruptionView").getController().onCancelCreateDisruption()
							}


			
						
					},
					
					/***********************************************************
					 * Click on segmented button to respective page
					 */
					openPage : function(oEvent) {
						var sItemKey = oEvent.getSource().getKey();

						switch (sItemKey) {

						case "status":
							if (airbus.mes.operationdetail.status === undefined
									|| airbus.mes.operationdetail.status.oView === undefined) {
								sap.ui.getCore().createComponent({
									name : "airbus.mes.operationdetail.status",
								});
								this.nav
										.addPage(airbus.mes.operationdetail.status.oView);
							}

							this.nav.to(airbus.mes.operationdetail.status.oView
									.getId());

							break;
						case "disruption":
							if (airbus.mes.operationdetail.viewDisruption === undefined
									|| airbus.mes.operationdetail.viewDisruption.oView === undefined) {
								sap.ui
										.getCore()
										.createComponent(
												{
													name : "airbus.mes.operationdetail.viewDisruption",
												});
								this.nav
										.addPage(airbus.mes.operationdetail.viewDisruption.oView);
							}

							this.nav
									.to(airbus.mes.operationdetail.viewDisruption.oView.getId());							
							break;
						}
					},
					
					renderViews: function(oEvent){
						
						switch(this.nav.getCurrentPage().sId){
						
						case "ViewDisruptionView":
							/**************************
							 * Load Disruption Data
							 *************************/
							if(!this.disruptionsFlag){
								var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
								airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO);
								this.disruptionsFlag = true;
							}
							break;
							
						case "createDisruptionView":
							/**************************
							 * Load Disruption Custom Data
							 *************************/
						//	sap.ui.getCore().getModel("DisruptionDetailModel").refresh();
							if(!this.disruptionsCustomDataFlag){
								airbus.mes.operationdetail.oView.setBusy(true); // Set Busy Indicator
								airbus.mes.disruptions.ModelManager.loadDisruptionCustomData();
								airbus.mes.disruptions.ModelManager.loadDisruptionCategory();
								this.disruptionsCustomDataFlag = true;
							}
							
							
							if(sap.ui.getCore().getModel("DisruptionDetailModel").getData() != undefined)
								{
								
								// fill select boxes on CreateDisruptionView for edit screen
								var oModel = sap.ui.getCore().getModel("DisruptionDetailModel");
								var oView = sap.ui.getCore().byId("createDisruptionView");
									oView.byId("selectCategory").setSelectedKey(oModel.getProperty("/MessageType"));
									//forced fireChange event on Category to get a good list in Responsible Group.
									oView.byId("selectCategory").fireChange(oView.byId("selectResponsible").getSelectedItem());
									
									oView.byId("selectResponsible").setSelectedKey(oModel.getProperty("/ResponsibleGroup"));
									//forced fireChange event on Responsible Group to get a good list in reason.
									//oView.byId("selectResponsible").fireChange(oView.byId("selectResponsible").getSelectedItem());
									
									
									oView.byId("selectReasonTree").setSelectedKey(oModel.getProperty("/Reason"));
									//forced fireChange event on Reason to get a good list in reason.
									//oView.byId("selectReasonTree").fireChange(oView.byId("selectResponsible").getSelectedItem());
									
									oView.byId("selectOriginator").setSelectedKey(oModel.getProperty("/OriginatorGroup"));
									oView.byId("selectRootCause").setSelectedKey(oModel.getProperty("/Subject"));
									
									airbus.mes.operationdetail.createDisruption.oView.oController.initializeTree();
									
									// Set only Root Cause enabled so that it can be edited in Edit Disruption
									airbus.mes.operationdetail.createDisruption.oView.oController.setEnabledSelectBox(false,true,true,true);
									
									//Set Update button visible
									oView.byId("updateDisruption").setVisible(true);
									oView.byId("cancelDisruption").setVisible(true);
								}
							break;
							
							
						
						};
						
					}

				});
