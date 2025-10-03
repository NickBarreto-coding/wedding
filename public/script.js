document.addEventListener("DOMContentLoaded", () => {
  const letter = document.getElementById("letter");
  const modal = document.getElementById("code-modal");
  const codeInput = document.getElementById("code-input");
  const codeSubmit = document.getElementById("code-submit");
  const codeCancel = document.getElementById("code-cancel");
  const errorMsg = document.getElementById("error-msg");
  const form = document.getElementById("rsvp-form");
  const msg = document.getElementById("form-msg");

  const ACCESS_CODE = "2026"; // 🔑 código correto
  let openedOnce = false; // bloqueio do primeiro clique

  // Ao clicar na carta → abre o modal
  letter.addEventListener("click", () => {
    if (!openedOnce) {
      modal.hidden = false;
      codeInput.focus();
    }
  });

  // Botão de fechar modal
  codeCancel.addEventListener("click", () => {
    modal.hidden = true;
    codeInput.value = "";
    errorMsg.textContent = "";
  });

  // Enviar código
  codeSubmit.addEventListener("click", () => {
    if (codeInput.value === ACCESS_CODE) {
      modal.hidden = true;
      letter.classList.add("open"); // mostra conteúdo
      errorMsg.textContent = "";
      openedOnce = true; // impede reabertura
    } else {
      errorMsg.textContent = "Código incorreto!";
    }
  });

  // Pressionar Enter dentro do input também valida
  codeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      codeSubmit.click();
    }
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
});
