import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
const TextEditor = ({placeholder, form, name, text, setText}) => {


  function handleChange(value) {
    setText(value);
    form[name] = value;
  }


return <ReactQuill theme="snow" className="mb-5 text-editor" value={text} 
    onChange={handleChange}
    placeholder={placeholder}
        />;
     
}

export default TextEditor;