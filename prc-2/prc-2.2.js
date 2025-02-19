const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Array to store tasks
const tasks = [];

/**
 * Adds a new task to the tasks array.
 * @param {string} title - The title of the task.
 * @param {number} dueTime - Due time in minutes from now.
 * @param {number} priority - Priority of the task (1: High, 2: Medium, 3: Low).
 */
function addTask(title, dueTime, priority) {
    try {
        if (!title || typeof title !== 'string') {
            throw new Error('Invalid or missing title.');
        }
        if (typeof dueTime !== 'number' || dueTime < 0) {
            throw new Error('Invalid dueTime. It should be a non-negative number.');
        }
        if (![1, 2, 3].includes(priority)) {
            throw new Error('Invalid priority. Use 1 for High, 2 for Medium, 3 for Low.');
        }

        const dueDate = new Date(Date.now() + dueTime * 60000); // Convert minutes to milliseconds

        const task = {
            title,
            dueTime,
            priority,
            dueDate
        };

        tasks.push(task);
        console.log(`Task "${title}" added successfully.`);
    } catch (error) {
        console.error(`Error adding task: ${error.message}`);
    }
}

function sortTasksByPriority(order = 'asc') {
    try {
        const sortedTasks = [...tasks].sort((a, b) => {
            if (order === 'asc') {
                return a.priority - b.priority;
            } else if (order === 'desc') {
                return b.priority - a.priority;
            } else {
                throw new Error("Invalid sort order. Use 'asc' or 'desc'.");
            }
        });
        return sortedTasks;
    } catch (error) {
        console.error(`Error sorting tasks: ${error.message}`);
        return [];
    }
}

function getTasksDueWithin(minutes) {
    try {
        if (typeof minutes !== 'number' || minutes < 0) {
            throw new Error('Invalid timeframe. It should be a non-negative number.');
        }

        const now = Date.now();
        const future = now + minutes * 60000;

        const dueTasks = tasks.filter(task => {
            return task.dueDate.getTime() <= future;
        });

        return dueTasks;
    } catch (error) {
        console.error(`Error filtering tasks: ${error.message}`);
        return [];
    }
}

function simulateReminders() {
    tasks.forEach(task => {
        const delay = task.dueTime * 60000; // Convert minutes to milliseconds

        setTimeout(() => {
            console.log(`Reminder: Task "${task.title}" is due now!`);
        }, delay);
    });
}

function clearAllTasks() {
    tasks.length = 0;
    console.log('All tasks have been cleared.');
}

function displayMenu() {
    console.log(`\nTask Reminder System Menu:`);
    console.log(`1. Add Task`);
    console.log(`2. Sort Tasks by Priority`);
    console.log(`3. Display Tasks Due Within a Timeframe`);
    console.log(`4. Simulate Reminders`);
    console.log(`5. Clear All Tasks`);
    console.log(`6. Exit`);
}

function handleUserInput() {
    displayMenu();
    rl.question('Enter your choice: ', (choice) => {
        switch (choice) {
            case '1':
                rl.question('Enter task title: ', (title) => {
                    rl.question('Enter due time in minutes: ', (dueTime) => {
                        rl.question('Enter priority (1: High, 2: Medium, 3: Low): ', (priority) => {
                            addTask(title, parseInt(dueTime), parseInt(priority));
                            handleUserInput();
                        });
                    });
                });
                break;
            case '2':
                rl.question('Enter sort order (asc/desc): ', (order) => {
                    const sortedTasks = sortTasksByPriority(order);
                    console.log('Sorted Tasks:', sortedTasks);
                    handleUserInput();
                });
                break;
            case '3':
                rl.question('Enter timeframe in minutes: ', (minutes) => {
                    const dueTasks = getTasksDueWithin(parseInt(minutes));
                    console.log('Tasks due within the timeframe:', dueTasks);
                    handleUserInput();
                });
                break;
            case '4':
                simulateReminders();
                console.log('Reminders scheduled.');
                handleUserInput();
                break;
            case '5':
                clearAllTasks();
                handleUserInput();
                break;
            case '6':
                console.log('Exiting Task Reminder System.');
                rl.close();
                break;
            default:
                console.log('Invalid choice. Please try again.');
                handleUserInput();
        }
    });
}

// Start the program
handleUserInput();
