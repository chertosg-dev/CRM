(() => {
  "use strict";

  function decodeXml(value) {
    return String(value ?? "")
      .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
      .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&");
  }

  function attributeValue(attributes, name) {
    const match = String(attributes || "").match(new RegExp(`(?:^|\\s)${name}=(?:"([^"]*)"|'([^']*)')`));
    return decodeXml(match?.[1] ?? match?.[2] ?? "");
  }

  function columnIndex(cellReference) {
    const letters = String(cellReference || "").match(/^[A-Z]+/i)?.[0]?.toUpperCase() || "";
    return [...letters].reduce((value, letter) => value * 26 + letter.charCodeAt(0) - 64, 0) - 1;
  }

  function textNodes(xml) {
    return [...String(xml || "").matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)]
      .map(match => decodeXml(match[1]))
      .join("");
  }

  function parseSharedStrings(xml) {
    if (!xml) return [];
    return [...xml.matchAll(/<si(?:\s[^>]*)?>([\s\S]*?)<\/si>/g)]
      .map(match => textNodes(match[1]));
  }

  function normalizeZipPath(path) {
    const parts = [];
    String(path || "").split("/").forEach(part => {
      if (!part || part === ".") return;
      if (part === "..") parts.pop();
      else parts.push(part);
    });
    return parts.join("/");
  }

  function firstWorksheetPath(workbookXml, relationshipsXml) {
    const firstSheet = workbookXml.match(/<sheet\b([^>]*)\/?\s*>/);
    const relationshipId = firstSheet ? attributeValue(firstSheet[1], "r:id") : "";
    if (relationshipId && relationshipsXml) {
      for (const match of relationshipsXml.matchAll(/<Relationship\b([^>]*)\/?\s*>/g)) {
        if (attributeValue(match[1], "Id") !== relationshipId) continue;
        const target = attributeValue(match[1], "Target");
        if (target) return normalizeZipPath(`xl/${target}`);
      }
    }
    return "xl/worksheets/sheet1.xml";
  }

  function parseCell(attributes, body, sharedStrings) {
    const type = attributeValue(attributes, "t");
    if (type === "inlineStr") return textNodes(body);
    const raw = body.match(/<v(?:\s[^>]*)?>([\s\S]*?)<\/v>/)?.[1];
    if (raw === undefined) return "";
    const decoded = decodeXml(raw);
    if (type === "s") return sharedStrings[Number(decoded)] ?? "";
    if (type === "str" || type === "e") return decoded;
    if (type === "b") return decoded === "1";
    const number = Number(decoded);
    return Number.isFinite(number) ? number : decoded;
  }

  function parseWorksheet(xml, sharedStrings) {
    const rows = [];
    for (const rowMatch of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
      const row = [];
      for (const cellMatch of rowMatch[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
        const index = columnIndex(attributeValue(cellMatch[1], "r"));
        if (index >= 0) row[index] = parseCell(cellMatch[1], cellMatch[2], sharedStrings);
      }
      for (let index = 0; index < row.length; index += 1) {
        if (row[index] === undefined) row[index] = "";
      }
      rows.push(row);
    }
    return rows;
  }

  async function readFirstSheet(fileOrBuffer) {
    if (!window.JSZip) throw new Error("Δεν φορτώθηκε ο αναγνώστης Excel.");
    const source = fileOrBuffer instanceof Blob ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;
    const zip = await window.JSZip.loadAsync(source);
    const workbookEntry = zip.file("xl/workbook.xml");
    if (!workbookEntry) throw new Error("Το αρχείο δεν είναι έγκυρο Excel (.xlsx).");
    const workbookXml = await workbookEntry.async("string");
    const relationshipsXml = await zip.file("xl/_rels/workbook.xml.rels")?.async("string");
    const sharedStringsXml = await zip.file("xl/sharedStrings.xml")?.async("string");
    const worksheetPath = firstWorksheetPath(workbookXml, relationshipsXml || "");
    const worksheetEntry = zip.file(worksheetPath);
    if (!worksheetEntry) throw new Error("Δεν βρέθηκε το πρώτο φύλλο του Excel.");
    const worksheetXml = await worksheetEntry.async("string");
    return parseWorksheet(worksheetXml, parseSharedStrings(sharedStringsXml || ""));
  }

  window.TsertosXlsx = { readFirstSheet };
})();
