sap.ui.controller("airbus.mes.settings.FilterPlantData",
		{

			/**
			 * Called when a controller is instantiated and its View controls
			 * (if available) are already created. Can be used to modify the
			 * View before it is displayed, to bind event handlers and do other
			 * one-time initialization.
			 * 
			 * @memberOf components.SettingScreen.FilterPlantData
			 */
			selectTree : {
				id : "ComboBoxProgram",
				type : "select",
				path : "tf",
				attr : "tf",
				childs : [ {
					id : "ComboBoxLine",
					type : "select",
					path : "assemblyLine",
					attr : "acpLine",
					childs : [ {
						id : "ComboBoxStation",
						type : "select",
						path : "PP_stationExec",
						attr : "stationExec",
						childs : []
					}, {
						id : "ComboBoxMSN",
						type : "select",
						path : "MSN",
						childs : []
					}, {
						id : "Return",
						type : "Return",
						childs : []
					} ]
				} ]
			},

			onInit : function() {

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
						oElement = this.findElement(oTree.childs[i], sId);
						if (oElement) {
							return oElement;
						}
					}
				}
			},

			// *******************on change of item in the ComboBox *******************
			onSelectionChange : function(oEvt) {
				var that = this;
				this.findElement(this.selectTree, oEvt.getSource().getId().split("--")[1]).childs
						.forEach(function(oElement) {
							that.clearField(oElement);
							that.filterField(oElement);
						});

			},

			// ****************** clear other ComboBoxes after changing the item of one comboBox *****
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
					var val = this.getView().byId(oElement.id).getValue();
					if (val) {
						var oFilter = new sap.ui.model.Filter(oElement.path,
								"EQ", val);
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

				this.getView().byId(oTree.id).getBinding("items").filter(
						new sap.ui.model.Filter(aFilters, true));

				oTree.childs.forEach(function(oElement) {
					that.filterField(oElement);
				});
			},
			
			naviguate : function(){
			    jQuery.sap.registerModulePath("airbus.mes.settings","/MES/components/settings");
			    jQuery.sap.registerModulePath("airbus.mes.stationtracker","/MES/components/stationtracker");
			    
			    if (oComp2 != undefined) {
			    	nav.to(oComp2.oView.getId());
				}
			    else {var oComp2 = sap.ui.getCore().createComponent({
					name : "airbus.mes.stationtracker", // root component folder is resources
				});
				nav.addPage(oComp2.oView);
				nav.to(oComp2.oView.getId());  }
			},
			
			
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the
			 * controller's View is re-rendered (NOT before the first rendering!
			 * onInit() is used for that one!).
			 * 
			 * @memberOf application2.initialview
			 */
			// onBeforeRendering: function() {
			//
			// },
			
			
			
			
			/**
			 * Called when the View has been rendered (so its HTML is part of
			 * the document). Post-rendering manipulations of the HTML could be
			 * done here. This hook is the same one that SAPUI5 controls get
			 * after being rendered.
			 * 
			 * @memberOf application2.initialview
			 */
			onAfterRendering : function() {
				this.filterField(this.selectTree);
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