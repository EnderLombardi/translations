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

					/***********************************************************
					 * Create Disruption
					 */
					// get selected jig Tools
					getSelectedJIg_Tool : function() {
						var getTokens = sap.ui.getCore().byId(
								"createDisruptionView--jigtools").getTokens();
						var result;
						getTokens.forEach(function(entry) {
							if (result == undefined)
								result = entry.getText();
							else
								result = result + "," + entry.getText();
						});
						return result;
					},
					// get selected jig Tools
					getSelectedMaterials : function() {
						var getTokens = sap.ui.getCore().byId(
								"createDisruptionView--materials").getTokens();
						var result;
						getTokens.forEach(function(entry) {
							if (result == undefined)
								result = entry.getText();
							else
								result = result + "," + entry.getText();
						});
						return result;
					},

					onCreateDisruption : function() {

						var oView = airbus.mes.disruptions.oView.createDisruption;
						var jigtools = oView.getController()
								.getSelectedJIg_Tool();
						var Materials = oView.getController()
								.getSelectedMaterials();
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

						// forcefully set handle as the first item in the list
						// after selecting Category, Reason, Responsible and
						// RootCasue,
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
										"value" : "SFCBO:"
												+ airbus.mes.settings.ModelManager.site
												+ ","
												+ sap.ui
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
										"value" : "WorkCenterBO:"
												+ airbus.mes.settings.ModelManager.site
												+ ","
												+ airbus.mes.settings.ModelManager.station
									}, {
										"attribute" : "MATERIALS",
										"value" : Materials
									}, {
										"attribute" : "JIG_TOOLS",
										"value" : jigtools
									} ]

						}
						aModelData.push(oJson);

						var sDescription = oView.byId("description").getValue();
						// message subject is passed as description because
						// subject is compulsory
						airbus.mes.disruptions.ModelManager.createDisruption(
								sHandle, sCategory, sDescription, sComment,
								aModelData);
					},

					/***********************************************************
					 * Validate inputs while creating/updating disruption
					 */
					validateDisruptionInput : function(oView) {
						if (oView.byId("description").getValue() == "") {
							airbus.mes.shell.ModelManager.messageShow(oView
									.getModel("i18nModel").getProperty(
											"CompulsaryDescription"));
							return false;
						} else if (oView.byId("selectCategory")
								.getSelectedKey() == "") {
							airbus.mes.shell.ModelManager.messageShow(oView
									.getModel("i18nModel").getProperty(
											"CompulsaryCategory"));
							return false;
						} else if (oView.byId("selectreason").getSelectedKey() == "") {
							airbus.mes.shell.ModelManager.messageShow(oView
									.getModel("i18nModel").getProperty(
											"CompulsaryReason"));
							return false;
						} else if (oView.byId("selectResponsible")
								.getSelectedKey() == "") {
							airbus.mes.shell.ModelManager.messageShow(oView
									.getModel("i18nModel").getProperty(
											"CompulsaryResponsible"));
							return false;
						} else if (oView.byId("selectOriginator")
								.getSelectedKey() == "") {
							airbus.mes.shell.ModelManager.messageShow(oView
									.getModel("i18nModel").getProperty(
											"CompulsaryOriginator"));
							return false;
						} else if (oView.byId("expectedDate").getValue() == ""
								|| oView.byId("expectedTime").getValue() == "") {
							airbus.mes.shell.ModelManager.messageShow(oView
									.getModel("i18nModel").getProperty(
											"CompulsaryExpectedDateTime"));
							return false;
						}
					},

					/***********************************************************
					 * For originator - update will be done for Comment, Reason,
					 * Responsible Group, Time lost , Expected date/time and
					 * Root Cause.
					 */
					onUpdateDisruption : function() {
						var oView = airbus.mes.disruptions.oView.createDisruption;

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
						var dPromisedTime = oView.byId("promisedDate")
								.getValue()
								+ " " + oView.byId("promisedTime").getValue()
						// call update service
						airbus.mes.disruptions.ModelManager.updateDisruption(
								sMessageRef, sReason, sResponsibleGroup,
								sRootCause, iTimeLost, dFixedByTime, sComment,
								iGravity, dPromisedTime);

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
											oModel.getProperty("/RootCause"));

							this.getView().byId("gravity").setSelectedKey(
									oModel.getProperty("/Gravity"));

							this.getView().byId("timeLost").setValue(
									oModel.getProperty("/TimeLost"));
							this.getView().byId("status").setValue(
									oModel.getProperty("/Status"));
							this.getView().byId("description").setValue(
									oModel.getProperty("/Description"));
							this.getView().byId("comment").setValue();
							this.initializeTree();

							// Disable/Enable inputs according to
							// Originator/Resolution Group
							var origFlag = sap.ui.getCore().getModel(
									"DisruptionDetailModel").getData().OriginatorFlag;

							var resFlag = sap.ui.getCore().getModel(
									"DisruptionDetailModel").getData().ResponsibleFlag;

							if (origFlag != "X" && resFlag == "X") {
								this.resolutionGroupSettings();
							} else
								this.originatorGroupSettings();

						} else {

							// expected date and time are not cleared in reset
							// all fields as formatter has to be applied
							this.getView().byId("expectedDate").setValue();
							this.getView().byId("expectedTime").setValue();

							this.initializeTree();
							if (this.getView().byId("selectOriginator")
									.getItems().length == 1)

								this.getView().byId("selectOriginator")
										.setSelectedKey(
												this.getView().byId(
														"selectOriginator")
														.getItemAt(0).getKey());

							// Enable fields for creation
							this.createDisruptionSettings();

						}
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

					resolutionGroupSettings : function() {

						this.setEnabledSelectBox(false, false, true, true);
						this.getView().byId("selectOriginator").setEnabled(
								false);
						this.getView().byId("description").setEnabled(false);
						this.getView().byId("promisedDate").setEnabled(true);
						this.getView().byId("promisedTime").setEnabled(true);
						this.getView().byId("expectedDate").setEnabled(false);
						this.getView().byId("expectedTime").setEnabled(false);
						this.getView().byId("gravity").setEnabled(false);
						this.getView().byId("timeLost").setEnabled(false);
						this.getView().byId("materials").setEnabled(false);
						this.getView().byId("jigtools").setEnabled(false);

						// promised date has to be visible while editing
						this.getView().byId("promisedDateLabel").setVisible(
								true);
						this.getView().byId("promisedDate").setVisible(true);
						this.getView().byId("promisedTime").setVisible(true);
					},

					originatorGroupSettings : function() {

						this.setEnabledSelectBox(false, true, true, true);
						this.getView().byId("selectOriginator").setEnabled(
								false);
						this.getView().byId("description").setEnabled(false);
						this.getView().byId("promisedDate").setEnabled(false);
						this.getView().byId("promisedTime").setEnabled(false);
						this.getView().byId("expectedDate").setEnabled(true);
						this.getView().byId("expectedTime").setEnabled(true);
						this.getView().byId("gravity").setEnabled(true);
						this.getView().byId("timeLost").setEnabled(false);
						this.getView().byId("materials").setEnabled(false);
						this.getView().byId("jigtools").setEnabled(false);

						// promised date has to be visible while editing
						this.getView().byId("promisedDateLabel").setVisible(
								true);
						this.getView().byId("promisedDate").setVisible(true);
						this.getView().byId("promisedTime").setVisible(true);
					},

					createDisruptionSettings : function() {

						this.setEnabledSelectBox(true, false, false, false);
						this.getView().byId("selectOriginator")
								.setEnabled(true);
						this.getView().byId("description").setEnabled(true);
						this.getView().byId("timeLost").setEnabled(true);
						this.getView().byId("expectedDate").setEnabled(true);
						this.getView().byId("expectedTime").setEnabled(true);
						this.getView().byId("gravity").setEnabled(true);
						this.getView().byId("timeLost").setEnabled(true);
						this.getView().byId("materials").setEnabled(true);
						this.getView().byId("jigtools").setEnabled(true);

						// at the time of creation promised date would be
						// invisible
						this.getView().byId("promisedDateLabel").setVisible(
								false);
						this.getView().byId("promisedDate").setVisible(false);
						this.getView().byId("promisedTime").setVisible(false);

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

						var currentPage = nav.getCurrentPage().getId();
						
						var oOperDetailNavContainer;
						
						if(currentPage == "stationTrackerView")
							oOperDetailNavContainer = sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer");

						
						else if(currentPage == "disruptiontrackerView")
							oOperDetailNavContainer = sap.ui.getCore().byId("disruptionDetailPopup--disruptDetailNavContainer");
						

						oOperDetailNavContainer.back();
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
						/*
						 * this.getView().byId("expectedDate").setValue();
						 * this.getView().byId("expectedTime").setValue();
						 */
						this.getView().byId("timeLost").setValue();
						this.getView().byId("comment").setValue();
						this.getView().byId("description").setValue();

						this.getView().byId("materials").destroyTokens();
						this.getView().byId("jigtools").destroyTokens();

					},

					/***********************************************************
					 * requesting material list to select on create disruption
					 **********************************************************/

					onMaterialValueHelpRequest : function() {
						if (!this._materialListDialog) {

							this._materialListDialog = sap.ui
									.xmlfragment(
											"airbus.mes.disruptions.fragment.MaterialList",
											this);

							this.getView().addDependent(
									this._materialListDialog);

						}

						this._materialListDialog.open();
					},

					/***********************************************************
					 * Adds new free text Material along with quantity to the
					 * list
					 */
					addNewMaterialToList : function() {

						var oModelData = sap.ui.getCore().getModel(
								"MaterialListModel").getProperty(
								"/MaterialList");

						if (sap.ui.getCore().byId("customMaterial").getValue() != "") {

							/*
							 * var oNewMaterial = { "Material" :
							 * sap.ui.getCore().byId(
							 * "customMaterial").getValue() }
							 * 
							 * oModelData.push(oNewMaterial);
							 * oModelData.splice(0, 0, oNewMaterial);
							 * sap.ui.getCore().getModel("MaterialListModel")
							 * .refresh();
							 * 
							 * var oNewMaterialItem = sap.ui.getCore().byId(
							 * "materialList").getItems()[0];
							 * oNewMaterialItem.getContent()[0].getContent()[0]
							 * .getItems()[1].getItems()[1]
							 * .setValue(sap.ui.getCore().byId(
							 * "customMaterialQty").getValue());
							 * sap.ui.getCore().byId("materialList")
							 * .setSelectedItem(oNewMaterialItem, true);
							 */

							// make an Item to add in the list. var
							oMaterialItem = new sap.m.CustomListItem(
									{
										content : new sap.ui.layout.Grid(
												{
													defaultSpan : "L12 M12 S12",
													content : new sap.m.HBox(
															{
																justifyContent : "SpaceBetween",
																alignContent : "SpaceBetween",
																alignItems : "Center",
																items : [
																		new sap.m.Title(
																				{
																					textAlign : "Center",
																					level : "H3",
																					text : sap.ui
																							.getCore()
																							.byId(
																									"customMaterial")
																							.getValue()
																				}),
																		new sap.m.VBox(
																				{
																					width : "20%",
																					items : [
																							new sap.m.Label(
																									{
																										text : "Quantity"
																									}),
																							new sap.m.Input(
																									{
																										type : "Number",
																										width : "80%",
																										value : sap.ui
																												.getCore()
																												.byId(
																														"customMaterialQty")
																												.getValue()
																									})
																									.addStyleClass("inputQty") ]
																				}) ]
															})
												})

									}).addStyleClass("customListItemPadding")
							// *
							// add item in starting of the Material List
							sap.ui.getCore().byId("materialList").insertItem(
									oMaterialItem, 0);

							// by default select this item
							sap.ui.getCore().byId("materialList")
									.setSelectedItem(oMaterialItem, true);

						}

					},

					/***********************************************************
					 * show selected material list to user in create disruption
					 * view
					 **********************************************************/
					handleSelectMaterialList : function(oEvent) {

						var aSelectedItems = sap.ui.getCore().byId(
								"materialList").getSelectedItems();

						/*
						 * remove all token already present in the MultiInput
						 * the already selected tokens will be selected in the
						 * MaterialList Dialog already so there will be no
						 * chance of data loss
						 */
						sap.ui.getCore()
								.byId("createDisruptionView--materials")
								.removeAllTokens();
						sap.ui.getCore()
								.byId("createDisruptionView--materials")
								.setValue();

						// for each Item add token to MaterialInput
						aSelectedItems
								.forEach(function(item, index) {
									// if any selected item doesnt contain qty
									// set it to 1.
									if (item.getContent()[0].getContent()[0]
											.getItems()[1].getItems()[1]
											.getValue() == "")
										item.getContent()[0].getContent()[0]
												.getItems()[1].getItems()[1]
												.setValue(1);
									var oToken = new sap.m.Token(
											{
												key : item.getContent()[0]
														.getContent()[0]
														.getItems()[0]
														.getText(),
												text : item.getContent()[0]
														.getContent()[0]
														.getItems()[0]
														.getText()
														+ "("
														+ item.getContent()[0]
																.getContent()[0]
																.getItems()[1]
																.getItems()[1]
																.getValue()
														+ ")"

											});
									sap.ui.getCore().byId(
											"createDisruptionView--materials")
											.addToken(oToken);
								});

						this._materialListDialog.close();
					},

					/***********************************************************
					 * On token change in MultiInput field directly, we need to
					 * restrict it
					 **********************************************************/

					onMaterialTokenChange : function() {
						this.onMaterialValueHelpRequest();
					},

					handleCancelMaterialList : function() {
						this._materialListDialog.close();
					},

					/***********************************************************
					 * on click of value help request in jig and tools
					 * 
					 */
					onJigToolValueHelpRequest : function() {
						if (!this.jigToolSelectDialog) {

							this.jigToolSelectDialog = sap.ui.xmlfragment(
									"airbus.mes.disruptions.fragment.Jigtool",
									this);

							this.getView().addDependent(
									this.jigToolSelectDialog);

						}
						this.jigToolSelectDialog.open();

					},
					/***********************************************************
					 * Adds new free jig tool along with quantity to the list
					 */
					addNewJigToolToList : function() {

						var oModelData = sap.ui.getCore().getModel(
								"MaterialListModel").getProperty(
								"/MaterialList");

						if (sap.ui.getCore().byId("customJigTool").getValue() != "") {

							// make an Item to add in the list.

							var oJigToolItem = new sap.m.CustomListItem(
									{
										content : new sap.ui.layout.Grid(
												{
													defaultSpan : "L12 M12 S12",
													content : new sap.m.HBox(
															{
																justifyContent : "SpaceBetween",
																alignContent : "SpaceBetween",
																alignItems : "Center",
																items : [
																		new sap.m.Title(
																				{
																					textAlign : "Center",
																					level : "H3",
																					text : sap.ui
																							.getCore()
																							.byId(
																									"customJigTool")
																							.getValue()
																				}),
																		new sap.m.VBox(
																				{
																					width : "20%",
																					items : [
																							new sap.m.Label(
																									{
																										text : "Quantity"
																									}),
																							new sap.m.Input(
																									{
																										type : "Number",
																										width : "80%",
																										value : sap.ui
																												.getCore()
																												.byId(
																														"jigToolQty")
																												.getValue()
																									})
																									.addStyleClass("inputQty") ]
																				}) ]
															})
												})

									}).addStyleClass("customListItemPadding")
							// *
							// add item in starting of the Material List
							sap.ui.getCore().byId("jigToolList").insertItem(
									oJigToolItem, 0);

							// by default select this item
							sap.ui.getCore().byId("jigToolList")
									.setSelectedItem(oJigToolItem, true);

						}

					},

					/***********************************************************
					 * on click cancel value help jigTool Box
					 * 
					 */

					onjigToolValueHelpCancel : function() {
						this.jigToolSelectDialog.close();

					},

					/***********************************************************
					 * on click ok value help jigTool Box
					 * 
					 */

					onjigToolValueHelpOk : function(oEvt) {
						var aSelectedItems = sap.ui.getCore().byId(
								"jigToolList").getSelectedItems();

						/*
						 * remove all token already present in the MultiInput
						 * the already selected tokens will be selected in the
						 * MaterialList Dialog already so there will be no
						 * chance of data loss
						 */
						sap.ui.getCore().byId("createDisruptionView--jigtools")
								.removeAllTokens();
						sap.ui.getCore().byId("createDisruptionView--jigtools")
								.setValue();

						// for each Item add token to MaterialInput
						aSelectedItems
								.forEach(function(item, index) {
									// if any selected item doesnt contain qty
									// set it to 1.
									if (item.getContent()[0].getContent()[0]
											.getItems()[1].getItems()[1]
											.getValue() == "")
										item.getContent()[0].getContent()[0]
												.getItems()[1].getItems()[1]
												.setValue(1);
									var oToken = new sap.m.Token(
											{
												key : item.getContent()[0]
														.getContent()[0]
														.getItems()[0]
														.getText(),
												text : item.getContent()[0]
														.getContent()[0]
														.getItems()[0]
														.getText()
														+ "("
														+ item.getContent()[0]
																.getContent()[0]
																.getItems()[1]
																.getItems()[1]
																.getValue()
														+ ")"

											});
									sap.ui.getCore().byId(
											"createDisruptionView--jigtools")
											.addToken(oToken);
								});

						this.jigToolSelectDialog.close();
					},
					onJigToolTokenChange : function() {
						this.onJigToolValueHelpRequest();
					},

				/**
				 * Called when the Controller is destroyed. Use this one to free
				 * resources and finalize activities.
				 * 
				 * @memberOf airbus.mes.components.disruptions.CreateDisruption
				 */
				/*
				 * onExit: function() { }
				 */
				});
