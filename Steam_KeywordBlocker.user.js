// ==UserScript==
// @name         Steam_KeywordBlocker
// @version      2020.3.5
// @description  关键词屏蔽
// @author       CYTMWIA
// @match        http*://store.steampowered.com/
// @match        http*://store.steampowered.com/labs/trendingreviews/*
// @run-at       document-body
// ==/UserScript==

(function() {
    'use strict';

    //屏蔽关键词 keyword
    let BLACKLIST = ['PUBG社区管理','绝地求生','FREE SKINS'];

    function containWordInList(s,lst=BLACKLIST){
        for (let i=0;i<lst.length;i+=1){
            if (s.indexOf(lst[i])!=-1){
                return true
            }
        }
        return false
    }

    if (window.location.pathname=='/') {
        let interval_id = setInterval(()=>{
            let apps = document.getElementsByClassName('community_recommendation_app')
            if (apps.length>0){
                clearInterval(interval_id)

                let thumbs = document.getElementsByClassName('carousel_thumbs')[3]
                let focus = true
                for (let idx=apps.length-1;idx>=0;idx-=1){
                    if (containWordInList(apps[idx].parentElement.innerHTML)){
                        let rmele = apps[idx].parentElement
                        if (rmele.className=='focus') {
                            focus=false
                        }
                        rmele.remove()
                        thumbs.children[idx].remove()
                    }
                }
                if (!focus&&apps.length>0) {
                    apps[0].parentElement.className = 'focus'
                    thumbs.children[0].className = 'focus'
                }
            }

        },500);
    } else if (window.location.pathname.includes('/labs/trendingreviews')) {
        setInterval(()=>{
            let apps = document.getElementById('reviewed_apps').children
            for (let idx=apps.length-1;idx>=0;idx-=1) {
                if (containWordInList(apps[idx].innerHTML)) {
                    apps[idx].remove()
                }
            }
        },500)
    }
})();