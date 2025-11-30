// storage.js - handles localStorage operations

const STORAGE_KEY = 'campus_planner_tasks';
const SETTINGS_KEY = 'campus_planner_settings';

// Load tasks from localStorage
export function loadTasks() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

// Save tasks to localStorage
export function saveTasks(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error('Error saving tasks:', error);
        return false;
    }
}

// Load settings from localStorage
export function loadSettings() {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        return data ? JSON.parse(data) : { weeklyBudget: 300 };
    } catch (error) {
        console.error('Error loading settings:', error);
        return { weeklyBudget: 300 };
    }
}

// Save settings to localStorage
export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

// Clearing all data
export function clearAllData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SETTINGS_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
}