# Tech Pharos Competition Registration Portal 🚀

[![IEEE](https://img.shields.io/badge/IEEE-Student_Branch-00629B?style=for-the-badge&logo=ieee&logoColor=white)](https://www.ieee.org/)
[![Pharos University](https://img.shields.io/badge/Pharos_University-PUA-FFD700?style=for-the-badge)](https://www.pua.edu.eg/)

A premium, high-performance competition registration portal built for the **IEEE Student Branch** at **Pharos University in Alexandria (PUA)**.

## ✨ Features

- **🎨 Premium Aesthetic**: A light, airy design featuring serif typography, watercolor-like diffused glows, and smooth micro-animations.
- **🗳️ Dynamic Registration**: 
  - Dynamic team size validation based on tracks (Web, AI, Robotics).
  - Real-time fee calculation based on membership category (IEEE, Internal, External).
  - Strong server-side validation to prevent duplicate team names, emails, and IEEE IDs.
- **📊 Real-time Admin Dashboard**: 
  - Live data synchronization with **Firebase Realtime Database**.
  - Secure organizer login and registration management.
  - One-click **Export to Excel** with detailed member breakdowns.
  - Payment status toggling with instant updates.
- **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database/Backend**: Firebase Realtime Database
- **Typography**: Instrument Serif (Headings) & Inter (UI/Body)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/tech-pharos-portal.git
   cd tech-pharos-portal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Firebase credentials (refer to `.env.example`):
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_DATABASE_URL=your_rtdb_url
   ...
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🔐 Admin Access

Organizers can access the administration panel by navigating to `/admin`.
- **Default Password**: `admin123` (Configurable in `AdminLogin.tsx`).

## 🤝 Partnership

This project is a collaboration between the **IEEE Student Branch** and **Pharos University (PUA)** to empower the next generation of engineers and tech innovators.

---

Built with ❤️ by the IEEE PUA Team.
