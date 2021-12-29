using { sap.capire.bookshop as my } from '../db/schema';
service FioriService  {

    @odata.draft.enabled
    entity Books as projection on my.Books;

    
    entity Authors as projection on my.Authors;


    @readonly
    entity Orders as projection on my.Orders;
    entity Genres as projection on my.Genres;

    @readonly
    entity Orders_items as projection on my.Orders.items;
}

