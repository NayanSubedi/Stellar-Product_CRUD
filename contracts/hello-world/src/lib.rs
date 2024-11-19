#![no_std]

use soroban_sdk::{contracttype, Env, String, log, Vec};

#[contracttype]
#[derive(Clone)]
pub struct Product {
    pub id: u64,              // Unique identifier for the product
    pub name: String,         // Product name
    pub description: String,  // Product description
    pub price: u64,           // Product price in smallest units (e.g., cents)
}

use soroban_sdk::{contract, contractimpl, symbol_short, Symbol};

#[contract]
pub struct ProductContract;

// Define the key structure for storing products
#[contracttype]
pub enum Productbook {
    Product(u64),  // Store products by ID
}

// Symbol to track the product count
const COUNT_PRODUCT: Symbol = symbol_short!("C_PROD");

#[contractimpl]
impl ProductContract {
    // Create a new product with automatically generated ID
    pub fn create_product(
        env: Env,
        name: String,
        description: String,
        price: u64,
    ) -> u64 {
        // Retrieve the current product count, or 0 if not yet set
        let mut count_product: u64 = env.storage().instance().get(&COUNT_PRODUCT).unwrap_or(0);
        
        // Increment the count for the new product ID
        count_product += 1;

        // Create a new product struct
        let new_product = Product {
            id: count_product,
            name,
            description,
            price,
        };

        // Store the product using its ID as the key
        env.storage()
            .instance()
            .set(&Productbook::Product(new_product.id), &new_product);
        
        // Update the product count in storage
        env.storage().instance().set(&COUNT_PRODUCT, &count_product);

        // Log the creation of the product
        log!(&env, "Product Created with ID: {}", new_product.id);

        // Return the generated product ID
        new_product.id
    }
}

#[contractimpl]
impl ProductContract {
    // Get a product by its ID
    pub fn get_product_by_id(env: Env, product_id: u64) -> Product {
        let key = Productbook::Product(product_id);

        // Retrieve the product from storage, or return a default "Not Found" product
        env.storage().instance().get(&key).unwrap_or(Product {
            id: 0,
            name: String::from_str(&env, "Not Found"),
            description: String::from_str(&env, "Not Found"),
            price: 0,
        })
    }
}

#[contractimpl]
impl ProductContract {
    // Update an existing product's fields (name, description, price)
    pub fn update_product(
        env: Env,
        product_id: u64,
        new_name: Option<String>,
        new_description: Option<String>,
        new_price: Option<u64>,
    ) {
        let key = Productbook::Product(product_id);
        let mut product = Self::get_product_by_id(env.clone(), product_id);

        // Update the product fields if provided
        if let Some(name) = new_name {
            product.name = name;
        }
        if let Some(description) = new_description {
            product.description = description;
        }
        if let Some(price) = new_price {
            product.price = price;
        }

        // Save the updated product back to storage
        env.storage().instance().set(&key, &product);

        // Log the update
        log!(&env, "Product with ID: {} has been updated.", product_id);
    }
}

#[contractimpl]
impl ProductContract {
    // Delete a product by its ID
    pub fn delete_product(env: Env, product_id: u64) {
        let key = Productbook::Product(product_id);

        // Check if the product exists and remove it from storage
        if env.storage().instance().has(&key) {
            env.storage().instance().remove(&key);

            // Log the deletion
            log!(&env, "Product with ID: {} has been deleted.", product_id);
        } else {
            // Log a message if the product does not exist
            log!(&env, "Product with ID: {} does not exist.", product_id);
        }
    }
}

#[contractimpl]
impl ProductContract {
    // Get all products (from ID 1 to the current product count)
    pub fn get_all_products(env: Env) -> Vec<Product> {
        // Retrieve the current product count
        let count_product: u64 = env.storage().instance().get(&COUNT_PRODUCT).unwrap_or(0);
        let mut products = Vec::new(&env);

        // Iterate over all product IDs and collect their data
        for i in 1..=count_product {
            let product = Self::get_product_by_id(env.clone(), i);
            products.push_back(product);
        }

        products
    }
}
