jQuery.sap.require("sap.ui.vbm.AnalyticMap");
// sap.ui.vbm.AnalyticMap.GeoJSONURL = "model/europe.json";
sap.ui.vbm.AnalyticMap.GeoJSONURL = "../components/settings/model/europe.json";

sap.ui.controller("airbus.mes.settings.Settings",
		{
	
//			Tree to define the hierarchy between select box Line, Station and MSN	
			selectTree : {
				id : "headTextProgram",
				type : "select",
				path : "program",
				attr : "program",
				childs : [ {
					id : "selectLine",
					type : "select",
					path : "line",
					attr : "line",
					childs : [ {
						id : "selectStation",
						type : "select",
						path : "station",
						attr : "station",
						childs : [ {
							id : "selectMSN",
							type : "select",
							path : "msn",
							currentmsn : "Current_MSN",
							
							childs : []
						},
						{
							id : "Return",
							type : "Return",
							childs : []
						}]
					}
						]
				} ]
			},

			onAfterRendering : function() {
				this.byId("vbi").zoomToRegions([ "FR", "GB", "ES", "DE" ]);
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
				
				if (oEvt.getSource != undefined ) {
					
					var id = oEvt.getSource().getId().split("--")[1];
						
				} else {
					// Used when this function is call to set usersetting data.	
					var id = oEvt;
				}
				
				this.findElement(this.selectTree, id).childs
						.forEach(function(oElement) {
							that.clearField(oElement);
							that.filterField(oElement);
						});
			
				switch(id) {
			    case "selectLine":
			    	this.setEnabledCombobox(true, true, true, false);
			        break;
			    case "selectStation":
			    	
					if ( airbus.mes.settings.ModelManager.currentMsnSelected ) {
						
						var sCurrentMsn = "";
						if ( sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row") != undefined ) {
						var oModel = sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row");
						// Find automatically the msn with the flag Current MSN different of "---"
						oModel = oModel.filter(function (el) {
							  return el.program ===  airbus.mes.settings.ModelManager.program &&
							       	 el.line === airbus.mes.settings.oView.byId("selectLine").getSelectedKey() &&
							         el.station === airbus.mes.settings.oView.byId("selectStation").getSelectedKey() &&
							         el.Current_MSN != "---"
							});
						if ( oModel.length > 0 ) {
					
							// This is need to reset the previous current msn value when we reload the applicatoin
							airbus.mes.settings.ModelManager.currentMsnValue = oModel[0].msn;
							airbus.mes.settings.oView.byId("selectMSN").setValue( oModel[0].msn );
							
						}
						}							
					}
					this.setEnabledCombobox(true, true, true, true);
			        break;
			    default: 
			    	this.setEnabledCombobox(true, true, true, true);
			       
			}


			},
			
			onProgramSelect : function() {
				var that = this;
				var sProgram = "headTextProgram";
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
					switch( oElement.id ) {
				    case "headTextProgram":
				    		this.getView().byId(oElement.id).getItems().forEach(function(el){
							
							if ( el.getContent()[0].getItems()[0].getSelected() ) {
								
								var sPath = el.getBindingContextPath()
								var oModel = sap.ui.getCore().getModel("program");
								var sProgram = 	oModel.getProperty(sPath).prog
								airbus.mes.settings.ModelManager.program = sProgram;
									
								aFilters.push(new sap.ui.model.Filter( oElement.path, "EQ", sProgram));
							}
						
						})
				        break;
				   
				    default:
				     			        
				     var val = this.getView().byId(oElement.id).getSelectedKey();
					
					var oFilter = new sap.ui.model.Filter( oElement.path, "EQ", val);
					aFilters.push(oFilter);
				}
					
	
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
					if ( oTree.id === "headTextProgram" ) {
						
						airbus.mes.settings.oView.getModel("program").refresh(true);
						
					} else {
					
						this.getView().byId(oTree.id).getBinding("items").filter(new sap.ui.model.Filter(aFilters,true));
				
					}
				oTree.childs.forEach(function(oElement) {
					that.filterField(oElement);
				});
			},		
			setEnabledCombobox : function(fProgram, fLine, fStation, fMsn) {
				this.getView().byId("selectLine").setEnabled(fLine);
				this.getView().byId("selectStation").setEnabled(fStation);
				if ( !airbus.mes.settings.ModelManager.currentMsnSelected ) {
			
				this.getView().byId("selectMSN").setEnabled(fMsn);
			
			}
//				View1--selectLine
			},
			/**
		     * Load plant model when selected a Site and User select a site on the table and the map is zoomed
		     */
			onPressSite : function(e) {
				
				var oModel = sap.ui.getCore().getModel("siteModel").getProperty("/Rowsets/Rowset/0/Row");
				// take 			
				if ( e.getParameters().item != undefined ) {
					var site =  e.getParameters().item.getText();
				} else {
					if ( airbus.mes.settings.oView.byId("headTextPlant").getSelectedItem() != undefined ) {
					var site = airbus.mes.settings.oView.byId("headTextPlant").getSelectedItem().getText();
					}
				}
			
				var fIndex = oModel.map(function(x) {return x.site_desc; }).indexOf( site );
				// get real value of site making the link betwen the siteModel and from mii and local site
				airbus.mes.settings.ModelManager.site = sap.ui.getCore().getModel("siteModel").getProperty("/Rowsets/Rowset/0/Row/" + fIndex + "/site");
				airbus.mes.settings.ModelManager.siteDesc = sap.ui.getCore().getModel("siteModel").getProperty("/Rowsets/Rowset/0/Row/" + fIndex + "/site_desc");
				
				var oData = this.getView().getModel("region").oData;

				for (var i = 0; i < oData.Spots.length; i++) {
					var spot = oData.Spots[i].tooltip;
					if (spot === site) {

						var splitter = oData.Spots[i].pos.split(";");
						//sap.m.MessageToast.show(site);
						this.byId("vbi").zoomToGeoPosition(splitter[0],	splitter[1], 6);
					}
				}
								
				//airbus.mes.settings.ModelManager.site = this.getView().byId("ComboBoxPlant").getValue();
				airbus.mes.settings.ModelManager.loadPlantModel();
				this.filterField(this.selectTree);
				this.getView().byId("headTextProgram").getItems().forEach(function(el){
					
					el.getContent()[0].getItems()[0].setSelected(false);
					
				});
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
					airbus.mes.shell.oView.byId("settingsButton").setEnabled(true);
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
				case "polypoly":
					nav.back();
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
				airbus.mes.settings.ModelManager.site = oModel.Rowsets.Rowset[0].Row[0].site;
				airbus.mes.settings.ModelManager.program = oModel.Rowsets.Rowset[0].Row[0].program;
				airbus.mes.settings.ModelManager.line = oModel.Rowsets.Rowset[0].Row[0].line;
				airbus.mes.settings.ModelManager.station = oModel.Rowsets.Rowset[0].Row[0].station;
				airbus.mes.settings.ModelManager.msn = oModel.Rowsets.Rowset[0].Row[0].msn;
				// Maybe change regarding model get from mii
				airbus.mes.settings.ModelManager.taktStart = oModel.Rowsets.Rowset[0].Row[0].Takt_Start;
				airbus.mes.settings.ModelManager.taktEnd = oModel.Rowsets.Rowset[0].Row[0].Takt_End;
				airbus.mes.settings.ModelManager.taktDuration = oModel.Rowsets.Rowset[0].Row[0].Takt_Duration;
				//Description update
				airbus.mes.settings.ModelManager.siteDesc = oModel.Rowsets.Rowset[0].Row[0].siteDescription;
				airbus.mes.settings.ModelManager.lineDesc = oModel.Rowsets.Rowset[0].Row[0].lineDescription
				airbus.mes.settings.ModelManager.programDesc = oModel.Rowsets.Rowset[0].Row[0].programDescription;
				airbus.mes.settings.ModelManager.stationDesc = oModel.Rowsets.Rowset[0].Row[0].stationDescription;
				
				// Replace with current new element in UI
				if (airbus.mes.settings.ModelManager.site) {
					//airbus.mes.settings.ModelManager.loadPlantModel();
					
					//Select site
					var oModel = sap.ui.getCore().getModel("siteModel").getProperty("/Rowsets/Rowset/0/Row");
					var fIndex = oModel.map(function(x) {return x.site; }).indexOf( airbus.mes.settings.ModelManager.site );
					//Get Value of site_desc of Model
					var sSite = sap.ui.getCore().getModel("siteModel").getProperty("/Rowsets/Rowset/0/Row/" + fIndex + "/site_desc");
					this.getView().byId("headTextPlant").setSelectedKey(sSite);
					// Fire event to refilter plant
					this.getView().byId("headTextPlant").fireItemPress();	
				
					//Select program
					this.getView().byId("headTextProgram").getItems().forEach(function(el){
							
							if ( el.getContent()[0].getItems()[0].getText() === airbus.mes.settings.ModelManager.program ) {
								
								el.getContent()[0].getItems()[0].setSelected(true);
								
					}});
						// Fire event to refilter plant
						airbus.mes.settings.oView.getController().onProgramSelect();		
			
		
						this.getView().byId("selectLine").setSelectedKey(airbus.mes.settings.ModelManager.line);
						this.getView().getController().onSelectionChange("selectLine");
						
						this.getView().byId("selectStation").setSelectedKey(airbus.mes.settings.ModelManager.station);
						
						if ( airbus.mes.settings.ModelManager.msn != "---" ){
							this.getView().getController().onSelectionChange("selectStation");

							this.getView().byId("selectMSN").setSelectedKey(airbus.mes.settings.ModelManager.msn);
							this.getView().byId("currMSN").setSelected(false);
							airbus.mes.settings.ModelManager.currentMsnSelected = false;
																			
						} else {
							
							this.getView().getController().onSelectionChange("selectStation");
							airbus.mes.settings.ModelManager.msn = this.getView().byId("selectMSN").getValue();
							// When current msn is selected we save in user setting "" for the value msn  							
							// To redisplay the real value of ms we reuse currentMsnValue variable wich is set during the filtering of combobox STATION.
							airbus.mes.shell.oView.byId("labelMSN").setText(airbus.mes.shell.oView.getModel("ShellI18n").getProperty(
							"MSN") + " " + airbus.mes.settings.ModelManager.currentMsnValue);
						}
						this.setEnabledCombobox(true, true, true, true);
				} else {	
					this.setEnabledCombobox(true, false, false, false);
				}
			},
			/**
		     * Update view if selectig auto selection of msn 
		     */
			selectCurrentMsn : function(oEvt) {
				
				var fSelected = oEvt.getSource().getSelected();
				airbus.mes.settings.ModelManager.currentMsnSelected = fSelected;
				
				if ( fSelected ) {
					
					this.getView().getController().onSelectionChange("selectStation");
				}
				
				if ( airbus.mes.settings.oView.byId("selectStation").getValue() != "" ) {
				
				this.getView().byId("selectMSN").setEnabled(!fSelected);
				
				}
				
			},
			/**
		     * Fire when the user press confirm it save data.
		     */
			saveUserSettings : function(oEvent) {
				var that = this;
				if (this.getView().byId("headTextPlant").getSelectedItem() === null ) {
					airbus.mes.settings.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("SelectSite"));
					return;
					// check if one combobox of program is selected
				} else if ( !this.getView().byId("headTextProgram").getItems().some(function(el){
					
					return el.getContent()[0].getItems()[0].getSelected() 
					
				})) {
					airbus.mes.settings.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("SelectProgram"));
					return;
				} else if (!this.getView().byId("selectLine").getValue()) {
					airbus.mes.settings.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("SelectLine"));
					return;
				} else if (!this.getView().byId("selectStation").getValue()) {
					airbus.mes.settings.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("SelectStation"));
					return;
				}else if (!this.getView().byId("selectMSN").getValue()) {
					airbus.mes.settings.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("SelectMSN"));
					return;
				}else {
					
					// Save value selected.
					var aModel = sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row");
					aModel = aModel.filter(function (el) {
						  return el.program ===  airbus.mes.settings.ModelManager.program &&
						       	 el.line === airbus.mes.settings.oView.byId("selectLine").getSelectedKey() &&
						         el.station === airbus.mes.settings.oView.byId("selectStation").getSelectedKey() &&
						         el.msn === airbus.mes.settings.oView.byId("selectMSN").getValue();
						})[0];
					//Internal value update
					airbus.mes.settings.ModelManager.line = this.getView().byId("selectLine").getSelectedKey();
					airbus.mes.settings.ModelManager.station = this.getView().byId("selectStation").getSelectedKey();
					// Msn value is directly selected by function in that case we get SelectedKey does not work so we take directly the value.
					airbus.mes.settings.ModelManager.msn = this.getView().byId("selectMSN").getValue();
					airbus.mes.settings.ModelManager.taktStart = aModel.Takt_Start;
					airbus.mes.settings.ModelManager.taktEnd = aModel.Takt_End;
					airbus.mes.settings.ModelManager.taktDuration = aModel.Takt_Duration;
					//Description update
					airbus.mes.settings.ModelManager.siteDesc = airbus.mes.settings.ModelManager.siteDesc;
					airbus.mes.settings.ModelManager.lineDesc = aModel.lineDescription
					airbus.mes.settings.ModelManager.programDesc = aModel.programDescription;
					airbus.mes.settings.ModelManager.stationDesc = aModel.stationDescription;
						
					airbus.mes.settings.ModelManager.saveUserSetting(sap.ui.getCore().getConfiguration().getLanguage().slice(0,2));
					// Navigate to correct view
					that.navigate(oEvent);
				}
			},			
			/**
		     * Fire when the user press confirm move to correct view.
		     */
			navigate : function(oEvent) {

				// Active settings button during leaving settings screen
				if (airbus.mes.shell != undefined) {
					airbus.mes.shell.oView.byId("settingsButton").setEnabled(true);
				}

				switch (this.getOwnerComponent().mProperties.buttonAction) {
				case "stationtracker":
					airbus.mes.shell.util.navFunctions.stationTracker();
					break;

				/** Resource Pool **/
				case "teamassignment":
					airbus.mes.shell.util.navFunctions.resourcePool();
					break;
					
				/** Disruption Tracker **/
				case "disruptiontracker":
					airbus.mes.shell.util.navFunctions.disruptionTracker();
					break;
				
					/** Disruption Tracker **/
				case "polypoly":
					airbus.mes.shell.util.navFunctions.polypoly();
					break;

				case "back":
					nav.back();
				}

			},
			
		});
