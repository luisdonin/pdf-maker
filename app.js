// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.min.js';

// Application state
let state = {
    pdfDoc: null,
    pdfBytes: null,
    currentPage: 1,
    scale: 1.5,
    fields: [],
    nextFieldId: 1,
    selectedFieldType: null,
    currentField: null,
    isDragging: false,
    isResizing: false,
    dragStartX: 0,
    dragStartY: 0,
    canvasOffset: { x: 0, y: 0 }
};

// DOM elements
const pdfUpload = document.getElementById('pdf-upload');
const uploadArea = document.getElementById('upload-area');
const pdfContainer = document.getElementById('pdf-container');
const pdfCanvas = document.getElementById('pdf-canvas');
const fieldsOverlay = document.getElementById('fields-overlay');
const fieldTools = document.getElementById('field-tools');
const addTextFieldBtn = document.getElementById('add-text-field');
const addCheckboxBtn = document.getElementById('add-checkbox');
const addDropdownBtn = document.getElementById('add-dropdown');
const downloadPdfBtn = document.getElementById('download-pdf');
const fieldModal = document.getElementById('field-modal');
const fieldNameInput = document.getElementById('field-name');
const fieldRequiredInput = document.getElementById('field-required');
const dropdownOptionsGroup = document.getElementById('dropdown-options-group');
const dropdownOptionsInput = document.getElementById('dropdown-options');
const saveFieldBtn = document.getElementById('save-field');
const cancelFieldBtn = document.getElementById('cancel-field');
const closeModalBtn = document.getElementById('close-modal');

// Event listeners
pdfUpload.addEventListener('change', handleFileUpload);
addTextFieldBtn.addEventListener('click', () => startAddingField('text'));
addCheckboxBtn.addEventListener('click', () => startAddingField('checkbox'));
addDropdownBtn.addEventListener('click', () => startAddingField('dropdown'));
downloadPdfBtn.addEventListener('click', generateAndDownloadPDF);
saveFieldBtn.addEventListener('click', saveFieldConfiguration);
cancelFieldBtn.addEventListener('click', closeFieldModal);
closeModalBtn.addEventListener('click', closeFieldModal);
fieldsOverlay.addEventListener('click', handleOverlayClick);

// Handle file upload
async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const arrayBuffer = await file.arrayBuffer();
        // Store a copy of the bytes that won't be detached
        const bytes = new Uint8Array(arrayBuffer);
        state.pdfBytes = bytes.slice(); // Create a copy
        
        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        state.pdfDoc = await loadingTask.promise;
        
        await renderPDF();
        
        uploadArea.style.display = 'none';
        pdfContainer.style.display = 'block';
        fieldTools.style.display = 'flex';
    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF. Please try again.');
    }
}

// Render PDF
async function renderPDF() {
    const page = await state.pdfDoc.getPage(state.currentPage);
    const viewport = page.getViewport({ scale: state.scale });
    
    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;
    fieldsOverlay.style.width = `${viewport.width}px`;
    fieldsOverlay.style.height = `${viewport.height}px`;
    
    const ctx = pdfCanvas.getContext('2d');
    await page.render({
        canvasContext: ctx,
        viewport: viewport
    }).promise;
    
    updateCanvasOffset();
    renderFields();
}

// Update canvas offset for accurate positioning
function updateCanvasOffset() {
    const rect = pdfCanvas.getBoundingClientRect();
    state.canvasOffset = {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
    };
}

// Start adding field
function startAddingField(type) {
    state.selectedFieldType = type;
    pdfCanvas.style.cursor = 'crosshair';
    
    // Remove previous click listener if any
    fieldsOverlay.removeEventListener('click', handleOverlayClick);
    fieldsOverlay.addEventListener('click', handleOverlayClick);
}

