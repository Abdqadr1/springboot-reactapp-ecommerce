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

export function showThumbnail(file, setImage) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
        const image = <img src={event.target.result} alt="thumbnail" className="thumbnail" />
        setImage(image);
    }
    fileReader.readAsDataURL(file);
}