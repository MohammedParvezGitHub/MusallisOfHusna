// Initialize Supabase client using the global Supabase object
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your Supabase URL and public API key
const supabaseUrl = 'https://oqvxnlknzysijtzhbiyh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdnhubGtuenlzaWp0emhiaXloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjY3MDMyNSwiZXhwIjoyMDM4MjQ2MzI1fQ.jIyioDs9ZgnLY4xs7rl0mFMU3Icppl5MzFf_87mzluU';
const supabase = createClient(supabaseUrl, supabaseKey);

const recordList = document.getElementById('recordList');
const nameInput = document.getElementById('nameInput');
const roleInput = document.getElementById('roleInput');
const contactInput = document.getElementById('contactInput');
const addressInput = document.getElementById('addressInput');
const homeSelect = document.getElementById('homeSelect');

// Load records from Supabase
async function loadRecords() {
    const { data, error } = await supabase
        .from('musalli')
        .select('*, home(home_name)');
    if (error) {
        console.error('Error loading records:', error);
        return;
    }
    recordList.innerHTML = '';
    data.forEach((record) => {
        const li = document.createElement('tr');
        li.innerHTML = `
            <td>${record.name}</td>
            <td>${record.contact}</td>
            <td>${record.home.home_name}</td>
        `;
        recordList.appendChild(li);
    });
}

// Load homes from Supabase
async function loadHomes() {
    const { data, error } = await supabase
        .from('home')
        .select('*');
    if (error) {
        console.error('Error loading homes:', error);
        return;
    }
    homeSelect.innerHTML = '<option value="">Select a home</option>';
    data.forEach((home) => {
        const option = document.createElement('option');
        option.value = home.id;
        option.textContent = home.home_name;
        homeSelect.appendChild(option);
    });
}

// Add new record
  async function addRecord() {
    const name = nameInput.value.trim();
    const role = roleInput.value.trim();
    const contact = contactInput.value.trim();
    const address = addressInput.value.trim();
    const homeId = homeSelect.value;

    if (name) {
        const { error } = await supabase
            .from('musalli')
            .insert([{ name, role, contact, address, home_id: homeId }]);
        if (error) {
            console.error('Error adding record:', error);
            return;
        }
        nameInput.value = '';
        roleInput.value = '';
        contactInput.value = '';
        addressInput.value = '';
        loadRecords();
    }
}

// Load homes and records on page load
loadHomes();
loadRecords();


