/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */
import { createOrderData, state, updateDragging } from "./data";
import { createOrderHtml, html,moveToColumn,updateDraggingHtml } from "./view";


const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}

const handleDragStart = (event) => {}
const handleDragEnd = (event) => {}

const handleHelpToggle = (event) => {
        event.preventDefault();
        if (html.help.overlay.display === "none") {
            html.help.overlay.display = "block";
        } else {
            html.help.overlay.display = "none";
        }
    };

const handleAddToggle = (event) => { 
    event.preventDefault()
    handleAddToggle.focus();
    document.addEventListener("keydown", function(event) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            addButton.click();
        }
    });
}
const handleEditToggle = (event) => {}
const handleEditSubmit = (event) => {}
const handleDelete = (event) => {}

const handleAddSubmit =(event) => {
    event.preventDefault(); 
    const title = html.add.form.title.value;
    const table = html.add.form.table.value;
    if (!title || !table) {
        alert("Please fill in both title and table.");
        return;
    }
    const newOrder = createOrderData({
        title,
        table,
        column: "ordered"
    });
    state.orders[newOrder.id] = newOrder;
    html.add.overlay.close();
    html.columns.ordered.appendChild(createOrderHtml(newOrder));
};


html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}