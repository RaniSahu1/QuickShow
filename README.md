# 🎬 QuickShow – Movie Ticket Booking Platform (MERN Stack)

A full-stack **movie ticket booking web application** built using the **MERN stack**, featuring real-time seat booking, secure payments, background jobs, and admin management.

🔗 **Live Demo (Frontend):** https://quickshow-five-phi.vercel.app  
🔗 **Backend API:** Deployed on Vercel  
🔗 **Background Jobs:** Powered by Inngest

## 📌 Features 

### 👤 User Features
- 🔐 Authentication using **Clerk**
  - Email, Google, and Phone login
  - Multi-session login support
- 🎥 Browse movies with details (cast, runtime, genre, rating)
- ❤️ Add / remove movies from favorites
- 📅 Select show date & time
- 💺 Interactive seat selection
- 💳 Secure payment using **Stripe**
- 📧 Automatic emails:
  - Booking confirmation
  - Show reminders (8 hours before)
- ⏳ Seats auto-released after **10 minutes** if payment is not completed

---

### 🛠️ Admin Features
- 📊 Admin dashboard
  - Total bookings
  - Total revenue
  - Active shows
  - Total users
- ➕ Add new movies & shows
- 📋 View all bookings
- 📢 Auto email notifications to users when a new show is added

---

## 🧠 Background Jobs (Inngest)
- ⏰ Auto seat release after 10 minutes (payment timeout)
- 📬 Booking confirmation emails
- 🔔 Show reminder emails (cron-based)
- 📢 New show notification emails

---


## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Shadcn UI
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Stripe
- Nodemailer

### Authentication
- Clerk

### Background Jobs
- Inngest

### Deployment
- Frontend: Vercel  
- Backend: Vercel  
- Database: MongoDB Atlas

## 🧪 Key Highlights

Seat locking to prevent double booking

Auto seat release using background jobs

Timezone-safe date handling

Stripe payment integration

Fully deployed production app


## 📸 Screenshots

![Home ](home.png)
![Movie ](movies.png)
![Seat selection](
## 🏗️ Status
✅ **Project completed**  
Future improvements may include UI enhancements, QR-based tickets, and advanced analytics.

---
