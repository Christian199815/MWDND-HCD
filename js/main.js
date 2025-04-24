document.addEventListener('DOMContentLoaded', function() {
    // Safely get DOM elements with null checks
    const getElement = (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id "${id}" not found`);
        }
        return element;
    };
    
    // Get all required elements with null-safety
    const stenographKeyboard = getElement('stenographKeyboard');
    const fullKeyboard = getElement('fullKeyboard');
    const symbolsKeyboard = getElement('symbolsKeyboard');
    const suggestions = getElement('suggestions');
    const output = getElement('output');
    const enterBtn = getElement('enterBtn');
    const backspaceBtn = getElement('backspaceBtn');
    const clearBtn = getElement('clearBtn');
    const wordDeleteBtn = getElement('wordDeleteBtn');
    const stenographTab = getElement('stenographTab');
    const fullKeyboardTab = getElement('fullKeyboardTab');
    const symbolsTab = getElement('symbolsTab');
    const infoToggle = getElement('infoToggle');
    const infoPanel = getElement('infoPanel');
    const keyboardToggleBtn = getElement('keyboardToggleBtn');
    const keyboardPopup = getElement('keyboardPopup');
    const chatContainer = getElement('chatContainer');
    const messageInput = getElement('messageInput');
    const sendBtn = getElement('sendBtn');
    const popupToggleBtn = document.querySelector('.keyboard-toggle-btn');
    const keyboardHandle = getElement('keyboardHandle');
    
    let selectedKeys = [];
    let activeKeyboard = 'stenograph';
    let isSecondaryMode = false;
    let touchStartY = 0;
    let touchCurrentY = 0;
    
    // Popup toggle
    if (popupToggleBtn) {
        popupToggleBtn.addEventListener('click', () => {
            if (keyboardPopup) {
                keyboardPopup.classList.toggle('active');
            }
        });
    }
    
    // Close keyboard when clicking outside but not on control elements
    document.addEventListener('click', (e) => {
        // Don't close if clicking on any part of the keyboard or the toggle button
        if (keyboardPopup && 
            keyboardPopup.classList.contains('active') && 
            !keyboardPopup.contains(e.target) && 
            e.target !== popupToggleBtn) {
            keyboardPopup.classList.remove('active');
        }
    });
    
    // Stop propagation on keyboard elements to prevent closing
    if (keyboardPopup) {
        keyboardPopup.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Drag to close functionality
    if (keyboardHandle && keyboardPopup) {
        keyboardHandle.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        keyboardHandle.addEventListener('touchmove', (e) => {
            touchCurrentY = e.touches[0].clientY;
            const diffY = touchCurrentY - touchStartY;
            
            if (diffY > 0) { // Dragging down
                keyboardPopup.style.transform = `translateY(${diffY}px)`;
            }
        });
        
        keyboardHandle.addEventListener('touchend', () => {
            const diffY = touchCurrentY - touchStartY;
            
            if (diffY > 100) { // If dragged more than 100px down
                keyboardPopup.classList.remove('active');
            }
            
            keyboardPopup.style.transform = '';
            touchStartY = 0;
            touchCurrentY = 0;
        });
        
        // For desktop/mouse users
        keyboardHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            let startY = e.clientY;
            
            const mouseMove = (e) => {
                let currentY = e.clientY;
                let diffY = currentY - startY;
                
                if (diffY > 0) {
                    keyboardPopup.style.transform = `translateY(${diffY}px)`;
                }
            };
            
            const mouseUp = (e) => {
                let diffY = e.clientY - startY;
                
                if (diffY > 100) {
                    keyboardPopup.classList.remove('active');
                }
                
                keyboardPopup.style.transform = '';
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('mouseup', mouseUp);
            };
            
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        });
    }
    
    // Send message functionality
    if (sendBtn && messageInput && chatContainer) {
        sendBtn.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                addMessage(message, 'sent');
                messageInput.value = '';
                
                // Simulate reply after 1 second
                setTimeout(() => {
                    addMessage('That\'s a cool stenograph keyboard!', 'received');
                }, 1000);
            }
        });
    }
    
    // Function to add message to chat
    function addMessage(text, type) {
        if (!chatContainer) return;
        
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Transfer text from stenograph to input
    function transferTextToInput() {
        if (!output || !messageInput) return;
        
        if (output.value.trim()) {
            messageInput.value += output.value;
            output.value = '';
            clearSelectedKeys();
            
            if (keyboardPopup) {
                keyboardPopup.classList.remove('active');
            }
        }
    }
    
    // Send text directly to chat from keyboard
    function sendTextFromKeyboard() {
        if (!output || !chatContainer) return;
        
        const text = output.value.trim();
        if (text) {
            addMessage(text, 'sent');
            output.value = '';
            clearSelectedKeys();
            
            // Close the keyboard popup after sending the message
            if (keyboardPopup) {
                keyboardPopup.classList.remove('active');
            }
            
            // Simulate reply after 1 second
            setTimeout(() => {
                addMessage('Got your message!', 'received');
            }, 1000);
        }
    }
    
    // Add event listeners for text transfer
    if (output) {
        output.addEventListener('dblclick', transferTextToInput);
    }
    
    // Add event listener for send button in keyboard
    const sendKeyboardBtn = getElement('sendKeyboardBtn');
    if (sendKeyboardBtn) {
        sendKeyboardBtn.addEventListener('click', sendTextFromKeyboard);
    }
    
    // Tab switching functionality
    if (stenographTab && fullKeyboardTab && symbolsTab) {
        stenographTab.addEventListener('click', () => {
            if (!stenographKeyboard || !fullKeyboard || !symbolsKeyboard) return;
            
            stenographTab.classList.add('active');
            fullKeyboardTab.classList.remove('active');
            symbolsTab.classList.remove('active');
            stenographKeyboard.style.display = 'grid';
            fullKeyboard.style.display = 'none';
            symbolsKeyboard.style.display = 'none';
            activeKeyboard = 'stenograph';
        });
        
        fullKeyboardTab.addEventListener('click', () => {
            if (!stenographKeyboard || !fullKeyboard || !symbolsKeyboard) return;
            
            fullKeyboardTab.classList.add('active');
            stenographTab.classList.remove('active');
            symbolsTab.classList.remove('active');
            fullKeyboard.style.display = 'grid';
            stenographKeyboard.style.display = 'none';
            symbolsKeyboard.style.display = 'none';
            activeKeyboard = 'full';
        });
        
        symbolsTab.addEventListener('click', () => {
            if (!stenographKeyboard || !fullKeyboard || !symbolsKeyboard) return;
            
            symbolsTab.classList.add('active');
            stenographTab.classList.remove('active');
            fullKeyboardTab.classList.remove('active');
            symbolsKeyboard.style.display = 'grid';
            stenographKeyboard.style.display = 'none';
            fullKeyboard.style.display = 'none';
            activeKeyboard = 'symbols';
        });
    }
    
    // Info panel toggle
    if (infoToggle && infoPanel) {
        infoToggle.addEventListener('click', () => {
            if (infoPanel.style.display === 'none') {
                infoPanel.style.display = 'block';
            } else {
                infoPanel.style.display = 'none';
            }
        });
    }
    
    // Function to update the keyboard and suggestions based on selected keys
    function updateKeyboard() {
        if (!stenographKeyboard) return;
        
        // Clear active states
        const keys = stenographKeyboard.querySelectorAll('.key');
        keys.forEach(key => {
            if (!key) return;
            
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
        if (!suggestions) return;
        
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
            words = [directWord, ...words.filter(w => w !== directWord)];
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
        if (!output) return;
        
        const currentText = output.value;
        if (currentText.length > 0 && !currentText.endsWith(' ') && !currentText.endsWith('\n')) {
            output.value += ' ' + word;
        } else {
            output.value += word;
        }
    }
    
    function clearSelectedKeys() {
        selectedKeys = [];
        
        if (!stenographKeyboard) return;
        
        // Reset any double-tapped keys to primary state
        const keys = stenographKeyboard.querySelectorAll('.key');
        keys.forEach(key => {
            if (key) {
                key.classList.remove('double-tapped');
            }
        });
        updateKeyboard();
    }
    
    // Function to toggle between primary and secondary modes
    function toggleKeyboardMode() {
        isSecondaryMode = !isSecondaryMode;
        
        // Update keyboard appearance to reflect the current mode
        if (stenographKeyboard) {
            stenographKeyboard.classList.toggle('secondary-mode', isSecondaryMode);
        }
        if (fullKeyboard) {
            fullKeyboard.classList.toggle('secondary-mode', isSecondaryMode);
        }
        if (symbolsKeyboard) {
            symbolsKeyboard.classList.toggle('secondary-mode', isSecondaryMode);
        }
        
        // Update toggle button appearance
        const toggleButtons = document.querySelectorAll('.control-btn.toggle');
        toggleButtons.forEach(btn => {
            if (btn) {
                btn.classList.toggle('secondary-mode', isSecondaryMode);
            }
        });
        
        // Remove all double-tapped classes as they're no longer needed
        const allKeys = document.querySelectorAll('.key');
        allKeys.forEach(key => {
            if (key) {
                key.classList.remove('double-tapped');
            }
        });
    }
    
    // Add event listener for the toggle button (all toggle buttons in the interface)
    document.querySelectorAll('.control-btn.toggle').forEach(btn => {
        if (btn) {
            btn.addEventListener('click', toggleKeyboardMode);
        }
    });
    
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
    if (stenographKeyboard) {
        stenographKeyboard.addEventListener('click', event => {
            const key = event.target.closest('.key');
            if (!key) return;
            
            const primaryKey = key.dataset.primary;
            const secondaryKey = key.dataset.secondary;
            
            // Add either primary or secondary key based on current mode
            if (isSecondaryMode) {
                if (secondaryKey) {
                    addKeySelection(secondaryKey);
                }
            } else {
                if (primaryKey) {
                    addKeySelection(primaryKey);
                }
            }
            
            updateKeyboard();
        });
    }
    
    // Full keyboard functionality
    if (fullKeyboard) {
        fullKeyboard.addEventListener('click', event => {
            const key = event.target.closest('.key');
            if (!key || !output) return;
            
            const charValue = key.dataset.char;
            if (!charValue) return;
            
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
    }
    
    // Symbols keyboard functionality
    if (symbolsKeyboard) {
        symbolsKeyboard.addEventListener('click', event => {
            const key = event.target.closest('.key');
            if (!key) return;
            
            const primaryKey = key.dataset.primary;
            const secondaryKey = key.dataset.secondary;
            
            // Add either primary or secondary key based on current mode
            if (isSecondaryMode) {
                if (secondaryKey) {
                    addKeySelection(secondaryKey);
                }
            } else {
                if (primaryKey) {
                    addKeySelection(primaryKey);
                }
            }
            
            updateKeyboard();
        });
    }
    
    // Control button handlers
    if (enterBtn && output) {
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
    }
    
    if (backspaceBtn) {
        backspaceBtn.addEventListener('click', () => {
            if (!output) return;
            
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
    }
    
    if (wordDeleteBtn && output) {
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
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSelectedKeys);
    }
    
    // Keyboard input support
    document.addEventListener('keydown', (e) => {
        if (!output) return;
        
        // If popup is not active, don't process keyboard input
        if (keyboardPopup && !keyboardPopup.classList.contains('active')) {
            return;
        }
        
        if (e.key === 'Backspace') {
            if (selectedKeys.length > 0) {
                selectedKeys.pop();
                updateKeyboard();
            } else {
                const text = output.value;
                if (text.length > 0) {
                    output.value = text.substring(0, text.length - 1);
                }
            }
            e.preventDefault();
        } else if (e.key === 'Enter') {
            if (selectedKeys.length > 0) {
                const directWord = selectedKeys.join('').toLowerCase();
                appendWord(directWord);
                clearSelectedKeys();
            } else {
                output.value += '\n';
            }
            e.preventDefault();
        } else if (e.key === ' ') {
            if (selectedKeys.length > 0) {
                const directWord = selectedKeys.join('').toLowerCase();
                appendWord(directWord);
                clearSelectedKeys();
            } else {
                output.value += ' ';
            }
            e.preventDefault();
        } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
            addKeySelection(e.key.toUpperCase());
            updateKeyboard();
            e.preventDefault();
        }
    });
    
    // Initialize
    updateKeyboard();
});