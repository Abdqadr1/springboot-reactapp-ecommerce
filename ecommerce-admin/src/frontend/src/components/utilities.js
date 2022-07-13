import axios from "axios";
import { Col, Row, Spinner } from "react-bootstrap";

export  function alterArrayEnable(allUser, id, status, callback){
    const user = allUser.find((u) => id === u.id);
    user.enabled = status;
    callback([...allUser])
}

export function alterArrayDelete(allUser, id, callback) {
    const newUsers = allUser.filter(user => user.id !== id)
    callback(newUsers)
}

export function alterArrayUpdate(user, callback) {
    callback([user])
}

export function alterArrayAdd(allUser, user, callback) {
    allUser.push(user)
    callback([...allUser])
}

export function showThumbnail(file, setImage, type="thumbnail", id=0, setType="thumbnail") {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
        const image = <img src={event.target.result} alt={type} className={setType} />
        if (type.indexOf("thumbnail") > -1) {
            setImage(image);
        } else {
            setImage(state => {
                state[id] = image;
                return [...state];
            })
        }
    }
    fileReader.readAsDataURL(file);
}

export function listFormData(data){
      for (const pair of data.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
}


export function isFileValid(file, input) {
    if (file.size > 1048576) {
        input.setCustomValidity("Image size should not be larger than 1MB");
        input.reportValidity();
        return false;
    }
    if (file.type !== "image/png" && file.type !== "image/jpg" && file.type !== "image/jpeg") {
        input.setCustomValidity("File type not supported, Use png, jpg or jpeg");
        input.reportValidity();
        return false;
    }
    input.setCustomValidity("")
    return true;
}

export const SPINNERS_BORDER = <Spinner animation="border" size="sm" className="d-block m-auto" style={{width: "4rem", height: "4rem"}} />
export const SPINNERS_GROW = <Spinner animation="grow" size="sm" />
export const SPINNERS_BORDER_HTML = `<div class="spinner-border spinner-border-sm text-dark" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`
export const SPINNERS_GROW_HTML = `<div class="spinner-grow spinner-grow-sm text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`
export const SEARCH_ICON = `<i class="bi bi-search"></i>`;

export const getFormData = (form) => {
    return Object.keys(form).reduce((formData, key) => {
        if (key === 'roles') {
                formData.append(key, form[key].map(role => role.id ?? role))
        } else if(key === "product_images"){
            const productImages =  form[key];
            if(productImages.length > 0){
                form[key].forEach((f, i) => {
                    if(i === 0){
                        formData.append("image", f);
                    } else {
                        formData.append("extra_image", f);
                    }
                })
            }
            
        }else{ 
            formData.append(key, form[key]);
        }
        return formData
    }, new FormData());
}

export const isAuthValid = (auth) => {
    if (auth?.accessToken && auth?.id) return true
    
    return false
}

export const getAccessToken = () => {
    return JSON.parse(localStorage.getItem("user")).accessToken
}

export const isTokenExpired = (response) => {
    if(response === null || response === undefined) return false;
    const message = response.data.message.toLowerCase()
    if (Number(response.status) === 400
        && message.indexOf("token") > -1
        && message.indexOf("expired") > -1) return true
    
    return false
}

export const hasAnyAuthority = (auth, roles) => {
    return auth.roles.some(role => {
        return isInArray(role.name, roles)
    })
}
export const hasOnlyAuthority =(auth, role) => {
    if (auth.roles.length > 1) return false;
    return auth.roles[0].name === role;
}
export const hasThisNotThese = (auth, role, not) => {
    if (auth.roles.some(r => r.name === role)) {
        if (hasAnyAuthority(auth, not)) return false;
        return true;
    }
    return false;
}

export const isInArray = (needle, haystack) => {
    for (let i = 0; i < haystack.length; i++){
        if(needle === haystack[i]) return true
    }
    return false
}

export const getCategoriesWithHierarchy = async (token) => {
    let hierarchies;
    const url = process.env.REACT_APP_SERVER_URL + "category/get-hierarchy";
    await axios.get(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        const data = response.data;
        localStorage.setItem("hierarchies", JSON.stringify(data))
        hierarchies = data
    })
    .catch(error => {
        console.error("Could not get categories hierarchy")
        console.error(error.response)
    })
    return hierarchies
}

export function formatDate(date, dateStyle="short", timeStyle="short") {
    if (date) {
        const formatter = new Intl.DateTimeFormat("en-US", {dateStyle, timeStyle});
         return formatter.format(new Date(date))
    }
    return "";
}
 // eslint-disable-next-line no-unused-vars
 const formatDateForInput = (val, separator = "-") => {
        if (!val) return "";
        const parts = Intl.DateTimeFormat("en", { month: "2-digit", day: "2-digit", year: "numeric" }).formatToParts(new Date(val))
        const year = parts[4].value;
        const month = parts[0].value;
        const day = parts[2].value;
        const str = `${year}${separator}${month}${separator}${day}`;
        return str;
}

export const formatPrice = (price, s, m, t, pos) => {
    if (!s) return 0;
    t = t === "COMMA" ? "," : ".";
    if (price || price === 0) {
        const re = '\\d(?=(\\d{3})' + (m > 0 ? '\\.' : '$') + ')';
        let f = price.toFixed(Math.max(0, ~~m)).replace(new RegExp(re, 'g'), '$&' + t);
        if (pos.toLowerCase().startsWith("before")) {
            return `${s}${f}`;
        } else {
            return `${f}${s}`;
        }
    }
    
}
export const getShortName = (name, len=60) => {
    if(name.length > len){
        return name.substring(0,len) + "...";
    }
    return name;
}
export const getPrices = (discount, price, realPrice, formatPrice) => {
    if(discount > 0){
        return (
          <h5 className="text-dark text-start fw-bold fs-6">
            <span>{formatPrice(realPrice)}</span>
            <del className="text-danger mx-2">{formatPrice(price)}</del>
          </h5>
        );
    }
    return (
      <h5 className="text-dark text-start fw-bold">
        <span>{formatPrice(price)}</span>
      </h5>
    );
}

export function listProducts(results, keyword, formatPrice, handler){
    if(results.length > 0){
        return (
            <>
                <h3 className="mt-4 mb-2"> Search Results for "{keyword}"</h3>
                <Row className="justify-content-around p-4 mx-0">
                    {
                        results.map((p) => (
                            <Col onClick={e=>handler(p)} key={p.name} xs={6} sm={4} md={3} lg={2} xlg={2} className="cs mx-1 border rounded">
                                <img loading="lazy" src={p.mainImage} alt={getShortName(p.name, 10)} className="product-image" />
                                <h5 className="my-2 text-primary text-start">{getShortName(p.name)}</h5>
                                {getPrices(p.discountPrice, p.price, p.realPrice, formatPrice)}
                            </Col>
                        ))
                    }
                </Row>
            </>
        );
    } else {
        return <h4 className="text-center"> No products </h4>
    }
}