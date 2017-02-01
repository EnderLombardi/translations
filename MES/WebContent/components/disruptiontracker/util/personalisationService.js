"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.util.personalisationService");
jQuery.sap.require("jquery.sap.global");
// Very simple page-context personalization
airbus.mes.disruptiontracker.util.personalisationService = {

	oData : {
		_persoSchemaVersion : "1.0",
		aColumns : [ {
			id : "disruptiontrackerTable-disruptionsTable-operationCol",
			order : 0,
			text : "operation",
			visible : true
		}, {
			id : "disruptiontrackerTable-disruptionsTable-gravityCol",
			order : 1,
			text : "gravity",
			visible : true
		}, {
			id : "disruptiontrackerTable-disruptionsTable-statusCol",
			order : 2,
			text : "status",
			visible : false
		}, {
			id : "disruptiontrackerTable-disruptionsTable-categoryCol",
			order : 3,
			text : "category",
			visible : true
		}, {
			id : "disruptiontrackerTable-disruptionsTable-reasonCol",
			order : 4,
			text : "reason",
			visible : true
		},{
			id : "disruptiontrackerTable-disruptionsTable-originatorGroupCol",
			order : 5,
			text : "originatorGroup",
			visible : true
		},
		{
			id : "disruptiontrackerTable-disruptionsTable-resolutionGroupCol",
			order : 6,
			text : "resolutionGroup",
			visible : true
		},
		{
			id : "disruptiontrackerTable-disruptionsTable-escalationCol",
			order : 7,
			text : "escalation",
			visible : true
		},
		{
			id : "disruptiontrackerTable-disruptionsTable-openingTimeCol",
			order : 8,
			text : "openingTime",
			visible : true
		},
		{
			id : "disruptiontrackerTable-disruptionsTable-fixedByTimeCol",
			order : 9,
			text : "fixedByTime",
			visible : true
		},
		{
			id : "disruptiontrackerTable-disruptionsTable-promisedDateCol",
			order : 10,
			text : "promisedDate",
			visible : true
		},
		{
			id : "disruptiontrackerTable-disruptionsTable-timeBeforeNextEscCol",
			order : 11,
			text : "timeBofreNextEsc",
			visible : true
		},
		{
			id : "disruptiontrackerTable-disruptionsTable-descriptionCol",
			order : 12,
			text : "description",
			visible : true
		},
		{
			id : "disruptiontrackerTable-disruptionsTable-solutionCol",
			order : 13,
			text : "solution",
			visible : true
		},
		{
			id : "disruptiontrackerTable-disruptionsTable-closureDateCol",
			order : 14,
			text : "closureDate",
			visible : true
		}]
	},

	getPersData : function() {
		var oDeferred = new jQuery.Deferred();
		if (!this._oBundle) {
			this._oBundle = this.oData;
		}
		var oBundle = this._oBundle;
		oDeferred.resolve(oBundle);
		return oDeferred.promise();
	},

	setPersData : function(oBundle) {
		var oDeferred = new jQuery.Deferred();
		this._oBundle = oBundle;
		oDeferred.resolve();
		return oDeferred.promise();
	},

	resetPersData : function() {
		var oDeferred = new jQuery.Deferred();
		var oInitialData = {
			_persoSchemaVersion : "1.0",
			aColumns : [ {
				id : "disruptiontrackerTable-disruptionsTable-operationCol",
				order : 0,
				text : "operation",
				visible : true
			}, {
				id : "disruptiontrackerTable-disruptionsTable-gravityCol",
				order : 1,
				text : "gravity",
				visible : true
			}, {
				id : "disruptiontrackerTable-disruptionsTable-statusCol",
				order : 2,
				text : "status",
				visible : false
			}, {
				id : "disruptiontrackerTable-disruptionsTable-categoryCol",
				order : 3,
				text : "category",
				visible : true
			}, {
				id : "disruptiontrackerTable-disruptionsTable-reasonCol",
				order : 4,
				text : "reason",
				visible : true
			},{
				id : "disruptiontrackerTable-disruptionsTable-originatorGroupCol",
				order : 5,
				text : "originatorGroup",
				visible : true
			},
			{
				id : "disruptiontrackerTable-disruptionsTable-resolutionGroupCol",
				order : 6,
				text : "resolutionGroup",
				visible : true
			},
			{
				id : "disruptiontrackerTable-disruptionsTable-escalationCol",
				order : 7,
				text : "escalation",
				visible : true
			},
			{
				id : "disruptiontrackerTable-disruptionsTable-openingTimeCol",
				order : 8,
				text : "openingTime",
				visible : true
			},
			{
				id : "disruptiontrackerTable-disruptionsTable-fixedByTimeCol",
				order : 9,
				text : "fixedByTime",
				visible : true
			},
			{
				id : "disruptiontrackerTable-disruptionsTable-promisedDateCol",
				order : 10,
				text : "promisedDate",
				visible : true
			},
			{
				id : "disruptiontrackerTable-disruptionsTable-timeBeforeNextEscCol",
				order : 11,
				text : "timeBofreNextEsc",
				visible : true
			},
			{
				id : "disruptiontrackerTable-disruptionsTable-descriptionCol",
				order : 12,
				text : "description",
				visible : true
			},
			{
				id : "disruptiontrackerTable-disruptionsTable-solutionCol",
				order : 13,
				text : "solution",
				visible : true
			},
			{
				id : "disruptiontrackerTable-disruptionsTable-closureDateCol",
				order : 14,
				text : "closureDate",
				visible : true
			}]
		};

		// set personalization
		this._oBundle = oInitialData;

		// reset personalization, i.e. display table as defined
		// this._oBundle = null;

		oDeferred.resolve();
		return oDeferred.promise();
	},

	// this caption callback will modify the TablePersoDialog' entry for the
	// 'xxxx' column
	// to 'xxxyyy', but will leave all other column names as
	// they are.
	/*getCaption : function(oColumn) {
		if (oColumn.getHeader() && oColumn.getHeader().getText()) {
			if (oColumn.getHeader().getText() === "xxxx") {
				return "xxyyyy";
			}
		}
		return null;
	},

	getGroup : function(oColumn) {
		if (oColumn.getId().indexOf('productCol') != -1 || oColumn.getId().indexOf('supplierCol') != -1) {
			return "Primary Group";
		}
		return "Secondary Group";
	}*/
};
