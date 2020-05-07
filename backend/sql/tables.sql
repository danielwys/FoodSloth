
create table Users (
    uid                  serial primary key,
    username             varchar(100) not null,
    password             varchar(100) not null,
    type                 varchar(50) not null,
    createdAt            timestamptz not null default now(),
    unique (username),
    constraint user_type check (type in ('customer','restaurant','rider','manager'))
);

create table Customers (
    cid                 integer primary key,
    cname               text not null,
    rewardPoints        integer not null default 0,
    creditCardNumber    bigint,
    foreign key (cid) references Users (uid),
    constraint cd_lower check ((creditCardNumber) > 999999999999999),
    constraint cd_upper check ((creditCardNumber) < 10000000000000000)
);

create table Restaurants (
    restaurantId        integer primary key,
    restaurantName      text not null,
    minOrder            integer not null default 10,
    deliveryFee         integer not null default 5,
    foreign key (restaurantId) references Users (uid),
    constraint minOrderAmt check (minOrder >= 0),
    constraint deliveryFeeAmt check (deliveryFee >= 0)
);

create table Riders (
    riderId             integer primary key,
    salary              money not null default 500,
    partTime            boolean not null,
    rating              integer,
    foreign key (riderId) references Users (uid),
    constraint salaryAmt check (salary >= '$0')
);

create table MWS (
    riderId             integer primary key,
    startDay            integer,
    shift               integer,
    constraint day_start check (startDay in (0,1,2,3,4,5,6)),
    constraint shift_number check (shift in (1,2,3,4)),
    foreign key (riderId) references Riders (riderId)
);
-- where 1 is monday for startDay

create table WWS (
    riderId             integer,
    day                 integer,
    hourStart           integer,
    hourEnd             integer,
    primary key (riderId, day, hourStart),
    constraint day_working check (day in (0,1,2,3,4,5,6)),
    constraint check_start check (hourStart between 10 and 22),
    constraint check_end check (hourEnd between 10 and 22),
    constraint durationCheck check (hourEnd - hourStart <= 4), 
    constraint startCheck check (hourStart < hourEnd),
    foreign key (riderId) references Riders (riderId)
);

create table Menu (
    foodId              serial primary key,
    restaurantId        integer not null,
    foodName            text not null,
    price               money not null,
    maxAvailable        integer not null,
    category            text not null,
    foreign key (restaurantId) references Restaurants (restaurantId) on delete cascade,
    constraint priceAmt check (price >= '$0'),
    constraint maxAvailableAmt check (maxAvailable >= 0)
);

create table Promos (
    code            varchar(50) primary key,
    restaurantId    integer,
    cid             integer,
    amount          integer, 
    minSpend        money,
    startDate       date not null,
    endDate         date,
    foreign key (restaurantId) references Restaurants (restaurantId),
    foreign key (cid) references Customers (cid),
    constraint amountAmt check (amount > 0),
    constraint minSpendAmt check (minSpend > '$0'),
    constraint dateCheck check (startDate < endDate),
    constraint customerOrRestCheck check (COALESCE(cid, restaurantId) IS NOT NULL)
);

create table Addresses (
    aid                 serial primary key,
    uid                 integer not null,
    area                varchar(50),
    addressText         text not null,
    postalCode          integer not null,

    foreign key (uid) references Users (uid),
    constraint check_area check (area in ('north','south','east','west','central'))
);

create table Orders (
    orderId             serial primary key,
    cid                 integer not null,
    restaurantId        integer not null,
    riderId             integer,
    aid                 integer not null,
    deliveryFee         money not null,
    byCash              boolean not null,
    creditCardNumber    bigint,
    promo           varchar(50),
    foreign key (cid) references Customers (cid),
    foreign key (restaurantId) references Restaurants (restaurantId),
    foreign key (riderId) references Riders (riderId),
    foreign key (aid) references Addresses(aid),
    foreign key (promo) references Promos(code),
    constraint cd_lower check ((creditCardNumber) > 999999999999999),
    constraint cd_upper check ((creditCardNumber) < 10000000000000000),
    constraint deliveryFeeAmt check (deliveryFee >= '$0')
);

create table OrderTimes (
    orderId                 integer primary key,
    timeOrdered         timestamptz not null default now(),
    timeRiderAssigned   timestamptz,
    timeRiderArrives    timestamptz,
    timeRiderDeparted   timestamptz,
    timeRiderDelivered  timestamptz,
    foreign key (orderId) references Orders (orderId)
);

create table OrderItems (
    orderId             integer,
    foodId              integer not null,
    quantity            integer not null default 1,
    primary key(orderId, foodId),
    foreign key (orderId) references Orders (orderId),
    constraint quantityAmt check (quantity > '0')
);

create table Reviews (
    orderId             integer primary key,
    rating              integer not null,
    review              text,
    createdAt           timestamptz not null default now(),
    foreign key (orderId) references Orders (orderId),
    constraint ratingAmt check (rating in (1,2,3,4,5))
);



