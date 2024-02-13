import fs = require('fs');

const filePath = './errorLogs.txt';

async function logger(text:string,error:any) {
    fs.access(filePath, fs.constants.F_OK, (err)=>{
        if(err){
            fs.writeFile(filePath,'Created..',(err)=>{
                if(err){
                    console.log('err creating file',err)
                }else{
                    logs(text,error)
                }
            })
        }else{
            logs(text,error)
        }
    })
}

function logs(text:string,error:any){
    const date = new Date();
    const localTime = date.toLocaleString('en-Us',{timeZone: 'Asia/Kolkata'})

    fs.appendFileSync("errorLogs.txt", `ERROR -: ${localTime} :- In ${text} : ${error}` + "\n")
    console.log(error)
}

export default logger