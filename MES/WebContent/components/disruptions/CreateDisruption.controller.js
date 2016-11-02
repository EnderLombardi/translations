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
					onInit : function() {
					//	 this.loadDisruptionCustomData();
					},

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
						path : "category",
						attr : "category",
						childs : [ {
							id : "selectReasonTree",
							type : "select",
							path : "line",
							attr : "line",
							childs : [ {
								id : "selectRootCause",
								type : "select",
								path : "rootCause",
								attr : "rootCause",
								childs : []
							},
							{
								id : "Return",
								type : "Return",
								childs : []
							}]
						}, {
							id : "selectResponsible",
							type : "select",
							path : "responsible",
							attr : "responsible",
							childs : []
						} ]
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

						if (id === "selectCatogory") {
							this.setEnabledSelectBox(true, true, false, false);
						} else if (id === "selectReasonTree") {
							this.setEnabledSelectBox(true, true, true, false);
						} else {
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
									.getValue();
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

						var sObject = this.getView().byId("object").getKey();
						var sGravity = this.getView().byId("gravity").getKey();
						var sNature = this.getView().byId("nature").getKey();
						var sHelp = this.getView().byId("help").getKey();
						var dOpenDate = this.getView().byId("openDate")
								.getDateValue();
						var dExpectedDate = this.getView().byId("expectedDate")
								.getDateValue();
						var dOpenTime = this.getView().byId("openTime")
								.getDateValue();
						var dExpectedTime = this.getView().byId("expectedTime")
								.getDateValue();

						// Convert input to XML format
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
				// onAfterRendering: function() {
				//
				// },
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