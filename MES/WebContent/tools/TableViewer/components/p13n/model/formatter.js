sap.ui.define([], function () {
    "use strict";
    return {

        // Function: Allow to keep only 10 first character. Output: string
        dateFormat: function (sDate) {
            if (sDate != null) {
                sDate = sDate.substring(0, 10);
            }
            return sDate;
        },

        // Function: Allow to concat two value separated by /. Output: string
        concatValue: function (sValue1, sValue2) {
            return sValue1 + ' /' + sValue2;
        },

        // Function: Allow to generate an template object. Output: Object. 
        generatedTemplate: function (sDataType, sValue) {

            var oTemplate = null;
            var nIndex = sDataType.indexOf("("); // Only Text ex: Timestamp(6) --> Timestamp

            if (nIndex != -1) {
                sDataType = sDataType.substring(0, nIndex);
            }

            switch (sDataType) {
                case "BOOLEAN":
                    oTemplate = new sap.ui.commons.CheckBox({
                        checked: '{myRow>' + sValue + '}',
                        editable: false
                    });
                    break;
                default:
                    oTemplate = new sap.ui.commons.TextField({
                        value: '{myRow>' + sValue + '}',
                        editable: false
                    });
            }
            return oTemplate;
        },

        // Function: Allow to add color class to Object Template. Output: Object.
        colorTemplate: function (oTemplate, sValue) {
            switch (sValue) {
                case "HANDLE":
                    oTemplate.addStyleClass('red');
                    break;
                default:
                    oTemplate.addStyleClass('black');
            }
            return oTemplate;
        }
    };
});