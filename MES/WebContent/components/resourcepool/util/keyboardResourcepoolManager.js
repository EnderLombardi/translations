"use strict";

jQuery.sap.declare("airbus.mes.resourcepool.util.keyboardResourcepoolManager");

airbus.mes.resourcepool.keyboardResourcepoolManager = {

    //if you have issues with blue search icon change background-color of sapMSFBA class
    hideKeyboard: function (searchDiv) {
        if (searchDiv && document.activeElement) {
            searchDiv.onsapenter = (function (oEvt) { //onsapenter is a function when ENTER key is touched
                //lose focus on the active element so hide keyboard
                document.activeElement.blur();
            });
        }
    },

}