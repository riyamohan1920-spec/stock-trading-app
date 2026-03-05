<img width="3723" height="1352" alt="mermaid-diagram (1)" src="https://github.com/user-attachments/assets/3dd2c78d-0293-44a8-a11a-e20058b18017" /># stock-trading-app
Stock Trading App – Technical Architecture
** Overview**

This project is built using the MERN Stack architecture:

Frontend – React.js

Backend – Node.js + Express.js

Database – MongoDB

Authentication – JWT

The application follows a 3-tier client-server architecture.

High-Level Architecture
User (Browser)
      ↓
React Frontend
      ↓  (REST API - Axios)
Node.js + Express Backend
      ↓
MongoDB Database
Frontend Architecture (React)

The frontend is built using React and follows a component-based architecture.

Responsibilities:

Display stock market data

Handle user authentication

Place buy/sell orders

Display portfolio and transactions

Communicate with backend APIs

⚙️ Backend Architecture (Node + Express)

The backend follows the MVC Pattern.

Structure:
/server
  /models
  /routes
  /controllers
  /middleware
Responsibilities:

User authentication & authorization

Manage deposits & withdrawals

Process stock orders

Update user portfolio

Handle admin operations

Database Architecture (MongoDB)
Collections Used:
1. Users-

name

email

password (hashed)

balance

role

2. Stocks-

stockSymbol

companyName

currentPrice

 3.Orders-

userId

stockId

quantity

orderType

price

status

4.Transactions-

userId

amount

type

date

:Authentication & Security-

Password hashing using bcrypt

JWT-based authentication

Role-based access control (Admin/User)

Protected API routes using middleware

 :Data Flow Example (Buy Stock)-

User clicks Buy button

Frontend sends POST request to /api/orders

Backend verifies JWT token

Backend checks balance

Order is stored in database

Portfolio is updated

Response sent back to frontend

 :Architectural Patterns Used-

MERN Stack Architecture

MVC Pattern

RESTful API Design

Client-Server Architectur


**ER- DIAGRAM:**
**SkillWallet – ER Diagram**
Core Concept

SkillWallet is a digital platform where users can:

Create profiles

Add and manage skills

Earn points/badges

Join groups

Exchange or endorse skills

Track transactions and activities

**Main Entities & Relationships**
1️.Users

user_id (PK)

name

email

password

role

created_at

**A user can:

Have multiple skills

Join multiple groups

Make multiple transactions

Earn multiple badges

2️.Skills

skill_id (PK)

skill_name

category

description

level

A skill:

Can belong to many users

Can be endorsed by many users

3️. UserSkills (Bridge Table)

user_skill_id (PK)

user_id (FK)

skill_id (FK)

proficiency_level

experience_years

Resolves the many-to-many relationship between Users and Skills.

4️. Groups

group_id (PK)

group_name

description

created_by (FK → Users)

A group:

Has many members

Hosts skill-sharing sessions

5️. GroupMembers

group_member_id (PK)

group_id (FK)

user_id (FK)

joined_at

Resolves many-to-many between Users and Groups.

6️. Transactions

transaction_id (PK)

sender_id (FK → Users)

receiver_id (FK → Users)

skill_id (FK)

points

transaction_date

status

Tracks skill exchanges or point transfers.

7️. Badges

badge_id (PK)

badge_name

description

criteria

8️. UserBadges

user_badge_id (PK)

user_id (FK)

badge_id (FK)

awarded_at

