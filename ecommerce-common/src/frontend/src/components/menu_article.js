import axios from "axios";
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { useParams } from "react-router";
import { SPINNERS_BORDER } from "./utilities";
import "../css/menu.css";
import useSettings from "./use-settings";

const MenuArticle = () => {
    const {alias} = useParams();
    const [isLoading, setLoading] = useState(true);
    const [article, setArticle] = useState(null);
    const [divRef, loadRef] = [useRef(), useRef()];
    
    const {SITE_NAME} = useSettings();
    useEffect(() => {
        document.title = `${alias} - ${SITE_NAME}`; 
        loadRef?.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alias]);

    useLayoutEffect(()=>{
        const abortController = new AbortController();
        const url = process.env.REACT_APP_SERVER_URL + "menu";
        axios.get(`${url}/alias/${encodeURIComponent(alias)}`, {signal: abortController.signal})
        .then(response => {
            setArticle(response.data);
        })
        .catch(error => {setArticle(null)
        }).finally(()=> {setLoading(false)});

        return ()=> abortController.abort();
  }, [alias]);

  useEffect(()=> {
    if(divRef.current){
        divRef.current.focus()
    }
  }, [divRef])

  const display = () => {
    if(article){
        return <div id="div-ref" tabIndex="455" ref={divRef} className="px-3 py-2 text-start" dangerouslySetInnerHTML={{__html:  article.content}}></div>
    } else {
        return <div className="no-article">
            <h4 className="text-secondary">This article can not be found</h4>
        </div>
    }
  }

    return (
        <>
            <div className="loadRef" tabIndex="22" ref={loadRef}></div>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "30vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    : display()
            }
         </>
     );
}
 
export default MenuArticle;