document.querySelector(".signup-form")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const button = event.currentTarget.querySelector("button");
  const initialText = button.textContent;

  button.textContent = "Готово";
  button.disabled = true;

  setTimeout(() => {
    button.textContent = initialText;
    button.disabled = false;
  }, 1800);
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
  });
});
