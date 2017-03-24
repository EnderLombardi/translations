"use strict";
jQuery.sap.require("sap.ui.vbm.AnalyticMap");
sap.ui.vbm.AnalyticMap.GeoJSONURL = "../components/settings/model/europe.json";

sap.ui.controller("airbus.mes.settings.controller.Settings",
    {

        // Tree to define the hierarchy between select box Line, Station and MSN
        selectTree: {
            id: "headTextProgram",
            type: "select",
            path: "program",
            attr: "program",
            childs: [{
                id: "selectLine",
                type: "select",
                path: "line",
                attr: "line",
                childs: [{
                    id: "selectStation",
                    type: "select",
                    path: "station",
                    attr: "station",
                    childs: [{
                        id: "selectMSN",
                        type: "select",
                        path: "msn",
                        currentmsn: "Current_MSN",

                        childs: []
                    },
                    {
                        id: "Return",
                        type: "Return",
                        childs: []
                    }]
                }
                ]
            }]
        },

        onAfterRendering: function () {
            this.byId("vbi").zoomToRegions(["FR", "GB", "ES", "DE"]);

            //enable or disable the combobox/Select if the program is selected or not
            if (!this.isProgramSelected()) {
                this.setEnabledSelect(true, false, false, false);
            } else {
                this.setEnabledSelect(true, true, true, true);
            }

            this.byId("currMSN").fireSelect();
            
        },

        onInit: function () {
            this.addParent(this.selectTree, undefined);
        },

        // For hierachy of select
        addParent: function (oTree, oParent) {
            var that = this;
            oTree.parent = oParent;
            oTree.childs.forEach(function (oElement) {
                that.addParent(oElement, oTree);
            });
        },

        findElement: function (oTree, sId) {
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

        // *******************on change of item in the Select
        // *******************
        onSelectionChange: function (oEvt) {
            var that = this;

            if (oEvt.getSource != undefined) {
                var id = oEvt.getSource().getId().split("--")[1];
            } else {
                // Used when this function is call to set usersetting data.
                var id = oEvt;
            }

            this.findElement(this.selectTree, id).childs
                .forEach(function (oElement) {
                    that.clearField(oElement);
                    that.filterField(oElement);
                });

            switch (id) {
                case "selectStation":
                    if (airbus.mes.settings.util.ModelManager.current_flag === "X") {
                        if (sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row") != undefined) {
                            var oModel = sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row");
                            // Find automatically the msn with the flag Current MSN different of "---"
           				 var currentMSN = airbus.mes.settings.util.ModelManager.retrieveCurrentMSN(oModel,
																		           					airbus.mes.settings.util.ModelManager.program,
																		           					airbus.mes.settings.oView.byId("selectLine").getSelectedKey(),
																		           					airbus.mes.settings.oView.byId("selectStation").getSelectedKey());
                            if (currentMSN !== "") {
                                // This is need to reset the previous current msn value when we reload the application
                                airbus.mes.settings.util.ModelManager.currentMsnValue = currentMSN;
                                airbus.mes.settings.oView.byId("selectMSN").setSelectedKey(currentMSN);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        },

        onProgramSelect: function () {
            var that = this;
            var sProgram = "headTextProgram";
            this.findElement(this.selectTree, sProgram).childs.forEach(function (oElement) {
                that.clearField(oElement);
                that.filterField(oElement);
            });

            this.setEnabledSelect(true, true, true, true);
        },

        // ****************** clear other ComboBoxes after changing
        // the item of one comboBox *****
        clearField: function (oTree) {
            var that = this;
            if (oTree.type == "select") {
                that.getView().byId(oTree.id).setSelectedKey();
            }
            oTree.childs.forEach(that.clearField.bind(that));
        },

        filterField: function (oTree) {
            if (oTree.type == "Return") {
                return;
            }
            var that = this;
            var aFilters = [];
            var oElement = oTree.parent;

            //add filters from the children to the parent until oElement.parent is null
            while (oElement) {
                //special selection because program and site are not combobox
                switch (oElement.id) {
                    case "headTextProgram":
                        this.getView().byId(oElement.id).getItems().forEach(function (el) {
                            if (el.getContent()[0].getItems()[0].getSelected()) {
                                var sPath = el.getBindingContextPath()
                                var oModel = sap.ui.getCore().getModel("program");
                                var sProgram = oModel.getProperty(sPath).prog;
                                aFilters.push(new sap.ui.model.Filter(oElement.path, "EQ", sProgram));
                            }
                        });
                        break;
                    default:
                        //if nothing selected we select the first element of the items filtered
                        if (!this.getView().byId(oElement.id).getSelectedKey() && this.getView().byId(oElement.id).getItems()[0]) {
                            this.getView().byId(oElement.id).setSelectedKey(this.getView().byId(oElement.id).getItems()[0].getKey());
                        }

                        var val = this.getView().byId(oElement.id).getSelectedKey();
                        var oFilter = new sap.ui.model.Filter(oElement.path, "EQ", val);
                        aFilters.push(oFilter);
                        break;
                }
                oElement = oElement.parent;
            }

            //delete duplicate filters
            var temp = [];
            var duplicatesFilter = new sap.ui.model.Filter({
                path: oTree.path,
                test: function (value) {
                    if (temp.indexOf(value) == -1) {
                        temp.push(value)
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            aFilters.push(duplicatesFilter);


            //binding with the filters created above
            if (this.getView().byId(oTree.id).getBinding("items")) {
                if (oTree.id === "headTextProgram") {
                    airbus.mes.settings.oView.getModel("program").refresh(true);
                } else if (oTree.id === "selectStation") {
                    this.getView().byId(oTree.id).getBinding("items").filter(new sap.ui.model.Filter(aFilters, true));

                    //set the stationtracker with the first station available (filtered by line and program)
                    var indice;
                    indice = this.getView().byId(oTree.id).getBinding("items").aIndices[0];
                    if (indice) {
                        this.getView().byId("selectStation").setSelectedKey(this.getView().byId(oTree.id).getBinding("items").oList[indice].station);
                    }
                } else {
                    this.getView().byId(oTree.id).getBinding("items").filter(new sap.ui.model.Filter(aFilters, true));
                }
            }

            //filter for the childs
            oTree.childs.forEach(function (oElement) {
                that.filterField(oElement);
            });
        },

        setEnabledSelect: function (fProgram, fLine, fStation, fMsn) {
            this.getView().byId("selectLine").setEnabled(fLine);
            this.getView().byId("selectStation").setEnabled(fStation);
            if (airbus.mes.settings.util.ModelManager.current_flag !== "X") {
                this.getView().byId("selectMSN").setEnabled(fMsn);
            }
        },

        /**
         * Load plant model when selected a Site and User select a site on the table and the map is zoomed
         */
        onPressSite: function (e) {

            var oModel = sap.ui.getCore().getModel("siteModel").getProperty("/Rowsets/Rowset/0/Row");
            // take
            if (e.getParameters().item != undefined) {
                var site = e.getParameters().item.getText();
            } else if (airbus.mes.settings.oView.byId("headTextPlant").getSelectedItem() != undefined) {
                var site = airbus.mes.settings.oView.byId("headTextPlant").getSelectedItem().getText();
            }

            var fIndex = oModel.map(function (x) { return x.site_desc; }).indexOf(site);
            airbus.mes.settings.util.ModelManager.newSite = oModel[fIndex].site;
            airbus.mes.settings.util.ModelManager.newSiteDesc = site;
            var oData = this.getView().getModel("region").oData;

            for (var i = 0; i < oData.Spots.length; i++) {
                var spot = oData.Spots[i].tooltip;
                if (spot === site) {
                    var splitter = oData.Spots[i].pos.split(";");
                    this.byId("vbi").zoomToGeoPosition(splitter[0], splitter[1], 6);
                }
            }

            airbus.mes.settings.util.ModelManager.loadPlantModel(airbus.mes.settings.util.ModelManager.newSite);
            // Delete value of other Selects
            this.getView().byId("headTextProgram").getItems().forEach(function (el) {
                el.getContent()[0].getItems()[0].setSelected(false);
            });

            //we force the selection to false to be able to set at undefined the value
            //in this way we can display nothing when we press the site
            airbus.mes.settings.oView.byId("selectLine").setForceSelection(false);
            airbus.mes.settings.oView.byId("selectLine").setSelectedKey(undefined);
            airbus.mes.settings.oView.byId("selectStation").setForceSelection(false);
            airbus.mes.settings.oView.byId("selectStation").setSelectedKey(undefined);
            airbus.mes.settings.oView.byId("selectMSN").setForceSelection(false);
            airbus.mes.settings.oView.byId("selectMSN").setSelectedKey(undefined);

            //disabled the Selects of Other Settings, refresh the model to keep Program selected in the view
            this.setEnabledSelect(true, false, false, false);
            airbus.mes.settings.oView.getModel("program").refresh(true);

            /*remove settings for user in line tracker db if site changes*/
            if (airbus.mes.linetracker && airbus.mes.linetracker.util.ModelManager) {
                airbus.mes.linetracker.util.ModelManager.customLineBO = "";
                sap.ui.getCore().getModel("userSettingModel").setProperty("/Rowsets/Rowset/0/Row/0/customLineBO", "");
                airbus.mes.linetracker.util.ModelManager.updateLineInUserSettings();
            }
        },

        // User clicks on a site map
        onClickSpot: function (e) {
            sap.m.MessageToast
                .show("onClickSpot " + e.getParameter("text"));

        },

        // User clicks on any position on the map
        onRegionClick: function (e) {
            sap.m.MessageToast.show("onRegionClick "
                + e.getParameter("code"));
        },

        // User clicks on a button
        onPress: function (evt) {
            // Active settings button during leaving settings screen
            if (airbus.mes.shell != undefined) {
                sap.ui.getCore().byId("popupSettingsButton").setEnabled(true);
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
                case "disruptionKPI":
                    airbus.mes.shell.util.navFunctions.disruptionKPI();
                    break;
                case "polypoly":
                    nav.back();
                    break;
                case "back":
                    nav.back();
                    break;
                default:
                    break;
            }
        },

        onImagePress: function (oEvent) {
            // Get associated button to the image
            var oButton = oEvent.getSource().getParent().getAggregation("items")[0];
            // Set the selected attribute
            if (oButton.getEnabled() === true) {
                oButton.setSelected(true);
                // Fire event to refilter plant
                airbus.mes.settings.oView.getController().onProgramSelect();
            }

        },

        /**
         * Get data from usersetting and reuse previous settings input.
         */
        getUserSettings: function () {
            var oModel = sap.ui.getCore().getModel("userSettingModel").getData();
            // User
            airbus.mes.settings.util.ModelManager.user = oModel.Rowsets.Rowset[0].Row[0].user;
            // Location
            airbus.mes.settings.util.ModelManager.site = oModel.Rowsets.Rowset[0].Row[0].site;
            airbus.mes.settings.util.ModelManager.program = oModel.Rowsets.Rowset[0].Row[0].program;
            airbus.mes.settings.util.ModelManager.line = oModel.Rowsets.Rowset[0].Row[0].line;
            airbus.mes.settings.util.ModelManager.station = oModel.Rowsets.Rowset[0].Row[0].station;
            airbus.mes.settings.util.ModelManager.msn = oModel.Rowsets.Rowset[0].Row[0].msn;
            airbus.mes.settings.util.ModelManager.current_flag = oModel.Rowsets.Rowset[0].Row[0].current_flag;
            // Maybe change regarding model get from mii
            airbus.mes.settings.util.ModelManager.taktStart = oModel.Rowsets.Rowset[0].Row[0].Takt_Start;
            airbus.mes.settings.util.ModelManager.taktEnd = oModel.Rowsets.Rowset[0].Row[0].Takt_End;
            airbus.mes.settings.util.ModelManager.taktDuration = oModel.Rowsets.Rowset[0].Row[0].Takt_Duration;
            //Description update
            airbus.mes.settings.util.ModelManager.siteDesc = oModel.Rowsets.Rowset[0].Row[0].siteDescription;
            airbus.mes.settings.util.ModelManager.lineDesc = oModel.Rowsets.Rowset[0].Row[0].lineDescription
            airbus.mes.settings.util.ModelManager.programDesc = oModel.Rowsets.Rowset[0].Row[0].programDescription;
            airbus.mes.settings.util.ModelManager.stationDesc = oModel.Rowsets.Rowset[0].Row[0].stationDescription;

            // Replace with current new element in UI
            if (airbus.mes.settings.util.ModelManager.site
                && airbus.mes.settings.util.ModelManager.site != "---"
                && airbus.mes.settings.util.ModelManager.site != "undefined") {

                //Select site
                var oModel = sap.ui.getCore().getModel("siteModel").getProperty("/Rowsets/Rowset/0/Row");
                var fIndex = oModel.map(function (x) { return x.site; }).indexOf(airbus.mes.settings.util.ModelManager.site);
                //Get Value of site_desc of Model
                var sSite = sap.ui.getCore().getModel("siteModel").getProperty("/Rowsets/Rowset/0/Row/" + fIndex + "/site_desc");
                this.getView().byId("headTextPlant").setSelectedKey(sSite);
                // Fire event to refilter plant
                this.getView().byId("headTextPlant").fireItemPress();

                //Select program
                this.getView().byId("headTextProgram").getItems().forEach(function (el) {
                    if (el.getContent()[0].getItems()[0].getText() === airbus.mes.settings.util.ModelManager.program) {
                        el.getContent()[0].getItems()[0].setSelected(true);
                    }
                });

                // Fire event to refilter plant
                airbus.mes.settings.oView.getController().onProgramSelect();

                this.getView().byId("selectLine").setSelectedKey(airbus.mes.settings.util.ModelManager.line);
                this.getView().getController().onSelectionChange("selectLine");

                this.getView().byId("selectStation").setSelectedKey(airbus.mes.settings.util.ModelManager.station);

                if (airbus.mes.settings.util.ModelManager.msn != "---") {

//                    airbus.mes.settings.util.ModelManager.current_flag = "";
                    this.getView().getController().onSelectionChange("selectStation");
                    this.getView().byId("selectMSN").setSelectedKey(airbus.mes.settings.util.ModelManager.msn);

                }

                // if no msn go by default on user settings.
                if (!airbus.mes.settings.util.ModelManager.msn || airbus.mes.settings.util.ModelManager.msn == "---"
                    || airbus.mes.settings.util.ModelManager.msn == "undefined") {
                    airbus.mes.shell.oView.getController().navigate();
                }
            }
        },

        /**
         * Update view if selectig auto selection of msn
         */
        selectCurrentMsn: function (oEvt) {

            var fSelected = oEvt.getSource().getSelected();
            if(fSelected) {
            	airbus.mes.settings.util.ModelManager.current_flag = "X";
            } else {
            	airbus.mes.settings.util.ModelManager.current_flag = "";
        	}
        
            
            if (fSelected) {
                this.getView().getController().onSelectionChange("selectStation");
            }

            if (airbus.mes.settings.oView.byId("selectStation").getSelectedKey() != "") {
                this.getView().byId("selectMSN").setEnabled(!fSelected);
            }

        },

        /**
         * Fire when the user press confirm it save data.
         */
        onConfirm: function (oEvent) {
        	
//        	Check if user has selected current MSN flag and current MSN is available
        	if(airbus.mes.settings.util.ModelManager.current_flag === "X" && airbus.mes.settings.util.ModelManager.msn === "---") {
//        		case of error
                sap.m.MessageToast.show(airbus.mes.stationtracker.oView.getModel("StationTrackerI18n")
                    .getProperty("NoUnplanned selected "));        		
        		
        		
        		return;
        	}
        	
        	
            //Firstly, save the new user settings
            this.saveUserSettings();
            //load appconfiguration for that site
            airbus.mes.settings.util.AppConfManager.loadAppConfig();
            //Then Navigate to correct view
            if (!this.getView().byId("selectMSN").getSelectedKey()) {
                airbus.mes.settings.util.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("SelectMSN"));
                return;
            }

            //initialize jigs & Tools to force refresh when confirm settings
            airbus.mes.shell.util.navFunctions.jigsAndTools.configME = undefined;

            airbus.mes.settings.oView.byId("navBack").setEnabled(true);
            //show hide factory tile render screen again
            airbus.mes.homepage.oView.getController().enableDisableFactoryView();

            this.navigate(oEvent);
        },

        saveUserSettings: function () {

            if (this.getView().byId("headTextPlant").getSelectedItem() === null) {
                airbus.mes.settings.util.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("SelectSite"));
                return;
                // check if one combobox of program is selected
            } else if (!this.getView().byId("headTextProgram").getItems().some(function (el) {
                return el.getContent()[0].getItems()[0].getSelected();
            })) {
                airbus.mes.settings.util.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("SelectProgram"));
                return;
            } else if (!this.getView().byId("selectLine").getSelectedKey()) {
                airbus.mes.settings.util.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("SelectLine"));
                return;
            } else if (!this.getView().byId("selectStation").getSelectedKey()) {
                airbus.mes.settings.util.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("SelectStation"));
                return;
            } else if (!this.getView().byId("selectMSN").getSelectedKey()) {
                airbus.mes.settings.util.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("SelectMSN"));
                return;
            } else {

                var sProgram = this.getView().byId("headTextProgram").getItems().find(function (e) {
                    return e.getContent()[0].getItems()[0].getSelected()
                }).getContent()[0].getItems()[0].getText();

                // Save value selected.
                var aModel = sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row");
                aModel = aModel.filter(function (el) {
                    return el.program === sProgram &&
                        el.line === airbus.mes.settings.oView.byId("selectLine").getSelectedKey() &&
                        el.station === airbus.mes.settings.oView.byId("selectStation").getSelectedKey() &&
                        el.msn === airbus.mes.settings.oView.byId("selectMSN").getSelectedKey();
                })[0];
                //Internal value update
                airbus.mes.settings.util.ModelManager.site = airbus.mes.settings.util.ModelManager.newSite;
                airbus.mes.settings.util.ModelManager.program = aModel.program;
                airbus.mes.settings.util.ModelManager.line = aModel.line;
                airbus.mes.settings.util.ModelManager.station = aModel.station;
                // Msn value is directly selected by function in that case we get SelectedKey does not work so we take directly the value.
                airbus.mes.settings.util.ModelManager.msn = aModel.msn;
                airbus.mes.settings.util.ModelManager.taktStart = aModel.Takt_Start;
                airbus.mes.settings.util.ModelManager.taktEnd = aModel.Takt_End;
                airbus.mes.settings.util.ModelManager.taktDuration = aModel.Takt_Duration;
                //Description update
                airbus.mes.settings.util.ModelManager.siteDesc = airbus.mes.settings.util.ModelManager.newSiteDesc;
                airbus.mes.settings.util.ModelManager.lineDesc = aModel.lineDescription
                airbus.mes.settings.util.ModelManager.programDesc = aModel.programDescription;
                airbus.mes.settings.util.ModelManager.stationDesc = aModel.stationDescription;

                airbus.mes.settings.util.ModelManager.saveUserSetting(sap.ui.getCore().getConfiguration().getLanguage().slice(0, 2));

                //Refresh label in header.
                airbus.mes.settings.util.ModelManager.loadUserSettingsModel();
            }
        },
        /**
         * Fire when the user press confirm move to correct view.
         */
        navigate: function (oEvent) {

            // Active settings button during leaving settings screen
            if (airbus.mes.shell != undefined) {
                sap.ui.getCore().byId("popupSettingsButton").setEnabled(true);
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
                	airbus.mes.shell.util.navFunctions.disruptionTracker()
                    //nav.to(airbus.mes.homepage.oView.sId);
                    break;
                /** Disruption Tracker KPI **/
                case "disruptionKPI":
                    airbus.mes.shell.util.navFunctions.disruptionKPI();
                    break;
                /** PolyPoly **/
                case "polypoly":
                    airbus.mes.shell.util.navFunctions.polypoly();
                    break;
                case "back":
                    nav.back();
                    break;
                default:
                    break;
            }

        },

        isProgramSelected: function () {
            if (airbus.mes.settings.oView) {
                var customListItem = airbus.mes.settings.oView.oController.byId("settingsView--headTextProgram").getItems();
                var length = customListItem.length;
                for (var i = 0; i < length; i++) {
                    if (customListItem[i].mAggregations.content[0].mAggregations.items[0].getSelected()) {
                        return true;
                    }
                }
            }

            return false;
        },

    });
