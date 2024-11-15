#![no_std] // We don't use the Rust standard library in smart contracts
use soroban_sdk::{contracttype, Env, String, log, Vec};

// Struct to represent a product in our dApp
#[contracttype]
#[derive(Clone)]
pub struct Product {
    pub id: u64,              // Unique ID for the product
    pub name: String,         // Name of the product
    pub description: String,  // Description of the product
    pub price: u64,           // Price of the product
}

use soroban_sdk::{contract, contractimpl, symbol_short, Symbol};

// Define a contract type called ProductContract
#[contract]
pub struct ProductContract;

// Enum for referencing product storage
#[contracttype]
pub enum Productbook {
    Product(u64),
}

// Symbol to track the total count of products
const COUNT_PRODUCT: Symbol = symbol_short!("C_PROD");

#[contractimpl]
impl ProductContract {
    pub fn create_product(
        env: Env,
        name: String,
        description: String,
        price: u64,
    ) -> u64 {
        let mut count_product: u64 = env.storage().instance().get(&COUNT_PRODUCT).unwrap_or(0);
        count_product += 1;

        let new_product = Product {
            id: count_product,
            name,
            description,
            price,
        };

        env.storage()
            .instance()
            .set(&Productbook::Product(new_product.id.clone()), &new_product);
        env.storage().instance().set(&COUNT_PRODUCT, &count_product);

        log!(&env, "Product Created with ID: {}", new_product.id);

        new_product.id
    }
}

#[contractimpl]
impl ProductContract {
    pub fn get_product_by_id(env: Env, product_id: u64) -> Product {
        let key = Productbook::Product(product_id);

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
    pub fn update_product(
        env: Env,
        product_id: u64,
        new_name: Option<String>,
        new_description: Option<String>,
        new_price: Option<u64>,
    ) {
        let key = Productbook::Product(product_id);
        let mut product = Self::get_product_by_id(env.clone(), product_id);

        if let Some(name) = new_name {
            product.name = name;
        }
        if let Some(description) = new_description {
            product.description = description;
        }
        if let Some(price) = new_price {
            product.price = price;
        }

        env.storage().instance().set(&key, &product);

        log!(&env, "Product with ID: {} has been updated.", product_id);
    }
}

#[contractimpl]
impl ProductContract {
    pub fn delete_product(env: Env, product_id: u64) {
        let key = Productbook::Product(product_id);

        if env.storage().instance().has(&key) {
            env.storage().instance().remove(&key);

            log!(&env, "Product with ID: {} has been deleted.", product_id);
        } else {
            log!(&env, "Product with ID: {} does not exist.", product_id);
        }
    }
}

#[contractimpl]
impl ProductContract {
    pub fn get_all_products(env: Env) -> Vec<Product> {
        let count_product: u64 = env.storage().instance().get(&COUNT_PRODUCT).unwrap_or(0);
        let mut products = Vec::new(&env);

        for i in 1..=count_product {
            let product = Self::get_product_by_id(env.clone(), i);
            products.push_back(product);
        }

        products
    }
}
