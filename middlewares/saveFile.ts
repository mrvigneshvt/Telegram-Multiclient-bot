import logger from "./logger.js";

const saveFile = async (file: any, caption: any, name: any, done: any, skip: any) => {
    try {
        const file_name = file.fileName.replace(/[_\-\.+]/g, ' ');
        const media = {
            fileName: file_name,
            fileSize: file.fileSize,
            fileId: file.fileId,
            fileUniqueId: file.fileUniqueId,
            fileType: file.fileType,
            mimeType: file.mimeType,
            caption: caption,
        }
        const db = await name.create(media)
        if (db) {
            done.value += 1
        }
        //console.log(db)


    } catch (err) {
        skip.value += 1
        console.log(err)
    }

}

const fileSave = async (file: any, caption: any, name: any) => {
    try {
        const file_name = file.fileName.replace(/[_\-\.+]/g, ' ');
        const media = {
            fileName: file_name,
            fileSize: file.fileSize,
            fileId: file.fileId,
            fileUniqueId: file.fileUniqueId,
            fileType: file.fileType,
            mimeType: file.mimeType,
            caption: caption,
        }
        const db = await name.create(media)
        console.log(db)
        console.log('saved in db')


    } catch (err) {
        console.log(err)
    }

}


export { saveFile, fileSave }