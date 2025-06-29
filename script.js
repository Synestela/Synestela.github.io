// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- State Object ---
    // Stores the user's selections. Initialized to null.
    const selections = {
        mood: null,
        sleep: null,
        energy: null,
        stress: null
    };

    // --- DOM Element References ---
    const optionButtons = document.querySelectorAll('.option-btn');
    const getSuggestionButton = document.getElementById('get-suggestion-btn');
    const errorMessage = document.getElementById('error-message');
    const resultContainer = document.getElementById('result-container');
    const suggestionText = document.getElementById('suggestion-text');

    // --- Event Listener for Option Buttons ---
    // Add a click event listener to each option button.
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            const value = button.dataset.value;

            // Update the state with the user's selection
            selections[category] = value;

            // --- Visual Feedback ---
            // Remove 'selected' class from all buttons in the same category
            const categoryButtons = document.querySelectorAll(`.option-btn[data-category="${category}"]`);
            categoryButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            // Add 'selected' class to the clicked button
            button.classList.add('selected');

            // Hide any displayed messages when the user makes a new selection
            errorMessage.style.display = 'none';
            resultContainer.style.display = 'none';
        });
    });

    // --- Event Listener for the "Get Suggestion" Button ---
    getSuggestionButton.addEventListener('click', () => {
        // Hide previous messages before evaluation
        errorMessage.style.display = 'none';
        resultContainer.style.display = 'none';

        // 1. VALIDATION: Check if all inputs are provided
        const allInputsComplete = Object.values(selections).every(value => value !== null);

        if (!allInputsComplete) {
            errorMessage.style.display = 'block'; // Show error message
            return; // Stop further execution
        }

        // 2. EVALUATION: Determine the suggestion based on the flowchart logic
        let suggestion = '';

        // Follow the exact flowchart logic
        if (selections.mood === 'happy') {
            // Is energy high?
            if (selections.energy === 'high') {
                suggestion = 'Continue with your planned activity'; // R1
            } else { // energy is 'low'
                suggestion = 'Wait before starting a new task'; // R2
            }
        } else {
            // Is mood neutral?
            if (selections.mood === 'neutral') {
                // Is stress high?
                if (selections.stress === 'high') {
                    suggestion = 'Take a short breathing break'; // R3
                } else { // stress is 'low'
                    suggestion = 'Proceed with light mental tasks'; // R4
                }
            } else {
                // Is mood sad?
                if (selections.mood === 'sad') {
                    // Is sleep poor?
                    if (selections.sleep === 'poor') {
                        suggestion = 'Rest before continuing your day'; // R5
                    } else { // sleep is 'adequate'
                        suggestion = 'Choose a comforting activity'; // R6
                    }
                } else if (selections.mood === 'unsure') {
                    // Not sure about mood leads to emotional recovery
                    suggestion = 'Focus on emotional recovery'; // R7
                } else {
                    // This handles any other mood value (fallback case)
                    suggestion = 'Focus on emotional recovery'; // R7
                }
            }
        }

        // 3. DISPLAY: Show the final suggestion to the user
        suggestionText.textContent = suggestion;
        resultContainer.style.display = 'block';
    });
});
