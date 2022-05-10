sap.ui.define([
"ns/bookshop/model/formatter"
], function (formatter) {
	"use strict";

	QUnit.module("Number unit");

	function numberUnitValueTestCase(assert, sValue, fExpectedNumber) {
		// Act
		var fNumber = formatter.numberUnit(sValue);

		// Assert
		assert.strictEqual(fNumber, fExpectedNumber, "The rounding was correct");
	}

	QUnit.test("Should round down a 3 digit number", function (assert) {
		numberUnitValueTestCase.call(this, assert, "3.123", "3.12");
	});

	QUnit.test("Should round up a 3 digit number", function (assert) {
		numberUnitValueTestCase.call(this, assert, "3.128", "3.13");
	});

	QUnit.test("Should round a negative number", function (assert) {
		numberUnitValueTestCase.call(this, assert, "-3", "-3.00");
	});

	QUnit.test("Should round an empty string", function (assert) {
		numberUnitValueTestCase.call(this, assert, "", "");
	});

	QUnit.test("Should round a zero", function (assert) {
		numberUnitValueTestCase.call(this, assert, "0", "0.00");
	});


    QUnit.module("Sort type formatter");

    function sortTypeFormatterValueTestCase(assert, sValue, sExpectedSortType) {
		// Act
		const sSortType = formatter.sortTypeFormatter(sValue);

		// Assert
		assert.strictEqual(sSortType, sExpectedSortType, "Function works correct");
	}

    QUnit.test("Should return 'sort'", function (assert) {
		sortTypeFormatterValueTestCase.call(this, assert, "", "sort");
	});

    QUnit.test("Should return 'sort-ascending'", function (assert) {
		sortTypeFormatterValueTestCase.call(this, assert, "ASC", "sort-ascending");
	});

    QUnit.test("Should return 'sort-descending'", function (assert) {
		sortTypeFormatterValueTestCase.call(this, assert, "DESC", "sort-descending");
	});

    QUnit.test("Should return 'sort'", function (assert) {
		sortTypeFormatterValueTestCase.call(this, assert, "test", "sort");
	});
});
