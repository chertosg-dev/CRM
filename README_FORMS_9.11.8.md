# TSERTOS CRM PWA V9.11.8 — Fast PWA Updates

- Έλεγχος για νέα έκδοση σε κάθε άνοιγμα/επιστροφή στην εφαρμογή.
- `updateViaCache: none` για τον service worker.
- Άμεση ενεργοποίηση νέου service worker με `skipWaiting` και `clients.claim`.
- Αυτόματο reload όταν αλλάξει controller.
- Οι πλοηγήσεις ζητούν το νεότερο `index.html` χωρίς browser HTTP cache.
- Δεν αλλάζει η τοπική βάση CRM, τα πρότυπα ή οι αντιστοιχίσεις PDF.