Resolves many-to-many between Users and Badges.
ER Diagram:
erDiagram

    USERS {
        int user_id PK
        string name
        string email
        string password
        string role
        datetime created_at
    }

    SKILLS {
        int skill_id PK
        string skill_name
        string category
        string description
        string level
    }

    USER_SKILLS {
        int user_skill_id PK
        int user_id FK
        int skill_id FK
        string proficiency_level
        int experience_years
    }

    GROUPS {
        int group_id PK
        string group_name
        string description
        int created_by FK
    }

    GROUP_MEMBERS {
        int group_member_id PK
        int group_id FK
        int user_id FK
        datetime joined_at
    }

    TRANSACTIONS {
        int transaction_id PK
        int sender_id FK
        int receiver_id FK
        int skill_id FK
        int points
        datetime transaction_date
        string status
    }

    BADGES {
        int badge_id PK
        string badge_name
        string description
        string criteria
    }

    USER_BADGES {
        int user_badge_id PK
        int user_id FK
        int badge_id FK
        datetime awarded_at
    }

    USERS ||--o{ USER_SKILLS : has
    SKILLS ||--o{ USER_SKILLS : belongs_to
    USERS ||--o{ GROUP_MEMBERS : joins
    GROUPS ||--o{ GROUP_MEMBERS : contains
    USERS ||--o{ TRANSACTIONS : sends
    USERS ||--o{ TRANSACTIONS : receives
    SKILLS ||--o{ TRANSACTIONS : involves
    USERS ||--o{ USER_BADGES : earns
    BADGES ||--o{ USER_BADGES : awarded_to

**Features – SB Stocks (Stock Trading Simulator)**
 1. User Authentication & Security

Secure user registration and login system

Encrypted password storage

Role-based access control

Personalized user dashboards

 2. Real-Time Market Data

Live US stock price updates

Real-time market trends and price fluctuations

Accurate simulation using up-to-date stock data

3. Historical Market Analysis

Access to historical stock price data

Performance charts and trend visualization

Data-driven strategy testing

 4. Virtual Portfolio Management

Create and manage multiple virtual portfolios

Add and remove stocks dynamically

Portfolio diversification tracking

Real-time portfolio valuation

Profit & loss calculation

5. Transaction Management

Simulated buy and sell operations

Complete transaction history log

User-specific trading records

Trade status tracking

6. Comprehensive Stock Listings

Browse wide range of US-listed stocks

Search and filter functionality

View detailed stock information

 7. Strategy Testing & Performance Analysis

Analyze trading performance

Compare historical investment returns

Evaluate risk and profitability

Test different trading strategies in a risk-free environment

 8. Analytics & Insights

Portfolio growth tracking

Performance graphs and visual dashboards

Investment summary reports

 9. User-Friendly Interface

Clean and intuitive UI

Responsive design (mobile & desktop)

Easy navigation for beginners and advanced traders

**Frontend Development** (EXPLAINATION)

🛠 Tech Stack:

React.js – Component-based UI development

React Router – Client-side routing

Axios – API communication

Context API – Global state management

CSS / Tailwind / Bootstrap – UI styling

Chart Library (e.g., Chart.js / Recharts) – Data visualization
 Project Structure (Frontend)
client/
 └── src/
      ├── components/
      ├── context/
      ├── pages/
      ├── services/
      └── App.js
 Components (client/src/components)
axiosInstance.js

Pre-configured Axios instance

Handles base URL and authorization headers

Centralized API configuration

Navbar.jsx

Navigation bar component

Dynamic menu based on user role (Admin/User)

Logout functionality

Login.jsx

User authentication form

Input validation

Error handling and API integration
 Register.jsx

New user registration form

Password validation

API integration for account creation
: Global State Management (client/src/context)
GeneralContext.jsx

Manages global state across the application

Stores:

Logged-in user data

Authentication token

User role

App-wide settings

Prevents prop drilling using Context API

: Pages (client/src/pages)
: Landing.jsx

Public landing page

Project overview and call-to-action

Redirect to Login/Register

: Home.jsx

Main dashboard for logged-in users

Displays:

Skill summary

Recent activity

Points overview

: Profile.jsx

User profile details

View and edit account information

Display earned badges and skill stats

: Skills.jsx (If applicable)

Add new skills

Update proficiency levels

View personal skill list

: Portfolio.jsx (Skill Wallet)

Displays user skill portfolio

Shows:

Total points earned

Skill exchanges

Performance summary

: History.jsx

Displays complete activity history

Shows:

Skill exchanges

Point transactions

Endorsements

: Admin Panel
 Admin.jsx

Admin dashboard overview

Platform statistics

User activity metrics
 Users.jsx

Manage registered users

View, update, or deactivate accounts
 AllTransactions.jsx

Monitor all skill exchanges

Track point transfers between users

Data Visualization
SkillChart.jsx

Displays graphical representation of:

Skill growth

Points earned

Activity trends

: Authentication Flow (Frontend)

User logs in → API verifies credentials

JWT token stored in localStorage

Token attached to all protected API requests

Protected routes handled using React Router

Role-based rendering for Admin/User


**Roles and Responsibilities** 
1. User (Trader)

The User is the primary participant of the SB Stocks platform who performs trading activities and manages virtual portfolios.

Responsibilities

Register and create a personal account on the platform.

Log in securely to access the trading dashboard.

Create and manage multiple virtual stock portfolios.

Buy and sell stocks using the trading simulation features.

Track transaction history and monitor stock performance.

Analyze portfolio growth using real-time and historical market data.

Practice trading strategies in a risk-free environment.

2. System (SB Stocks Platform)

The System acts as the central platform that manages all operations, processes user requests, and ensures smooth functioning of the trading simulation.

Responsibilities

Provide real-time stock prices and historical market data.

Ensure secure user registration, authentication, and session management.

Record and manage all transactions linked to users and stocks.

Update and maintain portfolio values based on stock price changes.

Maintain data consistency and accuracy across the system.

Process user requests efficiently and return appropriate responses.

3. Admin

The Admin is responsible for managing the platform, monitoring activities, and maintaining system integrity.

Responsibilities

Manage overall application performance and platform security.

Monitor user activity and transactions to ensure fairness.

Manage and update stock listings and market data sources.

Handle technical issues, bugs, and system maintenance.

Ensure accuracy of trading data and system operations.

Maintain compliance with trading simulation standards and platform policies.


**User Flow – SB Stocks Trading Application**

The user flow describes how a user interacts with the SB Stocks platform from the moment they access the application until they log out. It illustrates the sequence of actions involved in authentication, stock exploration, trading, portfolio management, and strategy analysis.

1️.Entry Point

The user visits the SB Stocks web application through a browser.

The system displays the Landing Page, which provides an overview of the platform and options to Register or Login.

2️. User Authentication
New User Registration

User selects Register.

Enters required details such as name, email, password, and contact information.

The system validates the information and creates a new account.

After successful registration, the user is redirected to the Login page.

Existing User Login

User selects Login.

Enters email and password credentials.

The system verifies the credentials and grants access to the Dashboard.

3️. Dashboard (Main Hub)

Once authenticated, the user is directed to the Dashboard, which serves as the main control panel.

Dashboard Features

View available virtual funds

Monitor portfolio value and performance

Access recent transactions and trading activity

Available Options

Browse Stocks

Create Portfolio

View Portfolio

Trade Stocks

4️. Browse & Explore Stocks

Users can explore stocks listed on the platform.

Features

Search for US-listed stocks

View real-time stock prices

Analyze historical trends and performance charts

Access company details and financial insights

5️. Paper Trading (Buy / Sell)

Users can simulate trading activities without real financial risk.

Trading Process

Select a stock from the listing

Choose an action Buy or Sell

Enter the quantity of shares

Confirm the transaction

System Response

Transaction is recorded in the database

Portfolio value updates in real time

Trade history is logged for future analysis

6️. Portfolio Management

Users manage their investment portfolios within the platform.

Portfolio Features

Create multiple virtual portfolios

Track individual stock holdings

Monitor portfolio performance and growth

Analyze profit and loss

7️. Transaction History

Users can review their trading activities.

Features

View complete buy/sell history

Access timestamps and transaction details

Track portfolio performance over time

8️. Learning & Strategy Testing

The platform allows users to improve their trading strategies.

Features

Analyze historical stock data

Compare portfolio performance

Test different investment strategies

Evaluate risk and profitability

9️. Logout

The user selects Logout from the navigation menu.

The system terminates the user session securely.

The user is redirected to the Landing Page.


**MVC Pattern for Stock Trading Application**

The Stock Trading Application is designed using the Model–View–Controller (MVC) architectural pattern. This pattern separates the application into three interconnected components: Model, View, and Controller. This separation improves maintainability, scalability, and code organization.

In the stock trading platform, the MVC architecture helps manage user requests, stock data processing, and user interface rendering efficiently.

**1. Model Layer (Data Layer):**

The Model layer handles all data-related operations in the stock trading application. It manages the structure of the database and defines how data is stored, retrieved, and updated.

The models represent key entities such as users, stocks, portfolios, and transactions. These models interact directly with the database to perform CRUD operations (Create, Read, Update, Delete).

Responsibilities of the Model Layer

Define database schemas for Users, Stocks, Transactions, and Portfolios.

Store and manage stock market data.

Record buy and sell transactions.

Maintain user portfolio details and balance.

Communicate with the database to retrieve and update data.

Example Models in Stock Trading App

User Model – Stores user information such as name, email, password, and account details.

Stock Model – Contains stock information such as stock name, symbol, and current price.

Portfolio Model – Tracks stocks owned by a user.

Transaction Model – Records buying and selling activities.

The models can be implemented using Mongoose schemas with MongoDB to manage the application's data efficiently.

**2. Controller Layer (Business Logic Layer):**

The Controller layer acts as the intermediary between the View and the Model. It processes user requests, performs application logic, and interacts with models to retrieve or update data.

When a user performs an action such as buying stocks, selling stocks, or viewing portfolio performance, the request is handled by the controller.

Responsibilities of the Controller Layer

Receive and process HTTP requests from the user.

Validate input data such as stock quantity or user credentials.

Call appropriate model functions to perform database operations.

Implement trading logic such as calculating portfolio value.

Send the processed response back to the user interface.

Example Controllers

User Controller – Handles user registration and login.

Stock Controller – Fetches real-time stock prices.

Portfolio Controller – Manages user portfolios.

Transaction Controller – Processes buy and sell operations.

Controllers ensure that the business logic of the trading system remains separate from the user interface and database logic.

**3. View Layer (Routing / Presentation Layer):**

The View layer is responsible for handling user interaction and displaying information. In a backend REST API architecture, the View is often implemented as the routing layer, which defines API endpoints.

These routes determine how the application responds to different HTTP requests such as GET, POST, PUT, and DELETE.

Responsibilities of the View Layer

Define API endpoints for user interactions.

Receive HTTP requests from the client application.

Call the appropriate controller functions.

Return responses such as stock data, portfolio details, or transaction status.

**Example Routes**

/register – User account creation

/login – User authentication

/stocks – Fetch available stocks

/buy-stock – Buy stocks

/sell-stock – Sell stocks

/portfolio – View portfolio details

The View layer ensures that the user interface communicates properly with the backend logic.

**Working Flow of MVC in the Stock Trading App**

The User sends a request from the application interface (e.g., buy a stock).

The View (Route) receives the request.

The request is forwarded to the Controller.

The Controller processes the request and interacts with the Model.

The Model communicates with the Database and returns the data.

The Controller sends the response back to the View.

The View displays the result to the User.

**Advantages of MVC in the Stock Trading App**
Separation of Concerns

Each component handles a specific responsibility, making the system easier to manage.

**Scalability:**

New features such as advanced analytics, new trading strategies, or additional stock markets can be added easily.

**Maintainability:**

Developers can modify the UI, business logic, or database layer independently.

**Reusability:**

Controllers and models can be reused across different modules of the application.

**Testing:**

Each layer can be tested independently, improving system reliability.

**Collaboration**

Multiple developers can work simultaneously on different layers without conflicts
