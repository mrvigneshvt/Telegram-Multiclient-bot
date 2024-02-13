interface childData {
    client:{
        Thumbnail?: string,
        Token: string,
        BotId: number,
        Admin: number,
        Buttons: string[],
        MongoDB: any,
        Channels?: any[] | [],
    }
    
}

interface userChildInfo {
    firstName: string,
    chatId: number,
    Joined: any
}

export {childData,userChildInfo}