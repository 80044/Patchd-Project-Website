CREATE TABLE IF NOT EXISTS clothes (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT NOT NULL,
   collection TEXT NOT NULL,
   type TEXT NOT NULL,
   price decimal(15, 2) NOT NULL,
   description TEXT NOT NULL,
   image TEXT NOT NULL,
   featured BOOLEAN NOT NULL DEFAULT 0
);

--INSERT INTO clothes (name, type, collection, price, description, image, featured) VALUES 
--("Money Hoodie", "Outerwear", "Winter Classics", 69.99, "A warm cotton hoodie", "/assets/images/sql/Money_Hoodie(ID6).jpg", 0),
--("Scorpion Hoodie", "Outerwear", "Winter Classics", 69.99, "A warm cotton hoodie with a scorpion design", "/assets/images/sql/Scorpion_Hoodie(ID7).jpg", 0),
--("Stripe Hoodie ", "Outerwear", "Winter Classics", 69.99, "A warm cotton hoodie with a stripe design", "/assets/images/sql/Stripe_Hoodie(ID8).jpg", 0),
--("Cross Pullover", "Outerwear", "Winter Classics", 65.99, "Comfortable cross pullover for a unique look", "/assets/images/sql/Cross_Pullover(ID9).jpg", 0),
--("NY Logo Shirt", "Top", "Summer Vibes", 39.99, "A trendy shirt featuring the New York logo", "/assets/images/sql/NY_Shirt(ID10).jpg", 0),
--("Striped Shirt", "Top", "Summer Vibes", 39.99, "A trendy shirt featuring a multicoloured striped pattern", "/assets/images/sql/Striped_Shirt(ID11).jpg", 0),
--("Retro Jersey", "Top", "Retro Revenge", 35.99, "A trendy jersey, inspired by retro designs", "/assets/images/sql/Retro_Jersey(ID12).jpg", 0);
--("Blue Reverse Plaid Zip-Up", "Outerwear", "Plaid Paradise", 79.99, "A comfortable trendy cotton zip-up, featuring a plaid patterned interior.", "/assets/images/sql/brpzu(ID1).jpg", 1),
--("Gray Plaid Button Up", "Top", "Plaid Paradise", 49.99, "A stylish gray plaid button-up shirt", "/assets/images/sql/gpbu(ID2).jpg", 1),
--("8-Ball Jorts", "Jeans", "Jorts Jeopardy", 49.99, "Stylish denim jorts with an 8-ball design", "/assets/images/sql/8Ball_Jorts(ID3).jpg", 1),
--("Blackout Jorts", "Jeans", "Jorts Jeopardy", 49.99, "Stylish black denim jorts", "/assets/images/sql/Blackout_Jorts(ID4).jpg", 0),
--("Double Knee Black Jorts", "Jeans", "Jorts Jeopardy", 49.99, "Durable black denim jorts with reinforced knees", "/assets/images/sql/Double_Knee_Black_Jorts(ID5).jpg", 1);


--ALTER TABLE clothes ADD COLUMN featured BOOLEAN NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS carts (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   session_id TEXT NOT NULL UNIQUE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   cart_id INTEGER NOT NULL,
   clothes_id INTEGER NOT NULL,
   quantity INTEGER NOT NULL DEFAULT 1,
   FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
   FOREIGN KEY (clothes_id) REFERENCES clothes(id) ON DELETE CASCADE,
   UNIQUE(cart_id, clothes_id)
);

--UPDATE clothes 
--SET price = 59.99 WHERE type = "Jeans" AND collection = "Jorts Jeopardy";
--SET name = "Blue Reverse Plaid Zip-Up", type = "Outerwear", price = 79.99, description = "A comfortable trendy cotton zip-up, featuring a plaid patterned interior.", image = "/assets/images/sql/brpzu(ID1).jpg", featured = 1 WHERE id = 1;

