const patternMap = new Map();
patternMap.set('widescreen', /WS/);
patternMap.set('size', /(\d+(?:\.\d+)?(?:GB|MB))/);
patternMap.set('website', /^(\[ ?([^\]]+?) ?\])/);
patternMap.set('group', /(- ?([^-]+(?:-={[^-]+-?$)?))$/);
patternMap.set('region', /R[0-9]/);
patternMap.set('extended', /(EXTENDED(:?.CUT)?)/);
patternMap.set('hardcoded', /HC/);
patternMap.set('proper', /PROPER/);
patternMap.set('container', /MKV|AVI|MP4/);
patternMap.set('language', /rus\.eng|ita\.eng/);
patternMap.set('codec', /xvid|[hx]\.?26[45]/i);
patternMap.set('audio', /MP3|DD5\.?1|Dual[- ]Audio|LiNE|DTS|AAC[.-]LC|AAC(?:\.?2\.0)?|AC3(?:\.5\.1)?/);
patternMap.set('sbs', /(?:Half-)?SBS/);
patternMap.set('quality', /(?:PPV\.)?[HP]DTV|(?:HD)?CAM|B[rR]Rip|TS|(?:PPV )?WEB-?DL(?: DVDRip)?|H[dD]Rip|DVDRip|DVDRiP|DVDRIP|CamRip|W[EB]B[rR]ip|[Bb]lu[Rr]ay|DvDScr|hdtv/);
patternMap.set('threeD', /3D/);
patternMap.set('resolution', /(([0-9]{3,4}p))[^M]/);
patternMap.set('repack', /REPACK/);
patternMap.set('unrated', /UNRATED/);
patternMap.set('year', /([[(]?((?:19[0-9]|20[01])[0-9])[\])]?)/);
patternMap.set('episode', /([Eex]([0-9]{2})(?:[^0-9]|$))/);
patternMap.set('season', /([Ss]?([0-9]{1,2}))[Eex]/);

class Test {

    /**
     * 返回匹配的非中文字符串，如没有匹配则返回空字符串
     *
     */
    static matchEN(raw) {
        let clean = raw.replace(/\S*[\u4e00-\u9fa5]+/g, '');

        patternMap.forEach((value, key, map) => {
            clean = clean.replace(value, '');
        });
        return clean;
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
