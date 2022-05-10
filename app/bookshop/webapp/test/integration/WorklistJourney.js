sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Worklist"
], function (opaTest) {
	"use strict";

	QUnit.module("Worklist");

	opaTest("Should see the table with all books", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheApp();
	});

    opaTest("Should open create book dialog", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iPressCreateBookButton();

        // Assertions 
        Then.onTheWorklistPage.iShouldSeeCreateBookDialog();
	});

    opaTest("Should enter book title", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iEnterBookTitle("The Picture of Dorian Gray");

        // Assertions 
        Then.onTheWorklistPage.iShouldSeeBookTitleWithValue("The Picture of Dorian Gray");
	});

    opaTest("Should open create author dialog", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iSelectBookAuthor().and.iPressAddNewAuthor();

        // Assertions 
        Then.onTheWorklistPage.iShouldSeeCreateAuthorDialog();
	});

    opaTest("Should create new author", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iEnterAuthorName("Oscar Wilde").and.iEnterDateOfBirth("1854-10-16").and.iEnterCountryOfBirth("Ireland").and.iPressSubmitAuthorCreationButton();

        // Assertions 

        Then.onTheWorklistPage.iShouldSeeCreateBookDialog();
        
	});

    opaTest("Should select recently created author", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iSelectBookAuthor().and.iSelectAuthorFromActionSelect("00a4c48c-0dfc-4507-abc6-9b54a431b788");

        // Assertions 

        Then.onTheWorklistPage.iShouldSeeSelectedRecentlyCreatedAuthor("00a4c48c-0dfc-4507-abc6-9b54a431b788");
	});

    opaTest("Should enter book description", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iEnterBookDescription('When handsome young Dorian Gray sees a painter’s stunning portrait of him, he is transfixed by its reflection of his own beauty. He is also troubled by the knowledge that the image in the painting will remain forever youthful and handsome while he himself grows older and less desirable.');

        // Assertions 

        Then.onTheWorklistPage.iShouldSeeCorrectDescription('When handsome young Dorian Gray sees a painter’s stunning portrait of him, he is transfixed by its reflection of his own beauty. He is also troubled by the knowledge that the image in the painting will remain forever youthful and handsome while he himself grows older and less desirable.');
	});


    opaTest("Should see book price", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iEnterBookPrice('7');

        // Assertions 

        Then.onTheWorklistPage.iShouldSeeCorrectBookPrice('7.00');
	});

    opaTest("Should see book in stock amount", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iEnterBookInStockAmount('10');

        // Assertions 

        Then.onTheWorklistPage.iShouldSeeCorrectBookInStockAmount('10');
	});


    opaTest("Should see correct rating value in input", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iEnterBookRating('4');

        // Assertions 

        Then.onTheWorklistPage.iShouldSeeCorrectBookRatingValue('4');
	});


    opaTest("Should create a new book", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iPressSubmitBookCreationButton();

        // Assertions 

        Then.onTheWorklistPage.iShouldSeeBooksTableWithNewBook();
	});

 
});