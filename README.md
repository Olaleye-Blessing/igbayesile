# Igbayesile

A hotel reservation platform that simplifies booking for guests, managers, and staff. Users can search and reserve rooms, leave reviews, and complete secure payments. Managers can assign dedicated staff to manage their hotels, improving communication and efficiency. Staff can manage multiple hotels through a user-friendly interface. Managers and staff have access to detailed analytics dashboards (on a subdomain) to track hotels and rooms performance.

![Igbayesile](https://raw.githubusercontent.com/Olaleye-Blessing/olaleye/refs/heads/master/public/static/projects/igbayesile.webp)

## Table Of Content
- [Igbayesile](#igbayesile)
  - [Table Of Content](#table-of-content)
  - [Why I Built This Project](#why-i-built-this-project)
  - [How To Navigate This Project](#how-to-navigate-this-project)
  - [Technologies Used](#technologies-used)
    - [Backend](#backend)
    - [Frontend (Website and Dashboard)](#frontend-website-and-dashboard)
  - [Getting Started](#getting-started)


## Why I Built This Project

I built this project to learn about backend development. I deeply explored backend development after spending some years and having professional experience in front-end development. I learned Node.js and Express.js using Jonas Schmedtmann's course. I then followed the backend roadmap on [roadmap.sh](https://roadmap.sh/backend). I made sure I learned more than 65% of all important concepts.

## How To Navigate This Project

The project is divided into two main parts:

- The `backend folder` contains the server-side code and API implementation. It follows the M[V]C architecture.
- The `client folder` is a Turborepo project containing:
  - `apps/website`: The main Igbayesile website
  - `apps/dashboard`: The analytics dashboard (subdomain)
  - `packages/ui`: Shared UI components, interfaces, utilities, and libraries used across the frontend apps

## Technologies Used

### Backend

- `Express.js`: Used to handle the server
- `Cloudinary`: Used to manage images
- `JsonWebToken`: Used to manage authentication tokens
- `MongoDb`: Used for database management
- `Redis`: Used to cache common search items and blacklisting of deleted tokens
- `Resend`: Used to send emails
- `Docker`: Used for containerization

### Frontend (Website and Dashboard)

- `Turborepo`: Used for managing the monorepo structure
- `Next.js`: Used as the React framework
- `TailwindCSS`: Used to style both websites
- `ShadCn`: UI component library
- `React Hook Form`: Used for form management
- `React Query`: Used for data fetching and caching
- `Zustand`: Used for state management

## Getting Started

1. Fork the project.

2. Clone the project by running

   ```bash
   git clone https://github.com/<your-github-username>/igbayesile.git
   ```

3. Go into the project directory

   ```bash
   cd igbayesile
   ```

4. Go into the backend folder, create an `.env` file and update the following keys:

   ```.env
   PORT=4000
   MONGO_DB_URL=mongodb://user:admin@mongodb/igbayesile?retryWrites=true&writeConcern=majority&authSource=admin
   
   REDIS_URL=redis://redisdb:6379

   JWT_LOGIN_SECRET=
   JWT_LOGGED_IN_EXPIRES=4m
   JWT_REFRESH_LOGIN_SECRET=
   JWT_REFRESH_LOGIN_EXPIRES=1d
   JWT_LOGGEDIN_DEVICE_SECRET=
   JWT_DEVICE_SECRET=

   NODE_ENV=

   FRONTEND_URL=http://localhost:3000

   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=

   PAYSTACK_PUBLIC_KEY=
   PAYSTACK_SECRET_KEY=

   RESEND_KEY=

   GEOAPIFY_KEY=
   ```

5. Start your docker
6. Run the following commands to install dependencies and start the server:

   ```bash
   cd backend
   make dev-install # install dependencies
   make igbayesile-dev-log # start the sever and log docker
   ```

7. Open another terminal and go into the `client` folder.
8. Navigate to the `dashboard` folder, create an `.env` file and add these keys:

   ```.env
   BACKEND_URL=http://localhost:4000
   NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL
   ```

9. Navigate to the `website` folder, create an `.env` file and add these keys:

   ```.env
   BACKEND_URL=http://localhost:4000
   NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL

   NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3001

   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
   NEXT_PUBLIC_GEOAPIFY_KEY=
   ```

10. Run the command below to install dependencies and start both websites:

    ```bash
    pnpm i
    pnpm dev
    ```

You should be able to access the main website on [http://localhost:3000](http://localhost:3000) and the dashboard on [http://localhost:3000](http://localhost:3000).