// Handle overlay click to place field
function handleOverlayClick(e) {
    if (!state.selectedFieldType) return;
    
    const rect = fieldsOverlay.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Default dimensions based on field type
    let width, height;
    switch (state.selectedFieldType) {
        case 'text':
            width = 200;
            height = 30;
            break;
        case 'checkbox':
            width = 20;
            height = 20;
            break;
        case 'dropdown':
            width = 200;
            height = 30;
            break;
    }
    
    const field = {
        id: state.nextFieldId++,
        type: state.selectedFieldType,
        x: x,
        y: y,
        width: width,
        height: height,
        name: '',
        required: false,
        options: []
    };
    
    state.currentField = field;
    state.selectedFieldType = null;
    pdfCanvas.style.cursor = 'default';
    
    openFieldModal(field);
}

// Open field configuration modal
function openFieldModal(field) {
    document.getElementById('modal-title').textContent = `Configure ${field.type.charAt(0).toUpperCase() + field.type.slice(1)} Field`;
    fieldNameInput.value = field.name || '';
    fieldRequiredInput.checked = field.required || false;
    
    if (field.type === 'dropdown') {
        dropdownOptionsGroup.style.display = 'block';
        dropdownOptionsInput.value = field.options.join('\n');
    } else {
        dropdownOptionsGroup.style.display = 'none';
    }
    
    fieldModal.style.display = 'flex';
}

// Close field configuration modal
function closeFieldModal() {
    fieldModal.style.display = 'none';
    state.currentField = null;
}

// Save field configuration
function saveFieldConfiguration() {
    if (!state.currentField) return;
    
    const name = fieldNameInput.value.trim();
    if (!name) {
        alert('Please enter a field name');
        return;
    }
    
    state.currentField.name = name;
    state.currentField.required = fieldRequiredInput.checked;
    
    if (state.currentField.type === 'dropdown') {
        const options = dropdownOptionsInput.value.split('\n')
            .map(opt => opt.trim())
            .filter(opt => opt.length > 0);
        
        if (options.length === 0) {
            alert('Please enter at least one option for the dropdown');
            return;
        }
        
        state.currentField.options = options;
    }
    
    state.fields.push(state.currentField);
    renderFields();
    closeFieldModal();
}

// Render all fields
function renderFields() {
    fieldsOverlay.innerHTML = '';
    
    state.fields.forEach(field => {
        const fieldElement = createFieldElement(field);
        fieldsOverlay.appendChild(fieldElement);
    });
}

// Create field element
function createFieldElement(field) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'field-box';
    fieldDiv.style.left = `${field.x}px`;
    fieldDiv.style.top = `${field.y}px`;
    fieldDiv.style.width = `${field.width}px`;
    fieldDiv.style.height = `${field.height}px`;
    fieldDiv.dataset.fieldId = field.id;
    
    const label = document.createElement('span');
    label.className = 'field-label';
    let icon = '';
    switch (field.type) {
        case 'text':
            icon = '📝';
            break;
        case 'checkbox':
            icon = '☑️';
            break;
        case 'dropdown':
            icon = '📋';
            break;
    }
    label.textContent = `${icon} ${field.name}`;
    fieldDiv.appendChild(label);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'field-delete';
    deleteBtn.textContent = '×';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteField(field.id);
    };
    fieldDiv.appendChild(deleteBtn);
    
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'field-resize';
    fieldDiv.appendChild(resizeHandle);
    
    // Drag functionality
    fieldDiv.addEventListener('mousedown', (e) => {
        if (e.target === resizeHandle) {
            startResize(e, field);
        } else if (e.target !== deleteBtn) {
            startDrag(e, field);
        }
    });
    
    return fieldDiv;
}

// Start dragging field
function startDrag(e, field) {
    if (e.target.classList.contains('field-delete')) return;
    
    state.isDragging = true;
    state.currentField = field;
    state.dragStartX = e.clientX - field.x;
    state.dragStartY = e.clientY - field.y;
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    
    e.preventDefault();
}

// Handle drag
function handleDrag(e) {
    if (!state.isDragging || !state.currentField) return;
    
    const rect = fieldsOverlay.getBoundingClientRect();
    let newX = e.clientX - rect.left - (state.dragStartX - state.currentField.x);
    let newY = e.clientY - rect.top - (state.dragStartY - state.currentField.y);
    
    // Constrain to canvas bounds
    newX = Math.max(0, Math.min(newX, rect.width - state.currentField.width));
    newY = Math.max(0, Math.min(newY, rect.height - state.currentField.height));
    
    state.currentField.x = newX;
    state.currentField.y = newY;
    
    renderFields();
}

