// Mobile Nav Tabs Active State
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.mm-tabs .tab');
    const panes = document.querySelectorAll('.mm-tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Add active class to the clicked tab and corresponding pane
            tab.classList.add('active');
                const targetPane = document.querySelector(tab.getAttribute('data-target'));
                if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
});