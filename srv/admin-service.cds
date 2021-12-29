using { sap.capire.bookshop as my } from '../db/schema';
service AdminService  {
    entity Books as projection on my.Books;
    entity Authors as projection on my.Authors;
    entity Orders as projection on my.Orders;
    entity Genres as projection on my.Genres;
    entity Orders_items as projection on my.Orders.items;

}

