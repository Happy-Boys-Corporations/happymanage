document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const pageSections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Get the target section ID from href
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Remove 'active' class from all links and sections
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            pageSections.forEach(section => section.classList.remove('active'));

            // Add 'active' class to the clicked link and target section
            link.classList.add('active');
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});