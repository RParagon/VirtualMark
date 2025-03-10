import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export const defaultEditorConfig = {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  },
  formats: [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ],
  style: {
    backgroundColor: '#1F2937',
    color: '#fff',
    borderRadius: '0.5rem',
    border: '1px solid #374151',
    minHeight: '200px',
    maxHeight: '400px',
    overflow: 'auto',
    '& .ql-toolbar': {
      borderBottom: '1px solid #374151',
      backgroundColor: 'rgba(31, 41, 55, 0.5)'
    },
    '& .ql-container': {
      fontSize: '14px',
      lineHeight: '1.5'
    },
    '& .ql-editor': {
      padding: '1rem',
      minHeight: '200px',
      maxHeight: '400px',
      overflow: 'auto'
    }
  }
}

export { ReactQuill as Editor }
