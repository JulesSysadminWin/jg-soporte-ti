console.log("JG Soporte TI cargado correctamente");

// Resalta el enlace del menú según la sección visible. Ignora enlaces externos o páginas internas.
const links = document.querySelectorAll(".menu a");
const sectionLinks = [...links].filter(link => (link.getAttribute("href") || "").startsWith("#"));
const sections = sectionLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => link.classList.remove("active"));
      const active = document.querySelector(`.menu a[href="#${entry.target.id}"]`);
      if (active) active.classList.add("active");
    });
  }, { threshold: 0.35 });

  sections.forEach(section => observer.observe(section));
}
