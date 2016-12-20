"use strict";
/*if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement  , fromIndex ) {
        var O = Object(this);
        var len = parseInt(O.length, 10) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1], 10) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement
                    || (searchElement !== searchElement && currentElement !== currentElement)) { // NaN
                                                                                                    // !==
                                                                                                    // NaN
                return true;
            }
            k++;
        }
        return false;
    };
}*/
jQuery.sap.declare("airbus.mes.linetracker.util.Formatter");
airbus.mes.linetracker.util.Formatter = {

    parseInteger : function(value) {

        return parseInt(value,10);
    },

    imageFormatter : function(taktStatus) {
        if (taktStatus === "GOOD")
            return "../components/linetracker/images/green.png"
        else if (taktStatus === "BAD")
            return "../components/linetracker/images/red_new.png"
        else
            return "../components/linetracker/images/grey.png"
    },

    stationColor : function(convNumber) {
        if (convNumber == '1')
            return "green"
        else
            return "red"
    },

    lineFormatter : function(lineNo, stationNumber) {
        if (stationNumber == "5") {
            if (parseInt(lineNo,10) === 1)
                return  airbus.mes.linetracker.oView.getModel("linetrackerI18n").getProperty("Station") + " 5 " + airbus.mes.linetracker.oView.getModel("linetrackerI18n").getProperty("panel")
            else if (parseInt(lineNo,10) === 2)
                return airbus.mes.linetracker.oView.getModel("linetrackerI18n").getProperty("Station") + " 5 " + airbus.mes.linetracker.oView.getModel("linetrackerI18n").getProperty("ribs")
            else
                return airbus.mes.linetracker.oView.getModel("linetrackerI18n").getProperty("Station") + " 5 " + airbus.mes.linetracker.oView.getModel("linetrackerI18n").getProperty("spars")
        } else {
            if (lineNo == "01")
                return airbus.mes.linetracker.oView.getModel("linetrackerI18n").getProperty("line1")
            else if (lineNo == "02")
                return airbus.mes.linetracker.oView.getModel("linetrackerI18n").getProperty("line2")
            else
                return airbus.mes.linetracker.oView.getModel("linetrackerI18n").getProperty("line3")
        }
    },

    MSNFormatter : function(msnNo) {
        if (msnNo === "---") {
            return ""
        } else
            return msnNo
    },
    factoryImageFormatter : function(taktStatus) {
        if (taktStatus === "OK")
            return "../components/linetracker/images/green.png"
        else if (taktStatus === "KO")
            return "../components/linetracker/images/red_new.png"
        else
            return "../components/linetracker/images/grey.png"
    },
    stationName : function(lineNo, station_number) {
        if (parseInt(station_number,10) === 5) {
            if (parseInt(lineNo,10) === 1)
                return "5 Panels"
            else if (parseInt(lineNo,10) === 2)
                return "5 Ribs"
            else
                return "5 Spars"
        } else
            return station_number
    },
    loadUnloadIcon : function(msn) {
        if (msn == "" || msn == "---")
            return "sap-icon://up";
        else
            return "sap-icon://down"
    },
    loadUnloadText : function(msn) {
        if (msn == "" || msn == "---")
            return "Load"
        else
            return "Unload"
    },
    totalTimeFormatter : function(value) {
        if (!value || value === "NA" || value == 0)
            return 0
        return parseFloat(value);
    },
    setVisible : function(value) {
        return airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_PULSE');
    },
//    isPolypolyEditable : function() {
//        if (PolypolyManager.globalContext.tabSelected == "polypoly") {
//            return airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_PRODMNG')
//                    || airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_MANUFMNG')
//                    || airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_HOOPE')
//                    || airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_MFTEAM');
//        } else {
//            return false;
//        }
//    },
//    isPolypolyVisible : function() {
//        return airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_PRODMNG')
//                || airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_MANUFMNG')
//                || airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_HOOPE')
//                || airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_MFTEAM')
//                || airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_CDTSUP')
//                || airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_PLTMNG');
//    },

    appendStation : function(stationNumber) {
        return airbus.mes.linetracker.util.ModelManager.i18nModel.getProperty("Station") + stationNumber
    },

    showCusto : function() {
        return airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_ADM')
                || airbus.mes.linetracker.util.RoleManager.isAllowed('MII_MOD1684_DEV');
    },
    iconFormatterAffectation : function(status) {
        switch (status) {
        case "Clocked_In":
            return "sap-icon://employee-approvals";
            break;
        case "No_Clocked_In":
            return "sap-icon://employee-rejections";
            break;
        case "Not_Available":
            return "sap-icon://employee";
            break;
        case "Planned_Absence":
            return "sap-icon://employee-pane";
            break;
//        case "No_Clock_Data":
        default :
            return "sap-icon://employee-lookup";
            break;
        }

    },
    colorFormatterAffectation : function(status) {
        switch (status) {
        case "Clocked_In":
            return "Green";
            break;
        case "No_Clocked_In":
            return "Red";
            break;
        case "Not_Available":
            return "Grey";
            break;
        case "Planned_Absence":
            return "DarkGrey";
            break;
        //case "No_Clock_Data":
        default :
            return "Black";
            break;
        }
    },

    dateFormat : function(sDate){
        var aDate = sDate.split("T");
        return aDate[0] + " " + aDate[1];
    }

}
