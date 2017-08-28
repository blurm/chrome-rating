const REGEX_REMOVE_BRACE = /([(（{[【〔［][^(［|］|(|)|{|}|【|】|〔|〕|[|\])]+[)）］}\]】〕])+/g;

class Util {

    /**
     * 返回匹配的非中文字符串，如没有匹配则返回空字符串
     *
     */
    static matchEN(str) {
        const regexEN = /[^\u4e00-\u9fa5]+/g;
        let result = '';
        if (str.match(regexEN)) {
            result = str.match(regexEN).join(' ').trim();
        }
        return result;
    }

    /**
     * 是否是纯英文字符组成
     *
     */
    static isENStr(str) {
        const nonASCII = /[^\x00-\x7F]+/;
        if (str.match(nonASCII)) {
            return false;
        }
        return true;
    }

    /**
     * Return matched Chinese string, return empty string if not matched
     *
     */
    static matchCN(str) {
        const regexCN = /[\u4e00-\u9fa5]+/g;

        let result = '';
        if (str.match(regexCN)) {
            result = str.match(regexCN)[0];
        }
        return result;
    }

    /**
     * 把书名分割成片段，以便于更精确的匹配结果
     *
     */
    static getBookShortName(bookName) {
        // Remove 第二|2版
        //const arr = name.match(/第(?:\d|[\u4e00-\u9fa5])版/);
        const tmpBookName = bookName.replace(
            /\s*第(?:\d|[\u4e00-\u9fa5])版\s*/, '');
        let shortName = [tmpBookName];
        if (tmpBookName.match(/:|：|\s/)) {
            const arr = tmpBookName.split(/:|：|\s/);
            shortName = arr;
        }
        return shortName;
    }

    static formatPublisher(str) {
        return str.replace('出版社: ', '').replace(REGEX_REMOVE_BRACE, '');
    }

    /**
     * 格式化书名，去掉其中无用的，影响搜索的信息
     *
     */
    static formatBookname(name, publisherStr) {
        const publisher = Util.formatPublisher(publisherStr);
        // 将版本字符串先提取出来，最后再拼接到书名后面
        const arr = name.match(/第(?:\d|[\u4e00-\u9fa5])版/);
        let edition = '';
        if (arr) {
            edition = arr[0];
        }

        const tempName = name
        // 去掉【】[] () {} 及其包含的内容
            .replace(REGEX_REMOVE_BRACE, ' ')
        // 去掉以作品集，系列，纪念版等结尾的字段
            .replace(/\S+(作品集|珍藏版|纪念版|作品|著作|丛书|新版)\d*(:|：)?/g, '')
        // 替换某些特殊字符，比如‘/’
            .replace(/\/|:|：|·|\./g, ' ').trim();

        let result = tempName;

        // 如果是英文原版书籍，只取英文部分作为标题
        // 部分电子书出版商是空
        if (publisher !== '' && Util.matchCN(publisher) === '') {
            result = Util.matchEN(tempName);
            //if (JD.matchEN(tempName) !== '') {
            //result += ' ' + JD.matchEN(tempName);
            //}
        }

        if (edition !== '') {
            result += ' ' + edition;
        }
        return result;
    }

    /**
     * 格式化作者，去掉无用信息
     *
     */
    static formatAuthor(author) {
        const authorStr = author.replace(REGEX_REMOVE_BRACE, '');
        const regex = /[^(\s|《|》|(|)|（|）|,|，)]+/;
        return authorStr === ''?authorStr:authorStr.match(regex)[0];
    }

}
