(function () {
  "use strict";

  var data = CV.data;

  function pad(str, len) {
    while (str.length < len) str += " ";
    return str;
  }

  var NEOFETCH_ART = [
    "⣇⣿⠘⣿⣿⣿⡿⡿⣟⣟⢟⢟⢝⠵⡝⣿⡿⢂⣼⣿⣷⣌⠩⡫⡻⣝⠹⢿⣿⣷",
    "⡆⣿⣆⠱⣝⡵⣝⢅⠙⣿⢕⢕⢕⢕⢝⣥⢒⠅⣿⣿⣿⡿⣳⣌⠪⡪⣡⢑⢝⣇",
    "⡆⣿⣿⣦⠹⣳⣳⣕⢅⠈⢗⢕⢕⢕⢕⢕⢈⢆⠟⠋⠉⠁⠉⠉⠁⠈⠼⢐⢕⢽",
    "⡗⢰⣶⣶⣦⣝⢝⢕⢕⠅⡆⢕⢕⢕⢕⢕⣴⠏⣠⡶⠛⡉⡉⡛⢶⣦⡀⠐⣕⢕",
    "⡝⡄⢻⢟⣿⣿⣷⣕⣕⣅⣿⣔⣕⣵⣵⣿⣿⢠⣿⢠⣮⡈⣌⠨⠅⠹⣷⡀⢱⢕",
    "⡝⡵⠟⠈⢀⣀⣀⡀⠉⢿⣿⣿⣿⣿⣿⣿⣿⣼⣿⢈⡋⠴⢿⡟⣡⡇⣿⡇⡀⢕",
    "⡝⠁⣠⣾⠟⡉⡉⡉⠻⣦⣻⣿⣿⣿⣿⣿⣿⣿⣿⣧⠸⣿⣦⣥⣿⡇⡿⣰⢗⢄",
    "⠁⢰⣿⡏⣴⣌⠈⣌⠡⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣬⣉⣉⣁⣄⢖⢕⢕⢕",
    "⡀⢻⣿⡇⢙⠁⠴⢿⡟⣡⡆⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣵⣵⣿",
    "⡻⣄⣻⣿⣌⠘⢿⣷⣥⣿⠇⣿⣿⣿⣿⣿⣿⠛⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
    "⣷⢄⠻⣿⣟⠿⠦⠍⠉⣡⣾⣿⣿⣿⣿⣿⣿⢸⣿⣦⠙⣿⣿⣿⣿⣿⣿⣿⣿⠟",
    "⡕⡑⣑⣈⣻⢗⢟⢞⢝⣻⣿⣿⣿⣿⣿⣿⣿⠸⣿⠿⠃⣿⣿⣿⣿⣿⣿⡿⠁⣠",
    "⡝⡵⡈⢟⢕⢕⢕⢕⣵⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣿⣿⣿⣿⣿⠿⠋⣀⣈⠙",
    "⡝⡵⡕⡀⠑⠳⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢉⡠⡲⡫⡪⡪⡣",
  ];

  function neofetchArt() {
    return NEOFETCH_ART.map(function (line) {
      return '<span style="color:var(--ctp-mauve)">' + line + "</span>";
    });
  }

  function experienceListingHtml() {
    var rows = data.experience.map(function (job, i) {
      return (
        (i + 1) + ") " + job.role + " — " + job.company + " (" + job.start + " – " + job.end + ")"
      );
    });
    return (
      "<strong>Experience:</strong><br><br>" +
      rows.join("<br>") +
      "<br><br>type 'experience &lt;number&gt;' or 'experience &lt;company-slug&gt;' for details, e.g. 'experience 1' or 'experience capgemini'"
    );
  }

  function experienceDetailHtml(job) {
    var bullets = job.bullets.map(function (b) {
      return "  • " + b;
    });
    return (
      "<strong>" + job.role + " — " + job.company + "</strong><br>" +
      "<strong>Dates:</strong> " + job.start + " – " + job.end +
      "<br><br>" +
      bullets.join("<br>")
    );
  }

  function resolveExperienceArg(arg) {
    if (/^\d+$/.test(arg)) {
      var idx = parseInt(arg, 10) - 1;
      if (idx >= 0 && idx < data.experience.length) return data.experience[idx];
      return null;
    }
    var lower = arg.toLowerCase();
    for (var i = 0; i < data.experience.length; i++) {
      if (data.experience[i].slug.toLowerCase() === lower) return data.experience[i];
    }
    return null;
  }

  CV.commands = {
    help: {
      aliases: [],
      description: "list available commands",
      run: function () {
        var rows = [];
        var seen = {};
        Object.keys(CV.commands).forEach(function (name) {
          if (seen[name]) return;
          seen[name] = true;
          var entry = CV.commands[name];
          var label = name;
          if (entry.aliases.length) label += " (" + entry.aliases.join(", ") + ")";
          rows.push("  <strong>" + pad(label, 28) + "</strong>" + entry.description);
        });
        var html =
          "<strong>Available commands:</strong><br><br>" +
          rows.join("<br>") +
          "<br><br>type 'about' to get started";
        return { type: "html", html: html };
      },
    },

    about: {
      aliases: ["whoami"],
      description: "who is this?",
      run: function () {
        var p = data.profile;
        var lines = [
          "<strong>Name:</strong> " + p.name,
          "<strong>Location:</strong> " + p.location,
          "<strong>About:</strong> " + p.summary,
          "<strong>LinkedIn:</strong> linkedin.com/" + p.linkedin,
          "<strong>E-Mail:</strong> " + p.email,
        ];
        return { type: "html", html: lines.join("<br><br>") };
      },
    },

    experience: {
      aliases: ["exp"],
      description: "work history",
      run: function (args) {
        if (!args.length) return { type: "html", html: experienceListingHtml() };
        var job = resolveExperienceArg(args[0]);
        if (!job) {
          return {
            type: "lines",
            lines: ["experience: no such entry '" + args[0] + "' — try 'experience' to list roles"],
          };
        }
        return { type: "html", html: experienceDetailHtml(job) };
      },
    },

    education: {
      aliases: ["edu"],
      description: "education history",
      run: function () {
        var groups = data.education.map(function (e) {
          return (
            "<strong>Degree:</strong> " +
            e.degree +
            "<br><strong>Institution:</strong> " +
            e.institution +
            "<br><strong>Date:</strong> " +
            e.date
          );
        });
        return { type: "html", html: groups.join("<br><br>") };
      },
    },

    certifications: {
      aliases: ["certs"],
      description: "professional certifications",
      run: function () {
        var html = "<strong>Certifications:</strong><br><br>" + data.certifications.join("<br>");
        return { type: "html", html: html };
      },
    },

    skills: {
      aliases: [],
      description: "technical skills",
      run: function () {
        var groups = Object.keys(data.skills).map(function (category) {
          return "<strong>" + category + ":</strong> " + data.skills[category].join(", ");
        });
        return { type: "html", html: groups.join("<br><br>") };
      },
    },

    contact: {
      aliases: [],
      description: "how to reach me",
      run: function () {
        var p = data.profile;
        var lines = [
          "<strong>E-Mail:</strong> " + p.email,
          "<strong>LinkedIn:</strong> linkedin.com/" + p.linkedin,
        ];
        return { type: "html", html: lines.join("<br><br>") };
      },
    },

    clear: {
      aliases: ["cls"],
      description: "clear the terminal",
      run: function () {
        return { type: "clear" };
      },
    },

    resume: {
      aliases: ["download"],
      description: "download my CV as a PDF",
      run: function () {
        return {
          type: "html",
          html:
            'Preparing download...<br><a href="' +
            data.meta.resumePdfPath +
            '" target="_blank" rel="noopener">Download CV (PDF)</a>',
        };
      },
    },

    neofetch: {
      aliases: [],
      description: "system info, cloud-engineer style",
      run: function () {
        var firstJob = data.experience[data.experience.length - 1];
        var startYear = parseInt(firstJob.start.split(" ").pop(), 10);
        var years = new Date().getFullYear() - startYear;
        var lines = [
          "<strong>guest@mateuszgolebiewski</strong>",
          "------------------------",
          "<strong>OS:</strong> Platform Engineer 5.0 LTS",
          "<strong>Host:</strong> " + data.profile.location,
          "<strong>Uptime:</strong> ~" + years + " years in Cloud/DevOps",
          "<strong>Shell:</strong> zsh 5.10",
          "<strong>Languages:</strong> " + data.skills["Programming Languages"].join(", "),
          "<strong>IaC:</strong> " + data.skills["Infrastructure-as-Code"].join(", "),
          "<strong>Cloud:</strong> " + data.skills["Cloud"].join(", "),
        ];
        var html =
          '<div style="display:flex;gap:24px;flex-wrap:wrap;">' +
          '<pre style="margin:0;line-height:1.3;">' +
          neofetchArt().join("\n") +
          "</pre>" +
          "<div>" +
          lines.join("<br>") +
          "</div>" +
          "</div>";
        return { type: "html", html: html };
      },
    },

    sudo: {
      aliases: [],
      description: "??",
      run: function () {
        return {
          type: "lines",
          lines: ["guest is not in the sudoers file. This incident will be reported."],
        };
      },
    },

    ls: {
      aliases: [],
      description: "list directory contents",
      run: function () {
        return {
          type: "lines",
          lines: ["about.txt  experience/  education.txt  certifications.txt  skills.txt  resume.pdf"],
        };
      },
    },
  };

  CV.commandNames = (function () {
    var names = [];
    Object.keys(CV.commands).forEach(function (name) {
      names.push(name);
      CV.commands[name].aliases.forEach(function (a) {
        names.push(a);
      });
    });
    return names;
  })();

  CV.resolveCommand = function (name) {
    var lower = name.toLowerCase();
    if (CV.commands[lower]) return CV.commands[lower];
    var found = null;
    Object.keys(CV.commands).forEach(function (key) {
      if (found) return;
      if (CV.commands[key].aliases.indexOf(lower) !== -1) found = CV.commands[key];
    });
    return found;
  };
})();
