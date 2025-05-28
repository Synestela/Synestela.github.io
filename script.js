document.addEventListener('DOMContentLoaded', () => {
    const flowchartTextElement = document.getElementById('flowchart-text');
    const flowchartButtonsElement = document.getElementById('flowchart-buttons');
    const startButton = document.getElementById('start-button');
    const recommendationArea = document.getElementById('recommendation-area');
    const recommendationList = document.getElementById('recommendation-list');
    const finalMessageElement = document.getElementById('final-message');

    let recommendations = []; // To store actions taken by the user

    // Flowchart structure
    // Each node has:
    // - text: The question or statement
    // - type: 'decision', 'action', 'statement', 'end'
    // - (if decision) yes: next node ID if yes
    // - (if decision) no: next node ID if no
    // - (if action/statement) next: next node ID
    // - (optional) actionText: text to add to recommendations
    const flowchart = {
        'startNode': {
            text: "You've been diagnosed with high cholesterol. This guide will help you consider some initial lifestyle adjustments.",
            type: 'statement',
            next: 'q_follow_plan_initial' // We'll ask this first as per the diagram's structure
        },
        // --- Left Branch: Difficulty with current plan ---
        'q_follow_plan_initial': {
            text: "Are you currently on a diet plan and finding it difficult to follow?",
            type: 'decision',
            yes: 'a_identify_difficulty',
            no: 'q_meat' // If no difficulty or no current plan, proceed to main assessment
        },
        'a_identify_difficulty': {
            text: "Okay, let's try to identify the reason for the difficulty.",
            type: 'statement',
            next: 'q_factor_difficulty'
        },
        'q_factor_difficulty': {
            text: "Is there a specific factor that makes it difficult for you to continue your diet (e.g., cost, time, cravings)?",
            type: 'decision',
            yes: 'a_consult_dietitian',
            no: 'a_set_goals_boost_effort'
        },
        'a_consult_dietitian': {
            text: "It's best to consult a dietitian again to receive personalized support and adjustments to your plan.",
            type: 'action',
            actionText: "Consult a dietitian for personalized support.",
            next: 's_monitoring'
        },
        'a_set_goals_boost_effort': {
            text: "Consider setting small, achievable goals to boost your personal effort. Take small steps forward, and celebrate your progress.",
            type: 'action',
            actionText: "Set small, achievable goals and take small steps forward.",
            next: 's_monitoring'
        },
        // --- Right Branch: Initial Assessment ---
        'q_meat': {
            text: "Do you frequently consume red or processed meat?",
            type: 'decision',
            yes: 'a_reduce_consumption',
            no: 'q_vegetables'
        },
        'a_reduce_consumption': {
            text: "Consider reducing your consumption of red and processed meat.",
            type: 'action',
            actionText: "Reduce consumption of red and processed meat.",
            next: 'q_vegetables'
        },
        'q_vegetables': {
            text: "Do you consume enough vegetables, legumes, and whole grains?",
            type: 'decision',
            yes: 'q_physical_activity',
            no: 'a_increase_fiber'
        },
        'a_increase_fiber': {
            text: "Try to increase your intake of fiber-rich foods like vegetables, legumes, and whole grains.",
            type: 'action',
            actionText: "Increase intake of fiber-rich foods.",
            next: 'q_physical_activity'
        },
        'q_physical_activity': {
            text: "Do you engage in regular physical activity?",
            type: 'decision',
            yes: 'a_great_keep_going',
            no: 'a_start_walk'
        },
        'a_start_walk': {
            text: "Start with a 30-minute walk each day. Gradually increase intensity or duration as you feel comfortable.",
            type: 'action',
            actionText: "Start with a 30-minute walk each day.",
            next: 's_monitoring'
        },
        'a_great_keep_going': {
            text: "Great! Keep up the regular physical activity. Consider getting retested in one month to see progress.",
            type: 'action',
            actionText: "Continue regular physical activity and get retested in one month.",
            next: 's_monitoring'
        },
        // --- End State ---
        's_monitoring': {
            text: "Your diet plan/approach has been noted. The monitoring process has begun.",
            type: 'end'
        }
    };

    let currentNodeId = 'startNode'; // Initial node for when the app starts, before clicking "Start"

    function renderNode(nodeId) {
        const node = flowchart[nodeId];
        if (!node) {
            console.error("Error: Node not found: " + nodeId);
            flowchartTextElement.textContent = "An error occurred. Please refresh.";
            flowchartButtonsElement.innerHTML = '';
            return;
        }

        flowchartTextElement.textContent = node.text;
        flowchartButtonsElement.innerHTML = ''; // Clear previous buttons

        if (node.actionText) {
            if (!recommendations.includes(node.actionText)) { // Avoid duplicate entries if revisiting
                 recommendations.push(node.actionText);
            }
        }

        switch (node.type) {
            case 'statement':
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Continue';
                nextButton.classList.add('full-width');
                nextButton.onclick = () => {
                    currentNodeId = node.next;
                    renderNode(currentNodeId);
                };
                flowchartButtonsElement.appendChild(nextButton);
                break;
            case 'decision':
                const yesButton = document.createElement('button');
                yesButton.textContent = 'Yes';
                yesButton.onclick = () => {
                    currentNodeId = node.yes;
                    renderNode(currentNodeId);
                };
                flowchartButtonsElement.appendChild(yesButton);

                const noButton = document.createElement('button');
                noButton.textContent = 'No';
                noButton.onclick = () => {
                    currentNodeId = node.no;
                    renderNode(currentNodeId);
                };
                flowchartButtonsElement.appendChild(noButton);
                break;
            case 'action':
                const proceedButton = document.createElement('button');
                proceedButton.textContent = 'Got it, Next';
                proceedButton.classList.add('full-width');
                proceedButton.onclick = () => {
                    currentNodeId = node.next;
                    renderNode(currentNodeId);
                };
                flowchartButtonsElement.appendChild(proceedButton);
                break;
            case 'end':
                displayRecommendations(node.text);
                break;
            default:
                console.error("Unknown node type: " + node.type);
                flowchartTextElement.textContent = "Error: Unknown step type.";
        }
    }

    function displayRecommendations(endMessage) {
        flowchartButtonsElement.innerHTML = ''; // Clear buttons
        recommendationArea.classList.remove('hidden');
        recommendationList.innerHTML = ''; // Clear previous recommendations

        if (recommendations.length > 0) {
            recommendations.forEach(rec => {
                const listItem = document.createElement('li');
                listItem.textContent = rec;
                recommendationList.appendChild(listItem);
            });
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = "No specific lifestyle changes were identified in this session, or you are already on a good track. Continue to monitor your health with your doctor.";
            recommendationList.appendChild(listItem);
        }
        finalMessageElement.textContent = endMessage + " Always consult your doctor for medical advice.";
    }

    startButton.onclick = () => {
        startButton.classList.add('hidden'); // Hide start button
        currentNodeId = flowchart['startNode'].next; // Move to the first actual question/statement after intro
        renderNode(currentNodeId); // Render the first interactive node
    };

    // Initial state: Show the intro text and start button.
    // The renderNode will be called when 'Start' is clicked.
    // If you want to directly start with the first node without a "Start" button:
    // renderNode('startNode'); // Or the first actual question node.
});