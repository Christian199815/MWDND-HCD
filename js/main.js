document.addEventListener('DOMContentLoaded', function() {
    const stenographKeyboard = document.getElementById('stenographKeyboard');
    const fullKeyboard = document.getElementById('fullKeyboard');
    const symbolsKeyboard = document.getElementById('symbolsKeyboard');
    const suggestions = document.getElementById('suggestions');
    const output = document.getElementById('output');
    const enterBtn = document.getElementById('enterBtn');
    const backspaceBtn = document.getElementById('backspaceBtn');
    const clearBtn = document.getElementById('clearBtn');
    const wordDeleteBtn = document.getElementById('wordDeleteBtn');
    const stenographTab = document.getElementById('stenographTab');
    const fullKeyboardTab = document.getElementById('fullKeyboardTab');
    const symbolsTab = document.getElementById('symbolsTab');
    const infoToggle = document.getElementById('infoToggle');
    const infoPanel = document.getElementById('infoPanel');
    const keyboardToggleBtn = document.getElementById('keyboardToggleBtn');
    const keyboardModeIndicator = document.getElementById('keyboardModeIndicator');
    
    let selectedKeys = [];
    let activeKeyboard = 'stenograph';
    let isSecondaryMode = false; // Track if we're in secondary mode across all keyboards
    
    // Tab switching functionality
    stenographTab.addEventListener('click', () => {
        stenographTab.classList.add('active');
        fullKeyboardTab.classList.remove('active');
        symbolsTab.classList.remove('active');
        stenographKeyboard.style.display = 'grid';
        fullKeyboard.style.display = 'none';
        symbolsKeyboard.style.display = 'none';
        activeKeyboard = 'stenograph';
    });
    
    fullKeyboardTab.addEventListener('click', () => {
        fullKeyboardTab.classList.add('active');
        stenographTab.classList.remove('active');
        symbolsTab.classList.remove('active');
        fullKeyboard.style.display = 'grid';
        stenographKeyboard.style.display = 'none';
        symbolsKeyboard.style.display = 'none';
        activeKeyboard = 'full';
    });
    
    symbolsTab.addEventListener('click', () => {
        symbolsTab.classList.add('active');
        stenographTab.classList.remove('active');
        fullKeyboardTab.classList.remove('active');
        symbolsKeyboard.style.display = 'grid';
        stenographKeyboard.style.display = 'none';
        fullKeyboard.style.display = 'none';
        activeKeyboard = 'symbols';
    });
    
    // Info panel toggle
    infoToggle.addEventListener('click', () => {
        if (infoPanel.style.display === 'none') {
            infoPanel.style.display = 'block';
        } else {
            infoPanel.style.display = 'none';
        }
    });
    
    // Function to update the keyboard and suggestions based on selected keys
    function updateKeyboard() {
        // Clear active states
        const keys = stenographKeyboard.querySelectorAll('.key');
        keys.forEach(key => {
            const primaryKey = key.dataset.primary;
            const secondaryKey = key.dataset.secondary;
            
            // Determine if this key is selected (either primary or secondary mode)
            const isPrimarySelected = selectedKeys.includes(primaryKey);
            const isSecondarySelected = selectedKeys.includes(secondaryKey);
            
            key.classList.toggle('primary-selected', isPrimarySelected);
            key.classList.toggle('secondary-selected', isSecondarySelected);
        });
        
        // Generate suggestions
        updateSuggestions();
    }
    
    function updateSuggestions() {
        suggestions.innerHTML = '';
        if (selectedKeys.length === 0) return;
        
        // Sort keys alphabetically to match dictionary keys
        const sortedKeys = [...selectedKeys].sort().join('');
        
        // Find words that match the current key combination
        let words = dictionary[sortedKeys] || [];
        
        // If no exact match, find partial matches
        if (words.length === 0) {
            // Check all dictionary entries
            Object.entries(dictionary).forEach(([combo, wordList]) => {
                // If all selected keys are in this combo
                const comboChars = combo.split('');
                if (selectedKeys.every(key => comboChars.includes(key))) {
                    words = [...words, ...wordList];
                }
            });
            
            // Limit to 5 suggestions (excluding the direct word if present)
            words = [...new Set(words)].slice(0, 5);
        }
        
        // Add the direct word formed by the keys in sequence (not sorted)
        const directWord = selectedKeys.join('').toLowerCase();
        if (directWord.length > 0) {
            // Add it as the first suggestion with a different style
            words = [directWord, ...words];
        }
        
        // Create suggestion elements
        words.forEach(word => {
            const suggElement = document.createElement('div');
            suggElement.className = 'suggestion';
            suggElement.textContent = word;
            suggElement.addEventListener('click', () => {
                appendWord(word);
                clearSelectedKeys();
            });
            suggestions.appendChild(suggElement);
        });
    }
    
    function appendWord(word) {
        const currentText = output.value;
        if (currentText.length > 0 && !currentText.endsWith(' ') && !currentText.endsWith('\n')) {
            output.value += ' ' + word;
        } else {
            output.value += word;
        }
    }
    
    function clearSelectedKeys() {
        selectedKeys = [];
        // Reset any double-tapped keys to primary state
        const keys = stenographKeyboard.querySelectorAll('.key');
        keys.forEach(key => {
            key.classList.remove('double-tapped');
        });
        updateKeyboard();
    }
    
    // Function to toggle between primary and secondary modes
    function toggleKeyboardMode() {
        isSecondaryMode = !isSecondaryMode;
        
        // Update toggle button appearance
        keyboardToggleBtn.classList.toggle('secondary-mode', isSecondaryMode);
        
        // Update the mode indicator
        keyboardModeIndicator.textContent = isSecondaryMode ? 'Secondary Mode' : 'Primary Mode';
        keyboardModeIndicator.classList.toggle('secondary-mode', isSecondaryMode);
        
        // Update keyboard appearance to reflect the current mode
        stenographKeyboard.classList.toggle('secondary-mode', isSecondaryMode);
        fullKeyboard.classList.toggle('secondary-mode', isSecondaryMode);
        symbolsKeyboard.classList.toggle('secondary-mode', isSecondaryMode);
        
        // Remove all double-tapped classes as they're no longer needed
        const allKeys = document.querySelectorAll('.key');
        allKeys.forEach(key => {
            key.classList.remove('double-tapped');
        });
    }
    
    // Add event listener for the toggle button
    keyboardToggleBtn.addEventListener('click', toggleKeyboardMode);
    
    // Helper function to add a key to selectedKeys (without toggling)
    function addKeySelection(key) {
        // Only add the key if it's not already in the array
        if (!selectedKeys.includes(key)) {
            selectedKeys.push(key);
            return true; // Key was added
        }
        return false; // Key was already there
    }
    
    // Handle key selection for stenograph keyboard
    stenographKeyboard.addEventListener('click', event => {
        const key = event.target.closest('.key');
        if (!key) return;
        
        const primaryKey = key.dataset.primary;
        const secondaryKey = key.dataset.secondary;
        
        // Add either primary or secondary key based on current mode
        if (isSecondaryMode) {
            addKeySelection(secondaryKey);
        } else {
            addKeySelection(primaryKey);
        }
        
        updateKeyboard();
    });
    
    // Full keyboard functionality
    fullKeyboard.addEventListener('click', event => {
        const key = event.target.closest('.key');
        if (!key) return;
        
        const charValue = key.dataset.char;
        
        // Add letters to selected keys to get suggestions
        if (charValue.match(/[A-Za-z]/)) {
            // Only add if it's not already in the array
            addKeySelection(charValue.toUpperCase());
            updateSuggestions();
        } else {
            // For non-letters (space, punctuation, etc.), add directly to output
            output.value += charValue;
        }
    });
    
    // Symbols keyboard functionality
    symbolsKeyboard.addEventListener('click', event => {
        const key = event.target.closest('.key');
        if (!key) return;
        
        const primaryKey = key.dataset.primary;
        const secondaryKey = key.dataset.secondary;
        
        // Add either primary or secondary key based on current mode
        if (isSecondaryMode) {
            addKeySelection(secondaryKey);
        } else {
            addKeySelection(primaryKey);
        }
        
        updateKeyboard();
    });
    
    // Control button handlers
    enterBtn.addEventListener('click', () => {
        // If there's a current word in suggestions (first one, the green one)
        if (selectedKeys.length > 0) {
            const directWord = selectedKeys.join('').toLowerCase();
            appendWord(directWord);
            clearSelectedKeys();
        } else {
            // If no current word, just add a new line
            output.value += '\n';
        }
    });
    
    backspaceBtn.addEventListener('click', () => {
        if (selectedKeys.length > 0) {
            // Remove the last selected key
            selectedKeys.pop();
            updateKeyboard();
        } else {
            // If no keys selected, delete the last character from the output
            const text = output.value;
            if (text.length > 0) {
                output.value = text.substring(0, text.length - 1);
            }
        }
    });
    
    wordDeleteBtn.addEventListener('click', () => {
        const text = output.value;
        
        // If text is empty, nothing to delete
        if (text.length === 0) return;
        
        // Find the last space or newline
        const lastSpaceIndex = text.lastIndexOf(' ');
        const lastNewlineIndex = text.lastIndexOf('\n');
        const lastIndex = Math.max(lastSpaceIndex, lastNewlineIndex);
        
        if (lastIndex === -1) {
            // No spaces or newlines, clear all (this is a single word or characters)
            output.value = '';
        } else {
            // Check if there's content after the last delimiter
            if (lastIndex + 1 < text.length) {
                // Delete the partial word after the delimiter
                output.value = text.substring(0, lastIndex + 1);
            } else {
                // If cursor is at end of a space/newline, find previous word
                const textWithoutLastDelimiter = text.substring(0, lastIndex);
                const prevLastSpaceIndex = textWithoutLastDelimiter.lastIndexOf(' ');
                const prevLastNewlineIndex = textWithoutLastDelimiter.lastIndexOf('\n');
                const prevLastIndex = Math.max(prevLastSpaceIndex, prevLastNewlineIndex);
                
                if (prevLastIndex === -1) {
                    // Only one word before the delimiter
                    output.value = '';
                } else {
                    // Delete back to previous delimiter
                    output.value = text.substring(0, prevLastIndex + 1);
                }
            }
        }
    });
    
    clearBtn.addEventListener('click', clearSelectedKeys);
    
    // Initialize
    updateKeyboard();
});