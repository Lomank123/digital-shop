# Digital Shop

**Digital Shop** is an internet shop with plenty of features. You can buy any kinds of products from different categories which sellers offer, and also manage your account and orders list.


### Here should be some badges...


## Requirements (Prerequisites)

- Python v3.9 [Install](https://www.python.org/downloads/release/python-390/)
- Docker [Install](https://www.docker.com/products/docker-desktop)
- Node.js + npm [Install](https://nodejs.org/en/download/)


## Installation

- Clone repository:
```
git clone https://github.com/Lomank123/digital-shop.git
```

- Go to `/frontend/react` folder and install `webpack` and `webpack-cli`:
```
npm i webpack webpack-cli --save-dev
```

- Go to project root folder, create `.env` file and copy the contents of `.env.sample` to it. Replace some variables if needed.

- Run the containers:
```
docker-compose build
```
For the first time it may take 5-10 minutes to build everything (depends on your internet connection and PC hardware)

### Possible issues

- If celery worker container fails to start check `wait-for-it.sh` bash script's line break type. It should be `LF`, not `CRLF`.


## Features

- Main
    - Fully REST API project (using DRF)
    - Separated backend and frontend

- Products and Categories
    - In home page all available (and some unavailable) products can be viewed
    - Filter products by categories, date, price and availability
    - Search product by its title or description

- JWT Authentication
    - Refresh and access tokens
    - Email verification on sign up
    - Forgot password implementation

- Cart system
    - 2 types of carts: user and non-user
    - Non-user cart has its expiration date and after it a new will be given (the old one gets deleted)
    - Anonymous user (not logged in) will get non-user cart
    - After logging in non-user cart will be attached to logged in user
    - If logged in user already has cart then both carts will be displayed
        - And content from non-user cart can easily be transferred to user one
    - Each cart can be filled with products
        - You can also change quantity or remove product from cart
    - After purchasing a new order will be saved and then can be checked in "My orders" page (if it is a signed in user). Also cart becomes **archived** and user will be given a new one.

- User management
    - Profile page (you can visit other profile pages as well)
    - Change personal info (including email)
    - My orders page (manage your orders)

- Seller management (same as user management but with few extra options)
    - Manage your products (Add, edit, delete, set to inactive)
    - Additional filters (e.g.: "Your products" filter)


## Usage

- To run project:
```
docker-compose --profile init up
```
This will run services with `"init"` profile defined in `docker-compose.yml`.


- To run linters:
```
docker-compose up lint
```

### Fixtures
- To fill the database:
```
docker-compose up filldb
```
Describe fixtures here.


## Tests

- To run tests:
```
docker-compose up test
```
Describe tests here. What they are testing and why.


## Deploy

Describe deployment here.


## Tech stack

- Backend:
    - 1
    - 2
- Frontend:
    - 1
    - 2
- Other:
    - 1
    - 2


## Author

Info about author.


## Credits

What helped you most or what inspired you to make this project.


## License

Info about License.
