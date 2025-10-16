// state.js - application state management

import { loadTasks, saveTasks, loadSettings, saveSettings } from './storage.js';

class AppState {
    constructor() {
        this.tasks = loadTasks();
        this.settings = loadSettings();
        this.currentSection = 'dashboard';
        this.editingTaskId = null;
        this.searchRegex = null;
        this.sortBy = 'date';
        this.sortAscending = true;
        this.deleteTaskId = null;
    }
    
    // Task operations
    addTask(taskData) {
        const now = new Date().toISOString();
        const task = {
            id: this.generateId(),
            title: taskData.title,
            dueDate: taskData.dueDate,
            duration: parseFloat(taskData.duration),
            tag: taskData.tag,
            createdAt: now,
            updatedAt: now
        };
        
        this.tasks.push(task);
        this.saveTasks();
        return task;
    }
    
    updateTask(id, taskData) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) return null;
        
        this.tasks[index] = {
            ...this.tasks[index],
            title: taskData.title,
            dueDate: taskData.dueDate,
            duration: parseFloat(taskData.duration),
            tag: taskData.tag,
            updatedAt: new Date().toISOString()
        };
        
        this.saveTasks();
        return this.tasks[index];
    }
    
    deleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) return false;
        
        this.tasks.splice(index, 1);
        this.saveTasks();
        return true;
    }
    
    getTask(id) {
        return this.tasks.find(t => t.id === id);
    }
    
    getAllTasks() {
        return [...this.tasks];
    }
    
    // Settings operations
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        saveSettings(this.settings);
    }
    
    getSettings() {
        return { ...this.settings };
    }
    
    // Import/Export
    importTasks(tasks) {
        this.tasks = tasks;
        this.saveTasks();
    }
    
    exportTasks() {
        return this.getAllTasks();
    }
    
    // Helper methods
    generateId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `task_${timestamp}_${random}`;
    }
    
    saveTasks() {
        saveTasks(this.tasks);
    }
    
    clearAllTasks() {
        this.tasks = [];
        this.saveTasks();
    }
}

// Create and export singleton instance
export const state = new AppState();