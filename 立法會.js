class 立法會 {
    唯一的內會委員會 = new 內會委員會();

    async function 制定法律(草案) {
        await 一讀(草案)
            .then((草案) => 唯一的內會委員會.審議(草案))
            .then((修訂後的法案) => 恢復二讀(修訂後的法案))
            .then((修訂後的法案) => 大會上全體委員會審議(修訂後的法案))
            .then((全體委員會修訂後的法案) => 三讀(全體委員會修訂後的法案))
            .then((法案最終版) => 刊憲(法案最終版));
    }

    async function 大會表決(動議) {
        var 結果 = await 進行表決(); // aka 撳掣，亦可能係非點名表決
        if (動議.議題 is 法案 && 動議.議題.負責人 is 議員) {
            let 地區直選通過 = 
                結果.贊成.filter((m) => m.地區直選).length > 
                Math.floor(結果.出席.filter((m) => m.地區直選).length / 2);
            let 功能組別通過 = 
                結果.贊成.filter((m) => m.功能組別).length > 
                Math.floor(結果.出席.filter((m) => m.功能組別).length / 2);
            return 地區直選通過 && 功能組別通過;
        } else {
            return 結果.贊成.length > Math.floor(結果.出席.length / 2);
        }
    }

    async function 一讀(草案) {
        await 草案.負責人.廢嗡();
        // 主席隨即宣佈進入動議二讀流程，辯論中止待續
        return 草案;
    }

    async function 恢復二讀(法案) {
        if (法案.主動撤回) {
            await 法案.負責人.廢嗡();
            throw '二讀前撤回';
        }
        await 討論(); // 不會作任何修改
        if (!await 表決(new 動議(法案))) throw '不予以二讀';
        return 法案;
    }

    async function 大會上全體委員會審議(法案) {
        var 全體委員會修訂後的法案 = await 全體委員會逐條審議和表決(法案);
        if (!await 表決(new 動議(全體委員會修訂後的法案))) throw '全體委員會否決';
        return 全體委員會修訂後的法案;
    }

    async function 逐條審議和表決(法案) {
        // ...TODO...
        // 可再針對內務委員會所草擬的修文再逐一修改，以及進行表決
    }

    async function 三讀(法案) {
        var 最終修訂版法案 = await 動議三讀(法案);
        if (!await 表決(最終修訂版法案)) throw '動議三讀中否決';
        return 最終修訂版法案;
    }

    async function 動議三讀(法案) {
        // ...TODO...
        // 廢嗡或提出有限度typo類的修正
        return 法案;
    }


    async function 刊憲(法案最終版) {
        // TODO
        // 成為法律
    }

}

class 內會委員會 {
    static 法案委員會排隊機制 = Semphore(16);
    
    async function 審議(法案) {
        await 討論();
        var 寫好嘅法案;
        if (要求成立法案委員會.length > 1) {
            await 立法會.法案委員會排隊機制.lock();
            try {
                var bc = new 法案委員會(法案, 有興趣加入的委員);
                寫好嘅法案 = await bc.做嘢()
            } finally {
                立法會.法案委員會排隊機制.release();
            }
        } else {
            寫好嘅法案 = await 真係寫條文(this.委員, 法案);
        }
        return 寫好嘅法案;
    }
}

class 法案委員會 {
    constructor(法案, 委員) {
        // TODO
        this.法案 = 法案;
        this.委員 = 委員;
    }
    async function 做嘢() {
        // TODO
        var 寫好嘅法案 = 真係寫條文(this.委員, this.法案);
        return 寫好嘅法案;
    }
}

async function 真係寫條文(人, 法案) {
    // ...TODO...
    // 真係做嘢
}
