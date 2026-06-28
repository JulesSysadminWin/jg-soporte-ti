console.log("JG Soporte TI cargado correctamente");

// Resalta el enlace del menú según la sección visible.
const links = document.querySelectorAll(".menu a");
const sections = [...links].map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => link.classList.remove("active"));
    const active = document.querySelector(`.menu a[href="#${entry.target.id}"]`);
    if (active) active.classList.add("active");
  });
}, { threshold: 0.4 });

sections.forEach(section => observer.observe(section));
