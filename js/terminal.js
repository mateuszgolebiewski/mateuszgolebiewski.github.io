(function () {
  "use strict";

  var BOOT_LINES = [
    { ok: true, text: "Mounting /home/guest", pause: 90 },
    { ok: true, text: "Bringing up eth0", pause: 90 },
    { ok: true, text: "Starting sshd", pause: 90 },
    { ok: true, text: "Authenticating with Azure + AWS", pause: 90 },
    { ok: false, text: "Searching for a will to attend more status meetings", pause: 90 },
    { ok: true, text: "Loading dotfiles", pause: 90 },
    { text: "Connecting to guest@mateuszgolebiewski..." },
    { text: "Connected. Type 'help' to get started." },
  ];
  var CHAR_DELAY = 18;
  var LINE_PAUSE = 350;

  function bootPrefix(entry) {
    if (entry.ok === true) return '<span style="color:var(--ctp-green)">[ OK ]</span> ';
    if (entry.ok === false) return '<span style="color:var(--ctp-red)">[FAIL]</span> ';
    return "";
  }

  var outputEl = document.getElementById("output");
  var typedEl = document.getElementById("typed-text");
  var promptLabelEl = document.getElementById("prompt-label");
  var inputEl = document.getElementById("hidden-input");
  var bodyEl = document.querySelector(".terminal-body");
  var srStatusEl = document.getElementById("sr-status");

  var PROMPT_TEXT = "guest@mateuszgolebiewski:~$ ";

  var history = [];
  var historyIndex = 0;
  var draftBuffer = "";
  var booting = true;
  var bootTimer = null;
  var bootSkip = false;

  var searchMode = false;
  var searchQuery = "";
  var searchIndex = -1;
  var searchOrigValue = "";

  function scrollToBottom() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function printLines(lines) {
    lines.forEach(function (line) {
      var div = document.createElement("div");
      div.className = "line";
      div.textContent = line;
      outputEl.appendChild(div);
    });
    scrollToBottom();
  }

  function printHTML(html) {
    var div = document.createElement("div");
    div.className = "line";
    div.innerHTML = html;
    outputEl.appendChild(div);
    scrollToBottom();
  }

  function printCompletedPrompt(text) {
    var div = document.createElement("div");
    div.className = "line line-history";
    var label = document.createElement("span");
    label.className = "prompt-label";
    label.textContent = PROMPT_TEXT;
    div.appendChild(label);
    div.appendChild(document.createTextNode(text));
    outputEl.appendChild(div);
    scrollToBottom();
  }

  function renderTypedLine() {
    typedEl.textContent = inputEl.value;
  }

  function htmlToText(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || "";
  }

  function announce(text) {
    srStatusEl.textContent = "";
    window.setTimeout(function () {
      srStatusEl.textContent = text;
    }, 50);
  }

  function dispatch(raw) {
    var trimmed = raw.trim();
    if (!trimmed) return;
    var parts = trimmed.split(/\s+/);
    var cmdWord = parts[0];
    var args = parts.slice(1);
    var entry = CV.resolveCommand(cmdWord);
    if (!entry) {
      var notFound = "bash: " + cmdWord + ": command not found";
      printLines([notFound]);
      announce(notFound);
      return;
    }
    var result = entry.run(args);
    if (result.type === "clear") {
      outputEl.innerHTML = "";
      announce("Terminal cleared.");
    } else if (result.type === "html") {
      printHTML(result.html);
      announce(htmlToText(result.html));
    } else {
      printLines(result.lines);
      announce(result.lines.join(". "));
    }
  }

  function skipBoot() {
    if (!booting) return;
    bootSkip = true;
  }

  function typeBootLines(callback) {
    var lineIndex = 0;
    var charIndex = 0;
    var currentDiv = null;

    function step() {
      if (bootSkip) {
        while (lineIndex < BOOT_LINES.length) {
          if (!currentDiv) {
            currentDiv = document.createElement("div");
            currentDiv.className = "line";
            outputEl.appendChild(currentDiv);
          }
          currentDiv.innerHTML = bootPrefix(BOOT_LINES[lineIndex]) + BOOT_LINES[lineIndex].text;
          lineIndex++;
          currentDiv = null;
        }
        scrollToBottom();
        callback();
        return;
      }

      if (lineIndex >= BOOT_LINES.length) {
        callback();
        return;
      }

      if (!currentDiv) {
        currentDiv = document.createElement("div");
        currentDiv.className = "line";
        outputEl.appendChild(currentDiv);
        charIndex = 0;
      }

      var entry = BOOT_LINES[lineIndex];
      var line = entry.text;
      if (charIndex < line.length) {
        currentDiv.innerHTML = bootPrefix(entry) + line.slice(0, charIndex + 1);
        charIndex++;
        scrollToBottom();
        bootTimer = setTimeout(step, CHAR_DELAY);
      } else {
        lineIndex++;
        currentDiv = null;
        bootTimer = setTimeout(step, entry.pause || LINE_PAUSE);
      }
    }

    step();
  }

  function endBoot() {
    booting = false;
    renderTypedLine();
    inputEl.focus();
  }

  function tabComplete() {
    var value = inputEl.value;
    if (value.indexOf(" ") !== -1) return;
    var word = value.toLowerCase();
    var candidates = CV.commandNames.filter(function (name) {
      return name.indexOf(word) === 0;
    });
    if (candidates.length === 0) return;
    if (candidates.length === 1) {
      inputEl.value = candidates[0] + " ";
      renderTypedLine();
      return;
    }
    printCompletedPrompt(value);
    printLines([candidates.join("  ")]);
    var prefix = candidates.reduce(function (a, b) {
      var i = 0;
      while (i < a.length && i < b.length && a[i].toLowerCase() === b[i].toLowerCase()) i++;
      return a.slice(0, i);
    });
    inputEl.value = prefix;
    renderTypedLine();
  }

  function searchHistory(query, fromIndex) {
    var q = query.toLowerCase();
    for (var i = Math.min(fromIndex, history.length - 1); i >= 0; i--) {
      if (history[i].toLowerCase().indexOf(q) !== -1) return i;
    }
    return -1;
  }

  function updateSearchDisplay() {
    var failed = searchQuery && searchIndex === -1;
    promptLabelEl.textContent =
      (failed ? "(failed reverse-i-search)`" : "(reverse-i-search)`") + searchQuery + "': ";
    typedEl.textContent = searchIndex >= 0 ? history[searchIndex] : "";
  }

  function updateSearchFromQuery() {
    searchQuery = inputEl.value;
    searchIndex = searchQuery ? searchHistory(searchQuery, history.length - 1) : -1;
    updateSearchDisplay();
  }

  function enterSearchMode() {
    searchMode = true;
    searchOrigValue = inputEl.value;
    searchQuery = "";
    searchIndex = -1;
    inputEl.value = "";
    updateSearchDisplay();
  }

  function advanceSearchMode() {
    if (!searchQuery) return;
    var next = searchHistory(searchQuery, searchIndex - 1);
    if (next !== -1) searchIndex = next;
    updateSearchDisplay();
  }

  function exitSearchMode(restore) {
    searchMode = false;
    promptLabelEl.textContent = PROMPT_TEXT;
    if (restore) {
      inputEl.value = searchOrigValue;
      renderTypedLine();
    }
  }

  inputEl.addEventListener("keydown", function (e) {
    if (booting) {
      skipBoot();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault();
      if (!searchMode) {
        enterSearchMode();
      } else {
        advanceSearchMode();
      }
      return;
    }

    if (searchMode) {
      if (e.key === "Escape" || (e.ctrlKey && e.key.toLowerCase() === "g")) {
        e.preventDefault();
        exitSearchMode(true);
        return;
      }
      if (e.key === "Enter" || e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Tab") {
        var committed = searchIndex >= 0 ? history[searchIndex] : searchQuery;
        exitSearchMode(false);
        inputEl.value = committed;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      var value = inputEl.value;
      printCompletedPrompt(value);
      if (value.trim()) {
        history.push(value);
      }
      dispatch(value);
      inputEl.value = "";
      historyIndex = history.length;
      draftBuffer = "";
      renderTypedLine();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      if (historyIndex === history.length) draftBuffer = inputEl.value;
      historyIndex = Math.max(0, historyIndex - 1);
      inputEl.value = history[historyIndex];
      renderTypedLine();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= history.length) return;
      if (historyIndex < history.length - 1) {
        historyIndex++;
        inputEl.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        inputEl.value = draftBuffer;
      }
      renderTypedLine();
    } else if (e.key === "Tab") {
      e.preventDefault();
      tabComplete();
    }
  });

  inputEl.addEventListener("input", function () {
    if (searchMode) {
      updateSearchFromQuery();
    } else {
      renderTypedLine();
    }
  });

  document.querySelector(".terminal-body").addEventListener("click", function () {
    inputEl.focus();
  });

  document.addEventListener("DOMContentLoaded", function () {
    inputEl.focus();
    typeBootLines(endBoot);
  });
})();
