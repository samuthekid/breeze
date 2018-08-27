
var main = {

    next: "",
    pre_next: "",
    suggest_item: 0,
    defs: null,
    color: false,
    fadeTime: 600,
    fadeTimeLong: 1200,
    suggestions: {"match": [],
                  "others": []},
    cal_reg: /^[\+\-\/\*\%\d\.\(\)]+$/,
    hex_reg: /^\#([0-9a-fA-F]{3}){1,2}$/,
    rgb_reg: /^rgb\([0-9]+\,[0-9]+\,[0-9]+\)$/,
    url_reg: /^((http|https|ftp):\/\/)?([a-zA-Z0-9\_\-]+)((\.|\:)[a-zA-Z0-9\_\-]+)+(\/.*)?$/,
    colors_array: ["#F7CAC9","#F7786B","#91A8D0","#034F84","#FAE03C","#98DDDE","#9896A4","#DD4132","#B18F6A","#79C753"],

    load: function(e){
        //console.log("[Func] load");
        // LOAD INFO FROM browser API
        chrome.runtime.sendMessage({code: "get"},main.init);

        // EVENTS AND FOCUS ON THE INPUT
        $("body").on('click',function(){
            $("#help").fadeOut(this.fadeTime);
            $("#help").scrollTop(0);
            $("#search_box").focus();
        });
        $("#logo").on('click',function(e){
            $("#help").fadeToggle(this.fadeTime);
            e.preventDefault();
            e.stopPropagation();
        });
        $("#search_box").on('keydown', this.go);
        $("#search_box").on('input', this.onChangeSearch);
        $("#suggestions").on('click', this.copyColor);

        // INITIAL ANIMATION
        $("#to_animate").fadeIn(main.fadeTime);
    },

    init: function(r){
        //console.log("[Func] init");
        // SAVE INFO
        defs = r.msg;

        // CLOCK
        main.setClock();
        // SUGGESTIONS
        main.onChangeSearch();
        // BACKGROUND
        main.setBackground();
    },

    setClock: function(){
        var today = new Date();
        var h = parseInt(today.getHours());
        var m = parseInt(today.getMinutes());
        var s = parseInt(today.getSeconds());
        
        if(defs.use_am_pm){
            var am_pm = "";
            if(h>=12) am_pm = "pm";
            else am_pm = "am";
            if(h>12) h = h-12;
            if(h==0) h = 12;
        }
        if(h<10) h = "0"+h;
        if(m<10) m = "0"+m;
        if(s<10) s = "0"+s;
        if(defs.show_seconds) $("#clock").html(h+":"+m+":"+s);
        else $("#clock").html(h+":"+m);
        if(defs.use_am_pm) $("#am_pm").html(am_pm);
        else $("#am_pm").html("");
        setTimeout(main.setClock, 1000);
    },

    go: function(event){
        var done = 0;
        var final = "";
        var query = $("#search_box")[0].value;
        if(event.keyCode == 13 && query != "" && query != null){
            // RETURN
            //console.log("[Func] go + ENTER + ["+query+"]");

            if(defs.first_time == true) defs.first_time = false;

            // Allows ENTER before TAB
            query = main.pre_next + query + main.next;

            if(done == 0 && main.pre_next == "search "){
                done = 1;
                query = query.substr(7,query.length);
                final = "https://www.google.pt/search?q="+query;
            }

            if(done == 0){
                $.each(defs.shortcuts, function(i,x){
                    if(query == x.word){
                        final = x.value;
                        done = 1;
                        x.visits += 1;
                        return 0;
                    }
                });
            }

            if(done == 0){
                t = query.length;
                l = query.indexOf(" ");
                tag = query.substring(0,l);
                other = query.substring(l+1,t);

                $.each(defs.tags, function(i,x){
                    if(tag == x.tag){
                        final = x.value.replace("{{x}}", other);
                        done = 1;
                        x.visits += 1;
                        return 0;
                    }
                });
            }

            if(done == 0){
                if(main.url_reg.test(query)){
                    if(!query.startsWith("http") && !query.startsWith("ftp")) final = "http://"+query;
                    else final = query;
                    done = 1;
                    var found = 0;
                    $.each(defs.urls,function(i,x){
                        if(x.value == query){
                            found = 1;
                            x.visits += 1;
                            return 0;
                        }
                    });
                    if(found == 0){
                        var tmp = {"url":true,"value":query,"visits":1};
                        defs.urls.push(tmp);
                    }
                }
            }

            // Aditional cleaning to the query
            if(done == 0){
                if(main.hex_reg.test(query)){
                    if(query.length == 4) query = "#0"+query[1]+"0"+query[2]+"0"+query[3];
                    query.replace("#","%23");
                }
                final = "https://www.google.pt/search?q="+query;
            }

            // Clean query !!!
            final = final.replace(/\+/g, "%2B");
            final = final.replace(/\ /g, "%20");

            // Save changes
            chrome.runtime.sendMessage({code: "set", msg: defs});
            
            // Opening options
            if(event.shiftKey){
                // Shift Key - Open in new tab
                chrome.tabs.create({url: final, active: true});
            }else if(event.ctrlKey || (event.metaKey && navigator.platform.toLowerCase().includes("mac"))){
                // Ctrl or Cmd Key - Open in new tab BUT dont focus the new tab
                chrome.tabs.query({active: true}, function(tabs){
                    chrome.tabs.create({url: final});
                    chrome.tabs.update(tabs[0].id, {active: true});
                });
            }else if(event.altKey){
                // Alt Key - Open in incognito mode
                chrome.windows.create({url: final, incognito: true});
            }else{
                // Open in actual tab
                chrome.tabs.update(null, {url: final});
            }
            event.stopPropagation();
            event.preventDefault();

        }else if(event.keyCode == 9){
            // TAB
            //console.log("[Func] go + TAB + ["+query+"]");
            //if(main.pre_next != "" || main.next != ""){
            // Used when the tag is half written
            if(main.next.includes("{{x}}")){
                $("#search_box").val(main.pre_next+query+main.next.substr(0,main.next.indexOf("{{x}}")));
            }else if(main.pre_next == "search "){
                $("#search_box").val(query+main.next);
            }else{
                $("#search_box").val(main.pre_next+query+main.next);
            }
            main.next = "";
            main.pre_next = "";
            main.suggest_item = 0;
            main.onChangeSearch();
            event.stopPropagation();
            event.preventDefault();
        }else if(event.keyCode == 38){
            // Up arrow
            //console.log("[Func] go + UP + ["+query+"]");
            if(main.suggest_item > 0){
                main.suggest_item--;
                $("#suggestions").html("");
                main.showSuggestions();
            }
            event.stopPropagation();
            event.preventDefault();
        }else if(event.keyCode == 40){
            // Down arrow
            //console.log("[Func] go + DOWN + ["+query+"]");
            if(main.suggest_item < main.suggestions.match.length+main.suggestions.others.length-1){
                main.suggest_item++;
                $("#suggestions").html("");
                main.showSuggestions();
            }
            event.stopPropagation();
            event.preventDefault();
        }
    },

    onChangeSearch: function(event){
        // Update suggestions
        var query = $("#search_box")[0].value;
        //console.log("[Func] onChangeSearch + ["+query+"]");

        //console.log(main.suggest_item);
        main.suggestions = {"match": [],"others": []};
        $("#suggestions").html("");
        
        main.updateInputSize();

        if(query != ""){
            // SHORTCUTS
            $.each(defs.shortcuts, function(i,x){
                if(query == x.word)
                    main.suggestions.match.push(x);
                else if(x.word.includes(query))
                    main.suggestions.others.push(x);
            });

            // TAGS
            $.each(defs.tags, function(i,x){
                if(query == x.tag || query == x.tag+" " || query.startsWith(x.tag+" "))
                    main.suggestions.match.push(x);
                else if(x.tag.includes(query))
                    main.suggestions.others.push(x);
            });

            // URLS
            $.each(defs.urls, function(i,x){
                if(query == x.value)
                    main.suggestions.match.push(x);
                else if(x.value.includes(query))
                    main.suggestions.others.push(x);
            });

            // COLOR CONVERTER
            if(main.hex_reg.test(query) || main.rgb_reg.test(query)){
                main.showColorPreview(query);
            }else{
                // Make sure to clean the color (hide div)
                main.color = false;
                $("#color_preview").fadeOut(main.fadeTime/2);
            }

            // Detect urls using REGEX
            if(main.url_reg.test(query) && main.suggestions.match.length == 0){
                main.suggestions.match.push({"url":true,"value":query,"visits":1});
            }

            // If not a color, add a search to others
            if(!main.hex_reg.test(query) && !main.rgb_reg.test(query)){
                main.suggestions.others.push({"search":true,"value":query,"visits":-999});
            }

            main.suggest_item = 0;

            // Show suggestions
            main.showSuggestions();

        }else{
            // EMPTY QUERY
            main.pre_next = "";
            main.next = "";
            // Unset background color
            main.color = false;
            $("#color_preview").fadeOut(main.fadeTime/2);
            // Reset "placeholder"
            if(defs && defs.first_time == true){
                $("#helper_box").html("Click on the logo to learn how to use Breeze");
            }else{
                $("#helper_box").html("");
            }
            $("#pre_helper_box").html("");
        }
    },

    showSuggestions: function(){
        //console.log("[Func] showSuggestions");
        // PRINT SUGGESTIONS UNDER SEARCH BOX
        var helper = "";
        var pre_helper = "";
        var query = $("#search_box")[0].value;

        var match = null;
        if(main.suggestions.match.length > 1)
            match = main.suggestions.match.sort(function(a,b){return b.visits-a.visits;});
        else match = main.suggestions.match;

        var others = null;
        if(main.suggestions.others.length > 1)
            others = main.suggestions.others.sort(function(a,b){return b.visits-a.visits;});
        else others = main.suggestions.others;

        //console.log(main.suggestions);
        //console.log(main.suggest_item);

        // Define helper for the selected option
        if(match.length != 0 && main.suggest_item <= match.length-1){
            var tmp = match[main.suggest_item];
            if(tmp.tag){
                // It's a tag
                if(query == tmp.tag) helper = " {{x}}";
                if(query == tmp.tag+" ") helper = "{{x}}";
            }else if(tmp.search){
                pre_helper = "search ";
            }
            // Other cases don't need an helper
        }else{
            if(others.length != 0 && main.suggest_item-match.length <= others.length-1){
                var tmp = others[main.suggest_item-match.length];
                if(tmp.word){
                    // It's a shortcut
                    pre_helper = tmp.word.substr(0,tmp.word.indexOf(query));
                    helper = tmp.word.substr(pre_helper.length+query.length,tmp.word.length);
                }else if(tmp.tag){
                    // It's a tag
                    pre_helper = tmp.tag.substr(0,tmp.tag.indexOf(query));
                    helper = tmp.tag.substr(pre_helper.length+query.length,tmp.tag.length)+" {{x}}";
                }else if(tmp.url){
                    // It's an url
                    pre_helper = tmp.value.substr(0,tmp.value.indexOf(query));
                    helper = tmp.value.substr(pre_helper.length+query.length,tmp.value.length);
                }else if(tmp.search){
                    // It's a search
                    pre_helper = "search ";
                }
            }
        }

        // CALCULATOR
        if(main.cal_reg.test(query)){
            try {
                var temp_result = eval(query);
                $("#pre_helper_box").html("");
                $("#helper_box").html("="+eval(query));
                $("#helper_box").css("opacity", 1);
            } catch (e) {
                $("#pre_helper_box").html(pre_helper);
                $("#helper_box").html(helper);
                $("#helper_box").css("opacity", 0.5);
                main.pre_next = pre_helper;
                main.next = helper;
            }
        }else{
            $("#pre_helper_box").html(pre_helper);
            $("#helper_box").html(helper);
            $("#helper_box").css("opacity", 0.5);
            main.pre_next = pre_helper;
            main.next = helper;
        }

        // Show suggestions
        $.each(match,function(i,x){
            var p = $("<p/>");
            if(i == main.suggest_item) p.addClass("selected");

            if(x.word){
                $("#suggestions").append(p.html(x.value));
            }else if(x.tag){
                if(query.includes(" ")){
                    $("#suggestions").append(p.html(x.value.replace("{{x}}","<b>"+query.substr(query.indexOf(" ")+1,query.length)+"</b>")));
                }else{
                    $("#suggestions").append(p.html(x.value));
                }
            }else if(x.url){
                $("#suggestions").append(p.html("URL"));
            }else if(x.search){
                $("#suggestions").append(p.html("search "+query));
            }else{
                $("#suggestions").append(p.html(x.value));
            }
        });

        $.each(others,function(i,x){
            var p = $("<p/>");
            if(i == main.suggest_item-match.length) p.addClass("selected");
            
            if(x.word){
                $("#suggestions").append(p.html(
                    x.word.substr(0,x.word.indexOf(query))+
                    "<b>"+query+"</b>"+
                    x.word.substr(x.word.indexOf(query)+query.length,x.word.length)
                    ));
            }else if(x.tag){
                $("#suggestions").append(p.html(
                    x.tag.substr(0,x.tag.indexOf(query))+
                    "<b>"+query+"</b>"+
                    x.tag.substr(x.tag.indexOf(query)+query.length,x.tag.length)+" {{x}}"
                    ));
            }else if(x.url){
                $("#suggestions").append(p.html(
                    x.value.substr(0,x.value.indexOf(query))+
                    "<b>"+query+"</b>"+
                    x.value.substr(x.value.indexOf(query)+query.length,x.value.length)
                    ));
            }else if(x.search){
                $("#suggestions").append(p.html("search "+query));
            }
        });

        if($("p.selected")[0]) $("p.selected")[0].scrollIntoViewIfNeeded({block: "start", behavior: "smooth"});
    },

    updateInputSize: function() {
        //console.log("[Func] updateInputSize");
        // THAT CHEAT - WADAP MA BOI
        $("#span_bot").html($("#search_box")[0].value
            .replace(/\ /g, '(')
            .replace(/\</g, '+')
            .replace(/\>/g, '+')
        );
        $("#search_box").css("width",$("#span_bot").width()+"px");
    },

    showColorPreview: function(query){
        //console.log("[Func] showColorPreview");
        // SHOW COLOR PREVIEW DIV
        var aux,r,g,b;
        $("#color_preview").hide();
        if(main.hex_reg.test(query)){
            main.color = true;
            if(query.length == 4){
                r = parseInt(query.substr(1,1)+query.substr(1,1), 16);
                g = parseInt(query.substr(2,1)+query.substr(2,1), 16);
                b = parseInt(query.substr(3,1)+query.substr(3,1), 16);
            }else if(query.length == 7){
                r = parseInt(query.substr(1,2), 16);
                g = parseInt(query.substr(3,2), 16);
                b = parseInt(query.substr(5,2), 16);
            }
            $("#color_preview").css("background",query);
            $("#color_preview").fadeIn(main.fadeTime/2);
            main.suggestions.match.push({"value":"rgb("+r+","+g+","+b+")","visits":0});

        }else if(main.rgb_reg.test(query)){
            main.color = true;
            var aux = query.replace(")","").replace("rgb(","").split(",");
            var r = parseInt(aux[0]);
            var g = parseInt(aux[1]);
            var b = parseInt(aux[2]);
            if(r<256 && g<256 && b<256){
                r = r.toString(16);
                g = g.toString(16);
                b = b.toString(16);
                if(r.length==1) r = "0"+r;
                if(g.length==1) g = "0"+g;
                if(b.length==1) b = "0"+b;
                $("#color_preview").css("background",query);
                $("#color_preview").fadeIn(main.fadeTime/2);
                main.suggestions.match.push({"value":"#"+r+g+b,"visits":0});
            }else{
                main.color = false;
            }
        }
    },

    setBackground: function(){
        //console.log("[Func] setBackground");
        // SET COLOR OR BACKGROUND TO THE TAB
        if(defs.show_colors){
            var rnd = Math.floor((Math.random()*main.colors_array.length));
            main.applyBackground(main.colors_array[rnd]);
        }else{
            if(navigator.onLine){
                main.getWallpaper();
            }else{
                setTimeout(function(){
                    main.checkConnection();
                },500);
                $("#discon").fadeIn(main.fadeTime);
                main.setWallpaper(chrome.extension.getURL("icons/wallpaper.jpg"));
            }
        }
    },

    applyBackground: function(bg) {
        //console.log("[Func] applyBackground");
        $("body").css("background",bg);
        $("#black_wallpaper").fadeOut(main.fadeTime);
    },

    getWallpaper: function(){
        //console.log("[Func] getWallpaper");
        // GET WALLPAPER FROM BING
        var img_url = "http://www.bing.com";
        var rnd = Math.floor((Math.random()*8));
        $.ajax({
            method: "GET",
            url: "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8",
            success: function(data){
                //console.log("[Func][BING] success");
                img_url = img_url + data["images"][rnd]["url"];
            },
            error: function(data){
                //console.log("[Func][BING] error");
                img_url = chrome.extension.getURL("icons/wallpaper.jpg");
            },
            complete: function(){
                //console.log("[Func][BING] complete");
                main.setWallpaper(img_url);
            }
        });
    },

    setWallpaper: function(img_url){
        //console.log("[Func] setWallpaper");
        $('<img/>').attr('src', img_url).on('load',function() {
            $(this).remove();
            $("#download_text").attr("href",img_url);
            $("#download_wallpaper").fadeIn(main.fadeTime);
            $("body").css("background","url("+img_url+") no-repeat center center fixed");
            $("body").css("background-size","cover");
            $("#black_wallpaper").fadeOut(main.fadeTime);
        });
    },

    checkConnection: function(){
        //console.log("[Func] checkConnection");
        // CHECKS EVERY 2s IF THE chrome IS ONLINE
        if(navigator.onLine){
            $("#discon").fadeOut(main.fadeTime);
            $("#black_wallpaper").fadeIn(main.fadeTime);
            main.setBackground();
        }else{
            setTimeout(function(){main.checkConnection();},2000);
        }
    },

    copyColor: function(e){
        //console.log("[Func] copyColor");
        if(main.color && e.target.tagName == "P"){
            var box = $("#search_box");
            var old = box.val();
            box.val($("#suggestions").children().html());
            box.focus();
            document.execCommand("selectAll");
            document.execCommand("copy");
            box.val(old);
            $("#open_options").html("Copied!").fadeIn(100).fadeOut(2250);
        }
    },

    shortcutOptions: function(event){
        //console.log("[Func] shortcutOptions");
        if(event.keyCode == 16){
            // Shift Key
            // Open in new tab
            $("#open_options").html("Open and jump to new tab").fadeIn(120);
        }else if(event.keyCode == 17 || (event.keyCode == 91 && navigator.platform.toLowerCase().includes("mac"))){
            // Ctrl or Cmd Key
            // Open in new tab BUT dont focus the new tab
            $("#open_options").html("Open in new tab").fadeIn(120);
        }else if(event.keyCode == 18){
            // Alt Key
            // Open in incognito mode
            $("#open_options").html("Open in Incognito mode").fadeIn(120);
            event.preventDefault();
        }
    },

    shortcutOptionsExit: function(event){
        //console.log("[Func] shortcutOptionsExit");
        if((event.keyCode == 16) || 
            (event.keyCode == 17) || 
            (event.keyCode == 91) || 
            (event.keyCode == 18)){
            main.shortcutOptionsForce(event);
        }
    },

    shortcutOptionsForce: function(event){
        //console.log("[Func] shortcutOptionsForce");
        $("#open_options").fadeOut(120);
    },

};





$(document).on("load", main.load());
$(document).on("keydown", main.shortcutOptions);
$(document).on("keyup", main.shortcutOptionsExit);

$(window).on("blur", main.shortcutOptionsForce);
$(window).on("load", function(){$("#search_box").focus();});
$(window).on("focus", function(){$("#search_box").focus();});
