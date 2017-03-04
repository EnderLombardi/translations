/*global QUnit*/
"use strict";
sap.ui.require([
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],

	function (formatter) {

		QUnit.module("Formatting functions", {
			setup: function () {
			},
			teardown: function () {
			}
		});


		QUnit.test("Should return the expected values", function (assert) {

			// Arrange

			// System under test
			var acpnglinksFormatter = airbus.mes.acpnglinks.util.Formatter;

			// Assert
			assert.strictEqual(acpnglinksFormatter.toBooleanLeft("never"),false, "Booleanleft('never') = false");
		});
	}

);
