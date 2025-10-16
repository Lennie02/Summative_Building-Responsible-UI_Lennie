// validators.js - regex validation patterns

// Title validation: no leading/trailing spaces, collapse doubles
// Pattern: ^\\S(?:.*\\S)?$
export function validateTitle(title) {
    const pattern = /^\S(?:.*\S)?$/;
    if (!title || title.trim() === '') {
        return { valid: false, message: 'Title is required' };
    }
    if (!pattern.test(title)) {
        return { valid: false, message: 'Title cannot have leading/trailing spaces or be only whitespace' };
    }
    
    // Check for duplicate words (advanced regex with back-reference)
    const duplicatePattern = /\b(\w+)\s+\1\b/i;
    if (duplicatePattern.test(title)) {
        return { valid: false, message: 'Title contains duplicate words' };
    }
    
    return { valid: true, message: '' };
}

// Date validation: YYYY-MM-DD format
// Pattern: ^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$
export function validateDate(dateStr) {
    const pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!dateStr) {
        return { valid: false, message: 'Date is required' };
    }
    if (!pattern.test(dateStr)) {
        return { valid: false, message: 'Date must be in YYYY-MM-DD format' };
    }
    
    // Additional check for valid date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return { valid: false, message: 'Invalid date' };
    }
    
    return { valid: true, message: '' };
}

// Duration validation: positive integer or decimal
// Pattern: ^(0|[1-9]\\d*)(\\.\\d{1,2})?$
export function validateDuration(duration) {
    const pattern = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    if (!duration) {
        return { valid: false, message: 'Duration is required' };
    }
    if (!pattern.test(duration)) {
        return { valid: false, message: 'Duration must be a valid positive number (e.g., 60 or 90.5)' };
    }
    const num = parseFloat(duration);
    if (num <= 0) {
        return { valid: false, message: 'Duration must be greater than 0' };
    }
    return { valid: true, message: '' };
}

// Tag validation: letters, spaces, hyphens only
// Pattern: ^[A-Za-z]+(?:[ -][A-Za-z]+)*$
export function validateTag(tag) {
    const pattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    if (!tag || tag.trim() === '') {
        return { valid: false, message: 'Tag is required' };
    }
    if (!pattern.test(tag)) {
        return { valid: false, message: 'Tag can only contain letters, spaces, and hyphens (e.g., Assignment or Study-Group)' };
    }
    return { valid: true, message: '' };
}

// Validate entire task object
export function validateTask(task) {
    const errors = {};
    
    const titleResult = validateTitle(task.title);
    if (!titleResult.valid) errors.title = titleResult.message;
    
    const dateResult = validateDate(task.dueDate);
    if (!dateResult.valid) errors.dueDate = dateResult.message;
    
    const durationResult = validateDuration(task.duration);
    if (!durationResult.valid) errors.duration = durationResult.message;
    
    const tagResult = validateTag(task.tag);
    if (!tagResult.valid) errors.tag = tagResult.message;
    
    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

// Validate imported JSON structure
export function validateImportedData(data) {
    if (!Array.isArray(data)) {
        return { valid: false, message: 'Data must be an array of tasks' };
    }
    
    for (let i = 0; i < data.length; i++) {
        const task = data[i];
        if (!task.id || !task.title || !task.dueDate || task.duration === undefined || !task.tag) {
            return { valid: false, message: `Task at index ${i} is missing required fields` };
        }
        
        // Validate each field
        const validation = validateTask(task);
        if (!validation.valid) {
            return { valid: false, message: `Task at index ${i} has invalid data: ${Object.values(validation.errors).join(', ')}` };
        }
    }
    
    return { valid: true, message: '' };
}