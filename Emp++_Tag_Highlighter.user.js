// ==UserScript==
// @name Emp++ Tag Highlighter
// @version 0.6.3
// @description highlights liked/disliked tags
// @grant GM_getValue
// @grant GM_setValue
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @match http://*.empornium.me/*
// @match https://*.empornium.me/*
// @match http://empornium.me/*
// @match https://empornium.me/*
// @match http://*.empornium.sx/*
// @match https://*.empornium.sx/*
// @match http://empornium.sx/*
// @match https://empornium.sx/*
// @match http://pornbay.org/*
// @match https://pornbay.org/*
// @namespace LaMa
// ==/UserScript==


// Changelog:
// Version 0.6.3
// - Added text to inform of update
// Version 0.6.2
// - Preparing for new "branch". 
// - "Tag config" renamed "old tag config".
// Version 0.6.1
// - updated taglinks
// Version 0.6.0
// - Added more tag-groups 
// - Removed autodownvote, it shouldn't be used anyway (it's still in the code if you need to deactivate it or notice problems)
// - Changed Useless tags to only be toggle-able on Disliked tags to save space. Let me know if you disagree with this decision
// - Loved Performers/tags can be toggled after you liked a perfomer/tag
// - few size changes to fit all in the config window 

function runScript(){
    var $j = $.noConflict(true);

    var defaults = {
        majorVersion : 0.6,
        //Options
        truncateTags : true,
        //Browse Page Options
        usePercentBar : false,
        useTorrentOpacity : false,
        useTorrentColoring : false,
        //Tag types to use
        useGoodTags : true,
		useLovedTags : true,
        usePerformerTags : true,
		useLoveperfTags : true,
		useNewperfTags : true,
        useBadTags : true,
        useTerribleTags : false,
        useUselessTags : false
    };

    var settings = getSettings();

    settings = $j.extend(true, defaults, settings);

    if(settings.majorVersion < defaults.majorVersion){
        settings.majorVersion = defaults.majorVersion;
        saveSettings();
        //handle upgrade
    }

    //import tags from pre-v0.4 ETH
    if(!settings.tags){
        settings.tags = {
        	good : getValue("good_tags", "").split(' '),
		loved : getValue("loved_tags", "").split(' '),
           	performer : getValue("performer_tags", "").split(' '),
		loveperf : getValue("loveperf_tags", "").split(' '),
		newperf : getValue("newperf_tags", "").split(' '),
         	bad : getValue("bad_tags", "").split(' '),
          	terrible : getValue("terrible_tags", "").split(' '),
            	useless : getValue("useless_tags", "").split(' ')
        };
        saveSettings();
    }

    var configHTML =
        "<div id='s-conf-background'>" +
        "<div id='s-conf-wrapper'>" +
        "<h1>Old Empornium++Tag Highlighter Settings</h1>" +
        "<div id='s-conf-status'></div>" +
        "<ul id='s-conf-tabs'>" +
        "<li><h2><a class='s-conf-tab s-selected' data-page='s-conf-general'>General</a></h2></li>" +
        "<li><h2><a class='s-conf-tab' data-page='s-conf-good-tags'>Liked Tags</a></h2></li>" +
		"<li><h2><a class='s-conf-tab' data-page='s-conf-loved-tags'>Loved Tags</a></h2></li>" +
        "<li><h2><a class='s-conf-tab' data-page='s-conf-Performer-tags'>Performer Tags</a></h2></li>" +
		"<li><h2><a class='s-conf-tab' data-page='s-conf-loveperf-tags'>Loved Performer Tags</a></h2></li>" +
		"<li><h2><a class='s-conf-tab' data-page='s-conf-newperf-tags'>New Performer Tags</a></h2></li>" +
        "<li><h2><a class='s-conf-tab' data-page='s-conf-bad-tags'>Disliked Tags</a></h2></li>" +
        "<li><h2><a class='s-conf-tab' data-page='s-conf-terrible-tags'>Blacklisted Tags</a></h2></li>" +
        "<li><h2><a class='s-conf-tab' data-page='s-conf-useless-tags'>Useless Tags</a></h2></li>" +
        "</ul>" +
        "<div id='s-conf-content'>" +
        "<form id='s-conf-form'>" +
        "<div class='s-conf-page s-selected' id='s-conf-general'>" +
        "<h1>New version is out. Check Github</h1>" +
        "<br/><label><input class='s-conf-gen-checkbox' type='checkbox' name='truncateTags'/> Automatically truncate long tags on torrent details page</label>" +
        "<br/><h2>Enable/Disable Tag Types:</h2>" +
        "<label><input class='s-conf-gen-checkbox' type='checkbox' name='useGoodTags'/> Use Liked Tag Type</label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useLovedTags'/> Use Loved Tag Type</label>" +
        "<label><input class='s-conf-gen-checkbox' type='checkbox' name='usePerformerTags'/> Use Performer Tag Type</label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useLoveperfTags'/> Use Loved Performer Tag Type</label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useNewperfTags'/> Use New Performer Tag Type</label>" +
        "<label><input class='s-conf-gen-checkbox' type='checkbox' name='useBadTags'/> Use Disliked Tag Type</label>" +
        "<label><input class='s-conf-gen-checkbox' type='checkbox' name='useTerribleTags'/> Use Blacklisted Tag Type. Does not work with collapsed duplicates user script</label>" +
        "<label><input class='s-conf-gen-checkbox' type='checkbox' name='useUselessTags'/> Use Useless Tag Type</label>" +
        "<br/><h2>Torrent Display Options:</h2>" +
        "<label><input class='s-conf-gen-checkbox' type='checkbox' name='usePercentBar'/> Use Percent Bar <a>(View Example)</a>" +
        "<img src='http://i.imgur.com/2U1Ei.png'/></label>" +
        "<label><input class='s-conf-gen-checkbox' type='checkbox' name='useTorrentOpacity'/> Use Torrent Opacity <a>(View Example)</a>" +
        "<img src='http://i.imgur.com/jDQIg.png'/></label>" +
        "<label><input class='s-conf-gen-checkbox' type='checkbox' name='useTorrentColoring'/> Use Torrent Coloring <a>(View Example)</a>" +
        "<img src='http://i.imgur.com/kVXe7.png'/></label>" +
        "<div class='s-conf-buttons'>" +
        "<input id='s-conf-save' type='button' value='Save Settings'/>" +
        "</div>" +
        "</div>" +
        "<div class='s-conf-page' id='s-conf-good-tags'>" +
        "<label title='Space-separated. big.tits also saves bigtits automatically'>Add Liked Tags:<br/>" +
        "<input id='s-conf-add-good' class='s-conf-add-tags' type='text' placeholder='Space-separated. big.tits also saves bigtits automatically'/>" +
        "<input class='s-conf-add-btn' data-type='good' value='Add Tags' type='button'/>" +
        "</label><br/>" +
        "<label title='Space-separated. big.tits also removes bigtits automatically'>Remove Liked Tags:<br/>" +
        "<input id='s-conf-remove-good' class='s-conf-remove-tags' type='text' placeholder='Space-separated. big.tits also removes bigtits automatically'/>" +
        "<input class='s-conf-remove-btn' data-type='good' value='Remove Tags' type='button'/>" +
        "</label><br/>" +
        "<label><h2>Liked Tags - If enabled, these tags will be highlighted green:</h2>" +
        "<textarea readonly id='s-conf-text-good' class='s-conf-tag-txtarea'></textarea></label>" +
        "</div>" +
        "<div class='s-conf-page' id='s-conf-loved-tags'>" +
        "<label title='Space-separated. big.tits also saves bigtits automatically'>Add Loved Tags:<br/>" +
        "<input id='s-conf-add-loved' class='s-conf-add-tags' type='text' placeholder='Space-separated. big.tits also saves bigtits automatically'/>" +
        "<input class='s-conf-add-btn' data-type='loved' value='Add Tags' type='button'/>" +
        "</label><br/>" +
        "<label title='Space-separated. big.tits also removes bigtits automatically'>Remove Loved Tags:<br/>" +
        "<input id='s-conf-remove-loved' class='s-conf-remove-tags' type='text' placeholder='Space-separated. big.tits also removes bigtits automatically'/>" +
        "<input class='s-conf-remove-btn' data-type='loved' value='Remove Tags' type='button'/>" +
        "</label><br/>" +
        "<label><h2>Loved Tags - If enabled, these tags will be highlighted purple:</h2>" +
        "<textarea readonly id='s-conf-text-loved' class='s-conf-tag-txtarea'></textarea></label>" +
        "</div>" +
        "<div class='s-conf-page' id='s-conf-Performer-tags'>" +
        "<label title='Space-separated. big.tits also saves bigtits automatically'>Add Performer Tags:<br/>" +
        "<input id='s-conf-add-performer' class='s-conf-add-tags' type='text' placeholder='Space-separated. big.tits also saves bigtits automatically'/>" +
        "<input class='s-conf-add-btn' data-type='performer' value='Add Tags' type='button'/>" +
        "</label><br/>" +
        "<label title='Space-separated. big.tits also removes bigtits automatically'>Remove Performer Tags:<br/>" +
        "<input id='s-conf-remove-performer' class='s-conf-remove-tags' type='text' placeholder='Space-separated. big.tits also removes bigtits automatically'/>" +
        "<input class='s-conf-remove-btn' data-type='performer' value='Remove Tags' type='button'/>" +
        "</label><br/>" +
        "<label><h2>Performer Tags - If enabled, these tags will be highlighted blue:</h2>" +
        "<textarea readonly id='s-conf-text-performer' class='s-conf-tag-txtarea'></textarea></label>" +
        "</div>" +
		"<div class='s-conf-page' id='s-conf-loveperf-tags'>" +
        "<label title='Space-separated. big.tits also saves bigtits automatically'>Add Loved Performer Tags:<br/>" +
        "<input id='s-conf-add-loveperf' class='s-conf-add-tags' type='text' placeholder='Space-separated. big.tits also saves bigtits automatically'/>" +
        "<input class='s-conf-add-btn' data-type='loveperf' value='Add Tags' type='button'/>" +
        "</label><br/>" +
        "<label title='Space-separated. big.tits also removes bigtits automatically'>Remove Performer Tags:<br/>" +
        "<input id='s-conf-remove-loveperf' class='s-conf-remove-tags' type='text' placeholder='Space-separated. big.tits also removes bigtits automatically'/>" +
        "<input class='s-conf-remove-btn' data-type='loveperf' value='Remove Tags' type='button'/>" +
        "</label><br/>" +
        "<label><h2>Loved Performer Tags - If enabled, these tags will be highlighted cyan:</h2>" +
        "<textarea readonly id='s-conf-text-loveperf' class='s-conf-tag-txtarea'></textarea></label>" +
        "</div>" +
		"<div class='s-conf-page' id='s-conf-newperf-tags'>" +
        "<label title='Space-separated. big.tits also saves bigtits automatically'>Add New Performers Tags:<br/>" +
        "<input id='s-conf-add-newperf' class='s-conf-add-tags' type='text' placeholder='Space-separated. big.tits also saves bigtits automatically'/>" +
        "<input class='s-conf-add-btn' data-type='newperf' value='Add Tags' type='button'/>" +
        "</label><br/>" +
        "<label title='Space-separated. big.tits also removes bigtits automatically'>Remove New Performers Tags:<br/>" +
        "<input id='s-conf-remove-newperf' class='s-conf-remove-tags' type='text' placeholder='Space-separated. big.tits also removes bigtits automatically'/>" +
        "<input class='s-conf-remove-btn' data-type='newperf' value='Remove Tags' type='button'/>" +
        "</label><br/>" +
        "<label><h2>New Performer Tags - If enabled, these tags will be highlighted gold:</h2>" +
        "<textarea readonly id='s-conf-text-newperf' class='s-conf-tag-txtarea'></textarea></label>" +
        "</div>" +
        "<div class='s-conf-page' id='s-conf-bad-tags'>" +
        "<label title='Space-separated. big.tits also saves bigtits automatically'>Add Disliked Tags:<br/>" +
        "<input id='s-conf-add-bad' class='s-conf-add-tags' type='text' placeholder='Space-separated. big.tits also saves bigtits automatically'/>" +
        "<input class='s-conf-add-btn' data-type='bad' value='Add Tags' type='button'/>" +
        "</label><br/>" +
        "<label title='Space-separated. big.tits also removes bigtits automatically'>Remove Disliked Tags:<br/>" +
        "<input id='s-conf-remove-bad' class='s-conf-remove-tags' type='text' placeholder='Space-separated. big.tits also removes bigtits automatically'/>" +
        "<input class='s-conf-remove-btn' data-type='bad' value='Remove Tags' type='button'/>" +
        "</label><br/>" +
        "<label><h2>Disliked Tags - If enabled, these tags will be highlighted red:</h2>" +
        "<textarea readonly id='s-conf-text-bad' class='s-conf-tag-txtarea'></textarea></label>" +
        "</div>" +
        "<div class='s-conf-page' id='s-conf-terrible-tags'>" +
        "<label title='Space-separated. big.tits also saves bigtits automatically'>Add Blacklisted Tags:<br/>" +
        "<input id='s-conf-add-terrible' class='s-conf-add-tags' type='text' placeholder='Space-separated. big.tits also saves bigtits automatically'/>" +
        "<input class='s-conf-add-btn' data-type='terrible' value='Add Tags' type='button'/>" +
        "</label><br/>" +
        "<label title='Space-separated. big.tits also removes bigtits automatically'>Remove Blacklisted Tags:<br/>" +
        "<input id='s-conf-remove-terrible' class='s-conf-remove-tags' type='text' placeholder='Space-separated. big.tits also removes bigtits automatically'/>" +
        "<input class='s-conf-remove-btn' data-type='terrible' value='Remove Tags' type='button'/>" +
        "</label><br/>" +
        "<label><h2>Blacklisted Tags - If enabled, torrents with these tags will be hidden:</h2>" +
        "<textarea readonly id='s-conf-text-terrible' class='s-conf-tag-txtarea'></textarea></label>" +
        "</div>" +
        "<div class='s-conf-page' id='s-conf-useless-tags'>" +
        "<label title='Space-separated. big.tits also saves bigtits automatically'>Add Useless Tags:<br/>" +
        "<input id='s-conf-add-useless' class='s-conf-add-tags' type='text' placeholder='Space-separated. big.tits also saves bigtits automatically'/>" +
        "<input class='s-conf-add-btn' data-type='useless' value='Add Tags' type='button'/>" +
        "</label><br/>" +
        "<label title='Space-separated. big.tits also removes bigtits automatically'>Remove Useless Tags:<br/>" +
        "<input id='s-conf-remove-useless' class='s-conf-remove-tags' type='text' placeholder='Space-separated. big.tits also removes bigtits automatically'/>" +
        "<input class='s-conf-remove-btn' data-type='useless' value='Remove Tags' type='button'/>" +
        "</label><br/>" +
        "<label><h2>Useless Tags - If enabled, these tags will be hidden:</h2>" +
        "<textarea readonly id='s-conf-text-useless' class='s-conf-tag-txtarea'></textarea></label>" +
        "</div>" +
        "</form>" +
        "</div>" +
        "<div class='s-conf-buttons'>" +
        "<input id='s-conf-close' type='button' value='Close'/>" +
        "</div>" +
        "</div>" +
        "</div>";

    var stylesheet = "<style type='text/css'>" +
        //DEFAULT STYLE OVERRIDES
        "#torrent_tags>li{border-bottom:1px solid #999; padding-bottom:2px;}" +
        //CONFIGURATION STYLES
        "#s-conf-background{position:fixed; top:0; bottom:0; left:0; right:0; z-index:1000; background-color:rgba(50,50,50,0.6);}" +
        "#s-conf-wrapper{background:#eee; color:#444; position:relative; width:1200px; overflow:hidden; margin:50px auto; font-size:14px;" +
        "padding:15px 20px; border-radius:16px; box-shadow: 0 0 20px black;}" +
        "#s-conf-wrapper h2{background:none; text-align:left; color:#444; padding:0;}" +
        "#s-conf-status{width:784px; padding:8px; line-height:16px; text-align:center; border:1px solid #ddd; margin-top:15px; display:none;}" +
        "#s-conf-status.s-success{border-color:#135300; background:#A9DF9C;}" +
        "#s-conf-status.s-error{border-color:#840000; background:#F3AAAA;}" +
        "#s-conf-status-close{cursor:pointer;}" +
        "#s-conf-tabs{width:100%; height:50px; margin:15px 0 -1px 0; overflow:hidden; cursor:pointer;}" +
        "#s-conf-tabs li, #s-conf-tabs h2{margin:0; list-style:none;float:left;}" +
        "#s-conf-content{width:100%; overflow:hidden; border:1px solid #444; border-radius:4px; border-top-left-radius: 0px; box-shadow:0 -1px 10px rgba(0,0,0,0.6);}" +
        ".s-conf-tab{width:110px; height:50px; padding:8px; margin-right:2px; font-size:14px;display:block; float:left; text-align:center; border:1px solid #444; border-bottom:0;" +
        "border-top-left-radius: 4px; border-top-right-radius: 4px; color:#444;margin: 0px 0px 0px;}" +
        ".s-conf-tab.s-selected, .s-conf-tab:hover{background-color:#fff;}" +
        "#s-conf-form{display:block; background:#fff; padding:15px;}" +
        "#s-conf-form label{display:block;}" +
        ".s-conf-buttons{margin-top:15px; width:100%; text-align:center;}" +
        ".s-conf-page{display:none;}" +
        ".s-conf-page.s-selected{display:block;}" +
        ".s-conf-page input{vertical-align:text-bottom;}" +
        "#s-conf-general label{cursor:pointer;}" +
        "#s-conf-general img{margin-bottom:10px; display:none;}" +
        "#s-conf-general a:hover+img{display:block;}" +
        ".s-conf-tag-txtarea{width:1100px; height:300px; background:#ddd; word-spacing:10px; line-height:18px;}" +
        ".s-conf-add-tags, .s-conf-remove-tags{width:950px;}" +
        ".s-conf-add-btn, .s-conf-remove-btn{width:110px;}" +
        //GENERAL STYLES

        "span.s-tag.s-good{float:none; background:#A9DF9C; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
        "span.s-tag.s-good> a{color:#000000}" +
        "span.s-tag.s-loved{float:none; background:#ad00f7; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
        "span.s-tag.s-loved> a{color:#000000}" +
        "span.s-tag.s-performer{float:none; background:#9fcaf9; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
        "span.s-tag.s-performer> a{color:#000000}" +
		"span.s-tag.s-loveperf{float:none; background:#00f7ea; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
        "span.s-tag.s-loveperf> a{color:#000000}" +
		"span.s-tag.s-newperf{float:none; background:#f7d600; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
        "span.s-tag.s-newperf> a{color:#000000}" +
        "span.s-tag.s-bad{float:none;background:#F3AAAA; border-bottom:1px solid #840000; padding:0px 4px; border-radius:16px; font:bold;}" +
        "span.s-tag.s-bad> a{color:#000000}" +
        "span.s-tag.s-terrible{float:none; background:#222; border-bottom:1px solid #888; padding:0x 4px; border-radius:16px; font:bold;}" +
        "span.s-tag.s-terrible> a{color:#EEE}" +
        "span.s-tag.s-useless{float:none; background:#AAA; border-bottom:1px solid #444; padding:0px 4px; border-radius:16px; display:none;}" +
        "#s-toggle-forum{margin:0 5px; font-size:0.9em; cursor:pointer;}" +
        "span.s-tag.s-useless> a{color:#000000}" +
        //BROWSE PAGE STYLES
        ".s-browse-tag-holder{padding: 0px 0px 0px 0px; float:none;}" +
        ".s-browse-tag-holder>.s-tag{display:inline; float:none;}" +
        ".s-terrible-hidden{cursor: pointer; padding:10px;}" +
        ".s-percent-container{height:4px; margin:2px 0; overflow:hidden; background:#ccc; border:1px solid #aaa;}" +
        ".s-percent{height:4px;}" +
        ".s-percent-good{background:#3D9949; float:left;}" +
        ".s-percent-bad{background:#9E3333; float:right}" +
        //DETAILS PAGE STYLES
        ".tag_inner .s-tag{background:#CCC; border-bottom:1px solid #888; border-radius:16px; padding:1px 5px;}" +
        ".tag_inner .s-tag> a{color:#000000}" +
        ".tag_inner span.s-tag {border-width: 2px; display:block; float:left; line-height: 18px; margin: 2px 3px; padding: 0 6px; white-space: nowrap;}" +
        ".s-button{float:left; width:15px; height:14px; border-radius:6px; color:#fff; " +
        "font:bold 16px/15px Arial, sans-serif; text-align:center; margin:1px 3px 1px 0px; cursor:pointer; opacity:0.8;}" +
        ".s-button:hover{opacity:1;}" +
        ".s-remove-good, .s-remove-performer, .s-remove-loveperf, .s-remove-bad, .s-remove-terrible, .s-remove-useless, .s-add-useless{line-height:11px;}" +
        ".s-add-good, .s-remove-good{background:#3D9949; border:1px solid #135300;}" +
		".s-add-loved, .s-remove-loved{background:#ad00f7; border:1px solid #135300;}" +
        ".s-add-performer, .s-remove-performer{background:#5485bc; border:1px solid #135300;}" +
		".s-add-loveperf, .s-remove-loveperf{background:#00f7ea; border:1px solid #135300;}" +
		".s-add-newperf, .s-remove-newperf{background:#f7d600; border:1px solid #135300;}" +
        ".s-add-bad, .s-remove-bad{background:#9E3333; border:1px solid #840000;}" +
        ".s-add-terrible, .s-remove-terrible{background:#333; border:1px solid #000;}" +
        ".s-add-useless, .s-remove-useless{background:#888; border:1px solid #444;}" +
        ".s-tag{margin:1px 2px;}" +
        ".s-tag .s-button{display:none;}" +
        ".s-tag .s-add-good, .s-tag .s-add-performer, .s-tag .s-add-newperf, .s-tag .s-add-bad{display:block}" +
        ".s-tag.s-good .s-button, .s-tag.s-loved .s-button, .s-tag.s-performer .s-button, .s-tag.s-loveperf .s-button, .s-tag.s-newperf .s-button, .s-tag.s-bad .s-button, .s-tag.s-terrible .s-button{display:none}" +
        ".s-tag.s-good .s-button.s-remove-good, .s-tag.s-loved .s-button.s-remove-loved, .s-tag.s-performer .s-button.s-remove-performer, .s-tag.s-loveperf .s-button.s-remove-loveperf, .s-tag.s-newperf .s-button.s-remove-newperf, .s-tag.s-bad .s-button.s-remove-bad, .s-tag.s-terrible .s-button.s-remove-terrible, " +
		".s-tag.s-good .s-button.s-add-loved, .s-tag.s-performer .s-button.s-add-loveperf, .s-tag.s-bad .s-button.s-add-terrible, .s-tag.s-useless .s-button.s-remove-useless{display:block}" +
        ".s-tag.s-bad .s-button.s-add-useless{display:block}" +
	(settings.truncateTags ?
         (".s-tag a{max-width:100px;overflow:hidden;text-overflow:ellipsis;}" +
          ".s-tag.s-good a,.s-tag.s-performer a, .s-tag.s-useless a, .s-tag.s-terrible a{max-width:140px;}" +
          ".s-tag.s-bad a {max-width:120px;}" +
          ".s-tag.s-staff a{max-width:64px;}" +
          ".s-tag.s-good.s-staff a,.s-tag.s-performer.s-staff a, .s-tag.s-useless.s-staff a, .s-tag.s-terrible.s-staff a{max-width:104px;}" +
          ".s-tag.s-staff.s-bad a{max-width:84px;}")
         : "") +
        ".s-useless-tags{display:none;}" +
        ".s-useless-toggle{font-weight:bold; cursor:pointer;}" +
        ".s-useless-desc{clear:both; padding:8px 0 8px 15px;}" +
        "</style>";
    (function init() {
        // add stylesheet
        $j(stylesheet).appendTo("head");
        var test = $j('#torrent_table tbody tr.torrent.rowb').css('background-color');
        $j('#torrent_table').css('background-color',test);



        // add config link
        $j("<li class='brackets' title=\"Change Empornium++Tag Highlighter's settings.\"><a href='#'>Old Tag-Config</a></li>").insertAfter("#nav_userinfo").on("click", function(e){
            e.preventDefault();
            initConfig($j(configHTML).prependTo("body"));
        });

        if(/torrents\.php/.test(window.location.href)){
            // torrent details
            if(/\bid\=/.test(window.location.href)){
                processDetailsPage();
            }
            // torrents overview
            else{
                processBrowsePage(".torrent", "torrent");
            }
        }
        // collage details/overview
        else if(/collages\.php/.test(window.location.href)){
            processBrowsePage(".rowa, .rowb", "collage");
        }
        // subscribed collages with new additions
        else if(/userhistory\.php(.+)\bsubscribed_collages/.test(window.location.href)){
            processBrowsePage(".torrent", "torrent");
        }
        // user details
        else if(/user\.php(.+)\bid\=/.test(window.location.href)){
            processBrowsePage(".torrent", "torrent");
        }
        // top 10
        else if(/top10\.php/.test(window.location.href)){
            processBrowsePage(".torrent", "torrent");
        }
        else if(/bookmarks\.php/.test(window.location.href)){
            processBrowsePage(".rowa, .rowb", "request");
        }
        else if(/requests\.php/.test(window.location.href)){
            if(/\bid\=/.test(window.location.href)){
                processDetailsPage();
            }
            else{
                processBrowsePage(".rowa, .rowb", "request");
            }
        }
    }());

    function processBrowsePage(rowSelector, type){
        var rows = $j(rowSelector);

        rows.each(function(i, row){
            row = $j(row);
            var tagContainer = row.find(".tags").addClass("s-browse-tag-holder").css({
                "line-height" : "18px"
            }),
                totalTagNum = tagContainer.find("a").length,
                goodNum = 0, badNum = 0, terribleNum = 0, uselessNum = 0;

            if(!totalTagNum){
                return;
            }
            tagContainer.find("a").each(function(i, tagLink){
                tagLink = $j(tagLink);
                var tag = tagLink.text();

                tagLink = tagLink.wrap("<span>").parent().addClass("s-tag");
                tag = tag.toLowerCase();

				if(settings.useLovedTags && isTag(settings.tags.loved, tag)){
                    goodNum++;
                    tagLink.addClass("s-loved");
				}
                else if(settings.useGoodTags && isTag(settings.tags.good, tag)){
                    goodNum++;
                    tagLink.addClass("s-good");
                }
                else if(settings.useLoveperfTags && isTag(settings.tags.loveperf, tag)){
                    goodNum++;
                    tagLink.addClass("s-loveperf");
                }
                else if(settings.usePerformerTags && isTag(settings.tags.performer, tag)){
                    goodNum++;
                    tagLink.addClass("s-performer");
                }
                else if(settings.useNewperfTags && isTag(settings.tags.newperf, tag)){
                    goodNum++;
                    tagLink.addClass("s-newperf");
                }
                else if(settings.useTerribleTags && isTag(settings.tags.terrible, tag)){
                    if(!terribleNum){
                        var colspan = row.children().length;
                        row.hide();
                        $j("<tr class='tr11'></tr>").insertAfter(row).html(
                            "<td colspan='" + colspan + "' class='s-terrible-hidden'>" + capitaliseFirstLetter(type) +
                            " hidden because of the blacklisted tag: <strong>" + tag +
                            "</strong>. Click here to display the " + type + " listing.</td>").
                        on("click", function(){
                            $j(this).hide();
                            row.show();
                        });
                    }
                    terribleNum++;
                    badNum++;
                    tagLink.addClass("s-terrible s-bad");
                }
                else if(settings.useUselessTags && isTag(settings.tags.useless, tag)){
                    totalTagNum--;
                    tagLink.addClass("s-useless");
                }
                else if(settings.useBadTags && isTag(settings.tags.bad, tag)){
                    badNum++;
                    tagLink.addClass("s-bad");
                }


            });
            var goodPercent = Math.round(goodNum/totalTagNum * 100);
            var badPercent = Math.round(badNum/totalTagNum * 100);

            if(settings.usePercentBar){
                var percentContainer = $j("<div class='s-percent-container'></div>)").insertBefore(tagContainer);
                percentContainer.width(tagContainer.parent().width() - 2);
                $j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-good").width(goodPercent + "%");
                $j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-bad").width(badPercent + "%");
            }

            if(settings.useTorrentOpacity && badPercent > goodPercent){
                //opacity range: 0.5 - 1
                row.css("opacity", (100 - ((badPercent - goodPercent)/2))/100);
            }

            if(settings.useTorrentColoring){
                //range -1 to 1
                var netPercent = (goodPercent - badPercent)/100;
                var absPercent = Math.abs(netPercent);
                var green = [120, 200, 120];
                var red = [210, 120, 120];
                var color;
                if(netPercent > 0){
                    color= green;
                }
                else if(netPercent < 0){
                    color = red;
                }
                else{
                    //color = [239,243,246];
                }
                if(color && !row.hasClass("redbar") && /torrents\.php/.test(window.location.href) && !/userid\=/.test(window.location.href)){
                    row.css({"background-color" : "rgba("+color[0]+","+color[1]+","+color[2]+","+absPercent+""});
                }
            }
        });
    }

    function processDetailsPage(){
        var isTagsLoaded = false;

        var handleTagListLoad = function(){
            isTagsLoaded = false;
            var checkTagList = function(){
                if($j("#torrent_tags li a").hasClass("tags-loaded")){
                    setTimeout(checkTagList, 30);
                }
                else{
                    highlightDetailTags();
                }
            };
            checkTagList();
        };

        $j(".tag_header span a, #form_addtag input[type='button']").on("click", handleTagListLoad);
        $j("#tagname").on("keydown", function(e){
            if(e.keyCode === 13){
                handleTagListLoad();
            }
        });

        var highlightDetailTags = function(){
            if(isTagsLoaded) return;
            //Timeout to ensure we run after everything else
            var tagLinks = $j("#torrent_tags").find("a[href*='\\?taglist=']");

            isTagsLoaded = tagLinks.length > 0;

            if(!isTagsLoaded){
                setTimeout(highlightDetailTags, 200);
                return;
            }

            $j("<ul class='s-useless-tags nobullet'></ul>").appendTo("#torrent_tags").on("spyder.change", function(){
                var hiddenTagHolder = $j(this),
                    hiddenTags = hiddenTagHolder.find("span.s-tag");

                if(hiddenTags.length){
                    $j(".s-useless-msg").text("There's " + hiddenTags.length + " useless tag" + (hiddenTags.length > 1 ? "s" : "") + " on this torrent ");
                    $j(".s-useless-msg, .s-useless-toggle").show();
                }
                else{
                    $j(".s-useless-msg, .s-useless-toggle").hide();
                }
            }).before("<div class='s-useless-desc'><span class='s-useless-msg'></span> <a class='s-useless-toggle'>SHOW</a></div>");

            $j(".s-useless-toggle").on("click", function(){
                $j(".s-useless-tags").slideToggle("fast", function(){
                    if($j(this).is(":visible")){
                        $j(".s-useless-toggle").text("HIDE");
                    }
                    else{
                        $j(".s-useless-toggle").text("SHOW");
                    }
                });
            });

            tagLinks.each(function(i, tagLink){
                tagLink = $j(tagLink).addClass("tags-loaded");
                var tag = tagLink.text(),
                    tagHolder = tagLink.wrap("<span>").parent().addClass("s-tag");

                tag = tag.toLowerCase();

                if(settings.useLovedTags && isTag(settings.tags.loved, tag)){
                    tagHolder.addClass("s-loved");
                }
                else if(settings.useGoodTags && isTag(settings.tags.good, tag)){
                    tagHolder.addClass("s-good");
                }
                else if(settings.useLoveperfTags && isTag(settings.tags.loveperf, tag)){
                    tagHolder.addClass("s-loveperf");
                }
                else if(settings.usePerformerTags && isTag(settings.tags.performer, tag)){
                    tagHolder.addClass("s-performer");
                }
                else if(settings.useNewperfTags && isTag(settings.tags.newperf, tag)){
                    tagHolder.addClass("s-newperf");
                }
                else if(settings.useUselessTags && isTag(settings.tags.useless, tag)){
                    var uselessTag = tagHolder.addClass("s-useless");



                    uselessTag.parent().detach().appendTo(".s-useless-tags").trigger("spyder.change");
                }
                else if(settings.useTerribleTags && isTag(settings.tags.terrible, tag)){
                    tagHolder.addClass("s-terrible");
                }
                else if(settings.useBadTags && isTag(settings.tags.bad, tag)){
                    tagHolder.addClass("s-bad");
                }
                var buttons = $j();
                if(settings.useGoodTags){
                    buttons = buttons.add($j("<div class='s-button s-add-good' title='Mark tag as LIKED'>+</div>").
                                          data("action", {fn : addTagElement, type : "good", tag : tag}));
                    buttons = buttons.add($j("<div class='s-button s-remove-good' title='Un-Mark tag as LIKED'>–</div>").
                                          data("action", {fn : removeTagElement, type : "good", tag : tag}));
                }
                if(settings.useLovedTags){
                    buttons = buttons.add($j("<div class='s-button s-add-loved' title='Mark tag as LOVED'>+</div>").
                                          data("action", {fn : addLovedTagElement, type : "loved", tag : tag}));
                    buttons = buttons.add($j("<div class='s-button s-remove-loved' title='Un-Mark tag as LOVED'>–</div>").
                                          data("action", {fn : removeLovedTagElement, type : "loved", tag : tag}));
                }
                if(settings.usePerformerTags){
                    buttons = buttons.add($j("<div class='s-button s-add-performer' title='Mark tag as Performer'>+</div>").
                                          data("action", {fn : addTagElement, type : "performer", tag : tag}));
                    buttons = buttons.add($j("<div class='s-button s-remove-performer' title='Un-Mark tag as Performer'>–</div>").
                                          data("action", {fn : removeTagElement, type : "performer", tag : tag}));
                }
                if(settings.useLoveperfTags){
                    buttons = buttons.add($j("<div class='s-button s-add-loveperf' title='Mark tag as Loved Performer'>+</div>").
                                          data("action", {fn : addLoveperfTagElement, type : "loveperf", tag : tag}));
                    buttons = buttons.add($j("<div class='s-button s-remove-loveperf' title='Un-Mark tag as Loved Performer'>–</div>").
                                          data("action", {fn : removeLoveperfTagElement, type : "loveperf", tag : tag}));
                }
                if(settings.useNewperfTags){
                    buttons = buttons.add($j("<div class='s-button s-add-newperf' title='Mark tag as New Performer'>+</div>").
                                          data("action", {fn : addTagElement, type : "newperf", tag : tag}));
                    buttons = buttons.add($j("<div class='s-button s-remove-newperf' title='Un-Mark tag as New Performer'>–</div>").
                                          data("action", {fn : removeTagElement, type : "newperf", tag : tag}));
                }
                if(settings.useBadTags){
                    buttons = buttons.add($j("<div class='s-button s-add-bad' title='Mark tag as DISLIKED'>×</div>").
                                          data("action", {fn : addTagElement, type : "bad", tag : tag}));
                    buttons = buttons.add($j("<div class='s-button s-remove-bad' title='Un-Mark tag as DISLIKED'>–</div>").
                                          data("action", {fn : removeTagElement, type : "bad", tag : tag}));
                }
                if(settings.useTerribleTags){
                    buttons = buttons.add($j("<div class='s-button s-add-terrible' title='Mark tag as BLACKLISTED. \nTorrents with this tag will be hidden!'>!</div>").
                                          data("action", {fn : addTerribleTagElement, type : "terrible", tag : tag}));
                    buttons = buttons.add($j("<div class='s-button s-remove-terrible' title='Un-Mark tag as BLACKLISTED'>–</div>").
                                          data("action", {fn : removeTerribleTagElement, type : "terrible", tag : tag}));
                }
                if(settings.useUselessTags){
                    buttons = buttons.add($j("<div class='s-button s-add-useless' title='Mark tag as USELESS. \nThis tag will be hidden from all torrents!'>-</div>").
                                          data("action", {fn : addUselessTagElement, type : "useless", tag : tag}));
                    buttons = buttons.add($j("<div class='s-button s-remove-useless' title='Un-Mark tag as USELESS'>–</div>").
                                          data("action", {fn : removeUselessTagElement, type : "useless", tag : tag}));
                }
                $j(buttons).addClass("s-button").prependTo(tagHolder);

                // create more horizontal space by hiding "tag action" placeholder spans
                tagHolder.next().find("span:contains('\xa0\xa0\xa0')").hide();
                // staff/mods have additional "tag actions", allow for additional styling
                if (tagHolder.next().find("a").length > 2){
                    tagHolder.addClass("s-staff");
                }
            });

            $j(".s-button").on("click", function(e){
                var data = $j(this).data("action");
                data.fn(data.type, $j(this).parent(), data.tag);
            });
        };

        highlightDetailTags();

        $j(".s-useless-tags").trigger("spyder.change");
    }

    //Configuration
    function initConfig(base){
        //Init Display
        for(var name in settings){
            if(settings.hasOwnProperty(name)){
                if(name == "tags"){
                    for(var tagType in settings[name]){
                        if(settings[name].hasOwnProperty(tagType)){
                            displayTags(tagType);
                        }
                    }
                }
                else{
                    $j("input[name='"+name+"']").prop("checked", settings[name]);
                }
            }
        }

        //Init Listeners
        $j(".s-conf-tab").on("click", function(){
            var tab = $j(this);
            if(!tab.hasClass("s-selected")){
                $j(".s-conf-tab, .s-conf-page").removeClass("s-selected");
                tab.addClass("s-selected");
                $j(".s-conf-page#" + tab.data("page")).addClass("s-selected");
            }
        });

        $j(".s-conf-gen-checkbox").on("change", function(){
            var checkbox = $j(this);
            var name = checkbox.attr("name");
            var isChecked = checkbox.is(":checked");

            if(name == "autoDownvoteTags" && isChecked &&
               !confirm("Auto downvoting of tags should only be enabled if the tags you have marked as useless are tags " +
                        "you would consider to ALWAYS be inappropriate for a torrent.\nAre you sure you want to enable this feature?")){
                $j("input[name='autoDownvoteTags']").prop("checked", false);
                return;
            }

            settings[name] = isChecked;
            if(name == "useTerribleTags" && isChecked){
                $j("input[name='useBadTags']").prop("checked", true).trigger("change");
            }
            else if(name == "useBadTags" && !isChecked){
                $j("input[name='useTerribleTags']").prop("checked", false).trigger("change");
            }
        });

        $j("#s-conf-save").on("click", function(e){
            e.preventDefault();
            saveSettings();
            displayStatus("success", "Settings updated successfully");
        });

        $j("#s-conf-close").on("click", function(){
            base.remove();
        });

        $j("#s-conf-status").on("click", "#s-conf-status-close", function(){
            $j(this).parent().fadeOut("fast");
        });

        $j(".s-conf-add-btn, .s-conf-remove-btn").on("click", function(){
            var button = $j(this);
            var method = button.hasClass("s-conf-remove-btn") ? removeTags : addTags;
            var type = button.data("type");
            var input = button.prev();
            var tags = $j.grep(input.val().toLowerCase().split(" "), function(tag){return tag;});
            if(tags.length){
                method(type, tags);
                input.val("");
                displayTags(type);
                displayStatus("success", type + " tags have been updated successfully.");
            }
            else{
                displayStatus("error", "Tags not updated becuase none were provided");
            }
        });

        function displayTags(type){
            $j("#s-conf-text-" + type).val(settings.tags[type].join(" "));
        }

        function displayStatus(type, msg){
            $j("#s-conf-status").fadeOut("fast", function(){
                $j(this).removeClass().addClass("s-" + type).html(msg + " <a id='s-conf-status-close'>(×)</a>").fadeIn("fast");
            });
        }
    }

    //General Purpose Funcitons
    function addTerribleTagElement(type, holder, tag){
        holder.removeClass("s-bad");
        addTagElement(type, holder, tag);
    }
    function removeTerribleTagElement(type, holder, tag){
       removeTagElement(type, holder, tag);
        holder.addClass("s-bad");
    }
	function addLovedTagElement(type, holder, tag){
        holder.removeClass("s-good");
        addTagElement(type, holder, tag);
    }
	function removeLovedTagElement(type, holder, tag){
        removeTagElement(type, holder, tag);
        holder.addClass("s-good");
    }
    function addLoveperfTagElement(type, holder, tag){
        holder.removeClass("s-perfomer");
        addTagElement(type, holder, tag);
    }
    function removeLoveperfTagElement(type, holder, tag){
        removeTagElement(type, holder, tag);
        holder.addClass("s-perfomer");
    }

    function addUselessTagElement(type, holder, tag){
        holder.parent().detach().appendTo($j(".s-useless-tags"));
        $j(".s-useless-tags").trigger("spyder.change");



        addTagElement(type, holder, tag);
    }
    function removeUselessTagElement(type, holder, tag){
        holder.parent().detach().insertBefore($j(".s-useless-desc"));
        $j(".s-useless-tags").trigger("spyder.change");
        //undo auto-downvote if removing from useless tag list



        removeTagElement(type, holder, tag);
    }
    function addTagElement(type, holder, tag){
        holder.addClass("s-" + type);
        addTags(type, tag);
    }
    function removeTagElement(type, holder, tag){
        holder.removeClass("s-good s-loved s-performer s-loveperf s-newperf s-bad s-terrible s-useless");
        removeTags(type, tag);
    }
    function addTags(type, tags){
        settings = getSettings();
        var tagArray = settings.tags[type];
        var tmp = getEquivalentTags(tags);
        for(var i=0; i<tmp.length; i++){
            var tag = tmp[i];
            if(tag.length > 0){
                var idx = tagArray.indexOf(tag);
                if (idx < 0){
                    tagArray.push(tag);
                }
            }
        }
        saveTags(type, tagArray);
    }
    function removeTags(type, tags){
        settings = getSettings();
        var tagArray = settings.tags[type];
        var tmp = getEquivalentTags(tags);
        for(var i=0; i<tmp.length; i++){
            var tag = tmp[i];
            if(tag.length > 0){
                var idx = tagArray.indexOf(tag);
                if (idx >= 0){
                    tagArray.splice(idx, 1);
                }
            }
        }
        saveTags(type, tagArray);
    }
    function isTag(allTags, tag){
        if(allTags.indexOf(tag) >= 0){
            return true;
        }
        else if(allTags.indexOf(tag.replace(".", "")) >= 0){
            return true;
        }
        else{
            return false;
        }
    }
    function getValue(name, def){

        return GM_getValue(name, def);


    }
    function setValue(name, value){

        GM_setValue(name, value);


    }
    function saveTags(name, tagArray){
        var tmp = $j.grep(tagArray, function(tag){return tag;});
        tmp.sort();
        settings.tags[name] = tmp;
        saveSettings();
    }
    function getSettings(){
        return JSON.parse(getValue("spyderSettings", "{}"));
    }
    function saveSettings(){
        setValue("spyderSettings", JSON.stringify(settings));
    }
    function getEquivalentTags(tagArray){
        if(typeof tagArray == "string"){
            tagArray = tagArray.split(" ");
        }
        var allTags = [];
        for(var i = 0, length = tagArray.length; i < length; i++){
            var tag = tagArray[i];
            if(/\./g.test(tag)){
                allTags.push(tag.replace(".", ""));
            }
            allTags.push(tag);
        }
        return allTags;
    }
    function capitaliseFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

if(typeof jQuery == "undefined"){
    addJQuery(runScript);
}
else{
    runScript();
}

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}
