// Dutch word dictionary mapped to key combinations
const dictionary = {
    // Primary letters - common words
    "S": ["spel", "stap", "sterk", "schoon"],
    "B": ["beter", "boom", "blij", "brood"],
    "V": ["vader", "vraag", "veel", "voelen"],
    "G": ["goed", "groot", "graag", "gek"],
    "A": ["altijd", "anders", "auto", "arm"],
    "T": ["tijd", "toch", "terug", "tegen"],
    "M": ["mens", "maken", "mooi", "maand"],
    "K": ["klein", "kant", "kracht", "kom"],
    "W": ["woord", "waar", "weten", "werk"],
    "D": ["dag", "doen", "denken", "donker"],
    "H": ["huis", "hoog", "houden", "hard"],
    "L": ["leven", "licht", "lang", "lachen"],
    
    // Secondary letters
    "R": ["reden", "reis", "rust", "rijk"],
    "Z": ["zien", "zon", "zorg", "zacht"],
    "E": ["eigen", "eten", "echt", "enkel"],
    "N": ["nieuw", "naam", "nodig", "nat"],
    "O": ["ook", "open", "ogen", "oud"],
    "F": ["fiets", "fout", "feest", "fles"],
    "P": ["plan", "punt", "prijs", "praten"],
    "J": ["jaar", "jij", "juist", "jas"],
    "I": ["iets", "idee", "iemand", "ijs"],
    "U": ["uit", "uren", "uniek", "uitzicht"],
    "C": ["centrum", "cirkel", "cursus", "code"],
    "Y": ["yoghurt", "yacht", "yoga", "yes"],
    
    // Common combinations
    "SB": ["sociaal", "simpel", "school", "samen"],
    "VG": ["vraag", "volgend", "vergeten", "vragen"],
    "AT": ["altijd", "anders", "actie", "aantrekkelijk"],
    "MK": ["maken", "mogelijk", "makkelijk", "moeilijk"],
    "WD": ["woord", "worden", "wedstrijd", "wonder"],
    "HL": ["helpen", "halen", "herhalen", "heel"],
    
    // Double tap combinations
    "SR": ["straat", "stroom", "streng", "straf"],
    "BZ": ["bezig", "bezorgen", "bijzonder", "bezoek"],
    "VE": ["veel", "velen", "verder", "verhaal"],
    "GN": ["gaan", "geen", "groen", "geven"],
    "AO": ["auto", "auto\'s", "avond", "ongeveer"],
    "TF": ["telefoon", "trein", "toets", "fout"],
    "MP": ["probleem", "meenemen", "mogelijk", "proces"],
    "KJ": ["kijken", "krijgen", "kaartje", "koekje"],
    "WI": ["winkel", "winter", "wij", "willen"],
    "DU": ["dus", "duur", "duidelijk", "dubbel"],
    "HC": ["heerlijk", "hechten", "huiselijk", "centraal"],
    "LY": ["leuk", "licht", "lekker", "loyaal"],
    
    // Common phrases
    "SV": ["snel vinden", "sinds vandaag", "samen verder"],
    "BD": ["bijna daar", "begin december", "beide dagen"],
    "TM": ["tot morgen", "te maken", "te moe"],
    "KW": ["kom wanneer", "kijk wat", "kies waar"],
    "DH": ["dank hulp", "door heen", "de hoeveelheid"],
    
    // Travel related
    "ST": ["station", "straat", "stad", "stoppen"],
    "TR": ["trein", "tram", "traag", "traject"],
    "VT": ["vertrek", "vertraging", "vroeg thuis"],
    "BU": ["bushalte", "buiten", "buitenland"],
    "RE": ["reis", "retour", "reservering", "regelen"],
    
    // Common expressions
    "GD": ["goedendag", "goedkoop", "gedaan", "gedacht"],
    "BT": ["beetje", "beter", "betalen", "betekenis"],
    "HZ": ["huis", "huizen", "hetzelfde", "helemaal"],
    "WR": ["waar", "waarom", "waarschijnlijk", "waard"],
    
    // Chat abbreviations
    "FF": ["ff", "even", "effetjes"],
    "IDD": ["idd", "inderdaad", "iedereen"],
    "OK": ["oké", "ok", "okee"],
    "NP": ["geen probleem", "no problem", "nee probleem"],
    
    // Emojis
    "HA": ["😄", "haha", "hahaha"],
    "SM": ["🙂", "smile", "smiley"],
    "KS": ["😘", "kus", "kusje"],
    "DU": ["👍", "duim", "duimpje"],

    // Additional combinations with double-tapped keys
    "ER": ["eerste", "eerlijk", "ervaring", "er is"],
    "ZO": ["zoals", "zoeken", "zondag", "zorgen"],
    "NE": ["nee", "nemen", "nergens", "netjes"],
    "JI": ["jij", "jijzelf", "jij bent", "jij kan"],
    "PO": ["post", "politie", "positief", "portret"],
    "CU": ["cultuur", "cursus", "curieus", "cultureel"],
    
    // Three letter combinations
    "STR": ["straat", "stroom", "strand", "streng"],
    "VER": ["verder", "verhaal", "vergeten", "verkeer"],
    "BEL": ["belangrijk", "belang", "bellen", "beleven"],
    "WAT": ["water", "wat is", "wat een", "wat ben"],
    "HOE": ["hoeveel", "hoe laat", "hoewel", "hoezo"],
    
    // Mixed primary/secondary combinations
    "SW": ["samenwerken", "switch", "swing", "sweater"],
    "RD": ["reden", "redden", "rijden", "rood"],
    "ZT": ["zitten", "zaterdag", "zoet", "zetten"],
    "ES": ["eerst", "espresso", "eenvoudig", "essentieel"],
    "NV": ["niveau", "november", "nieuwe", "nooit vergeten"],
    
    // New combinations for double-tap letters
    "RE": ["reis", "regel", "regen", "rechtdoor"],
    "ZA": ["zakelijk", "zacht", "zaterdag", "zaken"],
    "EV": ["even", "eventueel", "evenwicht", "evaluatie"],
    "NW": ["nieuw", "naar", "nogmaals", "nooit"],
    "OG": ["ogen", "ook goed", "ongeluk", "ongeveer"],
    "FA": ["familie", "favorieten", "fantastisch", "fase"],
    "PL": ["plaats", "plezier", "plan", "plein"],
    "JU": ["juist", "juni", "jullie", "jury"],
    "ID": ["idee", "identiteit", "ieder", "idioot"],
    "UI": ["uit", "uitleg", "uitstekend", "uitkomst"],
    "CO": ["corona", "contact", "complex", "compleet"],
    "YO": ["yoghurt", "yoga", "youtube", "york"],
    
    // Frequently used phrases
    "IB": ["ik ben", "ik blijf", "ik bedoel", "ik begrijp"],
    "HV": ["het is", "het voelt", "het verschil", "hebben"],
    "DM": ["dank je", "dank u", "dankjewel", "dankumiddel"],
    "WZ": ["weet je", "wij zijn", "wij zullen", "waarschijnlijk"],
    "KN": ["kan niet", "kan nu", "kom nu", "kom naar"],
    
    // Travel and commute related combinations
    "NST": ["ns trein", "naar station", "ns ticket", "ns tijd"],
    "OVK": ["ov-kaart", "ov-chipkaart", "openbaar vervoer", "overstappen"],
    "SPR": ["sprinter", "spoorweg", "spoor", "springen"],
    "ICT": ["intercity trein", "ict", "ich", "ictus"],
    
    // Time expressions with double-tapped keys
    "NUW": ["nu", "nu weer", "nu wel", "nu weet ik"],
    "LAT": ["later", "laatste", "late tijd", "laten"],
    "VRO": ["vroeg", "vroeger", "vrolijk", "vragen over"],
    "MOR": ["morgen", "morgenvroeg", "morgenavond", "morgennamiddag"],
    "AVZ": ["avond", "avondeten", "avondzorg", "avondzon"],
    
    // Chat shortcuts with double-tap
    "BDZ": ["bedankt", "betekenis", "badzout", "bedanken"],
    "SMS": ["sms", "sms\'en", "sms-bericht", "samensmeden"],
    "THX": ["thanks", "thanx", "thx", "tx"],
    "LMW": ["laat me weten", "laat maar weten", "laat mij weten"],
    "KMN": ["kom naar", "komen", "kom nu", "kom morgen"],
    
    // Completions with mixed primary and secondary keys
    "BER": ["bericht", "bereid", "bergen", "beroep"],
    "VOE": ["voelen", "voet", "voedsel", "voetbal"],
    "GEF": ["gefeliciteerd", "gefeest", "gefixt", "gefrustreerd"],
    "AUT": ["auto", "autoriteit", "authentiek", "auteur"],
    
    // Special uses of double-tapped keys
    "TFC": ["traffic", "te factureren", "te factureren code", "traffic control"],
    "MPJ": ["mijn project", "mijn planning", "mijn pijn", "mijn plaats"],
    "BWI": ["binnenkort", "bewijs", "bewoner", "bewegen in"],
    "DHC": ["de hoeveelheid", "de handel", "de hoogte", "de huurcontract"],
    "LYO": ["layout", "loyaal", "leyo", "loyaliteit"]
}