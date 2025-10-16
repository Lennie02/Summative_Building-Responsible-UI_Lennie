// search.js - regex search and highlight functionality

// Compile regex safely
export function compileRegex(input, caseSensitive = false) {
    if (!input || input.trim() === '') {
        return null;
    }
    
    try {
        const flags = caseSensitive ? 'g' : 'gi';
        return new RegExp(input, flags);
    } catch (error) {
        console.error('Invalid regex pattern:', error);
        return null;
    }
}

// Highlight matches in text
export function highlightMatches(text, regex) {
    if (!regex || !text) {
        return text;
    }
    
    try {
        return text.replace(regex, match => `<mark>${match}</mark>`);
    } catch (error) {
        console.error('Error highlighting matches:', error);
        return text;
    }
}

// Filter tasks by regex pattern
export function filterTasksByRegex(tasks, regex) {
    if (!regex) {
        return tasks;
    }
    
    return tasks.filter(task => {
        const searchableText = `${task.title} ${task.tag} ${task.dueDate}`;
        return regex.test(searchableText);
    });
}

// Sort tasks
export function sortTasks(tasks, sortBy, ascending = true) {
    const sorted = [...tasks];
    
    sorted.sort((a, b) => {
        let compareA, compareB;
        
        switch (sortBy) {
            case 'title':
                compareA = a.title.toLowerCase();
                compareB = b.title.toLowerCase();
                break;
            case 'date':
                compareA = new Date(a.dueDate);
                compareB = new Date(b.dueDate);
                break;
            case 'duration':
                compareA = parseFloat(a.duration);
                compareB = parseFloat(b.duration);
                break;
            default:
                return 0;
        }
        
        if (compareA < compareB) return ascending ? -1 : 1;
        if (compareA > compareB) return ascending ? 1 : -1;
        return 0;
    });
    
    return sorted;
}