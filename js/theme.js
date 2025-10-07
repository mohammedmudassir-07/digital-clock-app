const themeToggle = document.getElementById('theme-toggle');
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}
themeToggle.onclick = function() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
};
(function() {
    const saved = localStorage.getItem('theme');
    setTheme(saved || 'dark');
})(); 