// Stop dragging
function stopDrag() {
    state.isDragging = false;
    state.currentField = null;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
}

// Start resizing field
function startResize(e, field) {
    state.isResizing = true;
    state.currentField = field;
    state.dragStartX = e.clientX;
    state.dragStartY = e.clientY;
    
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
    
    e.preventDefault();
    e.stopPropagation();
}

// Handle resize
function handleResize(e) {
    if (!state.isResizing || !state.currentField) return;
    
    const deltaX = e.clientX - state.dragStartX;
    const deltaY = e.clientY - state.dragStartY;
    
    const newWidth = Math.max(20, state.currentField.width + deltaX);
    const newHeight = Math.max(20, state.currentField.height + deltaY);
    
    state.currentField.width = newWidth;
    state.currentField.height = newHeight;
    
    state.dragStartX = e.clientX;
    state.dragStartY = e.clientY;
    
    renderFields();
}

// Stop resizing
function stopResize() {
    state.isResizing = false;
    state.currentField = null;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
}

// Delete field
function deleteField(fieldId) {
    state.fields = state.fields.filter(f => f.id !== fieldId);
    renderFields();
}

// Generate and download PDF with form fields
async function generateAndDownloadPDF() {
    if (!state.pdfBytes || state.fields.length === 0) {
        alert('Please add at least one field before downloading');
        return;
    }
    
    try {
        // Load the PDF with pdf-lib
        const pdfDoc = await PDFLib.PDFDocument.load(state.pdfBytes);
        const form = pdfDoc.getForm();
        
        // Get the first page
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        
        // Calculate scale factor (PDF.js rendered size vs actual PDF size)
        const canvasWidth = pdfCanvas.width;
        const scaleX = width / canvasWidth;
        const scaleY = height / pdfCanvas.height;
        
        // Add form fields
        state.fields.forEach(field => {
            // Convert coordinates (canvas to PDF coordinates)
            // PDF coordinates start from bottom-left, canvas from top-left
            const pdfX = field.x * scaleX;
            const pdfY = height - (field.y * scaleY) - (field.height * scaleY);
            const pdfWidth = field.width * scaleX;
            const pdfHeight = field.height * scaleY;
            
            try {
                switch (field.type) {
                    case 'text':
                        const textField = form.createTextField(field.name);
                        textField.addToPage(firstPage, {
                            x: pdfX,
                            y: pdfY,
                            width: pdfWidth,
                            height: pdfHeight,
                            borderWidth: 1,
                            borderColor: PDFLib.rgb(0.4, 0.5, 0.9)
                        });
                        if (field.required) {
                            textField.enableRequired();
                        }
                        break;
                        
                    case 'checkbox':
                        const checkbox = form.createCheckBox(field.name);
                        checkbox.addToPage(firstPage, {
                            x: pdfX,
                            y: pdfY,
                            width: pdfWidth,
                            height: pdfHeight,
                            borderWidth: 1,
                            borderColor: PDFLib.rgb(0.4, 0.5, 0.9)
                        });
                        if (field.required) {
                            checkbox.enableRequired();
                        }
                        break;
                        
                    case 'dropdown':
                        const dropdown = form.createDropdown(field.name);
                        dropdown.addOptions(field.options);
                        dropdown.addToPage(firstPage, {
                            x: pdfX,
                            y: pdfY,
                            width: pdfWidth,
                            height: pdfHeight,
                            borderWidth: 1,
                            borderColor: PDFLib.rgb(0.4, 0.5, 0.9)
                        });
                        if (field.required) {
                            dropdown.enableRequired();
                        }
                        break;
                }
            } catch (error) {
                console.error(`Error adding field ${field.name}:`, error);
            }
        });
        
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        
        // Download
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'form-filled.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('PDF downloaded successfully!');
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (state.pdfDoc) {
        updateCanvasOffset();
    }
});

// Handle scroll
window.addEventListener('scroll', () => {
    if (state.pdfDoc) {
        updateCanvasOffset();
    }
});
