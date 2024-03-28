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
import { COLUMNS, createOrderData, state, updateDragging } from './data.js'

import { createOrderHtml, html,moveToColumn } from './view.js'

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


const handleDragStart = (event) => {
    const {id} = event.target.dataset;
    const {column} = state.orders[id];
    updateDragging({source:id,over:column})
}
const handleDragEnd = (event) => {
    event.preventDefault();
    const {source,over} = state.dragging
    moveToColumn(source,over);
}

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

const handleEditToggle = (event) => {
    const parentElement = event.target.closest('.order');
    if (parentElement && parentElement.matches(".order")) {
        const id = parentElement.getAttribute('data-id');
        const order = state.orders[id];

        // Update the form values with the order data
        html.edit.form.id.value = id;
        html.edit.form.title.value = order.itemTitle;
        html.edit.form.table.value = order.selectedTable;
        html.edit.form.column.value = order.selectedStatus;
    }

    // Close the edit overlay if cancel button is clicked
    if (event.target.getAttribute('data-edit-cancel')) {
        html.edit.overlay.open = false;
    }
};

const handleEditSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Clear the current HTML in each column
    Object.values(html.columns).forEach(column => {
        column.innerHTML = "";
    });

    // Rebuild the HTML for each order and append to the respective column
    Object.values(state.orders).forEach(order => {
        const element = createOrderHtml(order);
        html.columns[order.column].appendChild(element);
    });

    // Reset the form and close the edit overlay
    html.edit.form.reset();
    html.edit.overlay.removeAttribute('open');
};

  
const handleDelete = (event) => {
    event.preventDefault()
     const id = html.edit.id.getAttribute('data-edit-id');
     delete state.orders[id]; 
     handleEditSubmit();}

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