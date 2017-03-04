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
			//toBooleanLeft
			assert.strictEqual(acpnglinksFormatter.toBooleanLeft("never"),false, "BooleanLeft('never') = false");
			assert.strictEqual(acpnglinksFormatter.toBooleanLeft("true"),false, "BooleanLeft('true') = false");
			assert.strictEqual(acpnglinksFormatter.toBooleanLeft("false"),true, "BooleanLeft('false') = true");
			assert.strictEqual(acpnglinksFormatter.toBooleanLeft(),false, "BooleanLeft() = false");
			
			//toBooleanRight
			assert.strictEqual(acpnglinksFormatter.toBooleanRight("never"),false, "BooleanRight('never') = false");
			assert.strictEqual(acpnglinksFormatter.toBooleanRight("true"),true, "BooleanRight('true') = false");
			assert.strictEqual(acpnglinksFormatter.toBooleanRight("false"),false, "BooleanRight('false') = true");
			assert.strictEqual(acpnglinksFormatter.toBooleanRight(),false, "BooleanRight() = false");
			
			//levelFormat
			assert.strictEqual(acpnglinksFormatter.levelFormat("A"),"1","levelFormat('A') = '1'");
			assert.strictEqual(acpnglinksFormatter.levelFormat(),"1","levelFormat() = '1'");
			assert.strictEqual(acpnglinksFormatter.levelFormat("0"),"0","levelFormat('0') = '0'");
			assert.strictEqual(acpnglinksFormatter.levelFormat("5"),"0","levelFormat('5') = '0'");
			assert.strictEqual(acpnglinksFormatter.levelFormat("15"),"0","levelFormat('15') = '0'");
			assert.strictEqual(acpnglinksFormatter.levelFormat("1"),"1","levelFormat('1') = '1'");
			assert.strictEqual(acpnglinksFormatter.levelFormat("6"),"1","levelFormat('6') = '1'");
			
			//currentWOFormat
			
		});
	}

);
