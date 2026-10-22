# Supabase setup

1. In Supabase, open **Project settings → API** and copy the Project URL and the publishable/anon key.
2. Put them in the project-root `.env` file:

   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
   ```

3. Restart `npm run dev` after changing `.env`. Vite only exposes variables at startup.
4. The dashboard tests connectivity by loading the configured tables. A missing value produces an explicit configuration message; database failures are shown in the UI and do not fall back to mock records.
5. If a request returns `new row violates row-level security policy`, inspect **Authentication → Policies** for the affected table. Add policies for the intended authenticated role rather than disabling RLS or using a service-role key in the browser.

Connected frontend tables: departments, patients, doctors, appointments, rooms, admissions, prescriptions, prescription_items, medicines, bills, and payments. Settings remains UI-only because no settings table is present.

This frontend does not add authentication. Before exposing patient data, configure Supabase Auth and policies that restrict reads and writes to the intended authenticated users.
