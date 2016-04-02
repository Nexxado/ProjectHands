mongoimport --db hands --collection users --type json --file ./users-seed.json --jsonArray --drop
mongoimport --db hands --collection chats --type json --file ./chats-seed.json --jsonArray --drop
mongoimport --db hands --collection renovations --type json --file ./renovations-seed.json --jsonArray --drop
mongoimport --db hands --collection teams --type json --file ./teams-seed.json --jsonArray --drop
pause