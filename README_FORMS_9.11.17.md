# TSERTOS CRM PWA V9.11.17

## Vehicle registration fill diagnostics and mapping guard

- Adds a visible counter showing how many vehicle-registration sources are actually mapped into the selected template.
- Blocks PDF generation when vehicle-registration values exist but the selected template has 0 vehicle fields mapped, instead of silently creating a PDF without those values.
- Adds a dedicated “Τοποθέτηση πεδίων άδειας στο έντυπο” button.
- Snapshots OCR/manual vehicle values at fill time so asynchronous PDF generation cannot lose them.
- Final success status reports how many mapped vehicle fields received values.
