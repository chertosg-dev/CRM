# TSERTOS CRM PWA V9.11.19

- Fixed a JavaScript regex escaping bug that prevented D.1 / D.2 / P.3 / P.5 registration-field codes from being matched reliably.
- Added positional OCR: Tesseract word bounding boxes are now used to read the value next to each registration code instead of relying only on the full OCR text stream.
- Tightened VIN validation to reject random 17-character OCR strings unless they contain a realistic numeric component.
- Vehicle values are merged from positional OCR and text OCR, preferring field-specific positional matches.
- Vehicle mapping status now reports values against the full 8-field set.
