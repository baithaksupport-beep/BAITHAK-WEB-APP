# Baithak

## Ek aisi Baithak bhi zaroori hai mittar

Baithak is a hyper-local, exclusive knowledge-sharing and community platform designed specifically for college campuses. It acts as a central repository for student wisdom, course resources, exam patterns, and campus life hacks. By organizing conversations into dedicated subject channels and verification-locked portals, Baithak ensures that valuable academic knowledge is preserved across semesters instead of getting lost in transient messaging threads.

---

## Core Problems Solved

1. **Transient Communication Channels**: Important announcements, lecture notes, and PDFs shared on apps like WhatsApp get buried under routine chat spam. Baithak provides structured, searchable channels for academic memory.
2. **Lack of Local Context**: General AI tools do not know specific professors' grading tendencies, lab assignment criteria, or exam patterns. Baithak connects students with peers and seniors who have direct experience.
3. **Unrecognized Contributions**: Helping juniors on direct messages often goes unnoticed. Baithak introduces a reputation-based system (Honour Points) to reward students who actively answer academic queries.
4. **Peer Discovery Barriers**: Finding the right senior who has navigated a specific backlog, cleared a niche internship, or joined a selective campus club is often a matter of luck. Baithak makes students' expertise discoverable.

---

## Key Product Features

- **Document-Based Verification**: Secure, automated student registration utilizing Gemini AI image analysis. The platform scans college ID cards or registration receipts to verify the student's name, registration number, academic department, and institution.
- **Tailored Profile Identity**: Customized user registration including unique system handles (@usernames), display names, and profile avatars (supporting preset gradient styles or custom photo uploads).
- **Conditional Regional Scaling**: 
  - Fully verified students of the launch campus (Veer Surendra Sai University of Technology - VSSUT) receive immediate dashboard access.
  - Students from other institutions are guided to a regional feedback form to request local scaling, while maintaining partial access to general branch-level discussions.
- **Dynamic User Interface**: Built with rich dark-mode aesthetics, custom layouts, and interactive scroll-linked timeline animations (using GSAP) that visualize the product's workflow.

---

## Technical Architecture

The frontend is constructed using a modern single-page application (SPA) architecture:

- **Core Library**: React (v19)
- **Build System**: Vite (v8)
- **Styling**: Tailwind CSS (v4) with high-fidelity custom glassmorphic components
- **Animations**: GSAP (GreenSock Animation Platform v3) for smooth, scroll-triggered visual pathways
- **Icons**: Lucide React

---

## Setup and Installation

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (Node Package Manager)

### Local Development
1. Clone the repository and navigate to the project root directory.
2. Install the package dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. To enable real-time Gemini AI card scanning, create a `.env` file in the root directory and add your API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no API key is provided, the application will fallback to a simulated scanning demonstration.*
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

### Production Build
To build the application for deployment:
1. Compile the production bundle:
   ```bash
   npm run build
   ```
2. The optimized static files will be generated in the `dist/` directory.
