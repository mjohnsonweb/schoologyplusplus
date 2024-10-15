// Content script for Schoology Plus Lite

// Apply saved theme color and dark mode
chrome.storage.sync.get(['themeColor', 'darkMode'], function(items) {
    if (items.themeColor) {
        document.body.style.setProperty('--theme-color', items.themeColor);
    }
    if (items.darkMode) {
        document.body.classList.toggle('dark-mode', items.darkMode);
    }
});

// Function to inject "What-If" grading functionality
function injectWhatIfGrades() {
    const gradeElements = document.querySelectorAll('.grade'); // Replace with actual grade element selectors
    gradeElements.forEach(gradeElement => {
        const gradeValue = parseFloat(gradeElement.textContent.trim().replace('%', ''));
        const inputElement = document.createElement('input');
        inputElement.type = 'number';
        inputElement.placeholder = 'What if grade';
        inputElement.style.marginLeft = '10px';

        const calculateButton = document.createElement('button');
        calculateButton.textContent = 'Calculate';
        calculateButton.style.marginLeft = '5px';

        calculateButton.addEventListener('click', function() {
            const whatIfGrade = parseFloat(inputElement.value);
            if (!isNaN(whatIfGrade)) {
                const newAverage = (gradeValue + whatIfGrade) / 2; // Simple average calculation
                alert(`New average with ${whatIfGrade}%: ${newAverage.toFixed(2)}%`);
            }
        });

        gradeElement.parentNode.insertBefore(inputElement, gradeElement.nextSibling);
        gradeElement.parentNode.insertBefore(calculateButton, gradeElement.nextSibling);
    });
}

// Inject "What-If" grades functionality on page load
injectWhatIfGrades();
