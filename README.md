# EcoBite

EcoBite is a responsive frontend project for reducing food waste by connecting users with discounted surplus meals from hotels. The project includes a customer-facing food discovery page, login/signup flow, cart and checkout page, and a hotel dashboard for managing food listings.

## Features

- Responsive landing page with food listings, city filters, category filters, and search
- Add-to-cart flow using `localStorage`
- Cart page with quantity controls, coupon handling, pickup details, and order confirmation
- Login and signup UI with user/hotel role selection
- Hotel dashboard with overview cards, listings table, add/edit/delete listing flow, orders, and mobile sidebar
- Separate HTML, CSS, and JavaScript files for cleaner project structure

## Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Login Page
![Login Page](screenshots/login.png)

### Hotel Dashboard
![Hotel Dashboard](screenshots/dashboard.png)

### Cart Page
![Cart Page](screenshots/cart.png)

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Browser `localStorage`
- Google Fonts

## Project Structure

```text
ECOBITE/
|-- EcoBite.html
|-- login.html
|-- dashboard.html
|-- cart.html
|-- css/
|   |-- EcoBite.css
|   |-- login.css
|   |-- dashboard.css
|   `-- cart.css
|-- js/
|   |-- EcoBite.js
|   |-- login.js
|   |-- dashboard.js
|   `-- cart.js
|-- screenshots/
|   |-- home.png
|   |-- login.png
|   |-- dashboard.png
|   `-- cart.png
`-- README.md
```

## How To Run

Open `EcoBite.html` directly in a browser, or run a local server from the project folder:

```bash
python -m http.server 8080
```

Then open:

```text
http://127.0.0.1:8080/EcoBite.html
```

## Pages

- `EcoBite.html`: Main customer page for browsing and adding food deals
- `login.html`: Login and signup page for users and hotels
- `dashboard.html`: Hotel partner dashboard
- `cart.html`: Cart and checkout page

