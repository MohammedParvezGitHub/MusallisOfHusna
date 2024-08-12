import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://oqvxnlknzysijtzhbiyh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdnhubGtuenlzaWp0emhiaXloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjY3MDMyNSwiZXhwIjoyMDM4MjQ2MzI1fQ.jIyioDs9ZgnLY4xs7rl0mFMU3Icppl5MzFf_87mzluU';
const supabase = createClient(supabaseUrl, supabaseKey);

const recordList = document.getElementById('recordList');
const nameInput = document.getElementById('nameInput');
const roleInput = document.getElementById('roleInput');
const contactInput = document.getElementById('contactInput');
const addressInput = document.getElementById('addressInput');
const homeSelect = document.getElementById('homeSelect');

const editRecordId = document.getElementById('editRecordId');
const editNameInput = document.getElementById('editNameInput');
const editRoleInput = document.getElementById('editRoleInput');
const editContactInput = document.getElementById('editContactInput');
const editAddressInput = document.getElementById('editAddressInput');
const editHomeSelect = document.getElementById('editHomeSelect');

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
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.contact}</td>
            <td>${record.home.home_name}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="onclickEdit(this.getAttribute('data-id'))" data-id="${record.id}" >Edit</button>
                <button class="btn btn-danger btn-sm" id="Delete(${record.id})">Delete</button>
            </td>
        `;
        recordList.appendChild(row);
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
    editHomeSelect.innerHTML = '<option value="">Select a home</option>';
    data.forEach((home) => {
        const option = document.createElement('option');
        option.value = home.id;
        option.textContent = home.home_name;
        homeSelect.appendChild(option);
        editHomeSelect.appendChild(option.cloneNode(true));
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
        const { data, error } = await supabase
            .from('musalli')
            .insert([{ name, role, contact, address, home_id: homeId }]);
        if (error) {
            console.error('Error adding record:', error);
            return;
        }
        // Reset form fields and close the modal
        nameInput.value = '';
        roleInput.value = '';
        contactInput.value = '';
        addressInput.value = '';
        homeSelect.value = '';
        $('#addRecordModal').modal('hide'); // Hide the modal
        loadRecords(); // Reload records
    } else {
        alert('Name field is required.');
    }
}

// Edit a record
async function editRecord(id) {
    const {data, error } = await supabase
        .from('musalli')
        .select('*, home(home_name)')
        .eq('id', id)
        .single();
    if (error) {
        console.error('Error loading record for edit:', error);
        return;
 }
    editRecordId.value = data.id;
    editNameInput.value = data.name;
    editRoleInput.value = data.role;
    editContactInput.value = data.contact;
    editAddressInput.value = data.address;
    editHomeSelect.value = data.home_id;
    $('#editRecordModal').modal('show'); // Show the edit modal
}

// Update a record
async function updateRecord() {
    const id = editRecordId.value;
    const name = editNameInput.value.trim();
    const role = editRoleInput.value.trim();
    const contact = editContactInput.value.trim();
    const address = editAddressInput.value.trim();
    const homeId = editHomeSelect.value;

    if (name) {
        const {data, error } = await supabase
            .from('musalli')
            .update({ name, role, contact, address, home_id: homeId })
            .eq('id', id);
        if (error) {
            console.error('Error updating record:', error);
            return;
        }
        // Reset form fields and close the modal
        editNameInput.value = '';
        editRoleInput.value = '';
        editContactInput.value = '';
        editAddressInput.value = '';
        editHomeSelect.value = '';
        $('#editRecordModal').modal('hide'); // Hide the modal
        loadRecords(); // Reload records
    } else {
        alert('Name field is required.');
    }
}

// Delete a record
async function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        const {data, error } = await supabase
            .from('musalli')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting record:', error);
            return;
        }
        loadRecords(); // Reload records
    }
}


// Event listeners

    
document.getElementById('addRecordBtn').addEventListener('click', () => {
    addRecord();
});

document.getElementById('editRecordBtn').addEventListener('click', () => {
    updateRecord();
});

export function onclickEdit(id) {
    alert('Edit record with ID:', id);
    // Add your logic to handle the record edit
}

// Load homes and records on page load
loadHomes();
loadRecords();



