// ==UserScript==
// @name         Steam_KeywordBlocker
// @version      2020.3.6.3
// @description  关键词屏蔽
// @author       CYTMWIA
// @match        http*://store.steampowered.com/*
// @match        http*://steamcommunity.com/*
// @run-at       document-body
// ==/UserScript==

(function() {
    'use strict';

    //屏蔽关键词 keyword
    let BLACKLIST = ['PUBG社区管理',/绝地求生.*?限时领取/,'FREE SKINS',/懂.*?懂.*?身体.*?删.*?除/]

    function containWordInList(s,lst=BLACKLIST){
        let text = s.replace(/\n/g, '')
        for (let i=0;i<lst.length;i+=1) {
            if (lst[i] instanceof RegExp) {
                if (lst[i].test(text))
                    return true
            } else {
                if (text.indexOf(lst[i])!=-1) 
                    return true
            }
        }
        return false
    }

    function setIntervalKiller(func,timeout,self_clear=false) {
        let interval_id = setInterval(()=>{
            if (func()&&self_clear) {
                clearInterval(interval_id)
            }
        },timeout)
        return interval_id
    }

    function removeElementsByBlacklist(eles) {
        let count = 0
        for (let idx=eles.length-1;idx>=0;idx-=1) {
            if (containWordInList(eles[idx].innerHTML)) {
                eles[idx].remove()
                count += 1
            }
        }
        return count
    }

    if (/store\.steampowered\.com\/?$/.test(window.location)) {
        // exmple: https://store.steampowered.com/
        setIntervalKiller(()=>{
            let apps = document.getElementsByClassName('community_recommendation_app')
            if (apps.length>0){
                let thumbs = document.getElementsByClassName('carousel_thumbs')[3]
                let focus = true
                for (let idx=apps.length-1;idx>=0;idx-=1){
                    if (containWordInList(apps[idx].parentElement.innerHTML)){
                        let rmele = apps[idx].parentElement
                        if (rmele.className==='focus') {
                            focus=false
                        }
                        rmele.remove()
                        thumbs.children[idx].remove()
                    }
                }
                if (!focus&&apps.length>0) {
                    document.getElementsByClassName('arrow right')[3].click()
                }

                return true
            }

        },500,true);
    } else if (/store\.steampowered\.com\/labs\/trendingreviews/.test(window.location)) {
        // exmple: https://store.steampowered.com/labs/trendingreviews/
        setIntervalKiller(()=>{
            let apps = document.getElementById('reviewed_apps').children
            removeElementsByBlacklist(apps)
        },500)
    } else if (/store\.steampowered\.com\/app/.test(window.location)) {
        // exmple: https://store.steampowered.com/app/440
        setIntervalKiller(()=>{
            let reviews = document.getElementsByClassName('review_box')
            if (removeElementsByBlacklist(reviews)>0)
                return true
        },500,true)
    } else if (/steamcommunity\.com/.test(window.location)) {
        // exmple: https://steamcommunity.com/app/440
        // exmple: https://steamcommunity.com/app/440/reviews/
        // exmple: https://steamcommunity.com/
        // exmple: https://steamcommunity.com/?subsection=reviews
        setIntervalKiller(()=>{
            let cards = document.getElementsByClassName('apphub_Card')
            removeElementsByBlacklist(cards)
        },500)
    }
})();