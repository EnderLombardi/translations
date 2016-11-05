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
									path : "RootCause",
									attr : "RootCause",
									childs: [{
										id : "handle",
										type : "select",
										path : "Handle",
										attr : "Handle",
										childs: []},
										{
											id : "Return",
											type : "Return",
											childs : []
										}
									         ]},  ]
							} ]
						}, ]
					},
					ModelManager : undefined,
					onInit : function() {

						this.addParent(this.selectTree, undefined);
						this.ModelManager = airbus.mes.disruptions.ModelManager;
						this.getView().byId("selectReasonTree").setSelectedKey();
						this.getView().byId("selectRootCause").setSelectedKey();
						this.getView().byId("selectResponsible").setSelectedKey();
						this.setEnabledSelectBox(true,false,false,false);
						
						//this.filterField(this.selectTree);
						

						this.addParent(this.selectTree, undefined);
						this.ModelManager = airbus.mes.settings.ModelManager;
						
						/*this.getView().core.setModel(new sap.ui.model.json.JSONModel(),
						"disruptionCustomData");*/
						

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
							this.setEnabledSelectBox(true, true, false, false);
						} else if (id === "selectReasonTree") {
							this.setEnabledSelectBox(true, true, true, false);
						} else if (id === "selectResponsible") {
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
						this.getView().byId("selectReasonTree").setEnabled(
								fReason);
						this.getView().byId("selectRootCause").setEnabled(
								fRootCause);
						this.getView().byId("selectResponsible").setEnabled(
								fResponsible);

					},
					/***********************************************************
					 * Create Disruption
					 */
					onCreateDisrupution : function() {
						
						// forfully set handle as the first item in the list after selecting Category, Reason, Responsible and rootcasue,
						//As this handle will act as a unique key for selection
						this.getView().byId("handle").setSelectedKey(this.getView().byId("handle").getItemAt(0).getText());
						var sCategory = this.getView().byId("selectCategory").getSelectedKey();
						var sRootCause = this.getView().byId("selectRootCause").getSelectedKey();			
						var sComment = this.getView().byId("comment").getValue();
						var sHandle = this.getView().byId("handle").getSelectedKey();
						
						// Create a JSON for payload attributes
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
									"value": this.getView().byId("comment").getValue()
								},
								{
									"attribute" : "REASON",
									"value": this.getView().byId("selectReasonTree").getSelectedKey()
								},
								{
									"attribute" : "TIME_LOST",
									"value": this.getView().byId("timeLost").getValue()
								},
								{
									"attribute" : "REQD_FIX_BY",
									"value": this.getView().byId("expectedDate").getValue()+" "+this.getView().byId("expectedTime").getValue()
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

							
						airbus.mes.disruptions.ModelManager.createDisruption(sHandle,sCategory,sRootCause,sComment,aModelData);
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
				 
				 onCloseCreateDisruption :function() {
					 airbus.mes.stationtracker.operationDetailPopup.close();
						airbus.mes.shell.oView.getController()
								.renderStationTracker();
					 
				 },
				 
				 onCancelCreateDisruption: function(){
					 
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