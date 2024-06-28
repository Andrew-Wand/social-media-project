import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  "https://nyghrdxtnpowbwajnqmu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Z2hyZHh0bnBvd2J3YWpucW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk0Mjg3MDQsImV4cCI6MjAzNTAwNDcwNH0.6h6wCEgvile6QBimGPBqemYkwqDdQNtSfkG8GoOOK-4"
);
