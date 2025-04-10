import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kmxiusymndqeicmefdcm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtteGl1c3ltbmRxZWljbWVmZGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODM4NDMsImV4cCI6MjA1OTY1OTg0M30.e1RGA7OLuS-3MS0un32z2ViAUC94Xmgx3J1y-ycKmY8';

export const supabase = createClient(supabaseUrl, supabaseKey);