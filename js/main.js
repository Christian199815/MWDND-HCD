document.addEventListener('DOMContentLoaded', function() {
    const stenographKeyboard = document.getElementById('stenographKeyboard');
    const fullKeyboard = document.getElementById('fullKeyboard');
    const suggestions = document.getElementById('suggestions');
    const output = document.getElementById('output');
    const enterBtn = document.getElementById('enterBtn');
    const spaceBtn = document.getElementById('spaceBtn');
    const backspaceBtn = document.getElementById('backspaceBtn');
    const clearBtn = document.getElementById('clearBtn');
    const wordDeleteBtn = document.getElementById('wordDeleteBtn');
    const stenographTab = document.getElementById('stenographTab');
    const fullKeyboardTab = document.getElementById('fullKeyboardTab');
    const infoToggle = document.getElementById('infoToggle');
    const infoPanel = document.getElementById('infoPanel');
    
    let selectedKeys = [];
    let activeKeyboard = 'stenograph';
    
    // Tab switching functionality
    stenographTab.addEventListener('click', () => {
        stenographTab.classList.add('active');
        fullKeyboardTab.classList.remove('active');
        stenographKeyboard.style.display = 'grid';
        fullKeyboard.style.display = 'none';
        activeKeyboard = 'stenograph';
    });
    
    fullKeyboardTab.addEventListener('click', () => {
        fullKeyboardTab.classList.add('active');
        stenographTab.classList.remove('active');
        fullKeyboard.style.display = 'grid';
        stenographKeyboard.style.display = 'none';
        activeKeyboard = 'full';
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
            const keyValue = key.dataset.key;
            key.classList.toggle('active', selectedKeys.includes(keyValue));
        });
        
        // Generate suggestions
        updateSuggestions();
    }
    
    function updateSuggestions() {
        suggestions.innerHTML = '';
        if (selectedKeys.length === 0) return;
        
        // Sort keys to match dictionary keys
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
            // Add it as the first suggestion
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
        if (currentText.length > 0 && !currentText.endsWith(' ')) {
            output.value += ' ' + word;
        } else {
            output.value += word;
        }
    }
    
    function clearSelectedKeys() {
        selectedKeys = [];
        updateKeyboard();
    }
    
    // Event listeners
    stenographKeyboard.addEventListener('click', event => {
        const key = event.target;
        if (key.classList.contains('key')) {
            const keyValue = key.dataset.key;
            
            // Toggle key selection
            if (selectedKeys.includes(keyValue)) {
                selectedKeys = selectedKeys.filter(k => k !== keyValue);
            } else {
                selectedKeys.push(keyValue);
            }
            
            updateKeyboard();
        }
    });
    
    fullKeyboard.addEventListener('click', event => {
        const key = event.target;
        if (key.classList.contains('type-key')) {
            const charValue = key.dataset.char;
            
            // Add to selected keys to get suggestions
            if (charValue.match(/[A-Za-z]/)) {
                selectedKeys.push(charValue.toUpperCase());
                updateSuggestions();
            } else {
                // For non-letters (space, punctuation, etc.), add directly to output
                output.value += charValue;
            }
        }
    });
    
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
    
    spaceBtn.addEventListener('click', () => {
        // If there are selected keys, add the current word + space
        if (selectedKeys.length > 0) {
            const directWord = selectedKeys.join('').toLowerCase();
            appendWord(directWord);
            clearSelectedKeys();
        } else {
            // If no word is being composed, just add a space
            output.value += ' ';
        }
    });
    
    backspaceBtn.addEventListener('click', () => {
        if (selectedKeys.length > 0) {
            selectedKeys.pop();
            updateKeyboard();
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