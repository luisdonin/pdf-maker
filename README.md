# PDF Form Builder

A web-based application that allows users to upload PDF documents and add interactive form fields (text boxes, checkboxes, and dropdowns) to create fillable PDF forms.

## Features

- 📄 **PDF Upload & Display**: Upload any PDF file and view it in the browser
- 🖱️ **Visual Form Field Placement**: Click to add form fields directly on the PDF
- 📝 **Multiple Field Types**: Support for text fields, checkboxes, and dropdown menus
- ✏️ **Drag & Resize**: Move and resize fields to perfect positioning
- 💾 **Field Metadata**: Configure field names, required status, and dropdown options
- ⬇️ **Download Fillable PDF**: Generate and download the PDF with interactive form fields

## Installation

1. Clone the repository:
```bash
git clone https://github.com/luisdonin/pdf-maker.git
cd pdf-maker
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Running the Application

Start the local web server:
```bash
npm start
```

Then open your browser and navigate to:
```
http://localhost:8080
```

### Using the PDF Form Builder

1. **Upload a PDF**:
   - Click the "Upload PDF" button or drag and drop a PDF file
   - The PDF will be displayed in the viewer

2. **Add Form Fields**:
   - Click one of the field type buttons (Text, Checkbox, or Dropdown)
   - Click on the PDF where you want to place the field
   - Configure the field in the modal:
     - Enter a unique field name
     - For dropdowns, add options (one per line)
     - Optionally mark as required
   - Click "Save Field"

3. **Move and Resize Fields**:
   - Click and drag a field to move it
   - Drag the resize handle (bottom-right corner) to resize
   - Click the × button to delete a field

4. **Download Your Form**:
   - Click the "Download PDF" button
   - Your PDF with interactive form fields will be downloaded
   - Open the downloaded PDF in any PDF reader to fill out the form

## Technologies Used

- **PDF.js**: For rendering PDFs in the browser
- **pdf-lib**: For creating and modifying PDF documents with form fields
- **Vanilla JavaScript**: No framework dependencies
- **HTML5 & CSS3**: Modern, responsive interface

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript
- HTML5 Canvas
- File API
- Blob API

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Project Structure

```
pdf-maker/
├── index.html      # Main HTML file with UI structure
├── styles.css      # Styling and layout
├── app.js          # Application logic and PDF handling
├── package.json    # Dependencies and scripts
└── README.md       # This file
```

## Development

The application uses CDN-hosted libraries for PDF.js and pdf-lib, so no build process is required. Simply edit the files and refresh your browser.

### Key Files

- `index.html`: Contains the UI structure including upload area, toolbar, PDF viewer, and field configuration modal
- `styles.css`: All styling including responsive design and visual effects
- `app.js`: Core application logic including:
  - PDF loading and rendering
  - Field placement and management
  - Drag and drop functionality
  - PDF generation with form fields

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Built with ❤️ for creating fillable PDF forms easily