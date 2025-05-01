# Canteen Byte Boost

A modern canteen management system that connects students with campus food services. This application allows students to browse canteen menus, place orders, and track their nutrition, while enabling canteen managers to manage menus and fulfill orders.

## Backend Implementation

The application uses Supabase as its backend service, providing authentication, database, and storage capabilities.

### Database Schema

The database consists of the following tables:

- **profiles**: User profiles with roles (student, canteen_manager, admin)
- **canteens**: Information about campus canteens including location, hours, and cuisine types
- **menu_items**: Food items available at each canteen with nutritional information
- **orders**: Customer orders with status tracking
- **order_items**: Individual items within each order
- **nutrition_logs**: Daily nutrition tracking for users
- **nutrition_recommendations**: Personalized nutrition recommendations

### Data Services

The application uses a data service layer to interact with Supabase:

- `supabaseData.ts`: Contains all the functions to interact with the Supabase database
- Type mapping functions convert between Supabase database types and application types

## Project info

**URL**: https://lovable.dev/projects/c713f7a0-ac2c-484a-a0a1-093723dee8ec

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c713f7a0-ac2c-484a-a0a1-093723dee8ec) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.

## Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Navigate to the SQL Editor in your Supabase dashboard
3. Run the SQL script in `supabase/init.sql` to create the database schema and sample data

### Environment Configuration

1. Create a `.env` file in the project root with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Features

**For Students**
- Browse canteens and menus
- Place and track orders
- Monitor nutrition intake
- Receive personalized nutrition recommendations

**For Canteen Managers**
- Manage menu items
- Process and update order status
- View analytics and reports
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c713f7a0-ac2c-484a-a0a1-093723dee8ec) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
