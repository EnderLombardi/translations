sap.ui
		.controller(
				"airbus.mes.disruptions.CreateDisruption",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf airbus.mes.components.disruptions.CreateDisruption
					 */
					/*
					 * onInit : function() { // this.loadDisruptionCustomData();
					 * this.addParent(this.selectTree, undefined); },
					 */

					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf airbus.mes.components.disruptions.CreateDisruption
					 */
					// onBeforeRendering: function() {
					//
					// },
					selectTree : {
						id : "selectCategory",
						type : "select",
						path : "MessageType",
						attr : "MessageType",
						childs : [ {
							id : "selectreason",
							type : "select",
							path : "Reason",
							attr : "Reason",
							/*
							 * childs : [ { id : "selectResponsible", type :
							 * "select", path : "ResponsibleGroup", attr :
							 * "ResponsibleGroup",
							 */
							childs : [ {
								id : "selectRootCause",
								type : "select",
								path : "RootCause",
								attr : "RootCause",
								childs : [ {
									id : "handle",
									type : "select",
									path : "Handle",
									attr : "Handle",
									childs : []
								}, {
									id : "Return",
									type : "Return",
									childs : []
								} ]
							}, ]
						/* } ] */
						}, {
							id : "selectResponsible",
							type : "select",
							path : "ResponsibleGroup",
							attr : "ResponsibleGroup",
							childs : []
						} ]
					},

					onInit : function() {
						// Set events on buttons
						sap.ui.getCore().byId(
								"operationDetailPopup--btnCreateDisruption")
								.attachPress(this.onCreateDisruption);
						sap.ui.getCore().byId(
								"operationDetailPopup--btnUpdateDisruption")
								.attachPress(this.onUpdateDisruption);
						sap.ui.getCore().byId(
								"operationDetailPopup--btnCancelDisruption")
								.attachPress(this.onCancelCreateDisruption);

						this.addParent(this.selectTree, undefined);
						/*
						 * this.ModelManager.loadDisruptionCustomData();
						 * this.ModelManager.loadDisruptionCategory();
						 */

						this.getView().byId("selectreason").setSelectedKey();
						this.getView().byId("selectRootCause").setSelectedKey();
						this.getView().byId("selectResponsible")
								.setSelectedKey();
						this.getView().byId("selectOriginator")
								.setSelectedKey();
						this.setEnabledSelectBox(true, false, false, false);

						// this.filterField(this.selectTree);

						// this.addParent(this.selectTree, undefined);
						// this.ModelManager = airbus.mes.settings.ModelManager;

						/*
						 * this.getView().core.setModel(new
						 * sap.ui.model.json.JSONModel(),
						 * "disruptionCustomData");
						 */

					},

					initializeTree : function() {
						this.addParent(this.selectTree, undefined);
					},

					addParent : function(oTree, oParent) {
						var that = this;
						oTree.parent = oParent;
						oTree.childs.forEach(function(oElement) {
							that.addParent(oElement, oTree);
						});
					},
					findElement : function(oTree, sId) {
						if (oTree.id == sId) {
							return oTree;
						} else {
							var oElement;
							for (var i = 0; i < oTree.childs.length; i++) {
								oElement = this.findElement(oTree.childs[i],
										sId);
								if (oElement) {
									return oElement;
								}
							}
						}
					},

					// *******************on change of item in the ComboBox
					// *******************
					onSelectionChange : function(oEvt) {
						var that = this;
						var id = oEvt.getSource().getId().split("--")[1];
						this.findElement(this.selectTree, oEvt.getSource()
								.getId().split("--")[1]).childs
								.forEach(function(oElement) {
									that.clearField(oElement);
									that.filterField(oElement);
								});

						if (id === "selectCategory") {
							this.setEnabledSelectBox(true, true, true, false);
						} else if (id === "selectreason") {
							this.setEnabledSelectBox(true, true, true, true);
						}

					},

					// ****************** clear other ComboBoxes after changing
					// the item of one comboBox *****
					clearField : function(oTree) {
						var that = this;
						if (oTree.type == "select") {
							that.getView().byId(oTree.id).setSelectedKey();
						}
						oTree.childs.forEach(that.clearField.bind(that));
					},

					filterField : function(oTree) {
						if (oTree.type == "Return") {
							return;
						}
						var that = this;
						var aFilters = [];
						var oElement = oTree.parent;
						while (oElement) {
							var val = this.getView().byId(oElement.id)
									.getSelectedKey();
							if (val) {
								var oFilter = new sap.ui.model.Filter(
										oElement.path, "EQ", val);
								aFilters.push(oFilter);
							}
							;
							oElement = oElement.parent;
						}
						;
						var temp = [];
						var duplicatesFilter = new sap.ui.model.Filter({
							path : oTree.path,
							test : function(value) {
								if (temp.indexOf(value) == -1) {
									temp.push(value)
									return true;
								} else {
									return false;
								}
							}
						});
						aFilters.push(duplicatesFilter);
						if (this.getView().byId(oTree.id).getBinding("items"))
							this.getView().byId(oTree.id).getBinding("items")
									.filter(
											new sap.ui.model.Filter(aFilters,
													true));

						oTree.childs.forEach(function(oElement) {
							that.filterField(oElement);
						});
					},

					setEnabledSelectBox : function(fCategory, fReason,
							fResponsible, fRootCause) {
						this.getView().byId("selectCategory").setEnabled(
								fCategory);
						this.getView().byId("selectreason").setEnabled(fReason);
						this.getView().byId("selectRootCause").setEnabled(
								fRootCause);
						this.getView().byId("selectResponsible").setEnabled(
								fResponsible);

					},
					/***********************************************************
					 * Create Disruption
					 */
					onCreateDisruption : function() {

						var oView = airbus.mes.operationdetail.createDisruption.oView;
						var oController = oView.getController();

						// some mandatory fields need to be filled before
						// creating a disruption.
						var bInputMissing = oController
								.validateDisruptionInput(oView);
						if (bInputMissing == false)
							return;
						
						
						var sCategory = oView.byId("selectCategory")
								.getSelectedKey();
						var sRootCause = oView.byId("selectRootCause")
								.getSelectedKey();
						var sComment = oView.byId("comment").getValue();

						// forfully set handle as the first item in the list
						// after selecting Category, Reason, Responsible and
						// rootcasue,
						// As this handle will act as a unique key for selection
						
						oView.byId("handle").setSelectedKey(
								oView.byId("handle").getItemAt(0).getText());

						var sHandle = oView.byId("handle").getSelectedKey();

						// Create a JSON for payload attributes
						var aModelData = []

						var oJson = {
							"payload" : [
									{
										"attribute" : "OPERATION_BO",
										"value" : sap.ui
												.getCore()
												.getModel(
														"operationDetailModel")
												.getProperty(
														"/Rowsets/Rowset/0/Row/0/operation_bo"),
									},
									{
										"attribute" : "SFC_BO",
										"value" : sap.ui
												.getCore()
												.getModel(
														"operationDetailModel")
												.getProperty(
														"/Rowsets/Rowset/0/Row/0/sfc"),
									},
									{
										"attribute" : "SFC_STEP_BO",
										"value" : sap.ui
												.getCore()
												.getModel(
														"operationDetailModel")
												.getProperty(
														"/Rowsets/Rowset/0/Row/0/sfc_step_ref"),
									},
									{
										"attribute" : "DESCRIPTION",
										"value" : oView.byId("description")
												.getValue()
									},
									{
										"attribute" : "REASON",
										"value" : oView.byId("selectreason")
												.getSelectedKey()
									},
									{
										"attribute" : "TIME_LOST",
										"value" : oView.byId("timeLost")
												.getValue()
									},
									{
										"attribute" : "REQD_FIX_BY",
										"value" : oView.byId("expectedDate")
												.getValue()
												+ " "
												+ oView.byId("expectedTime")
														.getValue()
									},
									{
										"attribute" : "GRAVITY",
										"value" : oView.byId("gravity")
												.getSelectedKey()
									},
									{
										"attribute" : "STATUS",
										"value" : oView.getModel("i18nModel")
												.getProperty("Pending")
									},
									{
										"attribute" : "ROOT_CAUSE",
										"value" : oView.byId("selectRootCause")
												.getSelectedKey()
									},
									{
										"attribute" : "MSN",
										"value" : airbus.mes.settings.ModelManager.msn
									},
									{
										"attribute" : "RESPONSIBLE_GROUP",
										"value" : oView.byId(
												"selectResponsible")
												.getSelectedKey()
									},
									{
										"attribute" : "ORIGINATOR_GROUP",
										"value" : oView
												.byId("selectOriginator")
												.getSelectedKey()
									},
									{
										"attribute" : "WORK_CENTER",
										"value" : airbus.mes.settings.ModelManager.station
									} ]

						}
						aModelData.push(oJson);

						var sDescription = oView.byId("description").getValue();
						// message subject is passed as description because
						// subject is compulsary
						airbus.mes.disruptions.ModelManager.createDisruption(
								sHandle, sCategory, sDescription, sComment,
								aModelData);
					},

					/***********************************************************
					 * Validate inputs while creating/updating disruption
					 */
					validateDisruptionInput : function(oView) {
						if (oView.byId("description").getValue() == "") {
							airbus.mes.shell.ModelManager
									.messageShow(oView.getModel("i18nModel")
											.getProperty("CompulsaryDescription"));
							return false;
						} else if (oView.byId("selectCategory")
								.getSelectedKey() == "") {
							airbus.mes.shell.ModelManager
									.messageShow(oView.getModel("i18nModel")
											.getProperty("CompulsaryCategory"));
							return false;
						} else if (oView.byId("selectreason").getSelectedKey() == "") {
							airbus.mes.shell.ModelManager
									.messageShow(oView.getModel("i18nModel")
											.getProperty("CompulsaryReason"));
							return false;
						} else if (oView.byId("selectResponsible")
								.getSelectedKey() == "") {
							airbus.mes.shell.ModelManager
									.messageShow(oView.getModel("i18nModel")
											.getProperty("CompulsaryResponsible"));
							return false;
						} else if (oView.byId("selectOriginator")
								.getSelectedKey() == "") {
							airbus.mes.shell.ModelManager
									.messageShow(oView.getModel("i18nModel")
											.getProperty("CompulsaryOriginator"));
							return false;
						} else if (oView.byId("expectedDate")
								.getValue() == "" || oView.byId("expectedTime")
								.getValue() == "") {
							airbus.mes.shell.ModelManager
									.messageShow(oView.getModel("i18nModel")
											.getProperty("CompulsaryExpectedDateTime"));
							return false;
						}
					},

					/***********************************************************
					 * For originator - update will be done for comment, Reason,
					 * Responsible Group, Time lost , Expected date/time and
					 * Root Cause.
					 */
					onUpdateDisruption : function() {
						var oView = airbus.mes.operationdetail.createDisruption.oView;

						var sMessageRef = sap.ui.getCore().getModel(
								"DisruptionDetailModel").getProperty(
								"/MessageRef")
						var sReason = oView.byId("selectreason")
								.getSelectedKey();
						var sResponsibleGroup = oView.byId("selectResponsible")
								.getSelectedKey();
						var sRootCause = oView.byId("selectRootCause")
								.getSelectedKey();
						var iTimeLost = oView.byId("timeLost").getValue()
						var dFixedByTime = oView.byId("expectedDate")
								.getValue()
								+ " " + oView.byId("expectedTime").getValue()
						var sComment = oView.byId("comment").getValue()
						var iGravity = oView.byId("gravity").getSelectedKey()

						// call update service
						airbus.mes.disruptions.ModelManager.updateDisruption(
								sMessageRef, sReason, sResponsibleGroup,
								sRootCause, iTimeLost, dFixedByTime, sComment,
								iGravity);

					},

					setDataForEditDisruption : function() {
						/*******************************************************
						 * Pre-fill fields in update request
						 */

						this.resetAllFields();
						if (sap.ui.getCore().getModel("DisruptionDetailModel")
								.getData() != undefined) {

							// fill select boxes on CreateDisruptionView for
							// edit screen
							var oModel = sap.ui.getCore().getModel(
									"DisruptionDetailModel");

							this.getView().byId("selectCategory")
									.setSelectedKey(
											oModel.getProperty("/MessageType"));
							// forced fireChange event on Category to get a
							// good list in Responsible Group.
							this.getView().byId("selectCategory").fireChange(
									this.getView().byId("selectCategory")
											.getSelectedItem());
							this
									.getView()
									.byId("selectResponsible")
									.setSelectedKey(
											oModel
													.getProperty("/ResponsibleGroup"));
							this.getView().byId("selectreason").setSelectedKey(
									oModel.getProperty("/Reason"));
							this
									.getView()
									.byId("selectOriginator")
									.setSelectedKey(
											oModel
													.getProperty("/OriginatorGroup"));
							this.getView().byId("selectRootCause")
									.setSelectedKey(
											oModel.getProperty("/Subject"));
							this.getView().byId("timeLost").setValue(
									oModel.getProperty("/TimeLost"));
							this.getView().byId("status").setValue(
									oModel.getProperty("/Status"));
							this.getView().byId("description").setValue(
									oModel.getProperty("/Description"));
							this.getView().byId("comment").setValue();
							this.initializeTree();
							this.setEnabledSelectBox(false, true, true, true);

						} else {

							this.initializeTree();
							this.setEnabledSelectBox(true, false, false, false);

						}
					},

					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf airbus.mes.components.disruptions.CreateDisruption
					 */
					/*
					 * onAfterRendering : function() { },
					 */

					/*
					 * onCloseCreateDisruption : function() {
					 * airbus.mes.stationtracker.operationDetailPopup.close();
					 * airbus.mes.shell.oView.getController()
					 * .renderStationTracker(); },
					 */

					onCancelCreateDisruption : function() {

						var oOperDetailNavContainer = sap.ui.getCore().byId(
								"operationDetailsView--operDetailNavContainer");

						if (airbus.mes.operationdetail.viewDisruption === undefined
								|| airbus.mes.operationdetail.viewDisruption.oView === undefined) {
							sap.ui
									.getCore()
									.createComponent(
											{
												name : "airbus.mes.operationdetail.viewDisruption",
											});

							oOperDetailNavContainer
									.addPage(airbus.mes.operationdetail.viewDisruption.oView);
						}

						oOperDetailNavContainer
								.to(airbus.mes.operationdetail.viewDisruption.oView
										.getId());
					},

					/***********************************************************
					 * Reset all the fields of Form create disruption
					 */
					resetAllFields : function() {
						this.getView().byId("selectCategory").setSelectedKey();
						this.getView().byId("selectreason").setSelectedKey();
						this.getView().byId("selectResponsible")
								.setSelectedKey();
						this.getView().byId("selectOriginator")
								.setSelectedKey();
						this.getView().byId("selectRootCause").setSelectedKey();
						this.getView().byId("gravity").setSelectedKey();
						this.getView().byId("expectedDate").setValue();
						this.getView().byId("expectedTime").setValue();
						this.getView().byId("timeLost").setValue();
						this.getView().byId("comment").setValue();
						this.getView().byId("description").setValue();
					}

				/**
				 * Called when the Controller is destroyed. Use this one to free
				 * resources and finalize activities.
				 * 
				 * @memberOf airbus.mes.components.disruptions.CreateDisruption
				 */
				// onExit: function() {
				//
				// }
				});
