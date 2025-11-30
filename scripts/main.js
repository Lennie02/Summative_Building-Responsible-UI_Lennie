// main.js - main application entry point

import { state } from './state.js';
import { validateTask, validateImportedData } from './validators.js';
import { compileRegex, filterTasksByRegex, sortTasks } from './search.js';
import { 
    switchSection, 
    renderTasks, 
    updateDashboard, 
    showStatus, 
    clearForm,
    showValidationErrors,
    hideDeleteDialog
} from './ui.js';
import { clearAllData } from './storage.js';


// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showStatus('form-status', 'An unexpected error occurred. Please try again.', 'error');
});

// Initialize app
function init() {
    setupNavigation();
    setupTaskForm();
    setupSearch();
    setupSort();
    setupSettings();
    setupDataManagement();
    setupDeleteDialog();
    setupKeyboardShortcuts();
    
    // Initial render
    updateView();
    updateDashboard();
}

// Setup navigation
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
        
            const href = link.getAttribute('href');
            if (href === 'tests.html' || !link.dataset.section) {
                return; 
            }
            
            e.preventDefault();
            const section = link.dataset.section;
            if (section) {
                switchSection(section);
            }
        });
    });
}

// Setup task form
function setupTaskForm() {
    const form = document.getElementById('task-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit();
    });
    
    document.getElementById('cancel-edit').addEventListener('click', () => {
        clearForm();
        showStatus('form-status', 'Edit cancelled', 'success');
    });
}

function handleFormSubmit() {
    const taskData = {
        title: document.getElementById('task-title').value,
        dueDate: document.getElementById('task-due-date').value,
        duration: document.getElementById('task-duration').value,
        tag: document.getElementById('task-tag').value
    };
    
    // Validate
    const validation = validateTask(taskData);
    if (!validation.valid) {
        showValidationErrors(validation.errors);
        showStatus('form-status', 'Please fix the errors above', 'error');
        return;
    }
    
    // Save task
    const taskId = document.getElementById('task-id').value;
    if (taskId) {
        // Update existing task
        state.updateTask(taskId, taskData);
        showStatus('form-status', 'Task updated successfully!', 'success');
    } else {
        // Add new task
        state.addTask(taskData);
        showStatus('form-status', 'Task added successfully!', 'success');
    }
    
    clearForm();
    updateView();
    updateDashboard();
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const caseSensitive = document.getElementById('case-sensitive-checkbox');
    
    searchInput.addEventListener('input', handleSearch);
    caseSensitive.addEventListener('change', handleSearch);
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const caseSensitive = document.getElementById('case-sensitive-checkbox');
    const statusDiv = document.getElementById('search-status');
    
    const pattern = searchInput.value.trim();
    
    if (!pattern) {
        state.searchRegex = null;
        statusDiv.textContent = '';
        statusDiv.style.background = '';
        statusDiv.style.color = '';
        statusDiv.style.padding = '';
        updateView();
        return;
    }
    
    const regex = compileRegex(pattern, caseSensitive.checked);
    
    if (!regex) {
        statusDiv.textContent = 'Invalid regex pattern';
        statusDiv.style.background = '#f8d7da';
        statusDiv.style.color = '#721c24';
        statusDiv.style.padding = '10px';
        statusDiv.style.borderRadius = '4px';
        return;
    }
    
    state.searchRegex = regex;
    const allTasks = state.getAllTasks();
    const filteredTasks = filterTasksByRegex(allTasks, regex);
    
    statusDiv.textContent = `Found ${filteredTasks.length} matching task(s)`;
    statusDiv.style.background = '#d4edda';
    statusDiv.style.color = '#155724';
    statusDiv.style.padding = '10px';
    statusDiv.style.borderRadius = '4px';
    
    updateView();
}

// Setup sorting
function setupSort() {
    const sortSelect = document.getElementById('sort-by');
    const sortOrderBtn = document.getElementById('sort-order');
    
    sortSelect.addEventListener('change', () => {
        state.sortBy = sortSelect.value;
        updateView();
    });
    
    sortOrderBtn.addEventListener('click', () => {
        state.sortAscending = !state.sortAscending;
        sortOrderBtn.textContent = state.sortAscending ? '↓' : '↑';
        sortOrderBtn.setAttribute('aria-label', `Sort ${state.sortAscending ? 'descending' : 'ascending'}`);
        updateView();
    });
}

