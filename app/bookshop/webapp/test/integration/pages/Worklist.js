sap.ui.define([
	"sap/ui/test/Opa5",
    'sap/ui/test/matchers/Properties',
	'sap/ui/test/actions/Press',
    'sap/ui/test/actions/EnterText'
], function(Opa5, Properties, Press, EnterText) {
	"use strict";

	var sViewName = "Worklist";
	Opa5.createPageObjects({
		onTheWorklistPage: {

			actions: {
                iPressCreateBookButton: function () {
                    return this.waitFor({
                        id: "openCreateBookDialogButton",
                        controlType: "sap.m.Button",
                        viewName : sViewName,
                        actions: new Press(),
                        errorMessage: "Cannot find the icon tab bar"
                    });
                },

                iEnterBookTitle: function (sBookTitle) {
                    return this.waitFor({
                        id: "book-title",
                        controlType: "sap.m.Input",
						viewName: sViewName,
						actions: new EnterText({
                            text: sBookTitle
                        }),
						errorMessage: "Input was not found."
                    })
                },

                iSelectBookAuthor: function () {
                    return this.waitFor({
                        id: "book-author",
                        controlType: "sap.m.ActionSelect",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "ActionSelect was not found."
                    })
                },

                iPressAddNewAuthor: function () {
                    return this.waitFor({
                        id: "addNewAuthorButton",
                        controlType: "sap.m.Button",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Button was not found."
                    })
                },

                iEnterAuthorName: function (sAuthorName) {
                    return this.waitFor({
                        id: "authorName",
                        controlType: "sap.m.Input",
                        viewName: sViewName,
                        actions: new EnterText({
                            text: sAuthorName
                        }),
						errorMessage: "Input was not found."
                    })
                },

                iEnterDateOfBirth: function (sDateOfBirth) {
                    return this.waitFor({
                        id: "authorBirthday",
                        controlType: "sap.m.DatePicker",
                        viewName: sViewName,
                        actions: new EnterText({ 
                            text: sDateOfBirth,
                            pressEnterKey: true
                        })
                    })
                },

                iEnterCountryOfBirth: function (sCountryOfBirth) {
                    return this.waitFor({
                        id: "authorCountry",
                        controlType: "sap.m.ComboBox",
                        viewName: sViewName,
                        actions: new EnterText({ 
                            text: sCountryOfBirth,
                            pressEnterKey: true
                        })
                    })
                },

                iPressSubmitAuthorCreationButton: function () {
                    return this.waitFor({
                        id: "submitCreateAuthorButton",
                        controlType: "sap.m.Button",
                        viewName : sViewName,
                        actions: new Press(),
                        errorMessage: "Cannot find the button"
                    })
                },

                iSelectAuthorFromActionSelect: function (sAuthorID) {
                    return this.waitFor({
                        controlType: "sap.ui.core.Item",
                        viewName : sViewName,
                        matchers : new Properties({
                            key: sAuthorID
                        }),
                        actions: new Press(),
                        errorMessage: "Cannot find the button"
                    })
                },

                iEnterBookDescription: function (sBookDescription) {
                    return this.waitFor({
                        id: "book-description",
                        controlType: "sap.m.TextArea",
						viewName: sViewName,
						actions: new EnterText({
                            text: sBookDescription
                        }),
						errorMessage: "TextArea was not found."
                    })
                },

                iEnterBookPrice: function (iBookPrice) {
                    return this.waitFor({
                        id: "book-price",
                        controlType: "sap.m.Input",
						viewName: sViewName,
						actions: new EnterText({
                            text: iBookPrice
                        }),
						errorMessage: "Input was not found."
                    })
                },

                iEnterBookInStockAmount: function (sBookInStockAmount) {
                    return this.waitFor({
                        id: "book-stock",
                        controlType: "sap.m.Input",
						viewName: sViewName,
						actions: new EnterText({
                            text: sBookInStockAmount
                        }),
						errorMessage: "Input was not found."
                    })
                },

                iEnterBookRating: function (sBookRating) {
                    return this.waitFor({
                        id: "book-rating",
                        controlType: "sap.m.Input",
						viewName: sViewName,
						actions: new EnterText({
                            text: sBookRating
                        }),
						errorMessage: "Input was not found."
                    })
                },

                iPressSubmitBookCreationButton: function () {
                    return this.waitFor({
                        id: "submitBookCreationButton",
                        controlType: "sap.m.Button",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Button was not found."
                    })
                }
            },

           

			assertions: {

				iShouldSeeTheApp: function () {
					return this.waitFor({
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The Worklist view is displayed");
						},
						errorMessage: "Did not find the Worklist view"
					});
				},

                iShouldSeeCreateBookDialog: function () {
                    return this.waitFor({
                        id: "BookDialog",
                        viewName: sViewName,
                        success: function () {
                            Opa5.assert.ok(true, "The create book dialog was visible");
                        },
                        errorMessage: "The create book dialog could not be found"
                    })
                },

                iShouldSeeBookTitleWithValue: function (sBookTitle) {
                    return this.waitFor({
                        id: "book-title",
                        viewName: sViewName,
                        matchers: new Properties({
                            value: sBookTitle,
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The title was visible");
                        },
                        errorMessage: "The title input didn't match the correct value"
                    })
                },

                iShouldSeeCreateAuthorDialog: function () {
                    return this.waitFor({
                        id: "createAuthorDialog",
                        viewName: sViewName,
                        success: function () {
                            Opa5.assert.ok(true, "The create author dialog was visible");
                        },
                        errorMessage: "The create author dialog could not be found"
                    })
                },

                iShouldSeeSelectedRecentlyCreatedAuthor: function (sAuthorID) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.ActionSelect",
                        matchers: new Properties({
                            selectedKey: sAuthorID,
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The correct author was selected");
                        },
                        errorMessage: "The author name select didn't match the correct value"
                    })
                },

                iShouldSeeCorrectDescription: function (sBookDescription) {
                    return this.waitFor({
                        id: "book-description",
                        controlType: "sap.m.TextArea",
						viewName: sViewName,
						matchers: new Properties({
                            value: sBookDescription,
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The correct description");
                        },
                        errorMessage: "Incorrect description"
                    })
                },

                iShouldSeeCorrectBookPrice: function (iBookPrice) {
                    return this.waitFor({
                        id: "book-price",
                        viewName: sViewName,
                        matchers: new Properties({
                            value: iBookPrice,
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The price was correct");
                        },
                        errorMessage: "The price input didn't match the correct value"
                    })
                },

                iShouldSeeCorrectBookInStockAmount: function (iBookInStockAmount) {
                    return this.waitFor({
                        id: "book-stock",
                        viewName: sViewName,
                        matchers: new Properties({
                            value: iBookInStockAmount,
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The book in stock amount was correct");
                        },
                        errorMessage: "The book in stock input didn't match the correct value"
                    })
                },

                iShouldSeeCorrectBookRatingValue: function (sBookRating) {
                    return this.waitFor({
                        id: "book-rating",
                        viewName: sViewName,
                        matchers: new Properties({
                            value: sBookRating,
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The book rating value was correct");
                        },
                        errorMessage: "The book rating value didn't match the correct value"
                    })
                },

                iShouldSeeBooksTableWithNewBook: function () {
                    return this.waitFor({
                        id: "booksTable",
                        viewName: sViewName,
                        success: function () {
                            Opa5.assert.ok(true, "The book was successfully created");
                        },
                        errorMessage: "The book rating value didn't match the correct value"
                    })
                }
			}
		}
	});
});
