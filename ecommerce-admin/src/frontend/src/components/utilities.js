import { Spinner } from "react-bootstrap";

export  function alterArrayEnable(allUser, id, status, callback){
    const index = allUser.findIndex((u) => id === u.id);
    const user = allUser[index];
    user.enabled = status;
    callback([...allUser])
}

export function alterArrayDelete(allUser, id, callback) {
    const newUsers = allUser.filter(user => user.id !== id)
    callback(newUsers)
}

export function alterArrayUpdate(allUser, user, callback) {
    const index = allUser.findIndex(u => user.id === u.id);
    allUser[index] = user;
    callback([...allUser])
}

export function alterArrayAdd(allUser, user, callback) {
    allUser.push(user)
    callback([...allUser])
}

export function showThumbnail(file, setImage) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
        const image = <img src={event.target.result} alt="thumbnail" className="thumbnail" />
        setImage(image);
    }
    fileReader.readAsDataURL(file);
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

export const SPINNERS_BORDER = <Spinner animation="border" size="sm" />
export const SPINNERS_GROW = <Spinner animation="grow" size="sm" />
export const SPINNERS_BORDER_HTML = `<div class="spinner-border spinner-border-sm text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`
export const SPINNERS_GROW_HTML = `<div class="spinner-grow spinner-grow-sm text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`