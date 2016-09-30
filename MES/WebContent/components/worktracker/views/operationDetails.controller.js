sap.ui
		.controller(
				"airbus.mes.worktracker.views.operationDetails",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf worktracker.views.home
					 */
					onInit : function() {

						// Model for Document List
						sap.ui.getCore().setModel(
								new sap.ui.model.json.JSONModel(),
								"documentsNameModel");
						sap.ui.getCore().getModel("documentsNameModel")
								.loadData("local/document.json", null, false);

						// Model for Disruption Data
						var oModel = new sap.ui.model.json.JSONModel();
						this.getView().setModel(oModel, "disruptionModel");
						oModel.loadData("local/data.json", null, false);

						// Model for Task List data
						this.getView().setModel(
								new sap.ui.model.json.JSONModel(), "tasklist");
						this.getView().getModel("tasklist").loadData(
								"local/tasklist.json", null, false);

						// get route
						this.getOwnerComponent().getRouter().getRoute(
								"operationDetails").attachMatched(
								this._onRouteMatched, this);

					},

					_onRouteMatched : function(oEvent) {
						// save the current query state
						this._oRouterArgs = oEvent.getParameter("arguments");
						var aFilter = [];
						aFilter.push(new sap.ui.model.Filter("ProductName",
								sap.ui.model.FilterOperator.Contains,
								this._oRouterArgs))

					},

					onCreateDisruption : function() {
						this.getView().byId("FormToolbar").setVisible(true);
						this.getView().byId("disruptionsHeader").setVisible(
								false);
					},
					onCancelCreateDisruption : function() {
						this.getView().byId("disruptionsHeader").setVisible(
								true);
						this.getView().byId("FormToolbar").setVisible(false);

					},

					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf worktracker.views.home
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
					 * @memberOf worktracker.views.home
					 */
					onAfterRendering : function() {

						// Set colors for Count on Icon Bar
						util.Functions.addCountTextClass("operationNav");

						// Set Progress Screen according to status of operation
						if (this.getView().byId("operationStatus").getText() === "Not Started") {
							this.setProgressScreenBtn(false, false, true);
							this.getView().byId("progressSlider").setEnabled(
									false);

						}
					},

					/**
					 * Called when the Controller is destroyed. Use this one to
					 * free resources and finalize activities.
					 * 
					 * @memberOf worktracker.views.home
					 */
					onExit : function() {
					},

					// Functions for Sub Header
					navigateHome : function() {
						window.history.go(-1);
					},

					expandOperationDetailPanel : function(oEvent) {
						this.getView().byId("opDetailExpandButton")
								.toggleStyleClass("invisible");
						this.getView().byId("operationDetailPanel")
								.setExpanded();
					},

					toggleMessagesPopOver : function(oEvt) {

						util.Functions.handleMessagePopOver(this, oEvt);
					},

					/* Progress Functions */

					addProgress : function() {
						oProgressSlider = this.getView().byId("progressSlider");
						oProgressSlider.stepUp(1);
					},

					reduceProgress : function() {
						oProgressSlider = this.getView().byId("progressSlider");
						oProgressSlider.stepDown(1);
					},

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

					activateOperation : function() {
						this.setProgressScreenBtn(true, true, false);
						this.getView().byId("progressSlider").setEnabled(true);
						this.getView().byId("operationStatus").setText(
								"In Progress");

						jQuery.ajax({
							url : airbus.mes.worktracker.util.ModelManager
									.getUrlSingleOperation(),
							error : function(xhr, status, error) {
								airbus.mes.worktracker.util.ModelManager
										.messageShow("Error");

							},
							success : function(result, status, xhr) {
								// window.location.href = url;
								airbus.mes.worktracker.util.ModelManager
										.messageShow("Success");
							}
						})
					},
					pauseOperation : function() {
						this.setProgressScreenBtn(false, false, true);
						this.getView().byId("progressSlider").setEnabled(false);
						this.getView().byId("btnActivate").setType("Accept");
						this.getView().byId("operationStatus")
								.setText("Paused");
					},
					confirmOperation : function() {
						if (!this._oPartialConfirmDialog) {

							this._oPartialConfirmDialog = sap.ui
									.xmlfragment(
											"airbus.mes.worktracker.fragments.operationConfirmDialog",
											this);

							this.getView().addDependent(
									this._oPartialConfirmDialog);
						}
						this._oPartialConfirmDialog.open();
						/*
						 * var iProgress =
						 * this.getView().byId("progressSlider").getValue();
						 * this.getView().byId("progressSlider").setMin(iProgress);
						 */
					},
					completeOperation : function() {
						if (!this._oFullConfirmDialog) {

							this._oFullConfirmDialog = sap.ui
									.xmlfragment(
											"airbus.mes.worktracker.fragments.operationCompleteDialog",
											this);

							this.getView().addDependent(
									this._oFullConfirmDialog);
						}
						this._oFullConfirmDialog.open();
					},

					onCancelConfirmation : function() {
						this._oPartialConfirmDialog.close();
					},

					onPartialConfirmation : function() {
						/*
						 * this.getView().byId("progressSlider").addStyleClass("progressSliderColorBlue");
						 * this.getView().byId("progressSlider").removeStyleClass("progressSliderColorGreen");
						 */
						this._oPartialConfirmDialog.close();
					},

					onCancelFullConfirmation : function() {
						this._oFullConfirmDialog.close();
					},

					onFullConfirmation : function() {
						this.getView().byId("progressSlider").addStyleClass(
								"progressSliderColorBlue");
						/* this.getView().byId("progressSlider").removeStyleClass("progressSliderColorGreen"); */
						this._oFullConfirmDialog.close();

						this.setProgressScreenBtn(false, false, false);
						this.getView().byId("progressSlider").setValue(100);
						this.getView().byId("progressSlider").setEnabled(false);
						this.getView().byId("operationStatus").setText(
								"Completed");

					},
					showCommentBox : function(oEvt) {
						var path = oEvt.getSource().getBindingContext(
								"disruptionModel").getPath();
						this.getView().getModel("disruptionModel").setProperty(
								path + "/commentVisible", "true");
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
					onCreateDisrupt : function() {

						var oNewDisruptionData = {
							"Gravity" : this.getView().byId("Gravity")
									.getSelectedKey(),
							"Object" : this.getView().byId("Object")
									.getSelectedKey(),
							"Nature" : this.getView().byId("Nature")
									.getSelectedKey(),
							"Help" : this.getView().byId("Help")
									.getSelectedKey(),
							"Open Date" : this.getView().byId("opendate")
									.getValue(),
							"Time" : this.getView().byId("time").getValue(),
							"Expected" : this.getView().byId("Expected")
									.getValue(),
							"TimeEx" : this.getView().byId("time2").getValue(),
							"Status" : "Pending",
							"message" : this.getView().byId("addMessage")
									.getValue(),
							"commentVisible" : "false"
						};
						this.getView().getModel("disruptionModel").getProperty(
								"/Disruption").push(oNewDisruptionData);
						this.getView().getModel("disruptionModel").refresh();
						this.getView().byId("disruptionsHeader").setVisible(
								true);
						this.getView().byId("FormToolbar").setVisible(false);

					}
				/*
				 * onLiveChangetxtArea:function(){
				 * this.getView().byId("addMessage").getValue(); }
				 */

				});