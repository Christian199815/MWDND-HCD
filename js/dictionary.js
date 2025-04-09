// Dutch word dictionary mapped to key combinations - optimized for casual chatting/commuting
const dictionary = {
    // Single keys - extremely common words
    'S': ['sorry', 'station', 'snel'],
    'T': ['trein', 'tijd', 'tot'],
    'K': ['kom', 'kan', 'koffie'],
    'P': ['pas', 'perron', 'probleem'],
    'W': ['wat', 'wanneer', 'waar'],
    'H': ['hoi', 'hallo', 'he'],
    'R': ['reis', 'rustig', 'raar'],
    'A': ['al', 'aan', 'afspraak'],
    'O': ['ok', 'oké', 'onderweg'],
    'E': ['en', 'even', 'echt'],
    'U': ['uur', 'uit', 'utrecht'],
    'I': ['ik', 'in', 'is'],
    
    // Two-key combinations - common phrases
    'IK': ['ik kom', 'ik kan', 'ik kijk'],
    'ST': ['station', 'straks', 'stil'],
    'TR': ['trein', 'tram', 'traag'],
    'KO': ['kom', 'koffie', 'kosten'],
    'NU': ['nu', 'nummer', 'nuttig'],
    'WA': ['wat', 'waar', 'wanneer'],
    'HO': ['hoi', 'hoeveel', 'hopelijk'],
    'LA': ['later', 'laat', 'langzaam'],
    'ZI': ['zie', 'zit', 'zijn'],
    'DA': ['dag', 'dank', 'dat'],
    'MO': ['moment', 'morgen', 'mogelijk'],
    'BE': ['ben', 'bedankt', 'bericht'],
    'ON': ['onderweg', 'ontmoeten', 'onzin'],
    'OP': ['op tijd', 'openbaar', 'ophalen'],
    'AF': ['afspraak', 'afgesproken', 'af'],
    'TE': ['te laat', 'tekst', 'terug'],
    'OV': ['ov-kaart', 'over', 'overstappen'],
    'VO': ['voor', 'volgende', 'vol'],
    'AA': ['aan', 'aankomen', 'aankomst'],
    'VE': ['vertraging', 'vertrek', 'verder'],
    'WE': ['weer', 'weekend', 'wel'],
    'NI': ['niet', 'nieuws', 'niks'],
    'DO': ['doen', 'doei', 'dokter'],
    'ZO': ['zo', 'zoiets', 'zondag'],
    'ME': ['met', 'menu', 'metro'],
    'LE': ['leuk', 'lekker', 'leven'],
    'GO': ['goed', 'google', 'goedemorgen'],
    'GE': ['gezellig', 'gewoon', 'genoeg'],
    
    // Travel and commute related
    'NS': ['ns', 'ns-app', 'ns-kaart'],
    'OV': ['ov', 'ov-chipkaart', 'overstap'],
    'SP': ['spoor', 'spits', 'sprinter'],
    'IC': ['intercity', 'ica', 'ics'],
    'VT': ['vertraging', 'vertrek', 'vertrektijd'],
    'RE': ['reizen', 'reservering', 'retour'],
    'KA': ['kaartje', 'kaart', 'kassa'],
    'UU': ['uur', 'utrecht', 'uurtje'],
    'AM': ['amsterdam', 'amersfoort', 'amstel'],
    'RO': ['rotterdam', 'route', 'rondje'],
    'DE': ['den haag', 'delft', 'denk'],
    
    // Time expressions
    'NU': ['nu', 'nu meteen', 'nu al'],
    'LA': ['later', 'laat', 'laatst'],
    'ST': ['straks', 'stuk', 'start'],
    'VA': ['vandaag', 'vanavond', 'vakantie'],
    'MO': ['morgen', 'moment', 'mooi'],
    'MI': ['minuut', 'minuten', 'midden'],
    'UR': ['uur', 'uurtje', 'uren'],
    
    // Conversational phrases
    'BT': ['beetje', 'buiten', 'beter'],
    'GD': ['goed', 'gedag', 'gedaan'],
    'KL': ['klaar', 'klinkt', 'klopt'],
    'ZJ': ['zijn', 'zij', 'zojuist'],
    'WJ': ['wij', 'wijze', 'wijs'],
    'JA': ['ja', 'jaar', 'jammer'],
    'NE': ['nee', 'neem', 'nergens'],
    'OK': ['oké', 'ok', 'oké dan'],
    
    // Emoji and emotions text equivalents
    'HA': ['haha', 'hahaha', '😂'],
    'LO': ['lol', '😄', 'leuk'],
    'SM': ['smile', '🙂', 'smh'],
    'KU': ['kusje', 'kus', '😘'],
    'DU': ['duim', '👍', 'duidelijk'],
    
    // Chat abbreviations
    'FF': ['ff', 'even', 'effetjes'],
    'IDD': ['idd', 'inderdaad', 'iedereen'],
    'IDK': ['idk', 'ik weet niet', 'ik denk'],
    'OMG': ['omg', 'oh mijn god', 'ongelooflijk'],
    'BTW': ['btw', 'by the way', 'tussen haakjes'],
    'TMI': ['tmi', 'teveel info', 'te veel'],
    
    // Food and drinks (common during commute)
    'KF': ['koffie', 'koffie to go', 'koffieautomaat'],
    'TH': ['thee', 'thuis', 'thee drinken'],
    'BR': ['broodje', 'brood', 'brunch'],
    'ET': ['eten', 'etenstijd', 'eet'],
    'DR': ['drinken', 'drank', 'druk'],
    
    // Common chat phrases
    'HG': ['hou je goed', 'hoe gaat', 'hoezo'],
    'WR': ['waar ben je', 'waar is', 'waarom'],
    'ZS': ['zie je straks', 'ziens', 'zo snel'],
    'TZ': ['tot zo', 'tot ziens', 'tot straks'],
    'BD': ['ben druk', 'bedankt', 'ben daar'],
    'KS': ['kom snel', 'kus', 'kom straks'],
    'MS': ['message', 'mis je', 'misschien'],
    'LT': ['laat', 'laat het weten', 'lukt niet'],
    'GL': ['geluid', 'gelijk', 'gelukt'],
    
    // Common work-related (for commuters)
    'WK': ['werk', 'werkdag', 'weekend'],
    'MT': ['meeting', 'moet', 'moet werken'],
    'ML': ['mail', 'mailen', 'mailbox'],
    'PR': ['project', 'presentatie', 'praktisch'],
    'AF': ['afspraak', 'afsluiten', 'afmaken'],
    'CL': ['collega', 'call', 'client'],
    
    // Casual responses
    'NP': ['no problem', 'geen probleem', 'neem plaats'],
    'TK': ['tuurlijk', 'take care', 'technisch'],
    'GW': ['geen probleem', 'geweldig', 'gewoon'],
    'CH': ['check', 'chill', 'chat'],
    'ZK': ['zeker', 'zoeken', 'zakelijk']
};