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
}
