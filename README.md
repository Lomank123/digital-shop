# Digital Shop

**Digital Shop** is an internet shop with plenty of features. You can buy any kinds of products from different categories which sellers offer, and also manage your account and orders list.


[![CI](https://github.com/Lomank123/digital-shop/actions/workflows/ci.yml/badge.svg)](https://github.com/Lomank123/digital-shop/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Lomank123/digital-shop/branch/main/graph/badge.svg?token=WU2JVQUOBV)](https://codecov.io/gh/Lomank123/digital-shop)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

- [Digital Shop](#digital-shop)
  - [Requirements (Prerequisites)](#requirements-prerequisites)
  - [Installation](#installation)
    - [Possible issues](#possible-issues)
  - [Screenshots](#screenshots)
  - [Features](#features)
  - [Usage](#usage)
    - [Run project](#run-project)
    - [Linters](#linters)
    - [Fixtures](#fixtures)
  - [Tests](#tests)
    - [Tests description](#tests-description)
  - [Tech stack](#tech-stack)
  - [Author](#author)

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
npm i webpack webpack-cli
```

- Run npm dev or prod version to create bundle file:
```
npm run dev
```
Or:
```
npm run prod
```

- Go to project root folder, create `.env` file and copy the contents of `.env.sample` to it. Replace some variables if needed.

- Run the containers:
```
docker-compose build
```
For the first time it may take 5-20 minutes to build everything (depends on your internet connection and PC hardware)

### Possible issues

- If celery worker container fails to start check `wait-for-it.sh` bash script's line break type. It should be `LF`, not `CRLF`.


## Screenshots

- Home page:

![Home page screenshot](presentation/screenshots/home.jpg)

- Carts:

![Carts page screenshot](presentation/screenshots/carts.jpg)

- Product details:

![Product details screenshot](presentation/screenshots/product-info.jpg)

- Profile:

![Profile screenshot](presentation/screenshots/profile.jpg)



## Features

- Main
    - Fully REST API project (using DRF)
    - Separated backend and frontend
    - Configured GitHub Actions
    - Codecov coverage support
    - Localization (EN and RU)

- Products and Categories
    - In home page all available (and some unavailable) products can be viewed
    - Filter products by categories, date, price and availability
    - Search product by its title or description

- JWT Authentication
    - Access and refresh tokens
    - Email verification on sign up (optional)
    - Forgot password implementation (using email)

- Cart system
    - 2 types of carts: user and non-user
    - Non-user cart has its expiration date and after it a new will be given (the old one gets deleted)
    - Anonymous user (not logged in) will get a non-user cart
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
    - Additional filters (e.g.: "Only your products" filter)


## Usage

### Run project
- To run project:
```
docker-compose up
```

### Linters
- To run linters:
```
docker-compose up lint
```

### Fixtures
- To fill the database:
```
docker-compose up filldb
```

There are 2 main fixture files:
- prod.json
- dev.json

If you want to test it with different users here are the credentials (applies to both dev and prod fixtures):

- Superuser:
    - email: `admin@gmail.com`
    - password: `12345`
- User 1 (**Seller**, can create products):
    - email: `test1@gmail.com`
    - password: `123123123Aa`
- User 2 (regular user):
    - email: `test2@gmail.com`
    - password: `123123123Qq`

Production fixtures (`prod.json`) shows how the shop may look like filled with regular products. They include users, superuser, products, categories, carts and cart items.

Development fixtures (`dev.json`) are mainly for testing. For example, how the UI will behave with different amount of symbols (min or max).


## Tests

- To run tests:
```
docker-compose up test
```

### Tests description
These tests cover:
- API (integration tests)
    - ViewSet permissions and queryset
    - Endpoints whose logic hasn't been tested by services tests
- Services
    - All custom business logic
- Pagination
    - Custom data pagination
- Managers
    - Custom user creation
- Permissions
    - Custom permissions
- Celery tasks


## Tech stack

- **Backend**:
    - Django
    - Django Rest Framework
    - dj-rest-auth
    - Nginx
    - Celery
    - Redis
    - Gunicorn
    - PostgreSQL
    - Coverage
- **Frontend**:
    - ReactJS
    - Babel
    - Webpack
    - Redux
    - Axios
    - i18next
- **Other**:
    - GitHub
    - GitHub Actions
    - Docker
    - Docker-compose
    - Codecov


## Author

See my GitHub profile for further information: [profile link](https://github.com/Lomank123)