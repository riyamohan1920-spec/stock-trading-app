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

ER- DIAGRAM:
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

Features – SB Stocks (Stock Trading Simulator)
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



