
var opts = {

    defs: "",

    save_main_page: function(){
        defs.main_page = $("#main_page").val();
        alert("Saved");
        chrome.runtime.sendMessage({code: "set", msg: defs});
        $("#main_page").focus();
        return 0;
    },

    save_show_seconds: function(){
        defs.show_seconds = $("#show_seconds").prop("checked");
        chrome.runtime.sendMessage({code: "set", msg: defs});
        return 0;
    },

    save_show_ampm: function(){
        defs.use_am_pm = $("#show_ampm").prop("checked");
        chrome.runtime.sendMessage({code: "set", msg: defs});
        return 0;
    },

    save_show_colors: function(){
        defs.show_colors = $("#show_colors").prop("checked");
        chrome.runtime.sendMessage({code: "set", msg: defs});
        return 0;
    },

    // EVENT
    save_shortcuts: function(){
        word = $("#shortcuts_word").val();
        value = $("#shortcuts_value").val();
        found = 0;

        if(value == "" || value.includes(" ") || word == "" || word.includes(" ")){
            alert("Possible errors:\n\n"+
                "-> Word can't be empty\n"+
                "-> Word can't include spaces\n"+
                "\n"+
                "-> Value can't be empty\n"+
                "-> Value can't include spaces");
            $("#shortcuts_word").focus();
            return 0;
        }
        
        $.each(defs.shortcuts, function(i,x){
            if(x.word == word) found = 1;
        });

        if(found == 0){
            // ADD ELEMENT
            elem = $.parseHTML("<tr><td>"+word+"</td><td>"+value+"</td><td class='s_d'>X</td></tr>");
            $("#shortcuts_opts").append(elem);
            $(".s_d").click(opts.delete_shortcuts);
            
            // ADD TO ARRAY
            tmp = [{"word": word,"value": value,"visits":1}];
            $.merge(defs.shortcuts, tmp);

            // CLEAN INPUTS
            $("#shortcuts_word").val("");
            $("#shortcuts_value").val("");

            // UPDATE SETTINGS
            chrome.runtime.sendMessage({code: "set", msg: defs});
            $("#shortcuts_word").focus();
            return 0;
        }else{
            alert("Already exists... try again.");
            $("#shortcuts_word").focus();
            return 0;
        }
    },

    // EVENT
    delete_shortcuts: function(e){
        var elem = $(e.target).parent();
        var text = elem.children().html();

        $.each(defs.shortcuts, function(i,x){
            if(x.word == text){
                defs.shortcuts.splice(i,1);
                return false;
            }
        });

        // REMOVE FROM TABLE
        elem.remove();

        // UPDATE SETTINGS
        chrome.runtime.sendMessage({code: "set", msg: defs});
        $("#shortcuts_word").focus();
        return 0;
    },

    // EVENT
    save_tags: function(){
        tag = $("#tags_tag").val();
        value = $("#tags_value").val();
        found = 0;

        if(value == "" || value.includes(" ") || tag == "" || tag.includes(" ") || !value.includes("{{x}}")){
            alert("Possible errors:\n\n"+
                "-> Tag can't be empty\n"+
                "-> Tag can't include spaces\n"+
                "\n"+
                "-> Value can't be empty\n"+
                "-> Value can't include spaces\n"+
                "-> Value must include {{x}}\n(otherwise won't work)");
            $("#tags_tag").focus();
            return 0;
        }
        
        $.each(defs.tags, function(i,x){
            if(x.tag == tag) found = 1;
        });

        if(found == 0){
            // ADD ELEMENT
            elem = $.parseHTML("<tr><td>"+tag+"</td><td>"+value+"</td><td class='t_d'>X</td></tr>");
            $("#tags_opts").append(elem);
            $(".t_d").click(opts.delete_tags);
            
            // ADD TO ARRAY
            tmp = [{"tag": tag,"value": value,"visits":1}];
            $.merge(defs.tags, tmp);

            // CLEAN INPUTS
            $("#tags_tag").val("");
            $("#tags_value").val("");

            // UPDATE SETTINGS
            chrome.runtime.sendMessage({code: "set", msg: defs});
            $("#tags_tag").focus();
            return 0;
        }else{
            alert("Already exists... try again.");
            $("#tags_tag").focus();
            return 0;
        }
    },

    // EVENT
    delete_tags: function(e){
        var elem = $(e.target).parent();
        var text = elem.children().html();

        $.each(defs.tags, function(i,x){
            if(x.tag == text){
                defs.tags.splice(i,1);
                return false;
            }
        });

        // REMOVE FROM TABLE
        elem.remove();

        // UPDATE SETTINGS
        chrome.runtime.sendMessage({code: "set", msg: defs});
        $("#tags_tag").focus();
        return 0;
    },

    // EVENT
    delete_urls: function(e){
        var elem = $(e.target).parent();
        var text = elem.children().html();

        $.each(defs.urls, function(i,x){
            if(x.value == text){
                defs.urls.splice(i,1);
                return false;
            }
        });

        // REMOVE FROM TABLE
        elem.remove();

        // UPDATE SETTINGS
        chrome.runtime.sendMessage({code: "set", msg: defs});
        return 0;
    },

    fill: function(){
        $("#main_page").val(defs.main_page);
        $("#save_main_page").click(this.save_main_page);

        if(defs.show_seconds)
            $("#show_seconds").prop('checked', true);
        $("#show_seconds").change(this.save_show_seconds);

        if(defs.use_am_pm)
            $("#show_ampm").prop('checked', true);
        $("#show_ampm").change(this.save_show_ampm);

        if(defs.show_colors)
            $("#show_colors").prop('checked', true);
        $("#show_colors").change(this.save_show_colors);

        $.each(defs.shortcuts, function(i,x){
            $("#shortcuts_opts").html($("#shortcuts_opts").html()+
                "<tr><td>"+x.word+"</td><td>"+x.value+"</td><td class='s_d'>X</td></tr>");
        });
        $("#save_shortcuts").click(this.save_shortcuts);
        $(".s_d").click(this.delete_shortcuts);

        $.each(defs.tags, function(i,x){
            $("#tags_opts").html($("#tags_opts").html()+
                "<tr><td>"+x.tag+"</td><td>"+x.value+"</td><td class='t_d'>X</td></tr>");
        });
        $("#save_tags").click(this.save_tags);
        $(".t_d").click(this.delete_tags);

        $.each(defs.urls, function(i,x){
            $("#urls_opts").html($("#urls_opts").html()+
                "<tr><td>"+x.value+"</td><td class='u_d'>X</td></tr>");
        });
        $(".u_d").click(this.delete_urls);
    },

    getMsg: function(r){
        defs = r.msg;
        opts.fill();
    },

    init: function(e){
        // GETTING THE SETTINGS
        chrome.runtime.sendMessage({code: "get"},this.getMsg);
    }

};

document.addEventListener("load", opts.init());
