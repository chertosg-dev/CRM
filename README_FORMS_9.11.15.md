# TSERTOS CRM PWA V9.11.15

## Vehicle camera OCR reliability fix

- Improved camera/photo preprocessing for vehicle registration licences.
- Runs OCR on enhanced grayscale and binary variants.
- More tolerant recognition of D.1, D.2, B, 4, E, P.5, P.3 and R codes.
- Reads values from following lines when OCR separates the code from its value.
- Added fallback recognition for VIN, fuel and colour.
- Existing CRM data, templates and mappings are preserved.
