# Portfolio Website

A modern, responsive portfolio website built with Next.js and Tailwind CSS, featuring a stylish design with a custom color theme of #c23f1b (red-orange) and black.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI**: Clean and stylish interface with smooth animations
- **Project Showcase**: Display your completed projects with filtering and search
- **Tech Stack Display**: Highlight your technical skills and expertise
- **Contact Form**: Interactive contact page with form validation
- **Admin Dashboard**: Add and manage projects through a user-friendly interface
- **Dark Theme**: Custom color scheme with primary color #c23f1b and black accents

## Pages

- **Home**: Hero section, tech stack, and featured projects
- **About**: Personal information, skills, and professional timeline
- **Projects**: Complete project gallery with filtering and search
- **Contact**: Contact form and social media links
- **Dashboard**: Admin interface for managing projects

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Storage**: Local Storage (for demo purposes)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port shown in terminal)

## Project Structure

```
src/
├── app/
│   ├── about/          # About page
│   ├── contact/        # Contact page
│   ├── dashboard/      # Admin dashboard
│   ├── projects/       # Projects gallery
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
└── components/
    └── Navbar.tsx      # Navigation component
```

## Customization

### Colors
The color theme can be customized in `tailwind.config.ts`:
- Primary: #c23f1b (red-orange)
- Secondary: #000000 (black)
- Accent: #ff6b47 (lighter red-orange)

### Content
- Update personal information in the About page
- Modify contact details in the Contact page
- Add your own projects through the Dashboard

## Features in Detail

### Project Management
- Add new projects with title, description, technologies, and links
- Edit existing projects
- Delete projects
- Categorize projects (Web Development, Mobile, AI/ML, etc.)
- Search and filter functionality

### Responsive Design
- Mobile-first approach
- Smooth animations and transitions
- Optimized for all screen sizes
- Touch-friendly interface

### Performance
- Next.js App Router for optimal performance
- Lazy loading and code splitting
- Optimized images and assets
- Fast page transitions

## Deployment

This project can be deployed on various platforms:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **GitHub Pages**
- **AWS Amplify**

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using Next.js and Tailwind CSS