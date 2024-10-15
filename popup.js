document.addEventListener('DOMContentLoaded', function() {
    const themeColorInput = document.getElementById('themeColor');
    const taskInput = document.getElementById('newTask');
    const taskContainer = document.getElementById('taskContainer');
    const courseNameInput = document.getElementById('courseName');
    const courseGradeInput = document.getElementById('courseGrade');
    const gradeContainer = document.getElementById('gradeContainer');
    const averageGradeContainer = document.getElementById('averageGradeContainer');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const resetSettingsButton = document.getElementById('resetSettings');

    // Load saved settings
    chrome.storage.sync.get(['themeColor', 'darkMode', 'tasks', 'grades'], function(items) {
        if (items.themeColor) {
            document.body.style.backgroundColor = items.themeColor;
            themeColorInput.value = items.themeColor;
        }
        if (items.darkMode) {
            document.body.classList.toggle('dark-mode', items.darkMode);
            darkModeToggle.checked = items.darkMode;
        }
        if (items.tasks) {
            items.tasks.forEach(task => addTaskToList(task.text, task.completed));
        }
        if (items.grades) {
            items.grades.forEach(addGradeToList);
            calculateAverageGrade();
        }
    });

    // Apply theme color
    document.getElementById('applyTheme').addEventListener('click', function() {
        const color = themeColorInput.value;
        document.body.style.backgroundColor = color;
        chrome.storage.sync.set({themeColor: color});
    });

    // Toggle dark mode
    darkModeToggle.addEventListener('change', function() {
        const isDarkMode = darkModeToggle.checked;
        document.body.classList.toggle('dark-mode', isDarkMode);
        chrome.storage.sync.set({darkMode: isDarkMode});
    });

    // Add task with completion toggle
    document.getElementById('addTask').addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTaskToList(taskText, false);
            saveTasks();
            taskInput.value = '';
        }
    });

    // Add grade and calculate average
    document.getElementById('addGrade').addEventListener('click', function() {
        const courseName = courseNameInput.value.trim();
        const courseGrade = parseFloat(courseGradeInput.value.trim());
        if (courseName && !isNaN(courseGrade)) {
            const grade = { courseName, courseGrade };
            addGradeToList(grade);
            calculateAverageGrade();
            saveGrades();
            courseNameInput.value = '';
            courseGradeInput.value = '';
        }
    });

    // Reset all settings
    resetSettingsButton.addEventListener('click', function() {
        chrome.storage.sync.clear();
        location.reload();
    });

    // Helper functions
    function addTaskToList(taskText, completed) {
        const listItem = document.createElement('li');
        listItem.textContent = taskText;
        if (completed) listItem.classList.add('completed');
        listItem.addEventListener('click', function() {
            listItem.classList.toggle('completed');
            saveTasks();
        });
        taskContainer.appendChild(listItem);
    }

    function saveTasks() {
        const tasks = Array.from(taskContainer.querySelectorAll('li')).map(item => ({
            text: item.textContent,
            completed: item.classList.contains('completed')
        }));
        chrome.storage.sync.set({tasks: tasks});
    }

    function addGradeToList(grade) {
        const listItem = document.createElement('li');
        listItem.textContent = `${grade.courseName}: ${grade.courseGrade}%`;
        gradeContainer.appendChild(listItem);
    }

    function saveGrades() {
        const grades = Array.from(gradeContainer.querySelectorAll('li')).map(item => {
            const [courseName, courseGrade] = item.textContent.split(': ');
            return { courseName, courseGrade: parseFloat(courseGrade.replace('%', '')) };
        });
        chrome.storage.sync.set({grades: grades});
    }

    function calculateAverageGrade() {
        const grades = Array.from(gradeContainer.querySelectorAll('li')).map(item => {
            return parseFloat(item.textContent.split(': ')[1].replace('%', ''));
        });
        if (grades.length > 0) {
            const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
            averageGradeContainer.textContent = `Average Grade: ${average.toFixed(2)}%`;
        } else {
            averageGradeContainer.textContent = '';
        }
    }
});
