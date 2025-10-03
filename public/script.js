document.addEventListener("DOMContentLoaded", () => {
  const letter = document.getElementById("letter");
  const modal = document.getElementById("code-modal");
  const codeInput = document.getElementById("code-input");
  const codeSubmit = document.getElementById("code-submit");
  const codeCancel = document.getElementById("code-cancel");
  const errorMsg = document.getElementById("error-msg");
  const form = document.getElementById("rsvp-form");
  const msg = document.getElementById("form-msg");

  const ACCESS_CODE = "nisabela";
  let openedOnce = false;

  // Abrir modal
  letter.addEventListener("click", () => {
    if (!openedOnce) {
      modal.hidden = false;
      codeInput.focus();
    }
  });

  // Fechar modal
  codeCancel.addEventListener("click", () => {
    modal.hidden = true;
    codeInput.value = "";
    errorMsg.textContent = "";
  });

  // Validar código
  codeSubmit.addEventListener("click", () => {
    if (codeInput.value === ACCESS_CODE) {
      modal.hidden = true;
      letter.classList.add("open");
      errorMsg.textContent = "";
      openedOnce = true;
    } else {
      errorMsg.textContent = "Código incorreto!";
    }
  });

  codeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") codeSubmit.click();
  });

  // --- RSVP FORM ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name-input").value.trim();
    const presence = form.querySelector("input[name='presence']:checked")?.value;

    if (!name || !presence) {
      msg.textContent = "Por favor, preencha todos os campos.";
      msg.style.color = "red";
      return;
    }

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, presence })
      });

      const data = await res.json();
      if (data.success) {
        msg.textContent = "✅ Confirmação registrada com sucesso!";
        msg.style.color = "green";
        form.reset();
      } else {
        msg.textContent = "❌ Erro ao registrar confirmação.";
        msg.style.color = "red";
      }
    } catch (err) {
      msg.textContent = "⚠️ Erro de conexão com o servidor.";
      msg.style.color = "red";
    }
  });



  // --- FOLHAS ---
  function createLeaf() {
    const leaf = document.createElement("span");
    leaf.classList.add("leaf");

    // posição e tempo
    leaf.style.left = (Math.random() * 100) + "vw";
    leaf.style.setProperty("--fall-duration", `${6 + Math.random() * 6}s`);

    const glyph = document.createElement("span");
    glyph.classList.add("leaf-glyph");

    const emojis = ["🍃", "🍂", "🍁"];
    glyph.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    glyph.style.setProperty("--sway-duration", `${2 + Math.random() * 3}s`);
    glyph.style.setProperty("--spin-duration", `${5 + Math.random() * 5}s`);
    glyph.style.setProperty("--size", `${1 + Math.random() * 2}rem`);

    leaf.appendChild(glyph);
    document.body.appendChild(leaf);

    setTimeout(() => leaf.remove(), 13000);
  }

  function spawnLeaves(count = 3) {
    for (let i = 0; i < count; i++) createLeaf();
  }

  setInterval(() => spawnLeaves(3), 700);
});
