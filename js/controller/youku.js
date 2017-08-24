class Youku {
    constructor() {
        this.reg = {
        };
    }

    static createOptions($target, $link) {
        const nameStr = $.trim($target.find('li.title').text()) ||
            $.trim($target.find('.v-meta-title').text()) ||
            $.trim($target.find('.p-meta-title').text());

        //const bookName = JD.formatBookname(nameStr, publisher);
        const options = {
            name: nameStr,
            type: "movie"
        };

        return options;
    }

    main() {
        // shadow dom test -------------------------------
        const shadowHost = $('<div id="myShadowhost">sdfaf</div>');
        $('body').append(shadowHost);
        let baseHolder = shadowHost;
        console.log($('#myShadowhost'));

        var getShadowRoot;
        if (baseHolder.attachShadow) {
            // Chrome 53+
            getShadowRoot = function(holder) {
                // attachShadow is only allowed for whitelisted elements.
                // https://github.com/w3c/webcomponents/issues/110
                var shadowHost = document.createElement('span');
                shadowHost.style.setProperty('all', 'inherit', 'important');
                holder.appendChild(shadowHost);
                return shadowHost.attachShadow({ mode: 'open' });
            };
        } else if (baseHolder.createShadowRoot) {
            // Chrome 35+
            if ('all' in baseHolder.style) {
                // Chrome 37+ supports the "all" CSS keyword.
                getShadowRoot = function(holder) {
                    return holder.createShadowRoot();
                };
            } else {
                getShadowRoot = function(holder) {
                    var shadowRoot = holder.createShadowRoot();
                    shadowRoot.resetStyleInheritance = true;
                    return shadowRoot;
                };
            }
        } else if (baseHolder.webkitCreateShadowRoot) {
            // Chrome 33+
            getShadowRoot = function(holder) {
                var shadowRoot = holder.webkitCreateShadowRoot();
                shadowRoot.resetStyleInheritance = true;
                return shadowRoot;
            };
        }

        // 创建影子根（shadow root）
        //var shadowRoot = shadowHost.createShadowRoot();
        //shadowRoot.innerHTML = '<p class="shadowroot_son">夏天夏天悄悄过去留下小秘密！</p>';
        // shadow dom test -------------------------------

        const modules = [new DoubanInfo(), new IMDBInfo()];
        const common = new Common(modules, Youku.createOptions, 'movie');
        common.listHandle(
            //v.youku.com/v_show/id_XMjcwNDg0NDI3Mg==.html?spm=a2h1n.8251845.0.0
            /\/\/v\.youku\.com\/v_show\/id_.*/i,
            '.box-series .pack-film, \
            .yk-body .ishover, \
            .piclist-scroll-pic li'
        );
    }
}
console.log('iqiyi.js');
new Youku().main();
