#!/bin/sh

mongoimport --db hands --collection users --type json --file ./users-seed.json --jsonArray --drop
mongoimport --db hands --collection chats --type json --file ./chats-seed.json --jsonArray --drop
mongoimport --db hands --collection renovations --type json --file ./renovations-seed-statistics.json --jsonArray --drop
mongoimport --db hands --collection teams --type json --file ./teams-seed.json --jsonArray --drop
mongoimport --db hands --collection actions --type json --file ./actions-seed.json --jsonArray --drop
mongoimport --db hands --collection admin--type json --file ./admin-seed.json --jsonArray --drop
