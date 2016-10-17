sap.ui
		.controller(
				"airbus.mes.settings.FilterPlantData",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf components.SettingScreen.FilterPlantData
					 */
					selectTree : {
						id : "ComboBoxProgram",
						type : "select",
						path : "program",
						attr : "program",
						childs : [ {
							id : "ComboBoxLine",
							type : "select",
							path : "line",
							attr : "line",
							childs : [ {
								id : "ComboBoxStation",
								type : "select",
								path : "station",
								attr : "station",
								childs : []
							}, {
								id : "ComboBoxMSN",
								type : "select",
								path : "msn",
								childs : []
							}, {
								id : "Return",
								type : "Return",
								childs : []
							} ]
						} ]
					},
					ModelManager : undefined,
					onInit : function() {

						this.addParent(this.selectTree, undefined);
						this.ModelManager = airbus.mes.settings.ModelManager;
						
						airbus.mes.settings.ModelManager
								.loadUserSettingsModel();
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

						if (id === "ComboBoxProgram") {
							this.setEnabledCombobox(true, true, false, false);
						} else if (id === "ComboBoxLine") {
							this.setEnabledCombobox(true, true, true, false);
						} else {
							this.setEnabledCombobox(true, true, true, true);
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
					loadPlantModel : function(oEvt) {
						airbus.mes.settings.ModelManager.site = this.getView()
								.byId("ComboBoxPlant").getValue();
						airbus.mes.settings.ModelManager.loadPlantModel();
						this.filterField(this.selectTree);
						this.getView().byId("ComboBoxProgram").setValue("");
						this.getView().byId("ComboBoxLine").setValue("");
						this.getView().byId("ComboBoxStation").setValue("");
						this.getView().byId("ComboBoxMSN").setValue("");


						this.setEnabledCombobox(true, false, false, false);
				},
				
					getUserSettings : function() {
						var oModel = this.ModelManager.core.getModel(
								"userSettingModel").getData();
						airbus.mes.settings.ModelManager.plant = oModel.Rowsets.Rowset[0].Row[0].plant;
						airbus.mes.settings.ModelManager.program = oModel.Rowsets.Rowset[0].Row[0].program;
						airbus.mes.settings.ModelManager.line = oModel.Rowsets.Rowset[0].Row[0].line;
						airbus.mes.settings.ModelManager.station = oModel.Rowsets.Rowset[0].Row[0].station;
						airbus.mes.settings.ModelManager.msn = oModel.Rowsets.Rowset[0].Row[0].msn;

						this.getView().byId("ComboBoxPlant").setValue(
								airbus.mes.settings.ModelManager.plant);
						if (airbus.mes.settings.ModelManager.plant) {
							this.loadPlantModel();
							if (airbus.mes.settings.ModelManager.program)
								this
										.getView()
										.byId("ComboBoxProgram")
										.setSelectedKey(
												airbus.mes.settings.ModelManager.program);
							if (airbus.mes.settings.ModelManager.line)
								this
										.getView()
										.byId("ComboBoxLine")
										.setSelectedKey(
												airbus.mes.settings.ModelManager.line);
							if (airbus.mes.settings.ModelManager.station)
								this
										.getView()
										.byId("ComboBoxStation")
										.setSelectedKey(
												airbus.mes.settings.ModelManager.station);
							if (airbus.mes.settings.ModelManager.msn)
								this
										.getView()
										.byId("ComboBoxMSN")
										.setSelectedKey(
												airbus.mes.settings.ModelManager.msn);

							this.setEnabledCombobox(true, true, true, true);
						} else {
							this.setEnabledCombobox(true, false, false, false);
						}
					},
					loadStationTracker : function(oEvent) {
						var that = this;
						if (!this.getView().byId("ComboBoxPlant").getValue()) {
							airbus.mes.settings.ModelManager
									.messageShow("Please Select Plant");
							return;
						} else if (!this.getView().byId("ComboBoxProgram")
								.getValue()) {
							airbus.mes.settings.ModelManager
									.messageShow("Please Select Progarm");
							return;
						} else if (!this.getView().byId("ComboBoxLine")
								.getValue()) {
							airbus.mes.settings.ModelManager
									.messageShow("Please Select Line");
							return;
						} else if (!this.getView().byId("ComboBoxStation")
								.getValue()) {
							airbus.mes.settings.ModelManager
									.messageShow("Please Select Staton");
							return;
						} else {
							this.ModelManager.plant = this.getView().byId(
									"ComboBoxPlant").getValue();
							airbus.mes.settings.ModelManager.program = this
									.getView().byId("ComboBoxProgram")
									.getValue();
							airbus.mes.settings.ModelManager.line = this
									.getView().byId("ComboBoxLine").getValue();
							airbus.mes.settings.ModelManager.station = this
									.getView().byId("ComboBoxStation")
									.getValue();
							airbus.mes.settings.ModelManager.msn = this
									.getView().byId("ComboBoxMSN").getValue();
							jQuery
									.ajax({
										url : airbus.mes.settings.ModelManager
												.getUrlSaveUserSetting(),
										error : function(xhr, status, error) {
											airbus.mes.settings.ModelManager
													.messageShow("Couldn't Save Changes");
											that.navigate(oEvent);
										},
										success : function(result, status, xhr) {
											// window.location.href = url;
											airbus.mes.settings.ModelManager
													.messageShow("Settings Saved Successfully");
											that.navigate(oEvent);

										}
									});
						}
					},
					navigate : function(oEvent) {

						// Active settings button during leaving settings screen
						if (airbus.mes.shell != undefined) {
							airbus.mes.shell.oView.byId("settingsButton")
									.setEnabled(true);
						}

						if (this.getOwnerComponent().mProperties.buttonAction === "stationtracker") {
							if (airbus.mes.stationtracker != undefined) {
								nav.to(airbus.mes.stationtracker.oView.getId());
							} 
							else{
								sap.ui.getCore().createComponent({
									name : "airbus.mes.stationtracker",
								});
								nav.addPage(airbus.mes.stationtracker.oView);
								nav.to(airbus.mes.stationtracker.oView.getId());
							}

						}
						else if (this.getOwnerComponent().mProperties.buttonAction === "worktracker") {
							airbus.mes.shell.util.navFunctions.worktracker();
						}
						else if (this.getOwnerComponent().mProperties.buttonAction === "back") {
							nav.back();
						}

					},

					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf application2.initialview
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
					 * @memberOf application2.initialview
					 */
					onAfterRendering : function() {
						this.getUserSettings();
						this.filterField(this.selectTree);
					},
					fromHomepage : true,

					setEnabledCombobox : function(fProg, fLine, fStation, fMsn) {
						this.getView().byId("ComboBoxProgram")
								.setEnabled(fProg);
						this.getView().byId("ComboBoxLine").setEnabled(fLine);
						this.getView().byId("ComboBoxStation").setEnabled(
								fStation);
						this.getView().byId("ComboBoxMSN").setEnabled(fMsn);

					},
				/**
				 * Called when the Controller is destroyed. Use this one to free
				 * resources and finalize activities.
				 * 
				 * @memberOf application2.initialview
				 */
				// onExit: function() {
				//
				// }
				});
