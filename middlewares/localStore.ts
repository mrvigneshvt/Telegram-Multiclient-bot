import { ClientData } from "../dataBase/UserBase.js"
import {childData} from "../interface/interface.js";

async function storeData():Promise<childData[]>{
    const childDatas = await ClientData.find({isVerified:true})
    console.log(childDatas)

    
     let mapped : childData[] = childDatas.map((item)=>({
        client:{
            Token: item.Token,
            BotId: item.BotId,
            Admin: item.Admin,
            Buttons: item.Buttons,
            MongoDB: item.MongoDB,
            Channels: item.Channels,
            Thumbnail: item.thumbnail
        }
    }))

    return mapped
}

export default storeData

