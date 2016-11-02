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
	/*				onInit : function() {
						// this.loadDisruptionCustomData();
						this.addParent(this.selectTree, undefined);
					},*/

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
							id : "selectReasonTree",
							type : "select",
							path : "Reason",
							attr : "Reason",
							childs : [ {
								id : "selectResponsible",
								type : "select",
								path : "ResponsibleGroup",
								attr : "ResponsibleGroup",
								childs : [ {
									id : "selectRootCause",
									type : "select",
									path : "rootCause",
									attr : "rootCause",
									childs: []}, {
									id : "Return",
									type : "Return",
									childs : []
								} ]
							} ]
						}, ]
					},
					ModelManager : undefined,
					onInit : function() {

						this.addParent(this.selectTree, undefined);
						this.ModelManager = airbus.mes.disruptions.ModelManager;

						// airbus.mes.settings.ModelManager.loadUserSettingsModel();
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

					/*	if (id === "selectCatogory") {
							this.setEnabledSelectBox(true, true, false, false);
						} else if (id === "selectReasonTree") {
							this.setEnabledSelectBox(true, true, true, false);
						} else {
							this.setEnabledSelectBox(true, true, true, true);
						}*/

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
					loadDisruptionCustomData : function(oEvt) {
						/*
						 * airbus.mes.settings.ModelManager.site =
						 * this.getView() .byId("ComboBoxPlant").getValue();
						 * airbus.mes.settings.ModelManager.loadPlantModel();
						 */
						airbus.mes.disruption.ModelManager
								.loadDisruptionCustomData();
						this.filterField(this.selectTree);
						this.getView().byId("selectCategory").setValue("");
						this.getView().byId("selectReasonTree").setValue("");
						this.getView().byId("selectRootCause").setValue("");
						this.getView().byId("selectResponsible").setValue("");

						this.setEnabledSelectBox(true, false, false, false);
					},

					setEnabledSelectBox : function(fCategory, fReason,
							fResponsible, fRootCause) {
						this.getView().byId("selectCategory").setEnabled(
								fCategory);
						this.getView().byId("selectReasonTree").setEnabled(
								fReason);
						this.getView().byId("selectRootCause").setEnabled(
								fResponsible);
						this.getView().byId("selectResponsible").setEnabled(
								fRootCause);

					},
					/***********************************************************
					 * Create Disruption
					 */
					onCreateDisrupution : function() {

						var sCategory = this.getView().byId("selectCategory").getSelectedKey();
						var sGravity = this.getView().byId("gravity").getSelectedKey();
						var sReason = this.getView().byId("selectReason").getSelectedKey();
						var sResponsible = this.getView().byId("selectResponsibe").getSelectedKey();
						var sRootCause = this.getView().byId("selectRootCause").getSelectedKey();
						var dOpenDate = this.getView().byId("openDate")
								.getDateValue();
						var dExpectedDate = this.getView().byId("expectedDate")
								.getDateValue();
						var dOpenTime = this.getView().byId("openTime")
								.getDateValue();
						var dExpectedTime = this.getView().byId("expectedTime")
								.getDateValue();
						var iTimeLost = this.getView().byId("timeLost").getValue();
						
						var sComment = this.getView().byId("comment").getText();

						// Convert input to XML format
						
						var aModelData = []
						

							var oJson = {
								"payload":[{
									"attribute" : "OPERATION_BO",
									"value": sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/operation_bo"),
								},
								{
									"attribute" : "SFC_BO",
									"value": sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/sfc"),	
								},
								{
									"attribute" : "SFC_STEP_BO",
									"value": sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/sfc_step_ref"),	
								},
								{
									"attribute" : "DESCRIPTION",
									"value": this.getView().byId("comment").getText()
								},
								{
									"attribute" : "REASON",
									"value": this.getView().byId("selectReason").getSelectedKey()
								},
								{
									"attribute" : "TIME_LOST",
									"value": this.getView().byId("timeLost").getValue()
								},
								{
									"attribute" : "REQD_FIX_BY",
									"value": this.getView().byId("expectedDate")
									.getDateValue()+this.getView().byId("expectedTime")
									.getDateValue()
								},
								{
									"attribute" : "GRAVITY",
									"value": this.getView().byId("gravity").getSelectedKey()
								},
								{
									"attribute" : "STATUS",
									"value": this.getView().getModel("i18nModel").getProperty("Pending")
								},
								{
									"attribute" : "ROOT_CAUSE",
									"value": this.getView().byId("selectRootCause").getSelectedKey()
								},
								{
									"attribute" : "MSN",
									"value": airbus.mes.settings.ModelManager.msn
								}
								]
								
							}
							aModelData.push(oJson);

						
							
						airbus.mes.disruptions.ModelManager.createDisruption(
								sObject, sGravity, sNature, sHelp, dOpenDate,
								dExpectedDate, dOpenTime, dExpectedTime);
					},

				/**
				 * Called when the View has been rendered (so its HTML is part
				 * of the document). Post-rendering manipulations of the HTML
				 * could be done here. This hook is the same one that SAPUI5
				 * controls get after being rendered.
				 * 
				 * @memberOf airbus.mes.components.disruptions.CreateDisruption
				 */
				 onAfterRendering: function() {
					// this.filterField(this.selectTree);
				 },
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