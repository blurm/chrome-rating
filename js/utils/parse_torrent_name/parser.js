const patternMap = new Map();
patternMap.set('widescreen', /WS/);
patternMap.set('size', /(\d+(?:\.\d+)?(?:GB|MB))/);
patternMap.set('website', /^(\[ ?([^\]]+?) ?\])/);
patternMap.set('quality', /(?:PPV\.)?[HP]DTV|(?:HD)?CAM|B[rRD]Rip|TS|(?:PPV )?WEB-?DL(?: DVDRip)?|H[dD]Rip|DVDRip|DVDRiP|DVDRIP|CamRip|WEB[rR]ip|[Bb]lu[Rr]ay|DvDScr|hdtv|KORSUB/g);
patternMap.set('group', /(- ?([^-]+(?:-={[^-]+-?$)?))$/);
patternMap.set('region', /R[0-9]/);
patternMap.set('extended', /(EXTENDED(:?.CUT)?)/);
patternMap.set('hardcoded', /HC/);
patternMap.set('proper', /PROPER/);
patternMap.set('container', /(MKV|mkv)|(AVI|avi)|(MP|mp)4/);
patternMap.set('language', /rus\.eng|ita\.eng/);
patternMap.set('codec', /xvid|[hx]\.?26[45]/i);
patternMap.set('audio', /MP3|DD5\.?1|Dual[- ]Audio|LiNE|DTS|AAC[.-]LC|AAC(?:\.?2\.0)?|AC3(?:\.5\.1)?/);
patternMap.set('sbs', /(?:Half-)?SBS/);
patternMap.set('threeD', /3D/);
patternMap.set('resolution', /[0-9]{3,4}[pP][^M]/);
patternMap.set('repack', /REPACK/);
patternMap.set('unrated', /UNRATED/);
patternMap.set('limited', /LIMITED/);
patternMap.set('year', /([[(]?((?:19[0-9]|20[01])[0-9])[\])]?)/g);
patternMap.set('episode', /([Eex]([0-9]{2})(?:[^0-9]|$))/);
patternMap.set('season', /([Ss]?([0-9]{1,2}))[Eex]/);

class TitleParser {

    /**
     * 返回匹配的非中文字符串，如没有匹配则返回空字符串
     *
     */
    static parse(raw) {
        // 去掉所有的汉字信息，字幕组信息
        let clean = raw.replace(/\./g, ' ')
                        .replace(/\S*[\u4e00-\u9fa5]+\S*/g, '');
        // 针对国内某字幕组自定义的名字Short
        clean = clean.replace(/Short\s*(?=[0-9]{3,4}[pP][^M])/, '');
        const result = {};
        patternMap.forEach((value, key, map) => {
            if (key == 'year') {
                const arr = clean.match(value);
                if (arr) {
                    result.year = arr[arr.length-1];
                }
                clean = clean.replace(result.year, '');
            }
            clean = clean.replace(value, '');
        });
        result.name = clean.replace(/\s+/g, ' ').trim();
        return result;
    }
}
