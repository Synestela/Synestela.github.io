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

        if (selections.mood === 'happy') {
            if (selections.energy === 'high') {
                suggestion = 'Continue with your planned activity';
            } else { // energy is 'low'
                suggestion = 'Wait before starting a new task';
            }
        } else if (selections.mood === 'neutral') {
            if (selections.stress === 'high') {
                suggestion = 'Take a short breathing break';
            } else { // stress is 'low'
                suggestion = 'Proceed with light mental tasks';
            }
        } else if (selections.mood === 'sad') {
            if (selections.sleep === 'poor') {
                suggestion = 'Rest before continuing your day';
            } else { // sleep is 'adequate'
                suggestion = 'Choose a comforting activity';
            }
        } else {
            // This 'else' block handles the "unrecognized mood" or fallback case
            // from the flowchart (the 'No' path after checking 'sad').
            suggestion = 'Focus on emotional recovery';
        }

        // 3. DISPLAY: Show the final suggestion to the user
        suggestionText.textContent = suggestion;
        resultContainer.style.display = 'block';
    });
});