// Setup settings
function setupSettings() {
    // Time conversion
    const convertInput = document.getElementById('convert-input');
    const convertFrom = document.getElementById('convert-from');
    const convertOutput = document.getElementById('convert-output');
    
    function updateConversion() {
        const value = parseFloat(convertInput.value) || 0;
        const unit = convertFrom.value;
        
        if (unit === 'minutes') {
            const hours = (value / 60).toFixed(2);
            convertOutput.textContent = `${hours} hour(s)`;
        } else {
            const minutes = (value * 60).toFixed(0);
            convertOutput.textContent = `${minutes} minute(s)`;
        }
    }
    
    convertInput.addEventListener('input', updateConversion);
    convertFrom.addEventListener('change', updateConversion);
    
    // Save budget
    const capInput = document.getElementById('cap-input');
    const saveCap = document.getElementById('save-cap');
    
    // Load current budget
    const settings = state.getSettings();
    capInput.value = settings.weeklyBudget || 300;
    
    saveCap.addEventListener('click', () => {
        const newBudget = parseInt(capInput.value) || 300;
        state.updateSettings({ weeklyBudget: newBudget });
        showStatus('cap-save-status', 'Budget saved successfully!', 'success');
        updateDashboard();
    });
}

// Setup data management
function setupDataManagement() {
    const exportBtn = document.getElementById('export-data');
    const importFile = document.getElementById('import-file');
    const clearBtn = document.getElementById('clear-data');
    
    exportBtn.addEventListener('click', handleExport);
    
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImport(file);
        }
        // Reset file input
        e.target.value = '';
    });
    
    clearBtn.addEventListener('click', handleClearData);
}

function handleExport() {
    try {
        const tasks = state.exportTasks();
        const dataStr = JSON.stringify(tasks, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `campus_planner_backup_${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showStatus('data-status', 'Data exported successfully!', 'success');
    } catch (error) {
        console.error('Export failed:', error);
        showStatus('data-status', 'Export failed. Please try again.', 'error');
    }
}

function handleImport(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate imported data
            const validation = validateImportedData(data);
            if (!validation.valid) {
                showStatus('data-status', `Import failed: ${validation.message}`, 'error');
                return;
            }
            
            // Import tasks
            state.importTasks(data);
            updateView();
            updateDashboard();
            showStatus('data-status', `Successfully imported ${data.length} task(s)!`, 'success');
            
        } catch (error) {
            console.error('Import failed:', error);
            showStatus('data-status', 'Import failed: Invalid JSON file', 'error');
        }
    };
    
    reader.onerror = () => {
        showStatus('data-status', 'Import failed: Could not read file', 'error');
    };
    
    reader.readAsText(file);
}

function handleClearData() {
    const confirmed = confirm('Are you sure you want to delete ALL tasks? This cannot be undone!');
    if (!confirmed) return;
   
    try {
        clearAllData();
        state.clearAllTasks();
        state.settings = { weeklyBudget: 300 };
        updateView();
        updateDashboard();
        showStatus('data-status', 'All data cleared', 'success');
    } catch (error) {
        console.error('Clear data failed:', error);
        showStatus('data-status', 'Failed to clear data. Please try again.', 'error');
    }
}

// Setup delete dialog
function setupDeleteDialog() {
    const confirmBtn = document.getElementById('confirm-delete');
    const cancelBtn = document.getElementById('cancel-delete');
    
    confirmBtn.addEventListener('click', () => {
        if (state.deleteTaskId) {
            state.deleteTask(state.deleteTaskId);
            updateView();
            updateDashboard();
            hideDeleteDialog();
        }
    });
    
    cancelBtn.addEventListener('click', hideDeleteDialog);
    
    // Close dialog on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const dialog = document.getElementById('delete-dialog');
            if (dialog && !dialog.hidden) {
                hideDeleteDialog();
            }
        }
    });
}

// Setup keyboard shortcuts 
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + N - New task
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            switchSection('add-task');
            document.getElementById('task-title').focus();
        }
        
        // Ctrl/Cmd + S - Save (when in form)
        if ((e.ctrlKey || e.metaKey) && e.key === 's' && state.currentSection === 'add-task') {
            e.preventDefault();
            const form = document.getElementById('task-form');
            form.dispatchEvent(new Event('submit'));
        }
    });
}

// Update view with current filters and sorting
function updateView() {
    let tasks = state.getAllTasks();
    
    // Apply search filter
    if (state.searchRegex) {
        tasks = filterTasksByRegex(tasks, state.searchRegex);
    }
    
    // Apply sorting
    tasks = sortTasks(tasks, state.sortBy, state.sortAscending);
    
    // Render tasks
    renderTasks(tasks, state.searchRegex);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle delete confirmation from dialog.js
document.addEventListener('delete:confirm', (e) => {
    const taskId = e.detail && e.detail.id;
    if (!taskId) return;
    
    state.deleteTask(taskId);
    updateView();
    updateDashboard();
});