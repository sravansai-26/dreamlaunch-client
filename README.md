# ✨ DreamLaunch Frontend Application (dreamlaunch-client)

This repository contains the **React/Vite** front-end application, which provides the user interface for creators and the **exclusive viewing portal** for the special person (the core launch trigger of DreamLaunch).

## 🛠️ Tech Stack
* **Framework:** React 18, TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Navigation:** React Router

---

## 🚦 Getting Started & Running the Client

This section outlines all necessary steps to install, configure, and launch the application.

### Installation
1.  **Clone the repository** (if setting up fresh):
    ```bash
    git clone <client-repository-url>
    cd dreamlaunch-client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration & Launch
1.  **Set up API Connection:** Create a **`.env`** file in the root of this client directory (alongside `package.json`) and set the backend URL:

    ```env
    # VITE_ prefix is required for Vite to expose environment variables
    VITE_API_URL=http://localhost:5000
    ```
    *(Note: The **DreamLaunch Backend API** must be running on port 5000.)*

2.  **Start the Client:** The application will run on port 5173 (default).
    ```bash
    # Start the development server
    npm run dev
    ```

---

## 🧭 Application Routes

These are the key public and authenticated routes used by the creator and the special person.

| Route | Purpose | User |
| :--- | :--- | :--- |
| `/` | Home/Landing Page | All Users |
| `/dashboard` | Creator's main content management area. | Authenticated Creator |
| `/create` | Page for uploading media and setting up launch details. | Authenticated Creator |
| `/view/:id` | **Special Person's Exclusive Viewing Portal** (The Launch Trigger). | Special Person (Authenticated or Token-verified) |