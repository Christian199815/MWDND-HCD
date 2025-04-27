// Dutch Stenograph Keyboard with OpenTaal wordlist integration
// This version loads both popular words and the full wordlist

document.addEventListener('DOMContentLoaded', function() {
    // Debug toggle and logging function
    const DEBUG = true; // Set to true to enable debugging

    function log(...args) {
        if (DEBUG) console.log('[Stenograph Keyboard]', ...args);
    }
    
    // First check if elements exist
    checkElements();
    
    // Set number of suggestions to show
    let maxSuggestions = 3; // Configurable number of suggestions to display
    
    // Cache to store word suggestion results
    const wordCache = new Map();
    
    // Dutch word indices for efficient lookups
    let popularWordIndex = {}; // For most-popular.txt
    let dutchWordIndex = {};   // For the full wordlist.txt
    let isPopularWordsLoaded = false;
    let isFullWordlistLoaded = false;
    let loadingWordlist = false;
    
    // ====== LOAD WORD LISTS ======
    async function loadWordlists() {
        if (loadingWordlist) return;
        
        loadingWordlist = true;
        log('Loading word lists...');
        
        try {
            // First load popular words
            log('Loading popular words...');
            const popularResponse = await fetch('./most-popular.txt');
            if (popularResponse.ok) {
                const popularText = await popularResponse.text();
                processPopularWords(popularText);
                log('Popular words loaded and processed successfully!');
                isPopularWordsLoaded = true;
            } else {
                log('Failed to load popular words, status:', popularResponse.status);
            }
            
            // Then load the full wordlist
            log('Loading full wordlist...');
            const fullResponse = await fetch('./wordlist.txt');
            if (fullResponse.ok) {
                const fullText = await fullResponse.text();
                processFullWordlist(fullText);
                log('Full wordlist loaded and processed successfully!');
                isFullWordlistLoaded = true;
            } else {
                log('Failed to load full wordlist, status:', fullResponse.status);
            }
            
            // Force update suggestions if keys are selected
            if (selectedKeys.length > 0) {
                updateSuggestions();
            }
        } catch (error) {
            console.error('Error loading wordlists:', error);
            log('Falling back to built-in dictionary');
        } finally {
            loadingWordlist = false;
        }
    }
    
    // Process popular words into an indexed structure
    function processPopularWords(text) {
        log('Processing popular words...');
        
        // Split text into lines/words
        const words = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        log(`Found ${words.length} popular Dutch words`);
        
        // Create indexes for efficient lookup
        popularWordIndex = {};
        
        words.forEach(word => {
            // Index by first 1-3 characters for quick lookup
            for (let i = 1; i <= Math.min(3, word.length); i++) {
                const prefix = word.substring(0, i).toLowerCase();
                
                if (!popularWordIndex[prefix]) {
                    popularWordIndex[prefix] = [];
                }
                
                // Add to this prefix's word list if not already there
                if (!popularWordIndex[prefix].includes(word)) {
                    popularWordIndex[prefix].push(word);
                }
            }
        });
        
        log(`Created popular word index with ${Object.keys(popularWordIndex).length} prefixes`);
    }
    
    // Process full wordlist into an indexed structure
    function processFullWordlist(text) {
        log('Processing full wordlist...');
        
        // Split text into lines/words
        const words = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        log(`Found ${words.length} Dutch words in full wordlist`);
        
        // Create indexes for efficient lookup
        dutchWordIndex = {};
        
        words.forEach(word => {
            // Index by first 1-3 characters for quick lookup
            for (let i = 1; i <= Math.min(3, word.length); i++) {
                const prefix = word.substring(0, i).toLowerCase();
                
                if (!dutchWordIndex[prefix]) {
                    dutchWordIndex[prefix] = [];
                }
                
                // Limit words per prefix to avoid too many matches (skip if already in popular words)
                if (dutchWordIndex[prefix].length < 20 && 
                    !dutchWordIndex[prefix].includes(word) &&
                    !(popularWordIndex[prefix] && popularWordIndex[prefix].includes(word))) {
                    dutchWordIndex[prefix].push(word);
                }
            }
        });
        
        log(`Created full wordlist index with ${Object.keys(dutchWordIndex).length} prefixes`);
    }
    
    // Start loading wordlists, but don't wait for them
    loadWordlists();
    
    // ====== FALLBACK DICTIONARY ======
    // Minimal Dutch dictionary for offline fallback
    const fallbackDictionary = {
        // Common single letters
        'A': ['aan', 'af', 'al'],
        'B': ['bij', 'ben', 'buiten'],
        'C': ['centrum', 'contact'],
        'D': ['de', 'dat', 'dan', 'dit'],
        'E': ['een', 'en', 'er'],
        'F': ['familie', 'functie'],
        'G': ['gaan', 'goed', 'groot'],
        'H': ['het', 'hebben', 'huis'],
        'I': ['ik', 'in', 'is'],
        'J': ['ja', 'jaar', 'jij'],
        'K': ['kan', 'komen', 'kind'],
        'L': ['laten', 'leven', 'land'],
        'M': ['met', 'maar', 'maken'],
        'N': ['naar', 'niet', 'nu'],
        'O': ['om', 'ook', 'over'],
        'P': ['plan', 'plaats'],
        'R': ['recht', 'rond'],
        'S': ['zijn', 'zal', 'zo'],
        'T': ['te', 'tot', 'tijd'],
        'U': ['uit', 'uur', 'uw'],
        'V': ['van', 'voor', 'veel'],
        'W': ['wat', 'wie', 'weer'],
        'Z': ['zeer', 'zien', 'zoals'],
        
        // Common combinations
        'AA': ['aan', 'aarde', 'aantal'],
        'BE': ['ben', 'beter', 'bedrag'],
        'DA': ['dag', 'data', 'daar'],
        'DE': ['deze', 'denken', 'deel'],
        'EE': ['een', 'eerst', 'eerder'],
        'EN': ['en', 'echt', 'enkel'],
        'ER': ['er', 'eerst', 'erbij'],
        'GE': ['geen', 'geven', 'geld'],
        'GO': ['goed', 'goud', 'god'],
        'HE': ['het', 'heel', 'help'],
        'IN': ['in', 'info', 'intern'],
        'IS': ['is', 'isbn', 'islam'],
        'KA': ['kan', 'kaart', 'kamer'],
        'KO': ['komen', 'kopen', 'koers'],
        'LA': ['laten', 'laatst', 'lage'],
        'ME': ['met', 'meer', 'mee'],
        'NA': ['naar', 'naast', 'naam'],
        'NI': ['niet', 'nieuw', 'niveau'],
        'OM': ['om', 'omdat', 'omhoog'],
        'ON': ['onder', 'online', 'onze'],
        'OP': ['op', 'open', 'optie'],
        'OV': ['over', 'overal', 'oven'],
        'TE': ['te', 'tegen', 'tekst'],
        'UI': ['uit', 'uien', 'uitleg'],
        'VA': ['van', 'vader', 'vaak'],
        'VE': ['veel', 'verder', 'werk'],
        'VO': ['voor', 'vol', 'vogel'],
        'WA': ['wat', 'water', 'was'],
        'WE': ['we', 'werk', 'week'],
        'WO': ['wonen', 'woord', 'worden'],
        'ZA': ['zaken', 'zag', 'zal'],
        'ZE': ['ze', 'zeer', 'zelf'],
        'ZI': ['zij', 'zien', 'zijn'],
        'ZO': ['zo', 'zoals', 'zoek']
    };
    
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
    setTimeout(checkSuggestionsStyle, 500);
    
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
        keyboardHandle: getElement('keyboardHandle'), 
        chatContainer: getElement('chatContainer'),
        messageInput: getElement('messageInput'),
        sendBtn: getElement('sendBtn'),
        closeKeyboardBtn: getElement('closeKeyboardBtn'),
        sendKeyboardBtn: getElement('sendKeyboardBtn'),
        wordlistStatus: getElement('wordlistStatus')
    };
    
    const popupToggleBtn = document.querySelector('.keyboard-toggle-btn');
    
    let selectedKeys = [];
    let activeKeyboard = 'stenograph';
    let keyboardMode = 0; // 0 = primary, 1 = secondary, 2 = tertiary
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isOnline = navigator.onLine;
    
    // Track online status
    window.addEventListener('online', () => { isOnline = true; });
    window.addEventListener('offline', () => { isOnline = false; });
    
    // Get suggestions from wordlists (popular first, then full)
    function getWordlistSuggestions(keySequence) {
        if (!isPopularWordsLoaded && !isFullWordlistLoaded) {
            return null; // Indicate wordlists not available
        }
        
        const seq = keySequence.toLowerCase();
        
        // Always start with direct word
        const results = [seq];
        
        // First check popular words
        if (isPopularWordsLoaded) {
            // Try exact prefix match in popular words
            if (popularWordIndex[seq]) {
                popularWordIndex[seq].forEach(word => {
                    if (!results.includes(word)) {
                        results.push(word);
                    }
                });
            }
            
            // Try each letter as a starting point in popular words
            for (let i = 0; i < seq.length; i++) {
                const prefix = seq.substring(i, Math.min(i + 3, seq.length));
                if (prefix.length > 0 && popularWordIndex[prefix]) {
                    // Add some matching words, prioritize those that start with our sequence
                    popularWordIndex[prefix]
                        .filter(word => word.startsWith(seq))
                        .forEach(word => {
                            if (!results.includes(word)) {
                                results.push(word);
                            }
                        });
                }
            }
        }
        
        // If we still need more suggestions, try the full wordlist
        if (results.length < maxSuggestions && isFullWordlistLoaded) {
            // Try exact prefix match in full wordlist
            if (dutchWordIndex[seq]) {
                dutchWordIndex[seq].forEach(word => {
                    if (!results.includes(word)) {
                        results.push(word);
                    }
                });
            }
            
            // Try each letter as a starting point in full wordlist
            for (let i = 0; i < seq.length && results.length < maxSuggestions + 2; i++) {
                const prefix = seq.substring(i, Math.min(i + 3, seq.length));
                if (prefix.length > 0 && dutchWordIndex[prefix]) {
                    // Add some matching words, prioritize those that start with our sequence
                    dutchWordIndex[prefix]
                        .filter(word => word.startsWith(seq))
                        .forEach(word => {
                            if (!results.includes(word)) {
                                results.push(word);
                            }
                        });
                }
            }
        }
        
        return results.slice(0, maxSuggestions);
    }
    
    // Function to get word suggestions
    async function fetchSuggestions(keySequence) {
        if (!keySequence || keySequence.length === 0) {
            return [];
        }
        
        // Check cache first
        const cacheKey = keySequence.toLowerCase();
        if (wordCache.has(cacheKey)) {
            log('Returning cached result for', cacheKey);
            return wordCache.get(cacheKey);
        }
        
        log('Finding suggestions for:', keySequence);
        
        // Always include the direct word formed by the keys
        const directWord = keySequence.toLowerCase();
        let results = [directWord];
        
        // Try to get suggestions from wordlists
        const wordlistResults = getWordlistSuggestions(keySequence);
        
        if (wordlistResults) {
            log('Using wordlist suggestions');
            results = wordlistResults;
        } else {
            // Wordlists not loaded yet, use fallback
            log('Wordlists not loaded, using fallback dictionary');
            const fallbackResults = getFallbackSuggestions(keySequence);
            results = fallbackResults;
            
            // Try to load wordlists if not already loading
            if (!loadingWordlist && !isPopularWordsLoaded && !isFullWordlistLoaded) {
                loadWordlists();
            }
        }
        
        // Cache the results
        wordCache.set(cacheKey, results);
        log('Final suggestions:', results);
        
        return results;
    }
    
    // Get suggestions from fallback dictionary
    function getFallbackSuggestions(keySequence) {
        const seq = keySequence.toUpperCase();
        
        // Start with the direct word
        const directWord = keySequence.toLowerCase();
        let results = [directWord];
        
        // Check the main fallback dictionary
        if (fallbackDictionary[seq]) {
            results = [...new Set([...results, ...fallbackDictionary[seq]])];
        }
        
        // Check dictionary with first letter
        const firstChar = seq.charAt(0);
        if (fallbackDictionary[firstChar]) {
            results = [...new Set([...results, ...fallbackDictionary[firstChar]])];
        }
        
        return results.slice(0, maxSuggestions);
    }
    
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
        
        if (elements.symbolsKeyboard) {
            elements.symbolsKeyboard.querySelectorAll('.key').forEach(key => {
                if (!key) return;
                
                const primaryKey = key.dataset.primary;
                const secondaryKey = key.dataset.secondary;
                const tertiaryKey = key.dataset.tertiary;
                
                key.classList.toggle('primary-selected', selectedKeys.includes(primaryKey));
                key.classList.toggle('secondary-selected', selectedKeys.includes(secondaryKey));
                key.classList.toggle('tertiary-selected', selectedKeys.includes(tertiaryKey));
            });
        }
        
        updateSuggestions();
    }
    
    async function updateSuggestions() {
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
        
        // Add loading indicator
        elements.suggestions.classList.add('loading');
        
        // Get the sequence of keys
        const rawSequence = selectedKeys.join('');
        log('Raw sequence formed:', rawSequence);
        
        // Try to get suggestions
        let words = [];
        
        try {
            words = await fetchSuggestions(rawSequence);
            log('Fetched suggestions:', words);
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
            // Use direct word as fallback
            words = [rawSequence.toLowerCase()];
        }
        
        // Remove loading indicator
        elements.suggestions.classList.remove('loading');
        
        log('Final suggestions:', words);
        
        if (words.length === 0) {
            log('No suggestions found');
            return;
        }
        
        // Create suggestion elements
        words.forEach((word, index) => {
            log(`Creating suggestion element for: "${word}"`);
            const suggElement = document.createElement('div');
            suggElement.className = 'suggestion';
            
            // Make the first suggestion green (usually the direct word)
            if (index === 0) {
                suggElement.classList.add('first-suggestion');
            }
            
            suggElement.textContent = word;
            
            // Add source indicator for debugging
            if (DEBUG) {
                let source = 'direct';
                if (index > 0) {
                    if (isPopularWordsLoaded && hasWordInPopular(word)) {
                        source = 'popular';
                    } else if (isFullWordlistLoaded) {
                        source = 'wordlist';
                    } else {
                        source = 'fallback';
                    }
                }
                suggElement.setAttribute('data-source', source);
            }
            
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
    
    // Helper function to check if a word is in the popular words index
    function hasWordInPopular(word) {
        if (!isPopularWordsLoaded) return false;
        
        // Check if word exists in any popular word list
        for (let i = 1; i <= Math.min(3, word.length); i++) {
            const prefix = word.substring(0, i).toLowerCase();
            if (popularWordIndex[prefix] && popularWordIndex[prefix].includes(word)) {
                return true;
            }
        }
        
        return false;
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
    
    // Update wordlist status indicator
    function updateWordlistStatus() {
        if (!elements.wordlistStatus) return;
        
        if (loadingWordlist) {
            elements.wordlistStatus.textContent = 'Laden...';
            elements.wordlistStatus.className = 'wordlist-status loading';
        } else if (isPopularWordsLoaded && isFullWordlistLoaded) {
            elements.wordlistStatus.textContent = 'OpenTaal Compleet';
            elements.wordlistStatus.className = 'wordlist-status loaded';
        } else if (isPopularWordsLoaded) {
            elements.wordlistStatus.textContent = 'Populaire Woorden';
            elements.wordlistStatus.className = 'wordlist-status popular';
        } else {
            elements.wordlistStatus.textContent = 'Terugvalbasis';
            elements.wordlistStatus.className = 'wordlist-status fallback';
        }
    }
    
    // Update status periodically
    setInterval(updateWordlistStatus, 500);
    
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
        
        // Wordlist reload button
        if (elements.wordlistStatus) {
            elements.wordlistStatus.addEventListener('click', () => {
                if (!loadingWordlist) {
                    loadWordlists();
                }
            });
        }
    }
    
    // Initialize
    setupEventListeners();
    updateKeyboard();
    switchKeyboardTab('stenograph');
});