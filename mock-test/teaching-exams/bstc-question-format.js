(function () {
  function formatQuestionText(text) {
    if (typeof text !== "string") return "";

    let formatted = text.replace(/\r\n?/g, "\n").trim();
    const sectionPatterns = [
      /(^|\s)(सूची\s*[-–]?\s*I{1,2}|सूची\s*[12])\s*:?[\s-]*/gi,
      /(^|\s)(कथन|निष्कर्ष|कारण|अभिकथन|पूर्वधारणा|मान्यताएँ|निर्देश|उत्तर\s*कूट)\s*[:\-]\s*/gi,
      /(^|\s)(कूट\s*\(\s*Codes\s*\)|कूट|निम्नलिखित\s*में\s*से|सही\s*विकल्प\s*चुनिए)\s*:?\s*/gi,
      /(^|\s)(Statements?|Conclusions?|Assertion|Reason|Assumptions?|Directions?|Passage|Codes|Choose the correct option)\s*:?\s*/gi
    ];

    sectionPatterns.forEach((pattern) => {
      formatted = formatted.replace(pattern, (_, __, heading) => `\n\n${heading.trim()}:\n`);
    });

    formatted = formatted.replace(/\s+([a-dA-D])\.\s*/g, "\n$1. ");
    formatted = formatted.replace(/\s+([1-4])\.\s*/g, "\n$1. ");
    formatted = formatted.replace(/\s+(I{1,3}|IV)\.\s*/g, "\n$1. ");

    formatted = formatted
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .trim();

    return formatted;
  }

  window.formatQuestionText = formatQuestionText;
})();
