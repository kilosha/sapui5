using FioriService as service from '../../srv/fiori-service';


annotate service.Books with @(


	UI: {
        HeaderInfo: {
            TypeName: '{i18n>BookTableTitle}',
            TypeNamePlural: '{@i18n>BookTableTitlePlural}',
            Title          : {
                $Type : 'UI.DataField',
                Value : title
            },
            Description: {
                Value: author_ID
            }
        },

        LineItem : [
            {
                $Type : 'UI.DataField',
                Value : title,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '10rem'},
                
            },
            {
                $Type : 'UI.DataField',
                Value : author_ID,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '8rem'}
            },
            {
                $Type : 'UI.DataField',
                Value : genre_title,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '10rem'}
            },
            {
                $Type : 'UI.DataField',
                Value : price,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '10rem'}
            },
            {
                $Type : 'UI.DataField',
                Value : stock,
                ![@UI.Importance] : #High  ,
                ![@HTML5.CssDefaults] : {width : '8rem'}
            },
            {
                $Type : 'UI.DataFieldForAnnotation',
                Label : 'Rating',
                Target : '@UI.DataPoint#rating',
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '8rem'}
            },
            {
                Value: descr,
                ![@UI.Hidden]
            },
            {
                Value: ID,
                ![@UI.Hidden]
            },
            {
                Value: currency,
                ![@UI.Hidden]
            }
        ],

        SelectionFields : [
            title,
            author_ID,
            genre_title
        ],

        DataPoint #rating : {
            Value : rating,
            Title: 'Rating',
            TargetValue: 5,
            Visualization : #Rating
        },

        DataPoint #price : {
            Title: 'Price',
            Value : price
        },

        DataPoint #descr : {
            Title: 'Description',
            Value : descr
        },

        HeaderFacets : [
            {
                $Type  : 'UI.ReferenceFacet',
                Target : '@UI.DataPoint#price'
            },
            {
                $Type  : 'UI.ReferenceFacet',
                Target : '@UI.DataPoint#rating'
            }
        ],

        Facets: [
            {
                $Type: 'UI.CollectionFacet',
                Label: '{@i18n>BookOverview}',
                Facets: [
                    {   
                        $Type: 'UI.ReferenceFacet', 
                        Target: '@UI.FieldGroup#Description'
                    },
                    {   $Type: 'UI.ReferenceFacet', 
                        Target: '@UI.FieldGroup#Main'
                    }
                ]
            },
            {
                $Type: 'UI.ReferenceFacet',
                Target: 'orders/@UI.LineItem',
                Label: '{@i18n>BookOrders}',
                ![@UI.Hidden] : HasActiveEntity
            }
        ],   

        FieldGroup#Description: {
            Data: [
                { Value: descr }
            ]
        },

        FieldGroup#Main: {
            Data: [
                { Value: genre_title },
                { Value: stock }
            ]
        }    
	}
){
    @Measures.ISOCurrency : currency
    price;

    author
    @ValueList.entity : 'Authors';

    @UI.HiddenFilter
    descr;

};

annotate service.Orders with @(
	UI.LineItem  : [
        {
            $Type : 'UI.DataField',
            Value : customerName
        },
    ]  
){
    @Measures.ISOCurrency : currency
    totalCost;
};

annotate service.Orders_items with @(

    UI : { 
        HeaderInfo : {
            TypeName: '{@i18n>OrdersTableTitle}',
            TypeNamePlural: '{@i18n>OrdersTableTitlePlural}'
		},

	    LineItem  : [
            {
                $Type : 'UI.DataField',
                Value : up_.deliveryDate,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '8rem'}
            },
            {
                $Type : 'UI.DataField',
                Value : up_.customerName,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '15rem'}
            },
            {
                $Type : 'UI.DataField',
                Value : up_.phoneNumber,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '8rem'}
            },
            {
                $Type : 'UI.DataField',
                Value : up_.customerCity,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '8rem'}
            },
            {
                $Type : 'UI.DataField',
                Value : up_.customerAddress,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '14rem'}
            },
            {
                $Type : 'UI.DataField',
                Value : up_.paymentMethod,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '8rem'}
            },
            {
                $Type : 'UI.DataField',
                Value : up_.totalCost,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {width : '8rem'}
            },
            {
                Value: up__ID,
                ![@UI.Hidden]
            },
            {
                Value: book_ID,
                ![@UI.Hidden]
            }
        ]
    }
);