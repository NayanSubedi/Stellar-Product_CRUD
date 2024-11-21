#![no_std]

use soroban_sdk::{contracttype, Env, String, log, Vec};

#[contracttype]
#[derive(Clone)]
pub struct Product {
    pub id: u64,             
    pub details: Vec<(String, String)>,       
}

use soroban_sdk::{contract, contractimpl, symbol_short, Symbol};

#[contract]
pub struct ProductContract;


#[contracttype]
pub enum Productbook {
    Product(u64),  
}


const COUNT_PRODUCT: Symbol = symbol_short!("C_PROD");

#[contractimpl]
impl ProductContract {
   
    pub fn create_product(
        env: Env,
        details: Vec<(String, String)>,
    ) -> u64 {

        let mut count_product: u64 = env.storage().instance().get(&COUNT_PRODUCT).unwrap_or(0);
        
        count_product += 1;

        let new_product = Product {
            id: count_product,
            details,
        };

        env.storage()
            .instance()
            .set(&Productbook::Product(new_product.id), &new_product);
        env.storage().instance().set(&COUNT_PRODUCT, &count_product);
        
        log!(&env, "Product Created with ID: {}", new_product.id);

        new_product.id
    }

    pub fn get_product_by_id(env: Env, product_id: u64) -> Product {
        let key = Productbook::Product(product_id);

        env.storage().instance().get(&key).unwrap_or(Product {
            id: 0,
            details: Vec::new(&env),
        })
    }

    pub fn update_product(
        env: Env,
        product_id: u64,
        new_details: Option<Vec<(String, String)>>,
    ) {
        let key = Productbook::Product(product_id);
        let mut product = Self::get_product_by_id(env.clone(), product_id);

        if let Some(new_details) = new_details {
            product.details = new_details;
        }

        env.storage().instance().set(&key, &product);

        log!(&env, "Product with ID: {} has been updated.", product_id);
    }

    pub fn delete_product(env: Env, product_id: u64) {
        let key = Productbook::Product(product_id);

        if env.storage().instance().has(&key) {
            env.storage().instance().remove(&key);

            log!(&env, "Product with ID: {} has been deleted.", product_id);
        } else {
            log!(&env, "Product with ID: {} does not exist.", product_id);
        }
    }

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
