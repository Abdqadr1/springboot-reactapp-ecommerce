
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; 
import { useEffect } from 'react';
const TextEditor = ({placeholder, text, setText, disabled, width, height}) => {
  const theme = 'snow';
  // const theme = 'bubble';  
  const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: [] }],

    [{ list: 'ordered'}, { list: 'bullet' }],
    [{ indent: '-1'}, { indent: '+1' }],

    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['link', 'image', 'video'],
    [{ color: [] }, { background: [] }],

    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
}
 
  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'indent',
    'size', 'header',
    'link', 'image', 'video',
    'color', 'background',
    'clean',
  ]
  const { quill, quillRef } = useQuill({ theme, modules, formats, placeholder, readOnly: disabled });
  useEffect(() => {
    if (quill) {
        quill.clipboard.dangerouslyPasteHTML( text );
        quill.on('text-change', (delta, oldDelta, source) => {
          setText(quill.root.innerHTML);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill, text]);





return (
  <div className={`mb-5 text-editor ${width} ${height} px-0`}>
    <div>
          <div style={{ height:'300px', maxHeight: '300px', overflow: 'auto' }} ref={quillRef} />
    </div>
  </div>
  
);
     
}

export default TextEditor;