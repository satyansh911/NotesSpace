# NotesSpace: Collaborative AI Notes Workspace

NotesSpace is a premium, distraction-free collaborative AI notes workspace designed for thinkers and creators. It combines a minimalist "Noteshelf" aesthetic with powerful AI capabilities powered by Google Gemini.

## ✨ Features

-   **Distraction-Free Editor**: A clean, minimalist writing environment with glassmorphic UI elements and premium typography.
-   **AI Spark Panel**: Integrated AI assistant that can summarize your notes and extract actionable items in real-time.
-   **Real-time Auto-save**: Never lose a thought with debounced auto-saving to Supabase.
-   **Public Sharing**: Share your notes with a single click. Generates a unique, read-only public URL for collaborators.
-   **Insights Dashboard**: Track your productivity with an activity chart and workspace metrics.
-   **Secure Authentication**: Built-in authentication using Supabase Auth with protected routes.
-   **Bento-style UI**: A modern, responsive dashboard layout using CSS Grid and Flexbox.

## 🛠️ Tech Stack

-   **Framework**: Next.js 15+ (App Router)
-   **Styling**: Tailwind CSS 4.0
-   **Database**: Supabase (Postgres)
-   **Authentication**: Custom secure JWT session handling (JOSE)
-   **AI API**: Google Generative AI (Gemini 2.0 Flash)
-   **Icons**: Google Material Symbols
-   **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   Supabase Project
-   Google AI Studio API Key (Gemini)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd peblo-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root directory and add the following:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_gemini_api_key
    AUTH_SECRET=your_random_secret_key
    ```

4.  **Database Schema**:
    Ensure the `notes` table is created in your Supabase project with the following columns:
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `title` (text)
    - `content` (text)
    - `is_public` (boolean)
    - `share_id` (uuid, unique)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)
    - `summary` (text)
    - `action_items` (jsonb)

5.  **Run the development server**:
    ```bash
    npm run dev
    ```

6.  **Open the app**:
    Navigate to `http://localhost:3000` to start capturing your thoughts.

## 🎨 Design Inspiration

The design is inspired by the **Noteshelf** aesthetic—prioritizing calm, minimalist layouts, soft cream backgrounds, and high-quality typography (Inter & Google Fonts).

---

Built with ❤️ by the NotesSpace Team.
