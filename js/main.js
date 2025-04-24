document.addEventListener('DOMContentLoaded', function() {
    // Debug toggle and logging function
    const DEBUG = false; // Set to true to enable debugging

    function log(...args) {
        if (DEBUG) console.log('[Stenograph Keyboard]', ...args);
    }
    
    // First check if the elements exist
    checkElements();
    
    // Set number of suggestions to show
    let maxSuggestions = 3; // Configurable number of suggestions to display
    
    // Add dictionary debugging
    function checkDictionary() {
        if (typeof dictionary === 'undefined') {
            console.error('Dictionary is not defined');
            return;
        }
        
        log('Dictionary type:', typeof dictionary);
        log('Dictionary keys count:', Object.keys(dictionary).length);
        log('Sample dictionary entries:');
        
        // Print first 5 entries
        let count = 0;
        for (const key in dictionary) {
            if (count < 5) {
                log(`  "${key}": ${JSON.stringify(dictionary[key])}`);
                count++;
            } else {
                break;
            }
        }
        
        // Check if specific keys exist
        const keysToCheck = ['BO', 'A', 'DE', 'HET', 'VAN'];
        keysToCheck.forEach(key => {
            log(`'${key}' exists in dictionary:`, key in dictionary);
            if (key in dictionary) {
                log(`Value for '${key}':`, dictionary[key]);
            }
        });
    }
    
    // Check style of suggestions
    function checkSuggestionsStyle() {
        const sugg = document.getElementById('suggestions');
        if (!sugg) {
            console.error('Suggestions element not found');
            return;
        }
        
        const style = window.getComputedStyle(sugg);
        log('Suggestions element styles:');
        log('  Display:', style.display);
        log('  Visibility:', style.visibility);
        log('  Height:', style.height);
        log('  Width:', style.width);
        
        // Force display to be block or flex
        sugg.style.display = 'flex';
        sugg.style.visibility = 'visible';
    }
    
    // Call our diagnostic functions
    checkDictionary();
    setTimeout(checkSuggestionsStyle, 500);
    
    // Make sure the dictionary is defined before proceeding
    if (typeof dictionary === 'undefined') {
        console.error('Error: Dictionary is not defined. Please check that dictionary.js is loaded before main.js');
        
        // Create a fallback dictionary to prevent errors
        window.dictionary = {
            'TEST': ['test', 'testing'],
            'BO': ['boven', 'boot', 'boom']  // Test case
        };
    } else {
        log('Dictionary loaded successfully with ' + Object.keys(dictionary).length + ' entries');
        
        // Make sure the dictionary is available globally
        window.dictionary = dictionary;
    }
    
    // Safely get DOM elements with null checks
    const getElement = (id) => {
        const element = document.getElementById(id);
        if (!element) console.warn(`Element with id "${id}" not found`);
        return element;
    };
    
    // Random response messages
    const responseMessages = [
        "Wat een gaaf toetsenbord zeg!",
        "Nice bericht! Bevalt het nieuwe keyboard een beetje?",
        "Zie dat je het nieuwe keyboard gebruikt. Super handig, toch?",
        "Bericht binnen! Het keyboard werkt blijkbaar top!",
        "Thanks voor je bericht! Dit keyboard is echt next-level.",
        "Bericht gezien! Hoe bevalt het nieuwe systeem?",
        "Chill hoe je dit keyboard gebruikt. Mega efficiënt!",
        "Got it! Dit keyboard is best verslavend, of niet soms?",
        "Interessant bericht! Deze tech is echt uniek.",
        "Top! Ben echt impressed hoe smooth dit keyboard werkt."
    ];
    
    // Get a random response message
    function getRandomResponse() {
        const randomIndex = Math.floor(Math.random() * responseMessages.length);
        return responseMessages[randomIndex];
    }
    
    // Get all required elements
    const elements = {
        stenographKeyboard: getElement('stenographKeyboard'),
        symbolsKeyboard: getElement('symbolsKeyboard'),
        suggestions: getElement('suggestions'),
        output: getElement('output'),
        enterBtn: getElement('enterBtn'),
        backspaceBtn: getElement('backspaceBtn'),
        clearBtn: getElement('clearBtn'),
        wordDeleteBtn: getElement('wordDeleteBtn'),
        stenographTab: getElement('stenographTab'),
        symbolsTab: getElement('symbolsTab'),
        infoToggle: getElement('infoToggle'),
        infoPanel: getElement('infoPanel'),
        keyboardToggleBtn: getElement('keyboardToggleBtn'),
        keyboardPopup: getElement('keyboardPopup'),
        keyboardHandle: getElement('keyboardHandle'), // Make sure this is defined
        chatContainer: getElement('chatContainer'),
        messageInput: getElement('messageInput'),
        sendBtn: getElement('sendBtn'),
        closeKeyboardBtn: getElement('closeKeyboardBtn'),
        sendKeyboardBtn: getElement('sendKeyboardBtn')
    };
    
    const popupToggleBtn = document.querySelector('.keyboard-toggle-btn');
    
    let selectedKeys = [];
    let activeKeyboard = 'stenograph';
    let keyboardMode = 0; // 0 = primary, 1 = secondary, 2 = tertiary
    let touchStartY = 0;
    let touchCurrentY = 0;
    
    // Core functions
    function toggleKeyboardPopup(show) {
        if (!elements.keyboardPopup) return;
        
        if (show === undefined) {
            elements.keyboardPopup.classList.toggle('active');
        } else if (show) {
            elements.keyboardPopup.classList.add('active');
        } else {
            elements.keyboardPopup.classList.remove('active');
        }
    }
    
    function switchKeyboardTab(targetTab) {
        const keyboards = {
            'stenograph': elements.stenographKeyboard,
            'symbols': elements.symbolsKeyboard
        };
        
        const tabs = {
            'stenograph': elements.stenographTab,
            'symbols': elements.symbolsTab
        };
        
        // Hide all keyboards and deactivate all tabs
        Object.values(keyboards).forEach(kb => { if (kb) kb.style.display = 'none'; });
        Object.values(tabs).forEach(tab => { if (tab) tab.classList.remove('active'); });
        
        // Show the selected keyboard and activate its tab
        if (keyboards[targetTab]) keyboards[targetTab].style.display = 'grid';
        if (tabs[targetTab]) tabs[targetTab].classList.add('active');
        activeKeyboard = targetTab;
    }
    
    function addMessage(text, type) {
        if (!elements.chatContainer || !text.trim()) return;
        
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        elements.chatContainer.appendChild(messageDiv);
        elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
    }
    
    function updateKeyboard() {
        if (!elements.stenographKeyboard) return;
        
        elements.stenographKeyboard.querySelectorAll('.key').forEach(key => {
            if (!key) return;
            
            const primaryKey = key.dataset.primary;
            const secondaryKey = key.dataset.secondary;
            const tertiaryKey = key.dataset.tertiary;
            
            key.classList.toggle('primary-selected', selectedKeys.includes(primaryKey));
            key.classList.toggle('secondary-selected', selectedKeys.includes(secondaryKey));
            key.classList.toggle('tertiary-selected', selectedKeys.includes(tertiaryKey));
        });
        
        updateSuggestions();
    }
    
    function updateSuggestions() {
        if (!elements.suggestions) {
            console.error('Suggestions element is missing');
            return;
        }
        
        log('Running updateSuggestions()');
        log('Current selectedKeys:', selectedKeys);
        
        // Clear existing suggestions
        elements.suggestions.innerHTML = '';
        
        // Exit if no keys selected
        if (selectedKeys.length === 0) {
            log('No keys selected, exiting updateSuggestions');
            return;
        }
        
        // Ensure dictionary is defined and using window.dictionary for global access
        const dict = window.dictionary || {};
        log('Dictionary available with entries:', Object.keys(dict).length);
        
        // Get the sequence of keys
        const rawSequence = selectedKeys.join('');
        log('Raw sequence formed:', rawSequence);
        
        // Try different case formats for exact matches
        let words = [];
        
        // Try exact match (case sensitive)
        if (dict[rawSequence]) {
            log(`Found exact match for "${rawSequence}":`, dict[rawSequence]);
            words = [...dict[rawSequence]];
        } 
        // Try uppercase
        else if (dict[rawSequence.toUpperCase()]) {
            log(`Found uppercase match for "${rawSequence.toUpperCase()}":`, dict[rawSequence.toUpperCase()]);
            words = [...dict[rawSequence.toUpperCase()]];
        }
        // Try lowercase
        else if (dict[rawSequence.toLowerCase()]) {
            log(`Found lowercase match for "${rawSequence.toLowerCase()}":`, dict[rawSequence.toLowerCase()]);
            words = [...dict[rawSequence.toLowerCase()]];
        }
        
        log('Matches after key lookup:', words);
        
        // For partial matches if no exact match found
        if (words.length === 0) {
            log('No exact case matches, checking pattern matches');
            
            try {
                // Create a regex pattern to match our sequence
                const pattern = new RegExp(rawSequence, 'i');
                log('Using regex pattern:', pattern);
                
                Object.entries(dict).forEach(([combo, wordList]) => {
                    // Check if the combo contains our pattern
                    if (pattern.test(combo)) {
                        log(`Combo "${combo}" matches pattern "${pattern}", adding:`, wordList);
                        words = [...words, ...wordList];
                    }
                });
                
                // Also check if our keys are a subset of any combo
                const uniqueKeys = [...new Set(selectedKeys)];
                log('Checking if unique keys are subset of combos:', uniqueKeys);
                
                Object.entries(dict).forEach(([combo, wordList]) => {
                    const comboChars = combo.split('');
                    const isSubset = uniqueKeys.every(key => 
                        comboChars.includes(key) || 
                        comboChars.includes(key.toUpperCase()) || 
                        comboChars.includes(key.toLowerCase())
                    );
                    
                    if (isSubset) {
                        log(`Keys are subset of "${combo}", adding words:`, wordList);
                        // Don't add duplicates
                        wordList.forEach(word => {
                            if (!words.includes(word)) {
                                words.push(word);
                            }
                        });
                    }
                });
            } catch (error) {
                console.error('Error in pattern matching:', error);
            }
        }
        
        // Add the direct word formed by the keys in sequence
        const directWord = rawSequence.toLowerCase();
        if (directWord.length > 0) {
            // Only add if not already in the list
            if (!words.includes(directWord)) {
                log(`Adding direct word: "${directWord}"`);
                words = [directWord, ...words];
            }
        }
        
        // Limit to configured number of suggestions
        words = words.slice(0, maxSuggestions);
        log(`Final suggestions (limited to ${maxSuggestions}):`, words);
        
        if (words.length === 0) {
            log('No suggestions found');
            return;
        }
        
        // Create suggestion elements
        words.forEach(word => {
            log(`Creating suggestion element for: "${word}"`);
            const suggElement = document.createElement('div');
            suggElement.className = 'suggestion';
            suggElement.textContent = word;
            suggElement.addEventListener('click', () => {
                appendWord(word);
                clearSelectedKeys();
            });
            elements.suggestions.appendChild(suggElement);
        });
        
        // Make sure suggestions are visible
        elements.suggestions.style.display = 'flex';
        elements.suggestions.style.visibility = 'visible';
    }

    function checkElements() {
        log('Checking DOM elements:');
        const elementsToCheck = [
            'stenographKeyboard', 'symbolsKeyboard', 'suggestions', 
            'output', 'enterBtn', 'backspaceBtn'
        ];
        
        elementsToCheck.forEach(id => {
            const el = document.getElementById(id);
            log(`${id} element exists: ${el !== null}`);
        });
    }
    
    function appendWord(word) {
        if (!elements.output) return;
        
        const currentText = elements.output.value;
        const needsSpace = currentText.length > 0 && 
                          !currentText.endsWith(' ') && 
                          !currentText.endsWith('\n');
        
        elements.output.value += needsSpace ? ` ${word}` : word;
    }
    
    function clearSelectedKeys() {
        selectedKeys = [];
        
        // Remove multi-press visual indicators
        if (elements.stenographKeyboard) {
            elements.stenographKeyboard.querySelectorAll('.key').forEach(key => {
                if (key) {
                    key.classList.remove('double-tapped', 'multi-pressed');
                    key.removeAttribute('data-press-count');
                    key.querySelectorAll('.press-count').forEach(el => el.remove());
                }
            });
        }
        
        if (elements.symbolsKeyboard) {
            elements.symbolsKeyboard.querySelectorAll('.key').forEach(key => {
                if (key) {
                    key.classList.remove('double-tapped', 'multi-pressed');
                    key.removeAttribute('data-press-count');
                    key.querySelectorAll('.press-count').forEach(el => el.remove());
                }
            });
        }
        
        updateKeyboard();
    }
    
    function toggleKeyboardMode() {
        // Cycle through modes: primary (0) -> secondary (1) -> tertiary (2) -> primary (0)
        keyboardMode = (keyboardMode + 1) % 3;
        
        // Remove all mode classes
        ['stenographKeyboard', 'symbolsKeyboard'].forEach(kbName => {
            if (elements[kbName]) {
                elements[kbName].classList.remove('secondary-mode', 'tertiary-mode');
            }
        });
        
        // Update toggle buttons (remove all mode classes first)
        document.querySelectorAll('.control-btn.toggle').forEach(btn => {
            if (btn) btn.classList.remove('secondary-mode', 'tertiary-mode');
        });
        
        // Apply current mode class
        if (keyboardMode === 1) {
            // Secondary mode
            ['stenographKeyboard', 'symbolsKeyboard'].forEach(kbName => {
                if (elements[kbName]) elements[kbName].classList.add('secondary-mode');
            });
            document.querySelectorAll('.control-btn.toggle').forEach(btn => {
                if (btn) btn.classList.add('secondary-mode');
            });
        } else if (keyboardMode === 2) {
            // Tertiary mode
            ['stenographKeyboard', 'symbolsKeyboard'].forEach(kbName => {
                if (elements[kbName]) elements[kbName].classList.add('tertiary-mode');
            });
            document.querySelectorAll('.control-btn.toggle').forEach(btn => {
                if (btn) btn.classList.add('tertiary-mode');
            });
        }
        
        // Reset double-tapped state
        document.querySelectorAll('.key').forEach(key => {
            if (key) key.classList.remove('double-tapped');
        });
    }

    function addKeySelection(key) {
        if (!key) {
            console.warn('Attempted to add null/undefined key');
            return false;
        }
        
        log(`Adding key: "${key}"`);
        
        // Always add the key, allowing it to be repeated
        selectedKeys.push(key);
        log('Updated selectedKeys:', selectedKeys);
        return true; // Key was added
    }
    
    function handleKeyClick(key, isSymbolsKeyboard = false) {
        if (!key) {
            log('No key element found in click handler');
            return;
        }
        
        log('Key clicked:', key);
        
        // For stenograph or symbols keyboard
        const primaryKey = key.dataset.primary;
        const secondaryKey = key.dataset.secondary;
        const tertiaryKey = key.dataset.tertiary;
        
        log('Key data attributes:', { 
            primary: primaryKey, 
            secondary: secondaryKey, 
            tertiary: tertiaryKey 
        });
        log('Current keyboard mode:', keyboardMode);
        
        // Count how many times this key has been pressed
        let pressCount = 0;
        let keyAdded = false;
        
        // Select key based on current mode and add it
        if (keyboardMode === 0 && primaryKey) {
            // Primary mode
            keyAdded = addKeySelection(primaryKey);
            pressCount = selectedKeys.filter(k => k === primaryKey).length;
        } else if (keyboardMode === 1 && secondaryKey) {
            // Secondary mode
            keyAdded = addKeySelection(secondaryKey);
            pressCount = selectedKeys.filter(k => k === secondaryKey).length;
        } else if (keyboardMode === 2 && tertiaryKey) {
            // Tertiary mode
            keyAdded = addKeySelection(tertiaryKey);
            pressCount = selectedKeys.filter(k => k === tertiaryKey).length;
        }
        
        log('Key added:', keyAdded);
        log('Current selectedKeys:', selectedKeys);
        
        // Visual feedback for multiple presses
        if (pressCount > 1) {
            // Add a data attribute to show the press count
            key.setAttribute('data-press-count', pressCount);
            
            // Add a class to style multiple presses
            key.classList.add('multi-pressed');
            
            // We can add a temporary visual indication
            const indicator = document.createElement('div');
            indicator.className = 'press-count';
            indicator.textContent = pressCount;
            // Remove any existing indicators
            key.querySelectorAll('.press-count').forEach(el => el.remove());
            key.appendChild(indicator);
            
            // Remove the indicator after a delay
            setTimeout(() => {
                if (key.contains(indicator)) {
                    indicator.remove();
                }
            }, 1000);
        }
        
        updateKeyboard();
    }

    function handleTextTransfer(toInput) {
        if (!elements.output) return;
        
        const text = elements.output.value.trim();
        if (!text) return;
        
        if (toInput && elements.messageInput) {
            // Transfer to WhatsApp input
            elements.messageInput.value += text;
        } else {
            // Send directly to chat
            addMessage(text, 'sent');
            
            // Simulate reply with random response
            setTimeout(() => {
                addMessage(getRandomResponse(), 'received');
            }, 1000);
        }
        
        // Clear output and hide keyboard
        elements.output.value = '';
        clearSelectedKeys();
        toggleKeyboardPopup(false);
    }
    
    function deleteLastWord() {
        if (!elements.output) return;
        
        const text = elements.output.value;
        if (text.length === 0) return;
        
        const lastSpaceIndex = text.lastIndexOf(' ');
        const lastNewlineIndex = text.lastIndexOf('\n');
        const lastIndex = Math.max(lastSpaceIndex, lastNewlineIndex);
        
        if (lastIndex === -1) {
            // No spaces or newlines, clear all
            elements.output.value = '';
        } else if (lastIndex + 1 < text.length) {
            // Delete the partial word after the delimiter
            elements.output.value = text.substring(0, lastIndex + 1);
        } else {
            // Find previous word
            const textBefore = text.substring(0, lastIndex);
            const prevLastIndex = Math.max(textBefore.lastIndexOf(' '), textBefore.lastIndexOf('\n'));
            
            elements.output.value = prevLastIndex === -1 ? '' : text.substring(0, prevLastIndex + 1);
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Popup toggle
        if (popupToggleBtn) {
            popupToggleBtn.addEventListener('click', () => toggleKeyboardPopup());
        }
        
        // Close button
        if (elements.closeKeyboardBtn) {
            elements.closeKeyboardBtn.addEventListener('click', () => toggleKeyboardPopup(false));
        }
        
        // Drag to close
        if (elements.keyboardHandle && elements.keyboardPopup) {
            // Touch events
            elements.keyboardHandle.addEventListener('touchstart', e => {
                touchStartY = e.touches[0].clientY;
            });
            
            elements.keyboardHandle.addEventListener('touchmove', e => {
                touchCurrentY = e.touches[0].clientY;
                const diffY = touchCurrentY - touchStartY;
                
                if (diffY > 0) {
                    elements.keyboardPopup.style.transform = `translateY(${diffY}px)`;
                }
            });
            
            elements.keyboardHandle.addEventListener('touchend', () => {
                const diffY = touchCurrentY - touchStartY;
                
                if (diffY > 100) {
                    toggleKeyboardPopup(false);
                }
                
                elements.keyboardPopup.style.transform = '';
                touchStartY = touchCurrentY = 0;
            });
            
            // Mouse events
            elements.keyboardHandle.addEventListener('mousedown', e => {
                e.preventDefault();
                const startY = e.clientY;
                
                const mouseMove = e => {
                    const diffY = e.clientY - startY;
                    if (diffY > 0) {
                        elements.keyboardPopup.style.transform = `translateY(${diffY}px)`;
                    }
                };
                
                const mouseUp = e => {
                    if (e.clientY - startY > 100) {
                        toggleKeyboardPopup(false);
                    }
                    
                    elements.keyboardPopup.style.transform = '';
                    document.removeEventListener('mousemove', mouseMove);
                    document.removeEventListener('mouseup', mouseUp);
                };
                
                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('mouseup', mouseUp);
            });
        }
        
        // Tab switching (only stenograph and symbols tabs remain)
        if (elements.stenographTab) {
            elements.stenographTab.addEventListener('click', () => switchKeyboardTab('stenograph'));
        }
        
        if (elements.symbolsTab) {
            elements.symbolsTab.addEventListener('click', () => switchKeyboardTab('symbols'));
        }
        
        // Outside click and propagation
        document.addEventListener('click', e => {
            if (elements.keyboardPopup && 
                elements.keyboardPopup.classList.contains('active') && 
                !elements.keyboardPopup.contains(e.target) && 
                e.target !== popupToggleBtn) {
                toggleKeyboardPopup(false);
            }
        });
        
        if (elements.keyboardPopup) {
            elements.keyboardPopup.addEventListener('click', e => e.stopPropagation());
        }
        
        // Info panel toggle
        if (elements.infoToggle && elements.infoPanel) {
            elements.infoToggle.addEventListener('click', () => {
                elements.infoPanel.style.display = 
                    elements.infoPanel.style.display === 'none' ? 'block' : 'none';
            });
        }
        
        // Text transfer
        if (elements.output) {
            elements.output.addEventListener('dblclick', () => handleTextTransfer(true));
        }
        
        // Send buttons
        if (elements.sendKeyboardBtn) {
            elements.sendKeyboardBtn.addEventListener('click', () => handleTextTransfer(false));
        }
        
        if (elements.sendBtn && elements.messageInput) {
            elements.sendBtn.addEventListener('click', () => {
                const message = elements.messageInput.value.trim();
                if (message) {
                    addMessage(message, 'sent');
                    elements.messageInput.value = '';
                    
                    // Send random response message
                    setTimeout(() => {
                        addMessage(getRandomResponse(), 'received');
                    }, 1000);
                }
            });
        }
        
        // Keyboard events
        if (elements.stenographKeyboard) {
            elements.stenographKeyboard.addEventListener('click', event => {
                handleKeyClick(event.target.closest('.key'));
            });
        }
        
        if (elements.symbolsKeyboard) {
            elements.symbolsKeyboard.addEventListener('click', event => {
                handleKeyClick(event.target.closest('.key'), true);
            });
        }
        
        // Control buttons
        if (elements.enterBtn && elements.output) {
            elements.enterBtn.addEventListener('click', () => {
                if (selectedKeys.length > 0) {
                    appendWord(selectedKeys.join('').toLowerCase());
                    clearSelectedKeys();
                } else {
                    elements.output.value += '\n';
                }
            });
        }
        
        if (elements.backspaceBtn && elements.output) {
            elements.backspaceBtn.addEventListener('click', () => {
                if (selectedKeys.length > 0) {
                    selectedKeys.pop();
                    updateKeyboard();
                } else {
                    const text = elements.output.value;
                    if (text.length > 0) {
                        elements.output.value = text.substring(0, text.length - 1);
                    }
                }
            });
        }
        
        if (elements.wordDeleteBtn) {
            elements.wordDeleteBtn.addEventListener('click', deleteLastWord);
        }
        
        if (elements.clearBtn) {
            elements.clearBtn.addEventListener('click', clearSelectedKeys);
        }
        
        // Toggle mode buttons
        document.querySelectorAll('.control-btn.toggle').forEach(btn => {
            if (btn) btn.addEventListener('click', toggleKeyboardMode);
        });
        
        // Physical keyboard support
        document.addEventListener('keydown', e => {
            if (!elements.output || 
                (elements.keyboardPopup && !elements.keyboardPopup.classList.contains('active'))) {
                return;
            }
            
            if (e.key === 'Backspace') {
                if (selectedKeys.length > 0) {
                    selectedKeys.pop();
                    updateKeyboard();
                } else {
                    const text = elements.output.value;
                    if (text.length > 0) {
                        elements.output.value = text.substring(0, text.length - 1);
                    }
                }
                e.preventDefault();
            } else if (e.key === 'Enter') {
                if (selectedKeys.length > 0) {
                    appendWord(selectedKeys.join('').toLowerCase());
                    clearSelectedKeys();
                } else {
                    elements.output.value += '\n';
                }
                e.preventDefault();
            } else if (e.key === ' ') {
                if (selectedKeys.length > 0) {
                    appendWord(selectedKeys.join('').toLowerCase());
                    clearSelectedKeys();
                } else {
                    elements.output.value += ' ';
                }
                e.preventDefault();
            } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
                addKeySelection(e.key.toUpperCase());
                updateKeyboard();
                e.preventDefault();
            }
        });
    }
    
    // Initialize
    setupEventListeners();
    updateKeyboard();
    switchKeyboardTab('stenograph');
});