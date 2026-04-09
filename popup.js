const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome"); // light theme
editor.getSession().setMode("ace/mode/json");
editor.setOptions({
    fontSize: "13px",
    showPrintMargin: false,
});

const btnImport = document.getElementById("btn_import");
const btnExport = document.getElementById("btn_export");
const btnCopy = document.getElementById("btn_copy");
const btnDownload = document.getElementById("btn_download");
const btnFormat = document.getElementById("btn_format");
const btnClear = document.getElementById("btn_clear");
const fileInput = document.getElementById("file_input");
const feedback = document.getElementById("feedback");
const charCount = document.getElementById("char_count");

btnImport.disabled = true;

function checkTab() {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        const isDesmos = url && url.includes("desmos.com");
        btnExport.disabled = !isDesmos;
        btnImport.disabled = !isDesmos || !isValidJson(editor.getValue());
        if (!isDesmos) {
            setFeedback("Not on Desmos page", true);
        } else {
            updateStats(); // re-enable based on content
        }
    });
}

function isValidJson(str) {
    try { JSON.parse(str); return true; } catch { return false; }
}

function setFeedback(msg, isError = false) {
    feedback.textContent = msg;
    feedback.style.color = isError ? "#e74c3c" : "#2ecc71";
}

function updateStats() {
    const val = editor.getValue();
    charCount.textContent = `${val.length} chars`;
    if (val.length === 0) {
        btnImport.disabled = true;
        setFeedback("");
    } else if (isValidJson(val)) {
        btnImport.disabled = false;
        setFeedback("✓ Valid JSON");
    } else {
        btnImport.disabled = true;
        setFeedback("✗ Invalid JSON — check syntax", true);
    }
    checkTab(); // ensure import is disabled if not on desmos
}

editor.getSession().on("change", updateStats);

// Export
btnExport.addEventListener("click", () => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { message: "export" }, (response) => {
            editor.setValue(response, -1);
            setFeedback("✓ Exported");
        });
    });
});

// Import
btnImport.addEventListener("click", () => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const state_json = editor.getValue();
        browser.tabs.sendMessage(tabs[0].id, { message: "import", state_json }, () => {
            setFeedback("✓ Imported");
        });
    });
});

// Copy to clipboard
btnCopy.addEventListener("click", () => {
    navigator.clipboard.writeText(editor.getValue()).then(() => {
        setFeedback("✓ Copied to clipboard");
    });
});

// Download as .json file
btnDownload.addEventListener("click", () => {
    const val = editor.getValue();
    if (!val) return setFeedback("✗ Nothing to download", true);
    const blob = new Blob([val], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "desmos-graph.json";
    a.click();
    URL.revokeObjectURL(url);
    setFeedback("✓ Downloaded");
});

// Format/prettify JSON
btnFormat.addEventListener("click", () => {
    const val = editor.getValue();
    if (isValidJson(val)) {
        editor.setValue(JSON.stringify(JSON.parse(val), null, 2), -1);
        setFeedback("✓ Formatted");
    } else {
        setFeedback("✗ Cannot format invalid JSON", true);
    }
});

// Clear editor
btnClear.addEventListener("click", () => {
    editor.setValue("", -1);
    setFeedback("✓ Cleared");
});

// Load from file
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        editor.setValue(e.target.result, -1);
        setFeedback("✓ File loaded");
    };
    reader.readAsText(file);
});

window.addEventListener("load", () => {
    // Removed automatic focus to prevent Firefox popup issues
    // Focus will happen on first user interaction
});

// Focus editor on first click anywhere in popup
let focused = false;
document.addEventListener("click", () => {
    if (!focused) {
        editor.focus();
        focused = true;
    }
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "e") { e.preventDefault(); btnExport.click(); }
    if (e.ctrlKey && e.key === "i") { e.preventDefault(); if (!btnImport.disabled) btnImport.click(); }
});

window.addEventListener("load", checkTab);
browser.tabs.onActivated.addListener(checkTab);
browser.tabs.onUpdated.addListener(checkTab);