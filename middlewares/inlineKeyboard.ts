import fs from 'fs'

const InlineKeyboard = async (datas:any[]) => {
    try {
        const buttonsAlign = []
        const buttons = datas

        for (let i = 0; i < buttons.length; i += 2) {
            const row = [];
            row.push({ text: buttons[i], switchInlineQueryCurrentChat: i.toString() + " " })

            if (i + 1 < buttons.length) {
                const query = i + 1
                row.push({ text: buttons[i + 1], switchInlineQueryCurrentChat: query.toString() + " " })
            }

            buttonsAlign.push(row);
        };
        return buttonsAlign
    } catch (err) {
        //fs.appendFileSync("Zerror.txt", `ERROR -:- Align InlineKeyboard : ${err}` + "\n", (e) => console.log(e))
        console.log(err)
    }
};

export default InlineKeyboard;