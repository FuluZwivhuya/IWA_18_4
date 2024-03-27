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
import { createOrderData, state } from './data.js'

import { createOrderHtml, html } from './view.js'

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
        if (html.help.overlay.open) {
            html.help.overlay.close();
        } else {
            html.help.overlay.showModal(); // Show the overlay
        }
    };
    

const handleAddToggle = (event) => {
    event.preventDefault()
    if (html.add.overlay.display) {
        html.add.overlay.display
    } else {
        html.add.overlay.show()
    }
}

html.add
const handleAddSubmit = (event) => {
    event.preventDefault()
    const title = html.add.form.title.value
    const table = html.add.form.table.value

    if (!title || !table) return
    const newOrder = createOrderData({
        title, 
        table,
        column: 'ordered'
    })
    state.orders[newOrder.id] = newOrder 
    html.add.overlay.close()
    html.columns.ordered.appendChild(createOrderHtml(newOrder))
}

// Here I will mount the cards to columns based off the state
// console.log("State: ",  state)
const overlay = document.querySelector('[data-edit-overlay]');
const handleEditToggle = (event) => {
    event.preventDefault()
    overlay.classList.toggle('visible')
}
const handleEditSubmit = (event) => {
    event.preventDefault();

    const itemId = html.edit.id.value; 
    const itemTitle = html.edit.title.value;
    const selectedTable = html.edit.table.value;
    const selectedStatus = html.edit.column.value;
  
    state.orders[itemId].title = itemTitle;
    state.orders[itemId].table = selectedTable;
    state.orders[itemId].column = selectedStatus;
    handleEditToggle();
  };

const handleDelete = (event) => {
    const orderId = html.edit.id.value;
    handleEditToggle();}

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