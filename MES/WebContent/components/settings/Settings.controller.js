jQuery.sap.require("sap.ui.vbm.AnalyticMap");
// sap.ui.vbm.AnalyticMap.GeoJSONURL = "model/europe.json";
sap.ui.vbm.AnalyticMap.GeoJSONURL = "../components/settings/model/europe.json";

sap.ui.controller("airbus.mes.settings.Settings",
		{
	
//			Tree to define the hierarchy between select box Line, Station and MSN	
//	selectTree : {
//		id : "ComboBoxProgram",
//		type : "select",
//		path : "program",
//		attr : "program",
//		childs : [ {
//			id : "ComboBoxLine",
//			type : "select",
//			path : "line",
//			attr : "line",
//			childs : [ {
//				id : "ComboBoxStation",
//				type : "select",
//				path : "station",
//				attr : "station",
//				childs : []
//			}, {
//				id : "ComboBoxMSN",
//				type : "select",
//				path : "msn",
//				childs : []
//			}, {
//				id : "Return",
//				type : "Return",
//				childs : []
//			} ]
//		} ]
//	},
//			
			selectTree : {
//				id : "headTextProgram",
//				type : "select",
//				path : "program",
//				attr : "program",
//				childs : [ {
					id : "selectLine",
					type : "select",
					path : "line",
					attr : "line",
					childs : [ {
						id : "selectStation",
						type : "select",
						path : "station",
						attr : "station",
						childs : []
					}, {
						id : "selectMSN",
						type : "select",
						path : "msn",
						childs : []
					}, {
						id : "Return",
						type : "Return",
						childs : []
					} ]
			//	} ]
			},

			onAfterRendering : function() {
				this.byId("vbi").zoomToRegions([ "FR", "GB", "ES", "DE" ]);
				this.getUserSettings();
			},

			onInit : function() {
//				TODO comment ?????????
				this.addParent(this.selectTree, undefined);
				
			},
			
//			For hierachy of combobox
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
				this.findElement(this.selectTree, oEvt.getSource().getId().split("--")[1]).childs
						.forEach(function(oElement) {
							that.clearField(oElement);
							that.filterField(oElement);
						});

				if (id === "selectLine") {
					this.setEnabledCombobox(true, true, true, false);
				} else {
					this.setEnabledCombobox(true, true, true, true);
				}

			},
			
			onProgramSelect : function() {
				var that = this;
				var sProgram = "selectLine";
				this.findElement(this.selectTree, sProgram).childs
						.forEach(function(oElement) {
							that.clearField(oElement);
							that.filterField(oElement);
						});

				
				this.setEnabledCombobox(true, true, false, false);			
				
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
					//special selection because program and site are not combobox
					if ( oElement.id === "headTextProgram" ) {
						
						this.getView().byId(oElement.id).getItems().forEach(function(el){
							
							if ( el.getContent()[0].getItems()[0].getSelected() ) {
								
								var sPath = el.getBindingContextPath()
								
								
							}
						
						})
						
						
					} else  {
						
						var val = this.getView().byId(oElement.id).getValue();
					}
					
					if (val) {
						var oFilter = new sap.ui.model.Filter( oElement.path, "EQ", val);
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
			setEnabledCombobox : function(fProgram, fLine, fStation, fMsn) {
				this.getView().byId("selectLine").setEnabled(fLine);
				this.getView().byId("selectStation").setEnabled(fStation);
				this.getView().byId("selectMSN").setEnabled(fMsn);
//				View1--selectLine
			},
			/**
		     * Load plant model when selected a Site and User select a site on the table and the map is zoomed
		     */
			onPressSite : function(e) {
				
				var oModel = sap.ui.getCore().getModel("siteModel").getProperty("/Rowsets/Rowset/0/Row");
							
				var site = e.getParameters().item.getText();
				var fIndex = oModel.map(function(x) {return x.site_desc; }).indexOf( site );
				
				airbus.mes.settings.ModelManager.site = sap.ui.getCore().getModel("siteModel").getProperty("/Rowsets/Rowset/0/Row/" + fIndex + "/site");
				var oData = this.getView().getModel("region").oData;

				for (var i = 0; i < oData.Spots.length; i++) {
					var spot = oData.Spots[i].tooltip;
					if (spot == site) {

						var splitter = oData.Spots[i].pos.split(";");
						sap.m.MessageToast.show(site);
						this.byId("vbi").zoomToGeoPosition(splitter[0],
								splitter[1], 6);
					}
				}
								
				//airbus.mes.settings.ModelManager.site = this.getView().byId("ComboBoxPlant").getValue();
				airbus.mes.settings.ModelManager.loadPlantModel();
				this.filterField(this.selectTree);
				this.getView().byId("selectLine").setValue("");
				this.getView().byId("selectStation").setValue("");
				this.getView().byId("selectMSN").setValue("");
								
				this.setEnabledCombobox(true, false, false, false);

			},

			// User clicks on a site map
			onClickSpot : function(e) {
				sap.m.MessageToast
						.show("onClickSpot " + e.getParameter("text"));
			},

			// User clicks on any position on the map
			onRegionClick : function(e) {
				sap.m.MessageToast.show("onRegionClick "
						+ e.getParameter("code"));
			},

			// User clicks on a button
			onPress : function(evt) {
				// var context = evt.getSource().getBindingContext();
				// nav.to("Detail", context);
				// Active settings button during leaving settings screen
				if (airbus.mes.shell != undefined) {
					airbus.mes.shell.oView.byId("settingsButton").setEnabled(
							true);
				}

				switch (this.getOwnerComponent().mProperties.buttonAction) {
				case "stationtracker":
					airbus.mes.shell.util.navFunctions.stationTracker();
					break;

				case "teamassignment":
					airbus.mes.shell.util.navFunctions.resourcePool();
					break;

				case "disruptiontracker":
					airbus.mes.shell.util.navFunctions.disruptionTracker();
					break;

				case "back":
					nav.back();
				}
			},
			onImagePress : function(oEvent) {
				// Get associated button to the image
				var oButton = oEvent.getSource().getParent().getAggregation(
						"items")[0];
				// Set the selected attribute
				oButton.setSelected(true);
			},
			/**
		     * Get data from usersetting and reuse previous settings input.
		     */
			getUserSettings : function() {
				var oModel = airbus.mes.settings.ModelManager.core.getModel("userSettingModel").getData();
				airbus.mes.settings.ModelManager.plant = oModel.Rowsets.Rowset[0].Row[0].plant;
				airbus.mes.settings.ModelManager.program = oModel.Rowsets.Rowset[0].Row[0].program;
				airbus.mes.settings.ModelManager.line = oModel.Rowsets.Rowset[0].Row[0].line;
				airbus.mes.settings.ModelManager.station = oModel.Rowsets.Rowset[0].Row[0].station;
				airbus.mes.settings.ModelManager.msn = oModel.Rowsets.Rowset[0].Row[0].msn;
				// Maybe change regarding model get from mii
				airbus.mes.settings.ModelManager.taktStart = oModel.Rowsets.Rowset[0].Row[0].begin;
				airbus.mes.settings.ModelManager.taktEnd = oModel.Rowsets.Rowset[0].Row[0].end;
				airbus.mes.settings.ModelManager.taktDuration = oModel.Rowsets.Rowset[0].Row[0].duration;
				
				// Replace with current new element in UI
//				this.getView().byId("ComboBoxPlant").setValue(airbus.mes.settings.ModelManager.plant);
//				if (airbus.mes.settings.ModelManager.plant) {
//					this.loadPlantModel();
//					if (airbus.mes.settings.ModelManager.program)
//						this.getView().byId("ComboBoxProgram").setSelectedKey(airbus.mes.settings.ModelManager.program);
//					if (airbus.mes.settings.ModelManager.line)
//						this.getView().byId("ComboBoxLine").setSelectedKey(airbus.mes.settings.ModelManager.line);
//					if (airbus.mes.settings.ModelManager.station)
//						this.getView().byId("ComboBoxStation").setSelectedKey(airbus.mes.settings.ModelManager.station);
//					if (airbus.mes.settings.ModelManager.msn)
//						this.getView().byId("ComboBoxMSN").setSelectedKey(airbus.mes.settings.ModelManager.msn);
//
//					this.setEnabledCombobox(true, true, true, true);
//				} else {
//					this.setEnabledCombobox(true, false, false, false);
//				}
			}
			
		});