# No Vanity Investments Consultancy

A premium, high-performance web application for No Vanity Investments Consultancy, specializing in business registration and corporate compliance in Zimbabwe.

## Tech Stack
- **Backend**: Python Flask
- **Database**: PostgreSQL (Supabase) / SQLite (Local)
- **Frontend**: Vanilla HTML/JS, Tailwind CSS, Swiper.js, Lenis
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Python 3.11+
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/thulanesigasa/no_vanity.git
   cd no_vanity
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables (.env):
   Create a `.env` file in the root directory:
   ```env
   SECRET_KEY=your_secret_key_here
   DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
   ```

5. Run the application:
   ```bash
   python run.py
   ```

## Production Deployment (Vercel)
The project is pre-configured for Vercel deployment via `vercel.json`.

1. Connect your GitHub repository to Vercel.
2. Add your `DATABASE_URL` and `SECRET_KEY` to the Environment Variables in the Vercel dashboard.
3. Deploy.

## SEO & Accessibility
- Pre-configured `robots.txt` and `sitemap.xml`.
- Optimized metadata for Zimbabwean corporate search intent.
- Smooth scrolling and staggered animations for enhanced UX.

## License
&copy; 2026 No Vanity Investments Consultancy.
