export function caveatLink(link_id = "caveat-link", info_boxes_id = "info-boxes", info_index = 0) {
    const caveat_link = document.getElementById(link_id);

    if (!caveat_link) return;

    const open_info_box = () => {
        const info_boxes = document.getElementById(info_boxes_id);

        if (!info_boxes) return;

        info_boxes.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        const info_button = info_boxes.querySelector(`.info-tab-btn[data-index="${info_index}"]`);

        const info_open = info_button?.getAttribute("aria-expanded") === "true";

        if (!info_open) {
            info_button?.click();
        }
    };

    caveat_link.addEventListener("click", (e) => {
        e.preventDefault();
        open_info_box();
    });

    caveat_link.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open_info_box();
        }
    });
}