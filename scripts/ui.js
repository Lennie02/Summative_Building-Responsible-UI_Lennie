// ui.js - DOM manipulation and rendering

import { state } from './state.js';
import { highlightMatches } from './search.js';

// Navigation
export function switchSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.hidden = true;
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.hidden = false;
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });
    
    state.currentSection = sectionId;
}

// Render tasks table and cards
export function renderTasks(tasks, searchRegex = null) {
    const tbody = document.getElementById('tasks-tbody');
    const mobileCards = document.getElementById('tasks-mobile');
    const noTasksMsg = document.getElementById('no-tasks-message');
    
    // Clear existing content
    tbody.innerHTML = '';
    mobileCards.innerHTML = '';
    
    if (tasks.length === 0) {
        noTasksMsg.hidden = false;
        return;
    }
    
    noTasksMsg.hidden = true;
    
    tasks.forEach(task => {
        // Render table row
        const row = document.createElement('tr');
        const titleText = searchRegex ? highlightMatches(task.title, searchRegex) : task.title;
        const tagText = searchRegex ? highlightMatches(task.tag, searchRegex) : task.tag;
        
        row.innerHTML = `
            <td>${titleText}</td>
            <td>${task.dueDate}</td>
            <td>${task.duration} min</td>
            <td>${tagText}</td>
            <td>
                <div class="task-actions">
                    <button class="btn-small btn-edit" data-id="${task.id}" aria-label="Edit ${task.title}">Edit</button>
                    <button class="btn-small btn-delete" data-id="${task.id}" aria-label="Delete ${task.title}">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
        
        // Render mobile card
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <h3>${titleText}</h3>
            <div class="task-card-info">
                <div><strong>Due:</strong> <span>${task.dueDate}</span></div>
                <div><strong>Duration:</strong> <span>${task.duration} min</span></div>
                <div><strong>Tag:</strong> <span>${tagText}</span></div>
            </div>
            <div class="task-actions">
                <button class="btn-small btn-edit" data-id="${task.id}" aria-label="Edit ${task.title}">Edit</button>
                <button class="btn-small btn-delete" data-id="${task.id}" aria-label="Delete ${task.title}">Delete</button>
            </div>
        `;
        mobileCards.appendChild(card);
    });
    
    // Attach event listeners to buttons
    attachTaskActionListeners();
}

// Attach event listeners to edit/delete buttons
function attachTaskActionListeners() {
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', handleEditClick);
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', handleDeleteClick);
    });
}

function handleEditClick(e) {
    const taskId = e.target.dataset.id;
    const task = state.getTask(taskId);
    if (!task) return;
    
    // Populate form
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-due-date').value = task.dueDate;
    document.getElementById('task-duration').value = task.duration;
    document.getElementById('task-tag').value = task.tag;
    
    // Update form title and show cancel button
    document.getElementById('form-title').textContent = 'Edit Task';
    document.getElementById('cancel-edit').hidden = false;
    
    state.editingTaskId = taskId;
    switchSection('add-task');
}

function handleDeleteClick(e) {
    const taskId = e.target.dataset.id;
    state.deleteTaskId = taskId;
    showDeleteModal();
}

// Delete modal
export function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.hidden = false;
    document.getElementById('confirm-delete').focus();
}

export function hideDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.hidden = true;
    state.deleteTaskId = null;
}

// Update dashboard stats
export function updateDashboard() {
    const tasks = state.getAllTasks();
    
    // Total tasks
    document.getElementById('total-tasks').textContent = tasks.length;
    
    // Total duration
    const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
    document.getElementById('total-duration').textContent = `${totalDuration} min`;
    
    // Top tag
    const tagCounts = {};
    tasks.forEach(task => {
        tagCounts[task.tag] = (tagCounts[task.tag] || 0) + 1;
    });
    
    let topTag = 'None';
    let maxCount = 0;
    for (const [tag, count] of Object.entries(tagCounts)) {
        if (count > maxCount) {
            maxCount = count;
            topTag = tag;
        }
    }
    document.getElementById('top-tag').textContent = topTag;
    
    // Last 7 days chart
    renderWeekChart(tasks);
    
    // Update cap/budget status
    updateCapStatus(totalDuration);
}

function renderWeekChart(tasks) {
    const chartDiv = document.getElementById('week-chart');
    chartDiv.innerHTML = '';
    
    const today = new Date();
    const dayCounts = new Array(7).fill(0);
    
    tasks.forEach(task => {
        const taskDate = new Date(task.dueDate);
        const diffDays = Math.floor((taskDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays >= -7 && diffDays <= 0) {
            const index = 6 + diffDays;
            if (index >= 0 && index < 7) {
                dayCounts[index]++;
            }
        }
    });
    
    const maxCount = Math.max(...dayCounts, 1);
    
    dayCounts.forEach(count => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        const height = (count / maxCount) * 100;
        bar.style.height = `${height}%`;
        bar.title = `${count} task(s)`;
        chartDiv.appendChild(bar);
    });
}

function updateCapStatus(totalDuration) {
    const settings = state.getSettings();
    const budget = settings.weeklyBudget || 300;
    const remaining = budget - totalDuration;
    
    document.getElementById('cap-value').textContent = budget;
    document.getElementById('used-value').textContent = totalDuration;
    document.getElementById('remaining-value').textContent = Math.max(0, remaining);
    
    const statusDiv = document.getElementById('cap-status');
    statusDiv.className = 'cap-status';
    
    if (remaining >= 0) {
        statusDiv.className += ' under';
        statusDiv.textContent = `You have ${remaining} minutes remaining in your weekly budget.`;
    } else {
        statusDiv.className += ' over';
        statusDiv.textContent = `Warning: You are ${Math.abs(remaining)} minutes over your weekly budget!`;
        statusDiv.setAttribute('aria-live', 'assertive');
    }
}

// Show status messages
export function showStatus(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = message;
    element.className = type;
    
    setTimeout(() => {
        element.textContent = '';
        element.className = '';
    }, 4000);
}

// Clear form
export function clearForm() {
    document.getElementById('task-form').reset();
    document.getElementById('task-id').value = '';
    document.getElementById('form-title').textContent = 'Add New Task';
    document.getElementById('cancel-edit').hidden = true;
    state.editingTaskId = null;
    
    // Clear error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group input').forEach(input => {
        input.classList.remove('invalid');
    });
}

// Show validation errors
export function showValidationErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group input').forEach(input => {
        input.classList.remove('invalid');
    });
    
    // Show new errors
    if (errors.title) {
        document.getElementById('title-error').textContent = errors.title;
        document.getElementById('task-title').classList.add('invalid');
    }
    if (errors.dueDate) {
        document.getElementById('date-error').textContent = errors.dueDate;
        document.getElementById('task-due-date').classList.add('invalid');
    }
    if (errors.duration) {
        document.getElementById('duration-error').textContent = errors.duration;
        document.getElementById('task-duration').classList.add('invalid');
    }
    if (errors.tag) {
        document.getElementById('tag-error').textContent = errors.tag;
        document.getElementById('task-tag').classList.add('invalid');
    }
}