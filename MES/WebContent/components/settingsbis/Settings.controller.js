jQuery.sap.require("sap.ui.vbm.AnalyticMap");
// sap.ui.vbm.AnalyticMap.GeoJSONURL = "model/europe.json";
sap.ui.vbm.AnalyticMap.GeoJSONURL = "/MES/components/settings/model/europe.json";

sap.ui.controller("airbus.mes.settings.Settings",
		{
	
//			Tree to define the hierarchy between select box Line, Station and MSN	
			selectTree : {
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
				var id = oEvt.getSource().getId().split("--")[1];
				this.findElement(this.selectTree, oEvt.getSource()
						.getId().split("--")[1]).childs
						.forEach(function(oElement) {
							that.clearField(oElement);
							that.filterField(oElement);
						});

				if (id === "selectLine") {
					this.setEnabledCombobox(true, true, false);
				} else {
					this.setEnabledCombobox(true, true, true);
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
			setEnabledCombobox : function(fLine, fStation, fMsn) {
				this.getView().byId("selectLine").setEnabled(fLine);
				this.getView().byId("selectStation").setEnabled(fStation);
				this.getView().byId("selectMSN").setEnabled(fMsn);
//				View1--selectLine
			},
			// User select a site on the table and the map is zoomed
			onPressSite : function(e) {

				site = e.getSource().getTitle();

				oData = this.getView().getModel("region").oData;

				for (var i = 0; i < oData.Spots.length; i++) {
					var spot = oData.Spots[i].tooltip;
					if (spot == site) {

						var splitter = oData.Spots[i].pos.split(";");
						sap.m.MessageToast.show(e.getSource().getTitle());
						this.byId("vbi").zoomToGeoPosition(splitter[0],
								splitter[1], 6);
					}
				}

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
			}
		});