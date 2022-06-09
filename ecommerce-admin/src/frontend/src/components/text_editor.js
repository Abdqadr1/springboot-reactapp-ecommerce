import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
const TextEditor = ({placeholder, text, setText, disabled, width, height}) => {


  function handleChange(value) {
    if(setText) setText(value)
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' },
        { 'background': [] }, { 'color': ['#f8f9fa', '##212529','#198754','#ffc107', '#6c757d', '#dc3545','#343a40','#0d6efd', '#198754', 'custom-color'] },
      ],
      
      ['link', 'image'],
      ['clean']
    ],
  }
 
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent','align',
    'link', 'image', 'background', 'color'
  ]


return (
  <ReactQuill
    readOnly={disabled ?? false}
    theme="snow"
    className={`mb-5 text-editor ${width} ${height}`}
    value={text}
    onChange={handleChange}
    placeholder={placeholder ?? ""}
    modules={modules}
    formats={formats}
  />
);
     
}

export default TextEditor;