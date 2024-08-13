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
    const recordList = document.getElementById('recordList');
    recordList.innerHTML = '';
    data.forEach((record) => {
        const card = document.createElement('div');
        card.classList.add('col-12', 'col-md-6', 'col-lg-4');
        card.innerHTML = `
            <div class="record-card">
                <h5>${record.name}</h5>
                <p><strong>Contact:</strong> ${record.contact}</p>
                <p><strong>Home:</strong> ${record.home.home_name}</p>
                <div class="actions">
                    <button class="btn btn-warning btn-sm editButton" data-id="${record.id}">Edit</button>
                    <button class="btn btn-danger btn-sm deleteButton" data-id="${record.id}">Delete</button>
                </div>
            </div>
        `;
        recordList.appendChild(card);
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
            showAlert('error', 'Error adding record. Please try again.');
            return;
        }
        showAlert('success', 'Record successfully added!');
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

async function updateRecord() {
    const id = editRecordId.value;
    const name = editNameInput.value.trim();
    const role = editRoleInput.value.trim();
    const contact = editContactInput.value.trim();
    const address = editAddressInput.value.trim();
    const homeId = editHomeSelect.value;

    if (name) {
        const { data, error } = await supabase
            .from('musalli')
            .update({ name, role, contact, address, home_id: homeId })
            .eq('id', id);
        if (error) {
            console.error('Error updating record:', error);
            showAlert('error', 'Error updating record. Please try again.');
            return;
        }
        showAlert('success', 'Record successfully updated!');
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

function showAlert(type, message) {
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');

    if (type === 'success') {
        successAlert.textContent = message;
        successAlert.classList.remove('d-none');
        errorAlert.classList.add('d-none');
    } else if (type === 'error') {
        errorAlert.textContent = message;
        errorAlert.classList.remove('d-none');
        successAlert.classList.add('d-none');
    }

    // Automatically hide the alert after 5 seconds
    setTimeout(() => {
        successAlert.classList.add('d-none');
        errorAlert.classList.add('d-none');
    }, 5000);
}


let recordIdToDelete = null;

async function showConfirmDeleteModal(id) {
    recordIdToDelete = id;
    $('#confirmDeleteModal').modal('show');
}

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    if (recordIdToDelete !== null) {
        const { data, error } = await supabase
            .from('musalli')
            .delete()
            .eq('id', recordIdToDelete);
        if (error) {
            console.error('Error deleting record:', error);
            showAlert('error', 'Error deleting record. Please try again.');
            return;
        }
        showAlert('success', 'Record successfully deleted!');
        loadRecords(); // Reload records
        $('#confirmDeleteModal').modal('hide'); // Hide the modal
        recordIdToDelete = null;
    }
});


// Event listeners

    
document.getElementById('addRecordBtn').addEventListener('click', () => {
    addRecord();
});

document.getElementById('editRecordBtn').addEventListener('click', () => {
    updateRecord();
});



document.addEventListener('DOMContentLoaded', () => {
    const recordList = document.getElementById('recordList'); // Make sure this ID matches your table body

    // Event delegation for Edit and Delete buttons
    recordList.addEventListener('click', (event) => {
        if (event.target.classList.contains('editButton')) {
            const id = event.target.getAttribute('data-id');
            editRecord(id); // Call your edit function
        } else if (event.target.classList.contains('deleteButton')) {
            const id = event.target.getAttribute('data-id');
            //deleteRecord(id); // Call your delete function
            showConfirmDeleteModal(id);
        }
    });
});


// Load homes and records on page load
loadHomes();
loadRecords();
