(function () {
  "use strict";

  var BOOT_LINES = [
    "Loading profile...",
    "Connecting to guest@mateuszgolebiewski...",
    "Profile loaded. Type 'help' to get started.",
  ];
  var CHAR_DELAY = 18;
  var LINE_PAUSE = 350;

  var outputEl = document.getElementById("output");
  var typedEl = document.getElementById("typed-text");
  var inputEl = document.getElementById("hidden-input");
  var bodyEl = document.querySelector(".terminal-body");

  var history = [];
  var historyIndex = 0;
  var draftBuffer = "";
  var booting = true;
  var bootTimer = null;
  var bootSkip = false;

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
    label.textContent = "guest@mateuszgolebiewski:~$ ";
    div.appendChild(label);
    div.appendChild(document.createTextNode(text));
    outputEl.appendChild(div);
    scrollToBottom();
  }

  function renderTypedLine() {
    typedEl.textContent = inputEl.value;
  }

  function dispatch(raw) {
    var trimmed = raw.trim();
    if (!trimmed) return;
    var parts = trimmed.split(/\s+/);
    var cmdWord = parts[0];
    var args = parts.slice(1);
    var entry = CV.resolveCommand(cmdWord);
    if (!entry) {
      printLines(["bash: " + cmdWord + ": command not found"]);
      return;
    }
    var result = entry.run(args);
    if (result.type === "clear") {
      outputEl.innerHTML = "";
    } else if (result.type === "html") {
      printHTML(result.html);
    } else {
      printLines(result.lines);
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
          currentDiv.textContent = BOOT_LINES[lineIndex];
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

      var line = BOOT_LINES[lineIndex];
      if (charIndex < line.length) {
        currentDiv.textContent = line.slice(0, charIndex + 1);
        charIndex++;
        scrollToBottom();
        bootTimer = setTimeout(step, CHAR_DELAY);
      } else {
        lineIndex++;
        currentDiv = null;
        bootTimer = setTimeout(step, LINE_PAUSE);
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

  inputEl.addEventListener("keydown", function (e) {
    if (booting) {
      skipBoot();
      return;
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

  inputEl.addEventListener("input", renderTypedLine);

  document.querySelector(".terminal-body").addEventListener("click", function () {
    inputEl.focus();
  });

  document.addEventListener("DOMContentLoaded", function () {
    inputEl.focus();
    typeBootLines(endBoot);
  });
})();
