import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
const TextEditor = ({placeholder, text, setText}) => {


  function handleChange(value) {
    setText(value);
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }
 
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]


return (
  <ReactQuill
    theme="snow"
    className="mb-5 text-editor"
    value={text}
    onChange={handleChange}
    placeholder={placeholder}
    modules={modules}
    formats={formats}
  />
);
     
}

export default TextEditor;