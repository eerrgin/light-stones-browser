(function () {
  "use strict";
  var form = document.getElementById("address-form");
  var input = document.getElementById("address");
  if (!form || !input) return;

  function destination(value) {
    var text = value.trim();
    if (!text) return null;
    if (/^(https?:\/\/)/i.test(text)) {
      try {
        var parsed = new URL(text);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.href;
      } catch (error) {}
    }
    if (/^(localhost|[\w-]+\.[a-z]{2,})(:\d+)?([/?#].*)?$/i.test(text)) {
      try { return new URL("https://" + text).href; } catch (error) {}
    }
    return "https://duckduckgo.com/?q=" + encodeURIComponent(text);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var target = destination(input.value);
    if (target) window.open(target, "_blank", "noopener,noreferrer");
  });
})();